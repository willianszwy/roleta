import { Page, Locator, expect } from '@playwright/test';
import { SELECTORS, TIMEOUTS } from './test-data';

export class RoulettePage {
  readonly page: Page;
  readonly header: Locator;
  readonly title: Locator;
  readonly menuButton: Locator;
  readonly rouletteWheel: Locator;
  readonly spinButton: Locator;
  readonly spinTaskButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator(SELECTORS.HEADER);
    this.title = page.locator(SELECTORS.TITLE);
    this.menuButton = page.locator(SELECTORS.MENU_BUTTON);
    this.rouletteWheel = page.locator(SELECTORS.ROULETTE_WHEEL);
    this.spinButton = page.locator(SELECTORS.SPIN_BUTTON);
    this.spinTaskButton = page.locator(SELECTORS.SPIN_BUTTON_TASK);
  }

  async goto() {
    await this.page.goto('/');
    await expect(this.title).toBeVisible();
  }

  async openSidePanel() {
    await this.menuButton.click();
    await expect(this.page.locator(SELECTORS.SIDE_PANEL)).toBeVisible();
  }

  async spinRoulette(): Promise<string> {
    const isTaskMode = await this.spinTaskButton.isVisible();
    const button = isTaskMode ? this.spinTaskButton : this.spinButton;
    
    await button.click();
    
    // Wait for animation to complete
    await this.page.waitForTimeout(TIMEOUTS.ANIMATION);
    
    // Get winner from modal
    const modal = this.page.locator(SELECTORS.WINNER_MODAL);
    await expect(modal).toBeVisible();
    
    const winnerName = await modal.locator(SELECTORS.MODAL_WINNER_NAME).textContent();
    return winnerName || '';
  }

  async closeModal() {
    const closeButton = this.page.locator(SELECTORS.MODAL_CLOSE_BUTTON);
    await closeButton.click();
    await expect(this.page.locator(SELECTORS.WINNER_MODAL)).not.toBeVisible();
  }

  async waitForSpinComplete() {
    await this.page.waitForTimeout(TIMEOUTS.ANIMATION);
    await expect(this.page.locator(SELECTORS.WINNER_MODAL)).toBeVisible();
  }

  async isSpinning(): Promise<boolean> {
    // Check if spin button is disabled or wheel is rotating
    const button = this.spinButton.isVisible() ? this.spinButton : this.spinTaskButton;
    return await button.isDisabled();
  }
}

export class SidePanelPage {
  readonly page: Page;
  readonly sidePanel: Locator;
  readonly navParticipants: Locator;
  readonly navTasks: Locator;
  readonly navHistory: Locator;
  readonly navSettings: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidePanel = page.locator(SELECTORS.SIDE_PANEL);
    this.navParticipants = page.locator(SELECTORS.NAV_PARTICIPANTS);
    this.navTasks = page.locator(SELECTORS.NAV_TASKS);
    this.navHistory = page.locator(SELECTORS.NAV_HISTORY);
    this.navSettings = page.locator(SELECTORS.NAV_SETTINGS);
  }

  async navigateToParticipants() {
    await this.navParticipants.click();
    await expect(this.page.locator(SELECTORS.PARTICIPANT_INPUT)).toBeVisible();
  }

  async navigateToTasks() {
    await this.navTasks.click();
    await expect(this.page.locator(SELECTORS.TASK_INPUT)).toBeVisible();
  }

  async navigateToHistory() {
    await this.navHistory.click();
    await expect(this.page.locator(SELECTORS.HISTORY_LIST)).toBeVisible();
  }

  async navigateToSettings() {
    await this.navSettings.click();
    await expect(this.page.locator(SELECTORS.SETTING_TOGGLE_MODE)).toBeVisible();
  }
}

export class ParticipantManagerPage {
  readonly page: Page;
  readonly input: Locator;
  readonly addButton: Locator;
  readonly bulkTextarea: Locator;
  readonly participantItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.input = page.locator(SELECTORS.PARTICIPANT_INPUT);
    this.addButton = page.locator(SELECTORS.ADD_PARTICIPANT_BUTTON);
    this.bulkTextarea = page.locator(SELECTORS.BULK_TEXTAREA);
    this.participantItems = page.locator(SELECTORS.PARTICIPANT_LIST_ITEM);
  }

  async addParticipant(name: string) {
    await this.input.fill(name);
    await this.addButton.click();
    await expect(this.participantItems.filter({ hasText: name })).toBeVisible();
  }

  async addParticipantsBulk(names: string[]) {
    const text = names.join('\\n');
    await this.bulkTextarea.fill(text);
    // Assume there's a bulk add button or auto-processing
    await this.page.keyboard.press('Enter');
    
    // Verify all participants were added
    for (const name of names) {
      await expect(this.participantItems.filter({ hasText: name })).toBeVisible();
    }
  }

  async removeParticipant(name: string) {
    const item = this.participantItems.filter({ hasText: name });
    const removeButton = item.locator('button:has-text("×"), button:has-text("Remove")');
    await removeButton.click();
    await expect(item).not.toBeVisible();
  }

  async getParticipantCount(): Promise<number> {
    return await this.participantItems.count();
  }

  async clearAllParticipants() {
    const clearButton = this.page.locator('button:has-text("Limpar Todos")');
    if (await clearButton.isVisible()) {
      await clearButton.click();
      await expect(this.participantItems).toHaveCount(0);
    }
  }
}

export class TaskManagerPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly addButton: Locator;
  readonly bulkTextarea: Locator;
  readonly taskItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator(SELECTORS.TASK_INPUT);
    this.descriptionInput = page.locator(SELECTORS.TASK_DESCRIPTION_INPUT);
    this.addButton = page.locator(SELECTORS.ADD_TASK_BUTTON);
    this.bulkTextarea = page.locator(SELECTORS.BULK_TEXTAREA);
    this.taskItems = page.locator(SELECTORS.TASK_LIST_ITEM);
  }

  async addTask(name: string, description?: string) {
    await this.nameInput.fill(name);
    if (description && await this.descriptionInput.isVisible()) {
      await this.descriptionInput.fill(description);
    }
    await this.addButton.click();
    await expect(this.taskItems.filter({ hasText: name })).toBeVisible();
  }

  async addTasksBulk(tasks: string[]) {
    const text = tasks.join('\\n');
    await this.bulkTextarea.fill(text);
    await this.page.keyboard.press('Enter');
    
    for (const task of tasks) {
      await expect(this.taskItems.filter({ hasText: task })).toBeVisible();
    }
  }

  async removeTask(name: string) {
    const item = this.taskItems.filter({ hasText: name });
    const removeButton = item.locator('button:has-text("×"), button:has-text("Remove")');
    await removeButton.click();
    await expect(item).not.toBeVisible();
  }

  async getTaskCount(): Promise<number> {
    return await this.taskItems.count();
  }

  async getPendingTaskCount(): Promise<number> {
    const pendingTasks = this.taskItems.filter({ hasText: /○|pending/i });
    return await pendingTasks.count();
  }

  async getCompletedTaskCount(): Promise<number> {
    const completedTasks = this.taskItems.filter({ hasText: /✓|completed/i });
    return await completedTasks.count();
  }
}

export class SettingsPage {
  readonly page: Page;
  readonly modeToggle: Locator;
  readonly autoRemoveToggle: Locator;
  readonly showModalToggle: Locator;
  readonly durationInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modeToggle = page.locator(SELECTORS.SETTING_TOGGLE_MODE).first();
    this.autoRemoveToggle = page.locator(SELECTORS.SETTING_AUTO_REMOVE);
    this.showModalToggle = page.locator(SELECTORS.SETTING_SHOW_MODAL);
    this.durationInput = page.locator(SELECTORS.SETTING_DURATION);
  }

  async toggleMode() {
    await this.modeToggle.click();
  }

  async setAutoRemove(enabled: boolean) {
    const isChecked = await this.autoRemoveToggle.isChecked();
    if (isChecked !== enabled) {
      await this.autoRemoveToggle.click();
    }
  }

  async setShowModal(enabled: boolean) {
    const isChecked = await this.showModalToggle.isChecked();
    if (isChecked !== enabled) {
      await this.showModalToggle.click();
    }
  }

  async setDuration(seconds: number) {
    await this.durationInput.fill(seconds.toString());
  }

  async isTaskMode(): Promise<boolean> {
    return await this.modeToggle.isChecked();
  }
}

export class HistoryPage {
  readonly page: Page;
  readonly historyList: Locator;
  readonly historyItems: Locator;
  readonly clearButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.historyList = page.locator(SELECTORS.HISTORY_LIST);
    this.historyItems = page.locator(SELECTORS.HISTORY_ITEM);
    this.clearButton = page.locator(SELECTORS.CLEAR_HISTORY_BUTTON);
  }

  async getHistoryCount(): Promise<number> {
    return await this.historyItems.count();
  }

  async clearHistory() {
    if (await this.clearButton.isVisible()) {
      await this.clearButton.click();
      await expect(this.historyItems).toHaveCount(0);
    }
  }

  async getLastWinner(): Promise<string> {
    const lastItem = this.historyItems.first();
    return await lastItem.textContent() || '';
  }
}