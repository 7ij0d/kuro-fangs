# PROJECT_STATE.md — KURO FANGS Educational Platform

## 1. Project Overview & Tech Stack
- **Platform**: KURO FANGS (`https://kurofangs.id.ly/`) — Interactive bilingual (Arabic RTL / English LTR) dental education platform, Personal Study Library, GoodNotes-grade PDF Annotation Studio, Audio Lecture Sync, Question Bank, Study Rooms, and Academic Schedules.
- **Tech Stack**: Vanilla ES6+ SPA (`js/router.js`, `js/app.js`), HTML5 + CSS Custom Properties (`css/tokens.css`, `css/home-dashboard.css`), PDF.js v3.11.174 + IndexedDB local storage (`KF_PersonalLibrary_v1`), Cloudflare R2 + Supabase Auth/Realtime.

## 2. Done & Verified
### Latest Update — Complete Home Dashboard & Cross-Device Navigation Redesign (`v28.1`)
- **Fixed Library / Sheets Route Mounting ([`js/pages/sheets.js`](file:///C:/Users/Taha/.gemini/antigravity/scratch/kuro-fangs/js/pages/sheets.js#L20-L41), [`js/router.js`](file:///C:/Users/Taha/.gemini/antigravity/scratch/kuro-fangs/js/router.js#L107-L126))**: Updated `SheetsPage.render(containerOrParams, maybeParams)` to accept the `#app` container element passed by `router.js` (`document.getElementById('app')`), pre-registered `/sheets` and `/sheet-detail` in `Router.constructor`, and aligned light-theme selectors with `[data-theme="kuro"]`.
1. **Redesigned Navigation System ([`index.html`](file:///C:/Users/Taha/.gemini/antigravity/scratch/kuro-fangs/index.html), [`js/app.js`](file:///C:/Users/Taha/.gemini/antigravity/scratch/kuro-fangs/js/app.js), [`css/home-dashboard.css`](file:///C:/Users/Taha/.gemini/antigravity/scratch/kuro-fangs/css/home-dashboard.css))**:
   - **Desktop & Tablet (`>= 768px`)**: Docked Sidebar (`234px` desktop, `210px` tablet/iPad) featuring the KURO FANGS crest emblem + wordmark and 7 streamlined items (`Home`, `Library`, `Recordings`, `Questions`, `Study Rooms`, `Schedules`, and collapsible `More` submenu preserving direct access to `Theory Lectures`, `Clinical & Lab`, `Exam Schedules`, `Student Profile`, `Settings`, and `Admin Portal`). Active navigation item highlighted with a deep burgundy pill (`#7A1C2C`).
   - **Top Header Bar (`#site-header`)**: Clean header above the workspace with wide rounded search bar (`Search anything...`) and aligned user actions (Notifications Bell, User Profile Pill, Settings).
   - **Mobile (`<= 767px`)**: Compact top bar (`[Menu] [KURO FANGS Crest & Name] ... [Search] [Bell] [Avatar Initial]`) and fixed Bottom Navigation Bar (`Home`, `Library`, `Recordings`, `Questions`, `More` bottom sheet) with zero horizontal overflow.
2. **Compact Dynamic Welcome Banner ([`renderHeroSection`](file:///C:/Users/Taha/.gemini/antigravity/scratch/kuro-fangs/js/pages/home.js#L134-L185))**:
   - Displays dynamic greeting with the logged-in user's real name, motivational subtitle, real current date pill, and calm study desk illustration in a compact height (`152px` desktop/tablet, `132px` mobile).
3. **4 Core Quick Statistics ([`renderStudySummaryStrip`](file:///C:/Users/Taha/.gemini/antigravity/scratch/kuro-fangs/js/pages/home.js#L191-L321))**:
   - Real-time metrics for `Study Time` (Study Rooms + Personal Library time), `Study Streak`, `Completed Questions`, and `Today's Classes`, styled with 4 horizontal cards on Desktop/Tablet and a compact 4-column unified strip on Mobile.
4. **2-Column Balanced Main Workspace ([`renderContinueStudyingCard`](file:///C:/Users/Taha/.gemini/antigravity/scratch/kuro-fangs/js/pages/home.js#L430-L534) & [`renderTodayClassesCard`](file:///C:/Users/Taha/.gemini/antigravity/scratch/kuro-fangs/js/pages/home.js#L539-L639))**:
   - **Continue Studying (`متابعة الدراسة`)**: Connected directly to `window.PersonalLibrary` and [`js/pages/sheet-detail.js`](file:///C:/Users/Taha/.gemini/antigravity/scratch/kuro-fangs/js/pages/sheet-detail.js) view state (`lastPage`, `pages`, `folderName`, `lastOpenedAt`), showing PDF/IMG badge, file title, folder name, `Last page: X / Y`, progress percentage bar, and a one-click `Continue Studying` button that opens the PDF reader on the exact page where the student stopped. Includes an empty-state call-to-action when the Personal Library is empty.
   - **Today's Classes (`محاضرات اليوم`)**: Real-time daily schedule list with colored vertical indicators, time range, status badge (`Live Now` / `Upcoming` / `Completed`), lecture title, hall badge, and `View Schedule →` link.
5. **Quick Access Shortcuts ([`renderQuickAccessSection`](file:///C:/Users/Taha/.gemini/antigravity/scratch/kuro-fangs/js/pages/home.js#L644-L705))**:
   - Bottom shortcut strip for 1-tap navigation to `Library`, `Recordings`, `Questions`, `Study Rooms`, and `Schedules`.

## 3. Immediate Next Step
- Monitor student feedback on the new Home Dashboard & Personal Study Library workflow (`#/sheets` ↔ `#/sheet-detail`), and optionally add folder-level study time breakdowns or pinned favorite files in a future iteration.
