/*
 * The brand sun for generated images (share image, app icons). ImageResponse draws plain
 * <img> and inline styles, so the sun goes in as an SVG data URI.
 * Shapes: docs/brand/ambar-logo.html (same as src/components/logo.tsx).
 */
import { ImageResponse } from "next/og";

const LONG_RAY =
  "M46.6 27 C44 22.5, 52.5 19.5, 49.2 14.5 C46.5 10.5, 52 8, 49.8 3.5 C49.6 2.6, 50 1.5, 50 1 C51.2 2.5, 53.5 5.5, 52.4 8.5 C51 12, 56 14.5, 53.2 19.5 C51.8 22.5, 55 24.5, 53.4 27 Q50 28.5 46.6 27 Z";
const SHORT_RAY =
  "M47 27 C45 23.5, 52 21, 49.4 17 C47.8 14.5, 50 12, 50 10 C51.5 12, 53.2 14.5, 52.2 17 C51 20, 55 23.5, 53 27 Q50 28.2 47 27 Z";
const ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

export function sunDataUri(color: string): string {
  const rays = ANGLES.map(
    (a) =>
      `<path d="${LONG_RAY}" transform="rotate(${a} 50 50)"/><path d="${SHORT_RAY}" transform="rotate(${a + 22.5} 50 50)"/>`,
  ).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="${color}"><circle cx="50" cy="50" r="13"/><circle cx="50" cy="50" r="18" fill="none" stroke="${color}" stroke-width="1.6"/>${rays}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/**
 * App icon: amber sun on ink, full bleed. The sun fills 64% of the square, inside the
 * 80% safe circle of maskable icons, so Android's round or squircle crop never cuts a ray.
 */
export function appIcon(size: number): ImageResponse {
  const sun = Math.round(size * 0.64);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#16120e",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain img */}
      <img src={sunDataUri("#f28c28")} width={sun} height={sun} alt="" />
    </div>,
    { width: size, height: size },
  );
}
