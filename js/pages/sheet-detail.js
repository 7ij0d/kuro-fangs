/**
 * sheet-detail.js — Single Sheet Detail Page
 * Kuro Fangs Academic Platform
 * params.id = sheet ID
 */

export default async function sheetDetailPage(container, params) {
  const { default: KF_DATA }  = await import('../data.js');
  const { default: KF_STORE } = await import('../store.js');
  const { default: KURONI }   = await import('../kuroni.js');

  if (!KF_DATA.subjects) await KF_DATA.init();

  const sheetId = params?.id || params?.sheetId;
  const sheet   = KF_DATA.getSheetById ? KF_DATA.getSheetById(sheetId) : null;

  if (!sheet) {
    container.innerHTML = `
      <div class="page-wrapper" dir="rtl">
        ${KURONI.emptyHTML
          ? KURONI.emptyHTML('confused', 'ملزمة غير موجودة', 'تحقق من الرابط أو ارجع للمادة')
          : '<p class="text-center text-muted">الملزمة غير موجودة</p>'}
        <div class="text-center mt-4">
          <button class="btn btn-outline" id="back-btn">العودة</button>
        </div>
      </div>`;
    container.querySelector('#back-btn')?.addEventListener('click', () => history.back());
    return;
  }

  // ── Lookups ──────────────────────────────────────────────────────────────
  const subject = KF_DATA.getSubjectById
    ? KF_DATA.getSubjectById(sheet.subject_id)
    : null;

  const ALL_TYPES = [
    { key: 'sheet',      icon: '📄', label: 'الملزمة الأصلية' },
    { key: 'summary',    icon: '📝', label: 'الملخص' },
    { key: 'recording',  icon: '🎥', label: 'التسجيل' },
    { key: 'images',     icon: '🖼️', label: 'الصور' },
    { key: 'questions',  icon: '❓', label: 'الأسئلة' },
    { key: 'flashcards', icon: '🃏', label: 'البطاقات' },
    { key: 'quiz',       icon: '📋', label: 'الاختبار' },
    { key: 'previous',   icon: '📅', label: 'سابقة' },
  ];

  const availableTypes = new Set(sheet.available_types || []);

  // ── Helpers ──────────────────────────────────────────────────────────────
  function importanceDots(level = 1) {
    const colors = ['', 'var(--kf-teal)', 'var(--kf-amber)', 'var(--kf-red)'];
    const count  = Math.min(Math.max(level, 1), 3);
    return Array.from({ length: count }, () =>
      `<span class="importance-dot" style="background:${colors[count]}"></span>`
    ).join('');
  }

  function tagsHTML(tags = []) {
    return tags.map(tag => `<span class="tag tag-${tag}">${tag}</span>`).join('');
  }

  function contentTypeCardHTML(typeObj) {
    const isAvailable = availableTypes.has(typeObj.key);
    return `
      <button
        class="content-type-card ${isAvailable ? 'content-type-card--available' : 'content-type-card--unavailable'}"
        data-type="${typeObj.key}"
        ${!isAvailable ? 'disabled aria-disabled="true"' : ''}
        aria-label="${typeObj.label}${!isAvailable ? ' — قريباً' : ''}"
      >
        <span class="content-type-card__icon" aria-hidden="true">${typeObj.icon}</span>
        <span class="content-type-card__label">${typeObj.label}</span>
        ${!isAvailable ? '<span class="content-type-card__soon">قريباً</span>' : ''}
      </button>
    `;
  }

  function relatedSheetCardHTML(rel) {
    return `
      <article
        class="sheet-card sheet-card--compact hover-lift"
        data-sheet-id="${rel.id}"
        role="button"
        tabindex="0"
        aria-label="${rel.title_ar || rel.title || ''}"
      >
        <div class="sheet-card__title">${rel.title_ar || rel.title || ''}</div>
        <div class="sheet-card__meta">
          ${rel.doctor ? `<span class="doctor-chip text-xs">${rel.doctor}</span>` : ''}
          ${(rel.available_types || []).map(t => {
            const ti = ALL_TYPES.find(x => x.key === t);
            return ti ? `<span class="type-pill type-pill--${t}">${ti.icon}</span>` : '';
          }).join('')}
        </div>
      </article>
    `;
  }

  // ── Related sheets (same lecture / subject) ───────────────────────────────
  let relatedSheets = [];
  if (KF_DATA.getSheetsByLecture && sheet.lecture_id) {
    const groups = KF_DATA.getSheetsByLecture(sheet.subject_id) || [];
    const group  = groups.find(g => g.lecture?.id === sheet.lecture_id);
    if (group) relatedSheets = (group.sheets || []).filter(s => String(s.id) !== String(sheetId));
  }

  // ── Saved note ────────────────────────────────────────────────────────────
  const savedNote = KF_STORE.getNote ? KF_STORE.getNote(sheetId) : '';
  const isFav     = KF_STORE.isFavorite ? KF_STORE.isFavorite(sheetId) : false;
  const isSaved   = KF_STORE.isSaved ? KF_STORE.isSaved(sheetId) : false;

  // ── Render ────────────────────────────────────────────────────────────────
  const color = subject?.color || 'var(--kf-teal)';

  container.innerHTML = `
    <div class="page-wrapper" dir="rtl">

      <!-- Back -->
      <button class="btn btn-ghost btn-back" id="back-btn" aria-label="العودة">&#8594; العودة</button>

      <!-- Sheet Header -->
      <header class="sheet-detail-header" style="--subject-color: ${color};">
        <div class="sheet-detail-header__top">
          ${subject ? `
            <button
              class="subject-chip subject-chip--clickable"
              data-subject-id="${subject.id}"
              aria-label="الذهاب لمادة ${subject.name_ar || subject.name}"
            >${subject.icon || '📚'} ${subject.name_ar || subject.name}</button>` : ''}
          <div class="sheet-detail-header__importance">
            ${importanceDots(sheet.importance)}
          </div>
          ${sheet.is_split ? '<span class="tag tag-split">Split</span>' : ''}
        </div>

        <h1 class="sheet-detail-header__title">${sheet.title_ar || sheet.title || ''}</h1>
        ${sheet.title_en ? `<p class="sheet-detail-header__title-en text-muted">${sheet.title_en}</p>` : ''}

        <div class="sheet-detail-header__meta">
          ${sheet.doctor ? `<span class="doctor-chip">${sheet.doctor}</span>` : ''}
          ${sheet.date   ? `<span class="date-chip">${sheet.date}</span>` : ''}
          <div class="sheet-detail-header__tags">${tagsHTML(sheet.tags || [])}</div>
        </div>

        <!-- Action Buttons -->
        <div class="sheet-detail-header__actions">
          <button class="btn btn-ghost fav-btn ${isFav ? 'fav-btn--active' : ''}" id="fav-btn" aria-label="${isFav ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}">
            ${isFav ? '❤️' : '🤍'} مفضلة
          </button>
          <button class="btn btn-ghost save-btn ${isSaved ? 'save-btn--active' : ''}" id="save-btn" aria-label="${isSaved ? 'إلغاء الحفظ' : 'حفظ'}">
            ${isSaved ? '🔖' : '📌'} حفظ
          </button>
        </div>
      </header>

      <!-- Content Type Grid -->
      <section class="section" aria-label="أنواع المحتوى">
        <h2 class="section-title">المحتوى المتاح</h2>
        <div class="content-type-grid">
          ${ALL_TYPES.map(t => contentTypeCardHTML(t)).join('')}
        </div>
      </section>

      <!-- Notes Section -->
      <section class="section notes-section" aria-label="ملاحظاتي">
        <h2 class="section-title">📒 ملاحظاتي</h2>
        <textarea
          class="notes-input"
          id="notes-textarea"
          placeholder="اكتب ملاحظاتك هنا..."
          aria-label="ملاحظات الملزمة"
          rows="5"
          dir="rtl"
        >${savedNote || ''}</textarea>
        <div class="notes-actions">
          <button class="btn btn-primary" id="save-note-btn">💾 حفظ الملاحظة</button>
          <button class="btn btn-ghost" id="clear-note-btn">🗑️ مسح</button>
          <span class="save-feedback" id="save-feedback" aria-live="polite"></span>
        </div>
      </section>

      <!-- Related Sheets -->
      ${relatedSheets.length > 0 ? `
        <section class="section" aria-label="ملازم مرتبطة">
          <h2 class="section-title">ملازم من نفس المحاضرة</h2>
          <div class="sheet-grid sheet-grid--compact">
            ${relatedSheets.map(s => relatedSheetCardHTML(s)).join('')}
          </div>
        </section>` : ''}
    </div>
  `;

  // ── Event Listeners ───────────────────────────────────────────────────────

  // Back
  container.querySelector('#back-btn')?.addEventListener('click', () => history.back());

  // Subject chip
  container.querySelector('.subject-chip--clickable')?.addEventListener('click', () => {
    const id = subject?.id;
    if (id) window.ROUTER ? window.ROUTER.go(`/subjects/${id}`) : (window.location.hash = `#/subjects/${id}`);
  });

  // Favorite
  container.querySelector('#fav-btn')?.addEventListener('click', () => {
    const btn = container.querySelector('#fav-btn');
    if (KF_STORE.toggleFavorite) KF_STORE.toggleFavorite(sheetId);
    else if (KF_STORE.isFavorite?.(sheetId)) KF_STORE.removeFavorite?.(sheetId);
    else KF_STORE.addFavorite?.(sheetId);
    const nowFav = KF_STORE.isFavorite ? KF_STORE.isFavorite(sheetId) : !btn.classList.contains('fav-btn--active');
    btn.classList.toggle('fav-btn--active', nowFav);
    btn.innerHTML = nowFav ? '❤️ مفضلة' : '🤍 مفضلة';
    btn.setAttribute('aria-label', nowFav ? 'إزالة من المفضلة' : 'إضافة للمفضلة');
  });

  // Save / bookmark
  container.querySelector('#save-btn')?.addEventListener('click', () => {
    const btn = container.querySelector('#save-btn');
    if (KF_STORE.toggleSaved) KF_STORE.toggleSaved(sheetId);
    else if (KF_STORE.isSaved?.(sheetId)) KF_STORE.removeSaved?.(sheetId);
    else KF_STORE.addSaved?.(sheetId);
    const nowSaved = KF_STORE.isSaved ? KF_STORE.isSaved(sheetId) : !btn.classList.contains('save-btn--active');
    btn.classList.toggle('save-btn--active', nowSaved);
    btn.innerHTML = nowSaved ? '🔖 حفظ' : '📌 حفظ';
  });

  // Save note
  container.querySelector('#save-note-btn')?.addEventListener('click', () => {
    const text = container.querySelector('#notes-textarea')?.value || '';
    if (KF_STORE.setNote) KF_STORE.setNote(sheetId, text);
    const feedback = container.querySelector('#save-feedback');
    if (feedback) {
      feedback.textContent = '✅ تم الحفظ!';
      setTimeout(() => { feedback.textContent = ''; }, 2000);
    }
  });

  // Clear note
  container.querySelector('#clear-note-btn')?.addEventListener('click', () => {
    const ta = container.querySelector('#notes-textarea');
    if (ta) ta.value = '';
    if (KF_STORE.setNote) KF_STORE.setNote(sheetId, '');
  });

  // Content type cards
  container.querySelectorAll('.content-type-card--available[data-type]').forEach(card => {
    card.addEventListener('click', () => {
      const type = card.dataset.type;
      // Navigate to content viewer or open content
      window.ROUTER
        ? window.ROUTER.go(`/sheets/${sheetId}/${type}`)
        : (window.location.hash = `#/sheets/${sheetId}/${type}`);
    });
  });

  // Related sheet cards
  container.querySelectorAll('.sheet-card[data-sheet-id]').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.sheetId;
      window.ROUTER ? window.ROUTER.go(`/sheets/${id}`) : (window.location.hash = `#/sheets/${id}`);
    });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
}
