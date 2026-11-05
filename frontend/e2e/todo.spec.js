import { expect, test } from '@playwright/test';

test('user completes the in-session task lifecycle', async ({ page }) => {
  const browserErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      browserErrors.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on('pageerror', (error) => browserErrors.push(`pageerror: ${error.message}`));

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Todo App' })).toBeVisible();
  await expect(page.getByTestId('empty-state')).toHaveText('No tasks yet.');

  const input = page.getByTestId('todo-input');
  await page.getByTestId('add-button').click();
  await input.fill('   ');
  await input.press('Enter');
  await expect(page.getByTestId('empty-state')).toHaveText('No tasks yet.');

  await input.fill('Plan the week');
  await page.getByTestId('add-button').click();
  await expect(page.getByTestId('todo-title-1')).toHaveText('Plan the week');
  await expect(input).toHaveValue('');

  await input.fill('Send the note');
  await input.press('Enter');
  await expect(page.getByTestId('todo-title-2')).toHaveText('Send the note');
  await expect(page.getByTestId('todo-list').locator('li')).toHaveCount(2);
  await expect(page.getByTestId('todo-item-1')).toBeVisible();
  await expect(page.getByTestId('todo-item-2')).toBeVisible();

  await page.getByTestId('todo-checkbox-1').check();
  await expect(page.getByTestId('todo-checkbox-1')).toBeChecked();
  await expect(page.getByTestId('todo-title-1')).toHaveCSS('text-decoration-line', 'line-through');
  await expect(page.getByTestId('todo-checkbox-2')).not.toBeChecked();
  await expect(page.getByTestId('todo-title-2')).toHaveCSS('text-decoration-line', 'none');

  await page.getByTestId('todo-delete-2').click();
  await expect(page.getByTestId('todo-item-1')).toBeVisible();
  await expect(page.getByTestId('todo-title-1')).toHaveText('Plan the week');
  await expect(page.getByTestId('todo-checkbox-1')).toBeChecked();
  await expect(page.getByTestId('todo-title-1')).toHaveCSS('text-decoration-line', 'line-through');
  await expect(page.getByTestId('todo-item-2')).toHaveCount(0);

  await input.fill('A long title boundary '.repeat(100));
  await input.press('Enter');
  await expect(page.getByTestId('todo-title-3')).toHaveText('A long title boundary '.repeat(100));
  await page.getByTestId('todo-delete-3').click();
  await input.fill('Next task after deletion');
  await input.press('Enter');
  await expect(page.getByTestId('todo-title-4')).toHaveText('Next task after deletion');
  await expect(page.getByTestId('todo-item-3')).toHaveCount(0);

  await page.screenshot({ path: 'test-results/todo-lifecycle.png', fullPage: true });

  await page.getByTestId('todo-delete-4').click();
  await page.getByTestId('todo-delete-1').click();
  await expect(page.getByTestId('empty-state')).toHaveText('No tasks yet.');
  await expect(page.getByTestId('todo-list')).toHaveCount(0);

  await input.fill('Reload should clear this');
  await input.press('Enter');
  await expect(page.getByTestId('todo-title-5')).toHaveText('Reload should clear this');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Todo App' })).toBeVisible();
  await expect(page.getByTestId('empty-state')).toHaveText('No tasks yet.');
  await expect(page.getByTestId('todo-list')).toHaveCount(0);
  await expect(page.getByTestId('todo-input')).toHaveValue('');

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole('heading', { name: 'Todo App' })).toBeVisible();
  await expect(page.getByTestId('empty-state')).toHaveText('No tasks yet.');
  expect(browserErrors).toEqual([]);
});
