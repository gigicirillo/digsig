(function(){
  function applyGlass(){
    try{
      if(typeof config==='undefined'||typeof screen==='undefined'||!config||!screen||!screen.designId)return;
      const d=(config.designs||[]).find(x=>x.id===screen.designId);if(!d)return;
      const els=document.querySelectorAll('#stage>.design-zone-preview');
      (d.zones||[]).forEach((z,i)=>{const el=els[i];if(!el)return;if(z.glass){el.style.background='rgba(7,24,36,.52)';el.style.backdropFilter='blur(18px) saturate(125%)';el.style.webkitBackdropFilter='blur(18px) saturate(125%)';el.style.border='1px solid '+(z.borderColor||'rgba(66,217,255,.28)');el.style.boxShadow='0 10px 28px rgba(0,0,0,.22), inset 0 1px 0 rgba(255,255,255,.035)'}else{el.style.backdropFilter='';el.style.webkitBackdropFilter='';el.style.border='';el.style.boxShadow=''}})
    }catch(e){}
  }
  const stage=document.getElementById('stage');if(stage)new MutationObserver(()=>requestAnimationFrame(applyGlass)).observe(stage,{childList:true,subtree:false});
  setInterval(applyGlass,2000);setTimeout(applyGlass,800);
})();