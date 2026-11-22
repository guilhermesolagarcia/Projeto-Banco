import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { sunDataUri } from "./sun-image";

export const alt = "Âmbar: sem susto no fim do mês. Um banco que explica, avisa e não julga.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
