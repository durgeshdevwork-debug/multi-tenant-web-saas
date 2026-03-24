import { Edge } from 'edge.js';
import path from 'path';

// Create a singleton Edge instance
export const edge = Edge.create();

// Mount your views directory (templates)
edge.mount(path.join(__dirname, 'templates'));
