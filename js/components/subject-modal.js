/**
 * KURO FANGS — 4-STEP SUBJECT QUICK-ACCESS MODAL & NAVIGATION SYSTEM
 * Exact implementation of media_1790283083887.jpg
 * 
 * Flow:
 * 1. Select Subject: Floating quick-access menu (Sheets, Recordings, Questions, Notes, Other)
 * 2. Select Sheets: Real sheets list with live search
 * 3. Sheet Options: Open Sheet, Download Sheet, Recordings, Questions, Notes
 * 4. Question Options: Previous Years (AR), Previous Years (EN), AI Questions, Other, Notes
 * 3b. Recordings: Sheet-linked recordings only (or clean empty state)
 * 3c. Notes: Sheet-linked study notes
 */

(function (window) {
  'use strict';

  const SubjectModal = {
    currentSubject: null,
    currentSheet: null,
    currentStep: 'step1',
    stepMode: 'sheets', // 'sheets' | 'recordings' | 'questions' | 'notes'
    historyStack: [],
    sheetSearchQuery: '',

    SUBJECT_ICONS: {
      'gen-med': 'stethoscope',
      'gen-surgery': 'activity',
      'oral-diseases': 'microscope',
      'preventive': 'shield-check',
      'cons-endo': 'tooth',
      'fixed-pros': 'crown',
      'removable-pros': 'layers',
      'ortho': 'smile',
      'pediatric': 'heart',
      'pedo': 'heart',
      'omdr': 'scan',
      'omfs': 'scissors',
      'endo': 'activity'
    },

    getSubjectIconHtml(subjectId) {
      const iconType = this.SUBJECT_ICONS[subjectId] || 'book-open';
      if (iconType === 'tooth') {
        return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sqm-icon-svg">
          <path d="M12 2C7.5 2 4 4.5 4 8c0 3 1.5 6 3 9 1 2 2 5 3 5s2-3 2-5c0-1.5.5-2 0-3-.5-1-1-1.5-1-2.5 0-1.5 1-2.5 1-2.5s1 1 1 2.5c0 1-.5 1.5-1 2.5-.5 1 0 1.5 0 3 0 2 1 5 2 5s2-3 3-5c1.5-3 3-6 3-9 0-3.5-3.5-6-8-6z" />
        </svg>`;
      }
      return `<i data-lucide="${iconType}" class="sqm-icon-svg"></i>`;
    },

    ensureDOM() {
      let backdrop = document.getElementById('subject-modal-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'subject-modal-backdrop';
        backdrop.className = 'subject-modal-backdrop';
        backdrop.setAttribute('aria-hidden', 'true');
        document.body.appendChild(backdrop);
      }
      let modalBox = document.getElementById('subject-modal-box');
      if (!modalBox) {
        modalBox = document.createElement('div');
        modalBox.id = 'subject-modal-box';
        modalBox.className = 'subject-modal-box sqm-modal-box';
        modalBox.setAttribute('role', 'dialog');
        modalBox.setAttribute('aria-modal', 'true');
        backdrop.appendChild(modalBox);
      } else {
        modalBox.classList.add('sqm-modal-box');
      }

      modalBox.onclick = (e) => e.stopPropagation();
      backdrop.onclick = (e) => {
        if (e.target === backdrop) SubjectModal.close();
      };
      return { backdrop, modalBox };
    },

    init() {
      SubjectModal.ensureDOM();
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          SubjectModal.close();
        }
      });
    },

    open(subjectId, initialStep = 'step1', initialSheet = null) {
      const subject = (window.DATA && typeof window.DATA.getSubjectById === 'function' ? window.DATA.getSubjectById(subjectId) : null)
        || (window.DATA && typeof window.DATA.getSubjects === 'function' ? window.DATA.getSubjects().find(s => s.id === subjectId) : null)
        || (window.DATA && typeof window.DATA.getSubjects === 'function' ? window.DATA.getSubjects()[0] : null);

      if (!subject) {
        console.warn('Subject not found:', subjectId);
        if (window.ROUTER) window.ROUTER.navigate(`/sheets?subject=${subjectId}`);
        return;
      }

      SubjectModal.currentSubject = subject;
      SubjectModal.currentSheet = initialSheet;
      SubjectModal.currentStep = initialStep;
      SubjectModal.stepMode = 'sheets';
      SubjectModal.historyStack = [];
      SubjectModal.sheetSearchQuery = '';

      const { backdrop, modalBox } = SubjectModal.ensureDOM();
      if (!modalBox || !backdrop) return;

      SubjectModal.render();

      backdrop.style.display = 'flex';
      backdrop.setAttribute('aria-hidden', 'false');
      const raf = window.requestAnimationFrame || ((cb) => setTimeout(cb, 16));
      raf(() => {
        backdrop.classList.add('active');
      });
      document.body.style.overflow = 'hidden';
    },

    close() {
      const backdrop = document.getElementById('subject-modal-backdrop');
      if (backdrop) {
        backdrop.classList.remove('active');
        backdrop.setAttribute('aria-hidden', 'true');
        setTimeout(() => {
          if (!backdrop.classList.contains('active')) {
            backdrop.style.display = 'none';
          }
        }, 220);
      }
      document.body.style.overflow = '';
      SubjectModal.historyStack = [];
    },

    pushStep(nextStep, sheet = null, mode = null) {
      SubjectModal.historyStack.push({
        step: SubjectModal.currentStep,
        sheet: SubjectModal.currentSheet,
        mode: SubjectModal.stepMode
      });
      SubjectModal.currentStep = nextStep;
      if (sheet) SubjectModal.currentSheet = sheet;
      if (mode) SubjectModal.stepMode = mode;
      SubjectModal.render();
    },

    popStep() {
      if (SubjectModal.historyStack.length > 0) {
        const prev = SubjectModal.historyStack.pop();
        SubjectModal.currentStep = prev.step;
        SubjectModal.currentSheet = prev.sheet;
        SubjectModal.stepMode = prev.mode;
        SubjectModal.render();
      } else {
        SubjectModal.close();
      }
    },

    render() {
      const { modalBox } = SubjectModal.ensureDOM();
      if (!modalBox || !SubjectModal.currentSubject) return;

      const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;

      switch (SubjectModal.currentStep) {
        case 'step1':
          modalBox.innerHTML = SubjectModal.renderStep1HTML(isAr);
          break;
        case 'step2':
          modalBox.innerHTML = SubjectModal.renderStep2HTML(isAr);
          break;
        case 'step3':
          modalBox.innerHTML = SubjectModal.renderStep3HTML(isAr);
          break;
        case 'step4':
          modalBox.innerHTML = SubjectModal.renderStep4HTML(isAr);
          break;
        case 'recordings':
          modalBox.innerHTML = SubjectModal.renderRecordingsHTML(isAr);
          break;
        case 'notes':
          modalBox.innerHTML = SubjectModal.renderNotesHTML(isAr);
          break;
        case 'other':
          modalBox.innerHTML = SubjectModal.renderOtherHTML(isAr);
          break;
        default:
          modalBox.innerHTML = SubjectModal.renderStep1HTML(isAr);
          break;
      }

      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }

      SubjectModal.bindEvents(isAr);
    },

    /* ══════════════════════════════════════════════════════════════════════════
       STEP 1: SELECT SUBJECT (Quick-Access Menu)
       Contains ONLY: Sheets, Recordings, Questions, Notes, Other
       ══════════════════════════════════════════════════════════════════════════ */
    renderStep1HTML(isAr) {
      const subject = SubjectModal.currentSubject;
      const primaryTitle = isAr ? subject.name_ar : subject.name_en;
      const code = subject.code || 'DENT-300';
      const iconHtml = SubjectModal.getSubjectIconHtml(subject.id);

      return `
        <div class="sqm-inner sqm-step1-pane">
          <!-- Header -->
          <div class="sqm-header">
            <div class="sqm-header-left">
              <div class="sqm-icon-box">
                ${iconHtml}
              </div>
              <div class="sqm-title-meta">
                <h2 class="sqm-main-title">${primaryTitle}</h2>
                <span class="sqm-sub-code">${code}</span>
              </div>
            </div>
            <button type="button" class="sqm-close-btn" id="sqm-btn-close" aria-label="Close">
              <i data-lucide="x"></i>
            </button>
          </div>

          <!-- Body: 5 Action Cards Grid -->
          <div class="sqm-body sqm-step1-body">
            <div class="sqm-actions-grid">
              <!-- Row 1: Sheets, Recordings, Questions -->
              <button type="button" class="sqm-action-card" id="sqm-action-sheets" data-action="sheets">
                <div class="sqm-card-icon-box">
                  <i data-lucide="file-text"></i>
                </div>
                <span class="sqm-card-label">${isAr ? 'الشيتات' : 'Sheets'}</span>
              </button>

              <button type="button" class="sqm-action-card" id="sqm-action-recordings" data-action="recordings">
                <div class="sqm-card-icon-box">
                  <i data-lucide="mic"></i>
                </div>
                <span class="sqm-card-label">${isAr ? 'التسجيلات' : 'Recordings'}</span>
              </button>

              <button type="button" class="sqm-action-card" id="sqm-action-questions" data-action="questions">
                <div class="sqm-card-icon-box">
                  <i data-lucide="help-circle"></i>
                </div>
                <span class="sqm-card-label">${isAr ? 'الأسئلة' : 'Questions'}</span>
              </button>

              <!-- Row 2: Notes, Other -->
              <button type="button" class="sqm-action-card sqm-card-secondary" id="sqm-action-notes" data-action="notes">
                <div class="sqm-card-icon-box">
                  <i data-lucide="file-edit"></i>
                </div>
                <span class="sqm-card-label">${isAr ? 'الملاحظات' : 'Notes'}</span>
              </button>

              <button type="button" class="sqm-action-card sqm-card-secondary" id="sqm-action-other" data-action="other">
                <div class="sqm-card-icon-box">
                  <i data-lucide="more-horizontal"></i>
                </div>
                <span class="sqm-card-label">${isAr ? 'أخرى' : 'Other'}</span>
              </button>
            </div>
          </div>
        </div>
      `;
    },

    /* ══════════════════════════════════════════════════════════════════════════
       STEP 2: SELECT SHEETS (Real Database Records & Live Search)
       ══════════════════════════════════════════════════════════════════════════ */
    renderStep2HTML(isAr) {
      const subject = SubjectModal.currentSubject;
      const primaryTitle = isAr ? subject.name_ar : subject.name_en;
      const code = subject.code || 'DENT-300';
      const iconHtml = SubjectModal.getSubjectIconHtml(subject.id);
      const backIcon = isAr ? 'arrow-right' : 'arrow-left';
      const chevronIcon = isAr ? 'chevron-left' : 'chevron-right';

      let allSheets = window.DATA ? window.DATA.getSheetsBySubject(subject.id) : [];

      if (SubjectModal.sheetSearchQuery) {
        const q = SubjectModal.sheetSearchQuery.toLowerCase();
        allSheets = allSheets.filter(s => {
          const tEn = (s.title_en || s.title || '').toLowerCase();
          const tAr = (s.title_ar || '').toLowerCase();
          const doc = (s.doctor_name || '').toLowerCase();
          return tEn.includes(q) || tAr.includes(q) || doc.includes(q);
        });
      }

      let modeSubtitle = isAr ? 'الشيتات' : 'Sheets';
      if (SubjectModal.stepMode === 'recordings') modeSubtitle = isAr ? 'اختر شيت لعرض تسجيلاته' : 'Select Sheet for Recordings';
      if (SubjectModal.stepMode === 'questions') modeSubtitle = isAr ? 'اختر شيت لعرض بنك الأسئلة' : 'Select Sheet for Questions';
      if (SubjectModal.stepMode === 'notes') modeSubtitle = isAr ? 'اختر شيت لعرض الملاحظات' : 'Select Sheet for Notes';

      return `
        <div class="sqm-inner sqm-step2-pane">
          <!-- Header with Back Button -->
          <div class="sqm-header">
            <div class="sqm-header-left">
              <button type="button" class="sqm-back-btn" id="sqm-btn-back" aria-label="Back">
                <i data-lucide="${backIcon}"></i>
              </button>
              <div class="sqm-icon-box">
                ${iconHtml}
              </div>
              <div class="sqm-title-meta">
                <h2 class="sqm-main-title">${primaryTitle}</h2>
                <span class="sqm-sub-code">${code} • ${modeSubtitle}</span>
              </div>
            </div>
            <button type="button" class="sqm-close-btn" id="sqm-btn-close" aria-label="Close">
              <i data-lucide="x"></i>
            </button>
          </div>

          <!-- Search Input -->
          <div class="sqm-search-wrap">
            <i data-lucide="search" class="sqm-search-icon"></i>
            <input
              type="text"
              id="sqm-sheets-search"
              class="sqm-search-input"
              placeholder="${isAr ? 'ابحث في الشيتات...' : 'Search sheets...'}"
              value="${SubjectModal.sheetSearchQuery || ''}"
              autocomplete="off"
            />
          </div>

          <!-- Sheets List -->
          <div class="sqm-body sqm-sheets-scroll-body">
            ${allSheets.length === 0 ? `
              <div class="sqm-empty-state">
                <div class="sqm-empty-icon"><i data-lucide="file-question"></i></div>
                <h3 class="sqm-empty-title">${isAr ? 'لا توجد شيتات متاحة حالياً' : 'No sheets available yet'}</h3>
                <p class="sqm-empty-desc">${isAr ? 'سيتم رفع واستكمال الملازم الخاصة بهذه المادة قريباً.' : 'Lecture handouts for this subject will be uploaded soon.'}</p>
              </div>
            ` : `
              <div class="sqm-sheets-list">
                ${allSheets.map((sheet, idx) => {
                  const sTitle = isAr ? (sheet.title_ar || sheet.title_en || sheet.title) : (sheet.title_en || sheet.title || sheet.title_ar);
                  const orderNum = sheet.order_index || (idx + 1);
                  const pages = sheet.pages || (sheet.page_count || 1);
                  const size = sheet.size || '2.0 MB';

                  return `
                    <div class="sqm-sheet-row" data-sheet-id="${sheet.id}" role="button" tabindex="0">
                      <div class="sqm-sheet-row-left">
                        <div class="sqm-sheet-icon-pill">
                          <i data-lucide="file-text"></i>
                        </div>
                        <div class="sqm-sheet-info">
                          <h4 class="sqm-sheet-title">${sTitle.includes('Sheet') || sTitle.includes('الشيت') ? sTitle : `${isAr ? 'الشيت' : 'Sheet'} ${orderNum}: ${sTitle}`}</h4>
                          <span class="sqm-sheet-specs">${pages} ${isAr ? 'صفحة' : 'pages'} • ${size}</span>
                        </div>
                      </div>
                      <div class="sqm-sheet-row-right">
                        <i data-lucide="${chevronIcon}" class="sqm-row-chevron"></i>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>
        </div>
      `;
    },

    /* ══════════════════════════════════════════════════════════════════════════
       STEP 3: SHEET OPTIONS
       Show: Open Sheet, Download Sheet, Recordings, Questions, Notes
       ══════════════════════════════════════════════════════════════════════════ */
    renderStep3HTML(isAr) {
      const sheet = SubjectModal.currentSheet;
      const subject = SubjectModal.currentSubject;
      if (!sheet) return SubjectModal.renderStep2HTML(isAr);

      const sTitle = isAr ? (sheet.title_ar || sheet.title_en || sheet.title) : (sheet.title_en || sheet.title || sheet.title_ar);
      const subTitle = isAr ? subject.name_ar : subject.name_en;
      const pages = sheet.pages || (sheet.page_count || 1);
      const size = sheet.size || '2.0 MB';
      const backIcon = isAr ? 'arrow-right' : 'arrow-left';
      const chevronIcon = isAr ? 'chevron-left' : 'chevron-right';

      return `
        <div class="sqm-inner sqm-step3-pane">
          <!-- Header -->
          <div class="sqm-header">
            <div class="sqm-header-left">
              <button type="button" class="sqm-back-btn" id="sqm-btn-back" aria-label="Back">
                <i data-lucide="${backIcon}"></i>
              </button>
              <div class="sqm-icon-box sqm-icon-sheet">
                <i data-lucide="file-text"></i>
              </div>
              <div class="sqm-title-meta">
                <h2 class="sqm-main-title">${sTitle}</h2>
                <span class="sqm-sub-code">${subTitle} • ${pages} ${isAr ? 'صفحة' : 'pages'} • ${size}</span>
              </div>
            </div>
            <button type="button" class="sqm-close-btn" id="sqm-btn-close" aria-label="Close">
              <i data-lucide="x"></i>
            </button>
          </div>

          <!-- Body: Sheet Actions List -->
          <div class="sqm-body sqm-options-body">
            <div class="sqm-options-list">
              <!-- 1. Open Sheet -->
              <button type="button" class="sqm-option-row" id="sqm-opt-open">
                <div class="sqm-option-left">
                  <div class="sqm-option-icon"><i data-lucide="eye"></i></div>
                  <div class="sqm-option-texts">
                    <span class="sqm-option-title">${isAr ? 'فتح الشيت' : 'Open Sheet'}</span>
                  </div>
                </div>
                <div class="sqm-option-right">
                  <i data-lucide="${chevronIcon}" class="sqm-row-chevron"></i>
                </div>
              </button>

              <!-- 2. Download Sheet -->
              <button type="button" class="sqm-option-row" id="sqm-opt-download">
                <div class="sqm-option-left">
                  <div class="sqm-option-icon"><i data-lucide="download"></i></div>
                  <div class="sqm-option-texts">
                    <span class="sqm-option-title">${isAr ? 'تنزيل الشيت' : 'Download Sheet'}</span>
                  </div>
                </div>
                <div class="sqm-option-right">
                  <i data-lucide="${chevronIcon}" class="sqm-row-chevron"></i>
                </div>
              </button>

              <!-- 3. Recordings -->
              <button type="button" class="sqm-option-row" id="sqm-opt-recordings">
                <div class="sqm-option-left">
                  <div class="sqm-option-icon"><i data-lucide="mic"></i></div>
                  <div class="sqm-option-texts">
                    <span class="sqm-option-title">${isAr ? 'التسجيلات' : 'Recordings'}</span>
                    <span class="sqm-option-sub">${isAr ? 'تسجيلات هذا الشيت' : 'Lectures for this sheet'}</span>
                  </div>
                </div>
                <div class="sqm-option-right">
                  <i data-lucide="${chevronIcon}" class="sqm-row-chevron"></i>
                </div>
              </button>

              <!-- 4. Questions -->
              <button type="button" class="sqm-option-row" id="sqm-opt-questions">
                <div class="sqm-option-left">
                  <div class="sqm-option-icon"><i data-lucide="help-circle"></i></div>
                  <div class="sqm-option-texts">
                    <span class="sqm-option-title">${isAr ? 'الأسئلة' : 'Questions'}</span>
                    <span class="sqm-option-sub">${isAr ? 'عرض خيارات الأسئلة' : 'View question options'}</span>
                  </div>
                </div>
                <div class="sqm-option-right">
                  <i data-lucide="${chevronIcon}" class="sqm-row-chevron"></i>
                </div>
              </button>

              <!-- 5. Notes -->
              <button type="button" class="sqm-option-row" id="sqm-opt-notes">
                <div class="sqm-option-left">
                  <div class="sqm-option-icon"><i data-lucide="file-edit"></i></div>
                  <div class="sqm-option-texts">
                    <span class="sqm-option-title">${isAr ? 'الملاحظات' : 'Notes'}</span>
                    <span class="sqm-option-sub">${isAr ? 'عرض ملاحظات هذا الشيت' : 'View notes for this sheet'}</span>
                  </div>
                </div>
                <div class="sqm-option-right">
                  <i data-lucide="${chevronIcon}" class="sqm-row-chevron"></i>
                </div>
              </button>
            </div>
          </div>
        </div>
      `;
    },

    /* ══════════════════════════════════════════════════════════════════════════
       STEP 4: QUESTION OPTIONS
       Options:
       - Questions (This Sheet)
       - Previous Years Questions (Arabic)
       - Previous Years Questions (English)
       - AI Generated Questions
       - Other Questions
       - Notes
       ══════════════════════════════════════════════════════════════════════════ */
    renderStep4HTML(isAr) {
      const sheet = SubjectModal.currentSheet;
      if (!sheet) return SubjectModal.renderStep2HTML(isAr);

      const sTitle = isAr ? (sheet.title_ar || sheet.title_en || sheet.title) : (sheet.title_en || sheet.title || sheet.title_ar);
      const backIcon = isAr ? 'arrow-right' : 'arrow-left';
      const chevronIcon = isAr ? 'chevron-left' : 'chevron-right';

      return `
        <div class="sqm-inner sqm-step4-pane">
          <!-- Header -->
          <div class="sqm-header">
            <div class="sqm-header-left">
              <button type="button" class="sqm-back-btn" id="sqm-btn-back" aria-label="Back">
                <i data-lucide="${backIcon}"></i>
              </button>
              <div class="sqm-icon-box sqm-icon-question">
                <i data-lucide="help-circle"></i>
              </div>
              <div class="sqm-title-meta">
                <h2 class="sqm-main-title">${sTitle}</h2>
                <span class="sqm-sub-code">${isAr ? 'الأسئلة والاختبارات' : 'Questions'}</span>
              </div>
            </div>
            <button type="button" class="sqm-close-btn" id="sqm-btn-close" aria-label="Close">
              <i data-lucide="x"></i>
            </button>
          </div>

          <!-- Body: 6 Question Options -->
          <div class="sqm-body sqm-options-body">
            <div class="sqm-options-list">
              <!-- 1. Questions (This Sheet) -->
              <button type="button" class="sqm-option-row" data-qtype="this-sheet">
                <div class="sqm-option-left">
                  <div class="sqm-option-icon"><i data-lucide="file-question"></i></div>
                  <div class="sqm-option-texts">
                    <span class="sqm-option-title">${isAr ? 'أسئلة هذا الشيت' : 'Questions (This Sheet)'}</span>
                    <span class="sqm-option-sub">${isAr ? 'أسئلة معدة خصيصاً لهذا الشيت' : 'Questions prepared for this sheet'}</span>
                  </div>
                </div>
                <div class="sqm-option-right">
                  <i data-lucide="${chevronIcon}" class="sqm-row-chevron"></i>
                </div>
              </button>

              <!-- 2. Previous Years Questions (Arabic) -->
              <button type="button" class="sqm-option-row" data-qtype="past-ar">
                <div class="sqm-option-left">
                  <div class="sqm-option-icon"><i data-lucide="archive"></i></div>
                  <div class="sqm-option-texts">
                    <span class="sqm-option-title">${isAr ? 'أسئلة السنوات السابقة (عربي)' : 'Previous Years Questions (Arabic)'}</span>
                    <span class="sqm-option-sub">${isAr ? 'أسئلة الامتحانات السابقة المعتمدة' : 'Official past exams questions'}</span>
                  </div>
                </div>
                <div class="sqm-option-right">
                  <i data-lucide="${chevronIcon}" class="sqm-row-chevron"></i>
                </div>
              </button>

              <!-- 3. Previous Years Questions (English) -->
              <button type="button" class="sqm-option-row" data-qtype="past-en">
                <div class="sqm-option-left">
                  <div class="sqm-option-icon"><i data-lucide="book-marked"></i></div>
                  <div class="sqm-option-texts">
                    <span class="sqm-option-title">${isAr ? 'أسئلة السنوات السابقة (إنجليزي)' : 'Previous Years Questions (English)'}</span>
                    <span class="sqm-option-sub">${isAr ? 'نماذج امتحانات السنوات السابقة باللغة الإنجليزية' : 'Past papers (English)'}</span>
                  </div>
                </div>
                <div class="sqm-option-right">
                  <i data-lucide="${chevronIcon}" class="sqm-row-chevron"></i>
                </div>
              </button>

              <!-- 4. AI Generated Questions -->
              <button type="button" class="sqm-option-row" data-qtype="ai">
                <div class="sqm-option-left">
                  <div class="sqm-option-icon"><i data-lucide="sparkles"></i></div>
                  <div class="sqm-option-texts">
                    <span class="sqm-option-title">${isAr ? 'أسئلة الذكاء الاصطناعي' : 'AI Generated Questions'}</span>
                    <span class="sqm-option-sub">${isAr ? 'تدرب على أسئلة ذكية مولدة ومطابقة للشيت' : 'Practice with AI questions'}</span>
                  </div>
                </div>
                <div class="sqm-option-right">
                  <i data-lucide="${chevronIcon}" class="sqm-row-chevron"></i>
                </div>
              </button>

              <!-- 5. Other Questions -->
              <button type="button" class="sqm-option-row" data-qtype="other">
                <div class="sqm-option-left">
                  <div class="sqm-option-icon"><i data-lucide="help-circle"></i></div>
                  <div class="sqm-option-texts">
                    <span class="sqm-option-title">${isAr ? 'أسئلة أخرى' : 'Other Questions'}</span>
                    <span class="sqm-option-sub">${isAr ? 'تمارين وتدريبات إضافية' : 'Additional questions'}</span>
                  </div>
                </div>
                <div class="sqm-option-right">
                  <i data-lucide="${chevronIcon}" class="sqm-row-chevron"></i>
                </div>
              </button>

              <!-- 6. Notes -->
              <button type="button" class="sqm-option-row" data-qtype="notes">
                <div class="sqm-option-left">
                  <div class="sqm-option-icon"><i data-lucide="file-edit"></i></div>
                  <div class="sqm-option-texts">
                    <span class="sqm-option-title">${isAr ? 'الملاحظات' : 'Notes'}</span>
                    <span class="sqm-option-sub">${isAr ? 'عرض ملاحظات هذا الشيت' : 'View notes for this sheet'}</span>
                  </div>
                </div>
                <div class="sqm-option-right">
                  <i data-lucide="${chevronIcon}" class="sqm-row-chevron"></i>
                </div>
              </button>
            </div>
          </div>
        </div>
      `;
    },

    /* ══════════════════════════════════════════════════════════════════════════
       STEP 3b: SHEET-LINKED RECORDINGS
       ══════════════════════════════════════════════════════════════════════════ */
    renderRecordingsHTML(isAr) {
      const sheet = SubjectModal.currentSheet;
      if (!sheet) return SubjectModal.renderStep2HTML(isAr);

      const sTitle = isAr ? (sheet.title_ar || sheet.title_en || sheet.title) : (sheet.title_en || sheet.title || sheet.title_ar);
      const backIcon = isAr ? 'arrow-right' : 'arrow-left';

      // Query ONLY real recordings linked to this sheet
      const recordings = window.DATA ? window.DATA.getRecordingsBySheet(sheet.id) : [];

      return `
        <div class="sqm-inner sqm-recordings-pane">
          <!-- Header -->
          <div class="sqm-header">
            <div class="sqm-header-left">
              <button type="button" class="sqm-back-btn" id="sqm-btn-back" aria-label="Back">
                <i data-lucide="${backIcon}"></i>
              </button>
              <div class="sqm-icon-box sqm-icon-audio">
                <i data-lucide="mic"></i>
              </div>
              <div class="sqm-title-meta">
                <h2 class="sqm-main-title">${sTitle}</h2>
                <span class="sqm-sub-code">${isAr ? 'التسجيلات الصوتية للشيت' : 'Recordings • Lectures for this sheet'}</span>
              </div>
            </div>
            <button type="button" class="sqm-close-btn" id="sqm-btn-close" aria-label="Close">
              <i data-lucide="x"></i>
            </button>
          </div>

          <!-- Body -->
          <div class="sqm-body sqm-recordings-body">
            ${recordings.length === 0 ? `
              <div class="sqm-empty-state">
                <div class="sqm-empty-icon"><i data-lucide="mic-off"></i></div>
                <h3 class="sqm-empty-title">${isAr ? 'لا توجد تسجيلات صوتية لهذا الشيت حالياً' : 'No recordings available yet'}</h3>
                <p class="sqm-empty-desc">${isAr ? 'سيتم إدراج التسجيلات الصوتية فور اعتمادها من الكلية.' : 'Audio lectures for this sheet will be added once available.'}</p>
              </div>
            ` : `
              <div class="sqm-recordings-list">
                ${recordings.map((rec) => `
                  <div class="sqm-recording-card">
                    <div class="sqm-rec-header">
                      <h4 class="sqm-rec-title">${isAr ? (rec.title_ar || rec.title) : (rec.title || rec.title_ar)}</h4>
                      <span class="sqm-rec-duration">${rec.duration || '40:00'}</span>
                    </div>
                    <div class="sqm-rec-meta">
                      <span class="sqm-rec-lecturer"><i data-lucide="user"></i> ${rec.lecturer || rec.doctor_name || sheet.doctor_name || 'Dr. Faculty'}</span>
                      <span class="sqm-rec-date"><i data-lucide="calendar"></i> ${rec.date || sheet.date || '2026-09-24'}</span>
                    </div>
                    <div class="sqm-player-row">
                      <button type="button" class="sqm-play-btn" data-audio-url="${rec.audio_url || ''}">
                        <i data-lucide="play"></i>
                      </button>
                      <div class="sqm-player-bar-track">
                        <div class="sqm-player-bar-fill" style="width: 0%;"></div>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>
      `;
    },

    /* ══════════════════════════════════════════════════════════════════════════
       STEP 3c: SHEET-LINKED NOTES
       ══════════════════════════════════════════════════════════════════════════ */
    renderNotesHTML(isAr) {
      const sheet = SubjectModal.currentSheet;
      if (!sheet) return SubjectModal.renderStep2HTML(isAr);

      const sTitle = isAr ? (sheet.title_ar || sheet.title_en || sheet.title) : (sheet.title_en || sheet.title || sheet.title_ar);
      const backIcon = isAr ? 'arrow-right' : 'arrow-left';
      const existingNotes = window.DATA?.getNotesBySheet ? window.DATA.getNotesBySheet(sheet.id) : (localStorage.getItem('kf_sheet_notes_' + sheet.id) || '');

      return `
        <div class="sqm-inner sqm-notes-pane">
          <!-- Header -->
          <div class="sqm-header">
            <div class="sqm-header-left">
              <button type="button" class="sqm-back-btn" id="sqm-btn-back" aria-label="Back">
                <i data-lucide="${backIcon}"></i>
              </button>
              <div class="sqm-icon-box sqm-icon-notes">
                <i data-lucide="file-edit"></i>
              </div>
              <div class="sqm-title-meta">
                <h2 class="sqm-main-title">${sTitle}</h2>
                <span class="sqm-sub-code">${isAr ? 'ملاحظات المذاكرة الشخصية' : 'Personal Study Notes'}</span>
              </div>
            </div>
            <button type="button" class="sqm-close-btn" id="sqm-btn-close" aria-label="Close">
              <i data-lucide="x"></i>
            </button>
          </div>

          <!-- Body -->
          <div class="sqm-body sqm-notes-body">
            <p class="sqm-notes-hint">${isAr ? 'اكتب ملاحظاتك ونقاط المذاكرة الهامة لهذا الشيت. يتم الحفظ تلقائياً في جهازك.' : 'Write your study notes and key clinical pearls for this sheet. Saved locally on your device.'}</p>
            <textarea
              id="sqm-notes-textarea"
              class="sqm-notes-textarea"
              placeholder="${isAr ? 'ابدأ بكتابة ملاحظاتك هنا...' : 'Start typing your clinical notes here...'}"
            >${existingNotes}</textarea>

            <div class="sqm-notes-actions">
              <span id="sqm-notes-status" class="sqm-notes-status"></span>
              <button type="button" class="sqm-notes-save-btn" id="sqm-btn-save-notes">
                <i data-lucide="check"></i>
                <span>${isAr ? 'حفظ الملاحظات' : 'Save Notes'}</span>
              </button>
            </div>
          </div>
        </div>
      `;
    },

    /* ══════════════════════════════════════════════════════════════════════════
       OTHER ACADEMIC RESOURCES (From Step 1)
       ══════════════════════════════════════════════════════════════════════════ */
    renderOtherHTML(isAr) {
      const subject = SubjectModal.currentSubject;
      const primaryTitle = isAr ? subject.name_ar : subject.name_en;
      const backIcon = isAr ? 'arrow-right' : 'arrow-left';
      const chevronIcon = isAr ? 'chevron-left' : 'chevron-right';

      return `
        <div class="sqm-inner sqm-other-pane">
          <!-- Header -->
          <div class="sqm-header">
            <div class="sqm-header-left">
              <button type="button" class="sqm-back-btn" id="sqm-btn-back" aria-label="Back">
                <i data-lucide="${backIcon}"></i>
              </button>
              <div class="sqm-icon-box">
                <i data-lucide="more-horizontal"></i>
              </div>
              <div class="sqm-title-meta">
                <h2 class="sqm-main-title">${primaryTitle}</h2>
                <span class="sqm-sub-code">${isAr ? 'مصادر ومراجع إضافية' : 'Additional Resources'}</span>
              </div>
            </div>
            <button type="button" class="sqm-close-btn" id="sqm-btn-close" aria-label="Close">
              <i data-lucide="x"></i>
            </button>
          </div>

          <div class="sqm-body sqm-options-body">
            <div class="sqm-options-list">
              <button type="button" class="sqm-option-row" id="sqm-other-flashcards">
                <div class="sqm-option-left">
                  <div class="sqm-option-icon"><i data-lucide="layers"></i></div>
                  <div class="sqm-option-texts">
                    <span class="sqm-option-title">${isAr ? 'البطاقات التعليمية والأطلس' : 'Flashcards & Atlas'}</span>
                    <span class="sqm-option-sub">${isAr ? 'مراجعة بصرية سريعة' : 'Quick visual flashcards'}</span>
                  </div>
                </div>
                <div class="sqm-option-right"><i data-lucide="${chevronIcon}" class="sqm-row-chevron"></i></div>
              </button>

              <button type="button" class="sqm-option-row" id="sqm-other-exams">
                <div class="sqm-option-left">
                  <div class="sqm-option-icon"><i data-lucide="calendar-check"></i></div>
                  <div class="sqm-option-texts">
                    <span class="sqm-option-title">${isAr ? 'أرشيف امتحانات المادة' : 'Subject Exams Archive'}</span>
                    <span class="sqm-option-sub">${isAr ? 'امتحانات الدور الأول والثاني' : 'Midterm and final papers'}</span>
                  </div>
                </div>
                <div class="sqm-option-right"><i data-lucide="${chevronIcon}" class="sqm-row-chevron"></i></div>
              </button>

              <button type="button" class="sqm-option-row" id="sqm-other-practical">
                <div class="sqm-option-left">
                  <div class="sqm-option-icon"><i data-lucide="microscope"></i></div>
                  <div class="sqm-option-texts">
                    <span class="sqm-option-title">${isAr ? 'جدول المعامل والعملي' : 'Practical & Lab Schedule'}</span>
                    <span class="sqm-option-sub">${isAr ? 'مواعيد وتجهيزات المعامل' : 'Dental lab schedule'}</span>
                  </div>
                </div>
                <div class="sqm-option-right"><i data-lucide="${chevronIcon}" class="sqm-row-chevron"></i></div>
              </button>
            </div>
          </div>
        </div>
      `;
    },

    /* ══════════════════════════════════════════════════════════════════════════
       EVENT BINDINGS & ACTIONS
       ══════════════════════════════════════════════════════════════════════════ */
    bindEvents(isAr) {
      // Close button
      document.getElementById('sqm-btn-close')?.addEventListener('click', () => {
        SubjectModal.close();
      });

      // Back button
      document.getElementById('sqm-btn-back')?.addEventListener('click', () => {
        SubjectModal.popStep();
      });

      // Step 1: 5 Action buttons
      document.getElementById('sqm-action-sheets')?.addEventListener('click', () => {
        SubjectModal.pushStep('step2', null, 'sheets');
      });

      document.getElementById('sqm-action-recordings')?.addEventListener('click', () => {
        SubjectModal.pushStep('step2', null, 'recordings');
      });

      document.getElementById('sqm-action-questions')?.addEventListener('click', () => {
        SubjectModal.pushStep('step2', null, 'questions');
      });

      document.getElementById('sqm-action-notes')?.addEventListener('click', () => {
        SubjectModal.pushStep('step2', null, 'notes');
      });

      document.getElementById('sqm-action-other')?.addEventListener('click', () => {
        SubjectModal.pushStep('other');
      });

      // Step 2: Search Input
      const searchInput = document.getElementById('sqm-sheets-search');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          SubjectModal.sheetSearchQuery = e.target.value;
          SubjectModal.render();
          const freshInput = document.getElementById('sqm-sheets-search');
          if (freshInput) {
            freshInput.focus();
            freshInput.setSelectionRange(freshInput.value.length, freshInput.value.length);
          }
        });
      }

      // Step 2: Sheet row clicks
      document.querySelectorAll('.sqm-sheet-row').forEach(row => {
        row.addEventListener('click', () => {
          const sheetId = row.getAttribute('data-sheet-id');
          const sheet = window.DATA ? window.DATA.getSheetById(sheetId) : null;
          if (!sheet) return;

          if (SubjectModal.stepMode === 'recordings') {
            SubjectModal.pushStep('recordings', sheet);
          } else if (SubjectModal.stepMode === 'questions') {
            SubjectModal.pushStep('step4', sheet);
          } else if (SubjectModal.stepMode === 'notes') {
            SubjectModal.pushStep('notes', sheet);
          } else {
            // Default: Sheet Options
            SubjectModal.pushStep('step3', sheet);
          }
        });
      });

      // Step 3: Sheet Options Actions
      document.getElementById('sqm-opt-open')?.addEventListener('click', () => {
        const sheet = SubjectModal.currentSheet;
        if (!sheet) return;
        SubjectModal.close();
        window.location.hash = `#/sheet-detail?id=${sheet.id}`;
      });

      document.getElementById('sqm-opt-download')?.addEventListener('click', () => {
        const sheet = SubjectModal.currentSheet;
        if (!sheet) return;
        SubjectModal.downloadSheet(sheet, isAr);
      });

      document.getElementById('sqm-opt-recordings')?.addEventListener('click', () => {
        SubjectModal.pushStep('recordings', SubjectModal.currentSheet);
      });

      document.getElementById('sqm-opt-questions')?.addEventListener('click', () => {
        SubjectModal.pushStep('step4', SubjectModal.currentSheet);
      });

      document.getElementById('sqm-opt-notes')?.addEventListener('click', () => {
        SubjectModal.pushStep('notes', SubjectModal.currentSheet);
      });

      // Step 4: Question Options Actions
      document.querySelectorAll('.sqm-step4-pane [data-qtype]').forEach(btn => {
        btn.addEventListener('click', () => {
          const qtype = btn.getAttribute('data-qtype');
          const sheet = SubjectModal.currentSheet;
          if (qtype === 'notes') {
            SubjectModal.pushStep('notes', sheet);
            return;
          }
          SubjectModal.launchQuizForSheet(sheet, qtype, isAr);
        });
      });

      // Notes Save Action
      document.getElementById('sqm-btn-save-notes')?.addEventListener('click', () => {
        const textarea = document.getElementById('sqm-notes-textarea');
        const sheet = SubjectModal.currentSheet;
        const statusEl = document.getElementById('sqm-notes-status');
        if (!sheet || !textarea) return;

        const content = textarea.value.trim();
        if (window.DATA && typeof window.DATA.saveNotesForSheet === 'function') {
          window.DATA.saveNotesForSheet(sheet.id, content);
        } else {
          localStorage.setItem('kf_sheet_notes_' + sheet.id, content);
        }

        if (statusEl) {
          statusEl.textContent = isAr ? '✓ تم الحفظ بنجاح' : '✓ Saved successfully';
          statusEl.style.color = '#059669';
          setTimeout(() => {
            if (statusEl) statusEl.textContent = '';
          }, 2400);
        }

        if (window.Toast && typeof window.Toast.show === 'function') {
          window.Toast.show(isAr ? 'تم حفظ ملاحظاتك للشيت' : 'Notes saved successfully', 'success');
        }
      });

      // Other Resources Links
      document.getElementById('sqm-other-flashcards')?.addEventListener('click', () => {
        const subject = SubjectModal.currentSubject;
        SubjectModal.close();
        window.location.hash = `#/flashcards?subject=${subject.id}`;
      });

      document.getElementById('sqm-other-exams')?.addEventListener('click', () => {
        const subject = SubjectModal.currentSubject;
        SubjectModal.close();
        window.location.hash = `#/exams?subject=${subject.id}`;
      });

      document.getElementById('sqm-other-practical')?.addEventListener('click', () => {
        SubjectModal.close();
        window.location.hash = `#/practical-schedule`;
      });
    },

    downloadSheet(sheet, isAr) {
      if (window.STORE && typeof window.STORE.addPoints === 'function') {
        window.STORE.addPoints(10);
      }
      const title = sheet.title_en || sheet.title || sheet.title_ar || 'Dental Sheet';
      const toastMsg = isAr ? `تم بدء تنزيل: ${title}` : `Downloading: ${title}`;
      if (window.Toast && typeof window.Toast.show === 'function') {
        window.Toast.show(toastMsg, 'success');
      }

      if (sheet.pdf_url) {
        const a = document.createElement('a');
        a.href = sheet.pdf_url;
        a.download = `${title}.pdf`;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    },

    launchQuizForSheet(sheet, qtype, isAr) {
      SubjectModal.close();
      const subject = SubjectModal.currentSubject;

      // Navigate to questions page with query parameters
      window.location.hash = `#/questions?subject=${subject.id}&sheet=${sheet.id}&type=${qtype}`;
    }
  };

  window.SubjectModal = SubjectModal;
})(window);
