/**
 * KURO FANGS — AUTHENTICATION & GUEST UPGRADE MODAL
 * Focused on:
 *   1. Continue with Google (Primary Auth)
 *   2. Continue as Guest (Unrestricted Local Access)
 */

window.AuthModal = (function () {
  'use strict';

  let modalEl = null;

  function ensureModal() {
    if (!modalEl || !document.body.contains(modalEl)) {
      modalEl = document.getElementById('auth-modal-backdrop');
      if (!modalEl) {
        modalEl = document.createElement('div');
        modalEl.id = 'auth-modal-backdrop';
        modalEl.className = 'auth-modal-backdrop';
        modalEl.setAttribute('role', 'dialog');
        modalEl.setAttribute('aria-modal', 'true');
        modalEl.innerHTML = `<div class="auth-modal-box" id="auth-modal-box"></div>`;
        document.body.appendChild(modalEl);

        modalEl.addEventListener('click', (e) => {
          if (e.target === modalEl) close();
        });
      }
    }
    return modalEl;
  }

  function open(options = {}) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
    const modal = ensureModal();
    const box = document.getElementById('auth-modal-box');
    if (!box) return;

    const title = options.title || (isAr ? 'سجّل دخولك لحفظ تقدّمك' : 'Sign in to save your progress');
    const message = options.message || (isAr 
      ? 'أنشئ حساباً مجانياً عبر Google لمزامنة نشاطك وملاحظاتك الدراسية عبر جميع أجهزتك.' 
      : 'Create a free account to sync your study activity, notes, and sheets across devices.');

    box.innerHTML = `
      <div style="max-width: 440px; padding: 34px 28px; text-align: center; border-radius: 26px; background: #FFFFFF; border: 1px solid #EAE3D6; box-shadow: 0 16px 40px rgba(126,29,42,0.12);">
        <!-- Mascot Avatar -->
        <div style="width: 76px; height: 76px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; background: #FBF3EF; border-radius: 50%; border: 1px solid #EEDCD5;">
          <img src="assets/characters/kuro/kuro-welcome-sparks.png" alt="Kuro" style="width: 54px; height: auto;" />
        </div>

        <h2 style="font-size: 1.35rem; font-weight: 850; color: #7E1D2A; margin: 0 0 8px; letter-spacing: -0.01em;">
          ${title}
        </h2>

        <p style="font-size: 0.9rem; color: #6E655F; line-height: 1.5; margin: 0 0 24px;">
          ${message}
        </p>

        <!-- Actions -->
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <button
            type="button"
            id="auth-modal-login-btn"
            style="width: 100%; height: 50px; border-radius: 12px; background: #7E1D2A; color: #FFFFFF; font-size: 0.95rem; font-weight: 700; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 4px 12px rgba(126,29,42,0.22); transition: transform 0.15s cubic-bezier(0.16,1,0.3,1);"
          >
            <i data-lucide="log-in" style="width: 17px; height: 17px;"></i>
            <span>${isAr ? 'تسجيل الدخول / إنشاء حساب' : 'Sign In / Register'}</span>
          </button>

          <button
            type="button"
            id="auth-modal-guest-btn"
            style="width: 100%; height: 46px; border-radius: 12px; background: #FBF8F3; color: #5C5248; font-size: 0.9rem; font-weight: 700; border: 1px solid #EAE3D6; cursor: pointer;"
          >
            <span>${isAr ? 'المتابعة كزائر (بدون حساب)' : 'Continue as Guest'}</span>
          </button>

          <button
            type="button"
            id="auth-modal-google-btn"
            style="width: 100%; height: 44px; border-radius: 12px; background: #FFFFFF; color: #3D352E; font-size: 0.88rem; font-weight: 650; border: 1px solid #E5DFD5; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>${isAr ? 'المتابعة بحساب Google' : 'Continue with Google'}</span>
          </button>
        </div>
      </div>
    `;

    modal.classList.add('open');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    if (window.lucide) window.lucide.createIcons();

    box.querySelector('#auth-modal-login-btn')?.addEventListener('click', () => {
      close();
      window.location.hash = '#/login';
    });

    box.querySelector('#auth-modal-google-btn')?.addEventListener('click', () => {
      close();
      if (window.AUTH) window.AUTH.signInWithGoogle();
    });

    box.querySelector('#auth-modal-guest-btn')?.addEventListener('click', () => {
      close();
      if (window.AUTH && window.AUTH.isUnauthenticated()) {
        window.AUTH.continueAsGuest();
      }
    });
  }

  function close() {
    if (modalEl) {
      modalEl.classList.remove('open');
      modalEl.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  return {
    open,
    close,
    handleGoogleAuth: () => window.AUTH?.signInWithGoogle()
  };
})();
