/**
 * KURO FANGS — APPLICATION ENTRY POINT (ACADEMIA DESIGN SYSTEM)
 * Dark Sidebar (#1E1E2D), Multi-Language (EN/AR), Light/Dark Theme & Routing
 */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initialize Curriculum Data
  await window.DATA.init();

  // 2. Initialize Subject Modal & In-App Document Viewer
  if (window.SubjectModal) {
    window.SubjectModal.init();
  }
  if (window.DocumentViewer) {
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

    // Update Guest Banner texts
    const bannerStrong = document.getElementById('guest-banner-strong');
    const bannerSub = document.getElementById('guest-banner-sub');
    const bannerBtnText = document.getElementById('guest-banner-btn-text');
    if (bannerStrong) {
      bannerStrong.textContent = lang === 'ar'
        ? 'أنشئ حسابك الاختياري لحفظ نقاطك وتقدمك وسكناتك في السحابة'
        : 'Create your optional account to sync points, progress & skins to the cloud';
    }
    if (bannerSub) {
      bannerSub.textContent = lang === 'ar'
        ? 'التسجيل اختياري 100% ولا يمنعك من تصفح كافة محتويات وألعاب المنصة كزائر.'
        : '100% optional. You can explore all academic content & arcade games freely as a guest.';
    }
    if (bannerBtnText) {
      bannerBtnText.textContent = lang === 'ar'
        ? 'إنشاء حساب / تسجيل ☁️'
        : 'Sign In / Register ☁️';
    }

    // Update Auth header state
    if (window.SupabaseAuth && typeof window.SupabaseAuth.updateUI === 'function') {
      window.SupabaseAuth.updateUI(window.SupabaseAuth.getUser());
    }

    // Update Dark Sidebar Elements
    const sideSub = document.getElementById('sidebar-brand-sub');
    if (sideSub) sideSub.textContent = t('brandSub');

    const secAcad = document.getElementById('side-sec-academic');
    if (secAcad) secAcad.textContent = t('academicHubs');

    const secTools = document.getElementById('side-sec-tools');
    if (secTools) secTools.textContent = t('studentTools');

    const sideSubjects = document.getElementById('side-nav-subjects');
    if (sideSubjects) sideSubjects.textContent = t('navSubjects');

    const sideSheets = document.getElementById('side-nav-sheets');
    if (sideSheets) sideSheets.textContent = t('sideNavSheets');

    const sideVideos = document.getElementById('side-nav-videos');
    if (sideVideos) sideVideos.textContent = t('sideNavVideos');

    const sideExams = document.getElementById('side-nav-exams');
    if (sideExams) sideExams.textContent = t('sideNavExams');

    const sideSummaries = document.getElementById('side-nav-summaries');
    if (sideSummaries) sideSummaries.textContent = t('sideNavSummaries');

    const sideQuestions = document.getElementById('side-nav-questions');
    if (sideQuestions) sideQuestions.textContent = t('sideNavQuestions');

    const sideFlashcards = document.getElementById('side-nav-flashcards');
    if (sideFlashcards) sideFlashcards.textContent = t('sideNavFlashcards');

    const sideNotes = document.getElementById('side-nav-notes');
    if (sideNotes) sideNotes.textContent = t('sideNavNotes');

    const sideLectureSchedule = document.getElementById('side-nav-lecture-schedule');
    if (sideLectureSchedule) sideLectureSchedule.textContent = t('sideNavLectureSchedule');

    const sidePracticalSchedule = document.getElementById('side-nav-practical-schedule');
    if (sidePracticalSchedule) sidePracticalSchedule.textContent = t('sideNavPracticalSchedule');

    const sideExamsSchedule = document.getElementById('side-nav-exams-schedule') || document.getElementById('side-nav-calc');
    if (sideExamsSchedule) sideExamsSchedule.textContent = t('sideNavExamsSchedule');

    const sideSaved = document.getElementById('side-nav-saved');
    if (sideSaved) sideSaved.textContent = t('sideNavSaved');

    const sideRewards = document.getElementById('side-nav-rewards');
    if (sideRewards) sideRewards.textContent = t('sideNavRewards');

    const sideGames = document.getElementById('side-nav-games');
    if (sideGames) sideGames.textContent = t('sideNavGames');

    const sideUserSub = document.getElementById('sidebar-user-sub');
    if (sideUserSub) sideUserSub.textContent = t('academicYear');
  };

  const initialLang = window.I18N.getLang();
  applyLanguage(initialLang);

  // 4. Setup Initial Theme
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
      themeIcon.setAttribute('data-lucide', (theme === 'ninja' || theme === 'dark') ? 'sun' : 'moon');
      if (window.lucide) window.lucide.createIcons();
    }
  };

  const initialTheme = window.STORE.getTheme();
  applyTheme(initialTheme);

  // 5. Setup Language Toggle Event Listener
  const langToggleBtn = document.getElementById('lang-toggle-btn');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      const newLang = window.I18N.toggleLang();
      applyLanguage(newLang);
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

  // 8. Register Routes
  const router = window.ROUTER;

  router.register('/', (c, q) => window.HomePage.render(c, q));
  router.register('/sheets', (c, q) => window.SheetsPage.render(c, q));
  router.register('/sheet-detail', (c, q) => window.SheetDetailPage.render(c, q));
  router.register('/sheet/:id', (c, id, q) => window.SheetDetailPage.render(c, id, q));
  router.register('/videos', (c, q) => window.SecondaryPages.renderVideos(c, q));
  router.register('/summaries', (c, q) => window.SecondaryPages.renderSummaries(c, q));
  router.register('/lecture-schedule', (c, q) => {
    if (window.ExamsPage && typeof window.ExamsPage.renderAcademicSchedules === 'function') {
      window.ExamsPage.renderAcademicSchedules(c, q);
    } else if (window.ExamsPage) {
      window.ExamsPage.render(c, q);
    }
  });
  router.register('/practical-schedule', (c, q) => {
    if (q) q.set('tab', 'practical');
    if (window.ExamsPage && typeof window.ExamsPage.renderAcademicSchedules === 'function') {
      window.ExamsPage.renderAcademicSchedules(c, q);
    } else if (window.ExamsPage) {
      window.ExamsPage.render(c, q);
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
  router.register('/calculator', (c, q) => {
    if (window.ExamsPage && typeof window.ExamsPage.renderExamsSchedule === 'function') {
      window.ExamsPage.renderExamsSchedule(c, q);
    } else if (window.ExamsPage) {
      window.ExamsPage.render(c, q);
    }
  });
  router.register('/quizzes', (c, q) => window.QuizzesPage.render(c, q));
  router.register('/questions', (c, q) => window.QuestionsPage.render(c, q));
  router.register('/flashcards', (c, q) => window.FlashcardsPage.render(c, q));
  router.register('/notes', (c, q) => window.NotesPage.render(c, q));
  router.register('/previous-years', (c, q) => window.PreviousYearsPage.render(c, q));
  router.register('/favorites', (c, q) => window.SecondaryPages.renderFavorites(c, q));
  router.register('/profile', (c, q) => window.SecondaryPages.renderProfile(c, q));
  router.register('/rewards', (c, q) => window.SecondaryPages.renderRewards(c, q));
  router.register('/alerts', (c, q) => window.SecondaryPages.renderAlerts(c, q));
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

  // 9. Global Mascot Avatars & Watermark Synchronization
  const updateGlobalMascotAvatars = () => {
    if (!window.STORE) return;
    const equipped = window.STORE.getEquippedSkinData();
    if (!equipped || !equipped.image) return;

    // 1. Sidebar user avatar
    const sideAvatar = document.getElementById('sidebar-user-avatar-img');
    if (sideAvatar) {
      sideAvatar.src = equipped.image;
      sideAvatar.alt = equipped.name_ar;
    }

    // 2. Sidebar Mascot Subtle Watermark
    const sideWatermark = document.getElementById('sidebar-watermark-img');
    if (sideWatermark) {
      sideWatermark.src = equipped.image;
    }

    // 3. Header Mascot Avatar Button
    const headerAvatar = document.getElementById('header-mascot-avatar-img');
    if (headerAvatar) {
      headerAvatar.src = equipped.image;
      headerAvatar.alt = equipped.name_ar;
    }

    // 4. Any other on-screen current mascot images (profile, rewards, etc.)
    document.querySelectorAll('.current-mascot-img').forEach(img => {
      img.src = equipped.image;
      img.alt = equipped.name_ar;
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

  // 11. Update Active Sidebar Link on route change (Activates Radiant Vertical Light Line)
  const updateActiveSidebarNav = (path) => {
    document.querySelectorAll('.sidebar-menu-item').forEach(btn => {
      const target = btn.getAttribute('data-route') || btn.getAttribute('href')?.replace('#', '');
      if (target === path) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
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

  // 12. Handle Initial Route & Initial Mascot Sync
  updateGlobalMascotAvatars();
  router.handleRoute();
  updateActiveSidebarNav(window.location.hash.slice(1).split('?')[0] || '/');
});
