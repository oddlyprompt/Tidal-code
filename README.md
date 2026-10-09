# Tidal Cove

An explorable Three.js waterpark, deployed directly from the root of `main` through GitHub Pages.

**Play:** https://oddlyprompt.github.io/Tidal-code/

## Playing

Choose **Enter the cove**. The warm-colored promenade runs west from the arrival area to the switchback stair tower. Climb on foot to the marked decks. Ride activation appears only near a launch entrance.

- Desktop: WASD / arrows move, drag the canvas to look, Shift runs, E interacts, V changes camera, Space dives in deep water.
- Touch: left joystick moves, swipe on the scene looks, large contextual button launches rides / toggles splash fountains. Hold the Float button to dive.
- Swimming starts automatically with depth. Sloping shores and submerged steps let you return to land.
- The menu contains golden hour, wave cycles, sound, quality, park overview and an entrance recovery button.

## Attractions

| Ride | Deck | Experience |
| --- | --- | --- |
| The Serpent | 14 m | Open twisting body slide with banked turns |
| Blackout | 16 m | Enclosed tube with a modeled interior and emissive rings |
| Vertigo | 22 m | Launch capsule countdown and steep drop |
| The Vortex | 18 m | Broad banked channel with a visible inflatable ring |
| The Cannon | 22 m | Descent, upward ramp, independent gravity flight, deep-pool impact and underwater recovery |

Crescent Beach has a gradual zero-depth entry and directional displaced waves. The Quiet Lagoon has submerged steps and seating. Little Tides has shallow water and switchable fountains. Separate landing and deep Cannon pools receive the rides.

## Implementation

- Three.js 0.180.0, locally bundled modules. WebGL2 required.
- Physically based materials, photographic normal/roughness textures, atmospheric sky, soft shadow maps and environment lighting.
- Water: displacement, Fresnel response, animated ripples, shared planar reflection, depth coloration, shallow alpha, shoreline foam and expanding splash rings. Underwater fog and a screen overlay.
- Slide channels are swept meshes. Acceleration uses slope, gravity, curvature, resistance and speed caps. Cannon flight is a separate ballistic state.
- Height-field / walkable-surface collision for terrain, stairs, landings and pools; AABB obstacles and railings; additional low-channel wall checks.
- 44 desktop / 24 mobile visitors using a CC0 skinned human mesh, 53-bone skeleton, fitted garment geometry, pose recipes, routes, stairs, queues, rides and pool activities.
- Adaptive mobile resolution, smaller shadow / reflection targets and less frequent reflection refresh. Gameplay stays the same.
- Ride stamps are saved locally. No accounts, analytics or server-side data.

Modules in `src/` separate rendering, environment, water, slide geometry/physics, character construction, visitor behavior, player movement, input, UI and audio. `src/qa.js` loads only when `?qa=1` is supplied.

## Develop and verify

```sh
npm ci
npm run dev
node tests/physics.mjs
npm test
```

The test harness supplies a Chromium binary through the standard npm package `@sparticuz/chromium` and uses software WebGL when hardware graphics are unavailable. It creates its own local HTTP server. Browser captures and reports are written to ignored `tests/output/`.

No build is needed for production. `index.html`, `src/`, `vendor/` and `assets/` are the actual shipped application. Relative URLs work under `/Tidal-code/`. Keep `.nojekyll`; never deploy `node_modules`.

## Honest limits

This is a functioning rebuild, not a completed fulfillment of the entire visual commission. Human anatomy is modeled and rigged, but visitors share one underlying body/face asset and authored poses rather than a library of professionally produced character meshes and motion capture. Children and teenagers use adjusted proportions of that base. Clothing has fitted shells and clean clipped hems, but some silhouettes and deformation remain simplified. Landscape geometry, supports and architecture are still predominantly procedural and visibly stylized.

Water uses practical rendering approximations: shallow transparency is not full screen-space refraction, splash rings are not fluid simulation, and underwater treatment is not volumetric scattering. There is no SSAO pass, full character physics, conversational activity, crowd recordings or cloth simulation. NPC avoidance / queuing is lightweight and can still bunch up. Decorative small objects are not all collision obstacles.

**Actual iPhone Safari / Metal performance has not been tested. Mobile Chromium emulation verifies layout and touch input; it does not establish a 30 FPS result on an iPhone.** See `docs/VALIDATION.md` for observed checks and remaining acceptance limits.

Licensing: [ASSET-LICENSES.md](ASSET-LICENSES.md).
