/**
 * KURO FANGS — PROFILE & ACCOUNT SETTINGS PAGE
 * Allows the student to view and edit: name, email, password, profile picture.
 * Data is stored in localStorage: kf_user_info + kf_registered_students.
 */

window.ProfilePage = {

  _pendingAvatar: null,

  // ── Helpers ────────────────────────────────────────────────────────────────
  _getUserInfo() {
    try {
      return JSON.parse(localStorage.getItem('kf_user_info') || '{}');
    } catch { return {}; }
  },

  _saveUserInfo(data) {
    try {
      const current = this._getUserInfo();
      const updated = { ...current, ...data };
      localStorage.setItem('kf_user_info', JSON.stringify(updated));

      // Also update kf_registered_students record
      try {
        let students = JSON.parse(localStorage.getItem('kf_registered_students') || '[]');
        const email = updated.email || current.email;
        const idx = students.findIndex(s => s.email?.toLowerCase() === email?.toLowerCase());
        if (idx >= 0) {
          students[idx] = { ...students[idx], ...data };
          localStorage.setItem('kf_registered_students', JSON.stringify(students));
        }
      } catch {}
    } catch {}
  },

  // Update sidebar name, sub, and avatar live
  _syncSidebar(info) {
    // Name
    const nameEl = document.querySelector('.sidebar-user-name');
    if (nameEl && info.name) nameEl.textContent = info.name;

    // Avatar — if user has personal photo, show it; otherwise show mascot
    const avatar = info.avatar;
    const sideAvatar = document.getElementById('sidebar-user-avatar-img');
    const headerAvatar = document.getElementById('header-mascot-avatar-img');

    if (avatar) {
      if (sideAvatar) {
        sideAvatar.src = avatar;
        sideAvatar.style.objectFit = 'cover';
        sideAvatar.style.borderRadius = '50%';
      }
      if (headerAvatar) {
        headerAvatar.src = avatar;
        headerAvatar.style.objectFit = 'cover';
        headerAvatar.style.borderRadius = '50%';
      }
    }

    // Points badge
    const pts = window.STORE ? window.STORE.getPoints() : (info.points || 0);
    const subEl = document.getElementById('sidebar-user-sub');
    if (subEl) {
      const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
      subEl.textContent = isAr ? `السنة الثالثة — طب الأسنان` : `Year 3 — Faculty of Dentistry`;
    }
  },

  // ── Render ─────────────────────────────────────────────────────────────────
  render(container) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
    const info = this._getUserInfo();
    const authUser = window.AUTH ? window.AUTH.getUser() : null;
    const isAuthenticated = window.AUTH ? window.AUTH.isAuthenticated() : false;
    const isGuest = window.AUTH ? window.AUTH.isGuest() : false;
    this._pendingAvatar = null;

    const rawAvatarSrc = authUser?.avatar_url || info.avatar || null;
    const avatarSrc = (
      rawAvatarSrc &&
      !String(rawAvatarSrc).toLowerCase().includes('characters/kuro') &&
      !String(rawAvatarSrc).toLowerCase().includes('kuro-idle')
    ) ? rawAvatarSrc : null;
    const name = authUser?.full_name || info.name || (isAr ? 'طالب طب الأسنان' : 'Dental Student');
    const email = authUser?.email || info.email || '';
    const points = window.STORE ? window.STORE.getPoints() : (info.points || 0);
    const initialChar = (name || 'D').charAt(0).toUpperCase();

    container.innerHTML = `
      <!-- Page Title -->
      <div class="page-title-bar">
        <div class="page-title-group" style="display:flex;align-items:center;gap:16px;">
          <div style="width:58px;height:58px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle,rgba(200,67,67,0.12) 0%,transparent 70%);">
            <i data-lucide="user-round" style="width:32px;height:32px;color:var(--brand-burgundy);"></i>
          </div>
          <div>
            <h1 style="font-size:1.55rem;font-weight:850;color:var(--text-primary);margin:0 0 4px;letter-spacing:-0.02em;">
              ${isAr ? 'حسابي وملفي الشخصي' : 'My Account & Profile'}
            </h1>
            <p style="font-size:0.85rem;color:var(--text-secondary);margin:0;">
              ${isAr ? 'تعديل بياناتك الشخصية وكلمة المرور وصورة الملف الشخصي' : 'Edit your personal information, password, and profile picture'}
            </p>
          </div>
        </div>
      </div>

      <div class="profile-page-grid">

        <!-- LEFT: Avatar Card -->
        <div class="profile-avatar-card kf-panel">
          <div class="profile-avatar-circle-wrap">
            <div class="profile-avatar-circle" id="profile-avatar-ring" onclick="document.getElementById('profile-avatar-file-input').click()">
              <div id="profile-avatar-placeholder" style="${avatarSrc ? 'display:none;' : 'display:flex;'}width:100%;height:100%;align-items:center;justify-content:center;background:#7D1E30;color:#FFF;font-size:2.1rem;font-weight:800;border-radius:50%;">${initialChar}</div>
              <img id="profile-avatar-img" src="${avatarSrc || ''}" alt="${name}" style="${avatarSrc ? 'display:block;' : 'display:none;'}width:100%;height:100%;object-fit:cover;border-radius:50%;" />
              <div class="profile-avatar-overlay">
                <i data-lucide="camera" style="width:22px;height:22px;"></i>
                <span>${isAr ? 'تغيير' : 'Change'}</span>
              </div>
            </div>
            <input type="file" id="profile-avatar-file-input" accept="image/jpeg,image/png,image/webp" style="display:none;" />
          </div>

          <h2 class="profile-name-display">${name}</h2>
          <p class="profile-email-display">${email || (isAr ? 'بدون بريد إلكتروني' : 'No email set')}</p>

          <div class="profile-points-badge">
            <i data-lucide="zap" style="width:14px;height:14px;color:#F59E0B;"></i>
            <span>${points} ${isAr ? 'نقطة' : 'pts'}</span>
          </div>

          ${isAuthenticated ? `
            <div class="profile-auth-status" style="margin-top:14px;padding:12px;border-radius:12px;background:rgba(126,29,42,0.04);border:1px solid rgba(126,29,42,0.12);text-align:center;">
              <div style="font-size:0.8rem;font-weight:700;color:#7E1D2A;display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:4px;">
                <i data-lucide="shield-check" style="width:14px;height:14px;"></i>
                <span>${isAr ? 'حساب موثق عبر Google' : 'Google Verified'}</span>
              </div>
              <div style="font-size:0.75rem;color:var(--text-secondary);word-break:break-all;margin-bottom:10px;">
                ${email}
              </div>
              <button type="button" id="profile-signout-btn" style="width:100%;padding:8px 12px;border-radius:10px;background:#FFF;border:1px solid #EAE3D6;color:#DC2626;font-size:0.82rem;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;">
                <i data-lucide="log-out" style="width:13px;height:13px;"></i>
                <span>${isAr ? 'تسجيل الخروج' : 'Log Out'}</span>
              </button>
            </div>
          ` : isGuest ? `
            <div class="profile-auth-status" style="margin-top:14px;padding:12px;border-radius:12px;background:#FBF8F3;border:1px solid #EAE3D6;text-align:center;">
              <div style="font-size:0.8rem;font-weight:700;color:#854D0E;display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:4px;">
                <i data-lucide="user" style="width:14px;height:14px;"></i>
                <span>${isAr ? 'وضع الزائر (محلي)' : 'Guest Mode (Local)'}</span>
              </div>
              <p style="font-size:0.75rem;color:var(--text-secondary);margin:0 0 10px;line-height:1.4;">
                ${isAr ? 'سجّل دخولك لحفظ وتزامن دراستك وملاحظاتك.' : 'Sign in to sync your progress.'}
              </p>
              <button type="button" id="profile-signin-btn" style="width:100%;padding:8px 12px;border-radius:10px;background:#7E1D2A;border:none;color:#FFF;font-size:0.82rem;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;">
                <i data-lucide="log-in" style="width:13px;height:13px;"></i>
                <span>${isAr ? 'المتابعة بحساب Google' : 'Sign in with Google'}</span>
              </button>
            </div>
          ` : ''}

          <button class="profile-remove-avatar-btn" id="profile-remove-avatar-btn" style="${avatarSrc ? '' : 'display:none;'}">
            <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
            <span>${isAr ? 'إزالة الصورة' : 'Remove Photo'}</span>
          </button>
        </div>

        <!-- RIGHT: Edit Forms -->
        <div class="profile-forms-col">

          <!-- Personal Info Form -->
          <div class="kf-panel profile-section">
            <div class="profile-section-header">
              <i data-lucide="user" style="width:18px;height:18px;color:var(--brand-burgundy);"></i>
              <h3>${isAr ? 'المعلومات الشخصية' : 'Personal Information'}</h3>
            </div>

            <form id="profile-info-form">
              <div class="profile-field-row">
                <div class="auth-input-group" style="flex:1;">
                  <label class="auth-input-label">${isAr ? 'الاسم الكامل' : 'Full Name'}</label>
                  <div class="auth-input-wrapper">
                    <i data-lucide="user" class="auth-input-icon"></i>
                    <input type="text" id="profile-name-input" class="auth-input" value="${name}" required placeholder="${isAr ? 'اسمك الكامل' : 'Your full name'}" />
                  </div>
                </div>
              </div>

              <div class="auth-input-group">
                <label class="auth-input-label">${isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
                <div class="auth-input-wrapper">
                  <i data-lucide="mail" class="auth-input-icon"></i>
                  <input type="email" id="profile-email-input" class="auth-input" value="${email}" placeholder="student@dental.edu" />
                </div>
              </div>

              <div id="profile-info-feedback" class="profile-feedback" style="display:none;"></div>

              <button type="submit" class="profile-save-btn" id="profile-info-save-btn">
                <i data-lucide="check" style="width:15px;height:15px;"></i>
                <span>${isAr ? 'حفظ المعلومات' : 'Save Information'}</span>
              </button>
            </form>
          </div>

          <!-- Password Form -->
          <div class="kf-panel profile-section">
            <div class="profile-section-header">
              <i data-lucide="lock" style="width:18px;height:18px;color:var(--brand-burgundy);"></i>
              <h3>${isAr ? 'تغيير كلمة المرور' : 'Change Password'}</h3>
            </div>

            <form id="profile-password-form">
              <div class="auth-input-group">
                <label class="auth-input-label">${isAr ? 'كلمة المرور الجديدة' : 'New Password'}</label>
                <div class="auth-input-wrapper">
                  <i data-lucide="lock" class="auth-input-icon"></i>
                  <input type="password" id="profile-new-password" class="auth-input" placeholder="••••••••" minlength="6" />
                  <button type="button" class="profile-toggle-pw" data-target="profile-new-password">
                    <i data-lucide="eye" style="width:15px;height:15px;"></i>
                  </button>
                </div>
              </div>

              <div class="auth-input-group">
                <label class="auth-input-label">${isAr ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
                <div class="auth-input-wrapper">
                  <i data-lucide="lock" class="auth-input-icon"></i>
                  <input type="password" id="profile-confirm-password" class="auth-input" placeholder="••••••••" minlength="6" />
                  <button type="button" class="profile-toggle-pw" data-target="profile-confirm-password">
                    <i data-lucide="eye" style="width:15px;height:15px;"></i>
                  </button>
                </div>
              </div>

              <div id="profile-pw-feedback" class="profile-feedback" style="display:none;"></div>

              <button type="submit" class="profile-save-btn" id="profile-pw-save-btn">
                <i data-lucide="shield-check" style="width:15px;height:15px;"></i>
                <span>${isAr ? 'تحديث كلمة المرور' : 'Update Password'}</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    this._bindEvents(container, isAr);
  },

  // ── Events ─────────────────────────────────────────────────────────────────
  _bindEvents(container, isAr) {
    // Avatar file input
    const fileInput = document.getElementById('profile-avatar-file-input');
    fileInput?.addEventListener('change', (e) => this._onAvatarChange(e, isAr));

    // Remove avatar
    document.getElementById('profile-remove-avatar-btn')?.addEventListener('click', () => {
      this._pendingAvatar = 'remove';
      const img = document.getElementById('profile-avatar-img');
      const placeholder = document.getElementById('profile-avatar-placeholder');
      if (img) { img.src = ''; img.style.display = 'none'; }
      if (placeholder) { placeholder.style.display = 'flex'; }
      document.getElementById('profile-remove-avatar-btn').style.display = 'none';
    });

    // Profile signout button
    document.getElementById('profile-signout-btn')?.addEventListener('click', () => {
      const confirmMsg = isAr ? 'هل أنت متأكد من تسجيل الخروج؟' : 'Are you sure you want to sign out?';
      if (window.confirm(confirmMsg)) {
        if (window.AUTH) window.AUTH.signOut();
      }
    });

    // Profile signin / upgrade button
    document.getElementById('profile-signin-btn')?.addEventListener('click', () => {
      if (window.AUTH) window.AUTH.signInWithGoogle();
    });

    // Info form
    document.getElementById('profile-info-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this._saveInfo(isAr);
    });

    // Password form
    document.getElementById('profile-password-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this._savePassword(isAr);
    });

    // Toggle password visibility
    container.querySelectorAll('.profile-toggle-pw').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const input = document.getElementById(targetId);
        if (!input) return;
        const isHidden = input.type === 'password';
        input.type = isHidden ? 'text' : 'password';
        const icon = btn.querySelector('i');
        if (icon) icon.setAttribute('data-lucide', isHidden ? 'eye-off' : 'eye');
        if (window.lucide) window.lucide.createIcons();
      });
    });
  },

  _onAvatarChange(e, isAr) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      this._showFeedback('profile-info-feedback', isAr ? 'حجم الصورة يتجاوز 3MB' : 'Image exceeds 3MB limit', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      this._pendingAvatar = ev.target.result;
      const img = document.getElementById('profile-avatar-img');
      const placeholder = document.getElementById('profile-avatar-placeholder');
      if (placeholder) placeholder.style.display = 'none';
      if (img) {
        img.src = this._pendingAvatar;
        img.style.display = 'block';
        img.style.objectFit = 'cover';
        img.style.width = '100%';
        img.style.height = '100%';
      }
      const removeBtn = document.getElementById('profile-remove-avatar-btn');
      if (removeBtn) removeBtn.style.display = '';
    };
    reader.readAsDataURL(file);
  },

  _saveInfo(isAr) {
    const name = document.getElementById('profile-name-input')?.value.trim();
    const email = document.getElementById('profile-email-input')?.value.trim();

    if (!name) {
      this._showFeedback('profile-info-feedback', isAr ? 'الرجاء إدخال الاسم' : 'Please enter your name', 'error');
      return;
    }

    const updates = { name, email };

    // Handle avatar change
    if (this._pendingAvatar === 'remove') {
      updates.avatar = null;
    } else if (this._pendingAvatar) {
      updates.avatar = this._pendingAvatar;
    }

    this._saveUserInfo(updates);
    this._syncSidebar({ ...this._getUserInfo(), ...updates });
    this._pendingAvatar = null;

    // Update displayed name/email in avatar card
    const nameDisplay = document.querySelector('.profile-name-display');
    const emailDisplay = document.querySelector('.profile-email-display');
    if (nameDisplay) nameDisplay.textContent = name;
    if (emailDisplay) emailDisplay.textContent = email || (isAr ? 'بدون بريد إلكتروني' : 'No email set');

    this._showFeedback('profile-info-feedback', isAr ? '✅ تم حفظ المعلومات بنجاح' : '✅ Information saved successfully', 'success');

    if (window.showToast) window.showToast(isAr ? 'تم تحديث ملفك الشخصي' : 'Profile updated', { type: 'success' });
  },

  _savePassword(isAr) {
    const newPw = document.getElementById('profile-new-password')?.value;
    const confirmPw = document.getElementById('profile-confirm-password')?.value;

    if (!newPw || newPw.length < 6) {
      this._showFeedback('profile-pw-feedback', isAr ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters', 'error');
      return;
    }
    if (newPw !== confirmPw) {
      this._showFeedback('profile-pw-feedback', isAr ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match', 'error');
      return;
    }

    this._saveUserInfo({ password: newPw });

    // Clear inputs
    document.getElementById('profile-new-password').value = '';
    document.getElementById('profile-confirm-password').value = '';

    this._showFeedback('profile-pw-feedback', isAr ? '✅ تم تغيير كلمة المرور بنجاح' : '✅ Password updated successfully', 'success');
    if (window.showToast) window.showToast(isAr ? 'تم تحديث كلمة المرور' : 'Password updated', { type: 'success' });

    // Try Supabase update
    if (window.SupabaseAuth && typeof window.SupabaseAuth.updatePassword === 'function') {
      window.SupabaseAuth.updatePassword(newPw).catch(() => {});
    }
  },

  _showFeedback(elId, message, type = 'success') {
    const el = document.getElementById(elId);
    if (!el) return;
    el.style.display = 'block';
    el.className = `profile-feedback profile-feedback-${type}`;
    el.textContent = message;
    setTimeout(() => { if (el) el.style.display = 'none'; }, 4000);
  }
};
