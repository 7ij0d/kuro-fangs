/**
 * KURO FANGS — APPLICATION ENTRY POINT (ACADEMIA DESIGN SYSTEM)
 * Dark Sidebar (#1E1E2D), Multi-Language (EN/AR), Light/Dark Theme & Routing
 */

// Global Lucide Icons debouncer: batches multiple rapid icon creations to one animation frame
(function setupLucideDebouncer() {
  if (window.lucide && typeof window.lucide.createIcons === 'function' && !window.lucide._debounced) {
    const origCreateIcons = window.lucide.createIcons.bind(window.lucide);
    let lucideRafId = null;
    window.lucide.createIcons = function(options) {
      if (lucideRafId) cancelAnimationFrame(lucideRafId);
      lucideRafId = requestAnimationFrame(() => {
        origCreateIcons(options);
        lucideRafId = null;
      });
    };
    window.lucide._debounced = true;
  }
})();

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

    // Update Header Navigation Pill Texts
    const isAr = lang === 'ar';
    const navHome = document.getElementById('nav-item-home');
    if (navHome) navHome.textContent = isAr ? 'الرئيسية' : 'Home';
    const navSubj = document.getElementById('nav-item-subjects');
    if (navSubj) navSubj.textContent = isAr ? 'المواد' : 'Subjects';
    const navSched = document.getElementById('nav-item-schedule');
    if (navSched) navSched.textContent = isAr ? 'الجدول' : 'Schedule';
    const navExams = document.getElementById('nav-item-exams');
    if (navExams) navExams.textContent = isAr ? 'الامتحانات' : 'Exams';
    const navMore = document.getElementById('nav-item-more');
    if (navMore) navMore.textContent = isAr ? 'المزيد' : 'More';
    const headerBrandName = document.getElementById('header-brand-name');
    if (headerBrandName) headerBrandName.textContent = isAr ? 'طالب كورو' : 'Kuro Student';

    // Update Auth header state
    if (window.SupabaseAuth && typeof window.SupabaseAuth.updateUI === 'function') {
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

    // Update Mobile Bottom Nav & More Sheet
    const mobHome = document.getElementById('mob-nav-home');
    if (mobHome) mobHome.textContent = isAr ? 'الرئيسية' : 'Home';
    const mobSheets = document.getElementById('mob-nav-sheets');
    if (mobSheets) mobSheets.textContent = isAr ? 'الشيتات' : 'Sheets';
    const mobRecordings = document.getElementById('mob-nav-recordings');
    if (mobRecordings) mobRecordings.textContent = isAr ? 'التسجيلات' : 'Audio';
    const mobQuestions = document.getElementById('mob-nav-questions');
    if (mobQuestions) mobQuestions.textContent = isAr ? 'الأسئلة' : 'Questions';
    const mobMore = document.getElementById('mob-nav-more');
    if (mobMore) mobMore.textContent = isAr ? 'المزيد' : 'More';

    // Mobile More Sheet texts
    const mobMoreTitle = document.getElementById('mobile-more-title');
    if (mobMoreTitle) mobMoreTitle.textContent = isAr ? 'مركز كورو والأدوات' : 'Kuro Hub & Tools';
    const mobMoreSub = document.getElementById('mobile-more-sub');
    if (mobMoreSub) mobMoreSub.textContent = isAr ? 'طب وجراحة الفم والأسنان • السنة الثالثة' : 'Dentistry • Year 3';

    const mobLangBtnText = document.getElementById('mob-lang-btn-text');
    if (mobLangBtnText) mobLangBtnText.textContent = lang === 'en' ? 'AR' : 'EN';

    const mobGroupAcademic = document.getElementById('mob-group-academic');
    if (mobGroupAcademic) mobGroupAcademic.textContent = isAr ? 'الدراسة والأكاديميا' : 'Study & Academic';
    const mobLinkTheory = document.getElementById('mob-link-theory');
    if (mobLinkTheory) mobLinkTheory.textContent = isAr ? 'جدول المحاضرات النظري' : 'Theory Schedule';
    const mobDescTheory = document.getElementById('mob-desc-theory');
    if (mobDescTheory) mobDescTheory.textContent = isAr ? 'مواعيد المحاضرات والقاعات' : 'Lectures & Auditorium';

    const mobLinkPractical = document.getElementById('mob-link-practical');
    if (mobLinkPractical) mobLinkPractical.textContent = isAr ? 'جدول المعامل والعيادات' : 'Clinical & Lab Schedule';
    const mobDescPractical = document.getElementById('mob-desc-practical');
    if (mobDescPractical) mobDescPractical.textContent = isAr ? 'العيادات ومعامل الفانتوم' : 'Clinics & Phantom Lab';

    const mobLinkExams = document.getElementById('mob-link-exams');
    if (mobLinkExams) mobLinkExams.textContent = isAr ? 'جداول الامتحانات الرسمية' : 'Official Exam Schedule';
    const mobDescExams = document.getElementById('mob-desc-exams');
    if (mobDescExams) mobDescExams.textContent = isAr ? 'امتحانات الجزئي والنهائي' : 'Midterms & Finals';

    const mobGroupKuro = document.getElementById('mob-group-kuro');
    if (mobGroupKuro) mobGroupKuro.textContent = isAr ? 'كورو الترفيهي' : 'Kuro Mascot';
    const mobLinkRewards = document.getElementById('mob-link-rewards');
    if (mobLinkRewards) mobLinkRewards.textContent = isAr ? 'مركز المظهر والجوائز' : 'Mascot Hub';
    const mobDescRewards = document.getElementById('mob-desc-rewards');
    if (mobDescRewards) mobDescRewards.textContent = isAr ? 'تخصيص شخصية كورو' : 'Skins & Outfits';

    const mobLinkGames = document.getElementById('mob-link-games');
    if (mobLinkGames) mobLinkGames.textContent = isAr ? 'ألعاب واستراحة دراسية' : 'Arcade & Games';
    const mobDescGames = document.getElementById('mob-desc-games');
    if (mobDescGames) mobDescGames.textContent = isAr ? 'ألعاب تدريب وتسلية' : 'Study Break Minigames';

    const mobGroupAccount = document.getElementById('mob-group-account');
    if (mobGroupAccount) mobGroupAccount.textContent = isAr ? 'الحساب والإدارة' : 'Account & Administration';
    const mobLinkProfile = document.getElementById('mob-link-profile');
    if (mobLinkProfile) mobLinkProfile.textContent = isAr ? 'الملف الشخصي والإعدادات' : 'Profile & Settings';
    const mobDescProfile = document.getElementById('mob-desc-profile');
    if (mobDescProfile) mobDescProfile.textContent = isAr ? 'إعدادات الحساب والمظهر' : 'Preferences & Info';

    const mobLinkAdmin = document.getElementById('mob-link-admin');
    if (mobLinkAdmin) mobLinkAdmin.textContent = isAr ? 'بوابة إدارة الكلية' : 'Faculty Admin Portal';
    const mobDescAdmin = document.getElementById('mob-desc-admin');
    if (mobDescAdmin) mobDescAdmin.textContent = isAr ? 'إدارة الشيتات والمحتوى' : 'Sheet & Catalog Management';

    const mobSoonRewards = document.getElementById('mob-soon-rewards');
    if (mobSoonRewards) mobSoonRewards.textContent = isAr ? 'قريباً' : 'Soon';
    const mobSoonGames = document.getElementById('mob-soon-games');
    if (mobSoonGames) mobSoonGames.textContent = isAr ? 'قريباً' : 'Soon';
  };

  const initialLang = window.I18N.getLang();
  applyLanguage(initialLang);

  // 4. Setup Initial Theme
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
      themeIcon.setAttribute('data-lucide', (theme === 'kuro-dark' || theme === 'dark') ? 'sun' : 'moon');
    }
    const mobThemeIcon = document.getElementById('mob-theme-icon');
    const mobThemeText = document.getElementById('mob-theme-text');
    const isDark = (theme === 'kuro-dark' || theme === 'dark');
    if (mobThemeIcon) mobThemeIcon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
    if (mobThemeText) mobThemeText.textContent = isDark ? (window.I18N?.getLang() === 'ar' ? 'فاتح' : 'Light') : (window.I18N?.getLang() === 'ar' ? 'داكن' : 'Dark');
    if (window.lucide) window.lucide.createIcons();
  };

  const initialTheme = window.STORE.getTheme();
  applyTheme(initialTheme);

  // 5. Setup Language Toggle Event Listener
  const langToggleBtn = document.getElementById('lang-toggle-btn');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      const newLang = window.I18N.toggleLang();
      applyLanguage(newLang);
      if (window.SoundFX) window.SoundFX.play('pop');
      // Re-render current page
      window.ROUTER.handleRoute();
      updateGlobalMascotAvatars();
      if (window.lucide) window.lucide.createIcons();
    });
  }

  // 6. Setup Theme Toggle Event Listener
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const newTheme = window.STORE.toggleTheme();
      applyTheme(newTheme);
      if (window.SoundFX) window.SoundFX.play('switch');
    });
  }

  // 6.2. Setup Sound Effects Toggle Event Listener
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const updateSoundUI = (enabled) => {
    const soundIcon = document.getElementById('sound-icon');
    if (soundIcon) {
      soundIcon.setAttribute('data-lucide', enabled ? 'volume-2' : 'volume-x');
    }
    const mobSoundIcon = document.getElementById('mob-sound-icon');
    const mobSoundText = document.getElementById('mob-sound-text');
    if (mobSoundIcon) mobSoundIcon.setAttribute('data-lucide', enabled ? 'volume-2' : 'volume-x');
    if (mobSoundText) mobSoundText.textContent = enabled ? (window.I18N?.getLang() === 'ar' ? 'مفعّل' : 'On') : (window.I18N?.getLang() === 'ar' ? 'مكتوم' : 'Mute');
    if (window.lucide) window.lucide.createIcons();

    if (soundToggleBtn) {
      soundToggleBtn.setAttribute('data-sound-active', enabled ? 'true' : 'false');
      soundToggleBtn.style.opacity = enabled ? '1' : '0.55';
    }
  };

  if (soundToggleBtn) {
    if (window.SoundFX) {
      updateSoundUI(window.SoundFX.isEnabled());
    }
    soundToggleBtn.addEventListener('click', () => {
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
    });
  }

  window.addEventListener('kf:sound-toggle', (e) => {
    if (e.detail) updateSoundUI(e.detail.enabled);
  });

  // 6.3. Setup Mobile More Bottom Sheet Controls
  const moreTrigger = document.getElementById('mobile-more-trigger');
  const moreBackdrop = document.getElementById('mobile-more-sheet-backdrop');
  const moreCloseBtn = document.getElementById('mobile-more-close-btn');
  const moreSheet = document.getElementById('mobile-more-sheet');

  const openMobileMoreSheet = () => {
    if (moreBackdrop) moreBackdrop.classList.add('open');
    if (moreSheet) moreSheet.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (window.lucide) window.lucide.createIcons();
  };

  const closeMobileMoreSheet = () => {
    if (moreBackdrop) moreBackdrop.classList.remove('open');
    if (moreSheet) moreSheet.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (moreTrigger) moreTrigger.addEventListener('click', openMobileMoreSheet);
  if (moreCloseBtn) moreCloseBtn.addEventListener('click', closeMobileMoreSheet);
  if (moreBackdrop) {
    moreBackdrop.addEventListener('click', (e) => {
      if (e.target === moreBackdrop) closeMobileMoreSheet();
    });
  }

  // Mobile More quick setting buttons
  const mobLangBtn = document.getElementById('mob-lang-toggle-btn');
  if (mobLangBtn) {
    mobLangBtn.addEventListener('click', () => {
      const newLang = window.I18N.toggleLang();
      applyLanguage(newLang);
      if (window.SoundFX) window.SoundFX.play('pop');
      window.ROUTER.handleRoute();
      updateGlobalMascotAvatars();
      if (window.lucide) window.lucide.createIcons();
    });
  }

  const mobThemeBtn = document.getElementById('mob-theme-toggle-btn');
  if (mobThemeBtn) {
    mobThemeBtn.addEventListener('click', () => {
      const newTheme = window.STORE.toggleTheme();
      applyTheme(newTheme);
      if (window.SoundFX) window.SoundFX.play('switch');
    });
  }

  const mobSoundBtn = document.getElementById('mob-sound-toggle-btn');
  if (mobSoundBtn) {
    mobSoundBtn.addEventListener('click', () => {
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
    });
  }

  // Close sheet on any navigation link clicked inside the sheet
  document.querySelectorAll('.mobile-more-card-link').forEach(link => {
    link.addEventListener('click', closeMobileMoreSheet);
  });

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
          window.navigate('/search?q=' + encodeURIComponent(q));
        }
      }
    });
  }

  // 7. Setup Mobile Sidebar Drawer Controls
  const sidebarEl = document.getElementById('app-sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
  const sidebarCloseBtn = document.getElementById('sidebar-close-btn');

  const openMobileSidebar = () => {
    if (sidebarEl) sidebarEl.classList.add('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileSidebar = () => {
    if (sidebarEl) sidebarEl.classList.remove('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener('click', openMobileSidebar);
  }

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', closeMobileSidebar);
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeMobileSidebar);
  }

  // Auto-close drawer on navigation click for mobile & tablet (iPad)
  if (sidebarEl) {
    sidebarEl.querySelectorAll('.sidebar-menu-item, .sidebar-brand, .sidebar-user-card').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 1024 || window.matchMedia('(pointer: coarse)').matches) {
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

  router.register('/', (c, q) => window.HomePage.render(c, q));
  router.register('/sheets', (c, q) => window.SheetsPage.render(c, q));
  router.register('/sheet-detail', (c, q) => window.SheetDetailPage.render(c, q));
  router.register('/sheet/:id', (c, id, q) => window.SheetDetailPage.render(c, id, q));
  router.register('/recordings', (c, q) => window.SecondaryPages.renderAudioRecordings(c, q));
  router.register('/videos', (c, q) => window.SecondaryPages.renderAudioRecordings(c, q));
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
    if (window.ExamsPage && typeof window.ExamsPage.renderAcademicSchedules === 'function') {
      window.ExamsPage.renderAcademicSchedules(c, q);
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
  router.register('/rewards', (c, q) => window.SecondaryPages.renderRewards(c, q));
  router.register('/alerts', (c, q) => window.SecondaryPages.renderAlerts(c, q));
  router.register('/search', (c, q) => window.SecondaryPages.renderSearch(c, q));
  router.register('/admin', (c, q) => window.AdminPage.render(c, q));
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
    document.querySelectorAll('.sidebar-menu-item').forEach(btn => {
      const target = btn.getAttribute('data-route') || btn.getAttribute('href')?.replace('#', '');
      if (target === path) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update Top Header Nav Pills
    document.querySelectorAll('.header-nav-pill').forEach(pill => {
      const target = pill.getAttribute('data-route') || pill.getAttribute('href')?.replace('#', '');
      if (target && (target === path || (target === '/' && (path === '' || path === '/')))) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    // Also close mobile drawer on navigation
    closeMobileSidebar();
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
  router.handleRoute();
  updateActiveSidebarNav(window.location.hash.slice(1).split('?')[0] || '/');
});

