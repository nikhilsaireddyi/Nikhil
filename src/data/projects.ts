import { Project } from '@/types';

export const projectsData: readonly Project[] = [
  {
    id: 'work-001',
    number: '001',
    title: 'GANESH: THE QUEST',
    description:
      'A cinematic 2D/2.5D Indian festival adventure game celebrating Ganesh Chaturthi. Features custom HTML5 Canvas physics, multi-layer parallax street environments, interactive NPC festival errands, procedural web audio synthesizer with temple bells and dhol beats, and an in-game scrapbook photo system.',
    category: 'GAME ENGINE & WEB APP',
    technologies: ['HTML5 CANVAS', 'VITE', 'TYPESCRIPT', 'WEB AUDIO API', 'PARALLAX 2.5D'],
    year: '2026',
    status: 'online',
    image: '/images/ganesh-quest.jpg',
    href: 'https://ganesh-the-quest-game.vercel.app/',
    featured: true,
    accent: '#FF8F00',
  },
];
