/**
 * KURO FANGS — OFFICIAL CHARACTER & THEME HUB (KURO THEME SYSTEM)
 * Showcases the official Kuro character, color identity, active theme toggles,
 * and the 8 official academic/emotional states across the platform.
 */

const RewardsPage = {
  activePreviewState: 'idle',

  isDevMode() {
    const hash = window.location.hash || '';
    const search = window.location.search || '';
    if (hash.includes('preview=soon') || search.includes('preview=soon')) {
      return false;
    }
    if (hash.includes('dev=true') || hash.includes('preview=1') || search.includes('dev=true') || search.includes('preview=1')) {
      return true;
    }
    const host = window.location.hostname || '';
    if (host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0' || window.location.protocol === 'file:') {
      return true;
    }
    try {
      if (localStorage.getItem('kf_dev_preview') === 'true' || localStorage.getItem('kf_admin_auth') || localStorage.getItem('kf_admin_pin_verified') === 'true') {
        return true;
      }
    } catch (e) {}
    return false;
  },

  renderComingSoon(container) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
    const mascotAsset = 'assets/characters/kuro/Kuro-Thinking.png';

    container.innerHTML = `
      <div style="min-height: 72vh; display: flex; align-items: center; justify-content: center; padding: 24px 16px;">
        <div class="card" style="max-width: 600px; width: 100%; padding: 44px 32px; text-align: center; border-radius: 20px; border: 1px solid var(--border-card); background: var(--bg-card); box-shadow: var(--shadow-card); position: relative; overflow: hidden;">
          
          <div style="position: absolute; top: -60px; left: 50%; transform: translateX(-50%); width: 280px; height: 160px; background: radial-gradient(circle, rgba(200, 67, 67, 0.12) 0%, transparent 70%); pointer-events: none;"></div>

          <div style="width: 140px; height: 140px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; position: relative;">
            <div style="position: absolute; inset: 0; border-radius: 50%; background: radial-gradient(circle, rgba(200, 67, 67, 0.08) 0%, transparent 70%);"></div>
            <img 
              src="${mascotAsset}" 
              alt="Kuro Mascot" 
              style="max-width: 130px; max-height: 130px; object-fit: contain; animation: kuroCompanionFloat 3.5s ease-in-out infinite; filter: drop-shadow(0 12px 24px rgba(0,0,0,0.18));"
            />
          </div>

          <div style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 9999px; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.28); color: #D97706; font-size: 0.78rem; font-weight: 800; margin-bottom: 16px; letter-spacing: 0.02em;">
            <span style="width: 7px; height: 7px; border-radius: 50%; background: #F59E0B; box-shadow: 0 0 8px #F59E0B;"></span>
            <span>${isAr ? 'قريباً • قيد التجهيز والتطوير' : 'Coming Soon • Under Active Development'}</span>
          </div>

          <h1 style="font-size: 1.45rem; font-weight: 850; color: var(--text-primary); margin: 0 0 10px; line-height: 1.35; letter-spacing: -0.015em;">
            ${isAr ? 'مركز كورو التفاعلي والمكافآت' : 'Kuro Mascot Hub & Rewards'}
          </h1>

          <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; margin: 0 auto 24px; max-width: 480px;">
            ${isAr ? 'نعمل حالياً على تجهيز وتطوير مركز شخصية كورو ومتجر الشارات والمكافآت الأكاديمية لدفعة طب وجراحة الفم والأسنان. سيكون هذا القسم متاحاً قريباً مع الميزات القادمة.' : 'We are currently developing the official Kuro Mascot Hub and academic reward achievements for dental students. This section will launch in an upcoming release.'}
          </p>

          <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; margin-bottom: 32px;">
            <span class="kf-segmented-badge" style="font-size: 0.75rem; font-weight: 750; padding: 5px 12px; background: var(--bg-surface-subtle); border-color: var(--border-subtle); color: var(--text-primary);">
              ${isAr ? '🦊 8 حالات تعبيرية لكورو' : '🦊 8 Kuro Poses'}
            </span>
            <span class="kf-segmented-badge" style="font-size: 0.75rem; font-weight: 750; padding: 5px 12px; background: var(--bg-surface-subtle); border-color: var(--border-subtle); color: var(--text-primary);">
              ${isAr ? '⭐ شارات التميز الأكاديمي' : '⭐ Academic Mastery Badges'}
            </span>
            <span class="kf-segmented-badge" style="font-size: 0.75rem; font-weight: 750; padding: 5px 12px; background: var(--bg-surface-subtle); border-color: var(--border-subtle); color: var(--text-primary);">
              ${isAr ? '🏆 رصيد نقاط الخبرة XP' : '🏆 Academic Points XP'}
            </span>
          </div>

          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <a href="#/sheets" class="btn btn-primary" style="font-weight: 750; gap: 8px; padding: 10px 20px; font-size: 0.85rem;">
              <i data-lucide="book-open" style="width: 16px; height: 16px;"></i>
              <span>${isAr ? 'تصفح المحاضرات والشيتات' : 'Explore Lecture Sheets'}</span>
            </a>
            <a href="#/" class="btn btn-secondary" style="font-weight: 750; gap: 8px; padding: 10px 18px; font-size: 0.85rem;">
              <i data-lucide="home" style="width: 16px; height: 16px;"></i>
              <span>${isAr ? 'الصفحة الرئيسية' : 'Back to Home'}</span>
            </a>
          </div>

        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  },

  render(container) {
    if (!this.isDevMode()) {
      this.renderComingSoon(container);
      return;
    }

    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
    const currentPoints = window.STORE ? window.STORE.getPoints() : 25;
    const currentTheme = window.STORE ? window.STORE.getTheme() : 'kuro';
    const isDark = currentTheme === 'kuro-dark' || currentTheme === 'dark';

    const kuroTheme = window.CharacterThemeSystem 
      ? window.CharacterThemeSystem.getTheme('kuro')
      : {
          name_ar: 'كورو',
          name_en: 'Kuro',
          title_ar: 'التميمة والشخصية الرسمية لمنصة كورو فانغز',
          title_en: 'Official Mascot & Visual Identity of Kuro Fangs',
          desc_ar: 'الشخصية الرسمية المعتمدة لدفعة طب وجراحة الفم والأسنان. يرتدي معطف الأكاديميا العاجي، قناع الأوبسيديان، والوشاح القرمزي المتوهج.',
          desc_en: 'The official visual source of truth for Kuro Fangs dental students. Cloaked in warm bone ivory, charcoal obsidian mask, and radiant crimson scarf.',
          states: []
        };

    const states = kuroTheme.states || [];
    const activeAssetUrl = window.CharacterThemeSystem
      ? window.CharacterThemeSystem.getAsset(this.activePreviewState, 'kuro')
      : 'assets/characters/kuro/Kuro-Idle.png';

    const renderView = () => {
      const activeStateObj = states.find(s => s.key === this.activePreviewState) || states[0] || {
        name_ar: 'الوضع الافتراضي',
        name_en: 'Idle & Welcome',
        context_ar: 'الصفحة الرئيسية والأفاتار العام',
        context_en: 'Home & Global Avatars'
      };

      container.innerHTML = `
        <!-- Dev Preview Mode Banner -->
        <div class="card" style="padding: 12px 18px; border-radius: 12px; margin-bottom: 20px; background: rgba(2, 132, 199, 0.08); border: 1px solid rgba(2, 132, 199, 0.25); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 8px; font-size: 0.825rem; color: var(--text-primary);">
            <span style="font-size: 1.1rem;">🛠️</span>
            <span>
              <strong>${isAr ? 'وضع المعاينة المحلي (Local Dev Active):' : 'Local Developer Preview:'}</strong>
              ${isAr ? 'هذه الصفحة مغلقة للعامة (Coming Soon) ومعروضة لك فقط للتطوير والتعديل.' : 'This page is locked for public users (Coming Soon) and visible only to you.'}
            </span>
          </div>
          <a href="#/rewards?preview=soon" class="btn btn-secondary btn-sm" style="font-size: 0.72rem; padding: 4px 10px; font-weight: 750;">
            ${isAr ? 'معاينة شاشة الزوار 👁️' : 'Preview Visitor Screen 👁️'}
          </a>
        </div>

        <div class="page-title-bar">
          <div class="page-title-group">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span class="kf-segmented-badge" style="background: rgba(200, 67, 67, 0.1); color: var(--color-primary); border-color: rgba(200, 67, 67, 0.25); font-weight: 800;">
                <i data-lucide="sparkles" style="width: 13px; height: 13px;"></i>
                ${isAr ? 'الهوية الرسمية الأولى' : 'First Official Theme'}
              </span>
              <span class="kf-segmented-badge" style="font-weight: 700;">8 ${isAr ? 'حالات أكاديمية' : 'Official States'}</span>
            </div>
            <h1 style="font-size: 1.55rem; font-weight: 850; color: var(--text-primary); margin: 0 0 6px;">
              ${isAr ? 'مركز شخصية كورو وثيمات المنصة' : 'Official Kuro Character & Theme Hub'}
            </h1>
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin: 0;">
              ${isAr ? 'كورو هو الرمز الرسمي المعتمد لدفعة طب وجراحة الفم والأسنان؛ يتفاعل مع دراستك عبر 8 حالات سريرية وأكاديمية متكاملة.' : 'Kuro is the official visual identity of Kuro Fangs; guiding students through 8 emotional and academic states.'}
            </p>
          </div>
        </div>

        <!-- 1. Hero Showcase: Kuro Official Character & Palette -->
        <div class="card" style="padding: 28px 32px; border-radius: 18px; margin-bottom: 28px; background: var(--bg-card); border: 1px solid var(--border-card); box-shadow: var(--shadow-card); position: relative; overflow: hidden;">
          <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #C84343 0%, #1E1F2B 50%, #C84343 100%);"></div>

          <div style="display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap;">
            <!-- Character Spotlight (Transparent, No Artificial Borders) -->
            <div style="display: flex; align-items: center; gap: 24px; flex: 1; min-width: 320px;">
              <div style="width: 130px; height: 130px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle, rgba(200, 67, 67, 0.12) 0%, transparent 70%); border-radius: 50%;">
                <img 
                  id="kuro-hub-spotlight-img"
                  src="${activeAssetUrl}" 
                  alt="Kuro Character" 
                  class="kuro-character-img kuro-float" 
                  style="width: 120px; height: 120px; object-fit: contain;" 
                />
              </div>

              <div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; flex-wrap: wrap;">
                  <span class="badge" style="background: var(--color-primary); color: #FFFFFF; font-size: 0.75rem; font-weight: 800; padding: 3px 10px; border-radius: 99px;">
                    ✓ ${isAr ? 'الشخصية والثيم النشط' : 'Active Character & Theme'}
                  </span>
                  <span style="font-size: 0.775rem; font-weight: 700; color: var(--text-secondary); background: var(--bg-surface-subtle); padding: 3px 10px; border-radius: 99px; border: 1px solid var(--border-subtle);">
                    ${isAr ? activeStateObj.name_ar : activeStateObj.name_en}
                  </span>
                </div>

                <h2 style="font-size: 1.4rem; font-weight: 850; color: var(--text-primary); margin: 0 0 6px;">
                  ${isAr ? kuroTheme.name_ar : kuroTheme.name_en} — ${isAr ? 'التميمة الرسمية' : 'Official Visual Identity'}
                </h2>
                <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0 0 14px; max-width: 580px; line-height: 1.6;">
                  ${isAr ? kuroTheme.desc_ar : kuroTheme.desc_en}
                </p>

                <!-- Official Palette Swatches -->
                <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                  <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted);">${isAr ? 'الألوان الرسمية:' : 'Palette:'}</span>
                  
                  <div style="display: inline-flex; align-items: center; gap: 6px; background: var(--bg-surface-subtle); padding: 4px 10px; border-radius: 99px; border: 1px solid var(--border-subtle); font-size: 0.75rem;">
                    <span style="width: 10px; height: 10px; border-radius: 50%; background: #C84343; display: inline-block;"></span>
                    <span style="font-weight: 600; color: var(--text-primary);">${isAr ? 'القرمزي (Crimson)' : 'Crimson'}</span>
                  </div>

                  <div style="display: inline-flex; align-items: center; gap: 6px; background: var(--bg-surface-subtle); padding: 4px 10px; border-radius: 99px; border: 1px solid var(--border-subtle); font-size: 0.75rem;">
                    <span style="width: 10px; height: 10px; border-radius: 50%; background: #14151E; display: inline-block;"></span>
                    <span style="font-weight: 600; color: var(--text-primary);">${isAr ? 'الأوبسيديان (Obsidian)' : 'Obsidian'}</span>
                  </div>

                  <div style="display: inline-flex; align-items: center; gap: 6px; background: var(--bg-surface-subtle); padding: 4px 10px; border-radius: 99px; border: 1px solid var(--border-subtle); font-size: 0.75rem;">
                    <span style="width: 10px; height: 10px; border-radius: 50%; background: #FAF8F5; border: 1px solid #D1D5DB; display: inline-block;"></span>
                    <span style="font-weight: 600; color: var(--text-primary);">${isAr ? 'العاجي الدافئ (Ivory)' : 'Warm Ivory'}</span>
                  </div>

                  <div style="display: inline-flex; align-items: center; gap: 6px; background: var(--bg-surface-subtle); padding: 4px 10px; border-radius: 99px; border: 1px solid var(--border-subtle); font-size: 0.75rem;">
                    <span style="width: 10px; height: 10px; border-radius: 50%; background: #F59E0B; display: inline-block;"></span>
                    <span style="font-weight: 600; color: var(--text-primary);">${isAr ? 'الكهرمان الذهبي (Amber)' : 'Golden Amber'}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Controls: Mode Switcher & Academic Points -->
            <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-end; min-width: 220px;">
              <div class="fox-balance-pill" style="width: 100%; text-align: center; border-color: rgba(200, 67, 67, 0.3); background: rgba(200, 67, 67, 0.05);">
                <div class="fox-balance-val" style="color: var(--color-primary);">${currentPoints}</div>
                <div class="fox-balance-lbl">${isAr ? 'نقطة أكاديمية مسجلة' : 'Registered Points'}</div>
              </div>

              <!-- Live Theme Toggle -->
              <div style="display: flex; gap: 8px; width: 100%;">
                <button 
                  id="hub-toggle-light"
                  class="btn ${!isDark ? 'btn-primary' : 'btn-secondary'}" 
                  style="flex: 1; justify-content: center; font-size: 0.785rem; padding: 8px 12px; font-weight: 700; gap: 6px;"
                >
                  <i data-lucide="sun" style="width: 14px; height: 14px;"></i>
                  <span>${isAr ? 'كورو عاجي (فاتح)' : 'Kuro Ivory (Light)'}</span>
                </button>

                <button 
                  id="hub-toggle-dark"
                  class="btn ${isDark ? 'btn-primary' : 'btn-secondary'}" 
                  style="flex: 1; justify-content: center; font-size: 0.785rem; padding: 8px 12px; font-weight: 700; gap: 6px;"
                >
                  <i data-lucide="moon" style="width: 14px; height: 14px;"></i>
                  <span>${isAr ? 'كورو ليلي (داكن)' : 'Kuro Night (Dark)'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Interactive Gallery: 8 Official States of Kuro -->
        <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 12px;">
          <div>
            <h2 style="font-size: 1.25rem; font-weight: 850; color: var(--text-primary); margin: 0 0 4px;">
              ${isAr ? 'حالات كورو الثمانية عبر المنصة' : 'The 8 Official States of Kuro'}
            </h2>
            <p style="font-size: 0.825rem; color: var(--text-secondary); margin: 0;">
              ${isAr ? 'انقر على أي وضع لمعاينته والتعرف على سياقه التعليمي داخل صفحات النظام' : 'Select any pose to preview and learn its academic context'}
            </p>
          </div>
          <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">
            ${isAr ? 'الأصول الأصلية 100% بدون أي تعديل أو إعادة رسم' : '100% Official Source of Truth Assets'}
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 18px; margin-bottom: 32px;">
          ${states.map(state => {
            const isSelected = state.key === this.activePreviewState;
            const assetUrl = window.CharacterThemeSystem
              ? window.CharacterThemeSystem.getAsset(state.key, 'kuro')
              : `assets/characters/kuro/${state.file}`;

            return `
              <div 
                class="card kuro-state-card" 
                data-state-key="${state.key}"
                style="padding: 18px; border-radius: 14px; cursor: pointer; transition: all var(--transition-fast); border: 1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--border-card)'}; background: ${isSelected ? 'var(--bg-surface-subtle)' : 'var(--bg-card)'}; position: relative; box-shadow: ${isSelected ? '0 4px 18px rgba(200, 67, 67, 0.18)' : 'var(--shadow-card)'};"
              >
                ${isSelected ? `
                  <span style="position: absolute; top: 12px; inset-inline-end: 12px; background: var(--color-primary); color: white; font-size: 0.675rem; font-weight: 800; padding: 2px 8px; border-radius: 99px;">
                    ${isAr ? 'معروض حالياً' : 'Selected'}
                  </span>
                ` : ''}

                <!-- Clean Transparent Character Visual -->
                <div style="height: 160px; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle, rgba(200, 67, 67, 0.06) 0%, transparent 70%); border-radius: 10px; margin-bottom: 12px; padding: 8px;">
                  <img 
                    src="${assetUrl}" 
                    alt="${isAr ? state.name_ar : state.name_en}" 
                    class="kuro-character-img ${isSelected ? 'kuro-bounce' : ''}" 
                    style="max-height: 144px; width: auto; object-fit: contain;" 
                    loading="lazy"
                  />
                </div>

                <div style="border-top: 1px solid var(--border-subtle); padding-top: 12px;">
                  <div style="font-weight: 800; font-size: 0.95rem; color: var(--text-primary); margin-bottom: 4px;">
                    ${isAr ? state.name_ar : state.name_en}
                  </div>
                  <div style="font-size: 0.775rem; color: var(--color-primary); font-weight: 700; margin-bottom: 6px;">
                    ${isAr ? state.role_ar : state.name_en}
                  </div>
                  <div style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4;">
                    ${isAr ? state.context_ar : state.context_en}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- 3. Points Earning Reference Guide -->
        <div class="card" style="padding: 24px 28px; border-radius: 16px; background: var(--bg-card); border: 1px solid var(--border-card);">
          <h3 style="font-size: 1rem; font-weight: 800; margin: 0 0 14px; display: flex; align-items: center; gap: 8px; color: var(--text-primary);">
            <i data-lucide="zap" style="color: #F59E0B; width: 20px; height: 20px;"></i>
            ${isAr ? 'كيفية حصد النقاط الأكاديمية بالمنصة' : 'How to Earn Academic Points'}
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px;">
            <div style="background: var(--bg-surface-subtle); padding: 14px 16px; border-radius: 12px; border: 1px solid var(--border-subtle);">
              <div style="font-weight: 800; color: var(--color-primary); font-size: 0.95rem;">+10 ${isAr ? 'نقاط' : 'pts'}</div>
              <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;">${isAr ? 'تحميل شيت معتمد ومراجعته' : 'Download verified lecture sheet'}</div>
            </div>
            <div style="background: var(--bg-surface-subtle); padding: 14px 16px; border-radius: 12px; border: 1px solid var(--border-subtle);">
              <div style="font-weight: 800; color: var(--color-primary); font-size: 0.95rem;">+15 ${isAr ? 'نقطة' : 'pts'}</div>
              <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;">${isAr ? 'إتمام كويز سريري بنتيجة تفوق 80%' : 'Complete clinical quiz with >80% score'}</div>
            </div>
            <div style="background: var(--bg-surface-subtle); padding: 14px 16px; border-radius: 12px; border: 1px solid var(--border-subtle);">
              <div style="font-weight: 800; color: var(--color-primary); font-size: 0.95rem;">+5 ${isAr ? 'نقاط' : 'pts'}</div>
              <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;">${isAr ? 'حل ومراجعة أسئلة بنك الأسئلة المبوب' : 'Solve questions from the practice bank'}</div>
            </div>
            <div style="background: var(--bg-surface-subtle); padding: 14px 16px; border-radius: 12px; border: 1px solid var(--border-subtle);">
              <div style="font-weight: 800; color: var(--color-primary); font-size: 0.95rem;">+25 ${isAr ? 'نقطة' : 'pts'}</div>
              <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;">${isAr ? 'الفوز في ألعاب وتحديات الذاكرة السريرية' : 'Win clinical memory challenges in arcade'}</div>
            </div>
          </div>
        </div>
      `;

      if (window.lucide) window.lucide.createIcons();

      // State card click to preview
      container.querySelectorAll('.kuro-state-card').forEach(card => {
        card.addEventListener('click', () => {
          const key = card.getAttribute('data-state-key');
          if (key && key !== this.activePreviewState) {
            this.activePreviewState = key;
            renderView();
          }
        });
      });

      // Live Theme Toggles
      document.getElementById('hub-toggle-light')?.addEventListener('click', () => {
        if (window.STORE) {
          window.STORE.setTheme('kuro');
          renderView();
        }
      });

      document.getElementById('hub-toggle-dark')?.addEventListener('click', () => {
        if (window.STORE) {
          window.STORE.setTheme('kuro-dark');
          renderView();
        }
      });
    };

    renderView();
  }
};

window.RewardsPage = RewardsPage;
