/**
 * KURO FANGS — AUDIO & VISUAL QUESTION FEEDBACK VERIFICATION SUITE
 * Tests procedural audio synthesis, quick mute, visual animations,
 * mascot reactions, staged explanation reveals, and quiz completion dialog.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

let totalChecks = 0;
let passedChecks = 0;

function assert(condition, message) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✓ ${message}`);
  } else {
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('\n==============================================================================');
console.log('KURO FANGS — AUDIO & VISUAL QUESTION INTERACTION VERIFICATION');
console.log('==============================================================================\n');

// ── 1. SOUND MANAGER ENGINE (js/audio-fx.js) ──
console.log('── 1. CENTRALIZED SOUND MANAGER ENGINE ──');
const audioJs = fs.readFileSync(path.join(ROOT, 'js', 'audio-fx.js'), 'utf8');

assert(audioJs.includes('window.SoundManager = SoundFX'), 'Exposes window.SoundManager global API');
assert(audioJs.includes('window.soundManager = SoundFX'), 'Exposes lowercase window.soundManager alias');
assert(audioJs.includes("SoundSynthesizers.wrong = SoundSynthesizers.incorrect"), 'Synthesizer alias "wrong" mapped to harmonic incorrect tone');
assert(audioJs.includes("SoundSynthesizers.complete = SoundSynthesizers.victory"), 'Synthesizer alias "complete" mapped to victory fanfare');
assert(audioJs.includes("isQuestionSoundEnabled()"), 'Provides isQuestionSoundEnabled() query helper');
assert(audioJs.includes("setQuestionSoundEnabled("), 'Provides setQuestionSoundEnabled(bool) setter');
assert(audioJs.includes("toggleQuestionSound()"), 'Provides toggleQuestionSound() toggle helper');
assert(audioJs.includes("getVolumeLevel()"), 'Provides getVolumeLevel() level getter');
assert(audioJs.includes("setVolumeLevel("), 'Provides setVolumeLevel(lvl) level setter');
assert(audioJs.includes("kf_sound_volume"), 'Persists volume level in localStorage under kf_sound_volume');
assert(audioJs.includes("kf_question_sounds_enabled"), 'Persists question sounds in localStorage under kf_question_sounds_enabled');
assert(audioJs.includes("'kf:sound-changed'"), 'Dispatches "kf:sound-changed" event on audio state changes');
assert(audioJs.includes("const isQuestionSound = ['correct', 'wrong', 'incorrect', 'complete', 'victory'].includes(type)"), 'Question sounds respects questionSoundEnabled state');

// ── 2. QUIZ RUNNER INTERACTION (js/pages/questions.js) ──
console.log('\n── 2. QUIZ RUNNER AUDIO & VISUAL FEEDBACK ──');
const questionsJs = fs.readFileSync(path.join(ROOT, 'js', 'pages', 'questions.js'), 'utf8');

assert(questionsJs.includes('id="dt-btn-sound"'), 'Quiz modal header contains quick mute button #dt-btn-sound');
assert(questionsJs.includes("window.SoundManager.play(isCorrect ? 'correct' : 'wrong')"), 'Triggers SoundManager on option selection');
assert(questionsJs.includes('dt-anim-pop-check'), 'Renders animated check icon on correct option');
assert(questionsJs.includes('dt-anim-pop-wrong'), 'Renders animated cross icon on incorrect option');
assert(questionsJs.includes("b.classList.add('incorrect', 'shake-wrong')"), 'Applies gentle shake-wrong class to selected wrong option only');
assert(questionsJs.includes("dt-mascot-happy-bounce"), 'Triggers celebratory mascot bounce on correct answer');
assert(questionsJs.includes("إجابة صحيحة! 🎉"), 'Mascot displays encouraging message on correct answer');
assert(questionsJs.includes("مش صحيحة، حاول تفهم السبب."), 'Mascot displays thoughtful feedback on wrong answer');
assert(questionsJs.includes("cardExpSection.classList.add('staged-reveal')"), 'Applies staged-reveal flow to in-card explanation');
assert(questionsJs.includes("updateSoundButtonUI("), 'Provides updateSoundButtonUI helper method');
assert(questionsJs.includes("showCompletionModal("), 'Provides showCompletionModal helper method');
assert(questionsJs.includes("closeCompletionModal()"), 'Provides closeCompletionModal helper method');

// ── 3. QUIZ COMPLETION MODAL & SUMMARY ──
console.log('\n── 3. QUIZ COMPLETION SUMMARY DIALOG ──');
assert(questionsJs.includes('id="dt-quiz-completion-modal"'), 'Contains dedicated completion modal #dt-quiz-completion-modal');
assert(questionsJs.includes('id="dt-completion-mascot-img"'), 'Completion modal displays celebratory Kuro mascot');
assert(questionsJs.includes('id="dt-comp-correct-count"'), 'Summary displays correct answers count');
assert(questionsJs.includes('id="dt-comp-wrong-count"'), 'Summary displays wrong answers count');
assert(questionsJs.includes('id="dt-comp-score-pct"'), 'Summary displays percentage score');
assert(questionsJs.includes('id="dt-btn-comp-review"'), 'Provides review quiz action button');
assert(questionsJs.includes('id="dt-btn-comp-exit"'), 'Provides finish and exit action button');
assert(questionsJs.includes("window.SoundManager.play('complete')"), 'Plays fanfare audio on quiz completion modal open');

// ── 4. SETTINGS INTEGRATION (js/pages/settings.js) ──
console.log('\n── 4. SETTINGS PAGE CONTROLS ──');
const settingsJs = fs.readFileSync(path.join(ROOT, 'js', 'pages', 'settings.js'), 'utf8');

assert(settingsJs.includes('id="settings-question-sound-switch"'), 'General tab contains question sound switch #settings-question-sound-switch');
assert(settingsJs.includes('id="settings-question-sound-switch-tab"'), 'Audio tab contains question sound switch #settings-question-sound-switch-tab');
assert(settingsJs.includes('id="settings-sound-volume-select"'), 'Audio tab contains volume selector #settings-sound-volume-select');
assert(settingsJs.includes('window.SoundManager.toggleQuestionSound()'), 'Wires question sound switch to SoundManager.toggleQuestionSound()');
assert(settingsJs.includes('window.SoundManager.setVolumeLevel(e.target.value)'), 'Wires volume select to SoundManager.setVolumeLevel()');

// ── 5. CSS POLISH & ANIMATIONS (css/polish.css) ──
console.log('\n── 5. CSS DESIGN TOKENS & KEYFRAME ANIMATIONS ──');
const polishCss = fs.readFileSync(path.join(ROOT, 'css', 'polish.css'), 'utf8');

assert(polishCss.includes('@keyframes dtPopCheck'), 'Defines pop check spring keyframe animation');
assert(polishCss.includes('@keyframes dtPopWrong'), 'Defines pop wrong spring keyframe animation');
assert(polishCss.includes('@keyframes dtCorrectSoftPulse'), 'Defines correct answer soft glow pulse animation');
assert(polishCss.includes('@keyframes shakeWrong'), 'Defines option shake animation');
assert(polishCss.includes('@keyframes dtMascotBounce'), 'Defines mascot celebratory bounce animation');
assert(polishCss.includes('.dt-card-exp-section.staged-reveal'), 'Defines staged explanation reveal transitions');
assert(polishCss.includes('.dt-completion-card'), 'Defines luxury completion card styles');
assert(polishCss.includes('#dt-btn-sound.active-muted'), 'Defines muted state styling for header sound button');

console.log('\n==============================================================================');
console.log(`RESULT: ${passedChecks}/${totalChecks} CHECKS PASSED (${Math.round((passedChecks / totalChecks) * 100)}%)`);
console.log('==============================================================================\n');

if (passedChecks !== totalChecks) {
  process.exit(1);
}
