import { readFileSync, writeFileSync } from "node:fs";

const [sourcePath, destPath, ...keys] = process.argv.slice(2);

function parseEnv(text) {
  const map = new Map();
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (match) map.set(match[1], match[2]);
  }
  return map;
}

const source = parseEnv(readFileSync(sourcePath, "utf8"));
const destText = readFileSync(destPath, "utf8");
const destLines = destText.split(/\r?\n/);

let changed = 0;
for (const key of keys) {
  if (!source.has(key)) {
    console.log(`skip ${key}: not found in source`);
    continue;
  }
  const value = source.get(key);
  const lineIndex = destLines.findIndex((l) => l.startsWith(`${key}=`));
  const newLine = `${key}=${value}`;
  if (lineIndex >= 0) {
    destLines[lineIndex] = newLine;
  } else {
    destLines.push(newLine);
  }
  changed++;
}

writeFileSync(destPath, destLines.join("\n"));
console.log(`merged ${changed} key(s) from ${sourcePath} into ${destPath}`);
