---
title: Building This Site Pt. 1 - Simple Foundations
date: 2026-03-05
tags: claude_code, building_this_site 
summary: My first simple steps with Claude
status: In_Review
---

# Simple Foundations

> Tools like Claude are powerful out of the box

## The Power of Simple Conversations

Out of the box, simple conversations with Claude can get you 80% of the way there, but the last 20% requires judgement.

### My first conversation with Claude

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

![A generic AI generated portfolio landing page that only loosely resembles the current site](blog/assets/building-this-site-pt-1/claude-output.png)

While I felt the style of the page was generic, it was convincing enough to pull the trigger on a Claude Pro subscription to begin the project in ernest. 

Using the generated `index.html` and `monokai_theme.css` files as building blocks I began refining the site using similar conversational approach to make iterative changes until I was happy with the results...

You can see a comparison with the [current darkmode landing page](https://darksideofthemat.github.io/mcleveland-tech/index.html) (as of writing this). Once again, Claude generated the initial structure and I provided feedback conversationally refining the colors, layout and content. New features were added and iteratively refined in the same manner.

![The current landing page with similar colors and "hero section" but little other overlap](blog/assets/building-this-site-pt-1/current-landing-page.png)

You can see the [feature branch to build this here](https://github.com/DarkSideOfTheMat/mcleveland-tech/tree/claude/redesign-landing-page-EOmEO)

This approach was faster than coding by hand but required hand-holding. Using this approach Claude has no way to review its own output so bug fixes required manual inspection and intervention... design decisions so far have required a human touch.

### Building the Claude Conversation Renderer

I used a simple iterative conversation like this to create custom rendering for the Claude conversation box above, all it took was a simple prompt to add and a few followups to adjust it to my liking.

``` Claude
> I want to modify how markdown renders codeblocks when I start with the tag 'Claude'                                              
>                                                                       
> I want text following '>' to use the string format and I want the rest of the text formatted as markdown using monokai colors accents

**...**

Done!
What each element renders as:

  
  |  Markdown   |                 Monokai Color                  |
  | --- | --- |
  | > text      | Yellow (--color-string) — string literal style |
  | --- | --- |
  | **bold**    | Pink (--color-keyword)                         |
  | --- | --- |
  | *italic*    | Green (--color-function)                       |
  | --- | --- |
  | `code`      | Purple (--color-number)                        |
  | --- | --- |
  | [link](url) | Cyan (--color-type)                            |
  | --- | --- |
  | Plain text  | Default text color                             │

  The > prompt marker itself renders in muted gray and is aria-hidden
  so screen readers skip it. Both dark and light themes work
  automatically since everything uses CSS custom properties.

**\✻ Worked for 1m 51s**

> Good I like this so far... lets just adjust it so the '>' tag gets removed and the yellow text renders as right aligned so it looks like a conversation

**...**

> okay we're really close... now just give it a text bubble around that. treat subsequent lines starting with > as part of the same bubble

**...**
**✻ Sautéed for 1m 4s**

> change the code symbols to render using orange instead of purple

**...**

> lets swap the code-block and strong colors... claude has a orange color scheme and we use bold more often than code blocks

**...** *after reviewing this how this post renders I went in for some bug fixes*

> fix the markdown table rendering in the claude conversation codeblock
**...**
**✻ Cogitated for 51s**

```
some more back-and-forth later and we've arrived at the rendering you see in this post

## Take Away

> A simple conversational approach to Claude can generate useful artifacts quickly

We can see that simple conversational approaches to Claude can generate useful artifacts quickly. This entire process took only a few minutes and didn't use Claude Code or its advanced features.

However... the generated site is very generic and while some of the initial layout was usable most of the content wasn't the style I was looking for...

While simple conversations with Claude or Claude Code are powerful out of the box, they require a lot of manual back-and-forth... and there is no guarantee of getting the results you want.

> simple conversations can be a powerful way to template or iterate on code where we only need to make minor tweaks

In data engineering, these simple conversations can be a powerful way to template or iterate on code where we only need to make minor tweaks. Simple prompts like `change the schedule of this dag to run once every third tuesday` or `move this subquery into a CTE so we can reuse it` can yield quick results and alleviate the mental load of simple tasks while you tackle more complicated themes.

At Meta, I used this kind of simple conversation pattern to refactor pipelines 

With Claude Code, you can blaze through the first 80% of a project with little effort... but the last 20% takes human judgement and sometimes more advanced features.

Next time we'll be looking at some of these advanced features like Skills and Agents to improve these conversations and start laying the building blocks of automation.


### Bonus fact...

I used Claude Code to generate custom Markdown rendering for these Claude conversations... I want to show how I actually use Claude in practice as an accurate reflection of how I am refining my techniques. I hope you enjoy it!
