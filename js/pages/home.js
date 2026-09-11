/**
 * KURO FANGS — HOME DASHBOARD (ACADEMIA DESIGN SYSTEM)
 * 12 Subjects with Cover Headers, Study Progress Bars, Doctor Badges & Micro-Interactions
 */

const HomePage = {
  searchQuery: '',
  loadingTimeout: null,

  render(container) {
    const t = (k) => window.I18N.t(k);
    const subjects = window.DATA.getSubjects();

    container.innerHTML = `
      <!-- Hero Title Bar (Simple, Clean Header) -->
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
                  <i data-lucide="file-text"></i>
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
