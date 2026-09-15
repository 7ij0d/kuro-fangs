---
name: kuro-fangs-studio
description: >-
  Complete architecture, component standards, data pipelines, and maintenance guide
  for the Kuro Fangs educational dentistry platform and high-performance interactive sheet studio.
---

# Kuro Fangs Platform & Studio Skill

This skill documents the full architectural blueprint of the Kuro Fangs web application (`https://kurofangs.id.ly`).

---

## 1. System Architecture & Directory Layout

```text
kuro-fangs/
├── css/
│   ├── main.css              # Core typography, dark/light themes, reset
│   ├── components.css        # Navbar, buttons, search bars, modals
│   └── responsive.css        # Mobile breakpoints, bottom nav, drawer
├── js/
│   ├── app.js                # Router, hash navigation, global lifecycle
│   ├── data.js               # DataService: instant local cache boot + sync
│   ├── i18n.js               # Dual Arabic/English localization engine
│   ├── pages/
│   │   ├── home.js           # Hero, quick search, featured subjects
│   │   ├── subjects.js       # Subjects catalogue & year filters
│   │   ├── sheet-detail.js   # Single sheet detail & study studio trigger
│   │   ├── admin.js          # Admin dashboard, PDF upload, analytics
│   │   └── ...
│   └── components/
│       ├── document-viewer.js # High-DPI Interactive Studio (Panzoom, Canvas, PDF)
│       └── toast.js          # Instant floating notifications
└── data/
    ├── sheets.json           # Academic sheets metadata catalog
    ├── subjects.json         # Dentistry modules metadata
    └── doctors.json          # Academic staff records
```

---

## 2. Core Data Pipeline & IndexedDB PDF Storage

### Instant Boot (<30ms)
To prevent white screen stalls:
1. `DataService.init()` loads pre-bundled cache synchronously.
2. Background fetch syncs with `data/*.json` without blocking DOM mount.

### Binary PDF Handling (`IndexedDB`)
Uploaded PDF documents are indexed locally into IndexedDB (`kf_pdf_store`) using blob URLs:
```javascript
const blobUrl = await window.DATA.pdfStore.getPdfUrl(sheetId);
```
This enables offline study and high-resolution rendering without cloud hosting bills.

---

## 3. Interactive Document Studio Engine (`document-viewer.js`)

The studio operates with 4 hardware-accelerated rendering layers per sheet:
1. **Background Canvas / PDF Page:** Rendered via PDF.js with `scale = 2.0` (High-DPI retina sharpness).
2. **TextLayer:** Invisible selectable DOM spans allowing native text highlight, search, and copy.
3. **Annotation Canvas Overlay (`.canvas-overlay`):** Smooth handwriting (pen, marker) and partial object erasure.
4. **Draft Canvas (`.draft-canvas`):** Zero-latency straight-line drafting with ruler snapping.
5. **Viewport Laser Layer (`#jnotes-laser-canvas`):** Viewport-level 680ms glowing neon comet trail.

---

## 4. Key Developer Invariants

1. **Zero Layout Shift:** Always focus text overlays with `{ preventScroll: true }` and enforce `viewport.scrollTop = 0; window.scrollTo(0, 0);`.
2. **Focal-Point Zoom Formula:**
   $$\text{panX}_{new} = F_x - (F_x - \text{panX}) \times \frac{\text{newZoom}}{\text{zoomLevel}}$$
3. **No Hardcoded Sheets:** Never reintroduce demo mocks (e.g. `sh-fixed-provisional`) into production catalogs.
