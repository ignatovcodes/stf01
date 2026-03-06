import { cpSync, mkdirSync } from "node:fs";

const dist = "dist";

mkdirSync(dist, { recursive: true });

const filesToCopy = [
  "index.html",
  "styles.css",
  "app.js",
  "api.js",
  "server.js",
  "package.json",
];

try { cpSync("logo.png", `${dist}/logo.png`); } catch (_) {}
try { cpSync("images", `${dist}/images`, { recursive: true }); } catch (_) {}

filesToCopy.forEach((file) => {
  cpSync(file, `${dist}/${file}`);
});

cpSync("components", `${dist}/components`, { recursive: true });
try { cpSync("lib", `${dist}/lib`, { recursive: true }); } catch (_) {}

console.log("Build complete → dist/");
