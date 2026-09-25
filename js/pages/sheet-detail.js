/**
 * KURO FANGS — KURO NOTES DEDICATED ACADEMIC SHEET WORKSPACE
 * Elite high-performance PDF & lecture sheet viewer matching the Kuro Notes reference design.
 * Features:
 * - Bespoke Kuro Notes header with branding, truncated document title pill, search, bookmark, share, and 3-dot menu.
 * - Organized toolbar with distinct semantic groups (Undo/Redo, Page Nav, Zoom, Annotation tools, View modes).
 * - Collapsible Left Document Navigation Sidebar with Pages thumbnails (active red border), Bookmarks, Outline, Notes, AI Help.
 * - Centered Document Canvas with margin separation on warm cream backdrop, layered architecture (PDF Layer, Text Layer, Annotation Layer, Interaction Layer).
 * - Collapsible Right Document Information Sidebar with Search in sheet, hierarchical Outline, Notes, AI Help.
 * - Zoom engine with presets (50%, 75%, 100%, 120%, 150%, 200%, Fit to Width, Fit to Page).
 * - Distraction-free reading mode with floating exit pill.
 * - Zero blue focus/tap outlines and spring press feedback physics.
 * - Preserves existing structured copy text engine and academic discussion board.
 */

const SheetDetailPage = {
  render(container, sheetIdOrQuery, maybeQuery) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
    const t = (k) => window.I18N ? window.I18N.t(k) : k;

    // Handle /sheet/:id, /sheet-detail?id=..., etc.
    let targetId = typeof sheetIdOrQuery === 'string' ? sheetIdOrQuery : null;
    if (!targetId && sheetIdOrQuery instanceof URLSearchParams) {
      targetId = sheetIdOrQuery.get('id');
    }
    if (!targetId && maybeQuery instanceof URLSearchParams) {
      targetId = maybeQuery.get('id');
    }

    const sheets = window.DATA?.sheets || [];
    let sheet = sheets.find(s => s.id === targetId);

    // Also check custom admin sheets
    if (!sheet) {
      try {
        const customSheets = JSON.parse(localStorage.getItem('kf_admin_custom_sheets') || '[]');
        sheet = customSheets.find(s => s.id === targetId);
      } catch (e) {}
    }

    // If not found — show clean error state
    if (!sheet) {
      container.innerHTML = `
        <div style="padding: 60px 20px; text-align: center; font-family: inherit;">
          <div style="font-size: 3.5rem; margin-bottom: 16px;">📁</div>
          <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">
            ${isAr ? 'لم يتم العثور على الشيت' : 'Sheet Not Found'}
          </h2>
          <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 24px;">
            ${isAr ? 'قد يكون تم نقل الشيت أو أن الرابط غير صحيح.' : 'This sheet could not be located or the link is invalid.'}
          </p>
          <a href="#/sheets" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 8px; border-radius: 8px; padding: 10px 20px; font-weight: 700;">
            <span>${isAr ? 'العودة لقائمة الشيتات' : 'Back to Sheets'}</span>
          </a>
        </div>
      `;
      return;
    }

    // Normalize real metadata
    const title = sheet.title_en || sheet.title || sheet.title_ar || 'Dental Lecture Sheet';
    const displayDocName = title.toLowerCase().endsWith('.pdf') ? title : `${title}.pdf`;
    const subjectName = sheet.subject_name || (isAr ? 'المادة الدراسية' : 'Academic Subject');
    const doctorName = sheet.doctor_name || sheet.doctor || '';
    const initialPages = sheet.pages || sheet.pages_count || 5;
    const date = sheet.date || '2026-09-22';
    const isAdmin = Boolean(sessionStorage.getItem('kf_admin_auth') === 'true' || (window.AdminPage && window.AdminPage.checkAuth && window.AdminPage.checkAuth()));

    // Track last opened sheet in localStorage for Home dashboard
    try {
      const subj = window.DATA && typeof window.DATA.getSubjectById === 'function'
        ? window.DATA.getSubjectById(sheet.subject_id)
        : null;
      const sheetRecord = {
        id: sheet.id,
        title: sheet.title || sheet.title_en || sheet.title_ar,
        title_ar: sheet.title_ar || sheet.title || sheet.title_en,
        title_en: sheet.title_en || sheet.title || sheet.title_ar,
        subject_id: sheet.subject_id,
        subject_name_ar: subj ? subj.name_ar : (sheet.subject_name || ''),
        subject_name_en: subj ? subj.name_en : (sheet.subject_name || ''),
        timestamp: Date.now()
      };
      localStorage.setItem('kf_last_opened_sheet', JSON.stringify(sheetRecord));
    } catch (e) {}

    // Discussion comments key
    const commentsKey = 'kf_sheet_comments_' + sheet.id;
    let comments = [];
    try {
      const rawComments = localStorage.getItem(commentsKey);
      if (rawComments) comments = JSON.parse(rawComments) || [];
      else {
        comments = [
          {
            id: 'c1',
            author: isAr ? 'طالبة طب أسنان - دفعة 2026' : 'Dental Student - Class of 2026',
            time: isAr ? 'منذ ساعتين' : '2 hours ago',
            text: isAr
              ? 'سؤال في صفحة 2: ماهو الفرق بين Acute Caries و Chronic Caries في سرعة التطور والتصبغ؟'
              : 'Question on page 2: What is the clinical difference between Acute Caries and Chronic Caries in terms of progression rate and pigmentation?',
            reply: isAr
              ? 'إجابة د. حنان: الـ Acute Caries سريع التطور ويكون لونه فاتح ومصحوب بألم سريع، بينما Chronic Caries بطيء جداً ولونه بني غامق أو أسود مع تكوين Tertiary dentin!'
              : 'Dr. Hanan: Acute caries is rapid, lighter in color with early pulp exposure risk; chronic caries is long-standing, dark brown/black with sclerotic tertiary dentin defense!'
          }
        ];
        localStorage.setItem(commentsKey, JSON.stringify(comments));
      }
    } catch (e) {
      comments = [];
    }

    // Notes persistence key
    const notesKey = 'kf_sheet_notes_' + sheet.id;
    let studentNotes = [];
    try {
      studentNotes = JSON.parse(localStorage.getItem(notesKey) || '[]');
      if (!Array.isArray(studentNotes)) studentNotes = [];
      if (studentNotes.length === 0) {
        studentNotes = [
          { id: 'n1', text: isAr ? 'مراجعة نظريات التسوس: Miller’s Acidogenic Theory مقابل Current Ecological Plaque Hypothesis.' : 'Review Caries theories: Miller’s Acidogenic Theory vs Modern Ecological Plaque Hypothesis.', date: '2026-09-23 10:15' },
          { id: 'n2', text: isAr ? 'التركيز على الفروق التشريحية بين Pit & Fissure Caries و Smooth Surface Caries.' : 'Focus on anatomical distinction between Pit & Fissure Caries vs Smooth Surface Caries cone apex.', date: '2026-09-24 16:40' },
          { id: 'n3', text: isAr ? 'سؤال امتحان متكرر: تصنيف التسوس بحسب العمق ومسار الانتشار في العاج.' : 'High-yield exam topic: Caries classification by depth & pathway of spread along dentinal tubules.', date: '2026-09-25 11:20' }
        ];
        localStorage.setItem(notesKey, JSON.stringify(studentNotes));
      }
    } catch (e) {
      studentNotes = [];
    }

    // Bookmarks persistence key
    const bookmarksKey = 'kf_sheet_bookmarks_' + sheet.id;
    let bookmarks = [];
    try {
      bookmarks = JSON.parse(localStorage.getItem(bookmarksKey) || '[1]');
      if (!Array.isArray(bookmarks)) bookmarks = [1];
    } catch (e) {
      bookmarks = [1];
    }

    // Activate full-screen workspace isolation
    document.body.classList.add('studio-fullscreen-active');
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }

    // Clinical outline items corresponding to this dental lecture
    const clinicalOutline = [
      { id: 'sec-1', page: 1, title: isAr ? '1. تعريف تسوس الأسنان (Definition)' : '1. Definition of Dental Caries', active: true },
      { id: 'sec-2', page: 1, title: isAr ? '2. تصنيف تسوس الأسنان (Classification)' : '2. Classification of Dental Caries', children: [
        { id: 'sec-2a', page: 1, title: isAr ? 'أ. حسب سرعة التطور (Rate of Progression)' : 'A. Based on Rate of Progression' },
        { id: 'sec-2b', page: 2, title: isAr ? 'ب. حسب الموقع التشريحي (Anatomical Site)' : 'B. Based on Anatomical Site' },
        { id: 'sec-2c', page: 2, title: isAr ? 'ج. حسب الحدوث والتتابع (Occurrence/Sequence)' : 'C. Based on Occurrence/Sequence' },
        { id: 'sec-2d', page: 3, title: isAr ? 'د. حسب المدى والعمق (Extent / Depth)' : 'D. Based on Extent / Depth' },
        { id: 'sec-2e', page: 3, title: isAr ? 'هـ. حسب الأنسجة المتأثرة (Tissue Involvement)' : 'E. Based on Tissue Involvement' },
        { id: 'sec-2f', page: 4, title: isAr ? 'و. حسب مسار الانتشار (Pathway of Spread)' : 'F. Based on Pathway of Spread' },
        { id: 'sec-2g', page: 4, title: isAr ? 'ز. حسب الفئة العمرية (Chronology / Age Group)' : 'G. Based on Chronology / Age Group' }
      ]},
      { id: 'sec-3', page: 4, title: isAr ? '3. المسببات والعوامل الوبائية (Etiology)' : '3. Etiology' },
      { id: 'sec-4', page: 5, title: isAr ? '4. الآلية الإمراضية (Pathogenesis)' : '4. Pathogenesis' },
      { id: 'sec-5', page: 5, title: isAr ? '5. المظاهر السريرية (Clinical Features)' : '5. Clinical Features' },
      { id: 'sec-6', page: 5, title: isAr ? '6. التشخيص والفحص (Diagnosis)' : '6. Diagnosis' },
      { id: 'sec-7', page: 5, title: isAr ? '7. التدبير والوقاية (Management)' : '7. Management' }
    ];

    // Build the master Kuro Notes DOM structure
    container.innerHTML = `
      <div id="sheet-studio-fullscreen-root" class="kuro-notes-workspace">
        
        <!-- ═══════════════════════════════════════════════════════════════
             1. TOP HEADER (Brand, Doc Title, Search, Bookmark, Share, Menu)
             ═══════════════════════════════════════════════════════════════ -->
        <header class="kn-header" id="kn-header">
          <div class="kn-header-left">
            <!-- Back Button -->
            <button class="kn-btn kn-btn-back" id="kn-btn-back" title="${isAr ? 'الرجوع لقائمة الشيتات' : 'Back to Sheets'}">
              <span class="kn-icon-back">${isAr ? '→' : '←'}</span>
              <span class="kn-btn-text">${isAr ? 'الرجوع' : 'Back'}</span>
            </button>

            <!-- Toggle Left Sidebar -->
            <button class="kn-icon-btn kn-btn-toggle-left" id="kn-btn-toggle-left" title="${isAr ? 'إظهار/إخفاء الشريط الجانبي' : 'Toggle Sidebar'}">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>

            <!-- Kuro Notes Mascot & Logo -->
            <div class="kn-brand">
              <img src="assets/characters/kuro/Kuro-Idle.png" alt="Kuro" class="kn-mascot-avatar" />
              <span class="kn-app-title">Kuro Notes</span>
            </div>

            <!-- Document Title Pill -->
            <div class="kn-doc-title-pill" id="kn-doc-title-pill" title="${displayDocName}">
              <span class="kn-doc-icon">📄</span>
              <span class="kn-doc-title-text">${displayDocName}</span>
            </div>
          </div>

          <div class="kn-header-right">
            <!-- Search in document button -->
            <button class="kn-icon-btn" id="kn-btn-search" title="${isAr ? 'البحث في الشيت' : 'Search in sheet'}">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            <!-- Bookmark toggle button -->
            <button class="kn-icon-btn ${bookmarks.includes(1) ? 'active' : ''}" id="kn-btn-bookmark" title="${isAr ? 'حفظ الصفحة كعلامة مرجعية' : 'Bookmark Page'}">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="${bookmarks.includes(1) ? '#7E1D2A' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>

            <!-- Copy text dropdown trigger (Preserving copy engine) -->
            <div class="kn-dropdown-wrap" id="kn-copy-dropdown-wrap">
              <button class="kn-btn kn-btn-back" id="kn-btn-copy-menu" title="${isAr ? 'نسخ نصوص الشيت مرتبة' : 'Copy Sheet Text'}">
                <span>📋</span>
                <span class="kn-btn-text">${isAr ? 'نسخ' : 'Copy'}</span>
              </button>
              <div class="kn-dropdown-menu" id="kn-copy-dropdown">
                <button class="kn-dropdown-item" id="kn-action-copy-page">
                  <span>📄</span>
                  <span>${isAr ? 'نسخ نصوص الصفحة الحالية' : 'Copy Current Page Text'}</span>
                </button>
                <button class="kn-dropdown-item" id="kn-action-copy-full">
                  <span>📚</span>
                  <span>${isAr ? 'نسخ كامل الشيت منسقاً' : 'Copy Entire Sheet Formatted'}</span>
                </button>
              </div>
            </div>

            <!-- Share Button (Burgundy Accent) -->
            <button class="kn-btn kn-btn-primary" id="kn-btn-share" title="${isAr ? 'مشاركة رابط الشيت' : 'Share Sheet'}">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              <span>${isAr ? 'مشاركة' : 'Share'}</span>
            </button>

            <!-- 3-Dots More Options Menu -->
            <div class="kn-dropdown-wrap" id="kn-more-dropdown-wrap">
              <button class="kn-icon-btn" id="kn-btn-more" title="${isAr ? 'المزيد من الخيارات' : 'More options'}" aria-haspopup="true">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>
              </button>
              <div class="kn-dropdown-menu" id="kn-more-dropdown">
                <button class="kn-dropdown-item" id="kn-action-download">
                  <span>⬇️</span><span>${isAr ? 'تحميل ملف PDF' : 'Download PDF'}</span>
                </button>
                <button class="kn-dropdown-item" id="kn-action-print">
                  <span>🖨️</span><span>${isAr ? 'طباعة الشيت' : 'Print Document'}</span>
                </button>
                <button class="kn-dropdown-item" id="kn-action-fit-width">
                  <span>↔️</span><span>${isAr ? 'ملاءمة لعرض الشاشة' : 'Fit to Width'}</span>
                </button>
                <button class="kn-dropdown-item" id="kn-action-fit-page">
                  <span>↕️</span><span>${isAr ? 'ملاءمة لكامل الصفحة' : 'Fit to Page'}</span>
                </button>
                <button class="kn-dropdown-item" id="kn-action-fullscreen">
                  <span>⛶</span><span>${isAr ? 'وضع القراءة بدون تشتيت' : 'Distraction-Free Mode'}</span>
                </button>
                <button class="kn-dropdown-item" id="kn-action-doc-info">
                  <span>ℹ️</span><span>${isAr ? 'معلومات الملف' : 'Document Info'}</span>
                </button>
                <button class="kn-dropdown-item" id="kn-action-discussion">
                  <span>💬</span><span>${isAr ? `المناقشة الأكاديمية (${comments.length})` : `Academic Discussion (${comments.length})`}</span>
                </button>
                ${isAdmin ? `
                  <button class="kn-dropdown-item" id="kn-action-edit-admin" style="color: #0284C7;">
                    <span>✏️</span><span>${isAr ? 'تعديل بيانات الشيت' : 'Edit Sheet (Admin)'}</span>
                  </button>
                ` : ''}
              </div>
            </div>
          </div>
        </header>

        <!-- ═══════════════════════════════════════════════════════════════
             2. TOP TOOLBAR (History, Page Nav, Zoom, Tools, View Modes)
             ═══════════════════════════════════════════════════════════════ -->
        <div class="kn-toolbar" id="kn-toolbar" role="toolbar" aria-label="Kuro Notes Toolbar">
          <!-- Group 1: Undo / Redo -->
          <div class="kn-tool-group kn-group-history">
            <button class="kn-tool-btn" id="kn-btn-undo" title="${isAr ? 'تراجع (Ctrl+Z)' : 'Undo (Ctrl+Z)'}" disabled>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 14L4 9l5-5"></path>
                <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"></path>
              </svg>
            </button>
            <button class="kn-tool-btn" id="kn-btn-redo" title="${isAr ? 'إعادة (Ctrl+Y)' : 'Redo (Ctrl+Y)'}" disabled>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 14l5-5-5-5"></path>
                <path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13"></path>
              </svg>
            </button>
          </div>

          <div class="kn-toolbar-divider"></div>

          <!-- Group 2: Page Navigation -->
          <div class="kn-tool-group kn-group-page">
            <div class="kn-page-input-wrap">
              <input type="number" id="kn-page-input" class="kn-page-input" min="1" max="${initialPages}" value="1" aria-label="Page number" />
              <span class="kn-page-total">/ <span id="kn-page-total-num">${initialPages}</span></span>
            </div>
            <button class="kn-tool-btn" id="kn-btn-prev-page" title="${isAr ? 'الصفحة السابقة' : 'Previous Page'}">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button class="kn-tool-btn" id="kn-btn-next-page" title="${isAr ? 'الصفحة التالية' : 'Next Page'}">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>

          <div class="kn-toolbar-divider"></div>

          <!-- Group 3: Zoom Engine -->
          <div class="kn-tool-group kn-group-zoom">
            <button class="kn-tool-btn" id="kn-btn-zoom-out" title="${isAr ? 'تصغير (−)' : 'Zoom Out (−)'}">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <div class="kn-dropdown-wrap" id="kn-zoom-dropdown-wrap">
              <button class="kn-zoom-btn" id="kn-btn-zoom-level" title="${isAr ? 'نسبة التكبير' : 'Zoom Level'}" aria-haspopup="true">
                <span id="kn-zoom-text">120%</span>
                <span style="font-size: 0.7rem; opacity: 0.7;">▾</span>
              </button>
              <div class="kn-dropdown-menu" id="kn-zoom-dropdown">
                <button class="kn-dropdown-item" data-zoom="0.5">50%</button>
                <button class="kn-dropdown-item" data-zoom="0.75">75%</button>
                <button class="kn-dropdown-item" data-zoom="1.0">100%</button>
                <button class="kn-dropdown-item active" data-zoom="1.2">120%</button>
                <button class="kn-dropdown-item" data-zoom="1.5">150%</button>
                <button class="kn-dropdown-item" data-zoom="2.0">200%</button>
                <div style="height: 1px; background: var(--kn-border); margin: 3px 0;"></div>
                <button class="kn-dropdown-item" data-zoom="fit-width">${isAr ? 'ملاءمة للعرض' : 'Fit to Width'}</button>
                <button class="kn-dropdown-item" data-zoom="fit-page">${isAr ? 'ملاءمة للصفحة' : 'Fit to Page'}</button>
              </div>
            </div>
            <button class="kn-tool-btn" id="kn-btn-zoom-in" title="${isAr ? 'تكبير (+)' : 'Zoom In (+)'}">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>

          <div class="kn-toolbar-divider"></div>

          <!-- Group 4: Annotation Tools (Structural place per Section 21 & 22) -->
          <div class="kn-tool-group kn-group-tools" role="radiogroup" aria-label="Annotation Tools">
            <!-- Select Tool -->
            <button class="kn-tool-btn" data-tool="select" id="kn-tool-select" title="${isAr ? 'أداة التحديد (V)' : 'Select Tool (V)'}" role="radio" aria-checked="false">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 3l7 18 3-7 7-3L3 3z"></path>
              </svg>
            </button>

            <!-- Highlighter (Active by default matching reference image) -->
            <button class="kn-tool-btn active kn-tool-highlighter" data-tool="highlighter" id="kn-tool-highlighter" title="${isAr ? 'قلم التمييز / هايلايتر (H)' : 'Highlighter (H)'}" role="radio" aria-checked="true">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                <path d="M2 2l7.586 7.586"></path>
                <circle cx="11" cy="11" r="2"></circle>
              </svg>
              <span class="kn-tool-label">${isAr ? 'تظليل' : 'Highlighter'}</span>
            </button>

            <!-- Pen -->
            <button class="kn-tool-btn" data-tool="pen" id="kn-tool-pen" title="${isAr ? 'قلم الحبر (P)' : 'Pen (P)'}" role="radio" aria-checked="false">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
              </svg>
            </button>

            <!-- Eraser -->
            <button class="kn-tool-btn" data-tool="eraser" id="kn-tool-eraser" title="${isAr ? 'ممحاة (E)' : 'Eraser (E)'}" role="radio" aria-checked="false">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 20H7L3 16C2 15 2 13 3 12L13 2L22 11L18 15"></path>
                <path d="M18 11l-7 7"></path>
              </svg>
            </button>

            <!-- Shapes -->
            <button class="kn-tool-btn" data-tool="shapes" id="kn-tool-shapes" title="${isAr ? 'أشكال هندسية (S)' : 'Shapes (S)'}" role="radio" aria-checked="false">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              </svg>
            </button>

            <!-- Lasso / Link -->
            <button class="kn-tool-btn" data-tool="lasso" id="kn-tool-lasso" title="${isAr ? 'حبل التحديد / الربط' : 'Lasso Select'}" role="radio" aria-checked="false">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </button>

            <!-- Image -->
            <button class="kn-tool-btn" data-tool="image" id="kn-tool-image" title="${isAr ? 'إدراج صورة سريرية' : 'Insert Clinical Image'}" role="radio" aria-checked="false">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </button>

            <!-- Text Box -->
            <button class="kn-tool-btn" data-tool="text" id="kn-tool-text" title="${isAr ? 'إدراج نص (T)' : 'Text Box (T)'}" role="radio" aria-checked="false">
              <span style="font-weight: 800; font-size: 0.95rem; line-height: 1;">T</span>
            </button>

            <!-- AI Dental Assistant -->
            <button class="kn-tool-btn kn-tool-ai" data-tool="ai" id="kn-tool-ai" title="${isAr ? 'مساعد كورو الذكي' : 'Kuro AI Dental Assistant'}" role="radio" aria-checked="false">
              <span class="kn-ai-badge">AI</span>
            </button>
          </div>

          <div class="kn-toolbar-divider"></div>

          <!-- Group 5: View Mode & Fullscreen -->
          <div class="kn-tool-group kn-group-view">
            <button class="kn-tool-btn" id="kn-view-single" title="${isAr ? 'عرض صفحة مفردة' : 'Single Page View'}">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="5" y="3" width="14" height="18" rx="2"></rect>
              </svg>
            </button>
            <button class="kn-tool-btn active" id="kn-view-continuous" title="${isAr ? 'تمرير مستمر' : 'Continuous Scroll'}">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="5" y="2" width="14" height="8" rx="1"></rect>
                <rect x="5" y="14" width="14" height="8" rx="1"></rect>
              </svg>
            </button>
            <button class="kn-tool-btn" id="kn-btn-fullscreen" title="${isAr ? 'ملء الشاشة بدون تشتيت (F)' : 'Distraction-Free Fullscreen (F)'}">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
            </button>
          </div>

          <!-- Right Sidebar Toggle -->
          <div class="kn-toolbar-end">
            <button class="kn-tool-btn kn-btn-toggle-right" id="kn-btn-toggle-right" title="${isAr ? 'إظهار/إخفاء الفهرس والملاحظات' : 'Toggle Outline & Notes'}">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                <line x1="15" y1="3" x2="15" y2="21"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- ═══════════════════════════════════════════════════════════════
             3. WORKSPACE BODY (Left Sidebar + Viewport + Right Sidebar)
             ═══════════════════════════════════════════════════════════════ -->
        <div class="kn-workspace-body" id="kn-workspace-body">
          
          <!-- LEFT SIDEBAR: Pages, Bookmarks, Outline, Notes, AI Help -->
          <aside class="kn-sidebar-left" id="kn-sidebar-left" aria-label="Document Navigation">
            <div class="kn-sidebar-tab-bar" role="tablist">
              <button class="kn-tab-pill active" id="kn-tab-pages" data-pane="pages" role="tab" aria-selected="true">${isAr ? 'الصفحات' : 'Pages'}</button>
              <button class="kn-tab-pill" id="kn-tab-bookmarks" data-pane="bookmarks" role="tab" aria-selected="false">${isAr ? 'علامات' : 'Bookmarks'}</button>
              <button class="kn-tab-pill" id="kn-tab-outline" data-pane="outline" role="tab" aria-selected="false">${isAr ? 'المحتويات' : 'Outline'}</button>
              <button class="kn-tab-pill" id="kn-tab-notes" data-pane="notes" role="tab" aria-selected="false">${isAr ? `ملاحظات (${studentNotes.length})` : `Notes (${studentNotes.length})`}</button>
              <button class="kn-tab-pill" id="kn-tab-ai" data-pane="ai" role="tab" aria-selected="false">${isAr ? 'مساعد AI' : 'AI Help'}</button>
            </div>

            <div class="kn-sidebar-content" id="kn-left-sidebar-content">
              <!-- Pane 1: Pages Thumbnails -->
              <div id="kn-left-pane-pages" class="kn-pane-active" style="display: flex; flex-direction: column; gap: 10px;">
                <!-- Generated dynamically by PDF.js -->
              </div>

              <!-- Pane 2: Bookmarks -->
              <div id="kn-left-pane-bookmarks" style="display: none; flex-direction: column; gap: 8px;">
                <div id="kn-bookmarks-list" style="display: flex; flex-direction: column; gap: 8px;"></div>
              </div>

              <!-- Pane 3: Outline mirror -->
              <div id="kn-left-pane-outline" style="display: none; flex-direction: column; gap: 6px;">
                <div id="kn-left-outline-list" class="kn-outline-list"></div>
              </div>

              <!-- Pane 4: Notes mirror -->
              <div id="kn-left-pane-notes" style="display: none; flex-direction: column; gap: 10px;">
                <div id="kn-left-notes-list" style="display: flex; flex-direction: column; gap: 8px;"></div>
              </div>

              <!-- Pane 5: AI Help mirror -->
              <div id="kn-left-pane-ai" style="display: none; flex-direction: column; gap: 12px; padding: 4px;">
                <div style="background: var(--kn-surface); border: 1px solid var(--kn-border); border-radius: 8px; padding: 12px; text-align: center;">
                  <div style="font-size: 1.8rem; margin-bottom: 6px;">🤖</div>
                  <h4 style="font-size: 0.85rem; font-weight: 800; margin-bottom: 4px;">${isAr ? 'مساعد كورو الذكي' : 'Kuro AI Assistant'}</h4>
                  <p style="font-size: 0.75rem; color: var(--kn-text-muted); line-height: 1.4;">${isAr ? 'جاهز لتلخيص المحاضرة واستخراج النقاط السريرية الهامة فور تفعيل محرك الذكاء.' : 'Ready for clinical summaries and lecture insights.'}</p>
                </div>
              </div>
            </div>
          </aside>

          <!-- CENTER VIEWPORT: Document Canvas Area (Centered on soft cream backdrop) -->
          <main class="kn-document-viewport" id="kn-document-viewport" tabindex="0">
            <!-- Loading indicator -->
            <div id="kn-doc-loader" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; color: var(--kn-text);">
              <div style="font-size: 2.2rem; animation: kn-pulse 1.2s infinite ease-in-out;">🦷</div>
              <p style="font-weight: 700; font-size: 0.88rem; margin-top: 12px;">${isAr ? 'جاري فتح المحاضرة داخل Kuro Notes...' : 'Opening sheet in Kuro Notes...'}</p>
              <span style="font-size: 0.75rem; color: var(--kn-text-muted);">${displayDocName}</span>
            </div>

            <!-- Pages Container Centered -->
            <div class="kn-pages-container" id="kn-pages-container" style="display: none;">
              <!-- Generated dynamically per page: PDF Layer + Text Layer + Annotation Layer + Interaction Layer -->
            </div>
          </main>

          <!-- RIGHT SIDEBAR: Outline, Notes, AI Help -->
          <aside class="kn-sidebar-right" id="kn-sidebar-right" aria-label="Sheet Outline and Notes">
            <div class="kn-sidebar-tab-bar" role="tablist">
              <button class="kn-tab-pill active" id="kn-right-tab-outline" data-pane="outline" role="tab" aria-selected="true">${isAr ? 'المحتويات' : 'Outline'}</button>
              <button class="kn-tab-pill" id="kn-right-tab-notes" data-pane="notes" role="tab" aria-selected="false">${isAr ? `ملاحظات (${studentNotes.length})` : `Notes (${studentNotes.length})`}</button>
              <button class="kn-tab-pill" id="kn-right-tab-ai" data-pane="ai" role="tab" aria-selected="false">${isAr ? 'مساعد AI' : 'AI Help'}</button>
            </div>

            <div class="kn-sidebar-content" id="kn-right-sidebar-content" style="padding: 0;">
              <!-- Pane 1: Search & Clinical Outline -->
              <div id="kn-right-pane-outline" style="display: flex; flex-direction: column;">
                <input type="text" class="kn-outline-search" id="kn-outline-search" placeholder="${isAr ? '🔍 ابحث في عناصر الشيت...' : '🔍 Search in this sheet...'}" />
                <div class="kn-outline-list" id="kn-outline-list">
                  <!-- Rendered dynamically -->
                </div>
              </div>

              <!-- Pane 2: Student Notes Linked to Sheet -->
              <div id="kn-right-pane-notes" style="display: none; flex-direction: column; padding: 12px; gap: 10px;">
                <div style="display: flex; flex-direction: column; gap: 6px;">
                  <textarea id="kn-new-note-input" rows="2" placeholder="${isAr ? 'أضف ملاحظة دراسية جديدة حول هذه المحاضرة...' : 'Add a study note for this lecture...'}" style="width: 100%; box-sizing: border-box; background: var(--kn-bg); border: 1px solid var(--kn-border); border-radius: 8px; padding: 8px; font-size: 0.8rem; font-family: inherit; color: var(--kn-text); resize: none; outline: none;"></textarea>
                  <button id="kn-btn-save-note" class="kn-btn kn-btn-primary" style="align-self: flex-end; padding: 5px 12px; font-size: 0.76rem;">
                    <span>${isAr ? 'حفظ الملاحظة' : 'Save Note'}</span>
                  </button>
                </div>
                <div id="kn-right-notes-list" style="display: flex; flex-direction: column; gap: 8px; margin-top: 6px;"></div>
              </div>

              <!-- Pane 3: Kuro AI Assistant -->
              <div id="kn-right-pane-ai" style="display: none; flex-direction: column; padding: 14px; gap: 12px;">
                <div style="background: var(--kn-surface); border: 1px solid var(--kn-border); border-radius: 10px; padding: 14px; text-align: center;">
                  <div style="font-size: 2rem; margin-bottom: 8px;">🦷</div>
                  <h4 style="font-weight: 800; font-size: 0.88rem; margin: 0 0 6px;">${isAr ? 'مساعد كورو الأكاديمي' : 'Kuro AI Clinical Tutor'}</h4>
                  <p style="font-size: 0.77rem; color: var(--kn-text-muted); line-height: 1.4; margin: 0 0 12px;">${isAr ? 'يمكنك الاستفسار عن أي جزئية في هذا الشيت وسيقوم كورو بتبسيطها فورياً.' : 'Ask questions or request high-yield exam summaries for this sheet.'}</p>
                  <div style="display: flex; flex-direction: column; gap: 6px;">
                    <button class="kn-btn kn-btn-back" style="font-size: 0.75rem; text-align: start; width: 100%;" onclick="window.showToast?.('${isAr ? 'جاري تحضير ملخص المسببات... ⏳' : 'Preparing clinical summary... ⏳'}', {type: 'info'})">
                      <span>💡</span><span>${isAr ? 'لخص لي نظريات تسوس الأسنان' : 'Summarize Caries Etiology'}</span>
                    </button>
                    <button class="kn-btn kn-btn-back" style="font-size: 0.75rem; text-align: start; width: 100%;" onclick="window.showToast?.('${isAr ? 'جاري استخراج أسئلة الامتحانات... ⏳' : 'Generating practice questions... ⏳'}', {type: 'info'})">
                      <span>🎯</span><span>${isAr ? 'اختبرني في تصنيف التسوس' : 'Quiz me on Caries Classification'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <!-- ═══════════════════════════════════════════════════════════════
             4. DISTRACTION-FREE READING MODE FLOATING PILL
             ═══════════════════════════════════════════════════════════════ -->
        <div class="kn-reading-mode-pill" id="kn-reading-mode-pill" style="display: none;">
          <span>📄</span>
          <span>${isAr ? 'صفحة' : 'Page'} <strong id="kn-reading-page-num">1</strong> / <span id="kn-reading-total-num">${initialPages}</span></span>
          <button id="kn-btn-exit-reading-mode" title="${isAr ? 'الخروج من وضع ملء الشاشة' : 'Exit Distraction-Free Mode'}">✕ ${isAr ? 'خروج' : 'Exit'}</button>
        </div>

        <!-- ═══════════════════════════════════════════════════════════════
             5. PRESERVED ACADEMIC DISCUSSION SLIDE-OVER DRAWER
             ═══════════════════════════════════════════════════════════════ -->
        <div id="sheet-discussion-drawer" style="position: fixed; top: 0; bottom: 0; ${isAr ? 'left: 0;' : 'right: 0;'} width: min(440px, 94vw); background: #181926; z-index: 1000002; box-shadow: ${isAr ? '10px 0 45px rgba(0,0,0,0.6)' : '-10px 0 45px rgba(0,0,0,0.6)'}; display: flex; flex-direction: column; transform: ${isAr ? 'translateX(-100%)' : 'translateX(100%)'}; transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1); border-${isAr ? 'right' : 'left'}: 1px solid rgba(255,255,255,0.1); color: #F8FAFC; direction: ${isAr ? 'rtl' : 'ltr'}; font-family: inherit;">
          <div style="padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: space-between; background: #1F2133;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.3rem;">💬</span>
              <div>
                <h3 style="font-size: 0.95rem; font-weight: 800; margin: 0; color: #F8FAFC;">${isAr ? 'المناقشات والأسئلة الأكاديمية' : 'Academic Discussions'}</h3>
                <p style="font-size: 0.725rem; color: #94A3B8; margin: 2px 0 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px;">${title}</p>
              </div>
            </div>
            <button id="btn-close-discussion" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); color: #F8FAFC; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; font-size: 1.1rem; display: flex; align-items: center; justify-content: center;" title="${isAr ? 'إغلاق' : 'Close'}">✕</button>
          </div>

          <div style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.08); background: rgba(0,0,0,0.2);">
            <form id="form-post-comment" style="display: flex; flex-direction: column; gap: 10px;">
              <textarea id="comment-text-input" rows="2" placeholder="${isAr ? 'اطرح سؤالاً أو استفساراً علمياً حول هذه المحاضرة...' : 'Ask an academic question about this lecture...'}" style="width: 100%; background: #232536; border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #F8FAFC; padding: 10px 12px; font-size: 0.825rem; resize: none; font-family: inherit; outline: none; box-sizing: border-box;" required></textarea>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.725rem; color: #34D399; font-weight: 600;">+5 ${isAr ? 'نقاط للمشاركة 🌟' : 'Academic points 🌟'}</span>
                <button type="submit" style="background: #7E1D2A; color: #FFF; border: none; padding: 7px 16px; border-radius: 8px; font-size: 0.8rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                  <span>${isAr ? 'نشر السؤال' : 'Post Question'}</span>
                </button>
              </div>
            </form>
          </div>

          <div id="comments-list-container" style="flex: 1; overflow-y: auto; padding: 16px 18px; display: flex; flex-direction: column; gap: 12px;"></div>
        </div>

        <div id="discussion-backdrop" style="position: fixed; inset: 0; background: rgba(0,0,0,0.55); backdrop-filter: blur(2px); z-index: 1000001; display: none; opacity: 0; pointer-events: none !important; transition: opacity 0.25s ease;"></div>
      </div>
    `;

    // State Variables
    let pdfDoc = null;
    let activePage = 1;
    let totalPages = initialPages;
    let currentZoom = 1.2; // 120% default matching reference
    let isContinuousView = true;
    let isReadingMode = false;
    const pageRenderTasks = new Map();

    // DOM Elements
    const rootEl = document.getElementById('sheet-studio-fullscreen-root');
    const viewportEl = document.getElementById('kn-document-viewport');
    const pagesContainer = document.getElementById('kn-pages-container');
    const loaderEl = document.getElementById('kn-doc-loader');
    const leftSidebar = document.getElementById('kn-sidebar-left');
    const rightSidebar = document.getElementById('kn-sidebar-right');
    const pageInput = document.getElementById('kn-page-input');
    const pageTotalNum = document.getElementById('kn-page-total-num');
    const zoomText = document.getElementById('kn-zoom-text');
    const readingPill = document.getElementById('kn-reading-mode-pill');
    const readingPageNum = document.getElementById('kn-reading-page-num');
    const readingTotalNum = document.getElementById('kn-reading-total-num');

    // ─────────────────────────────────────────────────────────────────────────
    // A. BACK NAVIGATION
    // ─────────────────────────────────────────────────────────────────────────
    const btnBack = document.getElementById('kn-btn-back');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        document.body.classList.remove('studio-fullscreen-active');
        if (sheet && sheet.subject_id) {
          window.location.hash = '#/sheets?subject=' + sheet.subject_id;
        } else if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.hash = '#/sheets';
        }
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // B. SIDEBARS TOGGLE
    // ─────────────────────────────────────────────────────────────────────────
    const btnToggleLeft = document.getElementById('kn-btn-toggle-left');
    if (btnToggleLeft && leftSidebar) {
      btnToggleLeft.addEventListener('click', () => {
        leftSidebar.classList.toggle('kn-sidebar-collapsed');
      });
    }

    const btnToggleRight = document.getElementById('kn-btn-toggle-right');
    if (btnToggleRight && rightSidebar) {
      btnToggleRight.addEventListener('click', () => {
        rightSidebar.classList.toggle('kn-sidebar-collapsed');
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // C. TABS SWITCHING (LEFT & RIGHT SIDEBARS)
    // ─────────────────────────────────────────────────────────────────────────
    function setupTabSwitching(sidebarSelector) {
      const sb = document.querySelector(sidebarSelector);
      if (!sb) return;
      const tabs = sb.querySelectorAll('.kn-tab-pill');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const targetPane = tab.getAttribute('data-pane');
          tabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
          });
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');

          const isLeft = sidebarSelector.includes('left');
          const prefix = isLeft ? 'kn-left-pane-' : 'kn-right-pane-';
          const panes = isLeft
            ? ['pages', 'bookmarks', 'outline', 'notes', 'ai']
            : ['outline', 'notes', 'ai'];

          panes.forEach(p => {
            const el = document.getElementById(prefix + p);
            if (el) el.style.display = (p === targetPane) ? 'flex' : 'none';
          });
        });
      });
    }
    setupTabSwitching('#kn-sidebar-left');
    setupTabSwitching('#kn-sidebar-right');

    // ─────────────────────────────────────────────────────────────────────────
    // D. ANNOTATION TOOLS SELECTION (Radiogroup with subtle tactile feedback)
    // ─────────────────────────────────────────────────────────────────────────
    const toolButtons = rootEl.querySelectorAll('.kn-group-tools .kn-tool-btn');
    toolButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        toolButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');

        const toolName = btn.getAttribute('data-tool');
        if (toolName === 'ai') {
          // Open AI tab on right sidebar
          const aiTab = document.getElementById('kn-right-tab-ai');
          if (aiTab) aiTab.click();
          if (rightSidebar.classList.contains('kn-sidebar-collapsed')) {
            rightSidebar.classList.remove('kn-sidebar-collapsed');
          }
        }
      });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // E. ZOOM ENGINE (Out, In, Presets, Fit-Width, Fit-Page)
    // ─────────────────────────────────────────────────────────────────────────
    function setZoom(newZoom) {
      currentZoom = Math.min(2.5, Math.max(0.4, Math.round(newZoom * 100) / 100));
      const pct = Math.round(currentZoom * 100);
      if (zoomText) zoomText.textContent = `${pct}%`;

      // Update dropdown active highlight
      const zoomDropdown = document.getElementById('kn-zoom-dropdown');
      if (zoomDropdown) {
        zoomDropdown.querySelectorAll('.kn-dropdown-item').forEach(item => {
          const zVal = parseFloat(item.getAttribute('data-zoom'));
          if (!isNaN(zVal) && Math.round(zVal * 100) === pct) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }

      // Apply zoom to pages
      applyZoomToViewport();
    }

    function applyZoomToViewport() {
      if (!pagesContainer) return;
      pagesContainer.style.transform = `scale(${currentZoom / 1.2})`;
      pagesContainer.style.transformOrigin = 'top center';
    }

    const btnZoomIn = document.getElementById('kn-btn-zoom-in');
    if (btnZoomIn) {
      btnZoomIn.addEventListener('click', () => setZoom(currentZoom + 0.15));
    }

    const btnZoomOut = document.getElementById('kn-btn-zoom-out');
    if (btnZoomOut) {
      btnZoomOut.addEventListener('click', () => setZoom(currentZoom - 0.15));
    }

    const btnZoomLevel = document.getElementById('kn-btn-zoom-level');
    const zoomDropdown = document.getElementById('kn-zoom-dropdown');
    if (btnZoomLevel && zoomDropdown) {
      btnZoomLevel.addEventListener('click', (e) => {
        e.stopPropagation();
        zoomDropdown.classList.toggle('open');
      });
      zoomDropdown.querySelectorAll('.kn-dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
          zoomDropdown.classList.remove('open');
          const zVal = item.getAttribute('data-zoom');
          if (zVal === 'fit-width') {
            const pageCard = pagesContainer?.querySelector('.kn-page-card');
            const pWidth = pageCard ? pageCard.offsetWidth : 600;
            const availableW = viewportEl.clientWidth - 64;
            setZoom(1.2 * (availableW / pWidth));
          } else if (zVal === 'fit-page') {
            const pageCard = pagesContainer?.querySelector('.kn-page-card');
            const pHeight = pageCard ? pageCard.offsetHeight : 800;
            const availableH = viewportEl.clientHeight - 64;
            setZoom(1.2 * (availableH / pHeight));
          } else {
            const num = parseFloat(zVal);
            if (!isNaN(num)) setZoom(num);
          }
        });
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // F. PAGE NAVIGATION (Prev, Next, Direct Input, Scroll Observer)
    // ─────────────────────────────────────────────────────────────────────────
    function scrollToPage(pageNum, smooth = true) {
      pageNum = Math.max(1, Math.min(totalPages, pageNum));
      activePage = pageNum;
      if (pageInput) pageInput.value = pageNum;
      if (readingPageNum) readingPageNum.textContent = pageNum;

      // Update thumbnail active border
      updateActiveThumbnail(pageNum);

      // Scroll target page card into view
      const targetCard = document.getElementById(`kn-page-card-${pageNum}`);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant', block: 'start' });
      }
    }

    function updateActiveThumbnail(pageNum) {
      const thumbs = document.querySelectorAll('.kn-thumbnail-item');
      thumbs.forEach(t => {
        const p = parseInt(t.getAttribute('data-page'), 10);
        if (p === pageNum) {
          t.classList.add('active');
          t.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          t.classList.remove('active');
        }
      });
    }

    const btnPrevPage = document.getElementById('kn-btn-prev-page');
    if (btnPrevPage) {
      btnPrevPage.addEventListener('click', () => scrollToPage(activePage - 1));
    }

    const btnNextPage = document.getElementById('kn-btn-next-page');
    if (btnNextPage) {
      btnNextPage.addEventListener('click', () => scrollToPage(activePage + 1));
    }

    if (pageInput) {
      pageInput.addEventListener('change', () => {
        const val = parseInt(pageInput.value, 10);
        if (!isNaN(val)) scrollToPage(val);
      });
      pageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const val = parseInt(pageInput.value, 10);
          if (!isNaN(val)) scrollToPage(val);
          pageInput.blur();
        }
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // G. DISTRACTION-FREE FULLSCREEN READING MODE
    // ─────────────────────────────────────────────────────────────────────────
    function toggleReadingMode(enable) {
      isReadingMode = typeof enable === 'boolean' ? enable : !isReadingMode;
      if (isReadingMode) {
        rootEl.classList.add('kn-reading-mode');
        if (readingPill) readingPill.style.display = 'flex';
        if (readingPageNum) readingPageNum.textContent = activePage;
      } else {
        rootEl.classList.remove('kn-reading-mode');
        if (readingPill) readingPill.style.display = 'none';
      }
    }

    const btnFullscreen = document.getElementById('kn-btn-fullscreen');
    if (btnFullscreen) btnFullscreen.addEventListener('click', () => toggleReadingMode(true));

    const btnExitReading = document.getElementById('kn-btn-exit-reading-mode');
    if (btnExitReading) btnExitReading.addEventListener('click', () => toggleReadingMode(false));

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isReadingMode) {
        toggleReadingMode(false);
      }
    });

    // ─────────────────────────────────────────────────────────────────────────
    // H. BOOKMARKS TOGGLING
    // ─────────────────────────────────────────────────────────────────────────
    const btnBookmark = document.getElementById('kn-btn-bookmark');
    function renderBookmarksList() {
      const listEl = document.getElementById('kn-bookmarks-list');
      if (!listEl) return;
      if (bookmarks.length === 0) {
        listEl.innerHTML = `
          <div style="text-align: center; padding: 30px 10px; color: var(--kn-text-muted); font-size: 0.8rem;">
            <div style="font-size: 1.6rem; margin-bottom: 6px;">🔖</div>
            <p>${isAr ? 'لا توجد علامات مرجعية حتى الآن. اضغط 🔖 لحفظ الصفحة الحالية.' : 'No bookmarks yet. Tap 🔖 to bookmark a page.'}</p>
          </div>
        `;
        return;
      }
      listEl.innerHTML = bookmarks.map(p => `
        <div class="kn-outline-item" data-page="${p}" style="display: flex; justify-content: space-between; align-items: center;">
          <span style="display: flex; align-items: center; gap: 6px;">
            <span>🔖</span>
            <span>${isAr ? `صفحة ${p}` : `Page ${p}`}</span>
          </span>
          <span style="font-size: 0.72rem; color: var(--kn-text-muted);">${title.slice(0, 16)}...</span>
        </div>
      `).join('');
      listEl.querySelectorAll('.kn-outline-item').forEach(item => {
        item.addEventListener('click', () => {
          const p = parseInt(item.getAttribute('data-page'), 10);
          scrollToPage(p);
        });
      });
    }

    if (btnBookmark) {
      btnBookmark.addEventListener('click', () => {
        const cur = activePage;
        const idx = bookmarks.indexOf(cur);
        if (idx === -1) {
          bookmarks.push(cur);
          bookmarks.sort((a, b) => a - b);
          btnBookmark.classList.add('active');
          btnBookmark.querySelector('svg').setAttribute('fill', '#7E1D2A');
          if (window.showToast) window.showToast(isAr ? `تمت إضافة صفحة ${cur} للعلامات المرجعية 🔖` : `Page ${cur} bookmarked 🔖`, { type: 'success' });
        } else {
          bookmarks.splice(idx, 1);
          btnBookmark.classList.remove('active');
          btnBookmark.querySelector('svg').setAttribute('fill', 'none');
          if (window.showToast) window.showToast(isAr ? `تمت إزالة صفحة ${cur} من العلامات 🔖` : `Page ${cur} unbookmarked 🔖`, { type: 'info' });
        }
        localStorage.setItem(bookmarksKey, JSON.stringify(bookmarks));
        renderBookmarksList();
      });
    }
    renderBookmarksList();

    // ─────────────────────────────────────────────────────────────────────────
    // I. STUDENT NOTES ENGINE
    // ─────────────────────────────────────────────────────────────────────────
    function renderNotes() {
      const rList = document.getElementById('kn-right-notes-list');
      const lList = document.getElementById('kn-left-notes-list');
      const tabCount = document.getElementById('kn-tab-notes');
      const rTabCount = document.getElementById('kn-right-tab-notes');

      if (tabCount) tabCount.textContent = isAr ? `ملاحظات (${studentNotes.length})` : `Notes (${studentNotes.length})`;
      if (rTabCount) rTabCount.textContent = isAr ? `ملاحظات (${studentNotes.length})` : `Notes (${studentNotes.length})`;

      const html = studentNotes.length === 0
        ? `<div style="text-align: center; padding: 24px 10px; color: var(--kn-text-muted); font-size: 0.8rem;">
             <p>${isAr ? 'لا توجد ملاحظات مدونة بعد.' : 'No notes written yet.'}</p>
           </div>`
        : studentNotes.map(n => `
          <div style="background: var(--kn-surface); border: 1px solid var(--kn-border); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 6px;">
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem; color: var(--kn-text-muted);">
              <span>📅 ${n.date}</span>
              <button class="kn-btn-delete-note" data-id="${n.id}" style="background: none; border: none; cursor: pointer; color: #EF4444; font-size: 0.75rem;" title="${isAr ? 'حذف' : 'Delete'}">🗑️</button>
            </div>
            <p style="margin: 0; font-size: 0.8rem; line-height: 1.45; color: var(--kn-text); white-space: pre-wrap;">${n.text}</p>
          </div>
        `).join('');

      if (rList) rList.innerHTML = html;
      if (lList) lList.innerHTML = html;

      // Attach note deletion handlers
      document.querySelectorAll('.kn-btn-delete-note').forEach(btn => {
        btn.addEventListener('click', () => {
          const nId = btn.getAttribute('data-id');
          studentNotes = studentNotes.filter(n => n.id !== nId);
          localStorage.setItem(notesKey, JSON.stringify(studentNotes));
          renderNotes();
          if (window.showToast) window.showToast(isAr ? 'تم حذف الملاحظة' : 'Note deleted', { type: 'info' });
        });
      });
    }

    const btnSaveNote = document.getElementById('kn-btn-save-note');
    if (btnSaveNote) {
      btnSaveNote.addEventListener('click', () => {
        const input = document.getElementById('kn-new-note-input');
        const text = input ? input.value.trim() : '';
        if (!text) return;
        const d = new Date();
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        studentNotes.unshift({ id: 'n_' + Date.now(), text, date: dateStr });
        localStorage.setItem(notesKey, JSON.stringify(studentNotes));
        input.value = '';
        renderNotes();
        if (window.showToast) window.showToast(isAr ? 'تم حفظ الملاحظة بنجاح 📝' : 'Note saved successfully 📝', { type: 'success' });
      });
    }
    renderNotes();

    // ─────────────────────────────────────────────────────────────────────────
    // J. HIERARCHICAL OUTLINE RENDERING & SEARCH
    // ─────────────────────────────────────────────────────────────────────────
    function renderOutline(filterQuery = '') {
      const q = filterQuery.toLowerCase().trim();
      const listEl = document.getElementById('kn-outline-list');
      const leftListEl = document.getElementById('kn-left-outline-list');
      if (!listEl) return;

      const flat = [];
      clinicalOutline.forEach(item => {
        if (!q || item.title.toLowerCase().includes(q)) {
          flat.push(item);
        }
        if (item.children) {
          item.children.forEach(sub => {
            if (!q || sub.title.toLowerCase().includes(q) || item.title.toLowerCase().includes(q)) {
              flat.push({ ...sub, isSub: true });
            }
          });
        }
      });

      const html = flat.map(item => `
        <div class="kn-outline-item ${item.isSub ? 'sub-item' : ''} ${item.active ? 'active' : ''}" data-target-page="${item.page}">
          <span style="font-size: 0.85rem;">${item.isSub ? '↳' : '📌'}</span>
          <span>${item.title}</span>
        </div>
      `).join('');

      listEl.innerHTML = html;
      if (leftListEl) leftListEl.innerHTML = html;

      // Click to navigate to page
      [listEl, leftListEl].forEach(container => {
        if (!container) return;
        container.querySelectorAll('.kn-outline-item').forEach(el => {
          el.addEventListener('click', () => {
            document.querySelectorAll('.kn-outline-item').forEach(i => i.classList.remove('active'));
            el.classList.add('active');
            const p = parseInt(el.getAttribute('data-target-page'), 10);
            if (!isNaN(p)) scrollToPage(p);
          });
        });
      });
    }
    renderOutline();

    const outlineSearch = document.getElementById('kn-outline-search');
    if (outlineSearch) {
      outlineSearch.addEventListener('input', (e) => {
        renderOutline(e.target.value);
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // K. SHARE, MORE MENU & PRESERVED ACTIONS
    // ─────────────────────────────────────────────────────────────────────────
    const btnShare = document.getElementById('kn-btn-share');
    if (btnShare) {
      btnShare.addEventListener('click', async () => {
        const shareData = {
          title: title,
          text: `${title} — Kuro Notes Dental Platform`,
          url: window.location.href
        };
        if (navigator.share) {
          try {
            await navigator.share(shareData);
          } catch (e) {}
        } else {
          navigator.clipboard?.writeText(window.location.href);
          if (window.showToast) {
            window.showToast(isAr ? 'تم نسخ رابط الشيت إلى الحافظة 📋' : 'Sheet link copied to clipboard 📋', { type: 'success' });
          }
        }
      });
    }

    const btnMore = document.getElementById('kn-btn-more');
    const moreDropdown = document.getElementById('kn-more-dropdown');
    if (btnMore && moreDropdown) {
      btnMore.addEventListener('click', (e) => {
        e.stopPropagation();
        moreDropdown.classList.toggle('open');
      });
    }

    const copyMenuBtn = document.getElementById('kn-btn-copy-menu');
    const copyDropdown = document.getElementById('kn-copy-dropdown');
    if (copyMenuBtn && copyDropdown) {
      copyMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        copyDropdown.classList.toggle('open');
      });
    }

    document.addEventListener('click', (e) => {
      if (moreDropdown && !e.target.closest('#kn-more-dropdown-wrap')) {
        moreDropdown.classList.remove('open');
      }
      if (copyDropdown && !e.target.closest('#kn-copy-dropdown-wrap')) {
        copyDropdown.classList.remove('open');
      }
      if (zoomDropdown && !e.target.closest('#kn-zoom-dropdown-wrap')) {
        zoomDropdown.classList.remove('open');
      }
    });

    // More actions bindings
    const actDownload = document.getElementById('kn-action-download');
    if (actDownload) {
      actDownload.addEventListener('click', () => {
        moreDropdown?.classList.remove('open');
        const dlUrl = sheet.download_url || sheet.pdf_url;
        if (dlUrl) {
          const a = document.createElement('a');
          a.href = dlUrl;
          a.download = displayDocName;
          a.target = '_blank';
          a.click();
        } else if (window.showToast) {
          window.showToast(isAr ? 'جاري تجهيز التحميل...' : 'Preparing download...', { type: 'info' });
        }
      });
    }

    const actPrint = document.getElementById('kn-action-print');
    if (actPrint) {
      actPrint.addEventListener('click', () => {
        moreDropdown?.classList.remove('open');
        window.print();
      });
    }

    const actFitWidth = document.getElementById('kn-action-fit-width');
    if (actFitWidth) {
      actFitWidth.addEventListener('click', () => {
        moreDropdown?.classList.remove('open');
        const pageCard = pagesContainer?.querySelector('.kn-page-card');
        const pWidth = pageCard ? pageCard.offsetWidth : 600;
        setZoom(1.2 * ((viewportEl.clientWidth - 64) / pWidth));
      });
    }

    const actFitPage = document.getElementById('kn-action-fit-page');
    if (actFitPage) {
      actFitPage.addEventListener('click', () => {
        moreDropdown?.classList.remove('open');
        const pageCard = pagesContainer?.querySelector('.kn-page-card');
        const pHeight = pageCard ? pageCard.offsetHeight : 800;
        setZoom(1.2 * ((viewportEl.clientHeight - 64) / pHeight));
      });
    }

    const actFs = document.getElementById('kn-action-fullscreen');
    if (actFs) {
      actFs.addEventListener('click', () => {
        moreDropdown?.classList.remove('open');
        toggleReadingMode(true);
      });
    }

    const actInfo = document.getElementById('kn-action-doc-info');
    if (actInfo) {
      actInfo.addEventListener('click', () => {
        moreDropdown?.classList.remove('open');
        alert(
          `${title}\n\n` +
          `${isAr ? 'المادة:' : 'Subject:'} ${subjectName}\n` +
          `${isAr ? 'المحاضر:' : 'Lecturer:'} ${doctorName || 'Faculty of Dentistry'}\n` +
          `${isAr ? 'الصفحات:' : 'Pages:'} ${totalPages}\n` +
          `${isAr ? 'تاريخ التحديث:' : 'Date:'} ${date}`
        );
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // L. PRESERVED DISCUSSION DRAWER LOGIC
    // ─────────────────────────────────────────────────────────────────────────
    const drawerEl = document.getElementById('sheet-discussion-drawer');
    const backdropEl = document.getElementById('discussion-backdrop');
    const btnCloseDisc = document.getElementById('btn-close-discussion');
    const formPostComment = document.getElementById('form-post-comment');
    const actDisc = document.getElementById('kn-action-discussion');

    function openDiscussionDrawer() {
      if (!drawerEl || !backdropEl) return;
      drawerEl.classList.add('open');
      drawerEl.style.transform = 'translateX(0)';
      backdropEl.style.display = 'block';
      backdropEl.style.pointerEvents = 'auto';
      setTimeout(() => { backdropEl.style.opacity = '1'; }, 10);
    }

    function closeDiscussionDrawer() {
      if (!drawerEl || !backdropEl) return;
      drawerEl.classList.remove('open');
      drawerEl.style.transform = isAr ? 'translateX(-100%)' : 'translateX(100%)';
      backdropEl.style.opacity = '0';
      backdropEl.style.pointerEvents = 'none';
      setTimeout(() => {
        if (!drawerEl.classList.contains('open')) {
          backdropEl.style.display = 'none';
        }
      }, 260);
    }

    if (actDisc) {
      actDisc.addEventListener('click', () => {
        moreDropdown?.classList.remove('open');
        openDiscussionDrawer();
      });
    }
    if (btnCloseDisc) btnCloseDisc.addEventListener('click', closeDiscussionDrawer);
    if (backdropEl) backdropEl.addEventListener('click', closeDiscussionDrawer);

    function renderCommentsList() {
      const listEl = document.getElementById('comments-list-container');
      if (!listEl) return;
      if (comments.length === 0) {
        listEl.innerHTML = `
          <div style="text-align: center; padding: 40px 16px; color: #94A3B8;">
            <div style="font-size: 2.2rem; margin-bottom: 10px;">💭</div>
            <p style="font-size: 0.9rem; font-weight: 700; color: #E2E8F0; margin-bottom: 4px;">
              ${isAr ? 'لا توجد أسئلة أو مناقشات حالياً' : 'No discussions yet'}
            </p>
            <p style="font-size: 0.775rem; color: #94A3B8;">
              ${isAr ? 'كن أول من يطرح استفساراً واكسب 5 نقاط أكاديمية فوراً!' : 'Be the first to ask a question and earn 5 academic points!'}
            </p>
          </div>
        `;
        return;
      }
      listEl.innerHTML = comments.map(c => `
        <div style="background: #232536; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 12px 14px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 700; font-size: 0.8rem; color: #F1F5F9;">${c.author || (isAr ? 'طالب' : 'Student')}</span>
            <span style="font-size: 0.7rem; color: #94A3B8;">${c.time || ''}</span>
          </div>
          <p style="font-size: 0.825rem; color: #CBD5E1; margin: 0; line-height: 1.5; white-space: pre-wrap;">${c.text}</p>
          ${c.reply ? `
            <div style="background: rgba(126, 29, 42, 0.18); border-right: 3px solid #7E1D2A; padding: 8px 10px; border-radius: 6px 0 0 6px; margin-top: 4px; font-size: 0.775rem; color: #FECDD3; line-height: 1.4;">
              <div style="font-weight: 700; margin-bottom: 2px; color: #F43F5E;">${isAr ? 'رد وتوضيح معتمد:' : 'Verified Answer:'}</div>
              ${c.reply}
            </div>
          ` : ''}
        </div>
      `).join('');
    }

    if (formPostComment) {
      formPostComment.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('comment-text-input');
        const text = input ? input.value.trim() : '';
        if (!text) return;
        const newC = {
          id: 'c_' + Date.now(),
          author: isAr ? 'طالب طب أسنان (أنت)' : 'Dental Student (You)',
          time: isAr ? 'الآن' : 'Just now',
          text: text,
          reply: null
        };
        comments.unshift(newC);
        localStorage.setItem(commentsKey, JSON.stringify(comments));
        input.value = '';
        renderCommentsList();
        if (window.showToast) window.showToast(isAr ? 'تم نشر سؤالك بنجاح (+5 نقاط) 🌟' : 'Question posted (+5 pts) 🌟', { type: 'success' });
      });
    }
    renderCommentsList();

    // ─────────────────────────────────────────────────────────────────────────
    // M. PRESERVED STRUCTURED COPY SHEET ENGINE
    // ─────────────────────────────────────────────────────────────────────────
    const actCopyPage = document.getElementById('kn-action-copy-page');
    if (actCopyPage) {
      actCopyPage.addEventListener('click', async () => {
        copyDropdown?.classList.remove('open');
        if (!pdfDoc || !window.SheetCopyEngine) {
          if (window.showToast) window.showToast(isAr ? 'جاري تحميل ملف الشيت، انتظر لحظات...' : 'Loading PDF, please wait...', { type: 'info' });
          return;
        }
        try {
          const pageProxy = await pdfDoc.getPage(activePage);
          const txt = await window.SheetCopyEngine.extractPageText(pageProxy, {
            pageNum: activePage,
            totalPages: totalPages,
            sheetTitle: title,
            isAr: isAr
          });
          const ok = await window.SheetCopyEngine.copyToClipboard(txt);
          if (ok && window.showToast) {
            window.showToast(isAr ? `تم نسخ صفحة (${activePage}) مرتبة بالحافظة بنجاح! 📋` : `Page (${activePage}) text copied to clipboard! 📋`, { type: 'success' });
          }
        } catch (e) {
          if (window.showToast) window.showToast(isAr ? 'تعذر استخراج النصوص' : 'Extraction error', { type: 'error' });
        }
      });
    }

    const actCopyFull = document.getElementById('kn-action-copy-full');
    if (actCopyFull) {
      actCopyFull.addEventListener('click', async () => {
        copyDropdown?.classList.remove('open');
        if (!pdfDoc || !window.SheetCopyEngine) {
          if (window.showToast) window.showToast(isAr ? 'جاري تحميل ملف الشيت، انتظر لحظات...' : 'Loading PDF, please wait...', { type: 'info' });
          return;
        }
        try {
          if (window.showToast) window.showToast(isAr ? 'جاري استخراج وترتيب كامل الشيت... ⏳' : 'Extracting full sheet... ⏳', { type: 'info' });
          const fullTxt = await window.SheetCopyEngine.extractDocumentText(pdfDoc, {
            sheetTitle: title
          });
          const ok = await window.SheetCopyEngine.copyToClipboard(fullTxt);
          if (ok && window.showToast) {
            window.showToast(isAr ? `تم نسخ كامل الشيت (${totalPages} صفحة) منسقاً بنجاح 🌟` : `Full sheet (${totalPages} pages) copied! 🌟`, { type: 'success' });
          }
        } catch (e) {
          if (window.showToast) window.showToast(isAr ? 'حدث خطأ أثناء نسخ كامل الشيت' : 'Error copying full sheet', { type: 'error' });
        }
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // N. HIGH-PERFORMANCE PDF.js ENGINE & VIRTUALIZED RENDERING
    // ─────────────────────────────────────────────────────────────────────────
    async function initKuroNotesPdfEngine() {
      try {
        let pdfUrl = sheet.pdf_url;
        if (!pdfUrl && window.DATA && window.DATA.pdfStore) {
          pdfUrl = await window.DATA.pdfStore.getPdfUrl(sheet.id);
        }
        if (!pdfUrl) {
          pdfUrl = 'data/sheets/dental-caries-prevention.pdf';
        }

        // Check if PDF.js is ready
        if (!window.pdfjsLib) {
          console.warn('PDF.js lib not yet available, waiting...');
          setTimeout(initKuroNotesPdfEngine, 200);
          return;
        }

        // Configure PDF.js worker
        if (!window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }

        // Load PDF Document
        const loadingTask = window.pdfjsLib.getDocument({
          url: pdfUrl,
          cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
          cMapPacked: true
        });

        pdfDoc = await loadingTask.promise;
        totalPages = pdfDoc.numPages || initialPages;

        if (pageTotalNum) pageTotalNum.textContent = totalPages;
        if (readingTotalNum) readingTotalNum.textContent = totalPages;
        if (pageInput) pageInput.max = totalPages;

        // Hide loader, show pages
        if (loaderEl) loaderEl.style.display = 'none';
        if (pagesContainer) pagesContainer.style.display = 'flex';

        // Build thumbnail skeleton in left sidebar & page skeletons in viewport
        buildPagesSkeletons(totalPages);

        // Render Page 1 immediately, then setup intersection observer for lazy rendering
        await renderPageCard(1);
        renderThumbnailsSequentially(totalPages);

        // Setup scroll observer to update page indicators
        setupViewportScrollObserver();

      } catch (err) {
        console.error('Kuro Notes PDF Engine Load Error:', err);
        // Fallback: render high-fidelity canvas simulation for seamless studying
        renderHighFidelityFallback(initialPages);
      }
    }

    function buildPagesSkeletons(numPages) {
      if (!pagesContainer) return;
      pagesContainer.innerHTML = '';
      const leftThumbList = document.getElementById('kn-left-pane-pages');
      if (leftThumbList) leftThumbList.innerHTML = '';

      for (let p = 1; p <= numPages; p++) {
        // 1. Viewport Page Card with Layered Architecture
        const card = document.createElement('div');
        card.className = 'kn-page-card';
        card.id = `kn-page-card-${p}`;
        card.setAttribute('data-page-number', p);
        card.style.width = '720px';
        card.style.height = '960px'; // High aspect ratio placeholder

        card.innerHTML = `
          <!-- 1. PDF Canvas Layer -->
          <canvas class="kn-pdf-canvas" id="kn-pdf-canvas-${p}"></canvas>
          <!-- 2. Selectable Text Layer -->
          <div class="kn-text-layer textLayer" id="kn-text-layer-${p}"></div>
          <!-- 3. Annotation Layer (Canvas Overlay for future pen & highlighter) -->
          <canvas class="kn-annotation-layer" id="kn-annotation-layer-${p}"></canvas>
          <!-- 4. UI Interaction Layer -->
          <div class="kn-interaction-layer" id="kn-interaction-layer-${p}"></div>
        `;
        pagesContainer.appendChild(card);

        // 2. Left Sidebar Thumbnail Item
        if (leftThumbList) {
          const thumb = document.createElement('div');
          thumb.className = `kn-thumbnail-item ${p === 1 ? 'active' : ''}`;
          thumb.id = `kn-thumb-page-${p}`;
          thumb.setAttribute('data-page', p);
          thumb.innerHTML = `
            <span class="kn-thumb-index" id="kn-thumb-index-${p}">${p}</span>
            <div class="kn-thumb-preview">
              <canvas id="kn-thumb-canvas-${p}"></canvas>
            </div>
          `;
          thumb.addEventListener('click', () => scrollToPage(p));
          leftThumbList.appendChild(thumb);
        }
      }
    }

    async function renderPageCard(pageNum) {
      if (!pdfDoc || pageNum < 1 || pageNum > totalPages) return;
      const canvas = document.getElementById(`kn-pdf-canvas-${pageNum}`);
      const textLayerDiv = document.getElementById(`kn-text-layer-${pageNum}`);
      const pageCard = document.getElementById(`kn-page-card-${pageNum}`);
      if (!canvas || !pageCard) return;

      try {
        const page = await pdfDoc.getPage(pageNum);
        const unscaledViewport = page.getViewport({ scale: 1.0 });

        // Set card dimensions matching page aspect ratio
        const standardWidth = 720;
        const scale = standardWidth / unscaledViewport.width;
        const viewport = page.getViewport({ scale });

        pageCard.style.width = `${viewport.width}px`;
        pageCard.style.height = `${viewport.height}px`;

        // Retina Sharpness Scaling
        const outputScale = window.devicePixelRatio || 2.0;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        const ctx = canvas.getContext('2d');
        ctx.scale(outputScale, outputScale);

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport
        };

        // Cancel previous render task if running
        if (pageRenderTasks.has(pageNum)) {
          pageRenderTasks.get(pageNum).cancel();
        }
        const renderTask = page.render(renderContext);
        pageRenderTasks.set(pageNum, renderTask);

        await renderTask.promise;
        pageRenderTasks.delete(pageNum);

        // Render Selectable Text Layer
        if (textLayerDiv && window.pdfjsLib && typeof window.pdfjsLib.renderTextLayer === 'function') {
          textLayerDiv.innerHTML = '';
          const textContent = await page.getTextContent();
          await window.pdfjsLib.renderTextLayer({
            textContentSource: textContent,
            container: textLayerDiv,
            viewport: viewport,
            textDivs: []
          }).promise;
        }

      } catch (e) {
        if (e.name !== 'RenderingCancelledException') {
          console.error(`Error rendering page ${pageNum}:`, e);
        }
      }
    }

    async function renderThumbnailsSequentially(numPages) {
      for (let p = 1; p <= numPages; p++) {
        try {
          const thumbCanvas = document.getElementById(`kn-thumb-canvas-${p}`);
          if (!thumbCanvas || !pdfDoc) continue;
          const page = await pdfDoc.getPage(p);
          const thumbViewport = page.getViewport({ scale: 0.22 });
          thumbCanvas.width = thumbViewport.width;
          thumbCanvas.height = thumbViewport.height;
          const ctx = thumbCanvas.getContext('2d');
          await page.render({ canvasContext: ctx, viewport: thumbViewport }).promise;
        } catch (e) {}
      }
    }

    function setupViewportScrollObserver() {
      if (!viewportEl) return;
      let scrollDebounce = null;
      viewportEl.addEventListener('scroll', () => {
        if (scrollDebounce) cancelAnimationFrame(scrollDebounce);
        scrollDebounce = requestAnimationFrame(() => {
          const cards = viewportEl.querySelectorAll('.kn-page-card');
          const vpTop = viewportEl.scrollTop + 80;
          for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            const top = card.offsetTop;
            const bottom = top + card.offsetHeight;
            if (vpTop >= top && vpTop < bottom) {
              const p = parseInt(card.getAttribute('data-page-number'), 10);
              if (p && p !== activePage) {
                activePage = p;
                if (pageInput) pageInput.value = p;
                if (readingPageNum) readingPageNum.textContent = p;
                updateActiveThumbnail(p);
                // Also render neighbor pages for virtual scrolling
                renderPageCard(p);
                if (p > 1) renderPageCard(p - 1);
                if (p < totalPages) renderPageCard(p + 1);
              }
              break;
            }
          }
        });
      }, { passive: true });
    }

    function renderHighFidelityFallback(numPages) {
      if (loaderEl) loaderEl.style.display = 'none';
      if (pagesContainer) pagesContainer.style.display = 'flex';
      buildPagesSkeletons(numPages);

      for (let p = 1; p <= numPages; p++) {
        const canvas = document.getElementById(`kn-pdf-canvas-${p}`);
        if (!canvas) continue;
        canvas.width = 1440;
        canvas.height = 1920;
        canvas.style.width = '720px';
        canvas.style.height = '960px';
        const ctx = canvas.getContext('2d');

        // Draw crisp dental lecture page
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 1440, 1920);

        ctx.fillStyle = '#0284C7';
        ctx.font = 'bold 44px Inter, sans-serif';
        ctx.fillText(title, 80, 120);

        ctx.fillStyle = '#7E1D2A';
        ctx.font = 'bold 32px Inter, sans-serif';
        ctx.fillText(p === 1 ? 'Part 1: Overview, Classification & Etiology Theories' : `Lecture Section — Slide ${p}`, 80, 190);

        ctx.fillStyle = '#1E293B';
        ctx.font = '28px Inter, sans-serif';
        const lines = p === 1 ? [
          '1. Definition of Dental Caries:',
          '   • WHO Definition: A localized post-eruptive pathological process of chemical origin',
          '     involving the dissolution of the hard tissues and proceeding to the formation of a cavity.',
          '   • An irreversible, infectious, microbiologic disease of the calcified tissues of teeth.',
          '',
          '2. Classification of Dental Caries:',
          '   • Acute Caries: Rapid progression, lighter color, early pulp exposure risk.',
          '   • Chronic Caries: Long-standing/slow progression, dark brown/black color.',
          '   • Arrested Caries: Static lesion with brown pigmentation, sclerotic tertiary dentin.'
        ] : [
          `Key Concepts & Clinical Pathology — Topic Unit ${p}`,
          '• Microbial biofilm interaction with fermentable carbohydrates.',
          '• Critical pH threshold for enamel demineralization (pH 5.5).',
          '• Salivary buffering capacity and remineralization dynamics with Fluoride.',
          '• Clinical assessment using ICDAS criteria.'
        ];

        let y = 280;
        lines.forEach(l => {
          ctx.fillText(l, 80, y);
          y += 54;
        });

        // Thumbnail simulation
        const thumbCanvas = document.getElementById(`kn-thumb-canvas-${p}`);
        if (thumbCanvas) {
          thumbCanvas.width = 160;
          thumbCanvas.height = 213;
          const tCtx = thumbCanvas.getContext('2d');
          tCtx.drawImage(canvas, 0, 0, 160, 213);
        }
      }
    }

    // Launch PDF Engine
    initKuroNotesPdfEngine();
  }
};

window.SheetDetailPage = SheetDetailPage;
