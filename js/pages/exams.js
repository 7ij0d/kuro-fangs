/**
 * KURO FANGS — OFFICIAL EXAM SCHEDULE PAGE (ACADEMIA STYLE)
 * Midterm Theory (12 subjects), Final Theory (3 subjects) & Practical (Coming Soon)
 * Live Days Countdown, Academia Table/Timeline View & One-Click Print/Export
 */

const ExamsPage = {
  currentTab: 'midterm', // 'midterm' | 'final' | 'practical'
  viewMode: 'table',     // 'table' | 'timeline'

  // Official Midterm Theory Schedule Data (2026-2027)
  midtermData: [
    { no: 1, name_ar: 'الباطنة العامة', name_en: 'General Medicine', code: 'MS 310', day_ar: 'الأحد', day_en: 'Sunday', date: '2027/01/03', time: '11:00 - 12:00' },
    { no: 2, name_ar: 'طب الأسنان الوقائي', name_en: 'Preventive Dentistry', code: 'DS 381', day_ar: 'الأربعاء', day_en: 'Wednesday', date: '2027/01/06', time: '11:00 - 12:00' },
    { no: 3, name_ar: 'جراحة الفم والوجه والفكين 1', name_en: 'Oral & Maxillofacial Surgery I', code: 'DS 341', day_ar: 'الأحد', day_en: 'Sunday', date: '2027/01/10', time: '11:00 - 12:00' },
    { no: 4, name_ar: 'الجراحة العامة', name_en: 'General Surgery', code: 'MS 320', day_ar: 'الأربعاء', day_en: 'Wednesday', date: '2027/01/13', time: '11:00 - 12:00' },
    { no: 5, name_ar: 'أمراض الفم', name_en: 'Oral Diseases / Pathology', code: 'DS 380', day_ar: 'الأحد', day_en: 'Sunday', date: '2027/01/17', time: '11:00 - 12:00' },
    { no: 6, name_ar: 'العلاج التحفظي وعلاج الجذور 2', name_en: 'Cons & Endo II', code: 'DS 311', day_ar: 'الأربعاء', day_en: 'Wednesday', date: '2027/01/20', time: '11:00 - 12:00' },
    { no: 7, name_ar: 'الاستعاضة السنية المتحركة 2', name_en: 'Removable Prosthodontics II', code: 'DS 321', day_ar: 'الأحد', day_en: 'Sunday', date: '2027/01/24', time: '11:00 - 12:00' },
    { no: 8, name_ar: 'الاستعاضة السنية الثابتة 2', name_en: 'Fixed Prosthodontics II', code: 'DS 331', day_ar: 'الأربعاء', day_en: 'Wednesday', date: '2027/01/27', time: '11:00 - 12:00' },
    { no: 9, name_ar: 'أمراض وعلاج اللثة 1', name_en: 'Periodontology I', code: 'DS 351', day_ar: 'الأحد', day_en: 'Sunday', date: '2027/01/31', time: '11:00 - 12:00' },
    { no: 10, name_ar: 'طب الفم والتشخيص والأشعة 1', name_en: 'OMDR I', code: 'DS 361', day_ar: 'الأربعاء', day_en: 'Wednesday', date: '2027/02/03', time: '11:00 - 12:00' },
    { no: 11, name_ar: 'تقويم الأسنان 1', name_en: 'Orthodontics I', code: 'DS 371', day_ar: 'الأحد', day_en: 'Sunday', date: '2027/02/07', time: '11:00 - 12:00' },
    { no: 12, name_ar: 'طب أسنان الأطفال 1', name_en: 'Pediatric Dentistry I', code: 'DS 470', day_ar: 'الأربعاء', day_en: 'Wednesday', date: '2027/02/10', time: '11:00 - 12:00' }
  ],

  // Official Final Theory Schedule Data (2026-2027)
  finalData: [
    { no: 1, name_ar: 'الباطنة العامة', name_en: 'General Medicine', code: 'MS 310', day_ar: 'الأحد', day_en: 'Sunday', date: '2027/04/18', time: '11:00 - 13:00' },
    { no: 2, name_ar: 'الجراحة العامة', name_en: 'General Surgery', code: 'MS 320', day_ar: 'السبت', day_en: 'Saturday', date: '2027/04/24', time: '11:00 - 13:00' },
    { no: 3, name_ar: 'أمراض الفم', name_en: 'Oral Diseases / Pathology', code: 'DS 380', day_ar: 'الخميس', day_en: 'Thursday', date: '2027/04/29', time: '11:00 - 13:00' }
  ],

  // Days Countdown Calculation
  getDaysRemaining(dateStr) {
    // dateStr format: YYYY/MM/DD
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    const examDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    const today = new Date();
    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  },

  render(container, queryParams) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
    const t = (k) => window.I18N ? window.I18N.t(k) : k;

    if (queryParams?.get('tab')) {
      ExamsPage.currentTab = queryParams.get('tab');
    }

    container.innerHTML = `
      <!-- Page Header -->
      <div class="exams-page-header">
        <div class="page-title-group">
          <h1>
            <i data-lucide="calendar" style="color: var(--brand-burgundy); width: 28px; height: 28px;"></i>
            ${isAr ? 'جدول الامتحانات الرسمية' : 'Official Examination Schedule'}
          </h1>
          <p>${isAr ? 'المواعيد المعتمدة للامتحانات النصفية والنهائية — كلية طب وجراحة الفم والأسنان (السنة الثالثة 2026 - 2027)' : 'Approved official examination dates — Faculty of Dentistry (Year 3 • 2026 - 2027)'}</p>
        </div>

        <div class="exams-header-actions no-print">
          <!-- View Toggle -->
          <div class="exams-view-toggle">
            <button id="btn-view-table" class="view-toggle-btn ${ExamsPage.viewMode === 'table' ? 'active' : ''}" title="${isAr ? 'عرض جدول رسمي' : 'Table View'}">
              <i data-lucide="table"></i>
              <span>${isAr ? 'جدول' : 'Table'}</span>
            </button>
            <button id="btn-view-timeline" class="view-toggle-btn ${ExamsPage.viewMode === 'timeline' ? 'active' : ''}" title="${isAr ? 'عرض بطاقات زمنية' : 'Timeline View'}">
              <i data-lucide="clock"></i>
              <span>${isAr ? 'بطاقات' : 'Timeline'}</span>
            </button>
          </div>

          <!-- Print / Save as PDF Button -->
          <button id="btn-print-schedule" class="btn btn-primary btn-print-schedule">
            <i data-lucide="printer"></i>
            <span>${isAr ? 'طباعة / حفظ PDF' : 'Print / Save PDF'}</span>
          </button>
        </div>
      </div>

      <!-- Schedule Tabs Bar -->
      <div class="schedule-tabs-bar no-print">
        <button class="schedule-tab-btn ${ExamsPage.currentTab === 'midterm' ? 'active' : ''}" data-tab="midterm">
          <i data-lucide="file-text"></i>
          <span>${isAr ? 'جدول النظري النصفي' : 'Midterm Theory'}</span>
          <span class="tab-count-pill">12</span>
        </button>

        <button class="schedule-tab-btn ${ExamsPage.currentTab === 'final' ? 'active' : ''}" data-tab="final">
          <i data-lucide="award"></i>
          <span>${isAr ? 'جدول النظري النهائي (الفاينل)' : 'Final Theory Exams'}</span>
          <span class="tab-count-pill">3</span>
        </button>

        <button class="schedule-tab-btn ${ExamsPage.currentTab === 'practical' ? 'active' : ''}" data-tab="practical">
          <i data-lucide="microscope"></i>
          <span>${isAr ? 'جدول امتحانات العملي' : 'Practical Clinical Exams'}</span>
          <span class="badge-coming-soon">${isAr ? 'قريباً' : 'Soon'}</span>
        </button>
      </div>

      <!-- Active Content Container -->
      <div id="exams-content-area" class="exams-content-area"></div>
    `;

    ExamsPage.renderContent(isAr);
    ExamsPage.setupListeners(container, isAr);

    if (window.lucide) window.lucide.createIcons();
  },

  renderContent(isAr) {
    const contentArea = document.getElementById('exams-content-area');
    if (!contentArea) return;

    if (ExamsPage.currentTab === 'midterm') {
      contentArea.innerHTML = ExamsPage.renderMidtermView(isAr);
    } else if (ExamsPage.currentTab === 'final') {
      contentArea.innerHTML = ExamsPage.renderFinalView(isAr);
    } else if (ExamsPage.currentTab === 'practical') {
      contentArea.innerHTML = ExamsPage.renderPracticalView(isAr);
    }

    if (window.lucide) window.lucide.createIcons();
  },

  renderMidtermView(isAr) {
    const data = ExamsPage.midtermData;
    const title = isAr ? 'جدول الامتحانات النصفية — السنة الثالثة 2026 - 2027' : 'Midterm Examination Schedule — Year 3 (2026 - 2027)';
    const subtitle = isAr ? '12 مادة تخصصية • جميع الامتحانات من الساعة 11:00 صباحاً حتى 12:00 ظهراً' : '12 Core Subjects • All sessions held from 11:00 AM to 12:00 PM';

    if (ExamsPage.viewMode === 'timeline') {
      return `
        <div class="exams-schedule-banner">
          <div class="banner-meta">
            <h2>${title}</h2>
            <p>${subtitle}</p>
          </div>
          <span class="badge badge-primary">${isAr ? '12 مادة معتمدة' : '12 Subjects'}</span>
        </div>
        <div class="exams-timeline-grid">
          ${data.map(item => ExamsPage.renderTimelineCard(item, isAr, 'midterm')).join('')}
        </div>
      `;
    }

    // Default: Academia Official Table View
    return `
      <div class="exams-table-card card">
        <div class="table-card-header">
          <div>
            <h2>${title}</h2>
            <p>${subtitle}</p>
          </div>
          <div class="print-watermark">KURO FANGS • FACULTY OF DENTISTRY</div>
        </div>

        <div class="table-responsive">
          <table class="academia-exam-table">
            <thead>
              <tr>
                <th style="width: 55px; text-align: center;">م</th>
                <th>${isAr ? 'اليوم' : 'Day'}</th>
                <th>${isAr ? 'التاريخ' : 'Date'}</th>
                <th>${isAr ? 'التوقيت' : 'Time'}</th>
                <th>${isAr ? 'رمز المقرر' : 'Course Code'}</th>
                <th>${isAr ? 'اسم المقرر' : 'Subject Name'}</th>
                <th class="no-print" style="text-align: center;">${isAr ? 'العد التنازلي' : 'Countdown'}</th>
              </tr>
            </thead>
            <tbody>
              ${data.map(item => {
                const daysLeft = ExamsPage.getDaysRemaining(item.date);
                const isUrgent = daysLeft !== null && daysLeft > 0 && daysLeft <= 14;
                const isToday = daysLeft === 0;
                const countdownText = isToday 
                  ? (isAr ? 'اليوم ⚡' : 'Today ⚡')
                  : daysLeft !== null && daysLeft > 0 
                    ? (isAr ? `متبقي ${daysLeft} يوم` : `${daysLeft} days left`)
                    : (isAr ? 'اكتمل' : 'Passed');

                return `
                  <tr>
                    <td style="text-align: center; font-weight: 700; color: var(--text-muted);">${item.no}</td>
                    <td style="font-weight: 700; color: var(--text-primary);">${isAr ? item.day_ar : item.day_en}</td>
                    <td>
                      <span class="exam-date-badge">
                        <i data-lucide="calendar" style="width: 14px; height: 14px;"></i>
                        ${item.date}
                      </span>
                    </td>
                    <td>
                      <span class="exam-time-badge">
                        <i data-lucide="clock" style="width: 14px; height: 14px;"></i>
                        ${item.time}
                      </span>
                    </td>
                    <td>
                      <span class="course-code-pill">${item.code}</span>
                    </td>
                    <td>
                      <div class="subject-name-cell">
                        <span class="subject-primary-name">${isAr ? item.name_ar : item.name_en}</span>
                        <span class="subject-sub-name">${isAr ? item.name_en : item.name_ar}</span>
                      </div>
                    </td>
                    <td class="no-print" style="text-align: center;">
                      <span class="countdown-pill ${isUrgent ? 'urgent' : ''} ${isToday ? 'today' : ''}">
                        ${countdownText}
                      </span>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderFinalView(isAr) {
    const data = ExamsPage.finalData;
    const title = isAr ? 'جدول الامتحانات النهائية — السنة الثالثة 2026 - 2027' : 'Final Examination Schedule — Year 3 (2026 - 2027)';
    const subtitle = isAr ? 'المقررات الوزارية النهائية • توقيت الامتحانات من الساعة 11:00 صباحاً حتى 13:00 ظهراً (ساعتان)' : 'Final Theory Papers • Sessions from 11:00 AM to 1:00 PM (2 Hours Duration)';

    if (ExamsPage.viewMode === 'timeline') {
      return `
        <div class="exams-schedule-banner final-banner">
          <div class="banner-meta">
            <h2>${title}</h2>
            <p>${subtitle}</p>
          </div>
          <span class="badge badge-danger">${isAr ? '3 امتحانات نهائية' : '3 Final Exams'}</span>
        </div>
        <div class="exams-timeline-grid">
          ${data.map(item => ExamsPage.renderTimelineCard(item, isAr, 'final')).join('')}
        </div>
      `;
    }

    return `
      <div class="exams-table-card card final-table-theme">
        <div class="table-card-header final-header">
          <div>
            <h2>${title}</h2>
            <p>${subtitle}</p>
          </div>
          <div class="print-watermark">KURO FANGS • FINAL EXAMINATIONS</div>
        </div>

        <div class="table-responsive">
          <table class="academia-exam-table final-table">
            <thead>
              <tr>
                <th style="width: 55px; text-align: center;">م</th>
                <th>${isAr ? 'اليوم' : 'Day'}</th>
                <th>${isAr ? 'التاريخ' : 'Date'}</th>
                <th>${isAr ? 'التوقيت' : 'Time'}</th>
                <th>${isAr ? 'رمز المقرر' : 'Course Code'}</th>
                <th>${isAr ? 'اسم المقرر' : 'Subject Name'}</th>
                <th class="no-print" style="text-align: center;">${isAr ? 'العد التنازلي' : 'Countdown'}</th>
              </tr>
            </thead>
            <tbody>
              ${data.map(item => {
                const daysLeft = ExamsPage.getDaysRemaining(item.date);
                const isUrgent = daysLeft !== null && daysLeft > 0 && daysLeft <= 14;
                const isToday = daysLeft === 0;
                const countdownText = isToday 
                  ? (isAr ? 'اليوم ⚡' : 'Today ⚡')
                  : daysLeft !== null && daysLeft > 0 
                    ? (isAr ? `متبقي ${daysLeft} يوم` : `${daysLeft} days left`)
                    : (isAr ? 'اكتمل' : 'Passed');

                return `
                  <tr>
                    <td style="text-align: center; font-weight: 700; color: var(--text-muted);">${item.no}</td>
                    <td style="font-weight: 700; color: var(--text-primary);">${isAr ? item.day_ar : item.day_en}</td>
                    <td>
                      <span class="exam-date-badge final-badge">
                        <i data-lucide="calendar" style="width: 14px; height: 14px;"></i>
                        ${item.date}
                      </span>
                    </td>
                    <td>
                      <span class="exam-time-badge final-badge">
                        <i data-lucide="clock" style="width: 14px; height: 14px;"></i>
                        ${item.time}
                      </span>
                    </td>
                    <td>
                      <span class="course-code-pill final-code">${item.code}</span>
                    </td>
                    <td>
                      <div class="subject-name-cell">
                        <span class="subject-primary-name" style="color: var(--brand-burgundy);">${isAr ? item.name_ar : item.name_en}</span>
                        <span class="subject-sub-name">${isAr ? item.name_en : item.name_ar}</span>
                      </div>
                    </td>
                    <td class="no-print" style="text-align: center;">
                      <span class="countdown-pill final-pill ${isUrgent ? 'urgent' : ''} ${isToday ? 'today' : ''}">
                        ${countdownText}
                      </span>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderPracticalView(isAr) {
    return `
      <div class="card practical-coming-soon-card">
        <div class="coming-soon-icon-wrap">
          <i data-lucide="microscope" style="width: 48px; height: 48px; color: var(--brand-burgundy);"></i>
        </div>
        <h2>${isAr ? 'جدول امتحانات العملي والسريري' : 'Clinical & Practical Examinations Schedule'}</h2>
        <p class="coming-soon-desc">
          ${isAr 
            ? 'يجري حالياً مراجعة وتنسيق جدول مواعيد معامل الأسنان والمستشفى التعليمي مع رؤساء الأقسام. سيتم نشر التوزيع الرسمي فور اعتماده رسمياً.' 
            : 'Clinical and laboratory exam schedules are currently being coordinated with academic department heads. The official roster will be posted immediately upon verification.'}
        </p>
        <div class="coming-soon-badges">
          <span class="badge badge-warning">${isAr ? 'قيد التنسيق النهائي' : 'Under Final Coordination'}</span>
          <span class="badge badge-primary">${isAr ? 'معامل الأسنان والعيادات' : 'Dental Labs & Clinics'}</span>
        </div>
        <button class="btn btn-soft" style="margin-top: 20px;" onclick="window.showToast('${isAr ? 'سيتم إشعارك فور اعتماد جدول العملي!' : 'You will be notified once practical dates are announced!'}', { type: 'info' });">
          <i data-lucide="bell" style="width: 16px; height: 16px;"></i>
          ${isAr ? 'تفعيل تنبيهات موعد العملي' : 'Notify Me When Available'}
        </button>
      </div>
    `;
  },

  renderTimelineCard(item, isAr, examType) {
    const daysLeft = ExamsPage.getDaysRemaining(item.date);
    const isUrgent = daysLeft !== null && daysLeft > 0 && daysLeft <= 14;
    const isToday = daysLeft === 0;
    const countdownText = isToday 
      ? (isAr ? 'اليوم ⚡' : 'Today ⚡')
      : daysLeft !== null && daysLeft > 0 
        ? (isAr ? `متبقي ${daysLeft} يوم` : `${daysLeft} days left`)
        : (isAr ? 'اكتمل' : 'Passed');

    return `
      <div class="card exam-timeline-card ${examType === 'final' ? 'final-card' : ''}">
        <div class="card-timeline-top">
          <div class="timeline-day-date">
            <span class="timeline-day">${isAr ? item.day_ar : item.day_en}</span>
            <span class="timeline-date">${item.date}</span>
          </div>
          <span class="countdown-pill ${isUrgent ? 'urgent' : ''} ${isToday ? 'today' : ''}">${countdownText}</span>
        </div>

        <div class="card-timeline-body">
          <span class="course-code-pill">${item.code}</span>
          <h3 class="timeline-subject-title">${isAr ? item.name_ar : item.name_en}</h3>
          <p class="timeline-subject-sub">${isAr ? item.name_en : item.name_ar}</p>
        </div>

        <div class="card-timeline-footer">
          <div class="timeline-time">
            <i data-lucide="clock" style="width: 14px; height: 14px;"></i>
            <span>${item.time}</span>
          </div>
          <span class="timeline-hall">${isAr ? 'القاعات المركزية' : 'Main Lecture Hall'}</span>
        </div>
      </div>
    `;
  },

  setupListeners(container, isAr) {
    // Tab switching
    container.querySelectorAll('.schedule-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        ExamsPage.currentTab = tab;
        container.querySelectorAll('.schedule-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        ExamsPage.renderContent(isAr);
      });
    });

    // View mode switching
    const tableBtn = document.getElementById('btn-view-table');
    const timelineBtn = document.getElementById('btn-view-timeline');

    if (tableBtn && timelineBtn) {
      tableBtn.addEventListener('click', () => {
        ExamsPage.viewMode = 'table';
        tableBtn.classList.add('active');
        timelineBtn.classList.remove('active');
        ExamsPage.renderContent(isAr);
      });

      timelineBtn.addEventListener('click', () => {
        ExamsPage.viewMode = 'timeline';
        timelineBtn.classList.add('active');
        tableBtn.classList.remove('active');
        ExamsPage.renderContent(isAr);
      });
    }

    // Print & PDF Export
    const printBtn = document.getElementById('btn-print-schedule');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        // Dismiss all active toasts and hide container immediately to avoid appearing in preview
        if (typeof window.clearToasts === 'function') {
          window.clearToasts();
        }
        const container = document.getElementById('toast-container');
        if (container) {
          container.style.display = 'none';
        }
        setTimeout(() => {
          window.print();
          // Restore toast container display after print dialog
          setTimeout(() => {
            if (container) container.style.display = '';
          }, 500);
        }, 300);
      });
    }
  }
};

window.ExamsPage = ExamsPage;
