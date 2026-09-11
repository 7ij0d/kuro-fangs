/**
 * KURO FANGS — SECONDARY PAGES
 * Summaries, Videos, Images/Atlas, Favorites, Profile, Alerts & Search
 */

const SecondaryPages = {
  // Summaries
  renderSummaries(container) {
    const summaries = [
      { id: 'sum-1', title: 'ملخص شامل في أدوية التخدير الموضعي وحساب الجرعات القصوى', subject: 'جراحة الفم والفكين', author: 'دفعة 2025', pages: 8 },
      { id: 'sum-2', title: 'مذكرة مبادئ تحضير الأسنان وخطوط الإنهاء Chamfer & Shoulder', subject: 'التركيبات الثابتة', author: 'د. نادية', pages: 12 },
      { id: 'sum-3', title: 'مخطط شجري لتشخيص وعلاج أمراض اللب الحادة والمزمنة', subject: 'علاج العصب', author: 'د. خالد', pages: 6 },
      { id: 'sum-4', title: 'جدول المقارنة الشامل للأورام السنية الحميدة والخبيثة', subject: 'علم أمراض الفم', author: 'لجنة التعليم', pages: 15 }
    ];

    container.innerHTML = `
      <div class="page-title-bar">
        <div class="page-title-group">
          <h1>
            <i data-lucide="file-text" style="color: var(--brand-primary); width: 26px; height: 26px;"></i>
            الملخصات والمذكرات المركزة
          </h1>
          <p>مذكرات مركزة ومراجعات ليلة الامتحان لكافة مقررات السنة الثالثة</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
        ${summaries.map(s => `
          <div class="card" style="padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <span class="badge badge-primary" style="margin-bottom: 8px;">${s.subject}</span>
              <h3 style="font-size: 1rem; color: var(--text-primary); margin-bottom: 8px;">${s.title}</h3>
              <div style="font-size: 0.8rem; color: var(--text-muted);">إعداد: ${s.author} • ${s.pages} صفحات</div>
            </div>
            <div style="margin-top: 16px; border-top: 1px solid var(--border-subtle); padding-top: 12px; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.775rem; color: var(--brand-primary); font-weight: 600;">PDF متوفر</span>
              <button class="btn btn-soft" style="font-size: 0.775rem; padding: 4px 10px;" onclick="window.showToast(window.I18N && window.I18N.getLang() === 'ar' ? 'تم بدء تحميل الملخص بنجاح!' : 'Summary download started!', { type: 'success' });">
                <i data-lucide="download" style="width: 14px; height: 14px;"></i>
                تحميل الملخص
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  // Videos
  renderVideos(container) {
    const videos = [
      { id: 'vid-1', title: 'شرح عملي: خطوات التخدير الحنكي والإحصار السنخي السفلي (IDB)', doctor: 'د. يوسف التاجوري', duration: '42 دقيقة', subject: 'جراحة الفم والفكين' },
      { id: 'vid-2', title: 'تطبيق عملي: تحضير تاج كامل من الخزف المعدني (PFM Preparation)', doctor: 'د. نادية عبدالحميد', duration: '35 دقيقة', subject: 'التركيبات الثابتة' },
      { id: 'vid-3', title: 'تحديد الطول العامل واستخدام محدد الذروة (Apex Locator Guide)', doctor: 'د. خالد الصالح', duration: '28 دقيقة', subject: 'علاج العصب' },
      { id: 'vid-4', title: 'قراءة وتحليل صور الأشعة البانورامية وCBCT في عيادة الأسنان', doctor: 'د. عمر القاضي', duration: '50 دقيقة', subject: 'تشخيص وأشعة الفم' }
    ];

    container.innerHTML = `
      <div class="page-title-bar">
        <div class="page-title-group">
          <h1>
            <i data-lucide="video" style="color: var(--brand-primary); width: 26px; height: 26px;"></i>
            التسجيلات والشروحات السريرية
          </h1>
          <p>شروحات فيديو تفاعلية وتطبيقات عملية مباشرة في معامل العيادات</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 18px;">
        ${videos.map(v => `
          <div class="card" style="overflow: hidden;">
            <div style="height: 140px; background: linear-gradient(135deg, #1F2937 0%, #111827 100%); display: flex; align-items: center; justify-content: center; position: relative;">
              <div style="width: 50px; height: 50px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; color: #FFFFFF; backdrop-filter: blur(4px);">
                <i data-lucide="play" style="width: 22px; height: 22px; fill: #FFFFFF;"></i>
              </div>
              <span style="position: absolute; bottom: 8px; left: 8px; background: rgba(0,0,0,0.7); color: #FFF; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px;">
                ${v.duration}
              </span>
            </div>
            <div style="padding: 16px;">
              <span class="badge badge-primary" style="margin-bottom: 6px;">${v.subject}</span>
              <h3 style="font-size: 0.95rem; color: var(--text-primary); margin-bottom: 6px; line-height: 1.4;">${v.title}</h3>
              <p style="font-size: 0.8rem; color: var(--text-secondary);">${v.doctor}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  // Images / Clinical Atlas
  renderImages(container) {
    const images = [
      { id: 'img-1', title: 'مظهر الأورام الحبيبية القمية تحت المجهر الضوئي', subject: 'علم أمراض الفم', tag: 'Histopathology' },
      { id: 'img-2', title: 'مستويات انحشار الضرس العقل السفلي وفق تصنيف Winter', subject: 'جراحة الفم والفكين', tag: 'Radiology' },
      { id: 'img-3', title: 'أنواع خطوط الإنهاء وتأثيرها على انطباق التيجان الخزفية', subject: 'التركيبات الثابتة', tag: 'Prosthodontics' },
      { id: 'img-4', title: 'مقارنة انحناءات قنوات الجذور وتصنيف Vertucci', subject: 'علاج العصب', tag: 'Endodontics' }
    ];

    container.innerHTML = `
      <div class="page-title-bar">
        <div class="page-title-group">
          <h1>
            <i data-lucide="image" style="color: var(--brand-primary); width: 26px; height: 26px;"></i>
            أطلس الصور السريرية والشعاعية
          </h1>
          <p>مرجع بصري تشخيصي شامل لصور الأشعة، التشريح النسيجي، والحالات السريرية</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px;">
        ${images.map(img => `
          <div class="card" style="padding: 16px;">
            <div style="height: 130px; background: #F1F5F9; border-radius: var(--radius-sm); display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-muted); margin-bottom: 12px; border: 1px dashed var(--border-subtle);">
              <i data-lucide="camera" style="width: 28px; height: 28px; margin-bottom: 4px;"></i>
              <span style="font-size: 0.75rem;">صورة سريرية عالية الدقة</span>
            </div>
            <span class="badge badge-primary" style="margin-bottom: 6px;">${img.tag}</span>
            <h3 style="font-size: 0.9rem; color: var(--text-primary); margin-bottom: 4px;">${img.title}</h3>
            <p style="font-size: 0.75rem; color: var(--text-secondary);">${img.subject}</p>
          </div>
        `).join('')}
      </div>
    `;
  },

  // Favorites
  renderFavorites(container) {
    const favs = window.STORE.getFavorites();

    container.innerHTML = `
      <div class="page-title-bar">
        <div class="page-title-group">
          <h1>
            <i data-lucide="bookmark" style="color: var(--brand-primary); width: 26px; height: 26px;"></i>
            المفضلة والمحفوظات
          </h1>
          <p>جميع المحاضرات والملخصات والأسئلة التي قمت بحفظها للرجوع إليها سريعاً</p>
        </div>
      </div>

      ${favs.length === 0 ? `
        <div class="card" style="padding: 40px; text-align: center; color: var(--text-muted);">
          لم تقم بحفظ أي عنصر في المفضلة بعد. يمكنك النقر على أيقونة المفضلة داخل أي شيت أو مادة لحفظه هنا.
        </div>
      ` : `
        <div class="recent-list-view">
          ${favs.map(item => `
            <div class="recent-list-row">
              <div class="recent-col-icon">
                <i data-lucide="bookmark"></i>
              </div>
              <div class="recent-col-type">
                <span class="badge badge-primary">${item.type === 'sheet' ? 'محاضرة' : 'عنصر'}</span>
              </div>
              <div class="recent-col-title">
                ${item.title}
                <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: normal;">${item.subject_name || 'طب الأسنان'}</div>
              </div>
              <div class="recent-col-doctor">
                ${item.addedAt ? item.addedAt.split('T')[0] : 'محفوظ'}
              </div>
              <div></div>
              <a href="#/${item.type}/${item.id}" class="recent-col-arrow" title="عرض">
                <i data-lucide="arrow-left"></i>
              </a>
            </div>
          `).join('')}
        </div>
      `}
    `;
  },

  // Profile
  renderProfile(container) {
    const userInfo = window.STORE.getUserInfo();
    const points = window.STORE.getPoints();
    const notesCount = window.STORE.getNotes().length;
    const favsCount = window.STORE.getFavorites().length;

    container.innerHTML = `
      <div class="page-title-bar">
        <div class="page-title-group">
          <h1>
            <i data-lucide="user-check" style="color: var(--brand-primary); width: 26px; height: 26px;"></i>
            الملف الشخصي والرصيد الأكاديمي
          </h1>
          <p>بيانات الطالب، مستوى التفاعل، وشارات التفوق الدراسي</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 20px;">
        <!-- Profile Card -->
        <div class="card" style="padding: 28px; text-align: center;">
          <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #A5D6A7 0%, #2E7D32 100%); color: #FFF; font-size: 2rem; font-weight: 700; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; border: 4px solid #FFF; box-shadow: 0 4px 12px rgba(46,125,50,0.2);">
            ${userInfo.avatarText || 'ك'}
          </div>
          <h2 style="font-size: 1.25rem; margin-bottom: 4px;">${userInfo.name}</h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 20px;">${userInfo.title}</p>

          <div style="background: var(--brand-primary-light); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--brand-primary-border); margin-bottom: 20px;">
            <div style="font-size: 0.8rem; color: var(--brand-primary); font-weight: 600;">الرصيد الأكاديمي الحالي</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: var(--brand-primary);">${points} نقطة</div>
          </div>

          <div style="display: flex; justify-content: space-around; border-top: 1px solid var(--border-subtle); padding-top: 16px;">
            <div>
              <div style="font-weight: 700; font-size: 1.1rem;">${notesCount}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">الملاحظات</div>
            </div>
            <div>
              <div style="font-weight: 700; font-size: 1.1rem;">${favsCount}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">المفضلة</div>
            </div>
            <div>
              <div style="font-weight: 700; font-size: 1.1rem;">12</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">المواد</div>
            </div>
          </div>
        </div>

        <!-- Badges & Achievements -->
        <div class="card" style="padding: 24px;">
          <h3 style="font-size: 1.1rem; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
            <i data-lucide="award" style="color: var(--color-warning);"></i>
            شارات الإنجاز والتفوق
          </h3>
          
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div style="display: flex; align-items: center; gap: 14px; padding: 12px; border-radius: var(--radius-sm); background: #F0FDF4; border: 1px solid #BBF7D0;">
              <div style="font-size: 1.6rem;">🥇</div>
              <div>
                <h4 style="font-size: 0.9rem; margin-bottom: 2px;">طالب نشط ومجتهد</h4>
                <p style="font-size: 0.75rem; color: var(--text-secondary);">حصلت على 25+ نقطة أكاديمية في المنصة</p>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 14px; padding: 12px; border-radius: var(--radius-sm); background: #FAFBF9; border: 1px solid var(--border-subtle);">
              <div style="font-size: 1.6rem;">🦷</div>
              <div>
                <h4 style="font-size: 0.9rem; margin-bottom: 2px;">مستكشف مقررات الأسنان</h4>
                <p style="font-size: 0.75rem; color: var(--text-secondary);">استعراض وتصفح مواد السنة الثالثة الـ 12</p>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 14px; padding: 12px; border-radius: var(--radius-sm); background: #FAFBF9; border: 1px solid var(--border-subtle);">
              <div style="font-size: 1.6rem;">⚡</div>
              <div>
                <h4 style="font-size: 0.9rem; margin-bottom: 2px;">بطل الكويزات التفاعلية</h4>
                <p style="font-size: 0.75rem; color: var(--text-secondary);">حل واجتياز اختبارات بنك الأسئلة</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // Alerts
  renderAlerts(container) {
    const alerts = window.DATA.getAlerts();

    container.innerHTML = `
      <div class="page-title-bar">
        <div class="page-title-group">
          <h1>
            <i data-lucide="bell" style="color: var(--brand-primary); width: 26px; height: 26px;"></i>
            مركز التنبيهات والإعلانات الرسمية
          </h1>
          <p>كافة التبليغات الصادرة عن إدارة كلية طب وجراحة الفم والأسنان ومنسقي المقررات</p>
        </div>
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
    `;
  },

  // Search
  renderSearch(container, queryParams) {
    const q = (queryParams.get('q') || '').toLowerCase();
    const subjects = window.DATA.getSubjects().filter(s => 
      s.name_ar.toLowerCase().includes(q) || 
      s.name_en.toLowerCase().includes(q) || 
      s.code.toLowerCase().includes(q)
    );
    const sheets = window.DATA.getRecentSheets(20).filter(s => 
      s.title.toLowerCase().includes(q) || 
      (s.subject_name && s.subject_name.toLowerCase().includes(q))
    );

    container.innerHTML = `
      <div class="page-title-bar">
        <div class="page-title-group">
          <h1>
            <i data-lucide="search" style="color: var(--brand-primary); width: 26px; height: 26px;"></i>
            نتائج البحث عن: "${q}"
          </h1>
          <p>تم العثور على ${subjects.length} مادة و ${sheets.length} محاضرة مطابقة</p>
        </div>
      </div>

      ${subjects.length > 0 ? `
        <h3 style="font-size: 1.1rem; margin-bottom: 12px;">المواد المطابقة</h3>
        <div class="subjects-grid" style="margin-bottom: 24px;">
          ${subjects.map(s => `
            <a href="#/subject/${s.id}" class="subject-card">
              <div>
                <div class="subject-card-top">
                  <div class="subject-badge-icon" style="background: ${s.color}15; color: ${s.color};">
                    ${s.icon || '🦷'}
                  </div>
                  <span class="subject-code-tag">${s.code}</span>
                </div>
                <h3 class="subject-title-ar">${s.name_ar}</h3>
                <div class="subject-title-en">${s.name_en}</div>
              </div>
            </a>
          `).join('')}
        </div>
      ` : ''}

      ${sheets.length > 0 ? `
        <h3 style="font-size: 1.1rem; margin-bottom: 12px;">المحاضرات المطابقة</h3>
        <div class="recent-list-view">
          ${sheets.map(s => `
            <a href="#/sheet/${s.id}" class="recent-list-row">
              <div class="recent-col-icon"><i data-lucide="file-text"></i></div>
              <div class="recent-col-type"><span class="badge badge-primary">شيت</span></div>
              <div class="recent-col-title">${s.title}</div>
              <div class="recent-col-doctor">${s.doctor_name || 'أستاذ المادة'}</div>
              <div class="recent-col-date">${s.date || '2026-09-08'}</div>
              <div class="recent-col-arrow"><i data-lucide="arrow-left"></i></div>
            </a>
          `).join('')}
        </div>
      ` : ''}

      ${subjects.length === 0 && sheets.length === 0 ? `
        <div class="card" style="padding: 40px; text-align: center; color: var(--text-muted);">
          لم يتم العثور على أي نتائج مطابقة لـ "${q}". جرّب كتابة اسم مادة أو موضوع آخر.
        </div>
      ` : ''}
    `;
  }
};

window.SecondaryPages = SecondaryPages;
