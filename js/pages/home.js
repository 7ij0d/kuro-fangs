/**
 * KURO FANGS — Modern Redesigned Dashboard (Home Page)
 * Clean, Academic, Fast, and Intuitive UI/UX
 */

export default async function renderHome(container, params) {
  const { default: KF_DATA }  = await import('../data.js');
  const { default: KF_STORE } = await import('../store.js');
  const { default: KURONI }   = await import('../kuroni.js');

  container.innerHTML = KURONI.loadingHTML('جاري تحميل لوحة التحكم...', 'md');

  if (!KF_DATA.subjects) await KF_DATA.init();

  const subjects = KF_DATA.getSubjects(3);
  const latest   = KF_DATA.getLatestSheets(8);
  const alerts   = KF_DATA.getPinnedAlerts();

  // Dynamic Grade Calculation from store
  const savedGrades = KF_STORE.getCalculatorData();
  let totalScore = 0;
  let gradedCount = 0;
  subjects.forEach(s => {
    const g = savedGrades[s.id];
    if (g) {
      const sum = (parseFloat(g.cw) || 0) + (parseFloat(g.prac) || 0) + (parseFloat(g.oral) || 0) + (parseFloat(g.final) || 0);
      if (sum > 0) {
        totalScore += sum;
        gradedCount++;
      }
    }
  });
  const avgGrade = gradedCount > 0 ? Math.round(totalScore / gradedCount) : 85;
  const gradeLabel = avgGrade >= 85 ? 'ممتاز' : avgGrade >= 75 ? 'جيد جداً' : avgGrade >= 65 ? 'جيد' : 'مقبول';

  // Type metadata for badges
  const typeMeta = {
    sheet:     { label: 'ملزمة', bg: '#DCFCE7', color: '#15803D', icon: '📄' },
    summary:   { label: 'ملخص', bg: '#E0F2FE', color: '#0369A1', icon: '📝' },
    recording: { label: 'تسجيل', bg: '#FEE2E2', color: '#B91C1C', icon: '🎥' },
    images:    { label: 'صور', bg: '#F3E8FF', color: '#6D28D9', icon: '🖼️' },
    questions: { label: 'أسئلة', bg: '#FFEDD5', color: '#C2410C', icon: '❓' },
    flashcards:{ label: 'بطاقات', bg: '#FEF3C7', color: '#B45309', icon: '🃏' },
    quiz:      { label: 'كويز', bg: '#ECFDF5', color: '#047857', icon: '📋' },
  };

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">الرئيسية</h1>
      <p class="page-subtitle">نظرة عامة على مقررات الفصل، الامتحانات القادمة، وأحدث الملازم الدراسية</p>
    </div>

    <div class="page-content animate-page-enter">

      <!-- 1. Search Bar -->
      <div class="section" style="margin-bottom: var(--space-6);">
        <div class="input-wrapper">
          <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input class="search-bar" id="home-search" type="text"
                 placeholder="ابحث عن ملزمة، مقرر، دكتور، موضوع سريري..."
                 oninput="handleHomeSearch(this.value)"/>
        </div>
      </div>

      <!-- 2. 4 Stat Cards Grid -->
      <div class="stat-cards-grid">
        <!-- Stat 1: Active Subjects -->
        <div class="stat-card" onclick="ROUTER.navigate('/subjects')" style="cursor:pointer;" title="عرض المقررات">
          <div class="stat-icon-wrap" style="background:#F0FDF4; color:#16A34A;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
              <path d="M6 6h10"/><path d="M6 10h10"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">${subjects.length} مقرر</div>
            <div class="stat-label">المواد الدراسية النشطة</div>
          </div>
        </div>

        <!-- Stat 2: Upcoming Exams -->
        <div class="stat-card" onclick="ROUTER.navigate('/quizzes')" style="cursor:pointer;" title="عرض الامتحانات">
          <div class="stat-icon-wrap" style="background:#FEF2F2; color:#EF4444;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">2 امتحان</div>
            <div class="stat-label">الامتحانات القادمة (نصفي وعملي)</div>
          </div>
        </div>

        <!-- Stat 3: Average Grade -->
        <div class="stat-card" onclick="ROUTER.navigate('/calculator')" style="cursor:pointer;" title="افتح حاسبة الدرجات">
          <div class="stat-icon-wrap" style="background:#EFF6FF; color:#3B82F6;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">${avgGrade}% <span style="font-size:13px; font-weight:600; color:#16A34A;">(${gradeLabel})</span></div>
            <div class="stat-label">المعدل العام التقديري</div>
          </div>
        </div>

        <!-- Stat 4: Days Remaining -->
        <div class="stat-card" onclick="ROUTER.navigate('/alerts')" style="cursor:pointer;" title="عرض جدول الامتحانات">
          <div class="stat-icon-wrap" style="background:#FFFBEB; color:#F59E0B;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">18 يوم</div>
            <div class="stat-label">لأقرب امتحان (أمراض الفم)</div>
          </div>
        </div>
      </div>

      <!-- 3. Important Alerts Section (Compact Horizontal Notification Cards) -->
      ${alerts.length > 0 ? `
        <div class="section">
          <div class="section-header">
            <h2 class="section-title"><span class="title-dot"></span> التنبيهات المهمة</h2>
            <a class="section-action" onclick="ROUTER.navigate('/alerts')">عرض كل التنبيهات (${alerts.length})</a>
          </div>
          <div class="compact-alerts-list">
            ${alerts.map(a => {
              const subj = KF_DATA.getSubjectById(a.subject_id);
              const isExam = a.severity === 'exam';
              const isWarn = a.severity === 'warning';
              const borderClass = isExam ? 'alert-exam' : isWarn ? 'alert-warning' : 'alert-info';
              const iconEmoji = isExam ? '🎯' : isWarn ? '⚠️' : 'ℹ️';
              const iconBg = isExam ? '#FEE2E2' : isWarn ? '#FEF3C7' : '#E0F2FE';
              return `
                <div class="compact-alert-card ${borderClass}" onclick="ROUTER.navigate('/alerts')" role="button" tabindex="0">
                  <div class="compact-alert-main">
                    <div class="compact-alert-icon" style="background:${iconBg};">
                      ${iconEmoji}
                    </div>
                    <div class="compact-alert-text">
                      <div class="compact-alert-title">${a.title_ar} ${subj ? `<span style="font-size:11px; font-weight:normal; color:${subj.color}; margin-right:6px;">[${subj.name_ar}]</span>` : ''}</div>
                      <div class="compact-alert-msg">${a.message_ar}</div>
                    </div>
                  </div>
                  <div class="compact-alert-meta">
                    <span class="compact-alert-date">${a.date}</span>
                    <span class="tag ${isExam ? 'tag-exam' : 'tag-warning'}">${isExam ? 'امتحان' : 'هام'}</span>
                  </div>
                </div>`;
            }).join('')}
          </div>
        </div>` : ''}

      <!-- 4. Quick Access 6-Grid Section -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title"><span class="title-dot"></span> الوصول السريع</h2>
        </div>
        <div class="quick-grid-6">
          <!-- 1. المواد الدراسية -->
          <div class="quick-nav-card" onclick="ROUTER.navigate('/subjects')">
            <div class="quick-nav-left">
              <div class="quick-nav-icon" style="background:#F0FDF4; color:#16A34A;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/>
                </svg>
              </div>
              <div class="quick-nav-info">
                <div class="quick-nav-title">المواد الدراسية</div>
                <div class="quick-nav-desc">12 مادة تخصصية وشيتاتها</div>
              </div>
            </div>
            <div class="quick-nav-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            </div>
          </div>

          <!-- 2. الامتحانات -->
          <div class="quick-nav-card" onclick="ROUTER.navigate('/quizzes')">
            <div class="quick-nav-left">
              <div class="quick-nav-icon" style="background:#FEF2F2; color:#EF4444;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
              </div>
              <div class="quick-nav-info">
                <div class="quick-nav-title">الامتحانات</div>
                <div class="quick-nav-desc">كويزات واختبارات تفاعلية فورية</div>
              </div>
            </div>
            <div class="quick-nav-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            </div>
          </div>

          <!-- 3. حاسبة الدرجات -->
          <div class="quick-nav-card" onclick="ROUTER.navigate('/calculator')">
            <div class="quick-nav-left">
              <div class="quick-nav-icon" style="background:#EFF6FF; color:#2563EB;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/>
                </svg>
              </div>
              <div class="quick-nav-info">
                <div class="quick-nav-title">حاسبة الدرجات</div>
                <div class="quick-nav-desc">حساب المعدل ومحاكي الفاينل</div>
              </div>
            </div>
            <div class="quick-nav-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            </div>
          </div>

          <!-- 4. التسجيلات -->
          <div class="quick-nav-card" onclick="ROUTER.navigate('/videos')">
            <div class="quick-nav-left">
              <div class="quick-nav-icon" style="background:#FAF5FF; color:#9333EA;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2"/>
                </svg>
              </div>
              <div class="quick-nav-info">
                <div class="quick-nav-title">التسجيلات</div>
                <div class="quick-nav-desc">تسجيلات المحاضرات والشروحات</div>
              </div>
            </div>
            <div class="quick-nav-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            </div>
          </div>

          <!-- 5. الملخصات -->
          <div class="quick-nav-card" onclick="ROUTER.navigate('/summaries')">
            <div class="quick-nav-left">
              <div class="quick-nav-icon" style="background:#F0FDF4; color:#059669;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z"/><path d="M12 11h4"/><path d="M12 16h4"/>
                </svg>
              </div>
              <div class="quick-nav-info">
                <div class="quick-nav-title">الملخصات</div>
                <div class="quick-nav-desc">كبسولات ومراجعات مكثفة</div>
              </div>
            </div>
            <div class="quick-nav-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            </div>
          </div>

          <!-- 6. بنك الأسئلة -->
          <div class="quick-nav-card" onclick="ROUTER.navigate('/questions')">
            <div class="quick-nav-left">
              <div class="quick-nav-icon" style="background:#FFF7ED; color:#EA580C;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
                </svg>
              </div>
              <div class="quick-nav-info">
                <div class="quick-nav-title">بنك الأسئلة</div>
                <div class="quick-nav-desc">تجميعات MCQs والسنوات السابقة</div>
              </div>
            </div>
            <div class="quick-nav-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 5. Recent Additions (Modern List View) -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title"><span class="title-dot"></span> أحدث الإضافات والملازم</h2>
          <a class="section-action" onclick="ROUTER.navigate('/sheets')">عرض كل الملازم</a>
        </div>
        <div class="recent-list-view">
          ${latest.map(s => {
            const subj = KF_DATA.getSubjectById(s.subject_id);
            const doc  = KF_DATA.getDoctorById(s.doctor_id);
            const tm   = typeMeta[s.type] || typeMeta.sheet;
            return `
              <div class="recent-list-row" onclick="ROUTER.navigate('/sheets/${s.id}')" role="button" tabindex="0">
                <div class="recent-icon-wrap" style="background:${tm.bg};">
                  ${tm.icon}
                </div>
                <span class="recent-type-badge" style="background:${tm.bg}; color:${tm.color};">
                  ${tm.label}
                </span>
                <div class="recent-title" title="${s.title_ar}">
                  ${s.title_ar} ${subj ? `<span style="font-weight:normal; font-size:12px; color:${subj.color}; margin-right:6px;">(${subj.name_ar})</span>` : ''}
                </div>
                <div class="recent-doctor" title="${doc?.name_ar || ''}">
                  👤 ${doc?.name_ar || 'غير محدد'}
                </div>
                <div class="recent-date">
                  ${s.date}
                </div>
                <div class="recent-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
                  </svg>
                </div>
              </div>`;
          }).join('')}
        </div>
      </div>

      <!-- Preclinical Requirements Quick Banner -->
      <div class="card" onclick="ROUTER.navigate('/requirements')" style="padding:18px 24px; display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:var(--space-8); cursor:pointer;">
        <div style="display:flex; align-items:center; gap:14px;">
          <div style="font-size:28px;">🦷</div>
          <div>
            <div style="font-weight:700; font-size:15px; color:#111827;">سجل متطلبات المعمل والفانتوم هيد (Lab Requirements)</div>
            <div style="font-size:12.5px; color:#64748B; margin-top:2px;">تابع تقدمك في متطلبات علاج العصب (Endo)، التحفظي، والاستعاضة الثابتة والمتحركة أولاً بأول</div>
          </div>
        </div>
        <div class="quick-nav-arrow" style="background:#16A34A; color:#FFFFFF;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        </div>
      </div>

      <!-- Footer Branding -->
      <div style="display:flex;align-items:center;justify-content:center;gap:var(--space-3);padding:var(--space-6) 0;opacity:0.45;">
        <span style="font-size:var(--fs-xs);color:var(--color-text-muted);">Kuro Fangs — كلية طب وجراحة الفم والأسنان، جامعة طرابلس</span>
      </div>

    </div>
  `;

  window.handleHomeSearch = (val) => {
    if (val.length > 1) {
      ROUTER.navigate(`/search?q=${encodeURIComponent(val)}`);
    }
  };
}
