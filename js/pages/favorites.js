/**
 * KURO FANGS — Favorites Page
 */

export default async function renderFavorites(container, params) {
  const { default: KF_DATA } = await import('../data.js');
  const { default: KF_STORE } = await import('../store.js');
  const { default: KURONI }   = await import('../kuroni.js');
  if (!KF_DATA.subjects) await KF_DATA.init();

  const favIds = KF_STORE.getFavorites();
  const favs   = favIds.map(id => KF_DATA.getSheetById(id)).filter(Boolean);

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
            ${sheet.importance === 3 ? '<span class="tag tag-exam">مهم جداً</span>' : ''}
          </div>
        </div>
        <div class="sheet-card-actions">
          <button class="fav-btn active"
                  onclick="event.stopPropagation();removeFav('${sheet.id}',this)" title="إزالة من المفضلة">♥</button>
        </div>
      </div>`;
  }

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">المفضلة ❤️</h1>
      <p class="page-subtitle">${favs.length} عنصر محفوظ في المفضلة</p>
    </div>
    <div class="page-content animate-page-enter" id="favs-container">
      ${favs.length === 0
        ? KURONI.emptyHTML('thinking', 'لا توجد مفضلات بعد', 'اضغط على ♥ في أي ملزمة لإضافتها هنا!')
        : `<div class="grid-auto">${favs.map((s, i) => sheetCard(s, i)).join('')}</div>`}
    </div>`;

  setTimeout(() => {
    const cards = container.querySelectorAll('.animate-card-reveal');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    cards.forEach(c => io.observe(c));
  }, 50);

  window.removeFav = (id, btn) => {
    KF_STORE.toggleFavorite(id);
    const card = btn.closest('.sheet-card');
    if (card) {
      card.style.transition = 'opacity 200ms, transform 200ms';
      card.style.opacity = '0';
      card.style.transform = 'scale(0.9)';
      setTimeout(() => {
        card.remove();
        showToast('🤍 أُزيل من المفضلة');
        const favs2 = KF_STORE.getFavorites();
        if (favs2.length === 0) {
          document.getElementById('favs-container').innerHTML =
            KURONI.emptyHTML('thinking', 'لا توجد مفضلات بعد', 'اضغط على ♥ في أي ملزمة لإضافتها هنا!');
        }
      }, 200);
    }
  };
}
