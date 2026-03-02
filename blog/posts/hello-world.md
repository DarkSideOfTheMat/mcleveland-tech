---
title: Hello World - Data Engineering in the future
date: 2026-02-28
tags: meta, personal
summary: Welcome to my blog. A space for thoughts on data engineering, side projects, and things I'm learning along the way.
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

The last 4 years I've worked as a Data Engineer at Instagram on the Ecosystems team, which is responsible for company critical engagement and growth metrics like Time Spent and DAU. I've spent my tenure at Instagram as the primary maintainer of the Time Spent data domain which measures *where* people spend their time.

These datasets are stitched together from thousands of records per person per day. With more than 2 billion users that means trillions of data points that must be ingested, processed, and validated.

> Teams need data to make better business decisions

When I first joined Instagram, this process was flakey and slow. Repeated task failures, upstream data delays, and shear data volume meant Time Spent metrics were frequently delayed 2+ days... the data from Monday wouldn't be available until Wednesday evening or Thursday morning. Data would come from disparate tables with inconsistent field coverage and definitions making investigations slow and frustrating.

During my time at Instagram we rebuilt this system. By consolidating data sources into unified logging tables and enriching fields at logtime we removed expensive and slow joins. Deprecating under-utilized and expensive metric definitions like n-day rolling averages simplified our pipelines and using multiple lower cardinality semi-aggregates allowed us to parallelize aggregation jobs. Deterministic user sampling allowed us to process less data while presenting a representative trend.

Now this data is regularly available midday the next day... Monday's full dataset would be available by Tuesday evening and the light-weight representative sample would be ready before New York gets to work at 8 Tuesday morning. Having this data available means teams are able to quickly find and fix bugs, leads can monitor the performance of product launches, and teams are able to make better business decisions.


## What's Next

> I'm itching to get in on the action

2025 was a whirlwind year. My wife and I bought a condo and moved closer to our parents in Menlo Park, we got pregnant and had a wonderful baby boy.

At work a tool called DevMate - an LLM powered coding assistent - launched and went from slow and inconsistent to one-shot implementing projects that would take me 3+ weeks by hand. One-off annecdotes in December of a useful tool called Claude Code became a torrent of testimonials by Feburary. I found myself itching to get in on the action myself. 

So I purchased a new computer, signed up for a Claude Pro subscription and a few prompts later I am writing this blog preparing to ship this site all while bouncing my baby.

While this first version of the site is fairly basic, I plan to use it to host the projects I build using claude and to use this blog to document the ways my Agentic workflow evolves with these projects.

My next post will be about how I am using Claude Agents to review and edit this blog post itself and the automations that can speed up this process... so stay tuned~!
