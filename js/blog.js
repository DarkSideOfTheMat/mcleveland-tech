// ── Nav scroll ──────────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ── Theme toggle ────────────────────────────────────────────────
(function () {
    const toggle = document.getElementById('theme-toggle');
    const root = document.documentElement;

    function getPreferred() {
        const stored = localStorage.getItem('theme');
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function applyTheme(theme) {
        if (theme === 'light') {
            root.setAttribute('data-theme', 'light');
        } else {
            root.removeAttribute('data-theme');
        }
        localStorage.setItem('theme', theme);
    }

    applyTheme(getPreferred());

    if (toggle) {
        toggle.addEventListener('click', () => {
            const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
            applyTheme(current === 'light' ? 'dark' : 'light');
        });
    }
})();

// ── Minimal Markdown Parser ─────────────────────────────────────
(function () {
    function parseMarkdown(src) {
        // Strip front matter
        src = src.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');

        var lines = src.split('\n');
        var html = [];
        var i = 0;

        while (i < lines.length) {
            var line = lines[i];

            // Fenced code block
            if (line.match(/^```/)) {
                var lang = line.slice(3).trim();
                var code = [];
                i++;
                while (i < lines.length && !lines[i].match(/^```/)) {
                    code.push(escapeHtml(lines[i]));
                    i++;
                }
                i++; // skip closing ```
                html.push('<pre class="code-block' + (lang ? ' lang-' + lang : '') + '">' +
                    (lang ? '<span class="code-lang">' + lang + '</span>' : '') +
                    '<code>' + code.join('\n') + '</code></pre>');
                continue;
            }

            // Heading
            var hMatch = line.match(/^(#{1,6})\s+(.+)/);
            if (hMatch) {
                var level = hMatch[1].length;
                html.push('<h' + level + '>' + inlineFormat(hMatch[2]) + '</h' + level + '>');
                i++;
                continue;
            }

            // Horizontal rule
            if (line.match(/^(\*{3,}|-{3,}|_{3,})\s*$/)) {
                html.push('<hr>');
                i++;
                continue;
            }

            // Blockquote
            if (line.match(/^>\s?/)) {
                var bq = [];
                while (i < lines.length && lines[i].match(/^>\s?/)) {
                    bq.push(lines[i].replace(/^>\s?/, ''));
                    i++;
                }
                html.push('<blockquote>' + inlineFormat(bq.join(' ')) + '</blockquote>');
                continue;
            }

            // Unordered list
            if (line.match(/^[-*+]\s+/)) {
                var items = [];
                while (i < lines.length && lines[i].match(/^[-*+]\s+/)) {
                    items.push('<li>' + inlineFormat(lines[i].replace(/^[-*+]\s+/, '')) + '</li>');
                    i++;
                }
                html.push('<ul>' + items.join('') + '</ul>');
                continue;
            }

            // Ordered list
            if (line.match(/^\d+\.\s+/)) {
                var oItems = [];
                while (i < lines.length && lines[i].match(/^\d+\.\s+/)) {
                    oItems.push('<li>' + inlineFormat(lines[i].replace(/^\d+\.\s+/, '')) + '</li>');
                    i++;
                }
                html.push('<ol>' + oItems.join('') + '</ol>');
                continue;
            }

            // Empty line
            if (line.trim() === '') {
                i++;
                continue;
            }

            // Paragraph — collect consecutive non-empty lines
            var para = [];
            while (i < lines.length && lines[i].trim() !== '' &&
                !lines[i].match(/^(#{1,6}\s|```|>\s?|[-*+]\s+|\d+\.\s+|(\*{3,}|-{3,}|_{3,})\s*$)/)) {
                para.push(lines[i]);
                i++;
            }
            html.push('<p>' + inlineFormat(para.join(' ')) + '</p>');
        }

        return html.join('\n');
    }

    function escapeHtml(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function inlineFormat(text) {
        // Images: ![alt](src)
        text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">');
        // Links: [text](url)
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
        // Bold: **text** or __text__
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');
        // Italic: *text* or _text_
        text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
        text = text.replace(/_(.+?)_/g, '<em>$1</em>');
        // Inline code: `text`
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
        return text;
    }

    // ── Blog App ────────────────────────────────────────────────

    var listEl = document.getElementById('blog-list');
    var postEl = document.getElementById('blog-post');
    var listSection = document.getElementById('blog-listing');
    var postSection = document.getElementById('blog-reader');

    var params = new URLSearchParams(window.location.search);
    var postSlug = params.get('post');

    if (postSlug) {
        showPost(postSlug);
    } else {
        showListing();
    }

    function showListing() {
        listSection.style.display = '';
        postSection.style.display = 'none';

        fetch('blog/posts.json')
            .then(function (r) { return r.json(); })
            .then(function (posts) {
                if (posts.length === 0) {
                    listEl.innerHTML = '<p class="blog-empty">No posts yet. Check back soon.</p>';
                    return;
                }
                listEl.innerHTML = posts.map(function (p) {
                    return '<a href="blog.html?post=' + p.slug + '" class="blog-card">' +
                        '<div class="blog-card-meta">' +
                            '<time>' + formatDate(p.date) + '</time>' +
                            '<span class="blog-card-dot">·</span>' +
                            '<span>' + p.readingTime + '</span>' +
                        '</div>' +
                        '<h2 class="blog-card-title">' + escapeHtml(p.title) + '</h2>' +
                        '<p class="blog-card-summary">' + escapeHtml(p.summary) + '</p>' +
                        '<div class="blog-card-tags">' +
                            p.tags.map(function (t) {
                                return '<span class="blog-tag">' + escapeHtml(t) + '</span>';
                            }).join('') +
                        '</div>' +
                    '</a>';
                }).join('');
            })
            .catch(function () {
                listEl.innerHTML = '<p class="blog-empty">Failed to load posts.</p>';
            });
    }

    function showPost(slug) {
        listSection.style.display = 'none';
        postSection.style.display = '';

        fetch('blog/posts.json')
            .then(function (r) { return r.json(); })
            .then(function (posts) {
                var meta = posts.find(function (p) { return p.slug === slug; });
                if (!meta) {
                    postEl.innerHTML = '<p class="blog-empty">Post not found.</p>';
                    return;
                }
                return fetch(meta.file)
                    .then(function (r) { return r.text(); })
                    .then(function (md) {
                        var headerHtml =
                            '<a href="blog.html" class="blog-back">← All Posts</a>' +
                            '<div class="blog-post-meta">' +
                                '<time>' + formatDate(meta.date) + '</time>' +
                                '<span class="blog-card-dot">·</span>' +
                                '<span>' + meta.readingTime + '</span>' +
                                '<span class="blog-card-dot">·</span>' +
                                '<span>' + meta.wordCount + ' words</span>' +
                            '</div>' +
                            '<div class="blog-post-tags">' +
                                meta.tags.map(function (t) {
                                    return '<span class="blog-tag">' + escapeHtml(t) + '</span>';
                                }).join('') +
                            '</div>';

                        postEl.innerHTML = headerHtml + '<article class="blog-article">' + parseMarkdown(md) + '</article>';
                    });
            })
            .catch(function () {
                postEl.innerHTML = '<p class="blog-empty">Failed to load post.</p>';
            });
    }

    function formatDate(dateStr) {
        if (!dateStr) return '';
        var parts = dateStr.split('-');
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[parseInt(parts[1], 10) - 1] + ' ' + parseInt(parts[2], 10) + ', ' + parts[0];
    }
})();
