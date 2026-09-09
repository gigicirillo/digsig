# DigSig

Base web per un sistema di digital signage multi-TV senza database.

## Architettura

- `index.html` — dashboard amministrativa di base
- `player.html?screen=ID` — player fullscreen da aprire sul browser della TV
- `data/config.json` — configurazione di schermi, playlist e media
- `assets/js/player.js` — motore di riproduzione
- `assets/js/app.js` — dashboard

## Demo

Schermo demo:

`player.html?screen=reception-demo`

Secondo schermo:

`player.html?screen=sala-fitness`

## Configurazione schermi

In `data/config.json` ogni schermo ha un ID univoco e una playlist assegnata:

```json
{
  "id": "reception-demo",
  "name": "Reception Demo",
  "playlistId": "welcome"
}
```

La TV dovrà semplicemente aprire:

`https://TUO-DOMINIO/player.html?screen=reception-demo`

## Tipi media supportati

- `html`: slide testuale generata dal player
- `image`: immagine via URL
- `video`: video MP4/WebM via URL
- `web`: pagina web in iframe, quando il sito sorgente lo consente

Esempio immagine:

```json
{
  "id": "promo-1",
  "name": "Promo 1",
  "type": "image",
  "url": "media/promo-1.jpg",
  "duration": 10
}
```

Esempio video:

```json
{
  "id": "video-1",
  "name": "Video 1",
  "type": "video",
  "url": "media/video-1.mp4",
  "duration": 20
}
```

## Aggiornamento TV

Il player ricontrolla `config.json` ogni 30 secondi. Se la configurazione cambia, ricarica automaticamente la playlist assegnata.

## Stato del progetto

Questa è la release base `v0.1`. La dashboard visualizza la configurazione ma non salva ancora modifiche direttamente dal browser, perché GitHub Pages è hosting statico. Il prossimo livello prevede una piccola API/backend oppure un meccanismo di scrittura autenticata verso GitHub/storage.

## Roadmap consigliata

1. Login amministratore
2. CRUD Schermi
3. CRUD Playlist
4. Upload Media
5. Assegnazione drag & drop
6. Programmazione per data/orario
7. Pairing TV tramite codice a 6 cifre
8. Heartbeat online/offline reale
9. Cache offline/PWA
10. Multi-sede e gruppi di schermi
