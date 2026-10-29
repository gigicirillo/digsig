(function(){
  function init(){
    const type=document.getElementById('widgetType');if(!type)return;
    type.add(new Option('Reel · Instagram / Facebook / TikTok','reel'));
    const fields=document.createElement('div');fields.id='reelWidgetFields';fields.className='hidden';
    fields.innerHTML='<label>Link del Reel<input id="reelUrl" type="text" placeholder="Incolla il link del video condiviso" autocomplete="off"></label><label>File video per autoplay TV (URL diretto, facoltativo)<input id="reelVideoUrl" type="url" placeholder="https://…/reel.mp4"></label><p class="muted">Per avviare anche i Reel Instagram senza clic, inserisci il link HTTPS del file MP4/WebM. Questo video ha precedenza sul player social: parte senza audio, si ripete e mantiene le proporzioni. Puoi usare il file originale del tuo Reel già caricato nella sezione Media.</p><p id="reelLinkStatus" class="muted" aria-live="polite"></p><p class="muted">Usa un video pubblico con incorporamento consentito. Per i link brevi (es. vm.tiktok.com o facebook.com/share), apri il link nel browser e copia l’indirizzo completo del video.</p><p class="muted">Instagram e Facebook possono richiedere un clic su Play o mostrare un accesso: l’avvio automatico non è garantito. TikTok viene avviato senza audio. Per una TV senza interazione, usa un file video nella sezione Media.</p><p class="muted">In playlist il Reel resta visibile per 60 secondi, oppure per la durata personalizzata. La durata naturale non è rilevabile da tutti i social. Nel box Design con un solo widget rimane visibile.</p>';
    document.getElementById('messageWidgetFields').insertAdjacentElement('afterend',fields);
    const input=document.getElementById('reelUrl'),video=document.getElementById('reelVideoUrl'),status=document.getElementById('reelLinkStatus');
    function validate(){let error='';status.textContent='';if(input.value.trim()){try{status.textContent='Piattaforma riconosciuta: '+window.digsigReel.parse(input.value).provider}catch(e){error=e.message;status.textContent=error}}input.setCustomValidity(error);video.setCustomValidity(video.value.trim()&&!window.digsigReel.directUrl(video.value)?'Inserisci un URL HTTPS diretto al file video, non il link di una pagina social.':'');input.required=type.value==='reel'&&!video.value.trim()}
    window.digsigReelEditor={
      sync(){const on=type.value==='reel';fields.classList.toggle('hidden',!on);input.disabled=video.disabled=!on;input.required=on;validate()},
      set(w={}){input.value=w.reelUrl||'';video.value=w.reelVideoUrl||'';this.sync()},
      get(){const source=input.value.trim()?window.digsigReel.parse(input.value):{url:'',provider:'Video'};return {reelUrl:source.url,reelProvider:source.provider,reelVideoUrl:window.digsigReel.directUrl(video.value),duration:60}}
    };
    input.addEventListener('input',validate);video.addEventListener('input',validate);window.digsigReelEditor.set();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
