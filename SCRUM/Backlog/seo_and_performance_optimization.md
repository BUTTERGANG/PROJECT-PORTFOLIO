---
status: backlog
priority: P2
agent_claimed: null
claimed_at: null
updated: 2026-08-20
---

# SEO and Performance Optimization

> **Repo:** PROJECT-PORTFOLIO
> **Description:** Lighthouse score improvements, structured data, and sitemap generation

---

## Context

Portfolio site needs to rank well and load fast for recruiter and client visits.

---

## Acceptance Criteria

- [ ] Lighthouse score 95+ on all categories
- [ ] Structured data (JSON-LD) for projects and person schema
- [ ] Auto-generated sitemap.xml with lastmod dates
- [ ] Image optimization pipeline (WebP, lazy loading, responsive sizes)

---

## Technical Notes

- Astro's built-in optimization; sharp for image transforms; astro-seo for meta tags
