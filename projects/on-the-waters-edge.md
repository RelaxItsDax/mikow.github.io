---
title: On The Water's Edge
tagline: "Explore the vast open world of \"The Water's Edge\". This game was made for the Ctrl-Alt-DMV game jam. The theme was parasite."
year: 2026
role: Solo Developer
team: Solo
duration: Two Days
engine: Unity
platforms: "Windows, Linux"
tags: Gameplay, Graphics, Unity, Game Jam
featured: false
cover: assets/img/otwe/otwe-cover.png
youtube: xxU355p8Bfg
hue: 140
links:
  - itch.io: "https://relaxitsdax.itch.io/on-the-waters-edge",
  - Source: "https://github.com/RelaxItsDax/On-The-Waters-Edge"
---

## Overview

This is my submission to the CTRL+ALT+DMV Game Jam hosted by our Game Developers Club. The theme of the game jam was **parasite**. 

I was a solo developer on this project, and I completed it from start to finish in 48 hours. Overall, the project took me around 16 hours of actual work. Most of it was spent on technical art, scene setup, and the water's mirror surface.

## Why?

If you play through the game, or watch the video, you might notice that there's no real gameplay. You just walk around, get to the water, die, and need to alt+f4 to exit.

This project served as a test bed for working with pixelization post-processing filters and other visual effects. The highlights are the reflection of the water, the fire particles on the torches, and the pixelization filter and color quantizer applied to the whole scene.

To be honest, I just got bored, and decided to try to apply some of the techniques I was working on.

As someone who can't do 2D or 3D art but who really loves 3d games, I wanted to find a way to make my project look good without putting time into learning to draw/model. Having a pixelization filter allowed me to mask the quality of my assets by achieving a "stylized" look, in the form of pixel art. In addition, a filter is passed over the final render to force all colors on the screen to match themselves to a color palette, making it feel like pixel art in 3D.

## Takeaways

So, I made this project as a way to test various visual identities for my game, and I landed on this. I think it's really visually striking, especially coming from someone who can't do art to save his life. When scored, this project **scored 6th out of 25 submissions** in the visuals category! Don't ask me about the other categories though...

If I were to make the highly requested sequel: _On the Water's Edge 2: Into the Deep_, there are a LOT of things I would do differently:
- The mirror surface on the water is really pretty, and it was really successful. However, the stillness of the surface makes it easy to mistake it for something other than water, so I would add a ripple or additional effects to it to make it less solid.
- The color quantization filter is for-loop based, running an O(n) algorithm for every pixel every frame. This can be highly optimized with a color lookup texture, although I wasn't able to get to that in the time frame.
- The torch particles were super quick and dirty. I'd put a bit more polish on them with extra time.
- Ambient background music could go super far.

Regardless, I had a ton of fun. This was a great wrap up to a lot of pixelization and downscaling techniques I've been working on in my spare time, and I'm happy to have a nice portfolio piece that uses them. I'm not sure I'd use them again, but it was fun!

