import { chromium } from 'playwright';

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();

// Log console messages
p.on('console', msg => console.log('BROWSER:', msg.text()));
p.on('requestfailed', req => console.log('FAILED:', req.url()));

await p.goto('http://localhost:5173', { waitUntil: 'networkidle' });
await p.waitForTimeout(8500); // past splash

// Click menu
await p.locator('button').first().click();
await p.waitForTimeout(4000);

// Dump visible text
const text = await p.evaluate(() => document.body.innerText.slice(0, 500));
console.log('Page text:', text);

const btns = await p.locator('button').allTextContents();
console.log('Buttons:', btns.slice(0, 20));

await p.screenshot({ path: '/home/user/qureen/screens/debug.png' });
await browser.close();
