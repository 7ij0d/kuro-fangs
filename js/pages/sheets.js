/**
 * KURO FANGS — SHEETS & LECTURES PAGE (REDESIGNED)
 * Exact Visual Blueprint implementation matching media_1790204779370.jpg
 * - Panoramic Hero Banner (assets/hero/sheets-hero-study.png) with Clipboard Badge
 * - Responsive Control Bar: Search + Subject + Year + Sort + View Mode Toggle + Sheet Count
 * - Horizontal Two-Column Card Architecture:
 *     Left: A4 Vertical PDF First Page Thumbnail (Auto rendered via PDF.js)
 *     Right: Subject Pill + #Order Pill + ••• Menu + Title + Doctor + Pages/Size + Date
 *     Bottom: [ Open Sheet ] (Burgundy + Eye Icon) & [ Download Sheet ] (Warm Outline)
 * - Clean card design without redundant status tags
 * - 3-Col Desktop, 2-Col iPad, 1-Col Mobile with zero horizontal overflow
 */

// ── PDF Thumbnail Service (Renders Page 1 of real PDF via PDF.js with Caching) ──
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
  render(container, queryParams) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
    const t = (k) => window.I18N ? window.I18N.t(k) : k;
    const subjects = window.DATA ? window.DATA.getSubjects() : [];

    const subjectParam = queryParams?.get('subject') || 'all';
    let currentFilter = subjectParam;
    let currentYear = 'all';
    let currentSort = 'newest';
    let searchQuery = '';
    let viewMode = localStorage.getItem('kf_sheets_view') || 'grid'; // 'grid' | 'list'

    // Format Date helper
    const formatDate = (dateStr) => {
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
    };

    // Subject color palette — maps subject ID to semantic color tokens
    const SUBJECT_COLORS = {
      'preventive':      { bg: 'rgba(2, 132, 199, 0.10)',   text: '#0284C7', border: 'rgba(2, 132, 199, 0.25)' },
      'oral-diseases':   { bg: 'rgba(234, 88, 12, 0.10)',   text: '#EA580C', border: 'rgba(234, 88, 12, 0.25)' },
      'omdr':            { bg: 'rgba(124, 58, 237, 0.10)',   text: '#7C3AED', border: 'rgba(124, 58, 237, 0.25)' },
      'omfs':            { bg: 'rgba(200, 67, 67, 0.10)',    text: '#C84343', border: 'rgba(200, 67, 67, 0.25)' },
      'cons-endo':       { bg: 'rgba(5, 150, 105, 0.10)',   text: '#059669', border: 'rgba(5, 150, 105, 0.25)' },
      'fixed-pros':      { bg: 'rgba(245, 158, 11, 0.10)',  text: '#D97706', border: 'rgba(245, 158, 11, 0.25)' },
      'removable-pros':  { bg: 'rgba(219, 39, 119, 0.10)',  text: '#DB2777', border: 'rgba(219, 39, 119, 0.25)' },
      'ortho':           { bg: 'rgba(14, 165, 233, 0.10)',  text: '#0EA5E9', border: 'rgba(14, 165, 233, 0.25)' },
      'pedo':            { bg: 'rgba(168, 85, 247, 0.10)',  text: '#A855F7', border: 'rgba(168, 85, 247, 0.25)' },
      'gen-med':         { bg: 'rgba(20, 184, 166, 0.10)',  text: '#0D9488', border: 'rgba(20, 184, 166, 0.25)' },
      'gen-surgery':     { bg: 'rgba(239, 68, 68, 0.10)',   text: '#EF4444', border: 'rgba(239, 68, 68, 0.25)' },
    };

    const getSubjectColor = (subjectId) =>
      SUBJECT_COLORS[subjectId] || { bg: 'rgba(142, 146, 168, 0.10)', text: '#8E92A8', border: 'rgba(142, 146, 168, 0.25)' };

    // Get all sheets from DATA service
    const getAllSheets = () => {
      let list = [...(window.DATA?.sheets || [])];
      return list.map(item => {
        const sub = subjects.find(s => s.id === item.subject_id);
        return {
          id: item.id,
          subject_id: item.subject_id,
          subject_name: isAr
            ? (item.subject_name || sub?.name_ar || 'طب الأسنان')
            : (sub?.name_en || 'Dentistry'),
          year: sub?.year || 3,
          title: item.title_en || item.title || item.title_ar,
          doctor_name: item.doctor_name || item.doctor || (isAr ? 'هيئة التدريس' : 'Faculty Board'),
          date: item.date || '2026-09-16',
          type: item.type || (isAr ? 'شيت' : 'Sheet'),
          pages: item.pages || item.pages_count || 12,
          size: item.size || '3.2 MB',
          order_index: typeof item.order_index === 'number' ? item.order_index : null,
          pdf_source: item.pdf_source || 'none',
          pdf_url: item.pdf_url || item.download_url || item.url || item.file_url || '',
          download_url: item.download_url || item.pdf_url || item.url || item.file_url || ''
        };
      });
    };

    let allSheets = getAllSheets();

    // ── Card HTML (Exact Reference Match: 2-Column Split + Bottom Action Buttons) ──
    const renderCardHTML = (item) => {
      const color = getSubjectColor(item.subject_id);
      const orderLabel = item.order_index
        ? `<span class="sheets-order-pill">#${item.order_index}</span>`
        : '';
      const formattedDate = formatDate(item.date);

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
                <img id="thumb-img-${item.id}" class="sgc-thumbnail-img" alt="${item.title}" style="display:none;" />
              </div>
            </div>

            <!-- Right Column: Metadata Column -->
            <div class="sgc-info-col">
              <!-- Row 1: Subject Badge + Order Number + More Menu Button -->
              <div class="sgc-header">
                <div class="sgc-badges-group">
                  <span class="sgc-subject-badge" style="background:${color.bg}; color:${color.text}; border-color:${color.border};">
                    ${item.subject_name}
                  </span>
                  ${orderLabel}
                </div>
                <button class="sgc-menu-btn" type="button" aria-label="${isAr ? 'خيارات' : 'Options'}" title="${isAr ? 'خيارات' : 'Options'}">
                  <i data-lucide="more-horizontal" style="width:15px;height:15px;"></i>
                </button>
              </div>

              <!-- Row 2: Sheet Title -->
              <h3 class="sgc-title" title="${item.title}">${item.title}</h3>

              <!-- Row 3: Lecturer / Doctor -->
              <div class="sgc-meta-row sgc-doctor-row">
                <i data-lucide="user-round" class="sgc-meta-icon"></i>
                <span class="sgc-doctor-name">${isAr ? 'د.' : 'Dr.'} ${item.doctor_name}</span>
              </div>

              <!-- Row 4: Pages & File Size -->
              <div class="sgc-meta-row sgc-specs-row">
                <span class="sgc-meta-item">
                  <i data-lucide="book-open" class="sgc-meta-icon"></i>
                  <span>${item.pages} ${isAr ? 'صفحة' : 'pages'}</span>
                </span>
                <span class="sgc-meta-sep">·</span>
                <span class="sgc-meta-item">
                  <i data-lucide="hard-drive" class="sgc-meta-icon"></i>
                  <span>${item.size}</span>
                </span>
              </div>

              <!-- Row 5: Upload Date -->
              <div class="sgc-meta-row sgc-date-row">
                <i data-lucide="calendar" class="sgc-meta-icon"></i>
                <span>${formattedDate}</span>
              </div>
            </div>
          </div>

          <!-- Bottom Action Buttons: Full Width Spanning Both Columns -->
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
    };

    // ── List-mode row HTML ────────────────────────────────────────────────
    const renderRowHTML = (item) => {
      const color = getSubjectColor(item.subject_id);
      const orderLabel = item.order_index
        ? `<span class="sheets-order-pill">#${item.order_index}</span>`
        : '';
      const formattedDate = formatDate(item.date);

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
              <div class="slr-header-meta">
                <span class="sgc-subject-badge" style="background:${color.bg}; color:${color.text}; border-color:${color.border}; flex-shrink:0;">
                  ${item.subject_name}
                </span>
                ${orderLabel}
              </div>
              <h3 class="sgc-title slr-title">${item.title}</h3>
              <div class="sgc-meta-row slr-meta">
                <span class="sgc-meta-item">
                  <i data-lucide="user-round" class="sgc-meta-icon"></i>
                  <span>${isAr ? 'د.' : 'Dr.'} ${item.doctor_name}</span>
                </span>
                <span class="sgc-meta-sep">·</span>
                <span class="sgc-meta-item">
                  <i data-lucide="book-open" class="sgc-meta-icon"></i>
                  <span>${item.pages} ${isAr ? 'صفحة' : 'Pages'}</span>
                </span>
                <span class="sgc-meta-sep">·</span>
                <span class="sgc-meta-item">
                  <i data-lucide="hard-drive" class="sgc-meta-icon"></i>
                  <span>${item.size}</span>
                </span>
                <span class="sgc-meta-sep">·</span>
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
            <button class="sgc-btn-download download-sheet-btn" data-id="${item.id}">
              <i data-lucide="download" style="width:14px;height:14px;"></i>
              <span>${isAr ? 'تنزيل الشيت' : 'Download Sheet'}</span>
            </button>
          </div>
        </div>
      `;
    };

    // ── Render filtered list ───────────────────────────────────────────────
    const renderList = () => {
      let filtered = [...allSheets];

      // Subject Filter
      if (currentFilter !== 'all') {
        filtered = filtered.filter(s => s.subject_id === currentFilter);
      }

      // Year Filter
      if (currentYear !== 'all') {
        filtered = filtered.filter(s => String(s.year || 3) === String(currentYear));
      }

      // Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        filtered = filtered.filter(s =>
          s.title?.toLowerCase().includes(q) ||
          s.subject_name?.toLowerCase().includes(q) ||
          s.doctor_name?.toLowerCase().includes(q)
        );
      }

      // Sort Order
      filtered.sort((a, b) => {
        if (currentSort === 'newest') {
          return (b.date || '').localeCompare(a.date || '');
        } else if (currentSort === 'oldest') {
          return (a.date || '').localeCompare(b.date || '');
        } else if (currentSort === 'title') {
          return (a.title || '').localeCompare(b.title || '');
        }
        return 0;
      });

      const listContainer = document.getElementById('sheets-list-container');
      if (!listContainer) return;

      if (filtered.length === 0) {
        listContainer.className = '';
        listContainer.innerHTML = `
          <div class="empty-state-card" style="padding: 48px 24px; text-align: center; grid-column: 1/-1;">
            <div style="width:100px;height:100px;margin:0 auto 12px;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle,rgba(200,67,67,0.12) 0%,transparent 70%);">
              <img src="assets/icons/sheets_cat.png" alt="Sheets Cat" class="kuro-character-img kuro-float" style="max-height:90px;object-fit:contain;" />
            </div>
            <h3 style="font-size:1.1rem;font-weight:800;color:var(--text-primary);margin-bottom:6px;">${isAr ? 'لا توجد شيتات تطابق بحثك' : 'No sheets match your search'}</h3>
            <p style="font-size:0.85rem;color:var(--text-secondary);max-width:440px;margin:0 auto;">${isAr ? 'جرّب تغيير المادة، السنة الدراسية أو كلمات البحث.' : 'Try a different subject, academic year, or search term.'}</p>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      if (viewMode === 'grid') {
        listContainer.className = 'sheets-grid-container';
        listContainer.innerHTML = filtered.map(renderCardHTML).join('');
      } else {
        listContainer.className = 'sheets-list-container-view';
        listContainer.innerHTML = filtered.map(renderRowHTML).join('');
      }

      if (window.lucide) window.lucide.createIcons();

      // Card click → navigate to sheet detail
      listContainer.querySelectorAll('.sheets-grid-card, .sheets-list-row').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
          if (e.target.closest('.download-sheet-btn') || e.target.closest('.sgc-menu-btn')) return;
          const id = card.getAttribute('data-id');
          if (id) window.location.hash = '#/sheet-detail?id=' + id;
        });
      });

      // View buttons
      listContainer.querySelectorAll('.view-sheet-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-id');
          if (id) window.location.hash = '#/sheet-detail?id=' + id;
        });
      });

      // Download buttons
      listContainer.querySelectorAll('.download-sheet-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-id');
          const doc = filtered.find(s => s.id === id);
          if (window.DocumentViewer) {
            window.DocumentViewer.download(doc || { title: 'Dental Sheet' });
          } else if (doc && (doc.download_url || doc.pdf_url)) {
            const url = doc.download_url || doc.pdf_url;
            const link = document.createElement('a');
            link.href = url;
            link.download = (doc.title || 'Sheet') + '.pdf';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            if (window.STORE) window.STORE.addPoints(10);
            if (window.showToast) window.showToast(isAr ? 'تم بدء التنزيل (+10 نقاط)' : 'Download started (+10 pts)', { type: 'success', points: 10 });
          } else {
            if (window.STORE) window.STORE.addPoints(10);
            if (window.showToast) window.showToast(isAr ? 'تم بدء التنزيل (+10 نقاط)' : 'Download started (+10 pts)', { type: 'success', points: 10 });
          }
        });
      });

      // Update count labels
      const countEl = document.getElementById('sheets-count-label');
      if (countEl) {
        countEl.textContent = isAr ? `${filtered.length} شيت` : `${filtered.length} Sheets`;
      }
      const countMobileEl = document.getElementById('sheets-count-label-mobile');
      if (countMobileEl) {
        countMobileEl.textContent = isAr ? `${filtered.length} شيت` : `${filtered.length} Sheets`;
      }

      // ── Asynchronous PDF Thumbnail Hydration ──
      if (viewMode === 'grid' && window.PdfThumbnailService) {
        filtered.forEach(item => {
          const url = item.pdf_url;
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
    };

    // ── Update subject dropdown active state ───────────────────────────────
    const updateDropdown = () => {
      const dropdown = document.getElementById('sheets-subject-dropdown');
      if (dropdown) dropdown.value = currentFilter;
    };

    // ── View mode toggle ───────────────────────────────────────────────────
    const setViewMode = (mode) => {
      viewMode = mode;
      localStorage.setItem('kf_sheets_view', mode);
      document.querySelectorAll('.sheets-view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-view') === mode);
      });
      renderList();
    };

    // ── Page scaffold HTML (Matching media_1790204779370.jpg) ───────────────
    container.innerHTML = `
      <!-- Panoramic Sheets & Lectures Hero Banner -->
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
            <p class="shb-subtitle">${isAr ? 'كل ملازمك ومحاضراتك لطب الأسنان في مكان واحد.' : 'All your dental study materials in one place.'}</p>
          </div>
        </div>
      </div>

      <!-- Control Bar: Search + Subject + Year + Sort + View Mode Toggle -->
      <div class="sheets-filter-bar">
        <!-- Search Input -->
        <div class="sheets-search-box">
          <i data-lucide="search" class="sheets-search-icon"></i>
          <input
            id="sheets-search-input"
            type="text"
            class="sheets-search-input"
            placeholder="${isAr ? 'ابحث عن شيت أو دكتور أو موضوع...' : 'Search sheets, lecturers, or topics...'}"
            autocomplete="off"
          />
          <button id="sheets-search-clear" class="sheets-search-clear" style="display:none;" title="${isAr ? 'مسح' : 'Clear'}">
            <i data-lucide="x" style="width:14px;height:14px;"></i>
          </button>
        </div>

        <!-- Filter Dropdowns Group -->
        <div class="sheets-filters-group">
          <!-- Subject Dropdown -->
          <div class="sheets-select-wrap">
            <i data-lucide="book-open" class="sheets-select-icon"></i>
            <select id="sheets-subject-dropdown" class="sheets-select-control">
              <option value="all">${isAr ? 'كل المواد' : 'All Subjects'}</option>
              ${subjects.map(s => `
                <option value="${s.id}" ${currentFilter === s.id ? 'selected' : ''}>
                  ${isAr ? s.name_ar : s.name_en}
                </option>
              `).join('')}
            </select>
            <i data-lucide="chevron-down" class="sheets-select-chevron"></i>
          </div>

          <!-- Year Dropdown -->
          <div class="sheets-select-wrap sheets-year-select-wrap">
            <i data-lucide="calendar" class="sheets-select-icon"></i>
            <select id="sheets-year-dropdown" class="sheets-select-control">
              <option value="all">${isAr ? 'كل السنوات' : 'All Years'}</option>
              <option value="3" ${currentYear === '3' ? 'selected' : ''}>${isAr ? 'السنة الثالثة' : 'Year 3'}</option>
            </select>
            <i data-lucide="chevron-down" class="sheets-select-chevron"></i>
          </div>

          <!-- Sort Dropdown -->
          <div class="sheets-select-wrap sheets-sort-select-wrap">
            <i data-lucide="arrow-up-down" class="sheets-select-icon"></i>
            <select id="sheets-sort-dropdown" class="sheets-select-control">
              <option value="newest" ${currentSort === 'newest' ? 'selected' : ''}>${isAr ? 'الأحدث أولاً' : 'Newest First'}</option>
              <option value="oldest" ${currentSort === 'oldest' ? 'selected' : ''}>${isAr ? 'الأقدم أولاً' : 'Oldest First'}</option>
              <option value="title" ${currentSort === 'title' ? 'selected' : ''}>${isAr ? 'أبجدياً (A-Z)' : 'Title (A-Z)'}</option>
            </select>
            <i data-lucide="chevron-down" class="sheets-select-chevron"></i>
          </div>

          <!-- View Mode Toggle (Grid vs List) -->
          <div class="sheets-view-toggle-bar" role="group" aria-label="${isAr ? 'طريقة العرض' : 'View Mode'}">
            <button class="sheets-view-btn ${viewMode === 'grid' ? 'active' : ''}" data-view="grid" title="${isAr ? 'عرض شبكي' : 'Grid View'}">
              <i data-lucide="layout-grid" style="width:16px;height:16px;"></i>
            </button>
            <button class="sheets-view-btn ${viewMode === 'list' ? 'active' : ''}" data-view="list" title="${isAr ? 'عرض قائمة' : 'List View'}">
              <i data-lucide="list" style="width:16px;height:16px;"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Count Header Sub-bar -->
      <div class="sheets-meta-subbar">
        <div class="sheets-count-badge">
          <span id="sheets-count-label" class="sheets-count-text"></span>
        </div>
        <!-- Mobile secondary view toggle -->
        <div class="sheets-mobile-view-toggle">
          <button class="sheets-view-btn ${viewMode === 'grid' ? 'active' : ''}" data-view="grid" title="${isAr ? 'عرض شبكي' : 'Grid'}">
            <i data-lucide="layout-grid" style="width:15px;height:15px;"></i>
          </button>
          <button class="sheets-view-btn ${viewMode === 'list' ? 'active' : ''}" data-view="list" title="${isAr ? 'عرض قائمة' : 'List'}">
            <i data-lucide="list" style="width:15px;height:15px;"></i>
          </button>
        </div>
      </div>

      <!-- Content Grid / List Area -->
      <div id="sheets-list-container" class="${viewMode === 'grid' ? 'sheets-grid-container' : 'sheets-list-container-view'}"></div>
    `;

    renderList();
    updateDropdown();

    // ── Event Listeners ────────────────────────────────────────────────────

    // Subject dropdown
    document.getElementById('sheets-subject-dropdown')?.addEventListener('change', (e) => {
      currentFilter = e.target.value;
      renderList();
    });

    // Year dropdown
    document.getElementById('sheets-year-dropdown')?.addEventListener('change', (e) => {
      currentYear = e.target.value;
      renderList();
    });

    // Sort dropdown
    document.getElementById('sheets-sort-dropdown')?.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderList();
    });

    // Search input
    const searchInput = document.getElementById('sheets-search-input');
    const searchClear = document.getElementById('sheets-search-clear');
    let searchDebounce;
    searchInput?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      searchClear.style.display = searchQuery ? 'flex' : 'none';
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(renderList, 220);
    });
    searchClear?.addEventListener('click', () => {
      searchQuery = '';
      searchInput.value = '';
      searchClear.style.display = 'none';
      renderList();
      searchInput.focus();
    });

    // View toggle buttons (both desktop and mobile)
    container.querySelectorAll('.sheets-view-btn').forEach(btn => {
      btn.addEventListener('click', () => setViewMode(btn.getAttribute('data-view')));
    });

    // Background cloud sync
    if (window.DATA && typeof window.DATA.syncCloudSheets === 'function') {
      window.DATA.syncCloudSheets().then((newSheets) => {
        if (Array.isArray(newSheets) && newSheets.length > 0) {
          allSheets = getAllSheets();
          renderList();
        }
      }).catch(() => {});
    }
  }
};

window.SheetsPage = SheetsPage;
