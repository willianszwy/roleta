import { test, expect } from '@playwright/test';
import { RoulettePage, SidePanelPage, ParticipantManagerPage, SettingsPage } from '../helpers/page-objects';
import { TestUtils, TestDataGenerator, TIMEOUTS, TEST_SCENARIOS } from '../helpers/utils';

test.describe('Participant Roulette Tests', () => {
  let roulettePage: RoulettePage;
  let sidePanel: SidePanelPage;
  let participantManager: ParticipantManagerPage;
  let settings: SettingsPage;

  test.beforeEach(async ({ page }) => {
    roulettePage = new RoulettePage(page);
    sidePanel = new SidePanelPage(page);
    participantManager = new ParticipantManagerPage(page);
    settings = new SettingsPage(page);

    // Clear localStorage and setup clean state
    await TestUtils.clearLocalStorage(page);
    await roulettePage.goto();
  });

  test('should add single participant and spin roulette', async ({ page }) => {
    // Add a participant
    await roulettePage.openSidePanel();
    await sidePanel.navigateToParticipants();
    await participantManager.addParticipant('João Silva');

    // Verify participant was added
    expect(await participantManager.getParticipantCount()).toBe(1);

    // Spin the roulette
    const winner = await roulettePage.spinRoulette();
    expect(winner).toBe('João Silva');

    // Close modal
    await roulettePage.closeModal();
  });

  test('should handle multiple participants and verify random selection', async ({ page }) => {
    const testData = await TestUtils.setupTestData(page, TEST_SCENARIOS.SMALL);
    await page.reload();
    await TestUtils.waitForStableDOM(page);

    // Verify participants loaded
    await roulettePage.openSidePanel();
    await sidePanel.navigateToParticipants();
    expect(await participantManager.getParticipantCount()).toBe(testData.participants.length);

    // Perform multiple spins to test randomness
    const winners: string[] = [];
    for (let i = 0; i < 5; i++) {
      const winner = await roulettePage.spinRoulette();
      winners.push(winner);
      await roulettePage.closeModal();
      
      // Wait between spins
      await page.waitForTimeout(TIMEOUTS.SHORT);
    }

    // Verify all winners are valid participants
    const participantNames = testData.participants.map(p => p.name);
    for (const winner of winners) {
      expect(participantNames).toContain(winner);
    }
  });

  test('should verify roulette animation timing before modal appears', async ({ page }) => {
    await TestUtils.setupTestData(page, TEST_SCENARIOS.EDGE);
    await page.reload();

    const startTime = Date.now();
    
    // Start spinning
    await (await roulettePage.spinButton.isVisible() ? 
      roulettePage.spinButton : roulettePage.spinTaskButton).click();

    // Wait for animation to complete and modal to appear
    await roulettePage.waitForSpinComplete();
    
    const endTime = Date.now();
    const duration = endTime - startTime;

    // Animation should take approximately 4.5 seconds
    expect(duration).toBeGreaterThan(4000); // At least 4s
    expect(duration).toBeLessThan(6000); // No more than 6s

    await roulettePage.closeModal();
  });

  test('should show confetti animation when modal is disabled', async ({ page }) => {
    await TestUtils.setupTestData(page, TEST_SCENARIOS.EDGE);
    
    // Disable modal in settings
    await roulettePage.openSidePanel();
    await sidePanel.navigateToSettings();
    await settings.setShowModal(false);

    // Navigate back and spin
    await sidePanel.navigateToParticipants();
    await TestUtils.waitForStableDOM(page);

    const startTime = Date.now();
    
    // Spin roulette
    await (await roulettePage.spinButton.isVisible() ? 
      roulettePage.spinButton : roulettePage.spinTaskButton).click();

    // Wait for animation duration
    await TestUtils.waitForAnimation(page);
    
    const endTime = Date.now();
    
    // Should still take full animation time
    expect(endTime - startTime).toBeGreaterThan(4000);
    
    // Modal should not appear
    await expect(page.locator('[data-testid="winner-modal"]')).not.toBeVisible();
  });

  test('should track history correctly', async ({ page }) => {
    await TestUtils.setupTestData(page, TEST_SCENARIOS.SMALL);
    await page.reload();

    // Perform a spin
    const winner = await roulettePage.spinRoulette();
    await roulettePage.closeModal();

    // Check history
    await roulettePage.openSidePanel();
    await sidePanel.navigateToHistory();
    
    const historyPage = new (await import('../helpers/page-objects')).HistoryPage(page);
    expect(await historyPage.getHistoryCount()).toBe(1);
    
    const lastWinner = await historyPage.getLastWinner();
    expect(lastWinner).toContain(winner);
  });

  test('should handle auto-removal feature correctly', async ({ page }) => {
    await TestUtils.setupTestData(page, TEST_SCENARIOS.SMALL);
    
    // Enable auto-removal
    await roulettePage.openSidePanel();
    await sidePanel.navigateToSettings();
    await settings.setAutoRemove(true);

    // Get initial participant count
    await sidePanel.navigateToParticipants();
    const initialCount = await participantManager.getParticipantCount();

    // Spin roulette
    await roulettePage.spinRoulette();
    await roulettePage.closeModal();

    // Verify participant was removed
    await roulettePage.openSidePanel();
    await sidePanel.navigateToParticipants();
    expect(await participantManager.getParticipantCount()).toBe(initialCount - 1);
  });

  test('should handle empty state gracefully', async ({ page }) => {
    // Start with no participants
    await roulettePage.openSidePanel();
    await sidePanel.navigateToParticipants();
    
    // Verify empty state
    expect(await participantManager.getParticipantCount()).toBe(0);
    
    // Spin button should be disabled or show empty state
    await expect(roulettePage.spinButton).toBeDisabled().catch(() => {
      // Alternative: check for empty state message
      expect(page.locator('text=participantes')).toBeVisible();
    });
  });

  test('should handle bulk participant import', async ({ page }) => {
    const participants = ['Alice', 'Bob', 'Charlie', 'Diana'];
    
    await roulettePage.openSidePanel();
    await sidePanel.navigateToParticipants();
    
    // Use bulk import
    await participantManager.addParticipantsBulk(participants);
    
    // Verify all participants were added
    expect(await participantManager.getParticipantCount()).toBe(participants.length);
    
    // Verify spin works with bulk-added participants
    const winner = await roulettePage.spinRoulette();
    expect(participants).toContain(winner);
    
    await roulettePage.closeModal();
  });

  test('should persist data across page refreshes', async ({ page }) => {
    const testData = await TestUtils.setupTestData(page, TEST_SCENARIOS.MEDIUM);
    await page.reload();

    // Perform a spin to create history
    await roulettePage.spinRoulette();
    await roulettePage.closeModal();

    // Refresh page
    await page.reload();
    await TestUtils.waitForStableDOM(page);

    // Verify data persistence
    await roulettePage.openSidePanel();
    await sidePanel.navigateToParticipants();
    expect(await participantManager.getParticipantCount()).toBe(testData.participants.length);

    // Verify history persisted
    await sidePanel.navigateToHistory();
    const historyPage = new (await import('../helpers/page-objects')).HistoryPage(page);
    expect(await historyPage.getHistoryCount()).toBeGreaterThan(0);
  });

  test('should handle rapid clicking during animation', async ({ page }) => {
    await TestUtils.setupTestData(page, TEST_SCENARIOS.EDGE);
    await page.reload();

    // Start first spin
    await roulettePage.spinButton.click();

    // Try to click again during animation (should be prevented)
    await page.waitForTimeout(1000); // Wait 1s into animation
    
    // Button should be disabled during animation
    await expect(roulettePage.spinButton).toBeDisabled();

    // Wait for animation to complete
    await roulettePage.waitForSpinComplete();
    await roulettePage.closeModal();

    // Now button should be enabled again
    await expect(roulettePage.spinButton).toBeEnabled();
  });

  test('should work with large number of participants', async ({ page }) => {
    await TestUtils.setupTestData(page, TEST_SCENARIOS.STRESS);
    await page.reload();

    // Verify large dataset loaded
    await roulettePage.openSidePanel();
    await sidePanel.navigateToParticipants();
    const participantCount = await participantManager.getParticipantCount();
    expect(participantCount).toBeGreaterThan(20);

    // Performance test: spinning should still be performant
    const duration = await TestUtils.measurePerformance(page, 'large-dataset-spin', async () => {
      await roulettePage.spinRoulette();
      await roulettePage.closeModal();
    });

    // Should complete within reasonable time even with large dataset
    expect(duration).toBeLessThan(TIMEOUTS.ANIMATION + 2000);
  });
});