---
title: Hello World — First Post
date: 2026-02-28
tags: meta, personal
summary: Welcome to my blog. A space for thoughts on data engineering, side projects, and things I'm learning along the way.
---

# Hello World

Welcome to my blog. I've been meaning to set this up for a while — a place to write about things I'm working on, problems I've solved, and topics I find interesting.

## What to Expect

I plan to write about:

- **Data Engineering** — pipeline design, testing strategies, and lessons from building metrics at scale
- **Side Projects** — walkthroughs and retrospectives on things I build outside of work
- **Tools & Workflow** — editors, CLI tricks, and anything that makes me faster

## Why a Blog?

Writing clarifies thinking. I've kept notes for years, but publishing forces a higher standard. If even one post helps someone else avoid a mistake I made, it's worth it.

## The Stack

This blog is intentionally simple. Markdown files in a repo, rendered client-side with vanilla JavaScript. No frameworks, no build step, no CMS. Just `git push` and it's live.

```python
# Sometimes the simplest solution is the best one
def publish(post):
    git.add(post)
    git.commit(f"publish: {post.title}")
    git.push()
```

> "Simplicity is the ultimate sophistication." — Leonardo da Vinci

Thanks for reading. More to come.
