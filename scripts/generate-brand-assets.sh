#!/usr/bin/env bash
#
# Regenerates the raster brand assets in public/ from the Awraq Skills
# identity: navy #12294A, gold #C9A227.
#
# These used to be hand-exported PNGs weighing 1.15 MB (og-cover) and 944 kB
# (apple-touch-icon) at 1424x752 and 1024x1024 — both wrong sizes, both an
# order of magnitude too heavy, and both impossible to update without the
# original design file. This script is the source of truth instead: the mark
# geometry here is the same path data as public/favicon.svg and <BrandMark> in
# src/components/BrandLogo.tsx. If you change the mark, change all three.
#
# Requirements
#   - ImageMagick 6 (`convert`)
#   - Plus Jakarta Sans as TTF at the paths in FONT_800 / FONT_700 below.
#     ImageMagick cannot read the woff files that Google Fonts and Fontsource
#     ship, so convert them once:
#
#       npm pack @fontsource/plus-jakarta-sans && tar xzf fontsource-*.tgz
#       pip install fonttools
#       python3 -c "
#       from fontTools.ttLib import TTFont
#       for w in ('700','800'):
#           f = TTFont(f'package/files/plus-jakarta-sans-latin-{w}-normal.woff')
#           f.flavor = None
#           f.save(f'PJS-{w}.ttf')"
#
# Usage:  bash scripts/generate-brand-assets.sh [path/to/font/dir]
#
set -euo pipefail

FONT_DIR="${1:-/tmp/fonts}"
FONT_800="$FONT_DIR/PJS-800.ttf"
FONT_700="$FONT_DIR/PJS-700.ttf"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/public"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

NAVY='#12294A'
DEEP='#0C1D36'
RAISED='#1A3557'
GOLD='#C9A227'
MUTED='#C3CFE0'

for f in "$FONT_800" "$FONT_700"; do
  [ -f "$f" ] || { echo "Missing font: $f — see the header of this script." >&2; exit 1; }
done

# ── The mark ────────────────────────────────────────────────────────────────
# Mirrors public/favicon.svg exactly, drawn on a 64-unit grid and scaled.
# $1 = pixel size, $2 = output path, $3 = tile fill ("none" for transparent).
draw_mark() {
  local s="$1" out="$2" tile="$3"
  local body
  # Scale a coordinate from the 64-unit design grid to pixels.
  sc() { python3 -c "print(round($1*$s/64,2))"; }
  body="stroke-linecap round stroke-linejoin round fill none
        stroke '#FFFFFF' stroke-width $(sc 7)
        path 'M $(sc 18),$(sc 47) L $(sc 32),$(sc 16) L $(sc 46),$(sc 47)'
        stroke '$GOLD' stroke-width $(sc 6.5)
        path 'M $(sc 24.5),$(sc 37.5) L $(sc 39.5),$(sc 37.5)'"

  if [ "$tile" = "none" ]; then
    # Rounded tile with transparency around it, for compositing.
    convert -size "${s}x${s}" xc:none \
      -draw "fill '$RAISED' roundrectangle 0,0,$((s - 1)),$((s - 1)),$(sc 15),$(sc 15)" \
      -draw "$body" "$out"
  else
    # Full-bleed square. iOS applies its own mask to apple-touch-icon, so it
    # must NOT be pre-rounded and must NOT have an alpha channel.
    convert -size "${s}x${s}" xc:"$tile" -draw "$body" \
      -strip -define png:color-type=2 "PNG24:$out"
  fi
}

echo "→ apple-touch-icon.png (180x180)"
draw_mark 180 "$OUT/apple-touch-icon.png" "$NAVY"

# ── The Open Graph card ─────────────────────────────────────────────────────
# 1200x630 is the size Facebook, LinkedIn, Slack and X all crop against.
echo "→ og-cover.png (1200x630)"
W=1200
H=630

convert -size "${W}x${H}" gradient:"$DEEP-$NAVY" "$WORK/bg.png"

# A soft gold bloom in the empty lower-right quadrant. The falloff colour must
# be black: under `screen`, black is the identity, so the bloom fades to
# nothing rather than leaving a visible square edge.
convert -size 1000x1000 radial-gradient:"$GOLD"-'#000000' -alpha off "$WORK/glow.png"
convert "$WORK/bg.png" \
  \( "$WORK/glow.png" -evaluate multiply 0.30 \) \
  -geometry +620+250 -compose screen -composite \
  -alpha off "$WORK/base.png"

draw_mark 132 "$WORK/mark.png" none

# "Awr" white + "aq" gold, rendered separately and appended so the colour
# split lands on the exact glyph boundary the logo uses.
convert -background none -fill '#FFFFFF' -font "$FONT_800" -pointsize 116 label:'Awr' "$WORK/w1.png"
convert -background none -fill "$GOLD"   -font "$FONT_800" -pointsize 116 label:'aq'  "$WORK/w2.png"
convert "$WORK/w1.png" "$WORK/w2.png" -background none -gravity West +append "$WORK/word.png"

convert -background none -fill '#FFFFFF' -font "$FONT_800" -pointsize 40 -kerning 9 \
  label:'SKILLS' "$WORK/sub.png"
convert -background none -fill "$MUTED" -font "$FONT_700" -pointsize 34 -size 760x \
  caption:'Practical digital marketing courses, templates and 1-on-1 coaching for Ethiopian businesses.' \
  "$WORK/desc.png"
convert -background none -fill "$GOLD" -font "$FONT_700" -pointsize 27 -kerning 3 \
  label:'AMHARIC & ENGLISH   ·   TELEBIRR · CBE BIRR · CARD' "$WORK/pay.png"

# Offsets are derived from the measured piece heights (mark 132, word 148 with
# the "q" descender, sub 52, desc 135, pay 36) so "SKILLS" clears the descender
# instead of colliding with it.
convert "$WORK/base.png" \
  "$WORK/mark.png" -geometry +86+96  -composite \
  "$WORK/word.png" -geometry +248+82  -composite \
  "$WORK/sub.png"  -geometry +254+236 -composite \
  -draw "fill '$GOLD' roundrectangle 88,338,152,344,3,3" \
  "$WORK/desc.png" -geometry +86+386  -composite \
  "$WORK/pay.png"  -geometry +88+540  -composite \
  -strip -define png:color-type=2 "PNG24:$OUT/og-cover.png"

echo
echo "Done:"
ls -la "$OUT/apple-touch-icon.png" "$OUT/og-cover.png"
