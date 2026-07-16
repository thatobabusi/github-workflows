# PHP Coding Styles

The PSR standards that matter, the tools that enforce them, and house conventions on top.

## The PSRs You Actually Use

| PSR | Covers | Status |
|-----|--------|--------|
| **PSR-1** | Basic coding standard (tags, naming, side effects) | Foundation |
| **PSR-4** | Autoloading — namespace ↔ path mapping | Universal |
| **PSR-12** | Extended coding style (supersedes PSR-2) | The style baseline |
| PSR-3 | Logger interface | Use via framework |
| PSR-7/15 | HTTP messages / middleware | Slim, Laminas ecosystems |
| PSR-11 | Container interface | Interop |
| PER-CS | Living successor to PSR-12 | Where Pint/CS-Fixer track |

## PSR-12 Essentials

```php
<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Order;
use App\Support\Money;

final class OrderTotals
{
    public function __construct(
        private readonly TaxCalculator $tax,
    ) {
    }

    public function total(Order $order): Money
    {
        $subtotal = $order->lines->sum(fn ($line) => $line->amount);

        return $this->tax->apply(new Money($subtotal, $order->currency));
    }
}
```

- 4 spaces, no tabs; lines soft-capped at 120
- One class per file; `declare(strict_types=1)` at the top of every file
- Opening brace: same line for control structures, next line for classes/methods
- Imports: one `use` per line, alphabetized, no unused imports
- Visibility declared on everything; `final` by default, open deliberately

## Naming Conventions

| Thing | Style | Example |
|-------|-------|---------|
| Classes, interfaces, enums | PascalCase | `InvoiceGenerator` |
| Methods, variables | camelCase | `calculateTotal()` |
| Constants, enum cases (const style) | SCREAMING_SNAKE | `MAX_RETRIES` |
| Config/array keys, DB columns | snake_case | `created_at` |
| Interfaces | No `Interface` suffix when natural | `Repository`, not `RepositoryInterface`* |

*House rule — pick one and be consistent; Laravel core uses contracts namespaces instead of suffixes.

Suffix by role, consistently: `*Controller`, `*Request`, `*Resource`, `*Service`, `*Repository`, `*Job`, `*Event`, `*Listener`, `*Policy`, `*Factory`, `*Seeder`, `*Test`.

## Modern PHP Defaults (8.2+)

Reach for these before the old forms:

```php
// Constructor property promotion + readonly
public function __construct(
    private readonly PostRepository $posts,
) {}

// Enums over class constants
enum OrderStatus: string
{
    case Pending = 'pending';
    case Shipped = 'shipped';
}

// Match over switch
$label = match ($status) {
    OrderStatus::Pending => 'Awaiting payment',
    OrderStatus::Shipped => 'On the way',
};

// Named arguments for boolean/optional soup
$this->export(format: 'csv', includeHeaders: true);

// First-class callables, arrow functions
$ids = array_map(fn (Order $o) => $o->id, $orders);

// Nullsafe over nested isset
$city = $user?->address?->city;
```

Type everything: parameters, returns (`: void` included), properties. Untyped is a code smell needing justification.

## Enforcement Toolchain

| Tool | Role | Command |
|------|------|---------|
| **Laravel Pint** | Formatter (PSR-12/PER preset) | `vendor/bin/pint` / `--test` in CI |
| **PHP-CS-Fixer** | Same job outside Laravel | `php-cs-fixer fix` |
| **PHPStan/Larastan** | Static analysis | `phpstan analyse` (level 8 target) |
| **Rector** | Automated upgrades/refactors | `rector process` |

```json
// pint.json — start from a preset, deviate sparingly and explicitly
{
    "preset": "psr12",
    "rules": {
        "declare_strict_types": true,
        "ordered_imports": { "sort_algorithm": "alpha" }
    }
}
```

Style is enforced by the [lint gate](../../../LINTING_GATES.md), never by review comments — humans review behavior, machines review style.

## Docblocks

Types in signatures made most docblocks noise. Keep docblocks only where they add information the signature can't express:

```php
/** @return Collection<int, Order> */
public function pendingOrders(): Collection

/** @throws PaymentDeclinedException */
public function charge(Money $amount): Payment
```

Never write `@param string $name The name` — that's the signature repeated in prose.

## House Rules

- Early returns over nested conditionals; guard clauses first
- No `else` after a returning `if`
- Small classes: a `Service` doing five unrelated things is five services
- `final class` unless designed for extension
- Money as integer cents in a value object — never floats ([Design Patterns](../../../DESIGN_PATTERNS.md))
- Comments explain **why**; the code explains what

## See Also

- [PHP Project Structures](PHP_PROJECT_STRUCTURES.md)
- [PHP Design Patterns](PHP_DESIGN_PATTERNS.md)
- [Code Quality](../../../CODE_QUALITY.md)
