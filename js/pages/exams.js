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
  theoryViewMode: localStorage.getItem('kf_theory_view_mode') || 'matrix', // 'matrix' | 'timeline'
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

  // Official Weekly Theoretical Schedule Matrix (Tripoli Dental Faculty Official Portal: tables.dentaluot.com)
  theoryScheduleMatrix: [
    {
      day_ar: 'السبت',
      day_en: 'Saturday',
      slots: {
        slot1: { code: 'MS310', course_ar: 'الباطنة العامة', course_en: 'General Medicine', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', time: '08:00 - 10:00', color: '#0284C7' },
        slot2: { code: 'MS320', course_ar: 'الجراحة العامة', course_en: 'General Surgery', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', time: '10:00 - 12:00', color: '#2563EB' },
        slot3: null,
        slot4: null
      }
    },
    {
      day_ar: 'الأحد',
      day_en: 'Sunday',
      slots: {
        slot1: { code: 'DS331', course_ar: 'الاستعاضة السنية الثابتة 2', course_en: 'Fixed Prosthodontics II', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', time: '08:00 - 10:00', color: '#0D9488' },
        slot2: { code: 'DS341', course_ar: 'جراحة الفم والوجه والفكين 1', course_en: 'OMFS I', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', time: '10:00 - 12:00', color: '#059669' },
        slot3: null,
        slot4: null
      }
    },
    {
      day_ar: 'الإثنين',
      day_en: 'Monday',
      slots: {
        slot1: { code: 'DS380', course_ar: 'أمراض الفم', course_en: 'Oral Pathology', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', time: '08:00 - 10:00', color: '#D97706' },
        slot2: { code: 'DS351', course_ar: 'أمراض وعلاج اللثة 1', course_en: 'Periodontology I', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', time: '10:00 - 12:00', color: '#C2410C' },
        slot3: null,
        slot4: null
      }
    },
    {
      day_ar: 'الثلاثاء',
      day_en: 'Tuesday',
      slots: {
        slot1: { code: 'DS381', course_ar: 'طب الأسنان الوقائي', course_en: 'Preventive Dentistry', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', time: '08:00 - 10:00', color: '#CA8A04' },
        slot2: { code: 'DS361', course_ar: 'طب الفم والتشخيص والأشعة 1', course_en: 'Oral Diagnosis & Radiology I', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', time: '10:00 - 12:00', color: '#EAB308' },
        slot3: null,
        slot4: null
      }
    },
    {
      day_ar: 'الأربعاء',
      day_en: 'Wednesday',
      slots: {
        slot1: { code: 'DS311', course_ar: 'العلاج التحفظي وعلاج الجذور 2', course_en: 'Cons & Endo II', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', time: '08:00 - 10:00', color: '#DB2777' },
        slot2: { code: 'DS371', course_ar: 'تقويم الأسنان 1', course_en: 'Orthodontics I', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', time: '10:00 - 12:00', color: '#9333EA' },
        slot3: null,
        slot4: { code: 'DS380', course_ar: 'أمراض الفم (المحاضرة 2)', course_en: 'Oral Pathology (Lecture 2)', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', time: '02:00 - 04:00', color: '#D97706' }
      }
    },
    {
      day_ar: 'الخميس',
      day_en: 'Thursday',
      slots: {
        slot1: { code: 'DS321', course_ar: 'الاستعاضة السنية المتحركة 2', course_en: 'Removable Prosthodontics II', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', time: '08:00 - 10:00', color: '#7C3AED' },
        slot2: { code: 'DS470', course_ar: 'طب أسنان الأطفال 1', course_en: 'Pediatric Dentistry I', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', time: '10:00 - 12:00', color: '#16A34A' },
        slot3: null,
        slot4: null
      }
    }
  ],

  // Official Weekly Theoretical Lectures Timetable (Official Faculty of Dentistry Schedule)
  theoryScheduleDays: [
    {
      day_ar: 'السبت', day_en: 'Saturday',
      slots: [
        { time: '08:00 - 10:00', code: 'MS310', subject_ar: 'الباطنة العامة', subject_en: 'General Medicine', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#0284C7' },
        { time: '10:00 - 12:00', code: 'MS320', subject_ar: 'الجراحة العامة', subject_en: 'General Surgery', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#2563EB' }
      ]
    },
    {
      day_ar: 'الأحد', day_en: 'Sunday',
      slots: [
        { time: '08:00 - 10:00', code: 'DS331', subject_ar: 'الاستعاضة السنية الثابتة 2', subject_en: 'Fixed Prosthodontics II', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#0D9488' },
        { time: '10:00 - 12:00', code: 'DS341', subject_ar: 'جراحة الفم والوجه والفكين 1', subject_en: 'OMFS I', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#059669' }
      ]
    },
    {
      day_ar: 'الإثنين', day_en: 'Monday',
      slots: [
        { time: '08:00 - 10:00', code: 'DS380', subject_ar: 'أمراض الفم', subject_en: 'Oral Pathology', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#D97706' },
        { time: '10:00 - 12:00', code: 'DS351', subject_ar: 'أمراض وعلاج اللثة 1', subject_en: 'Periodontology I', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#C2410C' }
      ]
    },
    {
      day_ar: 'الثلاثاء', day_en: 'Tuesday',
      slots: [
        { time: '08:00 - 10:00', code: 'DS381', subject_ar: 'طب الأسنان الوقائي', subject_en: 'Preventive Dentistry', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#CA8A04' },
        { time: '10:00 - 12:00', code: 'DS361', subject_ar: 'طب الفم والتشخيص والأشعة 1', subject_en: 'Oral Diagnosis & Radiology I', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#EAB308' }
      ]
    },
    {
      day_ar: 'الأربعاء', day_en: 'Wednesday',
      slots: [
        { time: '08:00 - 10:00', code: 'DS311', subject_ar: 'العلاج التحفظي وعلاج الجذور 2', subject_en: 'Cons & Endo II', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#DB2777' },
        { time: '10:00 - 12:00', code: 'DS371', subject_ar: 'تقويم الأسنان 1', subject_en: 'Orthodontics I', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#9333EA' },
        { time: '02:00 - 04:00', code: 'DS380', subject_ar: 'أمراض الفم (المحاضرة 2)', subject_en: 'Oral Pathology (Lecture 2)', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#D97706' }
      ]
    },
    {
      day_ar: 'الخميس', day_en: 'Thursday',
      slots: [
        { time: '08:00 - 10:00', code: 'DS321', subject_ar: 'الاستعاضة السنية المتحركة 2', subject_en: 'Removable Prosthodontics II', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#7C3AED' },
        { time: '10:00 - 12:00', code: 'DS470', subject_ar: 'طب أسنان الأطفال 1', subject_en: 'Pediatric Dentistry I', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#16A34A' }
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

  // Parse Month and Day for Blueprint Date Blocks
  getMonthDay(dateStr, isAr) {
    const parts = (dateStr || '').split('/');
    if (parts.length < 3) return { month: '', day: dateStr || '' };
    const monthNum = parseInt(parts[1], 10);
    const day = parts[2];
    const monthsEn = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthsAr = ['', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    return {
      month: isAr ? monthsAr[monthNum] : monthsEn[monthNum],
      day: day
    };
  },

  // =========================================================================
  // SECTION 0: UNIFIED ACADEMIC SCHEDULES HUB (#/schedules)
  // =========================================================================
  renderSchedulesHub(container, queryParams) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;

    container.innerHTML = `
      <div class="schedules-hub-container">
        <!-- 1. Panoramic Top Banner (Blueprint Fidelity) -->
        <section class="schedules-hub-hero" aria-label="Academic Schedules Banner">
          <div class="schedules-hero-card">
            <div class="schedules-hero-bg-artwork" style="background-image: url('assets/hero/academic-schedules-hero.png');"></div>
            <div class="schedules-hero-overlay"></div>
            <div class="schedules-hero-content" dir="${isAr ? 'rtl' : 'ltr'}">
              <div class="schedules-hero-badge-wrap">
                <div class="schedules-hero-badge-icon-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
              </div>
              <h1 class="schedules-hero-title">${isAr ? 'الجداول الدراسية الأكاديمية' : 'Academic Schedules'}</h1>
              <p class="schedules-hero-subtitle">${isAr ? 'كل جداولك ومواعيدك الأكاديمية في مكان واحد.' : 'All your academic timetables in one place.'}</p>
              <p class="schedules-hero-desc">${isAr ? 'جداول المحاضرات، المعامل والعيادات، والامتحانات الرسمية.' : 'Lecture schedules, clinical & lab schedules, and examination timetables.'}</p>
            </div>
          </div>
        </section>

        <!-- 2. Three Distinct Schedule Cards Grid -->
        <section class="schedules-hub-grid-section" aria-label="Schedules Categories">
          <div class="schedules-cards-grid">
            
            <!-- Card 1: Theoretical Lectures -->
            <div class="sched-card sched-card-theory" onclick="location.hash='#/lecture-schedule'">
              <div class="sched-card-main">
                <div class="sched-card-header">
                  <div class="sched-card-icon-box icon-theory">
                    <i data-lucide="book-open"></i>
                  </div>
                  <div class="sched-card-title-group">
                    <h2 class="sched-card-heading">${isAr ? 'المحاضرات النظرية' : 'Theoretical Lectures'}</h2>
                    <div class="sched-card-pill pill-burgundy">
                      <span>${isAr ? 'مدرج 2' : 'Auditorium 2'}</span>
                    </div>
                  </div>
                </div>

                <div class="sched-card-body">
                  <p class="sched-card-summary">
                    ${isAr ? 'الجدول الأسبوعي للمحاضرات النظرية لكافة المواد.<br>من السبت إلى الخميس.' : 'Weekly lecture timetable for all subjects.<br>Saturday to Thursday.'}
                  </p>
                </div>

                <div class="sched-card-footer">
                  <a href="#/lecture-schedule" class="sched-card-cta cta-burgundy">
                    <span>${isAr ? 'فتح الجدول' : 'Open Schedule'}</span>
                    <i data-lucide="${isAr ? 'arrow-left' : 'arrow-right'}"></i>
                  </a>
                  <div class="sched-circle-arrow circle-burgundy">
                    <i data-lucide="${isAr ? 'arrow-left' : 'arrow-right'}"></i>
                  </div>
                </div>
              </div>

              <div class="sched-card-artwork-box">
                <img
                  src="assets/schedules/kuro-theory-lectures.png"
                  alt="${isAr ? 'المحاضرات النظرية' : 'Theoretical Lectures'}"
                  class="sched-card-kuro-img kuro-theory"
                  loading="lazy"
                />
              </div>
            </div>

            <!-- Card 2: Clinical & Lab Schedule -->
            <div class="sched-card sched-card-clinical" onclick="location.hash='#/practical-schedule'">
              <div class="sched-card-main">
                <div class="sched-card-header">
                  <div class="sched-card-icon-box icon-clinical">
                    <i data-lucide="flask-conical"></i>
                  </div>
                  <div class="sched-card-title-group">
                    <h2 class="sched-card-heading">${isAr ? 'جدول المعامل والعيادات العملي' : 'Clinical & Lab Schedule'}</h2>
                    <div class="sched-card-pill pill-emerald">
                      <span>${isAr ? 'المجموعات A1 – E2' : 'Groups A1 - E2'}</span>
                    </div>
                  </div>
                </div>

                <div class="sched-card-body">
                  <p class="sched-card-summary">
                    ${isAr ? 'جلسات المعامل، المحاكاة، والعيادات السريرية لجميع المجموعات الفرعية.' : 'Practical sessions, clinics and labs for all student subgroups.'}
                  </p>
                </div>

                <div class="sched-card-footer">
                  <a href="#/practical-schedule" class="sched-card-cta cta-emerald">
                    <span>${isAr ? 'فتح الجدول' : 'Open Schedule'}</span>
                    <i data-lucide="${isAr ? 'arrow-left' : 'arrow-right'}"></i>
                  </a>
                  <div class="sched-circle-arrow circle-emerald">
                    <i data-lucide="${isAr ? 'arrow-left' : 'arrow-right'}"></i>
                  </div>
                </div>
              </div>

              <div class="sched-card-artwork-box">
                <img
                  src="assets/schedules/kuro-clinical-lab.png"
                  alt="${isAr ? 'المعامل والعيادات' : 'Clinical & Lab Schedule'}"
                  class="sched-card-kuro-img kuro-clinical"
                  loading="lazy"
                />
              </div>
            </div>

            <!-- Card 3: Examination Schedule -->
            <div class="sched-card sched-card-exams" onclick="location.hash='#/exams'">
              <div class="sched-card-main">
                <div class="sched-card-header">
                  <div class="sched-card-icon-box icon-exams">
                    <i data-lucide="file-text"></i>
                  </div>
                  <div class="sched-card-title-group">
                    <h2 class="sched-card-heading">${isAr ? 'جداول الامتحانات الرسمية' : 'Examination Schedule'}</h2>
                    <div class="sched-card-pill pill-amber">
                      <span>${isAr ? 'النصفي والنهائي' : 'Midterm & Final'}</span>
                    </div>
                  </div>
                </div>

                <div class="sched-card-body">
                  <p class="sched-card-summary">
                    ${isAr ? 'جداول الامتحانات النظرية النصفية والنهائية لكافة المواد الدراسية.' : 'Official theory examination timetables for all subjects.'}
                  </p>
                </div>

                <div class="sched-card-footer">
                  <a href="#/exams" class="sched-card-cta cta-amber">
                    <span>${isAr ? 'فتح الجدول' : 'Open Schedule'}</span>
                    <i data-lucide="${isAr ? 'arrow-left' : 'arrow-right'}"></i>
                  </a>
                  <div class="sched-circle-arrow circle-amber">
                    <i data-lucide="${isAr ? 'arrow-left' : 'arrow-right'}"></i>
                  </div>
                </div>
              </div>

              <div class="sched-card-artwork-box">
                <img
                  src="assets/schedules/kuro-exams-board.png"
                  alt="${isAr ? 'جداول الامتحانات' : 'Examination Schedule'}"
                  class="sched-card-kuro-img kuro-exams"
                  loading="lazy"
                />
              </div>
            </div>

          </div>
        </section>
      </div>
    `;

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  },

  // =========================================================================
  // SECTION 1: WEEKLY ACADEMIC SCHEDULES (Theory + Practical with Group Selector)
  // Visual Reference: media_1790292241824.jpg
  // =========================================================================
  renderAcademicSchedules(container, queryParams) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;

    // Detect tab from hash or query parameters
    const hash = window.location.hash || '';
    if (hash.includes('/practical-schedule')) {
      ExamsPage.academicTab = 'practical';
    } else if (hash.includes('/lecture-schedule')) {
      ExamsPage.academicTab = 'theory';
    } else if (queryParams?.get('tab')) {
      const t = queryParams.get('tab');
      if (['theory', 'practical'].includes(t)) {
        ExamsPage.academicTab = t;
      }
    }
    if (queryParams?.get('group')) {
      ExamsPage.setSelectedGroup(queryParams.get('group'));
    }

    const isTheory = ExamsPage.academicTab === 'theory';

    container.innerHTML = `
      <div class="schedules-subpage-container" dir="${isAr ? 'rtl' : 'ltr'}">
        <!-- Back Navigation Bar -->
        <div class="schedules-top-back-bar no-print">
          <a href="#/schedules" class="sched-back-pill" data-title="Back to Academic Schedules">
            <i data-lucide="${isAr ? 'arrow-right' : 'arrow-left'}"></i>
            <span>${isAr ? 'الرجوع للجداول الدراسية' : 'Back to Schedules'}</span>
          </a>
        </div>

        <!-- Page Header -->
        <div class="sched-page-header">
          <div class="sched-header-title-wrap">
            <div class="sched-header-icon-box">
              <i data-lucide="calendar"></i>
            </div>
            <div class="sched-header-titles">
              <h1 id="sched-dynamic-title">${isTheory ? (isAr ? 'الجدول الأسبوعي' : 'Weekly Schedule') : (isAr ? 'جدول المعامل والعيادات' : 'Clinical & Lab Schedule')}</h1>
              <p id="sched-dynamic-subtitle">${isTheory ? (isAr ? 'المحاضرات النظرية • السنة الثالثة (2026–2027)' : 'Theory Lectures • Year 3 (2026–2027)') : (isAr ? 'السنة الثالثة (2026–2027)' : 'Year 3 (2026–2027)')}</p>
            </div>
          </div>

          <div class="sched-header-actions no-print">
            <div class="sched-filter-pill">
              <i data-lucide="calendar"></i>
              <span>${isAr ? 'جميع الأسابيع ▾' : 'All Weeks ▾'}</span>
            </div>
          </div>
        </div>

        <!-- Academic Tabs Row -->
        <div class="sched-tabs-row no-print">
          <div class="sched-tabs-group">
            <button class="sched-tab-btn ${isTheory ? 'active' : ''}" data-academic-tab="theory" type="button">
              <span>${isAr ? 'المحاضرات النظرية' : 'Theory Lectures'}</span>
            </button>
            <button class="sched-tab-btn ${!isTheory ? 'active' : ''}" data-academic-tab="practical" type="button">
              <span>${isAr ? 'جدول المعامل والعيادات' : 'Clinical & Lab Schedule'}</span>
            </button>
          </div>
        </div>

        <!-- Active Content Container -->
        <div id="academic-content-area" class="sched-content-area"></div>
      </div>
    `;

    ExamsPage.renderAcademicTabContent(isAr);
    ExamsPage.setupAcademicTabListeners(container, isAr);
    ExamsPage.attachPrintHandler(container);

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  },

  renderAcademicTabContent(isAr) {
    const contentArea = document.getElementById('academic-content-area');
    if (!contentArea) return;

    if (ExamsPage.academicTab === 'practical') {
      contentArea.innerHTML = ExamsPage.renderPracticalView(isAr);
      ExamsPage.setupPracticalListeners(isAr);
    } else {
      contentArea.innerHTML = ExamsPage.renderTheoryTableView(isAr);
    }

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  },

  setupAcademicTabListeners(container, isAr) {
    container.querySelectorAll('[data-academic-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-academic-tab');
        ExamsPage.academicTab = tab;
        localStorage.setItem('kf_academic_active_tab', tab);

        // Update URL hash smoothly without reloading
        if (tab === 'practical') {
          window.location.hash = '#/practical-schedule';
        } else {
          window.location.hash = '#/lecture-schedule';
        }

        // Update header dynamic title & subtitle
        const titleEl = document.getElementById('sched-dynamic-title');
        const subEl = document.getElementById('sched-dynamic-subtitle');
        if (titleEl && subEl) {
          if (tab === 'practical') {
            titleEl.textContent = isAr ? 'جدول المعامل والعيادات' : 'Clinical & Lab Schedule';
            subEl.textContent = isAr ? 'السنة الثالثة (2026–2027)' : 'Year 3 (2026–2027)';
          } else {
            titleEl.textContent = isAr ? 'الجدول الأسبوعي' : 'Weekly Schedule';
            subEl.textContent = isAr ? 'المحاضرات النظرية • السنة الثالثة (2026–2027)' : 'Theory Lectures • Year 3 (2026–2027)';
          }
        }

        container.querySelectorAll('[data-academic-tab]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        ExamsPage.renderAcademicTabContent(isAr);
      });
    });
  },

  renderTheoryTableView(isAr) {
    const scheduleDays = ExamsPage.theoryScheduleDays || [];

    return `
      <!-- Desktop & Tablet Landscape View: Clean Unified Table -->
      <div class="kuro-sched-table-card">
        <table class="kuro-sched-table">
          <thead>
            <tr>
              <th style="width: 140px;">${isAr ? 'اليوم' : 'Day'}</th>
              <th style="width: 170px;">${isAr ? 'الوقت' : 'Time'}</th>
              <th>${isAr ? 'المادة' : 'Subject'}</th>
              <th style="width: 130px;">${isAr ? 'الرمز' : 'Code'}</th>
              <th style="width: 170px;">${isAr ? 'المكان' : 'Location'}</th>
            </tr>
          </thead>
          <tbody>
            ${scheduleDays.map(dayObj => {
              const slots = dayObj.slots || [];
              if (slots.length === 0) return '';
              return slots.map((slot, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === slots.length - 1;
                const trClass = isLast ? 'sched-day-last-row' : '';
                return `
                  <tr class="${trClass}">
                    ${isFirst ? `
                      <td class="sched-day-cell" rowspan="${slots.length}">
                        <span class="sched-day-name">${isAr ? dayObj.day_ar : dayObj.day_en}</span>
                        <span class="sched-day-sub">${isAr ? dayObj.day_en : dayObj.day_ar}</span>
                      </td>
                    ` : ''}
                    <td class="sched-time-cell">${slot.time}</td>
                    <td class="sched-subject-cell">
                      <span class="sched-subject-primary">${isAr ? slot.subject_ar : slot.subject_en}</span>
                      ${isAr ? `<span class="sched-subject-en-sub">${slot.subject_en}</span>` : ''}
                    </td>
                    <td class="sched-code-cell">${slot.code}</td>
                    <td class="sched-location-cell">${isAr ? slot.hall_ar : slot.hall_en}</td>
                  </tr>
                `;
              }).join('');
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- Mobile Touch View: Compact Day Cards -->
      <div class="kuro-sched-mobile-list">
        ${scheduleDays.map(dayObj => `
          <div class="sched-mobile-day-group">
            <div class="sched-mobile-day-title">
              <strong>${isAr ? dayObj.day_ar : dayObj.day_en}</strong>
              <span>${isAr ? dayObj.day_en : dayObj.day_ar}</span>
            </div>
            <div class="sched-mobile-cards-stack">
              ${(dayObj.slots || []).map(slot => `
                <div class="sched-mobile-card">
                  <div class="sched-mobile-icon-box">
                    <i data-lucide="book-open"></i>
                  </div>
                  <div class="sched-mobile-info">
                    <div class="sched-mobile-time">${slot.time}</div>
                    <div class="sched-mobile-subject">${isAr ? slot.subject_ar : slot.subject_en}</div>
                    <div class="sched-mobile-meta">${slot.code} • ${isAr ? slot.hall_ar : slot.hall_en}</div>
                  </div>
                  <div class="sched-mobile-arrow">
                    <i data-lucide="${isAr ? 'chevron-left' : 'chevron-right'}"></i>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
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

    return `
      <!-- Group Selector Pill Bar (A1 to E2) -->
      <div class="sched-group-selector-wrap no-print">
        <div class="sched-group-selector-label">${isAr ? 'اختيار المجموعة (من A1 إلى E2)' : 'Group Selector (A1 to E2)'}</div>
        <div class="sched-group-pills-row">
          ${allGroups.map(g => `
            <button class="sched-group-pill ${g === selectedGroup ? 'active' : ''}" data-group="${g}" type="button" aria-label="Group ${g}">
              ${g}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Desktop & Tablet Landscape View: Clean Unified Table -->
      <div class="kuro-sched-table-card">
        <table class="kuro-sched-table">
          <thead>
            <tr>
              <th style="width: 140px;">${isAr ? 'اليوم' : 'Day'}</th>
              <th style="width: 170px;">${isAr ? 'الوقت' : 'Time'}</th>
              <th>${isAr ? 'المادة' : 'Subject'}</th>
              <th style="width: 130px;">${isAr ? 'الرمز' : 'Code'}</th>
              <th style="width: 170px;">${isAr ? 'المكان' : 'Location'}</th>
            </tr>
          </thead>
          <tbody>
            ${weekdays.map(w => {
              const daySessions = dayMap[w.ar] || [];
              if (daySessions.length === 0) return '';
              return daySessions.map((s, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === daySessions.length - 1;
                const trClass = isLast ? 'sched-day-last-row' : '';
                const displayTime = s.time_en ? s.time_en.replace(/\s*PM\s*/gi, '').replace(/\s*AM\s*/gi, '').trim() : s.time_ar;
                return `
                  <tr class="${trClass}">
                    ${isFirst ? `
                      <td class="sched-day-cell" rowspan="${daySessions.length}">
                        <span class="sched-day-name">${isAr ? w.ar : w.en}</span>
                        <span class="sched-day-sub">${isAr ? w.en : w.ar}</span>
                      </td>
                    ` : ''}
                    <td class="sched-time-cell">${isAr ? s.time_ar : displayTime}</td>
                    <td class="sched-subject-cell">
                      <span class="sched-subject-primary">${isAr ? s.course_ar : s.course_en}</span>
                      ${isAr ? `<span class="sched-subject-en-sub">${s.course_en}</span>` : ''}
                    </td>
                    <td class="sched-code-cell">${s.code}</td>
                    <td class="sched-location-cell">${isAr ? s.place_ar : s.place_en}</td>
                  </tr>
                `;
              }).join('');
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- Mobile Touch View: Compact Day Cards -->
      <div class="kuro-sched-mobile-list">
        <div class="sched-mobile-group-hint">
          <span>${isAr ? `المجموعة الحالية: ${selectedGroup}` : `Current Group: ${selectedGroup}`}</span>
        </div>
        ${weekdays.map(w => {
          const daySessions = dayMap[w.ar] || [];
          if (daySessions.length === 0) return '';
          return `
            <div class="sched-mobile-day-group">
              <div class="sched-mobile-day-title">
                <strong>${isAr ? w.ar : w.en}</strong>
                <span>${isAr ? w.en : w.ar}</span>
              </div>
              <div class="sched-mobile-cards-stack">
                ${daySessions.map(s => {
                  const displayTime = s.time_en ? s.time_en.replace(/\s*PM\s*/gi, '').replace(/\s*AM\s*/gi, '').trim() : s.time_ar;
                  return `
                    <div class="sched-mobile-card">
                      <div class="sched-mobile-icon-box">
                        <i data-lucide="flask-conical"></i>
                      </div>
                      <div class="sched-mobile-info">
                        <div class="sched-mobile-time">${isAr ? s.time_ar : displayTime}</div>
                        <div class="sched-mobile-subject">${isAr ? s.course_ar : s.course_en}</div>
                        <div class="sched-mobile-meta">${s.code} • ${isAr ? s.place_ar : s.place_en}</div>
                      </div>
                      <div class="sched-mobile-arrow">
                        <i data-lucide="${isAr ? 'chevron-left' : 'chevron-right'}"></i>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  setupPracticalListeners(isAr) {
    const contentArea = document.getElementById('academic-content-area');
    if (!contentArea) return;

    contentArea.querySelectorAll('.sched-group-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const group = btn.getAttribute('data-group');
        ExamsPage.setSelectedGroup(group);
        contentArea.innerHTML = ExamsPage.renderPracticalView(isAr);
        ExamsPage.setupPracticalListeners(isAr);
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
          window.lucide.createIcons();
        }
      });
    });
  },

  // =========================================================================
  // SECTION 2: OFFICIAL EXAM SCHEDULES (Midterm & Final)
  // Visual Reference: media_1790292241824.jpg
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
      <div class="schedules-subpage-container" dir="${isAr ? 'rtl' : 'ltr'}">
        <!-- Back Navigation Bar -->
        <div class="schedules-top-back-bar no-print">
          <a href="#/schedules" class="sched-back-pill" data-title="Back to Academic Schedules">
            <i data-lucide="${isAr ? 'arrow-right' : 'arrow-left'}"></i>
            <span>${isAr ? 'الرجوع للجداول الدراسية' : 'Back to Schedules'}</span>
          </a>
        </div>

        <!-- Page Header -->
        <div class="sched-page-header">
          <div class="sched-header-title-wrap">
            <div class="sched-header-icon-box">
              <i data-lucide="calendar"></i>
            </div>
            <div class="sched-header-titles">
              <h1>${isAr ? 'جدول الامتحانات الرسمية' : 'Examination Schedule'}</h1>
              <p>${isAr ? 'السنة الثالثة (2026 – 2027)' : 'Year 3 (2026 – 2027)'}</p>
            </div>
          </div>
        </div>

        <!-- Controls Row: Tabs on Left, Print on Right -->
        <div class="sched-tabs-row no-print">
          <div class="sched-tabs-group">
            <button class="sched-tab-btn ${ExamsPage.examTab === 'midterm' ? 'active' : ''}" data-exam-tab="midterm" type="button">
              <span>${isAr ? 'الامتحانات النصفية' : 'Midterm Exams'}</span>
              <span class="sched-tab-count-badge">12 ${isAr ? 'مادة' : 'Subjects'}</span>
            </button>
            <button class="sched-tab-btn ${ExamsPage.examTab === 'final' ? 'active' : ''}" data-exam-tab="final" type="button">
              <span>${isAr ? 'الامتحانات النهائية' : 'Final Exams'}</span>
              <span class="sched-tab-count-badge">3 ${isAr ? 'مواد' : 'Subjects'}</span>
            </button>
          </div>

          <div class="sched-tabs-actions">
            <button id="btn-print-schedule" class="sched-print-btn" type="button">
              <i data-lucide="printer"></i>
              <span>${isAr ? 'طباعة / حفظ PDF' : 'Print / Save PDF'}</span>
            </button>
          </div>
        </div>

        <!-- Active Exam Content Container -->
        <div id="exams-content-area" class="sched-content-area"></div>
      </div>
    `;

    ExamsPage.renderExamTabContent(isAr);
    ExamsPage.setupExamListeners(container, isAr);
    ExamsPage.attachPrintHandler(container);

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  },

  renderExamTabContent(isAr) {
    const contentArea = document.getElementById('exams-content-area');
    if (!contentArea) return;

    if (ExamsPage.examTab === 'final') {
      contentArea.innerHTML = ExamsPage.renderFinalView(isAr);
    } else {
      contentArea.innerHTML = ExamsPage.renderMidtermView(isAr);
    }

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  },

  renderMidtermView(isAr) {
    const data = ExamsPage.midtermData || [];

    return `
      <!-- Desktop & Tablet Landscape View: Clean Exam Table -->
      <div class="kuro-sched-table-card">
        <table class="kuro-sched-table">
          <thead>
            <tr>
              <th style="width: 50px; text-align: center;">#</th>
              <th style="width: 140px;">${isAr ? 'التاريخ' : 'Date'}</th>
              <th style="width: 120px;">${isAr ? 'اليوم' : 'Day'}</th>
              <th style="width: 140px;">${isAr ? 'الوقت' : 'Time'}</th>
              <th>${isAr ? 'المادة' : 'Subject'}</th>
              <th style="width: 110px;">${isAr ? 'الرمز' : 'Code'}</th>
              <th style="width: 130px; text-align: center;">${isAr ? 'العد التنازلي' : 'Countdown'}</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(item => {
              const daysLeft = ExamsPage.getDaysRemaining(item.date);
              const countdownText = (daysLeft !== null && daysLeft > 0)
                ? (isAr ? `${daysLeft} يوم` : `${daysLeft} days`)
                : (daysLeft === 0 ? (isAr ? 'اليوم ⚡' : 'Today ⚡') : (isAr ? 'اكتمل' : 'Passed'));

              return `
                <tr>
                  <td style="text-align: center; color: #8C827A; font-weight: 600;">${item.no}</td>
                  <td class="sched-date-cell">
                    <span class="sched-date-pill">
                      <i data-lucide="calendar"></i>
                      <span>${item.date}</span>
                    </span>
                  </td>
                  <td style="color: #4A3E3D; font-weight: 600;">${isAr ? item.day_ar : item.day_en}</td>
                  <td class="sched-time-cell">${item.time}</td>
                  <td class="sched-subject-cell">
                    <span class="sched-subject-primary">${isAr ? item.name_ar : item.name_en}</span>
                    ${isAr ? `<span class="sched-subject-en-sub">${item.name_en}</span>` : ''}
                  </td>
                  <td class="sched-code-cell">${item.code}</td>
                  <td style="text-align: center;">
                    <span class="sched-countdown-badge">${countdownText}</span>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- Mobile Touch View: Clean Exam Cards Stack -->
      <div class="kuro-sched-mobile-list">
        <div class="sched-mobile-exams-stack">
          ${data.map(item => {
            const daysLeft = ExamsPage.getDaysRemaining(item.date);
            const countdownText = (daysLeft !== null && daysLeft > 0)
              ? (isAr ? `${daysLeft} يوم` : `${daysLeft} days`)
              : (daysLeft === 0 ? (isAr ? 'اليوم ⚡' : 'Today ⚡') : (isAr ? 'اكتمل' : 'Passed'));
            const { month, day } = ExamsPage.getMonthDay(item.date, isAr);

            return `
              <div class="sched-mobile-exam-card">
                <div class="sched-mobile-date-block">
                  <span class="date-block-month">${month}</span>
                  <span class="date-block-day">${day}</span>
                </div>
                <div class="sched-mobile-exam-info">
                  <div class="exam-time-text">${item.time}</div>
                  <div class="exam-subject-text">${isAr ? item.name_ar : item.name_en}</div>
                  <div class="exam-code-text">${item.code}</div>
                </div>
                <div class="sched-mobile-countdown">
                  ${countdownText}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  renderFinalView(isAr) {
    const data = ExamsPage.finalData || [];

    return `
      <!-- Desktop & Tablet Landscape View: Clean Exam Table -->
      <div class="kuro-sched-table-card">
        <table class="kuro-sched-table">
          <thead>
            <tr>
              <th style="width: 50px; text-align: center;">#</th>
              <th style="width: 140px;">${isAr ? 'التاريخ' : 'Date'}</th>
              <th style="width: 120px;">${isAr ? 'اليوم' : 'Day'}</th>
              <th style="width: 140px;">${isAr ? 'الوقت' : 'Time'}</th>
              <th>${isAr ? 'المادة' : 'Subject'}</th>
              <th style="width: 110px;">${isAr ? 'الرمز' : 'Code'}</th>
              <th style="width: 130px; text-align: center;">${isAr ? 'العد التنازلي' : 'Countdown'}</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(item => {
              const daysLeft = ExamsPage.getDaysRemaining(item.date);
              const countdownText = (daysLeft !== null && daysLeft > 0)
                ? (isAr ? `${daysLeft} يوم` : `${daysLeft} days`)
                : (daysLeft === 0 ? (isAr ? 'اليوم ⚡' : 'Today ⚡') : (isAr ? 'اكتمل' : 'Passed'));

              return `
                <tr>
                  <td style="text-align: center; color: #8C827A; font-weight: 600;">${item.no}</td>
                  <td class="sched-date-cell">
                    <span class="sched-date-pill">
                      <i data-lucide="calendar"></i>
                      <span>${item.date}</span>
                    </span>
                  </td>
                  <td style="color: #4A3E3D; font-weight: 600;">${isAr ? item.day_ar : item.day_en}</td>
                  <td class="sched-time-cell">${item.time}</td>
                  <td class="sched-subject-cell">
                    <span class="sched-subject-primary">${isAr ? item.name_ar : item.name_en}</span>
                    ${isAr ? `<span class="sched-subject-en-sub">${item.name_en}</span>` : ''}
                  </td>
                  <td class="sched-code-cell">${item.code}</td>
                  <td style="text-align: center;">
                    <span class="sched-countdown-badge">${countdownText}</span>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- Mobile Touch View: Clean Exam Cards Stack -->
      <div class="kuro-sched-mobile-list">
        <div class="sched-mobile-exams-stack">
          ${data.map(item => {
            const daysLeft = ExamsPage.getDaysRemaining(item.date);
            const countdownText = (daysLeft !== null && daysLeft > 0)
              ? (isAr ? `${daysLeft} يوم` : `${daysLeft} days`)
              : (daysLeft === 0 ? (isAr ? 'اليوم ⚡' : 'Today ⚡') : (isAr ? 'اكتمل' : 'Passed'));
            const { month, day } = ExamsPage.getMonthDay(item.date, isAr);

            return `
              <div class="sched-mobile-exam-card">
                <div class="sched-mobile-date-block">
                  <span class="date-block-month">${month}</span>
                  <span class="date-block-day">${day}</span>
                </div>
                <div class="sched-mobile-exam-info">
                  <div class="exam-time-text">${item.time}</div>
                  <div class="exam-subject-text">${isAr ? item.name_ar : item.name_en}</div>
                  <div class="exam-code-text">${item.code}</div>
                </div>
                <div class="sched-mobile-countdown">
                  ${countdownText}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  setupExamListeners(container, isAr) {
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
  },

  attachPrintHandler(container) {
    const printBtns = container.querySelectorAll('#btn-print-schedule, .sched-print-btn');
    printBtns.forEach(btn => {
      btn.addEventListener('click', () => {
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
    });
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
    if (hash.includes('/exams')) {
      return ExamsPage.renderExamsSchedule(container, queryParams);
    }
    if (hash.includes('/practical-schedule')) {
      ExamsPage.academicTab = 'practical';
      return ExamsPage.renderAcademicSchedules(container, queryParams);
    }
    if (hash.includes('/lecture-schedule')) {
      ExamsPage.academicTab = 'theory';
      return ExamsPage.renderAcademicSchedules(container, queryParams);
    }
    return ExamsPage.renderSchedulesHub(container, queryParams);
  }
};

window.ExamsPage = ExamsPage;
