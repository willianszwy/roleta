import { test, expect } from '@playwright/test';
import { RoulettePage, SidePanelPage, TaskManagerPage } from '../helpers/page-objects';
import { TestUtils } from '../helpers/utils';

test.describe('Task Management Tests', () => {
  let roulettePage: RoulettePage;
  let sidePanel: SidePanelPage;
  let taskManager: TaskManagerPage;

  test.beforeEach(async ({ page }) => {
    roulettePage = new RoulettePage(page);
    sidePanel = new SidePanelPage(page);
    taskManager = new TaskManagerPage(page);

    await TestUtils.clearLocalStorage(page);
    await roulettePage.goto();
    await roulettePage.openSidePanel();
    await sidePanel.navigateToTasks();
  });

  test('should add task with name only', async () => {
    await taskManager.addTask('Simple Task');
    expect(await taskManager.getTaskCount()).toBe(1);
  });

  test('should add task with description', async () => {
    await taskManager.addTask('Complex Task', 'Detailed description');
    expect(await taskManager.getTaskCount()).toBe(1);
  });

  test('should add tasks via bulk import', async () => {
    const tasks = ['Task 1', 'Task 2', 'Task 3'];
    await taskManager.addTasksBulk(tasks);
    expect(await taskManager.getTaskCount()).toBe(tasks.length);
  });

  test('should remove individual tasks', async () => {
    await taskManager.addTask('Removable Task');
    await taskManager.removeTask('Removable Task');
    expect(await taskManager.getTaskCount()).toBe(0);
  });

  test('should track task status transitions', async ({ page }) => {
    await taskManager.addTask('Status Task');
    
    // Initially pending
    expect(await taskManager.getPendingTaskCount()).toBe(1);
    expect(await taskManager.getCompletedTaskCount()).toBe(0);
    
    // After assignment, should be completed
    // This would require switching to task mode and spinning
  });
});