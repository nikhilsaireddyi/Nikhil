import { Project } from '@/types';

export const projectsData: readonly Project[] = [
  {
    id: 'work-001',
    number: '001',
    title: 'NEURAL DIGIT CLASSIFIER',
    description:
      'Client-side deep learning inference engine with an interactive 28×28 matrix drawing canvas, real-time Softmax probability distribution, and live synaptic weight activation heatmaps computing predictions at 60 FPS.',
    category: 'DEEP LEARNING / VISION',
    technologies: ['PYTHON', 'TENSORS', 'SOFTMAX', 'CANVAS API', 'TYPESCRIPT'],
    year: '2026',
    status: 'online',
    image: '/images/nikhil.jpg',
    featured: true,
    accent: '#00F0FF',
  },
  {
    id: 'work-002',
    number: '002',
    title: 'LOSS TOPOLOGY OPTIMIZER',
    description:
      'Real-time non-convex loss surface simulator comparing AdamW, SGD with Momentum, and learning rate convergence behaviors with interactive parameter sweeps and dynamic trajectory gradient plotting.',
    category: 'MATHEMATICAL SIMULATION',
    technologies: ['ADAMW', 'SGD', 'MOMENTUM', 'CALCULUS', 'REACT 19'],
    year: '2026',
    status: 'online',
    image: '/images/nikhil.jpg',
    featured: true,
    accent: '#FF007F',
  },
  {
    id: 'work-003',
    number: '003',
    title: 'GEOSPATIAL FLEET NODE',
    description:
      'Autonomous orbital satellite network and dual-vehicle kinetic telemetry stream running A* pathfinding heuristics between low-Earth orbit transponders and the Vizag Ground Station node with real-time ping telemetry.',
    category: 'AUTONOMOUS SYSTEMS',
    technologies: ['A* SEARCH', 'PARAMETRIC SPLINES', 'TELEMETRY', 'NEXT.JS 16'],
    year: '2026',
    status: 'online',
    image: '/images/nikhil.jpg',
    featured: true,
    accent: '#C7FF4A',
  },
];
