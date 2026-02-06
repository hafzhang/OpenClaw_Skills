import { test, expect } from '@playwright/test';

test.describe('OpenClaw Hub Application', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/OpenClaw 实战指南/);

    // Check main heading - there are 2 h1 elements with this text, use .first()
    await expect(page.locator('h1').filter({ hasText: 'OpenClaw 实战指南' }).first()).toBeVisible();

    // Check subtitle
    await expect(page.locator('text=30 个真实案例，让 AI 助手真正帮你工作')).toBeVisible();
  });

  test('navigation links work', async ({ page }) => {
    await page.goto('/');

    // Test tutorials link
    await page.click('a[href="/tutorials"]');
    await expect(page).toHaveURL(/\/tutorials/);
    await expect(page.locator('h1').filter({ hasText: '教程' })).toBeVisible();

    // Go back and test skills link
    await page.goto('/');
    await page.click('a[href="/skills"]');
    await expect(page).toHaveURL(/\/skills/);
    await expect(page.locator('h1').filter({ hasText: '技能' })).toBeVisible();

    // Go back and test configs link
    await page.goto('/');
    await page.click('a[href="/configs"]');
    await expect(page).toHaveURL(/\/configs/);
    await expect(page.locator('h1').filter({ hasText: '配置' })).toBeVisible();
  });

  test('quick start tutorials are displayed', async ({ page }) => {
    await page.goto('/');

    // Check quick start section
    await expect(page.locator('h2').filter({ hasText: '快速入门' })).toBeVisible();

    // Check that tutorial cards exist
    const tutorialCards = page.locator('[data-slot="card"]');
    await expect(tutorialCards.first()).toBeVisible();

    // Check tutorial links work
    await page.click('a[href="/tutorial/getting-started-with-openclaw"]');
    await expect(page).toHaveURL(/\/tutorial\/getting-started-with-openclaw/);
  });

  test('search functionality exists', async ({ page }) => {
    await page.goto('/');

    // Check search input exists
    const searchInput = page.locator('input[type="search"]');
    await expect(searchInput.first()).toBeVisible();

    // Type in search
    await searchInput.first().fill('OpenClaw');
    await expect(searchInput.first()).toHaveValue('OpenClaw');
  });

  test('category filter buttons exist', async ({ page }) => {
    await page.goto('/');

    // Check category filter section
    await expect(page.locator('h2').filter({ hasText: '精选教程' })).toBeVisible();

    // Check filter buttons exist
    const filterButtons = page.locator('button:has-text("全部"), button:has-text("快速入门"), button:has-text("工作效率")');
    await expect(filterButtons.first()).toBeVisible();
  });

  test('footer is displayed', async ({ page }) => {
    await page.goto('/');

    // Check footer
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('text=© 2026 OpenClaw 实战指南')).toBeVisible();
  });

  test('no console errors on page load', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');

    // Wait a bit for any delayed errors
    await page.waitForTimeout(2000);

    expect(errors).toHaveLength(0);
  });

  test('responsive design works', async ({ page }) => {
    await page.goto('/');

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1').filter({ hasText: 'OpenClaw 实战指南' }).first()).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('h1').filter({ hasText: 'OpenClaw 实战指南' }).first()).toBeVisible();
  });
});
