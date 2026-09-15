---
name: canvas-annotation-physics
description: >-
  Provides mathematical foundations, physics engines, and production-tested patterns
  for high-performance canvas annotations, Panzoom focal-point invariant zoom,
  two-finger pinch mechanics, neon glowing laser trails, and zero-shift inline text overlays.
---

# Canvas Annotation & Camera Physics Skill

This skill documents the production-tested algorithms, mathematical derivations, and implementation patterns for interactive document studios, digital paper apps (GoodNotes, Notability, Apple Notes), and vector/raster canvas tools.

---

## 1. Focal-Point Invariant Zoom & Pan Physics

### The Mathematical Problem
When a user zooms in on a specific paragraph, image, or word (via mouse wheel at `(clientX, clientY)` or via two-finger pinch midpoint):
The exact point on the document underneath the cursor/fingers **must remain stationary on the screen** throughout the zoom gesture.

If a naive zoom algorithm simply scales around `(0, 0)` or the center of the viewport, the target point flies away, causing user disorientation (teleportation bug).

### The Invariant Formula (Panzoom & Leaflet Standard)
Let:
- $(F_x, F_y)$: Focal point in viewport screen coordinates (`clientX - vpRect.left`, `clientY - vpRect.top`).
- $s_{old}$: Current scale / zoom level (`zoomLevel`).
- $s_{new}$: Target scale / zoom level (`newZoom`), clamped to $[s_{min}, s_{max}]$.
- $(panX_{old}, panY_{old})$: Current translation before zoom.

The unscaled point on the document plane directly under the focal point is:
$$P_x = \frac{F_x - panX_{old}}{s_{old}}, \quad P_y = \frac{F_y - panY_{old}}{s_{old}}$$

To keep $(P_x, P_y)$ at the exact same screen position $(F_x, F_y)$ after changing scale to $s_{new}$:
$$F_x = panX_{new} + P_x \times s_{new} \implies panX_{new} = F_x - P_x \times s_{new}$$
$$F_y = panY_{new} + P_y \times s_{new} \implies panY_{new} = F_y - P_y \times s_{new}$$

Substituting $P_x$ and $P_y$:
$$panX_{new} = F_x - (F_x - panX_{old}) \times \frac{s_{new}}{s_{old}}$$
$$panY_{new} = F_y - (F_y - panY_{old}) \times \frac{s_{new}}{s_{old}}$$

### JavaScript Implementation
```javascript
function zoomAtPoint(targetZoom, clientX, clientY, smooth = false) {
  const vp = document.getElementById('viewport');
  if (!vp) return;
  const rect = vp.getBoundingClientRect();
  const focalX = clientX - rect.left;
  const focalY = clientY - rect.top;

  const newZoom = Math.max(minZoom, Math.min(maxZoom, targetZoom));
  if (Math.abs(newZoom - zoomLevel) < 0.0005) return;

  const ratio = newZoom / zoomLevel;
  panX = focalX - (focalX - panX) * ratio;
  panY = focalY - (focalY - panY) * ratio;
  zoomLevel = newZoom;

  clampViewport(false);
  updateTransform(smooth);
}
```

---

## 2. Two-Finger Pinch-to-Zoom (Zero Jitter)

### Critical Rules
1. **Never apply rigid boundary clamping during active pinch!** Clamping `panX`/`panY` mid-gesture causes coordinate mismatch with the initial touch anchors, creating violent jitter/oscillation.
2. **Store initial touch distance and locked document anchor:**
```javascript
// onTouchStart:
const midX = (t1.clientX + t2.clientX) / 2 - vRect.left;
const midY = (t1.clientY + t2.clientY) / 2 - vRect.top;
focalDocX = (midX - panX) / zoomLevel;
focalDocY = (midY - panY) / zoomLevel;

// onTouchMove:
const currMidX = (t1.clientX + t2.clientX) / 2 - vRect.left;
const currMidY = (t1.clientY + t2.clientY) / 2 - vRect.top;
const ratio = currDist / Math.max(10, startPinchDist);
const newZoom = Math.max(minZoom, Math.min(maxZoom, startPinchZoom * ratio));

panX = currMidX - focalDocX * newZoom;
panY = currMidY - focalDocY * newZoom;
zoomLevel = newZoom;
updateTransform(false);

// onTouchEnd:
// Soft settle only after fingers lift
settleViewport();
```

---

## 3. Ephemeral High-DPI Neon Laser Pointer Engine

### Architecture
- **Single Viewport Overlay Canvas:** Do not split laser canvases across individual document pages. A single `<canvas class="jnotes-laser-canvas">` inside `#jnotes-viewport` with `position: absolute; inset: 0; pointer-events: none; z-index: 50;` covers all pages and margins seamlessly.
- **DPR Scaling:**
```javascript
const dpr = window.devicePixelRatio || 1;
canvas.width = Math.round(vp.clientWidth * dpr);
canvas.height = Math.round(vp.clientHeight * dpr);
ctx.scale(dpr, dpr);
```
- **Dual-Layer Neon Glow Aesthetics:**
  1. *Outer Halo:* `shadowBlur = 18-22`, `shadowColor = '#FF003C'`, `strokeStyle = '#FF1744'`, `lineWidth = 10 * progress`.
  2. *Hot White Core:* `shadowBlur = 0`, `strokeStyle = '#FFFFFF'`, `lineWidth = 4 * progress`.
  3. *Head Dot:* Outer circle ($r = 8\text{px}$, glow blur 22px) + Inner circle ($r = 3.5\text{px}$, `#FFFFFF`).
- **Decay Curve:** $680\text{ms}$ with non-linear alpha taper `alpha = Math.pow(1 - age / 680, 1.25)`.
- **Zero Storage:** Never push laser points into saved strokes or `localStorage`.

---

## 4. Zero-Shift Borderless Inline Typography

### Eliminating Layout Shift
When an editable element (`contentEditable`) is focused inside a CSS-transformed container:
1. Mobile browsers trigger synthetic scrolling on ancestor containers or `window`.
2. To neutralize this:
   - Call `box.focus({ preventScroll: true })`.
   - Immediately force `viewport.scrollTop = 0; viewport.scrollLeft = 0; window.scrollTo(0, 0);`.
   - Attach an active scroll lock listener on viewport:
   ```javascript
   viewport.addEventListener('scroll', () => {
     if (viewport.scrollTop !== 0 || viewport.scrollLeft !== 0) {
       viewport.scrollTop = 0;
       viewport.scrollLeft = 0;
     }
   });
   ```

### Borderless Styling ("نص بدون مربع")
```css
.jnotes-text-box {
  position: absolute;
  z-index: 10;
  min-width: 24px;
  min-height: 24px;
  padding: 0 !important;
  margin: 0 !important;
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  outline: none !important;
  font-family: inherit;
  font-size: 1.1rem;
  line-height: 1.4;
  cursor: text;
  caret-color: var(--j-accent, #0284C7);
  white-space: pre-wrap;
  word-break: break-word;
}
```
