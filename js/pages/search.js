/**
 * KURO FANGS — Search Page
 * Full search with filters and sort
 */

export default async function renderSearch(container, params) {
  const { default: KF_DATA } = await import('../data.js');
  const { default: KURONI }   = await import('../kuroni.js');
  if (!KF_DATA.subjects) await KF_DATA.init();

  const subjects = KF_DATA.getSubjects(3);

  // Get initial query from URL if any
  const hashQuery = window.location.hash;
  const qMatch = hashQuery.match(/\?q=([^&]*)/);
  const initQuery = qMatch ? decodeURIComponent(qMatch[1]) : '';

  let activeType    = '';
  let activeSort    = 'newest';
  let activeSubject = '';

  const typeIcons = {
    sheet:'📄', summary:'📝', recording:'🎥', images:'🖼️',
    questions:'❓', flashcards:'🃏', quiz:'📋', previous:'📅'
  };

  function sheetCard(sheet, idx) {
    const doc  = KF_DATA.getDoctorById(sheet.doctor_id);
    const subj = KF_DATA.getSubjectById(sheet.subject_id);
    return `
      <div class="sheet-card animate-card-reveal stagger-${(idx % 8) + 1} hover-lift hover-press"
           onclick="ROUTER.navigate('/sheets/${sheet.id}')">
        <div class="sheet-type-indicator sheet-type-${sheet.type}">
          <span style="font-size:18px;">${typeIcons[sheet.type] || '📄'}</span>
        </div>
        <div class="sheet-card-body">
          <div class="sheet-title">${sheet.title_ar}</div>
          <div class="sheet-meta">
            ${doc  ? `<span class="sheet-meta-item">👩‍⚕️ ${doc.name_ar}</span>` : ''}
            ${subj ? `<span class="sheet-meta-item" style="color:${subj.color}">${subj.name_ar}</span>` : ''}
            <span class="sheet-meta-item">📅 ${sheet.date}</span>
          </div>
          <div class="sheet-tags" style="margin-top:4px;">
            ${sheet.is_exam_focus ? '<span class="tag tag-exam">🎯 امتحان</span>' : ''}
            ${sheet.is_split ? `<span class="tag tag-split">جزء ${sheet.split_part}/${sheet.split_total}</span>` : ''}
          </div>
        </div>
      </div>`;
  }

  function renderResults(query) {
    const resultsEl = document.getElementById('search-results');
    const countEl   = document.getElementById('search-count');
    if (!resultsEl) return;

    if (!query && !activeType && !activeSubject) {
      resultsEl.innerHTML = `
        <div class="empty-state" style="padding: var(--space-10) 0;">
          <div class="kuroni-container kuroni-lg kuroni-state-floating">
            ${KURONI.getSVG('thinking')}
          </div>
          <p class="empty-state-message" style="margin-top:var(--space-4);">ابحث عن أي شيء... مواد، ملازم، أطباء، مواضيع</p>
        </div>`;
      if (countEl) countEl.textContent = '';
      return;
    }

    const results = KF_DATA.search(query, {
      subject_id: activeSubject || undefined,
      type:       activeType   || undefined,
      exam_focus: false,
      sort:       activeSort,
    });

    if (countEl) countEl.textContent = `${results.length} نتيجة`;

    if (results.length === 0) {
      resultsEl.innerHTML = KURONI.emptyHTML('confused', 'لا توجد نتائج', `لم يُعثر على شيء يخص "${query}"`);
      return;
    }

    resultsEl.innerHTML = `<div class="grid-auto">${results.map((s, i) => sheetCard(s, i)).join('')}</div>`;
    setTimeout(() => {
      const cards = resultsEl.querySelectorAll('.animate-card-reveal');
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
      }, { threshold: 0.05 });
      cards.forEach(c => io.observe(c));
    }, 30);
  }

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">البحث 🔍</h1>
    </div>
    <div class="page-content animate-page-enter">

      <!-- Search Input -->
      <div class="input-wrapper" style="margin-bottom:var(--space-5);">
        <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input class="search-bar" id="main-search-input" type="text"
               placeholder="ابحث عن ملزمة، مادة، دكتور، موضوع..."
               value="${initQuery}"
               oninput="doSearch(this.value)"/>
      </div>

      <!-- Filters Row -->
      <div style="display:flex;gap:var(--space-4);flex-wrap:wrap;margin-bottom:var(--space-4);align-items:flex-start;">

        <!-- Subject filter -->
        <select id="subj-filter" class="filter-chip"
                style="padding:var(--space-2) var(--space-4);border-radius:var(--radius-full);
                       border:1.5px solid var(--color-border);background:var(--color-surface);
                       font-size:var(--fs-sm);font-family:inherit;cursor:pointer;"
                onchange="setSubjectFilter(this.value)">
          <option value="">كل المواد</option>
          ${subjects.map(s => `<option value="${s.id}">${s.name_ar}</option>`).join('')}
        </select>

        <!-- Type filter chips -->
        <div class="filter-row" id="type-filters">
          <button class="filter-chip active" onclick="setTypeFilter('',this)">الكل</button>
          <button class="filter-chip" onclick="setTypeFilter('sheet',this)">📄 ملازم</button>
          <button class="filter-chip" onclick="setTypeFilter('summary',this)">📝 ملخصات</button>
          <button class="filter-chip" onclick="setTypeFilter('questions',this)">❓ أسئلة</button>
          <button class="filter-chip" onclick="setTypeFilter('flashcards',this)">🃏 بطاقات</button>
          <button class="filter-chip" onclick="setTypeFilter('recording',this)">🎥 تسجيل</button>
        </div>
      </div>

      <!-- Sort + Count Row -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-5);flex-wrap:wrap;gap:var(--space-3);">
        <span id="search-count" style="font-size:var(--fs-sm);color:var(--color-text-muted);"></span>
        <div class="filter-row" id="sort-filters">
          <button class="filter-chip active" onclick="setSort('newest',this)">الأحدث</button>
          <button class="filter-chip" onclick="setSort('views',this)">الأكثر مشاهدة</button>
          <button class="filter-chip" onclick="setSort('importance',this)">الأهم</button>
          <button class="filter-chip" onclick="setSort('saves',this)">الأكثر حفظاً</button>
        </div>
      </div>

      <!-- Results -->
      <div id="search-results"></div>
    </div>`;

  // Global handlers
  let debounceTimer;
  window.doSearch = (val) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => renderResults(val.trim()), 250);
  };

  window.setTypeFilter = (type, btn) => {
    activeType = type;
    document.querySelectorAll('#type-filters .filter-chip').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderResults(document.getElementById('main-search-input')?.value || '');
  };

  window.setSubjectFilter = (subjectId) => {
    activeSubject = subjectId;
    renderResults(document.getElementById('main-search-input')?.value || '');
  };

  window.setSort = (sort, btn) => {
    activeSort = sort;
    document.querySelectorAll('#sort-filters .filter-chip').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderResults(document.getElementById('main-search-input')?.value || '');
  };

  // Auto-search if initial query
  if (initQuery) {
    renderResults(initQuery);
  } else {
    renderResults('');
  }

  // Focus input
  setTimeout(() => document.getElementById('main-search-input')?.focus(), 100);
}
