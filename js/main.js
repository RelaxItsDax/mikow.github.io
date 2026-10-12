(function () {
    "use strict";

    var projects = window.PROJECTS || [];

    // Tiny DOM builder. Text always goes in as text nodes, never as HTML.
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
        var node = el("div", { class: "cover", style: "--hue: " + (project.hue == null ? 160 : project.hue) });
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

    function paragraphs(parent, items) {
        (items || []).forEach(function (text) { parent.appendChild(el("p", { text: text })); });
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

        var content = el("div", { class: "project-content" });

        if (project.overview && project.overview.length) {
            var overview = el("section", {}, el("h2", { text: "Overview" }));
            paragraphs(overview, project.overview);
            content.appendChild(overview);
        }

        if (project.contributions && project.contributions.length) {
            var list = el("ul", { class: "bullets" });
            project.contributions.forEach(function (item) { list.appendChild(el("li", { text: item })); });
            content.appendChild(el("section", {}, el("h2", { text: "What I did" }), list));
        }

        if (project.breakdowns && project.breakdowns.length) {
            var section = el("section", {}, el("h2", { text: "Technical breakdown" }));
            project.breakdowns.forEach(function (item) {
                var block = el("div", { class: "breakdown" }, el("h3", { text: item.title }));
                paragraphs(block, item.body);
                if (item.image) block.appendChild(el("img", { src: item.image, alt: item.title, loading: "lazy" }));
                if (item.code) block.appendChild(el("pre", {}, el("code", { text: item.code })));
                section.appendChild(block);
            });
            content.appendChild(section);
        }

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
    if (grid) renderGrid(grid, document.getElementById("project-filters"));

    var projectRoot = document.getElementById("project");
    if (projectRoot) renderProject(projectRoot);

    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
})();
