/**
 * KURO FANGS — Pre-clinical & Lab Requirements Tracker
 * Tracks Phantom Head cavities, Crown preps, Complete Denture steps, and labs
 */

export default async function renderRequirements(container, params) {
  const { default: KF_DATA }  = await import('../data.js');
  const { default: KF_STORE } = await import('../store.js');
  const { default: KURONI }   = await import('../kuroni.js');

  if (!KF_DATA.requirements) await KF_DATA.init();

  const departments = KF_DATA.getRequirements();
  let activeTab = departments[0]?.id || 'cons';

  function calculateStats() {
    let totalTarget = 0;
    let totalCompleted = 0;

    departments.forEach(dept => {
      dept.items.forEach(item => {
        totalTarget += item.target;
        const done = KF_STORE.getRequirement(item.id);
        totalCompleted += Math.min(done, item.target);
      });
    });

    const overallPct = totalTarget > 0 ? Math.round((totalCompleted / totalTarget) * 100) : 0;
    return { totalTarget, totalCompleted, overallPct };
  }

  function renderView() {
    const { totalTarget, totalCompleted, overallPct } = calculateStats();
    const currentDept = departments.find(d => d.id === activeTab) || departments[0];

    // Department-specific stats
    let deptTarget = 0;
    let deptCompleted = 0;
    currentDept.items.forEach(item => {
      deptTarget += item.target;
      deptCompleted += Math.min(KF_STORE.getRequirement(item.id), item.target);
    });
    const deptPct = deptTarget > 0 ? Math.round((deptCompleted / deptTarget) * 100) : 0;

    container.innerHTML = `
      <div class="page-header">
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:var(--space-3);">
          <div>
            <h1 class="page-title">سجل متطلبات المعمل والعملي 🦷</h1>
            <p class="page-subtitle">متابعة إنجاز حشوات الفانتوم، تحضير التيجان، وخطوات التركيبات لسنة ثالثة</p>
          </div>
          <div class="points-chip" style="font-size:var(--fs-sm);">
            ${overallPct === 100 ? '🏆 اكتملت جميع المتطلبات!' : `إنجاز كلي: ${overallPct}%`}
          </div>
        </div>
      </div>

      <div class="page-content animate-page-enter">

        <!-- Overall Progress Hero Card -->
        <div class="card" style="margin-bottom:var(--space-6); background:linear-gradient(135deg, var(--color-surface), var(--color-surface-sunken)); padding:var(--space-6); border-right: 5px solid var(--color-primary-dark);">
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:var(--space-6);">
            <div style="flex:1; min-width:240px;">
              <div style="font-size:var(--fs-xs); color:var(--color-text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:var(--space-1);">مستوى تقدم السنة الثالثة</div>
              <h2 style="font-size:var(--fs-xl); font-weight:var(--fw-black); margin-bottom:var(--space-2);">
                ${totalCompleted} من أصل ${totalTarget} متطلب مُنجز
              </h2>
              <div style="width:100%; height:10px; background:var(--color-border); border-radius:999px; overflow:hidden; margin:var(--space-3) 0;">
                <div style="width:${overallPct}%; height:100%; background:linear-gradient(90deg, #4ECDC4, var(--color-primary-dark)); border-radius:999px; transition: width 400ms ease;"></div>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:var(--fs-xs); color:var(--color-text-muted);">
                <span>0%</span>
                <span style="font-weight:bold; color:var(--color-primary-dark); font-size:var(--fs-sm);">${overallPct}% تم تسليمه</span>
                <span>100%</span>
              </div>
            </div>

            <div style="display:flex; align-items:center; gap:var(--space-4);">
              <div class="kuroni-container kuroni-md">
                ${KURONI.getSVG(overallPct >= 80 ? 'excited' : overallPct >= 40 ? 'calm' : 'neutral')}
              </div>
            </div>
          </div>
        </div>

        <!-- Department Tabs -->
        <div style="display:flex; gap:var(--space-2); overflow-x:auto; padding-bottom:var(--space-2); margin-bottom:var(--space-6);">
          ${departments.map(d => {
            const isSelected = d.id === activeTab;
            return `
              <button class="btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}"
                      data-tab="${d.id}"
                      style="white-space:nowrap; border-radius:var(--radius-xl); font-weight:var(--fw-semibold);">
                ${d.icon} ${d.name_ar.split('(')[0]}
              </button>`;
          }).join('')}
        </div>

        <!-- Department Overview Strip -->
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--space-4); background:var(--color-surface); padding:var(--space-3) var(--space-4); border-radius:var(--radius-lg); border:1px solid var(--color-border);">
          <div>
            <span style="font-weight:bold; font-size:var(--fs-sm);">${currentDept.name_ar}</span>
            <div style="font-size:var(--fs-xs); color:var(--color-text-muted);">${currentDept.description}</div>
          </div>
          <span class="tag ${deptPct === 100 ? 'tag-exam' : 'tag-neutral'}">
            إنجاز القسم: ${deptPct}%
          </span>
        </div>

        <!-- Requirements Items List -->
        <div style="display:flex; flex-direction:column; gap:var(--space-4);">
          ${currentDept.items.map((item, idx) => {
            const current = KF_STORE.getRequirement(item.id);
            const isDone = current >= item.target;
            const itemPct = Math.min(100, Math.round((current / item.target) * 100));

            return `
              <div class="card hover-lift" style="padding:var(--space-4) var(--space-5); border-right: 4px solid ${isDone ? '#22c55e' : currentDept.color};">
                <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:var(--space-3);">
                  
                  <div style="flex:1; min-width:220px;">
                    <div style="display:flex; align-items:center; gap:var(--space-2);">
                      <span style="font-weight:var(--fw-bold); font-size:var(--fs-base); color:var(--color-text-heading);">
                        ${item.name}
                      </span>
                      ${isDone ? `<span class="tag tag-exam" style="background:#22c55e; color:#fff;">مكتمل ✓</span>` : ''}
                    </div>
                    ${item.notes ? `
                      <div style="font-size:var(--fs-xs); color:var(--color-text-muted); margin-top:var(--space-1); line-height:1.4;">
                        💡 <strong>ملاحظة معملية:</strong> ${item.notes}
                      </div>` : ''}
                    
                    <!-- Item progress bar -->
                    <div style="width:100%; height:6px; background:var(--color-border); border-radius:999px; overflow:hidden; margin-top:var(--space-3);">
                      <div style="width:${itemPct}%; height:100%; background:${isDone ? '#22c55e' : currentDept.color}; transition: width 200ms ease;"></div>
                    </div>
                  </div>

                  <!-- Counter Control -->
                  <div style="display:flex; align-items:center; gap:var(--space-3); background:var(--color-surface-sunken); padding:var(--space-2) var(--space-3); border-radius:var(--radius-xl);">
                    <button class="btn btn-icon btn-sm btn-sub" data-id="${item.id}"
                            style="width:32px; height:32px; border-radius:50%; font-weight:bold; font-size:16px;"
                            ${current <= 0 ? 'disabled' : ''}>-</button>
                    
                    <div style="text-align:center; min-width:60px;">
                      <span style="font-size:var(--fs-lg); font-weight:var(--fw-black); color:${isDone ? '#22c55e' : 'var(--color-text-heading)'};">${current}</span>
                      <span style="font-size:var(--fs-xs); color:var(--color-text-muted);">/ ${item.target} ${item.unit}</span>
                    </div>

                    <button class="btn btn-icon btn-sm btn-add" data-id="${item.id}" data-target="${item.target}"
                            style="width:32px; height:32px; border-radius:50%; background:var(--color-primary-dark); color:#fff; font-weight:bold; font-size:16px;">+</button>
                  </div>

                </div>
              </div>`;
          }).join('')}
        </div>

        <!-- Info note -->
        <div style="margin-top:var(--space-8); padding:var(--space-4); background:var(--color-surface-sunken); border-radius:var(--radius-lg); text-align:center; font-size:var(--fs-xs); color:var(--color-text-muted);">
          🔒 يتم حفظ جميع أعمالك وتحديثات المتطلبات تلقائياً داخل متصفحك دون الحاجة لحساب أو اتصال بالإنترنت.
        </div>

      </div>`;

    // Bind tab clicks
    container.querySelectorAll('[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.tab;
        renderView();
      });
    });

    // Bind increment / decrement buttons
    container.querySelectorAll('.btn-add').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const target = parseInt(btn.dataset.target) || 999;
        KF_STORE.incrementRequirement(id, target);
        renderView();
      });
    });

    container.querySelectorAll('.btn-sub').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        KF_STORE.decrementRequirement(id);
        renderView();
      });
    });
  }

  // Initial render
  renderView();
}
