---
title: Hello World - Data Engineering in the future
date: 2026-02-28
tags: meta, personal
summary: Welcome to my blog. A space for thoughts on data engineering, side projects, and things I'm learning along the way.
status: Published
---

# Hello World

> Data Engineers build systems that make data trustworthy

It's 2026 and I am on parental leave with my first child (I'm bouncing him in his bouncer as I write this). I decided to start this blog to document some projects I am using to keep sane and to push my comfort zone with new AI tools.

The boundaries between Data Engineering and full-stack software engineering are collapsing as new AI tools like Claude Code allow us to develop across stacks and functions. Data engineers no longer need to wait on bandwidth from partner teams to improve the foundations of our data... logging and client code.

To keep up with this new reality I've decided to create this blog where I'll be documenting the tools and processes I use while I tackle projects that fall outside the typical data engineering domain of pipelines, logging, and visualizations... starting with building and deploying this website itself.


## Who am I?

> At startups, any answer to a data question starts with a data engineering job

My name is Matthew Cleveland, I am a husband and new father, a tinkerer and a builder. I like to answer questions with data and build systems that stand the test of time.

I studied Economics at UC Berkeley (Go Bears!) where I learned the value of answering analytical questions with data and the skills to collect and analyze it myself.

After university I spent a year and a half as a data analyst at a fast-paced fintech startup. At startups, any answer to a data question starts with a data engineering job. My time at this startup is where I developed my passion for Data Engineering and the first taste of the types of problems data engineers solve.

> Trillions of data points that must be ingested, processed, and validated

A data engineer ***builds the systems that make data trustworthy***, so when you spend 10 minutes watching Reels, that "10 minutes" is accurately counted, processed quickly, and delivered to the teams that make decisions - all within a strict timeframe.

The last 4 years I've worked as a Data Engineer at Instagram on the Ecosystems team, which is responsible for company critical engagement and growth metrics like Time Spent and DAU.

These datasets are stitched together from thousands of records per person per day. With more than 2 billion users that means trillions of data points that must be ingested, processed, and validated.

> Teams need data to make better business decisions

When I joined Instagram I inherited a mess. The metric I owned — Time Spent — measured *where* people spend their attention across the app. It is one of the most important numbers in the company. And it was two days late, almost every week.

A bad Monday would mean engineering leads couldn't diagnose a launch regression until Wednesday night. By then the data was stale and the window to act had narrowed. I spent the first year just keeping the lights on. Then we got the green light to rebuild it properly.

We consolidated the disparate sources into a single unified logging table — building answers in at write time rather than scrambling to join them later. We cut expensive metric definitions that nobody used. We parallelized the aggregation jobs and moved large jobs from Presto to Spark. We introduced deterministic sampling - a method which randomly chooses a small but consistent basket of users to process less data while preserving trends - so teams could get a read on the data hours before the full run completed. We built our data validation steps as near to logtime as possible to balance speed with accuracy, because a two-day delay is bad, but a wrong number that ships on time is worse.

Launching a project this size can never go without a hitch... we discovered the legacy pipeline had a field inheritance setup that relied on reading events in a certain order which wasn't preserved when we unified the source tables. During our investigation we happened upon a startling revelation... for some OS systems the legacy pipeline was reading events in the wrong order! For the past 3 years we had been misattributing time to a catch-all 'other' bucket.

The technical fix was easy, correct the event ordering and use a deterministic sorting to ensure this couldn't happen again. However, a sudden change in a key reporting metric requires large scale communication. We worked with Data Scientists to create a "what-if" dataset which corrected the faulty trend so we could adjust experiments accordingly and we broadcast the changes widely so partner teams weren't caught off guard. Now our metrics not only ran faster... they are more accurate too.

Four years later, that same dataset lands by Tuesday midday — the lightweight sample before New York starts work Tuesday morning. Building systems that quietly make other people's work easier is what I love about this job. And now, with a new set of tools, I'm curious what else I can build.


## What's Next

> I'm itching to get in on the action

2025 was a whirlwind year. My wife and I bought a condo and moved closer to our parents in Menlo Park, we got pregnant and had a wonderful baby boy. As parental leave began I had a sinking feeling... "am I going on leave at the exact moment my job changes forever? Will I be able to keep up with the rapid changes in AI and continue to compete when I return? Will I even recognize my job when I get back?"

In mid-2025 an internal tool called DevMate - an LLM powered coding assistant - launched and went from slow and inconsistent to becoming responsible for the first drafts of nearly every diff which I could quickly iterate on. One-off anecdotes in December of a useful tool called Claude Code became a torrent of testimonials by February. I reached out and my colleagues confirmed my suspicion, these tools have improved more during the first two-months of my leave than they had all of the previous year... the progress is becoming exponential. I found myself itching to get in on the action.

So I purchased a new computer, signed up for a Claude Pro subscription and a few prompts later I am writing this blog preparing to ship this site all while bouncing my baby.

While this first version of the site is fairly basic, I plan to use it to host the projects I build using claude and to use this blog to document the ways my Agentic workflow evolves with these projects.

My next post will be about how I am using Claude Agents to review and edit this blog post itself and the automations that can speed up this process... so stay tuned!
