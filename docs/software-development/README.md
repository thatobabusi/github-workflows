# Software Development

Stack-specific standards and cheat sheets. Language-agnostic principles live one level up in [docs/](../README.md); these folders apply them per ecosystem.

| Folder | Contents |
|--------|----------|
| [php/](php/) | [Project Structures](php/PHP_PROJECT_STRUCTURES.md) · [Coding Styles](php/PHP_CODING_STYLES.md) · [Design Patterns](php/PHP_DESIGN_PATTERNS.md) · [Frameworks](php/PHP_FRAMEWORKS.md) |
| [python/](python/) | [Project Structures](python/PYTHON_PROJECT_STRUCTURES.md) · [Coding Styles](python/PYTHON_CODING_STYLES.md) · [Frameworks](python/PYTHON_FRAMEWORKS.md) |
| [java/](java/) | [Project Structures](java/JAVA_PROJECT_STRUCTURES.md) · [Spring Boot](java/springboot/SPRINGBOOT_ESSENTIALS.md) · [Quarkus](java/quarkus/QUARKUS_ESSENTIALS.md) |
| [db/](db/) | [Database Design](db/DATABASE_DESIGN.md) · [SQL Cheat Sheet](db/SQL_CHEAT_SHEET.md) |
| [docker/](docker/) | [Docker Cheat Sheet](docker/DOCKER_CHEAT_SHEET.md) — commands, Dockerfile rules, Compose |
| [cli/](cli/) | [CLI Cheat Sheet](cli/CLI_CHEAT_SHEET.md) — modern tools, one-liners, safe scripting |
| [azure/](azure/) | [Azure Essentials](azure/AZURE_ESSENTIALS.md) — service map, az CLI, deployment paths |

## Conventions Across Stacks

Every stack folder follows the same shape so knowledge transfers:

- **Project Structures** — layouts with a decision table, simplest-first bias
- **Coding Styles** — the community standard + enforcement toolchain (style is machine-enforced per [Linting Gates](../LINTING_GATES.md))
- **Frameworks/Essentials** — honest trade-offs, not advocacy

Cross-cutting rules referenced everywhere: [Code Quality](../CODE_QUALITY.md) · [Security & Performance](../SECURITY_PERFORMANCE.md) · [Deployment Guide](../DEPLOYMENT_GUIDE.md) · [Design Patterns](../DESIGN_PATTERNS.md)
