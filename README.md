# Tidal Cove 🌊

A playable browser-based 3D waterpark prototype with a rideable waterslide, animated wave pool, and 38 animated visitors.

## Play
Once GitHub Pages is enabled, open https://oddlyprompt.github.io/Tidal-code/ from Safari, Chrome, or another WebGL-capable browser.

## GitHub Pages setup
1. In this repository open **Settings → Pages**.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Choose **main**, folder **/(root)**, then **Save**.
4. Wait for Pages to publish and open the URL above.

## Controls
- **Ride slide** starts the waterslide ride camera.
- **Wave pool** enters the pool; toggle waves using the right-hand panel.
- **Explore** uses the on-screen joystick on mobile, or WASD/arrow keys on a keyboard.
- Drag to orbit or look around. **Overview** returns to the park view.
- **Sunset** changes the lighting.

## Implementation
This is a standalone WebGL prototype: no build step and no external JavaScript dependencies. The visitors are stylized procedural figures, not realistic imported 3D models. Browsers require WebGL.

## Troubleshooting
If the page does not start, open it directly in Safari/Chrome (rather than the ChatGPT file viewer) and confirm WebGL is supported. The game displays an error message if WebGL setup fails.
