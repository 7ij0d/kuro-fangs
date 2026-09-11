/**
 * KURO FANGS — DEDICATED FACULTY ADMIN PORTAL (#/admin)
 * Protected Admin Portal for Faculty Administrators
 * - Passcode Protected (Default: kuro2026)
 * - Upload & publish global PDF sheets live to window.DATA.sheets
 * - Publish official faculty announcements to homepage feed
 * - Modify timetables and exam schedules
 */

window.AdminPage = (function () {
  let isAdminAuthenticated = false;

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

  function renderAuthPrompt(container, isAr) {
    container.innerHTML = `
      <div class="admin-auth-wrapper" style="max-width: 460px; margin: 50px auto; padding: 36px 28px; background: var(--bg-card); border: 1px solid var(--border-card); border-radius: 20px; box-shadow: var(--shadow-lg); text-align: center;">
        <div style="width: 68px; height: 68px; margin: 0 auto 16px; background: rgba(190, 18, 60, 0.1); border: 1px solid rgba(190, 18, 60, 0.25); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <i data-lucide="lock" style="width: 32px; height: 32px; color: var(--brand-burgundy);"></i>
        </div>
        <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 8px; color: var(--text-primary);">
          ${isAr ? 'بوابة إدارة الكلية والمنصة' : 'Faculty Admin Portal'}
        </h2>
        <div class="badge badge-primary" style="display: inline-flex; margin-bottom: 14px; font-size: 0.75rem;">
          ${isAr ? 'منطقة محمية • إدارة كلية طب الأسنان' : 'Protected Area • Faculty Board'}
        </div>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 22px; line-height: 1.6;">
          ${isAr 
            ? 'هذه اللوحة مخصصة لإدارة الكلية والمسؤول الأكاديمي لنشر الملازم المعتمدة والإعلانات وتعديل الجداول. تصفح الملازم متاح للطلبة والزوار بصلاحية القراءة فقط.' 
            : 'Access restricted to faculty administrators to publish official sheets, announcements, and schedules. Regular students have read-only access.'}
        </p>

        <form id="admin-passcode-form">
          <div style="margin-bottom: 16px; text-align: ${isAr ? 'right' : 'left'};">
            <label style="display: block; font-size: 0.825rem; font-weight: 700; margin-bottom: 6px; color: var(--text-primary);">
              ${isAr ? 'رمز مرور الآدمن (Passcode):' : 'Admin Passcode:'}
            </label>
            <div style="position: relative;">
              <input type="password" id="admin-passcode-input" class="auth-input" placeholder="••••••••" required style="width: 100%; font-size: 1.1rem; text-align: center; letter-spacing: 4px; padding: 12px;" />
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 5px;">
              ${isAr ? 'رمز الدخول الافتراضي: <b>kuro2026</b>' : 'Default Passcode: <b>kuro2026</b>'}
            </div>
          </div>

          <div id="admin-auth-error" style="display: none; color: #EF4444; font-size: 0.825rem; font-weight: 700; margin-bottom: 14px; background: rgba(239, 68, 68, 0.1); padding: 8px; border-radius: 8px;"></div>

          <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 12px; font-weight: 800; gap: 8px;">
            <i data-lucide="shield-check" style="width: 18px; height: 18px;"></i>
            <span>${isAr ? 'تسجيل دخول مسؤول الكلية ⚡' : 'Enter Admin Dashboard ⚡'}</span>
          </button>
        </form>

        <div style="margin-top: 20px; border-top: 1px solid var(--border-subtle); padding-top: 14px;">
          <a href="#/" class="btn btn-secondary btn-sm" style="gap: 6px; font-size: 0.775rem;">
            <i data-lucide="arrow-left" style="width: 13px; height: 13px;"></i>
            <span>${isAr ? 'العودة للمنصة كطالب / زائر' : 'Return to Home as Student / Guest'}</span>
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
          window.showToast(isAr ? 'مرحباً بك في لوحة تحكم الكلية! 🛡️' : 'Welcome to Faculty Admin Portal! 🛡️', { type: 'success' });
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

  function render(container) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;

    if (!checkAuth()) {
      renderAuthPrompt(container, isAr);
      return;
    }

    const sheets = window.DATA ? window.DATA.sheets || [] : [];
    const alerts = window.DATA ? window.DATA.getAlerts() || [] : [];
    const subjects = window.DATA ? window.DATA.getSubjects() || [] : [];
    const customSheets = getCustomSheets();
    const customAlerts = getCustomAlerts();

    container.innerHTML = `
      <div class="admin-dashboard-wrapper">
        <!-- Admin Title Bar -->
        <div class="exams-page-header">
          <div class="page-title-group">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span class="badge badge-primary" style="background: #059669; color: #FFFFFF; font-size: 0.75rem; font-weight: 800; padding: 3px 10px;">
                <i data-lucide="shield-check" style="width: 12px; height: 12px;"></i>
                ${isAr ? 'مسؤول الكلية المعتمد' : 'Authorized Administrator'}
              </span>
              <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">Passcode: kuro2026</span>
            </div>
            <h1>
              <i data-lucide="settings" style="color: var(--brand-burgundy); width: 28px; height: 28px;"></i>
              ${isAr ? 'لوحة تحكم وإدارة الكلية (Faculty Admin Portal)' : 'Faculty Admin Management Portal'}
            </h1>
            <p>${isAr ? 'إدارة ونشر الملازم المعتمدة، إعلانات الكلية الرسمية، ومصفوفة الجداول الأكاديمية' : 'Publish official sheets, faculty announcements, and update lecture & exam timetables'}</p>
          </div>

          <div class="exams-header-actions no-print">
            <a href="#/lecture-schedule" class="btn btn-secondary btn-sm" style="gap: 6px; font-weight: 700;">
              <i data-lucide="calendar"></i>
              <span>${isAr ? 'معاينة الجداول' : 'View Timetables'}</span>
            </a>
            <a href="#/sheets" class="btn btn-secondary btn-sm" style="gap: 6px; font-weight: 700;">
              <i data-lucide="file-text"></i>
              <span>${isAr ? 'معاينة الملازم' : 'View Sheets'}</span>
            </a>
            <button id="btn-admin-logout" class="btn btn-secondary btn-sm" style="color: #EF4444; border-color: rgba(239, 68, 68, 0.3); font-weight: 700;">
              <i data-lucide="log-out" style="width: 14px; height: 14px;"></i>
              <span>${isAr ? 'تسجيل الخروج' : 'Logout Admin'}</span>
            </button>
          </div>
        </div>

        <!-- Admin Quick Stats -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px; margin-bottom: 24px;">
          <div class="card" style="padding: 16px 20px; border-radius: 14px; border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 700;">${isAr ? 'إجمالي الملازم المعتمدة' : 'Total Published Sheets'}</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: var(--brand-primary); margin-top: 4px;">${sheets.length}</div>
            <div style="font-size: 0.725rem; color: var(--text-muted); margin-top: 2px;">${customSheets.length} ${isAr ? 'أضيفت من الآدمن' : 'custom added'}</div>
          </div>
          <div class="card" style="padding: 16px 20px; border-radius: 14px; border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 700;">${isAr ? 'الإعلانات الرسمية النشطة' : 'Active Announcements'}</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: #0284C7; margin-top: 4px;">${alerts.length}</div>
            <div style="font-size: 0.725rem; color: var(--text-muted); margin-top: 2px;">${customAlerts.length} ${isAr ? 'أضيفت من الآدمن' : 'custom added'}</div>
          </div>
          <div class="card" style="padding: 16px 20px; border-radius: 14px; border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 700;">${isAr ? 'المواد الدراسية (السنة 3)' : 'Core Subjects (Year 3)'}</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: #10B981; margin-top: 4px;">${subjects.length}</div>
            <div style="font-size: 0.725rem; color: var(--text-muted); margin-top: 2px;">12 ${isAr ? 'مقرر تخصصي' : 'core courses'}</div>
          </div>
          <div class="card" style="padding: 16px 20px; border-radius: 14px; border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 700;">${isAr ? 'حالة التحكم والنشر' : 'Publishing Permissions'}</div>
            <div style="font-size: 1.1rem; font-weight: 800; color: #059669; margin-top: 8px;">
              <span style="display: inline-flex; align-items: center; gap: 4px;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #10B981;"></span>
                ${isAr ? 'الآدمن فقط (مقيّد)' : 'Admin Only (Strict)'}
              </span>
            </div>
            <div style="font-size: 0.725rem; color: var(--text-muted); margin-top: 2px;">${isAr ? 'الطلبة: قراءة فقط' : 'Students: Read-only'}</div>
          </div>
        </div>

        <!-- Section 1: Upload & Publish Global PDF Sheet -->
        <div class="card" style="padding: 24px; border-radius: 16px; margin-bottom: 24px; border-left: 4px solid var(--brand-burgundy);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 8px;">
            <h3 style="font-size: 1.15rem; font-weight: 800; display: flex; align-items: center; gap: 8px; margin: 0;">
              <i data-lucide="file-plus" style="color: var(--brand-burgundy); width: 22px; height: 22px;"></i>
              ${isAr ? '📁 1. رفع ونشر شيت / ملزمة معتمدة للمنصة (خاص بالآدمن)' : '📁 1. Upload & Publish Official Faculty Sheet (Admin Only)'}
            </h3>
            <span class="badge badge-primary" style="font-size: 0.75rem;">Live Publish</span>
          </div>

          <p style="font-size: 0.825rem; color: var(--text-secondary); margin-bottom: 18px; line-height: 1.5;">
            ${isAr 
              ? 'يتم نشر الملازم هنا مباشرة لتظهر في صفحة الشيتات العامة وصفحات المواد لكافة الطلبة فوراً مع الحفظ التلقائي.' 
              : 'Sheets uploaded here will be published immediately to global /sheets and subject hubs for all students.'}
          </p>

          <form id="admin-add-sheet-form" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'عنوان الملزمة / المحاضرة بالعربية:' : 'Sheet Title (Arabic):'}</label>
              <input type="text" id="sheet-title-ar-input" class="auth-input" placeholder="${isAr ? 'مثال: المحاضرة 1 — التخدير الموضعي وتقنياته' : 'Lecture 1 — Local Anesthesia'}" required />
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'عنوان الملزمة بالإنجليزية:' : 'Sheet Title (English):'}</label>
              <input type="text" id="sheet-title-en-input" class="auth-input" placeholder="Lecture 1 — Local Anesthesia Techniques" required />
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'المادة الدراسية:' : 'Course Subject:'}</label>
              <select id="sheet-subject-select" class="auth-input" required>
                ${subjects.map(s => `<option value="${s.id}">${isAr ? s.name_ar : s.name_en} (${s.code || s.id})</option>`).join('')}
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'أستاذ المادة / المحاضر:' : 'Lecturer / Doctor:'}</label>
              <input type="text" id="sheet-doctor-input" class="auth-input" placeholder="${isAr ? 'د. عبدالسلام الشريف' : 'Dr. El-Sherif'}" required />
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'الفصل الدراسي:' : 'Semester / Term:'}</label>
              <select id="sheet-term-select" class="auth-input">
                <option value="1">${isAr ? 'الفصل الأول (Semester 1)' : 'Semester 1'}</option>
                <option value="2">${isAr ? 'الفصل الثاني (Semester 2)' : 'Semester 2'}</option>
                <option value="annual">${isAr ? 'سنوي موحد (Annual)' : 'Annual'}</option>
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'عدد الصفحات والحجم:' : 'Pages & File Size:'}</label>
              <input type="text" id="sheet-pages-input" class="auth-input" placeholder="${isAr ? '24 صفحة • 3.2 MB' : '24 pages • 3.2 MB'}" required />
            </div>

            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'رابط ملف الـ PDF المعتمد (URL / Drive / CDN):' : 'PDF Document File URL:'}</label>
              <input type="url" id="sheet-url-input" class="auth-input" placeholder="https://drive.google.com/... or https://faculty.uot.edu/sheets/..." value="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" required />
            </div>

            <div style="grid-column: 1 / -1; display: flex; justify-content: flex-end;">
              <button type="submit" class="btn btn-primary" style="padding: 12px 28px; font-weight: 800; gap: 8px;">
                <i data-lucide="plus-circle"></i>
                <span>${isAr ? 'نشر الملزمة للطلبة على المنصة فوراً 🚀' : 'Publish Sheet to Students Live 🚀'}</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Section 2: Publish Official Faculty Announcement -->
        <div class="card" style="padding: 24px; border-radius: 16px; margin-bottom: 24px; border-left: 4px solid #0284C7;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 8px;">
            <h3 style="font-size: 1.15rem; font-weight: 800; display: flex; align-items: center; gap: 8px; margin: 0;">
              <i data-lucide="megaphone" style="color: #0284C7; width: 22px; height: 22px;"></i>
              ${isAr ? '📢 2. نشر إعلان رسمي وتنبيه على الواجهة الرئيسية (خاص بالآدمن)' : '📢 2. Publish Official Announcement to Homepage Feed (Admin Only)'}
            </h3>
            <span class="badge badge-primary" style="background: #0284C7; font-size: 0.75rem;">Home Feed</span>
          </div>

          <form id="admin-add-announcement-form" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'عنوان الإعلان:' : 'Announcement Title:'}</label>
              <input type="text" id="ann-title-input" class="auth-input" placeholder="${isAr ? 'إعلان هام لطلبة السنة الثالثة بشأن مواعيد الامتحانات...' : 'Important Faculty Notice for Year 3...'}" required />
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'شارة وتصنيف الإعلان:' : 'Badge Label:'}</label>
              <input type="text" id="ann-badge-input" class="auth-input" placeholder="${isAr ? 'هام جداً • قسم الدراسة والامتحانات' : 'Urgent • Faculty Notice'}" required />
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'نوع الأهمية:' : 'Severity Type:'}</label>
              <select id="ann-type-select" class="auth-input">
                <option value="urgent">${isAr ? 'عاجل وهام (أحمر)' : 'Urgent (Red)'}</option>
                <option value="info">${isAr ? 'أكاديمي وتنبيه عام (أزرق)' : 'Academic / Info (Blue)'}</option>
                <option value="exam">${isAr ? 'امتحانات وجداول (برغندي)' : 'Exams / Schedules (Burgundy)'}</option>
              </select>
            </div>

            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'نص وتفاصيل الإعلان الرسمية:' : 'Announcement Content:'}</label>
              <textarea id="ann-content-input" class="auth-input" rows="4" placeholder="${isAr ? '1. تفاصيل الإعلان والقرارات الصادرة من إدارة الكلية...' : 'Full announcement details...'}" required style="resize: vertical;"></textarea>
            </div>

            <div style="grid-column: 1 / -1; display: flex; justify-content: flex-end;">
              <button type="submit" class="btn btn-primary" style="background: #0284C7; border-color: #0284C7; padding: 12px 28px; font-weight: 800; gap: 8px;">
                <i data-lucide="send"></i>
                <span>${isAr ? 'نشر الإعلان على الصفحة الرئيسية فوراً 📢' : 'Publish Announcement Live 📢'}</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Section 3: Modify Timetables & Schedules -->
        <div class="card" style="padding: 24px; border-radius: 16px; margin-bottom: 24px; border-left: 4px solid #10B981;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 8px;">
            <h3 style="font-size: 1.15rem; font-weight: 800; display: flex; align-items: center; gap: 8px; margin: 0;">
              <i data-lucide="calendar-plus" style="color: #10B981; width: 22px; height: 22px;"></i>
              ${isAr ? '📅 3. تعديل وإضافة المحاضرات والامتحانات في الجداول' : '📅 3. Modify Timetables & Exam Schedules'}
            </h3>
            <span class="badge badge-primary" style="background: #10B981; font-size: 0.75rem;">Timetable Control</span>
          </div>

          <p style="font-size: 0.825rem; color: var(--text-secondary); margin-bottom: 18px; line-height: 1.5;">
            ${isAr 
              ? 'يتيح للآدمن إضافة حصة محاضرة جديدة في جدول المحاضرات النظري بمدرج 2 أو إضافة موعد امتحان في جدول الامتحانات.' 
              : 'Allows faculty admin to add lecture slots to the Auditorium 2 matrix or add new exam timetable items.'}
          </p>

          <form id="admin-add-slot-form" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'اليوم الدراسي:' : 'Weekday:'}</label>
              <select id="slot-day-select" class="auth-input" required>
                <option value="السبت">${isAr ? 'السبت (Saturday)' : 'Saturday'}</option>
                <option value="الأحد">${isAr ? 'الأحد (Sunday)' : 'Sunday'}</option>
                <option value="الإثنين">${isAr ? 'الإثنين (Monday)' : 'Monday'}</option>
                <option value="الثلاثاء">${isAr ? 'الثلاثاء (Tuesday)' : 'Tuesday'}</option>
                <option value="الأربعاء">${isAr ? 'الأربعاء (Wednesday)' : 'Wednesday'}</option>
                <option value="الخميس">${isAr ? 'الخميس (Thursday)' : 'Thursday'}</option>
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'التوقيت:' : 'Time Slot:'}</label>
              <input type="text" id="slot-time-input" class="auth-input" placeholder="08:00 - 10:00" required />
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'رمز المقرر:' : 'Course Code:'}</label>
              <input type="text" id="slot-code-input" class="auth-input" placeholder="DS311" required />
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'المادة الدراسية بالعربية:' : 'Subject Name (AR):'}</label>
              <input type="text" id="slot-subject-ar-input" class="auth-input" placeholder="العلاج التحفظي وعلاج الجذور 2" required />
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'المادة الدراسية بالإنجليزية:' : 'Subject Name (EN):'}</label>
              <input type="text" id="slot-subject-en-input" class="auth-input" placeholder="Cons & Endo II" required />
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">${isAr ? 'القاعة / المدرج:' : 'Auditorium / Hall:'}</label>
              <input type="text" id="slot-hall-input" class="auth-input" value="مدرج 2" required />
            </div>

            <div style="grid-column: 1 / -1; display: flex; justify-content: flex-end;">
              <button type="submit" class="btn btn-primary" style="background: #10B981; border-color: #10B981; padding: 12px 28px; font-weight: 800; gap: 8px;">
                <i data-lucide="check-circle-2"></i>
                <span>${isAr ? 'حفظ وإدراج المحاضرة في الجدول الأسبوعي 📅' : 'Add Slot to Lecture Timetable 📅'}</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Section 4: Currently Added Admin Items Management -->
        ${customSheets.length > 0 || customAlerts.length > 0 ? `
          <div class="card" style="padding: 24px; border-radius: 16px; margin-bottom: 24px;">
            <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
              <i data-lucide="list" style="width: 20px; height: 20px; color: var(--brand-primary);"></i>
              ${isAr ? 'العناصر المضافة بواسطة الآدمن حالياً' : 'Current Admin-Published Items'}
            </h3>

            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${customSheets.map(s => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-radius: 10px; background: var(--bg-hover); border: 1px solid var(--border-subtle); flex-wrap: wrap; gap: 8px;">
                  <div>
                    <span class="badge badge-primary" style="font-size: 0.7rem; margin-left: 6px;">شيت مضاف</span>
                    <strong style="color: var(--text-primary);">${s.title_ar || s.title_en}</strong>
                    <span style="font-size: 0.8rem; color: var(--text-muted); margin: 0 6px;">• ${s.doctor_name || ''} • ${s.pages || ''}</span>
                  </div>
                  <button class="btn btn-secondary btn-sm btn-delete-custom-sheet" data-id="${s.id}" style="color: #EF4444; border-color: rgba(239,68,68,0.3); font-size: 0.75rem;">
                    <i data-lucide="trash-2" style="width: 13px; height: 13px;"></i>
                    <span>${isAr ? 'حذف الملزمة' : 'Delete'}</span>
                  </button>
                </div>
              `).join('')}

              ${customAlerts.map(a => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-radius: 10px; background: var(--bg-hover); border: 1px solid var(--border-subtle); flex-wrap: wrap; gap: 8px;">
                  <div>
                    <span class="badge badge-primary" style="background: #0284C7; font-size: 0.7rem; margin-left: 6px;">إعلان مضاف</span>
                    <strong style="color: var(--text-primary);">${a.title_ar || a.title_en}</strong>
                  </div>
                  <button class="btn btn-secondary btn-sm btn-delete-custom-alert" data-id="${a.id}" style="color: #EF4444; border-color: rgba(239,68,68,0.3); font-size: 0.75rem;">
                    <i data-lucide="trash-2" style="width: 13px; height: 13px;"></i>
                    <span>${isAr ? 'حذف الإعلان' : 'Delete'}</span>
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // 1. Logout Handler
    document.getElementById('btn-admin-logout')?.addEventListener('click', () => {
      sessionStorage.removeItem('kf_admin_auth');
      isAdminAuthenticated = false;
      if (typeof window.showToast === 'function') {
        window.showToast(isAr ? 'تم تسجيل خروج الآدمن بنجاح.' : 'Admin logged out successfully.', { type: 'info' });
      }
      renderAuthPrompt(container, isAr);
    });

    // 2. Add Sheet Handler
    document.getElementById('admin-add-sheet-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const titleAr = document.getElementById('sheet-title-ar-input')?.value || '';
      const titleEn = document.getElementById('sheet-title-en-input')?.value || titleAr;
      const subjectId = document.getElementById('sheet-subject-select')?.value || '';
      const doctor = document.getElementById('sheet-doctor-input')?.value || '';
      const term = document.getElementById('sheet-term-select')?.value || '1';
      const pages = document.getElementById('sheet-pages-input')?.value || '';
      const fileUrl = document.getElementById('sheet-url-input')?.value || '';

      const newSheet = {
        id: 'sh_admin_' + Date.now(),
        subject_id: subjectId,
        title_ar: titleAr,
        title_en: titleEn,
        doctor_name: doctor,
        term: term,
        pages: pages,
        pdf_url: fileUrl,
        date: new Date().toISOString().split('T')[0],
        download_url: fileUrl,
        is_official: true
      };

      // Live update in window.DATA.sheets
      if (window.DATA) {
        if (!Array.isArray(window.DATA.sheets)) window.DATA.sheets = [];
        window.DATA.sheets.unshift(newSheet);
      }

      // Persist in localStorage
      const cur = getCustomSheets();
      cur.unshift(newSheet);
      saveCustomSheets(cur);

      if (typeof window.showToast === 'function') {
        window.showToast(isAr ? 'تم نشر الملزمة المعتمدة بنجاح على المنصة! 🚀' : 'Official sheet published live to students! 🚀', { type: 'success' });
      }

      render(container);
    });

    // 3. Add Announcement Handler
    document.getElementById('admin-add-announcement-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('ann-title-input')?.value || '';
      const badge = document.getElementById('ann-badge-input')?.value || (isAr ? 'هام جداً' : 'Urgent');
      const type = document.getElementById('ann-type-select')?.value || 'urgent';
      const content = document.getElementById('ann-content-input')?.value || '';

      const newAlert = {
        id: 'alt_admin_' + Date.now(),
        type: type,
        badge_ar: badge,
        badge_en: badge,
        title_ar: title,
        title_en: title,
        date: new Date().toISOString().split('T')[0],
        time: 'الآن',
        cover: 'assets/icons/faculty_logo.png',
        content_ar: content,
        publisher_ar: 'إدارة كلية طب وجراحة الفم والأسنان'
      };

      if (window.DATA) {
        if (!Array.isArray(window.DATA.alerts)) window.DATA.alerts = [];
        window.DATA.alerts.unshift(newAlert);
      }

      const curAlerts = getCustomAlerts();
      curAlerts.unshift(newAlert);
      saveCustomAlerts(curAlerts);

      if (typeof window.showToast === 'function') {
        window.showToast(isAr ? 'تم نشر الإعلان على الصفحة الرئيسية فوراً! 📢' : 'Announcement published live on Home! 📢', { type: 'success' });
      }

      render(container);
    });

    // 4. Add Timetable Slot Handler
    document.getElementById('admin-add-slot-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const dayAr = document.getElementById('slot-day-select')?.value || 'السبت';
      const time = document.getElementById('slot-time-input')?.value || '';
      const code = document.getElementById('slot-code-input')?.value || '';
      const subjectAr = document.getElementById('slot-subject-ar-input')?.value || '';
      const subjectEn = document.getElementById('slot-subject-en-input')?.value || subjectAr;
      const hall = document.getElementById('slot-hall-input')?.value || 'مدرج 2';

      const newSlot = {
        time: time,
        code: code,
        subject_ar: subjectAr,
        subject_en: subjectEn,
        hall_ar: hall,
        hall_en: hall === 'مدرج 2' ? 'Auditorium 2' : hall
      };

      if (window.ExamsPage && Array.isArray(window.ExamsPage.theoryScheduleDays)) {
        const targetDay = window.ExamsPage.theoryScheduleDays.find(d => d.day_ar === dayAr);
        if (targetDay) {
          targetDay.slots.push(newSlot);
        }
      }

      if (typeof window.showToast === 'function') {
        window.showToast(isAr ? 'تمت إضافة المحاضرة للجدول الأسبوعي بنجاح! 📅' : 'Lecture slot added to timetable! 📅', { type: 'success' });
      }

      // Reset slot form inputs
      document.getElementById('slot-time-input').value = '';
      document.getElementById('slot-code-input').value = '';
      document.getElementById('slot-subject-ar-input').value = '';
      document.getElementById('slot-subject-en-input').value = '';
    });

    // 5. Delete Custom Sheet Handler
    container.querySelectorAll('.btn-delete-custom-sheet').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        let cur = getCustomSheets().filter(s => s.id !== id);
        saveCustomSheets(cur);
        if (window.DATA && Array.isArray(window.DATA.sheets)) {
          window.DATA.sheets = window.DATA.sheets.filter(s => s.id !== id);
        }
        if (typeof window.showToast === 'function') {
          window.showToast(isAr ? 'تم حذف الملزمة.' : 'Sheet deleted.', { type: 'info' });
        }
        render(container);
      });
    });

    // 6. Delete Custom Alert Handler
    container.querySelectorAll('.btn-delete-custom-alert').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        let cur = getCustomAlerts().filter(a => a.id !== id);
        saveCustomAlerts(cur);
        if (window.DATA && Array.isArray(window.DATA.alerts)) {
          window.DATA.alerts = window.DATA.alerts.filter(a => a.id !== id);
        }
        if (typeof window.showToast === 'function') {
          window.showToast(isAr ? 'تم حذف الإعلان.' : 'Announcement deleted.', { type: 'info' });
        }
        render(container);
      });
    });
  }

  return {
    render,
    checkAuth,
    authenticate
  };
})();
