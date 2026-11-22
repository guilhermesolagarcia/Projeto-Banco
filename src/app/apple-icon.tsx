import { appIcon } from "./sun-image";

// "Adicionar à Tela de Início" on the iPhone uses this one (180 px), not the manifest's.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return appIcon(size.width);
}
