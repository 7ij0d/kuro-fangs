// High-Performance Debounced & Frame-Rate Optimized Lucide Icons Engine + Offline SVG Fallback
(function setupHighPerfLucideEngine() {
  const FALLBACK_SVGS = {
    'home': '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    'book-open': '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    'headphones': '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
    'help-circle': '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
    'timer': '<line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/>',
    'calendar': '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>',
    'calendar-days': '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>',
    'calendar-check': '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/>',
    'flame': '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    'clock': '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    'bar-chart-3': '<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
    'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
    'check-circle-2': '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    'search': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    'bell': '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    'settings': '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    'user': '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    'log-out': '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
    'log-in': '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/>',
    'more-horizontal': '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
    'menu': '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
    'x': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    'arrow-left': '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    'chevron-left': '<path d="m15 18-6-6 6-6"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    'map-pin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    'file-text': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    'stethoscope': '<path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/>',
    'activity': '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    'shield': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    'shield-check': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    'scissors': '<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>',
    'microscope': '<path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>',
    'zap': '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    'scan': '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>',
    'sparkles': '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>',
    'heart-pulse': '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>',
    'smile': '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/>',
    'baby': '<path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/>',
    'layers': '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    'graduation-cap': '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
    'globe': '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    'moon': '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    'volume-2': '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>'
  };

  function renderFallbackIcons() {
    const nodes = document.querySelectorAll('i[data-lucide]');
    nodes.forEach(node => {
      const name = node.getAttribute('data-lucide');
      if (!name) return;
      const paths = FALLBACK_SVGS[name] || FALLBACK_SVGS['book-open'];
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svg.setAttribute('width', '24');
      svg.setAttribute('height', '24');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '2');
      svg.setAttribute('stroke-linecap', 'round');
      svg.setAttribute('stroke-linejoin', 'round');
      const cls = node.getAttribute('class') || '';
      svg.setAttribute('class', ('lucide lucide-' + name + ' ' + cls).trim());
      if (node.getAttribute('style')) {
        svg.setAttribute('style', node.getAttribute('style'));
      }
      svg.innerHTML = paths;
      node.replaceWith(svg);
    });
  }

  function applyLucideDebouncer() {
    if (window.lucide && typeof window.lucide.createIcons === 'function' && !window.lucide._debounced) {
      const origCreateIcons = window.lucide.createIcons.bind(window.lucide);
      let lucideRafId = null;
      let pendingOptions = undefined;

      window.lucide.createIcons = function(options) {
        if (options !== undefined && options !== null) {
          pendingOptions = options;
        }
        try {
          if (pendingOptions) {
            origCreateIcons(pendingOptions);
          } else {
            origCreateIcons();
          }
        } catch (e) {}
        renderFallbackIcons();
        if (lucideRafId) return;
        lucideRafId = requestAnimationFrame(() => {
          try {
            if (pendingOptions) {
              origCreateIcons(pendingOptions);
            } else {
              origCreateIcons();
            }
          } catch (e) {}
          renderFallbackIcons();
          lucideRafId = null;
          pendingOptions = undefined;
        });
      };
      window.lucide._debounced = true;
    } else if (!window.lucide) {
      window.lucide = {
        createIcons: function() {
          renderFallbackIcons();
        },
        _debounced: true
      };
    }
  }

  applyLucideDebouncer();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      applyLucideDebouncer();
      renderFallbackIcons();
    });
  } else {
    renderFallbackIcons();
  }
})();

class I18nManager {
  constructor() {
    this.STORAGE_KEY = 'kf_lang';
    // Default language is English (en) as requested
    this.currentLang = localStorage.getItem(this.STORAGE_KEY) || 'en';

    this.translations = {
      en: {
        brandName: 'KURO FANGS',
        brandSub: 'Faculty of Dentistry — Year 3',
        searchPlaceholder: 'Search subjects, lectures, or topics...',
        navSubjects: 'Subjects (12)',


        pointsSuffix: 'pts',

        // Faculty News & Next Exam
        facultyNewsTitle: 'Official Faculty News & Announcements',
        facultyNewsSubtitle: 'Official notices, lab guidelines, and academic schedule updates',
        nextExamTitle: 'Next Official Exam',
        nextExamBadge: 'Urgent Alert',
        examDateLabel: 'Exam Date',
        examTimeLabel: 'Time',
        countdownDays: 'Days',
        countdownHours: 'Hours',
        countdownMins: 'Mins',
        countdownSecs: 'Secs',
        viewFullSchedule: 'View Full Schedule ➔',

        // Hero — Redesigned Welcome Section
        heroTitle: 'Academic Subjects — Year 3 (12)',
        heroSubtitle: '',
        heroGreetingMorning: 'Good morning',
        heroGreetingAfternoon: 'Good afternoon',
        heroGreetingEvening: 'Good evening',
        heroSubline: 'Ready to continue your dental journey?',
        heroStatSubjects: 'Subjects',
        heroStatProgress: 'Overall Progress',
        heroStatLectures: 'Lectures Available',
        heroStatExams: 'Past Exams',
        heroContinueBtn: 'Continue Learning',
        heroMascotLine: 'is ready to help you study',

        // Quick Access
        quickAccessTitle: 'Quick Access',
        qaQuestionBank: 'Question Bank',
        qaPastExams: 'Past Exams',
        qaFlashcards: 'Flashcards',
        qaSchedules: 'Schedules',
        qaQuestions: 'questions',
        qaPapers: 'papers',
        qaCards: 'cards',

        // Continue Learning
        continueLearnTitle: 'Continue Learning',
        continueLearnSub: 'Pick up where you left off',
        continueBtn: 'Continue',

        // Subjects Section
        yourSubjects: 'Your Subjects',
        subjectsAvailable: 'subjects available',
        openSubject: 'Open Subject',

        filterAll: 'All Subjects (12)',
        filterSem1: 'Semester 1',
        filterSem2: 'Semester 2',
        filterPopular: 'Most Viewed',
        searchEmptyTitle: 'No subjects matching your search',
        searchEmptySub: 'Try searching with another subject name or code.',
        subjectExplore: 'Explore Subject',
        contentHubsCount: '8 Content Hubs',
        studyProgress: 'Progress',
        completed: 'completed',
        browseContent: 'Explore Content ➔',
        lectures: 'lectures',
        exams: 'exams',
        doctor: 'Doctor',
        academicHubs: 'ACADEMIC HUBS',
        studentTools: 'STUDENT TOOLS',
        sideSecLearning: 'LEARNING',
        sideSecMySpace: 'MY SPACE',
        sideSecMore: 'MORE',
        sideNavSheets: 'Sheets & Lectures',
        sideNavHome: 'Home',
        sideNavVideos: 'Audio Recordings',
        sideNavExams: 'Past Exams Archive',
        sideNavQuestions: 'Question Bank',
        sideNavFlashcards: 'Interactive Flashcards',

        sideNavLectureSchedule: 'Theory Lectures Schedule',
        sideNavPracticalSchedule: 'Clinical & Lab Schedule',
        sideNavExamsSchedule: 'Official Exam Schedules',

        sideNavRewards: 'Fox Mascot Hub',
        sideNavGames: 'Arcade & Games',
        sideNavAdmin: 'Faculty Admin Portal',
        studentRole: 'Dental Surgery Student',
        academicYear: 'Year 3 — Faculty of Dentistry',

        // Fox Mascot Skins Hub
        foxSkinsHubTitle: 'Fox Mascot Skins & Site Themes (4 Mascots)',
        foxSkinsHubSubtitle: 'Unlock and equip the 4 official dental mascots; each skin transforms the full site-wide theme',
        myAcademicBalance: 'My Academic Points',
        equippedActive: '✓ Active Skin & Theme',
        equipAction: 'Equip Skin & Theme',
        unlockAction: 'Unlock Skin',
        lockedPoints: 'Locked',
        freeDefault: 'Free (Default)',
        equippedSuccess: 'Mascot skin equipped & full site theme activated successfully! 🦊✨',
        unlockedSuccess: 'Congratulations! New Fox Mascot skin unlocked, equipped, and theme activated!',
        notEnoughPoints: 'Not enough academic points to unlock this skin.',


        // Modal
        modalPrompt: 'Choose the academic section you want to open:',
        backToSections: 'Back to all subject sections',
        directAvailable: 'Direct & available content',
        downloadPdf: 'Download PDF',
        downloadExam: 'Download Model',
        listenAudio: 'Listen',
        watchVideo: 'Watch',
        startQuiz: 'Start Quiz Now',
        openFlashcards: 'Open Flashcards',
        openDrive: 'Open Cloud Drive',
        closeBtn: 'Close',

        // 8 Categories
        catSheets: 'Subject Sheets & Lectures',
        catSheetsDesc: 'Official university lectures and batch handouts (PDF)',
        catRecordings: 'Recordings & Video Lectures',
        catRecordingsDesc: 'Audio explanations and clinical lab demonstrations',
        catPastExams: 'Past Exam Papers',
        catPastExamsDesc: 'Previous midterm & final exam models with answer keys',
        catAiQuestions: 'AI-Generated Practice Bank',
        catAiQuestionsDesc: 'Interactive smart quiz questions with instant rationale',

        catFlashcards: 'Interactive Flashcards & Atlas',
        catFlashcardsDesc: 'Fast recall cards, clinical photographs, and radiographs',
        catFiles: 'Files, Slides & Extra Resources',
        catFilesDesc: 'Lecture presentation slides and recommended textbooks',

        // Notifications
        pointsEarned: 'Downloaded successfully! (+10 pts earned)'
      },
      ar: {
        brandName: 'KURO FANGS',
        brandSub: 'كلية طب وجراحة الفم والأسنان — السنة الثالثة',
        searchPlaceholder: 'ابحث عن أي مادة أو شيت أو موضوع...',
        navSubjects: 'المواد (12)',


        pointsSuffix: 'نقطة',

        // Faculty News & Next Exam
        facultyNewsTitle: 'أخبار وإعلانات الكلية الرسمية | Faculty News',
        facultyNewsSubtitle: 'التنبيهات الرسمية، ضوابط المعامل السريرية، وتحديثات التقويم الأكاديمي',
        nextExamTitle: 'الامتحان القادم',
        nextExamBadge: 'تنبيه عاجل',
        examDateLabel: 'تاريخ الامتحان',
        examTimeLabel: 'التوقيت',
        countdownDays: 'أيام',
        countdownHours: 'ساعات',
        countdownMins: 'دقائق',
        countdownSecs: 'ثواني',
        viewFullSchedule: 'عرض جدول الامتحانات الكامل ➔',

        // Hero — Redesigned Welcome Section
        heroTitle: 'المواد الدراسية — السنة الثالثة (12)',
        heroSubtitle: '',
        heroGreetingMorning: 'صباح الخير',
        heroGreetingAfternoon: 'مساء الخير',
        heroGreetingEvening: 'مساء الخير',
        heroSubline: 'جاهز تكمل رحلتك في طب الأسنان؟',
        heroStatSubjects: 'مادة',
        heroStatProgress: 'التقدم الكلي',
        heroStatLectures: 'محاضرة متاحة',
        heroStatExams: 'امتحانات سابقة',
        heroContinueBtn: 'واصل الدراسة',
        heroMascotLine: 'جاهز يساعدك في المذاكرة',

        // Quick Access
        quickAccessTitle: 'وصول سريع',
        qaQuestionBank: 'بنك الأسئلة',
        qaPastExams: 'امتحانات سابقة',
        qaFlashcards: 'بطاقات تعليمية',
        qaSchedules: 'الجداول',
        qaQuestions: 'سؤال',
        qaPapers: 'نموذج',
        qaCards: 'بطاقة',

        // Continue Learning
        continueLearnTitle: 'واصل الدراسة',
        continueLearnSub: 'أكمل من حيث توقفت',
        continueBtn: 'متابعة',

        // Subjects Section
        yourSubjects: 'موادك الدراسية',
        subjectsAvailable: 'مادة متاحة',
        openSubject: 'فتح المادة',

        filterAll: 'جميع المواد (12)',
        filterSem1: 'الفصل الأول',
        filterSem2: 'الفصل الثاني',
        filterPopular: 'الأكثر تصفحاً',
        searchEmptyTitle: 'لا توجد مواد مطابقة للبحث',
        searchEmptySub: 'جرّب كتابة اسم مادة آخر أو رمز المادة.',
        subjectExplore: 'استعراض المادة',
        contentHubsCount: '8 أقسام محتوى',
        studyProgress: 'التقدم',
        completed: 'مكتمل',
        browseContent: 'تصفح المحتوى ⬅️',
        lectures: 'محاضرة',
        exams: 'امتحانات',
        doctor: 'الدكتور',
        academicHubs: 'الأقسام الأكاديمية',
        studentTools: 'أدوات الطالب',
        sideSecLearning: 'التعليم',
        sideSecMySpace: 'مساحتي',
        sideSecMore: 'المزيد',
        sideNavSheets: 'المحاضرات والشيتات',
        sideNavHome: 'الرئيسية',
        sideNavVideos: 'التسجيلات الصوتية',
        sideNavExams: 'أرشيف الامتحانات',
        sideNavQuestions: 'بنك الأسئلة',
        sideNavFlashcards: 'البطاقات التعليمية',

        sideNavLectureSchedule: 'جدول المحاضرات النظري',
        sideNavPracticalSchedule: 'جدول المعامل والعملي',
        sideNavExamsSchedule: 'جداول الامتحانات الرسمية',

        sideNavRewards: 'متجر سكنات الثعلب',
        sideNavGames: 'مركز الألعاب والترفيه',
        sideNavAdmin: 'بوابة الإدارة الأكاديمية',
        studentRole: 'طالب طب وجراحة الأسنان',
        academicYear: 'السنة الثالثة — كلية طب الأسنان',

        // Fox Mascot Skins Hub
        foxSkinsHubTitle: 'متجر سكنات الثعلب الـ 4 وثيمات المنصة',
        foxSkinsHubSubtitle: 'افتح شخصيات الثعلب الـ 4 الرسمية؛ كل سكن يحول مظهر وثيم الموقع بالكامل فور ارتدائه',
        myAcademicBalance: 'رصيدي الأكاديمي',
        equippedActive: '✓ السكن والثيم النشط حالياً',
        equipAction: 'ارتداء السكن وتفعيل الثيم',
        unlockAction: 'فتح السكن',
        lockedPoints: 'مقفل',
        freeDefault: 'مجاناً (الافتراضي)',
        equippedSuccess: 'تم ارتداء سكن الثعلب وتفعيل الثيم الشامل للموقع بنجاح! 🦊✨',
        unlockedSuccess: 'مبارك! تم فتح السكن وتجهيزه وتفعيل ثيمه الجديد بنجاح!',
        notEnoughPoints: 'عذراً، رصيدك من النقاط الأكاديمية لا يكفي لفتح هذا السكن.',


        // Modal
        modalPrompt: 'اختر القسم الأكاديمي الذي تريد فتحه:',
        backToSections: 'العودة لكافة أقسام المادة',
        directAvailable: 'محتوى متاح ومباشر',
        downloadPdf: 'تحميل PDF',
        downloadExam: 'تحميل النموذج',
        listenAudio: 'استماع',
        watchVideo: 'مشاهدة',
        startQuiz: 'بدء الاختبار الآن',
        openFlashcards: 'فتح البطاقات',
        openDrive: 'فتح المصادر',
        closeBtn: 'إغلاق',

        // 8 Categories
        catSheets: 'شيتات ومحاضرات المادة',
        catSheetsDesc: 'المحاضرات الرسمية والتفريغات المعتمدة (PDF)',
        catRecordings: 'تسجيلات وشروحات المادة',
        catRecordingsDesc: 'الشروحات الصوتية والفيديوهات السريرية والمعملية',
        catPastExams: 'أسئلة سنوات سابقة',
        catPastExamsDesc: 'نماذج الامتحانات النصفية والنهائية السابقة والحلول',
        catAiQuestions: 'أسئلة مولدة بالـ AI',
        catAiQuestionsDesc: 'كويزات ذكية تفاعلية وتدريب بنك الأسئلة مع تصحيح فوري',

        catFlashcards: 'البطاقات التفاعلية والأطلس',
        catFlashcardsDesc: 'بطاقات التذكر السريع وصور الأشعة والحالات السريرية',
        catFiles: 'ملفات ومصادر إضافية',
        catFilesDesc: 'عروض السلايدات والمراجع العلمية الموصى بها',

        // Notifications
        pointsEarned: 'تم التحميل بنجاح وحصلت على +10 نقاط أكاديمية!'
      }
    };
  }

  getLang() {
    return this.currentLang;
  }

  setLang(lang) {
    if (lang !== 'en' && lang !== 'ar') lang = 'en';
    this.currentLang = lang;
    localStorage.setItem(this.STORAGE_KEY, lang);

    // Update HTML attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // Notify listeners
    if (window.STORE) {
      window.STORE.notify('lang_changed', lang);
    }
  }

  toggleLang() {
    const next = this.currentLang === 'en' ? 'ar' : 'en';
    this.setLang(next);
    return next;
  }

  t(key) {
    const dict = this.translations[this.currentLang] || this.translations.en;
    return dict[key] || this.translations.en[key] || key;
  }
}

window.I18N = new I18nManager();
