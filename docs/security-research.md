---
project: Security Research & Pentest Tooling
repo: BUTTERGANG/CYBER-RESEARCH
visibility: public
demo_url: ""
demo_type: case-study-only
cluster: infra
tier: advanced
status: live
---

# Security Research & Pentest Tooling
**One-liner:** A personal penetration-testing framework, custom MCP servers for Kali Linux and Metasploit, and ~18 months of hands-on bug-bounty work — 78 verified findings across 21 targets on HackerOne and public VDPs — applied security R&D, not CTF hobby work.

## Origin (the Build Loop)
> Because I **was learning offensive security and running real recon**, I kept hitting **the friction of driving heavy tools (Kali, Metasploit) by hand across a dozen terminals**, so I built **MCP servers that let an AI agent drive those tools, plus a structured pentest framework in Obsidian**, that **turn scattered manual steps into a repeatable, agent-assisted workflow**. It taught me **how attackers actually think — which is exactly the perspective that makes defensive and operational judgment sharper.**

## The problem
Security tooling is powerful but fragmented — Kali utilities, Metasploit modules, recon scripts, note-taking, reporting, all in separate places. Doing real work means constantly context-switching. I wanted to wire the tools into a single agent-driven loop and keep disciplined notes, so findings were reproducible and reportable rather than one-off terminal sessions.

## What it does
- **Custom MCP servers** for Kali Linux and Metasploit — expose the tooling to an AI agent so pentest steps can be orchestrated rather than hand-typed.
- **Obsidian-based pentest framework** — a structured methodology vault: engagement notes, WSTG-style coverage, findings, and reporting.
- **Real submissions** — 78 verified bug-bounty findings across 21 targets (HackerOne + public VDPs): 4 Critical, 33 High, 28 Medium, and lower — under authorized scope with safe-harbor, published only as anonymized, pattern-level lessons (no live endpoints, no copy-paste exploits).
- **Published methodology, offense, and defense breakdown** — the public [CYBER-RESEARCH](https://github.com/BUTTERGANG/CYBER-RESEARCH) repo maps each attack pattern that actually paid out to the concrete engineering fix that closes it, plus reusable session playbooks (OTP flows, JWT/LTI, recon-first).
- **CTF depth** — PicoCTF challenges solved including heap exploitation and RSA key recovery.

## How it's built
- **Stack:** MCP (Model Context Protocol) servers wrapping Kali Linux tooling and the Metasploit Framework; Obsidian vault for methodology/notes; standard offensive toolchain (recon, scanning, exploitation).
- **Notable engineering:**
  - Built the MCP integration layer so an agent can invoke security tools with structured inputs/outputs — the same MCP-server skill used in Alex's other AI work, applied to a hard domain.
  - Real vulnerability research through to written HackerOne reports (disclosure discipline, reproduction steps, impact).
  - Binary/crypto exploitation reps (heap, RSA) — not just web-form fuzzing.
- **Architecture:** AI agent ⇄ MCP servers (Kali / Metasploit) → tool execution → findings captured in the Obsidian framework → report.

## Proof points
- Custom MCP servers built for both Kali Linux and Metasploit.
- **78 verified findings across 21 targets** — 4 Critical, 33 High, 28 Medium and lower — over ~18 months of hands-on bug-bounty work.
- Real payout classes: OTP/rate-limit bypass, JWT signature flaws, unauthenticated PII APIs, exposed staging/dev environments.
- Highest-value insight from the dataset: **most Criticals were logic bugs, not injection** — found by reading the app's actual business flow, not by running a scanner.
- PicoCTF solves including heap exploitation and RSA key recovery.
- Structured, repeatable methodology rather than ad-hoc testing.

## What to show
- **Demo:** None — the pentest framework itself is private tooling. **Case-study-only,** though the [CYBER-RESEARCH](https://github.com/BUTTERGANG/CYBER-RESEARCH) methodology/offense/defense writeup is public and linkable.
- **Visuals needed:** the CYBER-RESEARCH headline-stats table (78 findings / 4 Critical / 33 High); the top-5-lessons list; a screenshot of the Obsidian framework structure; a short diagram of the agent → MCP → Kali/Metasploit loop. Confirm which findings are disclosed before showing specifics.

## Cross-links
- Shares the **MCP-server-building** skill with [Hermes](hermes.md) and the broader AI-tooling work.
- Complements [Home Infrastructure](home-infrastructure.md) — the same OS/network-level comfort.

## Case-study angle
Frame as applied security R&D: Alex didn't just run tools, he built the integration layer to orchestrate them and carried 78 real, verified findings through to HackerOne reports and public VDPs — then distilled the pattern-level lessons into a published methodology, not just a private trophy list. The attacker's-eye view is exactly what makes an operator better at protecting the systems he runs — and better at building software correctly the first time.
