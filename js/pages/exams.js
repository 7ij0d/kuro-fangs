/**
 * KURO FANGS — OFFICIAL EXAM SCHEDULE PAGE (ACADEMIA STYLE)
 * Midterm Theory (12 subjects), Final Theory (3 subjects) & Practical (Coming Soon)
 * Live Days Countdown, Academia Table/Timeline View & One-Click Print/Export
 */

const ExamsPage = {
  currentTab: localStorage.getItem('kf_schedule_active_tab') || 'practical',
  viewMode: 'table',     // 'table' | 'timeline'

  getSelectedGroup() {
    return localStorage.getItem('kf_selected_group') || 'A1';
  },

  setSelectedGroup(group) {
    const valid = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2', 'E1', 'E2'];
    const sanitized = valid.includes(group) ? group : 'A1';
    localStorage.setItem('kf_selected_group', sanitized);
    return sanitized;
  },

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
    if (queryParams?.get('group')) {
      ExamsPage.setSelectedGroup(queryParams.get('group'));
    }

    container.innerHTML = `
      <!-- Page Header -->
      <div class="exams-page-header">
        <div class="page-title-group">
          <h1>
            <i data-lucide="calendar" style="color: var(--brand-burgundy); width: 28px; height: 28px;"></i>
            ${isAr ? 'الجداول الأكاديمية والامتحانات' : 'Academic & Exam Schedules'}
          </h1>
          <p>${isAr ? 'جدول العيادات والمعامل العملي/السريري (10 مجموعات) وجداول الامتحانات الرسمية — السنة الثالثة (2026 - 2027)' : 'Clinical & practical lab schedules (10 subgroups) and official examination timetables — Year 3 (2026 - 2027)'}</p>
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
        <button class="schedule-tab-btn ${ExamsPage.currentTab === 'practical' ? 'active' : ''}" data-tab="practical">
          <i data-lucide="microscope"></i>
          <span>${isAr ? 'جدول المعامل والعيادات العملي/السريري' : 'Clinical & Lab Schedule'}</span>
          <span class="tab-count-pill" style="background: #10B981; color: #FFFFFF; font-weight: 800;">A1–E2</span>
        </button>

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

    if (ExamsPage.currentTab === 'practical') {
      contentArea.innerHTML = ExamsPage.renderPracticalView(isAr);
      ExamsPage.setupPracticalListeners(isAr);
    } else if (ExamsPage.currentTab === 'midterm') {
      contentArea.innerHTML = ExamsPage.renderMidtermView(isAr);
    } else if (ExamsPage.currentTab === 'final') {
      contentArea.innerHTML = ExamsPage.renderFinalView(isAr);
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
    const selectedGroup = ExamsPage.getSelectedGroup();
    const allGroups = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2', 'E1', 'E2'];
    const clinicalData = window.CLINICAL_SCHEDULE_DATA || {};
    const groupSessions = clinicalData[selectedGroup] || [];

    const weekdays = [
      { ar: 'الأحد', en: 'Sunday' },
      { ar: 'الإثنين', en: 'Monday' },
      { ar: 'الثلاثاء', en: 'Tuesday' },
      { ar: 'الأربعاء', en: 'Wednesday' },
      { ar: 'الخميس', en: 'Thursday' }
    ];

    // Group sessions by weekday
    const dayMap = {};
    weekdays.forEach(w => { dayMap[w.ar] = []; });
    groupSessions.forEach(s => {
      if (dayMap[s.day_ar]) {
        dayMap[s.day_ar].push(s);
      }
    });

    const isTableView = ExamsPage.viewMode !== 'timeline';

    return `
      <!-- Quick Subgroup Selector Bar -->
      <div class="clinical-group-selector-box">
        <div class="group-selector-header">
          <div class="group-selector-title">
            <i data-lucide="users" style="width: 22px; height: 22px; color: var(--brand-primary);"></i>
            <span>${isAr ? 'شريط الاختيار السريع لمجموعتك (اختر من A1 إلى E2):' : 'Quick Subgroup Selector (Choose from A1 to E2):'}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
            <div class="active-group-tag">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #10B981; display: inline-block;"></span>
              <span>${isAr ? `المجموعة المحفوظة: ${selectedGroup}` : `Saved Subgroup: ${selectedGroup}`}</span>
            </div>
            <a href="https://tables.dentaluot.com/print.php?year=3&section=A&mode=combined&pdf=1&student=1" target="_blank" rel="noopener" class="official-source-pill" style="background: var(--bg-hover); color: var(--text-secondary); border: 1px solid var(--border-subtle);" title="${isAr ? 'عرض الجدول في موقع الكلية الرسمي' : 'Open official timetable portal'}">
              <span>${isAr ? '🔗 المصدر الرسمي بالكلية' : '🔗 Official Faculty Portal'}</span>
              <i data-lucide="external-link" style="width: 13px; height: 13px;"></i>
            </a>
          </div>
        </div>

        <!-- 10 Groups Interactive Chips Bar -->
        <div class="clinical-group-chips-wrap no-print">
          ${allGroups.map(g => `
            <button class="btn-group-chip ${g === selectedGroup ? 'active' : ''}" data-group="${g}" type="button" aria-label="Group ${g}">
              <span>${g}</span>
              ${g === selectedGroup ? '<i data-lucide="check" style="width: 14px; height: 14px;"></i>' : ''}
            </button>
          `).join('')}
        </div>

        <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 12px 0 0; line-height: 1.5;">
          ${isAr 
            ? `⚡ تم حفظ اختيارك تلقائياً في المتصفح. يعرض الجدول أدناه مواعيد وعيادات مجموعتك (<b>${selectedGroup}</b>) فقط من الأحد إلى الخميس، بواقع جلستين يومياً.`
            : `⚡ Selection is saved automatically. The schedule below displays only your group's (<b>${selectedGroup}</b>) clinics and practical labs from Sunday to Thursday.`}
        </p>
      </div>

      <!-- Schedule Table or Cards View -->
      ${isTableView ? `
        <div class="exams-table-card card clinical-table-card">
          <div class="table-card-header">
            <div>
              <h2>${isAr ? `جدول عيادات ومعامل المجموعة (${selectedGroup}) — السنة الثالثة` : `Clinical & Lab Schedule — Group (${selectedGroup}) • Year 3`}</h2>
              <p>${isAr ? 'جامعة طرابلس • كلية طب وجراحة الفم والأسنان • العام الجامعي 2026 - 2027' : 'University of Tripoli • Faculty of Dentistry • Academic Year 2026 - 2027'}</p>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="badge badge-primary" style="font-size: 0.8rem; padding: 4px 12px;">${isAr ? `المجموعة: ${selectedGroup}` : `Group: ${selectedGroup}`}</span>
              <div class="print-watermark" style="font-size: 0.8rem; font-weight: 700; color: rgba(255,255,255,0.9);">
                KURO FANGS • CLINICAL
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table class="academia-exam-table clinical-grid-table">
              <thead>
                <tr>
                  <th style="width: 140px; text-align: center;">${isAr ? 'اليوم' : 'Day'}</th>
                  <th style="width: 43%;">${isAr ? 'الفترة الأولى (12:00 م – 1:00 م)' : 'First Slot (12:00 PM – 1:00 PM)'}</th>
                  <th style="width: 43%;">${isAr ? 'الفترة الثانية (1:00 م – 2:00 م)' : 'Second Slot (1:00 PM – 2:00 PM)'}</th>
                </tr>
              </thead>
              <tbody>
                ${weekdays.map(w => {
                  const daySessions = dayMap[w.ar] || [];
                  const s1 = daySessions.find(s => s.time_ar && s.time_ar.includes('12:00')) || daySessions[0];
                  const s2 = daySessions.find(s => s.time_ar && s.time_ar.includes('1:00') && s !== s1) || daySessions[1];

                  const renderSlot = (s) => {
                    if (!s) return `<div style="color: var(--text-muted); font-size: 0.8rem; padding: 12px; text-align: center;">${isAr ? 'فترة راحة' : 'Free Slot'}</div>`;
                    return `
                      <div class="clinical-slot-card" style="border-left: 4px solid ${s.color}; background: ${s.bg};">
                        <div class="clinical-slot-header">
                          <span class="clinical-code-badge" style="background: ${s.color}; color: #FFFFFF;">${s.code}</span>
                          <span class="clinical-time-tag">${isAr ? s.time_ar : s.time_en}</span>
                        </div>
                        <div class="clinical-course-title">
                          ${isAr ? s.course_ar : s.course_en}
                        </div>
                        <div class="clinical-course-sub">
                          ${isAr ? s.course_en : s.course_ar}
                        </div>
                        <div class="clinical-place-tag">
                          <i data-lucide="map-pin" style="width: 13px; height: 13px; color: ${s.color};"></i>
                          <span>${isAr ? s.place_ar : s.place_en}</span>
                        </div>
                      </div>
                    `;
                  };

                  return `
                    <tr>
                      <td class="clinical-day-header-cell">
                        <div class="day-header-content">
                          <span class="day-name-main">${isAr ? w.ar : w.en}</span>
                          <span class="day-name-sub">${isAr ? w.en : w.ar}</span>
                        </div>
                      </td>
                      <td>${renderSlot(s1)}</td>
                      <td>${renderSlot(s2)}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : `
        <!-- Timeline / Day-by-Day Cards View -->
        <div class="clinical-days-stack">
          ${weekdays.map(w => {
            const daySessions = dayMap[w.ar] || [];
            return `
              <div class="clinical-day-card">
                <div class="clinical-day-card-header">
                  <div class="day-badge-title">
                    <i data-lucide="calendar" style="width: 20px; height: 20px; color: var(--brand-primary);"></i>
                    <span>${isAr ? w.ar : w.en}</span>
                    <span style="font-size: 0.8rem; font-weight: 500; color: var(--text-muted);">(${isAr ? w.en : w.ar})</span>
                  </div>
                  <div class="day-theory-hint">
                    ${isAr ? 'المحاضرات النظرية: 8:00 ص – 12:00 م (مدرج 2)' : 'Theory Lectures: 8:00 AM – 12:00 PM (Auditorium 2)'}
                  </div>
                </div>

                <div class="day-sessions-grid">
                  ${daySessions.map(s => `
                    <div class="clinical-slot-card" style="border-left: 4px solid ${s.color}; background: ${s.bg};">
                      <div class="clinical-slot-header">
                        <span class="clinical-code-badge" style="background: ${s.color}; color: #FFFFFF;">${s.code}</span>
                        <span class="clinical-time-tag">${isAr ? s.time_ar : s.time_en}</span>
                      </div>
                      <div class="clinical-course-title">
                        ${isAr ? s.course_ar : s.course_en}
                      </div>
                      <div class="clinical-course-sub">
                        ${isAr ? s.course_en : s.course_ar}
                      </div>
                      <div class="clinical-place-tag">
                        <i data-lucide="map-pin" style="width: 13px; height: 13px; color: ${s.color};"></i>
                        <span>${isAr ? s.place_ar : s.place_en}</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}

      <!-- Bottom Academic Notice -->
      <div class="card" style="padding: 16px 20px; border-radius: 12px; margin-top: 18px; background: var(--bg-hover); border: 1px dashed var(--border-card); display: flex; align-items: flex-start; gap: 12px;">
        <i data-lucide="info" style="color: var(--brand-primary); width: 22px; height: 22px; flex-shrink: 0; margin-top: 2px;"></i>
        <div style="font-size: 0.825rem; color: var(--text-secondary); line-height: 1.5;">
          <b>${isAr ? 'تنبيه أكاديمي موحد:' : 'Academic Schedule Guidelines:'}</b>
          ${isAr 
            ? 'المحاضرات النظرية الموحدة لجميع المجموعات تُعقد صباحاً في مدرج 2 من السبت إلى الخميس (8:00 ص – 12:00 م). تبدأ المعامل والعيادات العملية الخاصة بمجموعتك فوراً في تمام الساعة 12:00 ظهراً.' 
            : 'Unified theoretical lectures for all groups take place in Auditorium 2 Saturday to Thursday (8:00 AM – 12:00 PM). Clinical and lab sessions for your assigned group begin promptly at 12:00 PM.'}
        </div>
      </div>
    `;
  },

  setupPracticalListeners(isAr) {
    const contentArea = document.getElementById('exams-content-area');
    if (!contentArea) return;

    contentArea.querySelectorAll('.btn-group-chip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const group = btn.getAttribute('data-group');
        ExamsPage.setSelectedGroup(group);
        ExamsPage.renderContent(isAr);
        const msg = isAr 
          ? `تم اختيار وعرض جدول المجموعة (${group}) وحفظه بنجاح! 🏥` 
          : `Group (${group}) selected and saved! 🏥`;
        window.showToast(msg, { type: 'success' });
      });
    });
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
        localStorage.setItem('kf_schedule_active_tab', tab);
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
