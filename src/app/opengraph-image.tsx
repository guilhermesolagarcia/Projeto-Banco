import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Âmbar: sem susto no fim do mês. Um banco que explica, avisa e não julga.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LONG_RAY =
  "M46.6 27 C44 22.5, 52.5 19.5, 49.2 14.5 C46.5 10.5, 52 8, 49.8 3.5 C49.6 2.6, 50 1.5, 50 1 C51.2 2.5, 53.5 5.5, 52.4 8.5 C51 12, 56 14.5, 53.2 19.5 C51.8 22.5, 55 24.5, 53.4 27 Q50 28.5 46.6 27 Z";
const SHORT_RAY =
  "M47 27 C45 23.5, 52 21, 49.4 17 C47.8 14.5, 50 12, 50 10 C51.5 12, 53.2 14.5, 52.2 17 C51 20, 55 23.5, 53 27 Q50 28.2 47 27 Z";
const ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

function sunDataUri(color: string): string {
  const rays = ANGLES.map(
    (a) =>
      `<path d="${LONG_RAY}" transform="rotate(${a} 50 50)"/><path d="${SHORT_RAY}" transform="rotate(${a + 22.5} 50 50)"/>`,
  ).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="${color}"><circle cx="50" cy="50" r="13"/><circle cx="50" cy="50" r="18" fill="none" stroke="${color}" stroke-width="1.6"/>${rays}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export default async function OpengraphImage() {
  const [regular, semibold] = await Promise.all([
    readFile(join(process.cwd(), "assets/HostGrotesk-400.ttf")),
    readFile(join(process.cwd(), "assets/HostGrotesk-600.ttf")),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#f4f0ea",
        color: "#16120e",
        fontFamily: "Host Grotesk",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -120,
          top: -40,
          width: 760,
          height: 760,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(242,140,40,0.45) 0%, rgba(242,140,40,0.12) 45%, rgba(244,240,234,0) 70%)",
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain img */}
      <img
        src={sunDataUri("#f28c28")}
        width={420}
        height={420}
        alt=""
        style={{ position: "absolute", right: 60, top: 105 }}
      />
      <div style={{ display: "flex", flexDirection: "column", padding: "72px 80px", width: 760 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain img */}
          <img src={sunDataUri("#d06e0e")} width={56} height={56} alt="" />
          <span style={{ fontSize: 40, fontWeight: 600, letterSpacing: -1 }}>Âmbar</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 110,
            fontSize: 96,
            fontWeight: 600,
            lineHeight: 0.98,
            letterSpacing: -4,
          }}
        >
          <span>Sem susto no</span>
          <span>fim do mês.</span>
        </div>
        <div style={{ marginTop: 36, fontSize: 32, color: "#4f473f" }}>
          Um banco que explica, avisa e não julga.
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Host Grotesk", data: regular, style: "normal", weight: 400 },
        { name: "Host Grotesk", data: semibold, style: "normal", weight: 600 },
      ],
    },
  );
}
