# Tooltip arrow seam QA

- Source visual truth:
  - `/Users/zhangwenyu/Downloads/截屏2026-10-12 14.25.17.png` (top placement)
  - `/Users/zhangwenyu/Downloads/截屏2026-10-12 15.20.31.png` (right and left placements)
- Implementation screenshots:
  - `/Users/zhangwenyu/Documents/GitHub/MoleUI/design-qa-assets/tooltip-implementation.png`
  - `/Users/zhangwenyu/Documents/GitHub/MoleUI/design-qa-assets/tooltip-horizontal-implementation.png`
- Combined comparisons:
  - `/Users/zhangwenyu/Documents/GitHub/MoleUI/design-qa-assets/tooltip-comparison.png`
  - `/Users/zhangwenyu/Documents/GitHub/MoleUI/design-qa-assets/tooltip-horizontal-comparison.png`
- Browser viewport: 586 × 908 CSS px; device pixel ratio 2 for the latest horizontal check.
- State: light theme, Tooltip open, placements `right` and `left` checked independently.
- Latest source dimensions: 1214 × 242 px. The focused comparison normalizes the reported screenshot and implementation crop to the same visible component scale.
- Latest implementation focused capture: 500 × 110 px from the in-app browser.

## Full-view comparison evidence

The Tooltip documentation view preserves the existing layout, trigger spacing, typography, colors, radius, and arrow proportions. The requested changes are limited to the four arrow-to-bubble joins.

## Focused-region comparison evidence

The horizontal combined comparison places the reported right-placement state on the left and the revised browser-rendered state on the right. The reported state shows a light vertical row at the arrow join; the revised state forms one continuous dark silhouette. Browser geometry confirms 1px overlap for both directions:

- `right`: arrow right edge `260.421875px`, bubble left edge `259.421875px`.
- `left`: bubble right edge `437.3203125px`, arrow left edge `436.3203125px`.

The earlier vertical comparison likewise confirms a 1px overlap between the bubble and top/bottom arrows.

## Findings and iteration history

- Earlier finding — P2: all four placements used zero-overlap joins. Subpixel antialiasing exposed the page background as horizontal or vertical seams.
- First fix: move the top and bottom arrows 1px into the bubble.
- Latest fix: move the right and left arrows 1px into the bubble.
- Post-fix evidence: focused browser captures show continuous dark joins; computed geometry confirms exactly 1px overlap for all placement axes.
- Fonts and typography: unchanged and consistent with the existing Tooltip.
- Spacing and layout rhythm: unchanged except for the intentional 1px internal overlap at each join.
- Colors and visual tokens: unchanged; bubble and arrow continue using `--mole-color-silver-black`.
- Image quality and asset fidelity: the original SVG mask asset remains in use; no replacement or raster approximation was introduced.
- Copy and content: unchanged.

No actionable P0, P1, or P2 findings remain.

final result: passed
