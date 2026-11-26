Udubljeno polje za unos (nivo −1) sa natpisom iznad; od njih se sklapa forma za upit klijenta.

**Upotreba:** `<div class="djk-field"><label for="email">Email</label><input id="email" type="email" autocomplete="email"></div>`; isto za `textarea`. Natpis je kratak, CSS ga prebacuje u VELIKA slova; placeholder je realan primer upita, ne uputstvo.

**Forma za upit:** ime, email, „What do you need?" kao grupa `Key` `djk-key--sm` sa `aria-pressed` (može više izbora: Website, Web app, Mobile app, Backend / API, AI & embeddings), opis projekta, i kobalt „Send inquiry". Stanje forme je `Led` status pored dugmeta: obećanje odgovora → slanje (`is-warn`) → poslato (`is-on`). Greška kaže šta da se popravi („add an email so I can reply"), bez izvinjavanja.

**Potrošač daje:** slanje na server sa zaštitom od spama; forma mora da radi i kao običan `<form method="post">` bez JS-a.
