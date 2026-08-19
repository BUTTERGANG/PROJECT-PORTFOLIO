---
project: Photo File Copier
repo: BUTTERGANG/photo-file-copier
visibility: public
demo_url: ""
demo_type: live
cluster: photo
tier: advanced
status: live
---

# Photo File Copier
**One-liner:** A lightweight macOS desktop app that copies photo selects out of a shoot folder — by pasted shot numbers or in bulk — so culling a gallery stops meaning dragging files by hand.

## Origin (the Build Loop)
> Because I **shoot and cull photo galleries for LA Media**, I kept hitting **the tedium of pulling the keeper shots out of a huge shoot folder one drag at a time**, so I built **a macOS app that copies selects by pasted shot number or in bulk**, that **turns a manual, error-prone step into a paste-and-go**, It taught me **that the smallest tools that shave minutes off a repeated task are worth building — this one saves time on every single shoot.**

## The problem
After a shoot you review the take and pick keepers. Getting just those files from the source folder to a delivery folder means either dragging them individually (slow, easy to misclick) or over-copying everything. When you review selects in Apple Notes as a list of shot numbers, there's no clean bridge from that list to the files.

## What it does
- Paste keeper shot numbers (e.g. `1765`, `1772`, `1801`) from Apple Notes and copy exactly those files.
- Or copy **every** supported media file from the source folder(s) in one go.
- Copies cleanly to an output folder — no duplicates, no manual dragging.
- Supports multiple source folders.

## How it's built
- **Stack:** Python 3.11 + tkinter (native macOS desktop app, macOS 11 Big Sur or later).
- **Notable engineering:** parses a pasted, messy shot-number list into file matches; dedup-safe copying; a real packaged desktop GUI rather than a script.
- **Architecture:** tkinter GUI → parse shot list / enumerate media → match against source folder(s) → clean copy to output.

## Proof points
- Solves a literal LA Media production step used on every shoot.
- Native desktop app (tkinter), not a terminal script.
- Public and installable.

## What to show
- **Demo:** It's a desktop app, so "demo" = a short screen-recording or screenshots plus the public repo/download, not a hosted URL.
- **Visuals needed:** the app window; a before/after of a paste → copied-selects run.

## Cross-links
- Photo/LA Media cluster with [LIGHTLOG](lightlog.md), [la-media-dashboard](la-media-dashboard.md), and [LA-MEDIA-WEBSITE](la-media-website.md).

## Case-study angle
The clearest micro-example of the Build Loop: a repeated 5-minute annoyance in the photo workflow became a small native app that removes it entirely. Not flashy — just exactly the kind of thing an operator builds for himself.
