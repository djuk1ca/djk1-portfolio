Kvadratni taster sa legendom: broj gore levo, naziv dole, kao prava tipka tastature; služi za navigaciju sekcija sa prečicom.

**Upotreba:** `<a class="djk-key djk-kc" href="#work" data-key="2"><b>2</b><span>Work</span></a>`. Može da nosi `djk-key--mod` ili `djk-key--accent` (jedna istaknuta sekcija, Contact).

**Ponašanje koje daje potrošač:** slušaj `keydown`/`keyup` za cifre iz `data-key`, dodaj/ukloni `is-down` i skroluj do sekcije. Preskoči kad je fokus u `input`, `textarea` ili `contenteditable`, i kad je pritisnut Ctrl/Alt/Meta. Na telefonu taster je 62×58px. Href je pravi link (`#work` ili `/en/work`), tako da navigacija radi i bez JS-a i pretraživači je prate.
