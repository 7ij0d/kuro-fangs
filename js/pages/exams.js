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

    container.innerHTML = `
      <!-- Back Navigation Bar -->
      <div class="schedules-top-back-bar no-print">
        <a href="#/schedules" class="schedules-back-link">
          <i data-lucide="${isAr ? 'arrow-right' : 'arrow-left'}"></i>
          <span>${isAr ? 'الرجوع للجداول الدراسية' : 'Back to Academic Schedules'}</span>
        </a>
      </div>

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
          <!-- Link to Schedules Hub -->
          <a href="#/schedules" class="btn btn-secondary btn-sm" style="gap: 6px; font-weight: 700;">
            <i data-lucide="calendar" style="width: 15px; height: 15px;"></i>
            <span>${isAr ? 'كل الجداول' : 'All Schedules'}</span>
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
              ? 'تُعقد كافة المحاضرات النظرية الموحدة في <b>مدرج 2</b> بالكلية من السبت إلى الخميس (8:00 ص – 12:00 م، ومحاضرة أمراض الفم الإضافية الأربعاء 2:00 م – 4:00 م). الحضور إلزامي بنسبة لا تقل عن 75% لدخول الامتحانات النهائية.' 
              : 'All unified theoretical lectures take place in <b>Auditorium 2</b> Saturday through Thursday (8:00 AM – 12:00 PM, and Wednesday Oral Path at 2:00 PM – 4:00 PM). Minimum 75% attendance is required for exam entry.'}
          </div>
        </div>
      `;
      ExamsPage.setupTheoryModeListeners(contentArea, isAr);
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

    ExamsPage.setupTheoryModeListeners(container, isAr);
  },

  setupTheoryModeListeners(container, isAr) {
    const matrixBtn = container.querySelector('#btn-theory-matrix');
    const cardsBtn = container.querySelector('#btn-theory-cards');

    if (matrixBtn && cardsBtn) {
      matrixBtn.addEventListener('click', () => {
        ExamsPage.theoryViewMode = 'matrix';
        localStorage.setItem('kf_theory_view_mode', 'matrix');
        ExamsPage.renderAcademicTabContent(isAr);
      });

      cardsBtn.addEventListener('click', () => {
        ExamsPage.theoryViewMode = 'timeline';
        localStorage.setItem('kf_theory_view_mode', 'timeline');
        ExamsPage.renderAcademicTabContent(isAr);
      });
    }
  },

  renderTheoryTableView(isAr) {
    const title = isAr ? 'جدول المحاضرات النظري الموحد — مدرج 2' : 'Unified Theoretical Lectures Timetable — Auditorium 2';
    const subtitle = isAr ? 'كلية طب وجراحة الفم والأسنان • جامعة طرابلس • العام الجامعي 2026 / 2027' : 'Faculty of Oral & Dental Surgery • University of Tripoli • Academic Year 2026 - 2027';
    const isMatrix = ExamsPage.theoryViewMode !== 'timeline';
    const matrix = ExamsPage.theoryScheduleMatrix;
    const scheduleDays = ExamsPage.theoryScheduleDays;

    const renderCard = (slot) => {
      if (!slot) return '';
      return `
        <div class="theory-slot-card" style="border-inline-start: 4px solid ${slot.color};">
          <div class="theory-slot-card-header">
            <span class="theory-code-badge" style="background: ${slot.color}; color: #FFFFFF;">${slot.code}</span>
            <span class="theory-hall-badge">
              <i data-lucide="map-pin" style="width: 12px; height: 12px; color: ${slot.color};"></i>
              <span>${isAr ? slot.hall_ar : slot.hall_en}</span>
            </span>
          </div>
          <div class="theory-course-title">${isAr ? slot.course_ar : slot.course_en}</div>
          <div class="theory-course-sub">${isAr ? slot.course_en : slot.course_ar}</div>
          <div class="theory-time-footer">
            <i data-lucide="clock" style="width: 12px; height: 12px;"></i>
            <span>${slot.time}</span>
          </div>
        </div>
      `;
    };

    const renderEmpty = (label) => {
      return `
        <div class="theory-empty-slot">
          <span class="theory-empty-text">${label}</span>
        </div>
      `;
    };

    return `
      <div class="exams-table-card card theory-table-card">
        <div class="table-card-header" style="flex-wrap: wrap; gap: 12px;">
          <div>
            <h2>📚 ${title}</h2>
            <p>${subtitle}</p>
          </div>

          <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
            <!-- Official Source Portal Link -->
            <a href="https://tables.dentaluot.com/print.php?year=3&mode=theory" target="_blank" rel="noopener" class="official-source-pill" style="background: var(--bg-hover); color: var(--text-secondary); border: 1px solid var(--border-subtle);" title="${isAr ? 'عرض الجدول في موقع الكلية الرسمي' : 'Open official timetable portal'}">
              <i data-lucide="external-link" style="width: 13px; height: 13px;"></i>
              <span>${isAr ? '🔗 المصدر الرسمي بالكلية' : '🔗 Faculty Portal'}</span>
            </a>

            <!-- View Mode Switcher -->
            <div class="theory-view-toggle no-print">
              <button type="button" id="btn-theory-matrix" class="theory-toggle-btn ${isMatrix ? 'active' : ''}" title="${isAr ? 'عرض مصفوفة الجدول الأسبوعي' : 'Weekly Matrix View'}">
                <i data-lucide="grid" style="width: 14px; height: 14px;"></i>
                <span>${isAr ? 'المصفوفة المعتمدة' : 'Matrix'}</span>
              </button>
              <button type="button" id="btn-theory-cards" class="theory-toggle-btn ${!isMatrix ? 'active' : ''}" title="${isAr ? 'عرض بطاقات الأيام' : 'Day Cards View'}">
                <i data-lucide="list" style="width: 14px; height: 14px;"></i>
                <span>${isAr ? 'بطاقات الأيام' : 'Cards'}</span>
              </button>
            </div>

            <div class="print-watermark">KURO FANGS • THEORETICAL LECTURES • AUDITORIUM 2</div>
          </div>
        </div>

        ${isMatrix ? `
          <!-- Official Matrix Grid View (Matching tables.dentaluot.com) -->
          <div class="table-responsive" style="margin-top: 14px;">
            <table class="theory-matrix-table">
              <thead>
                <tr>
                  <th style="width: 120px; text-align: center;">${isAr ? 'اليوم' : 'Day'}</th>
                  <th style="width: 24%;">${isAr ? 'الفترة الأولى (08:00 ص – 10:00 ص)' : 'Period 1 (08:00 AM – 10:00 AM)'}</th>
                  <th style="width: 24%;">${isAr ? 'الفترة الثانية (10:00 ص – 12:00 م)' : 'Period 2 (10:00 AM – 12:00 PM)'}</th>
                  <th style="width: 24%;">${isAr ? 'الفترة الثالثة (12:00 م – 02:00 م)' : 'Period 3 (12:00 PM – 02:00 PM)'}</th>
                  <th style="width: 24%;">${isAr ? 'الفترة الرابعة (02:00 م – 04:00 م)' : 'Period 4 (02:00 PM – 04:00 PM)'}</th>
                </tr>
              </thead>
              <tbody>
                ${matrix.map(row => `
                  <tr>
                    <td class="theory-day-cell">
                      <div class="day-header-content">
                        <span class="day-name-main">${isAr ? row.day_ar : row.day_en}</span>
                        <span class="day-name-sub">${isAr ? row.day_en : row.day_ar}</span>
                      </div>
                    </td>
                    <td>${row.slots.slot1 ? renderCard(row.slots.slot1) : renderEmpty('—')}</td>
                    <td>${row.slots.slot2 ? renderCard(row.slots.slot2) : renderEmpty('—')}</td>
                    <td>${renderEmpty(isAr ? 'استراحة / عيادات ومعامل 🏥' : 'Clinics & Labs 🏥')}</td>
                    <td>${row.slots.slot4 ? renderCard(row.slots.slot4) : renderEmpty('—')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : `
          <!-- Day-by-Day Stack View -->
          <div class="clinical-days-stack" style="margin-top: 14px;">
            ${scheduleDays.map(dayObj => `
              <div class="clinical-day-card">
                <div class="clinical-day-card-header">
                  <div class="day-badge-title">
                    <i data-lucide="calendar" style="width: 20px; height: 20px; color: var(--brand-burgundy);"></i>
                    <span>${isAr ? dayObj.day_ar : dayObj.day_en}</span>
                    <span style="font-size: 0.8rem; font-weight: 500; color: var(--text-muted);">(${isAr ? dayObj.day_en : dayObj.day_ar})</span>
                  </div>
                  <div class="day-theory-hint">
                    ${isAr ? 'المدرج: مدرج 2 (الكلية)' : 'Auditorium: Hall 2'}
                  </div>
                </div>
                <div class="day-sessions-grid">
                  ${dayObj.slots.map(s => `
                    <div class="theory-slot-card" style="border-inline-start: 4px solid ${s.color};">
                      <div class="theory-slot-card-header">
                        <span class="theory-code-badge" style="background: ${s.color}; color: #FFFFFF;">${s.code}</span>
                        <span class="theory-hall-badge">
                          <i data-lucide="map-pin" style="width: 12px; height: 12px; color: ${s.color};"></i>
                          <span>${isAr ? s.hall_ar : s.hall_en}</span>
                        </span>
                      </div>
                      <div class="theory-course-title">${isAr ? s.subject_ar : s.subject_en}</div>
                      <div class="theory-course-sub">${isAr ? s.subject_en : s.subject_ar}</div>
                      <div class="theory-time-footer">
                        <i data-lucide="clock" style="width: 12px; height: 12px;"></i>
                        <span>${s.time}</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        `}
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
      <!-- Back Navigation Bar -->
      <div class="schedules-top-back-bar no-print">
        <a href="#/schedules" class="schedules-back-link">
          <i data-lucide="${isAr ? 'arrow-right' : 'arrow-left'}"></i>
          <span>${isAr ? 'الرجوع للجداول الدراسية' : 'Back to Academic Schedules'}</span>
        </a>
      </div>

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
          <!-- Link to Schedules Hub -->
          <a href="#/schedules" class="btn btn-secondary btn-sm" style="gap: 6px; font-weight: 700;">
            <i data-lucide="calendar" style="width: 15px; height: 15px;"></i>
            <span>${isAr ? 'كل الجداول' : 'All Schedules'}</span>
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
