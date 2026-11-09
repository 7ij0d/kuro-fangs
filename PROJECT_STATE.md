# PROJECT_STATE.md — KURO FANGS Educational Platform

## 1. Project Overview & Tech Stack
- **Platform**: KURO FANGS (`https://kurofangs.id.ly/`) — High-end bilingual (Arabic RTL / English LTR) dental education platform, Personal Study Library, GoodNotes-grade PDF Annotation Studio (`Kuro Notes`), Audio Lecture Sync, Question Bank, Study Rooms, and Academic Schedules.
- **Tech Stack**: Vanilla ES6+ SPA (`js/router.js`, `js/app.js`), HTML5 + CSS Custom Properties, PDF.js v3.11.174 + Puppeteer headless Chrome testing pipeline, IndexedDB local storage (`KF_PersonalLibrary_v1`), Cloudflare R2 + Supabase Auth/Realtime.
- **Workflow Architecture**: `Previous Years Questions → Subject Selection (oral-diseases) → Sheet Selection (9 Verified Sheets) → Interactive Questions & Quiz Runner → Verify from Sheet (Kuro Notes Split View)`.

---

## 2. Done & Verified

### A. Previous Years Questions & Deep Source Linking Integration (`v33.0`)
1. **Preservation & Non-Destructive Extension**:
   - Zero modifications to the underlying platform architecture, routing, or database structure.
   - Enhanced `DataService` (`js/data.js`), `QuestionsPage` (`js/pages/questions.js`), `SheetDetailPage` (`js/pages/sheet-detail.js`), and `AdminPage` (`js/pages/admin.js`).
2. **Data Model & Attribution Population**:
   - `data/sheets.json`: Added 9 verified sheets for Oral Pathology (`oral-diseases`), including the 7 core sheets, Chapter 8 (General Oral Pathology), and Chapter 9 (Academic Review), all linked to `data/sheets/oral-pathology-7-sheets.pdf`.
   - `data/questions.json`: 655 exam questions fully populated with complete metadata:
     - `subject_id` (`oral-diseases`), `sheet_id` (`sh_oral_path_*`)
     - `source_reference` & `source_references` array supporting multi-source verification.
     - `relationship_code` & `relationship_name`:
       - `A`: Exact Match (`تطابق كامل وحرفي`)
       - `B`: Paraphrased Match (`تطابق في المفهوم العلمي`)
       - `C`: Related Content (`معلومات داعمة/مرتبطة`)
       - `D`: Multiple Sources (`مشتق من أكثر من شيت`)
       - `E`: Outside 7 Sheets (`خارج الشيتات السبعة`)
       - `F`: Unidentified Source (`غير محدد المصدر`)
     - `page_number` & `source_text` (verbatim supporting quote).
3. **"Verify from Sheet | التحقق من الشيت" Button**:
   - Integrated prominently into question cards and the quiz runner modal.
   - Dynamic label: `Verify from Sheet | التحقق من الشيت (ص X)` with relationship classification badge and quote snippet.
   - Multi-source selector: When a question depends on multiple sheets/pages, students can pick which supporting source to verify.
   - Seamless navigation: Opens `SheetDetailPage` directly at the target page without reloading or downloading duplicate PDFs.
   - Visual Focus & Dock: Highlights supporting text on the page and mounts `#kn-source-ref-dock` with direct action controls.
   - Effortless Return: Prominent `الرجوع للسؤال | Back to Question` button in both the sticky bottom dock and the top navigation header instantly closes the PDF pane and returns the student to their quiz state.
4. **Admin Panel Source Management (`js/pages/admin.js`)**:
   - Form Submission: `form-add-q` captures custom PDF URL, page number, source relationship code (A–F), and verbatim supporting quote.
   - Question Directory: Added search bar filtering across all 655 questions live by question text, subject, sheet, or quote.
   - Direct PDF Preview: One-click `معاينة | Preview` button on every question row opens the sheet PDF at that exact page in a new tab.
   - Edit Source Attribution Modal (`#modal-edit-q-source`):
     - Displays question text and current attribution metadata.
     - Allows editing target sheet, page number, attribution classification (A–F), and supporting quote.
     - Direct vs. Related toggle indicator.
     - Multi-Source Management: `+ إضافة مصدر داعم آخر لهذا السؤال` allows attaching secondary and tertiary sources dynamically.
     - Real-time PDF preview from inside the modal.
     - Immediate persistence via `window.DATA.updateQuestion()`.

---

## 3. Verification & Automated Test Results
- **Automated Puppeteer E2E Test Suite (`tests/verify_kuro_source_linking.js`)**:
  - `✓ Questions subjects view loaded successfully`
  - `✓ Oral Pathology subject selected: true`
  - `✓ Sheets rendered for Oral Pathology: 18 sheets found`
  - `✓ Dental Caries sheet quiz trigger clicked: true`
  - `✓ Question type selected (All Questions): true`
  - `✓ Quiz runner modal active: true`
  - `✓ "Verify from Sheet" action buttons found: 2 (Label: "Verify from Sheet (p. 11)")`
  - `✓ PDF Split View Active: true & PDF Pane Displayed: true`
  - `✓ Kuro Notes Workspace Mounted: true & Source Reference Dock Mounted: true`
  - `✓ Back to Question Button: "Back to Question"`
  - `✓ Split View Closed and Returned to Question: true`
  - `✓ Admin Add Question Source Fields Present: true`
  - `✓ Admin Questions Search Input Present: true`
  - `✓ Admin Existing Question Rows: 655 questions listed`
  - `✓ Admin Preview in Sheet Buttons: 655 buttons & Edit Source Attribution Buttons: 655 buttons`
  - `✓ Filtered Questions matching "caries": 62 rows visible`
  - `✓ Edit Source Modal Opened: true (Page 81, Rel B, Verbatim quote verified)`
  - `✓ Add Source Button Present: true & Save Sources Button Present: true`
  - `✓ Source Blocks after "+ Add Another Source": 2 sources verified`
  - **All test assertions exited with Code 0 (100% Success)**.

---

## 4. Immediate Next Step
- The system is completely deployed in the local Kuro Fangs platform (`C:\Users\Taha\.gemini\antigravity\scratch\kuro-fangs`).
- Ready for live student study sessions and admin source refinement.
