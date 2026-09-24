/**
 * KURO FANGS — HOME DASHBOARD
 * Modern Academic Study Dashboard (Warm Cream, Deep Burgundy & Botanical Atmosphere)
 * Visual reference: Cozy Academic Study Scene
 */

const SUBJECT_THEMES = {
  'gen-med':        { icon: 'stethoscope', color: '#0D9488', bg: '#E6F4F2', border: 'rgba(13, 148, 136, 0.22)' },
  'gen-surgery':    { icon: 'activity',    color: '#EF4444', bg: '#FDE8E8', border: 'rgba(239, 68, 68, 0.22)' },
  'fixed-pros':     { icon: 'shield',      color: '#D97706', bg: '#FEF3E2', border: 'rgba(217, 119, 6, 0.22)' },
  'omfs':           { icon: 'scissors',    color: '#C84343', bg: '#FCEAEA', border: 'rgba(200, 67, 67, 0.22)' },
  'oral-diseases':  { icon: 'microscope',  color: '#EA580C', bg: '#FEEDDE', border: 'rgba(234, 88, 12, 0.22)' },
  'endo':           { icon: 'zap',         color: '#7C3AED', bg: '#F3E8FF', border: 'rgba(124, 58, 237, 0.22)' },
  'omdr':           { icon: 'scan',        color: '#6366F1', bg: '#EEF0FF', border: 'rgba(99, 102, 241, 0.22)' },
  'preventive':     { icon: 'sparkles',    color: '#0284C7', bg: '#E0F2FE', border: 'rgba(2, 132, 199, 0.22)' },
  'cons-endo':      { icon: 'heart-pulse', color: '#059669', bg: '#E6F7F0', border: 'rgba(5, 150, 105, 0.22)' },
  'ortho':          { icon: 'smile',       color: '#0EA5E9', bg: '#E0F7FF', border: 'rgba(14, 165, 233, 0.22)' },
  'pediatric':      { icon: 'baby',        color: '#A855F7', bg: '#F5E8FF', border: 'rgba(168, 85, 247, 0.22)' },
  'pedo':           { icon: 'baby',        color: '#A855F7', bg: '#F5E8FF', border: 'rgba(168, 85, 247, 0.22)' },
  'removable-pros': { icon: 'layers',      color: '#DB2777', bg: '#FCE7F3', border: 'rgba(219, 39, 119, 0.22)' }
};

const DEFAULT_THEME = {
  icon: 'book-open',
  color: '#7E1D2A',
  bg: '#FDF1F2',
  border: 'rgba(126, 29, 42, 0.20)'
};

/* ─── Instant Hero Banner In-Memory & LocalStorage Engine ─── */
const HERO_BANNER_CONFIG = {
  src: 'assets/hero/kuro-study-hero.jpg',
  storageKey: 'kf_hero_banner_b64'
};

let _cachedHeroDataUrl = null;
try {
  _cachedHeroDataUrl = localStorage.getItem(HERO_BANNER_CONFIG.storageKey);
} catch (e) { /* private mode or disabled storage */ }

// Prime memory & GPU bitmap cache immediately so first paint is 0ms
const _prewarmHero = new Image();
_prewarmHero.src = _cachedHeroDataUrl || HERO_BANNER_CONFIG.src;

// If image is not yet cached in localStorage as base64, fetch in background and persist
if (!_cachedHeroDataUrl && typeof window !== 'undefined' && typeof window.fetch === 'function') {
  setTimeout(() => {
    fetch(HERO_BANNER_CONFIG.src)
      .then(res => {
        if (!res.ok) throw new Error('Hero fetch status ' + res.status);
        return res.blob();
      })
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          try {
            const base64 = reader.result;
            if (base64 && typeof base64 === 'string') {
              localStorage.setItem(HERO_BANNER_CONFIG.storageKey, base64);
              _cachedHeroDataUrl = base64;
            }
          } catch (e) {
            // Storage quota or sandboxed
          }
        };
        reader.readAsDataURL(blob);
      })
      .catch(() => {});
  }, 50);
}

const HomePage = {
  searchQuery: '',
  loadingTimeout: null,
  activeDailyTab: 'today',
  _todayFormatted: '',
  _tomorrowFormatted: '',

  /* ─── Dynamic time-of-day greeting engine ─── */
  getHeroGreetingData(isAr) {
    const now = new Date();
    const h = now.getHours();

    let title = '';
    let subtitle = '';

    if (h >= 5 && h < 12) {
      title = isAr ? 'صباح الخير، طالب كورو 👋' : 'Good Morning, Kuro Student 👋';
      subtitle = isAr ? 'جاهز ليوم دراسي ممتع ومثمر؟' : 'Ready for a productive day?';
    } else if (h >= 12 && h < 17) {
      title = isAr ? 'مساء الخير، طالب كورو 👋' : 'Good Afternoon, Kuro Student 👋';
      subtitle = isAr ? 'واصل التقدّم، أنت تنجز خطوة بخطوة.' : "Keep going, you're making progress.";
    } else if (h >= 17 && h < 21) {
      title = isAr ? 'مساء الخير، طالب كورو 👋' : 'Good Evening, Kuro Student 👋';
      subtitle = isAr ? 'خذ استراحة قصيرة وراجع إنجازات اليوم.' : "Take a moment to review today's progress.";
    } else {
      title = isAr ? 'تصبح على خير، طالب كورو 🌙' : 'Good Night, Kuro Student 🌙';
      subtitle = isAr ? 'خطوة إضافية واحدة قبل أن تختم يومك.' : 'One more step before you call it a day.';
    }

    const daysAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const monthsAr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const dayName = isAr ? daysAr[now.getDay()] : daysEn[now.getDay()];
    const monthName = isAr ? monthsAr[now.getMonth()] : monthsEn[now.getMonth()];
    const dateFormatted = isAr
      ? `${dayName}، ${now.getDate()} ${monthName} ${now.getFullYear()}`
      : `${dayName}, ${now.getDate()} ${monthName} ${now.getFullYear()}`;

    return { title, subtitle, dateFormatted };
  },

  handleSubjectClick(subjectId) {
    try {
      if (window.SubjectModal && typeof window.SubjectModal.open === 'function') {
        window.SubjectModal.open(subjectId);
      } else if (window.ROUTER) {
        window.ROUTER.navigate(`/sheets?subject=${subjectId}`);
      }
    } catch (e) {
      console.error('Error opening subject modal:', e);
      if (window.ROUTER) window.ROUTER.navigate(`/sheets?subject=${subjectId}`);
    }
    setTimeout(() => {
      try {
        HomePage.trackSubjectVisit(subjectId);
      } catch (e) { /* silent */ }
    }, 10);
  },

  /* Track subject visit */
  trackSubjectVisit(subjectId) {
    try {
      let recent = JSON.parse(localStorage.getItem('kf_recent_subjects') || '[]');
      recent = recent.filter(id => id !== subjectId);
      recent.unshift(subjectId);
      recent = recent.slice(0, 6);
      localStorage.setItem('kf_recent_subjects', JSON.stringify(recent));
    } catch { /* silent */ }
  },

  /* Quick Access item counts */
  getQuickAccessCounts() {
    const questions = window.DATA?.questions || [];
    const exams = window.DATA?.previousExams || [];
    return {
      questions: questions.length,
      exams: exams.length
    };
  },

  /* ══════════════════════════════════════════
     1. HERO SECTION (Study Scene with Dynamic Greeting in Left Sunlight Area)
     ══════════════════════════════════════════ */
  renderHeroSection(isAr) {
    const { title, subtitle, dateFormatted } = HomePage.getHeroGreetingData(isAr);
    const heroSrc = _cachedHeroDataUrl || HERO_BANNER_CONFIG.src;

    return `
      <section class="kuro-hero-workspace" aria-label="Hero Study Workspace">
        <div class="kuro-hero-banner">
          <img
            src="${heroSrc}"
            alt="Kuro Cozy Study Scene"
            class="kuro-hero-bg-img"
            width="1280"
            height="560"
            loading="eager"
            decoding="sync"
            fetchpriority="high"
          />
          <div class="kuro-hero-greeting-overlay" dir="${isAr ? 'rtl' : 'ltr'}">
            <h1 class="kuro-hero-greeting-title">${title}</h1>
            <p class="kuro-hero-greeting-sub">${subtitle}</p>
            <div class="kuro-hero-date-chip">
              <i data-lucide="calendar" class="kuro-hero-date-icon"></i>
              <span>${dateFormatted}</span>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  /* ══════════════════════════════════════════
     2. TODAY'S SCHEDULE (Tab Switcher + Horizontal Rows)
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
      if (dateHint && this._todayFormatted) {
        dateHint.innerHTML = `<i data-lucide="calendar"></i><span>${this._todayFormatted}</span>`;
      }
    } else {
      tomorrowBtn.classList.add('active');
      tomorrowBtn.setAttribute('aria-selected', 'true');
      todayBtn.classList.remove('active');
      todayBtn.setAttribute('aria-selected', 'false');
      tomorrowPane.style.display = 'flex';
      tomorrowPane.classList.add('active');
      todayPane.style.display = 'none';
      todayPane.classList.remove('active');
      if (dateHint && this._tomorrowFormatted) {
        dateHint.innerHTML = `<i data-lucide="calendar"></i><span>${this._tomorrowFormatted}</span>`;
      }
    }

    if (window.lucide) window.lucide.createIcons();
  },

  renderDailyLecturesSection(isAr) {
    const todayDate = new Date();
    const todayDayIndex = todayDate.getDay();
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
          <div class="kuro-lecture-empty">
            <i data-lucide="coffee"></i>
            <span>${isAr ? 'عطلة نهاية الأسبوع — لا توجد محاضرات نظرية مقررة.' : 'Weekend break — No theory lectures scheduled.'}</span>
            <a href="#/sheets" class="kuro-empty-link">
              <i data-lucide="book-open"></i>
              <span>${isAr ? 'تصفح شيتات المواد' : 'Browse Handouts'}</span>
            </a>
          </div>
        `;
      }

      return schedule.slots.map(slot => {
        const status = isToday ? getSlotLiveStatus(slot) : { label: isAr ? 'مجدولة غداً' : 'Tomorrow', badgeClass: 'upcoming' };
        const dotColor = slot.color || '#C84343';

        return `
          <div class="kuro-lecture-row" data-subject="${slot.subject_id}" role="button" tabindex="0" onclick="window.HomePage.handleSubjectClick('${slot.subject_id}')" title="${isAr ? 'انقر لفتح المادة وشيتاتها' : 'Click to open subject'}">
            <div class="klr-time-col">
              <i data-lucide="clock"></i>
              <span>${slot.time}</span>
            </div>
            <div class="klr-subject-col">
              <span class="klr-dot" style="background-color: ${dotColor};"></span>
              <span class="klr-code-badge">${slot.code}</span>
              <span class="klr-title">${isAr ? slot.subject_ar : slot.subject_en}</span>
            </div>
            <div class="klr-hall-col">
              <i data-lucide="map-pin"></i>
              <span>${isAr ? slot.hall_ar : slot.hall_en}</span>
            </div>
            <div class="klr-status-col">
              <span class="klr-status-pill ${status.badgeClass}">${status.label}</span>
            </div>
            <div class="klr-arrow-col">
              <i data-lucide="${isAr ? 'chevron-left' : 'chevron-right'}"></i>
            </div>
          </div>
        `;
      }).join('');
    };

    const todaySlotsCount = todaySchedule.slots ? todaySchedule.slots.length : 0;
    const tomorrowSlotsCount = tomorrowSchedule.slots ? tomorrowSchedule.slots.length : 0;
    const activeTab = this.activeDailyTab || 'today';

    return `
      <section class="kuro-schedule-section" aria-label="Today's Timetable">
        <div class="kuro-schedule-controls-bar">
          <div class="kuro-tabs-segmented" role="tablist">
            <button type="button" class="kuro-tab-pill ${activeTab === 'today' ? 'active' : ''}" id="daily-tab-today-btn" onclick="window.HomePage.switchDailyTab('today')" role="tab" aria-selected="${activeTab === 'today'}">
              <span class="kuro-tab-dot"></span>
              <span>${isAr ? `محاضرات اليوم (${todaySlotsCount})` : `Today (${todaySlotsCount})`}</span>
            </button>
            <button type="button" class="kuro-tab-pill ${activeTab === 'tomorrow' ? 'active' : ''}" id="daily-tab-tomorrow-btn" onclick="window.HomePage.switchDailyTab('tomorrow')" role="tab" aria-selected="${activeTab === 'tomorrow'}">
              <i data-lucide="clock"></i>
              <span>${isAr ? `محاضرات الغد (${tomorrowSlotsCount})` : `Tomorrow (${tomorrowSlotsCount})`}</span>
            </button>
          </div>

          <div class="kuro-schedule-right-group">
            <span class="kuro-schedule-date-hint" id="hcs-current-date-hint">
              <i data-lucide="calendar"></i>
              <span>${activeTab === 'today' ? todayDateFormatted : tomorrowDateFormatted}</span>
            </span>
            <a href="#/schedules" class="kuro-weekly-schedule-btn" title="${isAr ? 'عرض الجداول الدراسية الموحدة' : 'View Academic Schedules'}">
              <span>${isAr ? 'الجداول الدراسية' : 'All Schedules'}</span>
              <i data-lucide="${isAr ? 'arrow-left' : 'arrow-right'}"></i>
            </a>
          </div>
        </div>

        <div class="kuro-schedule-card">
          <div class="kuro-schedule-pane ${activeTab === 'today' ? 'active' : ''}" id="daily-pane-today" style="display: ${activeTab === 'today' ? 'flex' : 'none'};">
            ${renderRows(todaySchedule, true)}
          </div>
          <div class="kuro-schedule-pane ${activeTab === 'tomorrow' ? 'active' : ''}" id="daily-pane-tomorrow" style="display: ${activeTab === 'tomorrow' ? 'flex' : 'none'};">
            ${renderRows(tomorrowSchedule, false)}
          </div>
        </div>
      </section>
    `;
  },

  /* ══════════════════════════════════════════
     3. QUICK ACCESS SECTION (4 Tiles with Leaf Watermark)
     ══════════════════════════════════════════ */
  renderQuickAccess(isAr) {
    const counts = HomePage.getQuickAccessCounts();

    const items = [
      {
        icon: 'help-circle',
        title: isAr ? 'بنك الأسئلة' : 'Question Bank',
        subtitle: isAr ? `${counts.questions + counts.exams} سؤالاً متوفراً` : `${counts.questions + counts.exams} questions`,
        route: '#/questions'
      },
      {
        icon: 'mic',
        title: isAr ? 'التسجيلات الصوتية' : 'Audio Recordings',
        subtitle: isAr ? 'محاضرات وتفريغات صوتية' : 'Lectures & revisions',
        route: '#/recordings'
      },
      {
        icon: 'calendar',
        title: isAr ? 'الجداول الدراسية' : 'Academic Schedules',
        subtitle: isAr ? 'مدرج 2 والمعامل A1-E2' : 'Auditorium 2 & Labs',
        route: '#/schedules'
      },
      {
        icon: 'calendar-check',
        title: isAr ? 'جداول الامتحانات' : 'Exam Schedules',
        subtitle: isAr ? 'النصفي والنهائي المعتمد' : 'Midterm & Final boards',
        route: '#/exams'
      }
    ];

    return `
      <section class="kuro-qa-section" aria-label="Quick Access">
        <div class="kuro-section-header">
          <div class="kuro-section-title-wrap">
            <span class="kuro-section-emblem"><i data-lucide="graduation-cap"></i></span>
            <h2 class="kuro-section-title">${isAr ? 'الوصول السريع' : 'Quick Access'}</h2>
          </div>
          <a href="#/sheets" class="kuro-view-all-link">
            <span>${isAr ? 'عرض الكل' : 'View All'}</span>
            <i data-lucide="${isAr ? 'arrow-left' : 'arrow-right'}"></i>
          </a>
        </div>

        <div class="kuro-qa-grid">
          ${items.map(item => `
            <a href="${item.route}" class="kuro-qa-tile" title="${item.title}">
              <div class="kuro-card-leaf-watermark"></div>
              <div class="kuro-qa-icon-box">
                <i data-lucide="${item.icon}"></i>
              </div>
              <div class="kuro-qa-content">
                <h3 class="kuro-qa-title">${item.title}</h3>
                <p class="kuro-qa-subtitle">${item.subtitle}</p>
              </div>
              <i data-lucide="${isAr ? 'chevron-left' : 'chevron-right'}" class="kuro-qa-arrow"></i>
            </a>
          `).join('')}
        </div>
      </section>
    `;
  },

  /* ══════════════════════════════════════════
     4. YOUR SUBJECTS SECTION HEADER & FILTER
     ══════════════════════════════════════════ */
  renderSubjectsSectionHeader(isAr, count) {
    return `
      <div class="kuro-section-header kuro-subjects-section-header">
        <div class="kuro-section-title-wrap">
          <span class="kuro-section-emblem"><i data-lucide="book-open"></i></span>
          <h2 class="kuro-section-title">${isAr ? 'المواد الدراسية' : 'Your Subjects'}</h2>
          <span class="kuro-section-count">${count} ${isAr ? 'مواد متاحة' : 'subjects available'}</span>
        </div>

        <div class="kuro-subjects-controls">
          <div class="kuro-subjects-search-box">
            <i data-lucide="search" class="kuro-search-icon"></i>
            <input
              type="text"
              id="subjects-grid-search-input"
              placeholder="${isAr ? 'ابحث في المواد...' : 'Search subjects...'}"
              value="${HomePage.searchQuery || ''}"
              autocomplete="off"
            />
          </div>

          <button class="kuro-filter-pill" id="subjects-filter-btn" type="button" title="${isAr ? 'تصفية حسب السنة' : 'Filter by year'}">
            <i data-lucide="sliders-horizontal"></i>
            <span>${isAr ? 'كل السنوات' : 'All Years'}</span>
            <i data-lucide="chevron-down" style="width: 14px; height: 14px; opacity: 0.7;"></i>
          </button>
        </div>
      </div>
    `;
  },

  /* ══════════════════════════════════════════
     5. MAIN RENDER
     ══════════════════════════════════════════ */
  render(container) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
    const subjects = window.DATA ? window.DATA.getSubjects() : [];

    container.innerHTML = `
      <div class="kuro-dashboard-container">
        <!-- 1. Hero Study Scene Banner with Dynamic Greeting -->
        ${HomePage.renderHeroSection(isAr)}

        <!-- 2. Today's Lectures Schedule -->
        ${HomePage.renderDailyLecturesSection(isAr)}

        <!-- 3. Quick Access 4 Tiles -->
        ${HomePage.renderQuickAccess(isAr)}

        <!-- 4. Your Subjects Section -->
        ${HomePage.renderSubjectsSectionHeader(isAr, subjects.length)}
        <div class="kuro-subjects-grid" id="subjects-container"></div>
      </div>
    `;

    HomePage.renderSubjectsList(subjects, false);
    HomePage.setupListeners();
  },

  renderSkeletons() {
    const grid = document.getElementById('subjects-container');
    if (!grid) return;

    grid.innerHTML = Array(6).fill(0).map(() => `
      <div class="kuro-subject-card skeleton-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <div class="skeleton-shimmer" style="width: 44px; height: 44px; border-radius: 12px;"></div>
          <div class="skeleton-shimmer" style="width: 58px; height: 22px; border-radius: 9999px;"></div>
        </div>
        <div class="skeleton-shimmer" style="width: 80%; height: 18px; margin-bottom: 8px; border-radius: 4px;"></div>
        <div class="skeleton-shimmer" style="width: 50%; height: 14px; margin-bottom: 20px; border-radius: 4px;"></div>
        <div class="skeleton-shimmer" style="width: 40%; height: 18px; border-radius: 9999px;"></div>
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
      }, 140);
    } else {
      HomePage.buildCardsHTML(allSubjects);
    }
  },

  /* ══════════════════════════════════════════
     6. 3-COLUMN SUBJECT TILES (With Leaf Watermark & Pastel Badges)
     ══════════════════════════════════════════ */
  getSubjectIconHtml(subjId) {
    const icons = {
      'gen-med': 'stethoscope',
      'gen-surgery': 'activity',
      'oral-diseases': 'microscope',
      'preventive': 'shield-check',
      'cons-endo': 'tooth',
      'fixed-pros': 'crown',
      'removable-pros': 'layers',
      'ortho': 'smile',
      'pediatric': 'heart',
      'pedo': 'heart',
      'omdr': 'scan',
      'omfs': 'scissors',
      'endo': 'activity'
    };
    const icon = icons[subjId] || 'book-open';
    if (icon === 'tooth') {
      return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ksc-icon-svg">
        <path d="M12 2C7.5 2 4 4.5 4 8c0 3 1.5 6 3 9 1 2 2 5 3 5s2-3 2-5c0-1.5.5-2 0-3-.5-1-1-1.5-1-2.5 0-1.5 1-2.5 1-2.5s1 1 1 2.5c0 1-.5 1.5-1 2.5-.5 1 0 1.5 0 3 0 2 1 5 2 5s2-3 3-5c1.5-3 3-6 3-9 0-3.5-3.5-6-8-6z" />
      </svg>`;
    }
    return `<i data-lucide="${icon}" class="ksc-icon-svg"></i>`;
  },

  buildCardsHTML(allSubjects) {
    const grid = document.getElementById('subjects-container');
    if (!grid) return;

    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;

    let filtered = [...allSubjects];

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
        <div class="kuro-empty-state" style="grid-column: 1 / -1; padding: 48px 16px; text-align: center;">
          <div style="font-size: 2.2rem; margin-bottom: 10px;">🔍</div>
          <h3 style="font-size: 1.05rem; font-weight: 750; color: #24181B; margin-bottom: 6px;">
            ${isAr ? 'لم نتمكن من العثور على أي مادة' : 'No subjects found'}
          </h3>
          <p style="font-size: 0.85rem; color: #756966;">
            ${isAr ? 'جرب البحث بكلمات أخرى أو تحقق من كتابة الاسم' : 'Try searching with different keywords'}
          </p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(subj => {
      const primaryTitle = isAr ? subj.name_ar : subj.name_en;

      let sheetsCount = 0;
      if (window.DATA && typeof window.DATA.getSheetsBySubject === 'function') {
        sheetsCount = window.DATA.getSheetsBySubject(subj.id).length;
      } else {
        const deleted = window.DATA?.getDeletedSheetIds?.() || [];
        sheetsCount = (window.DATA?.sheets || []).filter(s => s.subject_id === subj.id && !deleted.includes(s.id)).length;
      }

      let countText = '';
      if (isAr) {
        if (sheetsCount === 0) countText = '0 شيت';
        else if (sheetsCount === 1) countText = 'شيت واحد';
        else if (sheetsCount === 2) countText = '2 شيت';
        else countText = `${sheetsCount} شيتات`;
      } else {
        countText = `${sheetsCount} ${sheetsCount === 1 ? 'sheet' : 'sheets'}`;
      }

      return `
        <div
          class="kuro-subject-card"
          data-subject-id="${subj.id}"
          onclick="window.HomePage.handleSubjectClick('${subj.id}');"
          onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.HomePage.handleSubjectClick('${subj.id}');}"
          role="button"
          tabindex="0"
          aria-label="${primaryTitle}"
        >
          <!-- Left Icon Box with rounded red outline -->
          <div class="ksc-icon-wrap">
            ${HomePage.getSubjectIconHtml(subj.id)}
          </div>

          <!-- Center: Subject Name, Code & Count -->
          <div class="ksc-info-col">
            <h3 class="ksc-title" title="${primaryTitle}">${primaryTitle}</h3>
            <span class="ksc-code">${subj.code || 'DENT-300'}</span>
            <span class="ksc-count">${countText}</span>
          </div>

          <!-- Right: Chevron indicator -->
          <div class="ksc-arrow-wrap">
            <i data-lucide="${isAr ? 'chevron-left' : 'chevron-right'}"></i>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  setupListeners() {
    // Grid search input
    const gridSearch = document.getElementById('subjects-grid-search-input');
    if (gridSearch) {
      gridSearch.oninput = (e) => {
        HomePage.searchQuery = e.target.value.trim();
        HomePage.renderSubjectsList(window.DATA.getSubjects(), false);
      };
    }

    // Top navbar search input sync
    const topSearch = document.getElementById('header-search-input');
    if (topSearch) {
      topSearch.oninput = (e) => {
        HomePage.searchQuery = e.target.value.trim();
        if (gridSearch) gridSearch.value = HomePage.searchQuery;
        HomePage.renderSubjectsList(window.DATA.getSubjects(), false);
      };
    }
  }
};

window.HomePage = HomePage;
