# Software Development

Stack-specific standards and cheat sheets. Language-agnostic principles live one level up in [docs/](../README.md); these folders apply them per ecosystem.

| Folder | Contents |
|--------|----------|
| [php/](backend/php/) | [Project Structures](backend/php/PHP_PROJECT_STRUCTURES.md) · [Coding Styles](backend/php/PHP_CODING_STYLES.md) · [Design Patterns](backend/php/PHP_DESIGN_PATTERNS.md) · [Frameworks](backend/php/PHP_FRAMEWORKS.md) |
| [python/](backend/python/) | [Project Structures](backend/python/PYTHON_PROJECT_STRUCTURES.md) · [Coding Styles](backend/python/PYTHON_CODING_STYLES.md) · [Frameworks](backend/python/PYTHON_FRAMEWORKS.md) |
| [java/](backend/java/) | [Project Structures](backend/java/JAVA_PROJECT_STRUCTURES.md) · [Spring Boot](backend/java/springboot/SPRINGBOOT_ESSENTIALS.md) · [Quarkus](backend/java/quarkus/QUARKUS_ESSENTIALS.md) |
| [composer/](composer/) | [Composer Cheat Sheet](composer/COMPOSER_CHEAT_SHEET.md) — dependency management for PHP |
| [node/](backend/node/) | [Node Essentials](backend/node/NODE_ESSENTIALS.md) — runtime, frameworks, production rules |
| [frontend/](frontend/) | [React](frontend/javascript/react/REACT_ESSENTIALS.md) · [Vue](frontend/javascript/vuejs/VUE_ESSENTIALS.md) · [Angular](frontend/javascript/angularjs/ANGULAR_ESSENTIALS.md) · [Next.js](frontend/javascript/nextjs/NEXTJS_ESSENTIALS.md) · [Bootstrap](frontend/bootstrap/BOOTSTRAP_ESSENTIALS.md) |
| [backend/expressjs & node](backend/expressjs/) | [Express](backend/expressjs/EXPRESS_ESSENTIALS.md) · [NestJS](frontend/javascript/nestjs/NESTJS_ESSENTIALS.md) — server-side JS |
| [db/](db/) | [Database Design](db/DATABASE_DESIGN.md) · [SQL Cheat Sheet](db/sql/SQL_CHEAT_SHEET.md) |
| [docker/](docker/) | [Docker Cheat Sheet](docker/DOCKER_CHEAT_SHEET.md) — commands, Dockerfile rules, Compose |
| [cli/](cli/) | [CLI Cheat Sheet](cli/CLI_CHEAT_SHEET.md) — modern tools, one-liners, safe scripting |
| [azure/](azure/) | [Azure Essentials](azure/AZURE_ESSENTIALS.md) — service map, az CLI, deployment paths |

## Conventions Across Stacks

Every stack folder follows the same shape so knowledge transfers:

- **Project Structures** — layouts with a decision table, simplest-first bias
- **Coding Styles** — the community standard + enforcement toolchain (style is machine-enforced per [Linting Gates](../LINTING_GATES.md))
- **Frameworks/Essentials** — honest trade-offs, not advocacy

Cross-cutting rules referenced everywhere: [Code Quality](../CODE_QUALITY.md) · [Security & Performance](../SECURITY_PERFORMANCE.md) · [Deployment Guide](../DEPLOYMENT_GUIDE.md) · [Design Patterns](../DESIGN_PATTERNS.md)
