/**
 * KURO FANGS — AVATAR CUSTOMIZATION MODAL
 * Supports 10 preset Kuro Mascot avatars & custom high-res image upload.
 * RTL/LTR Bi-directional, mobile responsive, Linear/Raycast design.
 */

(function (window) {
  'use strict';

  const KURO_PRESET_AVATARS = [
    { id: 'kuro-idle', nameAr: 'كورو العادي', nameEn: 'Standard Kuro', url: 'assets/characters/kuro/Kuro-Idle.png' },
    { id: 'kuro-excited', nameAr: 'كورو المتحمس', nameEn: 'Excited Kuro', url: 'assets/characters/kuro/Kuro-Excited.png' },
    { id: 'kuro-smart', nameAr: 'كورو الذكي', nameEn: 'Smart Kuro', url: 'assets/characters/kuro/Kuro-Smart.png' },
    { id: 'kuro-graduate', nameAr: 'كورو الخريج', nameEn: 'Graduate Kuro', url: 'assets/characters/kuro/Kuro-Graduate.png' },
    { id: 'kuro-hero', nameAr: 'كورو البطل', nameEn: 'Hero Kuro', url: 'assets/characters/kuro/Kuro-Hero.png' },
    { id: 'kuro-doctor', nameAr: 'دكتور كورو', nameEn: 'Doctor Kuro', url: 'assets/characters/kuro/Kuro-Doctor.png' },
    { id: 'kuro-reading', nameAr: 'كورو القارئ', nameEn: 'Reading Kuro', url: 'assets/characters/kuro/Kuro-Reading.png' },
    { id: 'kuro-cool', nameAr: 'كورو المميز', nameEn: 'Cool Kuro', url: 'assets/characters/kuro/Kuro-Cool.png' },
    { id: 'kuro-cute', nameAr: 'كورو اللطيف', nameEn: 'Cute Kuro', url: 'assets/characters/kuro/Kuro-Cute.png' },
    { id: 'kuro-chibi', nameAr: 'كورو الصغير', nameEn: 'Chibi Kuro', url: 'assets/characters/kuro/Kuro-Chibi.png' }
  ];

  class AvatarModal {
    constructor() {
      this.activeTab = 'upload';
      this.selectedUrl = null;
      this.onSaveCallback = null;
      this.modalEl = null;
    }

    open(currentUrl, onSave) {
      const cleanUrl = (currentUrl && !String(currentUrl).toLowerCase().includes('characters/kuro')) ? currentUrl : '';
      this.selectedUrl = cleanUrl;
      this.activeTab = 'upload';
      this.onSaveCallback = onSave;
      this.render();
    }

    close() {
      if (this.modalEl) {
        this.modalEl.classList.remove('active');
        setTimeout(() => {
          this.modalEl?.remove();
          this.modalEl = null;
        }, 200);
      }
      document.body.style.overflow = '';
    }

    render() {
      const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;

      // Clean existing modal if any
      document.querySelectorAll('#kuro-avatar-modal-overlay').forEach(el => el.remove());

      const overlay = document.createElement('div');
      overlay.id = 'kuro-avatar-modal-overlay';
      overlay.className = 'kuro-avatar-modal-overlay';
      overlay.dir = isAr ? 'rtl' : 'ltr';

      overlay.innerHTML = `
        <div class="kuro-avatar-modal-card">
          <!-- Modal Header -->
          <div class="avatar-modal-header">
            <div class="avatar-modal-header-info">
              <div class="avatar-modal-header-icon">
                <i data-lucide="camera"></i>
              </div>
              <div>
                <h3 class="avatar-modal-title">${isAr ? 'تغيير الصورة الشخصية' : 'Change Profile Avatar'}</h3>
                <p class="avatar-modal-sub">${isAr ? 'ارفع صورتك الشخصية لحسابك الأكاديمي' : 'Upload your personal profile picture'}</p>
              </div>
            </div>
            <button type="button" class="avatar-modal-close-btn" id="btn-close-avatar-modal" aria-label="Close">
              <i data-lucide="x"></i>
            </button>
          </div>

          <!-- Tab Content: Upload Zone -->
          <div class="avatar-modal-body" id="avatar-body-upload" style="display: block;">
            <div class="avatar-upload-zone" id="avatar-drop-zone">
              <input type="file" id="input-avatar-file" accept="image/png, image/jpeg, image/webp" style="display:none;" />
              <div class="upload-zone-preview" id="avatar-upload-preview-wrap" style="display:flex;align-items:center;justify-content:center;background:rgba(125,30,48,0.08);">
                <img id="avatar-upload-preview-img" src="${this.selectedUrl || ''}" alt="Preview" style="${this.selectedUrl ? 'display:block;' : 'display:none;'}" />
                <i data-lucide="user" id="avatar-upload-preview-icon" style="${this.selectedUrl ? 'display:none;' : 'display:block;'}width:32px;height:32px;color:#7D1E30;"></i>
              </div>
              <div class="upload-zone-instructions">
                <i data-lucide="image" class="upload-icon-main"></i>
                <h4 class="upload-zone-title">${isAr ? 'اضغط لاختيار صورة أو اسحبها هنا' : 'Click to choose image or drag & drop'}</h4>
                <p class="upload-zone-desc">${isAr ? 'يدعم صيغ PNG, JPG, WebP بحجم يصل إلى 5MB' : 'Supports PNG, JPG, WebP up to 5MB'}</p>
                <button type="button" class="avatar-browse-btn" id="btn-browse-avatar">
                  <i data-lucide="folder-open"></i>
                  <span>${isAr ? 'استعراض الصور' : 'Browse Files'}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Modal Actions Footer -->
          <div class="avatar-modal-footer">
            <button type="button" class="avatar-btn-cancel" id="btn-cancel-avatar-modal">
              ${isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button type="button" class="avatar-btn-save" id="btn-save-avatar-modal">
              <i data-lucide="check-circle-2"></i>
              <span>${isAr ? 'حفظ الصورة' : 'Save Avatar'}</span>
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';

      requestAnimationFrame(() => {
        overlay.classList.add('active');
      });

      this.modalEl = overlay;
      this.bindEvents(overlay, isAr);

      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }

    bindEvents(overlay, isAr) {
      const btnClose = overlay.querySelector('#btn-close-avatar-modal');
      const btnCancel = overlay.querySelector('#btn-cancel-avatar-modal');
      const btnSave = overlay.querySelector('#btn-save-avatar-modal');
      const tabPreset = overlay.querySelector('#tab-avatar-preset');
      const tabUpload = overlay.querySelector('#tab-avatar-upload');
      const bodyPreset = overlay.querySelector('#avatar-body-preset');
      const bodyUpload = overlay.querySelector('#avatar-body-upload');
      const fileInput = overlay.querySelector('#input-avatar-file');
      const browseBtn = overlay.querySelector('#btn-browse-avatar');
      const dropZone = overlay.querySelector('#avatar-drop-zone');
      const previewImg = overlay.querySelector('#avatar-upload-preview-img');

      btnClose?.addEventListener('click', () => this.close());
      btnCancel?.addEventListener('click', () => this.close());

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.close();
      });

      // Tab Switcher
      tabPreset?.addEventListener('click', () => {
        this.activeTab = 'preset';
        tabPreset.classList.add('active');
        tabUpload?.classList.remove('active');
        if (bodyPreset) bodyPreset.style.display = 'block';
        if (bodyUpload) bodyUpload.style.display = 'none';
      });

      tabUpload?.addEventListener('click', () => {
        this.activeTab = 'upload';
        tabUpload.classList.add('active');
        tabPreset?.classList.remove('active');
        if (bodyPreset) bodyPreset.style.display = 'none';
        if (bodyUpload) bodyUpload.style.display = 'block';
      });

      // Preset selection
      overlay.querySelectorAll('.avatar-preset-card').forEach(card => {
        card.addEventListener('click', () => {
          overlay.querySelectorAll('.avatar-preset-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          this.selectedUrl = card.getAttribute('data-avatar-url');
        });
      });

      // Upload file trigger
      browseBtn?.addEventListener('click', () => fileInput?.click());
      dropZone?.addEventListener('click', (e) => {
        if (!e.target.closest('#btn-browse-avatar')) {
          fileInput?.click();
        }
      });

      const handleFile = (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
          if (window.Toast) window.Toast.show(isAr ? 'يرجى اختيار ملف صورة صالحة' : 'Please select a valid image file', 'warning');
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          if (window.Toast) window.Toast.show(isAr ? 'حجم الصورة كبير جداً (الأقصى 5 ميجابايت)' : 'Image too large (max 5MB)', 'warning');
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target.result;
          this.selectedUrl = dataUrl;
          const previewIcon = overlay.querySelector('#avatar-upload-preview-icon');
          if (previewIcon) previewIcon.style.display = 'none';
          if (previewImg) {
            previewImg.src = dataUrl;
            previewImg.style.display = 'block';
          }
        };
        reader.readAsDataURL(file);
      };

      fileInput?.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        handleFile(file);
      });

      // Drag & Drop
      dropZone?.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
      });
      dropZone?.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
      dropZone?.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const file = e.dataTransfer?.files?.[0];
        handleFile(file);
      });

      // Save action
      btnSave?.addEventListener('click', () => {
        if (this.selectedUrl && typeof this.onSaveCallback === 'function') {
          this.onSaveCallback(this.selectedUrl);
        }
        this.close();
      });
    }
  }

  window.AvatarModal = new AvatarModal();
})(window);
