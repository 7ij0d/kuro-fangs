/**
 * KURO FANGS — APPLICATION ENTRY POINT (ACADEMIA DESIGN SYSTEM)
 * Dark Sidebar (#1E1E2D), Multi-Language (EN/AR), Light/Dark Theme & Routing
 */


document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initialize Curriculum Data
  await window.DATA.init();

  // 2. Initialize Subject Modal & In-App Document Viewer
  if (window.SubjectModal && typeof window.SubjectModal.init === 'function') {
    window.SubjectModal.init();
  }
  if (window.DocumentViewer && typeof window.DocumentViewer.init === 'function') {
    window.DocumentViewer.init();
  }

  // 3. Setup Language & Direction Handler
  const applyLanguage = (lang) => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    const t = (k) => window.I18N.t(k);

    // Update Header Text Elements
    const searchInput = document.getElementById('header-search-input');
    if (searchInput) searchInput.placeholder = t('searchPlaceholder');

    // Language button text shows alternate language target
    const langBtnText = document.getElementById('lang-btn-text');
    if (langBtnText) {
      langBtnText.textContent = lang === 'en' ? 'AR' : 'EN';
    }

    // Update points pill
    const pointsEl = document.getElementById('header-points-text');
    if (pointsEl) {
      pointsEl.textContent = `${window.STORE.getPoints()} ${t('pointsSuffix')}`;
    }

    // Update Notifications Center texts & badge
    if (window.NotificationsCenter && typeof window.NotificationsCenter.updateUI === 'function') {
      window.NotificationsCenter.updateUI();
    }

    // Update Settings Menu texts & state
    if (window.SettingsMenu && typeof window.SettingsMenu.updateUI === 'function') {
      window.SettingsMenu.updateUI();
    }

    // Update Header Brand
    const isAr = lang === 'ar';
    const headerBrandName = document.getElementById('header-brand-name');
    if (headerBrandName) headerBrandName.textContent = isAr ? 'طالب كورو' : 'Kuro Student';

    // Update Auth header state
    if (window.AUTH && typeof window.AUTH.updateUI === 'function') {
      window.AUTH.updateUI();
    } else if (window.SupabaseAuth && typeof window.SupabaseAuth.updateUI === 'function') {
      window.SupabaseAuth.updateUI(window.SupabaseAuth.getUser());
    }

    // Update Dark Sidebar Elements
    const sideSub = document.getElementById('sidebar-brand-sub');
    if (sideSub) sideSub.textContent = t('brandSub');

    const secLearning = document.getElementById('side-sec-learning');
    if (secLearning) secLearning.textContent = t('sideSecLearning');

    const secMySpace = document.getElementById('side-sec-myspace');
    if (secMySpace) secMySpace.textContent = t('sideSecMySpace');

    const secMore = document.getElementById('side-sec-more');
    if (secMore) secMore.textContent = t('sideSecMore');

    const sideSubjects = document.getElementById('side-nav-subjects');
    if (sideSubjects) sideSubjects.textContent = t('navSubjects');

    const sideSheets = document.getElementById('side-nav-sheets');
    if (sideSheets) sideSheets.textContent = t('sideNavSheets');

    const sideVideos = document.getElementById('side-nav-videos');
    if (sideVideos) sideVideos.textContent = t('sideNavVideos');

    const sideExams = document.getElementById('side-nav-exams');
    if (sideExams) sideExams.textContent = t('sideNavExams');

    const sideQuestions = document.getElementById('side-nav-questions');
    if (sideQuestions) sideQuestions.textContent = t('sideNavQuestions');

    const sideFlashcards = document.getElementById('side-nav-flashcards');
    if (sideFlashcards) sideFlashcards.textContent = t('sideNavFlashcards');

    const sideNotes = document.getElementById('side-nav-notes');


    const sideLectureSchedule = document.getElementById('side-nav-lecture-schedule');
    if (sideLectureSchedule) sideLectureSchedule.textContent = t('sideNavLectureSchedule');

    const sidePracticalSchedule = document.getElementById('side-nav-practical-schedule');
    if (sidePracticalSchedule) sidePracticalSchedule.textContent = t('sideNavPracticalSchedule');

    const sideExamsSchedule = document.getElementById('side-nav-exams-schedule');
    if (sideExamsSchedule) sideExamsSchedule.textContent = t('sideNavExamsSchedule');

    const sideSaved = document.getElementById('side-nav-saved');


    const sideRewards = document.getElementById('side-nav-rewards');
    if (sideRewards) sideRewards.textContent = t('sideNavRewards');

    const sideSoonRewards = document.getElementById('side-soon-rewards');
    if (sideSoonRewards) sideSoonRewards.textContent = lang === 'ar' ? 'قريباً' : 'Soon';

    const sideGames = document.getElementById('side-nav-games');
    if (sideGames) sideGames.textContent = t('sideNavGames');

    const sideSoonGames = document.getElementById('side-soon-games');
    if (sideSoonGames) sideSoonGames.textContent = lang === 'ar' ? 'قريباً' : 'Soon';

    const sideAdmin = document.getElementById('side-nav-admin');
    if (sideAdmin) sideAdmin.textContent = t('sideNavAdmin');

    const sideUserSub = document.getElementById('sidebar-user-sub');
    if (sideUserSub) sideUserSub.textContent = t('academicYear');

    // Update Sidebar Quick Language text
    const sideLangBtnText = document.getElementById('side-lang-btn-text');
    if (sideLangBtnText) sideLangBtnText.textContent = lang === 'en' ? 'AR' : 'EN';

    // Update Top Navigation Center Pills & More Dropdown
    const navHome = document.getElementById('nav-item-home');
    if (navHome) navHome.textContent = isAr ? 'الرئيسية' : 'Home';
    const navSheets = document.getElementById('nav-item-sheets');
    if (navSheets) navSheets.textContent = isAr ? 'الشيتات' : 'Sheets';
    const navRecordings = document.getElementById('nav-item-recordings');
    if (navRecordings) navRecordings.textContent = isAr ? 'التسجيلات' : 'Recordings';
    const navQuestions = document.getElementById('nav-item-questions');
    if (navQuestions) navQuestions.textContent = isAr ? 'بنك الأسئلة' : 'Questions';
    const navSchedules = document.getElementById('nav-item-schedules');
    if (navSchedules) navSchedules.textContent = isAr ? 'الجداول' : 'Schedules';
    const navMore = document.getElementById('nav-item-more');
    if (navMore) navMore.textContent = isAr ? 'المزيد' : 'More';

    const moreSchedules = document.getElementById('more-item-schedules');
    if (moreSchedules) moreSchedules.textContent = isAr ? 'الجداول الدراسية' : 'Schedules';
    const moreProfile = document.getElementById('more-item-profile');
    if (moreProfile) moreProfile.textContent = isAr ? 'الملف الشخصي' : 'Student Profile';
    const moreSettings = document.getElementById('more-item-settings');
    if (moreSettings) moreSettings.textContent = isAr ? 'إعدادات المنصة' : 'Settings';
    const navRewards = document.getElementById('nav-item-rewards');
    if (navRewards) navRewards.textContent = isAr ? 'كورو والتخصيص' : 'Mascot Hub';
    const navGames = document.getElementById('nav-item-games');
    if (navGames) navGames.textContent = isAr ? 'ألعاب واستراحة' : 'Games';
    const navAdmin = document.getElementById('nav-item-admin');
    if (navAdmin) navAdmin.textContent = isAr ? 'بوابة الإدارة' : 'Admin Portal';

    const sideSchedules = document.getElementById('side-nav-schedules');
    if (sideSchedules) sideSchedules.textContent = isAr ? 'الجداول الدراسية' : 'Schedules';

    const sideStudyRooms = document.getElementById('side-nav-study-rooms');
    if (sideStudyRooms) sideStudyRooms.textContent = isAr ? 'غرف الدراسة' : 'Study Rooms';

    const navStudyRooms = document.getElementById('nav-item-study-rooms');
    if (navStudyRooms) navStudyRooms.textContent = isAr ? 'غرف الدراسة' : 'Study Rooms';

    const moreStudyRooms = document.getElementById('more-item-study-rooms');
    if (moreStudyRooms) moreStudyRooms.textContent = isAr ? 'غرف الدراسة' : 'Study Rooms';

    // Update Mobile Bottom Navigation Labels
    const mbiHome = document.getElementById('mbi-label-home');
    if (mbiHome) mbiHome.textContent = isAr ? 'الرئيسية' : 'Home';
    const mbiSheets = document.getElementById('mbi-label-sheets');
    if (mbiSheets) mbiSheets.textContent = isAr ? 'الشيتات' : 'Sheets';
    const mbiRecs = document.getElementById('mbi-label-recordings');
    if (mbiRecs) mbiRecs.textContent = isAr ? 'التسجيلات' : 'Recordings';
    const mbiQuestions = document.getElementById('mbi-label-questions');
    if (mbiQuestions) mbiQuestions.textContent = isAr ? 'الأسئلة' : 'Questions';
    const mbiRooms = document.getElementById('mbi-label-rooms');
    if (mbiRooms) mbiRooms.textContent = isAr ? 'الغرف' : 'Rooms';
    const mbiScheds = document.getElementById('mbi-label-schedules');
    if (mbiScheds) mbiScheds.textContent = isAr ? 'الجداول' : 'Schedules';
    const mbiMore = document.getElementById('mbi-label-more');
    if (mbiMore) mbiMore.textContent = isAr ? 'المزيد' : 'More';

    // Update Mobile "More" Bottom Sheet Texts
    const mmsTitle = document.getElementById('mms-sheet-title');
    if (mmsTitle) mmsTitle.textContent = isAr ? 'المزيد من الأقسام' : 'More Destinations';
    const mmsRooms = document.getElementById('mms-item-study-rooms');
    if (mmsRooms) mmsRooms.textContent = isAr ? 'غرف الدراسة' : 'Study Rooms';
    const mmsRoomsSub = document.getElementById('mms-sub-study-rooms');
    if (mmsRoomsSub) mmsRoomsSub.textContent = isAr ? 'مؤقت التركيز والدراسة الجماعية' : 'Focus timer & live group sessions';
    const mmsSched = document.getElementById('mms-item-schedules');
    if (mmsSched) mmsSched.textContent = isAr ? 'الجداول الدراسية' : 'Academic Schedules';
    const mmsSchedSub = document.getElementById('mms-sub-schedules');
    if (mmsSchedSub) mmsSchedSub.textContent = isAr ? 'المحاضرات والعيادات والامتحانات' : 'Lectures, clinics & official exams';

    const mmsSecTimetables = document.getElementById('mms-sec-timetables');
    if (mmsSecTimetables) mmsSecTimetables.textContent = isAr ? 'الجداول والامتحانات' : 'TIMETABLES & EXAMS';
    const mmsTheory = document.getElementById('mms-item-theory');
    if (mmsTheory) mmsTheory.textContent = isAr ? 'جدول المحاضرات النظرية' : 'Theory Lectures Schedule';
    const mmsPractical = document.getElementById('mms-item-practical');
    if (mmsPractical) mmsPractical.textContent = isAr ? 'جدول المعامل والعيادات' : 'Clinical & Lab Schedule';
    const mmsExams = document.getElementById('mms-item-exams');
    if (mmsExams) mmsExams.textContent = isAr ? 'جداول الامتحانات الرسمية' : 'Official Exam Schedules';

    const mmsSecPlatform = document.getElementById('mms-sec-platform');
    if (mmsSecPlatform) mmsSecPlatform.textContent = isAr ? 'المنصة والحساب' : 'PLATFORM & ACCOUNT';
    const mmsProfile = document.getElementById('mms-item-profile');
    if (mmsProfile) mmsProfile.textContent = isAr ? 'الملف الشخصي للطالب' : 'Student Profile';
    const mmsRewards = document.getElementById('mms-item-rewards');
    if (mmsRewards) mmsRewards.textContent = isAr ? 'شخصية كورو والمكافآت' : 'Fox Mascot Hub';
    const mmsGames = document.getElementById('mms-item-games');
    if (mmsGames) mmsGames.textContent = isAr ? 'ألعاب واستراحة' : 'Arcade & Games';
    const mmsSettings = document.getElementById('mms-item-settings');
    if (mmsSettings) mmsSettings.textContent = isAr ? 'إعدادات المنصة' : 'Platform Settings';
    const mmsAdmin = document.getElementById('mms-item-admin');
    if (mmsAdmin) mmsAdmin.textContent = isAr ? 'بوابة الإدارة' : 'Faculty Admin Portal';

    const mmsLangText = document.getElementById('mms-lang-text');
    if (mmsLangText) mmsLangText.textContent = isAr ? 'English (EN)' : 'العربية (AR)';
    const mmsThemeText = document.getElementById('mms-theme-text');
    if (mmsThemeText) mmsThemeText.textContent = isAr ? 'المظهر' : 'Theme';
    const mmsSoundText = document.getElementById('mms-sound-text');
    if (mmsSoundText) mmsSoundText.textContent = isAr ? 'الصوت' : 'Sound';
  };

  const initialLang = window.I18N.getLang();
  applyLanguage(initialLang);

  // 4. Setup Initial Theme
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    const isDark = (theme === 'kuro-dark' || theme === 'dark');
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
      themeIcon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
    }
    const sideThemeIcon = document.getElementById('side-theme-icon');
    if (sideThemeIcon) {
      sideThemeIcon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
    }
    const mmsThemeIcon = document.getElementById('mms-theme-icon');
    if (mmsThemeIcon) {
      mmsThemeIcon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
    }
    if (window.lucide) window.lucide.createIcons();
  };

  const initialTheme = window.STORE.getTheme();
  applyTheme(initialTheme);

  // 5. Setup Language Toggle Event Listeners (Header, Sidebar & Mobile More Sheet)
  const langToggleBtn = document.getElementById('lang-toggle-btn');
  const sideLangToggleBtn = document.getElementById('side-lang-toggle-btn');
  const mmsLangBtn = document.getElementById('mms-lang-btn');
  const handleLangToggle = () => {
    const newLang = window.I18N.toggleLang();
    applyLanguage(newLang);
    if (window.SoundFX) window.SoundFX.play('pop');
    window.ROUTER.handleRoute();
    updateGlobalMascotAvatars();
    if (window.lucide) window.lucide.createIcons();
  };
  if (langToggleBtn) langToggleBtn.addEventListener('click', handleLangToggle);
  if (sideLangToggleBtn) sideLangToggleBtn.addEventListener('click', handleLangToggle);
  if (mmsLangBtn) mmsLangBtn.addEventListener('click', handleLangToggle);

  // 6. Setup Theme Toggle Event Listeners (Header, Sidebar & Mobile More Sheet)
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const sideThemeToggleBtn = document.getElementById('side-theme-toggle-btn');
  const mmsThemeBtn = document.getElementById('mms-theme-btn');
  const handleThemeToggle = () => {
    const newTheme = window.STORE.toggleTheme();
    applyTheme(newTheme);
    if (window.SoundFX) window.SoundFX.play('switch');
  };
  if (themeToggleBtn) themeToggleBtn.addEventListener('click', handleThemeToggle);
  if (sideThemeToggleBtn) sideThemeToggleBtn.addEventListener('click', handleThemeToggle);
  if (mmsThemeBtn) mmsThemeBtn.addEventListener('click', handleThemeToggle);

  // 6.2. Setup Sound Effects Toggle Event Listeners
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const sideSoundToggleBtn = document.getElementById('side-sound-toggle-btn');
  const mmsSoundBtn = document.getElementById('mms-sound-btn');
  const updateSoundUI = (enabled) => {
    const soundIcon = document.getElementById('sound-icon');
    if (soundIcon) {
      soundIcon.setAttribute('data-lucide', enabled ? 'volume-2' : 'volume-x');
    }
    const sideSoundIcon = document.getElementById('side-sound-icon');
    if (sideSoundIcon) {
      sideSoundIcon.setAttribute('data-lucide', enabled ? 'volume-2' : 'volume-x');
    }
    const mmsSoundIcon = document.getElementById('mms-sound-icon');
    if (mmsSoundIcon) {
      mmsSoundIcon.setAttribute('data-lucide', enabled ? 'volume-2' : 'volume-x');
    }
    if (window.lucide) window.lucide.createIcons();

    if (soundToggleBtn) {
      soundToggleBtn.setAttribute('data-sound-active', enabled ? 'true' : 'false');
      soundToggleBtn.style.opacity = enabled ? '1' : '0.55';
    }
    if (sideSoundToggleBtn) {
      sideSoundToggleBtn.setAttribute('data-sound-active', enabled ? 'true' : 'false');
      sideSoundToggleBtn.style.opacity = enabled ? '1' : '0.55';
    }
    if (mmsSoundBtn) {
      mmsSoundBtn.setAttribute('data-sound-active', enabled ? 'true' : 'false');
      mmsSoundBtn.style.opacity = enabled ? '1' : '0.65';
    }
  };

  const handleSoundToggle = () => {
    if (window.SoundFX) {
      const newState = window.SoundFX.toggle();
      updateSoundUI(newState);
      if (window.Toast) {
        const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
        window.Toast.show(
          newState 
            ? (isAr ? 'تم تفعيل المؤثرات الصوتية 🔊' : 'Sound Effects Enabled 🔊') 
            : (isAr ? 'تم كتم المؤثرات الصوتية 🔇' : 'Sound Effects Muted 🔇'),
          'info'
        );
      }
    }
  };

  if (soundToggleBtn) {
    if (window.SoundFX) updateSoundUI(window.SoundFX.isEnabled());
    soundToggleBtn.addEventListener('click', handleSoundToggle);
  }
  if (sideSoundToggleBtn) {
    sideSoundToggleBtn.addEventListener('click', handleSoundToggle);
  }
  if (mmsSoundBtn) {
    if (window.SoundFX) updateSoundUI(window.SoundFX.isEnabled());
    mmsSoundBtn.addEventListener('click', handleSoundToggle);
  }

  window.addEventListener('kf:sound-toggle', (e) => {
    if (e.detail) updateSoundUI(e.detail.enabled);
  });

  // 6.3. Setup Header Center More Dropdown Controls
  const headerMoreWrap = document.getElementById('header-more-dropdown-wrap');
  const headerMoreBtn = document.getElementById('header-more-btn');

  if (headerMoreBtn && headerMoreWrap) {
    headerMoreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      headerMoreWrap.classList.toggle('open');
      const isExpanded = headerMoreWrap.classList.contains('open');
      headerMoreBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
      if (!headerMoreWrap.contains(e.target)) {
        headerMoreWrap.classList.remove('open');
        headerMoreBtn.setAttribute('aria-expanded', 'false');
      }
    });

    headerMoreWrap.querySelectorAll('.header-dropdown-item').forEach(link => {
      link.addEventListener('click', () => {
        headerMoreWrap.classList.remove('open');
        headerMoreBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 6.5. Setup Global Header Search Bar (works on all pages)
  const globalSearchInput = document.getElementById('header-search-input');
  let globalSearchDebounce = null;
  if (globalSearchInput) {
    globalSearchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim();
      if (globalSearchDebounce) clearTimeout(globalSearchDebounce);
      globalSearchDebounce = setTimeout(() => {
        const currentPath = window.location.hash.slice(1).split('?')[0] || '/';
        if (q.length >= 2) {
          if (currentPath === '/' && window.HomePage && typeof window.HomePage.searchQuery !== 'undefined') {
            window.HomePage.searchQuery = q;
            if (typeof window.HomePage.renderSubjectsList === 'function') {
              window.HomePage.renderSubjectsList(window.DATA.getSubjects(), false);
            }
          } else {
            window.navigate('/search?q=' + encodeURIComponent(q));
          }
        } else if (q.length === 0 && currentPath === '/') {
          if (window.HomePage) window.HomePage.searchQuery = '';
        }
      }, 350);
    });

    globalSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = globalSearchInput.value.trim();
        if (q.length >= 1) {
          globalSearchInput.blur();
          if (siteHeaderEl) siteHeaderEl.classList.remove('mobile-search-open');
          if (mobileSearchToggleBtn) mobileSearchToggleBtn.setAttribute('aria-expanded', 'false');
          window.navigate('/search?q=' + encodeURIComponent(q));
        }
      } else if (e.key === 'Escape') {
        globalSearchInput.blur();
        if (siteHeaderEl) siteHeaderEl.classList.remove('mobile-search-open');
        if (mobileSearchToggleBtn) mobileSearchToggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 6.6. Setup Mobile Expandable Search Row Toggle
  const siteHeaderEl = document.getElementById('site-header');
  const mobileSearchToggleBtn = document.getElementById('mobile-search-toggle-btn');
  const mobileSearchCloseBtn = document.getElementById('mobile-search-close-btn');

  const closeMobileSearch = () => {
    if (siteHeaderEl) siteHeaderEl.classList.remove('mobile-search-open');
    if (mobileSearchToggleBtn) mobileSearchToggleBtn.setAttribute('aria-expanded', 'false');
  };

  if (mobileSearchToggleBtn && siteHeaderEl) {
    mobileSearchToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = siteHeaderEl.classList.toggle('mobile-search-open');
      mobileSearchToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (isOpen && globalSearchInput) {
        setTimeout(() => globalSearchInput.focus(), 40);
      }
    });
  }

  if (mobileSearchCloseBtn) {
    mobileSearchCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (globalSearchInput && globalSearchInput.value) {
        globalSearchInput.value = '';
        globalSearchInput.dispatchEvent(new Event('input'));
      }
      closeMobileSearch();
    });
  }

  document.addEventListener('click', (e) => {
    if (siteHeaderEl && siteHeaderEl.classList.contains('mobile-search-open')) {
      const searchBoxEl = document.getElementById('header-search-box');
      if (searchBoxEl && !searchBoxEl.contains(e.target) && (!mobileSearchToggleBtn || !mobileSearchToggleBtn.contains(e.target))) {
        closeMobileSearch();
      }
    }
  });

  // 6.7. Setup Mobile "More" Bottom Sheet Controls
  const mobileMoreBtn = document.getElementById('mobile-bottom-more-btn');
  const mobileMoreSheet = document.getElementById('mobile-more-sheet');
  const mobileMoreBackdrop = document.getElementById('mobile-more-backdrop');
  const mobileMoreCloseBtn = document.getElementById('mobile-more-close-btn');

  const openMobileMoreSheet = () => {
    if (mobileMoreSheet) {
      mobileMoreSheet.classList.add('open');
      mobileMoreSheet.setAttribute('aria-hidden', 'false');
    }
    if (mobileMoreBackdrop) {
      mobileMoreBackdrop.classList.add('open');
      mobileMoreBackdrop.setAttribute('aria-hidden', 'false');
    }
    if (mobileMoreBtn) {
      mobileMoreBtn.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMoreSheet = () => {
    if (mobileMoreSheet) {
      mobileMoreSheet.classList.remove('open');
      mobileMoreSheet.setAttribute('aria-hidden', 'true');
    }
    if (mobileMoreBackdrop) {
      mobileMoreBackdrop.classList.remove('open');
      mobileMoreBackdrop.setAttribute('aria-hidden', 'true');
    }
    if (mobileMoreBtn) {
      mobileMoreBtn.setAttribute('aria-expanded', 'false');
    }
    if (!sidebarEl || !sidebarEl.classList.contains('open')) {
      document.body.style.overflow = '';
    }
  };

  if (mobileMoreBtn) {
    mobileMoreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (mobileMoreSheet && mobileMoreSheet.classList.contains('open')) {
        closeMobileMoreSheet();
      } else {
        closeMobileSidebar();
        openMobileMoreSheet();
      }
    });
  }

  if (mobileMoreCloseBtn) {
    mobileMoreCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMobileMoreSheet();
    });
  }

  if (mobileMoreBackdrop) {
    mobileMoreBackdrop.addEventListener('click', closeMobileMoreSheet);
  }

  if (mobileMoreSheet) {
    mobileMoreSheet.querySelectorAll('a[href]').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMoreSheet();
      });
    });
  }

  // 6.8. Mobile Virtual Keyboard Handling (Avoid covering inputs with bottom nav)
  document.addEventListener('focusin', (e) => {
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) {
      const type = (t.getAttribute('type') || 'text').toLowerCase();
      if (!['checkbox', 'radio', 'button', 'submit', 'range', 'file'].includes(type)) {
        if (window.innerWidth <= 960) {
          document.body.classList.add('mobile-keyboard-open');
        }
      }
    }
  });

  document.addEventListener('focusout', () => {
    setTimeout(() => {
      const a = document.activeElement;
      const isTextFocus = a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.tagName === 'SELECT' || a.isContentEditable);
      if (!isTextFocus) {
        document.body.classList.remove('mobile-keyboard-open');
      }
    }, 120);
  });

  // 7. Setup Mobile Sidebar Drawer Controls
  const sidebarEl = document.getElementById('app-sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
  const sidebarCloseBtn = document.getElementById('sidebar-close-btn');

  const openMobileSidebar = () => {
    closeMobileMoreSheet();
    if (sidebarEl) {
      sidebarEl.classList.add('open');
      sidebarEl.setAttribute('aria-hidden', 'false');
    }
    if (sidebarBackdrop) {
      sidebarBackdrop.classList.add('open');
      sidebarBackdrop.setAttribute('aria-hidden', 'false');
    }
    if (sidebarToggleBtn) {
      sidebarToggleBtn.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden';

    // Shift focus to close button for keyboard & accessibility
    setTimeout(() => {
      if (sidebarCloseBtn) sidebarCloseBtn.focus();
    }, 50);
  };

  const closeMobileSidebar = () => {
    if (sidebarEl) {
      sidebarEl.classList.remove('open');
      sidebarEl.setAttribute('aria-hidden', 'true');
    }
    if (sidebarBackdrop) {
      sidebarBackdrop.classList.remove('open');
      sidebarBackdrop.setAttribute('aria-hidden', 'true');
    }
    if (sidebarToggleBtn) {
      sidebarToggleBtn.setAttribute('aria-expanded', 'false');
    }
    if (!mobileMoreSheet || !mobileMoreSheet.classList.contains('open')) {
      document.body.style.overflow = '';
    }
  };

  if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openMobileSidebar();
    });
  }

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMobileSidebar();
    });
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeMobileSidebar);
  }

  // Prevent clicks inside the sidebar drawer from bubbling to backdrop or window
  if (sidebarEl) {
    sidebarEl.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Close drawer or More sheet on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (sidebarEl && sidebarEl.classList.contains('open')) {
        closeMobileSidebar();
      }
      if (mobileMoreSheet && mobileMoreSheet.classList.contains('open')) {
        closeMobileMoreSheet();
      }
    }
  });

  // Auto-close drawer on navigation click for mobile & tablet (< 1200px)
  if (sidebarEl) {
    sidebarEl.querySelectorAll('.sidebar-menu-item, .sidebar-brand, .sidebar-user-card, .sidebar-admin-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 1200 || window.matchMedia('(pointer: coarse)').matches) {
          closeMobileSidebar();
        }
      });
    });
  }

  // Close header More dropdown on click outside
  document.addEventListener('click', (e) => {
    const moreWrap = document.getElementById('header-more-dropdown-wrap');
    if (moreWrap && !moreWrap.contains(e.target)) {
      moreWrap.classList.remove('open');
    }
  });

  // 8. Register Routes
  const router = window.ROUTER;

  router.register('/login', (c, q) => {
    if (window.LoginPage && typeof window.LoginPage.render === 'function') {
      window.LoginPage.render(c, q);
    }
  });
  router.register('/', (c, q) => window.HomePage.render(c, q));
  router.register('/subjects', (c, q) => {
    window.location.hash = '#/sheets';
  });
  router.register('/sheets', (c, q) => window.SheetsPage.render(c, q));
  router.register('/sheet-detail', (c, q) => window.SheetDetailPage.render(c, q));
  router.register('/sheet/:id', (c, id, q) => window.SheetDetailPage.render(c, id, q));
  router.register('/recordings', (c, q) => window.RecordingsPage ? window.RecordingsPage.render(c, q) : window.SecondaryPages.renderAudioRecordings(c, q));
  router.register('/videos', (c, q) => window.RecordingsPage ? window.RecordingsPage.render(c, q) : window.SecondaryPages.renderAudioRecordings(c, q));
  router.register('/lecture-schedule', (c, q) => {
    if (window.ExamsPage) {
      window.ExamsPage.academicTab = 'theory';
      if (typeof window.ExamsPage.renderAcademicSchedules === 'function') {
        window.ExamsPage.renderAcademicSchedules(c, q);
      } else {
        window.ExamsPage.render(c, q);
      }
    }
  });
  router.register('/practical-schedule', (c, q) => {
    if (window.ExamsPage) {
      window.ExamsPage.academicTab = 'practical';
      if (typeof window.ExamsPage.renderAcademicSchedules === 'function') {
        window.ExamsPage.renderAcademicSchedules(c, q);
      } else {
        window.ExamsPage.render(c, q);
      }
    }
  });
  router.register('/schedules', (c, q) => {
    if (window.ExamsPage && typeof window.ExamsPage.renderSchedulesHub === 'function') {
      window.ExamsPage.renderSchedulesHub(c, q);
    } else if (window.ExamsPage) {
      window.ExamsPage.render(c, q);
    }
  });
  router.register('/exams', (c, q) => {
    if (window.ExamsPage && typeof window.ExamsPage.renderExamsSchedule === 'function') {
      window.ExamsPage.renderExamsSchedule(c, q);
    } else if (window.ExamsPage) {
      window.ExamsPage.render(c, q);
    }
  });
  router.register('/quizzes', (c, q) => window.QuizzesPage.render(c, q));
  router.register('/questions', (c, q) => window.QuestionsPage.render(c, q));
  // Redirect legacy routes to unified questions page
  router.register('/flashcards', (c, q) => window.QuestionsPage.render(c, q));
  router.register('/previous-years', (c, q) => window.QuestionsPage.render(c, q));


  router.register('/profile', (c, q) => {
    if (window.ProfilePage && typeof window.ProfilePage.render === 'function') {
      window.ProfilePage.render(c, q);
    } else if (window.SecondaryPages && typeof window.SecondaryPages.renderProfile === 'function') {
      window.SecondaryPages.renderProfile(c, q);
    }
  });
  router.register('/settings', (c, q) => {
    if (window.SettingsPage && typeof window.SettingsPage.render === 'function') {
      window.SettingsPage.render(c, q);
    }
  });
  router.register('/rewards', (c, q) => window.SecondaryPages.renderRewards(c, q));
  router.register('/alerts', (c, q) => window.SecondaryPages.renderAlerts(c, q));
  router.register('/search', (c, q) => window.SecondaryPages.renderSearch(c, q));
  router.register('/admin', (c, q) => window.AdminPage.render(c, q));
  router.register('/study-rooms', async (c, q) => {
    if (window.StudyRoomsPage && typeof window.StudyRoomsPage.render === 'function') {
      await window.StudyRoomsPage.render(c, q);
    }
  });
  router.register('/games', async (c, q) => {
    if (window.GamesPage && typeof window.GamesPage.render === 'function') {
      await window.GamesPage.render(c, q);
    } else if (typeof window.renderGames === 'function') {
      await window.renderGames(c, q);
    } else {
      try {
        const mod = await import('./pages/games.js');
        const renderGames = mod?.default || window.GamesPage?.render || window.renderGames;
        if (renderGames) await renderGames(c, q);
      } catch (e) {
        if (window.GamesPage && typeof window.GamesPage.render === 'function') {
          await window.GamesPage.render(c, q);
        }
      }
    }
  });

  // 9. Global Mascot & User Avatars Synchronization
  const updateGlobalMascotAvatars = () => {
    const charImg = (window.CharacterThemeSystem && window.CharacterThemeSystem.getAsset('idle')) || 'assets/characters/kuro/Kuro-Idle.png';
    const isEn = window.I18N && window.I18N.getLang() === 'en';
    const charName = isEn ? 'Kuro' : 'كورو';

    let customAvatar = null;
    let customName = null;
    try {
      const userInfo = JSON.parse(localStorage.getItem('kf_user_info') || '{}');
      if (userInfo.avatar) customAvatar = userInfo.avatar;
      if (userInfo.name && userInfo.name !== 'طالب أسنان' && userInfo.name !== 'Dental Student') {
        customName = userInfo.name;
      }
    } catch (e) {}

    // 1.0 Sidebar Brand Emblem Avatar
    const sideBrandAvatar = document.getElementById('sidebar-brand-avatar-img');
    if (sideBrandAvatar) {
      sideBrandAvatar.src = charImg;
      sideBrandAvatar.alt = charName;
    }

    // 1. Sidebar user avatar
    const sideAvatar = document.getElementById('sidebar-user-avatar-img');
    if (sideAvatar) {
      if (customAvatar) {
        sideAvatar.src = customAvatar;
        sideAvatar.style.objectFit = 'cover';
        sideAvatar.style.borderRadius = '50%';
      } else {
        sideAvatar.src = charImg;
        sideAvatar.style.objectFit = 'contain';
        sideAvatar.style.borderRadius = '';
      }
      sideAvatar.alt = customName || charName;
    }

    // 1.1 Sidebar user name
    if (customName) {
      const sideName = document.querySelector('.sidebar-user-name');
      if (sideName) sideName.textContent = customName;
    }

    // 2. Sidebar Mascot Subtle Watermark
    const sideWatermark = document.getElementById('sidebar-watermark-img');
    if (sideWatermark) {
      sideWatermark.src = charImg;
    }

    // 3. Header Mascot / User Avatar Button
    const headerAvatar = document.getElementById('header-mascot-avatar-img');
    if (headerAvatar) {
      if (customAvatar) {
        headerAvatar.src = customAvatar;
        headerAvatar.style.objectFit = 'cover';
        headerAvatar.style.borderRadius = '50%';
      } else {
        headerAvatar.src = charImg;
        headerAvatar.style.objectFit = 'contain';
        headerAvatar.style.borderRadius = '';
      }
      headerAvatar.alt = customName || charName;
    }

    // 4. Any other on-screen current mascot images (profile, rewards, etc.)
    document.querySelectorAll('.current-mascot-img').forEach(img => {
      img.src = charImg;
      img.alt = charName;
    });
  };

  window.updateGlobalMascotAvatars = updateGlobalMascotAvatars;

  // 10. Synchronize Points, Themes & Mascot Skins
  window.STORE.subscribe((event, data) => {
    if (event === 'points_changed') {
      const pointsEl = document.getElementById('header-points-text');
      if (pointsEl) {
        pointsEl.textContent = `${window.STORE.getPoints()} ${window.I18N.t('pointsSuffix')}`;
      }
    }
    if (event === 'theme_changed') {
      applyTheme(data);
    }
    if (event === 'skin_equipped' || event === 'skins_changed' || event === 'skin_unlocked') {
      updateGlobalMascotAvatars();
    }
  });

  // 11. Update Active Nav Links on route change
  const updateActiveSidebarNav = (path) => {
    const normalizedPath = path || '/';
    document.querySelectorAll('.sidebar-menu-item').forEach(btn => {
      const target = btn.getAttribute('data-route') || btn.getAttribute('href')?.replace('#', '');
      if (target === normalizedPath) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update Top Header Nav Pills
    const scheduleSubRoutes = ['/schedules', '/lecture-schedule', '/practical-schedule', '/exams'];
    const headerMoreRoutes = ['/rewards', '/games', '/admin', '/settings'];
    document.querySelectorAll('.header-nav-pill').forEach(pill => {
      const target = pill.getAttribute('data-route') || pill.getAttribute('href')?.replace('#', '');
      if (target && (target === normalizedPath || (target === '/' && (normalizedPath === '' || normalizedPath === '/')))) {
        pill.classList.add('active');
      } else if (target === '/sheets' && normalizedPath.startsWith('/sheet')) {
        pill.classList.add('active');
      } else if (target === '/schedules' && scheduleSubRoutes.includes(normalizedPath)) {
        pill.classList.add('active');
      } else if (pill.id === 'header-more-btn' && headerMoreRoutes.includes(normalizedPath)) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    // Update Mobile Bottom Nav Items
    const moreRoutes = ['/study-rooms', '/schedules', '/lecture-schedule', '/practical-schedule', '/exams', '/rewards', '/games', '/profile', '/settings', '/admin'];
    document.querySelectorAll('.mobile-bottom-item[data-route]').forEach(item => {
      const target = item.getAttribute('data-route');
      if (target === normalizedPath || (target === '/' && (normalizedPath === '' || normalizedPath === '/'))) {
        item.classList.add('active');
      } else if (target === '/sheets' && normalizedPath.startsWith('/sheet')) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    if (mobileMoreBtn) {
      if (moreRoutes.includes(normalizedPath)) {
        mobileMoreBtn.classList.add('active');
      } else {
        mobileMoreBtn.classList.remove('active');
      }
    }

    // Update Mobile More Sheet Items
    document.querySelectorAll('.mms-featured-card[data-route], .mms-list-item[data-route]').forEach(link => {
      const target = link.getAttribute('data-route');
      if (target === normalizedPath) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Also close mobile drawer, More sheet, and expandable search on navigation
    closeMobileSidebar();
    closeMobileMoreSheet();
    closeMobileSearch();
  };

  window.addEventListener('hashchange', () => {
    const p = window.location.hash.slice(1).split('?')[0] || '/';
    updateActiveSidebarNav(p);
    updateGlobalMascotAvatars();
  });

  // 12. Handle Initial Route, Notifications Center & Mascot Sync
  updateGlobalMascotAvatars();
  if (window.NotificationsCenter && typeof window.NotificationsCenter.init === 'function') {
    window.NotificationsCenter.init();
  }
  if (window.SettingsMenu && typeof window.SettingsMenu.init === 'function') {
    window.SettingsMenu.init();
  }
  if (window.AUTH && typeof window.AUTH.init === 'function') {
    try {
      await window.AUTH.init();
    } catch (e) {
      console.warn('[App] Auth init note:', e);
    }
  }
  router.handleRoute();
  updateActiveSidebarNav(window.location.hash.slice(1).split('?')[0] || '/');
});

