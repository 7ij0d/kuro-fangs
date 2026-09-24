# Kuro Fangs Platform — Project Context & Current State
> **This document serves as the master persistent memory for Kuro Fangs.**
> When opening a new chat session, read this file first to instantly restore 100% context and memory.

---

## 1. Project Overview & Identity
- **Repository**: `https://github.com/7ij0d/kuro-fangs`
- **Working Directory**: `C:\Users\Taha\.gemini\antigravity\scratch\kuro-fangs`
- **Active Branch**: `main`
- **Domain**: `https://kurofangs.id.ly/`
- **Target Audience**: 3rd Year Dental Students (Faculty of Dentistry, University of Tripoli / Batch 33).
- **Core Aesthetic**: Cozy Academic Study Workspace.
  - **Primary Colors**: Deep Burgundy (`#7E1D2A`), Warm Cream / Ivory (`#FAF7F2` / `#F8F5EE`), Espresso Typography (`#24181B`), Muted Warm Taupe (`#8A7B78`).
  - **Atmosphere**: Warm sunlight, botanical leaf motif (`assets/icons/leaf-branch.svg`), soft shadows, double-border elevation.
  - **Strict Anti-AI-Slop Rules**: No monotonous dark blue/cyan blobs, no oversized 20px+ control radii, no washing out text with excessive glassmorphism.

---

## 2. Key User Rules & Linguistic Preferences
1. **Questions & Sheet Names (Strictly English Names)**:
   - Question text and options are in **English** by default.
   - Clinical explanations remain in **Arabic with preserved English dental terminology**.
   - Questions have an optional translation button (`Translate Question` / `ترجمة السؤال`) to display Arabic translation independently without hiding the English text.
   - Sheet names are strictly displayed in **English** across the app.
2. **Hero Image Banners**:
   - Home Hero: High-fidelity artwork of Kuro studying at the desk with coffee mug, laptop, and the framed photo of the Faculty of Dentistry on the wall (`assets/hero/kuro-study-hero.png`).
   - Schedules Hero: Panoramic artwork for Academic Schedules (`assets/hero/academic-schedules-hero.png`).
   - Questions Hero: Questions practice artwork (`assets/hero/kuro-questions-hero.png`).
   - **Sheets & Lectures Hero**: Panoramic study scene with warm morning sunlight, library books, and tooth anatomy poster (`assets/hero/sheets-hero-study.png`).
   - Must load with **0ms latency** without blank flashes.

---

## 3. Master Sheets & Lectures Architecture (Blueprint Conformance)
- **Visual Blueprint**: `media_1790204779370.jpg`
- **Panoramic Header**:
  - Background: `assets/hero/sheets-hero-study.png` with warm vignette overlay.
  - Rounded-square blush badge with clipboard/document SVG (`.shb-badge-wrap`).
  - Title: `Sheets & Lectures` / `المحاضرات والملازم الدراسية`.
  - Subtitle: `All your dental study materials in one place.` / `كل ملازمك ومحاضراتك لطب الأسنان في مكان واحد.`.
- **Search & Filter Control Bar**:
  - Full-text search input: `Search sheets, lecturers, or topics...`.
  - Subject dropdown (`All Subjects` + 12 dental subjects).
  - Academic Year dropdown (`All Years`, `Year 3`).
  - Sort dropdown (`Newest First`, `Oldest First`, `Title (A-Z)`).
  - Sheet count badge (`#sheets-count-label`).
  - View mode toggle (`Grid` vs `List`).
- **Card Architecture (Internal 2-Column Split)**:
  - **Left Column**: Vertical A4 PDF 1st-page thumbnail (`aspect-ratio: 1 / 1.38`), rendered via PDF.js with `PdfThumbnailService` and memory/sessionStorage caching.
  - **Right Column**: Metadata stack:
    - Row 1: Subject badge pill (soft semantic subject token) + Order pill (`#1`, `#2`) + Menu button `•••`.
    - Row 2: Academic sheet title (`.sgc-title`) with 2-line clamp.
    - Row 3: Lecturer with user icon (`Dr. د. آمال الكلاف`).
    - Row 4: Specifications (`23 pages · 1.7 MB`).
    - Row 5: Upload date with calendar icon (`23 Sep 2026`).
  - **Bottom Full-Width Row**:
    - `[ 👁 Open Sheet ]`: Burgundy filled button (`#7E1D2A`) with eye icon.
    - `[ 📥 Download Sheet ]`: Warm ivory outline button with download tray icon.
- **Strict Anti-AI-Slop & Cleanup**:
  - **Zero "Verified" / "معتمد" badges** anywhere on the page.
- **Multi-Device Responsiveness (Zero Horizontal Overflow)**:
  - Desktop (`>= 1200px`): 3 columns (`repeat(3, minmax(0, 1fr))`).
  - iPad / Tablet (`768px – 1199px`): 2 columns (`repeat(2, minmax(0, 1fr))`).
  - Mobile (`< 768px`): 1 column (`minmax(0, 1fr)`), compact hero, stacked filter bar with secondary view toggle.

---

## 4. Responsive Navigation Architecture
- **Desktop & iPad**: Top center navigation with 4-Pill Modern Academic IA:
  - `[ Home ] [ Subjects ] [ Schedules ] [ More ▾ ]`
  - More dropdown contains: Question Bank, Audio Recordings, Mascot Hub, Games, Admin Portal, Profile.
- **Mobile (< 768px)**:
  - Compact header (56px) with brand identity, search, notifications, profile.
  - Mobile hamburger toggle opens academic drawer with quick settings (AR/EN, Dark/Light, Sound FX).
  - Bottom navigation bar eliminated (`display: none !important`).

---

## 5. Recent Git Commits & State Log
- `Current`: Sheets & Lectures master redesign matching blueprint (`media_1790204779370.jpg`) with panoramic hero (`assets/hero/sheets-hero-study.png`), 2-column card split, full action buttons, and version bump to `?v=9.4`.
- `e76315e`: Add master PROJECT_CONTEXT.md for persistent session state & memory.
- `5261c9c`: Unified Academic Schedules section with panoramic hero banner, 3-card hub, and 4-item navigation IA.
- `773c3c3`: Cache busting query versions bumped to `?v=9.2`.
- `332f072`: Responsive overhaul for shell, sheets page, and questions practice bank.
- `8fe9ece`: Mobile & iPad study workspace overhaul with fixed bottom nav & more sheet.
- `cc0bbf0`: Embed & cache kuro study hero banner for instant zero-latency loading.
- `a1beff4`: Cozy academic study scene homepage redesign matching mockup.
- `a0043ad`: Fix notifications panel right viewport overflow & subject card modal click.
- `76e487d`: Default questions and sheet names to English with translation toggle.
