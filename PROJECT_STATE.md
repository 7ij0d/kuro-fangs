# PROJECT_STATE.md — KURO FANGS Educational Platform

## 1. Project Overview & Tech Stack
- **Platform**: KURO FANGS (`https://kurofangs.id.ly/`) — High-end bilingual (Arabic RTL / English LTR) dental education platform, Personal Study Library, GoodNotes-grade PDF Annotation Studio (`Kuro Notes`), Audio Lecture Sync, Question Bank, Study Rooms, and Academic Schedules.
- **Tech Stack**: Vanilla ES6+ SPA (`js/router.js`, `js/app.js`), HTML5 + CSS Custom Properties, PDF.js v3.11.174 + Puppeteer headless Chrome testing pipeline, `pdf-lib` v1.17.1 vector document assembler, IndexedDB local storage (`KF_PersonalLibrary_v1`), Cloudflare R2 + Supabase Auth/Realtime.
- **Workflow Architecture**: `Previous Years Questions → Subject Selection (Oral Pathology) → Sheet Selection (7 Core Sheets) → Interactive Questions & Quiz Runner → Verify from Sheet (Kuro Notes Split View)`.

---

## 2. Done & Verified

### A. Dedicated Essay Corner: "ركن الأسئلة المقالية — شوف الحل" (`v35.4`)
- **Delivered Files in `C:\Users\Taha\Desktop\تست باثو`**:
  1. `ركن_الاسئلة_المقالية_مع_الحل_النموذجي.pdf` (5.19 MB):
     - Isolated collection of all **208 pure essay/written questions** from past faculty exams.
     - Covers definitions (Define), enumerations (Enumerate/List), etiology (Causes of), clinical manifestations, radiographic signs, and clinical diagnostic scenarios.
     - Each card presents the question prompt, followed immediately by the **"شوف الحل / الحل النموذجي المعتمد"** box with structured points and exact sheet/page references.
  2. `ركن_الاسئلة_المقالية_تفاعلي_شوف_الحل.html` (Interactive Web App):
     - Interactive toggle button: **`[👁️ شوف الحل (Model Answer)]`** on each question card to reveal/hide the solution smoothly.
     - Instant search, "إظهار جميع الحلول" toggle button, and responsive mobile/tablet layout.

### B. Master Books & Unified Archives in `تست باثو`
1. `كتاب_الاورال_باثولوجي_المجمع_الشامل_مع_صفحات_الكتاب.pdf` (108.96 MB, 484 pages — includes all 131 highlighted lecture sheet pages interleaved with past exam MCQs and related/unknown sections).
2. `كتاب_اورال_باثولوجي_7_شيتات_مع_الهايلايتات.pdf` (54.06 MB, 203 pages — 7 curriculum sheets only).
3. `الملف_المجمع_الشامل_لكافة_الاسئلة.pdf` (25.93 MB, all 655 questions annotated).
4. `الملف_المجمع_الشامل_لكافة_الاسئلة.html` (1.59 MB, live search & tabs).
5. `الملف_المجمع_الشامل_لكافة_الاسئلة.csv` (Excel spreadsheet UTF-8 BOM).

---

## 3. Immediate Next Step
- Fully tested and delivered to the user.
