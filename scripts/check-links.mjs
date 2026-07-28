// Verifies every relative .md link in docs/ resolves to a real file, AND that
// every document listed in the site's sidebar registry exists on disk.
// Skips links inside fenced code blocks (templates/examples).
// Part of the lint gate: npm run lint:links
//
// The registry check exists because moving 20 files into docs/github/ updated
// the READMEs (this script caught those) but left assets/scripts.js pointing
// at the old paths. The site fetched the missing files, got the server's HTML
// error page back, and rendered it as markdown -- pages that looked broken
// rather than pages that said they were missing.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

function walk(dir) {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) return walk(full);
        return full.endsWith('.md') ? [full] : [];
    });
}

function stripFences(markdown) {
    // Line-based toggle — robust against fenced examples that contain
    // markdown snippets themselves (DOCUMENTATION_STANDARDS templates).
    let inFence = false;
    return markdown
        .split('\n')
        .map((line) => {
            if (/^\s*(```|~~~)/.test(line)) {
                inFence = !inFence;
                return '';
            }
            return inFence ? '' : line;
        })
        .join('\n');
}

// Files whose .md links are illustrative templates, not real references.
const IGNORE = ['DOCUMENTATION_STANDARDS.md'];

let broken = 0;
for (const file of walk('docs')) {
    if (IGNORE.some((name) => file.endsWith(name))) continue;
    const content = stripFences(readFileSync(file, 'utf8'));
    for (const match of content.matchAll(/\]\(([^)#\s]+?\.md)(#[^)]*)?\)/g)) {
        const target = match[1];
        if (target.startsWith('http')) continue;
        if (!existsSync(resolve(dirname(file), target))) {
            console.error(`${file}: broken link -> ${target}`);
            broken++;
        }
    }
}

// ---- sidebar registry -> disk -------------------------------------------
// assets/scripts.js lists every document the site can open, as a path under
// docs/. A file moved on disk without updating that list is invisible until
// someone clicks it.
const REGISTRY = 'assets/scripts.js';
let missing = 0;
let listed = 0;

if (existsSync(REGISTRY)) {
    const source = readFileSync(REGISTRY, 'utf8');
    for (const match of source.matchAll(/file:\s*['"]([^'"]+\.md)['"]/g)) {
        const target = match[1];
        listed++;
        if (!existsSync(join('docs', target))) {
            console.error(`${REGISTRY}: sidebar entry has no file -> docs/${target}`);
            missing++;
        }
    }

    // The reverse direction is a warning, not a failure: a doc can legitimately
    // exist without being on the sidebar (drafts, includes), but it is usually
    // an oversight worth seeing.
    const listedSet = new Set(
        [...source.matchAll(/file:\s*['"]([^'"]+\.md)['"]/g)].map((m) => join('docs', m[1]))
    );
    const orphans = walk('docs')
        .filter((f) => !listedSet.has(f))
        .filter((f) => !/README\.md$/i.test(f));
    if (orphans.length) {
        console.warn(`\n${orphans.length} doc(s) not on the sidebar:`);
        for (const f of orphans) console.warn(`  ${f}`);
    }
} else {
    console.warn(`${REGISTRY} not found — skipping the sidebar check.`);
}

if (broken > 0 || missing > 0) {
    if (broken) console.error(`\n${broken} broken link(s).`);
    if (missing) console.error(`${missing} sidebar entr${missing === 1 ? 'y' : 'ies'} pointing at a missing file.`);
    process.exit(1);
}
console.log(`All doc links resolve. All ${listed} sidebar entries exist.`);
