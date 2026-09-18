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

    const baseSummaries = window.DATA?.summaries || [];

    const renderList = () => {
      const filtered = currentFilter === 'all'
        ? baseSummaries
        : baseSummaries.filter(s => s.subject_id === currentFilter);

      const gridEl = document.getElementById('summaries-grid');
      if (!gridEl) return;

      if (filtered.length === 0) {
        gridEl.innerHTML = `
          <div style="grid-column: 1 / -1;">
            ${window.renderEmptyState
              ? window.renderEmptyState()
              : `
                <div class="empty-state-card">
                  <div class="empty-state-icon-wrap">
                    <i data-lucide="folder-open"></i>
                  </div>
                  <h3 class="empty-state-title">${isAr ? 'لا توجد محتويات مضافة حالياً' : 'No contents available yet'}</h3>
                  <p class="empty-state-subtitle">${isAr ? 'جاري رفع واستكمال الملازم والمحتوى الأكاديمي قريباً' : 'Handouts and academic curriculum materials will be uploaded soon.'}</p>
                </div>
              `}
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

    const baseVideos = window.DATA?.videos || [];

    const renderList = () => {
      const filtered = currentFilter === 'all'
        ? baseVideos
        : baseVideos.filter(v => v.subject_id === currentFilter);

      const gridEl = document.getElementById('videos-grid');
      if (!gridEl) return;

      if (filtered.length === 0) {
        gridEl.innerHTML = `
          <div style="grid-column: 1 / -1;">
            ${window.renderEmptyState
              ? window.renderEmptyState()
              : `
                <div class="empty-state-card">
                  <div class="empty-state-icon-wrap">
                    <i data-lucide="folder-open"></i>
                  </div>
                  <h3 class="empty-state-title">${isAr ? 'لا توجد محتويات مضافة حالياً' : 'No contents available yet'}</h3>
                  <p class="empty-state-subtitle">${isAr ? 'جاري رفع واستكمال الملازم والمحتوى الأكاديمي قريباً' : 'Handouts and academic curriculum materials will be uploaded soon.'}</p>
                </div>
              `}
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

  // Audio Recordings
  renderAudioRecordings(container, queryParams) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
    const subjects = window.DATA ? window.DATA.getSubjects() : [];
    const targetSubject = queryParams?.get('subject') || 'all';
    let currentFilter = targetSubject;

    const baseRecordings = window.DATA?.recordings || [];

    const renderList = async () => {
      const filtered = currentFilter === 'all'
        ? baseRecordings
        : baseRecordings.filter(r => r.subject_id === currentFilter);

      const gridEl = document.getElementById('recordings-list');
      if (!gridEl) return;

      if (filtered.length === 0) {
        gridEl.innerHTML = `
          <div style="grid-column: 1 / -1;">
            ${window.renderEmptyState
              ? window.renderEmptyState()
              : `
                <div class="empty-state-card">
                  <div class="empty-state-icon-wrap">
                    <i data-lucide="folder-open"></i>
                  </div>
                  <h3 class="empty-state-title">${isAr ? 'لا توجد محتويات مضافة حالياً' : 'No contents available yet'}</h3>
                  <p class="empty-state-subtitle">${isAr ? 'جاري رفع واستكمال المحتوى الصوتي قريباً' : 'Audio curriculum materials will be uploaded soon.'}</p>
                </div>
              `}
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      const itemsHtml = await Promise.all(filtered.map(async rec => {
        let sheetName = isAr ? 'محاضرة غير محددة' : 'Unknown Sheet';
        if (window.DATA?.sheets) {
          const sheet = window.DATA.sheets.find(s => s.id === rec.sheet_id);
          if (sheet) {
            sheetName = sheet.title || sheet.title_ar || sheetName;
          }
        }

        let audioSrc = rec.audio_url || '';
        if (!audioSrc && window.DATA?.audioStore?.getAudio) {
          try {
            const blob = await window.DATA.audioStore.getAudio(rec.id);
            if (blob) {
              audioSrc = URL.createObjectURL(blob);
            }
          } catch (err) {
            console.error('Failed to load audio from IDB:', err);
          }
        }

        let playSection = '';
        if (audioSrc) {
          playSection = `<audio controls src="${audioSrc}" style="width: 100%; height: 40px; margin-top: 8px; border-radius: var(--radius-sm);"></audio>`;
        }

        let telegramBtn = '';
        if (rec.telegram_url) {
          telegramBtn = `
            <button class="btn btn-secondary btn-sm" onclick="window.open('${rec.telegram_url}', '_blank')" style="display: inline-flex; align-items: center; gap: 6px; font-size: 0.8rem; padding: 6px 12px; margin-top: 8px;">
              <i data-lucide="send" style="width: 14px; height: 14px;"></i>
              ${isAr ? 'فتح في تليجرام' : 'Open in Telegram'}
            </button>
          `;
        }

        return `
          <div class="kf-panel" style="padding: 16px; display: flex; flex-direction: column; gap: 8px; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px;">
              <span class="badge badge-primary" style="display: inline-flex; align-items: center; gap: 4px;">
                <i data-lucide="headphones" style="width: 12px; height: 12px;"></i>
                ${sheetName}
              </span>
              ${rec.duration ? `<span style="font-size: 0.75rem; color: var(--text-muted); background: var(--bg-surface-subtle); padding: 2px 8px; border-radius: var(--radius-full); border: 1px solid var(--border-subtle);">${rec.duration}</span>` : ''}
            </div>
            
            <h3 style="font-size: 1.05rem; color: var(--text-primary); margin: 4px 0 0; line-height: 1.4;">
              ${isAr ? (rec.title_ar || rec.title_en) : (rec.title_en || rec.title_ar)}
            </h3>
            
            <div style="font-size: 0.85rem; color: var(--text-secondary); display: flex; gap: 8px; align-items: center;">
              <span>${rec.doctor || (isAr ? 'دكتور الكلية' : 'Faculty Doctor')}</span>
              ${rec.date ? `<span style="color: var(--border-subtle);">&bull;</span><span>${rec.date}</span>` : ''}
            </div>

            ${playSection}
            
            ${telegramBtn ? `<div>${telegramBtn}</div>` : ''}
          </div>
        `;
      }));

      gridEl.innerHTML = itemsHtml.join('');
      if (window.lucide) window.lucide.createIcons();
    };

    container.innerHTML = `
      <div class="page-title-bar">
        <div class="page-title-group">
          <h1>
            <i data-lucide="headphones" style="color: var(--brand-primary); width: 26px; height: 26px;"></i>
            ${isAr ? 'التسجيلات الصوتية' : 'Audio Recordings'}
          </h1>
          <p>${isAr ? 'تسجيلات صوتية لمحاضرات دكاترة الكلية مرتبطة بالشيتات' : 'Faculty lecture audio recordings linked to lecture sheets'}</p>
        </div>
      </div>

      <!-- Filters -->
      <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 16px; scrollbar-width: thin;">
        <button class="btn ${currentFilter === 'all' ? 'btn-primary' : 'btn-secondary'} audio-filter-btn" data-subject="all" style="font-size: 0.8rem; padding: 6px 14px; white-space: nowrap;">
          ${isAr ? 'جميع المواد' : 'All Subjects'}
        </button>
        ${subjects.map(s => `
          <button class="btn ${currentFilter === s.id ? 'btn-primary' : 'btn-secondary'} audio-filter-btn" data-subject="${s.id}" style="font-size: 0.8rem; padding: 6px 14px; white-space: nowrap;">
            ${isAr ? s.name_ar : s.name_en}
          </button>
        `).join('')}
      </div>

      <div id="recordings-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px;"></div>
    `;

    renderList();

    container.querySelectorAll('.audio-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentFilter = btn.getAttribute('data-subject');
        container.querySelectorAll('.audio-filter-btn').forEach(b => {
          b.className = b.getAttribute('data-subject') === currentFilter ? 'btn btn-primary audio-filter-btn' : 'btn btn-secondary audio-filter-btn';
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

  // Helper: Generate Fox Mascot Skins Grid HTML (Delegated to RewardsPage)
  getFoxSkinsGridHtml(isAr) {
    if (window.RewardsPage && typeof window.RewardsPage.getFoxSkinsGridHtml === 'function') {
      return window.RewardsPage.getFoxSkinsGridHtml(isAr);
    }
    return '';
  },

  // Helper: Attach Event Listeners to Skin Cards (Delegated to RewardsPage)
  attachSkinActionListeners(container, isAr, onUpdateCallback) {
    if (window.RewardsPage && typeof window.RewardsPage.attachSkinActionListeners === 'function') {
      window.RewardsPage.attachSkinActionListeners(container, isAr, onUpdateCallback);
    }
  },

  // Fox Mascot Skins Hub & Academic Rewards Store (/rewards)
  renderRewards(container, queryParams) {
    if (window.RewardsPage && typeof window.RewardsPage.render === 'function') {
      window.RewardsPage.render(container, queryParams);
    }
  },

  // Profile (/profile)
  renderProfile(container) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;

    const renderView = () => {
      const userInfo = window.STORE.getUserInfo();
      const points = window.STORE.getPoints();
      const notesCount = window.STORE.getNotes().length;
      const favsCount = window.STORE.getFavorites().length;
      const equippedSkin = window.STORE.getEquippedSkinData();

      container.innerHTML = `
        <div class="page-title-bar">
          <div class="page-title-group">
            <h1>
              <i data-lucide="user-check" style="color: var(--brand-primary); width: 26px; height: 26px;"></i>
              ${isAr ? 'الملف الشخصي والرصيد الأكاديمي' : 'Student Profile & Academic Balance'}
            </h1>
            <p>${isAr ? 'بيانات الطالب، سكن الثعلب المرتدى، مستوى التفاعل، وشارات التفوق' : 'Student details, active mascot skin, activity statistics, and academic badges'}</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 20px; margin-bottom: 30px;">
          <!-- Profile Card -->
          <div class="card" style="padding: 28px; text-align: center;">
            <div style="width: 88px; height: 88px; border-radius: 50%; overflow: hidden; margin: 0 auto 16px; border: 4px solid #BE123C; box-shadow: 0 6px 18px rgba(190, 18, 60, 0.35); position: relative;">
              <img src="${equippedSkin.image}" alt="${isAr ? equippedSkin.name_ar : equippedSkin.name_en}" style="width: 100%; height: 100%; object-fit: cover; display: block;" class="current-mascot-img" />
            </div>
            <h2 style="font-size: 1.25rem; margin-bottom: 4px;">
              ${window.SupabaseAuth?.getUser() ? (window.SupabaseAuth.getUser().user_metadata?.full_name || window.SupabaseAuth.getUser().email.split('@')[0]) : (isAr ? 'طالب زائر (Guest)' : 'Guest Student')}
            </h2>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;">
              ${window.SupabaseAuth?.getUser() ? window.SupabaseAuth.getUser().email : (isAr ? 'حساب محلي غير مقترن بالسحابة' : 'Local Unsynced Account')}
            </p>

            <div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;">
              <span class="badge badge-primary" style="font-size: 0.75rem;">
                🦊 ${isAr ? equippedSkin.name_ar : equippedSkin.name_en}
              </span>
              ${window.SupabaseAuth?.isLoggedIn() ? `
                <span class="badge" style="background: rgba(2, 132, 199, 0.12); color: #0284C7; border: 1px solid rgba(2, 132, 199, 0.3); font-size: 0.75rem;">
                  ☁️ ${isAr ? 'موثق بالسحابة' : 'Cloud Synced'}
                </span>
              ` : `
                <span class="badge" style="background: rgba(148, 163, 184, 0.15); color: #64748B; border: 1px solid rgba(148, 163, 184, 0.3); font-size: 0.75rem;">
                  👤 ${isAr ? 'زائر (اختياري)' : 'Guest Mode'}
                </span>
              `}
            </div>

            <!-- Cloud Sync & Auth Actions inside Profile -->
            ${window.SupabaseAuth?.isLoggedIn() ? `
              <div style="margin-bottom: 16px; padding: 12px; border-radius: 10px; background: var(--bg-surface-subtle); border: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);">
                  ☁️ ${isAr ? 'المزامنة السحابية' : 'Cloud Backup'}:
                </span>
                <div style="display: flex; gap: 6px;">
                  <button class="btn btn-sm btn-soft" onclick="window.SupabaseAuth.syncNow().then(ok => window.Toast?.success(isAr ? 'تمت مزامنة بياناتك وسكناتك مع السحابة ☁️' : 'Profile synced to cloud! ☁️'))" style="font-size: 0.75rem; padding: 4px 10px;">
                    ${isAr ? 'مزامنة الآن 🔄' : 'Sync Now 🔄'}
                  </button>
                  <button class="btn btn-sm btn-outline" onclick="window.SupabaseAuth.signOut().then(() => renderView())" style="font-size: 0.75rem; padding: 4px 10px; color: #EF4444;">
                    ${isAr ? 'خروج' : 'Logout'}
                  </button>
                </div>
              </div>
            ` : `
              <div style="margin-bottom: 18px; padding: 14px; border-radius: 12px; background: linear-gradient(135deg, rgba(2, 132, 199, 0.08), rgba(136, 19, 55, 0.05)); border: 1.5px dashed var(--brand-burgundy-border); text-align: center;">
                <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0 0 10px; line-height: 1.5;">
                  ${isAr
                    ? '💡 أنشئ حسابك الاختياري الآن لحفظ نقاطك وسكناتك في السحابة مجاناً ومزامنتها بين أجهزتك.'
                    : '💡 Connect an optional free cloud account to backup points and skins across devices.'}
                </p>
                <button class="btn btn-sm btn-primary" onclick="window.AuthModal.open('signup')" style="font-size: 0.8rem; padding: 6px 14px; width: 100%;">
                  <span>☁️ ${isAr ? 'إنشاء حساب / تسجيل الدخول' : 'Sign In / Create Account'}</span>
                </button>
              </div>
            `}

            <div style="background: var(--brand-primary-light); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--brand-primary-border); margin-bottom: 20px;">
              <div style="font-size: 0.8rem; color: var(--brand-primary); font-weight: 600;">${isAr ? 'الرصيد الأكاديمي الحالي' : 'Current Academic Points'}</div>
              <div style="font-size: 1.8rem; font-weight: 800; color: var(--brand-primary);">${points} ${isAr ? 'نقطة' : 'pts'}</div>
            </div>

            <div style="display: flex; justify-content: space-around; border-top: 1px solid var(--border-subtle); padding-top: 16px;">
              <div>
                <div style="font-weight: 700; font-size: 1.1rem;">${notesCount}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${isAr ? 'الملاحظات' : 'Notes'}</div>
              </div>
              <div>
                <div style="font-weight: 700; font-size: 1.1rem;">${favsCount}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${isAr ? 'المفضلة' : 'Bookmarks'}</div>
              </div>
              <div>
                <div style="font-weight: 700; font-size: 1.1rem;">12</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${isAr ? 'المواد' : 'Subjects'}</div>
              </div>
            </div>
          </div>

          <!-- Badges & Achievements -->
          <div class="card" style="padding: 24px;">
            <h3 style="font-size: 1.1rem; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
              <i data-lucide="award" style="color: var(--color-warning);"></i>
              ${isAr ? 'شارات الإنجاز والتفوق' : 'Academic Badges & Milestones'}
            </h3>
            
            <div style="display: flex; flex-direction: column; gap: 14px;">
              <div style="display: flex; align-items: center; gap: 14px; padding: 12px; border-radius: var(--radius-sm); background: #F0FDF4; border: 1px solid #BBF7D0;">
                <div style="font-size: 1.6rem;">🥇</div>
                <div>
                  <h4 style="font-size: 0.9rem; margin-bottom: 2px;">${isAr ? 'طالب نشط ومجتهد' : 'Active Dental Scholar'}</h4>
                  <p style="font-size: 0.75rem; color: var(--text-secondary);">${isAr ? 'حصلت على 25+ نقطة أكاديمية في المنصة' : 'Earned 25+ academic engagement points'}</p>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 14px; padding: 12px; border-radius: var(--radius-sm); background: #FAFBF9; border: 1px solid var(--border-subtle);">
                <div style="font-size: 1.6rem;">🦷</div>
                <div>
                  <h4 style="font-size: 0.9rem; margin-bottom: 2px;">${isAr ? 'مستكشف مقررات الأسنان' : 'Dental Curriculum Explorer'}</h4>
                  <p style="font-size: 0.75rem; color: var(--text-secondary);">${isAr ? 'استعراض وتصفح مواد السنة الثالثة الـ 12' : 'Explored all 12 Year 3 dental academic modules'}</p>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 14px; padding: 12px; border-radius: var(--radius-sm); background: #FAFBF9; border: 1px solid var(--border-subtle);">
                <div style="font-size: 1.6rem;">⚡</div>
                <div>
                  <h4 style="font-size: 0.9rem; margin-bottom: 2px;">${isAr ? 'بطل الكويزات التفاعلية' : 'Quiz & Practice Champion'}</h4>
                  <p style="font-size: 0.75rem; color: var(--text-secondary);">${isAr ? 'حل واجتياز اختبارات بنك الأسئلة' : 'Practiced interactive MCQs and question banks'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Fox Mascot Skins Hub embedded in Profile -->
        <div style="margin-top: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
            <div>
              <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin-bottom: 4px; display: flex; align-items: center; gap: 8px;">
                <span>🦊</span>
                <span>${isAr ? 'سكنات وشخصيات الثعلب الـ 4 وثيمات المنصة' : 'Fox Mascot Skins & Site Themes (4 Mascots)'}</span>
              </h3>
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
                ${isAr ? 'اختر وارتدِ شخصية الثعلب لتغيير مظهرك وثيم الموقع بالكامل' : 'Select and equip your mascot to transform your avatar and site-wide theme'}
              </p>
            </div>
            <a href="#/rewards" class="btn btn-soft" style="font-size: 0.8rem; padding: 6px 14px; display: inline-flex; align-items: center; gap: 6px;">
              <i data-lucide="sparkles" style="width: 14px; height: 14px;"></i>
              ${isAr ? 'فتح متجر السكنات' : 'Open Skins Hub'}
            </a>
          </div>

          ${this.getFoxSkinsGridHtml(isAr)}
        </div>
      `;

      if (window.lucide) window.lucide.createIcons();
      this.attachSkinActionListeners(container, isAr, () => {
        renderView();
      });
    };

    renderView();
  },

  // Alerts
  renderAlerts(container) {
    const alerts = window.DATA.getAlerts();
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;

    container.innerHTML = `
      <div class="page-title-bar">
        <div class="page-title-group">
          <h1>
            <i data-lucide="bell" style="color: var(--brand-primary); width: 26px; height: 26px;"></i>
            ${isAr ? 'مركز التنبيهات والإعلانات الرسمية' : 'Official Faculty Announcements & Alerts'}
          </h1>
          <p>${isAr ? 'كافة التبليغات الصادرة عن قسم الدراسة والامتحانات – كلية طب وجراحة الفم والأسنان' : 'All official announcements from the Study & Exams Department — Faculty of Dentistry'}</p>
        </div>
      </div>

      <div class="compact-alerts-list" style="display: flex; flex-direction: column; gap: 16px;">
        ${alerts.length === 0 ? (
          window.renderEmptyState
            ? window.renderEmptyState()
            : `
              <div class="empty-state-card">
                <div class="empty-state-icon-wrap">
                  <i data-lucide="folder-open"></i>
                </div>
                <h3 class="empty-state-title">${isAr ? 'لا توجد محتويات مضافة حالياً' : 'No announcements available yet'}</h3>
                <p class="empty-state-subtitle">${isAr ? 'جاري رفع واستكمال الإعلانات والمحتوى الأكاديمي قريباً' : 'Official notices and curriculum updates will be published soon.'}</p>
              </div>
            `
        ) : alerts.map(a => {
          const title = (isAr ? a.title_ar : (a.title_en || a.title_ar)) || a.title || '';
          const content = (isAr ? a.content_ar : (a.content_en || a.content_ar)) || a.message || '';
          const badge = (isAr ? a.badge_ar : (a.badge_en || a.badge_ar)) || '';
          const publisher = (isAr ? a.publisher_ar : (a.publisher_en || a.publisher_ar)) || '';
          const dateTime = [a.date, a.time].filter(Boolean).join(' • ') || a.created_at || (isAr ? 'حديثاً' : 'Recent');

          let iconName = 'info';
          let borderClass = 'alert-warning';
          let badgeClass = 'badge-warning';

          if (a.type === 'urgent') {
            iconName = 'alert-triangle';
            borderClass = 'alert-urgent';
            badgeClass = 'badge-danger';
          } else if (a.type === 'exam') {
            iconName = 'calendar';
            borderClass = 'alert-warning';
            badgeClass = 'badge-primary';
          } else if (a.type === 'link') {
            iconName = 'external-link';
            borderClass = 'alert-info';
            badgeClass = 'badge-info';
          } else if (a.type === 'plan') {
            iconName = 'file-text';
            borderClass = 'alert-success';
            badgeClass = 'badge-success';
          }

          return `
            <div class="compact-alert-card ${borderClass}" style="padding: 16px 20px; border-radius: var(--radius-md); background: var(--bg-surface); border: 1px solid var(--border-subtle); display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span class="alert-icon-pill ${badgeClass}" style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px;">
                    <i data-lucide="${iconName}" style="width: 18px; height: 18px;"></i>
                  </span>
                  ${badge ? `<span style="font-size: 0.75rem; font-weight: 700; padding: 3px 10px; border-radius: 999px; background: var(--bg-hover); color: var(--text-primary); border: 1px solid var(--border-subtle);">${badge}</span>` : ''}
                </div>
                <div class="alert-meta" style="font-size: 0.75rem; color: var(--text-secondary); display: flex; align-items: center; gap: 6px;">
                  <i data-lucide="clock" style="width: 13px; height: 13px;"></i>
                  <span>${dateTime}</span>
                </div>
              </div>

              <div class="alert-text-group">
                <h3 class="alert-headline" style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">${title}</h3>
                <div class="alert-description" style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; white-space: pre-line;">${content}</div>
              </div>

              ${publisher || a.url ? `
                <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; padding-top: 10px; border-top: 1px solid var(--border-subtle); font-size: 0.8rem; color: var(--text-tertiary);">
                  ${publisher ? `<span style="display: flex; align-items: center; gap: 5px;"><i data-lucide="shield-check" style="width: 14px; height: 14px; color: var(--brand-primary);"></i> ${publisher}</span>` : '<span></span>'}
                  ${a.url ? `<a href="${a.url}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary" style="display: inline-flex; align-items: center; gap: 6px; font-size: 0.75rem; padding: 4px 12px; border-radius: var(--radius-sm);"><i data-lucide="external-link" style="width: 12px; height: 12px;"></i> ${isAr ? 'فتح البوابة الرسمية' : 'Open Portal'}</a>` : ''}
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  },

  // Search
  renderSearch(container, queryParams) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
    const q = (queryParams.get('q') || '').toLowerCase().trim();
    if (!q) {
      window.navigate('/');
      return;
    }
    const subjects = (window.DATA?.getSubjects() || []).filter(s =>
      (s.name_ar || '').toLowerCase().includes(q) ||
      (s.name_en || '').toLowerCase().includes(q) ||
      (s.code || '').toLowerCase().includes(q)
    );
    const sheets = (window.DATA?.getRecentSheets(200) || []).filter(s =>
      (s.title || '').toLowerCase().includes(q) ||
      (s.title_ar || '').toLowerCase().includes(q) ||
      (s.title_en || '').toLowerCase().includes(q) ||
      (s.doctor_name || '').toLowerCase().includes(q) ||
      (s.subject_name || '').toLowerCase().includes(q)
    );


    container.innerHTML = `
      <div class="page-title-bar">
        <div class="page-title-group">
          <h1>
            <i data-lucide="search" style="color: var(--brand-primary); width: 26px; height: 26px;"></i>
            ${isAr ? `نتائج البحث عن: "${q}"` : `Search results for: "${q}"`}
          </h1>
          <p>${isAr ? `تم العثور على ${subjects.length} مادة و ${sheets.length} محاضرة مطابقة` : `Found ${subjects.length} subject(s) and ${sheets.length} sheet(s) matching your search`}</p>
        </div>
        <div>
          <a href="#/" class="btn btn-secondary btn-sm" style="gap: 6px;">
            <i data-lucide="arrow-left" style="width:14px;height:14px;"></i>
            ${isAr ? 'العودة للرئيسية' : 'Back to Home'}
          </a>
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
