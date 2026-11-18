#!/usr/bin/env bash
# make_loop.sh -- cut a clip from a long video, slow it down, then append a reversed copy of itself,
# giving a ping-pong loop that repeats smoothly as a background video.
#
#   ./make_loop.sh INPUT START DURATION [SLOW] [OUTPUT] [WIDTH]
#   ./make_loop.sh hour.mov 00:12:30 20 2 backdrop.mp4 1280
#
#   START     where the clip begins in the source (seconds or hh:mm:ss)
#   DURATION  how many seconds of the SOURCE to use   (20 s at SLOW=2 becomes 40 s forward + 40 s back)
#   SLOW      slow-down factor, 2 = half speed (default 2)
#   WIDTH     output width in pixels (default 1280; smaller = less memory and a smaller file)
#
# Notes:
#  * Audio is dropped (-an): a background video plays muted anyway.
#  * Frames are interpolated back to 30 fps after slowing, so slow motion looks smooth, not choppy.
#  * The `reverse` filter holds every frame of the clip in memory. Memory ~ seconds x fps x width x height x 1.5.
#    If it runs out, use a shorter DURATION or a smaller WIDTH.
#  * trim=start_frame=1 drops the first reversed frame, which would otherwise duplicate the last forward frame.
set -euo pipefail
in="${1:?usage: make_loop.sh INPUT START DURATION [SLOW] [OUTPUT] [WIDTH]}"
start="${2:?need START}"; dur="${3:?need DURATION}"
slow="${4:-2}"; out="${5:-loop.mp4}"; width="${6:-1280}"

ffmpeg -hide_banner -y -ss "$start" -t "$dur" -i "$in" -an -filter_complex "
  [0:v]scale=${width}:-2,setpts=${slow}*PTS,minterpolate=fps=30:mi_mode=mci,split[f0][b];
      [f0]trim=start_frame=1,setpts=PTS-STARTPTS[f];
  [b]reverse,trim=start_frame=1,setpts=PTS-STARTPTS[r];
  [f][r]concat=n=2:v=1:a=0[v]" \
  -map "[v]" -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -movflags +faststart "$out"
echo "wrote $out ($(du -h "$out" | cut -f1))"
