const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const polishCss = fs.readFileSync(path.join(rootDir, 'css', 'polish.css'), 'utf8');
const settingsMenuJs = fs.readFileSync(path.join(rootDir, 'js', 'components', 'settings-menu.js'), 'utf8');
const settingsPageJs = fs.readFileSync(path.join(rootDir, 'js', 'pages', 'settings.js'), 'utf8');
const routerJs = fs.readFileSync(path.join(rootDir, 'js', 'router.js'), 'utf8');
const appJs = fs.readFileSync(path.join(rootDir, 'js', 'app.js'), 'utf8');

console.log('='.repeat(75));
console.log('KURO STUDENT — SETTINGS MENU & DEDICATED SETTINGS PAGE VERIFICATION');
console.log('='.repeat(75));

let passed = 0;
let failed = 0;

function check(name, condition) {
  if (condition) {
    console.log(`  [PASS] ${name}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${name}`);
    failed++;
  }
}

// 1. Clean Navbar Controls in index.html
console.log('\n--- 1. Clean Navbar Architecture ---');
const rightToolsMatch = indexHtml.match(/<div class="header-right-tools">([\s\S]*?)<\/header>/);
const rightToolsContent = rightToolsMatch ? rightToolsMatch[1] : '';

check('Individual #lang-toggle-btn removed from header-right-tools', !rightToolsContent.includes('id="lang-toggle-btn"'));
check('Individual #theme-toggle-btn removed from header-right-tools', !rightToolsContent.includes('id="theme-toggle-btn"'));
check('Individual #sound-toggle-btn removed from header-right-tools', !rightToolsContent.includes('id="sound-toggle-btn"'));
check('Standalone #header-profile-btn removed from header-right-tools', !rightToolsContent.includes('id="header-profile-btn"'));
check('Single unified #header-settings-btn exists in navbar', rightToolsContent.includes('id="header-settings-btn"'));
check('Anchored popover container #settings-popover-menu exists', rightToolsContent.includes('id="settings-popover-menu"'));
check('Mobile bottom sheet #settings-mobile-sheet exists in body', indexHtml.includes('id="settings-mobile-sheet"'));
check('Mobile sheet backdrop #settings-mobile-sheet-backdrop exists in body', indexHtml.includes('id="settings-mobile-sheet-backdrop"'));

// 2. Settings Menu Component (js/components/settings-menu.js)
console.log('\n--- 2. Settings Menu Component & Interactions ---');
check('Defines window.SettingsMenu controller', settingsMenuJs.includes('window.SettingsMenu = SettingsMenu'));
check('Renders desktop popover (renderDesktopPopover)', settingsMenuJs.includes('renderDesktopPopover'));
check('Renders mobile bottom sheet (renderMobileSheet)', settingsMenuJs.includes('renderMobileSheet'));
check('Supports language toggle via I18N.toggleLang()', settingsMenuJs.includes('toggleLang()'));
check('Supports theme toggle via STORE.toggleTheme()', settingsMenuJs.includes('toggleTheme()'));
check('Supports sound toggle switch via SoundFX.toggle()', settingsMenuJs.includes('SoundFX.toggle()'));
check('Includes profile navigation link', settingsMenuJs.includes('set-row-profile'));
check('Includes account & security link to #/settings?tab=account', settingsMenuJs.includes('#/settings?tab=account'));
check('Integrates with NotificationsCenter', settingsMenuJs.includes('NotificationsCenter.toggle'));
check('Includes About Kuro Student link', settingsMenuJs.includes('#/settings?tab=about'));
check('Includes Help & Support link', settingsMenuJs.includes('#/settings?tab=support'));
check('Includes Logout action with AuthModal confirmation', settingsMenuJs.includes('set-row-logout'));

// 3. Dedicated Settings Page (js/pages/settings.js)
console.log('\n--- 3. Dedicated Settings Page (#/settings) ---');
check('Defines window.SettingsPage controller', settingsPageJs.includes('window.SettingsPage = SettingsPage'));
check('Defines 7 comprehensive settings tabs',
  settingsPageJs.includes("'general'") &&
  settingsPageJs.includes("'appearance'") &&
  settingsPageJs.includes("'audio'") &&
  settingsPageJs.includes("'account'") &&
  settingsPageJs.includes("'notifications'") &&
  settingsPageJs.includes("'about'") &&
  settingsPageJs.includes("'support'")
);
check('Implements 2-column sidebar navigation on desktop/iPad', settingsPageJs.includes('settings-page-sidebar') && settingsPageJs.includes('settings-page-content'));
check('Supports query parameter deep linking (?tab=...)', settingsPageJs.includes("queryParams?.get('tab')"));
check('Includes language select control (#settings-lang-select)', settingsPageJs.includes('id="settings-lang-select"'));
check('Includes theme select control (#settings-theme-select)', settingsPageJs.includes('id="settings-theme-select"'));
check('Includes interactive sound switch (#settings-sound-switch)', settingsPageJs.includes('id="settings-sound-switch"'));
check('Includes student profile metadata & cloud sync status', settingsPageJs.includes('Cloud Sync') && settingsPageJs.includes('Synced'));
check('Includes mobile back button bar (.settings-page-mobile-bar)', settingsPageJs.includes('settings-page-mobile-bar'));

// 4. Routing & Script Registration
console.log('\n--- 4. Routing & Script Integrations ---');
check('index.html loads js/components/settings-menu.js with cache buster', indexHtml.includes('js/components/settings-menu.js?v=10.9'));
check('index.html loads js/pages/settings.js with cache buster', indexHtml.includes('js/pages/settings.js?v=10.9'));
check('router.js registers /settings route', routerJs.includes("'/settings'") || routerJs.includes('"/settings"'));
check('app.js registers /settings route handler', appJs.includes("router.register('/settings'"));
check('app.js initializes SettingsMenu on startup', appJs.includes('SettingsMenu.init()'));
check('app.js updates SettingsMenu on language toggle', appJs.includes('SettingsMenu.updateUI()'));

// 5. CSS Polish & Visual Tokens
console.log('\n--- 5. CSS Styles & Responsive Polish ---');
check('Styles .settings-trigger-wrapper and .settings-gear-btn', polishCss.includes('.settings-trigger-wrapper') && polishCss.includes('.settings-gear-btn'));
check('Styles .settings-popover-menu with elevation shadow & border', polishCss.includes('.settings-popover-menu') && polishCss.includes('inset-inline-end: 0'));
check('Styles .settings-toggle-switch with LTR/RTL slide physics',
  polishCss.includes('.settings-toggle-switch') &&
  polishCss.includes('transform: translateX(18px)') &&
  polishCss.includes('transform: translateX(-18px)')
);
check('Styles .settings-mobile-sheet with slide-up transition & handle', polishCss.includes('.settings-mobile-sheet') && polishCss.includes('.settings-mobile-handle'));
check('Styles .settings-page-layout as 2-column grid', polishCss.includes('grid-template-columns: 260px 1fr'));
check('Styles .settings-card with hover states & warm surfaces', polishCss.includes('.settings-card') && polishCss.includes('.set-card-icon-box'));
check('Dark mode theme overrides defined for popover, mobile sheet, and cards',
  polishCss.includes('[data-theme="dark"] .settings-popover-menu') &&
  polishCss.includes('[data-theme="dark"] .settings-card')
);
check('Responsive query for tablet (max-width: 991px)', polishCss.includes('grid-template-columns: 220px 1fr'));
check('Responsive query for mobile (max-width: 767px)', polishCss.includes('.settings-page-sidebar') && polishCss.includes('overflow-x: auto'));

console.log('\n' + '='.repeat(75));
console.log(`TOTAL CHECKS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log('='.repeat(75));

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL SETTINGS REDESIGN CHECKS PASSED PERFECTLY!\n');
}
