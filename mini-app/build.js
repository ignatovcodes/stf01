import { cpSync, mkdirSync } from "node:fs";

const dist = "dist";

mkdirSync(dist, { recursive: true });

const filesToCopy = [
  "index.html",
  "styles.css",
  "app.js",
  "api.js",
];

filesToCopy.forEach((file) => {
  cpSync(file, `${dist}/${file}`);
});

cpSync("components", `${dist}/components`, { recursive: true });

console.log("Build complete → dist/");
