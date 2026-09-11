/**
 * KURO FANGS — APPLICATION ENTRY POINT (WITH LANG & THEME TOGGLES)
 * Default Language: English (en) | Default Theme: Clean Light (light)
 */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initialize Curriculum Data
  await window.DATA.init();

  // 2. Initialize Subject Modal Listeners
  if (window.SubjectModal) {
    window.SubjectModal.init();
  }

  // 3. Setup Initial Language & Direction
  const applyLanguage = (lang) => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    const t = (k) => window.I18N.t(k);

    // Update Header Text Elements
    const brandSub = document.getElementById('header-brand-sub');
    if (brandSub) brandSub.textContent = t('brandSub');

    const searchInput = document.getElementById('header-search-input');
    if (searchInput) searchInput.placeholder = t('searchPlaceholder');

    const navSubjectsText = document.getElementById('nav-subjects-text');
    if (navSubjectsText) navSubjectsText.textContent = t('navSubjects');

    const navCalcText = document.getElementById('nav-calc-text');
    if (navCalcText) navCalcText.textContent = t('navCalculator');

    const navBookmarksText = document.getElementById('nav-bookmarks-text');
    if (navBookmarksText) navBookmarksText.textContent = t('navBookmarks');

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
  };

  const initialLang = window.I18N.getLang();
  applyLanguage(initialLang);

  // 4. Setup Initial Theme (Light by Default)
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
      themeIcon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
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

  // 7. Register Routes
  const router = window.ROUTER;

  router.register('/', (c, q) => window.HomePage.render(c, q));
  router.register('/sheets', (c, q) => window.SheetsPage.render(c, q));
  router.register('/videos', (c, q) => window.SecondaryPages.renderVideos(c, q));
  router.register('/summaries', (c, q) => window.SecondaryPages.renderSummaries(c, q));
  router.register('/calculator', (c, q) => window.CalculatorPage.render(c, q));
  router.register('/quizzes', (c, q) => window.QuizzesPage.render(c, q));
  router.register('/questions', (c, q) => window.QuestionsPage.render(c, q));
  router.register('/flashcards', (c, q) => window.FlashcardsPage.render(c, q));
  router.register('/notes', (c, q) => window.NotesPage.render(c, q));
  router.register('/previous-years', (c, q) => window.PreviousYearsPage.render(c, q));
  router.register('/favorites', (c, q) => window.SecondaryPages.renderFavorites(c, q));
  router.register('/profile', (c, q) => window.SecondaryPages.renderProfile(c, q));

  // 8. Synchronize Points
  window.STORE.subscribe((event) => {
    if (event === 'points_changed') {
      const pointsEl = document.getElementById('header-points-text');
      if (pointsEl) {
        pointsEl.textContent = `${window.STORE.getPoints()} ${window.I18N.t('pointsSuffix')}`;
      }
    }
  });

  // 9. Update Active Nav Link on route change
  const updateActiveHeaderNav = (path) => {
    document.querySelectorAll('.header-nav-btn').forEach(btn => {
      const target = btn.getAttribute('href')?.replace('#', '');
      if (target === path) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };

  window.addEventListener('hashchange', () => {
    const p = window.location.hash.slice(1).split('?')[0] || '/';
    updateActiveHeaderNav(p);
  });

  // 10. Handle Initial Route
  router.handleRoute();
  updateActiveHeaderNav(window.location.hash.slice(1).split('?')[0] || '/');
});
