(function(){
  let cycling=false,count=0,total=0,designStarted=false;
  function both(){return !!(screen&&screen.usePlaylists===true&&screen.useDesign!==false&&screen.designId&&items&&items.length)}
  function startDesign(){if(designStarted)return;designStarted=true;cycling=false;try{if(typeof window.lyncaActivateDesign==='function')window.lyncaActivateDesign()}catch(e){console.warn('Design restore',e)}}
  const oldStart=startPlayer;startPlayer=async function(){await oldStart();if(both()){cycling=true;count=0;total=items.length;designStarted=false}else if(screen&&screen.designId)startDesign()};
  const oldNext=next;next=function(){if(cycling&&both()){count++;if(count>=total){startDesign();return}}return oldNext()};
  window.lyncaScreenPlaylistOnce={isCycling:()=>cycling,finish:startDesign};
})();