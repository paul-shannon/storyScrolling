#!/usr/bin/env bash
# make_loop.sh -- cut a clip from a long video, append a reversed copy (ping-pong), then slow it down
# by interpolating frames. Two steps; step 1's small file is kept so you can re-run step 2 freely.
#   ./make_loop.sh INPUT START DURATION [SLOW] [OUTPUT] [WIDTH]
#   ./make_loop.sh hour.mov 00:12:30 12 2 backdrop.mp4 1280
# Memory: only `reverse` buffers frames, and it now sees the UNslowed clip:
#   about DURATION x 30 x WIDTH x height x 1.5 bytes (12 s at 1280 wide ~ 0.5 GB).
set -euo pipefail
in="${1:?usage: make_loop.sh INPUT START DURATION [SLOW] [OUTPUT] [WIDTH]}"
start="${2:?need START}"; dur="${3:?need DURATION}"
slow="${4:-2}"; out="${5:-loop.mp4}"; width="${6:-1280}"
fwd="${out%.*}_forward.mp4"

# Step 1: cut, scale, 8-bit 4:2:0, near-lossless intermediate (this is the only pass that reads the 4K ProRes)
ffmpeg -hide_banner -y -ss "$start" -t "$dur" -i "$in" -an \
  -vf "scale=${width}:-2,format=yuv420p,fps=30" \
  -c:v libx264 -preset veryfast -crf 12 "$fwd"

# Step 2: forward + reversed (duplicate frames at turnaround and wrap dropped), then slow + interpolate
ffmpeg -hide_banner -y -i "$fwd" -filter_complex "
  [0:v]split[f0][b];
  [f0]trim=start_frame=1,setpts=PTS-STARTPTS[f];
  [b]reverse,trim=start_frame=1,setpts=PTS-STARTPTS[r];
  [f][r]concat=n=2:v=1:a=0,setpts=${slow}*PTS,minterpolate=fps=30:mi_mode=mci[v]" \
  -map "[v]" -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -movflags +faststart "$out"
echo "wrote $out ($(du -h "$out" | cut -f1)); intermediate kept: $fwd"
