(function(){
  let ready=false,currentId='',cfg={visible:true,enabled:true,x:96,y:5},drag=null;
  const $=id=>document.getElementById(id);
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,Number(n)));
  function defaults(){return{visible:true,enabled:true,x:96,y:5}}
  function findDesign(){
    if(!window.state||!state.config||!Array.isArray(state.config.designs))return null;
    if(currentId){const d=state.config.designs.find(x=>x.id===currentId);if(d)return d}
    const name=String($('designName')?.value||'').trim();
    const same=state.config.designs.filter(d=>String(d.name||'').trim()===name);
    return same.length?same[same.length-1]:null;
  }
  function readFromDesign(d){const v=d&&d.fullscreenButton||{};cfg={...defaults(),...v};cfg.x=clamp(cfg.x,-20,120);cfg.y=clamp(cfg.y,-20,120);cfg.visible=cfg.visible!==false;cfg.enabled=cfg.enabled!==false}
  function injectStyle(){if($('fullscreenDesignStyle'))return;const s=document.createElement('style');s.id='fullscreenDesignStyle';s.textContent=`
    .fs-design-controls{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:10px 0 12px;padding:9px 10px;border:1px solid rgba(66,217,255,.14);border-radius:12px;background:rgba(5,18,28,.38)}
    .fs-design-controls strong{font-size:12px;color:#dff8ff}.fs-design-controls label{display:flex;flex-direction:row;align-items:center;gap:6px;margin:0;font-size:12px;color:var(--muted)}
    .fs-design-controls input[type=checkbox]{width:auto;margin:0}.fs-design-controls input[type=number]{width:70px;padding:7px 8px}
    .design-fs-handle{position:absolute;z-index:999;width:34px;height:34px;border:1px solid rgba(66,217,255,.72);border-radius:9px;background:rgba(5,18,28,.72);display:grid;place-items:center;cursor:grab;box-shadow:0 0 14px rgba(66,217,255,.16);transform:translate(-50%,-50%);color:#fff;user-select:none;touch-action:none}
    .design-fs-handle:active{cursor:grabbing}.design-fs-handle.disabled{opacity:.4}.design-fs-handle.hidden-player{border-style:dashed;opacity:.3}.design-fs-handle svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:1.8}
  `;document.head.appendChild(s)}
  function ensureUI(){
    const toolbar=$('designName')?.closest('.design-toolbar'),canvas=$('designCanvas');if(!toolbar||!canvas)return false;
    injectStyle();
    if(!$('fullscreenDesignControls')){
      const row=document.createElement('div');row.id='fullscreenDesignControls';row.className='fs-design-controls';row.innerHTML=`<strong>Tasto fullscreen</strong><label><input id="fsDesignVisible" type="checkbox" checked> Visibile</label><label><input id="fsDesignEnabled" type="checkbox" checked> Attivo</label><label>X % <input id="fsDesignX" type="number" min="-20" max="120" step="0.1" value="96"></label><label>Y % <input id="fsDesignY" type="number" min="-20" max="120" step="0.1" value="5"></label><span class="muted" style="font-size:11px">Puoi trascinare l'icona direttamente nel canvas.</span>`;
      toolbar.insertAdjacentElement('afterend',row);
      ['fsDesignVisible','fsDesignEnabled'].forEach(id=>$(id).addEventListener('change',fromUI));
      ['fsDesignX','fsDesignY'].forEach(id=>$(id).addEventListener('input',fromUI));
    }
    if(!$('designFullscreenHandle')){
      const h=document.createElement('div');h.id='designFullscreenHandle';h.className='design-fs-handle';h.title='Tasto fullscreen';h.innerHTML='<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="5.5"></circle><path d="M15 15l5 5"></path></svg>';
      canvas.appendChild(h);h.addEventListener('pointerdown',startDrag);
    }
    return true;
  }
  function fromUI(){cfg.visible=$('fsDesignVisible').checked;cfg.enabled=$('fsDesignEnabled').checked;cfg.x=clamp($('fsDesignX').value,-20,120);cfg.y=clamp($('fsDesignY').value,-20,120);renderHandle()}
  function toUI(){if(!$('fsDesignVisible'))return;$('fsDesignVisible').checked=cfg.visible;$('fsDesignEnabled').checked=cfg.enabled;$('fsDesignX').value=cfg.x;$('fsDesignY').value=cfg.y;renderHandle()}
  function renderHandle(){const h=$('designFullscreenHandle');if(!h)return;h.style.left=cfg.x+'%';h.style.top=cfg.y+'%';h.classList.toggle('disabled',!cfg.enabled);h.classList.toggle('hidden-player',!cfg.visible)}
  function startDrag(e){e.preventDefault();e.stopPropagation();const c=$('designCanvas')?.getBoundingClientRect();if(!c)return;drag={rect:c};e.currentTarget.setPointerCapture?.(e.pointerId)}
  function moveDrag(e){if(!drag)return;cfg.x=clamp((e.clientX-drag.rect.left)/drag.rect.width*100,-20,120);cfg.y=clamp((e.clientY-drag.rect.top)/drag.rect.height*100,-20,120);toUI()}
  function endDrag(){drag=null}
  function applyToSaved(){const d=findDesign();if(!d)return;d.fullscreenButton={visible:cfg.visible,enabled:cfg.enabled,x:cfg.x,y:cfg.y};currentId=d.id;if(typeof saveConfig==='function')saveConfig('Design salvato').catch(()=>{})}
  function wrapActions(){
    if(window.__editDesign&&!window.__editDesign.__fsWrapped){const orig=window.__editDesign;const w=function(id){currentId=id;const r=orig(id);setTimeout(()=>{readFromDesign(state.config.designs.find(d=>d.id===id));ensureUI();toUI()},0);return r};w.__fsWrapped=true;window.__editDesign=w}
    const n=$('newDesignBtn');if(n&&!n.dataset.fsHook){n.dataset.fsHook='1';n.addEventListener('click',()=>{currentId='';cfg=defaults();setTimeout(()=>{ensureUI();toUI()},0)})}
    const g=$('gymPresetBtn');if(g&&!g.dataset.fsHook){g.dataset.fsHook='1';g.addEventListener('click',()=>{currentId='';cfg=defaults();setTimeout(()=>{ensureUI();toUI()},0)})}
    const s=$('saveDesignBtn');if(s&&!s.dataset.fsHook){s.dataset.fsHook='1';s.addEventListener('click',()=>setTimeout(applyToSaved,40))}
  }
  function init(){if(!ensureUI()){setTimeout(init,120);return}if(!ready){ready=true;window.addEventListener('pointermove',moveDrag);window.addEventListener('pointerup',endDrag);window.addEventListener('pointercancel',endDrag)}wrapActions();const d=findDesign();if(d){currentId=d.id;readFromDesign(d)}toUI();setInterval(()=>{ensureUI();wrapActions()},700)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();