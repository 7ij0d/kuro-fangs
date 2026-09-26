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

    const shortDaysAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const shortMonthsAr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const shortDaysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const shortMonthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dayName = isAr ? daysAr[now.getDay()] : daysEn[now.getDay()];
    const monthName = isAr ? monthsAr[now.getMonth()] : monthsEn[now.getMonth()];
    const dateFormatted = isAr
      ? `${dayName}، ${now.getDate()} ${monthName} ${now.getFullYear()}`
      : `${dayName}, ${now.getDate()} ${monthName} ${now.getFullYear()}`;

    const shortDayName = isAr ? shortDaysAr[now.getDay()] : shortDaysEn[now.getDay()];
    const shortMonthName = isAr ? shortMonthsAr[now.getMonth()] : shortMonthsEn[now.getMonth()];
    const shortDateFormatted = isAr
      ? `${shortDayName}، ${now.getDate()} ${shortMonthName}`
      : `${shortDayName}, ${now.getDate()} ${shortMonthName} ${now.getFullYear()}`;

    return { title, subtitle, dateFormatted, shortDateFormatted };
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
    return { questions: 0, exams: 0 };
  },

  /* ══════════════════════════════════════════
     1. HERO SECTION (Study Scene with Dynamic Greeting in Left Sunlight Area)
     ══════════════════════════════════════════ */
  renderHeroSection(isAr) {
    const { title, subtitle, dateFormatted, shortDateFormatted } = HomePage.getHeroGreetingData(isAr);
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
          <div class="kuro-hero-vignette"></div>
          <div class="kuro-hero-greeting-overlay" dir="${isAr ? 'rtl' : 'ltr'}">
            <h1 class="kuro-hero-greeting-title">${title}</h1>
            <p class="kuro-hero-greeting-sub">${subtitle}</p>
            <div class="kuro-hero-date-chip">
              <i data-lucide="calendar" class="kuro-hero-date-icon"></i>
              <span class="kuro-hero-date-full">${dateFormatted}</span>
              <span class="kuro-hero-date-short">${shortDateFormatted}</span>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  /* ══════════════════════════════════════════
     STUDY ACTIVITY TRACKING (Real Database & LocalStorage)
     ══════════════════════════════════════════ */
  getLastOpenedSheet() {
    try {
      const raw = localStorage.getItem('kf_last_opened_sheet');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.id) return null;
      const deletedIds = (window.DATA && typeof window.DATA.getDeletedSheetIds === 'function')
        ? window.DATA.getDeletedSheetIds()
        : [];
      if (deletedIds.includes(parsed.id)) return null;
      return parsed;
    } catch {
      return null;
    }
  },

  getLastListenedAudio() {
    try {
      const raw = localStorage.getItem('kf_last_listened_audio');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.id) return null;
      if (parsed.sheet_id) {
        const deletedIds = (window.DATA && typeof window.DATA.getDeletedSheetIds === 'function')
          ? window.DATA.getDeletedSheetIds()
          : [];
        if (deletedIds.includes(parsed.sheet_id)) return null;
      }
      return parsed;
    } catch {
      return null;
    }
  },

  getActiveQuestionSession() {
    try {
      // 1. Check all sessions list first to find the most relevant active/incomplete session
      const allRaw = localStorage.getItem('kf_all_question_sessions');
      let allSessions = [];
      if (allRaw) {
        try {
          const parsed = JSON.parse(allRaw);
          if (Array.isArray(parsed)) allSessions = parsed;
        } catch (e) {}
      }

      // Look for the most recent incomplete session with progress (answered > 0)
      let active = allSessions.find(s =>
        s && s.total > 0 && !s.completed &&
        (s.answered > 0 || (s.answers && Object.keys(s.answers).length > 0))
      );

      // If no active incomplete session found in allSessions, check kf_active_question_session
      if (!active) {
        const raw = localStorage.getItem('kf_active_question_session');
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (parsed && parsed.total > 0) {
              active = parsed;
            }
          } catch (e) {}
        }
      }

      // If still no incomplete session with progress, fallback to the latest completed session
      if ((!active || active.completed) && allSessions.length > 0) {
        const completedSession = allSessions.find(s => s && (s.completed || s.answered >= s.total));
        if (completedSession) {
          active = completedSession;
        } else if (allSessions[0] && allSessions[0].total > 0) {
          active = allSessions[0];
        }
      }

      if (!active || !active.total) return null;

      // Ensure subject_id is populated
      if (!active.subject_id && active.sheet_id) {
        if (window.DATA && typeof window.DATA.getSheets === 'function') {
          const sheet = window.DATA.getSheets().find(s => s.id === active.sheet_id);
          if (sheet) active.subject_id = sheet.subject_id;
        }
        if (!active.subject_id && typeof active.sheet_id === 'string' && active.sheet_id.includes('omdr')) {
          active.subject_id = 'omdr';
        }
      }

      // Recalculate answered count from answers object if available
      if (active.answers && typeof active.answers === 'object') {
        const count = Object.keys(active.answers).length;
        if (count > (active.answered || 0)) {
          active.answered = count;
          active.percent = Math.round((active.answered / active.total) * 100);
        }
      }

      // Mark completed if answered >= total
      if (active.answered >= active.total) {
        active.completed = true;
      }

      return active;
    } catch {
      return null;
    }
  },

  formatRelativeTime(timestamp, isAr) {
    if (!timestamp) return '—';
    const d = new Date(timestamp);
    if (isNaN(d.getTime())) return '—';

    const now = new Date();
    const isToday = now.toDateString() === d.toDateString();

    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = isAr
      ? (hours >= 12 ? 'م' : 'ص')
      : (hours >= 12 ? 'PM' : 'AM');
    hours = hours % 12;
    hours = hours ? hours : 12;
    const timeStr = `${hours}:${minutes} ${ampm}`;

    if (isToday) {
      return isAr ? `اليوم، ${timeStr}` : `Today, ${timeStr}`;
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = yesterday.toDateString() === d.toDateString();
    if (isYesterday) {
      return isAr ? `أمس، ${timeStr}` : `Yesterday, ${timeStr}`;
    }

    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > 0 && diffDays < 7) {
      return isAr ? `منذ ${diffDays} ${diffDays === 2 ? 'يومين' : 'أيام'}` : `${diffDays} days ago`;
    }

    const arMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const enMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return isAr
      ? `${d.getDate()} ${arMonths[d.getMonth()]}`
      : `${enMonths[d.getMonth()]} ${d.getDate()}`;
  },

  /* Legacy tab switcher preserved for compatibility */
  switchDailyTab(tab) {
    this.activeDailyTab = tab;
  },

  /* ══════════════════════════════════════════
     2. TODAY & TOMORROW SCHEDULE (Split 2-Column Cards)
     ══════════════════════════════════════════ */
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
    const daysAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const todayDayName = isAr ? daysAr[todayDayIndex] : daysEn[todayDayIndex];
    const tomorrowDayName = isAr ? daysAr[tomorrowDayIndex] : daysEn[tomorrowDayIndex];

    const todayDateFormatted = isAr
      ? `${todayDayName}، ${todayDate.getDate()} ${arMonths[todayDate.getMonth()]}`
      : `${todayDayName}, ${enMonths[todayDate.getMonth()]} ${todayDate.getDate()}`;

    const tomorrowDateFormatted = isAr
      ? `${tomorrowDayName}، ${tomorrowDate.getDate()} ${arMonths[tomorrowDate.getMonth()]}`
      : `${tomorrowDayName}, ${enMonths[tomorrowDate.getMonth()]} ${tomorrowDate.getDate()}`;

    const todaySlots = (todaySchedule && Array.isArray(todaySchedule.slots)) ? todaySchedule.slots : [];
    const tomorrowSlots = (tomorrowSchedule && Array.isArray(tomorrowSchedule.slots)) ? tomorrowSchedule.slots : [];

    const renderCardBody = (slots, isToday) => {
      if (!slots || slots.length === 0) {
        return `
          <div class="kuro-empty-day-state">
            <span class="keds-icon">☕</span>
            <h4 class="keds-title">${isAr ? (isToday ? 'لا توجد محاضرات اليوم' : 'لا توجد محاضرات غداً') : (isToday ? 'No classes today' : 'No classes tomorrow')}</h4>
            <p class="keds-desc">${isAr ? 'استغل هذا الوقت للدراسة ومراجعة الدروس!' : 'Take this time to study or catch up!'}</p>
          </div>
        `;
      }

      return `
        <div class="kuro-mini-lecture-list">
          ${slots.map(slot => `
            <div
              class="kuro-schedule-row-card"
              role="button"
              tabindex="0"
              onclick="window.HomePage.handleSubjectClick('${slot.subject_id}')"
              onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.HomePage.handleSubjectClick('${slot.subject_id}');}"
              title="${isAr ? 'انقر لفتح المادة وشيتاتها' : 'Click to open subject'}"
            >
              <div class="ksrc-accent-bar" style="background-color: ${slot.color || '#7E1D2A'};"></div>
              <div class="ksrc-content">
                <div class="ksrc-top">
                  <span class="ksrc-time">${slot.time}</span>
                  <span class="ksrc-location">
                    <i data-lucide="map-pin"></i>
                    <span>${isAr ? slot.hall_ar : slot.hall_en}</span>
                  </span>
                </div>
                <div class="ksrc-subject">${isAr ? slot.subject_ar : slot.subject_en}</div>
              </div>
              <div class="ksrc-arrow">
                <i data-lucide="${isAr ? 'chevron-left' : 'chevron-right'}"></i>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    };

    return `
      <section class="kuro-schedule-split-section" aria-label="Today and Tomorrow Schedule">
        <div class="kuro-schedule-split-grid">
          <!-- 1. Today Card -->
          <div class="kuro-split-card" id="kuro-card-today">
            <div class="kuro-split-card-header">
              <div class="kuro-split-card-title-group">
                <h3 class="kuro-split-card-title">${isAr ? `محاضرات اليوم (${todaySlots.length})` : `Today (${todaySlots.length})`}</h3>
                <span class="kuro-split-card-date">${todayDateFormatted}</span>
              </div>
            </div>
            <div class="kuro-split-card-body">
              ${renderCardBody(todaySlots, true)}
            </div>
          </div>

          <!-- 2. Tomorrow Card -->
          <div class="kuro-split-card" id="kuro-card-tomorrow">
            <div class="kuro-split-card-header">
              <div class="kuro-split-card-title-group">
                <h3 class="kuro-split-card-title">${isAr ? `محاضرات الغد (${tomorrowSlots.length})` : `Tomorrow (${tomorrowSlots.length})`}</h3>
                <span class="kuro-split-card-date">${tomorrowDateFormatted}</span>
              </div>
              <a href="#/schedules" class="kuro-view-full-schedule-btn" title="${isAr ? 'عرض جدول المحاضرات كاملاً' : 'View Full Academic Schedule'}">
                <span>${isAr ? 'عرض الجدول كاملاً' : 'View Full Schedule'}</span>
                <i data-lucide="${isAr ? 'arrow-left' : 'arrow-right'}"></i>
              </a>
            </div>
            <div class="kuro-split-card-body">
              ${renderCardBody(tomorrowSlots, false)}
            </div>
          </div>
        </div>
      </section>
    `;
  },

  /* ══════════════════════════════════════════
     3. CONTINUE STUDYING (3 Core Activity Cards)
     ══════════════════════════════════════════ */
  renderContinueStudyingSection(isAr) {
    // 1. Last Opened Sheet
    const sheetData = HomePage.getLastOpenedSheet();
    const hasSheet = Boolean(sheetData && sheetData.id);
    const sheetTitle = hasSheet
      ? (isAr ? (sheetData.title_ar || sheetData.title) : (sheetData.title_en || sheetData.title))
      : (isAr ? 'لم تفتح أي شيت بعد' : 'No sheets opened yet');

    let resolvedSheetSubj = '';
    const sheetSubjId = sheetData && (sheetData.subject_id || sheetData.subjectId);
    if (sheetSubjId && window.DATA && typeof window.DATA.getSubjects === 'function') {
      try {
        const subjs = window.DATA.getSubjects();
        const found = subjs.find(s => String(s.id) === String(sheetSubjId) || String(s.code) === String(sheetSubjId));
        if (found) {
          resolvedSheetSubj = isAr ? (found.name_ar || found.name) : (found.name_en || found.name);
        }
      } catch (e) {}
    }
    const rawSheetSub = hasSheet
      ? (isAr ? (sheetData.subject_name_ar || sheetData.subject_name) : (sheetData.subject_name_en || sheetData.subject_name))
      : '';
    const sheetSub = (rawSheetSub && rawSheetSub !== 'undefined')
      ? rawSheetSub
      : (resolvedSheetSubj || (hasSheet ? (isAr ? 'المواد الأكاديمية — طب الأسنان' : 'Academic Dental Lectures') : (isAr ? 'ابدأ دراسة محاضراتك الأكاديمية' : 'Start studying your dental lectures')));

    const sheetTimestamp = sheetData ? (sheetData.timestamp || sheetData.openedAt) : null;
    const sheetMeta = (hasSheet && sheetTimestamp)
      ? `${isAr ? 'آخر فتح:' : 'Last opened:'} ${HomePage.formatRelativeTime(sheetTimestamp, isAr)}`
      : (hasSheet ? (isAr ? 'آخر فتح: اليوم' : 'Last opened: Today') : '—');
    const sheetUrl = hasSheet ? `#/sheet-detail?id=${sheetData.id}` : '#/sheets';
    const sheetBtnText = hasSheet
      ? (isAr ? 'متابعة الدراسة' : 'Continue Studying')
      : (isAr ? 'تصفح الشيتات' : 'Browse Sheets');

    // 2. Last Listened Recording
    const audioData = HomePage.getLastListenedAudio();
    const hasAudio = Boolean(audioData && audioData.id);
    const audioTitle = hasAudio
      ? (isAr ? (audioData.title_ar || audioData.title) : (audioData.title_en || audioData.title))
      : (isAr ? 'لا توجد تسجيلات بعد' : 'No recordings played yet');

    let resolvedAudioSubj = '';
    const audioSubjId = audioData && (audioData.subject_id || audioData.subjectId);
    if (audioSubjId && window.DATA && typeof window.DATA.getSubjects === 'function') {
      try {
        const subjs = window.DATA.getSubjects();
        const found = subjs.find(s => String(s.id) === String(audioSubjId) || String(s.code) === String(audioSubjId));
        if (found) {
          resolvedAudioSubj = isAr ? (found.name_ar || found.name) : (found.name_en || found.name);
        }
      } catch (e) {}
    }
    const rawAudioSub = hasAudio
      ? (isAr ? (audioData.subject_name_ar || audioData.subject_name) : (audioData.subject_name_en || audioData.subject_name))
      : '';
    const audioSub = (rawAudioSub && rawAudioSub !== 'undefined')
      ? rawAudioSub
      : (resolvedAudioSubj || (hasAudio ? (isAr ? 'تسجيلات المحاضرات الأكاديمية' : 'Academic Audio Lectures') : (isAr ? 'استمع للتسجيلات الصوتية لشيتاتك' : 'Listen to audio lectures synced with sheets')));

    const audioTimestamp = audioData ? (audioData.timestamp || audioData.listenedAt || audioData.openedAt) : null;
    const audioMeta = (hasAudio && audioTimestamp)
      ? `${isAr ? 'آخر استماع:' : 'Last listened:'} ${HomePage.formatRelativeTime(audioTimestamp, isAr)}`
      : (hasAudio ? (isAr ? 'آخر استماع: مؤخراً' : 'Last listened: Recently') : '—');
    const audioUrl = '#/recordings';
    const audioBtnText = hasAudio
      ? (isAr ? 'متابعة الاستماع' : 'Continue Listening')
      : (isAr ? 'تصفح التسجيلات' : 'Browse Recordings');

    // 3. Continue Questions
    const qData = HomePage.getActiveQuestionSession();
    const hasQ = Boolean(qData && qData.total > 0);
    const isCompleted = Boolean(hasQ && (qData.completed || qData.answered >= qData.total));
    const qTitle = hasQ
      ? (isAr ? (qData.sheet_title_ar || qData.sheet_title) : (qData.sheet_title_en || qData.sheet_title))
      : (isAr ? 'لا توجد جلسة أسئلة نشطة' : 'No active question session');
    const rawQSub = hasQ ? qData.subject_title : '';
    const qSub = (rawQSub && rawQSub !== 'undefined')
      ? rawQSub
      : (hasQ ? (isAr ? 'بنك الأسئلة الأكاديمي' : 'Question Bank') : (isAr ? 'اختبر معلوماتك مع بنك الأسئلة' : 'Practice questions and test your readiness'));
    const qAnswered = hasQ ? (qData.answered || (qData.answers ? Object.keys(qData.answers).length : 0)) : 0;
    const qTotal = hasQ ? qData.total : 0;
    const qPercent = hasQ ? (qData.percent || Math.round((qAnswered / qTotal) * 100)) : 0;

    // Deep link directly to resume quiz
    let qUrl = '#/questions';
    if (hasQ && qData.sheet_id) {
      const subjParam = qData.subject_id ? `subject=${encodeURIComponent(qData.subject_id)}&` : '';
      qUrl = `#/questions?${subjParam}sheet=${encodeURIComponent(qData.sheet_id)}&resume=true`;
    }

    let qBadgeText = isAr ? 'متابعة الأسئلة' : 'Continue Questions';
    let qBtnText = isAr ? 'بدء حل الأسئلة' : 'Practice Questions';
    if (hasQ) {
      if (isCompleted) {
        qBadgeText = isAr ? 'تم إنهاء الاختبار' : 'Quiz Completed';
        qBtnText = isAr ? 'مراجعة الأسئلة' : 'Review Questions';
      } else {
        qBtnText = isAr ? 'متابعة الحل' : 'Continue Solving';
      }
    }

    return `
      <section class="continue-studying-section" aria-label="Continue Studying">
        <div class="continue-studying-header">
          <h2 class="kuro-section-title">
            <i data-lucide="book-open"></i>
            <span>${isAr ? 'متابعة الدراسة' : 'Continue Studying'}</span>
          </h2>
        </div>

        <div class="kuro-continue-studying-grid">
          <!-- Card A: Last Opened Sheet -->
          <div class="continue-study-card" id="continue-card-sheet" role="region" aria-label="${sheetTitle}">
            <div class="continue-card-top">
              <span class="continue-tag-badge sheet">
                <i data-lucide="file-text"></i>
                <span>${isAr ? 'آخر شيت تم فتحه' : 'Last Opened Sheet'}</span>
              </span>
              <h3 class="continue-card-title" title="${sheetTitle}">${sheetTitle}</h3>
              <p class="continue-card-subject" title="${sheetSub}">${sheetSub}</p>
              <span class="continue-card-meta">${sheetMeta}</span>
            </div>
            <div class="continue-card-bottom">
              <a href="${sheetUrl}" class="continue-action-btn ${hasSheet ? '' : 'secondary'}">
                <span>${sheetBtnText}</span>
                <i data-lucide="${isAr ? 'arrow-left' : 'arrow-right'}"></i>
              </a>
            </div>
          </div>

          <!-- Card B: Last Listening -->
          <div class="continue-study-card" id="continue-card-recording" role="region" aria-label="${audioTitle}">
            <div class="continue-card-top">
              <span class="continue-tag-badge recording">
                <i data-lucide="headphones"></i>
                <span>${isAr ? 'آخر تسجيل صوتي' : 'Last Listening'}</span>
              </span>
              <h3 class="continue-card-title" title="${audioTitle}">${audioTitle}</h3>
              <p class="continue-card-subject" title="${audioSub}">${audioSub}</p>
              <span class="continue-card-meta">${audioMeta}</span>
            </div>
            <div class="continue-card-bottom">
              <a href="${audioUrl}" class="continue-action-btn ${hasAudio ? '' : 'secondary'}">
                <span>${audioBtnText}</span>
                <i data-lucide="${isAr ? 'arrow-left' : 'arrow-right'}"></i>
              </a>
            </div>
          </div>

          <!-- Card C: Continue Questions -->
          <div class="continue-study-card ${isCompleted ? 'quiz-completed' : ''}" id="continue-card-questions" role="region" aria-label="${qTitle}">
            <div class="continue-card-top">
              <span class="continue-tag-badge questions ${isCompleted ? 'completed-badge' : ''}">
                <i data-lucide="${isCompleted ? 'check-circle' : 'help-circle'}"></i>
                <span>${qBadgeText}</span>
              </span>
              <h3 class="continue-card-title" title="${qTitle}">${qTitle}</h3>
              <p class="continue-card-subject" title="${qSub}">${qSub}</p>
              <div class="continue-progress-wrap ${hasQ ? '' : 'empty'}">
                ${hasQ ? `
                  <div class="continue-progress-label">
                    <span>${qAnswered} / ${qTotal} ${isAr ? 'سؤال' : 'questions'}</span>
                    <span>${qPercent}%</span>
                  </div>
                  <div class="continue-progress-track">
                    <div class="continue-progress-fill ${isCompleted ? 'completed-fill' : ''}" style="width: ${qPercent}%;"></div>
                  </div>
                ` : `
                  <span class="continue-empty-hint">${isAr ? 'جاهز لاختبار معلوماتك؟' : 'Ready to test your readiness?'}</span>
                `}
              </div>
            </div>
            <div class="continue-card-bottom">
              <a href="${qUrl}" class="continue-action-btn ${hasQ ? '' : 'secondary'}">
                <span>${qBtnText}</span>
                <i data-lucide="${isAr ? 'arrow-left' : 'arrow-right'}"></i>
              </a>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  /* ══════════════════════════════════════════
     4. QUICK ACCESS SECTION (Removed per Directives)
     ══════════════════════════════════════════ */
  renderQuickAccess() {
    return '';
  },

  /* ══════════════════════════════════════════
     5. YOUR SUBJECTS SECTION HEADER & FILTER (Retained for component compatibility)
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
     6. MAIN RENDER (Compact Dashboard: Hero -> Today/Tomorrow Schedule -> Continue Studying)
     ══════════════════════════════════════════ */
  render(container) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;

    container.innerHTML = `
      <div class="kuro-dashboard-container">
        <!-- 1. Compact Hero Study Scene Banner with Dynamic Greeting -->
        ${HomePage.renderHeroSection(isAr)}

        <!-- 2. Today & Tomorrow Schedule (Split 2-Column Cards) -->
        ${HomePage.renderDailyLecturesSection(isAr)}

        <!-- 3. Continue Studying (3 Core Activity Cards) -->
        ${HomePage.renderContinueStudyingSection(isAr)}
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
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
