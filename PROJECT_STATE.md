# PROJECT_STATE.md — KURO FANGS Educational Platform

## 1. Project Overview & Tech Stack
- **Platform**: KURO FANGS (`https://kurofangs.id.ly/`) — High-end bilingual (Arabic RTL / English LTR) dental education platform, Personal Study Library, GoodNotes-grade PDF Annotation Studio (`Kuro Notes`), Audio Lecture Sync, Question Bank, Study Rooms, and Academic Schedules.
- **Tech Stack**: Vanilla ES6+ SPA (`js/router.js`, `js/app.js`), HTML5 + CSS Custom Properties, PDF.js v3.11.174 + Puppeteer headless Chrome testing pipeline, `pdf-lib` v1.17.1 vector document assembler, IndexedDB local storage (`KF_PersonalLibrary_v1`), Cloudflare R2 + Supabase Auth/Realtime.
- **Workflow Architecture**: `Previous Years Questions → Subject Selection (oral-diseases) → Sheet Selection (9 Verified Sheets) → Interactive Questions & Quiz Runner → Verify from Sheet (Kuro Notes Split View)`.

---

## 2. Done & Verified

### A. Integrated Page-by-Page Master Book (Pharma Book Architecture) (`v34.0`)
- **Direct Reference Emulation**:
  - Replicated the exact student-centric architecture of the user's reference book (`Pharma 1 (2)(1) معدلة.pdf`).
  - **Sequential Interleaving Engine**:
    - **Original Sheet Page**: Retains 100% of the vector drawings, clinical schemes, histological slides, and doctor lecture notes.
    - **Followed Immediately by**: The exact past exam questions testing that specific page, marked with a prominent top-right pill badge: `Page X`.
    - **Card Design**: Clean white background, double-border elevation, options with letter pills (`A`, `B`, `C`, `D`), and the correct answer highlighted in fresh emerald green (`#dcfce7` / `#10b981`) with evidence quotes.
- **Audited Metrics**:
  - **Total Pages in Book**: **388 Pages**.
  - **All 7 Core Sheets Covered**:
    - Sheet 1: Dental Caries (Pages 1–11)
    - Sheet 2: Disorders of Dental Pulp (Pages 12–27)
    - Sheet 3: Diseases of Periapical Tissues (Pages 28–39)
    - Sheet 4: Cysts of the Jaw (Pages 40–76)
    - Sheet 5: Developmental Disturbances of Teeth (Pages 77–94)
    - Sheet 6: Disturbances of Oral & Paraoral Structures (Pages 95–112)
    - Sheet 7: Oral Non-Odontogenic Epithelial Tumors (Pages 113–131)
  - **Supplementary Chapters Included**:
    - Chapter 8: General Oral Pathology Review (246 Questions)
    - Chapter 9: Comprehensive Clinical & Final Preparation (58 Questions)
  - **Total Questions Interleaved**: **Exactly 655 Questions**.
- **Deliverables Saved**:
  - Desktop: `C:\Users\Taha\Desktop\Oral_Pathology_Exam_Book\ORAL_PATHOLOGY_INTEGRATED_PAGE_BY_PAGE_BOOK.pdf` (88.96 MB, 388 pages)
  - Artifact: `C:\Users\Taha\.gemini\antigravity\brain\097ac63e-f0ef-4ec0-87b2-ccf00a62d23b\ORAL_PATHOLOGY_INTEGRATED_PAGE_BY_PAGE_BOOK.pdf`

### B. Bug Fixes in Kuro Notes Viewer (`v33.1`)
- **Sagittal Midline Clipping Fixed**:
  - Fixed flexbox centering overflow bug in Arabic RTL mode by forcing `direction: ltr !important` on `.kn-document-viewport`.
  - Replaced forced 1.35x zoom with automatic `fit-width` inside Split View so full text lines are 100% visible from left to right.
- **Git Push Deployed**:
  - Commit `0db90ce` pushed to `origin/main` on GitHub, updating the live website `https://kurofangs.id.ly/`.

---

## 3. Immediate Next Step
- The master 388-page integrated book is ready on the desktop for immediate student revision, printing, and tablet study.
