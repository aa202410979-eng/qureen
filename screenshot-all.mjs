import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = 'http://localhost:5173';
const OUT  = '/home/user/qureen/screens';
mkdirSync(OUT, { recursive: true });

// Mock surah list
const SURAHS = Array.from({ length: 114 }, (_, i) => {
  const names = ['الفاتحة','البقرة','آل عمران','النساء','المائدة','الأنعام','الأعراف','الأنفال','التوبة','يونس','هود','يوسف','الرعد','إبراهيم','الحجر','النحل','الإسراء','الكهف','مريم','طه','الأنبياء','الحج','المؤمنون','النور','الفرقان','الشعراء','النمل','القصص','العنكبوت','الروم','لقمان','السجدة','الأحزاب','سبأ','فاطر','يس','الصافات','ص','الزمر','غافر','فصلت','الشورى','الزخرف','الدخان','الجاثية','الأحقاف','محمد','الفتح','الحجرات','ق','الذاريات','الطور','النجم','القمر','الرحمن','الواقعة','الحديد','المجادلة','الحشر','الممتحنة','الصف','الجمعة','المنافقون','التغابن','الطلاق','التحريم','الملك','القلم','الحاقة','المعارج','نوح','الجن','المزمل','المدثر','القيامة','الإنسان','المرسلات','النبأ','النازعات','عبس','التكوير','الانفطار','المطففين','الانشقاق','البروج','الطارق','الأعلى','الغاشية','الفجر','البلد','الشمس','الليل','الضحى','الشرح','التين','العلق','القدر','البينة','الزلزلة','العاديات','القارعة','التكاثر','العصر','الهمزة','الفيل','قريش','الماعون','الكوثر','الكافرون','النصر','المسد','الإخلاص','الفلق','الناس'];
  const ayahs = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,15,16,26,20,15,8,29,24,13,7,19,18,12,11,12,12,5,4,5,6,3,3,5,4,5,6,2,3,4,5,3,4,5,4,5,7,4,3,6,3,5,4,3,3,2,2,6,6,5];
  const n = i + 1;
  return { number: n, name: names[i] || `سورة ${n}`, englishName: `Surah ${n}`, numberOfAyahs: ayahs[i] || 10, revelationType: n <= 86 ? 'Meccan' : 'Medinan' };
});

// Mock ayahs for Al-Fatiha
const FATIHA_AYAHS = [
  { number: 1, numberInSurah: 1, text: 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ' },
  { number: 2, numberInSurah: 2, text: 'ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ' },
  { number: 3, numberInSurah: 3, text: 'ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ' },
  { number: 4, numberInSurah: 4, text: 'مَٰلِكِ يَوۡمِ ٱلدِّينِ' },
  { number: 5, numberInSurah: 5, text: 'إِيَّاكَ نَعۡبُدُ وَإِيَّاكَ نَسۡتَعِينُ' },
  { number: 6, numberInSurah: 6, text: 'ٱهۡدِنَا ٱلصِّرَٰطَ ٱلۡمُسۡتَقِيمَ' },
  { number: 7, numberInSurah: 7, text: 'صِرَٰطَ ٱلَّذِينَ أَنۡعَمۡتَ عَلَيۡهِمۡ غَيۡرِ ٱلۡمَغۡضُوبِ عَلَيۡهِمۡ وَلَا ٱلضَّآلِّينَ' },
];

// Mock Al-Kahf snippet
const KAHF_AYAHS = Array.from({ length: 20 }, (_, i) => ({
  number: i + 1, numberInSurah: i + 1,
  text: ['ٱلۡحَمۡدُ لِلَّهِ ٱلَّذِيٓ أَنزَلَ عَلَىٰ عَبۡدِهِ ٱلۡكِتَٰبَ وَلَمۡ يَجۡعَل لَّهُۥ عِوَجًا','قَيِّمًا لِّيُنذِرَ بَأۡسًا شَدِيدًا مِّن لَّدُنۡهُ وَيُبَشِّرَ ٱلۡمُؤۡمِنِينَ','ٱلَّذِينَ يَعۡمَلُونَ ٱلصَّٰلِحَٰتِ أَنَّ لَهُمۡ أَجۡرًا حَسَنًا','مَّٰكِثِينَ فِيهِ أَبَدًا','وَيُنذِرَ ٱلَّذِينَ قَالُواْ ٱتَّخَذَ ٱللَّهُ وَلَدًا','مَّا لَهُم بِهِۦ مِنۡ عِلۡمٍ وَلَا لِأٓبَآئِهِمۡ','كَبُرَتۡ كَلِمَةً تَخۡرُجُ مِنۡ أَفۡوَٰهِهِمۡ إِن يَقُولُونَ إِلَّا كَذِبًا','فَلَعَلَّكَ بَٰخِعٌ نَّفۡسَكَ عَلَىٰٓ ءَاثَٰرِهِمۡ إِن لَّمۡ يُؤۡمِنُواْ بِهَٰذَا ٱلۡحَدِيثِ أَسَفًا','إِنَّا جَعَلۡنَا مَا عَلَى ٱلۡأَرۡضِ زِينَةً لَّهَا لِنَبۡلُوَهُمۡ أَيُّهُمۡ أَحۡسَنُ عَمَلًا','وَإِنَّا لَجَٰعِلُونَ مَا عَلَيۡهَا صَعِيدًا جُرُزًا'][i % 10],
}));

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();

// Intercept API calls
await p.route('**/api.alquran.cloud/v1/surah', r => r.fulfill({
  contentType: 'application/json',
  body: JSON.stringify({ code: 200, status: 'OK', data: SURAHS }),
}));
await p.route('**/api.alquran.cloud/v1/surah/1/**', r => r.fulfill({
  contentType: 'application/json',
  body: JSON.stringify({ code: 200, data: { ...SURAHS[0], ayahs: FATIHA_AYAHS, revelationType: 'Meccan' } }),
}));
await p.route('**/api.alquran.cloud/v1/surah/18/**', r => r.fulfill({
  contentType: 'application/json',
  body: JSON.stringify({ code: 200, data: { ...SURAHS[17], ayahs: KAHF_AYAHS, revelationType: 'Meccan' } }),
}));
await p.route('**/fonts.googleapis.com/**', r => r.abort());

// ── 1. Splash ─────────────────────────────────────────────
await p.goto(BASE, { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(1500);
await p.screenshot({ path: `${OUT}/01-splash.png` });
console.log('✓ 01-splash');

await p.waitForTimeout(8000);
await p.screenshot({ path: `${OUT}/02-home.png` });
console.log('✓ 02-home');

// ── 3. Surah drawer ───────────────────────────────────────
await p.locator('button.md\\:hidden').first().click({ timeout: 5000 });
await p.waitForTimeout(600);
await p.screenshot({ path: `${OUT}/03-surah-list.png` });
console.log('✓ 03-surah-list');

// ── 4. Al-Fatiha ──────────────────────────────────────────
await p.locator('button').filter({ hasText: 'الفاتحة' }).first().click({ timeout: 5000 });
await p.waitForTimeout(1500);
await p.screenshot({ path: `${OUT}/04-fatiha.png` });
console.log('✓ 04-fatiha');

// ── 5. Reciter dropdown ───────────────────────────────────
await p.locator('button').filter({ hasText: /مشاري/ }).first().click({ timeout: 5000 });
await p.waitForTimeout(400);
await p.screenshot({ path: `${OUT}/05-reciter.png` });
console.log('✓ 05-reciter');
await p.locator('button').filter({ hasText: /مشاري/ }).first().click({ timeout: 3000 });
await p.waitForTimeout(300);

// ── 6. Al-Kahf ────────────────────────────────────────────
await p.locator('button.md\\:hidden').first().click({ timeout: 5000 });
await p.waitForTimeout(400);
await p.locator('button').filter({ hasText: 'الكهف' }).first().click({ timeout: 5000 });
await p.waitForTimeout(1500);
await p.screenshot({ path: `${OUT}/06-kahf.png` });
console.log('✓ 06-kahf');

// bottom nav
const nav = p.locator('nav').last();

// ── 7. Adhkar ─────────────────────────────────────────────
await nav.locator('button').filter({ hasText: 'الأذكار' }).click({ timeout: 5000 });
await p.waitForTimeout(600);
await p.screenshot({ path: `${OUT}/07-adhkar.png` });
console.log('✓ 07-adhkar');

// ── 8. Morning adhkar ─────────────────────────────────────
const morn = p.locator('text=أذكار الصباح').first();
if (await morn.count() > 0) {
  await morn.click({ timeout: 5000 });
  await p.waitForTimeout(500);
  await p.screenshot({ path: `${OUT}/08-adhkar-detail.png` });
  console.log('✓ 08-adhkar-detail');
}

// ── 9. Duas ───────────────────────────────────────────────
await nav.locator('button').filter({ hasText: 'الأدعية' }).click({ timeout: 5000 });
await p.waitForTimeout(600);
await p.screenshot({ path: `${OUT}/09-duas.png` });
console.log('✓ 09-duas');

// ── 10. Qibla ─────────────────────────────────────────────
await nav.locator('button').filter({ hasText: 'القبلة' }).click({ timeout: 5000 });
await p.waitForTimeout(1000);
await p.screenshot({ path: `${OUT}/10-qibla.png` });
console.log('✓ 10-qibla');

await browser.close();
console.log('\nAll screenshots saved →', OUT);
