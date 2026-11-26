Mehanički taster: jedina dugmad i linkovi-akcije u sistemu, sa 6px dubine koja propadne na pritisak.

**Varijante:** `djk-key--accent` (kobalt) za JEDNU glavnu akciju po ekranu, skoro uvek „Start a project"; osnovni `djk-key` (cap) za sporedne; `djk-key--mod` za spoljne linkove i pomoćne radnje. `djk-key--sm` je mali taster (4px dubine) za kartice, navigaciju, prekidač jezika i izbor vrste projekta u formi.

**Upotreba:** `<button>` za radnju ili `<a>` za link, sa klasom `djk-key`. Legenda je kratka, glagol prvo; CSS je prebacuje u VELIKA slova. Spoljni link dobija `<span class="djk-arrow">↗</span>` posle reči.

**Stanja:** `:active` i klasa `is-down` (dodaje je JS dok je pritisnuta prečica) spuštaju taster; `aria-pressed="true"` boji taster u kobalt (izabran jezik `EN`/`SR`, izabrana vrsta projekta); `disabled` ili `aria-disabled="true"` ga gasi na 50%.

**Ne:** ne podiži taster na hover; ne stavljaj dva kobalt tastera jedan pored drugog; ne koristi taster kao oznaku koja se ne pritiska (za to je `Chip`).
