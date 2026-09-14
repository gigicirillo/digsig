(function(){
  function backgroundValue(o,fallback='#000000'){
    if(!o)return fallback;
    const mode=o.backgroundMode||(o.backgroundTransparent?'transparent':o.backgroundGradient?'gradient':'solid');
    if(mode==='transparent')return'transparent';
    if(mode==='gradient')return`linear-gradient(${Number(o.backgroundAngle)||135}deg,${o.backgroundColor||fallback},${o.backgroundColor2||'#42d9ff'})`;
    return o.backgroundColor||fallback;
  }
  function applyFullScreen(stage){
    try{
      if(typeof items==='undefined'||typeof index==='undefined'||!items?.length)return;
      const item=items[index];if(!item)return;
      stage.style.background=backgroundValue(item,'#000000');
    }catch(e){}
  }
  function applyDesign(stage){
    try{
      if(typeof config==='undefined'||typeof screen==='undefined'||!config||!screen?.designId)return false;
      const d=(config.designs||[]).find(x=>x.id===screen.designId);if(!d)return false;
      stage.style.background=backgroundValue(d,'#000000');
      const els=stage.querySelectorAll(':scope > .design-zone-preview');
      (d.zones||[]).forEach((z,i)=>{
        const el=els[i];if(!el)return;
        el.style.opacity=String(Math.max(0,Math.min(100,Number(z.opacity??100)))/100);
        if(el.dataset.glass!=='1')el.style.background=backgroundValue(z,'#000000');
        if(z.sourceType==='widget'&&z.sourceId){
          const w=(config.widgets||[]).find(x=>x.id===z.sourceId),child=el.firstElementChild;
          if(w&&child)child.style.background=backgroundValue(w,'#101820');
        }
      });
      return true;
    }catch(e){return false}
  }
  function apply(){const stage=document.getElementById('stage');if(!stage)return;if(!applyDesign(stage))applyFullScreen(stage)}
  const stage=document.getElementById('stage');if(stage)new MutationObserver(()=>requestAnimationFrame(apply)).observe(stage,{childList:true,subtree:true,attributes:true,attributeFilter:['style']});setInterval(apply,1200);setTimeout(apply,350);
})();