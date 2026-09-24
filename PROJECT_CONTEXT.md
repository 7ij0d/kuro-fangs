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

## 5. Master Questions Bank Architecture (Blueprint Conformance)
- **Visual Blueprint**: `media_1790209485831.jpg` & `media_1790209635110.png`
- **Panoramic Header**:
  - Background: `assets/hero/kuro-questions-hero.png` with warm subtle ivory vignette overlay.
  - Rounded-square blush badge (`.q-hero-badge-icon-box`) with clipboard SVG (`#7E1D2A`).
  - Kicker: `PRACTICE & PAST EXAMS` / `تدريب وسنوات سابقة`.
  - Title: `Questions — Past Exams & Practice Bank` / `الأسئلة — سنوات سابقة وبنك الأسئلة`.
  - Subtitle: `All dental subjects, organized and easy to practice.` / `كل أسئلتك لطب الأسنان، منظمة وسهلة للتدريب.`.
- **Search & Filter Control Bar**:
  - Subject dropdown: `[ All Subjects ▾ ]` + 12 dental subjects.
  - Search input: `Search questions, subjects, or clinical tags...` with clear button.
  - Academic Year dropdown: `[ All Years ▾ ]` / `Year 3 (Dental Surgery)`.
  - View mode toggle: `[ ⊞ Grid ]` (burgundy active) and `[ ☰ List ]`.
- **Curriculum Section Header**:
  - Open book icon in rounded blush box (`.q-curriculum-icon-box`).
  - Title: `Dental Curriculum Subjects` / `مواد طب الأسنان`.
  - Description: `Choose a subject to browse lecture-linked MCQs and test your knowledge.`.
  - Count pill: `${filteredSubjects.length} Subjects` (`12 Subjects` / `12 مادة`).
- **Subject Cards (`.q-subject-card`)**:
  - **Top Row**: Subject category badge pill (`.q-card-cat-pill`, soft pastel category tint) + Course code pill (`.q-card-code-pill`, e.g. `CD-302`, `MED-301`).
  - **Middle Row**: Subject icon box (40x40px, rounded, custom dental icon) + Title (`.q-card-title`) + Real MCQ count (`.q-card-mcq-count`, e.g. `42 MCQs`).
  - **Inline Arrow on iPad & Mobile**: `.q-card-arrow-inline` right-aligned in body for compact ergonomics.
  - **Footer Action on Desktop**: `Start Practice →` (or `Browse Questions →` if 0 MCQs).
- **Multi-Device Responsiveness (Zero Horizontal Overflow)**:
  - Desktop (`>= 1200px`): **4 columns** (`repeat(4, minmax(0, 1fr))`), 3 balanced rows for 12 subjects.
  - iPad / Tablet (`768px – 1199px`): **2 columns** (`repeat(2, minmax(0, 1fr)) !important`).
  - Mobile (`< 768px`): **1 column** (`1fr !important`), stacked controls.
- **Functionality & Data Invariant**:
  - 100% preservation of real data from `window.DATA.getQuestions()` and `window.DATA.getSubjects()`.
  - Interactive quiz runner modal, explanation drawer with Kuro mascot, and Arabic translation toggle fully intact.

---

## 6. Master Academic Schedules Restructuring & Redesign (Blueprint Conformance)
- **Visual Blueprint**: `media_1790209940929.jpg`
- **Information Architecture Unification**:
  - Reorganized three previously disparate sections into ONE unified hub (`#/schedules`):
    1. **Theoretical Lectures** (`#/lecture-schedule`): Auditorium 2, Saturday to Thursday weekly timetable.
    2. **Clinical & Lab Schedule** (`#/practical-schedule`): Subgroups A1–E2, phantom head, simulation labs, and clinical rotations.
    3. **Examination Schedule** (`#/exams`): Midterm (12 subjects) & Final (3 subjects) theory timetables.
  - **Top Navigation IA**:
    - `[ Home ] [ Subjects ] [ Schedules ] [ More ▾ ]`
    - Removed "Exams" as a standalone top nav item; consolidated under Academic Schedules.
- **Hero Banner**:
  - Background: `assets/hero/academic-schedules-hero.png` with deep warm vignette overlay.
  - Blush calendar icon badge box (`.schedules-hero-badge-icon-box`).
  - Title: `Academic Schedules` / `الجداول الدراسية الأكاديمية`.
  - Subtitle: `All your academic timetables in one place.` / `كل جداولك ومواعيدك الأكاديمية في مكان واحد.`.
  - Description: `Lecture schedules, clinical & lab schedules, and examination timetables.` / `جداول المحاضرات، المعامل والعيادات، والامتحانات الرسمية.`.
- **Three Integrated Schedule Cards**:
  - **Card 1: Theoretical Lectures**:
    - Burgundy icon box (`book-open`) + Category pill: `Auditorium 2` / `مدرج 2`.
    - Summary: Weekly lecture timetable for all subjects. Saturday to Thursday.
    - Official Artwork: Kuro reading book (`assets/schedules/kuro-theory-lectures.png`).
    - CTA: `Open Schedule →` (`.cta-burgundy`).
  - **Card 2: Clinical & Lab Schedule**:
    - Emerald icon box (`flask-conical`) + Category pill: `Groups A1 - E2` / `المجموعات A1 – E2`.
    - Summary: Practical sessions, clinics and labs for all student subgroups.
    - Official Artwork: Kuro in dental clinic chair (`assets/schedules/kuro-clinical-lab.png`).
    - CTA: `Open Schedule →` (`.cta-emerald`).
  - **Card 3: Examination Schedule**:
    - Amber icon box (`file-text`) + Category pill: `Midterm & Final` / `النصفي والنهائي`.
    - Summary: Official theory examination timetables for all subjects.
    - Official Artwork: Kuro with exam clipboard (`assets/schedules/kuro-exams-board.png`).
    - CTA: `Open Schedule →` (`.cta-amber`).
- **Responsive Layout Breakpoints (Zero Horizontal Overflow)**:
  - **Desktop (>= 1200px)**: 3 columns (`repeat(3, minmax(0, 1fr))`), Kuro positioned at bottom-right (`position: absolute; bottom: 0; right: 12px; max-height: 148px;`).
  - **iPad & Tablets (768px – 1199px)**: Wide 1-column stacked list matching the middle screen of `media_1790209940929.jpg`, featuring circular arrow button (`.sched-circle-arrow`) and right-aligned Kuro artwork.
  - **Mobile (< 768px)**: 1-column vertical compact stack with touch targets >= 44px, summary line clamp, bottom-right artwork, and zero horizontal overflow (`overflow-x: clip`).
- **Data & Feature Invariant**:
  - 100% preservation of all 10 student subgroups (A1 to E2) with automatic `localStorage` persistence.
  - Live day countdown calculation for midterm and final exams.
  - Printable PDF export styling maintained.
  - Sub-schedule pages include prominent `.schedules-top-back-bar` (`← Back to Academic Schedules` / `الرجوع للجداول الدراسية`).

---

## 7. Master Audio Recordings Library Architecture (Blueprint Conformance)
- **Visual Blueprint**: `media_1790210375688.jpg` & `media_1790210419688.jpg`
- **Panoramic Header**:
  - Background: `assets/hero/audio-recordings-hero.png` (Kuro with headphones studying at desk with laptop in warm morning light) with dark warm vignette overlay.
  - Rounded-square blush badge with headphones SVG (`.audio-hero-badge-icon-box`).
  - Title: `Audio Recordings` / `التسجيلات الصوتية`.
  - Subtitle: `Faculty lecture audio recordings linked to lecture sheets.` / `تسجيلات صوتية لمحاضرات دكاترة الكلية مرتبطة بالشيتات.`.
- **Search & Filter Control Bar**:
  - Subject dropdown: `[ 📖 All Subjects ▾ ]` + 12 dental curriculum subjects.
  - Search input: `Search recordings, sheets, or topics...` with clear button.
  - Lecturer dropdown: `[ 👤 All Lecturers ▾ ]` dynamically populated from available sheets & recordings.
  - Sort dropdown: `[ ⇅ Newest First ▾ ]` (`Newest First`, `Oldest First`, `Title (A-Z)`).
  - View mode toggle: `[ ⊞ Grid ]` (burgundy active) and `[ ☰ List ]`.
- **Page Section Header**:
  - Burgundy headphones icon box.
  - Title: `Lecture Audio Recordings` / `تسجيلات المحاضرات الصوتية`.
  - Subtitle: `Listen to faculty lectures linked to their respective lecture sheets.`.
  - Total count badge: `${count} Recordings` / `${count} تسجيلات`.
- **Audio Recording Card Anatomy (`.audio-card`)**:
  - **Top Row**: Pastel subject badge pill (`.audio-subject-pill`) + Order pill (`#1`, `#2`) + 3-dot menu button.
  - **Body Row**: Custom dental subject icon box (44x44px rounded, colored background & Lucide icon) + bold lecture title + lecturer with user icon (`Dr. د. آمال كشلاف`).
  - **Waveform Row**: Play button (`[ ▶ ]` 36px circular button in burgundy `#7E1D2A`) + realistic audio waveform visualization (bars matching subject accent color) + duration (`58:24`).
  - **Metadata Row**: Recording date with calendar icon (`📅 23 Sep 2026`) + linked sheet pill (`🔗 Sheet 1`).
  - **Action Buttons**: Two full-width touch-friendly buttons side by side:
    - `[ ▶ Listen ]` (burgundy fill `#7E1D2A`, toggles playback).
    - `[ 📄 View Sheet ]` (warm ivory outline, opens linked PDF sheet viewer at `#/sheet-detail?id=...`).
- **Recordings Without Audio (Unavailable State — Blueprint Rule 9)**:
  - Clean, subtle, muted aesthetic communicating: `No recording available yet` / `لا يوجد تسجيل صوتي متاح حالياً`.
  - Muted disabled button: `[ 🔇 Not Available ]` + ACTIVE `[ 📄 View Sheet ]` to allow studying the PDF sheet directly.
  - Zero invented recordings or audio files.
- **Strict Anti-AI-Slop & Quality Directives**:
  - **Zero "Verified" / "معتمد" badges** anywhere on the page.
- **Multi-Device Responsiveness (Zero Horizontal Overflow)**:
  - **Desktop (>= 1200px)**: 3-column grid (`repeat(3, minmax(0, 1fr))`).
  - **iPad & Tablets (768px – 1199px)**: 2-column or 1-column layout (`repeat(2, minmax(0, 1fr))`), single top navbar, zero sidebar ("فالايباد لا يوجد شريط جانبي بل انه نفس اللابتوب كله فوق").
  - **Mobile (< 768px)**: 1-column vertical compact stack (`1fr !important`), touch targets >= 44px, strictly no horizontal scrolling.

---

## 8. Recent Git Commits & State Log
- `Current`: Audio Recordings page master redesign matching blueprint (`media_1790210375688.jpg` & `media_1790210419688.jpg`) with panoramic hero banner, filter bar, audio cards with waveforms, sheet linking, unavailable state handling, and version bump to `?v=9.7`.
- `7d016c9`: Master restructuring & redesign of Academic Schedules (`#/schedules`) matching blueprint (`media_1790209940929.jpg`) with 3 integrated Kuro cards, responsive desktop/iPad/mobile views, back navigation, and cache busting bump to `?v=9.6`.
- `92e4382`: Questions Bank master redesign matching blueprint (`media_1790209485831.jpg`) with 4-column desktop grid, 2-column iPad grid, 1-column mobile stack, ivory cards, and version bump to `?v=9.5`.
- `73ed2c3`: Synchronize top center navigation pills with master visual reference.
- `7c3695d`: Sheets & Lectures master redesign matching blueprint (`media_1790204779370.jpg`) with panoramic hero (`assets/hero/sheets-hero-study.png`), 2-column card split, full action buttons, and version bump to `?v=9.4`.
- `e76315e`: Add master PROJECT_CONTEXT.md for persistent session state & memory.
- `5261c9c`: Unified Academic Schedules section with panoramic hero banner, 3-card hub, and 4-item navigation IA.
- `773c3c3`: Cache busting query versions bumped to `?v=9.2`.
- `332f072`: Responsive overhaul for shell, sheets page, and questions practice bank.
