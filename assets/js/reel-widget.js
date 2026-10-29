(function(){
  // Only construct embeds from recognised public video URLs, never arbitrary HTML.
  function parse(value){
    const match=String(value||'').match(/https:\/\/[^\s<>"']+/i);
    if(!match)throw new Error('Incolla il link HTTPS del Reel.');
    let u;try{u=new URL(match[0])}catch(e){throw new Error('Link non valido.')}
    if(u.username||u.password||u.port)throw new Error('Link non valido.');
    const host=u.hostname.toLowerCase().replace(/^www\./,''),path=u.pathname;
    let m;
    if(host==='instagram.com'){
      m=path.match(/^\/(reel|reels|p|tv)\/([\w-]+)\/?$/);
      if(m)return {provider:'Instagram',url:'https://www.instagram.com/'+(m[1]==='reels'?'reel':m[1])+'/'+m[2]+'/',embed:'https://www.instagram.com/'+(m[1]==='reels'?'reel':m[1])+'/'+m[2]+'/embed/'};
    }
    if(host==='tiktok.com'||host==='m.tiktok.com'){
      m=path.match(/^\/(?:@[^/]+\/video|player\/v1|share\/video)\/(\d+)\/?$/);
      if(m)return {provider:'TikTok',url:'https://www.tiktok.com/player/v1/'+m[1],embed:'https://www.tiktok.com/player/v1/'+m[1]+'?autoplay=1&loop=1&force_muted=1&controls=1&description=0&music_info=0'};
    }
    if(host==='facebook.com'||host==='m.facebook.com'||host==='web.facebook.com'){
      m=path.match(/^\/reel\/(\d+)\/?$/)||path.match(/^\/[^/]+\/videos\/(\d+)\/?$/);
      const id=m?m[1]:/^\/watch\/?$/.test(path)&&/^\d+$/.test(u.searchParams.get('v')||'')?u.searchParams.get('v'):null;
      if(id){const url='https://www.facebook.com/watch/?v='+id;return {provider:'Facebook',url,embed:'https://www.facebook.com/plugins/video.php?href='+encodeURIComponent(url)+'&show_text=false&autoplay=true&mute=true&allowfullscreen=true'}}
    }
    if(/^(?:vm\.tiktok\.com|vt\.tiktok\.com|tiktok\.com|instagram\.com|facebook\.com|m\.facebook\.com|fb\.watch)$/.test(host))throw new Error('Questo è un link breve o di condivisione: aprilo nel browser e copia l’indirizzo completo del singolo video (Reel o /video/).');
    throw new Error('Usa il link di un singolo video Instagram, Facebook o TikTok.');
  }
  function directUrl(value){
    try{const u=new URL(String(value||'').trim());if(u.protocol!=='https:'||u.username||u.password)return '';if(/(^|\.)(instagram\.com|facebook\.com|tiktok\.com|youtube\.com|youtu\.be|fb\.watch)$/.test(u.hostname))return '';return u.href}catch(e){return ''}
  }
  function render(target,w){
    target.innerHTML='';
    const box=document.createElement('div');box.style.cssText='width:100%;height:100%;display:flex;align-items:center;justify-content:center;overflow:hidden;background:transparent';target.appendChild(box);
    try{
      if(w.reelVideoUrl){
        const url=directUrl(w.reelVideoUrl);if(!url)throw new Error('URL del file video non valido.');
        const video=document.createElement('video');video.autoplay=true;video.muted=true;video.defaultMuted=true;video.loop=true;video.playsInline=true;video.preload='auto';video.setAttribute('muted','');video.setAttribute('playsinline','');video.style.cssText='width:100%;height:100%;object-fit:contain;background:transparent';
        video.src=url;box.appendChild(video);
        video.onerror=()=>{box.textContent='Video non disponibile: verifica il link diretto al file nelle impostazioni del Reel.';box.style.color='#fff'};
        const start=()=>{if(!video.isConnected)return;const promise=video.play();if(promise&&promise.catch)promise.catch(()=>{if(!box.contains(video)||box.querySelector('button'))return;const retry=document.createElement('button');retry.textContent='Avvia Reel';retry.style.cssText='position:absolute;z-index:2;padding:12px';retry.onclick=()=>{video.play().then(()=>retry.remove()).catch(()=>{})};box.appendChild(retry)})};
        video.addEventListener('canplay',start,{once:true});start();const observer=new MutationObserver(()=>{if(video.isConnected)return;observer.disconnect();video.onerror=null;video.pause();video.removeAttribute('src');video.load()});observer.observe(document.body,{childList:true,subtree:true});return;
      }
      const source=parse(w.reelUrl),frame=document.createElement('iframe');
      frame.title='Reel '+source.provider;frame.src=source.embed;frame.allow='autoplay; fullscreen; encrypted-media; picture-in-picture';frame.setAttribute('allowfullscreen','');frame.referrerPolicy='strict-origin-when-cross-origin';frame.style.cssText='display:block;width:100%;height:100%;border:0;background:#000;max-width:100%';
      box.appendChild(frame);
    }catch(e){box.textContent=e.message;box.style.color='#fff';box.style.padding='16px';box.style.boxSizing='border-box'}
  }
  window.digsigReel={parse,render,directUrl};
})();
