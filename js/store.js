/**
 * KURO FANGS — LocalStorage Store
 * Persists student-specific state: favorites, saved, notes, points, badges
 */

const STORE_KEY = 'kf_student';

const DEFAULT_STATE = {
  user: {
    name: 'طالب كورو 🐱',
    title: 'طبيب/ة أسنان المستقبل — سنة ثالثة',
    group: 'مجموعة A'
  },
  favorites: [],             // array of sheet IDs
  saved: [],                 // array of sheet IDs
  notes: {},                 // { sheetId: "note text" }
  points: 25,
  earned_badges: ['b001'],   // array of badge IDs
  last_seen: {},             // { subjectId: timestamp }
  theme: 'default',
  onboarded: true,
  requirements: {},          // { reqKey: count }
  calculator: {},            // { subjectId: { cw, oral, prac, final } }
  quiz_history: []           // array of completed quiz results
};

const KF_STORE = {
  state: null,

  init() {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      try {
        this.state = { ...DEFAULT_STATE, ...JSON.parse(raw) };
      } catch {
        this.state = { ...DEFAULT_STATE };
      }
    } else {
      this.state = { ...DEFAULT_STATE };
    }
  },

  save() {
    localStorage.setItem(STORE_KEY, JSON.stringify(this.state));
  },

  // ── User ──────────────────────────────────────────────────
  isGuest() {
    return !this.state.user;
  },

  setUser(user) {
    this.state.user = user;
    this.save();
  },

  getUser() {
    return this.state.user;
  },

  // ── Favorites ─────────────────────────────────────────────
  isFavorite(sheetId) {
    return this.state.favorites.includes(sheetId);
  },

  toggleFavorite(sheetId) {
    if (this.isFavorite(sheetId)) {
      this.state.favorites = this.state.favorites.filter(id => id !== sheetId);
      this.save();
      return false;
    } else {
      this.state.favorites.push(sheetId);
      this.save();
      this.addPoints(5);
      return true;
    }
  },

  getFavorites() {
    return this.state.favorites;
  },

  // ── Saved ─────────────────────────────────────────────────
  isSaved(sheetId) {
    return this.state.saved.includes(sheetId);
  },

  toggleSaved(sheetId) {
    if (this.isSaved(sheetId)) {
      this.state.saved = this.state.saved.filter(id => id !== sheetId);
      this.save();
      return false;
    } else {
      this.state.saved.push(sheetId);
      this.save();
      return true;
    }
  },

  getSaved() {
    return this.state.saved;
  },

  // ── Notes ─────────────────────────────────────────────────
  getNote(sheetId) {
    return this.state.notes[sheetId] || '';
  },

  setNote(sheetId, text) {
    if (text.trim()) {
      this.state.notes[sheetId] = text;
    } else {
      delete this.state.notes[sheetId];
    }
    this.save();
  },

  getAllNotes() {
    return this.state.notes;
  },

  // ── Points ────────────────────────────────────────────────
  getPoints() {
    return this.state.points;
  },

  addPoints(amount) {
    this.state.points += amount;
    this.save();
    this._checkBadges();
    window.dispatchEvent(new CustomEvent('kf:points-updated', { detail: this.state.points }));
  },

  // ── Badges ────────────────────────────────────────────────
  earnBadge(badgeId) {
    if (!this.state.earned_badges.includes(badgeId)) {
      this.state.earned_badges.push(badgeId);
      this.save();
      window.dispatchEvent(new CustomEvent('kf:badge-earned', { detail: badgeId }));
    }
  },

  hasBadge(badgeId) {
    return this.state.earned_badges.includes(badgeId);
  },

  getEarnedBadges() {
    return this.state.earned_badges;
  },

  _checkBadges() {
    const p = this.state.points;
    if (p >= 50  && !this.hasBadge('b002')) this.earnBadge('b002');
    if (p >= 100 && !this.hasBadge('b001')) this.earnBadge('b001');
    if (p >= 200 && !this.hasBadge('b006')) this.earnBadge('b006');
  },

  // ── Theme ─────────────────────────────────────────────────
  getTheme() {
    return this.state.theme;
  },

  setTheme(theme) {
    this.state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme === 'default' ? '' : theme);
    this.save();
  },

  applyTheme() {
    const theme = this.state.theme;
    if (theme && theme !== 'default') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  },

  // ── Onboarding ────────────────────────────────────────────
  isOnboarded() {
    return this.state.onboarded;
  },

  setOnboarded() {
    this.state.onboarded = true;
    this.save();
  },

  // ── Lab Requirements ──────────────────────────────────────
  getRequirement(reqId) {
    if (!this.state.requirements) this.state.requirements = {};
    return this.state.requirements[reqId] || 0;
  },

  setRequirement(reqId, count) {
    if (!this.state.requirements) this.state.requirements = {};
    this.state.requirements[reqId] = Math.max(0, count);
    this.save();
    return this.state.requirements[reqId];
  },

  incrementRequirement(reqId, target = 999) {
    const current = this.getRequirement(reqId);
    if (current < target) {
      const updated = this.setRequirement(reqId, current + 1);
      this.addPoints(2);
      return updated;
    }
    return current;
  },

  decrementRequirement(reqId) {
    const current = this.getRequirement(reqId);
    if (current > 0) {
      return this.setRequirement(reqId, current - 1);
    }
    return 0;
  },

  // ── Calculator Grades ─────────────────────────────────────
  getCalculatorData() {
    return this.state.calculator || {};
  },

  setSubjectGrades(subjectId, grades) {
    if (!this.state.calculator) this.state.calculator = {};
    this.state.calculator[subjectId] = grades;
    this.save();
  },

  // ── Quiz History ──────────────────────────────────────────
  getQuizHistory() {
    return this.state.quiz_history || [];
  },

  recordQuiz(record) {
    if (!this.state.quiz_history) this.state.quiz_history = [];
    this.state.quiz_history.unshift({
      id: 'quiz_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      ...record
    });
    // Add points based on score
    const pts = Math.round((record.score / record.total) * 20);
    if (pts > 0) this.addPoints(pts);
    this.save();
  },

  // ── Backup & Restore ──────────────────────────────────────
  exportBackup() {
    return JSON.stringify(this.state, null, 2);
  },

  importBackup(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object') {
        this.state = { ...DEFAULT_STATE, ...parsed };
        this.save();
        this.applyTheme();
        return true;
      }
    } catch (e) {
      console.error('Failed to import backup', e);
    }
    return false;
  }
};

export default KF_STORE;
