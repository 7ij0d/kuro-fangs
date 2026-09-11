/**
 * KURO FANGS — HOME DASHBOARD (ACADEMIA DESIGN SYSTEM)
 * 12 Subjects with Cover Headers, Study Progress Bars, Doctor Badges & Micro-Interactions
 */

const HomePage = {
  searchQuery: '',
  loadingTimeout: null,
  countdownInterval: null,

  facultyNews: [
    {
      id: 'news-1',
      title_ar: 'مواعيد التسجيل وبدء الدراسة للعام الجامعي 2026 - 2027',
      title_en: 'Registration Schedule & Academic Year 2026 - 2027 Commencement',
      dept_ar: 'إدارة الكلية والشؤون الأكاديمية',
      dept_en: 'Faculty Administration & Academic Affairs',
      date: '2026/09/10',
      badge_ar: 'إعلان رسمي',
      badge_en: 'Official Notice',
      badge_type: 'official',
      cover: 'assets/covers/gen-med.webp',
      summary_ar: 'اعتماد التقويم الأكاديمي الرسمي وانطلاق المحاضرات النظرية بالقاعات الرئيسية، مع التأكيد على ضرورة تثبيت الجداول والالتزام بالمواعيد المحددة.',
      summary_en: 'Official academic calendar approved and theoretical lectures commenced in main auditoriums. All students are advised to confirm schedules.',
      details_ar: 'تعلن إدارة كلية طب وجراحة الفم والأسنان عن انطلاق العام الجامعي الجديد 2026 - 2027 لطلبة السنة الثالثة وفق التقويم المعتمد. يرجى من جميع الطلبة الحضور للقاعات والمدرجات المخصصة واستلام خطة المقررات الدراسية الـ 12 من ممثلي الأقسام الأكاديمية.',
      details_en: 'The Faculty of Dentistry announces the official commencement of the 2026-2027 academic year for Year 3 dental surgery students in accordance with the university calendar.'
    },
    {
      id: 'news-2',
      title_ar: 'تنبيهات وضوابط معامل الفانتوم والتدريب السريري',
      title_en: 'Phantom Simulation Lab Regulations & Clinical Training Protocol',
      dept_ar: 'قسم العلاج التحفظي والاستعاضة السنية',
      dept_en: 'Dept. of Conservative Dentistry & Prosthodontics',
      date: '2026/09/08',
      badge_ar: 'تنبيه سريري',
      badge_en: 'Clinical Alert',
      badge_type: 'alert',
      cover: 'assets/covers/cons-endo.webp',
      summary_ar: 'ضرورة الالتزام الصارم بالزي الطبي الكامل وإجراءات مكافحة العدوى والتعقيم المعتمدة داخل معامل المحاكاة السنية قبل بدء التطبيقات العملية.',
      summary_en: 'Mandatory clinical attire, infection control protocols, and sterilization guidelines strictly enforced in all phantom simulation labs.',
      details_ar: 'تهيب رئاسة أقسام العلاج التحفظي والاستعاضة بطلبة السنة الثالثة الالتزام باللائحة الداخلية لمعامل الفانتوم: ارتداء اللاب كوت والقفازات وواقي العينين، والحفاظ على نظافة رؤوس المحاكاة وتجهيز أدوات الحفر والترميم المعتمدة قبل موعد الجلسة بـ 10 دقائق.',
      details_en: 'Students are required to wear complete protective clinical attire, bring approved dental instruments, and maintain sterilization standards across all phantom head simulation sessions.'
    },
    {
      id: 'news-3',
      title_ar: 'تحديثات وتعليمات جدول الامتحانات النصفية الرسمية',
      title_en: 'Midterm Examination Schedule Updates & Seating Guidelines',
      dept_ar: 'لجنة الامتحانات والمراقبة المركزية',
      dept_en: 'Central Examination Board',
      date: '2026/09/05',
      badge_ar: 'جداول الامتحانات',
      badge_en: 'Exam Schedule',
      badge_type: 'exam',
      cover: 'assets/covers/omfs.webp',
      summary_ar: 'نشر الجداول الزمنية المعتمدة للامتحانات النصفية للمواد الـ 12 مع تحديد القاعات والمدرجات وضوابط الدخول والبطاقة الجامعية.',
      summary_en: 'Official timetable published for all 12 midterm subjects with assigned examination auditoriums and university ID entry requirements.',
      details_ar: 'تم اعتماد الجدول الزمني الرسمي للامتحانات النصفية النظري لجميع المقررات الـ 12. تبدأ الامتحانات اعتباراً من يوم الأحد 03 يناير 2027 بمقرر الباطنة العامة (MS 310). يرجى التواجد قبل موعد الامتحان بـ 15 دقيقة مع إبراز البطاقة التعريفية الجامعية.',
      details_en: 'Midterm theory examinations officially commence on Sunday, January 3, 2027 with General Medicine (MS 310). Students are requested to bring student IDs.'
    }
  ],

  getNextExam(isAr) {
    const list = window.ExamsPage?.midtermData || [
      { no: 1, name_ar: 'الباطنة العامة', name_en: 'General Medicine', code: 'MS 310', day_ar: 'الأحد', day_en: 'Sunday', date: '2027/01/03', time: '11:00 - 12:00' }
    ];
    const firstExam = list[0];
    return {
      name: isAr ? firstExam.name_ar : firstExam.name_en,
      code: firstExam.code,
      dateStr: firstExam.date,
      day: isAr ? firstExam.day_ar : firstExam.day_en,
      time: firstExam.time
    };
  },

  calculateCountdown(dateStr) {
    const parts = (dateStr || '2027/01/03').split('/');
    const targetDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 11, 0, 0);
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  },

  renderFacultyOverview(isAr, t) {
    const nextExam = HomePage.getNextExam(isAr);
    const countdown = HomePage.calculateCountdown(nextExam.dateStr);

    const newsCardsHTML = HomePage.facultyNews.map(item => {
      const title = isAr ? item.title_ar : item.title_en;
      const dept = isAr ? item.dept_ar : item.dept_en;
      const badge = isAr ? item.badge_ar : item.badge_en;
      const summary = isAr ? item.summary_ar : item.summary_en;

      return `
        <article class="faculty-news-card" onclick="window.HomePage.openNewsModal('${item.id}')" role="button" tabindex="0" aria-label="${title}">
          <div class="news-card-media">
            <img src="${item.cover}" alt="${title}" class="news-card-img" loading="lazy" decoding="async" onerror="this.src='assets/covers/gen-med.webp'" />
          </div>
          <div class="news-card-content">
            <div class="news-meta-row">
              <span class="news-badge ${item.badge_type}">${badge}</span>
              <span class="news-dept">${dept}</span>
              <span class="news-date"><i data-lucide="clock" style="width: 12px; height: 12px;"></i> ${item.date}</span>
            </div>
            <h3 class="news-title">${title}</h3>
            <p class="news-summary">${summary}</p>
          </div>
        </article>
      `;
    }).join('');

    return `
      <section class="faculty-overview-section" aria-label="${t('facultyNewsTitle')}">
        <div class="faculty-overview-grid">
          <!-- 1. Faculty News Column (approx 65%) -->
          <div class="faculty-news-column">
            <div class="faculty-section-header">
              <div class="section-title-wrap">
                <div class="section-icon-badge">
                  <i data-lucide="megaphone"></i>
                </div>
                <div>
                  <h2 class="section-heading">${t('facultyNewsTitle')}</h2>
                  <p class="section-subheading">${t('facultyNewsSubtitle')}</p>
                </div>
              </div>
            </div>

            <div class="faculty-news-list">
              ${newsCardsHTML}
            </div>
          </div>

          <!-- 2. Next Exam Countdown Widget (approx 35%) -->
          <div class="faculty-exam-column">
            <div class="next-exam-widget">
              <div>
                <div class="next-exam-header">
                  <div class="next-exam-title-wrap">
                    <i data-lucide="calendar" style="width: 18px; height: 18px; color: var(--brand-burgundy);"></i>
                    <h3>${t('nextExamTitle')}</h3>
                  </div>
                  <span class="next-exam-badge">
                    <i data-lucide="alert-circle" style="width: 12px; height: 12px;"></i>
                    ${t('nextExamBadge')}
                  </span>
                </div>

                <div class="next-exam-body">
                  <div class="next-exam-subject-row">
                    <h4 class="next-exam-subject-name">${nextExam.name}</h4>
                    <span class="next-exam-code">${nextExam.code}</span>
                  </div>

                  <div class="next-exam-meta">
                    <div class="next-exam-meta-item">
                      <i data-lucide="calendar-days"></i>
                      <span><strong>${t('examDateLabel')}:</strong> ${nextExam.day} • ${nextExam.dateStr}</span>
                    </div>
                    <div class="next-exam-meta-item">
                      <i data-lucide="clock"></i>
                      <span><strong>${t('examTimeLabel')}:</strong> ${nextExam.time}</span>
                    </div>
                  </div>
                </div>

                <!-- Live Countdown Grid -->
                <div class="countdown-wrap">
                  <div class="countdown-label-strip">
                    <span>${isAr ? 'الوقت المتبقي حتى الامتحان:' : 'Time Remaining Until Exam:'}</span>
                    <i data-lucide="hourglass" style="width: 13px; height: 13px;"></i>
                  </div>
                  <div class="countdown-grid">
                    <div class="countdown-box">
                      <span class="countdown-num" id="cd-days">${String(countdown.days).padStart(2, '0')}</span>
                      <span class="countdown-unit">${t('countdownDays')}</span>
                    </div>
                    <div class="countdown-box">
                      <span class="countdown-num" id="cd-hours">${String(countdown.hours).padStart(2, '0')}</span>
                      <span class="countdown-unit">${t('countdownHours')}</span>
                    </div>
                    <div class="countdown-box">
                      <span class="countdown-num" id="cd-mins">${String(countdown.minutes).padStart(2, '0')}</span>
                      <span class="countdown-unit">${t('countdownMins')}</span>
                    </div>
                    <div class="countdown-box">
                      <span class="countdown-num" id="cd-secs">${String(countdown.seconds).padStart(2, '0')}</span>
                      <span class="countdown-unit">${t('countdownSecs')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Button to view full exam schedule -->
              <button class="btn-exam-schedule" onclick="window.ROUTER.navigate('/exams')" aria-label="${t('viewFullSchedule')}">
                <span>${t('viewFullSchedule')}</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  openNewsModal(newsId) {
    const item = HomePage.facultyNews.find(n => n.id === newsId);
    if (!item) return;

    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
    const title = isAr ? item.title_ar : item.title_en;
    const dept = isAr ? item.dept_ar : item.dept_en;
    const badge = isAr ? item.badge_ar : item.badge_en;
    const details = isAr ? item.details_ar : item.details_en;

    let overlay = document.getElementById('faculty-news-modal');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'faculty-news-modal';
      overlay.className = 'news-modal-overlay';
      overlay.onclick = (e) => {
        if (e.target === overlay) HomePage.closeNewsModal();
      };
      document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
      <div class="news-modal-box">
        <button class="news-modal-close" onclick="window.HomePage.closeNewsModal()" aria-label="Close">
          <i data-lucide="x" style="width: 16px; height: 16px;"></i>
        </button>

        <div style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
          <span class="news-badge ${item.badge_type}">${badge}</span>
          <span style="font-size: 0.75rem; color: var(--text-muted);">${item.date}</span>
        </div>

        <h2 style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px; line-height: 1.4;">${title}</h2>
        <div style="font-size: 0.825rem; font-weight: 600; color: var(--brand-burgundy); margin-bottom: 16px;">${dept}</div>

        <div style="background: var(--bg-surface-subtle); border-radius: 8px; padding: 16px; font-size: 0.9rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 20px;">
          ${details}
        </div>

        <div style="display: flex; justify-content: flex-end;">
          <button class="btn btn-secondary" onclick="window.HomePage.closeNewsModal()" style="padding: 8px 18px; font-size: 0.85rem;">
            ${isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    `;

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (window.lucide) window.lucide.createIcons();
  },

  closeNewsModal() {
    const overlay = document.getElementById('faculty-news-modal');
    if (overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  },

  render(container) {
    const t = (k) => window.I18N.t(k);
    const isAr = window.I18N.getLang() === 'ar';
    const subjects = window.DATA.getSubjects();

    container.innerHTML = `
      <!-- 1. Faculty Official News & Next Exam Countdown Section -->
      ${HomePage.renderFacultyOverview(isAr, t)}

      <!-- 2. The 12 Academic Subjects Showcase Section -->
      <div class="subjects-hero-bar">
        <div class="hero-text-wrap">
          <h1 id="hero-title">${t('heroTitle')}</h1>
        </div>
      </div>

      <!-- The 12 Subjects Showcase Grid (Unified 12 Subjects) -->
      <div class="subjects-showcase-grid" id="subjects-container"></div>
    `;

    HomePage.renderSubjectsList(subjects, false);
    HomePage.setupListeners();
  },

  renderSkeletons() {
    const grid = document.getElementById('subjects-container');
    if (!grid) return;

    grid.innerHTML = Array(6).fill(0).map(() => `
      <div class="skeleton-card">
        <div class="skeleton-banner skeleton-shimmer"></div>
        <div class="skeleton-body">
          <div class="skeleton-line title skeleton-shimmer"></div>
          <div class="skeleton-line sub skeleton-shimmer"></div>
          <div class="skeleton-line badge skeleton-shimmer"></div>
          <div class="skeleton-line progress skeleton-shimmer"></div>
          <div class="skeleton-line stats skeleton-shimmer"></div>
          <div class="skeleton-line btn skeleton-shimmer"></div>
        </div>
      </div>
    `).join('');
  },

  renderSubjectsList(allSubjects, withSkeleton = false) {
    const grid = document.getElementById('subjects-container');
    if (!grid) return;

    if (withSkeleton) {
      HomePage.renderSkeletons();
      if (HomePage.loadingTimeout) clearTimeout(HomePage.loadingTimeout);
      HomePage.loadingTimeout = setTimeout(() => {
        HomePage.buildCardsHTML(allSubjects);
      }, 160);
    } else {
      HomePage.buildCardsHTML(allSubjects);
    }
  },

  buildCardsHTML(allSubjects) {
    const grid = document.getElementById('subjects-container');
    if (!grid) return;

    const isAr = window.I18N.getLang() === 'ar';
    const t = (k) => window.I18N.t(k);

    // All 12 subjects displayed unified together in one place
    let filtered = [...allSubjects];

    // Search filtering
    if (HomePage.searchQuery) {
      const q = HomePage.searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        (s.name_ar && s.name_ar.toLowerCase().includes(q)) || 
        (s.name_en && s.name_en.toLowerCase().includes(q)) || 
        (s.code && s.code.toLowerCase().includes(q)) ||
        (s.doctor_name_ar && s.doctor_name_ar.toLowerCase().includes(q)) ||
        (s.doctor_name_en && s.doctor_name_en.toLowerCase().includes(q))
      );
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-card); padding: 50px; text-align: center;">
          <div style="font-size: 2.5rem; margin-bottom: 10px;">🔍</div>
          <h3 style="font-size: 1.1rem; color: var(--text-primary); margin-bottom: 6px;">${t('searchEmptyTitle')}</h3>
          <p style="color: var(--text-secondary); font-size: 0.85rem;">${t('searchEmptySub')}</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(subj => {
      const primaryTitle = isAr ? subj.name_ar : subj.name_en;
      const subTitle = isAr ? subj.name_en : subj.name_ar;
      const coverImg = subj.cover_image || window.DATA?.subjectCovers?.[subj.id] || `assets/covers/${subj.id}.webp`;

      // Real dynamic stats calculation from actual DATA arrays
      const stats = window.DATA && window.DATA.getSubjectStats
        ? window.DATA.getSubjectStats(subj.id)
        : {
            lecturesCount: (window.DATA?.sheets || []).filter(s => s.subject_id === subj.id).length,
            summariesCount: (window.DATA?.summaries || []).filter(s => s.subject_id === subj.id).length,
            examsCount: (window.DATA?.previousExams || []).filter(e => e.subject_id === subj.id).length,
            progress: 0
          };

      const progressVal = stats.progress || 0;
      const lecturesCount = stats.lecturesCount || 0;
      const summariesCount = stats.summariesCount || 0;
      const examsCount = stats.examsCount || 0;

      // Doctor badge: only displayed if real doctor name is specifically set (no dummy fallbacks)
      const doctorName = isAr ? (subj.doctor_name_ar || '') : (subj.doctor_name_en || '');

      return `
        <div class="subject-card" onclick="window.SubjectModal.open('${subj.id}');" role="button" tabindex="0" aria-label="${primaryTitle}">
          <!-- 130px Subject Cover Header -->
          <div class="subject-cover-wrap card-banner">
            <img src="${coverImg}" alt="${primaryTitle}" class="subject-card-cover subject-cover-img" loading="lazy" decoding="async" onload="this.classList.add('loaded')" onerror="this.onerror=null; this.src='assets/covers/gen-med.webp'; this.classList.add('loaded');" />
            <div class="subject-cover-gradient"></div>
            <span class="subject-code-badge">${subj.code || 'DENT-300'}</span>
          </div>

          <!-- Subject Content Details -->
          <div class="subject-card-body card-body">
            <div>
              <h3 class="subject-title-primary">${primaryTitle}</h3>
              <div class="subject-title-sub">${subTitle}</div>

              <!-- Doctor Badge with Icon (Only displayed when real doctor is assigned) -->
              ${doctorName ? `
                <div class="card-doctor-badge" title="${isAr ? 'أستاذ المادة' : 'Subject Faculty Head'}">
                  <i data-lucide="user-check"></i>
                  <span>${doctorName}</span>
                </div>
              ` : ''}

              <!-- Study Progress Bar (Dynamic: 0% when no handouts/lectures added) -->
              <div class="card-progress-wrap">
                <div class="card-progress-meta">
                  <span>${t('studyProgress')}</span>
                  <span class="card-progress-percent">${progressVal}% ${t('completed')}</span>
                </div>
                <div class="card-progress-track">
                  <div class="card-progress-fill" style="width: ${progressVal}%;"></div>
                </div>
              </div>

              <!-- Content Breakdown Badges (Dynamic from real data: 0 lectures • 0 summaries • 0 exams) -->
              <div class="card-stats-badges">
                <span class="card-stat-pill">
                  <img src="assets/icons/sheets_cat.png" alt="Lectures" style="width: 14px; height: 14px; border-radius: 50%; object-fit: cover;" />
                  ${lecturesCount} ${t('lectures')}
                </span>
                <span class="card-stat-pill">
                  <i data-lucide="book-marked"></i>
                  ${summariesCount} ${t('summaries')}
                </span>
                <span class="card-stat-pill">
                  <i data-lucide="archive"></i>
                  ${examsCount} ${t('exams')}
                </span>
              </div>
            </div>

            <!-- Quick Action Button ("تصفح المحتوى ⬅️") -->
            <button class="btn-explore-subject" onclick="event.stopPropagation(); window.SubjectModal.open('${subj.id}');" aria-label="${t('browseContent')}">
              <span>${t('browseContent')}</span>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Ensure already cached images trigger smooth display immediately
    grid.querySelectorAll('.subject-cover-img').forEach(img => {
      if (img.complete) img.classList.add('loaded');
    });

    if (window.lucide) window.lucide.createIcons();
  },

  setupListeners() {
    if (HomePage.countdownInterval) {
      clearInterval(HomePage.countdownInterval);
      HomePage.countdownInterval = null;
    }

    const nextExam = HomePage.getNextExam(false);

    HomePage.countdownInterval = setInterval(() => {
      const cdDays = document.getElementById('cd-days');
      const cdHours = document.getElementById('cd-hours');
      const cdMins = document.getElementById('cd-mins');
      const cdSecs = document.getElementById('cd-secs');

      if (!cdDays || !cdHours || !cdMins || !cdSecs) {
        clearInterval(HomePage.countdownInterval);
        HomePage.countdownInterval = null;
        return;
      }

      const countdown = HomePage.calculateCountdown(nextExam.dateStr);
      cdDays.textContent = String(countdown.days).padStart(2, '0');
      cdHours.textContent = String(countdown.hours).padStart(2, '0');
      cdMins.textContent = String(countdown.minutes).padStart(2, '0');
      cdSecs.textContent = String(countdown.seconds).padStart(2, '0');
    }, 1000);

    const searchInput = document.getElementById('header-search-input');
    if (searchInput) {
      searchInput.oninput = (e) => {
        HomePage.searchQuery = e.target.value.trim();
        HomePage.renderSubjectsList(window.DATA.getSubjects(), false);
      };
    }
  }
};

window.HomePage = HomePage;
