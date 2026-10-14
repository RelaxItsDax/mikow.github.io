(function () {
    "use strict";

    var slugs = window.PROJECTS || [];
    var projects = [];

    // Tiny DOM builder. Text always goes in as text nodes, never as HTML
    // (the Markdown write-up in markdown() is the one exception).
    function el(tag, attrs) {
        var node = document.createElement(tag);
        Object.keys(attrs || {}).forEach(function (key) {
            var value = attrs[key];
            if (value == null || value === false) return;
            if (key === "class") node.className = value;
            else if (key === "text") node.textContent = value;
            else node.setAttribute(key, value === true ? "" : value);
        });
        for (var i = 2; i < arguments.length; i++) {
            var child = arguments[i];
            if (child == null || child === false) continue;
            node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
        }
        return node;
    }

    function projectUrl(project) {
        return "project.html?id=" + encodeURIComponent(project.slug);
    }

    function initials(title) {
        return title.split(/\s+/).slice(0, 2).map(function (word) { return word.charAt(0); }).join("").toUpperCase();
    }

    function cover(project) {
        var node = el("div", { class: "cover", style: "--hue: " + (project.hue == null ? 190 : project.hue) });
        if (project.cover) {
            node.appendChild(el("img", { src: project.cover, alt: "", loading: "lazy" }));
        } else {
            node.appendChild(el("span", { class: "cover-mark", "aria-hidden": "true", text: initials(project.title) }));
        }
        return node;
    }

    function chips(tags) {
        var list = el("ul", { class: "chips" });
        (tags || []).forEach(function (tag) { list.appendChild(el("li", { class: "chip", text: tag })); });
        return list;
    }

    function isExternal(url) {
        return /^https?:\/\//.test(url);
    }

    // ---------- Loading projects/<slug>.md ----------

    function unquote(value) {
        var quoted = /^(["'])(.*)\1$/.exec(value);
        return quoted ? quoted[2].replace(/\\(["'])/g, "$1") : value;
    }

    // Reads the "key: value" block between the two "---" lines at the top of a
    // project file. A key with nothing after it collects the "- item" lines below.
    function parseProject(slug, text) {
        var project = { slug: slug, title: slug, tagline: "", body: text };
        var header = /^\uFEFF?---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(\r?\n|$)/.exec(text);
        if (!header) return project;
        project.body = text.slice(header[0].length);

        var fields = {};
        var key = null;
        header[1].split(/\r?\n/).forEach(function (line) {
            var item = /^\s*-\s+(.*)$/.exec(line);
            if (item) {
                if (Array.isArray(fields[key])) fields[key].push(item[1].trim());
                return;
            }
            var pair = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line);
            if (!pair) return;
            key = pair[1];
            fields[key] = pair[2].trim() === "" ? [] : unquote(pair[2].trim());
        });

        ["title", "tagline", "year", "role", "team", "duration", "engine", "platforms", "cover"].forEach(function (name) {
            if (typeof fields[name] === "string") project[name] = fields[name];
        });
        project.featured = fields.featured === "true";
        if (fields.hue != null && !isNaN(Number(fields.hue))) project.hue = Number(fields.hue);
        if (typeof fields.youtube === "string") project.video = { youtube: fields.youtube };
        else if (typeof fields.video === "string") project.video = { src: fields.video };

        var tags = fields.tags || [];
        if (typeof tags === "string") tags = tags.replace(/^\[|\]$/g, "").split(",");
        project.tags = tags.map(function (tag) { return unquote(tag.trim()); }).filter(Boolean);

        project.links = (Array.isArray(fields.links) ? fields.links : []).map(function (entry) {
            var split = entry.lastIndexOf(": ");
            if (split === -1) return null;
            return { label: unquote(entry.slice(0, split).trim()), url: unquote(entry.slice(split + 2).trim()) };
        }).filter(Boolean);

        return project;
    }

    // A file that fails to load is left out rather than breaking the page.
    function loadProjects() {
        return Promise.all(slugs.map(function (slug) {
            var url = "projects/" + encodeURIComponent(slug) + ".md";
            return fetch(url)
                .then(function (response) {
                    if (!response.ok) throw new Error("HTTP " + response.status);
                    return response.text();
                })
                .then(function (text) { return parseProject(slug, text); })
                .catch(function (error) {
                    console.error("Project could not be loaded: " + url, error);
                    return null;
                });
        })).then(function (loaded) { return loaded.filter(Boolean); });
    }

    // ---------- Home page: project grid + filters ----------

    function renderGrid(grid, filters) {
        var cards = projects.map(function (project) {
            var meta = [project.year, project.engine, project.team].filter(Boolean).join(" · ");
            var art = cover(project);
            if (project.featured) art.appendChild(el("span", { class: "badge", text: "Featured" }));

            var card = el("a", { class: "card", href: projectUrl(project) },
                art,
                el("div", { class: "card-body" },
                    el("h3", { text: project.title }),
                    el("p", { text: project.tagline }),
                    meta && el("div", { class: "card-meta", text: meta }),
                    chips(project.tags)
                )
            );
            grid.appendChild(card);
            return { node: card, tags: project.tags || [] };
        });

        if (!filters) return;

        var tags = [];
        projects.forEach(function (project) {
            (project.tags || []).forEach(function (tag) { if (tags.indexOf(tag) === -1) tags.push(tag); });
        });
        if (tags.length < 2) return;

        var buttons = ["All"].concat(tags).map(function (tag, index) {
            var button = el("button", { class: "filter", type: "button", "aria-pressed": index === 0 ? "true" : "false", text: tag });
            button.addEventListener("click", function () {
                buttons.forEach(function (other) { other.setAttribute("aria-pressed", other === button ? "true" : "false"); });
                cards.forEach(function (card) {
                    card.node.hidden = index !== 0 && card.tags.indexOf(tag) === -1;
                });
            });
            filters.appendChild(button);
            return button;
        });
    }

    // ---------- Case-study page ----------

    function media(project) {
        var video = project.video;
        if (video && video.youtube) {
            return el("div", { class: "frame" },
                el("iframe", {
                    src: "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(video.youtube),
                    title: project.title + " video",
                    loading: "lazy",
                    allow: "accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen",
                    allowfullscreen: true
                })
            );
        }
        if (video && video.src) {
            return el("div", { class: "frame" },
                el("video", { src: video.src, poster: project.cover, controls: true, playsinline: true, preload: "metadata" })
            );
        }
        return cover(project);
    }

    // The write-up, rendered with js/vendor/marked.min.js.
    function markdown(text) {
        var node = el("div", { class: "project-content" });
        if (!window.marked) {
            node.appendChild(el("pre", { text: text }));
            return node;
        }
        node.innerHTML = window.marked.parse(text);
        node.querySelectorAll("a[href]").forEach(function (link) {
            if (!isExternal(link.getAttribute("href"))) return;
            link.target = "_blank";
            link.rel = "noopener";
        });
        return node;
    }

    function renderProject(root) {
        var slug = new URLSearchParams(window.location.search).get("id");
        var index = projects.findIndex(function (project) { return project.slug === slug; });

        if (index === -1) {
            root.appendChild(el("div", { class: "empty-state" },
                el("h1", { text: "Project not found" }),
                el("p", { text: "That link doesn't match any project on this site." }),
                el("a", { class: "btn btn-primary", href: "index.html#work", text: "See all projects" })
            ));
            return;
        }

        var project = projects[index];
        document.title = project.title + " — " + document.title;

        root.appendChild(el("a", { class: "back-link", href: "index.html#work", text: "← All projects" }));
        root.appendChild(el("h1", { class: "project-title", text: project.title }));
        root.appendChild(el("p", { class: "project-tagline", text: project.tagline }));

        if (project.links && project.links.length) {
            var row = el("div", { class: "btn-row" });
            project.links.forEach(function (link, i) {
                var external = isExternal(link.url);
                row.appendChild(el("a", {
                    class: "btn" + (i === 0 ? " btn-primary" : ""),
                    href: link.url,
                    target: external && "_blank",
                    rel: external && "noopener",
                    text: link.label
                }));
            });
            root.appendChild(row);
        }

        root.appendChild(el("div", { class: "project-media" }, media(project)));

        var content = markdown(project.body);

        var facts = el("dl", {});
        [["Role", project.role], ["Team", project.team], ["Duration", project.duration],
         ["Engine", project.engine], ["Platforms", project.platforms], ["Year", project.year]]
            .forEach(function (fact) {
                if (!fact[1]) return;
                facts.appendChild(el("div", {}, el("dt", { text: fact[0] }), el("dd", { text: fact[1] })));
            });
        var aside = el("aside", { class: "project-aside", "aria-label": "Project details" }, facts);
        if (project.tags && project.tags.length) aside.appendChild(chips(project.tags));

        root.appendChild(el("div", { class: "project-layout" }, content, aside));

        var previous = projects[index - 1];
        var next = projects[index + 1];
        if (previous || next) {
            root.appendChild(el("nav", { class: "project-pager", "aria-label": "More projects" },
                previous && el("a", { href: projectUrl(previous) },
                    el("small", { text: "← Previous" }), el("strong", { text: previous.title })),
                next && el("a", { class: "next", href: projectUrl(next) },
                    el("small", { text: "Next →" }), el("strong", { text: next.title }))
            ));
        }
    }

    // ---------- Boot ----------

    var grid = document.getElementById("project-grid");
    var projectRoot = document.getElementById("project");
    if (grid || projectRoot) {
        loadProjects().then(function (loaded) {
            projects = loaded;
            if (grid) renderGrid(grid, document.getElementById("project-filters"));
            if (projectRoot) renderProject(projectRoot);
        });
    }

    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
})();
