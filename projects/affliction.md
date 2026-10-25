---
title: Affliction
tagline: "Our submission to the 2026 Scream Jam. Explore an abandoned church and discover what happened to its inhabitants."
year: 2026
role: Technical Artist
team: Team of Eight
duration: One Week
engine: Unity
platforms: "Browser"
tags: Graphics, Unity, Game Jam
featured: true
cover: assets/img/affliction/affliction-cover.png
youtube: VEYb1PfTFqg
hue: 500
links:
  - itch.io: "https://duckrow.itch.io/affliction"
---

## Overview

You play as a priestess, exploring and purifying an abandoned church before discovering what truly happened to its inhabitants. This game was made over the course of a week, in Unity. I did exclusively technical art for the project.

This project was very different from the other ones I typically work on because **the team was primarily made of people from the industry**. I'm really glad I got to learn new insights from them, and get a better understanding of what experienced talent looks like firsthand.

I'm really glad I got included on this team, and I had a ton of fun. I'm happy with how it went, our result, and how we overcame the struggles during the jam. 

![Affliction Prayer Beads](assets/img/affliction/affliction-prayer-beads.png)

## My Contributions

My contributions consisted exclusively of VFX and technical art. I made:

- The Mask Filter over your eyes, including distance based chromatic aberration, making objects in the dark swim in your sight, and the mask overlay.
  - This one was particularly fun to make, because it results in the entire game being filtered to look more gloomy, atmospheric, and adds hints of insanity to the player. 
- The Purify effect.
- The Fog and general scene ambience.
- The particles around objects.
- The fire shader and billboard.
- Plague effects on the bodies.

Here's an example of distance based chromatic aberration. Notice how the effect gets stronger the farther away the object you're looking at is:
![Distance Based Chromatic Abberation](assets/img/affliction/affliction-cover.png)

This project was an interesting learning experience for me, as I wasn't able to use Unity's Visual Effect Graph package, which would have prevented us from targeting web builds. I had to figure out how to recreate my techniques using simple shuriken particles, which required some interesting workarounds.

In addition, this is the first time I've tried to create realistic graphics as opposed to stylized graphics. I enjoyed figuring out the different techniques and approaches to rendering that make things look more realistic than targeting a specific, stylized aesthetic. 

The fire shader is a good example of this: I've never done billboarding realistic fire before. When making fire, I usually use a particle system and HDR to make glowing spheres, so this was a fun shakeup.
