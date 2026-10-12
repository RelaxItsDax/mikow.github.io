/*
 * Project data — this is the only file you need to edit to add, remove or
 * reorder projects. The home page grid and every case-study page are built
 * from this list, in this order.
 *
 * Fields
 *   slug           (required) URL id: project.html?id=<slug>. Lowercase, no spaces.
 *   title          (required)
 *   tagline        (required) One sentence shown on the card and under the title.
 *   year, role, team, duration, engine, platforms
 *                  Shown in the card meta line and the case-study sidebar. All optional.
 *   tags           Used for the filter buttons on the home page.
 *   featured       true adds a "Featured" badge. Put your best work first in the list.
 *   cover          Path to a 16:9 image, e.g. "assets/img/my-game.jpg".
 *                  Leave out to get a generated cover tinted by `hue` (0–360).
 *   video          { youtube: "VIDEO_ID" } or { src: "assets/video/clip.mp4" }.
 *                  Shown at the top of the case study instead of the cover.
 *   links          [{ label, url }] — the first one is styled as the primary button.
 *   overview       Array of paragraphs.
 *   contributions  Array of bullet points: what *you* built.
 *   breakdowns     [{ title, body, image, code }] — deep dives. `body` is an array
 *                  of paragraphs; `image` and `code` are optional.
 */
window.PROJECTS = [
    {
        slug: "project-one",
        title: "Project One",
        tagline: "One sentence: genre, hook, and what makes it worth a look.",
        year: "2026",
        role: "Gameplay Programmer",
        team: "Team of 6",
        duration: "8 months",
        engine: "Unreal Engine 5",
        platforms: "PC",
        tags: ["Gameplay", "C++"],
        featured: true,
        hue: 160,
        video: null, // e.g. { youtube: "dQw4w9WgXcQ" }
        links: [
            { label: "Play on Steam", url: "#" },
            { label: "Source", url: "#" }
        ],
        overview: [
            "Two or three sentences on what the game is and where it came from — a studio project, a university capstone, a personal prototype. A reviewer should know within ten seconds what they're looking at.",
            "Then say what state it's in: shipped, in development, a vertical slice. Mention numbers if you have them (players, wishlists, awards, jam placement)."
        ],
        contributions: [
            "Lead with the system you owned end to end, and name it concretely (e.g. \"the ability system\", not \"gameplay\").",
            "State the hard part: the constraint, the bug, the performance budget, the design goal that pulled against the tech.",
            "Give the result — a frame time, an iteration speed-up, a feature designers could finally build without you.",
            "On team projects, be explicit about what was yours and what you collaborated on."
        ],
        breakdowns: [
            {
                title: "Breakdown: name a system",
                body: [
                    "Walk through one interesting technical problem. What did you try first, why didn't it work, and what did you end up building? A diagram, GIF or short clip here is worth more than three paragraphs.",
                    "A small, readable snippet shows how you write code. Keep it short and pick something you'd be happy to talk through in an interview."
                ],
                code: [
                    "// Fixed-timestep update with interpolation for rendering.",
                    "void Game::Tick(double frameTime)",
                    "{",
                    "    accumulator += std::min(frameTime, kMaxFrameTime);",
                    "",
                    "    while (accumulator >= kFixedStep)",
                    "    {",
                    "        previous = current;",
                    "        Simulate(current, kFixedStep);",
                    "        accumulator -= kFixedStep;",
                    "    }",
                    "",
                    "    Render(Lerp(previous, current, accumulator / kFixedStep));",
                    "}"
                ].join("\n")
            },
            {
                title: "What I'd do differently",
                body: [
                    "A short, honest retrospective reads well: one thing that went right, one thing you'd change, and what you took into the next project."
                ]
            }
        ]
    },
    {
        slug: "project-two",
        title: "Project Two",
        tagline: "A tool, editor extension or pipeline piece that made a team faster.",
        year: "2025",
        role: "Tools Programmer",
        team: "Team of 12",
        duration: "5 months",
        engine: "Unity",
        platforms: "PC, Switch",
        tags: ["Tools", "C#"],
        featured: true,
        hue: 215,
        links: [{ label: "Source", url: "#" }],
        overview: [
            "Describe who the tool was for and what their workflow looked like before it existed."
        ],
        contributions: [
            "What you built, and how people use it.",
            "The before/after: time saved, errors removed, content it unlocked."
        ],
        breakdowns: []
    },
    {
        slug: "project-three",
        title: "Project Three",
        tagline: "A rendering, physics or engine-level experiment.",
        year: "2025",
        role: "Solo",
        duration: "6 weeks",
        engine: "Custom (C++ / Vulkan)",
        platforms: "PC",
        tags: ["Graphics", "Engine", "C++"],
        hue: 275,
        links: [{ label: "Source", url: "#" }],
        overview: [
            "Explain the technique and why you wanted to implement it."
        ],
        contributions: [
            "The core of what you implemented.",
            "Performance numbers and the hardware you measured on."
        ],
        breakdowns: []
    },
    {
        slug: "project-four",
        title: "Project Four",
        tagline: "A game-jam entry: theme, timebox and where it placed.",
        year: "2024",
        role: "Programmer & Designer",
        team: "Team of 3",
        duration: "48 hours",
        engine: "Godot 4",
        platforms: "Web",
        tags: ["Game Jam", "Gameplay"],
        hue: 25,
        links: [{ label: "Play on itch.io", url: "#" }],
        overview: [
            "Jam games show you can scope and finish. Say what the theme was and how you interpreted it."
        ],
        contributions: [
            "What you got working in the time, and what you cut."
        ],
        breakdowns: []
    },
    {
        slug: "project-five",
        title: "Project Five",
        tagline: "Multiplayer, networking or backend work.",
        year: "2024",
        role: "Network Programmer",
        team: "Team of 4",
        duration: "4 months",
        engine: "Unreal Engine 5",
        platforms: "PC",
        tags: ["Networking", "C++"],
        hue: 340,
        links: [],
        overview: [
            "Describe the netcode model (client prediction, rollback, lockstep…) and the player count it targets."
        ],
        contributions: [
            "The piece you owned and how you tested it under bad network conditions."
        ],
        breakdowns: []
    },
    {
        slug: "project-six",
        title: "Project Six",
        tagline: "AI, procedural generation or another systems-heavy prototype.",
        year: "2023",
        role: "Solo",
        duration: "3 months",
        engine: "Unity",
        platforms: "PC",
        tags: ["AI", "Gameplay", "C#"],
        hue: 95,
        links: [{ label: "Source", url: "#" }],
        overview: [
            "Say what behaviour or content you were trying to produce and how you judged whether it worked."
        ],
        contributions: [
            "The approach you took and the alternatives you ruled out."
        ],
        breakdowns: []
    }
];
