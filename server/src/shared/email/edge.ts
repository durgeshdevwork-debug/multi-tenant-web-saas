import { Edge } from 'edge.js';
import fs from 'node:fs';
import path from 'path';

// Create a singleton Edge instance
export const edge = Edge.create();

// Mount your views directory (templates)
const templateDirs = [
  path.join(process.cwd(), 'src', 'shared', 'email', 'templates'),
  path.join(__dirname, 'templates')
];

for (const templateDir of templateDirs) {
  if (fs.existsSync(templateDir)) {
    edge.mount(templateDir);
    break;
  }
}
