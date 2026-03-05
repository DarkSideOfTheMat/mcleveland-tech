---
title: Building This Site Pt. 1 - Simple Foundations
date: 2026-03-05
tags: claude_code, building_this_site 
summary: My first simple steps with Claude
status: In_Review
---

# Simple Foundations

> Tools like Claude are powerful out of the box

## My first conversation with Claude

> How Claude's free tier performs with simple tasks

I began this site before I had a subscription to Claude (or access to Claude Code for that matter). After creating an account [for Claude](claude.ai) I decided to see how Claude's free tier performs with a simple task... creating quick personal website.

I learned at work to begin with simple prompts to layout outcomes you want from Claude. In this case I kept it very brief and conversational...

``` Claude
> I want to create a personal/professional website to learn javascript and host some of my personal projects
> How should I structure this project?

Great idea! Here's how I'd approach structuring a personal/professional website project:
**...**

Want me to scaffold out any specific page or component to get you started?

> lets start with the landing page

Before I build this, I'd love to know a bit about you so the design feels personal rather than generic.

Tell me a little about yourself so I can tailor the design:

**What's your field?** (Software/Web Dev, Design/Creative, Data/ML, something else?)
**What vibe fits you?** (Clean & minimal, bold & expressive, dark & technical, warm & friendly?)
**What should the landing page let visitors do?** (Learn about you, see projects, contact you, download your resume?)

> Q: What's your field / what kind of work do you do?
> A: Data / ML / AI
> 
> Q: What vibe fits your personality best?
> A: Bold & expressive
> 
> Q: What should visitors be able to do on the landing page? (Select all that apply)
> A: Learn about me

Here's your landing page!

`index.html`

> I want to base the color scheme on the sublime3 monokai color palette

Great choice! Here's what I did...
**...**

> Now convert the color scheme into a CSS file I can use

Here are your files
`index.html`
`monokai_theme.css`

```

And here is the output

![A generic AI generated portfolio landing page that only loosely resembles the current site](blog/assets/building-this-site-pt-1/claude-output.png)

While I felt the style of the page was generic, I was plenty convinced to pull the trigger on a Claude Pro subscription to begin the project in ernest. 

Using the generated `index.html` and `monokai_theme.css` files as building blocks I began refining the site using similar conversational approach to make iterative changes until I was happy with the results...

You can see a comparison with the [current darkmode landing page](https://darksideofthemat.github.io/mcleveland-tech/index.html) (as of writing this). This landing page was generated using these files to start and a simple iterative conversation to make adjustments as needed... no coding required.

![The current landing page with similar colors and "hero section" but little other overlap](blog/assets/building-this-site-pt-1/current-landing-page.png)

You can see the [feature branch to build this here](https://github.com/DarkSideOfTheMat/mcleveland-tech/tree/claude/redesign-landing-page-EOmEO)

## Building the Claude Conversation Renderer

In fact, I used a simple iterative conversation like this to create custom rendering for the Claude conversation box above, all it took was a simple prompt to add and a few followups to adjust it to my liking.

``` Claude
> I want to modify how markdown renders codeblocks when I start with the tag 'Claude'                                              
>                                                                       
> I want text following '>' to use the string format and I want the rest of the text formatted as markdown using monokai colors accents

**...**

Done!
What each element renders as:

  ┌─────────────┬────────────────────────────────────────────────┐
  │  Markdown   │                 Monokai Color                  │
  ├─────────────┼────────────────────────────────────────────────┤
  │ > text      │ Yellow (--color-string) — string literal style │
  ├─────────────┼────────────────────────────────────────────────┤
  │ **bold**    │ Pink (--color-keyword)                         │
  ├─────────────┼────────────────────────────────────────────────┤
  │ *italic*    │ Green (--color-function)                       │
  ├─────────────┼────────────────────────────────────────────────┤
  │ `code`      │ Purple (--color-number)                        │
  ├─────────────┼────────────────────────────────────────────────┤
  │ [link](url) │ Cyan (--color-type)                            │
  ├─────────────┼────────────────────────────────────────────────┤
  │ Plain text  │ Default text color                             │
  └─────────────┴────────────────────────────────────────────────┘

  The > prompt marker itself renders in muted gray and is aria-hidden
  so screen readers skip it. Both dark and light themes work
  automatically since everything uses CSS custom properties.

**\✻ Worked for 1m 51s**
```

## Take Away

We can see that simple conversational approaches to Claude can generate useful artifacts quickly. This entire process took only a few minutes and didn't use Claude Code or its advanced features.

However... the generated site is very generic and while some of the initial layout was usable most of the content wasn't the style I was looking for...

While simple conversations with Claude or Claude Code are powerful out of the box, they require a lot of manual back-and-forth... and there is no guarantee of getting the results you want.

In data engineering, these simple converstations can be a powerful way to template or iterate on code where we only need to make minor tweaks. Simple prompts like `change the schedule of this dag to run once every third tuesday` or `move this subquery into a CTE so we can reuse it` can yield quick results and alleviate the mental load of simple tasks while you tackle more complicated themes.

What surprised me most is how little effort it took to get something 80% of the way there — and how much judgment it still takes to close that last 20%.

With Claude Code, you can blaze through the first 80% of a project with little effort... but the last 20% takes human judgement and more advanced features.

Next time we'll be looking at some of these advanced features like Skills and Agents to improve these conversations and start laying the building blocks of automation.


## Bonus fact...

I used Claude Code to generate custom Markdown rendering for these Claude conversations... I want to show how I actually use Claude in practice as an accurate reflection of how I am refining my techniques. I hope you enjoy it!
