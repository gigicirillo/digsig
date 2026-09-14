(function(){
  if(typeof resolve!=='function')return;
  const originalResolve=resolve;
  resolve=function(c){
    originalResolve(c);
    if(screen&&screen.designId&&(screen.useDesign!==false)){
      playlists=[];
      items=[];
      index=0;
    }
  };
})();