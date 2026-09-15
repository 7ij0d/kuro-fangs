---
name: pdf-annotation-export
description: >-
  High-performance client-side PDF export, raster flattening, vector merging with PDF-lib and jsPDF,
  and exporting annotated sheets with embedded handwriting, text boxes, and highlights.
---

# PDF Annotation Export & Flattening Skill

This skill provides production patterns for flattening client-side canvas annotations (pen strokes, translucent highlighters, borderless text boxes) directly into downloadable PDF files with zero server cost.

---

## 1. Export Architecture & Approaches

### Approach A: Canvas Raster Layer Merge with `pdf-lib` (Recommended)
This approach loads the original PDF via `pdf-lib`, renders the user's canvas annotations onto an offscreen canvas at high DPI, encodes to PNG, and embeds the overlay onto each respective PDF page.

```javascript
import { PDFDocument } from 'pdf-lib';

async function exportAnnotatedPdf(originalPdfBytes, pageAnnotations, totalPages) {
  const pdfDoc = await PDFDocument.load(originalPdfBytes);
  const pages = pdfDoc.getPages();

  for (let i = 0; i < pages.length; i++) {
    const pageNum = i + 1;
    const page = pages[i];
    const { width, height } = page.getSize();

    // 1. Get annotations for this page
    const strokes = pageAnnotations.strokes[pageNum] || [];
    const texts = (pageAnnotations.texts || []).filter(t => t.page === pageNum);

    if (strokes.length === 0 && texts.length === 0) continue;

    // 2. Render to offscreen canvas at 2x resolution
    const scale = 2.0;
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);

    // 3. Draw strokes (pen & highlighter)
    strokes.forEach(st => drawStrokeToContext(ctx, st, width, height));

    // 4. Draw text notes
    texts.forEach(t => drawTextToContext(ctx, t, width, height));

    // 5. Convert canvas to PNG blob and embed in PDF
    const pngDataUrl = canvas.toDataURL('image/png');
    const pngImage = await pdfDoc.embedPng(pngDataUrl);

    page.drawImage(pngImage, {
      x: 0,
      y: 0,
      width: width,
      height: height,
    });
  }

  const mergedPdfBytes = await pdfDoc.save();
  return mergedPdfBytes;
}
```

---

## 2. Drawing Context Helpers

### Rendering Translucent Highlighter and Pen Strokes
```javascript
function drawStrokeToContext(ctx, st, pageWidth, pageHeight) {
  if (!st.points || st.points.length < 2) return;

  ctx.save();
  ctx.strokeStyle = st.color;
  ctx.lineWidth = st.strokeWidth;
  ctx.lineCap = (st.tool === 'highlighter') ? 'square' : 'round';
  ctx.lineJoin = (st.tool === 'highlighter') ? 'bevel' : 'round';
  ctx.globalAlpha = st.opacity || 1.0;

  if (st.tool === 'highlighter') {
    ctx.globalCompositeOperation = 'multiply';
  }

  ctx.beginPath();
  ctx.moveTo(st.points[0].x, st.points[0].y);
  for (let i = 1; i < st.points.length; i++) {
    ctx.lineTo(st.points[i].x, st.points[i].y);
  }
  ctx.stroke();
  ctx.restore();
}
```

### Rendering Typographic Text Boxes
```javascript
function drawTextToContext(ctx, t, pageWidth, pageHeight) {
  ctx.save();
  ctx.fillStyle = t.color || '#0F172A';
  ctx.font = '500 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textBaseline = 'top';

  const lines = (t.text || '').split('\n');
  const x = parseFloat(t.left);
  let y = parseFloat(t.top);

  lines.forEach(line => {
    ctx.fillText(line, x, y);
    y += 22;
  });
  ctx.restore();
}
```

---

## 3. Instant Trigger & Download

```javascript
function downloadBlob(bytes, filename) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}
```
