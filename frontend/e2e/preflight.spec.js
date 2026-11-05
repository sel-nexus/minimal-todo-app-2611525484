import { expect, test } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

/** Capture text-based accessibility and rendering evidence for representative views. */
test('captures empty and populated interface preflight evidence', async ({ page }) => {
  const evidence = [];
  const viewports = [
    { name: 'desktop', width: 1440, height: 1000 },
    { name: 'mobile', width: 390, height: 844 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/');
    evidence.push(await captureView(page, `${viewport.name}-empty`));
    await page.screenshot({ path: `test-results/preflight-${viewport.name}-empty.png`, fullPage: true });

    await page.getByTestId('todo-input').fill('A representative task');
    await page.getByTestId('add-button').click();
    await expect(page.getByTestId('todo-title-1')).toHaveText('A representative task');
    evidence.push(await captureView(page, `${viewport.name}-populated`));
    await page.screenshot({ path: `test-results/preflight-${viewport.name}-populated.png`, fullPage: true });
  }

  await writeFile('test-results/preflight-evidence.txt', evidence.join('\n\n'), 'utf8');
});

/** Collect the accessibility tree, key computed styles, and rendered HTML. */
async function captureView(page, label) {
  const accessibility = await page.accessibility.snapshot();
  const styles = await page.evaluate(() => {
    const body = getComputedStyle(document.body);
    const heading = getComputedStyle(document.querySelector('h1'));
    const panel = getComputedStyle(document.querySelector('.todo-panel'));
    return {
      bodyFontFamily: body.fontFamily,
      bodyBackground: body.backgroundColor,
      headingFontFamily: heading.fontFamily,
      headingFontSize: heading.fontSize,
      panelWidth: panel.width,
      viewportWidth: window.innerWidth,
    };
  });
  return JSON.stringify({ label, accessibility, styles, html: await page.content() }, null, 2);
}
