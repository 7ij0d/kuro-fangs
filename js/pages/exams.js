/**
 * KURO FANGS — SEPARATE DEDICATED SCHEDULE PAGES
 * 1. #/lecture-schedule   -> Dedicated Weekly Theoretical Lectures Timetable (Sunday–Thursday)
 * 2. #/practical-schedule -> Dedicated Practical & Clinical Phantom Lab Schedule (Subgroups A1 to E2)
 * 3. #/exams              -> Dedicated Official Midterm & Final Exams Timetable with Countdown Timers
 */

const ExamsPage = {
  examTab: localStorage.getItem('kf_exam_active_tab') || 'midterm',     // 'midterm' | 'final'
  viewMode: 'table',                                                   // 'table' | 'timeline'
  lectureViewMode: 'table',                                            // 'table' | 'timeline'
  practicalViewMode: 'table',                                          // 'table' | 'timeline'

  getSelectedGroup() {
    return localStorage.getItem('kf_selected_group') || 'A1';
  },

  setSelectedGroup(group) {
    const valid = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2', 'E1', 'E2'];
    const sanitized = valid.includes(group) ? group : 'A1';
    localStorage.setItem('kf_selected_group', sanitized);
    return sanitized;
  },

  // Weekly Theoretical Lectures Timetable (Sunday - Thursday)
  theoryScheduleDays: [
    {
      day_ar: 'الأحد',
      day_en: 'Sunday',
      slots: [
        { time: '08:30 - 10:00', code: 'MS 310', subject_ar: 'الباطنة العامة', subject_en: 'General Medicine', hall_ar: 'المدرج الرئيسي', hall_en: 'Main Auditorium', doctor_ar: 'د. طارق الزاوي', doctor_en: 'Dr. Tarek' },
        { time: '10:15 - 11:45', code: 'DS 341', subject_ar: 'جراحة الفم والوجه والفكين 1', subject_en: 'OMFS I', hall_ar: 'مدرج د. الشريف', hall_en: 'Dr. El-Sherif Hall', doctor_ar: 'د. عبدالسلام الشريف', doctor_en: 'Dr. El-Sherif' },
        { time: '12:00 - 01:30', code: 'DS 321', subject_ar: 'الاستعاضة السنية المتحركة 2', subject_en: 'Removable Pros II', hall_ar: 'القاعة 1', hall_en: 'Hall 1', doctor_ar: 'د. محمد القمودي', doctor_en: 'Dr. El-Gammudi' }
      ]
    },
    {
      day_ar: 'الإثنين',
      day_en: 'Monday',
      slots: [
        { time: '08:30 - 10:00', code: 'DS 311', subject_ar: 'العلاج التحفظي وعلاج الجذور 2', subject_en: 'Cons & Endo II', hall_ar: 'القاعة الكبرى', hall_en: 'Grand Hall', doctor_ar: 'د. منيرة الفيتوري', doctor_en: 'Dr. El-Fituri' },
        { time: '10:15 - 11:45', code: 'DS 380', subject_ar: 'أمراض الفم', subject_en: 'Oral Diseases', hall_ar: 'مدرج أ', hall_en: 'Auditorium A', doctor_ar: 'د. فاطمة الماجري', doctor_en: 'Dr. El-Majri' },
        { time: '12:00 - 01:30', code: 'DS 351', subject_ar: 'أمراض وعلاج اللثة 1', subject_en: 'Periodontology I', hall_ar: 'القاعة 2', hall_en: 'Hall 2', doctor_ar: 'د. وليد البوسيفي', doctor_en: 'Dr. El-Busefi' }
      ]
    },
    {
      day_ar: 'الثلاثاء',
      day_en: 'Tuesday',
      slots: [
        { time: '08:30 - 10:00', code: 'MS 320', subject_ar: 'الجراحة العامة', subject_en: 'General Surgery', hall_ar: 'المدرج الرئيسي', hall_en: 'Main Auditorium', doctor_ar: 'د. خالد الورفلي', doctor_en: 'Dr. El-Warfali' },
        { time: '10:15 - 11:45', code: 'DS 331', subject_ar: 'الاستعاضة السنية الثابتة 2', subject_en: 'Fixed Pros II', hall_ar: 'القاعة 2', hall_en: 'Hall 2', doctor_ar: 'د. عبدالسلام الشريف', doctor_en: 'Dr. El-Sherif' },
        { time: '12:00 - 01:30', code: 'DS 381', subject_ar: 'طب الأسنان الوقائي', subject_en: 'Preventive Dentistry', hall_ar: 'مدرج ب', hall_en: 'Auditorium B', doctor_ar: 'د. إيناس الترهوني', doctor_en: 'Dr. El-Tarhuni' }
      ]
    },
    {
      day_ar: 'الأربعاء',
      day_en: 'Wednesday',
      slots: [
        { time: '08:30 - 10:00', code: 'DS 361', subject_ar: 'طب الفم والتشخيص والأشعة 1', subject_en: 'OMDR I', hall_ar: 'مدرج الأشعة', hall_en: 'Radiology Hall', doctor_ar: 'د. حاتم كشرود', doctor_en: 'Dr. Kashrud' },
        { time: '10:15 - 11:45', code: 'DS 371', subject_ar: 'تقويم الأسنان 1', subject_en: 'Orthodontics I', hall_ar: 'القاعة 3', hall_en: 'Hall 3', doctor_ar: 'د. ريم الفرجاني', doctor_en: 'Dr. El-Ferjani' },
        { time: '12:00 - 01:30', code: 'DS 470', subject_ar: 'طب أسنان الأطفال 1', subject_en: 'Pediatric Dentistry I', hall_ar: 'مدرج الأطفال', hall_en: 'Pedo Hall', doctor_ar: 'د. هدى السويح', doctor_en: 'Dr. El-Sweih' }
      ]
    },
    {
      day_ar: 'الخميس',
      day_en: 'Thursday',
      slots: [
        { time: '09:00 - 12:00', code: 'ACAD 300', subject_ar: 'جلسات المراجعة الأكاديمية والمناقشات السريرية', subject_en: 'Academic Seminars & Clinical Case Review', hall_ar: 'عيادات ومبنى الكلية', hall_en: 'Faculty Clinical Wings', doctor_ar: 'هيئة التدريس', doctor_en: 'Faculty Board' }
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
  // 1. DEDICATED ROUTE: #/lecture-schedule (Weekly Theoretical Lectures Timetable)
  // =========================================================================
  renderLectureSchedule(container, queryParams) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;

    container.innerHTML = `
      <!-- Page Header -->
      <div class="exams-page-header">
        <div class="page-title-group">
          <h1>
            <i data-lucide="book-open" style="color: var(--brand-burgundy); width: 28px; height: 28px;"></i>
            ${isAr ? 'جدول المحاضرات النظري الأسبوعي' : 'Weekly Theoretical Lectures Timetable'}
          </h1>
          <p>${isAr ? 'جدول المواعيد الأسبوعية الثابتة للمحاضرات النظرية بقاعات ومدرجات الكلية الرئيسية (من الأحد إلى الخميس) — السنة الثالثة (2026 - 2027)' : 'Official weekly timetable for theoretical lectures across main faculty auditoriums (Sunday–Thursday) — Year 3 (2026 - 2027)'}</p>
        </div>

        <div class="exams-header-actions no-print">
          <!-- Direct Links to Other Dedicated Schedules -->
          <a href="#/practical-schedule" class="btn btn-secondary btn-sm" style="gap: 6px; font-weight: 700;">
            <i data-lucide="microscope" style="width: 15px; height: 15px;"></i>
            <span>${isAr ? 'جدول المعامل والعملي (A1-E2)' : 'Clinical & Labs (A1-E2)'}</span>
          </a>
          <a href="#/exams" class="btn btn-secondary btn-sm" style="gap: 6px; font-weight: 700;">
            <i data-lucide="calendar" style="width: 15px; height: 15px;"></i>
            <span>${isAr ? 'جدول الامتحانات الرسمية' : 'Official Exams'}</span>
          </a>

          <!-- Print / Save as PDF Button -->
          <button id="btn-print-schedule" class="btn btn-primary btn-print-schedule">
            <i data-lucide="printer"></i>
            <span>${isAr ? 'طباعة / حفظ PDF' : 'Print / Save PDF'}</span>
          </button>
        </div>
      </div>

      <!-- Active Content Container -->
      <div id="lecture-content-area" class="exams-content-area">
        ${ExamsPage.renderTheoryTableView(isAr)}
      </div>

      <!-- Guidelines Notice Card -->
      <div class="card no-print" style="padding: 16px 20px; border-radius: 12px; margin-top: 18px; background: var(--bg-hover); border: 1px dashed var(--border-card); display: flex; align-items: flex-start; gap: 12px;">
        <i data-lucide="info" style="color: var(--brand-burgundy); width: 22px; height: 22px; flex-shrink: 0; margin-top: 2px;"></i>
        <div style="font-size: 0.825rem; color: var(--text-secondary); line-height: 1.5;">
          <b>${isAr ? 'تنبيه أكاديمي موحد بخصوص المحاضرات:' : 'Academic Lecture Guidelines:'}</b>
          ${isAr 
            ? 'الحضور إلزامي بنسبة لا تقل عن 75% لدخول الامتحانات النهائية. تبدأ المحاضرات في أوقاتها المحددة دون تأخير، ويُرجى الالتزام بالهدوء داخل المدرجات والقاعات الأكاديمية.' 
            : 'Attendance of at least 75% is required for exam eligibility. Lectures start strictly on schedule; students are kindly requested to maintain academic discipline in halls.'}
        </div>
      </div>
    `;

    ExamsPage.attachPrintHandler(container);
    if (window.lucide) window.lucide.createIcons();
  },

  renderTheoryTableView(isAr) {
    const title = isAr ? 'جدول المحاضرات النظري الأسبوعي — السنة الثالثة 2026 / 2027' : 'Weekly Theory Lectures Timetable — Year 3 (2026 / 2027)';
    const subtitle = isAr ? 'المواعيد الأسبوعية المعتمدة للمحاضرات النظرية بقاعات ومدرجات كلية طب وجراحة الفم والأسنان' : 'Official weekly timetable for theoretical lectures across main faculty auditoriums';
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
                <th style="width: 140px; text-align: center;">${isAr ? 'التوقيت' : 'Time'}</th>
                <th style="width: 110px; text-align: center;">${isAr ? 'رمز المقرر' : 'Code'}</th>
                <th>${isAr ? 'المادة الدراسية' : 'Course Subject'}</th>
                <th>${isAr ? 'القاعة / المدرج' : 'Hall / Auditorium'}</th>
                <th>${isAr ? 'أستاذ المادة' : 'Lecturer'}</th>
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
                    <td>
                      <span class="badge badge-subtle" style="font-size: 0.775rem; font-weight: 700;">🏛️ ${isAr ? slot.hall_ar : slot.hall_en}</span>
                    </td>
                    <td>
                      <span style="font-size: 0.825rem; font-weight: 600; color: var(--text-secondary);">👨‍🏫 ${isAr ? slot.doctor_ar : slot.doctor_en}</span>
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

  // =========================================================================
  // 2. DEDICATED ROUTE: #/practical-schedule (Practical & Clinical Subgroups A1–E2)
  // =========================================================================
  renderPracticalSchedule(container, queryParams) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;

    if (queryParams?.get('group')) {
      ExamsPage.setSelectedGroup(queryParams.get('group'));
    }

    container.innerHTML = `
      <!-- Page Header -->
      <div class="exams-page-header">
        <div class="page-title-group">
          <h1>
            <i data-lucide="microscope" style="color: #10B981; width: 28px; height: 28px;"></i>
            ${isAr ? 'جدول المعامل والعيادات العملي والسريري' : 'Clinical & Practical Phantom Lab Schedule'}
          </h1>
          <p>${isAr ? 'مواعيد معامل الفانتوم والعيادات السريرية للمجموعات الفرعية الـ 10 (A1 إلى E2) — كلية طب وجراحة الفم والأسنان' : 'Phantom lab and clinical appointments for the 10 student subgroups (A1 to E2) — Faculty of Dentistry'}</p>
        </div>

        <div class="exams-header-actions no-print">
          <!-- Direct Links to Other Schedules -->
          <a href="#/lecture-schedule" class="btn btn-secondary btn-sm" style="gap: 6px; font-weight: 700;">
            <i data-lucide="book-open" style="width: 15px; height: 15px;"></i>
            <span>${isAr ? 'جدول المحاضرات النظري' : 'Theory Lectures'}</span>
          </a>
          <a href="#/exams" class="btn btn-secondary btn-sm" style="gap: 6px; font-weight: 700;">
            <i data-lucide="calendar" style="width: 15px; height: 15px;"></i>
            <span>${isAr ? 'جدول الامتحانات الرسمية' : 'Official Exams'}</span>
          </a>

          <!-- View Toggle -->
          <div class="exams-view-toggle">
            <button id="btn-practical-table" class="view-toggle-btn ${ExamsPage.practicalViewMode === 'table' ? 'active' : ''}" title="${isAr ? 'عرض جدول أسبوعي' : 'Table View'}">
              <i data-lucide="table"></i>
              <span>${isAr ? 'جدول' : 'Table'}</span>
            </button>
            <button id="btn-practical-timeline" class="view-toggle-btn ${ExamsPage.practicalViewMode === 'timeline' ? 'active' : ''}" title="${isAr ? 'عرض بطاقات يومية' : 'Cards View'}">
              <i data-lucide="clock"></i>
              <span>${isAr ? 'بطاقات' : 'Cards'}</span>
            </button>
          </div>

          <!-- Print / Save as PDF Button -->
          <button id="btn-print-schedule" class="btn btn-primary btn-print-schedule">
            <i data-lucide="printer"></i>
            <span>${isAr ? 'طباعة / حفظ PDF' : 'Print / Save PDF'}</span>
          </button>
        </div>
      </div>

      <!-- Active Content Container -->
      <div id="practical-content-area" class="exams-content-area">
        ${ExamsPage.renderPracticalView(isAr)}
      </div>
    `;

    ExamsPage.setupPracticalListeners(isAr);
    ExamsPage.attachPrintHandler(container);

    // Practical view toggle listeners
    const tableBtn = document.getElementById('btn-practical-table');
    const timelineBtn = document.getElementById('btn-practical-timeline');
    if (tableBtn && timelineBtn) {
      tableBtn.addEventListener('click', () => {
        ExamsPage.practicalViewMode = 'table';
        tableBtn.classList.add('active');
        timelineBtn.classList.remove('active');
        const area = document.getElementById('practical-content-area');
        if (area) area.innerHTML = ExamsPage.renderPracticalView(isAr);
        ExamsPage.setupPracticalListeners(isAr);
      });
      timelineBtn.addEventListener('click', () => {
        ExamsPage.practicalViewMode = 'timeline';
        timelineBtn.classList.add('active');
        tableBtn.classList.remove('active');
        const area = document.getElementById('practical-content-area');
        if (area) area.innerHTML = ExamsPage.renderPracticalView(isAr);
        ExamsPage.setupPracticalListeners(isAr);
      });
    }

    if (window.lucide) window.lucide.createIcons();
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
                    ${isAr ? 'المحاضرات النظرية: 8:00 ص – 12:00 م (مدرجات الكلية)' : 'Theory Lectures: 8:00 AM – 12:00 PM (Faculty Halls)'}
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
      <div class="card no-print" style="padding: 16px 20px; border-radius: 12px; margin-top: 18px; background: var(--bg-hover); border: 1px dashed var(--border-card); display: flex; align-items: flex-start; gap: 12px;">
        <i data-lucide="info" style="color: var(--brand-primary); width: 22px; height: 22px; flex-shrink: 0; margin-top: 2px;"></i>
        <div style="font-size: 0.825rem; color: var(--text-secondary); line-height: 1.5;">
          <b>${isAr ? 'تنبيه أكاديمي موحد:' : 'Academic Schedule Guidelines:'}</b>
          ${isAr 
            ? 'المحاضرات النظرية الموحدة لجميع المجموعات تُعقد صباحاً في مدرجات الكلية (8:00 ص – 12:00 م). تبدأ المعامل والعيادات العملية الخاصة بمجموعتك فوراً في تمام الساعة 12:00 ظهراً.' 
            : 'Unified theoretical lectures for all groups take place in faculty auditoriums (8:00 AM – 12:00 PM). Clinical and lab sessions for your assigned group begin promptly at 12:00 PM.'}
        </div>
      </div>
    `;
  },

  setupPracticalListeners(isAr) {
    const contentArea = document.getElementById('practical-content-area');
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
  // 3. DEDICATED ROUTE: #/exams (Official Midterm & Final Exams with Countdown)
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
            ${isAr ? 'جدول الامتحانات الرسمية (النصفي والنهائي)' : 'Official Examination Timetables'}
          </h1>
          <p>${isAr ? 'مواعيد امتحانات النظري النصفي والنهائي مع عداد الأيام التنازلي — السنة الثالثة (2026 - 2027)' : 'Official Midterm and Final theory examination timetables with live days countdown — Year 3 (2026 - 2027)'}</p>
        </div>

        <div class="exams-header-actions no-print">
          <!-- Direct Links to Other Schedules -->
          <a href="#/lecture-schedule" class="btn btn-secondary btn-sm" style="gap: 6px; font-weight: 700;">
            <i data-lucide="book-open" style="width: 15px; height: 15px;"></i>
            <span>${isAr ? 'جدول المحاضرات النظري' : 'Theory Lectures'}</span>
          </a>
          <a href="#/practical-schedule" class="btn btn-secondary btn-sm" style="gap: 6px; font-weight: 700;">
            <i data-lucide="microscope" style="width: 15px; height: 15px;"></i>
            <span>${isAr ? 'جدول المعامل والعملي (A1-E2)' : 'Clinical & Labs (A1-E2)'}</span>
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

      <!-- Exam Dedicated Tabs Bar -->
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

  // Fallback general render function
  render(container, queryParams) {
    const hash = window.location.hash || '';
    if (hash.includes('/lecture-schedule')) {
      return ExamsPage.renderLectureSchedule(container, queryParams);
    }
    if (hash.includes('/practical-schedule')) {
      return ExamsPage.renderPracticalSchedule(container, queryParams);
    }
    return ExamsPage.renderExamsSchedule(container, queryParams);
  }
};

window.ExamsPage = ExamsPage;
