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

    // Update Header Brand
    const isAr = lang === 'ar';
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

    // Update Sidebar Quick Language text
    const sideLangBtnText = document.getElementById('side-lang-btn-text');
    if (sideLangBtnText) sideLangBtnText.textContent = lang === 'en' ? 'AR' : 'EN';

    // Update Top Navigation Center Pills & More Dropdown
    const navHome = document.getElementById('nav-item-home');
    if (navHome) navHome.textContent = isAr ? 'الرئيسية' : 'Home';
    const navSubjects = document.getElementById('nav-item-subjects');
    if (navSubjects) navSubjects.textContent = isAr ? 'المواد' : 'Subjects';
    const navSchedules = document.getElementById('nav-item-schedules');
    if (navSchedules) navSchedules.textContent = isAr ? 'الجداول' : 'Schedules';
    const navMore = document.getElementById('nav-item-more');
    if (navMore) navMore.textContent = isAr ? 'المزيد' : 'More';

    const navQuestions = document.getElementById('nav-item-questions');
    if (navQuestions) navQuestions.textContent = isAr ? 'بنك الأسئلة' : 'Question Bank';
    const navRecordings = document.getElementById('nav-item-recordings');
    if (navRecordings) navRecordings.textContent = isAr ? 'التسجيلات الصوتية' : 'Audio Recordings';
    const navRewards = document.getElementById('nav-item-rewards');
    if (navRewards) navRewards.textContent = isAr ? 'كورو والتخصيص' : 'Mascot Hub';
    const navGames = document.getElementById('nav-item-games');
    if (navGames) navGames.textContent = isAr ? 'ألعاب واستراحة' : 'Games';
    const navAdmin = document.getElementById('nav-item-admin');
    if (navAdmin) navAdmin.textContent = isAr ? 'بوابة الإدارة' : 'Admin Portal';
    const navProfile = document.getElementById('nav-item-profile');
    if (navProfile) navProfile.textContent = isAr ? 'الملف الشخصي' : 'Profile';

    const sideSchedules = document.getElementById('side-nav-schedules');
    if (sideSchedules) sideSchedules.textContent = isAr ? 'الجداول الدراسية' : 'Schedules';
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
    if (window.lucide) window.lucide.createIcons();
  };

  const initialTheme = window.STORE.getTheme();
  applyTheme(initialTheme);

  // 5. Setup Language Toggle Event Listeners (Header & Sidebar)
  const langToggleBtn = document.getElementById('lang-toggle-btn');
  const sideLangToggleBtn = document.getElementById('side-lang-toggle-btn');
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

  // 6. Setup Theme Toggle Event Listeners (Header & Sidebar)
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const sideThemeToggleBtn = document.getElementById('side-theme-toggle-btn');
  const handleThemeToggle = () => {
    const newTheme = window.STORE.toggleTheme();
    applyTheme(newTheme);
    if (window.SoundFX) window.SoundFX.play('switch');
  };
  if (themeToggleBtn) themeToggleBtn.addEventListener('click', handleThemeToggle);
  if (sideThemeToggleBtn) sideThemeToggleBtn.addEventListener('click', handleThemeToggle);

  // 6.2. Setup Sound Effects Toggle Event Listeners
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const sideSoundToggleBtn = document.getElementById('side-sound-toggle-btn');
  const updateSoundUI = (enabled) => {
    const soundIcon = document.getElementById('sound-icon');
    if (soundIcon) {
      soundIcon.setAttribute('data-lucide', enabled ? 'volume-2' : 'volume-x');
    }
    const sideSoundIcon = document.getElementById('side-sound-icon');
    if (sideSoundIcon) {
      sideSoundIcon.setAttribute('data-lucide', enabled ? 'volume-2' : 'volume-x');
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

