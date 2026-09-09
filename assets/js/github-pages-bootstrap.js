(function(){
  function validConfig(c){return c&&Array.isArray(c.screens)&&Array.isArray(c.playlists)&&Array.isArray(c.media)}
  try{
    var raw=localStorage.getItem('digsig-config');
    if(raw){var parsed=JSON.parse(raw);if(!validConfig(parsed))localStorage.removeItem('digsig-config')}
  }catch(e){try{localStorage.removeItem('digsig-config')}catch(_){} }

  var isGithubPages=/\.github\.io$/i.test(location.hostname);
  if(isGithubPages&&window.fetch){
    var nativeFetch=window.fetch.bind(window);
    window.fetch=function(input,init){
      var url=typeof input==='string'?input:(input&&input.url)||'';
      if(/(^|\/)api\/.*\.php(?:[?#]|$)/i.test(url)){
        return Promise.reject(new Error('PHP API unavailable on GitHub Pages'));
      }
      return nativeFetch(input,init);
    };
  }

  window.__digsigBootstrapReady=true;
})();