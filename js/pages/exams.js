/**
 * KURO FANGS — ACADEMIC SCHEDULES & EXAM TIMETABLES
 * 
 * Section 1: Weekly Academic Schedules (#/lecture-schedule)
 *   - Theoretical Tab: Official 6-day lecture matrix (Saturday–Thursday in Auditorium 2)
 *   - Practical Tab: Practical/clinical lab schedules with group selector (A1 to E2)
 * 
 * Section 2: Official Exam Schedules (#/exams)
 *   - Midterm (12 subjects) & Final (3 subjects) Timetables with countdown timers & PDF export
 */

const ExamsPage = {
  academicTab: localStorage.getItem('kf_academic_active_tab') || 'theory', // 'theory' | 'practical'
  examTab: localStorage.getItem('kf_exam_active_tab') || 'midterm',         // 'midterm' | 'final'
  viewMode: 'table',                                                       // 'table' | 'timeline'
  practicalViewMode: 'table',                                              // 'table' | 'timeline'

  getSelectedGroup() {
    return localStorage.getItem('kf_selected_group') || 'A1';
  },

  setSelectedGroup(group) {
    const valid = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2', 'E1', 'E2'];
    const sanitized = valid.includes(group) ? group : 'A1';
    localStorage.setItem('kf_selected_group', sanitized);
    return sanitized;
  },

  // Official Weekly Theoretical Lectures Timetable (Official Faculty of Dentistry Schedule)
  theoryScheduleDays: [
    {
      day_ar: 'السبت', day_en: 'Saturday',
      slots: [
        { time: '08:00 - 10:00', code: 'MS310', subject_ar: 'الباطنة العامة', subject_en: 'General Medicine', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2' },
        { time: '10:00 - 12:00', code: 'MS320', subject_ar: 'الجراحة العامة', subject_en: 'General Surgery', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2' }
      ]
    },
    {
      day_ar: 'الأحد', day_en: 'Sunday',
      slots: [
        { time: '08:00 - 10:00', code: 'DS331', subject_ar: 'الاستعاضة السنية الثابتة 2', subject_en: 'Fixed Prosthodontics II', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2' },
        { time: '10:00 - 12:00', code: 'DS341', subject_ar: 'جراحة الفم والوجه والفكين 1', subject_en: 'OMFS I', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2' }
      ]
    },
    {
      day_ar: 'الإثنين', day_en: 'Monday',
      slots: [
        { time: '08:00 - 10:00', code: 'DS380', subject_ar: 'أمراض الفم', subject_en: 'Oral Pathology', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2' },
        { time: '10:00 - 12:00', code: 'DS351', subject_ar: 'أمراض وعلاج اللثة 1', subject_en: 'Periodontology I', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2' }
      ]
    },
    {
      day_ar: 'الثلاثاء', day_en: 'Tuesday',
      slots: [
        { time: '08:00 - 10:00', code: 'DS381', subject_ar: 'طب الأسنان الوقائي', subject_en: 'Preventive Dentistry', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2' },
        { time: '10:00 - 12:00', code: 'DS361', subject_ar: 'طب الفم والتشخيص والأشعة 1', subject_en: 'OMDR I', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2' }
      ]
    },
    {
      day_ar: 'الأربعاء', day_en: 'Wednesday',
      slots: [
        { time: '08:00 - 10:00', code: 'DS311', subject_ar: 'العلاج التحفظي وعلاج الجذور 2', subject_en: 'Cons & Endo II', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2' },
        { time: '10:00 - 12:00', code: 'DS371', subject_ar: 'تقويم الأسنان 1', subject_en: 'Orthodontics I', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2' },
        { time: '02:00 - 04:00', code: 'DS380', subject_ar: 'أمراض الفم (المحاضرة 2)', subject_en: 'Oral Pathology (Lecture 2)', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2' }
      ]
    },
    {
      day_ar: 'الخميس', day_en: 'Thursday',
      slots: [
        { time: '08:00 - 10:00', code: 'DS321', subject_ar: 'الاستعاضة السنية المتحركة 2', subject_en: 'Removable Prosthodontics II', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2' },
        { time: '10:00 - 12:00', code: 'DS470', subject_ar: 'طب أسنان الأطفال 1', subject_en: 'Pediatric Dentistry I', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2' }
      ]
    }
  ],

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
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    const examDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  },

  // =========================================================================
  // SECTION 1: WEEKLY ACADEMIC SCHEDULES (Theory + Practical with Group Selector)
  // =========================================================================
  renderAcademicSchedules(container, queryParams) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;

    if (queryParams?.get('tab')) {
      const t = queryParams.get('tab');
      if (['theory', 'practical'].includes(t)) {
        ExamsPage.academicTab = t;
      }
    }
    if (queryParams?.get('group')) {
      ExamsPage.setSelectedGroup(queryParams.get('group'));
    }

    container.innerHTML = `
      <!-- Page Header -->
      <div class="exams-page-header">
        <div class="page-title-group">
          <h1>
            <i data-lucide="book-open" style="color: var(--brand-burgundy); width: 28px; height: 28px;"></i>
            ${isAr ? 'الجداول الدراسية (نظري وعملي)' : 'Weekly Academic Schedules (Theory & Practical)'}
          </h1>
          <p>${isAr ? 'جدول المحاضرات النظرية بمدرج 2 بالكلية وجدول المعامل والعيادات العملي والسريري للمجموعات الفرعية الـ 10 (A1 إلى E2)' : 'Auditorium 2 theoretical lecture matrix and practical/clinical lab schedule for the 10 student subgroups (A1 to E2)'}</p>
        </div>

        <div class="exams-header-actions no-print">
          <!-- Link to Section 2: Official Exams Schedule -->
          <a href="#/exams" class="btn btn-secondary btn-sm" style="gap: 6px; font-weight: 700;">
            <i data-lucide="calendar" style="width: 15px; height: 15px;"></i>
            <span>${isAr ? 'جداول الامتحانات الرسمية' : 'Official Exam Schedules'}</span>
          </a>

          <!-- Print / Save as PDF Button -->
          <button id="btn-print-schedule" class="btn btn-primary btn-print-schedule">
            <i data-lucide="printer"></i>
            <span>${isAr ? 'طباعة / حفظ PDF' : 'Print / Save PDF'}</span>
          </button>
        </div>
      </div>

      <!-- Section 1 Academic Tabs Bar -->
      <div class="schedule-tabs-bar no-print">
        <button class="schedule-tab-btn ${ExamsPage.academicTab === 'theory' ? 'active' : ''}" data-academic-tab="theory">
          <i data-lucide="book-open"></i>
          <span>${isAr ? 'جدول المحاضرات النظري الأسبوعي' : 'Theoretical Lectures Matrix'}</span>
          <span class="tab-count-pill" style="background: var(--brand-burgundy); color: #fff;">${isAr ? 'مدرج 2 • السبت-الخميس' : 'Auditorium 2 • Sat-Thu'}</span>
        </button>

        <button class="schedule-tab-btn ${ExamsPage.academicTab === 'practical' ? 'active' : ''}" data-academic-tab="practical">
          <i data-lucide="microscope"></i>
          <span>${isAr ? 'جدول المعامل والعيادات العملي/السريري' : 'Clinical & Lab Schedule'}</span>
          <span class="tab-count-pill" style="background: #10B981; color: #FFFFFF; font-weight: 800;">A1–E2</span>
        </button>
      </div>

      <!-- Active Content Container -->
      <div id="academic-content-area" class="exams-content-area"></div>
    `;

    ExamsPage.renderAcademicTabContent(isAr);
    ExamsPage.setupAcademicTabListeners(container, isAr);
    ExamsPage.attachPrintHandler(container);

    if (window.lucide) window.lucide.createIcons();
  },

  renderAcademicTabContent(isAr) {
    const contentArea = document.getElementById('academic-content-area');
    if (!contentArea) return;

    if (ExamsPage.academicTab === 'practical') {
      contentArea.innerHTML = ExamsPage.renderPracticalView(isAr);
      ExamsPage.setupPracticalListeners(isAr);
    } else {
      contentArea.innerHTML = `
        ${ExamsPage.renderTheoryTableView(isAr)}
        <!-- Attendance & Auditorium Notice -->
        <div class="card no-print" style="padding: 16px 20px; border-radius: 12px; margin-top: 18px; background: var(--bg-hover); border: 1px dashed var(--border-card); display: flex; align-items: flex-start; gap: 12px;">
          <i data-lucide="info" style="color: var(--brand-burgundy); width: 22px; height: 22px; flex-shrink: 0; margin-top: 2px;"></i>
          <div style="font-size: 0.825rem; color: var(--text-secondary); line-height: 1.5;">
            <b>${isAr ? 'تنبيه أكاديمي موحد بالمحاضرات النظرية:' : 'Academic Lecture Guidelines:'}</b>
            ${isAr 
              ? 'تُعقد كافة المحاضرات النظرية الموحدة في <b>مدرج 2</b> من السبت إلى الخميس (8:00 ص – 12:00 م). الحضور إلزامي بنسبة لا تقل عن 75% لدخول الامتحانات النهائية.' 
              : 'All unified theoretical lectures take place in <b>Auditorium 2</b> Saturday through Thursday (8:00 AM – 12:00 PM). Minimum 75% attendance is required for exam entry.'}
          </div>
        </div>
      `;
    }

    if (window.lucide) window.lucide.createIcons();
  },

  setupAcademicTabListeners(container, isAr) {
    container.querySelectorAll('[data-academic-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-academic-tab');
        ExamsPage.academicTab = tab;
        localStorage.setItem('kf_academic_active_tab', tab);
        container.querySelectorAll('[data-academic-tab]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        ExamsPage.renderAcademicTabContent(isAr);
      });
    });
  },

  renderTheoryTableView(isAr) {
    const title = isAr ? 'جدول المحاضرات النظري الأسبوعي — مدرج 2 (2026 / 2027)' : 'Weekly Theory Lectures Timetable — Auditorium 2 (2026 / 2027)';
    const subtitle = isAr ? 'المواعيد الأسبوعية المعتمدة للمحاضرات النظرية بمدرج 2 بكلية طب وجراحة الفم والأسنان' : 'Official weekly timetable for theoretical lectures in Auditorium 2';
    const scheduleDays = ExamsPage.theoryScheduleDays;

    return `
      <div class="exams-table-card card">
        <div class="table-card-header">
          <div>
            <h2>📚 ${title}</h2>
            <p>${subtitle}</p>
          </div>
          <div class="print-watermark">KURO FANGS • THEORETICAL LECTURE SCHEDULE</div>
        </div>

        <div class="table-responsive" style="margin-top: 14px;">
          <table class="academia-exam-table">
            <thead>
              <tr>
                <th style="width: 130px; text-align: center;">${isAr ? 'اليوم' : 'Day'}</th>
                <th style="width: 150px; text-align: center;">${isAr ? 'التوقيت' : 'Time'}</th>
                <th style="width: 110px; text-align: center;">${isAr ? 'رمز المقرر' : 'Code'}</th>
                <th>${isAr ? 'المادة الدراسية' : 'Course Subject'}</th>
                <th style="width: 150px; text-align: center;">${isAr ? 'المدرج' : 'Auditorium'}</th>
              </tr>
            </thead>
            <tbody>
              ${scheduleDays.map(dayObj => {
                return dayObj.slots.map((slot, sIdx) => `
                  <tr>
                    ${sIdx === 0 ? `
                      <td rowspan="${dayObj.slots.length}" style="font-weight: 800; background: var(--bg-hover); vertical-align: middle; text-align: center; border-left: 3px solid var(--brand-burgundy);">
                        <div style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary);">${isAr ? dayObj.day_ar : dayObj.day_en}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">${isAr ? dayObj.day_en : dayObj.day_ar}</div>
                      </td>
                    ` : ''}
                    <td style="font-weight: 700; direction: ltr; text-align: center;">
                      <span class="exam-time-badge">
                        <i data-lucide="clock" style="width: 13px; height: 13px;"></i>
                        ${slot.time}
                      </span>
                    </td>
                    <td style="text-align: center;">
                      <span class="course-code-pill">${slot.code}</span>
                    </td>
                    <td style="font-weight: 700; color: var(--text-primary);">
                      <div class="subject-name-cell">
                        <span class="subject-primary-name">${isAr ? slot.subject_ar : slot.subject_en}</span>
                        <span class="subject-sub-name">${isAr ? slot.subject_en : slot.subject_ar}</span>
                      </div>
                    </td>
                    <td style="text-align: center;">
                      <span class="badge badge-subtle" style="font-size: 0.8rem; font-weight: 700; color: var(--brand-burgundy); background: var(--bg-surface-subtle); border: 1px solid var(--border-subtle); padding: 4px 12px; border-radius: 20px;">
                        🏛️ ${isAr ? slot.hall_ar : slot.hall_en}
                      </span>
                    </td>
                  </tr>
                `).join('');
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

    const dayMap = {};
    weekdays.forEach(w => { dayMap[w.ar] = []; });
    groupSessions.forEach(s => {
      if (dayMap[s.day_ar]) {
        dayMap[s.day_ar].push(s);
      }
    });

    const isTableView = ExamsPage.practicalViewMode !== 'timeline';

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

      <!-- Schedule Table View -->
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

      <!-- Bottom Academic Notice -->
      <div class="card no-print" style="padding: 16px 20px; border-radius: 12px; margin-top: 18px; background: var(--bg-hover); border: 1px dashed var(--border-card); display: flex; align-items: flex-start; gap: 12px;">
        <i data-lucide="info" style="color: var(--brand-primary); width: 22px; height: 22px; flex-shrink: 0; margin-top: 2px;"></i>
        <div style="font-size: 0.825rem; color: var(--text-secondary); line-height: 1.5;">
          <b>${isAr ? 'تنبيه أكاديمي موحد:' : 'Academic Schedule Guidelines:'}</b>
          ${isAr 
            ? 'تبدأ المعامل والعيادات العملية الخاصة بمجموعتك فوراً في تمام الساعة 12:00 ظهراً بعد انتهاء المحاضرات النظرية الصباحية بمدرج 2.' 
            : 'Clinical and lab sessions for your assigned group begin promptly at 12:00 PM following the morning theoretical lectures in Auditorium 2.'}
        </div>
      </div>
    `;
  },

  setupPracticalListeners(isAr) {
    const contentArea = document.getElementById('academic-content-area');
    if (!contentArea) return;

    contentArea.querySelectorAll('.btn-group-chip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const group = btn.getAttribute('data-group');
        ExamsPage.setSelectedGroup(group);
        contentArea.innerHTML = ExamsPage.renderPracticalView(isAr);
        ExamsPage.setupPracticalListeners(isAr);
        if (window.lucide) window.lucide.createIcons();
        const msg = isAr 
          ? `تم اختيار وعرض جدول المجموعة (${group}) وحفظه بنجاح! 🏥` 
          : `Group (${group}) selected and saved! 🏥`;
        if (typeof window.showToast === 'function') {
          window.showToast(msg, { type: 'success' });
        }
      });
    });

    if (window.lucide) window.lucide.createIcons();
  },

  // =========================================================================
  // SECTION 2: OFFICIAL EXAM SCHEDULES (Midterm & Final)
  // =========================================================================
  renderExamsSchedule(container, queryParams) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;

    if (queryParams?.get('tab')) {
      const t = queryParams.get('tab');
      if (['midterm', 'final'].includes(t)) {
        ExamsPage.examTab = t;
      }
    }

    container.innerHTML = `
      <!-- Page Header -->
      <div class="exams-page-header">
        <div class="page-title-group">
          <h1>
            <i data-lucide="calendar" style="color: var(--brand-burgundy); width: 28px; height: 28px;"></i>
            ${isAr ? 'جداول الامتحانات الرسمية' : 'Official Examination Timetables'}
          </h1>
          <p>${isAr ? 'مواعيد امتحانات النظري النصفي (12 مادة) والنهائي (3 مواد) مع عداد الأيام التنازلي وتصدير PDF — السنة الثالثة' : 'Official Midterm (12 subjects) & Final (3 subjects) theory examination timetables with live days countdown & PDF export'}</p>
        </div>

        <div class="exams-header-actions no-print">
          <!-- Link to Section 1: Academic Schedules -->
          <a href="#/lecture-schedule" class="btn btn-secondary btn-sm" style="gap: 6px; font-weight: 700;">
            <i data-lucide="book-open" style="width: 15px; height: 15px;"></i>
            <span>${isAr ? 'الجداول الدراسية (نظري وعملي)' : 'Academic Schedules'}</span>
          </a>

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

      <!-- Exam Sub-Tabs Bar -->
      <div class="schedule-tabs-bar no-print">
        <button class="schedule-tab-btn ${ExamsPage.examTab === 'midterm' ? 'active' : ''}" data-exam-tab="midterm">
          <i data-lucide="file-text"></i>
          <span>${isAr ? 'جدول الامتحانات النصفي (Midterm)' : 'Midterm Theory Exams'}</span>
          <span class="tab-count-pill" style="background: var(--brand-burgundy); color: #fff;">12 ${isAr ? 'مادة' : 'Subjects'}</span>
        </button>

        <button class="schedule-tab-btn ${ExamsPage.examTab === 'final' ? 'active' : ''}" data-exam-tab="final">
          <i data-lucide="award"></i>
          <span>${isAr ? 'جدول الامتحانات النهائي (الفاينل)' : 'Final Theory Exams'}</span>
          <span class="tab-count-pill" style="background: #DC2626; color: #fff;">3 ${isAr ? 'مواد' : 'Subjects'}</span>
        </button>
      </div>

      <!-- Active Content Container -->
      <div id="exams-content-area" class="exams-content-area"></div>
    `;

    ExamsPage.renderExamTabContent(isAr);
    ExamsPage.setupExamListeners(container, isAr);
    ExamsPage.attachPrintHandler(container);

    if (window.lucide) window.lucide.createIcons();
  },

  renderExamTabContent(isAr) {
    const contentArea = document.getElementById('exams-content-area');
    if (!contentArea) return;

    if (ExamsPage.examTab === 'final') {
      contentArea.innerHTML = ExamsPage.renderFinalView(isAr);
    } else {
      contentArea.innerHTML = ExamsPage.renderMidtermView(isAr);
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

  setupExamListeners(container, isAr) {
    // Exam Sub-tab switching
    container.querySelectorAll('[data-exam-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-exam-tab');
        ExamsPage.examTab = tab;
        localStorage.setItem('kf_exam_active_tab', tab);
        container.querySelectorAll('[data-exam-tab]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        ExamsPage.renderExamTabContent(isAr);
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
        ExamsPage.renderExamTabContent(isAr);
      });

      timelineBtn.addEventListener('click', () => {
        ExamsPage.viewMode = 'timeline';
        timelineBtn.classList.add('active');
        tableBtn.classList.remove('active');
        ExamsPage.renderExamTabContent(isAr);
      });
    }
  },

  attachPrintHandler(container) {
    const printBtn = container.querySelector('#btn-print-schedule');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        if (typeof window.clearToasts === 'function') {
          window.clearToasts();
        }
        const toastContainer = document.getElementById('toast-container');
        if (toastContainer) {
          toastContainer.style.display = 'none';
        }
        setTimeout(() => {
          window.print();
          setTimeout(() => {
            if (toastContainer) toastContainer.style.display = '';
          }, 500);
        }, 300);
      });
    }
  },

  // Aliases for compatibility
  renderLectureSchedule(container, queryParams) {
    return ExamsPage.renderAcademicSchedules(container, queryParams);
  },

  renderPracticalSchedule(container, queryParams) {
    ExamsPage.academicTab = 'practical';
    return ExamsPage.renderAcademicSchedules(container, queryParams);
  },

  // Fallback general render function
  render(container, queryParams) {
    const hash = window.location.hash || '';
    if (hash.includes('/exams') || hash.includes('/calculator')) {
      return ExamsPage.renderExamsSchedule(container, queryParams);
    }
    if (hash.includes('/practical-schedule')) {
      ExamsPage.academicTab = 'practical';
    }
    return ExamsPage.renderAcademicSchedules(container, queryParams);
  }
};

window.ExamsPage = ExamsPage;
