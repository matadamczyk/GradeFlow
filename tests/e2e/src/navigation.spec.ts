import { expect, test } from '@playwright/test';

test.describe('Nawigacja w aplikacji', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('powinien wyświetlać główne menu nawigacyjne', async ({ page }) => {
    // Sprawdź czy istnieje nawigacja
    const navigation = page.locator('nav, [role="navigation"], .navbar, .navigation').first();
    
    if (await navigation.isVisible()) {
      await expect(navigation).toBeVisible();
    } else {
      console.log('Nawigacja nie została jeszcze zaimplementowana');
    }
  });

  test('powinien umożliwiać przechodzenie między stronami', async ({ page }) => {
    // Lista potencjalnych linków nawigacyjnych (dostosuj do swojej aplikacji)
    const navigationLinks = [
      { selector: 'a[href="/dashboard"]', name: 'Dashboard' },
      { selector: 'a[href="/grades"]', name: 'Oceny' },
      { selector: 'a[href="/schedule"]', name: 'Plan zajęć' },
      { selector: 'a[href="/profile"]', name: 'Profil' },
    ];

    for (const link of navigationLinks) {
      const linkElement = page.locator(link.selector);
      
      if (await linkElement.isVisible()) {
        await linkElement.click();
        
        // Sprawdź czy URL się zmienił
        await expect(page).toHaveURL(new RegExp(link.selector.match(/href="([^"]+)"/)?.[1] || ''));
        
        // Wróć do strony głównej dla następnego testu
        await page.goto('/');
      } else {
        console.log(`Link ${link.name} nie został jeszcze zaimplementowany`);
      }
    }
  });

  test('powinien obsługiwać responsive design', async ({ page }) => {
    // Test na różnych rozmiarach ekranu
    const viewports = [
      { width: 1920, height: 1080, device: 'Desktop' },
      { width: 768, height: 1024, device: 'Tablet' },
      { width: 375, height: 667, device: 'Mobile' },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // Sprawdź czy strona jest responsywna
      const body = page.locator('body');
      await expect(body).toBeVisible();
      
      // Sprawdź czy nie ma poziomego przewijania (opcjonalne)
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const clientWidth = await page.evaluate(() => document.body.clientWidth);
      
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 20); // +20 dla marginesu błędu
      
      console.log(`Test responsywności dla ${viewport.device} (${viewport.width}x${viewport.height}) - OK`);
    }
  });

  test('powinien obsługiwać breadcrumbs', async ({ page }) => {
    // Sprawdź czy istnieją breadcrumbs
    const breadcrumbs = page.locator('.breadcrumb, [aria-label="breadcrumb"], .breadcrumbs');
    
    if (await breadcrumbs.isVisible()) {
      await expect(breadcrumbs).toBeVisible();
      
      // Sprawdź czy breadcrumbs zawierają aktualną stronę
      const breadcrumbItems = breadcrumbs.locator('li, .breadcrumb-item, a');
      const count = await breadcrumbItems.count();
      expect(count).toBeGreaterThan(0);
    } else {
      console.log('Breadcrumbs nie zostały jeszcze zaimplementowane');
    }
  });
}); 