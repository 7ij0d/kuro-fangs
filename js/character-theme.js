/**
 * KURO FANGS — CHARACTER THEME SYSTEM ARCHITECTURE
 * Official character theme registry & asset state management
 * 
 * First Official Character Theme: "Kuro"
 * Source of Truth: 8 Official Transparent Character Poses
 */

(function(window) {
  'use strict';

  // 1. OFFICIAL CHARACTER THEMES REGISTRY
  const CHARACTER_THEMES = {
    kuro: {
      id: 'kuro',
      name_ar: 'كورو',
      name_en: 'Kuro',
      title_ar: 'التميمة والشخصية الرسمية لمنصة كورو فانغز',
      title_en: 'Official Mascot & Visual Identity of Kuro Fangs',
      tag_ar: 'الهوية الرسمية الأولى',
      tag_en: 'Official First Character',
      badge_ar: 'الرسمي المعتمد',
      badge_en: 'Official Certified',
      cost: 0,
      isFree: true,
      desc_ar: 'الشخصية الرسمية المعتمدة لدفعة طب وجراحة الفم والأسنان. يرتدي معطف الأكاديميا العاجي، قناع الأوبسيديان، والوشاح القرمزي المتوهج.',
      desc_en: 'The official visual source of truth for Kuro Fangs dental students. Cloaked in warm bone ivory, charcoal obsidian mask, and radiant crimson scarf.',
      palette: {
        primary: '#C84343',      // Kuro Crimson
        primaryHover: '#B33636',
        secondary: '#1E1F2B',    // Kuro Obsidian Slate
        accent: '#F59E0B',       // Golden Amber
        bgLight: '#FAF8F5',      // Warm Ivory
        bgDark: '#0E0F15',       // Obsidian Void
        surfaceLight: '#FFFFFF',
        surfaceDark: '#14151E',
        textLight: '#14151E',
        textDark: '#F6F2EC',
        borderLight: '#E8E2D8',
        borderDark: '#242636'
      },
      theme_colors: ['#C84343', '#1E1F2B', '#FAF8F5', '#F59E0B'],
      assets: {
        idle: 'assets/characters/kuro/Kuro-Idle.png',
        happy: 'assets/characters/kuro/Kuro-Happy.png',
        excited: 'assets/characters/kuro/Kuro-Excited.png',
        thinking: 'assets/characters/kuro/Kuro-Thinking.png',
        focused: 'assets/characters/kuro/Kuro-Focused.png',
        tired: 'assets/characters/kuro/Kuro-Tired.png',
        reading: 'assets/characters/kuro/Kuro-Reading.png',
        achieving: 'assets/characters/kuro/Kuro-Achieving.png'
      },
      // 8 Official Poses & Semantic Contexts
      states: [
        {
          key: 'idle',
          name_ar: 'الوضع الافتراضي والترحيب',
          name_en: 'Idle & Welcome',
          file: 'Kuro-Idle.png',
          context_ar: 'الصفحة الرئيسية، الأفاتار العام، وشريط التنقل العلوي والجانبي',
          context_en: 'Header, Sidebar & Welcome Hero Greeting',
          role_ar: 'التميمة الترحيبية الدائمة للدفعة'
        },
        {
          key: 'reading',
          name_ar: 'قراءة ومطالعة الشيتات',
          name_en: 'Reading & Studying',
          file: 'Kuro-Reading.png',
          context_ar: 'مكتبة الشيتات، المحاضرات الدراسية، وقارئ المستندات',
          context_en: 'Sheets Library, Lecture Handouts & Document Hub',
          role_ar: 'مرافقة الطالب أثناء استعراض الملازم والمحاضرات'
        },
        {
          key: 'focused',
          name_ar: 'التركيز التام والمذاكرة العميقة',
          name_en: 'Deep Focus & Study',
          file: 'Kuro-Focused.png',
          context_ar: 'شاشات خوض الكويزات التفاعلية، حل التحديات، وجلسات المذاكرة المركزة',
          context_en: 'Active Quiz Taking & Deep Study Sessions',
          role_ar: 'تحفيز الانتباه والتركيز أثناء حل الأسئلة السريرية'
        },
        {
          key: 'thinking',
          name_ar: 'التفكير والاستفسار والبحث',
          name_en: 'Thinking & Querying',
          file: 'Kuro-Thinking.png',
          context_ar: 'بنك الأسئلة، فلاتر البحث، وحالات الأسئلة المحفوظة الفارغة',
          context_en: 'Question Bank, Search Filters & Empty Query States',
          role_ar: 'المساعدة في تدبر وتحليل الحالات السريرية المعقدة'
        },
        {
          key: 'happy',
          name_ar: 'السعادة والرضا والمكافأة',
          name_en: 'Happy & Positive Feedback',
          file: 'Kuro-Happy.png',
          context_ar: 'الإجابات الصحيحة في الكويزات، ستريك الدراسة اليومي، وزيادة الرصيد',
          context_en: 'Correct Quiz Answers, Daily Streak Milestones & Points Earned',
          role_ar: 'تعزيز الثقة وتقديم تغذية راجعة إيجابية مشجعة'
        },
        {
          key: 'excited',
          name_ar: 'الحماس والتفوق والأرقام القياسية',
          name_en: 'Excited & High Scores',
          file: 'Kuro-Excited.png',
          context_ar: 'الفوز في ألعاب الذاكرة السريرية، تحقيق رقم قياسي، والترقيات',
          context_en: 'Dental Arcade Victories, High Scores & Level Ups',
          role_ar: 'الاحتفال بالانتصارات والأرقام القياسية الاستثنائية'
        },
        {
          key: 'achieving',
          name_ar: 'الإنجاز الأكاديمي والدرجة الكاملة',
          name_en: 'Academic Excellence (100%)',
          file: 'Kuro-Achieving.png',
          context_ar: 'إكمال الكويز بنتيجة كاملة 100%، واجتياز الامتحانات بنجاح باهر',
          context_en: 'Perfect 100% Quiz Scores, Exam Clearances & Trophy Wins',
          role_ar: 'تتويج الطالب بالدرجة الكاملة والتفوق الأكاديمي'
        },
        {
          key: 'tired',
          name_ar: 'الإرهاق وأخذ استراحة لتجديد النشاط',
          name_en: 'Study Fatigue & Break Reminder',
          file: 'Kuro-Tired.png',
          context_ar: 'تنبيهات جلسات المذاكرة الطويلة، إعادة المحاولة بعد الخطأ، وأخذ استراحة',
          context_en: 'Long Study Break Reminders & Retry Encouragements',
          role_ar: 'تذكير الطالب بالحفاظ على راحته وتجديد طاقته'
        }
      ]
    }
  };

  // 2. CHARACTER THEME SYSTEM API
  const CharacterThemeSystem = {
    // Registry Access
    getAllThemes() {
      return Object.values(CHARACTER_THEMES);
    },

    getTheme(themeId) {
      return CHARACTER_THEMES[themeId] || CHARACTER_THEMES.kuro;
    },

    getActiveThemeId() {
      if (window.STORE && typeof window.STORE.getEquippedCharacter === 'function') {
        return window.STORE.getEquippedCharacter() || 'kuro';
      }
      return 'kuro';
    },

    getActiveTheme() {
      return this.getTheme(this.getActiveThemeId());
    },

    // Get asset URL for any state of the active or specified character
    getAsset(stateKey, themeId) {
      const theme = themeId ? this.getTheme(themeId) : this.getActiveTheme();
      if (!theme || !theme.assets) return 'assets/characters/kuro/Kuro-Idle.png';
      return theme.assets[stateKey] || theme.assets.idle || 'assets/characters/kuro/Kuro-Idle.png';
    },

    // Get metadata for a specific state
    getStateInfo(stateKey, themeId) {
      const theme = themeId ? this.getTheme(themeId) : this.getActiveTheme();
      if (!theme || !theme.states) return null;
      return theme.states.find(s => s.key === stateKey) || null;
    },

    // Helper: Render HTML Image for a Character State with Natural Aspect Ratio
    renderCharacter(stateKey, options = {}) {
      const {
        themeId = null,
        className = '',
        alt = '',
        width = null,
        height = null,
        style = '',
        animate = 'kuro-fade-in'
      } = options;

      const src = this.getAsset(stateKey, themeId);
      const stateInfo = this.getStateInfo(stateKey, themeId);
      const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
      const computedAlt = alt || (stateInfo ? (isAr ? stateInfo.name_ar : stateInfo.name_en) : 'Kuro Character');

      const widthAttr = width ? `width="${width}"` : '';
      const heightAttr = height ? `height="${height}"` : '';
      const animClass = animate ? ` ${animate}` : '';

      return `
        <img 
          src="${src}" 
          alt="${computedAlt}" 
          class="kuro-character-img${animClass} ${className}".trim() 
          ${widthAttr} 
          ${heightAttr} 
          style="${style}" 
          loading="lazy" 
          draggable="false"
        />
      `;
    },

    // Extensibility: Register future characters
    registerTheme(themeObj) {
      if (!themeObj || !themeObj.id || !themeObj.assets) {
        console.error('[CharacterThemeSystem] Invalid character theme object');
        return false;
      }
      CHARACTER_THEMES[themeObj.id] = themeObj;
      if (window.STORE && typeof window.STORE.notify === 'function') {
        window.STORE.notify('character_themes_updated', themeObj);
      }
      return true;
    }
  };

  // Expose globally
  window.CHARACTER_THEMES = CHARACTER_THEMES;
  window.CharacterThemeSystem = CharacterThemeSystem;

})(window);
