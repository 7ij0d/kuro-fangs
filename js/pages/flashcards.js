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

    const allCards = window.DATA?.flashcards || [];

    let currentIndex = 0;

    const getFilteredCards = () => {
      if (currentFilter === 'all') return allCards;
      return allCards.filter(c => c.subject_id === currentFilter);
    };

    const renderCard = () => {
      const activeCards = getFilteredCards();
      const stageContainer = document.getElementById('flashcard-stage-container');
      if (!stageContainer) return;

      if (activeCards.length === 0) {
        stageContainer.innerHTML = window.renderEmptyState
          ? window.renderEmptyState()
          : `
            <div class="empty-state-card">
              <div class="empty-state-icon-wrap">
                <i data-lucide="folder-open"></i>
              </div>
              <h3 class="empty-state-title">${isAr ? 'لا توجد محتويات مضافة حالياً' : 'No contents available yet'}</h3>
              <p class="empty-state-subtitle">${isAr ? 'جاري رفع واستكمال الملازم والمحتوى الأكاديمي قريباً' : 'Handouts and academic curriculum materials will be uploaded soon.'}</p>
            </div>
          `;
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      if (currentIndex >= activeCards.length) currentIndex = 0;
      const card = activeCards[currentIndex];

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
