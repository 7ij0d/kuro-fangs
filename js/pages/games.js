/**
 * KURO FANGS — ARCADE & DENTAL GAMES HUB
 * 3 Interactive Academic & Entertaining Games with Points Rewards, Confetti & Audio:
 * 1. Dental Terms Memory Game (4 Levels: Easy +10, Medium +20, Hard +35, Expert +50)
 * 2. Dental Visual Image Match (4 Levels: 8 to 32 cards, +30 points)
 * 3. Funny Dental Trivia Quiz (10 MCQs, Funny Titles, +25 points)
 */

window.GamesPage = (function () {
  // =========================================================================
  // PROCEDURAL AUDIO SYNTHESIZER (Web Audio API - Zero External Dependencies)
  // =========================================================================
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playSound(type) {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      if (type === 'flip') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(540, now + 0.06);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === 'match') {
        const freqs = [523.25, 659.25, 783.99]; // C5 - E5 - G5 chime
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.15, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.25);
        });
      } else if (type === 'win') {
        const notes = [440, 554.37, 659.25, 880]; // A major fanfare
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);
          gain.gain.setValueAtTime(0.2, now + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.4);
        });
      } else if (type === 'wrong') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.18);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
      }
    } catch (e) {
      // Audio policy or silent mode
    }
  }

  // =========================================================================
  // CELEBRATION CONFETTI ENGINE (Canvas Particles)
  // =========================================================================
  function launchConfetti() {
    let canvas = document.getElementById('arcade-confetti-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'arcade-confetti-canvas';
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '99999';
      document.body.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#881337', '#BE123C', '#0D9488', '#0284C7', '#D97706', '#8B5CF6', '#10B981', '#F59E0B'];
    const particles = [];
    const count = 90;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() * 200 - 100),
        y: canvas.height * 0.35 + (Math.random() * 100 - 50),
        vx: (Math.random() - 0.5) * 16,
        vy: Math.random() * -12 - 4,
        size: Math.random() * 8 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    let animationId = null;
    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.vx *= 0.98; // air drag
        p.rotation += p.rSpeed;
        p.opacity -= 0.008;

        if (p.opacity > 0 && p.y < canvas.height + 20) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      });

      if (alive) {
        animationId = requestAnimationFrame(frame);
      } else {
        cancelAnimationFrame(animationId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    frame();
  }

  // =========================================================================
  // DATASETS: TERMS, VISUAL INSTRUMENTS & FUNNY QUIZ
  // =========================================================================
  const TERMS_DATA = [
    {
      id: 'endo',
      en: 'Endodontics',
      ar: 'علاج جذور وأعصاب الأسنان',
      icon: '⚡',
      badge_en: 'Endo Specialty',
      badge_ar: 'علاج الجذور'
    },
    {
      id: 'ortho',
      en: 'Orthodontics',
      ar: 'تقويم واصطفاف الأسنان',
      icon: '🦷',
      badge_en: 'Alignment',
      badge_ar: 'تقويم الأسنان'
    },
    {
      id: 'perio',
      en: 'Periodontics',
      ar: 'أمراض وأنسجة وجراحة اللثة',
      icon: '🩸',
      badge_en: 'Gum Health',
      badge_ar: 'طب اللثة'
    },
    {
      id: 'pros',
      en: 'Prosthodontics',
      ar: 'الاستعاضة الصناعية والتركيبات',
      icon: '👑',
      badge_en: 'Crowns & Bridges',
      badge_ar: 'تركيبات الأسنان'
    },
    {
      id: 'pedo',
      en: 'Pediatric Dentistry',
      ar: 'طب أسنان الأطفال',
      icon: '🧸',
      badge_en: 'Pedo Care',
      badge_ar: 'أسنان أطفال'
    },
    {
      id: 'omfs',
      en: 'Oral & Maxillofacial Surgery',
      ar: 'جراحة الفم والوجه والفكين',
      icon: '🩺',
      badge_en: 'Surgical Unit',
      badge_ar: 'جراحة الفم'
    },
    {
      id: 'caries',
      en: 'Dental Caries',
      ar: 'تسوس وتحلل بنية السن',
      icon: '🕳️',
      badge_en: 'Pathology',
      badge_ar: 'تسوس الأسنان'
    },
    {
      id: 'enamel',
      en: 'Dental Enamel',
      ar: 'ميناء السن (الطبقة الأقسى)',
      icon: '🛡️',
      badge_en: 'Anatomy',
      badge_ar: 'تشريح السن'
    },
    {
      id: 'dentin',
      en: 'Dentin',
      ar: 'عاج السن (الطبقة الحساسة)',
      icon: '🏛️',
      badge_en: 'Histology',
      badge_ar: 'أنسجة السن'
    },
    {
      id: 'pulp',
      en: 'Dental Pulp',
      ar: 'لب السن (الأعصاب والأوعية)',
      icon: '❤️',
      badge_en: 'Pulp Complex',
      badge_ar: 'لب وعصب السن'
    },
    {
      id: 'gingivitis',
      en: 'Gingivitis',
      ar: 'التهاب وتورم اللثة السطحي',
      icon: '⚠️',
      badge_en: 'Reversible',
      badge_ar: 'التهاب اللثة'
    },
    {
      id: 'implant',
      en: 'Dental Implant',
      ar: 'زراعة جذر صناعي تيتانيوم',
      icon: '🔩',
      badge_en: 'Implantology',
      badge_ar: 'زراعة الأسنان'
    },
    {
      id: 'scaling',
      en: 'Ultrasonic Scaling',
      ar: 'تقليح وإزالة الجير بالموجات',
      icon: '🌊',
      badge_en: 'Prophylaxis',
      badge_ar: 'إزالة الرواسب'
    },
    {
      id: 'extraction',
      en: 'Tooth Extraction',
      ar: 'خلع وقلع السن المصاب',
      icon: '🩹',
      badge_en: 'Exodontia',
      badge_ar: 'قلع الأسنان'
    },
    {
      id: 'crown',
      en: 'Dental Crown',
      ar: 'تاج / طربوش تغطية السن',
      icon: '💎',
      badge_en: 'Restoration',
      badge_ar: 'تاج علاجي'
    },
    {
      id: 'anesthesia',
      en: 'Local Anesthesia',
      ar: 'التخدير الموضعي (ليدوكائين)',
      icon: '💉',
      badge_en: 'Clinical Care',
      badge_ar: 'التخدير الموضعي'
    }
  ];

  const VISUAL_DATA = [
    {
      id: 'mouth_mirror',
      name_en: 'Mouth Mirror',
      name_ar: 'مرآة الفم التشخيصية',
      icon: '🪞',
      badge_en: 'Diagnostic',
      badge_ar: 'أدوات التشخيص',
      hint_en: 'Indirect vision & tissue retraction',
      hint_ar: 'الرؤية غير المباشرة وإبعاد الأنسجة',
      accent: '#0284C7'
    },
    {
      id: 'explorer_probe',
      name_en: 'Explorer Probe',
      name_ar: 'مسبار الفحص السريري',
      icon: '🔍',
      badge_en: 'Diagnostic',
      badge_ar: 'أدوات التشخيص',
      hint_en: 'Tactile detection of caries & margins',
      hint_ar: 'تحسس التسوس ونعومة الحواف',
      accent: '#0284C7'
    },
    {
      id: 'extraction_forceps',
      name_en: 'Extraction Forceps',
      name_ar: 'كلابة خلع الأسنان',
      icon: '🗜️',
      badge_en: 'Surgical',
      badge_ar: 'جراحة الفم',
      hint_en: 'Beaks & hinge for tooth delivery',
      hint_ar: 'أداة خلع السن وقبض التاج',
      accent: '#BE123C'
    },
    {
      id: 'high_speed_handpiece',
      name_en: 'High-Speed Handpiece',
      name_ar: 'قبضة التوربين السريعة',
      icon: '🌪️',
      badge_en: 'Operative',
      badge_ar: 'حشوات الأسنان',
      hint_en: '400,000 RPM water-cooled cutting',
      hint_ar: 'حفر وتجويف وتبريد مائي فائق',
      accent: '#D97706'
    },
    {
      id: 'curing_light',
      name_en: 'LED Curing Light',
      name_ar: 'جهاز البلمرة الضوئية',
      icon: '🔦',
      badge_en: 'Restorative',
      badge_ar: 'حشوات تجميلية',
      hint_en: 'Blue spectrum photo-polymerization',
      hint_ar: 'تصلب الكومبوزيت بالضوء الأزرق',
      accent: '#8B5CF6'
    },
    {
      id: 'bitewing_xray',
      name_en: 'Bitewing X-Ray',
      name_ar: 'أشعة بايت وينج السنية',
      icon: '🩻',
      badge_en: 'Radiology',
      badge_ar: 'الأشعة السنية',
      hint_en: 'Interproximal caries diagnosis',
      hint_ar: 'كشف التسوس بين الأسطح الملاصقة',
      accent: '#475569'
    },
    {
      id: 'panoramic_opg',
      name_en: 'Panoramic OPG Radiograph',
      name_ar: 'أشعة البانوراما الكاملة',
      icon: '🌐',
      badge_en: 'Maxillofacial',
      badge_ar: 'أشعة الفكين',
      hint_en: 'Full arch & TMJ comprehensive scan',
      hint_ar: 'تصوير الفكين ومفصل الفك بالكامل',
      accent: '#475569'
    },
    {
      id: 'phantom_head',
      name_en: 'Phantom Head Simulator',
      name_ar: 'مجسم محاكاة الفانتوم',
      icon: '🤖',
      badge_en: 'Pre-clinical',
      badge_ar: 'معمل الفانتوم',
      hint_en: 'Pre-clinical lifelike student station',
      hint_ar: 'محاكاة مريض العيادة للتدريب العملي',
      accent: '#059669'
    },
    {
      id: 'rotary_endo_file',
      name_en: 'Rotary NiTi Endo File',
      name_ar: 'مبارد علاج العصب الآلية',
      icon: '🌀',
      badge_en: 'Endodontics',
      badge_ar: 'علاج الجذور',
      hint_en: 'Root canal shaping & tapering',
      hint_ar: 'توسيع وتنظيف قنوات الجذر بدقة',
      accent: '#DC2626'
    },
    {
      id: 'dental_chair',
      name_en: 'Dental Chair Delivery Unit',
      name_ar: 'كرسي العيادة السريري المتكامل',
      icon: '🛋️',
      badge_en: 'Clinical',
      badge_ar: 'العيادات السريرية',
      hint_en: 'Patient unit, suction & lighting',
      hint_ar: 'وحدة الطبيب والمريض والإضاءة والشفط',
      accent: '#2563EB'
    },
    {
      id: 'rubber_dam',
      name_en: 'Rubber Dam Isolation Kit',
      name_ar: 'طقم الحاجز المطاطي للعزل',
      icon: '🛡️',
      badge_en: 'Isolation',
      badge_ar: 'العزل والتعقيم',
      hint_en: 'Aseptic moisture and airway safety',
      hint_ar: 'عزل اللعاب والرطوبة وحماية المريض',
      accent: '#0D9488'
    },
    {
      id: 'ultrasonic_scaler',
      name_en: 'Ultrasonic Piezo Scaler',
      name_ar: 'جهاز إزالة الجير بالموجات',
      icon: '⚡',
      badge_en: 'Periodontics',
      badge_ar: 'تنظيف اللثة',
      hint_en: 'Calculus and plaque cavitation',
      hint_ar: 'تفتيت الرواسب الكلسية بالموجات',
      accent: '#0891B2'
    },
    {
      id: 'articulating_paper',
      name_en: 'Articulating Paper & Forceps',
      name_ar: 'ورق فحص الإطباق والعضة',
      icon: '📄',
      badge_en: 'Occlusion',
      badge_ar: 'فحص الإطباق',
      hint_en: 'Detecting high occlusal contacts',
      hint_ar: 'تحديد نقاط العضة المرتفعة بعد الحشو',
      accent: '#7C3AED'
    },
    {
      id: 'straight_elevator',
      name_en: 'Straight Root Elevator',
      name_ar: 'رافعة الجذور المستقيمة',
      icon: '🥄',
      badge_en: 'Surgical',
      badge_ar: 'جراحة الفم',
      hint_en: 'Luxation wedge principle for roots',
      hint_ar: 'خلخلة السن والجذور بمبدأ الرافعة',
      accent: '#BE123C'
    },
    {
      id: 'impression_tray',
      name_en: 'Alginate Impression Tray',
      name_ar: 'ملعقة أخذ الطبعات الفموية',
      icon: '📐',
      badge_en: 'Prostho',
      badge_ar: 'الاستعاضة الصناعية',
      hint_en: 'Cast study models and custom trays',
      hint_ar: 'صب قوالب الفم لمقاسات التركيبات',
      accent: '#D97706'
    },
    {
      id: 'titanium_implant',
      name_en: 'Titanium Dental Implant',
      name_ar: 'غرسة التيتانيوم السنية',
      icon: '🔩',
      badge_en: 'Implantology',
      badge_ar: 'زراعة الأسنان',
      hint_en: 'Osseointegrated bone fixture replacement',
      hint_ar: 'الالتحام العظمي لتعويض السن المفقود',
      accent: '#4F46E5'
    }
  ];

  const QUIZ_DATA = [
    {
      question_ar: 'ما هو أسرع شيء يختفي في معمل الفانتوم بدون أي أثر قانوني أو فيزيائي؟',
      question_en: 'What is the fastest thing to vanish without a trace in the Phantom Lab?',
      options_ar: [
        'التوربين عالي السرعة',
        'سنة الموديل رقم 16 (Upper 6) بعد ما تبردها بالغلط',
        'مفتاح كرسي المعمل',
        'ملف الروتاري مقاس 15'
      ],
      options_en: [
        'High-Speed Handpiece',
        'Tooth #16 on the typodont model after an over-prep',
        'Phantom unit wrench',
        'Size 15 Rotary File'
      ],
      correct: 1,
      explanation_ar: 'سنة الـ 16 تختفي فوراً إما بعد كافيتي عميقة محرجة أو تسقط وتتدحرج تحت طاولة زميلك إلى بعد مجهول! 😅',
      explanation_en: 'Tooth #16 mysteriously vanishes right after an accidental deep prep or rolls under your peer desk into another dimension!'
    },
    {
      question_ar: 'ما هي القاعدة الذهبية لتخدير الفك السفلي (ID Block) في أول أسبوع بالعيادات؟',
      question_en: 'What is the golden rule for your very first Inferior Alveolar (ID) Block in clinics?',
      options_ar: [
        'حقن الكاربولة كاملة في الشفة فوراً',
        'إدخال الإبرة بثقة البروفيسور والدعاء في سرّك ألا تضرب العصب الوجهي',
        'سؤال المريض: "حاسس بلسانك منمل ولا لسه؟" كل 4 ثوانٍ',
        'الخياران الثاني والثالث معاً في نفس اللحظة!'
      ],
      options_en: [
        'Injecting the entire carpule directly into the lip',
        'Inject with professor-level confidence while praying inside not to touch the facial nerve',
        'Asking the patient "Is your tongue numb yet?" every 4 seconds',
        'Options B and C simultaneously!'
      ],
      correct: 3,
      explanation_ar: 'قمة الاحتراف هي التظاهر بالهدوء التام مع فحص خدر الشفة واللسان كل بضع ثوانٍ للتأكد من مفعول الليدوكائين! 💉',
      explanation_en: 'True clinical mastery is projecting absolute calm while checking patient lip and tongue numbness repeatedly!'
    },
    {
      question_ar: 'ما هو الإجراء الفوري عند كسر فايل روتاري (Broken Endo File) في الثلث الأخير من القناة؟',
      question_en: 'What is the immediate psychological and clinical response to a broken rotary file in the apical third?',
      options_ar: [
        'كتم الصرخة والنظر إلى السقف ببرود أعصاب مع ابتسامة دبلوماسية للمريض ثم أخذ أشعة Periapical وإبلاغ المشرف',
        'إنكار وجود القناة الجذرية من الأساس',
        'إلقاء اللوم على شركة تصنيع الفايل أمام المريض',
        'طلب خلع السن فوراً والتظاهر بأن هذا كان المخطط'
      ],
      options_en: [
        'Suppress the scream, glance calmly at the ceiling with a diplomatic smile, then take a periapical X-ray and report to supervisor',
        'Deny the existence of that root canal entirely',
        'Blame the manufacturer out loud to the patient',
        'Suggest immediate extraction and pretend that was the plan all along'
      ],
      correct: 0,
      explanation_ar: 'الهدوء النفسي وأخذ الأشعة واتباع بروتوكول الـ Bypass وإبلاغ المشرف هو السلوك الطبي السليم والرصين! 🩺',
      explanation_en: 'Composure, diagnostic imaging, following bypass protocols, and supervisor consultation is the true professional route!'
    },
    {
      question_ar: 'عند استخدام جهاز الـ Curing Light لبلمرة الكومبوزيت، ما هو السبب العلمي لارتداء النظارة البرتقالية؟',
      question_en: 'When light-curing composite restorations, why is wearing the orange protective shield critical?',
      options_ar: [
        'حماية شبكية العين من ضرر الضوء الأزرق عالي الطاقة (400-500 nm)',
        'لتبدو كبطل خارق في أفلام هوليوود',
        'لمنع المريض من رؤية حيرة الطبيب أثناء اختيار لون الحشوة',
        'لأن اللون البرتقالي يجلب الحظ في عيادات الحشو'
      ],
      options_en: [
        'Shielding retina against high-energy blue light photochemical hazard (400–500 nm)',
        'Looking like an action hero in Hollywood',
        'Preventing the patient from seeing your confusion during shade selection',
        'Because orange brings good luck in operative dentistry'
      ],
      correct: 0,
      explanation_ar: 'الضوء الأزرق يسبب Photochemical Retinal Damage، والفلتر البرتقالي يمتص هذه الموجات لحماية بصر الطبيب! 🛡️',
      explanation_en: 'High-intensity blue light poses retinal photochemical hazard, and the orange shield filters it out safely.'
    },
    {
      question_ar: 'ما هو التفسير السريري لقول المريض: "يا دكتور أسناني نظيفة جداً وبفرشيها 5 مرات يومياً"؟',
      question_en: 'What is the real clinical translation when a patient claims they brush 5 times daily?',
      options_ar: [
        'طبقة الجير (Calculus) المتراكمة هي مجرد ديكور كلسي طبيعي واقٍ',
        'حالة نادرة تحدث فقط أثناء صعوده لكرسي عيادة الأسنان بعد انقطاع 5 سنوات',
        'كان يقصد أنه يفرشيها 5 مرات كل دورة ألعاب أولمبية',
        'الخياران الثاني والثالث هما الحقيقة الإكلينيكية المشتركة!'
      ],
      options_en: [
        'The calculus bridge is simply a natural protective decorative layer',
        'A rare phenomenon occurring only while mounting the dental chair after a 5-year hiatus',
        'They actually meant 5 times every Olympic games cycle',
        'Options B and C represent the shared clinical reality!'
      ],
      correct: 3,
      explanation_ar: 'ظاهرة عيادية شهيرة تؤكد أن فحص الأسنان وإزالة الجير والتثقيف الفموي المستمر هو مفتاح العلاج الناجح! 🪥',
      explanation_en: 'A classic clinical scenario reminding us that objective scaling, hygiene instruction, and empathy lead the way!'
    },
    {
      question_ar: 'أي من هذه المواد تمتلك موهبة الالتصاق بكل شيء (يديك، قفازك، ملابسك) ما عدا تجويف السن؟',
      question_en: 'Which material possesses the superpower to stick to your gloves and clothes, but not the cavity prep?',
      options_ar: [
        'مادة الزنك أوكسايد يوجينول (ZOE)',
        'حشوة الجلاس أينومر (GIC) إذا تأخرت في خلطها ثانيتين',
        'مادة الألجينات إذا انسكبت على البالطو الأبيض',
        'كل ما سبق يمثل تحالفاً سرياً ضد طالب العيادات!'
      ],
      options_en: [
        'Zinc Oxide Eugenol (ZOE)',
        'Glass Ionomer Cement (GIC) if mixed 2 seconds too late',
        'Alginate impression material spilled on a clean white coat',
        'All of the above constitute a secret union against clinical students!'
      ],
      correct: 3,
      explanation_ar: 'السيطرة على وقت الخلط والـ Working Time وعزل اللعاب التام هو الفارق بين الفوضى والاحتراف! ⏱️',
      explanation_en: 'Controlling working time, mixing ratio, and moisture isolation is the true mark of dental expertise!'
    },
    {
      question_ar: 'ما هو الصوت الأكثر إثارة للرعب والترقب في تاريخ عيادات طب الأسنان؟',
      question_en: 'Which sound creates the highest surge of adrenaline in dental clinics?',
      options_ar: [
        'صوت التوربين عالي السرعة في أذن طفل عمره 5 سنوات',
        'صوت "طَقّ" أثناء خلع ضرس عقل مطمور (مفترق طرق بين نجاح الخلع أو كسر الجذر)',
        'صوت المشرف وهو يقول خلف ظهرك: "وريني الكافيتي اللي جهزتها كدا يا دكتور..."',
        'جميع ما سبق يرفع نبضات القلب فوراً إلى 180 نبضة في الدقيقة!'
      ],
      options_en: [
        'High-speed turbine pitch in a 5-year-old child’s ear',
        'A sharp "SNAP" during impacted third molar extraction (apex fracture vs bone release)',
        'The supervisor whispering from behind: "Let me inspect that cavity prep, doctor..."',
        'All of the above instantly spike heart rate to 180 BPM!'
      ],
      correct: 3,
      explanation_ar: 'مواقف خالدة يعيشها كل طالب أسنان وتصقل هدوءه ومرونته وثباته الانفعالي في أصعب اللحظات! ⚡',
      explanation_en: 'Legendary moments every dentist remembers that build nerves of steel and clinical resilience!'
    },
    {
      question_ar: 'ما هو التوقيت الاستراتيجي الذهبي للحصول على توقيع المشرف في دفتر الحالات (Logbook)؟',
      question_en: 'What is the optimal strategic timing to get your clinical logbook signed by the supervisor?',
      options_ar: [
        'فور انتهاء الحالة بنجاح بينما المشرف في قمة الرضا وبعد ارتشاف قهوته الصباحية',
        'قبل إغلاق العيادة بـ 3 دقائق بينما يتزاحم 45 طالباً بنفس القلم الجاف',
        'أثناء مناقشة المشرف مع رئيس القسم حول ميزانية الكلية',
        'خلال استراحة الغداء للمشرف'
      ],
      options_en: [
        'Right after successful completion while the supervisor is content and post-morning coffee',
        '3 minutes before clinic closes while 45 students scramble with the same blue pen',
        'While the supervisor discusses faculty budget with the department head',
        'During the supervisor lunch break'
      ],
      correct: 0,
      explanation_ar: 'الذكاء التنظيمي والمبادرة بتوقيع الحالات أولاً بأول يجنبك طوابير الرعب والتوتر نهاية الفصل الدراسي! 📝',
      explanation_en: 'Early logbook sign-offs and timely case documentation save hours of last-minute clinic stress!'
    },
    {
      question_ar: 'ما هو العضو الوحيد في جسم الإنسان الذي يعاقبك على تناول السكريات بتدمير نفسه ذاتياً؟',
      question_en: 'Which human tissue punishes you for eating sweets by chemically demineralizing itself?',
      options_ar: [
        'ميناء الأسنان (Enamel) بفعل أحماض بكتيريا الـ Streptococcus mutans',
        'المعدة',
        'الكبد',
        'عظام الجمجمة'
      ],
      options_en: [
        'Dental Enamel via Streptococcus mutans organic acid demineralization',
        'Stomach',
        'Liver',
        'Cranial bones'
      ],
      correct: 0,
      explanation_ar: 'تخمير السكريات بالبكتيريا يفرز أحماضاً تخفض الـ pH لأقل من 5.5 (Critical pH) مسببة ذوبان هيدروكسي أباتيت الميناء! 🍬',
      explanation_en: 'Bacterial fermentation drops oral pH below the critical 5.5 threshold, dissolving enamel hydroxyapatite.'
    },
    {
      question_ar: 'ما هي النتيجة الحتمية بعد دراسة 12 مادة إكلينيكية في السنة الثالثة طب أسنان؟',
      question_en: 'What is the guaranteed destiny of mastering 12 clinical subjects in Year 3 Dentistry?',
      options_ar: [
        'التحول إلى بطل سريري لا يهاب أي حشوة أو عصب ملتهب',
        'امتلاك ثقة الجراحين ومعرفة العلماء وإتقان يد الفنانين',
        'استحقاق جائزة +25 نقطة في منصة Kuro Fangs فوراً مع احترام لا نهائي',
        'كل ما سبق باقتدار وفخر كبير! 🏆'
      ],
      options_en: [
        'Transforming into a clinical warrior unfazed by deep caries or acute pulpitis',
        'Gaining the confidence of surgeons, knowledge of scientists, and artistry of sculptors',
        'Deserving +25 points instantly in Kuro Fangs with endless respect',
        'All of the above with pride and excellence! 🏆'
      ],
      correct: 3,
      explanation_ar: 'ألف مبروك! إكمال هذا الكويز يثبت أنك طالب أسنان مبدع تجمع بين العلم والابتسامة وروح التحدي! 🦊✨',
      explanation_en: 'Congratulations! Completing this trivia proves you blend clinical rigor with wit and spirit!'
    }
  ];

  // =========================================================================
  // STATE DEFINITIONS
  // =========================================================================
  const state = {
    activeTab: 'terms', // 'terms' | 'visual' | 'quiz'

    // Game 1: Terms
    termsLevel: 'easy', // 'easy' (4 pairs), 'medium' (8 pairs), 'hard' (12 pairs), 'expert' (16 pairs)
    termsCards: [],
    termsFlipped: [],
    termsMatched: 0,
    termsMoves: 0,
    termsSeconds: 0,
    termsTimer: null,
    termsLocked: false,
    termsWon: false,

    // Game 2: Visual
    visualLevel: 'easy',
    visualCards: [],
    visualFlipped: [],
    visualMatched: 0,
    visualMoves: 0,
    visualSeconds: 0,
    visualTimer: null,
    visualLocked: false,
    visualWon: false,

    // Game 3: Quiz
    quizIndex: 0,
    quizScore: 0,
    quizAnswered: false,
    quizSelectedOpt: null,
    quizFinished: false
  };

  const LEVEL_CONFIG = {
    easy: { pairs: 4, points: 10, label_ar: '🟢 مبتدئ (8 كروت)', label_en: '🟢 Easy (8 Cards)', cols: 4 },
    medium: { pairs: 8, points: 20, label_ar: '🟡 متوسط (16 كرت)', label_en: '🟡 Medium (16 Cards)', cols: 4 },
    hard: { pairs: 12, points: 35, label_ar: '🔴 متقدم (24 كرت)', label_en: '🔴 Hard (24 Cards)', cols: 6 },
    expert: { pairs: 16, points: 50, label_ar: '🔥 خبير (32 كرت)', label_en: '🔥 Expert (32 Cards)', cols: 8 }
  };

  const VISUAL_LEVEL_CONFIG = {
    easy: { pairs: 4, points: 30, label_ar: '🟢 سهل (8 كروت)', label_en: '🟢 Easy (8 Cards)', cols: 4 },
    medium: { pairs: 8, points: 30, label_ar: '🟡 متوسط (16 كرت)', label_en: '🟡 Medium (16 Cards)', cols: 4 },
    hard: { pairs: 12, points: 30, label_ar: '🔴 متقدم (24 كرت)', label_en: '🔴 Hard (24 Cards)', cols: 6 },
    expert: { pairs: 16, points: 30, label_ar: '🔥 خبير (32 كرت)', label_en: '🔥 Expert (32 Cards)', cols: 8 }
  };

  function shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  }

  // =========================================================================
  // GAME 1: DENTAL TERMS MEMORY GAME LOGIC
  // =========================================================================
  function initTermsGame(level = state.termsLevel) {
    if (state.termsTimer) clearInterval(state.termsTimer);

    state.termsLevel = level;
    state.termsMoves = 0;
    state.termsMatched = 0;
    state.termsSeconds = 0;
    state.termsLocked = false;
    state.termsWon = false;
    state.termsFlipped = [];

    const cfg = LEVEL_CONFIG[level];
    const pool = shuffle(TERMS_DATA).slice(0, cfg.pairs);

    const deck = [];
    pool.forEach((item, idx) => {
      // Card A (English Term)
      deck.push({
        uid: `term_en_${item.id}_${idx}`,
        pairId: item.id,
        type: 'en',
        text: item.en,
        sub: item.badge_en,
        icon: item.icon,
        isFlipped: false,
        isMatched: false
      });
      // Card B (Arabic Term)
      deck.push({
        uid: `term_ar_${item.id}_${idx}`,
        pairId: item.id,
        type: 'ar',
        text: item.ar,
        sub: item.badge_ar,
        icon: item.icon,
        isFlipped: false,
        isMatched: false
      });
    });

    state.termsCards = shuffle(deck);

    state.termsTimer = setInterval(() => {
      if (!state.termsWon) {
        state.termsSeconds++;
        const timerEl = document.getElementById('terms-timer-val');
        if (timerEl) timerEl.textContent = formatTime(state.termsSeconds);
      }
    }, 1000);
  }

  function handleTermsCardClick(uid) {
    if (state.termsLocked) return;
    const card = state.termsCards.find(c => c.uid === uid);
    if (!card || card.isFlipped || card.isMatched) return;

    playSound('flip');
    card.isFlipped = true;
    state.termsFlipped.push(card);
    renderTermsBoard();

    if (state.termsFlipped.length === 2) {
      state.termsMoves++;
      updateTermsStatsBar();

      const [c1, c2] = state.termsFlipped;
      if (c1.pairId === c2.pairId && c1.type !== c2.type) {
        // MATCH!
        playSound('match');
        c1.isMatched = true;
        c2.isMatched = true;
        state.termsFlipped = [];
        state.termsMatched++;
        updateTermsStatsBar();
        renderTermsBoard();

        const cfg = LEVEL_CONFIG[state.termsLevel];
        if (state.termsMatched === cfg.pairs) {
          // VICTORY!
          state.termsWon = true;
          clearInterval(state.termsTimer);
          playSound('win');
          launchConfetti();

          // Award Points
          const pts = cfg.points;
          if (window.STORE && typeof window.STORE.addPoints === 'function') {
            window.STORE.addPoints(pts);
          }
          const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
          if (window.Toast && typeof window.Toast.success === 'function') {
            window.Toast.success(
              isAr ? `مبارك! أتممت لعبة الذاكرة بنجاح وحصلت على ${pts} نقطة! 🧠✨` : `Great job! Dental memory cleared! +${pts} pts awarded! 🧠✨`,
              pts
            );
          }
          renderTermsWinModal();
        }
      } else {
        // NO MATCH -> Peek then flip back
        state.termsLocked = true;
        setTimeout(() => {
          c1.isFlipped = false;
          c2.isFlipped = false;
          state.termsFlipped = [];
          state.termsLocked = false;
          renderTermsBoard();
        }, 850);
      }
    }
  }

  function updateTermsStatsBar() {
    const movesEl = document.getElementById('terms-moves-val');
    if (movesEl) movesEl.textContent = state.termsMoves;

    const matchedEl = document.getElementById('terms-matched-val');
    const cfg = LEVEL_CONFIG[state.termsLevel];
    if (matchedEl) matchedEl.textContent = `${state.termsMatched} / ${cfg.pairs}`;
  }

  function renderTermsBoard() {
    const gridEl = document.getElementById('terms-cards-grid');
    if (!gridEl) return;

    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;

    gridEl.innerHTML = state.termsCards.map(card => {
      const isRevealed = card.isFlipped || card.isMatched;
      return `
        <div class="memory-card-wrap ${isRevealed ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}"
             onclick="window.GamesPage.onTermsCardClick('${card.uid}')">
          <div class="memory-card-inner">
            <!-- Front (Cover / Hidden state) -->
            <div class="memory-card-front">
              <div class="memory-card-pattern">
                <span class="memory-card-kuro-emblem">🦷</span>
                <span class="memory-card-kuro-tag">KURO</span>
              </div>
            </div>

            <!-- Back (Revealed Content) -->
            <div class="memory-card-back ${card.type === 'en' ? 'card-type-en' : 'card-type-ar'}">
              <div class="memory-card-badge-pill">
                ${card.type === 'en' ? '🇬🇧 English' : '🇸🇦 بالعربي'}
              </div>
              <div class="memory-card-icon-halo">${card.icon}</div>
              <div class="memory-card-text">${card.text}</div>
              <div class="memory-card-sub">${card.sub}</div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderTermsWinModal() {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
    const cfg = LEVEL_CONFIG[state.termsLevel];
    const modalHost = document.getElementById('arcade-modal-container');
    if (!modalHost) return;

    modalHost.innerHTML = `
      <div class="arcade-win-modal-backdrop">
        <div class="arcade-win-modal-card animate-pop">
          <div class="win-mascot-avatar">
            <img src="assets/fox_skins/fox_skin_4.jpg" alt="Scholar Fox" />
          </div>
          <div class="win-confetti-stars">✨ 🏆 🧠 🌟</div>
          <h2 class="win-title">${isAr ? 'انتصار ذاكرة طبيب الأسنان!' : 'Dental Memory Champion!'}</h2>
          <p class="win-sub">
            ${isAr
              ? `أحسنت صنعاً! طابقت جميع المصطلحات الطبية في مستوى ${cfg.label_ar} ببراعة سريرية فائقة.`
              : `Flawless memorization! You matched all medical terminology pairs on ${cfg.label_en}.`}
          </p>

          <div class="win-stats-grid">
            <div class="win-stat-cell">
              <span class="win-stat-label">${isAr ? 'الزمن المستغرق' : 'Total Time'}</span>
              <span class="win-stat-num">${formatTime(state.termsSeconds)}</span>
            </div>
            <div class="win-stat-cell">
              <span class="win-stat-label">${isAr ? 'عدد المحاولات' : 'Moves Taken'}</span>
              <span class="win-stat-num">${state.termsMoves}</span>
            </div>
            <div class="win-stat-cell win-stat-highlight">
              <span class="win-stat-label">${isAr ? 'النقاط المكتسبة' : 'Points Earned'}</span>
              <span class="win-stat-num">+${cfg.points} pts</span>
            </div>
          </div>

          <div class="win-actions-row">
            <button class="btn btn-primary" onclick="window.GamesPage.replayTerms()">
              <i data-lucide="rotate-ccw"></i>
              <span>${isAr ? 'العب مجدداً' : 'Play Again'}</span>
            </button>
            <button class="btn btn-secondary" onclick="window.GamesPage.nextTermsLevel()">
              <i data-lucide="zap"></i>
              <span>${isAr ? 'المستوى التالي' : 'Next Difficulty'}</span>
            </button>
          </div>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }

  // =========================================================================
  // GAME 2: DENTAL VISUAL IMAGE MATCH LOGIC
  // =========================================================================
  function initVisualGame(level = state.visualLevel) {
    if (state.visualTimer) clearInterval(state.visualTimer);

    state.visualLevel = level;
    state.visualMoves = 0;
    state.visualMatched = 0;
    state.visualSeconds = 0;
    state.visualLocked = false;
    state.visualWon = false;
    state.visualFlipped = [];

    const cfg = VISUAL_LEVEL_CONFIG[level];
    const pool = shuffle(VISUAL_DATA).slice(0, cfg.pairs);

    const deck = [];
    pool.forEach((item, idx) => {
      // 2 visual twin cards per instrument
      deck.push({
        uid: `vis_a_${item.id}_${idx}`,
        pairId: item.id,
        twin: 'A',
        data: item,
        isFlipped: false,
        isMatched: false
      });
      deck.push({
        uid: `vis_b_${item.id}_${idx}`,
        pairId: item.id,
        twin: 'B',
        data: item,
        isFlipped: false,
        isMatched: false
      });
    });

    state.visualCards = shuffle(deck);

    state.visualTimer = setInterval(() => {
      if (!state.visualWon) {
        state.visualSeconds++;
        const timerEl = document.getElementById('visual-timer-val');
        if (timerEl) timerEl.textContent = formatTime(state.visualSeconds);
      }
    }, 1000);
  }

  function handleVisualCardClick(uid) {
    if (state.visualLocked) return;
    const card = state.visualCards.find(c => c.uid === uid);
    if (!card || card.isFlipped || card.isMatched) return;

    playSound('flip');
    card.isFlipped = true;
    state.visualFlipped.push(card);
    renderVisualBoard();

    if (state.visualFlipped.length === 2) {
      state.visualMoves++;
      updateVisualStatsBar();

      const [c1, c2] = state.visualFlipped;
      if (c1.pairId === c2.pairId && c1.twin !== c2.twin) {
        // MATCH!
        playSound('match');
        c1.isMatched = true;
        c2.isMatched = true;
        state.visualFlipped = [];
        state.visualMatched++;
        updateVisualStatsBar();
        renderVisualBoard();

        const cfg = VISUAL_LEVEL_CONFIG[state.visualLevel];
        if (state.visualMatched === cfg.pairs) {
          // VICTORY!
          state.visualWon = true;
          clearInterval(state.visualTimer);
          playSound('win');
          launchConfetti();

          // Award +30 Points
          const pts = 30;
          if (window.STORE && typeof window.STORE.addPoints === 'function') {
            window.STORE.addPoints(pts);
          }
          const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
          if (window.Toast && typeof window.Toast.success === 'function') {
            window.Toast.success(
              isAr ? `رائع جداً! طابقت جميع أدوات العيادة البصرية بنجاح (+${pts} نقطة)! 🪞✨` : `Incredible! All clinical instruments matched! +${pts} pts! 🪞✨`,
              pts
            );
          }
          renderVisualWinModal();
        }
      } else {
        // NO MATCH -> Peek then flip back
        state.visualLocked = true;
        setTimeout(() => {
          c1.isFlipped = false;
          c2.isFlipped = false;
          state.visualFlipped = [];
          state.visualLocked = false;
          renderVisualBoard();
        }, 850);
      }
    }
  }

  function updateVisualStatsBar() {
    const movesEl = document.getElementById('visual-moves-val');
    if (movesEl) movesEl.textContent = state.visualMoves;

    const matchedEl = document.getElementById('visual-matched-val');
    const cfg = VISUAL_LEVEL_CONFIG[state.visualLevel];
    if (matchedEl) matchedEl.textContent = `${state.visualMatched} / ${cfg.pairs}`;
  }

  function renderVisualBoard() {
    const gridEl = document.getElementById('visual-cards-grid');
    if (!gridEl) return;

    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;

    gridEl.innerHTML = state.visualCards.map(card => {
      const isRevealed = card.isFlipped || card.isMatched;
      const d = card.data;
      return `
        <div class="memory-card-wrap visual-card-wrap ${isRevealed ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}"
             onclick="window.GamesPage.onVisualCardClick('${card.uid}')">
          <div class="memory-card-inner">
            <!-- Front (Cover) -->
            <div class="memory-card-front visual-front-theme">
              <div class="memory-card-pattern">
                <span class="memory-card-kuro-emblem">🪞</span>
                <span class="memory-card-kuro-tag">CLINIC</span>
              </div>
            </div>

            <!-- Back (Revealed Instrument Visual Card) -->
            <div class="memory-card-back visual-card-back">
              <div class="visual-card-dept-badge" style="background: ${d.accent}20; color: ${d.accent}; border-color: ${d.accent}40;">
                ${isAr ? d.badge_ar : d.badge_en}
              </div>
              <div class="visual-instrument-icon-box" style="box-shadow: 0 4px 14px ${d.accent}25;">
                <span class="visual-instrument-symbol">${d.icon}</span>
              </div>
              <div class="visual-card-name">${isAr ? d.name_ar : d.name_en}</div>
              <div class="visual-card-hint">${isAr ? d.hint_ar : d.hint_en}</div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderVisualWinModal() {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
    const modalHost = document.getElementById('arcade-modal-container');
    if (!modalHost) return;

    modalHost.innerHTML = `
      <div class="arcade-win-modal-backdrop">
        <div class="arcade-win-modal-card animate-pop">
          <div class="win-mascot-avatar">
            <img src="assets/fox_skins/fox_skin_2.jpg" alt="Surgeon Fox" />
          </div>
          <div class="win-confetti-stars">✨ 🪞 🩺 🌟</div>
          <h2 class="win-title">${isAr ? 'خبير أدوات العيادات السريرية!' : 'Clinical Instruments Master!'}</h2>
          <p class="win-sub">
            ${isAr
              ? `تميز بصري استثنائي! تعرّفت على أدوات الفانتوم والجراحة والتشخيص وطابقتها بنجاح تام.`
              : `Sensational visual recognition! You identified and paired all clinical and pre-clinical instruments.`}
          </p>

          <div class="win-stats-grid">
            <div class="win-stat-cell">
              <span class="win-stat-label">${isAr ? 'الزمن المستغرق' : 'Total Time'}</span>
              <span class="win-stat-num">${formatTime(state.visualSeconds)}</span>
            </div>
            <div class="win-stat-cell">
              <span class="win-stat-label">${isAr ? 'عدد الحركات' : 'Moves'}</span>
              <span class="win-stat-num">${state.visualMoves}</span>
            </div>
            <div class="win-stat-cell win-stat-highlight">
              <span class="win-stat-label">${isAr ? 'النقاط المكتسبة' : 'Points Earned'}</span>
              <span class="win-stat-num">+30 pts</span>
            </div>
          </div>

          <div class="win-actions-row">
            <button class="btn btn-primary" onclick="window.GamesPage.replayVisual()">
              <i data-lucide="rotate-ccw"></i>
              <span>${isAr ? 'العب مجدداً' : 'Play Again'}</span>
            </button>
            <button class="btn btn-secondary" onclick="window.GamesPage.nextVisualLevel()">
              <i data-lucide="zap"></i>
              <span>${isAr ? 'المستوى التالي' : 'Next Difficulty'}</span>
            </button>
          </div>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }

  // =========================================================================
  // GAME 3: FUNNY DENTAL TRIVIA QUIZ LOGIC
  // =========================================================================
  function initQuizGame() {
    state.quizIndex = 0;
    state.quizScore = 0;
    state.quizAnswered = false;
    state.quizSelectedOpt = null;
    state.quizFinished = false;
  }

  function handleQuizAnswer(optionIdx) {
    if (state.quizAnswered || state.quizFinished) return;

    state.quizAnswered = true;
    state.quizSelectedOpt = optionIdx;

    const q = QUIZ_DATA[state.quizIndex];
    const isCorrect = optionIdx === q.correct;

    if (isCorrect) {
      state.quizScore++;
      playSound('match');
    } else {
      playSound('wrong');
    }

    renderQuizStage();
  }

  function handleQuizNext() {
    if (!state.quizAnswered) return;

    if (state.quizIndex < QUIZ_DATA.length - 1) {
      state.quizIndex++;
      state.quizAnswered = false;
      state.quizSelectedOpt = null;
      renderQuizStage();
    } else {
      // QUIZ COMPLETED!
      state.quizFinished = true;
      playSound('win');
      launchConfetti();

      // Award +25 Points
      const pts = 25;
      if (window.STORE && typeof window.STORE.addPoints === 'function') {
        window.STORE.addPoints(pts);
      }
      const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
      if (window.Toast && typeof window.Toast.success === 'function') {
        window.Toast.success(
          isAr ? `مبارك إكمال كويز طب الأسنان المرح بنجاح! (+${pts} نقطة)! 🎯✨` : `Dental Trivia completed! +${pts} academic points earned! 🎯✨`,
          pts
        );
      }
      renderQuizResults();
    }
  }

  function renderQuizStage() {
    const stageEl = document.getElementById('quiz-stage-card');
    if (!stageEl) return;

    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
    const q = QUIZ_DATA[state.quizIndex];
    const totalQ = QUIZ_DATA.length;
    const progressPct = Math.round(((state.quizIndex + 1) / totalQ) * 100);

    const questionText = isAr ? q.question_ar : q.question_en;
    const options = isAr ? q.options_ar : q.options_en;
    const explanation = isAr ? q.explanation_ar : q.explanation_en;

    stageEl.innerHTML = `
      <div class="quiz-container-box">
        <!-- Progress Bar & Counter -->
        <div class="quiz-header-bar">
          <div class="quiz-meta-info">
            <span class="badge badge-primary">🦷 ${isAr ? 'كويز طب الأسنان السريع والمضحك' : 'Funny Dental Trivia Quiz'}</span>
            <span class="quiz-counter-text">${isAr ? `السؤال ${state.quizIndex + 1} من ${totalQ}` : `Question ${state.quizIndex + 1} of ${totalQ}`}</span>
          </div>
          <div class="quiz-score-pill">
            <i data-lucide="award"></i>
            <span>${isAr ? `النتيجة: ${state.quizScore}` : `Score: ${state.quizScore}`}</span>
          </div>
        </div>

        <div class="quiz-progress-track">
          <div class="quiz-progress-fill" style="width: ${progressPct}%;"></div>
        </div>

        <!-- Question Prompt -->
        <div class="quiz-question-box">
          <span class="quiz-question-num">Q${state.quizIndex + 1}</span>
          <h3 class="quiz-question-title">${questionText}</h3>
        </div>

        <!-- Multiple Choice Options -->
        <div class="quiz-options-list">
          ${options.map((opt, idx) => {
            let stateClass = '';
            if (state.quizAnswered) {
              if (idx === q.correct) stateClass = 'opt-correct';
              else if (idx === state.quizSelectedOpt) stateClass = 'opt-wrong';
              else stateClass = 'opt-disabled';
            }
            const letters = ['A', 'B', 'C', 'D'];
            return `
              <button class="quiz-option-btn ${stateClass}"
                      ${state.quizAnswered ? 'disabled' : ''}
                      onclick="window.GamesPage.onQuizSelect(${idx})">
                <span class="opt-letter">${letters[idx]}</span>
                <span class="opt-text">${opt}</span>
                ${state.quizAnswered && idx === q.correct ? '<span class="opt-check">✓</span>' : ''}
                ${state.quizAnswered && idx === state.quizSelectedOpt && idx !== q.correct ? '<span class="opt-cross">✕</span>' : ''}
              </button>
            `;
          }).join('')}
        </div>

        <!-- Feedback & Explanation Banner -->
        ${state.quizAnswered ? `
          <div class="quiz-explanation-card animate-fade-in ${state.quizSelectedOpt === q.correct ? 'feedback-correct' : 'feedback-wrong'}">
            <div class="feedback-title-row">
              <span class="feedback-icon">${state.quizSelectedOpt === q.correct ? '🎉 ممتاز!' : '💡 معلومة طبية مهمة:'}</span>
              <span class="feedback-text">${explanation}</span>
            </div>
            <button class="btn btn-primary quiz-next-btn" onclick="window.GamesPage.onQuizNext()">
              <span>${state.quizIndex === totalQ - 1 ? (isAr ? 'عرض النتيجة واللقب 🏆' : 'View Final Score 🏆') : (isAr ? 'السؤال التالي ➔' : 'Next Question ➔')}</span>
            </button>
          </div>
        ` : ''}
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }

  function renderQuizResults() {
    const stageEl = document.getElementById('quiz-stage-card');
    if (!stageEl) return;

    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
    const score = state.quizScore;
    const total = QUIZ_DATA.length;

    let titleAr = '';
    let titleEn = '';
    let badgeIcon = '🏆';
    let skinImg = 'assets/fox_skins/fox_skin_1.jpg';

    if (score === 10) {
      titleAr = '🏆 بروفيسور الأسنان الفولاذي (Legendary Dental Chief)';
      titleEn = '🏆 Legendary Dental Chief (Perfect Score)';
      badgeIcon = '👑';
      skinImg = 'assets/fox_skins/fox_skin_4.jpg';
    } else if (score >= 8) {
      titleAr = '🌟 جراح سريري محنك (Senior Clinical Resident)';
      titleEn = '🌟 Senior Clinical Resident';
      badgeIcon = '🩺';
      skinImg = 'assets/fox_skins/fox_skin_2.jpg';
    } else if (score >= 6) {
      titleAr = '🩺 طبيب امتياز طموح (Rising Dental Star)';
      titleEn = '🩺 Rising Dental Star';
      badgeIcon = '✨';
      skinImg = 'assets/fox_skins/fox_skin_3.jpg';
    } else {
      titleAr = '🦊 ثعلب قيد التدريب بالمعمل (Phantom Apprentice)';
      titleEn = '🦊 Phantom Lab Apprentice';
      badgeIcon = '💡';
      skinImg = 'assets/fox_skins/fox_skin_1.jpg';
    }

    stageEl.innerHTML = `
      <div class="quiz-results-card animate-pop">
        <div class="results-mascot-avatar">
          <img src="${skinImg}" alt="Fox Mascot" />
        </div>
        <div class="results-badge">${badgeIcon}</div>
        <h2 class="results-title">${isAr ? 'انتهى الكويز الأكاديمي السريع!' : 'Dental Trivia Completed!'}</h2>
        <div class="results-score-badge">${score} / ${total}</div>
        <h4 class="results-rank-title">${isAr ? titleAr : titleEn}</h4>
        <p class="results-sub">
          ${isAr
            ? `حصلت على إجمالي <strong>+25 نقطة أكاديمية</strong> أضيفت مباشرة إلى رصيدك لاستبدال سكنات الثعلب المميزة!`
            : `You earned <strong>+25 academic points</strong> added directly to your balance for fox mascot skin unlocks!`}
        </p>

        <div class="results-actions-row">
          <button class="btn btn-primary" onclick="window.GamesPage.restartQuiz()">
            <i data-lucide="rotate-ccw"></i>
            <span>${isAr ? 'إعادة الاختبار' : 'Retake Trivia'}</span>
          </button>
          <a href="#/rewards" class="btn btn-secondary">
            <i data-lucide="sparkles"></i>
            <span>${isAr ? 'فتح سكنات الثعلب' : 'Open Mascot Hub'}</span>
          </a>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }

  // =========================================================================
  // MAIN PAGE RENDER & TAB SWITCHING
  // =========================================================================
  function render(container, queryParams) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
    const equipped = window.STORE ? window.STORE.getEquippedSkinData() : null;
    const currentPoints = window.STORE ? window.STORE.getPoints() : 25;

    // Check query param for default tab
    const requestedTab = queryParams?.get('tab');
    if (requestedTab && ['terms', 'visual', 'quiz'].includes(requestedTab)) {
      state.activeTab = requestedTab;
    }

    container.innerHTML = `
      <div class="arcade-page-wrapper">
        <!-- Hero Header -->
        <div class="arcade-hero-card">
          <div class="arcade-hero-content">
            <div class="arcade-hero-badge">
              <span class="badge-pulse-dot"></span>
              <span>🎮 ${isAr ? 'مركز الألعاب والترفيه الأكاديمي' : 'Arcade & Dental Games Hub'}</span>
            </div>
            <h1 class="arcade-hero-title">
              ${isAr ? 'ألعاب وتحديات الذاكرة السريرية' : 'Dental Arcade & Memory Challenges'}
            </h1>
            <p class="arcade-hero-sub">
              ${isAr
                ? 'استمتع بالألعاب السريرية وتحديات المصطلحات، اختبر سرعة بديهتك، واكسب نقاطاً أكاديمية لاستبدال سكنات الثعلب الـ 4 وثيمات المنصة!'
                : 'Enjoy interactive dental challenges, master medical terms, test your clinic reflexes, and earn academic points for mascot skins!'}
            </p>
          </div>

          <!-- Points & Equipped Mascot Pill -->
          <div class="arcade-hero-mascot-box">
            <a href="#/rewards" class="arcade-mascot-chip" title="${isAr ? 'انتقل إلى متجر سكنات الثعلب' : 'Open Fox Mascot Skins Hub'}">
              <img src="${equipped ? equipped.image : 'assets/fox_skins/fox_skin_1.jpg'}" alt="Mascot" class="arcade-mascot-avatar" />
              <div class="arcade-mascot-meta">
                <span class="arcade-mascot-name">${equipped ? (isAr ? equipped.name_ar : equipped.name_en) : 'Kuro Fox'}</span>
                <span class="arcade-points-balance">
                  <i data-lucide="sparkles"></i>
                  <span id="arcade-hero-points">${currentPoints} ${isAr ? 'نقطة' : 'pts'}</span>
                </span>
              </div>
            </a>
          </div>
        </div>

        <!-- Game Select Tabs Bar -->
        <div class="arcade-tabs-bar">
          <button class="arcade-tab-btn ${state.activeTab === 'terms' ? 'active' : ''}" onclick="window.GamesPage.switchTab('terms')">
            <span class="tab-icon">🧠</span>
            <div class="tab-label-group">
              <span class="tab-main-label">${isAr ? 'ذاكرة المصطلحات الطبية' : 'Dental Terms Memory'}</span>
              <span class="tab-sub-label">${isAr ? '4 مستويات (+10 إلى +50 نقطة)' : '4 Levels (+10 to +50 pts)'}</span>
            </div>
          </button>

          <button class="arcade-tab-btn ${state.activeTab === 'visual' ? 'active' : ''}" onclick="window.GamesPage.switchTab('visual')">
            <span class="tab-icon">🪞</span>
            <div class="tab-label-group">
              <span class="tab-main-label">${isAr ? 'مطابقة أدوات العيادة البصرية' : 'Visual Instruments Match'}</span>
              <span class="tab-sub-label">${isAr ? 'أدوات وفانتوم وأشعة (+30 نقطة)' : 'Instruments & Phantom (+30 pts)'}</span>
            </div>
          </button>

          <button class="arcade-tab-btn ${state.activeTab === 'quiz' ? 'active' : ''}" onclick="window.GamesPage.switchTab('quiz')">
            <span class="tab-icon">🎯</span>
            <div class="tab-label-group">
              <span class="tab-main-label">${isAr ? 'كويز الأسنان السريع والمضحك' : 'Funny Dental Trivia Quiz'}</span>
              <span class="tab-sub-label">${isAr ? '10 أسئلة ممتعة (+25 نقطة)' : '10 Fast MCQs (+25 pts)'}</span>
            </div>
          </button>
        </div>

        <!-- Dynamic Game Stage -->
        <div id="arcade-dynamic-stage" class="arcade-stage-wrapper"></div>

        <!-- Modal Container for Wins -->
        <div id="arcade-modal-container"></div>
      </div>
    `;

    renderActiveTabStage();
    if (window.lucide) window.lucide.createIcons();
  }

  function renderActiveTabStage() {
    const stage = document.getElementById('arcade-dynamic-stage');
    if (!stage) return;

    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;

    // Clear modals
    const modalHost = document.getElementById('arcade-modal-container');
    if (modalHost) modalHost.innerHTML = '';

    if (state.activeTab === 'terms') {
      const cfg = LEVEL_CONFIG[state.termsLevel];
      stage.innerHTML = `
        <div class="game-panel-card animate-fade-in">
          <!-- Top Control & Level Selection Bar -->
          <div class="game-control-header">
            <div class="game-level-selector">
              <span class="level-select-label">${isAr ? 'المستوى الصعوبة:' : 'Difficulty Level:'}</span>
              <div class="level-buttons-group">
                <button class="btn-level ${state.termsLevel === 'easy' ? 'active' : ''}" onclick="window.GamesPage.changeTermsLevel('easy')">
                  ${isAr ? '🟢 مبتدئ (8 كروت) [+10]' : '🟢 Easy (8 Cards) [+10]'}
                </button>
                <button class="btn-level ${state.termsLevel === 'medium' ? 'active' : ''}" onclick="window.GamesPage.changeTermsLevel('medium')">
                  ${isAr ? '🟡 متوسط (16 كرت) [+20]' : '🟡 Medium (16 Cards) [+20]'}
                </button>
                <button class="btn-level ${state.termsLevel === 'hard' ? 'active' : ''}" onclick="window.GamesPage.changeTermsLevel('hard')">
                  ${isAr ? '🔴 متقدم (24 كرت) [+35]' : '🔴 Hard (24 Cards) [+35]'}
                </button>
                <button class="btn-level ${state.termsLevel === 'expert' ? 'active' : ''}" onclick="window.GamesPage.changeTermsLevel('expert')">
                  ${isAr ? '🔥 خبير (32 كرت) [+50]' : '🔥 Expert (32 Cards) [+50]'}
                </button>
              </div>
            </div>

            <!-- Stats Bar (Stopwatch, Moves, Matched, Replay) -->
            <div class="game-stats-dock">
              <div class="stat-dock-item" title="${isAr ? 'الوقت المنقضي' : 'Elapsed Time'}">
                <i data-lucide="timer"></i>
                <span id="terms-timer-val">${formatTime(state.termsSeconds)}</span>
              </div>
              <div class="stat-dock-item" title="${isAr ? 'عدد الحركات' : 'Moves Counter'}">
                <i data-lucide="mouse-pointer-click"></i>
                <span id="terms-moves-val">${state.termsMoves}</span>
              </div>
              <div class="stat-dock-item" title="${isAr ? 'الأزواج المتطابقة' : 'Matched Pairs'}">
                <i data-lucide="check-circle-2"></i>
                <span id="terms-matched-val">${state.termsMatched} / ${cfg.pairs}</span>
              </div>
              <button class="btn-stat-action" onclick="window.GamesPage.replayTerms()" title="${isAr ? 'إعادة خلط وبدء اللعبة' : 'Reset & Shuffle'}">
                <i data-lucide="rotate-ccw"></i>
                <span>${isAr ? 'إعادة' : 'Reset'}</span>
              </button>
            </div>
          </div>

          <!-- Cards Grid -->
          <div id="terms-cards-grid" class="memory-cards-grid grid-cols-${cfg.cols}"></div>
        </div>
      `;
      initTermsGame(state.termsLevel);
      renderTermsBoard();
      updateTermsStatsBar();
    } else if (state.activeTab === 'visual') {
      const cfg = VISUAL_LEVEL_CONFIG[state.visualLevel];
      stage.innerHTML = `
        <div class="game-panel-card animate-fade-in">
          <!-- Top Control & Level Selection Bar -->
          <div class="game-control-header">
            <div class="game-level-selector">
              <span class="level-select-label">${isAr ? 'عدد الأدوات والأزواج:' : 'Instrument Pairs:'}</span>
              <div class="level-buttons-group">
                <button class="btn-level ${state.visualLevel === 'easy' ? 'active' : ''}" onclick="window.GamesPage.changeVisualLevel('easy')">
                  ${isAr ? '🟢 4 أدوات (8 كروت)' : '🟢 4 Tools (8 Cards)'}
                </button>
                <button class="btn-level ${state.visualLevel === 'medium' ? 'active' : ''}" onclick="window.GamesPage.changeVisualLevel('medium')">
                  ${isAr ? '🟡 8 أدوات (16 كرت)' : '🟡 8 Tools (16 Cards)'}
                </button>
                <button class="btn-level ${state.visualLevel === 'hard' ? 'active' : ''}" onclick="window.GamesPage.changeVisualLevel('hard')">
                  ${isAr ? '🔴 12 أداة (24 كرت)' : '🔴 12 Tools (24 Cards)'}
                </button>
                <button class="btn-level ${state.visualLevel === 'expert' ? 'active' : ''}" onclick="window.GamesPage.changeVisualLevel('expert')">
                  ${isAr ? '🔥 16 أداة (32 كرت)' : '🔥 16 Tools (32 Cards)'}
                </button>
              </div>
            </div>

            <!-- Stats Bar -->
            <div class="game-stats-dock">
              <div class="stat-dock-item" title="${isAr ? 'الوقت المنقضي' : 'Elapsed Time'}">
                <i data-lucide="timer"></i>
                <span id="visual-timer-val">${formatTime(state.visualSeconds)}</span>
              </div>
              <div class="stat-dock-item" title="${isAr ? 'عدد الحركات' : 'Moves Counter'}">
                <i data-lucide="mouse-pointer-click"></i>
                <span id="visual-moves-val">${state.visualMoves}</span>
              </div>
              <div class="stat-dock-item" title="${isAr ? 'الأدوات المطابقة' : 'Matched Instruments'}">
                <i data-lucide="check-circle-2"></i>
                <span id="visual-matched-val">${state.visualMatched} / ${cfg.pairs}</span>
              </div>
              <button class="btn-stat-action" onclick="window.GamesPage.replayVisual()" title="${isAr ? 'إعادة خلط وبدء اللعبة' : 'Reset & Shuffle'}">
                <i data-lucide="rotate-ccw"></i>
                <span>${isAr ? 'إعادة' : 'Reset'}</span>
              </button>
            </div>
          </div>

          <!-- Cards Grid -->
          <div id="visual-cards-grid" class="memory-cards-grid grid-cols-${cfg.cols}"></div>
        </div>
      `;
      initVisualGame(state.visualLevel);
      renderVisualBoard();
      updateVisualStatsBar();
    } else if (state.activeTab === 'quiz') {
      stage.innerHTML = `
        <div id="quiz-stage-card" class="game-panel-card animate-fade-in"></div>
      `;
      initQuizGame();
      renderQuizStage();
    }

    if (window.lucide) window.lucide.createIcons();
  }

  // =========================================================================
  // PUBLIC CONTROLLER EXPORTS
  // =========================================================================
  return {
    render,
    switchTab(tab) {
      if (state.termsTimer) clearInterval(state.termsTimer);
      if (state.visualTimer) clearInterval(state.visualTimer);
      state.activeTab = tab;

      // Update active tab buttons
      document.querySelectorAll('.arcade-tab-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      event?.currentTarget?.classList?.add('active');

      renderActiveTabStage();
    },

    // Terms Game Actions
    onTermsCardClick: handleTermsCardClick,
    changeTermsLevel(lvl) {
      state.termsLevel = lvl;
      renderActiveTabStage();
    },
    replayTerms() {
      const modalHost = document.getElementById('arcade-modal-container');
      if (modalHost) modalHost.innerHTML = '';
      initTermsGame(state.termsLevel);
      renderTermsBoard();
      updateTermsStatsBar();
    },
    nextTermsLevel() {
      const modalHost = document.getElementById('arcade-modal-container');
      if (modalHost) modalHost.innerHTML = '';
      const lvls = ['easy', 'medium', 'hard', 'expert'];
      const curIdx = lvls.indexOf(state.termsLevel);
      const nextLvl = lvls[(curIdx + 1) % lvls.length];
      state.termsLevel = nextLvl;
      renderActiveTabStage();
    },

    // Visual Game Actions
    onVisualCardClick: handleVisualCardClick,
    changeVisualLevel(lvl) {
      state.visualLevel = lvl;
      renderActiveTabStage();
    },
    replayVisual() {
      const modalHost = document.getElementById('arcade-modal-container');
      if (modalHost) modalHost.innerHTML = '';
      initVisualGame(state.visualLevel);
      renderVisualBoard();
      updateVisualStatsBar();
    },
    nextVisualLevel() {
      const modalHost = document.getElementById('arcade-modal-container');
      if (modalHost) modalHost.innerHTML = '';
      const lvls = ['easy', 'medium', 'hard', 'expert'];
      const curIdx = lvls.indexOf(state.visualLevel);
      const nextLvl = lvls[(curIdx + 1) % lvls.length];
      state.visualLevel = nextLvl;
      renderActiveTabStage();
    },

    // Quiz Actions
    onQuizSelect: handleQuizAnswer,
    onQuizNext: handleQuizNext,
    restartQuiz() {
      initQuizGame();
      renderQuizStage();
    }
  };
})();

export default function renderGames(container, params) {
  if (window.GamesPage && typeof window.GamesPage.render === 'function') {
    return window.GamesPage.render(container, params);
  }
}

