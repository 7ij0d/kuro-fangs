/**
 * KURO FANGS — CENTRAL AUTHENTICATION ENGINE
 * Single Application Auth State:
 *   - AUTH_LOADING: Initializing & checking active Supabase session
 *   - AUTHENTICATED: Active Google OAuth / Supabase verified session
 *   - GUEST: Fast access mode (explore without account, limited protected features)
 *   - UNAUTHENTICATED: Logged out, must visit /login
 * 
 * Complies with strict Security, RLS, and Anti-Slop Engineering Directives.
 */

(function (window) {
  'use strict';

  // Constants
  const AUTH_STATES = {
    LOADING: 'AUTH_LOADING',
    AUTHENTICATED: 'AUTHENTICATED',
    GUEST: 'GUEST',
    UNAUTHENTICATED: 'UNAUTHENTICATED'
  };

  const STORAGE_KEYS = {
    AUTH_MODE: 'kf_auth_mode',        // 'authenticated' | 'guest' | 'unauthenticated'
    USER_INFO: 'kf_user_info',        // Cached user profile
    PENDING_REDIRECT: 'kf_auth_redir' // Route to return to after auth
  };

  class AuthEngine {
    constructor() {
      this.state = AUTH_STATES.LOADING;
      this.user = null;
      this.subscribers = new Set();
      this.initialized = false;
      this._initPromise = null;
      this._isInteractiveLogin = false;
    }

    /**
     * Subscribe to auth state transitions
     */
    subscribe(callback) {
      if (typeof callback === 'function') {
        this.subscribers.add(callback);
        // Immediately notify subscriber with current state
        callback(this.state, this.user);
      }
      return () => this.subscribers.delete(callback);
    }

    _notify() {
      this.subscribers.forEach(cb => {
        try {
          cb(this.state, this.user);
        } catch (e) {
          console.error('[AuthEngine] Subscriber error:', e);
        }
      });
      this.updateUI();
    }

    /**
     * State inspection helpers
     */
    getState() { return this.state; }
    getUser() { return this.user; }
    isLoading() { return this.state === AUTH_STATES.LOADING; }
    isAuthenticated() { return this.state === AUTH_STATES.AUTHENTICATED && !!this.user; }
    isGuest() { return this.state === AUTH_STATES.GUEST; }
    isUnauthenticated() { return this.state === AUTH_STATES.UNAUTHENTICATED; }

    /**
     * Initialize Auth on app startup
     */
    async init() {
      if (this._initPromise) return this._initPromise;

      this._initPromise = (async () => {
        this.state = AUTH_STATES.LOADING;
        this.renderBootLoadingScreen(true);

        const supabase = this._getSupabaseClient();
        let sessionUser = null;

        if (supabase) {
          try {
            // Check for OAuth hash tokens in URL (#access_token=...&refresh_token=...)
            const hashStr = window.location.hash || '';
            const searchStr = window.location.search || '';
            const rawUrlStr = hashStr.includes('access_token=') ? hashStr : (searchStr.includes('access_token=') ? searchStr : '');
            
            if (rawUrlStr) {
              this._isInteractiveLogin = true;
              try { sessionStorage.setItem('kf_interactive_login', 'true'); } catch (e) {}

              const cleanParamsStr = rawUrlStr.replace(/^#\/?/, '').replace(/^\?/, '');
              const urlParams = new URLSearchParams(cleanParamsStr);
              const accessToken = urlParams.get('access_token');
              const refreshToken = urlParams.get('refresh_token');

              if (accessToken) {
                try {
                  const { data, error } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken || ''
                  });
                  if (!error && data?.session?.user) {
                    sessionUser = data.session.user;
                  }
                } catch (err) {}

                if (!sessionUser) {
                  // Fallback: decode JWT payload directly from access_token
                  try {
                    const parts = accessToken.split('.');
                    if (parts.length === 3) {
                      const base64Url = parts[1];
                      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                      const jsonStr = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
                      const payload = JSON.parse(jsonStr);
                      if (payload && payload.sub) {
                        const meta = payload.user_metadata || {};
                        const fullName = meta.full_name || meta.name || payload.email?.split('@')[0] || 'Kuro Student';
                        sessionUser = {
                          id: payload.sub,
                          email: payload.email || '',
                          user_metadata: meta,
                          app_metadata: payload.app_metadata || {},
                          created_at: payload.iat ? new Date(payload.iat * 1000).toISOString() : new Date().toISOString()
                        };
                      }
                    }
                  } catch (e) {}
                }

                // Clean hash from browser address bar
                if (window.history && window.history.replaceState) {
                  window.history.replaceState(null, '', window.location.pathname + '#/');
                }
              }
            }

            if (!sessionUser) {
              // Check active session via Supabase SDK
              const { data, error } = await supabase.auth.getSession();
              if (!error && data?.session?.user) {
                sessionUser = data.session.user;
              }
            }
          } catch (err) {
            console.warn('[AuthEngine] Session check warning:', err.message);
          }

          // Register live auth state listener
          supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
              await this._handleSignedIn(session.user);
            } else if (event === 'SIGNED_OUT') {
              this._handleSignedOut();
            } else if (event === 'TOKEN_REFRESHED' && session?.user) {
              this._populateUserFromSupabase(session.user);
              this._notify();
            }
          });
        }

        if (sessionUser) {
          await this._handleSignedIn(sessionUser, false);
        } else {
          // Check if previously entered as Guest
          const savedMode = localStorage.getItem(STORAGE_KEYS.AUTH_MODE);
          if (savedMode === 'guest') {
            this.state = AUTH_STATES.GUEST;
            this.user = {
              id: 'guest',
              isGuest: true,
              full_name: window.I18N?.getLang() === 'ar' ? 'طالب زائر' : 'Guest Student',
              email: null,
              avatar_url: null
            };
          } else {
            this.state = AUTH_STATES.UNAUTHENTICATED;
            this.user = null;
          }
        }

        this.initialized = true;
        this.renderBootLoadingScreen(false);
        this._notify();
        this._enforceRouting();
      })();

      return this._initPromise;
    }

    _getSupabaseClient() {
      if (window.SupabaseAuth && typeof window.SupabaseAuth.getClient === 'function') {
        return window.SupabaseAuth.getClient();
      }
      return null;
    }

    /**
     * Populate internal user structure from Supabase User & metadata
     */
    _populateUserFromSupabase(sbUser) {
      if (!sbUser) {
        this.user = null;
        return;
      }

      const meta = sbUser.user_metadata || {};
      const fullName = meta.full_name || meta.name || sbUser.email?.split('@')[0] || 'Kuro Student';
      const avatarUrl = meta.avatar_url || meta.picture || null;

      // Read existing cached profile data to preserve registration completion
      let localInfo = {};
      try {
        localInfo = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_INFO) || '{}');
      } catch (e) {}

      const existingUser = this.user || {};
      const regStatus = existingUser.registration_status || localInfo.registration_status || meta.registration_status || 'pending';
      const nameAr = existingUser.full_name_ar || localInfo.full_name_ar || localInfo.name || fullName;
      const nameEn = existingUser.full_name_en || localInfo.full_name_en || null;
      const gender = existingUser.gender || localInfo.gender || null;
      const group = existingUser.practical_group_id || localInfo.practical_group_id || 'A1';

      this.user = {
        id: sbUser.id,
        email: sbUser.email,
        full_name: nameAr || fullName,
        full_name_ar: nameAr,
        full_name_en: nameEn,
        gender: gender,
        practical_group_id: group,
        registration_status: regStatus,
        avatar_url: existingUser.avatar_url || localInfo.avatar || avatarUrl,
        created_at: sbUser.created_at,
        isGuest: false,
        raw: sbUser
      };

      // Cache user info in localStorage while preserving registration fields
      try {
        localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify({
          ...localInfo,
          id: sbUser.id,
          name: this.user.full_name,
          full_name_ar: this.user.full_name_ar,
          full_name_en: this.user.full_name_en,
          email: sbUser.email,
          gender: this.user.gender,
          practical_group_id: this.user.practical_group_id,
          registration_status: this.user.registration_status,
          avatar: this.user.avatar_url,
          created_at: sbUser.created_at
        }));
        localStorage.setItem(STORAGE_KEYS.AUTH_MODE, 'authenticated');
      } catch (e) {}
    }

    /**
     * Handle user successfully authenticated
     */
    async _handleSignedIn(sbUser, showToast = true) {
      this._populateUserFromSupabase(sbUser);
      this.state = AUTH_STATES.AUTHENTICATED;

      // Sync profile and check completion status
      const profile = await this._syncProfileRecord(this.user);

      // Migrate any guest activity (last opened sheet, etc.) safely
      this.migrateGuestData(sbUser.id);

      this._notify();

      const isInteractive = this._isInteractiveLogin || sessionStorage.getItem('kf_interactive_login') === 'true';
      sessionStorage.removeItem('kf_interactive_login');
      this._isInteractiveLogin = false;

      if (showToast && isInteractive && window.Toast) {
        const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
        window.Toast.show(
          isAr
            ? `مرحباً بك يا ${this.user.full_name}! تم تسجيل الدخول بنجاح ☁️`
            : `Welcome back, ${this.user.full_name}! Signed in successfully ☁️`,
          'success'
        );
      }

      // Check registration status: incomplete profiles must go to student registration setup
      const isCompleted = (profile?.registration_status === 'completed') || (this.user?.registration_status === 'completed');
      if (!isCompleted) {
        if (!window.location.hash.includes('register-setup')) {
          window.location.hash = '#/register-setup';
        }
        return;
      }

      // Check if redirect is pending or on login screen
      const pendingRedir = sessionStorage.getItem(STORAGE_KEYS.PENDING_REDIRECT);
      if (pendingRedir && pendingRedir !== '/login' && pendingRedir !== '/register-setup') {
        sessionStorage.removeItem(STORAGE_KEYS.PENDING_REDIRECT);
        window.location.hash = '#' + pendingRedir;
      } else {
        const currentHash = window.location.hash.slice(1).split('?')[0] || '/';
        if (currentHash === '/login' || currentHash === '/register-setup' || window.location.hash.includes('access_token')) {
          window.location.hash = '#/';
        }
      }
    }

    /**
     * Handle user signed out
     */
    _handleSignedOut() {
      this.user = null;
      this.state = AUTH_STATES.UNAUTHENTICATED;
      localStorage.setItem(STORAGE_KEYS.AUTH_MODE, 'unauthenticated');
      localStorage.removeItem(STORAGE_KEYS.USER_INFO);

      this._notify();

      // Redirect cleanly to login screen
      window.location.hash = '#/login';
    }

    /**
     * Synchronize & fetch profile record from Supabase `profiles` table
     */
    async _syncProfileRecord(user) {
      const supabase = this._getSupabaseClient();
      if (!supabase || !user || !user.id || user.isGuest) return null;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (data) {
          if (data.full_name_ar) this.user.full_name_ar = data.full_name_ar;
          if (data.full_name_en) this.user.full_name_en = data.full_name_en;
          if (data.full_name) this.user.full_name = data.full_name;
          if (data.gender) this.user.gender = data.gender;
          if (data.practical_group_id) this.user.practical_group_id = data.practical_group_id;
          if (data.avatar_url) this.user.avatar_url = data.avatar_url;
          if (data.registration_status) this.user.registration_status = data.registration_status;

          // Cache profile details
          try {
            const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_INFO) || '{}');
            localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify({
              ...current,
              name: data.full_name_ar || data.full_name,
              full_name_ar: data.full_name_ar,
              full_name_en: data.full_name_en,
              gender: data.gender,
              practical_group_id: data.practical_group_id,
              avatar: data.avatar_url,
              registration_status: data.registration_status
            }));
          } catch (e) {}

          return data;
        } else {
          const payload = {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            registration_status: 'pending',
            role: 'student',
            status: 'active'
          };
          await supabase.from('profiles').upsert(payload, { onConflict: 'id' });
          this.user.registration_status = 'pending';
          return payload;
        }
      } catch (err) {
        console.warn('[AuthEngine] Profile sync note:', err.message);
        return null;
      }
    }

    /**
     * Save complete student registration wizard profile payload
     */
    async saveCompleteStudentProfile(payload) {
      if (!this.user || this.user.isGuest) return;

      const supabase = this._getSupabaseClient();
      this.user = {
        ...this.user,
        full_name: payload.full_name_ar || this.user.full_name,
        full_name_ar: payload.full_name_ar,
        full_name_en: payload.full_name_en,
        gender: payload.gender,
        practical_group_id: payload.practical_group_id,
        avatar_url: payload.avatar_url || this.user.avatar_url,
        registration_status: 'completed'
      };

      try {
        const info = {
          id: this.user.id,
          name: payload.full_name_ar,
          full_name_ar: payload.full_name_ar,
          full_name_en: payload.full_name_en,
          email: this.user.email,
          gender: payload.gender,
          practical_group_id: payload.practical_group_id,
          avatar: payload.avatar_url,
          registration_status: 'completed'
        };
        localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(info));
      } catch (e) {}

      if (supabase) {
        try {
          const profileData = {
            id: this.user.id,
            full_name: payload.full_name_ar,
            full_name_ar: payload.full_name_ar,
            full_name_en: payload.full_name_en,
            email: this.user.email,
            gender: payload.gender,
            practical_group_id: payload.practical_group_id,
            avatar_url: payload.avatar_url,
            registration_status: 'completed',
            role: 'student',
            status: 'active',
            updated_at: new Date().toISOString()
          };

          await supabase.from('profiles').upsert(profileData, { onConflict: 'id' });
        } catch (err) {
          console.warn('[AuthEngine] Complete profile save note:', err.message);
        }
      }

      this._notify();
    }

    /**
     * Start Google OAuth Flow
     */
    async signInWithGoogle() {
      const supabase = this._getSupabaseClient();
      const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;

      if (!supabase) {
        const msg = isAr ? 'تعذر الاتصال بخدمة التحقق' : 'Auth service unavailable';
        window.Toast?.show(msg, 'error');
        return { success: false, error: msg };
      }

      this._isInteractiveLogin = true;
      try {
        sessionStorage.setItem('kf_interactive_login', 'true');
      } catch (e) {}

      // Compute exact redirect URL based on environment
      let redirectUrl = window.location.origin + window.location.pathname;
      if (window.location.hostname === 'kurofangs.id.ly') {
        redirectUrl = 'https://kurofangs.id.ly';
      }

      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: redirectUrl
          }
        });

        if (error) {
          console.error('[Google OAuth Technical Error]:', error);
          this._isInteractiveLogin = false;
          try { sessionStorage.removeItem('kf_interactive_login'); } catch (e) {}

          // Check if Google provider is pending configuration
          if (error.message?.includes('provider is not enabled') || error.message?.includes('Unsupported provider') || error.message?.includes('google_pending_client_id')) {
            const friendlyMsg = isAr
              ? 'تسجيل الدخول عبر Google يتطلب تفعيل معرف Google Cloud. يمكنك التسجيل والدخول فوراً بالبريد الإلكتروني أدناه.'
              : 'Google OAuth requires Google Cloud setup. You can register and sign in directly with email below.';
            window.Toast?.show(friendlyMsg, 'info');
            this.showGoogleConfigAlertModal(isAr);
            return { success: false, error: friendlyMsg, isConfigError: true };
          }

          const friendlyMsg = isAr ? 'تعذر الاتصال بـ Google. يمكنك التسجيل والدخول بالبريد الإلكتروني أدناه.' : 'Google sign-in unavailable. Please use email & password.';
          window.Toast?.show(friendlyMsg, 'warning');
          return { success: false, error: error.message };
        }

        return { success: true, data };
      } catch (err) {
        console.error('[Google OAuth Exception]:', err);
        this._isInteractiveLogin = false;
        try { sessionStorage.removeItem('kf_interactive_login'); } catch (e) {}
        const friendlyMsg = isAr ? 'حدث خطأ أثناء الاتصال مع Google' : 'An error occurred connecting to Google';
        window.Toast?.show(friendlyMsg, 'error');
        return { success: false, error: err.message };
      }
    }

    /**
     * Sign In with Email & Password
     */
    async signInWithEmail(email, password) {
      const supabase = this._getSupabaseClient();
      const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;

      if (!supabase) {
        const msg = isAr ? 'تعذر الاتصال بخدمة التحقق' : 'Auth service unavailable';
        window.Toast?.show(msg, 'error');
        return { success: false, error: msg };
      }

      const cleanEmail = (email || '').trim();
      const cleanPassword = password || '';

      if (!cleanEmail || !cleanPassword) {
        const msg = isAr ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور' : 'Please enter email and password';
        window.Toast?.show(msg, 'warning');
        return { success: false, error: msg };
      }

      this._isInteractiveLogin = true;
      try { sessionStorage.setItem('kf_interactive_login', 'true'); } catch (e) {}

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword
        });

        if (error) {
          console.warn('[Email Sign In Error]:', error);
          this._isInteractiveLogin = false;
          try { sessionStorage.removeItem('kf_interactive_login'); } catch (e) {}
          const friendlyMsg = isAr
            ? (error.message.includes('Invalid') || error.message.includes('credentials')
                ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
                : error.message)
            : error.message;
          window.Toast?.show(friendlyMsg, 'error');
          return { success: false, error: friendlyMsg };
        }

        if (data?.user) {
          await this._handleSignedIn(data.user);
        }
        return { success: true, data };
      } catch (err) {
        console.error('[Email Sign In Exception]:', err);
        this._isInteractiveLogin = false;
        try { sessionStorage.removeItem('kf_interactive_login'); } catch (e) {}
        window.Toast?.show(err.message, 'error');
        return { success: false, error: err.message };
      }
    }

    /**
     * Sign Up with Email, Password & Full Name
     */
    async signUpWithEmail(email, password, fullName) {
      const supabase = this._getSupabaseClient();
      const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;

      if (!supabase) {
        const msg = isAr ? 'تعذر الاتصال بخدمة التحقق' : 'Auth service unavailable';
        window.Toast?.show(msg, 'error');
        return { success: false, error: msg };
      }

      const cleanEmail = (email || '').trim();
      const cleanPassword = password || '';
      const cleanName = (fullName || '').trim() || cleanEmail.split('@')[0];

      if (!cleanEmail || !cleanPassword) {
        const msg = isAr ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور' : 'Please fill all fields';
        window.Toast?.show(msg, 'warning');
        return { success: false, error: msg };
      }

      if (cleanPassword.length < 6) {
        const msg = isAr ? 'يجب أن تتكون كلمة المرور من 6 أحرف أو أرقام على الأقل' : 'Password must be at least 6 characters';
        window.Toast?.show(msg, 'warning');
        return { success: false, error: msg };
      }

      this._isInteractiveLogin = true;
      try { sessionStorage.setItem('kf_interactive_login', 'true'); } catch (e) {}

      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
          options: {
            data: {
              full_name: cleanName
            }
          }
        });

        if (error) {
          console.warn('[Email Sign Up Error]:', error);
          this._isInteractiveLogin = false;
          try { sessionStorage.removeItem('kf_interactive_login'); } catch (e) {}
          const friendlyMsg = isAr
            ? (error.message.includes('already registered') || error.message.includes('already')
                ? 'هذا البريد مسجل مسبقاً، يمكنك تسجيل الدخول به مباشرة'
                : error.message)
            : error.message;
          window.Toast?.show(friendlyMsg, 'error');
          return { success: false, error: friendlyMsg };
        }

        if (data?.user) {
          await this._handleSignedIn(data.user);
        }
        return { success: true, data };
      } catch (err) {
        console.error('[Email Sign Up Exception]:', err);
        this._isInteractiveLogin = false;
        try { sessionStorage.removeItem('kf_interactive_login'); } catch (e) {}
        window.Toast?.show(err.message, 'error');
        return { success: false, error: err.message };
      }
    }

    /**
     * Continue as Guest Mode
     */
    continueAsGuest() {
      localStorage.setItem(STORAGE_KEYS.AUTH_MODE, 'guest');
      this.state = AUTH_STATES.GUEST;
      this.user = {
        id: 'guest',
        isGuest: true,
        full_name: window.I18N?.getLang() === 'ar' ? 'طالب زائر' : 'Guest Student',
        email: null,
        avatar_url: null
      };

      const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
      if (window.Toast) {
        window.Toast.show(
          isAr ? 'أهلاً بك في كورو فانغز! تم تفعيل وضع الزائر السريع 🎒' : 'Welcome to Kuro Fangs! Guest mode enabled 🎒',
          'info'
        );
      }

      this._notify();

      const pendingRedir = sessionStorage.getItem(STORAGE_KEYS.PENDING_REDIRECT);
      if (pendingRedir && pendingRedir !== '/login') {
        sessionStorage.removeItem(STORAGE_KEYS.PENDING_REDIRECT);
        window.location.hash = '#' + pendingRedir;
      } else {
        window.location.hash = '#/';
      }
    }

    /**
     * Sign out (Instant Optimistic UI update <5ms)
     */
    async signOut() {
      // 1. Immediately clear local session state & update UI
      this._handleSignedOut();

      const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
      if (window.Toast) {
        window.Toast.show(
          isAr ? 'تم تسجيل الخروج بنجاح. نراك قريباً! 👋' : 'Signed out successfully. See you soon! 👋',
          'info'
        );
      }

      // 2. Non-blocking remote session revocation
      const supabase = this._getSupabaseClient();
      if (supabase) {
        try {
          supabase.auth.signOut().catch(e => console.warn('[AuthEngine] Signout note:', e));
        } catch (e) {}
      }
    }

    /**
     * Guard protected features for Guest users
     * If user is Guest, shows the elegant prompt modal and returns false.
     * If Authenticated, returns true.
     */
    requireAuth(featureName = 'progress') {
      if (this.isAuthenticated()) {
        return true;
      }

      this.showGuestRestrictionModal(featureName);
      return false;
    }

    /**
     * Migrate Guest activity safely to authenticated user
     */
    migrateGuestData(userId) {
      if (!userId) return;
      try {
        // Last opened sheet migration
        const lastSheet = localStorage.getItem('kf_last_opened_sheet');
        if (lastSheet) {
          localStorage.setItem(`kf_user_${userId}_last_sheet`, lastSheet);
        }
        // Active question session migration
        const activeQuiz = localStorage.getItem('kf_active_question_session');
        if (activeQuiz) {
          localStorage.setItem(`kf_user_${userId}_active_quiz`, activeQuiz);
        }
      } catch (e) {}
    }

    /**
     * Enforce clean routing on boot
     */
    _enforceRouting() {
      const currentHash = window.location.hash.slice(1).split('?')[0] || '/';

      if (this.isAuthenticated() && currentHash === '/login') {
        window.location.hash = '#/';
      } else if (this.isUnauthenticated() && currentHash !== '/login') {
        // Remember requested route
        if (currentHash !== '/' && currentHash !== '') {
          sessionStorage.setItem(STORAGE_KEYS.PENDING_REDIRECT, currentHash);
        }
        window.location.hash = '#/login';
      }
    }

    /**
     * Update UI across the application
     */
    updateUI() {
      const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
      const user = this.user;
      const isAuthenticated = this.isAuthenticated();

      // 1. Toggle Login Page Active class on body
      const currentHash = window.location.hash.slice(1).split('?')[0] || '/';
      const isLoginPage = currentHash === '/login';
      document.body.classList.toggle('login-view-active', isLoginPage);

      // 2. Header Auth Box (Idempotent render - prevents DOM recreation flickering)
      const headerAuthBox = document.getElementById('header-auth-action-box');
      if (headerAuthBox) {
        const targetMode = isAuthenticated ? 'auth' : (this.isGuest() ? 'guest' : 'unauth');
        const currentMode = headerAuthBox.getAttribute('data-render-mode');
        const currentUserId = headerAuthBox.getAttribute('data-render-userid');
        const currentName = headerAuthBox.getAttribute('data-render-name');
        const currentAvatar = headerAuthBox.getAttribute('data-render-avatar');
        const currentLang = headerAuthBox.getAttribute('data-render-lang');

        const userId = user ? (user.id || 'auth') : 'none';
        const userName = user ? (user.full_name || '') : '';
        const userAvatar = user ? (user.avatar_url || '') : '';
        const langStr = isAr ? 'ar' : 'en';

        if (
          currentMode === targetMode &&
          currentUserId === userId &&
          currentName === userName &&
          currentAvatar === userAvatar &&
          currentLang === langStr
        ) {
          // DOM is already up-to-date and 100% stable; skip tear down
        } else {
          headerAuthBox.setAttribute('data-render-mode', targetMode);
          headerAuthBox.setAttribute('data-render-userid', userId);
          headerAuthBox.setAttribute('data-render-name', userName);
          headerAuthBox.setAttribute('data-render-avatar', userAvatar);
          headerAuthBox.setAttribute('data-render-lang', langStr);

          if (isAuthenticated) {
            const avatarHtml = userAvatar
              ? `<img src="${userAvatar}" alt="${userName}" class="header-user-avatar-circle" style="width:24px;height:24px;border-radius:50%;object-fit:cover;" />`
              : `<span class="header-user-avatar-initial" style="width:24px;height:24px;border-radius:50%;background:#7E1D2A;color:#FFF;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;">${userName.charAt(0).toUpperCase()}</span>`;

            headerAuthBox.innerHTML = `
              <div class="header-user-badge" id="header-user-profile-badge" onclick="window.location.hash='#/profile'" style="display:inline-flex;align-items:center;gap:8px;padding:4px 10px;border-radius:20px;background:rgba(126,29,42,0.06);border:1px solid rgba(126,29,42,0.14);cursor:pointer;" title="${user.email || ''}">
                ${avatarHtml}
                <span class="user-display-name" style="font-size:0.85rem;font-weight:700;color:var(--text-primary);max-width:120px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${userName}</span>
                <button type="button" class="btn-header-signout" onclick="event.stopPropagation(); window.AUTH.signOut()" title="${isAr ? 'تسجيل الخروج' : 'Sign Out'}" style="background:none;border:none;color:#8C827A;cursor:pointer;padding:2px;display:flex;align-items:center;">
                  <i data-lucide="log-out" style="width:13px;height:13px;"></i>
                </button>
              </div>
            `;
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
              window.lucide.createIcons();
            }
          } else if (this.isGuest()) {
            headerAuthBox.innerHTML = `
              <div class="header-guest-badge-wrap" style="display:inline-flex;align-items:center;gap:6px;">
                <span class="header-guest-pill" style="font-size:0.75rem;padding:3px 8px;border-radius:12px;background:#F0EAE1;color:#6B6055;font-weight:700;">
                  ${isAr ? 'وضع الزائر' : 'Guest'}
                </span>
                <button type="button" class="header-signin-btn" onclick="window.location.hash='#/login'" style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:10px;background:#7E1D2A;color:#FFF;font-size:0.82rem;font-weight:700;border:none;cursor:pointer;box-shadow:0 2px 6px rgba(126,29,42,0.2);">
                  <i data-lucide="log-in" style="width:13px;height:13px;"></i>
                  <span>${isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
                </button>
              </div>
            `;
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
              window.lucide.createIcons();
            }
          } else {
            headerAuthBox.innerHTML = `
              <button type="button" class="header-signin-btn" onclick="window.location.hash='#/login'" style="display:inline-flex;align-items:center;gap:6px;padding:6px 16px;border-radius:10px;background:#7E1D2A;color:#FFF;font-size:0.85rem;font-weight:700;border:none;cursor:pointer;box-shadow:0 2px 6px rgba(126,29,42,0.2);">
                <i data-lucide="user" style="width:14px;height:14px;"></i>
                <span>${isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
              </button>
            `;
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
              window.lucide.createIcons();
            }
          }
        }
      }

      // 3. Sidebar User Card
      const sideName = document.querySelector('.sidebar-user-name');
      const sideSub = document.getElementById('sidebar-user-sub');
      const sideAvatarImg = document.getElementById('sidebar-user-avatar-img');

      if (isAuthenticated) {
        if (sideName) sideName.textContent = user.full_name;
        if (sideSub) sideSub.textContent = isAr ? 'حساب موثق سحابياً ☁️' : 'Cloud Verified ☁️';
        if (sideAvatarImg && user.avatar_url) {
          sideAvatarImg.src = user.avatar_url;
          sideAvatarImg.style.borderRadius = '50%';
          sideAvatarImg.style.objectFit = 'cover';
        }
      } else if (this.isGuest()) {
        if (sideName) sideName.textContent = isAr ? 'طالب زائر (Guest)' : 'Guest Student';
        if (sideSub) sideSub.textContent = isAr ? 'السنة الثالثة • حساب محلي' : 'Year 3 • Local Session';
      } else {
        if (sideName) sideName.textContent = isAr ? 'غير مسجل' : 'Not Signed In';
        if (sideSub) sideSub.textContent = isAr ? 'اضغط لتسجيل الدخول' : 'Click to Sign In';
      }

      // Re-initialize Lucide icons
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }

    /**
     * Simple, non-flashing loading screen on initial boot
     */
    renderBootLoadingScreen(show) {
      let loader = document.getElementById('kf-auth-boot-loader');
      if (show) {
        if (!loader) {
          loader = document.createElement('div');
          loader.id = 'kf-auth-boot-loader';
          loader.className = 'kf-auth-boot-loader';
          loader.innerHTML = `
            <div class="kf-boot-content">
              <div class="kf-boot-mascot-pulse">
                <img src="assets/characters/kuro/Kuro-Idle.png" alt="Kuro" width="72" height="72" />
              </div>
              <h2 class="kf-boot-title">Kuro Fangs</h2>
              <div class="kf-boot-spinner"></div>
            </div>
          `;
          document.body.appendChild(loader);
        }
        loader.style.display = 'flex';
      } else if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 250);
      }
    }

    /**
     * Renders the Guest Restriction / Upgrade Modal requested in Requirement 8
     */
    showGuestRestrictionModal(featureName) {
      const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
      const modalId = 'kf-guest-upgrade-modal-backdrop';
      let modal = document.getElementById(modalId);
      if (modal) modal.remove();

      modal = document.createElement('div');
      modal.id = modalId;
      modal.className = 'auth-modal-backdrop guest-restriction-backdrop';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');

      modal.innerHTML = `
        <div class="auth-modal-box guest-upgrade-box" style="max-width: 440px; padding: 32px 28px; text-align: center; border-radius: 24px; background: #FFFFFF; border: 1px solid #EAE3D6; box-shadow: 0 16px 40px rgba(126,29,42,0.12);">
          <!-- Mascot Header -->
          <div style="width: 80px; height: 80px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; background: #FBF3EF; border-radius: 50%; border: 1px solid #EEDCD5;">
            <img src="assets/characters/kuro/kuro-welcome-sparks.png" alt="Kuro" style="width: 58px; height: auto;" />
          </div>

          <h2 style="font-size: 1.35rem; font-weight: 800; color: #7E1D2A; margin: 0 0 8px; letter-spacing: -0.01em;">
            ${isAr ? 'سجّل دخولك لحفظ تقدّمك' : 'Sign in to save your progress'}
          </h2>

          <p style="font-size: 0.92rem; color: #6E655F; line-height: 1.5; margin: 0 0 24px;">
            ${isAr
              ? 'أنشئ حساباً مجانياً عبر Google لمزامنة نشاطك الدراسي وملاحظاتك وشيتاتك عبر جميع أجهزتك.'
              : 'Create a free account to sync your study activity, notes, and sheets across devices.'}
          </p>

          <!-- Action Buttons -->
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <button
              type="button"
              id="guest-upgrade-google-btn"
              style="width: 100%; height: 50px; border-radius: 12px; background: #7E1D2A; color: #FFFFFF; font-size: 0.95rem; font-weight: 700; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 4px 12px rgba(126,29,42,0.22); transition: transform 0.15s cubic-bezier(0.16,1,0.3,1);"
              onmouseover="this.style.transform='scale(1.01)'"
              onmouseout="this.style.transform='scale(1)'"
            >
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="#FFF" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#FFF" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FFF" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#FFF" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>${isAr ? 'المتابعة بحساب Google' : 'Continue with Google'}</span>
            </button>

            <button
              type="button"
              id="guest-upgrade-dismiss-btn"
              style="width: 100%; height: 46px; border-radius: 12px; background: #FBF8F3; color: #5C5248; font-size: 0.9rem; font-weight: 700; border: 1px solid #EAE3D6; cursor: pointer;"
            >
              <span>${isAr ? 'متابعة كزائر (بدون حساب)' : 'Continue as Guest'}</span>
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      modal.querySelector('#guest-upgrade-google-btn')?.addEventListener('click', () => {
        modal.remove();
        this.signInWithGoogle();
      });

      modal.querySelector('#guest-upgrade-dismiss-btn')?.addEventListener('click', () => {
        modal.remove();
      });

      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
      });
    }

    /**
     * Guidance modal explaining direct self-hosted authentication
     */
    showGoogleConfigAlertModal(isAr) {
      const modalId = 'kf-google-config-alert-backdrop';
      let modal = document.getElementById(modalId);
      if (modal) modal.remove();

      modal = document.createElement('div');
      modal.id = modalId;
      modal.className = 'auth-modal-backdrop';
      modal.innerHTML = `
        <div class="auth-modal-box" style="max-width: 480px; padding: 28px; border-radius: 20px; background: #FFFFFF; border: 1px solid #EAE3D6; box-shadow: 0 20px 40px rgba(0,0,0,0.12);">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
            <div style="width:42px;height:42px;border-radius:12px;background:#FEF3C7;color:#D97706;display:flex;align-items:center;justify-content:center;font-size:20px;">⚡</div>
            <h3 style="margin:0;font-size:1.12rem;font-weight:800;color:#1F1A17;">
              ${isAr ? 'التسجيل الذاتي المستقل متاح فوراً' : 'Direct Registration Ready'}
            </h3>
          </div>
          <p style="font-size:0.88rem;color:#554B41;line-height:1.6;margin-bottom:14px;">
            ${isAr
              ? 'تم نقل نظام المصادقة بالكامل إلى خادم Kuro Fangs الخاص المستقل. يمكنك إنشاء حسابك الجديد والدخول مباشرة عبر البريد الإلكتروني وكلمة المرور أدناه، أو مواصلة الدراسة كزائر.'
              : 'Authentication is fully self-hosted on Kuro Fangs private cloud. You can register directly with your email and password below, or continue studying as a guest.'}
          </p>
          <div style="background:#F7F4EE;border-radius:12px;padding:12px 16px;margin-bottom:20px;font-size:0.82rem;color:#7A6E63;line-height:1.5;">
            ${isAr
              ? '💡 <strong>ملاحظة:</strong> لا توجد أي قيود أو اشتراكات خارجية، حسابك يُحفظ بأمان في قاعدة بيانات كورو الخاصة.'
              : '💡 <strong>Note:</strong> Zero external billing locks; all student data is saved securely on your private server.'}
          </div>
          <div style="display:flex;justify-content:flex-end;gap:10px;">
            <button type="button" onclick="this.closest('.auth-modal-backdrop').remove()" style="padding:10px 22px;border-radius:10px;background:#7E1D2A;color:#FFF;font-weight:700;border:none;cursor:pointer;font-size:0.88rem;">
              ${isAr ? 'بدء التسجيل الآن' : 'Start Registration'}
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
  }

  // Export singleton instance on window
  window.AUTH = new AuthEngine();

  // Backward-compatible hook with existing SupabaseAuth callers
  window.addEventListener('DOMContentLoaded', () => {
    window.AUTH.init();
  });

})(window);
