import { test, expect } from '@playwright/test';
import { TestUtils } from '../helpers/utils';
import { RoulettePage } from '../helpers/page-objects';

test.describe('Responsive Design Tests', () => {
  const viewports = [
    { width: 1920, height: 1080, name: 'desktop-large' },
    { width: 1366, height: 768, name: 'desktop-standard' },
    { width: 1024, height: 768, name: 'tablet-landscape' },
    { width: 768, height: 1024, name: 'tablet-portrait' },
    { width: 414, height: 896, name: 'mobile-large' },
    { width: 375, height: 667, name: 'mobile-standard' }
  ];

  for (const viewport of viewports) {
    test(`should display correctly on ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      const roulettePage = new RoulettePage(page);
      await roulettePage.goto();
      
      // Verify key elements are visible
      await expect(roulettePage.title).toBeVisible();
      await expect(roulettePage.menuButton).toBeVisible();
      
      // Test responsive layout
      await TestUtils.verifyResponsiveness(page, [viewport]);
    });
  }

  test('should handle ultra-wide displays', async ({ page }) => {
    await page.setViewportSize({ width: 2560, height: 1440 });
    
    const roulettePage = new RoulettePage(page);
    await roulettePage.goto();
    
    await expect(roulettePage.title).toBeVisible();
    // Content should not be stretched beyond reasonable limits
  });

  test('should support touch interactions on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const roulettePage = new RoulettePage(page);
    await roulettePage.goto();
    
    // Test touch interaction with menu button
    await roulettePage.menuButton.tap();
    // Verify panel opened
  });
});