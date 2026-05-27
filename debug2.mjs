import { chromium } from 'playwright';

const browser = await chromium.launch({ args: ['--no-sandbox', '--ignore-certificate-errors'] });
const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, ignoreHTTPSErrors: true });
const p = await ctx.newPage();

await p.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(8500); // past splash

// Open drawer
const menuBtn = p.locator('button.md\\:hidden').first();
await menuBtn.click({ timeout: 5000 });
await p.waitForTimeout(5000); // wait for API

// Dump all button texts
const btns = await p.locator('button').allTextContents();
console.log('All buttons:', JSON.stringify(btns.slice(0, 30)));

// Check if surah list loaded
const surahBtns = await p.locator('button[class*="border-b"]').count();
console.log('Border-b buttons:', surahBtns);

// Try to get any visible text in the drawer area
const drawerText = await p.evaluate(() => {
  const el = document.querySelector('[class*="absolute"][class*="inset-0"]');
  return el ? el.innerText.slice(0, 300) : 'no drawer found';
});
console.log('Drawer text:', drawerText);

await p.screenshot({ path: '/home/user/qureen/screens/debug2.png' });
await browser.close();
