import { expect, test } from '@playwright/test';

test.describe('GradeFlow Application', () => {
  test.beforeEach(async ({ page }) => {
 
    await page.goto('/');
  });

  test('powinien załadować stronę główną', async ({ page }) => {
 
    await expect(page).toHaveURL(/.*localhost:4200/);
    
 
    await expect(page).toHaveTitle(/GradeFlow/);
  });

  test('powinien wyświetlać główne elementy interfejsu', async ({ page }) => {
 
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    
 
    // await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
    // await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
  });

  test('powinien reagować na interakcje użytkownika', async ({ page }) => {
 
    // await page.click('[data-testid="login-button"]');
    // await expect(page).toHaveURL(/.*login/);
    
    await page.evaluate(() => window.scrollTo(0, 100));
    const scrollPosition = await page.evaluate(() => window.pageYOffset);
    expect(scrollPosition).toBeGreaterThan(0);
  });
});
