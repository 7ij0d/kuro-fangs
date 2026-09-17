/**
 * KURO FANGS — SHEETS & LECTURES PAGE
 * Direct Destination with Pre-filtering Support & Bilingual Display
 */

const SheetsPage = {
  render(container, queryParams) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
    const t = (k) => window.I18N ? window.I18N.t(k) : k;
    const subjects = window.DATA.getSubjects();

    const subjectParam = queryParams?.get('subject') || 'all';
    let currentFilter = subjectParam;

    // Get all sheets from DATA service
    const getAllSheets = () => {
      let list = [...(window.DATA.sheets || [])];
      return list.map(item => ({
        id: item.id,
        subject_id: item.subject_id,
        subject_name: isAr 
          ? (item.subject_name || subjects.find(s => s.id === item.subject_id)?.name_ar || 'طب الأسنان')
          : (subjects.find(s => s.id === item.subject_id)?.name_en || 'Dentistry'),
        title: isAr ? (item.title_ar || item.title) : (item.title_en || item.title_ar || item.title),
        doctor_name: item.doctor_name || (isAr ? 'هيئة التدريس' : 'Faculty Board'),
        date: item.date || '2026-09-12',
        type: item.type || (isAr ? 'شيت' : 'Sheet'),
        pages: item.pages || 18,
        size: item.size || '3.2 MB',
        order_index: typeof item.order_index === 'number' ? item.order_index : null,
        pdf_source: item.pdf_source || 'none'
      })).sort((a, b) => {
        const oa = a.order_index !== null ? a.order_index : 9999;
        const ob = b.order_index !== null ? b.order_index : 9999;
        if (oa !== ob) return oa - ob;
        return (b.date || '').localeCompare(a.date || '');
      });
    };

    let allSheets = getAllSheets();

    const renderList = () => {
      const filtered = currentFilter === 'all'
        ? allSheets
        : allSheets.filter(s => s.subject_id === currentFilter);

      const listContainer = document.getElementById('sheets-list-container');
      const activeFilterBanner = document.getElementById('active-filter-indicator');
      if (!listContainer) return;

      const activeSubjectObj = subjects.find(s => s.id === currentFilter);

      if (activeFilterBanner) {
        if (currentFilter !== 'all' && activeSubjectObj) {
          activeFilterBanner.style.display = 'flex';
          activeFilterBanner.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
              <i data-lucide="filter" style="width: 16px; height: 16px; color: var(--brand-burgundy);"></i>
              <span>${isAr ? 'المادة المحددة:' : 'Filtered by:'} <strong>${isAr ? activeSubjectObj.name_ar : activeSubjectObj.name_en}</strong> (${filtered.length} ${isAr ? 'شيت متاح' : 'handouts available'})</span>
            </div>
            <button id="clear-filter-btn" class="btn btn-secondary" style="font-size: 0.75rem; padding: 4px 10px;">
              ${isAr ? 'عرض كل المواد' : 'Show All Subjects'}
            </button>
          `;
          document.getElementById('clear-filter-btn')?.addEventListener('click', () => {
            selectFilter('all');
          });
        } else {
          activeFilterBanner.style.display = 'none';
        }
      }

      if (filtered.length === 0) {
        listContainer.innerHTML = window.renderEmptyState
          ? window.renderEmptyState()
          : `
            <div class="empty-state-card">
              <div class="empty-state-icon-wrap">
                <i data-lucide="folder-open"></i>
              </div>
              <h3 class="empty-state-title">${isAr ? 'لا توجد محتويات مضافة حالياً' : 'No contents available yet'}</h3>
              <p class="empty-state-subtitle">${isAr ? 'جاري رفع واستكمال الملازم والمحتوى الأكاديمي قريباً' : 'Handouts and academic curriculum materials will be uploaded soon.'}</p>
            </div>
          `;
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      listContainer.innerHTML = filtered.map(item => `
        <div class="sheet-modern-card" data-id="${item.id}">
          <!-- Top: Type Badge + Lecture Title -->
          <div class="sheet-card-top">
            <div class="sheet-badge-group">
              ${item.order_index ? `
                <span class="sheet-order-pill" style="background: rgba(14, 165, 233, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); font-weight: 700; font-size: 0.72rem; padding: 2px 8px; border-radius: 9999px;">
                  ${isAr ? `الشيت #${item.order_index}` : `Sheet #${item.order_index}`}
                </span>
              ` : ''}
              <span class="sheet-type-pill" style="display: inline-flex; align-items: center; gap: 6px;">
                <img src="assets/icons/sheets_cat.png" alt="Sheet" style="width: 16px; height: 16px; border-radius: 50%; object-fit: cover;" />
                ${item.type || 'PDF Sheet'}
              </span>
              <span class="sheet-verified-pill">
                <i data-lucide="check-circle" style="width: 12px; height: 12px;"></i>
                ${isAr ? 'نسخة معتمدة' : 'Verified'}
              </span>
            </div>
            <h3 class="sheet-main-title">
              <a href="#/sheet-detail?id=${item.id}" style="color: inherit; text-decoration: none;">
                ${item.title}
              </a>
            </h3>
          </div>

          <!-- Information: Pages • Size • Doctor • Subject • Date -->
          <div class="sheet-card-meta-row">
            <div class="sheet-meta-item" title="${isAr ? 'عدد الصفحات' : 'Pages'}">
              <i data-lucide="book-open"></i>
              <span><strong>${item.pages || 18}</strong> ${isAr ? 'صفحة' : 'pages'}</span>
            </div>

            <div class="sheet-meta-item" title="${isAr ? 'حجم الملف' : 'Size'}">
              <i data-lucide="hard-drive"></i>
              <span><strong>${item.size || '3.2 MB'}</strong></span>
            </div>

            <div class="sheet-meta-item" title="${isAr ? 'الأستاذ' : 'Doctor'}">
              <i data-lucide="user-check"></i>
              <span>${isAr ? 'الدكتور:' : 'Doctor:'} <strong>${item.doctor_name || (isAr ? 'د. طارق الزاوي' : 'Dr. Tarek Alzawi')}</strong></span>
            </div>

            <div class="sheet-meta-item" title="${isAr ? 'المادة' : 'Subject'}">
              <i data-lucide="graduation-cap"></i>
              <span>${item.subject_name || (isAr ? 'طب الأسنان' : 'Dentistry')}</span>
            </div>

            <div class="sheet-meta-item" title="${isAr ? 'التاريخ' : 'Date'}">
              <i data-lucide="calendar"></i>
              <span>${item.date || '2026-09-12'}</span>
            </div>
          </div>

          <!-- Bottom: Dual Action Buttons (View + Download) -->
          <div class="sheet-card-actions-row">
            <div class="dual-buttons-group">
              <button class="btn btn-primary btn-action-view view-sheet-btn" data-id="${item.id}">
                <i data-lucide="eye" style="width: 16px; height: 16px;"></i>
                <span>${isAr ? 'قراءة / معاينة' : 'Read / View'}</span>
              </button>

              <button class="btn btn-secondary btn-action-download download-sheet-btn" data-id="${item.id}">
                <i data-lucide="download" style="width: 16px; height: 16px;"></i>
                <span>${isAr ? 'تنزيل الملف (PDF)' : 'Download PDF'}</span>
              </button>
            </div>

            <a href="#/sheet-detail?id=${item.id}" class="btn btn-secondary btn-sm" style="font-size: 0.8rem; gap: 4px;">
              <span>${isAr ? 'صفحة الشيت' : 'Full Page'}</span>
              <i data-lucide="${isAr ? 'arrow-left' : 'arrow-right'}" style="width: 13px; height: 13px;"></i>
            </a>
          </div>
        </div>
      `).join('');

      if (window.lucide) window.lucide.createIcons();

      // Direct Dedicated Sheet Navigation (Cards & View Buttons)
      listContainer.querySelectorAll('.sheet-modern-card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
          if (e.target.closest('.download-sheet-btn')) return;
          const sheetId = card.getAttribute('data-id');
          if (sheetId) window.location.hash = '#/sheet-detail?id=' + sheetId;
        });
      });

      listContainer.querySelectorAll('.view-sheet-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const sheetId = btn.getAttribute('data-id');
          if (sheetId) window.location.hash = '#/sheet-detail?id=' + sheetId;
        });
      });

      // Download Buttons
      listContainer.querySelectorAll('.download-sheet-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const sheetId = btn.getAttribute('data-id');
          const doc = filtered.find(s => s.id === sheetId);
          if (window.DocumentViewer) {
            window.DocumentViewer.download(doc || { title: 'Dental Sheet' });
          } else {
            window.STORE.addPoints(10);
            window.showToast(isAr ? 'تم بدء التنزيل بنجاح (+10 نقاط)' : 'Download started (+10 pts)', { type: 'success', points: 10 });
          }
        });
      });
    };

    const selectFilter = (subjectId) => {
      currentFilter = subjectId;
      container.querySelectorAll('.filter-btn').forEach(b => {
        if (b.getAttribute('data-subject') === currentFilter) {
          b.className = 'btn btn-primary filter-btn';
        } else {
          b.className = 'btn btn-secondary filter-btn';
        }
      });
      renderList();
    };

    container.innerHTML = `
      <div class="page-title-bar">
        <div class="page-title-group">
          <h1>
            <img src="assets/icons/sheets_cat.png" alt="Sheets & Lectures" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; vertical-align: middle; margin-inline-end: 8px; border: 1.5px solid var(--border-subtle);" />
            ${isAr ? 'المحاضرات والملازم الدراسية' : 'Lectures & Study Sheets'}
          </h1>
          <p>${isAr ? 'شيتات وتفريغات مواد السنة الثالثة طب وجراحة الفم والأسنان بصيغة PDF' : 'Third Year Dental Surgery lecture notes, handouts, and official transcripts'}</p>
        </div>
      </div>

      <!-- Active Filter Indicator Bar -->
      <div id="active-filter-indicator" class="card" style="display: none; justify-content: space-between; align-items: center; padding: 10px 16px; margin-bottom: 14px; background: rgba(139, 21, 56, 0.05); border: 1px solid rgba(139, 21, 56, 0.15);"></div>

      <!-- Subject Filters Horizontal Scroll -->
      <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 16px; scrollbar-width: thin;">
        <button class="btn ${currentFilter === 'all' ? 'btn-primary' : 'btn-secondary'} filter-btn" data-subject="all" style="font-size: 0.8rem; padding: 6px 14px; white-space: nowrap;">
          ${isAr ? 'الكل (12 مادة)' : 'All Subjects (12)'}
        </button>
        ${subjects.map(s => `
          <button class="btn ${currentFilter === s.id ? 'btn-primary' : 'btn-secondary'} filter-btn" data-subject="${s.id}" style="font-size: 0.8rem; padding: 6px 14px; white-space: nowrap;">
            ${isAr ? s.name_ar : s.name_en}
          </button>
        `).join('')}
      </div>

      <!-- Sheets List -->
      <div class="recent-list-view" id="sheets-list-container"></div>
    `;

    renderList();

    // Event listeners for filters
    container.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectFilter(btn.getAttribute('data-subject'));
      });
    });

    // Background cloud sync to pull newly published sheets from Supabase
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
