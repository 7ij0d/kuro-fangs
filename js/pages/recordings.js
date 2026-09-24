/**
 * KURO FANGS — AUDIO RECORDINGS LIBRARY PAGE
 * Academic Dental Lecture Audio Repository Linked to Lecture Sheets
 * Master Redesign conforming to Visual Blueprint (media_1790210375688.jpg & media_1790210419688.jpg)
 */

(function(window) {
  'use strict';

  const RecordingsPage = {
    currentSubject: 'all',
    currentLecturer: 'all',
    searchQuery: '',
    currentSort: 'newest', // 'newest' | 'oldest' | 'title'
    currentView: 'grid',    // 'grid' | 'list'
    activeAudio: null,
    activeRecId: null,

    // Subject Color Palette (Warm Pastel Tokens)
    SUBJECT_COLORS: {
      'preventive':      { bg: 'rgba(2, 132, 199, 0.09)',  text: '#0284C7', border: 'rgba(2, 132, 199, 0.22)' },
      'oral-diseases':   { bg: 'rgba(234, 88, 12, 0.09)',  text: '#EA580C', border: 'rgba(234, 88, 12, 0.22)' },
      'omdr':            { bg: 'rgba(124, 58, 237, 0.09)', text: '#7C3AED', border: 'rgba(124, 58, 237, 0.22)' },
      'omfs':            { bg: 'rgba(200, 67, 67, 0.09)',  text: '#C84343', border: 'rgba(200, 67, 67, 0.22)' },
      'cons-endo':       { bg: 'rgba(5, 150, 105, 0.09)',  text: '#059669', border: 'rgba(5, 150, 105, 0.22)' },
      'fixed-pros':      { bg: 'rgba(245, 158, 11, 0.09)', text: '#D97706', border: 'rgba(245, 158, 11, 0.22)' },
      'removable-pros':  { bg: 'rgba(219, 39, 119, 0.09)', text: '#DB2777', border: 'rgba(219, 39, 119, 0.22)' },
      'ortho':           { bg: 'rgba(14, 165, 233, 0.09)', text: '#0EA5E9', border: 'rgba(14, 165, 233, 0.22)' },
      'pedo':            { bg: 'rgba(168, 85, 247, 0.09)', text: '#A855F7', border: 'rgba(168, 85, 247, 0.22)' },
      'gen-med':         { bg: 'rgba(20, 184, 166, 0.09)', text: '#0D9488', border: 'rgba(20, 184, 166, 0.22)' },
      'gen-surgery':     { bg: 'rgba(239, 68, 68, 0.09)',  text: '#EF4444', border: 'rgba(239, 68, 68, 0.22)' },
      'periodontology':  { bg: 'rgba(194, 65, 12, 0.09)',  text: '#C2410C', border: 'rgba(194, 65, 12, 0.22)' }
    },

    // Subject Lucide Icons
    SUBJECT_ICONS: {
      'preventive':      'shield-check',
      'oral-diseases':   'microscope',
      'omdr':            'file-text',
      'omfs':            'scissors',
      'cons-endo':       'sparkles',
      'fixed-pros':      'crown',
      'removable-pros':  'layers',
      'ortho':           'smile',
      'pedo':            'heart',
      'gen-med':         'stethoscope',
      'gen-surgery':     'scalpel',
      'periodontology':  'activity'
    },

    getColor(subjectId) {
      return this.SUBJECT_COLORS[subjectId] || { bg: 'rgba(142, 146, 168, 0.09)', text: '#64748B', border: 'rgba(142, 146, 168, 0.22)' };
    },

    getIcon(subjectId) {
      return this.SUBJECT_ICONS[subjectId] || 'headphones';
    },

    /**
     * Deterministic realistic audio waveform bar heights generator
     */
    generateWaveformSvg(seedStr, colorHex) {
      let hash = 0;
      for (let i = 0; i < seedStr.length; i++) {
        hash = (hash << 5) - hash + seedStr.charCodeAt(i);
        hash |= 0;
      }
      
      const bars = [];
      const numBars = 32;
      for (let i = 0; i < numBars; i++) {
        const pseudorand = Math.abs(Math.sin((hash + i * 17) * 0.1));
        // Waveform profile: tapering at ends, natural rhythm in center
        const envelope = Math.sin((i / numBars) * Math.PI);
        const minHeight = 4;
        const maxHeight = 26;
        const height = Math.round(minHeight + (maxHeight - minHeight) * pseudorand * (0.4 + 0.6 * envelope));
        bars.push(height);
      }

      const svgBars = bars.map((h, idx) => {
        const x = idx * 6;
        const y = Math.round((28 - h) / 2);
        return `<rect class="audio-wave-bar" data-index="${idx}" x="${x}" y="${y}" width="3.2" height="${h}" rx="1.6" fill="${colorHex}" opacity="0.82" />`;
      }).join('');

      return `
        <svg class="audio-waveform-svg" viewBox="0 0 ${numBars * 6} 28" preserveAspectRatio="none" aria-hidden="true">
          ${svgBars}
        </svg>
      `;
    },

    /**
     * Master Render Entry Point
     */
    async render(container, queryParams) {
      const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
      const subjects = window.DATA ? window.DATA.getSubjects() : [];
      
      // Initialize query params or stored preferences
      const paramSubj = queryParams?.get('subject');
      if (paramSubj) this.currentSubject = paramSubj;
      this.currentView = localStorage.getItem('kf_recordings_view') || 'grid';

      // Gather distinct lecturers from sheets and recordings
      const sheets = window.DATA?.sheets || [];
      const recordings = window.DATA?.recordings || [];
      const lecturersSet = new Set();
      sheets.forEach(s => {
        const doc = s.doctor_name || s.doctor;
        if (doc) lecturersSet.add(doc.trim());
      });
      recordings.forEach(r => {
        const doc = r.doctor || r.doctor_name;
        if (doc) lecturersSet.add(doc.trim());
      });
      const lecturers = Array.from(lecturersSet).filter(Boolean);

      container.innerHTML = `
        <div class="audio-hub-container">
          
          <!-- 1. Panoramic Top Banner (Blueprint Fidelity) -->
          <section class="audio-hub-hero" aria-label="Audio Recordings Banner">
            <div class="audio-hero-card">
              <div class="audio-hero-bg-artwork" style="background-image: url('assets/hero/audio-recordings-hero.png');"></div>
              <div class="audio-hero-overlay"></div>
              <div class="audio-hero-content" dir="${isAr ? 'rtl' : 'ltr'}">
                <div class="audio-hero-badge-wrap">
                  <div class="audio-hero-badge-icon-box">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"></path>
                    </svg>
                  </div>
                </div>
                <h1 class="audio-hero-title">${isAr ? 'التسجيلات الصوتية' : 'Audio Recordings'}</h1>
                <p class="audio-hero-subtitle">${isAr ? 'تسجيلات صوتية لمحاضرات دكاترة الكلية مرتبطة بالشيتات.' : 'Faculty lecture audio recordings linked to lecture sheets.'}</p>
              </div>
            </div>
          </section>

          <!-- 2. Search & Filter Controls Bar (Blueprint Fidelity) -->
          <section class="audio-controls-section" aria-label="Audio Filters">
            <div class="audio-controls-bar">
              
              <!-- Subject Dropdown -->
              <div class="audio-control-dropdown-wrap">
                <i data-lucide="book-open" class="audio-control-lead-icon"></i>
                <select id="audio-subject-filter" class="audio-select-input" aria-label="Filter by subject">
                  <option value="all">${isAr ? 'كل المواد' : 'All Subjects'}</option>
                  ${subjects.map(s => `
                    <option value="${s.id}" ${this.currentSubject === s.id ? 'selected' : ''}>
                      ${isAr ? s.name_ar : s.name_en}
                    </option>
                  `).join('')}
                </select>
                <i data-lucide="chevron-down" class="audio-dropdown-chevron"></i>
              </div>

              <!-- Full-Text Search Input -->
              <div class="audio-search-wrap">
                <i data-lucide="search" class="audio-search-icon"></i>
                <input
                  id="audio-search-input"
                  type="text"
                  class="audio-search-input"
                  placeholder="${isAr ? 'ابحث في التسجيلات، الشيتات، أو الموضوعات...' : 'Search recordings, sheets, or topics...'}"
                  value="${this.searchQuery}"
                  autocomplete="off"
                />
                <button id="audio-search-clear" class="audio-search-clear-btn" style="${this.searchQuery ? 'display:flex;' : 'display:none;'}" title="Clear search">
                  <i data-lucide="x" style="width:14px;height:14px;"></i>
                </button>
              </div>

              <!-- Lecturer Dropdown -->
              <div class="audio-control-dropdown-wrap">
                <i data-lucide="user-round" class="audio-control-lead-icon"></i>
                <select id="audio-lecturer-filter" class="audio-select-input" aria-label="Filter by lecturer">
                  <option value="all">${isAr ? 'كل الدكاترة' : 'All Lecturers'}</option>
                  ${lecturers.map(doc => `
                    <option value="${doc}" ${this.currentLecturer === doc ? 'selected' : ''}>
                      ${doc}
                    </option>
                  `).join('')}
                </select>
                <i data-lucide="chevron-down" class="audio-dropdown-chevron"></i>
              </div>

              <!-- Sort Dropdown -->
              <div class="audio-control-dropdown-wrap">
                <i data-lucide="arrow-up-down" class="audio-control-lead-icon"></i>
                <select id="audio-sort-filter" class="audio-select-input" aria-label="Sort recordings">
                  <option value="newest" ${this.currentSort === 'newest' ? 'selected' : ''}>${isAr ? 'الأحدث أولاً' : 'Newest First'}</option>
                  <option value="oldest" ${this.currentSort === 'oldest' ? 'selected' : ''}>${isAr ? 'الأقدم أولاً' : 'Oldest First'}</option>
                  <option value="title" ${this.currentSort === 'title' ? 'selected' : ''}>${isAr ? 'العنوان (أ - ي)' : 'Title (A-Z)'}</option>
                </select>
                <i data-lucide="chevron-down" class="audio-dropdown-chevron"></i>
              </div>

              <!-- Grid / List View Toggle -->
              <div class="audio-view-toggle">
                <button
                  class="audio-view-btn ${this.currentView === 'grid' ? 'active' : ''}"
                  data-view="grid"
                  title="${isAr ? 'عرض شبكي' : 'Grid View'}"
                  aria-label="Grid View"
                >
                  <i data-lucide="layout-grid" style="width:16px;height:16px;"></i>
                </button>
                <button
                  class="audio-view-btn ${this.currentView === 'list' ? 'active' : ''}"
                  data-view="list"
                  title="${isAr ? 'عرض قائمة' : 'List View'}"
                  aria-label="List View"
                >
                  <i data-lucide="list" style="width:16px;height:16px;"></i>
                </button>
              </div>

            </div>
          </section>

          <!-- 3. Page Section Header (Blueprint Fidelity) -->
          <section class="audio-section-header" aria-label="Recordings List Header">
            <div class="audio-section-title-wrap">
              <div class="audio-section-icon-box">
                <i data-lucide="headphones"></i>
              </div>
              <div class="audio-section-text-group">
                <h2 class="audio-section-title">${isAr ? 'تسجيلات المحاضرات الصوتية' : 'Lecture Audio Recordings'}</h2>
                <p class="audio-section-desc">${isAr ? 'استمع لتسجيلات المحاضرات الأكاديمية المرتبطة بشيتاتها وملازمها.' : 'Listen to faculty lectures linked to their respective lecture sheets.'}</p>
              </div>
            </div>
            <div class="audio-section-count-badge" id="audio-total-count-badge">
              <span id="audio-count-number">0</span>
              <span>${isAr ? 'تسجيلات' : 'Recordings'}</span>
            </div>
          </section>

          <!-- 4. Audio Cards Grid / List Container -->
          <div id="audio-cards-container" class="${this.currentView === 'grid' ? 'audio-recordings-grid' : 'audio-recordings-list'}">
            <!-- Dynamically populated -->
          </div>

        </div>
      `;

      // Render cards
      await this.renderCardsList();

      // Bind events
      this.bindEvents(container);

      // Re-init Lucide icons
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    },

    /**
     * Compute and render the filtered list of audio items
     */
    async renderCardsList() {
      const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
      const subjects = window.DATA ? window.DATA.getSubjects() : [];
      const allSheets = window.DATA?.sheets || [];
      const allRecordings = window.DATA?.recordings || [];

      // Build unified collection:
      // For every sheet, inspect if recordings exist.
      // If a sheet has multiple recordings, each recording is an audio item linked to that sheet.
      // If a sheet has NO recording, it is represented as an unavailable item.
      const items = [];

      allSheets.forEach(sheet => {
        const sheetRecs = allRecordings.filter(r => r.sheet_id === sheet.id);
        if (sheetRecs.length > 0) {
          sheetRecs.forEach(rec => {
            items.push({
              isRecording: true,
              recId: rec.id,
              sheetId: sheet.id,
              subjectId: rec.subject_id || sheet.subject_id,
              title: isAr ? (rec.title_ar || sheet.title_ar || rec.title || sheet.title) : (rec.title_en || sheet.title_en || rec.title || sheet.title),
              doctor: rec.doctor || rec.doctor_name || sheet.doctor_name || sheet.doctor || '',
              duration: rec.duration || '45:00',
              date: rec.date || sheet.date || '2026-09-20',
              orderIndex: sheet.order_index || 1,
              sheetTitle: isAr ? (sheet.title_ar || sheet.title) : (sheet.title_en || sheet.title),
              audioUrl: rec.audio_url || '',
              telegramUrl: rec.telegram_url || '',
              sheetObj: sheet
            });
          });
        } else {
          // Sheet with no audio recording uploaded yet (Subtle Unavailable state)
          items.push({
            isRecording: false,
            recId: `empty_${sheet.id}`,
            sheetId: sheet.id,
            subjectId: sheet.subject_id,
            title: isAr ? (sheet.title_ar || sheet.title) : (sheet.title_en || sheet.title),
            doctor: sheet.doctor_name || sheet.doctor || '',
            duration: '--:--',
            date: sheet.date || '2026-09-20',
            orderIndex: sheet.order_index || 1,
            sheetTitle: isAr ? (sheet.title_ar || sheet.title) : (sheet.title_en || sheet.title),
            audioUrl: '',
            telegramUrl: '',
            sheetObj: sheet
          });
        }
      });

      // Filter by Subject
      let filtered = items;
      if (this.currentSubject !== 'all') {
        filtered = filtered.filter(item => item.subjectId === this.currentSubject);
      }

      // Filter by Lecturer
      if (this.currentLecturer !== 'all') {
        filtered = filtered.filter(item => (item.doctor || '').trim() === this.currentLecturer);
      }

      // Filter by Full-Text Search
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase().trim();
        filtered = filtered.filter(item => {
          const title = (item.title || '').toLowerCase();
          const doc = (item.doctor || '').toLowerCase();
          const sheetT = (item.sheetTitle || '').toLowerCase();
          const subj = subjects.find(s => s.id === item.subjectId);
          const subjName = subj ? ((isAr ? subj.name_ar : subj.name_en) || '').toLowerCase() : '';
          return title.includes(q) || doc.includes(q) || sheetT.includes(q) || subjName.includes(q);
        });
      }

      // Sort Items
      if (this.currentSort === 'newest') {
        filtered.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
      } else if (this.currentSort === 'oldest') {
        filtered.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
      } else if (this.currentSort === 'title') {
        filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      }

      // Update Section Header Counter
      const totalAvailableRecordings = filtered.filter(i => i.isRecording).length;
      const countEl = document.getElementById('audio-count-number');
      if (countEl) {
        countEl.textContent = totalAvailableRecordings;
      }

      const containerEl = document.getElementById('audio-cards-container');
      if (!containerEl) return;

      // Handle Empty State
      if (filtered.length === 0) {
        containerEl.className = 'audio-empty-container';
        containerEl.innerHTML = `
          <div class="audio-empty-card">
            <div class="audio-empty-icon-wrap">
              <i data-lucide="headphones" style="width:36px;height:36px;color:var(--brand-burgundy,#7E1D2A);"></i>
            </div>
            <h3 class="audio-empty-title">${isAr ? 'لا توجد تسجيلات صوتية مطابقة' : 'No audio recordings found'}</h3>
            <p class="audio-empty-desc">${isAr ? 'جرّب تغيير خيارات التصفية أو البحث عن مادة أخرى.' : 'Try adjusting your search query or filters to find what you are looking for.'}</p>
          </div>
        `;
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
          window.lucide.createIcons();
        }
        return;
      }

      containerEl.className = this.currentView === 'grid' ? 'audio-recordings-grid' : 'audio-recordings-list';

      // Render cards
      const cardsHtml = filtered.map(item => {
        const subjObj = subjects.find(s => s.id === item.subjectId);
        const subjName = subjObj ? (isAr ? subjObj.name_ar : subjObj.name_en) : item.subjectId;
        const color = this.getColor(item.subjectId);
        const iconName = this.getIcon(item.subjectId);
        const isPlaying = this.activeRecId === item.recId;

        if (item.isRecording) {
          // ACTIVE AUDIO RECORDING CARD (Blueprint Conformance)
          const waveformSvg = this.generateWaveformSvg(item.recId + item.title, color.text);

          return `
            <article class="audio-card ${isPlaying ? 'is-playing' : ''}" data-rec-id="${item.recId}" data-sheet-id="${item.sheetId}">
              
              <!-- Top Row: Subject Badge + Order Pill + Menu Button -->
              <div class="audio-card-topbar">
                <div class="audio-card-badges-group">
                  <span class="audio-subject-pill" style="background:${color.bg};color:${color.text};border-color:${color.border};">
                    ${subjName}
                  </span>
                  <span class="audio-order-pill" style="background:${color.bg};color:${color.text};border-color:${color.border};">
                    #${item.orderIndex}
                  </span>
                </div>
                <button class="audio-card-menu-btn" title="More options" aria-label="More options" onclick="window.showToast('${isAr ? 'تم نسخ رابط التسجيل الأكاديمي' : 'Recording link copied to clipboard'}', { type: 'info' });">
                  <i data-lucide="more-horizontal"></i>
                </button>
              </div>

              <!-- Body: Icon Box + Title + Lecturer -->
              <div class="audio-card-body-row">
                <div class="audio-subject-icon-box" style="background:${color.bg};color:${color.text};border-color:${color.border};">
                  <i data-lucide="${iconName}"></i>
                </div>
                <div class="audio-card-info">
                  <h3 class="audio-card-title">${item.title}</h3>
                  <div class="audio-card-lecturer">
                    <i data-lucide="user-round" class="audio-doc-icon"></i>
                    <span>${isAr ? 'د.' : 'Dr.'} ${item.doctor || (isAr ? 'هيئة التدريس' : 'Faculty')}</span>
                  </div>
                </div>
              </div>

              <!-- Waveform / Player Row -->
              <div class="audio-waveform-row">
                <button
                  class="audio-play-btn ${isPlaying ? 'playing' : ''}"
                  data-action="play"
                  data-rec-id="${item.recId}"
                  title="${isPlaying ? (isAr ? 'إيقاف مؤقت' : 'Pause') : (isAr ? 'تشغيل' : 'Play')}"
                  aria-label="${isPlaying ? 'Pause' : 'Play'}"
                >
                  <i data-lucide="${isPlaying ? 'pause' : 'play'}"></i>
                </button>

                <div class="audio-waveform-wrap" style="--accent-color:${color.text};">
                  ${waveformSvg}
                </div>

                <div class="audio-duration">
                  <span>${item.duration}</span>
                </div>
              </div>

              <!-- Metadata Row: Date + Linked Sheet -->
              <div class="audio-card-meta-row">
                <div class="audio-meta-item">
                  <i data-lucide="calendar"></i>
                  <span>${item.date}</span>
                </div>
                <a href="#/sheet-detail?id=${item.sheetId}" class="audio-sheet-link" title="${isAr ? 'الانتقال لشيت المحاضرة' : 'View linked sheet'}">
                  <i data-lucide="link"></i>
                  <span>${isAr ? 'شيت' : 'Sheet'} ${item.orderIndex}</span>
                </a>
              </div>

              <!-- Full-Width Touch Actions -->
              <div class="audio-card-actions">
                <button class="audio-btn-listen" data-action="play" data-rec-id="${item.recId}">
                  <i data-lucide="${isPlaying ? 'pause' : 'play'}"></i>
                  <span>${isPlaying ? (isAr ? 'إيقاف مؤقت' : 'Pause') : (isAr ? 'استماع' : 'Listen')}</span>
                </button>
                <a href="#/sheet-detail?id=${item.sheetId}" class="audio-btn-sheet">
                  <i data-lucide="file-text"></i>
                  <span>${isAr ? 'عرض الشيت' : 'View Sheet'}</span>
                </a>
              </div>

            </article>
          `;
        } else {
          // UNAVAILABLE STATE (Clean, subtle, muted communication - Blueprint Rule 9)
          return `
            <article class="audio-card audio-card-unavailable" data-sheet-id="${item.sheetId}">
              
              <!-- Top Row: Subject Badge + Order Pill -->
              <div class="audio-card-topbar">
                <div class="audio-card-badges-group">
                  <span class="audio-subject-pill" style="background:${color.bg};color:${color.text};border-color:${color.border};">
                    ${subjName}
                  </span>
                  <span class="audio-order-pill" style="background:${color.bg};color:${color.text};border-color:${color.border};">
                    #${item.orderIndex}
                  </span>
                </div>
              </div>

              <!-- Body: Icon Box + Title + Lecturer -->
              <div class="audio-card-body-row">
                <div class="audio-subject-icon-box muted" style="background:${color.bg};color:${color.text};border-color:${color.border};">
                  <i data-lucide="${iconName}"></i>
                </div>
                <div class="audio-card-info">
                  <h3 class="audio-card-title muted-title">${item.title}</h3>
                  <div class="audio-card-lecturer">
                    <i data-lucide="user-round" class="audio-doc-icon"></i>
                    <span>${isAr ? 'د.' : 'Dr.'} ${item.doctor || (isAr ? 'هيئة التدريس' : 'Faculty')}</span>
                  </div>
                </div>
              </div>

              <!-- Unavailable Waveform Row Placeholder -->
              <div class="audio-waveform-row muted-row">
                <div class="audio-play-btn disabled" aria-disabled="true">
                  <i data-lucide="mic-off"></i>
                </div>
                <div class="audio-waveform-placeholder">
                  <span>${isAr ? 'لا يوجد تسجيل صوتي متاح حالياً' : 'No recording available yet'}</span>
                </div>
                <div class="audio-duration">
                  <span>--:--</span>
                </div>
              </div>

              <!-- Metadata Row: Date + Linked Sheet -->
              <div class="audio-card-meta-row">
                <div class="audio-meta-item">
                  <i data-lucide="calendar"></i>
                  <span>${item.date}</span>
                </div>
                <a href="#/sheet-detail?id=${item.sheetId}" class="audio-sheet-link" title="${isAr ? 'الانتقال لشيت المحاضرة' : 'View linked sheet'}">
                  <i data-lucide="link"></i>
                  <span>${isAr ? 'شيت' : 'Sheet'} ${item.orderIndex}</span>
                </a>
              </div>

              <!-- Actions: [ Not Available ] (Muted) + Active [ View Sheet ] -->
              <div class="audio-card-actions">
                <button class="audio-btn-unavailable" disabled aria-disabled="true">
                  <i data-lucide="volume-x"></i>
                  <span>${isAr ? 'غير متاح' : 'Not Available'}</span>
                </button>
                <a href="#/sheet-detail?id=${item.sheetId}" class="audio-btn-sheet">
                  <i data-lucide="file-text"></i>
                  <span>${isAr ? 'عرض الشيت' : 'View Sheet'}</span>
                </a>
              </div>

            </article>
          `;
        }
      }).join('');

      containerEl.innerHTML = cardsHtml;

      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    },

    /**
     * Bind UI event listeners
     */
    bindEvents(container) {
      const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;

      // Subject Dropdown
      const subjFilter = container.querySelector('#audio-subject-filter');
      subjFilter?.addEventListener('change', e => {
        this.currentSubject = e.target.value;
        this.renderCardsList();
      });

      // Lecturer Dropdown
      const docFilter = container.querySelector('#audio-lecturer-filter');
      docFilter?.addEventListener('change', e => {
        this.currentLecturer = e.target.value;
        this.renderCardsList();
      });

      // Sort Dropdown
      const sortFilter = container.querySelector('#audio-sort-filter');
      sortFilter?.addEventListener('change', e => {
        this.currentSort = e.target.value;
        this.renderCardsList();
      });

      // Search Input
      const searchInput = container.querySelector('#audio-search-input');
      const searchClear = container.querySelector('#audio-search-clear');
      let debounceTimer = null;
      searchInput?.addEventListener('input', e => {
        this.searchQuery = e.target.value;
        if (searchClear) {
          searchClear.style.display = this.searchQuery ? 'flex' : 'none';
        }
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => this.renderCardsList(), 200);
      });

      searchClear?.addEventListener('click', () => {
        this.searchQuery = '';
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        searchClear.style.display = 'none';
        this.renderCardsList();
      });

      // View Mode Toggle (Grid vs List)
      const viewButtons = container.querySelectorAll('.audio-view-btn');
      viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          this.currentView = btn.getAttribute('data-view') || 'grid';
          localStorage.setItem('kf_recordings_view', this.currentView);
          viewButtons.forEach(b => b.classList.toggle('active', b === btn));
          this.renderCardsList();
        });
      });

      // Audio Playback Actions
      container.addEventListener('click', async e => {
        const playBtn = e.target.closest('[data-action="play"]');
        if (!playBtn) return;
        
        e.preventDefault();
        e.stopPropagation();
        const recId = playBtn.getAttribute('data-rec-id');
        if (!recId) return;

        await this.handlePlayToggle(recId, isAr);
      });
    },

    /**
     * Audio Playback Toggle Controller
     */
    async handlePlayToggle(recId, isAr) {
      // If currently playing this recording, pause it
      if (this.activeRecId === recId && this.activeAudio && !this.activeAudio.paused) {
        this.activeAudio.pause();
        this.activeRecId = null;
        this.renderCardsList();
        return;
      }

      // Stop any existing playing track
      if (this.activeAudio) {
        this.activeAudio.pause();
        this.activeAudio = null;
      }

      // Locate recording record
      const recordings = window.DATA?.recordings || [];
      const rec = recordings.find(r => r.id === recId);
      
      let audioUrl = rec?.audio_url || '';
      if (!audioUrl && window.DATA?.audioStore?.getAudioUrl) {
        try {
          audioUrl = await window.DATA.audioStore.getAudioUrl(recId);
        } catch (err) {}
      }

      if (!audioUrl) {
        if (window.showToast) {
          window.showToast(
            isAr ? 'ملف التسجيل الصوتي قيد الرفع والمعالجة السحابية' : 'Audio recording file is being processed for streaming',
            { type: 'info' }
          );
        }
        return;
      }

      try {
        const audio = new Audio(audioUrl);
        this.activeAudio = audio;
        this.activeRecId = recId;

        audio.addEventListener('ended', () => {
          this.activeRecId = null;
          this.renderCardsList();
        });

        audio.addEventListener('error', () => {
          this.activeRecId = null;
          if (window.showToast) {
            window.showToast(isAr ? 'تعذر تشغيل ملف الصوت' : 'Unable to stream audio recording', { type: 'error' });
          }
          this.renderCardsList();
        });

        await audio.play();
        this.renderCardsList();
      } catch (err) {
        console.error('Audio play error:', err);
        this.activeRecId = null;
        this.renderCardsList();
      }
    }
  };

  // Expose to window
  window.RecordingsPage = RecordingsPage;

})(window);
