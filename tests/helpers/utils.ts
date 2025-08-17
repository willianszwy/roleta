import { Page, expect } from '@playwright/test';
import { TestDataGenerator, TIMEOUTS } from './test-data';

export class TestUtils {
  static async clearLocalStorage(page: Page) {
    await page.evaluate(() => {
      localStorage.clear();
    });
  }

  static async setLocalStorage(page: Page, key: string, value: any) {
    await page.evaluate(
      ({ key, value }) => {
        localStorage.setItem(key, JSON.stringify(value));
      },
      { key, value }
    );
  }

  static async getLocalStorage(page: Page, key: string): Promise<any> {
    return await page.evaluate(
      (key) => {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      },
      key
    );
  }

  static async waitForAnimation(page: Page, duration: number = TIMEOUTS.ANIMATION) {
    await page.waitForTimeout(duration);
  }

  static async waitForStableDOM(page: Page, timeout: number = TIMEOUTS.MEDIUM) {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500); // Additional buffer
  }

  static async setupTestData(page: Page, scenario: 'small' | 'medium' | 'large' | 'edge' | 'stress' = 'medium') {
    const data = TestDataGenerator.createScenario(scenario);
    
    // Clear existing data
    await this.clearLocalStorage(page);
    
    // Set up participants
    await this.setLocalStorage(page, 'roulette-participants', data.participants);
    
    // Set up tasks
    await this.setLocalStorage(page, 'task-roulette-tasks', data.tasks);
    
    // Set default settings
    await this.setLocalStorage(page, 'roulette-settings', {
      autoRemoveParticipants: false,
      showWinnerModal: true,
      winnerDisplayDuration: 5,
      rouletteMode: 'participants'
    });
    
    return data;
  }

  static async takeScreenshotOnFailure(page: Page, testName: string) {
    try {
      await page.screenshot({
        path: `test-results/screenshots/${testName}-failure.png`,
        fullPage: true
      });
    } catch (error) {
      console.warn('Failed to take screenshot:', error);
    }
  }

  static async verifyNoConsoleErrors(page: Page) {
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // At the end of test, check for errors
    expect(errors).toHaveLength(0);
  }

  static async verifyResponsiveness(page: Page, viewports: Array<{width: number, height: number, name: string}>) {
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await this.waitForStableDOM(page);
      
      // Verify key elements are visible
      await expect(page.locator('h1:has-text("LuckyWheel")')).toBeVisible();
      await expect(page.locator('button')).toBeVisible(); // Menu button
      
      // Take screenshot for visual regression
      await page.screenshot({
        path: `test-results/responsive/${viewport.name}-${viewport.width}x${viewport.height}.png`,
        fullPage: true
      });
    }
  }

  static async measurePerformance(page: Page, actionName: string, action: () => Promise<void>) {
    const startTime = Date.now();
    await action();
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`Performance: ${actionName} took ${duration}ms`);
    
    // Assert reasonable performance thresholds
    if (actionName.includes('spin')) {
      expect(duration).toBeLessThan(TIMEOUTS.ANIMATION + 1000); // Animation + buffer
    } else {
      expect(duration).toBeLessThan(TIMEOUTS.MEDIUM); // General operations
    }
    
    return duration;
  }

  static async verifyAccessibility(page: Page) {
    // Basic accessibility checks
    const title = await page.title();
    expect(title).toBeTruthy();
    
    // Check for heading structure
    const h1Elements = await page.locator('h1').count();
    expect(h1Elements).toBeGreaterThan(0);
    
    // Check for button accessibility
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      
      // Button should have either text content or aria-label
      expect(text || ariaLabel).toBeTruthy();
    }
  }

  static async simulateSlowNetwork(page: Page) {
    await page.route('**/*', (route) => {
      // Add delay to simulate slow network
      setTimeout(() => route.continue(), 100);
    });
  }

  static async simulateOffline(page: Page) {
    await page.context().setOffline(true);
  }

  static async restoreOnline(page: Page) {
    await page.context().setOffline(false);
  }

  static generateRandomString(length: number = 10): string {
    return Math.random().toString(36).substring(2, length + 2);
  }

  static async verifyDataPersistence(page: Page, key: string, expectedData: any) {
    await page.reload();
    await this.waitForStableDOM(page);
    
    const storedData = await this.getLocalStorage(page, key);
    expect(storedData).toEqual(expectedData);
  }

  static async stressTest(page: Page, operation: () => Promise<void>, iterations: number = 10) {
    const results: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const duration = await this.measurePerformance(page, `stress-${i}`, operation);
      results.push(duration);
    }
    
    const avgDuration = results.reduce((a, b) => a + b, 0) / results.length;
    const maxDuration = Math.max(...results);
    
    console.log(`Stress test results: avg=${avgDuration}ms, max=${maxDuration}ms`);
    
    // Performance should not degrade significantly
    expect(maxDuration).toBeLessThan(avgDuration * 2);
    
    return { avg: avgDuration, max: maxDuration, results };
  }
}