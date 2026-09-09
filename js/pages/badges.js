/**
 * badges.js — Points & Badges Page
 * Kuro Fangs Academic Platform
 * Shows student points, achievement progress, and badge collection.
 */

export default async function badgesPage(container, params) {
  const { default: KF_DATA }  = await import('../data.js');
  const { default: KF_STORE } = await import('../store.js');
  const { default: KURONI }   = await import('../kuroni.js');

  if (!KF_DATA.subjects) await KF_DATA.init();

  // ── Data ─────────────────────────────────────────────────────────────────
  const allBadges = KF_DATA.getAllBadges ? KF_DATA.getAllBadges() : [];
  const points    = KF_STORE.getPoints
    ? KF_STORE.getPoints()
    : (KF_STORE.get?.('points') ?? 0);

  const earnedCount = allBadges.filter(b =>
    KF_STORE.hasBadge ? KF_STORE.hasBadge(b.id) : false
  ).length;

  const progressPct = allBadges.length > 0
    ? Math.round((earnedCount / allBadges.length) * 100)
    : 0;

  // ── Helpers ──────────────────────────────────────────────────────────────
  const RARITY_LABELS = {
    common:    'عادي',
    uncommon:  'غير شائع',
    rare:      'نادر',
    epic:      'ملحمي',
    legendary: 'أسطوري',
  };

  function rarityClass(rarity) {
    return `badge-card--${rarity || 'common'}`;
  }

  function badgeCardHTML(badge, index) {
    const isEarned = KF_STORE.hasBadge ? KF_STORE.hasBadge(badge.id) : false;
    const stagger  = `stagger-${Math.min(index + 1, 8)}`;

    return `
      <article
        class="badge-card ${rarityClass(badge.rarity)} ${isEarned ? 'badge-card--earned' : 'badge-card--locked'} hover-lift animate-card-reveal ${stagger}"
        aria-label="${badge.name_ar || badge.name}${isEarned ? ' — مكتسب' : ' — مقفل'}"
        title="${badge.description_ar || badge.description || ''}"
      >
        <div class="badge-card__icon" aria-hidden="true">
          ${isEarned ? (badge.icon || '🏅') : '🔒'}
        </div>
        <div class="badge-card__body">
          <h3 class="badge-card__name">${badge.name_ar || badge.name}</h3>
          ${badge.name_en ? `<p class="badge-card__name-en text-muted text-xs">${badge.name_en}</p>` : ''}
          ${isEarned
            ? `<p class="badge-card__desc text-sm">${badge.description_ar || badge.description || ''}</p>`
            : `<p class="badge-card__locked-msg text-muted text-sm">أكمل المهام لفتح هذا الإنجاز</p>`
          }
          ${badge.rarity
            ? `<span class="badge-rarity-chip badge-rarity-chip--${badge.rarity}">${RARITY_LABELS[badge.rarity] || badge.rarity}</span>`
            : ''}
          ${badge.points_reward
            ? `<span class="badge-points text-xs">${badge.points_reward} نقطة</span>`
            : ''}
        </div>
      </article>
    `;
  }

  function pointsTierLabel(pts) {
    if (pts >= 1000) return 'أسطوري 🌟';
    if (pts >= 500)  return 'ملحمي ⚡';
    if (pts >= 200)  return 'متقدم 🔥';
    if (pts >= 100)  return 'متوسط 💪';
    if (pts > 0)     return 'مبتدئ 🌱';
    return 'لم تبدأ بعد';
  }

  // ── Categorize Badges ─────────────────────────────────────────────────────
  const categories = {};
  allBadges.forEach(badge => {
    const cat = badge.category || 'عام';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(badge);
  });

  // ── Render ────────────────────────────────────────────────────────────────
  container.innerHTML = `
    <div class="page-wrapper" dir="rtl">

      <header class="page-header">
        <div class="page-header__text">
          <h1 class="page-title">🏆 النقاط والإنجازات</h1>
          <p class="page-subtitle text-muted">اجمع النقاط وافتح الإنجازات</p>
        </div>
        ${points > 0 && KURONI.html
          ? `<div class="page-header__mascot" aria-hidden="true">${KURONI.html('achievement')}</div>`
          : ''}
      </header>

      <!-- Points Display -->
      <section class="points-section" aria-label="نقاطي">
        <div class="points-display" role="status" aria-label="${points} نقطة">
          <span class="points-display__number">${points.toLocaleString('ar-SA')}</span>
          <span class="points-display__label">نقطة</span>
          <span class="points-display__tier">${pointsTierLabel(points)}</span>
        </div>

        <!-- Achievement Progress -->
        <div class="achievement-progress" role="group" aria-label="تقدم الإنجازات">
          <div class="achievement-progress__header">
            <span class="achievement-progress__label">الإنجازات المكتسبة</span>
            <span class="achievement-progress__count">${earnedCount} / ${allBadges.length}</span>
          </div>
          <div
            class="progress-bar"
            role="progressbar"
            aria-valuenow="${progressPct}"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label="${progressPct}% مكتمل"
          >
            <div class="progress-bar__fill" style="width: ${progressPct}%;"></div>
          </div>
          <span class="achievement-progress__pct text-muted text-sm">${progressPct}% مكتمل</span>
        </div>
      </section>

      <!-- Badges Grid -->
      ${allBadges.length === 0
        ? (KURONI.emptyHTML
            ? KURONI.emptyHTML('sleepy', 'لا توجد إنجازات بعد', 'سيُضاف المحتوى قريباً!')
            : '<p class="text-center text-muted">لا توجد إنجازات حالياً</p>')
        : Object.entries(categories).map(([catName, catBadges]) => `
            <section class="badge-category">
              <h2 class="badge-category__title">${catName}</h2>
              <div class="badge-grid">
                ${catBadges.map((b, i) => badgeCardHTML(b, i)).join('')}
              </div>
            </section>
          `).join('')
      }
    </div>
  `;
}
