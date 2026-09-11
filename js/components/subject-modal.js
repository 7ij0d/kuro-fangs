/**
 * KURO FANGS — FLOATING INTERACTIVE SUBJECT MODAL
 * Centered modal containing the 8 academic content hubs
 */

const SubjectModal = {
  currentSubject: null,
  activeCategory: null,

  init() {
    // Backdrop click to close
    const backdrop = document.getElementById('subject-modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          SubjectModal.close();
        }
      });
    }

    // Escape key listener
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

  // 1. Render the 8 Category Tiles
  renderCategoriesView() {
    const subject = SubjectModal.currentSubject;
    const modalBox = document.getElementById('subject-modal-box');
    if (!modalBox || !subject) return;

    const categories = [
      {
        id: 'sheets',
        title: 'شيتات ومحاضرات المادة',
        desc: 'المحاضرات الرسمية والتفريغات المعتمدة (PDF)',
        icon: '📄',
        badge: `${subject.sheet_count || 18} شيت`
      },
      {
        id: 'recordings',
        title: 'تسجيلات وشروحات المادة',
        desc: 'الشروحات الصوتية والفيديوهات السريرية والمعملية',
        icon: '🎙️',
        badge: 'تسجيلات متوفرة'
      },
      {
        id: 'past-exams',
        title: 'أسئلة سنوات سابقة',
        desc: 'نماذج الامتحانات النصفية والنهائية السابقة والحلول',
        icon: '🏛️',
        badge: 'محدث 2025'
      },
      {
        id: 'ai-questions',
        title: 'أسئلة مولدة بالـ AI',
        desc: 'كويزات ذكية تفاعلية وتدريب بنك الأسئلة مع تصحيح فوري',
        icon: '🤖',
        badge: 'تدريب تفاعلي'
      },
      {
        id: 'doctor-notes',
        title: 'ملاحظات وتفريغات الدكاترة',
        desc: 'التنبيهات السريرية وأهم النقاط المركزة من هيئة التدريس',
        icon: '👨‍⚕️',
        badge: 'تفريغات حصرية'
      },
      {
        id: 'summaries',
        title: 'ملخصات المادة المركزة',
        desc: 'مذكرات المراجعة السريعة ومخططات ليلة الامتحان',
        icon: '📑',
        badge: 'مراجعات نهائية'
      },
      {
        id: 'flashcards-atlas',
        title: 'البطاقات التفاعلية والأطلس',
        desc: 'بطاقات التذكر السريع وصور الأشعة والحالات السريرية',
        icon: '🗂️',
        badge: 'حفظ بصري'
      },
      {
        id: 'files-slides',
        title: 'ملفات ومصادر إضافية',
        desc: 'عروض السلايدات والمراجع العلمية الموصى بها',
        icon: '📁',
        badge: 'روابط مباشرة'
      }
    ];

    modalBox.innerHTML = `
      <!-- Header -->
      <div class="modal-header">
        <div class="modal-header-meta">
          <div class="modal-subject-icon">
            ${subject.icon || '🦷'}
          </div>
          <div class="modal-title-wrap">
            <h2>${subject.name_ar}</h2>
            <p>${subject.name_en} • ${subject.code}</p>
          </div>
        </div>
        <button class="modal-close-btn" onclick="SubjectModal.close();" aria-label="إغلاق">
          ✕
        </button>
      </div>

      <!-- Body: 8 Options -->
      <div class="modal-body">
        <div class="modal-prompt-title">
          <i data-lucide="sparkles" style="color: var(--brand-burgundy); width: 18px; height: 18px;"></i>
          اختر القسم الأكاديمي الذي تريد فتحه:
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
                <i data-lucide="arrow-left" style="width: 18px; height: 18px;"></i>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  },

  // 2. Open Specific Category Inside Modal
  openCategory(categoryId) {
    SubjectModal.activeCategory = categoryId;
    const subject = SubjectModal.currentSubject;
    const modalBox = document.getElementById('subject-modal-box');
    if (!modalBox || !subject) return;

    let categoryTitle = '';
    let categoryIcon = '';
    let itemsHTML = '';

    if (categoryId === 'sheets') {
      categoryTitle = 'شيتات ومحاضرات المادة';
      categoryIcon = '📄';
      const sheets = window.DATA.getSheetsBySubject(subject.id);
      const displaySheets = sheets.length > 0 ? sheets : [
        { id: 's1', title: `المحاضرة 1: مدخل ومفاهيم أساسية في ${subject.name_ar}`, doctor: 'أستاذ المادة', date: '2026-09-02' },
        { id: 's2', title: `المحاضرة 2: التشخيص والبروتوكولات السريرية المعتمدة`, doctor: 'أستاذ المادة', date: '2026-09-06' },
        { id: 's3', title: `المحاضرة 3: الإجراءات العلاجية ومناقشة الحالات`, doctor: 'أستاذ المادة', date: '2026-09-10' }
      ];

      itemsHTML = displaySheets.map(s => `
        <div class="explorer-item-row">
          <div class="explorer-item-info">
            <div class="explorer-item-icon"><i data-lucide="file-text"></i></div>
            <div>
              <div class="explorer-item-title">${s.title}</div>
              <div class="explorer-item-meta">${s.doctor || 'هيئة التدريس'} • ${s.date || '2026-09-08'}</div>
            </div>
          </div>
          <div class="explorer-item-action">
            <button class="btn btn-burgundy" style="padding: 6px 14px; font-size: 0.8rem;" onclick="SubjectModal.downloadItem('${s.title}');">
              <i data-lucide="download" style="width: 14px; height: 14px;"></i>
              تحميل PDF
            </button>
          </div>
        </div>
      `).join('');
    } else if (categoryId === 'recordings') {
      categoryTitle = 'تسجيلات وشروحات المادة';
      categoryIcon = '🎙️';
      itemsHTML = `
        <div class="explorer-item-row">
          <div class="explorer-item-info">
            <div class="explorer-item-icon"><i data-lucide="play-circle"></i></div>
            <div>
              <div class="explorer-item-title">تسجيل صوتي: شرح تفصيلي للمحاضرة الأولى مع الحالات</div>
              <div class="explorer-item-meta">المدة: 38 دقيقة • جودة نقية MP3</div>
            </div>
          </div>
          <button class="btn btn-burgundy" style="padding: 6px 14px; font-size: 0.8rem;" onclick="alert('تم بدء تشغيل التسجيل الصوتي');">
            <i data-lucide="play" style="width: 14px; height: 14px;"></i>
            استماع
          </button>
        </div>
        <div class="explorer-item-row">
          <div class="explorer-item-info">
            <div class="explorer-item-icon"><i data-lucide="video"></i></div>
            <div>
              <div class="explorer-item-title">فيديو معملي: تطبيق سريري مباشر في عيادات الكلية</div>
              <div class="explorer-item-meta">المدة: 45 دقيقة • جودة عالية HD</div>
            </div>
          </div>
          <button class="btn btn-burgundy" style="padding: 6px 14px; font-size: 0.8rem;" onclick="alert('تم فتح شاشة الفيديو');">
            <i data-lucide="external-link" style="width: 14px; height: 14px;"></i>
            مشاهدة
          </button>
        </div>
      `;
    } else if (categoryId === 'past-exams') {
      categoryTitle = 'أسئلة سنوات سابقة';
      categoryIcon = '🏛️';
      itemsHTML = `
        <div class="explorer-item-row">
          <div class="explorer-item-info">
            <div class="explorer-item-icon"><i data-lucide="file-check"></i></div>
            <div>
              <div class="explorer-item-title">امتحان نصفي 2024-2025 مع مفتاح الحل النموذجي</div>
              <div class="explorer-item-meta">50 سؤال اختيار من متعدد وتفسيرات الأسئلة</div>
            </div>
          </div>
          <button class="btn btn-burgundy" style="padding: 6px 14px; font-size: 0.8rem;" onclick="SubjectModal.downloadItem('امتحان نصفي 2025');">
            <i data-lucide="download" style="width: 14px; height: 14px;"></i>
            تحميل النموذج
          </button>
        </div>
        <div class="explorer-item-row">
          <div class="explorer-item-info">
            <div class="explorer-item-icon"><i data-lucide="file-check"></i></div>
            <div>
              <div class="explorer-item-title">امتحان الدور النهائي 2024 مع الحلول والتعليلات</div>
              <div class="explorer-item-meta">70 سؤال شامل لكامل مفردات المنهج</div>
            </div>
          </div>
          <button class="btn btn-burgundy" style="padding: 6px 14px; font-size: 0.8rem;" onclick="SubjectModal.downloadItem('امتحان نهائي 2024');">
            <i data-lucide="download" style="width: 14px; height: 14px;"></i>
            تحميل النموذج
          </button>
        </div>
      `;
    } else if (categoryId === 'ai-questions') {
      categoryTitle = 'أسئلة مولدة بالـ AI';
      categoryIcon = '🤖';
      itemsHTML = `
        <div class="explorer-item-row">
          <div class="explorer-item-info">
            <div class="explorer-item-icon"><i data-lucide="sparkles"></i></div>
            <div>
              <div class="explorer-item-title">كويز تفاعلي ذكي: أهم التركات الصعبة والتشخيص التفريقي</div>
              <div class="explorer-item-meta">10 أسئلة تقييمية مع تصحيح ذكي فوري</div>
            </div>
          </div>
          <a href="#/quizzes" class="btn btn-burgundy" style="padding: 6px 14px; font-size: 0.8rem;" onclick="SubjectModal.close();">
            <i data-lucide="play" style="width: 14px; height: 14px;"></i>
            بدء الاختبار الآن
          </a>
        </div>
      `;
    } else if (categoryId === 'doctor-notes') {
      categoryTitle = 'ملاحظات وتفريغات الدكاترة';
      categoryIcon = '👨‍⚕️';
      itemsHTML = `
        <div class="explorer-item-row">
          <div class="explorer-item-info">
            <div class="explorer-item-icon"><i data-lucide="edit-3"></i></div>
            <div>
              <div class="explorer-item-title">تفريغات الأساتذة: النقاط المؤكدة للامتحانات النصفية</div>
              <div class="explorer-item-meta">ملاحظات سريرية من داخل قاعات المحاضرات</div>
            </div>
          </div>
          <button class="btn btn-burgundy" style="padding: 6px 14px; font-size: 0.8rem;" onclick="SubjectModal.downloadItem('تفريغات الدكاترة');">
            <i data-lucide="download" style="width: 14px; height: 14px;"></i>
            تحميل الملاحظات
          </button>
        </div>
      `;
    } else if (categoryId === 'summaries') {
      categoryTitle = 'ملخصات المادة المركزة';
      categoryIcon = '📑';
      itemsHTML = `
        <div class="explorer-item-row">
          <div class="explorer-item-info">
            <div class="explorer-item-icon"><i data-lucide="file-text"></i></div>
            <div>
              <div class="explorer-item-title">ملخص ليلة الامتحان: جداول المقارنة والأدوية الأساسية</div>
              <div class="explorer-item-meta">12 صفحة مدمجة ومكثفة</div>
            </div>
          </div>
          <button class="btn btn-burgundy" style="padding: 6px 14px; font-size: 0.8rem;" onclick="SubjectModal.downloadItem('ملخص ليلة الامتحان');">
            <i data-lucide="download" style="width: 14px; height: 14px;"></i>
            تحميل الملخص
          </button>
        </div>
      `;
    } else if (categoryId === 'flashcards-atlas') {
      categoryTitle = 'البطاقات التفاعلية والأطلس';
      categoryIcon = '🗂️';
      itemsHTML = `
        <div class="explorer-item-row">
          <div class="explorer-item-info">
            <div class="explorer-item-icon"><i data-lucide="layers"></i></div>
            <div>
              <div class="explorer-item-title">مجموعة البطاقات التعليمية الذكية (Flashcards)</div>
              <div class="explorer-item-meta">مراجعة سريعة للمصطلحات والتشخيصات</div>
            </div>
          </div>
          <a href="#/flashcards" class="btn btn-burgundy" style="padding: 6px 14px; font-size: 0.8rem;" onclick="SubjectModal.close();">
            <i data-lucide="layers" style="width: 14px; height: 14px;"></i>
            فتح البطاقات
          </a>
        </div>
      `;
    } else {
      categoryTitle = 'ملفات ومصادر إضافية';
      categoryIcon = '📁';
      itemsHTML = `
        <div class="explorer-item-row">
          <div class="explorer-item-info">
            <div class="explorer-item-icon"><i data-lucide="folder"></i></div>
            <div>
              <div class="explorer-item-title">المجلد السحابي الكامل: سلايدات وكتب المرجع المعتمدة</div>
              <div class="explorer-item-meta">رابط مباشر للتحميل والمطالعة</div>
            </div>
          </div>
          <button class="btn btn-burgundy" style="padding: 6px 14px; font-size: 0.8rem;" onclick="alert('تم فتح المجلد السحابي للمادة');">
            <i data-lucide="external-link" style="width: 14px; height: 14px;"></i>
            فتح المصادر
          </button>
        </div>
      `;
    }

    modalBox.innerHTML = `
      <div class="modal-header">
        <div class="modal-header-meta">
          <div class="modal-subject-icon">${categoryIcon}</div>
          <div class="modal-title-wrap">
            <h2>${categoryTitle}</h2>
            <p>${subject.name_ar} • ${subject.code}</p>
          </div>
        </div>
        <button class="modal-close-btn" onclick="SubjectModal.close();" aria-label="إغلاق">✕</button>
      </div>

      <div class="modal-body">
        <div class="explorer-top-nav">
          <button class="btn-back-categories" onclick="SubjectModal.renderCategoriesView();">
            <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i>
            العودة لكافة أقسام المادة
          </button>
          <span style="font-size: 0.8rem; color: var(--text-muted);">محتوى متاح ومباشر</span>
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
    alert(`تم بدء تحميل "${title}" بنجاح! (+10 نقاط أكاديمية)`);
  }
};

window.SubjectModal = SubjectModal;
