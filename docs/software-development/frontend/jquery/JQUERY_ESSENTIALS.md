# jQuery Essentials

Still on ~75% of the web via legacy sites, WordPress, and admin themes. Two jobs here: work competently in existing jQuery code, and migrate it out when touched.

## When jQuery (honestly)

| Situation | Verdict |
|-----------|---------|
| Maintaining a legacy/[WordPress](../../backend/php/wordpress/WORDPRESS_ESSENTIALS.md)/AdminLTE codebase | Work in it cleanly — consistency beats a half-migration |
| Bootstrap 4-era themes that require it | It's already there |
| **New projects** | No — vanilla DOM APIs cover it ([the table below](#the-migration-table)), frameworks cover the rest |

## Core Patterns (for maintaining it well)

```javascript
$(function () {                                    // DOM ready
    // Event DELEGATION — survives dynamic content (the pattern that matters most)
    $('#order-table').on('click', '.btn-cancel', function () {
        const orderId = $(this).closest('tr').data('order-id');
        cancelOrder(orderId);
    });
});
```

```javascript
// Chaining + traversal
$('.alert').addClass('alert-danger').fadeIn(200).delay(3000).fadeOut(200);
$(this).closest('.card').find('.total').text(formatMoney(total));

// $.ajax — recognize the shape
$.ajax({
    url: '/api/orders',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ productId: 42 }),
    headers: { 'X-CSRF-TOKEN': token },
})
    .done((order) => renderOrder(order))
    .fail((xhr) => showErrors(xhr.responseJSON?.errors));
```

Maintenance rules:

- **Delegate events** to stable ancestors — direct binding on dynamic elements is the classic jQuery bug
- Cache selectors used twice: `const $table = $('#order-table')` ($ prefix convention)
- Data in `data-*` attributes, not parsed out of class names or DOM text
- Keep jQuery updated (3.7+) — 1.x/2.x carry known XSS CVEs; `$(userInput)` with HTML strings is an injection vector: use `$('<div>').text(userInput)`

## The Migration Table

Vanilla equivalents — replace call-for-call when touching old code:

| jQuery | Modern Vanilla |
|--------|---------------|
| `$('.item')` | `document.querySelectorAll('.item')` |
| `$el.on('click', fn)` | `el.addEventListener('click', fn)` |
| Delegation `.on('click', '.sel', fn)` | listener + `e.target.closest('.sel')` |
| `$el.addClass/removeClass/toggleClass` | `el.classList.add/remove/toggle` |
| `$el.attr/data/val/text/html` | `getAttribute` / `el.dataset` / `.value` / `.textContent` / `.innerHTML`* |
| `$el.closest/find` | `el.closest()` / `el.querySelector()` |
| `$el.hide()/show()` | `el.hidden = true/false` |
| `$.ajax` | [`fetch` wrapper](../ajax/AJAX_FETCH_CHEAT_SHEET.md) |
| `$(fn)` ready | `DOMContentLoaded` or `defer` scripts |
| `fadeIn/slideUp` | CSS transitions + class toggle |

*`.innerHTML` with any user data = XSS — escape or use `textContent` ([security rules](../../../SECURITY_PERFORMANCE.md)).

## Migration Strategy

1. **Don't big-bang.** Migrate file-by-file as features get touched ([the ratchet principle](../../../QUALITY_GATES.md))
2. New features in the old codebase: vanilla or a mounted framework island — never *new* jQuery
3. The common destination for server-rendered apps isn't React — it's **Livewire/HTMX/Alpine** ([PHP pairings](../../backend/php/PHP_FRAMEWORKS.md)): jQuery's "sprinkle interactivity" job, done declaratively
4. Drop the dependency only when the last plugin goes — check what Bootstrap version the theme needs ([Bootstrap 5 dropped jQuery](../bootstrap/BOOTSTRAP_ESSENTIALS.md))

## See Also

- [AJAX & Fetch](../ajax/AJAX_FETCH_CHEAT_SHEET.md) — the $.ajax replacement
- [HTML Cheat Sheet](../html/HTML_CHEAT_SHEET.md) — semantic base the sprinkles sit on
- [WordPress Essentials](../../backend/php/wordpress/WORDPRESS_ESSENTIALS.md) — where you'll meet it
