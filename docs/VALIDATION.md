# Validation and acceptance accounting

Date: 2026-10-09. Tested application is the root-served ES module application, including locally bundled Three.js and assets.

## Verified before production replacement

- Chromium / SwiftShader WebGL2 initialized and rendered the park at desktop 1440 × 900 and mobile 390 × 844 viewport sizes.
- Zero browser JavaScript errors, zero water / character shader failures, zero failed production asset requests in the successful browser run.
- Ground-level, aerial, beach, stair-tower and visitor screenshots were captured and visually inspected. Inspection prompted exposure correction, photographic texture integration, clothing-hem changes, seated-pose height correction and removal of an overlapping decorative rock.
- Actual CDP touch input moved the joystick, rotated the view, activated diving and launched each ride; every ride returned to swimming.
- All five ride simulations completed with finite positions and water landings. Cannon left its channel and spent 1.975 s in a separate ballistic flight state before water impact.
- Pairwise swept slide-centerline clearance tests cover all ten attraction pairs, excluding launch transfer zones. Tunnel / channel intersections found during visual QA were rerouted.
- All five stair / platform access routes were sampled for clearance. No blocked route samples remained.
- The actual exploration controller, using its real floor and obstacle checks, climbed every route at fixed 120 Hz time steps. Serpent: 27.16 s; Blackout: 34.91 s; Vertigo: 42.72 s; Vortex: 37.29 s; Cannon: 43.69 s.
- All visitor instances contained the 53-bone skeleton. Population is 44 desktop / 24 mobile.
- Beach floor transitions from zero-depth entry to swimming depth rather than switching between two flat elevations.
- Renderer startup readiness uses its own rendered-frame counter, separate from the FPS measurement counter, so slow graphics cannot keep the loading screen stuck.

`browser-results.json` contains the browser ride and route checks. `interaction-results.json` contains all 16 passing focused touch / camera checks. The QA harness can pause rendering between screenshots to prevent continuous software rendering from blocking the screenshot compositor; normal gameplay does not use that pause.

## Observed performance and limits

The testing container has no physical graphics device. The cloud browser reported WebGL unavailable even for the original prototype, so rendering checks used a locally launched Chromium with SwiftShader software WebGL.

The sampled startup throughput in one successful run was approximately 6.46 FPS at the desktop preset and 2.50 FPS at the mobile preset. Those are **software-renderer observations, not iPhone or desktop GPU benchmarks**. Depending on view and reflection pass, the captured statistics were approximately 346–589 calls and 0.85–1.14 million triangles. The quality menu shows current frame rate and render statistics. Automatic mobile resolution steps down to a minimum 0.72 device-pixel scale when sustained frames are slow.

**No real iPhone Safari / Metal session was available. The required stable 30 FPS on iPhone is unverified.** WebKit-only shader / input differences and physical-device memory pressure remain release risks.

## What the build does not fully meet

- The requested polished-indie / semi-realistic visual target is only partly achieved. Landscaping and architecture remain visibly procedural and stylized.
- Visitors are genuine skinned human meshes, not primitive stand-ins, but they share a base body / face and simple authored animation recipes. They do not provide the requested breadth of professionally produced character bodies, faces, garments and animation quality.
- Clothing is separate fitted mesh geometry with bone weights, but garment construction / deformation is simplified. There is no simulated fabric.
- Water has planar reflections, displacement, foam and shallow transparency. It lacks true scene-depth refraction, volumetric scattering, fluid simulation and obstacle-responsive breaking waves.
- NPCs have activity routes, queues, stairs, rides, pool states and separation, but no full navmesh, family-group coordination or sophisticated reciprocal obstacle avoidance. Bunching remains possible.
- Buildings, terrain, walkable decks and railings have collision; lower slide walls have approximate swept checks. Small decorative objects and every thin support are not exhaustively covered.
- Blackout's tunnel is physically modeled and darkened; the lighting uses emissive rings rather than a full set of localized interior lights.
- Tube banking / rotation is authored from the curve, not a free rigid-body simulation.
- Cannon launch speed is limited at the ramp lip to keep the fantasy jump inside its dedicated pool. Airborne motion itself uses gravity.
- Audio is synthesized water / rush noise. Distant crowd recordings, voices and rich spatial mixing are not implemented.

## Highest-value next work

1. Profile on the user's iPhone Safari: frame timings, memory, thermal slowdown, controls and every ride. Tune from those measurements.
2. Replace the shared body/face and motion recipes with a licensed, varied character roster and professionally authored swimming / reclining / slide animations.
3. Upgrade foliage, landscaping and resort architecture with authored meshes and stronger material detail.
4. Add depth-aware water refraction / caustics, better shorebreak and richer splash particles within the measured mobile budget.
5. Expand collision / navigation coverage and coordinated family / queue behavior.
