/**
 * KURO FANGS — FLASHCARDS PAGE
 * 3D Flip Flashcards for Rapid Dental Memorization
 */

const FlashcardsPage = {
  render(container) {
    const cards = [
      {
        term: 'Trigeminal Neuralgia (عصب ثلاثي التوائم)',
        subject: 'جراحة الفم والفكين',
        definition: 'ألم حاد مفاجئ وشديد يشبه الصعقة الكهربائية يتبع مسار أحد فروع العصب الخامس (غالباً V2 أو V3)، ويستثار بنقاط زناد (Trigger zones) عند اللمس أو الحلاقة أو تنظيف الأسنان.'
      },
      {
        term: 'Ferrule Effect (تأثير الطوق المعدني)',
        subject: 'التركيبات الثابتة وعلاج العصب',
        definition: 'حلقة عاجية سليمة محيطية بارتفاع لا يقل عن 1.5 - 2 ملم وسماكة 1 ملم على الأقل فوق خط الإنهاء، وهي ضرورية جداً لمقاومة قوى الكسر وتثبيت التاج على السن المعالج لبياً.'
      },
      {
        term: 'Dentigerous Cyst (الكيس التاجي)',
        subject: 'علم أمراض الفم',
        definition: 'كيس سني المنشأ يتشكل حول تاج سن غير بازغ (غالباً الرحى الثالثة السفلية أو الناب العلوي)، ويلتصق عند الوصل المينائي الملاطي (Cementoenamel Junction).'
      },
      {
        term: 'Smear Layer (طبقة اللطاخة)',
        subject: 'علاج العصب والتحفظي',
        definition: 'طبقة غير متبلورة من البقايا العضوية وغير العضوية والبكتيريا تنتج أثناء حفر السن أو تحضير القناة، وتزال في علاج الجذور بواسطة محلول EDTA 17% لفتح النبيبات العاجية.'
      }
    ];

    let currentIndex = 0;

    const renderCard = () => {
      const card = cards[currentIndex];

      container.innerHTML = `
        <div class="page-title-bar">
          <div class="page-title-group">
            <h1>
              <i data-lucide="layers" style="color: var(--brand-primary); width: 26px; height: 26px;"></i>
              البطاقات التعليمية (Flashcards)
            </h1>
            <p>مراجعة سريعة وفعالة لأهم المفاهيم الطبية والسريرية مع تقنية البطاقات التفاعلية</p>
          </div>
          <div>
            <span class="badge badge-primary">بطاقة ${currentIndex + 1} من ${cards.length}</span>
          </div>
        </div>

        <div style="max-width: 600px; margin: 20px auto;">
          <!-- 3D Card Container -->
          <div class="flashcard-stage" id="flashcard-box">
            <div class="flashcard-inner">
              <div class="flashcard-front">
                <span class="badge badge-primary" style="position: absolute; top: 20px; right: 20px;">${card.subject}</span>
                <span style="font-size: 0.8rem; color: var(--text-muted); position: absolute; top: 22px; left: 20px;">انقر للقلب 🔄</span>
                
                <div style="font-size: 1.4rem; font-weight: 700; color: var(--text-primary); text-align: center; padding: 0 20px;">
                  ${card.term}
                </div>
                <div style="margin-top: 18px; font-size: 0.825rem; color: var(--text-secondary);">
                  ما هو التعريف والمفهوم السريري؟
                </div>
              </div>

              <div class="flashcard-back">
                <span class="badge badge-warning" style="position: absolute; top: 20px; right: 20px;">الشرح الطبي</span>
                <div style="font-size: 1.05rem; line-height: 1.6; color: var(--text-primary); text-align: justify; padding: 0 16px;">
                  ${card.definition}
                </div>
              </div>
            </div>
          </div>

          <!-- Controls -->
          <div style="display: flex; justify-content: center; gap: 14px; margin-top: 24px;">
            <button id="btn-prev-card" class="btn btn-secondary" ${currentIndex === 0 ? 'disabled style="opacity: 0.5;"' : ''}>
              <i data-lucide="chevron-right" style="width: 18px; height: 18px;"></i>
              السابق
            </button>
            <button id="btn-flip-card" class="btn btn-soft">
              <i data-lucide="rotate-cw" style="width: 16px; height: 16px;"></i>
              قلب البطاقة
            </button>
            <button id="btn-next-card" class="btn btn-primary" ${currentIndex === cards.length - 1 ? 'disabled style="opacity: 0.5;"' : ''}>
              التالي
              <i data-lucide="chevron-left" style="width: 18px; height: 18px;"></i>
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
          if (currentIndex < cards.length - 1) {
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

    renderCard();
  }
};

window.FlashcardsPage = FlashcardsPage;
