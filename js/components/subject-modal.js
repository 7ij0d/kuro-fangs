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
    const subject = SubjectModal.currentSubject;
    if (!subject) return;

    // 1. Close the modal immediately
    SubjectModal.close();

    const subjectId = subject.id;

    // 2. Direct page navigation with subject pre-filtered
    switch (categoryId) {
      case 'sheets':
        window.ROUTER.navigate(`/sheets?subject=${subjectId}`);
        break;
      case 'recordings':
        window.ROUTER.navigate(`/videos?subject=${subjectId}`);
        break;
      case 'past-exams':
        window.ROUTER.navigate(`/previous-years?subject=${subjectId}`);
        break;
      case 'summaries':
        window.ROUTER.navigate(`/summaries?subject=${subjectId}`);
        break;
      case 'ai-questions':
        window.ROUTER.navigate(`/questions?subject=${subjectId}`);
        break;
      case 'flashcards-atlas':
        window.ROUTER.navigate(`/flashcards?subject=${subjectId}`);
        break;
      case 'doctor-notes':
        window.ROUTER.navigate(`/notes?subject=${subjectId}`);
        break;
      case 'files-slides':
        window.ROUTER.navigate(`/sheets?subject=${subjectId}`);
        break;
      default:
        window.ROUTER.navigate(`/sheets?subject=${subjectId}`);
        break;
    }
  },

  downloadItem(title) {
    window.STORE.addPoints(10);
    const cleanTitle = (title && title !== 'undefined' && title !== 'null') ? String(title).trim() : '';
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
    const mainMsg = isAr ? 'تم بدء التحميل بنجاح!' : 'Downloaded successfully!';
    const fullMsg = cleanTitle ? `${mainMsg} (${cleanTitle})` : mainMsg;
    window.showToast(fullMsg, { type: 'success', points: 10 });
  }
};

window.SubjectModal = SubjectModal;
