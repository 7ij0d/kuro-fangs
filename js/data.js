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
    this.recordings = this.getDefaultRecordings();
    this.questions = this.getDefaultQuestions();
    this.flashcards = this.getDefaultFlashcards();

    // 2. Merge cached cloud sheets & local custom admin sheets instantly
    try {
      const obsoleteIds = ['sh_omdr_patient_evaluation_01', 'sh_cons_dentin_pulp', 'sh-fixed-provisional', 'sh_admin_1789336010378', 'sh-omdr-01'];
      ['kf_cloud_cached_sheets', 'kf_admin_custom_sheets'].forEach(k => {
        try {
          const raw = localStorage.getItem(k);
          if (raw) {
            let parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              const cleaned = parsed.filter(s => s && !obsoleteIds.includes(s.id) && !(s.title || '').toLowerCase().includes('provisional'));
              if (cleaned.length !== parsed.length) {
                localStorage.setItem(k, JSON.stringify(cleaned));
              }
            }
          }
        } catch (err) {}
      });
      if (this.pdfStore && typeof this.pdfStore.deletePdf === 'function') {
        obsoleteIds.forEach(id => this.pdfStore.deletePdf(id).catch(() => {}));
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
    if (!this.subjects || this.subjects.length === 0) {
      this.subjects = this.getDefaultSubjects();
      this.subjects.forEach(s => {
        s.cover_image = s.cover_image || this.subjectCovers[s.id] || `assets/covers/${s.id}.webp`;
      });
    }
    return this.subjects;
  }

  getSubjectById(id) {
    const list = this.getSubjects();
    return list.find(s => s.id === id);
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

  getSheetById(sheetId) {
    if (!sheetId) return null;
    const deleted = this.getDeletedSheetIds();
    if (deleted.includes(sheetId)) return null;
    return (this.sheets || []).find(s => s && s.id === sheetId) || null;
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

  getQuestionsBySheet(sheetId) {
    if (!sheetId) return [];
    if (!this._deferredLoaded && !this._deferredLoading) {
      this.loadDeferredData();
    }
    return (this.questions || []).filter(q => q.sheet_id === sheetId);
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
    const deleted = this.getDeletedSheetIds();
    if (deleted.includes(sheetId)) return [];
    return (this.recordings || []).filter(r => r.sheet_id === sheetId);
  }

  getQuestionsBySheet(sheetId) {
    if (!sheetId) return [];
    const deleted = this.getDeletedSheetIds();
    if (deleted.includes(sheetId)) return [];
    if (!this._deferredLoaded && !this._deferredLoading) {
      this.loadDeferredData();
    }
    return (this.questions || []).filter(q => q.sheet_id === sheetId);
  }

  getNotesBySheet(sheetId) {
    if (!sheetId) return '';
    try {
      return localStorage.getItem(`kf_sheet_notes_${sheetId}`) || '';
    } catch (e) {
      return '';
    }
  }

  saveNotesForSheet(sheetId, content) {
    if (!sheetId) return false;
    try {
      localStorage.setItem(`kf_sheet_notes_${sheetId}`, content || '');
      return true;
    } catch (e) {
      return false;
    }
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
    "sheet_id": "sh_omdr_patient_evaluation_01",
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
    "quote_ref": "3. Spot (snap) diagnosis: It is simple cases where rapid diagnosis can be achieved perfectly, based on minimal data.",
    "source_reference": {
      "id": "ref_q_omdr_01_1",
      "question_id": "q_omdr_01",
      "sheet_id": "sh_omdr_patient_evaluation_01",
      "page_number": 4,
      "source_type": "exact",
      "source_text": "3. Spot (snap) diagnosis: It is simple cases where rapid diagnosis can be achieved perfectly, based on minimal data.",
      "source_text_normalized": "3 spot snap diagnosis it is simple cases where rapid diagnosis can be achieved perfectly based on minimal data",
      "text_anchor": "3. Spot (snap) diagnosis: It is simple cases where rapid dia",
      "bounding_box": null,
      "confidence": 0.95,
      "verification_status": "verified"
    }
  },
  {
    "id": "q_omdr_02",
    "subject_id": "omdr",
    "subject_name_ar": "طب الفم والتشخيص والأشعة 1",
    "subject_name_en": "Oral Medicine, Diagnosis and Radiology I",
    "sheet_id": "sh_omdr_patient_evaluation_01",
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
    "quote_ref": "4. Differential diagnosis: It is the collection of data to develop a list of two or more different diseases having common primary clinical presentation.",
    "source_reference": {
      "id": "ref_q_omdr_02_1",
      "question_id": "q_omdr_02",
      "sheet_id": "sh_omdr_patient_evaluation_01",
      "page_number": 4,
      "source_type": "exact",
      "source_text": "4. Differential diagnosis: It is the collection of data to develop a list of two or more different diseases having common primary clinical presentation.",
      "source_text_normalized": "4 differential diagnosis it is the collection of data to develop a list of two or more different diseases having common primary clinical presentation",
      "text_anchor": "4. Differential diagnosis: It is the collection of data to d",
      "bounding_box": null,
      "confidence": 0.95,
      "verification_status": "verified"
    }
  },
  {
    "id": "q_omdr_03",
    "subject_id": "omdr",
    "subject_name_ar": "طب الفم والتشخيص والأشعة 1",
    "subject_name_en": "Oral Medicine, Diagnosis and Radiology I",
    "sheet_id": "sh_omdr_patient_evaluation_01",
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
    "quote_ref": "4. Differential diagnosis: It is the collection of data to develop a list of two or more different diseases having common primary clinical presentation. (Note: The most likely lesion is put on the top of the list according to clinical impression).",
    "source_reference": {
      "id": "ref_q_omdr_03_1",
      "question_id": "q_omdr_03",
      "sheet_id": "sh_omdr_patient_evaluation_01",
      "page_number": 4,
      "source_type": "exact",
      "source_text": "4. Differential diagnosis: It is the collection of data to develop a list of two or more different diseases having common primary clinical presentation. (Note: The most likely lesion is put on the top of the list according to clinical impression).",
      "source_text_normalized": "4 differential diagnosis it is the collection of data to develop a list of two or more different diseases having common primary clinical presentation note the most likely lesion is put on the top of the list according to clinical impression",
      "text_anchor": "4. Differential diagnosis: It is the collection of data to d",
      "bounding_box": null,
      "confidence": 0.95,
      "verification_status": "verified"
    }
  },
  {
    "id": "q_omdr_04",
    "subject_id": "omdr",
    "subject_name_ar": "طب الفم والتشخيص والأشعة 1",
    "subject_name_en": "Oral Medicine, Diagnosis and Radiology I",
    "sheet_id": "sh_omdr_patient_evaluation_01",
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
    "quote_ref": "The chief complaint affected by: • Patient memory. • The age of the patient. • The mental attitude and personality of patient. • The prestige of the dentist.",
    "source_reference": {
      "id": "ref_q_omdr_04_1",
      "question_id": "q_omdr_04",
      "sheet_id": "sh_omdr_patient_evaluation_01",
      "page_number": 8,
      "source_type": "exact",
      "source_text": "The chief complaint affected by: • Patient memory. • The age of the patient. • The mental attitude and personality of patient. • The prestige of the dentist.",
      "source_text_normalized": "the chief complaint affected by patient memory the age of the patient the mental attitude and personality of patient the prestige of the dentist",
      "text_anchor": "The chief complaint affected by: • Patient memory. • The age",
      "bounding_box": null,
      "confidence": 0.95,
      "verification_status": "verified"
    }
  },
  {
    "id": "q_omdr_05",
    "subject_id": "omdr",
    "subject_name_ar": "طب الفم والتشخيص والأشعة 1",
    "subject_name_en": "Oral Medicine, Diagnosis and Radiology I",
    "sheet_id": "sh_omdr_patient_evaluation_01",
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
    "quote_ref": "The most common chief complaint: 1. Pain — which may be: Somatic / Neurogenic / Psychogenic",
    "source_reference": {
      "id": "ref_q_omdr_05_1",
      "question_id": "q_omdr_05",
      "sheet_id": "sh_omdr_patient_evaluation_01",
      "page_number": 8,
      "source_type": "exact",
      "source_text": "The most common chief complaint: 1. Pain — which may be: Somatic / Neurogenic / Psychogenic",
      "source_text_normalized": "the most common chief complaint 1 pain which may be somatic neurogenic psychogenic",
      "text_anchor": "The most common chief complaint: 1. Pain — which may be: Som",
      "bounding_box": null,
      "confidence": 0.95,
      "verification_status": "verified"
    }
  },
  {
    "id": "q_omdr_06",
    "subject_id": "omdr",
    "subject_name_ar": "طب الفم والتشخيص والأشعة 1",
    "subject_name_en": "Oral Medicine, Diagnosis and Radiology I",
    "sheet_id": "sh_omdr_patient_evaluation_01",
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
    "quote_ref": "Burning sensation — e.g.: Fungal infection / Viral infection / Bacterial infection / Fissured tongue / Geographic tongue / Anemia / Coating atrophy of tongue / Vitamin deficiency / Xerostomia condition",
    "source_reference": {
      "id": "ref_q_omdr_06_1",
      "question_id": "q_omdr_06",
      "sheet_id": "sh_omdr_patient_evaluation_01",
      "page_number": 9,
      "source_type": "exact",
      "source_text": "Burning sensation — e.g.: Fungal infection / Viral infection / Bacterial infection / Fissured tongue / Geographic tongue / Anemia / Coating atrophy of tongue / Vitamin deficiency / Xerostomia condition",
      "source_text_normalized": "burning sensation e g fungal infection viral infection bacterial infection fissured tongue geographic tongue anemia coating atrophy of tongue vitamin deficiency xerostomia condition",
      "text_anchor": "Burning sensation — e.g.: Fungal infection / Viral infection",
      "bounding_box": null,
      "confidence": 0.95,
      "verification_status": "verified"
    }
  },
  {
    "id": "q_omdr_07",
    "subject_id": "omdr",
    "subject_name_ar": "طب الفم والتشخيص والأشعة 1",
    "subject_name_en": "Oral Medicine, Diagnosis and Radiology I",
    "sheet_id": "sh_omdr_patient_evaluation_01",
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
    "quote_ref": "Dry mouth — e.g.: 1. Drug therapy 2. Sjogren's syndrome 3. Post-radiation therapy 4. Chemotherapy 5. Mikulicz's disease",
    "source_reference": {
      "id": "ref_q_omdr_07_1",
      "question_id": "q_omdr_07",
      "sheet_id": "sh_omdr_patient_evaluation_01",
      "page_number": 9,
      "source_type": "exact",
      "source_text": "Dry mouth — e.g.: 1. Drug therapy 2. Sjogren's syndrome 3. Post-radiation therapy 4. Chemotherapy 5. Mikulicz's disease",
      "source_text_normalized": "dry mouth e g 1 drug therapy 2 sjogren s syndrome 3 post radiation therapy 4 chemotherapy 5 mikulicz s disease",
      "text_anchor": "Dry mouth — e.g.: 1. Drug therapy 2. Sjogren's syndrome 3. P",
      "bounding_box": null,
      "confidence": 0.95,
      "verification_status": "verified"
    }
  },
  {
    "id": "q_omdr_08",
    "subject_id": "omdr",
    "subject_name_ar": "طب الفم والتشخيص والأشعة 1",
    "subject_name_en": "Oral Medicine, Diagnosis and Radiology I",
    "sheet_id": "sh_omdr_patient_evaluation_01",
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
    "quote_ref": "7. Delayed tooth eruption — e.g. Malposed tooth / Cysts / Maldevelopment / Tumors / Odontomas",
    "source_reference": {
      "id": "ref_q_omdr_08_1",
      "question_id": "q_omdr_08",
      "sheet_id": "sh_omdr_patient_evaluation_01",
      "page_number": 10,
      "source_type": "exact",
      "source_text": "7. Delayed tooth eruption — e.g. Malposed tooth / Cysts / Maldevelopment / Tumors / Odontomas",
      "source_text_normalized": "7 delayed tooth eruption e g malposed tooth cysts maldevelopment tumors odontomas",
      "text_anchor": "7. Delayed tooth eruption — e.g. Malposed tooth / Cysts / Ma",
      "bounding_box": null,
      "confidence": 0.95,
      "verification_status": "verified"
    }
  },
  {
    "id": "q_omdr_09",
    "subject_id": "omdr",
    "subject_name_ar": "طب الفم والتشخيص والأشعة 1",
    "subject_name_en": "Oral Medicine, Diagnosis and Radiology I",
    "sheet_id": "sh_omdr_patient_evaluation_01",
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
    "quote_ref": "8. Halitosis — e.g.: • Periodontal disease • Diabetes • Decayed teeth",
    "source_reference": {
      "id": "ref_q_omdr_09_1",
      "question_id": "q_omdr_09",
      "sheet_id": "sh_omdr_patient_evaluation_01",
      "page_number": 11,
      "source_type": "exact",
      "source_text": "8. Halitosis — e.g.: • Periodontal disease • Diabetes • Decayed teeth",
      "source_text_normalized": "8 halitosis e g periodontal disease diabetes decayed teeth",
      "text_anchor": "8. Halitosis — e.g.: • Periodontal disease • Diabetes • Deca",
      "bounding_box": null,
      "confidence": 0.95,
      "verification_status": "verified"
    }
  },
  {
    "id": "q_cons_01",
    "subject_id": "cons-endo",
    "subject_name_ar": "العلاج التحفظي 2",
    "subject_name_en": "Cons & Endo II",
    "sheet_id": "sh_cons_dentin_pulp_01",
    "sheet_title_ar": "الشيت 1: معقد العاج واللب (Dentin-Pulp Complex)",
    "sheet_title_en": "Sheet 1: Dentin-Pulp Complex",
    "page_ref": 4,
    "topic_ar": "تركيب العاج والنسبة العضوية",
    "topic_en": "Dentin Composition & Organic Matrix",
    "type": "past_exam",
    "source": "past_exam",
    "tags": [
      "Dentin",
      "Composition",
      "Collagen"
    ],
    "text_ar": "ما هو المكون العضوي الأساسي الذي يُشكل الجزء الأكبر من المادة العضوية (20%) في نسيج العاج (Dentin)؟",
    "text_en": "What is the primary organic component forming the bulk of the 20% organic substances in dentin tissue?",
    "options_ar": [
      "كولاجين النوع الأول (Type I collagen)",
      "كولاجين النوع الثاني (Type II collagen)",
      "أمورفوس فوسفات الكالسيوم (Amorphous calcium phosphate)",
      "كيراتين صلب (Hard keratin)"
    ],
    "options_en": [
      "Type I collagen",
      "Type II collagen",
      "Amorphous calcium phosphate",
      "Hard keratin"
    ],
    "correct_index": 0,
    "answer_ar": "الإجابة المعتمدة: A. كولاجين النوع الأول (Type I collagen)\n\nمرجع الشيت (صفحة 4):\n«Dentin composition: 70% inorganic hydroxyapatite crystals. 20% organic substances (Type I collagen). 10% water.»\nتتكون المادة العضوية في العاج بنسبة 20% وأغلبها من ألياف كولاجين النوع الأول Type I collagen مما يمنحه مرونة أكثر من المينا.",
    "answer_en": "Correct Answer: A. Type I collagen\n\nSheet Reference (Page 4):\n\"Dentin composition: 70% inorganic hydroxyapatite crystals. 20% organic substances (Type I collagen). 10% water.\"\nType I collagen provides dentin with high resilience compared to brittle enamel.",
    "quote_ref": "Dentin composition: 70% inorganic hydroxyapatite crystals. 20% organic substances (Type I collagen). 10% water.",
    "source_reference": {
      "id": "ref_q_cons_01_1",
      "question_id": "q_cons_01",
      "sheet_id": "sh_cons_dentin_pulp_01",
      "page_number": 4,
      "source_type": "exact",
      "source_text": "Dentin composition: 70% inorganic hydroxyapatite crystals. 20% organic substances (Type I collagen). 10% water.",
      "source_text_normalized": "dentin composition 70 inorganic hydroxyapatite crystals 20 organic substances type i collagen 10 water",
      "text_anchor": "Dentin composition: 70% inorganic hydroxyapatite crystals. 2",
      "bounding_box": null,
      "confidence": 0.95,
      "verification_status": "verified"
    }
  },
  {
    "id": "q_cons_02",
    "subject_id": "cons-endo",
    "subject_name_ar": "العلاج التحفظي 2",
    "subject_name_en": "Cons & Endo II",
    "sheet_id": "sh_cons_dentin_pulp_01",
    "sheet_title_ar": "الشيت 1: معقد العاج واللب (Dentin-Pulp Complex)",
    "sheet_title_en": "Sheet 1: Dentin-Pulp Complex",
    "page_ref": 16,
    "topic_ar": "الألياف العصبية في اللب ونوع الألم",
    "topic_en": "Pulpal Nerve Fibers & Pain Types",
    "type": "past_exam",
    "source": "past_exam",
    "tags": [
      "Pulp Innervation",
      "A-delta fibers",
      "C fibers"
    ],
    "text_ar": "أي من الألياف العصبية التالية تقع سطحياً في لب السن وتتميز بسرعة توصيل عالية وتكون مسؤولة عن الألم الحاد الموضعي (Sharp localized dentinal pain)؟",
    "text_en": "Which pulpal nerve fibers lie superficially, have faster conduction velocity, and are responsible for sharp localized dentinal pain?",
    "options_ar": [
      "ألياف C البطيئة (C fibers)",
      "ألياف A-دلتا (A-delta fibers)",
      "ألياف بافيني العصبية (Ruffini fibers)",
      "ألياف كولاجينية غير مايلينية (Non-myelinated collagen fibers)"
    ],
    "options_en": [
      "C fibers",
      "A-delta fibers",
      "Ruffini fibers",
      "Non-myelinated collagen fibers"
    ],
    "correct_index": 1,
    "answer_ar": "الإجابة المعتمدة: B. ألياف A-دلتا (A-delta fibers)\n\nمرجع الشيت (صفحة 16):\n«A delta fibers are faster in conduction and are responsible for sharp localized dentinal pain. In contrast, C fibers are slower in conduction and are responsible for dull and throbbing pain.»\nألياف A تقع سطحياً وتوصل الإحساس بالألم الحاد والموضعي سريعاً.",
    "answer_en": "Correct Answer: B. A-delta fibers\n\nSheet Reference (Page 16):\n\"A delta fibers are faster in conduction and are responsible for sharp localized dentinal pain. C fibers are slower in conduction and are responsible for dull and throbbing pain.\"",
    "quote_ref": "A delta fibers are faster in conduction and are responsible for sharp localized dentinal pain.",
    "source_reference": {
      "id": "ref_q_cons_02_1",
      "question_id": "q_cons_02",
      "sheet_id": "sh_cons_dentin_pulp_01",
      "page_number": 16,
      "source_type": "exact",
      "source_text": "A delta fibers are faster in conduction and are responsible for sharp localized dentinal pain.",
      "source_text_normalized": "a delta fibers are faster in conduction and are responsible for sharp localized dentinal pain",
      "text_anchor": "A delta fibers are faster in conduction and are responsible ",
      "bounding_box": null,
      "confidence": 0.95,
      "verification_status": "verified"
    }
  },
  {
    "id": "q_prev_01",
    "subject_id": "preventive",
    "subject_name_ar": "طب الأسنان الوقائي 1",
    "subject_name_en": "Preventive Dentistry I",
    "sheet_id": "sh_prev_dental_caries_02",
    "sheet_title_ar": "المحاضرة 2: تسوس الأسنان والنظريات الحديثة للأسباب (Dental Caries)",
    "sheet_title_en": "Lecture 2: Dental Caries & Current Concepts of Etiology",
    "page_ref": 3,
    "topic_ar": "الفروق السريرية بين تسوس الرضاعة والتسوس المتفشي",
    "topic_en": "Nursing Caries vs Rampant Caries",
    "type": "past_exam",
    "source": "past_exam",
    "tags": [
      "Nursing Bottle Caries",
      "Rampant Caries",
      "Mandibular Incisors"
    ],
    "text_ar": "ما هي السمة السريرية الفارقة الأكثر تمييزاً لتسوس الرضاعة (Nursing Bottle Caries) عند مقارنته بالتسوس المتفشي (Rampant Caries)؟",
    "text_en": "What is the hallmark clinical feature that distinguishes Nursing Bottle Caries from Rampant Caries regarding tooth involvement?",
    "options_ar": [
      "إصابة القواطع السفلية بشكل مبكر وعنيف",
      "عدم إصابة القواطع السفلية وسلامتها (Mandibular incisors NOT involved)",
      "اقتصاره على الأسنان الدائمة فقط دون اللبنية",
      "عدم ارتباطه بالسكريات المضافة أو العسل"
    ],
    "options_en": [
      "Early aggressive involvement of mandibular incisors",
      "Mandibular incisors are spared and NOT involved",
      "Confined exclusively to permanent dentition",
      "Not associated with added sugars or honey"
    ],
    "correct_index": 1,
    "answer_ar": "الإجابة المعتمدة: B. عدم إصابة القواطع السفلية وسلامتها (Mandibular incisors NOT involved)\n\nمرجع المحاضرة (صفحة 3):\n«Involvement of Mandibular Incisors: In Nursing Caries: Mandibular incisors are NOT involved. In Rampant Caries: Mandibular incisors ARE affected.»\nتسوس الرضاعة ينجو منه القواطع السفلية بسبب حماية اللسان وتدفق اللعاب من الغدد تحت الفك وتحت اللسان.",
    "answer_en": "Correct Answer: B. Mandibular incisors are spared and NOT involved\n\nLecture Reference (Page 3):\n\"Involvement of Mandibular Incisors: In Nursing Caries: Mandibular incisors are NOT involved. In Rampant Caries: Mandibular incisors ARE affected.\"\nMandibular incisors are protected during sucking by the tongue and saliva flow.",
    "quote_ref": "In Nursing Caries: Mandibular incisors are NOT involved. In Rampant Caries: Mandibular incisors ARE affected.",
    "source_reference": {
      "id": "ref_q_prev_01_1",
      "question_id": "q_prev_01",
      "sheet_id": "sh_prev_dental_caries_02",
      "page_number": 3,
      "source_type": "exact",
      "source_text": "In Nursing Caries: Mandibular incisors are NOT involved. In Rampant Caries: Mandibular incisors ARE affected.",
      "source_text_normalized": "in nursing caries mandibular incisors are not involved in rampant caries mandibular incisors are affected",
      "text_anchor": "In Nursing Caries: Mandibular incisors are NOT involved. In ",
      "bounding_box": null,
      "confidence": 0.95,
      "verification_status": "verified"
    }
  },
  {
    "id": "q_prev_02",
    "subject_id": "preventive",
    "subject_name_ar": "طب الأسنان الوقائي 1",
    "subject_name_en": "Preventive Dentistry I",
    "sheet_id": "sh_prev_dental_caries_02",
    "sheet_title_ar": "المحاضرة 2: تسوس الأسنان والنظريات الحديثة للأسباب (Dental Caries)",
    "sheet_title_en": "Lecture 2: Dental Caries & Current Concepts of Etiology",
    "page_ref": 5,
    "topic_ar": "ميكروبات اللويحة ومبدأ التسوس",
    "topic_en": "Plaque Microorganisms & Caries Initiation",
    "type": "past_exam",
    "source": "past_exam",
    "tags": [
      "Mutans Streptococci",
      "Lactobacilli",
      "Caries Etiology"
    ],
    "text_ar": "أي من بكتيريا الفم التالية تُعد البادئ الأساسي (Primary Initiator) لظهور نخر وتسوس الأسنان عبر إنتاج الجلوكان والتخمير السريع لحمض اللاكتيك؟",
    "text_en": "Which oral microorganism acts as the primary initiator of dental caries through extracellular glucan synthesis and rapid lactic acid fermentation?",
    "options_ar": [
      "بكتيريا العصيات اللبنية (Lactobacilli)",
      "المكورات العقدية الطافرة (Mutans Streptococci)",
      "بكتيريا الشعية الفطرية (Actinomyces viscosus)",
      "المغزلية المتقيحة (Fusobacterium nucleatum)"
    ],
    "options_en": [
      "Lactobacilli (LB)",
      "Mutans Streptococci (MS)",
      "Actinomyces viscosus",
      "Fusobacterium nucleatum"
    ],
    "correct_index": 1,
    "answer_ar": "الإجابة المعتمدة: B. المكورات العقدية الطافرة (Mutans Streptococci)\n\nمرجع المحاضرة (صفحة 5):\n«Mutans Streptococci (MS): Primary Initiator of dental caries. Produces extracellular glucans for firm tooth attachment and rapidly ferments sugars to lactic acid. Lactobacilli (LB): Secondary Continuer.»\nالمكورات العقدية الطافرة هي المبادرة للتسوس، بينما اللاكتوباسيلس مكمل ومستمر للتجويف العميق.",
    "answer_en": "Correct Answer: B. Mutans Streptococci (MS)\n\nLecture Reference (Page 5):\n\"Mutans Streptococci (MS): Primary Initiator of dental caries. Produces extracellular glucans for firm tooth attachment and rapidly ferments sugars to lactic acid. Lactobacilli (LB): Secondary Continuer.\"",
    "quote_ref": "Mutans Streptococci (MS): Primary Initiator of dental caries. Produces extracellular glucans for firm tooth attachment and rapidly ferments sugars to lactic acid.",
    "source_reference": {
      "id": "ref_q_prev_02_1",
      "question_id": "q_prev_02",
      "sheet_id": "sh_prev_dental_caries_02",
      "page_number": 5,
      "source_type": "exact",
      "source_text": "Mutans Streptococci (MS): Primary Initiator of dental caries. Produces extracellular glucans for firm tooth attachment and rapidly ferments sugars to lactic acid.",
      "source_text_normalized": "mutans streptococci ms primary initiator of dental caries produces extracellular glucans for firm tooth attachment and rapidly ferments sugars to lactic acid",
      "text_anchor": "Mutans Streptococci (MS): Primary Initiator of dental caries",
      "bounding_box": null,
      "confidence": 0.95,
      "verification_status": "verified"
    }
  },
  {
    "id": "q_path_pulp_01",
    "subject_id": "oral-diseases",
    "subject_name_ar": "أمراض الفم",
    "subject_name_en": "Oral Pathology",
    "sheet_id": "sh_oral_path_pulp_02",
    "sheet_title_ar": "المحاضرة 2: أمراض واضطرابات لب الأسنان (Disorders of Dental Pulp)",
    "sheet_title_en": "Lecture 2: Disorders of the Dental Pulp",
    "page_ref": 10,
    "topic_ar": "شروط تكون البوليب اللبي (Pulp Polyp)",
    "topic_en": "Prerequisites for Chronic Hyperplastic Pulpitis",
    "type": "past_exam",
    "source": "past_exam",
    "tags": [
      "Pulp Polyp",
      "Chronic Hyperplastic Pulpitis",
      "Apical Foramen"
    ],
    "text_ar": "أي من الشروط التالية يُعد ضرورياً وأساسياً لحدوث التهاب اللب المفرط التنسج المزمن (Chronic Hyperplastic Pulpitis / Pulp Polyp) في الأسنان؟",
    "text_en": "Which of the following prerequisites must be fulfilled for Chronic Hyperplastic Pulpitis (Pulp Polyp) to develop?",
    "options_ar": [
      "ثقب قمي ضيق ومغلق تماماً (Constricted closed apical foramen)",
      "ثقب قمي واسع مع تروية دموية ممتازة وعمر مريض صغير (Wide apical foramen, rich vascularity, young patient)",
      "تعرض اللب لانغلاق تام وعدم وجود فجوة نخرية واسعة",
      "حدوث التهاب متقدم في سن كهل أو مسن ضعيف التكاثر الخلوي"
    ],
    "options_en": [
      "Constricted closed apical foramen",
      "Wide apical foramen, excellent blood supply, and young patient",
      "Absence of open carious cavity",
      "Elderly patient with low proliferative capacity"
    ],
    "correct_index": 1,
    "answer_ar": "الإجابة المعتمدة: B. ثقب قمي واسع مع تروية دموية ممتازة وعمر مريض صغير\n\nمرجع المحاضرة (صفحة 10):\n«For pulp polyp to develop, 4 prerequisites should be fulfilled: 1) A good sheltered area. 2) A wide apical foramen for good blood supply. 3) A wide pulp exposure. 4) Young aged patient for good proliferative power.»\nالبوليب اللبي يحدث عند صغار السن في الأضراس اللبنية أو الضرس الدائم الأول لاتساع الثقب القمي ووفرة التروية الدموية.",
    "answer_en": "Correct Answer: B. Wide apical foramen, excellent blood supply, and young patient\n\nLecture Reference (Page 10):\n\"For pulp polyp to develop, 4 prerequisites should be fulfilled: 1) Sheltered area 2) Wide apical foramen for good blood supply 3) Wide pulp exposure 4) Young aged patient for good proliferative power.\"",
    "quote_ref": "For pulp polyp to develop, 4 prerequisites should be fulfilled: 1) A good sheltered area 2) A wide apical foramen for good blood supply 3) A wide pulp exposure 4) Young aged patient",
    "source_reference": {
      "id": "ref_q_path_pulp_01_1",
      "question_id": "q_path_pulp_01",
      "sheet_id": "sh_oral_path_pulp_02",
      "page_number": 10,
      "source_type": "exact",
      "source_text": "For pulp polyp to develop, 4 prerequisites should be fulfilled: 1) A good sheltered area 2) A wide apical foramen for good blood supply 3) A wide pulp exposure 4) Young aged patient",
      "source_text_normalized": "for pulp polyp to develop 4 prerequisites should be fulfilled 1 a good sheltered area 2 a wide apical foramen for good blood supply 3 a wide pulp exposure 4 young aged patient",
      "text_anchor": "For pulp polyp to develop, 4 prerequisites should be fulfill",
      "bounding_box": null,
      "confidence": 0.95,
      "verification_status": "verified"
    }
  },
  {
    "id": "q_path_pulp_02",
    "subject_id": "oral-diseases",
    "subject_name_ar": "أمراض الفم",
    "subject_name_en": "Oral Pathology",
    "sheet_id": "sh_oral_path_pulp_02",
    "sheet_title_ar": "المحاضرة 2: أمراض واضطرابات لب الأسنان (Disorders of Dental Pulp)",
    "sheet_title_en": "Lecture 2: Disorders of the Dental Pulp",
    "page_ref": 15,
    "topic_ar": "الارتشاف الداخلي للب والسن الوردي",
    "topic_en": "Internal Resorption / Pink Tooth",
    "type": "past_exam",
    "source": "past_exam",
    "tags": [
      "Internal Resorption",
      "Pink Tooth",
      "Radiographic Features"
    ],
    "text_ar": "ما هو المظهر الإشعاعي (Radiographic feature) المميز لحالات الارتشاف الداخلي للب (Internal Resorption)؟",
    "text_en": "What is the characteristic radiographic appearance of Internal Resorption in teeth?",
    "options_ar": [
      "كتلة بيضاء معتمة متكلسة ومفصولة تماماً عن اللب",
      "شفافية شعاعية متناظرة ومستديرة ومحددة المعالم متصلة بمسار اللب (Symmetrical, round, well-defined radiolucency continuous with the pulp space)",
      "تضيق كامل وتلاشي لمسار القناة الجذرية",
      "تكثف عظمي واسع محيط بذروة السن"
    ],
    "options_en": [
      "Opaque calcified mass completely separated from the pulp",
      "Symmetrical, round, well-defined radiolucency continuous with the pulp space",
      "Complete obliteration and narrowing of the root canal",
      "Diffuse condensing osteitis around the apex"
    ],
    "correct_index": 1,
    "answer_ar": "الإجابة المعتمدة: B. شفافية شعاعية متناظرة ومستديرة ومحددة المعالم متصلة بمسار اللب\n\nمرجع المحاضرة (صفحة 15):\n«Radiographically: Symmetrical, round, well defined radiolucency continuous with the pulp space. Pulp space appears enlarged; root canal outline is distorted.»\nتظهر الشفافية الشعاعية متصلة باللب مباشرة وتسبب تضخم مسار اللب وظهور بقعة وردية سريرياً (Pink Tooth) عند تآكل العاج تحت المينا.",
    "answer_en": "Correct Answer: B. Symmetrical, round, well-defined radiolucency continuous with the pulp space\n\nLecture Reference (Page 15):\n\"Radiographically: Symmetrical, round, well defined radiolucency continuous with the pulp space. Pulp space appears enlarged; root canal outline is distorted.\"",
    "quote_ref": "Radiographically: Symmetrical, round, well defined radiolucency continuous with the pulp space. Pulp space appears enlarged; root canal outline is distorted.",
    "source_reference": {
      "id": "ref_q_path_pulp_02_1",
      "question_id": "q_path_pulp_02",
      "sheet_id": "sh_oral_path_pulp_02",
      "page_number": 15,
      "source_type": "exact",
      "source_text": "Radiographically: Symmetrical, round, well defined radiolucency continuous with the pulp space. Pulp space appears enlarged; root canal outline is distorted.",
      "source_text_normalized": "radiographically symmetrical round well defined radiolucency continuous with the pulp space pulp space appears enlarged root canal outline is distorted",
      "text_anchor": "Radiographically: Symmetrical, round, well defined radioluce",
      "bounding_box": null,
      "confidence": 0.95,
      "verification_status": "verified"
    }
  },
  {
    "id": "q_oral_path_caries_01",
    "subject_id": "oral-diseases",
    "subject_name_ar": "أمراض الفم (Oral Pathology)",
    "subject_name_en": "Oral Pathology",
    "sheet_id": "sh_oral_path_caries_01",
    "sheet_title_ar": "المحاضرة 1: تسوس الأسنان (Dental Caries)",
    "sheet_title_en": "Lecture 1: Dental Caries",
    "page_ref": 2,
    "topic_ar": "تعريف ومراحل تسوس الأسنان",
    "topic_en": "Definition & Mechanism of Dental Caries",
    "type": "past_exam",
    "source": "past_exam",
    "tags": [
      "Dental Caries",
      "Demineralization",
      "Definition"
    ],
    "text_ar": "تسوس الأسنان (Dental Caries) هو مرض بكتيري يصيب الأنسجة المتكلسة للسن، ويحدث عبر مرحلتين رئيسيتين هما:",
    "text_en": "Dental caries is a bacterial disease of calcified tooth structure which occurs in two stages:",
    "options_ar": [
      "إعادة التمعدن للأنسجة غير العضوية متبوعة بتدمير الأنسجة العضوية",
      "إزالة المعادن (Demineralization) للمادة غير العضوية متبوعة بتدمير المادة العضوية (Destruction of organic substance)",
      "تدمير المادة العضوية أولاً متبوعاً بإزالة المعادن غير العضوية",
      "تليف لب السن متبوعاً بتحلل المينا"
    ],
    "options_en": [
      "Re-mineralization of inorganic followed by destruction of organic substance",
      "De-mineralization of inorganic followed by destruction of organic substance",
      "Destruction of organic followed by de-mineralization of inorganic substance",
      "Pulp fibrosis followed by enamel breakdown"
    ],
    "correct_index": 1,
    "answer_ar": "الإجابة الصحيحة: B\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\nتسوس الأسنان هو مرض إنتاني بكتيري (Infectious bacterial disease) يصيب أنسجة السن الصلبة (المينا، العاج، الملاط). الآلية المرضية تتكون حتماً من مرحلتين متعاقبتين بالترتيب:\n1. المرحلة الأولى: تحلل وإزالة المعادن من المكونات غير العضوية (Demineralization of inorganic substance) بفعل الأحماض الناتجة عن تخمر السكريات بواسطة بكتيريا اللويحة.\n2. المرحلة الثانية: تدمير وتفكيك المكونات والمصفوفة العضوية (Destruction of organic substance) بواسطة الأنزيمات المحللة للبروتين (Proteolytic enzymes).\n⚠️ نقطة امتحانية متكررة: تأكد دائماً أن إزالة التمعدن غير العضوي تأتي أولاً في المينا، ثم يتبعها تدمير المادة العضوية.",
    "answer_en": "Correct Answer: B\nDental caries involves: 1. Demineralization of inorganic component by bacterial acids, followed by 2. Destruction of the organic matrix by proteolytic enzymes.",
    "quote_ref": "Dental caries is characterized by demineralization of the inorganic substance of the tooth followed by destruction of the organic substance.",
    "source_reference": {
      "id": "ref_q_oral_path_caries_01_1",
      "question_id": "q_oral_path_caries_01",
      "sheet_id": "sh_oral_path_caries_01",
      "page_number": 2,
      "source_type": "exact",
      "source_text": "Dental caries is characterized by demineralization of the inorganic substance of the tooth followed by destruction of the organic substance.",
      "source_text_normalized": "dental caries is characterized by demineralization of the inorganic substance of the tooth followed by destruction of the organic substance",
      "text_anchor": "characterized by demineralization of the inorganic portion followed by destruction of the organic substance",
      "bounding_box": {
        "x": 38,
        "y": 153,
        "width": 574,
        "height": 44
      },
      "confidence": 0.99,
      "verification_status": "verified"
    }
  },
  {
    "id": "q_oral_path_caries_02",
    "subject_id": "oral-diseases",
    "subject_name_ar": "أمراض الفم (Oral Pathology)",
    "subject_name_en": "Oral Pathology",
    "sheet_id": "sh_oral_path_caries_01",
    "sheet_title_ar": "المحاضرة 1: تسوس الأسنان (Dental Caries)",
    "sheet_title_en": "Lecture 1: Dental Caries",
    "page_ref": 3,
    "topic_ar": "العوامل الأساسية لنشوء التسوس (Keyes Triad)",
    "topic_en": "Etiological Factors of Dental Caries",
    "type": "past_exam",
    "source": "past_exam",
    "tags": [
      "Etiology",
      "Dental Plaque",
      "Keyes Triad"
    ],
    "text_ar": "العوامل الأساسية المتفاعلة والضرورية معاً لبدء ونشوء تسوس الأسنان هي:",
    "text_en": "The factors needed for development and initiation of dental caries are:",
    "options_ar": [
      "سطح السن (المضيف)",
      "البكتيريا المسببة في لويحة الأسنان (Dental plaque)",
      "الكربوهيدرات والسكريات (الركيزة الغذائية) والزمن (Time)",
      "كل ما سبق معاً (All of the above)"
    ],
    "options_en": [
      "Tooth surface (Host)",
      "Bacteria in dental plaque (Microorganisms)",
      "Carbohydrates (Substrate) and Time",
      "All of the above"
    ],
    "correct_index": 3,
    "answer_ar": "الإجابة الصحيحة: D. كل ما سبق معاً\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\nلا يحدث التسوس بتوفر عامل واحد بمفرده؛ بل يتطلب تداخل 4 عوامل رئيسية تُعرف بمخطط كيز الرباعي (Keyes / Newbrun Tetrad):\n1. المضيف وسطح السن (Host & tooth surface): وجود سن ذي قابلية ومينا ضعيفة التمعدن أو شقوق عميقة.\n2. الميكروبات (Microorganisms): وجود بكتيريا مولدة للحمض ومتحملة له (Acidogenic & Aciduric) مثل S. mutans.\n3. الركيزة الغذائية (Substrate): سكريات قابلة للتخمر (خاصة السكروز).\n4. الزمن (Time): بقاء الحمض على سطح السن لفترة زمنية كافية لتجاوز قدرة اللعاب على معادلة الحموضة.",
    "answer_en": "Correct Answer: D. All of the above\nCaries requires the simultaneous interaction of host (tooth), microbial plaque, substrate (dietary fermentable carbohydrate), and sufficient time.",
    "quote_ref": "The four primary factors in caries etiology: tooth, dental plaque bacteria, fermentable carbohydrate substrate, and time.",
    "source_reference": {
      "id": "ref_q_oral_path_caries_02_1",
      "question_id": "q_oral_path_caries_02",
      "sheet_id": "sh_oral_path_caries_01",
      "page_number": 3,
      "source_type": "supporting",
      "source_text": "The four primary factors in caries etiology: tooth, dental plaque bacteria, fermentable carbohydrate substrate, and time.",
      "source_text_normalized": "the four primary factors in caries etiology tooth dental plaque bacteria fermentable carbohydrate substrate and time",
      "text_anchor": "The four primary factors in caries etiology: tooth, dental p",
      "bounding_box": null,
      "confidence": 0.95,
      "verification_status": "verified"
    }
  },
  {
    "id": "q_oral_path_caries_03",
    "subject_id": "oral-diseases",
    "subject_name_ar": "أمراض الفم (Oral Pathology)",
    "subject_name_en": "Oral Pathology",
    "sheet_id": "sh_oral_path_caries_01",
    "sheet_title_ar": "المحاضرة 1: تسوس الأسنان (Dental Caries)",
    "sheet_title_en": "Lecture 1: Dental Caries",
    "page_ref": 5,
    "topic_ar": "البكتيريا الأكثر إحداثاً للتسوس",
    "topic_en": "Cariogenic Bacteria & S. Mutans",
    "type": "past_exam",
    "source": "past_exam",
    "tags": [
      "Streptococcus mutans",
      "Bacteriology",
      "Plaque"
    ],
    "text_ar": "البكتيريا الأكثر كفاءة وأهمية في بدء تسوس مينا الأسنان (Initiation of caries) وتكوين اللويحة السنية هي:",
    "text_en": "In the role of bacteria and dental plaque in dental caries, the most cariogenic bacteria implicated in initiation is:",
    "options_ar": [
      "مجموعة العِقديات الطافرة (Mutans streptococci group)",
      "الخيوط الهوائية (Anaerobic filaments)",
      "الملتويات الفموية (Spirochetes)",
      "المتفطرة السلية (Mycobacterium tuberculosis)"
    ],
    "options_en": [
      "Mutans streptococci group",
      "Anaerobic filaments",
      "Spirochetes filaments",
      "Mycobacterium tuberculosis"
    ],
    "correct_index": 0,
    "answer_ar": "الإجابة الصحيحة: A. مجموعة Mutans streptococci\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\n- Streptococcus mutans هي البكتيريا الرئيسية المسؤولة عن بدء التسوس (Initiation) لأنها:\n  1) تنتج ببتيدات سكرية خارجية لاصقة (Extracellular glucans) تمكنها من الالتصاق الصلب بسطح المينا.\n  2) سريعة جداً في تخمير السكروز وإنتاج حمض اللاكتيك بكثافة.\n  3) بعد 24 ساعة من تكوين اللويحة، تتكاثر وتصل نسبتها إلى 83% من الفلورا البكتيرية في الآفة المبكرة.\n⚠️ انتبه للمقارنة الامتحانية: بكتيريا العصيات اللبنية (Lactobacilli) مسؤولة عن تقدم وتطور التسوس في العاج (Progression/Cavitation)، بينما S. mutans مسؤولة عن البداية (Initiation)، وبكتيريا Actinomyces ترتبط بتسوس الجذور (Root caries).",
    "answer_en": "Correct Answer: A. Mutans streptococci group\nStreptococcus mutans is the primary initiator of enamel caries due to its rapid acid production and extracellular polysaccharide (glucan) synthesis.",
    "quote_ref": "Mutans streptococci are the primary organisms responsible for the initiation of enamel caries.",
    "source_reference": {
      "id": "ref_q_oral_path_caries_03_1",
      "question_id": "q_oral_path_caries_03",
      "sheet_id": "sh_oral_path_caries_01",
      "page_number": 5,
      "source_type": "exact",
      "source_text": "Mutans streptococci are the primary organisms responsible for the initiation of enamel caries.",
      "source_text_normalized": "mutans streptococci are the primary organisms responsible for the initiation of enamel caries",
      "text_anchor": "Mutans streptococci are the primary organisms responsible fo",
      "bounding_box": null,
      "confidence": 0.95,
      "verification_status": "verified"
    },
    "source_references": [
      {
        "id": "ref_q_oral_path_caries_03_1",
        "question_id": "q_oral_path_caries_03",
        "sheet_id": "sh_oral_path_caries_01",
        "page_number": 6,
        "source_type": "exact",
        "source_text": "S. Mutans has a role in initiation of dental caries, while Lactobacillus is associated with the progression of dental caries.",
        "source_text_normalized": "s mutans has a role in initiation of dental caries while lactobacillus is associated with the progression of dental caries",
        "text_anchor": "S. Mutans has a role in initiation of dental caries",
        "bounding_box": {
          "x": 40,
          "y": 110,
          "width": 620,
          "height": 35
        },
        "confidence": 0.98,
        "verification_status": "verified"
      },
      {
        "id": "ref_q_oral_path_caries_03_2",
        "question_id": "q_oral_path_caries_03",
        "sheet_id": "sh_oral_path_caries_01",
        "page_number": 2,
        "source_type": "supporting",
        "source_text": "When carbohydrates undergo fermentation by the bacteria, they form acids which start to dissolve the enamel",
        "source_text_normalized": "when carbohydrates undergo fermentation by the bacteria they form acids which start to dissolve the enamel",
        "text_anchor": "When carbohydrates undergo fermentation",
        "bounding_box": {
          "x": 40,
          "y": 240,
          "width": 220,
          "height": 60
        },
        "confidence": 0.92,
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": "q_oral_path_caries_04",
    "subject_id": "oral-diseases",
    "subject_name_ar": "أمراض الفم (Oral Pathology)",
    "subject_name_en": "Oral Pathology",
    "sheet_id": "sh_oral_path_caries_01",
    "sheet_title_ar": "المحاضرة 1: تسوس الأسنان (Dental Caries)",
    "sheet_title_en": "Lecture 1: Dental Caries",
    "page_ref": 6,
    "topic_ar": "المنطقة الشفافة في تسوس المينا (Translucent Zone)",
    "topic_en": "Translucent Zone of Enamel Caries",
    "type": "past_exam",
    "source": "past_exam",
    "tags": [
      "Enamel Caries",
      "Translucent Zone",
      "Porosity",
      "Histopathology"
    ],
    "text_ar": "في دراسة تسوس المينا بالمجهر المستقطب، تعتبر المنطقة الشفافة (Translucent zone) أكثر مسامية من المينا الطبيعية وتحتوي على مسامات بحجم يبلغ حوالي:",
    "text_en": "In enamel caries, the translucent zone is slightly more porous than normal enamel and contains:",
    "options_ar": [
      "1% من حجم المسامات (1% by volume of pores)",
      "5% من حجم المسامات (5% by volume pores)",
      "10% من حجم المسامات (10% by volume pores)",
      "25% من حجم المسامات (25% by volume pores)"
    ],
    "options_en": [
      "1% by volume of pores",
      "5% by volume of pores",
      "10% by volume of pores",
      "25% by volume of pores"
    ],
    "correct_index": 0,
    "answer_ar": "الإجابة الصحيحة: A. 1% من حجم المسامات\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\nالمينا الطبيعية السليمة مساميتها ضئيلة جداً ولا تتجاوز 0.1% من حجمها.\nعند حدوث التسوس المبكر (Incipient enamel lesion)، تظهر 4 مناطق نسيجية من العمق إلى السطح:\n1. المنطقة الشفافة (Translucent zone): هي أعمق منطقة وأول تغير نسيجي يمكن رصده (Advancing front). تصبح مساميتها 1% (عشرة أضعاف المينا الطبيعية).\n2. المنطقة المظلمة (Dark zone): تليها نحو السطح، مساميتها 2% إلى 4%، وتحدث فيها عمليات إعادة تمعدن جزئية (Remineralization).\n3. جسم الآفة (Body of lesion): أكبر منطقة، مساميتها من 5% إلى 25% (أكثر المناطق فقداناً للمعادن).\n4. المنطقة السطحية (Surface zone): طبقة سطحية تبدو سليمة نسبياً ومحمية بالفلورايد واللعاب ومساميتها تقارب 1% فقط.",
    "answer_en": "Correct Answer: A. 1% by volume of pores\nThe translucent zone is the deepest advancing front of enamel caries and has a pore volume of 1% (compared to 0.1% in normal enamel).",
    "quote_ref": "Translucent zone: This is the advancing front of the lesion. It contains about 1% pore volume compared to 0.1% in sound enamel.",
    "source_reference": {
      "id": "ref_q_oral_path_caries_04_1",
      "question_id": "q_oral_path_caries_04",
      "sheet_id": "sh_oral_path_caries_01",
      "page_number": 6,
      "source_type": "exact",
      "source_text": "Translucent zone: This is the advancing front of the lesion. It contains about 1% pore volume compared to 0.1% in sound enamel.",
      "source_text_normalized": "translucent zone this is the advancing front of the lesion it contains about 1 pore volume compared to 0 1 in sound enamel",
      "text_anchor": "Translucent zone: This is the advancing front of the lesion.",
      "bounding_box": null,
      "confidence": 0.95,
      "verification_status": "verified"
    }
  },
  {
    "id": "q_oral_path_caries_05",
    "subject_id": "oral-diseases",
    "subject_name_ar": "أمراض الفم (Oral Pathology)",
    "subject_name_en": "Oral Pathology",
    "sheet_id": "sh_oral_path_caries_01",
    "sheet_title_ar": "المحاضرة 1: تسوس الأسنان (Dental Caries)",
    "sheet_title_en": "Lecture 1: Dental Caries",
    "page_ref": 6,
    "topic_ar": "مناطق تسوس المينا (Zones of Enamel Caries)",
    "topic_en": "Histopathology of Enamel Caries",
    "type": "past_exam",
    "source": "past_exam",
    "tags": [
      "Zones of Caries",
      "Enamel Caries",
      "Histopathology"
    ],
    "text_ar": "جميع ما يلي يعتبر من المناطق النسيجية الأربعة المعترف بها في تسوس المينا (Enamel Caries) ما عدا:",
    "text_en": "All of the following are considered recognized zones of enamel caries EXCEPT:",
    "options_ar": [
      "المنطقة الشفافة (Translucent zone)",
      "المنطقة المظلمة (Dark zone)",
      "جسم الآفة (Body of the lesion)",
      "منطقة العاج الارتكاسي / الثانوي (Secondary/Reactionary dentine zone)"
    ],
    "options_en": [
      "Translucent zone",
      "Dark zone",
      "Body of the lesion",
      "Secondary or reactionary dentine zone"
    ],
    "correct_index": 3,
    "answer_ar": "الإجابة الصحيحة: D. منطقة العاج الارتكاسي / الثانوي\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\nسؤال كلاسيكي يتكرر في امتحانات أطباء الأسنان؛ مناطق تسوس المينا الأربعة هي حصراً:\n1. Translucent zone\n2. Dark zone\n3. Body of the lesion\n4. Surface zone\nبينما العاج الارتكاسي (Reactionary / Secondary dentine) هو نسيج دفاعي يفرزه مصورات العاج (Odontoblasts) داخل حجرة اللب والعاج، وليس منطقة في تسوس المينا!",
    "answer_en": "Correct Answer: D. Secondary or reactionary dentine zone\nEnamel caries has 4 zones: Translucent zone, Dark zone, Body of lesion, and Surface zone. Reactionary dentine belongs to dentin-pulp defense.",
    "quote_ref": "The four distinct zones of early enamel caries: Translucent zone, Dark zone, Body of the lesion, and Surface zone.",
    "source_reference": {
      "id": "ref_q_oral_path_caries_05_1",
      "question_id": "q_oral_path_caries_05",
      "sheet_id": "sh_oral_path_caries_01",
      "page_number": 6,
      "source_type": "exact",
      "source_text": "The four distinct zones of early enamel caries: Translucent zone, Dark zone, Body of the lesion, and Surface zone.",
      "source_text_normalized": "the four distinct zones of early enamel caries translucent zone dark zone body of the lesion and surface zone",
      "text_anchor": "The four distinct zones of early enamel caries: Translucent ",
      "bounding_box": null,
      "confidence": 0.95,
      "verification_status": "verified"
    }
  },
  {
    "id": "q_oral_path_caries_06",
    "subject_id": "oral-diseases",
    "subject_name_ar": "أمراض الفم (Oral Pathology)",
    "subject_name_en": "Oral Pathology",
    "sheet_id": "sh_oral_path_caries_01",
    "sheet_title_ar": "المحاضرة 1: تسوس الأسنان (Dental Caries)",
    "sheet_title_en": "Lecture 1: Dental Caries",
    "page_ref": 8,
    "topic_ar": "مناطق تسوس العاج (Zones of Dentine Caries)",
    "topic_en": "Histopathology of Dentine Caries",
    "type": "past_exam",
    "source": "past_exam",
    "tags": [
      "Dentine Caries",
      "Zones of Dentine",
      "Histopathology"
    ],
    "text_ar": "تتضمن مناطق تسوس العاج (Dentine Caries) عدة طبقات دفاعية وهجومية، أي من التالي ليس من مناطق تسوس العاج:",
    "text_en": "All of the following are zones of dentine caries, EXCEPT:",
    "options_ar": [
      "منطقة إزالة التمعدن المتقدمة (Zone of demineralization)",
      "المنطقة المظلمة (Dark zone)",
      "منطقة الغزو البكتيري (Zone of bacterial invasion)",
      "منطقة التصلب التكلسي (Zone of sclerosis / Translucent dentine)"
    ],
    "options_en": [
      "Zone of demineralization",
      "Dark zone",
      "Zone of bacterial invasion",
      "Zone of sclerosis (translucent dentine)"
    ],
    "correct_index": 1,
    "answer_ar": "الإجابة الصحيحة: B. المنطقة المظلمة (Dark zone)\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\n- المنطقة المظلمة (Dark zone) هي منطقة خاصة بـ **تسوس المينا فقط**!\n- أما مناطق تسوس العاج (Dentine Caries) من السطح الخارجي إلى اللب فهي:\n  1. منطقة التفكك والتنخر (Zone of destruction / necrotic debris).\n  2. منطقة الغزو البكتيري والتكاثر (Zone of bacterial invasion / infected dentine).\n  3. منطقة إزالة التمعدن الرائدة (Zone of demineralization / affected dentine).\n  4. منطقة التصلب الدفاعي (Zone of sclerosis / translucent dentine) حيث تتكلس الأنابيب العاجية لإغلاق الطريق أمام البكتيريا.\n  5. العاج الارتكاسي الثالثي (Reactionary / Reparative dentine).",
    "answer_en": "Correct Answer: B. Dark zone\nDark zone is a zone of enamel caries, not dentine caries.",
    "quote_ref": "Zones of dentinal caries include destruction, bacterial invasion, demineralization, and tubular sclerosis.",
    "source_reference": {
      "id": "ref_q_oral_path_caries_06_1",
      "question_id": "q_oral_path_caries_06",
      "sheet_id": "sh_oral_path_caries_01",
      "page_number": 8,
      "source_type": "exact",
      "source_text": "Zones of dentinal caries include destruction, bacterial invasion, demineralization, and tubular sclerosis.",
      "source_text_normalized": "zones of dentinal caries include destruction bacterial invasion demineralization and tubular sclerosis",
      "text_anchor": "Zones of dentinal caries include destruction, bacterial inva",
      "bounding_box": null,
      "confidence": 0.95,
      "verification_status": "verified"
    }
  },
  {
    "id": "q_oral_path_caries_07",
    "subject_id": "oral-diseases",
    "subject_name_ar": "أمراض الفم (Oral Pathology)",
    "subject_name_en": "Oral Pathology",
    "sheet_id": "sh_oral_path_caries_01",
    "sheet_title_ar": "المحاضرة 1: تسوس الأسنان (Dental Caries)",
    "sheet_title_en": "Lecture 1: Dental Caries",
    "page_ref": 9,
    "topic_ar": "العاج الارتكاسي الدفاعي (Reactionary Dentine)",
    "topic_en": "Reactionary Dentine Formation & Timing",
    "type": "past_exam",
    "source": "past_exam",
    "tags": [
      "Reactionary Dentine",
      "Pulp Defense",
      "Dentinogenesis"
    ],
    "text_ar": "يبدأ العاج الارتكاسي (Reactionary dentine) بالتكون كاستجابة دفاعية بعد 3 أسابيع من تخريش خلايا مصورات العاج، ويصل سمكه إلى حوالي 0.1 مم بعد مرور:",
    "text_en": "Reactionary dentine starts to develop after three weeks of onset of odontoblasts irritation and reaches about 0.1 mm after:",
    "options_ar": [
      "10 أيام",
      "20 يوماً",
      "50 يوماً",
      "100 يوم (100 days)"
    ],
    "options_en": [
      "10 days",
      "20 days",
      "50 days",
      "100 days"
    ],
    "correct_index": 3,
    "answer_ar": "الإجابة الصحيحة: D. 100 يوم\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\nعند تعرض خلايا Odontoblasts لتنبيه معتدل ناتج عن التسوس أو الحفر، تبدأ بإفراز مصفوفة عاج جديدة لحماية اللب:\n- تبدأ هذه الاستجابة بالظهور بعد 3 أسابيع من بدء التحفيز.\n- يزداد معدل الترسيب حتى يصل سمك العاج الارتكاسي إلى حوالي 0.1 مليمتر عند اليوم رقم 100.\n- هذا العاج يعتبر استجابة حيوية نشطة (Vital reaction) من خلايا اللب السليمة لحماية نفسها من الاختراق الجرثومي.",
    "answer_en": "Correct Answer: D. 100 days\nReactionary dentine initiates ~3 weeks post-irritation and achieves approximately 0.1 mm thickness after 100 days.",
    "quote_ref": "Reactionary dentine starts to develop after three weeks of onset of odontoblast irritation and reaches about 0.1 mm after 100 days.",
    "source_reference": {
      "id": "ref_q_oral_path_caries_07_1",
      "question_id": "q_oral_path_caries_07",
      "sheet_id": "sh_oral_path_caries_01",
      "page_number": 9,
      "source_type": "exact",
      "source_text": "Reactionary dentine starts to develop after three weeks of onset of odontoblast irritation and reaches about 0.1 mm after 100 days.",
      "source_text_normalized": "reactionary dentine starts to develop after three weeks of onset of odontoblast irritation and reaches about 0 1 mm after 100 days",
      "text_anchor": "Reactionary dentine starts to develop after three weeks of o",
      "bounding_box": null,
      "confidence": 0.95,
      "verification_status": "verified"
    }
  },
  {
    "id": "q_oral_path_caries_08",
    "subject_id": "oral-diseases",
    "subject_name_ar": "أمراض الفم (Oral Pathology)",
    "subject_name_en": "Oral Pathology",
    "sheet_id": "sh_oral_path_caries_01",
    "sheet_title_ar": "المحاضرة 1: تسوس الأسنان (Dental Caries)",
    "sheet_title_en": "Lecture 1: Dental Caries",
    "page_ref": 10,
    "topic_ar": "التسوس المتوقف (Arrested Caries)",
    "topic_en": "Arrested Caries Characteristics",
    "type": "past_exam",
    "source": "past_exam",
    "tags": [
      "Arrested Caries",
      "Sclerosis",
      "Remineralization"
    ],
    "text_ar": "يتميز التسوس المتوقف (Arrested caries) في العاج بسطح فائق التمعدن والمتصلب (Sclerotic) نتيجة إعادة التمعدن من السوائل الفموية والتناول الكافي للفلورايد:",
    "text_en": "Arrested caries of dentine has a hypermineralized surface (sclerosis) due to remineralization from oral fluids and high fluoride intake. This statement is:",
    "options_ar": [
      "عبارة صحيحة (True)",
      "عبارة خاطئة (False)"
    ],
    "options_en": [
      "True",
      "False"
    ],
    "correct_index": 0,
    "answer_ar": "الإجابة الصحيحة: A. عبارة صحيحة (True)\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\nعند إزالة العوامل المسببة للتسوس أو تحسين التنظيف الفموي وتطبيق الفلورايد، يمكن أن تتوقف الآفة النخرية وتتحول إلى (Arrested caries):\n- سريرياً: يصبح قاع الآفة صلباً كالعاج السليم، ويتغير لونه إلى البني الداكن أو الأسود بسبب ترسب أصبغة الطعام والشوائب.\n- نسيجياً: يتصلب السطح ويصبح فائق التمعدن (Hypermineralized sclerotic dentine) بفضل امتصاص المعادن والفوسفات والفلورايد من اللعاب.",
    "answer_en": "Correct Answer: A. True\nArrested dentinal caries develops a hard, darkly pigmented, hypermineralized surface from salivary remineralization and fluoride.",
    "quote_ref": "Arrested caries of dentine has a hypermineralized surface due to remineralization from oral fluids.",
    "source_reference": {
      "id": "ref_q_oral_path_caries_08_1",
      "question_id": "q_oral_path_caries_08",
      "sheet_id": "sh_oral_path_caries_01",
      "page_number": 10,
      "source_type": "exact",
      "source_text": "Arrested caries of dentine has a hypermineralized surface due to remineralization from oral fluids.",
      "source_text_normalized": "arrested caries of dentine has a hypermineralized surface due to remineralization from oral fluids",
      "text_anchor": "Arrested caries of dentine has a hypermineralized surface du",
      "bounding_box": null,
      "confidence": 0.95,
      "verification_status": "verified"
    }
  },
  {
    "id": "q_oral_path_caries_09",
    "subject_id": "oral-diseases",
    "subject_name_ar": "أمراض الفم (Oral Pathology)",
    "subject_name_en": "Oral Pathology",
    "sheet_id": "sh_oral_path_caries_01",
    "sheet_title_ar": "المحاضرة 1: تسوس الأسنان (Dental Caries)",
    "sheet_title_en": "Lecture 1: Dental Caries",
    "page_ref": 11,
    "topic_ar": "التسوس الجامح الحاد (Rampant Caries)",
    "topic_en": "Rampant Caries Definition",
    "type": "past_exam",
    "source": "past_exam",
    "tags": [
      "Rampant Caries",
      "Acute Caries",
      "Classification"
    ],
    "text_ar": "يُعرَّف التسوس الجامح أو الحاد (Rampant or Acute Caries) بأنه:",
    "text_en": "Rampant or acute caries is clinically described as:",
    "options_ar": [
      "تسوس بطيء جداً يستغرق سنوات طويلة ليصيب سناً واحداً",
      "تسوس سريع الانتشار وشديد التدمير يشمل أسناناً متعددة في وقت واحد حتى تلك المقاومة عادة للتسوس (Rapidly progressing involving many teeth)",
      "تسوس يقتصر على القواطع السفلية فقط",
      "تسوس متوقف ومكتسب للون الأسود"
    ],
    "options_en": [
      "Very slow progression affecting only a single tooth over years",
      "Rapidly progressing caries involving multiple teeth simultaneously, including typically immune surfaces",
      "Caries restricted strictly to lower incisors",
      "Arrested dark black lesion"
    ],
    "correct_index": 1,
    "answer_ar": "الإجابة الصحيحة: B\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\n- التسوس الجامح (Rampant caries): هو تسوس مفاجئ وسريع الانتشار يصيب عدداً كبيراً من الأسنان في آن واحد، ويتميز باختراق الأسطح الملساء التي نادراً ما تصاب بالتسوس كالقواطع السفلية وأسطح الأعناق.\n- أكثر ما يشاهد عند الأطفال الصغار (Nursing bottle caries)، أو المراهقين المتناولين للحلوى والسكريات بكثرة، أو المرضى المصابين بجفاف الفم الشديد (Xerostomia) بعد العلاج الإشعاعي.",
    "answer_en": "Correct Answer: B. Rapidly progressing caries involving multiple teeth\nRampant caries is characterized by widespread, rapid cavitation affecting multiple teeth and unusual surfaces.",
    "quote_ref": "Rampant caries: A suddenly appearing, rapidly burrowing type of caries resulting in early pulp involvement in multiple teeth.",
    "source_reference": {
      "id": "ref_q_oral_path_caries_09_1",
      "question_id": "q_oral_path_caries_09",
      "sheet_id": "sh_oral_path_caries_01",
      "page_number": 11,
      "source_type": "exact",
      "source_text": "Rampant caries: A suddenly appearing, rapidly burrowing type of caries resulting in early pulp involvement in multiple teeth.",
      "source_text_normalized": "rampant caries a suddenly appearing rapidly burrowing type of caries resulting in early pulp involvement in multiple teeth",
      "text_anchor": "Rampant caries: A suddenly appearing, rapidly burrowing type",
      "bounding_box": null,
      "confidence": 0.95,
      "verification_status": "verified"
    }
  },
  {
    "id": "q_oral_path_pulp_03",
    "subject_id": "oral-diseases",
    "subject_name_ar": "أمراض الفم (Oral Pathology)",
    "subject_name_en": "Oral Pathology",
    "sheet_id": "sh_oral_path_pulp_02",
    "sheet_title_ar": "المحاضرة 2: أمراض واضطرابات لب الأسنان (Diseases of Dental Pulp)",
    "sheet_title_en": "Lecture 2: Diseases of the Dental Pulp",
    "page_ref": 3,
    "topic_ar": "المظاهر السريرية لالتهاب اللب الحاد (Acute Pulpitis)",
    "topic_en": "Clinical Features of Acute Pulpitis",
    "type": "past_exam",
    "source": "past_exam",
    "tags": [
      "Acute Pulpitis",
      "Pain Localization",
      "Thermal Stimuli"
    ],
    "text_ar": "سريرياً، يتظاهر التهاب لب الأسنان الحاد (Acute Pulpitis) بالمظاهر التالية:",
    "text_en": "Clinically, acute pulpitis is manifested by:",
    "options_ar": [
      "ألم شديد ونابض (Severe throbbing pain)",
      "عدم قدرة المريض على تحديد السن المصاب بدقة (Cannot localize to a particular tooth)",
      "تفاقم الألم وازدياده بالمنبهات الحرارية الساخنة والباردة ووضعية الاستلقاء",
      "كل ما سبق صحيح (All of the above)"
    ],
    "options_en": [
      "Severe throbbing pain",
      "Patient cannot localize the pain to a particular tooth",
      "Pain aggravated by thermal stimuli (hot and cold) and recumbent position",
      "All of the above"
    ],
    "correct_index": 3,
    "answer_ar": "الإجابة الصحيحة: D. كل ما سبق صحيح\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\nالتهاب اللب الحاد غير القابل للشفاء (Irreversible Acute Pulpitis) يتميز بخصائص سريرية ثابتة في الامتحانات:\n1. طبيعة الألم: ألم حاد، شديد، نابض ومستمر لساعات (Severe throbbing pain).\n2. عدم القدرة على تحديد المكان (Poor localization): لأن اللب يحتوي على ألياف C الحسية ولا يحتوي على مستقبلات حس عميق (Proprioceptors)؛ لذا يشعر المريض بألم منتشر أو منعكس (Referred pain) في الفك أو الوجه دون معرفة السن بالتحديد.\n3. المحفزات: يزداد بالحرارة والبرودة ويستمر حتى بعد زوال المنبه، كما يزداد عند النوم أو الاستلقاء بسبب ارتفاع الضغط الوريدي داخل رأس المريض وحجرة اللب المحاطة بجدران عاجية غير مرنة.",
    "answer_en": "Correct Answer: D. All of the above\nAcute pulpitis features severe throbbing pain, lack of proprioceptors (poor localization/referred pain), and exacerbation by thermal stimuli and recumbency.",
    "quote_ref": "Acute pulpitis is characterized by severe throbbing pain, poorly localized by the patient, and aggravated by hot and cold stimuli.",
    "source_reference": {
      "id": "ref_q_oral_path_pulp_03_1",
      "question_id": "q_oral_path_pulp_03",
      "sheet_id": "sh_oral_path_pulp_02",
      "page_number": 3,
      "source_type": "exact",
      "source_text": "Acute pulpitis is characterized by severe throbbing pain, poorly localized by the patient, and aggravated by hot and cold stimuli.",
      "source_text_normalized": "acute pulpitis is characterized by severe throbbing pain poorly localized by the patient and aggravated by hot and cold stimuli",
      "text_anchor": "Acute pulpitis is characterized by severe throbbing pain, po",
      "bounding_box": null,
      "confidence": 0.95,
      "verification_status": "verified"
    }
  },
  {
    "id": "q_oral_path_pulp_04",
    "subject_id": "oral-diseases",
    "subject_name_ar": "أمراض الفم (Oral Pathology)",
    "subject_name_en": "Oral Pathology",
    "sheet_id": "sh_oral_path_pulp_02",
    "sheet_title_ar": "المحاضرة 2: أمراض واضطرابات لب الأسنان (Diseases of Dental Pulp)",
    "sheet_title_en": "Lecture 2: Diseases of the Dental Pulp",
    "page_ref": 5,
    "topic_ar": "التهاب اللب المزمن التكاثري (Pulp Polyp)",
    "topic_en": "Chronic Hyperplastic Pulpitis (Pulp Polyp)",
    "type": "past_exam",
    "source": "past_exam",
    "tags": [
      "Pulp Polyp",
      "Hyperplastic Pulpitis",
      "Granulation Tissue"
    ],
    "text_ar": "يُطلق مصطلح (Pulp Polyp) في أمراض لب الأسنان على:",
    "text_en": "The term 'Pulp Polyp' is also called:",
    "options_ar": [
      "التهاب اللب المزمن التكاثري المفرط (Chronic hyperplastic pulpitis)",
      "التهاب اللب الحاد التكاثري (Acute hyperplastic pulpitis)",
      "الورم الحبيبي الذروي (Periapical granuloma)",
      "خلل التنسج الظهاري (Epithelial dysplasia)"
    ],
    "options_en": [
      "Chronic hyperplastic pulpitis",
      "Acute hyperplastic pulpitis",
      "Periapical granuloma",
      "Epithelial dysplasia"
    ],
    "correct_index": 0,
    "answer_ar": "الإجابة الصحيحة: A. التهاب اللب المزمن التكاثري (Chronic hyperplastic pulpitis)\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\n- بوليب اللب (Pulp polyp) هو نمو لحمي أحمر فاقع من النسيج الحبيبي (Granulation tissue) يبرز خارج نخر عاجي مفتوح وكبير.\n- يحدث نموذجياً عند الأطفال واليافعين في الأسنان اللبنية أو الأرحاء الدائمة الفتية، لسببين حاسمين:\n  1) وجود فتحة نخرية واسعة تسمح للنسيج بالتمدد دون أن ينحبس أو ينضغط.\n  2) التروية الدموية الغزيرة جداً والمناعة العالية للب الفتي.\n- مع الوقت، تتساقط خلايا ظهارية من مخاطية الفم على سطحه ويتغطى بطبقة من الظهارة المطبقة الحرشفية (Stratified squamous epithelium) ليصبح غير مؤلم تقريباً عند اللمس.",
    "answer_en": "Correct Answer: A. Chronic hyperplastic pulpitis\nPulp polyp occurs in young teeth with open carious cavities and rich vascular supply, presenting as an exuberant mass of granulation tissue.",
    "quote_ref": "Chronic hyperplastic pulpitis (pulp polyp): An excessive proliferation of chronically inflamed pulp tissue occurring in teeth of children and young adults.",
    "source_reference": {
      "id": "ref_q_oral_path_pulp_04_1",
      "question_id": "q_oral_path_pulp_04",
      "sheet_id": "sh_oral_path_pulp_02",
      "page_number": 5,
      "source_type": "exact",
      "source_text": "Chronic hyperplastic pulpitis (pulp polyp): An excessive proliferation of chronically inflamed pulp tissue occurring in teeth of children and young adults.",
      "source_text_normalized": "chronic hyperplastic pulpitis pulp polyp an excessive proliferation of chronically inflamed pulp tissue occurring in teeth of children and young adults",
      "text_anchor": "Chronic hyperplastic pulpitis (pulp polyp): An excessive pro",
      "bounding_box": null,
      "confidence": 0.95,
      "verification_status": "verified"
    }
  },
  {
    "id": "q_oral_path_pulp_05",
    "subject_id": "oral-diseases",
    "subject_name_ar": "أمراض الفم (Oral Pathology)",
    "subject_name_en": "Oral Pathology",
    "sheet_id": "sh_oral_path_pulp_02",
    "sheet_title_ar": "المحاضرة 2: أمراض واضطرابات لب الأسنان (Diseases of Dental Pulp)",
    "sheet_title_en": "Lecture 2: Diseases of the Dental Pulp",
    "page_ref": 7,
    "topic_ar": "نسيجيات التهاب اللب المزمن",
    "topic_en": "Histopathology of Chronic Pulpitis",
    "type": "past_exam",
    "source": "past_exam",
    "tags": [
      "Chronic Pulpitis",
      "Histopathology",
      "Lymphocytes"
    ],
    "text_ar": "في الفحص النسيجي لالتهاب اللب المزمن (Chronic Pulpitis)، يتميز الارتشاح الالتهابي بوجود:",
    "text_en": "In the histopathology of chronic pulpitis, the cellular infiltrate is predominantly characterized by:",
    "options_ar": [
      "ارتشاح متقدم من الخلايا المتعادلة (Neutrophils) فقط مع خراجات",
      "ارتشاح مزمن من الخلايا اللمفاوية (Lymphocytes) وخلايا البلازما (Plasma cells)",
      "خلايا كولسترولية عملاقة وخلايا رغوية فقط",
      "غياب تام لجميع خلايا المناعة"
    ],
    "options_en": [
      "Predominant neutrophil infiltration with microabscesses only",
      "Progressive infiltration by lymphocytes and plasma cells",
      "Cholesterol giant cells and foam cells only",
      "Complete absence of all immune cells"
    ],
    "correct_index": 1,
    "answer_ar": "الإجابة الصحيحة: B\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\n- التهاب اللب الحاد (Acute): يتميز بارتشاح كثيف من الكريات البيض متعددة النوى / المتعادلات (Neutrophils / PMNs) مع وذمة شديدة وتخرب خلوي وتكون بؤر قيحية.\n- التهاب اللب المزمن (Chronic): يتميز بارتشاح خلايا أحادية النواة (Mononuclear infiltrate) ممثلة بالخلايا اللمفاوية (Lymphocytes) وخلايا البلازما (Plasma cells) وتكاثر اللييفات اليافعة والأوعية الدموية لتشكيل نسيج حبيبي مزمن.",
    "answer_en": "Correct Answer: B. Progressive infiltration by lymphocytes and plasma cells\nChronic pulpitis histologically shows a chronic mononuclear infiltrate dominated by lymphocytes and plasma cells.",
    "quote_ref": "Chronic pulpitis shows infiltration of the pulp tissue predominantly by lymphocytes and plasma cells.",
    "source_reference": {
      "id": "ref_q_oral_path_pulp_05_1",
      "question_id": "q_oral_path_pulp_05",
      "sheet_id": "sh_oral_path_pulp_02",
      "page_number": 7,
      "source_type": "exact",
      "source_text": "Chronic pulpitis shows infiltration of the pulp tissue predominantly by lymphocytes and plasma cells.",
      "source_text_normalized": "chronic pulpitis shows infiltration of the pulp tissue predominantly by lymphocytes and plasma cells",
      "text_anchor": "Chronic pulpitis shows infiltration of the pulp tissue predo",
      "bounding_box": null,
      "confidence": 0.95,
      "verification_status": "verified"
    }
  },
  {
    "id": "q_oral_path_pulp_06",
    "subject_id": "oral-diseases",
    "subject_name_ar": "أمراض الفم (Oral Pathology)",
    "subject_name_en": "Oral Pathology",
    "sheet_id": "sh_oral_path_pulp_02",
    "sheet_title_ar": "المحاضرة 2: أمراض واضطرابات لب الأسنان (Diseases of Dental Pulp)",
    "sheet_title_en": "Lecture 2: Diseases of the Dental Pulp",
    "page_ref": 11,
    "topic_ar": "التكلسات الحصوية في اللب (Pulp Stones)",
    "topic_en": "Pulp Calcifications & Pulp Stones",
    "type": "past_exam",
    "source": "past_exam",
    "tags": [
      "Pulp Stones",
      "Denticles",
      "Pulp Calcification"
    ],
    "text_ar": "حصيات اللب (Pulp Stones) هي أجسام متكلسة تحتوي على مصفوفة عضوية، وتصنف نسيجياً إلى حصيات حقيقية (True) وحصيات كاذبة (False). هذه العبارة:",
    "text_en": "Pulp stones are calcified bodies with an organic matrix and occur as true and false pulp stones. This statement is:",
    "options_ar": [
      "صحيحة (True)",
      "خاطئة (False)"
    ],
    "options_en": [
      "True",
      "False"
    ],
    "correct_index": 0,
    "answer_ar": "الإجابة الصحيحة: A. صحيحة (True)\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\nتكلسات اللب شائعة جداً وتزداد طردياً مع التقدم في العمر:\n1. حصيات اللب الحقيقية (True pulp stones / Denticles): نادرة، وتتكون من عاج حقيقي يحتوي على أنابيب عاجية وخلايا شبيهة بمصورات العاج.\n2. حصيات اللب الكاذبة (False pulp stones): هي الأكثر شيوعاً، وتتكون من صفائح كلسية دائرية متحدة المركز (Concentric lamellae) ناتجة عن تنكس تكلسي حول أوعية دموية أو ألياف كولاجينية، وتخلو تماماً من الأنابيب العاجية.",
    "answer_en": "Correct Answer: A. True\nPulp stones are calcified masses classified structurally into true stones (containing dentinal tubules) and false stones (concentric lamellar calcifications without tubules).",
    "quote_ref": "Pulp stones are classified as true (composed of dentine with tubules) or false (concentric layers of calcified tissue).",
    "source_reference": {
      "id": "ref_q_oral_path_pulp_06_1",
      "question_id": "q_oral_path_pulp_06",
      "sheet_id": "sh_oral_path_pulp_02",
      "page_number": 11,
      "source_type": "exact",
      "source_text": "Pulp stones are classified as true (composed of dentine with tubules) or false (concentric layers of calcified tissue).",
      "source_text_normalized": "pulp stones are classified as true composed of dentine with tubules or false concentric layers of calcified tissue",
      "text_anchor": "Pulp stones are classified as true (composed of dentine with",
      "bounding_box": null,
      "confidence": 0.95,
      "verification_status": "verified"
    }
  },
  {
    "id": "q_oral_path_pulp_07",
    "subject_id": "oral-diseases",
    "subject_name_ar": "أمراض الفم (Oral Pathology)",
    "subject_name_en": "Oral Pathology",
    "sheet_id": "sh_oral_path_pulp_02",
    "sheet_title_ar": "المحاضرة 2: أمراض واضطرابات لب الأسنان (Diseases of Dental Pulp)",
    "sheet_title_en": "Lecture 2: Diseases of the Dental Pulp",
    "page_ref": 13,
    "topic_ar": "التغيرات العمرية في لب السن (Age Changes)",
    "topic_en": "Age Changes in Dental Pulp",
    "type": "past_exam",
    "source": "past_exam",
    "tags": [
      "Age Changes",
      "Pulp Fibrosis",
      "Vascularity"
    ],
    "text_ar": "مع التقدم في السن (Age changes of the pulp)، يظهر الفحص النسيجي للب التغير التالي:",
    "text_en": "Age changes of the dental pulp histologically show:",
    "options_ar": [
      "زيادة ملحوظة في التروية الدموية وعدد الخلايا الحية",
      "انخفاض التروية الدموية وانخفاض عدد الخلايا مع زيادة التليف (Decreased vascularity and cellularity)",
      "توسع كبير في حجم حجرة اللب",
      "انعدام تام لتكون العاج الثانوي"
    ],
    "options_en": [
      "Marked increase in vascularity and number of cells",
      "Decreased vascularity and cellularity with increased fibrosis",
      "Massive enlargement of the pulp chamber size",
      "Complete absence of secondary dentine deposition"
    ],
    "correct_index": 1,
    "answer_ar": "الإجابة الصحيحة: B\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\nمع تقدم الإنسان في العمر، تحدث تغيرات فيسيولوجية حتمية في نسيج اللب:\n- انخفاض حجم حجرة اللب والقنوات الجذرية بسبب استمرار ترسيب العاج الثانوي والارتكاسي طوال الحياة.\n- انخفاض التروية الدموية (Decreased vascularity) وانخفاض عدد الأعصاب.\n- انخفاض عدد الخلايا النشطة (Decreased cellularity) مع زيادة كثافة حزم ألياف الكولاجين (Fibrosis).\n- زيادة نسبة الحصيات الكلسية؛ مما يجعل اللب المسن أقل قدرة على الشفاء وأقل حساسية للألم مقارنة باللب الشاب.",
    "answer_en": "Correct Answer: B. Decreased vascularity and cellularity with increased fibrosis\nAging pulp exhibits reduced pulp volume, decreased vascularity/cellularity, increased fibrous collagen, and more calcifications.",
    "quote_ref": "Aging of the pulp leads to reduced volume, decreased vascularity, fewer cells, and increased collagen fibers.",
    "source_reference": {
      "id": "ref_q_oral_path_pulp_07_1",
      "question_id": "q_oral_path_pulp_07",
      "sheet_id": "sh_oral_path_pulp_02",
      "page_number": 13,
      "source_type": "exact",
      "source_text": "Aging of the pulp leads to reduced volume, decreased vascularity, fewer cells, and increased collagen fibers.",
      "source_text_normalized": "aging of the pulp leads to reduced volume decreased vascularity fewer cells and increased collagen fibers",
      "text_anchor": "Aging of the pulp leads to reduced volume, decreased vascula",
      "bounding_box": null,
      "confidence": 0.95,
      "verification_status": "verified"
    }
  },
  {
    "id": "q_oral_path_pulp_08",
    "subject_id": "oral-diseases",
    "subject_name_ar": "أمراض الفم (Oral Pathology)",
    "subject_name_en": "Oral Pathology",
    "sheet_id": "sh_oral_path_pulp_02",
    "sheet_title_ar": "المحاضرة 2: أمراض واضطرابات لب الأسنان (Diseases of Dental Pulp)",
    "sheet_title_en": "Lecture 2: Diseases of the Dental Pulp",
    "page_ref": 15,
    "topic_ar": "ألم اللب عند تغير الضغط الجوي (Aerodontalgia)",
    "topic_en": "Aerodontalgia / Barodontalgia",
    "type": "past_exam",
    "source": "past_exam",
    "tags": [
      "Aerodontalgia",
      "Barotrauma",
      "Aviation"
    ],
    "text_ar": "ألم الأسنان واللب الذي يصيب أفراد طواقم الطيران والركاب عند التحليق على ارتفاعات شاهقة وتغير الضغط الجوي يُسمى سريرياً:",
    "text_en": "Barotrauma or aerodontalgia is a dental pain typically seen in air crew flying at high altitudes due to atmospheric pressure changes. This statement is:",
    "options_ar": [
      "صحيحة (True)",
      "خاطئة (False)"
    ],
    "options_en": [
      "True",
      "False"
    ],
    "correct_index": 0,
    "answer_ar": "الإجابة الصحيحة: A. صحيحة (True)\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\n- ألم الأسنان الجوي (Aerodontalgia / Barodontalgia): هو ألم سني حاد يحدث بسبب انخفاض الضغط الجوي في الارتفاعات العالية (كما في الطيران) أو ازدياده السريع (أثناء الغوص العميق).\n- الآلية: انحباس فقاعات الغازات الناتجة عن نخر قديم، أو وجود التهاب لب مسبق تحت سريري (Subclinical pulpitis)؛ فعند انخفاض الضغط يتمدد الغاز المحبوس داخل حجرة العاج الصلبة فيضغط بشدة على الأعصاب الحية مسبباً ألماً حاداً لا يطاق.",
    "answer_en": "Correct Answer: A. True\nAerodontalgia (barodontalgia) is toothache provoked by changes in ambient barometric pressure in individuals with subclinical pulpitis.",
    "quote_ref": "Aerodontalgia: Tooth pain precipitated by decrease in atmospheric pressure at high altitudes in teeth with asymptomatic chronic pulpitis.",
    "source_reference": {
      "id": "ref_q_oral_path_pulp_08_1",
      "question_id": "q_oral_path_pulp_08",
      "sheet_id": "sh_oral_path_pulp_02",
      "page_number": 15,
      "source_type": "exact",
      "source_text": "Aerodontalgia: Tooth pain precipitated by decrease in atmospheric pressure at high altitudes in teeth with asymptomatic chronic pulpitis.",
      "source_text_normalized": "aerodontalgia tooth pain precipitated by decrease in atmospheric pressure at high altitudes in teeth with asymptomatic chronic pulpitis",
      "text_anchor": "Aerodontalgia: Tooth pain precipitated by decrease in atmosp",
      "bounding_box": null,
      "confidence": 0.95,
      "verification_status": "verified"
    }
  },
  {
    "id": "q_oral_path_periapical_01",
    "subject_id": "oral-diseases",
    "subject_name_ar": "أمراض الفم (Oral Pathology)",
    "subject_name_en": "Oral Pathology",
    "sheet_id": "sh_oral_path_periapical_03",
    "sheet_title_ar": "المحاضرة 3: أمراض الأنسجة المحيطة بالذروة (Diseases of Periapical Tissues)",
    "sheet_title_en": "Lecture 3: Diseases of Periapical Tissues",
    "page_ref": 2,
    "topic_ar": "التهاب الرباط الذروي الحاد (Acute Periapical Periodontitis)",
    "topic_en": "Acute Periapical Periodontitis & Clinical Features",
    "type": "past_exam",
    "source": "past_exam",
    "tags": [
      "Periapical Periodontitis",
      "Percussion",
      "Non-vital tooth"
    ],
    "text_ar": "في التهاب الأنسجة المحيطة بذروة السن الحاد (Acute Periapical Periodontitis)، أي من العبارات التالية صحيحة ومميزة سريرياً:",
    "text_en": "Regarding acute periapical periodontitis, which of the following statements is clinically characteristic:",
    "options_ar": [
      "الألم يكون غير محدد ولا يعرف المريض أي سن يؤلمه",
      "المنبهات الساخنة والباردة لا تثير ألماً إذا كان اللب متنخراً وميتاً (Non-vital pulp)، ويكون السن مؤلماً جداً عند العض والمضغ والقرع (Tenderness to percussion)",
      "الصورة الشعاعية تظهر دائماً هلالاً كبيراً من التخلخل الشعاعي العظمي المستدير",
      "السن يكون حياً وسليماً 100% دائماً"
    ],
    "options_en": [
      "Pain is poorly localized and the patient cannot identify the tooth",
      "Hot and cold stimuli do not cause pain in a non-vital tooth, and the tooth is exquisitely painful to biting and percussion",
      "Radiographs always show a massive cystic radiolucency",
      "The tooth is always completely vital and sound"
    ],
    "correct_index": 1,
    "answer_ar": "الإجابة الصحيحة: B\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\nالفرق الجوهري بين التهاب اللب (Pulpitis) والتهاب الذروة (Periapical periodontitis):\n1. في التهاب الذروة (Periapical): الالتهاب انتقل إلى ألياف الرباط اللثوي (PDL) الغنية جداً بمستقبلات الحس العميق (Proprioceptors)؛ لذا فإن المريض يحدد السن بإصبعه فوراً (Well-localized pain) ويشعر بأن السن مرتفع قليلاً في سنخه (Tooth feels high/raised).\n2. الحساسية للحرارة: بما أن اللب متنخر وغير حي (Non-vital)، فإن البرودة والحرارة لن تثير حساسية عصبية لبية.\n3. الفحص الإشعاعي المبكر: لا يظهر ذوباناً عظمياً كبيراً في البداية، بل يظهر خط الرباط اللثوي طبيعياً أو متسعاً قليلاً فقط (Normal or slight widening of PDL space).",
    "answer_en": "Correct Answer: B\nIn acute apical periodontitis from a necrotic pulp, thermal testing is negative, but the tooth is exquisitely tender to percussion and mastication.",
    "quote_ref": "In acute periapical periodontitis, the tooth is tender to pressure and percussion, and thermal stimuli elicit no response if the pulp is necrotic.",
    "source_reference": {
      "id": "ref_q_oral_path_periapical_01_1",
      "question_id": "q_oral_path_periapical_01",
      "sheet_id": "sh_oral_path_periapical_03",
      "page_number": 2,
      "source_type": "exact",
      "source_text": "In acute periapical periodontitis, the tooth is tender to pressure and percussion, and thermal stimuli elicit no response if the pulp is necrotic.",
      "source_text_normalized": "in acute periapical periodontitis the tooth is tender to pressure and percussion and thermal stimuli elicit no response if the pulp is necrotic",
      "text_anchor": "In acute periapical periodontitis, the tooth is tender to pr",
      "bounding_box": null,
      "confidence": 0.95,
      "verification_status": "verified"
    }
  },
  {
    "id": "q_oral_path_periapical_02",
    "subject_id": "oral-diseases",
    "subject_name_ar": "أمراض الفم (Oral Pathology)",
    "subject_name_en": "Oral Pathology",
    "sheet_id": "sh_oral_path_periapical_03",
    "sheet_title_ar": "المحاضرة 3: أمراض الأنسجة المحيطة بالذروة (Diseases of Periapical Tissues)",
    "sheet_title_en": "Lecture 3: Diseases of Periapical Tissues",
    "page_ref": 4,
    "topic_ar": "أسباب ومكونات الورم الحبيبي الذروي (Periapical Granuloma)",
    "topic_en": "Etiology & Histopathology of Periapical Granuloma",
    "type": "past_exam",
    "source": "past_exam",
    "tags": [
      "Periapical Granuloma",
      "Cholesterol Clefts",
      "Foam Cells",
      "Histopathology"
    ],
    "text_ar": "الخلايا الرغوية (Foam cells)، شقوق الكولسترول (Cholesterol clefts)، أجسام الهيالين، وصبغة الهيموسيديرين تعتبر علامات نسيجية مميزة تشاهد في:",
    "text_en": "Foam cells, hyaline bodies, cholesterol clefts, and hemosiderin pigmentation are characteristic histopathological features of:",
    "options_ar": [
      "الكيس الذروي (Radicular cyst)",
      "الورم الحبيبي الذروي (Periapical granuloma)",
      "الخراج اللثوي الجانبي الحاد (Acute lateral periodontal abscess)",
      "كلاهما معاً: الكيس الذروي والورم الحبيبي الذروي (Both A & B)"
    ],
    "options_en": [
      "Radicular cyst",
      "Periapical granuloma",
      "Lateral periodontal abscess",
      "Both A and B (Radicular cyst and Periapical granuloma)"
    ],
    "correct_index": 3,
    "answer_ar": "الإجابة الصحيحة: D. كلاهما معاً (Both A and B)\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\nسؤال دقيق ومشهور جداً في امتحانات Oral Pathology:\n- الورم الحبيبي الذروي (Periapical granuloma) والكيس الذروي (Radicular cyst) يشتركان في نفس البيئة الإمراضية للالتهاب المزمن للسن غير الحي:\n  1) خلايا رغوية (Foam cells / Lipid-laden macrophages) ناتجة عن بلعمة حطام الخلايا المتنخرة.\n  2) شقوق الكولسترول (Cholesterol clefts) المحاطة بخلايا عملاقة غريبة (Foreign-body giant cells).\n  3) صبغة الهيموسيديرين (Hemosiderin) نتيجة النزوف الموضعية وتكسر كريات الدم الحمراء.\n  4) أجسام روشتون / الهيالين (Rushton / Hyaline bodies) في ظهارة الكيس.\nالفرق النسيجي الحاسم بينهما: الكيس الذروي يحتوي على تجويف حقيقي مبطن بالظهارة (Epithelium-lined cavity)، بينما الجرانولوما كتلة مصمتة من النسيج الحبيبي الالتهابي (Granulation tissue).",
    "answer_en": "Correct Answer: D. Both A and B\nBoth periapical granuloma and radicular cyst share chronic inflammatory elements including cholesterol clefts, foam cells, and hemosiderin.",
    "quote_ref": "Histopathology of apical granuloma and cyst: Chronic granulation tissue with cholesterol clefts, foreign body giant cells, foam cells, and hemosiderin.",
    "source_reference": {
      "id": "ref_q_oral_path_periapical_02_1",
      "question_id": "q_oral_path_periapical_02",
      "sheet_id": "sh_oral_path_periapical_03",
      "page_number": 4,
      "source_type": "exact",
      "source_text": "Histopathology of apical granuloma and cyst: Chronic granulation tissue with cholesterol clefts, foreign body giant cells, foam cells, and hemosiderin.",
      "source_text_normalized": "histopathology of apical granuloma and cyst chronic granulation tissue with cholesterol clefts foreign body giant cells foam cells and hemosiderin",
      "text_anchor": "Histopathology of apical granuloma and cyst: Chronic granula",
      "bounding_box": null,
      "confidence": 0.95,
      "verification_status": "verified"
    }
  },
  {
    "id": "q_oral_path_periapical_03",
    "subject_id": "oral-diseases",
    "subject_name_ar": "أمراض الفم (Oral Pathology)",
    "subject_name_en": "Oral Pathology",
    "sheet_id": "sh_oral_path_periapical_03",
    "sheet_title_ar": "المحاضرة 3: أمراض الأنسجة المحيطة بالذروة (Diseases of Periapical Tissues)",
    "sheet_title_en": "Lecture 3: Diseases of Periapical Tissues",
    "page_ref": 6,
    "topic_ar": "الكيس الذروي وحيوية السن (Radicular Cyst & Vitality)",
    "topic_en": "Radicular Cyst & Tooth Vitality",
    "type": "past_exam",
    "source": "past_exam",
    "tags": [
      "Radicular Cyst",
      "Vitality Test",
      "Non-vital"
    ],
    "text_ar": "تظهر الصورة الشعاعية للكيس الجذري الذروي (Radicular cyst) منطقة تخلخل شعاعي محددة بوضوح محاطة بحافة ظليلة رقيقة حول ذروة سن حي (Vital tooth). هذه العبارة:",
    "text_en": "A radiographic picture of a radicular cyst may show a well-defined radiolucency surrounded by a narrow radio-opaque margin around the apex of a vital tooth. This statement is:",
    "options_ar": [
      "صحيحة (True)",
      "خاطئة (False) — لأن الكيس الذروي لا ينشأ إلا حول ذروة سن غير حي وميت اللب (Non-vital tooth)"
    ],
    "options_en": [
      "True",
      "False (because radicular cyst arises exclusively associated with a non-vital tooth)"
    ],
    "correct_index": 1,
    "answer_ar": "الإجابة الصحيحة: B. خاطئة (False)\n\n📌 فخ امتحاني يتكرر باستمرار (Classic Exam Trap):\n- الكيس الجذري الذروي (Radicular / Apical cyst) هو كيس التهابي (Inflammatory cyst).\n- ينشأ حصراً بسبب تنخر وموت لب السن (Non-vital / Necrotic pulp)؛ حيث تنتقل السموم البكتيرية إلى الذروة فتحفز بقايا مالاسيز الظهارية (Epithelial rests of Malassez) على التكاثر.\n- إذا كان السن حياً (Vital tooth) ووجدت بقعة شفافة شعاعياً عند الذروة، فالاحتمال يكون آفة أخرى مثل الورم الملاطي النمائي (Periapical cemental dysplasia) أو ورماً سنياً آخر، وليس كيساً جذرياً!",
    "answer_en": "Correct Answer: B. False\nA radicular cyst is an inflammatory cyst that develops ONLY in association with a non-vital tooth following pulp necrosis.",
    "quote_ref": "Radicular cysts arise from proliferation of the rests of Malassez in response to inflammation caused by non-vital teeth.",
    "source_reference": {
      "id": "ref_q_oral_path_periapical_03_1",
      "question_id": "q_oral_path_periapical_03",
      "sheet_id": "sh_oral_path_periapical_03",
      "page_number": 6,
      "source_type": "exact",
      "source_text": "Radicular cysts arise from proliferation of the rests of Malassez in response to inflammation caused by non-vital teeth.",
      "source_text_normalized": "radicular cysts arise from proliferation of the rests of malassez in response to inflammation caused by non vital teeth",
      "text_anchor": "Radicular cysts arise from proliferation of the rests of Mal",
      "bounding_box": null,
      "confidence": 0.95,
      "verification_status": "verified"
    }
  },
  {
    "id": "q_oral_path_periapical_04",
    "subject_id": "oral-diseases",
    "subject_name_ar": "أمراض الفم (Oral Pathology)",
    "subject_name_en": "Oral Pathology",
    "sheet_id": "sh_oral_path_periapical_03",
    "sheet_title_ar": "المحاضرة 3: أمراض الأنسجة المحيطة بالذروة (Diseases of Periapical Tissues)",
    "sheet_title_en": "Lecture 3: Diseases of Periapical Tissues",
    "page_ref": 7,
    "topic_ar": "بطانة الكيس الذروي النسيجية (Epithelial Lining)",
    "topic_en": "Histopathology of Radicular Cyst Lining",
    "type": "past_exam",
    "source": "past_exam",
    "tags": [
      "Radicular Cyst",
      "Epithelium",
      "Stratified Squamous"
    ],
    "text_ar": "نسيجياً، يُبطن الكيس الجذري الذروي الالتهابي (Radicular cyst) بطبقة من الظهارة:",
    "text_en": "Histologically, the radicular cyst is lined by a layer of:",
    "options_ar": [
      "ظهارة مطبقة حرشفية غير متقرنة (Stratified squamous epithelium, non-keratinized)",
      "ظهارة عمادية مطبقة كاذبة مهدبة فقط",
      "ظهارة مكعبة بسيطة أحادية الطبقة",
      "لا يحتوي على أي بطانة ظهارية لأنه كيس كاذب"
    ],
    "options_en": [
      "Stratified squamous epithelium which is non-keratinized",
      "Pseudostratified ciliated columnar epithelium only",
      "Simple cuboidal epithelium",
      "No epithelial lining because it is a pseudocyst"
    ],
    "correct_index": 0,
    "answer_ar": "الإجابة الصحيحة: A. ظهارة مطبقة حرشفية غير متقرنة\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\n- الكيس الذروي كيس حقيقي (True cyst) لأنه يمتلك تجويفاً مبطناً بالظهارة.\n- نوع الظهارة السائدة في الغالبية الساحقة هي: ظهارة مطبقة حرشفية غير متقرنة (Non-keratinized stratified squamous epithelium)، مستمدة من تكاثر بقايا مالاسيز في الرباط السني.\n- في الحالات الملتهبة بشدة تظهر الظهارة متضخمة وغير منتظمة مع وذمة بين خلوية (Spongiosis).\n⚠️ ملحوظة: الكيس الكيراتيني السني (OKC) يتميز بظهارة متقرنة نظيرة التقرن (Parakeratinized) ومنتظمة بسمك 6-8 خلايا، بينما الكيس الذروي غير متقرن (Non-keratinized).",
    "answer_en": "Correct Answer: A. Stratified squamous epithelium, non-keratinized\nRadicular cysts are lined by non-keratinized stratified squamous epithelium derived from stimulated rests of Malassez.",
    "quote_ref": "The radicular cyst is lined by non-keratinized stratified squamous epithelium.",
    "source_reference": {
      "id": "ref_q_oral_path_periapical_04_1",
      "question_id": "q_oral_path_periapical_04",
      "sheet_id": "sh_oral_path_periapical_03",
      "page_number": 7,
      "source_type": "exact",
      "source_text": "The radicular cyst is lined by non-keratinized stratified squamous epithelium.",
      "source_text_normalized": "the radicular cyst is lined by non keratinized stratified squamous epithelium",
      "text_anchor": "The radicular cyst is lined by non-keratinized stratified sq",
      "bounding_box": null,
      "confidence": 0.95,
      "verification_status": "verified"
    }
  },
  {
    "id": "q_oral_path_periapical_05",
    "subject_id": "oral-diseases",
    "subject_name_ar": "أمراض الفم (Oral Pathology)",
    "subject_name_en": "Oral Pathology",
    "sheet_id": "sh_oral_path_periapical_03",
    "sheet_title_ar": "المحاضرة 3: أمراض الأنسجة المحيطة بالذروة (Diseases of Periapical Tissues)",
    "sheet_title_en": "Lecture 3: Diseases of Periapical Tissues",
    "page_ref": 10,
    "topic_ar": "ذبحة لودفيغ والتهاب النسج الخلوية (Ludwig's Angina)",
    "topic_en": "Ludwig's Angina & Fascial Space Infections",
    "type": "past_exam",
    "source": "past_exam",
    "tags": [
      "Ludwig's Angina",
      "Cellulitis",
      "Fascial Spaces",
      "Complications"
    ],
    "text_ar": "ذبحة لودفيغ (Ludwig's angina) هي مضاعفة خطيرة لانتشار الخراج الذروي، وتُعرَّف سريرياً بأنها:",
    "text_en": "Ludwig's angina is clinically defined as:",
    "options_ar": [
      "التهاب نسج خلوية موضعي بسيط في الشفة السفلية فقط",
      "التهاب نسج خلوية حاد شديد وسريع الانتشار يصيب حيزات تحت الفك وتحت اللسان وتحت الذقن ثنائية الجانب (Submandibular, sublingual, submental spaces)",
      "ورم حبيبي حميد في قاع الفم",
      "التهاب مزمن محدود في الغدة النكفية"
    ],
    "options_en": [
      "Mild localized cellulitis of the lower lip only",
      "Severe, rapidly spreading cellulitis involving bilateral submandibular, sublingual, and submental spaces",
      "Benign granulomatous tumor of the floor of the mouth",
      "Chronic localized inflammation of the parotid gland"
    ],
    "correct_index": 1,
    "answer_ar": "الإجابة الصحيحة: B\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\n- ذبحة لودفيغ (Ludwig's Angina): هي التهاب حاد منتشر وشديد في النسج الضامة الرخوة (Cellulitis)، ينشأ غالباً من انتقال إنتان خراج ذروي من أرحاء الفك السفلي الثانية أو الثالثة (لأن جذورها تمتد أسفل العضلة الضرسية اللامية Mylohyoid).\n- تصيب الحيزات الفراغية الثلاثة ثنائية الجانب:\n  1. Submandibular spaces\n  2. Sublingual spaces\n  3. Submental space\n- الخطورة السريرية القصوى: تؤدي لتورم صلب يشبه اللوح الخشبي (Woody / Brawny edema) في قاع الفم يرفع اللسان للأعلى والخلف، مسبباً انسداداً حاداً في مجرى التنفس (Respiratory obstruction)، وصعوبة في البلع والكلام، وتعتبر حالة طوارئ جراحية مهددة للحياة.",
    "answer_en": "Correct Answer: B. Severe cellulitis involving submandibular, sublingual, and submental spaces\nLudwig's angina is a life-threatening, bilateral cellulitis involving the floor of the mouth and neck spaces.",
    "quote_ref": "Ludwig's angina is a severe, rapidly spreading cellulitis of the submandibular, sublingual, and submental spaces.",
    "source_reference": {
      "id": "ref_q_oral_path_periapical_05_1",
      "question_id": "q_oral_path_periapical_05",
      "sheet_id": "sh_oral_path_periapical_03",
      "page_number": 10,
      "source_type": "exact",
      "source_text": "Ludwig's angina is a severe, rapidly spreading cellulitis of the submandibular, sublingual, and submental spaces.",
      "source_text_normalized": "ludwig s angina is a severe rapidly spreading cellulitis of the submandibular sublingual and submental spaces",
      "text_anchor": "Ludwig's angina is a severe, rapidly spreading cellulitis of",
      "bounding_box": null,
      "confidence": 0.95,
      "verification_status": "verified"
    }
  },
  {
    "id": "q_test_fallback_01",
    "subject_id": "oral-diseases",
    "subject_name_ar": "أمراض الفم (Oral Pathology)",
    "subject_name_en": "Oral Pathology",
    "sheet_id": "sh_oral_path_caries_01",
    "sheet_title_ar": "المحاضرة 1: تسوس الأسنان (Dental Caries)",
    "sheet_title_en": "Lecture 1: Dental Caries",
    "page_ref": 2,
    "topic_ar": "اختبار حالة تعذر التحديد (Fallback Case)",
    "topic_en": "Fallback Verification Test",
    "type": "practice",
    "source": "practice",
    "tags": [
      "Fallback Test",
      "Unresolved Source"
    ],
    "text_ar": "سؤال تجريبي لاختبار حالة عدم العثور على النص الدقيق داخل الشيت (Fallback Case):",
    "text_en": "Verification question to test Fallback UI when exact source quote is not found in sheet:",
    "options_ar": [
      "خيار تجريبي أ",
      "خيار تجريبي ب (الصحيح)",
      "خيار تجريبي ج",
      "خيار تجريبي د"
    ],
    "options_en": [
      "Test Option A",
      "Test Option B (Correct)",
      "Test Option C",
      "Test Option D"
    ],
    "correct_index": 1,
    "answer_ar": "الإجابة المعتمدة: B. هذا السؤال مخصص للتحقق من عدم اختلاق أي تظليل عشوائي (No Guessing).",
    "answer_en": "Correct Answer: B. This question verifies fallback card with zero fake highlights.",
    "quote_ref": "Dental implants are directly integrated into the alveolar bone after osteotomy.",
    "source_reference": {
      "id": "ref_q_test_fallback_01_1",
      "question_id": "q_test_fallback_01",
      "sheet_id": "sh_oral_path_caries_01",
      "page_number": 2,
      "source_type": "exact",
      "source_text": "Dental implants are directly integrated into the alveolar bone after osteotomy.",
      "source_text_normalized": "dental implants are directly integrated into the alveolar bone after osteotomy",
      "text_anchor": "Dental implants are directly integrated",
      "bounding_box": null,
      "confidence": 0.2,
      "verification_status": "unresolved"
    }
  }
];
  }

  getDefaultFlashcards() {
    return [];
  }

  getDefaultSheets() {
    return [
      {
        id: "sh_oral_path_caries_01",
        subject_id: "oral-diseases",
        subject_name_ar: "أمراض الفم (Oral Pathology)",
        subject_code: "DS380",
        order_index: 1,
        title: "Lecture 1: Dental Caries",
        title_ar: "المحاضرة 1: تسوس الأسنان (Dental Caries)",
        title_en: "Lecture 1: Dental Caries",
        doctor_name: "د. أسماء سلام الغرياني",
        doctor: "د. أسماء سلام الغرياني",
        pages: 11,
        pages_count: 11,
        size: "530 KB",
        pdf_url: "data/sheets/dental-caries-dr-asmaa.pdf",
        download_url: "data/sheets/dental-caries-dr-asmaa.pdf",
        pdf_source: "local",
        date: "2026-09-14"
      },
      {
        id: "sh_prev_infection_control_01",
        subject_id: "preventive",
        subject_name_ar: "طب الأسنان الوقائي (Preventive Dentistry)",
        subject_code: "DS381",
        order_index: 1,
        title: "Lecture 1: Dental Infection Control",
        title_ar: "المحاضرة 1: مكافحة العدوى في طب الأسنان (Dental Infection Control)",
        title_en: "Lecture 1: Dental Infection Control",
        doctor_name: "د. حنان عمران",
        doctor: "د. حنان عمران",
        pages: 6,
        pages_count: 6,
        size: "316 KB",
        pdf_url: "data/sheets/dental-infection-control-prev.pdf",
        download_url: "data/sheets/dental-infection-control-prev.pdf",
        pdf_source: "local",
        date: "2026-09-15"
      },
      {
        id: "sh_omdr_patient_evaluation_01",
        subject_id: "omdr",
        subject_name_ar: "طب الفم والتشخيص والأشعة 1 (OMDR)",
        subject_code: "DS361",
        order_index: 1,
        title: "Lecture 1: Approach to the Evaluation of the Patient",
        title_ar: "المحاضرة 1: مدخل إلى تقييم وفحص المريض (Approach to Evaluation of Patient)",
        title_en: "Lecture 1: Approach to the Evaluation of the Patient",
        doctor_name: "د. عبدالعظيم عياد قداد",
        doctor: "د. عبدالعظيم عياد قداد",
        pages: 12,
        pages_count: 12,
        size: "1.1 MB",
        pdf_url: "data/sheets/approach-to-patient-evaluation-omdr.pdf",
        download_url: "data/sheets/approach-to-patient-evaluation-omdr.pdf",
        pdf_source: "local",
        date: "2026-09-15"
      },
      {
        id: "sh_omfs_local_anesthesia_01",
        subject_id: "omfs",
        subject_name_ar: "جراحة الفم والوجه والفكين 1 (OMFS)",
        subject_code: "DS341",
        order_index: 1,
        title: "Lecture 1: Local Anesthesia",
        title_ar: "المحاضرة 1: التخدير الموضعي في جراحة الفم (Local Anesthesia)",
        title_en: "Lecture 1: Local Anesthesia",
        doctor_name: "د. هشام شمبش",
        doctor: "د. هشام شمبش",
        pages: 80,
        pages_count: 80,
        size: "3.5 MB",
        pdf_url: "data/sheets/local-anesthesia-omfs.pdf",
        download_url: "data/sheets/local-anesthesia-omfs.pdf",
        pdf_source: "local",
        date: "2026-09-20"
      },
      {
        id: "sh_oral_path_pulp_02",
        subject_id: "oral-diseases",
        subject_name_ar: "أمراض الفم (Oral Pathology)",
        subject_code: "DS380",
        order_index: 2,
        title: "Lecture 2: Diseases of the Dental Pulp",
        title_ar: "المحاضرة 2: أمراض واضطرابات لب الأسنان (Diseases of Dental Pulp)",
        title_en: "Lecture 2: Diseases of the Dental Pulp",
        doctor_name: "د. عائشة أبوبكر شنان",
        doctor: "د. عائشة أبوبكر شنان",
        pages: 16,
        pages_count: 16,
        size: "1.1 MB",
        pdf_url: "data/sheets/disorders-of-dental-pulp-oral-path.pdf",
        download_url: "data/sheets/disorders-of-dental-pulp-oral-path.pdf",
        pdf_source: "local",
        date: "2026-09-21"
      },
      {
        id: "sh_prev_dental_caries_02",
        subject_id: "preventive",
        subject_name_ar: "طب الأسنان الوقائي (Preventive Dentistry)",
        subject_code: "DS381",
        order_index: 2,
        title: "Lecture 2: Dental Caries & Current Concepts of Etiology",
        title_ar: "المحاضرة 2: تسوس الأسنان والنظريات الحديثة للأسباب (Dental Caries)",
        title_en: "Lecture 2: Dental Caries & Current Concepts of Etiology",
        doctor_name: "د. حنان عمران",
        doctor: "د. حنان عمران",
        pages: 5,
        pages_count: 5,
        size: "253 KB",
        pdf_url: "data/sheets/dental-caries-prev-dr-hanan.pdf",
        download_url: "data/sheets/dental-caries-prev-dr-hanan.pdf",
        pdf_source: "local",
        date: "2026-09-22"
      },
      {
        id: "sh_cons_dentin_pulp_01",
        subject_id: "cons-endo",
        subject_name_ar: "العلاج التحفظي وعلاج الجذور 2 (Cons & Endo)",
        subject_code: "DS311",
        order_index: 1,
        title: "Lecture 1: The Dentin-Pulp Complex",
        title_ar: "المحاضرة 1: معقد العاج واللب (The Dentin-Pulp Complex)",
        title_en: "Lecture 1: The Dentin-Pulp Complex",
        doctor_name: "د. آمال كشلاف",
        doctor: "د. آمال كشلاف",
        pages: 23,
        pages_count: 23,
        size: "1.7 MB",
        pdf_url: "data/sheets/dentin-pulp-complex-cons.pdf",
        download_url: "data/sheets/dentin-pulp-complex-cons.pdf",
        pdf_source: "local",
        date: "2026-09-23"
      },
      {
        id: "sh_ortho_intro_terminology_01",
        subject_id: "ortho",
        subject_name_ar: "تقويم الأسنان 1 (Orthodontics)",
        subject_code: "DS371",
        order_index: 1,
        title: "Lecture 1: Introduction and Terminology",
        title_ar: "المحاضرة 1: مقدمة ومصطلحات تقويم الأسنان (Introduction and Terminology)",
        title_en: "Lecture 1: Introduction and Terminology",
        doctor_name: "د. بسمة جنديلة",
        doctor: "د. بسمة جنديلة",
        pages: 72,
        pages_count: 72,
        size: "2.3 MB",
        pdf_url: "data/sheets/ortho-intro-and-terminology.pdf",
        download_url: "data/sheets/ortho-intro-and-terminology.pdf",
        pdf_source: "local",
        date: "2026-09-23"
      },
      {
        id: "sh_oral_path_periapical_03",
        subject_id: "oral-diseases",
        subject_name_ar: "أمراض الفم (Oral Pathology)",
        subject_code: "DS380",
        order_index: 3,
        title: "Lecture 3: Diseases of Periapical Tissues",
        title_ar: "المحاضرة 3: أمراض الأنسجة المحيطة بالذروة (Diseases of Periapical Tissues)",
        title_en: "Lecture 3: Diseases of Periapical Tissues",
        doctor_name: "د. عائشة أبوبكر شنان",
        doctor: "د. عائشة أبوبكر شنان",
        pages: 12,
        pages_count: 12,
        size: "450 KB",
        pdf_url: "data/sheets/diseases-of-periapical-tissues-oral-path.pdf",
        download_url: "data/sheets/diseases-of-periapical-tissues-oral-path.pdf",
        pdf_source: "local",
        date: "2026-09-28"
      }
    ];
  }

  getDefaultRecordings() {
    return [
      {
        id: "rec_oral_path_caries_01",
        sheet_id: "sh_oral_path_caries_01",
        subject_id: "oral-diseases",
        title: "تسجيل المحاضرة الأولى: Dental Caries",
        title_ar: "تسجيل المحاضرة الأولى: Dental Caries",
        title_en: "Lecture 1 Audio: Dental Caries",
        doctor: "د. أسماء سلام الغرياني",
        date: "2026-09-14",
        audio_url: "https://t.me/ravenrecords/13",
        telegram_link: "https://t.me/ravenrecords/13"
      },
      {
        id: "rec_prev_infection_control_01",
        sheet_id: "sh_prev_infection_control_01",
        subject_id: "preventive",
        title: "تسجيل المحاضرة الأولى: Dental Infection Control",
        title_ar: "تسجيل المحاضرة الأولى: Dental Infection Control",
        title_en: "Lecture 1 Audio: Dental Infection Control",
        doctor: "د. حنان عمران",
        date: "2026-09-15",
        audio_url: "https://t.me/ravenrecords/18",
        telegram_link: "https://t.me/ravenrecords/18"
      },
      {
        id: "rec_omdr_patient_evaluation_01",
        sheet_id: "sh_omdr_patient_evaluation_01",
        subject_id: "omdr",
        title: "تسجيل المحاضرة الأولى: Approach to the Evaluation of the Patient",
        title_ar: "تسجيل المحاضرة الأولى: Approach to the Evaluation of the Patient",
        title_en: "Lecture 1 Audio: Approach to the Evaluation of the Patient",
        doctor: "د. عبدالعظيم عياد قداد",
        date: "2026-09-15",
        audio_url: "https://t.me/ravenrecords/21",
        telegram_link: "https://t.me/ravenrecords/21"
      },
      {
        id: "rec_omfs_local_anesthesia_01",
        sheet_id: "sh_omfs_local_anesthesia_01",
        subject_id: "omfs",
        title: "تسجيل المحاضرة الأولى: Local Anesthesia (Part 1)",
        title_ar: "تسجيل المحاضرة الأولى: Local Anesthesia (الجزء 1 - سلايدات 1-41)",
        title_en: "Lecture 1 Audio: Local Anesthesia (Part 1 - Slides 1-41)",
        doctor: "د. هشام شمبش",
        date: "2026-09-20",
        audio_url: "https://t.me/ravenrecords/33",
        telegram_link: "https://t.me/ravenrecords/33",
        part: "Part 1 (Slides 1-41)"
      },
      {
        id: "rec_oral_path_pulp_02",
        sheet_id: "sh_oral_path_pulp_02",
        subject_id: "oral-diseases",
        title: "تسجيل المحاضرة الثانية: Diseases of Pulp & Periapical Tissues (Part 1)",
        title_ar: "تسجيل المحاضرة الثانية: أمراض اللب والأنسجة الذروية (الجزء 1)",
        title_en: "Lecture 2 Audio: Diseases of Pulp & Periapical Tissues (Part 1)",
        doctor: "د. عائشة أبوبكر شنان",
        date: "2026-09-21",
        audio_url: "https://t.me/ravenrecords/35",
        telegram_link: "https://t.me/ravenrecords/35",
        part: "Part 1"
      },
      {
        id: "rec_prev_dental_caries_02",
        sheet_id: "sh_prev_dental_caries_02",
        subject_id: "preventive",
        title: "تسجيل المحاضرة الثانية: Dental Caries",
        title_ar: "تسجيل المحاضرة الثانية: Dental Caries",
        title_en: "Lecture 2 Audio: Dental Caries",
        doctor: "د. حنان عمران",
        date: "2026-09-22",
        audio_url: "https://t.me/ravenrecords/38",
        telegram_link: "https://t.me/ravenrecords/38"
      },
      {
        id: "rec_cons_dentin_pulp_01",
        sheet_id: "sh_cons_dentin_pulp_01",
        subject_id: "cons-endo",
        title: "تسجيل المحاضرة الأولى: The Dentin-Pulp Complex",
        title_ar: "تسجيل المحاضرة الأولى: The Dentin-Pulp Complex",
        title_en: "Lecture 1 Audio: The Dentin-Pulp Complex",
        doctor: "د. آمال كشلاف",
        date: "2026-09-23",
        audio_url: "https://t.me/ravenrecords/40",
        telegram_link: "https://t.me/ravenrecords/40"
      },
      {
        id: "rec_ortho_intro_terminology_01",
        sheet_id: "sh_ortho_intro_terminology_01",
        subject_id: "ortho",
        title: "تسجيل المحاضرة الأولى: Introduction and Terminology (Part 1)",
        title_ar: "تسجيل المحاضرة الأولى: Introduction and Terminology (الجزء 1 - حتى سلايد 22)",
        title_en: "Lecture 1 Audio: Introduction and Terminology (Part 1 - Up to Slide 22)",
        doctor: "د. بسمة جنديلة",
        date: "2026-09-23",
        audio_url: "https://t.me/ravenrecords/42",
        telegram_link: "https://t.me/ravenrecords/42",
        part: "Part 1 (Slides 1-22)"
      },
      {
        id: "rec_oral_path_periapical_03",
        sheet_id: "sh_oral_path_periapical_03",
        subject_id: "oral-diseases",
        title: "تسجيل المحاضرة الثالثة: Diseases of Periapical Tissues",
        title_ar: "تسجيل المحاضرة الثالثة: أمراض الأنسجة الذروية (Diseases of Periapical Tissues)",
        title_en: "Lecture 3 Audio: Diseases of Periapical Tissues",
        doctor: "د. عائشة أبوبكر شنان",
        date: "2026-09-28",
        audio_url: "https://t.me/ravenrecords/65",
        telegram_link: "https://t.me/ravenrecords/65"
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
