---
name: Astro workflow foreground mode
description: Why Astro development servers must be forced into foreground mode under Replit workflows.
---

Set `ASTRO_DEV_BACKGROUND=0` for the Astro development-server process used by
the Replit webview workflow.

**Why:** Recent Astro versions detect AI-agent environments and automatically
launch `astro dev` as a background server. The command then exits successfully,
so Replit marks the workflow as finished and the preview can appear unavailable
even while Astro reports a background server.

**How to apply:** Keep the environment override on the foreground `astro dev`
invocation whenever changing development scripts or workflow commands. Verify
that the Replit workflow remains `RUNNING`, rather than only checking for an
HTTP response.