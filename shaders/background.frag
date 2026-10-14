// =============================================================================
// Site background shader
//
// Runs as a full-screen fragment shader behind every page (see js/background.js).
// The entry point is Shadertoy-style, so most Shadertoy shaders paste straight in:
//
//     void mainImage(out vec4 fragColor, in vec2 fragCoord)
//
// The browser compiles this as plain GLSL ES 3.00.
//
// Inputs
//     vec3  iResolution   canvas size in pixels (xy), z = 1
//     float iTime         seconds since the page loaded
//     vec4  iMouse        xy = pointer position in pixels, origin bottom-left
//                         (far off-screen until the pointer first moves)
//     float iScroll       how far the page is scrolled, in viewport heights
//     vec3  iBackground   the page's --bg colour      } these follow the
//     vec3  iAccent       the page's --accent colour  } light / dark theme
//
// While previewing on localhost the file is hot-reloaded on save, and compile
// errors show up in a box at the bottom of the page.
// =============================================================================

//Rectangles from https://www.shadertoy.com/view/MdVXzw
const float total = 60.0;//number of rectangles
const float minSize = 0.03;//rectangle min size
const float maxSize = 0.08-minSize;//rectangle max size
const float yDistribution = 1.0;

float hash(vec2 p)
{
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float noise(vec2 p)
{
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(mix(hash(i),                  hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p)
{
    mat2 rotate = mat2(1.6, 1.2, -1.2, 1.6);

    float value = 0.0;
    float amplitude = 0.5;
    for (int octave = 0; octave < 5; octave++)
    {
        value += amplitude * noise(p);
        p = rotate * p;
        amplitude *= 0.5;
    }
    return value;
}

// Two independent random values in 0..1 per input point.
vec2 hash2(vec2 p)
{
    vec3 q = fract(p.xyx * vec3(0.1031, 0.1030, 0.0973));
    q += dot(q, q.yzx + 33.33);
    return fract((q.xx + q.yz) * q.zy);
}

// Worley (cellular) noise. One feature point is scattered in each unit cell.
// Returns x = distance to the nearest point (F1), y = distance to the second
// nearest (F2). Both are roughly 0..1.
//     cells:   worley(p, 0.0).x
//     borders: f.y - f.x   (0 on the edges between cells)
// `time` makes the points orbit inside their cells; pass 0.0 for a static pattern.
vec2 worley(vec2 p, float time)
{
    vec2 cell  = floor(p);
    vec2 local = fract(p);

    vec2 nearest = vec2(8.0, 8.0);
    for (int y = -1; y <= 1; y++)
    {
        for (int x = -1; x <= 1; x++)
        {
            vec2 offset = vec2(float(x), float(y));
            vec2 point  = 0.5 + 0.5 * sin(time + 6.2831853 * hash2(cell + offset));
            float dist  = length(offset + point - local);

            if (dist < nearest.x)
                nearest = vec2(dist, nearest.x);
            else if (dist < nearest.y)
                nearest.y = dist;
        }
    }
    return nearest;
}

vec2 worleyNoHash(vec2 p)
{
    vec2 cell  = floor(p);
    vec2 local = fract(p);

    vec2 nearest = vec2(8.0, 8.0);
    for (int y = -1; y <= 1; y++)
    {
        for (int x = -1; x <= 1; x++)
        {
            vec2 offset = vec2(float(x), float(y));
            vec2 point  = 0.5 + 0.5 * offset;
            float dist  = length(offset + point - local);

            if (dist < nearest.x)
            nearest = vec2(dist, nearest.x);
            else if (dist < nearest.y)
            nearest.y = dist;
        }
    }
    return nearest;
}

// Simplex noise. Smooth gradient noise on a triangular grid: cheaper than
// classic Perlin and without its axis-aligned look. Returns roughly -1..1,
// so use `0.5 + 0.5 * simplex(p)` when you need 0..1.
float simplex(vec2 p)
{
    float skew   = 0.366025404; // (sqrt(3) - 1) / 2
    float unskew = 0.211324865; // (3 - sqrt(3)) / 6

    // Skew onto a square grid to find which cell we're in, then pick which of
    // the cell's two triangles contains p.
    vec2 cell   = floor(p + (p.x + p.y) * skew);
    vec2 d0     = p - cell + (cell.x + cell.y) * unskew;
    vec2 middle = (d0.x > d0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec2 d1     = d0 - middle + unskew;
    vec2 d2     = d0 - 1.0 + 2.0 * unskew;

    // Random gradient at each of the triangle's three corners.
    vec2 g0 = 2.0 * hash2(cell) - 1.0;
    vec2 g1 = 2.0 * hash2(cell + middle) - 1.0;
    vec2 g2 = 2.0 * hash2(cell + 1.0) - 1.0;

    // Each corner contributes inside a radial falloff around it.
    vec3 falloff = max(0.5 - vec3(dot(d0, d0), dot(d1, d1), dot(d2, d2)), 0.0);
    falloff *= falloff;
    falloff *= falloff;

    return 70.0 * dot(falloff, vec3(dot(d0, g0), dot(d1, g1), dot(d2, g2)));
}

float fireNoise(in vec2 p, in float t) {

    float oct2 = worley(p * vec2(0.01) + vec2(0.0, -t * 0.5), t * 0.1).x;
    float oct3 = worley(p * vec2(0.025) + vec2(0.0, -t * 1.0), t * 0.25).x;
    float oct4 = worley(p * vec2(0.05) + vec2(0.0, -t * 2.0), t).x;

    float breakup = noise (p * vec2(0.05));

    float n = oct2 * 5.0 + oct3 * 2.0 + oct4 * 1.0 + breakup * 3.0;
    n = n / 11.0;
    return clamp(n, 0.0, 1.0);
}

float rectangle(vec2 uv, vec2 pos, float width, float height, float blur) {

    pos = (vec2(width, height) + .01)/2. - abs(uv - pos);
    pos = smoothstep(0., blur , pos);
    return pos.x * pos.y;
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
    sin(_angle),cos(_angle));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = fragCoord.xy / iResolution.xy * 2. - 1.;
    uv.x *= iResolution.x/iResolution.y;

    //Background:
    float f = fireNoise(fragCoord, iTime);

    float centerA = sin(iTime * 0.299199300342) * 0.1 + 0.5;
    float centerB = sin(iTime * 0.299199300342 + 21.0) * 0.1 + 0.5;

    float verticalMaskA = pow(1.0 - 2.0 * pow(abs(fragCoord.x / iResolution.x - centerA), 2.0), 20.0);
    float verticalMaskB = pow(1.0 - 2.0 * pow(abs(fragCoord.x / iResolution.x - centerB), 2.0), 20.0);

    float simplexMask = clamp(simplex(fragCoord * 0.001 + vec2(iTime * 0.1)) * 0.5 + 0.5, 0.0, 1.0);

    float n = f * simplexMask;

    vec4 a = verticalMaskA * n * vec4(0.0, 1.0, 1.0, 1.0);
    vec4 b = verticalMaskB * n * vec4(0.0, 0.0, 1.0, 1.0);

    vec4 color = a + b;

    vec4 rectColor = vec4(0.114, 0.537, 0.788, 1.0);

    //Squares:
    float velX = iTime * 0.02;
    float velY = iTime * 0.02;
    for(float i=0.; i<total; i++){
        float index = i/total;
        float rnd = hash(vec2(index));
        vec3 pos = vec3(0, 0., 0.);
        pos.x = sin(index*rnd*1000.+velY) * yDistribution;
        pos.y = fract(velX*rnd+index)*4.-2.0;
        pos.z = maxSize*rnd+minSize;
        vec2 uvRot = uv - pos.xy + pos.z/2.;
        uvRot = rotate2d( i+iTime/2. ) * uvRot;
        uvRot += pos.xy+pos.z/2.;
        float rect = rectangle(uvRot, pos.xy, pos.z, pos.z, (maxSize + minSize - pos.z));
        color += rectColor * rect * pos.z/maxSize;
    }

    fragColor = color * 0.3;
}
