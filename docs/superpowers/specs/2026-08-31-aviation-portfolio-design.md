# Aviation Portfolio Experience Design

**Date:** 2026-08-31  
**Status:** Approved direction, awaiting written-spec review  
**Project:** Narava Venkat Siddharth portfolio

## Objective

Replace the current portfolio presentation with a production-quality editorial experience inspired by the interaction model and visual rhythm of `mikes.cv`, while keeping Siddharth's identity, resume, experience, skills, and projects original. The site will use an airline journey as its organizing metaphor and must feel tactile, restrained, and coherent rather than like a generic portfolio template.

The airplane window is the primary theme control. Opening the shade selects light mode; closing it selects dark mode. This interaction must be central, accessible, persistent across reloads, and visually coupled to the entire interface.

## Originality and content preservation

- Do not copy Mike Barton's name, biography, branding, photographs, ticket artwork, project writing, or proprietary assets.
- Create an original fictional airline identity named **Siddharth Air** with a custom geometric monogram, boarding pass, cabin materials, and technical labels.
- Preserve the current `PERSONAL`, `PROJECTS`, `DESIGN_PROJECTS`, `EXPERIENCES`, skills, resume, contact details, and all current uncommitted content edits.
- Reorganize existing content into the flight narrative instead of replacing it with generic placeholder biography.
- Use original generated or authored visual media. Missing real project screenshots will use clearly editable, polished project artwork with fixed dimensions and meaningful labels.

## Experience architecture

The application has four connected layers:

1. A short branded loading splash.
2. A first-capable-visit boarding-pass gate.
3. A single-column flight-plan home page.
4. Data-driven project case-study routes.

The existing React/Vite application remains the base. The presentation layer will be reorganized around React Router and typed data. Expensive Three.js experiences will be isolated in lazy chunks and will always have static fallbacks.

### Routes

- `/` renders the home flight plan.
- `/work/:slug` renders one generic case-study page populated from typed project data.
- Unknown routes redirect to `/`.
- Route changes reset scroll, update the document title, and preserve the current cabin theme.

## Visual system

The default cabin uses warm off-white surfaces, near-black text, muted violet-gray rules, and one electric aviation-blue accent. Dark mode uses a deep warm-charcoal cabin rather than a blue or purple gradient. All colors derive from CSS custom properties so the window can recolor the complete site consistently.

Typography uses a neutral grotesk sans for editorial content and a compact mono face for route, coordinate, and instrument labels. Type remains intentionally small: 16px body copy, 13–14px project labels, and 6–12px technical metadata. There will be no oversized marketing hero, conventional navigation bar, generic dashboard cards, or decorative controls outside the flight concept.

The home column has a maximum width of 560px and is centered. Case-study body copy uses a 512px column, while selected media may extend wider. Corners, borders, shadows, and material highlights follow one restrained cabin-hardware system.

## Loading splash

A centered 60px Siddharth Air monogram appears while essential fonts and the first visual assets load. It enters with a small scale-and-opacity reveal and a subtle moving blue sheen. The splash stays visible for at least 620ms, stops waiting after 12 seconds, and exits in roughly 280ms. Failed assets must never block entry.

While the splash or gate is active, the underlying application is inert and hidden from assistive technology.

## Boarding-pass gate

Capable first-time visitors see a full-screen interactive gate using a lazy-loaded React Three Fiber scene. It contains an original 492:240 boarding pass, a white tabletop scanner, a dark scan slot, an LCD state display, and a small status light.

The ticket floats above the reader, can be grabbed, bends subtly during interaction, and falls physically when released. A successful horizontal swipe through the slot moves the reader from `READY` to `READING` to `SUCCESS`; incorrect insertion produces a recoverable `ERROR`. A ticket that falls outside the visible scene respawns.

The scene provides quiet user-triggered Web Audio feedback for grab, error, and success. It never autoplays sound. A keyboard-focusable **Skip** action remains visible. Completion is saved in namespaced local storage, followed by a one-second transition into the home page.

The gate is skipped automatically for reduced-motion users, missing WebGL, obvious software rendering, or extremely weak devices. Home includes **Return to gate**, which clears both gate and cabin-theme keys before reloading; the control is hidden when the device cannot run the gate.

## Airplane window and theme behavior

The hero window renders at exactly 200×300px and uses a 600×900 internal design coordinate system. It is built from aligned layers:

1. Asymmetric clipped window opening.
2. Sky, ocean horizon, and cloud scene.
3. Rear molded-plastic frame.
4. Vertically moving opaque shade.
5. Shade-following inner shadow.
6. Foreground cabin frame and highlights.
7. Shade-dependent multiply tint.
8. Transparent accessible interaction control.

The progressive exterior uses a lazy R3F canvas with tranquil parallax cloud banks, horizon haze, and a small water shader. The fallback uses overlapping illustrated cloud layers over a sky gradient. The WebGL scene pauses when offscreen or when the shade is more than 92% closed.

Shade state is normalized from `0` open to `1` closed. Users can:

- Drag downward to close or upward to open using pointer capture and 171px of pointer travel.
- Tap or click to toggle endpoints with a roughly 900ms eased motion.
- Release a drag into a damped spring using position and release velocity.
- Operate the control from the keyboard as a real button/slider-like control.

During a drag, a fixed color veil interpolates the page between cabin states. The actual global theme commits only at an endpoint:

- Fully open removes `data-theme="dark"` and persists light mode.
- Fully closed sets `data-theme="dark"` and persists dark mode.

A small blocking script in `index.html` restores the saved endpoint before React mounts, preventing a light-theme flash. The control exposes `aria-pressed`, accurate action text, and a strong focus-visible outline. Reduced-motion users receive immediate state changes without spring travel.

## Home flight plan

Desktop displays a fixed upper-left identity block containing Siddharth's name, India location, animated coordinates, and calculated GMT offset beside a dotted rail. At 1219px and below, it enters normal flow above the centered content.

The home sequence is:

1. Interactive airplane window.
2. Siddharth's role and concise personal statement.
3. Flight-plan marker with airplane icon.
4. Career timeline with project destinations.
5. Thank-you note and five-card memory fan.
6. Fixed footer controls.

The current experience and education entries become timeline stops. Existing development and design projects become linked project rows. The neutral dotted route gains a smoothed blue progress overlay as the page scrolls, including a small glowing path head and one-time arrival pulses. Geometry is measured with `ResizeObserver` and recalculated after font load, responsive changes, and content reveal.

Project rows show a tactile three-image fan and route to internal case studies without reloads. Company marks use overlapping circular tokens with neighbor-aware hover movement. The mobile layout moves the route rail to the left, hides the year gutter, and increases vertical spacing.

The fixed footer contains Return to gate, GitHub, LinkedIn, resume/email actions, and layered progressive blur. Home retains at least 168px bottom clearance so final content remains reachable.

## Case studies and media

At least six existing portfolio records receive case-study routes through one generic `CaseStudyPage`. Typed sections support overview copy, text, framed figures, wide figures, phone rows, before/after comparisons, and video/image media.

Media is lazy-loaded with fixed aspect ratios. Visible videos autoplay muted and pause offscreen. Hover-to-play behavior is limited to pointer devices, with tap controls on touch devices. Before/after comparisons support pointer, touch, arrows, Home/End, Page Up/Down, percentage announcements, and `role="slider"`.

Selecting valid media opens a full-screen lightbox with a blurred dark scrim, visible close button, Escape close, click-outside close, left/right traversal, scroll locking, and focus restoration.

Each route ends with a floating translucent capsule containing previous project, home, and next project controls. It cycles through the project dataset and compresses safely within 12px mobile margins.

## Data and component boundaries

- `src/data/portfolio.ts` owns editable personal, career, social, and identity data.
- `src/data/projects.ts` owns project metadata and typed case-study sections.
- Splash, gate, airplane window, timeline, footer, media, and lightbox are independent component groups.
- Airplane-window state and spring endpoint logic remain separate from visual rendering.
- Gate storage/capability logic remains separate from its Three.js scene.
- WebGL window and gate scenes are lazy imports.
- Generic media renderers consume typed section records rather than per-project JSX.

## Failure handling and performance

- Missing WebGL, weak hardware, reduced motion, asset failure, and media failure all receive graceful static alternatives.
- Animation deltas are capped after background-tab pauses.
- Visual scroll work runs through `requestAnimationFrame` with passive listeners.
- Expensive canvases pause when hidden and are not mounted unnecessarily.
- Every media block reserves aspect-ratio space to avoid layout shift.
- The design must not cause horizontal scrolling or hide content behind fixed controls.

## Accessibility

All interactions are keyboard reachable and have visible focus states. Semantic landmarks and lists structure the home and case pages. Decorative visuals are hidden from assistive technology; meaningful media has useful alt text. Reduced motion affects splash, gate, window, timeline pulses, reveals, hover lifts, and lightbox motion.

Required keyboard verification covers the gate skip, window theme control, comparison slider, lightbox, case navigation, and return-to-gate flow.

## Testing and acceptance

Implementation follows test-first development for behavior. Unit/component coverage includes:

- Shade clamping, toggling, release endpoint, theme commit, and persisted restoration.
- Gate first-visit storage and skip behavior.
- Valid and invalid project routing.
- Before/after keyboard controls.
- Lightbox Escape close and focus restoration.

Browser-flow coverage includes:

- First visit to gate, skip/success, and home reveal.
- Window close to dark mode, reload persistence, and reopen to light.
- Timeline path advancement during scroll.
- Case-study open, lightbox close, and next/home navigation.
- Desktop and 390×844 mobile layout sanity.

Before handoff, run formatting, lint, typecheck, unit tests, production build, and feasible browser tests. Inspect desktop and mobile screenshots, the 200×300 window alignment, shade travel, timeline geometry, fixed-footer clearance, floating case navigation, console output, asset requests, and horizontal overflow.

## Deliverables

- Complete React/TypeScript implementation in `client/`.
- Original window, ticket, brand, and project visual assets.
- Typed portfolio and project content files using Siddharth's existing data.
- Automated unit/component and critical browser tests.
- Updated README with exact setup, verification, data/asset replacement, theme storage, WebGL fallback, and deployment instructions.
- Final verification report listing passed commands and any remaining device-only limitations.
