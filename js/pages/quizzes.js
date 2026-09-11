/**
 * KURO FANGS — EXAMS & INTERACTIVE QUIZZES PAGE
 */

const QuizzesPage = {
  render(container) {
    const questions = [
      {
        id: 'q-1',
        subject: 'جراحة الفم والفكين 1',
        question: 'ما هو التخدير الموضعي الأنسب لمريض يعاني من اضطراب خفقان القلب؟',
        options: [
          'Lidocaine 2% with Epinephrine 1:80,000',
          'Mepivacaine 3% plain (بدون مقبض وعائي)',
          'Articaine 4% with Epinephrine 1:100,000',
          'Bupivacaine 0.5% with Epinephrine 1:200,000'
        ],
        correct: 1,
        explanation: 'في مرضى عدم انتظام ضربات القلب وارتفاع الضغط غير المستقر، يفضل تجنب الإبينفرين واستخدام Mepivacaine 3% plain.'
      },
      {
        id: 'q-2',
        subject: 'الاستعاضة السنية الثابتة 2',
        question: 'ما هو نوع خط الإنهاء (Finish Line) الموصى به لتحضير التيجان الخزفية الكاملة (All-Ceramic Crown)؟',
        options: [
          'Knife edge',
          'Feather edge',
          'Deep Chamfer or Rounded Shoulder',
          'Bevel shoulder'
        ],
        correct: 2,
        explanation: 'الخزف الكامل يحتاج إلى دعم حواف كافٍ وتوزيع إجهادات متساوٍ، لذلك يتطلب Deep Chamfer أو Rounded Shoulder 90 درجة مع زوايا دائرية.'
      },
      {
        id: 'q-3',
        subject: 'علاج لب الأسنان 1',
        question: 'أي من المحاليل التالية هو المعيار الذهبي (Gold Standard) لإرواء وتطهير القنوات الجذرية؟',
        options: [
          'Sodium Hypochlorite (NaOCl 2.5% - 5.25%)',
          'Normal Saline 0.9%',
          'Hydrogen Peroxide 3%',
          'EDTA 17% فقط'
        ],
        correct: 0,
        explanation: 'محلول هيبوكلوريت الصوديوم هو المحلول الوحيد القادر على إذابة الأنسجة اللبية العضوية والتعقيم الفعال ضد البكتيريا داخل القنوات.'
      },
      {
        id: 'q-4',
        subject: 'علم أمراض الفم',
        question: 'أي من الآفات التالية تتميز بصورة شعاعية تشبه "فقاعات الصابون" (Soap Bubble appearance)؟',
        options: [
          'Radicular cyst',
          'Ameloblastoma',
          'Dentigerous cyst',
          'Periapical granuloma'
        ],
        correct: 1,
        explanation: 'الورم الأرومي المينائي (Ameloblastoma) متعدد الحجيرات يظهر كـ Multilocular radiolucency ذات مظهر Soap bubble أو Honeycomb.'
      }
    ];

    let userAnswers = {};
    let submitted = false;

    const renderQuiz = () => {
      container.innerHTML = `
        <div class="page-title-bar">
          <div class="page-title-group">
            <h1>
              <i data-lucide="file-check-2" style="color: var(--brand-primary); width: 26px; height: 26px;"></i>
              الامتحانات والكويزات التفاعلية
            </h1>
            <p>اختبر معلوماتك في مقررات طب الأسنان وتدرب على أسئلة الامتحانات النصفية والنهائية</p>
          </div>
          <div>
            <span class="badge badge-warning" style="font-size: 0.85rem; padding: 6px 12px;">
              4 أسئلة تقييمية
            </span>
          </div>
        </div>

        <div style="max-width: 800px; margin: 0 auto;">
          ${questions.map((q, idx) => `
            <div class="card" style="padding: 24px; margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span class="badge badge-primary">سؤال ${idx + 1}</span>
                <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">${q.subject}</span>
              </div>
              <h3 style="font-size: 1.05rem; margin-bottom: 18px; color: var(--text-primary);">${q.question}</h3>

              <div style="display: flex; flex-direction: column; gap: 10px;">
                ${q.options.map((opt, optIdx) => {
                  const isSelected = userAnswers[idx] === optIdx;
                  let optStyle = 'border: 1px solid var(--border-subtle); background: var(--bg-surface);';
                  let iconMarkup = '';

                  if (submitted) {
                    if (optIdx === q.correct) {
                      optStyle = 'border: 2px solid var(--color-success); background: var(--color-success-bg); font-weight: 700;';
                      iconMarkup = '<i data-lucide="check-circle" style="color: var(--color-success); width: 18px; height: 18px;"></i>';
                    } else if (isSelected && optIdx !== q.correct) {
                      optStyle = 'border: 2px solid var(--color-danger); background: var(--color-danger-bg);';
                      iconMarkup = '<i data-lucide="x-circle" style="color: var(--color-danger); width: 18px; height: 18px;"></i>';
                    }
                  } else if (isSelected) {
                    optStyle = 'border: 2px solid var(--brand-primary); background: var(--brand-primary-light); font-weight: 600;';
                  }

                  return `
                    <div class="quiz-option" data-q="${idx}" data-opt="${optIdx}" style="padding: 12px 16px; border-radius: var(--radius-sm); cursor: ${submitted ? 'default' : 'pointer'}; display: flex; align-items: center; justify-content: space-between; transition: all var(--transition-fast); ${optStyle}">
                      <span style="font-size: 0.9rem;">${opt}</span>
                      ${iconMarkup}
                    </div>
                  `;
                }).join('')}
              </div>

              ${submitted ? `
                <div style="margin-top: 16px; padding: 12px 16px; border-radius: var(--radius-sm); background: #F8FAFC; border-right: 4px solid var(--brand-primary); font-size: 0.85rem; color: var(--text-secondary);">
                  <strong style="color: var(--text-primary);">التعليل العلمي:</strong> ${q.explanation}
                </div>
              ` : ''}
            </div>
          `).join('')}

          <div class="card" style="padding: 24px; text-align: center; margin-top: 24px;">
            ${!submitted ? `
              <button id="btn-submit-quiz" class="btn btn-primary" style="padding: 12px 32px; font-size: 1rem;">
                <i data-lucide="send" style="width: 18px; height: 18px;"></i>
                تسليم الإجابات وتقييم النتيجة
              </button>
            ` : `
              <div>
                <h2 style="margin-bottom: 8px;">
                  درجتك: ${Object.keys(userAnswers).filter(idx => userAnswers[idx] === questions[idx].correct).length} من ${questions.length}
                </h2>
                <p style="margin-bottom: 16px;">تم تسجيل نتيجتك بنجاح وإضافة النقاط إلى رصيدك الأكاديمي!</p>
                <button id="btn-retry-quiz" class="btn btn-secondary">
                  <i data-lucide="rotate-ccw" style="width: 16px; height: 16px;"></i>
                  إعادة المحاولة
                </button>
              </div>
            `}
          </div>
        </div>
      `;

      if (window.lucide) window.lucide.createIcons();

      // Options click listener
      if (!submitted) {
        container.querySelectorAll('.quiz-option').forEach(el => {
          el.addEventListener('click', () => {
            const qIdx = parseInt(el.getAttribute('data-q'), 10);
            const optIdx = parseInt(el.getAttribute('data-opt'), 10);
            userAnswers[qIdx] = optIdx;
            renderQuiz();
          });
        });

        const submitBtn = document.getElementById('btn-submit-quiz');
        if (submitBtn) {
          submitBtn.addEventListener('click', () => {
            if (Object.keys(userAnswers).length < questions.length) {
              if (!confirm('لم تجب عن جميع الأسئلة بعد، هل تريد تسليم الإجابات الآن؟')) return;
            }
            submitted = true;
            let score = 0;
            questions.forEach((q, idx) => {
              if (userAnswers[idx] === q.correct) score++;
            });
            window.STORE.addPoints(score * 10);
            renderQuiz();
          });
        }
      } else {
        const retryBtn = document.getElementById('btn-retry-quiz');
        if (retryBtn) {
          retryBtn.addEventListener('click', () => {
            userAnswers = {};
            submitted = false;
            renderQuiz();
          });
        }
      }
    };

    renderQuiz();
  }
};

window.QuizzesPage = QuizzesPage;
