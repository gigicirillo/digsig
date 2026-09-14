(function(){
  const DRIVE_HOST_RE=/(^|\.)drive\.google\.com$|(^|\.)drive\.usercontent\.google\.com$/i;
  const seen=new WeakMap();

  function driveFileId(raw){
    const value=String(raw||'').trim();
    if(!value)return'';
    try{
      const u=new URL(value,location.href);
      if(!DRIVE_HOST_RE.test(u.hostname))return'';
      const pathMatch=u.pathname.match(/\/file\/d\/([^/?#]+)/i);
      if(pathMatch&&pathMatch[1])return decodeURIComponent(pathMatch[1]);
      const id=u.searchParams.get('id');
      if(id)return id;
      const openMatch=u.pathname.match(/\/open\/([^/?#]+)/i);
      if(openMatch&&openMatch[1])return decodeURIComponent(openMatch[1]);
    }catch(e){}
    const m=value.match(/drive\.google\.com\/file\/d\/([^/?#]+)/i);
    return m&&m[1]?m[1]:'';
  }

  function directDriveUrl(raw){
    const id=driveFileId(raw);
    if(!id)return String(raw||'');
    return 'https://drive.google.com/uc?export=download&id='+encodeURIComponent(id);
  }

  function patchVideo(v){
    if(!v||!v.isConnected)return;
    const raw=v.getAttribute('src')||v.currentSrc||v.src||'';
    const direct=directDriveUrl(raw);
    if(!direct||direct===raw)return;
    if(seen.get(v)===direct)return;
    seen.set(v,direct);
    try{
      v.pause();
      v.src=direct;
      v.setAttribute('src',direct);
      v.preload='auto';
      v.load();
      const p=v.play();
      if(p&&typeof p.catch==='function')p.catch(()=>{});
    }catch(e){}
  }

  function scan(root){
    const scope=root&&root.querySelectorAll?root:document;
    if(scope.matches&&scope.matches('video'))patchVideo(scope);
    scope.querySelectorAll?.('video').forEach(patchVideo);
  }

  window.lyncaDriveFileId=driveFileId;
  window.lyncaDriveDirectUrl=directDriveUrl;

  const observer=new MutationObserver(records=>records.forEach(r=>{
    if(r.type==='attributes'&&r.target&&r.target.tagName==='VIDEO')patchVideo(r.target);
    r.addedNodes&&r.addedNodes.forEach(n=>{if(n.nodeType===1)scan(n)});
  }));

  function init(){
    scan(document);
    observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();