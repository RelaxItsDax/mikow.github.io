// =============================================================================
// Site background shader
//
// Runs as a full-screen fragment shader behind every page (see js/background.js).
// The entry point is Shadertoy-style, so most Shadertoy shaders paste straight in:
//
//     void mainImage(out float4 fragColor, in float2 fragCoord)
//
// The browser compiles this as GLSL ES 3.00, but HLSL spellings are aliased, so
// you can write either:
//     float2/3/4, int2/3/4, bool2/3/4, float2x2/3x3/4x4,
//     lerp, frac, saturate, mul, atan2, fmod, ddx, ddy, rsqrt, static
// Not available: semantics (": SV_Target"), cbuffers, SamplerState/Texture2D,
// and implicit scalar-to-vector casts ("float3 c = 0;" must be "float3(0.0)").
//
// Inputs
//     float3 iResolution   canvas size in pixels (xy), z = 1
//     float  iTime         seconds since the page loaded
//     float4 iMouse        xy = pointer position in pixels, origin bottom-left
//                          (far off-screen until the pointer first moves)
//     float  iScroll       how far the page is scrolled, in viewport heights
//     float3 iBackground   the page's --bg colour      } these follow the
//     float3 iAccent       the page's --accent colour  } light / dark theme
//
// While previewing on localhost the file is hot-reloaded on save, and compile
// errors show up in a box at the bottom of the page.
// =============================================================================

float hash(float2 p)
{
    p = frac(p * float2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return frac(p.x * p.y);
}

float noise(float2 p)
{
    float2 i = floor(p);
    float2 f = frac(p);
    float2 u = f * f * (3.0 - 2.0 * f);

    return lerp(lerp(hash(i),                    hash(i + float2(1.0, 0.0)), u.x),
                lerp(hash(i + float2(0.0, 1.0)), hash(i + float2(1.0, 1.0)), u.x), u.y);
}

float fbm(float2 p)
{
    static float2x2 rotate = float2x2(1.6, 1.2, -1.2, 1.6);

    float value = 0.0;
    float amplitude = 0.5;
    for (int octave = 0; octave < 5; octave++)
    {
        value += amplitude * noise(p);
        p = mul(rotate, p);
        amplitude *= 0.5;
    }
    return value;
}

// Two independent random values in 0..1 per input point.
float2 hash2(float2 p)
{
    float3 q = frac(p.xyx * float3(0.1031, 0.1030, 0.0973));
    q += dot(q, q.yzx + 33.33);
    return frac((q.xx + q.yz) * q.zy);
}

// Worley (cellular) noise. One feature point is scattered in each unit cell.
// Returns x = distance to the nearest point (F1), y = distance to the second
// nearest (F2). Both are roughly 0..1.
//     cells:   worley(p, 0.0).x
//     borders: f.y - f.x   (0 on the edges between cells)
// `time` makes the points orbit inside their cells; pass 0.0 for a static pattern.
float2 worley(float2 p, float time)
{
    float2 cell  = floor(p);
    float2 local = frac(p);

    float2 nearest = float2(8.0, 8.0);
    for (int y = -1; y <= 1; y++)
    {
        for (int x = -1; x <= 1; x++)
        {
            float2 offset = float2(float(x), float(y));
            float2 point  = 0.5 + 0.5 * sin(time + 6.2831853 * hash2(cell + offset));
            float  dist   = length(offset + point - local);

            if (dist < nearest.x)
                nearest = float2(dist, nearest.x);
            else if (dist < nearest.y)
                nearest.y = dist;
        }
    }
    return nearest;
}

float2 worleyNoHash(float2 p)
{
    float2 cell  = floor(p);
    float2 local = frac(p);

    float2 nearest = float2(8.0, 8.0);
    for (int y = -1; y <= 1; y++)
    {
        for (int x = -1; x <= 1; x++)
        {
            float2 offset = float2(float(x), float(y));
            float2 point  = 0.5 + 0.5 * offset;
            float  dist   = length(offset + point - local);

            if (dist < nearest.x)
            nearest = float2(dist, nearest.x);
            else if (dist < nearest.y)
            nearest.y = dist;
        }
    }
    return nearest;
}

// Simplex noise. Smooth gradient noise on a triangular grid: cheaper than
// classic Perlin and without its axis-aligned look. Returns roughly -1..1,
// so use `0.5 + 0.5 * simplex(p)` when you need 0..1.
float simplex(float2 p)
{
    float skew   = 0.366025404; // (sqrt(3) - 1) / 2
    float unskew = 0.211324865; // (3 - sqrt(3)) / 6

    // Skew onto a square grid to find which cell we're in, then pick which of
    // the cell's two triangles contains p.
    float2 cell   = floor(p + (p.x + p.y) * skew);
    float2 d0     = p - cell + (cell.x + cell.y) * unskew;
    float2 middle = (d0.x > d0.y) ? float2(1.0, 0.0) : float2(0.0, 1.0);
    float2 d1     = d0 - middle + unskew;
    float2 d2     = d0 - 1.0 + 2.0 * unskew;

    // Random gradient at each of the triangle's three corners.
    float2 g0 = 2.0 * hash2(cell) - 1.0;
    float2 g1 = 2.0 * hash2(cell + middle) - 1.0;
    float2 g2 = 2.0 * hash2(cell + 1.0) - 1.0;

    // Each corner contributes inside a radial falloff around it.
    float3 falloff = max(0.5 - float3(dot(d0, d0), dot(d1, d1), dot(d2, d2)), 0.0);
    falloff *= falloff;
    falloff *= falloff;

    return 70.0 * dot(falloff, float3(dot(d0, g0), dot(d1, g1), dot(d2, g2)));
}

float fireNoise(in float2 p, in float t) {

    float oct2 = worley(p * float2(0.01) + float2(0.0, -t * 0.5), t * 0.1).x;
    float oct3 = worley(p * float2(0.025) + float2(0.0, -t * 1.0), t * 0.25).x;
    float oct4 = worley(p * float2(0.05) + float2(0.0, -t * 2.0), t).x;

    float breakup = noise (p * float2(0.05));

    float n = oct2 * 5.0 + oct3 * 2.0 + oct4 * 1.0 + breakup * 3.0;
    n = n / 11.0;
    return saturate(n);
}


float starLayer(in float2 p, in float t) {
    float nebulae = simplex(p * float2(0.05));
    nebulae = pow(nebulae, 5.0);

    float stars = worley(p * float2(0.01), 0.0).x;

    //stars = saturate((pow(stars, 2.0) * 2.0 + pow(stars, 5.0) * 4.0) - 0.5);


    return stars;




}


void mainImage(out float4 fragColor, in float2 fragCoord)
{

    float f = fireNoise(fragCoord, iTime);


    float centerA = sin(iTime * 0.299199300342) * 0.1 + 0.5;
    float centerB = sin(iTime * 0.299199300342 + 21.0) * 0.1 + 0.5;

    float verticalMaskA = pow(1.0 - 2.0 * pow(abs(fragCoord.x / iResolution.x - centerA), 2.0), 20.0);
    float verticalMaskB = pow(1.0 - 2.0 * pow(abs(fragCoord.x / iResolution.x - centerB), 2.0), 20.0);

    float simplexMask = saturate(simplex(fragCoord * 0.001 + float2(iTime * 0.1)) * 0.5 + 0.5);

    float n = f * simplexMask;

    float4 a = verticalMaskA * n * float4(0.0, 1.0, 1.0, 1.0);
    float4 b = verticalMaskB * n * float4(0.0, 0.0, 1.0, 1.0);



    float4 finalColor = a + b;

    fragColor = finalColor * 0.5;
}
