# WordPress Essentials

Working professionally in the platform that runs 40% of the web — structure, hooks, security, and keeping custom code sane.

## When WordPress

[The frameworks doc](../PHP_FRAMEWORKS.md) says it: client content sites, editorial teams, ecosystems built on its plugins (WooCommerce). Custom business applications wearing a WordPress costume become unmaintainable — that's [Laravel's](../laravel/LARAVEL_ESSENTIALS.md) job.

## The Hook System (the whole mental model)

WordPress *is* an event system — everything attaches to it:

```php
// Actions: do something at a moment
add_action('init', function () {
    register_post_type('portfolio', [
        'public' => true,
        'label' => 'Portfolio',
        'supports' => ['title', 'editor', 'thumbnail'],
        'show_in_rest' => true,          // Gutenberg + REST API
    ]);
});

// Filters: transform a value passing through
add_filter('the_title', function (string $title): string {
    return is_admin() ? $title : ucfirst($title);
});

// Priority (default 10) and argument count matter:
add_action('save_post', 'my_handler', 20, 3);
```

Debugging rule: something's wrong → find which hook, what priority, who else is attached (`global $wp_filter`).

## Where Custom Code Lives

| Code Type | Home | Never |
|-----------|------|-------|
| Site-specific features (CPTs, integrations) | **Custom plugin** | Theme functions.php |
| Presentation | Child theme / block theme | Plugin |
| Tiny site-specific snippets | mu-plugins/ | Pasted into vendor themes |

Functions.php is where code goes to become unswitchable — features in a theme die with the redesign.

### Custom Plugin Skeleton

```
my-site-features/
├── my-site-features.php      # header + bootstrap only
├── src/                      # PSR-4 via Composer — real classes
│   ├── PostTypes/
│   ├── Rest/
│   └── Integrations/
├── composer.json
└── assets/
```

[Coding styles](../PHP_CODING_STYLES.md) apply inside `src/` — namespaces, strict types, Pint — even when the WP core API around you is 2003-flavored.

## Database Access

```php
// The APIs in order of preference:
$posts = new WP_Query(['post_type' => 'portfolio', 'posts_per_page' => 10]);
$meta = get_post_meta($post_id, 'price_cents', true);

// Raw $wpdb ONLY with prepare — the injection rule has no exceptions
global $wpdb;
$rows = $wpdb->get_results(
    $wpdb->prepare("SELECT * FROM {$wpdb->prefix}orders WHERE user_id = %d", $user_id)
);
```

Custom tables are legitimate for real relational data — post-meta abuse (everything as meta rows) is the classic WP performance killer.

## Security Non-Negotiables

The [security baseline](../../../../SECURITY_PERFORMANCE.md) translated to WP idiom:

```php
// OUTPUT: escape at the template, per context
echo esc_html($title);
echo esc_attr($value);
echo esc_url($link);
echo wp_kses_post($rich_content);      // filtered HTML

// INPUT: sanitize + verify intent
$email = sanitize_email($_POST['email'] ?? '');
check_admin_referer('save_settings');   // nonce (CSRF)
if (!current_user_can('manage_options')) {
    wp_die('Forbidden');                 // capability check
}
```

Every handler: **nonce + capability + sanitize in + escape out.** Plus operational hygiene: auto-updates for minor core, plugins from reputable sources only and few of them, no `admin` username, salts set, `DISALLOW_FILE_EDIT` true.

## Modern WP Development

| Practice | Tool |
|----------|------|
| Composer-managed WP + plugins | **Bedrock** (roots.io) — real [deploys](../../../../DEPLOYMENT_GUIDE.md), env configs, git-sane |
| Local dev | Herd/Valet, `wp-env`, or LocalWP |
| CLI everything | **WP-CLI**: `wp plugin update --all`, `wp db export`, `wp search-replace` |
| Blocks | `@wordpress/create-block` ([React](../../../frontend/javascript/react/REACT_ESSENTIALS.md) under the hood) |
| Headless | REST API / WPGraphQL + [Next.js](../../../frontend/javascript/nextjs/NEXTJS_ESSENTIALS.md) front |

```bash
# WP-CLI daily drivers
wp core update && wp plugin list --update=available
wp search-replace 'https://staging.example.com' 'https://example.com' --dry-run
wp db export backup-$(date +%F).sql
```

## Performance Reality

- Page cache first (server-level or plugin) — WP regenerates everything per request without it
- Object cache (Redis) once logged-in traffic matters
- Query Monitor plugin in dev = the N+1 detector
- Image optimization + CDN — media libraries bloat fast ([Technical SEO](../../../../seo/SEO_TECHNICAL.md) CWV rules apply hard here)

## See Also

- [PHP Frameworks](../PHP_FRAMEWORKS.md) — when WP is and isn't the tool
- [Vanilla PHP Essentials](../vanilla/VANILLA_PHP_ESSENTIALS.md)
- [SEO docs](../../../../seo/SEO_CHEAT_SHEET.md) — most WP work is SEO-adjacent
