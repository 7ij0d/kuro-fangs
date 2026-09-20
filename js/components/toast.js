/**
 * KURO FANGS — TOAST NOTIFICATIONS SYSTEM
 * Modern, non-intrusive floating toasts with auto-dismiss and dark mode support
 */

(function () {
  let toastContainer = null;

  function ensureContainer() {
    if (!toastContainer || !document.body.contains(toastContainer)) {
      toastContainer = document.getElementById('toast-container');
      if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container';
        toastContainer.setAttribute('aria-live', 'polite');
        document.body.appendChild(toastContainer);
      }
    }
    return toastContainer;
  }

  function showToast(message, options = {}) {
    if (!message) return;

    const opts = typeof options === 'string' ? { type: options } : options;
    const type = opts.type || 'success'; // 'success' | 'info' | 'warning' | 'error'
    const duration = opts.duration || 3000;
    const points = opts.points || null;

    // Filter out '[undefined]' or literal undefined/null
    let cleanMessage = String(message)
      .replace(/\[undefined\]/gi, '')
      .replace(/undefined/gi, '')
      .trim();

    if (!cleanMessage && points) {
      const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
      cleanMessage = isAr ? 'تمت العملية بنجاح!' : 'Action completed successfully!';
    }

    const container = ensureContainer();

    if (window.SoundFX) {
      window.SoundFX.play(points ? 'badge' : 'toast');
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconHtml = '✓';
    if (type === 'info') iconHtml = 'ℹ';
    if (type === 'warning') iconHtml = '⚠';
    if (type === 'error') iconHtml = '✕';

    const pointsHtml = points ? `<span class="toast-points-badge"><i data-lucide="sparkles" style="width: 12px; height: 12px;"></i> +${points} pts</span>` : '';

    toast.innerHTML = `
      <div class="toast-icon">${iconHtml}</div>
      <div class="toast-content">
        <span class="toast-message">${cleanMessage}</span>
        ${pointsHtml}
      </div>
      <button class="toast-close-btn" aria-label="Close">✕</button>
    `;

    const closeBtn = toast.querySelector('.toast-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dismissToast(toast);
      });
    }

    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    // Auto dismiss after duration
    const timeout = setTimeout(() => {
      dismissToast(toast);
    }, duration);

    toast.addEventListener('click', () => {
      clearTimeout(timeout);
      dismissToast(toast);
    });
  }

  function dismissToast(toast) {
    if (!toast || toast.classList.contains('toast-out')) return;
    toast.classList.add('toast-out');
    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
    }, 300);
  }

  function dismissAll() {
    if (toastContainer) {
      toastContainer.innerHTML = '';
    }
  }

  window.clearToasts = dismissAll;
  window.showToast = showToast;
  window.Toast = {
    show: showToast,
    dismissAll: dismissAll,
    clear: dismissAll,
    success: (msg, pts) => showToast(msg, { type: 'success', points: pts }),
    info: (msg) => showToast(msg, { type: 'info' }),
    warning: (msg) => showToast(msg, { type: 'warning' }),
    error: (msg) => showToast(msg, { type: 'error' })
  };

  // Safe global override for any leftover alert calls
  window.alert = function (message) {
    showToast(message, { type: 'info' });
  };
})();
