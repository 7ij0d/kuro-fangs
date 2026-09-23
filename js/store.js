/**
 * KURO FANGS — STORE (State, LocalStorage, Lang & Official Kuro Theme Manager)
 * Architected with CharacterThemeSystem for extensible character themes.
 */

class AppStore {
  constructor() {
    this.STORAGE_KEYS = {
      POINTS: 'kf_user_points',
      LANG: 'kf_lang',
      THEME: 'kf_theme',
      FAVORITES: 'kf_user_favorites',
      USER_INFO: 'kf_user_info',
      EQUIPPED_CHARACTER: 'kf_equipped_character',
      OWNED_CHARACTERS: 'kf_owned_characters',
      // Legacy storage key aliases
      EQUIPPED_SKIN: 'kf_equipped_skin',
      OWNED_SKINS: 'kf_owned_skins'
    };

    this.listeners = new Set();
    this.initDefaults();
  }

  initDefaults() {
    // 1. Official Character Management (Default: 'kuro')
    let owned = ['kuro'];
    try {
      const stored = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.OWNED_CHARACTERS));
      if (Array.isArray(stored) && stored.length > 0) {
        owned = stored;
      }
    } catch (e) {
      owned = ['kuro'];
    }
    if (!owned.includes('kuro')) owned.unshift('kuro');
    localStorage.setItem(this.STORAGE_KEYS.OWNED_CHARACTERS, JSON.stringify(owned));
    localStorage.setItem(this.STORAGE_KEYS.OWNED_SKINS, JSON.stringify(owned));

    let equipped = localStorage.getItem(this.STORAGE_KEYS.EQUIPPED_CHARACTER) || 'kuro';
    if (!owned.includes(equipped)) {
      equipped = 'kuro';
    }
    localStorage.setItem(this.STORAGE_KEYS.EQUIPPED_CHARACTER, equipped);
    localStorage.setItem(this.STORAGE_KEYS.EQUIPPED_SKIN, equipped);

    // 2. Site-wide Official Theme (Default: 'dark' Obsidian Night)
    let savedTheme = localStorage.getItem(this.STORAGE_KEYS.THEME);
    const userSelected = localStorage.getItem('kf_theme_user_selected') === 'true';

    if (!userSelected) {
      // Default primary theme is black/dark
      savedTheme = 'dark';
    } else if (savedTheme === 'classic' || savedTheme === 'surgeon' || savedTheme === 'scholar' || savedTheme === 'light' || savedTheme === 'kuro') {
      savedTheme = 'light';
    } else {
      savedTheme = 'dark';
    }

    localStorage.setItem(this.STORAGE_KEYS.THEME, savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    // 3. Language (Default: Arabic first for dental batch)
    if (!localStorage.getItem(this.STORAGE_KEYS.LANG)) {
      localStorage.setItem(this.STORAGE_KEYS.LANG, 'ar');
    }

    // 4. Points
    if (localStorage.getItem(this.STORAGE_KEYS.POINTS) === null) {
      localStorage.setItem(this.STORAGE_KEYS.POINTS, '25');
    }

    // 5. Favorites
    if (!localStorage.getItem(this.STORAGE_KEYS.FAVORITES)) {
      localStorage.setItem(this.STORAGE_KEYS.FAVORITES, JSON.stringify([
        { id: 'sh-1', title: 'Local Anesthesia Techniques & Landmarks', type: 'sheet', subject_name: 'OMFS I' },
        { id: 'sh-2', title: 'Preparation of Full Veneer Crown', type: 'sheet', subject_name: 'Fixed Pros II' }
      ]));
    }

    // 6. User Info
    if (!localStorage.getItem(this.STORAGE_KEYS.USER_INFO)) {
      localStorage.setItem(this.STORAGE_KEYS.USER_INFO, JSON.stringify({
        name: 'Kuro Student',
        title: 'Year 3 Dental Student',
        avatarText: 'K'
      }));
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(event, payload) {
    this.listeners.forEach(cb => {
      try { cb(event, payload); } catch (e) { console.error(e); }
    });
  }

  // ==========================================================================
  // THEME MANAGEMENT (Official Kuro Dark & Kuro Light)
  // ==========================================================================
  getTheme() {
    const userSelected = localStorage.getItem('kf_theme_user_selected') === 'true';
    if (!userSelected) return 'dark';
    const theme = localStorage.getItem(this.STORAGE_KEYS.THEME);
    if (theme === 'kuro' || theme === 'light') return 'light';
    return 'dark';
  }

  setTheme(theme) {
    let normalizedTheme = 'dark';
    if (theme === 'kuro' || theme === 'light' || theme === 'classic' || theme === 'scholar') {
      normalizedTheme = 'light';
    } else {
      normalizedTheme = 'dark';
    }

    localStorage.setItem(this.STORAGE_KEYS.THEME, normalizedTheme);
    localStorage.setItem('kf_theme_user_selected', 'true');
    document.documentElement.setAttribute('data-theme', normalizedTheme);
    this.notify('theme_changed', normalizedTheme);
    return normalizedTheme;
  }

  toggleTheme() {
    const current = this.getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    return this.setTheme(next);
  }

  // ==========================================================================
  // POINTS
  // ==========================================================================
  getPoints() {
    return parseInt(localStorage.getItem(this.STORAGE_KEYS.POINTS) || '25', 10);
  }

  addPoints(amount) {
    const current = this.getPoints();
    const updated = Math.max(0, current + amount);
    localStorage.setItem(this.STORAGE_KEYS.POINTS, updated.toString());
    this.notify('points_changed', updated);
    return updated;
  }

  // ==========================================================================
  // USER INFO
  // ==========================================================================
  getUserInfo() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.USER_INFO)) || {
        name: 'Kuro Student',
        title: 'Year 3 Dental Student',
        avatarText: 'K'
      };
    } catch {
      return { name: 'Kuro Student', title: 'Year 3 Dental Student', avatarText: 'K' };
    }
  }

  setUserInfo(info) {
    const current = this.getUserInfo();
    const updated = { ...current, ...info };
    localStorage.setItem(this.STORAGE_KEYS.USER_INFO, JSON.stringify(updated));
    this.notify('user_updated', updated);
  }

  // ==========================================================================
  // FAVORITES
  // ==========================================================================
  getFavorites() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.FAVORITES)) || [];
    } catch {
      return [];
    }
  }

  toggleFavorite(item) {
    let favorites = this.getFavorites();
    const idx = favorites.findIndex(f => f.id === item.id);
    if (idx >= 0) {
      favorites.splice(idx, 1);
    } else {
      favorites.push(item);
    }
    localStorage.setItem(this.STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    this.notify('favorites_changed', favorites);
    return idx < 0;
  }

  isFavorite(id) {
    return this.getFavorites().some(f => f.id === id);
  }

  // ==========================================================================
  // GPA / CALCULATOR DATA
  // ==========================================================================
  getCalculatorData() {
    try {
      return JSON.parse(localStorage.getItem('kf_calc_data')) || null;
    } catch {
      return null;
    }
  }

  saveCalculatorData(data) {
    localStorage.setItem('kf_calc_data', JSON.stringify(data));
    this.notify('calc_saved', data);
  }

  // ==========================================================================
  // OFFICIAL CHARACTER THEME SYSTEM INTEGRATION
  // ==========================================================================
  getCharacterThemes() {
    if (window.CharacterThemeSystem) {
      return window.CharacterThemeSystem.getAllThemes();
    }
    return [{
      id: 'kuro',
      name_en: 'Kuro',
      name_ar: 'كورو',
      image: 'assets/characters/kuro/Kuro-Idle.png',
      theme_colors: ['#C84343', '#1E1F2B', '#FAF8F5', '#F59E0B']
    }];
  }

  getCharacterById(id) {
    if (window.CharacterThemeSystem) {
      return window.CharacterThemeSystem.getTheme(id);
    }
    return this.getCharacterThemes()[0];
  }

  getEquippedCharacter() {
    return localStorage.getItem(this.STORAGE_KEYS.EQUIPPED_CHARACTER) || 'kuro';
  }

  getEquippedCharacterData() {
    const id = this.getEquippedCharacter();
    const charData = this.getCharacterById(id);
    return {
      ...charData,
      image: charData?.assets?.idle || 'assets/characters/kuro/Kuro-Idle.png'
    };
  }

  equipCharacter(characterId) {
    const character = this.getCharacterById(characterId);
    if (!character) return false;

    localStorage.setItem(this.STORAGE_KEYS.EQUIPPED_CHARACTER, characterId);
    localStorage.setItem(this.STORAGE_KEYS.EQUIPPED_SKIN, characterId);

    if (typeof window.updateGlobalMascotAvatars === 'function') {
      window.updateGlobalMascotAvatars();
    }

    this.notify('character_equipped', character);
    this.notify('skin_equipped', character);
    return true;
  }

  // ==========================================================================
  // BACKWARDS COMPATIBILITY BRIDGE (For pages calling getFoxSkins, getSkinById)
  // ==========================================================================
  getFoxSkins() {
    return this.getCharacterThemes().map(c => ({
      ...c,
      image: c.assets ? c.assets.idle : 'assets/characters/kuro/Kuro-Idle.png'
    }));
  }

  getSkinById(id) {
    const charData = this.getCharacterById(id);
    if (!charData) return this.getFoxSkins()[0];
    return {
      ...charData,
      image: charData.assets ? charData.assets.idle : 'assets/characters/kuro/Kuro-Idle.png'
    };
  }

  getOwnedSkins() {
    try {
      const owned = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.OWNED_CHARACTERS)) || ['kuro'];
      if (!owned.includes('kuro')) owned.unshift('kuro');
      return owned;
    } catch {
      return ['kuro'];
    }
  }

  isSkinOwned(id) {
    if (id === 'kuro') return true;
    return this.getOwnedSkins().includes(id);
  }

  getEquippedSkin() {
    return this.getEquippedCharacter();
  }

  getEquippedSkinData() {
    return this.getEquippedCharacterData();
  }

  equipSkin(skinId) {
    return this.equipCharacter(skinId);
  }

  unlockSkin(skinId) {
    return { success: true, alreadyOwned: true, skin: this.getSkinById(skinId) };
  }
}

window.STORE = new AppStore();
