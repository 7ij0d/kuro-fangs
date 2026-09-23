/**
 * KURO FANGS — DATA SERVICE
 * Dental Curriculum Data for Year 3 with Subject Cover Images
 */

class DataService {
  constructor() {
    this.subjects = [];
    this.sheets = [];
    this.alerts = [];
    this.doctors = [];
    this.questions = [];
    this.flashcards = [];
    this.previousExams = [];
    this.requirements = [];
    this.videos = [];
    this.recordings = [];
    this.notes = [];
    this.loaded = false;

    // Ultra-lightweight WebP cover banners (under ~25KB each, 600x337 at 75% quality)
    this.subjectCovers = {
      'gen-med': 'assets/covers/gen-med.webp',
      'gen-surgery': 'assets/covers/gen-surgery.webp',
      'fixed-pros': 'assets/covers/fixed-pros.webp',
      'omfs': 'assets/covers/omfs.webp',
      'oral-diseases': 'assets/covers/oral-diseases.webp',
      'endo': 'assets/covers/endo.webp',
      'omdr': 'assets/covers/omdr.webp',
      'preventive': 'assets/covers/preventive.webp',
      'cons-endo': 'assets/covers/cons-endo.webp',
      'ortho': 'assets/covers/ortho.webp',
      'pedo': 'assets/covers/pedo.webp',
      'pediatric': 'assets/covers/pediatric.webp',
      'removable-pros': 'assets/covers/removable-pros.webp'
    };

    // Official Weekly Theoretical Lectures Timetable (Tripoli Dental Faculty Official Schedule)
    this.theoryScheduleDays = [
      {
        dayIndex: 6, // Saturday
        day_ar: 'السبت', day_en: 'Saturday',
        slots: [
          { time: '08:00 - 10:00', startHour: 8, endHour: 10, code: 'MS310', subject_id: 'gen-med', subject_ar: 'الباطنة العامة', subject_en: 'General Medicine', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#0284C7' },
          { time: '10:00 - 12:00', startHour: 10, endHour: 12, code: 'MS320', subject_id: 'gen-surgery', subject_ar: 'الجراحة العامة', subject_en: 'General Surgery', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#2563EB' }
        ]
      },
      {
        dayIndex: 0, // Sunday
        day_ar: 'الأحد', day_en: 'Sunday',
        slots: [
          { time: '08:00 - 10:00', startHour: 8, endHour: 10, code: 'DS331', subject_id: 'fixed-pros', subject_ar: 'الاستعاضة السنية الثابتة 2', subject_en: 'Fixed Prosthodontics II', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#0D9488' },
          { time: '10:00 - 12:00', startHour: 10, endHour: 12, code: 'DS341', subject_id: 'omfs', subject_ar: 'جراحة الفم والوجه والفكين 1', subject_en: 'OMFS I', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#059669' }
        ]
      },
      {
        dayIndex: 1, // Monday
        day_ar: 'الإثنين', day_en: 'Monday',
        slots: [
          { time: '08:00 - 10:00', startHour: 8, endHour: 10, code: 'DS380', subject_id: 'oral-diseases', subject_ar: 'أمراض الفم', subject_en: 'Oral Pathology', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#D97706' },
          { time: '10:00 - 12:00', startHour: 10, endHour: 12, code: 'DS351', subject_id: 'endo', subject_ar: 'أمراض وعلاج اللثة 1', subject_en: 'Periodontology I', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#C2410C' }
        ]
      },
      {
        dayIndex: 2, // Tuesday
        day_ar: 'الثلاثاء', day_en: 'Tuesday',
        slots: [
          { time: '08:00 - 10:00', startHour: 8, endHour: 10, code: 'DS381', subject_id: 'preventive', subject_ar: 'طب الأسنان الوقائي', subject_en: 'Preventive Dentistry', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#CA8A04' },
          { time: '10:00 - 12:00', startHour: 10, endHour: 12, code: 'DS361', subject_id: 'omdr', subject_ar: 'طب الفم والتشخيص والأشعة 1', subject_en: 'Oral Diagnosis & Radiology I', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#EAB308' }
        ]
      },
      {
        dayIndex: 3, // Wednesday
        day_ar: 'الأربعاء', day_en: 'Wednesday',
        slots: [
          { time: '08:00 - 10:00', startHour: 8, endHour: 10, code: 'DS311', subject_id: 'cons-endo', subject_ar: 'العلاج التحفظي وعلاج الجذور 2', subject_en: 'Cons & Endo II', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#DB2777' },
          { time: '10:00 - 12:00', startHour: 10, endHour: 12, code: 'DS371', subject_id: 'ortho', subject_ar: 'تقويم الأسنان 1', subject_en: 'Orthodontics I', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#9333EA' },
          { time: '02:00 - 04:00', startHour: 14, endHour: 16, code: 'DS380', subject_id: 'oral-diseases', subject_ar: 'أمراض الفم (المحاضرة 2)', subject_en: 'Oral Pathology (Lecture 2)', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#D97706' }
        ]
      },
      {
        dayIndex: 4, // Thursday
        day_ar: 'الخميس', day_en: 'Thursday',
        slots: [
          { time: '08:00 - 10:00', startHour: 8, endHour: 10, code: 'DS321', subject_id: 'removable-pros', subject_ar: 'الاستعاضة السنية المتحركة 2', subject_en: 'Removable Prosthodontics II', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#7C3AED' },
          { time: '10:00 - 12:00', startHour: 10, endHour: 12, code: 'DS470', subject_id: 'pedo', subject_ar: 'طب أسنان الأطفال 1', subject_en: 'Pediatric Dentistry I', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#16A34A' }
        ]
      }
    ];
  }

  getTheoryScheduleForDay(dayIndex) {
    if (dayIndex === 5) {
      return {
        dayIndex: 5,
        day_ar: 'الجمعة',
        day_en: 'Friday',
        slots: [],
        isWeekend: true
      };
    }
    const day = (this.theoryScheduleDays || []).find(d => d.dayIndex === dayIndex);
    if (day) return day;
    const arDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const enDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return {
      dayIndex: dayIndex,
      day_ar: arDays[dayIndex] || '',
      day_en: enDays[dayIndex] || '',
      slots: [],
      isWeekend: dayIndex === 5
    };
  }

  async init() {
    if (this.loaded) return;

    // 1. Populate default subjects, sheets, and alerts synchronously for INSTANT page render (<30ms)
    const defaultSubjects = this.getDefaultSubjects();
    this.subjects = defaultSubjects;
    this.subjects.forEach(s => {
      s.cover_image = s.cover_image || this.subjectCovers[s.id] || `assets/covers/${s.id}.webp`;
    });
    this.alerts = this.getDefaultAlerts();
    this.sheets = this.getDefaultSheets();
    this.questions = this.getDefaultQuestions();
    this.flashcards = this.getDefaultFlashcards();

    // 2. Merge cached cloud sheets & local custom admin sheets instantly
    try {
      ['kf_cloud_cached_sheets', 'kf_admin_custom_sheets'].forEach(k => {
        try {
          const raw = localStorage.getItem(k);
          if (raw && (raw.includes('sh-fixed-provisional') || raw.includes('sh_admin_1789336010378') || raw.toLowerCase().includes('provisional'))) {
            const parsed = JSON.parse(raw).filter(s => s && s.id !== 'sh-fixed-provisional' && s.id !== 'sh_admin_1789336010378' && !(s.title || '').toLowerCase().includes('provisional'));
            localStorage.setItem(k, JSON.stringify(parsed));
          }
          // Sanitize OMDR Sheet 1 legacy ID and stale title
          if (raw && (raw.includes('sh-omdr-01') || raw.toLowerCase().includes('evaluation of the patient'))) {
            let parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              parsed = parsed.filter(s => s && s.id !== 'sh-omdr-01');
              parsed.forEach(s => {
                if (s && (s.id === 'sh_admin_1789462201436' || (s.title || '').toLowerCase().includes('evaluation of the patient'))) {
                  s.id = 'sh_admin_1789462201436';
                  s.title = 'Sheet 1: Approach to the Evaluation of the Patient';
                  s.title_ar = 'الشيت 1: تقييم وفحص المريض';
                  s.title_en = 'Sheet 1: Approach to the Evaluation of the Patient';
                  s.doctor = 'د عبدالعظيم قداد';
                  s.doctor_name = 'د عبدالعظيم قداد';
                }
              });
              localStorage.setItem(k, JSON.stringify(parsed));
            }
          }
        } catch (err) {}
      });
      if (this.pdfStore && typeof this.pdfStore.deletePdf === 'function') {
        this.pdfStore.deletePdf('sh-fixed-provisional').catch(() => {});
        this.pdfStore.deletePdf('sh_admin_1789336010378').catch(() => {});
        this.pdfStore.deletePdf('sh-omdr-01').catch(() => {});
      }

      const cachedCloudSheets = JSON.parse(localStorage.getItem('kf_cloud_cached_sheets') || '[]');
      if (Array.isArray(cachedCloudSheets) && cachedCloudSheets.length > 0) {
        cachedCloudSheets.forEach(cs => {
          const idx = this.sheets.findIndex(s => s.id === cs.id);
          if (idx !== -1) {
            this.sheets[idx] = { ...this.sheets[idx], ...cs };
          } else {
            this.sheets.push(cs);
          }
        });
      }
      const customSheets = JSON.parse(localStorage.getItem('kf_admin_custom_sheets') || '[]');
      if (Array.isArray(customSheets) && customSheets.length > 0) {
        customSheets.forEach(cs => {
          if (!this.sheets.some(s => s.id === cs.id)) {
            this.sheets.unshift(cs);
          }
        });
      }

      // Deduplicate sheets by ID
      const seenIds = new Set();
      this.sheets = this.sheets.filter(s => {
        if (!s || !s.id || s.id === 'sh-omdr-01') return false;
        if (seenIds.has(s.id)) return false;
        seenIds.add(s.id);
        return true;
      });
    } catch (e) {}

    // 2b. Merge admin-created recordings from localStorage
    try {
      const adminRecs = JSON.parse(localStorage.getItem('kf_admin_recordings') || '[]');
      if (Array.isArray(adminRecs)) {
        adminRecs.forEach(r => {
          if (!this.recordings.some(x => x.id === r.id)) {
            this.recordings.push(r);
          }
        });
      }
    } catch (e) {}

    // 2c. Merge admin-created questions from localStorage
    try {
      const adminQs = JSON.parse(localStorage.getItem('kf_admin_questions') || '[]');
      if (Array.isArray(adminQs)) {
        adminQs.forEach(q => {
          if (!this.questions.some(x => x.id === q.id)) {
            this.questions.push(q);
          }
        });
      }
    } catch (e) {}

    this.loaded = true;

    // 3. Fire JSON & Cloud sync asynchronously in background (Non-Blocking)
    setTimeout(async () => {
      try {
        const [subjectsRes, sheetsRes, alertsRes, doctorsRes] = await Promise.allSettled([
          fetch('data/subjects.json').then(r => r.json()),
          fetch('data/sheets.json').then(r => r.json()),
          fetch('data/alerts.json').then(r => r.json()),
          fetch('data/doctors.json').then(r => r.json())
        ]);

        if (subjectsRes.status === 'fulfilled' && subjectsRes.value?.subjects) {
          this.subjects = subjectsRes.value.subjects;
          this.subjects.forEach(s => {
            s.cover_image = s.cover_image || this.subjectCovers[s.id] || `assets/covers/${s.id}.webp`;
          });
        }
        if (sheetsRes.status === 'fulfilled' && Array.isArray(sheetsRes.value?.sheets) && sheetsRes.value.sheets.length > 0) {
          sheetsRes.value.sheets.forEach(s => {
            if (!this.sheets.some(existing => existing.id === s.id)) {
              this.sheets.push(s);
            }
          });
        }
        if (alertsRes.status === 'fulfilled' && alertsRes.value?.alerts) {
          this.alerts = alertsRes.value.alerts;
        }
        if (doctorsRes.status === 'fulfilled' && doctorsRes.value?.doctors) {
          this.doctors = doctorsRes.value.doctors;
        }

        // Live Central Cloud Sync from Supabase in background
        // Supabase is the source of truth: sheets not in Supabase are removed from local view
        if (window.KuroCloud && typeof window.KuroCloud.fetchCloudSheets === 'function') {
          const liveCloudSheets = await window.KuroCloud.fetchCloudSheets();
          if (Array.isArray(liveCloudSheets) && liveCloudSheets.length > 0) {
            // Build set of cloud sheet IDs (authoritative list)
            const cloudIds = new Set(liveCloudSheets.map(s => s.id));

            // 1. Update/merge cloud sheets into local list
            liveCloudSheets.forEach(cs => {
              const idx = this.sheets.findIndex(s => s.id === cs.id);
              if (idx !== -1) {
                this.sheets[idx] = { ...this.sheets[idx], ...cs };
              } else {
                this.sheets.push(cs);
              }
            });

            // 2. Remove any sheets that exist locally but were deleted from Supabase
            // (only remove sheets that were once synced to cloud — don't remove static/local-only sheets
            //  that were never uploaded, identified by having no pdf_url from cloud)
            const cachedCloudIds = new Set(
              JSON.parse(localStorage.getItem('kf_cloud_cached_sheets') || '[]').map(s => s.id)
            );
            this.sheets = this.sheets.filter(s => {
              // Keep if it's in current cloud list
              if (cloudIds.has(s.id)) return true;
              // Keep if it was never in cloud before (static/built-in sheet)
              if (!cachedCloudIds.has(s.id)) return true;
              // Remove if it was in cloud before but no longer is (admin deleted it)
              return false;
            });

            // Update cache with latest cloud state
            localStorage.setItem('kf_cloud_cached_sheets', JSON.stringify(liveCloudSheets));
          } else if (Array.isArray(liveCloudSheets) && liveCloudSheets.length === 0) {
            // Cloud returned empty — could be first run or all sheets deleted
            // Only clear cached cloud sheets (don't touch built-in sheets)
            const cachedIds = new Set(
              JSON.parse(localStorage.getItem('kf_cloud_cached_sheets') || '[]').map(s => s.id)
            );
            if (cachedIds.size > 0) {
              // Previously had cloud sheets, now all gone — remove them
              this.sheets = this.sheets.filter(s => !cachedIds.has(s.id));
              localStorage.setItem('kf_cloud_cached_sheets', '[]');
            }
          }
        }
      } catch (err) {
        console.warn('Background data sync note:', err);
      }
    }, 10);

    // Merge custom admin announcements from localStorage if present (legacy support)
    // These will be superseded by Supabase cloud alerts when they load
    try {
      const customAlerts = JSON.parse(localStorage.getItem('kf_admin_custom_alerts') || '[]');
      if (Array.isArray(customAlerts) && customAlerts.length > 0) {
        customAlerts.forEach(ca => {
          if (!this.alerts.some(a => a.id === ca.id)) {
            this.alerts.unshift(ca);
          }
        });
      }
    } catch (e) {}

    // Also apply locally-cached deletions on initial load (for fast first-render before cloud sync)
    // Cloud sync in background will eventually take over as source of truth
    const deletedSheetIds = this.getDeletedSheetIds();
    if (deletedSheetIds.length > 0) {
      this.sheets = (this.sheets || []).filter(s => !deletedSheetIds.includes(s.id));
    }

    const deletedAlertIds = this.getDeletedAlertIds();
    if (deletedAlertIds.length > 0) {
      this.alerts = (this.alerts || []).filter(a => !deletedAlertIds.includes(a.id));
    }

    this.loaded = true;

    // Kick off a second background sync specifically for alerts (cloud alerts are global)
    setTimeout(async () => {
      try {
        if (window.KuroCloud && typeof window.KuroCloud.fetchCloudAlerts === 'function') {
          const liveCloudAlerts = await window.KuroCloud.fetchCloudAlerts();
          if (Array.isArray(liveCloudAlerts) && liveCloudAlerts.length > 0) {
            const cloudAlertIds = new Set(liveCloudAlerts.map(a => a.id));
            const cachedCloudAlertIds = new Set(
              JSON.parse(localStorage.getItem('kf_cloud_cached_alerts') || '[]').map(a => a.id)
            );

            // Merge cloud alerts
            liveCloudAlerts.forEach(ca => {
              const idx = this.alerts.findIndex(a => a.id === ca.id);
              if (idx !== -1) { this.alerts[idx] = { ...this.alerts[idx], ...ca }; }
              else { this.alerts.unshift(ca); }
            });

            // Remove alerts deleted from cloud
            this.alerts = this.alerts.filter(a => {
              if (cloudAlertIds.has(a.id)) return true;
              if (!cachedCloudAlertIds.has(a.id)) return true;
              return false;
            });

            localStorage.setItem('kf_cloud_cached_alerts', JSON.stringify(liveCloudAlerts));
          }
        }
      } catch (err) {
        console.warn('Cloud alerts sync note:', err);
      }
    }, 500); // slight delay so sheets sync runs first
  }


  getDeletedSheetIds() {
    try {
      return JSON.parse(localStorage.getItem('kf_deleted_sheet_ids') || '[]');
    } catch (e) {
      return [];
    }
  }

  getDeletedAlertIds() {
    try {
      return JSON.parse(localStorage.getItem('kf_deleted_alert_ids') || '[]');
    } catch (e) {
      return [];
    }
  }

  getSubjects() {
    return this.subjects;
  }

  getSubjectById(id) {
    return this.subjects.find(s => s.id === id);
  }

  getSheetsBySubject(subjectId) {
    const deleted = this.getDeletedSheetIds();
    let list = (this.sheets || []).filter(s => !deleted.includes(s.id));
    if (subjectId) {
      list = list.filter(s => s.subject_id === subjectId);
    }
    // Deduplicate by ID and normalized title
    const seen = new Set();
    const cleanList = [];
    for (const s of list) {
      if (!s || !s.id || s.id === 'sh-omdr-01') continue;
      const rawTitle = s.title_en || s.title || s.title_ar || '';
      const normKey = (s.subject_id || '') + '::' + rawTitle.toLowerCase().replace(/sheet\s*\d+\s*[:\-–—]?/gi, '').replace(/الشيت\s*\d+\s*[:\-–—]?/gi, '').trim();
      if (seen.has(s.id) || (normKey.length > 5 && seen.has(normKey))) {
        continue;
      }
      seen.add(s.id);
      if (normKey.length > 5) seen.add(normKey);
      cleanList.push(s);
    }
    list = cleanList;

    // Sort by order_index ascending, then by date descending for ties
    list.sort((a, b) => {
      const oa = typeof a.order_index === 'number' ? a.order_index : 9999;
      const ob = typeof b.order_index === 'number' ? b.order_index : 9999;
      if (oa !== ob) return oa - ob;
      return (b.date || '').localeCompare(a.date || '');
    });
    return list;
  }

  getSheetsForSubject(subjectId) {
    return this.getSheetsBySubject(subjectId);
  }

  getRecentSheets(limit = 6) {
    const deleted = this.getDeletedSheetIds();
    return [...(this.sheets || [])].filter(s => !deleted.includes(s.id)).slice(0, limit);
  }

  /**
   * Synchronize sheets live from central Supabase database
   * Can be invoked on route changes or when refreshing data
   */
  async syncCloudSheets() {
    try {
      if (window.KuroCloud && typeof window.KuroCloud.fetchCloudSheets === 'function') {
        const liveCloudSheets = await window.KuroCloud.fetchCloudSheets();
        if (Array.isArray(liveCloudSheets) && liveCloudSheets.length > 0) {
          const deleted = this.getDeletedSheetIds();
          liveCloudSheets.forEach(cs => {
            if (deleted.includes(cs.id)) return;
            const idx = this.sheets.findIndex(s => s.id === cs.id);
            if (idx !== -1) {
              this.sheets[idx] = { ...this.sheets[idx], ...cs };
            } else {
              this.sheets.push(cs);
            }
          });
          localStorage.setItem('kf_cloud_cached_sheets', JSON.stringify(liveCloudSheets));
          return liveCloudSheets;
        }
      }
    } catch (e) {
      console.warn('Live syncCloudSheets note:', e);
    }
    return [];
  }

  /**
   * Update an existing sheet's properties
   * @param {string} sheetId - The sheet ID to update
   * @param {object} updates - Object with properties to merge
   * @returns {object|null} The updated sheet or null if not found
   */
  updateSheet(sheetId, updates) {
    // Update in memory
    const sheet = (this.sheets || []).find(s => s.id === sheetId);
    if (!sheet) return null;
    Object.assign(sheet, updates);

    // Also update in localStorage custom sheets
    try {
      const customSheets = JSON.parse(localStorage.getItem('kf_admin_custom_sheets') || '[]');
      const csIdx = customSheets.findIndex(s => s.id === sheetId);
      if (csIdx !== -1) {
        Object.assign(customSheets[csIdx], updates);
        localStorage.setItem('kf_admin_custom_sheets', JSON.stringify(customSheets));
      }
    } catch (e) {}

    return sheet;
  }

  /**
   * Reorder a sheet within its subject group
   * @param {string} sheetId - The sheet ID to reorder
   * @param {number} newIndex - The new 1-based order index
   */
  reorderSheet(sheetId, newIndex) {
    const sheet = (this.sheets || []).find(s => s.id === sheetId);
    if (!sheet) return;

    const subjectId = sheet.subject_id;
    const siblings = this.getSheetsBySubject(subjectId);

    // Assign new index
    sheet.order_index = newIndex;

    // Re-normalize siblings to avoid gaps
    siblings.sort((a, b) => {
      const oa = typeof a.order_index === 'number' ? a.order_index : 9999;
      const ob = typeof b.order_index === 'number' ? b.order_index : 9999;
      return oa - ob;
    });
    siblings.forEach((s, i) => {
      s.order_index = i + 1;
    });

    // Persist all sibling order changes
    try {
      const customSheets = JSON.parse(localStorage.getItem('kf_admin_custom_sheets') || '[]');
      siblings.forEach(s => {
        const csIdx = customSheets.findIndex(cs => cs.id === s.id);
        if (csIdx !== -1) {
          customSheets[csIdx].order_index = s.order_index;
        }
      });
      localStorage.setItem('kf_admin_custom_sheets', JSON.stringify(customSheets));
    } catch (e) {}
  }

  /**
   * Get the next available order index for a subject
   * @param {string} subjectId
   * @returns {number}
   */
  getNextOrderIndex(subjectId) {
    const siblings = this.getSheetsBySubject(subjectId);
    if (siblings.length === 0) return 1;
    const maxIdx = Math.max(...siblings.map(s => typeof s.order_index === 'number' ? s.order_index : 0));
    return maxIdx + 1;
  }

  getAlerts() {
    const deleted = this.getDeletedAlertIds();
    return (this.alerts || []).filter(a => !deleted.includes(a.id));
  }

  async loadDeferredData() {
    if (this._deferredLoading || this._deferredLoaded) return;
    this._deferredLoading = true;
    try {
      const [
        questionsRes,
        flashcardsRes,
        examsRes,
        reqRes,
        recordingsRes
      ] = await Promise.allSettled([
        fetch('data/questions.json').then(r => r.json()),
        fetch('data/flashcards.json').then(r => r.json()),
        fetch('data/previous_exams.json').then(r => r.json()),
        fetch('data/requirements.json').then(r => r.json()),
        fetch('data/recordings.json').then(r => r.json())
      ]);

      if (questionsRes.status === 'fulfilled' && questionsRes.value?.questions) {
        this.questions = questionsRes.value.questions;
        // Re-merge admin questions
        try {
          const adminQs = JSON.parse(localStorage.getItem('kf_admin_questions') || '[]');
          if (Array.isArray(adminQs)) {
            adminQs.forEach(q => {
              if (!this.questions.some(x => x.id === q.id)) {
                this.questions.push(q);
              }
            });
          }
        } catch (e) {}
      }
      if (flashcardsRes.status === 'fulfilled' && flashcardsRes.value?.flashcards) {
        this.flashcards = flashcardsRes.value.flashcards;
      }
      if (examsRes.status === 'fulfilled' && examsRes.value?.previous_exams) {
        this.previousExams = examsRes.value.previous_exams;
      }
      if (reqRes.status === 'fulfilled' && reqRes.value?.requirements) {
        this.requirements = reqRes.value.requirements;
      }
      if (recordingsRes.status === 'fulfilled' && recordingsRes.value?.recordings) {
        this.recordings = recordingsRes.value.recordings;
        // Re-merge admin recordings
        try {
          const adminRecs = JSON.parse(localStorage.getItem('kf_admin_recordings') || '[]');
          if (Array.isArray(adminRecs)) {
            adminRecs.forEach(r => {
              if (!this.recordings.some(x => x.id === r.id)) {
                this.recordings.push(r);
              }
            });
          }
        } catch (e) {}
      }
      this._deferredLoaded = true;
    } catch (err) {
      console.warn('Deferred datasets background fetch notice:', err);
    } finally {
      this._deferredLoading = false;
    }
  }

  getQuestionsBySubject(subjectId) {
    if (!this._deferredLoaded && !this._deferredLoading) {
      this.loadDeferredData();
    }
    if (!subjectId) return this.questions || [];
    return (this.questions || []).filter(q => q.subject_id === subjectId);
  }

  getRecordings(subjectId) {
    if (!this._deferredLoaded && !this._deferredLoading) {
      this.loadDeferredData();
    }
    if (!subjectId) return this.recordings || [];
    return (this.recordings || []).filter(r => r.subject_id === subjectId);
  }

  getRecordingsBySheet(sheetId) {
    if (!sheetId) return [];
    return (this.recordings || []).filter(r => r.sheet_id === sheetId);
  }

  addRecording(recording) {
    this.recordings.push(recording);
    try {
      const stored = JSON.parse(localStorage.getItem('kf_admin_recordings') || '[]');
      stored.push(recording);
      localStorage.setItem('kf_admin_recordings', JSON.stringify(stored));
    } catch (e) {}
  }

  deleteRecording(id) {
    this.recordings = this.recordings.filter(r => r.id !== id);
    try {
      const stored = JSON.parse(localStorage.getItem('kf_admin_recordings') || '[]');
      localStorage.setItem('kf_admin_recordings', JSON.stringify(stored.filter(r => r.id !== id)));
    } catch (e) {}
  }

  addQuestion(question) {
    this.questions.push(question);
    try {
      const stored = JSON.parse(localStorage.getItem('kf_admin_questions') || '[]');
      stored.push(question);
      localStorage.setItem('kf_admin_questions', JSON.stringify(stored));
    } catch (e) {}
  }

  deleteQuestion(id) {
    this.questions = this.questions.filter(q => q.id !== id);
    try {
      const stored = JSON.parse(localStorage.getItem('kf_admin_questions') || '[]');
      localStorage.setItem('kf_admin_questions', JSON.stringify(stored.filter(q => q.id !== id)));
    } catch (e) {}
  }

  getFlashcards(subjectId) {
    if (!this._deferredLoaded && !this._deferredLoading) {
      this.loadDeferredData();
    }
    if (!subjectId) return this.flashcards || [];
    return (this.flashcards || []).filter(f => f.subject_id === subjectId);
  }

  getPreviousExams(subjectId) {
    if (!this._deferredLoaded && !this._deferredLoading) {
      this.loadDeferredData();
    }
    if (!subjectId) return this.previousExams || [];
    return (this.previousExams || []).filter(e => e.subject_id === subjectId);
  }

  getRequirements(subjectId) {
    if (!this._deferredLoaded && !this._deferredLoading) {
      this.loadDeferredData();
    }
    if (!subjectId) return this.requirements || [];
    return (this.requirements || []).filter(r => r.subject_id === subjectId);
  }

  /**
   * Real dynamic statistics per subject
   * Evaluated strictly from actual data arrays
   */
  getSubjectStats(subjectId) {
    const lecturesCount = (this.sheets || []).filter(s => s.subject_id === subjectId).length;
    const examsCount = (this.previousExams || []).filter(e => e.subject_id === subjectId).length;
    const recordingsCount = (this.recordings || []).filter(r => r.subject_id === subjectId).length;
    const questionsCount = (this.questions || []).filter(q => q.subject_id === subjectId).length;
    const completedCount = window.STORE && window.STORE.getCompletedSheets 
      ? (window.STORE.getCompletedSheets(subjectId) || []).length 
      : 0;
    const progress = lecturesCount > 0 ? Math.round((completedCount / lecturesCount) * 100) : 0;

    return {
      lecturesCount,
      examsCount,
      recordingsCount,
      questionsCount,
      progress
    };
  }

  // 12 Official Dental Subjects Fallback (Academia System Enriched)
  getDefaultSubjects() {
    return [
      {
        id: 'gen-med',
        name_ar: 'الطب العام (الباطنة)',
        name_en: 'General Medicine',
        code: 'MED-301',
        doctor_name_ar: null,
        doctor_name_en: null,
        is_popular: false,
        description_ar: 'أمراض الباطنة والقلب والغدد وعلاقتها بممارسة طب الأسنان',
        description_en: 'Internal medicine, cardiovascular and systemic diseases in dental practice'
      },
      {
        id: 'gen-surgery',
        name_ar: 'الجراحة العامة',
        name_en: 'General Surgery',
        code: 'GS-301',
        doctor_name_ar: null,
        doctor_name_en: null,
        is_popular: false,
        description_ar: 'أساسيات الجراحة العامة والتعقيم والتئام الجروح والنزيف والحروق',
        description_en: 'General surgical principles, wound healing, hemostasis, and shock management'
      },
      {
        id: 'fixed-pros',
        name_ar: 'الاستعاضة السنية الثابتة 2',
        name_en: 'Fixed Prosthodontics II',
        code: 'FP-302',
        doctor_name_ar: null,
        doctor_name_en: null,
        is_popular: true,
        description_ar: 'تحضير التيجان والجسور وخطوط الإنهاء والطبعات المطاطية',
        description_en: 'Crown and bridge preparation, finish lines, and impression techniques'
      },
      {
        id: 'omfs',
        name_ar: 'جراحة الفم والوجه والفكين 1',
        name_en: 'Oral & Maxillofacial Surgery I',
        code: 'OMS-301',
        doctor_name_ar: null,
        doctor_name_en: null,
        is_popular: true,
        description_ar: 'التخدير الموضعي وتقنيات قلع الأسنان ومضاعفات القلع',
        description_en: 'Local anesthesia techniques, exodontia protocols, and surgical complications'
      },
      {
        id: 'oral-diseases',
        name_ar: 'علم أمراض الفم',
        name_en: 'Oral Diseases / Pathology',
        code: 'OD-301',
        doctor_name_ar: null,
        doctor_name_en: null,
        is_popular: true,
        description_ar: 'دراسة الأمراض والآفات التي تصيب الأنسجة الفموية والأورام',
        description_en: 'Oral mucosal lesions, cysts, odontogenic tumors, and bone pathologies'
      },
      {
        id: 'endo',
        name_ar: 'علاج لب الأسنان 1 (علاج العصب)',
        name_en: 'Endodontics I',
        code: 'END-301',
        doctor_name_ar: null,
        doctor_name_en: null,
        is_popular: true,
        description_ar: 'تشخيص أمراض اللب والذروة وتنظيف وتوسيع القنوات وحشو الجذور',
        description_en: 'Pulp pathology, access cavity design, biomechanical cleaning, and obturation'
      },
      {
        id: 'omdr',
        name_ar: 'طب الفم والتشخيص والأشعة 1',
        name_en: 'OMDR I',
        code: 'OMDR-301',
        doctor_name_ar: null,
        doctor_name_en: null,
        is_popular: false,
        description_ar: 'الفحص السريري وقراءة وتفسير صور الأشعة البانورامية وتطبيقاتها',
        description_en: 'Clinical examination, panoramic radiographs, and radiographic interpretation'
      },
      {
        id: 'preventive',
        name_ar: 'طب الأسنان الوقائي',
        name_en: 'Preventive Dentistry',
        code: 'PREV-301',
        doctor_name_ar: null,
        doctor_name_en: null,
        is_popular: false,
        description_ar: 'طرق الوقاية من نخر الأسنان، الفلورايد، والمواد السادة للشقوق',
        description_en: 'Caries prevention, fluoride modalities, pit and fissure sealants, and oral hygiene'
      },
      {
        id: 'cons-endo',
        name_ar: 'العلاج التحفظي 2',
        name_en: 'Cons & Endo II',
        code: 'CONS-302',
        doctor_name_ar: null,
        doctor_name_en: null,
        is_popular: true,
        description_ar: 'حشوات الكومبوزيت المتقدمة والترميمات التجميلية للأسنان',
        description_en: 'Advanced composite restorations, amalgam techniques, and aesthetic dentistry'
      },
      {
        id: 'ortho',
        name_ar: 'تقويم الأسنان 1',
        name_en: 'Orthodontics I',
        code: 'ORTH-301',
        doctor_name_ar: null,
        doctor_name_en: null,
        is_popular: false,
        description_ar: 'تصنيف إنجل، نمو وتطور الوجه والفكين، وتشخيص سوء الإطباق',
        description_en: 'Angle classification, craniofacial growth, and malocclusion diagnostics'
      },
      {
        id: 'pediatric',
        name_ar: 'طب أسنان الأطفال 1',
        name_en: 'Pediatric Dentistry I',
        code: 'PEDO-301',
        doctor_name_ar: null,
        doctor_name_en: null,
        is_popular: false,
        description_ar: 'التعامل السلوكي مع الأطفال، تخدير الأطفال، وبتر لب الأسنان اللبنية',
        description_en: 'Behavior management, pediatric pulp therapy, and space maintainers'
      },
      {
        id: 'removable-pros',
        name_ar: 'الاستعاضة السنية المتحركة 2',
        name_en: 'Removable Prosthodontics II',
        code: 'RP-302',
        doctor_name_ar: null,
        doctor_name_en: null,
        is_popular: false,
        description_ar: 'الأطقم الجزئية المتحركة وتصميم الكروم كوبالت والروابط الإطباقية',
        description_en: 'Removable partial dentures, cobalt-chromium framework design, and clasps'
      }
    ];
  }

  
  async fetchQuestions() {
    try {
      const res = await fetch('data/questions.json?v=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.questions) && data.questions.length > 0) {
          this.questions = data.questions;
          return this.questions;
        }
      }
    } catch (e) {}
    return this.questions;
  }

  
  getDefaultQuestions() {
    return [
    {
        "id": "q_omdr_01",
        "subject_id": "omdr",
        "subject_name_ar": "طب الفم والتشخيص والأشعة 1",
        "subject_name_en": "Oral Medicine, Diagnosis and Radiology I",
        "sheet_id": "sh_admin_1789462201436",
        "sheet_title_ar": "الشيت 1: تقييم وفحص المريض",
        "sheet_title_en": "Sheet 1: Approach to the Evaluation of the Patient",
        "page_ref": 4,
        "topic_ar": "أنواع التشخيص الفموي",
        "topic_en": "Types of Oral Diagnosis",
        "type": "past_exam",
        "source": "past_exam",
        "tags": [
            "Oral Diagnosis",
            "Spot diagnosis",
            "Types of Diagnosis"
        ],
        "text_ar": "فيما يتعلق بأهمية التشخيص، الحد الأدنى من البيانات والمعلومات البسيطة التي يمكن جمعها فوراً من المريض والمرتبطة مباشرة بشكواه الرئيسية يُسمى:",
        "text_en": "Regarding importance of diagnosis, a minimum simple little data or information can be immediately collected from a patient which is closely related to his chief complaint is called:",
        "options_ar": [
            "التشخيص النهائي (Final diagnosis)",
            "التشخيص الخاطف السريع (Spot diagnosis)",
            "التشخيص التفريقي (Differential diagnosis)",
            "التشخيص الشامل (Comprehensive diagnosis)"
        ],
        "options_en": [
            "Final diagnosis",
            "Spot diagnosis",
            "Differential diagnosis",
            "Comprehensive diagnosis"
        ],
        "correct_index": 1,
        "answer_ar": "الإجابة المعتمدة: B. التشخيص الخاطف السريع (Spot diagnosis)\n\nمرجع الشيت (صفحة 4):\n«3. Spot (snap) diagnosis: It is simple cases where rapid diagnosis can be achieved perfectly, based on minimal data.»\nالتشخيص الخاطف هو الحالات البسيطة التي يمكن فيها التوصل إلى التشخيص الدقيق والفوري بالاعتماد على أقل قدر ممكن من البيانات المرتبطة مباشرة بالشكوى الرئيسية.",
        "answer_en": "Correct Answer: B. Spot diagnosis\n\nSheet Reference (Page 4):\n\"3. Spot (snap) diagnosis: It is simple cases where rapid diagnosis can be achieved perfectly, based on minimal data.\"\nMinimal simple data closely related to chief complaint leads to spot diagnosis.",
        "quote_ref": "3. Spot (snap) diagnosis: It is simple cases where rapid diagnosis can be achieved perfectly, based on minimal data."
    },
    {
        "id": "q_omdr_02",
        "subject_id": "omdr",
        "subject_name_ar": "طب الفم والتشخيص والأشعة 1",
        "subject_name_en": "Oral Medicine, Diagnosis and Radiology I",
        "sheet_id": "sh_admin_1789462201436",
        "sheet_title_ar": "الشيت 1: تقييم وفحص المريض",
        "sheet_title_en": "Sheet 1: Approach to the Evaluation of the Patient",
        "page_ref": 4,
        "topic_ar": "التشخيص التفريقي",
        "topic_en": "Differential Diagnosis",
        "type": "past_exam",
        "source": "past_exam",
        "tags": [
            "Differential diagnosis",
            "Oral Diagnosis",
            "Clinical Presentation"
        ],
        "text_ar": "هو جمع وتحليل البيانات لوضع قائمة بمرضين مختلفين أو أكثر يشتركان في ذات العرض والمظهر السريري الأولي:",
        "text_en": "It is the collection of data to develop a list of two or more different Diseases having common primary clinical presentation:",
        "options_ar": [
            "التشخيص الخاطف (Spot diagnosis)",
            "التشخيص التفريقي (Differential diagnosis)",
            "التشخيص المبدئي المؤقت (Working or provisional diagnosis)",
            "التشخيص الفموي الشامل (Comprehensive oral diagnosis)"
        ],
        "options_en": [
            "Spot (snap) diagnosis",
            "Differential diagnosis",
            "Working or provisional diagnosis",
            "Comprehensive oral diagnosis"
        ],
        "correct_index": 1,
        "answer_ar": "الإجابة المعتمدة: B. التشخيص التفريقي (Differential diagnosis)\n\nمرجع الشيت (صفحة 4):\n«4. Differential diagnosis: It is the collection of data to develop a list of two or more different diseases having common primary clinical presentation.»\nالتشخيص التفريقي هو عملية وضع قائمة بالأمراض المشتبه بها ومقارنتها سريرياً.",
        "answer_en": "Correct Answer: B. Differential diagnosis\n\nSheet Reference (Page 4):\n\"4. Differential diagnosis: It is the collection of data to develop a list of two or more different diseases having common primary clinical presentation.\"\nDifferential diagnosis compares diseases sharing similar clinical presentations.",
        "quote_ref": "4. Differential diagnosis: It is the collection of data to develop a list of two or more different diseases having common primary clinical presentation."
    },
    {
        "id": "q_omdr_03",
        "subject_id": "omdr",
        "subject_name_ar": "طب الفم والتشخيص والأشعة 1",
        "subject_name_en": "Oral Medicine, Diagnosis and Radiology I",
        "sheet_id": "sh_admin_1789462201436",
        "sheet_title_ar": "الشيت 1: تقييم وفحص المريض",
        "sheet_title_en": "Sheet 1: Approach to the Evaluation of the Patient",
        "page_ref": 4,
        "topic_ar": "تعريف التشخيص التفريقي وترتيب القائمة",
        "topic_en": "Definition of Differential Diagnosis & Priority",
        "type": "past_exam",
        "source": "past_exam",
        "tags": [
            "Differential diagnosis",
            "Definition",
            "Short Answer"
        ],
        "text_ar": "عرّف التشخيص التفريقي (Define: Differential diagnosis)؟",
        "text_en": "Define: Differential diagnosis? (or: What is the differential diagnosis?)",
        "options_ar": [
            "جمع البيانات لتطوير قائمة بمرضين مختلفين أو أكثر يشتركان في نفس المظهر السريري الأولي (مع وضع الآفة الأرجح في قمة القائمة)",
            "تشخيص سريع يتم التوصل إليه في الحالات البسيطة بناءً على الحد الأدنى من البيانات",
            "إجراء مسح إشعاعي ومخبري كامل دون فحص سريري",
            "تحديد السن المصاب بناءً على فحص القرع فقط"
        ],
        "options_en": [
            "It is the collection of data to develop a list of two or more different diseases having common primary clinical presentation (with most likely lesion placed on top)",
            "Rapid diagnosis achieved in simple cases based on minimal little data",
            "A complete laboratory and radiographic screening without clinical examination",
            "Identifying the diseased tooth solely through percussion test"
        ],
        "correct_index": 0,
        "answer_ar": "الإجابة النموذجية المعتمدة (Model Answer):\n«It is the collection of data to develop a list of two or more different diseases having common primary clinical presentation.»\n\n📌 ملاحظة سريرية هامة من الكلية (Clinical Note):\n«The most likely lesion is put on the top of the list according to clinical impression.»\nيتم وضع المرض أو الآفة الأرجح والأكثر احتمالاً في أعلى القائمة بناءً على الانطباع السريري الأولي.\n\nمرجع الشيت (صفحة 4): البند رقم 4 تحت Types of Oral Diagnosis.",
        "answer_en": "Model Answer:\n\"It is the collection of data to develop a list of two or more different diseases having common primary clinical presentation.\"\n\n*(Note: The most likely lesion is put on the top of the list according to clinical impression)*.\n\nSheet Reference (Page 4): Item 4 under Types of Oral Diagnosis.",
        "quote_ref": "4. Differential diagnosis: It is the collection of data to develop a list of two or more different diseases having common primary clinical presentation. (Note: The most likely lesion is put on the top of the list according to clinical impression)."
    },
    {
        "id": "q_omdr_04",
        "subject_id": "omdr",
        "subject_name_ar": "طب الفم والتشخيص والأشعة 1",
        "subject_name_en": "Oral Medicine, Diagnosis and Radiology I",
        "sheet_id": "sh_admin_1789462201436",
        "sheet_title_ar": "الشيت 1: تقييم وفحص المريض",
        "sheet_title_en": "Sheet 1: Approach to the Evaluation of the Patient",
        "page_ref": 8,
        "topic_ar": "العوامل المؤثرة على الشكوى الرئيسية",
        "topic_en": "Factors Affecting Chief Complaint",
        "type": "past_exam",
        "source": "past_exam",
        "tags": [
            "Chief Complaint",
            "Patient Evaluation",
            "Clinical History"
        ],
        "text_ar": "تتأثر الشكوى الرئيسية للمريض (The chief complaint is affected by) بـ:",
        "text_en": "The chief complaint is affected by:",
        "options_ar": [
            "ذاكرة المريض (Patient memory)",
            "عمر المريض (The age of the patient)",
            "الحالة النفسية والشخصية للمريض (The mental attitude and personality of patient)",
            "هيبة ومكانة طبيب الأسنان (The prestige of the dentist)",
            "جميع ما سبق صحيح (All of the above)"
        ],
        "options_en": [
            "Patient memory",
            "The age of the patient",
            "The mental attitude and personality of patient",
            "The prestige of the dentist",
            "All of the above"
        ],
        "correct_index": 4,
        "answer_ar": "الإجابة المعتمدة: E. جميع ما سبق صحيح (All of the above)\n\nمرجع الشيت (صفحة 8):\n«The chief complaint affected by:\n• Patient memory.\n• The age of the patient.\n• The mental attitude and personality of patient.\n• The prestige of the dentist.»\nكل هذه العوامل الأربعة تؤثر تأثيراً مباشراً على كيفية وصف المريض لشكواه ومدى دقتها.",
        "answer_en": "Correct Answer: E. All of the above\n\nSheet Reference (Page 8):\n\"The chief complaint affected by:\n• Patient memory.\n• The age of the patient.\n• The mental attitude and personality of patient.\n• The prestige of the dentist.\"\nAll listed factors significantly affect the chief complaint.",
        "quote_ref": "The chief complaint affected by: • Patient memory. • The age of the patient. • The mental attitude and personality of patient. • The prestige of the dentist."
    },
    {
        "id": "q_omdr_05",
        "subject_id": "omdr",
        "subject_name_ar": "طب الفم والتشخيص والأشعة 1",
        "subject_name_en": "Oral Medicine, Diagnosis and Radiology I",
        "sheet_id": "sh_admin_1789462201436",
        "sheet_title_ar": "الشيت 1: تقييم وفحص المريض",
        "sheet_title_en": "Sheet 1: Approach to the Evaluation of the Patient",
        "page_ref": 8,
        "topic_ar": "تصنيف آلام الشكوى الرئيسية",
        "topic_en": "Types of Pain in Chief Complaint",
        "type": "past_exam",
        "source": "past_exam",
        "tags": [
            "Chief Complaint",
            "Pain",
            "Somatic",
            "Neurogenic",
            "Psychogenic"
        ],
        "text_ar": "فيما يتعلق بالشكوى الرئيسية للمريض، قد يكون الألم (Pain) منشؤه:",
        "text_en": "Regarding chief complaint of patient, the pain may be:",
        "options_ar": [
            "جسدي (Somatic)",
            "عصبي المنشأ (Neurogenic)",
            "نفسي المنشأ (Psychogenic)",
            "جميع ما سبق (All of the above)"
        ],
        "options_en": [
            "Somatic",
            "Neurogenic",
            "Psychogenic",
            "All of the above"
        ],
        "correct_index": 3,
        "answer_ar": "الإجابة المعتمدة: D. جميع ما سبق (All of the above)\n\nمرجع الشيت (صفحة 8):\n«The most common chief complaint: 1. Pain — which may be: Somatic / Neurogenic / Psychogenic»\nالألم هو الشكوى الأكثر شيوعاً في عيادة طب الفم والأسنان، ويمكن أن يكون جسدياً أو عصبياً أو نفسياً.",
        "answer_en": "Correct Answer: D. All of the above (Somatic, Neurogenic, Psychogenic)\n\nSheet Reference (Page 8):\n\"The most common chief complaint: 1. Pain — which may be: Somatic / Neurogenic / Psychogenic\"\nPain can be categorized into somatic, neurogenic, or psychogenic etiologies.",
        "quote_ref": "The most common chief complaint: 1. Pain — which may be: Somatic / Neurogenic / Psychogenic"
    },
    {
        "id": "q_omdr_06",
        "subject_id": "omdr",
        "subject_name_ar": "طب الفم والتشخيص والأشعة 1",
        "subject_name_en": "Oral Medicine, Diagnosis and Radiology I",
        "sheet_id": "sh_admin_1789462201436",
        "sheet_title_ar": "الشيت 1: تقييم وفحص المريض",
        "sheet_title_en": "Sheet 1: Approach to the Evaluation of the Patient",
        "page_ref": 9,
        "topic_ar": "أسباب الحرقة في تجويف الفم",
        "topic_en": "Causes of Burning Sensation in Oral Cavity",
        "type": "past_exam",
        "source": "past_exam",
        "tags": [
            "Burning sensation",
            "Chief Complaint",
            "Oral Cavity"
        ],
        "text_ar": "اذكر الحالات التي قد تسبب شعوراً بالحرقة في تجويف الفم (Conditions causing burning sensation in oral cavity)؟",
        "text_en": "Mention 6 conditions that may cause burning sensation in the oral cavity?",
        "options_ar": [
            "العدوى الفطرية، الفيروسية، والبكتيرية (Infections)",
            "اللسان الجغرافي واللسان المشقق (Geographic & Fissured tongue)",
            "فقر الدم، نقص الفيتامينات، وجفاف الفم (Anemia, Vitamin deficiency, Xerostomia)",
            "جميع ما سبق (أي من الحالات السريرية التسع المعتمدة)"
        ],
        "options_en": [
            "Fungal, viral & bacterial infections",
            "Geographic tongue & fissured tongue",
            "Anemia, vitamin deficiency & xerostomia condition",
            "All of the above (Any of the 9 clinical conditions)"
        ],
        "correct_index": 3,
        "answer_ar": "الإجابة النموذجية المعتمدة (Model Answer - أي 6 من الآتية):\n1. Fungal infection (العدوى الفطرية)\n2. Viral infection (العدوى الفيروسية)\n3. Bacterial infection (العدوى البكتيرية)\n4. Fissured tongue (اللسان المشقق)\n5. Geographic tongue (اللسان الجغرافي)\n6. Anemia (فقر الدم)\n7. Coating atrophy of tongue (ضمور حليمات اللسان)\n8. Vitamin deficiency (نقص الفيتامينات)\n9. Xerostomia condition (جفاف الفم)\n\nمرجع الشيت (صفحة 9): Section 8, Item 2: «Burning sensation — e.g.»",
        "answer_en": "Model Answer (List any 6):\n1. Fungal infection\n2. Viral infection\n3. Bacterial infection\n4. Fissured tongue\n5. Geographic tongue\n6. Anemia\n7. Coating atrophy of tongue\n8. Vitamin deficiency\n9. Xerostomia condition\n\nSheet Reference (Page 9): Section 8, Item 2: Burning sensation — e.g.",
        "quote_ref": "Burning sensation — e.g.: Fungal infection / Viral infection / Bacterial infection / Fissured tongue / Geographic tongue / Anemia / Coating atrophy of tongue / Vitamin deficiency / Xerostomia condition"
    },
    {
        "id": "q_omdr_07",
        "subject_id": "omdr",
        "subject_name_ar": "طب الفم والتشخيص والأشعة 1",
        "subject_name_en": "Oral Medicine, Diagnosis and Radiology I",
        "sheet_id": "sh_admin_1789462201436",
        "sheet_title_ar": "الشيت 1: تقييم وفحص المريض",
        "sheet_title_en": "Sheet 1: Approach to the Evaluation of the Patient",
        "page_ref": 9,
        "topic_ar": "الأمراض المرتبطة بجفاف الفم",
        "topic_en": "Diseases Associated with Dry Mouth",
        "type": "past_exam",
        "source": "past_exam",
        "tags": [
            "Dry mouth",
            "Xerostomia",
            "Sjogren",
            "Radiation"
        ],
        "text_ar": "يُعد جفاف الفم (Dry mouth) سمة سريرية للأمراض والحالات التالية:",
        "text_en": "Dry mouth is a clinical feature of the following diseases:",
        "options_ar": [
            "العلاج الدوائي ومتلازمة شوغرن (Drug therapy & Sjogren's syndrome)",
            "ما بعد العلاج الإشعاعي والعلاج الكيميائي (Post-radiation therapy & Chemotherapy)",
            "مرض ميكوليتز (Mikulicz's disease)",
            "جميع ما سبق (All of the above)"
        ],
        "options_en": [
            "Drug therapy & Sjogren's syndrome",
            "Post-radiation therapy & Chemotherapy",
            "Mikulicz's disease",
            "All of the above"
        ],
        "correct_index": 3,
        "answer_ar": "الإجابة المعتمدة (Model Answer):\nيحدث جفاف الفم كسمة سريرية في الحالات الخمس الآتية:\n1. Drug therapy (العلاجات الدوائية)\n2. Sjogren's syndrome (متلازمة شوغرن)\n3. Post-radiation therapy (ما بعد العلاج الإشعاعي للرأس والعنق)\n4. Chemotherapy (العلاج الكيميائي)\n5. Mikulicz's disease (مرض ميكوليتز)\n\nمرجع الشيت (صفحة 9): Section 8, Item 4: «Dry mouth — e.g.»",
        "answer_en": "Model Answer:\n1. Drug therapy\n2. Sjogren's syndrome\n3. Post-radiation therapy\n4. Chemotherapy\n5. Mikulicz's disease\n\nSheet Reference (Page 9): Section 8, Item 4: Dry mouth — e.g.",
        "quote_ref": "Dry mouth — e.g.: 1. Drug therapy 2. Sjogren's syndrome 3. Post-radiation therapy 4. Chemotherapy 5. Mikulicz's disease"
    },
    {
        "id": "q_omdr_08",
        "subject_id": "omdr",
        "subject_name_ar": "طب الفم والتشخيص والأشعة 1",
        "subject_name_en": "Oral Medicine, Diagnosis and Radiology I",
        "sheet_id": "sh_admin_1789462201436",
        "sheet_title_ar": "الشيت 1: تقييم وفحص المريض",
        "sheet_title_en": "Sheet 1: Approach to the Evaluation of the Patient",
        "page_ref": 10,
        "topic_ar": "أسباب تأخر بزوغ الأسنان",
        "topic_en": "Causes of Delayed Tooth Eruption",
        "type": "past_exam",
        "source": "past_exam",
        "tags": [
            "Delayed eruption",
            "Malposed tooth",
            "Cysts",
            "Tumors"
        ],
        "text_ar": "الأسنان المعوجة أو المنزاحة (Mal-posed tooth)، والأكياس والأورام قد تسبب:",
        "text_en": "Mal-posed tooth, cysts & tumours may cause:",
        "options_ar": [
            "طعم كريه بالفم (Bad taste)",
            "جفاف الفم (Dry mouth)",
            "تأخر بزوغ الأسنان (Delayed tooth eruption)",
            "لا شيء مما سبق (None of the above)"
        ],
        "options_en": [
            "Bad taste",
            "Dry mouth",
            "Delayed tooth eruption",
            "None of the above"
        ],
        "correct_index": 2,
        "answer_ar": "الإجابة المعتمدة: C. تأخر بزوغ الأسنان (Delayed tooth eruption)\n\nمرجع الشيت (صفحات 9–10):\n«7. Delayed tooth eruption — e.g. Malposed tooth / Cysts / Maldevelopment / Tumors / Odontomas»\nالأسنان المنزاحة والأكياس والأورام والأودنتوما تُعد من العوائق الفيزيائية والموضعية التي تسبب تأخر بزوغ السن في الفك.",
        "answer_en": "Correct Answer: C. Delayed tooth eruption\n\nSheet Reference (Pages 9–10):\n\"7. Delayed tooth eruption — e.g. Malposed tooth / Cysts / Maldevelopment / Tumors / Odontomas\"\nPhysical obstructions like malposed teeth, cysts, tumors, and odontomas cause delayed eruption.",
        "quote_ref": "7. Delayed tooth eruption — e.g. Malposed tooth / Cysts / Maldevelopment / Tumors / Odontomas"
    },
    {
        "id": "q_omdr_09",
        "subject_id": "omdr",
        "subject_name_ar": "طب الفم والتشخيص والأشعة 1",
        "subject_name_en": "Oral Medicine, Diagnosis and Radiology I",
        "sheet_id": "sh_admin_1789462201436",
        "sheet_title_ar": "الشيت 1: تقييم وفحص المريض",
        "sheet_title_en": "Sheet 1: Approach to the Evaluation of the Patient",
        "page_ref": 11,
        "topic_ar": "أسباب البخر ورائحة الفم الكريهة",
        "topic_en": "Causes of Halitosis",
        "type": "past_exam",
        "source": "past_exam",
        "tags": [
            "Halitosis",
            "Diabetes",
            "Periodontal",
            "Decayed teeth"
        ],
        "text_ar": "رائحة الفم الكريهة (Halitosis) تُعد سمة تشخيصية إكلينيكية لـ:",
        "text_en": "Halitosis is a clinical diagnostic feature of:",
        "options_ar": [
            "داء السكري (Diabetes mellitus)",
            "أمراض الأنسجة الداعمة واللثة (Periodontal diseases)",
            "الأسنان المسوسة (Decayed teeth)",
            "جميع ما سبق (All of the above)"
        ],
        "options_en": [
            "Diabetes mellitus",
            "Periodontal diseases",
            "Decayed teeth",
            "All of the above"
        ],
        "correct_index": 3,
        "answer_ar": "الإجابة المعتمدة: D. جميع ما سبق (All of the above)\n\nمرجع الشيت (صفحة 11):\nمذكورة مباشرة تحت البند: «8. Halitosis — e.g.»:\n• Periodontal disease (الخيار B)\n• Diabetes (الخيار A)\n• Decayed teeth (الخيار C)\nلذا فإن جميع الحالات المذكورة تُعد أسباباً سريرية للبخر الفموي.",
        "answer_en": "Correct Answer: D. All of the above\n\nSheet Reference (Page 11):\nListed directly under \"8. Halitosis — e.g.\":\n• Periodontal disease (Option B)\n• Diabetes (Option A)\n• Decayed teeth (Option C)\nAll listed conditions present with halitosis.",
        "quote_ref": "8. Halitosis — e.g.: • Periodontal disease • Diabetes • Decayed teeth"
    }
];
  }

  getDefaultFlashcards() {
    return [];
  }

  getDefaultSheets() {
    return [
    {
        "id": "sh_admin_1789462201436",
        "subject_id": "omdr",
        "title": "Sheet 1: Approach to the Evaluation of the Patient",
        "title_ar": "الشيت 1: تقييم وفحص المريض",
        "title_en": "Sheet 1: Approach to the Evaluation of the Patient",
        "doctor_name": "د عبدالعظيم قداد",
        "doctor": "د عبدالعظيم قداد",
        "pages": 12,
        "pages_count": 12,
        "order_index": 1,
        "pdf_url": "https://vqrpodmnzubpcsvqohwj.supabase.co/storage/v1/object/public/pdf-sheets/sheets/sh_admin_1789462201436_1789687054748.pdf",
        "download_url": "https://vqrpodmnzubpcsvqohwj.supabase.co/storage/v1/object/public/pdf-sheets/sheets/sh_admin_1789462201436_1789687054748.pdf",
        "pdf_source": "cloud",
        "date": "2026-09-15"
    },
    {
        "id": "sh_cons_dentin_pulp",
        "subject_id": "cons-endo",
        "title": "Sheet 1: Dentin-Pulp Complex",
        "title_ar": "الشيت 1: معقد العاج واللب (Dentin-Pulp Complex)",
        "title_en": "Sheet 1: Dentin-Pulp Complex",
        "doctor_name": "د. آمال كشلاف",
        "doctor": "د. آمال كشلاف",
        "pages": 23,
        "pages_count": 23,
        "order_index": 1,
        "size": "1.7 MB",
        "pdf_url": "data/sheets/dentin-pulp-complex.pdf",
        "download_url": "data/sheets/dentin-pulp-complex.pdf",
        "pdf_source": "local",
        "date": "2026-09-23"
    }
];
  }

  exportSheetsJson() {
    const deleted = this.getDeletedSheetIds();
    const activeSheets = (this.sheets || []).filter(s => !deleted.includes(s.id));
    return JSON.stringify({ sheets: activeSheets }, null, 2);
  }

  getDefaultAlerts() {
    return [
      {
        id: 'alt_2026_01',
        type: 'urgent',
        badge_ar: 'هام جداً • تأجيل وتسجيل',
        badge_en: 'Urgent • Registration & Schedule',
        title_ar: 'إعلان هام لطلبة الدفعة 33 والطلبة التكميلي (تأجيل الامتحانات وتجديد القيد)',
        title_en: 'Important Notice for Batch 33 & Complementary Students',
        date: '2026-09-11',
        time: '07:39 PM',
        cover: 'assets/icons/faculty_logo.png',
        content_ar: '1. تمت الموافقة على دخول جميع الطلبة (دفعة 33 أو تكميلي) للامتحانات دون استثناء (مقرر واحد أو أكثر).\n2. تأجيل بداية امتحانات الدور الثاني إلى يوم الاثنين 21/09/2026.\n3. تجديد القيد للطلبة التكميلي خلال أيام: الأحد 13/09، الاثنين 14/09، الثلاثاء 15/09/2026 وتجديد الاسم بمكتب الدراسة والامتحانات.\nتنبيه: لن يُسمح بدخول الامتحان لأي طالب تكميلي ما لم يجدد قيده ويسجل اسمه.',
        publisher_ar: 'قسم الدراسة والامتحانات – كلية طب وجراحة الفم والأسنان، جامعة طرابلس'
      },
      {
        id: 'alt_2026_02',
        type: 'exam',
        badge_ar: 'امتحانات • السنة الرابعة',
        badge_en: 'Exams • Year 4',
        title_ar: 'جدول الامتحانات النهائية للدور الثاني لطلبة السنة الرابعة (2025 / 2026)',
        title_en: 'Final Exams Schedule - 2nd Round (Year 4, 2025/2026)',
        date: '2026-09-11',
        time: '07:39 PM',
        cover: 'assets/icons/faculty_logo.png',
        content_ar: 'تعلن الكلية عن مواعيد الامتحانات النهائية للدور الثاني لطلبة السنة الرابعة.\n• موعد الامتحان: من الساعة 09:00 صباحاً إلى 12:00 ظهراً.\n• المكان: تحت المسرح.\nيرجى الالتزام بالحضور قبل بداية الامتحان بوقت كافٍ.',
        publisher_ar: 'قسم الدراسة والامتحانات – كلية طب وجراحة الفم والأسنان، جامعة طرابلس'
      },
      {
        id: 'alt_2026_03',
        type: 'link',
        badge_ar: 'موقع رسمي • بوابة الطلبة',
        badge_en: 'Official Portal • Students',
        title_ar: 'إطلاق الصفحة الإلكترونية الرسمية للطلبة (tables.dentaluot.com)',
        title_en: 'Launch of Official Student Web Portal (tables.dentaluot.com)',
        date: '2026-09-11',
        time: '07:39 PM',
        cover: 'assets/icons/faculty_logo.png',
        content_ar: 'تم إطلاق الصفحة الإلكترونية الرسمية للاطلاع على الجداول الدراسية، الخطة الدراسية، النتائج، وجداول الامتحانات.\n🔗 رابط الدخول المباشر: http://tables.dentaluot.com\nيرجى اعتماد الصفحة كمصدر رسمي للمعلومات الأكاديمية.',
        publisher_ar: 'د. زياد محمد نصر (رئيس قسم الدراسة والامتحانات) – كلية طب وجراحة الفم والأسنان، جامعة طرابلس',
        url: 'http://tables.dentaluot.com'
      },
      {
        id: 'alt_2026_04',
        type: 'plan',
        badge_ar: 'الخطة الدراسية • 2026 / 2027',
        badge_en: 'Academic Plan • 2026 / 2027',
        title_ar: 'الخطة الدراسية الرسمية للعام الجامعي 2026 / 2027',
        title_en: 'Official Academic Plan for Year 2026 / 2027',
        date: '2026-09-11',
        time: '07:39 PM',
        cover: 'assets/icons/faculty_logo.png',
        content_ar: 'تنشر الكلية الخطة الدراسية المتضمنة مواعيد الدراسة والامتحانات والمراجعة الموضوعية وإعلان النتائج للعام 2026 / 2027.\nملاحظة: المواعيد المرتبطة بالمناسبات الهجرية تخضع لما يصدر عن الجهات الرسمية.',
        publisher_ar: 'قسم الدراسة والامتحانات – كلية طب وجراحة الفم والأسنان، جامعة طرابلس'
      }
    ];
  }
}

window.DATA = new DataService();

/**
 * IndexedDB PDF Storage Engine
 * Stores PDF files locally as ArrayBuffers in IndexedDB for offline access.
 * Supports up to ~50MB+ per origin (far exceeding localStorage limits).
 */
class PdfStore {
  constructor() {
    this.dbName = 'kf_pdf_store';
    this.storeName = 'pdfs';
    this.dbVersion = 1;
    this._db = null;
  }

  async _getDB() {
    if (this._db) return this._db;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'sheetId' });
        }
      };
      request.onsuccess = (e) => {
        this._db = e.target.result;
        resolve(this._db);
      };
      request.onerror = (e) => {
        console.warn('PdfStore: IndexedDB open error', e);
        reject(e);
      };
    });
  }

  /**
   * Save a PDF file for a sheet
   * @param {string} sheetId
   * @param {File} file - The PDF File object
   * @returns {Promise<boolean>}
   */
  async savePdf(sheetId, file) {
    try {
      const db = await this._getDB();
      const arrayBuffer = await file.arrayBuffer();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        store.put({
          sheetId: sheetId,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          data: arrayBuffer,
          savedAt: new Date().toISOString()
        });
        tx.oncomplete = () => resolve(true);
        tx.onerror = (e) => { console.warn('PdfStore savePdf error', e); reject(e); };
      });
    } catch (e) {
      console.warn('PdfStore savePdf failed:', e);
      return false;
    }
  }

  /**
   * Get a Blob URL for a stored PDF
   * @param {string} sheetId
   * @returns {Promise<string|null>} Blob URL or null
   */
  async getPdfUrl(sheetId) {
    try {
      const db = await this._getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.storeName, 'readonly');
        const store = tx.objectStore(this.storeName);
        const request = store.get(sheetId);
        request.onsuccess = () => {
          const result = request.result;
          if (result && result.data) {
            const blob = new Blob([result.data], { type: result.fileType || 'application/pdf' });
            resolve(URL.createObjectURL(blob));
          } else {
            resolve(null);
          }
        };
        request.onerror = () => resolve(null);
      });
    } catch (e) {
      return null;
    }
  }

  /**
   * Get PDF metadata (name, size) without loading the full file
   * @param {string} sheetId
   * @returns {Promise<object|null>}
   */
  async getPdfMeta(sheetId) {
    try {
      const db = await this._getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(this.storeName, 'readonly');
        const store = tx.objectStore(this.storeName);
        const request = store.get(sheetId);
        request.onsuccess = () => {
          const result = request.result;
          if (result) {
            resolve({ fileName: result.fileName, fileSize: result.fileSize, savedAt: result.savedAt });
          } else {
            resolve(null);
          }
        };
        request.onerror = () => resolve(null);
      });
    } catch (e) {
      return null;
    }
  }

  /**
   * Check if a PDF is stored for a sheet
   * @param {string} sheetId
   * @returns {Promise<boolean>}
   */
  async hasPdf(sheetId) {
    const meta = await this.getPdfMeta(sheetId);
    return !!meta;
  }

  /**
   * Delete a stored PDF
   * @param {string} sheetId
   * @returns {Promise<boolean>}
   */
  async deletePdf(sheetId) {
    try {
      const db = await this._getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        store.delete(sheetId);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    } catch (e) {
      return false;
    }
  }
}

window.DATA.pdfStore = new PdfStore();

/**
 * IndexedDB Audio Storage Engine
 * Stores large audio files locally as ArrayBuffers in IndexedDB.
 */
class AudioStore {
  constructor() {
    this.dbName = 'kf_audio_store';
    this.storeName = 'audios';
    this.dbVersion = 1;
    this._db = null;
  }

  async _getDB() {
    if (this._db) return this._db;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'recordingId' });
        }
      };
      request.onsuccess = (e) => {
        this._db = e.target.result;
        resolve(this._db);
      };
      request.onerror = (e) => {
        console.warn('AudioStore: IndexedDB open error', e);
        reject(e);
      };
    });
  }

  async saveAudio(recordingId, file) {
    try {
      const db = await this._getDB();
      const arrayBuffer = await file.arrayBuffer();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        store.put({
          recordingId: recordingId,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          data: arrayBuffer,
          savedAt: new Date().toISOString()
        });
        tx.oncomplete = () => resolve(true);
        tx.onerror = (e) => { console.warn('AudioStore saveAudio error', e); reject(e); };
      });
    } catch (e) {
      console.warn('AudioStore saveAudio failed:', e);
      return false;
    }
  }

  async getAudioUrl(recordingId) {
    try {
      const db = await this._getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.storeName, 'readonly');
        const store = tx.objectStore(this.storeName);
        const request = store.get(recordingId);
        request.onsuccess = () => {
          const result = request.result;
          if (result && result.data) {
            const blob = new Blob([result.data], { type: result.fileType || 'audio/mpeg' });
            resolve(URL.createObjectURL(blob));
          } else {
            resolve(null);
          }
        };
        request.onerror = () => resolve(null);
      });
    } catch (e) {
      return null;
    }
  }

  async hasAudio(recordingId) {
    try {
      const db = await this._getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(this.storeName, 'readonly');
        const store = tx.objectStore(this.storeName);
        const request = store.get(recordingId);
        request.onsuccess = () => {
          resolve(!!request.result);
        };
        request.onerror = () => resolve(false);
      });
    } catch (e) {
      return false;
    }
  }

  async deleteAudio(recordingId) {
    try {
      const db = await this._getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        store.delete(recordingId);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    } catch (e) {
      return false;
    }
  }
}

window.DATA.audioStore = new AudioStore();

/**
 * Modern Empty State UI Helper
 * Renders consistent empty state card across platform
 */
window.renderEmptyState = function(customTitle, customSubtitle, icon = 'folder-open') {
  const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
  const title = customTitle || (isAr ? 'لا توجد محتويات مضافة حالياً' : 'No contents available yet');
  const subtitle = customSubtitle || (isAr ? 'جاري رفع واستكمال المحتوى الأكاديمي المعتمد من الكلية.' : 'Handouts and academic curriculum materials will be uploaded soon.');

  return `
    <div class="kf-panel" style="text-align: center; padding: 42px 24px; max-width: 560px; margin: 30px auto; border-radius: 14px;">
      <div style="width: 52px; height: 52px; margin: 0 auto 16px; border-radius: 12px; background: rgba(2, 132, 199, 0.08); border: 1px solid rgba(2, 132, 199, 0.2); display: flex; align-items: center; justify-content: center; color: var(--brand-accent);">
        <i data-lucide="${icon}" style="width: 24px; height: 24px;"></i>
      </div>
      <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-bottom: 6px;">${title}</h3>
      <p style="font-size: 0.835rem; color: var(--text-secondary); max-width: 440px; margin: 0 auto 20px; line-height: 1.55;">${subtitle}</p>
      <div style="display: flex; justify-content: center; gap: 10px;">
        <a href="#/sheets" class="btn btn-primary btn-sm" style="font-weight: 700; gap: 6px; padding: 7px 16px;">
          <i data-lucide="file-text" style="width: 14px; height: 14px;"></i>
          <span>${isAr ? 'تصفح الشيتات المتاحة' : 'Browse Sheets'}</span>
        </a>
        <a href="#/" class="btn btn-secondary btn-sm" style="font-weight: 600; padding: 7px 16px;">
          <span>${isAr ? 'الرئيسية' : 'Home'}</span>
        </a>
      </div>
    </div>
  `;
};
