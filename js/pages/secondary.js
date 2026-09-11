/**
 * KURO FANGS — SECONDARY PAGES
 * Summaries, Videos, Images/Atlas, Favorites, Profile, Alerts & Search
 */

const SecondaryPages = {
  // Summaries
  renderSummaries(container, queryParams) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
    const subjects = window.DATA ? window.DATA.getSubjects() : [];
    const targetSubject = queryParams?.get('subject') || 'all';
    let currentFilter = targetSubject;

    const baseSummaries = [
      { id: 'sum-1', subject_id: 'omfs', title_ar: 'ملخص شامل في أدوية التخدير الموضعي وحساب الجرعات القصوى', title_en: 'Comprehensive Local Anesthesia & Maximum Dosage Calculations', subject_ar: 'جراحة الفم والفكين', subject_en: 'Oral Surgery', author: 'Dr. Youssef', pages: 8 },
      { id: 'sum-2', subject_id: 'fixed-pros', title_ar: 'مذكرة مبادئ تحضير الأسنان وخطوط الإنهاء Chamfer & Shoulder', title_en: 'Tooth Preparation Principles & Finish Lines Guide', subject_ar: 'التركيبات الثابتة', subject_en: 'Fixed Pros', author: 'Dr. Nadia', pages: 12 },
      { id: 'sum-3', subject_id: 'endo', title_ar: 'مخطط شجري لتشخيص وعلاج أمراض اللب الحادة والمزمنة', title_en: 'Diagnostic Decision Tree: Acute & Chronic Pulpal Pathologies', subject_ar: 'علاج العصب', subject_en: 'Endodontics', author: 'Dr. Khaled', pages: 6 },
      { id: 'sum-4', subject_id: 'oral-diseases', title_ar: 'جدول المقارنة الشامل للأورام السنية الحميدة والخبيثة', title_en: 'High-Yield Odontogenic Tumors & Cysts Comparison Table', subject_ar: 'علم أمراض الفم', subject_en: 'Oral Pathology', author: 'Faculty Board', pages: 15 },
      { id: 'sum-5', subject_id: 'gen-med', title_ar: 'دليل أمراض الغدد الصماء والقلب وتدابيرها في عيادة الأسنان', title_en: 'Endocrine & Cardiovascular Management in Dental Clinic', subject_ar: 'الطب العام', subject_en: 'General Medicine', author: 'Dr. Tarek', pages: 10 },
      { id: 'sum-6', subject_id: 'gen-surgery', title_ar: 'ملخص بروتوكولات التعقيم وتدبير الصدمات والنزيف الجراحي', title_en: 'Surgical Asepsis, Hemostasis & Shock Management Protocol', subject_ar: 'الجراحة العامة', subject_en: 'General Surgery', author: 'Dr. Mahmoud', pages: 9 },
      { id: 'sum-7', subject_id: 'omdr', title_ar: 'مذكرة قراءة صور البانوراما وتحديد الآفات العظمية الفكية', title_en: 'Panoramic Radiograph Interpretation & Jaw Lesions', subject_ar: 'أشعة وتشخيص الفم', subject_en: 'OMDR', author: 'Dr. Omar', pages: 14 },
      { id: 'sum-8', subject_id: 'preventive', title_ar: 'مراجعة آليات تأثير الفلورايد وتطبيق المواد السادة للشقوق', title_en: 'Fluoride Mechanisms, Pit & Fissure Sealants Review', subject_ar: 'طب الأسنان الوقائي', subject_en: 'Preventive Dentistry', author: 'Faculty Board', pages: 7 },
      { id: 'sum-9', subject_id: 'cons-endo', title_ar: 'دليل اختيار أنظمة الترابط العاجي وحشوات الكومبوزيت الخلفية', title_en: 'Dentin Bonding Systems & Posterior Composites Guide', subject_ar: 'العلاج التحفظي', subject_en: 'Cons & Endo', author: 'Dr. Sara', pages: 11 },
      { id: 'sum-10', subject_id: 'ortho', title_ar: 'ملخص تصنيف إنجل لسوء الإطباق وتحليل قياسات الرأس السيفالومترية', title_en: 'Angle Malocclusion Classification & Cephalometrics Summary', subject_ar: 'تقويم الأسنان', subject_en: 'Orthodontics', author: 'Dr. Amira', pages: 8 },
      { id: 'sum-11', subject_id: 'pediatric', title_ar: 'بروتوكول بتر لب الأسنان اللبنية والتعامل السلوكي مع الأطفال', title_en: 'Pediatric Pulpotomy Protocols & Behavior Management', subject_ar: 'طب أسنان الأطفال', subject_en: 'Pediatric Dentistry', author: 'Dr. Laila', pages: 9 },
      { id: 'sum-12', subject_id: 'removable-pros', title_ar: 'أساسيات تصميم هياكل الكروم كوبالت ومحددات المسار الإدخالي', title_en: 'Cobalt-Chromium RPD Framework Design & Surveying Principles', subject_ar: 'الاستعاضة المتحركة', subject_en: 'Removable Pros', author: 'Dr. Nader', pages: 13 }
    ];

    const renderList = () => {
      const filtered = currentFilter === 'all'
        ? baseSummaries
        : baseSummaries.filter(s => s.subject_id === currentFilter);

      const gridEl = document.getElementById('summaries-grid');
      if (!gridEl) return;

      if (filtered.length === 0) {
        gridEl.innerHTML = `
          <div class="card" style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--text-muted);">
            <i data-lucide="file-text" style="width: 36px; height: 36px; margin-bottom: 10px; opacity: 0.5;"></i>
            <p>${isAr ? 'لا توجد ملخصات حالياً لهذه المادة.' : 'No summaries found for this subject.'}</p>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      gridEl.innerHTML = filtered.map(s => `
        <div class="card" style="padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <span class="badge badge-primary" style="margin-bottom: 8px;">${isAr ? s.subject_ar : s.subject_en}</span>
            <h3 style="font-size: 1rem; color: var(--text-primary); margin-bottom: 8px; line-height: 1.4;">${isAr ? s.title_ar : s.title_en}</h3>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${isAr ? 'إعداد' : 'By'}: ${s.author} • ${s.pages} ${isAr ? 'صفحات' : 'pages'}</div>
          </div>
          <div style="margin-top: 16px; border-top: 1px solid var(--border-subtle); padding-top: 12px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.775rem; color: var(--brand-primary); font-weight: 600;">${isAr ? 'PDF معتمد' : 'Verified PDF'}</span>
            <button class="btn btn-soft download-summary-btn" data-title="${encodeURIComponent(isAr ? s.title_ar : s.title_en)}" style="font-size: 0.775rem; padding: 5px 12px; display: inline-flex; align-items: center; gap: 6px;">
              <i data-lucide="download" style="width: 14px; height: 14px;"></i>
              ${isAr ? 'تحميل الملخص' : 'Download PDF'}
            </button>
          </div>
        </div>
      `).join('');

      if (window.lucide) window.lucide.createIcons();

      gridEl.querySelectorAll('.download-summary-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const title = decodeURIComponent(btn.getAttribute('data-title') || '');
          window.STORE.addPoints(10);
          const msg = isAr ? `تم بدء تحميل: ${title}` : `Download started: ${title}`;
          window.showToast(msg, { type: 'success', points: 10 });
        });
      });
    };

    container.innerHTML = `
      <div class="page-title-bar">
        <div class="page-title-group">
          <h1>
            <i data-lucide="file-text" style="color: var(--brand-primary); width: 26px; height: 26px;"></i>
            ${isAr ? 'الملخصات والمذكرات المركزة' : 'High-Yield Summaries & Notes'}
          </h1>
          <p>${isAr ? 'مذكرات مركزة ومراجعات ليلة الامتحان لكافة مقررات السنة الثالثة' : 'Concise revision guides, drug tables, and exam reviews for all dental subjects'}</p>
        </div>
      </div>

      <!-- Filters -->
      <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 16px; scrollbar-width: thin;">
        <button class="btn ${currentFilter === 'all' ? 'btn-primary' : 'btn-secondary'} summary-filter-btn" data-subject="all" style="font-size: 0.8rem; padding: 6px 14px; white-space: nowrap;">
          ${isAr ? 'جميع المواد (12)' : 'All Subjects (12)'}
        </button>
        ${subjects.map(s => `
          <button class="btn ${currentFilter === s.id ? 'btn-primary' : 'btn-secondary'} summary-filter-btn" data-subject="${s.id}" style="font-size: 0.8rem; padding: 6px 14px; white-space: nowrap;">
            ${isAr ? s.name_ar : s.name_en}
          </button>
        `).join('')}
      </div>

      <div id="summaries-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;"></div>
    `;

    renderList();

    container.querySelectorAll('.summary-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentFilter = btn.getAttribute('data-subject');
        container.querySelectorAll('.summary-filter-btn').forEach(b => {
          b.className = b.getAttribute('data-subject') === currentFilter ? 'btn btn-primary summary-filter-btn' : 'btn btn-secondary summary-filter-btn';
        });
        renderList();
      });
    });
  },

  // Videos
  renderVideos(container, queryParams) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
    const subjects = window.DATA ? window.DATA.getSubjects() : [];
    const targetSubject = queryParams?.get('subject') || 'all';
    let currentFilter = targetSubject;

    const baseVideos = [
      { id: 'vid-1', subject_id: 'omfs', title_ar: 'شرح عملي: خطوات التخدير الحنكي والإحصار السنخي السفلي (IDB)', title_en: 'Clinical Demo: Inferior Alveolar Nerve Block & Palatal Infiltration', doctor: 'د. يوسف التاجوري', duration: '42 min', subject_ar: 'جراحة الفم والفكين', subject_en: 'Oral Surgery' },
      { id: 'vid-2', subject_id: 'fixed-pros', title_ar: 'تطبيق عملي: تحضير تاج كامل من الخزف المعدني (PFM Preparation)', title_en: 'Hands-on: Full Porcelain-Fused-to-Metal Crown Preparation', doctor: 'د. نادية عبدالحميد', duration: '35 min', subject_ar: 'التركيبات الثابتة', subject_en: 'Fixed Pros' },
      { id: 'vid-3', subject_id: 'endo', title_ar: 'تحديد الطول العامل واستخدام محدد الذروة (Apex Locator Guide)', title_en: 'Electronic Apex Locator Protocols & Working Length Determination', doctor: 'د. خالد الصالح', duration: '28 min', subject_ar: 'علاج العصب', subject_en: 'Endodontics' },
      { id: 'vid-4', subject_id: 'omdr', title_ar: 'قراءة وتحليل صور الأشعة البانورامية وCBCT في عيادة الأسنان', title_en: 'Interpreting Panoramic & CBCT Imaging in Dental Practice', doctor: 'د. عمر القاضي', duration: '50 min', subject_ar: 'أشعة وتشخيص الفم', subject_en: 'OMDR' },
      { id: 'vid-5', subject_id: 'oral-diseases', title_ar: 'الفحص السريري لآفات الفم المخاطية والتشخيص التفريقي', title_en: 'Clinical Examination of Oral Mucosa & Differential Diagnosis', doctor: 'د. أحمد سمير', duration: '38 min', subject_ar: 'علم أمراض الفم', subject_en: 'Oral Pathology' },
      { id: 'vid-6', subject_id: 'gen-surgery', title_ar: 'مبادئ خياطة الجروح الجراحية واستخدام أدوات الشق والإمساك', title_en: 'Suturing Techniques & Surgical Flap Management', doctor: 'د. محمود حسن', duration: '30 min', subject_ar: 'الجراحة العامة', subject_en: 'General Surgery' },
      { id: 'vid-7', subject_id: 'cons-endo', title_ar: 'عزل الأسنان بواسطة الحاجز المطاطي (Rubber Dam Application)', title_en: 'Rubber Dam Isolation Techniques & Clamp Placement', doctor: 'د. سارة المنفي', duration: '25 min', subject_ar: 'العلاج التحفظي', subject_en: 'Cons & Endo' },
      { id: 'vid-8', subject_id: 'pediatric', title_ar: 'خطوات تخدير الأطفال السطحي وتقنيات الإلهاء السلوكي', title_en: 'Pediatric Behavior Management & Local Anesthesia', doctor: 'د. ليلى فوزي', duration: '32 min', subject_ar: 'طب أسنان الأطفال', subject_en: 'Pediatric Dentistry' }
    ];

    const renderList = () => {
      const filtered = currentFilter === 'all'
        ? baseVideos
        : baseVideos.filter(v => v.subject_id === currentFilter);

      const gridEl = document.getElementById('videos-grid');
      if (!gridEl) return;

      if (filtered.length === 0) {
        gridEl.innerHTML = `
          <div class="card" style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--text-muted);">
            <i data-lucide="video" style="width: 36px; height: 36px; margin-bottom: 10px; opacity: 0.5;"></i>
            <p>${isAr ? 'لا توجد تسجيلات فيديو حالياً لهذه المادة.' : 'No clinical videos available for this subject.'}</p>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      gridEl.innerHTML = filtered.map(v => `
        <div class="card" style="overflow: hidden; display: flex; flex-direction: column;">
          <div style="height: 140px; background: linear-gradient(135deg, #2A0812 0%, #111827 100%); display: flex; align-items: center; justify-content: center; position: relative;">
            <div style="width: 50px; height: 50px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; color: #FFFFFF; backdrop-filter: blur(4px); cursor: pointer;" onclick="window.showToast('${isAr ? 'جاري تشغيل الفيديو السريري...' : 'Loading clinical video player...'}', { type: 'info' });">
              <i data-lucide="play" style="width: 22px; height: 22px; fill: #FFFFFF;"></i>
            </div>
            <span style="position: absolute; bottom: 8px; left: 8px; background: rgba(0,0,0,0.75); color: #FFF; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px;">
              ${v.duration}
            </span>
          </div>
          <div style="padding: 16px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <span class="badge badge-primary" style="margin-bottom: 6px;">${isAr ? v.subject_ar : v.subject_en}</span>
              <h3 style="font-size: 0.95rem; color: var(--text-primary); margin-bottom: 6px; line-height: 1.4;">${isAr ? v.title_ar : v.title_en}</h3>
              <p style="font-size: 0.8rem; color: var(--text-secondary);">${v.doctor}</p>
            </div>
            <div style="margin-top: 12px; pt-8; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.75rem; color: var(--text-muted);">${isAr ? 'جودة عالية HD' : 'HD 1080p'}</span>
              <button class="btn btn-soft" style="font-size: 0.75rem; padding: 4px 10px;" onclick="window.showToast('${isAr ? 'تم بدء بث المحاضرة المرئية!' : 'Streaming lecture video!'}', { type: 'info' });">
                <i data-lucide="play-circle" style="width: 14px; height: 14px;"></i>
                ${isAr ? 'مشاهدة' : 'Watch'}
              </button>
            </div>
          </div>
        </div>
      `).join('');

      if (window.lucide) window.lucide.createIcons();
    };

    container.innerHTML = `
      <div class="page-title-bar">
        <div class="page-title-group">
          <h1>
            <i data-lucide="video" style="color: var(--brand-primary); width: 26px; height: 26px;"></i>
            ${isAr ? 'التسجيلات والشروحات السريرية' : 'Clinical Recordings & Video Lectures'}
          </h1>
          <p>${isAr ? 'شروحات فيديو تفاعلية وتطبيقات عملية مباشرة في معامل العيادات' : 'Interactive video demonstrations, lab recordings, and clinical tutorials'}</p>
        </div>
      </div>

      <!-- Filters -->
      <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 16px; scrollbar-width: thin;">
        <button class="btn ${currentFilter === 'all' ? 'btn-primary' : 'btn-secondary'} video-filter-btn" data-subject="all" style="font-size: 0.8rem; padding: 6px 14px; white-space: nowrap;">
          ${isAr ? 'جميع المواد (12)' : 'All Subjects (12)'}
        </button>
        ${subjects.map(s => `
          <button class="btn ${currentFilter === s.id ? 'btn-primary' : 'btn-secondary'} video-filter-btn" data-subject="${s.id}" style="font-size: 0.8rem; padding: 6px 14px; white-space: nowrap;">
            ${isAr ? s.name_ar : s.name_en}
          </button>
        `).join('')}
      </div>

      <div id="videos-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 18px;"></div>
    `;

    renderList();

    container.querySelectorAll('.video-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentFilter = btn.getAttribute('data-subject');
        container.querySelectorAll('.video-filter-btn').forEach(b => {
          b.className = b.getAttribute('data-subject') === currentFilter ? 'btn btn-primary video-filter-btn' : 'btn btn-secondary video-filter-btn';
        });
        renderList();
      });
    });
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
