(function(){
  const DRIVE_HOST_RE=/(^|\.)drive\.google\.com$|(^|\.)drive\.usercontent\.google\.com$/i;
  function driveFileId(raw){const value=String(raw||'').trim();if(!value)return'';try{const u=new URL(value,location.href);if(!DRIVE_HOST_RE.test(u.hostname))return'';const p=u.pathname.match(/\/file\/d\/([^/?#]+)/i);if(p&&p[1])return decodeURIComponent(p[1]);const id=u.searchParams.get('id');if(id)return id}catch(e){}const m=value.match(/drive\.google\.com\/file\/d\/([^/?#]+)/i);return m&&m[1]?m[1]:''}
  function directDriveUrl(raw){const id=driveFileId(raw);return id?'https://drive.usercontent.google.com/download?id='+encodeURIComponent(id)+'&export=download&confirm=t':String(raw||'')}
  function previewDriveUrl(raw){const id=driveFileId(raw);return id?'https://drive.google.com/file/d/'+encodeURIComponent(id)+'/preview':''}
  function replaceVideo(v){if(!v||!v.isConnected)return;const raw=v.getAttribute('src')||v.currentSrc||v.src||'';const id=driveFileId(raw);if(!id||v.dataset.lyncaDrivePatched==='1')return;v.dataset.lyncaDrivePatched='1';const frame=document.createElement('iframe');frame.src=previewDriveUrl(raw)+'?autoplay=1';frame.allow='autoplay; fullscreen';frame.referrerPolicy='no-referrer-when-downgrade';frame.style.cssText=v.style.cssText+';border:0;display:block;background:#000';frame.className=v.className||'';frame.setAttribute('allowfullscreen','');v.replaceWith(frame)}
  function scan(root){const scope=root&&root.querySelectorAll?root:document;if(scope.matches&&scope.matches('video'))replaceVideo(scope);scope.querySelectorAll&&scope.querySelectorAll('video').forEach(replaceVideo)}
  window.lyncaDriveFileId=driveFileId;window.lyncaDriveDirectUrl=directDriveUrl;window.lyncaDrivePreviewUrl=previewDriveUrl;
  const observer=new MutationObserver(rs=>rs.forEach(r=>r.addedNodes&&r.addedNodes.forEach(n=>{if(n.nodeType===1)scan(n)})));
  function init(){scan(document);observer.observe(document.body,{childList:true,subtree:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();