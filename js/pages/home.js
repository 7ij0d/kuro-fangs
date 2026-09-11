/**
 * KURO FANGS — HOME DASHBOARD
 * Modern Medical SaaS Dashboard for Year 3 Dentistry
 */

const HomePage = {
  render(container) {
    const alerts = window.DATA.getAlerts().slice(0, 2);
    const recentSheets = window.DATA.getRecentSheets(5);

    container.innerHTML = `
      <!-- Page Title & Quick Search -->
      <div class="page-title-bar">
        <div class="page-title-group">
          <h1>
            <i data-lucide="layout-dashboard" style="color: var(--brand-primary); width: 26px; height: 26px;"></i>
            الرئيسية
          </h1>
          <p>لوحة المتابعة الأكاديمية والوصول السريع لمحاضرات وامتحانات السنة الثالثة</p>
        </div>
        <div class="search-bar-wrap">
          <i data-lucide="search" class="search-icon"></i>
          <input type="text" id="dashboard-search-input" placeholder="ابحث عن مادة، شيت، سؤال، أو ملخص..." />
        </div>
      </div>

      <!-- 1. STAT CARDS GRID (4 Cards) -->
      <section class="stat-cards-grid" aria-label="الإحصائيات السريعة">
        <!-- Stat 1: عدد المواد النشطة -->
        <div class="stat-card">
          <div class="stat-icon-wrap stat-icon-green">
            <i data-lucide="book-open"></i>
          </div>
          <div class="stat-details">
            <span class="stat-value">12</span>
            <span class="stat-label">المواد الدراسية</span>
            <span class="stat-sub">جميع مقررات طب الأسنان</span>
          </div>
        </div>

        <!-- Stat 2: الامتحانات القادمة -->
        <div class="stat-card">
          <div class="stat-icon-wrap stat-icon-orange">
            <i data-lucide="calendar-clock"></i>
          </div>
          <div class="stat-details">
            <span class="stat-value">3</span>
            <span class="stat-label">امتحانات قادمة</span>
            <span class="stat-sub">النصفية والعملية</span>
          </div>
        </div>

        <!-- Stat 3: متوسط الدرجات -->
        <div class="stat-card">
          <div class="stat-icon-wrap stat-icon-blue">
            <i data-lucide="award"></i>
          </div>
          <div class="stat-details">
            <span class="stat-value">88%</span>
            <span class="stat-label">متوسط الدرجات</span>
            <span class="stat-sub">التقييم التراكمي المقدر</span>
          </div>
        </div>

        <!-- Stat 4: الأيام المتبقية -->
        <div class="stat-card">
          <div class="stat-icon-wrap stat-icon-purple">
            <i data-lucide="hourglass"></i>
          </div>
          <div class="stat-details">
            <span class="stat-value">12 يوم</span>
            <span class="stat-label">لأقرب امتحان</span>
            <span class="stat-sub">جراحة الفم والفكين 1</span>
          </div>
        </div>
      </section>

      <!-- 2. IMPORTANT ALERTS (Compact Notification Cards) -->
      <section class="alerts-section">
        <div class="section-header">
          <div class="section-title">
            <i data-lucide="bell-ring" style="color: var(--color-warning); width: 20px; height: 20px;"></i>
            التنبيهات المهمة
          </div>
          <a href="#/alerts" class="btn btn-soft" style="font-size: 0.775rem; padding: 4px 10px;">
            عرض الكل
            <i data-lucide="chevron-left" style="width: 14px; height: 14px;"></i>
          </a>
        </div>
        <div class="compact-alerts-list">
          ${alerts.map(a => `
            <div class="compact-alert-card ${a.type === 'urgent' ? 'alert-urgent' : 'alert-warning'}">
              <div class="alert-left-content">
                <div class="alert-icon-pill ${a.type === 'urgent' ? 'badge-danger' : 'badge-warning'}">
                  <i data-lucide="${a.type === 'urgent' ? 'alert-triangle' : 'info'}"></i>
                </div>
                <div class="alert-text-group">
                  <span class="alert-headline">${a.title}</span>
                  <span class="alert-description">${a.message}</span>
                </div>
              </div>
              <div class="alert-meta">
                <span class="alert-time">${a.created_at || 'حديثاً'}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- 3. QUICK ACCESS GRID (6 Main Cards) -->
      <section class="quick-access-section">
        <div class="section-header">
          <div class="section-title">
            <i data-lucide="zap" style="color: var(--brand-primary); width: 20px; height: 20px;"></i>
            الوصول السريع
          </div>
        </div>
        <div class="quick-grid-6">
          <!-- Item 1: المواد الدراسية -->
          <a href="#/subjects" class="quick-nav-card">
            <div class="quick-nav-main">
              <div class="quick-nav-icon" style="background: #E8F5E9; color: #2E7D32;">
                <i data-lucide="graduation-cap"></i>
              </div>
              <div class="quick-nav-text">
                <h3>المواد الدراسية</h3>
                <p>12 مادة أكاديمية كاملة</p>
              </div>
            </div>
            <div class="quick-nav-arrow">
              <i data-lucide="arrow-left"></i>
            </div>
          </a>

          <!-- Item 2: الامتحانات -->
          <a href="#/exams" class="quick-nav-card">
            <div class="quick-nav-main">
              <div class="quick-nav-icon" style="background: #FFFBEB; color: #D97706;">
                <i data-lucide="file-check-2"></i>
              </div>
              <div class="quick-nav-text">
                <h3>الامتحانات</h3>
                <p>الجداول ونماذج الأسئلة</p>
              </div>
            </div>
            <div class="quick-nav-arrow">
              <i data-lucide="arrow-left"></i>
            </div>
          </a>

          <!-- Item 3: حاسبة الدرجات -->
          <a href="#/calculator" class="quick-nav-card">
            <div class="quick-nav-main">
              <div class="quick-nav-icon" style="background: #EFF6FF; color: #2563EB;">
                <i data-lucide="calculator"></i>
              </div>
              <div class="quick-nav-text">
                <h3>حاسبة الدرجات</h3>
                <p>محاكاة المعدل الفصلي والتراكمي</p>
              </div>
            </div>
            <div class="quick-nav-arrow">
              <i data-lucide="arrow-left"></i>
            </div>
          </a>

          <!-- Item 4: التسجيلات -->
          <a href="#/videos" class="quick-nav-card">
            <div class="quick-nav-main">
              <div class="quick-nav-icon" style="background: #FDF2F8; color: #DB2777;">
                <i data-lucide="video"></i>
              </div>
              <div class="quick-nav-text">
                <h3>التسجيلات</h3>
                <p>محاضرات وشروحات الدكاترة</p>
              </div>
            </div>
            <div class="quick-nav-arrow">
              <i data-lucide="arrow-left"></i>
            </div>
          </a>

          <!-- Item 5: الملخصات -->
          <a href="#/summaries" class="quick-nav-card">
            <div class="quick-nav-main">
              <div class="quick-nav-icon" style="background: #F5F3FF; color: #7C3AED;">
                <i data-lucide="file-text"></i>
              </div>
              <div class="quick-nav-text">
                <h3>الملخصات</h3>
                <p>مذكرات مركزة ومراجعات نهائية</p>
              </div>
            </div>
            <div class="quick-nav-arrow">
              <i data-lucide="arrow-left"></i>
            </div>
          </a>

          <!-- Item 6: بنك الأسئلة -->
          <a href="#/questions" class="quick-nav-card">
            <div class="quick-nav-main">
              <div class="quick-nav-icon" style="background: #F0FDF4; color: #16A34A;">
                <i data-lucide="help-circle"></i>
              </div>
              <div class="quick-nav-text">
                <h3>بنك الأسئلة</h3>
                <p>MCQs مع الشرح والتعليل</p>
              </div>
            </div>
            <div class="quick-nav-arrow">
              <i data-lucide="arrow-left"></i>
            </div>
          </a>
        </div>
      </section>

      <!-- 4. RECENT ADDITIONS (Modern List View) -->
      <section class="recent-section">
        <div class="section-header">
          <div class="section-title">
            <i data-lucide="clock-3" style="color: var(--brand-primary); width: 20px; height: 20px;"></i>
            أحدث الإضافات والمحاضرات
          </div>
          <a href="#/sheets" class="btn btn-soft" style="font-size: 0.775rem; padding: 4px 10px;">
            عرض جميع المحاضرات
            <i data-lucide="chevron-left" style="width: 14px; height: 14px;"></i>
          </a>
        </div>
        <div class="recent-list-view">
          ${recentSheets.map(item => `
            <a href="#/sheet/${item.id}" class="recent-list-row">
              <div class="recent-col-icon">
                <i data-lucide="file-text"></i>
              </div>
              <div class="recent-col-type">
                <span class="badge badge-primary">${item.type || 'شيت'}</span>
              </div>
              <div class="recent-col-title" title="${item.title}">
                ${item.title}
              </div>
              <div class="recent-col-doctor">
                ${item.doctor_name || 'هيئة التدريس'}
              </div>
              <div class="recent-col-date">
                ${item.date || '2026-09-08'}
              </div>
              <div class="recent-col-arrow">
                <i data-lucide="arrow-left"></i>
              </div>
            </a>
          `).join('')}
        </div>
      </section>
    `;

    // Search bar enter listener
    const searchInput = document.getElementById('dashboard-search-input');
    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && searchInput.value.trim()) {
          window.ROUTER.navigate(`/search?q=${encodeURIComponent(searchInput.value.trim())}`);
        }
      });
    }
  }
};

window.HomePage = HomePage;
