/**
 * ============================================================================
 * KURO FANGS — STUDY ROOMS & INTEGRATED FOCUS TIMER (v19.0)
 * ============================================================================
 * Complete collaborative study experience inside Kuro Fangs:
 *  1. Room Discovery Page (All, Studying Now, On Break, Waiting, My Rooms, Stats)
 *  2. Create Room Modal (Public / Private / Solo, Quick Presets, Session Summary)
 *  3. Join Room by Invitation Code or Direct Link + Room Details Preview Modal
 *  4. Authoritative Synchronized Focus Timer (Waiting Lobby, Focus, Break, Completed)
 *  5. Individual "Skip Break For Me Only" & Personal Study Pause/Resume
 *  6. Live Participant Leaderboard & 4-State Presence (Ready, Studying, Break, Paused)
 *  7. Host Room Management Panel (Start, Edit, End Early, Transfer Host, Close/Delete)
 *  8. Global Floating Timer Widget visible across all platform pages
 *  9. Web Audio API Procedural Nature Sounds (Rain, Forest, Fireplace, Stream, Wind)
 * 10. Student Study Statistics Dashboard (Weekly Bar Chart) & Session History Log
 * ============================================================================
 */

(function (window) {
  'use strict';

  const STORAGE_KEYS = {
    ROOMS: 'kf_study_rooms_v19',
    PARTICIPANTS: 'kf_study_room_participants_v19',
    MESSAGES: 'kf_study_room_messages_v19',
    ACTIVE_ROOM_ID: 'kf_active_study_room_id',
    SESSION_LOGS: 'kf_study_session_logs_v19',
    FLOATING_HIDDEN: 'kf_study_floating_hidden'
  };

  const PRESETS = {
    quick: {
      id: 'quick',
      icon: '🌱',
      nameAr: 'دراسة سريعة',
      nameEn: 'Quick Study',
      descAr: '15 دقيقة تركيز · 3 دقائق استراحة',
      descEn: '15m focus · 3m break',
      focusMins: 15,
      shortBreakMins: 3,
      longBreakMins: 10,
      roundsBeforeLong: 4,
      totalHours: 1
    },
    pomodoro: {
      id: 'pomodoro',
      icon: '🍅',
      nameAr: 'بومودورو',
      nameEn: 'Pomodoro',
      descAr: '25 دقيقة تركيز · 5 دقائق استراحة',
      descEn: '25m focus · 5m break',
      focusMins: 25,
      shortBreakMins: 5,
      longBreakMins: 15,
      roundsBeforeLong: 4,
      totalHours: 2
    },
    deep_focus: {
      id: 'deep_focus',
      icon: '⛰️',
      nameAr: 'تركيز عميق',
      nameEn: 'Deep Focus',
      descAr: '50 دقيقة تركيز · 10 دقائق استراحة',
      descEn: '50m focus · 10m break',
      focusMins: 50,
      shortBreakMins: 10,
      longBreakMins: 20,
      roundsBeforeLong: 3,
      totalHours: 3
    }
  };

  const AMBIENT_SOUNDS = [
    { id: 'rain', icon: 'cloud-rain', emoji: '🌧️', nameAr: 'مطر خفيف', nameEn: 'Soft Rain', subAr: 'صوت مطر هادئ على النافذة', subEn: 'Gentle rain droplets' },
    { id: 'forest', icon: 'trees', emoji: '🌲', nameAr: 'غابة هادئة', nameEn: 'Calm Forest', subAr: 'نسيم الأشجار والطبيعة', subEn: 'Peaceful forest breeze' },
    { id: 'fire', icon: 'flame', emoji: '🔥', nameAr: 'نار هادئة', nameEn: 'Fireplace', subAr: 'فرقعة الحطب الدافئة', subEn: 'Warm crackling fire' },
    { id: 'river', icon: 'waves', emoji: '🌊', nameAr: 'جدول ماء', nameEn: 'Water Stream', subAr: 'جريان الماء المستمر', subEn: 'Flowing water stream' },
    { id: 'wind', icon: 'wind', emoji: '🍃', nameAr: 'رياح خفيفة', nameEn: 'Gentle Wind', subAr: 'هواء نقي يساعد على الصفاء', subEn: 'Soft ambient air' }
  ];

  // ==========================================================================
  // PROCEDURAL WEB AUDIO API NATURE SOUND SYNTHESIZER (Zero External MP3s)
  // ==========================================================================
  const AmbientAudioEngine = {
    ctx: null,
    activeSound: null,
    masterGain: null,
    nodes: [],
    cracklerTimer: null,
    volume: 0.45,

    _initCtx() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.volume;
        this.masterGain.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    },

    toggle(soundId) {
      if (this.activeSound === soundId) {
        this.stop();
        return null;
      }
      this.play(soundId);
      return soundId;
    },

    setVolume(val) {
      this.volume = Math.max(0, Math.min(1, parseFloat(val) || 0));
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
      }
    },

    stop() {
      if (this.cracklerTimer) {
        clearInterval(this.cracklerTimer);
        this.cracklerTimer = null;
      }
      this.nodes.forEach(n => {
        try { n.stop && n.stop(); } catch (e) {}
        try { n.disconnect && n.disconnect(); } catch (e) {}
      });
      this.nodes = [];
      this.activeSound = null;
    },

    play(soundId) {
      this.stop();
      const ctx = this._initCtx();
      if (!ctx) return;
      this.activeSound = soundId;

      // Create 3-second looping noise buffer (Pink / Brown noise base)
      const bufferSize = ctx.sampleRate * 3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      let lastOut = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (soundId === 'fire' || soundId === 'wind') {
          // Brown noise (warmer, deeper)
          output[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = output[i];
          output[i] *= 2.5;
        } else {
          // Pink noise (natural rain / stream / forest)
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
          b6 = white * 0.115926;
        }
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      if (soundId === 'rain') {
        filter.type = 'bandpass';
        filter.frequency.value = 1100;
        filter.Q.value = 0.7;
      } else if (soundId === 'forest') {
        filter.type = 'lowpass';
        filter.frequency.value = 650;
      } else if (soundId === 'fire') {
        filter.type = 'lowpass';
        filter.frequency.value = 320;
      } else if (soundId === 'river') {
        filter.type = 'bandpass';
        filter.frequency.value = 520;
        filter.Q.value = 1.1;
      } else {
        filter.type = 'lowpass';
        filter.frequency.value = 440;
      }

      source.connect(filter);
      filter.connect(this.masterGain);
      source.start(0);
      this.nodes.push(source, filter);

      // Add subtle crackle impulses for fireplace or droplets for rain
      if (soundId === 'fire' || soundId === 'rain') {
        this.cracklerTimer = setInterval(() => {
          if (!this.ctx || this.activeSound !== soundId) return;
          if (Math.random() > 0.45) return;
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = soundId === 'fire' ? (1200 + Math.random() * 1800) : (1800 + Math.random() * 1400);
          g.gain.setValueAtTime(0.015 * this.volume, this.ctx.currentTime);
          g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.045);
          osc.connect(g);
          g.connect(this.masterGain);
          osc.start();
          osc.stop(this.ctx.currentTime + 0.05);
        }, soundId === 'fire' ? 180 : 130);
      }
    }
  };

  // ==========================================================================
  // MAIN STUDY ROOMS ENGINE
  // ==========================================================================
  const StudyRoomsPage = {
    view: 'discovery',          // 'discovery' | 'room' | 'stats'
    activeFilter: 'all',        // 'all' | 'focus' | 'break' | 'waiting' | 'my'
    statsRange: 'weekly',       // 'weekly' | 'monthly' | 'all'
    currentRoom: null,
    membership: null,
    participants: [],
    messages: [],
    _rafId: null,
    _lastPersonalTickMs: 0,
    _lobbyChannel: null,
    _roomChannel: null,
    _localBus: null,
    _dbAvailable: null,
    _summaryShownForRoom: null,
    _floatingMenuOpen: false,

    // ─── INITIALIZATION & GLOBAL FLOATING WIDGET ───────────────────────────
    initGlobalLifecycle() {
      if (this._lifecycleInitialized) return;
      this._lifecycleInitialized = true;

      // Cross-tab BroadcastChannel sync
      if (typeof BroadcastChannel !== 'undefined') {
        try {
          this._localBus = new BroadcastChannel('kf_study_rooms_bus');
          this._localBus.onmessage = (ev) => {
            const data = ev.data || {};
            if (data.type === 'ROOM_UPDATED' && this.currentRoom && data.room?.id === this.currentRoom.id) {
              this.currentRoom = { ...this.currentRoom, ...data.room };
              this._refreshActiveRoomDOM();
              this._updateGlobalFloatingWidget();
            } else if (data.type === 'ROOMS_LIST_CHANGED' && this.view === 'discovery') {
              const container = document.getElementById('app');
              if (container && window.location.hash.startsWith('#/study-rooms')) {
                this._renderDiscoveryCards(container);
              }
            }
          };
        } catch (e) {}
      }

      // Purge any previously seeded demo/trial rooms & logs
      this._purgeDemoRooms();

      // Restore active room if user refreshes or navigates across pages
      const savedRoomId = localStorage.getItem(STORAGE_KEYS.ACTIVE_ROOM_ID);
      if (savedRoomId) {
        const rooms = this._getLocalRooms();
        const found = rooms.find(r => r.id === savedRoomId && r.status !== 'closed');
        if (found) {
          this.currentRoom = found;
          this._ensureLocalMembership(found);
          this._startGlobalTicker();
          this._updateGlobalFloatingWidget();
        }
      }

      window.addEventListener('hashchange', () => {
        this._updateGlobalFloatingWidget();
      });
    },

    // ─── ROUTE ENTRY POINT ─────────────────────────────────────────────────
    async render(container, params) {
      if (!container) return;
      this.initGlobalLifecycle();

      const isAr = this._isAr();

      // Ensure no demo/trial rooms remain in localStorage or state
      this._purgeDemoRooms();

      // Check URL query parameters (?room=ID or ?code=CODE or ?view=stats)
      let roomId = null;
      let inviteCode = null;
      let viewParam = null;
      if (params && typeof params.get === 'function') {
        roomId = params.get('room');
        inviteCode = params.get('code');
        viewParam = params.get('view');
      } else {
        const q = new URLSearchParams(window.location.hash.split('?')[1] || '');
        roomId = q.get('room');
        inviteCode = q.get('code');
        viewParam = q.get('view');
      }

      if (inviteCode && !roomId) {
        const matched = await this._findRoomByCodeOrLink(inviteCode);
        if (matched) roomId = matched.id;
      }

      if (roomId) {
        await this._enterRoom(container, roomId, inviteCode);
        return;
      }

      if (viewParam === 'stats') {
        this.view = 'stats';
        this._renderStatsPage(container, isAr);
        this._updateGlobalFloatingWidget();
        return;
      }

      this.view = 'discovery';
      await this._renderDiscoveryPage(container, isAr);
      this._updateGlobalFloatingWidget();
    },

    // ========================================================================
    // 1. DISCOVERY PAGE (صفحة الدراسة الجماعية الرئيسية - Panel 1)
    // ========================================================================
    async _renderDiscoveryPage(container, isAr) {
      const activeRoomBanner = this.currentRoom && this.currentRoom.status !== 'closed' ? `
        <div class="sr-active-session-banner">
          <div class="sr-asb-info">
            <span class="sr-live-pulse"></span>
            <div>
              <strong>${isAr ? 'أنت منضم حالياً إلى:' : 'Currently joined in:'} ${this._esc(this.currentRoom.name)}</strong>
              <span>${this._getPhaseBadgeText(this.currentRoom, isAr)} · ${this._formatCountdown(this.currentRoom)}</span>
            </div>
          </div>
          <div class="sr-asb-actions">
            <button type="button" class="sr-btn-primary sr-btn-sm" id="sr-banner-return-btn">
              <i data-lucide="arrow-up-left"></i>
              <span>${isAr ? 'العودة إلى الغرفة' : 'Return to Room'}</span>
            </button>
          </div>
        </div>
      ` : '';

      container.innerHTML = `
        <section class="sr-page" dir="${isAr ? 'rtl' : 'ltr'}">
          ${activeRoomBanner}

          <!-- Top Hero Header -->
          <header class="sr-hero-header">
            <div class="sr-hero-brand">
              <div class="sr-hero-icon-box">
                <i data-lucide="Timer"></i>
              </div>
              <div class="sr-hero-titles">
                <div class="sr-hero-kicker">
                  <span>✨ ${isAr ? 'مساحة التركيز المشترك' : 'COLLABORATIVE FOCUS SPACE'}</span>
                </div>
                <h1 class="sr-hero-title">${isAr ? 'غرف الدراسة' : 'Study Rooms'}</h1>
                <p class="sr-hero-subtitle">${isAr ? 'ادرس مع الآخرين وركز أكثر والتزم مع المؤقت التزامني المشترك' : 'Enter a room, set your study goal, and focus with peers in real time'}</p>
              </div>
            </div>

            <div class="sr-hero-actions">
              <button type="button" class="sr-btn-primary" id="sr-open-create-btn">
                <i data-lucide="plus"></i>
                <span>${isAr ? 'إنشاء غرفة جديدة' : 'Create New Room'}</span>
              </button>
              <button type="button" class="sr-btn-secondary" id="sr-open-join-code-btn">
                <i data-lucide="key-round"></i>
                <span>${isAr ? 'الانضمام برابط أو كود' : 'Join via Link or Code'}</span>
              </button>
              <button type="button" class="sr-btn-ghost" id="sr-open-stats-btn">
                <i data-lucide="bar-chart-3"></i>
                <span>${isAr ? 'إحصائياتي وسجل الجلسات' : 'My Stats & Log'}</span>
              </button>
            </div>
          </header>

          <!-- Filter Bar (Panel 1 Tabs) -->
          <div class="sr-filter-bar">
            <div class="sr-filter-tabs" role="tablist">
              <button type="button" class="sr-filter-tab ${this.activeFilter === 'all' ? 'active' : ''}" data-filter="all">
                <span>${isAr ? 'جميع الغرف' : 'All Rooms'}</span>
              </button>
              <button type="button" class="sr-filter-tab ${this.activeFilter === 'focus' ? 'active' : ''}" data-filter="focus">
                <span class="sr-status-dot dot-focus"></span>
                <span>${isAr ? 'يدرس الآن' : 'Studying Now'}</span>
              </button>
              <button type="button" class="sr-filter-tab ${this.activeFilter === 'waiting' ? 'active' : ''}" data-filter="waiting">
                <span class="sr-status-dot dot-waiting"></span>
                <span>${isAr ? 'قيد الانتظار' : 'Waiting'}</span>
              </button>
              <button type="button" class="sr-filter-tab ${this.activeFilter === 'break' ? 'active' : ''}" data-filter="break">
                <span class="sr-status-dot dot-break"></span>
                <span>${isAr ? 'في الاستراحة' : 'On Break'}</span>
              </button>
              <button type="button" class="sr-filter-tab ${this.activeFilter === 'my' ? 'active' : ''}" data-filter="my">
                <i data-lucide="user-check"></i>
                <span>${isAr ? 'غرفي' : 'My Rooms'}</span>
              </button>
            </div>

            <div class="sr-search-mini">
              <i data-lucide="search"></i>
              <input type="text" id="sr-room-search-input" placeholder="${isAr ? 'ابحث عن غرفة أو مادة...' : 'Search room or subject...'}" />
            </div>
          </div>

          <!-- Rooms Grid -->
          <div class="sr-rooms-grid" id="sr-rooms-grid"></div>
        </section>
      `;

      this._renderDiscoveryCards(container);
      this._bindDiscoveryEvents(container, isAr);
      this._syncRoomsFromRemote(container);
      if (window.lucide) window.lucide.createIcons();
    },

    _renderDiscoveryCards(container) {
      const grid = container.querySelector('#sr-rooms-grid');
      if (!grid) return;

      const isAr = this._isAr();
      const user = this._getCurrentUser();
      const searchVal = (container.querySelector('#sr-room-search-input')?.value || '').trim().toLowerCase();

      let rooms = this._getLocalRooms().filter(r => r.status !== 'closed');

      // Filter out other users' solo rooms
      rooms = rooms.filter(r => r.visibility !== 'solo' || r.host_user_id === user.id);

      if (this.activeFilter === 'focus') {
        rooms = rooms.filter(r => r.phase === 'focus');
      } else if (this.activeFilter === 'waiting') {
        rooms = rooms.filter(r => r.phase === 'waiting');
      } else if (this.activeFilter === 'break') {
        rooms = rooms.filter(r => r.phase === 'short_break' || r.phase === 'long_break');
      } else if (this.activeFilter === 'my') {
        rooms = rooms.filter(r => r.host_user_id === user.id || (this.currentRoom && this.currentRoom.id === r.id));
      }

      if (searchVal) {
        rooms = rooms.filter(r =>
          (r.name || '').toLowerCase().includes(searchVal) ||
          (r.subject || '').toLowerCase().includes(searchVal) ||
          (r.host_name || '').toLowerCase().includes(searchVal)
        );
      }

      if (!rooms.length) {
        grid.innerHTML = `
          <div class="sr-empty-card">
            <div class="sr-empty-icon">🕯️</div>
            <h3>${isAr ? 'لا توجد غرف مطابقة حالياً' : 'No matching study rooms right now'}</h3>
            <p>${isAr ? 'أنشئ غرفة دراسة جديدة وابدأ جلسة تركيز مع زملائك!' : 'Create a new study room and start focusing with your peers!'}</p>
            <button type="button" class="sr-btn-primary" id="sr-empty-create-btn">
              <i data-lucide="plus"></i>
              <span>${isAr ? 'إنشاء غرفة دراسة' : 'Create Study Room'}</span>
            </button>
          </div>
        `;
        grid.querySelector('#sr-empty-create-btn')?.addEventListener('click', () => {
          this._openCreateRoomModal(container, isAr);
        });
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      grid.innerHTML = rooms.map(room => this._buildRoomCardHTML(room, isAr, user)).join('');
      if (window.lucide) window.lucide.createIcons();

      // Bind card events
      grid.querySelectorAll('.sr-discovery-card').forEach(card => {
        const roomId = card.getAttribute('data-room-id');
        const room = rooms.find(r => r.id === roomId);
        if (!room) return;

        // Join button
        const joinBtn = card.querySelector('.sr-card-join-btn');
        joinBtn?.addEventListener('click', (e) => {
          e.stopPropagation();
          if (room.visibility === 'private' && room.host_user_id !== user.id) {
            this._openJoinByCodeModal(container, isAr, room.invitation_code ? '' : '');
          } else {
            this._enterRoom(container, room.id);
          }
        });

        // Clicking card opens Panel 4 (Room Details Preview Modal)
        card.addEventListener('click', () => {
          this._openRoomDetailsModal(room, container, isAr);
        });
      });
    },

    _buildRoomCardHTML(room, isAr, user) {
      const phase = room.phase || 'waiting';
      const isPrivate = room.visibility === 'private';
      const isSolo = room.visibility === 'solo';
      const focusMins = Math.round((room.focus_duration_seconds || 1500) / 60);
      const totalHours = Math.max(1, Math.round((room.total_session_seconds || 7200) / 3600));
      const countdown = this._formatCountdown(room);
      const progressPct = this._calcPhaseProgressPct(room);

      let badgeClass = 'badge-waiting';
      let badgeIcon = 'clock';
      let badgeText = isAr ? 'قيد الانتظار' : 'Waiting';

      if (phase === 'focus') {
        badgeClass = 'badge-focus';
        badgeIcon = 'book-open-check';
        badgeText = isAr ? 'جارٍ الآن • يدرس' : 'Live • Studying';
      } else if (phase === 'short_break' || phase === 'long_break') {
        badgeClass = 'badge-break';
        badgeIcon = 'coffee';
        badgeText = isAr ? 'في الاستراحة ☕' : 'On Break ☕';
      } else if (phase === 'paused') {
        badgeClass = 'badge-paused';
        badgeIcon = 'pause-circle';
        badgeText = isAr ? 'متوقف مؤقتاً' : 'Paused';
      } else if (room.scheduled_start_at) {
        const diffMins = Math.max(1, Math.round((new Date(room.scheduled_start_at).getTime() - Date.now()) / 60000));
        badgeText = isAr ? `يبدأ بعد ${diffMins} دقيقة ⏰` : `Starts in ${diffMins}m ⏰`;
      }

      const presetObj = PRESETS[room.preset] || PRESETS.pomodoro;

      return `
        <article class="sr-discovery-card phase-${phase}" data-room-id="${room.id}">
          <div class="sr-dcard-top">
            <span class="sr-dcard-status ${badgeClass}">
              <i data-lucide="${badgeIcon}"></i>
              <span>${badgeText}</span>
            </span>
            <span class="sr-dcard-preset" title="${isAr ? presetObj.descAr : presetObj.descEn}">
              ${presetObj.icon} ${isAr ? presetObj.nameAr : presetObj.nameEn}
            </span>
          </div>

          <div class="sr-dcard-body">
            <h3 class="sr-dcard-title">${this._esc(room.name)}</h3>
            <div class="sr-dcard-host">
              <span class="sr-dcard-by">${isAr ? 'بواسطة' : 'by'} <strong>${this._esc(room.host_name || 'Taha')}</strong></span>
              ${room.subject ? `<span class="sr-dcard-subject-pill">${this._esc(room.subject)}</span>` : ''}
            </div>
            ${room.session_goal ? `<p class="sr-dcard-goal">${this._esc(room.session_goal)}</p>` : ''}
          </div>

          ${phase === 'focus' || phase === 'short_break' || phase === 'long_break' ? `
            <div class="sr-dcard-progress-wrap">
              <div class="sr-dcard-progress-meta">
                <span>${isAr ? 'الوقت المتبقي في الجولة' : 'Round remaining'}</span>
                <strong class="sr-tabular">${countdown}</strong>
              </div>
              <div class="sr-dcard-progress-bar">
                <div class="sr-dcard-progress-fill" style="width:${progressPct}%"></div>
              </div>
            </div>
          ` : ''}

          <div class="sr-dcard-metrics">
            <div class="sr-dcard-metric">
              <i data-lucide="users"></i>
              <span class="sr-tabular">${room.participant_count || 1}/${room.max_participants || 50}</span>
            </div>
            <div class="sr-dcard-metric">
              <i data-lucide="clock-3"></i>
              <span>${focusMins} ${isAr ? 'دقيقة' : 'min'} · ${totalHours} ${isAr ? 'ساعات' : 'hrs'}</span>
            </div>
            ${isPrivate ? `<span class="sr-dcard-lock" title="${isAr ? 'غرفة خاصة' : 'Private Room'}"><i data-lucide="lock"></i></span>` : ''}
            ${isSolo ? `<span class="sr-dcard-lock" title="${isAr ? 'غرفة فردية' : 'Solo Room'}"><i data-lucide="user"></i></span>` : ''}
          </div>

          <div class="sr-dcard-footer">
            <button type="button" class="sr-card-join-btn">
              <span>${isAr ? 'انضمام إلى الغرفة' : 'Join Room'}</span>
              <i data-lucide="arrow-left"></i>
            </button>
          </div>
        </article>
      `;
    },

    _bindDiscoveryEvents(container, isAr) {
      container.querySelector('#sr-open-create-btn')?.addEventListener('click', () => {
        if (!this._requireRegisteredStudent(isAr)) return;
        this._openCreateRoomModal(container, isAr);
      });

      container.querySelector('#sr-open-join-code-btn')?.addEventListener('click', () => {
        if (!this._requireRegisteredStudent(isAr)) return;
        this._openJoinByCodeModal(container, isAr);
      });

      container.querySelector('#sr-open-stats-btn')?.addEventListener('click', () => {
        this.view = 'stats';
        this._renderStatsPage(container, isAr);
      });

      container.querySelector('#sr-banner-return-btn')?.addEventListener('click', () => {
        if (this.currentRoom) {
          this._enterRoom(container, this.currentRoom.id);
        }
      });

      container.querySelectorAll('.sr-filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          this.activeFilter = tab.getAttribute('data-filter') || 'all';
          container.querySelectorAll('.sr-filter-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          this._renderDiscoveryCards(container);
        });
      });

      container.querySelector('#sr-room-search-input')?.addEventListener('input', () => {
        this._renderDiscoveryCards(container);
      });
    },

    // ========================================================================
    // 2. ROOM DETAILS PREVIEW MODAL (Panel 4 - غرفة عامة عرض التفاصيل)
    // ========================================================================
    _openRoomDetailsModal(room, container, isAr) {
      this._closeAllModals();
      const focusMins = Math.round((room.focus_duration_seconds || 1500) / 60);
      const breakMins = Math.round((room.short_break_seconds || 300) / 60);
      const countdown = this._formatCountdown(room);
      const progressPct = this._calcPhaseProgressPct(room);

      const backdrop = document.createElement('div');
      backdrop.className = 'sr-modal-backdrop';
      backdrop.innerHTML = `
        <div class="sr-modal sr-details-modal" dir="${isAr ? 'rtl' : 'ltr'}" role="dialog" aria-modal="true">
          <div class="sr-details-cover">
            <img src="assets/hero/kuro-study-hero.jpg" alt="${this._esc(room.name)}" class="sr-details-cover-img" />
            <span class="sr-details-live-pill">${this._getPhaseBadgeText(room, isAr)}</span>
            <button type="button" class="sr-details-close-btn" id="sr-details-close"><i data-lucide="x"></i></button>
          </div>

          <div class="sr-modal-body">
            <h2 class="sr-details-title">${this._esc(room.name)} 🌱</h2>
            <p class="sr-details-desc">${this._esc(room.session_goal || (isAr ? 'جلسة تركيز للجميع، ادرس ما تريد في بيئة هادئة ومنظمة.' : 'Collaborative focus session for everyone.'))}</p>

            <div class="sr-details-host-row">
              <div class="sr-avatar-circle">${this._getInitials(room.host_name)}</div>
              <div>
                <div class="sr-details-host-name">${this._esc(room.host_name)}</div>
                <div class="sr-details-host-sub">${isAr ? 'مضيف الغرفة' : 'Room Host'} ${room.subject ? `· ${this._esc(room.subject)}` : ''}</div>
              </div>
            </div>

            <div class="sr-details-stats-strip">
              <div class="sr-details-stat">
                <i data-lucide="users"></i>
                <strong>${room.participant_count || 1}/${room.max_participants || 50}</strong>
                <span>${isAr ? 'مشارك' : 'Participants'}</span>
              </div>
              <div class="sr-details-stat">
                <i data-lucide="clock"></i>
                <strong>${focusMins} ${isAr ? 'دقيقة' : 'min'}</strong>
                <span>${isAr ? 'مدة التركيز' : 'Focus Time'}</span>
              </div>
              <div class="sr-details-stat">
                <i data-lucide="coffee"></i>
                <strong>${breakMins} ${isAr ? 'دقائق' : 'min'}</strong>
                <span>${isAr ? 'الاستراحة' : 'Break'}</span>
              </div>
            </div>

            <div class="sr-dcard-progress-wrap">
              <div class="sr-dcard-progress-meta">
                <span>${isAr ? 'الوقت المتبقي في الجولة الحالية' : 'Time remaining in current round'}</span>
                <strong class="sr-tabular">${countdown}</strong>
              </div>
              <div class="sr-dcard-progress-bar">
                <div class="sr-dcard-progress-fill" style="width:${progressPct}%"></div>
              </div>
            </div>

            <button type="button" class="sr-btn-primary sr-btn-full" id="sr-details-join-btn">
              <span>${isAr ? 'انضمام إلى الغرفة' : 'Join Room Now'}</span>
              <i data-lucide="arrow-left"></i>
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(backdrop);
      if (window.lucide) window.lucide.createIcons();

      backdrop.querySelector('#sr-details-close')?.addEventListener('click', () => backdrop.remove());
      backdrop.addEventListener('click', (e) => { if (e.target === backdrop) backdrop.remove(); });
      backdrop.querySelector('#sr-details-join-btn')?.addEventListener('click', () => {
        backdrop.remove();
        if (!this._requireRegisteredStudent(isAr)) return;
        this._enterRoom(container, room.id);
      });
    },

    // ========================================================================
    // 3. CREATE ROOM MODAL (Panels 2 & 3 - إنشاء غرفة جديدة + ملخص الجلسة)
    // ========================================================================
    _openCreateRoomModal(container, isAr, existingRoomToEdit = null) {
      this._closeAllModals();
      const subjects = (window.DATA && typeof window.DATA.getSubjects === 'function')
        ? window.DATA.getSubjects()
        : [];

      const isEdit = !!existingRoomToEdit;
      let selectedVisibility = existingRoomToEdit?.visibility || 'public';
      let selectedPreset = existingRoomToEdit?.preset || 'pomodoro';
      let startMode = existingRoomToEdit?.scheduled_start_at ? 'later' : 'now';

      const defaultTimeStr = (() => {
        const d = new Date(Date.now() + 30 * 60000);
        return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      })();
      const defaultDateStr = new Date().toISOString().slice(0, 10);

      const backdrop = document.createElement('div');
      backdrop.className = 'sr-modal-backdrop';
      backdrop.innerHTML = `
        <div class="sr-modal sr-create-modal" dir="${isAr ? 'rtl' : 'ltr'}" role="dialog" aria-modal="true">
          <div class="sr-modal-header">
            <h2 class="sr-modal-title">
              <i data-lucide="plus-circle"></i>
              <span>${isEdit ? (isAr ? 'تعديل إعدادات الغرفة' : 'Edit Room Settings') : (isAr ? 'إنشاء غرفة دراسة' : 'Create Study Room')}</span>
            </h2>
            <button type="button" class="sr-modal-close" id="sr-create-close"><i data-lucide="x"></i></button>
          </div>

          <div class="sr-modal-body">
            <!-- 3 Visibility Cards (Panel 2) -->
            <div class="sr-field-group">
              <label class="sr-field-label">${isAr ? 'نوع الغرفة' : 'Room Type'}</label>
              <div class="sr-vis-grid" id="sr-vis-grid">
                <button type="button" class="sr-vis-card ${selectedVisibility === 'public' ? 'active' : ''}" data-vis="public">
                  <div class="sr-vis-card-top">
                    <i data-lucide="globe"></i>
                    <strong>${isAr ? 'عامة' : 'Public'}</strong>
                  </div>
                  <span>${isAr ? 'أي طالب مسجل يمكنه الانضمام' : 'Any registered student can join'}</span>
                </button>
                <button type="button" class="sr-vis-card ${selectedVisibility === 'private' ? 'active' : ''}" data-vis="private">
                  <div class="sr-vis-card-top">
                    <i data-lucide="lock"></i>
                    <strong>${isAr ? 'خاصة' : 'Private'}</strong>
                  </div>
                  <span>${isAr ? 'بالدعوة عبر كود أو رابط' : 'Invite only via code or link'}</span>
                </button>
                <button type="button" class="sr-vis-card ${selectedVisibility === 'solo' ? 'active' : ''}" data-vis="solo">
                  <div class="sr-vis-card-top">
                    <i data-lucide="user"></i>
                    <strong>${isAr ? 'خاصة بي فقط' : 'Solo Study'}</strong>
                  </div>
                  <span>${isAr ? 'لدراستك لوحدك بتركيز' : 'Just for your personal study'}</span>
                </button>
              </div>
            </div>

            <!-- Room Name & Subject -->
            <div class="sr-field-row">
              <div class="sr-field-group sr-flex-2">
                <label class="sr-field-label">${isAr ? 'اسم الغرفة' : 'Room Name'}</label>
                <input type="text" class="sr-input" id="sr-input-name"
                  value="${this._esc(existingRoomToEdit?.name || (isAr ? 'جلسة تركيز مسائية' : 'Evening Focus Session'))}"
                  placeholder="${isAr ? 'مثال: جلسة تركيز مسائية' : 'e.g. Evening Focus Session'}" maxlength="60" />
              </div>
              <div class="sr-field-group sr-flex-1">
                <label class="sr-field-label">${isAr ? 'المادة (اختياري)' : 'Subject (Optional)'}</label>
                <select class="sr-select" id="sr-input-subject">
                  <option value="">${isAr ? 'دراسة عامة' : 'General Study'}</option>
                  ${subjects.map(s => `<option value="${this._esc(s.name)}" ${existingRoomToEdit?.subject === s.name ? 'selected' : ''}>${this._esc(s.name)}</option>`).join('')}
                </select>
              </div>
            </div>

            <!-- Optional Description / Goal -->
            <div class="sr-field-group">
              <label class="sr-field-label">${isAr ? 'وصف أو هدف الجلسة (اختياري)' : 'Session Goal / Description (Optional)'}</label>
              <input type="text" class="sr-input" id="sr-input-goal"
                value="${this._esc(existingRoomToEdit?.session_goal || '')}"
                placeholder="${isAr ? 'لندرس معاً في جو هادئ 😊' : 'Let us study together in a calm space 😊'}" maxlength="110" />
            </div>

            <!-- Quick Templates (Panel 3) -->
            <div class="sr-field-group">
              <label class="sr-field-label">${isAr ? 'قوالب سريعة' : 'Quick Templates'}</label>
              <div class="sr-presets-grid" id="sr-presets-grid">
                ${Object.values(PRESETS).map(p => `
                  <button type="button" class="sr-preset-item ${selectedPreset === p.id ? 'active' : ''}" data-preset="${p.id}">
                    <span class="sr-preset-icon">${p.icon}</span>
                    <div class="sr-preset-meta">
                      <strong>${isAr ? p.nameAr : p.nameEn}</strong>
                      <span>${p.focusMins} ${isAr ? 'د تركيز' : 'm focus'} · ${p.shortBreakMins} ${isAr ? 'د استراحة' : 'm break'}</span>
                    </div>
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Session & Time Settings (Panel 3) -->
            <div class="sr-field-row sr-3col">
              <div class="sr-field-group">
                <label class="sr-field-label">${isAr ? 'المدة الإجمالية للجلسة' : 'Total Session Duration'}</label>
                <select class="sr-select" id="sr-select-total-hours">
                  <option value="1">${isAr ? 'ساعة واحدة' : '1 Hour'}</option>
                  <option value="2" selected>${isAr ? 'ساعتان' : '2 Hours'}</option>
                  <option value="3">${isAr ? '3 ساعات' : '3 Hours'}</option>
                  <option value="4">${isAr ? '4 ساعات' : '4 Hours'}</option>
                </select>
              </div>
              <div class="sr-field-group">
                <label class="sr-field-label">${isAr ? 'مدة التركيز لكل جولة' : 'Focus per Round'}</label>
                <select class="sr-select" id="sr-select-focus-mins">
                  <option value="15">15 ${isAr ? 'دقيقة' : 'min'}</option>
                  <option value="25" selected>25 ${isAr ? 'دقيقة' : 'min'}</option>
                  <option value="45">45 ${isAr ? 'دقيقة' : 'min'}</option>
                  <option value="50">50 ${isAr ? 'دقيقة' : 'min'}</option>
                  <option value="60">60 ${isAr ? 'دقيقة' : 'min'}</option>
                </select>
              </div>
              <div class="sr-field-group">
                <label class="sr-field-label">${isAr ? 'مدة الاستراحة' : 'Break Duration'}</label>
                <select class="sr-select" id="sr-select-break-mins">
                  <option value="3">3 ${isAr ? 'دقائق' : 'min'}</option>
                  <option value="5" selected>5 ${isAr ? 'دقائق' : 'min'}</option>
                  <option value="10">10 ${isAr ? 'دقائق' : 'min'}</option>
                  <option value="15">15 ${isAr ? 'دقيقة' : 'min'}</option>
                </select>
              </div>
            </div>

            <!-- Start Time Scheduling (Panel 3) -->
            <div class="sr-field-group">
              <label class="sr-field-label">${isAr ? 'وقت البدء' : 'Start Time'}</label>
              <div class="sr-start-mode-row">
                <label class="sr-radio-pill ${startMode === 'now' ? 'active' : ''}" data-mode="now">
                  <input type="radio" name="sr-start-mode" value="now" ${startMode === 'now' ? 'checked' : ''} />
                  <span>${isAr ? 'البدء فوراً عند الدخول' : 'Start Immediately'}</span>
                </label>
                <label class="sr-radio-pill ${startMode === 'later' ? 'active' : ''}" data-mode="later">
                  <input type="radio" name="sr-start-mode" value="later" ${startMode === 'later' ? 'checked' : ''} />
                  <span>${isAr ? 'تحديد وقت لاحق' : 'Schedule for Later'}</span>
                </label>
              </div>
              <div class="sr-schedule-inputs" id="sr-schedule-inputs" style="display:${startMode === 'later' ? 'flex' : 'none'}">
                <input type="date" class="sr-input" id="sr-schedule-date" value="${defaultDateStr}" />
                <input type="time" class="sr-input" id="sr-schedule-time" value="${defaultTimeStr}" />
              </div>
            </div>

            <!-- Live Session Summary Preview Box (Panel 3 - ملخص الجلسة) -->
            <div class="sr-session-summary-preview" id="sr-create-summary-box"></div>
          </div>

          <div class="sr-modal-footer">
            <button type="button" class="sr-btn-cancel" id="sr-create-cancel">${isAr ? 'إلغاء' : 'Cancel'}</button>
            <button type="button" class="sr-btn-primary" id="sr-create-submit">
              <i data-lucide="check"></i>
              <span>${isEdit ? (isAr ? 'حفظ التعديلات' : 'Save Changes') : (isAr ? 'إنشاء الغرفة' : 'Create Room')}</span>
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(backdrop);
      if (window.lucide) window.lucide.createIcons();

      const totalHoursSelect = backdrop.querySelector('#sr-select-total-hours');
      const focusMinsSelect = backdrop.querySelector('#sr-select-focus-mins');
      const breakMinsSelect = backdrop.querySelector('#sr-select-break-mins');
      const summaryBox = backdrop.querySelector('#sr-create-summary-box');

      const updateLiveSummary = () => {
        const totalHours = parseInt(totalHoursSelect.value || '2', 10);
        const focusMins = parseInt(focusMinsSelect.value || '25', 10);
        const breakMins = parseInt(breakMinsSelect.value || '5', 10);
        const cycleMins = focusMins + breakMins;
        const rounds = Math.max(1, Math.round((totalHours * 60) / cycleMins));
        const totalFocusMins = rounds * focusMins;
        const totalBreakMins = Math.max(0, (rounds - 1) * breakMins);

        const startMs = startMode === 'later'
          ? new Date(`${backdrop.querySelector('#sr-schedule-date').value}T${backdrop.querySelector('#sr-schedule-time').value}`).getTime() || Date.now()
          : Date.now();
        const endDate = new Date(startMs + (totalFocusMins + totalBreakMins) * 60000);
        const endStr = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;

        summaryBox.innerHTML = `
          <div class="sr-ssp-title">${isAr ? 'ملخص الجلسة' : 'Session Summary'}</div>
          <div class="sr-ssp-grid">
            <div><span>${isAr ? 'عدد جولات التركيز :' : 'Focus Rounds:'}</span> <strong>${rounds}</strong></div>
            <div><span>${isAr ? 'إجمالي وقت التركيز :' : 'Total Focus:'}</span> <strong>${totalFocusMins} ${isAr ? 'دقيقة' : 'min'}</strong></div>
            <div><span>${isAr ? 'إجمالي وقت الاستراحة :' : 'Total Break:'}</span> <strong>${totalBreakMins} ${isAr ? 'دقيقة' : 'min'}</strong></div>
            <div><span>${isAr ? 'المدة الكلية :' : 'Total Duration:'}</span> <strong>${totalHours} ${isAr ? 'ساعات' : 'hours'}</strong></div>
            <div class="sr-ssp-full"><span>${isAr ? 'وقت الانتهاء المتوقع :' : 'Expected End Time:'}</span> <strong>${endStr}</strong></div>
          </div>
        `;
      };

      updateLiveSummary();

      // Visibility cards click
      backdrop.querySelectorAll('#sr-vis-grid .sr-vis-card').forEach(btn => {
        btn.addEventListener('click', () => {
          backdrop.querySelectorAll('#sr-vis-grid .sr-vis-card').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          selectedVisibility = btn.getAttribute('data-vis');
        });
      });

      // Presets click
      backdrop.querySelectorAll('#sr-presets-grid .sr-preset-item').forEach(btn => {
        btn.addEventListener('click', () => {
          backdrop.querySelectorAll('#sr-presets-grid .sr-preset-item').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          selectedPreset = btn.getAttribute('data-preset');
          const p = PRESETS[selectedPreset];
          if (p) {
            focusMinsSelect.value = String(p.focusMins);
            breakMinsSelect.value = String(p.shortBreakMins);
            totalHoursSelect.value = String(p.totalHours);
            updateLiveSummary();
          }
        });
      });

      [totalHoursSelect, focusMinsSelect, breakMinsSelect].forEach(el => {
        el?.addEventListener('change', updateLiveSummary);
      });

      // Start mode radio
      backdrop.querySelectorAll('.sr-radio-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          backdrop.querySelectorAll('.sr-radio-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          startMode = pill.getAttribute('data-mode');
          const schedWrap = backdrop.querySelector('#sr-schedule-inputs');
          if (schedWrap) schedWrap.style.display = startMode === 'later' ? 'flex' : 'none';
          updateLiveSummary();
        });
      });

      const close = () => backdrop.remove();
      backdrop.querySelector('#sr-create-close')?.addEventListener('click', close);
      backdrop.querySelector('#sr-create-cancel')?.addEventListener('click', close);
      backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });

      backdrop.querySelector('#sr-create-submit')?.addEventListener('click', async () => {
        const name = (backdrop.querySelector('#sr-input-name')?.value || '').trim();
        if (!name) {
          window.Toast?.show(isAr ? 'يرجى كتابة اسم الغرفة' : 'Please enter a room name', 'warning');
          return;
        }

        const focusMins = parseInt(focusMinsSelect.value || '25', 10);
        const breakMins = parseInt(breakMinsSelect.value || '5', 10);
        const totalHours = parseInt(totalHoursSelect.value || '2', 10);
        const rounds = Math.max(1, Math.round((totalHours * 60) / (focusMins + breakMins)));

        let scheduledStartAt = null;
        if (startMode === 'later') {
          const dVal = backdrop.querySelector('#sr-schedule-date')?.value;
          const tVal = backdrop.querySelector('#sr-schedule-time')?.value;
          if (dVal && tVal) {
            scheduledStartAt = new Date(`${dVal}T${tVal}`).toISOString();
          }
        }

        const user = this._getCurrentUser();
        const nowIso = new Date().toISOString();

        if (isEdit && existingRoomToEdit) {
          const updated = {
            ...existingRoomToEdit,
            name,
            subject: backdrop.querySelector('#sr-input-subject')?.value || null,
            session_goal: (backdrop.querySelector('#sr-input-goal')?.value || '').trim() || null,
            visibility: selectedVisibility,
            preset: selectedPreset,
            focus_duration_seconds: focusMins * 60,
            short_break_seconds: breakMins * 60,
            total_session_seconds: totalHours * 3600,
            total_rounds: rounds,
            scheduled_start_at: scheduledStartAt,
            updated_at: nowIso
          };
          await this._saveRoomState(updated);
          close();
          if (this.view === 'room') {
            this._renderActiveRoomPage(container, isAr);
          } else {
            this._renderDiscoveryCards(container);
          }
          window.Toast?.show(isAr ? 'تم تحديث إعدادات الغرفة بنجاح ✓' : 'Room settings updated ✓', 'success');
          return;
        }

        const startImmediately = startMode === 'now';
        const focusSec = focusMins * 60;
        const newRoom = {
          id: this._uuid(),
          name,
          subject: backdrop.querySelector('#sr-input-subject')?.value || null,
          session_goal: (backdrop.querySelector('#sr-input-goal')?.value || '').trim() || null,
          visibility: selectedVisibility,
          preset: selectedPreset,
          status: startImmediately ? 'active' : 'waiting',
          phase: startImmediately ? 'focus' : 'waiting',
          current_round: startImmediately ? 1 : 0,
          total_rounds: rounds,
          rounds_before_long: 4,
          focus_duration_seconds: focusSec,
          short_break_seconds: breakMins * 60,
          long_break_seconds: Math.max(10, breakMins * 2) * 60,
          total_session_seconds: totalHours * 3600,
          scheduled_start_at: scheduledStartAt,
          started_at: startImmediately ? nowIso : null,
          ends_at: startImmediately ? new Date(Date.now() + focusSec * 1000).toISOString() : null,
          paused_remaining_seconds: null,
          participant_count: 1,
          max_participants: selectedVisibility === 'solo' ? 1 : 50,
          invitation_code: this._generateCode(),
          host_user_id: user.id,
          host_name: user.name,
          host_avatar: user.avatar,
          created_at: nowIso,
          updated_at: nowIso
        };

        await this._createNewRoomRecord(newRoom);
        close();

        // Enter room immediately
        await this._enterRoom(container, newRoom.id, newRoom.invitation_code);

        // If private room, immediately show the Invite Code & Link Modal (Panel 4/5) so host can share it!
        if (selectedVisibility === 'private') {
          setTimeout(() => {
            this._openInviteModal(newRoom, isAr);
          }, 250);
        }
      });
    },

    // ========================================================================
    // 4. JOIN BY CODE OR LINK MODAL (Panels 5 & 12 - الانضمام برابط أو كود)
    // ========================================================================
    _openJoinByCodeModal(container, isAr, prefilledCode = '') {
      this._closeAllModals();
      let mode = 'code'; // 'code' | 'link'

      const backdrop = document.createElement('div');
      backdrop.className = 'sr-modal-backdrop';
      backdrop.innerHTML = `
        <div class="sr-modal sr-modal-sm" dir="${isAr ? 'rtl' : 'ltr'}" role="dialog" aria-modal="true">
          <div class="sr-modal-header">
            <h2 class="sr-modal-title">
              <i data-lucide="key-round"></i>
              <span>${isAr ? 'الانضمام إلى غرفة خاصة' : 'Join Private Room'}</span>
            </h2>
            <button type="button" class="sr-modal-close" id="sr-join-close"><i data-lucide="x"></i></button>
          </div>

          <div class="sr-modal-body">
            <div class="sr-segmented-tabs" id="sr-join-tabs">
              <button type="button" class="sr-seg-tab active" data-mode="code">${isAr ? 'باستخدام الكود' : 'Use Code'}</button>
              <button type="button" class="sr-seg-tab" data-mode="link">${isAr ? 'باستخدام الرابط' : 'Use Link'}</button>
            </div>

            <div class="sr-field-group">
              <label class="sr-field-label" id="sr-join-label">${isAr ? 'أدخل كود الغرفة' : 'Enter Room Code'}</label>
              <input type="text" class="sr-input sr-code-big-input" id="sr-join-input"
                value="${this._esc(prefilledCode)}"
                placeholder="K7F9D" autocomplete="off" />
              <p class="sr-field-hint">
                ${isAr ? 'لا تحتاج لكتابة اسم الغرفة — أدخل الكود أو الصق الرابط فقط وسيتم الانضمام تلقائياً.' : 'No need to type the room name — just enter the code or paste the invite link.'}
              </p>
            </div>

            <button type="button" class="sr-btn-primary sr-btn-full" id="sr-join-submit-btn">
              <span>${isAr ? 'انضمام الآن' : 'Join Now'}</span>
              <i data-lucide="arrow-left"></i>
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(backdrop);
      if (window.lucide) window.lucide.createIcons();

      const inputEl = backdrop.querySelector('#sr-join-input');
      const labelEl = backdrop.querySelector('#sr-join-label');

      backdrop.querySelectorAll('#sr-join-tabs .sr-seg-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          backdrop.querySelectorAll('#sr-join-tabs .sr-seg-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          mode = tab.getAttribute('data-mode');
          if (mode === 'code') {
            labelEl.textContent = isAr ? 'أدخل كود الغرفة' : 'Enter Room Code';
            inputEl.placeholder = 'K7F9D';
            inputEl.classList.add('sr-code-big-input');
          } else {
            labelEl.textContent = isAr ? 'الصق رابط الدعوة المباشر' : 'Paste Direct Invite Link';
            inputEl.placeholder = 'https://kurofangs.id.ly/#/study-rooms?room=...';
            inputEl.classList.remove('sr-code-big-input');
          }
          inputEl.focus();
        });
      });

      const close = () => backdrop.remove();
      backdrop.querySelector('#sr-join-close')?.addEventListener('click', close);
      backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });

      const handleJoin = async () => {
        const raw = (inputEl?.value || '').trim();
        if (!raw) {
          window.Toast?.show(isAr ? 'يرجى إدخال الكود أو الرابط أولاً' : 'Please enter a code or link first', 'warning');
          return;
        }
        const matched = await this._findRoomByCodeOrLink(raw);
        if (!matched) {
          window.Toast?.show(isAr ? 'لم يتم العثور على غرفة بهذا الكود أو الرابط' : 'Room not found with this code or link', 'error');
          return;
        }
        close();
        await this._enterRoom(container, matched.id, matched.invitation_code);
      };

      backdrop.querySelector('#sr-join-submit-btn')?.addEventListener('click', handleJoin);
      inputEl?.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleJoin(); });
      inputEl?.focus();
    },

    // ========================================================================
    // 5. INVITE MODAL FOR PRIVATE/PUBLIC ROOMS (Panels 4 & 5 - دعوة إلى الغرفة)
    // ========================================================================
    _openInviteModal(room, isAr) {
      this._closeAllModals();
      const inviteLink = `${window.location.origin}${window.location.pathname}#/study-rooms?room=${room.id}&code=${room.invitation_code}`;
      const spacedCode = (room.invitation_code || 'K7F9D').split('').join(' ');

      const backdrop = document.createElement('div');
      backdrop.className = 'sr-modal-backdrop';
      backdrop.innerHTML = `
        <div class="sr-modal sr-modal-sm" dir="${isAr ? 'rtl' : 'ltr'}" role="dialog" aria-modal="true">
          <div class="sr-modal-header">
            <h2 class="sr-modal-title">
              <i data-lucide="share-2"></i>
              <span>${isAr ? 'دعوة إلى الغرفة' : 'Invite to Room'}</span>
            </h2>
            <button type="button" class="sr-modal-close" id="sr-invite-close"><i data-lucide="x"></i></button>
          </div>

          <div class="sr-modal-body">
            <!-- Direct Invite Link -->
            <div class="sr-invite-block">
              <label class="sr-field-label">${isAr ? 'رابط الدعوة المباشر' : 'Direct Invite Link'}</label>
              <div class="sr-invite-url-box">
                <input type="text" class="sr-input" value="${inviteLink}" readonly id="sr-invite-link-input" />
              </div>
              <button type="button" class="sr-btn-primary sr-btn-full" id="sr-copy-link-btn">
                <i data-lucide="copy"></i>
                <span>${isAr ? 'نسخ الرابط' : 'Copy Link'}</span>
              </button>
            </div>

            <div class="sr-divider-or"><span>${isAr ? 'أو كود الغرفة' : 'OR ROOM CODE'}</span></div>

            <!-- Room Code Box -->
            <div class="sr-invite-block">
              <div class="sr-invite-code-box" id="sr-invite-code-display">${spacedCode}</div>
              <button type="button" class="sr-btn-secondary sr-btn-full" id="sr-copy-code-btn">
                <i data-lucide="key-round"></i>
                <span>${isAr ? 'نسخ الكود' : 'Copy Code'}</span>
              </button>
              <p class="sr-field-hint sr-text-center">${isAr ? 'هذا الكود صالح طوال الجلسة الحالية' : 'This code is valid for the current session'}</p>
            </div>

            <!-- Social Share Row -->
            <div class="sr-share-social-row">
              <button type="button" class="sr-social-btn whatsapp" id="sr-share-wa">
                <i data-lucide="message-circle"></i>
                <span>${isAr ? 'واتساب' : 'WhatsApp'}</span>
              </button>
              <button type="button" class="sr-social-btn telegram" id="sr-share-tg">
                <i data-lucide="send"></i>
                <span>${isAr ? 'تيليجرام' : 'Telegram'}</span>
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(backdrop);
      if (window.lucide) window.lucide.createIcons();

      const close = () => backdrop.remove();
      backdrop.querySelector('#sr-invite-close')?.addEventListener('click', close);
      backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });

      backdrop.querySelector('#sr-copy-link-btn')?.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(inviteLink);
          window.Toast?.show(isAr ? 'تم نسخ رابط الدعوة بنجاح! 🔗' : 'Invite link copied! 🔗', 'success');
        } catch (e) {}
      });

      backdrop.querySelector('#sr-copy-code-btn')?.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(room.invitation_code);
          window.Toast?.show(isAr ? `تم نسخ الكود (${room.invitation_code})! 🔑` : `Code (${room.invitation_code}) copied! 🔑`, 'success');
        } catch (e) {}
      });

      const shareText = isAr
        ? `انضم معي إلى غرفة الدراسة "${room.name}" على منصة كورو فانغز!\nكود الغرفة: ${room.invitation_code}\nالرابط المباشر: ${inviteLink}`
        : `Join my Study Room "${room.name}" on Kuro Fangs!\nCode: ${room.invitation_code}\nLink: ${inviteLink}`;

      backdrop.querySelector('#sr-share-wa')?.addEventListener('click', () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank', 'noopener');
      });

      backdrop.querySelector('#sr-share-tg')?.addEventListener('click', () => {
        window.open(`https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`, '_blank', 'noopener');
      });
    },

    // ========================================================================
    // 6. ENTER & RENDER ACTIVE STUDY ROOM (Panels 6, 7, 8, 9, 11, 13, 15)
    // ========================================================================
    async _enterRoom(container, roomId, inviteCode = null) {
      const isAr = this._isAr();
      if (!this._requireRegisteredStudent(isAr)) {
        await this._renderDiscoveryPage(container, isAr);
        return;
      }

      const room = await this._fetchRoomById(roomId);
      if (!room || room.status === 'closed') {
        window.Toast?.show(isAr ? 'هذه الغرفة مغلقة أو غير موجودة' : 'Room is closed or does not exist', 'error');
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_ROOM_ID);
        this.currentRoom = null;
        await this._renderDiscoveryPage(container, isAr);
        return;
      }

      const user = this._getCurrentUser();

      // Verify private room access
      if (room.visibility === 'private' && room.host_user_id !== user.id) {
        const alreadyMember = this._getRoomParticipants(room.id).some(p => p.user_id === user.id);
        if (!alreadyMember && inviteCode && inviteCode.toUpperCase() !== (room.invitation_code || '').toUpperCase()) {
          window.Toast?.show(isAr ? 'كود الدعوة غير مطابق لهذه الغرفة الخاصة' : 'Invalid invitation code for this private room', 'error');
          await this._renderDiscoveryPage(container, isAr);
          return;
        }
      }

      this.currentRoom = room;
      this.view = 'room';
      this._summaryShownForRoom = null;
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ROOM_ID, room.id);

      // Upsert idempotent participant record
      this.membership = this._ensureLocalMembership(room);
      this.participants = this._getRoomParticipants(room.id);
      this.messages = this._getRoomMessages(room.id);

      // Update hash quietly
      const targetHash = `#/study-rooms?room=${room.id}`;
      if (!window.location.hash.includes(`room=${room.id}`)) {
        window.history.replaceState(null, '', targetHash);
      }

      this._renderActiveRoomPage(container, isAr);
      this._subscribeRoomRealtime(room.id, container);
      this._startGlobalTicker();
      this._updateGlobalFloatingWidget();
    },

    _renderActiveRoomPage(container, isAr) {
      const room = this.currentRoom;
      if (!room) return;

      const user = this._getCurrentUser();
      const isHost = room.host_user_id === user.id;
      const phase = room.phase || 'waiting';
      const isBreakPhase = phase === 'short_break' || phase === 'long_break';
      const isSkipBreakActive = isBreakPhase && this.membership?.skip_break_override;
      const effectivePersonalFocus = phase === 'focus' || isSkipBreakActive;

      const countdown = this._formatCountdown(room);
      const ringDashoffset = this._calcRingDashoffset(room, 628);
      const totalRounds = room.total_rounds || 3;
      const currentRound = Math.max(1, room.current_round || 1);
      const sessionProgressPct = Math.min(100, Math.round(((currentRound - 1) / totalRounds) * 100));

      container.innerHTML = `
        <section class="sr-room-workspace phase-${phase}" dir="${isAr ? 'rtl' : 'ltr'}">
          <!-- Top Room Bar -->
          <header class="sr-room-topbar">
            <div class="sr-rtb-start">
              <button type="button" class="sr-btn-icon-back" id="sr-room-back-btn" title="${isAr ? 'العودة لتصفح الموقع (يبقى المؤقت عائماً)' : 'Browse site (Timer stays floating)'}">
                <i data-lucide="arrow-${isAr ? 'right' : 'left'}"></i>
              </button>
              <div class="sr-rtb-title-group">
                <div class="sr-rtb-title-row">
                  <h1 class="sr-rtb-title">${this._esc(room.name)}</h1>
                  <span class="sr-rtb-phase-pill phase-${phase}" id="sr-rtb-phase-pill">
                    <span class="sr-status-dot"></span>
                    <span id="sr-rtb-phase-text">${this._getPhaseBadgeText(room, isAr)}</span>
                  </span>
                </div>
                <div class="sr-rtb-sub">
                  <span>${isAr ? 'من إنشاء' : 'Created by'} <strong>${this._esc(room.host_name)}</strong></span>
                  ${room.subject ? `<span>· ${this._esc(room.subject)}</span>` : ''}
                  ${room.invitation_code ? `<span class="sr-rtb-code-chip" id="sr-quick-copy-code" title="${isAr ? 'انسخ كود الغرفة' : 'Copy Room Code'}">#${room.invitation_code}</span>` : ''}
                </div>
              </div>
            </div>

            <div class="sr-rtb-actions">
              <div class="sr-rtb-cap-pill">
                <i data-lucide="users"></i>
                <span id="sr-rtb-cap-text" class="sr-tabular">${this.participants.length}/${room.max_participants || 50}</span>
              </div>

              <button type="button" class="sr-btn-secondary sr-btn-sm" id="sr-room-invite-btn">
                <i data-lucide="share-2"></i>
                <span>${isAr ? 'دعوة' : 'Invite'}</span>
              </button>

              ${isHost ? `
                <div class="sr-host-menu-wrap">
                  <button type="button" class="sr-btn-secondary sr-btn-sm" id="sr-host-menu-trigger">
                    <i data-lucide="sliders-horizontal"></i>
                    <span>${isAr ? 'إدارة الغرفة' : 'Manage Room'}</span>
                  </button>
                  <div class="sr-host-dropdown" id="sr-host-dropdown" style="display:none">
                    <div class="sr-hd-header">${isAr ? 'صلاحيات إدارة الغرفة' : 'Host Controls'}</div>
                    ${phase === 'waiting' ? `
                      <button type="button" class="sr-hd-item" data-host-cmd="start">
                        <i data-lucide="play"></i>
                        <span>${isAr ? 'بدء الجلسة الآن' : 'Start Session Now'}</span>
                      </button>
                      <button type="button" class="sr-hd-item" data-host-cmd="edit">
                        <i data-lucide="settings"></i>
                        <span>${isAr ? 'تعديل الإعدادات (قبل البدء)' : 'Edit Settings'}</span>
                      </button>
                    ` : ''}
                    <button type="button" class="sr-hd-item" data-host-cmd="invite">
                      <i data-lucide="link"></i>
                      <span>${isAr ? 'نسخ رابط وكود الدعوة' : 'Copy Invite Link & Code'}</span>
                    </button>
                    <button type="button" class="sr-hd-item" data-host-cmd="transfer">
                      <i data-lucide="user-check"></i>
                      <span>${isAr ? 'نقل صلاحيات المضيف' : 'Transfer Host Role'}</span>
                    </button>
                    <button type="button" class="sr-hd-item warn" data-host-cmd="end_early">
                      <i data-lucide="flag"></i>
                      <span>${isAr ? 'إنهاء الجلسة مبكراً' : 'End Session Early'}</span>
                    </button>
                    <button type="button" class="sr-hd-item danger" data-host-cmd="close_room">
                      <i data-lucide="trash-2"></i>
                      <span>${isAr ? 'إغلاق وحذف الغرفة' : 'Close & Delete Room'}</span>
                    </button>
                  </div>
                </div>
              ` : ''}

              <button type="button" class="sr-btn-leave" id="sr-room-leave-btn">
                <i data-lucide="log-out"></i>
                <span>${isAr ? 'مغادرة' : 'Leave'}</span>
              </button>
            </div>
          </header>

          <!-- Main 2-Column Interactive Layout -->
          <div class="sr-room-grid">

            <!-- LEFT / CENTER COLUMN: FOCUS STAGE + SOUNDS -->
            <div class="sr-stage-col">

              <!-- STAGE CARD -->
              <div class="sr-stage-card">
                ${phase === 'waiting' ? this._buildWaitingLobbyStageHTML(room, isHost, isAr) : ''}
                ${isBreakPhase && !isSkipBreakActive ? this._buildBreakStageHTML(room, isHost, isAr, countdown, ringDashoffset) : ''}
                ${(phase === 'focus' || phase === 'paused' || phase === 'completed' || isSkipBreakActive) ? this._buildFocusStageHTML(room, isHost, isAr, countdown, ringDashoffset, sessionProgressPct, isSkipBreakActive) : ''}

                <!-- Personal Study Goal Strip -->
                <div class="sr-personal-goal-bar">
                  <div class="sr-pgb-left">
                    <i data-lucide="target"></i>
                    <span>${isAr ? 'هدفي في الجلسة:' : 'My Session Goal:'}</span>
                    <strong id="sr-my-goal-text">${this._esc(this.membership?.personal_goal || (isAr ? 'مراجعة المحاضرات وحل الأسئلة' : 'Review lectures & solve MCQs'))}</strong>
                  </div>
                  <button type="button" class="sr-pgb-edit-btn" id="sr-edit-my-goal-btn">
                    <i data-lucide="pen-line"></i>
                    <span>${isAr ? 'تعديل الهدف' : 'Edit Goal'}</span>
                  </button>
                </div>
              </div>

              <!-- AMBIENT FOCUS SOUNDS PANEL (Panels 6 & 15 - الأصوات المساعدة للتركيز) -->
              <div class="sr-sounds-card">
                <div class="sr-sounds-header">
                  <div class="sr-sounds-title">
                    <i data-lucide="headphones"></i>
                    <div>
                      <h3>${isAr ? 'الأصوات المساعدة للتركيز' : 'Ambient Focus Sounds'}</h3>
                      <span>${isAr ? 'أصوات طبيعية هادئة بدون موسيقى' : 'Pure natural soundscapes without music'}</span>
                    </div>
                  </div>
                  <div class="sr-volume-control">
                    <i data-lucide="volume-2"></i>
                    <input type="range" id="sr-ambient-volume" min="0" max="1" step="0.05" value="${AmbientAudioEngine.volume}" />
                  </div>
                </div>

                <div class="sr-sounds-grid" id="sr-sounds-grid">
                  ${AMBIENT_SOUNDS.map(s => {
                    const isPlaying = AmbientAudioEngine.activeSound === s.id;
                    return `
                      <button type="button" class="sr-sound-pill ${isPlaying ? 'playing' : ''}" data-sound-id="${s.id}">
                        <span class="sr-sound-emoji">${s.emoji}</span>
                        <div class="sr-sound-meta">
                          <strong>${isAr ? s.nameAr : s.nameEn}</strong>
                          <span>${isAr ? s.subAr : s.subEn}</span>
                        </div>
                        <span class="sr-sound-play-icon">
                          <i data-lucide="${isPlaying ? 'pause' : 'play'}"></i>
                        </span>
                      </button>
                    `;
                  }).join('')}
                </div>
              </div>

            </div>

            <!-- RIGHT COLUMN: LEADERBOARD PARTICIPANTS + BREAK CHAT -->
            <aside class="sr-sidebar-col">

              <!-- PARTICIPANTS & LEADERBOARD (Panels 8 & 9 - المشاركون والترتيب) -->
              <div class="sr-leaderboard-card">
                <div class="sr-lb-header">
                  <h3>
                    <i data-lucide="award"></i>
                    <span>${isAr ? 'المشاركون والترتيب' : 'Participants & Ranking'} (${this.participants.length})</span>
                  </h3>
                  <span class="sr-lb-sub">${isAr ? 'حسب وقت الدراسة' : 'Sorted by study time'}</span>
                </div>

                <div class="sr-lb-table-head">
                  <span>${isAr ? 'الترتيب' : '#'}</span>
                  <span>${isAr ? 'الطالب' : 'Student'}</span>
                  <span>${isAr ? 'الحالة' : 'Status'}</span>
                  <span>${isAr ? 'وقت الدراسة' : 'Study Time'}</span>
                </div>

                <div class="sr-lb-list" id="sr-lb-list">
                  ${this._buildLeaderboardRowsHTML(isAr)}
                </div>
              </div>

              <!-- BREAK & LOBBY CHAT PANEL -->
              <div class="sr-chat-card">
                <div class="sr-chat-header">
                  <h3>
                    <i data-lucide="message-square"></i>
                    <span>${isAr ? 'دردشة الاستراحة' : 'Break Chat'}</span>
                  </h3>
                  <span class="sr-chat-badge ${effectivePersonalFocus && !room.allow_focus_chat ? 'muted' : 'open'}" id="sr-chat-status-badge">
                    ${effectivePersonalFocus && !room.allow_focus_chat
                      ? (isAr ? 'هادئ أثناء التركيز 🤫' : 'Muted during focus 🤫')
                      : (isAr ? 'متاحة الآن 💬' : 'Open now 💬')}
                  </span>
                </div>

                <div class="sr-chat-messages" id="sr-chat-messages">
                  ${this._buildChatMessagesHTML(isAr)}
                </div>

                <form class="sr-chat-form" id="sr-chat-form">
                  <input type="text" class="sr-chat-input" id="sr-chat-input"
                    placeholder="${effectivePersonalFocus && !room.allow_focus_chat
                      ? (isAr ? 'الدردشة تفتح تلقائياً في وقت الاستراحة...' : 'Chat opens automatically during breaks...')
                      : (isAr ? 'اكتب رسالة تشجيعية لزملائك...' : 'Write an encouraging message...')}"
                    ${effectivePersonalFocus && !room.allow_focus_chat ? 'disabled' : ''} maxlength="280" />
                  <button type="button" class="sr-chat-send" id="sr-chat-send-btn" ${effectivePersonalFocus && !room.allow_focus_chat ? 'disabled' : ''}>
                    <i data-lucide="send"></i>
                  </button>
                </form>
              </div>

            </aside>
          </div>
        </section>
      `;

      if (window.lucide) window.lucide.createIcons();
      this._bindActiveRoomEvents(container, isAr);
    },

    // ─── STAGE A: WAITING LOBBY BEFORE SESSION (Panel 6 in Image 2) ────────
    _buildWaitingLobbyStageHTML(room, isHost, isAr) {
      const focusMins = Math.round((room.focus_duration_seconds || 1500) / 60);
      const waitCountdown = room.scheduled_start_at
        ? this._formatUntilTimestamp(room.scheduled_start_at)
        : '00:00:00';

      const avatarsHTML = this.participants.slice(0, 6).map(p => `
        <div class="sr-lobby-avatar" title="${this._esc(p.user_name)}">${this._getInitials(p.user_name)}</div>
      `).join('');
      const extraCount = Math.max(0, this.participants.length - 6);

      return `
        <div class="sr-waiting-stage">
          <span class="sr-waiting-kicker">${isAr ? 'الانتظار قبل بدء الجلسة' : 'Waiting Lobby'}</span>
          <h2 class="sr-waiting-title">${this._esc(room.name)}</h2>
          <p class="sr-waiting-sub">${room.scheduled_start_at ? (isAr ? 'يبدأ بعد' : 'Starts in') : (isAr ? 'بانتظار بدء المضيف للجلسة' : 'Waiting for host to start')}</p>

          <div class="sr-waiting-timer sr-tabular" id="sr-stage-countdown">${waitCountdown}</div>

          <div class="sr-waiting-pills">
            <span><i data-lucide="clock"></i> ${focusMins} ${isAr ? 'دقيقة لكل جولة' : 'min per round'}</span>
            <span><i data-lucide="users"></i> ${this.participants.length} ${isAr ? 'مشارك مستعد' : 'participants ready'}</span>
          </div>

          <div class="sr-lobby-avatar-stack">
            ${avatarsHTML}
            ${extraCount > 0 ? `<div class="sr-lobby-avatar more">+${extraCount}</div>` : ''}
          </div>

          <div class="sr-ready-status-box">
            <span class="sr-ready-pill"><i data-lucide="check-circle-2"></i> ${isAr ? 'مستعد' : 'Ready'}</span>
            <span>${isAr ? 'أنت الآن في الغرفة ومستعد للبدء' : 'You are in the room and ready'}</span>
          </div>

          <div class="sr-stage-controls">
            ${isHost ? `
              <button type="button" class="sr-btn-primary sr-btn-lg" id="sr-stage-start-btn">
                <i data-lucide="play"></i>
                <span>${isAr ? 'بدء الجلسة الآن' : 'Start Session Now'}</span>
              </button>
            ` : `
              <div class="sr-waiting-auto-note">
                ${isAr ? 'ستبدأ الجلسة تلقائياً عند الوصول إلى الوقت المحدد أو عند ضغط المضيف على بدء.' : 'Session will start automatically at the scheduled time or when the host starts.'}
              </div>
            `}
          </div>
        </div>
      `;
    },

    // ─── STAGE B: FOCUS RING STAGE (Panel 6 Image 1 & Panel 7 Image 2) ─────
    _buildFocusStageHTML(room, isHost, isAr, countdown, ringDashoffset, sessionProgressPct, isSkipBreakActive) {
      const currentRound = Math.max(1, room.current_round || 1);
      const totalRounds = Math.max(1, room.total_rounds || 3);
      const isPersonalPaused = this.membership?.status === 'paused' || room.phase === 'paused';
      const totalRemainingStr = this._formatTotalSessionRemaining(room);

      return `
        <div class="sr-focus-stage">
          ${isSkipBreakActive ? `
            <div class="sr-skip-override-banner">
              <span>⚡ ${isAr ? 'أنت تواصل الدراسة فردياً أثناء استراحة الغرفة' : 'You are continuing personal focus during room break'}</span>
              <button type="button" class="sr-btn-ghost sr-btn-xs" id="sr-rejoin-break-btn">${isAr ? 'العودة للاستراحة' : 'Take Break'}</button>
            </div>
          ` : ''}

          <div class="sr-ring-container">
            <svg class="sr-ring-svg" viewBox="0 0 220 220">
              <circle class="sr-ring-bg" cx="110" cy="110" r="100"></circle>
              <circle class="sr-ring-fill" id="sr-stage-ring-fill" cx="110" cy="110" r="100"
                stroke-dasharray="628"
                stroke-dashoffset="${ringDashoffset}"></circle>
            </svg>
            <div class="sr-ring-center">
              <span class="sr-ring-kicker">${isAr ? 'جولة التركيز الآن' : 'CURRENT FOCUS ROUND'}</span>
              <div class="sr-ring-digits sr-tabular" id="sr-stage-countdown">${countdown}</div>
              <span class="sr-ring-unit">${isAr ? 'دقيقة متبقية' : 'minutes remaining'}</span>
              <span class="sr-ring-round-tag" id="sr-stage-round-tag">
                ${isAr ? `الجولة ${currentRound} من ${totalRounds}` : `Round ${currentRound} of ${totalRounds}`}
              </span>
            </div>
          </div>

          <!-- Overall Session Progress Strip -->
          <div class="sr-overall-progress">
            <div class="sr-op-labels">
              <span>${isAr ? `الجولة الحالية ${currentRound}/${totalRounds}` : `Current Round ${currentRound}/${totalRounds}`}</span>
              <span class="sr-tabular">${isAr ? 'الوقت الإجمالي المتبقي:' : 'Total Remaining:'} <strong id="sr-total-rem-text">${totalRemainingStr}</strong></span>
            </div>
            <div class="sr-op-track">
              <div class="sr-op-fill" style="width:${sessionProgressPct}%"></div>
            </div>
          </div>

          <!-- Controls -->
          <div class="sr-stage-controls">
            <button type="button" class="sr-btn-primary sr-btn-lg" id="sr-personal-pause-btn">
              <i data-lucide="${isPersonalPaused ? 'play' : 'pause'}"></i>
              <span>${isPersonalPaused ? (isAr ? 'استئناف مؤقتي' : 'Resume My Timer') : (isAr ? 'إيقاف مؤقت' : 'Pause Timer')}</span>
            </button>

            ${isHost ? `
              <button type="button" class="sr-btn-secondary sr-btn-lg" id="sr-host-next-phase-btn">
                <i data-lucide="skip-forward"></i>
                <span>${isAr ? 'الانتقال للاستراحة' : 'Start Break'}</span>
              </button>
            ` : ''}
          </div>
        </div>
      `;
    },

    // ─── STAGE C: BREAK STAGE WITH INDIVIDUAL SKIP (Panel 7 & 8) ───────────
    _buildBreakStageHTML(room, isHost, isAr, countdown, ringDashoffset) {
      return `
        <div class="sr-break-stage">
          <div class="sr-break-badge-pill">
            <i data-lucide="coffee"></i>
            <span>${isAr ? 'في الاستراحة' : 'On Break'}</span>
          </div>

          <div class="sr-ring-container break-ring">
            <svg class="sr-ring-svg" viewBox="0 0 220 220">
              <circle class="sr-ring-bg" cx="110" cy="110" r="100"></circle>
              <circle class="sr-ring-fill break-stroke" id="sr-stage-ring-fill" cx="110" cy="110" r="100"
                stroke-dasharray="628"
                stroke-dashoffset="${ringDashoffset}"></circle>
            </svg>
            <div class="sr-ring-center">
              <div class="sr-break-cup-emoji">☕</div>
              <div class="sr-ring-digits sr-tabular" id="sr-stage-countdown">${countdown}</div>
              <span class="sr-ring-unit">${isAr ? 'دقيقة متبقية للاستراحة' : 'minutes left in break'}</span>
            </div>
          </div>

          <div class="sr-stage-controls sr-break-controls">
            <button type="button" class="sr-btn-primary sr-btn-lg" id="sr-skip-break-personal-btn">
              <i data-lucide="fast-forward"></i>
              <span>${isAr ? 'تخطي الاستراحة لي فقط' : 'Skip Break For Me Only'}</span>
            </button>

            ${isHost ? `
              <button type="button" class="sr-btn-secondary sr-btn-lg" id="sr-host-next-phase-btn">
                <i data-lucide="play"></i>
                <span>${isAr ? 'بدء جولة التركيز للجميع' : 'Start Next Round For All'}</span>
              </button>
            ` : ''}
          </div>

          <p class="sr-break-note">
            ${isAr ? 'يمكنك تخطي الاستراحة ومواصلة الدراسة بشكل فردي — لن يؤثر هذا على باقي المشاركين.' : 'You can skip the break and keep studying individually without affecting other participants.'}
          </p>
        </div>
      `;
    },

    // ─── LEADERBOARD ROWS (Panels 8 & 9 - الحالات المختلفة للمشاركين) ──────
    _buildLeaderboardRowsHTML(isAr) {
      const user = this._getCurrentUser();
      const room = this.currentRoom;
      const sorted = [...this.participants].sort((a, b) => (b.focus_seconds_earned || 0) - (a.focus_seconds_earned || 0));

      return sorted.map((p, idx) => {
        const rank = idx + 1;
        const isMe = p.user_id === user.id;
        const isRoomHost = p.user_id === room?.host_user_id;

        // Determine effective participant status (Ready, Studying, Break, Paused)
        let effStatus = p.status || 'ready';
        if (room?.phase === 'waiting') {
          effStatus = 'ready';
        } else if (p.status === 'paused') {
          effStatus = 'paused';
        } else if ((room?.phase === 'short_break' || room?.phase === 'long_break') && !p.skip_break_override) {
          effStatus = 'on_break';
        } else if (room?.phase === 'focus' || p.skip_break_override) {
          effStatus = 'focusing';
        }

        const statusMeta = {
          ready: { labelAr: 'مستعد', labelEn: 'Ready', cls: 'st-ready', icon: 'check-circle-2' },
          focusing: { labelAr: 'يدرس الآن', labelEn: 'Studying', cls: 'st-focus', icon: 'flame' },
          on_break: { labelAr: 'في الاستراحة', labelEn: 'On Break', cls: 'st-break', icon: 'coffee' },
          paused: { labelAr: 'متوقف مؤقتاً', labelEn: 'Paused', cls: 'st-paused', icon: 'pause-circle' }
        }[effStatus] || { labelAr: 'مستعد', labelEn: 'Ready', cls: 'st-ready', icon: 'check-circle-2' };

        const rankBadge = rank <= 3
          ? `<span class="sr-rank-medal rank-${rank}">${rank}</span>`
          : `<span class="sr-rank-num">${rank}</span>`;

        return `
          <div class="sr-lb-row ${isMe ? 'is-me' : ''}">
            <div class="sr-lb-col-rank">${rankBadge}</div>
            <div class="sr-lb-col-user">
              <div class="sr-lb-avatar">${this._getInitials(p.user_name)}</div>
              <div class="sr-lb-name-wrap">
                <span class="sr-lb-name">
                  ${this._esc(p.user_name)}
                  ${isRoomHost ? `<span class="sr-crown-badge" title="${isAr ? 'مضيف الغرفة' : 'Host'}">👑</span>` : ''}
                  ${isMe ? `<span class="sr-you-tag">(${isAr ? 'أنت' : 'You'})</span>` : ''}
                </span>
                ${p.personal_goal ? `<span class="sr-lb-goal">${this._esc(p.personal_goal)}</span>` : ''}
              </div>
            </div>
            <div class="sr-lb-col-status">
              <span class="sr-pstatus-pill ${statusMeta.cls}">
                <span>${isAr ? statusMeta.labelAr : statusMeta.labelEn}</span>
              </span>
            </div>
            <div class="sr-lb-col-time sr-tabular" data-participant-time="${p.user_id}">
              ${this._formatHMS(p.focus_seconds_earned || 0)}
            </div>
          </div>
        `;
      }).join('');
    },

    _buildChatMessagesHTML(isAr) {
      if (!this.messages.length) {
        return `<div class="sr-chat-empty">${isAr ? 'لا توجد رسائل بعد. شجع زملاءك في وقت الاستراحة! 🌱' : 'No messages yet. Say hello during the break! 🌱'}</div>`;
      }
      const user = this._getCurrentUser();
      return this.messages.map(m => {
        const isMine = m.user_id === user.id;
        return `
          <div class="sr-chat-bubble-row ${isMine ? 'mine' : 'theirs'}">
            ${!isMine ? `<span class="sr-chat-sender">${this._esc(m.user_name)}</span>` : ''}
            <div class="sr-chat-bubble">${this._esc(m.message)}</div>
          </div>
        `;
      }).join('');
    },

    // ─── ACTIVE ROOM EVENT HANDLERS ────────────────────────────────────────
    _bindActiveRoomEvents(container, isAr) {
      const room = this.currentRoom;
      if (!room) return;

      // Back to browse (keeps room active in floating widget!)
      container.querySelector('#sr-room-back-btn')?.addEventListener('click', () => {
        window.history.replaceState(null, '', '#/study-rooms');
        this.view = 'discovery';
        this._renderDiscoveryPage(container, isAr);
        this._updateGlobalFloatingWidget();
      });

      // Leave Room completely
      container.querySelector('#sr-room-leave-btn')?.addEventListener('click', async () => {
        await this._leaveCurrentRoom(container, isAr);
      });

      // Invite button
      container.querySelector('#sr-room-invite-btn')?.addEventListener('click', () => {
        this._openInviteModal(room, isAr);
      });

      // Quick copy code chip
      container.querySelector('#sr-quick-copy-code')?.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(room.invitation_code);
          window.Toast?.show(isAr ? `تم نسخ الكود: ${room.invitation_code}` : `Code copied: ${room.invitation_code}`, 'success');
        } catch (e) {}
      });

      // Host management dropdown (Panel 11/13)
      const hostTrigger = container.querySelector('#sr-host-menu-trigger');
      const hostDropdown = container.querySelector('#sr-host-dropdown');
      if (hostTrigger && hostDropdown) {
        hostTrigger.addEventListener('click', (e) => {
          e.stopPropagation();
          hostDropdown.style.display = hostDropdown.style.display === 'none' ? 'flex' : 'none';
        });
        document.addEventListener('click', () => {
          if (hostDropdown) hostDropdown.style.display = 'none';
        }, { once: true });

        hostDropdown.querySelectorAll('.sr-hd-item').forEach(btn => {
          btn.addEventListener('click', async () => {
            hostDropdown.style.display = 'none';
            const cmd = btn.getAttribute('data-host-cmd');
            if (cmd === 'start') {
              await this._hostTransitionRoom('start', container, isAr);
            } else if (cmd === 'edit') {
              this._openCreateRoomModal(container, isAr, this.currentRoom);
            } else if (cmd === 'invite') {
              this._openInviteModal(this.currentRoom, isAr);
            } else if (cmd === 'transfer') {
              this._openTransferHostModal(container, isAr);
            } else if (cmd === 'end_early') {
              await this._hostTransitionRoom('complete', container, isAr);
            } else if (cmd === 'close_room') {
              await this._hostCloseRoom(container, isAr);
            }
          });
        });
      }

      // Stage Controls
      container.querySelector('#sr-stage-start-btn')?.addEventListener('click', async () => {
        await this._hostTransitionRoom('start', container, isAr);
      });

      container.querySelector('#sr-host-next-phase-btn')?.addEventListener('click', async () => {
        await this._hostTransitionRoom('next_phase', container, isAr);
      });

      // Personal Pause / Resume
      container.querySelector('#sr-personal-pause-btn')?.addEventListener('click', async () => {
        await this._togglePersonalPause(container, isAr);
      });

      // Skip Break For Me Only (Panel 7 & 8)
      container.querySelector('#sr-skip-break-personal-btn')?.addEventListener('click', () => {
        if (!this.membership) return;
        this.membership.skip_break_override = true;
        this.membership.status = 'focusing';
        this._saveParticipantRecord(this.membership);
        this._renderActiveRoomPage(container, isAr);
        window.Toast?.show(isAr ? 'تم تخطي الاستراحة لك فقط — مؤقتك الشخصي يحسب وقت التركيز الآن! 💪' : 'Break skipped for you — personal focus timer active! 💪', 'success');
      });

      container.querySelector('#sr-rejoin-break-btn')?.addEventListener('click', () => {
        if (!this.membership) return;
        this.membership.skip_break_override = false;
        this.membership.status = 'on_break';
        this._saveParticipantRecord(this.membership);
        this._renderActiveRoomPage(container, isAr);
      });

      // Edit Personal Goal
      container.querySelector('#sr-edit-my-goal-btn')?.addEventListener('click', () => {
        this._openPersonalGoalModal(container, isAr);
      });

      // Ambient Sounds (Panel 15)
      container.querySelectorAll('#sr-sounds-grid .sr-sound-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          const soundId = btn.getAttribute('data-sound-id');
          const active = AmbientAudioEngine.toggle(soundId);
          container.querySelectorAll('#sr-sounds-grid .sr-sound-pill').forEach(b => {
            const id = b.getAttribute('data-sound-id');
            const isNowPlaying = active === id;
            b.classList.toggle('playing', isNowPlaying);
            const icon = b.querySelector('.sr-sound-play-icon i');
            if (icon) icon.setAttribute('data-lucide', isNowPlaying ? 'pause' : 'play');
          });
          if (window.lucide) window.lucide.createIcons();
        });
      });

      container.querySelector('#sr-ambient-volume')?.addEventListener('input', (e) => {
        AmbientAudioEngine.setVolume(e.target.value);
      });

      // Chat form
      const chatForm = container.querySelector('#sr-chat-form');
      const chatInput = container.querySelector('#sr-chat-input');
      const sendChat = () => {
        const text = (chatInput?.value || '').trim();
        if (!text) return;
        chatInput.value = '';
        this._postChatMessage(text, container, isAr);
      };
      chatForm?.addEventListener('submit', (e) => { e.preventDefault(); sendChat(); });
      container.querySelector('#sr-chat-send-btn')?.addEventListener('click', sendChat);
    },

    // ========================================================================
    // 7. AUTHORITATIVE TIMER SYNCHRONIZATION & HOST TRANSITIONS
    // ========================================================================
    async _hostTransitionRoom(action, container, isAr) {
      const room = this.currentRoom;
      const user = this._getCurrentUser();
      if (!room || room.host_user_id !== user.id) {
        window.Toast?.show(isAr ? 'فقط مضيف الغرفة يمكنه التحكم في المؤقت المشترك' : 'Only the room host can control the shared timer', 'warning');
        return;
      }

      const now = Date.now();
      const nowIso = new Date(now).toISOString();
      let updated = { ...room, updated_at: nowIso };

      if (action === 'start') {
        const dur = room.focus_duration_seconds || 1500;
        updated.status = 'active';
        updated.phase = 'focus';
        updated.current_round = Math.max(1, room.current_round || 1);
        updated.started_at = nowIso;
        updated.ends_at = new Date(now + dur * 1000).toISOString();
        updated.paused_remaining_seconds = null;
      } else if (action === 'next_phase') {
        if (room.phase === 'focus') {
          const curRound = room.current_round || 1;
          const totalRounds = room.total_rounds || 3;
          if (curRound >= totalRounds) {
            updated.status = 'completed';
            updated.phase = 'completed';
            updated.ends_at = null;
          } else {
            const isLong = curRound % (room.rounds_before_long || 4) === 0;
            const breakSec = isLong ? (room.long_break_seconds || 900) : (room.short_break_seconds || 300);
            updated.phase = isLong ? 'long_break' : 'short_break';
            updated.status = 'active';
            updated.started_at = nowIso;
            updated.ends_at = new Date(now + breakSec * 1000).toISOString();
          }
        } else {
          // Break -> Next Focus Round
          const dur = room.focus_duration_seconds || 1500;
          updated.phase = 'focus';
          updated.status = 'active';
          updated.current_round = (room.current_round || 1) + 1;
          updated.started_at = nowIso;
          updated.ends_at = new Date(now + dur * 1000).toISOString();
          if (this.membership) {
            this.membership.skip_break_override = false;
            this.membership.status = 'focusing';
            this._saveParticipantRecord(this.membership);
          }
        }
      } else if (action === 'complete') {
        updated.status = 'completed';
        updated.phase = 'completed';
        updated.ends_at = null;
      }

      this.currentRoom = updated;
      await this._saveRoomState(updated);

      if (this.view === 'room') {
        this._renderActiveRoomPage(container, isAr);
      }
      this._updateGlobalFloatingWidget();

      if (updated.phase === 'completed') {
        this._recordCompletedSessionAndShowSummary(updated, isAr);
      }
    },

    async _togglePersonalPause(container, isAr) {
      if (!this.membership) return;
      const isPaused = this.membership.status === 'paused';
      this.membership.status = isPaused ? 'focusing' : 'paused';
      this._saveParticipantRecord(this.membership);

      if (this.view === 'room') {
        this._renderActiveRoomPage(container, isAr);
      }
      this._updateGlobalFloatingWidget();
    },

    _startGlobalTicker() {
      if (this._rafId) cancelAnimationFrame(this._rafId);
      this._lastPersonalTickMs = Date.now();

      const loop = () => {
        const now = Date.now();
        if (now - this._lastPersonalTickMs >= 1000) {
          const deltaSec = Math.max(1, Math.round((now - this._lastPersonalTickMs) / 1000));
          this._lastPersonalTickMs = now;
          this._onSecondTick(deltaSec);
        }
        this._rafId = requestAnimationFrame(loop);
      };
      this._rafId = requestAnimationFrame(loop);
    },

    _onSecondTick(deltaSec) {
      const room = this.currentRoom;
      if (!room || room.status === 'closed') return;

      const isAr = this._isAr();
      const user = this._getCurrentUser();
      const isHost = room.host_user_id === user.id;

      // 1. Check if scheduled waiting room reached start time
      if (room.phase === 'waiting' && room.scheduled_start_at) {
        const diff = new Date(room.scheduled_start_at).getTime() - Date.now();
        if (diff <= 0 && isHost) {
          const container = document.getElementById('app');
          this._hostTransitionRoom('start', container, isAr);
          return;
        }
      }

      // 2. Check if active Focus/Break phase countdown reached 00:00
      if ((room.phase === 'focus' || room.phase === 'short_break' || room.phase === 'long_break') && room.ends_at) {
        const remMs = new Date(room.ends_at).getTime() - Date.now();
        if (remMs <= 0 && isHost) {
          const container = document.getElementById('app');
          this._hostTransitionRoom('next_phase', container, isAr);
          return;
        }
      }

      // 3. Increment Personal Focus Seconds if actively studying
      const isBreak = room.phase === 'short_break' || room.phase === 'long_break';
      const isStudying = (room.phase === 'focus' || (isBreak && this.membership?.skip_break_override)) &&
                         this.membership?.status !== 'paused';

      if (isStudying && this.membership) {
        this.membership.focus_seconds_earned = (this.membership.focus_seconds_earned || 0) + deltaSec;
        this.membership.status = 'focusing';
        // Save locally every second, sync to DB every 15s
        this._saveParticipantRecordLocalOnly(this.membership);
        if (this.membership.focus_seconds_earned % 15 === 0) {
          this._syncParticipantToRemote(this.membership);
        }
      }

      // 4. Update DOM countdown & ring & floating widget
      this._refreshActiveRoomDOM();
      this._updateGlobalFloatingWidget();
    },

    _refreshActiveRoomDOM() {
      const room = this.currentRoom;
      if (!room || this.view !== 'room') return;

      const countdownEl = document.getElementById('sr-stage-countdown');
      if (countdownEl) {
        if (room.phase === 'waiting' && room.scheduled_start_at) {
          countdownEl.textContent = this._formatUntilTimestamp(room.scheduled_start_at);
        } else {
          countdownEl.textContent = this._formatCountdown(room);
        }
      }

      const ringFill = document.getElementById('sr-stage-ring-fill');
      if (ringFill) {
        ringFill.setAttribute('stroke-dashoffset', String(this._calcRingDashoffset(room, 628)));
      }

      const myTimeCell = document.querySelector(`[data-participant-time="${this._getCurrentUser().id}"]`);
      if (myTimeCell && this.membership) {
        myTimeCell.textContent = this._formatHMS(this.membership.focus_seconds_earned || 0);
      }
    },

    // ========================================================================
    // 8. GLOBAL FLOATING TIMER WIDGET (Panel 10 - المؤقت العائم في كل الموقع)
    // ========================================================================
    _updateGlobalFloatingWidget() {
      let widget = document.getElementById('kf-global-study-timer');
      const room = this.currentRoom;
      const onRoomScreen = window.location.hash.includes('study-rooms') && this.view === 'room';

      // Show widget if user has an active room AND is either on another page or minimized
      if (!room || room.status === 'closed' || room.phase === 'completed' || onRoomScreen) {
        if (widget) widget.style.display = 'none';
        return;
      }

      const isAr = this._isAr();
      const isHidden = sessionStorage.getItem(STORAGE_KEYS.FLOATING_HIDDEN) === '1';
      const isPaused = this.membership?.status === 'paused';
      const countdown = this._formatCountdown(room);
      const phaseText = this._getPhaseBadgeText(room, isAr);

      if (!widget) {
        widget = document.createElement('div');
        widget.id = 'kf-global-study-timer';
        widget.className = 'sr-floating-widget';
        document.body.appendChild(widget);
      }

      widget.style.display = 'block';
      widget.setAttribute('dir', isAr ? 'rtl' : 'ltr');

      if (isHidden) {
        widget.innerHTML = `
          <button type="button" class="sr-fw-minimized-pill" id="sr-fw-restore-btn" title="${isAr ? 'إظهار مؤقت الغرفة' : 'Show Room Timer'}">
            <span class="sr-live-pulse"></span>
            <span class="sr-tabular">${countdown}</span>
          </button>
        `;
        widget.querySelector('#sr-fw-restore-btn')?.addEventListener('click', () => {
          sessionStorage.removeItem(STORAGE_KEYS.FLOATING_HIDDEN);
          this._updateGlobalFloatingWidget();
        });
        return;
      }

      // Only rebuild full structure if not already mounted, otherwise update text in-place for 60fps
      if (!widget.querySelector('.sr-fw-bar')) {
        widget.innerHTML = `
          <div class="sr-fw-bar">
            <button type="button" class="sr-fw-expand-btn" id="sr-fw-menu-btn" title="${isAr ? 'خيارات المؤقت' : 'Timer Options'}">
              <i data-lucide="chevron-down"></i>
            </button>
            <div class="sr-fw-info" id="sr-fw-go-room">
              <div class="sr-fw-name" id="sr-fw-name"></div>
              <div class="sr-fw-meta">
                <span class="sr-fw-countdown sr-tabular" id="sr-fw-countdown"></span>
                <span class="sr-fw-status" id="sr-fw-status"></span>
              </div>
            </div>
            <button type="button" class="sr-fw-pause-btn" id="sr-fw-pause-btn">
              <i data-lucide="${isPaused ? 'play' : 'pause'}"></i>
            </button>
          </div>
          <div class="sr-fw-dropdown" id="sr-fw-dropdown" style="display:${this._floatingMenuOpen ? 'flex' : 'none'}">
            <button type="button" class="sr-fw-item" id="sr-fw-open-room">
              <i data-lucide="external-link"></i>
              <span>${isAr ? 'فتح الغرفة' : 'Open Room'}</span>
            </button>
            <button type="button" class="sr-fw-item" id="sr-fw-hide-timer">
              <i data-lucide="eye-off"></i>
              <span>${isAr ? 'إخفاء المؤقت' : 'Hide Timer'}</span>
            </button>
            <button type="button" class="sr-fw-item danger" id="sr-fw-leave-room">
              <i data-lucide="trash-2"></i>
              <span>${isAr ? 'مغادرة الغرفة' : 'Leave Room'}</span>
            </button>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();

        widget.querySelector('#sr-fw-menu-btn')?.addEventListener('click', (e) => {
          e.stopPropagation();
          this._floatingMenuOpen = !this._floatingMenuOpen;
          const dd = widget.querySelector('#sr-fw-dropdown');
          if (dd) dd.style.display = this._floatingMenuOpen ? 'flex' : 'none';
        });

        widget.querySelector('#sr-fw-go-room')?.addEventListener('click', () => {
          window.location.hash = `#/study-rooms?room=${this.currentRoom.id}`;
        });

        widget.querySelector('#sr-fw-open-room')?.addEventListener('click', () => {
          this._floatingMenuOpen = false;
          window.location.hash = `#/study-rooms?room=${this.currentRoom.id}`;
        });

        widget.querySelector('#sr-fw-hide-timer')?.addEventListener('click', () => {
          this._floatingMenuOpen = false;
          sessionStorage.setItem(STORAGE_KEYS.FLOATING_HIDDEN, '1');
          this._updateGlobalFloatingWidget();
        });

        widget.querySelector('#sr-fw-leave-room')?.addEventListener('click', async () => {
          this._floatingMenuOpen = false;
          await this._leaveCurrentRoom(document.getElementById('app'), this._isAr());
        });

        widget.querySelector('#sr-fw-pause-btn')?.addEventListener('click', async (e) => {
          e.stopPropagation();
          await this._togglePersonalPause(document.getElementById('app'), this._isAr());
          widget.innerHTML = ''; // force icon refresh
          this._updateGlobalFloatingWidget();
        });
      }

      const nameEl = widget.querySelector('#sr-fw-name');
      const countEl = widget.querySelector('#sr-fw-countdown');
      const statusEl = widget.querySelector('#sr-fw-status');
      if (nameEl) nameEl.textContent = room.name;
      if (countEl) countEl.textContent = countdown;
      if (statusEl) statusEl.textContent = isPaused ? (isAr ? 'متوقف مؤقتاً' : 'Paused') : phaseText;
    },

    // ========================================================================
    // 9. SESSION COMPLETION SUMMARY MODAL (Panels 11 & 14 - ملخص الجلسة)
    // ========================================================================
    _recordCompletedSessionAndShowSummary(room, isAr) {
      if (this._summaryShownForRoom === room.id) return;
      this._summaryShownForRoom = room.id;

      const user = this._getCurrentUser();
      const sorted = [...this.participants].sort((a, b) => (b.focus_seconds_earned || 0) - (a.focus_seconds_earned || 0));
      const myRank = Math.max(1, sorted.findIndex(p => p.user_id === user.id) + 1);
      const mySeconds = Math.max(60, this.membership?.focus_seconds_earned || (room.focus_duration_seconds || 1500));

      // Save to session history logs
      const logs = this._getSessionLogs();
      const logEntry = {
        id: this._uuid(),
        room_id: room.id,
        room_name: room.name,
        subject: room.subject || null,
        user_id: user.id,
        focus_seconds: mySeconds,
        total_room_seconds: room.total_session_seconds || 7200,
        rounds_completed: room.current_round || room.total_rounds || 1,
        rank_achieved: myRank,
        completed_at: new Date().toISOString()
      };
      logs.unshift(logEntry);
      localStorage.setItem(STORAGE_KEYS.SESSION_LOGS, JSON.stringify(logs.slice(0, 100)));

      // Sync to Supabase if available
      const sb = this._getClient();
      if (sb) {
        sb.from('study_session_logs').insert(logEntry).then(() => {}).catch(() => {});
      }

      this._closeAllModals();
      const backdrop = document.createElement('div');
      backdrop.className = 'sr-modal-backdrop';
      backdrop.innerHTML = `
        <div class="sr-modal sr-summary-modal" dir="${isAr ? 'rtl' : 'ltr'}" role="dialog" aria-modal="true">
          <div class="sr-summary-celebration">
            <div class="sr-summary-trophy">🏆</div>
            <h2>${isAr ? 'أحسنت! 🎉' : 'Great Job! 🎉'}</h2>
            <p>${isAr ? 'لقد أنهيت جلسة الدراسة بنجاح' : 'You have completed the study session successfully'}</p>
          </div>

          <div class="sr-summary-metrics-grid">
            <div class="sr-sm-box">
              <span class="sr-sm-label">${isAr ? 'ترتيبك' : 'Your Rank'}</span>
              <strong class="sr-sm-val highlight">#${myRank}</strong>
            </div>
            <div class="sr-sm-box">
              <span class="sr-sm-label">${isAr ? 'عدد الجولات' : 'Rounds'}</span>
              <strong class="sr-sm-val">${logEntry.rounds_completed}</strong>
            </div>
            <div class="sr-sm-box">
              <span class="sr-sm-label">${isAr ? 'وقت دراستك' : 'Your Study Time'}</span>
              <strong class="sr-sm-val sr-tabular">${this._formatHMS(mySeconds)}</strong>
            </div>
            <div class="sr-sm-box">
              <span class="sr-sm-label">${isAr ? 'المدة الإجمالية' : 'Total Duration'}</span>
              <strong class="sr-sm-val sr-tabular">${this._formatHMS(room.total_session_seconds || 7200)}</strong>
            </div>
          </div>

          <div class="sr-summary-lb-preview">
            <h4>${isAr ? 'ترتيب المشاركين في الجلسة' : 'Session Leaderboard'}</h4>
            ${sorted.slice(0, 5).map((p, idx) => `
              <div class="sr-slb-row">
                <span><strong>#${idx + 1}</strong> ${this._esc(p.user_name)}</span>
                <span class="sr-tabular">${this._formatHMS(p.focus_seconds_earned || 0)}</span>
              </div>
            `).join('')}
          </div>

          <div class="sr-modal-footer">
            <button type="button" class="sr-btn-secondary" id="sr-sum-view-stats">
              <i data-lucide="bar-chart-3"></i>
              <span>${isAr ? 'عرض سجل الجلسات والإحصائيات' : 'View Study Stats'}</span>
            </button>
            <button type="button" class="sr-btn-primary" id="sr-sum-home-btn">
              <span>${isAr ? 'العودة إلى غرف الدراسة' : 'Back to Study Rooms'}</span>
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(backdrop);
      if (window.lucide) window.lucide.createIcons();

      backdrop.querySelector('#sr-sum-view-stats')?.addEventListener('click', () => {
        backdrop.remove();
        this.view = 'stats';
        this._renderStatsPage(document.getElementById('app'), isAr);
      });

      backdrop.querySelector('#sr-sum-home-btn')?.addEventListener('click', async () => {
        backdrop.remove();
        await this._leaveCurrentRoom(document.getElementById('app'), isAr);
      });
    },

    // ========================================================================
    // 10. STUDENT STATS & SESSION LOG PAGE (Panels 12 & 13 - إحصائيات الطالب)
    // ========================================================================
    _renderStatsPage(container, isAr) {
      const logs = this._getSessionLogs();
      const totalSessions = logs.length;
      const totalSeconds = logs.reduce((acc, l) => acc + (l.focus_seconds || 0), 0);
      const avgSeconds = totalSessions > 0 ? Math.round(totalSeconds / totalSessions) : 0;

      const totalHours = Math.floor(totalSeconds / 3600);
      const totalMins = Math.floor((totalSeconds % 3600) / 60);

      // Compute 7-day bar chart (Sat -> Fri) strictly from real user logs
      const dayLabelsAr = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
      const dayLabelsEn = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
      const dayBuckets = [0, 0, 0, 0, 0, 0, 0];
      logs.forEach((l) => {
        const dt = l.completed_at ? new Date(l.completed_at) : new Date();
        // JS getDay(): 0=Sun..6=Sat -> map Sat=0, Sun=1, Mon=2, Tue=3, Wed=4, Thu=5, Fri=6
        const idx = (dt.getDay() + 1) % 7;
        dayBuckets[idx] = Math.min(12, +(dayBuckets[idx] + (l.focus_seconds || 0) / 3600).toFixed(1));
      });
      const maxBucket = Math.max(2, ...dayBuckets);
      const todayIdx = (new Date().getDay() + 1) % 7;

      container.innerHTML = `
        <section class="sr-page" dir="${isAr ? 'rtl' : 'ltr'}">
          <header class="sr-hero-header">
            <div class="sr-hero-brand">
              <button type="button" class="sr-btn-icon-back" id="sr-stats-back-btn">
                <i data-lucide="arrow-${isAr ? 'right' : 'left'}"></i>
              </button>
              <div class="sr-hero-titles">
                <span class="sr-hero-kicker">📊 ${isAr ? 'متابعة تقدمك الدراسي' : 'STUDY PROGRESS ANALYTICS'}</span>
                <h1 class="sr-hero-title">${isAr ? 'سجل الجلسات وإحصائيات الطالب' : 'Session History & Student Stats'}</h1>
                <p class="sr-hero-subtitle">${isAr ? 'تابع ساعات تركيزك الأسبوعية والشهرية وسجل الغرف التي شاركت بها' : 'Track your weekly study hours and completed collaborative sessions'}</p>
              </div>
            </div>
          </header>

          <div class="sr-stats-layout">
            <!-- Left: Analytics & Weekly Bar Chart (Panel 13) -->
            <div class="sr-stats-main-card">
              <div class="sr-stats-top-row">
                <h3>${isAr ? 'إحصائياتك الدراسية' : 'Your Study Statistics'}</h3>
                <div class="sr-segmented-tabs sm" id="sr-stats-range-tabs">
                  <button type="button" class="sr-seg-tab ${this.statsRange === 'weekly' ? 'active' : ''}" data-range="weekly">${isAr ? 'أسبوعي' : 'Weekly'}</button>
                  <button type="button" class="sr-seg-tab ${this.statsRange === 'monthly' ? 'active' : ''}" data-range="monthly">${isAr ? 'شهري' : 'Monthly'}</button>
                  <button type="button" class="sr-seg-tab ${this.statsRange === 'all' ? 'active' : ''}" data-range="all">${isAr ? 'الكل' : 'All Time'}</button>
                </div>
              </div>

              <div class="sr-stats-kpi-grid">
                <div class="sr-kpi-card">
                  <strong class="sr-tabular">${totalSessions}</strong>
                  <span>${isAr ? 'جلسة مكتملة' : 'Completed Sessions'}</span>
                </div>
                <div class="sr-kpi-card">
                  <strong class="sr-tabular">${totalHours} ${isAr ? 'ساعة' : 'h'} ${totalMins} ${isAr ? 'د' : 'm'}</strong>
                  <span>${isAr ? 'إجمالي وقت الدراسة' : 'Total Study Time'}</span>
                </div>
                <div class="sr-kpi-card">
                  <strong class="sr-tabular">${totalSessions > 0 ? Math.round(avgSeconds / 60) : 0} ${isAr ? 'دقيقة' : 'min'}</strong>
                  <span>${isAr ? 'متوسط الجلسة' : 'Average Session'}</span>
                </div>
              </div>

              <!-- 7-Day Bar Chart -->
              <div class="sr-chart-box">
                <div class="sr-chart-bars">
                  ${dayBuckets.map((hrs, idx) => {
                    const heightPct = hrs > 0 ? Math.max(12, Math.round((hrs / maxBucket) * 100)) : 4;
                    const hInt = Math.floor(hrs);
                    const mInt = Math.round((hrs - hInt) * 60);
                    const label = `${hInt}:${String(mInt).padStart(2, '0')}`;
                    return `
                      <div class="sr-chart-col ${idx === todayIdx ? 'highlight' : ''}">
                        <span class="sr-chart-tooltip sr-tabular">${label}</span>
                        <div class="sr-chart-bar-track">
                          <div class="sr-chart-bar-fill" style="height:${heightPct}%"></div>
                        </div>
                        <span class="sr-chart-day">${isAr ? dayLabelsAr[idx] : dayLabelsEn[idx]}</span>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            </div>

            <!-- Right: Session History Log (Panel 12 - سجل الجلسات) -->
            <div class="sr-history-log-card">
              <div class="sr-lb-header">
                <h3>
                  <i data-lucide="history"></i>
                  <span>${isAr ? 'سجل الجلسات' : 'Sessions Log'}</span>
                </h3>
              </div>

              <div class="sr-history-list">
                ${logs.length === 0 ? `
                  <div class="sr-empty-state" style="padding:28px 16px;">
                    <p style="margin:0;color:var(--text-muted,#796F70);font-size:13px;">
                      ${isAr ? 'لا توجد جلسات مكتملة بعد. انضم إلى غرفة دراسة أو أنشئ غرفتك للبدء.' : 'No completed sessions yet. Join or create a study room to start tracking.'}
                    </p>
                  </div>
                ` : logs.map(l => {
                  const dateStr = new Date(l.completed_at).toLocaleDateString('en-GB');
                  return `
                    <div class="sr-history-item">
                      <div class="sr-history-icon">🍅</div>
                      <div class="sr-history-info">
                        <strong>${this._esc(l.room_name)}</strong>
                        <span>${this._formatHMS(l.focus_seconds)} · ${dateStr}</span>
                      </div>
                      <span class="sr-history-rank">#${l.rank_achieved || 1}</span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        </section>
      `;

      if (window.lucide) window.lucide.createIcons();

      container.querySelector('#sr-stats-back-btn')?.addEventListener('click', () => {
        this.view = 'discovery';
        this._renderDiscoveryPage(container, isAr);
      });

      container.querySelectorAll('#sr-stats-range-tabs .sr-seg-tab').forEach(btn => {
        btn.addEventListener('click', () => {
          this.statsRange = btn.getAttribute('data-range');
          this._renderStatsPage(container, isAr);
        });
      });
    },

    // ========================================================================
    // 11. HOST TRANSFER & GOAL MODALS
    // ========================================================================
    _openPersonalGoalModal(container, isAr) {
      this._closeAllModals();
      const currentGoal = this.membership?.personal_goal || '';
      const subjects = (window.DATA && typeof window.DATA.getSubjects === 'function')
        ? window.DATA.getSubjects()
        : [];

      const backdrop = document.createElement('div');
      backdrop.className = 'sr-modal-backdrop';
      backdrop.innerHTML = `
        <div class="sr-modal sr-modal-sm" dir="${isAr ? 'rtl' : 'ltr'}" role="dialog" aria-modal="true">
          <div class="sr-modal-header">
            <h2 class="sr-modal-title"><i data-lucide="target"></i> <span>${isAr ? 'هدفي الدراسي في الجلسة' : 'My Study Goal'}</span></h2>
            <button type="button" class="sr-modal-close" id="sr-goal-close"><i data-lucide="x"></i></button>
          </div>
          <div class="sr-modal-body">
            <div class="sr-field-group">
              <label class="sr-field-label">${isAr ? 'ربط بمادة دراسية (اختياري)' : 'Link to Subject (Optional)'}</label>
              <select class="sr-select" id="sr-goal-subject">
                <option value="">${isAr ? 'بدون مادة محددة' : 'No specific subject'}</option>
                ${subjects.map(s => `<option value="${this._esc(s.name)}">${this._esc(s.name)}</option>`).join('')}
              </select>
            </div>
            <div class="sr-field-group">
              <label class="sr-field-label">${isAr ? 'ماذا تخطط لإنجازه؟' : 'What do you plan to accomplish?'}</label>
              <input type="text" class="sr-input" id="sr-goal-input" value="${this._esc(currentGoal)}"
                placeholder="${isAr ? 'مثال: إنهاء الشيت الثالث + حل 30 سؤال' : 'e.g. Finish Sheet 3 + 30 MCQs'}" maxlength="100" />
            </div>
          </div>
          <div class="sr-modal-footer">
            <button type="button" class="sr-btn-cancel" id="sr-goal-cancel">${isAr ? 'إلغاء' : 'Cancel'}</button>
            <button type="button" class="sr-btn-primary" id="sr-goal-save">${isAr ? 'حفظ الهدف' : 'Save Goal'}</button>
          </div>
        </div>
      `;
      document.body.appendChild(backdrop);
      if (window.lucide) window.lucide.createIcons();

      const close = () => backdrop.remove();
      backdrop.querySelector('#sr-goal-close')?.addEventListener('click', close);
      backdrop.querySelector('#sr-goal-cancel')?.addEventListener('click', close);

      backdrop.querySelector('#sr-goal-save')?.addEventListener('click', () => {
        const subj = backdrop.querySelector('#sr-goal-subject')?.value;
        const text = (backdrop.querySelector('#sr-goal-input')?.value || '').trim();
        const combined = subj && text ? `${subj}: ${text}` : (text || subj || '');
        if (this.membership) {
          this.membership.personal_goal = combined;
          this._saveParticipantRecord(this.membership);
        }
        close();
        this._renderActiveRoomPage(container, isAr);
      });
    },

    _openTransferHostModal(container, isAr) {
      this._closeAllModals();
      const user = this._getCurrentUser();
      const others = this.participants.filter(p => p.user_id !== user.id);

      const backdrop = document.createElement('div');
      backdrop.className = 'sr-modal-backdrop';
      backdrop.innerHTML = `
        <div class="sr-modal sr-modal-sm" dir="${isAr ? 'rtl' : 'ltr'}" role="dialog" aria-modal="true">
          <div class="sr-modal-header">
            <h2 class="sr-modal-title"><i data-lucide="user-check"></i> <span>${isAr ? 'نقل صلاحيات المضيف' : 'Transfer Host Role'}</span></h2>
            <button type="button" class="sr-modal-close" id="sr-th-close"><i data-lucide="x"></i></button>
          </div>
          <div class="sr-modal-body">
            ${others.length === 0 ? `<p class="sr-field-hint">${isAr ? 'لا يوجد مشاركون آخرون في الغرفة حالياً.' : 'No other participants in the room right now.'}</p>` : `
              <div class="sr-transfer-list">
                ${others.map(p => `
                  <button type="button" class="sr-transfer-item" data-uid="${p.user_id}" data-uname="${this._esc(p.user_name)}">
                    <span>${this._esc(p.user_name)}</span>
                    <i data-lucide="crown"></i>
                  </button>
                `).join('')}
              </div>
            `}
          </div>
        </div>
      `;
      document.body.appendChild(backdrop);
      if (window.lucide) window.lucide.createIcons();

      backdrop.querySelector('#sr-th-close')?.addEventListener('click', () => backdrop.remove());
      backdrop.querySelectorAll('.sr-transfer-item').forEach(btn => {
        btn.addEventListener('click', async () => {
          const newHostId = btn.getAttribute('data-uid');
          const newHostName = btn.getAttribute('data-uname');
          if (this.currentRoom && newHostId) {
            this.currentRoom.host_user_id = newHostId;
            this.currentRoom.host_name = newHostName;
            await this._saveRoomState(this.currentRoom);
            backdrop.remove();
            this._renderActiveRoomPage(container, isAr);
            window.Toast?.show(isAr ? `تم نقل صلاحيات المضيف إلى ${newHostName}` : `Host role transferred to ${newHostName}`, 'success');
          }
        });
      });
    },

    async _hostCloseRoom(container, isAr) {
      if (!this.currentRoom) return;
      this.currentRoom.status = 'closed';
      await this._saveRoomState(this.currentRoom);
      await this._leaveCurrentRoom(container, isAr);
      window.Toast?.show(isAr ? 'تم إغلاق الغرفة' : 'Room closed', 'info');
    },

    async _leaveCurrentRoom(container, isAr) {
      AmbientAudioEngine.stop();
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_ROOM_ID);
      sessionStorage.removeItem(STORAGE_KEYS.FLOATING_HIDDEN);

      if (this._roomChannel) {
        const sb = this._getClient();
        try { sb?.removeChannel(this._roomChannel); } catch (e) {}
        this._roomChannel = null;
      }

      this.currentRoom = null;
      this.membership = null;
      this.view = 'discovery';
      this._updateGlobalFloatingWidget();

      if (window.location.hash.startsWith('#/study-rooms')) {
        window.history.replaceState(null, '', '#/study-rooms');
        await this._renderDiscoveryPage(container, isAr);
      }
    },

    // ========================================================================
    // 12. DUAL-LAYER PERSISTENCE & SUPABASE REALTIME SYNC
    // ========================================================================
    _isDemoRoom(room) {
      if (!room) return false;
      const demoIds = new Set(['room-evening-focus', 'room-calm-study', 'room-night-focus']);
      if (demoIds.has(room.id)) return true;
      if (typeof room.host_user_id === 'string' && room.host_user_id.startsWith('starter-host-')) return true;
      return false;
    },

    _purgeDemoRooms() {
      const demoRoomIds = ['room-evening-focus', 'room-calm-study', 'room-night-focus'];
      const demoLogIds = new Set(['log-1', 'log-2', 'log-3']);

      // 1. Purge demo rooms from localStorage
      try {
        const existingRooms = this._getLocalRooms();
        const cleanedRooms = existingRooms.filter(r => !this._isDemoRoom(r));
        if (cleanedRooms.length !== existingRooms.length) {
          this._setLocalRooms(cleanedRooms);
        }
      } catch (e) {}

      // 2. If active room was one of the demo rooms, clear it
      try {
        const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_ROOM_ID);
        if (activeId && demoRoomIds.includes(activeId)) {
          localStorage.removeItem(STORAGE_KEYS.ACTIVE_ROOM_ID);
        }
      } catch (e) {}

      // 3. Purge demo participants from localStorage
      try {
        const allParticipants = JSON.parse(localStorage.getItem(STORAGE_KEYS.PARTICIPANTS) || '{}');
        let changed = false;
        demoRoomIds.forEach(id => {
          if (allParticipants[id]) {
            delete allParticipants[id];
            changed = true;
          }
        });
        if (changed) {
          localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(allParticipants));
        }
      } catch (e) {}

      // 4. Purge demo session logs from localStorage
      try {
        const rawLogs = localStorage.getItem(STORAGE_KEYS.SESSION_LOGS);
        if (rawLogs) {
          const parsedLogs = JSON.parse(rawLogs);
          if (Array.isArray(parsedLogs)) {
            const cleanedLogs = parsedLogs.filter(l => l && !demoLogIds.has(l.id));
            if (cleanedLogs.length !== parsedLogs.length) {
              localStorage.setItem(STORAGE_KEYS.SESSION_LOGS, JSON.stringify(cleanedLogs));
            }
          }
        }
      } catch (e) {}

      // 5. Purge demo rooms from Supabase if they were previously synced
      const sb = this._getClient();
      if (sb) {
        sb.from('study_rooms')
          .delete()
          .in('id', demoRoomIds)
          .then(() => {})
          .catch(() => {});
      }
    },

    _seedStarterRoomsIfEmpty() {
      this._purgeDemoRooms();
    },

    _getLocalRooms() {
      try {
        const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.ROOMS) || '[]');
        return Array.isArray(list) ? list.filter(r => !this._isDemoRoom(r)) : [];
      } catch (e) { return []; }
    },

    _setLocalRooms(rooms) {
      try {
        const cleaned = Array.isArray(rooms) ? rooms.filter(r => !this._isDemoRoom(r)) : [];
        localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(cleaned));
      } catch (e) {}
    },

    async _createNewRoomRecord(room) {
      const rooms = this._getLocalRooms();
      rooms.unshift(room);
      this._setLocalRooms(rooms);

      const sb = this._getClient();
      if (sb) {
        try {
          await sb.from('study_rooms').insert(room);
        } catch (e) {}
      }
      this._localBus?.postMessage({ type: 'ROOMS_LIST_CHANGED' });
    },

    async _saveRoomState(room) {
      const rooms = this._getLocalRooms();
      const idx = rooms.findIndex(r => r.id === room.id);
      if (idx >= 0) rooms[idx] = room;
      else rooms.unshift(room);
      this._setLocalRooms(rooms);

      const sb = this._getClient();
      if (sb) {
        try {
          await sb.from('study_rooms').upsert(room);
        } catch (e) {}
      }
      if (this._roomChannel) {
        try {
          this._roomChannel.send({ type: 'broadcast', event: 'room_state', payload: room });
        } catch (e) {}
      }
      this._localBus?.postMessage({ type: 'ROOM_UPDATED', room });
    },

    async _fetchRoomById(roomId) {
      if (['room-evening-focus', 'room-calm-study', 'room-night-focus'].includes(roomId)) {
        return null;
      }
      const sb = this._getClient();
      if (sb) {
        try {
          const { data, error } = await sb.from('study_rooms').select('*').eq('id', roomId).maybeSingle();
          if (!error && data && !this._isDemoRoom(data)) {
            const localRooms = this._getLocalRooms();
            const idx = localRooms.findIndex(r => r.id === data.id);
            if (idx >= 0) localRooms[idx] = data;
            else localRooms.unshift(data);
            this._setLocalRooms(localRooms);
            return data;
          }
        } catch (e) {}
      }
      return this._getLocalRooms().find(r => r.id === roomId) || null;
    },

    async _findRoomByCodeOrLink(rawInput) {
      let code = rawInput.trim();
      let extractedRoomId = null;

      if (code.includes('room=')) {
        const q = new URLSearchParams(code.split('?')[1] || '');
        extractedRoomId = q.get('room');
        if (q.get('code')) code = q.get('code');
      }
      code = code.replace(/\s+/g, '').toUpperCase();

      const rooms = this._getLocalRooms().filter(r => r.status !== 'closed');
      let match = rooms.find(r =>
        (extractedRoomId && r.id === extractedRoomId) ||
        (r.invitation_code && r.invitation_code.toUpperCase() === code)
      );
      if (match) return match;

      const sb = this._getClient();
      if (sb) {
        try {
          const { data } = await sb
            .from('study_rooms')
            .select('*')
            .eq('invitation_code', code)
            .neq('status', 'closed')
            .maybeSingle();
          if (data && !this._isDemoRoom(data)) return data;
        } catch (e) {}
      }
      return null;
    },

    async _syncRoomsFromRemote(container) {
      const sb = this._getClient();
      if (!sb) return;
      try {
        const { data, error } = await sb
          .from('study_rooms')
          .select('*')
          .neq('status', 'closed')
          .order('created_at', { ascending: false })
          .limit(30);

        if (!error && Array.isArray(data)) {
          const validRemote = data.filter(r => !this._isDemoRoom(r));
          const local = this._getLocalRooms();
          const map = new Map();
          local.forEach(r => map.set(r.id, r));
          validRemote.forEach(r => map.set(r.id, r));
          this._setLocalRooms(Array.from(map.values()));
          if (this.view === 'discovery') {
            this._renderDiscoveryCards(container);
          }
        }
      } catch (e) {}
    },

    _getRoomParticipants(roomId) {
      try {
        const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.PARTICIPANTS) || '{}');
        return all[roomId] || [];
      } catch (e) { return []; }
    },

    _ensureLocalMembership(room) {
      const user = this._getCurrentUser();
      const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.PARTICIPANTS) || '{}');
      const list = all[room.id] || [];
      let mine = list.find(p => p.user_id === user.id);

      if (!mine) {
        mine = {
          room_id: room.id,
          user_id: user.id,
          user_name: user.name,
          user_avatar: user.avatar,
          status: room.phase === 'waiting' ? 'ready' : (room.phase === 'focus' ? 'focusing' : 'on_break'),
          personal_goal: room.session_goal || '',
          skip_break_override: false,
          focus_seconds_earned: 0,
          is_online: true
        };
        list.push(mine);
        all[room.id] = list;
        localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(all));
      }
      return mine;
    },

    _saveParticipantRecordLocalOnly(member) {
      try {
        const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.PARTICIPANTS) || '{}');
        const list = all[member.room_id] || [];
        const idx = list.findIndex(p => p.user_id === member.user_id);
        if (idx >= 0) list[idx] = member;
        else list.push(member);
        all[member.room_id] = list;
        localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(all));
        this.participants = list;
      } catch (e) {}
    },

    _saveParticipantRecord(member) {
      this._saveParticipantRecordLocalOnly(member);
      this._syncParticipantToRemote(member);
      if (this._roomChannel) {
        try {
          this._roomChannel.send({ type: 'broadcast', event: 'participant_update', payload: member });
        } catch (e) {}
      }
    },

    _syncParticipantToRemote(member) {
      const sb = this._getClient();
      if (!sb) return;
      sb.from('room_participants').upsert(member, { onConflict: 'room_id,user_id' }).then(() => {}).catch(() => {});
    },

    _getRoomMessages(roomId) {
      try {
        const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '{}');
        return all[roomId] || [];
      } catch (e) { return []; }
    },

    _postChatMessage(text, container, isAr) {
      const room = this.currentRoom;
      if (!room) return;
      const user = this._getCurrentUser();
      const msg = {
        id: this._uuid(),
        room_id: room.id,
        user_id: user.id,
        user_name: user.name,
        message: text.slice(0, 280),
        created_at: new Date().toISOString()
      };

      const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '{}');
      const list = all[room.id] || [];
      list.push(msg);
      all[room.id] = list.slice(-80);
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(all));
      this.messages = all[room.id];

      const chatBox = container.querySelector('#sr-chat-messages');
      if (chatBox) {
        chatBox.innerHTML = this._buildChatMessagesHTML(isAr);
        chatBox.scrollTop = chatBox.scrollHeight;
      }

      if (this._roomChannel) {
        try {
          this._roomChannel.send({ type: 'broadcast', event: 'chat_msg', payload: msg });
        } catch (e) {}
      }
      const sb = this._getClient();
      if (sb) {
        sb.from('room_messages').insert(msg).then(() => {}).catch(() => {});
      }
    },

    _subscribeRoomRealtime(roomId, container) {
      const sb = this._getClient();
      if (!sb) return;

      if (this._roomChannel) {
        try { sb.removeChannel(this._roomChannel); } catch (e) {}
      }

      const user = this._getCurrentUser();
      this._roomChannel = sb.channel(`kuro-room-${roomId}`, {
        config: { broadcast: { self: false }, presence: { key: user.id } }
      });

      this._roomChannel
        .on('broadcast', { event: 'room_state' }, ({ payload }) => {
          if (!payload) return;
          this.currentRoom = { ...this.currentRoom, ...payload };
          this._saveRoomState(this.currentRoom);
          if (this.view === 'room') {
            this._renderActiveRoomPage(container, this._isAr());
          }
          if (this.currentRoom.phase === 'completed') {
            this._recordCompletedSessionAndShowSummary(this.currentRoom, this._isAr());
          }
        })
        .on('broadcast', { event: 'participant_update' }, ({ payload }) => {
          if (!payload) return;
          this._saveParticipantRecordLocalOnly(payload);
          const lbList = container.querySelector('#sr-lb-list');
          if (lbList) lbList.innerHTML = this._buildLeaderboardRowsHTML(this._isAr());
        })
        .on('broadcast', { event: 'chat_msg' }, ({ payload }) => {
          if (!payload) return;
          this.messages.push(payload);
          const chatBox = container.querySelector('#sr-chat-messages');
          if (chatBox) {
            chatBox.innerHTML = this._buildChatMessagesHTML(this._isAr());
            chatBox.scrollTop = chatBox.scrollHeight;
          }
        })
        .subscribe();
    },

    _getSessionLogs() {
      try {
        const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION_LOGS) || '[]');
        const demoLogIds = new Set(['log-1', 'log-2', 'log-3']);
        return Array.isArray(list) ? list.filter(l => l && !demoLogIds.has(l.id)) : [];
      } catch (e) { return []; }
    },

    // ========================================================================
    // 13. HELPERS & FORMATTING
    // ========================================================================
    _requireRegisteredStudent(isAr) {
      if (window.AUTH && window.AUTH.isGuest && window.AUTH.isGuest()) {
        if (typeof window.AUTH.showGuestRestrictionModal === 'function') {
          window.AUTH.showGuestRestrictionModal(isAr ? 'المشاركة في غرف الدراسة وحفظ سجل التركيز' : 'Study Rooms & Focus History');
        } else {
          window.Toast?.show(isAr ? 'يرجى تسجيل الدخول بحساب طالب للمشاركة في غرف الدراسة' : 'Please sign in with a student account to join Study Rooms', 'warning');
        }
        return false;
      }
      return true;
    },

    _getCurrentUser() {
      const authUser = window.AUTH && typeof window.AUTH.getUser === 'function' ? window.AUTH.getUser() : null;
      let stored = {};
      try { stored = JSON.parse(localStorage.getItem('kf_user_info') || '{}'); } catch (e) {}
      const rawAvatar = authUser?.avatar_url || stored?.avatar_url || stored?.avatar || null;
      const cleanAvatar = (rawAvatar && !String(rawAvatar).toLowerCase().includes('characters/kuro')) ? rawAvatar : null;
      return {
        id: authUser?.id || stored?.id || 'local-student-id',
        name: authUser?.full_name_ar || authUser?.full_name || stored?.full_name_ar || stored?.name || 'طالب طب الأسنان',
        avatar: cleanAvatar
      };
    },

    _getClient() {
      if (window.SupabaseAuth && typeof window.SupabaseAuth.getClient === 'function') {
        return window.SupabaseAuth.getClient();
      }
      return null;
    },

    _isAr() {
      return window.I18N ? window.I18N.getLang() === 'ar' : true;
    },

    _getPhaseBadgeText(room, isAr) {
      const phase = room?.phase || 'waiting';
      const mapAr = {
        waiting: 'قيد الانتظار',
        focus: 'يدرس الآن',
        short_break: 'في الاستراحة',
        long_break: 'استراحة طويلة',
        paused: 'متوقف مؤقتاً',
        completed: 'انتهت الجلسة'
      };
      const mapEn = {
        waiting: 'Waiting',
        focus: 'Studying Now',
        short_break: 'On Break',
        long_break: 'Long Break',
        paused: 'Paused',
        completed: 'Completed'
      };
      return (isAr ? mapAr : mapEn)[phase] || phase;
    },

    _formatCountdown(room) {
      if (!room) return '25:00';
      if (room.phase === 'waiting') {
        const mins = Math.round((room.focus_duration_seconds || 1500) / 60);
        return `${String(mins).padStart(2, '0')}:00`;
      }
      if (room.phase === 'paused' && room.paused_remaining_seconds != null) {
        return this._formatMMSS(room.paused_remaining_seconds);
      }
      if (!room.ends_at) return '00:00';
      const remSec = Math.max(0, Math.ceil((new Date(room.ends_at).getTime() - Date.now()) / 1000));
      return this._formatMMSS(remSec);
    },

    _formatUntilTimestamp(iso) {
      const remSec = Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 1000));
      return this._formatHMS(remSec);
    },

    _formatTotalSessionRemaining(room) {
      const totalRounds = Math.max(1, room.total_rounds || 3);
      const currentRound = Math.max(1, room.current_round || 1);
      const remRounds = Math.max(0, totalRounds - currentRound);
      const currentRemSec = room.ends_at ? Math.max(0, Math.ceil((new Date(room.ends_at).getTime() - Date.now()) / 1000)) : (room.focus_duration_seconds || 1500);
      const totalRemSec = currentRemSec + remRounds * ((room.focus_duration_seconds || 1500) + (room.short_break_seconds || 300));
      return this._formatHMS(totalRemSec);
    },

    _calcPhaseProgressPct(room) {
      if (!room || !room.ends_at) return 0;
      const total = room.phase === 'focus'
        ? (room.focus_duration_seconds || 1500)
        : (room.short_break_seconds || 300);
      const rem = Math.max(0, (new Date(room.ends_at).getTime() - Date.now()) / 1000);
      return Math.min(100, Math.max(4, Math.round(((total - rem) / total) * 100)));
    },

    _calcRingDashoffset(room, circumference) {
      if (!room || !room.ends_at) return 0;
      const total = room.phase === 'focus'
        ? (room.focus_duration_seconds || 1500)
        : (room.short_break_seconds || 300);
      const rem = Math.max(0, (new Date(room.ends_at).getTime() - Date.now()) / 1000);
      const fraction = Math.min(1, Math.max(0, rem / total));
      return Math.round(circumference * (1 - fraction));
    },

    _formatMMSS(sec) {
      const s = Math.max(0, Math.floor(sec));
      const m = Math.floor(s / 60);
      const r = s % 60;
      return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
    },

    _formatHMS(sec) {
      const s = Math.max(0, Math.floor(sec));
      const h = Math.floor(s / 3600);
      const m = Math.floor((s % 3600) / 60);
      const r = s % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
    },

    _getInitials(name) {
      if (!name) return 'K';
      return String(name).trim().charAt(0).toUpperCase();
    },

    _generateCode() {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let out = '';
      for (let i = 0; i < 5; i++) out += chars[Math.floor(Math.random() * chars.length)];
      return out;
    },

    _uuid() {
      if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
    },

    _closeAllModals() {
      document.querySelectorAll('.sr-modal-backdrop').forEach(el => el.remove());
    },

    _esc(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }
  };

  window.StudyRoomsPage = StudyRoomsPage;

  // Auto-init global floating widget when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => StudyRoomsPage.initGlobalLifecycle());
  } else {
    StudyRoomsPage.initGlobalLifecycle();
  }
})(window);
