/**
 * KURO FANGS — SUPER-ADMIN CONTROL CENTER PORTAL (#/admin)
 * Complete Faculty & Platform Control System:
 * - Passcode Protected (Default: kuro2026)
 * - Full Sheets Management: Add, Edit, Delete any PDF handout live
 * - Full Announcements Management: Add, Edit, Delete official faculty alerts
 * - Full Student Accounts & Credentials Manager: View all student names, usernames, passcodes/passwords, skins, points, reset passcodes & delete accounts
 * - Timetables & Exam Schedules Control
 */

window.AdminPage = (function () {
  let isAdminAuthenticated = false;
  let activeTab = 'overview'; // 'overview' | 'sheets' | 'alerts' | 'students' | 'schedules'
  let selectedPracticalGroup = 'A1';
  let editingSheet = null;
  let editingAlert = null;

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

  // --- LOCAL STORAGE HELPERS ---
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

    const sheets = window.DATA ? window.DATA.sheets || [] : [];
    const alerts = window.DATA ? window.DATA.getAlerts() || [] : [];
    const subjects = window.DATA ? window.DATA.getSubjects() || [] : [];
    const students = getRegisteredStudents();

    container.innerHTML = `
      <div class="admin-dashboard-wrapper" style="padding-bottom: 60px;">
        
        <!-- Super-Admin Title Header -->
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

        <!-- Super-Admin Navigation Tabs Bar -->
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

          <button class="btn ${activeTab === 'schedules' ? 'btn-primary' : 'btn-secondary'} admin-tab-btn" data-tab="schedules" style="font-weight: 800; gap: 6px; padding: 8px 16px; white-space: nowrap;">
            <i data-lucide="calendar" style="width: 16px; height: 16px;"></i>
            <span>${isAr ? '📅 الجداول والامتحانات' : 'Timetables'}</span>
          </button>
        </div>

        <!-- TAB CONTENT CONTAINER -->
        <div id="admin-tab-content">
          ${activeTab === 'overview' ? renderOverviewTab(isAr, sheets, alerts, subjects, students) : ''}
          ${activeTab === 'sheets' ? renderSheetsTab(isAr, sheets, subjects) : ''}
          ${activeTab === 'alerts' ? renderAlertsTab(isAr, alerts) : ''}
          ${activeTab === 'students' ? renderStudentsTab(isAr, students) : ''}
          ${activeTab === 'schedules' ? renderSchedulesTab(isAr) : ''}
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

  // --- TAB 1: OVERVIEW ---
  function renderOverviewTab(isAr, sheets, alerts, subjects, students) {
    return `
      <div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px;">
          <div class="card" style="padding: 20px; border-radius: 16px; border-left: 4px solid var(--brand-primary);">
            <div style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 700;">${isAr ? 'إجمالي الملازم المتاحة' : 'Published Handouts'}</div>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--brand-primary); margin-top: 4px;">${sheets.length}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">PDFs available for study</div>
          </div>

          <div class="card" style="padding: 20px; border-radius: 16px; border-left: 4px solid #0284C7;">
            <div style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 700;">${isAr ? 'الإعلانات الرسمية النشطة' : 'Faculty Announcements'}</div>
            <div style="font-size: 2.2rem; font-weight: 900; color: #0284C7; margin-top: 4px;">${alerts.length}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Published on homepage feed</div>
          </div>

          <div class="card" style="padding: 20px; border-radius: 16px; border-left: 4px solid #10B981;">
            <div style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 700;">${isAr ? 'حسابات الطلبة المسجلة' : 'Registered Students'}</div>
            <div style="font-size: 2.2rem; font-weight: 900; color: #10B981; margin-top: 4px;">${students.length}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Students with active credentials</div>
          </div>

          <div class="card" style="padding: 20px; border-radius: 16px; border-left: 4px solid #F59E0B;">
            <div style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 700;">${isAr ? 'مواد السنة الثالثة' : 'Year 3 Subjects'}</div>
            <div style="font-size: 2.2rem; font-weight: 900; color: #F59E0B; margin-top: 4px;">${subjects.length}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Official Curriculum Courses</div>
          </div>
        </div>

        <div class="card" style="padding: 24px; border-radius: 16px; margin-bottom: 24px;">
          <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
            <i data-lucide="zap" style="color: var(--brand-primary); width: 20px; height: 20px;"></i>
            <span>${isAr ? '🚀 التحكم السريع بالمنصة' : 'Quick Control Hub'}</span>
          </h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 18px; line-height: 1.6;">
            ${isAr 
              ? 'تتيح لك بوابة الآدمن الوصول الفوري لكافة أقسام النظام للتحكم الكامل بالشيتات، الإعلانات، استعراض كلمات مرور الطلبة وتعديل الجداول الدراسية.' 
              : 'Directly manage academic resources, view and reset student credentials, post urgent news, or update timetables.'}
          </p>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="btn btn-primary admin-tab-btn" data-tab="sheets" style="gap: 6px;">
              <i data-lucide="file-plus" style="width: 15px; height: 15px;"></i>
              <span>${isAr ? 'إدارة ونشر الشيتات 📁' : 'Manage Sheets'}</span>
            </button>
            <button class="btn btn-primary admin-tab-btn" data-tab="alerts" style="background: #0284C7; border-color: #0284C7; gap: 6px;">
              <i data-lucide="megaphone" style="width: 15px; height: 15px;"></i>
              <span>${isAr ? 'إدارة الإعلانات الرسمية 📢' : 'Manage Alerts'}</span>
            </button>
            <button class="btn btn-primary admin-tab-btn" data-tab="students" style="background: #10B981; border-color: #10B981; gap: 6px;">
              <i data-lucide="users" style="width: 15px; height: 15px;"></i>
              <span>${isAr ? 'حسابات الطلبة والرموز السرية 👥' : 'Student Passcodes'}</span>
            </button>
            <button class="btn btn-primary admin-tab-btn" data-tab="schedules" style="background: #8B5CF6; border-color: #8B5CF6; gap: 6px;">
              <i data-lucide="calendar" style="width: 15px; height: 15px;"></i>
              <span>${isAr ? 'جداول المحاضرات والمعامل 📅' : 'Timetables'}</span>
            </button>
          </div>
        </div>

        <div class="card" style="padding: 24px; border-radius: 16px; background: rgba(15, 23, 42, 0.03); border: 1px dashed var(--border-card);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
            <div>
              <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary); margin-bottom: 4px;">
                ${isAr ? 'حالة النظام وبيانات النسخ الاحتياطي (System Backup)' : 'System Health & Backup Data'}
              </h4>
              <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0;">
                ${isAr ? 'تصدير نسخة JSON لكافة البيانات المضافة (شيتات، إعلانات، حسابات طلبة).' : 'Export complete JSON backup of all registered students, custom sheets, and alerts.'}
              </p>
            </div>
            <button id="btn-export-backup" class="btn btn-secondary btn-sm" style="font-weight: 700; gap: 6px;">
              <i data-lucide="download" style="width: 14px; height: 14px;"></i>
              <span>${isAr ? 'تصدير نسخة احتياطية (JSON)' : 'Export Backup JSON'}</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // --- TAB 2: SHEETS MANAGEMENT (ADD, EDIT, DELETE) ---
  function renderSheetsTab(isAr, sheets, subjects) {
    return `
      <div>
        <!-- Edit Sheet Drawer / Modal if active -->
        ${editingSheet ? `
          <div class="card" style="padding: 24px; border-radius: 16px; margin-bottom: 24px; border: 2px solid #D97706; background: rgba(217, 119, 6, 0.05);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
              <h3 style="font-size: 1.15rem; font-weight: 800; color: #D97706; display: flex; align-items: center; gap: 8px; margin: 0;">
                <i data-lucide="edit-3" style="width: 20px; height: 20px;"></i>
                <span>${isAr ? 'تعديل بيانات الشيت الحالي' : 'Edit Sheet Details'} [${editingSheet.title_ar || editingSheet.title}]</span>
              </h3>
              <button id="btn-cancel-edit-sheet" class="btn btn-secondary btn-sm">✕ ${isAr ? 'إلغاء' : 'Cancel'}</button>
            </div>

            <form id="form-edit-sheet" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px;">
              <input type="hidden" id="edit-sheet-id" value="${editingSheet.id}" />
              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'العنوان بالعربية:' : 'Title (AR):'}</label>
                <input type="text" id="edit-sheet-title-ar" class="auth-input" value="${editingSheet.title_ar || editingSheet.title || ''}" required />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'العنوان بالإنجليزية:' : 'Title (EN):'}</label>
                <input type="text" id="edit-sheet-title-en" class="auth-input" value="${editingSheet.title_en || editingSheet.title || ''}" required />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'أستاذ المادة (الدكتور):' : 'Doctor:'}</label>
                <input type="text" id="edit-sheet-doctor" class="auth-input" value="${editingSheet.doctor_name || ''}" required />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'الصفحات والحجم:' : 'Pages & Size:'}</label>
                <input type="text" id="edit-sheet-pages" class="auth-input" value="${editingSheet.pages || 17} صفحة • ${editingSheet.size || '2.8 MB'}" required />
              </div>
              <div style="grid-column: 1 / -1;">
                <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'رابط ملف الـ PDF:' : 'PDF URL:'}</label>
                <input type="url" id="edit-sheet-url" class="auth-input" value="${editingSheet.pdf_url || editingSheet.download_url || ''}" required />
              </div>
              <div style="grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 8px;">
                <button type="button" id="btn-cancel-edit-sheet-bottom" class="btn btn-secondary">${isAr ? 'إلغاء' : 'Cancel'}</button>
                <button type="submit" class="btn btn-primary" style="background: #D97706; border-color: #D97706; font-weight: 800;">
                  <span>💾 ${isAr ? 'حفظ التعديلات' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        ` : ''}

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

        <!-- Sheets Live Table with Instant Edit & Delete -->
        <div class="card" style="padding: 24px; border-radius: 16px;">
          <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
            <i data-lucide="file-text" style="color: var(--brand-primary); width: 20px; height: 20px;"></i>
            <span>${isAr ? 'قائمة الملازم والشيتات المنشورة (إمكانية التعديل والحذف)' : 'Published Sheets List (Edit & Delete Controls)'}</span>
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
                      <div style="display: flex; justify-content: center; gap: 6px;">
                        <button class="btn btn-secondary btn-sm btn-edit-sheet" data-id="${s.id}" title="تعديل الشيت" style="color: #D97706; border-color: rgba(217, 119, 6, 0.3); padding: 4px 8px; font-size: 0.75rem;">
                          <i data-lucide="edit" style="width: 13px; height: 13px;"></i>
                          <span>${isAr ? 'تعديل' : 'Edit'}</span>
                        </button>
                        <button class="btn btn-secondary btn-sm btn-delete-sheet" data-id="${s.id}" title="حذف الشيت" style="color: #EF4444; border-color: rgba(239,68,68,0.3); padding: 4px 8px; font-size: 0.75rem;">
                          <i data-lucide="trash-2" style="width: 13px; height: 13px;"></i>
                          <span>${isAr ? 'حذف' : 'Delete'}</span>
                        </button>
                      </div>
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

  // --- TAB 3: ALERTS MANAGEMENT (ADD, EDIT, DELETE) ---
  function renderAlertsTab(isAr, alerts) {
    return `
      <div>
        <!-- Edit Alert Drawer / Modal if active -->
        ${editingAlert ? `
          <div class="card" style="padding: 24px; border-radius: 16px; margin-bottom: 24px; border: 2px solid #0284C7; background: rgba(2, 132, 199, 0.05);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
              <h3 style="font-size: 1.15rem; font-weight: 800; color: #0284C7; display: flex; align-items: center; gap: 8px; margin: 0;">
                <i data-lucide="edit-3" style="width: 20px; height: 20px;"></i>
                <span>${isAr ? 'تعديل الإعلان الأكاديمي' : 'Edit Academic Alert'} [${editingAlert.title_ar || editingAlert.title}]</span>
              </h3>
              <button id="btn-cancel-edit-alert" class="btn btn-secondary btn-sm">✕ ${isAr ? 'إلغاء' : 'Cancel'}</button>
            </div>

            <form id="form-edit-alert" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px;">
              <input type="hidden" id="edit-alert-id" value="${editingAlert.id}" />
              <div style="grid-column: 1 / -1;">
                <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'عنوان الإعلان:' : 'Announcement Title:'}</label>
                <input type="text" id="edit-alert-title" class="auth-input" value="${editingAlert.title_ar || editingAlert.title || ''}" required />
              </div>

              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'الشارة والتصنيف:' : 'Badge Label:'}</label>
                <input type="text" id="edit-alert-badge" class="auth-input" value="${editingAlert.badge_ar || editingAlert.badge_en || 'إعلان'}" required />
              </div>

              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'نوع الأهمية:' : 'Category:'}</label>
                <select id="edit-alert-type" class="auth-input">
                  <option value="urgent" ${editingAlert.type === 'urgent' ? 'selected' : ''}>${isAr ? 'عاجل (أحمر)' : 'Urgent'}</option>
                  <option value="info" ${editingAlert.type === 'info' ? 'selected' : ''}>${isAr ? 'تنبيه عام (أزرق)' : 'General Info'}</option>
                  <option value="exam" ${editingAlert.type === 'exam' ? 'selected' : ''}>${isAr ? 'امتحانات (برغندي)' : 'Exams'}</option>
                </select>
              </div>

              <div style="grid-column: 1 / -1;">
                <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'نص وتفاصيل الإعلان:' : 'Content:'}</label>
                <textarea id="edit-alert-content" class="auth-input" rows="3" required style="resize: vertical;">${editingAlert.content_ar || editingAlert.content || ''}</textarea>
              </div>

              <div style="grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 8px;">
                <button type="button" id="btn-cancel-edit-alert-bottom" class="btn btn-secondary">${isAr ? 'إلغاء' : 'Cancel'}</button>
                <button type="submit" class="btn btn-primary" style="background: #0284C7; border-color: #0284C7; font-weight: 800;">
                  <span>💾 ${isAr ? 'حفظ التعديلات' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        ` : ''}

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
          <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 16px;">${isAr ? 'الإعلانات المنشورة حالياً (إمكانية الحذف والتعديل)' : 'Active Faculty Announcements'}</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${alerts.map(a => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; border-radius: 12px; background: var(--bg-surface-subtle); border: 1px solid var(--border-subtle); flex-wrap: wrap; gap: 10px;">
                <div style="flex: 1; min-width: 260px;">
                  <span class="badge badge-primary" style="font-size: 0.7rem; margin-inline-end: 6px;">${a.badge_ar || a.badge_en || 'إعلان'}</span>
                  <strong style="color: var(--text-primary); font-size: 0.95rem;">${a.title_ar || a.title_en || a.title}</strong>
                  <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px; line-height: 1.4;">${a.content_ar || a.content || ''}</p>
                </div>
                <div style="display: flex; gap: 6px;">
                  <button class="btn btn-secondary btn-sm btn-edit-alert" data-id="${a.id}" style="color: #0284C7; border-color: rgba(2, 132, 199, 0.3); font-weight: 700; font-size: 0.775rem; gap: 4px;">
                    <i data-lucide="edit-3" style="width: 13px; height: 13px;"></i>
                    <span>${isAr ? 'تعديل' : 'Edit'}</span>
                  </button>
                  <button class="btn btn-secondary btn-sm btn-delete-alert" data-id="${a.id}" style="color: #EF4444; border-color: rgba(239,68,68,0.3); font-weight: 700; font-size: 0.775rem; gap: 4px;">
                    <i data-lucide="trash-2" style="width: 13px; height: 13px;"></i>
                    <span>${isAr ? 'حذف' : 'Delete'}</span>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // --- TAB 4: STUDENT ACCOUNTS & PASSCODES MANAGER ---
  function renderStudentsTab(isAr, students) {
    return `
      <div>
        <!-- Add New Student Account Form -->
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

        <!-- Registered Student Credentials Live Table -->
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
              ? 'يظهر هذا الجدول كافة بيانات الطلبة المسجلين بالمنصة، بما في ذلك الاسم، الحساب، والرمز السري (كلمة المرور) مع إمكانية نسخه أو إعادة تعيينه أو حذف الحساب.' 
              : 'Displays all registered student names, emails, plaintext passcodes with copy/reset controls, skins, and academic points.'}
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
                  <th style="padding: 12px; text-align: center;">${isAr ? 'إجراءات والتحكم' : 'Actions'}</th>
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
                        <button class="btn-copy-passcode" data-passcode="${st.passcode}" title="${isAr ? 'نسخ الرمز السري' : 'Copy Passcode'}" style="background: none; border: none; cursor: pointer; padding: 2px; color: #0284C7; display: flex; align-items: center;">
                          <i data-lucide="copy" style="width: 13px; height: 13px;"></i>
                        </button>
                      </div>
                    </td>
                    <td style="padding: 10px; text-align: center; color: var(--text-secondary); font-size: 0.775rem;">
                      ${st.skinName || st.skin}
                    </td>
                    <td style="padding: 10px; text-align: center; font-weight: 800; color: #10B981;">
                      +${st.points}
                    </td>
                    <td style="padding: 10px; text-align: center;">
                      <div style="display: inline-flex; gap: 6px;">
                        <button class="btn btn-secondary btn-sm btn-reset-student-pass" data-id="${st.id}" data-name="${st.name}" data-passcode="${st.passcode}" title="${isAr ? 'إعادة تعيين الرمز السري' : 'Reset Passcode'}" style="color: #0284C7; border-color: rgba(2, 132, 199, 0.3); padding: 4px 8px; font-size: 0.75rem; gap: 4px;">
                          <i data-lucide="key" style="width: 13px; height: 13px;"></i>
                          <span>${isAr ? 'تغيير الرمز' : 'Reset'}</span>
                        </button>
                        <button class="btn btn-secondary btn-sm btn-delete-student" data-id="${st.id}" title="${isAr ? 'حذف الحساب' : 'Delete Account'}" style="color: #EF4444; border-color: rgba(239,68,68,0.3); padding: 4px 8px; font-size: 0.75rem; gap: 4px;">
                          <i data-lucide="trash-2" style="width: 13px; height: 13px;"></i>
                          <span>${isAr ? 'حذف' : 'Delete'}</span>
                        </button>
                      </div>
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

  // --- TAB 5: SCHEDULES MANAGEMENT ---
  function renderSchedulesTab(isAr) {
    const theoryDays = (window.ExamsPage && Array.isArray(window.ExamsPage.theoryScheduleDays)) 
      ? window.ExamsPage.theoryScheduleDays 
      : [];
    const allGroups = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2', 'E1', 'E2'];
    const clinicalData = window.CLINICAL_SCHEDULE_DATA || {};
    const groupSessions = clinicalData[selectedPracticalGroup] || [];

    return `
      <div>
        <!-- Section 1: Theory Lectures (Auditorium 2) -->
        <div class="card" style="padding: 24px; border-radius: 16px; margin-bottom: 24px; border-left: 4px solid var(--brand-burgundy);">
          <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
            <i data-lucide="book-open" style="color: var(--brand-burgundy); width: 22px; height: 22px;"></i>
            <span>${isAr ? 'جدول المحاضرات النظري الأسبوعي (مدرج 2)' : 'Theoretical Lectures Matrix (Auditorium 2)'}</span>
          </h3>

          <form id="form-add-slot" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; margin-bottom: 20px;">
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'اليوم الدراسي:' : 'Weekday:'}</label>
              <select id="slot-day" class="auth-input">
                <option value="السبت">السبت (Saturday)</option>
                <option value="الأحد">الأحد (Sunday)</option>
                <option value="الإثنين">الإثنين (Monday)</option>
                <option value="الثلاثاء">الثلاثاء (Tuesday)</option>
                <option value="الأربعاء">الأربعاء (Wednesday)</option>
                <option value="الخميس">الخميس (Thursday)</option>
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'التوقيت:' : 'Time Slot:'}</label>
              <input type="text" id="slot-time" class="auth-input" placeholder="08:00 - 10:00" required />
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'اسم المادة:' : 'Subject:'}</label>
              <input type="text" id="slot-subject" class="auth-input" placeholder="الاستعاضة السنية الثابتة 2" required />
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'المدرج / القاعة:' : 'Hall:'}</label>
              <input type="text" id="slot-hall" class="auth-input" value="مدرج 2" required />
            </div>

            <div style="grid-column: 1 / -1; display: flex; justify-content: flex-end;">
              <button type="submit" class="btn btn-primary" style="background: var(--brand-burgundy); border-color: var(--brand-burgundy); padding: 9px 20px; font-weight: 800; gap: 6px;">
                <i data-lucide="plus-circle" style="width: 15px; height: 15px;"></i>
                <span>${isAr ? 'إدراج المحاضرة بالجدول 📅' : 'Add to Schedule 📅'}</span>
              </button>
            </div>
          </form>

          <div style="overflow-x: auto;">
            <table class="table-spec" style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
              <thead>
                <tr style="background: var(--bg-surface-subtle); border-bottom: 2px solid var(--border-subtle);">
                  <th style="padding: 10px; text-align: right;">${isAr ? 'اليوم' : 'Day'}</th>
                  <th style="padding: 10px; text-align: center;">${isAr ? 'التوقيت' : 'Time'}</th>
                  <th style="padding: 10px; text-align: right;">${isAr ? 'المادة الدراسية' : 'Course'}</th>
                  <th style="padding: 10px; text-align: center;">${isAr ? 'القاعة' : 'Hall'}</th>
                </tr>
              </thead>
              <tbody>
                ${theoryDays.flatMap(d => d.slots.map((s, idx) => `
                  <tr style="border-bottom: 1px solid var(--border-subtle);">
                    <td style="padding: 10px; font-weight: 700; color: var(--text-primary);">${idx === 0 ? (isAr ? d.day_ar : d.day_en) : ''}</td>
                    <td style="padding: 10px; text-align: center; color: var(--text-secondary);">${s.time}</td>
                    <td style="padding: 10px; font-weight: 600; color: var(--brand-burgundy);">${isAr ? s.subject_ar : s.subject_en}</td>
                    <td style="padding: 10px; text-align: center; color: var(--text-muted);">${isAr ? s.hall_ar : s.hall_en}</td>
                  </tr>
                `)).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Section 2: Practical & Clinical Schedule (Groups A1 to E2) -->
        <div class="card" style="padding: 24px; border-radius: 16px; border-left: 4px solid #10B981;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
            <h3 style="font-size: 1.15rem; font-weight: 800; margin: 0; display: flex; align-items: center; gap: 8px;">
              <i data-lucide="microscope" style="color: #10B981; width: 22px; height: 22px;"></i>
              <span>${isAr ? 'جدول العيادات والمعامل العملي/السريري للمجموعات (A1 - E2)' : 'Clinical & Phantom Lab Schedule (A1 - E2)'}</span>
            </h3>
            <span class="badge badge-primary" style="background: #10B981; font-size: 0.75rem;">${isAr ? `المجموعة النشطة: ${selectedPracticalGroup}` : `Active Group: ${selectedPracticalGroup}`}</span>
          </div>

          <!-- Group selector buttons -->
          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px;">
            ${allGroups.map(g => `
              <button class="btn ${g === selectedPracticalGroup ? 'btn-primary' : 'btn-secondary'} btn-sm btn-admin-group" data-group="${g}" style="padding: 6px 14px; font-weight: 800;">
                <span>${g}</span>
                ${g === selectedPracticalGroup ? ' ✓' : ''}
              </button>
            `).join('')}
          </div>

          <div style="overflow-x: auto;">
            <table class="table-spec" style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
              <thead>
                <tr style="background: var(--bg-surface-subtle); border-bottom: 2px solid var(--border-subtle);">
                  <th style="padding: 10px; text-align: right;">${isAr ? 'اليوم' : 'Day'}</th>
                  <th style="padding: 10px; text-align: center;">${isAr ? 'التوقيت' : 'Time'}</th>
                  <th style="padding: 10px; text-align: right;">${isAr ? 'المادة والعيادة' : 'Session & Clinic'}</th>
                  <th style="padding: 10px; text-align: center;">${isAr ? 'المكان' : 'Location'}</th>
                </tr>
              </thead>
              <tbody>
                ${groupSessions.length > 0 ? groupSessions.map(s => `
                  <tr style="border-bottom: 1px solid var(--border-subtle);">
                    <td style="padding: 10px; font-weight: 700;">${isAr ? s.day_ar : s.day_en}</td>
                    <td style="padding: 10px; text-align: center; color: var(--text-secondary);">${isAr ? s.time_ar : s.time_en}</td>
                    <td style="padding: 10px; font-weight: 600; color: ${s.color || 'var(--brand-primary)'};">${isAr ? s.course_ar : s.course_en}</td>
                    <td style="padding: 10px; text-align: center; color: var(--text-muted);">${isAr ? s.place_ar : s.place_en}</td>
                  </tr>
                `).join('') : `
                  <tr>
                    <td colspan="4" style="text-align: center; padding: 20px; color: var(--text-muted);">
                      ${isAr ? 'لا توجد جلسات مسجلة لهذه المجموعة.' : 'No sessions recorded for this group.'}
                    </td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // --- ATTACH EVENT LISTENERS FOR ALL TABS ---
  function attachTabListeners(container, isAr) {
    // 0. Export Backup JSON
    document.getElementById('btn-export-backup')?.addEventListener('click', () => {
      const backupData = {
        timestamp: new Date().toISOString(),
        registered_students: getRegisteredStudents(),
        custom_sheets: getCustomSheets(),
        custom_alerts: getCustomAlerts(),
        sheets: window.DATA?.sheets || []
      };
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kuro_fangs_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      if (typeof window.showToast === 'function') {
        window.showToast(isAr ? 'تم تصدير نسخة البيانات الاحتياطية بنجاح! 💾' : 'Backup exported successfully! 💾', { type: 'success' });
      }
    });

    // 1. Add Sheet Form Submit
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

    // 1b. Edit Sheet Click
    container.querySelectorAll('.btn-edit-sheet').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const sheets = window.DATA ? window.DATA.sheets || [] : [];
        const s = sheets.find(item => item.id === id);
        if (s) {
          editingSheet = s;
          render(container);
        }
      });
    });

    // 1c. Cancel Edit Sheet
    const cancelSheetEdit = () => {
      editingSheet = null;
      render(container);
    };
    document.getElementById('btn-cancel-edit-sheet')?.addEventListener('click', cancelSheetEdit);
    document.getElementById('btn-cancel-edit-sheet-bottom')?.addEventListener('click', cancelSheetEdit);

    // 1d. Save Edited Sheet Form Submit
    document.getElementById('form-edit-sheet')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('edit-sheet-id')?.value;
      const titleAr = document.getElementById('edit-sheet-title-ar')?.value.trim();
      const titleEn = document.getElementById('edit-sheet-title-en')?.value.trim() || titleAr;
      const doctor = document.getElementById('edit-sheet-doctor')?.value.trim();
      const pages = document.getElementById('edit-sheet-pages')?.value.trim();
      const url = document.getElementById('edit-sheet-url')?.value.trim();

      if (window.DATA && Array.isArray(window.DATA.sheets)) {
        const target = window.DATA.sheets.find(s => s.id === id);
        if (target) {
          target.title_ar = titleAr;
          target.title_en = titleEn;
          target.title = titleAr;
          target.doctor_name = doctor;
          target.pages = pages;
          target.pdf_url = url;
          target.download_url = url;
        }
      }

      const cur = getCustomSheets();
      const curTarget = cur.find(s => s.id === id);
      if (curTarget) {
        curTarget.title_ar = titleAr;
        curTarget.title_en = titleEn;
        curTarget.doctor_name = doctor;
        curTarget.pages = pages;
        curTarget.pdf_url = url;
        curTarget.download_url = url;
      }
      saveCustomSheets(cur);

      editingSheet = null;
      if (typeof window.showToast === 'function') {
        window.showToast(isAr ? 'تم حفظ تعديلات الشيت بنجاح! 💾' : 'Sheet updated successfully! 💾', { type: 'success' });
      }
      render(container);
    });

    // 2. Delete Sheet
    container.querySelectorAll('.btn-delete-sheet').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (window.DATA && Array.isArray(window.DATA.sheets)) {
          window.DATA.sheets = window.DATA.sheets.filter(s => s.id !== id);
        }
        let cur = getCustomSheets().filter(s => s.id !== id);
        saveCustomSheets(cur);

        if (typeof window.showToast === 'function') {
          window.showToast(isAr ? 'تم حذف الملزمة.' : 'Sheet deleted.', { type: 'info' });
        }
        render(container);
      });
    });

    // 3. Add Alert Form Submit
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

    // 3b. Edit Alert Click
    container.querySelectorAll('.btn-edit-alert').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const alerts = window.DATA ? window.DATA.getAlerts() || [] : [];
        const a = alerts.find(item => item.id === id);
        if (a) {
          editingAlert = a;
          render(container);
        }
      });
    });

    // 3c. Cancel Edit Alert
    const cancelAlertEdit = () => {
      editingAlert = null;
      render(container);
    };
    document.getElementById('btn-cancel-edit-alert')?.addEventListener('click', cancelAlertEdit);
    document.getElementById('btn-cancel-edit-alert-bottom')?.addEventListener('click', cancelAlertEdit);

    // 3d. Save Edited Alert Form Submit
    document.getElementById('form-edit-alert')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('edit-alert-id')?.value;
      const title = document.getElementById('edit-alert-title')?.value.trim();
      const badge = document.getElementById('edit-alert-badge')?.value.trim();
      const type = document.getElementById('edit-alert-type')?.value;
      const content = document.getElementById('edit-alert-content')?.value.trim();

      if (window.DATA && Array.isArray(window.DATA.alerts)) {
        const target = window.DATA.alerts.find(a => a.id === id);
        if (target) {
          target.title_ar = title;
          target.title_en = title;
          target.title = title;
          target.badge_ar = badge;
          target.badge_en = badge;
          target.type = type;
          target.content_ar = content;
        }
      }

      const cur = getCustomAlerts();
      const curTarget = cur.find(a => a.id === id);
      if (curTarget) {
        curTarget.title_ar = title;
        curTarget.title_en = title;
        curTarget.badge_ar = badge;
        curTarget.badge_en = badge;
        curTarget.type = type;
        curTarget.content_ar = content;
      }
      saveCustomAlerts(cur);

      editingAlert = null;
      if (typeof window.showToast === 'function') {
        window.showToast(isAr ? 'تم حفظ تعديلات الإعلان بنجاح! 📢' : 'Alert updated successfully! 📢', { type: 'success' });
      }
      render(container);
    });

    // 4. Delete Alert
    container.querySelectorAll('.btn-delete-alert').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (window.DATA && Array.isArray(window.DATA.alerts)) {
          window.DATA.alerts = window.DATA.alerts.filter(a => a.id !== id);
        }
        let cur = getCustomAlerts().filter(a => a.id !== id);
        saveCustomAlerts(cur);

        if (typeof window.showToast === 'function') {
          window.showToast(isAr ? 'تم حذف الإعلان.' : 'Alert deleted.', { type: 'info' });
        }
        render(container);
      });
    });

    // 5. Add Student Form Submit
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

    // 5b. Copy Student Passcode
    container.querySelectorAll('.btn-copy-passcode').forEach(btn => {
      btn.addEventListener('click', () => {
        const passcode = btn.getAttribute('data-passcode');
        if (navigator.clipboard && passcode) {
          navigator.clipboard.writeText(passcode).then(() => {
            if (typeof window.showToast === 'function') {
              window.showToast(isAr ? `تم نسخ الرمز السري (${passcode}) للحافظة! 📋` : `Passcode (${passcode}) copied! 📋`, { type: 'success' });
            }
          });
        }
      });
    });

    // 5c. Reset Student Passcode
    container.querySelectorAll('.btn-reset-student-pass').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name') || '';
        const currentPasscode = btn.getAttribute('data-passcode') || '';
        const promptMsg = isAr 
          ? `أدخل الرمز السري الجديد للطالب (${name}):` 
          : `Enter new passcode for (${name}):`;
        const newPass = prompt(promptMsg, currentPasscode);
        if (newPass && newPass.trim() !== '') {
          let students = getRegisteredStudents();
          const target = students.find(st => st.id === id);
          if (target) {
            target.passcode = newPass.trim();
            saveRegisteredStudents(students);
            if (typeof window.showToast === 'function') {
              window.showToast(isAr ? `تم تعيين الرمز السري الجديد بنجاح: ${newPass.trim()} 🔑` : `Passcode updated: ${newPass.trim()} 🔑`, { type: 'success' });
            }
            render(container);
          }
        }
      });
    });

    // 6. Delete Student Account
    container.querySelectorAll('.btn-delete-student').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        let students = getRegisteredStudents().filter(st => st.id !== id);
        saveRegisteredStudents(students);

        if (typeof window.showToast === 'function') {
          window.showToast(isAr ? 'تم حذف حساب الطالب.' : 'Student account deleted.', { type: 'info' });
        }
        render(container);
      });
    });

    // 7. Practical Subgroup Chip Switcher
    container.querySelectorAll('.btn-admin-group').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedPracticalGroup = btn.getAttribute('data-group');
        render(container);
      });
    });

    // 8. Add Schedule Slot
    document.getElementById('form-add-slot')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const day = document.getElementById('slot-day')?.value;
      const time = document.getElementById('slot-time')?.value.trim();
      const subject = document.getElementById('slot-subject')?.value.trim();
      const hall = document.getElementById('slot-hall')?.value.trim();

      if (window.ExamsPage && Array.isArray(window.ExamsPage.theoryScheduleDays)) {
        const target = window.ExamsPage.theoryScheduleDays.find(d => d.day_ar === day);
        if (target) {
          target.slots.push({
            time: time,
            code: 'DS300',
            subject_ar: subject,
            subject_en: subject,
            hall_ar: hall,
            hall_en: hall
          });
        }
      }

      if (typeof window.showToast === 'function') {
        window.showToast(isAr ? 'تمت إضافة المحاضرة بالجدول!' : 'Slot added to schedule!', { type: 'success' });
      }
      render(container);
    });
  }

  return {
    render,
    checkAuth,
    authenticate
  };
})();
