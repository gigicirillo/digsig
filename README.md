# DigSig

Sistema web di digital signage multi-TV senza database.

## Versione attuale: v0.3

La piattaforma include:

- dashboard amministrativa
- creazione ed eliminazione schermi
- preview live dello schermo in finestra modal
- apertura del player in nuova scheda
- creazione, modifica ed eliminazione playlist
- ordinamento manuale dei media nelle playlist
- programmazione playlist per intervallo date e fascia oraria
- creazione, modifica ed eliminazione media
- upload diretto immagini e video su hosting PHP
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
- `api/upload.php` — upload immagini e video nella cartella `media`
- `assets/js/app.js` — logica dashboard
- `assets/js/player.js` — motore di riproduzione TV

## Preview schermo

Nella sezione **Schermi** e nella dashboard è disponibile il pulsante **Preview**. Apre una finestra modal che incorpora direttamente il player dello schermo selezionato, mantenendo orientamento e playlist assegnata. Dal modal è possibile anche aprire il player in una nuova scheda.

## Upload media

Su hosting PHP puoi caricare direttamente:

- JPG
- PNG
- WebP
- GIF
- MP4
- WebM

I file vengono salvati automaticamente nella cartella `media/`. Il limite applicativo predefinito è 120 MB, salvo limiti PHP più bassi configurati sul server.

## Programmazione playlist

Ogni playlist può avere:

- data di inizio
- data di fine
- ora di inizio
- ora di fine

Fuori dalla finestra programmata il player non riproduce la playlist e continua a ricontrollare la configurazione. Sono supportate anche fasce orarie che attraversano la mezzanotte.

## Modalità GitHub Pages

GitHub Pages è statico e non esegue PHP. La dashboard funziona quindi in modalità demo/localStorage: puoi creare schermi, playlist e media sul browser in uso, ma le modifiche non vengono condivise automaticamente con altri dispositivi e l'upload diretto non è disponibile.

## Modalità produzione senza database

Per avere sincronizzazione reale tra dashboard e TV basta pubblicare gli stessi file su un hosting con PHP 8+ e permesso di scrittura sulle cartelle `data` e `media`.

Il flusso diventa:

`Dashboard → API PHP → data/config.json → Player TV`

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
- `image` — immagine caricata o via URL
- `video` — video MP4/WebM caricato o via URL
- `web` — pagina web in iframe, quando il sito sorgente consente l'embedding

## Aggiornamento TV

Il player ricontrolla la configurazione ogni 30 secondi. Se cambia la playlist, la programmazione o uno dei contenuti, aggiorna automaticamente la riproduzione.

## Passi successivi consigliati

1. heartbeat reale online/offline
2. gruppi e sedi
3. drag & drop nativo playlist
4. programmazione per giorni della settimana
5. cache offline/PWA
6. login amministratore e ruoli
7. monitoraggio player e log di riproduzione

## Widget Notizie RSS

In **Widget → Nuovo widget → Notizie RSS · Corriere della Sera** scegli Cronaca italiana, Prima pagina, Politica, Economia, Sport o Esteri. I feed ufficiali vengono letti direttamente dal browser e aggiornati ogni cinque minuti. Il filtro predefinito mostra soltanto le notizie della giornata corrente nel fuso `Europe/Rome`; sono disponibili anche ultime 24 ore e ultime disponibili con data. Il widget mostra la copertina in alto e, sotto, fonte, titolo, sommario e data, alternando le notizie con intervallo configurabile. Copertine e sommari vengono letti dal feed: se assenti, o se l’immagine non è disponibile, lo spazio viene restituito al testo. Il titolo si adatta allo spazio entro la dimensione massima scelta.

Il widget funziona in anteprima, nelle zone dei design e nelle playlist, anche a schermo intero. Per impostazione predefinita mostra 12 titoli, completando il periodo selezionato con le notizie precedenti dello stesso feed (sempre con data visibile). Il completamento può essere disattivato e il numero di titoli è configurabile da 1 a 30. In playlist, senza durata personalizzata, lascia il tempo necessario per l’intera sequenza; in caso di errore segnala l'indisponibilità dell'aggiornamento. Non occorrono servizi proxy né modifiche al backend PHP.

Test: con Node 20+, Playwright e Chrome installati, eseguire `node tests/rss-widget.test.cjs`.

### Feed personalizzato
Nel widget **Notizie RSS**, selezionare **Feed personalizzato (URL)** e inserire un indirizzo HTTPS RSS o Atom. **Verifica feed** controlla accessibilità e numero di notizie. Copertina, titolo, sommario, rotazione e aggiornamenti funzionano come per le fonti predefinite. Il nome della fonte deriva dal feed. Gli articoli senza data sono inclusi nelle ultime disponibili o nel completamento della sequenza, con la dicitura “Data non fornita”.

La lettura avviene direttamente dal browser: il server del feed deve consentire richieste CORS dal sito. Feed protetti, non HTTPS o che bloccano la lettura esterna non sono supportati senza un servizio server dedicato. Non vengono inviate credenziali e non viene usato un proxy pubblico.
