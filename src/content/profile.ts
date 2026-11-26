import type { Localized, Metric } from './types';

export const PROFILE = {
  name: 'Đurađ Manojlović',
  email: 'djuradj.manojlovic04@gmail.com',
  github: 'https://github.com/djuk1ca',
  linkedin: 'https://linkedin.com/in/djuradj-manojlovic',
  city: { en: 'Novi Sad, Serbia', sr: 'Novi Sad, Srbija' } as Localized<string>,
  cv: '/cv/Djuradj-Manojlovic-CV.pdf',
  gpa: { value: '9.36', ghost: '8.88', caption: 'GPA · 185 ECTS' } as Metric,
  education: {
    en: 'Faculty of Sciences, University of Novi Sad · Information Technology, 2023–2027',
    sr: 'Prirodno-matematički fakultet, Univerzitet u Novom Sadu · Informacione tehnologije, 2023–2027',
  } as Localized<string>,
  training: {
    en: 'CyberSecPro Cybersecurity Winter School · Portugal, Jan 2026',
    sr: 'CyberSecPro zimska škola sajber bezbednosti · Portugal, jan 2026',
  } as Localized<string>,
  remote: {
    en: 'Broker Auditor · 7 months in a distributed US team',
    sr: 'Broker Auditor · 7 meseci u američkom timu na daljinu',
  } as Localized<string>,
  languages: {
    en: 'Serbian (native) · English (professional)',
    sr: 'srpski (maternji) · engleski (profesionalno)',
  } as Localized<string>,
};
