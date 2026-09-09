/**
 * KURO FANGS — Kuroni Mascot Controller
 * Manages SVG expressions, animations, and mascot states
 */

// ── SVG Definitions ────────────────────────────────────────────
// Each expression returns an SVG string based on the brand identity:
// Deep black body (#1A1A1A), lime-glow eyes (#B4D455), pale blue accents

const KURONI_EXPRESSIONS = {

  // Default / Calm — neutral, friendly
  calm: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="kuroni-svg">
      <!-- Body -->
      <ellipse cx="50" cy="65" rx="28" ry="25" fill="#1A1A1A"/>
      <!-- Head -->
      <circle cx="50" cy="42" r="30" fill="#1A1A1A"/>
      <!-- Ears -->
      <polygon points="26,20 18,4 34,14" fill="#1A1A1A"/>
      <polygon points="74,20 82,4 66,14" fill="#1A1A1A"/>
      <!-- Inner ears -->
      <polygon points="26,18 20,8 32,15" fill="#B4D455" opacity="0.8"/>
      <polygon points="74,18 80,8 68,15" fill="#B4D455" opacity="0.8"/>
      <!-- Eye glow rings -->
      <circle cx="38" cy="42" r="11" fill="#B4D455" opacity="0.9"/>
      <circle cx="62" cy="42" r="11" fill="#B4D455" opacity="0.9"/>
      <!-- Pupils -->
      <circle cx="38" cy="42" r="8" fill="#0A0A0A"/>
      <circle cx="62" cy="42" r="8" fill="#0A0A0A"/>
      <!-- Eye shine -->
      <circle cx="41" cy="39" r="2" fill="white" opacity="0.6"/>
      <circle cx="65" cy="39" r="2" fill="white" opacity="0.6"/>
      <!-- Nose -->
      <polygon points="50,52 48,55 52,55" fill="#A8C9E8"/>
      <!-- Mouth — small smile -->
      <path d="M45,57 Q50,61 55,57" stroke="#FF6B6B" stroke-width="2" fill="none" stroke-linecap="round"/>
      <!-- Collar dot -->
      <circle cx="50" cy="80" r="5" fill="#B4D455" opacity="0.6"/>
    </svg>`,

  // Focused — narrow eyes, determined
  focused: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="kuroni-svg">
      <ellipse cx="50" cy="65" rx="28" ry="25" fill="#1A1A1A"/>
      <circle cx="50" cy="42" r="30" fill="#1A1A1A"/>
      <polygon points="26,20 18,4 34,14" fill="#1A1A1A"/>
      <polygon points="74,20 82,4 66,14" fill="#1A1A1A"/>
      <polygon points="26,18 20,8 32,15" fill="#B4D455" opacity="0.8"/>
      <polygon points="74,18 80,8 68,15" fill="#B4D455" opacity="0.8"/>
      <!-- Narrowed eyes -->
      <ellipse cx="38" cy="43" rx="11" ry="7" fill="#B4D455" opacity="0.9"/>
      <ellipse cx="62" cy="43" rx="11" ry="7" fill="#B4D455" opacity="0.9"/>
      <ellipse cx="38" cy="43" rx="8" ry="5" fill="#0A0A0A"/>
      <ellipse cx="62" cy="43" rx="8" ry="5" fill="#0A0A0A"/>
      <!-- Focused brow lines -->
      <line x1="28" y1="34" x2="47" y2="38" stroke="#B4D455" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="72" y1="34" x2="53" y2="38" stroke="#B4D455" stroke-width="2.5" stroke-linecap="round"/>
      <polygon points="50,52 48,55 52,55" fill="#A8C9E8"/>
      <path d="M46,58 Q50,60 54,58" stroke="#FF6B6B" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <circle cx="50" cy="80" r="5" fill="#B4D455" opacity="0.6"/>
    </svg>`,

  // Loading — spinning pulse eyes
  loading: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="kuroni-svg">
      <ellipse cx="50" cy="65" rx="28" ry="25" fill="#1A1A1A"/>
      <circle cx="50" cy="42" r="30" fill="#1A1A1A"/>
      <polygon points="26,20 18,4 34,14" fill="#1A1A1A"/>
      <polygon points="74,20 82,4 66,14" fill="#1A1A1A"/>
      <polygon points="26,18 20,8 32,15" fill="#B4D455" opacity="0.8"/>
      <polygon points="74,18 80,8 68,15" fill="#B4D455" opacity="0.8"/>
      <!-- Big round eyes -->
      <circle cx="38" cy="42" r="12" fill="#B4D455" opacity="0.9"/>
      <circle cx="62" cy="42" r="12" fill="#B4D455" opacity="0.9"/>
      <circle cx="38" cy="42" r="9" fill="#0A0A0A"/>
      <circle cx="62" cy="42" r="9" fill="#0A0A0A"/>
      <!-- Spinning arcs -->
      <path d="M27,42 A11,11 0 0,1 38,31" stroke="#B4D455" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.5"/>
      <path d="M51,42 A11,11 0 0,1 62,31" stroke="#B4D455" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.5"/>
      <circle cx="41" cy="39" r="2.5" fill="white" opacity="0.7"/>
      <circle cx="65" cy="39" r="2.5" fill="white" opacity="0.7"/>
      <polygon points="50,53 48,56 52,56" fill="#A8C9E8"/>
      <path d="M44,59 Q50,65 56,59" stroke="#FF6B6B" stroke-width="2" fill="none" stroke-linecap="round"/>
      <circle cx="50" cy="80" r="5" fill="#B4D455" opacity="0.6"/>
    </svg>`,

  // Excited — heart eyes, sparkles
  excited: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="kuroni-svg">
      <ellipse cx="50" cy="65" rx="28" ry="25" fill="#1A1A1A"/>
      <circle cx="50" cy="42" r="30" fill="#1A1A1A"/>
      <polygon points="26,20 18,4 34,14" fill="#1A1A1A"/>
      <polygon points="74,20 82,4 66,14" fill="#1A1A1A"/>
      <polygon points="26,18 20,8 32,15" fill="#B4D455" opacity="0.8"/>
      <polygon points="74,18 80,8 68,15" fill="#B4D455" opacity="0.8"/>
      <circle cx="38" cy="42" r="12" fill="#FF6B6B" opacity="0.9"/>
      <circle cx="62" cy="42" r="12" fill="#FF6B6B" opacity="0.9"/>
      <!-- Heart pupils -->
      <path d="M33,40 Q34,37 38,40 Q42,37 43,40 Q43,44 38,47 Q33,44 33,40Z" fill="#0A0A0A"/>
      <path d="M57,40 Q58,37 62,40 Q66,37 67,40 Q67,44 62,47 Q57,44 57,40Z" fill="#0A0A0A"/>
      <!-- Blush -->
      <ellipse cx="24" cy="52" rx="6" ry="4" fill="#FF6B6B" opacity="0.25"/>
      <ellipse cx="76" cy="52" rx="6" ry="4" fill="#FF6B6B" opacity="0.25"/>
      <!-- Sparkles -->
      <text x="8" y="20" font-size="10" fill="#FFD93D">✦</text>
      <text x="80" y="18" font-size="8" fill="#B4D455">✦</text>
      <polygon points="50,53 48,56 52,56" fill="#A8C9E8"/>
      <path d="M42,57 Q50,65 58,57" stroke="#FF6B6B" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <circle cx="50" cy="80" r="5" fill="#B4D455" opacity="0.8"/>
    </svg>`,

  // Sleepy — half-closed eyes, zzz
  sleepy: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="kuroni-svg">
      <ellipse cx="50" cy="65" rx="28" ry="25" fill="#1A1A1A"/>
      <circle cx="50" cy="42" r="30" fill="#1A1A1A"/>
      <polygon points="26,20 18,4 34,14" fill="#1A1A1A"/>
      <polygon points="74,20 82,4 66,14" fill="#1A1A1A"/>
      <polygon points="26,18 20,8 32,15" fill="#B4D455" opacity="0.6"/>
      <polygon points="74,18 80,8 68,15" fill="#B4D455" opacity="0.6"/>
      <!-- Half-closed eyes -->
      <circle cx="38" cy="44" r="11" fill="#B4D455" opacity="0.5"/>
      <circle cx="62" cy="44" r="11" fill="#B4D455" opacity="0.5"/>
      <circle cx="38" cy="44" r="8" fill="#0A0A0A"/>
      <circle cx="62" cy="44" r="8" fill="#0A0A0A"/>
      <!-- Droopy eyelids -->
      <rect x="27" y="36" width="22" height="11" rx="6" fill="#1A1A1A"/>
      <rect x="51" y="36" width="22" height="11" rx="6" fill="#1A1A1A"/>
      <polygon points="50,53 48,56 52,56" fill="#A8C9E8"/>
      <path d="M46,58 Q50,60 54,58" stroke="#FF6B6B" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <!-- Zzz letters -->
      <text x="72" y="22" font-size="9" fill="#A8C9E8" font-weight="bold" font-family="sans-serif">z</text>
      <text x="78" y="15" font-size="12" fill="#A8C9E8" font-weight="bold" font-family="sans-serif">z</text>
      <text x="86" y="8" font-size="15" fill="#A8C9E8" font-weight="bold" font-family="sans-serif">Z</text>
      <circle cx="50" cy="80" r="5" fill="#B4D455" opacity="0.3"/>
    </svg>`,

  // Surprised — huge eyes, open mouth
  surprised: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="kuroni-svg">
      <ellipse cx="50" cy="65" rx="28" ry="25" fill="#1A1A1A"/>
      <circle cx="50" cy="42" r="30" fill="#1A1A1A"/>
      <polygon points="26,20 18,4 34,14" fill="#1A1A1A"/>
      <polygon points="74,20 82,4 66,14" fill="#1A1A1A"/>
      <polygon points="26,18 20,8 32,15" fill="#B4D455" opacity="0.8"/>
      <polygon points="74,18 80,8 68,15" fill="#B4D455" opacity="0.8"/>
      <!-- Huge eyes -->
      <circle cx="38" cy="41" r="14" fill="#B4D455" opacity="0.95"/>
      <circle cx="62" cy="41" r="14" fill="#B4D455" opacity="0.95"/>
      <circle cx="38" cy="41" r="11" fill="#0A0A0A"/>
      <circle cx="62" cy="41" r="11" fill="#0A0A0A"/>
      <circle cx="42" cy="37" r="3" fill="white" opacity="0.7"/>
      <circle cx="66" cy="37" r="3" fill="white" opacity="0.7"/>
      <!-- Open mouth O -->
      <ellipse cx="50" cy="61" rx="6" ry="7" fill="#FF6B6B"/>
      <circle cx="50" cy="80" r="5" fill="#B4D455" opacity="0.6"/>
    </svg>`,

  // Confused — tilted head, question mark eyes
  confused: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="kuroni-svg">
      <g transform="rotate(-8 50 50)">
        <ellipse cx="50" cy="65" rx="28" ry="25" fill="#1A1A1A"/>
        <circle cx="50" cy="42" r="30" fill="#1A1A1A"/>
        <polygon points="26,20 18,4 34,14" fill="#1A1A1A"/>
        <polygon points="74,20 82,4 66,14" fill="#1A1A1A"/>
        <polygon points="26,18 20,8 32,15" fill="#B4D455" opacity="0.8"/>
        <polygon points="74,18 80,8 68,15" fill="#B4D455" opacity="0.8"/>
        <circle cx="38" cy="42" r="11" fill="#B4D455" opacity="0.9"/>
        <circle cx="62" cy="42" r="11" fill="#B4D455" opacity="0.9"/>
        <circle cx="38" cy="42" r="8" fill="#0A0A0A"/>
        <circle cx="62" cy="42" r="8" fill="#0A0A0A"/>
        <circle cx="41" cy="39" r="2" fill="white" opacity="0.6"/>
        <circle cx="65" cy="39" r="2" fill="white" opacity="0.6"/>
        <polygon points="50,52 48,55 52,55" fill="#A8C9E8"/>
        <path d="M46,57 Q50,59 54,57" stroke="#FF6B6B" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <circle cx="50" cy="80" r="5" fill="#B4D455" opacity="0.6"/>
      </g>
      <!-- Question mark -->
      <text x="72" y="16" font-size="18" fill="#FFD93D" font-weight="bold" font-family="serif">?</text>
    </svg>`,

  // Achievement — sparkling eyes, big smile
  achievement: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="kuroni-svg">
      <ellipse cx="50" cy="65" rx="28" ry="25" fill="#1A1A1A"/>
      <circle cx="50" cy="42" r="30" fill="#1A1A1A"/>
      <polygon points="26,20 18,4 34,14" fill="#1A1A1A"/>
      <polygon points="74,20 82,4 66,14" fill="#1A1A1A"/>
      <polygon points="26,18 20,8 32,15" fill="#B4D455" opacity="0.8"/>
      <polygon points="74,18 80,8 68,15" fill="#B4D455" opacity="0.8"/>
      <!-- Star-shaped sparkle eyes -->
      <circle cx="38" cy="42" r="13" fill="#FFD93D" opacity="0.95"/>
      <circle cx="62" cy="42" r="13" fill="#FFD93D" opacity="0.95"/>
      <circle cx="38" cy="42" r="9" fill="#0A0A0A"/>
      <circle cx="62" cy="42" r="9" fill="#0A0A0A"/>
      <!-- Star shine -->
      <path d="M38,34 L39.5,38 L43,38 L40.5,40.5 L41.5,44 L38,42 L34.5,44 L35.5,40.5 L33,38 L36.5,38Z" fill="white" opacity="0.7"/>
      <path d="M62,34 L63.5,38 L67,38 L64.5,40.5 L65.5,44 L62,42 L58.5,44 L59.5,40.5 L57,38 L60.5,38Z" fill="white" opacity="0.7"/>
      <!-- Big smile -->
      <path d="M40,57 Q50,68 60,57" stroke="#FF6B6B" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- Sparkles around -->
      <text x="4"  y="15" font-size="12" fill="#FFD93D">✦</text>
      <text x="82" y="12" font-size="10" fill="#B4D455">✦</text>
      <text x="8"  y="75" font-size="8"  fill="#FFD93D">✦</text>
      <text x="84" y="70" font-size="10" fill="#B4D455">✦</text>
      <polygon points="50,53 48,56 52,56" fill="#A8C9E8"/>
      <circle cx="50" cy="80" r="5" fill="#FFD93D" opacity="0.8"/>
    </svg>`,

  // Warning — stern face, one eye squint
  warning: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="kuroni-svg">
      <ellipse cx="50" cy="65" rx="28" ry="25" fill="#1A1A1A"/>
      <circle cx="50" cy="42" r="30" fill="#1A1A1A"/>
      <polygon points="26,20 18,4 34,14" fill="#1A1A1A"/>
      <polygon points="74,20 82,4 66,14" fill="#1A1A1A"/>
      <polygon points="26,18 20,8 32,15" fill="#FF8C42" opacity="0.7"/>
      <polygon points="74,18 80,8 68,15" fill="#FF8C42" opacity="0.7"/>
      <!-- Stern eyes -->
      <circle cx="38" cy="43" r="10" fill="#FF8C42" opacity="0.8"/>
      <ellipse cx="62" cy="44" rx="10" ry="7" fill="#FF8C42" opacity="0.8"/>
      <circle cx="38" cy="43" r="7" fill="#0A0A0A"/>
      <ellipse cx="62" cy="44" rx="7" ry="5" fill="#0A0A0A"/>
      <!-- Angry brows -->
      <line x1="28" y1="33" x2="47" y2="37" stroke="#FF8C42" stroke-width="3" stroke-linecap="round"/>
      <line x1="53" y1="37" x2="72" y2="35" stroke="#FF8C42" stroke-width="3" stroke-linecap="round"/>
      <polygon points="50,52 48,55 52,55" fill="#A8C9E8"/>
      <!-- Straight or frown mouth -->
      <path d="M44,59 Q50,57 56,59" stroke="#FF6B6B" stroke-width="2" fill="none" stroke-linecap="round"/>
      <circle cx="50" cy="80" r="5" fill="#FF8C42" opacity="0.6"/>
    </svg>`,

  // Thinking — one eye partially closed, thought bubble
  thinking: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="kuroni-svg">
      <ellipse cx="50" cy="65" rx="28" ry="25" fill="#1A1A1A"/>
      <circle cx="50" cy="42" r="30" fill="#1A1A1A"/>
      <polygon points="26,20 18,4 34,14" fill="#1A1A1A"/>
      <polygon points="74,20 82,4 66,14" fill="#1A1A1A"/>
      <polygon points="26,18 20,8 32,15" fill="#B4D455" opacity="0.8"/>
      <polygon points="74,18 80,8 68,15" fill="#B4D455" opacity="0.8"/>
      <circle cx="38" cy="42" r="11" fill="#B4D455" opacity="0.9"/>
      <!-- Half-closed right eye -->
      <ellipse cx="62" cy="43" rx="11" ry="7" fill="#B4D455" opacity="0.7"/>
      <circle cx="38" cy="42" r="8" fill="#0A0A0A"/>
      <ellipse cx="62" cy="43" rx="8" ry="5" fill="#0A0A0A"/>
      <!-- Raised brow on thinking side -->
      <line x1="52" y1="35" x2="72" y2="33" stroke="#B4D455" stroke-width="2" stroke-linecap="round"/>
      <circle cx="41" cy="39" r="2" fill="white" opacity="0.6"/>
      <circle cx="65" cy="40" r="1.5" fill="white" opacity="0.5"/>
      <polygon points="50,52 48,55 52,55" fill="#A8C9E8"/>
      <path d="M45,57 Q50,59 55,57" stroke="#FF6B6B" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <!-- Thought dots -->
      <circle cx="72" cy="22" r="3" fill="white" opacity="0.15"/>
      <circle cx="78" cy="16" r="5" fill="white" opacity="0.12"/>
      <circle cx="86" cy="8"  r="7" fill="white" opacity="0.10"/>
      <text x="83" y="13" font-size="7" fill="#A8C9E8" font-family="sans-serif">...</text>
      <circle cx="50" cy="80" r="5" fill="#B4D455" opacity="0.6"/>
    </svg>`,

  // Coming Soon — eyes closed, paw up
  'coming-soon': `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="kuroni-svg">
      <ellipse cx="50" cy="65" rx="28" ry="25" fill="#1A1A1A"/>
      <circle cx="50" cy="42" r="30" fill="#1A1A1A"/>
      <polygon points="26,20 18,4 34,14" fill="#1A1A1A"/>
      <polygon points="74,20 82,4 66,14" fill="#1A1A1A"/>
      <polygon points="26,18 20,8 32,15" fill="#B4D455" opacity="0.5"/>
      <polygon points="74,18 80,8 68,15" fill="#B4D455" opacity="0.5"/>
      <!-- Closed eyes (arcs) -->
      <path d="M27,43 Q38,36 49,43" stroke="#B4D455" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.8"/>
      <path d="M51,43 Q62,36 73,43" stroke="#B4D455" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.8"/>
      <polygon points="50,52 48,55 52,55" fill="#A8C9E8"/>
      <!-- Happy closed smile -->
      <path d="M42,57 Q50,63 58,57" stroke="#FF6B6B" stroke-width="2" fill="none" stroke-linecap="round"/>
      <!-- Raised paw (circle and ellipse hand) -->
      <circle cx="78" cy="50" r="10" fill="#1A1A1A"/>
      <ellipse cx="74" cy="44" rx="4" ry="5" fill="#1A1A1A"/>
      <ellipse cx="82" cy="44" rx="4" ry="5" fill="#1A1A1A"/>
      <ellipse cx="78" cy="41" rx="4" ry="5" fill="#1A1A1A"/>
      <circle cx="50" cy="80" r="5" fill="#B4D455" opacity="0.6"/>
    </svg>`
};

// ── Kuroni Controller ──────────────────────────────────────────
const KURONI = {
  // Render expression into a container element
  render(container, expression = 'calm', size = 'md', animate = '') {
    const svg = KURONI_EXPRESSIONS[expression] || KURONI_EXPRESSIONS.calm;
    if (typeof container === 'string') {
      container = document.getElementById(container);
    }
    if (!container) return;

    container.innerHTML = svg;
    container.className = `kuroni-container kuroni-${size}`;
    if (animate) {
      container.classList.add(`kuroni-state-${animate}`);
    }
  },

  // Get SVG string for embedding in HTML templates
  getSVG(expression = 'calm') {
    return KURONI_EXPRESSIONS[expression] || KURONI_EXPRESSIONS.calm;
  },

  // Animate transition between two expressions
  transition(container, from, to, size = 'md') {
    if (typeof container === 'string') {
      container = document.getElementById(container);
    }
    if (!container) return;

    container.style.transition = 'opacity 200ms, transform 200ms';
    container.style.opacity = '0';
    container.style.transform = 'scale(0.85)';

    setTimeout(() => {
      this.render(container, to, size);
      container.style.opacity = '1';
      container.style.transform = 'scale(1)';
    }, 200);
  },

  // Create inline HTML for a Kuroni mascot
  html(expression = 'calm', size = 'md', extraClass = '') {
    return `<div class="kuroni-container kuroni-${size} ${extraClass}">${KURONI_EXPRESSIONS[expression] || KURONI_EXPRESSIONS.calm}</div>`;
  },

  // Loading state with bounce + message
  loadingHTML(message = 'جاري التحميل...', size = 'lg') {
    return `
      <div class="kuroni-loading-card">
        <div class="kuroni-container kuroni-${size} kuroni-state-loading">
          ${KURONI_EXPRESSIONS.loading}
        </div>
        <p class="kuroni-loading-label">${message}</p>
      </div>`;
  },

  // Empty state
  emptyHTML(expression = 'sleepy', title = 'لا يوجد محتوى بعد', message = 'كوروني ينتظر المحتوى...') {
    return `
      <div class="empty-state animate-slide-up">
        <div class="kuroni-container kuroni-xl kuroni-state-floating">
          ${KURONI_EXPRESSIONS[expression] || KURONI_EXPRESSIONS.sleepy}
        </div>
        <h3 class="empty-state-title">${title}</h3>
        <p class="empty-state-message">${message}</p>
      </div>`;
  },

  // Coming soon state
  comingSoonHTML(feature = 'هذه الميزة') {
    return `
      <div class="empty-state animate-fade-in">
        <div class="kuroni-container kuroni-xl kuroni-state-floating">
          ${KURONI_EXPRESSIONS['coming-soon']}
        </div>
        <h3 class="empty-state-title">${feature} قريباً 🌸</h3>
        <p class="empty-state-message">كوروني يعمل على إضافة هذه الميزة. تابع المستجدات!</p>
      </div>`;
  }
};

export { KURONI, KURONI_EXPRESSIONS };
export default KURONI;
