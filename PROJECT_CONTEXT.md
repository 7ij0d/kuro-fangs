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
2. **Hero Image Banner**:
   - High-fidelity artwork of Kuro studying at the desk with coffee mug, laptop, and the framed photo of the Faculty of Dentistry on the wall.
   - Must load with **0ms latency (instant embedded part of the site)** without blank flashes:
     - Preloaded in `<head>` of `index.html`.
     - Embedded Base64 LQIP background in `css/polish.css`.
     - In-memory pre-warming and automatic caching into `localStorage['kf_hero_banner_b64']`.
   - Left sunlight area contains dynamic time-of-day greeting (Morning, Afternoon, Evening, Night) and dynamic date.

---

## 3. Responsive UI/UX Architecture

### A. Desktop (`1200px+`)
- Full academic dashboard experience.
- Top center navigation pills: `[ Home ] [ Subjects ] [ Schedule ] [ Exams ] [ ... More ]`.
- 3-column Your Subjects grid.
- Horizontal Today's Lectures rows.
- 4-tile Quick Access row.
- Old dark sidebar is hidden.

### B. Tablet / iPad (`768px – 1199px`)
- Compact study workspace.
- Top navigation pills active (no bottom nav).
- 2-column Your Subjects grid.
- 2-column Quick Access grid.
- Compact hero banner (height 280–320px).
- Generous touch margins.

### C. Mobile Phone (`< 768px`) — Mobile Study App
- **NO giant dark sidebar on phones!** Completely disabled.
- **Fixed Bottom Navigation Bar**:
  - `[ ⌂ Home ] [ 📚 Sheets ] [ 🎙 Audio ] [ ❓ Questions ] [ ••• More ]`
  - Fixed to bottom with safe-area support (`env(safe-area-inset-bottom)`).
  - Active burgundy state (`#7E1D2A`).
- **Clean Compact Header (56px)**:
  - Contains only: Brand logo + name, search box, notifications bell, profile avatar.
  - Secondary toggles (Language, Theme, Sound) moved inside the More Sheet and Profile.
- **Mobile More Bottom Sheet (`.mobile-more-sheet`)**:
  - Slide-up bottom sheet with backdrop blur.
  - Quick settings pill row: Language (AR/EN), Theme (Dark/Light), Sound FX (On/Off).
  - Categorized groups:
    - **Study & Academic**: Theory Schedule, Clinical & Lab Schedule, Official Exam Schedule.
    - **Kuro Mascot**: Mascot Hub / Rewards, Arcade & Games.
    - **Account & Administration**: Profile & Settings, Faculty Admin Portal.
- **Mobile Home Sections**:
  - Hero banner height tuned to 210–235px (`object-fit: cover; object-position: 72% center;`).
  - Today/Tomorrow Schedule: Vertical class cards using CSS Grid (`time status`, `subject subject`, `hall arrow`) with 0 horizontal overflow.
  - Quick Access: 2 × 2 grid.
  - Your Subjects: Clean 1-column list with icon, code, English name, Arabic name, sheet count, chevron.

---

## 4. Recent Git Commits Log
- `5261c9c`: Unified Academic Schedules section with panoramic hero banner, 3-card hub, and 4-item navigation IA.
- `773c3c3`: Cache busting query versions bumped to `?v=9.2`.
- `332f072`: Responsive overhaul for shell, sheets page, and questions practice bank.
- `8fe9ece`: Mobile & iPad study workspace overhaul with fixed bottom nav & more sheet.
- `cc0bbf0`: Embed & cache kuro study hero banner for instant zero-latency loading.
- `a1beff4`: Cozy academic study scene homepage redesign matching mockup.
- `a0043ad`: Fix notifications panel right viewport overflow & subject card modal click.
- `76e487d`: Default questions and sheet names to English with translation toggle.
