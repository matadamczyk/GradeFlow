import { Page, expect } from '@playwright/test';
 export async function waitForPageLoad(page: Page, timeout = 10000) {
  await page.waitForLoadState('networkidle', { timeout });
  
 
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
 
  const response = await page.waitForResponse(response => 
    response.url().includes(page.url()) && response.status() === 200,
    { timeout }
  ).catch(() => null);
  
  if (!response) {
    console.warn('Nie udało się otrzymać odpowiedzi 200 dla strony');
  }
}
 export async function loginAsUser(page: Page, email: string, password: string) {
 
  await page.goto('/login');
  
  await page.fill('[data-testid="email"], input[type="email"]', email);
  await page.fill('[data-testid="password"], input[type="password"]', password);
  await page.click('[data-testid="login-submit"], button[type="submit"]');
  
 
  await page.waitForURL(/.*dashboard|.*home/, { timeout: 10000 });
}
 export async function logout(page: Page) {
  const logoutButton = page.locator('[data-testid="logout"], .logout-button, button:has-text("Wyloguj")');
  
  if (await logoutButton.isVisible()) {
    await logoutButton.click();
    await page.waitForURL(/.*login|.*$/, { timeout: 5000 });
  }
}
 export async function testResponsiveness(page: Page, selector: string) {
  const viewports = [
    { width: 1920, height: 1080, name: 'Desktop' },
    { width: 768, height: 1024, name: 'Tablet' },
    { width: 375, height: 667, name: 'Mobile' },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    
    const element = page.locator(selector);
    await expect(element).toBeVisible();
    
    console.log(`Element ${selector} jest widoczny na ${viewport.name}`);
  }
}
 export async function waitForImages(page: Page) {
  await page.waitForFunction(() => {
    const images = Array.from(document.querySelectorAll('img'));
    return images.every(img => img.complete || img.naturalHeight !== 0);
  });
}
 export async function isElementInViewport(page: Page, selector: string): Promise<boolean> {
  return await page.locator(selector).evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  });
}
 export async function scrollToElement(page: Page, selector: string) {
  const element = page.locator(selector);
  await element.scrollIntoViewIfNeeded();
  await expect(element).toBeVisible();
}
 export async function checkAccessibility(page: Page) {
 
  const imagesWithoutAlt = await page.locator('img:not([alt])').count();
  expect(imagesWithoutAlt).toBe(0);
  
 
  const buttons = await page.locator('button, a, input, select, textarea').all();
  for (const button of buttons) {
    const tabIndex = await button.getAttribute('tabindex');
    if (tabIndex !== '-1') {
 
      await button.focus();
    }
  }
}
 export async function simulateNetworkConditions(page: Page, condition: 'slow3G' | 'fast3G' | 'offline') {
  const conditions = {
    slow3G: { downloadThroughput: 500 * 1024 / 8, uploadThroughput: 500 * 1024 / 8, latency: 400 },
    fast3G: { downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8, latency: 150 },
    offline: { offline: true }
  };
  
  const context = page.context();
  
  if (condition === 'offline') {
    await context.setOffline(true);
  } else {
    await context.setOffline(false);
 
    if (context.setExtraHTTPHeaders) {
      await page.route('**/*', route => {
        setTimeout(() => route.continue(), conditions[condition].latency);
      });
    }
  }
}
 export async function expectTextContent(page: Page, selector: string, expectedText: string) {
  const element = page.locator(selector);
  await expect(element).toHaveText(expectedText, { ignoreCase: true });
}
 export async function takeScreenshot(page: Page, name: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({ 
    path: `screenshots/${name}-${timestamp}.png`,
    fullPage: true 
  });
}
 export const formHelpers = {
   async fillForm(page: Page, formData: Record<string, string>) {
    for (const [field, value] of Object.entries(formData)) {
      await page.fill(`[data-testid="${field}"], [name="${field}"], #${field}`, value);
    }
  },
   async checkRequiredFields(page: Page) {
    const requiredFields = page.locator('input[required], select[required], textarea[required]');
    const count = await requiredFields.count();
    
    for (let i = 0; i < count; i++) {
      const field = requiredFields.nth(i);
      const value = await field.inputValue();
      expect(value.length).toBeGreaterThan(0);
    }
  },
   async checkValidationErrors(page: Page, expectedErrors: string[]) {
    for (const error of expectedErrors) {
      const errorElement = page.locator(`.error:has-text("${error}"), .validation-error:has-text("${error}")`);
      await expect(errorElement).toBeVisible();
    }
  }
}; 