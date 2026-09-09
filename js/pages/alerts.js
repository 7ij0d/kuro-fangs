/**
 * alerts.js — Doctor Alerts Page
 * Kuro Fangs Academic Platform
 * Shows all doctor alerts grouped by subject, pinned first.
 */

export default async function alertsPage(container, params) {
  const { default: KF_DATA } = await import('../data.js');
  const { default: KURONI }  = await import('../kuroni.js');

  if (!KF_DATA.subjects) await KF_DATA.init();

  // ── Fetch Data ────────────────────────────────────────────────────────────
  const allAlerts = KF_DATA.getAllAlerts ? KF_DATA.getAllAlerts() : [];

  // ── Helpers ──────────────────────────────────────────────────────────────
  const SEVERITY_CONFIG = {
    critical: { label: 'حرج',     class: 'alert-banner--critical', icon: '🔴' },
    warning:  { label: 'تحذير',   class: 'alert-banner--warning',  icon: '🟠' },
    info:     { label: 'تنبيه',   class: 'alert-banner--info',     icon: '🔵' },
    success:  { label: 'إيجابي',  class: 'alert-banner--success',  icon: '🟢' },
  };

  function severityCfg(alert) {
    return SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.info;
  }

  function alertBannerHTML(alert, index) {
    const cfg    = severityCfg(alert);
    const stagger = `stagger-${Math.min(index + 1, 8)}`;
    const subject = KF_DATA.getSubjectById
      ? KF_DATA.getSubjectById(alert.subject_id)
      : null;

    return `
      <article
        class="alert-banner ${cfg.class} ${alert.pinned ? 'alert-banner--pinned' : ''} animate-card-reveal ${stagger}"
        role="alert"
        aria-label="${alert.pinned ? 'تنبيه مثبّت: ' : ''}${alert.title || ''}"
      >
        <div class="alert-banner__header">
          <span class="alert-banner__icon" aria-hidden="true">
            ${alert.pinned ? '📌' : cfg.icon}
          </span>
          <span class="alert-banner__severity-label">${cfg.label}</span>
          ${alert.pinned ? '<span class="alert-banner__pinned-label">مثبّت</span>' : ''}
          ${alert.date ? `<span class="alert-banner__date text-muted text-xs">${alert.date}</span>` : ''}
        </div>

        ${alert.title ? `<h3 class="alert-banner__title">${alert.title}</h3>` : ''}
        ${alert.message || alert.body
          ? `<p class="alert-banner__message">${alert.message || alert.body}</p>`
          : ''}

        <div class="alert-banner__footer">
          ${alert.doctor ? `<span class="doctor-chip text-xs">د. ${alert.doctor}</span>` : ''}
          ${subject
            ? `<button class="btn-ghost text-xs subject-link" data-subject-id="${subject.id}">
                ${subject.icon || '📚'} ${subject.name_ar || subject.name}
               </button>`
            : ''}
        </div>
      </article>
    `;
  }

  function subjectGroupHTML(subjectId, groupAlerts) {
    const subject = KF_DATA.getSubjectById
      ? KF_DATA.getSubjectById(subjectId)
      : null;

    const groupLabel = subject
      ? `${subject.icon || '📚'} ${subject.name_ar || subject.name}`
      : 'تنبيهات عامة';

    return `
      <section class="alert-group">
        <h2 class="alert-group__title">${groupLabel}</h2>
        ${groupAlerts.map((a, i) => alertBannerHTML(a, i)).join('')}
      </section>
    `;
  }

  // ── Group & Sort ──────────────────────────────────────────────────────────
  // Pinned alerts first, then by subject
  const pinned    = allAlerts.filter(a => a.pinned);
  const unpinned  = allAlerts.filter(a => !a.pinned);

  // Group unpinned by subject_id
  const groups = {};
  unpinned.forEach(alert => {
    const key = alert.subject_id || 'general';
    if (!groups[key]) groups[key] = [];
    groups[key].push(alert);
  });

  // ── Render ────────────────────────────────────────────────────────────────
  const hasPinned = pinned.length > 0;
  const hasAny    = allAlerts.length > 0;

  container.innerHTML = `
    <div class="page-wrapper" dir="rtl">

      <header class="page-header">
        <div class="page-header__text">
          <h1 class="page-title">🔔 تنبيهات الأطباء</h1>
          <p class="page-subtitle text-muted">${allAlerts.length} تنبيه</p>
        </div>
        ${KURONI.html ? `<div class="page-header__mascot" aria-hidden="true">${KURONI.html('warning')}</div>` : ''}
      </header>

      ${!hasAny
        ? (KURONI.emptyHTML
            ? KURONI.emptyHTML('happy', 'لا توجد تنبيهات', 'كل شيء تمام! لا توجد تنبيهات جديدة.')
            : '<p class="text-center text-muted">لا توجد تنبيهات حالياً</p>')
        : `
          ${hasPinned ? `
            <section class="alert-group alert-group--pinned">
              <h2 class="alert-group__title">📌 تنبيهات مثبّتة</h2>
              ${pinned.map((a, i) => alertBannerHTML(a, i)).join('')}
            </section>` : ''}

          ${Object.entries(groups).map(([subjectId, groupAlerts]) =>
            subjectGroupHTML(subjectId, groupAlerts)
          ).join('')}
        `
      }
    </div>
  `;

  // Subject link navigation
  container.querySelectorAll('.subject-link[data-subject-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.subjectId;
      window.ROUTER ? window.ROUTER.go(`/subjects/${id}`) : (window.location.hash = `#/subjects/${id}`);
    });
  });
}
