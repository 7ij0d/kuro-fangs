/**
 * KURO FANGS — Subjects Page
 * Shows all 12 subjects as a card grid
 */

export default async function renderSubjects(container, params) {
  const { default: KF_DATA } = await import('../data.js');
  const { default: KURONI }   = await import('../kuroni.js');
  if (!KF_DATA.subjects) await KF_DATA.init();

  const allSubjects = KF_DATA.getSubjects(3);
  let filtered = [...allSubjects];

  function subjectCard(subj, idx) {
    const doctors = KF_DATA.getDoctorsBySubject(subj.id);
    const isBoth  = subj.exam_schedule.includes('نهائي');
    return `
      <div class="subject-card animate-card-reveal stagger-${(idx % 8) + 1} hover-lift hover-press"
           style="--subject-color: ${subj.color};"
           onclick="ROUTER.navigate('/subjects/${subj.id}')"
           role="button" tabindex="0">
        <div class="subject-card-header">
          <div class="subject-icon-wrapper">
            <span>${subj.icon}</span>
          </div>
          <div class="subject-card-body">
            <div class="subject-name">${subj.name_ar}</div>
            <span class="subject-name-en">${subj.name_en}</span>
          </div>
        </div>
        <div class="subject-card-footer">
          <div class="subject-meta">
            <span class="subject-meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              ${subj.sheet_count} ملزمة
            </span>
            <span class="subject-meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              ${doctors.length} دكتور
            </span>
          </div>
          <span class="subject-exam-badge ${isBoth ? 'tag tag-exam' : 'tag tag-neutral'}">
            ${isBoth ? 'نصفي + نهائي' : 'نصفي فقط'}
          </span>
        </div>
      </div>`;
  }

  function renderGrid() {
    const grid = document.getElementById('subjects-grid');
    if (!grid) return;
    if (filtered.length === 0) {
      grid.innerHTML = KURONI.emptyHTML('confused', 'لا توجد مواد', 'جرّب فلتراً مختلفاً');
      return;
    }
    grid.innerHTML = filtered.map((s, i) => subjectCard(s, i)).join('');
    const cards = grid.querySelectorAll('.animate-card-reveal');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.05 });
    cards.forEach(c => io.observe(c));
  }

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">المواد الدراسية 📚</h1>
      <p class="page-subtitle">السنة الثالثة — كلية طب الأسنان، جامعة طرابلس</p>
    </div>
    <div class="page-content animate-page-enter">
      <div style="display:flex;gap:var(--space-4);margin-bottom:var(--space-6);flex-wrap:wrap;">
        <div class="count-chip" style="font-size:var(--fs-sm);">📚 ${allSubjects.length} مادة</div>
        <div class="count-chip" style="font-size:var(--fs-sm);background:var(--tag-exam-bg);color:var(--tag-exam);">🎯 3 مواد نصفي + نهائي</div>
        <div class="count-chip" style="font-size:var(--fs-sm);">📄 ${allSubjects.reduce((a,s)=>a+s.sheet_count,0)} ملزمة إجمالاً</div>
      </div>
      <div class="filter-row" style="margin-bottom:var(--space-6);" id="subject-filters">
        <button class="filter-chip active" data-filter="all" onclick="filterSubjects('all', this)">الكل (${allSubjects.length})</button>
        <button class="filter-chip" data-filter="both" onclick="filterSubjects('both', this)">نصفي + نهائي (3)</button>
        <button class="filter-chip" data-filter="mid" onclick="filterSubjects('mid', this)">نصفي فقط (9)</button>
      </div>
      <div class="grid-auto" id="subjects-grid" style="--card-min-width: 260px;">
        ${allSubjects.map((s, i) => subjectCard(s, i)).join('')}
      </div>
    </div>`;

  setTimeout(() => {
    const cards = container.querySelectorAll('.animate-card-reveal');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.05 });
    cards.forEach(c => io.observe(c));
  }, 50);

  window.filterSubjects = (type, btn) => {
    document.querySelectorAll('#subject-filters .filter-chip').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (type === 'all')  filtered = [...allSubjects];
    else if (type === 'both') filtered = allSubjects.filter(s => s.exam_schedule.includes('نهائي'));
    else if (type === 'mid')  filtered = allSubjects.filter(s => !s.exam_schedule.includes('نهائي'));
    renderGrid();
  };
}
