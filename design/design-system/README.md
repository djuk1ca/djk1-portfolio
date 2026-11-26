DJK-1 je dizajn sistem portfolija Đurađa Manojlovića. Sajt se ponaša kao komad opreme iz osamdesetih: kućište od sive plastike, mehanički tasteri koji propadnu kad ih pritisneš i mali ambar ekran za prave brojeve. Ime je model oznaka izvučena iz GitHub handle-a `djuk1ca`.

## Karakter: radna mašina

- **Dubina samo za akciju.** 3D dubinu dobija samo ono što se pritiska ili uključuje: `Key`, `Keycap`, `Switch`. Tekst leži ravno (nivo 0) i čita se kao dokument.
- **Ekran je za prave brojeve.** `Lcd` prikazuje samo metrike koje postoje u CV-u ili repou (574 testa, 86.9% pokrivenosti, 134 endpointa, 99.5% tačnosti, GPA 9.36). Nikad izmišljen ili zaokružen broj.
- **Jedan detalj po panelu.** Vijci (`djk-screw`), rešetka (`djk-grille`) ili nalepnica: najviše jedan po panelu. Više od toga i sajt liči na kostim.

Izbegavaj: pixel font za tekst van ekrana, neon sci-fi, „haker" zeleni kod, drvo/kožu/sjajne gradijente, animaciju na skrol za svaku karticu.

## Kome se obraća

Sajt je pre svega **freelance izlog**: ljudi i firme kojima treba sajt, web aplikacija, mobilna aplikacija, backend/API ili AI integracija (embeddings, pretraga, chat nad dokumentima) treba da ga nađu na Google-u, vide gotove radove i pošalju upit. Poslodavci za praksu su sekundarna publika i isti dokazi rade i za njih.

- Glavna akcija svuda je **„Start a project" / „Započni projekat"** (kobalt), koja vodi na formu za upit.
- Svaki rad odgovara na tri pitanja klijenta: šta je napravljeno, za koga, šta je klijent dobio (live link, platforme, brzina, brojevi).
- Usluge se nabrajaju kao `Service` pločice: Websites, Web apps, Mobile apps, Backends & APIs, AI & embeddings.

## Sadržaj i glas

- Sajt je **dvojezičan: engleski i srpski**, sa prekidačem jezika (`EN` / `SR` kao `Key` `djk-key--sm`) u zaglavlju. Prevode se naslovi, pasusi, legende tastera i natpisi. Na engleskom ostaju: nazivi tehnologija, nabrajanja sa brojevima i metrike na `Lcd` („574 AUTOMATED TESTS", „86.9% LINE COVERAGE"), CI koraci na LED redu i nazivi projekata. Ovaj priručnik je na srpskom.
- Prvo lice jednine, kratke izjavne rečenice, okrenute klijentu: „I build websites, web and mobile apps, and the backends behind them." Bez superlativa i bez „passionate", „cutting-edge".
- SEO: svaki naslov je pravi tekst (nikad slika), jedan `h1` po strani, naslovi i opisi sadrže ono što ljudi kucaju („web developer Novi Sad", „izrada sajtova", „izrada mobilnih aplikacija"), ali kao prirodna rečenica, ne kao spisak ključnih reči.
- Konkretno umesto opisnog: broj, platforma, tehnologija. „574 automated tests" a ne „extensive testing".
- Legende tastera i eyebrow natpisi idu VELIKIM slovima (`legend`, `eyebrow`); naslovi i tekst normalno. Glagol prvo na tasterima: „Start a project", „View work".
- Spoljni link dobija strelicu `↗` posle reči, u `mono`. Bez emodžija.
- Pravilna slova: Đurađ Manojlović, Uslužionica. Nikad „Djuradj" u vidljivom tekstu (samo u URL-ovima).

## Boje

- Stranica je `desk`; sekcije su paneli u `case` sa senkom `raise`; ploče unutar panela su `case-hi`.
- Tekst je `ink`, sporedni `ink-2`, natpisi `ink-3` (samo na `case` i `case-hi`, ne na `desk`).
- **Kobalt `accent` je jedna glavna akcija po ekranu** (`djk-key--accent`, legenda `on-accent`). Sporedne akcije su `cap`, spoljni linkovi i pomoćne radnje `mod` sa `mod-ink`.
- Ekran je `screen` u obe teme; na njemu je tekst isključivo `phosphor` sa sjajem `phosphor-glow`, a ugašeni segmenti `phosphor-dim`.
- LED: `led-on` = uživo/prošlo, `led-warn` = u toku, `led-off` = ugašeno. Status nikad nije samo boja: uz svaku lampicu stoji reč (`djk-status`).
- Nalepnica modula je `paper` sa `paper-ink` i `paper-muted` u obe teme; traka u boji je jedan od `tone-*` po vrsti projekta.
- Teme: `kit` (svetla, podrazumevana) i `grafit` (tamna). Sajt prati sistemsku temu, a prekidač u zaglavlju je pamti.

## Tipografija

- Natpisi: Archivo (`display`) sa `font-stretch` 112–125%. `display-xl` samo za ime u hero sekciji, jednom po strani.
- Tekst: IBM Plex Sans (`body`), stilovi `body-lg`, `body`, `small`, red do 65 znakova.
- Tehnologije i putanje: IBM Plex Mono (`code`, `tag`).
- Ekran: VT323 (`lcd-xl`, `lcd`, `lcd-caption`) i nigde drugde.
- Svi fontovi su sa Google Fonts i imaju Đ, Ć, Č, Š, Ž. `components/bundle.css` ih učitava.

## Dubina i svetlo

Svaki element sedi na tačno jednom od četiri nivoa. Svetlo uvek pada odozgo: gornja ivica `hl`, donja tamnija, senka `shadow-tint` nadole.

| Nivo | Šta | Token |
| --- | --- | --- |
| −1 udubljeno | polje, LCD, staza prekidača, kutija statusa | `well` + `sink` |
| 0 ravno | tekst, liste, redovi sa `line` | bez senke |
| +1 kućište | panel, modul, monitor | `case` + `raise` |
| +2 taster | `Key`, `Keycap`, dugme prekidača | bočna strana `depth-key` u `*-side` boji |

Nikad ne gnezdi panel sa `raise` u drugi panel sa `raise`; unutar panela koristi `case-hi` ploču.

## Pokret i stanja

- **Pritisak:** taster propada za `depth-key` − 1px za 70ms (`cubic-bezier(.3,.7,.4,1)`), senka se skuplja na 1px. Na `:active` i na klasi `is-down` (kad se pritisne prečica na tastaturi).
- **Prekidač:** dugme klizi 140ms.
- **Kursor** na ekranu trepće 1s `steps(1)`.
- **Hover:** tasteri se ne podižu na hover; menja se samo kursor. Mehanički taster ne reaguje dok ga ne pritisneš.
- **Fokus:** `outline` 3px `accent`, odmaknut 3px, na svemu što se fokusira.
- **Zvuk klika** (WebAudio, kratak šum kroz bandpass ~2.6kHz + nizak „thock" 190→90Hz) postoji samo kao opcija koju posetilac sam uključi prekidačem; podrazumevano je isključen.
- `prefers-reduced-motion`: bez tranzicija i treptanja; pritisak i dalje menja izgled, samo bez animacije.
- Jedini „orkestrirani" trenutak na sajtu: LED red CI pipeline-a se pali redom (ambar → zeleno) kad posetilac pritisne „Run pipeline".

## Raspored

- Kućište strane je široko najviše 1120px, bočna margina najmanje `space-4`, razmak između panela `space-6`, unutrašnjost panela `space-7` (na telefonu `space-5`).
- Mreže: klijentski sajtovi 2 kolone, projekti 4 (2 na tabletu, 1 na telefonu).
- Navigacija na sajtu: red `Key` tastera; prečice na tastaturi 1–4 pritiskaju odgovarajući `Keycap` i skroluju do sekcije.

## Obrasci strana

- **Početna:** hero (ime, ekran sa jednom rečenicom, tasteri Start a project / View work, status „Available for new projects") → Services (`Service` ×5) → Uslužionica u posebnom panelu sa vijcima (`Lcd` brojevi + LED red CI-ja) → Client work (`Monitor` ×4) → Projects (`ProjectModule` ×4) → About (GPA na `Lcd`, obrazovanje, jezici) → forma za upit (`Field`).
- **Case study** (`/work/<slug>`): naslov `display`, uvodni `body-lg`, panel sa brojevima, zatim tekstualne sekcije na nivou 0, na dnu „Start a project".
- **Forma za upit:** ime, email, vrsta projekta (par `Key` `djk-key--sm` sa `aria-pressed`, može više), okvirni rok, poruka; stanje forme kao `Led` status pored dugmeta.
- **Mapa** (svaka strana na `/en/…` i `/sr/…`): `/`, `/services`, `/work/usluzionica`, `/work/broker-auditor`, `/work/md-mont`, `/work/kaneko`, `/work/simplice`, `/projects/language-id`, `/projects/connect-4`, `/projects/pdf-fast-reading`, `/projects/flappy`, `/contact`.

## Ikonografija

- Nema seta ikonica. Koriste se tekstualni glifovi u `mono`: `↗` spoljni link, `▶` pokreni, `←` nazad, `>` odzivnik na ekranu.
- Nema logotipa. Znak je tekst „ĐM · DJK-1" u Archivo 900, širina 125%.
- Klijentski sajtovi se prikazuju pravim snimcima ekrana unutar `Monitor`, nikad prepravljenim logotipima klijenata.
