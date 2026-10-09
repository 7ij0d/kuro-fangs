/**
 * KURO FANGS — STUDENT REGISTRATION & PROFILE SETUP WIZARD
 * 1:1 Implementation of 10-Screen Visual Reference (media_1791551233524.jpg)
 * Stage 1: Personal Information (Full Name Ar, En, Gender, Avatar Modal)
 * Stage 2: Practical Group Selection (Tripoli Univ, Faculty of Dentistry, Year 3 | A1, A2, B1, B2)
 * Stage 3: Review Student Info & Confirmation Checkbox
 * Stage 4: Saving State Checklist & Progress Bar
 * Stage 5: Registration Success Screen
 */

(function (window) {
  'use strict';

  const RegisterSetupPage = {
    step: 1, // 1: Personal, 2: Group, 3: Review, 4: Saving, 5: Success
    formData: {
      full_name_ar: '',
      full_name_en: '',
      email: '',
      gender: 'male', // 'male' | 'female'
      practical_group_id: 'A1', // 'A1' | 'A2' | 'B1' | 'B2'
      avatar_url: 'assets/characters/kuro/Kuro-Idle.png',
      confirmation: false
    },

    render(container, params) {
      if (!container) return;

      // If profile registration is already complete, redirect to Home unless viewing immediate Step 5
      if (window.AUTH && window.AUTH.isRegistrationComplete() && this.step !== 5) {
        if (window.ROUTER && typeof window.ROUTER.navigate === 'function') {
          window.ROUTER.navigate('/');
        } else {
          window.location.hash = '#/';
        }
        return;
      }

      const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
      const user = window.AUTH ? window.AUTH.getUser() : null;

      // Pre-fill initial data from current session or localStorage if available
      if (user) {
        this.formData.email = user.email || this.formData.email;
        this.formData.full_name_ar = user.full_name || this.formData.full_name_ar;
        this.formData.avatar_url = user.avatar_url || this.formData.avatar_url;
      }
      try {
        const localInfo = JSON.parse(localStorage.getItem('kf_user_info') || '{}');
        if (localInfo.name && !this.formData.full_name_ar) this.formData.full_name_ar = localInfo.name;
        if (localInfo.avatar && !this.formData.avatar_url) this.formData.avatar_url = localInfo.avatar;
      } catch (e) {}

      // Clean lingering avatar modals or overlays from previous interactions
      document.querySelectorAll('#kuro-avatar-modal-overlay, .kuro-avatar-modal-overlay, #subject-modal-backdrop').forEach(el => el.remove());

      // Add special class to body to format wizard viewport
      document.body.classList.add('login-view-active');

      container.innerHTML = `
        <div class="kuro-register-setup-viewport" dir="${isAr ? 'rtl' : 'ltr'}">
          <div class="kuro-wizard-container">
            
            <!-- Wizard Top Branding Emblem -->
            <header class="wizard-header">
              <div class="wizard-brand-badge">
                <img src="assets/characters/kuro/Kuro-Idle.png" alt="Kuro" width="36" height="36" />
                <div class="wizard-brand-meta">
                  <span class="wizard-brand-title">Kuro Fangs</span>
                  <span class="wizard-brand-tag">${isAr ? 'كلية طب وجراحة الفم والأسنان — السنة الثالثة' : 'Faculty of Dentistry — Year 3'}</span>
                </div>
              </div>
              <div class="wizard-step-counter">
                ${isAr ? `الخطوة <strong>${Math.min(this.step, 3)}</strong> من <strong>3</strong>` : `Step <strong>${Math.min(this.step, 3)}</strong> of <strong>3</strong>`}
              </div>
            </header>

            <!-- Stepper Progress Bar -->
            <div class="wizard-stepper-bar" id="wizard-stepper-bar">
              <div class="stepper-item ${this.step >= 1 ? 'completed' : ''} ${this.step === 1 ? 'active' : ''}">
                <div class="stepper-circle">
                  ${this.step > 1 ? '<i data-lucide="check"></i>' : '1'}
                </div>
                <span class="stepper-label">${isAr ? 'البيانات الشخصية' : 'Personal Info'}</span>
              </div>
              <div class="stepper-line ${this.step >= 2 ? 'active' : ''}"></div>
              
              <div class="stepper-item ${this.step >= 2 ? 'completed' : ''} ${this.step === 2 ? 'active' : ''}">
                <div class="stepper-circle">
                  ${this.step > 2 ? '<i data-lucide="check"></i>' : '2'}
                </div>
                <span class="stepper-label">${isAr ? 'المجموعة العملية' : 'Practical Group'}</span>
              </div>
              <div class="stepper-line ${this.step >= 3 ? 'active' : ''}"></div>

              <div class="stepper-item ${this.step >= 3 ? 'completed' : ''} ${this.step >= 3 ? 'active' : ''}">
                <div class="stepper-circle">
                  <i data-lucide="check-circle-2"></i>
                </div>
                <span class="stepper-label">${isAr ? 'المراجعة والتأكيد' : 'Review & Complete'}</span>
              </div>
            </div>

            <!-- Dynamic Wizard Card Viewport -->
            <main class="wizard-card-body" id="wizard-card-content">
              ${this.renderStepContent(isAr)}
            </main>

          </div>
        </div>
      `;

      this.bindEvents(container, isAr);

      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    },

    renderStepContent(isAr) {
      if (this.step === 1) {
        return `
          <div class="wizard-step-pane animated fadeIn">
            <div class="wizard-step-header">
              <h2 class="wizard-step-title">${isAr ? 'إعداد ملف الطالب الشخصي' : 'Student Personal Profile Setup'}</h2>
              <p class="wizard-step-sub">${isAr ? 'أدخل اسمك ورقم مجموعتك لحفظ شيتاتك وملاحظاتك الأكاديمية' : 'Enter your name and practical group to personalize your academic experience'}</p>
            </div>

            <!-- Avatar Pick Banner -->
            <div class="wizard-avatar-section">
              <div class="wizard-avatar-preview-wrap">
                <img id="wizard-avatar-img" src="${this.formData.avatar_url}" alt="Student Avatar" onerror="this.src='assets/characters/kuro/Kuro-Idle.png'" />
                <button type="button" class="wizard-avatar-edit-badge" id="btn-trigger-avatar-modal" title="${isAr ? 'تغيير الصورة' : 'Change Avatar'}">
                  <i data-lucide="camera"></i>
                </button>
              </div>
              <div class="wizard-avatar-info">
                <strong class="avatar-title-text">${isAr ? 'الصورة الشخصية' : 'Profile Picture'}</strong>
                <span class="avatar-desc-text">${isAr ? 'انقر على الكاميرا لاختيار شخصية كورو أو رفع صورتك' : 'Click the camera to pick a Kuro mascot or upload'}</span>
                <button type="button" class="wizard-avatar-picker-link" id="btn-trigger-avatar-modal-link">
                  <i data-lucide="sparkles"></i>
                  <span>${isAr ? 'تغيير الصورة الشخصية' : 'Change Avatar'}</span>
                </button>
              </div>
            </div>

            <!-- Form Inputs -->
            <div class="wizard-form-grid">
              <!-- Full Name Field -->
              <div class="wizard-field-group full-width">
                <label class="wizard-label" for="input-reg-name">
                  <span>${isAr ? 'الاسم الكامل' : 'Full Name'}</span>
                  <span class="wizard-req">*</span>
                </label>
                <div class="wizard-input-wrap">
                  <i data-lucide="user" class="wizard-input-icon"></i>
                  <input
                    type="text"
                    id="input-reg-name"
                    class="wizard-input"
                    placeholder="${isAr ? 'مثال: طه عياد كابيلو' : 'e.g. Taha Cabello'}"
                    value="${this.formData.full_name || this.formData.full_name_ar || ''}"
                    required
                  />
                </div>
              </div>

              <!-- Email (Readonly) -->
              <div class="wizard-field-group full-width">
                <label class="wizard-label" for="input-reg-email">
                  <span>${isAr ? 'البريد الإلكتروني المسجل' : 'Registered Email Address'}</span>
                </label>
                <div class="wizard-input-wrap readonly">
                  <i data-lucide="mail" class="wizard-input-icon"></i>
                  <input
                    type="email"
                    id="input-reg-email"
                    class="wizard-input"
                    value="${this.formData.email}"
                    readonly
                  />
                  <span class="wizard-verified-badge">
                    <i data-lucide="shield-check"></i>
                    <span>${isAr ? 'موثق' : 'Verified'}</span>
                  </span>
                </div>
              </div>

              <!-- Gender Selection -->
              <div class="wizard-field-group full-width">
                <label class="wizard-label">
                  <span>${isAr ? 'الجنس' : 'Gender'}</span>
                  <span class="wizard-req">*</span>
                </label>
                <div class="wizard-gender-cards">
                  <label class="wizard-gender-card ${this.formData.gender === 'male' ? 'selected' : ''}">
                    <input type="radio" name="reg_gender" value="male" ${this.formData.gender === 'male' ? 'checked' : ''} style="display:none;" />
                    <div class="gender-card-content">
                      <div class="gender-icon-box">
                        <i data-lucide="user-check"></i>
                      </div>
                      <span class="gender-title">${isAr ? 'ذكر' : 'Male'}</span>
                    </div>
                    <div class="gender-check-mark"><i data-lucide="check"></i></div>
                  </label>

                  <label class="wizard-gender-card ${this.formData.gender === 'female' ? 'selected' : ''}">
                    <input type="radio" name="reg_gender" value="female" ${this.formData.gender === 'female' ? 'checked' : ''} style="display:none;" />
                    <div class="gender-card-content">
                      <div class="gender-icon-box female">
                        <i data-lucide="user-plus"></i>
                      </div>
                      <span class="gender-title">${isAr ? 'أنثى' : 'Female'}</span>
                    </div>
                    <div class="gender-check-mark"><i data-lucide="check"></i></div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Footer Action -->
            <div class="wizard-actions-row single-right">
              <button type="button" class="wizard-btn-primary" id="btn-step1-next">
                <span>${isAr ? 'التالي: اختيار المجموعة العملية' : 'Next: Select Practical Group'}</span>
                <i data-lucide="${isAr ? 'arrow-left' : 'arrow-right'}"></i>
              </button>
            </div>
          </div>
        `;
      }

      if (this.step === 2) {
        return `
          <div class="wizard-step-pane animated fadeIn">
            <div class="wizard-step-header">
              <h2 class="wizard-step-title">${isAr ? 'اختيار المجموعة العملية' : 'Select Practical Group'}</h2>
              <p class="wizard-step-sub">${isAr ? 'تخصيص الجداول والتنبيهات حسب المجموعات الدراسية لكلية طب الأسنان' : 'Customize lecture & clinical schedules for your dental group'}</p>
            </div>

            <!-- Fixed Academic Context Box -->
            <div class="academic-context-box">
              <div class="context-item">
                <i data-lucide="building-2"></i>
                <div>
                  <span class="context-label">${isAr ? 'الجامعة' : 'University'}</span>
                  <strong class="context-val">${isAr ? 'جامعة طرابلس' : 'Tripoli University'}</strong>
                </div>
              </div>
              <div class="context-item">
                <i data-lucide="graduation-cap"></i>
                <div>
                  <span class="context-label">${isAr ? 'الكلية' : 'Faculty'}</span>
                  <strong class="context-val">${isAr ? 'كلية طب وجراحة الفم والأسنان' : 'Faculty of Dentistry'}</strong>
                </div>
              </div>
              <div class="context-item">
                <i data-lucide="book-open"></i>
                <div>
                  <span class="context-label">${isAr ? 'السنة الدراسية' : 'Academic Year'}</span>
                  <strong class="context-val">${isAr ? 'السنة الثالثة (DS300)' : 'Year 3 (DS300)'}</strong>
                </div>
              </div>
            </div>

            <!-- Groups Cards Grid (A1 to E2: 10 Groups) -->
            <div class="wizard-groups-grid">
              ${['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2', 'E1', 'E2'].map(grp => {
                const isSelected = this.formData.practical_group_id === grp;
                return `
                  <div class="wizard-group-card ${isSelected ? 'selected' : ''}" data-group-id="${grp}">
                    <div class="group-card-badge">${grp}</div>
                    <div class="group-card-details">
                      <strong class="group-card-title">${isAr ? `المجموعة العملية ${grp}` : `Practical Group ${grp}`}</strong>
                      <span class="group-card-sub">${isAr ? 'المعامل والعيادات الأكاديمية' : 'Academic Clinics & Labs'}</span>
                    </div>
                    <div class="group-card-check">
                      <i data-lucide="check"></i>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Footer Actions -->
            <div class="wizard-actions-row">
              <button type="button" class="wizard-btn-secondary" id="btn-step2-back">
                <i data-lucide="${isAr ? 'arrow-right' : 'arrow-left'}"></i>
                <span>${isAr ? 'السابق' : 'Back'}</span>
              </button>

              <button type="button" class="wizard-btn-primary" id="btn-step2-next">
                <span>${isAr ? 'التالي: المراجعة والتأكيد' : 'Next: Review & Confirm'}</span>
                <i data-lucide="${isAr ? 'arrow-left' : 'arrow-right'}"></i>
              </button>
            </div>
          </div>
        `;
      }

      if (this.step === 3) {
        return `
          <div class="wizard-step-pane animated fadeIn">
            <div class="wizard-step-header">
              <h2 class="wizard-step-title">${isAr ? 'مراجعة بيانات الطالب' : 'Review Student Details'}</h2>
              <p class="wizard-step-sub">${isAr ? 'تأكد من صحة البيانات قبل إكمال التسجيل وإنشاء الملف الأكاديمي' : 'Verify your profile details before completing registration'}</p>
            </div>

            <!-- Summary Card 1: Personal Info -->
            <div class="wizard-review-card">
              <div class="review-card-header">
                <div class="review-card-title-wrap">
                  <i data-lucide="user-check"></i>
                  <h3>${isAr ? 'البيانات الشخصية' : 'Personal Details'}</h3>
                </div>
                <button type="button" class="review-edit-btn" id="btn-review-edit-step1">
                  <i data-lucide="edit-3"></i>
                  <span>${isAr ? 'تعديل' : 'Edit'}</span>
                </button>
              </div>
              <div class="review-card-body">
                <div class="review-avatar-row">
                  <img src="${this.formData.avatar_url}" alt="Avatar" class="review-avatar-img" onerror="this.src='assets/characters/kuro/Kuro-Idle.png'" />
                  <div>
                    <strong class="review-user-name">${this.formData.full_name_ar || 'طالب كورو'}</strong>
                    <span class="review-user-email">${this.formData.email}</span>
                  </div>
                </div>
                <div class="review-details-grid">
                  <div class="review-detail-item">
                    <span class="review-lbl">${isAr ? 'الاسم الكامل:' : 'Full Name:'}</span>
                    <strong class="review-val">${this.formData.full_name || this.formData.full_name_ar || '—'}</strong>
                  </div>
                  <div class="review-detail-item">
                    <span class="review-lbl">${isAr ? 'الجنس:' : 'Gender:'}</span>
                    <strong class="review-val">${this.formData.gender === 'male' ? (isAr ? 'ذكر' : 'Male') : (isAr ? 'أنثى' : 'Female')}</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- Summary Card 2: Academic Context -->
            <div class="wizard-review-card">
              <div class="review-card-header">
                <div class="review-card-title-wrap">
                  <i data-lucide="graduation-cap"></i>
                  <h3>${isAr ? 'السجل الأكاديمي والعملي' : 'Academic Context'}</h3>
                </div>
                <button type="button" class="review-edit-btn" id="btn-review-edit-step2">
                  <i data-lucide="edit-3"></i>
                  <span>${isAr ? 'تعديل' : 'Edit'}</span>
                </button>
              </div>
              <div class="review-card-body">
                <div class="review-details-grid">
                  <div class="review-detail-item">
                    <span class="review-lbl">${isAr ? 'الجامعة والكلية:' : 'University & Faculty:'}</span>
                    <strong class="review-val">${isAr ? 'جامعة طرابلس — كلية طب الأسنان' : 'Tripoli Univ — Dentistry'}</strong>
                  </div>
                  <div class="review-detail-item">
                    <span class="review-lbl">${isAr ? 'السنة الدراسية:' : 'Year:'}</span>
                    <strong class="review-val">${isAr ? 'السنة الثالثة (DS300)' : 'Year 3 (DS300)'}</strong>
                  </div>
                  <div class="review-detail-item highlight">
                    <span class="review-lbl">${isAr ? 'المجموعة العملية:' : 'Practical Group:'}</span>
                    <strong class="review-val group-pill">${this.formData.practical_group_id}</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- Confirmation Checkbox -->
            <div class="wizard-confirm-row">
              <label class="wizard-checkbox-label">
                <input type="checkbox" id="chk-reg-confirm" ${this.formData.confirmation ? 'checked' : ''} />
                <span class="custom-checkbox"><i data-lucide="check"></i></span>
                <span class="confirm-text">
                  ${isAr ? 'أؤكد أن البيانات أعلاه صحيحة وتطابق قيودي الجامعية بكلية طب الأسنان.' : 'I confirm that the above information is accurate and matches my university records.'}
                </span>
              </label>
            </div>

            <!-- Footer Actions -->
            <div class="wizard-actions-row">
              <button type="button" class="wizard-btn-secondary" id="btn-step3-back">
                <i data-lucide="${isAr ? 'arrow-right' : 'arrow-left'}"></i>
                <span>${isAr ? 'السابق' : 'Back'}</span>
              </button>

              <button type="button" class="wizard-btn-primary submit-final" id="btn-step3-submit">
                <i data-lucide="rocket"></i>
                <span>${isAr ? 'إكمال التسجيل والبدء 🚀' : 'Complete Registration 🚀'}</span>
              </button>
            </div>
          </div>
        `;
      }

      if (this.step === 4) {
        return `
          <div class="wizard-step-pane animated fadeIn text-center">
            <div class="saving-mascot-wrap">
              <img src="assets/characters/kuro/Kuro-Smart.png" alt="Kuro Saving" class="saving-mascot-img pulse-anim" />
            </div>

            <h3 class="saving-title">${isAr ? 'جاري إعداد حسابك الطلابي...' : 'Creating Student Account...'}</h3>
            <p class="saving-sub">${isAr ? 'يرجى الانتظار لححظات بينما نقوم بمزامنة بياناتك الأكاديمية' : 'Please wait while we sync your academic record'}</p>

            <!-- Progress Bar -->
            <div class="wizard-progress-bar-wrap">
              <div class="wizard-progress-bar-fill" id="wizard-saving-fill" style="width: 25%;"></div>
            </div>

            <!-- Animated Checklist -->
            <div class="saving-checklist">
              <div class="checklist-item active" id="chk-item-1">
                <i data-lucide="loader-2" class="spin-icon"></i>
                <span>${isAr ? 'إنشاء الملف الشخصي والسجل الطلابي...' : 'Creating student profile...'}</span>
              </div>
              <div class="checklist-item pending" id="chk-item-2">
                <i data-lucide="circle" class="circle-icon"></i>
                <span>${isAr ? 'تخصيص الشيتات والجداول للمجموعة ' + this.formData.practical_group_id + '...' : 'Customizing group ' + this.formData.practical_group_id + ' schedule...'}</span>
              </div>
              <div class="checklist-item pending" id="chk-item-3">
                <i data-lucide="circle" class="circle-icon"></i>
                <span>${isAr ? 'تهيئة السحابة والملاحظات الأكاديمية...' : 'Initializing cloud notes & data...'}</span>
              </div>
            </div>
          </div>
        `;
      }

      if (this.step === 5) {
        return `
          <div class="wizard-step-pane animated fadeIn text-center">
            <div class="success-mascot-wrap">
              <img src="assets/characters/kuro/kuro-welcome-sparks.png" alt="Success Kuro" class="success-mascot-img float-anim" onerror="this.src='assets/characters/kuro/Kuro-Excited.png'" />
            </div>

            <h2 class="success-title">${isAr ? 'تم إنشاء ملفك الطلابي بنجاح! 🎉' : 'Student Profile Created Successfully! 🎉'}</h2>
            <p class="success-sub">
              ${isAr 
                ? `مرحباً بك يا <strong>${this.formData.full_name_ar}</strong> في كورو فانغز! تم إعداد جدولك وشيتاتك للمجموعة <strong>${this.formData.practical_group_id}</strong> بنجاح.` 
                : `Welcome <strong>${this.formData.full_name_ar}</strong> to Kuro Fangs! Your schedule and sheets for Group <strong>${this.formData.practical_group_id}</strong> are ready.`}
            </p>

            <div class="success-badges-row">
              <span class="success-chip"><i data-lucide="building"></i> ${isAr ? 'جامعة طرابلس' : 'Tripoli Univ'}</span>
              <span class="success-chip"><i data-lucide="graduation-cap"></i> ${isAr ? 'السنة الثالثة طب أسنان' : 'Year 3 Dentistry'}</span>
              <span class="success-chip highlight"><i data-lucide="users"></i> ${isAr ? 'مجموعة ' + this.formData.practical_group_id : 'Group ' + this.formData.practical_group_id}</span>
            </div>

            <div class="wizard-actions-row center">
              <button type="button" class="wizard-btn-primary success-launch-btn" id="btn-success-launch">
                <span>${isAr ? 'الانتقال إلى المنصة الرئيسية 🚀' : 'Launch Kuro Fangs 🚀'}</span>
                <i data-lucide="${isAr ? 'arrow-left' : 'arrow-right'}"></i>
              </button>
            </div>
          </div>
        `;
      }
    },

    bindEvents(container, isAr) {
      // 1. Avatar Modal Trigger
      const triggerAvatar = () => {
        if (window.AvatarModal && typeof window.AvatarModal.open === 'function') {
          window.AvatarModal.open(this.formData.avatar_url, (newUrl) => {
            this.formData.avatar_url = newUrl;
            const imgEl = container.querySelector('#wizard-avatar-img');
            if (imgEl) imgEl.src = newUrl;
          });
        }
      };

      container.querySelector('#btn-trigger-avatar-modal')?.addEventListener('click', triggerAvatar);
      container.querySelector('#btn-trigger-avatar-modal-link')?.addEventListener('click', triggerAvatar);

      // Gender Selection Handler
      container.querySelectorAll('.wizard-gender-card').forEach(card => {
        card.addEventListener('click', () => {
          container.querySelectorAll('.wizard-gender-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          const radio = card.querySelector('input[type="radio"]');
          if (radio) {
            radio.checked = true;
            this.formData.gender = radio.value;
          }
        });
      });

      // Step 1 Next Button
      container.querySelector('#btn-step1-next')?.addEventListener('click', () => {
        const nameInput = container.querySelector('#input-reg-name');
        const val = (nameInput?.value || '').trim();

        if (!val) {
          if (window.Toast) window.Toast.show(isAr ? 'يرجى إدخال اسمك الكامل' : 'Please enter your full name', 'warning');
          nameInput?.focus();
          return;
        }

        this.formData.full_name = val;
        this.formData.full_name_ar = val;
        this.step = 2;
        this.render(container);
      });

      // Step 2 Group Cards Handler
      container.querySelectorAll('.wizard-group-card').forEach(card => {
        card.addEventListener('click', () => {
          container.querySelectorAll('.wizard-group-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          this.formData.practical_group_id = card.getAttribute('data-group-id') || 'A1';
        });
      });

      // Step 2 Navigation
      container.querySelector('#btn-step2-back')?.addEventListener('click', () => {
        this.step = 1;
        this.render(container);
      });

      container.querySelector('#btn-step2-next')?.addEventListener('click', () => {
        this.step = 3;
        this.render(container);
      });

      // Step 3 Navigation & Edits
      container.querySelector('#btn-step3-back')?.addEventListener('click', () => {
        this.step = 2;
        this.render(container);
      });

      container.querySelector('#btn-review-edit-step1')?.addEventListener('click', () => {
        this.step = 1;
        this.render(container);
      });

      container.querySelector('#btn-review-edit-step2')?.addEventListener('click', () => {
        this.step = 2;
        this.render(container);
      });

      // Step 3 Checkbox & Submit
      container.querySelector('#chk-reg-confirm')?.addEventListener('change', (e) => {
        this.formData.confirmation = e.target.checked;
      });

      container.querySelector('#btn-step3-submit')?.addEventListener('click', async (e) => {
        e.preventDefault();
        const confirmChk = container.querySelector('#chk-reg-confirm');
        if (confirmChk && !confirmChk.checked) {
          if (window.Toast) window.Toast.show(isAr ? 'يرجى الموافقة على صحة البيانات للمتابعة' : 'Please check confirmation to proceed', 'warning');
          return;
        }

        const btn = container.querySelector('#btn-step3-submit');
        if (btn) {
          btn.disabled = true;
          btn.style.opacity = '0.7';
          btn.innerHTML = `<i data-lucide="loader-2" class="spin-icon"></i> <span>${isAr ? 'جاري التفعيل...' : 'Saving...'}</span>`;
          if (window.lucide) window.lucide.createIcons();
        }

        this.formData.confirmation = true;

        // Save profile to Supabase & localStorage immediately
        const profilePayload = {
          full_name_ar: this.formData.full_name_ar,
          full_name_en: this.formData.full_name_en,
          gender: this.formData.gender,
          practical_group_id: this.formData.practical_group_id,
          avatar_url: this.formData.avatar_url,
          registration_status: 'completed',
          updated_at: new Date().toISOString()
        };

        if (window.AUTH && typeof window.AUTH.saveCompleteStudentProfile === 'function') {
          await window.AUTH.saveCompleteStudentProfile(profilePayload);
        } else {
          try {
            const current = JSON.parse(localStorage.getItem('kf_user_info') || '{}');
            localStorage.setItem('kf_user_info', JSON.stringify({
              ...current,
              name: this.formData.full_name_ar,
              full_name_ar: this.formData.full_name_ar,
              full_name_en: this.formData.full_name_en,
              gender: this.formData.gender,
              practical_group_id: this.formData.practical_group_id,
              avatar: this.formData.avatar_url,
              registration_status: 'completed'
            }));
          } catch (err) {}
        }

        // Instantly transition to Success screen (Step 5)
        this.step = 5;
        this.render(container);
      });

      // Step 5 Launch Button
      const launchBtn = container.querySelector('#btn-success-launch');
      if (launchBtn) {
        launchBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          if (launchBtn.disabled) return;
          launchBtn.disabled = true;
          launchBtn.style.opacity = '0.6';

          document.body.classList.remove('login-view-active');
          document.querySelectorAll('#kuro-avatar-modal-overlay, .kuro-avatar-modal-overlay, #subject-modal-backdrop').forEach(el => el.remove());

          // Re-affirm registration completion authoritatively across all stores
          if (window.AUTH) {
            await window.AUTH.saveCompleteStudentProfile(this.formData);
          }

          // Reset wizard step state for future clean invocations
          this.step = 1;

          if (window.ROUTER && typeof window.ROUTER.navigate === 'function') {
            window.ROUTER.navigate('/');
          } else if (typeof window.navigate === 'function') {
            window.navigate('/');
          } else {
            window.location.hash = '#/';
          }
        });
      }
    }
  };

  window.RegisterSetupPage = RegisterSetupPage;
})(window);
