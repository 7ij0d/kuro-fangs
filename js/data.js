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
        } catch (err) {}
      });
      if (this.pdfStore && typeof this.pdfStore.deletePdf === 'function') {
        this.pdfStore.deletePdf('sh-fixed-provisional').catch(() => {});
        this.pdfStore.deletePdf('sh_admin_1789336010378').catch(() => {});
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
    if (!subjectId) return list;
    list = list.filter(s => s.subject_id === subjectId);
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
    return [];
  }

  getDefaultFlashcards() {
    return [];
  }

  getDefaultSheets() {

    return [];
  }

  /**
   * Export all currently active sheets as a formatted JSON string
   * ready for data/sheets.json or GitHub API commit
   */
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
