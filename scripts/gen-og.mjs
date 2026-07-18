/**
 * Genera la og-image estática (1200x630) para las previsualizaciones de link
 * (WhatsApp, Twitter, etc.). Estética lima/negro de la app.
 *
 * Requiere @napi-rs/canvas (binario prearmado, sin compilación nativa):
 *
 *   npm i -D @napi-rs/canvas
 *   node scripts/gen-og.mjs            # escribe public/og-image.png
 *   node scripts/gen-og.mjs <ruta>     # o a una ruta absoluta
 *
 * Usa fuentes del sistema (Impact / Arial Black), que son el mismo registro
 * "display condensado" del stack de la app; si no están, cae en la default.
 */
import { createCanvas, GlobalFonts } from "@napi-rs/canvas";
import { writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const W = 1200;
const H = 630;

// Paleta de la app
const LIMA = "#C8D62B";
const NEGRO = "#121210";
const CREMA = "#F5F1E0";
const OK = "#46AB4F";
const GO = "#F3C51D";
const NO = "#E14B3B";

// Fuentes del sistema (Windows). Registramos si existen.
const FONTS = [
  ["C:/Windows/Fonts/impact.ttf", "PosterDisplay"],
  ["C:/Windows/Fonts/ariblk.ttf", "PosterHeavy"],
  ["C:/Windows/Fonts/arialbd.ttf", "PosterBold"],
];
for (const [path, family] of FONTS) {
  if (existsSync(path)) GlobalFonts.registerFromPath(path, family);
}
const DISPLAY = GlobalFonts.has("PosterDisplay") ? "PosterDisplay" : "sans-serif";
const HEAVY = GlobalFonts.has("PosterHeavy") ? "PosterHeavy" : "sans-serif";
const BOLD = GlobalFonts.has("PosterBold") ? "PosterBold" : "sans-serif";

const canvas = createCanvas(W, H);
const ctx = canvas.getContext("2d");

// Fondo lima
ctx.fillStyle = LIMA;
ctx.fillRect(0, 0, W, H);

// Marco negro interior (guiño al borde grueso de las tarjetas)
ctx.strokeStyle = NEGRO;
ctx.lineWidth = 10;
ctx.strokeRect(28, 28, W - 56, H - 56);

const MX = 76; // margen izquierdo del contenido

// Eyebrow
ctx.fillStyle = NEGRO;
ctx.font = `28px ${HEAVY}`;
ctx.textBaseline = "alphabetic";
ctx.save();
ctx.translate(MX, 110);
letterSpaced(ctx, "UBA · FACULTAD DE CIENCIAS SOCIALES", 6);
ctx.restore();

// Título grande (Impact), negro sobre lima
ctx.fillStyle = NEGRO;
ctx.font = `122px ${DISPLAY}`;
ctx.fillText("MAPA DE", MX, 244);
ctx.fillText("CORRELATIVIDADES", MX, 362);

// Tagline
ctx.font = `32px ${BOLD}`;
ctx.fillStyle = "#1c1d10";
ctx.fillText("Marcá lo que aprobaste y mirá qué podés cursar.", MX, 418);

// Las cinco carreras (dot-separated, mismo registro del eyebrow)
ctx.font = `26px ${BOLD}`;
ctx.fillStyle = NEGRO;
ctx.fillText(
  "Ciencia Política · Sociología · Comunicación · Relaciones del Trabajo · Trabajo Social",
  MX,
  462,
);

// Chips de leyenda (ok / go / no), como la UI
const chips = [
  [OK, "Aprobada"],
  [GO, "Podés cursarla"],
  [NO, "Bloqueada"],
];
let cx = MX;
const cy = 512;
ctx.font = `24px ${BOLD}`;
for (const [color, label] of chips) {
  const padX = 20;
  const textW = ctx.measureText(label).width;
  const dotW = 18 + 12;
  const chipW = padX * 2 + dotW + textW;
  // fondo negro del chip
  roundRect(ctx, cx, cy, chipW, 48, 24);
  ctx.fillStyle = NEGRO;
  ctx.fill();
  // dot de color
  ctx.beginPath();
  ctx.arc(cx + padX + 9, cy + 24, 9, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  // label
  ctx.fillStyle = CREMA;
  ctx.textBaseline = "middle";
  ctx.fillText(label, cx + padX + dotW, cy + 25);
  ctx.textBaseline = "alphabetic";
  cx += chipW + 16;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function letterSpaced(ctx, text, spacing) {
  let x = 0;
  for (const ch of text) {
    ctx.fillText(ch, x, 0);
    x += ctx.measureText(ch).width + spacing;
  }
}

const outArg = process.argv[2];
const out = outArg
  ? outArg
  : fileURLToPath(new URL("../public/og-image.png", import.meta.url));
writeFileSync(out, canvas.toBuffer("image/png"));
console.log("og-image escrita en:", out);
