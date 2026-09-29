# Venga · Recurring Buys

Landing page for Recurring Buys (DCA), built from the Figma file "🎨 Website" (node 7248:111422), with motion throughout.

Plain HTML, CSS and a little JavaScript: no build step or dependencies.

## Files
- `index.html`: markup
- `styles.css`: all styles, including the motion states at the bottom
- `motion.js`: scroll reveals, stacking step cards, photo parallax and count-up numbers
- `assets/`: SVGs and images exported from Figma. The phone mockups in the step cards and the "Your full control" tiles are 2x exports.
- `fonts/`: Labil Grotesk (excluded from git by `.gitignore`, see below)

## Run locally

    python3 -m http.server 3200

then open http://localhost:3200.

## Motion
- Hero: the headline rises line by line, then the chart builds (grid, bars, the line drawing with a dot on its tip, the area fill) and the totals count up. Timing and easing follow the Figma motion, played once instead of looping.
- Setting up: the step cards pin under the nav and stack; covered cards shrink back and dim.
- Everything else reveals on scroll, with hover states on clickable elements only.
- `prefers-reduced-motion` shows everything in its resting state.

## Fonts
Labil Grotesk is a licensed typeface, so `fonts/` is ignored by git. Without it the page falls back to the system font. Copy the four `.otf` files into `fonts/` locally (they are in the other Venga projects).
