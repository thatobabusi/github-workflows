# Documentation Standards

Professional, consistent documentation across all projects.

## README Structure

All READMEs follow this structure:

### 1. Header (Dynamic)
```markdown
<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:1f2937,50:374151,100:4b5563&height=180&section=header&text=Project%20Name&fontSize=52&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Brief%20Description&descSize=16" alt="Header" />

<a href="https://github.com/thatobabusi/project">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=18&pause=1200&color=374151&center=true&vCenter=true&width=650&lines=Line%201;Line%202" alt="Typing" />
</a>

<br/><br/>

**[Link 1](#section1)** · **[Link 2](#section2)** · **[Link 3](#section3)**

</div>

<hr/>
```

### 2. Brief Description
```markdown
Clear one-liner explaining what the project does.
Built with X, supports Y versions, targets Z use case.
```

### 3. Badges
```markdown
[![Latest Version][ico-version]][link-packagist]
[![License][ico-license]](LICENSE.md)
[![Build Status][ico-build]][link-build]
[ico-version]: https://img.shields.io/badge/version-1.0.0-brightgreen
```

### 4. Table of Contents
```markdown
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
```

### 5. Features (Categorized)
```markdown
## Features

**Core Functionality**
- Feature A
- Feature B

**Developer Experience**
- Type hints
- Chainable API

**Quality**
- 90%+ test coverage
- Full CI/CD automation
```

### 6. Requirements
```markdown
- PHP >= 7.4 (or Node 16+, Python 3.9+, etc.)
- Framework version (e.g., Laravel 7-13)
- Other dependencies
```

### 7. Installation
```markdown
## Installation

Via package manager:

```bash
composer require package/name
# or
npm install package-name
# or
pip install package-name
```

### 8. Quick Start
```markdown
## Quick Start

```php
use Package\Class;
$instance = new Class();
$instance->method();
```

### 9. Usage Examples
```markdown
## Usage

### Basic Example
```

### 10. Testing
```markdown
## Testing

```bash
composer test
npm test
pytest
```

### 11. Contributing
```markdown
## Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for details.
```

### 12. License
```markdown
## License

MIT License - see [LICENSE.md](LICENSE.md)
```

## CHANGELOG Format

Follow "Keep a CHANGELOG" format:

```markdown
# Changelog

All notable changes documented here.

## [Unreleased]
### Added
- New feature

### Changed
- Improved feature

### Fixed
- Fixed bug

### Deprecated
- Deprecated feature

## [1.0.0] - 2026-07-01
### Added
- Initial release
```

## Commit Message Links

Link to CHANGELOG sections:
```
[1.0.0]: https://github.com/user/repo/releases/tag/v1.0.0
[Unreleased]: https://github.com/user/repo/compare/v1.0.0...HEAD
```

## CONTRIBUTING Guide

Include:
- How to report bugs
- Feature request process
- Development setup
- Testing requirements
- Code style guidelines
- Commit message standards
- PR submission process
- Code review process

## Security Policy (SECURITY.md)

```markdown
# Security Policy

## Supported Versions

| Version | Status |
|---------|--------|
| 1.0.x   | Supported |
| < 1.0   | Unsupported |

## Reporting Vulnerabilities

Email security@example.com with:
- Description
- Affected versions
- Fix (if available)

Do not open public GitHub issues for vulnerabilities.
```

## Documentation Guide (docs/README.md)

```markdown
# Documentation

- [Branching Strategy](BRANCHING_STRATEGY.md)
- [Commit Standards](COMMIT_STANDARDS.md)
- [Release Process](RELEASE_STANDARDS.md)
- [Getting Started](guides/getting-started.md)
- [API Reference](api/reference.md)
- [Troubleshooting](guides/troubleshooting.md)
```

## API Documentation

### For Libraries
```
docs/api/
├── reference.md          # Complete API reference
├── methods.md            # Method documentation
├── classes.md            # Class documentation
└── examples.md           # Usage examples
```

### For Services
```
docs/api/
├── endpoints.md          # API endpoints
├── authentication.md      # Auth details
├── errors.md             # Error codes
└── webhooks.md           # Webhook documentation
```

## Code Examples

All examples should:
- Be complete and runnable
- Show both simple and advanced usage
- Include error handling
- Follow code style standards
- Include expected output
- Reference related documentation

**Good example:**
```php
use Package\Logger;

try {
    $logger = new Logger('app.log');
    $logger->info('Application started');
    $logger->error('Error occurred', ['context' => 'value']);
} catch (Exception $e) {
    echo 'Failed: ' . $e->getMessage();
}
```

## Markdown Style Guide

### Headers
```markdown
# H1 - Document Title
## H2 - Main Sections
### H3 - Subsections
#### H4 - Details
```

### Emphasis
```markdown
**bold** for emphasis
_italic_ for terminology
`code` for inline code
```

### Lists
```markdown
- Bullet point
- Another point

1. Numbered item
2. Second item

- [ ] Checkbox
- [x] Completed
```

### Code Blocks
```markdown
`` `language
code here
`` `

`` `bash
$ command
`` `

`` `php
<?php code ?>
`` `
```

### Blockquotes
```markdown
> Important note or quote
> Second line
```

### Links
```markdown
[Link text](url)
[Reference link][reference]

[reference]: https://example.com
```

### Tables
```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```

## Writing Standards

- **Language** — English
- **Tense** — Present tense ("does" not "will do")
- **Voice** — Active voice ("you can" not "can be")
- **Tone** — Professional, friendly, clear
- **Length** — Concise but complete
- **Structure** — Logical flow, subsections

### Do's
✅ Use clear headings
✅ Include examples
✅ Link to related docs
✅ Keep sentences short
✅ Use active voice
✅ Include code samples

### Don'ts
❌ Assume prior knowledge
❌ Use jargon without explaining
❌ Leave incomplete examples
❌ Outdated information
❌ Broken links
❌ Inconsistent formatting

## Docs Organization

```
docs/
├── README.md                 # Docs index
├── BRANCHING_STRATEGY.md     # Git workflow
├── COMMIT_STANDARDS.md       # Commit conventions
├── RELEASE_STANDARDS.md      # Release process
├── CHANGELOG.md              # Version history
├── CONTRIBUTING.md           # How to contribute
├── guides/                   # Implementation guides
│   ├── installation.md
│   ├── configuration.md
│   ├── getting-started.md
│   └── troubleshooting.md
├── tutorials/                # Step-by-step tutorials
│   ├── beginner-guide.md
│   └── advanced-usage.md
├── reference/                # API/feature reference
│   ├── api.md
│   ├── classes.md
│   └── methods.md
├── faq/                      # Common questions
│   └── common-issues.md
└── images/                   # Screenshots, diagrams
    ├── architecture.png
    └── workflow.svg
```

## README Badge Standards

Use consistent services:
- Packagist: `https://img.shields.io/packagist/v/vendor/package`
- npm: `https://img.shields.io/npm/v/package-name`
- GitHub: `https://img.shields.io/github/v/release/user/repo`
- Build: `https://github.com/user/repo/actions/workflows/tests.yml/badge.svg`
- License: `https://img.shields.io/badge/license-MIT-brightgreen`
- Downloads: `https://img.shields.io/packagist/dt/vendor/package`

## Version Documentation

Maintain docs for:
- Current stable version
- Current development version
- Last major version (if different)

Link version switcher in README:
```markdown
[📚 v1.x docs](https://github.com/user/repo/blob/v1.x/README.md)
[📚 v2.x docs](https://github.com/user/repo/blob/main/README.md)
```

## Auto-Generated Documentation

Tools that work with semantic commits:
- **conventional-changelog** — Auto-generate CHANGELOG
- **typedoc** — Auto-generate TypeScript docs
- **phpDocumentor** — Auto-generate PHP docs
- **Swagger/OpenAPI** — Auto-generate API docs

Run these before releases to keep docs current.
