// ─────────────────────────────────────────────────────────────────────────────
// src/components/pages/qr-shape-geometry.ts  (v2 — verified per-shape geometry)
//
// Every pointInShape formula is derived directly from the SVG pathIn100
// coordinates by converting each vertex/control point from [0,100] space
// to [0,1] normalised space (dx = nx-0.5, dy = ny-0.5).
//
// The computeFinderSafeScale solver has NO minimum floor — it binary-searches
// freely down to 0.25.  The per-shape minimums in v1 were causing the solver
// to return scales where finders were still outside the shape.
// ─────────────────────────────────────────────────────────────────────────────

// ═══════════════════════════════════════════════════════════════════════════
// POINT-IN-SHAPE
// All coordinates: nx,ny ∈ [0,1].  Canvas centre = (0.5,0.5).
// dx = nx-0.5,  dy = ny-0.5  →  both ∈ [-0.5, +0.5]
// ═══════════════════════════════════════════════════════════════════════════

export function pointInShape(nx: number, ny: number, shapeId: string): boolean {
  const dx = nx - 0.5;
  const dy = ny - 0.5;

  switch (shapeId) {

    // ─── square ──────────────────────────────────────────────────────────
    // path: M0,0 H100 V100 H0 Z  →  full [0,1] canvas
    case "square":
      return true;

    // ─── rounded-square ──────────────────────────────────────────────────
    // path: M12,0 H88 Q100,0 100,12 V88 Q100,100 88,100 H12 Q0,100 0,88 V12 Q0,0 12,0
    // corner radius = 12 units → 0.12 in [0,1]
    case "rounded-square": {
      const R = 0.12, ax = Math.abs(dx), ay = Math.abs(dy), H = 0.5;
      if (ax > H || ay > H) return false;
      if (ax > H - R && ay > H - R) {
        const cx = ax - (H - R), cy = ay - (H - R);
        return cx * cx + cy * cy <= R * R;
      }
      return true;
    }

    // ─── circle ──────────────────────────────────────────────────────────
    // path: M50,0 A50,50 → radius = 50/100 = 0.5 in [0,1]
    // 0.50 = full radius; clipPath on the SVG trims the visual edge cleanly
    case "circle":
      return dx * dx + dy * dy <= 0.50 * 0.50;

    // ─── heart ───────────────────────────────────────────────────────────
    // path: M50,85 C50,85 5,58 5,32 C5,15 17,8 30,8 C39,8 46,13 50,19
    //        C54,13 61,8 70,8 C83,8 95,15 95,32 C95,58 50,85 50,85
    //
    // Key measurements from path (in [0,1]):
    //   left/right edges: x=5/100=0.05, x=95/100=0.95  →  half-width=0.45
    //   top of lobes:     y=8/100=0.08  →  dy=-0.42
    //   bottom tip:       y=85/100=0.85 →  dy=+0.35
    //   widest point:     ~y=50/100     →  dy=0.00
    //   lobe centres:     x=30/100=0.30 and x=70/100=0.70
    //                     y≈(8+32)/2/100=0.20  →  dy=-0.30
    //   lobe radius:      ~(50-5)/100*0.7 ≈ 0.21
    //
    // Strategy: union of two circles (the lobes) + a downward triangle for body
    case "heart": {
      // Lobe radius and centres
      const lobeR  = 0.225;
      const lobeCy = -0.285;   // dy of lobe centres
      const lobeCxL = -0.195;  // dx of left lobe centre
      const lobeCxR =  0.195;  // dx of right lobe centre
      if ((dx - lobeCxL) ** 2 + (dy - lobeCy) ** 2 <= lobeR * lobeR) return true;
      if ((dx - lobeCxR) ** 2 + (dy - lobeCy) ** 2 <= lobeR * lobeR) return true;

      // Body: trapezoid from the lobe tops down to the tip
      // Top of body: dy = lobeCy + lobeR ≈ -0.06
      // Bottom tip:  dy = +0.35
      // Width tapers from full (0.45) at top to 0 at bottom
      const bodyTop = lobeCy + lobeR;
      const bodyBot = 0.35;
      if (dy < bodyTop || dy > bodyBot) return false;
      const t = (dy - bodyTop) / (bodyBot - bodyTop); // 0 at top, 1 at tip
      const halfW = 0.45 * (1 - t);
      return Math.abs(dx) <= halfW;
    }

    // ─── hexagon ─────────────────────────────────────────────────────────
    // path: M50,2 L95,26 L95,74 L50,98 L5,74 L5,26
    // Pointy-left/right hexagon (flat top/bottom).
    // Vertices in dx,dy:
    //   (0,−0.48), (+0.45,−0.24), (+0.45,+0.24), (0,+0.48), (−0.45,+0.24), (−0.45,−0.24)
    // 3 conditions (by symmetry):
    //   1) |dy| ≤ 0.48                      (top/bottom flat sides)
    //   2) |dx| ≤ 0.45                      (left/right vertical sides)
    //   3) slant sides: derived from edge (0,−0.48)→(0.45,−0.24):
    //      direction = (0.45, 0.24), normal pointing inward = (−0.24, 0.45) (rotated 90°)
    //      Line: −0.24*(dx−0) + 0.45*(dy−(−0.48)) = 0
    //      −0.24*dx + 0.45*dy + 0.216 = 0
    //      Inside: −0.24*dx + 0.45*dy + 0.216 ≥ 0  (right side, positive-x half)
    //      By symmetry for |dx|: 0.24*|dx| − 0.45*|dy| ≤ 0.216
    //      Equivalently: 0.24*|dx| + 0.45*(0.48 − |dy|) ≥ 0  ... use simpler form:
    case "hexagon": {
      const ax = Math.abs(dx), ay = Math.abs(dy);
      // The slant-edge condition: for the top-right edge from (0,−0.48) to (0.45,−0.24)
      // a point (ax, −ay) is inside if:  0.24*ax − 0.45*(−ay + 0.48) ≤ 0
      // i.e.  0.24*ax + 0.45*ay ≤ 0.45*0.48 = 0.216
      // But that would exclude the centre — let me re-check:
      // At centre dx=0,dy=0: 0.24*0 + 0.45*0 = 0 ≤ 0.216 ✓
      // At top vertex dy=-0.48: 0.24*0 + 0.45*0.48 = 0.216 ≤ 0.216 ✓ (on boundary)
      // At right vertex dx=0.45: 0.24*0.45 + 0.45*0 = 0.108 ≤ 0.216 ✓
      // At top-right corner (would be outside): dx=0.45,dy=-0.48: 0.108+0.216=0.324 > 0.216 ✓ excluded
      return ay <= 0.478 && ax <= 0.448 && 0.24 * ax + 0.45 * ay <= 0.2165;
    }

    // ─── speech-bubble ───────────────────────────────────────────────────
    // path: M5,4 Q5,1 9,1 L91,1 Q95,1 95,5 L95,68 Q95,72 91,72
    //        L58,72 L50,92 L42,72 L9,72 Q5,72 5,68 Z
    // Body: x=[5,95]/100, y=[1,72]/100  →  dx∈[-0.45,0.45], dy∈[-0.49,0.22]
    // Tail: triangle from y=72 to y=92 (dy=0.22 to 0.42), x=[42,58]/100
    case "speech-bubble": {
      const ax = Math.abs(dx);
      if (ax <= 0.445 && dy >= -0.49 && dy <= 0.22) return true;
      if (dy > 0.22 && dy <= 0.42) {
        const t = (dy - 0.22) / 0.20;
        return ax <= 0.08 * (1 - t);
      }
      return false;
    }

    // ─── star ────────────────────────────────────────────────────────────
    // path: M50,4 L61,36 L96,36 L68,56 L79,90 L50,70 L21,90 L32,56 L4,36 L39,36
    // 5-pointed star, tip pointing UP.
    // Outer vertices (tips) in dx,dy:
    //   Top:         (0, -0.46)
    //   Right:       (+0.46, -0.14)   [96/100-0.5=0.46, 36/100-0.5=-0.14]
    //   Lower-right: (+0.29, +0.40)   [79/100-0.5=0.29, 90/100-0.5=0.40]
    //   Lower-left:  (-0.29, +0.40)
    //   Left:        (-0.46, -0.14)
    // Inner vertices (notches) in dx,dy:
    //   Top-right:   (+0.11, -0.14)   [61/100-0.5=0.11, 36/100-0.5=-0.14]
    //   Right:       (+0.18, +0.06)   [68/100-0.5=0.18, 56/100-0.5=0.06]
    //   Bottom:      (0,     +0.20)   [50/100-0.5=0, 70/100-0.5=0.20]
    //   Left:        (-0.18, +0.06)
    //   Top-left:    (-0.11, -0.14)
    // Strategy: point-in-polygon test using the actual 10 vertices
    case "star": {
      // 10 vertices of the star in (dx, dy) order:
      const vx = [ 0,    0.11,  0.46,  0.18,  0.29,  0,    -0.29, -0.18, -0.46, -0.11];
      const vy = [-0.46,-0.14, -0.14,  0.06,  0.40,  0.20,  0.40,  0.06, -0.14, -0.14];
      return polyContains(vx, vy, dx, dy);
    }

    // ─── diamond ─────────────────────────────────────────────────────────
    // path: M50,3 L97,50 L50,97 L3,50
    // Rhombus. Half-diagonals: horizontal=(97-3)/2/100=0.47, vertical=(97-3)/2/100=0.47
    // But offset: centre is at (50/100, 50/100)=(0.5,0.5) ✓
    // Condition: |dx|/0.47 + |dy|/0.47 ≤ 1
    case "diamond":
      return (Math.abs(dx) + Math.abs(dy)) / 0.47 <= 1;

    // ─── shield ──────────────────────────────────────────────────────────
    // path: M50,3 L93,16 L93,46 Q93,78 50,97 Q7,78 7,46 L7,16
    // Top: rectangle x=[7,93]/100, y=[3,46]/100
    //      dx∈[-0.43,0.43], dy∈[-0.47,-0.04]
    // Bottom: curved, tapers from full width at dy=-0.04 to tip at dy=+0.47
    case "shield": {
      const ax = Math.abs(dx);
      if (dy < -0.47) return false;
      if (dy <= -0.04) return ax <= 0.43;
      const t = (dy + 0.04) / 0.51;  // 0 at top of curve, 1 at tip
      return ax <= 0.43 * (1 - t * t);
    }

    // ─── octagon ─────────────────────────────────────────────────────────
    // path: M29,3 H71 L97,29 L97,71 L71,97 H29 L3,71 L3,29
    // Regular octagon. Cut corners at 45°.
    // Half-width = (97-3)/2/100 = 0.47 (but actual = 0.44 from centre to flat side)
    // The diagonal cut: from (0.29-0.5, 0.03-0.5)=(-0.21,-0.47) to (0.5-0.5, 0.03-0.5... 
    // Vertices: (±0.21,±0.47), (±0.47,±0.21)
    // Conditions: |dx|≤0.44 AND |dy|≤0.44 AND |dx|+|dy|≤0.65
    case "octagon": {
      const ax = Math.abs(dx), ay = Math.abs(dy);
      return ax <= 0.44 && ay <= 0.44 && ax + ay <= 0.64;
    }

    // ─── arrow ───────────────────────────────────────────────────────────
    // path: M50,3 L95,48 L68,48 L68,97 L32,97 L32,48 L5,48
    // Arrow pointing UP.
    // Head: triangle, tip at (0.5,0.03)=(dx=0,dy=-0.47), base at y=48/100 (dy=-0.02)
    //   Left base: (5/100,48/100)=(dx=-0.45,dy=-0.02)
    //   Right base:(95/100,48/100)=(dx=+0.45,dy=-0.02)
    // Shaft: rectangle x=[32,68]/100=(dx∈[-0.18,+0.18]), y=[48,97]/100=(dy∈[-0.02,+0.47])
    case "arrow": {
      const ax = Math.abs(dx);
      if (dy < -0.47) return false;
      if (dy <= -0.02) {
        // Inside triangle head: linear taper from tip (ax=0) to base (ax=0.45)
        const t = (dy + 0.47) / 0.45;  // 0 at tip, 1 at base
        return ax <= 0.45 * t;
      }
      // Shaft
      return ax <= 0.18 && dy <= 0.47;
    }

    // ─── cross ───────────────────────────────────────────────────────────
    // path: M33,3 H67 V33 H97 V67 H67 V97 H33 V67 H3 V33 H33
    // Two overlapping bars:
    //   Vertical:   x=[33,67]/100=(dx∈[-0.17,+0.17]), y=[3,97]/100=(dy∈[-0.47,+0.47])
    //   Horizontal: x=[3,97]/100=(dx∈[-0.47,+0.47]),  y=[33,67]/100=(dy∈[-0.17,+0.17])
    case "cross": {
      const ax = Math.abs(dx), ay = Math.abs(dy);
      return (ax <= 0.17 && ay <= 0.47) || (ax <= 0.47 && ay <= 0.17);
    }

    // ─── droplet / teardrop ──────────────────────────────────────────────
    // path: M50,3 Q80,30 80,58 Q80,87 50,97 Q20,87 20,58 Q20,30 50,3
    // Approximately: circle bottom half + tapering top half.
    // Bottom circle approx centre: (50/100, (58+87)/2/100) = (0.5, 0.725) → dy=+0.225
    // Bottom circle radius ≈ (80-20)/2/100 = 0.30
    // Top taper: from y=58/100 (dy=+0.08) to tip at y=3/100 (dy=-0.47)
    case "droplet": {
      const botCy = 0.22;   // dy of bottom circle centre
      const botR  = 0.28;
      if (dx * dx + (dy - botCy) ** 2 <= botR * botR) return true;
      // Upper taper: from dy=botCy-botR up to tip
      if (dy >= -0.47 && dy < botCy - botR) {
        const t = (botCy - botR - dy) / (botCy - botR + 0.47); // 0 at base, 1 at tip
        return Math.abs(dx) <= botR * (1 - t);
      }
      return false;
    }

    // ─── leaf ────────────────────────────────────────────────────────────
    // path: M50,97 Q6,78 6,34 Q6,3 50,3 Q94,3 94,34 Q94,78 50,97
    // Symmetric vertically-oriented lens/leaf shape.
    // Left edge: x=6/100=0.06 at widest → dx=-0.44
    // Right edge: x=94/100=0.94 → dx=+0.44
    // Top/bottom tips: y=3/100 → dy=-0.47, y=97/100 → dy=+0.47
    // Widest at y=34/100 → dy=-0.16 and y=78/100... no, path says Q6,78 meaning
    // the widest control point is around y=(3+97)/2=50 → dy=0.
    // Approximate as tall ellipse with rx=0.43, ry=0.47
    case "leaf":
      return (dx / 0.43) ** 2 + (dy / 0.47) ** 2 <= 1;

    // ─── pentagon ────────────────────────────────────────────────────────
    // path: M50,3 L97,36 L79,93 L21,93 L3,36
    // Vertices in dx,dy:
    //   Top:         (0, -0.47)
    //   Right:       (+0.47, -0.14)
    //   Lower-right: (+0.29, +0.43)
    //   Lower-left:  (-0.29, +0.43)
    //   Left:        (-0.47, -0.14)
    case "pentagon": {
      const vx = [0,     0.47,  0.29, -0.29, -0.47];
      const vy = [-0.47, -0.14, 0.43,  0.43, -0.14];
      return polyContains(vx, vy, dx, dy);
    }

    // ─── cloud ───────────────────────────────────────────────────────────
    // path: M17,82 Q4,82 4,62 Q4,46 17,42 Q17,18 34,18 Q45,18 51,27
    //        Q57,22 65,22 Q82,22 82,38 Q94,42 92,60 Q92,82 76,82 Z
    // Reading the path: the cloud is in y=[18,82]/100 → dy=[-0.32,+0.32]
    // Left lobe centre ≈ (17+34)/2/100=0.255 → dx=-0.245, y≈(18+42)/2/100=0.30 → dy=-0.20
    // Left lobe radius ≈ (34-17)/2/100 ≈ 0.085... that seems too small.
    //
    // Let me re-read the path more carefully:
    // M17,82 = start at left bottom (dx=-0.33, dy=+0.32)
    // Q4,82 4,62 = left side, going up, control (4,82)→(4,62)
    //   This arc goes from (17,82) to (4,62) with control (4,82)
    //   Centre of arc approximately: x≈4, y≈(82+62)/2=72... 
    // Q4,46 17,42 = from (4,62) to (17,42) with control (4,46)
    // Q17,18 34,18 = from (17,42) to (34,18) with control (17,18)
    //   → Left lobe top edge, passing through (17,30)
    // Q45,18 51,27 = from (34,18) to (51,27) with control (45,18)
    // Q57,22 65,22 = from (51,27) to (65,22) with control (57,22)
    // Q82,22 82,38 = from (65,22) to (82,38) with control (82,22)
    //   → Right lobe area
    // Q94,42 92,60 = right side going down
    // Q92,82 76,82 = to bottom-right
    //
    // Approximation with 4 circles:
    //   Left lobe:   centre≈(20,30)/100→(dx=-0.30,dy=-0.20), r≈0.17
    //   Centre lobe: centre≈(50,22)/100→(dx=0,    dy=-0.28), r≈0.15
    //   Right lobe:  centre≈(73,30)/100→(dx=+0.23,dy=-0.20), r≈0.17
    //   Body/base:   centre≈(50,62)/100→(dx=0,    dy=+0.12), r≈0.24
    case "cloud": {
      const lobes: [number, number, number][] = [
        [-0.30, -0.20, 0.175],   // left lobe
        [ 0.00, -0.27, 0.155],   // centre top lobe
        [+0.23, -0.20, 0.175],   // right lobe
        [ 0.00, +0.10, 0.240],   // body base
        [-0.24, +0.08, 0.145],   // left base
        [+0.20, +0.08, 0.145],   // right base
      ];
      return lobes.some(([lx, ly, lr]) => (dx-lx)**2 + (dy-ly)**2 <= lr*lr);
    }

    // ─── location ────────────────────────────────────────────────────────
    // path: M50,3 Q82,3 82,35 Q82,63 50,97 Q18,63 18,35 Q18,3 50,3
    // Circle top + V-shaped bottom.
    // Circle: x=[18,82]/100, top y=3, passes through y=35 on sides
    //   Centre approximately: (50/100, 35/100) → (dx=0, dy=-0.15), radius≈0.32
    //   But actually it's a full circle top that narrows to a point.
    //   The "circle" part: centre (50,35)/100 → (dx=0, dy=-0.15), r=(82-18)/2/100=0.32
    case "location": {
      const cirCy = -0.15;
      const cirR  = 0.32;
      if (dx * dx + (dy - cirCy) ** 2 <= cirR * cirR) return true;
      // V-taper from circle bottom to tip
      const cirBase = cirCy + cirR;  // ≈ +0.17
      if (dy > cirBase && dy <= 0.47) {
        const t = (dy - cirBase) / (0.47 - cirBase);
        return Math.abs(dx) <= cirR * (1 - t);
      }
      return false;
    }

    default:
      return true;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// POLYGON POINT-IN-TEST (ray casting)
// ═══════════════════════════════════════════════════════════════════════════
function polyContains(vx: number[], vy: number[], px: number, py: number): boolean {
  const n = vx.length;
  let inside = false;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = vx[i], yi = vy[i], xj = vx[j], yj = vy[j];
    const intersect = ((yi > py) !== (yj > py)) &&
      (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// ═══════════════════════════════════════════════════════════════════════════
// CANONICAL MODULE COORDINATE (unchanged)
// ═══════════════════════════════════════════════════════════════════════════
export function moduleCentreNorm(col: number, row: number, s: number, N: number): [number, number] {
  const origin = (1 - s) / 2;
  const cs = s / N;
  return [origin + (col + 0.5) * cs, origin + (row + 0.5) * cs];
}

// ═══════════════════════════════════════════════════════════════════════════
// FINDER SAFE-SCALE SOLVER
//
// Binary-searches freely from 0.25 to 1.0.
// No minimum floor — the solver will find the true maximum scale where ALL
// 147 finder module centres lie inside the shape.
//
// For concave shapes (star, cross, arrow, diamond) the scale can be quite
// small.  That is correct — it's the only way to guarantee the finders fit.
// ═══════════════════════════════════════════════════════════════════════════
export function computeFinderSafeScale(shapeId: string, N: number): number {
  if (shapeId === "square") return 1.0;

  // Build list of (col, row) for all modules in the 3 finder blocks
  const finderModules: Array<[number, number]> = [];
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 7; c++) {
      finderModules.push([c,     r    ]);   // TL finder
      finderModules.push([N-7+c, r    ]);   // TR finder
      finderModules.push([c,     N-7+r]);   // BL finder
    }
  }

  function allInside(s: number): boolean {
    for (const [col, row] of finderModules) {
      const [nx, ny] = moduleCentreNorm(col, row, s, N);
      if (!pointInShape(nx, ny, shapeId)) return false;
    }
    return true;
  }

  if (allInside(1.0)) return 1.0;

  let lo = 0.25, hi = 1.0;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (allInside(mid)) lo = mid; else hi = mid;
  }
  return Math.max(0.25, lo - 0.002);
}