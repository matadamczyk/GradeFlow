import { expect, test } from '@playwright/test';

test.describe('GradeFlow Application', () => {
  test.beforeEach(async ({ page }) => {
    // Przejdź do strony głównej przed każdym testem
    await page.goto('/');
  });

  test('powinien załadować stronę główną', async ({ page }) => {
    // Sprawdź czy strona się załadowała
    await expect(page).toHaveURL(/.*localhost:4200/);
    
    // Sprawdź czy tytuł strony jest prawidłowy
    await expect(page).toHaveTitle(/GradeFlow/);
  });

  test('powinien wyświetlać główne elementy interfejsu', async ({ page }) => {
    // Sprawdź czy główny nagłówek jest widoczny
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    
    // Możesz dodać więcej sprawdzeń dla konkretnych elementów twojej aplikacji
    // await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
    // await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
  });

  test('powinien reagować na interakcje użytkownika', async ({ page }) => {
    // Przykład kliknięcia w przycisk (dostosuj do swojej aplikacji)
    // await page.click('[data-testid="login-button"]');
    // await expect(page).toHaveURL(/.*login/);
    
    // Na razie sprawdźmy czy można przewijać stronę
    await page.evaluate(() => window.scrollTo(0, 100));
    const scrollPosition = await page.evaluate(() => window.pageYOffset);
    expect(scrollPosition).toBeGreaterThan(0);
  });
});
