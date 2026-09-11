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

    // Realistic dental lecture generator if mock data is limited
    const getSubjectSheets = (subjId) => {
      const existing = (window.DATA.sheets || []).filter(s => s.subject_id === subjId);
      if (existing.length >= 3) return existing;

      const subj = subjects.find(s => s.id === subjId) || subjects[0];
      const titles = isAr ? [
        `محاضرة 1: مقدمة وأساسيات ${subj ? subj.name_ar : ''}`,
        `محاضرة 2: المبادئ التشخيصية والسريرية المتقدمة`,
        `محاضرة 3: البروتوكولات العلاجية والأدوات الجراحية`,
        `محاضرة 4: الحالات السريرية والمضاعفات وكيفية تدبيرها`
      ] : [
        `Lecture 1: Introduction & Fundamentals of ${subj ? subj.name_en : 'Subject'}`,
        `Lecture 2: Core Diagnostic & Clinical Criteria`,
        `Lecture 3: Clinical Protocols, Instruments & Techniques`,
        `Lecture 4: Case Studies, Complications & Management`
      ];

      return titles.map((title, idx) => ({
        id: `gen-${subjId}-${idx + 1}`,
        subject_id: subjId,
        subject_name: isAr ? (subj?.name_ar || 'طب الأسنان') : (subj?.name_en || 'Dentistry'),
        title: title,
        title_ar: title,
        title_en: title,
        doctor_name: isAr ? 'هيئة التدريس الجامعية' : 'Faculty Academic Board',
        date: `2026-09-${10 + idx}`,
        type: isAr ? 'شيت معتمد' : 'Official Handout',
        pages: 14 + idx * 4,
        size: `${(2.4 + idx * 0.8).toFixed(1)} MB`
      }));
    };

    // Combine all sheets across subjects
    const getAllSheets = () => {
      let list = [...(window.DATA.sheets || [])];
      // Normalize existing
      list = list.map(item => ({
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
        size: item.size || '3.2 MB'
      }));

      // If list is small, supplement with subject sheets
      if (list.length < 15) {
        subjects.forEach(s => {
          if (!list.some(item => item.subject_id === s.id)) {
            list.push(...getSubjectSheets(s.id));
          }
        });
      }
      return list;
    };

    const allSheets = getAllSheets();

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
        listContainer.innerHTML = `
          <div class="card" style="padding: 40px; text-align: center; color: var(--text-muted);">
            <i data-lucide="folder-open" style="width: 38px; height: 38px; margin-bottom: 12px; opacity: 0.5;"></i>
            <p>${isAr ? 'لا توجد شيتات حالياً لهذه المادة.' : 'No study sheets currently available for this subject.'}</p>
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
              <span class="sheet-type-pill">
                <i data-lucide="file-text" style="width: 12px; height: 12px;"></i>
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

      // View Buttons (In-App Document Viewer)
      listContainer.querySelectorAll('.view-sheet-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const sheetId = btn.getAttribute('data-id');
          const doc = filtered.find(s => s.id === sheetId);
          if (window.DocumentViewer) {
            window.DocumentViewer.open(doc || { title: 'Dental Sheet' });
          }
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
            <i data-lucide="file-text" style="color: var(--brand-primary); width: 26px; height: 26px;"></i>
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
  }
};

window.SheetsPage = SheetsPage;
