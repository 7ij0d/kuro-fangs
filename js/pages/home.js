/**
 * KURO FANGS — HOME DASHBOARD (REDESIGNED ACADEMIA v2)
 * Modern Academic Dashboard with Hero, Quick Access, Continue Learning & Simplified Subject Cards
 */

const HomePage = {
  searchQuery: '',
  loadingTimeout: null,

  /* ─── Time-based greeting ─── */
  getGreeting(t) {
    const h = new Date().getHours();
    if (h < 12) return t('heroGreetingMorning');
    if (h < 17) return t('heroGreetingAfternoon');
    return t('heroGreetingEvening');
  },

  /* ─── Aggregate stats across all subjects ─── */
  getAggregateStats() {
    const subjects = window.DATA ? window.DATA.getSubjects() : [];
    let totalLectures = 0;
    let totalExams = 0;
    let totalProgress = 0;

    subjects.forEach(subj => {
      const stats = window.DATA && window.DATA.getSubjectStats
        ? window.DATA.getSubjectStats(subj.id)
        : {
            lecturesCount: (window.DATA?.sheets || []).filter(s => s.subject_id === subj.id).length,
            examsCount: (window.DATA?.previousExams || []).filter(e => e.subject_id === subj.id).length,
            progress: 0
          };
      totalLectures += stats.lecturesCount || 0;
      totalExams += stats.examsCount || 0;
      totalProgress += stats.progress || 0;
    });

    const avgProgress = subjects.length > 0 ? Math.round(totalProgress / subjects.length) : 0;

    return {
      subjectsCount: subjects.length,
      totalLectures,
      totalExams,
      avgProgress
    };
  },

  /* ─── Get recently visited subjects (from localStorage) ─── */
  getRecentSubjects(limit = 2) {
    try {
      const recentIds = JSON.parse(localStorage.getItem('kf_recent_subjects') || '[]');
      const subjects = window.DATA ? window.DATA.getSubjects() : [];
      const recent = [];

      for (const id of recentIds) {
        const subj = subjects.find(s => s.id === id);
        if (subj && recent.length < limit) recent.push(subj);
      }

      // Fallback: if no recent subjects, show first 2 popular ones
      if (recent.length === 0) {
        const popular = subjects.filter(s => s.is_popular);
        return popular.slice(0, limit).length > 0 ? popular.slice(0, limit) : subjects.slice(0, limit);
      }

      return recent;
    } catch {
      const subjects = window.DATA ? window.DATA.getSubjects() : [];
      return subjects.slice(0, limit);
    }
  },

  handleSubjectClick(subjectId) {
    if (window.SubjectModal && window.SubjectModal.open) {
      window.SubjectModal.open(subjectId);
    }
    setTimeout(() => {
      try {
        HomePage.trackSubjectVisit(subjectId);
      } catch (e) {
        console.error('Error tracking subject visit', e);
      }
    }, 10);
  },

  /* ✨ Track subject visit ✨ */
  trackSubjectVisit(subjectId) {
    try {
      let recent = JSON.parse(localStorage.getItem('kf_recent_subjects') || '[]');
      recent = recent.filter(id => id !== subjectId);
      recent.unshift(subjectId);
      recent = recent.slice(0, 6);
      localStorage.setItem('kf_recent_subjects', JSON.stringify(recent));
    } catch { /* silent */ }
  },

  /* ─── Quick Access item counts ─── */
  getQuickAccessCounts() {
    const questions = window.DATA?.questions || [];
    const exams = window.DATA?.previousExams || [];
    const flashcards = window.DATA?.flashcards || [];
    return {
      questions: questions.length,
      exams: exams.length,
      flashcards: flashcards.length
    };
  },

  /* ══════════════════════════════════════════
     HERO SECTION
     ══════════════════════════════════════════ */
  renderHeroSection(isAr, t) {
    const stats = HomePage.getAggregateStats();
    const greeting = HomePage.getGreeting(t);
    const charImg = window.CharacterThemeSystem ? window.CharacterThemeSystem.getAsset('idle') : 'assets/characters/kuro/Kuro-Idle.png';
    const mascotName = isAr ? 'كورو' : 'Kuro';
    const userName = window.STORE?.getUserInfo?.()?.name || (isAr ? 'طالب' : 'Student');

    return `
      <section class="home-hero">
        <div class="home-hero-content">
          <div class="home-hero-text">
            <h1 class="home-hero-greeting">${greeting}, ${userName} 👋</h1>
            <p class="home-hero-subline">${t('heroSubline')}</p>
          </div>
          <div class="home-hero-mascot">
            <a href="#/rewards" class="home-hero-mascot-link" title="${mascotName}">
              <img src="${charImg}" alt="${mascotName}" class="home-hero-mascot-img kuro-character-img kuro-float" width="52" height="52" loading="lazy" />
            </a>
            <div class="home-hero-mascot-meta">
              <span class="home-hero-mascot-name">✨ ${mascotName}</span>
              <span class="home-hero-mascot-role">${t('heroMascotLine')}</span>
            </div>
          </div>
        </div>
        <div class="home-hero-stats">
          <div class="home-hero-stat">
            <span class="home-hero-stat-num">${stats.subjectsCount}</span>
            <span class="home-hero-stat-label">${t('heroStatSubjects')}</span>
          </div>
          <div class="home-hero-stat-divider"></div>
          <div class="home-hero-stat">
            <span class="home-hero-stat-num">${stats.avgProgress}%</span>
            <span class="home-hero-stat-label">${t('heroStatProgress')}</span>
          </div>
          <div class="home-hero-stat-divider"></div>
          <div class="home-hero-stat">
            <span class="home-hero-stat-num">${stats.totalLectures}</span>
            <span class="home-hero-stat-label">${t('heroStatLectures')}</span>
          </div>
          <div class="home-hero-stat-divider"></div>
          <div class="home-hero-stat">
            <span class="home-hero-stat-num">${stats.totalExams}</span>
            <span class="home-hero-stat-label">${t('heroStatExams')}</span>
          </div>
        </div>
      </section>
    `;
  },

  /* ══════════════════════════════════════════
     TODAY & TOMORROW DAILY LECTURES SECTION
     ══════════════════════════════════════════ */
  renderDailyLecturesSection(isAr, t) {
    const todayDate = new Date();
    const todayDayIndex = todayDate.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
    const tomorrowDate = new Date(todayDate);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrowDayIndex = tomorrowDate.getDay();

    const todaySchedule = window.DATA && typeof window.DATA.getTheoryScheduleForDay === 'function'
      ? window.DATA.getTheoryScheduleForDay(todayDayIndex)
      : { slots: [], isWeekend: todayDayIndex === 5 };

    const tomorrowSchedule = window.DATA && typeof window.DATA.getTheoryScheduleForDay === 'function'
      ? window.DATA.getTheoryScheduleForDay(tomorrowDayIndex)
      : { slots: [], isWeekend: tomorrowDayIndex === 5 };

    const arMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const enMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const todayDateFormatted = isAr
      ? `${todaySchedule.day_ar || ''}، ${todayDate.getDate()} ${arMonths[todayDate.getMonth()]}`
      : `${todaySchedule.day_en || ''}, ${enMonths[todayDate.getMonth()]} ${todayDate.getDate()}`;

    const tomorrowDateFormatted = isAr
      ? `${tomorrowSchedule.day_ar || ''}، ${tomorrowDate.getDate()} ${arMonths[tomorrowDate.getMonth()]}`
      : `${tomorrowSchedule.day_en || ''}, ${enMonths[tomorrowDate.getMonth()]} ${tomorrowDate.getDate()}`;

    const nowH = todayDate.getHours();
    const nowM = todayDate.getMinutes();
    const nowTotalMin = nowH * 60 + nowM;

    const getSlotLiveStatus = (slot) => {
      const startMin = (slot.startHour || 8) * 60;
      const endMin = (slot.endHour || 10) * 60;
      if (nowTotalMin >= startMin && nowTotalMin < endMin) {
        return { label: isAr ? 'مباشرة الآن' : 'Live Now', badgeClass: 'slot-status-live' };
      } else if (nowTotalMin < startMin) {
        return { label: isAr ? 'قادمة' : 'Upcoming', badgeClass: 'slot-status-upcoming' };
      } else {
        return { label: isAr ? 'انتهت' : 'Completed', badgeClass: 'slot-status-completed' };
      }
    };

    const renderColumnContent = (schedule, isToday) => {
      if (schedule.isWeekend || !schedule.slots || schedule.slots.length === 0) {
        const charImg = window.CharacterThemeSystem ? window.CharacterThemeSystem.getAsset('reading') : 'assets/characters/kuro/Kuro-Reading.png';
        return `
          <div class="home-lecture-weekend-card">
            <div class="weekend-mascot-wrap">
              <img src="${charImg}" alt="Kuro Relax" class="weekend-mascot-img kuro-float" width="52" height="52" loading="lazy" />
            </div>
            <h4 class="weekend-title">${isAr ? 'عطلة نهاية الأسبوع ☕' : 'Weekend Break ☕'}</h4>
            <p class="weekend-desc">${isAr ? 'لا توجد محاضرات نظرية مقررة. فرصة ممتازة للمراجعة الذاتية أو إنجاز كويزات كورو!' : 'No theoretical lectures scheduled today. A great time to study handouts with Kuro!'}</p>
            <a href="#/sheets" class="btn btn-secondary btn-sm" style="font-size: 0.75rem; gap: 6px; padding: 5px 14px; margin-top: 4px; display: inline-flex; border-radius: 8px;">
              <i data-lucide="book-open" style="width: 14px; height: 14px;"></i>
              <span>${isAr ? 'تصفح شيتات المواد' : 'Browse Handouts'}</span>
            </a>
          </div>
        `;
      }

      return `
        <div class="home-daily-slots-list">
          ${schedule.slots.map(slot => {
            const status = isToday ? getSlotLiveStatus(slot) : null;
            return `
              <div class="home-lecture-card" data-subject="${slot.subject_id}" style="--slot-color: ${slot.color || '#0284C7'}; border-inline-start-color: ${slot.color || '#0284C7'};" role="button" tabindex="0" title="${isAr ? 'انقر لفتح المادة وشيتاتها' : 'Click to open subject'}">
                <div class="home-lecture-top-row">
                  <div class="home-lecture-code-time">
                    <span class="home-lecture-code">${slot.code}</span>
                    <span class="home-lecture-time">
                      <i data-lucide="clock" style="width: 13px; height: 13px;"></i>
                      <span>${slot.time}</span>
                    </span>
                  </div>
                  ${status ? `<span class="home-lecture-status-pill ${status.badgeClass}">${status.label}</span>` : `
                    <span class="home-lecture-status-pill slot-status-upcoming">${isAr ? 'مجدولة غداً' : 'Tomorrow'}</span>
                  `}
                </div>
                <h4 class="home-lecture-title">${isAr ? slot.subject_ar : slot.subject_en}</h4>
                <div class="home-lecture-bottom-row">
                  <span class="home-lecture-hall">
                    <i data-lucide="map-pin" style="width: 13px; height: 13px; color: #38BDF8;"></i>
                    <span>${isAr ? slot.hall_ar : slot.hall_en}</span>
                  </span>
                  <span class="home-lecture-action-hint">
                    <span>${isAr ? 'فتح المادة' : 'Open'}</span>
                    <i data-lucide="${isAr ? 'arrow-left' : 'arrow-right'}" style="width: 12px; height: 12px;"></i>
                  </span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    };

    return `
      <section class="home-daily-lectures-section">
        <div class="home-section-header" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
          <div>
            <h2 class="home-section-title" style="display: inline-flex; align-items: center; gap: 8px;">
              <i data-lucide="calendar-days" style="width: 20px; height: 20px; color: #38BDF8;"></i>
              <span>${isAr ? 'محاضرات اليوم ومحاضرات الغد' : "Today & Tomorrow's Lectures"}</span>
            </h2>
            <p class="home-section-sub">${isAr ? 'الجدول النظري المعتمد لدفعة طب وجراحة الفم والأسنان — مدرج 2' : 'Official Faculty of Dentistry Lecture Timetable — Auditorium 2'}</p>
          </div>
          <a href="#/lecture-schedule" class="btn btn-secondary btn-sm" style="font-size: 0.78rem; font-weight: 700; gap: 6px; padding: 6px 12px; display: inline-flex; align-items: center; border-radius: 8px; color: #38BDF8;">
            <i data-lucide="calendar" style="width: 14px; height: 14px;"></i>
            <span>${isAr ? 'الجدول الأسبوعي الكامل' : 'Weekly Schedule'}</span>
            <i data-lucide="${isAr ? 'arrow-left' : 'arrow-right'}" style="width: 13px; height: 13px;"></i>
          </a>
        </div>

        <div class="home-daily-lectures-grid">
          <!-- Today's Panel -->
          <div class="home-daily-column today-column">
            <div class="home-daily-col-header">
              <div class="home-daily-col-title-wrap">
                <span class="home-daily-col-badge today-badge">
                  <span style="width: 6px; height: 6px; border-radius: 50%; background: #34D399; display: inline-block;"></span>
                  <span>${isAr ? 'محاضرات اليوم' : "Today's Lectures"}</span>
                </span>
                <h3 class="home-daily-day-name">${todayDateFormatted}</h3>
              </div>
              <span class="home-daily-count-badge">
                ${todaySchedule.slots && todaySchedule.slots.length > 0 ? `${todaySchedule.slots.length} ${isAr ? 'محاضرات' : 'slots'}` : (isAr ? 'عطلة' : 'Off')}
              </span>
            </div>
            ${renderColumnContent(todaySchedule, true)}
          </div>

          <!-- Tomorrow's Panel -->
          <div class="home-daily-column tomorrow-column">
            <div class="home-daily-col-header">
              <div class="home-daily-col-title-wrap">
                <span class="home-daily-col-badge tomorrow-badge">
                  <i data-lucide="clock" style="width: 12px; height: 12px;"></i>
                  <span>${isAr ? 'محاضرات الغد' : "Tomorrow's Lectures"}</span>
                </span>
                <h3 class="home-daily-day-name">${tomorrowDateFormatted}</h3>
              </div>
              <span class="home-daily-count-badge">
                ${tomorrowSchedule.slots && tomorrowSchedule.slots.length > 0 ? `${tomorrowSchedule.slots.length} ${isAr ? 'محاضرات' : 'slots'}` : (isAr ? 'عطلة' : 'Off')}
              </span>
            </div>
            ${renderColumnContent(tomorrowSchedule, false)}
          </div>
        </div>
      </section>
    `;
  },

  /* ══════════════════════════════════════════
     QUICK ACCESS SECTION
     ══════════════════════════════════════════ */
  renderQuickAccess(isAr, t) {
    const counts = HomePage.getQuickAccessCounts();

    const items = [
      { icon: 'help-circle', title: t('qaQuestionBank'), count: counts.questions + counts.exams, unit: t('qaQuestions'), route: '#/questions', color: 'var(--brand-burgundy)' },
      { icon: 'headphones', img: 'assets/icons/recordings_icon.png', title: isAr ? 'التسجيلات الصوتية' : 'Audio Recordings', count: '', unit: '', route: '#/recordings', color: '#0284C7' },
      { icon: 'calendar',    title: isAr ? 'جدول المحاضرات النظري' : 'Theory Schedule',    count: '',               unit: '',               route: '#/lecture-schedule', color: '#059669' },
      { icon: 'file-check-2', title: isAr ? 'جداول الامتحانات الرسمية' : 'Exam Schedule', count: '', unit: '', route: '#/exams', color: '#D97706' }
    ];

    return `
      <section class="home-quick-access">
        <div class="home-section-header">
          <h2 class="home-section-title">${t('quickAccessTitle')}</h2>
        </div>
        <div class="home-quick-access-grid">
          ${items.map(item => `
            <a href="${item.route}" class="home-qa-card">
              <div class="home-qa-icon" style="color: ${item.color};">
                ${item.img ? `<img src="${item.img}" alt="${item.title}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover; border: 1.5px solid ${item.color};" />` : `<i data-lucide="${item.icon}"></i>`}
              </div>
              <div class="home-qa-meta">
                <span class="home-qa-title">${item.title}</span>
                ${item.count !== '' ? `<span class="home-qa-count">${item.count} ${item.unit}</span>` : ''}
              </div>
              <i data-lucide="${isAr ? 'chevron-left' : 'chevron-right'}" class="home-qa-arrow"></i>
            </a>
          `).join('')}
        </div>
      </section>
    `;
  },

  /* ══════════════════════════════════════════
     CONTINUE LEARNING SECTION
     ══════════════════════════════════════════ */
  renderContinueLearning(isAr, t) {
    const recentSubjects = HomePage.getRecentSubjects(2);

    if (recentSubjects.length === 0) return '';

    const cards = recentSubjects.map(subj => {
      const name = isAr ? subj.name_ar : subj.name_en;
      const coverImg = subj.cover_image || window.DATA?.subjectCovers?.[subj.id] || `assets/covers/${subj.id}.webp`;

      const stats = window.DATA && window.DATA.getSubjectStats
        ? window.DATA.getSubjectStats(subj.id)
        : { lecturesCount: 0, progress: 0 };

      const progress = stats.progress || 0;
      const lecturesCount = stats.lecturesCount || 0;

      return `
        <div class="home-cl-card" onclick="window.SubjectModal.open('${subj.id}');" role="button" tabindex="0">
          <div class="home-cl-cover">
            <img src="${coverImg}" alt="${name}" loading="lazy" decoding="async" onload="this.classList.add('loaded')" onerror="this.onerror=null; this.src='assets/covers/gen-med.webp'; this.classList.add('loaded');" />
            <div class="home-cl-cover-overlay"></div>
            <span class="home-cl-code">${subj.code || 'DENT-300'}</span>
          </div>
          <div class="home-cl-body">
            <h3 class="home-cl-name">${name}</h3>
            <span class="home-cl-meta">${lecturesCount} ${t('lectures')}</span>
            <div class="home-cl-progress-wrap">
              <div class="home-cl-progress-track">
                <div class="home-cl-progress-fill" style="width: ${progress}%;"></div>
              </div>
              <span class="home-cl-progress-text">${progress}%</span>
            </div>
            <button class="home-cl-btn" onclick="event.stopPropagation(); window.SubjectModal.open('${subj.id}');">
              <span>${t('continueBtn')}</span>
              <i data-lucide="${isAr ? 'arrow-left' : 'arrow-right'}"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    return `
      <section class="home-continue-learning">
        <div class="home-section-header">
          <h2 class="home-section-title">${t('continueLearnTitle')}</h2>
          <p class="home-section-sub">${t('continueLearnSub')}</p>
        </div>
        <div class="home-cl-grid">
          ${cards}
        </div>
      </section>
    `;
  },

  /* ══════════════════════════════════════════
     SUBJECTS SECTION HEADER
     ══════════════════════════════════════════ */
  renderSubjectsSectionHeader(isAr, t, count) {
    return `
      <div class="home-subjects-header">
        <div class="home-subjects-header-text">
          <h2 class="home-section-title">${t('yourSubjects')}</h2>
          <span class="home-section-count">${count} ${t('subjectsAvailable')}</span>
        </div>
      </div>
    `;
  },

  /* ══════════════════════════════════════════
     MAIN RENDER
     ══════════════════════════════════════════ */
  render(container) {
    const t = (k) => window.I18N.t(k);
    const isAr = window.I18N.getLang() === 'ar';
    const subjects = window.DATA.getSubjects();

    container.innerHTML = `
      ${HomePage.renderHeroSection(isAr, t)}
      ${HomePage.renderDailyLecturesSection(isAr, t)}
      ${HomePage.renderQuickAccess(isAr, t)}
      ${HomePage.renderContinueLearning(isAr, t)}

      <!-- Subjects Section -->
      ${HomePage.renderSubjectsSectionHeader(isAr, t, subjects.length)}
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
          <div class="skeleton-line progress skeleton-shimmer"></div>
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

    let filtered = [...allSubjects];

    // Search filtering
    if (HomePage.searchQuery) {
      const q = HomePage.searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        (s.name_ar && s.name_ar.toLowerCase().includes(q)) ||
        (s.name_en && s.name_en.toLowerCase().includes(q)) ||
        (s.code && s.code.toLowerCase().includes(q))
      );
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="home-empty-state">
          <div class="home-empty-icon">🔍</div>
          <h3 class="home-empty-title">${t('searchEmptyTitle')}</h3>
          <p class="home-empty-sub">${t('searchEmptySub')}</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(subj => {
      const primaryTitle = isAr ? subj.name_ar : subj.name_en;
      const subTitle = isAr ? subj.name_en : subj.name_ar;
      const coverImg = subj.cover_image || window.DATA?.subjectCovers?.[subj.id] || `assets/covers/${subj.id}.webp`;

      const stats = window.DATA && window.DATA.getSubjectStats
        ? window.DATA.getSubjectStats(subj.id)
        : {
            lecturesCount: (window.DATA?.sheets || []).filter(s => s.subject_id === subj.id).length,
            examsCount: (window.DATA?.previousExams || []).filter(e => e.subject_id === subj.id).length,
            progress: 0
          };

      const progressVal = stats.progress || 0;
      const lecturesCount = stats.lecturesCount || 0;
      const examsCount = stats.examsCount || 0;

      return `
        <div class="subject-card" onclick="window.HomePage.handleSubjectClick('${subj.id}');" role="button" tabindex="0" aria-label="${primaryTitle}">
          <!-- Subject Cover -->
          <div class="subject-cover-wrap card-banner">
            <img src="${coverImg}" alt="${primaryTitle}" class="subject-card-cover subject-cover-img" width="600" height="337" loading="lazy" decoding="async" onload="this.classList.add('loaded')" onerror="this.onerror=null; this.src='assets/covers/gen-med.webp'; this.classList.add('loaded');" />
            <div class="subject-cover-gradient"></div>
            <span class="subject-code-badge">${subj.code || 'DENT-300'}</span>
          </div>

          <!-- Card Body -->
          <div class="subject-card-body card-body">
            <div>
              <h3 class="subject-title-primary">${primaryTitle}</h3>
              <div class="subject-title-sub">${subTitle}</div>

              <!-- Progress Bar -->
              <div class="card-progress-wrap">
                <div class="card-progress-meta">
                  <span>${t('studyProgress')}</span>
                  <span class="card-progress-percent">${progressVal}%</span>
                </div>
                <div class="card-progress-track">
                  <div class="card-progress-fill" style="width: ${progressVal}%;"></div>
                </div>
              </div>

              <!-- Compact Stats -->
              <div class="card-stats-compact">
                <span class="card-stat-item">
                  <i data-lucide="file-text"></i>
                  ${lecturesCount} ${t('lectures')}
                </span>
                <span class="card-stat-sep">•</span>
                <span class="card-stat-item">
                  <i data-lucide="archive"></i>
                  ${examsCount} ${t('exams')}
                </span>
              </div>
            </div>

            <!-- Action Button -->
            <button class="btn-explore-subject" onclick="event.stopPropagation(); window.HomePage.handleSubjectClick('${subj.id}');" aria-label="${t('openSubject')}">
              <span>${t('openSubject')}</span>
              <i data-lucide="${isAr ? 'arrow-left' : 'arrow-right'}"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Mark cached images as loaded
    grid.querySelectorAll('.subject-cover-img').forEach(img => {
      if (img.complete) img.classList.add('loaded');
    });

    if (window.lucide) window.lucide.createIcons();
  },

  setupListeners() {
    const searchInput = document.getElementById('header-search-input');
    if (searchInput) {
      searchInput.oninput = (e) => {
        HomePage.searchQuery = e.target.value.trim();
        HomePage.renderSubjectsList(window.DATA.getSubjects(), false);
      };
    }

    document.querySelectorAll('.home-lecture-card').forEach(card => {
      card.addEventListener('click', () => {
        const subjId = card.getAttribute('data-subject');
        if (subjId) {
          HomePage.handleSubjectClick(subjId);
        }
      });
    });
  }
};

window.HomePage = HomePage;
