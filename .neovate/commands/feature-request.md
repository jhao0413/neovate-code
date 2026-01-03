---
description: Create a feature request issue on GitHub
---

Create a GitHub feature request issue for this project. Follow this process:

1. Ask the user to describe the problem this feature would solve
2. Ask for their proposed solution
3. Ask if they've considered any alternatives (this is optional)
4. Use AskUserQuestion tool to select importance with these options:
   - nice to have
   - would make my life easier
   - i cannot use TNF without it
5. Ask if they have any additional context to add (optional)
6. Format the information into a structured feature request with sections:
   - Problem
   - Solution
   - Alternatives (if provided)
   - Importance
   - Additional Information (if provided)
7. Show the formatted issue to the user and ask for confirmation
8. Create the issue using: gh issue create --title "[Feature Request]: <brief_summary>" --body "<formatted_body>"

If gh CLI is not available or not authenticated, inform the user how to set it up.
