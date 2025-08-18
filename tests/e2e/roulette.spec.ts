import { test, expect } from '@playwright/test';

test.describe('TaskRoulette Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the application', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle(/TaskRoulette/);
    
    // Verify main heading
    await expect(page.locator('h1')).toContainText('TaskRoulette');
  });

  test('should add participants and show in roulette', async ({ page }) => {
    // Open side panel
    await page.getByRole('button', { name: /menu/i }).click();
    
    // Add a participant
    await page.getByPlaceholder('Nome...').fill('João Silva');
    await page.getByRole('button', { name: 'Adicionar' }).click();
    
    // Verify participant was added
    await expect(page.getByText('João Silva')).toBeVisible();
    
    // Add another participant
    await page.getByPlaceholder('Nome...').fill('Maria Santos');
    await page.getByRole('button', { name: 'Adicionar' }).click();
    
    // Verify second participant
    await expect(page.getByText('Maria Santos')).toBeVisible();
    
    // Verify participant count
    await expect(page.getByText('2')).toBeVisible();
  });

  test('should perform bulk import of participants', async ({ page }) => {
    // Open side panel
    await page.getByRole('button', { name: /menu/i }).click();
    
    // Open bulk import
    await page.getByRole('button', { name: 'Importar Lista' }).click();
    
    // Enter multiple names
    const names = 'Ana Costa\nCarlos Lima\nDiana Silva';
    await page.getByPlaceholder(/Digite os nomes separados/).fill(names);
    
    // Submit bulk import
    await page.getByRole('button', { name: /Adicionar \(3 nomes\)/ }).click();
    
    // Verify all participants were added
    await expect(page.getByText('Ana Costa')).toBeVisible();
    await expect(page.getByText('Carlos Lima')).toBeVisible();
    await expect(page.getByText('Diana Silva')).toBeVisible();
    
    // Verify count
    await expect(page.getByText('3')).toBeVisible();
  });

  test('should spin roulette and show winner', async ({ page }) => {
    // Add participants first
    await page.getByRole('button', { name: /menu/i }).click();
    await page.getByPlaceholder('Nome...').fill('Participante 1');
    await page.getByRole('button', { name: 'Adicionar' }).click();
    await page.getByPlaceholder('Nome...').fill('Participante 2');
    await page.getByRole('button', { name: 'Adicionar' }).click();
    
    // Close side panel to see roulette
    await page.getByRole('button', { name: /close/i }).click();
    
    // Spin the roulette
    await page.getByRole('button', { name: /girar/i }).click();
    
    // Wait for spin animation to complete and modal to appear
    await page.waitForSelector('[data-testid="winner-modal"]', { timeout: 10000 });
    
    // Verify winner modal is shown
    await expect(page.locator('[data-testid="winner-modal"]')).toBeVisible();
    
    // Verify winner name is displayed
    const winnerName = await page.locator('[data-testid="winner-name"]').textContent();
    expect(['Participante 1', 'Participante 2']).toContain(winnerName);
  });

  test('should remove participant', async ({ page }) => {
    // Add a participant
    await page.getByRole('button', { name: /menu/i }).click();
    await page.getByPlaceholder('Nome...').fill('Test User');
    await page.getByRole('button', { name: 'Adicionar' }).click();
    
    // Open participant menu
    await page.locator('[data-testid="participant-item"]').first().locator('button').click();
    
    // Remove participant (auto-confirm in tests)
    await page.getByText('Remover participante').click();
    
    // Verify participant was removed
    await expect(page.getByText('Test User')).not.toBeVisible();
    await expect(page.getByText('Adicione participantes para começar o sorteio')).toBeVisible();
  });

  test('should clear all participants', async ({ page }) => {
    // Add multiple participants
    await page.getByRole('button', { name: /menu/i }).click();
    await page.getByPlaceholder('Nome...').fill('User 1');
    await page.getByRole('button', { name: 'Adicionar' }).click();
    await page.getByPlaceholder('Nome...').fill('User 2');
    await page.getByRole('button', { name: 'Adicionar' }).click();
    
    // Open options menu
    await page.getByRole('button', { name: 'Opções ⋮' }).click();
    
    // Clear all participants
    await page.getByText('Limpar todos').click();
    
    // Verify all participants were cleared
    await expect(page.getByText('User 1')).not.toBeVisible();
    await expect(page.getByText('User 2')).not.toBeVisible();
    await expect(page.getByText('Adicione participantes para começar o sorteio')).toBeVisible();
  });

  test('should navigate between different sections', async ({ page }) => {
    await page.getByRole('button', { name: /menu/i }).click();
    
    // Test navigation to History
    await page.getByRole('button', { name: 'Histórico' }).click();
    await expect(page.getByText('Histórico')).toBeVisible();
    
    // Test navigation to Settings
    await page.getByRole('button', { name: 'Config' }).click();
    await expect(page.getByText('Modalidade de Sorteio')).toBeVisible();
    
    // Test navigation back to Participants
    await page.getByRole('button', { name: 'Participantes' }).click();
    await expect(page.getByPlaceholder('Nome...')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify app still works on mobile
    await expect(page.locator('h1')).toContainText('TaskRoulette');
    
    // Open side panel (should be full width on mobile)
    await page.getByRole('button', { name: /menu/i }).click();
    
    // Add participant on mobile
    await page.getByPlaceholder('Nome...').fill('Mobile User');
    await page.getByRole('button', { name: 'Adicionar' }).click();
    
    // Verify participant was added
    await expect(page.getByText('Mobile User')).toBeVisible();
  });

  test('should handle empty input validation', async ({ page }) => {
    await page.getByRole('button', { name: /menu/i }).click();
    
    // Verify add button is disabled when input is empty
    await expect(page.getByRole('button', { name: 'Adicionar' })).toBeDisabled();
    
    // Type and clear input
    await page.getByPlaceholder('Nome...').fill('Test');
    await expect(page.getByRole('button', { name: 'Adicionar' })).toBeEnabled();
    
    await page.getByPlaceholder('Nome...').fill('');
    await expect(page.getByRole('button', { name: 'Adicionar' })).toBeDisabled();
  });

  test('should persist participants after page reload', async ({ page }) => {
    // Add participants
    await page.getByRole('button', { name: /menu/i }).click();
    await page.getByPlaceholder('Nome...').fill('Persistent User');
    await page.getByRole('button', { name: 'Adicionar' }).click();
    
    // Reload page
    await page.reload();
    
    // Verify participant persisted
    await page.getByRole('button', { name: /menu/i }).click();
    await expect(page.getByText('Persistent User')).toBeVisible();
  });
});