/**
 * KURO FANGS — SHEETS & LECTURES PAGE
 */

const SheetsPage = {
  render(container) {
    const subjects = window.DATA.getSubjects();
    let currentFilter = 'all';

    const renderList = () => {
      const sheets = window.DATA.getRecentSheets(20);
      const filtered = currentFilter === 'all' 
        ? sheets 
        : sheets.filter(s => s.subject_id === currentFilter);

      const listContainer = document.getElementById('sheets-list-container');
      if (!listContainer) return;

      if (filtered.length === 0) {
        listContainer.innerHTML = `<div class="card" style="padding: 30px; text-align: center; color: var(--text-muted);">لا توجد شيتات حالياً لهذا الفلتر.</div>`;
        return;
      }

      listContainer.innerHTML = filtered.map(item => `
        <div class="recent-list-row">
          <div class="recent-col-icon">
            <i data-lucide="file-text"></i>
          </div>
          <div class="recent-col-type">
            <span class="badge badge-primary">${item.type || 'شيت'}</span>
          </div>
          <div class="recent-col-title" title="${item.title}">
            ${item.title}
            <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: normal;">${item.subject_name || 'طب الأسنان'}</div>
          </div>
          <div class="recent-col-doctor">
            ${item.doctor_name || 'هيئة التدريس'}
          </div>
          <div class="recent-col-date">
            ${item.date || '2026-09-08'}
          </div>
          <a href="#/sheet/${item.id}" class="recent-col-arrow" title="عرض التفاصيل">
            <i data-lucide="arrow-left"></i>
          </a>
        </div>
      `).join('');

      if (window.lucide) window.lucide.createIcons();
    };

    container.innerHTML = `
      <div class="page-title-bar">
        <div class="page-title-group">
          <h1>
            <i data-lucide="file-text" style="color: var(--brand-primary); width: 26px; height: 26px;"></i>
            المحاضرات والملازم الدراسية
          </h1>
          <p>شيتات وتفريغات مواد السنة الثالثة طب وجراحة الفم والأسنان بصيغة PDF</p>
        </div>
      </div>

      <!-- Subject Filters -->
      <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 16px;">
        <button class="btn btn-primary filter-btn" data-subject="all" style="font-size: 0.8rem; padding: 6px 14px;">
          الكل (12 مادة)
        </button>
        ${subjects.map(s => `
          <button class="btn btn-secondary filter-btn" data-subject="${s.id}" style="font-size: 0.8rem; padding: 6px 14px; white-space: nowrap;">
            ${s.name_ar}
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
        container.querySelectorAll('.filter-btn').forEach(b => {
          b.className = 'btn btn-secondary filter-btn';
        });
        btn.className = 'btn btn-primary filter-btn';
        currentFilter = btn.getAttribute('data-subject');
        renderList();
      });
    });
  }
};

window.SheetsPage = SheetsPage;
