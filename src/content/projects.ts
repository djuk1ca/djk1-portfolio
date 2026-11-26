import type { Project } from './types';

export const PROJECTS: Project[] = [
  {
    slug: 'language-id',
    name: 'Language ID',
    kicker: 'ML · Sep 2026',
    tone: 'teal',
    summary: {
      en: 'Five-language classifier trained on film subtitles. 99.5% accuracy on held-out films.',
      sr: 'Klasifikator za pet jezika treniran na titlovima filmova. 99,5% tačnosti na filmovima van treninga.',
    },
    status: { en: 'desktop app', sr: 'desktop aplikacija' },
    chips: ['Java', 'Weka', 'PDFBox'],
    metrics: [{ value: '99.5', ghost: '88.8', caption: '% ACCURACY' }],
    link: { kind: 'details', url: null },
    sections: {
      en: [
        {
          heading: 'The model',
          body: [
            'A classifier for Serbian, English, German, French and Spanish, built from 65 film-subtitle files. Encoding is repaired per language and Cyrillic is transliterated, so the model learns the language, not the script.',
            'Five groups of controlled experiments compared word and character n-grams, TF-IDF, vocabulary size and ablations with a linear SVM. Character 1–3-grams won.',
          ],
        },
        {
          heading: 'Evaluation and app',
          body: [
            'Tested on films held out from training to rule out leakage: 99.5 % accuracy, Cohen’s kappa 0.99. A Swing desktop app classifies TXT, DOCX, ODT and PDF files segment by segment and shows its confidence.',
          ],
        },
      ],
      sr: [
        {
          heading: 'Model',
          body: [
            'Klasifikator za srpski, engleski, nemački, francuski i španski, napravljen od 65 fajlova titlova. Kodiranje se popravlja po jeziku, a ćirilica se transliteriše, pa model uči jezik, a ne pismo.',
            'Pet grupa kontrolisanih eksperimenata poredilo je n-grame reči i karaktera, TF-IDF, veličinu rečnika i ablacije sa linearnim SVM-om. Najbolji su bili n-grami karaktera dužine 1–3.',
          ],
        },
        {
          heading: 'Evaluacija i aplikacija',
          body: [
            'Testirano na filmovima izdvojenim iz treninga, da nema curenja podataka: 99,5 % tačnosti, Cohen-ova kapa 0,99. Swing desktop aplikacija klasifikuje TXT, DOCX, ODT i PDF fajlove deo po deo i prikazuje pouzdanost.',
          ],
        },
      ],
    },
  },
  {
    slug: 'connect-4',
    name: 'Connect 4 AI',
    kicker: 'Game AI · May 2026',
    tone: 'red',
    summary: {
      en: 'Minimax with alpha-beta pruning, three search engines and measured pruning benchmarks.',
      sr: 'Minimax sa alfa-beta odsecanjem, tri pretraživača i izmerena ušteda od odsecanja.',
    },
    status: { en: 'playable', sr: 'može da se igra' },
    chips: ['Java', 'JavaFX'],
    metrics: [],
    link: { kind: 'code', url: 'https://github.com/djuk1ca/connect4-minimax-ai' },
    sections: {
      en: [
        {
          heading: 'The opponent',
          body: [
            'A Connect Four game in JavaFX against a computer opponent that searches the game tree with minimax and alpha-beta pruning, guided by a depth-limited heuristic evaluator.',
            'Three search engines are compared side by side, with benchmarks that measure how much pruning saves at each depth.',
          ],
        },
      ],
      sr: [
        {
          heading: 'Protivnik',
          body: [
            'Igra Connect Four u JavaFX-u protiv računara koji pretražuje stablo igre minimax-om sa alfa-beta odsecanjem, uz heurističku procenu ograničene dubine.',
            'Tri pretraživača se porede jedan pored drugog, uz merenja koliko odsecanje štedi na svakoj dubini.',
          ],
        },
      ],
    },
  },
  {
    slug: 'pdf-fast-reading',
    name: 'PDF Fast Reading',
    kicker: 'Full-stack · Feb 2026',
    tone: 'violet',
    summary: {
      en: 'Upload a document and speed-read it. Resume anywhere, on the web or Android.',
      sr: 'Otpremite dokument i čitajte ga brzo. Nastavite gde ste stali, na webu ili Androidu.',
    },
    status: { en: 'live demo', sr: 'demo uživo' },
    chips: ['Spring Boot', 'PostgreSQL', 'React'],
    metrics: [],
    link: { kind: 'demo', url: 'https://pdf-fast-reading.vercel.app' },
    sections: {
      en: [
        {
          heading: 'How it works',
          body: [
            'Upload a PDF and read it one chunk at a time with RSVP (rapid serial visual presentation). Progress is saved, so you can stop on your phone and continue in the browser.',
            'A Spring Boot REST API (Java 21) with PostgreSQL, JWT auth and admin PDF reports serves a React web client and a native Android app.',
          ],
        },
      ],
      sr: [
        {
          heading: 'Kako radi',
          body: [
            'Otpremite PDF i čitajte ga deo po deo uz RSVP (brzi serijski vizuelni prikaz). Napredak se čuva, pa možete da stanete na telefonu i nastavite u browseru.',
            'Spring Boot REST API (Java 21) sa PostgreSQL-om, JWT autentifikacijom i PDF izveštajima za admina opslužuje React web klijent i nativnu Android aplikaciju.',
          ],
        },
      ],
    },
  },
  {
    slug: 'flappy',
    name: 'Flappy, hard mode',
    kicker: 'Browser game · 2023',
    tone: 'green',
    summary: {
      en: 'The gap shrinks at 15 points and the pipes start moving at 30.',
      sr: 'Razmak se smanjuje na 15 poena, a cevi počinju da se pomeraju na 30.',
    },
    status: { en: 'playable', sr: 'može da se igra' },
    chips: ['JavaScript', 'Canvas'],
    metrics: [],
    link: { kind: 'code', url: 'https://github.com/djuk1ca/flappy-bird' },
    sections: {
      en: [
        {
          heading: 'The game',
          body: [
            'A harder take on the flapping-bird genre in plain JavaScript. At 15 points the gap between the pipes gets smaller; at 30 the pipes start moving up and down.',
          ],
        },
      ],
      sr: [
        {
          heading: 'Igra',
          body: [
            'Teža verzija igre sa pticom koja leti između cevi, u čistom JavaScript-u. Na 15 poena razmak između cevi se smanjuje, a na 30 cevi počinju da se pomeraju gore-dole.',
          ],
        },
      ],
    },
  },
];
