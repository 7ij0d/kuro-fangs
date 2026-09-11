/**
 * KURO FANGS — APPLICATION ENTRY POINT (BURGUNDY EDITION)
 * Coordinates Data, Store, Routing, and the Floating Subject Modal
 */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initialize Curriculum Data
  await window.DATA.init();

  // 2. Initialize Subject Modal Listeners
  if (window.SubjectModal) {
    window.SubjectModal.init();
  }

  // 3. Register Routes
  const router = window.ROUTER;

  router.register('/', (c) => window.HomePage.render(c));
  router.register('/calculator', (c) => window.CalculatorPage.render(c));
  router.register('/quizzes', (c) => window.QuizzesPage.render(c));
  router.register('/questions', (c) => window.QuestionsPage.render(c));
  router.register('/flashcards', (c) => window.FlashcardsPage.render(c));
  router.register('/notes', (c) => window.NotesPage.render(c));
  router.register('/previous-years', (c) => window.PreviousYearsPage.render(c));
  router.register('/favorites', (c) => window.SecondaryPages.renderFavorites(c));
  router.register('/profile', (c) => window.SecondaryPages.renderProfile(c));

  // 4. Setup Header Points & Active Navigation Sync
  const updateUIElements = () => {
    const pointsEl = document.getElementById('header-points-text');
    if (pointsEl) {
      pointsEl.textContent = `${window.STORE.getPoints()} نقطة`;
    }
  };

  updateUIElements();
  window.STORE.subscribe(() => updateUIElements());

  // 5. Update Active Nav Link
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

  // 6. Handle Initial Route
  router.handleRoute();
  updateActiveHeaderNav(window.location.hash.slice(1).split('?')[0] || '/');
});
