/**
 * KURO FANGS — NOTIFICATIONS & NEWS CENTER COMPONENT
 * Facebook / Linear-grade Notifications Center with Unread Counter, Instant Search,
 * Read/Unread State Persistence (localStorage), and Full Announcement Details Modal.
 */

window.NotificationsCenter = (function () {
  const STORAGE_KEY = 'kf_read_notifications';
  let isOpen = false;
  let currentSearchQuery = '';
  let activeAlertsCache = [];

  // Fallback initial alerts if DATA is not yet loaded
  const DEFAULT_ALERTS = [
    {
      id: 'alt_2026_01',
      type: 'urgent',
      badge_ar: 'هام جداً • تأجيل وتسجيل',
      badge_en: 'Urgent • Registration & Schedule',
      title_ar: 'إعلان هام لطلبة الدفعة 33 والطلبة التكميلي (تأجيل الامتحانات وتجديد القيد)',
      title_en: 'Important Notice for Batch 33 & Complementary Students',
      date: '2026-09-11',
      time: '07:39 PM',
      cover: 'assets/icons/faculty_logo.png',
      content_ar: '1. تمت الموافقة على دخول جميع الطلبة (دفعة 33 أو تكميلي) للامتحانات دون استثناء (مقرر واحد أو أكثر).\n2. تأجيل بداية امتحانات الدور الثاني إلى يوم الاثنين 21/09/2026.\n3. تجديد القيد للطلبة التكميلي خلال أيام: الأحد 13/09، الاثنين 14/09، الثلاثاء 15/09/2026 وتجديد الاسم بمكتب الدراسة والامتحانات.\nتنبيه: لن يُسمح بدخول الامتحان لأي طالب تكميلي ما لم يجدد قيده ويسجل اسمه.',
      content_en: '1. Entry approved for all students in 2nd round exams regardless of failed courses.\n2. 2nd round exams postponed to Monday 21/09/2026.\n3. Complementary student registration renewal on Sept 13, 14, and 15, 2026 at the Study & Exams office.\nNotice: No complementary student will be allowed into exams without renewing their registration.',
      publisher_ar: 'قسم الدراسة والامتحانات – كلية طب وجراحة الفم والأسنان، جامعة طرابلس',
      publisher_en: 'Study & Exams Dept — Faculty of Dentistry, University of Tripoli'
    },
    {
      id: 'alt_2026_02',
      type: 'exam',
      badge_ar: 'امتحانات • السنة الرابعة',
      badge_en: 'Exams • Year 4',
      title_ar: 'جدول الامتحانات النهائية للدور الثاني لطلبة السنة الرابعة (2025 / 2026)',
      title_en: 'Final Exams Schedule - 2nd Round (Year 4, 2025/2026)',
      date: '2026-09-11',
      time: '07:39 PM',
      cover: 'assets/icons/faculty_logo.png',
      content_ar: 'تعلن الكلية عن مواعيد الامتحانات النهائية للدور الثاني لطلبة السنة الرابعة.\n• موعد الامتحان: من الساعة 09:00 صباحاً إلى 12:00 ظهراً.\n• المكان: تحت المسرح.\nيرجى الالتزام بالحضور قبل بداية الامتحان بوقت كافٍ.',
      content_en: 'The faculty announces the 2nd round final exam dates for Year 4 students.\n• Exam time: 09:00 AM to 12:00 PM.\n• Location: Under the Theater.\nPlease arrive well ahead of the scheduled time.',
      publisher_ar: 'قسم الدراسة والامتحانات – كلية طب وجراحة الفم والأسنان، جامعة طرابلس',
      publisher_en: 'Study & Exams Dept — Faculty of Dentistry, University of Tripoli'
    },
    {
      id: 'alt_2026_03',
      type: 'link',
      badge_ar: 'موقع رسمي • بوابة الطلبة',
      badge_en: 'Official Portal • Students',
      title_ar: 'إطلاق الصفحة الإلكترونية الرسمية للطلبة (tables.dentaluot.com)',
      title_en: 'Launch of Official Student Web Portal (tables.dentaluot.com)',
      date: '2026-09-11',
      time: '07:39 PM',
      cover: 'assets/icons/faculty_logo.png',
      content_ar: 'تم إطلاق الصفحة الإلكترونية الرسمية للاطلاع على الجداول الدراسية، الخطة الدراسية، النتائج، وجداول الامتحانات.\n🔗 رابط الدخول المباشر: http://tables.dentaluot.com\nيرجى اعتماد الصفحة كمصدر رسمي للمعلومات الأكاديمية.',
      content_en: 'The official student portal has been launched to view academic timetables, study plan, results, and exam schedules.\n🔗 Direct link: http://tables.dentaluot.com\nPlease rely on this page as the official source of academic announcements.',
      publisher_ar: 'د. زياد محمد نصر (رئيس قسم الدراسة والامتحانات) – كلية طب وجراحة الفم والأسنان',
      publisher_en: 'Dr. Ziad Mohamed Nasr — Head of Study & Exams Dept',
      url: 'http://tables.dentaluot.com'
    },
    {
      id: 'alt_2026_04',
      type: 'plan',
      badge_ar: 'الخطة الدراسية • 2026 / 2027',
      badge_en: 'Academic Plan • 2026 / 2027',
      title_ar: 'الخطة الدراسية الرسمية للعام الجامعي 2026 / 2027',
      title_en: 'Official Academic Plan for Year 2026 / 2027',
      date: '2026-09-11',
      time: '07:39 PM',
      cover: 'assets/icons/faculty_logo.png',
      content_ar: 'تنشر الكلية الخطة الدراسية المتضمنة مواعيد الدراسة والامتحانات والمراجعة الموضوعية وإعلان النتائج للعام 2026 / 2027.\nملاحظة: المواعيد المرتبطة بالمناسبات الهجرية تخضع لما يصدر عن الجهات الرسمية.',
      content_en: 'The faculty publishes the comprehensive academic plan including lectures, exams, objective revisions, and results publication for 2026/2027.\nNote: Hijri dates are subject to official confirmation.',
      publisher_ar: 'قسم الدراسة والامتحانات – كلية طب وجراحة الفم والأسنان، جامعة طرابلس',
      publisher_en: 'Study & Exams Dept — Faculty of Dentistry, University of Tripoli'
    }
  ];

  // Helper: Get Read Notification IDs
  function getReadIds() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch (e) {
      return new Set();
    }
  }

  // Helper: Save Read IDs
  function saveReadIds(set) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
    } catch (e) {}
  }

  // Helper: Get all active alerts
  function getAlerts() {
    let list = [];
    if (window.DATA && typeof window.DATA.getAlerts === 'function') {
      list = window.DATA.getAlerts();
    }
    if (!list || list.length === 0) {
      list = DEFAULT_ALERTS;
    }
    activeAlertsCache = list;
    return list;
  }

  // Helper: Check if an alert is read
  function isRead(id) {
    return getReadIds().has(id);
  }

  // Mark single alert as read
  function markAsRead(id) {
    const ids = getReadIds();
    if (!ids.has(id)) {
      ids.add(id);
      saveReadIds(ids);
      updateBadge();
    }
  }

  // Mark all alerts as read
  function markAllAsRead() {
    const alerts = getAlerts();
    const ids = getReadIds();
    alerts.forEach(a => ids.add(a.id));
    saveReadIds(ids);
    updateBadge();
    renderPanel(currentSearchQuery);
    if (window.showToast) {
      const isAr = isArabic();
      window.showToast(isAr ? 'تم تحديد جميع الإشعارات كمقروءة ✓' : 'All notifications marked as read ✓', { type: 'success' });
    }
  }

  // Unread Count
  function getUnreadCount() {
    const alerts = getAlerts();
    const readIds = getReadIds();
    return alerts.filter(a => !readIds.has(a.id)).length;
  }

  // Helper: Language
  function isArabic() {
    return window.I18N ? window.I18N.getLang() === 'ar' : true;
  }

  // Update Badge in Top Header
  function updateBadge() {
    const badge = document.getElementById('notifications-badge');
    if (!badge) return;

    const count = getUnreadCount();
    if (count > 0) {
      badge.style.display = 'inline-flex';
      badge.textContent = count > 99 ? '99+' : String(count);
      badge.setAttribute('aria-label', `${count} unread notifications`);
    } else {
      badge.style.display = 'none';
      badge.textContent = '0';
    }
  }

  // Relative or Friendly Date Formatting
  function formatAlertDate(dateStr, timeStr) {
    if (!dateStr) return '';
    const isAr = isArabic();
    try {
      const parts = dateStr.split(/[-/]/);
      if (parts.length === 3) {
        const itemDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        itemDate.setHours(0, 0, 0, 0);

        const diffDays = Math.round((today - itemDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) {
          return isAr ? `اليوم${timeStr ? ' • ' + timeStr : ''}` : `Today${timeStr ? ' • ' + timeStr : ''}`;
        }
        if (diffDays === 1) {
          return isAr ? `أمس${timeStr ? ' • ' + timeStr : ''}` : `Yesterday${timeStr ? ' • ' + timeStr : ''}`;
        }
        if (diffDays === 2) {
          return isAr ? `منذ يومين${timeStr ? ' • ' + timeStr : ''}` : `2 days ago${timeStr ? ' • ' + timeStr : ''}`;
        }
      }
    } catch (e) {}
    return timeStr ? `${dateStr} • ${timeStr}` : dateStr;
  }

  // Badge Visual Color Tokens (Optimized for High Contrast in Light & Dark Mode)
  function getBadgeColorStyles(type) {
    switch (type) {
      case 'urgent':
        return {
          icon: 'alert-triangle',
          emoji: '🔴',
          bg: 'rgba(239, 68, 68, 0.1)',
          color: '#DC2626',
          border: 'rgba(239, 68, 68, 0.25)',
          accentBg: 'rgba(239, 68, 68, 0.1)',
          accentColor: '#DC2626',
          accentBorder: 'rgba(239, 68, 68, 0.25)'
        };
      case 'exam':
        return {
          icon: 'calendar',
          emoji: '🟣',
          bg: 'rgba(124, 58, 237, 0.1)',
          color: '#7C3AED',
          border: 'rgba(124, 58, 237, 0.25)',
          accentBg: 'rgba(124, 58, 237, 0.1)',
          accentColor: '#7C3AED',
          accentBorder: 'rgba(124, 58, 237, 0.25)'
        };
      case 'plan':
        return {
          icon: 'book-open',
          emoji: '🔵',
          bg: 'rgba(2, 132, 199, 0.1)',
          color: '#0284C7',
          border: 'rgba(2, 132, 199, 0.25)',
          accentBg: 'rgba(2, 132, 199, 0.1)',
          accentColor: '#0284C7',
          accentBorder: 'rgba(2, 132, 199, 0.25)'
        };
      case 'link':
        return {
          icon: 'globe',
          emoji: '🟢',
          bg: 'rgba(16, 185, 129, 0.1)',
          color: '#059669',
          border: 'rgba(16, 185, 129, 0.25)',
          accentBg: 'rgba(16, 185, 129, 0.1)',
          accentColor: '#059669',
          accentBorder: 'rgba(16, 185, 129, 0.25)'
        };
      default:
        return {
          icon: 'bell',
          emoji: '📢',
          bg: 'rgba(100, 116, 139, 0.1)',
          color: '#475569',
          border: 'rgba(100, 116, 139, 0.2)',
          accentBg: 'rgba(100, 116, 139, 0.1)',
          accentColor: '#475569',
          accentBorder: 'rgba(100, 116, 139, 0.2)'
        };
    }
  }

  // Render the Dropdown Panel HTML & Attach Search / Item Listeners
  function renderPanel(query = '') {
    let panel = document.getElementById('notifications-dropdown-panel');
    if (!panel) return;

    const isAr = isArabic();
    const alerts = getAlerts();
    const readIds = getReadIds();
    const unreadCount = alerts.filter(a => !readIds.has(a.id)).length;

    // Filter alerts by query
    let filtered = alerts;
    const cleanQuery = query.trim().toLowerCase();
    if (cleanQuery) {
      filtered = alerts.filter(a => {
        const titleAr = (a.title_ar || '').toLowerCase();
        const titleEn = (a.title_en || '').toLowerCase();
        const contentAr = (a.content_ar || '').toLowerCase();
        const contentEn = (a.content_en || '').toLowerCase();
        const badgeAr = (a.badge_ar || '').toLowerCase();
        const badgeEn = (a.badge_en || '').toLowerCase();
        const publisherAr = (a.publisher_ar || '').toLowerCase();
        const publisherEn = (a.publisher_en || '').toLowerCase();
        const dateStr = (a.date || '').toLowerCase();
        const timeStr = (a.time || '').toLowerCase();

        return titleAr.includes(cleanQuery) ||
          titleEn.includes(cleanQuery) ||
          contentAr.includes(cleanQuery) ||
          contentEn.includes(cleanQuery) ||
          badgeAr.includes(cleanQuery) ||
          badgeEn.includes(cleanQuery) ||
          publisherAr.includes(cleanQuery) ||
          publisherEn.includes(cleanQuery) ||
          dateStr.includes(cleanQuery) ||
          timeStr.includes(cleanQuery);
      });
    }

    panel.innerHTML = `
      <!-- Panel Header -->
      <div class="notifications-panel-header">
        <div class="notifications-header-title-group">
          <div class="notifications-panel-heading-wrap">
            <i data-lucide="bell" class="notifications-header-bell-icon"></i>
            <h3 class="notifications-panel-title">${isAr ? 'الإشعارات' : 'Notifications'}</h3>
          </div>
          ${unreadCount > 0 ? `
            <span class="notifications-unread-pill">${unreadCount} ${isAr ? 'جديدة' : 'new'}</span>
          ` : ''}
        </div>

        <div class="notifications-header-actions">
          ${unreadCount > 0 ? `
            <button type="button" id="btn-mark-all-read" class="notifications-mark-read-btn" title="${isAr ? 'تحديد كافة الإشعارات كمقروءة' : 'Mark all as read'}">
              <i data-lucide="check-check" style="width: 13px; height: 13px;"></i>
              <span>${isAr ? 'تحديد الكل كمقروء' : 'Mark all read'}</span>
            </button>
          ` : ''}
          <button type="button" id="btn-close-notifications-panel" class="notifications-panel-close-btn" aria-label="${isAr ? 'إغلاق' : 'Close'}">✕</button>
        </div>
      </div>

      <!-- Live Search Box (Compact & Accessible) -->
      <div class="notifications-search-wrap">
        <div class="notifications-search-box">
          <i data-lucide="search" class="notifications-search-icon"></i>
          <input
            type="text"
            id="notifications-search-input"
            class="notifications-search-input"
            placeholder="${isAr ? 'ابحث في الإعلانات...' : 'Search notifications...'}"
            value="${query}"
            autocomplete="off"
            dir="${isAr ? 'rtl' : 'ltr'}"
          />
          ${query ? `
            <button type="button" id="btn-clear-notifications-search" class="notifications-search-clear" title="${isAr ? 'مسح البحث' : 'Clear search'}">✕</button>
          ` : ''}
        </div>
      </div>

      <!-- Notifications List Container -->
      <div class="notifications-list-container" id="notifications-list-container" role="feed">
        ${filtered.length === 0 ? `
          <div class="notifications-empty-state">
            <div style="font-size: 2rem; margin-bottom: 6px;">${cleanQuery ? '🔍' : '🎉'}</div>
            <div class="notifications-empty-title">
              ${cleanQuery ? (isAr ? 'لا توجد نتائج مطابقة لبحثك' : 'No matching notifications found') : (isAr ? 'لا توجد إشعارات جديدة' : 'You are all caught up!')}
            </div>
            <div class="notifications-empty-sub">
              ${cleanQuery ? (isAr ? 'جرب البحث بكلمات أخرى أو مسح حقل البحث' : 'Try searching with different keywords') : (isAr ? 'سيتم إشعارك فور نشر أي إعلان رسمي أو ملزمة جديدة' : 'New announcements will appear here.')}
            </div>
          </div>
        ` : filtered.map(item => {
          const isItemRead = readIds.has(item.id);
          const title = isAr ? item.title_ar : (item.title_en || item.title_ar);
          const badgeText = isAr ? item.badge_ar : (item.badge_en || item.badge_ar);
          const formattedDate = formatAlertDate(item.date, item.time);

          // Clean up multiline breaks and truncate to 85 characters
          const rawContent = (isAr ? item.content_ar : (item.content_en || item.content_ar)) || '';
          const singleLine = rawContent.replace(/\s+/g, ' ').trim();
          const previewText = singleLine.length > 85 ? singleLine.slice(0, 85) + '...' : singleLine;
          const badgeStyles = getBadgeColorStyles(item.type);

          return `
            <div
              class="notification-item-card ${isItemRead ? 'read' : 'unread'}"
              data-id="${item.id}"
              role="button"
              tabindex="0"
              aria-label="${title}"
            >
              <!-- 1. Start Column: Icon Badge -->
              <div class="notification-item-icon-col">
                <div class="notification-type-badge-icon" style="background: ${badgeStyles.accentBg}; color: ${badgeStyles.accentColor}; border: 1px solid ${badgeStyles.accentBorder};">
                  <span class="notification-emoji">${badgeStyles.emoji}</span>
                </div>
              </div>

              <!-- 2. Main Content: Title -> Badge • Date -> Short Preview ... [Unread Dot] -->
              <div class="notification-item-content-col">
                <h4 class="notification-item-title">${title}</h4>

                <div class="notification-item-meta-row">
                  <span class="notification-category-pill" style="color: ${badgeStyles.accentColor}; background: ${badgeStyles.accentBg}; border: 1px solid ${badgeStyles.accentBorder};">
                    ${badgeText}
                  </span>
                  <span class="notification-meta-bullet">•</span>
                  <span class="notification-date-label">
                    <i data-lucide="clock" style="width: 10px; height: 10px; display: inline-block;"></i>
                    ${formattedDate}
                  </span>
                </div>

                <div class="notification-item-preview-row">
                  <p class="notification-item-snippet">${previewText}</p>
                  ${!isItemRead ? `<span class="notification-unread-dot" title="${isAr ? 'غير مقروء' : 'Unread'}"></span>` : ''}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Attach Search Input Handlers
    const searchInput = document.getElementById('notifications-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearchQuery = e.target.value;
        renderPanel(currentSearchQuery);
        // Keep focus on input after re-render
        const reInput = document.getElementById('notifications-search-input');
        if (reInput) {
          reInput.focus();
          reInput.setSelectionRange(reInput.value.length, reInput.value.length);
        }
      });
    }

    document.getElementById('btn-clear-notifications-search')?.addEventListener('click', () => {
      currentSearchQuery = '';
      renderPanel('');
    });

    // Mark All Read Button
    document.getElementById('btn-mark-all-read')?.addEventListener('click', () => {
      markAllAsRead();
    });

    // Close Button
    document.getElementById('btn-close-notifications-panel')?.addEventListener('click', () => {
      togglePanel(false);
    });

    // Item Click Handlers -> Open Details Modal
    panel.querySelectorAll('.notification-item-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        if (id) {
          markAsRead(id);
          togglePanel(false);
          openDetailModal(id);
        }
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const id = card.getAttribute('data-id');
          if (id) {
            markAsRead(id);
            togglePanel(false);
            openDetailModal(id);
          }
        }
      });
    });
  }

  // Toggle Dropdown Panel
  function togglePanel(forceOpen) {
    let panel = document.getElementById('notifications-dropdown-panel');
    let backdrop = document.getElementById('notifications-dropdown-backdrop');

    if (!panel) {
      createPanelDOM();
      panel = document.getElementById('notifications-dropdown-panel');
      backdrop = document.getElementById('notifications-dropdown-backdrop');
    }

    isOpen = typeof forceOpen === 'boolean' ? forceOpen : !isOpen;

    if (isOpen) {
      currentSearchQuery = '';
      renderPanel('');
      panel.classList.add('open');
      if (backdrop) backdrop.classList.add('open');
      const bellBtn = document.getElementById('header-notifications-btn');
      if (bellBtn) bellBtn.classList.add('active');
      
      // Auto focus search input
      setTimeout(() => {
        const searchInput = document.getElementById('notifications-search-input');
        if (searchInput) searchInput.focus();
      }, 120);
    } else {
      panel.classList.remove('open');
      if (backdrop) backdrop.classList.remove('open');
      const bellBtn = document.getElementById('header-notifications-btn');
      if (bellBtn) bellBtn.classList.remove('active');
    }
  }

  // Create Panel DOM Container
  function createPanelDOM() {
    let wrapper = document.getElementById('notifications-bell-wrapper');
    if (!wrapper) {
      wrapper = document.querySelector('.header-actions');
    }

    // Floating Panel Backdrop (invisible or subtle to handle click-outside)
    if (!document.getElementById('notifications-dropdown-backdrop')) {
      const backdrop = document.createElement('div');
      backdrop.id = 'notifications-dropdown-backdrop';
      backdrop.className = 'notifications-dropdown-backdrop';
      backdrop.addEventListener('click', () => togglePanel(false));
      document.body.appendChild(backdrop);
    }

    // The Panel Box itself
    if (!document.getElementById('notifications-dropdown-panel')) {
      const panel = document.createElement('div');
      panel.id = 'notifications-dropdown-panel';
      panel.className = 'notifications-dropdown-panel';
      
      if (wrapper) {
        wrapper.appendChild(panel);
      } else {
        document.body.appendChild(panel);
      }
    }
  }

  // Open Full Notification Details Modal
  function openDetailModal(alertId) {
    const alerts = getAlerts();
    const item = alerts.find(a => a.id === alertId) || DEFAULT_ALERTS.find(a => a.id === alertId);
    if (!item) return;

    const isAr = isArabic();
    const title = isAr ? item.title_ar : (item.title_en || item.title_ar);
    const badgeText = isAr ? item.badge_ar : (item.badge_en || item.badge_ar);
    const dept = isAr ? (item.publisher_ar || item.dept_ar || 'قسم الدراسة والامتحانات – كلية طب وجراحة الفم والأسنان') : (item.publisher_en || item.dept_en || 'Study & Exams Dept — Faculty of Dentistry');
    const content = isAr ? (item.content_ar || item.details_ar || '') : (item.content_en || item.details_en || item.content_ar || '');
    const formattedDate = formatAlertDate(item.date, item.time);
    const badgeStyles = getBadgeColorStyles(item.type);

    let modalBackdrop = document.getElementById('notification-detail-modal-backdrop');
    if (!modalBackdrop) {
      modalBackdrop = document.createElement('div');
      modalBackdrop.id = 'notification-detail-modal-backdrop';
      modalBackdrop.className = 'notification-detail-modal-backdrop';
      modalBackdrop.onclick = (e) => {
        if (e.target === modalBackdrop) closeDetailModal();
      };
      document.body.appendChild(modalBackdrop);
    }

    modalBackdrop.innerHTML = `
      <div class="notification-detail-modal-card" role="dialog" aria-modal="true" aria-labelledby="notification-modal-title">
        
        <!-- Top Navigation Strip -->
        <div class="notification-modal-top-bar">
          <button type="button" id="btn-back-to-notifications" class="notification-modal-back-btn">
            <i data-lucide="${isAr ? 'arrow-right' : 'arrow-left'}" style="width: 16px; height: 16px;"></i>
            <span>${isAr ? 'العودة للإشعارات' : 'Back to Notifications'}</span>
          </button>

          <button type="button" id="btn-close-notification-modal" class="notification-modal-close-icon-btn" aria-label="Close">✕</button>
        </div>

        <!-- Modal Scrollable Body -->
        <div class="notification-modal-body">
          
          <!-- Category & Timestamp Row -->
          <div class="notification-modal-meta-row">
            <span class="notification-modal-category-pill" style="background: ${badgeStyles.bg}; color: ${badgeStyles.color}; border: 1px solid ${badgeStyles.border};">
              <span>${badgeStyles.emoji}</span>
              <span>${badgeText}</span>
            </span>

            <span class="notification-modal-date-pill">
              <i data-lucide="calendar" style="width: 13px; height: 13px;"></i>
              <span>${formattedDate}</span>
            </span>
          </div>

          <!-- Announcement Title -->
          <h2 id="notification-modal-title" class="notification-modal-heading">${title}</h2>

          <!-- Publisher Department Banner -->
          <div class="notification-modal-publisher-box">
            <div class="notification-modal-publisher-icon">
              <i data-lucide="shield-check" style="width: 18px; height: 18px; color: var(--brand-primary, #0284C7);"></i>
            </div>
            <div>
              <div class="notification-modal-publisher-label">${isAr ? 'الجهة الناشرة الرسمية:' : 'Official Publisher:'}</div>
              <div class="notification-modal-publisher-name">${dept}</div>
            </div>
          </div>

          <!-- Divider -->
          <hr class="notification-modal-divider" />

          <!-- Full Formatted Content -->
          <div class="notification-modal-content-text">
            ${content}
          </div>

          <!-- Optional Attached Cover/Image -->
          ${item.cover && item.cover !== 'assets/icons/faculty_logo.png' ? `
            <div style="margin-top: 20px; border-radius: 12px; overflow: hidden; border: 1px solid var(--border-subtle, rgba(255,255,255,0.1));">
              <img src="${item.cover}" alt="${title}" style="width: 100%; height: auto; display: block; object-fit: cover;" onerror="this.style.display='none'" />
            </div>
          ` : ''}

          <!-- External Portal / Links if attached -->
          ${item.url ? `
            <div class="notification-modal-attachment-box">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 38px; height: 38px; border-radius: 10px; background: rgba(2,132,199,0.12); display: flex; align-items: center; justify-content: center; color: #0284C7;">
                  <i data-lucide="external-link" style="width: 18px; height: 18px;"></i>
                </div>
                <div>
                  <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary, #181C32);">${isAr ? 'بوابة الرابط الخارجي الرسمي' : 'Official External Portal Link'}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted, #64748B); word-break: break-all;" dir="ltr">${item.url}</div>
                </div>
              </div>

              <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="font-weight: 800; gap: 6px; padding: 8px 16px;">
                <span>${isAr ? 'فتح الرابط المرفق ↗' : 'Open Link ↗'}</span>
              </a>
            </div>
          ` : ''}

        </div>

        <!-- Modal Footer -->
        <div class="notification-modal-footer">
          <button type="button" id="btn-modal-done" class="btn btn-secondary" style="min-width: 120px; font-weight: 700; padding: 9px 20px;">
            ${isAr ? 'إغلاق النافذة' : 'Done / Close'}
          </button>
        </div>

      </div>
    `;

    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (window.lucide) window.lucide.createIcons();

    // Event listeners
    document.getElementById('btn-back-to-notifications')?.addEventListener('click', () => {
      closeDetailModal();
      togglePanel(true);
    });
    document.getElementById('btn-close-notification-modal')?.addEventListener('click', closeDetailModal);
    document.getElementById('btn-modal-done')?.addEventListener('click', closeDetailModal);
  }

  // Close Details Modal
  function closeDetailModal() {
    const modalBackdrop = document.getElementById('notification-detail-modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // Keyboard Navigation (ESC to close)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (document.getElementById('notification-detail-modal-backdrop')?.classList.contains('open')) {
        closeDetailModal();
      } else if (isOpen) {
        togglePanel(false);
      }
    }
  });

  // Initialize Center
  function init() {
    createPanelDOM();

    const bellBtn = document.getElementById('header-notifications-btn');
    if (bellBtn) {
      bellBtn.onclick = (e) => {
        e.stopPropagation();
        togglePanel();
      };
    }

    updateBadge();

    // Listen to background sync / cloud alert changes
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY || e.key === 'kf_cloud_cached_alerts' || e.key === 'kf_admin_custom_alerts') {
        updateBadge();
        if (isOpen) renderPanel(currentSearchQuery);
      }
    });
  }

  // Public Interface
  return {
    init,
    updateUI: () => {
      updateBadge();
      if (isOpen) renderPanel(currentSearchQuery);
    },
    togglePanel,
    renderPanel,
    openDetailModal,
    closeDetailModal,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    getAlerts
  };
})();
