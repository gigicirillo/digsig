(function(){
  function readBg(el){
    if(!el)return'';
    const inline=el.style&&(el.style.backgroundColor||el.style.background);
    if(inline&&inline!=='transparent'&&inline!=='rgba(0, 0, 0, 0)')return inline;
    try{const c=getComputedStyle(el).backgroundColor;return c&&c!=='transparent'&&c!=='rgba(0, 0, 0, 0)'?c:''}catch(e){return''}
  }
  function apply(){
    const stage=document.getElementById('stage');if(!stage)return;
    const direct=Array.from(stage.children).filter(el=>!el.classList.contains('boot')&&!el.classList.contains('error'));
    direct.forEach(el=>{
      if(el.classList.contains('design-zone-preview')){
        const child=el.firstElementChild;
        const bg=readBg(child);
        if(bg&&el.dataset.glass!=='1')el.style.background=bg;
      }else{
        const bg=readBg(el);
        if(bg)stage.style.background=bg;
      }
    });
  }
  const stage=document.getElementById('stage');
  if(stage)new MutationObserver(()=>requestAnimationFrame(apply)).observe(stage,{childList:true,subtree:true,attributes:true,attributeFilter:['style']});
  setInterval(apply,1500);
  setTimeout(apply,400);
})();