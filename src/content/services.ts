import type { Service } from './types';

export const SERVICES: Service[] = [
  {
    slug: 'websites',
    letter: 'W',
    title: { en: 'Websites', sr: 'Sajtovi' },
    summary: {
      en: 'Fast company and portfolio sites in English and Serbian, built to show up on Google.',
      sr: 'Brzi sajtovi za firme i portfolije, na srpskom i engleskom, napravljeni da se vide na Google-u.',
    },
    gets: {
      en: [
        'A site that loads fast on phones and scores high in Lighthouse',
        'Pages in English and Serbian with proper search setup (titles, sitemap, hreflang)',
        'A contact form that reaches you, with spam protection',
        'Hosting and a domain set up for you, with automatic deploys',
      ],
      sr: [
        'Sajt koji se brzo učitava na telefonu i ima visoku ocenu u Lighthouse-u',
        'Strane na srpskom i engleskom sa pravilnim podešavanjem za pretragu (naslovi, sitemap, hreflang)',
        'Kontakt formu koja stvarno stiže do vas, sa zaštitom od spama',
        'Podešen hosting i domen, sa automatskim objavljivanjem izmena',
      ],
    },
    chips: ['Next.js', 'React'],
    proof: [
      { kind: 'work', slug: 'md-mont' },
      { kind: 'work', slug: 'kaneko' },
      { kind: 'work', slug: 'simplice' },
    ],
  },
  {
    slug: 'web-apps',
    letter: 'A',
    title: { en: 'Web apps', sr: 'Web aplikacije' },
    summary: {
      en: 'Dashboards, booking and marketplace platforms with accounts, search and admin panels.',
      sr: 'Dashboard-i, platforme za zakazivanje i marketplace-i sa nalozima, pretragom i admin panelom.',
    },
    gets: {
      en: [
        'Sign-in with email, Google, Apple or Facebook',
        'An admin panel your team can use without a developer',
        'Search that understands typos and both Serbian scripts',
        'Real-time chat and notifications where you need them',
      ],
      sr: [
        'Prijavu preko emaila, Google, Apple ili Facebook naloga',
        'Admin panel koji vaš tim koristi bez developera',
        'Pretragu koja razume greške u kucanju i oba pisma',
        'Chat i obaveštenja u realnom vremenu gde su potrebni',
      ],
    },
    chips: ['Blazor', 'React'],
    proof: [
      { kind: 'work', slug: 'usluzionica' },
      { kind: 'work', slug: 'broker-auditor' },
      { kind: 'projects', slug: 'pdf-fast-reading' },
    ],
  },
  {
    slug: 'mobile-apps',
    letter: 'M',
    title: { en: 'Mobile apps', sr: 'Mobilne aplikacije' },
    summary: {
      en: 'Android and iOS apps, published to Google Play and the App Store.',
      sr: 'Android i iOS aplikacije, objavljene na Google Play i App Store.',
    },
    gets: {
      en: [
        'One codebase for Android and iOS',
        'Push notifications and social sign-in',
        'Store listings, closed testing and release handled for you',
      ],
      sr: [
        'Jedan kod za Android i iOS',
        'Push obaveštenja i prijavu preko društvenih mreža',
        'Objavu u prodavnicama, zatvoreno testiranje i izdavanje verzija',
      ],
    },
    chips: ['.NET MAUI', 'Android'],
    proof: [
      { kind: 'work', slug: 'usluzionica' },
      { kind: 'projects', slug: 'pdf-fast-reading' },
    ],
  },
  {
    slug: 'backends',
    letter: 'B',
    title: { en: 'Backends & APIs', sr: 'Backend i API' },
    summary: {
      en: 'Tested, containerised APIs with CI/CD and automatic deploys.',
      sr: 'Testirani API-ji u kontejnerima, sa CI/CD-jem i automatskim objavljivanjem.',
    },
    gets: {
      en: [
        'A REST API with authentication, roles and refresh tokens',
        'Automated tests against real databases on every change',
        'A pipeline that blocks broken code and deploys the rest',
        'Docker setup you can run on any server',
      ],
      sr: [
        'REST API sa autentifikacijom, ulogama i refresh tokenima',
        'Automatske testove nad pravim bazama pri svakoj izmeni',
        'Pipeline koji zaustavlja pokvaren kod, a ostalo objavljuje',
        'Docker postavku koja radi na bilo kom serveru',
      ],
    },
    chips: ['ASP.NET Core', 'Spring Boot'],
    proof: [
      { kind: 'work', slug: 'usluzionica' },
      { kind: 'work', slug: 'kaneko' },
      { kind: 'projects', slug: 'pdf-fast-reading' },
    ],
  },
  {
    slug: 'ai',
    letter: 'E',
    title: { en: 'AI & embeddings', sr: 'AI i embeddinzi' },
    summary: {
      en: 'Search and chat over your own documents, classifiers and AI features in existing apps.',
      sr: 'Pretraga i chat nad vašim dokumentima, klasifikatori i AI funkcije u postojećim aplikacijama.',
    },
    gets: {
      en: [
        'Semantic search that finds results by meaning, not only keywords',
        'Classifiers trained and evaluated on your own data',
        'AI features added to an app you already have',
      ],
      sr: [
        'Semantičku pretragu koja nalazi rezultate po značenju, ne samo po rečima',
        'Klasifikatore trenirane i proverene na vašim podacima',
        'AI funkcije dodate u aplikaciju koju već imate',
      ],
    },
    chips: ['Embeddings', 'ML'],
    proof: [
      { kind: 'projects', slug: 'language-id' },
      { kind: 'work', slug: 'usluzionica' },
    ],
  },
];
