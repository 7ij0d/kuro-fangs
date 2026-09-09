/**
 * KURO FANGS — Interactive Dental Quizzes Page
 * Full MCQ testing engine with immediate feedback, explanations, and points
 */

export default async function renderQuizzes(container, params) {
  const { default: KF_DATA }  = await import('../data.js');
  const { default: KF_STORE } = await import('../store.js');
  const { default: KURONI }   = await import('../kuroni.js');

  if (!KF_DATA.questions) await KF_DATA.init();

  let activeSubject = 'all';
  let quizState = 'select'; // 'select' | 'playing' | 'result'
  let currentQuestions = [];
  let currentIndex = 0;
  let selectedOption = null;
  let isAnswerSubmitted = false;
  let userAnswers = []; // { qIndex, selected, isCorrect }

  function startQuiz(subjectId) {
    activeSubject = subjectId;
    let pool = KF_DATA.getQuestions(subjectId);
    if (pool.length === 0) pool = KF_DATA.getQuestions('all');
    // Shuffle questions
    currentQuestions = [...pool].sort(() => 0.5 - Math.random()).slice(0, 10);
    currentIndex = 0;
    selectedOption = null;
    isAnswerSubmitted = false;
    userAnswers = [];
    quizState = 'playing';
    renderView();
  }

  function submitAnswer() {
    if (selectedOption === null) return;
    const q = currentQuestions[currentIndex];
    const isCorrect = selectedOption === q.correct;
    isAnswerSubmitted = true;
    userAnswers.push({
      qId: q.id,
      selected: selectedOption,
      correct: q.correct,
      isCorrect
    });
    renderView();
  }

  function nextQuestion() {
    if (currentIndex + 1 < currentQuestions.length) {
      currentIndex++;
      selectedOption = null;
      isAnswerSubmitted = false;
      renderView();
    } else {
      finishQuiz();
    }
  }

  function finishQuiz() {
    quizState = 'result';
    const score = userAnswers.filter(a => a.isCorrect).length;
    const total = currentQuestions.length;
    const pct = Math.round((score / total) * 100);

    // Record in store
    KF_STORE.recordQuiz({
      subjectId: activeSubject,
      score,
      total,
      pct
    });

    renderView();
  }

  function renderView() {
    if (quizState === 'select') {
      renderSelectState();
    } else if (quizState === 'playing') {
      renderPlayingState();
    } else if (quizState === 'result') {
      renderResultState();
    }
  }

  function renderSelectState() {
    const subjects = KF_DATA.getSubjects(3);
    const history = KF_STORE.getQuizHistory();
    const totalQuestions = KF_DATA.getQuestions('all').length;

    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">الكويزات التفاعلية 📋</h1>
        <p class="page-subtitle">اختبر معلوماتك في مقررات سنة ثالثة طب الأسنان مع بنك الأسئلة الذكي</p>
      </div>

      <div class="page-content animate-page-enter">
        <!-- Banner -->
        <div class="card" style="background: linear-gradient(135deg, rgba(180, 212, 85, 0.15), rgba(78, 205, 196, 0.15)); border: 1px solid var(--color-primary-light); margin-bottom: var(--space-6); padding: var(--space-6);">
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:var(--space-4);">
            <div>
              <h2 style="font-size:var(--fs-lg); font-weight:var(--fw-bold); margin-bottom:var(--space-1);">اختبار شامل وسريع (10 أسئلة)</h2>
              <p style="color:var(--color-text-muted); font-size:var(--fs-sm);">مزيج أسئلة من كافة مواد سنة ثالثة لاختبار معلوماتك السريرية والنظرية</p>
            </div>
            <button class="btn btn-primary" id="btn-start-all" style="min-width:140px; font-weight:var(--fw-bold);">
              بدء كويز شامل 🚀
            </button>
          </div>
        </div>

        <!-- Subjects Grid -->
        <div class="section">
          <div class="section-header">
            <h2 class="section-title"><span class="title-dot"></span> كويز مخصص حسب المادة</h2>
          </div>
          <div class="grid-3">
            ${subjects.map(s => {
              const count = KF_DATA.getQuestions(s.id).length;
              return `
                <div class="card hover-lift hover-press animate-card-reveal"
                     style="border-right: 4px solid ${s.color}; cursor:pointer;"
                     data-subject="${s.id}">
                  <div style="font-size:28px; margin-bottom:var(--space-2);">${s.icon}</div>
                  <div class="sheet-title" style="font-size:var(--fs-base);">${s.name_ar}</div>
                  <div style="font-size:var(--fs-xs); color:var(--color-text-muted); margin-top:var(--space-1);">${s.name_en}</div>
                  <div style="margin-top:var(--space-3); display:flex; justify-content:space-between; align-items:center;">
                    <span class="tag tag-neutral">${count > 0 ? `${count} أسئلة متاحة` : 'أسئلة عامة'}</span>
                    <button class="btn btn-sm btn-outline" style="color:${s.color}; border-color:${s.color}55;">بدء الاختبار</button>
                  </div>
                </div>`;
            }).join('')}
          </div>
        </div>

        <!-- Previous Quiz History -->
        ${history.length > 0 ? `
          <div class="section" style="margin-top:var(--space-8);">
            <div class="section-header">
              <h2 class="section-title"><span class="title-dot" style="background:var(--tag-exam)"></span> سجل اختباراتك السابقة</h2>
            </div>
            <div class="card">
              <div style="display:flex; flex-direction:column; gap:var(--space-3);">
                ${history.slice(0, 5).map(h => `
                  <div style="display:flex; align-items:center; justify-content:space-between; padding:var(--space-3); border-bottom:1px solid var(--color-border); last-child:border-none;">
                    <div>
                      <div style="font-weight:var(--fw-semibold); font-size:var(--fs-sm);">
                        ${h.subjectId === 'all' ? 'اختبار شامل لكل المواد' : (KF_DATA.getSubjectById(h.subjectId)?.name_ar || h.subjectId)}
                      </div>
                      <div style="font-size:var(--fs-xs); color:var(--color-text-muted);">${h.date}</div>
                    </div>
                    <div style="display:flex; align-items:center; gap:var(--space-3);">
                      <span class="tag ${h.pct >= 70 ? 'tag-exam' : 'tag-neutral'}">${h.score} / ${h.total} (${h.pct}%)</span>
                    </div>
                  </div>`).join('')}
              </div>
            </div>
          </div>` : ''}
      </div>`;

    document.getElementById('btn-start-all')?.addEventListener('click', () => startQuiz('all'));
    container.querySelectorAll('[data-subject]').forEach(el => {
      el.addEventListener('click', () => startQuiz(el.dataset.subject));
    });
  }

  function renderPlayingState() {
    const q = currentQuestions[currentIndex];
    const total = currentQuestions.length;
    const progressPct = Math.round(((currentIndex + 1) / total) * 100);
    const subj = KF_DATA.getSubjectById(q.subject_id);

    container.innerHTML = `
      <div class="page-content animate-page-enter" style="max-width: 720px; margin: 0 auto; padding-top: var(--space-4);">
        
        <!-- Top Nav / Exit -->
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--space-4);">
          <button class="btn btn-sm btn-ghost" id="btn-exit-quiz">✕ إنهاء والعودة</button>
          <div style="font-size:var(--fs-sm); font-weight:var(--fw-bold); color:var(--color-text-muted);">
            السؤال ${currentIndex + 1} من ${total}
          </div>
          <span class="tag tag-exam">${subj?.name_ar || q.subject_name || 'سنة ثالثة'}</span>
        </div>

        <!-- Progress Bar -->
        <div style="width:100%; height:6px; background:var(--color-border); border-radius:999px; overflow:hidden; margin-bottom:var(--space-6);">
          <div style="width:${progressPct}%; height:100%; background:var(--color-primary-dark); transition: width 300ms ease;"></div>
        </div>

        <!-- Question Card -->
        <div class="card" style="padding:var(--space-6); margin-bottom:var(--space-6); box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
          <div style="font-size:var(--fs-xs); color:var(--color-text-muted); margin-bottom:var(--space-2); text-transform:uppercase; letter-spacing:1px;">
            Question ${currentIndex + 1}
          </div>
          <h2 style="font-size:var(--fs-lg); font-weight:var(--fw-bold); line-height:1.5; margin-bottom:var(--space-3); color:var(--color-text-heading);">
            ${q.question}
          </h2>
          ${q.question_ar ? `
            <div style="font-size:var(--fs-sm); color:var(--color-text-muted); margin-bottom:var(--space-5); line-height:1.6; background:var(--color-surface-sunken); padding:var(--space-3) var(--space-4); border-radius:var(--radius-md);">
              ${q.question_ar}
            </div>` : ''}

          <!-- Options -->
          <div style="display:flex; flex-direction:column; gap:var(--space-3); margin-top:var(--space-4);">
            ${q.options.map((opt, optIdx) => {
              let optStyle = 'border: 1.5px solid var(--color-border); background: var(--color-surface);';
              let optIcon = `<span style="width:24px; height:24px; border-radius:50%; border:1.5px solid var(--color-border); display:inline-flex; align-items:center; justify-content:center; font-size:12px; font-weight:bold; margin-left:var(--space-3);">${String.fromCharCode(65 + optIdx)}</span>`;

              if (!isAnswerSubmitted) {
                if (selectedOption === optIdx) {
                  optStyle = 'border: 2px solid var(--color-primary-dark); background: rgba(180, 212, 85, 0.15); font-weight:var(--fw-semibold);';
                  optIcon = `<span style="width:24px; height:24px; border-radius:50%; background:var(--color-primary-dark); color:#fff; display:inline-flex; align-items:center; justify-content:center; font-size:12px; font-weight:bold; margin-left:var(--space-3);">✓</span>`;
                }
              } else {
                if (optIdx === q.correct) {
                  optStyle = 'border: 2px solid #22c55e; background: rgba(34, 197, 94, 0.15); color: #15803d; font-weight:bold;';
                  optIcon = `<span style="width:24px; height:24px; border-radius:50%; background:#22c55e; color:#fff; display:inline-flex; align-items:center; justify-content:center; font-size:12px; font-weight:bold; margin-left:var(--space-3);">✓</span>`;
                } else if (selectedOption === optIdx) {
                  optStyle = 'border: 2px solid #ef4444; background: rgba(239, 68, 68, 0.15); color: #b91c1c;';
                  optIcon = `<span style="width:24px; height:24px; border-radius:50%; background:#ef4444; color:#fff; display:inline-flex; align-items:center; justify-content:center; font-size:12px; font-weight:bold; margin-left:var(--space-3);">✕</span>`;
                }
              }

              return `
                <div class="quiz-option" data-opt="${optIdx}"
                     style="padding:var(--space-4); border-radius:var(--radius-lg); cursor:${isAnswerSubmitted ? 'default' : 'pointer'}; display:flex; align-items:center; transition:all 150ms ease; ${optStyle}">
                  ${optIcon}
                  <span style="flex:1; font-size:var(--fs-sm);">${opt}</span>
                </div>`;
            }).join('')}
          </div>

          <!-- Explanation box if answered -->
          ${isAnswerSubmitted ? `
            <div style="margin-top:var(--space-5); padding:var(--space-4); border-radius:var(--radius-md); background: ${selectedOption === q.correct ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)'}; border-right: 4px solid ${selectedOption === q.correct ? '#22c55e' : '#ef4444'};">
              <div style="font-weight:var(--fw-bold); font-size:var(--fs-sm); margin-bottom:var(--space-1); color: ${selectedOption === q.correct ? '#166534' : '#991b1b'};">
                ${selectedOption === q.correct ? '🎉 إجابة صحيحة! أحسنت يا دكتور' : '❌ إجابة غير دقيقة! انتبه للتوضيح التالي:'}
              </div>
              <div style="font-size:var(--fs-xs); line-height:1.6; color:var(--color-text);">
                ${q.explanation}
              </div>
            </div>` : ''}
        </div>

        <!-- Action Button -->
        <div style="display:flex; justify-content:flex-end;">
          ${!isAnswerSubmitted ? `
            <button class="btn btn-primary" id="btn-submit-answer" ${selectedOption === null ? 'disabled' : ''} style="min-width:150px;">
              تأكيد الإجابة ↵
            </button>` : `
            <button class="btn btn-primary" id="btn-next-question" style="min-width:150px;">
              ${currentIndex + 1 < total ? 'السؤال التالي ←' : 'عرض النتيجة النهائية 🏆'}
            </button>`}
        </div>

      </div>`;

    document.getElementById('btn-exit-quiz')?.addEventListener('click', () => {
      if (confirm('هل أنت متأكد من إنهاء الاختبار الحالي؟')) {
        quizState = 'select';
        renderView();
      }
    });

    if (!isAnswerSubmitted) {
      container.querySelectorAll('.quiz-option').forEach(el => {
        el.addEventListener('click', () => {
          selectedOption = parseInt(el.dataset.opt);
          renderView();
        });
      });
      document.getElementById('btn-submit-answer')?.addEventListener('click', submitAnswer);
    } else {
      document.getElementById('btn-next-question')?.addEventListener('click', nextQuestion);
    }
  }

  function renderResultState() {
    const score = userAnswers.filter(a => a.isCorrect).length;
    const total = currentQuestions.length;
    const pct = Math.round((score / total) * 100);
    const earnedPoints = Math.round((score / total) * 20);

    let kuroniState = 'excited';
    let resultTitle = 'ممتاز جداً يا دكتور! 🌟';
    let resultMsg = 'إجابات دقيقة تدل على مراجعة وفهم متين للمقرر، واصل هذا التألق!';

    if (pct < 50) {
      kuroniState = 'sleepy';
      resultTitle = 'تحتاج مراجعة إضافية 📚';
      resultMsg = 'لا تقلق، كوروني ينصحك بالاطلاع على الشيتات والملاحظات وإعادة الاختبار لتثبيت المعلومات.';
    } else if (pct < 75) {
      kuroniState = 'calm';
      resultTitle = 'نتيجة جيدة جداً! 👏';
      resultMsg = 'أداء قوي، ركّز على الأسئلة التي أخطأت فيها لتصل إلى الدرجة الكاملة.';
    }

    container.innerHTML = `
      <div class="page-content animate-page-enter" style="max-width: 600px; margin: 0 auto; text-align:center; padding-top:var(--space-6);">
        
        <div class="card" style="padding:var(--space-8); margin-bottom:var(--space-6);">
          <div class="kuroni-container kuroni-xl" style="margin: 0 auto var(--space-4);">
            ${KURONI.getSVG(kuroniState)}
          </div>
          <h1 style="font-size:var(--fs-2xl); font-weight:var(--fw-black); margin-bottom:var(--space-2);">${resultTitle}</h1>
          <p style="color:var(--color-text-muted); font-size:var(--fs-sm); max-width:400px; margin:0 auto var(--space-6); line-height:1.6;">${resultMsg}</p>

          <div style="display:inline-flex; align-items:baseline; gap:var(--space-2); margin-bottom:var(--space-4); background:var(--color-surface-sunken); padding:var(--space-4) var(--space-8); border-radius:var(--radius-xl);">
            <span style="font-size:var(--fs-3xl); font-weight:var(--fw-black); color:var(--color-primary-dark);">${score}</span>
            <span style="font-size:var(--fs-lg); color:var(--color-text-muted);">/ ${total}</span>
            <span style="font-size:var(--fs-base); font-weight:bold; margin-right:var(--space-2); color:var(--tag-exam);">(${pct}%)</span>
          </div>

          <div style="font-size:var(--fs-xs); color:var(--color-text-muted); margin-bottom:var(--space-6);">
            تمت إضافة <strong style="color:var(--color-primary-dark);">+${earnedPoints} نقطة</strong> إلى رصيدك الشخصي ⭐
          </div>

          <div style="display:flex; justify-content:center; gap:var(--space-3); flex-wrap:wrap;">
            <button class="btn btn-primary" id="btn-retry-quiz">إعادة الاختبار 🔄</button>
            <button class="btn btn-outline" id="btn-back-quizzes">العودة لقائمة الكويزات</button>
          </div>
        </div>

      </div>`;

    document.getElementById('btn-retry-quiz')?.addEventListener('click', () => startQuiz(activeSubject));
    document.getElementById('btn-back-quizzes')?.addEventListener('click', () => {
      quizState = 'select';
      renderView();
    });
  }

  // Initial render
  renderView();
}
