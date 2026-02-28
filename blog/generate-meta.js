#!/usr/bin/env node
// ============================================================================
// generate-meta.js — Auto-generate blog post metadata
//
// Scans all .md files in blog/posts/, extracts front matter and computes
// derived metadata (slug, word count, reading time), then writes posts.json.
//
// Usage:
//   node blog/generate-meta.js
//
// Run this after adding or editing any blog post.
// ============================================================================

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, 'posts');
const OUTPUT = path.join(__dirname, 'posts.json');
const WORDS_PER_MINUTE = 200;

function parseFrontMatter(content) {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return { meta: {}, body: content };

    const raw = match[1];
    const meta = {};

    for (const line of raw.split('\n')) {
        const idx = line.indexOf(':');
        if (idx === -1) continue;
        const key = line.slice(0, idx).trim();
        let val = line.slice(idx + 1).trim();
        meta[key] = val;
    }

    const body = content.slice(match[0].length).trim();
    return { meta, body };
}

function countWords(text) {
    // Strip markdown syntax for a cleaner word count
    const cleaned = text
        .replace(/```[\s\S]*?```/g, '')    // remove code blocks
        .replace(/`[^`]+`/g, '')           // remove inline code
        .replace(/!?\[.*?\]\(.*?\)/g, '')  // remove links/images
        .replace(/[#*_>~\-|]/g, '')        // remove markdown chars
        .replace(/\s+/g, ' ')
        .trim();
    return cleaned ? cleaned.split(/\s+/).length : 0;
}

function readingTime(wordCount) {
    const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
    return `${minutes} min read`;
}

function generateSlug(filename) {
    return filename.replace(/\.md$/, '');
}

// ── Main ────────────────────────────────────────────────────────────────────

const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));

const posts = files.map(file => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
    const { meta, body } = parseFrontMatter(raw);
    const words = countWords(body);
    const slug = generateSlug(file);

    return {
        slug,
        title:       meta.title || slug,
        date:        meta.date || null,
        tags:        meta.tags ? meta.tags.split(',').map(t => t.trim()) : [],
        summary:     meta.summary || '',
        wordCount:   words,
        readingTime: readingTime(words),
        file:        `blog/posts/${file}`
    };
});

// Sort newest first
posts.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.localeCompare(a.date);
});

fs.writeFileSync(OUTPUT, JSON.stringify(posts, null, 2) + '\n');

console.log(`✓ Generated metadata for ${posts.length} post(s) → ${OUTPUT}`);
posts.forEach(p => {
    console.log(`  • ${p.slug}  (${p.readingTime}, ${p.wordCount} words)`);
});
