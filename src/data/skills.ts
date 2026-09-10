import { SkillCategory } from '@/types';

export const skillCategories: readonly SkillCategory[] = [
  {
    id: 'frontend',
    label: 'FRONTEND',
    number: '01',
    description: 'Component architecture, reactive primitives, and type-safe user interfaces.',
    items: [
      {
        name: 'Next.js',
        tag: 'FRAMEWORK',
        description: 'App Router architecture, server components, and optimized production bundling.',
        category: 'frontend',
        metadata: 'REACT / SSR / ROUTING',
        highlighted: true,
      },
      {
        name: 'React',
        tag: 'CORE UI',
        description: 'Declarative component lifecycle, state composition, and modular interface patterns.',
        category: 'frontend',
        metadata: 'CONCURRENT / HOOKS',
      },
      {
        name: 'TypeScript',
        tag: 'STATIC TYPING',
        description: 'Strict type contracts, discriminated unions, and reliable refactoring guarantees.',
        category: 'frontend',
        metadata: 'STRICT / GENERICS',
        highlighted: true,
      },
      {
        name: 'Tailwind CSS',
        tag: 'DESIGN ENGINE',
        description: 'Utility-first styling systems, custom tokens, and architectural layouts.',
        category: 'frontend',
        metadata: 'UTILITY / TOKENS',
      },
    ],
  },
  {
    id: 'motion',
    label: 'MOTION & INTERACTION',
    number: '02',
    description: 'Calculated choreographies, fluid physics, and continuous kinetic feedback.',
    items: [
      {
        name: 'Anime.js',
        tag: 'KINETIC ENGINE',
        description: 'Complex SVG timeline sequences, property interpolation, and staggered reveals.',
        category: 'motion',
        metadata: 'TIMELINES / EASING',
        highlighted: true,
      },
      {
        name: 'Lenis',
        tag: 'SCROLL ENGINE',
        description: 'Normalized scroll delta, inertia physics, and decoupled animation frame subscribers.',
        category: 'motion',
        metadata: 'SMOOTH / NORMALIZED',
      },
    ],
  },
  {
    id: 'focus',
    label: 'CORE FOCUS',
    number: '03',
    description: 'Computational intelligence, neural concepts, and human-computer symbiosis.',
    items: [
      {
        name: 'Artificial Intelligence',
        tag: 'FOUNDATIONS',
        description: 'Mathematical foundations, generative systems, and agentic workflows.',
        category: 'focus',
        metadata: 'THEORY & MODELS',
        highlighted: true,
      },
      {
        name: 'Machine Learning',
        tag: 'SYSTEMS',
        description: 'Supervised learning concepts, evaluation dynamics, and algorithm exploration.',
        category: 'focus',
        metadata: 'TRAINING & INFERENCE',
      },
      {
        name: 'Frontend Development',
        tag: 'EXPERIENCE',
        description: 'Crafting expressive digital workspaces for intelligent computational models.',
        category: 'focus',
        metadata: 'INTERACTION & CRAFT',
      },
    ],
  },
];
