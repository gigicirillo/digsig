/* Opt-in per design; keep the control outside the stage so content refreshes cannot restore it. */
(function(){
  let used=false,pending=false;
  const button=document.createElement('button'),status=document.createElement('div');
  button.id='fullscreenBtn';button.type='button';button.textContent='⛶ Schermo intero';button.setAttribute('aria-label','Visualizza il layout a schermo intero');
  button.style.cssText='position:fixed;right:18px;top:18px;z-index:2147483647;padding:14px 18px;border:1px solid #42d9ff;border-radius:10px;background:#092331;color:#fff;font:600 16px Arial,sans-serif;cursor:pointer;display:none';
  status.setAttribute('role','status');status.style.cssText='position:fixed;right:18px;top:78px;z-index:2147483647;max-width:330px;background:#092331;color:white;font:16px Arial;padding:12px;display:none';
  document.body.appendChild(button);document.body.appendChild(status);
  function isFullscreen(){return document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullscreenElement;}
  function completed(){if(!pending)return;pending=false;used=true;button.style.display='none';status.style.display='none';}
  function failed(){pending=false;button.disabled=false;status.textContent='Il browser non ha attivato lo schermo intero. Riprova o usa il comando schermo intero del browser.';status.style.display='block';}
  function update(){
    if(pending&&isFullscreen())completed();
    const d=typeof config!=='undefined'&&typeof screen!=='undefined'&&config&&screen&&screen.useDesign!==false&&(config.designs||[]).find(x=>x.id===screen.designId);
    const visible=!used&&!isFullscreen()&&d&&d.fullscreenButton&&d.fullscreenButton.visible===true&&d.fullscreenButton.enabled!==false;
    button.style.display=visible?'block':'none';if(!visible)status.style.display='none';
  }
  button.addEventListener('click',()=>{
    if(pending||used)return;
    const root=document.documentElement,request=root.requestFullscreen||root.webkitRequestFullscreen||root.webkitRequestFullScreen||root.mozRequestFullScreen||root.msRequestFullscreen;
    if(!request){failed();return}
    pending=true;button.disabled=true;
    try{const result=request.call(root);if(result&&typeof result.then==='function')result.then(completed,failed);setTimeout(()=>{if(pending){if(isFullscreen())completed();else failed()}},2000)}catch(e){failed()}
  });
  ['fullscreenchange','webkitfullscreenchange','mozfullscreenchange','MSFullscreenChange'].forEach(event=>document.addEventListener(event,()=>{if(isFullscreen())completed();update()}));
  setInterval(update,500);update();
})();
