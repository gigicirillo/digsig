const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const sandbox={window:{},URL};vm.runInNewContext(fs.readFileSync('assets/js/reel-widget.js','utf8'),sandbox);
const parse=sandbox.window.digsigReel.parse;
for(const [url,provider] of [
 ['https://www.instagram.com/reel/ABC_def-123/?igsh=tracking','Instagram'],
 ['Guarda https://www.tiktok.com/@utente/video/6718335390845095173?_t=1','TikTok'],
 ['https://www.facebook.com/reel/123456789/','Facebook'],
 ['https://m.facebook.com/watch/?v=123456789','Facebook'],
 ['https://www.facebook.com/pagina/videos/123456789/','Facebook']
]){const result=parse(url);assert.equal(result.provider,provider);assert.ok(result.embed.startsWith('https://'));assert.equal(parse(result.url).embed,result.embed)}
for(const url of ['javascript:alert(1)','https://instagram.com.evil.test/reel/123/','https://evil.test/?url=https://instagram.com/reel/123/','https://user:pass@instagram.com/reel/123/','https://www.instagram.com/username/','https://vm.tiktok.com/ABC/','https://www.facebook.com/share/r/ABC/'])assert.throws(()=>parse(url));
console.log('Reel URL validation and canonical round trips passed');

const direct=sandbox.window.digsigReel.directUrl;
assert.equal(direct('https://cdn.example.com/reel.mp4'),'https://cdn.example.com/reel.mp4');
for(const url of ['http://cdn.example.com/v.mp4','javascript:alert(1)','https://user:pass@cdn.example.com/v.mp4','https://www.instagram.com/reel/test/','https://www.tiktok.com/@u/video/123'])assert.equal(direct(url),'');
console.log('Autoplay direct-video URL validation passed');
