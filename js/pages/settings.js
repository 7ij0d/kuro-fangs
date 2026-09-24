/**
 * KURO FANGS — SETTINGS PAGE
 * Full Dedicated Settings Experience matching media_1790281442628.jpg row 2
 * Desktop / iPad 2-Column Sidebar Layout & Mobile Responsive Flow
 * 
 * Tabs: General, Appearance, Audio, Account, Notifications, About, Support
 */

(function (window) {
  'use strict';

  const SettingsPage = {
    activeTab: 'general',

    TAB_DEFINITIONS: [
      { id: 'general', icon: 'settings', label_en: 'General', label_ar: 'عام', desc_en: 'Manage your language, theme, and general preferences.', desc_ar: 'إدارة لغة التطبيق، المظهر، والتفضيلات العامة.' },
      { id: 'appearance', icon: 'sun', label_en: 'Appearance', label_ar: 'المظهر', desc_en: 'Customize colors, theme modes, and character mascot.', desc_ar: 'تخصيص ألوان الواجهة، الوضع المظلم، وشخصية التميمة.' },
      { id: 'audio', icon: 'volume-2', label_en: 'Audio', label_ar: 'الصوتيات', desc_en: 'Audio lecture playback quality and sound effects.', desc_ar: 'إعدادات تشغيل التسجيلات الصوتية والمؤثرات التفاعلية.' },
      { id: 'account', icon: 'user', label_en: 'Account', label_ar: 'الحساب والأمان', desc_en: 'Student profile, password security, and cloud sync.', desc_ar: 'بيانات الطالب، أمان كلمة المرور، والمزامنة السحابية.' },
      { id: 'notifications', icon: 'bell', label_en: 'Notifications', label_ar: 'الإشعارات', desc_en: 'Manage study alerts and official faculty exam announcements.', desc_ar: 'تنبيهات المذاكرة وإعلانات الامتحانات الرسمية للكلية.' },
      { id: 'about', icon: 'info', label_en: 'About', label_ar: 'حول التطبيق', desc_en: 'Kuro Student dental curriculum platform information.', desc_ar: 'معلومات منصة طالب كورو الأكاديمية لطب وجراحة الفم والأسنان.' },
      { id: 'support', icon: 'help-circle', label_en: 'Help & Support', label_ar: 'المساعدة والدعم', desc_en: 'Frequently asked questions, study tips, and contact.', desc_ar: 'الأسئلة الشائعة، نصائح المذاكرة، والتواصل مع الدعم الفني.' }
    ],

    async render(container, queryParams) {
      const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
      const tabParam = queryParams?.get('tab');
      if (tabParam && this.TAB_DEFINITIONS.some(t => t.id === tabParam)) {
        this.activeTab = tabParam;
      }

      container.innerHTML = `
        <div class="settings-page-wrapper" id="settings-page-root">
          <!-- Mobile Top Bar -->
          <div class="settings-page-mobile-bar">
            <a href="#/" class="settings-page-back-link">
              <i data-lucide="${isAr ? 'arrow-right' : 'arrow-left'}"></i>
              <span>${isAr ? 'الإعدادات' : 'Settings'}</span>
            </a>
          </div>

          <div class="settings-page-layout">
            <!-- Left Sidebar Navigation (Desktop & iPad) -->
            <aside class="settings-page-sidebar">
              <div class="settings-sidebar-header">
                <i data-lucide="settings" class="settings-sidebar-icon"></i>
                <h2 class="settings-sidebar-title">${isAr ? 'الإعدادات' : 'Settings'}</h2>
              </div>

              <nav class="settings-sidebar-nav">
                ${this.TAB_DEFINITIONS.map(tab => `
                  <button
                    class="settings-sidebar-tab ${this.activeTab === tab.id ? 'active' : ''}"
                    data-tab="${tab.id}"
                    type="button"
                  >
                    <i data-lucide="${tab.icon}"></i>
                    <span>${isAr ? tab.label_ar : tab.label_en}</span>
                  </button>
                `).join('')}
              </nav>
            </aside>

            <!-- Right Content Stage -->
            <main class="settings-page-content" id="settings-tab-content">
              ${this.renderActiveTabContent(isAr)}
            </main>
          </div>
        </div>
      `;

      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }

      this.bindSidebarListeners(container, isAr);
    },

    bindSidebarListeners(container, isAr) {
      container.querySelectorAll('.settings-sidebar-tab').forEach(btn => {
        btn.addEventListener('click', () => {
          const tabId = btn.getAttribute('data-tab');
          this.activeTab = tabId;
          container.querySelectorAll('.settings-sidebar-tab').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const contentEl = container.querySelector('#settings-tab-content');
          if (contentEl) {
            contentEl.innerHTML = this.renderActiveTabContent(isAr);
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
              window.lucide.createIcons();
            }
            this.bindTabContentActions(contentEl, isAr);
          }
        });
      });

      const contentEl = container.querySelector('#settings-tab-content');
      if (contentEl) {
        this.bindTabContentActions(contentEl, isAr);
      }
    },

    renderActiveTabContent(isAr) {
      const tabDef = this.TAB_DEFINITIONS.find(t => t.id === this.activeTab) || this.TAB_DEFINITIONS[0];

      return `
        <div class="settings-tab-header">
          <h1 class="settings-tab-title">${isAr ? tabDef.label_ar : tabDef.label_en}</h1>
          <p class="settings-tab-desc">${isAr ? tabDef.desc_ar : tabDef.desc_en}</p>
        </div>

        <div class="settings-cards-list">
          ${this.getTabBodyHTML(this.activeTab, isAr)}
        </div>
      `;
    },

    getTabBodyHTML(tabId, isAr) {
      const currentLang = window.I18N ? window.I18N.getLang() : 'ar';
      const currentTheme = window.STORE ? window.STORE.getTheme() : 'light';
      const isDark = currentTheme === 'dark';
      const soundEnabled = window.SoundFX ? window.SoundFX.isEnabled() : true;
      const userInfo = JSON.parse(localStorage.getItem('kf_user_info') || '{}');

      switch (tabId) {
        case 'general':
          return `
            <!-- Language Setting Card -->
            <div class="settings-card">
              <div class="set-card-left">
                <div class="set-card-icon-box">
                  <i data-lucide="globe"></i>
                </div>
                <div class="set-card-meta">
                  <h3 class="set-card-title">${isAr ? 'اللغة' : 'Language'}</h3>
                  <p class="set-card-subtitle">${isAr ? 'اختر لغة العرض المفضلة لواجهة المنصة.' : 'Choose your preferred language.'}</p>
                </div>
              </div>
              <div class="set-card-action">
                <div class="settings-select-wrap">
                  <select id="settings-lang-select" class="settings-select-ctrl">
                    <option value="en" ${currentLang === 'en' ? 'selected' : ''}>English</option>
                    <option value="ar" ${currentLang === 'ar' ? 'selected' : ''}>العربية</option>
                  </select>
                  <i data-lucide="chevron-down" class="settings-select-arrow"></i>
                </div>
              </div>
            </div>

            <!-- Theme Setting Card -->
            <div class="settings-card">
              <div class="set-card-left">
                <div class="set-card-icon-box">
                  <i data-lucide="${isDark ? 'moon' : 'sun'}"></i>
                </div>
                <div class="set-card-meta">
                  <h3 class="set-card-title">${isAr ? 'المظهر' : 'Theme'}</h3>
                  <p class="set-card-subtitle">${isAr ? 'اختر مظهر ألوان المنصة المناسب لك.' : 'Choose your preferred theme.'}</p>
                </div>
              </div>
              <div class="set-card-action">
                <div class="settings-select-wrap">
                  <select id="settings-theme-select" class="settings-select-ctrl">
                    <option value="light" ${!isDark ? 'selected' : ''}>${isAr ? 'فاتح (Light)' : 'Light'}</option>
                    <option value="dark" ${isDark ? 'selected' : ''}>${isAr ? 'داكن (Dark)' : 'Dark'}</option>
                  </select>
                  <i data-lucide="chevron-down" class="settings-select-arrow"></i>
                </div>
              </div>
            </div>

            <!-- Sound Setting Card -->
            <div class="settings-card">
              <div class="set-card-left">
                <div class="set-card-icon-box">
                  <i data-lucide="${soundEnabled ? 'volume-2' : 'volume-x'}"></i>
                </div>
                <div class="set-card-meta">
                  <h3 class="set-card-title">${isAr ? 'المؤثرات الصوتية' : 'Sound'}</h3>
                  <p class="set-card-subtitle">${isAr ? 'تفعيل أو كتم أصوات النقر والإشعارات التفاعلية.' : 'Enable or disable system sounds.'}</p>
                </div>
              </div>
              <div class="set-card-action">
                <button type="button" class="settings-toggle-switch ${soundEnabled ? 'active' : ''}" id="settings-sound-switch">
                  <span class="settings-switch-thumb"></span>
                </button>
              </div>
            </div>
          `;

        case 'appearance':
          return `
            <div class="settings-card">
              <div class="set-card-left">
                <div class="set-card-icon-box">
                  <i data-lucide="palette"></i>
                </div>
                <div class="set-card-meta">
                  <h3 class="set-card-title">${isAr ? 'نمط الألوان الأكاديمي' : 'Color Mode'}</h3>
                  <p class="set-card-subtitle">${isAr ? 'نظام ألوان طالب كورو الرسمي (عاجي دافئ وبورغندي ملكي).' : 'Kuro Student official warm ivory and burgundy palette.'}</p>
                </div>
              </div>
              <div class="set-card-action">
                <span class="settings-badge-pill">${isAr ? 'معتمد رسمياً' : 'Official Palette'}</span>
              </div>
            </div>

            <div class="settings-card">
              <div class="set-card-left">
                <div class="set-card-icon-box">
                  <i data-lucide="smile"></i>
                </div>
                <div class="set-card-meta">
                  <h3 class="set-card-title">${isAr ? 'شخصية التميمة (كورو)' : 'Mascot Companion'}</h3>
                  <p class="set-card-subtitle">${isAr ? 'تميمة قط كورو التفاعلية المرافقة لك في رحلتك الدراسية.' : 'Interactive Kuro cat mascot companion.'}</p>
                </div>
              </div>
              <div class="set-card-action">
                <img src="assets/characters/kuro/Kuro-Idle.png" alt="Kuro" style="width: 38px; height: 38px; object-fit: contain;" />
              </div>
            </div>
          `;

        case 'audio':
          return `
            <div class="settings-card">
              <div class="set-card-left">
                <div class="set-card-icon-box">
                  <i data-lucide="headphones"></i>
                </div>
                <div class="set-card-meta">
                  <h3 class="set-card-title">${isAr ? 'جودة بث التسجيلات الصوتية' : 'Lecture Streaming Quality'}</h3>
                  <p class="set-card-subtitle">${isAr ? 'تحسين جودة الصوت تلقائياً وفق سرعة الاتصال بالإنترنت.' : 'Auto-optimize audio quality based on network speed.'}</p>
                </div>
              </div>
              <div class="set-card-action">
                <span class="settings-badge-pill">${isAr ? 'عالية (HQ)' : 'High (HQ)'}</span>
              </div>
            </div>

            <div class="settings-card">
              <div class="set-card-left">
                <div class="set-card-icon-box">
                  <i data-lucide="${soundEnabled ? 'volume-2' : 'volume-x'}"></i>
                </div>
                <div class="set-card-meta">
                  <h3 class="set-card-title">${isAr ? 'أصوات أزرار النظام' : 'UI Feedback Sounds'}</h3>
                  <p class="set-card-subtitle">${isAr ? 'نغمات التأكيد عند إتمام الكويزات أو النقاط.' : 'Chimes and feedback tones for quizzes and rewards.'}</p>
                </div>
              </div>
              <div class="set-card-action">
                <button type="button" class="settings-toggle-switch ${soundEnabled ? 'active' : ''}" id="settings-sound-switch-tab">
                  <span class="settings-switch-thumb"></span>
                </button>
              </div>
            </div>
          `;

        case 'account':
          return `
            <div class="settings-card">
              <div class="set-card-left">
                <div class="set-card-icon-box">
                  <i data-lucide="user-check"></i>
                </div>
                <div class="set-card-meta">
                  <h3 class="set-card-title">${userInfo.name || (isAr ? 'طالب طب أسنان' : 'Dental Student')}</h3>
                  <p class="set-card-subtitle">${isAr ? 'السنة الثالثة • كلية طب وجراحة الفم والأسنان – طرابلس' : 'Year 3 • Tripoli Faculty of Dentistry'}</p>
                </div>
              </div>
              <div class="set-card-action">
                <a href="#/profile" class="btn btn-sm btn-outline-primary" style="font-size:0.82rem;font-weight:700;">
                  ${isAr ? 'تعديل الملف الشخصي' : 'Edit Profile'}
                </a>
              </div>
            </div>

            <div class="settings-card">
              <div class="set-card-left">
                <div class="set-card-icon-box">
                  <i data-lucide="cloud"></i>
                </div>
                <div class="set-card-meta">
                  <h3 class="set-card-title">${isAr ? 'المزامنة السحابية' : 'Cloud Sync'}</h3>
                  <p class="set-card-subtitle">${isAr ? 'مزامنة الأسئلة المحفوظة، الملاحظات، وتقدم الشيتات.' : 'Sync saved quizzes, notes, and study bookmarks.'}</p>
                </div>
              </div>
              <div class="set-card-action">
                <span class="settings-badge-pill" style="background:rgba(16,185,129,0.1);color:#10B981;border-color:rgba(16,185,129,0.25);">
                  ${isAr ? 'متزامن ✓' : 'Synced ✓'}
                </span>
              </div>
            </div>

            <div class="settings-card">
              <div class="set-card-left">
                <div class="set-card-icon-box" style="background:rgba(239,68,68,0.08);color:#EF4444;border-color:rgba(239,68,68,0.2);">
                  <i data-lucide="log-out"></i>
                </div>
                <div class="set-card-meta">
                  <h3 class="set-card-title" style="color:#EF4444;">${isAr ? 'تسجيل الخروج' : 'Logout'}</h3>
                  <p class="set-card-subtitle">${isAr ? 'إنهاء الجلسة الحالية وتسجيل الخروج من الحساب.' : 'End current session and sign out of account.'}</p>
                </div>
              </div>
              <div class="set-card-action">
                <button type="button" class="btn btn-sm btn-danger" id="settings-logout-btn" style="background:#EF4444;border-color:#EF4444;font-size:0.82rem;font-weight:700;">
                  ${isAr ? 'تسجيل الخروج' : 'Sign Out'}
                </button>
              </div>
            </div>
          `;

        case 'notifications':
          return `
            <div class="settings-card">
              <div class="set-card-left">
                <div class="set-card-icon-box">
                  <i data-lucide="bell-ring"></i>
                </div>
                <div class="set-card-meta">
                  <h3 class="set-card-title">${isAr ? 'إعلانات الامتحانات الرسمية' : 'Exam & Schedule Announcements'}</h3>
                  <p class="set-card-subtitle">${isAr ? 'تنبيهات فورية بجدول امتحانات الدور الأول والثاني وإعلانات الكلية.' : 'Immediate notices on official faculty exam schedules.'}</p>
                </div>
              </div>
              <div class="set-card-action">
                <span class="settings-badge-pill" style="background:rgba(16,185,129,0.1);color:#10B981;border-color:rgba(16,185,129,0.25);">
                  ${isAr ? 'مفعلة' : 'Enabled'}
                </span>
              </div>
            </div>

            <div class="settings-card">
              <div class="set-card-left">
                <div class="set-card-icon-box">
                  <i data-lucide="book-open"></i>
                </div>
                <div class="set-card-meta">
                  <h3 class="set-card-title">${isAr ? 'شيتات ومحاضرات جديدة' : 'New Sheet Uploads'}</h3>
                  <p class="set-card-subtitle">${isAr ? 'تنبيه عند إضافة شيتات أو تسجيلات صوتية جديدة للمواد.' : 'Alerts when new lecture sheets or audios are added.'}</p>
                </div>
              </div>
              <div class="set-card-action">
                <span class="settings-badge-pill" style="background:rgba(16,185,129,0.1);color:#10B981;border-color:rgba(16,185,129,0.25);">
                  ${isAr ? 'مفعلة' : 'Enabled'}
                </span>
              </div>
            </div>
          `;

        case 'about':
          return `
            <div class="settings-card">
              <div class="set-card-left">
                <div class="set-card-icon-box">
                  <i data-lucide="shield-check"></i>
                </div>
                <div class="set-card-meta">
                  <h3 class="set-card-title">Kuro Student (طالب كورو)</h3>
                  <p class="set-card-subtitle">${isAr ? 'الإصدار 10.9 — المنصة الطلابية المتكاملة لطب وجراحة الفم والأسنان.' : 'Version 10.9 — The Comprehensive Dental Student Platform.'}</p>
                </div>
              </div>
              <div class="set-card-action">
                <span class="settings-badge-pill">v10.9</span>
              </div>
            </div>

            <div class="settings-card">
              <div class="set-card-left">
                <div class="set-card-icon-box">
                  <i data-lucide="graduation-cap"></i>
                </div>
                <div class="set-card-meta">
                  <h3 class="set-card-title">${isAr ? 'الدفعة 33 • كلية طب وجراحة الفم والأسنان' : 'Batch 33 • Faculty of Dentistry'}</h3>
                  <p class="set-card-subtitle">${isAr ? 'جامعة طرابلس – ليبيا (Tripoli Dental Faculty).' : 'University of Tripoli – Libya.'}</p>
                </div>
              </div>
              <div class="set-card-action">
                <span class="settings-badge-pill">${isAr ? 'السنة الثالثة' : 'Year 3'}</span>
              </div>
            </div>
          `;

        case 'support':
          return `
            <div class="settings-card">
              <div class="set-card-left">
                <div class="set-card-icon-box">
                  <i data-lucide="send"></i>
                </div>
                <div class="set-card-meta">
                  <h3 class="set-card-title">${isAr ? 'قناة التلغرام الرسمية للدفعة' : 'Batch Telegram Channel'}</h3>
                  <p class="set-card-subtitle">${isAr ? 'تابع آخر الشيتات، التسجيلات، وتحديثات الملازم الدراسية.' : 'Follow latest lecture sheets and batch announcements.'}</p>
                </div>
              </div>
              <div class="set-card-action">
                <a href="https://t.me/TripoliDentistryYear3" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary" style="background:#BC4A47;border-color:#BC4A47;font-size:0.82rem;font-weight:750;">
                  ${isAr ? 'فتح التلغرام' : 'Open Telegram'}
                </a>
              </div>
            </div>

            <div class="settings-card">
              <div class="set-card-left">
                <div class="set-card-icon-box">
                  <i data-lucide="keyboard"></i>
                </div>
                <div class="set-card-meta">
                  <h3 class="set-card-title">${isAr ? 'اختصارات لوحة المفاتيح' : 'Keyboard Shortcuts'}</h3>
                  <p class="set-card-subtitle">${isAr ? 'استخدم زر ESC لإغلاق القوائم، أو مفتاح المسافة لتقليب البطاقات.' : 'Use ESC to close modals, / to search, Space for flashcards.'}</p>
                </div>
              </div>
              <div class="set-card-action">
                <span class="settings-badge-pill">ESC / /</span>
              </div>
            </div>
          `;

        default:
          return '';
      }
    },

    bindTabContentActions(contentEl, isAr) {
      // Language select
      contentEl.querySelector('#settings-lang-select')?.addEventListener('change', (e) => {
        const newLang = e.target.value;
        if (window.I18N && window.I18N.getLang() !== newLang) {
          window.I18N.setLang(newLang);
          if (typeof window.applyLanguage === 'function') {
            window.applyLanguage(newLang);
          } else {
            document.documentElement.lang = newLang;
            document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
          }
          if (window.ROUTER?.handleRoute) window.ROUTER.handleRoute();
        }
      });

      // Theme select
      contentEl.querySelector('#settings-theme-select')?.addEventListener('change', (e) => {
        const newTheme = e.target.value;
        if (window.STORE) {
          window.STORE.setTheme(newTheme);
          if (typeof window.applyTheme === 'function') {
            window.applyTheme(newTheme);
          } else {
            document.documentElement.setAttribute('data-theme', newTheme);
            document.body.setAttribute('data-theme', newTheme);
          }
        }
      });

      // Sound switch
      const soundSwitch = contentEl.querySelector('#settings-sound-switch, #settings-sound-switch-tab');
      soundSwitch?.addEventListener('click', () => {
        if (window.SettingsMenu) {
          window.SettingsMenu.handleSoundToggle();
          const enabled = window.SoundFX ? window.SoundFX.isEnabled() : true;
          soundSwitch.classList.toggle('active', enabled);
        }
      });

      // Logout
      contentEl.querySelector('#settings-logout-btn')?.addEventListener('click', () => {
        if (window.SettingsMenu) {
          window.SettingsMenu.handleLogout(isAr);
        }
      });
    }
  };

  window.SettingsPage = SettingsPage;
})(window);
