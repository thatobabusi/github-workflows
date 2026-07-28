# File Structure Standards

Consistent directory organization across all projects for easy navigation and maintenance.

## PHP/Laravel Projects

```
project-name/
├── .github/
│   ├── workflows/                    # GitHub Actions workflows
│   │   ├── tests.yml
│   │   ├── static-analysis.yml
│   │   ├── release.yml
│   │   └── dependabot-auto-merge.yml
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── config.yml
│   ├── pull_request_template.md
│   ├── dependabot.yml
│   └── CODE_OF_CONDUCT.md
│
├── docs/                             # Documentation
│   ├── BRANCHING_STRATEGY.md
│   ├── COMMIT_STANDARDS.md
│   ├── RELEASE_STANDARDS.md
│   ├── CHANGELOG.md
│   ├── CONTRIBUTING.md
│   ├── guides/
│   │   ├── installation.md
│   │   ├── configuration.md
│   │   └── troubleshooting.md
│   └── api/                          # API documentation (if applicable)
│
├── src/                              # Source code
│   ├── Models/                       # Eloquent models
│   ├── Controllers/
│   ├── Services/
│   ├── Repositories/
│   ├── Exceptions/
│   ├── Traits/
│   ├── Middleware/
│   ├── Jobs/
│   ├── Events/
│   ├── Listeners/
│   └── Providers/
│
├── config/                           # Configuration files
│   └── package-name.php
│
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── factories/
│
├── routes/                           # Route definitions
│   ├── web.php
│   └── api.php
│
├── resources/                        # Frontend resources (if applicable)
│   ├── views/
│   └── css/
│
├── tests/
│   ├── Unit/                         # Unit tests
│   │   ├── Models/
│   │   ├── Services/
│   │   └── Middleware/
│   ├── Feature/                      # Feature/integration tests
│   │   ├── Auth/
│   │   ├── Api/
│   │   └── User/
│   ├── TestCase.php
│   └── README.md
│
├── storage/                          # Generated files (in .gitignore)
│   ├── app/
│   ├── logs/
│   └── cache/
│
├── bootstrap/                        # Framework bootstrap
│   └── app.php
│
├── art/                              # Artwork, logos, graphics
│   ├── header.svg
│   └── logo.png
│
├── .env.example                      # Environment template
├── .gitignore
├── .editorconfig
├── composer.json
├── composer.lock
├── phpunit.xml.dist
├── php-cs-fixer.php
├── README.md
├── LICENSE.md
└── SECURITY.md
```

## JavaScript/React Projects

```
project-name/
├── .github/                          # (same as above)
│
├── docs/                             # (same as above)
│
├── src/
│   ├── components/                   # React components
│   │   ├── common/
│   │   ├── features/
│   │   └── layouts/
│   ├── pages/                        # Page components (Next.js)
│   ├── hooks/                        # Custom React hooks
│   ├── utils/                        # Utility functions
│   ├── services/                     # API services
│   ├── store/                        # State management (Redux, Zustand)
│   ├── styles/                       # Global styles
│   ├── types/                        # TypeScript types
│   └── App.jsx
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── public/                           # Static assets
│   ├── index.html
│   └── favicon.ico
│
├── node_modules/                     # (in .gitignore)
│
├── dist/                             # Build output (in .gitignore)
│
├── art/                              # (same as above)
│
├── .env.example
├── .gitignore
├── .editorconfig
├── package.json
├── package-lock.json
├── tsconfig.json
├── webpack.config.js                 # or vite.config.js
├── jest.config.js
├── README.md
├── LICENSE.md
└── SECURITY.md
```

## TypeScript/Backend Projects

```
project-name/
├── .github/                          # (same as above)
│
├── docs/                             # (same as above)
│
├── src/
│   ├── app.ts                        # Entry point
│   ├── config/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── types/
│   ├── exceptions/
│   └── database/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── dist/                             # Build output (in .gitignore)
│
├── .env.example
├── .gitignore
├── .editorconfig
├── tsconfig.json
├── jest.config.js
├── package.json
├── package-lock.json
├── README.md
├── LICENSE.md
└── SECURITY.md
```

## Documentation-Only Projects

```
project-name/
├── .github/                          # Templates and config
│   ├── ISSUE_TEMPLATE/
│   ├── pull_request_template.md
│   └── CODE_OF_CONDUCT.md
│
├── docs/
│   ├── README.md                     # Table of contents
│   ├── getting-started/
│   ├── guides/
│   ├── tutorials/
│   ├── reference/
│   ├── faq/
│   └── images/                       # Screenshots, diagrams
│
├── art/                              # Logos, graphics
│
├── .gitignore
├── .editorconfig
├── README.md
├── CONTRIBUTING.md
├── LICENSE.md
└── SECURITY.md
```

## General Guidelines

### .github/ Directory
Always include:
- `workflows/` — GitHub Actions
- `ISSUE_TEMPLATE/` — Issue templates
- `pull_request_template.md` — PR template
- `CODE_OF_CONDUCT.md` — Community guidelines
- `dependabot.yml` — Dependency automation

### docs/ Directory
Always include:
- `BRANCHING_STRATEGY.md`
- `COMMIT_STANDARDS.md`
- `RELEASE_STANDARDS.md`
- `CHANGELOG.md`
- `CONTRIBUTING.md`
- `guides/` — Implementation guides
- `api/` — API documentation (if applicable)

### Root Files
Must have:
- `.gitignore` — Standard patterns
- `.editorconfig` — Code formatting
- `README.md` — Professional header and docs
- `LICENSE.md` — MIT license
- `SECURITY.md` — Security policy

Optional but recommended:
- `CONTRIBUTING.md` — In docs/
- `.env.example` — Environment template
- `CODE_OF_CONDUCT.md` — Community code

### Source Code Organization

**By Type (smaller projects):**
```
src/
├── models/
├── controllers/
├── services/
└── utils/
```

**By Feature (larger projects):**
```
src/
├── features/
│   ├── auth/
│   │   ├── models/
│   │   ├── controllers/
│   │   └── services/
│   ├── users/
│   │   ├── models/
│   │   ├── controllers/
│   │   └── services/
│   └── payments/
└── common/
    ├── middleware/
    └── utils/
```

### Test Organization

Mirror source structure:

```
tests/
├── Unit/
│   ├── Models/
│   ├── Services/
│   └── Middleware/
└── Feature/
    ├── Auth/
    ├── Users/
    └── Payments/
```

### File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| **Class** | PascalCase | `UserController.php`, `PaymentService.ts` |
| **Function** | camelCase | `getUserById()`, `formatDate()` |
| **Constant** | UPPER_SNAKE_CASE | `MAX_RETRIES`, `API_TIMEOUT` |
| **Variable** | camelCase | `userName`, `totalAmount` |
| **File** | Match class name | `UserController.php` |
| **Config** | lowercase-kebab-case | `app-config.yaml`, `database.config.js` |
| **Document** | UPPERCASE_SNAKE_CASE | `README.md`, `CONTRIBUTING.md` |

### Git Ignore Pattern

Standard `.gitignore`:

```
# Dependencies
node_modules/
vendor/

# Build output
dist/
build/
*.js.map

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Cache
.cache/
*.tmp

# Generated
composer.lock
package-lock.json
```

### EditorConfig Standard

`.editorconfig`:

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.{js,ts,jsx,tsx,php}]
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false
```

## Monorepo Structure

For monorepos with multiple packages:

```
monorepo/
├── packages/
│   ├── package-a/
│   │   └── (standard structure)
│   ├── package-b/
│   │   └── (standard structure)
│   └── shared/
│       └── Common utilities
├── docs/
│   └── (Monorepo documentation)
├── .github/
│   └── (Shared workflows)
├── package.json
└── README.md
```

## Key Principles

1. **Consistency** — Same structure across all projects
2. **Clarity** — Clear purpose for each directory
3. **Scalability** — Structure grows with project
4. **Convention** — Follow language/framework conventions
5. **Documentation** — docs/ always present and current
6. **Testing** — tests/ mirrors src/ structure
7. **Configuration** — Config in root and config/ directory
8. **Version Control** — Meaningful .gitignore patterns
