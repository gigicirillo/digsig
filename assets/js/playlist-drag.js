(function(){
  let drag=null,raf=0;
  function clearMarks(){document.querySelectorAll('#playlistMediaChoices .sort-item').forEach(row=>row.classList.remove('drop-before','drop-after'))}
  function target(){
    clearMarks();drag.target=null;
    const bounds=drag.box.getBoundingClientRect();if(drag.x<bounds.left||drag.x>bounds.right||drag.y<bounds.top-30||drag.y>bounds.bottom+30)return;
    const rows=Array.from(drag.box.querySelectorAll('.sort-item.active')).filter(row=>row.dataset.id!==drag.id);if(!rows.length)return;
    let row=rows.find(r=>drag.y<r.getBoundingClientRect().bottom)||rows[rows.length-1];
    const rect=row.getBoundingClientRect(),before=drag.y<rect.top+rect.height/2;row.classList.add(before?'drop-before':'drop-after');drag.target={id:row.dataset.id,before};
  }
  function tick(){if(!drag||!drag.moved)return;const r=drag.box.getBoundingClientRect();if(drag.y<r.top+36)drag.box.scrollTop-=10;else if(drag.y>r.bottom-36)drag.box.scrollTop+=10;target();raf=requestAnimationFrame(tick)}
  function finish(commit){
    if(!drag)return;cancelAnimationFrame(raf);const d=drag;drag=null;clearMarks();d.row.classList.remove('dragging');document.body.classList.remove('playlist-dragging');
    if(commit&&d.moved&&d.target){const order=state.playlistOrder.filter(id=>id!==d.id),index=order.indexOf(d.target.id);if(index>=0){order.splice(index+(d.target.before?0:1),0,d.id);state.playlistOrder=order;window.lyncaRenderPlaylistMixed();const moved=document.querySelector('#playlistMediaChoices .sort-item[data-id="'+CSS.escape(d.id)+'"]');moved?.scrollIntoView({block:'nearest'})}}
  }
  document.addEventListener('pointerdown',e=>{const handle=e.target.closest('.playlist-drag-handle');if(!handle||e.button!==0||drag)return;const row=handle.closest('.sort-item.active');if(!row)return;drag={id:row.dataset.id,row,box:row.parentElement,pointer:e.pointerId,startX:e.clientX,startY:e.clientY,x:e.clientX,y:e.clientY,moved:false,target:null};handle.setPointerCapture(e.pointerId);e.preventDefault()});
  document.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.pointer)return;drag.x=e.clientX;drag.y=e.clientY;if(!drag.moved&&Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>5){drag.moved=true;drag.row.classList.add('dragging');document.body.classList.add('playlist-dragging');tick()}if(drag.moved)e.preventDefault()});
  document.addEventListener('pointerup',e=>{if(drag&&e.pointerId===drag.pointer)finish(true)});
  document.addEventListener('pointercancel',()=>finish(false));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')finish(false)});
})();
