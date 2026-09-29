const fs = require('fs');
const path = require('path');

const questionsFilePath = path.join(__dirname, '../data/questions.json');
const existingData = JSON.parse(fs.readFileSync(questionsFilePath, 'utf8'));

const newQuestions = [
  // =========================================================================
  // 1. DENTAL CARIES (Lecture 1: د. أسماء الغرياني - sh_oral_path_caries_01)
  // =========================================================================
  {
    id: "q_oral_path_caries_01",
    subject_id: "oral-diseases",
    subject_name_ar: "أمراض الفم (Oral Pathology)",
    subject_name_en: "Oral Pathology",
    sheet_id: "sh_oral_path_caries_01",
    sheet_title_ar: "المحاضرة 1: تسوس الأسنان (Dental Caries)",
    sheet_title_en: "Lecture 1: Dental Caries",
    page_ref: 2,
    topic_ar: "تعريف ومراحل تسوس الأسنان",
    topic_en: "Definition & Mechanism of Dental Caries",
    type: "past_exam",
    source: "past_exam",
    tags: ["Dental Caries", "Demineralization", "Definition"],
    text_ar: "تسوس الأسنان (Dental Caries) هو مرض بكتيري يصيب الأنسجة المتكلسة للسن، ويحدث عبر مرحلتين رئيسيتين هما:",
    text_en: "Dental caries is a bacterial disease of calcified tooth structure which occurs in two stages:",
    options_ar: [
      "إعادة التمعدن للأنسجة غير العضوية متبوعة بتدمير الأنسجة العضوية",
      "إزالة المعادن (Demineralization) للمادة غير العضوية متبوعة بتدمير المادة العضوية (Destruction of organic substance)",
      "تدمير المادة العضوية أولاً متبوعاً بإزالة المعادن غير العضوية",
      "تليف لب السن متبوعاً بتحلل المينا"
    ],
    options_en: [
      "Re-mineralization of inorganic followed by destruction of organic substance",
      "De-mineralization of inorganic followed by destruction of organic substance",
      "Destruction of organic followed by de-mineralization of inorganic substance",
      "Pulp fibrosis followed by enamel breakdown"
    ],
    correct_index: 1,
    answer_ar: "الإجابة الصحيحة: B\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\nتسوس الأسنان هو مرض إنتاني بكتيري (Infectious bacterial disease) يصيب أنسجة السن الصلبة (المينا، العاج، الملاط). الآلية المرضية تتكون حتماً من مرحلتين متعاقبتين بالترتيب:\n1. المرحلة الأولى: تحلل وإزالة المعادن من المكونات غير العضوية (Demineralization of inorganic substance) بفعل الأحماض الناتجة عن تخمر السكريات بواسطة بكتيريا اللويحة.\n2. المرحلة الثانية: تدمير وتفكيك المكونات والمصفوفة العضوية (Destruction of organic substance) بواسطة الأنزيمات المحللة للبروتين (Proteolytic enzymes).\n⚠️ نقطة امتحانية متكررة: تأكد دائماً أن إزالة التمعدن غير العضوي تأتي أولاً في المينا، ثم يتبعها تدمير المادة العضوية.",
    answer_en: "Correct Answer: B\nDental caries involves: 1. Demineralization of inorganic component by bacterial acids, followed by 2. Destruction of the organic matrix by proteolytic enzymes.",
    quote_ref: "Dental caries is characterized by demineralization of the inorganic substance of the tooth followed by destruction of the organic substance."
  },
  {
    id: "q_oral_path_caries_02",
    subject_id: "oral-diseases",
    subject_name_ar: "أمراض الفم (Oral Pathology)",
    subject_name_en: "Oral Pathology",
    sheet_id: "sh_oral_path_caries_01",
    sheet_title_ar: "المحاضرة 1: تسوس الأسنان (Dental Caries)",
    sheet_title_en: "Lecture 1: Dental Caries",
    page_ref: 3,
    topic_ar: "العوامل الأساسية لنشوء التسوس (Keyes Triad)",
    topic_en: "Etiological Factors of Dental Caries",
    type: "past_exam",
    source: "past_exam",
    tags: ["Etiology", "Dental Plaque", "Keyes Triad"],
    text_ar: "العوامل الأساسية المتفاعلة والضرورية معاً لبدء ونشوء تسوس الأسنان هي:",
    text_en: "The factors needed for development and initiation of dental caries are:",
    options_ar: [
      "سطح السن (المضيف)",
      "البكتيريا المسببة في لويحة الأسنان (Dental plaque)",
      "الكربوهيدرات والسكريات (الركيزة الغذائية) والزمن (Time)",
      "كل ما سبق معاً (All of the above)"
    ],
    options_en: [
      "Tooth surface (Host)",
      "Bacteria in dental plaque (Microorganisms)",
      "Carbohydrates (Substrate) and Time",
      "All of the above"
    ],
    correct_index: 3,
    answer_ar: "الإجابة الصحيحة: D. كل ما سبق معاً\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\nلا يحدث التسوس بتوفر عامل واحد بمفرده؛ بل يتطلب تداخل 4 عوامل رئيسية تُعرف بمخطط كيز الرباعي (Keyes / Newbrun Tetrad):\n1. المضيف وسطح السن (Host & tooth surface): وجود سن ذي قابلية ومينا ضعيفة التمعدن أو شقوق عميقة.\n2. الميكروبات (Microorganisms): وجود بكتيريا مولدة للحمض ومتحملة له (Acidogenic & Aciduric) مثل S. mutans.\n3. الركيزة الغذائية (Substrate): سكريات قابلة للتخمر (خاصة السكروز).\n4. الزمن (Time): بقاء الحمض على سطح السن لفترة زمنية كافية لتجاوز قدرة اللعاب على معادلة الحموضة.",
    answer_en: "Correct Answer: D. All of the above\nCaries requires the simultaneous interaction of host (tooth), microbial plaque, substrate (dietary fermentable carbohydrate), and sufficient time.",
    quote_ref: "The four primary factors in caries etiology: tooth, dental plaque bacteria, fermentable carbohydrate substrate, and time."
  },
  {
    id: "q_oral_path_caries_03",
    subject_id: "oral-diseases",
    subject_name_ar: "أمراض الفم (Oral Pathology)",
    subject_name_en: "Oral Pathology",
    sheet_id: "sh_oral_path_caries_01",
    sheet_title_ar: "المحاضرة 1: تسوس الأسنان (Dental Caries)",
    sheet_title_en: "Lecture 1: Dental Caries",
    page_ref: 5,
    topic_ar: "البكتيريا الأكثر إحداثاً للتسوس",
    topic_en: "Cariogenic Bacteria & S. Mutans",
    type: "past_exam",
    source: "past_exam",
    tags: ["Streptococcus mutans", "Bacteriology", "Plaque"],
    text_ar: "البكتيريا الأكثر كفاءة وأهمية في بدء تسوس مينا الأسنان (Initiation of caries) وتكوين اللويحة السنية هي:",
    text_en: "In the role of bacteria and dental plaque in dental caries, the most cariogenic bacteria implicated in initiation is:",
    options_ar: [
      "مجموعة العِقديات الطافرة (Mutans streptococci group)",
      "الخيوط الهوائية (Anaerobic filaments)",
      "الملتويات الفموية (Spirochetes)",
      "المتفطرة السلية (Mycobacterium tuberculosis)"
    ],
    options_en: [
      "Mutans streptococci group",
      "Anaerobic filaments",
      "Spirochetes filaments",
      "Mycobacterium tuberculosis"
    ],
    correct_index: 0,
    answer_ar: "الإجابة الصحيحة: A. مجموعة Mutans streptococci\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\n- Streptococcus mutans هي البكتيريا الرئيسية المسؤولة عن بدء التسوس (Initiation) لأنها:\n  1) تنتج ببتيدات سكرية خارجية لاصقة (Extracellular glucans) تمكنها من الالتصاق الصلب بسطح المينا.\n  2) سريعة جداً في تخمير السكروز وإنتاج حمض اللاكتيك بكثافة.\n  3) بعد 24 ساعة من تكوين اللويحة، تتكاثر وتصل نسبتها إلى 83% من الفلورا البكتيرية في الآفة المبكرة.\n⚠️ انتبه للمقارنة الامتحانية: بكتيريا العصيات اللبنية (Lactobacilli) مسؤولة عن تقدم وتطور التسوس في العاج (Progression/Cavitation)، بينما S. mutans مسؤولة عن البداية (Initiation)، وبكتيريا Actinomyces ترتبط بتسوس الجذور (Root caries).",
    answer_en: "Correct Answer: A. Mutans streptococci group\nStreptococcus mutans is the primary initiator of enamel caries due to its rapid acid production and extracellular polysaccharide (glucan) synthesis.",
    quote_ref: "Mutans streptococci are the primary organisms responsible for the initiation of enamel caries."
  },
  {
    id: "q_oral_path_caries_04",
    subject_id: "oral-diseases",
    subject_name_ar: "أمراض الفم (Oral Pathology)",
    subject_name_en: "Oral Pathology",
    sheet_id: "sh_oral_path_caries_01",
    sheet_title_ar: "المحاضرة 1: تسوس الأسنان (Dental Caries)",
    sheet_title_en: "Lecture 1: Dental Caries",
    page_ref: 6,
    topic_ar: "المنطقة الشفافة في تسوس المينا (Translucent Zone)",
    topic_en: "Translucent Zone of Enamel Caries",
    type: "past_exam",
    source: "past_exam",
    tags: ["Enamel Caries", "Translucent Zone", "Porosity", "Histopathology"],
    text_ar: "في دراسة تسوس المينا بالمجهر المستقطب، تعتبر المنطقة الشفافة (Translucent zone) أكثر مسامية من المينا الطبيعية وتحتوي على مسامات بحجم يبلغ حوالي:",
    text_en: "In enamel caries, the translucent zone is slightly more porous than normal enamel and contains:",
    options_ar: [
      "1% من حجم المسامات (1% by volume of pores)",
      "5% من حجم المسامات (5% by volume pores)",
      "10% من حجم المسامات (10% by volume pores)",
      "25% من حجم المسامات (25% by volume pores)"
    ],
    options_en: [
      "1% by volume of pores",
      "5% by volume of pores",
      "10% by volume of pores",
      "25% by volume of pores"
    ],
    correct_index: 0,
    answer_ar: "الإجابة الصحيحة: A. 1% من حجم المسامات\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\nالمينا الطبيعية السليمة مساميتها ضئيلة جداً ولا تتجاوز 0.1% من حجمها.\nعند حدوث التسوس المبكر (Incipient enamel lesion)، تظهر 4 مناطق نسيجية من العمق إلى السطح:\n1. المنطقة الشفافة (Translucent zone): هي أعمق منطقة وأول تغير نسيجي يمكن رصده (Advancing front). تصبح مساميتها 1% (عشرة أضعاف المينا الطبيعية).\n2. المنطقة المظلمة (Dark zone): تليها نحو السطح، مساميتها 2% إلى 4%، وتحدث فيها عمليات إعادة تمعدن جزئية (Remineralization).\n3. جسم الآفة (Body of lesion): أكبر منطقة، مساميتها من 5% إلى 25% (أكثر المناطق فقداناً للمعادن).\n4. المنطقة السطحية (Surface zone): طبقة سطحية تبدو سليمة نسبياً ومحمية بالفلورايد واللعاب ومساميتها تقارب 1% فقط.",
    answer_en: "Correct Answer: A. 1% by volume of pores\nThe translucent zone is the deepest advancing front of enamel caries and has a pore volume of 1% (compared to 0.1% in normal enamel).",
    quote_ref: "Translucent zone: This is the advancing front of the lesion. It contains about 1% pore volume compared to 0.1% in sound enamel."
  },
  {
    id: "q_oral_path_caries_05",
    subject_id: "oral-diseases",
    subject_name_ar: "أمراض الفم (Oral Pathology)",
    subject_name_en: "Oral Pathology",
    sheet_id: "sh_oral_path_caries_01",
    sheet_title_ar: "المحاضرة 1: تسوس الأسنان (Dental Caries)",
    sheet_title_en: "Lecture 1: Dental Caries",
    page_ref: 6,
    topic_ar: "مناطق تسوس المينا (Zones of Enamel Caries)",
    topic_en: "Histopathology of Enamel Caries",
    type: "past_exam",
    source: "past_exam",
    tags: ["Zones of Caries", "Enamel Caries", "Histopathology"],
    text_ar: "جميع ما يلي يعتبر من المناطق النسيجية الأربعة المعترف بها في تسوس المينا (Enamel Caries) ما عدا:",
    text_en: "All of the following are considered recognized zones of enamel caries EXCEPT:",
    options_ar: [
      "المنطقة الشفافة (Translucent zone)",
      "المنطقة المظلمة (Dark zone)",
      "جسم الآفة (Body of the lesion)",
      "منطقة العاج الارتكاسي / الثانوي (Secondary/Reactionary dentine zone)"
    ],
    options_en: [
      "Translucent zone",
      "Dark zone",
      "Body of the lesion",
      "Secondary or reactionary dentine zone"
    ],
    correct_index: 3,
    answer_ar: "الإجابة الصحيحة: D. منطقة العاج الارتكاسي / الثانوي\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\nسؤال كلاسيكي يتكرر في امتحانات أطباء الأسنان؛ مناطق تسوس المينا الأربعة هي حصراً:\n1. Translucent zone\n2. Dark zone\n3. Body of the lesion\n4. Surface zone\nبينما العاج الارتكاسي (Reactionary / Secondary dentine) هو نسيج دفاعي يفرزه مصورات العاج (Odontoblasts) داخل حجرة اللب والعاج، وليس منطقة في تسوس المينا!",
    answer_en: "Correct Answer: D. Secondary or reactionary dentine zone\nEnamel caries has 4 zones: Translucent zone, Dark zone, Body of lesion, and Surface zone. Reactionary dentine belongs to dentin-pulp defense.",
    quote_ref: "The four distinct zones of early enamel caries: Translucent zone, Dark zone, Body of the lesion, and Surface zone."
  },
  {
    id: "q_oral_path_caries_06",
    subject_id: "oral-diseases",
    subject_name_ar: "أمراض الفم (Oral Pathology)",
    subject_name_en: "Oral Pathology",
    sheet_id: "sh_oral_path_caries_01",
    sheet_title_ar: "المحاضرة 1: تسوس الأسنان (Dental Caries)",
    sheet_title_en: "Lecture 1: Dental Caries",
    page_ref: 8,
    topic_ar: "مناطق تسوس العاج (Zones of Dentine Caries)",
    topic_en: "Histopathology of Dentine Caries",
    type: "past_exam",
    source: "past_exam",
    tags: ["Dentine Caries", "Zones of Dentine", "Histopathology"],
    text_ar: "تتضمن مناطق تسوس العاج (Dentine Caries) عدة طبقات دفاعية وهجومية، أي من التالي ليس من مناطق تسوس العاج:",
    text_en: "All of the following are zones of dentine caries, EXCEPT:",
    options_ar: [
      "منطقة إزالة التمعدن المتقدمة (Zone of demineralization)",
      "المنطقة المظلمة (Dark zone)",
      "منطقة الغزو البكتيري (Zone of bacterial invasion)",
      "منطقة التصلب التكلسي (Zone of sclerosis / Translucent dentine)"
    ],
    options_en: [
      "Zone of demineralization",
      "Dark zone",
      "Zone of bacterial invasion",
      "Zone of sclerosis (translucent dentine)"
    ],
    correct_index: 1,
    answer_ar: "الإجابة الصحيحة: B. المنطقة المظلمة (Dark zone)\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\n- المنطقة المظلمة (Dark zone) هي منطقة خاصة بـ **تسوس المينا فقط**!\n- أما مناطق تسوس العاج (Dentine Caries) من السطح الخارجي إلى اللب فهي:\n  1. منطقة التفكك والتنخر (Zone of destruction / necrotic debris).\n  2. منطقة الغزو البكتيري والتكاثر (Zone of bacterial invasion / infected dentine).\n  3. منطقة إزالة التمعدن الرائدة (Zone of demineralization / affected dentine).\n  4. منطقة التصلب الدفاعي (Zone of sclerosis / translucent dentine) حيث تتكلس الأنابيب العاجية لإغلاق الطريق أمام البكتيريا.\n  5. العاج الارتكاسي الثالثي (Reactionary / Reparative dentine).",
    answer_en: "Correct Answer: B. Dark zone\nDark zone is a zone of enamel caries, not dentine caries.",
    quote_ref: "Zones of dentinal caries include destruction, bacterial invasion, demineralization, and tubular sclerosis."
  },
  {
    id: "q_oral_path_caries_07",
    subject_id: "oral-diseases",
    subject_name_ar: "أمراض الفم (Oral Pathology)",
    subject_name_en: "Oral Pathology",
    sheet_id: "sh_oral_path_caries_01",
    sheet_title_ar: "المحاضرة 1: تسوس الأسنان (Dental Caries)",
    sheet_title_en: "Lecture 1: Dental Caries",
    page_ref: 9,
    topic_ar: "العاج الارتكاسي الدفاعي (Reactionary Dentine)",
    topic_en: "Reactionary Dentine Formation & Timing",
    type: "past_exam",
    source: "past_exam",
    tags: ["Reactionary Dentine", "Pulp Defense", "Dentinogenesis"],
    text_ar: "يبدأ العاج الارتكاسي (Reactionary dentine) بالتكون كاستجابة دفاعية بعد 3 أسابيع من تخريش خلايا مصورات العاج، ويصل سمكه إلى حوالي 0.1 مم بعد مرور:",
    text_en: "Reactionary dentine starts to develop after three weeks of onset of odontoblasts irritation and reaches about 0.1 mm after:",
    options_ar: [
      "10 أيام",
      "20 يوماً",
      "50 يوماً",
      "100 يوم (100 days)"
    ],
    options_en: [
      "10 days",
      "20 days",
      "50 days",
      "100 days"
    ],
    correct_index: 3,
    answer_ar: "الإجابة الصحيحة: D. 100 يوم\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\nعند تعرض خلايا Odontoblasts لتنبيه معتدل ناتج عن التسوس أو الحفر، تبدأ بإفراز مصفوفة عاج جديدة لحماية اللب:\n- تبدأ هذه الاستجابة بالظهور بعد 3 أسابيع من بدء التحفيز.\n- يزداد معدل الترسيب حتى يصل سمك العاج الارتكاسي إلى حوالي 0.1 مليمتر عند اليوم رقم 100.\n- هذا العاج يعتبر استجابة حيوية نشطة (Vital reaction) من خلايا اللب السليمة لحماية نفسها من الاختراق الجرثومي.",
    answer_en: "Correct Answer: D. 100 days\nReactionary dentine initiates ~3 weeks post-irritation and achieves approximately 0.1 mm thickness after 100 days.",
    quote_ref: "Reactionary dentine starts to develop after three weeks of onset of odontoblast irritation and reaches about 0.1 mm after 100 days."
  },
  {
    id: "q_oral_path_caries_08",
    subject_id: "oral-diseases",
    subject_name_ar: "أمراض الفم (Oral Pathology)",
    subject_name_en: "Oral Pathology",
    sheet_id: "sh_oral_path_caries_01",
    sheet_title_ar: "المحاضرة 1: تسوس الأسنان (Dental Caries)",
    sheet_title_en: "Lecture 1: Dental Caries",
    page_ref: 10,
    topic_ar: "التسوس المتوقف (Arrested Caries)",
    topic_en: "Arrested Caries Characteristics",
    type: "past_exam",
    source: "past_exam",
    tags: ["Arrested Caries", "Sclerosis", "Remineralization"],
    text_ar: "يتميز التسوس المتوقف (Arrested caries) في العاج بسطح فائق التمعدن والمتصلب (Sclerotic) نتيجة إعادة التمعدن من السوائل الفموية والتناول الكافي للفلورايد:",
    text_en: "Arrested caries of dentine has a hypermineralized surface (sclerosis) due to remineralization from oral fluids and high fluoride intake. This statement is:",
    options_ar: [
      "عبارة صحيحة (True)",
      "عبارة خاطئة (False)"
    ],
    options_en: [
      "True",
      "False"
    ],
    correct_index: 0,
    answer_ar: "الإجابة الصحيحة: A. عبارة صحيحة (True)\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\nعند إزالة العوامل المسببة للتسوس أو تحسين التنظيف الفموي وتطبيق الفلورايد، يمكن أن تتوقف الآفة النخرية وتتحول إلى (Arrested caries):\n- سريرياً: يصبح قاع الآفة صلباً كالعاج السليم، ويتغير لونه إلى البني الداكن أو الأسود بسبب ترسب أصبغة الطعام والشوائب.\n- نسيجياً: يتصلب السطح ويصبح فائق التمعدن (Hypermineralized sclerotic dentine) بفضل امتصاص المعادن والفوسفات والفلورايد من اللعاب.",
    answer_en: "Correct Answer: A. True\nArrested dentinal caries develops a hard, darkly pigmented, hypermineralized surface from salivary remineralization and fluoride.",
    quote_ref: "Arrested caries of dentine has a hypermineralized surface due to remineralization from oral fluids."
  },
  {
    id: "q_oral_path_caries_09",
    subject_id: "oral-diseases",
    subject_name_ar: "أمراض الفم (Oral Pathology)",
    subject_name_en: "Oral Pathology",
    sheet_id: "sh_oral_path_caries_01",
    sheet_title_ar: "المحاضرة 1: تسوس الأسنان (Dental Caries)",
    sheet_title_en: "Lecture 1: Dental Caries",
    page_ref: 11,
    topic_ar: "التسوس الجامح الحاد (Rampant Caries)",
    topic_en: "Rampant Caries Definition",
    type: "past_exam",
    source: "past_exam",
    tags: ["Rampant Caries", "Acute Caries", "Classification"],
    text_ar: "يُعرَّف التسوس الجامح أو الحاد (Rampant or Acute Caries) بأنه:",
    text_en: "Rampant or acute caries is clinically described as:",
    options_ar: [
      "تسوس بطيء جداً يستغرق سنوات طويلة ليصيب سناً واحداً",
      "تسوس سريع الانتشار وشديد التدمير يشمل أسناناً متعددة في وقت واحد حتى تلك المقاومة عادة للتسوس (Rapidly progressing involving many teeth)",
      "تسوس يقتصر على القواطع السفلية فقط",
      "تسوس متوقف ومكتسب للون الأسود"
    ],
    options_en: [
      "Very slow progression affecting only a single tooth over years",
      "Rapidly progressing caries involving multiple teeth simultaneously, including typically immune surfaces",
      "Caries restricted strictly to lower incisors",
      "Arrested dark black lesion"
    ],
    correct_index: 1,
    answer_ar: "الإجابة الصحيحة: B\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\n- التسوس الجامح (Rampant caries): هو تسوس مفاجئ وسريع الانتشار يصيب عدداً كبيراً من الأسنان في آن واحد، ويتميز باختراق الأسطح الملساء التي نادراً ما تصاب بالتسوس كالقواطع السفلية وأسطح الأعناق.\n- أكثر ما يشاهد عند الأطفال الصغار (Nursing bottle caries)، أو المراهقين المتناولين للحلوى والسكريات بكثرة، أو المرضى المصابين بجفاف الفم الشديد (Xerostomia) بعد العلاج الإشعاعي.",
    answer_en: "Correct Answer: B. Rapidly progressing caries involving multiple teeth\nRampant caries is characterized by widespread, rapid cavitation affecting multiple teeth and unusual surfaces.",
    quote_ref: "Rampant caries: A suddenly appearing, rapidly burrowing type of caries resulting in early pulp involvement in multiple teeth."
  },

  // =========================================================================
  // 2. DISEASES OF THE DENTAL PULP (Lecture 2: د. عائشة شنان - sh_oral_path_pulp_02)
  // =========================================================================
  {
    id: "q_oral_path_pulp_03",
    subject_id: "oral-diseases",
    subject_name_ar: "أمراض الفم (Oral Pathology)",
    subject_name_en: "Oral Pathology",
    sheet_id: "sh_oral_path_pulp_02",
    sheet_title_ar: "المحاضرة 2: أمراض واضطرابات لب الأسنان (Diseases of Dental Pulp)",
    sheet_title_en: "Lecture 2: Diseases of the Dental Pulp",
    page_ref: 3,
    topic_ar: "المظاهر السريرية لالتهاب اللب الحاد (Acute Pulpitis)",
    topic_en: "Clinical Features of Acute Pulpitis",
    type: "past_exam",
    source: "past_exam",
    tags: ["Acute Pulpitis", "Pain Localization", "Thermal Stimuli"],
    text_ar: "سريرياً، يتظاهر التهاب لب الأسنان الحاد (Acute Pulpitis) بالمظاهر التالية:",
    text_en: "Clinically, acute pulpitis is manifested by:",
    options_ar: [
      "ألم شديد ونابض (Severe throbbing pain)",
      "عدم قدرة المريض على تحديد السن المصاب بدقة (Cannot localize to a particular tooth)",
      "تفاقم الألم وازدياده بالمنبهات الحرارية الساخنة والباردة ووضعية الاستلقاء",
      "كل ما سبق صحيح (All of the above)"
    ],
    options_en: [
      "Severe throbbing pain",
      "Patient cannot localize the pain to a particular tooth",
      "Pain aggravated by thermal stimuli (hot and cold) and recumbent position",
      "All of the above"
    ],
    correct_index: 3,
    answer_ar: "الإجابة الصحيحة: D. كل ما سبق صحيح\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\nالتهاب اللب الحاد غير القابل للشفاء (Irreversible Acute Pulpitis) يتميز بخصائص سريرية ثابتة في الامتحانات:\n1. طبيعة الألم: ألم حاد، شديد، نابض ومستمر لساعات (Severe throbbing pain).\n2. عدم القدرة على تحديد المكان (Poor localization): لأن اللب يحتوي على ألياف C الحسية ولا يحتوي على مستقبلات حس عميق (Proprioceptors)؛ لذا يشعر المريض بألم منتشر أو منعكس (Referred pain) في الفك أو الوجه دون معرفة السن بالتحديد.\n3. المحفزات: يزداد بالحرارة والبرودة ويستمر حتى بعد زوال المنبه، كما يزداد عند النوم أو الاستلقاء بسبب ارتفاع الضغط الوريدي داخل رأس المريض وحجرة اللب المحاطة بجدران عاجية غير مرنة.",
    answer_en: "Correct Answer: D. All of the above\nAcute pulpitis features severe throbbing pain, lack of proprioceptors (poor localization/referred pain), and exacerbation by thermal stimuli and recumbency.",
    quote_ref: "Acute pulpitis is characterized by severe throbbing pain, poorly localized by the patient, and aggravated by hot and cold stimuli."
  },
  {
    id: "q_oral_path_pulp_04",
    subject_id: "oral-diseases",
    subject_name_ar: "أمراض الفم (Oral Pathology)",
    subject_name_en: "Oral Pathology",
    sheet_id: "sh_oral_path_pulp_02",
    sheet_title_ar: "المحاضرة 2: أمراض واضطرابات لب الأسنان (Diseases of Dental Pulp)",
    sheet_title_en: "Lecture 2: Diseases of the Dental Pulp",
    page_ref: 5,
    topic_ar: "التهاب اللب المزمن التكاثري (Pulp Polyp)",
    topic_en: "Chronic Hyperplastic Pulpitis (Pulp Polyp)",
    type: "past_exam",
    source: "past_exam",
    tags: ["Pulp Polyp", "Hyperplastic Pulpitis", "Granulation Tissue"],
    text_ar: "يُطلق مصطلح (Pulp Polyp) في أمراض لب الأسنان على:",
    text_en: "The term 'Pulp Polyp' is also called:",
    options_ar: [
      "التهاب اللب المزمن التكاثري المفرط (Chronic hyperplastic pulpitis)",
      "التهاب اللب الحاد التكاثري (Acute hyperplastic pulpitis)",
      "الورم الحبيبي الذروي (Periapical granuloma)",
      "خلل التنسج الظهاري (Epithelial dysplasia)"
    ],
    options_en: [
      "Chronic hyperplastic pulpitis",
      "Acute hyperplastic pulpitis",
      "Periapical granuloma",
      "Epithelial dysplasia"
    ],
    correct_index: 0,
    answer_ar: "الإجابة الصحيحة: A. التهاب اللب المزمن التكاثري (Chronic hyperplastic pulpitis)\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\n- بوليب اللب (Pulp polyp) هو نمو لحمي أحمر فاقع من النسيج الحبيبي (Granulation tissue) يبرز خارج نخر عاجي مفتوح وكبير.\n- يحدث نموذجياً عند الأطفال واليافعين في الأسنان اللبنية أو الأرحاء الدائمة الفتية، لسببين حاسمين:\n  1) وجود فتحة نخرية واسعة تسمح للنسيج بالتمدد دون أن ينحبس أو ينضغط.\n  2) التروية الدموية الغزيرة جداً والمناعة العالية للب الفتي.\n- مع الوقت، تتساقط خلايا ظهارية من مخاطية الفم على سطحه ويتغطى بطبقة من الظهارة المطبقة الحرشفية (Stratified squamous epithelium) ليصبح غير مؤلم تقريباً عند اللمس.",
    answer_en: "Correct Answer: A. Chronic hyperplastic pulpitis\nPulp polyp occurs in young teeth with open carious cavities and rich vascular supply, presenting as an exuberant mass of granulation tissue.",
    quote_ref: "Chronic hyperplastic pulpitis (pulp polyp): An excessive proliferation of chronically inflamed pulp tissue occurring in teeth of children and young adults."
  },
  {
    id: "q_oral_path_pulp_05",
    subject_id: "oral-diseases",
    subject_name_ar: "أمراض الفم (Oral Pathology)",
    subject_name_en: "Oral Pathology",
    sheet_id: "sh_oral_path_pulp_02",
    sheet_title_ar: "المحاضرة 2: أمراض واضطرابات لب الأسنان (Diseases of Dental Pulp)",
    sheet_title_en: "Lecture 2: Diseases of the Dental Pulp",
    page_ref: 7,
    topic_ar: "نسيجيات التهاب اللب المزمن",
    topic_en: "Histopathology of Chronic Pulpitis",
    type: "past_exam",
    source: "past_exam",
    tags: ["Chronic Pulpitis", "Histopathology", "Lymphocytes"],
    text_ar: "في الفحص النسيجي لالتهاب اللب المزمن (Chronic Pulpitis)، يتميز الارتشاح الالتهابي بوجود:",
    text_en: "In the histopathology of chronic pulpitis, the cellular infiltrate is predominantly characterized by:",
    options_ar: [
      "ارتشاح متقدم من الخلايا المتعادلة (Neutrophils) فقط مع خراجات",
      "ارتشاح مزمن من الخلايا اللمفاوية (Lymphocytes) وخلايا البلازما (Plasma cells)",
      "خلايا كولسترولية عملاقة وخلايا رغوية فقط",
      "غياب تام لجميع خلايا المناعة"
    ],
    options_en: [
      "Predominant neutrophil infiltration with microabscesses only",
      "Progressive infiltration by lymphocytes and plasma cells",
      "Cholesterol giant cells and foam cells only",
      "Complete absence of all immune cells"
    ],
    correct_index: 1,
    answer_ar: "الإجابة الصحيحة: B\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\n- التهاب اللب الحاد (Acute): يتميز بارتشاح كثيف من الكريات البيض متعددة النوى / المتعادلات (Neutrophils / PMNs) مع وذمة شديدة وتخرب خلوي وتكون بؤر قيحية.\n- التهاب اللب المزمن (Chronic): يتميز بارتشاح خلايا أحادية النواة (Mononuclear infiltrate) ممثلة بالخلايا اللمفاوية (Lymphocytes) وخلايا البلازما (Plasma cells) وتكاثر اللييفات اليافعة والأوعية الدموية لتشكيل نسيج حبيبي مزمن.",
    answer_en: "Correct Answer: B. Progressive infiltration by lymphocytes and plasma cells\nChronic pulpitis histologically shows a chronic mononuclear infiltrate dominated by lymphocytes and plasma cells.",
    quote_ref: "Chronic pulpitis shows infiltration of the pulp tissue predominantly by lymphocytes and plasma cells."
  },
  {
    id: "q_oral_path_pulp_06",
    subject_id: "oral-diseases",
    subject_name_ar: "أمراض الفم (Oral Pathology)",
    subject_name_en: "Oral Pathology",
    sheet_id: "sh_oral_path_pulp_02",
    sheet_title_ar: "المحاضرة 2: أمراض واضطرابات لب الأسنان (Diseases of Dental Pulp)",
    sheet_title_en: "Lecture 2: Diseases of the Dental Pulp",
    page_ref: 11,
    topic_ar: "التكلسات الحصوية في اللب (Pulp Stones)",
    topic_en: "Pulp Calcifications & Pulp Stones",
    type: "past_exam",
    source: "past_exam",
    tags: ["Pulp Stones", "Denticles", "Pulp Calcification"],
    text_ar: "حصيات اللب (Pulp Stones) هي أجسام متكلسة تحتوي على مصفوفة عضوية، وتصنف نسيجياً إلى حصيات حقيقية (True) وحصيات كاذبة (False). هذه العبارة:",
    text_en: "Pulp stones are calcified bodies with an organic matrix and occur as true and false pulp stones. This statement is:",
    options_ar: [
      "صحيحة (True)",
      "خاطئة (False)"
    ],
    options_en: [
      "True",
      "False"
    ],
    correct_index: 0,
    answer_ar: "الإجابة الصحيحة: A. صحيحة (True)\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\nتكلسات اللب شائعة جداً وتزداد طردياً مع التقدم في العمر:\n1. حصيات اللب الحقيقية (True pulp stones / Denticles): نادرة، وتتكون من عاج حقيقي يحتوي على أنابيب عاجية وخلايا شبيهة بمصورات العاج.\n2. حصيات اللب الكاذبة (False pulp stones): هي الأكثر شيوعاً، وتتكون من صفائح كلسية دائرية متحدة المركز (Concentric lamellae) ناتجة عن تنكس تكلسي حول أوعية دموية أو ألياف كولاجينية، وتخلو تماماً من الأنابيب العاجية.",
    answer_en: "Correct Answer: A. True\nPulp stones are calcified masses classified structurally into true stones (containing dentinal tubules) and false stones (concentric lamellar calcifications without tubules).",
    quote_ref: "Pulp stones are classified as true (composed of dentine with tubules) or false (concentric layers of calcified tissue)."
  },
  {
    id: "q_oral_path_pulp_07",
    subject_id: "oral-diseases",
    subject_name_ar: "أمراض الفم (Oral Pathology)",
    subject_name_en: "Oral Pathology",
    sheet_id: "sh_oral_path_pulp_02",
    sheet_title_ar: "المحاضرة 2: أمراض واضطرابات لب الأسنان (Diseases of Dental Pulp)",
    sheet_title_en: "Lecture 2: Diseases of the Dental Pulp",
    page_ref: 13,
    topic_ar: "التغيرات العمرية في لب السن (Age Changes)",
    topic_en: "Age Changes in Dental Pulp",
    type: "past_exam",
    source: "past_exam",
    tags: ["Age Changes", "Pulp Fibrosis", "Vascularity"],
    text_ar: "مع التقدم في السن (Age changes of the pulp)، يظهر الفحص النسيجي للب التغير التالي:",
    text_en: "Age changes of the dental pulp histologically show:",
    options_ar: [
      "زيادة ملحوظة في التروية الدموية وعدد الخلايا الحية",
      "انخفاض التروية الدموية وانخفاض عدد الخلايا مع زيادة التليف (Decreased vascularity and cellularity)",
      "توسع كبير في حجم حجرة اللب",
      "انعدام تام لتكون العاج الثانوي"
    ],
    options_en: [
      "Marked increase in vascularity and number of cells",
      "Decreased vascularity and cellularity with increased fibrosis",
      "Massive enlargement of the pulp chamber size",
      "Complete absence of secondary dentine deposition"
    ],
    correct_index: 1,
    answer_ar: "الإجابة الصحيحة: B\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\nمع تقدم الإنسان في العمر، تحدث تغيرات فيسيولوجية حتمية في نسيج اللب:\n- انخفاض حجم حجرة اللب والقنوات الجذرية بسبب استمرار ترسيب العاج الثانوي والارتكاسي طوال الحياة.\n- انخفاض التروية الدموية (Decreased vascularity) وانخفاض عدد الأعصاب.\n- انخفاض عدد الخلايا النشطة (Decreased cellularity) مع زيادة كثافة حزم ألياف الكولاجين (Fibrosis).\n- زيادة نسبة الحصيات الكلسية؛ مما يجعل اللب المسن أقل قدرة على الشفاء وأقل حساسية للألم مقارنة باللب الشاب.",
    answer_en: "Correct Answer: B. Decreased vascularity and cellularity with increased fibrosis\nAging pulp exhibits reduced pulp volume, decreased vascularity/cellularity, increased fibrous collagen, and more calcifications.",
    quote_ref: "Aging of the pulp leads to reduced volume, decreased vascularity, fewer cells, and increased collagen fibers."
  },
  {
    id: "q_oral_path_pulp_08",
    subject_id: "oral-diseases",
    subject_name_ar: "أمراض الفم (Oral Pathology)",
    subject_name_en: "Oral Pathology",
    sheet_id: "sh_oral_path_pulp_02",
    sheet_title_ar: "المحاضرة 2: أمراض واضطرابات لب الأسنان (Diseases of Dental Pulp)",
    sheet_title_en: "Lecture 2: Diseases of the Dental Pulp",
    page_ref: 15,
    topic_ar: "ألم اللب عند تغير الضغط الجوي (Aerodontalgia)",
    topic_en: "Aerodontalgia / Barodontalgia",
    type: "past_exam",
    source: "past_exam",
    tags: ["Aerodontalgia", "Barotrauma", "Aviation"],
    text_ar: "ألم الأسنان واللب الذي يصيب أفراد طواقم الطيران والركاب عند التحليق على ارتفاعات شاهقة وتغير الضغط الجوي يُسمى سريرياً:",
    text_en: "Barotrauma or aerodontalgia is a dental pain typically seen in air crew flying at high altitudes due to atmospheric pressure changes. This statement is:",
    options_ar: [
      "صحيحة (True)",
      "خاطئة (False)"
    ],
    options_en: [
      "True",
      "False"
    ],
    correct_index: 0,
    answer_ar: "الإجابة الصحيحة: A. صحيحة (True)\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\n- ألم الأسنان الجوي (Aerodontalgia / Barodontalgia): هو ألم سني حاد يحدث بسبب انخفاض الضغط الجوي في الارتفاعات العالية (كما في الطيران) أو ازدياده السريع (أثناء الغوص العميق).\n- الآلية: انحباس فقاعات الغازات الناتجة عن نخر قديم، أو وجود التهاب لب مسبق تحت سريري (Subclinical pulpitis)؛ فعند انخفاض الضغط يتمدد الغاز المحبوس داخل حجرة العاج الصلبة فيضغط بشدة على الأعصاب الحية مسبباً ألماً حاداً لا يطاق.",
    answer_en: "Correct Answer: A. True\nAerodontalgia (barodontalgia) is toothache provoked by changes in ambient barometric pressure in individuals with subclinical pulpitis.",
    quote_ref: "Aerodontalgia: Tooth pain precipitated by decrease in atmospheric pressure at high altitudes in teeth with asymptomatic chronic pulpitis."
  },

  // =========================================================================
  // 3. DISEASES OF PERIAPICAL TISSUES (Lecture 3: د. عائشة شنان - sh_oral_path_periapical_03)
  // =========================================================================
  {
    id: "q_oral_path_periapical_01",
    subject_id: "oral-diseases",
    subject_name_ar: "أمراض الفم (Oral Pathology)",
    subject_name_en: "Oral Pathology",
    sheet_id: "sh_oral_path_periapical_03",
    sheet_title_ar: "المحاضرة 3: أمراض الأنسجة المحيطة بالذروة (Diseases of Periapical Tissues)",
    sheet_title_en: "Lecture 3: Diseases of Periapical Tissues",
    page_ref: 2,
    topic_ar: "التهاب الرباط الذروي الحاد (Acute Periapical Periodontitis)",
    topic_en: "Acute Periapical Periodontitis & Clinical Features",
    type: "past_exam",
    source: "past_exam",
    tags: ["Periapical Periodontitis", "Percussion", "Non-vital tooth"],
    text_ar: "في التهاب الأنسجة المحيطة بذروة السن الحاد (Acute Periapical Periodontitis)، أي من العبارات التالية صحيحة ومميزة سريرياً:",
    text_en: "Regarding acute periapical periodontitis, which of the following statements is clinically characteristic:",
    options_ar: [
      "الألم يكون غير محدد ولا يعرف المريض أي سن يؤلمه",
      "المنبهات الساخنة والباردة لا تثير ألماً إذا كان اللب متنخراً وميتاً (Non-vital pulp)، ويكون السن مؤلماً جداً عند العض والمضغ والقرع (Tenderness to percussion)",
      "الصورة الشعاعية تظهر دائماً هلالاً كبيراً من التخلخل الشعاعي العظمي المستدير",
      "السن يكون حياً وسليماً 100% دائماً"
    ],
    options_en: [
      "Pain is poorly localized and the patient cannot identify the tooth",
      "Hot and cold stimuli do not cause pain in a non-vital tooth, and the tooth is exquisitely painful to biting and percussion",
      "Radiographs always show a massive cystic radiolucency",
      "The tooth is always completely vital and sound"
    ],
    correct_index: 1,
    answer_ar: "الإجابة الصحيحة: B\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\nالفرق الجوهري بين التهاب اللب (Pulpitis) والتهاب الذروة (Periapical periodontitis):\n1. في التهاب الذروة (Periapical): الالتهاب انتقل إلى ألياف الرباط اللثوي (PDL) الغنية جداً بمستقبلات الحس العميق (Proprioceptors)؛ لذا فإن المريض يحدد السن بإصبعه فوراً (Well-localized pain) ويشعر بأن السن مرتفع قليلاً في سنخه (Tooth feels high/raised).\n2. الحساسية للحرارة: بما أن اللب متنخر وغير حي (Non-vital)، فإن البرودة والحرارة لن تثير حساسية عصبية لبية.\n3. الفحص الإشعاعي المبكر: لا يظهر ذوباناً عظمياً كبيراً في البداية، بل يظهر خط الرباط اللثوي طبيعياً أو متسعاً قليلاً فقط (Normal or slight widening of PDL space).",
    answer_en: "Correct Answer: B\nIn acute apical periodontitis from a necrotic pulp, thermal testing is negative, but the tooth is exquisitely tender to percussion and mastication.",
    quote_ref: "In acute periapical periodontitis, the tooth is tender to pressure and percussion, and thermal stimuli elicit no response if the pulp is necrotic."
  },
  {
    id: "q_oral_path_periapical_02",
    subject_id: "oral-diseases",
    subject_name_ar: "أمراض الفم (Oral Pathology)",
    subject_name_en: "Oral Pathology",
    sheet_id: "sh_oral_path_periapical_03",
    sheet_title_ar: "المحاضرة 3: أمراض الأنسجة المحيطة بالذروة (Diseases of Periapical Tissues)",
    sheet_title_en: "Lecture 3: Diseases of Periapical Tissues",
    page_ref: 4,
    topic_ar: "أسباب ومكونات الورم الحبيبي الذروي (Periapical Granuloma)",
    topic_en: "Etiology & Histopathology of Periapical Granuloma",
    type: "past_exam",
    source: "past_exam",
    tags: ["Periapical Granuloma", "Cholesterol Clefts", "Foam Cells", "Histopathology"],
    text_ar: "الخلايا الرغوية (Foam cells)، شقوق الكولسترول (Cholesterol clefts)، أجسام الهيالين، وصبغة الهيموسيديرين تعتبر علامات نسيجية مميزة تشاهد في:",
    text_en: "Foam cells, hyaline bodies, cholesterol clefts, and hemosiderin pigmentation are characteristic histopathological features of:",
    options_ar: [
      "الكيس الذروي (Radicular cyst)",
      "الورم الحبيبي الذروي (Periapical granuloma)",
      "الخراج اللثوي الجانبي الحاد (Acute lateral periodontal abscess)",
      "كلاهما معاً: الكيس الذروي والورم الحبيبي الذروي (Both A & B)"
    ],
    options_en: [
      "Radicular cyst",
      "Periapical granuloma",
      "Lateral periodontal abscess",
      "Both A and B (Radicular cyst and Periapical granuloma)"
    ],
    correct_index: 3,
    answer_ar: "الإجابة الصحيحة: D. كلاهما معاً (Both A and B)\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\nسؤال دقيق ومشهور جداً في امتحانات Oral Pathology:\n- الورم الحبيبي الذروي (Periapical granuloma) والكيس الذروي (Radicular cyst) يشتركان في نفس البيئة الإمراضية للالتهاب المزمن للسن غير الحي:\n  1) خلايا رغوية (Foam cells / Lipid-laden macrophages) ناتجة عن بلعمة حطام الخلايا المتنخرة.\n  2) شقوق الكولسترول (Cholesterol clefts) المحاطة بخلايا عملاقة غريبة (Foreign-body giant cells).\n  3) صبغة الهيموسيديرين (Hemosiderin) نتيجة النزوف الموضعية وتكسر كريات الدم الحمراء.\n  4) أجسام روشتون / الهيالين (Rushton / Hyaline bodies) في ظهارة الكيس.\nالفرق النسيجي الحاسم بينهما: الكيس الذروي يحتوي على تجويف حقيقي مبطن بالظهارة (Epithelium-lined cavity)، بينما الجرانولوما كتلة مصمتة من النسيج الحبيبي الالتهابي (Granulation tissue).",
    answer_en: "Correct Answer: D. Both A and B\nBoth periapical granuloma and radicular cyst share chronic inflammatory elements including cholesterol clefts, foam cells, and hemosiderin.",
    quote_ref: "Histopathology of apical granuloma and cyst: Chronic granulation tissue with cholesterol clefts, foreign body giant cells, foam cells, and hemosiderin."
  },
  {
    id: "q_oral_path_periapical_03",
    subject_id: "oral-diseases",
    subject_name_ar: "أمراض الفم (Oral Pathology)",
    subject_name_en: "Oral Pathology",
    sheet_id: "sh_oral_path_periapical_03",
    sheet_title_ar: "المحاضرة 3: أمراض الأنسجة المحيطة بالذروة (Diseases of Periapical Tissues)",
    sheet_title_en: "Lecture 3: Diseases of Periapical Tissues",
    page_ref: 6,
    topic_ar: "الكيس الذروي وحيوية السن (Radicular Cyst & Vitality)",
    topic_en: "Radicular Cyst & Tooth Vitality",
    type: "past_exam",
    source: "past_exam",
    tags: ["Radicular Cyst", "Vitality Test", "Non-vital"],
    text_ar: "تظهر الصورة الشعاعية للكيس الجذري الذروي (Radicular cyst) منطقة تخلخل شعاعي محددة بوضوح محاطة بحافة ظليلة رقيقة حول ذروة سن حي (Vital tooth). هذه العبارة:",
    text_en: "A radiographic picture of a radicular cyst may show a well-defined radiolucency surrounded by a narrow radio-opaque margin around the apex of a vital tooth. This statement is:",
    options_ar: [
      "صحيحة (True)",
      "خاطئة (False) — لأن الكيس الذروي لا ينشأ إلا حول ذروة سن غير حي وميت اللب (Non-vital tooth)"
    ],
    options_en: [
      "True",
      "False (because radicular cyst arises exclusively associated with a non-vital tooth)"
    ],
    correct_index: 1,
    answer_ar: "الإجابة الصحيحة: B. خاطئة (False)\n\n📌 فخ امتحاني يتكرر باستمرار (Classic Exam Trap):\n- الكيس الجذري الذروي (Radicular / Apical cyst) هو كيس التهابي (Inflammatory cyst).\n- ينشأ حصراً بسبب تنخر وموت لب السن (Non-vital / Necrotic pulp)؛ حيث تنتقل السموم البكتيرية إلى الذروة فتحفز بقايا مالاسيز الظهارية (Epithelial rests of Malassez) على التكاثر.\n- إذا كان السن حياً (Vital tooth) ووجدت بقعة شفافة شعاعياً عند الذروة، فالاحتمال يكون آفة أخرى مثل الورم الملاطي النمائي (Periapical cemental dysplasia) أو ورماً سنياً آخر، وليس كيساً جذرياً!",
    answer_en: "Correct Answer: B. False\nA radicular cyst is an inflammatory cyst that develops ONLY in association with a non-vital tooth following pulp necrosis.",
    quote_ref: "Radicular cysts arise from proliferation of the rests of Malassez in response to inflammation caused by non-vital teeth."
  },
  {
    id: "q_oral_path_periapical_04",
    subject_id: "oral-diseases",
    subject_name_ar: "أمراض الفم (Oral Pathology)",
    subject_name_en: "Oral Pathology",
    sheet_id: "sh_oral_path_periapical_03",
    sheet_title_ar: "المحاضرة 3: أمراض الأنسجة المحيطة بالذروة (Diseases of Periapical Tissues)",
    sheet_title_en: "Lecture 3: Diseases of Periapical Tissues",
    page_ref: 7,
    topic_ar: "بطانة الكيس الذروي النسيجية (Epithelial Lining)",
    topic_en: "Histopathology of Radicular Cyst Lining",
    type: "past_exam",
    source: "past_exam",
    tags: ["Radicular Cyst", "Epithelium", "Stratified Squamous"],
    text_ar: "نسيجياً، يُبطن الكيس الجذري الذروي الالتهابي (Radicular cyst) بطبقة من الظهارة:",
    text_en: "Histologically, the radicular cyst is lined by a layer of:",
    options_ar: [
      "ظهارة مطبقة حرشفية غير متقرنة (Stratified squamous epithelium, non-keratinized)",
      "ظهارة عمادية مطبقة كاذبة مهدبة فقط",
      "ظهارة مكعبة بسيطة أحادية الطبقة",
      "لا يحتوي على أي بطانة ظهارية لأنه كيس كاذب"
    ],
    options_en: [
      "Stratified squamous epithelium which is non-keratinized",
      "Pseudostratified ciliated columnar epithelium only",
      "Simple cuboidal epithelium",
      "No epithelial lining because it is a pseudocyst"
    ],
    correct_index: 0,
    answer_ar: "الإجابة الصحيحة: A. ظهارة مطبقة حرشفية غير متقرنة\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\n- الكيس الذروي كيس حقيقي (True cyst) لأنه يمتلك تجويفاً مبطناً بالظهارة.\n- نوع الظهارة السائدة في الغالبية الساحقة هي: ظهارة مطبقة حرشفية غير متقرنة (Non-keratinized stratified squamous epithelium)، مستمدة من تكاثر بقايا مالاسيز في الرباط السني.\n- في الحالات الملتهبة بشدة تظهر الظهارة متضخمة وغير منتظمة مع وذمة بين خلوية (Spongiosis).\n⚠️ ملحوظة: الكيس الكيراتيني السني (OKC) يتميز بظهارة متقرنة نظيرة التقرن (Parakeratinized) ومنتظمة بسمك 6-8 خلايا، بينما الكيس الذروي غير متقرن (Non-keratinized).",
    answer_en: "Correct Answer: A. Stratified squamous epithelium, non-keratinized\nRadicular cysts are lined by non-keratinized stratified squamous epithelium derived from stimulated rests of Malassez.",
    quote_ref: "The radicular cyst is lined by non-keratinized stratified squamous epithelium."
  },
  {
    id: "q_oral_path_periapical_05",
    subject_id: "oral-diseases",
    subject_name_ar: "أمراض الفم (Oral Pathology)",
    subject_name_en: "Oral Pathology",
    sheet_id: "sh_oral_path_periapical_03",
    sheet_title_ar: "المحاضرة 3: أمراض الأنسجة المحيطة بالذروة (Diseases of Periapical Tissues)",
    sheet_title_en: "Lecture 3: Diseases of Periapical Tissues",
    page_ref: 10,
    topic_ar: "ذبحة لودفيغ والتهاب النسج الخلوية (Ludwig's Angina)",
    topic_en: "Ludwig's Angina & Fascial Space Infections",
    type: "past_exam",
    source: "past_exam",
    tags: ["Ludwig's Angina", "Cellulitis", "Fascial Spaces", "Complications"],
    text_ar: "ذبحة لودفيغ (Ludwig's angina) هي مضاعفة خطيرة لانتشار الخراج الذروي، وتُعرَّف سريرياً بأنها:",
    text_en: "Ludwig's angina is clinically defined as:",
    options_ar: [
      "التهاب نسج خلوية موضعي بسيط في الشفة السفلية فقط",
      "التهاب نسج خلوية حاد شديد وسريع الانتشار يصيب حيزات تحت الفك وتحت اللسان وتحت الذقن ثنائية الجانب (Submandibular, sublingual, submental spaces)",
      "ورم حبيبي حميد في قاع الفم",
      "التهاب مزمن محدود في الغدة النكفية"
    ],
    options_en: [
      "Mild localized cellulitis of the lower lip only",
      "Severe, rapidly spreading cellulitis involving bilateral submandibular, sublingual, and submental spaces",
      "Benign granulomatous tumor of the floor of the mouth",
      "Chronic localized inflammation of the parotid gland"
    ],
    correct_index: 1,
    answer_ar: "الإجابة الصحيحة: B\n\n📌 شرح المعلومة وفكرة السؤال في امتحانات السنوات:\n- ذبحة لودفيغ (Ludwig's Angina): هي التهاب حاد منتشر وشديد في النسج الضامة الرخوة (Cellulitis)، ينشأ غالباً من انتقال إنتان خراج ذروي من أرحاء الفك السفلي الثانية أو الثالثة (لأن جذورها تمتد أسفل العضلة الضرسية اللامية Mylohyoid).\n- تصيب الحيزات الفراغية الثلاثة ثنائية الجانب:\n  1. Submandibular spaces\n  2. Sublingual spaces\n  3. Submental space\n- الخطورة السريرية القصوى: تؤدي لتورم صلب يشبه اللوح الخشبي (Woody / Brawny edema) في قاع الفم يرفع اللسان للأعلى والخلف، مسبباً انسداداً حاداً في مجرى التنفس (Respiratory obstruction)، وصعوبة في البلع والكلام، وتعتبر حالة طوارئ جراحية مهددة للحياة.",
    answer_en: "Correct Answer: B. Severe cellulitis involving submandibular, sublingual, and submental spaces\nLudwig's angina is a life-threatening, bilateral cellulitis involving the floor of the mouth and neck spaces.",
    quote_ref: "Ludwig's angina is a severe, rapidly spreading cellulitis of the submandibular, sublingual, and submental spaces."
  }
];

// Append or update existing questions
let addedCount = 0;
let updatedCount = 0;

for (const nq of newQuestions) {
  const existingIdx = existingData.questions.findIndex(q => q.id === nq.id);
  if (existingIdx >= 0) {
    existingData.questions[existingIdx] = nq;
    updatedCount++;
  } else {
    existingData.questions.push(nq);
    addedCount++;
  }
}

fs.writeFileSync(questionsFilePath, JSON.stringify(existingData, null, 2), 'utf8');
console.log(`Success! Added ${addedCount} questions, Updated ${updatedCount} questions in questions.json.`);
