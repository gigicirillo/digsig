(function(){
  if(typeof resolve!=='function')return;
  const originalResolve=resolve;
  resolve=function(c){
    originalResolve(c);
    if(screen&&screen.designId&&(screen.useDesign!==false)){
      // The persistent Design owns the base stage. If screen playlists are also
      // enabled, screen-playlist-overlay.js plays them once above the Design.
      // Never let the base player loop those playlists underneath the Design.
      playlists=[];items=[];index=0;
    }
  };
  const originalInactive=showInactive;
  showInactive=function(){
    if(screen&&screen.designId&&(screen.useDesign!==false)){stage.style.background='#000';return}
    return originalInactive();
  };
})();