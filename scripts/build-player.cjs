const fs=require('fs'),path=require('path'),crypto=require('crypto');
const babel=require('@babel/core'),esbuild=require('esbuild'),acorn=require('acorn');
process.chdir(path.join(__dirname,'..'));
const template=fs.readFileSync('scripts/player.template.html','utf8');
const tags=[...template.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)];
const sources=tags.map(([tag,inline])=>{const match=tag.match(/src="([^"?]+)/);return match?fs.readFileSync(match[1],'utf8'):inline;});
// Keep shared player bindings inside one scope, including `screen` (a native window property).
const app=babel.transformSync('(function(){\n'+sources.join('\n;\n')+'\n})();',{presets:[['@babel/preset-env',{targets:{ie:'11'},modules:false}]],comments:false,compact:true}).code;
const polyfills=esbuild.buildSync({entryPoints:['scripts/player-polyfills.js'],bundle:true,write:false,format:'iife',target:'es5',minify:true}).outputFiles[0].text;
const output=polyfills+'\n'+app+'\n';
acorn.parse(output,{ecmaVersion:5});
fs.writeFileSync('assets/js/player-tv.js',output);
const hash=crypto.createHash('sha256').update(output).digest('hex').slice(0,12);
const html=template.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').replace('</body>','<script src="assets/js/player-tv.js?v='+hash+'"></script></body>');
fs.writeFileSync('player.html',html);
console.log('Built ES5 TV player ('+output.length+' bytes), syntax verified.');
