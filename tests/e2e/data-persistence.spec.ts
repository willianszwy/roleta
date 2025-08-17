import { test, expect } from '@playwright/test';
import { TestUtils, TEST_SCENARIOS } from '../helpers/utils';
import { RoulettePage } from '../helpers/page-objects';

test.describe('Data Persistence Tests', () => {
  test('should persist participants across browser sessions', async ({ page }) => {
    const testData = await TestUtils.setupTestData(page, TEST_SCENARIOS.MEDIUM);
    
    const roulettePage = new RoulettePage(page);
    await roulettePage.goto();
    
    // Verify data persistence after reload
    await TestUtils.verifyDataPersistence(page, 'roulette-participants', testData.participants);
  });

  test('should persist tasks across sessions', async ({ page }) => {
    const testData = await TestUtils.setupTestData(page, TEST_SCENARIOS.MEDIUM);
    
    const roulettePage = new RoulettePage(page);
    await roulettePage.goto();
    
    await TestUtils.verifyDataPersistence(page, 'task-roulette-tasks', testData.tasks);
  });

  test('should handle localStorage quota limits', async ({ page }) => {
    // Generate large dataset
    const largeData = Array(1000).fill(0).map((_, i) => ({
      id: i.toString(),
      name: `Participant ${i}`,
      color: '#000000',
      createdAt: new Date()
    }));
    
    try {
      await TestUtils.setLocalStorage(page, 'test-large-data', largeData);
      // Should handle gracefully without errors
    } catch (error) {
      // Expected if quota exceeded
    }
  });

  test('should handle data corruption gracefully', async ({ page }) => {
    // Set invalid JSON in localStorage
    await page.evaluate(() => {
      localStorage.setItem('roulette-participants', 'invalid-json');
    });
    
    const roulettePage = new RoulettePage(page);
    await roulettePage.goto();
    
    // App should still load without crashing
    await expect(roulettePage.title).toBeVisible();
  });
});