/**
 * KURO FANGS — Home Page
 * The command center for students — most important page
 */

export default async function renderHome(container, params) {
  const { default: KF_DATA } = await import('../data.js');
  const { default: KF_STORE } = await import('../store.js');
  const { default: KURONI }   = await import('../kuroni.js');

  // Show loading first
  container.innerHTML = KURONI.loadingHTML('جاري التحميل...', 'md');

  if (!KF_DATA.subjects) await KF_DATA.init();

  const subjects  = KF_DATA.getSubjects(3);
  const latest    = KF_DATA.getLatestSheets(6);
  const topViewed = KF_DATA.getMostViewedSheets(4);
  const examFocus = KF_DATA.getExamFocusSheets().slice(0, 4);
  const alerts    = KF_DATA.getPinnedAlerts();

  // Greeting based on time
  const hour = new Date().getHours();
  let greeting = 'مساء الخير';
  if (hour < 12) greeting = 'صباح الخير';
  else if (hour < 18) greeting = 'مرحباً';

  const typeLabels = {
    sheet: { icon: '📄', label: 'ملزمة' },
    summary: { icon: '📝', label: 'ملخص' },
    recording: { icon: '🎥', label: 'تسجيل' },
    images: { icon: '🖼️', label: 'صور' },
    questions: { icon: '❓', label: 'أسئلة' },
    flashcards: { icon: '🃏', label: 'بطاقات' },
    quiz: { icon: '📋', label: 'كويز' },
    previous: { icon: '📅', label: 'سنوات سابقة' },
  };

  function importanceBadge(lvl) {
    const dots = [1,2,3].map(i =>
      `<span class="importance-dot${i <= lvl ? ' filled' : ''}"></span>`
    ).join('');
    return `<div class="importance" data-level="${lvl}">${dots}</div>`;
  }

  function sheetTags(sheet) {
    return sheet.tags.map(t => {
      if (t === 'امتحان' || t === 'جداً مهم') return `<span class="tag tag-exam">${t}</span>`;
      if (t === 'جديد') return `<span class="tag tag-new">${t}</span>`;
      if (t === 'مهم') return `<span class="tag tag-important">${t}</span>`;
      return `<span class="tag tag-neutral">${t}</span>`;
    }).join('');
  }

  function sheetCard(sheet, idx = 0) {
    const subj = KF_DATA.getSubjectById(sheet.subject_id);
    const doc  = KF_DATA.getDoctorById(sheet.doctor_id);
    const type = typeLabels[sheet.type] || { icon: '📄', label: sheet.type };
    const splitBadge = sheet.is_split
      ? `<span class="tag tag-split">جزء ${sheet.split_part}/${sheet.split_total}</span>`
      : '';
    return `
      <div class="sheet-card animate-card-reveal stagger-${idx + 1} hover-lift hover-press"
           onclick="ROUTER.navigate('/sheets/${sheet.id}')" role="button" tabindex="0">
        <div class="sheet-type-indicator sheet-type-${sheet.type}">
          <span>${type.icon}</span>
        </div>
        <div class="sheet-card-body">
          <div class="sheet-title">${sheet.title_ar}</div>
          <div class="sheet-meta">
            <span class="sheet-meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              ${sheet.date}
            </span>
            <span class="sheet-meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              ${doc?.name_ar || 'غير محدد'}
            </span>
            ${subj ? `<span class="sheet-meta-item" style="color:${subj.color}">${subj.name_ar}</span>` : ''}
          </div>
          <div class="sheet-tags">
            ${sheetTags(sheet)}
            ${splitBadge}
            ${sheet.is_exam_focus ? '<span class="tag tag-exam">🎯 امتحان</span>' : ''}
          </div>
        </div>
        <div class="sheet-card-actions">
          ${importanceBadge(sheet.importance)}
          <button class="fav-btn ${KF_STORE.isFavorite(sheet.id) ? 'active' : ''}"
                  onclick="event.stopPropagation(); toggleFav('${sheet.id}', this)" title="المفضلة">♥</button>
        </div>
      </div>`;
  }

  function subjectQuickCard(subj) {
    return `
      <div class="quick-access-card hover-press" style="--subject-color:${subj.color}"
           onclick="ROUTER.navigate('/subjects/${subj.id}')" role="button">
        <div class="qac-icon-wrap" style="background: ${subj.color}22; font-size: 22px;">${subj.icon}</div>
        <span class="qac-label">${subj.name_ar}</span>
      </div>`;
  }

  function alertBanner(alert) {
    const sevClass = alert.severity === 'exam' ? 'alert-banner-exam'
                   : alert.severity === 'warning' ? 'alert-banner-warning'
                   : 'alert-banner-info';
    const icon = alert.severity === 'exam' ? '🎯' : alert.severity === 'warning' ? '⚠️' : 'ℹ️';
    return `
      <div class="alert-banner ${sevClass} alert-enter">
        <span class="alert-icon">${icon}</span>
        <div class="alert-body">
          <div class="alert-title">${alert.title_ar}</div>
          <div class="alert-message">${alert.message_ar}</div>
          <div class="alert-meta">${alert.date}</div>
        </div>
      </div>`;
  }

  const now = new Date();
  const dateStr = now.toLocaleDateString('ar-LY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  container.innerHTML = `
    <div class="page-content animate-page-enter">

      <!-- Greeting Strip -->
      <div class="greeting-strip" style="margin-top: var(--space-2);">
        <div class="greeting-kuroni kuroni-state-floating">
          ${KURONI.getSVG('calm')}
        </div>
        <div class="greeting-text">
          <div class="greeting-hello">${greeting}، <span class="lime">طالب كورو</span> 🐱</div>
          <div class="greeting-sub">أهلاً بك في منصة Kuro Fangs — كلية طب الأسنان، طرابلس</div>
          <div class="greeting-date en">${dateStr}</div>
        </div>
        <div class="points-chip">
          ⭐ ${KF_STORE.getPoints()} نقطة
        </div>
      </div>

      <!-- Pinned Alerts -->
      ${alerts.length > 0 ? `
        <div class="section">
          <div class="section-header">
            <h2 class="section-title"><span class="title-dot"></span> تنبيهات الأطباء</h2>
            <a class="section-action" href="#/alerts">عرض الكل</a>
          </div>
          ${alerts.map(alertBanner).join('')}
        </div>` : ''}

      <!-- Search Bar -->
      <div class="section" style="margin-bottom: var(--space-6);">
        <div class="input-wrapper">
          <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input class="search-bar" id="home-search" type="text"
                 placeholder="ابحث عن ملزمة، مادة، دكتور، موضوع..."
                 oninput="handleHomeSearch(this.value)"/>
        </div>
      </div>

      <!-- Quick Access Row -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title"><span class="title-dot"></span> وصول سريع</h2>
        </div>
        <div class="scroll-row">
          <div class="quick-access-card hover-press" onclick="ROUTER.navigate('/requirements')" style="border-right:3px solid var(--color-primary-dark);">
            <div class="qac-icon-wrap" style="background:rgba(180, 212, 85, 0.2);">🦷</div>
            <span class="qac-label">متطلبات المعمل</span>
          </div>
          <div class="quick-access-card hover-press" onclick="ROUTER.navigate('/calculator')" style="border-right:3px solid #4ECDC4;">
            <div class="qac-icon-wrap" style="background:rgba(78, 205, 196, 0.2);">🧮</div>
            <span class="qac-label">حاسبة الدرجات</span>
          </div>
          <div class="quick-access-card hover-press" onclick="ROUTER.navigate('/quizzes')" style="border-right:3px solid #FF8C42;">
            <div class="qac-icon-wrap" style="background:rgba(255, 140, 66, 0.2);">📋</div>
            <span class="qac-label">الكويز التفاعلي</span>
          </div>
          <div class="quick-access-card hover-press" onclick="ROUTER.navigate('/previous-years')">
            <div class="qac-icon-wrap">📅</div>
            <span class="qac-label">سنوات سابقة</span>
          </div>
          <div class="quick-access-card hover-press" onclick="ROUTER.navigate('/sheets')">
            <div class="qac-icon-wrap">📄</div>
            <span class="qac-label">الملازم</span>
          </div>
          <div class="quick-access-card hover-press" onclick="ROUTER.navigate('/flashcards')">
            <div class="qac-icon-wrap">🃏</div>
            <span class="qac-label">البطاقات</span>
          </div>
          <div class="quick-access-card hover-press" onclick="ROUTER.navigate('/summaries')">
            <div class="qac-icon-wrap">📝</div>
            <span class="qac-label">الملخصات</span>
          </div>
          <div class="quick-access-card hover-press" onclick="ROUTER.navigate('/previous-years')">
            <div class="qac-icon-wrap">📅</div>
            <span class="qac-label">سنوات سابقة</span>
          </div>
          <div class="quick-access-card hover-press" onclick="ROUTER.navigate('/videos')">
            <div class="qac-icon-wrap">🎥</div>
            <span class="qac-label">التسجيلات</span>
          </div>
          <div class="quick-access-card hover-press" onclick="ROUTER.navigate('/exams')">
            <div class="qac-icon-wrap">🎯</div>
            <span class="qac-label">الامتحانات</span>
          </div>
        </div>
      </div>

      <!-- Latest Uploads -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title"><span class="title-dot"></span> أحدث الإضافات</h2>
          <a class="section-action" onclick="ROUTER.navigate('/sheets')">عرض الكل</a>
        </div>
        <div class="grid-auto">
          ${latest.map((s, i) => sheetCard(s, i)).join('')}
        </div>
      </div>

      <!-- Exam Focus -->
      ${examFocus.length > 0 ? `
        <div class="section">
          <div class="section-header">
            <h2 class="section-title"><span class="title-dot" style="background:var(--tag-exam)"></span> تركيز الامتحان 🎯</h2>
            <a class="section-action" onclick="ROUTER.navigate('/exams')">عرض الكل</a>
          </div>
          <div class="grid-auto">
            ${examFocus.map((s, i) => sheetCard(s, i)).join('')}
          </div>
        </div>` : ''}

      <!-- Subjects Grid -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title"><span class="title-dot"></span> المواد الدراسية — السنة الثالثة</h2>
          <a class="section-action" onclick="ROUTER.navigate('/subjects')">عرض الكل</a>
        </div>
        <div class="grid-auto" style="--card-min-width: 180px;">
          ${subjects.map(subjectQuickCard).join('')}
        </div>
      </div>

      <!-- Most Viewed -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title"><span class="title-dot"></span> الأكثر مشاهدةً</h2>
        </div>
        <div class="grid-2">
          ${topViewed.map((s, i) => sheetCard(s, i)).join('')}
        </div>
      </div>

      <!-- Kuroni footer strip -->
      <div style="display:flex;align-items:center;justify-content:center;gap:var(--space-3);padding:var(--space-8) 0;opacity:0.3;">
        <div class="kuroni-container kuroni-sm">
          ${KURONI.getSVG('calm')}
        </div>
        <span style="font-size:var(--fs-xs);color:var(--color-text-muted);">Kuro Fangs — كلية طب الأسنان، جامعة طرابلس</span>
      </div>

    </div>`;

  // Activate stagger animations with IntersectionObserver
  const revealCards = container.querySelectorAll('.animate-card-reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  revealCards.forEach(el => io.observe(el));

  // Global functions for this page
  window.toggleFav = (id, btn) => {
    const isNow = KF_STORE.toggleFavorite(id);
    btn.classList.toggle('active', isNow);
    showToast(isNow ? '❤️ أُضيف للمفضلة' : '🤍 أُزيل من المفضلة');
  };

  window.handleHomeSearch = (val) => {
    if (val.length > 1) {
      ROUTER.navigate(`/search?q=${encodeURIComponent(val)}`);
    }
  };
}
