export {}; // Make this a module

const CONFIG = {
  // canvas
  canvasSize: 32,

  // geometry
  centerX: 16,
  centerY: 16,
  radius: 16,
  gap: 0.25,
  skipTriangles: [0],

  // styling
  strokeColor: "#3c3c3c",
  fillColor: "#e07020",
  strokeWidth: 0.5,
};

interface Point {
  x: number;
  y: number;
}

/** Calculate pentagon vertex at given index (0=top, going clockwise) */
function pentagonVertex(index: number): Point {
  // Start at -90° (top) and go clockwise
  const angle = (-90 + index * 72) * (Math.PI / 180);
  return {
    x: CONFIG.centerX + CONFIG.radius * Math.cos(angle),
    y: CONFIG.centerY + CONFIG.radius * Math.sin(angle),
  };
}

/** Calculate centroid of a triangle */
function centroid(p1: Point, p2: Point, p3: Point): Point {
  return {
    x: (p1.x + p2.x + p3.x) / 3,
    y: (p1.y + p2.y + p3.y) / 3,
  };
}

/** Shrink a point toward a center point by a factor */
function shrinkToward(point: Point, center: Point, factor: number): Point {
  return {
    x: point.x + (center.x - point.x) * factor,
    y: point.y + (center.y - point.y) * factor,
  };
}

/** Format a number to 1 decimal place */
function fmt(n: number): string {
  return n.toFixed(1);
}

/** Generate polygon points string */
function polygonPoints(points: Point[]): string {
  return points.map((p) => `${fmt(p.x)},${fmt(p.y)}`).join(" ");
}

// ============ SVG GENERATION ============

function generateSVG(): string {
  const center: Point = { x: CONFIG.centerX, y: CONFIG.centerY };
  const vertices: Point[] = [0, 1, 2, 3, 4].map(pentagonVertex);

  // Triangle names for comments
  const names = ["top", "top-right", "bottom-right", "bottom-left", "top-left"];

  // Each triangle: center → vertex[i] → vertex[i+1]
  const triangles: string[] = [];

  for (let i = 0; i < 5; i++) {
    if (CONFIG.skipTriangles.includes(i)) {
      triangles.push(`  <!-- Triangle ${i} (${names[i]}): SKIPPED -->`);
      continue;
    }

    const v1 = vertices[i];
    const v2 = vertices[(i + 1) % 5];

    // Calculate centroid and shrink points toward it for gap
    const cent = centroid(center, v1, v2);
    const p1 = shrinkToward(center, cent, CONFIG.gap);
    const p2 = shrinkToward(v1, cent, CONFIG.gap);
    const p3 = shrinkToward(v2, cent, CONFIG.gap);

    const points = polygonPoints([p1, p2, p3]);
    const stroke =
      CONFIG.strokeWidth > 0
        ? ` stroke="${CONFIG.strokeColor}" stroke-width="${CONFIG.strokeWidth}" stroke-linejoin="miter"`
        : "";

    triangles.push(
      `  <!-- Triangle ${i}: ${names[i]} -->`,
      `  <polygon points="${points}" fill="${CONFIG.fillColor}"${stroke}/>`,
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CONFIG.canvasSize} ${CONFIG.canvasSize}">
${triangles.join("\n")}
</svg>
`;
}

// ============ MAIN ============

const svg = generateSVG();
const outputPath = "public/favicon.svg";

await Bun.write(outputPath, svg);
console.log(`Generated ${outputPath}`);
