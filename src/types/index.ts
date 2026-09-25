export type SectionId =
  | 'hero'
  | 'manifesto'
  | 'about'
  | 'toolkit'
  | 'journey'
  | 'projects'
  | 'lab'
  | 'contact';

export interface NavigationItem {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly sectionId: SectionId;
  readonly number: string;
}

export type SocialPlatform = 'github' | 'instagram' | 'linkedin' | 'email';

export interface SocialLink {
  readonly platform: SocialPlatform;
  readonly label: string;
  readonly url: string;
  readonly displayHandle: string;
  readonly index: string;
}

export type SkillCategoryType = 'frontend' | 'motion' | 'focus';

export interface Skill {
  readonly name: string;
  readonly tag: string;
  readonly description: string;
  readonly category: SkillCategoryType;
  readonly metadata: string;
  readonly highlighted?: boolean;
}

export interface SkillCategory {
  readonly id: SkillCategoryType;
  readonly label: string;
  readonly number: string;
  readonly description: string;
  readonly items: readonly Skill[];
}

export type JourneyPhase =
  | 'LEARNING'
  | 'BUILDING'
  | 'EXPERIMENTING'
  | 'DEVELOPING';

export interface JourneyItem {
  readonly id: string;
  readonly index: string;
  readonly phase: JourneyPhase;
  readonly title: string;
  readonly context: string;
  readonly description: string;
  readonly focusAreas: readonly string[];
  readonly isCurrent: boolean;
}

export type ProjectStatus = 'pending' | 'reserved' | 'exploring' | 'deployed' | 'active' | 'online';

export interface Project {
  readonly id: string;
  readonly number: string;
  readonly title: string;
  readonly description: string;
  readonly category: string;
  readonly technologies: readonly string[];
  readonly year: string;
  readonly status: ProjectStatus;
  readonly image: string;
  readonly href?: string;
  readonly featured: boolean;
  readonly accent: string;
}

export type CursorState = 'default' | 'link' | 'project' | 'image' | 'hidden';

export interface CursorContextValue {
  cursorState: CursorState;
  cursorText: string;
  setCursorState: (state: CursorState, text?: string) => void;
  resetCursor: () => void;
}

export interface AnimationConfig {
  readonly duration: number;
  readonly delay?: number;
  readonly easing: string;
}

export interface SiteConfig {
  readonly name: string;
  readonly role: string;
  readonly specialization: string;
  readonly location: string;
  readonly education: {
    readonly institution: string;
    readonly department: string;
    readonly location: string;
  };
  readonly statusIndicator: string;
  readonly tagline: string;
  readonly manifesto: string;
  readonly aboutStatement: string;
}
