/* Official RDS stream URLs verified on https://www.rds.it/rds-social-tv (2026-10-16). */
(function(){
  const presets={
    skyTG24:{label:'Sky TG24 · telegiornale in diretta',mode:'video',url:'https://video.sky.it/api/v1/getLivestream?id=1',resolver:'sky'},
    rdsRadio:{label:'RDS Radio',mode:'audio',url:'https://stream.rds.radio/audio/rds.stream_aac/playlist.m3u8'},
    rdsTV:{label:'RDS Social TV',mode:'video',url:'https://stream.rdstv.radio/index.m3u8'}
  };
  function safeUrl(raw){try{const u=new URL(String(raw||'').trim());return u.protocol==='https:'&&!u.username&&!u.password?u.href:''}catch(e){return ''}}
  function source(w){const p=presets[w.livePreset];return p||{label:w.name||'Diretta',mode:['audio','embed'].includes(w.liveMode)?w.liveMode:'video',url:safeUrl(w.liveUrl)}}
  let loading;
  function loadHls(){if(window.Hls)return Promise.resolve(window.Hls);if(loading)return loading;loading=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='assets/vendor/hls.min.js?v=1';s.onload=()=>window.Hls?resolve(window.Hls):reject(new Error('Lettore non disponibile'));s.onerror=()=>{loading=null;s.remove();reject(new Error('Lettore non disponibile'))};document.head.appendChild(s)});return loading}
  const active=new Set();
  new MutationObserver(()=>active.forEach(item=>{if(!item.box.isConnected){item.dispose();active.delete(item)}})).observe(document.documentElement,{childList:true,subtree:true});
  function render(target,w){
    const src=source(w),box=document.createElement('div');box.className='live-widget live-'+src.mode;target.replaceChildren(box);
    if(!src.url){box.textContent='Inserisci un URL HTTPS valido per la diretta.';return}
    if(src.mode==='embed'){
      const frame=document.createElement('iframe');frame.src=src.url;frame.title=w.name||'Diretta TV / Radio';frame.allow='autoplay; fullscreen; encrypted-media';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';frame.setAttribute('sandbox','allow-scripts allow-same-origin allow-presentation');box.appendChild(frame);return;
    }
    let disposed=false,hls=null,controller=null,requestTimeout=null,retry=null,attempt=0,generation=0,wantedAudio=w.liveAudio===true,lastTime=-1,lastProgress=Date.now(),blocked=false;
    const media=document.createElement(src.mode==='audio'?'audio':'video');media.autoplay=true;media.muted=!wantedAudio;media.playsInline=true;media.setAttribute('playsinline','');media.preload='auto';media.controls=false;box.appendChild(media);
    if(src.mode==='audio'){
      const card=document.createElement('div');card.className='live-radio-card';
      const logo=safeUrl(w.liveLogo);if(logo){const img=document.createElement('img');img.src=logo;img.alt='';img.onerror=()=>img.remove();card.appendChild(img)}
      const icon=document.createElement('div');icon.className='live-radio-symbol';icon.textContent='♫';card.appendChild(icon);
      const name=document.createElement('strong');name.textContent=w.name||src.label;card.appendChild(name);const caption=document.createElement('span');caption.textContent='RADIO · DIRETTA';card.appendChild(caption);box.appendChild(card);
    }
    const status=document.createElement('div');status.className='live-status';status.setAttribute('role','status');status.textContent='Collegamento alla diretta…';box.appendChild(status);
    const audio=document.createElement('button');audio.type='button';audio.className='live-audio-button';box.appendChild(audio);
    function audioLabel(){audio.textContent=blocked?'▶ Avvia diretta':media.muted?'Attiva audio':'Disattiva audio';audio.setAttribute('aria-label',audio.textContent)}
    function play(){if(disposed)return;const result=media.play();if(result&&result.catch)result.catch(e=>{if(disposed||e.name==='AbortError')return;if(e.name==='NotAllowedError'){blocked=true;status.textContent='Premi Avvia diretta per consentire la riproduzione.';status.hidden=false;audioLabel()}else schedule()})}
    audio.onclick=()=>{wantedAudio=blocked?true:media.muted;media.muted=!wantedAudio;blocked=false;audioLabel();play()};audioLabel();
    function stop(){if(hls){hls.destroy();hls=null}media.pause();media.removeAttribute('src');media.load()}
    function schedule(){if(disposed||retry)return;status.textContent='Diretta non disponibile. Riconnessione in corso…';status.hidden=false;retry=setTimeout(()=>{retry=null;connect()},Math.min(30000,3000*Math.pow(2,attempt++)))}
    function connect(){
      if(disposed)return;const token=++generation;stop();if(controller)controller.abort();clearTimeout(requestTimeout);lastProgress=Date.now();media.muted=!wantedAudio;
      function open(url){if(disposed||token!==generation)return;
      const isHls=/\.m3u8(?:[?#]|$)/i.test(url);
      if(!isHls){media.src=url;play();return}
      loadHls().then(Hls=>{if(disposed||token!==generation)return;if(!Hls.isSupported()){if(media.canPlayType('application/vnd.apple.mpegurl')){media.src=url;play()}else status.textContent='Questo browser non supporta il formato della diretta.';return}hls=new Hls({enableWorker:false,maxBufferLength:20,backBufferLength:10});hls.on(Hls.Events.MANIFEST_PARSED,play);hls.on(Hls.Events.ERROR,(event,data)=>{if(data.fatal)schedule()});hls.loadSource(url);hls.attachMedia(media)}).catch(schedule);
      }
      if(src.resolver==='sky'){controller=new AbortController();requestTimeout=setTimeout(()=>controller.abort(),15000);fetch(src.url,{signal:controller.signal,credentials:'omit',cache:'no-cache'}).then(response=>{if(!response.ok)throw new Error('Diretta non disponibile');return response.json()}).then(data=>{if(disposed||token!==generation)return;clearTimeout(requestTimeout);const url=safeUrl(data.streaming_url);if(!url||data.currentStatus!==1)throw new Error('Diretta non disponibile');open(url)}).catch(()=>{if(!disposed&&token===generation){clearTimeout(requestTimeout);schedule()}})}else open(src.url);
    }
    media.addEventListener('playing',()=>{blocked=false;clearTimeout(retry);retry=null;status.hidden=true;attempt=0;lastProgress=Date.now();audioLabel()});media.addEventListener('error',schedule);media.addEventListener('ended',schedule);
    const watchdog=setInterval(()=>{if(disposed||blocked)return;if(media.currentTime!==lastTime){lastTime=media.currentTime;lastProgress=Date.now()}else if(Date.now()-lastProgress>30000)schedule()},5000);
    active.add({box,dispose(){disposed=true;generation++;if(controller)controller.abort();clearTimeout(requestTimeout);clearTimeout(retry);clearInterval(watchdog);media.removeEventListener('error',schedule);media.removeEventListener('ended',schedule);stop()}});
    connect();
  }
  window.digsigLive={presets,safeUrl,source,render};
})();
