/**
 * KURO FANGS — Hash Router
 * Simple client-side routing via URL hash
 */

const ROUTES = {};
let currentRoute = null;

const ROUTER = {
  // Register a route: path pattern → handler function
  register(path, handler) {
    ROUTES[path] = handler;
  },

  // Navigate to a path
  navigate(path) {
    window.location.hash = path;
  },

  // Get current path
  getPath() {
    return window.location.hash.slice(1) || '/';
  },

  // Get path params — e.g. /subjects/oral-path → { id: 'oral-path' }
  parseParams(pattern, path) {
    const patternParts = pattern.split('/');
    const pathParts    = path.split('/');
    const params = {};
    if (patternParts.length !== pathParts.length) return null;
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
      } else if (patternParts[i] !== pathParts[i]) {
        return null;
      }
    }
    return params;
  },

  // Match current path to a registered route
  match(path) {
    // Exact match
    if (ROUTES[path]) return { handler: ROUTES[path], params: {} };

    // Parametric match
    for (const pattern of Object.keys(ROUTES)) {
      if (!pattern.includes(':')) continue;
      const params = this.parseParams(pattern, path);
      if (params !== null) {
        return { handler: ROUTES[pattern], params };
      }
    }
    return null;
  },

  // Handle route change
  async handle() {
    const path = this.getPath();
    if (path === currentRoute) return;
    currentRoute = path;

    const match = this.match(path);
    const container = document.getElementById('page-container');
    if (!container) return;

    // Page exit animation
    container.style.opacity = '0';
    container.style.transform = 'translateY(8px)';
    container.style.transition = 'opacity 120ms ease, transform 120ms ease';

    await new Promise(r => setTimeout(r, 120));

    if (match) {
      container.innerHTML = '';
      await match.handler(container, match.params);
    } else {
      // 404
      const { default: KURONI } = await import('./kuroni.js');
      container.innerHTML = `
        <div class="page-header">
          <div class="empty-state" style="padding-top: var(--space-20);">
            ${KURONI.html('confused', '2xl', 'kuroni-state-floating')}
            <h2 class="empty-state-title">الصفحة غير موجودة</h2>
            <p class="empty-state-message">كوروني في حيرة... هذه الصفحة لا وجود لها!</p>
            <button class="btn btn-primary" onclick="ROUTER.navigate('/')">العودة للرئيسية</button>
          </div>
        </div>`;
    }

    // Page enter animation
    container.style.opacity = '1';
    container.style.transform = 'translateY(0)';

    // Update active nav item
    this.updateNav(path);

    // Scroll to top
    container.scrollTop = 0;
    window.scrollTo(0, 0);
  },

  // Highlight active nav item in sidebar and bottom nav
  updateNav(path) {
    document.querySelectorAll('.nav-item[data-route], .bottom-nav-item[data-route]').forEach(el => {
      const route = el.dataset.route;
      const isActive = path === route || (route !== '/' && path.startsWith(route));
      el.classList.toggle('active', isActive);
    });
  },

  // Initialize router
  init() {
    window.addEventListener('hashchange', () => this.handle());
    this.handle(); // handle initial route
  }
};

// Make globally accessible for inline onclick handlers
window.ROUTER = ROUTER;

export default ROUTER;
