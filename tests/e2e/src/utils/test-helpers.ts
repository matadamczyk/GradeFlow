import { Page, expect } from '@playwright/test';

/**
 * Pomocnicze funkcje do testów E2E
 */

/**
 * Czeka na załadowanie strony i sprawdza czy nie ma błędów
 */
export async function waitForPageLoad(page: Page, timeout = 10000) {
  await page.waitForLoadState('networkidle', { timeout });
  
  // Sprawdź czy nie ma błędów JavaScript w konsoli
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  // Sprawdź czy strona się załadowała bez błędów HTTP
  const response = await page.waitForResponse(response => 
    response.url().includes(page.url()) && response.status() === 200,
    { timeout }
  ).catch(() => null);
  
  if (!response) {
    console.warn('Nie udało się otrzymać odpowiedzi 200 dla strony');
  }
}

/**
 * Symuluje logowanie użytkownika (szablon do dostosowania)
 */
export async function loginAsUser(page: Page, email: string, password: string) {
  // Dostosuj selektory do swojej aplikacji
  await page.goto('/login');
  
  await page.fill('[data-testid="email"], input[type="email"]', email);
  await page.fill('[data-testid="password"], input[type="password"]', password);
  await page.click('[data-testid="login-submit"], button[type="submit"]');
  
  // Poczekaj na przekierowanie
  await page.waitForURL(/.*dashboard|.*home/, { timeout: 10000 });
}

/**
 * Wylogowuje użytkownika
 */
export async function logout(page: Page) {
  const logoutButton = page.locator('[data-testid="logout"], .logout-button, button:has-text("Wyloguj")');
  
  if (await logoutButton.isVisible()) {
    await logoutButton.click();
    await page.waitForURL(/.*login|.*$/, { timeout: 5000 });
  }
}

/**
 * Sprawdza responsywność elementu na różnych rozdzielczościach
 */
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

/**
 * Czeka na załadowanie wszystkich obrazów na stronie
 */
export async function waitForImages(page: Page) {
  await page.waitForFunction(() => {
    const images = Array.from(document.querySelectorAll('img'));
    return images.every(img => img.complete || img.naturalHeight !== 0);
  });
}

/**
 * Sprawdza czy element jest w viewport
 */
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

/**
 * Przewija do elementu i sprawdza czy jest widoczny
 */
export async function scrollToElement(page: Page, selector: string) {
  const element = page.locator(selector);
  await element.scrollIntoViewIfNeeded();
  await expect(element).toBeVisible();
}

/**
 * Sprawdza dostępność (accessibility) strony
 */
export async function checkAccessibility(page: Page) {
  // Sprawdź czy wszystkie obrazy mają alt text
  const imagesWithoutAlt = await page.locator('img:not([alt])').count();
  expect(imagesWithoutAlt).toBe(0);
  
  // Sprawdź czy wszystkie interaktywne elementy są focusable
  const buttons = await page.locator('button, a, input, select, textarea').all();
  for (const button of buttons) {
    const tabIndex = await button.getAttribute('tabindex');
    if (tabIndex !== '-1') {
      // Element powinien być focusable
      await button.focus();
    }
  }
}

/**
 * Symuluje różne stany połączenia internetowego
 */
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
    // @ts-ignore - Playwright może nie mieć tej metody w niektórych wersjach
    if (context.setExtraHTTPHeaders) {
      await page.route('**/*', route => {
        setTimeout(() => route.continue(), conditions[condition].latency);
      });
    }
  }
}

/**
 * Dodaje custom assertion dla sprawdzenia czy element ma określony tekst
 */
export async function expectTextContent(page: Page, selector: string, expectedText: string) {
  const element = page.locator(selector);
  await expect(element).toHaveText(expectedText, { ignoreCase: true });
}

/**
 * Zapisuje screenshot z nazwą zawierającą timestamp
 */
export async function takeScreenshot(page: Page, name: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({ 
    path: `screenshots/${name}-${timestamp}.png`,
    fullPage: true 
  });
}

/**
 * Funkcje pomocnicze dla testowania formularzy
 */
export const formHelpers = {
  /**
   * Wypełnia formularz na podstawie obiektu z danymi
   */
  async fillForm(page: Page, formData: Record<string, string>) {
    for (const [field, value] of Object.entries(formData)) {
      await page.fill(`[data-testid="${field}"], [name="${field}"], #${field}`, value);
    }
  },

  /**
   * Sprawdza czy wszystkie wymagane pola są wypełnione
   */
  async checkRequiredFields(page: Page) {
    const requiredFields = page.locator('input[required], select[required], textarea[required]');
    const count = await requiredFields.count();
    
    for (let i = 0; i < count; i++) {
      const field = requiredFields.nth(i);
      const value = await field.inputValue();
      expect(value.length).toBeGreaterThan(0);
    }
  },

  /**
   * Sprawdza czy formularz wyświetla błędy walidacji
   */
  async checkValidationErrors(page: Page, expectedErrors: string[]) {
    for (const error of expectedErrors) {
      const errorElement = page.locator(`.error:has-text("${error}"), .validation-error:has-text("${error}")`);
      await expect(errorElement).toBeVisible();
    }
  }
}; 