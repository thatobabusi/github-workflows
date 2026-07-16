// Verifies every relative .md link in docs/ resolves to a real file.
// Skips links inside fenced code blocks (templates/examples).
// Part of the lint gate: npm run lint:links
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

if (broken > 0) {
    console.error(`\n${broken} broken link(s).`);
    process.exit(1);
}
console.log('All doc links resolve.');
