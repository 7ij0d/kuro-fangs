# PROJECT_STATE.md — KURO FANGS Educational Platform

## 1. Project Overview & Tech Stack
- **Platform**: KURO FANGS (`https://kurofangs.id.ly/`) — High-end bilingual (Arabic RTL / English LTR) dental education platform, Personal Study Library, GoodNotes-grade PDF Annotation Studio (`Kuro Notes`), Audio Lecture Sync, Question Bank, Study Rooms, and Academic Schedules.
- **Tech Stack**: Vanilla ES6+ SPA (`js/router.js`, `js/app.js`), HTML5 + CSS Custom Properties, PDF.js v3.11.174 + Puppeteer headless Chrome testing pipeline, `pdf-lib` v1.17.1 vector document assembler, IndexedDB local storage (`KF_PersonalLibrary_v1`), Cloudflare R2 + Supabase Auth/Realtime.
- **Workflow Architecture**: `Previous Years Questions → Subject Selection (Oral Pathology) → Sheet Selection (7 Core Sheets) → Interactive Questions & Quiz Runner → Verify from Sheet (Kuro Notes Split View)`.

---

## 2. Done & Verified

### A. Dedicated Desktop Deliverable: "تست باثو" (`v35.2`)
- **Desktop Folder**: `C:\Users\Taha\Desktop\تست باثو`
  1. `كتاب_اورال_باثولوجي_7_شيتات_مع_الهايلايتات.pdf` (54.06 MB, 203 pages):
     - Contains **ONLY the 7 core curriculum sheets** (Pages 1–131).
     - 1,497 translucent vector study highlights on exam facts and definitions (Amber for repeated facts, Yellow for exam facts).
     - Followed by deduplicated, direct faculty exam questions badged with `Page X` (107 direct questions for the 7 sheets).
     - Chapters 8 and 9 completely excluded.
  2. `تقرير_الاسئلة_المحذوفة_تفاعلي.html` (Interactive HTML with search & filters):
     - Live search by question text, sheet name, or defect reason.
     - Documents all 437 excluded questions with full stem, options, and transparent reasons.
  3. `جدول_الاسئلة_المحذوفة_للاكسل.csv` (Excel-ready with UTF-8 BOM):
     - Formatted spreadsheet with columns: Question ID, Sheet Name, Sheet Page, Exam File, Exam Page, Defect Category, Detailed Reason, Stem, Choices, Answer.
  4. `تقرير_الاسئلة_المحذوفة_مع_اسباب_الحذف.md` (Markdown documentation).
  5. `بيانات_الاسئلة_المحذوفة.json` (Structured JSON dataset).
  6. `اقرأني_فهرس_المحتويات.txt` (Summary index).
- **Desktop Root Direct Files**:
  - `C:\Users\Taha\Desktop\تست باثو - كتاب ال 7 شيتات مع الهايلايتات.pdf`
  - `C:\Users\Taha\Desktop\تست باثو - جدول الاسئلة المحذوفة.csv`

### B. Defect Audit Summary (437 Questions Excluded)
- **Breakdown by Reason Category**:
  - نقص في الخيارات (أقل من 3 خيارات / صواب وخطأ مبتورة): 183 سؤالاً
  - دمج الخيار (a) داخل نص السؤال مما أفسد الخيارات: 136 سؤالاً
  - تكرار متطابق 100%: 84 سؤالاً
  - شبه مكرر أو صياغة غير مباشرة: 28 سؤالاً
  - خيارات ربط مشوهة (a and b بدون خيارات واضحة): 3 أسئلة
  - تكرار نفس الخيار مرتين داخل السؤال: 3 أسئلة
- **Breakdown by Sheet**:
  - Sheet 1 (Dental Caries): 30
  - Sheet 2 (Disorders of Dental Pulp): 35
  - Sheet 3 (Periapical Diseases): 37
  - Sheet 4 (Cysts of the Jaw): 59
  - Sheet 5 (Developmental Disturbances of Teeth): 47
  - Sheet 6 (Oral & Paraoral Structures): 12
  - Sheet 7 (Oral Epithelial Tumors): 24
  - Outside Core 7 Sheets (Salivary Glands, Bone, Infections, etc.): 143
  - Unidentified / General Review: 50

---

## 3. Immediate Next Step
- Everything complete and verified on Desktop. Deliver clear Libyan Arabic summary to user with direct paths.
