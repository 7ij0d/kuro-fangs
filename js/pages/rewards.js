/**
 * KURO FANGS — REWARDS & FOX MASCOT SKINS HUB (4 Core Mascots & Site-Wide Themes)
 */

const RewardsPage = {
  // Helper: Generate Fox Mascot Skins Grid HTML (Exact 4 Core Skins)
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
          const themeName = isAr ? skin.theme_name_ar : skin.theme_name_en;
          const desc = isAr ? skin.desc_ar : skin.desc_en;
          const colors = skin.theme_colors || ['#BE123C', '#881337', '#F5F8FA'];

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
                <span>${isAr ? '✓ السكن والثيم النشط حالياً' : '✓ Active Skin & Theme'}</span>
              </button>
            `;
          } else if (isOwned) {
            actionButtonHtml = `
              <button class="btn-skin-action btn-skin-equip" data-skin-id="${skin.id}">
                <i data-lucide="palette" style="width: 16px; height: 16px;"></i>
                <span>${isAr ? 'ارتداء السكن وتفعيل الثيم' : 'Equip Skin & Theme'}</span>
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
                <!-- Theme Preview Banner -->
                <div class="fox-skin-theme-bar">
                  <div class="fox-skin-theme-dots">
                    ${colors.map(c => `<span class="fox-skin-theme-dot" style="background: ${c};"></span>`).join('')}
                  </div>
                  <span class="fox-skin-theme-name">${themeName}</span>
                </div>

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
          const themeName = isAr ? skin.theme_name_ar : skin.theme_name_en;
          const msg = isAr 
            ? `تم ارتداء "${name}" وتفعيل "${themeName}" لكافة صفحات الموقع! 🦊✨` 
            : `Equipped "${name}" and activated "${themeName}" across the site! 🦊✨`;
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
        const themeName = isAr ? skin.theme_name_ar : skin.theme_name_en;

        if (res.success) {
          const msg = isAr 
            ? `🎉 مبارك! تم فتح "${name}" وارتداؤه وتفعيل "${themeName}" بنجاح!` 
            : `🎉 Congratulations! Unlocked and equipped "${name}" with "${themeName}"!`;
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

  // Main Render View for /rewards
  render(container, queryParams) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;

    const renderView = () => {
      const currentPoints = window.STORE.getPoints();
      const equippedSkin = window.STORE.getEquippedSkinData();
      const currentTheme = window.STORE.getTheme();
      const themeColors = equippedSkin.theme_colors || ['#BE123C', '#881337', '#F5F8FA'];

      container.innerHTML = `
        <div class="page-title-bar">
          <div class="page-title-group">
            <h1>
              <i data-lucide="sparkles" style="color: var(--brand-primary); width: 26px; height: 26px;"></i>
              ${isAr ? 'متجر سكنات الثعلب الـ 4 وثيمات المنصة' : 'Fox Mascot Skins & Site Themes (4 Mascots)'}
            </h1>
            <p>${isAr ? 'اختر وارتدِ سكن الثعلب المفضل؛ كل سكن يحول ثيم وألوان الموقع بالكامل فور ارتدائه' : 'Choose and equip your mascot; each skin instantly transforms the full site-wide theme upon equipping'}</p>
          </div>
        </div>

        <!-- Banner & Current Status -->
        <div class="fox-skins-header-card">
          <div class="fox-skins-header-info">
            <div class="fox-current-equipped-preview">
              <img src="${equippedSkin.image}" alt="${isAr ? equippedSkin.name_ar : equippedSkin.name_en}" class="current-mascot-img" />
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; flex-wrap: wrap;">
                <span class="badge badge-primary" style="font-size: 0.725rem;">
                  ${isAr ? 'السكن النشط' : 'Active Mascot'}
                </span>
                <span class="fox-active-theme-pill" style="display: inline-flex; align-items: center; gap: 6px; font-size: 0.725rem; font-weight: 700; background: var(--bg-hover); padding: 2px 10px; border-radius: 12px; border: 1px solid var(--border-subtle); color: var(--text-secondary);">
                  <span style="display: inline-flex; gap: 3px;">
                    ${themeColors.map(c => `<span style="width: 8px; height: 8px; border-radius: 50%; background: ${c}; display: inline-block;"></span>`).join('')}
                  </span>
                  ${isAr ? equippedSkin.theme_name_ar : equippedSkin.theme_name_en}
                </span>
              </div>
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

        <!-- 4 Core Skins Grid -->
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
              <div style="font-weight: 700; color: var(--brand-primary); font-size: 0.9rem;">+15 ${isAr ? 'نقطة' : 'pts'}</div>
              <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px;">${isAr ? 'إتمام كويز ذكي وتجاوز 80%' : 'Complete AI Quiz with >80% score'}</div>
            </div>
            <div style="background: var(--bg-hover); padding: 12px 16px; border-radius: 10px; border: 1px solid var(--border-subtle);">
              <div style="font-weight: 700; color: var(--brand-primary); font-size: 0.9rem;">+5 ${isAr ? 'نقاط' : 'pts'}</div>
              <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px;">${isAr ? 'مراجعة أطلس البطاقات التفاعلية' : 'Review Flashcard Atlas set'}</div>
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
  }
};

window.RewardsPage = RewardsPage;
