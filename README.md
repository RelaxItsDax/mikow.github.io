# mikow.dev

Game development portfolio. Plain HTML, CSS and JavaScript — no build step. The one dependency, the Markdown
parser, is checked in under `js/vendor/`.
GitHub Pages serves it straight from `main`.

## Layout

| File | What it is |
| --- | --- |
| `index.html` | Home page: hero, showreel, projects, skills, experience, about, contact |
| `project.html` | Case-study page, shared by every project (`project.html?id=<slug>`) |
| `projects/*.md` | **Projects** — one Markdown file each: details at the top, write-up below |
| `js/projects.js` | The list of project files, in display order, plus the field reference |
| `js/main.js` | Loading, rendering and filter logic; you shouldn't need to touch it |
| `js/vendor/marked.min.js` | [marked](https://github.com/markedjs/marked) 15.0.12 (MIT), renders the write-ups |
| `shaders/background.frag` | **Background shader** — the animated full-screen background |
| `js/background.js` | WebGL2 runner for the background shader |
| `css/style.css` | Styles. Colours, fonts and spacing are tokens at the top of the file |
| `assets/` | Images, video and `resume.pdf` |

## Making it yours

1. **Text** — edit the hero, skills, experience, about and contact sections directly in `index.html`.
   Replace `you@example.com` and the `#` placeholder links.
2. **Projects** — each project is a Markdown file in `projects/`. To add one, create `projects/<slug>.md`
   and add `"<slug>"` to the list in `js/projects.js`; order in that list is the order on the page.
   The fields that go at the top of each file are documented in `js/projects.js`.
3. **Images** — add 16:9 covers to `assets/img/` and set `cover` on each project. Projects without one
   get a generated cover.
4. **Showreel** — swap the placeholder in the `#reel` section of `index.html` for a YouTube embed
   (the snippet is in the comment there), or delete the section.
5. **Résumé** — add `assets/resume.pdf`.
6. **Colours** — change `--accent` (and friends) in `css/style.css`. Light and dark themes are both defined there.

## Background shader

`shaders/background.frag` is drawn full-screen behind every page. It uses a Shadertoy-style entry point
(`void mainImage(out vec4 fragColor, in vec2 fragCoord)`), so Shadertoy shaders mostly paste straight in.

The file is plain GLSL ES 3.00. The available inputs (`iTime`, `iResolution`, `iMouse`, `iScroll`, and the
theme colours `iBackground` / `iAccent`) are documented at the top of the file.

- On `localhost` the shader hot-reloads when you save, and compile errors appear in a box on the page.
- `PIXEL_SCALE` in `js/background.js` sets the render resolution (default: half resolution).
- Visitors with "reduce motion" enabled get a single still frame.
- To turn it off, remove the `background.js` script tag from `index.html` and `project.html`.

## Preview locally

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Opening the HTML files directly (`file://`) won't work, because the
projects and the shader are loaded with `fetch`.
