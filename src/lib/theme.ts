export const THEME_KEY = 'djk-theme';
export const SOUND_KEY = 'djk-sound';
export type Theme = 'kit' | 'grafit';

/** Runs inline in <head> before first paint: applies a stored theme choice, otherwise CSS follows the OS. */
export const themeInitScript = `try{var t=localStorage.getItem(${JSON.stringify(THEME_KEY)});if(t==='kit'||t==='grafit')document.documentElement.dataset.theme=t}catch(e){}`;
