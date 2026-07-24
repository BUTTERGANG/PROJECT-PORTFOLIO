---
project: Home Infrastructure & CCS Proxy
repo: ""
visibility: off-repo (self-hosted hardware)
demo_url: ""
demo_type: case-study-only
cluster: infra
tier: standard
status: live
---

# Home Infrastructure & CCS Proxy
**One-liner:** A self-run home stack — NAS, mesh VPN, backups, and a self-hosted multi-account AI proxy — debugged at the OS and network level.

## Origin (the Build Loop)
> Because I **run my own tools and wanted them available and backed up everywhere without renting someone's cloud**, I kept hitting **the low-level failures nobody hands you a GUI for — stale proxies, symlink path mismatches, services racing to start before the network was up**, so I built and hardened **a home infrastructure stack I own end to end**, that **keeps my data, dev environment, and AI tooling running reliably**. It taught me **to diagnose problems at the OS and network layer, not just the app layer.**

## The problem
Depending entirely on hosted services is fragile and expensive. I wanted my own always-available storage, secure remote access to it, a backup layer, and a self-hosted proxy for my AI tooling — and running that means owning the failures too: timing bugs, path mismatches, and auth conflicts that only show up at the system level.

## What it does
- **NAS storage** — a QNAP NAS (NAS834B18) as the always-on home storage core, reachable over SSH as `BLACKQNAP`.
- **Secure remote access** — Tailscale mesh VPN over a Netgear router for access from anywhere without exposing ports.
- **Backup layer** — IDrive backup on top of the NAS for off-site redundancy.
- **CCS / CLIProxy** — a self-hosted multi-account proxy for Claude/ChatGPT CLIs.

## How it's built
- **Stack:** QNAP NAS, Tailscale, Netgear router, IDrive; CCS/CLIProxy (self-hosted, Node-based) on macOS; SSH.
- **Notable engineering (the debugging résumé):**
  - Diagnosed a **stale-proxy-caused ChatGPT ban** and fixed the underlying proxy state.
  - Fixed a **Mac symlink path mismatch** (`~/.ccs/cliproxy/bin/cliproxy`) that broke the proxy binary resolution.
  - Resolved **CCS ↔ claude.ai OAuth conflicts** between multiple accounts.
  - Solved a NAS **auto-start timing bug** with a `sleep 30` guard so services waited for the network before starting.
- **Architecture:** clients → Tailscale mesh → QNAP NAS (SSH `BLACKQNAP`) with IDrive off-site backup; CCS/CLIProxy fronting the AI CLIs locally.

## Proof points
- Owns the full stack: storage, networking, VPN, backup, and an AI proxy — provisioned and maintained solo.
- A track record of OS/network-level fixes (symlinks, service timing, OAuth, proxy state), not just app config.

## What to show
- **Demo:** None — it's private home infrastructure. **Case-study-only.**
- **Visuals needed:** a simple network diagram (clients → Tailscale → QNAP + IDrive); optionally a terminal snippet of one of the fixes (redact hostnames/keys). Keep it light — this is a supporting credential, not a headline.

## Cross-links
- Same system-level comfort behind [Hermes](hermes.md) (VPS ops) and [Security Research](security-research.md).

## Case-study angle
The quiet proof behind the "self-taught builder" claim: Alex will stand up a NAS, a mesh VPN, and a self-hosted proxy, then debug them at 11pm at the symlink-and-service level — the same operator instinct he brings to a live event, pointed at his own infrastructure.
