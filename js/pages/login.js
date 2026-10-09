/**
 * KURO FANGS — DEDICATED LOGIN & AUTHENTICATION SCREEN
 * 1:1 Implementation of the Source-of-Truth Visual Direction (media_1790610106701.png)
 * Supports:
 *   1. Continue with Google (Primary Auth)
 *   2. Continue as Guest (Fast Explore Mode)
 *   Bi-directional Arabic / English typography, fluid responsive layout.
 */

(function (window) {
  'use strict';

  const LoginPage = {
    render(container, params) {
      if (!container) return;

      const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;

      // Ensure body has login class to hide normal sidebar and header
      document.body.classList.add('login-view-active');

      container.innerHTML = `
        <div class="kuro-login-viewport" dir="${isAr ? 'rtl' : 'ltr'}">
          <!-- Split Layout Container -->
          <div class="kuro-login-split-layout">
            
            <!-- ═══════════════════════════════════════════════════════════════
                 LEFT PANE: BRANDING, ACADEMIC FEATURES & STUDY ILLUSTRATION
                 ═══════════════════════════════════════════════════════════════ -->
            <section class="kuro-login-left-pane">
              <!-- Top Branding Emblem -->
              <div class="login-brand-header">
                <div class="login-brand-emblem-wrap" style="display:inline-flex;align-items:center;justify-content:center;background:rgba(125,30,48,0.1);border:1px solid rgba(125,30,48,0.2);">
                  <i data-lucide="graduation-cap" style="width:22px;height:22px;color:#7D1E30;"></i>
                </div>
                <div class="login-brand-meta">
                  <span class="login-brand-title">${isAr ? 'بوابة طب الأسنان • السنة الثالثة' : 'Dentistry Portal • Year 3'}</span>
                  <span class="login-brand-tagline">
                    ${isAr ? 'المنصة الأكاديمية الرسمية لطب وجراحة الفم والأسنان' : 'Official Academic Dental Study Portal'}
                  </span>
                </div>
              </div>

              <!-- Main Hero Headline -->
              <div class="login-headline-group">
                <h1 class="login-hero-title">
                  ${isAr ? 'تعلّم بذكاء،<br/><span class="login-hero-accent">وانطلق أبعد.</span>' : 'Study Smarter,<br/><span class="login-hero-accent">Go Further.</span>'}
                </h1>
                <p class="login-hero-subtext">
                  ${isAr 
                    ? 'وصول مباشر إلى شيتات المحاضرات، التسجيلات الصوتية المتزامنة، الامتحانات السابقة، والجداول الدراسية — كل ذلك في مكان واحد.' 
                    : 'Access lecture sheets, recordings, past exams, schedules and more — all in one place.'}
                </p>
              </div>

              <!-- 4 Feature Badges Grid -->
              <div class="login-features-list">
                <!-- 1. Sheets & Lectures -->
                <div class="login-feature-item">
                  <div class="login-feat-icon-box feat-icon-sheets">
                    <i data-lucide="book-open"></i>
                  </div>
                  <div class="login-feat-text">
                    <strong class="login-feat-title">${isAr ? 'الشيتات والمحاضرات' : 'Sheets & Lectures'}</strong>
                    <span class="login-feat-desc">${isAr ? 'مرتبة أكاديمياً حسب المواد' : 'Organized by subject'}</span>
                  </div>
                </div>

                <!-- 2. Audio Recordings -->
                <div class="login-feature-item">
                  <div class="login-feat-icon-box feat-icon-audio">
                    <i data-lucide="headphones"></i>
                  </div>
                  <div class="login-feat-text">
                    <strong class="login-feat-title">${isAr ? 'التسجيلات الصوتية' : 'Audio Recordings'}</strong>
                    <span class="login-feat-desc">${isAr ? 'متزامنة مباشرة مع الشيتات' : 'Synced with sheets'}</span>
                  </div>
                </div>

                <!-- 3. Past Exams & Practice -->
                <div class="login-feature-item">
                  <div class="login-feat-icon-box feat-icon-exams">
                    <i data-lucide="help-circle"></i>
                  </div>
                  <div class="login-feat-text">
                    <strong class="login-feat-title">${isAr ? 'الامتحانات السابقة والتدريب' : 'Past Exams & Practice'}</strong>
                    <span class="login-feat-desc">${isAr ? 'بنك أسئلة MCQs مع مراجع الشيتات' : 'Year-wise MCQs'}</span>
                  </div>
                </div>

                <!-- 4. Academic Schedules -->
                <div class="login-feature-item">
                  <div class="login-feat-icon-box feat-icon-schedules">
                    <i data-lucide="calendar"></i>
                  </div>
                  <div class="login-feat-text">
                    <strong class="login-feat-title">${isAr ? 'الجداول الأكاديمية' : 'Academic Schedules'}</strong>
                    <span class="login-feat-desc">${isAr ? 'المحاضرات النظرية والعيادات والامتحانات' : 'Lectures, clinics and exams'}</span>
                  </div>
                </div>
              </div>

              <!-- Cozy Desk Study Illustration -->
              <div class="login-desk-illustration-wrap">
                <img
                  src="assets/hero/kuro-study-desk.png"
                  alt="Study Desk"
                  class="login-desk-img"
                  loading="eager"
                  onerror="this.src='assets/hero/kuro-study-hero.png'"
                />
              </div>

              <!-- Cursive Artistic Tagline -->
              <div class="login-cursive-quote">
                ${isAr ? 'رحلة نجاحك في طب الأسنان تبدأ من هنا. 🤍' : 'A brighter dental journey starts here. ♡'}
              </div>
            </section>

            <!-- ═══════════════════════════════════════════════════════════════
                 RIGHT PANE: ELEVATED WHITE LOGIN CARD
                 ═══════════════════════════════════════════════════════════════ -->
            <section class="kuro-login-right-pane">
              <div class="kuro-login-card">
                
                <!-- Formal Academic Emblem -->
                <div class="login-card-mascot-wrap" style="display:flex;align-items:center;justify-content:center;width:68px;height:68px;margin:0 auto 14px;border-radius:20px;background:rgba(125,30,48,0.08);border:1px solid rgba(125,30,48,0.18);">
                  <i data-lucide="graduation-cap" style="width:34px;height:34px;color:#7D1E30;"></i>
                </div>

                <!-- Card Heading -->
                <h2 class="login-card-title">
                  ${isAr ? 'مرحباً بك في بوابة طب الأسنان' : 'Welcome to the Dentistry Portal'}
                </h2>
                <p class="login-card-subtitle">
                  ${isAr ? 'سجّل دخولك أو أنشئ حسابك لحفظ تقدّمك ومزامنة شيتاتك.' : 'Sign in or create an account to sync your study progress.'}
                </p>

                <!-- Mode Switcher Tabs -->
                <div class="login-tabs-container" role="tablist">
                  <button type="button" class="login-tab-pill active" id="tab-login-signin" role="tab" aria-selected="true">
                    <i data-lucide="log-in" style="width:14px;height:14px;"></i>
                    <span>${isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
                  </button>
                  <button type="button" class="login-tab-pill" id="tab-login-register" role="tab" aria-selected="false">
                    <i data-lucide="user-plus" style="width:14px;height:14px;"></i>
                    <span>${isAr ? 'إنشاء حساب جديد' : 'New Account'}</span>
                  </button>
                </div>

                <!-- Alert Message Box -->
                <div id="login-alert-box" class="login-alert-banner" style="display: none;"></div>

                <!-- Auth Form (Sign In / Register) -->
                <form id="kuro-auth-form" class="login-auth-form" novalidate>
                  <!-- Full Name Field (Hidden during Sign In) -->
                  <div class="login-input-row" id="row-auth-name" style="display: none;">
                    <label class="login-input-label" for="input-auth-name">
                      <span>${isAr ? 'الاسم الكامل' : 'Full Name'}</span>
                      <span class="login-input-label-hint">${isAr ? 'يظهر في ملفك الدراسي' : 'Student name'}</span>
                    </label>
                    <div class="login-input-wrap">
                      <div class="login-input-icon">
                        <i data-lucide="user"></i>
                      </div>
                      <input
                        type="text"
                        id="input-auth-name"
                        class="login-input-field"
                        placeholder="${isAr ? 'مثال: أحمد علي' : 'e.g. John Doe'}"
                        autocomplete="name"
                      />
                    </div>
                  </div>

                  <!-- Email Field -->
                  <div class="login-input-row" id="row-auth-email">
                    <label class="login-input-label" for="input-auth-email">
                      <span>${isAr ? 'البريد الإلكتروني' : 'Email Address'}</span>
                    </label>
                    <div class="login-input-wrap">
                      <div class="login-input-icon">
                        <i data-lucide="mail"></i>
                      </div>
                      <input
                        type="email"
                        id="input-auth-email"
                        class="login-input-field"
                        placeholder="${isAr ? 'student@gmail.com' : 'student@example.com'}"
                        autocomplete="email"
                        required
                      />
                    </div>
                  </div>

                  <!-- Password Field -->
                  <div class="login-input-row" id="row-auth-password">
                    <label class="login-input-label" for="input-auth-password">
                      <span>${isAr ? 'كلمة المرور' : 'Password'}</span>
                      <span class="login-input-label-hint" id="hint-auth-password">${isAr ? '6 خانات على الأقل' : '6+ characters'}</span>
                    </label>
                    <div class="login-input-wrap">
                      <div class="login-input-icon">
                        <i data-lucide="lock"></i>
                      </div>
                      <input
                        type="password"
                        id="input-auth-password"
                        class="login-input-field"
                        placeholder="••••••••"
                        autocomplete="current-password"
                        required
                      />
                      <button type="button" class="login-pwd-toggle" id="btn-toggle-password" title="${isAr ? 'إظهار/إخفاء كلمة المرور' : 'Toggle password'}">
                        <i data-lucide="eye" style="width:16px;height:16px;"></i>
                      </button>
                    </div>
                  </div>

                  <!-- Submit Action Button -->
                  <button type="submit" id="btn-auth-submit" class="login-submit-btn">
                    <i data-lucide="arrow-right" class="login-submit-icon" style="width:16px;height:16px;"></i>
                    <span id="btn-auth-submit-text">${isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
                  </button>
                </form>

                <!-- Divider: "──────── or ────────" -->
                <div class="login-card-divider">
                  <span class="login-divider-text">${isAr ? 'أو المتابعة السريعة' : 'or quick access'}</span>
                </div>

                <!-- Secondary Action: Continue as Guest -->
                <button
                  type="button"
                  id="btn-login-guest"
                  class="login-btn-guest"
                  aria-label="${isAr ? 'الدخول كزائر' : 'Continue as Guest'}"
                >
                  <div class="login-btn-guest-left">
                    <div class="login-guest-icon-box">
                      <i data-lucide="compass"></i>
                    </div>
                    <span class="login-btn-guest-text">
                      ${isAr ? 'المتابعة كزائر (بدون حساب)' : 'Continue as Guest'}
                    </span>
                  </div>
                  <i data-lucide="${isAr ? 'chevron-left' : 'chevron-right'}" class="login-btn-chevron"></i>
                </button>

                <!-- Sub-caption under Guest -->
                <p class="login-guest-note">
                  ${isAr 
                    ? 'استكشف المنصة وجميع الشيتات فوراً كزائر، ويمكنك إنشاء حسابك لاحقاً لحفظ ملاحظاتك.' 
                    : 'Explore all sheets instantly as a guest, and create an account later to save notes.'}
                </p>

                <!-- Tertiary Action: Continue with Google -->
                <button
                  type="button"
                  id="btn-login-google"
                  class="login-btn-google"
                  style="margin-bottom: 16px;"
                  aria-label="${isAr ? 'المتابعة بحساب Google' : 'Continue with Google'}"
                >
                  <div class="login-btn-google-left">
                    <svg class="google-svg-logo" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span class="login-btn-google-text">
                      ${isAr ? 'المتابعة بحساب Google' : 'Continue with Google'}
                    </span>
                  </div>
                  <i data-lucide="${isAr ? 'chevron-left' : 'chevron-right'}" class="login-btn-chevron"></i>
                </button>

                <!-- 3 Micro Benefit Badges -->
                <div class="login-card-badges-row">
                  <!-- 1. Fast Access -->
                  <div class="login-micro-badge">
                    <div class="micro-badge-icon micro-icon-cap">
                      <i data-lucide="graduation-cap"></i>
                    </div>
                    <strong class="micro-badge-title">${isAr ? 'وصول سريع' : 'Fast Access'}</strong>
                    <span class="micro-badge-desc">${isAr ? 'ادرس فوراً دون انتظار' : 'Get to study materials instantly'}</span>
                  </div>

                  <!-- 2. No Personal Data -->
                  <div class="login-micro-badge">
                    <div class="micro-badge-icon micro-icon-shield">
                      <i data-lucide="shield-check"></i>
                    </div>
                    <strong class="micro-badge-title">${isAr ? 'خصوصية تامة' : 'No Personal Data'}</strong>
                    <span class="micro-badge-desc">${isAr ? 'وضع الزائر يحفظ خصوصيتك' : 'Guest mode keeps your information private'}</span>
                  </div>

                  <!-- 3. Study Anywhere -->
                  <div class="login-micro-badge">
                    <div class="micro-badge-icon micro-icon-devices">
                      <i data-lucide="monitor"></i>
                    </div>
                    <strong class="micro-badge-title">${isAr ? 'في كل مكان' : 'Study Anywhere'}</strong>
                    <span class="micro-badge-desc">${isAr ? 'على أي جهاز وفي أي وقت' : 'On any device, anytime'}</span>
                  </div>
                </div>

                <!-- Footer Terms & Privacy Policy -->
                <footer class="login-card-footer">
                  <p class="login-footer-text">
                    ${isAr
                      ? 'بالمتابعة، فإنك توافق على <a href="#/terms" class="login-link">شروط الاستخدام</a> و <a href="#/privacy" class="login-link">سياسة الخصوصية</a>.'
                      : 'By continuing, you agree to our <a href="#/terms" class="login-link">Terms of Service</a> and <a href="#/privacy" class="login-link">Privacy Policy</a>.'}
                  </p>
                </footer>

              </div>
            </section>

          </div>
        </div>
      `;

      this.bindEvents(container, params);

      // Recreate Lucide icons inside login card
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    },

    bindEvents(container, params) {
      const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
      let activeMode = 'signin'; // 'signin' | 'register'

      const tabSignIn = container.querySelector('#tab-login-signin');
      const tabRegister = container.querySelector('#tab-login-register');
      const nameRow = container.querySelector('#row-auth-name');
      const nameInput = container.querySelector('#input-auth-name');
      const emailInput = container.querySelector('#input-auth-email');
      const passwordInput = container.querySelector('#input-auth-password');
      const pwdToggle = container.querySelector('#btn-toggle-password');
      const submitBtn = container.querySelector('#btn-auth-submit');
      const submitText = container.querySelector('#btn-auth-submit-text');
      const alertBox = container.querySelector('#login-alert-box');
      const form = container.querySelector('#kuro-auth-form');

      function showAlert(msg, type = 'error') {
        if (!alertBox) return;
        alertBox.className = `login-alert-banner ${type}`;
        alertBox.textContent = msg;
        alertBox.style.display = 'block';
      }

      function hideAlert() {
        if (alertBox) alertBox.style.display = 'none';
      }

      // Check query params for redirected feedback (e.g. google_pending_client_id)
      const hashQuery = window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '';
      const urlParams = params || new URLSearchParams(hashQuery || window.location.search);
      const authError = urlParams ? urlParams.get('error') : null;

      if (authError === 'google_pending_client_id') {
        showAlert(
          isAr
            ? '⚡ التسجيل الذاتي المستقل متاح فوراً! أدخل بريدك الإلكتروني وكلمة المرور أدناه لإنشاء حسابك أو الدخول مباشرة.'
            : '⚡ Direct registration is available! Enter your email and password below to sign in or create your account.',
          'info'
        );
      }

      // 1. Tab Switcher
      function setMode(mode) {
        activeMode = mode;
        hideAlert();
        if (mode === 'signin') {
          tabSignIn?.classList.add('active');
          tabRegister?.classList.remove('active');
          tabSignIn?.setAttribute('aria-selected', 'true');
          tabRegister?.setAttribute('aria-selected', 'false');
          if (nameRow) nameRow.style.display = 'none';
          if (submitText) submitText.textContent = isAr ? 'تسجيل الدخول' : 'Sign In';
          if (passwordInput) passwordInput.setAttribute('autocomplete', 'current-password');
        } else {
          tabRegister?.classList.add('active');
          tabSignIn?.classList.remove('active');
          tabRegister?.setAttribute('aria-selected', 'true');
          tabSignIn?.setAttribute('aria-selected', 'false');
          if (nameRow) nameRow.style.display = 'flex';
          if (submitText) submitText.textContent = isAr ? 'إنشاء الحساب وبدء الدراسة ✨' : 'Create Account & Begin ✨';
          if (passwordInput) passwordInput.setAttribute('autocomplete', 'new-password');
        }
        if (window.lucide) window.lucide.createIcons();
      }

      tabSignIn?.addEventListener('click', () => setMode('signin'));
      tabRegister?.addEventListener('click', () => setMode('register'));

      // 2. Toggle Password Visibility
      pwdToggle?.addEventListener('click', () => {
        if (!passwordInput) return;
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
        pwdToggle.innerHTML = isPassword
          ? `<i data-lucide="eye-off" style="width:16px;height:16px;"></i>`
          : `<i data-lucide="eye" style="width:16px;height:16px;"></i>`;
        if (window.lucide) window.lucide.createIcons();
      });

      // 3. Form Submission (Sign In or Sign Up)
      form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideAlert();

        const email = (emailInput?.value || '').trim();
        const password = passwordInput?.value || '';
        const fullName = (nameInput?.value || '').trim();

        if (!email) {
          showAlert(isAr ? 'يرجى إدخال البريد الإلكتروني.' : 'Please enter your email.');
          emailInput?.focus();
          return;
        }

        if (!password) {
          showAlert(isAr ? 'يرجى إدخال كلمة المرور.' : 'Please enter your password.');
          passwordInput?.focus();
          return;
        }

        if (activeMode === 'register' && password.length < 6) {
          showAlert(isAr ? 'كلمة المرور يجب أن تكون 6 خانات على الأقل.' : 'Password must be at least 6 characters.');
          passwordInput?.focus();
          return;
        }

        submitBtn.disabled = true;
        const originalText = submitText?.textContent;
        if (submitText) submitText.textContent = isAr ? 'جارٍ التحقق...' : 'Verifying...';

        try {
          if (activeMode === 'signin') {
            const res = await (window.AUTH?.signInWithEmail
              ? window.AUTH.signInWithEmail(email, password)
              : window.SupabaseAuth?.signInWithEmail(email, password));

            if (res && res.error) {
              showAlert(res.error, 'error');
            }
          } else {
            const res = await (window.AUTH?.signUpWithEmail
              ? window.AUTH.signUpWithEmail(email, password, fullName)
              : window.SupabaseAuth?.signUpWithEmail(email, password, fullName));

            if (res && res.error) {
              showAlert(res.error, 'error');
            }
          }
        } catch (err) {
          showAlert(err.message || (isAr ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred'), 'error');
        } finally {
          submitBtn.disabled = false;
          if (submitText) submitText.textContent = originalText;
        }
      });

      // 4. Continue with Google click handler
      const googleBtn = container.querySelector('#btn-login-google');
      if (googleBtn) {
        googleBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          hideAlert();
          googleBtn.disabled = true;
          googleBtn.style.opacity = '0.7';

          try {
            if (window.AUTH && typeof window.AUTH.signInWithGoogle === 'function') {
              const res = await window.AUTH.signInWithGoogle();
              if (res && res.isConfigError) {
                showAlert(
                  isAr 
                    ? 'تسجيل Google يتطلب إعداد مفاتيح Google Cloud. يمكنك التسجيل فوراً بالبريد الإلكتروني أعلاه.' 
                    : 'Google login requires Google Cloud setup. Please use email & password above.',
                  'info'
                );
              }
            } else if (window.SupabaseAuth && typeof window.SupabaseAuth.signInWithGoogle === 'function') {
              await window.SupabaseAuth.signInWithGoogle();
            }
          } catch (err) {
            console.error('[LoginPage] Google sign-in failed:', err);
          } finally {
            googleBtn.disabled = false;
            googleBtn.style.opacity = '1';
          }
        });
      }

      // 5. Continue as Guest click handler
      const guestBtn = container.querySelector('#btn-login-guest');
      if (guestBtn) {
        guestBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (window.AUTH && typeof window.AUTH.continueAsGuest === 'function') {
            window.AUTH.continueAsGuest();
          } else {
            localStorage.setItem('kf_auth_mode', 'guest');
            window.location.hash = '#/';
          }
        });
      }
    }
  };

  // Expose to window
  window.LoginPage = LoginPage;

})(window);
