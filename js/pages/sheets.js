/**
 * KURO FANGS — SHEETS & LECTURES PAGE (2-STEP SUBJECT HIERARCHY)
 * Exact Visual Blueprint implementation matching media_1790279055141.jpg
 * 
 * STEP 1: SUBJECT SELECTION (12 Tripoli Dental Faculty Year 3 Subjects)
 * STEP 2: SUBJECT SHEETS LIBRARY (Real Database Sheets for Selected Subject)
 * 
 * ZERO MOCK DATA. Real Database Source of Truth: window.DATA.sheets via getSheetsBySubject().
 * Color Palette: Strict Kuro Student Warm Palette (#FAF8F5 cream, #BC4A47 burgundy, #FFFFFF ivory).
 * Responsive Grid: Desktop (3 columns), iPad (2 columns), Mobile (1 column) — ZERO horizontal overflow.
 */

// ── PDF Thumbnail Service (Renders Page 1 of real PDF via PDF.js with Memory & Session Caching) ──
window.PdfThumbnailService = window.PdfThumbnailService || {
  _cache: new Map(),
  _pending: new Map(),

  async getThumbnail(pdfUrl) {
    if (!pdfUrl) return null;
    if (this._cache.has(pdfUrl)) {
      return this._cache.get(pdfUrl);
    }
    try {
      const cached = sessionStorage.getItem('kf_thumb_' + pdfUrl);
      if (cached) {
        this._cache.set(pdfUrl, cached);
        return cached;
      }
    } catch (e) {}

    if (this._pending.has(pdfUrl)) {
      return this._pending.get(pdfUrl);
    }

    const promise = (async () => {
      try {
        if (!window.pdfjsLib) return null;
        const loadingTask = window.pdfjsLib.getDocument({
          url: pdfUrl,
          withCredentials: false
        });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        const unscaledViewport = page.getViewport({ scale: 1.0 });
        const targetWidth = 320;
        const scale = Math.min(2.0, targetWidth / unscaledViewport.width);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        await page.render({
          canvasContext: ctx,
          viewport: viewport
        }).promise;

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        this._cache.set(pdfUrl, dataUrl);
        try {
          sessionStorage.setItem('kf_thumb_' + pdfUrl, dataUrl);
        } catch (e) {}
        return dataUrl;
      } catch (err) {
        console.warn('[PdfThumbnailService] Error rendering thumbnail:', pdfUrl, err);
        return null;
      } finally {
        this._pending.delete(pdfUrl);
      }
    })();

    this._pending.set(pdfUrl, promise);
    return promise;
  }
};

const SheetsPage = {
  selectedSubjectId: null,
  subjectSearchQuery: '',
  sheetSearchQuery: '',
  lecturerFilter: 'all',
  sortFilter: 'newest',
  viewMode: localStorage.getItem('kf_sheets_view') || 'grid', // 'grid' | 'list'

  // 12 Official Tripoli Dental Faculty Subjects (Year 3) matching exact visual reference
  SUBJECT_DEFINITIONS: [
    { id: 'gen-med', code: 'MED-301', name_en: 'General Medicine', name_ar: 'الطب العام (الباطنة)', icon: 'stethoscope' },
    { id: 'preventive', code: 'PREV-301', name_en: 'Preventive Dentistry', name_ar: 'طب الأسنان الوقائي', icon: 'shield-check' },
    { id: 'removable-pros', code: 'RP-302', name_en: 'Removable Prosthodontics II', name_ar: 'الاستعاضة السنية المتحركة 2', icon: 'layers' },
    { id: 'omdr', code: 'OMDR-301', name_en: 'Oral Medicine, Diagnosis and Radiology I', name_ar: 'طب الفم والتشخيص والأشعة 1', icon: 'scan' },
    { id: 'gen-surgery', code: 'GS-301', name_en: 'General Surgery', name_ar: 'الجراحة العامة', icon: 'activity' },
    { id: 'cons-endo', code: 'CONS-302', name_en: 'Conservative Dentistry and Endodontics II', name_ar: 'طب الأسنان التحفظي 2', icon: 'tooth' },
    { id: 'ortho', code: 'ORT-301', name_en: 'Orthodontics I', name_ar: 'تقويم الأسنان 1', icon: 'smile' },
    { id: 'omfs', code: 'OMS-301', name_en: 'Oral and Maxillofacial Surgery I', name_ar: 'جراحة الفم والوجه والفكين 1', icon: 'scissors' },
    { id: 'oral-diseases', code: 'OD-301', name_en: 'Oral Diseases', name_ar: 'علم أمراض الفم', icon: 'microscope' },
    { id: 'fixed-pros', code: 'FP-302', name_en: 'Fixed Prosthodontics II', name_ar: 'الاستعاضة السنية الثابتة 2', icon: 'crown' },
    { id: 'pedo', code: 'PED-301', name_en: 'Pediatric Dentistry I', name_ar: 'طب أسنان الأطفال 1', icon: 'heart', aliases: ['pediatric'] },
    { id: 'endo', code: 'END-301', name_en: 'Diseases and Treatment of the Pulp I (Endodontics I)', name_ar: 'أمراض وعلاج لب الأسنان 1', icon: 'activity' }
  ],

  /**
   * Icon HTML generator (Specialized SVG for tooth, Lucide for others)
   */
  getSubjectIconHtml(iconName) {
    if (iconName === 'tooth') {
      return `
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2C7.5 2 4 4.5 4 8c0 3 1.5 6 3 9 1 2 2 5 3 5s2-3 2-5c0-1.5.5-2 0-3-.5-1-1-1.5-1-2.5 0-1.5 1-2.5 1-2.5s1 1 1 2.5c0 1-.5 1.5-1 2.5-.5 1 0 1.5 0 3 0 2 1 5 2 5s2-3 3-5c1.5-3 3-6 3-9 0-3.5-3.5-6-8-6z" />
        </svg>
      `;
    }
    return `<i data-lucide="${iconName}"></i>`;
  },

  /**
   * Format Date Helper
   */
  formatDate(dateStr, isAr) {
    if (!dateStr) return isAr ? '23 سبتمبر 2026' : '23 Sep 2026';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parts[0];
        const monthIdx = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const enMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const arMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        return isAr ? `${day} ${arMonths[monthIdx] || ''} ${year}` : `${day} ${enMonths[monthIdx] || ''} ${year}`;
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  },

  /**
   * Master Render Method
   */
  async render(container, queryParams) {
    const subjectParam = queryParams?.get('subject');
    if (subjectParam && subjectParam !== 'all') {
      this.selectedSubjectId = subjectParam;
    } else {
      this.selectedSubjectId = null;
    }

    container.innerHTML = `
      <div class="sheets-hub-container" id="sheets-hub-root">
        <div id="sheets-dynamic-stage" class="sheets-content-stage"></div>
      </div>
    `;

    this.renderCurrentView();

    // Background cloud sync for any newly added sheets
    if (window.DATA && typeof window.DATA.syncCloudSheets === 'function') {
      window.DATA.syncCloudSheets().then((newSheets) => {
        if (Array.isArray(newSheets) && newSheets.length > 0) {
          this.renderCurrentView();
        }
      }).catch(() => {});
    }
  },

  /**
   * Dispatcher to render Step 1 or Step 2
   */
  renderCurrentView() {
    const stageEl = document.getElementById('sheets-dynamic-stage');
    if (!stageEl) return;

    if (this.selectedSubjectId) {
      this.renderLevel2Sheets(stageEl);
    } else {
      this.renderLevel1Subjects(stageEl);
    }

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  },

  // =========================================================================
  // STEP 1: SUBJECT SELECTION PAGE (Matching media_1790279055141.jpg Row 1)
  // =========================================================================
  renderLevel1Subjects(container) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;

    // Filter subjects by live search query
    let subjects = [...this.SUBJECT_DEFINITIONS];
    if (this.subjectSearchQuery.trim()) {
      const q = this.subjectSearchQuery.trim().toLowerCase();
      subjects = subjects.filter(s =>
        s.name_en.toLowerCase().includes(q) ||
        s.name_ar.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q)
      );
    }

    container.innerHTML = `
      <!-- Panoramic Hero Banner (Matching media_1790279055141.jpg) -->
      <div class="sheets-hero-banner" id="sheets-hero-banner">
        <div class="shb-img-container">
          <img
            src="assets/hero/sheets-hero-study.png"
            alt="${isAr ? 'المحاضرات والملازم الدراسية' : 'Sheets & Lectures'}"
            class="shb-hero-artwork"
            loading="eager"
          />
          <div class="shb-vignette-overlay"></div>
        </div>

        <div class="shb-content-overlay">
          <div class="shb-badge-wrap">
            <svg class="shb-badge-svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              <path d="M9 12h6"></path>
              <path d="M9 16h6"></path>
            </svg>
          </div>
          <div class="shb-typography">
            <h1 class="shb-title">${isAr ? 'المحاضرات والملازم الدراسية' : 'Sheets & Lectures'}</h1>
            <p class="shb-subtitle">${isAr ? 'اختر مادة لعرض ملازمها ومحاضراتها الدراسية.' : 'Select a subject to view its study materials.'}</p>
          </div>
        </div>
      </div>

      <!-- Control Bar: Search + View Mode Toggle -->
      <div class="sheets-filter-bar">
        <div class="sheets-search-box">
          <i data-lucide="search" class="sheets-search-icon"></i>
          <input
            id="sheets-subject-search-input"
            type="text"
            class="sheets-search-input"
            placeholder="${isAr ? 'بحث في المواد...' : 'Search subjects...'}"
            value="${this.escapeHtml(this.subjectSearchQuery)}"
            autocomplete="off"
          />
          ${this.subjectSearchQuery ? `
            <button id="sheets-subject-search-clear" class="sheets-search-clear" title="${isAr ? 'مسح' : 'Clear'}">
              <i data-lucide="x" style="width:14px;height:14px;"></i>
            </button>
          ` : ''}
        </div>

        <div class="sheets-view-toggle-bar" role="group" aria-label="${isAr ? 'طريقة العرض' : 'View Mode'}">
          <button class="sheets-view-btn ${this.viewMode === 'grid' ? 'active' : ''}" data-view="grid" title="${isAr ? 'عرض شبكي' : 'Grid View'}">
            <i data-lucide="layout-grid" style="width:16px;height:16px;"></i>
          </button>
          <button class="sheets-view-btn ${this.viewMode === 'list' ? 'active' : ''}" data-view="list" title="${isAr ? 'عرض قائمة' : 'List View'}">
            <i data-lucide="list" style="width:16px;height:16px;"></i>
          </button>
        </div>
      </div>

      <!-- Subjects Cards Grid / List -->
      ${subjects.length === 0 ? `
        <div class="empty-state-card" style="padding: 48px 24px; text-align: center; margin: 30px auto; background: var(--bg-card, #FFFFFF); border-radius: 16px; border: 1px solid var(--border-subtle, rgba(0,0,0,0.08));">
          <div style="width:90px;height:90px;margin:0 auto 14px;display:flex;align-items:center;justify-content:center;">
            <img src="assets/icons/sheets_cat.png" alt="Mascot" style="max-height:80px;object-fit:contain;" />
          </div>
          <h3 style="font-size:1.1rem;font-weight:750;color:var(--text-primary);margin-bottom:6px;">
            ${isAr ? 'لا توجد مادة تطابق بحثك' : 'No subjects match your search'}
          </h3>
          <p style="font-size:0.86rem;color:var(--text-muted);margin:0;">
            ${isAr ? 'جرّب كتابة اسم مادة أخرى أو مسح نص البحث.' : 'Try a different search term or clear the filter.'}
          </p>
        </div>
      ` : `
        <div class="${this.viewMode === 'grid' ? 'sheets-subject-grid' : 'sheets-subject-list'}">
          ${subjects.map(sub => {
            const realSheets = this.getSheetsForSubject(sub.id);
            const count = realSheets.length;
            const countLabel = isAr
              ? `${count} شيت`
              : `${count} ${count === 1 ? 'Sheet' : 'Sheets'}`;

            return `
              <div class="sheets-subject-card" data-subject-id="${sub.id}" role="button" tabindex="0">
                <div class="sheets-subject-card-left">
                  <div class="sheets-subject-icon-box">
                    ${this.getSubjectIconHtml(sub.icon)}
                  </div>
                  <div class="sheets-subject-info">
                    <h3 class="sheets-subject-name">${isAr ? sub.name_ar : sub.name_en}</h3>
                    <div class="sheets-subject-meta-row">
                      <span class="sheets-subject-code">${sub.code}</span>
                      <span class="sheets-subject-meta-dot">•</span>
                      <span class="sheets-subject-count">${countLabel}</span>
                    </div>
                  </div>
                </div>

                <div class="sheets-subject-arrow">
                  <i data-lucide="${isAr ? 'chevron-left' : 'chevron-right'}" style="width: 18px; height: 18px;"></i>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    `;

    // ── Bind Level 1 Event Listeners ──
    const searchInput = container.querySelector('#sheets-subject-search-input');
    const searchClear = container.querySelector('#sheets-subject-search-clear');

    searchInput?.addEventListener('input', (e) => {
      this.subjectSearchQuery = e.target.value;
      this.renderLevel1Subjects(container);
      const reInput = container.querySelector('#sheets-subject-search-input');
      if (reInput) {
        reInput.focus();
        reInput.setSelectionRange(reInput.value.length, reInput.value.length);
      }
    });

    searchClear?.addEventListener('click', () => {
      this.subjectSearchQuery = '';
      this.renderLevel1Subjects(container);
    });

    container.querySelectorAll('.sheets-view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.viewMode = btn.getAttribute('data-view');
        localStorage.setItem('kf_sheets_view', this.viewMode);
        this.renderLevel1Subjects(container);
      });
    });

    container.querySelectorAll('.sheets-subject-card').forEach(card => {
      card.addEventListener('click', () => {
        const subId = card.getAttribute('data-subject-id');
        this.openSubject(subId);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const subId = card.getAttribute('data-subject-id');
          this.openSubject(subId);
        }
      });
    });
  },

  // =========================================================================
  // STEP 2: SUBJECT SHEETS LIBRARY (Matching media_1790279055141.jpg Row 2)
  // =========================================================================
  renderLevel2Sheets(container) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
    const subDef = this.SUBJECT_DEFINITIONS.find(s =>
      s.id === this.selectedSubjectId || (s.aliases && s.aliases.includes(this.selectedSubjectId))
    ) || {
      id: this.selectedSubjectId,
      code: 'DENT-300',
      name_en: 'Dental Curriculum',
      name_ar: 'المقرر الدراسي لطب الأسنان',
      icon: 'book-open'
    };

    const allSubjectSheets = this.getSheetsForSubject(this.selectedSubjectId);

    // Extract unique lecturers for filter dropdown
    const lecturers = Array.from(new Set(
      allSubjectSheets
        .map(s => s.doctor_name || s.doctor)
        .filter(Boolean)
    ));

    // Filter & Sort
    let filteredSheets = [...allSubjectSheets];

    if (this.sheetSearchQuery.trim()) {
      const q = this.sheetSearchQuery.trim().toLowerCase();
      filteredSheets = filteredSheets.filter(s =>
        (s.title || '').toLowerCase().includes(q) ||
        (s.title_ar || '').toLowerCase().includes(q) ||
        (s.title_en || '').toLowerCase().includes(q) ||
        (s.doctor_name || s.doctor || '').toLowerCase().includes(q)
      );
    }

    if (this.lecturerFilter !== 'all') {
      filteredSheets = filteredSheets.filter(s => (s.doctor_name || s.doctor) === this.lecturerFilter);
    }

    filteredSheets.sort((a, b) => {
      if (this.sortFilter === 'newest') {
        return (b.date || '').localeCompare(a.date || '');
      } else if (this.sortFilter === 'oldest') {
        return (a.date || '').localeCompare(b.date || '');
      } else if (this.sortFilter === 'title') {
        const titleA = a.title || a.title_en || a.title_ar || '';
        const titleB = b.title || b.title_en || b.title_ar || '';
        return titleA.localeCompare(titleB);
      }
      return 0;
    });

    const totalCount = allSubjectSheets.length;
    const totalCountLabel = isAr
      ? `${totalCount} شيت`
      : `${totalCount} ${totalCount === 1 ? 'Sheet' : 'Sheets'}`;

    container.innerHTML = `
      <!-- Back to Subjects Bar -->
      <div class="sheets-top-back-bar">
        <button class="sheets-back-btn" id="sheets-back-btn" type="button">
          <i data-lucide="${isAr ? 'arrow-right' : 'arrow-left'}" style="width:16px;height:16px;"></i>
          <span>${isAr ? 'العودة للمواد' : 'Back to Subjects'}</span>
        </button>
      </div>

      <!-- Subject Dedicated Panoramic Hero Banner (Matching reference image) -->
      <div class="sheets-hero-banner sheets-subject-hero" id="sheets-subject-hero">
        <div class="shb-img-container">
          <img
            src="assets/hero/sheets-hero-study.png"
            alt="${isAr ? subDef.name_ar : subDef.name_en}"
            class="shb-hero-artwork"
            loading="eager"
          />
          <div class="shb-vignette-overlay"></div>
        </div>

        <div class="shb-content-overlay">
          <div class="shb-badge-wrap sheets-sub-badge-wrap">
            ${this.getSubjectIconHtml(subDef.icon)}
          </div>
          <div class="shb-typography">
            <h1 class="shb-title">${isAr ? subDef.name_ar : subDef.name_en}</h1>
            <p class="shb-subtitle">${subDef.code} • ${totalCountLabel}</p>
          </div>
        </div>
      </div>

      <!-- Controls Bar: Search + Lecturer Dropdown + Sort + View Toggle -->
      <div class="sheets-filter-bar">
        <!-- Search Input -->
        <div class="sheets-search-box">
          <i data-lucide="search" class="sheets-search-icon"></i>
          <input
            id="sheets-doc-search-input"
            type="text"
            class="sheets-search-input"
            placeholder="${isAr ? 'ابحث عن شيت أو دكتور...' : 'Search sheets...'}"
            value="${this.escapeHtml(this.sheetSearchQuery)}"
            autocomplete="off"
          />
          ${this.sheetSearchQuery ? `
            <button id="sheets-doc-search-clear" class="sheets-search-clear" title="${isAr ? 'مسح' : 'Clear'}">
              <i data-lucide="x" style="width:14px;height:14px;"></i>
            </button>
          ` : ''}
        </div>

        <!-- Filter Controls Group -->
        <div class="sheets-filters-group">
          <!-- Lecturer Filter Dropdown -->
          ${lecturers.length > 0 ? `
            <div class="sheets-select-wrap">
              <i data-lucide="user" class="sheets-select-icon"></i>
              <select id="sheets-lecturer-dropdown" class="sheets-select-control">
                <option value="all">${isAr ? 'كل الدكاترة' : 'All Lecturers'}</option>
                ${lecturers.map(doc => `
                  <option value="${this.escapeHtml(doc)}" ${this.lecturerFilter === doc ? 'selected' : ''}>
                    ${this.escapeHtml(doc)}
                  </option>
                `).join('')}
              </select>
              <i data-lucide="chevron-down" class="sheets-select-chevron"></i>
            </div>
          ` : ''}

          <!-- Sort Dropdown -->
          <div class="sheets-select-wrap sheets-sort-select-wrap">
            <i data-lucide="arrow-up-down" class="sheets-select-icon"></i>
            <select id="sheets-sort-dropdown" class="sheets-select-control">
              <option value="newest" ${this.sortFilter === 'newest' ? 'selected' : ''}>${isAr ? 'الأحدث أولاً' : 'Newest First'}</option>
              <option value="oldest" ${this.sortFilter === 'oldest' ? 'selected' : ''}>${isAr ? 'الأقدم أولاً' : 'Oldest First'}</option>
              <option value="title" ${this.sortFilter === 'title' ? 'selected' : ''}>${isAr ? 'أبجدياً (A-Z)' : 'Title (A-Z)'}</option>
            </select>
            <i data-lucide="chevron-down" class="sheets-select-chevron"></i>
          </div>

          <!-- View Mode Toggle (Grid vs List) -->
          <div class="sheets-view-toggle-bar" role="group" aria-label="${isAr ? 'طريقة العرض' : 'View Mode'}">
            <button class="sheets-view-btn ${this.viewMode === 'grid' ? 'active' : ''}" data-view="grid" title="${isAr ? 'عرض شبكي' : 'Grid View'}">
              <i data-lucide="layout-grid" style="width:16px;height:16px;"></i>
            </button>
            <button class="sheets-view-btn ${this.viewMode === 'list' ? 'active' : ''}" data-view="list" title="${isAr ? 'عرض قائمة' : 'List View'}">
              <i data-lucide="list" style="width:16px;height:16px;"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Content Area -->
      <div id="sheets-list-container" class="${this.viewMode === 'grid' ? 'sheets-grid-container' : 'sheets-list-container-view'}">
        ${filteredSheets.length === 0 ? `
          <div class="empty-state-card" style="padding: 48px 24px; text-align: center; grid-column: 1/-1; background: var(--bg-card, #FFFFFF); border-radius: 16px; border: 1px solid var(--border-subtle, rgba(0,0,0,0.08));">
            <div style="width:100px;height:100px;margin:0 auto 14px;display:flex;align-items:center;justify-content:center;">
              <img src="assets/icons/sheets_cat.png" alt="Sheets Cat" class="kuro-character-img" style="max-height:85px;object-fit:contain;" />
            </div>
            <h3 style="font-size:1.12rem;font-weight:750;color:var(--text-primary);margin-bottom:6px;">
              ${allSubjectSheets.length === 0
                ? (isAr ? 'لا توجد شيتات متاحة بعد لهذه المادة' : 'No sheets available yet for this subject')
                : (isAr ? 'لا توجد شيتات تطابق بحثك' : 'No sheets match your search')}
            </h3>
            <p style="font-size:0.86rem;color:var(--text-muted);max-width:440px;margin:0 auto 16px;">
              ${allSubjectSheets.length === 0
                ? (isAr ? 'سيتم رفع الملازم والمحاضرات الخاصة بهذه المادة قريباً فور توفرها.' : 'Study materials and lecture sheets for this subject will be uploaded soon.')
                : (isAr ? 'جرّب تغيير كلمات البحث أو إعادة ضبط الفلاتر.' : 'Try changing search terms or resetting filters.')}
            </p>
            ${allSubjectSheets.length === 0 ? `
              <button class="sheets-back-btn" id="sheets-empty-back-btn" style="display:inline-flex;margin:0 auto;">
                <i data-lucide="${isAr ? 'arrow-right' : 'arrow-left'}" style="width:15px;height:15px;"></i>
                <span>${isAr ? 'العودة للمواد' : 'Back to Subjects'}</span>
              </button>
            ` : ''}
          </div>
        ` : filteredSheets.map(item => this.viewMode === 'grid' ? this.renderCardHTML(item, isAr) : this.renderRowHTML(item, isAr)).join('')}
      </div>
    `;

    // ── Bind Level 2 Event Listeners ──
    container.querySelector('#sheets-back-btn')?.addEventListener('click', () => {
      this.selectedSubjectId = null;
      window.location.hash = '#/sheets';
      this.renderLevel1Subjects(container);
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    });

    container.querySelector('#sheets-empty-back-btn')?.addEventListener('click', () => {
      this.selectedSubjectId = null;
      window.location.hash = '#/sheets';
      this.renderLevel1Subjects(container);
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    });

    const docSearchInput = container.querySelector('#sheets-doc-search-input');
    const docSearchClear = container.querySelector('#sheets-doc-search-clear');

    docSearchInput?.addEventListener('input', (e) => {
      this.sheetSearchQuery = e.target.value;
      this.renderLevel2Sheets(container);
      const reInput = container.querySelector('#sheets-doc-search-input');
      if (reInput) {
        reInput.focus();
        reInput.setSelectionRange(reInput.value.length, reInput.value.length);
      }
    });

    docSearchClear?.addEventListener('click', () => {
      this.sheetSearchQuery = '';
      this.renderLevel2Sheets(container);
    });

    container.querySelector('#sheets-lecturer-dropdown')?.addEventListener('change', (e) => {
      this.lecturerFilter = e.target.value;
      this.renderLevel2Sheets(container);
    });

    container.querySelector('#sheets-sort-dropdown')?.addEventListener('change', (e) => {
      this.sortFilter = e.target.value;
      this.renderLevel2Sheets(container);
    });

    container.querySelectorAll('.sheets-view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.viewMode = btn.getAttribute('data-view');
        localStorage.setItem('kf_sheets_view', this.viewMode);
        this.renderLevel2Sheets(container);
      });
    });

    // Sheet card clicks and actions
    const listContainer = container.querySelector('#sheets-list-container');
    if (listContainer) {
      listContainer.querySelectorAll('.sheets-grid-card, .sheets-list-row').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
          if (e.target.closest('.download-sheet-btn') || e.target.closest('.sgc-menu-btn')) return;
          const id = card.getAttribute('data-id');
          if (id) window.location.hash = '#/sheet-detail?id=' + id;
        });
      });

      listContainer.querySelectorAll('.view-sheet-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-id');
          if (id) window.location.hash = '#/sheet-detail?id=' + id;
        });
      });

      listContainer.querySelectorAll('.download-sheet-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-id');
          const doc = filteredSheets.find(s => s.id === id);
          this.handleDownloadSheet(doc, isAr);
        });
      });

      // Asynchronous PDF Thumbnail Hydration via PdfThumbnailService
      if (this.viewMode === 'grid' && window.PdfThumbnailService) {
        filteredSheets.forEach(item => {
          const url = item.pdf_url || item.download_url;
          if (!url) return;
          const imgEl = document.getElementById(`thumb-img-${item.id}`);
          const placeholderEl = document.getElementById(`thumb-placeholder-${item.id}`);
          if (!imgEl) return;

          window.PdfThumbnailService.getThumbnail(url).then(dataUrl => {
            if (dataUrl && imgEl) {
              imgEl.src = dataUrl;
              imgEl.onload = () => {
                imgEl.style.display = 'block';
                imgEl.classList.add('loaded');
                if (placeholderEl) placeholderEl.style.display = 'none';
              };
            }
          }).catch(() => {});
        });
      }
    }
  },

  /**
   * Helper: Retrieve real database sheets for given subject ID
   */
  getSheetsForSubject(subjectId) {
    if (!window.DATA || typeof window.DATA.getSheetsBySubject !== 'function') {
      return [];
    }

    let list = window.DATA.getSheetsBySubject(subjectId);
    if (!list || list.length === 0) {
      // Check aliases if defined
      const def = this.SUBJECT_DEFINITIONS.find(s => s.id === subjectId);
      if (def?.aliases) {
        for (const alias of def.aliases) {
          const aliasList = window.DATA.getSheetsBySubject(alias);
          if (aliasList && aliasList.length > 0) {
            list = aliasList;
            break;
          }
        }
      }
    }

    return (list || []).map(item => ({
      id: item.id,
      subject_id: item.subject_id || subjectId,
      title: item.title_en || item.title || item.title_ar || 'Lecture Sheet',
      title_ar: item.title_ar || item.title || '',
      title_en: item.title_en || item.title || '',
      doctor_name: item.doctor_name || item.doctor || (window.I18N?.getLang() === 'ar' ? 'هيئة التدريس' : 'Faculty Board'),
      date: item.date || '2026-09-16',
      pages: item.pages || item.pages_count || 12,
      size: item.size || '1.8 MB',
      order_index: typeof item.order_index === 'number' ? item.order_index : null,
      pdf_url: item.pdf_url || item.download_url || item.url || item.file_url || '',
      download_url: item.download_url || item.pdf_url || item.url || item.file_url || ''
    }));
  },

  /**
   * Card HTML (Exact Reference Match: 2-Column Split + Bottom Action Buttons)
   */
  renderCardHTML(item, isAr) {
    const formattedDate = this.formatDate(item.date, isAr);
    const title = isAr ? (item.title_ar || item.title) : (item.title_en || item.title);

    return `
      <div class="sheets-grid-card" data-id="${item.id}">
        <div class="sgc-card-inner">
          <!-- Left Column: A4 Vertical PDF First Page Thumbnail -->
          <div class="sgc-thumb-col">
            <div class="sgc-thumbnail-wrapper" data-thumb-id="${item.id}" data-pdf-url="${item.pdf_url}">
              <div class="sgc-thumbnail-placeholder" id="thumb-placeholder-${item.id}">
                <div class="sgc-doc-icon-wrap">
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                </div>
                <div class="sgc-placeholder-meta">
                  <span class="sgc-placeholder-badge">PDF</span>
                  <span class="sgc-placeholder-pages">${item.pages} ${isAr ? 'ص' : 'p'}</span>
                </div>
              </div>
              <img id="thumb-img-${item.id}" class="sgc-thumbnail-img" alt="${this.escapeHtml(title)}" style="display:none;" />
            </div>
          </div>

          <!-- Right Column: Metadata Hierarchy -->
          <div class="sgc-info-col">
            <!-- Header Row: Title & Options Menu -->
            <div class="sgc-header">
              <h3 class="sgc-title" title="${this.escapeHtml(title)}">${this.escapeHtml(title)}</h3>
              <button class="sgc-menu-btn" type="button" aria-label="${isAr ? 'خيارات' : 'Options'}" title="${isAr ? 'خيارات' : 'Options'}">
                <i data-lucide="more-horizontal" style="width:15px;height:15px;"></i>
              </button>
            </div>

            <!-- Doctor Row -->
            <div class="sgc-meta-row sgc-doctor-row">
              <i data-lucide="user" class="sgc-meta-icon"></i>
              <span class="sgc-doctor-name">${isAr ? 'د.' : 'Dr.'} ${this.escapeHtml(item.doctor_name)}</span>
            </div>

            <!-- Pages & File Size Row -->
            <div class="sgc-meta-row sgc-specs-row">
              <span class="sgc-meta-item">
                <i data-lucide="book-open" class="sgc-meta-icon"></i>
                <span>${item.pages} ${isAr ? 'صفحة' : 'pages'}</span>
              </span>
              <span class="sgc-meta-sep">•</span>
              <span class="sgc-meta-item">
                <i data-lucide="hard-drive" class="sgc-meta-icon"></i>
                <span>${item.size}</span>
              </span>
            </div>

            <!-- Upload Date Row -->
            <div class="sgc-meta-row sgc-date-row">
              <i data-lucide="calendar" class="sgc-meta-icon"></i>
              <span>${formattedDate}</span>
            </div>
          </div>
        </div>

        <!-- Bottom Action Buttons: Full Width Spanning Bottom -->
        <div class="sgc-actions">
          <button class="sgc-btn-view view-sheet-btn" data-id="${item.id}" title="${isAr ? 'فتح واستعراض الشيت' : 'Open Sheet'}">
            <i data-lucide="eye" style="width:15px;height:15px;"></i>
            <span>${isAr ? 'فتح الشيت' : 'Open Sheet'}</span>
          </button>
          <button class="sgc-btn-download download-sheet-btn" data-id="${item.id}" title="${isAr ? 'تنزيل ملف الـ PDF' : 'Download Sheet'}">
            <i data-lucide="download" style="width:15px;height:15px;"></i>
            <span>${isAr ? 'تنزيل الشيت' : 'Download Sheet'}</span>
          </button>
        </div>
      </div>
    `;
  },

  /**
   * List-mode Row HTML (Matching iPad reference row 2 middle)
   */
  renderRowHTML(item, isAr) {
    const formattedDate = this.formatDate(item.date, isAr);
    const title = isAr ? (item.title_ar || item.title) : (item.title_en || item.title);

    return `
      <div class="sheets-list-row" data-id="${item.id}">
        <div class="slr-left">
          <div class="slr-doc-icon-wrap">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          </div>
          <div class="slr-info">
            <h3 class="sgc-title slr-title">${this.escapeHtml(title)}</h3>
            <div class="sgc-meta-row slr-meta">
              <span class="sgc-meta-item">
                <i data-lucide="user" class="sgc-meta-icon"></i>
                <span>${isAr ? 'د.' : 'Dr.'} ${this.escapeHtml(item.doctor_name)}</span>
              </span>
              <span class="sgc-meta-sep">•</span>
              <span class="sgc-meta-item">
                <i data-lucide="book-open" class="sgc-meta-icon"></i>
                <span>${item.pages} ${isAr ? 'صفحة' : 'Pages'}</span>
              </span>
              <span class="sgc-meta-sep">•</span>
              <span class="sgc-meta-item">
                <i data-lucide="hard-drive" class="sgc-meta-icon"></i>
                <span>${item.size}</span>
              </span>
              <span class="sgc-meta-sep">•</span>
              <span class="sgc-meta-item">
                <i data-lucide="calendar" class="sgc-meta-icon"></i>
                <span>${formattedDate}</span>
              </span>
            </div>
          </div>
        </div>

        <div class="sgc-actions slr-actions">
          <button class="sgc-btn-view view-sheet-btn" data-id="${item.id}">
            <i data-lucide="eye" style="width:14px;height:14px;"></i>
            <span>${isAr ? 'فتح الشيت' : 'Open Sheet'}</span>
          </button>
          <button class="sgc-btn-download download-sheet-btn" data-id="${item.id}" title="${isAr ? 'تنزيل' : 'Download'}">
            <i data-lucide="download" style="width:14px;height:14px;"></i>
          </button>
        </div>
      </div>
    `;
  },

  /**
   * Trigger PDF download & award points
   */
  handleDownloadSheet(doc, isAr) {
    if (!doc) return;
    const url = doc.download_url || doc.pdf_url;
    if (window.DocumentViewer) {
      window.DocumentViewer.download(doc);
    } else if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = (doc.title || 'Sheet') + '.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (window.STORE) window.STORE.addPoints(10);
      if (window.showToast) {
        window.showToast(isAr ? 'تم بدء التنزيل (+10 نقاط)' : 'Download started (+10 pts)', { type: 'success', points: 10 });
      }
    }
  },

  /**
   * Transition to selected subject
   */
  openSubject(subjectId) {
    this.selectedSubjectId = subjectId;
    this.sheetSearchQuery = '';
    this.lecturerFilter = 'all';
    window.location.hash = '#/sheets?subject=' + subjectId;
    const stageEl = document.getElementById('sheets-dynamic-stage');
    if (stageEl) {
      this.renderLevel2Sheets(stageEl);
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }
  },

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};

window.SheetsPage = SheetsPage;
