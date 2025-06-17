import { TEST_USERS, enableMockMode, loginAsUser } from './utils/test-helpers';
import { expect, test } from '@playwright/test';

test.describe('Mock Login Tests', () => {
  test.beforeEach(async ({ page }) => {
    await enableMockMode(page);
  });

  test('should login as student with mock credentials', async ({ page }) => {
    await loginAsUser(page, TEST_USERS.STUDENT.email, TEST_USERS.STUDENT.password);
    
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Check if we're on the dashboard - look for dashboard container
    await expect(page.locator('.dashboard-container').first()).toBeVisible({ timeout: 10000 });
    
    // Check if student email is visible as fallback  
    await expect(page.locator('text=student@gradeflow.com')).toBeVisible({ timeout: 10000 });
  });

  test('should login as teacher with mock credentials', async ({ page }) => {
    await loginAsUser(page, TEST_USERS.TEACHER.email, TEST_USERS.TEACHER.password);
    
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Check if we're on the dashboard - look for dashboard container
    await expect(page.locator('.dashboard-container').first()).toBeVisible({ timeout: 10000 });
    
    // Check if teacher email is visible 
    await expect(page.locator('text=teacher@gradeflow.com')).toBeVisible({ timeout: 10000 });
  });

  test('should reject login with wrong password', async ({ page }) => {
    await page.goto('/');
    await enableMockMode(page);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Open login dialog
    const loginButton = page.locator('button:has-text("Zaloguj się"), button:has-text("Sprawdź demo"), .p-button:has-text("Zaloguj się"), .p-button:has-text("Sprawdź demo")');
    await loginButton.first().click();
    
    // Wait for dialog to appear and form to be ready
    await page.waitForSelector('app-sign-in', { timeout: 10000 });
    await page.waitForSelector('#email', { timeout: 10000 });
    
    // Fill form with wrong password
    await page.fill('#email', TEST_USERS.STUDENT.email);
    await page.fill('#password', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Wait for error message
    await expect(page.locator('p-message[severity="error"], .p-message-error').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Nieprawidłowy email lub hasło')).toBeVisible({ timeout: 5000 });
  });

  test('should reject login with non-existent user', async ({ page }) => {
    await page.goto('/');
    await enableMockMode(page);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Open login dialog
    const loginButton = page.locator('button:has-text("Zaloguj się"), button:has-text("Sprawdź demo"), .p-button:has-text("Zaloguj się"), .p-button:has-text("Sprawdź demo")');
    await loginButton.first().click();
    
    // Wait for dialog to appear and form to be ready
    await page.waitForSelector('app-sign-in', { timeout: 10000 });
    await page.waitForSelector('#email', { timeout: 10000 });
    
    // Fill form with non-existent user
    await page.fill('#email', 'nonexistent@gradeflow.com');
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');
    
    // Wait for error message
    await expect(page.locator('p-message[severity="error"], .p-message-error').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Nieprawidłowy email lub hasło')).toBeVisible({ timeout: 5000 });
  });
}); 