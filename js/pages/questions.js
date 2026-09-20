/**
 * KURO FANGS — INTERACTIVE QUESTION BANK & DENTISTOIRE-STYLE QUIZ ENGINE
 * 3-Level Dental Curriculum Architecture: Subjects Bento -> Sheets Bento -> Modal Quiz Runner
 * Bilingual (AR/EN), Immediate Clinical Feedback, Saved & Weak Questions Restudy Hub
 */

const QuestionsPage = {
  currentTab: 'bento', // 'bento' | 'direct' | 'saved'
  selectedSubjectId: null,
  activeQuizList: [],
  activeQuizIndex: 0,
  searchQuery: '',
  pendingSheetQuestions: [],   // Questions pending type filter selection
  pendingSubjectTitle: '',     // Subject + sheet title for pending quiz
  kuroExplanationOpen: false,  // Interactive mascot explanation pane state
  hasCurrentQuestionBeenAnswered: false,
  isCurrentQuestionAnswerCorrect: false,

  getQuestions() {
    if (window.DATA && Array.isArray(window.DATA.questions) && window.DATA.questions.length > 0) {
      return window.DATA.questions;
    }
    if (window.DATA && typeof window.DATA.getDefaultQuestions === 'function') {
      window.DATA.questions = window.DATA.getDefaultQuestions();
      return window.DATA.questions;
    }
    return [];
  },

  getSavedQuestions() {
    try {
      return JSON.parse(localStorage.getItem('kf_saved_quizzes') || '[]');
    } catch (e) {
      return [];
    }
  },

  getWeakQuestions() {
    try {
      return JSON.parse(localStorage.getItem('kf_weak_quizzes') || '[]');
    } catch (e) {
      return [];
    }
  },

  saveQuestion(question) {
    try {
      const saved = QuestionsPage.getSavedQuestions();
      const existsIdx = saved.findIndex(q => q.id === question.id);
      if (existsIdx === -1) {
        saved.push(question);
        localStorage.setItem('kf_saved_quizzes', JSON.stringify(saved));
        if (window.Toast) window.Toast.show('★ تم حفظ السؤال بنجاح', 'success');
        return true;
      } else {
        saved.splice(existsIdx, 1);
        localStorage.setItem('kf_saved_quizzes', JSON.stringify(saved));
        if (window.Toast) window.Toast.show('تمت إزالة السؤال من المحفوظات', 'info');
        return false;
      }
    } catch (e) {
      return false;
    }
  },

  recordWeakQuestion(question) {
    try {
      const weak = QuestionsPage.getWeakQuestions();
      if (!weak.some(q => q.id === question.id)) {
        weak.push(question);
        localStorage.setItem('kf_weak_quizzes', JSON.stringify(weak));
      }
    } catch (e) {}
  },

  render(container, queryParams) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
    const initialSubject = queryParams?.get('subject') || null;
    if (initialSubject && initialSubject !== 'all') {
      QuestionsPage.selectedSubjectId = initialSubject;
    }
    const allQuestions = QuestionsPage.getQuestions();

    container.innerHTML = `
      <!-- TOP COMMAND BAR & MODE SWITCHER -->
      <div class="kf-panel" style="margin-bottom: 24px; padding: 20px 24px; border-radius: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="width: 58px; height: 58px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle, rgba(200, 67, 67, 0.12) 0%, transparent 70%);">
              <img src="${window.CharacterThemeSystem ? window.CharacterThemeSystem.getAsset('thinking') : 'assets/characters/kuro/Kuro-Thinking.png'}" alt="Kuro Thinking" class="kuro-character-img kuro-float" style="width: 52px; height: 52px; object-fit: contain;" />
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <span class="kf-segmented-badge" style="background: rgba(200, 67, 67, 0.08); color: var(--color-primary); border-color: rgba(200, 67, 67, 0.25); font-weight: 800;">
                  <i data-lucide="layers" style="width: 13px; height: 13px;"></i>
                  ${isAr ? 'نظام الأسئلة الموحد' : 'Unified Questions Engine'}
                </span>
                <span class="kf-segmented-badge" id="q-total-counter">${allQuestions.length} ${isAr ? 'سؤال معتمد' : 'MCQs'}</span>
              </div>
              <h1 style="font-size: 1.45rem; font-weight: 850; color: var(--text-primary); margin: 0;">
                ${isAr ? 'الأسئلة — سنوات سابقة وبنك الأسئلة' : 'Questions — Past Exams & Practice Bank'}
              </h1>
            </div>
          </div>

          <!-- Mode Switcher Tabs -->
          <div class="kf-segmented-scroll" style="margin: 0;">
            <button class="kf-tab-pill ${QuestionsPage.currentTab === 'bento' ? 'active' : ''}" data-tab="bento">
              <i data-lucide="layout-grid" style="width: 14px; height: 14px;"></i>
              <span>${isAr ? 'المربعات (المواد والشيتات)' : 'Curriculum Bento'}</span>
            </button>
            <button class="kf-tab-pill ${QuestionsPage.currentTab === 'direct' ? 'active' : ''}" data-tab="direct">
              <i data-lucide="list-filter" style="width: 14px; height: 14px;"></i>
              <span>${isAr ? 'قائمة الأسئلة والبحث' : 'All Questions Search'}</span>
            </button>
            <button class="kf-tab-pill ${QuestionsPage.currentTab === 'saved' ? 'active' : ''}" data-tab="saved">
              <i data-lucide="star" style="width: 14px; height: 14px;"></i>
              <span>${isAr ? 'الأسئلة المحفوظة' : 'Saved Questions'}</span>
            </button>
          </div>
        </div>

        <!-- Live Search Bar for Direct Mode -->
        <div id="q-search-wrapper" style="display: ${QuestionsPage.currentTab === 'direct' ? 'block' : 'none'};">
          <div style="position: relative; max-width: 600px;">
            <i data-lucide="search" style="position: absolute; top: 12px; inset-inline-start: 14px; width: 16px; height: 16px; color: var(--text-muted);"></i>
            <input type="text" id="q-search-input" placeholder="${isAr ? 'ابحث في نصوص الأسئلة، الكلمات المفتاحية، أو المواد...' : 'Search questions, clinical tags, or subjects...'}" style="width: 100%; padding: 10px 14px; padding-inline-start: 40px; border-radius: 9px; border: 1px solid var(--border-subtle); background: var(--bg-surface-subtle); font-size: 0.85rem; color: var(--text-primary);" />
          </div>
        </div>
      </div>

      <!-- DYNAMIC CONTENT CONTAINER -->
      <div id="questions-main-content"></div>

      <!-- DENTISTOIRE-GRADE LUXURY MODAL QUIZ RUNNER (OVERLAY) -->
      <div id="dt-quiz-runner-modal" class="dt-quiz-overlay" style="display: none;">
        <div class="dt-quiz-stage-container" id="dt-quiz-stage-container">
          <!-- MAIN CARD: QUESTION & OPTIONS -->
          <div class="dt-quiz-card" id="dt-quiz-card-box">
            <!-- Header Bar -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; gap: 10px; flex-wrap: wrap;">
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <span class="kf-segmented-badge" style="background: rgba(2, 132, 199, 0.08); color: var(--brand-accent); font-weight: 800;" id="dt-modal-subject-tag">
                  Oral Medicine
                </span>
                <span class="kf-segmented-badge" style="background: rgba(200, 67, 67, 0.08); color: #C84343; font-weight: 800;" id="dt-modal-sheet-tag">
                  Sheet 1
                </span>
                <span class="kf-segmented-badge" style="background: var(--bg-surface-subtle); color: var(--text-secondary); font-weight: 700; display: none;" id="dt-modal-page-tag">
                  Page 4
                </span>
                <span style="font-size: 0.775rem; font-weight: 700; color: var(--text-secondary);" id="dt-modal-counter">
                  Question 1 of 9
                </span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <button type="button" id="dt-btn-star" class="btn btn-secondary btn-sm" style="font-size: 0.75rem; padding: 6px 12px; gap: 6px;">
                  <i data-lucide="star" style="width: 14px; height: 14px;"></i>
                  <span id="dt-star-text">${isAr ? 'حفظ للمراجعة' : 'Save'}</span>
                </button>
                <button type="button" id="dt-btn-exit" class="btn btn-secondary btn-sm" style="font-size: 0.75rem; padding: 6px 12px; color: #EF4444; border-color: rgba(239, 68, 68, 0.3);">
                  <i data-lucide="x" style="width: 14px; height: 14px;"></i>
                  <span>${isAr ? 'خروج' : 'Exit'}</span>
                </button>
              </div>
            </div>

            <!-- Progress Bar -->
            <div style="width: 100%; height: 5px; border-radius: 99px; background: var(--bg-surface-subtle); overflow: hidden; margin-bottom: 22px; border: 1px solid var(--border-subtle);">
              <div id="dt-modal-progress-bar" style="height: 100%; width: 10%; background: var(--brand-accent); border-radius: 99px; transition: width 0.25s ease;"></div>
            </div>

            <!-- Question Title -->
            <h2 id="dt-modal-q-title" style="font-size: 1.12rem; font-weight: 800; color: var(--text-primary); margin: 0 0 20px; line-height: 1.6; text-align: start;">
              Question text goes here
            </h2>

            <!-- Vertical Tappable Option Buttons -->
            <div id="dt-modal-options-box" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 22px;">
              <!-- Options dynamically injected -->
            </div>

            <!-- Navigation Controls -->
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; border-top: 1px solid var(--border-subtle); padding-top: 18px;">
              <button type="button" id="dt-btn-prev" class="btn btn-secondary btn-sm" style="font-weight: 700; gap: 6px; padding: 8px 16px;">
                <i data-lucide="${isAr ? 'arrow-right' : 'arrow-left'}" style="width: 14px; height: 14px;"></i>
                <span>${isAr ? 'السابق' : 'Previous'}</span>
              </button>
              <button type="button" id="dt-btn-next" class="btn btn-primary btn-sm" style="font-weight: 700; gap: 6px; padding: 8px 20px;">
                <span>${isAr ? 'التالي' : 'Next'}</span>
                <i data-lucide="${isAr ? 'arrow-left' : 'arrow-right'}" style="width: 14px; height: 14px;"></i>
              </button>
            </div>
          </div>

          <!-- SECONDARY STAGE: LARGE KURO COMPANION & NON-OBSCURING EXPLANATION WING -->
          <aside class="dt-kuro-companion-stage" id="dt-kuro-companion-stage" aria-label="Kuro Study Companion">
            <!-- Clickable Large Kuro Character Avatar -->
            <button type="button" class="dt-kuro-mascot-trigger" id="dt-kuro-mascot-trigger" title="${isAr ? 'انقر على كورو لإظهار أو إخفاء الشرح السريري المعتمد' : 'Click Kuro to toggle verified faculty explanation'}" aria-expanded="false">
              <div class="dt-kuro-avatar-frame">
                <img id="dt-kuro-mascot-img" class="dt-kuro-mascot-img" src="assets/characters/kuro/Kuro-Thinking.png" alt="Kuro Character Companion" />
                <span class="dt-kuro-pulse-ring"></span>
              </div>
              <div class="dt-kuro-bubble-callout" id="dt-kuro-bubble-callout">
                <span class="dt-kuro-bubble-icon">💡</span>
                <span class="dt-kuro-bubble-text" id="dt-kuro-bubble-text">${isAr ? 'انقر على كورو للشرح السريري' : 'Click Kuro for Explanation'}</span>
              </div>
            </button>

            <!-- Slide-out / Expandable Explanation Panel (Sits beside Kuro, NOT covering the question card!) -->
            <div class="dt-kuro-explanation-pane" id="dt-kuro-explanation-pane" style="display: none;">
              <div class="dt-kuro-exp-header">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <div class="dt-kuro-exp-badge-icon">
                    <i data-lucide="book-open" style="width: 16px; height: 16px; color: var(--brand-accent);"></i>
                  </div>
                  <div>
                    <div style="font-size: 0.88rem; font-weight: 800; color: var(--text-primary);">${isAr ? 'شرح كورو والكلية المعتمد' : 'Faculty Explanation'}</div>
                    <div id="dt-kuro-exp-ref-subtitle" style="font-size: 0.73rem; color: var(--brand-accent); font-weight: 700;"></div>
                  </div>
                </div>
                <button type="button" class="dt-kuro-exp-close-btn" id="dt-kuro-exp-close-btn" title="${isAr ? 'إغلاق الشرح' : 'Close Explanation'}">
                  <i data-lucide="x" style="width: 14px; height: 14px;"></i>
                </button>
              </div>

              <div class="dt-kuro-exp-body">
                <!-- Faculty Model Answer & Detailed Breakdown -->
                <div class="dt-kuro-answer-highlight" id="dt-kuro-model-answer"></div>

                <!-- Sheet Verbatim Quote Box -->
                <div class="dt-kuro-sheet-quote-box" id="dt-kuro-sheet-quote-box" style="display: none;">
                  <div class="dt-kuro-quote-header">
                    <i data-lucide="quote" style="width: 12px; height: 12px; color: var(--brand-accent);"></i>
                    <span id="dt-kuro-quote-label">${isAr ? 'نص الشيت الرسمي المعتمد:' : 'Official Sheet Quote:'}</span>
                  </div>
                  <div class="dt-kuro-quote-text" id="dt-kuro-quote-text"></div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <!-- QUESTION TYPE SELECTOR MODAL -->
      <div id="qt-type-selector-modal" class="dt-quiz-overlay" style="display: none;">
        <div class="dt-quiz-card" style="max-width: 440px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="width: 52px; height: 52px; border-radius: 14px; background: rgba(2, 132, 199, 0.08); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 14px;">
              <i data-lucide="filter" style="width: 24px; height: 24px; color: var(--brand-accent);"></i>
            </div>
            <h2 style="font-size: 1.2rem; font-weight: 850; color: var(--text-primary); margin: 0 0 6px;">
              ${isAr ? 'اختر نوع الأسئلة' : 'Select Question Type'}
            </h2>
            <p id="qt-sheet-name-label" style="font-size: 0.825rem; color: var(--text-secondary); margin: 0; font-weight: 500;"></p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 22px;">
            <button type="button" class="qt-type-option" data-qtype="past_exam" style="display: flex; align-items: center; gap: 14px; padding: 14px 18px; border-radius: 12px; border: 1px solid var(--border-subtle); background: var(--bg-card); cursor: pointer; transition: all var(--transition-fast); text-align: start;">
              <div style="width: 40px; height: 40px; border-radius: 10px; background: rgba(239, 68, 68, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <i data-lucide="file-check-2" style="width: 18px; height: 18px; color: #EF4444;"></i>
              </div>
              <div>
                <div style="font-size: 0.9rem; font-weight: 750; color: var(--text-primary);">${isAr ? 'أسئلة سنوات سابقة' : 'Past Exam Questions'}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 500;">${isAr ? 'أسئلة من الامتحانات النهائية والنصفية السابقة' : 'Questions from previous midterm & final exams'}</div>
              </div>
            </button>

            <button type="button" class="qt-type-option" data-qtype="practice" style="display: flex; align-items: center; gap: 14px; padding: 14px 18px; border-radius: 12px; border: 1px solid var(--border-subtle); background: var(--bg-card); cursor: pointer; transition: all var(--transition-fast); text-align: start;">
              <div style="width: 40px; height: 40px; border-radius: 10px; background: rgba(16, 185, 129, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <i data-lucide="brain" style="width: 18px; height: 18px; color: #10B981;"></i>
              </div>
              <div>
                <div style="font-size: 0.9rem; font-weight: 750; color: var(--text-primary);">${isAr ? 'أسئلة أخرى / بنك الأسئلة' : 'Practice / Question Bank'}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 500;">${isAr ? 'أسئلة تدريبية وبنك الأسئلة الذكي' : 'AI-generated practice & test questions'}</div>
              </div>
            </button>

            <button type="button" class="qt-type-option" data-qtype="all" style="display: flex; align-items: center; gap: 14px; padding: 14px 18px; border-radius: 12px; border: 1px solid var(--border-subtle); background: var(--bg-card); cursor: pointer; transition: all var(--transition-fast); text-align: start;">
              <div style="width: 40px; height: 40px; border-radius: 10px; background: rgba(2, 132, 199, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <i data-lucide="layers" style="width: 18px; height: 18px; color: var(--brand-accent);"></i>
              </div>
              <div>
                <div style="font-size: 0.9rem; font-weight: 750; color: var(--text-primary);">${isAr ? 'الكل — كلاهما معاً' : 'Both — All Questions'}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 500;">${isAr ? 'عرض جميع الأسئلة المتاحة لهذا الشيت' : 'Show all available questions for this sheet'}</div>
              </div>
            </button>
          </div>

          <button type="button" id="qt-cancel-btn" class="btn btn-secondary" style="width: 100%; justify-content: center; padding: 10px; font-weight: 700; gap: 6px;">
            <i data-lucide="x" style="width: 14px; height: 14px;"></i>
            <span>${isAr ? 'إلغاء' : 'Cancel'}</span>
          </button>
        </div>
      </div>
    `;

    QuestionsPage.bindEvents(container);
    QuestionsPage.renderCurrentView();
  },

  bindEvents(container) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;

    // Mode tabs
    container.querySelectorAll('.kf-tab-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.kf-tab-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        QuestionsPage.currentTab = btn.getAttribute('data-tab');
        
        const searchWrap = document.getElementById('q-search-wrapper');
        if (searchWrap) {
          searchWrap.style.display = QuestionsPage.currentTab === 'direct' ? 'block' : 'none';
        }
        QuestionsPage.renderCurrentView();
      });
    });

    // Search box
    const searchIn = document.getElementById('q-search-input');
    if (searchIn) {
      searchIn.addEventListener('input', (e) => {
        QuestionsPage.searchQuery = e.target.value.trim().toLowerCase();
        if (QuestionsPage.currentTab === 'direct') {
          QuestionsPage.renderDirectView();
        }
      });
    }

    // Modal quiz buttons
    document.getElementById('dt-btn-exit')?.addEventListener('click', () => {
      QuestionsPage.closeQuizModal();
    });

    document.getElementById('dt-btn-star')?.addEventListener('click', () => {
      const q = QuestionsPage.activeQuizList[QuestionsPage.activeQuizIndex];
      if (q) {
        QuestionsPage.saveQuestion(q);
        QuestionsPage.updateStarButton(q);
        if (window.SoundFX) window.SoundFX.play('badge');
      }
    });

    document.getElementById('dt-btn-next')?.addEventListener('click', () => {
      if (QuestionsPage.activeQuizIndex < QuestionsPage.activeQuizList.length - 1) {
        QuestionsPage.activeQuizIndex++;
        QuestionsPage.renderModalQuestion();
        if (window.SoundFX) window.SoundFX.play('tap');
      } else {
        if (window.SoundFX) window.SoundFX.play('victory');
        if (window.Toast) window.Toast.show(isAr ? '🎉 أكملت جميع أسئلة هذا الاختبار بنجاح!' : 'You completed all questions!', 'success');
        QuestionsPage.closeQuizModal();
      }
    });

    document.getElementById('dt-btn-prev')?.addEventListener('click', () => {
      if (QuestionsPage.activeQuizIndex > 0) {
        QuestionsPage.activeQuizIndex--;
        QuestionsPage.renderModalQuestion();
      }
    });

    // Mascot click toggle & explanation close
    document.getElementById('dt-kuro-mascot-trigger')?.addEventListener('click', () => {
      QuestionsPage.toggleKuroExplanation();
    });

    document.getElementById('dt-kuro-exp-close-btn')?.addEventListener('click', () => {
      QuestionsPage.toggleKuroExplanation(false);
    });

    // Question Type Selector Modal
    document.getElementById('qt-cancel-btn')?.addEventListener('click', () => {
      QuestionsPage.closeTypeSelector();
    });

    container.querySelectorAll('.qt-type-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const qtype = btn.getAttribute('data-qtype');
        const pending = QuestionsPage.pendingSheetQuestions;
        let filtered;

        if (qtype === 'past_exam') {
          filtered = pending.filter(q => q.type === 'past_exam' || q.source === 'past_exam');
        } else if (qtype === 'practice') {
          filtered = pending.filter(q => q.type !== 'past_exam' && q.source !== 'past_exam');
        } else {
          filtered = [...pending]; // 'all'
        }

        QuestionsPage.closeTypeSelector();

        if (filtered.length > 0) {
          QuestionsPage.launchQuizRunner(filtered, QuestionsPage.pendingSubjectTitle);
        } else {
          // If no questions match the filter, show all and notify
          if (window.Toast) {
            window.Toast.show(
              isAr ? 'لا توجد أسئلة من هذا النوع، سيتم عرض جميع الأسئلة المتاحة.' : 'No questions of this type found. Showing all available questions.',
              'info'
            );
          }
          if (pending.length > 0) {
            QuestionsPage.launchQuizRunner(pending, QuestionsPage.pendingSubjectTitle);
          }
        }
      });
    });
  },

  renderCurrentView() {
    if (QuestionsPage.currentTab === 'bento') {
      QuestionsPage.renderBentoView();
    } else if (QuestionsPage.currentTab === 'direct') {
      QuestionsPage.renderDirectView();
    } else if (QuestionsPage.currentTab === 'saved') {
      QuestionsPage.renderSavedView();
    }
  },

  // 1. LEVEL 1 & 2: BENTO CURRICULUM ARCHITECTURE
  renderBentoView() {
    const mainEl = document.getElementById('questions-main-content');
    if (!mainEl) return;
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
    const allQuestions = QuestionsPage.getQuestions();
    const subjects = window.DATA ? window.DATA.getSubjects() : [];

    // If a subject is selected, show Level 2 (Sheets & Topics Grid)
    if (QuestionsPage.selectedSubjectId) {
      const subject = subjects.find(s => s.id === QuestionsPage.selectedSubjectId) || {
        id: QuestionsPage.selectedSubjectId,
        name_ar: 'المقرر الأكاديمي',
        name_en: 'Academic Subject'
      };

      const subjQuestions = allQuestions.filter(q => q.subject_id === QuestionsPage.selectedSubjectId);
      
      // Group questions by sheet/topic, initializing with ALL sheets first, with robust deduplication
      const allSheets = window.DATA.getSheetsBySubject ? window.DATA.getSheetsBySubject(QuestionsPage.selectedSubjectId) : [];
      
      const normalizeTitle = (t) => {
        if (!t) return '';
        return String(t).toLowerCase()
          .replace(/sheet\s*\d+\s*[:\-–—]?/gi, '')
          .replace(/الشيت\s*\d+\s*[:\-–—]?/gi, '')
          .replace(/[^\w\s\u0600-\u06FF]/gi, '')
          .trim();
      };

      const sheetEntries = []; // Array of { id, titleAr, titleEn, displayTitle, normTitle, pdf_url, questions: [] }

      allSheets.forEach(sheet => {
        const titleAr = sheet.title_ar || sheet.title || '';
        const titleEn = sheet.title_en || sheet.title || '';
        const displayTitle = isAr ? (titleAr || titleEn) : (titleEn || titleAr);
        const norm = normalizeTitle(displayTitle) || normalizeTitle(sheet.title_en) || normalizeTitle(sheet.title_ar);

        let existing = sheetEntries.find(e => e.id === sheet.id || (norm && e.normTitle === norm));
        if (existing) {
          if (sheet.pdf_url) existing.pdf_url = sheet.pdf_url;
          if (displayTitle.length > existing.displayTitle.length) {
            existing.displayTitle = displayTitle;
            existing.titleAr = titleAr;
            existing.titleEn = titleEn;
          }
        } else {
          sheetEntries.push({
            id: sheet.id,
            titleAr,
            titleEn,
            displayTitle,
            normTitle: norm,
            pdf_url: sheet.pdf_url,
            questions: []
          });
        }
      });

      subjQuestions.forEach(q => {
        let qTitle = isAr ? (q.sheet_title_ar || q.tags?.[0] || '') : (q.sheet_title_en || q.tags?.[0] || '');
        if (!qTitle) qTitle = q.sheet_title_en || q.sheet_title_ar || '';
        const qNorm = normalizeTitle(qTitle) || normalizeTitle(q.sheet_title_en) || normalizeTitle(q.sheet_title_ar);

        let target = null;
        if (q.sheet_id) {
          target = sheetEntries.find(e => e.id === q.sheet_id || (q.sheet_id === 'sh-omdr-01' && e.id === 'sh_admin_1789462201436'));
        }
        if (!target && qNorm) {
          target = sheetEntries.find(e => e.normTitle === qNorm);
        }
        if (!target && qTitle) {
          target = sheetEntries.find(e => e.displayTitle.toLowerCase().includes(qTitle.toLowerCase()) || qTitle.toLowerCase().includes(e.displayTitle.toLowerCase()));
        }

        if (target) {
          target.questions.push(q);
        } else {
          const fallbackTitle = qTitle || (isAr ? 'الأسئلة العامة' : 'General Questions');
          let fallback = sheetEntries.find(e => e.displayTitle === fallbackTitle);
          if (!fallback) {
            fallback = {
              id: q.sheet_id || null,
              titleAr: q.sheet_title_ar || fallbackTitle,
              titleEn: q.sheet_title_en || fallbackTitle,
              displayTitle: fallbackTitle,
              normTitle: qNorm,
              questions: []
            };
            sheetEntries.push(fallback);
          }
          fallback.questions.push(q);
        }
      });

      mainEl.innerHTML = `
        <!-- Breadcrumb back navigation -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; gap: 12px; flex-wrap: wrap;">
          <button type="button" id="btn-back-to-subjects" class="btn btn-secondary btn-sm" style="font-weight: 750; gap: 6px;">
            <i data-lucide="${isAr ? 'arrow-right' : 'arrow-left'}" style="width: 15px; height: 15px;"></i>
            <span>${isAr ? 'الرجوع لكافة المواد' : 'Back to All Subjects'}</span>
          </button>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="kf-segmented-badge" style="font-weight: 800; color: var(--brand-accent); background: rgba(2, 132, 199, 0.08);">
              ${isAr ? subject.name_ar : subject.name_en}
            </span>
            <span class="kf-segmented-badge">${subjQuestions.length} ${isAr ? 'سؤال' : 'Questions'}</span>
          </div>
        </div>

        <div style="margin-bottom: 16px;">
          <h2 style="font-size: 1.35rem; font-weight: 850; color: var(--text-primary); margin: 0 0 6px;">
            ${isAr ? `شيتات ومحاضرات ${subject.name_ar}` : `${subject.name_en} Lecture Sheets`}
          </h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
            ${isAr ? 'اختر الشيت لبدء محاكاة امتحانية سريعة على كارت السؤال المبوب مع التصحيح الفوري.' : 'Select a sheet or topic to launch an interactive quiz runner.'}
          </p>
        </div>

        ${sheetEntries.length === 0 ? `
          <div class="kf-panel" style="padding: 40px; text-align: center;">
            <p style="color: var(--text-secondary); font-size: 0.9rem;">
              ${isAr ? 'لا توجد أسئلة أو شيتات مضافة حالياً لهذه المادة.' : 'No questions or sheets available for this subject yet.'}
            </p>
          </div>
        ` : `
          <div class="bento-sheet-grid">
            ${sheetEntries.map((entry, idx) => {
              const qList = entry.questions;
              const hasQuestions = qList.length > 0;
              return `
                <div class="bento-sheet-box ${hasQuestions ? '' : 'empty-sheet-box'}">
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                      <span class="kf-segmented-badge" style="font-size: 0.7rem; font-weight: 800; color: var(--brand-accent); background: rgba(2, 132, 199, 0.08);">
                        ${isAr ? 'شيت معتمد' : 'Official Sheet'}
                      </span>
                      <span class="kf-segmented-badge" style="${!hasQuestions ? 'background: var(--bg-surface-subtle); color: var(--text-muted);' : ''}">
                        ${qList.length} ${isAr ? 'أسئلة' : 'MCQs'}
                      </span>
                    </div>
                    <h3 style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary); margin: 0 0 8px; line-height: 1.4; ${!hasQuestions ? 'opacity: 0.7;' : ''}">
                      ${entry.displayTitle}
                    </h3>
                    <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0 0 16px; line-height: 1.5; ${!hasQuestions ? 'opacity: 0.7;' : ''}">
                      ${hasQuestions 
                        ? (isAr ? `تدرب على ${qList.length} أسئلة امتحانية منتقاة لهذا الشيت مع تعليلات سريرية.` : `Practice ${qList.length} verified faculty questions for this lecture.`)
                        : (isAr ? 'قريباً... جاري تجهيز الأسئلة لهذا الشيت' : 'Coming soon... questions are being prepared for this sheet')
                      }
                    </p>
                  </div>
                  <button type="button" class="btn ${hasQuestions ? 'btn-primary' : 'btn-secondary'} btn-sm btn-start-sheet-quiz" data-entry-idx="${idx}" style="width: 100%; justify-content: center; font-weight: 750; gap: 8px; padding: 10px;" ${!hasQuestions ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                    <i data-lucide="${hasQuestions ? 'play' : 'clock'}" style="width: 14px; height: 14px;"></i>
                    <span>${hasQuestions ? (isAr ? 'ابدأ الاختبار السريع' : 'Start Sheet Quiz') : (isAr ? 'غير متاح حالياً' : 'Not Available')}</span>
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        `}
      `;

      if (window.lucide) window.lucide.createIcons();

      document.getElementById('btn-back-to-subjects')?.addEventListener('click', () => {
        QuestionsPage.selectedSubjectId = null;
        QuestionsPage.renderBentoView();
      });

      mainEl.querySelectorAll('.btn-start-sheet-quiz').forEach(btn => {
        btn.addEventListener('click', () => {
          if (btn.hasAttribute('disabled')) return;
          const idx = parseInt(btn.getAttribute('data-entry-idx'), 10);
          const entry = sheetEntries[idx];
          if (entry && entry.questions.length > 0) {
            QuestionsPage.showTypeSelector(
              entry.questions,
              `${isAr ? subject.name_ar : subject.name_en} • ${entry.displayTitle}`
            );
          }
        });
      });

      return;
    }

    // LEVEL 1: ALL SUBJECTS BENTO GRID ("المربعات")
    const subjectStats = {};
    allQuestions.forEach(q => {
      subjectStats[q.subject_id] = (subjectStats[q.subject_id] || 0) + 1;
    });

    const subjectIcons = {
      'fixed-pros': 'crown',
      'oral-diseases': 'microscope',
      'endo': 'activity',
      'omfs': 'scissors',
      'cons-endo': 'sparkles',
      'gen-med': 'stethoscope',
      'preventive': 'shield-check',
      'removable-pros': 'layers',
      'omdr': 'scan-line',
      'ortho': 'smile',
      'pedo': 'heart',
      'gen-surgery': 'scalpel'
    };

    mainEl.innerHTML = `
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 1.25rem; font-weight: 850; color: var(--text-primary); margin: 0 0 6px;">
          ${isAr ? 'مواد طب الأسنان (المربعات التعليمية)' : 'Dental Curriculum Subjects'}
        </h2>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
          ${isAr ? 'انقر على أي مادة لاستعراض شيتاتها وخوض اختبارات سريعة على كروت الأسئلة المطابقة لنظام Dentistoire.' : 'Choose a dental module to browse lecture-linked MCQs and test your knowledge.'}
        </p>
      </div>

      <div class="bento-subject-grid">
        ${subjects.map(s => {
          const qCount = subjectStats[s.id] || 0;
          const icon = subjectIcons[s.id] || 'book-open';
          const title = isAr ? s.name_ar : s.name_en;
          const desc = isAr ? s.description_ar : s.description_en;

          return `
            <div class="bento-subject-box" data-subj-id="${s.id}">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px;">
                  <div class="bento-icon-badge">
                    <i data-lucide="${icon}" style="width: 22px; height: 22px;"></i>
                  </div>
                  <span class="kf-segmented-badge" style="background: ${qCount > 0 ? 'rgba(2, 132, 199, 0.08)' : 'var(--bg-surface-subtle)'}; color: ${qCount > 0 ? 'var(--brand-accent)' : 'var(--text-muted)'}; font-weight: 800;">
                    ${qCount} ${isAr ? 'سؤال' : 'MCQs'}
                  </span>
                </div>
                <h3 style="font-size: 1.08rem; font-weight: 800; color: var(--text-primary); margin: 0 0 6px; line-height: 1.4;">
                  ${title}
                </h3>
                <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0 0 16px; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                  ${desc}
                </p>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 12px; margin-top: 12px;">
                <span style="font-size: 0.775rem; font-weight: 700; color: var(--brand-accent);">
                  ${isAr ? 'استعراض الشيتات والأسئلة' : 'Open Subject Sheets'}
                </span>
                <i data-lucide="${isAr ? 'arrow-left' : 'arrow-right'}" style="width: 14px; height: 14px; color: var(--brand-accent);"></i>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    mainEl.querySelectorAll('.bento-subject-box').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-subj-id');
        QuestionsPage.selectedSubjectId = id;
        QuestionsPage.renderBentoView();
      });
    });
  },

  // 2. DIRECT SEARCH & FULL LIST VIEW
  renderDirectView() {
    const mainEl = document.getElementById('questions-main-content');
    if (!mainEl) return;
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
    let list = QuestionsPage.getQuestions();

    if (QuestionsPage.searchQuery) {
      const q = QuestionsPage.searchQuery;
      list = list.filter(item => 
        (item.text_ar && item.text_ar.toLowerCase().includes(q)) ||
        (item.text_en && item.text_en.toLowerCase().includes(q)) ||
        (item.tags && item.tags.some(t => t.toLowerCase().includes(q))) ||
        (item.subject_name_ar && item.subject_name_ar.toLowerCase().includes(q)) ||
        (item.subject_name_en && item.subject_name_en.toLowerCase().includes(q))
      );
    }

    if (list.length === 0) {
      mainEl.innerHTML = `
        <div class="kf-panel" style="text-align: center; padding: 48px 24px;">
          <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary); margin-bottom: 6px;">
            ${isAr ? 'لم يتم العثور على أسئلة تطابق بحثك' : 'No questions matching search'}
          </h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary);">
            ${isAr ? 'جرّب كتابة كلمة أخرى أو تصفح المواد من تبويب المربعات.' : 'Try a different keyword or browse through the Bento grid.'}
          </p>
        </div>
      `;
      return;
    }

    mainEl.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <span style="font-size: 0.825rem; font-weight: 700; color: var(--text-secondary);">
          ${isAr ? `عرض ${list.length} سؤال` : `Showing ${list.length} questions`}
        </span>
        <button type="button" id="btn-launch-all-quiz" class="btn btn-primary btn-sm" style="font-weight: 750; gap: 6px;">
          <i data-lucide="play" style="width: 14px; height: 14px;"></i>
          <span>${isAr ? 'اختبار تفاعلي على هذه النتائج' : 'Test These Questions'}</span>
        </button>
      </div>

      <div style="display: grid; gap: 14px;">
        ${list.map((q, idx) => {
          const text = isAr ? q.text_ar : q.text_en;
          const subject = isAr ? q.subject_name_ar : q.subject_name_en;
          const optLetters = ['A', 'B', 'C', 'D'];

          return `
            <div class="kf-panel q-card" style="padding: 18px 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; gap: 8px; flex-wrap: wrap;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="kf-segmented-badge" style="font-weight: 800; color: var(--brand-accent);">#${idx + 1}</span>
                  <span style="font-size: 0.8rem; font-weight: 750; color: var(--text-primary);">${subject}</span>
                </div>
                <button type="button" class="btn btn-secondary btn-sm btn-single-test" data-qid="${q.id}" style="font-size: 0.75rem; padding: 5px 12px; gap: 6px;">
                  <i data-lucide="external-link" style="width: 12px; height: 12px;"></i>
                  <span>${isAr ? 'خوض السؤال' : 'Launch'}</span>
                </button>
              </div>

              <h4 style="font-size: 0.98rem; font-weight: 750; color: var(--text-primary); margin: 0 0 14px; line-height: 1.5;">
                ${text}
              </h4>

              <div style="display: grid; gap: 6px;">
                ${(isAr ? q.options_ar : q.options_en || []).map((opt, oIdx) => `
                  <div style="display: flex; align-items: center; gap: 10px; font-size: 0.835rem; color: var(--text-secondary); background: var(--bg-surface-subtle); padding: 7px 12px; border-radius: 8px; border: 1px solid var(--border-subtle);">
                    <span style="font-weight: 800; font-family: monospace; font-size: 0.75rem; color: var(--brand-accent);">${optLetters[oIdx] || oIdx + 1}</span>
                    <span>${opt}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    document.getElementById('btn-launch-all-quiz')?.addEventListener('click', () => {
      QuestionsPage.launchQuizRunner(list, isAr ? 'اختبار البحث السريع' : 'Search Results Quiz');
    });

    mainEl.querySelectorAll('.btn-single-test').forEach(b => {
      b.addEventListener('click', () => {
        const qid = b.getAttribute('data-qid');
        const item = list.find(x => x.id === qid);
        if (item) QuestionsPage.launchQuizRunner([item], isAr ? item.subject_name_ar : item.subject_name_en);
      });
    });
  },

  // 3. SAVED & WEAK QUESTIONS HUB
  renderSavedView() {
    const mainEl = document.getElementById('questions-main-content');
    if (!mainEl) return;
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
    const saved = QuestionsPage.getSavedQuestions();

    mainEl.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; gap: 12px; flex-wrap: wrap;">
        <div>
          <h2 style="font-size: 1.25rem; font-weight: 850; color: var(--text-primary); margin: 0 0 4px;">
            ${isAr ? 'الأسئلة المحفوظة للمراجعة الأكاديمية' : 'Saved Questions Hub'}
          </h2>
          <p style="font-size: 0.825rem; color: var(--text-secondary); margin: 0;">
            ${isAr ? 'راجع الأسئلة التي قمت بحفظها أثناء حل الاختبارات لإعادة التدرب عليها وترسيخها.' : 'Restudy bookmarked questions to target your weak concepts.'}
          </p>
        </div>

        ${saved.length > 0 ? `
          <button type="button" id="btn-quiz-all-saved" class="btn btn-primary btn-sm" style="font-weight: 750; gap: 8px;">
            <i data-lucide="play" style="width: 14px; height: 14px;"></i>
            <span>${isAr ? 'بدء اختبار شامل على المحفوظات' : 'Test All Saved'}</span>
          </button>
        ` : ''}
      </div>

      ${saved.length === 0 ? `
        <div class="kf-panel" style="text-align: center; padding: 44px 24px; border-radius: 14px;">
          <div style="width: 100px; height: 100px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle, rgba(200, 67, 67, 0.12) 0%, transparent 70%);">
            <img src="${window.CharacterThemeSystem ? window.CharacterThemeSystem.getAsset('thinking') : 'assets/characters/kuro/Kuro-Thinking.png'}" alt="Kuro Thinking" class="kuro-character-img kuro-float" style="max-height: 90px; object-fit: contain;" />
          </div>
          <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary); margin-bottom: 6px;">
            ${isAr ? 'لا توجد أسئلة محفوظة حالياً' : 'No Saved Questions Yet'}
          </h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary); max-width: 440px; margin: 0 auto 20px;">
            ${isAr ? 'أثناء خوض أي اختبار، انقر على زر (★ حفظ) لحفظ السؤال هنا للمراجعة مع كورو.' : 'Click "Save Question" inside any active quiz card to keep it here for review with Kuro.'}
          </p>
        </div>
      ` : `
        <div style="display: grid; gap: 14px;">
          ${saved.map((q, idx) => `
            <div class="kf-panel q-card" style="padding: 18px 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span class="kf-segmented-badge" style="color: var(--brand-accent); font-weight: 800;">#${idx + 1} • ${isAr ? q.subject_name_ar : q.subject_name_en}</span>
                <button type="button" class="btn btn-secondary btn-sm btn-remove-saved" data-qid="${q.id}" style="color: #EF4444; font-size: 0.75rem; padding: 4px 10px;">
                  ${isAr ? 'إزالة' : 'Remove'}
                </button>
              </div>
              <h4 style="font-size: 0.95rem; font-weight: 750; color: var(--text-primary); margin: 0 0 10px;">
                ${isAr ? q.text_ar : q.text_en}
              </h4>
              <div style="padding: 10px 14px; border-radius: 8px; background: var(--bg-surface-subtle); border-inline-start: 3px solid #10B981; font-size: 0.825rem; color: var(--text-secondary);">
                <strong>${isAr ? 'الإجابة المعتمدة:' : 'Correct Answer:'}</strong> ${isAr ? q.answer_ar : q.answer_en}
              </div>
            </div>
          `).join('')}
        </div>
      `}
    `;

    if (window.lucide) window.lucide.createIcons();

    document.getElementById('btn-quiz-all-saved')?.addEventListener('click', () => {
      QuestionsPage.launchQuizRunner(saved, isAr ? 'اختبار الأسئلة المحفوظة' : 'Saved Questions Quiz');
    });

    mainEl.querySelectorAll('.btn-remove-saved').forEach(b => {
      b.addEventListener('click', () => {
        const qid = b.getAttribute('data-qid');
        const q = saved.find(x => x.id === qid);
        if (q) {
          QuestionsPage.saveQuestion(q);
          QuestionsPage.renderSavedView();
        }
      });
    });
  },

  // TYPE SELECTOR MODAL — Show/Hide
  showTypeSelector(questions, subjectTitle) {
    QuestionsPage.pendingSheetQuestions = questions;
    QuestionsPage.pendingSubjectTitle = subjectTitle;

    const label = document.getElementById('qt-sheet-name-label');
    if (label) label.textContent = subjectTitle;

    const modal = document.getElementById('qt-type-selector-modal');
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      if (window.lucide) window.lucide.createIcons();
    }
  },

  closeTypeSelector() {
    const modal = document.getElementById('qt-type-selector-modal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  },

  toggleKuroExplanation(forceState) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
    const pane = document.getElementById('dt-kuro-explanation-pane');
    const bubbleText = document.getElementById('dt-kuro-bubble-text');
    const mascotImg = document.getElementById('dt-kuro-mascot-img');
    const trigger = document.getElementById('dt-kuro-mascot-trigger');
    if (!pane) return;

    if (typeof forceState === 'boolean') {
      QuestionsPage.kuroExplanationOpen = forceState;
    } else {
      QuestionsPage.kuroExplanationOpen = !QuestionsPage.kuroExplanationOpen;
    }

    const isOpen = QuestionsPage.kuroExplanationOpen;
    pane.style.display = isOpen ? 'block' : 'none';
    if (trigger) trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

    if (isOpen) {
      if (window.SoundFX) window.SoundFX.play('kuroThinking');
      if (bubbleText) bubbleText.textContent = isAr ? 'إغلاق الشرح السريري ✕' : 'Close Explanation ✕';
      if (mascotImg) {
        mascotImg.src = (window.CharacterThemeSystem && window.CharacterThemeSystem.getAsset('reading')) || 'assets/characters/kuro/Kuro-Reading.png';
      }
    } else {
      if (window.SoundFX) window.SoundFX.play('close');
      if (mascotImg) {
        if (QuestionsPage.hasCurrentQuestionBeenAnswered && QuestionsPage.isCurrentQuestionAnswerCorrect) {
          mascotImg.src = (window.CharacterThemeSystem && window.CharacterThemeSystem.getAsset('happy')) || 'assets/characters/kuro/Kuro-Happy.png';
        } else {
          mascotImg.src = (window.CharacterThemeSystem && window.CharacterThemeSystem.getAsset('thinking')) || 'assets/characters/kuro/Kuro-Thinking.png';
        }
      }
      if (bubbleText) {
        if (QuestionsPage.hasCurrentQuestionBeenAnswered) {
          bubbleText.textContent = QuestionsPage.isCurrentQuestionAnswerCorrect
            ? (isAr ? '🎉 إجابة صحيحة! انقر للشرح' : '🎉 Correct! Click for explanation')
            : (isAr ? '💡 انقر لمراجعة الشرح والصفحة' : '💡 Click to review explanation');
        } else {
          bubbleText.textContent = isAr ? 'انقر على كورو للشرح السريري' : 'Click Kuro for Explanation';
        }
      }
    }

    if (window.lucide) window.lucide.createIcons();
  },

  // 4. LEVEL 3: DENTISTOIRE-STYLE FOCUSED MODAL QUIZ RUNNER
  launchQuizRunner(questionsList, subjectTitle) {
    if (!Array.isArray(questionsList) || questionsList.length === 0) return;
    QuestionsPage.activeQuizList = questionsList;
    QuestionsPage.activeQuizIndex = 0;
    QuestionsPage.activeSubjectTitle = subjectTitle;
    QuestionsPage.kuroExplanationOpen = false;

    const overlay = document.getElementById('dt-quiz-runner-modal');
    if (overlay) {
      overlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      QuestionsPage.renderModalQuestion();
    }
  },

  closeQuizModal() {
    const overlay = document.getElementById('dt-quiz-runner-modal');
    if (overlay) {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }
  },

  renderModalQuestion() {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
    const q = QuestionsPage.activeQuizList[QuestionsPage.activeQuizIndex];
    if (!q) return;

    QuestionsPage.hasCurrentQuestionBeenAnswered = false;
    QuestionsPage.isCurrentQuestionAnswerCorrect = false;

    const total = QuestionsPage.activeQuizList.length;
    const current = QuestionsPage.activeQuizIndex + 1;
    const percent = Math.round((current / total) * 100);

    const tagEl = document.getElementById('dt-modal-subject-tag');
    if (tagEl) tagEl.textContent = QuestionsPage.activeSubjectTitle || (isAr ? q.subject_name_ar : q.subject_name_en);

    const sheetTagEl = document.getElementById('dt-modal-sheet-tag');
    if (sheetTagEl) {
      const shName = isAr ? (q.sheet_title_ar || 'الشيت 1') : (q.sheet_title_en || 'Sheet 1');
      sheetTagEl.textContent = shName;
    }

    const pageTagEl = document.getElementById('dt-modal-page-tag');
    if (pageTagEl) {
      if (q.page_ref) {
        pageTagEl.textContent = isAr ? `صفحة ${q.page_ref}` : `Page ${q.page_ref}`;
        pageTagEl.style.display = 'inline-block';
      } else {
        pageTagEl.style.display = 'none';
      }
    }

    const counterEl = document.getElementById('dt-modal-counter');
    if (counterEl) counterEl.textContent = isAr ? `السؤال ${current} من ${total}` : `Question ${current} of ${total}`;

    const progressEl = document.getElementById('dt-modal-progress-bar');
    if (progressEl) progressEl.style.width = `${percent}%`;

    const titleEl = document.getElementById('dt-modal-q-title');
    if (titleEl) titleEl.textContent = isAr ? q.text_ar : q.text_en;

    QuestionsPage.updateStarButton(q);

    // Update Kuro explanation contents
    const expSubtitle = document.getElementById('dt-kuro-exp-ref-subtitle');
    if (expSubtitle) {
      const shTitle = isAr ? (q.sheet_title_ar || 'الشيت المعتمد') : (q.sheet_title_en || 'Official Sheet');
      const pageInfo = q.page_ref ? (isAr ? ` • صفحة ${q.page_ref}` : ` • Page ${q.page_ref}`) : '';
      expSubtitle.textContent = `${shTitle}${pageInfo}`;
    }

    const ansEl = document.getElementById('dt-kuro-model-answer');
    if (ansEl) {
      ansEl.textContent = isAr ? (q.answer_ar || q.explanation_ar || q.answer_en) : (q.answer_en || q.explanation_en || q.answer_ar);
    }

    const quoteBox = document.getElementById('dt-kuro-sheet-quote-box');
    const quoteEl = document.getElementById('dt-kuro-quote-text');
    if (quoteBox && quoteEl) {
      if (q.quote_ref) {
        quoteEl.textContent = `«${q.quote_ref}»`;
        quoteBox.style.display = 'block';
      } else {
        quoteBox.style.display = 'none';
      }
    }

    // Reset mascot state and explanation pane visibility
    const expPane = document.getElementById('dt-kuro-explanation-pane');
    const bubbleText = document.getElementById('dt-kuro-bubble-text');
    const mascotImg = document.getElementById('dt-kuro-mascot-img');
    const trigger = document.getElementById('dt-kuro-mascot-trigger');

    if (QuestionsPage.kuroExplanationOpen && expPane) {
      expPane.style.display = 'block';
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
      if (mascotImg) {
        mascotImg.src = (window.CharacterThemeSystem && window.CharacterThemeSystem.getAsset('reading')) || 'assets/characters/kuro/Kuro-Reading.png';
      }
      if (bubbleText) bubbleText.textContent = isAr ? 'إغلاق الشرح السريري ✕' : 'Close Explanation ✕';
    } else {
      if (expPane) expPane.style.display = 'none';
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      if (mascotImg) {
        mascotImg.src = (window.CharacterThemeSystem && window.CharacterThemeSystem.getAsset('thinking')) || 'assets/characters/kuro/Kuro-Thinking.png';
      }
      if (bubbleText) bubbleText.textContent = isAr ? 'انقر على كورو للشرح السريري' : 'Click Kuro for Explanation';
    }

    // Render options
    const optBox = document.getElementById('dt-modal-options-box');
    if (!optBox) return;

    const options = isAr ? (q.options_ar || q.options_en || []) : (q.options_en || q.options_ar || []);
    const correctIdx = typeof q.correct_index === 'number' ? q.correct_index : 0;
    const optLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

    optBox.innerHTML = options.map((opt, idx) => `
      <button type="button" class="dt-quiz-option" data-opt-idx="${idx}">
        <span style="width: 28px; height: 28px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; background: var(--bg-surface); border: 1px solid var(--border-subtle); font-size: 0.8rem; font-weight: 800; font-family: monospace; color: var(--text-secondary);">
          ${optLetters[idx] || idx + 1}
        </span>
        <span style="flex: 1;">${opt}</span>
        <span class="dt-opt-status-icon" style="font-weight: 900; font-size: 1.1rem; display: none;"></span>
      </button>
    `).join('');

    // Option click handler
    optBox.querySelectorAll('.dt-quiz-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedIdx = parseInt(btn.getAttribute('data-opt-idx'), 10);
        const isCorrect = (selectedIdx === correctIdx);
        
        QuestionsPage.hasCurrentQuestionBeenAnswered = true;
        QuestionsPage.isCurrentQuestionAnswerCorrect = isCorrect;

        if (window.SoundFX) {
          if (isCorrect) {
            window.SoundFX.play('correct');
            setTimeout(() => { if (window.SoundFX) window.SoundFX.play('kuroHappy'); }, 220);
          } else {
            window.SoundFX.play('incorrect');
          }
        }

        optBox.querySelectorAll('.dt-quiz-option').forEach((b, bIdx) => {
          b.disabled = true;
          const statusIcon = b.querySelector('.dt-opt-status-icon');
          if (bIdx === correctIdx) {
            b.classList.add('correct');
            if (statusIcon) {
              statusIcon.textContent = '✓';
              statusIcon.style.display = 'inline-block';
              statusIcon.style.color = '#10B981';
            }
          } else if (bIdx === selectedIdx) {
            b.classList.add('incorrect', 'shake-wrong');
            if (statusIcon) {
              statusIcon.textContent = '✕';
              statusIcon.style.display = 'inline-block';
              statusIcon.style.color = '#EF4444';
            }
          }
        });

        // Update Kuro Mascot reaction
        if (mascotImg && !QuestionsPage.kuroExplanationOpen) {
          if (isCorrect) {
            mascotImg.src = (window.CharacterThemeSystem && window.CharacterThemeSystem.getAsset('happy')) || 'assets/characters/kuro/Kuro-Happy.png';
            if (bubbleText) bubbleText.textContent = isAr ? '🎉 إجابة صحيحة! انقر للشرح والصفحة' : '🎉 Correct! Click for explanation';
          } else {
            mascotImg.src = (window.CharacterThemeSystem && window.CharacterThemeSystem.getAsset('thinking')) || 'assets/characters/kuro/Kuro-Thinking.png';
            if (bubbleText) bubbleText.textContent = isAr ? '💡 انقر على كورو لمراجعة الشرح والصفحة' : '💡 Click Kuro to review explanation';
          }
        }

        // If wrong, record as weak question
        if (!isCorrect) {
          QuestionsPage.recordWeakQuestion(q);
        } else {
          // Add academic points XP
          if (window.STORE && typeof window.STORE.addPoints === 'function') {
            window.STORE.addPoints(5);
          }
        }
      });
    });

    if (window.lucide) window.lucide.createIcons();
  },

  updateStarButton(question) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
    const saved = QuestionsPage.getSavedQuestions();
    const isSaved = saved.some(x => x.id === question.id);
    const starText = document.getElementById('dt-star-text');
    const starBtn = document.getElementById('dt-btn-star');

    if (starText) {
      starText.textContent = isSaved ? (isAr ? '★ محفوظ' : '★ Saved') : (isAr ? 'حفظ للمراجعة' : 'Save');
    }
    if (starBtn) {
      starBtn.style.color = isSaved ? '#F59E0B' : 'var(--text-primary)';
      starBtn.style.borderColor = isSaved ? 'rgba(245, 158, 11, 0.4)' : 'var(--border-subtle)';
    }
  }
};

window.QuestionsPage = QuestionsPage;
