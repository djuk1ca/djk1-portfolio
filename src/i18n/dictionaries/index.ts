import type { Locale } from '../locales';
import { en, type Dictionary } from './en';
import { sr } from './sr';

export type { Dictionary };

const DICTIONARIES: Record<Locale, Dictionary> = { en, sr };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}
