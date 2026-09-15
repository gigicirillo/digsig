(function(){
  const css=document.createElement('style');
  css.textContent='.design-zone-preview>button{display:none!important}.design-zone-preview iframe[src*="drive.google.com/file/d/"]{pointer-events:none!important}';
  document.head.appendChild(css);
  const seen=new WeakSet();
  function driveId(u){const m=String(u||'').match(/drive\.google\.com\/file\/d\/([^/?#]+)/i);return m?m[1]:''}
  function mediaDuration(id){try{const media=(window.config&&config.media)||[];const m=media.find(x=>x&&x.type==='video'&&driveId(x.url)===id);return Math.max(1,Number(m&&m.duration)||60)}catch(e){return 60}}
  function patch(frame){if(!frame||seen.has(frame))return;const id=driveId(frame.src);if(!id)return;seen.add(frame);frame.removeAttribute('allowfullscreen');frame.setAttribute('tabindex','-1');frame.style.pointerEvents='none';frame.style.top='-1px';frame.style.height='calc(100% + 58px)';const zone=frame.closest('.design-zone-preview');if(!zone)return;let mask=zone.querySelector('.lynca-drive-mask');if(!mask){mask=document.createElement('div');mask.className='lynca-drive-mask';mask.style.cssText='position:absolute;left:0;right:0;bottom:0;height:54px;background:#000;z-index:98;pointer-events:none';zone.appendChild(mask)}const delay=mediaDuration(id)*1000;setTimeout(()=>{if(!frame.isConnected)return;const buttons=zone.querySelectorAll(':scope>button');if(buttons.length>1)buttons[buttons.length-1].click()},delay)}
  function scan(root){const s=root&&root.querySelectorAll?root:document;if(s.matches&&s.matches('iframe[src*="drive.google.com/file/d/"]'))patch(s);s.querySelectorAll&&s.querySelectorAll('iframe[src*="drive.google.com/file/d/"]').forEach(patch)}
  const mo=new MutationObserver(rs=>rs.forEach(r=>r.addedNodes&&r.addedNodes.forEach(n=>{if(n.nodeType===1)scan(n)})));
  function init(){scan(document);mo.observe(document.body,{childList:true,subtree:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();