import { memo, useCallback, useEffect, useRef, useState } from "react";
import Panzoom from "@panzoom/panzoom";
import { assetPath } from "../../lib/utils.js";
import { boundedOutputScale, pdfPageAspectRatio } from "../document/coordinateTransforms.js";
import { WORKSPACE_RENDER } from "../config.js";
import { PdfRenderQueue, pdfRenderGenerationIsCurrent } from "./pdfRenderQueue.js";
import { loadPdfLibrary } from "./pdfJsAdapter.js";
import { catalogCanvasPixelBudget } from "./renderBudget.js";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const A4_PAGE_WIDTH = 595;
export const A4_PAGE_RATIO = 297 / 210;
export const A4_PAGE_GAP = 40;
export const MAX_A4_CANVAS_PIXELS = WORKSPACE_RENDER.maximumCatalogCanvasPixels;
export const MAX_A4_CANVAS_EDGE = WORKSPACE_RENDER.maximumCatalogCanvasEdge;

const CANVAS_EVICTION_MS = WORKSPACE_RENDER.catalogCanvasEvictionMs;
const DISTANT_CANVAS_EVICTION_MS = WORKSPACE_RENDER.catalogDistantCanvasEvictionMs;
const SLOW_LOAD_NOTICE_MS = 15_000;

export function a4RenderQualityScale(renderZoom, devicePixelRatio = 1, pageAspectRatio = A4_PAGE_RATIO, maximumPixels = MAX_A4_CANVAS_PIXELS) {
  const pageHeight = A4_PAGE_WIDTH * pdfPageAspectRatio(1, pageAspectRatio);
  const budgetScale = boundedOutputScale(A4_PAGE_WIDTH, pageHeight, devicePixelRatio, renderZoom, maximumPixels);
  const limitedScale = Math.min(budgetScale, MAX_A4_CANVAS_EDGE / A4_PAGE_WIDTH, MAX_A4_CANVAS_EDGE / pageHeight);
  return Math.max(1, Math.round(limitedScale * 8) / 8);
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
  pageCount: externalPageCount,
  visiblePageStart = 1,
  visiblePageCount,
  zoom, 
  onZoomChange,
  stageRef,
  documentRootRef,
  onPageCount,
  onDocumentReady,
  onCurrentPageChange,
  renderPageOverlay,
  onPdfPageRendered,
  activeTool = "hand"
}) {
  const surfaceRef = useRef(null);
  const cameraRef = useRef(null);
  const panzoomRef = useRef(null);
  const activeToolRef = useRef(activeTool);
  activeToolRef.current = activeTool;
  const fitScaleRef = useRef(1);
  const naturalWRef = useRef(A4_PAGE_WIDTH);
  const naturalHRef = useRef(A4_PAGE_WIDTH * A4_PAGE_RATIO);
  const renderScaleTimerRef = useRef(null);

  const [pageGeometry, setPageGeometry] = useState({
    width: A4_PAGE_WIDTH,
    height: Math.round(A4_PAGE_WIDTH * A4_PAGE_RATIO)
  });
  const [renderScale, setRenderScale] = useState(1);
  const [primaryPage, setPrimaryPage] = useState(visiblePageStart);
  const [pageCount, setPageCount] = useState(0);
  const [documentProxy, setDocumentProxy] = useState(null);
  const [pdfError, setPdfError] = useState('');
  const [status, setStatus] = useState('');
  const [loadStalled, setLoadStalled] = useState(false);
  
  const [failedPages, setFailedPages] = useState(() => new Set());
  const [renderRevision, setRenderRevision] = useState(0);
  const [loadRevision, setLoadRevision] = useState(0);

  const renderControllerRef = useRef({ suspended: false, generation: 0, scrolling: false });
  const renderQueueRef = useRef(null);
  if (!renderQueueRef.current) renderQueueRef.current = new PdfRenderQueue({ concurrency: 1 });

  const goToPage = useCallback((pageNum) => {
    if (pageNum < 1 || pageNum > pageCount) return;
    setPrimaryPage(pageNum);
    if (onCurrentPageChange) onCurrentPageChange(pageNum);
  }, [pageCount, onCurrentPageChange]);

  const applyFitAndCenter = useCallback(() => {
    const surface = surfaceRef.current;
    const pz = panzoomRef.current;
    if (!surface || !pz) return;

    const vw = surface.clientWidth;
    const vh = surface.clientHeight;
    const nw = naturalWRef.current;
    const nh = naturalHRef.current;
    if (!vw || !vh || !nw || !nh) return;

    const PADDING = 32;
    const fitScale = Math.max(0.05, Math.min((vw - PADDING) / nw, (vh - PADDING) / nh));
    fitScaleRef.current = fitScale;

    pz.setOptions({
      minScale: fitScale,
      maxScale: fitScale * 8,
      startScale: fitScale,
      startX: 0,
      startY: 0
    });

    pz.zoom(fitScale, { animate: false });
    pz.reset({ animate: false });
    setRenderScale(fitScale);
  }, []);

  useEffect(() => {
    if (!cameraRef.current || !surfaceRef.current) return;
    const surface = surfaceRef.current;
    const camera = cameraRef.current;

    const pz = Panzoom(camera, {
      maxScale: 8,
      minScale: 0.1,
      startScale: 1,
      startX: 0,
      startY: 0,
      cursor: 'default',
      touchAction: 'none',
      excludeClass: 'panzoom-exclude',
      setTransform: (elem, { scale, x, y }) => {
        const vw = surface.clientWidth || window.innerWidth;
        const vh = surface.clientHeight || window.innerHeight;
        const nw = naturalWRef.current || A4_PAGE_WIDTH;
        const nh = naturalHRef.current || (A4_PAGE_WIDTH * A4_PAGE_RATIO);
        const sw = nw * scale;
        const sh = nh * scale;

        let clampedX = x;
        let clampedY = y;

        if (scale <= fitScaleRef.current * 1.02) {
          clampedX = 0;
          clampedY = 0;
        } else {
          const maxPanX = Math.max(0, (sw - vw) / 2 + (vw / 2 - 60)) / scale;
          const maxPanY = Math.max(0, (sh - vh) / 2 + (vh / 2 - 60)) / scale;
          clampedX = Math.max(-maxPanX, Math.min(maxPanX, x));
          clampedY = Math.max(-maxPanY, Math.min(maxPanY, y));
        }

        elem.style.transform = `scale(${scale}) translate(${clampedX}px, ${clampedY}px)`;
      },
      handleStartEvent: (e) => {
        if (activeToolRef.current !== 'hand') {
          return;
        }
        if (e.cancelable) e.preventDefault();
      }
    });

    panzoomRef.current = pz;

    const onWheel = (e) => {
      e.preventDefault();
      pz.zoomWithWheel(e);
    };

    const onChange = (e) => {
      const { scale } = e.detail;
      clearTimeout(renderScaleTimerRef.current);
      renderScaleTimerRef.current = setTimeout(() => {
        setRenderScale(scale);
        if (onZoomChange) onZoomChange(scale);
      }, 300);
    };

    const onFitPage = () => {
      applyFitAndCenter();
    };

    const onDblClick = (e) => {
      const currentScale = pz.getScale();
      if (currentScale > fitScaleRef.current * 1.25) {
        applyFitAndCenter();
      } else {
        pz.zoomToPoint(fitScaleRef.current * 2.2, e, { animate: true });
      }
    };

    surface.addEventListener('wheel', onWheel, { passive: false });
    surface.addEventListener('dblclick', onDblClick);
    surface.addEventListener('workspace:fitpage', onFitPage);
    camera.addEventListener('panzoomchange', onChange);

    return () => {
      surface.removeEventListener('wheel', onWheel);
      surface.removeEventListener('dblclick', onDblClick);
      surface.removeEventListener('workspace:fitpage', onFitPage);
      camera.removeEventListener('panzoomchange', onChange);
      pz.destroy();
      panzoomRef.current = null;
    };
  }, [applyFitAndCenter, onZoomChange]);

  useEffect(() => {
    if (!panzoomRef.current) return;
    if (activeTool !== 'hand') {
      panzoomRef.current.setOptions({ disablePan: true });
    } else {
      panzoomRef.current.setOptions({ disablePan: false });
    }
  }, [activeTool]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') {
        goToPage(primaryPage + 1);
      } else if (e.key === 'ArrowLeft') {
        goToPage(primaryPage - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPage, primaryPage]);

  const swipeTouchRef = useRef(null);

  const handleTouchStart = useCallback((e) => {
    if (activeToolRef.current !== 'hand') return;
    if (e.touches.length === 1) {
      const t = e.touches[0];
      swipeTouchRef.current = { x: t.clientX, y: t.clientY, time: Date.now() };
    } else {
      swipeTouchRef.current = null;
    }
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (!swipeTouchRef.current || activeToolRef.current !== 'hand') return;
    const start = swipeTouchRef.current;
    swipeTouchRef.current = null;

    const pz = panzoomRef.current;
    const isAtFit = !pz || pz.getScale() <= fitScaleRef.current * 1.08;
    if (!isAtFit) return;

    if (e.changedTouches.length === 1) {
      const t = e.changedTouches[0];
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      const dt = Date.now() - start.time;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4 && dt < 600) {
        if (dx < 0 && primaryPage < pageCount) {
          goToPage(primaryPage + 1);
        } else if (dx > 0 && primaryPage > 1) {
          goToPage(primaryPage - 1);
        }
      }
    }
  }, [goToPage, pageCount, primaryPage]);

  useEffect(() => {
    let cancelled = false;
    let loadingTask;
    async function load() {
      try {
        setStatus('Loading PDF…');
        setPdfError('');
        setDocumentProxy(null);
        setFailedPages(new Set());
        const pdfjs = await loadPdfLibrary();
        loadingTask = pdfjs.getDocument({ url: assetPath(pdfUrl) });
        const doc = await loadingTask.promise;
        if (cancelled) return;
        
        const totalPages = doc.numPages;
        setPageCount(totalPages);
        if (onPageCount) onPageCount(totalPages);
        
        const page1 = await doc.getPage(1);
        if (cancelled) return;
        const vp = page1.getViewport({ scale: 1 });
        naturalWRef.current = vp.width;
        naturalHRef.current = vp.height;
        setPageGeometry({ width: vp.width, height: vp.height });
        
        setDocumentProxy(doc);
        setStatus('');
        
        requestAnimationFrame(() => {
          applyFitAndCenter();
          if (onDocumentReady) onDocumentReady();
        });
      } catch (err) {
        if (cancelled) return;
        setPdfError(String(err?.message || err));
      }
    }
    load();
    return () => {
      cancelled = true;
      loadingTask?.destroy();
      renderQueueRef.current?.clear();
    };
  }, [pdfUrl, loadRevision, onPageCount, onDocumentReady]);

  useEffect(() => {
    if (documentProxy || pdfError) {
      setLoadStalled(false);
      return undefined;
    }
    const timer = window.setTimeout(() => setLoadStalled(true), SLOW_LOAD_NOTICE_MS);
    return () => window.clearTimeout(timer);
  }, [documentProxy, loadRevision, pdfError]);

  useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface) return;
    const observer = new ResizeObserver(() => {
      const pz = panzoomRef.current;
      if (!pz) return;
      const currentScale = pz.getScale();
      const isAtFit = Math.abs(currentScale - fitScaleRef.current) < 0.05;
      if (isAtFit) {
        applyFitAndCenter();
      } else {
        const vw = surface.clientWidth, vh = surface.clientHeight;
        const PADDING = 32;
        const newFit = Math.max(0.05, Math.min(
          (vw - PADDING) / naturalWRef.current,
          (vh - PADDING) / naturalHRef.current
        ));
        fitScaleRef.current = newFit;
        pz.setOptions({ minScale: newFit, maxScale: newFit * 8 });
      }
    });
    observer.observe(surface);
    return () => observer.disconnect();
  }, [applyFitAndCenter]);

  useEffect(() => {
    applyFitAndCenter();
  }, [primaryPage, applyFitAndCenter]);
  
  useEffect(() => {
    if (visiblePageStart !== primaryPage) {
        setPrimaryPage(visiblePageStart);
    }
  }, [visiblePageStart]);

  const commitPageGeometry = useCallback((pageNumber, width, height) => {
      if (width && height && (pageNumber === primaryPage || pageNumber === 1)) {
          naturalWRef.current = width;
          naturalHRef.current = height;
          setPageGeometry({ width, height });
      }
  }, [primaryPage]);

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
    setLoadRevision(r => r + 1);
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

  return (
    <div
      ref={surfaceRef}
      className="workspace-v2-a4-zoom-surface"
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#090f1e'
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {pageCount > 1 && (
        <button
          className="workspace-v2-nav-button left panzoom-exclude"
          onClick={() => goToPage(primaryPage - 1)}
          disabled={primaryPage <= 1}
          style={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 20,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '50%',
            width: 44,
            height: 44,
            display: 'grid',
            placeItems: 'center',
            cursor: primaryPage <= 1 ? 'not-allowed' : 'pointer',
            opacity: primaryPage <= 1 ? 0.2 : 0.9,
            transition: 'all 0.2s',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
          }}
          aria-label="Previous page"
        ><ChevronLeft size={24} /></button>
      )}
      {pageCount > 1 && (
        <button
          className="workspace-v2-nav-button right panzoom-exclude"
          onClick={() => goToPage(primaryPage + 1)}
          disabled={primaryPage >= pageCount}
          style={{
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 20,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '50%',
            width: 44,
            height: 44,
            display: 'grid',
            placeItems: 'center',
            cursor: primaryPage >= pageCount ? 'not-allowed' : 'pointer',
            opacity: primaryPage >= pageCount ? 0.2 : 0.9,
            transition: 'all 0.2s',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
          }}
          aria-label="Next page"
        ><ChevronRight size={24} /></button>
      )}

      <div
        ref={cameraRef}
        style={{
          width: `${pageGeometry.width}px`,
          height: `${pageGeometry.height}px`,
          position: 'relative',
          willChange: 'transform'
        }}
      >
        <div 
          ref={documentRootRef}
          className="workspace-v2-a4-live-layer" 
          style={{
            width: `${pageGeometry.width}px`,
            height: `${pageGeometry.height}px`,
            position: 'relative',
          }}
        >
          <div
            className="workspace-v2-a4-document"
            style={{
              width: `${pageGeometry.width}px`,
              height: `${pageGeometry.height}px`,
              position: 'relative',
            }}
          >
            <section
              className="workspace-v2-a4-page"
              data-pdf-page={primaryPage}
              style={{
                width: `${pageGeometry.width}px`,
                height: `${pageGeometry.height}px`,
                position: 'relative',
                background: '#ffffff',
                boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
                overflow: 'hidden'
              }}
              aria-label={`PDF page ${primaryPage} of ${pageCount}`}
            >
              {documentProxy && (
                <A4PdfCanvas
                  documentProxy={documentProxy}
                  pageNumber={primaryPage}
                  pageAspectRatio={pageGeometry.height / pageGeometry.width}
                  renderZoom={renderScale}
                  shouldRender={true}
                  evictionDelayMs={CANVAS_EVICTION_MS}
                  renderRevision={renderRevision}
                  renderController={renderControllerRef.current}
                  priority={0}
                  renderQueue={renderQueueRef.current}
                  onPageGeometry={commitPageGeometry}
                  onPageRendered={onPdfPageRendered}
                  onPageOutcome={notePageOutcome}
                />
              )}
              {renderPageOverlay?.(primaryPage)}
              
              {documentProxy && failedPages.has(primaryPage) && (
                <div className="workspace-v2-a4-status" role="alert" style={{ position: "absolute", zIndex: 30, background: "rgba(255,255,255,0.9)", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <p>Page {primaryPage} could not be drawn.</p>
                  <button type="button" onClick={() => retryPage(primaryPage)}>Retry page {primaryPage}</button>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {!documentProxy && (
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center', color:'white', background: 'rgba(9, 15, 30, 0.95)', zIndex: 10 }}>
          <p>{pdfError || (loadStalled ? 'This PDF is taking longer than usual.' : status || 'Loading...')}</p>
          {(pdfError || loadStalled) && <button type="button" onClick={retryDocument} style={{ marginTop: '12px', padding: '8px 16px', background: '#7650ed', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Retry PDF</button>}
        </div>
      )}
    </div>
  );
}
