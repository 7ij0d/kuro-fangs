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
      id: 'alt_2026_01',
      title_ar: 'إعلان هام لطلبة الدفعة 33 والطلبة التكميلي (تأجيل الامتحانات وتجديد القيد)',
      title_en: 'Important Notice for Batch 33 & Complementary Students',
      dept_ar: 'قسم الدراسة والامتحانات – كلية طب وجراحة الفم والأسنان، جامعة طرابلس',
      dept_en: 'Study & Exams Department — Faculty of Dentistry, University of Tripoli',
      date: '2026/09/11',
      badge_ar: 'هام جداً • تأجيل وتسجيل',
      badge_en: 'Urgent • Registration & Schedule',
      badge_type: 'official',
      cover: 'assets/icons/faculty_logo.png',
      summary_ar: 'الموافقة على دخول جميع الطلبة وتأجيل الدور الثاني لـ 21 سبتمبر وتجديد القيد للطلبة التكميلي.',
      summary_en: 'Approval for all students to sit exams, 2nd round postponed to Sept 21, and registration renewal dates.',
      details_ar: '1. تمت الموافقة على دخول جميع الطلبة (دفعة 33 أو تكميلي) للامتحانات دون استثناء (مقرر واحد أو أكثر).\n2. تأجيل بداية امتحانات الدور الثاني إلى يوم الاثنين 21/09/2026.\n3. تجديد القيد للطلبة التكميلي خلال أيام: الأحد 13/09، الاثنين 14/09، الثلاثاء 15/09/2026 وتجديد الاسم بمكتب الدراسة والامتحانات.\nتنبيه: لن يُسمح بدخول الامتحان لأي طالب تكميلي ما لم يجدد قيده ويسجل اسمه.',
      details_en: '1. Entry approved for all students in 2nd round exams regardless of failed courses.\n2. 2nd round exams postponed to Monday 21/09/2026.\n3. Complementary student registration renewal on Sept 13, 14, and 15, 2026 at the Study & Exams office.'
    },
    {
      id: 'alt_2026_02',
      title_ar: 'جدول الامتحانات النهائية للدور الثاني لطلبة السنة الرابعة (2025 / 2026)',
      title_en: 'Final Exams Schedule - 2nd Round (Year 4, 2025/2026)',
      dept_ar: 'قسم الدراسة والامتحانات – كلية طب وجراحة الفم والأسنان، جامعة طرابلس',
      dept_en: 'Study & Exams Department — Faculty of Dentistry, University of Tripoli',
      date: '2026/09/11',
      badge_ar: 'امتحانات • السنة الرابعة',
      badge_en: 'Exams • Year 4',
      badge_type: 'exam',
      cover: 'assets/icons/faculty_logo.png',
      summary_ar: 'مواعيد الامتحانات النهائية للدور الثاني من الساعة 09:00 صباحاً إلى 12:00 ظهراً تحت المسرح.',
      summary_en: 'Final exams for Year 4 from 09:00 AM to 12:00 PM under the theater.',
      details_ar: 'تعلن الكلية عن مواعيد الامتحانات النهائية للدور الثاني لطلبة السنة الرابعة.\n• موعد الامتحان: من الساعة 09:00 صباحاً إلى 12:00 ظهراً.\n• المكان: تحت المسرح.\nيرجى الالتزام بالحضور قبل بداية الامتحان بوقت كافٍ.',
      details_en: 'Final exams for Year 4 (2nd Round). Time: 09:00 AM – 12:00 PM. Location: Under the Theater.'
    },
    {
      id: 'alt_2026_03',
      title_ar: 'إطلاق الصفحة الإلكترونية الرسمية للطلبة (tables.dentaluot.com)',
      title_en: 'Launch of Official Student Web Portal (tables.dentaluot.com)',
      dept_ar: 'د. زياد محمد نصر (رئيس قسم الدراسة والامتحانات)',
      dept_en: 'Dr. Ziad Mohamed Nasr — Head of Study & Exams Dept',
      date: '2026/09/11',
      badge_ar: 'موقع رسمي • بوابة الطلبة',
      badge_en: 'Official Portal • Students',
      badge_type: 'alert',
      cover: 'assets/icons/faculty_logo.png',
      summary_ar: 'إطلاق الصفحة الرسمية للاطلاع على الجداول والخطة والنتائج وجداول الامتحانات.',
      summary_en: 'Official web portal launched for schedules, study plans, results, and examinations.',
      details_ar: 'تم إطلاق الصفحة الإلكترونية الرسمية للاطلاع على الجداول الدراسية، الخطة الدراسية، النتائج، وجداول الامتحانات.\n🔗 رابط الدخول المباشر: http://tables.dentaluot.com\nيرجى اعتماد الصفحة كمصدر رسمي للمعلومات الأكاديمية.',
      details_en: 'Official student portal launched at http://tables.dentaluot.com for schedules and results.',
      url: 'http://tables.dentaluot.com'
    },
    {
      id: 'alt_2026_04',
      title_ar: 'الخطة الدراسية الرسمية للعام الجامعي 2026 / 2027',
      title_en: 'Official Academic Plan for Year 2026 / 2027',
      dept_ar: 'قسم الدراسة والامتحانات – كلية طب وجراحة الفم والأسنان، جامعة طرابلس',
      dept_en: 'Study & Exams Department — Faculty of Dentistry, University of Tripoli',
      date: '2026/09/11',
      badge_ar: 'الخطة الدراسية • 2026 / 2027',
      badge_en: 'Academic Plan • 2026 / 2027',
      badge_type: 'official',
      cover: 'assets/icons/faculty_logo.png',
      summary_ar: 'مواعيد الدراسة والامتحانات والمراجعة الموضوعية وإعلان النتائج للعام 2026 / 2027.',
      summary_en: 'Timelines for classes, exams, objective review, and results release for 2026/2027.',
      details_ar: 'تنشر الكلية الخطة الدراسية المتضمنة مواعيد الدراسة والامتحانات والمراجعة الموضوعية وإعلان النتائج للعام 2026 / 2027.\nملاحظة: المواعيد المرتبطة بالمناسبات الهجرية تخضع لما يصدر عن الجهات الرسمية.',
      details_en: 'Academic schedule and exam plan published for the 2026/2027 academic year.'
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

    const rawAlerts = window.DATA ? window.DATA.getAlerts() : [];
    const activeNews = (rawAlerts && rawAlerts.length > 0)
      ? rawAlerts.map(item => ({
          id: item.id,
          title_ar: item.title_ar,
          title_en: item.title_en || item.title_ar,
          dept_ar: item.publisher_ar || 'قسم الدراسة والامتحانات – كلية طب وجراحة الفم والأسنان',
          dept_en: item.publisher_en || 'Study & Exams Dept — Faculty of Dentistry',
          date: item.date || '2026/09/11',
          badge_ar: item.badge_ar || 'إعلان رسمي',
          badge_en: item.badge_en || 'Official Notice',
          badge_type: item.type === 'urgent' ? 'official' : (item.type === 'exam' ? 'exam' : 'alert'),
          cover: item.cover || 'assets/icons/faculty_logo.png',
          summary_ar: item.content_ar ? item.content_ar.split('\n')[0] : '',
          summary_en: item.content_en || item.content_ar,
          details_ar: item.content_ar,
          details_en: item.content_en || item.content_ar,
          url: item.url || null
        }))
      : HomePage.facultyNews;

    HomePage.currentActiveNews = activeNews;

    const newsCardsHTML = activeNews.map(item => {
      const title = isAr ? item.title_ar : item.title_en;
      const dept = isAr ? item.dept_ar : item.dept_en;
      const badge = isAr ? item.badge_ar : item.badge_en;
      const summary = isAr ? item.summary_ar : item.summary_en;

      return `
        <article class="faculty-news-card" onclick="window.HomePage.openNewsModal('${item.id}')" role="button" tabindex="0" aria-label="${title}">
          <div class="news-card-media">
            <img src="${item.cover || 'assets/icons/faculty_logo.png'}" alt="${title}" class="news-card-img" style="object-fit: contain; padding: 6px; background: var(--bg-card);" onerror="this.src='assets/icons/faculty_logo.png'" />
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
    const pool = (HomePage.currentActiveNews && HomePage.currentActiveNews.length > 0) ? HomePage.currentActiveNews : HomePage.facultyNews;
    const item = pool.find(n => n.id === newsId) || HomePage.facultyNews.find(n => n.id === newsId);
    if (!item) return;

    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
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

        <div style="background: var(--bg-surface-subtle); border-radius: 8px; padding: 16px; font-size: 0.9rem; line-height: 1.7; color: var(--text-secondary); margin-bottom: 20px; white-space: pre-line;">
          ${details}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap;">
          ${item.url ? `
            <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding: 8px 16px; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px;">
              <i data-lucide="external-link" style="width: 14px; height: 14px;"></i>
              <span>${isAr ? 'فتح البوابة الرسمية' : 'Open Portal'}</span>
            </a>
          ` : '<span></span>'}
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
    const equippedSkin = window.STORE ? window.STORE.getEquippedSkinData() : { image: 'assets/fox_skins/fox_skin_1.jpg', name_ar: 'الثعلب الكلاسيكي', name_en: 'Classic Kuro Fox' };

    container.innerHTML = `
      <!-- 1. Faculty Official News & Next Exam Countdown Section -->
      ${HomePage.renderFacultyOverview(isAr, t)}

      <!-- 2. The 12 Academic Subjects Showcase Section -->
      <div class="subjects-hero-bar">
        <div class="hero-text-wrap">
          <h1 id="hero-title">${t('heroTitle')}</h1>
        </div>

        <!-- In-Flow Compact Hero Mascot Widget (<= 180px, no absolute/fixed) -->
        <a href="#/rewards" class="hero-mascot-compact-card" title="${isAr ? 'متجر سكنات الثعلب' : 'Fox Mascot Hub'}">
          <div class="hero-mascot-avatar-wrap">
            <img src="${equippedSkin.image}" alt="${isAr ? equippedSkin.name_ar : equippedSkin.name_en}" class="current-mascot-img hero-mascot-img" />
          </div>
          <div class="hero-mascot-meta">
            <span class="hero-mascot-badge">🦊 ${isAr ? 'الكائن المدرس' : 'Study Mascot'}</span>
            <span class="hero-mascot-name">${isAr ? equippedSkin.name_ar : equippedSkin.name_en}</span>
          </div>
        </a>
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
            <img src="${coverImg}" alt="${primaryTitle}" class="subject-card-cover subject-cover-img" width="600" height="337" loading="lazy" decoding="async" onload="this.classList.add('loaded')" onerror="this.onerror=null; this.src='assets/covers/gen-med.webp'; this.classList.add('loaded');" />
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

            <!-- Quick Action Button -->
            <button class="btn-explore-subject" onclick="event.stopPropagation(); window.SubjectModal.open('${subj.id}');" aria-label="${t('browseContent')}">
              <span>${t('browseContent')}</span>
              <i data-lucide="${isAr ? 'arrow-left' : 'arrow-right'}" style="width: 14px; height: 14px;"></i>
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
