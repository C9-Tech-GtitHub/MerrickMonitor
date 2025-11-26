import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Go to GitHub Pages
  await page.goto('https://c9-tech-gtithub.github.io/MerrickMonitor/');
  await page.waitForTimeout(2000);
  
  // Enter password
  await page.fill('input[type="password"]', 'peek');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1500);
  
  // Find WED in Weekly Log sidebar
  const wedElements = await page.locator('.lg\\:col-span-4 >> text=WED').first();
  const wedContainer = wedElements.locator('xpath=ancestor::div[contains(@class, "flex gap-4")]').first();
  const wedHTML = await wedContainer.innerHTML();
  
  console.log('=== GITHUB PAGES - WED Weekly Log HTML ===');
  console.log(wedHTML);
  console.log('\n');
  
  // Count occurrences
  const merrickCount = (wedHTML.match(/Merrick Monitor/g) || []).length;
  const hasMorning = wedHTML.includes('Morning') || wedHTML.includes('MORNING');
  const hasAfternoon = wedHTML.includes('Afternoon') || wedHTML.includes('AFTERNOON');
  
  console.log(`Merrick Monitor appears: ${merrickCount} times`);
  console.log(`Has Morning label: ${hasMorning}`);
  console.log(`Has Afternoon label: ${hasAfternoon}`);
  
  await browser.close();
})();
