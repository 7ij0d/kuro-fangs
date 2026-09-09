/**
 * KURO FANGS — Secondary & Utility Pages
 * Sheets, Summaries, Videos, Images, Questions, Flashcards,
 * Previous Years, Quizzes, Exams, Profile, Saved, Auth
 */

// ── Sheets Page ───────────────────────────────────────────────────
export async function renderSheets(container, params) {
  const { default: KF_DATA } = await import('../data.js');
  const { default: KF_STORE } = await import('../store.js');
  const { default: KURONI }   = await import('../kuroni.js');
  if (!KF_DATA.subjects) await KF_DATA.init();

  const sheets = KF_DATA.sheets;
  renderSheetList(container, sheets, 'كل الملازم والشيتات', KURONI, KF_DATA, KF_STORE);
}

// ── Summaries Page ─────────────────────────────────────────────────
export async function renderSummaries(container, params) {
  const { default: KF_DATA } = await import('../data.js');
  const { default: KF_STORE } = await import('../store.js');
  const { default: KURONI }   = await import('../kuroni.js');
  if (!KF_DATA.subjects) await KF_DATA.init();

  const items = KF_DATA.sheets.filter(s => s.available_types.includes('summary'));
  renderSheetList(container, items, 'الملخصات والتفريغات', KURONI, KF_DATA, KF_STORE, '📝');
}

// ── Videos Page ───────────────────────────────────────────────────
export async function renderVideos(container, params) {
  const { default: KF_DATA } = await import('../data.js');
  const { default: KURONI }   = await import('../kuroni.js');
  if (!KF_DATA.subjects) await KF_DATA.init();

  const items = KF_DATA.sheets.filter(s => s.available_types.includes('recording'));
  if (items.length === 0) {
    container.innerHTML = `
      <div class="page-header"><h1 class="page-title">التسجيلات والشروحات 🎥</h1></div>
      <div class="page-content">${KURONI.emptyHTML('sleepy', 'التسجيلات قيد التحديث', 'ستُضاف روابط تسجيلات المحاضرات وشروحات الدكاترة هنا')}</div>`;
    return;
  }
  renderSheetList(container, items, 'التسجيلات', KURONI, null, null, '🎥');
}

// ── Images Page ───────────────────────────────────────────────────
export async function renderImages(container, params) {
  const { default: KF_DATA } = await import('../data.js');
  const { default: KURONI }   = await import('../kuroni.js');
  if (!KF_DATA.subjects) await KF_DATA.init();

  const items = KF_DATA.sheets.filter(s => s.available_types.includes('images'));
  renderSheetList(container, items, 'الأطلس والصور المعملية', KURONI, KF_DATA, null, '🖼️');
}

// ── Questions Page ─────────────────────────────────────────────────
export async function renderQuestions(container, params) {
  const { default: KF_DATA } = await import('../data.js');
  const { default: KURONI }   = await import('../kuroni.js');
  if (!KF_DATA.questions) await KF_DATA.init();

  const questions = KF_DATA.getQuestions('all');

  container.innerHTML = `
    <div class="page-header">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:var(--space-3);">
        <div>
          <h1 class="page-title">بنك الأسئلة والتدريبات ❓</h1>
          <p class="page-subtitle">تصفح الأسئلة الشائعة والمكررة في امتحانات سنة ثالثة</p>
        </div>
        <button class="btn btn-primary" onclick="ROUTER.navigate('/quizzes')">
          بدء كويز تفاعلي 🚀
        </button>
      </div>
    </div>
    <div class="page-content animate-page-enter">
      <div style="display:flex; flex-direction:column; gap:var(--space-4);">
        ${questions.map((q, idx) => `
          <div class="card" style="padding:var(--space-5);">
            <div style="display:flex; justify-content:space-between; margin-bottom:var(--space-2);">
              <span style="font-weight:bold; font-size:var(--fs-xs); color:var(--color-primary-dark);">${q.subject_name || 'سنة ثالثة'}</span>
              <span class="tag tag-neutral">${q.year_tag || 'امتحان سابق'}</span>
            </div>
            <div style="font-weight:var(--fw-bold); font-size:var(--fs-base); margin-bottom:var(--space-2); color:var(--color-text-heading);">${q.question}</div>
            ${q.question_ar ? `<div style="font-size:var(--fs-sm); color:var(--color-text-muted); margin-bottom:var(--space-3);">${q.question_ar}</div>` : ''}
            <div style="background:var(--color-surface-sunken); padding:var(--space-3); border-radius:var(--radius-md); font-size:var(--fs-xs); line-height:1.6;">
              <strong style="color:#22c55e;">الإجابة الصحيحة:</strong> ${q.options[q.correct]}
              <div style="margin-top:var(--space-1); color:var(--color-text-muted);">${q.explanation}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>`;
}

// ── Flashcards Page ───────────────────────────────────────────────
export async function renderFlashcards(container, params) {
  const { default: KF_DATA } = await import('../data.js');
  const { default: KURONI }   = await import('../kuroni.js');
  if (!KF_DATA.flashcards) await KF_DATA.init();

  const decks = KF_DATA.getFlashcardDecks('all');
  if (!decks || decks.length === 0) {
    container.innerHTML = `
      <div class="page-header"><h1 class="page-title">البطاقات التعليمية 🃏</h1></div>
      <div class="page-content">${KURONI.comingSoonHTML('البطاقات التعليمية التفاعلية')}</div>`;
    return;
  }

  let activeDeckIdx = 0;
  let activeCardIdx = 0;
  let isFlipped = false;

  function renderView() {
    const currentDeck = decks[activeDeckIdx];
    const cards = currentDeck.cards;
    const currentCard = cards[activeCardIdx];

    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">البطاقات التعليمية التفاعلية 🃏</h1>
        <p class="page-subtitle">مراجعة سريعة ومركزة لأهم مفاهيم وتعريفات سنة ثالثة طب أسنان</p>
      </div>

      <div class="page-content animate-page-enter" style="max-width:640px; margin:0 auto;">
        
        <!-- Deck Selector Tabs -->
        <div style="display:flex; gap:var(--space-2); overflow-x:auto; padding-bottom:var(--space-3); margin-bottom:var(--space-6);">
          ${decks.map((d, i) => `
            <button class="btn btn-sm ${i === activeDeckIdx ? 'btn-primary' : 'btn-outline'}"
                    data-deck="${i}" style="white-space:nowrap; border-radius:var(--radius-xl);">
              ${d.title}
            </button>`).join('')}
        </div>

        <!-- Progress Counter -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-3); font-size:var(--fs-xs); color:var(--color-text-muted);">
          <span>المادة: <strong>${currentDeck.subject_name}</strong></span>
          <span>بطاقة ${activeCardIdx + 1} من ${cards.length}</span>
        </div>

        <!-- Flashcard Wrapper -->
        <div style="perspective: 1000px; margin-bottom:var(--space-6);">
          <div id="fc-card" class="flashcard-wrapper ${isFlipped ? 'flipped' : ''}" style="cursor:pointer; min-height:260px; height:auto;">
            <div class="flashcard-inner" style="min-height:260px;">
              
              <!-- Front -->
              <div class="flashcard-front" style="padding:var(--space-6); min-height:260px; display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                  <span class="tag tag-exam" style="margin-bottom:var(--space-3); display:inline-block;">سؤال / مصطلح</span>
                  <div style="font-size:var(--fs-lg); font-weight:var(--fw-bold); line-height:1.6; color:var(--color-text-heading); margin-top:var(--space-2);">
                    ${currentCard.q}
                  </div>
                </div>
                <div style="font-size:var(--fs-xs); color:var(--color-text-muted); text-align:center; padding-top:var(--space-4);">
                  👆 اضغط على البطاقة للكشف عن الإجابة والشرح
                </div>
              </div>

              <!-- Back -->
              <div class="flashcard-back" style="padding:var(--space-6); min-height:260px; display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                  <span class="tag tag-new" style="margin-bottom:var(--space-3); display:inline-block;">الإجابة والملخص</span>
                  <div style="font-size:var(--fs-base); line-height:1.7; color:var(--color-text); white-space:pre-line; margin-top:var(--space-2);">
                    ${currentCard.a}
                  </div>
                </div>
                <div style="font-size:var(--fs-xs); color:var(--color-primary-dark); text-align:center; padding-top:var(--space-4);">
                  🔄 اضغط لقلب البطاقة مرة أخرى
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Controls -->
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <button class="btn btn-outline" id="fc-prev" ${activeCardIdx === 0 ? 'disabled' : ''} style="min-width:120px;">
            → السابقة
          </button>
          
          <button class="btn btn-ghost btn-sm" id="fc-flip-btn">
            قلب البطاقة 🔄
          </button>

          <button class="btn btn-primary" id="fc-next" ${activeCardIdx === cards.length - 1 ? 'disabled' : ''} style="min-width:120px;">
            التالية ←
          </button>
        </div>

      </div>`;

    document.getElementById('fc-card')?.addEventListener('click', () => {
      isFlipped = !isFlipped;
      renderView();
    });

    document.getElementById('fc-flip-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      isFlipped = !isFlipped;
      renderView();
    });

    document.getElementById('fc-prev')?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (activeCardIdx > 0) {
        activeCardIdx--;
        isFlipped = false;
        renderView();
      }
    });

    document.getElementById('fc-next')?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (activeCardIdx < cards.length - 1) {
        activeCardIdx++;
        isFlipped = false;
        renderView();
      }
    });

    container.querySelectorAll('[data-deck]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeDeckIdx = parseInt(btn.dataset.deck);
        activeCardIdx = 0;
        isFlipped = false;
        renderView();
      });
    });
  }

  renderView();
}

// ── Previous Years Page (Delegated to dedicated page module) ───────
export async function renderPreviousYears(container, params) {
  const { default: fn } = await import('./previous-years.js');
  return fn(container, params);
}

// ── Quizzes Page (Delegated to dedicated page module) ──────────────
export async function renderQuizzes(container, params) {
  const { default: fn } = await import('./quizzes.js');
  return fn(container, params);
}

// ── Exams Page ────────────────────────────────────────────────────
export async function renderExams(container, params) {
  const { default: KF_DATA } = await import('../data.js');
  const { default: KURONI }   = await import('../kuroni.js');
  if (!KF_DATA.subjects) await KF_DATA.init();

  const subjects = KF_DATA.getSubjects(3);
  const midterms = subjects.filter(s => s.exam_schedule.includes('نصفي'));
  const finals   = subjects.filter(s => s.exam_schedule.includes('نهائي'));

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">جدول الامتحانات والمقررات 🎯</h1>
      <p class="page-subtitle">نظام توزيع الامتحانات والمواد — السنة الثالثة كلية طب وجراحة الفم والأسنان</p>
    </div>
    <div class="page-content animate-page-enter">
      
      <!-- Quick tools banner -->
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:var(--space-4); margin-bottom:var(--space-6);">
        <div class="card hover-lift hover-press" onclick="ROUTER.navigate('/calculator')" style="cursor:pointer; border-right:4px solid var(--color-primary-dark); padding:var(--space-5);">
          <div style="font-size:24px; margin-bottom:var(--space-2);">🧮</div>
          <div style="font-weight:var(--fw-bold); font-size:var(--fs-base);">حاسبة الدرجات والفاينل</div>
          <div style="font-size:var(--fs-xs); color:var(--color-text-muted); margin-top:var(--space-1);">احسب درجاتك وتعرف على المطلوب منك في الفاينل</div>
        </div>
        <div class="card hover-lift hover-press" onclick="ROUTER.navigate('/previous-years')" style="cursor:pointer; border-right:4px solid #FF8C42; padding:var(--space-5);">
          <div style="font-size:24px; margin-bottom:var(--space-2);">📅</div>
          <div style="font-weight:var(--fw-bold); font-size:var(--fs-base);">بنك السنوات السابقة</div>
          <div style="font-size:var(--fs-xs); color:var(--color-text-muted); margin-top:var(--space-1);">تجميعات امتحانات النصفي والنهائي مع الحلول</div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <h2 class="section-title"><span class="title-dot" style="background:var(--tag-exam)"></span> مواد الفاينل والنصفي (سنوية كاملة)</h2>
        </div>
        <div class="grid-3">
          ${finals.map((s, i) => `
            <div class="card hover-lift animate-card-reveal stagger-${i + 1}"
                 style="border-right: 3px solid ${s.color}; cursor:pointer;"
                 onclick="ROUTER.navigate('/subjects/${s.id}')">
              <div style="font-size:24px; margin-bottom:var(--space-2);">${s.icon}</div>
              <div class="sheet-title">${s.name_ar}</div>
              <div style="font-size:var(--fs-xs); color:var(--color-text-muted); margin:var(--space-1) 0;">${s.name_en}</div>
              <div style="margin-top:var(--space-2);">
                <span class="tag tag-exam">نصفي + نهائي</span>
              </div>
            </div>`).join('')}
        </div>
      </div>

      <div class="section" style="margin-top:var(--space-8);">
        <div class="section-header">
          <h2 class="section-title"><span class="title-dot" style="background:var(--tag-new)"></span> مواد النصفي فقط</h2>
        </div>
        <div class="grid-auto">
          ${midterms.filter(s => !s.exam_schedule.includes('نهائي')).map((s, i) => `
            <div class="card hover-lift animate-card-reveal stagger-${i + 1}"
                 style="border-right: 3px solid ${s.color}; cursor:pointer;"
                 onclick="ROUTER.navigate('/subjects/${s.id}')">
              <div style="font-size:20px; margin-bottom:var(--space-2);">${s.icon}</div>
              <div class="sheet-title" style="font-size:var(--fs-sm);">${s.name_ar}</div>
              <div style="margin-top:var(--space-2);">
                <span class="tag tag-neutral">نصفي فقط</span>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </div>`;
}

// ── Profile Page (Zero-friction Open Access) ───────────────────────
export async function renderProfile(container, params) {
  const { default: KF_STORE } = await import('../store.js');
  const { default: KURONI }   = await import('../kuroni.js');

  const user = KF_STORE.getUser() || { name: 'طالب كورو 🐱', group: 'مجموعة A' };
  const points = KF_STORE.getPoints();
  const favCount = KF_STORE.getFavorites().length;
  const noteCount = Object.keys(KF_STORE.getAllNotes()).length;
  const quizzesTaken = KF_STORE.getQuizHistory().length;

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">ملف الطالب والبيانات الشخصية 🐱</h1>
      <p class="page-subtitle">المنظومة مفتوحة بالكامل — بياناتك وإنجازاتك محفوظة محلياً في متصفحك</p>
    </div>
    <div class="page-content animate-page-enter" style="max-width: 620px; margin: 0 auto;">

      <!-- Profile Header Card -->
      <div class="card" style="text-align:center; padding:var(--space-6); margin-bottom:var(--space-6);">
        <div class="kuroni-container kuroni-lg" style="margin: 0 auto var(--space-3);">
          ${KURONI.getSVG('excited')}
        </div>
        <div style="display:flex; justify-content:center; align-items:center; gap:var(--space-2); margin-bottom:var(--space-1);">
          <input type="text" id="prof-name-input" value="${user.name}"
                 style="font-size:var(--fs-xl); font-weight:var(--fw-black); text-align:center; border:none; background:transparent; border-bottom:2px dashed var(--color-border); padding:var(--space-1) var(--space-2); max-width:260px;" />
          <button class="btn btn-sm btn-ghost" id="btn-save-name" title="حفظ الاسم">💾</button>
        </div>
        <p style="color:var(--color-text-muted); font-size:var(--fs-sm); margin: 0 0 var(--space-4);">
          طالب/ة طب وجراحة الفم والأسنان — السنة الثالثة
        </p>

        <div style="display:inline-flex; gap:var(--space-2); flex-wrap:wrap; justify-content:center;">
          <span class="tag tag-exam">كلية طب الأسنان — طرابلس</span>
          <span class="tag tag-neutral">الدفعة الموحدة</span>
          <span class="tag tag-new">✓ بدون تسجيل دخول</span>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid-3" style="margin-bottom:var(--space-6);">
        <div class="card" style="text-align:center; padding:var(--space-4);">
          <div style="font-size:var(--fs-2xl); font-weight:var(--fw-black); color:var(--color-primary-dark);">${points}</div>
          <div style="font-size:var(--fs-xs); color:var(--color-text-muted);">نقاط التفاعل ⭐</div>
        </div>
        <div class="card" style="text-align:center; padding:var(--space-4);">
          <div style="font-size:var(--fs-2xl); font-weight:var(--fw-black); color:var(--tag-exam);">${quizzesTaken}</div>
          <div style="font-size:var(--fs-xs); color:var(--color-text-muted);">كويزات مكتملة 📋</div>
        </div>
        <div class="card" style="text-align:center; padding:var(--space-4);">
          <div style="font-size:var(--fs-2xl); font-weight:var(--fw-black); color:var(--tag-important);">${favCount}</div>
          <div style="font-size:var(--fs-xs); color:var(--color-text-muted);">شيتات مفضلة ❤️</div>
        </div>
      </div>

      <!-- Quick Navigation -->
      <div class="card" style="margin-bottom:var(--space-6); padding:var(--space-2);">
        <div style="display:flex; flex-direction:column;">
          ${[
            { label: 'سجل متطلبات المعمل والعملي', icon: '🦷', route: '/requirements' },
            { label: 'حاسبة الدرجات ومعدل سنة ثالثة', icon: '🧮', route: '/calculator' },
            { label: 'الكويزات والامتحانات التفاعلية', icon: '📋', route: '/quizzes' },
            { label: 'شيتاتي وملازمي المفضلة', icon: '❤️', route: '/favorites' },
            { label: 'دفتر ملاحظاتي الأكاديمية', icon: '📝', route: '/notes' },
            { label: 'الإنجازات والأوسمة المكتسبة', icon: '🏆', route: '/badges' },
          ].map(item => `
            <div class="nav-item" onclick="ROUTER.navigate('${item.route}')" style="cursor:pointer; padding:var(--space-3) var(--space-4); border-radius:var(--radius-md);">
              <span style="font-size:20px; margin-left:var(--space-3);">${item.icon}</span>
              <span class="nav-label" style="font-size:var(--fs-sm); font-weight:var(--fw-medium);">${item.label}</span>
              <span style="margin-right:auto; opacity:0.3;">←</span>
            </div>`).join('')}
        </div>
      </div>

      <!-- Backup & Restore Section -->
      <div class="card" style="padding:var(--space-5); margin-bottom:var(--space-6); background:var(--color-surface-sunken);">
        <h3 style="font-size:var(--fs-sm); font-weight:var(--fw-bold); margin-bottom:var(--space-2);">
          💾 النسخ الاحتياطي ونقل البيانات (بدون سيرفر):
        </h3>
        <p style="font-size:var(--fs-xs); color:var(--color-text-muted); margin-bottom:var(--space-4); line-height:1.5;">
          يمكنك تنزيل نسخة احتياطية من درجاتك، ومتطلبات المعمل، وملاحظاتك الشخصية، واسترجاعها في أي هاتف أو كمبيوتر آخر بضغطة زر.
        </p>

        <div style="display:flex; gap:var(--space-3); flex-wrap:wrap;">
          <button class="btn btn-sm btn-primary" id="btn-export-backup">
            📥 تصدير نسخة احتياطية (JSON)
          </button>
          <label class="btn btn-sm btn-outline" style="cursor:pointer;">
            📤 استيراد نسخة سابقة
            <input type="file" id="input-import-backup" accept=".json" style="display:none;" />
          </label>
        </div>
      </div>

      <!-- Theme Selector -->
      <div class="card" style="padding:var(--space-5);">
        <h3 style="font-size:var(--fs-sm); font-weight:var(--fw-bold); margin-bottom:var(--space-3);">مظهر المنظومة 🎨</h3>
        <div class="filter-row">
          ${[
            { id: 'default', label: '☀️ نهاري' },
            { id: 'dark', label: '🌙 ليلي مريح' },
            { id: 'girls', label: '🌸 وردي هادئ' },
          ].map(t => `
            <button class="filter-chip ${KF_STORE.getTheme() === t.id ? 'active' : ''}"
                    onclick="setTheme('${t.id}', this)">${t.label}</button>`).join('')}
        </div>
      </div>

    </div>`;

  document.getElementById('btn-save-name')?.addEventListener('click', () => {
    const val = document.getElementById('prof-name-input')?.value.trim();
    if (val) {
      KF_STORE.setUser({ ...user, name: val });
      const nameEl = document.getElementById('user-name');
      if (nameEl) nameEl.textContent = val;
      showToast('✅ تم حفظ اسمك بنجاح!');
    }
  });

  document.getElementById('btn-export-backup')?.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(KF_STORE.exportBackup());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `kuro_fangs_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('✅ تم تنزيل ملف النسخة الاحتياطية');
  });

  document.getElementById('input-import-backup')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const success = KF_STORE.importBackup(event.target.result);
        if (success) {
          showToast('🎉 تم استرجاع البيانات بنجاح!');
          setTimeout(() => renderProfile(container, params), 500);
        } else {
          showToast('❌ تعذر قراءة الملف، تأكد من صحته.');
        }
      };
      reader.readAsText(file);
    }
  });

  window.setTheme = (theme, btn) => {
    KF_STORE.setTheme(theme);
    document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    showToast('✅ تم تغيير المظهر');
  };
}

// ── Saved Page ────────────────────────────────────────────────────
export async function renderSaved(container, params) {
  const { default: KF_DATA } = await import('../data.js');
  const { default: KF_STORE } = await import('../store.js');
  const { default: KURONI }   = await import('../kuroni.js');
  if (!KF_DATA.subjects) await KF_DATA.init();

  const savedIds = KF_STORE.getSaved();
  const saved    = savedIds.map(id => KF_DATA.getSheetById(id)).filter(Boolean);

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">المحفوظات 🔖</h1>
      <p class="page-subtitle">الشيتات والملفات التي حفظتها للرجوع السريع</p>
    </div>
    <div class="page-content animate-page-enter">
      ${saved.length === 0
        ? KURONI.emptyHTML('thinking', 'لا توجد محفوظات حالياً', 'اضغط على زر الحفظ في أي ملزمة لتجدها هنا')
        : `<div class="grid-auto">
            ${saved.map((s, i) => sheetCardHTML(s, i, KF_DATA, KF_STORE)).join('')}
          </div>`}
    </div>`;
}

// ── Auth Page (Now a Welcome & Settings Page) ──────────────────────
export async function renderAuth(container, params) {
  const { default: KURONI } = await import('../kuroni.js');
  const { default: KF_STORE } = await import('../store.js');

  container.innerHTML = `
    <div class="page-content animate-page-enter" style="max-width:460px; margin:0 auto; padding-top:var(--space-8); text-align:center;">
      <div class="card" style="padding:var(--space-8);">
        <div class="kuroni-container kuroni-lg" style="margin:0 auto var(--space-4);">
          ${KURONI.getSVG('excited')}
        </div>
        <h1 style="font-size:var(--fs-xl); font-weight:var(--fw-black); margin-bottom:var(--space-2);">منصة Kuro Fangs مفتوحة للجميع 🐾</h1>
        <p style="color:var(--color-text-muted); font-size:var(--fs-sm); margin-bottom:var(--space-6); line-height:1.6;">
          لا حاجة لأي تسجيل دخول أو إنشاء حساب أو كلمة مرور. المنظومة متاحة لكافة طلبة سنة ثالثة طب الأسنان مجاناً وفوراً.
        </p>

        <div style="display:flex; flex-direction:column; gap:var(--space-3); margin-bottom:var(--space-6);">
          <button class="btn btn-primary btn-lg" style="width:100%; font-weight:bold;" onclick="ROUTER.navigate('/')">
            الدخول المباشر للمنظومة 🚀
          </button>
          <button class="btn btn-outline" style="width:100%;" onclick="ROUTER.navigate('/profile')">
            تخصيص اسمي والملف الشخصي
          </button>
        </div>

        <div style="font-size:var(--fs-xs); color:var(--color-text-muted); background:var(--color-surface-sunken); padding:var(--space-3); border-radius:var(--radius-md);">
          🔒 ملاحظاتك، إنجازاتك في المعمل، وحسابات درجاتك تُحفظ مباشرة على جهازك فقط.
        </div>
      </div>
    </div>`;
}

// ── Shared helpers ─────────────────────────────────────────────────
function sheetCardHTML(sheet, idx, KF_DATA, KF_STORE) {
  const doc = KF_DATA?.getDoctorById(sheet.doctor_id);
  const subj = KF_DATA?.getSubjectById(sheet.subject_id);
  const typeIcons = {
    sheet:'📄', summary:'📝', recording:'🎥', images:'🖼️',
    questions:'❓', flashcards:'🃏', quiz:'📋', previous:'📅'
  };
  return `
    <div class="sheet-card animate-card-reveal stagger-${idx + 1} hover-lift hover-press"
         onclick="ROUTER.navigate('/sheets/${sheet.id}')">
      <div class="sheet-type-indicator sheet-type-${sheet.type}">
        ${typeIcons[sheet.type] || '📄'}
      </div>
      <div class="sheet-card-body">
        <div class="sheet-title">${sheet.title_ar}</div>
        <div class="sheet-meta">
          ${doc ? `<span class="sheet-meta-item">${doc.name_ar}</span>` : ''}
          ${subj ? `<span class="sheet-meta-item" style="color:${subj.color}">${subj.name_ar}</span>` : ''}
          <span class="sheet-meta-item">${sheet.date}</span>
        </div>
        <div class="sheet-tags">
          ${sheet.is_exam_focus ? '<span class="tag tag-exam">🎯 امتحان</span>' : ''}
          ${sheet.importance === 3 ? '<span class="tag tag-exam">مهم جداً</span>' : ''}
        </div>
      </div>
    </div>`;
}

function renderSheetList(container, sheets, title, KURONI, KF_DATA, KF_STORE, icon = '📄') {
  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">${title} ${icon}</h1>
      <p class="page-subtitle">${sheets.length} عنصر متاح</p>
    </div>
    <div class="page-content animate-page-enter">
      ${sheets.length === 0
        ? KURONI.emptyHTML('sleepy', 'لا يوجد محتوى بعد', 'سيُضاف المحتوى قريباً')
        : `<div class="grid-auto">
            ${sheets.map((s, i) => sheetCardHTML(s, i, KF_DATA, KF_STORE)).join('')}
          </div>`}
    </div>`;
}
