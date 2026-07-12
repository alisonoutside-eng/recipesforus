import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const outDir = fileURLToPath(new URL("../public/icons/", import.meta.url));
mkdirSync(outDir, { recursive: true });

const bg = "#c2410c"; // warm orange

function svg({ size, iconScale }) {
  const iconSize = size * iconScale;
  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${bg}" />
      <text x="50%" y="50%" font-size="${iconSize}" text-anchor="middle"
        dominant-baseline="central" font-family="Segoe UI Emoji, Apple Color Emoji, sans-serif">🍲</text>
    </svg>
  `;
}

async function make(name, size, iconScale) {
  await sharp(Buffer.from(svg({ size, iconScale })))
    .png()
    .toFile(join(outDir, name));
  console.log(`wrote ${name} (${size}x${size})`);
}

await make("icon-192.png", 192, 0.6);
await make("icon-512.png", 512, 0.6);
await make("icon-512-maskable.png", 512, 0.45); // smaller icon, safe zone for maskable
await make("apple-touch-icon.png", 180, 0.6);
