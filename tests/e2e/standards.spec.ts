import { test, expect, Page } from '@playwright/test';

const CATEGORIES = [
  '📌 Core Standards',
  '✅ Quality & Gates',
  '🏗️ Architecture',
  '🚀 Operations',
  '🛠️ Project Setup',
  '💡 Tips & Tricks',
];

const TOTAL_DOCS = 19;

/** Expand a sidebar section by its title text (sections start collapsed). */
async function expandSection(page: Page, title: string) {
  const section = page.locator('.sidebar-section', {
    has: page.locator('.sidebar-title', { hasText: title }),
  });
  await section.locator('.sidebar-title').click();
  await expect(section).not.toHaveClass(/collapsed/);
  return section;
}

/** Open a doc through the real user path: expand its section, click its link. */
async function openDoc(page: Page, sectionTitle: string, docName: string) {
  const section = await expandSection(page, sectionTitle);
  await section.locator('.sidebar-link', { hasText: docName }).click();
  await expect(page.locator('#fileView')).toHaveClass(/active/);
}

test.describe('GitHub Workflows Standards Site - Full Scope', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // Header & UI Tests
  test.describe('Header & Navigation', () => {
    test('should load the main page with title and header', async ({ page }) => {
      await expect(page).toHaveTitle(/GitHub Workflows/);
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('.header-brand')).toContainText('GitHub Workflows');
    });

    test('should have sticky header that persists while scrolling', async ({ page }) => {
      const header = page.locator('header');
      const initialPosition = await header.evaluate(el => el.getBoundingClientRect().top);

      await page.evaluate(() => window.scrollBy(0, 500));

      const scrolledPosition = await header.evaluate(el => el.getBoundingClientRect().top);
      expect(scrolledPosition).toBe(initialPosition);
    });

    test('should have search input with proper placeholder', async ({ page }) => {
      const searchInput = page.locator('#searchInput');
      await expect(searchInput).toBeVisible();
      await expect(searchInput).toHaveAttribute('placeholder', /Search standards/);
    });

    test('should have theme toggle button', async ({ page }) => {
      const themeToggle = page.locator('#themeToggle');
      await expect(themeToggle).toBeVisible();
      await expect(themeToggle).toContainText(/🌙|☀️/);
    });
  });

  // Theme Mode Tests
  test.describe('Light/Dark Mode', () => {
    test('should default to dark theme', async ({ page }) => {
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    });

    test('should toggle between dark and light theme', async ({ page }) => {
      const themeToggle = page.locator('#themeToggle');
      const html = page.locator('html');

      await expect(html).toHaveAttribute('data-theme', 'dark');

      await themeToggle.click();
      await expect(html).toHaveAttribute('data-theme', 'light');

      await themeToggle.click();
      await expect(html).toHaveAttribute('data-theme', 'dark');
    });

    test('should update theme icon when toggling', async ({ page }) => {
      const themeToggle = page.locator('#themeToggle');

      // Dark theme shows the sun (switch-to-light affordance)
      await expect(themeToggle).toHaveText('☀️');

      await themeToggle.click();
      await expect(themeToggle).toHaveText('🌙');
    });

    test('should persist theme preference across pages', async ({ page, context }) => {
      await page.locator('#themeToggle').click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

      const newPage = await context.newPage();
      await newPage.goto('/');
      await expect(newPage.locator('html')).toHaveAttribute('data-theme', 'light');
    });
  });

  // Sidebar Navigation Tests
  test.describe('Sidebar Navigation', () => {
    test('should display all 6 category sections in sidebar', async ({ page }) => {
      await expect(page.locator('.sidebar-section')).toHaveCount(CATEGORIES.length);
    });

    test('should start with all sections collapsed', async ({ page }) => {
      const collapsed = page.locator('.sidebar-section.collapsed');
      await expect(collapsed).toHaveCount(CATEGORIES.length);
    });

    test('should expand a section on title click without affecting others', async ({ page }) => {
      await expandSection(page, 'Quality & Gates');

      await expect(page.locator('.sidebar-section.collapsed'))
        .toHaveCount(CATEGORIES.length - 1);
    });

    test('should collapse an expanded section on second click', async ({ page }) => {
      const section = await expandSection(page, 'Core Standards');
      await section.locator('.sidebar-title').click();
      await expect(section).toHaveClass(/collapsed/);
    });

    test('should navigate to a doc via sidebar link', async ({ page }) => {
      await openDoc(page, 'Core Standards', 'Branching Strategy');

      await expect(page.locator('#fileContent')).toBeVisible();
      await expect(page.locator('#fileContent h1')).toContainText(/Branching Strategy/i);
    });

    test('should mark the open doc as active in the sidebar', async ({ page }) => {
      await openDoc(page, 'Quality & Gates', 'Linting Gates');

      await expect(page.locator('.sidebar-link.active')).toHaveText('Linting Gates');
    });

    test('should load all Tips & Tricks docs from sidebar', async ({ page }) => {
      // Sidebar name -> expected H1 (doc titles may differ from link names)
      const docs: Array<[string, RegExp]> = [
        ['Git Tips & Tricks', /Git Tips/i],
        ['Actions Advanced', /Advanced Usage/i],
        ['Nice to Know', /Nice to Know/i],
      ];
      const section = await expandSection(page, 'Tips & Tricks');

      for (const [name, heading] of docs) {
        await section.locator('.sidebar-link', { hasText: name }).click();
        await expect(page.locator('#fileView')).toHaveClass(/active/);
        await expect(page.locator('#fileContent h1').first()).toContainText(heading);
      }
    });
  });

  // Category Card Navigation Tests
  test.describe('Category Card Navigation', () => {
    test('should display all 6 category cards on home view', async ({ page }) => {
      await expect(page.locator('#homeGrid .category-card')).toHaveCount(CATEGORIES.length);
    });

    test('should show total doc counts on the home cards', async ({ page }) => {
      const counts = await page.locator('#homeGrid .category-card-count').allTextContents();
      const total = counts.reduce((sum, text) => sum + parseInt(text, 10), 0);
      expect(total).toBe(TOTAL_DOCS);
    });

    test('should navigate to category view when card clicked', async ({ page }) => {
      await page.locator('#homeGrid .category-card').first().click();

      await expect(page.locator('#categoryView')).toHaveClass(/active/);
      await expect(page.locator('#categoryGrid .category-card').first()).toBeVisible();
    });

    test('should load file when category file card clicked', async ({ page }) => {
      await page.locator('#homeGrid .category-card').first().click();
      await page.locator('#categoryGrid .category-card').first().click();

      await expect(page.locator('#fileView')).toHaveClass(/active/);
      await expect(page.locator('#fileContent')).toBeVisible();
    });

    test('should navigate all 6 categories', async ({ page }) => {
      for (const category of CATEGORIES) {
        const card = page.locator('#homeGrid .category-card', { hasText: category });
        await card.click();
        await expect(page.locator('#categoryView')).toHaveClass(/active/);
        await page.locator('.header-brand').click();
        await expect(page.locator('#homeView')).toHaveClass(/active/);
      }
    });
  });

  // Content Display Tests
  test.describe('Content Display & Markdown', () => {
    test('should render markdown headings correctly', async ({ page }) => {
      await openDoc(page, 'Quality & Gates', 'Linting Gates');

      await expect(page.locator('#fileContent h1')).toBeVisible();
      await expect(page.locator('#fileContent h2').first()).toBeVisible();
    });

    test('should render code blocks with language labels', async ({ page }) => {
      await openDoc(page, 'Quality & Gates', 'Linting Gates');

      const codeBlocks = page.locator('#fileContent .code-block');
      expect(await codeBlocks.count()).toBeGreaterThan(0);
      await expect(codeBlocks.first().locator('.code-label')).toBeVisible();
    });

    test('should render markdown tables', async ({ page }) => {
      await openDoc(page, 'Tips & Tricks', 'Nice to Know');

      const tables = page.locator('#fileContent .table-wrap table');
      expect(await tables.count()).toBeGreaterThan(0);
      await expect(tables.first().locator('th').first()).toBeVisible();
    });

    test('should display lists and paragraphs correctly', async ({ page }) => {
      await openDoc(page, 'Core Standards', 'Commit Standards');

      await expect(page.locator('#fileContent ul, #fileContent ol').first()).toBeVisible();
      await expect(page.locator('#fileContent p').first()).toBeVisible();
    });

    test('should render inline code formatting', async ({ page }) => {
      await openDoc(page, 'Tips & Tricks', 'Git Tips & Tricks');

      await expect(page.locator('#fileContent code').first()).toBeVisible();
    });

    test('should navigate between docs via internal See Also links', async ({ page }) => {
      await openDoc(page, 'Quality & Gates', 'Linting Gates');

      // See Also links carry data-doc and navigate in-app
      const internalLink = page.locator('#fileContent a[data-doc]').first();
      await internalLink.scrollIntoViewIfNeeded();
      await internalLink.click();

      await expect(page.locator('#fileView')).toHaveClass(/active/);
      await expect(page.locator('#fileContent h1')).toBeVisible();
    });

    test('should build a table of contents from headings', async ({ page }) => {
      await openDoc(page, 'Architecture', 'Design Patterns');

      const tocItems = page.locator('#tocList .toc-item');
      expect(await tocItems.count()).toBeGreaterThan(3);
    });
  });

  // Search Tests
  test.describe('Search Functionality', () => {
    test('should search and filter results', async ({ page }) => {
      await page.locator('#searchInput').fill('lint');

      await expect(page.locator('#searchView')).toHaveClass(/active/);
      const results = page.locator('#searchResults .category-card');
      expect(await results.count()).toBeGreaterThan(0);
      await expect(results.first()).toContainText(/Lint/i);
    });

    test('should navigate to doc from search result', async ({ page }) => {
      await page.locator('#searchInput').fill('deployment');
      await page.locator('#searchResults .category-card').first().click();

      await expect(page.locator('#fileView')).toHaveClass(/active/);
      await expect(page.locator('#fileContent')).toBeVisible();
    });

    test('should clear search and return to home', async ({ page }) => {
      const searchInput = page.locator('#searchInput');
      await searchInput.fill('git');
      await expect(page.locator('#searchView')).toHaveClass(/active/);

      await searchInput.clear();
      await searchInput.press('a');
      await searchInput.press('Backspace');
      await expect(page.locator('#homeView')).toHaveClass(/active/);
    });

    test('should show empty state when no search results', async ({ page }) => {
      await page.locator('#searchInput').fill('xyznonexistent123');

      await expect(page.locator('#emptyView')).toHaveClass(/active/);
    });
  });

  // Navigation & Back Button Tests
  test.describe('Navigation Controls', () => {
    test('should show back button when viewing file', async ({ page }) => {
      await openDoc(page, 'Operations', 'Deployment Guide');

      await expect(page.locator('#fileView .back-button')).toBeVisible();
    });

    test('should return to home when back button clicked', async ({ page }) => {
      await openDoc(page, 'Operations', 'Deployment Guide');

      await page.locator('#fileView .back-button').click();
      await expect(page.locator('#homeView')).toHaveClass(/active/);
    });

    test('should navigate back from category view', async ({ page }) => {
      await page.locator('#homeGrid .category-card').first().click();

      await page.locator('#categoryView .back-button').click();
      await expect(page.locator('#homeView')).toHaveClass(/active/);
    });

    test('should allow header brand click to return home', async ({ page }) => {
      await openDoc(page, 'Project Setup', 'File Structure');

      await page.locator('.header-brand').click();
      await expect(page.locator('#homeView')).toHaveClass(/active/);
    });
  });

  // Responsive Design Tests
  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });

      await expect(page.locator('#searchInput')).toBeVisible();
      await expect(page.locator('#homeGrid .category-card').first()).toBeVisible();
    });

    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      await expect(page.locator('#searchInput')).toBeVisible();
      await expect(page.locator('#homeGrid .category-card').first()).toBeVisible();
    });

    test('should work on desktop viewport with sidebar', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });

      await expect(page.locator('.sidebar')).toBeVisible();
      await expect(page.locator('#homeGrid .category-card').first()).toBeVisible();
    });

    test('should hide TOC sidebar below 1200px', async ({ page }) => {
      await page.setViewportSize({ width: 1100, height: 800 });
      await expect(page.locator('.toc-sidebar')).toBeHidden();

      await page.setViewportSize({ width: 1400, height: 800 });
      await expect(page.locator('.toc-sidebar')).toBeVisible();
    });

    test('should navigate to content on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });

      await page.locator('#homeGrid .category-card').first().click();
      await page.locator('#categoryGrid .category-card').first().click();

      await expect(page.locator('#fileContent')).toBeVisible();
    });
  });

  // Accessibility Tests
  test.describe('Accessibility & Keyboard', () => {
    test('should support keyboard shortcut to focus search (Ctrl+K)', async ({ page }) => {
      await page.keyboard.press('Control+k');

      await expect(page.locator('#searchInput')).toBeFocused();
    });

    test('should have proper heading hierarchy in docs', async ({ page }) => {
      await openDoc(page, 'Core Standards', 'Release Standards');

      await expect(page.locator('#fileContent h1')).toBeVisible();
    });

    test('scroll-to-top button should have an accessible label', async ({ page }) => {
      await expect(page.locator('#scrollToTop')).toHaveAttribute('aria-label', /scroll to top/i);
    });
  });

  // Scroll-to-Top Tests
  test.describe('Scroll to Top', () => {
    test('should appear after scrolling and return to top on click', async ({ page }) => {
      await openDoc(page, 'Tips & Tricks', 'Actions Advanced');

      const button = page.locator('#scrollToTop');
      await expect(button).toBeHidden();

      await page.evaluate(() => window.scrollTo(0, 800));
      await expect(button).toBeVisible();

      await button.click();
      await page.waitForFunction(() => window.scrollY === 0);
      await expect(button).toBeHidden();
    });
  });

  // Performance & Error Handling Tests
  test.describe('Error Handling & Performance', () => {
    test('should load docs without JavaScript errors', async ({ page }) => {
      const jsErrors: string[] = [];
      page.on('pageerror', error => {
        jsErrors.push(error.message);
      });

      await openDoc(page, 'Quality & Gates', 'Code Quality');
      await openDoc(page, 'Tips & Tricks', 'Nice to Know');

      expect(jsErrors).toHaveLength(0);
    });

    test('should perform rapid navigation without issues', async ({ page }) => {
      for (let i = 0; i < 3; i++) {
        await page.locator('#homeGrid .category-card').first().click();
        await page.locator('#categoryGrid .category-card').first().click();
        await page.locator('#fileView .back-button').click();
      }

      await expect(page.locator('#homeView')).toHaveClass(/active/);
    });
  });

  // Integration Tests
  test.describe('Full User Workflows', () => {
    test('should complete full journey: search -> view -> back -> browse', async ({ page }) => {
      // 1. Search
      await page.locator('#searchInput').fill('quality');
      await expect(page.locator('#searchView')).toHaveClass(/active/);

      // 2. Open a result
      await page.locator('#searchResults .category-card').first().click();
      await expect(page.locator('#fileContent')).toBeVisible();

      // 3. Back home
      await page.locator('#fileView .back-button').click();
      await expect(page.locator('#homeView')).toHaveClass(/active/);

      // 4. Browse via sidebar
      await openDoc(page, 'Architecture', 'API Standards');
      await expect(page.locator('#fileContent h1')).toContainText(/API Standards/i);
    });

    test('should open every doc in every category without errors', async ({ page }) => {
      const jsErrors: string[] = [];
      page.on('pageerror', error => {
        jsErrors.push(error.message);
      });

      for (const category of CATEGORIES) {
        await page.locator('.header-brand').click();
        await page.locator('#homeGrid .category-card', { hasText: category }).click();

        const count = await page.locator('#categoryGrid .category-card').count();
        for (let i = 0; i < count; i++) {
          await page.locator('#categoryGrid .category-card').nth(i).click();
          // Some docs legitimately contain multiple H1s (e.g. heading examples)
          await expect(page.locator('#fileContent h1').first()).toBeVisible();
          await expect(page.locator('#fileContent')).not.toContainText('Error loading document');
          await page.locator('#fileView .back-button').click();
          await page.locator('#homeGrid .category-card', { hasText: category }).click();
        }
      }

      expect(jsErrors).toHaveLength(0);
    });
  });
});
