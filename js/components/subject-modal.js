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
          title: t('catSheets') || (isAr ? 'الشيتات والمحاضرات' : 'Sheets & Lectures'),
          desc: t('catSheetsDesc') || (isAr ? 'تصفح الشيتات الرسمية' : 'Browse official sheets'),
          icon: '<i data-lucide="file-text" style="width: 24px; height: 24px; color: #0284C7;"></i>'
        },
        {
          id: 'recordings',
          title: t('catRecordings') || (isAr ? 'التسجيلات الصوتية' : 'Audio Recordings'),
          desc: t('catRecordingsDesc') || (isAr ? 'تسجيلات دكاترة الكلية' : 'Faculty lecture audio'),
          icon: '<i data-lucide="mic" style="width: 24px; height: 24px; color: #10B981;"></i>'
        },
        {
          id: 'ai-questions',
          title: t('catQuestions') || (isAr ? 'الأسئلة' : 'Questions'),
          desc: t('catQuestionsDesc') || (isAr ? 'بنك الأسئلة وأرشيف الامتحانات' : 'Question bank & past exams'),
          icon: '<i data-lucide="help-circle" style="width: 24px; height: 24px; color: #8B5CF6;"></i>'
        },
        
        {
          id: 'summaries',
          title: t('catSummaries') || (isAr ? 'الملخصات والمراجعات' : 'Summaries'),
          desc: t('catSummariesDesc') || (isAr ? 'مراجعات سريعة' : 'Quick reviews'),
          icon: '<i data-lucide="book-marked" style="width: 24px; height: 24px; color: #3B82F6;"></i>'
        },
        {
          id: 'files-slides',
        title: t('catFiles'),
        desc: t('catFilesDesc'),
        icon: '<i data-lucide="folder" style="width: 24px; height: 24px; color: #64748B;"></i>'
      }
    ];

    const coverImg = subject.cover_image || window.DATA?.subjectCovers?.[subject.id] || `assets/covers/${subject.id}.webp`;
    const arrowIcon = isAr ? 'arrow-left' : 'arrow-right';

    modalBox.innerHTML = `
      <!-- Header -->
      <div class="modal-header">
        <div class="modal-header-meta">
          <div class="modal-subject-banner-thumb">
            <img src="${coverImg}" alt="${primaryTitle}" width="600" height="337" loading="lazy" decoding="async" onerror="this.onerror=null; this.src='assets/covers/gen-med.webp';" />
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

    // For file-based categories (sheets, summaries, files-slides):
    // Provide instant in-modal explorer with 16px modern cards and dual action buttons!
    if (categoryId === 'sheets' || categoryId === 'summaries' || categoryId === 'files-slides') {
      SubjectModal.renderCategoryFiles(categoryId);
      return;
    }

    // Direct page navigation for tools
    SubjectModal.close();
    switch (categoryId) {
      case 'recordings':
        window.ROUTER.navigate(`/recordings?subject=${subjectId}`);
        break;
      case 'ai-questions':
      case 'past-exams':
      case 'flashcards-atlas':
        window.ROUTER.navigate(`/questions?subject=${subjectId}`);
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
    const coverImg = subject.cover_image || window.DATA?.subjectCovers?.[subject.id] || `assets/covers/${subject.id}.webp`;
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
            <img src="${coverImg}" alt="${primaryTitle}" width="600" height="337" loading="lazy" decoding="async" onerror="this.onerror=null; this.src='assets/covers/gen-med.webp';" />
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

        <!-- Modern 16px Cards List or Empty State -->
        <div class="modal-files-cards-list">
          ${files.length === 0 ? (
            window.renderEmptyState
              ? window.renderEmptyState()
              : `
                <div class="empty-state-card">
                  <div class="empty-state-icon-wrap">
                    <i data-lucide="folder-open"></i>
                  </div>
                  <h3 class="empty-state-title">${isAr ? 'لا توجد محتويات مضافة حالياً' : 'No contents available yet'}</h3>
                  <p class="empty-state-subtitle">${isAr ? 'جاري رفع واستكمال الملازم والمحتوى الأكاديمي قريباً' : 'Handouts and academic curriculum materials will be uploaded soon.'}</p>
                </div>
              `
          ) : files.map(item => `
            <div class="modal-file-card" onclick="SubjectModal.previewDoc('${item.id}');" style="cursor: pointer;">
              <!-- Top: Type Badge + Lecture Title -->
              <div class="modal-file-top" style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                ${item.order_index ? `
                  <span class="sheet-order-pill" style="background: rgba(14, 165, 233, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); font-weight: 700; font-size: 0.72rem; padding: 2px 8px; border-radius: 9999px;">
                    ${isAr ? `الشيت #${item.order_index}` : `Sheet #${item.order_index}`}
                  </span>
                ` : ''}
                <span class="sheet-type-pill">
                  <img src="assets/icons/sheets_cat.png" alt="Sheet" style="width: 14px; height: 14px; border-radius: 50%; object-fit: cover; vertical-align: middle; margin-inline-end: 4px;" />
                  ${item.type || 'PDF Sheet'}
                </span>
                <h3 class="modal-file-title">${item.title_ar || item.title}</h3>
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

                ${item.doctor_name ? `
                <div class="modal-meta-item" title="${isAr ? 'الأستاذ' : 'Doctor'}">
                  <i data-lucide="user-check"></i>
                  <span>${item.doctor_name}</span>
                </div>
                ` : ''}

                <div class="modal-meta-item" title="${isAr ? 'التاريخ' : 'Date'}">
                  <i data-lucide="calendar"></i>
                  <span>${item.date || '2026-09-12'}</span>
                </div>
              </div>

              <!-- Bottom: Dual Action Buttons -->
              <div class="modal-file-actions-row">
                <button class="btn btn-primary btn-sm btn-action-view" onclick="event.stopPropagation(); SubjectModal.previewDoc('${item.id}');">
                  <i data-lucide="eye" style="width: 14px; height: 14px;"></i>
                  <span>${isAr ? 'قراءة / معاينة' : 'Read / View'}</span>
                </button>

                <button class="btn btn-secondary btn-sm btn-action-download" onclick="event.stopPropagation(); SubjectModal.downloadDoc('${item.id}');">
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
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
    const files = window.DATA.getSheetsForSubject 
      ? window.DATA.getSheetsForSubject(subject ? subject.id : '')
      : [];
    const doc = files.find(f => f.id === docId) || {
      id: docId,
      title: subject ? (isAr ? subject.name_ar : subject.name_en) : (isAr ? 'ملزمة دراسية' : 'Study Handout'),
      subject_name: subject ? (isAr ? subject.name_ar : subject.name_en) : (isAr ? 'طب الأسنان' : 'Dentistry'),
      doctor_name: isAr ? (subject?.doctor_name_ar || '') : (subject?.doctor_name_en || ''),
      pages: 18,
      size: '3.2 MB',
      date: '2026-09-12'
    };

    SubjectModal.close();
    window.location.hash = '#/sheet-detail?id=' + docId;
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
