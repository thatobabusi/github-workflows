# Code Quality Standards

Testing, linting, and analysis requirements for all projects. Quality is enforced by automation, not discipline.

## The Quality Stack

```
Layer 4: E2E tests          (user flows work)
Layer 3: Feature tests      (endpoints/pages behave)
Layer 2: Unit tests         (logic is correct)
Layer 1: Static analysis    (types & contracts hold)
Layer 0: Linting            (style & structure consistent)
```

Every layer runs in CI. Layers 0–1 run as a [gate before deployment](LINTING_GATES.md).

## Testing Standards

### Directory Structure

```
tests/
├── Unit/           # Pure logic, no framework boot
├── Feature/        # HTTP, database, framework integration
└── e2e/            # Browser automation (Playwright)
```

### Unit Tests

Test pure logic in isolation:

```php
public function test_price_addition_rejects_mixed_currencies()
{
    $usd = new Price(10.00, 'USD');
    $zar = new Price(180.00, 'ZAR');

    $this->expectException(CurrencyMismatchException::class);
    $usd->add($zar);
}
```

### Feature Tests

Test behavior through the framework:

```php
public function test_guest_cannot_create_post()
{
    $response = $this->post('/posts', ['title' => 'Test']);
    $response->assertRedirect('/login');
    $this->assertDatabaseMissing('posts', ['title' => 'Test']);
}
```

### E2E Tests (Playwright)

Cover the **full scope of frontend functionality** — not just happy paths. The laravel-13-cheat-sheet suite grew from 17 to 50+ tests by covering:

| Suite | What It Verifies |
|-------|------------------|
| Header & Navigation | Sticky header, brand link, controls |
| Theming | Toggle, persistence via localStorage, both modes render |
| Sidebar | Section collapse/expand, link navigation, active states |
| Content | Markdown rendering, code blocks, syntax highlighting |
| Search | Filtering, empty states, keyboard shortcut (Ctrl+K) |
| Responsive | Mobile (375px), tablet (768px), desktop (1280px) |
| Accessibility | Keyboard navigation, ARIA labels, focus management |
| Error Handling | Missing files, broken links, rapid navigation |
| Workflows | Multi-step user journeys end to end |

```typescript
test('theme persists across reload', async ({ page }) => {
    await page.goto('/');
    await page.click('#themeToggle');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});
```

### Test Naming

- Describe behavior, not implementation: `test_expired_token_is_rejected` not `test_token_check`
- One assertion concept per test
- Arrange-Act-Assert structure

## Coverage Requirements

| Project Type | Minimum Coverage |
|--------------|------------------|
| Libraries / packages | 90% |
| Applications | 80% |
| Prototypes / spikes | Tests for core logic only |

```bash
# PHP
php artisan test --coverage --min=80

# JS
npx vitest run --coverage
```

Coverage is a floor, not a target. 100% coverage of trivial code is worth less than 80% coverage that includes edge cases.

## Static Analysis

### PHP — PHPStan / Larastan

```neon
# phpstan.neon
parameters:
    level: 8
    paths:
        - app
        - config
```

New projects start at level 8. Legacy projects start where they pass and ratchet up one level per sprint (use `--generate-baseline` to freeze existing debt).

### TypeScript

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true
  }
}
```

CI runs `tsc --noEmit` as part of the lint gate.

## Linting

Full linting standards, configs per stack, and hard-won gotchas live in [Linting Gates](LINTING_GATES.md). Summary:

- Every project has a `lint` script that runs all linters
- Linting is a **required CI check** — failing lint blocks merge and deploy
- Rules are pragmatic: relax rules that fight working code, document why

## Matrix Testing

Test against every supported runtime version:

```yaml
strategy:
  matrix:
    php: ['8.2', '8.3', '8.4']
    laravel: ['11.*', '12.*']
```

See [tests.yml](../templates/.github/workflows/tests.yml) for the full template.

## Mocking & Fakes

Prefer framework fakes over hand-rolled mocks:

```php
Notification::fake();
Http::fake(['api.example.com/*' => Http::response(['ok' => true])]);
Queue::fake();
Storage::fake('s3');

// Then assert
Notification::assertSentTo($user, WelcomeNotification::class);
```

## Definition of Done

Code is done when:

- [ ] Feature works as specified
- [ ] Unit + feature tests written and passing
- [ ] E2E coverage for user-facing changes
- [ ] Lint suite passes locally (`npm run lint` / `composer lint`)
- [ ] Static analysis passes
- [ ] Coverage floor maintained
- [ ] Documentation updated

## See Also

- [Linting Gates](LINTING_GATES.md)
- [Quality Gates](QUALITY_GATES.md)
- [Pull Request Process](PULL_REQUEST_PROCESS.md)
