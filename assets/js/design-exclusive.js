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
  const originalInactive=showInactive;
  showInactive=function(){
    if(screen&&screen.designId&&(screen.useDesign!==false)){
      stage.style.background='#000';
      return;
    }
    return originalInactive();
  };
})();