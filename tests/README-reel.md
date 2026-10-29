# Reel widget

Run `node tests/reel-widget.cjs` to validate accepted URLs, canonical URL round trips and rejected hosts/credentials/short links.

The widget embeds the provider player; it does not extract or download social media files. Public posts must allow embedding. Instagram/Facebook may require interaction or login. TikTok uses the official player with muted autoplay and looping. Provider UI and restrictions remain intact.

Supported URLs: Instagram /reel/, /reels/, /p/, /tv/; TikTok /@user/video/, /share/video/, /player/v1/; Facebook /reel/, /page/videos/, /watch/?v=. Tracking parameters are removed. Short redirect links require opening in a browser and copying the final video URL; the static site has no cross-origin redirect resolver.

Playlist default is 60 seconds; custom widget and per-playlist durations override it. A single widget in a Design box stays visible. Natural duration is not inferred across providers.

Browser regression checked with intercepted config and social iframe responses: create/save/reload/edit settings; invalid link; switching to another widget type disables the URL field; playlist advances after custom duration; single Design widget stays visible. This is not a guarantee that a particular social post will play on every TV.
