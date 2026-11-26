LED lampica sa rečju: dostupnost za projekte, status rada i koraci CI pipeline-a.

**Upotreba:** `<span class="djk-status"><i class="djk-led is-on"></i>live</span>`. Stanja: `is-on` (`led-on`: uživo, prošlo, dostupan), `is-warn` (`led-warn`: u toku), bez klase (`led-off`: ugašeno). Reč posle lampice je obavezna; status nikad nije samo boja. Više statusa ide u `djk-pipeline` unutar udubljene `djk-statusbox`.

**Pipeline:** jedini orkestrirani pokret na sajtu. Na „Run pipeline" lampice se gase pa pale redom, ambar pa zeleno, 260ms po koraku; uz `prefers-reduced-motion` sve odjednom. CI koraci ostaju na engleskom i u srpskoj verziji.
