# TV player build

The TV player runs on older browser engines that cannot parse async functions,
optional chaining, or other modern JavaScript. `player.html` and
`assets/js/player-tv.js` are generated and committed for GitHub Pages.

After changing any player script or the player markup:

1. Edit the original scripts in `assets/js/` or `scripts/player.template.html`.
2. Run `npm ci` and `npm run build:player`.
3. Commit the generated player alongside the sources.

The build preserves script order, uses a shared private scope to avoid overwriting
native `window.screen`, and validates the entire output using the ES5 grammar.
The bundle includes local polyfills for standard JavaScript, fetch, abort,
ResizeObserver, and the DOM methods used by the player. No CDN is required.

ES5 parsing and browser smoke tests do not replace testing on physical TV hardware;
TLS, codecs and CSS support still depend on the device.
