# Asset licenses

All production dependencies, meshes and textures are served from this repository. No runtime CDN requests are needed.

| Asset | Creator / source | License | Work performed |
| --- | --- | --- | --- |
| `assets/characters/visitor.glb` | Innerscene, derived from MakeHuman / MPFB anatomical base and 53-bone game-engine rig | CC0 1.0 | Reduced the original 4.99 MB mesh to 570.5 KB with glTF Transform. Original human anatomy and skin weights retained. Runtime fitted fabric shells, hair, eyes, body variations and skeletal pose animation added. |
| `assets/characters/skin.webp` | MakeHuman / MPFB skin texture packaged by Innerscene in Idle standing – Maya | CC0 | Extracted the embedded texture, resized to 1024 px, converted to WebP; applied to the modeled face with individual skin tint. |
| `assets/textures/stone-*.webp` | Concrete Floor Worn 001, Dimitrios Savva (photography), Rico Cilliers (processing), Poly Haven | CC0 | Diffuse, OpenGL normal and roughness maps resized to 512 px and converted to WebP. |
| `assets/textures/sand-*.webp` | Coast Sand 01, Rob Tuytel, Poly Haven | CC0 | Diffuse, OpenGL normal and roughness maps resized to 512 px and converted to WebP. |
| `vendor/three.*.js`, `vendor/addons/` | Three.js contributors, release 0.180.0 | MIT | Core ES modules minified with esbuild; required addons bundled locally. Full license in `vendor/THREE-LICENSE.txt`. |
| Park geometry, garment patterns, signs, landscaping, procedural materials, water shaders, motion recipes | Created for Tidal Cove | Original project assets | Actual 3D geometry; no scene screenshots or videos used as scenery. |
| Water sound | Synthesized in Web Audio | Original project audio | Filtered noise generated after a user gesture; no music or sampled recordings. |

Original asset and license references:

- https://www.innerscene.com/tools/library/3d-parts/human-base-mesh-with-editable-53-bone-rig-8e7c8ab1
- https://www.innerscene.com/tools/library/3d-parts/idle-standing-maya-3d-person-animated-22b686d6
- https://creativecommons.org/publicdomain/zero/1.0/
- https://polyhaven.com/a/concrete_floor_worn_001
- https://polyhaven.com/a/coast_sand_01
- https://polyhaven.com/license
- https://github.com/mrdoob/three.js/blob/r180/LICENSE

Wardrobe research (inspiration only; no brand imagery, logos or designs copied):

- https://www.swimoutlet.com/blogs/official/the-swimwear-trends-defining-2026
- https://www.elle.com/fashion/trend-reports/a71229886/swimwear-trends-2026/

The implemented wardrobe uses solids, stripes, dots, botanical motifs, sporty separates, fitted trunks, one-piece-inspired suits and protective tops. It does not reproduce the full range of garment constructions in the commission.
