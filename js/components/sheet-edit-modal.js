/**
 * KURO FANGS — UNIFIED SHEET EDIT MODAL
 * Allows full in-place editing of sheet metadata (Title, Subject, Doctor, Date/Time, Order, Pages)
 * and PDF file replacement (Drag-and-drop local PDF upload or external URL).
 */

(function () {
  /**
   * Helper: Detect page count from raw PDF bytes
   * @param {File|Blob} fileOrBlob
   * @returns {Promise<number|null>}
   */
  async function detectPdfPageCount(fileOrBlob) {
    if (!fileOrBlob) return null;
    try {
      const arrayBuffer = await fileOrBlob.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const text = new TextDecoder('latin1').decode(bytes);

      // Method 1: Search for /Count N in Catalog or Pages dictionaries
      const countMatches = [...text.matchAll(/\/Count\s+(\d+)/g)];
      if (countMatches.length > 0) {
        const counts = countMatches.map(m => parseInt(m[1], 10)).filter(n => n > 0 && n < 5000);
        if (counts.length > 0) {
          return Math.max(...counts);
        }
      }

      // Method 2: Count occurrences of /Type /Page
      const pageMatches = text.match(/\/Type\s*\/Page\b/g);
      if (pageMatches && pageMatches.length > 0) {
        return pageMatches.length;
      }
    } catch (e) {
      console.warn('PDF page calculation failed:', e);
    }
    return null;
  }

  /**
   * Main function to open the Sheet Edit Modal
   * @param {string} sheetId
   * @param {Function} [onSaveCallback] Callback called with (updatedSheet, updates)
   */
  window.showEditSheetModal = function (sheetId, onSaveCallback) {
    let sheet = null;
    if (window.DATA && Array.isArray(window.DATA.sheets)) {
      sheet = window.DATA.sheets.find(s => s.id === sheetId);
    }
    if (!sheet) {
      try {
        const customSheets = JSON.parse(localStorage.getItem('kf_admin_custom_sheets') || '[]');
        sheet = customSheets.find(s => s.id === sheetId);
      } catch (e) {}
    }

    if (!sheet) {
      if (typeof window.showToast === 'function') {
        window.showToast('تعذر العثور على بيانات هذا الشيت', { type: 'error' });
      }
      return;
    }

    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
    const subjects = window.DATA?.getSubjects?.() || [];

    // Remove any existing modal
    const existing = document.getElementById('global-edit-sheet-modal-backdrop');
    if (existing) existing.remove();

    // Determine current PDF status
    let currentPdfStatus = isAr ? '⚠️ لا يوجد ملف' : '⚠️ No file attached';
    if (sheet.pdf_source === 'local') {
      currentPdfStatus = isAr ? `📄 ملف محلي مخزن (${sheet.pages || '—'} صفحة)` : `📄 Local stored PDF (${sheet.pages || '—'} pages)`;
    } else if (sheet.pdf_source === 'cloud') {
      currentPdfStatus = isAr ? `☁️ ملف مرفوع على السحابة (${sheet.pages || '—'} صفحة)` : `☁️ Cloud PDF (${sheet.pages || '—'} pages)`;
    } else if (sheet.pdf_url) {
      currentPdfStatus = isAr ? '🔗 رابط PDF خارجي' : '🔗 External PDF URL';
    }

    const titleValue = sheet.title_ar || sheet.title_en || sheet.title || '';
    const doctorValue = sheet.doctor_name || '';
    const dateValue = sheet.date || '';
    const pagesValue = sheet.pages || 16;
    const orderValue = typeof sheet.order_index === 'number' ? sheet.order_index : 'auto';
    const typeValue = sheet.type || (isAr ? 'شيت' : 'Sheet');

    const modalMarkup = `
      <div id="global-edit-sheet-modal-backdrop" style="position: fixed; inset: 0; z-index: 1000000; background: rgba(8, 10, 18, 0.88); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; padding: 16px; overflow-y: auto; direction: ${isAr ? 'rtl' : 'ltr'}; font-family: inherit;">
        <div class="edit-sheet-card" style="background: #181926; border: 1px solid rgba(255,255,255,0.14); border-radius: 20px; width: min(560px, 96vw); max-height: 90vh; max-height: 90dvh; overflow-y: auto; box-shadow: 0 25px 60px rgba(0,0,0,0.65); padding: 24px; color: #F8FAFC; display: flex; flex-direction: column; gap: 18px; box-sizing: border-box; animation: docZoomIn 0.2s ease;">
          
          <!-- Modal Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 14px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.5rem; line-height: 1;">✏️</span>
              <div>
                <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #F8FAFC;">
                  ${isAr ? 'تعديل بيانات وملف الشيت' : 'Edit Sheet & File Details'}
                </h3>
                <p style="margin: 2px 0 0; font-size: 0.775rem; color: #94A3B8;">
                  ${isAr ? 'تغيير الملف أو أستاذ المادة أو الوقت والترتيب' : 'Change PDF file, doctor, date/time, and order'}
                </p>
              </div>
            </div>
            <button type="button" id="btn-close-edit-modal" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); color: #F8FAFC; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; transition: all 0.15s;" title="${isAr ? 'إغلاق' : 'Close'}">✕</button>
          </div>

          <!-- Edit Form -->
          <form id="form-edit-sheet-global" style="display: flex; flex-direction: column; gap: 14px;">
            
            <!-- 1. Sheet Title -->
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #CBD5E1; margin-bottom: 6px;">
                ${isAr ? 'عنوان الشيت / المحاضرة:' : 'Sheet / Lecture Title:'} <span style="color: #EF4444;">*</span>
              </label>
              <input type="text" id="edit-modal-title" value="${titleValue}" required placeholder="${isAr ? 'مثال: Dental infection' : 'e.g. Dental infection'}" style="width: 100%; background: #232536; border: 1px solid rgba(255,255,255,0.14); border-radius: 10px; color: #FFF; padding: 10px 12px; font-size: 0.85rem; outline: none; box-sizing: border-box; font-family: inherit;" />
            </div>

            <!-- 2. Subject Dropdown -->
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #CBD5E1; margin-bottom: 6px;">
                ${isAr ? 'المادة الدراسية:' : 'Subject:'} <span style="color: #EF4444;">*</span>
              </label>
              <select id="edit-modal-subject" required style="width: 100%; background: #232536; border: 1px solid rgba(255,255,255,0.14); border-radius: 10px; color: #FFF; padding: 10px 12px; font-size: 0.85rem; outline: none; box-sizing: border-box; font-family: inherit;">
                ${subjects.map(s => `
                  <option value="${s.id}" ${s.id === sheet.subject_id ? 'selected' : ''}>
                    ${isAr ? s.name_ar : s.name_en} (${s.code || ''})
                  </option>
                `).join('')}
              </select>
            </div>

            <!-- 3. Doctor Name & Date/Time (Side by side on wider screens) -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 12px;">
              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #CBD5E1; margin-bottom: 6px;">
                  ${isAr ? 'أستاذ المادة (الدكتور):' : 'Doctor / Instructor:'}
                </label>
                <input type="text" id="edit-modal-doctor" value="${doctorValue}" placeholder="${isAr ? 'مثال: د. هالة / د. طارق الزاوي' : 'e.g. Dr. Hala'}" style="width: 100%; background: #232536; border: 1px solid rgba(255,255,255,0.14); border-radius: 10px; color: #FFF; padding: 10px 12px; font-size: 0.85rem; outline: none; box-sizing: border-box; font-family: inherit;" />
              </div>

              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #CBD5E1; margin-bottom: 6px;">
                  ${isAr ? 'تاريخ أو وقت المحاضرة:' : 'Date / Time:'}
                </label>
                <input type="text" id="edit-modal-date" value="${dateValue}" placeholder="${isAr ? 'مثال: 2026-09-17 أو الأحد 10:00 صباحاً' : 'e.g. 2026-09-17 or Sunday 10:00 AM'}" style="width: 100%; background: #232536; border: 1px solid rgba(255,255,255,0.14); border-radius: 10px; color: #FFF; padding: 10px 12px; font-size: 0.85rem; outline: none; box-sizing: border-box; font-family: inherit;" />
              </div>
            </div>

            <!-- 4. Order Index & Pages Count & Type -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px;">
              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #CBD5E1; margin-bottom: 6px;">
                  ${isAr ? 'رقم الشيت (الترتيب):' : 'Sheet Number (Order):'}
                </label>
                <select id="edit-modal-order" style="width: 100%; background: #232536; border: 1px solid rgba(255,255,255,0.14); border-radius: 10px; color: #FFF; padding: 10px 12px; font-size: 0.85rem; outline: none; box-sizing: border-box; font-family: inherit;">
                  <option value="auto" ${orderValue === 'auto' ? 'selected' : ''}>${isAr ? 'تلقائي (حسب الإضافة)' : 'Auto'}</option>
                  ${Array.from({length: 40}, (_, i) => i + 1).map(num => `
                    <option value="${num}" ${num === orderValue ? 'selected' : ''}>${isAr ? `الشيت رقم ${num}` : `Sheet #${num}`}</option>
                  `).join('')}
                </select>
              </div>

              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #CBD5E1; margin-bottom: 6px;">
                  ${isAr ? 'عدد الصفحات:' : 'Pages Count:'}
                </label>
                <input type="number" id="edit-modal-pages" min="1" value="${pagesValue}" style="width: 100%; background: #232536; border: 1px solid rgba(255,255,255,0.14); border-radius: 10px; color: #FFF; padding: 10px 12px; font-size: 0.85rem; outline: none; box-sizing: border-box; font-family: inherit;" />
              </div>

              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #CBD5E1; margin-bottom: 6px;">
                  ${isAr ? 'نوع الشيت:' : 'Sheet Type:'}
                </label>
                <input type="text" id="edit-modal-type" value="${typeValue}" placeholder="${isAr ? 'شيت نظري / عملي / سلايدات' : 'Lecture / Slides / Lab'}" style="width: 100%; background: #232536; border: 1px solid rgba(255,255,255,0.14); border-radius: 10px; color: #FFF; padding: 10px 12px; font-size: 0.85rem; outline: none; box-sizing: border-box; font-family: inherit;" />
              </div>
            </div>

            <!-- 5. PDF File Management / Replacement -->
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 14px; display: flex; flex-direction: column; gap: 10px;">
              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px;">
                <span style="font-size: 0.8rem; font-weight: 700; color: #F1F5F9;">
                  ${isAr ? 'ملف الـ PDF للشيت:' : 'Sheet PDF Document:'}
                </span>
                <span style="font-size: 0.75rem; color: #38BDF8; font-weight: 600; background: rgba(56, 189, 248, 0.1); padding: 2px 8px; border-radius: 6px;">
                  ${currentPdfStatus}
                </span>
              </div>

              <!-- Drag and drop zone -->
              <div id="edit-modal-drop-zone" style="border: 2px dashed rgba(56, 189, 248, 0.35); border-radius: 12px; padding: 18px 14px; text-align: center; cursor: pointer; background: rgba(56, 189, 248, 0.03); transition: all 0.2s ease;">
                <input type="file" id="edit-modal-file" accept="application/pdf" style="display: none;" />
                <div id="edit-modal-drop-label">
                  <div style="font-size: 1.4rem; margin-bottom: 4px;">📥</div>
                  <div style="font-weight: 700; font-size: 0.825rem; color: #E2E8F0;">
                    ${isAr ? 'انقر لاختيار ملف PDF جديد أو اسحبه هنا' : 'Click to select or drag new PDF file here'}
                  </div>
                  <div style="font-size: 0.72rem; color: #94A3B8; margin-top: 2px;">
                    ${isAr ? 'الحد الأقصى: 15MB • سيتم احتساب عدد الصفحات تلقائياً' : 'Max: 15MB • Pages count auto-detected'}
                  </div>
                </div>
                <div id="edit-modal-file-preview" style="display: none; color: #34D399; font-weight: 700; font-size: 0.825rem; word-break: break-all;"></div>
              </div>

              <!-- External URL input fallback -->
              <div style="margin-top: 2px;">
                <button type="button" id="btn-toggle-modal-url" style="background: none; border: none; color: #38BDF8; font-size: 0.75rem; font-weight: 600; cursor: pointer; padding: 0; display: inline-flex; align-items: center; gap: 4px;">
                  <span>🔗</span>
                  <span>${isAr ? 'أو أدخل رابط PDF خارجي يدوياً ▼' : 'Or enter external PDF URL ▼'}</span>
                </button>
                <div id="edit-modal-url-container" style="${sheet.pdf_url && sheet.pdf_source === 'url' ? 'display: block;' : 'display: none;'} margin-top: 8px;">
                  <input type="url" id="edit-modal-url" dir="ltr" value="${sheet.pdf_source === 'url' ? (sheet.pdf_url || '') : ''}" placeholder="https://example.com/lecture.pdf" style="width: 100%; background: #232536; border: 1px solid rgba(255,255,255,0.14); border-radius: 8px; color: #FFF; padding: 8px 12px; font-size: 0.825rem; outline: none; box-sizing: border-box; font-family: inherit;" />
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div style="display: flex; gap: 10px; margin-top: 8px;">
              <button type="button" id="btn-cancel-edit-modal" style="flex: 1; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #F1F5F9; padding: 11px; border-radius: 10px; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: all 0.15s;">
                ${isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button type="submit" id="btn-save-edit-modal" style="flex: 1.6; background: linear-gradient(135deg, #0284C7, #0369A1); border: none; color: #FFF; padding: 11px; border-radius: 10px; font-weight: 800; font-size: 0.85rem; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 4px 15px rgba(2, 132, 199, 0.4); transition: all 0.15s;">
                <span>💾</span>
                <span id="btn-save-text">${isAr ? 'حفظ كافة التغييرات' : 'Save Changes'}</span>
              </button>
            </div>

          </form>

        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalMarkup);

    const backdropEl = document.getElementById('global-edit-sheet-modal-backdrop');
    const closeBtn = document.getElementById('btn-close-edit-modal');
    const cancelBtn = document.getElementById('btn-cancel-edit-modal');
    const formEl = document.getElementById('form-edit-sheet-global');
    const dropZone = document.getElementById('edit-modal-drop-zone');
    const fileInput = document.getElementById('edit-modal-file');
    const filePreview = document.getElementById('edit-modal-file-preview');
    const dropLabel = document.getElementById('edit-modal-drop-label');
    const toggleUrlBtn = document.getElementById('btn-toggle-modal-url');
    const urlContainer = document.getElementById('edit-modal-url-container');
    const pagesInput = document.getElementById('edit-modal-pages');

    function closeModal() {
      if (backdropEl) backdropEl.remove();
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (backdropEl) {
      backdropEl.addEventListener('click', (e) => {
        if (e.target === backdropEl) closeModal();
      });
    }

    // Toggle external URL container
    if (toggleUrlBtn && urlContainer) {
      toggleUrlBtn.addEventListener('click', () => {
        urlContainer.style.display = urlContainer.style.display === 'none' ? 'block' : 'none';
      });
    }

    // File selection & drop handling
    if (dropZone && fileInput) {
      dropZone.addEventListener('click', () => fileInput.click());

      const handleFile = async (file) => {
        if (!file) return;
        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
          if (window.showToast) window.showToast(isAr ? 'يرجى اختيار ملف PDF فقط' : 'Please select a PDF file', { type: 'error' });
          return;
        }
        if (file.size > 15 * 1024 * 1024) {
          if (window.showToast) window.showToast(isAr ? 'الملف كبير جداً (الحد الأقصى 15MB)' : 'File too large (Max 15MB)', { type: 'error' });
          return;
        }

        const sizeFormatted = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
        if (dropLabel) dropLabel.style.display = 'none';
        if (filePreview) {
          filePreview.style.display = 'block';
          filePreview.innerHTML = `📄 ${file.name} (${sizeFormatted})<br><span style="font-size: 0.72rem; color: #38BDF8;">${isAr ? 'جاري حساب عدد الصفحات...' : 'Detecting pages count...'}</span>`;
        }

        // Auto-detect page count
        const detected = await detectPdfPageCount(file);
        if (detected && pagesInput) {
          pagesInput.value = detected;
          if (filePreview) {
            filePreview.innerHTML = `📄 ${file.name} (${sizeFormatted})<br><span style="font-size: 0.72rem; color: #34D399;">${isAr ? `تم اكتشاف ${detected} صفحة تلقائياً ✅` : `Detected ${detected} pages ✅`}</span>`;
          }
        }
      };

      fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
          handleFile(fileInput.files[0]);
        }
      });

      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.background = 'rgba(56, 189, 248, 0.12)';
        dropZone.style.borderColor = '#38BDF8';
      });

      dropZone.addEventListener('dragleave', () => {
        dropZone.style.background = 'rgba(56, 189, 248, 0.03)';
        dropZone.style.borderColor = 'rgba(56, 189, 248, 0.35)';
      });

      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.background = 'rgba(56, 189, 248, 0.03)';
        dropZone.style.borderColor = 'rgba(56, 189, 248, 0.35)';
        if (e.dataTransfer?.files?.length > 0) {
          fileInput.files = e.dataTransfer.files;
          handleFile(e.dataTransfer.files[0]);
        }
      });
    }

    // Form Submission
    if (formEl) {
      formEl.addEventListener('submit', async (e) => {
        e.preventDefault();
        const saveBtn = document.getElementById('btn-save-edit-modal');
        const saveText = document.getElementById('btn-save-text');
        if (saveBtn) saveBtn.disabled = true;
        if (saveText) saveText.textContent = isAr ? 'جاري حفظ التغييرات...' : 'Saving...';

        const titleVal = document.getElementById('edit-modal-title').value.trim();
        const subjectVal = document.getElementById('edit-modal-subject').value;
        const doctorVal = document.getElementById('edit-modal-doctor').value.trim();
        const dateVal = document.getElementById('edit-modal-date').value.trim();
        const orderVal = document.getElementById('edit-modal-order').value;
        const pagesVal = parseInt(document.getElementById('edit-modal-pages').value, 10) || 16;
        const typeVal = document.getElementById('edit-modal-type').value.trim() || (isAr ? 'شيت' : 'Sheet');
        const urlInput = document.getElementById('edit-modal-url');
        const urlVal = urlInput ? urlInput.value.trim() : '';

        const updates = {
          title: titleVal,
          title_ar: titleVal,
          title_en: titleVal,
          subject_id: subjectVal,
          doctor_name: doctorVal,
          date: dateVal,
          pages: pagesVal,
          type: typeVal
        };

        if (orderVal !== 'auto') {
          updates.order_index = parseInt(orderVal, 10);
        }

        // Handle File Upload or Replacement
        const selectedFile = fileInput?.files?.[0];
        if (selectedFile) {
          updates.pdf_source = 'local';
          updates.size = (selectedFile.size / (1024 * 1024)).toFixed(1) + ' MB';

          // 1. Save to local IndexedDB
          if (window.DATA && window.DATA.pdfStore) {
            await window.DATA.pdfStore.savePdf(sheetId, selectedFile);
          }

          // 2. Upload to Cloud if available
          if (window.KuroCloud && typeof window.KuroCloud.uploadSheetPdf === 'function') {
            try {
              const cloudUrl = await window.KuroCloud.uploadSheetPdf(selectedFile, sheetId);
              if (cloudUrl) {
                updates.pdf_url = cloudUrl;
                updates.download_url = cloudUrl;
                updates.pdf_source = 'cloud';
              }
            } catch (err) {
              console.warn('Cloud sync error:', err);
            }
          }
        } else if (urlVal) {
          updates.pdf_url = urlVal;
          updates.download_url = urlVal;
          updates.pdf_source = 'url';
        }

        // Save to DATA
        let updatedSheet = null;
        if (window.DATA && typeof window.DATA.updateSheet === 'function') {
          updatedSheet = await window.DATA.updateSheet(sheetId, updates);
        }

        // Sync sheet metadata to Cloud if available
        if (window.KuroCloud && typeof window.KuroCloud.publishSheetToCloud === 'function') {
          try {
            const fullSheet = window.DATA?.sheets?.find(s => s.id === sheetId);
            if (fullSheet) {
              await window.KuroCloud.publishSheetToCloud({ ...fullSheet, ...updates });
            }
          } catch (err) {}
        }

        closeModal();

        if (typeof window.showToast === 'function') {
          window.showToast(isAr ? 'تم حفظ وتحديث بيانات الشيت بنجاح! 💾' : 'Sheet updated successfully! 💾', { type: 'success' });
        }

        // Trigger callback
        if (typeof onSaveCallback === 'function') {
          onSaveCallback(updatedSheet || { ...sheet, ...updates }, updates);
        }
      });
    }
  };
})();
