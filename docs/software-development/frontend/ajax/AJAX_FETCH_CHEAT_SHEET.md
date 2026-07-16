# AJAX & Fetch Cheat Sheet

Async HTTP from the browser: modern `fetch` patterns, error handling done right, and the legacy you'll still meet.

## Fetch Fundamentals

```javascript
// The complete GET
const response = await fetch('/api/orders?status=pending', {
    headers: { 'Accept': 'application/json' },
});
if (!response.ok) {                        // fetch does NOT reject on 404/500!
    throw new HttpError(response.status, await response.text());
}
const orders = await response.json();
```

**The rule everyone learns the hard way:** `fetch` only rejects on *network* failure. HTTP 4xx/5xx resolve normally — you must check `response.ok` yourself.

```javascript
// The complete POST
const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
    },
    body: JSON.stringify({ productId: 42, quantity: 2 }),
});
```

CSRF header on every state-changing request in session-auth apps — [the Laravel/session rule](../../../SECURITY_PERFORMANCE.md).

## A Sane Wrapper (write once per project)

```javascript
async function api(path, { method = 'GET', body, ...options } = {}) {
    const response = await fetch(path, {
        method,
        headers: {
            'Accept': 'application/json',
            ...(body ? { 'Content-Type': 'application/json' } : {}),
            ...options.headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'same-origin',
        ...options,
    });

    if (response.status === 204) return null;
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw Object.assign(new Error(data?.message ?? response.statusText), {
            status: response.status,
            errors: data?.errors,           // 422 validation shape (API Standards)
        });
    }
    return data;
}

// usage
const order = await api('/api/orders', { method: 'POST', body: { productId: 42 } });
```

## Cancellation & Timeouts

```javascript
// Abort stale searches (the switchMap pattern, hand-rolled)
let controller;
input.addEventListener('input', async (e) => {
    controller?.abort();
    controller = new AbortController();
    try {
        const results = await api(`/api/search?q=${encodeURIComponent(e.target.value)}`,
            { signal: controller.signal });
        render(results);
    } catch (err) {
        if (err.name !== 'AbortError') throw err;   // aborts are not errors
    }
});

// Timeout in one line
fetch(url, { signal: AbortSignal.timeout(8000) });
```

## Parallel & Sequential

```javascript
// Parallel — independent requests never await in sequence
const [user, orders] = await Promise.all([api('/api/user'), api('/api/orders')]);

// Tolerant parallel — partial failure OK
const results = await Promise.allSettled(urls.map((u) => api(u)));
```

## Uploads & Downloads

```javascript
// Upload: FormData, and DON'T set Content-Type (browser sets the boundary)
const form = new FormData();
form.append('file', fileInput.files[0]);
await fetch('/api/uploads', { method: 'POST', body: form });

// Download a generated file
const blob = await (await fetch('/api/report.pdf')).blob();
const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(blob), download: 'report.pdf',
});
a.click(); URL.revokeObjectURL(a.href);
```

## Beyond Request/Response

| Need | Tool |
|------|------|
| Server → client stream (progress, feeds) | **EventSource** (SSE) — auto-reconnects, plain HTTP |
| Bidirectional realtime | WebSocket ([broadcasting rules](../../../ASYNC_PATTERNS.md)) |
| Fire-and-forget on page unload | `navigator.sendBeacon()` |
| Request dedup/cache/retry in apps | TanStack Query ([React](../javascript/react/REACT_ESSENTIALS.md)/[Vue](../javascript/vuejs/VUE_ESSENTIALS.md)) — stop hand-rolling |

## The Legacy Corner

`XMLHttpRequest` — you'll meet it in old code and [jQuery's](../jquery/JQUERY_ESSENTIALS.md) `$.ajax`; upload **progress events** are its one remaining genuine advantage over fetch. Don't write new XHR.

```javascript
// Recognize it; migrate it to the wrapper above when touched
const xhr = new XMLHttpRequest();
xhr.open('GET', '/api/orders');
xhr.onload = () => console.log(JSON.parse(xhr.responseText));
xhr.send();
```

## See Also

- [API Standards](../../../API_STANDARDS.md) — the server side of these calls
- [jQuery Essentials](../jquery/JQUERY_ESSENTIALS.md) — `$.ajax` migration
- [Security & Performance](../../../SECURITY_PERFORMANCE.md) — CSRF, CORS
