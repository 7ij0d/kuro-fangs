/**
 * KURO FANGS — EXAMS & INTERACTIVE QUIZZES PAGE (ACADEMIA CLINICAL CRAFT)
 * High-Yield Dentistry Simulation Engine with Linear Elevation & Micro-Interactions
 */

const QuizzesPage = {
  render(container) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
    
    // Safely retrieve questions from DATA or fallback
    let questions = [];
    if (window.DATA && Array.isArray(window.DATA.questions) && window.DATA.questions.length > 0) {
      questions = window.DATA.questions;
    } else if (window.DATA && typeof window.DATA.getDefaultQuestions === 'function') {
      questions = window.DATA.getDefaultQuestions();
      window.DATA.questions = questions;
    }

    if (!questions || questions.length === 0) {
      container.innerHTML = `
        <div class="page-title-bar">
          <div class="page-title-group">
            <h1>
              <i data-lucide="file-check-2" style="color: var(--brand-accent); width: 26px; height: 26px;"></i>
              ${isAr ? 'الامتحانات والكويزات التفاعلية' : 'Exams & Clinical Quizzes'}
            </h1>
            <p>${isAr ? 'اختبر معلوماتك في مقررات طب الأسنان وتدرب على أسئلة الامتحانات النصفية والنهائية' : 'Test your clinical knowledge across dental subjects with verified model answers'}</p>
          </div>
        </div>
        ${window.renderEmptyState ? window.renderEmptyState() : '<div class="kf-panel" style="padding: 40px; text-align: center;">No quizzes available</div>'}
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    let userAnswers = {};
    let submitted = false;

    const renderQuiz = () => {
      const optLetters = ['A', 'B', 'C', 'D'];
      const totalCount = questions.length;
      const answeredCount = Object.keys(userAnswers).length;
      const answeredPercent = Math.round((answeredCount / totalCount) * 100);

      container.innerHTML = `
        <div class="kf-panel" style="margin-bottom: 24px; padding: 22px 26px; border-radius: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                <span class="kf-segmented-badge" style="background: rgba(2, 132, 199, 0.08); color: var(--brand-accent); border-color: rgba(2, 132, 199, 0.25); font-weight: 800;">
                  <i data-lucide="activity" style="width: 13px; height: 13px;"></i>
                  ${isAr ? 'محاكاة سريرية تفاعلية' : 'Clinical Simulation Engine'}
                </span>
                <span class="kf-segmented-badge">${totalCount} ${isAr ? 'أسئلة معتمدة' : 'Questions'}</span>
              </div>
              <h1 style="font-size: 1.4rem; font-weight: 850; color: var(--text-primary); margin: 0 0 6px;">
                ${isAr ? 'الامتحانات والكويزات التفاعلية' : 'Dentistry Clinical Quizzes'}
              </h1>
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0; line-height: 1.5;">
                ${isAr ? 'اختبر معلوماتك في مقررات طب الأسنان وتدرب على أسئلة الامتحانات النصفية والنهائية بتعليلات سريرية.' : 'Evaluate your diagnostic competence across Year 3 dental modules with immediate faculty feedback.'}
              </p>
            </div>

            <div style="min-width: 180px; text-align: ${isAr ? 'left' : 'right'};">
              <div style="font-size: 0.775rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 4px;">
                ${isAr ? `تمت الإجابة على ${answeredCount} من ${totalCount}` : `Progress: ${answeredCount} of ${totalCount}`}
              </div>
              <div style="width: 100%; height: 6px; border-radius: 99px; background: var(--bg-surface-subtle); overflow: hidden; border: 1px solid var(--border-subtle);">
                <div style="height: 100%; width: ${answeredPercent}%; background: var(--brand-accent); border-radius: 99px; transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);"></div>
              </div>
            </div>
          </div>
        </div>

        <div style="max-width: 860px; margin: 0 auto;">
          ${questions.map((q, idx) => {
            const questionText = isAr ? (q.text_ar || q.question) : (q.text_en || q.question || q.text_ar);
            const options = isAr ? (q.options_ar || q.options || q.options_en) : (q.options_en || q.options || q.options_ar);
            const correctIndex = typeof q.correct_index === 'number' ? q.correct_index : (typeof q.correct === 'number' ? q.correct : 0);
            const explanation = isAr ? (q.answer_ar || q.explanation) : (q.answer_en || q.explanation || q.answer_ar);
            const subjectName = isAr ? (q.subject_name_ar || q.subject || 'طب الأسنان') : (q.subject_name_en || q.subject || 'Dentistry');
            const isUserAnswered = userAnswers[idx] !== undefined;

            return `
              <div class="kf-panel q-card" style="margin-bottom: 20px;" id="q-block-${idx}">
                <div class="kf-panel-header" style="background: var(--bg-surface);">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="kf-segmented-badge" style="font-weight: 800; color: var(--brand-accent);">
                      #${idx + 1}
                    </span>
                    <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-primary);">${subjectName}</span>
                  </div>
                  <div>
                    ${q.code ? `<span class="kf-segmented-badge" style="font-size: 0.7rem;">${q.code}</span>` : ''}
                    <span class="kf-segmented-badge" style="background: rgba(2, 132, 199, 0.08); color: var(--brand-accent);">
                      10 pts
                    </span>
                  </div>
                </div>

                <div class="kf-panel-body">
                  <h3 style="font-size: 1.05rem; font-weight: 750; color: var(--text-primary); margin: 0 0 16px; line-height: 1.55;">
                    ${questionText}
                  </h3>

                  <div style="display: grid; gap: 8px; margin-bottom: 16px;">
                    ${(options || []).map((opt, optIdx) => {
                      const isSelected = userAnswers[idx] === optIdx;
                      let extraClass = '';
                      let statusIcon = '';

                      if (submitted) {
                        if (optIdx === correctIndex) {
                          extraClass = 'selected-correct';
                          statusIcon = '✓';
                        } else if (isSelected && optIdx !== correctIndex) {
                          extraClass = 'selected-wrong';
                          statusIcon = '✕';
                        } else {
                          extraClass = 'disabled';
                        }
                      } else if (isSelected) {
                        extraClass = 'selected-correct';
                      }

                      return `
                        <button type="button" class="q-opt-btn quiz-opt ${extraClass}" data-q="${idx}" data-opt="${optIdx}" ${submitted ? 'disabled' : ''}>
                          <span style="width: 26px; height: 26px; border-radius: 7px; display: inline-flex; align-items: center; justify-content: center; background: var(--bg-surface); border: 1px solid var(--border-subtle); font-size: 0.75rem; font-weight: 800; color: var(--text-secondary); font-family: monospace;">
                            ${optLetters[optIdx] || optIdx + 1}
                          </span>
                          <span style="flex: 1;">${opt}</span>
                          ${statusIcon ? `<span style="font-weight: 900; font-size: 1.05rem;">${statusIcon}</span>` : ''}
                        </button>
                      `;
                    }).join('')}
                  </div>

                  ${submitted ? `
                    <div style="margin-top: 14px; padding: 14px 18px; border-radius: 10px; background: var(--bg-surface-subtle); border-inline-start: 4px solid var(--brand-accent); font-size: 0.835rem; color: var(--text-secondary); line-height: 1.6;">
                      <div style="font-weight: 800; color: var(--text-primary); margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
                        <div style="font-size: 0.75rem; font-weight: 700; color: #16A34A; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
                          ${isAr ? 'التعليل السريري النموذجي:' : 'Verified Faculty Explanation:'}
                        </div>
                        ${explanation || (isAr ? 'لا يوجد تعليل متاح لهذا السؤال.' : 'No explanation provided.')}
                      </div>
                    </div>
                  ` : ''}
                </div>
              </div>
            `;
          }).join('')}

          <div class="kf-panel" style="padding: 24px; text-align: center; margin: 30px 0 60px; border-radius: 14px;">
            ${!submitted ? `
              <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
                <p style="font-size: 0.825rem; color: var(--text-secondary); margin: 0;">
                  ${isAr ? 'تأكد من مراجعة اختياراتك قبل التسليم لإضافة النقاط إلى ملفك الأكاديمي.' : 'Review your responses before submitting to claim your academic XP.'}
                </p>
                <button id="btn-submit-quiz" class="btn btn-primary" style="padding: 10px 32px; font-weight: 750; font-size: 0.925rem; display: inline-flex; align-items: center; gap: 8px;">
                  <i data-lucide="send" style="width: 16px; height: 16px;"></i>
                  <span>${isAr ? 'تسليم الإجابات وتقييم النتيجة' : 'Submit & Grade Exam'}</span>
                </button>
              </div>
            ` : `
              <div>
                ${(() => {
                  let score = 0;
                  questions.forEach((q, idx) => {
                    const correctIndex = typeof q.correct_index === 'number' ? q.correct_index : (typeof q.correct === 'number' ? q.correct : 0);
                    if (userAnswers[idx] === correctIndex) score++;
                  });
                  const percentage = Math.round((score / totalCount) * 100);
                  const isExcellent = percentage >= 85;
                  const isPass = percentage >= 60;

                  return `
                    <div style="width: 64px; height: 64px; margin: 0 auto 14px; border-radius: 18px; background: ${isPass ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; border: 1px solid ${isPass ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}; display: flex; align-items: center; justify-content: center; color: ${isPass ? '#10B981' : '#EF4444'}; font-size: 1.6rem;">
                      ${isPass ? '🏆' : '📚'}
                    </div>
                    <h2 style="font-size: 1.35rem; font-weight: 850; color: var(--text-primary); margin: 0 0 6px;">
                      ${isAr ? `الدرجة المستحقة: ${score} من ${totalCount} (${percentage}%)` : `Final Score: ${score} / ${totalCount} (${percentage}%)`}
                    </h2>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); max-width: 480px; margin: 0 auto 20px; line-height: 1.5;">
                      ${isExcellent 
                        ? (isAr ? 'أداء سريري ممتاز! تم استيعاب المفاهيم الجوهرية بنجاح وتمت إضافة النقاط لرصيدك.' : 'Outstanding clinical performance! Full points awarded to your profile.')
                        : (isPass 
                          ? (isAr ? 'نتيجة جيدة ومطمئنة. نوصي بمراجعة التعليلات السريرية للأسئلة الخاطئة لترسيخ المعلومة.' : 'Good passing performance. Review incorrect faculty explanations above.')
                          : (isAr ? 'فرصة ممتازة لمراجعة الملازم والشيتات المتعلقة بهذه الأسئلة وإعادة المحاولة.' : 'Keep studying. We recommend revisiting the lecture sheets and trying again.'))}
                    </p>
                    <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
                      <button id="btn-retry-quiz" class="btn btn-secondary" style="font-weight: 700; gap: 6px;">
                        <i data-lucide="rotate-ccw" style="width: 15px; height: 15px;"></i>
                        <span>${isAr ? 'إعادة المحاولة' : 'Retake Exam'}</span>
                      </button>
                      <a href="#/questions" class="btn btn-primary" style="font-weight: 700; gap: 6px;">
                        <i data-lucide="book-open" style="width: 15px; height: 15px;"></i>
                        <span>${isAr ? 'بنك الأسئلة المبوب' : 'Question Bank'}</span>
                      </a>
                    </div>
                  `;
                })()}
              </div>
            `}
          </div>
        </div>
      `;

      if (window.lucide) window.lucide.createIcons();

      // Click handling
      if (!submitted) {
        container.querySelectorAll('.quiz-opt').forEach(btn => {
          btn.addEventListener('click', () => {
            const qIdx = parseInt(btn.getAttribute('data-q'), 10);
            const optIdx = parseInt(btn.getAttribute('data-opt'), 10);
            userAnswers[qIdx] = optIdx;
            renderQuiz();
          });
        });

        document.getElementById('btn-submit-quiz')?.addEventListener('click', () => {
          if (answeredCount < totalCount) {
            const msg = isAr 
              ? `أجبت على ${answeredCount} من ${totalCount} أسئلة فقط. هل ترغب في تسليم الامتحان وتقييم النتيجة؟`
              : `You only answered ${answeredCount} of ${totalCount} questions. Submit anyway?`;
            if (!confirm(msg)) return;
          }

          submitted = true;
          let score = 0;
          questions.forEach((q, idx) => {
            const correctIndex = typeof q.correct_index === 'number' ? q.correct_index : (typeof q.correct === 'number' ? q.correct : 0);
            if (userAnswers[idx] === correctIndex) score++;
          });

          if (window.STORE && typeof window.STORE.addPoints === 'function') {
            window.STORE.addPoints(score * 10);
          }
          if (window.Toast && typeof window.Toast.show === 'function') {
            window.Toast.show(isAr ? `تم رصد النتيجة بنجاح! +${score * 10} نقطة 🎓` : `Exam graded! +${score * 10} pts`, 'success');
          }
          renderQuiz();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      } else {
        document.getElementById('btn-retry-quiz')?.addEventListener('click', () => {
          userAnswers = {};
          submitted = false;
          renderQuiz();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    };

    renderQuiz();
  }
};

window.QuizzesPage = QuizzesPage;
