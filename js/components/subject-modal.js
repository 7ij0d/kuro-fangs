/**
 * KURO FANGS — FLOATING INTERACTIVE SUBJECT MODAL (i18n SUPPORTED)
 * Centered modal containing the 8 academic content hubs
 */

const SubjectModal = {
  currentSubject: null,
  activeCategory: null,

  init() {
    const backdrop = document.getElementById('subject-modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          SubjectModal.close();
        }
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        SubjectModal.close();
      }
    });
  },

  open(subjectId) {
    const subject = window.DATA.getSubjectById(subjectId) || window.DATA.getSubjects()[0];
    if (!subject) return;

    SubjectModal.currentSubject = subject;
    SubjectModal.activeCategory = null;

    const modalBox = document.getElementById('subject-modal-box');
    const backdrop = document.getElementById('subject-modal-backdrop');
    if (!modalBox || !backdrop) return;

    SubjectModal.renderCategoriesView();
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (window.lucide) window.lucide.createIcons();
  },

  close() {
    const backdrop = document.getElementById('subject-modal-backdrop');
    if (backdrop) {
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  renderCategoriesView() {
    const subject = SubjectModal.currentSubject;
    const modalBox = document.getElementById('subject-modal-box');
    if (!modalBox || !subject) return;

    const isAr = window.I18N.getLang() === 'ar';
    const t = (k) => window.I18N.t(k);

    const primaryTitle = isAr ? subject.name_ar : subject.name_en;
    const subTitle = isAr ? `${subject.name_en} • ${subject.code}` : `${subject.name_ar} • ${subject.code}`;

    const categories = [
      {
        id: 'sheets',
        title: t('catSheets'),
        desc: t('catSheetsDesc'),
        icon: '📄'
      },
      {
        id: 'recordings',
        title: t('catRecordings'),
        desc: t('catRecordingsDesc'),
        icon: '🎙️'
      },
      {
        id: 'past-exams',
        title: t('catPastExams'),
        desc: t('catPastExamsDesc'),
        icon: '🏛️'
      },
      {
        id: 'ai-questions',
        title: t('catAiQuestions'),
        desc: t('catAiQuestionsDesc'),
        icon: '🤖'
      },
      {
        id: 'doctor-notes',
        title: t('catDoctorNotes'),
        desc: t('catDoctorNotesDesc'),
        icon: '👨‍⚕️'
      },
      {
        id: 'summaries',
        title: t('catSummaries'),
        desc: t('catSummariesDesc'),
        icon: '📑'
      },
      {
        id: 'flashcards-atlas',
        title: t('catFlashcards'),
        desc: t('catFlashcardsDesc'),
        icon: '🗂️'
      },
      {
        id: 'files-slides',
        title: t('catFiles'),
        desc: t('catFilesDesc'),
        icon: '📁'
      }
    ];

    const coverImg = subject.cover_image || window.DATA?.subjectCovers?.[subject.id] || `assets/covers/${subject.id}.jpg`;
    const arrowIcon = isAr ? 'arrow-left' : 'arrow-right';

    modalBox.innerHTML = `
      <!-- Header -->
      <div class="modal-header">
        <div class="modal-header-meta">
          <div class="modal-subject-banner-thumb">
            <img src="${coverImg}" alt="${primaryTitle}" onerror="this.onerror=null; this.src='assets/covers/gen-med.jpg';" />
          </div>
          <div class="modal-title-wrap">
            <h2>${primaryTitle}</h2>
            <p>${subTitle}</p>
          </div>
        </div>
        <button class="modal-close-btn" onclick="SubjectModal.close();" aria-label="${t('closeBtn')}">
          ✕
        </button>
      </div>

      <!-- Body: 8 Options -->
      <div class="modal-body">
        <div class="modal-prompt-title">
          <i data-lucide="sparkles" style="color: var(--brand-burgundy); width: 18px; height: 18px;"></i>
          ${t('modalPrompt')}
        </div>

        <div class="modal-categories-grid">
          ${categories.map(cat => `
            <div class="modal-category-card" onclick="SubjectModal.openCategory('${cat.id}');">
              <div class="category-card-left">
                <div class="category-icon-pill">
                  ${cat.icon}
                </div>
                <div class="category-text-wrap">
                  <h3>${cat.title}</h3>
                  <p>${cat.desc}</p>
                </div>
              </div>
              <div class="category-arrow-icon">
                <i data-lucide="${arrowIcon}" style="width: 17px; height: 17px;"></i>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  },

  openCategory(categoryId) {
    SubjectModal.activeCategory = categoryId;
    const subject = SubjectModal.currentSubject;
    const modalBox = document.getElementById('subject-modal-box');
    if (!modalBox || !subject) return;

    const isAr = window.I18N.getLang() === 'ar';
    const t = (k) => window.I18N.t(k);
    const subjectName = isAr ? subject.name_ar : subject.name_en;

    let categoryTitle = '';
    let categoryIcon = '';
    let itemsHTML = '';

    if (categoryId === 'sheets') {
      categoryTitle = t('catSheets');
      categoryIcon = '📄';
      const sheets = window.DATA.getSheetsBySubject(subject.id);
      const displaySheets = sheets.length > 0 ? sheets : [
        { id: 's1', title: isAr ? `المحاضرة 1: مدخل ومفاهيم أساسية في ${subjectName}` : `Lecture 1: Introduction & Fundamentals in ${subjectName}`, doctor: isAr ? 'هيئة التدريس' : 'Course Faculty', date: '2026-09-02' },
        { id: 's2', title: isAr ? `المحاضرة 2: التشخيص والبروتوكولات السريرية` : `Lecture 2: Clinical Protocols & Diagnosis`, doctor: isAr ? 'هيئة التدريس' : 'Course Faculty', date: '2026-09-06' },
        { id: 's3', title: isAr ? `المحاضرة 3: الإجراءات العلاجية ومناقشة الحالات` : `Lecture 3: Treatment Protocols & Case Discussions`, doctor: isAr ? 'هيئة التدريس' : 'Course Faculty', date: '2026-09-10' }
      ];

      itemsHTML = displaySheets.map(s => `
        <div class="explorer-item-row">
          <div class="explorer-item-info">
            <div class="explorer-item-icon"><i data-lucide="file-text"></i></div>
            <div>
              <div class="explorer-item-title">${s.title}</div>
              <div class="explorer-item-meta">${s.doctor || 'Faculty'} • ${s.date || '2026-09-08'}</div>
            </div>
          </div>
          <div class="explorer-item-action">
            <button class="btn btn-burgundy" style="padding: 6px 14px; font-size: 0.8rem;" onclick="SubjectModal.downloadItem('${s.title}');">
              <i data-lucide="download" style="width: 14px; height: 14px;"></i>
              ${t('downloadPdf')}
            </button>
          </div>
        </div>
      `).join('');
    } else if (categoryId === 'recordings') {
      categoryTitle = t('catRecordings');
      categoryIcon = '🎙️';
      itemsHTML = `
        <div class="explorer-item-row">
          <div class="explorer-item-info">
            <div class="explorer-item-icon"><i data-lucide="play-circle"></i></div>
            <div>
              <div class="explorer-item-title">${isAr ? 'تسجيل صوتي: شرح تفصيلي مع مناقشة الحالات' : 'Audio Lecture: Detailed Clinical Case Discussion'}</div>
              <div class="explorer-item-meta">${isAr ? 'المدة: 38 دقيقة • جودة عالية MP3' : 'Duration: 38 mins • High Quality MP3'}</div>
            </div>
          </div>
          <button class="btn btn-burgundy" style="padding: 6px 14px; font-size: 0.8rem;" onclick="alert('Audio playing');">
            <i data-lucide="play" style="width: 14px; height: 14px;"></i>
            ${t('listenAudio')}
          </button>
        </div>
        <div class="explorer-item-row">
          <div class="explorer-item-info">
            <div class="explorer-item-icon"><i data-lucide="video"></i></div>
            <div>
              <div class="explorer-item-title">${isAr ? 'فيديو سريري: تطبيق عملي في عيادات الكلية' : 'Clinical Video: Practical Demonstration in Dental Clinics'}</div>
              <div class="explorer-item-meta">${isAr ? 'المدة: 45 دقيقة • جودة عالية HD' : 'Duration: 45 mins • 1080p HD'}</div>
            </div>
          </div>
          <button class="btn btn-burgundy" style="padding: 6px 14px; font-size: 0.8rem;" onclick="alert('Opening video');">
            <i data-lucide="external-link" style="width: 14px; height: 14px;"></i>
            ${t('watchVideo')}
          </button>
        </div>
      `;
    } else if (categoryId === 'past-exams') {
      categoryTitle = t('catPastExams');
      categoryIcon = '🏛️';
      itemsHTML = `
        <div class="explorer-item-row">
          <div class="explorer-item-info">
            <div class="explorer-item-icon"><i data-lucide="file-check"></i></div>
            <div>
              <div class="explorer-item-title">${isAr ? 'امتحان نصفي 2024-2025 مع مفتاح الحل النموذجي' : 'Midterm Exam 2024-2025 with Solved Answer Key'}</div>
              <div class="explorer-item-meta">${isAr ? '50 سؤال اختيار من متعدد مع التعليلات' : '50 MCQs with Detailed Clinical Rationales'}</div>
            </div>
          </div>
          <button class="btn btn-burgundy" style="padding: 6px 14px; font-size: 0.8rem;" onclick="SubjectModal.downloadItem('Midterm Exam 2025');">
            <i data-lucide="download" style="width: 14px; height: 14px;"></i>
            ${t('downloadExam')}
          </button>
        </div>
      `;
    } else if (categoryId === 'ai-questions') {
      categoryTitle = t('catAiQuestions');
      categoryIcon = '🤖';
      itemsHTML = `
        <div class="explorer-item-row">
          <div class="explorer-item-info">
            <div class="explorer-item-icon"><i data-lucide="sparkles"></i></div>
            <div>
              <div class="explorer-item-title">${isAr ? 'كويز تفاعلي ذكي: أهم التركات والتشخيص التفريقي' : 'AI Diagnostic Quiz: Differential Diagnosis & High-Yield MCQs'}</div>
              <div class="explorer-item-meta">${isAr ? '10 أسئلة ذكية مع التقييم الفوري' : '10 AI-curated questions with instant feedback'}</div>
            </div>
          </div>
          <a href="#/quizzes" class="btn btn-burgundy" style="padding: 6px 14px; font-size: 0.8rem;" onclick="SubjectModal.close();">
            <i data-lucide="play" style="width: 14px; height: 14px;"></i>
            ${t('startQuiz')}
          </a>
        </div>
      `;
    } else if (categoryId === 'doctor-notes') {
      categoryTitle = t('catDoctorNotes');
      categoryIcon = '👨‍⚕️';
      itemsHTML = `
        <div class="explorer-item-row">
          <div class="explorer-item-info">
            <div class="explorer-item-icon"><i data-lucide="edit-3"></i></div>
            <div>
              <div class="explorer-item-title">${isAr ? 'تفريغات الأساتذة: النقاط المؤكدة للامتحانات' : 'Faculty Pearls: High-Yield Exam Takeaways & Tips'}</div>
              <div class="explorer-item-meta">${isAr ? 'ملاحظات سريرية مركزة' : 'Clinical tips from lecture halls'}</div>
            </div>
          </div>
          <button class="btn btn-burgundy" style="padding: 6px 14px; font-size: 0.8rem;" onclick="SubjectModal.downloadItem('Doctor Notes');">
            <i data-lucide="download" style="width: 14px; height: 14px;"></i>
            ${t('downloadPdf')}
          </button>
        </div>
      `;
    } else if (categoryId === 'summaries') {
      categoryTitle = t('catSummaries');
      categoryIcon = '📑';
      itemsHTML = `
        <div class="explorer-item-row">
          <div class="explorer-item-info">
            <div class="explorer-item-icon"><i data-lucide="file-text"></i></div>
            <div>
              <div class="explorer-item-title">${isAr ? 'ملخص ليلة الامتحان: جداول المقارنة والأدوية' : 'Night-Before-Exam Summary: Key Tables & Drug Charts'}</div>
              <div class="explorer-item-meta">${isAr ? '12 صفحة مدمجة ومكثفة' : '12 condensed high-yield pages'}</div>
            </div>
          </div>
          <button class="btn btn-burgundy" style="padding: 6px 14px; font-size: 0.8rem;" onclick="SubjectModal.downloadItem('Exam Summary');">
            <i data-lucide="download" style="width: 14px; height: 14px;"></i>
            ${t('downloadPdf')}
          </button>
        </div>
      `;
    } else if (categoryId === 'flashcards-atlas') {
      categoryTitle = t('catFlashcards');
      categoryIcon = '🗂️';
      itemsHTML = `
        <div class="explorer-item-row">
          <div class="explorer-item-info">
            <div class="explorer-item-icon"><i data-lucide="layers"></i></div>
            <div>
              <div class="explorer-item-title">${isAr ? 'مجموعة البطاقات التعليمية الذكية (Flashcards)' : 'Interactive Dental Flashcards Deck'}</div>
              <div class="explorer-item-meta">${isAr ? 'مراجعة سريعة للمصطلحات والتشخيصات' : 'Spaced repetition flashcards'}</div>
            </div>
          </div>
          <a href="#/flashcards" class="btn btn-burgundy" style="padding: 6px 14px; font-size: 0.8rem;" onclick="SubjectModal.close();">
            <i data-lucide="layers" style="width: 14px; height: 14px;"></i>
            ${t('openFlashcards')}
          </a>
        </div>
      `;
    } else {
      categoryTitle = t('catFiles');
      categoryIcon = '📁';
      itemsHTML = `
        <div class="explorer-item-row">
          <div class="explorer-item-info">
            <div class="explorer-item-icon"><i data-lucide="folder"></i></div>
            <div>
              <div class="explorer-item-title">${isAr ? 'المجلد السحابي الكامل: سلايدات وكتب المرجع' : 'Cloud Drive: Official Slides & Reference Textbooks'}</div>
              <div class="explorer-item-meta">${isAr ? 'روابط مباشرة للتحميل والمطالعة' : 'Direct cloud repository'}</div>
            </div>
          </div>
          <button class="btn btn-burgundy" style="padding: 6px 14px; font-size: 0.8rem;" onclick="alert('Opening Cloud Drive');">
            <i data-lucide="external-link" style="width: 14px; height: 14px;"></i>
            ${t('openDrive')}
          </button>
        </div>
      `;
    }

    const backArrow = isAr ? 'arrow-right' : 'arrow-left';

    modalBox.innerHTML = `
      <div class="modal-header">
        <div class="modal-header-meta">
          <div class="modal-subject-icon">${categoryIcon}</div>
          <div class="modal-title-wrap">
            <h2>${categoryTitle}</h2>
            <p>${subjectName} • ${subject.code}</p>
          </div>
        </div>
        <button class="modal-close-btn" onclick="SubjectModal.close();" aria-label="${t('closeBtn')}">✕</button>
      </div>

      <div class="modal-body">
        <div class="explorer-top-nav">
          <button class="btn-back-categories" onclick="SubjectModal.renderCategoriesView();">
            <i data-lucide="${backArrow}" style="width: 16px; height: 16px;"></i>
            ${t('backToSections')}
          </button>
          <span style="font-size: 0.8rem; color: var(--text-muted);">${t('directAvailable')}</span>
        </div>

        <div class="explorer-items-list">
          ${itemsHTML}
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  },

  downloadItem(title) {
    window.STORE.addPoints(10);
    alert(window.I18N.t('pointsEarned') + ` [${title}]`);
  }
};

window.SubjectModal = SubjectModal;
