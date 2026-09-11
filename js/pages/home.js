/**
 * KURO FANGS — LOCK-IN DASHBOARD
 * Modern Midnight Obsidian & Gold Academic Interface
 * Recreating the exact Lock-in UI from the user reference image
 */

const HomePage = {
  timerInterval: null,
  timerSeconds: 25 * 60,
  isTimerRunning: false,
  audioContext: null,
  noiseNode: null,

  render(container) {
    const lastSheet = window.STORE.getLastSheet() || {
      id: 'sh-1',
      title: 'Local Anesthesia Techniques & Landmarks',
      subject_name: 'جراحة الفم والفكين 1',
      doctor_name: 'د. يوسف التاجوري'
    };

    const recentSheets = window.DATA.getRecentSheets(4);
    const favsCount = window.STORE.getFavorites().length || 2;

    container.innerHTML = `
      <!-- ==========================================================================
           1. TOP METRICS BADGES ROW (4 Cards — Exact Lock-in layout)
           ========================================================================== -->
      <section class="lockin-metrics-row" aria-label="مؤشرات المذاكرة السريعة">
        <!-- Metric 1: Completed Materials -->
        <div class="metric-card">
          <div class="metric-left">
            <div class="metric-value-wrap">
              <span class="metric-num">1</span>
              <span class="badge badge-done">+ DONE</span>
            </div>
            <span class="metric-label">Completed materials</span>
          </div>
          <div class="metric-icon-circle">
            <i data-lucide="check-circle-2"></i>
          </div>
        </div>

        <!-- Metric 2: Saved Items -->
        <div class="metric-card">
          <div class="metric-left">
            <div class="metric-value-wrap">
              <span class="metric-num">${favsCount}</span>
              <span class="badge badge-saved">+ SAVED</span>
            </div>
            <span class="metric-label">Saved items</span>
          </div>
          <div class="metric-icon-circle">
            <i data-lucide="bookmark"></i>
          </div>
        </div>

        <!-- Metric 3: Review Bank to Review -->
        <div class="metric-card">
          <div class="metric-left">
            <div class="metric-value-wrap">
              <span class="metric-num">41</span>
              <span class="badge badge-due">+ DUE</span>
            </div>
            <span class="metric-label">Review Bank to review</span>
          </div>
          <div class="metric-icon-circle">
            <i data-lucide="help-circle"></i>
          </div>
        </div>

        <!-- Metric 4: Sessions Active Live -->
        <div class="metric-card">
          <div class="metric-left">
            <div class="metric-value-wrap">
              <span class="metric-num">107</span>
              <span class="badge badge-live">
                <span class="live-pulse-dot"></span>
                LIVE
              </span>
            </div>
            <span class="metric-label">Sessions active</span>
          </div>
          <div class="metric-icon-circle">
            <i data-lucide="zap"></i>
          </div>
        </div>
      </section>

      <!-- ==========================================================================
           2. MAIN DASHBOARD SPLIT (2 Columns)
           ========================================================================== -->
      <div class="lockin-main-split">
        <!-- Column 1: Continue Studying & Recent Sheets -->
        <div>
          <!-- Continue Studying Card -->
          <div class="continue-card">
            <div class="continue-tag">
              <i data-lucide="sparkles" style="width: 13px; height: 13px;"></i>
              CONTINUE STUDYING
            </div>
            <h2 class="continue-title">${lastSheet.title}</h2>
            <p class="continue-desc">
              ${lastSheet.subject_name ? `${lastSheet.subject_name} • ` : ''}
              Open a study sheet and it will appear here for quick return.
            </p>
            <a href="#/sheets" class="btn btn-gold">
              Browse materials
              <i data-lucide="arrow-left" style="width: 16px; height: 16px;"></i>
            </a>
          </div>

          <!-- Recent Sheets Card -->
          <div class="recent-sheets-card">
            <div class="recent-sheets-header">
              <div class="recent-sheets-title">
                <i data-lucide="clock-3" style="color: var(--brand-gold); width: 18px; height: 18px;"></i>
                Recent Sheets
              </div>
              <a href="#/sheets" style="font-size: 0.775rem; color: var(--brand-gold); font-weight: 600;">
                View all
              </a>
            </div>

            <div class="recent-sheets-list">
              ${recentSheets.map(s => `
                <a href="#/sheet/${s.id}" class="recent-sheet-item">
                  <div class="sheet-item-left">
                    <div class="sheet-item-icon">
                      <i data-lucide="file-text"></i>
                    </div>
                    <div class="sheet-item-text">
                      <h4>${s.title}</h4>
                      <p>${s.subject_name || 'طب الأسنان'} • ${s.doctor_name || 'هيئة التدريس'}</p>
                    </div>
                  </div>
                  <div class="sheet-item-arrow">
                    <i data-lucide="chevron-left" style="width: 16px; height: 16px;"></i>
                  </div>
                </a>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Column 2: Cozy Night Study Station Widget -->
        <div>
          <div class="study-station-card">
            <!-- Cozy Night Illustration (Desk, Lamp, Books, Moon & Kuroni Cat Mascot) -->
            <div class="station-illustration-stage">
              <svg class="station-svg-scene" viewBox="0 0 420 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <!-- Window Night Sky Gradient -->
                  <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#050811" />
                    <stop offset="100%" stop-color="#0B132B" />
                  </linearGradient>

                  <!-- Desk Lamp Warm Light Cone -->
                  <radialGradient id="lampGlow" cx="0.4" cy="0.1" r="0.8">
                    <stop offset="0%" stop-color="#FDE047" stop-opacity="0.35" />
                    <stop offset="40%" stop-color="#F59E0B" stop-opacity="0.15" />
                    <stop offset="100%" stop-color="#F59E0B" stop-opacity="0" />
                  </radialGradient>
                </defs>

                <!-- Room Wall Background -->
                <rect width="420" height="200" fill="#0A0F1D" />

                <!-- Window Frame Behind Desk -->
                <rect x="230" y="20" width="160" height="110" rx="8" fill="url(#skyGrad)" stroke="#1F293D" stroke-width="3" />
                <line x1="310" y1="20" x2="310" y2="130" stroke="#1F293D" stroke-width="2" />
                <line x1="230" y1="75" x2="390" y2="75" stroke="#1F293D" stroke-width="2" />

                <!-- Crescent Moon in Window -->
                <path d="M 350 42 A 12 12 0 1 0 362 54 A 10 10 0 1 1 350 42 Z" fill="#FEF08A" />
                <!-- Stars -->
                <circle cx="260" cy="45" r="1.2" fill="#FFFFFF" opacity="0.8" />
                <circle cx="285" cy="35" r="1" fill="#FFFFFF" opacity="0.6" />
                <circle cx="330" cy="65" r="1.5" fill="#FFFFFF" opacity="0.9" />
                <circle cx="295" cy="100" r="1" fill="#FFFFFF" opacity="0.7" />

                <!-- Wooden Study Desk Surface -->
                <rect x="20" y="140" width="380" height="50" rx="4" fill="#1C1814" stroke="#2D241E" stroke-width="2" />
                <line x1="20" y1="150" x2="400" y2="150" stroke="#14110E" stroke-width="2" />

                <!-- Desk Lamp (Left) -->
                <path d="M 60 140 L 70 85 L 105 75" stroke="#475569" stroke-width="4" stroke-linecap="round" fill="none" />
                <polygon points="95,65 125,75 105,95" fill="#F59E0B" />
                <!-- Glowing Light Cone from Lamp -->
                <polygon points="105,85 40,190 220,190" fill="url(#lampGlow)" />

                <!-- Stack of Dental Textbooks (Right) -->
                <!-- Book 1: Oral Pathology -->
                <rect x="300" y="125" width="80" height="15" rx="2" fill="#7C2D12" stroke="#9A3412" />
                <text x="310" y="136" font-size="7" fill="#FED7AA" font-family="sans-serif">Oral Pathology</text>
                <!-- Book 2: Fixed Pros -->
                <rect x="305" y="112" width="70" height="13" rx="2" fill="#1E3A8A" stroke="#2563EB" />
                <text x="312" y="122" font-size="6.5" fill="#BFDBFE" font-family="sans-serif">Fixed Pros</text>
                <!-- Book 3: Endo -->
                <rect x="310" y="101" width="60" height="11" rx="2" fill="#065F46" stroke="#059669" />

                <!-- Tooth Model with glowing Spark on Desk -->
                <path d="M 270 128 C 267 122, 273 118, 278 122 C 283 118, 289 122, 286 128 C 284 133, 282 138, 280 138 C 278 138, 274 133, 270 128 Z" fill="#E2E8F0" />
                <circle cx="282" cy="120" r="1.5" fill="#FDE047" />

                <!-- Kuroni (Cat Ninja / Dental Student Mascot) Studying at the Desk -->
                <g transform="translate(130, 80)">
                  <!-- Body & Hoodie -->
                  <path d="M 40 60 C 20 60, 15 80, 10 95 L 90 95 C 85 80, 80 60, 60 60 Z" fill="#1E293B" />
                  
                  <!-- Cat Head -->
                  <circle cx="50" cy="45" r="24" fill="#0F172A" />
                  <!-- Ears -->
                  <polygon points="30,32 25,10 42,24" fill="#0F172A" />
                  <polygon points="32,28 28,14 40,23" fill="#F43F5E" />
                  <polygon points="70,32 75,10 58,24" fill="#0F172A" />
                  <polygon points="68,28 72,14 60,23" fill="#F43F5E" />

                  <!-- Ninja Headband (Amber) -->
                  <path d="M 26 40 Q 50 35 74 40" stroke="#F59E0B" stroke-width="5" stroke-linecap="round" fill="none" />
                  <circle cx="50" cy="38" r="3.5" fill="#FEF08A" />
                  <circle cx="50" cy="38" r="1.5" fill="#080C14" />

                  <!-- Closed Focused Studying Eyes -->
                  <path d="M 38 48 Q 43 51 46 48" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" fill="none" />
                  <path d="M 54 48 Q 57 51 62 48" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" fill="none" />
                  <!-- Cute Nose -->
                  <polygon points="50,52 48,50 52,50" fill="#F43F5E" />

                  <!-- Open Notebook on Desk with Pen -->
                  <polygon points="20,95 48,90 48,105 18,105" fill="#F8FAFC" />
                  <polygon points="52,90 80,95 82,105 52,105" fill="#F1F5F9" />
                  <line x1="24" y1="95" x2="44" y2="93" stroke="#CBD5E1" stroke-width="1" />
                  <line x1="24" y1="99" x2="44" y2="97" stroke="#CBD5E1" stroke-width="1" />
                  <line x1="56" y1="93" x2="76" y2="95" stroke="#CBD5E1" stroke-width="1" />
                  <!-- Cat Paw holding pencil -->
                  <ellipse cx="48" cy="92" rx="4" ry="3" fill="#334155" />
                  <line x1="48" y1="92" x2="42" y2="84" stroke="#F59E0B" stroke-width="2" />
                </g>
              </svg>
            </div>

            <!-- Integrated Lock-in Focus Timer (Pomodoro) -->
            <div class="station-timer-box">
              <div class="timer-top-meta">
                <span class="timer-mode-tag">
                  <i data-lucide="flame" style="width: 14px; height: 14px;"></i>
                  LOCK-IN FOCUS MODE
                </span>
                <button id="btn-sound-toggle" class="timer-sound-toggle" title="صوت المطر الهادئ للتركيز">
                  <i data-lucide="headphones" style="width: 13px; height: 13px;"></i>
                  <span id="sound-label">Lofi Sound</span>
                </button>
              </div>

              <div class="timer-clock-display" id="focus-clock">25:00</div>

              <div class="timer-controls-row">
                <button id="btn-focus-start" class="timer-start-btn">
                  Start Lock-in
                </button>
                <button id="btn-focus-reset" class="timer-reset-btn">
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==========================================================================
           3. REVIEW QUEUE SECTION (From the Phone screen in the photo)
           ========================================================================== -->
      <section class="review-queue-section">
        <div class="review-queue-header">
          <div class="review-queue-title">
            <i data-lucide="check-square" style="color: var(--brand-gold); width: 18px; height: 18px;"></i>
            Review Queue • بنك المراجعة السريعة
            <span class="mistakes-badge">4 أسئلة حرجة</span>
          </div>
          <a href="#/questions" style="font-size: 0.775rem; color: var(--brand-gold); font-weight: 600;">
            فتح بنك الأسئلة بالكامل ←
          </a>
        </div>

        <div class="review-cards-grid">
          <!-- Mistake Card 1 -->
          <a href="#/questions" class="review-mistake-card">
            <div>
              <div class="mistake-card-top">
                <span class="mistake-subject-tag">جراحة الفم 1</span>
                <span style="font-size: 0.7rem; color: #F87171; font-weight: 600;">أخطاء شائعة ⚠️</span>
              </div>
              <p class="mistake-question-text">
                Which is a useful test when evaluating pulp vitality before tooth extraction?
              </p>
            </div>
            <div class="mistake-card-footer">
              <span>Cold test & Electric Pulp Test (EPT)</span>
              <i data-lucide="arrow-left" style="width: 14px; height: 14px;"></i>
            </div>
          </a>

          <!-- Mistake Card 2 -->
          <a href="#/questions" class="review-mistake-card">
            <div>
              <div class="mistake-card-top">
                <span class="mistake-subject-tag">التركيبات الثابتة 2</span>
                <span style="font-size: 0.7rem; color: #F87171; font-weight: 600;">أخطاء شائعة ⚠️</span>
              </div>
              <p class="mistake-question-text">
                Why is a clear rounded chamfer finish line essential in zirconia crown preparations?
              </p>
            </div>
            <div class="mistake-card-footer">
              <span>Stress reduction & Marginal seal</span>
              <i data-lucide="arrow-left" style="width: 14px; height: 14px;"></i>
            </div>
          </a>
        </div>
      </section>
    `;

    // Initialize Timer & Ambient Sound Listeners
    HomePage.setupFocusTimer();
  },

  setupFocusTimer() {
    const clockEl = document.getElementById('focus-clock');
    const startBtn = document.getElementById('btn-focus-start');
    const resetBtn = document.getElementById('btn-focus-reset');
    const soundBtn = document.getElementById('btn-sound-toggle');
    const soundLabel = document.getElementById('sound-label');

    if (!clockEl || !startBtn) return;

    const updateClockDisplay = () => {
      const mins = Math.floor(HomePage.timerSeconds / 60).toString().padStart(2, '0');
      const secs = (HomePage.timerSeconds % 60).toString().padStart(2, '0');
      clockEl.textContent = `${mins}:${secs}`;
    };

    updateClockDisplay();

    startBtn.addEventListener('click', () => {
      if (HomePage.isTimerRunning) {
        // Pause
        clearInterval(HomePage.timerInterval);
        HomePage.isTimerRunning = false;
        startBtn.textContent = 'Continue';
        HomePage.stopAmbientSound();
        if (soundLabel) soundLabel.textContent = 'Lofi Sound';
      } else {
        // Start
        HomePage.isTimerRunning = true;
        startBtn.textContent = 'Pause Lock-in';
        HomePage.startAmbientSound();
        if (soundLabel) soundLabel.textContent = 'Playing 🎧';

        HomePage.timerInterval = setInterval(() => {
          if (HomePage.timerSeconds > 0) {
            HomePage.timerSeconds--;
            updateClockDisplay();
          } else {
            clearInterval(HomePage.timerInterval);
            HomePage.isTimerRunning = false;
            startBtn.textContent = 'Start Lock-in';
            HomePage.timerSeconds = 25 * 60;
            updateClockDisplay();
            HomePage.stopAmbientSound();
            window.STORE.addPoints(25);
            window.STORE.recordStreak();
            alert('🎉 مبروك! أتممت جلسة تركيز كاملة بنجاح وحصلت على +25 نقطة وسجلت يوم ستريك جديد!');
          }
        }, 1000);
      }
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        clearInterval(HomePage.timerInterval);
        HomePage.isTimerRunning = false;
        HomePage.timerSeconds = 25 * 60;
        startBtn.textContent = 'Start Lock-in';
        updateClockDisplay();
        HomePage.stopAmbientSound();
        if (soundLabel) soundLabel.textContent = 'Lofi Sound';
      });
    }

    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        if (HomePage.noiseNode) {
          HomePage.stopAmbientSound();
          if (soundLabel) soundLabel.textContent = 'Lofi Sound';
        } else {
          HomePage.startAmbientSound();
          if (soundLabel) soundLabel.textContent = 'Playing 🎧';
        }
      });
    }
  },

  // Soft Ambient Study Noise (Lofi pink noise for focus)
  startAmbientSound() {
    try {
      if (!HomePage.audioContext) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        HomePage.audioContext = new AudioCtx();
      }
      if (HomePage.audioContext.state === 'suspended') {
        HomePage.audioContext.resume();
      }
      if (HomePage.noiseNode) return;

      const bufferSize = HomePage.audioContext.sampleRate * 2;
      const buffer = HomePage.audioContext.createBuffer(1, bufferSize, HomePage.audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2) * 0.05; // very soft calming hum
      }

      const noise = HomePage.audioContext.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = HomePage.audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, HomePage.audioContext.currentTime);

      const gain = HomePage.audioContext.createGain();
      gain.gain.setValueAtTime(0.08, HomePage.audioContext.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(HomePage.audioContext.destination);

      noise.start(0);
      HomePage.noiseNode = noise;
    } catch (e) {
      console.log('AudioContext initialized upon interaction');
    }
  },

  stopAmbientSound() {
    if (HomePage.noiseNode) {
      try {
        HomePage.noiseNode.stop();
        HomePage.noiseNode.disconnect();
      } catch (e) {}
      HomePage.noiseNode = null;
    }
  }
};

window.HomePage = HomePage;
