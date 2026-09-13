/**
 * KURO FANGS — SUPABASE CLIENT & CLOUD SYNC MANAGER
 * 100% Optional Authentication (Guest-First Architecture)
 * Email & Password, Google OAuth, Password Reset, and Cloud Profile Syncing.
 */

(function () {
  // Default Supabase project configuration (can be updated or overridden in localStorage)
  const DEFAULT_SUPABASE_URL = 'https://wuxdkhhwhsqhybdfgczp.supabase.co';
  const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1eGRraGh3aHหมaHliZGZnY3pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1MDk2MDAsImV4cCI6MjA1NDA4NTYwMH0.fake_or_placeholder_if_offline';

  // Read configuration
  const SUPABASE_URL = localStorage.getItem('kf_supabase_url') || DEFAULT_SUPABASE_URL;
  const SUPABASE_ANON_KEY = localStorage.getItem('kf_supabase_key') || DEFAULT_SUPABASE_ANON_KEY;

  let client = null;
  let currentUser = null;
  let isSyncing = false;
  let syncDebounceTimer = null;

  // Initialize Supabase Client
  function initClient() {
    try {
      if (window.supabase && typeof window.supabase.createClient === 'function') {
        client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        });
      }
    } catch (e) {
      console.warn('Supabase initialization note:', e.message);
      client = null;
    }
  }

  // Check initial session & register auth listener
  async function initAuth() {
    initClient();

    if (!client) {
      // Fallback: guest mode works with zero errors
      updateUIForAuth(null);
      return;
    }

    try {
      const { data, error } = await client.auth.getSession();
      if (!error && data?.session?.user) {
        currentUser = data.session.user;
        await onUserAuthenticated(currentUser);
      } else {
        currentUser = null;
        updateUIForAuth(null);
      }

      // Listen for auth state changes
      client.auth.onAuthStateChange(async (event, session) => {
        const user = session?.user || null;
        currentUser = user;

        if (event === 'SIGNED_IN' && user) {
          await onUserAuthenticated(user);
          const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
          const name = user.user_metadata?.full_name || user.email.split('@')[0];
          window.Toast?.success(
            isAr ? `أهلاً بك يا ${name}! تم تسجيل الدخول والمزامنة بنجاح ☁️` : `Welcome, ${name}! Signed in and cloud synced ☁️`
          );
        } else if (event === 'SIGNED_OUT') {
          currentUser = null;
          updateUIForAuth(null);
          const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
          window.Toast?.info(
            isAr ? 'تم تسجيل الخروج. يمكنك مواصلة الدراسة كزائر.' : 'Signed out. Continuing as guest.'
          );
        }
      });
    } catch (err) {
      console.warn('Auth session check failed (continuing as guest):', err);
      currentUser = null;
      updateUIForAuth(null);
    }

    // Subscribe to store events to auto-sync to cloud when logged in
    if (window.STORE) {
      window.STORE.subscribe((event) => {
        if (currentUser && ['points_changed', 'skin_equipped', 'skin_unlocked'].includes(event)) {
          triggerDebouncedSync();
        }
      });
    }
  }

  // Called when user is signed in: Pull cloud data & merge with local
  async function onUserAuthenticated(user) {
    updateUIForAuth(user);
    await pullFromCloud(user);
  }

  // Pull profile from Supabase `profiles` table
  async function pullFromCloud(user) {
    if (!client || !user) return;
    try {
      const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.warn('Cloud fetch note:', error.message);
      }

      if (data) {
        // Merge cloud data with local store
        const cloudPoints = parseInt(data.points, 10) || 0;
        const localPoints = window.STORE.getPoints();
        const highestPoints = Math.max(cloudPoints, localPoints);

        if (highestPoints > localPoints) {
          window.STORE.addPoints(highestPoints - localPoints);
        }

        // Merge unlocked skins
        if (Array.isArray(data.unlocked_skins)) {
          const localOwned = window.STORE.getOwnedSkins();
          const merged = Array.from(new Set([...localOwned, ...data.unlocked_skins]));
          localStorage.setItem(window.STORE.STORAGE_KEYS.OWNED_SKINS, JSON.stringify(merged));
        }

        // Apply equipped skin if present
        if (data.equipped_skin) {
          window.STORE.equipSkin(data.equipped_skin);
        }

        // Update local user info name
        const displayName = data.name || user.user_metadata?.full_name || user.email.split('@')[0];
        localStorage.setItem(window.STORE.STORAGE_KEYS.USER_INFO, JSON.stringify({
          name: displayName,
          title: 'Year 3 Dental Student',
          avatarText: displayName.charAt(0).toUpperCase()
        }));

        updateUIForAuth(user);
      } else {
        // First time user, create cloud record
        await pushToCloud(user);
      }
    } catch (e) {
      console.warn('Cloud pull error:', e.message);
    }
  }

  // Push local profile to Supabase `profiles` table
  async function pushToCloud(user = currentUser) {
    if (!client || !user || isSyncing) return false;
    isSyncing = true;

    try {
      const profilePayload = {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email.split('@')[0],
        points: window.STORE.getPoints(),
        equipped_skin: window.STORE.getEquippedSkin(),
        unlocked_skins: window.STORE.getOwnedSkins(),
        avatar_url: user.user_metadata?.avatar_url || null,
        updated_at: new Date().toISOString()
      };

      const { error } = await client
        .from('profiles')
        .upsert(profilePayload, { onConflict: 'id' });

      if (error) {
        console.warn('Cloud sync error:', error.message);
        return false;
      }

      // Show small sync icon animation
      showSyncBadge(true);
      return true;
    } catch (e) {
      console.warn('Sync push note:', e.message);
      return false;
    } finally {
      isSyncing = false;
    }
  }

  function triggerDebouncedSync() {
    if (syncDebounceTimer) clearTimeout(syncDebounceTimer);
    syncDebounceTimer = setTimeout(() => {
      pushToCloud();
    }, 2500);
  }

  function showSyncBadge(isSuccess) {
    const badge = document.getElementById('cloud-sync-status-indicator');
    if (badge) {
      badge.innerHTML = isSuccess ? '☁️ ✓' : '☁️ ✕';
      badge.classList.add('sync-active');
      setTimeout(() => badge.classList.remove('sync-active'), 2000);
    }
  }

  // Update UI Elements across Header, Sidebar and Profile
  function updateUIForAuth(user) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;

    // 1. Sidebar User Meta
    const sideUserName = document.querySelector('.sidebar-user-name');
    const sideUserSub = document.getElementById('sidebar-user-sub');

    if (user) {
      const name = user.user_metadata?.full_name || user.email.split('@')[0];
      if (sideUserName) sideUserName.textContent = name;
      if (sideUserSub) sideUserSub.textContent = isAr ? 'حساب سحابي موثق ☁️' : 'Cloud Verified ☁️';
    } else {
      if (sideUserName) sideUserName.textContent = isAr ? 'طالب زائر (Guest)' : 'Guest Student';
      if (sideUserSub) sideUserSub.textContent = isAr ? 'السنة الثالثة • حساب محلي' : 'Year 3 • Local Guest';
    }

    // 2. Header Auth Button / Profile Pill
    const headerAuthContainer = document.getElementById('header-auth-action-box');
    if (headerAuthContainer) {
      if (user) {
        const name = user.user_metadata?.full_name || user.email.split('@')[0];
        headerAuthContainer.innerHTML = `
          <div class="header-user-badge" id="header-user-menu-btn" title="${user.email}">
            <span class="user-cloud-icon" title="${isAr ? 'متصل بالسحابة' : 'Cloud Synced'}">☁️</span>
            <span class="user-display-name">${name}</span>
            <button class="btn-auth-signout" onclick="window.SupabaseAuth.signOut()" title="${isAr ? 'تسجيل الخروج' : 'Sign Out'}">
              <i data-lucide="log-out" style="width: 13px; height: 13px;"></i>
            </button>
          </div>
        `;
      } else {
        headerAuthContainer.innerHTML = `
          <button class="header-auth-btn" onclick="window.AuthModal.open()" title="${isAr ? 'تسجيل الدخول أو إنشاء حساب اختياري' : 'Sign In or Create Account'}">
            <i data-lucide="user" style="width: 14px; height: 14px;"></i>
            <span>${isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
          </button>
        `;
      }
      if (window.lucide) window.lucide.createIcons();
    }

    // 3. Guest Banner Visibility
    const guestBanner = document.getElementById('guest-encourage-banner');
    if (guestBanner) {
      if (user) {
        guestBanner.style.display = 'none';
      } else {
        const dismissed = sessionStorage.getItem('kf_guest_banner_dismissed');
        if (!dismissed) guestBanner.style.display = 'flex';
      }
    }

    // 4. Update Global Mascot Avatars if needed
    if (typeof window.updateGlobalMascotAvatars === 'function') {
      window.updateGlobalMascotAvatars();
    }
  }

  // =========================================================================
  // AUTH METHODS
  // =========================================================================
  async function signUpWithEmail(email, password, fullName) {
    initClient();
    if (!client) {
      // Offline fallback: save local student name
      localStorage.setItem('kf_guest_name', fullName);
      return { success: true, offline: true };
    }

    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) throw error;
    return { success: true, data };
  }

  async function signInWithEmail(email, password) {
    initClient();
    if (!client) throw new Error('Supabase client not initialized');

    const { data, error } = await client.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return { success: true, data };
  }

  async function signInWithGoogle() {
    initClient();
    if (!client) {
      return {
        success: false,
        error: 'Supabase client not initialized',
        isConfigError: true
      };
    }

    try {
      // Determine best redirect URL (custom domain or GitHub Pages)
      let redirectUrl = window.location.origin + window.location.pathname;
      if (window.location.hostname === 'kurofangs.id.ly') {
        redirectUrl = 'https://kurofangs.id.ly';
      }

      const { data, error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      });

      if (error) {
        console.warn('Google OAuth warning:', error.message);
        return {
          success: false,
          error: error.message,
          isConfigError: true
        };
      }

      return { success: true, data };
    } catch (err) {
      console.warn('Google OAuth exception:', err.message);
      return {
        success: false,
        error: err.message,
        isConfigError: true
      };
    }
  }

  async function resetPassword(email) {
    initClient();
    if (!client) throw new Error('Supabase client not initialized');

    const { data, error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + window.location.pathname + '#/profile'
    });

    if (error) throw error;
    return { success: true, data };
  }

  async function signOut() {
    if (client) {
      try {
        await client.auth.signOut();
      } catch (e) {
        console.warn('Sign out note:', e);
      }
    }
    currentUser = null;
    updateUIForAuth(null);
    return { success: true };
  }

  // --- CLOUD SHEETS & PDF STORAGE OPERATIONS ---
  async function uploadSheetPdf(file, sheetId) {
    initClient();
    if (!client) return null;

    try {
      const fileExt = file.name.split('.').pop() || 'pdf';
      const cleanSheetId = (sheetId || 'sh_' + Date.now()).replace(/[^a-zA-Z0-9_-]/g, '_');
      const filePath = `sheets/${cleanSheetId}_${Date.now()}.${fileExt}`;

      const { data, error } = await client.storage
        .from('pdf-sheets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type || 'application/pdf'
        });

      if (error) {
        console.warn('Supabase storage upload note:', error.message);
        return null;
      }

      const { data: publicUrlData } = client.storage
        .from('pdf-sheets')
        .getPublicUrl(filePath);

      return publicUrlData?.publicUrl || null;
    } catch (e) {
      console.warn('uploadSheetPdf exception:', e.message);
      return null;
    }
  }

  async function publishSheetToCloud(sheet) {
    initClient();
    if (!client) return null;

    try {
      const payload = {
        id: sheet.id,
        subject_id: sheet.subject_id,
        title: sheet.title || sheet.title_ar || sheet.title_en,
        title_ar: sheet.title_ar || sheet.title,
        title_en: sheet.title_en || sheet.title,
        doctor_name: sheet.doctor_name || '',
        pages: parseInt(sheet.pages, 10) || 12,
        order_index: parseInt(sheet.order_index, 10) || 1,
        pdf_url: sheet.pdf_url || null,
        download_url: sheet.download_url || sheet.pdf_url || null,
        pdf_source: sheet.pdf_source || 'url',
        date: sheet.date || new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString()
      };

      const { data, error } = await client
        .from('sheets')
        .upsert(payload, { onConflict: 'id' })
        .select();

      if (error) {
        console.warn('Supabase publishSheet error:', error.message);
        return null;
      }

      return data?.[0] || payload;
    } catch (e) {
      console.warn('publishSheetToCloud exception:', e.message);
      return null;
    }
  }

  async function fetchCloudSheets() {
    initClient();
    if (!client) return [];

    try {
      const { data, error } = await client
        .from('sheets')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        console.warn('Supabase fetchCloudSheets note:', error.message);
        return [];
      }
      return data || [];
    } catch (e) {
      console.warn('fetchCloudSheets exception:', e.message);
      return [];
    }
  }

  async function deleteSheetFromCloud(sheetId) {
    initClient();
    if (!client) return false;

    try {
      const { error } = await client
        .from('sheets')
        .delete()
        .eq('id', sheetId);

      if (error) {
        console.warn('Supabase deleteSheetFromCloud error:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.warn('deleteSheetFromCloud exception:', e.message);
      return false;
    }
  }

  // Centralized Kuro Cloud API
  window.KuroCloud = {
    getClient: () => { initClient(); return client; },
    uploadSheetPdf,
    publishSheetToCloud,
    fetchCloudSheets,
    deleteSheetFromCloud
  };

  // Public API
  window.SupabaseAuth = {
    init: initAuth,
    getUser: () => currentUser,
    isLoggedIn: () => !!currentUser,
    isGuest: () => !currentUser,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    resetPassword,
    signOut,
    syncNow: () => pushToCloud(currentUser),
    pullNow: () => pullFromCloud(currentUser),
    updateUI: updateUIForAuth,
    cloud: window.KuroCloud,
    getClient: () => { initClient(); return client; }
  };

  // Auto-init when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    initAuth();
  });
})();
