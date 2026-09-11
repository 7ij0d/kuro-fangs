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
    this.loaded = false;

    // High quality tailored cover banners stored locally in assets/covers/
    this.subjectCovers = {
      'gen-med': 'assets/covers/gen-med.jpg',
      'gen-surgery': 'assets/covers/gen-surgery.jpg',
      'fixed-pros': 'assets/covers/fixed-pros.jpg',
      'omfs': 'assets/covers/omfs.jpg',
      'oral-diseases': 'assets/covers/oral-diseases.jpg',
      'endo': 'assets/covers/endo.jpg',
      'omdr': 'assets/covers/omdr.jpg',
      'preventive': 'assets/covers/preventive.jpg',
      'cons-endo': 'assets/covers/cons-endo.jpg',
      'ortho': 'assets/covers/ortho.jpg',
      'pedo': 'assets/covers/pedo.jpg',
      'pediatric': 'assets/covers/pediatric.jpg',
      'removable-pros': 'assets/covers/removable-pros.jpg'
    };
  }

  async init() {
    if (this.loaded) return;

    try {
      const [
        subjectsRes,
        sheetsRes,
        alertsRes,
        doctorsRes,
        questionsRes,
        flashcardsRes,
        examsRes,
        reqRes
      ] = await Promise.allSettled([
        fetch('data/subjects.json').then(r => r.json()),
        fetch('data/sheets.json').then(r => r.json()),
        fetch('data/alerts.json').then(r => r.json()),
        fetch('data/doctors.json').then(r => r.json()),
        fetch('data/questions.json').then(r => r.json()),
        fetch('data/flashcards.json').then(r => r.json()),
        fetch('data/previous_exams.json').then(r => r.json()),
        fetch('data/requirements.json').then(r => r.json())
      ]);

      if (subjectsRes.status === 'fulfilled' && subjectsRes.value?.subjects) {
        this.subjects = subjectsRes.value.subjects;
      }
      if (sheetsRes.status === 'fulfilled' && sheetsRes.value?.sheets) {
        this.sheets = sheetsRes.value.sheets;
      }
      if (alertsRes.status === 'fulfilled' && alertsRes.value?.alerts) {
        this.alerts = alertsRes.value.alerts;
      }
      if (doctorsRes.status === 'fulfilled' && doctorsRes.value?.doctors) {
        this.doctors = doctorsRes.value.doctors;
      }
      if (questionsRes.status === 'fulfilled' && questionsRes.value?.questions) {
        this.questions = questionsRes.value.questions;
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
    } catch (err) {
      console.warn('Could not load all JSON files via fetch, using fallback data:', err);
    }

    const defaultSubjects = this.getDefaultSubjects();
    if (!this.subjects || this.subjects.length === 0) {
      this.subjects = defaultSubjects;
    } else {
      this.subjects.forEach(s => {
        const def = defaultSubjects.find(d => d.id === s.id);
        if (def) {
          s.doctor_name_ar = s.doctor_name_ar || def.doctor_name_ar;
          s.doctor_name_en = s.doctor_name_en || def.doctor_name_en;
          s.progress = s.progress !== undefined ? s.progress : def.progress;
          s.lectures_count = s.lectures_count || def.lectures_count;
          s.summaries_count = s.summaries_count || def.summaries_count;
          s.exams_count = s.exams_count || def.exams_count;
          s.is_popular = s.is_popular !== undefined ? s.is_popular : def.is_popular;
        }
      });
    }

    // Attach high-res cover images to each subject
    this.subjects.forEach(s => {
      s.cover_image = s.cover_image || this.subjectCovers[s.id] || `assets/covers/${s.id}.jpg`;
    });

    if (!this.alerts || this.alerts.length === 0) {
      this.alerts = this.getDefaultAlerts();
    }
    if (!this.sheets || this.sheets.length === 0) {
      this.sheets = this.getDefaultSheets();
    }

    this.loaded = true;
  }

  getSubjects() {
    return this.subjects;
  }

  getSubjectById(id) {
    return this.subjects.find(s => s.id === id);
  }

  getSheetsBySubject(subjectId) {
    return this.sheets.filter(s => s.subject_id === subjectId);
  }

  getRecentSheets(limit = 6) {
    return [...this.sheets].slice(0, limit);
  }

  getAlerts() {
    return this.alerts;
  }

  getQuestionsBySubject(subjectId) {
    if (!subjectId) return this.questions;
    return this.questions.filter(q => q.subject_id === subjectId);
  }

  getFlashcards(subjectId) {
    if (!subjectId) return this.flashcards;
    return this.flashcards.filter(f => f.subject_id === subjectId);
  }

  // 12 Official Dental Subjects Fallback (Academia System Enriched)
  getDefaultSubjects() {
    return [
      {
        id: 'gen-med',
        name_ar: 'الطب العام (الباطنة)',
        name_en: 'General Medicine',
        code: 'MED-301',
        doctor_name_ar: 'د. طارق الزوي',
        doctor_name_en: 'Dr. Tarek Al-Zawi',
        progress: 75,
        lectures_count: 16,
        summaries_count: 5,
        exams_count: 2,
        is_popular: false,
        sheet_count: 20,
        description_ar: 'أمراض الباطنة والقلب والغدد وعلاقتها بممارسة طب الأسنان',
        description_en: 'Internal medicine, cardiovascular and systemic diseases in dental practice'
      },
      {
        id: 'gen-surgery',
        name_ar: 'الجراحة العامة',
        name_en: 'General Surgery',
        code: 'GS-301',
        doctor_name_ar: 'د. محمود حسن',
        doctor_name_en: 'Dr. Mahmoud Hassan',
        progress: 60,
        lectures_count: 18,
        summaries_count: 4,
        exams_count: 2,
        is_popular: false,
        sheet_count: 22,
        description_ar: 'أساسيات الجراحة العامة والتعقيم والتئام الجروح والنزيف والحروق',
        description_en: 'General surgical principles, wound healing, hemostasis, and shock management'
      },
      {
        id: 'fixed-pros',
        name_ar: 'الاستعاضة السنية الثابتة 2',
        name_en: 'Fixed Prosthodontics II',
        code: 'FP-302',
        doctor_name_ar: 'د. نادية عبدالحميد',
        doctor_name_en: 'Dr. Nadia Abdelhamid',
        progress: 85,
        lectures_count: 18,
        summaries_count: 6,
        exams_count: 3,
        is_popular: true,
        sheet_count: 18,
        description_ar: 'تحضير التيجان والجسور وخطوط الإنهاء والطبعات المطاطية',
        description_en: 'Crown and bridge preparation, finish lines, and impression techniques'
      },
      {
        id: 'omfs',
        name_ar: 'جراحة الفم والوجه والفكين 1',
        name_en: 'Oral & Maxillofacial Surgery I',
        code: 'OMS-301',
        doctor_name_ar: 'د. يوسف التاجوري',
        doctor_name_en: 'Dr. Youssef Al-Tajouri',
        progress: 80,
        lectures_count: 14,
        summaries_count: 6,
        exams_count: 2,
        is_popular: true,
        sheet_count: 16,
        description_ar: 'التخدير الموضعي وتقنيات قلع الأسنان ومضاعفات القلع',
        description_en: 'Local anesthesia techniques, exodontia protocols, and surgical complications'
      },
      {
        id: 'oral-diseases',
        name_ar: 'علم أمراض الفم',
        name_en: 'Oral Diseases / Pathology',
        code: 'OD-301',
        doctor_name_ar: 'د. فاطمة المصري',
        doctor_name_en: 'Dr. Fatima Al-Masri',
        progress: 90,
        lectures_count: 20,
        summaries_count: 7,
        exams_count: 3,
        is_popular: true,
        sheet_count: 24,
        description_ar: 'دراسة الأمراض والآفات التي تصيب الأنسجة الفموية والأورام',
        description_en: 'Oral mucosal lesions, cysts, odontogenic tumors, and bone pathologies'
      },
      {
        id: 'endo',
        name_ar: 'علاج لب الأسنان 1 (علاج العصب)',
        name_en: 'Endodontics I',
        code: 'END-301',
        doctor_name_ar: 'د. خالد الصالح',
        doctor_name_en: 'Dr. Khaled Al-Saleh',
        progress: 80,
        lectures_count: 16,
        summaries_count: 5,
        exams_count: 2,
        is_popular: true,
        sheet_count: 16,
        description_ar: 'تشخيص أمراض اللب والذروة وتنظيف وتوسيع القنوات وحشو الجذور',
        description_en: 'Pulp pathology, access cavity design, biomechanical cleaning, and obturation'
      },
      {
        id: 'omdr',
        name_ar: 'طب الفم والتشخيص والأشعة 1',
        name_en: 'OMDR I',
        code: 'OMDR-301',
        doctor_name_ar: 'د. عمر القاضي',
        doctor_name_en: 'Dr. Omar Al-Qadi',
        progress: 70,
        lectures_count: 17,
        summaries_count: 4,
        exams_count: 2,
        is_popular: false,
        sheet_count: 19,
        description_ar: 'الفحص السريري وقراءة وتفسير صور الأشعة البانورامية وتطبيقاتها',
        description_en: 'Clinical examination, panoramic radiographs, and radiographic interpretation'
      },
      {
        id: 'preventive',
        name_ar: 'طب الأسنان الوقائي',
        name_en: 'Preventive Dentistry',
        code: 'PREV-301',
        doctor_name_ar: 'د. هدى الورفلي',
        doctor_name_en: 'Dr. Huda Al-Warfali',
        progress: 65,
        lectures_count: 12,
        summaries_count: 3,
        exams_count: 2,
        is_popular: false,
        sheet_count: 14,
        description_ar: 'طرق الوقاية من نخر الأسنان، الفلورايد، والمواد السادة للشقوق',
        description_en: 'Caries prevention, fluoride modalities, pit and fissure sealants, and oral hygiene'
      },
      {
        id: 'cons-endo',
        name_ar: 'العلاج التحفظي 2',
        name_en: 'Cons & Endo II',
        code: 'CONS-302',
        doctor_name_ar: 'د. سارة المنفي',
        doctor_name_en: 'Dr. Sara Al-Manfi',
        progress: 85,
        lectures_count: 18,
        summaries_count: 6,
        exams_count: 3,
        is_popular: true,
        sheet_count: 20,
        description_ar: 'حشوات الكومبوزيت المتقدمة والترميمات التجميلية للأسنان',
        description_en: 'Advanced composite restorations, amalgam techniques, and aesthetic dentistry'
      },
      {
        id: 'ortho',
        name_ar: 'تقويم الأسنان 1',
        name_en: 'Orthodontics I',
        code: 'ORTH-301',
        doctor_name_ar: 'د. أميرة السويحلي',
        doctor_name_en: 'Dr. Amira Al-Sweihli',
        progress: 55,
        lectures_count: 14,
        summaries_count: 4,
        exams_count: 2,
        is_popular: false,
        sheet_count: 15,
        description_ar: 'تصنيف إنجل، نمو وتطور الوجه والفكين، وتشخيص سوء الإطباق',
        description_en: 'Angle classification, craniofacial growth, and malocclusion diagnostics'
      },
      {
        id: 'pediatric',
        name_ar: 'طب أسنان الأطفال 1',
        name_en: 'Pediatric Dentistry I',
        code: 'PEDO-301',
        doctor_name_ar: 'د. ليلى فوزي',
        doctor_name_en: 'Dr. Laila Fawzi',
        progress: 75,
        lectures_count: 15,
        summaries_count: 4,
        exams_count: 2,
        is_popular: false,
        sheet_count: 15,
        description_ar: 'التعامل السلوكي مع الأطفال، تخدير الأطفال، وبتر لب الأسنان اللبنية',
        description_en: 'Behavior management, pediatric pulp therapy, and space maintainers'
      },
      {
        id: 'removable-pros',
        name_ar: 'الاستعاضة السنية المتحركة 2',
        name_en: 'Removable Prosthodontics II',
        code: 'RP-302',
        doctor_name_ar: 'د. نادر الشريف',
        doctor_name_en: 'Dr. Nader Al-Sharif',
        progress: 70,
        lectures_count: 16,
        summaries_count: 5,
        exams_count: 2,
        is_popular: false,
        sheet_count: 17,
        description_ar: 'الأطقم الجزئية المتحركة وتصميم الكروم كوبالت والروابط الإطباقية',
        description_en: 'Removable partial dentures, cobalt-chromium framework design, and clasps'
      }
    ];
  }

  getDefaultAlerts() {
    return [
      {
        id: 'alt-1',
        title: 'Midterm Exam Schedule: OMFS I',
        message: 'Exam scheduled on Sunday Oct 25 at 10:00 AM in Main Lecture Hall.',
        type: 'urgent',
        created_at: '2 days ago'
      }
    ];
  }

  getDefaultSheets() {
    return [
      { id: 'sh-1', title: 'Local Anesthesia Techniques & Landmarks', subject_id: 'omfs', subject_name: 'Oral Surgery I', doctor_name: 'Dr. Youssef', date: '2026-09-09', type: 'Lecture Sheet', file_type: 'PDF' }
    ];
  }
}

window.DATA = new DataService();
