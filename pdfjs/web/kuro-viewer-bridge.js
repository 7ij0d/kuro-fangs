/**
 * KURO FANGS — PDF.JS VIEWER BRIDGE
 * Real-time synchronization of active page index and copy actions with parent studio.
 */
(function() {
  'use strict';

  function initBridge() {
    const app = window.PDFViewerApplication;
    if (!app || !app.eventBus) {
      setTimeout(initBridge, 150);
      return;
    }

    function notifyPage(overridePage) {
      try {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({
            type: 'KURO_PAGE_CHANGE',
            pageNumber: overridePage || app.page || 1,
            pagesCount: app.pagesCount || 1
          }, '*');
        }
      } catch(e) {}
    }

    app.eventBus.on('pagechanging', function(evt) {
      notifyPage(evt.pageNumber);
    });

    app.eventBus.on('pagesloaded', function() {
      notifyPage(app.page);
    });

    app.eventBus.on('documentloaded', function() {
      notifyPage(app.page);
    });

    // Notify initial state
    setTimeout(function() {
      notifyPage(app.page);
    }, 400);

    // Bind quick copy toolbar button
    const copyBtn = document.getElementById('kuroToolbarCopyPageBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', function() {
        try {
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({
              type: 'KURO_TRIGGER_COPY_PAGE',
              pageNumber: app.page || 1
            }, '*');
          }
        } catch(e) {}
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBridge);
  } else {
    initBridge();
  }
})();
