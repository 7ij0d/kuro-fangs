/**
 * KURO FANGS — FLASHCARDS PAGE
 * 3D Flip Flashcards for Rapid Dental Memorization with Subject Filter & Bilingual Support
 */

const FlashcardsPage = {
  render(container, queryParams) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
    const subjects = window.DATA ? window.DATA.getSubjects() : [];
    const targetSubject = queryParams?.get('subject') || 'all';
    let currentFilter = targetSubject;

    const allCards = [
      {
        subject_id: 'omfs',
        term_ar: 'Trigeminal Neuralgia (ألم عصب ثلاثي التوائم)',
        term_en: 'Trigeminal Neuralgia (Tic Douloureux)',
        subject_ar: 'جراحة الفم والفكين',
        subject_en: 'Oral Surgery',
        definition_ar: 'ألم حاد مفاجئ وشديد يشبه الصعقة الكهربائية يتبع مسار أحد فروع العصب الخامس (غالباً V2 أو V3)، ويستثار بنقاط زناد (Trigger zones) عند اللمس أو الحلاقة أو تنظيف الأسنان.',
        definition_en: 'Sudden, severe, lancinating electric-shock-like pain along distributions of CN V (most commonly V2 or V3), triggered by minimal cutaneous touch, shaving, chewing, or toothbrushing.'
      },
      {
        subject_id: 'fixed-pros',
        term_ar: 'Ferrule Effect (تأثير الطوق العاجي السليم)',
        term_en: 'Ferrule Effect in Prosthodontics',
        subject_ar: 'التركيبات الثابتة',
        subject_en: 'Fixed Pros',
        definition_ar: 'طوق عاجي محيطي سليم بارتفاع لا يقل عن 1.5 - 2 ملم وسماكة 1 ملم على الأقل فوق خط الإنهاء، وهو جوهري لمقاومة قوى العزم والانكسار وتثبيت التاج على السن المعالج لبياً.',
        definition_en: 'A 360-degree circumferential band of sound dentin with a minimum height of 1.5-2.0mm and thickness of 1.0mm above the preparation finish line, crucial for fracture resistance in endodontically treated teeth.'
      },
      {
        subject_id: 'oral-diseases',
        term_ar: 'Dentigerous Cyst (الكيس التاجي الجريبي)',
        term_en: 'Dentigerous (Follicular) Cyst',
        subject_ar: 'علم أمراض الفم',
        subject_en: 'Oral Pathology',
        definition_ar: 'كيس سني تطوري ينشأ حول تاج سن كامل التكون لكنه غير بازغ، ويلتصق تحديداً عند الملتقى المينائي الملاطي (CEJ) للسن، وأكثره حدوثاً حول أرحاء العقل السفلية.',
        definition_en: 'An odontogenic developmental cyst that encloses the crown of an unerupted tooth, attached strictly at the cementoenamel junction (CEJ), most commonly involving mandibular third molars.'
      },
      {
        subject_id: 'endo',
        term_ar: 'Smear Layer (طبقة اللطاخة السنية)',
        term_en: 'Smear Layer in Endodontics',
        subject_ar: 'علاج العصب',
        subject_en: 'Endodontics',
        definition_ar: 'طبقة غير متبلورة من الحطام العضوي وغير العضوي والبكتيريا تتولد أثناء البرد الآلي للقناة، وتزال بفعالية بواسطة إرواء بمحلول EDTA 17% لفتح النبيبات العاجية قبل الحشو.',
        definition_en: 'An amorphous layer composed of dentin debris, necrotic pulp tissue, and bacteria formed during biomechanical canal instrumentation, routinely dissolved using 17% EDTA irrigation.'
      },
      {
        subject_id: 'gen-med',
        term_ar: 'Infective Endocarditis Prophylaxis (وقاية الشغاف)',
        term_en: 'Infective Endocarditis Prophylaxis',
        subject_ar: 'الطب العام',
        subject_en: 'General Medicine',
        definition_ar: 'بروتوكول وقائي يعطى لمرضى الصمامات الصناعية أو العيوب القلبية الزرقاء قبل علاجات اللثة الغازية: Amoxicillin 2g فموياً قبل الإجراء بساعة، أو Clindamycin 600mg في حال الحساسية.',
        definition_en: 'Antibiotic regimen for high-risk cardiac patients (prosthetic valves, unrepaired cyanotic congenital heart disease) prior to invasive dental procedures: 2g Amoxicillin 1hr pre-op.'
      },
      {
        subject_id: 'gen-surgery',
        term_ar: 'Surgical Shock (الصدمة الجراحية ونقص الحجم)',
        term_en: 'Hypovolemic Shock in Surgery',
        subject_ar: 'الجراحة العامة',
        subject_en: 'General Surgery',
        definition_ar: 'حالة هبوط حاد في التروية النسيجية وضغط الدم نتيجة فقدان حاد للسوائل أو الدم (>20% من حجم الدورة)، تتظاهر بتسرع النبض وشحوب وبرودة الأطراف وتتطلب تدبيراً إسعافياً فورياً.',
        definition_en: 'Critical tissue hypoperfusion resulting from intravascular volume loss (>20%), manifesting with tachycardia, hypotension, cold clammy extremities, requiring immediate aggressive fluid resuscitation.'
      },
      {
        subject_id: 'omdr',
        term_ar: 'Inverted Y Landmark in Dental Radiography',
        term_en: 'Inverted Y of Ennis (OMDR Landmark)',
        subject_ar: 'تشخيص وأشعة الفم',
        subject_en: 'OMDR',
        definition_ar: 'معلم شعاعي تشريحي يمثل تقاطع الجدار السفلي للجيب الفكي الأنفي (Maxillary Sinus) مع الجدار الوحشي للتجويف الأنفي (Nasal Fossa)، ويظهر في أشعة ذروية منطقة الضواحك العلوية.',
        definition_en: 'Radiographic anatomical landmark formed by the intersection of the cortical border of the nasal fossa and the anteroinferior wall of the maxillary sinus, seen in canine-premolar periapicals.'
      },
      {
        subject_id: 'preventive',
        term_ar: 'Critical pH for Enamel Demineralization',
        term_en: 'Critical pH in Enamel Demineralization',
        subject_ar: 'طب الأسنان الوقائي',
        subject_en: 'Preventive Dentistry',
        definition_ar: 'درجة الحموضة التي يبدأ عندها انحلال بلورات المينا وفقدان المعادن، وتساوي 5.5 للمينا النقية، بينما تنخفض إلى 4.5 في وجود الفلوروأباتيت الناتج عن تطبيق الفلورايد.',
        definition_en: 'The pH threshold below which enamel hydroxyapatite crystals undergo demineralization (~5.5 for pure enamel, but lowered to ~4.5 for fluorapatite treated enamel).'
      },
      {
        subject_id: 'cons-endo',
        term_ar: 'Hybrid Layer in Adhesive Dentistry',
        term_en: 'Hybrid Layer (Dentinal Adhesion)',
        subject_ar: 'العلاج التحفظي',
        subject_en: 'Cons & Endo',
        definition_ar: 'طبقة تشابك مجهري تتشكل من تخلل مونومرات الراتنج اللاصق بين ألياف الكولاجين العاجية المكشوفة بعد التخريش الحمضي، وهي أساس قوة الترابط الإطباقي للكومبوزيت.',
        definition_en: 'Zone of micromechanical interdiffusion created by penetration of adhesive resin monomers into the demineralized collagen fibril network of etched dentin.'
      },
      {
        subject_id: 'ortho',
        term_ar: 'Leeway Space of Nance (فراغ ليواي السريري)',
        term_en: 'Leeway Space of Nance',
        subject_ar: 'تقويم الأسنان',
        subject_en: 'Orthodontics',
        definition_ar: 'فرق الحجم بين مجموع العرض الأنسي الوحشي للأنياب والأرحاء اللبنية مقارنة بالأسنان الدائمة الخلفية البديلة، ويبلغ قرابة 1.8 ملم في الفك العلوي و3.4 ملم في الفك السفلي.',
        definition_en: 'The mesiodistal size differential between primary canines and molars and their succedaneous permanent replacements (~0.9mm per side in maxilla, ~1.7mm per side in mandible).'
      },
      {
        subject_id: 'pediatric',
        term_ar: 'Formocresol vs MTA in Pulpotomy',
        term_en: 'MTA vs Formocresol Pulpotomy',
        subject_ar: 'طب أسنان الأطفال',
        subject_en: 'Pediatric Dentistry',
        definition_ar: 'تحول المعيار الذهبي في بتر اللب الحيوي للأطفال من الفورموكريزول التقليدي إلى MTA والـ Biodentine لخواصها الحيوية الممتازة وعدم سميتها وتحفيز تشكيل جسور عاجية واقية.',
        definition_en: 'Mineral Trioxide Aggregate (MTA) and bioceramics are modern biocompatible gold standards over historical formocresol, stimulating dentin bridge formation with superior success rates.'
      },
      {
        subject_id: 'removable-pros',
        term_ar: 'Survey Line & Height of Contour in RPD',
        term_en: 'Survey Line (Height of Contour) in RPD',
        subject_ar: 'الاستعاضة المتحركة',
        subject_en: 'Removable Pros',
        definition_ar: 'الخط الذي يحدده مقياس التوازي (Dental Surveyor) على السن الساند، ويمثل أعظم محيط بارز للسن، ويوضع طرف الذراع المثبت للمشبك أسفل هذا الخط في منطقة الغؤور (Undercut).',
        definition_en: 'Line traced on an abutment tooth by a surveyor marking its maximum cross-sectional circumference (height of contour), dividing suprabulge and infrabulge retention undercut zones.'
      }
    ];

    let currentIndex = 0;

    const getFilteredCards = () => {
      if (currentFilter === 'all') return allCards;
      const matched = allCards.filter(c => c.subject_id === currentFilter);
      return matched.length > 0 ? matched : allCards;
    };

    const renderCard = () => {
      const activeCards = getFilteredCards();
      if (currentIndex >= activeCards.length) currentIndex = 0;
      const card = activeCards[currentIndex];

      const stageContainer = document.getElementById('flashcard-stage-container');
      if (!stageContainer) return;

      stageContainer.innerHTML = `
        <div style="max-width: 620px; margin: 10px auto;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span class="badge badge-primary">${isAr ? card.subject_ar : card.subject_en}</span>
            <span style="font-size: 0.825rem; font-weight: 600; color: var(--text-muted);">
              ${isAr ? `بطاقة ${currentIndex + 1} من ${activeCards.length}` : `Card ${currentIndex + 1} of ${activeCards.length}`}
            </span>
          </div>

          <!-- 3D Card Container -->
          <div class="flashcard-stage" id="flashcard-box" style="cursor: pointer; min-height: 240px;">
            <div class="flashcard-inner">
              <div class="flashcard-front" style="padding: 28px 24px; display: flex; flex-direction: column; justify-content: space-between;">
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                  <span class="badge badge-soft" style="font-size: 0.75rem;">🦷 ${isAr ? 'المصطلح السريري' : 'Clinical Concept'}</span>
                  <span style="font-size: 0.775rem; color: var(--text-muted); display: inline-flex; align-items: center; gap: 4px;">
                    <i data-lucide="rotate-cw" style="width: 13px; height: 13px;"></i>
                    ${isAr ? 'انقر للقلب' : 'Click to flip'}
                  </span>
                </div>
                
                <div style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); text-align: center; margin: 24px 0; line-height: 1.5;">
                  ${isAr ? card.term_ar : card.term_en}
                </div>

                <div style="text-align: center; font-size: 0.825rem; color: var(--text-muted);">
                  ${isAr ? 'ما هو التعريف والأهمية السريرية؟' : 'What is the definition & clinical relevance?'}
                </div>
              </div>

              <div class="flashcard-back" style="padding: 24px 22px; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <span class="badge badge-warning" style="font-size: 0.75rem;">${isAr ? 'الشرح الطبي المعتمد' : 'High-Yield Explanation'}</span>
                    <span style="font-size: 0.75rem; color: var(--brand-primary); font-weight: 600;">+2 ${isAr ? 'نقاط' : 'pts'}</span>
                  </div>
                  <div style="font-size: 0.95rem; line-height: 1.65; color: var(--text-primary); text-align: justify;">
                    ${isAr ? card.definition_ar : card.definition_en}
                  </div>
                </div>
                <div style="text-align: center; font-size: 0.75rem; color: var(--text-muted); margin-top: 10px;">
                  ${isAr ? 'انقر للعودة إلى وجه البطاقة' : 'Click to return to front'}
                </div>
              </div>
            </div>
          </div>

          <!-- Controls -->
          <div style="display: flex; justify-content: center; gap: 14px; margin-top: 22px;">
            <button id="btn-prev-card" class="btn btn-secondary" ${currentIndex === 0 ? 'disabled style="opacity: 0.5;"' : ''}>
              <i data-lucide="${isAr ? 'chevron-right' : 'chevron-left'}" style="width: 18px; height: 18px;"></i>
              ${isAr ? 'السابق' : 'Previous'}
            </button>
            <button id="btn-flip-card" class="btn btn-soft">
              <i data-lucide="rotate-cw" style="width: 16px; height: 16px;"></i>
              ${isAr ? 'قلب البطاقة' : 'Flip Card'}
            </button>
            <button id="btn-next-card" class="btn btn-primary" ${currentIndex === activeCards.length - 1 ? 'disabled style="opacity: 0.5;"' : ''}>
              ${isAr ? 'التالي' : 'Next'}
              <i data-lucide="${isAr ? 'chevron-left' : 'chevron-right'}" style="width: 18px; height: 18px;"></i>
            </button>
          </div>
        </div>
      `;

      if (window.lucide) window.lucide.createIcons();

      const stage = document.getElementById('flashcard-box');
      if (stage) {
        stage.addEventListener('click', () => {
          stage.classList.toggle('flipped');
        });
      }

      const flipBtn = document.getElementById('btn-flip-card');
      if (flipBtn && stage) {
        flipBtn.addEventListener('click', () => {
          stage.classList.toggle('flipped');
        });
      }

      const nextBtn = document.getElementById('btn-next-card');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (currentIndex < activeCards.length - 1) {
            currentIndex++;
            window.STORE.addPoints(2);
            renderCard();
          }
        });
      }

      const prevBtn = document.getElementById('btn-prev-card');
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          if (currentIndex > 0) {
            currentIndex--;
            renderCard();
          }
        });
      }
    };

    container.innerHTML = `
      <div class="page-title-bar">
        <div class="page-title-group">
          <h1>
            <i data-lucide="layers" style="color: var(--brand-primary); width: 26px; height: 26px;"></i>
            ${isAr ? 'البطاقات التعليمية (Flashcards)' : 'Interactive Flashcard Decks'}
          </h1>
          <p>${isAr ? 'مراجعة سريعة وفعالة لأهم المفاهيم الطبية والسريرية مع تقنية البطاقات التفاعلية ثلاثية الأبعاد' : '3D flip cards for spaced repetition and rapid dental retention'}</p>
        </div>
      </div>

      <!-- Filters -->
      <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 16px; scrollbar-width: thin;">
        <button class="btn ${currentFilter === 'all' ? 'btn-primary' : 'btn-secondary'} fc-filter" data-id="all" style="font-size: 0.8rem; padding: 6px 14px; white-space: nowrap;">
          ${isAr ? 'جميع المواد (12)' : 'All Subjects (12)'}
        </button>
        ${subjects.map(s => `
          <button class="btn ${currentFilter === s.id ? 'btn-primary' : 'btn-secondary'} fc-filter" data-id="${s.id}" style="font-size: 0.8rem; padding: 6px 14px; white-space: nowrap;">
            ${isAr ? s.name_ar : s.name_en}
          </button>
        `).join('')}
      </div>

      <div id="flashcard-stage-container"></div>
    `;

    renderCard();

    container.querySelectorAll('.fc-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        currentFilter = btn.getAttribute('data-id');
        currentIndex = 0;
        container.querySelectorAll('.fc-filter').forEach(b => {
          b.className = b.getAttribute('data-id') === currentFilter ? 'btn btn-primary fc-filter' : 'btn btn-secondary fc-filter';
        });
        renderCard();
      });
    });
  }
};

window.FlashcardsPage = FlashcardsPage;
