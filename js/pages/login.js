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
    render(container) {
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
                <div class="login-brand-emblem-wrap">
                  <img src="assets/characters/kuro/Kuro-Idle.png" alt="Kuro Mascot" width="38" height="38" />
                </div>
                <div class="login-brand-meta">
                  <span class="login-brand-title">Kuro Fangs</span>
                  <span class="login-brand-tagline">
                    ${isAr ? 'رفيقك الأكاديمي الشامل لطب وجراحة الفم والأسنان' : 'Your Complete Dental Study Companion'}
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
                  alt="Kuro Studying"
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
                
                <!-- Mascot Head with Radiant Sparks -->
                <div class="login-card-mascot-wrap">
                  <img
                    src="assets/characters/kuro/kuro-welcome-sparks.png"
                    alt="Kuro Welcome"
                    class="login-card-mascot-img"
                    onerror="this.src='assets/characters/kuro/Kuro-Excited.png'"
                  />
                </div>

                <!-- Card Heading -->
                <h2 class="login-card-title">
                  ${isAr ? 'مرحباً بك في كورو فانغز' : 'Welcome to Kuro Fangs'}
                </h2>
                <p class="login-card-subtitle">
                  ${isAr ? 'سجّل دخولك لمواصلة رحلتك الدراسية في طب الأسنان.' : 'Sign in to continue your dental study journey.'}
                </p>

                <!-- Primary Action: Continue with Google -->
                <button
                  type="button"
                  id="btn-login-google"
                  class="login-btn-google"
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

                <!-- Divider: "──────── or ────────" -->
                <div class="login-card-divider">
                  <span class="login-divider-text">${isAr ? 'أو' : 'or'}</span>
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
                      <i data-lucide="user"></i>
                    </div>
                    <span class="login-btn-guest-text">
                      ${isAr ? 'المتابعة كزائر' : 'Continue as Guest'}
                    </span>
                  </div>
                  <i data-lucide="${isAr ? 'chevron-left' : 'chevron-right'}" class="login-btn-chevron"></i>
                </button>

                <!-- Sub-caption under Guest -->
                <p class="login-guest-note">
                  ${isAr 
                    ? 'استكشف المنصة بدون حساب. بعض ميزات المزامنة السحابية قد تكون محدودة.' 
                    : 'Explore the platform without an account. Some features may be limited.'}
                </p>

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

      this.bindEvents(container);

      // Recreate Lucide icons inside login card
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    },

    bindEvents(container) {
      // 1. Continue with Google click handler
      const googleBtn = container.querySelector('#btn-login-google');
      if (googleBtn) {
        googleBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          googleBtn.disabled = true;
          googleBtn.style.opacity = '0.7';

          try {
            if (window.AUTH && typeof window.AUTH.signInWithGoogle === 'function') {
              await window.AUTH.signInWithGoogle();
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

      // 2. Continue as Guest click handler
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
