/**
 * KURO FANGS — INTERNATIONALIZATION (i18n)
 * Default Language: English (en) with full Arabic (ar) support
 */

class I18nManager {
  constructor() {
    this.STORAGE_KEY = 'kf_lang';
    // Default language is English (en) as requested
    this.currentLang = localStorage.getItem(this.STORAGE_KEY) || 'en';

    this.translations = {
      en: {
        brandName: 'Kuro Fangs',
        brandSub: 'Faculty of Dentistry — Year 3',
        searchPlaceholder: 'Search subjects, lectures, or topics...',
        navSubjects: 'Subjects (12)',
        navCalculator: 'GPA Calculator',
        navBookmarks: 'Bookmarks',
        navNotes: 'Notes',
        pointsSuffix: 'pts',

        // Hero
        heroTitle: 'Academic Subjects — Year 3 (12)',
        heroSubtitle: '',
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
        summaries: 'summaries',
        exams: 'exams',
        doctor: 'Doctor',
        academicHubs: 'ACADEMIC HUBS',
        studentTools: 'STUDENT TOOLS',
        sideNavSheets: 'Sheets & Lectures',
        sideNavVideos: 'Recordings & Videos',
        sideNavExams: 'Past Exams Archive',
        sideNavSummaries: 'Summaries & Reviews',
        sideNavQuestions: 'Question Bank',
        sideNavFlashcards: 'Interactive Flashcards',
        sideNavNotes: 'Clinical Notes',
        sideNavCalc: 'Exam Schedule',
        sideNavExamsSchedule: 'Exam Schedule',
        sideNavSaved: 'Bookmarks',
        studentRole: 'Dental Surgery Student',
        academicYear: 'Year 3 — Faculty of Dentistry',

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
        catSheetsDesc: 'Official university lectures and batch summaries (PDF)',
        catRecordings: 'Recordings & Video Lectures',
        catRecordingsDesc: 'Audio explanations and clinical lab demonstrations',
        catPastExams: 'Past Exam Papers',
        catPastExamsDesc: 'Previous midterm & final exam models with answer keys',
        catAiQuestions: 'AI-Generated Practice Bank',
        catAiQuestionsDesc: 'Interactive smart quiz questions with instant rationale',
        catDoctorNotes: 'Doctor Notes & Clinical Pearls',
        catDoctorNotesDesc: 'High-yield clinical focus points from teaching faculty',
        catSummaries: 'High-Yield Summaries',
        catSummariesDesc: 'Quick revision sheets and night-before-exam mindmaps',
        catFlashcards: 'Interactive Flashcards & Atlas',
        catFlashcardsDesc: 'Fast recall cards, clinical photographs, and radiographs',
        catFiles: 'Files, Slides & Extra Resources',
        catFilesDesc: 'Lecture presentation slides and recommended textbooks',

        // Notifications
        pointsEarned: 'Downloaded successfully! (+10 pts earned)'
      },
      ar: {
        brandName: 'Kuro Fangs',
        brandSub: 'كلية طب وجراحة الفم والأسنان — السنة الثالثة',
        searchPlaceholder: 'ابحث عن أي مادة أو شيت أو موضوع...',
        navSubjects: 'المواد (12)',
        navCalculator: 'حاسبة المعدل',
        navBookmarks: 'المفضلة',
        navNotes: 'ملاحظاتي',
        pointsSuffix: 'نقطة',

        // Hero
        heroTitle: 'المواد الدراسية — السنة الثالثة (12)',
        heroSubtitle: '',
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
        summaries: 'ملخصات',
        exams: 'امتحانات',
        doctor: 'الدكتور',
        academicHubs: 'الأقسام الأكاديمية',
        studentTools: 'أدوات الطالب',
        sideNavSheets: 'المحاضرات والشيتات',
        sideNavVideos: 'التسجيلات والشروحات',
        sideNavExams: 'أرشيف الامتحانات',
        sideNavSummaries: 'الملخصات المركزة',
        sideNavQuestions: 'بنك الأسئلة',
        sideNavFlashcards: 'البطاقات التعليمية',
        sideNavNotes: 'الملاحظات السريرية',
        sideNavCalc: 'جدول الامتحانات',
        sideNavExamsSchedule: 'جدول الامتحانات',
        sideNavSaved: 'المحفوظات',
        studentRole: 'طالب طب وجراحة الأسنان',
        academicYear: 'السنة الثالثة — كلية طب الأسنان',

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
        catDoctorNotes: 'ملاحظات وتفريغات الدكاترة',
        catDoctorNotesDesc: 'التنبيهات السريرية وأهم النقاط المركزة من هيئة التدريس',
        catSummaries: 'ملخصات المادة المركزة',
        catSummariesDesc: 'مذكرات المراجعة السريعة ومخططات ليلة الامتحان',
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
