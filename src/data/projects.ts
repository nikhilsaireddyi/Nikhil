import { Project } from '@/types';

export const projectsData: readonly Project[] = [
  {
    id: 'work-001',
    number: '001',
    title: 'PROJECT DETAILS PENDING',
    description:
      'A SPACE RESERVED FOR THE NEXT BUILD. Currently incubating an experimental system at the intersection of machine learning inference and reactive interface design.',
    category: 'INTELLIGENT SYSTEM',
    technologies: ['NEXT.JS', 'TYPESCRIPT', 'AI/ML', 'TAILWIND CSS'],
    year: '2026',
    status: 'pending',
    image: '/images/nikhil.jpg',
    featured: true,
    accent: '#C7FF4A',
  },
  {
    id: 'work-002',
    number: '002',
    title: 'COMPUTATIONAL EXPLORATION',
    description:
      'RESERVED FOR NEXT REVISION. Dedicated slot for an interactive web experience utilizing mathematical simulation and real-time kinetic physics.',
    category: 'EXPERIMENTAL INTERFACE',
    technologies: ['REACT', 'ANIME.JS', 'LENIS', 'CANVAS'],
    year: '2026',
    status: 'reserved',
    image: '/images/nikhil.jpg',
    featured: false,
    accent: '#F2F0EA',
  },
  {
    id: 'work-003',
    number: '003',
    title: 'NEURAL INTERACTION MODEL',
    description:
      'RESERVED FOR FUTURE WORK. Architectural canvas prepared for forthcoming deep learning integrations and exploratory cognitive interface research.',
    category: 'AI RESEARCH / FRONTEND',
    technologies: ['PYTHON', 'MACHINE LEARNING', 'API ARCHITECTURE'],
    year: '2026',
    status: 'exploring',
    image: '/images/nikhil.jpg',
    featured: false,
    accent: '#8E8E8E',
  },
];
