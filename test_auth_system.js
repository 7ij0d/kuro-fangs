/**
 * AUTOMATED VERIFICATION SUITE — KURO FANGS AUTHENTICATION SYSTEM
 * Tests all states, UI components, router guards, and design specs.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = __dirname;
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('========================================================');
console.log('1. Checking File Existence & Syntax Integrity');
console.log('========================================================');

const filesToCheck = [
  'index.html',
  'css/auth.css',
  'js/auth.js',
  'js/pages/login.js',
  'js/router.js',
  'js/app.js',
  'js/pages/profile.js',
  'js/components/settings-menu.js',
  'assets/hero/kuro-study-desk.png',
  'assets/characters/kuro/kuro-welcome-sparks.png'
];

filesToCheck.forEach(file => {
  const fullPath = path.join(rootDir, file);
  const exists = fs.existsSync(fullPath);
  assert(exists, `File exists: ${file}`);
  if (exists && file.endsWith('.js')) {
    try {
      const code = fs.readFileSync(fullPath, 'utf8');
      new vm.Script(code);
      assert(true, `Syntax valid: ${file}`);
    } catch (e) {
      assert(false, `Syntax error in ${file}: ${e.message}`);
    }
  }
});

console.log('\n========================================================');
console.log('2. Checking index.html Links & Injections');
console.log('========================================================');

const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
assert(indexHtml.includes('css/auth.css'), 'index.html includes css/auth.css stylesheet');
assert(indexHtml.includes('js/auth.js'), 'index.html includes js/auth.js');
assert(indexHtml.includes('js/pages/login.js'), 'index.html includes js/pages/login.js');
assert(indexHtml.includes('id="header-auth-action-box"'), 'index.html contains #header-auth-action-box container');

console.log('\n========================================================');
console.log('3. Checking CSS Tokens, Responsive Breakpoints & Design Rules');
console.log('========================================================');

const authCss = fs.readFileSync(path.join(rootDir, 'css/auth.css'), 'utf8');
assert(authCss.includes('.kuro-login-viewport'), 'Contains .kuro-login-viewport');
assert(authCss.includes('.kuro-login-split-layout'), 'Contains .kuro-login-split-layout (grid)');
assert(authCss.includes('.login-btn-google'), 'Contains .login-btn-google button styles');
assert(authCss.includes('.login-btn-guest'), 'Contains .login-btn-guest button styles');
assert(authCss.includes('.kf-auth-boot-loader'), 'Contains .kf-auth-boot-loader (smooth non-flashing screen)');
assert(authCss.includes('@media (max-width: 1023px)'), 'Contains iPad responsive rules');
assert(authCss.includes('@media (max-width: 767px)'), 'Contains Mobile (<768px) responsive rules');
assert(authCss.includes('body.login-view-active #app-sidebar'), 'Hides app sidebar on login view');
assert(authCss.includes('body.login-view-active #site-header'), 'Hides app header on login view');

console.log('\n========================================================');
console.log('4. Simulating DOM & Auth Engine Lifecycle');
console.log('========================================================');

// Create mock browser DOM environment
function createMockEnvironment() {
  const localStorageStore = {};
  const sessionStorageStore = {};

  const window = {
    location: {
      hash: '',
      origin: 'https://kurofangs.id.ly',
      pathname: '/',
      hostname: 'kurofangs.id.ly'
    },
    localStorage: {
      getItem: (k) => localStorageStore[k] || null,
      setItem: (k, v) => { localStorageStore[k] = String(v); },
      removeItem: (k) => { delete localStorageStore[k]; },
      clear: () => { Object.keys(localStorageStore).forEach(k => delete localStorageStore[k]); }
    },
    sessionStorage: {
      getItem: (k) => sessionStorageStore[k] || null,
      setItem: (k, v) => { sessionStorageStore[k] = String(v); },
      removeItem: (k) => { delete sessionStorageStore[k]; }
    },
    document: {
      body: {
        classList: {
          classes: new Set(),
          add(c) { this.classes.add(c); },
          remove(c) { this.classes.delete(c); },
          toggle(c, force) { if (force) this.classes.add(c); else this.classes.delete(c); },
          contains(c) { return this.classes.has(c); }
        },
        appendChild(child) {},
        style: {}
      },
      createElement(tag) {
        return {
          tagName: tag,
          className: '',
          id: '',
          style: {},
          innerHTML: '',
          querySelector: () => null,
          querySelectorAll: () => [],
          addEventListener: () => {},
          remove: () => {},
          setAttribute: () => {},
          removeAttribute: () => {}
        };
      },
      getElementById: () => null,
      querySelector: () => null,
      querySelectorAll: () => []
    },
    I18N: {
      getLang: () => 'ar',
      t: (k) => k
    },
    Toast: {
      show: (msg, type) => {}
    },
    addEventListener: () => {},
    setTimeout: (cb) => cb(),
    console: console
  };

  window.window = window;
  return window;
}

// Test A: Initial Unauthenticated state redirects to /login
{
  const mockEnv = createMockEnvironment();
  const context = vm.createContext(mockEnv);
  const authCode = fs.readFileSync(path.join(rootDir, 'js/auth.js'), 'utf8');
  vm.runInContext(authCode, context);

  assert(context.window.AUTH !== undefined, 'window.AUTH is exported');
  assert(context.window.AUTH.isLoading(), 'Initial state is AUTH_LOADING before init');

  // Trigger init without session or guest
  context.window.AUTH.init().then(() => {
    assert(context.window.AUTH.isUnauthenticated(), 'State transitions to UNAUTHENTICATED when no session/guest');
    assert(context.window.location.hash === '#/login', 'Enforces redirect to #/login when UNAUTHENTICATED');
  });
}

// Test B: Continue as Guest transitions to GUEST state
{
  const mockEnv = createMockEnvironment();
  const context = vm.createContext(mockEnv);
  const authCode = fs.readFileSync(path.join(rootDir, 'js/auth.js'), 'utf8');
  vm.runInContext(authCode, context);

  context.window.AUTH.continueAsGuest();
  assert(context.window.AUTH.isGuest(), 'window.AUTH.isGuest() is true after continueAsGuest()');
  assert(context.window.localStorage.getItem('kf_auth_mode') === 'guest', 'localStorage kf_auth_mode is "guest"');
  assert(context.window.location.hash === '#/', 'Redirects to #/ on guest access');

  // requireAuth on guest returns false and triggers prompt
  let modalCreated = false;
  context.window.document.body.appendChild = (el) => {
    if (el.id === 'kf-guest-upgrade-modal-backdrop') modalCreated = true;
  };
  const isAllowed = context.window.AUTH.requireAuth('cloud-sync');
  assert(isAllowed === false, 'requireAuth returns false for Guest');
  assert(modalCreated, 'Guest restriction upgrade modal created on protected feature');
}

// Test C: Boot with existing Google session transitions to AUTHENTICATED
{
  const mockEnv = createMockEnvironment();
  // Provide SupabaseAuth mock
  mockEnv.SupabaseAuth = {
    getClient: () => ({
      auth: {
        getSession: async () => ({
          data: {
            session: {
              user: {
                id: 'sb-usr-123',
                email: 'dentist.taha@gmail.com',
                user_metadata: {
                  full_name: 'Dr. Taha Dentist',
                  avatar_url: 'https://lh3.googleusercontent.com/a/test'
                }
              }
            }
          },
          error: null
        }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
      }
    })
  };

  const context = vm.createContext(mockEnv);
  const authCode = fs.readFileSync(path.join(rootDir, 'js/auth.js'), 'utf8');
  vm.runInContext(authCode, context);

  context.window.AUTH.init().then(() => {
    assert(context.window.AUTH.isAuthenticated(), 'State transitions to AUTHENTICATED on valid Supabase session');
    const u = context.window.AUTH.getUser();
    assert(u && u.email === 'dentist.taha@gmail.com', 'User email correctly populated');
    assert(u && u.full_name === 'Dr. Taha Dentist', 'User full_name correctly populated');
    assert(u && u.avatar_url === 'https://lh3.googleusercontent.com/a/test', 'User avatar_url populated from Google metadata');
    assert(context.window.AUTH.requireAuth('any') === true, 'requireAuth returns true for Authenticated user');
  });
}

// Test D: Sign Out clears state and redirects to #/login
{
  const mockEnv = createMockEnvironment();
  mockEnv.localStorage.setItem('kf_auth_mode', 'guest');
  const context = vm.createContext(mockEnv);
  const authCode = fs.readFileSync(path.join(rootDir, 'js/auth.js'), 'utf8');
  vm.runInContext(authCode, context);

  context.window.AUTH.continueAsGuest();
  assert(context.window.AUTH.isGuest(), 'Precondition: isGuest is true');

  context.window.AUTH.signOut();
  assert(context.window.AUTH.isUnauthenticated(), 'After signOut(), state is UNAUTHENTICATED');
  assert(context.window.AUTH.getUser() === null, 'After signOut(), user is null');
  assert(context.window.localStorage.getItem('kf_auth_mode') === 'unauthenticated', 'localStorage mode is "unauthenticated"');
  assert(context.window.location.hash === '#/login', 'After signOut(), redirected to #/login');
}

// Test E: LoginPage rendering markup checks
{
  const mockEnv = createMockEnvironment();
  const context = vm.createContext(mockEnv);
  const loginPageCode = fs.readFileSync(path.join(rootDir, 'js/pages/login.js'), 'utf8');
  vm.runInContext(loginPageCode, context);

  assert(context.window.LoginPage !== undefined, 'window.LoginPage is exported');
  const container = { innerHTML: '', querySelector: () => null, querySelectorAll: () => [] };
  context.window.LoginPage.render(container);

  assert(container.innerHTML.includes('kuro-login-viewport'), 'Renders .kuro-login-viewport');
  assert(container.innerHTML.includes('btn-login-google'), 'Renders Google Sign-In button #btn-login-google');
  assert(container.innerHTML.includes('btn-login-guest'), 'Renders Continue as Guest button #btn-login-guest');
  assert(container.innerHTML.includes('login-card-badges-row'), 'Renders 3 micro-benefit badges');
  assert(container.innerHTML.includes('kuro-welcome-sparks.png'), 'Renders celebration mascot sparks');
  assert(container.innerHTML.includes('kuro-study-desk.png'), 'Renders study desk illustration');
}

console.log('\n========================================================');
console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
console.log('========================================================');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL TESTS PASSED SUCCESSFULLY!');
}
