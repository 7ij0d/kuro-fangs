/**
 * subject-detail.js — Single Subject Detail Page
 * Kuro Fangs Academic Platform
 * params.id = subject ID
 */

export default async function subjectDetailPage(container, params) {
  const { default: KF_DATA } = await import('../data.js');
  const { default: KF_STORE } = await import('../store.js');
  const { default: KURONI }   = await import('../kuroni.js');

  if (!KF_DATA.subjects) await KF_DATA.init();

  const subjectId = params?.id || params?.subjectId;
  const subject = KF_DATA.getSubjectById
    ? KF_DATA.getSubjectById(subjectId)
    : (KF_DATA.subjects || []).find(s => String(s.id) === String(subjectId));

  if (!subject) {
    container.innerHTML = `
      <div class="page-wrapper" dir="rtl">
        ${KURONI.emptyHTML
          ? KURONI.emptyHTML('confused', 'مادة غير موجودة', 'تحقق من الرابط أو عُد للقائمة')
          : '<p class="text-center text-muted">المادة غير موجودة</p>'}
        <div class="text-center mt-4">
          <button class="btn btn-outline" id="back-btn">العودة للمواد</button>
        </div>
      </div>`;
    container.querySelector('#back-btn')?.addEventListener('click', () => {
      window.ROUTER ? window.ROUTER.go('/subjects') : (window.location.hash = '#/subjects');
    });
    return;
  }

  // ── State ────────────────────────────────────────────────────────────────
  const TYPE_FILTERS = [
    { key: 'all',        label: 'الكل' },
    { key: 'sheet',      label: 'ملازم' },
    { key: 'summary',    label: 'ملخصات' },
    { key: 'questions',  label: 'أسئلة' },
    { key: 'flashcards', label: 'بطاقات' },
    { key: 'recording',  label: 'تسجيلات' },
  ];
  let activeType = 'all';

  // ── Helpers ──────────────────────────────────────────────────────────────
  const TYPE_ICONS = {
    sheet:      '📄',
    summary:    '📝',
    recording:  '🎥',
    images:     '🖼️',
    questions:  '❓',
    flashcards: '🃏',
    quiz:       '📋',
    previous:   '📅',
  };
  const TYPE_LABELS = {
    sheet:      'ملزمة',
    summary:    'ملخص',
    recording:  'تسجيل',
    images:     'صور',
    questions:  'أسئلة',
    flashcards: 'بطاقات',
    quiz:       'اختبار',
    previous:   'سابقة',
  };

  function hasFinalExam(subj) {
    return subj.has_final !== false && subj.exam_type !== 'mid-only';
  }

  function availableTypePills(types = []) {
    if (!types.length) return '<span class="text-muted text-xs">لا يوجد محتوى</span>';
    return types.map(t =>
      `<span class="type-pill type-pill--${t}" title="${TYPE_LABELS[t] || t}">${TYPE_ICONS[t] || '📄'} ${TYPE_LABELS[t] || t}</span>`
    ).join('');
  }

  function importanceDots(level = 1) {
    const colors = ['', 'var(--kf-teal)', 'var(--kf-amber)', 'var(--kf-red)'];
    const count  = Math.min(level, 3);
    return Array.from({ length: count }, () =>
      `<span class="importance-dot" style="background:${colors[count]}"></span>`
    ).join('');
  }

  function sheetCardHTML(sheet, index) {
    const stagger = `stagger-${Math.min(index + 1, 8)}`;
    const isFav = KF_STORE.isFavorite ? KF_STORE.isFavorite(sheet.id) : false;
    const tags = (sheet.tags || []).map(tag =>
      `<span class="tag tag-${tag}">${tag}</span>`
    ).join('');

    return `
      <article
        class="sheet-card hover-lift animate-card-reveal ${stagger}"
        data-sheet-id="${sheet.id}"
        role="button"
        tabindex="0"
        aria-label="${sheet.title_ar || sheet.title || ''}"
      >
        <div class="sheet-card__header">
          <div class="sheet-card__importance">${importanceDots(sheet.importance)}</div>
          <div class="sheet-card__tags">${tags}</div>
          <button
            class="btn-ghost fav-btn ${isFav ? 'fav-btn--active' : ''}"
            data-sheet-id="${sheet.id}"
            aria-label="${isFav ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}"
            title="${isFav ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}"
          >${isFav ? '❤️' : '🤍'}</button>
        </div>
        <h4 class="sheet-card__title">${sheet.title_ar || sheet.title || ''}</h4>
        ${sheet.title_en ? `<p class="sheet-card__title-en text-muted text-sm">${sheet.title_en}</p>` : ''}
        <div class="sheet-card__types">${availableTypePills(sheet.available_types || [])}</div>
        <div class="sheet-card__meta">
          ${sheet.doctor ? `<span class="doctor-chip text-xs">${sheet.doctor}</span>` : ''}
          ${sheet.date   ? `<span class="date-chip text-xs">${sheet.date}</span>` : ''}
          ${sheet.is_split ? `<span class="tag tag-split">Split</span>` : ''}
        </div>
      </article>
    `;
  }

  function lectureGroupHTML(group, groupIndex) {
    const { lecture, sheets } = group;
    const visibleSheets = activeType === 'all'
      ? sheets
      : sheets.filter(s => (s.available_types || []).includes(activeType));
    if (visibleSheets.length === 0) return '';

    return `
      <section class="lecture-group animate-card-reveal stagger-${Math.min(groupIndex + 1, 8)}">
        <div class="lecture-group__header">
          <span class="lecture-chip">محاضرة ${lecture.number ?? lecture.num ?? groupIndex + 1}</span>
          <div class="lecture-group__info">
            <span class="lecture-group__title-ar">${lecture.title_ar || lecture.title || ''}</span>
            ${lecture.title_en ? `<span class="lecture-group__title-en text-muted text-sm">${lecture.title_en}</span>` : ''}
          </div>
          <div class="lecture-group__badges">
            ${lecture.date ? `<span class="date-chip text-xs">${lecture.date}</span>` : ''}
            ${lecture.doctor ? `<span class="doctor-chip text-xs">${lecture.doctor}</span>` : ''}
            ${lecture.is_split ? `<span class="tag tag-split">Split</span>` : ''}
          </div>
        </div>
        <div class="lecture-group__sheets">
          ${visibleSheets.map((s, i) => sheetCardHTML(s, i)).join('')}
        </div>
      </section>
    `;
  }

  // ── Full Render ──────────────────────────────────────────────────────────
  function renderPage() {
    const color = subject.color || 'var(--kf-teal)';
    const doctors = Array.isArray(subject.doctors)
      ? subject.doctors
      : subject.doctor ? [subject.doctor] : [];

    let lectureGroups = [];
    if (KF_DATA.getSheetsByLecture) {
      lectureGroups = KF_DATA.getSheetsByLecture(subjectId) || [];
    } else if (KF_DATA.getLectureGroups) {
      lectureGroups = KF_DATA.getLectureGroups(subjectId) || [];
    }

    const totalSheets = lectureGroups.reduce((acc, g) => acc + (g.sheets?.length || 0), 0);

    container.innerHTML = `
      <div class="page-wrapper" dir="rtl">

        <!-- Back Button -->
        <button class="btn btn-ghost btn-back" id="back-btn" aria-label="العودة">&#8594; العودة</button>

        <!-- Subject Header -->
        <header class="subject-detail-header" style="--subject-color: ${color};">
          <div class="subject-detail-header__icon" aria-hidden="true">${subject.icon || '📚'}</div>
          <div class="subject-detail-header__body">
            <h1 class="subject-detail-header__name-ar">${subject.name_ar || subject.name}</h1>
            <p class="subject-detail-header__name-en text-muted">${subject.name_en || ''}</p>
            <div class="subject-detail-header__badges">
              ${hasFinalExam(subject)
                ? '<span class="tag tag-exam">نصفي + نهائي</span>'
                : '<span class="tag tag-new">نصفي فقط</span>'}
              ${totalSheets ? `<span class="meta-chip">📄 ${totalSheets} ملزمة</span>` : ''}
            </div>
            ${doctors.length ? `
              <div class="subject-detail-header__doctors">
                <span class="text-muted text-sm">الأطباء: </span>
                ${doctors.map(d => `<span class="doctor-chip">${d}</span>`).join('')}
              </div>` : ''}
          </div>
        </header>

        <!-- Type Filter Chips -->
        <nav class="filter-bar" aria-label="تصفية النوع">
          ${TYPE_FILTERS.map(f =>
            `<button class="filter-chip ${activeType === f.key ? 'filter-chip--active' : ''}" data-type="${f.key}">${f.label}</button>`
          ).join('')}
        </nav>

        <!-- Lecture Groups -->
        <div id="lecture-groups-container">
          ${lectureGroups.length === 0
            ? (KURONI.emptyHTML
                ? KURONI.emptyHTML('sleepy', 'لا يوجد محتوى', 'سيُضاف المحتوى قريباً!')
                : '<p class="text-center text-muted">لا يوجد محتوى حتى الآن</p>')
            : lectureGroups.map((g, i) => lectureGroupHTML(g, i)).join('')
          }
        </div>
      </div>
    `;

    // Back button
    container.querySelector('#back-btn')?.addEventListener('click', () => {
      window.ROUTER ? window.ROUTER.go('/subjects') : (window.location.hash = '#/subjects');
    });

    // Type filter chips
    container.querySelectorAll('.filter-chip[data-type]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeType = btn.dataset.type;
        renderPage();
      });
    });

    // Sheet card navigation
    container.querySelectorAll('.sheet-card[data-sheet-id]').forEach(card => {
      const navigate = () => {
        const id = card.dataset.sheetId;
        window.ROUTER ? window.ROUTER.go(`/sheets/${id}`) : (window.location.hash = `#/sheets/${id}`);
      };
      card.addEventListener('click', e => {
        if (e.target.closest('.fav-btn')) return;
        navigate();
      });
      card.addEventListener('keydown', e => {
        if ((e.key === 'Enter' || e.key === ' ') && !e.target.classList.contains('fav-btn')) {
          e.preventDefault();
          navigate();
        }
      });
    });

    // Favorite buttons
    container.querySelectorAll('.fav-btn[data-sheet-id]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const id = btn.dataset.sheetId;
        if (KF_STORE.toggleFavorite) {
          KF_STORE.toggleFavorite(id);
        } else if (KF_STORE.isFavorite && KF_STORE.isFavorite(id)) {
          KF_STORE.removeFavorite?.(id);
        } else {
          KF_STORE.addFavorite?.(id);
        }
        btn.classList.toggle('fav-btn--active');
        btn.textContent = btn.classList.contains('fav-btn--active') ? '❤️' : '🤍';
      });
    });
  }

  renderPage();
}
