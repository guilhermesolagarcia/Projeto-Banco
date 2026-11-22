import { appIcon } from "../../sun-image";

/*
 * The manifest's icons, at fixed URLs (/app-icon/192, /app-icon/512). A route instead of
 * app/icon.tsx: that name is taken by the favicon (icon.svg), and generated icon URLs carry a hash.
 */
const SIZES = ["192", "512"];

export function generateStaticParams() {
  return SIZES.map((size) => ({ size }));
}

export async function GET(_request: Request, { params }: RouteContext<"/app-icon/[size]">) {
  const { size } = await params;
  if (!SIZES.includes(size)) return new Response(null, { status: 404 });
  return appIcon(Number(size));
}
