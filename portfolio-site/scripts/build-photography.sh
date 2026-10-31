#!/usr/bin/env bash
# Rebuild portfolio-site/public/photography/ from the LA Media site's photo set.
#
# Source of truth for the images: BUTTERGANG/LA-MEDIA-WEBSITE →
# client/public/images/ (a checkout of that repo must sit next to this one).
# Each frame is resized and re-encoded to WebP; the curated list, alt text and
# the resulting pixel dimensions are recorded by hand in
# ../src/data/photography.ts — if you change a `-Z` width here, update the
# matching `w`/`h` there or the page will reserve the wrong box and shift.
#
# macOS only: uses `sips` (resize) + `cwebp` (encode) from Homebrew.
#
#   brew install webp
#   ./scripts/build-photography.sh
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="${LA_MEDIA_SRC:-$HERE/../../../LA-MEDIA-WEBSITE/client/public/images}"
DST="$HERE/../public/photography"

command -v cwebp >/dev/null || { echo "cwebp not found — brew install webp"; exit 1; }
[ -d "$SRC" ] || { echo "LA Media image dir not found: $SRC"; exit 1; }

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
rm -rf "$DST"; mkdir -p "$DST"/{portraits,sports,weddings,travel}

conv() { # $1=src  $2=dest-relative  $3=max-longest-side  $4=webp quality
  local out="$DST/$2" stem
  stem="$(basename "$2" .webp)"
  mkdir -p "$(dirname "$out")"
  cp "$1" "$TMP/$stem.src"
  sips -s format jpeg -s formatOptions 90 -Z "$3" "$TMP/$stem.src" --out "$TMP/$stem.jpg" >/dev/null
  cwebp -quiet -q "$4" -m 6 "$TMP/$stem.jpg" -o "$out"
}

# heroes
conv "$SRC/weddings-full-hero.jpg" "weddings/hero.webp"       1800 80
conv "$SRC/portraits-hero.jpg"     "portraits/hero.webp"      1500 80
conv "$SRC/sports-hero.jpg"        "sports/hero.webp"         1500 80
conv "$SRC/nyc/nyc-03.jpg"         "travel/hero.webp"         1500 80

# portraits
conv "$SRC/portraits-lydia.jpg"     "portraits/lydia.webp"    1000 78
conv "$SRC/portraits-lindsey.jpg"   "portraits/lindsey.webp"  1000 78
conv "$SRC/portraits-tomi.jpg"      "portraits/tomi.webp"     1000 78
conv "$SRC/portraits-dells.jpg"     "portraits/dells.webp"    1000 78
conv "$SRC/portraits-sara.jpg"      "portraits/sara.webp"     1000 78
conv "$SRC/portraits-kaylee.jpg"    "portraits/kaylee.webp"   1000 78
conv "$SRC/galleries/portraits/lydia-horner/IMG_0032.jpg" "portraits/lydia-02.webp" 1000 78
conv "$SRC/galleries/portraits/the-dells/IMG_5386-Enhanced-NR-2.jpg" "portraits/dells-02.webp" 1000 78

# sports
conv "$SRC/sports-aiden.jpg"    "sports/aiden.webp"      1000 78
conv "$SRC/sports-august.jpg"   "sports/august.webp"     1000 78
conv "$SRC/sports-david.jpg"    "sports/david.webp"      1000 78
conv "$SRC/sports-jon.jpg"      "sports/jon.webp"        1000 78
conv "$SRC/sports-karlie.jpg"   "sports/karlie.webp"     1000 78
conv "$SRC/sports-sophie.jpg"   "sports/sophie.webp"     1000 78
conv "$SRC/sports-gold.jpg"     "sports/gold.webp"       1000 78
conv "$SRC/sports-silver.jpg"   "sports/silver.webp"     1000 78
conv "$SRC/galleries/sports/the-weight-room/COOL+DOWN-01.jpg" "sports/weight-room.webp" 1000 78
conv "$SRC/galleries/sports/jennifer-gusler/JENNIFER-1.jpg"   "sports/jennifer.webp"    1000 78

# weddings
conv "$SRC/wedding-hero.jpg"   "weddings/hero-portrait.webp" 1000 78
conv "$SRC/weddings-2.jpg"     "weddings/w-02.webp"          1000 78
conv "$SRC/weddings-66.jpg"    "weddings/w-66.webp"          1000 78
conv "$SRC/weddings-111.jpg"   "weddings/w-111.webp"         1000 78
conv "$SRC/weddings-82.jpg"    "weddings/w-82.webp"          1000 78
conv "$SRC/weddings-70.jpg"    "weddings/w-70.webp"          1000 78
conv "$SRC/weddings-0348.jpg"  "weddings/w-0348.webp"        1000 78
conv "$SRC/weddings-134.jpg"   "weddings/w-134.webp"         1000 78

# travel / NYC
conv "$SRC/nyc/nyc-01.jpg"     "travel/nyc-01.webp"          1200 78
conv "$SRC/nyc/nyc-02.jpg"     "travel/nyc-02.webp"          1200 78
conv "$SRC/nyc/nyc-04.jpg"     "travel/nyc-04.webp"          1200 78
conv "$SRC/nyc/nyc-05.jpg"     "travel/nyc-05.webp"          1200 78

echo "$(find "$DST" -type f | wc -l | tr -d ' ') files, $(du -sh "$DST" | cut -f1) → $DST"
