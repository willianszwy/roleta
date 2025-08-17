import { test, expect } from '@playwright/test';
import { RoulettePage, SidePanelPage, ParticipantManagerPage } from '../helpers/page-objects';
import { TestUtils, TestDataGenerator } from '../helpers/utils';

test.describe('Participant Management Tests', () => {
  let roulettePage: RoulettePage;
  let sidePanel: SidePanelPage;
  let participantManager: ParticipantManagerPage;

  test.beforeEach(async ({ page }) => {
    roulettePage = new RoulettePage(page);
    sidePanel = new SidePanelPage(page);
    participantManager = new ParticipantManagerPage(page);

    await TestUtils.clearLocalStorage(page);
    await roulettePage.goto();
    await roulettePage.openSidePanel();
    await sidePanel.navigateToParticipants();
  });

  test('should add participant via input field', async () => {
    await participantManager.addParticipant('João Silva');
    expect(await participantManager.getParticipantCount()).toBe(1);
  });

  test('should add multiple participants via bulk import', async () => {
    const participants = ['Alice', 'Bob', 'Charlie'];
    await participantManager.addParticipantsBulk(participants);
    expect(await participantManager.getParticipantCount()).toBe(participants.length);
  });

  test('should remove individual participants', async ({ page }) => {
    await participantManager.addParticipant('Test User');
    await participantManager.removeParticipant('Test User');
    expect(await participantManager.getParticipantCount()).toBe(0);
  });

  test('should clear all participants', async () => {
    const participants = TestDataGenerator.generateParticipants(5);
    for (const p of participants) {
      await participantManager.addParticipant(p.name);
    }
    
    await participantManager.clearAllParticipants();
    expect(await participantManager.getParticipantCount()).toBe(0);
  });

  test('should handle duplicate names', async () => {
    await participantManager.addParticipant('João');
    await participantManager.addParticipant('João');
    
    // Should have both with differentiated names
    expect(await participantManager.getParticipantCount()).toBe(2);
  });

  test('should validate input limits', async ({ page }) => {
    const longName = 'a'.repeat(100);
    await participantManager.input.fill(longName);
    
    // Should either truncate or show validation error
    const value = await participantManager.input.inputValue();
    expect(value.length).toBeLessThanOrEqual(50); // Assume 50 char limit
  });
});