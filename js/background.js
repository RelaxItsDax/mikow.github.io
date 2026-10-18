/*
 * Animated shader background.
 * Loads shaders/background.frag, compiles it with WebGL2 and draws it on a
 * full-screen canvas behind the page. If WebGL2 is missing or the shader fails
 * to compile, nothing is added and the page keeps its plain --bg colour.
 */
(function () {
    "use strict";

    var SHADER_URL = "shaders/background.frag";

    // Tiling noise textures, bound in order as iChannel0, iChannel1…
    var TEXTURE_URLS = [
        "assets/img/shaders/fire_noise_tex.jpeg",
        "assets/img/shaders/tiling_simplex.png"
    ];

    // Render resolution relative to CSS pixels. 0.5 is cheap and fine for soft
    // shaders; raise towards 1 (or window.devicePixelRatio) for crisp detail.
    var PIXEL_SCALE = 0.5;

    // Re-fetch the shader every second and show compile errors on the page.
    var DEV = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);

    var canvas = document.createElement("canvas");
    canvas.className = "shader-bg";
    canvas.setAttribute("aria-hidden", "true");

    var gl = canvas.getContext("webgl2", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;

    // ---------- On / off toggle ----------

    // A button in the header turns the background off for visitors whose
    // hardware struggles with it. The choice is remembered on this device.
    var STORAGE_KEY = "background-enabled";

    var enabled = true;
    try { enabled = window.localStorage.getItem(STORAGE_KEY) !== "false"; } catch (error) {}

    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "btn btn-small bg-toggle";

    function applyEnabled() {
        canvas.hidden = !enabled;
        toggle.setAttribute("aria-pressed", String(enabled));
        toggle.textContent = enabled ? "Background: on" : "Background: off";
        dirty = true;
    }

    toggle.addEventListener("click", function () {
        enabled = !enabled;
        try { window.localStorage.setItem(STORAGE_KEY, String(enabled)); } catch (error) {}
        applyEnabled();
    });

    var nav = document.querySelector(".site-header .nav");
    if (nav) nav.appendChild(toggle);

    var VERTEX = [
        "#version 300 es",
        "void main() {",
        "    // One triangle that covers the screen; no vertex buffers needed.",
        "    gl_Position = vec4(float((gl_VertexID << 1) & 2) * 2.0 - 1.0, float(gl_VertexID & 2) * 2.0 - 1.0, 0.0, 1.0);",
        "}"
    ].join("\n");

    // Everything before "#line 1" is prepended to the shader file, so error
    // line numbers still match the file.
    var PRELUDE = [
        "#version 300 es",
        "precision highp float;",
        "uniform vec3 iResolution;",
        "uniform float iTime;",
        "uniform vec4 iMouse;",
        "uniform float iScroll;",
        "uniform vec3 iBackground;",
        "uniform vec3 iAccent;",
        "uniform sampler2D iChannel0;",
        "uniform sampler2D iChannel1;",
        "out vec4 bgFragColor;",
        "#line 1",
        ""
    ].join("\n");

    var MAIN = [
        "",
        "void main() {",
        "    vec4 colour = vec4(0.0, 0.0, 0.0, 1.0);",
        "    mainImage(colour, gl_FragCoord.xy);",
        "    bgFragColor = vec4(colour.rgb, 1.0);",
        "}"
    ].join("\n");

    function compile(type, source) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            var log = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw new Error(log);
        }
        return shader;
    }

    function build(source) {
        var vertex = compile(gl.VERTEX_SHADER, VERTEX);
        var fragment = compile(gl.FRAGMENT_SHADER, PRELUDE + source + MAIN);
        var program = gl.createProgram();
        gl.attachShader(program, vertex);
        gl.attachShader(program, fragment);
        gl.linkProgram(program);
        gl.deleteShader(vertex);
        gl.deleteShader(fragment);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            var log = gl.getProgramInfoLog(program);
            gl.deleteProgram(program);
            throw new Error(log);
        }
        var uniforms = {};
        ["iResolution", "iTime", "iMouse", "iScroll", "iBackground", "iAccent", "iChannel0", "iChannel1"].forEach(function (name) {
            uniforms[name] = gl.getUniformLocation(program, name);
        });
        return { program: program, uniforms: uniforms };
    }

    // ---------- Textures ----------

    // Each texture starts as a single mid-grey pixel so the shader can draw
    // straight away, then the image replaces it once it has downloaded.
    var textures = TEXTURE_URLS.map(function (url) {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([128, 128, 128, 255]));

        var image = new Image();
        image.onload = function () {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            // Noise values are data, not colours, so upload them untouched.
            gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            dirty = true;
        };
        image.onerror = function () {
            console.warn("Background texture could not be loaded:", url);
        };
        image.src = url;
        return texture;
    });

    // ---------- Inputs ----------

    // Resolve any CSS colour (hex, rgb(), hsl()…) held in a custom property to 0–1 RGB.
    var swatch = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    function themeColour(property) {
        swatch.clearRect(0, 0, 1, 1);
        swatch.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(property).trim();
        swatch.fillRect(0, 0, 1, 1);
        var pixel = swatch.getImageData(0, 0, 1, 1).data;
        return [pixel[0] / 255, pixel[1] / 255, pixel[2] / 255];
    }

    var background, accent;
    var dirty = true; // forces a redraw when animation is paused
    function readTheme() {
        background = themeColour("--bg");
        accent = themeColour("--accent");
        dirty = true;
    }
    readTheme();
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", readTheme);

    var mouse = [-1e5, -1e5];
    window.addEventListener("pointermove", function (event) {
        mouse[0] = event.clientX * PIXEL_SCALE;
        mouse[1] = (window.innerHeight - event.clientY) * PIXEL_SCALE;
    }, { passive: true });

    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    applyEnabled();

    // ---------- Render loop ----------

    var current = null;
    var currentSource = null;

    function frame(now) {
        window.requestAnimationFrame(frame);
        if (!current || !enabled) return;

        var width = Math.max(1, Math.round(window.innerWidth * PIXEL_SCALE));
        var height = Math.max(1, Math.round(window.innerHeight * PIXEL_SCALE));
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
            dirty = true;
        }

        // With reduced motion on, draw a single still frame and only redraw
        // when the size, theme or shader changes.
        var still = false;
        if (still && !dirty) return;
        dirty = false;

        var uniforms = current.uniforms;
        gl.viewport(0, 0, width, height);
        gl.useProgram(current.program);
        gl.uniform3f(uniforms.iResolution, width, height, 1);
        gl.uniform1f(uniforms.iTime, still ? 0 : now / 1000);
        gl.uniform4f(uniforms.iMouse, mouse[0], mouse[1], 0, 0);
        gl.uniform1f(uniforms.iScroll, still ? 0 : window.scrollY / window.innerHeight);
        gl.uniform3fv(uniforms.iBackground, background);
        gl.uniform3fv(uniforms.iAccent, accent);
        textures.forEach(function (texture, unit) {
            gl.activeTexture(gl.TEXTURE0 + unit);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.uniform1i(uniforms["iChannel" + unit], unit);
        });
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    // ---------- Loading, hot reload and error display ----------

    var errorBox = null;
    function showError(message) {
        console.error("Background shader failed to compile:\n" + message);
        if (!DEV) return;
        if (!errorBox) {
            errorBox = document.createElement("pre");
            errorBox.style.cssText = "position:fixed;left:1rem;right:1rem;bottom:1rem;z-index:1000;max-height:40vh;" +
                "overflow:auto;margin:0;padding:1rem;background:#2a0f12;color:#ffb4b4;border:1px solid #7a2a30;" +
                "border-radius:8px;font:13px/1.5 ui-monospace,monospace;white-space:pre-wrap";
            document.body.appendChild(errorBox);
        }
        errorBox.textContent = SHADER_URL + "\n" + message;
        errorBox.hidden = false;
    }

    function load() {
        return fetch(SHADER_URL, { cache: DEV ? "no-store" : "default" })
            .then(function (response) {
                if (!response.ok) throw new Error("HTTP " + response.status);
                return response.text();
            })
            .then(function (source) {
                if (source === currentSource) return;
                currentSource = source;
                try {
                    var next = build(source);
                    if (current) gl.deleteProgram(current.program);
                    else document.body.prepend(canvas);
                    current = next;
                    dirty = true;
                    if (errorBox) errorBox.hidden = true;
                } catch (error) {
                    // Keep showing the last shader that worked.
                    showError(error.message);
                }
            })
            .catch(function (error) {
                console.warn("Background shader could not be loaded:", error);
            });
    }

    load();
    if (DEV) window.setInterval(load, 1000);
    window.requestAnimationFrame(frame);
})();
