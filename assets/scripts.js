const app = {
    files: [],
    categories: {},
    currentTheme: localStorage.getItem('theme') || 'dark',

    init() {
        this.setupTheme();
        this.buildFileIndex();
        this.renderSidebar();
        this.renderHome();
        this.setupEventListeners();
    },

    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateThemeIcon();
        this.updateHighlightTheme();
    },

    updateThemeIcon() {
        const toggle = document.getElementById('themeToggle');
        toggle.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
    },

    updateHighlightTheme() {
        const lightStyle = document.getElementById('hljs-light');
        const darkStyle = document.getElementById('hljs-dark');
        lightStyle.disabled = this.currentTheme === 'dark';
        darkStyle.disabled = this.currentTheme !== 'dark';
    },

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', this.currentTheme);
        this.setupTheme();
    },

    buildFileIndex() {
        this.categories = {
            'core': {
                title: '📌 Core Standards',
                files: [
                    { name: 'Branching Strategy', file: 'BRANCHING_STRATEGY.md' },
                    { name: 'Commit Standards', file: 'COMMIT_STANDARDS.md' },
                    { name: 'Release Standards', file: 'RELEASE_STANDARDS.md' },
                    { name: 'Pull Request Process', file: 'PULL_REQUEST_PROCESS.md' }
                ]
            },
            'quality': {
                title: '✅ Quality & Gates',
                files: [
                    { name: 'Code Quality', file: 'CODE_QUALITY.md' },
                    { name: 'Linting Gates', file: 'LINTING_GATES.md' },
                    { name: 'Quality Gates', file: 'QUALITY_GATES.md' },
                    { name: 'Testing', file: 'TESTING.md' }
                ]
            },
            'architecture': {
                title: '🏗️ Architecture',
                files: [
                    { name: 'Design Patterns', file: 'DESIGN_PATTERNS.md' },
                    { name: 'API Standards', file: 'API_STANDARDS.md' },
                    { name: 'Async Patterns', file: 'ASYNC_PATTERNS.md' },
                    { name: 'Monorepo Structure', file: 'MONOREPO_STRUCTURE.md' }
                ]
            },
            'operations': {
                title: '🚀 Operations',
                files: [
                    { name: 'Deployment Guide', file: 'DEPLOYMENT_GUIDE.md' },
                    { name: 'Security & Performance', file: 'SECURITY_PERFORMANCE.md' }
                ]
            },
            'setup': {
                title: '🛠️ Project Setup',
                files: [
                    { name: 'File Structure', file: 'FILE_STRUCTURE.md' },
                    { name: 'Documentation Standards', file: 'DOCUMENTATION_STANDARDS.md' },
                    { name: 'Implementation Checklist', file: 'IMPLEMENTATION_CHECKLIST.md' }
                ]
            },
            'tips': {
                title: '💡 Tips & Tricks',
                files: [
                    { name: 'Git Tips & Tricks', file: 'GIT_TIPS_TRICKS.md' },
                    { name: 'Actions Advanced', file: 'ACTIONS_ADVANCED.md' },
                    { name: 'Nice to Know', file: 'NICE_TO_KNOW.md' }
                ]
            },
            'seo': {
                title: '🔍 SEO',
                files: [
                    { name: 'SEO Cheat Sheet', file: 'seo/SEO_CHEAT_SHEET.md' },
                    { name: 'Content Writing', file: 'seo/SEO_CONTENT_WRITING.md' },
                    { name: 'Meta Tags Reference', file: 'seo/SEO_META_TAGS.md' },
                    { name: 'Technical SEO', file: 'seo/SEO_TECHNICAL.md' }
                ]
            },
            'php': {
                title: '🐘 PHP Architecture',
                files: [
                    { name: 'Project Structures', file: 'software-development/php/PHP_PROJECT_STRUCTURES.md' },
                    { name: 'Coding Styles', file: 'software-development/php/PHP_CODING_STYLES.md' },
                    { name: 'Design Patterns (PHP)', file: 'software-development/php/PHP_DESIGN_PATTERNS.md' },
                    { name: 'Frameworks', file: 'software-development/php/PHP_FRAMEWORKS.md' }
                ]
            }
        };

        this.files = [];
        Object.entries(this.categories).forEach(([key, cat]) => {
            cat.files.forEach(file => {
                this.files.push({
                    name: file.name,
                    file: file.file,
                    path: 'docs/' + file.file,
                    category: cat.title,
                    categoryKey: key
                });
            });
        });
    },

    renderSidebar() {
        const sidebar = document.getElementById('sidebarContent');
        sidebar.innerHTML = '';
        Object.entries(this.categories).forEach(([_key, cat]) => {
            const section = document.createElement('div');
            section.className = 'sidebar-section collapsed';

            const title = document.createElement('div');
            title.className = 'sidebar-title';
            title.innerHTML = `
                <div class="sidebar-title-text">
                    <span class="sidebar-toggle">▶</span>
                    <span>${cat.title}</span>
                </div>
            `;

            const linksContainer = document.createElement('div');
            linksContainer.className = 'sidebar-links';

            cat.files.forEach(file => {
                const link = document.createElement('a');
                link.href = '#';
                link.className = 'sidebar-link';
                link.dataset.file = file.file;
                link.textContent = file.name;
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.loadFile('docs/' + file.file, file.name);
                });
                linksContainer.appendChild(link);
            });

            title.addEventListener('click', () => {
                section.classList.toggle('collapsed');
            });

            section.appendChild(title);
            section.appendChild(linksContainer);
            sidebar.appendChild(section);
        });
    },

    setActiveSidebarLink(fileName) {
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.toggle('active', link.dataset.file === fileName);
        });
    },

    renderHome() {
        const grid = document.getElementById('homeGrid');
        grid.innerHTML = '';
        Object.entries(this.categories).forEach(([key, cat]) => {
            const card = document.createElement('a');
            card.href = '#';
            card.className = 'category-card';
            card.innerHTML = `
                <div class="category-card-title">${cat.title}</div>
                <div class="category-card-count">${cat.files.length} standard${cat.files.length === 1 ? '' : 's'}</div>
            `;
            card.addEventListener('click', (e) => {
                e.preventDefault();
                this.showCategory(key);
            });
            grid.appendChild(card);
        });
        this.showView('homeView');
        this.updateTOC([]);
        this.setActiveSidebarLink(null);
    },

    showHome(e) {
        if (e) {
            e.preventDefault();
        }
        document.getElementById('searchInput').value = '';
        this.renderHome();
    },

    showCategory(categoryKey) {
        const cat = this.categories[categoryKey];
        document.getElementById('categoryTitle').textContent = cat.title;
        const grid = document.getElementById('categoryGrid');
        grid.innerHTML = '';
        cat.files.forEach(file => {
            const card = document.createElement('a');
            card.href = '#';
            card.className = 'category-card';
            card.innerHTML = `
                <div class="category-card-title">${file.name}</div>
                <div class="category-card-count">${cat.title}</div>
            `;
            card.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadFile('docs/' + file.file, file.name);
            });
            grid.appendChild(card);
        });
        this.showView('categoryView');
        this.updateTOC([]);
    },

    async loadFile(path, title) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`File not found (HTTP ${response.status})`);
            }
            const content = await response.text();
            if (!content.trim()) {
                throw new Error('File is empty');
            }

            const { html, headings } = this.markdownToHtml(content);
            document.getElementById('fileContent').innerHTML = html;
            this.bindInternalLinks();
            this.showView('fileView');
            this.updateTOC(headings);
            this.setActiveSidebarLink(path.replace('docs/', ''));
            window.scrollTo({ top: 0 });
            if (typeof hljs !== 'undefined') {
                setTimeout(() => hljs.highlightAll(), 50);
            }
        } catch (error) {
            document.getElementById('fileContent').innerHTML = `
                <h1>${title}</h1>
                <div class="error-box">
                    <strong>Error loading document:</strong> ${error.message}
                    <br><small>Path: ${path}</small>
                </div>
            `;
            this.showView('fileView');
            this.updateTOC([]);
        }
    },

    bindInternalLinks() {
        document.querySelectorAll('#fileContent a[data-doc]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const file = link.dataset.doc;
                const match = this.files.find(f => f.file === file || f.file.endsWith('/' + file));
                this.loadFile(match ? match.path : 'docs/' + file, match ? match.name : file);
            });
        });
    },

    escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    },

    markdownToHtml(md) {
        const headings = [];
        const codeBlocks = [];

        // Extract fenced code blocks first so nothing else touches them
        let html = md.replace(/```(\w+)?\n([\s\S]*?)```/g, (_match, lang, code) => {
            const language = (lang || 'text').toLowerCase();
            const token = `@@CODE${codeBlocks.length}@@`;
            codeBlocks.push({ language, code: code.replace(/\s+$/, '') });
            return token;
        });

        html = this.escapeHtml(html);

        // Headings (collect for TOC)
        html = html.replace(/^(#{1,3}) (.+)$/gm, (_match, hashes, text) => {
            const level = hashes.length;
            const clean = text.replace(/[*_`]/g, '').trim();
            const id = clean.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-|-$/g, '');
            headings.push({ level, title: clean, id });
            return `<h${level} id="${id}">${text}</h${level}>`;
        });

        // Tables
        html = html.replace(/^(\|.+\|)\n(\|[\s|:-]+\|)\n((?:\|.+\|\n?)*)/gm, (_match, header, _sep, body) => {
            const cells = row => row.split('|').slice(1, -1).map(c => c.trim());
            const ths = cells(header).map(c => `<th>${c}</th>`).join('');
            const rows = body.trim().split('\n').filter(Boolean).map(row =>
                `<tr>${cells(row).map(c => `<td>${c}</td>`).join('')}</tr>`
            ).join('');
            return `<div class="table-wrap"><table><thead><tr>${ths}</tr></thead><tbody>${rows}</tbody></table></div>\n`;
        });

        // Task lists and bullet lists
        html = html.replace(/^- \[([ x])\] (.*)$/gm, (_match, checked, text) =>
            `<li><input type="checkbox" disabled${checked === 'x' ? ' checked' : ''}> ${text}</li>`);
        html = html.replace(/^[-*] (.*)$/gm, '<li>$1</li>');
        html = html.replace(/^\d+\. (.*)$/gm, '<li data-ol="1">$1</li>');
        html = html.replace(/((?:<li(?! data-ol)[^>]*>.*<\/li>\n?)+)/g, '<ul>$1</ul>');
        html = html.replace(/((?:<li data-ol="1">.*<\/li>\n?)+)/g, '<ol>$1</ol>');

        // Inline formatting
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
        html = html.replace(/`([^`\n]+)`/g, '<code>$1</code>');

        // Wiki-style links: [[doc-name]]
        html = html.replace(/\[\[([\w-]+)\]\]/g, (_match, name) => {
            const target = this.files.find(f =>
                f.file.toLowerCase().replace('.md', '') === name.toLowerCase() ||
                f.name.toLowerCase().replace(/\s+/g, '-') === name.toLowerCase()
            );
            if (target) {
                return `<a href="#" data-doc="${target.file}">${target.name}</a>`;
            }
            return `<span title="Document not found: ${name}" style="opacity:0.6">${name}</span>`;
        });

        // Markdown links — internal .md links become app navigation
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, text, url) => {
            const mdMatch = url.match(/([\w-]+\.md)(#[\w-]+)?$/i);
            if (mdMatch && !url.startsWith('http')) {
                return `<a href="#" data-doc="${mdMatch[1]}">${text}</a>`;
            }
            return `<a href="${url}" target="_blank" rel="noopener">${text}</a>`;
        });

        // Blockquotes
        html = html.replace(/^&gt; (.*)$/gm, '<li data-quote="1">$1</li>');
        html = html.replace(/((?:<li data-quote="1">.*<\/li>\n?)+)/g, (m) =>
            `<blockquote>${m.replace(/<\/?li[^>]*>/g, ' ')}</blockquote>`);

        // Paragraphs
        html = html.split(/\n{2,}/).map(block => {
            const trimmed = block.trim();
            if (!trimmed) {
                return '';
            }
            if (/^<(h\d|ul|ol|div|blockquote|table)/.test(trimmed) || trimmed.startsWith('@@CODE')) {
                return trimmed;
            }
            return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
        }).join('\n');

        // Restore code blocks with highlighting
        html = html.replace(/@@CODE(\d+)@@/g, (_match, index) => {
            const block = codeBlocks[Number(index)];
            const aliases = {
                blade: 'html', sh: 'bash', yml: 'yaml',
                neon: 'yaml', env: 'ini', apache: 'apache', nginx: 'nginx',
                powershell: 'bash', ps1: 'bash', text: 'plaintext'
            };
            const lang = aliases[block.language] || block.language;
            let highlighted = this.escapeHtml(block.code);
            if (typeof hljs !== 'undefined') {
                try {
                    highlighted = hljs.highlight(block.code, { language: lang }).value;
                } catch (_e) {
                    // Unknown language — fall back to escaped raw code
                }
            }
            return `<div class="code-block">
                <div class="code-block-header"><span class="code-label">${block.language}</span></div>
                <pre><code class="language-${lang}">${highlighted}</code></pre>
            </div>`;
        });

        return { html, headings };
    },

    updateTOC(headings) {
        const tocList = document.getElementById('tocList');
        tocList.innerHTML = '';

        if (headings.length === 0) {
            tocList.innerHTML = '<li class="toc-item"><em style="color: var(--text-secondary); font-size: 0.9rem;">No headings</em></li>';
            return;
        }

        headings.forEach(heading => {
            const li = document.createElement('li');
            li.className = `toc-item level-${heading.level}`;
            const link = document.createElement('a');
            link.href = `#${heading.id}`;
            link.className = 'toc-link';
            link.textContent = heading.title;
            li.appendChild(link);
            tocList.appendChild(li);
        });
    },

    search() {
        const query = document.getElementById('searchInput').value.toLowerCase();
        if (!query) {
            this.showHome();
            return;
        }

        const results = this.files.filter(file =>
            file.name.toLowerCase().includes(query) ||
            file.category.toLowerCase().includes(query) ||
            file.file.toLowerCase().includes(query)
        );

        if (results.length === 0) {
            this.showView('emptyView');
            return;
        }

        const resultsContainer = document.getElementById('searchResults');
        resultsContainer.innerHTML = '';
        results.forEach(file => {
            const card = document.createElement('a');
            card.href = '#';
            card.className = 'category-card';
            card.innerHTML = `
                <div class="category-card-title">${file.name}</div>
                <div class="category-card-count">${file.category}</div>
            `;
            card.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadFile(file.path, file.name);
            });
            resultsContainer.appendChild(card);
        });

        this.showView('searchView');
        this.updateTOC([]);
    },

    showView(viewId) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(viewId).classList.add('active');
    },

    setupEventListeners() {
        document.getElementById('brandLink').addEventListener('click', (e) => this.showHome(e));
        document.getElementById('backFromCategory').addEventListener('click', (e) => this.showHome(e));
        document.getElementById('backFromFile').addEventListener('click', (e) => this.showHome(e));
        document.getElementById('backFromSearch').addEventListener('click', (e) => this.showHome(e));

        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', () => this.search());

        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
        });

        const scrollToTopBtn = document.getElementById('scrollToTop');
        window.addEventListener('scroll', () => {
            scrollToTopBtn.classList.toggle('visible', window.scrollY > 300);
        });
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
};

app.init();
