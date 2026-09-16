import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { assetPath } from "../../lib/utils.js";
import { boundedOutputScale, pdfPageAspectRatio } from "../document/coordinateTransforms.js";
import { WORKSPACE_RENDER } from "../config.js";
import { PdfRenderQueue, pdfRenderGenerationIsCurrent } from "./pdfRenderQueue.js";
import { loadPdfLibrary } from "./pdfJsAdapter.js";
import { catalogCanvasPixelBudget } from "./renderBudget.js";
import { visiblePdfPages } from "./visiblePdfPages.js";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const A4_PAGE_WIDTH = 595;
export const A4_PAGE_RATIO = 297 / 210;
export const A4_PAGE_GAP = 40;
export const MAX_A4_CANVAS_PIXELS = WORKSPACE_RENDER.maximumCatalogCanvasPixels;
export const MAX_A4_CANVAS_EDGE = WORKSPACE_RENDER.maximumCatalogCanvasEdge;

const A4_RENDER_OVERSCAN_PAGES = 1;
const RENDER_SCALE_SETTLE_MS = WORKSPACE_RENDER.renderScaleSettleMs;
const SCROLL_SETTLE_MS = WORKSPACE_RENDER.scrollSettleMs;
const CANVAS_EVICTION_MS = WORKSPACE_RENDER.catalogCanvasEvictionMs;
const DISTANT_CANVAS_EVICTION_MS = WORKSPACE_RENDER.catalogDistantCanvasEvictionMs;
const SLOW_LOAD_NOTICE_MS = 15_000;

export function a4RenderQualityScale(renderZoom, devicePixelRatio = 1, pageAspectRatio = A4_PAGE_RATIO, maximumPixels = MAX_A4_CANVAS_PIXELS) {
  const pageHeight = A4_PAGE_WIDTH * pdfPageAspectRatio(1, pageAspectRatio);
  const budgetScale = boundedOutputScale(A4_PAGE_WIDTH, pageHeight, devicePixelRatio, renderZoom, maximumPixels);
  const limitedScale = Math.min(budgetScale, MAX_A4_CANVAS_EDGE / A4_PAGE_WIDTH, MAX_A4_CANVAS_EDGE / pageHeight);
  return Math.max(1, Math.round(limitedScale * 8) / 8);
}

const GEOMETRY_MEASURE_CONCURRENCY = 8;

async function measureEveryPage(documentProxy, isCancelled) {
  const total = documentProxy.numPages;
  const geometry = new Map();
  let nextPage = 1;
  async function measure() {
    while (nextPage <= total) {
      const pageNumber = nextPage;
      nextPage += 1;
      if (isCancelled()) return;
      const page = await documentProxy.getPage(pageNumber);
      if (isCancelled()) return;
      const viewport = page.getViewport({ scale: 1 });
      geometry.set(pageNumber, { width: viewport.width, height: viewport.height });
    }
  }
  const workers = Math.max(1, Math.min(GEOMETRY_MEASURE_CONCURRENCY, total));
  await Promise.all(Array.from({ length: workers }, measure));
  return geometry;
}

const A4PdfCanvas = memo(
function A4PdfCanvas({ documentProxy, pageNumber, pageAspectRatio, renderZoom, shouldRender, evictionDelayMs = CANVAS_EVICTION_MS, renderRevision, renderController, priority, renderQueue, onPageGeometry, onPageRendered, onPageOutcome }) {
  const canvasRefs = useRef([null, null]);
  const visibleCanvasRef = useRef(0);
  const renderedRef = useRef({ documentProxy: null, qualityScale: 0 });
  const evictionTimerRef = useRef(null);
  const retiredCanvasRafRef = useRef(null);
  const maximumPixels = catalogCanvasPixelBudget(window.visualViewport?.width || window.innerWidth, window.matchMedia?.("(pointer: coarse)").matches);
  const qualityScale = a4RenderQualityScale(renderZoom, window.devicePixelRatio, pageAspectRatio, maximumPixels);

  useEffect(() => {
    const queueKey = `page:${pageNumber}`;
    if (evictionTimerRef.current) {
      window.clearTimeout(evictionTimerRef.current);
      evictionTimerRef.current = null;
    }
    if (renderController.suspended) return undefined;
    if (!documentProxy || !shouldRender) {
      renderQueue.cancel(queueKey);
      if (!shouldRender && renderedRef.current.documentProxy) {
        evictionTimerRef.current = window.setTimeout(() => {
          evictionTimerRef.current = null;
          if (renderController.suspended) return;
          for (const canvas of canvasRefs.current) {
            if (!canvas) continue;
            canvas.width = 0;
            canvas.height = 0;
          }
          renderedRef.current = { documentProxy: null, qualityScale: 0 };
        }, evictionDelayMs);
      }
      return undefined;
    }
    if (renderedRef.current.documentProxy === documentProxy
      && renderedRef.current.qualityScale >= qualityScale
      && canvasRefs.current[visibleCanvasRef.current]?.width > 0) return undefined;

    if (retiredCanvasRafRef.current !== null) {
      cancelAnimationFrame(retiredCanvasRafRef.current);
      retiredCanvasRafRef.current = null;
    }

    const renderGeneration = renderController.generation;
    const cancelQueuedRender = renderQueue.enqueue({
      key: queueKey,
      priority,
      run: async ({ isCancelled, registerCancel }) => {
        let renderTask;
        let cancelScheduledContinuation = null;
        let backCanvasIndex = null;
        const renderStarted = window.performance.now();
        try {
          const pdfPage = await documentProxy.getPage(pageNumber);
          if (!pdfRenderGenerationIsCurrent(renderController, renderGeneration, isCancelled())) return;
          const rawViewport = pdfPage.getViewport({ scale: 1 });
          onPageGeometry?.(pageNumber, rawViewport.width, rawViewport.height);
          const pdfScale = (A4_PAGE_WIDTH / rawViewport.width) * qualityScale;
          const viewport = pdfPage.getViewport({ scale: pdfScale });
          const nextCanvasIndex = visibleCanvasRef.current === 0 ? 1 : 0;
          backCanvasIndex = nextCanvasIndex;
          const nextCanvas = canvasRefs.current[nextCanvasIndex];
          const previousCanvas = canvasRefs.current[visibleCanvasRef.current];
          if (!nextCanvas || !previousCanvas) return;
          nextCanvas.width = Math.ceil(viewport.width);
          nextCanvas.height = Math.ceil(viewport.height);
          const nextContext = nextCanvas.getContext("2d", { alpha: false });
          if (!nextContext || isCancelled()) return;
          renderTask = pdfPage.render({ canvasContext: nextContext, viewport });
          renderTask.onContinue = (continueRendering) => {
            if (!pdfRenderGenerationIsCurrent(renderController, renderGeneration, isCancelled())) {
              renderTask?.cancel();
              return;
            }
            cancelScheduledContinuation?.();
            const resume = () => {
              cancelScheduledContinuation = null;
              if (!pdfRenderGenerationIsCurrent(renderController, renderGeneration, isCancelled())) {
                renderTask?.cancel();
                return;
              }
              continueRendering();
            };
            if (renderController.scrolling) {
              const timeoutId = window.setTimeout(resume, 32);
              cancelScheduledContinuation = () => window.clearTimeout(timeoutId);
            } else {
              const frameId = requestAnimationFrame(resume);
              cancelScheduledContinuation = () => cancelAnimationFrame(frameId);
            }
          };
          registerCancel(() => {
            cancelScheduledContinuation?.();
            cancelScheduledContinuation = null;
            renderTask?.cancel();
          });
          await renderTask.promise;
          if (!pdfRenderGenerationIsCurrent(renderController, renderGeneration, isCancelled())) return;

          nextCanvas.style.zIndex = "2";
          nextCanvas.classList.add("is-visible");
          previousCanvas.classList.remove("is-visible");
          previousCanvas.style.zIndex = "1";
          nextCanvas.style.zIndex = "1";
          visibleCanvasRef.current = nextCanvasIndex;
          renderedRef.current = { documentProxy, qualityScale };

          retiredCanvasRafRef.current = requestAnimationFrame(() => {
            retiredCanvasRafRef.current = requestAnimationFrame(() => {
              retiredCanvasRafRef.current = null;
              if (visibleCanvasRef.current === nextCanvasIndex) {
                previousCanvas.width = 0;
                previousCanvas.height = 0;
              }
            });
          });
          onPageRendered?.(window.performance.now() - renderStarted);
          onPageOutcome?.(pageNumber, false);
        } catch (error) {
          if (!isCancelled() && error?.name !== "RenderingCancelledException") {
            console.error("Could not render PDF page", error);
            onPageOutcome?.(pageNumber, true);
          }
        } finally {
          cancelScheduledContinuation?.();
          cancelScheduledContinuation = null;
          if (backCanvasIndex !== null && visibleCanvasRef.current !== backCanvasIndex) {
            const abandonedCanvas = canvasRefs.current[backCanvasIndex];
            if (abandonedCanvas) {
              abandonedCanvas.width = 0;
              abandonedCanvas.height = 0;
            }
          }
        }
      }
    });

    return cancelQueuedRender;
  }, [documentProxy, evictionDelayMs, onPageGeometry, onPageOutcome, onPageRendered, pageNumber, priority, qualityScale, renderController, renderQueue, renderRevision, shouldRender]);

  useEffect(() => () => {
    renderQueue.cancel(`page:${pageNumber}`);
    if (evictionTimerRef.current) window.clearTimeout(evictionTimerRef.current);
    if (retiredCanvasRafRef.current !== null) cancelAnimationFrame(retiredCanvasRafRef.current);
  }, [pageNumber, renderQueue]);

  return <>
    <canvas ref={(canvas) => { canvasRefs.current[0] = canvas; }} className="workspace-v2-a4-canvas is-visible" width={0} height={0} aria-label={`PDF page ${pageNumber}`} />
    <canvas ref={(canvas) => { canvasRefs.current[1] = canvas; }} className="workspace-v2-a4-canvas" width={0} height={0} aria-hidden="true" />
  </>;
});

export function ContinuousA4Pdf({
  pdfUrl,
  pageCount,
  visiblePageStart = 1,
  visiblePageCount = pageCount,
  zoom,
  stageRef,
  documentRootRef,
  onPageCount,
  onDocumentReady,
  onCurrentPageChange,
  renderPageOverlay,
  onPdfPageRendered
}) {
  const [documentProxy, setDocumentProxy] = useState(null);
  const [status, setStatus] = useState("Loading PDF…");
  const [pdfError, setPdfError] = useState("");
  const [loadRevision, setLoadRevision] = useState(0);
  const [loadStalled, setLoadStalled] = useState(false);
  const [failedPages, setFailedPages] = useState(() => new Set());
  const [primaryPage, setPrimaryPage] = useState(visiblePageStart);
  const [renderScale, setRenderScale] = useState(zoom);
  const [renderRevision, setRenderRevision] = useState(0);
  const [defaultPageAspectRatio, setDefaultPageAspectRatio] = useState(A4_PAGE_RATIO);
  const [pageAspectRatios, setPageAspectRatios] = useState(() => new Map());
  const pageGeometryReady = pageAspectRatios.size > 0 || Boolean(pdfError);
  
  const [stageViewport, setStageViewport] = useState(() => ({
    width: Math.max(1, stageRef.current?.clientWidth || window.innerWidth),
    height: Math.max(1, stageRef.current?.clientHeight || window.innerHeight)
  }));
  
  const pageElementsRef = useRef(new Map());
  const pendingPageGeometryRef = useRef(new Map());
  const primaryPageRef = useRef(primaryPage);
  const renderScaleRef = useRef(zoom);
  const renderTimerRef = useRef(null);
  const renderResumeRafRef = useRef(null);
  const scrollTimerRef = useRef(null);
  const scrollingRef = useRef(false);
  const suspensionRef = useRef({ activity: false, pinch: false, scroll: false, zoom: false });
  const renderControllerRef = useRef({ suspended: false, generation: 0, scrolling: false });
  const renderQueueRef = useRef(null);
  if (!renderQueueRef.current) renderQueueRef.current = new PdfRenderQueue({ concurrency: 1 });

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const publishSize = () => {
      const width = Math.max(1, stage.clientWidth);
      const height = Math.max(1, stage.clientHeight);
      setStageViewport((current) => current.width === width && current.height === height ? current : { width, height });
    };
    publishSize();
    const observer = new window.ResizeObserver(publishSize);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [stageRef]);

  const notePageOutcome = useCallback((pageNumber, failed) => {
    setFailedPages((current) => {
      if (failed === current.has(pageNumber)) return current;
      const next = new Set(current);
      if (failed) next.add(pageNumber);
      else next.delete(pageNumber);
      return next;
    });
  }, []);

  const retryDocument = useCallback(() => {
    setFailedPages(new Set());
    setLoadStalled(false);
    setLoadRevision((revision) => revision + 1);
  }, []);

  const retryPage = useCallback((pageNumber) => {
    setFailedPages((current) => {
      if (!current.has(pageNumber)) return current;
      const next = new Set(current);
      next.delete(pageNumber);
      return next;
    });
    setRenderRevision((revision) => revision + 1);
  }, []);

  const applyPageGeometry = useCallback((pageNumber, width, height) => {
    const ratio = pdfPageAspectRatio(width, height);
    if (pageNumber === 1) setDefaultPageAspectRatio((current) => Math.abs(current - ratio) < .0001 ? current : ratio);
    setPageAspectRatios((current) => {
      if (Math.abs((current.get(pageNumber) || 0) - ratio) < .0001) return current;
      const next = new Map(current);
      next.set(pageNumber, ratio);
      return next;
    });
  }, []);

  const applyMeasuredGeometry = useCallback((geometry) => {
    const first = geometry.get(1);
    if (first) setDefaultPageAspectRatio(pdfPageAspectRatio(first.width, first.height));
    setPageAspectRatios(() => {
      const next = new Map();
      geometry.forEach(({ width, height }, pageNumber) => {
        next.set(pageNumber, pdfPageAspectRatio(width, height));
      });
      return next;
    });
  }, []);

  const commitPageGeometry = useCallback((pageNumber, width, height) => {
    if (renderControllerRef.current.suspended) {
      pendingPageGeometryRef.current.set(pageNumber, { width, height });
      return;
    }
    applyPageGeometry(pageNumber, width, height);
  }, [applyPageGeometry]);

  const flushPageGeometry = useCallback(() => {
    if (!pendingPageGeometryRef.current.size) return;
    const entries = [...pendingPageGeometryRef.current.entries()];
    pendingPageGeometryRef.current.clear();
    entries.forEach(([pageNumber, geometry]) => applyPageGeometry(pageNumber, geometry.width, geometry.height));
  }, [applyPageGeometry]);

  const commitPrimaryPage = useCallback((nextPage) => {
    if (!Number.isFinite(nextPage) || nextPage < 1 || nextPage > pageCount || primaryPageRef.current === nextPage) return;
    primaryPageRef.current = nextPage;
    setPrimaryPage(nextPage);
    onCurrentPageChange(nextPage);
  }, [onCurrentPageChange, pageCount]);
  
  useEffect(() => {
    if (visiblePageStart !== primaryPageRef.current) {
      commitPrimaryPage(visiblePageStart);
    }
  }, [visiblePageStart, commitPrimaryPage]);

  const setRenderSuspension = useCallback((reason, value, { renderOnResume = true } = {}) => {
    if (suspensionRef.current[reason] === value) return;
    suspensionRef.current[reason] = value;
    const controller = renderControllerRef.current;
    const next = Object.values(suspensionRef.current).some(Boolean);
    if (controller.suspended === next) return;
    controller.suspended = next;
    if (next) {
      controller.generation += 1;
      renderQueueRef.current?.clear();
      if (renderResumeRafRef.current !== null) cancelAnimationFrame(renderResumeRafRef.current);
      renderResumeRafRef.current = null;
      return;
    }
    renderResumeRafRef.current = requestAnimationFrame(() => {
      renderResumeRafRef.current = null;
      if (renderControllerRef.current.suspended) return;
      flushPageGeometry();
      if (renderOnResume) setRenderRevision((revision) => revision + 1);
    });
  }, [flushPageGeometry]);

  useEffect(() => {
    if (Math.abs(renderScaleRef.current - zoom) < .001) {
      setRenderSuspension("zoom", false);
      return undefined;
    }
    let disposed = false;
    setRenderSuspension("zoom", true);
    function commitRenderScale() {
      if (disposed) return;
      const documentRoot = documentRootRef.current;
      if (documentRoot?.classList.contains("is-live-pinching") || documentRoot?.classList.contains("is-zoom-settling")) {
        renderTimerRef.current = window.setTimeout(commitRenderScale, 60);
        return;
      }
      renderScaleRef.current = zoom;
      setRenderSuspension("zoom", false);
      setRenderScale(zoom);
      renderTimerRef.current = null;
    }
    if (renderTimerRef.current) window.clearTimeout(renderTimerRef.current);
    renderTimerRef.current = window.setTimeout(commitRenderScale, RENDER_SCALE_SETTLE_MS);
    return () => {
      disposed = true;
      if (renderTimerRef.current) window.clearTimeout(renderTimerRef.current);
      renderTimerRef.current = null;
    };
  }, [documentRootRef, setRenderSuspension, zoom]);

  useEffect(() => () => {
    if (renderResumeRafRef.current !== null) cancelAnimationFrame(renderResumeRafRef.current);
  }, []);

  useEffect(() => () => renderQueueRef.current?.clear(), []);

  useEffect(() => {
    const root = documentRootRef.current;
    if (!root) return undefined;
    const suspendRendering = () => setRenderSuspension("pinch", true);
    const resumeRendering = () => setRenderSuspension("pinch", false);
    root.addEventListener("workspace:livezoomstart", suspendRendering);
    root.addEventListener("workspace:livezoomcancel", resumeRendering);
    root.addEventListener("workspace:livezoomcommit", resumeRendering);
    return () => {
      root.removeEventListener("workspace:livezoomstart", suspendRendering);
      root.removeEventListener("workspace:livezoomcancel", resumeRendering);
      root.removeEventListener("workspace:livezoomcommit", resumeRendering);
    };
  }, [documentRootRef, setRenderSuspension]);

  useEffect(() => {
    let cancelled = false;
    let loadingTask;
    async function load() {
      try {
        setStatus("Loading PDF…");
        setPdfError("");
        setDocumentProxy(null);
        setFailedPages(new Set());
        setDefaultPageAspectRatio(A4_PAGE_RATIO);
        setPageAspectRatios(new Map());
        const pdfjs = await loadPdfLibrary();
        loadingTask = pdfjs.getDocument({ url: assetPath(pdfUrl) });
        const nextDocument = await loadingTask.promise;
        if (cancelled) return;
        const geometry = await measureEveryPage(nextDocument, () => cancelled);
        if (cancelled) return;
        applyMeasuredGeometry(geometry);
        setDocumentProxy(nextDocument);
        onPageCount(nextDocument.numPages);
        setStatus("");
      } catch (error) {
        if (!cancelled) {
          const message = error.message || "This PDF could not be displayed.";
          setPdfError(message);
          setStatus(message);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
      renderQueueRef.current?.clear();
      loadingTask?.destroy();
    };
  }, [applyMeasuredGeometry, loadRevision, onPageCount, pdfUrl]);

  useEffect(() => {
    if (documentProxy || pdfError) {
      setLoadStalled(false);
      return undefined;
    }
    const timer = window.setTimeout(() => setLoadStalled(true), SLOW_LOAD_NOTICE_MS);
    return () => window.clearTimeout(timer);
  }, [documentProxy, loadRevision, pdfError]);

  useEffect(() => {
    if (!documentProxy || !onDocumentReady) return undefined;
    const frame = window.requestAnimationFrame(onDocumentReady);
    return () => window.cancelAnimationFrame(frame);
  }, [documentProxy, onDocumentReady]);

  // Handle Swipe & Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        commitPrimaryPage(primaryPageRef.current - 1);
      } else if (e.key === "ArrowRight") {
        commitPrimaryPage(primaryPageRef.current + 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commitPrimaryPage]);

  const transformRef = useRef(null);
  const touchStateRef = useRef({
    startX: 0, startY: 0, currentX: 0, currentY: 0, activeFingers: 0, isZoomedIn: false, panX: 0, panY: 0, basePanX: 0, basePanY: 0, zooming: false
  });
  const [panState, setPanState] = useState({ x: 0, y: 0 });

  useEffect(() => {
    touchStateRef.current.basePanX = panState.x;
    touchStateRef.current.basePanY = panState.y;
    touchStateRef.current.panX = panState.x;
    touchStateRef.current.panY = panState.y;
  }, [panState]);

  const handleTouchStart = (e) => {
    const touches = e.touches;
    touchStateRef.current.activeFingers = touches.length;
    
    if (touches.length >= 2) {
      touchStateRef.current.zooming = true;
      return;
    }

    if (touches.length === 1) {
      touchStateRef.current.zooming = false;
      const currentRatio = pageAspectRatios.get(primaryPage) || defaultPageAspectRatio;
      
      const fitWidth = (window.innerWidth - 80) / A4_PAGE_WIDTH;
      const fitHeight = (window.innerHeight - 132) / (A4_PAGE_WIDTH * currentRatio);
      const fitZoom = Math.min(fitWidth, fitHeight);
      
      touchStateRef.current.isZoomedIn = zoom > fitZoom * 1.05;

      touchStateRef.current.startX = touches[0].clientX;
      touchStateRef.current.startY = touches[0].clientY;
      touchStateRef.current.currentX = touches[0].clientX;
      touchStateRef.current.currentY = touches[0].clientY;
      
      if (transformRef.current) {
        transformRef.current.style.transition = "none";
      }
    }
  };

  const handleTouchMove = (e) => {
    const touches = e.touches;
    if (touches.length !== 1 || touchStateRef.current.zooming) return;
    
    touchStateRef.current.currentX = touches[0].clientX;
    touchStateRef.current.currentY = touches[0].clientY;
    
    if (touchStateRef.current.isZoomedIn) {
      const dx = touchStateRef.current.currentX - touchStateRef.current.startX;
      const dy = touchStateRef.current.currentY - touchStateRef.current.startY;
      
      const newPanX = touchStateRef.current.basePanX + dx;
      const newPanY = touchStateRef.current.basePanY + dy;
      
      touchStateRef.current.panX = newPanX;
      touchStateRef.current.panY = newPanY;
      
      if (transformRef.current) {
        transformRef.current.style.transform = `translate(${newPanX}px, ${newPanY}px) scale(${zoom})`;
      }
      
      // Stop native swipe navigation on some browsers
      if (e.cancelable) e.preventDefault();
    }
  };

  const handleTouchEnd = (e) => {
    if (touchStateRef.current.activeFingers === 1 && e.touches.length === 0 && !touchStateRef.current.zooming) {
      const dx = touchStateRef.current.currentX - touchStateRef.current.startX;
      const dy = touchStateRef.current.currentY - touchStateRef.current.startY;
      
      if (touchStateRef.current.isZoomedIn) {
        setPanState({ x: touchStateRef.current.panX, y: touchStateRef.current.panY });
      } else {
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
          if (dx < 0) {
            commitPrimaryPage(primaryPage + 1);
          } else {
            commitPrimaryPage(primaryPage - 1);
          }
        }
      }
      
      if (transformRef.current) {
        transformRef.current.style.transition = "transform 0.3s ease-out";
      }
    }
    touchStateRef.current.activeFingers = e.touches.length;
    if (e.touches.length === 0) {
      touchStateRef.current.zooming = false;
    }
  };

  const pages = useMemo(() => (
    pageGeometryReady ? visiblePdfPages(pageCount, 1, pageCount) : []
  ), [pageCount, pageGeometryReady]);

  const pagesToRender = useMemo(() => {
    const next = new Set();
    for (let offset = -A4_RENDER_OVERSCAN_PAGES; offset <= A4_RENDER_OVERSCAN_PAGES; offset += 1) {
      const pageNumber = primaryPage + offset;
      if (pageNumber >= 1 && pageNumber <= pageCount) next.add(pageNumber);
    }
    return next;
  }, [primaryPage, pageCount]);

  const scaledDocumentWidth = A4_PAGE_WIDTH * zoom;
  const currentRatio = pageAspectRatios.get(primaryPage) || defaultPageAspectRatio;
  const scaledDocumentHeight = A4_PAGE_WIDTH * currentRatio * zoom;

  const surfaceStyle = {
    "--workspace-a4-zoom": zoom,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    touchAction: touchStateRef.current?.isZoomedIn ? "none" : "pan-y pinch-zoom"
  };

  const liveLayerStyle = {
    width: `${scaledDocumentWidth}px`,
    height: `${scaledDocumentHeight}px`,
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };

  const documentStyle = {
    "--workspace-a4-zoom": zoom,
    "--workspace-a4-page-gap": `${A4_PAGE_GAP}px`,
    transform: `translate(${panState.x}px, ${panState.y}px) scale(${zoom})`,
    display: "flex",
    transition: "transform 0.3s ease-out",
    transformOrigin: "center center"
  };

  return (
    <div className="workspace-v2-a4-zoom-surface" style={surfaceStyle} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      <button 
        className="workspace-v2-nav-button left" 
        onClick={() => commitPrimaryPage(primaryPage - 1)} 
        disabled={primaryPage <= 1}
        style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: "20px", zIndex: 10, background: "rgba(0,0,0,0.5)", color: "white", border: "none", borderRadius: "50%", width: "40px", height: "40px", display: "grid", placeItems: "center", cursor: "pointer", opacity: primaryPage <= 1 ? 0.3 : 1 }}
      >
        <ChevronLeft size={24} />
      </button>

      <div ref={documentRootRef} className="workspace-v2-a4-live-layer" style={liveLayerStyle} aria-busy={Boolean(status)}>
        <div ref={transformRef} className="workspace-v2-a4-document" style={documentStyle}>
        {pages.map((pageNumber) => {
          const isVisible = pagesToRender.has(pageNumber);
          if (!isVisible) return null;
          
          return (
            <section
              key={pageNumber}
              ref={(element) => { if (element) pageElementsRef.current.set(pageNumber, element); else pageElementsRef.current.delete(pageNumber); }}
              className="workspace-v2-a4-page"
              data-pdf-page={pageNumber}
              style={{
                width: `${A4_PAGE_WIDTH}px`,
                height: `${A4_PAGE_WIDTH * (pageAspectRatios.get(pageNumber) || defaultPageAspectRatio)}px`,
                position: "absolute",
                left: 0,
                top: 0,
                opacity: pageNumber === primaryPage ? 1 : 0,
                pointerEvents: pageNumber === primaryPage ? "auto" : "none",
                transition: "opacity 0.2s ease-in-out",
                backgroundColor: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
              aria-label={`PDF page ${pageNumber} of ${pageCount}`}
            >
              <A4PdfCanvas
                documentProxy={documentProxy}
                pageNumber={pageNumber}
                pageAspectRatio={pageAspectRatios.get(pageNumber) || defaultPageAspectRatio}
                renderZoom={renderScale}
                shouldRender={isVisible}
                evictionDelayMs={Math.abs(pageNumber - primaryPage) > 1 ? DISTANT_CANVAS_EVICTION_MS : CANVAS_EVICTION_MS}
                renderRevision={isVisible ? renderRevision : 0}
                renderController={renderControllerRef.current}
                priority={pageNumber === primaryPage ? 0 : Math.abs(pageNumber - primaryPage)}
                renderQueue={renderQueueRef.current}
                onPageGeometry={commitPageGeometry}
                onPageRendered={onPdfPageRendered}
                onPageOutcome={notePageOutcome}
              />
              {isVisible && renderPageOverlay(pageNumber)}
              {documentProxy && failedPages.has(pageNumber) && <div className="workspace-v2-a4-status" role="alert">
                <p>Page {pageNumber} could not be drawn.</p>
                <button type="button" onClick={() => retryPage(pageNumber)}>Retry page {pageNumber}</button>
              </div>}
            </section>
          );
        })}
        </div>
      </div>
      
      <button 
        className="workspace-v2-nav-button right" 
        onClick={() => commitPrimaryPage(primaryPage + 1)} 
        disabled={primaryPage >= pageCount}
        style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", right: "20px", zIndex: 10, background: "rgba(0,0,0,0.5)", color: "white", border: "none", borderRadius: "50%", width: "40px", height: "40px", display: "grid", placeItems: "center", cursor: "pointer", opacity: primaryPage >= pageCount ? 0.3 : 1 }}
      >
        <ChevronRight size={24} />
      </button>

      {!documentProxy && <div className="workspace-v2-a4-status" role={pdfError ? "alert" : "status"} style={{ position: "absolute", bottom: "auto", height: `${stageViewport.height}px` }}>
        <p>{pdfError || (loadStalled ? "This PDF is taking longer than usual." : status)}</p>
        {(pdfError || loadStalled) && <button type="button" onClick={retryDocument}>Retry PDF</button>}
      </div>}
    </div>
  );
}
