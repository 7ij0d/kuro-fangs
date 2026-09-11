/**
 * KURO FANGS — APPLICATION ENTRY POINT
 * Initializes App, Store, Router & Event Listeners
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

  // 3. Setup Header Sync
  const updateHeader = () => {
    const pointsEl = document.getElementById('header-points-text');
    if (pointsEl) {
      pointsEl.textContent = `${window.STORE.getPoints()} نقطة`;
    }

    const userInfo = window.STORE.getUserInfo();
    const avatarEl = document.getElementById('header-avatar');
    if (avatarEl && userInfo.avatarText) {
      avatarEl.textContent = userInfo.avatarText;
    }
  };

  updateHeader();
  window.STORE.subscribe(() => updateHeader());

  // 4. Setup Mobile Drawer Toggle
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

  // 5. Notifications Button Handler
  const notifBtn = document.getElementById('header-notif-btn');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      window.ROUTER.navigate('/alerts');
    });
  }

  // 6. Handle Initial URL Route
  router.handleRoute();
});
