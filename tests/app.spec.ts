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

  // ============ Phase 6: 配置分享功能测试 ============
  test('configs page displays share button', async ({ page }) => {
    await page.goto('/configs');

    // Check page loaded (h1 contains Agent 配置)
    await expect(page.locator('h1').filter({ hasText: 'Agent 配置' })).toBeVisible();

    // Check share config button exists
    const shareButton = page.locator('button:has-text("分享配置")');
    await expect(shareButton).toBeVisible();

    // Check share section description
    await expect(page.locator('text=创建了有用的 Agent 配置？')).toBeVisible();
  });

  test('config submission dialog opens and closes', async ({ page }) => {
    await page.goto('/configs');

    // Click share button
    await page.click('button:has-text("分享配置")');

    // Check dialog opens
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Check dialog title
    await expect(page.locator('text=分享你的 Agent 配置')).toBeVisible();

    // Check form fields exist
    await expect(page.locator('input#name')).toBeVisible();
    await expect(page.locator('textarea#description')).toBeVisible();
    await expect(page.locator('input#author')).toBeVisible();
    // shadcn Select uses data-slot="select-trigger"
    await expect(page.locator('[data-slot="select-trigger"]')).toBeVisible();
    await expect(page.locator('textarea#configJson')).toBeVisible();

    // Close dialog by clicking cancel
    await page.click('button:has-text("取消")');
    await expect(dialog).not.toBeVisible();
  });

  test('config submission form validation works', async ({ page }) => {
    await page.goto('/configs');

    // Open dialog
    await page.click('button:has-text("分享配置")');

    // Check form exists
    const nameInput = page.locator('input#name');
    await expect(nameInput).toBeVisible();

    // Fill in valid data
    await nameInput.fill('测试配置');
    await page.locator('textarea#description').fill('这是一个测试配置描述');
    await page.locator('input#author').fill('测试作者');

    // Fill JSON content
    await page.locator('textarea#configJson').fill(JSON.stringify({
      name: 'Test Config',
      instructions: 'Test instructions'
    }, null, 2));

    // Verify form fields have values
    await expect(nameInput).toHaveValue('测试配置');
    await expect(page.locator('textarea#description')).toHaveValue('这是一个测试配置描述');
  });

  test('config cards display correctly', async ({ page }) => {
    await page.goto('/configs');

    // Check config categories are displayed (first occurrence)
    await expect(page.locator('h2').filter({ hasText: '开发辅助' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: '工作效率' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: '学习教学' })).toBeVisible();

    // Check config cards exist
    const configCards = page.locator('[data-slot="card"]');
    const count = await configCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('config search functionality works', async ({ page }) => {
    await page.goto('/configs');

    // Check search input exists (use placeholder to find the specific one)
    const searchInput = page.locator('input[placeholder*="搜索配置"]');
    await expect(searchInput).toBeVisible();

    // Type in search and verify
    await searchInput.click();
    await searchInput.pressSequentially('代码审查');

    // Wait for filter to apply
    await page.waitForTimeout(500);

    // Verify input value
    const value = await searchInput.inputValue();
    expect(value).toBe('代码审查');
  });

  test('config category filter works', async ({ page }) => {
    await page.goto('/configs');

    // Find filter buttons by their text
    const allButton = page.locator('button').filter({ hasText: /^全部$/ });
    const devButton = page.locator('button').filter({ hasText: /^开发辅助$/ });

    // Click on different category filters
    await allButton.click();
    await expect(allButton).toBeVisible();

    await devButton.click();
    await expect(devButton).toBeVisible();
  });
});
