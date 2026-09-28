const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- RUNNING SHEETS & RECORDINGS VERIFICATION SUITE ---');

// 1. Verify data/sheets.json
const sheetsRaw = fs.readFileSync('data/sheets.json', 'utf8');
const sheetsData = JSON.parse(sheetsRaw);
assert(Array.isArray(sheetsData.sheets), 'sheets should be an array');
assert.strictEqual(sheetsData.sheets.length, 9, `Expected exactly 9 sheets, found ${sheetsData.sheets.length}`);

console.log(`✓ data/sheets.json contains ${sheetsData.sheets.length} sheets`);

const sheetIds = new Set();
sheetsData.sheets.forEach((sheet, idx) => {
  assert(sheet.id, `Sheet at index ${idx} missing ID`);
  assert(sheet.subject_id, `Sheet ${sheet.id} missing subject_id`);
  assert(sheet.title, `Sheet ${sheet.id} missing title`);
  assert(sheet.doctor || sheet.doctor_name, `Sheet ${sheet.id} missing doctor`);
  assert(sheet.pages > 0, `Sheet ${sheet.id} pages count must be > 0`);
  assert(sheet.pdf_url, `Sheet ${sheet.id} missing pdf_url`);
  
  // Verify PDF file exists on disk
  const pdfPath = path.resolve(sheet.pdf_url);
  assert(fs.existsSync(pdfPath), `PDF file does not exist on disk: ${sheet.pdf_url}`);
  const stats = fs.statSync(pdfPath);
  assert(stats.size > 1000, `PDF file ${sheet.pdf_url} is too small (${stats.size} bytes)`);

  sheetIds.add(sheet.id);
  console.log(`  ✓ Sheet [${sheet.id}] -> ${sheet.title} (${stats.size} bytes, ${sheet.pages} pages)`);
});

// 2. Verify data/recordings.json
const recsRaw = fs.readFileSync('data/recordings.json', 'utf8');
const recsData = JSON.parse(recsRaw);
assert(Array.isArray(recsData.recordings), 'recordings should be an array');
assert.strictEqual(recsData.recordings.length, 9, `Expected exactly 9 recordings, found ${recsData.recordings.length}`);

console.log(`✓ data/recordings.json contains ${recsData.recordings.length} recordings`);

recsData.recordings.forEach((rec, idx) => {
  assert(rec.id, `Recording at index ${idx} missing ID`);
  assert(rec.sheet_id, `Recording ${rec.id} missing sheet_id`);
  assert(sheetIds.has(rec.sheet_id), `Recording ${rec.id} points to unknown sheet_id: ${rec.sheet_id}`);
  assert(rec.subject_id, `Recording ${rec.id} missing subject_id`);
  assert(rec.title, `Recording ${rec.id} missing title`);
  assert(rec.audio_url || rec.telegram_link, `Recording ${rec.id} missing audio/telegram link`);
  console.log(`  ✓ Recording [${rec.id}] linked to [${rec.sheet_id}] -> ${rec.title} (${rec.telegram_link || rec.audio_url})`);
});

// 3. Verify data/doctors.json
const docsRaw = fs.readFileSync('data/doctors.json', 'utf8');
const docsData = JSON.parse(docsRaw);
assert(Array.isArray(docsData.doctors), 'doctors should be an array');
const requiredDoctors = ['dr-asmaa', 'dr-abduladeem', 'dr-hisham', 'dr-bassma', 'dr-hanan', 'dr-amal', 'dr-aisha-abubaker'];
requiredDoctors.forEach(docId => {
  assert(docsData.doctors.some(d => d.id === docId), `Missing doctor: ${docId}`);
});
console.log('✓ data/doctors.json verified with all academic instructors');

// 4. Verify data/questions.json
const questionsRaw = fs.readFileSync('data/questions.json', 'utf8');
const questionsData = JSON.parse(questionsRaw);
assert(Array.isArray(questionsData.questions), 'questions should be an array');
questionsData.questions.forEach(q => {
  assert(sheetIds.has(q.sheet_id), `Question ${q.id} references invalid sheet_id: ${q.sheet_id}`);
});
console.log(`✓ All ${questionsData.questions.length} questions correctly reference active sheets`);

console.log('\n--- ALL VERIFICATIONS PASSED SUCCESSFULLY! ---');
