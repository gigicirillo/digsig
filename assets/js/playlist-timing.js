(function(){
  function key(ref){if(ref&&typeof ref==='object')return (ref.kind||ref.type)==='widget'?'widget:'+ref.id:String(ref.id||'');return String(ref||'').replace(/^media:/,'')}
  function apply(entry,playlist,ref){if(!entry)return null;const n=Number(playlist?.itemDurations?.[key(ref)]);if(!Number.isFinite(n)||n<1||n>86400)return entry;return {...entry,data:{...entry.data,duration:n,customDuration:true,playlistDurationOverride:true}}}
  window.digsigPlaylistTiming={key,apply};
})();
