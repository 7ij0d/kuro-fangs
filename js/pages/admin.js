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
      let list = JSON.parse(localStorage.getItem('kf_registered_students') || '[]');
      if (!Array.isArray(list) || list.length === 0) {
        list = [
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
        localStorage.setItem('kf_registered_students', JSON.stringify(list));
      }
      return list;
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

    container.innerHTML = `
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
        </div>

        <!-- TAB CONTENT CONTAINER -->
        <div id="admin-tab-content">
          ${activeTab === 'overview' ? renderOverviewTab(isAr, sheets, alerts, subjects, students) : ''}
          ${activeTab === 'sheets' ? renderSheetsTab(isAr, sheets, subjects) : ''}
          ${activeTab === 'alerts' ? renderAlertsTab(isAr, alerts) : ''}
          ${activeTab === 'students' ? renderStudentsTab(isAr, students) : ''}
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
      </div>
    `;
  }

  // --- SHEETS TAB ---
  function renderSheetsTab(isAr, sheets, subjects) {
    return `
      <div>
        <!-- Add New Sheet Form -->
        <div class="card" style="padding: 24px; border-radius: 16px; margin-bottom: 24px; border-left: 4px solid var(--brand-burgundy);">
          <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
            <i data-lucide="plus-circle" style="color: var(--brand-burgundy); width: 22px; height: 22px;"></i>
            <span>${isAr ? 'إضافة ونشر شيت جديد للمنصة' : 'Add New Sheet / Handout'}</span>
          </h3>

          <form id="form-add-sheet" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px;">
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'عنوان الشيت (بالعربية):' : 'Title (AR):'}</label>
              <input type="text" id="add-sheet-title-ar" class="auth-input" placeholder="عنوان المحاضرة بالعربية..." required />
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'عنوان الشيت (بالإنجليزية):' : 'Title (EN):'}</label>
              <input type="text" id="add-sheet-title-en" class="auth-input" placeholder="Lecture Title in English..." required />
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'المادة الدراسية:' : 'Subject:'}</label>
              <select id="add-sheet-subject" class="auth-input" required>
                ${subjects.map(s => `<option value="${s.id}">${isAr ? s.name_ar : s.name_en}</option>`).join('')}
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'أستاذ المادة (الدكتور):' : 'Doctor:'}</label>
              <input type="text" id="add-sheet-doctor" class="auth-input" placeholder="د. هالة الحويج..." required />
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'عدد الصفحات والحجم:' : 'Pages & Size:'}</label>
              <input type="text" id="add-sheet-pages" class="auth-input" placeholder="17 صفحة • 2.8 MB" required />
            </div>

            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'رابط ملف الـ PDF (URL):' : 'PDF File URL:'}</label>
              <input type="url" id="add-sheet-url" class="auth-input" placeholder="https://..." value="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" required />
            </div>

            <div style="grid-column: 1 / -1; display: flex; justify-content: flex-end;">
              <button type="submit" class="btn btn-primary" style="padding: 10px 24px; font-weight: 800; gap: 6px;">
                <i data-lucide="plus-circle" style="width: 16px; height: 16px;"></i>
                <span>${isAr ? 'نشر الشيت فوراً 🚀' : 'Publish Sheet Live 🚀'}</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Sheets Live Table -->
        <div class="card" style="padding: 24px; border-radius: 16px;">
          <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
            <i data-lucide="file-text" style="color: var(--brand-primary); width: 20px; height: 20px;"></i>
            <span>${isAr ? 'قائمة الملازم والشيتات المنشورة (إمكانية التعديل والحذف مع تأكيد الحذف)' : 'Published Sheets List'}</span>
          </h3>

          <div style="overflow-x: auto;">
            <table class="table-spec" style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
              <thead>
                <tr style="background: var(--bg-surface-subtle); border-bottom: 2px solid var(--border-subtle);">
                  <th style="padding: 10px; text-align: right;">${isAr ? 'عنوان الشيت' : 'Sheet Title'}</th>
                  <th style="padding: 10px; text-align: right;">${isAr ? 'المادة' : 'Subject'}</th>
                  <th style="padding: 10px; text-align: right;">${isAr ? 'الدكتور' : 'Doctor'}</th>
                  <th style="padding: 10px; text-align: center;">${isAr ? 'الصفحات' : 'Pages'}</th>
                  <th style="padding: 10px; text-align: center;">${isAr ? 'الإجراءات والتحكم' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                ${sheets.map(s => `
                  <tr style="border-bottom: 1px solid var(--border-subtle);">
                    <td style="padding: 12px 10px; font-weight: 700; color: var(--text-primary);">
                      ${s.title_ar || s.title_en || s.title}
                    </td>
                    <td style="padding: 10px; color: var(--brand-primary); font-weight: 600;">
                      ${s.subject_name || s.subject_id}
                    </td>
                    <td style="padding: 10px; color: var(--text-secondary);">
                      ${s.doctor_name || 'د. هالة الحويج'}
                    </td>
                    <td style="padding: 10px; text-align: center; color: var(--text-muted);">
                      ${s.pages || 17} صفحة
                    </td>
                    <td style="padding: 10px; text-align: center;">
                      <button class="btn btn-secondary btn-sm btn-delete-sheet" data-id="${s.id}" data-title="${s.title_ar || s.title_en || s.title}" style="color: #EF4444; border-color: rgba(239,68,68,0.3); padding: 4px 10px; font-size: 0.775rem; font-weight: 700;">
                        <i data-lucide="trash-2" style="width: 13px; height: 13px;"></i>
                        <span>${isAr ? 'حذف نهائي' : 'Delete'}</span>
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
            ${alerts.map(a => `
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
                ${students.map((st, idx) => `
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

  // --- ATTACH EVENT LISTENERS & CONFIRM MODAL CALLS ---
  function attachTabListeners(container, isAr) {
    // 1. Add Sheet Form
    document.getElementById('form-add-sheet')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const titleAr = document.getElementById('add-sheet-title-ar')?.value.trim();
      const titleEn = document.getElementById('add-sheet-title-en')?.value.trim() || titleAr;
      const subjectId = document.getElementById('add-sheet-subject')?.value;
      const doctor = document.getElementById('add-sheet-doctor')?.value.trim();
      const pages = document.getElementById('add-sheet-pages')?.value.trim();
      const url = document.getElementById('add-sheet-url')?.value.trim();

      const newSheet = {
        id: 'sh_admin_' + Date.now(),
        subject_id: subjectId,
        title_ar: titleAr,
        title_en: titleEn,
        doctor_name: doctor,
        pages: pages,
        pdf_url: url,
        download_url: url,
        date: new Date().toISOString().split('T')[0]
      };

      if (window.DATA) {
        if (!Array.isArray(window.DATA.sheets)) window.DATA.sheets = [];
        window.DATA.sheets.unshift(newSheet);
      }

      const cur = getCustomSheets();
      cur.unshift(newSheet);
      saveCustomSheets(cur);

      if (typeof window.showToast === 'function') {
        window.showToast(isAr ? 'تم نشر الملزمة المعتمدة بنجاح على المنصة! 🚀' : 'Sheet published live! 🚀', { type: 'success' });
      }

      render(container);
    });

    // 2. Delete Sheet WITH CONFIRMATION MODAL & PERMANENT ID PERSISTENCE
    container.querySelectorAll('.btn-delete-sheet').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const title = btn.getAttribute('data-title') || 'هذا الشيت';

        showConfirmModal(title, 'sheet', () => {
          // Permanently mark ID as deleted in localStorage
          addDeletedSheetId(id);

          // Remove from memory
          if (window.DATA && Array.isArray(window.DATA.sheets)) {
            window.DATA.sheets = window.DATA.sheets.filter(s => s.id !== id);
          }

          let cur = getCustomSheets().filter(s => s.id !== id);
          saveCustomSheets(cur);

          if (typeof window.showToast === 'function') {
            window.showToast(isAr ? `تم حذف "${title}" نهائياً ومنع ظهوره لجميع الطلبة.` : 'Sheet deleted permanently.', { type: 'success' });
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
  }

  return {
    render,
    checkAuth,
    authenticate
  };
})();
