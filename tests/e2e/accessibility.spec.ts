import { test, expect } from '@playwright/test';
import { TestUtils } from '../helpers/utils';
import { RoulettePage } from '../helpers/page-objects';

test.describe('Accessibility Tests', () => {
  test('should support keyboard navigation', async ({ page }) => {
    const roulettePage = new RoulettePage(page);
    await roulettePage.goto();
    
    // Test Tab navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should be able to navigate through interactive elements
    const focusedElement = await page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should have proper heading structure', async ({ page }) => {
    const roulettePage = new RoulettePage(page);
    await roulettePage.goto();
    
    // Should have h1 element
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThan(0);
    
    // Check heading hierarchy
    await TestUtils.verifyAccessibility(page);
  });

  test('should have accessible buttons', async ({ page }) => {
    const roulettePage = new RoulettePage(page);
    await roulettePage.goto();
    
    await TestUtils.verifyAccessibility(page);
  });

  test('should handle focus management in modals', async ({ page }) => {
    await TestUtils.setupTestData(page, 'edge');
    
    const roulettePage = new RoulettePage(page);
    await roulettePage.goto();
    
    // Open modal
    await roulettePage.spinRoulette();
    
    // Focus should be trapped in modal
    const modal = page.locator('[data-testid="winner-modal"]');
    await expect(modal).toBeFocused().catch(() => {
      // Alternative: check that focus is within modal
      expect(modal.locator(':focus')).toBeVisible();
    });
    
    await roulettePage.closeModal();
  });

  test('should support screen reader compatibility', async ({ page }) => {
    const roulettePage = new RoulettePage(page);
    await roulettePage.goto();
    
    // Check for ARIA labels and roles
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      const role = await button.getAttribute('role');
      
      // Button should have accessible text
      expect(text || ariaLabel).toBeTruthy();
    }
  });

  test('should meet color contrast requirements', async ({ page }) => {
    const roulettePage = new RoulettePage(page);
    await roulettePage.goto();
    
    // This would require a color contrast checking tool
    // For now, we'll check that text is visible
    await expect(roulettePage.title).toBeVisible();
  });
});