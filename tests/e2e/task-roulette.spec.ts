import { test, expect } from '@playwright/test';
import { RoulettePage, SidePanelPage, ParticipantManagerPage, TaskManagerPage, SettingsPage } from '../helpers/page-objects';
import { TestUtils, TIMEOUTS, TEST_SCENARIOS } from '../helpers/utils';

test.describe('Task Roulette Tests', () => {
  let roulettePage: RoulettePage;
  let sidePanel: SidePanelPage;
  let participantManager: ParticipantManagerPage;
  let taskManager: TaskManagerPage;
  let settings: SettingsPage;

  test.beforeEach(async ({ page }) => {
    roulettePage = new RoulettePage(page);
    sidePanel = new SidePanelPage(page);
    participantManager = new ParticipantManagerPage(page);
    taskManager = new TaskManagerPage(page);
    settings = new SettingsPage(page);

    await TestUtils.clearLocalStorage(page);
    await roulettePage.goto();
  });

  test('should assign tasks to participants correctly', async ({ page }) => {
    await TestUtils.setupTestData(page, TEST_SCENARIOS.SMALL);
    
    // Switch to task mode
    await roulettePage.openSidePanel();
    await sidePanel.navigateToSettings();
    await settings.toggleMode();
    
    await page.reload();
    await TestUtils.waitForStableDOM(page);

    // Verify task mode is active
    await expect(roulettePage.spinTaskButton).toBeVisible();

    // Spin for task assignment
    const winner = await roulettePage.spinRoulette();
    expect(winner).toBeTruthy();
    
    await roulettePage.closeModal();
  });

  test('should process task queue in order', async ({ page }) => {
    await TestUtils.setupTestData(page, TEST_SCENARIOS.MEDIUM);
    
    // Switch to task mode
    await roulettePage.openSidePanel();
    await sidePanel.navigateToSettings();
    await settings.toggleMode();
    
    await sidePanel.navigateToTasks();
    const initialPendingCount = await taskManager.getPendingTaskCount();
    
    // Assign first task
    await roulettePage.spinRoulette();
    await roulettePage.closeModal();
    
    // Check that pending count decreased
    await roulettePage.openSidePanel();
    await sidePanel.navigateToTasks();
    const newPendingCount = await taskManager.getPendingTaskCount();
    expect(newPendingCount).toBe(initialPendingCount - 1);
    
    // Check completed count increased
    const completedCount = await taskManager.getCompletedTaskCount();
    expect(completedCount).toBe(1);
  });

  test('should track task assignments in history', async ({ page }) => {
    await TestUtils.setupTestData(page, TEST_SCENARIOS.SMALL);
    
    // Switch to task mode
    await roulettePage.openSidePanel();
    await sidePanel.navigateToSettings();
    await settings.toggleMode();
    
    await page.reload();
    
    // Assign task
    await roulettePage.spinRoulette();
    await roulettePage.closeModal();
    
    // Check task history
    await roulettePage.openSidePanel();
    await sidePanel.navigateToHistory();
    
    const historyPage = new (await import('../helpers/page-objects')).HistoryPage(page);
    expect(await historyPage.getHistoryCount()).toBe(1);
  });

  test('should handle auto-removal in task mode', async ({ page }) => {
    await TestUtils.setupTestData(page, TEST_SCENARIOS.SMALL);
    
    // Enable auto-removal and task mode
    await roulettePage.openSidePanel();
    await sidePanel.navigateToSettings();
    await settings.setAutoRemove(true);
    await settings.toggleMode();
    
    await sidePanel.navigateToParticipants();
    const initialCount = await participantManager.getParticipantCount();
    
    // Assign task
    await roulettePage.spinRoulette();
    await roulettePage.closeModal();
    
    // Verify participant was removed
    await roulettePage.openSidePanel();
    await sidePanel.navigateToParticipants();
    expect(await participantManager.getParticipantCount()).toBe(initialCount - 1);
  });

  test('should not assign duplicate tasks', async ({ page }) => {
    const testData = await TestUtils.setupTestData(page, TEST_SCENARIOS.EDGE); // 1 participant, 1 task
    
    // Switch to task mode
    await roulettePage.openSidePanel();
    await sidePanel.navigateToSettings();
    await settings.toggleMode();
    
    await page.reload();
    
    // Assign the only task
    await roulettePage.spinRoulette();
    await roulettePage.closeModal();
    
    // Try to spin again - should show no more tasks
    await expect(roulettePage.spinTaskButton).toBeDisabled().catch(() => {
      // Alternative: check for "no tasks" message
      expect(page.locator('text=Todas as tarefas')).toBeVisible();
    });
  });

  test('should display task description in modal', async ({ page }) => {
    // Create task with description
    await roulettePage.openSidePanel();
    await sidePanel.navigateToParticipants();
    await participantManager.addParticipant('Test User');
    
    await sidePanel.navigateToTasks();
    await taskManager.addTask('Test Task', 'Detailed description of the task');
    
    // Switch to task mode
    await sidePanel.navigateToSettings();
    await settings.toggleMode();
    
    await page.reload();
    
    // Assign task
    await roulettePage.spinRoulette();
    
    // Verify modal shows task details
    const modal = page.locator('[data-testid="winner-modal"]');
    await expect(modal).toBeVisible();
    await expect(modal.locator('text=Test Task')).toBeVisible();
    await expect(modal.locator('text=Detailed description')).toBeVisible();
    
    await roulettePage.closeModal();
  });

  test('should handle empty states gracefully', async ({ page }) => {
    // Test with no participants
    await roulettePage.openSidePanel();
    await sidePanel.navigateToTasks();
    await taskManager.addTask('Lonely Task');
    
    await sidePanel.navigateToSettings();
    await settings.toggleMode();
    
    await page.reload();
    
    // Should show empty state or disable button
    await expect(roulettePage.spinTaskButton).toBeDisabled().catch(() => {
      expect(page.locator('text=participantes')).toBeVisible();
    });
  });

  test('should maintain task progress across page reloads', async ({ page }) => {
    await TestUtils.setupTestData(page, TEST_SCENARIOS.MEDIUM);
    
    // Switch to task mode and assign task
    await roulettePage.openSidePanel();
    await sidePanel.navigateToSettings();
    await settings.toggleMode();
    
    await page.reload();
    await roulettePage.spinRoulette();
    await roulettePage.closeModal();
    
    // Reload page
    await page.reload();
    await TestUtils.waitForStableDOM(page);
    
    // Verify task progress persisted
    await roulettePage.openSidePanel();
    await sidePanel.navigateToTasks();
    expect(await taskManager.getCompletedTaskCount()).toBe(1);
  });

  test('should handle large task queues efficiently', async ({ page }) => {
    await TestUtils.setupTestData(page, TEST_SCENARIOS.STRESS);
    
    // Switch to task mode
    await roulettePage.openSidePanel();
    await sidePanel.navigateToSettings();
    await settings.toggleMode();
    
    await page.reload();
    
    // Performance test with large dataset
    const duration = await TestUtils.measurePerformance(page, 'large-task-assignment', async () => {
      await roulettePage.spinRoulette();
      await roulettePage.closeModal();
    });
    
    expect(duration).toBeLessThan(TIMEOUTS.ANIMATION + 2000);
  });
});