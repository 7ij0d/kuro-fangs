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
      '/lecture-schedule': async (container, params) => {
        if (window.ExamsPage && typeof window.ExamsPage.renderAcademicSchedules === 'function') {
          window.ExamsPage.renderAcademicSchedules(container, params);
        } else if (window.ExamsPage) {
          window.ExamsPage.render(container, params);
        }
      },
      '/practical-schedule': async (container, params) => {
        if (params) params.set('tab', 'practical');
        if (window.ExamsPage && typeof window.ExamsPage.renderAcademicSchedules === 'function') {
          window.ExamsPage.renderAcademicSchedules(container, params);
        } else if (window.ExamsPage) {
          window.ExamsPage.render(container, params);
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

    // Close mobile drawer if open
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar && sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
      backdrop?.classList.remove('open');
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
    document.querySelectorAll('.nav-item, .sidebar-menu-item').forEach(link => {
      const target = link.getAttribute('data-route') || link.getAttribute('href')?.replace('#', '');
      if (!target) return;

      if (target === currentPath || (target !== '/' && currentPath.startsWith(target))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
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
