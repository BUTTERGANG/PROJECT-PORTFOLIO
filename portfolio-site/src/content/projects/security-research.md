---
project: Security Research & Pentest Tooling
repo: ""
visibility: off-repo (private framework + HackerOne)
demo_url: ""
demo_type: case-study-only
cluster: infra
tier: advanced
status: live
---

# Security Research & Pentest Tooling
**One-liner:** A personal penetration-testing framework, custom MCP servers for Kali Linux and Metasploit, and real HackerOne submissions — applied security R&D, not CTF hobby work.

## Origin (the Build Loop)
> Because I **was learning offensive security and running real recon**, I kept hitting **the friction of driving heavy tools (Kali, Metasploit) by hand across a dozen terminals**, so I built **MCP servers that let an AI agent drive those tools, plus a structured pentest framework in Obsidian**, that **turn scattered manual steps into a repeatable, agent-assisted workflow**. It taught me **how attackers actually think — which is exactly the perspective that makes defensive and operational judgment sharper.**

## The problem
Security tooling is powerful but fragmented — Kali utilities, Metasploit modules, recon scripts, note-taking, reporting, all in separate places. Doing real work means constantly context-switching. I wanted to wire the tools into a single agent-driven loop and keep disciplined notes, so findings were reproducible and reportable rather than one-off terminal sessions.

## What it does
- **Custom MCP servers** for Kali Linux and Metasploit — expose the tooling to an AI agent so pentest steps can be orchestrated rather than hand-typed.
- **Obsidian-based pentest framework** — a structured methodology vault: engagement notes, WSTG-style coverage, findings, and reporting.
- **Real submissions** — 5 security research reports submitted to HackerOne programs.
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
- 5 HackerOne report submissions.
- PicoCTF solves including heap exploitation and RSA key recovery.
- Structured, repeatable methodology rather than ad-hoc testing.

## What to show
- **Demo:** None — this is security research and private tooling. **Case-study-only.**
- **Visuals needed:** a redacted HackerOne submission summary (respect any non-disclosure); a screenshot of the Obsidian framework structure; a short diagram of the agent → MCP → Kali/Metasploit loop. Confirm which findings are disclosed before showing specifics.

## Cross-links
- Shares the **MCP-server-building** skill with [Hermes](hermes.md) and the broader AI-tooling work.
- Complements [Home Infrastructure](home-infrastructure.md) — the same OS/network-level comfort.

## Case-study angle
Frame as applied security R&D: Alex didn't just run tools, he built the integration layer to orchestrate them and carried real findings through to HackerOne reports — the attacker's-eye view that makes an operator better at protecting the systems he runs.
