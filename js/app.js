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

    const sideCalc = document.getElementById('side-nav-calc');
    if (sideCalc) sideCalc.textContent = t('sideNavCalc');

    const sideSaved = document.getElementById('side-nav-saved');


    const sideRewards = document.getElementById('side-nav-rewards');
    if (sideRewards) sideRewards.textContent = t('sideNavRewards');

    const sideGames = document.getElementById('side-nav-games');
    if (sideGames) sideGames.textContent = t('sideNavGames');

    const sideAdmin = document.getElementById('side-nav-admin');
    if (sideAdmin) sideAdmin.textContent = t('sideNavAdmin');

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
  router.register('/calculator', (c, q) => {
    if (window.CalculatorPage && typeof window.CalculatorPage.render === 'function') {
      window.CalculatorPage.render(c, q);
    }
  });
  router.register('/quizzes', (c, q) => window.QuizzesPage.render(c, q));
  router.register('/questions', (c, q) => window.QuestionsPage.render(c, q));
  // Redirect legacy routes to unified questions page
  router.register('/flashcards', (c, q) => window.QuestionsPage.render(c, q));
  router.register('/previous-years', (c, q) => window.QuestionsPage.render(c, q));


  router.register('/profile', (c, q) => window.SecondaryPages.renderProfile(c, q));
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

  // 12. Handle Initial Route, Notifications Center & Mascot Sync
  updateGlobalMascotAvatars();
  if (window.NotificationsCenter && typeof window.NotificationsCenter.init === 'function') {
    window.NotificationsCenter.init();
  }
  router.handleRoute();
  updateActiveSidebarNav(window.location.hash.slice(1).split('?')[0] || '/');
});

