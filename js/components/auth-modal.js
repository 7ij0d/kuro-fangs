/**
 * KURO FANGS — AUTHENTICATION MODAL COMPONENT
 * Beautiful Floating Modal for Optional Supabase Sign-in, Sign-up, Google OAuth, and Password Reset.
 */

window.AuthModal = (function () {
  let modalEl = null;
  let activeTab = 'signin'; // 'signin' | 'signup' | 'forgot'

  function ensureModal() {
    if (!modalEl || !document.body.contains(modalEl)) {
      modalEl = document.getElementById('auth-modal-backdrop');
      if (!modalEl) {
        modalEl = document.createElement('div');
        modalEl.id = 'auth-modal-backdrop';
        modalEl.className = 'auth-modal-backdrop';
        modalEl.setAttribute('aria-hidden', 'true');
        modalEl.innerHTML = `
          <div class="auth-modal-box" id="auth-modal-box" role="dialog" aria-modal="true"></div>
        `;
        document.body.appendChild(modalEl);

        // Click outside to close (or continue as guest)
        modalEl.addEventListener('click', (e) => {
          if (e.target === modalEl) {
            close();
          }
        });
      }
    }
    return modalEl;
  }

  function renderModalContent() {
    const box = document.getElementById('auth-modal-box');
    if (!box) return;

    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;

    box.innerHTML = `
      <div class="auth-modal-header">
        <div class="auth-brand-badge">
          <span class="auth-brand-icon">🦷</span>
          <div class="auth-brand-info">
            <h3 class="auth-modal-title">${isAr ? 'حساب الطالب الأكاديمي' : 'Student Academic Account'}</h3>
            <span class="auth-modal-sub">${isAr ? 'مزامنة اختيارية مجانية 100% بالسحابة' : '100% Optional Cloud Synchronization'}</span>
          </div>
        </div>
        <button class="auth-close-btn" onclick="window.AuthModal.close()" aria-label="Close">
          <i data-lucide="x" style="width: 18px; height: 18px;"></i>
        </button>
      </div>

      <!-- Optional Encouragement Banner inside modal -->
      <div class="auth-optional-note">
        <i data-lucide="info" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
        <span>
          ${isAr
            ? 'التسجيل اختياري بالكامل. يمكنك مواصلة التصفح كـ <strong>"زائر"</strong> في أي وقت دون إجبار.'
            : 'Registration is completely optional. You can study as a <strong>Guest</strong> anytime.'}
        </span>
      </div>

      <!-- Auth Tabs Bar -->
      ${activeTab !== 'forgot' ? `
        <div class="auth-tabs-row">
          <button class="auth-tab-btn ${activeTab === 'signin' ? 'active' : ''}" onclick="window.AuthModal.switchTab('signin')">
            <i data-lucide="log-in" style="width: 15px; height: 15px;"></i>
            <span>${isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
          </button>
          <button class="auth-tab-btn ${activeTab === 'signup' ? 'active' : ''}" onclick="window.AuthModal.switchTab('signup')">
            <i data-lucide="user-plus" style="width: 15px; height: 15px;"></i>
            <span>${isAr ? 'إنشاء حساب جديد' : 'Create Account'}</span>
          </button>
        </div>
      ` : ''}

      <!-- Form Stage -->
      <div class="auth-form-stage">
        <div id="auth-alert-box" class="auth-alert-box" style="display: none;"></div>

        ${activeTab === 'signin' ? renderSignInForm(isAr) : ''}
        ${activeTab === 'signup' ? renderSignUpForm(isAr) : ''}
        ${activeTab === 'forgot' ? renderForgotForm(isAr) : ''}

        <!-- Google OAuth Button (for signin & signup) -->
        ${activeTab !== 'forgot' ? `
          <div class="auth-divider">
            <span>${isAr ? 'أو عبر' : 'OR CONTINUE WITH'}</span>
          </div>

          <button class="btn-google-oauth" onclick="window.AuthModal.handleGoogleAuth()">
            <svg class="google-icon" viewBox="0 0 24 24" width="18" height="18">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>${isAr ? 'المتابعة بحساب Google' : 'Continue with Google'}</span>
          </button>
        ` : ''}

        <!-- Bottom Guest Continuation Action -->
        <div class="auth-guest-footer">
          <button class="btn-continue-guest" onclick="window.AuthModal.close()">
            <i data-lucide="shield" style="width: 14px; height: 14px;"></i>
            <span>${isAr ? 'المتابعة كطالب زائر (بدون حساب) ➔' : 'Continue as Guest Student ➔'}</span>
          </button>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  function renderSignInForm(isAr) {
    return `
      <form id="auth-signin-form" onsubmit="window.AuthModal.handleSubmitSignIn(event)">
        <div class="auth-input-group">
          <label class="auth-input-label">${isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
          <div class="auth-input-wrapper">
            <i data-lucide="mail" class="auth-input-icon"></i>
            <input type="email" id="auth-signin-email" class="auth-input" placeholder="student@dental.edu" required />
          </div>
        </div>

        <div class="auth-input-group">
          <div class="auth-label-row">
            <label class="auth-input-label">${isAr ? 'كلمة المرور' : 'Password'}</label>
            <button type="button" class="auth-forgot-link" onclick="window.AuthModal.switchTab('forgot')">
              ${isAr ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
            </button>
          </div>
          <div class="auth-input-wrapper">
            <i data-lucide="lock" class="auth-input-icon"></i>
            <input type="password" id="auth-signin-password" class="auth-input" placeholder="••••••••" required />
          </div>
        </div>

        <button type="submit" class="btn btn-primary auth-submit-btn" id="auth-signin-submit">
          <span>${isAr ? 'تسجيل الدخول والمزامنة' : 'Sign In & Sync'}</span>
          <i data-lucide="arrow-left" class="rtl-flip-icon"></i>
        </button>
      </form>
    `;
  }

  function renderSignUpForm(isAr) {
    return `
      <form id="auth-signup-form" onsubmit="window.AuthModal.handleSubmitSignUp(event)">
        <div class="auth-input-group">
          <label class="auth-input-label">${isAr ? 'اسم الطالب / اللقب' : 'Student Full Name'}</label>
          <div class="auth-input-wrapper">
            <i data-lucide="user" class="auth-input-icon"></i>
            <input type="text" id="auth-signup-name" class="auth-input" placeholder="${isAr ? 'د. أحمد / طالب أسنان' : 'Dr. Alex'}" required />
          </div>
        </div>

        <div class="auth-input-group">
          <label class="auth-input-label">${isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
          <div class="auth-input-wrapper">
            <i data-lucide="mail" class="auth-input-icon"></i>
            <input type="email" id="auth-signup-email" class="auth-input" placeholder="student@dental.edu" required />
          </div>
        </div>

        <div class="auth-input-group">
          <label class="auth-input-label">${isAr ? 'كلمة المرور (6 خانات على الأقل)' : 'Password (min 6 characters)'}</label>
          <div class="auth-input-wrapper">
            <i data-lucide="lock" class="auth-input-icon"></i>
            <input type="password" id="auth-signup-password" class="auth-input" placeholder="••••••••" minlength="6" required />
          </div>
        </div>

        <button type="submit" class="btn btn-primary auth-submit-btn" id="auth-signup-submit">
          <span>${isAr ? 'إنشاء الحساب ومزامنة السحابة' : 'Create Account & Enable Sync'}</span>
          <i data-lucide="cloud" style="width: 16px; height: 16px;"></i>
        </button>
      </form>
    `;
  }

  function renderForgotForm(isAr) {
    return `
      <form id="auth-forgot-form" onsubmit="window.AuthModal.handleSubmitForgot(event)">
        <div class="auth-forgot-header">
          <button type="button" class="btn-back-link" onclick="window.AuthModal.switchTab('signin')">
            <i data-lucide="chevron-right" class="rtl-flip-icon"></i>
            <span>${isAr ? 'العودة لتسجيل الدخول' : 'Back to Sign In'}</span>
          </button>
          <h4 class="auth-forgot-title">${isAr ? 'استرجاع كلمة المرور' : 'Password Recovery'}</h4>
          <p class="auth-forgot-sub">
            ${isAr
              ? 'أدخل بريدك الإلكتروني المسجل وسنرسل لك رابط إعادة تعيين كلمة المرور فوراً.'
              : 'Enter your registered email address and we will send you a password reset link.'}
          </p>
        </div>

        <div class="auth-input-group">
          <label class="auth-input-label">${isAr ? 'البريد الإلكتروني المسجل' : 'Registered Email'}</label>
          <div class="auth-input-wrapper">
            <i data-lucide="mail" class="auth-input-icon"></i>
            <input type="email" id="auth-forgot-email" class="auth-input" placeholder="student@dental.edu" required />
          </div>
        </div>

        <button type="submit" class="btn btn-primary auth-submit-btn" id="auth-forgot-submit">
          <span>${isAr ? 'إرسال رابط الاسترجاع ✉️' : 'Send Recovery Link ✉️'}</span>
        </button>
      </form>
    `;
  }

  function showAlert(message, type = 'error') {
    const alertBox = document.getElementById('auth-alert-box');
    if (!alertBox) return;
    alertBox.style.display = 'block';
    alertBox.className = `auth-alert-box auth-alert-${type}`;
    alertBox.textContent = message;
  }

  function clearAlert() {
    const alertBox = document.getElementById('auth-alert-box');
    if (alertBox) {
      alertBox.style.display = 'none';
      alertBox.textContent = '';
    }
  }

  function setButtonLoading(btnId, isLoading, defaultText) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.disabled = isLoading;
    if (isLoading) {
      btn.innerHTML = `<span class="spinner-sm"></span> <span>جاري المعالجة...</span>`;
    } else {
      btn.innerHTML = `<span>${defaultText}</span>`;
    }
  }

  // =========================================================================
  // SUBMISSION HANDLERS
  // =========================================================================
  async function handleSubmitSignIn(e) {
    e.preventDefault();
    clearAlert();
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;

    const email = document.getElementById('auth-signin-email')?.value.trim();
    const password = document.getElementById('auth-signin-password')?.value;

    if (!email || !password) return;

    setButtonLoading('auth-signin-submit', true, isAr ? 'تسجيل الدخول' : 'Sign In');

    try {
      if (!window.SupabaseAuth) throw new Error('Supabase module not ready');
      await window.SupabaseAuth.signInWithEmail(email, password);
      close();
    } catch (err) {
      showAlert(isAr ? `خطأ: ${err.message || 'بيانات الدخول غير صحيحة'}` : `Error: ${err.message}`);
    } finally {
      setButtonLoading('auth-signin-submit', false, isAr ? 'تسجيل الدخول والمزامنة' : 'Sign In & Sync');
    }
  }

  async function handleSubmitSignUp(e) {
    e.preventDefault();
    clearAlert();
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;

    const name = document.getElementById('auth-signup-name')?.value.trim();
    const email = document.getElementById('auth-signup-email')?.value.trim();
    const password = document.getElementById('auth-signup-password')?.value;

    if (!name || !email || !password) return;

    setButtonLoading('auth-signup-submit', true, isAr ? 'جاري إنشاء الحساب...' : 'Creating...');

    try {
      if (!window.SupabaseAuth) throw new Error('Supabase module not ready');
      await window.SupabaseAuth.signUpWithEmail(email, password, name);
      close();
      window.Toast?.success(
        isAr ? 'تم إنشاء الحساب بنجاح! تم ربط حسابك بالسحابة.' : 'Account created successfully and cloud connected!'
      );
    } catch (err) {
      showAlert(isAr ? `خطأ: ${err.message || 'تعذر إنشاء الحساب'}` : `Error: ${err.message}`);
    } finally {
      setButtonLoading('auth-signup-submit', false, isAr ? 'إنشاء الحساب ومزامنة السحابة' : 'Create Account & Enable Sync');
    }
  }

  async function handleSubmitForgot(e) {
    e.preventDefault();
    clearAlert();
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;

    const email = document.getElementById('auth-forgot-email')?.value.trim();
    if (!email) return;

    setButtonLoading('auth-forgot-submit', true, isAr ? 'جاري الإرسال...' : 'Sending...');

    try {
      if (!window.SupabaseAuth) throw new Error('Supabase module not ready');
      await window.SupabaseAuth.resetPassword(email);
      showAlert(
        isAr ? 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.' : 'Password reset link sent to your email.',
        'success'
      );
    } catch (err) {
      showAlert(isAr ? `خطأ: ${err.message || 'تعذر إرسال الرابط'}` : `Error: ${err.message}`);
    } finally {
      setButtonLoading('auth-forgot-submit', false, isAr ? 'إرسال رابط الاسترجاع ✉️' : 'Send Recovery Link ✉️');
    }
  }

  async function handleGoogleAuth() {
    clearAlert();
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;

    try {
      if (!window.SupabaseAuth) throw new Error('Supabase module not ready');
      await window.SupabaseAuth.signInWithGoogle();
    } catch (err) {
      showAlert(isAr ? `خطأ Google OAuth: ${err.message}` : `Google OAuth note: ${err.message}`);
    }
  }

  function open(tab = 'signin') {
    activeTab = tab;
    const modal = ensureModal();
    renderModalContent();
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    if (modalEl) {
      modalEl.classList.remove('active');
      modalEl.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  function switchTab(tab) {
    activeTab = tab;
    renderModalContent();
  }

  return {
    open,
    close,
    switchTab,
    handleSubmitSignIn,
    handleSubmitSignUp,
    handleSubmitForgot,
    handleGoogleAuth
  };
})();
