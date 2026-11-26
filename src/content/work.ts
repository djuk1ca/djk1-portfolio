import type { Work } from './types';

export const WORKS: Work[] = [
  {
    slug: 'usluzionica',
    name: 'Uslužionica',
    domain: 'usluzionica.rs',
    url: 'https://usluzionica.rs',
    featured: true,
    period: { en: 'Apr 2026 – present', sr: 'apr 2026 – danas' },
    role: { en: 'Founder & developer', sr: 'Osnivač i developer' },
    kind: { en: 'Services marketplace · Android, iOS, web', sr: 'Platforma za usluge · Android, iOS, web' },
    summary: {
      en: 'A local services marketplace live on Google Play, the App Store and the web, with a fully tested backend that deploys on every merge.',
      sr: 'Platforma za lokalne usluge koja radi na Google Play-u, App Store-u i webu, sa potpuno testiranim backendom koji se objavljuje pri svakom merge-u.',
    },
    stack: ['C#', 'ASP.NET Core 8', '.NET MAUI', 'Blazor', 'SQL Server', 'Redis', 'SignalR', 'Docker'],
    metrics: [
      { value: '134', ghost: '888', caption: 'REST ENDPOINTS' },
      { value: '574', ghost: '888', caption: 'AUTOMATED TESTS' },
      { value: '86.9', ghost: '88.8', caption: '% LINE COVERAGE' },
      { value: '3', ghost: '8', caption: 'PLATFORMS' },
    ],
    screenshot: null,
    sections: {
      en: [
        {
          heading: 'What it is',
          body: [
            'Uslužionica connects people who need a service with local providers. Providers present their work, users book and chat with them directly, and both sides earn tokens for completed services.',
            'It runs as a .NET MAUI app on Android and iOS and as a Blazor web app at usluzionica.rs.',
          ],
        },
        {
          heading: 'The backend',
          body: [
            'An ASP.NET Core 8 API with 134 REST endpoints across 22 controllers, 32 EF Core entities, JWT auth with refresh tokens and two SignalR hubs for chat and notifications.',
            'Search is built for Serbian: it tolerates missing diacritics, Cyrillic and typos, and tries the cheapest match first so common queries never pay for fuzzy matching.',
          ],
        },
        {
          heading: 'How it ships',
          body: [
            '574 automated tests (86.9 % line coverage) run against real SQL Server and Redis instances started per run with Testcontainers.',
            'GitHub Actions blocks a merge on warnings, analyzer errors, failing tests, coverage under 75 % or a CodeQL finding. Every merge to main builds a Docker image, deploys it to a Docker Compose stack on Hetzner and runs health checks.',
          ],
        },
      ],
      sr: [
        {
          heading: 'Šta je to',
          body: [
            'Uslužionica povezuje ljude kojima treba usluga sa lokalnim uslugodavcima. Uslugodavci predstavljaju svoj rad, korisnici zakazuju i dopisuju se direktno sa njima, a obe strane dobijaju tokene za završene usluge.',
            'Radi kao .NET MAUI aplikacija na Androidu i iOS-u i kao Blazor web aplikacija na usluzionica.rs.',
          ],
        },
        {
          heading: 'Backend',
          body: [
            'ASP.NET Core 8 API sa 134 REST endpointa u 22 kontrolera, 32 EF Core entiteta, JWT autentifikacijom sa refresh tokenima i dva SignalR huba za chat i obaveštenja.',
            'Pretraga je napravljena za srpski: radi i bez kvačica, na ćirilici i sa greškama u kucanju, a prvo proba najjeftinije poklapanje, pa česte pretrage nikad ne plaćaju fuzzy pretragu.',
          ],
        },
        {
          heading: 'Kako se objavljuje',
          body: [
            '574 automatska testa (86,9 % pokrivenosti linija) rade nad pravim SQL Server i Redis instancama koje Testcontainers podiže za svako pokretanje.',
            'GitHub Actions blokira merge ako ima upozorenja, grešaka analizatora, palih testova, pokrivenosti ispod 75 % ili CodeQL nalaza. Svaki merge u main pravi Docker image, objavljuje ga na Docker Compose stack na Hetzneru i proverava da li sve radi.',
          ],
        },
      ],
    },
  },
  {
    // TODO(Đurađ): confirm wording with the client (CV: frontend features, 15+ screens).
    slug: 'broker-auditor',
    name: 'Broker Auditor',
    domain: 'brokerauditor.com',
    url: 'https://brokerauditor.com',
    featured: false,
    period: { en: 'Oct 2024 – Apr 2025', sr: 'okt 2024 – apr 2025' },
    role: { en: 'Frontend developer, remote team', sr: 'Frontend developer, tim na daljinu' },
    kind: { en: 'US freight reviews · React, Tailwind', sr: 'Recenzije u US transportu · React, Tailwind' },
    summary: {
      en: 'Production frontend features for a US freight platform where carriers review freight brokers.',
      sr: 'Frontend funkcije za američku platformu na kojoj prevoznici ocenjuju brokere tereta.',
    },
    stack: ['JavaScript', 'React', 'Tailwind CSS'],
    metrics: [],
    screenshot: null,
    sections: {
      en: [
        {
          heading: 'The project',
          body: [
            'Broker Auditor is a reputation platform for the US freight industry: carriers leave reviews of the brokers they haul for, so other carriers know who pays on time.',
          ],
        },
        {
          heading: 'My part',
          body: [
            'For seven months I worked remotely in a distributed team across time zones and implemented more than 15 screens in React and Tailwind CSS.',
            'Requirements changed often; my job was to turn them into working UI quickly and keep it consistent with the rest of the product.',
          ],
        },
      ],
      sr: [
        {
          heading: 'Projekat',
          body: [
            'Broker Auditor je platforma za reputaciju u američkom transportu: prevoznici ostavljaju recenzije brokera za koje voze, da bi drugi prevoznici znali ko plaća na vreme.',
          ],
        },
        {
          heading: 'Moj deo',
          body: [
            'Sedam meseci sam radio na daljinu u timu raspoređenom po vremenskim zonama i napravio više od 15 ekrana u React-u i Tailwind CSS-u.',
            'Zahtevi su se često menjali; moj posao je bio da ih brzo pretvorim u UI koji radi i da ostane usklađen sa ostatkom proizvoda.',
          ],
        },
      ],
    },
  },
  {
    // TODO(Đurađ): confirm the gallery and dimension-based quote form match what shipped.
    slug: 'md-mont',
    name: 'M&D Mont',
    domain: 'mdmont.rs',
    url: 'https://mdmont.rs',
    featured: false,
    period: { en: '2026', sr: '2026' },
    role: { en: 'Design & development', sr: 'Dizajn i izrada' },
    kind: { en: 'Steel structures & roof panels · React', sr: 'Čelične konstrukcije i paneli · React' },
    summary: {
      en: 'A company site for a steel-structure and roof-panel installer, prerendered for search and built to bring in project inquiries.',
      sr: 'Sajt za firmu koja montira čelične konstrukcije i krovne panele, prerenderovan za pretragu i napravljen da donosi upite.',
    },
    stack: ['React', 'Vite', 'Three.js', 'Tailwind CSS'],
    metrics: [],
    screenshot: null,
    sections: {
      en: [
        {
          heading: 'The client',
          body: [
            'M&D Mont builds and installs steel structures, purlins and bracing, and roof and wall panels, from the site visit to transport and assembly.',
          ],
        },
        {
          heading: 'What I built',
          body: [
            'A brand system and a fast React site with service pages, a project gallery and a contact form that asks for dimensions so the client can send a quote right away.',
            'Pages are prerendered at build time with their own titles and descriptions, so search engines see real content.',
          ],
        },
      ],
      sr: [
        {
          heading: 'Klijent',
          body: [
            'M&D Mont pravi i montira čelične konstrukcije, rožnjače i spregove, krovne i zidne panele, od obilaska terena do transporta i montaže.',
          ],
        },
        {
          heading: 'Šta sam napravio',
          body: [
            'Brend sistem i brz React sajt sa stranama usluga, galerijom projekata i kontakt formom koja traži dimenzije, da klijent odmah može da pošalje ponudu.',
            'Strane se prerenderuju pri build-u sa sopstvenim naslovima i opisima, pa pretraživači vide pravi sadržaj.',
          ],
        },
      ],
    },
  },
  {
    slug: 'kaneko',
    name: 'Kaneko Seeds Eastern Europe',
    domain: 'kaneko-eeu.com',
    url: 'https://kaneko-eeu.com',
    featured: false,
    period: { en: '2026', sr: '2026' },
    role: { en: 'Design system, site & API', sr: 'Dizajn sistem, sajt i API' },
    kind: { en: 'B2B seed catalogue · distributor finder', sr: 'B2B katalog semena · pronalazač distributera' },
    summary: {
      en: 'The site of the Hungary-based B2B arm of a Japanese seed breeder: find varieties fast and reach the right distributor in your country.',
      sr: 'Sajt mađarske B2B kompanije japanskog proizvođača semena: brzo pronađite sortu i pravog distributera u svojoj zemlji.',
    },
    stack: ['Next.js', 'React', 'ASP.NET Core', 'Playwright'],
    metrics: [],
    screenshot: null,
    sections: {
      en: [
        {
          heading: 'The client',
          body: [
            'Kaneko Seeds Eastern Europe ships vegetable seed to one exclusive distributor per country. There is no shop and no prices; the site has two jobs: help growers find varieties and send them to the right distributor.',
          ],
        },
        {
          heading: 'What I built',
          body: [
            'A design system with Japanese restraint, a Next.js site for the cabbage and pepper ranges, news, careers and distributors, and an admin panel so the team edits content without a developer.',
            'Content comes from a .NET API, with a static fallback, and changes saved in the admin reach the public pages within seconds.',
          ],
        },
      ],
      sr: [
        {
          heading: 'Klijent',
          body: [
            'Kaneko Seeds Eastern Europe isporučuje seme povrća jednom ekskluzivnom distributeru po zemlji. Nema prodavnice ni cena; sajt ima dva zadatka: da pomogne proizvođačima da pronađu sortu i da ih pošalje pravom distributeru.',
          ],
        },
        {
          heading: 'Šta sam napravio',
          body: [
            'Dizajn sistem sa japanskom umerenošću, Next.js sajt za asortiman kupusa i paprike, vesti, karijere i distributere, i admin panel u kome tim menja sadržaj bez developera.',
            'Sadržaj dolazi iz .NET API-ja, uz statičku rezervu, a izmene sačuvane u adminu stižu na javne strane za nekoliko sekundi.',
          ],
        },
      ],
    },
  },
  {
    // TODO(Đurađ): confirm the site pages and the content work listed here.
    slug: 'simplice',
    name: 'Simplice Beauty Lounge',
    domain: 'simplicebeautylounge.com',
    url: 'https://simplicebeautylounge.com',
    featured: false,
    period: { en: '2023 – present', sr: '2023 – danas' },
    role: { en: 'Website, social media & content', sr: 'Sajt, društvene mreže i sadržaj' },
    kind: { en: 'Beauty salon, UAE · site + content', sr: 'Salon lepote, UAE · sajt + sadržaj' },
    summary: {
      en: 'The website of a beauty salon in the UAE, plus three years of running its social media and campaigns.',
      sr: 'Sajt salona lepote u Ujedinjenim Arapskim Emiratima i tri godine vođenja njegovih društvenih mreža i kampanja.',
    },
    stack: ['React', 'Vite', 'Tailwind CSS'],
    metrics: [],
    screenshot: null,
    sections: {
      en: [
        {
          heading: 'The client',
          body: ['Simplice Beauty Lounge is a beauty salon in the UAE. I have worked with them remotely since 2023, in English, every day.'],
        },
        {
          heading: 'What I do',
          body: [
            'I built the salon’s website with service, about and contact pages, and I run their content: posts, reels, campaigns, price lists and print materials.',
          ],
        },
      ],
      sr: [
        {
          heading: 'Klijent',
          body: ['Simplice Beauty Lounge je salon lepote u UAE. Sa njima radim na daljinu od 2023, svakodnevno na engleskom.'],
        },
        {
          heading: 'Šta radim',
          body: [
            'Napravio sam sajt salona sa stranama usluga, o nama i kontakt, i vodim njihov sadržaj: objave, rilsove, kampanje, cenovnike i materijale za štampu.',
          ],
        },
      ],
    },
  },
];
