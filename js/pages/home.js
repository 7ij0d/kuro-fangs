/**
 * KURO FANGS — HOME DASHBOARD (REDESIGNED ACADEMIA v3)
 * Modern Academic Dashboard: Compact Greeting Banner, Tabbed Daily Lectures & Lightweight Subject Tiles
 */

const SUBJECT_THEMES = {
  'gen-med':        { icon: 'stethoscope', color: '#0D9488', bg: 'rgba(13, 148, 136, 0.10)', border: 'rgba(13, 148, 136, 0.22)' },
  'gen-surgery':    { icon: 'activity',    color: '#EF4444', bg: 'rgba(239, 68, 68, 0.10)',  border: 'rgba(239, 68, 68, 0.22)' },
  'fixed-pros':     { icon: 'shield',      color: '#D97706', bg: 'rgba(217, 119, 6, 0.10)',  border: 'rgba(217, 119, 6, 0.22)' },
  'omfs':           { icon: 'scissors',    color: '#C84343', bg: 'rgba(200, 67, 67, 0.10)',  border: 'rgba(200, 67, 67, 0.22)' },
  'oral-diseases':  { icon: 'microscope',  color: '#EA580C', bg: 'rgba(234, 88, 12, 0.10)',  border: 'rgba(234, 88, 12, 0.22)' },
  'endo':           { icon: 'zap',         color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.10)', border: 'rgba(124, 58, 237, 0.22)' },
  'omdr':           { icon: 'scan',        color: '#6366F1', bg: 'rgba(99, 102, 241, 0.10)', border: 'rgba(99, 102, 241, 0.22)' },
  'preventive':     { icon: 'sparkles',    color: '#0284C7', bg: 'rgba(2, 132, 199, 0.10)',  border: 'rgba(2, 132, 199, 0.22)' },
  'cons-endo':      { icon: 'heart-pulse', color: '#059669', bg: 'rgba(5, 150, 105, 0.10)',  border: 'rgba(5, 150, 105, 0.22)' },
  'ortho':          { icon: 'smile',       color: '#0EA5E9', bg: 'rgba(14, 165, 233, 0.10)', border: 'rgba(14, 165, 233, 0.22)' },
  'pediatric':      { icon: 'baby',        color: '#A855F7', bg: 'rgba(168, 85, 247, 0.10)', border: 'rgba(168, 85, 247, 0.22)' },
  'pedo':           { icon: 'baby',        color: '#A855F7', bg: 'rgba(168, 85, 247, 0.10)', border: 'rgba(168, 85, 247, 0.22)' },
  'removable-pros': { icon: 'layers',      color: '#DB2777', bg: 'rgba(219, 39, 119, 0.10)', border: 'rgba(219, 39, 119, 0.22)' }
};

const DEFAULT_THEME = {
  icon: 'book-open',
  color: 'var(--brand-burgundy, #2357d9)',
  bg: 'rgba(35, 87, 217, 0.08)',
  border: 'rgba(35, 87, 217, 0.20)'
};

const HomePage = {
  searchQuery: '',
  loadingTimeout: null,
  activeDailyTab: 'today',
  _todayFormatted: '',
  _tomorrowFormatted: '',

  /* ─── Time-based greeting ─── */
  getGreeting(t) {
    const h = new Date().getHours();
    if (h < 12) return t('heroGreetingMorning');
    if (h < 17) return t('heroGreetingAfternoon');
    return t('heroGreetingEvening');
  },

  handleSubjectClick(subjectId) {
    if (window.SubjectModal && window.SubjectModal.open) {
      window.SubjectModal.open(subjectId);
    }
    setTimeout(() => {
      try {
        HomePage.trackSubjectVisit(subjectId);
      } catch (e) {
        console.error('Error tracking subject visit', e);
      }
    }, 10);
  },

  /* ✨ Track subject visit ✨ */
  trackSubjectVisit(subjectId) {
    try {
      let recent = JSON.parse(localStorage.getItem('kf_recent_subjects') || '[]');
      recent = recent.filter(id => id !== subjectId);
      recent.unshift(subjectId);
      recent = recent.slice(0, 6);
      localStorage.setItem('kf_recent_subjects', JSON.stringify(recent));
    } catch { /* silent */ }
  },

  /* ─── Quick Access item counts ─── */
  getQuickAccessCounts() {
    const questions = window.DATA?.questions || [];
    const exams = window.DATA?.previousExams || [];
    const flashcards = window.DATA?.flashcards || [];
    return {
      questions: questions.length,
      exams: exams.length,
      flashcards: flashcards.length
    };
  },

  /* ══════════════════════════════════════════
     1. COMPACT GREETING BANNER (Zero Progress / Zero Hero Bloat)
     ══════════════════════════════════════════ */
  renderHeroSection(isAr, t) {
    const greeting = HomePage.getGreeting(t);
    const charImg = window.CharacterThemeSystem ? window.CharacterThemeSystem.getAsset('idle') : 'assets/characters/kuro/Kuro-Idle.png';
    const mascotName = isAr ? 'كورو' : 'Kuro';
    const userName = window.STORE?.getUserInfo?.()?.name || (isAr ? 'طالب' : 'Student');

    return `
      <section class="home-compact-banner">
        <div class="home-compact-greeting-wrap">
          <div class="home-compact-title-row">
            <h1 class="home-compact-greeting">${greeting}، ${userName} 👋</h1>
            <span class="home-compact-badge">${isAr ? 'السنة الثالثة — طب وجراحة الفم والأسنان' : '3rd Year — Faculty of Dentistry'}</span>
          </div>
          <p class="home-compact-subline">${isAr ? 'منصة كورو فودز الأكاديمية للدراسة وتصفح الشيتات والمحاضرات' : (t('heroSubline') || 'Academic portal for dental lectures and handouts')}</p>
        </div>
        <div class="home-compact-mascot-wrap">
          <a href="#/rewards" class="home-compact-mascot-pill" title="${mascotName}">
            <img src="${charImg}" alt="${mascotName}" class="home-compact-mascot-img kuro-character-img kuro-float" width="30" height="30" loading="lazy" />
            <span class="home-compact-mascot-name">✨ ${mascotName}</span>
          </a>
        </div>
      </section>
    `;
  },

  /* ══════════════════════════════════════════
     2. CONDENSED LECTURES SCHEDULE (Tab Switcher + Slim Single-Line Rows)
     ══════════════════════════════════════════ */
  switchDailyTab(tab) {
    this.activeDailyTab = tab;
    const todayBtn = document.getElementById('daily-tab-today-btn');
    const tomorrowBtn = document.getElementById('daily-tab-tomorrow-btn');
    const todayPane = document.getElementById('daily-pane-today');
    const tomorrowPane = document.getElementById('daily-pane-tomorrow');
    const dateHint = document.getElementById('hcs-current-date-hint');

    if (!todayBtn || !tomorrowBtn || !todayPane || !tomorrowPane) return;

    if (tab === 'today') {
      todayBtn.classList.add('active');
      todayBtn.setAttribute('aria-selected', 'true');
      tomorrowBtn.classList.remove('active');
      tomorrowBtn.setAttribute('aria-selected', 'false');
      todayPane.style.display = 'flex';
      todayPane.classList.add('active');
      tomorrowPane.style.display = 'none';
      tomorrowPane.classList.remove('active');
      if (dateHint && this._todayFormatted) dateHint.textContent = this._todayFormatted;
    } else {
      tomorrowBtn.classList.add('active');
      tomorrowBtn.setAttribute('aria-selected', 'true');
      todayBtn.classList.remove('active');
      todayBtn.setAttribute('aria-selected', 'false');
      tomorrowPane.style.display = 'flex';
      tomorrowPane.classList.add('active');
      todayPane.style.display = 'none';
      todayPane.classList.remove('active');
      if (dateHint && this._tomorrowFormatted) dateHint.textContent = this._tomorrowFormatted;
    }

    if (window.lucide) window.lucide.createIcons();
  },

  renderDailyLecturesSection(isAr, t) {
    const todayDate = new Date();
    const todayDayIndex = todayDate.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
    const tomorrowDate = new Date(todayDate);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrowDayIndex = tomorrowDate.getDay();

    const todaySchedule = window.DATA && typeof window.DATA.getTheoryScheduleForDay === 'function'
      ? window.DATA.getTheoryScheduleForDay(todayDayIndex)
      : { slots: [], isWeekend: todayDayIndex === 5 };

    const tomorrowSchedule = window.DATA && typeof window.DATA.getTheoryScheduleForDay === 'function'
      ? window.DATA.getTheoryScheduleForDay(tomorrowDayIndex)
      : { slots: [], isWeekend: tomorrowDayIndex === 5 };

    const arMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const enMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const todayDateFormatted = isAr
      ? `${todaySchedule.day_ar || ''}، ${todayDate.getDate()} ${arMonths[todayDate.getMonth()]}`
      : `${todaySchedule.day_en || ''}, ${enMonths[todayDate.getMonth()]} ${todayDate.getDate()}`;

    const tomorrowDateFormatted = isAr
      ? `${tomorrowSchedule.day_ar || ''}، ${tomorrowDate.getDate()} ${arMonths[tomorrowDate.getMonth()]}`
      : `${tomorrowSchedule.day_en || ''}, ${enMonths[tomorrowDate.getMonth()]} ${tomorrowDate.getDate()}`;

    this._todayFormatted = todayDateFormatted;
    this._tomorrowFormatted = tomorrowDateFormatted;

    const nowH = todayDate.getHours();
    const nowM = todayDate.getMinutes();
    const nowTotalMin = nowH * 60 + nowM;

    const getSlotLiveStatus = (slot) => {
      const startMin = (slot.startHour || 8) * 60;
      const endMin = (slot.endHour || 10) * 60;
      if (nowTotalMin >= startMin && nowTotalMin < endMin) {
        return { label: isAr ? 'مباشرة الآن' : 'Live Now', badgeClass: 'live' };
      } else if (nowTotalMin < startMin) {
        return { label: isAr ? 'قادمة' : 'Upcoming', badgeClass: 'upcoming' };
      } else {
        return { label: isAr ? 'انتهت' : 'Done', badgeClass: 'completed' };
      }
    };

    const renderRows = (schedule, isToday) => {
      if (schedule.isWeekend || !schedule.slots || schedule.slots.length === 0) {
        return `
          <div class="compact-lecture-empty">
            <div class="clr-empty-info">
              <i data-lucide="coffee" style="width: 16px; height: 16px; color: var(--text-muted);"></i>
              <span>${isAr ? 'عطلة نهاية الأسبوع — لا توجد محاضرات نظرية مقررة.' : 'Weekend break — No theory lectures scheduled.'}</span>
            </div>
            <a href="#/sheets" class="clr-empty-link">
              <i data-lucide="book-open" style="width: 14px; height: 14px;"></i>
              <span>${isAr ? 'تصفح شيتات المواد' : 'Browse Handouts'}</span>
            </a>
          </div>
        `;
      }

      return schedule.slots.map(slot => {
        const status = isToday ? getSlotLiveStatus(slot) : { label: isAr ? 'مجدولة غداً' : 'Tomorrow', badgeClass: 'upcoming' };
        const dotColor = slot.color || '#0284C7';

        return `
          <div class="compact-lecture-row" data-subject="${slot.subject_id}" role="button" tabindex="0" onclick="window.HomePage.handleSubjectClick('${slot.subject_id}')" title="${isAr ? 'انقر لفتح المادة وشيتاتها' : 'Click to open subject'}">
            <div class="clr-time-col">
              <i data-lucide="clock"></i>
              <span>${slot.time}</span>
            </div>
            <div class="clr-subject-col">
              <span class="clr-subject-dot" style="background-color: ${dotColor};"></span>
              <span class="clr-subject-code">${slot.code}</span>
              <span class="clr-subject-name">${isAr ? slot.subject_ar : slot.subject_en}</span>
            </div>
            <div class="clr-hall-col">
              <i data-lucide="map-pin"></i>
              <span>${isAr ? slot.hall_ar : slot.hall_en}</span>
            </div>
            <div class="clr-status-col">
              <span class="clr-status ${status.badgeClass}">${status.label}</span>
            </div>
            <i data-lucide="${isAr ? 'arrow-left' : 'arrow-right'}" class="clr-arrow"></i>
          </div>
        `;
      }).join('');
    };

    const todaySlotsCount = todaySchedule.slots ? todaySchedule.slots.length : 0;
    const tomorrowSlotsCount = tomorrowSchedule.slots ? tomorrowSchedule.slots.length : 0;
    const activeTab = this.activeDailyTab || 'today';

    return `
      <section class="home-compact-schedule-section">
        <div class="hcs-header">
          <div class="hcs-tabs-segmented" role="tablist">
            <button type="button" class="hcs-tab-btn ${activeTab === 'today' ? 'active' : ''}" id="daily-tab-today-btn" onclick="window.HomePage.switchDailyTab('today')" role="tab" aria-selected="${activeTab === 'today'}">
              <span class="hcs-tab-dot"></span>
              <span>${isAr ? `محاضرات اليوم (${todaySlotsCount})` : `Today (${todaySlotsCount})`}</span>
            </button>
            <button type="button" class="hcs-tab-btn ${activeTab === 'tomorrow' ? 'active' : ''}" id="daily-tab-tomorrow-btn" onclick="window.HomePage.switchDailyTab('tomorrow')" role="tab" aria-selected="${activeTab === 'tomorrow'}">
              <i data-lucide="clock" style="width: 13px; height: 13px;"></i>
              <span>${isAr ? `محاضرات الغد (${tomorrowSlotsCount})` : `Tomorrow (${tomorrowSlotsCount})`}</span>
            </button>
          </div>

          <div class="hcs-date-and-more">
            <span class="hcs-current-date-hint" id="hcs-current-date-hint">${activeTab === 'today' ? todayDateFormatted : tomorrowDateFormatted}</span>
            <a href="#/lecture-schedule" class="hcs-full-schedule-link" title="${isAr ? 'عرض الجدول الأسبوعي الكامل' : 'View Full Timetable'}">
              <i data-lucide="calendar" style="width: 13px; height: 13px;"></i>
              <span>${isAr ? 'الجدول الأسبوعي الكامل' : 'Weekly Schedule'}</span>
              <i data-lucide="${isAr ? 'arrow-left' : 'arrow-right'}" style="width: 12px; height: 12px;"></i>
            </a>
          </div>
        </div>

        <div class="hcs-content-box">
          <div class="hcs-pane ${activeTab === 'today' ? 'active' : ''}" id="daily-pane-today" style="display: ${activeTab === 'today' ? 'flex' : 'none'}; flex-direction: column; gap: 6px;">
            ${renderRows(todaySchedule, true)}
          </div>
          <div class="hcs-pane ${activeTab === 'tomorrow' ? 'active' : ''}" id="daily-pane-tomorrow" style="display: ${activeTab === 'tomorrow' ? 'flex' : 'none'}; flex-direction: column; gap: 6px;">
            ${renderRows(tomorrowSchedule, false)}
          </div>
        </div>
      </section>
    `;
  },

  /* ══════════════════════════════════════════
     3. QUICK ACCESS SECTION
     ══════════════════════════════════════════ */
  renderQuickAccess(isAr, t) {
    const counts = HomePage.getQuickAccessCounts();

    const items = [
      { icon: 'help-circle', title: t('qaQuestionBank'), count: counts.questions + counts.exams, unit: t('qaQuestions'), route: '#/questions', color: 'var(--brand-burgundy)' },
      { icon: 'headphones', img: 'assets/icons/recordings_icon.png', title: isAr ? 'التسجيلات الصوتية' : 'Audio Recordings', count: '', unit: '', route: '#/recordings', color: '#0284C7' },
      { icon: 'calendar',    title: isAr ? 'جدول المحاضرات النظري' : 'Theory Schedule',    count: '',               unit: '',               route: '#/lecture-schedule', color: '#059669' },
      { icon: 'file-check-2', title: isAr ? 'جداول الامتحانات الرسمية' : 'Exam Schedule', count: '', unit: '', route: '#/exams', color: '#D97706' }
    ];

    return `
      <section class="home-quick-access">
        <div class="home-section-header">
          <h2 class="home-section-title">${t('quickAccessTitle')}</h2>
        </div>
        <div class="home-quick-access-grid">
          ${items.map(item => `
            <a href="${item.route}" class="home-qa-card">
              <div class="home-qa-icon" style="color: ${item.color};">
                ${item.img ? `<img src="${item.img}" alt="${item.title}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover; border: 1.5px solid ${item.color};" />` : `<i data-lucide="${item.icon}"></i>`}
              </div>
              <div class="home-qa-meta">
                <span class="home-qa-title">${item.title}</span>
                ${item.count !== '' ? `<span class="home-qa-count">${item.count} ${item.unit}</span>` : ''}
              </div>
              <i data-lucide="${isAr ? 'chevron-left' : 'chevron-right'}" class="home-qa-arrow"></i>
            </a>
          `).join('')}
        </div>
      </section>
    `;
  },

  /* ══════════════════════════════════════════
     4. SUBJECTS SECTION HEADER
     ══════════════════════════════════════════ */
  renderSubjectsSectionHeader(isAr, t, count) {
    return `
      <div class="home-subjects-header" style="margin-top: 14px; margin-bottom: 12px;">
        <div class="home-subjects-header-text">
          <h2 class="home-section-title">${t('yourSubjects')}</h2>
          <span class="home-section-count">${count} ${t('subjectsAvailable')}</span>
        </div>
      </div>
    `;
  },

  /* ══════════════════════════════════════════
     MAIN RENDER
     ══════════════════════════════════════════ */
  render(container) {
    const t = (k) => window.I18N.t(k);
    const isAr = window.I18N.getLang() === 'ar';
    const subjects = window.DATA.getSubjects();

    container.innerHTML = `
      ${HomePage.renderHeroSection(isAr, t)}
      ${HomePage.renderDailyLecturesSection(isAr, t)}
      ${HomePage.renderQuickAccess(isAr, t)}

      <!-- Subjects Section -->
      ${HomePage.renderSubjectsSectionHeader(isAr, t, subjects.length)}
      <div class="subjects-showcase-grid" id="subjects-container"></div>
    `;

    HomePage.renderSubjectsList(subjects, false);
    HomePage.setupListeners();
  },

  renderSkeletons() {
    const grid = document.getElementById('subjects-container');
    if (!grid) return;

    grid.innerHTML = Array(6).fill(0).map(() => `
      <div class="skeleton-compact-tile skeleton-card" style="padding: 14px; border-radius: 12px; background: var(--bg-card); border: 1px solid var(--border-card);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <div class="skeleton-shimmer" style="width: 32px; height: 32px; border-radius: 8px;"></div>
          <div class="skeleton-shimmer" style="width: 48px; height: 16px; border-radius: 6px;"></div>
        </div>
        <div class="skeleton-shimmer" style="width: 75%; height: 15px; margin-bottom: 6px; border-radius: 4px;"></div>
        <div class="skeleton-shimmer" style="width: 45%; height: 11px; margin-bottom: 14px; border-radius: 4px;"></div>
        <div class="skeleton-shimmer" style="width: 50%; height: 18px; border-radius: 9999px;"></div>
      </div>
    `).join('');
  },

  renderSubjectsList(allSubjects, withSkeleton = false) {
    const grid = document.getElementById('subjects-container');
    if (!grid) return;

    if (withSkeleton) {
      HomePage.renderSkeletons();
      if (HomePage.loadingTimeout) clearTimeout(HomePage.loadingTimeout);
      HomePage.loadingTimeout = setTimeout(() => {
        HomePage.buildCardsHTML(allSubjects);
      }, 160);
    } else {
      HomePage.buildCardsHTML(allSubjects);
    }
  },

  /* ══════════════════════════════════════════
     5. COMPACT SUBJECT TILES (Linear / Apple Modern UI Style)
     ══════════════════════════════════════════ */
  buildCardsHTML(allSubjects) {
    const grid = document.getElementById('subjects-container');
    if (!grid) return;

    const isAr = window.I18N.getLang() === 'ar';
    const t = (k) => window.I18N.t(k);

    let filtered = [...allSubjects];

    // Search filtering
    if (HomePage.searchQuery) {
      const q = HomePage.searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        (s.name_ar && s.name_ar.toLowerCase().includes(q)) ||
        (s.name_en && s.name_en.toLowerCase().includes(q)) ||
        (s.code && s.code.toLowerCase().includes(q))
      );
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="home-empty-state" style="grid-column: 1 / -1; padding: 36px 16px; text-align: center;">
          <div class="home-empty-icon" style="font-size: 2rem; margin-bottom: 8px;">🔍</div>
          <h3 class="home-empty-title" style="font-size: 1rem; font-weight: 750; color: var(--text-primary); margin-bottom: 4px;">${t('searchEmptyTitle')}</h3>
          <p class="home-empty-sub" style="font-size: 0.8rem; color: var(--text-muted);">${t('searchEmptySub')}</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(subj => {
      const primaryTitle = isAr ? subj.name_ar : subj.name_en;
      const secondaryTitle = isAr ? subj.name_en : subj.name_ar;

      const theme = SUBJECT_THEMES[subj.id] || DEFAULT_THEME;

      let sheetsCount = 0;
      if (window.DATA && typeof window.DATA.getSheetsBySubject === 'function') {
        sheetsCount = window.DATA.getSheetsBySubject(subj.id).length;
      } else {
        const deleted = window.DATA?.getDeletedSheetIds?.() || [];
        sheetsCount = (window.DATA?.sheets || []).filter(s => s.subject_id === subj.id && !deleted.includes(s.id)).length;
      }

      let countText = '';
      if (isAr) {
        if (sheetsCount === 0) countText = 'لا توجد شيتات';
        else if (sheetsCount === 1) countText = 'شيت واحد';
        else if (sheetsCount === 2) countText = 'شيتان';
        else if (sheetsCount <= 10) countText = `${sheetsCount} شيتات`;
        else countText = `${sheetsCount} شيت`;
      } else {
        countText = `${sheetsCount} ${sheetsCount === 1 ? 'sheet' : 'sheets'}`;
      }

      return `
        <div class="compact-subject-tile subject-card" onclick="window.HomePage.handleSubjectClick('${subj.id}');" role="button" tabindex="0" aria-label="${primaryTitle}">
          <div class="cst-top">
            <div class="cst-icon-badge" style="background-color: ${theme.bg}; color: ${theme.color}; border: 1px solid ${theme.border};">
              <i data-lucide="${theme.icon}"></i>
            </div>
            <span class="cst-code-badge">${subj.code || 'DENT-300'}</span>
          </div>

          <div class="cst-body">
            <h3 class="cst-title-primary" title="${primaryTitle}">${primaryTitle}</h3>
            <div class="cst-title-secondary" title="${secondaryTitle}">${secondaryTitle}</div>
          </div>

          <div class="cst-footer">
            <span class="cst-count-pill">
              <i data-lucide="file-text"></i>
              <span>${countText}</span>
            </span>
            <span class="cst-open-hint">
              <i data-lucide="${isAr ? 'chevron-left' : 'chevron-right'}"></i>
            </span>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  setupListeners() {
    const searchInput = document.getElementById('header-search-input');
    if (searchInput) {
      searchInput.oninput = (e) => {
        HomePage.searchQuery = e.target.value.trim();
        HomePage.renderSubjectsList(window.DATA.getSubjects(), false);
      };
    }
  }
};

window.HomePage = HomePage;
