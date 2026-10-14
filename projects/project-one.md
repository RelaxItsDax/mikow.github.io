---
title: Project One
tagline: "One sentence: genre, hook, and what makes it worth a look."
year: 2026
role: Gameplay Programmer
team: Team of 6
duration: 8 months
engine: Unreal Engine 5
platforms: PC
tags: Gameplay, C++
featured: true
hue: 160
links:
  - Play on Steam: "#"
  - Source: "#"
---

## Overview

Two or three sentences on what the game is and where it came from — a studio project, a university capstone, a personal prototype. A reviewer should know within ten seconds what they're looking at.

Then say what state it's in: shipped, in development, a vertical slice. Mention numbers if you have them (players, wishlists, awards, jam placement).

## What I did

- Lead with the system you owned end to end, and name it concretely (e.g. "the ability system", not "gameplay").
- State the hard part: the constraint, the bug, the performance budget, the design goal that pulled against the tech.
- Give the result — a frame time, an iteration speed-up, a feature designers could finally build without you.
- On team projects, be explicit about what was yours and what you collaborated on.

## Technical breakdown

### Breakdown: name a system

Walk through one interesting technical problem. What did you try first, why didn't it work, and what did you end up building? A diagram, GIF or short clip here is worth more than three paragraphs.

A small, readable snippet shows how you write code. Keep it short and pick something you'd be happy to talk through in an interview.

```cpp
// Fixed-timestep update with interpolation for rendering.
void Game::Tick(double frameTime)
{
    accumulator += std::min(frameTime, kMaxFrameTime);

    while (accumulator >= kFixedStep)
    {
        previous = current;
        Simulate(current, kFixedStep);
        accumulator -= kFixedStep;
    }

    Render(Lerp(previous, current, accumulator / kFixedStep));
}
```

### What I'd do differently

A short, honest retrospective reads well: one thing that went right, one thing you'd change, and what you took into the next project.
