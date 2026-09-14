(function(){
  const VIDEO_RE=/\.(mp4|webm|ogg|ogv|mov|m4v)(?:[?#].*)?$/i;
  const pending=new WeakSet();

  function tryPlay(v){
    if(!v||!v.isConnected)return;
    v.muted=true;
    v.defaultMuted=true;
    v.autoplay=true;
    v.playsInline=true;
    v.setAttribute('muted','');
    v.setAttribute('autoplay','');
    v.setAttribute('playsinline','');
    v.preload='auto';
    const p=v.play();
    if(p&&typeof p.catch==='function')p.catch(()=>{
      setTimeout(()=>{if(v.isConnected)v.play().catch(()=>{})},500);
      setTimeout(()=>{if(v.isConnected&&v.paused)v.play().catch(()=>{})},1800);
    });
  }

  function prepareVideo(v){
    if(!v||pending.has(v))return;
    pending.add(v);
    v.style.display='block';
    v.addEventListener('loadedmetadata',()=>tryPlay(v));
    v.addEventListener('loadeddata',()=>tryPlay(v));
    v.addEventListener('canplay',()=>tryPlay(v));
    v.addEventListener('pause',()=>{if(v.isConnected&&!v.ended)setTimeout(()=>tryPlay(v),250)});
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
    Array.from(img.attributes).forEach(a=>{
      if(!['src','class','style'].includes(a.name))try{v.setAttribute(a.name,a.value)}catch(e){}
    });
    img.replaceWith(v);
    prepareVideo(v);
  }

  function scan(root){
    const scope=root&&root.querySelectorAll?root:document;
    if(scope.matches&&scope.matches('.design-zone-preview video'))prepareVideo(scope);
    if(scope.matches&&scope.matches('.design-zone-preview img'))replaceVideoImage(scope);
    scope.querySelectorAll?.('.design-zone-preview video').forEach(prepareVideo);
    scope.querySelectorAll?.('.design-zone-preview img').forEach(replaceVideoImage);
  }

  const observer=new MutationObserver(records=>records.forEach(r=>r.addedNodes.forEach(n=>{if(n.nodeType===1)scan(n)})));
  function init(){scan(document);observer.observe(document.body,{childList:true,subtree:true});document.addEventListener('visibilitychange',()=>{if(!document.hidden)document.querySelectorAll('.design-zone-preview video').forEach(tryPlay)});window.addEventListener('focus',()=>document.querySelectorAll('.design-zone-preview video').forEach(tryPlay));setInterval(()=>document.querySelectorAll('.design-zone-preview video').forEach(v=>{if(v.paused&&!v.ended)tryPlay(v)}),5000)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();