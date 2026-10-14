/*
 * Project list — one entry per file in projects/, without the ".md".
 * Order here is the order on the page, so put your best work first.
 *
 * To add a project: create projects/<slug>.md and add "<slug>" below. The slug
 * is also the URL id (project.html?id=<slug>), so keep it lowercase, no spaces.
 *
 * Each file starts with a block of fields between two "---" lines, followed by
 * the write-up in Markdown (headings, lists, images, code blocks, links, raw HTML).
 *
 * Fields
 *   title          (required)
 *   tagline        (required) One sentence shown on the card and under the title.
 *   year, role, team, duration, engine, platforms
 *                  Shown in the card meta line and the case-study sidebar. All optional.
 *   tags           Comma-separated. Used for the filter buttons on the home page.
 *   featured       true adds a "Featured" badge.
 *   cover          Path to a 16:9 image, e.g. assets/img/my-game.jpg.
 *                  Leave out to get a generated cover tinted by `hue` (0–360).
 *   youtube        A YouTube video id, or
 *   video          a path such as assets/video/clip.mp4.
 *                  Shown at the top of the case study instead of the cover.
 *   links          One "- Label: url" line each — the first is styled as the primary button.
 *
 * Put quotes around a value that contains a colon or starts with a symbol.
 * Image and link paths in the write-up are relative to the site root
 * (assets/img/shot.png), the same as `cover`.
 */
window.PROJECTS = [
    "project-one",
    "project-two",
    "project-three",
    "project-four",
    "project-five",
    "project-six",
    "project-template"
];
