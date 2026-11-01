/**
 * KURO FANGS — HOME DASHBOARD (v28.0)
 * Clean, Minimal & Balanced Academic Study Dashboard
 * Responsive across Desktop, iPad, Android Tablets, and Smartphones
 */

const SUBJECT_THEMES = {
  'gen-med':        { icon: 'stethoscope', color: '#0D9488', bg: '#E6F4F2', border: 'rgba(13, 148, 136, 0.22)', bar: '#0D9488' },
  'gen-surgery':    { icon: 'activity',    color: '#E11D48', bg: '#FCEEEF', border: 'rgba(225, 29, 72, 0.20)',  bar: '#E11D48' },
  'fixed-pros':     { icon: 'tooth',       color: '#9F1D35', bg: '#FCEEEF', border: 'rgba(159, 29, 53, 0.18)',  bar: '#0D9488' },
  'omfs':           { icon: 'scissors',    color: '#C84343', bg: '#FCEAEA', border: 'rgba(200, 67, 67, 0.20)',  bar: '#C84343' },
  'oral-diseases':  { icon: 'microscope',  color: '#EA580C', bg: '#FFF1E6', border: 'rgba(234, 88, 12, 0.20)',  bar: '#EA580C' },
  'endo':           { icon: 'tooth',       color: '#7C3AED', bg: '#F3EEFF', border: 'rgba(124, 58, 237, 0.20)', bar: '#7C3AED' },
  'omdr':           { icon: 'scan',        color: '#4F46E5', bg: '#EEF0FF', border: 'rgba(79, 70, 229, 0.20)',  bar: '#4F46E5' },
  'preventive':     { icon: 'sparkles',    color: '#0284C7', bg: '#E0F2FE', border: 'rgba(2, 132, 199, 0.20)',  bar: '#0284C7' },
  'cons-endo':      { icon: 'tooth',       color: '#9F1D35', bg: '#FCEEEF', border: 'rgba(159, 29, 53, 0.18)',  bar: '#9F1D35' },
  'ortho':          { icon: 'smile',       color: '#0EA5E9', bg: '#E0F7FF', border: 'rgba(14, 165, 233, 0.20)', bar: '#0EA5E9' },
  'pediatric':      { icon: 'baby',        color: '#9333EA', bg: '#F5E8FF', border: 'rgba(147, 51, 234, 0.20)', bar: '#9333EA' },
  'pedo':           { icon: 'baby',        color: '#9333EA', bg: '#F5E8FF', border: 'rgba(147, 51, 234, 0.20)', bar: '#9333EA' },
  'removable-pros': { icon: 'layers',      color: '#BE185D', bg: '#FCE7F3', border: 'rgba(190, 24, 93, 0.20)',  bar: '#BE185D' }
};

const DEFAULT_THEME = {
  icon: 'tooth',
  color: '#7A1C2C',
  bg: '#FCEEEF',
  border: 'rgba(122, 28, 44, 0.18)',
  bar: '#7A1C2C'
};

/* ─── Instant Hero Banner Engine ─── */
const HERO_BANNER_CONFIG = {
  src: 'assets/hero/academic-study-hero.jpg?v=28.0'
};

try {
  localStorage.removeItem('kf_hero_banner_b64');
  localStorage.removeItem('kf_academic_hero_banner_v24');
} catch (e) {}

const _prewarmHero = new Image();
_prewarmHero.decoding = 'async';
_prewarmHero.src = HERO_BANNER_CONFIG.src;

const HOME_INLINE_SVGS = {
  'calendar': '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>',
  'calendar-days': '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>',
  'calendar-check': '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/>',
  'flame': '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  'clock': '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  'check-circle-2': '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  'book-open': '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  'folder': '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
  'file-text': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  'mic': '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>',
  'headphones': '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
  'help-circle': '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
  'users': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  'play': '<polygon points="6 3 20 12 6 21 6 3" fill="currentColor"/>',
  'map-pin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  'arrow-left': '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  'chevron-left': '<path d="m15 18-6-6 6-6"/>',
  'tooth': '<path d="M12 2C7.5 2 4 4.5 4 8c0 3 1.5 6 3 9 1 2 2 5 3 5s2-3 2-5c0-1.5.5-2 0-3-.5-1-1-1.5-1-2.5 0-1.5 1-2.5 1-2.5s1 1 1 2.5c0 1-.5 1.5-1 2.5-.5 1 0 1.5 0 3 0 2 1 5 2 5s2-3 3-5c1.5-3 3-6 3-9 0-3.5-3.5-6-8-6z"/>',
  'stethoscope': '<path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/>',
  'activity': '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  'shield': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  'scissors': '<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>',
  'microscope': '<path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>',
  'scan': '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>',
  'sparkles': '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>',
  'smile': '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/>',
  'baby': '<path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/>',
  'layers': '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>'
};

function renderInlineSvg(name, size = 18, extraClass = '') {
  const paths = HOME_INLINE_SVGS[name] || HOME_INLINE_SVGS['book-open'];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${name} ${extraClass}" aria-hidden="true">${paths}</svg>`;
}

const HomePage = {
  searchQuery: '',
  loadingTimeout: null,
  activeDailyTab: 'today',

  /* ─── Dynamic Time-of-Day Greeting Engine (Uses real student name) ─── */
  getHeroGreetingData(isAr) {
    const now = new Date();
    const h = now.getHours();

    let studentName = isAr ? 'طالب طب الأسنان' : 'Dental Student';
    try {
      const authUser = window.AUTH && typeof window.AUTH.getUser === 'function' ? window.AUTH.getUser() : null;
      const rawAuthName = authUser && authUser.full_name ? String(authUser.full_name).trim() : '';
      let storedName = '';
      try {
        const localInfo = JSON.parse(localStorage.getItem('kf_user_info') || '{}');
        storedName = String(localInfo.full_name || localInfo.name || '').trim();
      } catch (e) {}

      const candidate = rawAuthName || storedName;
      const genericPlaceholders = ['kuro student', 'طالب كورو', 'dental student', 'طالب أسنان', 'طالب طب الأسنان', 'guest student', 'طالب زائر'];
      if (candidate && !genericPlaceholders.includes(candidate.toLowerCase())) {
        studentName = candidate.split(/\s+/)[0];
      }
    } catch (e) {}

    let title = '';
    let subtitle = isAr
      ? 'واصل التقدّم، أنت أقرب إلى تحقيق أهدافك.'
      : "Keep going, you're closer to your goals.";

    if (h >= 5 && h < 12) {
      title = isAr ? `صباح الخير، ${studentName} ☀️` : `Good Morning, ${studentName} ☀️`;
    } else if (h >= 12 && h < 17) {
      title = isAr ? `مساء الخير، ${studentName} 👋` : `Good Afternoon, ${studentName} 👋`;
    } else if (h >= 17 && h < 21) {
      title = isAr ? `مساء الخير، ${studentName} ✨` : `Good Evening, ${studentName} ✨`;
    } else {
      title = isAr ? `مساء الخير، ${studentName} 🌙` : `Good Night, ${studentName} 🌙`;
    }

    const daysAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const monthsAr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const shortMonthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dayName = isAr ? daysAr[now.getDay()] : daysEn[now.getDay()];
    const monthName = isAr ? monthsAr[now.getMonth()] : monthsEn[now.getMonth()];
    const shortMonthName = isAr ? monthsAr[now.getMonth()] : shortMonthsEn[now.getMonth()];

    const dateFormatted = isAr
      ? `${dayName}، ${now.getDate()} ${monthName} ${now.getFullYear()}`
      : `${dayName}, ${now.getDate()} ${monthName} ${now.getFullYear()}`;

    const shortDateFormatted = isAr
      ? `${dayName}، ${now.getDate()} ${shortMonthName} ${now.getFullYear()}`
      : `${dayName}, ${now.getDate()} ${shortMonthName} ${now.getFullYear()}`;

    return { title, subtitle, dateFormatted, shortDateFormatted };
  },

  handleSubjectClick(subjectId) {
    try {
      if (window.SubjectModal && typeof window.SubjectModal.open === 'function') {
        window.SubjectModal.open(subjectId);
      } else if (window.ROUTER) {
        window.ROUTER.navigate(`/schedules`);
      }
    } catch (e) {
      if (window.ROUTER) window.ROUTER.navigate(`/schedules`);
    }
    setTimeout(() => {
      try {
        HomePage.trackSubjectVisit(subjectId);
      } catch (e) {}
    }, 10);
  },

  trackSubjectVisit(subjectId) {
    try {
      let recent = JSON.parse(localStorage.getItem('kf_recent_subjects') || '[]');
      recent = recent.filter(id => id !== subjectId);
      recent.unshift(subjectId);
      recent = recent.slice(0, 6);
      localStorage.setItem('kf_recent_subjects', JSON.stringify(recent));
    } catch {}
  },

  formatRelativeTime(timestamp, isAr) {
    if (!timestamp) return isAr ? 'اليوم' : 'Today';
    const d = new Date(timestamp);
    if (isNaN(d.getTime())) return isAr ? 'اليوم' : 'Today';

    const now = new Date();
    const isToday = now.toDateString() === d.toDateString();

    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = isAr ? (hours >= 12 ? 'م' : 'ص') : (hours >= 12 ? 'PM' : 'AM');
    hours = hours % 12;
    hours = hours ? hours : 12;
    const timeStr = `${hours}:${minutes} ${ampm}`;

    if (isToday) {
      return isAr ? `اليوم، ${timeStr}` : `Today, ${timeStr}`;
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (yesterday.toDateString() === d.toDateString()) {
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

  /* ══════════════════════════════════════════
     1. WELCOME HERO SECTION (Compact, Calm & Dynamic)
     ══════════════════════════════════════════ */
  renderHeroSection(isAr) {
    const { title, subtitle, dateFormatted, shortDateFormatted } = HomePage.getHeroGreetingData(isAr);
    const heroSrc = HERO_BANNER_CONFIG.src;

    return `
      <section class="kuro-hero-workspace" aria-label="${isAr ? 'القسم الترحيبي' : 'Welcome Section'}">
        <div class="kuro-hero-banner">
          <img
            src="${heroSrc}"
            alt="Academic Study Workspace"
            class="kuro-hero-bg-img"
            width="1280"
            height="420"
            loading="eager"
            decoding="async"
            fetchpriority="high"
          />
          <div class="kuro-hero-vignette"></div>
          <div class="kuro-hero-greeting-overlay" dir="${isAr ? 'rtl' : 'ltr'}">
            <h1 class="kuro-hero-greeting-title">${title}</h1>
            <p class="kuro-hero-greeting-sub">${subtitle}</p>
            <div class="kuro-hero-date-chip">
              ${renderInlineSvg('calendar', 14, 'kuro-hero-date-icon')}
              <span class="kuro-hero-date-full">${dateFormatted}</span>
              <span class="kuro-hero-date-short">${shortDateFormatted}</span>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  /* ══════════════════════════════════════════
     2. QUICK STATISTICS (Study Time, Study Streak, Completed Questions, Today's Classes)
     ══════════════════════════════════════════ */
  renderStudySummaryStrip(isAr) {
    // 1. Today's scheduled classes count
    let todayClassesCount = 0;
    try {
      const todaySchedule = window.DATA && typeof window.DATA.getTheoryScheduleForDay === 'function'
        ? window.DATA.getTheoryScheduleForDay(new Date().getDay())
        : null;
      if (todaySchedule && Array.isArray(todaySchedule.slots)) {
        todayClassesCount = todaySchedule.slots.length;
      }
    } catch (e) {}

    // 2. Study Streak & Study Time from real Study Rooms stats + Personal Library
    let streakDays = 0;
    let totalStudyMinutes = 0;
    try {
      const rawStats = localStorage.getItem('kf_study_room_stats_v1');
      if (rawStats) {
        const parsed = JSON.parse(rawStats);
        if (parsed && typeof parsed === 'object') {
          streakDays = Math.max(0, parseInt(parsed.streak, 10) || 0);
          totalStudyMinutes = Math.max(0, parseInt(parsed.totalMinutes, 10) || 0);
        }
      }
      if (window.PersonalLibrary && typeof window.PersonalLibrary.getAllFiles === 'function') {
        const libFiles = window.PersonalLibrary.getAllFiles();
        const libSec = libFiles.reduce((acc, f) => acc + (parseInt(f.studyTimeSec, 10) || 0), 0);
        if (libSec > 0) {
          totalStudyMinutes += Math.floor(libSec / 60);
        }
      }
    } catch (e) {}

    const hours = Math.floor(totalStudyMinutes / 60);
    const mins = totalStudyMinutes % 60;
    let studyTimeDisplay = '';
    if (hours > 0) {
      studyTimeDisplay = isAr ? `${hours}س ${mins}د` : `${hours}h ${mins}m`;
    } else {
      studyTimeDisplay = isAr ? `${mins}د` : `${mins}m`;
    }

    // 3. Completed Questions across real student quiz sessions
    let totalQuestionsAnswered = 0;
    try {
      const seenSheetIds = new Set();
      const allRaw = localStorage.getItem('kf_all_question_sessions');
      if (allRaw) {
        const list = JSON.parse(allRaw);
        if (Array.isArray(list)) {
          list.forEach(s => {
            if (!s) return;
            const sid = s.sheet_id || s.id;
            const count = s.answers && typeof s.answers === 'object'
              ? Object.keys(s.answers).length
              : (parseInt(s.answered, 10) || 0);
            if (sid && !seenSheetIds.has(sid)) {
              seenSheetIds.add(sid);
              totalQuestionsAnswered += Math.max(0, count);
            }
          });
        }
      }
      const activeRaw = localStorage.getItem('kf_active_question_session');
      if (activeRaw) {
        const act = JSON.parse(activeRaw);
        if (act) {
          const sid = act.sheet_id || act.id || 'active';
          if (!seenSheetIds.has(sid)) {
            const count = act.answers && typeof act.answers === 'object'
              ? Object.keys(act.answers).length
              : (parseInt(act.answered, 10) || 0);
            totalQuestionsAnswered += Math.max(0, count);
          }
        }
      }
    } catch (e) {}

    // Order matches the reference design: Study Time -> Study Streak -> Completed Questions -> Today's Classes
    return `
      <section class="kuro-study-summary-strip" aria-label="${isAr ? 'الإحصائيات الأساسية' : 'Quick Statistics'}">
        <a href="#/study-rooms" class="kuro-summary-stat-card stat-time">
          <div class="kssc-icon-box">${renderInlineSvg('clock', 19)}</div>
          <div class="kssc-meta">
            <strong class="kssc-val">${studyTimeDisplay}</strong>
            <span class="kssc-label" data-short="${isAr ? 'الوقت' : 'Study Time'}">${isAr ? 'إجمالي وقت الدراسة' : 'Study Time'}</span>
          </div>
        </a>

        <a href="#/study-rooms" class="kuro-summary-stat-card stat-streak">
          <div class="kssc-icon-box">${renderInlineSvg('flame', 19)}</div>
          <div class="kssc-meta">
            <strong class="kssc-val">${streakDays}</strong>
            <span class="kssc-label" data-short="${isAr ? 'الاستمرارية' : 'Streak'}">${isAr ? 'أيام الاستمرارية' : 'Study Streak'}</span>
          </div>
        </a>

        <a href="#/questions" class="kuro-summary-stat-card stat-questions">
          <div class="kssc-icon-box">${renderInlineSvg('check-circle-2', 19)}</div>
          <div class="kssc-meta">
            <strong class="kssc-val">${totalQuestionsAnswered}</strong>
            <span class="kssc-label" data-short="${isAr ? 'الأسئلة' : 'Questions'}">${isAr ? 'الأسئلة المكتملة' : 'Completed Questions'}</span>
          </div>
        </a>

        <a href="#/schedules" class="kuro-summary-stat-card stat-classes">
          <div class="kssc-icon-box">${renderInlineSvg('calendar', 19)}</div>
          <div class="kssc-meta">
            <strong class="kssc-val">${todayClassesCount}</strong>
            <span class="kssc-label" data-short="${isAr ? 'المحاضرات' : 'Classes'}">${isAr ? 'محاضرات اليوم' : "Today's Classes"}</span>
          </div>
        </a>
      </section>
    `;
  },

  /* ══════════════════════════════════════════
     3. RESOLVE LAST STUDY FILE (Personal Library + ViewState)
     ══════════════════════════════════════════ */
  getContinueStudyingFile(isAr) {
    const activeUserId = (window.PersonalLibrary && typeof window.PersonalLibrary.getCurrentUserId === 'function')
      ? window.PersonalLibrary.getCurrentUserId()
      : 'guest';

    let fileRecord = null;
    let folderName = '';

    // 1. Check Personal Study Library files for the current user
    if (window.PersonalLibrary && typeof window.PersonalLibrary.getAllFiles === 'function') {
      try {
        const allFiles = window.PersonalLibrary.getAllFiles();
        if (Array.isArray(allFiles) && allFiles.length > 0) {
          // Sort by lastOpenedAt descending, then updatedAt/createdAt descending
          const sorted = [...allFiles].sort((a, b) => {
            const ta = a.lastOpenedAt ? new Date(a.lastOpenedAt).getTime() : 0;
            const tb = b.lastOpenedAt ? new Date(b.lastOpenedAt).getTime() : 0;
            if (ta !== tb) return tb - ta;
            const ua = new Date(a.updatedAt || a.createdAt || 0).getTime();
            const ub = new Date(b.updatedAt || b.createdAt || 0).getTime();
            return ub - ua;
          });
          fileRecord = sorted[0];
          if (fileRecord && fileRecord.folderId && typeof window.PersonalLibrary.getFolderById === 'function') {
            const folder = window.PersonalLibrary.getFolderById(fileRecord.folderId);
            if (folder && folder.name) folderName = folder.name;
          }
        }
      } catch (e) {}
    }

    // 2. Also check user-scoped or global kf_last_opened_sheet
    let cachedSheet = null;
    try {
      const raw = localStorage.getItem(`kf_last_opened_sheet_${activeUserId}`) || localStorage.getItem('kf_last_opened_sheet');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.id) {
          // Verify it still exists in PersonalLibrary if it's a PersonalLibrary file
          if (window.PersonalLibrary && typeof window.PersonalLibrary.getFileById === 'function') {
            const existsInLib = window.PersonalLibrary.getFileById(parsed.id);
            if (existsInLib) {
              cachedSheet = parsed;
              if (!fileRecord || (parsed.timestamp && (!fileRecord.lastOpenedAt || parsed.timestamp > new Date(fileRecord.lastOpenedAt).getTime()))) {
                fileRecord = existsInLib;
                if (existsInLib.folderId && typeof window.PersonalLibrary.getFolderById === 'function') {
                  const folder = window.PersonalLibrary.getFolderById(existsInLib.folderId);
                  if (folder && folder.name) folderName = folder.name;
                }
              }
            }
          }
        }
      }
    } catch (e) {}

    if (!fileRecord) return null;

    // 3. Read live view state for accurate currentPage
    let lastPage = Math.max(1, parseInt(fileRecord.lastPage || (cachedSheet && cachedSheet.lastPage), 10) || 1);
    let totalPages = Math.max(1, parseInt(fileRecord.pages || fileRecord.pages_count || (cachedSheet && cachedSheet.totalPages), 10) || 1);

    try {
      const stateRaw = localStorage.getItem(`kf_kn_viewstate_${activeUserId}_${fileRecord.id}`) ||
                       localStorage.getItem(`kf_kn_viewstate_${fileRecord.id}`);
      if (stateRaw) {
        const vs = JSON.parse(stateRaw);
        if (vs && vs.currentPage) {
          lastPage = Math.max(1, parseInt(vs.currentPage, 10) || lastPage);
        }
      }
    } catch (e) {}

    if (lastPage > totalPages) totalPages = lastPage;
    const progressPct = Math.min(100, Math.max(1, Math.round((lastPage / totalPages) * 100)));

    const title = isAr
      ? (fileRecord.title_ar || fileRecord.title || fileRecord.name || 'ملف دراسي')
      : (fileRecord.title_en || fileRecord.title || fileRecord.name || 'Study Document');

    const subtitle = folderName ||
      (cachedSheet && (isAr ? cachedSheet.subject_name_ar : cachedSheet.subject_name_en)) ||
      (cachedSheet && cachedSheet.folderName) ||
      (isAr ? 'المكتبة الدراسية الشخصية' : 'Personal Study Library');

    const lastOpenedTs = fileRecord.lastOpenedAt || (cachedSheet && (cachedSheet.timestamp || cachedSheet.openedAt)) || fileRecord.updatedAt || fileRecord.createdAt;
    const lastOpenedLabel = HomePage.formatRelativeTime(lastOpenedTs, isAr);
    const badgeType = (fileRecord.fileKind === 'image' || (fileRecord.fileType && fileRecord.fileType.startsWith('image/'))) ? 'IMG' : 'PDF';

    return {
      id: fileRecord.id,
      title,
      subtitle,
      lastPage,
      totalPages,
      progressPct,
      lastOpenedLabel,
      badgeType,
      url: `#/sheet-detail?id=${encodeURIComponent(fileRecord.id)}&page=${lastPage}`
    };
  },

  /* ══════════════════════════════════════════
     4. CONTINUE STUDYING CARD (Matches Reference Left Column & Phone Card)
     ══════════════════════════════════════════ */
  renderContinueStudyingCard(isAr) {
    const file = HomePage.getContinueStudyingFile(isAr);

    if (!file) {
      return `
        <article class="kuro-home-panel kuro-continue-panel" aria-label="${isAr ? 'متابعة الدراسة' : 'Continue Studying'}">
          <div class="kuro-home-panel-header">
            <h2 class="kuro-home-panel-title">
              ${renderInlineSvg('book-open', 19)}
              <span>${isAr ? 'متابعة الدراسة' : 'Continue Studying'}</span>
            </h2>
            <a href="#/sheets" class="kuro-panel-arrow-link" title="${isAr ? 'فتح المكتبة الشخصية' : 'Open Personal Library'}">
              ${renderInlineSvg(isAr ? 'arrow-left' : 'arrow-right', 17)}
            </a>
          </div>

          <div class="kuro-cs-empty-state">
            <div class="kuro-cs-empty-badge">
              <span class="kuro-pdf-emblem">PDF</span>
            </div>
            <div class="kuro-cs-empty-text">
              <h3>${isAr ? 'مكتبتك الدراسية الشخصية جاهزة' : 'Your Personal Library is Ready'}</h3>
              <p>${isAr ? 'أنشئ مجلداتك الخاصة وارفع ملفات المحاضرات (PDF أو صور) لمتابعة دراستك من آخر صفحة وصلت إليها.' : 'Create folders and import your lecture PDFs or images to pick up right where you left off.'}</p>
            </div>
            <a href="#/sheets" class="kuro-cs-primary-btn">
              ${renderInlineSvg('folder', 15)}
              <span>${isAr ? 'الانتقال إلى المكتبة الشخصية' : 'Open Personal Library'}</span>
            </a>
          </div>
        </article>
      `;
    }

    return `
      <article class="kuro-home-panel kuro-continue-panel" aria-label="${isAr ? 'متابعة الدراسة' : 'Continue Studying'}">
        <div class="kuro-home-panel-header">
          <h2 class="kuro-home-panel-title">
            ${renderInlineSvg('book-open', 19)}
            <span>${isAr ? 'متابعة الدراسة' : 'Continue Studying'}</span>
          </h2>
          <a href="#/sheets" class="kuro-panel-arrow-link" title="${isAr ? 'فتح المكتبة الشخصية' : 'Open Personal Library'}">
            ${renderInlineSvg(isAr ? 'arrow-left' : 'arrow-right', 17)}
          </a>
        </div>

        <div class="kuro-cs-card-inner">
          <!-- File Header Box -->
          <a href="${file.url}" class="kuro-cs-file-row">
            <div class="kuro-cs-pdf-badge" aria-hidden="true">
              <div class="kuro-cs-pdf-doc">
                <span class="kuro-cs-pdf-tag">${file.badgeType}</span>
              </div>
            </div>
            <div class="kuro-cs-file-info">
              <h3 class="kuro-cs-file-title" title="${file.title}">${file.title}</h3>
              <p class="kuro-cs-file-folder" title="${file.subtitle}">${file.subtitle}</p>
            </div>
          </a>

          <!-- Page & Last Opened Meta Row -->
          <div class="kuro-cs-meta-row">
            <span class="kuro-cs-page-stat">
              ${renderInlineSvg('file-text', 14)}
              <span>${isAr ? `آخر صفحة: ${file.lastPage} / ${file.totalPages}` : `Last page: ${file.lastPage} / ${file.totalPages}`}</span>
            </span>
            <span class="kuro-cs-time-stat">
              ${isAr ? `آخر فتح: ${file.lastOpenedLabel}` : `Opened: ${file.lastOpenedLabel}`}
            </span>
          </div>

          <!-- Progress Track + Percentage -->
          <div class="kuro-cs-progress-row">
            <div class="kuro-cs-progress-track" role="progressbar" aria-valuenow="${file.progressPct}" aria-valuemin="0" aria-valuemax="100">
              <div class="kuro-cs-progress-fill" style="width: ${file.progressPct}%;"></div>
            </div>
            <span class="kuro-cs-progress-pct">${file.progressPct}%</span>
          </div>

          <!-- Primary CTA Button -->
          <a href="${file.url}" class="kuro-cs-primary-btn">
            ${renderInlineSvg('play', 13, 'kuro-cs-play-icon')}
            <span>${isAr ? 'متابعة الدراسة' : 'Continue Studying'}</span>
          </a>
        </div>
      </article>
    `;
  },

  /* ══════════════════════════════════════════
     5. TODAY'S CLASSES CARD (Matches Reference Right Column)
     ══════════════════════════════════════════ */
  getLectureTimeStatus(timeStr, isAr) {
    if (!timeStr || typeof timeStr !== 'string') {
      return { key: 'today', label: isAr ? 'اليوم' : 'Today' };
    }
    try {
      const parts = timeStr.split(/[-–—]/).map(s => s.trim());
      if (parts.length < 2) return { key: 'today', label: isAr ? 'اليوم' : 'Today' };
      const parseHm = (hm) => {
        const m = hm.match(/(\d{1,2}):(\d{2})/);
        if (!m) return null;
        return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
      };
      const startMin = parseHm(parts[0]);
      const endMin = parseHm(parts[1]);
      if (startMin === null || endMin === null) return { key: 'today', label: isAr ? 'اليوم' : 'Today' };

      const now = new Date();
      const curMin = now.getHours() * 60 + now.getMinutes();
      if (curMin >= startMin && curMin <= endMin) {
        return { key: 'live', label: isAr ? 'جارية الآن' : 'Live Now' };
      } else if (curMin < startMin) {
        return { key: 'upcoming', label: isAr ? 'قادمة' : 'Upcoming' };
      } else {
        return { key: 'completed', label: isAr ? 'مكتملة' : 'Completed' };
      }
    } catch (e) {
      return { key: 'today', label: isAr ? 'اليوم' : 'Today' };
    }
  },

  renderTodayClassesCard(isAr) {
    const todayIndex = new Date().getDay();
    const todaySchedule = window.DATA && typeof window.DATA.getTheoryScheduleForDay === 'function'
      ? window.DATA.getTheoryScheduleForDay(todayIndex)
      : { slots: [] };
    const todaySlots = (todaySchedule && Array.isArray(todaySchedule.slots)) ? todaySchedule.slots : [];

    return `
      <article class="kuro-home-panel kuro-classes-panel" aria-label="${isAr ? 'محاضرات اليوم' : "Today's Classes"}">
        <div class="kuro-home-panel-header">
          <h2 class="kuro-home-panel-title">
            ${renderInlineSvg('calendar', 19)}
            <span>${isAr ? 'محاضرات اليوم' : "Today's Classes"}</span>
          </h2>
          <a href="#/schedules" class="kuro-view-schedule-link">
            <span>${isAr ? 'عرض الجدول' : 'View Schedule'}</span>
            ${renderInlineSvg(isAr ? 'arrow-left' : 'arrow-right', 14)}
          </a>
        </div>

        <div class="kuro-classes-body">
          ${todaySlots.length === 0 ? `
            <div class="kuro-classes-empty">
              <div class="kuro-classes-empty-icon">
                ${renderInlineSvg('calendar-days', 22)}
              </div>
              <div class="kuro-classes-empty-info">
                <h3>${isAr ? 'لا توجد محاضرات مجدولة اليوم' : 'No classes scheduled for today'}</h3>
                <p>${isAr ? 'استغل يومك في مراجعة ملفاتك داخل المكتبة الشخصية أو حل الأسئلة.' : 'Use this time to review your personal library notes or practice questions.'}</p>
              </div>
              <a href="#/schedules" class="kuro-classes-empty-btn">
                <span>${isAr ? 'عرض الجدول الأسبوعي الكامل' : 'View Full Weekly Schedule'}</span>
                ${renderInlineSvg(isAr ? 'arrow-left' : 'arrow-right', 14)}
              </a>
            </div>
          ` : `
            <div class="kuro-today-classes-list">
              ${todaySlots.map((slot, index) => {
                const theme = SUBJECT_THEMES[slot.subject_id] || DEFAULT_THEME;
                const barColor = index % 2 === 0 ? '#0D9488' : '#9F1D35';
                const status = HomePage.getLectureTimeStatus(slot.time, isAr);
                const subjectTitle = isAr ? (slot.subject_ar || slot.subject_en) : (slot.subject_en || slot.subject_ar);
                const hallName = isAr ? (slot.hall_ar || slot.hall_en) : (slot.hall_en || slot.hall_ar);
                const formattedTime = String(slot.time || '').replace('-', '–');

                return `
                  <div
                    class="kuro-today-class-row"
                    role="button"
                    tabindex="0"
                    onclick="window.HomePage.handleSubjectClick('${slot.subject_id}')"
                    onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.HomePage.handleSubjectClick('${slot.subject_id}');}"
                  >
                    <span class="ktcr-accent-bar" style="background-color: ${barColor};"></span>
                    <div class="ktcr-icon-box" style="background-color: ${theme.bg}; color: ${theme.color}; border-color: ${theme.border};">
                      ${renderInlineSvg(theme.icon || 'tooth', 20)}
                    </div>
                    <div class="ktcr-info">
                      <div class="ktcr-time-row">
                        <span class="ktcr-time">${formattedTime}</span>
                        <span class="ktcr-status-pill status-${status.key}">${status.label}</span>
                      </div>
                      <h3 class="ktcr-subject" title="${subjectTitle}">${subjectTitle}</h3>
                      <div class="ktcr-hall">
                        ${renderInlineSvg('map-pin', 12)}
                        <span>${hallName}</span>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>
      </article>
    `;
  },

  /* ══════════════════════════════════════════
     6. QUICK ACCESS SHORTCUTS (Compact Row at Bottom)
     ══════════════════════════════════════════ */
  renderQuickAccessSection(isAr) {
    let filesCount = 0;
    let foldersCount = 0;
    try {
      if (window.PersonalLibrary) {
        filesCount = (window.PersonalLibrary.getAllFiles?.() || []).length;
        foldersCount = (window.PersonalLibrary.getAllFolders?.() || []).length;
      }
    } catch (e) {}

    const libSub = (foldersCount > 0 || filesCount > 0)
      ? (isAr ? `${foldersCount} مجلد • ${filesCount} ملف` : `${foldersCount} folders • ${filesCount} files`)
      : (isAr ? 'مجلداتك وملفاتك الخاصة' : 'Your folders & PDFs');

    const items = [
      {
        route: '#/sheets',
        icon: 'folder',
        color: '#7A1C2C',
        bg: '#FCEEEF',
        title: isAr ? 'المكتبة الشخصية' : 'Library',
        sub: libSub
      },
      {
        route: '#/recordings',
        icon: 'mic',
        color: '#7C3AED',
        bg: '#F3EEFF',
        title: isAr ? 'التسجيلات الصوتية' : 'Recordings',
        sub: isAr ? 'المحاضرات الصوتية' : 'Audio lectures'
      },
      {
        route: '#/questions',
        icon: 'help-circle',
        color: '#0D9488',
        bg: '#E6F7F2',
        title: isAr ? 'بنك الأسئلة' : 'Questions',
        sub: isAr ? 'اختبارات وأسئلة سنوات' : 'MCQs & past exams'
      },
      {
        route: '#/study-rooms',
        icon: 'users',
        color: '#EA580C',
        bg: '#FFF3E6',
        title: isAr ? 'غرف الدراسة' : 'Study Rooms',
        sub: isAr ? 'مؤقت التركيز والدراسة' : 'Focus timer & rooms'
      },
      {
        route: '#/schedules',
        icon: 'calendar',
        color: '#2563EB',
        bg: '#EFF6FF',
        title: isAr ? 'الجداول الدراسية' : 'Schedules',
        sub: isAr ? 'النظري والعملي والامتحانات' : 'Academic timetables'
      }
    ];

    return `
      <section class="kuro-quick-access-section" aria-label="${isAr ? 'الاختصارات السريعة' : 'Quick Access'}">
        <div class="kuro-qa-header">
          <h2 class="kuro-qa-title">${isAr ? 'الاختصارات السريعة' : 'Quick Access'}</h2>
        </div>
        <div class="kuro-qa-grid">
          ${items.map(item => `
            <a href="${item.route}" class="kuro-qa-card">
              <div class="kuro-qa-icon" style="background-color: ${item.bg}; color: ${item.color};">
                ${renderInlineSvg(item.icon, 18)}
              </div>
              <div class="kuro-qa-meta">
                <strong class="kuro-qa-name">${item.title}</strong>
                <span class="kuro-qa-sub">${item.sub}</span>
              </div>
              <span class="kuro-qa-arrow">
                ${renderInlineSvg(isAr ? 'chevron-left' : 'chevron-right', 15)}
              </span>
            </a>
          `).join('')}
        </div>
      </section>
    `;
  },

  /* ══════════════════════════════════════════
     7. MAIN RENDER (Welcome -> Quick Stats -> [Continue Studying | Today's Classes] -> Quick Access)
     ══════════════════════════════════════════ */
  render(container) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;

    container.innerHTML = `
      <div class="kuro-dashboard-container">
        <!-- 1. Compact Welcome Hero Banner -->
        ${HomePage.renderHeroSection(isAr)}

        <!-- 2. Quick Statistics (4 Real-Data Cards) -->
        ${HomePage.renderStudySummaryStrip(isAr)}

        <!-- 3. Balanced 2-Column Workspace: Continue Studying + Today's Classes -->
        <section class="kuro-home-two-col-grid" aria-label="${isAr ? 'متابعة الدراسة ومحاضرات اليوم' : 'Study Progress and Schedule'}">
          ${HomePage.renderContinueStudyingCard(isAr)}
          ${HomePage.renderTodayClassesCard(isAr)}
        </section>

        <!-- 4. Quick Access Shortcuts -->
        ${HomePage.renderQuickAccessSection(isAr)}
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    HomePage.setupListeners();
  },

  /* Legacy methods retained as no-ops for external callers */
  renderSubjectsList() {},
  buildCardsHTML() {},
  setupListeners() {}
};

window.HomePage = HomePage;
