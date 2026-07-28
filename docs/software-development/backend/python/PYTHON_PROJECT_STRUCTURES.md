# Python Project Structures

Directory layouts for Python projects, from a script to a service — and when each is right.

## Decision Table

| Project | Structure |
|---------|-----------|
| Script / one-off tool | Single module + pyproject |
| Library / package | src layout |
| CLI application | src layout + entry points |
| Web API | FastAPI/Django layout |
| Data / ML project | Data-science layout |

Same bias as [PHP](../php/PHP_PROJECT_STRUCTURES.md): start one level simpler than you think you need.

## 1. Script + pyproject (tools)

```
tool/
├── tool.py
├── pyproject.toml
└── README.md
```

Even one-file tools get `pyproject.toml` — it pins dependencies and makes the tool installable (`pipx install .`).

## 2. src Layout (libraries & apps — the default)

The modern standard; keeps the package unimportable from the repo root so tests hit the *installed* code:

```
package/
├── src/
│   └── package_name/
│       ├── __init__.py
│       ├── core.py
│       └── py.typed          # ships type hints
├── tests/
│   ├── conftest.py
│   └── test_core.py
├── pyproject.toml
├── README.md
└── LICENSE
```

```toml
# pyproject.toml — one file for everything
[project]
name = "package-name"
version = "1.0.0"
requires-python = ">=3.11"
dependencies = ["httpx>=0.27"]

[project.scripts]
package-cli = "package_name.cli:main"    # CLI entry point

[tool.ruff]
line-length = 100

[tool.pytest.ini_options]
testpaths = ["tests"]
```

## 3. FastAPI Service

```
service/
├── src/app/
│   ├── main.py               # FastAPI() instance + router includes
│   ├── api/
│   │   ├── deps.py           # shared dependencies (auth, db session)
│   │   └── routes/
│   │       ├── health.py
│   │       └── orders.py
│   ├── core/
│   │   ├── config.py         # pydantic-settings, reads env
│   │   └── security.py
│   ├── models/               # SQLAlchemy / SQLModel
│   ├── schemas/              # Pydantic request/response models
│   └── services/             # business logic — framework-free
├── tests/
├── alembic/                  # migrations
├── pyproject.toml
└── Dockerfile
```

Rules mirror the [PHP service rules](../php/PHP_PROJECT_STRUCTURES.md): routes thin (validate → delegate → respond), business logic in `services/` with no framework imports, schemas separate from ORM models.

## 4. Django Default

Convention over invention — don't fight `startproject`:

```
project/
├── manage.py
├── config/                   # rename the settings package to 'config'
│   ├── settings/
│   │   ├── base.py
│   │   ├── dev.py
│   │   └── production.py
│   └── urls.py
├── apps/
│   ├── orders/               # one app per domain
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── services.py       # add: business logic out of views
│   │   ├── urls.py
│   │   └── tests/
│   └── users/
└── pyproject.toml
```

Split settings by environment; apps stay small and domain-shaped (the modular-monolith instinct).

## 5. Data / ML Layout

```
analysis/
├── data/
│   ├── raw/                  # immutable, never edited
│   └── processed/            # generated, reproducible
├── notebooks/                # numbered: 01-explore.ipynb
├── src/analysis/             # extracted, tested functions
├── models/                   # trained artifacts (gitignored or DVC)
├── pyproject.toml
└── Makefile                  # make data / train / evaluate
```

The rule that keeps it honest: **notebooks explore, `src/` ships.** Anything run twice gets extracted into a tested function.

## Universal Rules

- `pyproject.toml` is the single config home (deps, tools, entry points) — no `setup.py`, no scattered `.cfg`
- Virtual environment per project (`uv venv` / `python -m venv .venv`), never global installs
- Lock dependencies: `uv lock` / `pip-compile` — the lockfile is committed
- `tests/` mirrors `src/`; `conftest.py` holds shared fixtures
- Type hints on public APIs; `py.typed` marker in libraries

## See Also

- [Python Coding Styles](PYTHON_CODING_STYLES.md)
- [Python Frameworks](PYTHON_FRAMEWORKS.md)
- [PHP Project Structures](../php/PHP_PROJECT_STRUCTURES.md) — same philosophy, different runtime
- [File Structure](../../../github/FILE_STRUCTURE.md)
