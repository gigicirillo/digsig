(function(){
  function init(){
    const type=document.getElementById('widgetType');if(!type)return;
    type.add(new Option('Reel · Instagram / Facebook / TikTok','reel'));
    const fields=document.createElement('div');fields.id='reelWidgetFields';fields.className='hidden';
    fields.innerHTML='<label>Link del Reel<input id="reelUrl" type="text" placeholder="Incolla il link del video condiviso" autocomplete="off"></label><p id="reelLinkStatus" class="muted" aria-live="polite"></p><p class="muted">Usa un video pubblico con incorporamento consentito. Per i link brevi (es. vm.tiktok.com o facebook.com/share), apri il link nel browser e copia l’indirizzo completo del video.</p><p class="muted">Instagram e Facebook possono richiedere un clic su Play o mostrare un accesso: l’avvio automatico non è garantito. TikTok viene avviato senza audio. Per una TV senza interazione, usa un file video nella sezione Media.</p><p class="muted">In playlist il Reel resta visibile per 60 secondi, oppure per la durata personalizzata. La durata naturale non è rilevabile da tutti i social. Nel box Design con un solo widget rimane visibile.</p>';
    document.getElementById('messageWidgetFields').insertAdjacentElement('afterend',fields);
    const input=document.getElementById('reelUrl'),status=document.getElementById('reelLinkStatus');
    function validate(){let error='';status.textContent='';if(input.value.trim()){try{status.textContent='Piattaforma riconosciuta: '+window.digsigReel.parse(input.value).provider}catch(e){error=e.message;status.textContent=error}}input.setCustomValidity(error)}
    window.digsigReelEditor={
      sync(){const on=type.value==='reel';fields.classList.toggle('hidden',!on);input.disabled=!on;input.required=on;validate()},
      set(w={}){input.value=w.reelUrl||'';this.sync()},
      get(){const source=window.digsigReel.parse(input.value);return {reelUrl:source.url,reelProvider:source.provider,duration:60}}
    };
    input.addEventListener('input',validate);window.digsigReelEditor.set();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
