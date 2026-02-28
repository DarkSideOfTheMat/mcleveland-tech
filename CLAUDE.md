# CLAUDE.md

## Project Overview
Personal portfolio/resume website for Matthew Cleveland, Data Engineer.

## Tech Stack
- Pure HTML5, CSS3, vanilla JavaScript — no frameworks, no build tools
- No package manager (no npm/yarn/pip)

## Running Locally
Open `index.html` directly in a browser — no server required.

## Project Structure
```
index.html          # Homepage (complete)
about.html          # About page (stub — in progress)
projects.html       # Projects page (stub — in progress)
contact.html        # Contact page (complete)
blog.html           # Blog page (complete)
css/
  monokai-theme.css # All CSS custom properties/variables live here
js/
  main.js           # Shared/homepage JS
  projects.js       # Projects page JS
  contact.js        # Contact page JS
  blog.js           # Blog page JS (markdown parser + post loader)
blog/
  posts.json        # Auto-generated post metadata (run generate-meta.js)
  generate-meta.js  # Node script: scans posts/, writes posts.json
  posts/            # Markdown blog posts with YAML front matter
    hello-world.md  # Example post
images/
  MC.png            # Logo
```

## Coding Conventions
- **Theme:** Always use the CSS custom properties defined in `css/monokai-theme.css` for colors. Never hardcode hex values.
- **Vanilla only:** Do not add JavaScript frameworks (React, Vue, etc.) or CSS frameworks (Bootstrap, Tailwind).
- **No new CDN links:** Avoid adding external `<script>` or `<link>` tags from CDNs.
- **Responsive:** All new UI must be mobile-responsive.
- **Consistency:** Match the existing Monokai dark aesthetic for all new pages.

## Blog Workflow
1. Create a new `.md` file in `blog/posts/` with YAML front matter:
   ```
   ---
   title: Post Title
   date: YYYY-MM-DD
   tags: tag1, tag2
   summary: A one-line description of the post.
   ---
   ```
2. Run `node blog/generate-meta.js` to regenerate `blog/posts.json`
3. The blog page reads `posts.json` and renders posts client-side

## Current Priorities
1. Projects page (`projects.html` + `js/projects.js`)
2. About page (`about.html`)
3. Contact page (`contact.html` + `js/contact.js`)
