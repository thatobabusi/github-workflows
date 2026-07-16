# Python Coding Styles

PEP 8 as the floor, modern tooling as the enforcement, type hints as the contract.

## The Standards

| Standard | Covers |
|----------|--------|
| **PEP 8** | Layout, naming, whitespace — the baseline |
| **PEP 484/604** | Type hints (`int | None` unions since 3.10) |
| **PEP 257** | Docstring conventions |
| **PEP 621** | Project metadata in pyproject.toml |

## Naming

| Thing | Style | Example |
|-------|-------|---------|
| Modules, packages | short_snake | `order_service.py` |
| Functions, variables | snake_case | `calculate_total()` |
| Classes, exceptions | PascalCase | `InvoiceGenerator`, `PaymentError` |
| Constants | SCREAMING_SNAKE | `MAX_RETRIES` |
| "Private" | leading underscore | `_internal_helper()` |

## Modern Defaults (3.11+)

```python
from dataclasses import dataclass
from enum import StrEnum


class OrderStatus(StrEnum):
    PENDING = "pending"
    SHIPPED = "shipped"


@dataclass(frozen=True, slots=True)
class Price:
    cents: int
    currency: str = "ZAR"

    def __post_init__(self) -> None:
        if self.cents < 0:
            raise ValueError("Price cannot be negative")

    def add(self, other: "Price") -> "Price":
        if self.currency != other.currency:
            raise ValueError("Currency mismatch")
        return Price(self.cents + other.cents, self.currency)


def label_for(status: OrderStatus) -> str:
    match status:
        case OrderStatus.PENDING:
            return "Awaiting payment"
        case OrderStatus.SHIPPED:
            return "On the way"
```

Reach-for-first list:

- `dataclass(frozen=True, slots=True)` for value objects (the [Money rule](../php/PHP_DESIGN_PATTERNS.md) applies here too — integer cents)
- `StrEnum`/`IntEnum` over string constants
- `match` for shape-based dispatch
- f-strings always; `pathlib.Path` over `os.path`; context managers over manual cleanup
- Comprehensions until they need two lines of logic — then a named function

## Type Hints

Public APIs are fully typed; internals typed wherever inference isn't obvious:

```python
def fetch_orders(
    user_id: int,
    *,
    status: OrderStatus | None = None,
    limit: int = 50,
) -> list[Order]: ...
```

- Builtins as generics (`list[str]`, `dict[str, int]`) — no `typing.List`
- `X | None` over `Optional[X]`; explicit `-> None` on procedures
- Keyword-only (`*,`) for boolean/optional soup — same intent as PHP named arguments
- `Protocol` for structural interfaces; `TypedDict` for shaped dicts crossing boundaries

## Enforcement Toolchain

| Tool | Role | Replaces |
|------|------|----------|
| **ruff** | Linter + formatter, Rust-fast | flake8, isort, black, pyupgrade |
| **mypy** (or pyright) | Type checking | — |
| **pytest** | Testing | unittest boilerplate |
| **uv** | Env + packaging + locking | pip, venv, pip-tools, pipx |

```toml
[tool.ruff]
line-length = 100
target-version = "py311"

[tool.ruff.lint]
select = ["E", "F", "I", "UP", "B", "SIM"]   # errors, imports, upgrades, bugbear, simplify

[tool.mypy]
strict = true
```

Same [lint-gate doctrine](../../../LINTING_GATES.md) as every stack: `ruff check` + `ruff format --check` + `mypy` run locally and as required CI checks; humans never review style.

## Docstrings

Signature carries the types; the docstring carries the *why* and the contract:

```python
def reconcile(ledger: Ledger, statement: Statement) -> list[Discrepancy]:
    """Match ledger entries against the bank statement.

    Entries within 3 days and R1.00 are considered matched
    (bank posting delays make exact matching useless).
    """
```

One-line docstrings for the obvious; never restate parameters the signature already types.

## Idiom Corrections

| Smell | Fix |
|-------|-----|
| `except Exception: pass` | Catch the specific exception; log it |
| Mutable default (`def f(x=[])`) | `x: list | None = None` + guard |
| `type(x) == SomeClass` | `isinstance(x, SomeClass)` |
| Dict-of-doom passed everywhere | `dataclass` or `TypedDict` |
| `import *` | Explicit imports, always |
| Bare `assert` for runtime validation | Raise real exceptions (`assert` vanishes under `-O`) |

## See Also

- [Python Project Structures](PYTHON_PROJECT_STRUCTURES.md)
- [Python Frameworks](PYTHON_FRAMEWORKS.md)
- [Code Quality](../../../CODE_QUALITY.md)
