---
name: high-perf-pdf-renderer
description: >-
  Virtualized multi-page PDF.js DOM recycling, offscreen canvas rendering,
  memory management for 100+ page documents, and selectable text layer alignment.
---

# High-Performance PDF.js Virtualization Skill

This skill documents techniques for rendering massive academic PDFs (100–300+ slides) without crashing mobile browsers (Safari 384MB canvas memory limit) or causing dropped frames.

---

## 1. The Mobile Canvas Memory Problem

On iOS Mobile Safari and Android WebView, total HTML5 canvas memory is strictly capped (~256MB–384MB). If a 100-page PDF renders 100 canvases at 2.0x Retina scale simultaneously ($1600 \times 2200 \times 4\text{ bytes} \approx 14\text{MB}$ per page), the browser tab runs out of memory and crashes (white screen reload).

### The Solution: Virtualized Viewport Rendering
Only render the active page, plus 1 page above and 1 page below (window size: 3 pages). Pages outside the window are represented by lightweight placeholder `div` elements with fixed aspect ratio dimensions.

```javascript
class VirtualPdfScroller {
  constructor(container, totalPages, pageDimensions) {
    this.container = container;
    this.totalPages = totalPages;
    this.pageDimensions = pageDimensions; // { width, height }
    this.renderedPages = new Set();
    this.buffer = 1; // 1 page above & below
  }

  updateVisiblePages(currentPage, renderCallback, cleanupCallback) {
    const minPage = Math.max(1, currentPage - this.buffer);
    const maxPage = Math.min(this.totalPages, currentPage + this.buffer);

    // Unrender distant pages to free canvas backing-store memory
    this.renderedPages.forEach((p) => {
      if (p < minPage || p > maxPage) {
        cleanupCallback(p);
        this.renderedPages.delete(p);
      }
    });

    // Render pages entering the active window
    for (let p = minPage; p <= maxPage; p++) {
      if (!this.renderedPages.has(p)) {
        renderCallback(p);
        this.renderedPages.add(p);
      }
    }
  }
}
```

---

## 2. Canvas Memory Cleanup

To properly free GPU memory in V8 and WebKit:
```javascript
function destroyCanvas(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = 0;
  canvas.height = 0;
  canvas.remove();
}
```

---

## 3. High-DPI TextLayer Precision Alignment

To ensure selectable PDF text spans align 1:1 with the underlying rendered PDF canvas:

```javascript
async function renderPageTextLayer(pdfPage, containerDiv, viewport) {
  containerDiv.innerHTML = '';
  const textContent = await pdfPage.getTextContent();
  
  if (window.pdfjsLib && typeof window.pdfjsLib.renderTextLayer === 'function') {
    await window.pdfjsLib.renderTextLayer({
      textContentSource: textContent,
      container: containerDiv,
      viewport: viewport,
      textDivs: []
    }).promise;
  }
}
```

### CSS Requirements for TextLayer
```css
.textLayer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  opacity: 0.25;
  line-height: 1.0;
  pointer-events: auto;
}
.textLayer span {
  color: transparent;
  position: absolute;
  white-space: pre;
  cursor: text;
  transform-origin: 0% 0%;
}
.textLayer ::selection {
  background: rgba(2, 132, 199, 0.4);
  color: transparent;
}
```
