# mikow.dev

Game development portfolio. Plain HTML, CSS and JavaScript — no build step, no dependencies.
GitHub Pages serves it straight from `main`.

## Layout

| File | What it is |
| --- | --- |
| `index.html` | Home page: hero, showreel, projects, skills, experience, about, contact |
| `project.html` | Case-study page, shared by every project (`project.html?id=<slug>`) |
| `js/projects.js` | **Project data** — the grid and case studies are generated from this |
| `js/main.js` | Rendering and filter logic; you shouldn't need to touch it |
| `shaders/background.frag` | **Background shader** — the animated full-screen background |
| `js/background.js` | WebGL2 runner for the background shader |
| `css/style.css` | Styles. Colours, fonts and spacing are tokens at the top of the file |
| `assets/` | Images, video and `resume.pdf` |

## Making it yours

1. **Text** — edit the hero, skills, experience, about and contact sections directly in `index.html`.
   Replace `you@example.com` and the `#` placeholder links.
2. **Projects** — edit the list in `js/projects.js`. The fields are documented at the top of that file.
   Order in the file is the order on the page.
3. **Images** — add 16:9 covers to `assets/img/` and set `cover` on each project. Projects without one
   get a generated cover.
4. **Showreel** — swap the placeholder in the `#reel` section of `index.html` for a YouTube embed
   (the snippet is in the comment there), or delete the section.
5. **Résumé** — add `assets/resume.pdf`.
6. **Colours** — change `--accent` (and friends) in `css/style.css`. Light and dark themes are both defined there.

## Background shader

`shaders/background.frag` is drawn full-screen behind every page. It uses a Shadertoy-style entry point
(`void mainImage(out float4 fragColor, in float2 fragCoord)`), so Shadertoy shaders mostly paste straight in.

Browsers only compile GLSL, so the file is GLSL ES 3.00 with HLSL spellings aliased on top: `float3`, `float2x2`,
`lerp`, `frac`, `saturate`, `mul`, `atan2` and so on. The full list, the available inputs (`iTime`,
`iResolution`, `iMouse`, `iScroll`, and the theme colours `iBackground` / `iAccent`) are documented at the top
of the file.

- On `localhost` the shader hot-reloads when you save, and compile errors appear in a box on the page.
- `PIXEL_SCALE` in `js/background.js` sets the render resolution (default: half resolution).
- Visitors with "reduce motion" enabled get a single still frame.
- To turn it off, remove the `background.js` script tag from `index.html` and `project.html`.

## Preview locally

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>.
