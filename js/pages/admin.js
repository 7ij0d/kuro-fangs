/**
 * KURO FANGS — SUPER-ADMIN CONTROL CENTER PORTAL (#/admin)
 * Protected Admin Management System with Confirmation Dialogs & Permanent Deletion Persistence
 */

window.AdminPage = (function () {
  let isAdminAuthenticated = false;
  let activeTab = 'overview'; // 'overview' | 'sheets' | 'alerts' | 'students' | 'schedules'

  function checkAuth() {
    return sessionStorage.getItem('kf_admin_auth') === 'true' || isAdminAuthenticated;
  }

  function authenticate(passcode) {
    const validPasscodes = ['kuro2026', 'admin2026', '123456'];
    if (validPasscodes.includes(passcode.trim())) {
      isAdminAuthenticated = true;
      sessionStorage.setItem('kf_admin_auth', 'true');
      return true;
    }
    return false;
  }

  // --- LOCAL STORAGE & DELETION PERSISTENCE HELPERS ---
  function getCustomSheets() {
    try {
      return JSON.parse(localStorage.getItem('kf_admin_custom_sheets') || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveCustomSheets(sheets) {
    localStorage.setItem('kf_admin_custom_sheets', JSON.stringify(sheets));
  }

  function getDeletedSheetIds() {
    try {
      return JSON.parse(localStorage.getItem('kf_deleted_sheet_ids') || '[]');
    } catch (e) {
      return [];
    }
  }

  function addDeletedSheetId(id) {
    const deleted = getDeletedSheetIds();
    if (!deleted.includes(id)) {
      deleted.push(id);
      localStorage.setItem('kf_deleted_sheet_ids', JSON.stringify(deleted));
    }
  }

  function getCustomAlerts() {
    try {
      return JSON.parse(localStorage.getItem('kf_admin_custom_alerts') || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveCustomAlerts(alerts) {
    localStorage.setItem('kf_admin_custom_alerts', JSON.stringify(alerts));
  }

  function getDeletedAlertIds() {
    try {
      return JSON.parse(localStorage.getItem('kf_deleted_alert_ids') || '[]');
    } catch (e) {
      return [];
    }
  }

  function addDeletedAlertId(id) {
    const deleted = getDeletedAlertIds();
    if (!deleted.includes(id)) {
      deleted.push(id);
      localStorage.setItem('kf_deleted_alert_ids', JSON.stringify(deleted));
    }
  }

  function getRegisteredStudents() {
    try {
      const raw = localStorage.getItem('kf_registered_students');
      if (raw === null) {
        const initialList = [
          {
            id: 'st_101',
            name: 'هدى فتحي العريبي',
            email: 'huda.fathie@dentistry.uot.edu.ly',
            passcode: 'huda2026',
            skin: 'fox_skin_1',
            skinName: 'الثعلب الأكاديمي الكلاسيكي',
            points: 145,
            date: '2026-09-10'
          },
          {
            id: 'st_102',
            name: 'محمد علي الورفلي',
            email: 'mohamed.warfalli@dentistry.uot.edu.ly',
            passcode: 'mohed998',
            skin: 'fox_skin_2',
            skinName: 'الثعلب المقاتل النينجا',
            points: 210,
            date: '2026-09-08'
          },
          {
            id: 'st_103',
            name: 'سارة خالد الماجري',
            email: 'sara.majri@dentistry.uot.edu.ly',
            passcode: 'sara_dent2026',
            skin: 'fox_skin_3',
            skinName: 'ثعلب الطبيب الاستشاري',
            points: 90,
            date: '2026-09-11'
          },
          {
            id: 'st_104',
            name: 'طه مصطفى الفيتوري',
            email: 'taha.fituri@dentistry.uot.edu.ly',
            passcode: 'taha_kuro2026',
            skin: 'fox_skin_1',
            skinName: 'الثعلب الأكاديمي الكلاسيكي',
            points: 320,
            date: '2026-09-01'
          }
        ];
        localStorage.setItem('kf_registered_students', JSON.stringify(initialList));
        return initialList;
      }
      const list = JSON.parse(raw);
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

  function saveRegisteredStudents(students) {
    localStorage.setItem('kf_registered_students', JSON.stringify(students));
  }

  // --- CONFIRMATION DIALOG MODAL ---
  function showConfirmModal(itemTitle, itemType, onConfirm) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
    let confirmEl = document.getElementById('admin-confirm-backdrop');
    if (confirmEl) confirmEl.remove();

    const markup = `
      <div id="admin-confirm-backdrop" class="doc-viewer-backdrop active" style="z-index: 100000; background: rgba(10, 11, 18, 0.88); backdrop-filter: blur(12px);">
        <div class="card" style="max-width: 440px; width: 90%; padding: 28px 24px; border-radius: 20px; text-align: center; border: 1.5px solid #EF4444; box-shadow: 0 20px 50px rgba(0,0,0,0.5); animation: docZoomIn 0.2s ease;">
          <div style="width: 64px; height: 64px; margin: 0 auto 14px; background: rgba(239, 68, 68, 0.12); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #EF4444;">
            <i data-lucide="alert-triangle" style="width: 32px; height: 32px;"></i>
          </div>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">
            ${isAr ? 'تأكيد الحذف النهائي' : 'Confirm Permanent Deletion'}
          </h3>
          <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 16px; line-height: 1.5;">
            ${isAr 
              ? `هل أنت تأكد من رغبتك في حذف <strong>"${itemTitle}"</strong>؟ سيتم إزالته فوراً ومنع ظهوره لجميع الطلبة على المنصة نهائياً.` 
              : `Are you sure you want to permanently delete <strong>"${itemTitle}"</strong>? It will be removed from all student views immediately.`}
          </p>

          <div style="display: flex; gap: 10px; justify-content: center;">
            <button id="btn-cancel-delete" class="btn btn-secondary" style="flex: 1; padding: 10px; font-weight: 700;">
              ${isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button id="btn-confirm-delete" class="btn btn-primary" style="flex: 1; background: #EF4444; border-color: #EF4444; padding: 10px; font-weight: 800; gap: 6px;">
              <i data-lucide="trash-2" style="width: 15px; height: 15px;"></i>
              <span>${isAr ? 'نعم، احذف نهائياً' : 'Delete Permanently'}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', markup);
    if (window.lucide) window.lucide.createIcons();

    document.getElementById('btn-cancel-delete')?.addEventListener('click', () => {
      document.getElementById('admin-confirm-backdrop')?.remove();
    });

    document.getElementById('btn-confirm-delete')?.addEventListener('click', () => {
      document.getElementById('admin-confirm-backdrop')?.remove();
      if (typeof onConfirm === 'function') onConfirm();
    });
  }

  function showDoubleConfirmModal(sheetTitle, onFinalConfirm) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
    let confirmEl = document.getElementById('admin-confirm-backdrop');
    if (confirmEl) confirmEl.remove();

    const markup = `
      <div id="admin-confirm-backdrop" class="doc-viewer-backdrop active" style="z-index: 100000; background: rgba(10, 11, 18, 0.88); backdrop-filter: blur(12px);">
        <div class="card" style="max-width: 440px; width: 90%; padding: 28px 24px; border-radius: 20px; text-align: center; border: 1.5px solid #EF4444; box-shadow: 0 20px 50px rgba(0,0,0,0.5); animation: docZoomIn 0.2s ease;">
          <div style="width: 64px; height: 64px; margin: 0 auto 14px; background: rgba(239, 68, 68, 0.12); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #EF4444;">
            <i data-lucide="alert-triangle" style="width: 32px; height: 32px;"></i>
          </div>
          <h3 id="dc-title" style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">
            ${isAr ? 'تأكيد الحذف النهائي' : 'Confirm Permanent Deletion'}
          </h3>
          <p id="dc-desc" style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 16px; line-height: 1.5;">
            ${isAr 
              ? `هل أنت متأكد من حذف هذا الشيت نهائياً؟ <strong>"${sheetTitle}"</strong>` 
              : `Are you sure you want to permanently delete <strong>"${sheetTitle}"</strong>?`}
          </p>
          <div id="dc-input-container" style="display: none; margin-bottom: 16px;">
            <p style="font-size: 0.8rem; color: #EF4444; margin-bottom: 8px; font-weight: 700;">
              ${isAr ? 'للتأكيد النهائي، اكتب كلمة "حذف" في المربع أدناه:' : 'To permanently delete, type "delete" below:'}
            </p>
            <input type="text" id="dc-confirm-input" class="auth-input" placeholder="${isAr ? "اكتب 'حذف' للتأكيد النهائي" : "Type 'delete' to confirm"}" style="text-align: center;" />
          </div>
          <div style="display: flex; gap: 10px; justify-content: center;">
            <button id="btn-cancel-delete" class="btn btn-secondary" style="flex: 1; padding: 10px; font-weight: 700;">
              ${isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button id="btn-confirm-delete" class="btn btn-primary" style="flex: 1; background: #EF4444; border-color: #EF4444; padding: 10px; font-weight: 800; gap: 6px;">
              <i data-lucide="trash-2" style="width: 15px; height: 15px;"></i>
              <span id="dc-btn-text">${isAr ? 'تأكيد' : 'Confirm'}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', markup);
    if (window.lucide) window.lucide.createIcons();

    let stage = 1;
    const btnCancel = document.getElementById('btn-cancel-delete');
    const btnConfirm = document.getElementById('btn-confirm-delete');
    const inputContainer = document.getElementById('dc-input-container');
    const confirmInput = document.getElementById('dc-confirm-input');

    btnCancel?.addEventListener('click', () => {
      document.getElementById('admin-confirm-backdrop')?.remove();
    });

    confirmInput?.addEventListener('input', (e) => {
      const val = e.target.value.trim().toLowerCase();
      if (val === 'حذف' || val === 'delete') {
        btnConfirm.disabled = false;
        btnConfirm.style.opacity = '1';
      } else {
        btnConfirm.disabled = true;
        btnConfirm.style.opacity = '0.5';
      }
    });

    btnConfirm?.addEventListener('click', async () => {
      if (stage === 1) {
        stage = 2;
        inputContainer.style.display = 'block';
        btnConfirm.disabled = true;
        btnConfirm.style.opacity = '0.5';
        document.getElementById('dc-desc').style.display = 'none';
        const btnText = document.getElementById('dc-btn-text');
        if (btnText) btnText.textContent = isAr ? 'حذف نهائي' : 'Delete Permanently';
        confirmInput?.focus();
      } else {
        btnConfirm.disabled = true;
        if (btnCancel) btnCancel.disabled = true;
        btnConfirm.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
            <div style="width: 16px; height: 16px; border: 2px solid #FFF; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
            <span>${isAr ? 'جاري الحذف...' : 'Deleting...'}</span>
          </div>
        `;
        try {
          if (typeof onFinalConfirm === 'function') {
            await onFinalConfirm();
          }
        } finally {
          document.getElementById('admin-confirm-backdrop')?.remove();
        }
      }
    });
  }

  function showEditSheetModal(sheetId, subjects, isAr, reRenderCallback) {
    let sheet = null;
    if (window.DATA && Array.isArray(window.DATA.sheets)) {
      sheet = window.DATA.sheets.find(s => s.id === sheetId);
    }
    if (!sheet) {
      const customSheets = getCustomSheets();
      sheet = customSheets.find(s => s.id === sheetId);
    }
    if (!sheet) return;

    let overlay = document.getElementById('admin-edit-modal-backdrop');
    if (overlay) overlay.remove();

    const pdfInfo = sheet.pdf_source === 'local' ? '📄 ملف محلي' : (sheet.pdf_source === 'url' ? '🔗 رابط خارجي' : (sheet.pdf_url ? '🔗 رابط خارجي' : '⚠️ لا يوجد ملف'));

    const markup = `
      <div id="admin-edit-modal-backdrop" class="doc-viewer-backdrop active" style="z-index: 100000; background: rgba(10, 11, 18, 0.88); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center;">
        <div class="card" style="max-width: 520px; width: 90%; max-height: 90vh; overflow-y: auto; padding: 28px 24px; border-radius: 20px; border: 1px solid var(--border-subtle); box-shadow: 0 20px 50px rgba(0,0,0,0.5); animation: docZoomIn 0.2s ease;">
          <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
            <i data-lucide="edit" style="color: var(--brand-primary); width: 22px; height: 22px;"></i>
            <span>${isAr ? 'تعديل الشيت' : 'Edit Sheet'}</span>
          </h3>
          <form id="form-edit-sheet" style="display: grid; gap: 14px; text-align: start;">
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'عنوان الشيت (عنوان واحد):' : 'Sheet Title:'}</label>
              <input type="text" id="edit-sheet-title" class="auth-input" value="${sheet.title_ar || sheet.title_en || sheet.title || ''}" required placeholder="${isAr ? 'عنوان الشيت' : 'Sheet title'}" />
            </div>
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'المادة الدراسية:' : 'Subject:'}</label>
              <select id="edit-sheet-subject" class="auth-input" required>
                ${subjects.map(s => `<option value="${s.id}" ${s.id === sheet.subject_id ? 'selected' : ''}>${isAr ? s.name_ar : s.name_en}</option>`).join('')}
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'أستاذ المادة (الدكتور):' : 'Doctor:'}</label>
              <input type="text" id="edit-sheet-doctor" class="auth-input" value="${sheet.doctor_name || ''}" placeholder="${isAr ? 'اسم الدكتور' : 'Doctor Name'}" />
            </div>
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'الترتيب (Order):' : 'Order Index:'}</label>
              <select id="edit-sheet-order" class="auth-input">
                <option value="auto">${isAr ? 'تلقائي (آخر ترتيب)' : 'Auto'}</option>
                ${Array.from({length: 30}, (_, i) => i + 1).map(i => `<option value="${i}" ${i === sheet.order_index ? 'selected' : ''}>${isAr ? `الشيت رقم ${i}` : `Sheet #${i}`}</option>`).join('')}
              </select>
            </div>
            <div style="background: rgba(255,255,255,0.02); border-radius: 12px; padding: 12px; border: 1px solid rgba(255,255,255,0.05);">
              <div style="font-size: 0.8rem; margin-bottom: 8px;">${isAr ? 'الملف الحالي:' : 'Current File:'} <span style="color: #38BDF8;">${pdfInfo}</span> (${sheet.pages || '—'} ${isAr ? 'صفحة' : 'pages'})</div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'استبدال بملف PDF جديد:' : 'Replace with new PDF:'}</label>
              <input type="file" id="edit-sheet-file" accept="application/pdf" style="font-size: 0.8rem;" />
              <div style="margin-top: 8px;">
                <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'أو رابط PDF خارجي:' : 'Or external PDF URL:'}</label>
                <input type="url" id="edit-sheet-url" class="auth-input" dir="ltr" value="${sheet.pdf_source === 'url' ? (sheet.pdf_url || '') : (sheet.pdf_url || '')}" placeholder="https://..." />
              </div>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 10px;">
              <button type="button" id="btn-cancel-edit" class="btn btn-secondary" style="flex: 1; padding: 10px; font-weight: 700;">
                ${isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button type="submit" class="btn btn-primary" style="flex: 1; padding: 10px; font-weight: 800;">
                ${isAr ? 'حفظ التغييرات' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', markup);
    if (window.lucide) window.lucide.createIcons();

    document.getElementById('btn-cancel-edit')?.addEventListener('click', () => {
      document.getElementById('admin-edit-modal-backdrop')?.remove();
    });

    document.getElementById('form-edit-sheet')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const singleTitle = document.getElementById('edit-sheet-title').value.trim();
      const updates = {
        title_ar: singleTitle,
        title_en: singleTitle,
        title: singleTitle,
        subject_id: document.getElementById('edit-sheet-subject').value,
        doctor_name: document.getElementById('edit-sheet-doctor').value.trim(),
      };
      
      const orderVal = document.getElementById('edit-sheet-order').value;
      if (orderVal !== 'auto') {
        updates.order_index = parseInt(orderVal, 10);
      }

      const editFileInput = document.getElementById('edit-sheet-file');
      const editUrlInput = document.getElementById('edit-sheet-url');
      if (editFileInput && editFileInput.files.length > 0) {
        const file = editFileInput.files[0];
        if (file.size > 15 * 1024 * 1024) {
          if (window.showToast) window.showToast(isAr ? 'الملف كبير جداً (الحد الأقصى 15MB)' : 'File too large (Max 15MB)', {type: 'error'});
          return;
        }
        const detectedPages = await detectPdfPageCount(file);
        if (detectedPages) updates.pages = `${detectedPages}`;
        updates.pdf_source = 'local';

        // Cloud PDF upload if available
        if (window.KuroCloud && typeof window.KuroCloud.uploadSheetPdf === 'function') {
          try {
            const cloudUrl = await window.KuroCloud.uploadSheetPdf(file, sheetId);
            if (cloudUrl) {
              updates.pdf_url = cloudUrl;
              updates.download_url = cloudUrl;
              updates.pdf_source = 'cloud';
            }
          } catch (e) {}
        }

        if (window.DATA && window.DATA.pdfStore) {
          await window.DATA.pdfStore.savePdf(sheetId, file);
        }
      } else if (editUrlInput && editUrlInput.value.trim()) {
        updates.pdf_url = editUrlInput.value.trim();
        updates.download_url = editUrlInput.value.trim();
        updates.pdf_source = 'url';
      }

      if (window.DATA && window.DATA.updateSheet) {
        await window.DATA.updateSheet(sheetId, updates);
      } else {
        const customSheets = getCustomSheets();
        const idx = customSheets.findIndex(s => s.id === sheetId);
        if (idx !== -1) {
          customSheets[idx] = { ...customSheets[idx], ...updates };
          saveCustomSheets(customSheets);
        }
        if (window.DATA && window.DATA.sheets) {
          const idx2 = window.DATA.sheets.findIndex(s => s.id === sheetId);
          if (idx2 !== -1) {
            window.DATA.sheets[idx2] = { ...window.DATA.sheets[idx2], ...updates };
          }
        }
      }

      // Central Cloud Update Sync
      if (window.KuroCloud && typeof window.KuroCloud.publishSheetToCloud === 'function') {
        try {
          const fullSheet = window.DATA?.sheets?.find(s => s.id === sheetId);
          if (fullSheet) {
            await window.KuroCloud.publishSheetToCloud({ ...fullSheet, ...updates });
          }
        } catch (e) {}
      }

      // GitHub Repository Auto-Commit
      if (window.KuroGitSync && window.KuroGitSync.hasToken()) {
        try {
          const allSheets = window.DATA?.sheets || [];
          window.KuroGitSync.commitSheets(allSheets, `chore(sheets): update "${singleTitle}" via Super-Admin`);
        } catch (e) {}
      }

      document.getElementById('admin-edit-modal-backdrop')?.remove();
      if (window.showToast) window.showToast(isAr ? 'تم تعديل الشيت ومزامنته بنجاح ☁️' : 'Sheet updated and synced! ☁️', {type: 'success'});
      if (typeof reRenderCallback === 'function') reRenderCallback();
    });
  }

  // --- RENDER AUTH PROMPT ---
  function renderAuthPrompt(container, isAr) {
    container.innerHTML = `
      <div class="admin-auth-wrapper" style="max-width: 480px; margin: 60px auto; padding: 40px 30px; background: var(--bg-card); border: 1px solid var(--border-card); border-radius: 20px; box-shadow: var(--shadow-lg); text-align: center;">
        <div style="width: 72px; height: 72px; margin: 0 auto 18px; background: rgba(190, 18, 60, 0.12); border: 1.5px solid rgba(190, 18, 60, 0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <i data-lucide="shield-alert" style="width: 34px; height: 34px; color: var(--brand-burgundy);"></i>
        </div>
        <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 8px; color: var(--text-primary);">
          ${isAr ? 'بوابة الآدمن والتحكم الكامل بالمنصة' : 'Super-Admin Control Center'}
        </h2>
        <div class="badge badge-primary" style="display: inline-flex; margin-bottom: 16px; font-size: 0.775rem;">
          ${isAr ? 'منطقة محمية 100% • إدارة كلية طب الأسنان' : '100% Protected Area • Super-Admin'}
        </div>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 24px; line-height: 1.6;">
          ${isAr 
            ? 'تتيح هذه اللوحة التحكم الشامل: إضافة وتعديل وحذف الشيتات والإعلانات، واستعراض كافة حسابات الطلبة مع الأسماء والرموز السرية والنقاط وتعديل الجداول.' 
            : 'Full control center to add, edit, and delete sheets, announcements, student accounts, passcodes, and schedules.'}
        </p>

        <form id="admin-passcode-form">
          <div style="margin-bottom: 18px; text-align: ${isAr ? 'right' : 'left'};">
            <label style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 8px; color: var(--text-primary);">
              ${isAr ? 'رمز مرور الآدمن (Admin Passcode):' : 'Admin Passcode:'}
            </label>
            <div style="position: relative;">
              <input type="password" id="admin-passcode-input" class="auth-input" placeholder="••••••••" required style="width: 100%; font-size: 1.2rem; text-align: center; letter-spacing: 5px; padding: 12px;" />
            </div>
            <div style="font-size: 0.775rem; color: var(--text-muted); margin-top: 6px; text-align: center;">
              ${isAr ? 'الرمز الافتراضي للدخول: <b>kuro2026</b>' : 'Default Passcode: <b>kuro2026</b>'}
            </div>
          </div>

          <div id="admin-auth-error" style="display: none; color: #EF4444; font-size: 0.825rem; font-weight: 700; margin-bottom: 14px; background: rgba(239, 68, 68, 0.1); padding: 10px; border-radius: 8px;"></div>

          <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 13px; font-weight: 800; gap: 8px; font-size: 0.95rem;">
            <i data-lucide="shield-check" style="width: 18px; height: 18px;"></i>
            <span>${isAr ? 'دخول لوحة الآدمن ⚡' : 'Enter Super-Admin Dashboard ⚡'}</span>
          </button>
        </form>

        <div style="margin-top: 22px; border-top: 1px solid var(--border-subtle); padding-top: 16px;">
          <a href="#/" class="btn btn-secondary btn-sm" style="gap: 6px; font-size: 0.775rem;">
            <i data-lucide="arrow-left" style="width: 13px; height: 13px;"></i>
            <span>${isAr ? 'العودة للمنصة كطالب' : 'Return to Student App'}</span>
          </a>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    document.getElementById('admin-passcode-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = document.getElementById('admin-passcode-input')?.value || '';
      if (authenticate(code)) {
        if (typeof window.showToast === 'function') {
          window.showToast(isAr ? 'مرحباً بك في مركز التحكم الرئيسي بالمنصة! 🛡️' : 'Welcome to Super-Admin Control Center! 🛡️', { type: 'success' });
        }
        render(container);
      } else {
        const err = document.getElementById('admin-auth-error');
        if (err) {
          err.style.display = 'block';
          err.textContent = isAr ? 'رمز المرور غير صحيح! الرمز الافتراضي: kuro2026' : 'Invalid Passcode! Default passcode: kuro2026';
        }
      }
    });
  }

  // --- MAIN ADMIN RENDER ---
  function render(container) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;

    if (!checkAuth()) {
      renderAuthPrompt(container, isAr);
      return;
    }

    const sheets = window.DATA ? window.DATA.getRecentSheets(100) || [] : [];
    const alerts = window.DATA ? window.DATA.getAlerts() || [] : [];
    const subjects = window.DATA ? window.DATA.getSubjects() || [] : [];
    const students = getRegisteredStudents();

    const hasGitSync = Boolean(window.KuroGitSync && window.KuroGitSync.hasToken());
    const hasCloudSync = Boolean(window.KuroCloud && window.KuroCloud.getCredentials && window.KuroCloud.getCredentials().isConfigured);
    const isGlobalSyncActive = hasGitSync || hasCloudSync;

    container.innerHTML = `
      <style>
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bounceIn { 0% { transform: scale(0.3); opacity: 0; } 60% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); } }
      </style>
      <div class="admin-dashboard-wrapper" style="padding-bottom: 60px;">
        
        <!-- Header -->
        <div class="exams-page-header" style="margin-bottom: 20px;">
          <div class="page-title-group">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span class="badge badge-primary" style="background: #BE123C; color: #FFFFFF; font-size: 0.75rem; font-weight: 800; padding: 4px 12px; border-radius: 8px;">
                <i data-lucide="shield-check" style="width: 13px; height: 13px; display: inline-block;"></i>
                ${isAr ? 'مركز التحكم الشامل بالآدمن (Super-Admin Portal)' : 'Super-Admin Control Center'}
              </span>
              <span style="font-size: 0.775rem; color: var(--text-muted); font-weight: 700;">رمز المرور: kuro2026</span>
            </div>
            <h1>
              <i data-lucide="sliders" style="color: var(--brand-burgundy); width: 28px; height: 28px;"></i>
              ${isAr ? 'لوحة الإدارة والتحكم الكامل بالمنصة والشيتات وحسابات الطلبة' : 'Full Platform & Student Accounts Control Center'}
            </h1>
            <p>${isAr ? 'إضافة وتعديل وحذف الشيتات والإعلانات والجداول، واستعراض كافة حسابات ومطالعة رموز مرور الطلبة' : 'Manage, edit & delete sheets, announcements, timetables, and view registered student credentials'}</p>
          </div>

          <div class="exams-header-actions no-print">
            <button id="btn-admin-logout" class="btn btn-secondary btn-sm" style="color: #EF4444; border-color: rgba(239, 68, 68, 0.3); font-weight: 700; gap: 6px;">
              <i data-lucide="log-out" style="width: 14px; height: 14px;"></i>
              <span>${isAr ? 'خروج الآدمن' : 'Logout Admin'}</span>
            </button>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div style="display: flex; gap: 10px; border-bottom: 2px solid var(--border-subtle); margin-bottom: 24px; padding-bottom: 4px; overflow-x: auto; scrollbar-width: thin;">
          <button class="btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'} admin-tab-btn" data-tab="overview" style="font-weight: 800; gap: 6px; padding: 8px 16px; white-space: nowrap;">
            <i data-lucide="layout-dashboard" style="width: 16px; height: 16px;"></i>
            <span>${isAr ? '📊 نظرة عامة' : 'Overview'}</span>
          </button>

          <button class="btn ${activeTab === 'sheets' ? 'btn-primary' : 'btn-secondary'} admin-tab-btn" data-tab="sheets" style="font-weight: 800; gap: 6px; padding: 8px 16px; white-space: nowrap;">
            <i data-lucide="file-text" style="width: 16px; height: 16px;"></i>
            <span>${isAr ? '📁 إدارة الشيتات (إضافة/تعديل/حذف)' : 'Manage Sheets'}</span>
            <span class="badge" style="background: rgba(255,255,255,0.2); font-size: 0.7rem;">${sheets.length}</span>
          </button>

          <button class="btn ${activeTab === 'alerts' ? 'btn-primary' : 'btn-secondary'} admin-tab-btn" data-tab="alerts" style="font-weight: 800; gap: 6px; padding: 8px 16px; white-space: nowrap;">
            <i data-lucide="megaphone" style="width: 16px; height: 16px;"></i>
            <span>${isAr ? '📢 إدارة الإعلانات (إضافة/تعديل/حذف)' : 'Manage Alerts'}</span>
            <span class="badge" style="background: rgba(255,255,255,0.2); font-size: 0.7rem;">${alerts.length}</span>
          </button>

          <button class="btn ${activeTab === 'students' ? 'btn-primary' : 'btn-secondary'} admin-tab-btn" data-tab="students" style="font-weight: 800; gap: 6px; padding: 8px 16px; white-space: nowrap;">
            <i data-lucide="users" style="width: 16px; height: 16px;"></i>
            <span>${isAr ? '👥 حسابات الطلبة والرموز السرية' : 'Student Accounts & Passcodes'}</span>
            <span class="badge" style="background: rgba(255,255,255,0.2); font-size: 0.7rem;">${students.length}</span>
          </button>

          <button class="btn ${activeTab === 'sync' ? 'btn-primary' : 'btn-secondary'} admin-tab-btn" data-tab="sync" style="font-weight: 800; gap: 6px; padding: 8px 16px; white-space: nowrap; ${activeTab !== 'sync' && !isGlobalSyncActive ? 'border-color: rgba(245, 158, 11, 0.4);' : ''}">
            <i data-lucide="cloud" style="width: 16px; height: 16px;"></i>
            <span>${isAr ? '🌐 المزامنة السحابية والمستودع' : 'Cloud & Repo Sync'}</span>
            <span class="badge" style="background: ${isGlobalSyncActive ? 'rgba(16,185,129,0.2); color: #34D399' : 'rgba(245,158,11,0.2); color: #FBBF24'}; font-size: 0.7rem; font-weight: 800;">${isGlobalSyncActive ? (isAr ? '🟢 متصل' : '🟢 Active') : (isAr ? '⚠️ إعداد' : '⚠️ Setup')}</span>
          </button>
        </div>

        <!-- TAB CONTENT CONTAINER -->
        <div id="admin-tab-content">
          ${activeTab === 'overview' ? renderOverviewTab(isAr, sheets, alerts, subjects, students) : ''}
          ${activeTab === 'sheets' ? renderSheetsTab(isAr, sheets, subjects) : ''}
          ${activeTab === 'alerts' ? renderAlertsTab(isAr, alerts) : ''}
          ${activeTab === 'students' ? renderStudentsTab(isAr, students) : ''}
          ${activeTab === 'sync' ? renderSyncTab(isAr, sheets) : ''}
        </div>

      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Tab Switchers
    container.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.getAttribute('data-tab');
        render(container);
      });
    });

    // Logout
    document.getElementById('btn-admin-logout')?.addEventListener('click', () => {
      sessionStorage.removeItem('kf_admin_auth');
      isAdminAuthenticated = false;
      if (typeof window.showToast === 'function') {
        window.showToast(isAr ? 'تم تسجيل خروج الآدمن.' : 'Admin logged out.', { type: 'info' });
      }
      renderAuthPrompt(container, isAr);
    });

    // Attach Tab Handlers
    attachTabListeners(container, isAr);
  }

  // --- OVERVIEW TAB ---
  function renderOverviewTab(isAr, sheets, alerts, subjects, students) {
    return `
      <div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px;">
          <div class="card" style="padding: 20px; border-radius: 16px; border-left: 4px solid var(--brand-primary);">
            <div style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 700;">${isAr ? 'إجمالي الملازم المتاحة للطلبة' : 'Published Handouts'}</div>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--brand-primary); margin-top: 4px;">${sheets.length}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Active sheets in database</div>
          </div>

          <div class="card" style="padding: 20px; border-radius: 16px; border-left: 4px solid #0284C7;">
            <div style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 700;">${isAr ? 'الإعلانات الرسمية النشطة' : 'Faculty Announcements'}</div>
            <div style="font-size: 2.2rem; font-weight: 900; color: #0284C7; margin-top: 4px;">${alerts.length}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Published on homepage</div>
          </div>

          <div class="card" style="padding: 20px; border-radius: 16px; border-left: 4px solid #10B981;">
            <div style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 700;">${isAr ? 'حسابات الطلبة المسجلة' : 'Registered Students'}</div>
            <div style="font-size: 2.2rem; font-weight: 900; color: #10B981; margin-top: 4px;">${students.length}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Students with passcodes</div>
          </div>
        </div>

        <!-- Google OAuth & Cloud Auth Setup Guide -->
        <div class="card" style="padding: 24px; border-radius: 16px; margin-top: 20px; border-left: 4px solid #4285F4; background: var(--bg-card);">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 14px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 38px; height: 38px; border-radius: 10px; background: rgba(66, 133, 244, 0.12); display: flex; align-items: center; justify-content: center;">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              </div>
              <h4 style="font-size: 1.05rem; font-weight: 800; margin: 0; color: var(--text-primary);">
                ${isAr ? 'دليل إعداد تفعيل تسجيل الدخول بحساب Google (Supabase Google Auth)' : 'Google OAuth Configuration Guide'}
              </h4>
            </div>
            <span class="badge" style="background: rgba(66, 133, 244, 0.15); color: #60A5FA; font-weight: 700; font-size: 0.75rem;">
              ${isAr ? 'إرشادات إدارة الكلية' : 'Faculty Setup Guide'}
            </span>
          </div>

          <p style="font-size: 0.825rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 14px;">
            ${isAr 
              ? 'لتفعيل تسجيل دخول الطلبة بنقرة واحدة عبر حساب Google الرسمي بدون أخطاء، يرجى استكمال الخطوات التالية داخل لوحة تحكم Supabase:' 
              : 'To enable 1-click student sign-in with Google without configuration errors, complete these steps in your Supabase Dashboard:'}
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; font-size: 0.8rem;">
            <div style="background: var(--bg-surface-subtle); padding: 12px 14px; border-radius: 10px; border: 1px solid var(--border-subtle);">
              <div style="font-weight: 800; color: var(--brand-primary); margin-bottom: 4px;">1. الانتقال للمزودين (Providers)</div>
              <div style="color: var(--text-muted); font-size: 0.775rem;">افتح <code>Authentication</code> ← <code>Providers</code> ثم اختر <code>Google</code>.</div>
            </div>

            <div style="background: var(--bg-surface-subtle); padding: 12px 14px; border-radius: 10px; border: 1px solid var(--border-subtle);">
              <div style="font-weight: 800; color: var(--brand-primary); margin-bottom: 4px;">2. تفعيل المزود (Enable)</div>
              <div style="color: var(--text-muted); font-size: 0.775rem;">فعّل خيار <code>Enable Google Provider</code>.</div>
            </div>

            <div style="background: var(--bg-surface-subtle); padding: 12px 14px; border-radius: 10px; border: 1px solid var(--border-subtle);">
              <div style="font-weight: 800; color: var(--brand-primary); margin-bottom: 4px;">3. إدخال المفاتيح (Keys)</div>
              <div style="color: var(--text-muted); font-size: 0.775rem;">أدخل <code>Client ID</code> و <code>Client Secret</code> من Google Cloud Console.</div>
            </div>

            <div style="background: var(--bg-surface-subtle); padding: 12px 14px; border-radius: 10px; border: 1px solid var(--border-subtle);">
              <div style="font-weight: 800; color: var(--brand-primary); margin-bottom: 4px;">4. روابط التوجيه (Redirect URI)</div>
              <div style="color: var(--text-muted); font-size: 0.775rem;">أضف <code>https://kurofangs.id.ly</code> و <code>https://7ij0d.github.io/kuro-fangs/</code> إلى Redirect URLs.</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // --- AUTOMATIC PDF PAGE COUNTER HELPER ---
  async function detectPdfPageCount(fileOrBlob) {
    if (!fileOrBlob) return null;
    try {
      const arrayBuffer = await fileOrBlob.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const text = new TextDecoder('latin1').decode(bytes);

      // Method 1: Search for /Count N in Catalog or Pages dictionaries
      const countMatches = [...text.matchAll(/\/Count\s+(\d+)/g)];
      if (countMatches.length > 0) {
        const counts = countMatches.map(m => parseInt(m[1], 10)).filter(n => n > 0 && n < 5000);
        if (counts.length > 0) {
          return Math.max(...counts);
        }
      }

      // Method 2: Count occurrences of /Type /Page
      const pageMatches = text.match(/\/Type\s*\/Page\b/g);
      if (pageMatches && pageMatches.length > 0) {
        return pageMatches.length;
      }
    } catch (e) {
      console.warn('PDF page calculation failed:', e);
    }
    return null;
  }

  // --- SHEETS TAB ---
  function renderSheetsTab(isAr, sheets, subjects) {
    const hasGitSync = Boolean(window.KuroGitSync && window.KuroGitSync.hasToken());
    const hasCloudSync = Boolean(window.KuroCloud && window.KuroCloud.getCredentials && window.KuroCloud.getCredentials().isConfigured);
    const isGlobalSyncActive = hasGitSync || hasCloudSync;

    const syncBannerMarkup = isGlobalSyncActive ? `
      <!-- Global Publishing Active Banner -->
      <div class="card" style="padding: 16px 20px; border-radius: 14px; margin-bottom: 20px; background: rgba(16, 185, 129, 0.08); border: 1.5px solid rgba(16, 185, 129, 0.35); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 42px; height: 42px; border-radius: 12px; background: rgba(16, 185, 129, 0.18); display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
            🟢
          </div>
          <div>
            <div style="font-weight: 800; font-size: 0.95rem; color: #34D399; display: flex; align-items: center; gap: 6px;">
              <span>${isAr ? 'المزامنة العامة مفعلة ونشطة' : 'Global Cloud & Repo Sync Active'}</span>
              <span class="badge" style="background: rgba(16,185,129,0.25); color: #10B981; font-size: 0.7rem;">${hasGitSync ? 'GitHub API' : 'Supabase'}</span>
            </div>
            <div style="font-size: 0.775rem; color: var(--text-secondary); margin-top: 2px;">
              ${isAr ? 'أي شيت تقوم بإضافته أو تعديله أو حذفه ينعكس عالمياً لجميع الطلبة على كافة أجهزتهم فوراً.' : 'All newly published, edited, or deleted sheets are synced worldwide for all students.'}
            </div>
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button id="btn-quick-download-json" class="btn btn-secondary btn-sm" style="font-size: 0.75rem; font-weight: 700; gap: 4px;">
            📥 <span>${isAr ? 'تنزيل sheets.json' : 'Download JSON'}</span>
          </button>
          <button id="btn-quick-sync-tab" class="btn btn-secondary btn-sm" style="font-size: 0.75rem; font-weight: 700; gap: 4px;">
            ⚙️ <span>${isAr ? 'إدارة المزامنة' : 'Manage Sync'}</span>
          </button>
        </div>
      </div>
    ` : `
      <!-- Global Publishing Notice Banner (Local Storage Mode) -->
      <div class="card" style="padding: 16px 20px; border-radius: 14px; margin-bottom: 20px; background: rgba(245, 158, 11, 0.08); border: 1.5px solid rgba(245, 158, 11, 0.35); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 42px; height: 42px; border-radius: 12px; background: rgba(245, 158, 11, 0.18); display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
            ⚠️
          </div>
          <div>
            <div style="font-weight: 800; font-size: 0.95rem; color: #FBBF24;">
              ${isAr ? 'تنبيه النشر العام (وضع التخزين المحلي فقط)' : 'Global Publishing Notice (Local Storage Mode)'}
            </div>
            <div style="font-size: 0.775rem; color: var(--text-secondary); margin-top: 2px; line-height: 1.4;">
              ${isAr 
                ? 'الشيتات تُحفظ حالياً في متصفحك المحلي فقط. لتظهر لجميع الطلبة على هواتفهم، قم بربط GitHub PAT من تبويب <b>المزامنة السحابية والمستودع</b> أو قم بتنزيل ملف <code>sheets.json</code>.' 
                : 'Sheets are currently saved to your local browser only. To publish globally for all students, configure GitHub Sync or export <code>sheets.json</code>.'}
            </div>
          </div>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button id="btn-quick-download-json" class="btn btn-secondary btn-sm" style="font-size: 0.75rem; font-weight: 700; border-color: rgba(245, 158, 11, 0.4); color: #FBBF24; gap: 4px;">
            📥 <span>${isAr ? 'تنزيل sheets.json' : 'Download JSON'}</span>
          </button>
          <button id="btn-quick-sync-tab" class="btn btn-primary btn-sm" style="font-size: 0.75rem; font-weight: 800; background: #D97706; border-color: #D97706; gap: 4px;">
            ⚙️ <span>${isAr ? 'إعداد المزامنة العامة ⚡' : 'Configure Global Sync ⚡'}</span>
          </button>
        </div>
      </div>
    `;

    return `
      <div>
        ${syncBannerMarkup}

        <!-- Add New Sheet Form (Simplified Single Title, Single Doctor, Auto Pages) -->
        <div class="card" style="padding: 24px; border-radius: 16px; margin-bottom: 24px; border-left: 4px solid var(--brand-burgundy);">
          <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
            <i data-lucide="plus-circle" style="color: var(--brand-burgundy); width: 22px; height: 22px;"></i>
            <span>${isAr ? 'إضافة ونشر شيت جديد للمنصة' : 'Add New Sheet / Handout'}</span>
          </h3>

          <form id="form-add-sheet" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px;">
            
            <!-- 1. Single Title Field (Arabic or English) -->
            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'عنوان الشيت / المحاضرة (عربي أو إنجليزي):' : 'Sheet / Handout Title:'}</label>
              <input type="text" id="add-sheet-title" class="auth-input" placeholder="${isAr ? 'أدخل عنوان الشيت (مثال: Provisional Restorations)' : 'Enter sheet title in Arabic or English...'}" required style="width: 100%; font-weight: 600;" />
            </div>

            <!-- 2. Single Doctor Name Field -->
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'أستاذ المادة (الدكتور):' : 'Doctor Name:'}</label>
              <input type="text" id="add-sheet-doctor" class="auth-input" placeholder="${isAr ? 'اسم الدكتور (مثال: د. هالة الحويج)' : 'Doctor name (e.g. Dr. Hala Alhawij)'}" required />
            </div>

            <!-- 3. Subject Selection -->
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'المادة الدراسية:' : 'Subject:'}</label>
              <select id="add-sheet-subject" class="auth-input" required>
                ${subjects.map(s => `<option value="${s.id}">${isAr ? s.name_ar : s.name_en}</option>`).join('')}
              </select>
            </div>

            <!-- 4. Order Index Selection -->
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'ترتيب الشيت في المادة (Order):' : 'Sheet Order Index:'}</label>
              <select id="add-sheet-order" class="auth-input">
                <option value="auto">${isAr ? 'تلقائي (حسب التسلسل التالي)' : 'Auto (Next Sequence)'}</option>
                ${Array.from({length: 30}, (_, i) => i + 1).map(i => `<option value="${i}">${isAr ? `الشيت رقم ${i}` : `Sheet #${i}`}</option>`).join('')}
              </select>
            </div>

            <!-- 5. Auto-Detected Page Count Status Pill -->
            <div style="display: flex; align-items: flex-end;">
              <div id="pdf-auto-pages-pill" style="width: 100%; background: rgba(2, 132, 199, 0.08); border: 1px dashed rgba(2, 132, 199, 0.3); border-radius: 10px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; font-size: 0.8rem; color: var(--text-secondary);">
                <span>📊 ${isAr ? 'عدد الصفحات (تلقائي):' : 'Page Count (Auto):'}</span>
                <strong id="pdf-auto-pages-val" style="color: #0284C7; font-weight: 800;">${isAr ? 'يتم التحديد عند المعاينة' : 'Auto-detected'}</strong>
              </div>
            </div>

            <!-- 6. PDF File Upload Drag & Drop Zone -->
            <div style="grid-column: 1 / -1;">
              <div id="pdf-drop-zone" style="border: 2px dashed rgba(255,255,255,0.2); border-radius: 12px; padding: 22px; text-align: center; cursor: pointer; transition: all 0.2s; background: rgba(255,255,255,0.02); margin-bottom: 8px;">
                <input type="file" id="add-sheet-file" accept="application/pdf" style="display: none;">
                <div id="pdf-drop-label">
                  <i data-lucide="file-up" style="width: 28px; height: 28px; color: #38BDF8; margin-bottom: 4px; display: inline-block;"></i>
                  <div style="font-weight: 700; font-size: 0.875rem;">${isAr ? 'اسحب ملف الـ PDF هنا أو انقر للاختيار من جهازك' : 'Drag PDF here or click to select'}</div>
                  <span style="font-size: 0.75rem; opacity: 0.6;">${isAr ? 'يتم حساب عدد الصفحات تلقائياً (الحد الأقصى: 15MB)' : 'Page count detected automatically (Max size: 15MB)'}</span>
                </div>
                <div id="pdf-file-preview" style="display: none; color: #34D399; font-weight: 700;"></div>
              </div>
              <div style="margin-top: 6px;">
                <button type="button" id="toggle-url-input" style="background: none; border: none; color: #38BDF8; font-size: 0.75rem; font-weight: 700; cursor: pointer; padding: 0;">${isAr ? '🔗 أو أدخل رابط PDF يدوياً ▼' : '🔗 Or enter PDF URL manually ▼'}</button>
                <input type="url" id="add-sheet-url" class="auth-input" placeholder="https://example.com/lecture.pdf" dir="ltr" style="display: none; margin-top: 6px; width: 100%;" />
              </div>
            </div>

            <!-- 7. Submit Action Button -->
            <div style="grid-column: 1 / -1; display: flex; justify-content: flex-end; margin-top: 6px;">
              <button type="submit" id="btn-publish-sheet" class="btn btn-primary" style="padding: 11px 26px; font-weight: 800; gap: 8px; font-size: 0.925rem;">
                <i data-lucide="plus-circle" style="width: 18px; height: 18px;"></i>
                <span>${isAr ? 'نشر الشيت ومزامنته سحابياً 🚀' : 'Publish & Cloud Sync Live 🚀'}</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Sheets Live Cards -->
        <div class="card" style="padding: 24px; border-radius: 16px;">
          <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
            <i data-lucide="file-text" style="color: var(--brand-primary); width: 20px; height: 20px;"></i>
            <span>${isAr ? 'قائمة الملازم والشيتات المنشورة (إمكانية التعديل والحذف مع تأكيد الحذف)' : 'Published Sheets List'}</span>
          </h3>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${sheets.length === 0 ? `
              <div style="text-align: center; padding: 28px; color: var(--text-muted); font-size: 0.9rem;">
                ${isAr ? 'لا توجد شيتات أو ملازم منشورة حالياً' : 'No sheets published'}
              </div>
            ` : sheets.map(s => {
              const pdfIcon = s.pdf_source === 'local' ? '📄' : (s.pdf_source === 'url' ? '🔗' : (s.pdf_url ? '🔗' : '⚠️'));
              return `
              <div class="sheet-item-row" data-sheet-id="${s.id}" style="display: flex; flex-direction: column; gap: 10px; padding: 14px 18px; border-radius: 12px; background: var(--bg-surface-subtle); border: 1px solid var(--border-subtle); transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1); transform-origin: top center;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px;">
                  <div>
                    <div style="margin-bottom: 6px;">
                      <span style="background: #0284C7; color: white; padding: 2px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 800;">${isAr ? 'الشيت #' : 'Sheet #'}${s.order_index || '—'}</span>
                      <span style="font-size: 0.8rem; margin-inline-start: 8px; color: var(--text-secondary);">${pdfIcon}</span>
                      <span style="font-size: 0.75rem; color: var(--text-muted); margin-inline-start: 8px;">(${s.pages || '—'} ${isAr ? 'صفحة' : 'pages'})</span>
                    </div>
                    <strong style="color: var(--text-primary); font-size: 1rem; display: block;">${s.title_ar || s.title_en || s.title || ''}</strong>
                    <div style="font-size: 0.8rem; color: var(--brand-primary); margin-top: 6px;">${s.subject_name || s.subject_id} • <span style="color: var(--text-muted);">${s.doctor_name || 'د. هالة الحويج'}</span></div>
                  </div>
                  <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                    <button class="btn-move-up-sheet" data-id="${s.id}" style="background: rgba(255,255,255,0.08); color: #94A3B8; border: 1px solid rgba(255,255,255,0.12); padding: 4px 8px; border-radius: 6px; cursor: pointer; transition: background 0.2s;" title="Move Up">⬆️</button>
                    <button class="btn-move-down-sheet" data-id="${s.id}" style="background: rgba(255,255,255,0.08); color: #94A3B8; border: 1px solid rgba(255,255,255,0.12); padding: 4px 8px; border-radius: 6px; cursor: pointer; transition: background 0.2s;" title="Move Down">⬇️</button>
                    <button class="btn-delete-sheet" data-id="${s.id}" data-title="${s.title_ar || s.title_en || s.title}" style="background: #991B1B; color: white; border: none; padding: 4px 10px; border-radius: 6px; cursor: pointer; font-size: 0.75rem; transition: background 0.2s;">🗑️ ${isAr ? 'حذف' : 'Delete'}</button>
                  </div>
                </div>
              </div>
            `}).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // --- ALERTS TAB ---
  function renderAlertsTab(isAr, alerts) {
    return `
      <div>
        <!-- Add New Announcement Form -->
        <div class="card" style="padding: 24px; border-radius: 16px; margin-bottom: 24px; border-left: 4px solid #0284C7;">
          <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
            <i data-lucide="megaphone" style="color: #0284C7; width: 22px; height: 22px;"></i>
            <span>${isAr ? 'نشر إعلان وتنبيه جديد على الصفحة الرئيسية' : 'Publish New Announcement'}</span>
          </h3>

          <form id="form-add-alert" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px;">
            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'عنوان الإعلان الرئيسي:' : 'Announcement Title:'}</label>
              <input type="text" id="add-alert-title" class="auth-input" placeholder="إعلان هام لطلبة السنة الثالثة..." required />
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'الشارة والتصنيف:' : 'Badge Label:'}</label>
              <input type="text" id="add-alert-badge" class="auth-input" placeholder="هام جداً • قسم الامتحانات" required />
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'نوع الأهمية:' : 'Category:'}</label>
              <select id="add-alert-type" class="auth-input">
                <option value="urgent">${isAr ? 'عاجل (أحمر)' : 'Urgent'}</option>
                <option value="info">${isAr ? 'تنبيه عام (أزرق)' : 'General Info'}</option>
                <option value="exam">${isAr ? 'امتحانات (برغندي)' : 'Exams'}</option>
              </select>
            </div>

            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'نص وتفاصيل الإعلان:' : 'Content:'}</label>
              <textarea id="add-alert-content" class="auth-input" rows="3" placeholder="تفاصيل القرار والتنبيه الصادر من إدارة الكلية..." required style="resize: vertical;"></textarea>
            </div>

            <div style="grid-column: 1 / -1; display: flex; justify-content: flex-end;">
              <button type="submit" class="btn btn-primary" style="background: #0284C7; border-color: #0284C7; padding: 10px 24px; font-weight: 800; gap: 6px;">
                <i data-lucide="send" style="width: 16px; height: 16px;"></i>
                <span>${isAr ? 'نشر الإعلان فوراً 📢' : 'Publish Announcement 📢'}</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Alerts List -->
        <div class="card" style="padding: 24px; border-radius: 16px;">
          <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 16px;">${isAr ? 'الإعلانات المنشورة حالياً (إمكانية الحذف مع تأكيد الحذف)' : 'Active Faculty Announcements'}</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${alerts.length === 0 ? `
              <div style="text-align: center; padding: 28px; color: var(--text-muted); font-size: 0.9rem;">
                ${isAr ? 'لا توجد إعلانات أو تنبيهات منشورة حالياً' : 'No announcements published'}
              </div>
            ` : alerts.map(a => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; border-radius: 12px; background: var(--bg-surface-subtle); border: 1px solid var(--border-subtle); flex-wrap: wrap; gap: 10px;">
                <div style="flex: 1; min-width: 260px;">
                  <span class="badge badge-primary" style="font-size: 0.7rem; margin-inline-end: 6px;">${a.badge_ar || a.badge_en || 'إعلان'}</span>
                  <strong style="color: var(--text-primary); font-size: 0.95rem;">${a.title_ar || a.title_en || a.title}</strong>
                  <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px; line-height: 1.4;">${a.content_ar || a.content || ''}</p>
                </div>
                <button class="btn btn-secondary btn-sm btn-delete-alert" data-id="${a.id}" data-title="${a.title_ar || a.title_en || a.title}" style="color: #EF4444; border-color: rgba(239,68,68,0.3); font-weight: 700; font-size: 0.775rem;">
                  <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                  <span>${isAr ? 'حذف نهائي' : 'Delete Alert'}</span>
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // --- STUDENTS TAB ---
  function renderStudentsTab(isAr, students) {
    return `
      <div>
        <!-- Add New Student Form -->
        <div class="card" style="padding: 24px; border-radius: 16px; margin-bottom: 24px; border-left: 4px solid #10B981;">
          <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
            <i data-lucide="user-plus" style="color: #10B981; width: 22px; height: 22px;"></i>
            <span>${isAr ? 'إضافة حساب طالب جديد يدوياً' : 'Create New Student Account'}</span>
          </h3>

          <form id="form-add-student" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px;">
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'اسم الطالب الكامل:' : 'Student Full Name:'}</label>
              <input type="text" id="add-student-name" class="auth-input" placeholder="أحمد علي الفيتوري..." required />
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'اسم المستخدم / البريد الإلكتروني:' : 'Email / Username:'}</label>
              <input type="text" id="add-student-email" class="auth-input" placeholder="ahmed@dentistry.uot.edu.ly" required />
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'الرمز السري / كلمة المرور:' : 'Passcode / Password:'}</label>
              <input type="text" id="add-student-passcode" class="auth-input" placeholder="ahmed2026" required />
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'النقاط الأكاديمية الأولى:' : 'Initial Points:'}</label>
              <input type="number" id="add-student-points" class="auth-input" value="50" required />
            </div>

            <div style="grid-column: 1 / -1; display: flex; justify-content: flex-end;">
              <button type="submit" class="btn btn-primary" style="background: #10B981; border-color: #10B981; padding: 10px 24px; font-weight: 800; gap: 6px;">
                <i data-lucide="user-check" style="width: 16px; height: 16px;"></i>
                <span>${isAr ? 'إضافة حساب الطالب فوراً 👥' : 'Register Student 👥'}</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Student Credentials Table -->
        <div class="card" style="padding: 24px; border-radius: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
            <h3 style="font-size: 1.1rem; font-weight: 800; display: flex; align-items: center; gap: 8px; margin: 0;">
              <i data-lucide="shield-check" style="color: #10B981; width: 20px; height: 20px;"></i>
              <span>${isAr ? 'جدول حسابات الطلبة والرموز السرية المسجلة بالمنصة' : 'Registered Student Accounts & Passcodes Table'}</span>
            </h3>
            <span class="badge badge-primary" style="background: #10B981; font-size: 0.75rem;">${students.length} ${isAr ? 'حسابات مسجلة' : 'Accounts'}</span>
          </div>

          <p style="font-size: 0.825rem; color: var(--text-secondary); margin-bottom: 16px; line-height: 1.5;">
            ${isAr 
              ? 'يظهر هذا الجدول كافة بيانات الطلبة المسجلين بالمنصة، بما في ذلك الاسم، الحساب، والرمز السري (كلمة المرور) والنقاط المكتسبة لإدارتها واسترجاعها.' 
              : 'Displays all registered student names, emails, passcodes, skins, and academic points for admin management.'}
          </p>

          <div style="overflow-x: auto;">
            <table class="table-spec" style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
              <thead>
                <tr style="background: var(--bg-surface-subtle); border-bottom: 2px solid var(--border-subtle);">
                  <th style="padding: 12px; text-align: right;">${isAr ? 'اسم الطالب' : 'Student Name'}</th>
                  <th style="padding: 12px; text-align: right;">${isAr ? 'الحساب / البريد' : 'Username / Email'}</th>
                  <th style="padding: 12px; text-align: center;">${isAr ? 'الرمز السري (Passcode)' : 'Passcode / Password'}</th>
                  <th style="padding: 12px; text-align: center;">${isAr ? 'السكن والمظهر' : 'Mascot Skin'}</th>
                  <th style="padding: 12px; text-align: center;">${isAr ? 'النقاط' : 'Points'}</th>
                  <th style="padding: 12px; text-align: center;">${isAr ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                ${students.length === 0 ? `
                  <tr>
                    <td colspan="6" style="text-align: center; padding: 28px; color: var(--text-muted); font-size: 0.9rem;">
                      ${isAr ? 'لا توجد حسابات طلبة مسجلة حالياً' : 'No registered students found'}
                    </td>
                  </tr>
                ` : students.map((st, idx) => `
                  <tr style="border-bottom: 1px solid var(--border-subtle);">
                    <td style="padding: 12px 10px; font-weight: 800; color: var(--text-primary);">
                      ${st.name}
                    </td>
                    <td style="padding: 10px; color: var(--brand-primary); font-weight: 600;">
                      ${st.email}
                    </td>
                    <td style="padding: 10px; text-align: center;">
                      <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(2, 132, 199, 0.1); padding: 4px 10px; border-radius: 8px; border: 1px solid rgba(2, 132, 199, 0.2);">
                        <code style="font-family: monospace; font-weight: 800; color: #0284C7; letter-spacing: 1px;">${st.passcode}</code>
                      </div>
                    </td>
                    <td style="padding: 10px; text-align: center; color: var(--text-secondary); font-size: 0.775rem;">
                      ${st.skinName || st.skin}
                    </td>
                    <td style="padding: 10px; text-align: center; font-weight: 800; color: #10B981;">
                      +${st.points}
                    </td>
                    <td style="padding: 10px; text-align: center;">
                      <button class="btn btn-secondary btn-sm btn-delete-student" data-id="${st.id}" data-title="${st.name}" style="color: #EF4444; border-color: rgba(239,68,68,0.3); padding: 4px 8px; font-size: 0.75rem;">
                        <i data-lucide="trash-2" style="width: 13px; height: 13px;"></i>
                        <span>${isAr ? 'حذف الحساب' : 'Delete'}</span>
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // --- SQL SCHEMA MODAL HELPER ---
  function showSqlSchemaModal(isAr) {
    let modalEl = document.getElementById('admin-sql-modal-backdrop');
    if (modalEl) modalEl.remove();

    const sqlScript = `-- 1. جدول الشيتات والملازم الدراسية
CREATE TABLE IF NOT EXISTS public.sheets (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_ar TEXT,
  title_en TEXT,
  subject_id TEXT NOT NULL,
  doctor_name TEXT,
  pages TEXT,
  order_index INTEGER DEFAULT 1,
  pdf_url TEXT,
  download_url TEXT,
  pdf_source TEXT DEFAULT 'cloud',
  date TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. تفعيل الحماية على مستوى الصفوف (RLS)
ALTER TABLE public.sheets ENABLE ROW LEVEL SECURITY;

-- 3. سياسة القراءة العامة (لكافة الطلبة والزوار)
CREATE POLICY "Allow public read access on sheets"
  ON public.sheets FOR SELECT
  USING (true);

-- 4. سياسات الإضافة والتعديل والحذف للآدمن
CREATE POLICY "Allow all insert on sheets"
  ON public.sheets FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all update on sheets"
  ON public.sheets FOR UPDATE
  USING (true);

CREATE POLICY "Allow all delete on sheets"
  ON public.sheets FOR DELETE
  USING (true);

-- 5. إنشاء حوض التخزين (Storage Bucket) لملفات الـ PDF:
-- اذهب إلى Supabase Dashboard -> Storage -> New Bucket
-- أنشئ حوض باسم "pdf-sheets" واجعله Public Bucket`;

    const markup = `
      <div id="admin-sql-modal-backdrop" class="doc-viewer-backdrop active" style="z-index: 100000; background: rgba(10, 11, 18, 0.88); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center;">
        <div class="card" style="max-width: 620px; width: 92%; max-height: 90vh; overflow-y: auto; padding: 28px 24px; border-radius: 20px; border: 1.5px solid #0284C7; box-shadow: 0 20px 50px rgba(0,0,0,0.5); animation: docZoomIn 0.2s ease;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin: 0; display: flex; align-items: center; gap: 8px;">
              <i data-lucide="database" style="color: #0284C7; width: 22px; height: 22px;"></i>
              <span>${isAr ? 'كود SQL لإعداد قاعدة بيانات Supabase' : 'Supabase SQL Database Setup'}</span>
            </h3>
            <button id="btn-close-sql-modal" class="btn btn-secondary btn-sm" style="padding: 4px 8px;">✕</button>
          </div>
          
          <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 14px;">
            ${isAr 
              ? 'انسخ كود الـ SQL التالي والصقه داخل <strong>SQL Editor</strong> في لوحة تحكم Supabase لتجهيز جدول الشيتات مع كافة الصلاحيات بنقرة واحدة:' 
              : 'Copy the following SQL script and run it in the Supabase <strong>SQL Editor</strong> to configure the sheets table:'}
          </p>

          <div style="position: relative; margin-bottom: 16px;">
            <pre id="admin-sql-code" style="background: #0B0F19; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 14px; font-size: 0.775rem; color: #38BDF8; overflow-x: auto; max-height: 280px; font-family: monospace; text-align: left;" dir="ltr">${sqlScript}</pre>
          </div>

          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button id="btn-copy-sql-script" class="btn btn-primary" style="background: #0284C7; border-color: #0284C7; font-weight: 800; gap: 6px;">
              <i data-lucide="copy" style="width: 15px; height: 15px;"></i>
              <span>${isAr ? 'نسخ كود SQL للحافظة 📋' : 'Copy SQL Script 📋'}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', markup);
    if (window.lucide) window.lucide.createIcons();

    document.getElementById('btn-close-sql-modal')?.addEventListener('click', () => {
      document.getElementById('admin-sql-modal-backdrop')?.remove();
    });

    document.getElementById('btn-copy-sql-script')?.addEventListener('click', () => {
      navigator.clipboard.writeText(sqlScript).then(() => {
        if (typeof window.showToast === 'function') {
          window.showToast(isAr ? 'تم نسخ كود SQL بنجاح!' : 'SQL script copied to clipboard!', { type: 'success' });
        }
      });
    });
  }

  // --- SYNC & CLOUD TAB ---
  function renderSyncTab(isAr, sheets) {
    const gitToken = window.KuroGitSync ? window.KuroGitSync.getToken() : '';
    const hasGit = Boolean(gitToken);
    const repoInfo = window.KuroGitSync ? window.KuroGitSync.getRepoInfo() : { owner: '7ij0d', repo: 'kuro-fangs', branch: 'main', path: 'data/sheets.json' };
    
    const cloudCreds = window.KuroCloud && window.KuroCloud.getCredentials ? window.KuroCloud.getCredentials() : { url: '', key: '', isConfigured: false };

    return `
      <div>
        <!-- Notice Header -->
        <div class="card" style="padding: 22px 24px; border-radius: 16px; margin-bottom: 20px; background: linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, rgba(190, 18, 60, 0.08) 100%); border: 1px solid rgba(2, 132, 199, 0.3);">
          <div style="display: flex; align-items: flex-start; gap: 14px;">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(2, 132, 199, 0.2); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <i data-lucide="globe" style="width: 26px; height: 26px; color: #38BDF8;"></i>
            </div>
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-bottom: 6px;">
                ${isAr ? 'مركز المزامنة السحابية والنشر العالمي لجميع الأجهزة والطلبة 🌐' : 'Global Cloud Sync & Multi-Device Publishing Center 🌐'}
              </h3>
              <p style="font-size: 0.825rem; color: var(--text-secondary); line-height: 1.6; margin: 0;">
                ${isAr 
                  ? 'بما أن منصة Kuro Fangs مستضافة كـ Static Site على GitHub Pages، فإن الشيتات المضافة تحتاج للمزامنة عبر <b>GitHub Direct Commit</b> (ليتم تحديث ملف <code>data/sheets.json</code> وبناء الموقع تلقائياً للجميع)، أو عبر قاعدة بيانات <b>Supabase</b> المركزية، أو تنزيل ملف <b>JSON</b> المحدث بنقرة واحدة.' 
                  : 'Since Kuro Fangs is hosted on GitHub Pages, published sheets need either <b>Direct GitHub Auto-Commit</b> to update <code>data/sheets.json</code> on <code>main</code> branch, or a <b>Supabase</b> central database, or 1-click JSON export.'}
              </p>
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
          
          <!-- Card 1: GitHub Repository Direct Auto-Commit -->
          <div class="card" style="padding: 24px; border-radius: 16px; border-top: 4px solid #10B981; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <i data-lucide="git-branch" style="color: #10B981; width: 22px; height: 22px;"></i>
                  <h4 style="font-size: 1.05rem; font-weight: 800; margin: 0; color: var(--text-primary);">
                    ${isAr ? '1. المزامنة المباشرة مع مستودع GitHub' : '1. Direct GitHub Repo Auto-Commit'}
                  </h4>
                </div>
                <span class="badge" style="background: ${hasGit ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}; color: ${hasGit ? '#34D399' : '#FBBF24'}; font-weight: 800; font-size: 0.725rem;">
                  ${hasGit ? (isAr ? '🟢 مفعل' : '🟢 Active') : (isAr ? '⚪ غير متصل' : '⚪ Not Set')}
                </span>
              </div>

              <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 14px;">
                ${isAr 
                  ? `يقوم المتصفح بالاتصال بـ GitHub API والتعديل على <code>${repoInfo.owner}/${repoInfo.repo}</code> (فرع <code>${repoInfo.branch}</code>) مباشرة عند نشر أو حذف أي شيت، فيحدث التغيير فوراً لدى كافة الطلبة عالمياً.` 
                  : `Commits directly to <code>${repoInfo.owner}/${repoInfo.repo}</code> via GitHub REST API whenever you publish or delete a sheet.`}
              </p>

              <div style="margin-bottom: 14px;">
                <label style="display: block; font-size: 0.775rem; font-weight: 700; margin-bottom: 6px; color: var(--text-primary);">
                  ${isAr ? 'رمز الوصول الشخصي (GitHub Personal Access Token - PAT):' : 'GitHub Personal Access Token (PAT):'}
                </label>
                <div style="display: flex; gap: 6px;">
                  <input type="password" id="sync-github-token" class="auth-input" placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxx" value="${gitToken}" style="flex: 1; font-family: monospace; font-size: 0.85rem;" />
                  <button type="button" id="btn-toggle-github-token" class="btn btn-secondary btn-sm" style="padding: 0 10px;" title="${isAr ? 'إظهار / إخفاء' : 'Toggle Visibility'}">👁️</button>
                </div>
                <div style="font-size: 0.725rem; color: var(--text-muted); margin-top: 6px; line-height: 1.4;">
                  ${isAr 
                    ? 'الرمز يحتاج فقط لصلاحية <code>repo</code> (Full control of private/public repositories).' 
                    : 'Requires only <code>repo</code> scope permission in GitHub.'}
                </div>
              </div>

              <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px;">
                <button type="button" id="btn-save-github-token" class="btn btn-primary btn-sm" style="background: #10B981; border-color: #10B981; font-weight: 800; font-size: 0.775rem; gap: 4px;">
                  💾 <span>${isAr ? 'حفظ الرمز' : 'Save Token'}</span>
                </button>
                <button type="button" id="btn-test-github-token" class="btn btn-secondary btn-sm" style="font-weight: 700; font-size: 0.775rem; gap: 4px;">
                  🔍 <span>${isAr ? 'اختبار الاتصال' : 'Test Connection'}</span>
                </button>
                ${hasGit ? `
                  <button type="button" id="btn-clear-github-token" class="btn btn-secondary btn-sm" style="color: #EF4444; border-color: rgba(239,68,68,0.3); font-weight: 700; font-size: 0.775rem; gap: 4px;">
                    🗑️ <span>${isAr ? 'حذف الرمز' : 'Clear'}</span>
                  </button>
                ` : ''}
              </div>

              <div id="github-sync-status-box" style="display: none; padding: 10px 12px; border-radius: 8px; font-size: 0.775rem; margin-bottom: 14px; line-height: 1.4;"></div>
            </div>

            <div style="border-top: 1px solid var(--border-subtle); padding-top: 14px;">
              <button type="button" id="btn-commit-all-sheets" class="btn btn-primary" style="width: 100%; justify-content: center; background: #059669; border-color: #059669; font-weight: 800; font-size: 0.825rem; gap: 6px;" ${!hasGit ? 'disabled style="opacity: 0.6; cursor: not-allowed;"' : ''}>
                <i data-lucide="upload-cloud" style="width: 16px; height: 16px;"></i>
                <span>${isAr ? `مزامنة كافة الشيتات الحالية (${sheets.length}) إلى GitHub الآن 🚀` : `Commit All Sheets (${sheets.length}) to GitHub Now 🚀`}</span>
              </button>
            </div>
          </div>

          <!-- Card 2: Supabase Real-Time Cloud Database -->
          <div class="card" style="padding: 24px; border-radius: 16px; border-top: 4px solid #0284C7; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <i data-lucide="database" style="color: #0284C7; width: 22px; height: 22px;"></i>
                  <h4 style="font-size: 1.05rem; font-weight: 800; margin: 0; color: var(--text-primary);">
                    ${isAr ? '2. قاعدة بيانات Supabase السحابية' : '2. Supabase Real-Time Cloud Database'}
                  </h4>
                </div>
                <span class="badge" style="background: ${cloudCreds.isConfigured ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}; color: ${cloudCreds.isConfigured ? '#34D399' : '#FBBF24'}; font-weight: 800; font-size: 0.725rem;">
                  ${cloudCreds.isConfigured ? (isAr ? '🟢 مفعل' : '🟢 Configured') : (isAr ? '⚪ افتراضي' : '⚪ Default')}
                </span>
              </div>

              <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 14px;">
                ${isAr 
                  ? 'تتيح مزامنة فورية Real-Time لجدول الشيتات ورفع ملفات الـ PDF الكبيرة إلى Cloud Storage.' 
                  : 'Allows instant real-time synchronization of sheets table and cloud PDF storage.'}
              </p>

              <div style="margin-bottom: 10px;">
                <label style="display: block; font-size: 0.775rem; font-weight: 700; margin-bottom: 4px;">
                  ${isAr ? 'رابط مشروع Supabase (Project URL):' : 'Project URL:'}
                </label>
                <input type="text" id="sync-supabase-url" class="auth-input" placeholder="https://xyzproject.supabase.co" value="${cloudCreds.url}" style="font-size: 0.825rem;" dir="ltr" />
              </div>

              <div style="margin-bottom: 12px;">
                <label style="display: block; font-size: 0.775rem; font-weight: 700; margin-bottom: 4px;">
                  ${isAr ? 'المفتاح العام (Anon Public Key):' : 'Anon Public Key:'}
                </label>
                <input type="password" id="sync-supabase-key" class="auth-input" placeholder="eyJhbGciOiJIUzI1NiIsIn..." value="${cloudCreds.key}" style="font-size: 0.825rem; font-family: monospace;" dir="ltr" />
              </div>

              <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px;">
                <button type="button" id="btn-save-supabase" class="btn btn-primary btn-sm" style="background: #0284C7; border-color: #0284C7; font-weight: 800; font-size: 0.775rem; gap: 4px;">
                  💾 <span>${isAr ? 'حفظ الإعدادات' : 'Save Config'}</span>
                </button>
                <button type="button" id="btn-test-supabase" class="btn btn-secondary btn-sm" style="font-weight: 700; font-size: 0.775rem; gap: 4px;">
                  🔍 <span>${isAr ? 'اختبار الاتصال' : 'Test DB'}</span>
                </button>
                <button type="button" id="btn-show-sql-schema" class="btn btn-secondary btn-sm" style="font-weight: 700; font-size: 0.775rem; gap: 4px; color: #38BDF8;">
                  📋 <span>${isAr ? 'كود SQL' : 'SQL Schema'}</span>
                </button>
              </div>

              <div id="supabase-sync-status-box" style="display: none; padding: 10px 12px; border-radius: 8px; font-size: 0.775rem; margin-bottom: 14px; line-height: 1.4;"></div>
            </div>

            <div style="border-top: 1px solid var(--border-subtle); padding-top: 12px; font-size: 0.75rem; color: var(--text-muted);">
              ${isAr ? 'ملاحظة: يمكنك استخدام GitHub PAT بمفرده لتحديث الموقع بالكامل دون الحاجة لـ Supabase.' : 'Tip: GitHub PAT alone is sufficient to publish sheets globally.'}
            </div>
          </div>

          <!-- Card 3: 1-Click JSON Download & Export -->
          <div class="card" style="padding: 24px; border-radius: 16px; border-top: 4px solid #F59E0B; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <i data-lucide="download" style="color: #F59E0B; width: 22px; height: 22px;"></i>
                  <h4 style="font-size: 1.05rem; font-weight: 800; margin: 0; color: var(--text-primary);">
                    ${isAr ? '3. تصدير وتنزيل sheets.json بنقرة واحدة' : '3. 1-Click JSON Export & Download'}
                  </h4>
                </div>
                <span class="badge" style="background: rgba(245,158,11,0.2); color: #FBBF24; font-weight: 800; font-size: 0.725rem;">
                  ${sheets.length} ${isAr ? 'شيت' : 'Sheets'}
                </span>
              </div>

              <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 16px;">
                ${isAr 
                  ? 'إذا كنت تريد إضافة الشيتات يدوياً أو رفعها عبر Git في جهازك، يمكنك تنزيل ملف <code>sheets.json</code> المحدث كاملاً واستبداله في مجلد <code>data/sheets.json</code>.' 
                  : 'Download the compiled <code>sheets.json</code> containing all current sheets to manually commit to your local repository.'}
              </p>

              <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border-subtle); border-radius: 10px; padding: 12px; margin-bottom: 16px; font-size: 0.775rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <span style="color: var(--text-muted);">${isAr ? 'مسار الملف في المشروع:' : 'Target path:'}</span>
                  <code style="color: #38BDF8;">data/sheets.json</code>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: var(--text-muted);">${isAr ? 'عدد الشيتات المضمنة:' : 'Included sheets:'}</span>
                  <strong style="color: #10B981;">${sheets.length} ${isAr ? 'محاضرة وشيت' : 'sheets'}</strong>
                </div>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 8px;">
              <button type="button" id="btn-tab-download-json" class="btn btn-primary" style="width: 100%; justify-content: center; background: #D97706; border-color: #D97706; font-weight: 800; font-size: 0.85rem; gap: 6px;">
                <i data-lucide="download" style="width: 16px; height: 16px;"></i>
                <span>${isAr ? 'تنزيل ملف data/sheets.json فوراً 📥' : 'Download sheets.json File 📥'}</span>
              </button>
              <button type="button" id="btn-tab-copy-json" class="btn btn-secondary" style="width: 100%; justify-content: center; font-weight: 700; font-size: 0.8rem; gap: 6px;">
                <i data-lucide="copy" style="width: 14px; height: 14px;"></i>
                <span>${isAr ? 'نسخ كود JSON كاملاً للحافظة 📋' : 'Copy Full JSON to Clipboard 📋'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  // --- ATTACH EVENT LISTENERS & CONFIRM MODAL CALLS ---
  function attachTabListeners(container, isAr) {
    // 1. Add Sheet Form & Drag-and-drop
    const dropZone = document.getElementById('pdf-drop-zone');
    const fileInput = document.getElementById('add-sheet-file');
    const dropLabel = document.getElementById('pdf-drop-label');
    const filePreview = document.getElementById('pdf-file-preview');
    const toggleUrlBtn = document.getElementById('toggle-url-input');
    const urlInput = document.getElementById('add-sheet-url');
    let currentDetectedPages = null;

    if (dropZone && fileInput) {
      dropZone.addEventListener('click', () => fileInput.click());
      
      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#38BDF8';
        dropZone.style.background = 'rgba(56, 189, 248, 0.1)';
      });
      
      dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = 'rgba(255,255,255,0.2)';
        dropZone.style.background = 'rgba(255,255,255,0.02)';
      });
      
      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'rgba(255,255,255,0.2)';
        dropZone.style.background = 'rgba(255,255,255,0.02)';
        
        if (e.dataTransfer.files.length) {
          fileInput.files = e.dataTransfer.files;
          updateFilePreview();
        }
      });
      
      fileInput.addEventListener('change', updateFilePreview);
      
      async function updateFilePreview() {
        if (fileInput.files.length > 0) {
          const file = fileInput.files[0];
          dropLabel.style.display = 'none';
          filePreview.style.display = 'block';
          filePreview.textContent = `⏳ ${isAr ? 'جاري فك الملف وحساب عدد الصفحات تلقائياً...' : 'Detecting page count...'}`;

          const count = await detectPdfPageCount(file);
          currentDetectedPages = count;
          const countLabel = count ? `${count}` : (isAr ? 'غير محدد' : '1');
          
          filePreview.innerHTML = `✅ <strong>${file.name}</strong> (${(file.size / (1024*1024)).toFixed(2)} MB) <span style="background: rgba(16,185,129,0.2); color: #34D399; padding: 2px 8px; border-radius: 6px; font-size: 0.75rem; margin-inline-start: 6px;">📊 ${countLabel} ${isAr ? 'صفحة' : 'pages'}</span>`;

          const autoPillVal = document.getElementById('pdf-auto-pages-val');
          if (autoPillVal) {
            autoPillVal.textContent = count ? `${count} ${isAr ? 'صفحة' : 'pages'}` : (isAr ? 'تم الاكتشاف' : 'Detected');
          }
        } else {
          dropLabel.style.display = 'block';
          filePreview.style.display = 'none';
          currentDetectedPages = null;
          const autoPillVal = document.getElementById('pdf-auto-pages-val');
          if (autoPillVal) autoPillVal.textContent = isAr ? 'يتم التحديد عند المعاينة' : 'Auto-detected';
        }
      }
    }

    if (toggleUrlBtn && urlInput) {
      toggleUrlBtn.addEventListener('click', () => {
        if (urlInput.style.display === 'none') {
          urlInput.style.display = 'block';
          toggleUrlBtn.textContent = isAr ? 'إخفاء رابط PDF ▲' : 'Hide PDF URL ▲';
        } else {
          urlInput.style.display = 'none';
          urlInput.value = '';
          toggleUrlBtn.textContent = isAr ? '🔗 أو أدخل رابط PDF يدوياً ▼' : '🔗 Or enter PDF URL manually ▼';
        }
      });
    }

    document.getElementById('form-add-sheet')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('btn-publish-sheet');
      const origBtnHTML = submitBtn ? submitBtn.innerHTML : '';
      
      // Inline button spinner
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <div style="display: inline-flex; align-items: center; gap: 8px;">
            <div style="width: 16px; height: 16px; border: 2px solid #FFF; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
            <span>${isAr ? 'جاري رفع الملف والمزامنة...' : 'Uploading & Syncing...'}</span>
          </div>
        `;
      }

      // Social-Media style frosted-glass publishing overlay
      let pubOverlay = document.getElementById('admin-publish-overlay');
      if (pubOverlay) pubOverlay.remove();

      const overlayMarkup = `
        <div id="admin-publish-overlay" style="position: fixed; inset: 0; z-index: 100000; background: rgba(10, 11, 18, 0.84); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); display: flex; align-items: center; justify-content: center; animation: fadeInOverlay 0.25s ease;">
          <div style="background: var(--bg-card, #181926); border: 1.5px solid rgba(56, 189, 248, 0.35); box-shadow: 0 25px 60px rgba(0,0,0,0.65), 0 0 35px rgba(2, 132, 199, 0.25); border-radius: 22px; padding: 36px 40px; text-align: center; max-width: 440px; width: 90%; animation: docZoomIn 0.25s ease;">
            
            <div id="admin-publish-anim-box" style="width: 72px; height: 72px; margin: 0 auto 18px; border-radius: 50%; background: rgba(2, 132, 199, 0.12); display: flex; align-items: center; justify-content: center; position: relative;">
              <div id="admin-publish-spinner" style="width: 44px; height: 44px; border: 3.5px solid rgba(56, 189, 248, 0.2); border-top-color: #38BDF8; border-radius: 50%; animation: spin 0.85s linear infinite;"></div>
              <div id="admin-publish-check" style="display: none; font-size: 2.4rem; line-height: 1; animation: bounceIn 0.35s ease;">✨</div>
            </div>

            <h3 id="admin-publish-title" style="font-size: 1.15rem; font-weight: 800; color: #F8FAFC; margin-bottom: 8px;">
              ${isAr ? 'جاري نشر الشيت ومزامنته سحابياً لجميع الطلبة... 🚀' : 'Publishing Sheet & Syncing Cloud... 🚀'}
            </h3>
            
            <p id="admin-publish-desc" style="font-size: 0.825rem; color: #94A3B8; line-height: 1.5; margin: 0;">
              ${isAr ? 'يتم رفع ملف الـ PDF وتحديث قاعدة البيانات السحابية المركزية...' : 'Uploading PDF file and updating central academic database...'}
            </p>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', overlayMarkup);

      try {
        const singleTitle = document.getElementById('add-sheet-title')?.value.trim();
        const subjectId = document.getElementById('add-sheet-subject')?.value;
        const doctor = document.getElementById('add-sheet-doctor')?.value.trim();
        const orderVal = document.getElementById('add-sheet-order')?.value;
        const url = document.getElementById('add-sheet-url')?.value.trim();
        
        const file = fileInput?.files?.length > 0 ? fileInput.files[0] : null;

        if (file && file.size > 15 * 1024 * 1024) {
          document.getElementById('admin-publish-overlay')?.remove();
          if (typeof window.showToast === 'function') {
            window.showToast(isAr ? 'الملف كبير جداً (الحد الأقصى 15MB)' : 'File too large (Max 15MB)', { type: 'error' });
          }
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origBtnHTML;
          }
          return;
        }

        let order_index = 1;
        if (orderVal === 'auto') {
          if (window.DATA && window.DATA.getNextOrderIndex) {
            order_index = window.DATA.getNextOrderIndex(subjectId);
          } else {
            const curSheets = window.DATA?.sheets || getCustomSheets();
            const subjSheets = curSheets.filter(s => s.subject_id === subjectId);
            order_index = subjSheets.length > 0 ? Math.max(...subjSheets.map(s => parseInt(s.order_index) || 0)) + 1 : 1;
          }
        } else {
          order_index = parseInt(orderVal, 10) || 1;
        }

        const newSheetId = 'sh_admin_' + Date.now();
        let pdf_source = file ? 'local' : (url ? 'url' : 'none');
        let finalPdfUrl = url || '';
        const finalPages = currentDetectedPages ? `${currentDetectedPages}` : '12';

        // 1. Cloud Storage Upload (Supabase Bucket 'pdf-sheets')
        if (file && window.KuroCloud && typeof window.KuroCloud.uploadSheetPdf === 'function') {
          try {
            const cloudPdfUrl = await window.KuroCloud.uploadSheetPdf(file, newSheetId);
            if (cloudPdfUrl) {
              finalPdfUrl = cloudPdfUrl;
              pdf_source = 'cloud';
            }
          } catch (err) {
            console.warn('Cloud PDF upload note:', err);
          }
        }

        // 2. Local fallback storage in IndexedDB
        if (file && window.DATA && window.DATA.pdfStore) {
          try {
            await window.DATA.pdfStore.savePdf(newSheetId, file);
          } catch (err) {}
        }

        const newSheet = {
          id: newSheetId,
          subject_id: subjectId,
          title_ar: singleTitle,
          title_en: singleTitle,
          title: singleTitle,
          doctor_name: doctor,
          pages: finalPages,
          order_index: order_index,
          pdf_source: pdf_source,
          pdf_url: finalPdfUrl,
          download_url: finalPdfUrl,
          date: new Date().toISOString().split('T')[0]
        };

        // 3. Central Supabase Cloud Sync
        let supabaseSuccess = false;
        if (window.KuroCloud && typeof window.KuroCloud.publishSheetToCloud === 'function' && window.KuroCloud.getCredentials().isConfigured) {
          try {
            const res = await window.KuroCloud.publishSheetToCloud(newSheet);
            if (res) supabaseSuccess = true;
          } catch (err) {
            console.warn('Cloud publish fallback to local cache:', err);
          }
        }

        // 4. Direct GitHub Repository Auto-Commit (Instant persistence on GitHub Pages)
        let gitSyncSuccess = false;
        let gitCommitError = '';
        if (window.KuroGitSync && window.KuroGitSync.hasToken()) {
          try {
            const currentList = window.DATA?.sheets || getCustomSheets();
            const allSheetsToCommit = [newSheet, ...currentList.filter(s => s.id !== newSheet.id)];
            const commitRes = await window.KuroGitSync.commitSheets(
              allSheetsToCommit,
              `feat(sheets): publish "${newSheet.title}" via Super-Admin`
            );
            if (commitRes.success) {
              gitSyncSuccess = true;
            } else {
              gitCommitError = commitRes.error;
            }
          } catch (err) {
            gitCommitError = err.message;
          }
        }

        // 5. Update in-memory & local storage
        if (window.DATA) {
          if (!Array.isArray(window.DATA.sheets)) window.DATA.sheets = [];
          window.DATA.sheets.unshift(newSheet);
        }

        const cur = getCustomSheets();
        cur.unshift(newSheet);
        saveCustomSheets(cur);

        try {
          const cached = JSON.parse(localStorage.getItem('kf_cloud_cached_sheets') || '[]');
          cached.unshift(newSheet);
          localStorage.setItem('kf_cloud_cached_sheets', JSON.stringify(cached));
        } catch (e) {}

        // Social Media Success Animation State
        const spinnerEl = document.getElementById('admin-publish-spinner');
        const checkEl = document.getElementById('admin-publish-check');
        const animBox = document.getElementById('admin-publish-anim-box');
        const titleEl = document.getElementById('admin-publish-title');
        const descEl = document.getElementById('admin-publish-desc');
        
        if (spinnerEl) spinnerEl.style.display = 'none';
        if (checkEl) {
          checkEl.style.display = 'block';
          checkEl.textContent = '✅';
        }
        if (animBox) {
          animBox.style.background = 'rgba(16, 185, 129, 0.15)';
        }
        
        if (gitSyncSuccess) {
          if (titleEl) {
            titleEl.textContent = isAr ? 'تم النشر وتحديث مستودع GitHub بنجاح! 🚀' : 'Published & Committed to GitHub! 🚀';
            titleEl.style.color = '#34D399';
          }
          if (descEl) {
            descEl.textContent = isAr ? 'تم حفظ الشيت في المستودع الرسمي، وستظهر لجميع الطلبة فوراً.' : 'Committed to main repository and live for all students worldwide.';
          }
          if (typeof window.showToast === 'function') {
            window.showToast(isAr ? 'تم نشر الملزمة وتحديث المستودع لجميع الطلبة بنجاح! 🚀' : 'Sheet published and committed to GitHub! 🚀', { type: 'success' });
          }
        } else if (supabaseSuccess) {
          if (titleEl) {
            titleEl.textContent = isAr ? 'تم النشر والمزامنة السحابية بنجاح! 🎉' : 'Published and Synced to Cloud! 🎉';
            titleEl.style.color = '#34D399';
          }
          if (descEl) {
            descEl.textContent = isAr ? 'أصبح الشيت متاحاً في قاعدة البيانات المركزية لجميع الطلبة.' : 'Sheet is live in central database for all students.';
          }
          if (typeof window.showToast === 'function') {
            window.showToast(isAr ? 'تم نشر الملزمة ومزامنتها سحابياً لجميع الطلبة! ☁️' : 'Sheet published and synced to cloud! ☁️', { type: 'success' });
          }
        } else {
          if (titleEl) {
            titleEl.textContent = isAr ? 'تم حفظ الشيت محلياً بنجاح! 💾' : 'Sheet Saved Locally! 💾';
            titleEl.style.color = '#FBBF24';
          }
          if (descEl) {
            descEl.textContent = isAr 
              ? 'تم الحفظ في متصفحك. لتظهر لجميع الطلبة على هواتفهم، قم بربط GitHub PAT من تبويب "المزامنة السحابية" أو نزّل ملف sheets.json.' 
              : 'Saved to browser. To publish to all students, enable GitHub sync in the Sync tab or download sheets.json.';
          }
          if (typeof window.showToast === 'function') {
            window.showToast(isAr ? 'تم الحفظ محلياً. استخدم تبويب المزامنة لنشرها لجميع الطلبة ⚠️' : 'Saved locally. Use Sync tab to publish globally ⚠️', { type: 'info' });
          }
        }

        await new Promise(r => setTimeout(r, 1300));
        document.getElementById('admin-publish-overlay')?.remove();

        render(container);
      } catch (err) {
        console.error('Error publishing sheet:', err);
        document.getElementById('admin-publish-overlay')?.remove();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origBtnHTML;
        }
      }
    });

    // Edit Sheet Button
    container.querySelectorAll('.btn-edit-sheet').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const subjects = window.DATA ? window.DATA.getSubjects() : [];
        showEditSheetModal(id, subjects, isAr, () => render(container));
      });
    });

    // Reorder Buttons
    container.querySelectorAll('.btn-move-up-sheet').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (window.DATA && window.DATA.reorderSheet) {
          window.DATA.reorderSheet(id, 'up');
          if (window.KuroGitSync && window.KuroGitSync.hasToken()) {
            window.KuroGitSync.commitSheets(window.DATA.sheets, `chore(sheets): reorder sheets via Super-Admin`).catch(() => {});
          }
          render(container);
        }
      });
    });

    container.querySelectorAll('.btn-move-down-sheet').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (window.DATA && window.DATA.reorderSheet) {
          window.DATA.reorderSheet(id, 'down');
          if (window.KuroGitSync && window.KuroGitSync.hasToken()) {
            window.KuroGitSync.commitSheets(window.DATA.sheets, `chore(sheets): reorder sheets via Super-Admin`).catch(() => {});
          }
          render(container);
        }
      });
    });

    // 2. Delete Sheet WITH DOUBLE CONFIRMATION MODAL & PDF STORE CLEANUP
    container.querySelectorAll('.btn-delete-sheet').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const title = btn.getAttribute('data-title') || 'هذا الشيت';

        showDoubleConfirmModal(title, async () => {
          // Smooth collapse/fade-out animation on the card
          const cardEl = btn.closest('.sheet-item-row');
          if (cardEl) {
            cardEl.style.transition = 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
            cardEl.style.opacity = '0';
            cardEl.style.transform = 'scale(0.95)';
            cardEl.style.maxHeight = cardEl.offsetHeight + 'px';
            setTimeout(() => {
              cardEl.style.maxHeight = '0px';
              cardEl.style.paddingTop = '0px';
              cardEl.style.paddingBottom = '0px';
              cardEl.style.marginTop = '0px';
              cardEl.style.marginBottom = '0px';
              cardEl.style.overflow = 'hidden';
            }, 60);
            await new Promise(r => setTimeout(r, 360));
          }

          if (window.DATA && window.DATA.pdfStore && window.DATA.pdfStore.deletePdf) {
            await window.DATA.pdfStore.deletePdf(id);
          }

          // Delete from central Supabase cloud
          if (window.KuroCloud && typeof window.KuroCloud.deleteSheetFromCloud === 'function') {
            try {
              await window.KuroCloud.deleteSheetFromCloud(id);
            } catch (e) {}
          }

          // Delete from GitHub repository
          if (window.KuroGitSync && window.KuroGitSync.hasToken()) {
            try {
              const remaining = (window.DATA?.sheets || []).filter(s => s.id !== id);
              await window.KuroGitSync.commitSheets(remaining, `chore(sheets): remove sheet "${title}" via Super-Admin`);
            } catch (e) {
              console.warn('GitHub sync delete note:', e);
            }
          }

          addDeletedSheetId(id);

          if (window.DATA && Array.isArray(window.DATA.sheets)) {
            window.DATA.sheets = window.DATA.sheets.filter(s => s.id !== id);
          }

          let cur = getCustomSheets().filter(s => s.id !== id);
          saveCustomSheets(cur);

          try {
            const cached = JSON.parse(localStorage.getItem('kf_cloud_cached_sheets') || '[]').filter(s => s.id !== id);
            localStorage.setItem('kf_cloud_cached_sheets', JSON.stringify(cached));
          } catch (e) {}

          if (typeof window.showToast === 'function') {
            window.showToast(isAr ? `تم حذف "${title}" نهائياً من السحابة والمنصة.` : 'Sheet deleted permanently from cloud and platform.', { type: 'success' });
          }

          render(container);
        });
      });
    });

    // 3. Add Alert Form
    document.getElementById('form-add-alert')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('add-alert-title')?.value.trim();
      const badge = document.getElementById('add-alert-badge')?.value.trim();
      const type = document.getElementById('add-alert-type')?.value;
      const content = document.getElementById('add-alert-content')?.value.trim();

      const newAlert = {
        id: 'alt_admin_' + Date.now(),
        type: type,
        badge_ar: badge,
        badge_en: badge,
        title_ar: title,
        title_en: title,
        content_ar: content,
        date: new Date().toISOString().split('T')[0],
        time: 'الآن'
      };

      if (window.DATA) {
        if (!Array.isArray(window.DATA.alerts)) window.DATA.alerts = [];
        window.DATA.alerts.unshift(newAlert);
      }

      const cur = getCustomAlerts();
      cur.unshift(newAlert);
      saveCustomAlerts(cur);

      if (typeof window.showToast === 'function') {
        window.showToast(isAr ? 'تم نشر الإعلان على الواجهة الرئيسية فوراً! 📢' : 'Alert published live! 📢', { type: 'success' });
      }

      render(container);
    });

    // 4. Delete Alert WITH CONFIRMATION MODAL
    container.querySelectorAll('.btn-delete-alert').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const title = btn.getAttribute('data-title') || 'هذا الإعلان';

        showConfirmModal(title, 'alert', () => {
          addDeletedAlertId(id);

          if (window.DATA && Array.isArray(window.DATA.alerts)) {
            window.DATA.alerts = window.DATA.alerts.filter(a => a.id !== id);
          }

          let cur = getCustomAlerts().filter(a => a.id !== id);
          saveCustomAlerts(cur);

          if (typeof window.showToast === 'function') {
            window.showToast(isAr ? `تم حذف الإعلان "${title}" نهائياً.` : 'Alert deleted permanently.', { type: 'success' });
          }

          render(container);
        });
      });
    });

    // 5. Add Student Form
    document.getElementById('form-add-student')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('add-student-name')?.value.trim();
      const email = document.getElementById('add-student-email')?.value.trim();
      const passcode = document.getElementById('add-student-passcode')?.value.trim();
      const points = parseInt(document.getElementById('add-student-points')?.value || '50', 10);

      const newStudent = {
        id: 'st_' + Date.now(),
        name: name,
        email: email,
        passcode: passcode,
        skin: 'fox_skin_1',
        skinName: 'الثعلب الأكاديمي',
        points: points,
        date: new Date().toISOString().split('T')[0]
      };

      const students = getRegisteredStudents();
      students.unshift(newStudent);
      saveRegisteredStudents(students);

      if (typeof window.showToast === 'function') {
        window.showToast(isAr ? 'تم إنشاء وحفظ حساب الطالب بنجاح! 👥' : 'Student account created! 👥', { type: 'success' });
      }

      render(container);
    });

    // 6. Delete Student Account WITH CONFIRMATION MODAL
    container.querySelectorAll('.btn-delete-student').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-title') || 'حساب الطالب';

        showConfirmModal(name, 'student', () => {
          let students = getRegisteredStudents().filter(st => st.id !== id);
          saveRegisteredStudents(students);

          if (typeof window.showToast === 'function') {
            window.showToast(isAr ? `تم حذف حساب "${name}" بنجاح.` : 'Student account deleted.', { type: 'success' });
          }

          render(container);
        });
      });
    });

    // 7. Quick Navigation to Sync Tab & Quick JSON Download from Banner
    container.querySelectorAll('#btn-quick-sync-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = 'sync';
        render(container);
      });
    });

    container.querySelectorAll('#btn-quick-download-json').forEach(btn => {
      btn.addEventListener('click', () => {
        const curSheets = window.DATA?.sheets || getCustomSheets();
        if (window.KuroGitSync) {
          window.KuroGitSync.downloadSheetsJson(curSheets);
        } else if (window.DATA && window.DATA.exportSheetsJson) {
          window.DATA.exportSheetsJson();
        }
        if (typeof window.showToast === 'function') {
          window.showToast(isAr ? 'تم تنزيل ملف data/sheets.json المحدث بنجاح! 📥' : 'Downloaded data/sheets.json! 📥', { type: 'success' });
        }
      });
    });

    // 8. Sync Tab: GitHub Direct Auto-Commit Handlers
    const toggleGitBtn = document.getElementById('btn-toggle-github-token');
    const gitTokenInput = document.getElementById('sync-github-token');
    if (toggleGitBtn && gitTokenInput) {
      toggleGitBtn.addEventListener('click', () => {
        if (gitTokenInput.type === 'password') {
          gitTokenInput.type = 'text';
          toggleGitBtn.textContent = '🔒';
        } else {
          gitTokenInput.type = 'password';
          toggleGitBtn.textContent = '👁️';
        }
      });
    }

    document.getElementById('btn-save-github-token')?.addEventListener('click', () => {
      const val = gitTokenInput ? gitTokenInput.value.trim() : '';
      if (!val) {
        if (typeof window.showToast === 'function') window.showToast(isAr ? 'يرجى إدخال الرمز أولاً' : 'Please enter token', { type: 'warning' });
        return;
      }
      if (window.KuroGitSync) {
        window.KuroGitSync.saveToken(val);
        if (typeof window.showToast === 'function') {
          window.showToast(isAr ? 'تم حفظ رمز GitHub بنجاح! 💾' : 'GitHub Token saved! 💾', { type: 'success' });
        }
        render(container);
      }
    });

    document.getElementById('btn-test-github-token')?.addEventListener('click', async () => {
      const val = gitTokenInput ? gitTokenInput.value.trim() : '';
      const statusBox = document.getElementById('github-sync-status-box');
      if (statusBox) {
        statusBox.style.display = 'block';
        statusBox.style.background = 'rgba(2, 132, 199, 0.1)';
        statusBox.style.color = '#38BDF8';
        statusBox.style.border = '1px solid rgba(2, 132, 199, 0.25)';
        statusBox.innerHTML = `⏳ ${isAr ? 'جاري فحص الرمز وصلاحيات المستودع...' : 'Testing GitHub Token...'}`;
      }

      if (window.KuroGitSync) {
        const res = await window.KuroGitSync.testToken(val);
        if (res.success) {
          if (statusBox) {
            statusBox.style.background = 'rgba(16, 185, 129, 0.12)';
            statusBox.style.color = '#34D399';
            statusBox.style.border = '1px solid rgba(16, 185, 129, 0.3)';
            statusBox.innerHTML = `✅ ${isAr ? `الاتصال بمستودع <strong>${res.repoName}</strong> ناجح 100%! صلاحيات التعديل مفعلة.` : `Connected to <strong>${res.repoName}</strong> successfully! Write permissions active.`}`;
          }
          if (typeof window.showToast === 'function') {
            window.showToast(isAr ? 'الاتصال بـ GitHub ناجح وصالح! 🟢' : 'GitHub connection valid! 🟢', { type: 'success' });
          }
        } else {
          if (statusBox) {
            statusBox.style.background = 'rgba(239, 68, 68, 0.12)';
            statusBox.style.color = '#EF4444';
            statusBox.style.border = '1px solid rgba(239, 68, 68, 0.3)';
            statusBox.innerHTML = `❌ ${res.error || (isAr ? 'فشل الاتصال' : 'Connection failed')}`;
          }
          if (typeof window.showToast === 'function') {
            window.showToast(res.error || 'GitHub connection failed', { type: 'error' });
          }
        }
      }
    });

    document.getElementById('btn-clear-github-token')?.addEventListener('click', () => {
      if (window.KuroGitSync) {
        window.KuroGitSync.clearToken();
        if (typeof window.showToast === 'function') {
          window.showToast(isAr ? 'تم مسح رمز GitHub.' : 'GitHub Token cleared.', { type: 'info' });
        }
        render(container);
      }
    });

    document.getElementById('btn-commit-all-sheets')?.addEventListener('click', async () => {
      const commitBtn = document.getElementById('btn-commit-all-sheets');
      if (!commitBtn || !window.KuroGitSync || !window.KuroGitSync.hasToken()) return;

      const origText = commitBtn.innerHTML;
      commitBtn.disabled = true;
      commitBtn.innerHTML = `
        <div style="display: inline-flex; align-items: center; gap: 8px;">
          <div style="width: 14px; height: 14px; border: 2px solid #FFF; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
          <span>${isAr ? 'جاري رفع كافة الشيتات إلى GitHub...' : 'Committing all sheets to GitHub...'}</span>
        </div>
      `;

      const curSheets = window.DATA?.sheets || getCustomSheets();
      const res = await window.KuroGitSync.commitSheets(
        curSheets,
        `chore(sheets): sync full catalog (${curSheets.length} sheets) via Super-Admin`
      );

      commitBtn.disabled = false;
      commitBtn.innerHTML = origText;

      const statusBox = document.getElementById('github-sync-status-box');
      if (res.success) {
        if (statusBox) {
          statusBox.style.display = 'block';
          statusBox.style.background = 'rgba(16, 185, 129, 0.12)';
          statusBox.style.color = '#34D399';
          statusBox.style.border = '1px solid rgba(16, 185, 129, 0.3)';
          statusBox.innerHTML = `✅ ${isAr ? `تم تحديث ملف <code>data/sheets.json</code> في المستودع بنجاح! كود الـ Commit: <code>${(res.commitSha || '').slice(0, 7)}</code>` : `Successfully committed to GitHub! SHA: ${(res.commitSha || '').slice(0, 7)}`}`;
        }
        if (typeof window.showToast === 'function') {
          window.showToast(isAr ? 'تم تحديث ونشر كافة الشيتات في المستودع لجميع الطلبة! 🚀' : 'All sheets committed to GitHub! 🚀', { type: 'success' });
        }
      } else {
        if (statusBox) {
          statusBox.style.display = 'block';
          statusBox.style.background = 'rgba(239, 68, 68, 0.12)';
          statusBox.style.color = '#EF4444';
          statusBox.style.border = '1px solid rgba(239, 68, 68, 0.3)';
          statusBox.innerHTML = `❌ ${res.error || (isAr ? 'فشل التحديث' : 'Commit failed')}`;
        }
        if (typeof window.showToast === 'function') {
          window.showToast(res.error || 'Failed to commit to GitHub', { type: 'error' });
        }
      }
    });

    // 9. Sync Tab: Supabase Handlers
    document.getElementById('btn-save-supabase')?.addEventListener('click', () => {
      const url = document.getElementById('sync-supabase-url')?.value.trim();
      const key = document.getElementById('sync-supabase-key')?.value.trim();
      if (window.KuroCloud) {
        window.KuroCloud.saveCredentials(url, key);
        if (typeof window.showToast === 'function') {
          window.showToast(isAr ? 'تم حفظ إعدادات Supabase! 💾' : 'Supabase config saved! 💾', { type: 'success' });
        }
        render(container);
      }
    });

    document.getElementById('btn-test-supabase')?.addEventListener('click', async () => {
      const url = document.getElementById('sync-supabase-url')?.value.trim();
      const key = document.getElementById('sync-supabase-key')?.value.trim();
      const statusBox = document.getElementById('supabase-sync-status-box');

      if (statusBox) {
        statusBox.style.display = 'block';
        statusBox.style.background = 'rgba(2, 132, 199, 0.1)';
        statusBox.style.color = '#38BDF8';
        statusBox.style.border = '1px solid rgba(2, 132, 199, 0.25)';
        statusBox.innerHTML = `⏳ ${isAr ? 'جاري فحص الاتصال بجدول الشيتات...' : 'Testing Supabase table...'}`;
      }

      if (window.KuroCloud && window.KuroCloud.testConnection) {
        const res = await window.KuroCloud.testConnection(url, key);
        if (res.connected) {
          if (statusBox) {
            statusBox.style.background = 'rgba(16, 185, 129, 0.12)';
            statusBox.style.color = '#34D399';
            statusBox.style.border = '1px solid rgba(16, 185, 129, 0.3)';
            statusBox.innerHTML = `✅ ${res.message}`;
          }
          if (typeof window.showToast === 'function') window.showToast(res.message, { type: 'success' });
        } else {
          if (statusBox) {
            statusBox.style.background = 'rgba(239, 68, 68, 0.12)';
            statusBox.style.color = '#EF4444';
            statusBox.style.border = '1px solid rgba(239, 68, 68, 0.3)';
            statusBox.innerHTML = `❌ ${res.message}`;
          }
          if (typeof window.showToast === 'function') window.showToast(res.message, { type: 'error' });
        }
      }
    });

    document.getElementById('btn-show-sql-schema')?.addEventListener('click', () => {
      showSqlSchemaModal(isAr);
    });

    // 10. Sync Tab: 1-Click JSON Download & Copy Handlers
    document.getElementById('btn-tab-download-json')?.addEventListener('click', () => {
      const curSheets = window.DATA?.sheets || getCustomSheets();
      if (window.KuroGitSync) {
        window.KuroGitSync.downloadSheetsJson(curSheets);
      } else if (window.DATA && window.DATA.exportSheetsJson) {
        window.DATA.exportSheetsJson();
      }
      if (typeof window.showToast === 'function') {
        window.showToast(isAr ? 'تم تنزيل ملف data/sheets.json المحدث بنجاح! 📥' : 'Downloaded data/sheets.json! 📥', { type: 'success' });
      }
    });

    document.getElementById('btn-tab-copy-json')?.addEventListener('click', () => {
      const curSheets = window.DATA?.sheets || getCustomSheets();
      const jsonContent = JSON.stringify({ sheets: curSheets }, null, 2);
      navigator.clipboard.writeText(jsonContent).then(() => {
        if (typeof window.showToast === 'function') {
          window.showToast(isAr ? 'تم نسخ محتوى sheets.json كاملاً للحافظة! 📋' : 'Copied sheets.json to clipboard! 📋', { type: 'success' });
        }
      });
    });
  }

  return {
    render,
    checkAuth,
    authenticate
  };
})();
