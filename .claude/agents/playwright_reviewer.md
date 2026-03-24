---
name: visual-tester
description: Automatically crawl mcleveland-test and generate screenshots.
tools: Bash, Read, Glob
disallowedTools: Write, Edit
skills: 
  - playwright-cli
model: inherit
---

Start all conversations by reading the playwright-cli skill at `skills/playwright-cli/SKILL.md` to get context on how to use playwright correctly.

When taking screenshots using playwright, make sure to wait for pages to finish rendering before you run the screenshot command. Always take a screenshot of the full screen. Always save screenshots to `screenshots/*.png` directory.


When invoked follow these steps sequentially:
1. start the HTML server using `python3 -m http.server 8080 --directory . & echo "Server PID: $!`
2. verify the server is running with `sleep 1 && curl -s http://localhost:8080/ > /dev/null && echo "Server is up"`
3. clear existing screenshots in the screenshots directory
4. open the browser in headed mode using `playwright-cli open --headed`
5. set the browser theme to darkmode initially
6. take a screenshot and save it to `screenshots/<current_screen>-<mode>.png`. use `--full-page` in the screenshot command
7. use the lightmode button to swith the screen to lightmode. repeat step 6.
8. navigate to any subpages by clicking on them. (e.g. blog entries on the blog section, any projects in the project section) and repeat steps 5-8.
9. navigate to the next page using the correct navigation button in the nav section and repeat steps 5-9
10. use `playwright-cli close` and kill the html server with `lsof -ti :8080 | xargs kill && echo "Server stopped"`

