/**
 * KURO FANGS — APPLICATION ENTRY POINT (LOCK-IN EDITION)
 * Coordinates Data, Store, Routing, Focus Keyboard Shortcuts & Streaks
 */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initialize Curriculum Data
  await window.DATA.init();

  // 2. Register Routes
  const router = window.ROUTER;

  router.register('/', (c) => window.HomePage.render(c));
  router.register('/subjects', (c) => window.SubjectsPage.render(c));
  router.register('/subject/:id', (c, id) => window.SubjectDetailPage.render(c, id));
  router.register('/sheets', (c) => window.SheetsPage.render(c));
  router.register('/sheet/:id', (c, id) => window.SheetDetailPage.render(c, id));
  router.register('/summaries', (c) => window.SecondaryPages.renderSummaries(c));
  router.register('/notes', (c) => window.NotesPage.render(c));
  router.register('/exams', (c) => window.QuizzesPage.render(c));
  router.register('/quizzes', (c) => window.QuizzesPage.render(c));
  router.register('/calculator', (c) => window.CalculatorPage.render(c));
  router.register('/questions', (c) => window.QuestionsPage.render(c));
  router.register('/videos', (c) => window.SecondaryPages.renderVideos(c));
  router.register('/images', (c) => window.SecondaryPages.renderImages(c));
  router.register('/flashcards', (c) => window.FlashcardsPage.render(c));
  router.register('/previous-years', (c) => window.PreviousYearsPage.render(c));
  router.register('/favorites', (c) => window.SecondaryPages.renderFavorites(c));
  router.register('/profile', (c) => window.SecondaryPages.renderProfile(c));
  router.register('/alerts', (c) => window.SecondaryPages.renderAlerts(c));
  router.register('/search', (c, p) => window.SecondaryPages.renderSearch(c, p));

  // 3. Setup Header & Streak Synchronization
  const updateUIElements = () => {
    // Points
    const pointsEl = document.getElementById('header-points-text');
    if (pointsEl) {
      pointsEl.textContent = `${window.STORE.getPoints()} pts`;
    }

    // Avatar
    const userInfo = window.STORE.getUserInfo();
    const avatarEl = document.getElementById('header-avatar');
    if (avatarEl && userInfo.avatarText) {
      avatarEl.textContent = userInfo.avatarText;
    }

    // Streak
    const streakEl = document.getElementById('sidebar-streak-count');
    if (streakEl) {
      streakEl.textContent = `${window.STORE.getStreak()} day`;
    }

    // Time-based greeting (Good evening / Good morning)
    const greetingEl = document.getElementById('header-greeting-text');
    if (greetingEl) {
      const hour = new Date().getHours();
      const isEvening = hour >= 16 || hour < 5;
      greetingEl.textContent = isEvening ? 'Good evening 👋' : 'Good morning 👋';
    }
  };

  updateUIElements();
  window.STORE.subscribe(() => updateUIElements());

  // 4. Keyboard Shortcut: Press '/' to search
  const searchInput = document.getElementById('top-search-input');
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput?.focus();
    }
  });

  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && searchInput.value.trim()) {
        window.ROUTER.navigate(`/search?q=${encodeURIComponent(searchInput.value.trim())}`);
      }
    });
  }

  // 5. Mobile Drawer Toggle
  const menuToggleBtn = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');

  if (menuToggleBtn && sidebar && backdrop) {
    menuToggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      backdrop.classList.toggle('open');
    });

    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('open');
      backdrop.classList.remove('open');
    });
  }

  // 6. Mobile Bottom Nav Sync
  const updateMobileNav = (currentPath) => {
    document.querySelectorAll('.mobile-nav-tab').forEach(tab => {
      const target = tab.getAttribute('data-route');
      if (!target) return;
      if (target === currentPath || (target !== '/' && currentPath.startsWith(target))) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  };

  window.addEventListener('hashchange', () => {
    const p = window.location.hash.slice(1).split('?')[0] || '/';
    updateMobileNav(p);
  });

  // 7. Initial Route
  router.handleRoute();
  updateMobileNav(window.location.hash.slice(1).split('?')[0] || '/');
});
