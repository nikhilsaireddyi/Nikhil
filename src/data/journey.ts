import { JourneyItem } from '@/types';

export const journeyMilestones: readonly JourneyItem[] = [
  {
    id: 'journey-01',
    index: '01',
    phase: 'LEARNING',
    title: 'CSE AI/ML Foundations',
    context: 'Nxt Wave of Innovation in Advanced Technology, Vizag',
    description:
      'Immersing in computer science engineering with a focused trajectory in Artificial Intelligence and Machine Learning. Building core understanding of computational algorithms, mathematics, and data structures.',
    focusAreas: ['Algorithms', 'Linear Algebra', 'Python', 'Object-Oriented Architecture'],
    isCurrent: false,
  },
  {
    id: 'journey-02',
    index: '02',
    phase: 'BUILDING',
    title: 'Modern Frontend Architecture',
    context: 'Interactive Web & Reactive Systems',
    description:
      'Mastering modern web foundations: React, TypeScript, and Next.js. Exploring component systems, type safety, and interface design to bridge user intent with programmatic capability.',
    focusAreas: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Web Performance'],
    isCurrent: false,
  },
  {
    id: 'journey-03',
    index: '03',
    phase: 'EXPERIMENTING',
    title: 'Kinetic Motion & Creative Interfaces',
    context: 'Human-Computer Interaction Studio',
    description:
      'Synthesizing code and movement. Implementing custom physics, Lenis smooth-scroll architecture, and Anime.js choreographies to make digital tools responsive and tactile.',
    focusAreas: ['Anime.js', 'Smooth Scroll', 'Creative Development', 'Interaction Design'],
    isCurrent: true,
  },
  {
    id: 'journey-04',
    index: '04',
    phase: 'DEVELOPING',
    title: '[ADD LEARNING MILESTONE]',
    context: 'Upcoming Neural & Applied AI Integration',
    description:
      'A reserved progression node dedicated to upcoming intelligent system developments, agent workflows, and AI-driven interactive products currently under active research.',
    focusAreas: ['Model Integration', 'Neural Experiments', 'Agentic Logic', 'Production Systems'],
    isCurrent: false,
  },
];
