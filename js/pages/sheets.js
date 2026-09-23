/**
 * KURO FANGS — SHEETS & LECTURES PAGE (REDESIGNED)
 * 3-Column Card Grid with Dropdown Filter, Search Bar & View Mode Toggle
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

        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
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
    const subjects = window.DATA.getSubjects();

    const subjectParam = queryParams?.get('subject') || 'all';
    let currentFilter = subjectParam;
    let searchQuery = '';
    let viewMode = localStorage.getItem('kf_sheets_view') || 'grid'; // 'grid' | 'list'

    // Subject color palette — maps subject ID to a semantic color token
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
      let list = [...(window.DATA.sheets || [])];
      return list.map(item => ({
        id: item.id,
        subject_id: item.subject_id,
        subject_name: isAr
          ? (item.subject_name || subjects.find(s => s.id === item.subject_id)?.name_ar || 'طب الأسنان')
          : (subjects.find(s => s.id === item.subject_id)?.name_en || 'Dentistry'),
        title: item.title_en || item.title || item.title_ar,
        doctor_name: item.doctor_name || (isAr ? 'هيئة التدريس' : 'Faculty Board'),
        date: item.date || '2026-09-16',
        type: item.type || (isAr ? 'شيت' : 'Sheet'),
        pages: item.pages || item.pages_count || 12,
        size: item.size || '3.2 MB',
        order_index: typeof item.order_index === 'number' ? item.order_index : null,
        pdf_source: item.pdf_source || 'none',
        pdf_url: item.pdf_url || item.download_url || item.url || item.file_url || '',
        download_url: item.download_url || item.pdf_url || item.url || item.file_url || ''
      })).sort((a, b) => {
        const oa = a.order_index !== null ? a.order_index : 9999;
        const ob = b.order_index !== null ? b.order_index : 9999;
        if (oa !== ob) return oa - ob;
        return (b.date || '').localeCompare(a.date || '');
      });
    };

    let allSheets = getAllSheets();

    // ── Card HTML (3-Column Desktop, 2-Column iPad, 1-Column Mobile) ──
    const renderCardHTML = (item) => {
      const color = getSubjectColor(item.subject_id);
      const orderLabel = item.order_index
        ? `<span class="sheets-order-pill">#${item.order_index}</span>`
        : '';
      return `
        <div class="sheets-grid-card" data-id="${item.id}">
          <!-- Thumbnail Container: Auto Page 1 or Neutral Document Fallback -->
          <div class="sgc-thumbnail-wrapper" data-thumb-id="${item.id}" data-pdf-url="${item.pdf_url}">
            <div class="sgc-thumbnail-placeholder" id="thumb-placeholder-${item.id}">
              <div class="sgc-doc-icon-wrap">
                <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
              </div>
              <div class="sgc-placeholder-meta">
                <span class="sgc-placeholder-badge">PDF</span>
                <span class="sgc-placeholder-pages">${item.pages} ${isAr ? 'صفحة' : 'pages'}</span>
              </div>
            </div>
            <img id="thumb-img-${item.id}" class="sgc-thumbnail-img" alt="${item.title}" style="display:none;" />
          </div>

          <div class="sgc-card-body">
            <div class="sgc-header">
              <span class="sgc-subject-badge" style="background:${color.bg}; color:${color.text}; border-color:${color.border};">
                ${item.subject_name}
              </span>
              ${orderLabel}
            </div>

            <h3 class="sgc-title">${item.title}</h3>

            <div class="sgc-meta">
              <span class="sgc-meta-item">
                <i data-lucide="user-round" class="sgc-meta-icon"></i>
                ${isAr ? 'د.' : 'Dr.'} ${item.doctor_name}
              </span>
              <span class="sgc-meta-sep">·</span>
              <span class="sgc-meta-item">
                <i data-lucide="book-open" class="sgc-meta-icon"></i>
                ${item.pages} ${isAr ? 'صفحة' : 'Pages'}
              </span>
              <span class="sgc-meta-sep">·</span>
              <span class="sgc-meta-item">
                <i data-lucide="hard-drive" class="sgc-meta-icon"></i>
                ${item.size}
              </span>
              <span class="sgc-meta-sep">·</span>
              <span class="sgc-meta-item">
                <i data-lucide="calendar" class="sgc-meta-icon"></i>
                ${item.date}
              </span>
            </div>

            <!-- Two Visible Full Action Buttons: Open Sheet + Download Sheet -->
            <div class="sgc-actions">
              <button class="sgc-btn-view view-sheet-btn" data-id="${item.id}" title="${isAr ? 'فتح واستعراض الشيت' : 'Open Sheet'}">
                <i data-lucide="book-open" style="width:15px;height:15px;"></i>
                <span>${isAr ? 'فتح الشيت' : 'Open Sheet'}</span>
              </button>
              <button class="sgc-btn-download download-sheet-btn" data-id="${item.id}" title="${isAr ? 'تنزيل ملف الـ PDF' : 'Download Sheet'}">
                <i data-lucide="download" style="width:15px;height:15px;"></i>
                <span>${isAr ? 'تنزيل الشيت' : 'Download Sheet'}</span>
              </button>
            </div>
          </div>
        </div>
      `;
    };

    // ── List-mode row HTML ────────────────────────────────────────────────
    const renderRowHTML = (item) => {
      const color = getSubjectColor(item.subject_id);
      return `
        <div class="sheets-list-row" data-id="${item.id}">
          <div class="slr-left">
            <div class="slr-doc-icon-wrap">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
            </div>
            <span class="sgc-subject-badge" style="background:${color.bg}; color:${color.text}; border-color:${color.border}; flex-shrink:0;">
              ${item.subject_name}
            </span>
            <div class="slr-info">
              <h3 class="sgc-title slr-title">${item.title}</h3>
              <div class="sgc-meta">
                <span class="sgc-meta-item">
                  <i data-lucide="user-round" class="sgc-meta-icon"></i>
                  ${isAr ? 'د.' : 'Dr.'} ${item.doctor_name}
                </span>
                <span class="sgc-meta-sep">·</span>
                <span class="sgc-meta-item">
                  <i data-lucide="book-open" class="sgc-meta-icon"></i>
                  ${item.pages} ${isAr ? 'صفحة' : 'Pages'}
                </span>
                <span class="sgc-meta-sep">·</span>
                <span class="sgc-meta-item">
                  <i data-lucide="calendar" class="sgc-meta-icon"></i>
                  ${item.date}
                </span>
              </div>
            </div>
          </div>
          <div class="sgc-actions slr-actions">
            <button class="sgc-btn-view view-sheet-btn" data-id="${item.id}">
              <i data-lucide="book-open" style="width:14px;height:14px;"></i>
              <span>${isAr ? 'فتح الشيت' : 'Open Sheet'}</span>
            </button>
            <button class="sgc-btn-download download-sheet-btn" data-id="${item.id}">
              <i data-lucide="download" style="width:14px;height:14px;"></i>
              <span>${isAr ? 'تنزيل الشيت' : 'Download Sheet'}</span>
            </button>
          </div>
      `;
    };

    // ── Render filtered list ───────────────────────────────────────────────
    const renderList = () => {
      let filtered = currentFilter === 'all'
        ? allSheets
        : allSheets.filter(s => s.subject_id === currentFilter);

      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        filtered = filtered.filter(s =>
          s.title?.toLowerCase().includes(q) ||
          s.subject_name?.toLowerCase().includes(q) ||
          s.doctor_name?.toLowerCase().includes(q)
        );
      }

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
            <p style="font-size:0.85rem;color:var(--text-secondary);max-width:440px;margin:0 auto;">${isAr ? 'جرّب تغيير المادة أو كلمات البحث.' : 'Try a different subject or search term.'}</p>
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
          if (e.target.closest('.download-sheet-btn')) return;
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

      // Update count label
      const countEl = document.getElementById('sheets-count-label');
      if (countEl) {
        countEl.textContent = isAr ? `${filtered.length} شيت` : `${filtered.length} Sheets`;
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

    // ── Page scaffold HTML ─────────────────────────────────────────────────
    container.innerHTML = `
      <!-- Page Title Bar -->
      <div class="page-title-bar">
        <div class="page-title-group" style="display:flex;align-items:center;gap:16px;">
          <div style="width:58px;height:58px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle,rgba(200,67,67,0.12) 0%,transparent 70%);">
            <img src="assets/icons/sheets_cat.png" alt="Sheets Cat" class="kuro-character-img kuro-float" style="width:52px;height:52px;object-fit:contain;" />
          </div>
          <div>
            <h1 style="font-size:1.55rem;font-weight:850;color:var(--text-primary);margin:0 0 4px;letter-spacing:-0.02em;">
              ${isAr ? 'المحاضرات والملازم الدراسية' : 'Lectures & Study Sheets'}
            </h1>
            <p style="font-size:0.85rem;color:var(--text-secondary);margin:0;">
              ${isAr ? 'شيتات وتفريغات مواد السنة الثالثة طب وجراحة الفم والأسنان بصيغة PDF' : 'Third Year Dental Surgery lecture notes, handouts, and official transcripts'}
            </p>
          </div>
        </div>
      </div>

      <!-- Control Bar: Dropdown + Search + View Toggle -->
      <div class="sheets-control-bar">
        <!-- Subject Dropdown -->
        <div class="sheets-dropdown-wrap">
          <i data-lucide="chevron-down" class="sheets-dropdown-chevron"></i>
          <select id="sheets-subject-dropdown" class="sheets-dropdown">
            <option value="all">${isAr ? 'كل المواد' : 'All Subjects'}</option>
            ${subjects.map(s => `
              <option value="${s.id}" ${currentFilter === s.id ? 'selected' : ''}>
                ${isAr ? s.name_ar : s.name_en}
              </option>
            `).join('')}
          </select>
        </div>

        <!-- Search Bar -->
        <div class="sheets-search-wrap">
          <i data-lucide="search" class="sheets-search-icon"></i>
          <input
            id="sheets-search-input"
            type="text"
            class="sheets-search-input"
            placeholder="${isAr ? 'ابحث عن شيت أو مادة...' : 'Search subjects, or topics...'}"
            autocomplete="off"
          />
          <button id="sheets-search-clear" class="sheets-search-clear" style="display:none;" title="${isAr ? 'مسح' : 'Clear'}">
            <i data-lucide="x" style="width:14px;height:14px;"></i>
          </button>
        </div>

        <!-- Right: Count + View Toggle -->
        <div class="sheets-control-right">
          <span id="sheets-count-label" class="sheets-count-label"></span>
          <div class="sheets-view-toggle" role="group" aria-label="${isAr ? 'طريقة العرض' : 'View Mode'}">
            <span class="sheets-view-label">${isAr ? 'طريقة العرض' : 'View Mode'}</span>
            <button class="sheets-view-btn ${viewMode === 'grid' ? 'active' : ''}" data-view="grid" title="${isAr ? 'شبكة' : 'Grid'}">
              <i data-lucide="layout-grid" style="width:16px;height:16px;"></i>
            </button>
            <button class="sheets-view-btn ${viewMode === 'list' ? 'active' : ''}" data-view="list" title="${isAr ? 'قائمة' : 'List'}">
              <i data-lucide="list" style="width:16px;height:16px;"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Content Area -->
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

    // View toggle
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
