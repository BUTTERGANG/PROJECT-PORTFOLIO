---
status: backlog
priority: P2
agent_claimed: null
claimed_at: null
updated: 2026-08-20
---

# New Case Study Addition Workflow

> **Repo:** PROJECT-PORTFOLIO
> **Description:** Streamline adding new projects with frontmatter validation and auto-preview

---

## Context

Adding a new case study currently involves multiple manual steps. Need a streamlined workflow.

---

## Acceptance Criteria

- [ ] Frontmatter template with required fields validation
- [ ] Dev mode hot-reload preview of new case studies
- [ ] Auto-generate thumbnail image from case study cover
- [ ] GitHub PR template for case study contributions

---

## Technical Notes

- Astro content collections; Zod for frontmatter validation; Image sharp for thumbnails
