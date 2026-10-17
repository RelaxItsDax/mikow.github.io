---
title: Deep Star AR
tagline: "Deep Star AR is a reimagining of Lisa Moren's Deep Star exhibit in augmented reality. Explore the nature of the Chesapeake Bay's water and inhabitants through this exhibit."
year: 2026
role: Lead Developer
team: Solo
duration: Four Months
engine: Unity
platforms: "Museum Exhibit."
tags: Graphics, Unity, IRC
featured: false
hue: 220
links:
  - Documentation: "https://www.lisamoren.com/deepstar"
---

## Overview

DeepStar AR is a reimagining of Lisa Moren's Deep Star exhibit in augmented reality. I ported the previously video installation to augmented reality during my time working at the Imaging Research Center at UMBC.

The project itself is a museum piece showcasing how visualizations can reflect changing conditions in the Chesapeake bay. **Our work was shown in the [CADVC art gallery at UMBC](https://cadvc.umbc.edu/exhibition/2026-cadvc-arts-faculty-exhibition-curated-by-maleke-glee/) from February 4th to 28th 2026**.

## The Imaging Research Center

In order to talk about this project, I need to talk about the IRC and what it does.

The [Imaging Research Center](https://irc.umbc.edu/) focuses on utilizing modern technologies to portray art pieces. They utilize and bring together the talents of many different disciplines to create truly innovative art. In their words:

**"At the IRC, we believe large problems are solved at the intersection of the arts, sciences and humanities working together."**

I did an **internship/job as a software engineer there for a year**.

## DeepStar History

DeepStar itself has a pretty long history. It was [a video installation by Lisa Moren](https://www.lisamoren.com/deepstar), the director of the IRC, created prior to her becoming the director. After she settled in as the director, one of her first projects was to port some of the scenes in the DeepStar video to AR, using the tech available at the IRC.

DeepStar was originally created and rendered with Unity. Given that I had some experience in Unity, I was assigned to the task, technically making me the lead (and solo) developer on the project. I remember getting handed old drives and being asked to look through them and pulling off the old project assets, starting my journey making this piece.

## Bringing it into AR

With the assets in hand, I brought them into modern Unity, and converted the assets to the pipeline I was using. 

The code was also outdated, and built for editor use. Given that we needed to build this project to deploy it, the systems for bringing in data from the Chesapeake bay needed to be rewritten, so I did.

After a major facelift on that front, it was working. One challenge that was way harder than I was expecting was getting passthrough (being able to see your surroundings in AR) working with particle systems. We had to do a lot of iteration to make sure the GPU accelerated particles could work, as they were very computationally heavy. In the end, and with a really janky setup, we got the project working and installed in the museum.

## Challenges

There were a LOT of challenges, both technical and interpersonal, when working on this project.

On the technical side of things, working with "tethered" AR, meaning you're connected to a computer, is really buggy for applications that rely on the GPU to look good. I'd really like to see more work being done to make AR development when connected to a computer smoother. On that note, I'm SUPER excited about Valve's Steam Frame!

To be perfectly honest, I underestimated how difficult collaborating with stakeholders on a project like this would be. I learned a lot simply by making mistakes and needing to correct them, on both the technical side and how I managed the project. I thought that because it was already made, and a solo project, I could have handled everything internally with my own docs. I really should have used better management tools.

## Takeaways

This project was really interesting for me because I learned a lot about technologies I had previously only dreamed of. This project is **what got me started learning technical art**, which is now one of my strong suits. I never thought I'd see the day when I'd be writing shaders and particle systems, but here we are! It all started with this project.

In addition, getting to use AR like that was a really incredible experience. It **changed the way I think about game development**, and how different mediums can drastically change how you take in a story, narrative, or message.
