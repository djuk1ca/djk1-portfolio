# DJK-1 portfolio sajt: dizajn

Datum: 2026-11-26 · Vlasnik: Đurađ Manojlović · Dizajn sistem: [DJK-1](https://claude.ai/artifact/NwK1ncVjcdGMqCEDCGWjs7)

## Namera

Sajt je freelance izlog. Ljudi i firme kojima treba sajt, web aplikacija, mobilna aplikacija, backend/API ili AI integracija treba da ga nađu na Google-u (na srpskom i engleskom), vide gotove radove i pošalju upit kroz formu. Đurađ isti link šalje potencijalnim klijentima. Poslodavci za praksu su sekundarna publika; isti dokazi rade i za njih.

## Ciljevi

- Upit klijenta stiže pouzdano: forma radi i bez JavaScript-a, ne gubi poruke i filtrira spam.
- Svaka usluga i svaki rad imaju sopstvenu stranu na oba jezika, sa pravim tekstom koji Google može da indeksira.
- Lighthouse na telefonu ≥ 95 za Performance, Accessibility, Best Practices i SEO na početnoj i na jednoj case study strani.
- Izgled tačno po DJK-1 sistemu (smer A: kit plastika, mehanički tasteri, ambar ekran), obe teme.
- Hosting na Cloudflare-u, prvo na besplatnoj `*.workers.dev` adresi, kasnije sopstveni domen bez rušenja linkova.

## Ne-ciljevi

- Blog i CMS (sadržaj je u repou; blog se dodaje kasnije ako zatreba).
- Online plaćanje, zakazivanje, nalozi korisnika.
- Igrive igre (Connect 4, Flappy) u prvoj verziji: ostaju ideja za v2.

## Anti-ciljevi (neuspeh i kad tehnički radi)

- Sajt koji izgleda kao kostim: 3D i ukrasi preko svega, tekst teško čitljiv.
- Spor sajt: retro efekti koji koštaju performanse ili šalju veliki JS.
- Upit koji „ode" a ne stigne nigde, ili inbox pun spama.
- Izmišljeni brojevi, recenzije ili klijenti.

## Ograničenja

- Cloudflare Workers preko OpenNext adaptera (`@opennextjs/cloudflare`). Besplatni Workers plan ima ograničenje veličine Worker-a (oko 3 MB kompresovano); ako ga server bundle pređe, opcije su plaćeni plan ($5/mes) ili izdvajanje forme u mali zaseban Worker.
- `next/image` optimizacija ne radi besplatno na Workers-u: slike se optimizuju unapred (sharp skripta) i služe kao statični fajlovi.
- Nema sopstvenog domena dok Đurađ ne kupi jedan; sve apsolutne adrese (canonical, sitemap, OG) idu iz jedne promenljive `SITE_URL`.
- Nalozi koje Claude ne može da napravi: Cloudflare (`wrangler login`), Resend, Turnstile ključevi, GitHub secret za deploy. Đurađ ih pravi sam.

## Pristupi (razmotreni)

| | Prednosti | Mane |
|---|---|---|
| **Next.js 16, statički generisan, OpenNext na Workers** (izabran) | Đurađ zna React/Next (isti stek kao Kaneko); Server Actions za formu u istom projektu; zreo `next-intl`; sajt je i primer steka koji prodaje | Adapter sloj između Next-a i Workers-a; više JS-a od Astro-a ako se ne pazi |
| Astro 6 na Workers | Najlakši (0 KB JS podrazumevano), Cloudflare je vlasnik, ugrađen i18n | Nov framework za učenje; manje poznat klijentima |
| Vite + React SPA (kao M&D Mont) | Poznato | Sadržaj se crta u browseru, loš SEO bez prerender trikova; forma traži poseban backend |

Izabran Next.js: Đurađ ga je izabrao, zna ga, i statičkim generisanjem dobija isti SEO kao Astro.

## Odluke

### Stek
- Next.js 16 (App Router), React 19, TypeScript, verzije usklađene sa Kaneko projektom.
- Stilovi: obični CSS iz DJK-1 (`tokens.css` + `bundle.css` kao globalni stil, CSS Modules za raspored strana). Bez Tailwind-a, jer je sistem već u CSS promenljivim.
- `next-intl` za prevode i rute, `zod` za validaciju forme.
- Deploy: `@opennextjs/cloudflare` + `wrangler`, D1 baza za upite.
- Testovi: Playwright (smoke i forma) + `@axe-core/playwright`, Lighthouse skripta kao u Kaneko projektu.

### Jezici i rute (Đurađeva odluka)
- **Engleski je podrazumevani na `/`**, srpski na `/sr/...`. Bez automatskog preusmeravanja po jeziku browsera; prekidač `EN` / `SR` u zaglavlju vodi na istu stranu na drugom jeziku.
- Prevedeni slugovi:

| Engleski | Srpski |
|---|---|
| `/` | `/sr` |
| `/services` | `/sr/usluge` |
| `/work/<slug>` | `/sr/radovi/<slug>` |
| `/projects/<slug>` | `/sr/projekti/<slug>` |
| `/about` | `/sr/o-meni` |
| `/contact` | `/sr/kontakt` |

- Radovi: `usluzionica`, `broker-auditor`, `md-mont`, `kaneko`, `simplice`. Projekti: `language-id`, `connect-4`, `pdf-fast-reading`, `flappy`.
- Prevodi se sav tekst; na engleskom ostaju nazivi tehnologija, metrike na LCD-u, CI koraci i nazivi projekata.

### Sadržaj
- Strukturisani podaci (usluge, radovi, projekti, metrike) u TypeScript fajlovima sa poljima `sr` i `en`.
- Duži tekst case study strana u MDX fajlovima po jeziku (`content/work/usluzionica.sr.mdx`, `.en.mdx`).
- Prvi nacrt teksta na oba jezika piše Claude iz CV-a, GitHub-a i postojećih projekata; Đurađ ga ispravlja.
- Snimci klijentskih sajtova: Playwright skripta ih snima sa živih sajtova, sharp ih pretvara u AVIF/WebP u dve veličine.
- Na sajtu je email i forma; broj telefona ne (moja odluka).

### Strane
- **Početna:** hero (ime, LCD rečenica, „Start a project" / „View work", LED „available for new projects"; na srpskom „Započni projekat" / „Pogledaj radove") → usluge (5 `Service`) → Uslužionica panel (LCD brojevi + CI LED red) → klijentski radovi (4 `Monitor`) → projekti (4 `ProjectModule`) → kratko o meni → forma za upit.
- **Usluge:** sekcija po usluzi sa sopstvenim `h2`, šta klijent dobija, primeri iz radova, „Započni projekat".
- **Rad / projekat:** naslov, uvod, panel sa brojevima, MDX tekst, stek, linkovi, „Započni projekat".
- **O meni:** obrazovanje, GPA, obuka, jezici, link na CV (PDF, engleski).
- **Kontakt:** forma za upit.
- **404** na oba jezika.

### Forma za upit
- Polja: ime, email, vrsta projekta (višestruki izbor: sajt, web aplikacija, mobilna aplikacija, backend/API, AI i embeddings), okvirni rok (opciono), poruka.
- Server Action: zod validacija → provera Cloudflare Turnstile tokena → upis u D1 → mejl obaveštenje Đurađu preko Resend HTTP API-ja. Mejl ide tek posle upisa; ako mejl ne prođe, upit ostaje u D1 i forma i dalje kaže „poslato".
- Radi bez JS-a (običan POST na Server Action); sa JS-om stanje se prikazuje `Led` statusom bez osvežavanja strane.
- Honeypot polje + Turnstile; ograničenje broja upita po IP-u (npr. 5 na sat) preko D1.
- Dok nema Resend naloga, upiti se samo čuvaju u D1 i pregledaju preko `wrangler d1 execute`.

### SEO
- Sve strane statički generisane (`generateStaticParams`); samo Server Action forme radi na Worker-u.
- Po strani i jeziku: `title`, `description`, canonical, `hreflang` (`en`, `sr`, `x-default` → engleski), Open Graph slika (generisana unapred u DJK-1 stilu).
- `sitemap.xml` sa obe verzije svake strane, `robots.txt`.
- JSON-LD: `Person` i `ProfessionalService` (Novi Sad, Srbija; rad i na daljinu) na početnoj, `BreadcrumbList` na radovima i projektima.
- Jedan `h1` po strani, svi naslovi pravi tekst, opisni `alt` na snimcima ekrana.
- Cloudflare Web Analytics (bez kolačića, bez banera).

### Izgled i ponašanje
- DJK-1 tokeni i komponente kao u sistemu; Kit tema podrazumevano prati sistemsku, prekidač je pamti u `localStorage`, mali inline skript postavlja temu pre prvog crtanja (bez treptaja).
- Klijentski JS samo za: prekidač teme, prekidač zvuka tastera (podrazumevano isključen), prečice 1–5 za navigaciju, animaciju CI LED reda, poboljšanu formu. Sve ostalo su serverske komponente.
- Fontovi preko `next/font/google` (Archivo, IBM Plex Sans, IBM Plex Mono, VT323), samo latin i latin-ext.
- `prefers-reduced-motion` gasi tranzicije i treptanje.

### Repo i deploy
- Novi repo u `D:\code\djk1-portfolio`, javni GitHub repo kasnije (deo portfolija). Commit i push samo kad Đurađ kaže.
- GitHub Actions: lint, typecheck, build, Playwright; deploy na Cloudflare na `main` (traži `CLOUDFLARE_API_TOKEN` secret).

## Ostavljeno graditelju

- Raspored CSS Modules i podela na komponente u kodu.
- Tačan izgled OG slika u okviru DJK-1.
- Tačna pravila ograničenja broja upita.
- Redosled i obim Playwright testova, uz minimum: svaka ruta vraća 200 na oba jezika, `hreflang` postoji i pokazuje na pravu stranu, forma odbija loš email, axe bez ozbiljnih grešaka.
