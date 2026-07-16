# PHP Frameworks

The landscape, honest trade-offs, and selection guidance.

## Decision Table

| You're Building | Reach For |
|-----------------|-----------|
| Standard web app / SaaS / API (default) | **Laravel** |
| Enterprise app, long-lived, heavy customization | Symfony |
| Tiny API / microservice / webhook receiver | Slim (or Laravel with restraint) |
| CMS-shaped content site | Statamic (Laravel) / WordPress if the client insists |
| Legacy rescue | Whatever it's already in + Rector + tests |
| Learning how frameworks work | Slim + PSR-7/15, then read Laravel's container |

House default is **Laravel** — the ecosystem (Herd, Forge, Horizon, Pint, Sanctum) compounds, and every project shares idioms.

## Laravel

The batteries-included choice: routing, Eloquent ORM, queues, scheduling, broadcasting, auth scaffolding, testing sugar — one coherent vocabulary.

```php
Route::get('/posts/{post}', [PostController::class, 'show']);

class PostController extends Controller
{
    public function show(Post $post)          // route-model binding
    {
        return PostResource::make($post->load('author'));
    }
}
```

**Strengths:** velocity, ecosystem depth, best-in-class docs, hiring pool, first-party tooling for everything from billing (Cashier) to server management (Forge).

**Costs:** magic (facades, container auto-resolution) hides mechanics from juniors; Eloquent's Active Record couples models to persistence; upgrades yearly (tolerable — Shift automates).

**Fits:** 90% of what we build. Full structure in [PHP Project Structures](PHP_PROJECT_STRUCTURES.md) and [File Structure](../../../FILE_STRUCTURE.md).

## Symfony

The component framework — everything is a decoupled, reusable library (HttpFoundation, Console, Validator power half the PHP ecosystem, including Laravel).

```php
#[Route('/posts/{id}', name: 'post_show')]
public function show(PostRepository $posts, int $id): Response
{
    return $this->json($posts->find($id));
}
```

**Strengths:** explicitness, long-term-support releases (3 years), Doctrine's Data Mapper (entities decoupled from persistence — pairs naturally with DDD), configuration rigor.

**Costs:** slower to first feature; more decisions up front; YAML/attributes config sprawl; smaller local hiring pool.

**Fits:** long-lived enterprise systems, teams that want architecture enforced by the framework, DDD builds.

## Slim

Micro-framework: routing + PSR-7/15 middleware, nothing else.

```php
$app = AppFactory::create();

$app->get('/health', function (Request $request, Response $response) {
    $response->getBody()->write(json_encode(['status' => 'ok']));
    return $response->withHeader('Content-Type', 'application/json');
});

$app->run();
```

**Strengths:** tiny footprint, zero magic, teaches the HTTP layer honestly.

**Costs:** you assemble everything (ORM, validation, auth) yourself — at which point you've built a worse Laravel.

**Fits:** single-purpose services, webhook receivers, teaching.

## The Rest of the Field

| Framework | One-Liner | When It Comes Up |
|-----------|-----------|------------------|
| **Laminas** (ex-Zend) | Enterprise component library | Legacy Zend estates |
| **CodeIgniter 4** | Lightweight MVC, easy hosting | Legacy CI upgrades, shared hosting |
| **CakePHP** | Convention-heavy veteran | Legacy only |
| **Yii2** | Fast CRUD scaffolding | Legacy only |
| **Phalcon** | C-extension speed | Rarely justified now (OPcache+JIT closed the gap) |
| **API Platform** | API framework on Symfony | Spec-heavy REST/GraphQL with admin |
| **WordPress** | CMS, not a framework — 40% of the web | Client content sites; keep custom logic in plugins with real structure |

## Full-Stack Pairings

| Pairing | What It Is | Choose When |
|---------|-----------|-------------|
| **Livewire + Alpine (TALL)** | Server-driven reactivity, minimal JS | Team is PHP-first; forms/dashboards |
| **Inertia + Vue/React** | SPA feel, server routing, no separate API | Rich UI without API overhead |
| **Blade + vanilla JS** | Classic server rendering | Content sites, simplest correct thing |
| **API + separate SPA** | Full decoupling | Mobile app shares the API; separate frontend team |

Order of consideration: Blade → Livewire → Inertia → separate SPA. Each step buys interactivity with complexity.

## Evaluation Checklist (any framework decision)

- [ ] Release cadence and LTS policy — who maintains it in year 3?
- [ ] Upgrade story — automated (Shift/Rector) or archaeology?
- [ ] Ecosystem: auth, queues, testing — first-party or bolt-on?
- [ ] Hiring: can you staff it locally?
- [ ] Exit cost: how coupled is domain logic to the framework? (Keep [Services pure](PHP_DESIGN_PATTERNS.md) and the answer stays "low")

## Framework-Agnostic Insurance

Whatever the framework, these keep you portable:

- Domain logic in plain PHP services — framework imports only at the edges
- PSRs at the seams: PSR-3 logging, PSR-7 where practical
- [Adapters](PHP_DESIGN_PATTERNS.md) around every vendor SDK
- Tests that assert behavior, not framework internals

## See Also

- [PHP Project Structures](PHP_PROJECT_STRUCTURES.md)
- [PHP Design Patterns](PHP_DESIGN_PATTERNS.md)
- [API Standards](../../../API_STANDARDS.md)
