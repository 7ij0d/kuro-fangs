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

  // Helper: Generate Fox Mascot Skins Grid HTML
  getFoxSkinsGridHtml(isAr) {
    const skins = window.STORE.getFoxSkins();
    const ownedSkins = window.STORE.getOwnedSkins();
    const equippedId = window.STORE.getEquippedSkin();
    const currentPoints = window.STORE.getPoints();

    return `
      <div class="fox-skins-grid">
        ${skins.map(skin => {
          const isEquipped = skin.id === equippedId;
          const isOwned = ownedSkins.includes(skin.id);
          const canAfford = currentPoints >= skin.cost;
          const name = isAr ? skin.name_ar : skin.name_en;
          const subName = isAr ? skin.name_en : skin.name_ar;
          const tag = isAr ? skin.tag_ar : skin.tag_en;
          const desc = isAr ? skin.desc_ar : skin.desc_en;

          let costLabel = '';
          if (skin.isFree) {
            costLabel = isAr ? 'الافتراضي (مجاناً)' : 'Default (Free)';
          } else {
            costLabel = isAr ? `${skin.cost} نقطة` : `${skin.cost} pts`;
          }

          let actionButtonHtml = '';
          if (isEquipped) {
            actionButtonHtml = `
              <button class="btn-skin-action btn-skin-current" disabled>
                <i data-lucide="check-circle" style="width: 16px; height: 16px;"></i>
                <span>${isAr ? '✓ السكن النشط حالياً' : '✓ Active Mascot'}</span>
              </button>
            `;
          } else if (isOwned) {
            actionButtonHtml = `
              <button class="btn-skin-action btn-skin-equip" data-skin-id="${skin.id}">
                <i data-lucide="sparkles" style="width: 16px; height: 16px;"></i>
                <span>${isAr ? 'ارتداء السكن' : 'Equip Mascot'}</span>
              </button>
            `;
          } else if (canAfford) {
            actionButtonHtml = `
              <button class="btn-skin-action btn-skin-unlock" data-skin-id="${skin.id}">
                <i data-lucide="unlock" style="width: 16px; height: 16px;"></i>
                <span>${isAr ? `فتح بـ ${skin.cost} نقطة` : `Unlock for ${skin.cost} pts`}</span>
              </button>
            `;
          } else {
            const needed = skin.cost - currentPoints;
            actionButtonHtml = `
              <button class="btn-skin-action btn-skin-locked" disabled title="${isAr ? `ينقصك ${needed} نقطة` : `Need ${needed} more pts`}">
                <i data-lucide="lock" style="width: 16px; height: 16px;"></i>
                <span>${isAr ? `مقفل (${skin.cost} نقطة)` : `Locked (${skin.cost} pts)`}</span>
              </button>
            `;
          }

          return `
            <div class="fox-skin-card ${isEquipped ? 'is-equipped' : ''}" data-skin-id="${skin.id}">
              <div class="fox-skin-visual">
                <img src="${skin.image}" alt="${name}" loading="lazy" />
                <div class="fox-skin-cost-badge">${costLabel}</div>
                <div class="fox-skin-tag-badge">${tag}</div>
              </div>
              <div class="fox-skin-content">
                <div class="fox-skin-title-wrap">
                  <div class="fox-skin-name-ar">${name}</div>
                  <div class="fox-skin-name-en">${subName}</div>
                </div>
                <p class="fox-skin-desc">${desc}</p>
                <div class="fox-skin-actions">
                  ${actionButtonHtml}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  // Helper: Attach Event Listeners to Skin Cards
  attachSkinActionListeners(container, isAr, onUpdateCallback) {
    container.querySelectorAll('.btn-skin-equip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const skinId = btn.getAttribute('data-skin-id');
        const success = window.STORE.equipSkin(skinId);
        if (success) {
          const skin = window.STORE.getSkinById(skinId);
          const name = isAr ? skin.name_ar : skin.name_en;
          const msg = isAr ? `تم ارتداء "${name}" وتحديث جميع الواجهات بنجاح! 🦊` : `Equipped "${name}" successfully! 🦊`;
          window.showToast(msg, { type: 'success' });
          if (typeof onUpdateCallback === 'function') onUpdateCallback();
        }
      });
    });

    container.querySelectorAll('.btn-skin-unlock').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const skinId = btn.getAttribute('data-skin-id');
        const res = window.STORE.unlockSkin(skinId);
        const skin = window.STORE.getSkinById(skinId);
        const name = isAr ? skin.name_ar : skin.name_en;

        if (res.success) {
          const msg = isAr 
            ? `🎉 مبارك! تم فتح وتجهيز "${name}" بنجاح!` 
            : `🎉 Awesome! Unlocked and equipped "${name}"!`;
          window.showToast(msg, { type: 'success' });
          if (typeof onUpdateCallback === 'function') onUpdateCallback();
        } else if (res.reason === 'insufficient_points') {
          const msg = isAr 
            ? `عذراً، تحتاج إلى ${res.needed} نقطة إضافية لفتح هذا السكن!` 
            : `Insufficient points! You need ${res.needed} more points to unlock this skin.`;
          window.showToast(msg, { type: 'warning' });
        }
      });
    });
  },

  // Fox Mascot Skins Hub & Academic Rewards Store (/rewards)
  renderRewards(container, queryParams) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;

    const renderView = () => {
      const currentPoints = window.STORE.getPoints();
      const equippedSkin = window.STORE.getEquippedSkinData();

      container.innerHTML = `
        <div class="page-title-bar">
          <div class="page-title-group">
            <h1>
              <i data-lucide="sparkles" style="color: var(--brand-primary); width: 26px; height: 26px;"></i>
              ${isAr ? 'متجر سكنات وشخصيات الثعلب الـ 6' : 'Fox Mascot Skins Hub (6 Mascots)'}
            </h1>
            <p>${isAr ? 'افتح شخصيات وتميمة الثعلب الستة وارتدِ سكنك المفضل في الهيدر والقائمة والبروفايل' : 'Unlock and equip the 6 official mascot skins across header, sidebar, and profile'}</p>
          </div>
        </div>

        <!-- Banner & Current Status -->
        <div class="fox-skins-header-card">
          <div class="fox-skins-header-info">
            <div class="fox-current-equipped-preview">
              <img src="${equippedSkin.image}" alt="${isAr ? equippedSkin.name_ar : equippedSkin.name_en}" class="current-mascot-img" />
            </div>
            <div>
              <span class="badge badge-primary" style="margin-bottom: 6px; font-size: 0.725rem;">
                ${isAr ? 'السكن المرتدى حالياً' : 'Currently Equipped Mascot'}
              </span>
              <h2 style="font-size: 1.25rem; margin-bottom: 4px; color: var(--text-primary);">
                ${isAr ? equippedSkin.name_ar : equippedSkin.name_en}
              </h2>
              <p style="font-size: 0.825rem; color: var(--text-secondary); margin: 0;">
                ${isAr ? equippedSkin.desc_ar : equippedSkin.desc_en}
              </p>
            </div>
          </div>

          <div class="fox-balance-pill">
            <div class="fox-balance-val">${currentPoints}</div>
            <div class="fox-balance-lbl">${isAr ? 'نقطة أكاديمية متاحة' : 'Available Points'}</div>
          </div>
        </div>

        <!-- Skins Grid -->
        ${this.getFoxSkinsGridHtml(isAr)}

        <!-- How to earn points info card -->
        <div class="card" style="padding: 24px; border-radius: 16px; margin-top: 10px;">
          <h3 style="font-size: 1rem; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
            <i data-lucide="zap" style="color: #F59E0B; width: 20px; height: 20px;"></i>
            ${isAr ? 'طرق حصد النقاط الأكاديمية لفتح السكنات' : 'How to Earn Academic Points for Skins'}
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px;">
            <div style="background: var(--bg-hover); padding: 12px 16px; border-radius: 10px; border: 1px solid var(--border-subtle);">
              <div style="font-weight: 700; color: var(--brand-primary); font-size: 0.9rem;">+10 ${isAr ? 'نقاط' : 'pts'}</div>
              <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px;">${isAr ? 'تحميل شيت أو ملخص معتمد' : 'Download verified sheet / summary'}</div>
            </div>
            <div style="background: var(--bg-hover); padding: 12px 16px; border-radius: 10px; border: 1px solid var(--border-subtle);">
              <div style="font-weight: 700; color: var(--brand-primary); font-size: 0.9rem;">+5 ${isAr ? 'نقاط' : 'pts'}</div>
              <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px;">${isAr ? 'كتابة وحفظ ملاحظة سريرية' : 'Save clinical study note'}</div>
            </div>
            <div style="background: var(--bg-hover); padding: 12px 16px; border-radius: 10px; border: 1px solid var(--border-subtle);">
              <div style="font-weight: 700; color: var(--brand-primary); font-size: 0.9rem;">+2 ${isAr ? 'نقطتان' : 'pts'}</div>
              <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px;">${isAr ? 'إضافة محتوى للمفضلة والمحفوظات' : 'Bookmark favorite material'}</div>
            </div>
          </div>
        </div>
      `;

      if (window.lucide) window.lucide.createIcons();
      this.attachSkinActionListeners(container, isAr, () => {
        renderView();
      });
    };

    renderView();
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
            <h2 style="font-size: 1.25rem; margin-bottom: 4px;">${userInfo.name}</h2>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;">${userInfo.title}</p>
            <span class="badge badge-primary" style="margin-bottom: 18px; font-size: 0.75rem;">
              🦊 ${isAr ? equippedSkin.name_ar : equippedSkin.name_en}
            </span>

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
                <span>${isAr ? 'سكنات وشخصيات الثعلب الـ 6 (Fox Mascot Skins Hub)' : 'Fox Mascot Skins Hub (6 Mascots)'}</span>
              </h3>
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
                ${isAr ? 'اختر وارتدِ شخصية الثعلب لتظهر كرمزك الرسمي في الهيدر والقائمة الجانبية والبروفايل' : 'Select and equip your mascot character to represent your avatar across the platform'}
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
        ${alerts.length === 0 ? (
          window.renderEmptyState
            ? window.renderEmptyState()
            : `
              <div class="empty-state-card">
                <div class="empty-state-icon-wrap">
                  <i data-lucide="folder-open"></i>
                </div>
                <h3 class="empty-state-title">لا توجد محتويات مضافة حالياً</h3>
                <p class="empty-state-subtitle">جاري رفع واستكمال الملازم والمحتوى الأكاديمي قريباً</p>
              </div>
            `
        ) : alerts.map(a => `
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

    if (window.lucide) window.lucide.createIcons();
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
