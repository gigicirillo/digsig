/* Local vector catalog: no font or external image requests. */
(function(){
  const catalog = [
  {
    "id": "info",
    "label": "Informazioni",
    "keywords": "aiuto reception",
    "shape": "<path d=\"M12 11v6 M12 7h.01\"/><circle cx=\"12\" cy=\"12\" r=\"9\"/>"
  },
  {
    "id": "weights",
    "label": "Pesi e palestra",
    "keywords": "fitness allenamento manubrio",
    "shape": "<path d=\"M6 12h12 M3 9v6 M6 6v12 M18 6v12 M21 9v6\"/>"
  },
  {
    "id": "run",
    "label": "Corsa",
    "keywords": "correre sport allenamento",
    "shape": "<path d=\"M13 7l-4 4-4 1 M13 7l3 5h4 M11 10l3 5-3 6 M11 14l-5 5\"/><circle cx=\"15\" cy=\"4\" r=\"2\"/>"
  },
  {
    "id": "bike",
    "label": "Bicicletta",
    "keywords": "ciclismo spinning",
    "shape": "<path d=\"M5 16l5-9 5 9H5 M10 7h5 M8 4h4 M15 4h3l2 12\"/><circle cx=\"5\" cy=\"16\" r=\"4\"/><circle cx=\"19\" cy=\"16\" r=\"4\"/>"
  },
  {
    "id": "swim",
    "label": "Nuoto",
    "keywords": "piscina acqua",
    "shape": "<path d=\"M2 20q2-3 5 0t5 0t5 0t5 0 M2 16q2-3 5 0t5 0t5 0t5 0 M6 12l5-5 5 5 M11 7l-5-4\"/><circle cx=\"18\" cy=\"8\" r=\"2\"/>"
  },
  {
    "id": "yoga",
    "label": "Yoga e stretching",
    "keywords": "relax meditazione",
    "shape": "<path d=\"M12 9v7 M12 11l-5 3H3 M12 11l5 3h4 M12 16l-7 4h14z\"/><circle cx=\"12\" cy=\"5\" r=\"2\"/>"
  },
  {
    "id": "heart",
    "label": "Cuore e salute",
    "keywords": "benessere amore cardio",
    "shape": "<path d=\"M12 21S2 15 2 8a5 5 0 0 1 10-2 5 5 0 0 1 10 2c0 7-10 13-10 13\"/>"
  },
  {
    "id": "shower",
    "label": "Doccia",
    "keywords": "lavarsi acqua spogliatoio",
    "shape": "<path d=\"M5 21V6a4 4 0 0 1 8 0 M10 9h9l-2-3h-5z M11 12v2 M15 12v2 M19 12v2 M11 17v2 M15 17v2 M19 17v2\"/>"
  },
  {
    "id": "locker",
    "label": "Armadietto",
    "keywords": "spogliatoio guardaroba deposito",
    "shape": "<path d=\"M4 3h16v18H4z M12 3v18 M7 7h2 M15 7h2 M9 12v3 M15 12v3\"/>"
  },
  {
    "id": "water",
    "label": "Acqua",
    "keywords": "bere goccia idratazione",
    "shape": "<path d=\"M12 2S5 11 5 15a7 7 0 0 0 14 0c0-4-7-13-7-13z\"/>"
  },
  {
    "id": "bottle",
    "label": "Bottiglia",
    "keywords": "bere borraccia acqua",
    "shape": "<path d=\"M9 2h6v4l3 4v12H6V10l3-4z M6 12h12 M6 18h12 M9 6h6\"/>"
  },
  {
    "id": "toilet",
    "label": "Bagni",
    "keywords": "wc toilette servizi igienici",
    "shape": "<path d=\"M5 8v7 M3 11h4 M4 15v6 M6 15v6 M17 8l-3 8h6z M16 16v5 M18 16v5 M11 3v18\"/><circle cx=\"5\" cy=\"4\" r=\"2\"/><circle cx=\"17\" cy=\"4\" r=\"2\"/>"
  },
  {
    "id": "accessible",
    "label": "Accessibilità",
    "keywords": "disabili sedia rotelle",
    "shape": "<path d=\"M10 7v7h7l3 6 2-1 M10 10h7 M7 11a6 6 0 1 0 8 8\"/><circle cx=\"10\" cy=\"3\" r=\"2\"/>"
  },
  {
    "id": "parking",
    "label": "Parcheggio",
    "keywords": "auto macchina posteggio",
    "shape": "<path d=\"M9 18V6h4a4 4 0 0 1 0 8H9\"/><rect x=\"2\" y=\"2\" width=\"20\" height=\"20\" rx=\"3\"/>"
  },
  {
    "id": "exit",
    "label": "Uscita",
    "keywords": "uscire porta emergenza",
    "shape": "<path d=\"M10 3H3v18h7 M8 12h13 M16 7l5 5-5 5\"/>"
  },
  {
    "id": "enter",
    "label": "Ingresso",
    "keywords": "entrare porta entrata",
    "shape": "<path d=\"M14 3h7v18h-7 M2 12h14 M11 7l5 5-5 5\"/>"
  },
  {
    "id": "reception",
    "label": "Reception",
    "keywords": "accoglienza banco assistenza",
    "shape": "<path d=\"M2 17h20v5H2z M5 14v-2h14v2\"/><circle cx=\"12\" cy=\"6\" r=\"3\"/>"
  },
  {
    "id": "warning",
    "label": "Attenzione",
    "keywords": "avviso pericolo allerta",
    "shape": "<path d=\"M12 3L2 21h20z M12 9v5 M12 17h.01\"/>"
  },
  {
    "id": "ban",
    "label": "Divieto",
    "keywords": "vietato stop proibito",
    "shape": "<path d=\"M6 6l12 12\"/><circle cx=\"12\" cy=\"12\" r=\"10\"/>"
  },
  {
    "id": "smoking",
    "label": "Vietato fumare",
    "keywords": "fumo sigarette divieto",
    "shape": "<path d=\"M2 15h16v4H2z M21 15v4 M18 3q-4 3 0 5t0 4 M3 3l18 18\"/>"
  },
  {
    "id": "phone",
    "label": "Telefono",
    "keywords": "chiamare contatti cellulare",
    "shape": "<path d=\"M5 2l4 5-3 3a15 15 0 0 0 8 8l3-3 5 4c-2 8-13 1-17-3S-1 3 5 2z\"/>"
  },
  {
    "id": "mail",
    "label": "Email",
    "keywords": "posta messaggio contatti",
    "shape": "<path d=\"M2 5l10 8L22 5\"/><rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\"/>"
  },
  {
    "id": "wifi",
    "label": "Wi-Fi",
    "keywords": "internet rete connessione",
    "shape": "<path d=\"M2 8a16 16 0 0 1 20 0 M5 12a11 11 0 0 1 14 0 M8 16a6 6 0 0 1 8 0 M12 20h.01\"/>"
  },
  {
    "id": "clock",
    "label": "Orologio",
    "keywords": "ora orari tempo",
    "shape": "<path d=\"M12 6v6l4 2\"/><circle cx=\"12\" cy=\"12\" r=\"10\"/>"
  },
  {
    "id": "calendar",
    "label": "Calendario",
    "keywords": "data eventi appuntamento",
    "shape": "<path d=\"M3 9h18 M7 2v4 M17 2v4 M7 13h2 M15 13h2 M7 17h2\"/><rect x=\"3\" y=\"4\" width=\"18\" height=\"18\" rx=\"2\"/>"
  },
  {
    "id": "location",
    "label": "Posizione",
    "keywords": "mappa indirizzo luogo",
    "shape": "<path d=\"M12 22S4 14 4 9a8 8 0 0 1 16 0c0 5-8 13-8 13z\"/><circle cx=\"12\" cy=\"9\" r=\"3\"/>"
  },
  {
    "id": "home",
    "label": "Casa",
    "keywords": "home principale abitazione",
    "shape": "<path d=\"M2 11L12 2l10 9 M5 9v13h14V9 M9 22v-8h6v8\"/>"
  },
  {
    "id": "group",
    "label": "Gruppo",
    "keywords": "persone utenti team corso",
    "shape": "<path d=\"M3 22v-3a6 6 0 0 1 12 0v3 M18 13a5 5 0 0 1 4 5v4\"/><circle cx=\"9\" cy=\"6\" r=\"4\"/><path d=\"M17 3a4 4 0 0 1 0 8\"/>"
  },
  {
    "id": "music",
    "label": "Musica",
    "keywords": "note audio canzone",
    "shape": "<path d=\"M9 18V4l12-2v14 M9 8l12-2\"/><ellipse cx=\"5\" cy=\"18\" rx=\"4\" ry=\"3\"/><ellipse cx=\"17\" cy=\"16\" rx=\"4\" ry=\"3\"/>"
  },
  {
    "id": "silent",
    "label": "Silenzio",
    "keywords": "muto volume audio",
    "shape": "<path d=\"M3 9h4l5-5v16l-5-5H3z M16 9l6 6 M22 9l-6 6\"/>"
  },
  {
    "id": "camera",
    "label": "Videocamera",
    "keywords": "video ripresa filmato",
    "shape": "<path d=\"M16 9l6-4v14l-6-4\"/><rect x=\"2\" y=\"5\" width=\"14\" height=\"14\" rx=\"2\"/>"
  },
  {
    "id": "star",
    "label": "Stella",
    "keywords": "preferiti novità speciale",
    "shape": "<path d=\"M12 2l3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z\"/>"
  },
  {
    "id": "check",
    "label": "Conferma",
    "keywords": "ok fatto corretto successo",
    "shape": "<path d=\"M5 12l5 5L20 6\"/><circle cx=\"12\" cy=\"12\" r=\"10\"/>"
  },
  {
    "id": "right",
    "label": "Freccia destra",
    "keywords": "direzione avanti",
    "shape": "<path d=\"M3 12h18 M13 4l8 8-8 8\"/>"
  },
  {
    "id": "left",
    "label": "Freccia sinistra",
    "keywords": "direzione indietro",
    "shape": "<path d=\"M21 12H3 M11 4l-8 8 8 8\"/>"
  },
  {
    "id": "up",
    "label": "Freccia su",
    "keywords": "direzione alto sopra",
    "shape": "<path d=\"M12 21V3 M4 11l8-8 8 8\"/>"
  },
  {
    "id": "down",
    "label": "Freccia giù",
    "keywords": "direzione basso sotto",
    "shape": "<path d=\"M12 3v18 M4 13l8 8 8-8\"/>"
  },
  {
    "id": "sun",
    "label": "Sole",
    "keywords": "giorno meteo luce",
    "shape": "<path d=\"M12 1v2 M12 21v2 M1 12h2 M21 12h2 M4 4l2 2 M18 18l2 2 M4 20l2-2 M18 6l2-2\"/><circle cx=\"12\" cy=\"12\" r=\"5\"/>"
  },
  {
    "id": "moon",
    "label": "Luna",
    "keywords": "notte sera riposo",
    "shape": "<path d=\"M21 14A9 9 0 0 1 10 3a8 8 0 0 0 11 11z\"/>"
  },
  {
    "id": "coffee",
    "label": "Caffè",
    "keywords": "bar pausa tazza ristoro",
    "shape": "<path d=\"M3 8h14v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z M17 9h2a3 3 0 0 1 0 6h-2 M6 2v3 M10 2v3 M14 2v3\"/>"
  },
  {
    "id": "bell",
    "label": "Campanella",
    "keywords": "notifica avviso suonare",
    "shape": "<path d=\"M5 17h14l-2-4V8a5 5 0 0 0-10 0v5z M9 20a3 3 0 0 0 6 0 M12 1v2\"/>"
  },
  {
    "id": "gift",
    "label": "Regalo",
    "keywords": "offerta promozione premio",
    "shape": "<path d=\"M3 10h18v4H3z M5 14v8h14v-8 M12 10v12 M12 10C1 10 6-1 12 10c6-11 11 0 0 0\"/>"
  },
  {
    "id": "trophy",
    "label": "Trofeo",
    "keywords": "coppa vittoria gara premio",
    "shape": "<path d=\"M7 3h10v7a5 5 0 0 1-10 0z M7 5H3v3a4 4 0 0 0 4 4 M17 5h4v3a4 4 0 0 1-4 4 M12 15v6 M7 22h10\"/>"
  },
  {
    "id": "lock",
    "label": "Lucchetto",
    "keywords": "sicurezza chiuso protezione",
    "shape": "<path d=\"M7 10V6a5 5 0 0 1 10 0v4 M12 14v4\"/><rect x=\"4\" y=\"10\" width=\"16\" height=\"12\" rx=\"2\"/>"
  },
  {
    "id": "clean",
    "label": "Pulizia",
    "keywords": "igiene sanificazione pulire",
    "shape": "<path d=\"M10 12l9-10 M8 10l6 6-6 6-6-6z M6 14l4 4 M18 15v6 M15 18h6\"/>"
  },
  {
    "id": "temperature",
    "label": "Temperatura",
    "keywords": "termometro caldo freddo",
    "shape": "<path d=\"M9 15V5a3 3 0 0 1 6 0v10a5 5 0 1 1-6 0 M12 8v10 M18 5h3 M18 9h3\"/>"
  }
];
  const get=id=>catalog.find(i=>i.id===id)||catalog[0];
  const normalize=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[-–]/g,' ');
  const search=q=>{const words=normalize(q).trim().split(/\s+/);return catalog.filter(i=>words.every(w=>normalize(i.label+' '+i.keywords).includes(w)));};
  function svg(id){const i=get(id);return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="'+i.label+'">'+i.shape+'</svg>';}
  const color=(v,f)=>/^#[0-9a-f]{6}$/i.test(v||'')?v:f;
  const scale=v=>Math.max(10,Math.min(100,Number(v)||70));
  function render(target,w){
    const box=document.createElement('div');box.className='icon-widget';box.innerHTML=svg(w.iconId);
    box.style.color=color(w.iconColor,'#ffffff');
    const mode=w.backgroundMode||(w.backgroundTransparent?'transparent':'solid');
    box.style.background=mode==='transparent'?'transparent':mode==='gradient'?`linear-gradient(${Number(w.backgroundAngle)||135}deg,${color(w.backgroundColor,'#101820')},${color(w.backgroundColor2,'#42d9ff')})`:color(w.backgroundColor,'#101820');
    box.style.justifyContent=({left:'flex-start',right:'flex-end'})[w.alignH]||'center';
    box.style.alignItems=({top:'flex-start',bottom:'flex-end'})[w.alignV]||'center';
    box.style.setProperty('--icon-size',scale(w.iconScale));target.replaceChildren(box);
  }
  window.digsigIcons={catalog,get,search,svg,color,scale,render};
})();
