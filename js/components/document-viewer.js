/**
 * KURO FANGS — IN-APP DOCUMENT / PDF VIEWER MODAL
 * Direct In-App Reading with Glassmorphic Previewer (<iframe />) & Dual Action Controls
 */

const DocumentViewer = {
  currentDoc: null,
  isOpen: false,

  init() {
    if (document.getElementById('doc-viewer-modal')) return;

    const modalMarkup = `
      <div id="doc-viewer-modal" class="doc-viewer-backdrop" aria-hidden="true">
        <div class="doc-viewer-window" role="dialog" aria-modal="true">
          <!-- Viewer Top Toolbar -->
          <div class="doc-viewer-header">
            <div class="doc-viewer-title-group">
              <span class="doc-badge-type" id="doc-viewer-badge">PDF</span>
              <div class="doc-viewer-meta-text">
                <h3 id="doc-viewer-title">Lecture Document</h3>
                <p id="doc-viewer-subtitle">Dental Surgery • Year 3</p>
              </div>
            </div>

            <div class="doc-viewer-actions">
              <span class="doc-pages-indicator" id="doc-viewer-pages-pill">
                <i data-lucide="book-open" style="width: 14px; height: 14px;"></i>
                <span id="doc-viewer-pages-text">18 Pages</span>
              </span>

              <button id="doc-viewer-download-btn" class="btn btn-primary btn-sm" title="Download PDF">
                <i data-lucide="download" style="width: 15px; height: 15px;"></i>
                <span id="doc-viewer-download-text">Download</span>
              </button>

              <button id="doc-viewer-print-btn" class="btn btn-secondary btn-sm" title="Print Document">
                <i data-lucide="printer" style="width: 15px; height: 15px;"></i>
              </button>

              <button id="doc-viewer-fullscreen-btn" class="btn btn-secondary btn-sm" title="Toggle Fullscreen">
                <i data-lucide="maximize" style="width: 15px; height: 15px;"></i>
              </button>

              <button id="doc-viewer-close-btn" class="doc-viewer-close-btn" aria-label="Close Viewer">
                ✕
              </button>
            </div>
          </div>

          <!-- Document Viewport Frame -->
          <div class="doc-viewer-body">
            <iframe id="doc-viewer-iframe" class="doc-viewer-iframe" title="PDF Document Preview" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalMarkup);

    // Event listeners
    const modalEl = document.getElementById('doc-viewer-modal');
    const closeBtn = document.getElementById('doc-viewer-close-btn');
    const downloadBtn = document.getElementById('doc-viewer-download-btn');
    const printBtn = document.getElementById('doc-viewer-print-btn');
    const fsBtn = document.getElementById('doc-viewer-fullscreen-btn');

    if (closeBtn) closeBtn.addEventListener('click', () => DocumentViewer.close());
    if (modalEl) {
      modalEl.addEventListener('click', (e) => {
        if (e.target === modalEl) DocumentViewer.close();
      });
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        if (DocumentViewer.currentDoc) {
          DocumentViewer.download(DocumentViewer.currentDoc);
        }
      });
    }

    if (printBtn) {
      printBtn.addEventListener('click', () => {
        const iframe = document.getElementById('doc-viewer-iframe');
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        }
      });
    }

    if (fsBtn) {
      fsBtn.addEventListener('click', () => {
        const win = document.querySelector('.doc-viewer-window');
        if (win) {
          win.classList.toggle('fullscreen');
        }
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && DocumentViewer.isOpen) {
        DocumentViewer.close();
      }
    });

    if (window.lucide) window.lucide.createIcons();
  },

  open(doc) {
    DocumentViewer.init();

    DocumentViewer.currentDoc = doc || {
      title: 'محاضرة طبية معتمدة',
      subject_name: 'طب وجراحة الفم والأسنان',
      doctor_name: 'هيئة التدريس',
      pages: 18,
      size: '3.2 MB',
      date: '2026-09-12'
    };

    DocumentViewer.isOpen = true;
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;

    const modalEl = document.getElementById('doc-viewer-modal');
    const titleEl = document.getElementById('doc-viewer-title');
    const subEl = document.getElementById('doc-viewer-subtitle');
    const pagesTextEl = document.getElementById('doc-viewer-pages-text');
    const downloadText = document.getElementById('doc-viewer-download-text');
    const iframe = document.getElementById('doc-viewer-iframe');

    const docTitle = doc.title || (isAr ? doc.title_ar : doc.title_en) || (isAr ? 'محاضرة معتمدة' : 'Lecture Sheet');
    const docSubject = doc.subject_name || (isAr ? 'طب الأسنان — السنة الثالثة' : 'Dentistry — Year 3');
    const docDoctor = doc.doctor_name || (isAr ? 'د. طارق الزاوي' : 'Dr. Tarek Alzawi');
    const docPages = doc.pages || 18;
    const docSize = doc.size || '3.2 MB';

    if (titleEl) titleEl.textContent = docTitle;
    if (subEl) subEl.textContent = `${docSubject} • ${docDoctor} • ${docSize}`;
    if (pagesTextEl) pagesTextEl.textContent = `${docPages} ${isAr ? 'صفحة' : 'Pages'}`;
    if (downloadText) downloadText.textContent = isAr ? 'تنزيل PDF' : 'Download PDF';

    // Generate authentic high-fidelity dental PDF reader srcdoc
    const srcDocContent = DocumentViewer.generateDocHTML(doc, isAr);
    if (iframe) {
      iframe.srcdoc = srcDocContent;
    }

    if (modalEl) {
      modalEl.classList.add('active');
      modalEl.setAttribute('aria-hidden', 'false');
    }

    document.body.style.overflow = 'hidden';

    if (window.lucide) window.lucide.createIcons();
  },

  close() {
    DocumentViewer.isOpen = false;
    const modalEl = document.getElementById('doc-viewer-modal');
    if (modalEl) {
      modalEl.classList.remove('active');
      modalEl.setAttribute('aria-hidden', 'true');
    }

    const win = document.querySelector('.doc-viewer-window');
    if (win) win.classList.remove('fullscreen');

    const iframe = document.getElementById('doc-viewer-iframe');
    if (iframe) {
      iframe.srcdoc = '';
    }

    document.body.style.overflow = '';
  },

  download(doc) {
    window.STORE.addPoints(10);
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
    const title = doc?.title || doc?.title_ar || doc?.title_en || 'Document';
    const msg = isAr 
      ? `تم بدء تنزيل الملف بنجاح! (+10 نقاط أكاديمية) — [${title}]`
      : `Download started! (+10 pts earned) — [${title}]`;
    window.showToast(msg, { type: 'success', points: 10 });
  },

  generateDocHTML(doc, isAr) {
    const title = doc.title || (isAr ? doc.title_ar : doc.title_en) || 'Lecture Sheet';
    const subject = doc.subject_name || (isAr ? 'طب وجراحة الفم والأسنان' : 'Oral & Dental Surgery');
    const doctor = doc.doctor_name || (isAr ? 'د. طارق الزاوي' : 'Dr. Tarek Alzawi');
    const pages = doc.pages || 18;
    const date = doc.date || '2026-09-12';
    const dir = isAr ? 'rtl' : 'ltr';

    return `<!DOCTYPE html>
<html lang="${isAr ? 'ar' : 'en'}" dir="${dir}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #BE123C;
      --primary-dark: #881337;
      --text-main: #1E293B;
      --text-muted: #64748B;
      --bg-page: #F1F5F9;
      --paper: #FFFFFF;
      --border: #CBD5E1;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: ${isAr ? "'IBM Plex Sans Arabic', sans-serif" : "'Inter', sans-serif"};
      background-color: var(--bg-page);
      color: var(--text-main);
      line-height: 1.65;
      padding: 30px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .pdf-page-container {
      width: 100%;
      max-width: 820px;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }
    .pdf-sheet-paper {
      background: var(--paper);
      border-radius: 6px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04);
      padding: 48px 54px;
      position: relative;
      min-height: 980px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .paper-watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-35deg);
      font-size: 5rem;
      font-weight: 900;
      color: rgba(190, 18, 60, 0.035);
      user-select: none;
      pointer-events: none;
      white-space: nowrap;
      letter-spacing: 0.1em;
    }
    .pdf-header-official {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #881337;
      padding-bottom: 18px;
      margin-bottom: 28px;
    }
    .header-uni-meta h4 {
      font-size: 0.95rem;
      font-weight: 800;
      color: #881337;
    }
    .header-uni-meta p {
      font-size: 0.775rem;
      color: var(--text-muted);
    }
    .header-logo-badge {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #FFF1F2;
      border: 1px solid #FECDD3;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }
    .doc-main-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: #0F172A;
      margin-bottom: 8px;
      line-height: 1.35;
    }
    .doc-info-strip {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      font-size: 0.825rem;
      color: var(--text-muted);
      background: #F8FAFC;
      padding: 10px 14px;
      border-radius: 6px;
      border: 1px solid var(--border);
      margin-bottom: 24px;
    }
    .doc-info-strip strong {
      color: var(--text-main);
    }
    .section-title {
      font-size: 1.1rem;
      font-weight: 800;
      color: #881337;
      border-right: ${isAr ? '4px solid #BE123C' : 'none'};
      border-left: ${isAr ? 'none' : '4px solid #BE123C'};
      padding: 0 10px;
      margin: 22px 0 12px;
    }
    .content-box {
      font-size: 0.925rem;
      color: #334155;
      line-height: 1.75;
      margin-bottom: 16px;
    }
    .pearl-callout {
      background: #FFFBEB;
      border: 1px solid #FDE68A;
      border-radius: 8px;
      padding: 14px 18px;
      margin: 18px 0;
    }
    .pearl-callout strong {
      color: #B45309;
      display: block;
      margin-bottom: 4px;
      font-size: 0.9rem;
    }
    .clinical-keypoints {
      list-style-type: none;
      padding: 0;
      margin: 12px 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .clinical-keypoints li {
      position: relative;
      padding-right: ${isAr ? '20px' : '0'};
      padding-left: ${isAr ? '0' : '20px'};
      font-size: 0.9rem;
      color: #1E293B;
    }
    .clinical-keypoints li::before {
      content: "•";
      color: #BE123C;
      font-weight: bold;
      font-size: 1.3rem;
      position: absolute;
      ${isAr ? 'right: 0;' : 'left: 0;'}
      top: -3px;
    }
    .paper-footer {
      border-top: 1px solid var(--border);
      padding-top: 12px;
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    @media print {
      body { background: #fff; padding: 0; }
      .pdf-sheet-paper { box-shadow: none; padding: 30px; border: none; }
    }
  </style>
</head>
<body>
  <div class="pdf-page-container">
    <!-- Page 1 -->
    <div class="pdf-sheet-paper">
      <div class="paper-watermark">KURO FANGS</div>
      <div>
        <div class="pdf-header-official">
          <div class="header-uni-meta">
            <h4>${isAr ? 'كلية طب وجراحة الفم والأسنان' : 'Faculty of Dentistry'}</h4>
            <p>${isAr ? 'السنة الثالثة • العام الجامعي 2026 - 2027 • المحاضرات الرسمية' : 'Year 3 • Academic Year 2026 - 2027 • Official Syllabus'}</p>
          </div>
          <div class="header-logo-badge">🦷</div>
        </div>

        <h1 class="doc-main-title">${title}</h1>
        <div class="doc-info-strip">
          <span>${isAr ? 'المقرر:' : 'Course:'} <strong>${subject}</strong></span>
          <span>${isAr ? 'الأستاذ:' : 'Instructor:'} <strong>${doctor}</strong></span>
          <span>${isAr ? 'التاريخ:' : 'Date:'} <strong>${date}</strong></span>
          <span>${isAr ? 'عدد الصفحات:' : 'Pages:'} <strong>${pages}</strong></span>
        </div>

        <h2 class="section-title">${isAr ? '1. نظرة عامة وأهداف المحاضرة (Learning Objectives)' : '1. Overview & Learning Objectives'}</h2>
        <div class="content-box">
          <p>${isAr 
            ? 'تستعرض هذه المذكرة الدراسية أهم المفاهيم السريرية والتشخيصية التخصصية وفق الخطة الدراسية المعتمدة لطلبة السنة الثالثة بكلية طب وجراحة الفم والأسنان. يهدف الشيت لتمكين الطالب من الإحاطة بالمبادئ النظرية والربط السريري المباشر.' 
            : 'This comprehensive clinical handout covers fundamental diagnostic criteria, biological concepts, and operative guidelines established for Year 3 Dental Surgery students.'}
          </p>
        </div>

        <div class="pearl-callout">
          <strong>⚡ ${isAr ? 'تنبيه سريري وامتحاني عالي الأهمية (High-Yield Clinical Pearl):' : 'High-Yield Clinical Pearl:'}</strong>
          <p>${isAr 
            ? 'يركز واضعو الامتحانات عادةً على الفروقات التشخيصية الدقيقة والتدبير الأولي السليم، مع إيلاء عناية خاصة للمؤشرات الحيوية والموانع السريرية قبل أي إجراء تدخلي.' 
            : 'Focus closely on clinical differential diagnosis and immediate pre-operative assessment indicators frequently tested in midterm and final examinations.'}
          </p>
        </div>

        <h2 class="section-title">${isAr ? '2. المبادئ التشخيصية والتصنيف السريري (Clinical Criteria)' : '2. Core Principles & Classification'}</h2>
        <ul class="clinical-keypoints">
          <li>${isAr ? 'التقييم الأولي الشامل للحالة وأخذ السيرة المرضية والفحص العياني المنهجي.' : 'Comprehensive patient evaluation, clinical history taking, and structured extra-oral examination.'}</li>
          <li>${isAr ? 'التشخيص التفريقي الدقيق والمقارنة بين الحالات المتشابهة في العرض السريري والأشعة.' : 'Accurate differential diagnosis correlating clinical findings with intra-oral radiographic features.'}</li>
          <li>${isAr ? 'تحديد البروتوكول العلاجي المناسب وخطوات العزل الميداني والأدوات المعقمة المعتمدة.' : 'Selection of modern evidence-based therapeutic protocols and sterile field isolation.'}</li>
          <li>${isAr ? 'متابعة الشفاء وتوثيق أي اختلاطات محتملة وكيفية تدبيرها سريرياً بكفاءة عالية.' : 'Post-treatment evaluation, complication monitoring, and patient management protocols.'}</li>
        </ul>
      </div>

      <div class="paper-footer">
        <span>Kuro Fangs Academic Platform • Faculty of Dentistry</span>
        <span>Page 1 of ${pages}</span>
      </div>
    </div>

    <!-- Page 2 -->
    <div class="pdf-sheet-paper">
      <div class="paper-watermark">KURO FANGS</div>
      <div>
        <div class="pdf-header-official">
          <div class="header-uni-meta">
            <h4>${subject} — ${isAr ? 'ملخص المحاضرة والمراجعة السريعة' : 'Lecture Summary & Review'}</h4>
            <p>${isAr ? 'القسم الأكاديمي • السنة الثالثة طب أسنان' : 'Academic Department • Year 3 BDS'}</p>
          </div>
          <div class="header-logo-badge">📖</div>
        </div>

        <h2 class="section-title">${isAr ? '3. ملخص النقاط الجوهرية للامتحان (Exam Review Summary)' : '3. High-Yield Exam Review'}</h2>
        <div class="content-box">
          <p>${isAr
            ? 'تتضمن هذه الصفحة مراجعة مكثفة للنقاط الأكثر تكراراً في امتحانات النظري السابقة للسنوات الثلاث الماضية:'
            : 'Key high-yield review notes synthesized from previous academic theory exams:'}
          </p>
        </div>

        <div class="pearl-callout" style="background: #F0FDF4; border-color: #BBF7D0;">
          <strong style="color: #15803D;">✅ ${isAr ? 'ملاحظة التدقيق الأكاديمي:' : 'Faculty Verification:'}</strong>
          <p>${isAr
            ? 'تم تدقيق هذه المذكرة ومطابقتها مع تسجيلات المحاضرات وسلايدات العرض المعتمدة رسمياً.'
            : 'Handout fully verified against official recordings and primary university departmental slides.'}
          </p>
        </div>

        <h2 class="section-title">${isAr ? '4. أسئلة تدريبية سريعة (Self-Assessment Quiz)' : '4. Self-Assessment Practice'}</h2>
        <ul class="clinical-keypoints">
          <li><strong>Q1:</strong> ${isAr ? 'ما هو المؤشر الأساسي لتشخيص الحالة في المرحلة الأولى؟' : 'What is the primary indicator in initial clinical evaluation?'}</li>
          <li><strong>Q2:</strong> ${isAr ? 'ما هي موانع الاستخدام الأكثر أهمية التي يجب مراعاتها عند العلاج؟' : 'What are the essential contraindications to observe prior to intervention?'}</li>
        </ul>
      </div>

      <div class="paper-footer">
        <span>Kuro Fangs Academic Platform • Faculty of Dentistry</span>
        <span>Page 2 of ${pages}</span>
      </div>
    </div>
  </div>
</body>
</html>`;
  }
};

window.DocumentViewer = DocumentViewer;
