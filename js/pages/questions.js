/**
 * KURO FANGS — QUESTION BANK PAGE
 * Direct Destination with Pre-filtering Support & Bilingual Display
 */

const QuestionsPage = {
  render(container, queryParams) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
    const subjects = window.DATA ? window.DATA.getSubjects() : [];
    const targetSubject = queryParams?.get('subject') || 'all';
    let filterSubject = targetSubject;

    const questions = [
      {
        id: 'bq-1',
        subject_id: 'omfs',
        subject_name_ar: 'جراحة الفم والفكين 1',
        subject_name_en: 'Oral Surgery I',
        text_ar: 'ما هو الإجراء الفوري الأول عند حدوث إغماء وعائي مبهمي (Vasovagal Syncope) لعيادة الأسنان؟',
        text_en: 'What is the immediate primary step when a patient experiences vasovagal syncope in the dental chair?',
        answer_ar: 'وضع المريض فوراً في وضعية ترندلنبورغ (Trendelenburg position) برفع الساقين أعلى من مستوى الرأس لضمان عودة تدفق الدم إلى الدماغ وإيقاف أي إجراء علاجي مع قياس العلامات الحيوية.',
        answer_en: 'Immediately place the patient in Trendelenburg position (feet elevated above head level) to restore cerebral blood perfusion, terminate the procedure, loosen tight clothing, and monitor vital signs.',
        tags: ['تخدير', 'طوارئ']
      },
      {
        id: 'bq-2',
        subject_id: 'fixed-pros',
        subject_name_ar: 'التركيبات الثابتة 2',
        subject_name_en: 'Fixed Pros II',
        text_ar: 'ما هي الوظيفة الأساسية للـ Bevel في خط الإنهاء الخاص بالتيجان المعدنية أو الخزفية المعدنية؟',
        text_en: 'What is the primary function of adding a cavosurface bevel to finish lines in metal-ceramic preparations?',
        answer_ar: 'تأمين إغلاق حوافي فائق الدقة (Marginal fit)، حماية طبقة المينا غير المدعومة، وإتاحة حرق المعدن عند الحواف لتقليل سمك طبقة الإسمنت الملتصق.',
        answer_en: 'To achieve optimal marginal closure and adaptation, protect unsupported enamel rods, and allow burnishing of thin metal margins, thereby minimizing cement line exposure.',
        tags: ['تحضير', 'حواف']
      },
      {
        id: 'bq-3',
        subject_id: 'endo',
        subject_name_ar: 'علاج العصب 1',
        subject_name_en: 'Endodontics I',
        text_ar: 'ما الفرق بين الـ Overextension والـ Overfilling في حشو قنوات الجذور؟',
        text_en: 'What is the difference between Overextension and Overfilling in root canal obturation?',
        answer_ar: 'الـ Overfilling يعني أن القناة محشوة بشكل ثلاثي الأبعاد جيد مع خروج بسيط للطور الذروي، بينما الـ Overextension يعني تجاوز الحشوة لذروة الجذر دون إحكام سد القناة من الداخل.',
        answer_en: 'Overfilling denotes a well-compacted, three-dimensional obturation with a slight apical extrusion of sealer/gutta-percha. Overextension means the filling material passes beyond the apical foramen without adequate 3D condensation within the canal.',
        tags: ['حشو الجذور', 'أشعة']
      },
      {
        id: 'bq-4',
        subject_id: 'oral-diseases',
        subject_name_ar: 'علم أمراض الفم',
        subject_name_en: 'Oral Pathology',
        text_ar: 'ما هو التعريف الدقيق لآفة الكريات البيضاء الفموية (Leukoplakia)؟',
        text_en: 'What is the clinical definition of oral leukoplakia according to WHO?',
        answer_ar: 'بقعة أو صفيحة بيضاء على الغشاء المخاطي الفموي لا يمكن مسحها ولا يمكن تشخيصها سريرياً أو نسيجياً كأي مرض آخر محدد، وتعتبر آفة محتملة الخباثة (Potentially malignant).',
        answer_en: 'A white plaque of questionable risk having excluded (other) known diseases or disorders that carry no increased risk for cancer. It is considered a potentially malignant oral lesion.',
        tags: ['أورام', 'أمراض الفم']
      },
      {
        id: 'bq-5',
        subject_id: 'gen-med',
        subject_name_ar: 'الطب العام',
        subject_name_en: 'General Medicine',
        text_ar: 'ما هي الاحتياطات الواجب اتخاذها لمريض خضع لتركيب صمام قلب صناعي قبل إجراء تنظيف اللثة الجراحي أو القلع؟',
        text_en: 'What antibiotic prophylaxis protocol is recommended for a patient with a prosthetic heart valve prior to invasive dental procedures?',
        answer_ar: 'إعطاء مضاد حيوي وقائي (Amoxicillin 2g فموياً قبل الإجراء بساعة)، أو Clindamycin 600mg في حال وجود حساسية من البنسلين، للوقاية من التهاب الشغاف الجرثومي المعدي (Infective Endocarditis).',
        answer_en: 'Administer antibiotic prophylaxis: Amoxicillin 2g orally 30-60 minutes prior to procedure (or Clindamycin 600mg / Azithromycin 500mg if penicillin-allergic) to prevent infective endocarditis.',
        tags: ['باطنة', 'وقاية']
      },
      {
        id: 'bq-6',
        subject_id: 'gen-surgery',
        subject_name_ar: 'الجراحة العامة',
        subject_name_en: 'General Surgery',
        text_ar: 'ما هي مراحل التئام الجروح الجراحية (Wound Healing Phases)؟',
        text_en: 'What are the sequential stages of surgical wound healing?',
        answer_ar: '1. مرحلة الإرقاء والالتهاب (Hemostasis & Inflammatory phase: أيام 1-4). 2. مرحلة التكاثر وتكوين النسيج الحبيبي (Proliferative phase: أيام 4-21). 3. مرحلة النضج وإعادة التشكيل (Remodeling/Maturation: من 21 يوماً وحتى عامين).',
        answer_en: '1. Hemostasis & Inflammatory phase (Days 1-4). 2. Proliferation phase (Fibroplasia, granulation tissue, angiogenesis, re-epithelialization: Days 4-21). 3. Maturation/Remodeling phase (Collagen crosslinking: 3 weeks to 2 years).',
        tags: ['جراحة', 'التئام']
      },
      {
        id: 'bq-7',
        subject_id: 'omdr',
        subject_name_ar: 'تشخيص وأشعة الفم',
        subject_name_en: 'OMDR',
        text_ar: 'ما هي العلامات الشعاعية المميزة لكيس شق القناة القاطعة (Nasopalatine Duct Cyst)؟',
        text_en: 'What is the characteristic radiographic appearance of a Nasopalatine Duct Cyst?',
        answer_ar: 'شفافية شعاعية محددة بوضوح بيضوية أو على شكل قلب (Heart-shaped radiolucency) تتوضع بين جذري الثنايا العلوية ناتجة عن تراكب الشوكة الأنفية الأمامية.',
        answer_en: 'Well-circumscribed, round, ovoid or classic heart-shaped radiolucency located in the midline of the anterior maxilla between the divergent roots of maxillary central incisors.',
        tags: ['أشعة', 'تشخيص']
      },
      {
        id: 'bq-8',
        subject_id: 'preventive',
        subject_name_ar: 'طب الأسنان الوقائي',
        subject_name_en: 'Preventive Dentistry',
        text_ar: 'كيف يحول الفلورايد بلورات هيدروكسي أباتيت إلى فلوروأباتيت وأثر ذلك على مقاومة النخر؟',
        text_en: 'How does fluoride incorporate into enamel and increase acid resistance?',
        answer_ar: 'يستبدل الفلورايد شوارد الهيدروكسيل (OH-) ليشكل الفلوروأباتيت الأكثر ثباتاً وتراصاً، مما يخفض نقطة الذوبان الحرجة (Critical pH) من 5.5 إلى 4.5.',
        answer_en: 'Fluoride ions substitute hydroxyl groups in hydroxyapatite to form fluorapatite, which is less soluble and lowers the critical pH of demineralization from 5.5 down to 4.5.',
        tags: ['فلورايد', 'وقاية']
      },
      {
        id: 'bq-9',
        subject_id: 'cons-endo',
        subject_name_ar: 'العلاج التحفظي 2',
        subject_name_en: 'Cons & Endo II',
        text_ar: 'ما هو الـ C-Factor وما أثره على توتر انكماش التصلب (Polymerization Shrinkage) في حشوات الكومبوزيت؟',
        text_en: 'What is the Cavity Configuration Factor (C-Factor) and its clinical significance?',
        answer_ar: 'نسبة الأسطح الملتصقة إلى الأسطح الحرة غير الملتصقة (Bonded to unbonded surfaces). كلما ارتفعت النسبة (كما في صنف أول C=5) زاد إجهاد الانكماش وخطر انفصال الحواف وتكون الفجوات.',
        answer_en: 'The ratio of bonded to unbonded (free) restoration surfaces. A higher C-factor (e.g., Class I = 5) increases polymerization contraction stress, predisposing to marginal gap formation and sensitivity.',
        tags: ['كومبوزيت', 'تحفظي']
      },
      {
        id: 'bq-10',
        subject_id: 'ortho',
        subject_name_ar: 'تقويم الأسنان 1',
        subject_name_en: 'Orthodontics I',
        text_ar: 'ما هي علاقة الرحى الأولى في الصنف الثاني لـ Angle (Angle Class II)؟',
        text_en: 'Describe the molar relationship in Angle Class II malocclusion.',
        answer_ar: 'تتوضع الحدبة الأنسية الدهليزية للرحى الأولى العلوية أمام (Mesial to) الميزاب الأنسي الدهليزي للرحى الأولى السفلية.',
        answer_en: 'The mesiobuccal cusp of the maxillary first molar occludes anterior (mesial) to the mesiobuccal groove of the mandibular first molar.',
        tags: ['تقويم', 'إنجل']
      },
      {
        id: 'bq-11',
        subject_id: 'pediatric',
        subject_name_ar: 'طب أسنان الأطفال 1',
        subject_name_en: 'Pediatric Dentistry I',
        text_ar: 'ما هي استطبابات بتر اللب الحيوي (Vital Pulpotomy) في الأسنان اللبنية المؤقتة؟',
        text_en: 'What are the clinical indications for vital pulpotomy in primary teeth?',
        answer_ar: 'انكشاف اللب ناتج عن نخر عميق دون وجود ألم عفوي ليلي مستمر، مع نزف بلون أحمر قاني يمكن ضبطه خلال دقائق، ودون وجود ارتشاح شعاعي ذروي أو حركة غير فسيولوجية.',
        answer_en: 'Deep caries exposing coronal pulp without history of spontaneous nocturnal pain, healthy bright red bleeding controllable within 3-5 minutes, and absence of apical radiolucency or internal resorption.',
        tags: ['أطفال', 'لب']
      },
      {
        id: 'bq-12',
        subject_id: 'removable-pros',
        subject_name_ar: 'الاستعاضة المتحركة 2',
        subject_name_en: 'Removable Pros II',
        text_ar: 'ما هو دور المحدد الإطباقي (Occlusal Rest) في الطقم الجزئي المتحرك؟',
        text_en: 'What is the primary function of an occlusal rest in removable partial dentures?',
        answer_ar: 'نقل قوى المضغ الإطباقية عبر المحور الطولي للسن الساند (Support)، ومنع انغراس الطقم في الأنسجة الرخوة والحفاظ على موقع المشابك المثبتة.',
        answer_en: 'Transfers vertical masticatory occlusal loads along the long axis of the abutment tooth (vertical support), prevents gingival displacement of the framework, and maintains clasp positioning.',
        tags: ['متحركة', 'مشابك']
      }
    ];

    const renderList = () => {
      const filtered = filterSubject === 'all'
        ? questions
        : questions.filter(q => q.subject_id === filterSubject);

      const listEl = document.getElementById('questions-list');
      if (!listEl) return;

      if (filtered.length === 0) {
        listEl.innerHTML = `
          <div class="card" style="padding: 40px; text-align: center; color: var(--text-muted);">
            <i data-lucide="help-circle" style="width: 36px; height: 36px; margin-bottom: 10px; opacity: 0.5;"></i>
            <p>${isAr ? 'لا توجد أسئلة حالياً لهذه المادة.' : 'No questions found for this subject.'}</p>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      listEl.innerHTML = filtered.map(q => `
        <div class="card" style="padding: 20px; margin-bottom: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span class="badge badge-primary">${isAr ? q.subject_name_ar : q.subject_name_en}</span>
            <div style="display: flex; gap: 4px;">
              ${q.tags.map(t => `<span class="badge badge-gray">#${t}</span>`).join('')}
            </div>
          </div>
          <h3 style="font-size: 1rem; color: var(--text-primary); margin-bottom: 12px; line-height: 1.5;">${isAr ? q.text_ar : q.text_en}</h3>
          
          <div style="border-top: 1px solid var(--border-subtle); padding-top: 12px; margin-top: 12px;">
            <button class="btn btn-soft toggle-answer-btn" data-id="${q.id}" style="font-size: 0.775rem; padding: 5px 12px; display: inline-flex; align-items: center; gap: 6px;">
              <i data-lucide="eye" style="width: 14px; height: 14px;"></i>
              ${isAr ? 'إظهار الإجابة النموذجية' : 'Show Model Answer'}
            </button>
            <div id="ans-${q.id}" style="display: none; margin-top: 12px; padding: 14px 16px; border-radius: var(--radius-sm); background: rgba(139, 21, 56, 0.04); border-left: 3px solid var(--brand-primary); font-size: 0.875rem; color: var(--text-primary); line-height: 1.6;">
              <strong style="color: var(--brand-primary);">${isAr ? 'الإجابة النموذجية: ' : 'Model Answer: '}</strong>
              ${isAr ? q.answer_ar : q.answer_en}
            </div>
          </div>
        </div>
      `).join('');

      if (window.lucide) window.lucide.createIcons();

      container.querySelectorAll('.toggle-answer-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const ansEl = document.getElementById(`ans-${id}`);
          if (ansEl) {
            const isHidden = ansEl.style.display === 'none';
            ansEl.style.display = isHidden ? 'block' : 'none';
            btn.innerHTML = isHidden 
              ? `<i data-lucide="eye-off" style="width: 14px; height: 14px;"></i> ${isAr ? 'إخفاء الإجابة' : 'Hide Answer'}`
              : `<i data-lucide="eye" style="width: 14px; height: 14px;"></i> ${isAr ? 'إظهار الإجابة النموذجية' : 'Show Model Answer'}`;
            if (window.lucide) window.lucide.createIcons();
          }
        });
      });
    };

    container.innerHTML = `
      <div class="page-title-bar">
        <div class="page-title-group">
          <h1>
            <i data-lucide="help-circle" style="color: var(--brand-primary); width: 26px; height: 26px;"></i>
            ${isAr ? 'بنك الأسئلة التفاعلي' : 'Interactive Question Bank'}
          </h1>
          <p>${isAr ? 'أسئلة امتحانية مقالية واختيارية مع شروحاتها وحلولها النموذجية المعتمدة' : 'High-yield essay & MCQ question bank with verified faculty answers'}</p>
        </div>
      </div>

      <!-- Filters -->
      <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 16px; scrollbar-width: thin;">
        <button class="btn ${filterSubject === 'all' ? 'btn-primary' : 'btn-secondary'} q-filter" data-id="all" style="font-size: 0.8rem; padding: 6px 14px; white-space: nowrap;">
          ${isAr ? 'جميع المواد (12)' : 'All Subjects (12)'}
        </button>
        ${subjects.map(s => `
          <button class="btn ${filterSubject === s.id ? 'btn-primary' : 'btn-secondary'} q-filter" data-id="${s.id}" style="font-size: 0.8rem; padding: 6px 14px; white-space: nowrap;">
            ${isAr ? s.name_ar : s.name_en}
          </button>
        `).join('')}
      </div>

      <div id="questions-list"></div>
    `;

    renderList();

    container.querySelectorAll('.q-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        filterSubject = btn.getAttribute('data-id');
        container.querySelectorAll('.q-filter').forEach(b => {
          b.className = b.getAttribute('data-id') === filterSubject ? 'btn btn-primary q-filter' : 'btn btn-secondary q-filter';
        });
        renderList();
      });
    });
  }
};

window.QuestionsPage = QuestionsPage;
