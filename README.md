# DigSig

Sistema web di digital signage multi-TV senza database.

## Versione attuale: v0.2

La piattaforma ora include:

- dashboard amministrativa
- creazione ed eliminazione schermi
- creazione ed eliminazione playlist
- creazione ed eliminazione media
- assegnazione playlist agli schermi
- player fullscreen per browser TV
- pairing TV con codice a 6 cifre
- aggiornamento automatico della configurazione ogni 30 secondi
- persistenza su file JSON tramite PHP
- fallback locale tramite `localStorage` quando il progetto gira su GitHub Pages

## Architettura

- `index.html` — dashboard amministrativa
- `player.html` — player TV e procedura di pairing
- `player.html?screen=ID` — apertura diretta di uno schermo già configurato
- `data/config.json` — configurazione centrale
- `api/config.php` — API lettura/scrittura configurazione JSON
- `api/pair.php` — pairing TV a 6 cifre
- `assets/js/app.js` — logica dashboard
- `assets/js/player.js` — motore di riproduzione TV

## Modalità GitHub Pages

GitHub Pages è statico e non esegue PHP. La dashboard funziona quindi in modalità demo/localStorage: puoi creare schermi, playlist e media sul browser in uso, ma le modifiche non vengono condivise automaticamente con altri dispositivi.

## Modalità produzione senza database

Per avere sincronizzazione reale tra dashboard e TV basta pubblicare gli stessi file su un hosting con PHP 8+ e permesso di scrittura sulla cartella `data`.

Il flusso diventa:

`Dashboard → api/config.php → data/config.json → Player TV`

Non è necessario MySQL o PostgreSQL.

## Pairing TV

1. Apri `player.html` sul browser del televisore senza parametri.
2. Il player genera un codice a 6 cifre valido 15 minuti.
3. Nella dashboard apri **Pairing TV**.
4. Inserisci il codice, il nome dello schermo, la sede e la playlist.
5. La TV riceve l'ID e apre automaticamente il contenuto assegnato.
6. L'ID viene salvato nel `localStorage` del browser TV per gli avvii successivi.

## Tipi media supportati

- `html` — slide testuale generata dal player
- `image` — immagine via URL
- `video` — video MP4/WebM via URL
- `web` — pagina web in iframe, quando il sito sorgente consente l'embedding

## Aggiornamento TV

Il player ricontrolla la configurazione ogni 30 secondi. Se cambia la playlist o uno dei contenuti, aggiorna automaticamente la riproduzione.

## Passi successivi consigliati

1. upload reale dei file media sul server
2. modifica degli elementi esistenti, oltre a crea/elimina
3. ordinamento drag & drop delle playlist
4. programmazione per data, giorno e fascia oraria
5. heartbeat reale online/offline
6. gruppi e sedi
7. cache offline/PWA
8. login amministratore e ruoli
9. monitoraggio player e log di riproduzione
