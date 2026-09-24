/**
 * KURO FANGS — SETTINGS MENU & CONTROLLER
 * Unifies Language, Theme, Sound, Profile, Account, Notifications, and Support
 * into ONE clean popover (Desktop / iPad) and slide-up bottom sheet (Mobile).
 * Exact visual matching of media_1790281442628.jpg
 */

(function (window) {
  'use strict';

  const SettingsMenu = {
    isOpen: false,
    isMobile: false,

    init() {
      const gearBtn = document.getElementById('header-settings-btn');
      if (!gearBtn) return;

      this.checkViewport();
      window.addEventListener('resize', () => this.checkViewport());

      gearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });

      // Outside click handler
      document.addEventListener('click', (e) => {
        if (!this.isOpen) return;
        const popover = document.getElementById('settings-popover-menu');
        const mobileSheet = document.getElementById('settings-mobile-sheet');
        const gearBtn = document.getElementById('header-settings-btn');

        if (popover && !popover.contains(e.target) && !gearBtn.contains(e.target)) {
          this.close();
        }
        if (mobileSheet && !mobileSheet.contains(e.target) && !gearBtn.contains(e.target)) {
          this.close();
        }
      });

      // ESC key handler
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });

      // Close backdrop click
      const backdrop = document.getElementById('settings-mobile-sheet-backdrop');
      if (backdrop) {
        backdrop.addEventListener('click', () => this.close());
      }
    },

    checkViewport() {
      this.isMobile = window.innerWidth < 768;
    },

    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    },

    open() {
      this.isOpen = true;
      const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
      const gearBtn = document.getElementById('header-settings-btn');
      if (gearBtn) gearBtn.setAttribute('aria-expanded', 'true');

      if (this.isMobile) {
        this.renderMobileSheet(isAr);
      } else {
        this.renderDesktopPopover(isAr);
      }

      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    },

    close() {
      this.isOpen = false;
      const gearBtn = document.getElementById('header-settings-btn');
      if (gearBtn) gearBtn.setAttribute('aria-expanded', 'false');

      const popover = document.getElementById('settings-popover-menu');
      if (popover) {
        popover.style.display = 'none';
        popover.classList.remove('open');
      }

      const mobileSheet = document.getElementById('settings-mobile-sheet');
      const backdrop = document.getElementById('settings-mobile-sheet-backdrop');
      if (mobileSheet) {
        mobileSheet.classList.remove('open');
      }
      if (backdrop) {
        backdrop.classList.remove('open');
      }
    },

    /**
     * Desktop / iPad Floating Popover Panel
     */
    renderDesktopPopover(isAr) {
      const popover = document.getElementById('settings-popover-menu');
      if (!popover) return;

      const currentLang = window.I18N ? window.I18N.getLang() : 'ar';
      const langLabel = currentLang === 'ar' ? 'العربية' : 'English';
      const currentTheme = window.STORE ? window.STORE.getTheme() : 'light';
      const isDark = currentTheme === 'dark';
      const themeLabel = isDark
        ? (isAr ? 'داكن' : 'Dark')
        : (isAr ? 'فاتح' : 'Light');
      const soundEnabled = window.SoundFX ? window.SoundFX.isEnabled() : true;

      popover.innerHTML = `
        <div class="settings-popover-inner">
          <div class="settings-popover-header">
            <h3 class="settings-popover-title">${isAr ? 'الإعدادات' : 'Settings'}</h3>
          </div>

          <!-- Section 1: Quick Controls -->
          <div class="settings-menu-section">
            <!-- Language Toggle Row -->
            <button class="settings-menu-item" id="set-row-language" type="button">
              <div class="set-item-left">
                <i data-lucide="globe" class="set-item-icon"></i>
                <span class="set-item-label">${isAr ? 'اللغة' : 'Language'}</span>
              </div>
              <div class="set-item-right">
                <span class="set-item-val">${langLabel}</span>
                <i data-lucide="${isAr ? 'chevron-left' : 'chevron-right'}" class="set-chevron"></i>
              </div>
            </button>

            <!-- Theme Toggle Row -->
            <button class="settings-menu-item" id="set-row-theme" type="button">
              <div class="set-item-left">
                <i data-lucide="${isDark ? 'moon' : 'sun'}" class="set-item-icon"></i>
                <span class="set-item-label">${isAr ? 'المظهر' : 'Theme'}</span>
              </div>
              <div class="set-item-right">
                <span class="set-item-val">${themeLabel}</span>
                <i data-lucide="${isAr ? 'chevron-left' : 'chevron-right'}" class="set-chevron"></i>
              </div>
            </button>

            <!-- Sound Toggle Row -->
            <div class="settings-menu-item set-item-clickable" id="set-row-sound">
              <div class="set-item-left">
                <i data-lucide="${soundEnabled ? 'volume-2' : 'volume-x'}" class="set-item-icon"></i>
                <span class="set-item-label">${isAr ? 'الصوت' : 'Sound'}</span>
              </div>
              <div class="set-item-right">
                <button type="button" class="settings-toggle-switch ${soundEnabled ? 'active' : ''}" id="set-switch-sound" aria-label="Toggle Sound">
                  <span class="settings-switch-thumb"></span>
                </button>
              </div>
            </div>
          </div>

          <div class="settings-menu-divider"></div>

          <!-- Section 2: Account & Identity -->
          <div class="settings-menu-section">
            <a href="#/profile" class="settings-menu-item set-nav-link" id="set-row-profile">
              <div class="set-item-left">
                <i data-lucide="user" class="set-item-icon"></i>
                <span class="set-item-label">${isAr ? 'الملف الشخصي' : 'Profile'}</span>
              </div>
              <div class="set-item-right">
                <i data-lucide="${isAr ? 'chevron-left' : 'chevron-right'}" class="set-chevron"></i>
              </div>
            </a>

            <a href="#/settings?tab=account" class="settings-menu-item set-nav-link" id="set-row-account">
              <div class="set-item-left">
                <i data-lucide="shield-check" class="set-item-icon"></i>
                <span class="set-item-label">${isAr ? 'الحساب والأمان' : 'Account & Security'}</span>
              </div>
              <div class="set-item-right">
                <i data-lucide="${isAr ? 'chevron-left' : 'chevron-right'}" class="set-chevron"></i>
              </div>
            </a>

            <button class="settings-menu-item" id="set-row-notifications" type="button">
              <div class="set-item-left">
                <i data-lucide="bell" class="set-item-icon"></i>
                <span class="set-item-label">${isAr ? 'الإشعارات' : 'Notifications'}</span>
              </div>
              <div class="set-item-right">
                <i data-lucide="${isAr ? 'chevron-left' : 'chevron-right'}" class="set-chevron"></i>
              </div>
            </button>
          </div>

          <div class="settings-menu-divider"></div>

          <!-- Section 3: Info & Support -->
          <div class="settings-menu-section">
            <a href="#/settings?tab=about" class="settings-menu-item set-nav-link" id="set-row-about">
              <div class="set-item-left">
                <i data-lucide="info" class="set-item-icon"></i>
                <span class="set-item-label">${isAr ? 'حول طالب كورو' : 'About Kuro Student'}</span>
              </div>
              <div class="set-item-right">
                <i data-lucide="${isAr ? 'chevron-left' : 'chevron-right'}" class="set-chevron"></i>
              </div>
            </a>

            <a href="#/settings?tab=support" class="settings-menu-item set-nav-link" id="set-row-support">
              <div class="set-item-left">
                <i data-lucide="help-circle" class="set-item-icon"></i>
                <span class="set-item-label">${isAr ? 'المساعدة والدعم' : 'Help & Support'}</span>
              </div>
              <div class="set-item-right">
                <i data-lucide="${isAr ? 'chevron-left' : 'chevron-right'}" class="set-chevron"></i>
              </div>
            </a>
          </div>

          <div class="settings-menu-divider"></div>

          <!-- Section 4: Logout Action -->
          <div class="settings-menu-section">
            <button class="settings-menu-item set-item-logout" id="set-row-logout" type="button">
              <div class="set-item-left">
                <i data-lucide="log-out" class="set-item-icon"></i>
                <span class="set-item-label">${isAr ? 'تسجيل الخروج' : 'Logout'}</span>
              </div>
            </button>
          </div>
        </div>
      `;

      popover.style.display = 'block';
      popover.classList.add('open');
      this.bindActions(popover, isAr);
    },

    /**
     * Mobile Slide-in Bottom Sheet Menu
     */
    renderMobileSheet(isAr) {
      const mobileSheet = document.getElementById('settings-mobile-sheet');
      const backdrop = document.getElementById('settings-mobile-sheet-backdrop');
      if (!mobileSheet) return;

      const currentLang = window.I18N ? window.I18N.getLang() : 'ar';
      const langLabel = currentLang === 'ar' ? 'العربية' : 'English';
      const currentTheme = window.STORE ? window.STORE.getTheme() : 'light';
      const isDark = currentTheme === 'dark';
      const themeLabel = isDark
        ? (isAr ? 'داكن' : 'Dark')
        : (isAr ? 'فاتح' : 'Light');
      const soundEnabled = window.SoundFX ? window.SoundFX.isEnabled() : true;

      mobileSheet.innerHTML = `
        <div class="settings-mobile-handle-bar">
          <div class="settings-mobile-handle"></div>
        </div>

        <div class="settings-mobile-header">
          <h3 class="settings-popover-title">${isAr ? 'الإعدادات' : 'Settings'}</h3>
          <button class="settings-mobile-close" id="set-mobile-close-btn" type="button" aria-label="Close">
            <i data-lucide="x"></i>
          </button>
        </div>

        <div class="settings-mobile-scroll">
          <!-- General Section -->
          <div class="settings-mobile-group-title">${isAr ? 'عام' : 'General'}</div>
          <div class="settings-menu-section">
            <button class="settings-menu-item" id="set-row-language-mob" type="button">
              <div class="set-item-left">
                <i data-lucide="globe" class="set-item-icon"></i>
                <span class="set-item-label">${isAr ? 'اللغة' : 'Language'}</span>
              </div>
              <div class="set-item-right">
                <span class="set-item-val">${langLabel}</span>
                <i data-lucide="${isAr ? 'chevron-left' : 'chevron-right'}" class="set-chevron"></i>
              </div>
            </button>

            <button class="settings-menu-item" id="set-row-theme-mob" type="button">
              <div class="set-item-left">
                <i data-lucide="${isDark ? 'moon' : 'sun'}" class="set-item-icon"></i>
                <span class="set-item-label">${isAr ? 'المظهر' : 'Theme'}</span>
              </div>
              <div class="set-item-right">
                <span class="set-item-val">${themeLabel}</span>
                <i data-lucide="${isAr ? 'chevron-left' : 'chevron-right'}" class="set-chevron"></i>
              </div>
            </button>

            <div class="settings-menu-item set-item-clickable" id="set-row-sound-mob">
              <div class="set-item-left">
                <i data-lucide="${soundEnabled ? 'volume-2' : 'volume-x'}" class="set-item-icon"></i>
                <span class="set-item-label">${isAr ? 'الصوت' : 'Sound'}</span>
              </div>
              <div class="set-item-right">
                <button type="button" class="settings-toggle-switch ${soundEnabled ? 'active' : ''}" id="set-switch-sound-mob" aria-label="Toggle Sound">
                  <span class="settings-switch-thumb"></span>
                </button>
              </div>
            </div>
          </div>

          <!-- Account Section -->
          <div class="settings-mobile-group-title">${isAr ? 'الحساب' : 'Account'}</div>
          <div class="settings-menu-section">
            <a href="#/profile" class="settings-menu-item set-nav-link" id="set-row-profile-mob">
              <div class="set-item-left">
                <i data-lucide="user" class="set-item-icon"></i>
                <span class="set-item-label">${isAr ? 'الملف الشخصي' : 'Profile'}</span>
              </div>
              <div class="set-item-right">
                <i data-lucide="${isAr ? 'chevron-left' : 'chevron-right'}" class="set-chevron"></i>
              </div>
            </a>

            <a href="#/settings?tab=account" class="settings-menu-item set-nav-link" id="set-row-account-mob">
              <div class="set-item-left">
                <i data-lucide="shield-check" class="set-item-icon"></i>
                <span class="set-item-label">${isAr ? 'الحساب والأمان' : 'Account & Security'}</span>
              </div>
              <div class="set-item-right">
                <i data-lucide="${isAr ? 'chevron-left' : 'chevron-right'}" class="set-chevron"></i>
              </div>
            </a>

            <button class="settings-menu-item" id="set-row-notifications-mob" type="button">
              <div class="set-item-left">
                <i data-lucide="bell" class="set-item-icon"></i>
                <span class="set-item-label">${isAr ? 'الإشعارات' : 'Notifications'}</span>
              </div>
              <div class="set-item-right">
                <i data-lucide="${isAr ? 'chevron-left' : 'chevron-right'}" class="set-chevron"></i>
              </div>
            </button>
          </div>

          <!-- Other Section -->
          <div class="settings-mobile-group-title">${isAr ? 'أخرى' : 'Other'}</div>
          <div class="settings-menu-section">
            <a href="#/settings?tab=about" class="settings-menu-item set-nav-link" id="set-row-about-mob">
              <div class="set-item-left">
                <i data-lucide="info" class="set-item-icon"></i>
                <span class="set-item-label">${isAr ? 'حول طالب كورو' : 'About Kuro Student'}</span>
              </div>
              <div class="set-item-right">
                <i data-lucide="${isAr ? 'chevron-left' : 'chevron-right'}" class="set-chevron"></i>
              </div>
            </a>

            <a href="#/settings?tab=support" class="settings-menu-item set-nav-link" id="set-row-support-mob">
              <div class="set-item-left">
                <i data-lucide="help-circle" class="set-item-icon"></i>
                <span class="set-item-label">${isAr ? 'المساعدة والدعم' : 'Help & Support'}</span>
              </div>
              <div class="set-item-right">
                <i data-lucide="${isAr ? 'chevron-left' : 'chevron-right'}" class="set-chevron"></i>
              </div>
            </a>

            <button class="settings-menu-item set-item-logout" id="set-row-logout-mob" type="button">
              <div class="set-item-left">
                <i data-lucide="log-out" class="set-item-icon"></i>
                <span class="set-item-label">${isAr ? 'تسجيل الخروج' : 'Logout'}</span>
              </div>
            </button>
          </div>
        </div>
      `;

      mobileSheet.classList.add('open');
      if (backdrop) backdrop.classList.add('open');
      this.bindActions(mobileSheet, isAr);

      mobileSheet.querySelector('#set-mobile-close-btn')?.addEventListener('click', () => {
        this.close();
      });
    },

    /**
     * Attach Event Listeners to Settings Menu items
     */
    bindActions(container, isAr) {
      // 1. Language Toggle
      const langBtn = container.querySelector('#set-row-language, #set-row-language-mob');
      langBtn?.addEventListener('click', () => {
        this.handleLangToggle();
      });

      // 2. Theme Toggle
      const themeBtn = container.querySelector('#set-row-theme, #set-row-theme-mob');
      themeBtn?.addEventListener('click', () => {
        this.handleThemeToggle();
      });

      // 3. Sound Toggle Switch
      const soundRow = container.querySelector('#set-row-sound, #set-row-sound-mob');
      const soundSwitch = container.querySelector('#set-switch-sound, #set-switch-sound-mob');
      const toggleSound = (e) => {
        e.stopPropagation();
        this.handleSoundToggle();
      };
      soundRow?.addEventListener('click', toggleSound);
      soundSwitch?.addEventListener('click', toggleSound);

      // 4. Notifications Center trigger
      const notifBtn = container.querySelector('#set-row-notifications, #set-row-notifications-mob');
      notifBtn?.addEventListener('click', () => {
        this.close();
        if (window.NotificationsCenter && typeof window.NotificationsCenter.toggle === 'function') {
          window.NotificationsCenter.toggle();
        } else {
          window.location.hash = '#/settings?tab=notifications';
        }
      });

      // 5. Navigation Links
      container.querySelectorAll('.set-nav-link').forEach(link => {
        link.addEventListener('click', () => {
          this.close();
        });
      });

      // 6. Logout Action
      const logoutBtn = container.querySelector('#set-row-logout, #set-row-logout-mob');
      logoutBtn?.addEventListener('click', () => {
        this.handleLogout(isAr);
      });
    },

    handleLangToggle() {
      if (!window.I18N) return;
      const newLang = window.I18N.toggleLang();
      if (window.SoundFX) window.SoundFX.play('pop');

      // Update global UI
      if (typeof window.applyLanguage === 'function') {
        window.applyLanguage(newLang);
      } else {
        document.documentElement.lang = newLang;
        document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
      }

      if (window.ROUTER?.handleRoute) {
        window.ROUTER.handleRoute();
      }

      this.updateUI();
      if (this.isOpen) {
        this.open(); // Re-render menu in new language
      }
    },

    handleThemeToggle() {
      if (!window.STORE) return;
      const newTheme = window.STORE.toggleTheme();
      if (window.SoundFX) window.SoundFX.play('switch');

      if (typeof window.applyTheme === 'function') {
        window.applyTheme(newTheme);
      } else {
        document.documentElement.setAttribute('data-theme', newTheme);
        document.body.setAttribute('data-theme', newTheme);
      }

      this.updateUI();
      if (this.isOpen) {
        this.open();
      }
    },

    handleSoundToggle() {
      if (!window.SoundFX) return;
      const newState = window.SoundFX.toggle();
      const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;

      if (window.Toast) {
        window.Toast.show(
          newState
            ? (isAr ? 'تم تفعيل المؤثرات الصوتية 🔊' : 'Sound Effects Enabled 🔊')
            : (isAr ? 'تم كتم المؤثرات الصوتية 🔇' : 'Sound Effects Muted 🔇'),
          'info'
        );
      }

      this.updateUI();
      if (this.isOpen) {
        this.open();
      }
    },

    handleLogout(isAr) {
      this.close();
      const confirmMsg = isAr
        ? 'هل أنت متأكد من رغبتك في تسجيل الخروج؟'
        : 'Are you sure you want to log out?';

      if (window.confirm(confirmMsg)) {
        if (window.SupabaseAuth && typeof window.SupabaseAuth.signOut === 'function') {
          window.SupabaseAuth.signOut();
        } else {
          localStorage.removeItem('kf_user_info');
          localStorage.removeItem('supabase_auth_token');
          if (window.Toast) {
            window.Toast.show(
              isAr ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully',
              'info'
            );
          }
          window.location.hash = '#/';
          setTimeout(() => window.location.reload(), 300);
        }
      }
    },

    updateUI() {
      const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
      const gearBtn = document.getElementById('header-settings-btn');
      if (gearBtn) {
        gearBtn.title = isAr ? 'الإعدادات' : 'Settings';
        gearBtn.setAttribute('aria-label', isAr ? 'الإعدادات' : 'Settings');
      }
    }
  };

  window.SettingsMenu = SettingsMenu;
})(window);
