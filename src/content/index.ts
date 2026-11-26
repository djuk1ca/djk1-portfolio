import { PROJECTS } from './projects';
import { WORKS } from './work';

export * from './types';
export { SERVICES } from './services';
export { WORKS } from './work';
export { PROJECTS } from './projects';
export { PROFILE } from './profile';

export const getWork = (slug: string) => WORKS.find((w) => w.slug === slug);
export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);
