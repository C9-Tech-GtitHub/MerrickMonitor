import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    httpCredentials: {
      username: process.env.AUTH_USER || 'admin',
      password: process.env.AUTH_PASS || 'password'
    }
  });

  const page = await context.newPage();

  // Listen for console messages
  page.on('console', msg => console.log('Browser console:', msg.text()));

  // Listen for page errors
  page.on('pageerror', error => console.log('Page error:', error.message));

  try {
    console.log('Navigating to https://merrick-monitor.c9-dev.com...');
    await page.goto('https://merrick-monitor.c9-dev.com', { waitUntil: 'networkidle' });

    console.log('\n=== Page loaded ===');

    // Check if VITE_GOOGLE_CLIENT_ID is in the page
    const clientId = await page.evaluate(() => {
      return window.__VITE_GOOGLE_CLIENT_ID__ || 'Not found in window';
    });
    console.log('Google Client ID in window:', clientId);

    // Check the actual value being passed to GoogleOAuthProvider
    const scriptContent = await page.content();
    const clientIdMatch = scriptContent.match(/916977701492-[a-z0-9]+\.apps\.googleusercontent\.com/);
    console.log('Client ID found in page source:', clientIdMatch ? clientIdMatch[0] : 'NOT FOUND');

    // Look for the Google Login button
    const googleButton = await page.locator('iframe[src*="google"]').count();
    console.log('\nGoogle OAuth iframe count:', googleButton);

    if (googleButton > 0) {
      console.log('✓ Google OAuth button is rendering');
    } else {
      console.log('✗ Google OAuth button NOT found');
    }

    // Check for the GSI logger error
    await page.waitForTimeout(2000);

    console.log('\n=== Test Summary ===');
    if (clientIdMatch) {
      console.log('✓ SUCCESS: Client ID is properly injected into the build');
      console.log('✓ The Google OAuth should now work correctly');
    } else {
      console.log('✗ FAILED: Client ID is still not in the page source');
      console.log('  The deployment may still be in progress. Wait and try again.');
    }

    console.log('\nWaiting 10 seconds for you to inspect...');
    await page.waitForTimeout(10000);

  } catch (error) {
    console.error('Error:', error.message);
  }

  await browser.close();
})();
