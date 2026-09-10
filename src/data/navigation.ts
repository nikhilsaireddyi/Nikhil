import { NavigationItem } from '@/types';

export const navigationItems: readonly NavigationItem[] = [
  {
    id: 'nav-about',
    label: 'ABOUT',
    href: '#about',
    sectionId: 'about',
    number: '01',
  },
  {
    id: 'nav-toolkit',
    label: 'TOOLKIT',
    href: '#toolkit',
    sectionId: 'toolkit',
    number: '02',
  },
  {
    id: 'nav-journey',
    label: 'JOURNEY',
    href: '#journey',
    sectionId: 'journey',
    number: '03',
  },
  {
    id: 'nav-projects',
    label: 'PROJECTS',
    href: '#projects',
    sectionId: 'projects',
    number: '04',
  },
  {
    id: 'nav-lab',
    label: 'LAB',
    href: '#lab',
    sectionId: 'lab',
    number: '05',
  },
  {
    id: 'nav-contact',
    label: 'CONTACT',
    href: '#contact',
    sectionId: 'contact',
    number: '06',
  },
];
