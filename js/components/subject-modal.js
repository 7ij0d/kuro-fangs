/**
 * KURO FANGS — FLOATING INTERACTIVE SUBJECT MODAL (i18n SUPPORTED)
 * Centered Hub with Direct In-App PDF Previewer (<iframe />) & Modern 16px Cards
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

    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
    const t = (k) => window.I18N ? window.I18N.t(k) : k;

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
    const subjectId = subject.id;

    // For file-based categories (sheets, summaries, files-slides, past-exams):
    // Provide instant in-modal explorer with 16px modern cards and dual action buttons!
    if (categoryId === 'sheets' || categoryId === 'summaries' || categoryId === 'files-slides' || categoryId === 'past-exams') {
      SubjectModal.renderCategoryFiles(categoryId);
      return;
    }

    // Direct page navigation for tools
    SubjectModal.close();
    switch (categoryId) {
      case 'recordings':
        window.ROUTER.navigate(`/videos?subject=${subjectId}`);
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
      default:
        window.ROUTER.navigate(`/sheets?subject=${subjectId}`);
        break;
    }
  },

  renderCategoryFiles(categoryId) {
    const subject = SubjectModal.currentSubject;
    const modalBox = document.getElementById('subject-modal-box');
    if (!modalBox || !subject) return;

    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
    const t = (k) => window.I18N ? window.I18N.t(k) : k;

    const primaryTitle = isAr ? subject.name_ar : subject.name_en;
    const subTitle = isAr ? `${subject.name_en} • ${subject.code}` : `${subject.name_ar} • ${subject.code}`;
    const coverImg = subject.cover_image || window.DATA?.subjectCovers?.[subject.id] || `assets/covers/${subject.id}.jpg`;
    const backArrow = isAr ? 'arrow-right' : 'arrow-left';

    // Get files for this category
    const files = window.DATA.getSheetsForSubject 
      ? window.DATA.getSheetsForSubject(subject.id)
      : [];

    let categoryLabel = isAr ? 'شيتات ومحاضرات المادة' : 'Subject Handouts & Lectures';
    if (categoryId === 'summaries') categoryLabel = isAr ? 'الملخصات المركزة والمراجعات' : 'High-Yield Summaries';
    if (categoryId === 'past-exams') categoryLabel = isAr ? 'أرشيف امتحانات السنوات السابقة' : 'Past Exams Archive';
    if (categoryId === 'files-slides') categoryLabel = isAr ? 'عروض السلايدات والمراجع' : 'Slides & Supplementary Files';

    modalBox.innerHTML = `
      <!-- Header -->
      <div class="modal-header">
        <div class="modal-header-meta">
          <div class="modal-subject-banner-thumb">
            <img src="${coverImg}" alt="${primaryTitle}" onerror="this.onerror=null; this.src='assets/covers/gen-med.jpg';" />
          </div>
          <div class="modal-title-wrap">
            <h2>${primaryTitle}</h2>
            <p>${subTitle} • ${categoryLabel}</p>
          </div>
        </div>
        <button class="modal-close-btn" onclick="SubjectModal.close();" aria-label="${t('closeBtn')}">
          ✕
        </button>
      </div>

      <!-- Explorer View -->
      <div class="modal-body modal-explorer-view">
        <!-- Sub Navigation Bar -->
        <div class="explorer-top-nav">
          <button class="btn-back-categories" onclick="SubjectModal.renderCategoriesView();">
            <i data-lucide="${backArrow}" style="width: 15px; height: 15px;"></i>
            <span>${isAr ? 'العودة للأقسام' : 'Back to Hubs'}</span>
          </button>

          <button class="btn btn-secondary btn-sm" onclick="SubjectModal.close(); window.ROUTER.navigate('/sheets?subject=${subject.id}');">
            <span>${isAr ? 'الانتقال للصفحة الكاملة' : 'Full Page View'}</span>
            <i data-lucide="${isAr ? 'arrow-left' : 'arrow-right'}" style="width: 14px; height: 14px;"></i>
          </button>
        </div>

        <!-- Modern 16px Cards List -->
        <div class="modal-files-cards-list">
          ${files.map(item => `
            <div class="modal-file-card">
              <!-- Top: Type Badge + Lecture Title -->
              <div class="modal-file-top">
                <span class="sheet-type-pill">
                  <i data-lucide="file-text" style="width: 12px; height: 12px;"></i>
                  ${item.type || 'PDF Sheet'}
                </span>
                <h3 class="modal-file-title">${item.title}</h3>
              </div>

              <!-- Information Row: Pages • Size • Doctor • Date -->
              <div class="modal-file-meta-row">
                <div class="modal-meta-item" title="${isAr ? 'عدد الصفحات' : 'Pages'}">
                  <i data-lucide="book-open"></i>
                  <span><strong>${item.pages || 18}</strong> ${isAr ? 'صفحة' : 'pages'}</span>
                </div>

                <div class="modal-meta-item" title="${isAr ? 'حجم الملف' : 'Size'}">
                  <i data-lucide="hard-drive"></i>
                  <span><strong>${item.size || '3.2 MB'}</strong></span>
                </div>

                <div class="modal-meta-item" title="${isAr ? 'الأستاذ' : 'Doctor'}">
                  <i data-lucide="user-check"></i>
                  <span>${item.doctor_name || (isAr ? 'د. طارق الزاوي' : 'Dr. Tarek Alzawi')}</span>
                </div>

                <div class="modal-meta-item" title="${isAr ? 'التاريخ' : 'Date'}">
                  <i data-lucide="calendar"></i>
                  <span>${item.date || '2026-09-12'}</span>
                </div>
              </div>

              <!-- Bottom: Dual Action Buttons -->
              <div class="modal-file-actions-row">
                <button class="btn btn-primary btn-sm btn-action-view" onclick="SubjectModal.previewDoc('${item.id}');">
                  <i data-lucide="eye" style="width: 14px; height: 14px;"></i>
                  <span>${isAr ? 'قراءة / معاينة' : 'Read / View'}</span>
                </button>

                <button class="btn btn-secondary btn-sm btn-action-download" onclick="SubjectModal.downloadDoc('${item.id}');">
                  <i data-lucide="download" style="width: 14px; height: 14px;"></i>
                  <span>${isAr ? 'تنزيل PDF' : 'Download'}</span>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  },

  previewDoc(docId) {
    const subject = SubjectModal.currentSubject;
    const files = window.DATA.getSheetsForSubject 
      ? window.DATA.getSheetsForSubject(subject ? subject.id : '')
      : [];
    const doc = files.find(f => f.id === docId) || {
      id: docId,
      title: 'محاضرة طبية معتمدة',
      subject_name: subject ? subject.name_ar : 'طب الأسنان',
      doctor_name: 'د. طارق الزاوي',
      pages: 18,
      size: '3.2 MB',
      date: '2026-09-12'
    };

    if (window.DocumentViewer) {
      window.DocumentViewer.open(doc);
    }
  },

  downloadDoc(docId) {
    const subject = SubjectModal.currentSubject;
    const files = window.DATA.getSheetsForSubject 
      ? window.DATA.getSheetsForSubject(subject ? subject.id : '')
      : [];
    const doc = files.find(f => f.id === docId);
    if (window.DocumentViewer) {
      window.DocumentViewer.download(doc || { title: 'Dental Sheet' });
    } else {
      SubjectModal.downloadItem(doc?.title || 'Dental Sheet');
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
