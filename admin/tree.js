import fs from "fs";
import path from "path";

// 🔧 CONFIG
const IGNORE_LIST = [
  "node_modules",
  "build",
  "dist",
  ".git",
  ".next",
  ".turbo",
  ".cache"
];

const IGNORE_EXTENSIONS = [
  ".log",
  ".lock"
];

function shouldIgnore(name) {
  if (IGNORE_LIST.includes(name)) return true;
  return IGNORE_EXTENSIONS.some(ext => name.endsWith(ext));
}

function generateTree(dir, prefix = "") {
  let tree = "";

  const files = fs.readdirSync(dir);

  files.forEach((file, index) => {
    if (shouldIgnore(file)) return;

    const fullPath = path.join(dir, file);
    const isLast = index === files.length - 1;

    const connector = isLast ? "└── " : "├── ";
    tree += `${prefix}${connector}${file}\n`;

    if (fs.statSync(fullPath).isDirectory()) {
      const newPrefix = prefix + (isLast ? "    " : "│   ");
      tree += generateTree(fullPath, newPrefix);
    }
  });

  return tree;
}

function main() {
  const targetDir = process.argv[2] || process.cwd();
  console.log(`📁 File Tree for: ${targetDir}\n`);
  console.log(generateTree(targetDir));
}

main();