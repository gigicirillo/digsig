(function(){
  const VIDEO_RE=/\.(mp4|webm|ogg|ogv|mov|m4v)(?:[?#].*)?$/i;
  const pending=new WeakSet();

  function injectMediaCss(){
    if(document.getElementById('lyncaNoVideoUi'))return;
    const s=document.createElement('style');s.id='lyncaNoVideoUi';s.textContent=`
      video{pointer-events:none!important;-webkit-user-select:none!important;user-select:none!important}
      video::-webkit-media-controls{display:none!important}
      video::-webkit-media-controls-enclosure{display:none!important}
      video::-webkit-media-controls-panel{display:none!important}
      video::-webkit-media-controls-fullscreen-button{display:none!important}
      video::-webkit-media-controls-overlay-play-button{display:none!important}
      video::-webkit-media-controls-start-playback-button{display:none!important}
    `;document.head.appendChild(s);
  }

  function lockVideoUi(v){
    if(!v)return;
    v.controls=false;
    v.removeAttribute('controls');
    v.setAttribute('controlsList','nofullscreen nodownload noremoteplayback');
    v.setAttribute('playsinline','');
    v.setAttribute('webkit-playsinline','');
    v.setAttribute('x5-playsinline','true');
    v.setAttribute('x5-video-player-type','h5');
    v.setAttribute('disablepictureinpicture','');
    v.disablePictureInPicture=true;
    try{v.disableRemotePlayback=true}catch(e){}
    v.tabIndex=-1;
    v.style.pointerEvents='none';
    v.oncontextmenu=()=>false;
    v.ondblclick=e=>{e.preventDefault();e.stopPropagation();return false};
    v.onclick=e=>{e.preventDefault();e.stopPropagation();return false};
    v.addEventListener('webkitbeginfullscreen',e=>{try{e.preventDefault();e.stopPropagation();if(v.webkitExitFullscreen)v.webkitExitFullscreen()}catch(err){}},{capture:true});
  }

  function tryPlay(v){
    if(!v||!v.isConnected)return;
    lockVideoUi(v);
    v.muted=true;
    v.defaultMuted=true;
    v.autoplay=true;
    v.playsInline=true;
    v.setAttribute('muted','');
    v.setAttribute('autoplay','');
    v.preload='auto';
    const p=v.play();
    if(p&&typeof p.catch==='function')p.catch(()=>{
      setTimeout(()=>{if(v.isConnected){lockVideoUi(v);v.play().catch(()=>{})}},500);
      setTimeout(()=>{if(v.isConnected&&v.paused){lockVideoUi(v);v.play().catch(()=>{})}},1800);
    });
  }

  function restartIfStillCurrent(v){
    setTimeout(()=>{
      if(!v||!v.isConnected)return;
      try{v.currentTime=0;tryPlay(v)}catch(e){}
    },650);
  }

  function prepareVideo(v){
    if(!v)return;
    lockVideoUi(v);
    if(pending.has(v))return;
    pending.add(v);
    v.style.display='block';
    v.addEventListener('loadedmetadata',()=>tryPlay(v));
    v.addEventListener('loadeddata',()=>tryPlay(v));
    v.addEventListener('canplay',()=>tryPlay(v));
    v.addEventListener('pause',()=>{if(v.isConnected&&!v.ended)setTimeout(()=>tryPlay(v),250)});
    v.addEventListener('ended',()=>restartIfStillCurrent(v));
    tryPlay(v);
  }

  function replaceVideoImage(img){
    if(!img||img.dataset.lyncaVideoReplaced==='1')return;
    const src=String(img.currentSrc||img.src||'');
    if(!VIDEO_RE.test(src))return;
    img.dataset.lyncaVideoReplaced='1';
    const v=document.createElement('video');
    v.src=src;
    v.className=img.className;
    v.style.cssText=img.style.cssText;
    v.style.objectFit=img.style.objectFit||'contain';
    Array.from(img.attributes).forEach(a=>{if(!['src','class','style'].includes(a.name))try{v.setAttribute(a.name,a.value)}catch(e){}});
    img.replaceWith(v);
    prepareVideo(v);
  }

  function scan(root){
    const scope=root&&root.querySelectorAll?root:document;
    if(scope.matches&&scope.matches('video'))prepareVideo(scope);
    if(scope.matches&&scope.matches('.design-zone-preview img'))replaceVideoImage(scope);
    scope.querySelectorAll?.('video').forEach(prepareVideo);
    scope.querySelectorAll?.('.design-zone-preview img').forEach(replaceVideoImage);
  }

  const observer=new MutationObserver(records=>records.forEach(r=>r.addedNodes.forEach(n=>{if(n.nodeType===1)scan(n)})));
  function init(){
    injectMediaCss();
    scan(document);
    observer.observe(document.body,{childList:true,subtree:true});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)document.querySelectorAll('video').forEach(tryPlay)});
    window.addEventListener('focus',()=>document.querySelectorAll('video').forEach(tryPlay));
    setInterval(()=>document.querySelectorAll('video').forEach(v=>{lockVideoUi(v);if(v.paused&&!v.ended)tryPlay(v)}),5000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();