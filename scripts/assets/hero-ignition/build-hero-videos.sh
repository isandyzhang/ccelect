#!/usr/bin/env bash
# Build documentary-grade hero intro + loop from IMG_0359.MOV
set -euo pipefail

SRC="${1:-/Users/andy/Library/CloudStorage/GoogleDrive-isandyzhang@gmail.com/My Drive/ccselect-video/video/wp/IMG_0359.MOV}"
ROOT="$(cd "$(dirname "$0")" && pwd)"
OUT_PUBLIC="$(cd "$ROOT/../../../public/videos/ccelect" && pwd)"
IMG_PUBLIC="$(cd "$ROOT/../../../public/images/ccelect" && pwd)"
WORK="$ROOT/work"
mkdir -p "$WORK"

GRADE_PREP="eq=brightness=-0.34:contrast=1.22:saturation=0.72:gamma=0.68,colorbalance=rs=0.05:gs=-0.06:bs=-0.1:rm=0.08:gm=-0.03:bm=-0.08:rh=0.04:gh=-0.02:bh=-0.06,vignette=PI/4.5"
GRADE_BLACK="eq=brightness=-0.55:contrast=1.35:saturation=0.45:gamma=0.45,colorbalance=rs=0.03:gs=-0.05:bs=-0.08,vignette=PI/3.5"
GRADE_IGN="eq=brightness=-0.1:contrast=1.28:saturation=0.92:gamma=0.88,colorbalance=rs=0.1:gs=-0.02:bs=-0.12:rm=0.12:gm=0.02:bm=-0.1:rh=0.08:gh=0.02:bh=-0.08,vignette=PI/5.5"
GRADE_LOOP="eq=brightness=-0.18:contrast=1.22:saturation=0.85:gamma=0.8,colorbalance=rs=0.08:gs=-0.04:bs=-0.1:rm=0.1:gm=-0.01:bm=-0.08,vignette=PI/5"
ENHANCE="deshake=rx=32:ry=32:edge=mirror,hqdn3d=2.0:1.5:3.0:2.5,unsharp=5:5:0.6:5:5:0.0"
SCALE="scale=1280:720:flags=lanczos,fps=24,format=yuv420p"
ENCODE=(-c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart -an)

echo "==> Building intro segments (~10s target)"

# Near-black open (~1.1s)
ffmpeg -y -ss 12.0 -t 1.1 -i "$SRC" \
  -vf "trim=duration=1.1,setpts=PTS-STARTPTS,${GRADE_BLACK},${ENHANCE},${SCALE},fade=t=in:st=0:d=0.85" \
  "${ENCODE[@]}" "$WORK/01_black.mp4"

# Compressed prep: 3→13.5s source at 0.38x ≈ 4.0s
ffmpeg -y -ss 3.0 -t 10.5 -i "$SRC" \
  -vf "trim=duration=10.5,setpts=PTS-STARTPTS,setpts=0.38*PTS,${GRADE_PREP},${ENHANCE},${SCALE}" \
  "${ENCODE[@]}" "$WORK/02_prep.mp4"

# Ignition climax ~3.4s
ffmpeg -y -ss 14.4 -t 3.4 -i "$SRC" \
  -vf "trim=duration=3.4,setpts=PTS-STARTPTS,${GRADE_IGN},${ENHANCE},${SCALE}" \
  "${ENCODE[@]}" "$WORK/03_ignition.mp4"

# Afterglow handoff ~2.2s
ffmpeg -y -ss 18.0 -t 2.2 -i "$SRC" \
  -vf "trim=duration=2.2,setpts=PTS-STARTPTS,${GRADE_IGN},${ENHANCE},${SCALE}" \
  "${ENCODE[@]}" "$WORK/04_after.mp4"

echo "==> Concat intro"
cat > "$WORK/intro.txt" <<EOF
file '$WORK/01_black.mp4'
file '$WORK/02_prep.mp4'
file '$WORK/03_ignition.mp4'
file '$WORK/04_after.mp4'
EOF

ffmpeg -y -f concat -safe 0 -i "$WORK/intro.txt" -c copy "$WORK/hero-ignition-intro.mp4"
ffmpeg -y -i "$WORK/hero-ignition-intro.mp4" "${ENCODE[@]}" \
  "$OUT_PUBLIC/hero-ignition-intro.mp4"

echo "==> Building ping-pong afterglow loop (no re-ignition flash)"
# Steady residual glow window; reverse for seamless loop
ffmpeg -y -ss 21.8 -t 4.0 -i "$SRC" \
  -vf "trim=duration=4.0,setpts=PTS-STARTPTS,${GRADE_LOOP},${ENHANCE},${SCALE}" \
  "${ENCODE[@]}" "$WORK/loop_fwd.mp4"

ffmpeg -y -i "$WORK/loop_fwd.mp4" -vf reverse "${ENCODE[@]}" "$WORK/loop_rev.mp4"

cat > "$WORK/loop.txt" <<EOF
file '$WORK/loop_fwd.mp4'
file '$WORK/loop_rev.mp4'
EOF

ffmpeg -y -f concat -safe 0 -i "$WORK/loop.txt" -c copy "$WORK/hero-loop.mp4"
ffmpeg -y -i "$WORK/hero-loop.mp4" "${ENCODE[@]}" "$OUT_PUBLIC/hero-loop.mp4"

echo "==> Poster from lit afterglow"
ffmpeg -y -ss 19.0 -i "$SRC" -frames:v 1 \
  -vf "${GRADE_IGN},scale=1920:1080:flags=lanczos" \
  "$IMG_PUBLIC/banner-ignition.jpg"

echo "==> Durations"
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$OUT_PUBLIC/hero-ignition-intro.mp4"
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$OUT_PUBLIC/hero-loop.mp4"
ls -lh "$OUT_PUBLIC/hero-ignition-intro.mp4" "$OUT_PUBLIC/hero-loop.mp4" "$IMG_PUBLIC/banner-ignition.jpg"
echo "Done."
