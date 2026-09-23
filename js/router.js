/**
 * KURO FANGS — CLIENT ROUTER
 * Hash-based Single Page Application Router
 */

class Router {
  constructor() {
    this.routes = {
      '/games': async (container, params) => {
        if (window.GamesPage && typeof window.GamesPage.render === 'function') {
          await window.GamesPage.render(container, params);
          return;
        }
        if (typeof window.renderGames === 'function') {
          await window.renderGames(container, params);
          return;
        }
        try {
          const mod = await import('./pages/games.js');
          const renderGames = mod?.default || window.GamesPage?.render || window.renderGames;
          if (renderGames) await renderGames(container, params);
        } catch (e) {
          if (window.GamesPage && typeof window.GamesPage.render === 'function') {
            await window.GamesPage.render(container, params);
          }
        }
      },
      '/schedules': async (container, params) => {
        if (window.ExamsPage && typeof window.ExamsPage.renderSchedulesHub === 'function') {
          window.ExamsPage.renderSchedulesHub(container, params);
        } else if (window.ExamsPage) {
          window.ExamsPage.render(container, params);
        }
      },
      '/lecture-schedule': async (container, params) => {
        if (!params) params = new URLSearchParams();
        params.set('tab', 'theory');
        if (window.ExamsPage) {
          window.ExamsPage.academicTab = 'theory';
          localStorage.setItem('kf_academic_active_tab', 'theory');
          if (typeof window.ExamsPage.renderAcademicSchedules === 'function') {
            window.ExamsPage.renderAcademicSchedules(container, params);
          } else {
            window.ExamsPage.render(container, params);
          }
        }
      },
      '/practical-schedule': async (container, params) => {
        if (!params) params = new URLSearchParams();
        params.set('tab', 'practical');
        if (window.ExamsPage) {
          window.ExamsPage.academicTab = 'practical';
          localStorage.setItem('kf_academic_active_tab', 'practical');
          if (typeof window.ExamsPage.renderAcademicSchedules === 'function') {
            window.ExamsPage.renderAcademicSchedules(container, params);
          } else {
            window.ExamsPage.render(container, params);
          }
        }
      },
      '/exams': async (container, params) => {
        if (window.ExamsPage && typeof window.ExamsPage.renderExamsSchedule === 'function') {
          window.ExamsPage.renderExamsSchedule(container, params);
        } else if (window.ExamsPage) {
          window.ExamsPage.render(container, params);
        }
      },
      '/admin': async (container, params) => {
        if (window.AdminPage && typeof window.AdminPage.render === 'function') {
          window.AdminPage.render(container, params);
        }
      }
    };
    this.currentPath = '';
    window.addEventListener('hashchange', () => this.handleRoute());
  }

  register(path, handler) {
    this.routes[path] = handler;
  }

  navigate(path) {
    window.location.hash = path.startsWith('/') ? path : '/' + path;
  }

  async handleRoute() {
    const rawHash = window.location.hash.slice(1) || '/';
    const [path, queryString] = rawHash.split('?');
    const queryParams = new URLSearchParams(queryString || '');
    this.currentPath = path;

    // Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Close mobile drawer or dropdown if open
    const sidebar = document.getElementById('app-sidebar') || document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar && sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
      backdrop?.classList.remove('open');
    }
    const moreWrap = document.getElementById('header-more-dropdown-wrap');
    if (moreWrap) {
      moreWrap.classList.remove('open');
      const moreBtn = document.getElementById('header-more-btn');
      if (moreBtn) moreBtn.setAttribute('aria-expanded', 'false');
    }

    // Clean up lingering temporary backdrops or fixed overlays from previous views
    const backdropsToClean = [
      '#admin-confirm-backdrop',
      '#admin-edit-modal-backdrop',
      '#admin-publish-overlay',
      '#auth-modal-backdrop',
      '#drawer-backdrop',
      '#jnotes-eraser-cursor'
    ];
    backdropsToClean.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.remove());
    });
    // Safely close persistent interactive modals
    if (window.SubjectModal && typeof window.SubjectModal.close === 'function') {
      window.SubjectModal.close();
    }
    document.body.style.overflow = '';

    // Toggle studio fullscreen mode for sheet-detail routes
    const isStudioRoute = path === '/sheet-detail' || path.startsWith('/sheet-detail') || path.startsWith('/sheet/');
    if (isStudioRoute) {
      document.body.classList.add('studio-fullscreen-active');
    } else {
      document.body.classList.remove('studio-fullscreen-active');
    }

    // Update active nav highlights
    this.updateActiveNav(path);

    // Match routes
    let matched = false;
    const container = document.getElementById('app');
    if (!container) return;

    // 1. Direct match
    if (this.routes[path]) {
      await this.routes[path](container, queryParams);
      matched = true;
    } else {
      // 2. Dynamic parameter match (e.g. /subject/:id)
      for (const pattern in this.routes) {
        if (pattern.includes(':')) {
          const regex = new RegExp('^' + pattern.replace(/:[^\s/]+/g, '([\\w-]+)') + '$');
          const match = path.match(regex);
          if (match) {
            const params = match.slice(1);
            await this.routes[pattern](container, params[0], queryParams);
            matched = true;
            break;
          }
        }
      }
    }

    // 3. Fallback to 404 / Home
    if (!matched) {
      if (this.routes['/']) {
        await this.routes['/'](container, queryParams);
      }
    }

    // Refresh Lucide icons across the whole page
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  updateActiveNav(currentPath) {
    document.querySelectorAll('.nav-item, .sidebar-menu-item, .header-nav-pill, .mobile-bottom-nav-item').forEach(link => {
      const target = link.getAttribute('data-route') || link.getAttribute('href')?.replace('#', '');
      if (!target) return;

      const isSchedulesGroup = target === '/schedules' && (
        currentPath === '/schedules' ||
        currentPath === '/lecture-schedule' ||
        currentPath === '/practical-schedule' ||
        currentPath === '/exams'
      );

      if (isSchedulesGroup || target === currentPath || (target !== '/' && currentPath.startsWith(target))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Handle More button state on top header navigation
    const headerMoreBtn = document.getElementById('header-more-btn');
    if (headerMoreBtn) {
      const moreRoutes = ['/questions', '/recordings', '/rewards', '/games', '/profile', '/admin'];
      const isMoreActive = moreRoutes.some(r => currentPath.startsWith(r));
      headerMoreBtn.classList.toggle('active', isMoreActive);
    }
  }
}

window.ROUTER = new Router();
window.navigate = function (path) {
  if (window.ROUTER) {
    window.ROUTER.navigate(path);
  } else {
    window.location.hash = path.startsWith('/') ? path : '/' + path;
  }
};
