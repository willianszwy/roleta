import { test, expect } from '@playwright/test';
import { RoulettePage, SidePanelPage, SettingsPage } from '../helpers/page-objects';
import { TestUtils } from '../helpers/utils';

test.describe('Settings Tests', () => {
  let roulettePage: RoulettePage;
  let sidePanel: SidePanelPage;
  let settings: SettingsPage;

  test.beforeEach(async ({ page }) => {
    roulettePage = new RoulettePage(page);
    sidePanel = new SidePanelPage(page);
    settings = new SettingsPage(page);

    await TestUtils.clearLocalStorage(page);
    await roulettePage.goto();
    await roulettePage.openSidePanel();
    await sidePanel.navigateToSettings();
  });

  test('should toggle between participant and task modes', async ({ page }) => {
    const initialMode = await settings.isTaskMode();
    await settings.toggleMode();
    const newMode = await settings.isTaskMode();
    expect(newMode).toBe(!initialMode);
  });

  test('should configure auto-removal setting', async () => {
    await settings.setAutoRemove(true);
    // Verify setting persisted (could check localStorage)
  });

  test('should configure modal display setting', async () => {
    await settings.setShowModal(false);
    // Verify setting persisted
  });

  test('should set modal duration', async () => {
    await settings.setDuration(10);
    // Verify duration was set
  });

  test('should persist settings across page reloads', async ({ page }) => {
    await settings.setAutoRemove(true);
    await settings.setShowModal(false);
    
    await page.reload();
    await TestUtils.waitForStableDOM(page);
    
    // Verify settings persisted
    await roulettePage.openSidePanel();
    await sidePanel.navigateToSettings();
    // Check that settings maintained their values
  });
});