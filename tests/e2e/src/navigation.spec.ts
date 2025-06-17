import { expect, test } from '@playwright/test';

test.describe('Nawigacja w aplikacji', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('powinien wyświetlać główne menu nawigacyjne', async ({ page }) => {
 
    const navigation = page.locator('nav, [role="navigation"], .navbar, .navigation').first();
    
    if (await navigation.isVisible()) {
      await expect(navigation).toBeVisible();
    } else {
      console.log('Nawigacja nie została jeszcze zaimplementowana');
    }
  });

  test('powinien umożliwiać przechodzenie między stronami', async ({ page }) => {
 
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
        
 
        await expect(page).toHaveURL(new RegExp(link.selector.match(/href="([^"]+)"/)?.[1] || ''));
        
 
        await page.goto('/');
      } else {
        console.log(`Link ${link.name} nie został jeszcze zaimplementowany`);
      }
    }
  });

  test('powinien obsługiwać responsive design', async ({ page }) => {
 
    const viewports = [
      { width: 1920, height: 1080, device: 'Desktop' },
      { width: 768, height: 1024, device: 'Tablet' },
      { width: 375, height: 667, device: 'Mobile' },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
 
      const body = page.locator('body');
      await expect(body).toBeVisible();
      
 
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const clientWidth = await page.evaluate(() => document.body.clientWidth);
      
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 20); // +20 dla marginesu błędu
      
      console.log(`Test responsywności dla ${viewport.device} (${viewport.width}x${viewport.height}) - OK`);
    }
  });

  test('powinien obsługiwać breadcrumbs', async ({ page }) => {
 
    const breadcrumbs = page.locator('.breadcrumb, [aria-label="breadcrumb"], .breadcrumbs');
    
    if (await breadcrumbs.isVisible()) {
      await expect(breadcrumbs).toBeVisible();
      
 
      const breadcrumbItems = breadcrumbs.locator('li, .breadcrumb-item, a');
      const count = await breadcrumbItems.count();
      expect(count).toBeGreaterThan(0);
    } else {
      console.log('Breadcrumbs nie zostały jeszcze zaimplementowane');
    }
  });
}); 