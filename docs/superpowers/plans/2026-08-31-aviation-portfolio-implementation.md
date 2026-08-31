# Aviation Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Siddharth's portfolio as a complete aviation-cabin journey whose airplane-window shade controls and persists the site-wide light/dark theme.

**Architecture:** Keep the existing Vite/React/TypeScript application, replace its presentation layer with route-driven pages and focused feature modules, and retain the user's existing portfolio data. Behavioral state is implemented as pure utilities and hooks with test-first coverage; expensive R3F scenes are lazy-loaded and paired with CSS/SVG fallbacks.

**Tech Stack:** React 19, TypeScript 6, Vite 8, React Router, Three.js/R3F/Drei, Rapier, Vitest, React Testing Library, Playwright, authored CSS.

**Spec:** `docs/superpowers/specs/2026-08-31-aviation-portfolio-design.md`

## Global Constraints

- Preserve all current `client/src/utils/constants.ts` content, including uncommitted user changes.
- Use the original **Siddharth Air** identity; do not copy protected text or media from `mikes.cv`.
- Window shade endpoint `0` is light mode and endpoint `1` is dark mode.
- Use namespaced keys `siddharth-air:theme` and `siddharth-air:gate-unlocked`.
- Keep the home column at `min(calc(100% - 3rem), 560px)` and the window at exactly 200×300px.
- Provide reduced-motion, non-WebGL, weak-device, and media-error fallbacks.
- Keep every interaction keyboard accessible with visible focus treatment.
- Follow test-first red-green-refactor cycles for behavior.

---

### Task 1: Tooling, routing shell, and data model

**Files:**
- Modify: `client/package.json`
- Modify: `client/vite.config.ts`
- Modify: `client/index.html`
- Replace: `client/src/App.tsx`
- Modify: `client/src/main.tsx`
- Create: `client/src/app/router.tsx`
- Create: `client/src/app/RouteEffects.tsx`
- Create: `client/src/data/portfolio.ts`
- Create: `client/src/data/projects.ts`
- Create: `client/src/test/setup.ts`
- Test: `client/src/app/router.test.tsx`

**Interfaces:**
- Produces: `router`, `portfolioIdentity`, `careerEntries`, `projects`, `ProjectRecord`, `CaseSection`, and route title/scroll behavior.
- Consumes: existing personal, project, design-project, and experience constants.

- [ ] **Step 1: Install runtime and test dependencies**

Run:

```bash
cd client
npm install react-router-dom @react-three/rapier @react-three/postprocessing postprocessing
npm install -D vitest @vitest/coverage-v8 jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event playwright
```

- [ ] **Step 2: Add scripts and Vitest configuration**

Add `typecheck`, `test`, `test:run`, `test:coverage`, and `test:e2e` scripts. Configure Vitest for `jsdom`, `src/test/setup.ts`, CSS support, and globals.

- [ ] **Step 3: Write the failing route test**

```tsx
it('redirects an unknown project route to home', async () => {
  render(<RouterProvider router={makeMemoryRouter(['/work/not-real'])} />)
  expect(await screen.findByRole('main', { name: /flight plan/i })).toBeVisible()
})
```

Run: `npm run test:run -- src/app/router.test.tsx`  
Expected: FAIL because the new router and pages do not exist.

- [ ] **Step 4: Implement typed records and the router shell**

Create six slugged project records by adapting the existing project/design records. Define:

```ts
export type Media = { src?: string; poster?: string; hoverToPlay?: boolean; label?: string; before?: string; after?: string; bare?: boolean; alt: string }
export type CaseSection =
  | { type: 'overview'; label: string; body: string }
  | { type: 'text'; title: string; body: string }
  | { type: 'figure'; media: Media; caption?: string; aspect?: number; wide?: boolean }
  | { type: 'phones'; rows: Media[][] }
export type ProjectRecord = { slug: string; title: string; years: string; platforms: string[]; blurb: string; summary: string; thumbnails: [string, string, string]; sections: CaseSection[] }
```

Use `createBrowserRouter` for production and export a memory-router factory for tests. Unknown paths use `<Navigate to="/" replace />`.

- [ ] **Step 5: Verify and commit**

Run: `npm run test:run -- src/app/router.test.tsx && npm run typecheck`  
Expected: PASS.

Commit: `feat: add aviation portfolio data and routes`

### Task 2: Theme, splash, and capability state

**Files:**
- Create: `client/src/utils/capabilities.ts`
- Create: `client/src/components/splash/Splash.tsx`
- Create: `client/src/components/splash/Splash.css`
- Create: `client/src/components/airplane-window/shadeState.ts`
- Create: `client/src/components/airplane-window/shadeState.test.ts`
- Create: `client/src/hooks/useCabinTheme.ts`
- Modify: `client/index.html`

**Interfaces:**
- Produces: `clampShade`, `toggleShade`, `chooseShadeEndpoint`, `readThemeEndpoint`, `commitTheme`, `useCabinTheme`, and `detectVisualCapability`.
- Consumes: `siddharth-air:theme` storage key.

- [ ] **Step 1: Write failing shade-state tests**

```ts
expect(clampShade(-0.2)).toBe(0)
expect(clampShade(1.4)).toBe(1)
expect(toggleShade(0)).toBe(1)
expect(toggleShade(1)).toBe(0)
expect(chooseShadeEndpoint(0.3, 0.1)).toBe(0)
expect(chooseShadeEndpoint(0.3, 1.2)).toBe(1)
```

Add tests proving endpoint commit sets/removes `data-theme="dark"` and restores `1` from storage.

Run: `npm run test:run -- src/components/airplane-window/shadeState.test.ts`  
Expected: FAIL because the module is missing.

- [ ] **Step 2: Implement state and pre-mount restoration**

Use clamping, a velocity threshold of `0.65`, midpoint `0.5`, and a blocking head script:

```html
<script>
  try { if (localStorage.getItem('siddharth-air:theme') === 'dark') document.documentElement.dataset.theme = 'dark' } catch {}
</script>
```

- [ ] **Step 3: Implement resilient splash and capability detection**

The splash holds for at least 620ms, caps asset waiting at 12s, exits in 280ms, and never blocks on a rejected preload. Capability detection checks reduced motion, WebGL context, renderer strings containing `swiftshader` or `software`, device memory at or below 2GB, and hardware concurrency at or below 2.

- [ ] **Step 4: Verify and commit**

Run: `npm run test:run -- src/components/airplane-window/shadeState.test.ts && npm run typecheck`  
Expected: PASS.

Commit: `feat: add cabin theme and splash state`

### Task 3: Airplane window signature interaction

**Files:**
- Create: `client/src/components/airplane-window/AirplaneWindow.tsx`
- Create: `client/src/components/airplane-window/AirplaneWindow.css`
- Create: `client/src/components/airplane-window/WindowScene.tsx`
- Create: `client/src/components/airplane-window/CloudField.tsx`
- Create: `client/public/window/frame-back.svg`
- Create: `client/public/window/frame-front.svg`
- Create: `client/public/window/shade.svg`
- Test: `client/src/components/airplane-window/AirplaneWindow.test.tsx`

**Interfaces:**
- Consumes: shade-state utilities, `useCabinTheme`, and visual capability result.
- Produces: `<AirplaneWindow />` with a semantic shade control and lazy exterior.

- [ ] **Step 1: Write the failing interaction test**

```tsx
it('closes the shade and commits dark mode when activated', async () => {
  render(<AirplaneWindow forceFallback />)
  await user.click(screen.getByRole('button', { name: /close the window shade/i }))
  await waitFor(() => expect(document.documentElement).toHaveAttribute('data-theme', 'dark'))
  expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
})
```

Run: `npm run test:run -- src/components/airplane-window/AirplaneWindow.test.tsx`  
Expected: FAIL because the component is missing.

- [ ] **Step 2: Author original layered cabin assets**

Create molded-plastic SVG frames with warm gradients, grain filters, recessed shadows, metallic screws, and a shade with a visible handle. Use the specified inner and outer percentage clip paths and preserve exact 200×300 render dimensions.

- [ ] **Step 3: Implement pointer and keyboard shade behavior**

Use pointer capture, `touch-action: none`, 171px normalized travel, sampled release velocity, and a requestAnimationFrame spring with stiffness `190` and damping `26`. Click toggles endpoints over 900ms. Commit theme only after arriving within `0.002` of an endpoint. Reduced motion commits immediately.

- [ ] **Step 4: Add the lazy exterior**

Use one R3F `<Canvas>` owner. Render reusable billboard geometry through instanced meshes for far, mid, and near cloud banks; mutate offsets in `useFrame` without React state. Add a small shader horizon and cap delta at `0.05`. Suspend animation when shade exceeds `0.92` or the window leaves the viewport. Fallback uses three CSS/SVG cloud layers.

- [ ] **Step 5: Verify and commit**

Run: `npm run test:run -- src/components/airplane-window && npm run typecheck && npm run build`  
Expected: PASS.

Commit: `feat: build interactive airplane window theme control`

### Task 4: Boarding-pass gate

**Files:**
- Create: `client/src/components/access-pass/gateState.ts`
- Create: `client/src/components/access-pass/gateState.test.ts`
- Create: `client/src/components/access-pass/AccessGate.tsx`
- Create: `client/src/components/access-pass/AccessGate.css`
- Create: `client/src/components/access-pass/GateScene.tsx`
- Create: `client/src/components/access-pass/useGateAudio.ts`
- Create: `client/public/ticket/boarding-pass.svg`

**Interfaces:**
- Produces: gate state machine `READY | READING | ERROR | SUCCESS`, storage helpers, `<AccessGate />`.
- Consumes: capability detection and `siddharth-air:gate-unlocked`.

- [ ] **Step 1: Write failing storage and skip tests**

```tsx
it('skip unlocks the gate and reveals the app', async () => {
  render(<AccessGate capable onComplete={onComplete} />)
  await user.click(screen.getByRole('button', { name: /skip/i }))
  expect(localStorage.getItem('siddharth-air:gate-unlocked')).toBe('true')
  expect(onComplete).toHaveBeenCalledOnce()
})
```

Run: `npm run test:run -- src/components/access-pass`  
Expected: FAIL because the gate does not exist.

- [ ] **Step 2: Implement the gate state boundary**

Gate capability, storage, skip, status text, focus, and inert behavior live in HTML/React outside the canvas. The expensive scene is lazy-loaded only when capable and locked.

- [ ] **Step 3: Build the scanner scene and authored ticket**

Use a Rapier rigid body ticket with pointer-driven kinematic movement while grabbed and dynamic gravity when released. A slot sensor validates horizontal travel exceeding `1.25` scene units while ticket height stays within `0.22` units. Incorrect vertical entry triggers `ERROR`; success triggers `SUCCESS`. Respawn below `y=-4`.

- [ ] **Step 4: Add user-triggered audio and fallback**

Generate short oscillator/gain envelopes only after pointer or keyboard activation. Swallow unavailable AudioContext errors. Render the same ticket and scanner composition in CSS when the R3F scene cannot load.

- [ ] **Step 5: Verify and commit**

Run: `npm run test:run -- src/components/access-pass && npm run typecheck && npm run build`  
Expected: PASS.

Commit: `feat: add interactive boarding pass gate`

### Task 5: Flight-plan home and scroll path

**Files:**
- Create: `client/src/pages/HomePage.tsx`
- Create: `client/src/pages/HomePage.css`
- Create: `client/src/components/timeline/FlightTimeline.tsx`
- Create: `client/src/components/timeline/FlightTimeline.css`
- Create: `client/src/components/timeline/useFlightPath.ts`
- Create: `client/src/components/footer/HomeFooter.tsx`
- Create: `client/src/components/footer/HomeFooter.css`
- Create: `client/src/components/IdentityBlock.tsx`
- Create: `client/src/components/MemoryFan.tsx`
- Create: `client/src/components/ProjectRow.tsx`

**Interfaces:**
- Consumes: `portfolioIdentity`, `careerEntries`, project records, `<AirplaneWindow />`, gate reset helper.
- Produces: semantic home page and normalized `data-path-progress` value for browser tests.

- [ ] **Step 1: Write a failing flight-path behavior test**

```tsx
it('maps scroll range into a clamped route progress', () => {
  expect(normalizePathProgress(100, 100, 1000)).toBe(0)
  expect(normalizePathProgress(550, 100, 1000)).toBe(0.5)
  expect(normalizePathProgress(1200, 100, 1000)).toBe(1)
})
```

Run: `npm run test:run -- src/components/timeline`  
Expected: FAIL because the hook helper is missing.

- [ ] **Step 2: Build home composition from current data**

Render identity, window, intro, timeline entries, project fans, thank-you copy, memory cards, and footer in the exact order from the spec. Use semantic `main`, `ol`, `li`, `article`, and links.

- [ ] **Step 3: Implement measured scroll path**

Measure the route with `ResizeObserver`, calculate normalized viewport progress, smooth it toward the target with interpolation `current += (target-current)*0.12`, and render a blue overlay plus glowing head. Disable pulses and interpolation for reduced motion.

- [ ] **Step 4: Implement responsive/fixed details**

Move identity into flow below 1220px, reposition the rail below 760px, ensure footer blur is non-interactive, and reserve 168px bottom padding. Add Return to gate, GitHub, LinkedIn, resume, and email actions.

- [ ] **Step 5: Verify and commit**

Run: `npm run test:run -- src/components/timeline && npm run typecheck && npm run build`  
Expected: PASS.

Commit: `feat: build scroll reactive flight plan home`

### Task 6: Case-study media, lightbox, and navigation

**Files:**
- Create: `client/src/pages/CaseStudyPage.tsx`
- Create: `client/src/pages/CaseStudyPage.css`
- Create: `client/src/components/media/MediaFigure.tsx`
- Create: `client/src/components/media/BeforeAfter.tsx`
- Create: `client/src/components/media/BeforeAfter.test.tsx`
- Create: `client/src/components/lightbox/Lightbox.tsx`
- Create: `client/src/components/lightbox/Lightbox.test.tsx`
- Create: `client/src/components/lightbox/Lightbox.css`
- Create: `client/src/components/CaseNavigation.tsx`

**Interfaces:**
- Consumes: project records and router params.
- Produces: generic media sections, accessible comparison slider, focus-restoring lightbox, cyclic case navigation.

- [ ] **Step 1: Write failing comparison keyboard tests**

```tsx
await user.click(screen.getByRole('slider'))
await user.keyboard('{End}')
expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '100')
await user.keyboard('{ArrowLeft}')
expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '99')
```

Run: `npm run test:run -- src/components/media/BeforeAfter.test.tsx`  
Expected: FAIL because the comparison is missing.

- [ ] **Step 2: Write failing lightbox focus test**

Open a real media button, press Escape, assert the dialog is removed and the opener regains focus.

Run: `npm run test:run -- src/components/lightbox/Lightbox.test.tsx`  
Expected: FAIL because the lightbox is missing.

- [ ] **Step 3: Implement generic case sections and media behavior**

Use `IntersectionObserver` with a 600px root margin for media source attachment. Pause videos offscreen, support hover-to-play only for fine pointers, reserve aspect ratios, and display accessible error artwork on failure.

- [ ] **Step 4: Implement comparison and lightbox**

Comparison supports pointer capture, touch, arrows ±1, Page Up/Down ±10, Home 0, End 100. Lightbox uses `role="dialog"`, scroll locking, outside/Escape close, valid-media traversal, and focus restoration.

- [ ] **Step 5: Implement case navigation and verify**

Cycle previous and next indices modulo project count. Keep the fixed capsule 30px from the bottom and within 12px mobile margins.

Run: `npm run test:run -- src/components/media src/components/lightbox src/app/router.test.tsx && npm run typecheck && npm run build`  
Expected: PASS.

Commit: `feat: add data driven project case studies`

### Task 7: Global visual system, reveals, and original media

**Files:**
- Replace: `client/src/index.css`
- Create: `client/src/styles/tokens.css`
- Create: `client/src/styles/fonts.css`
- Create: `client/src/styles/global.css`
- Create: `client/src/hooks/useReveal.ts`
- Create: `client/public/projects/kodikos.svg`
- Create: `client/public/projects/estia-stay.svg`
- Create: `client/public/projects/lumaloop.svg`
- Create: `client/public/projects/sphere-point.svg`
- Create: `client/public/projects/settlers-3d.svg`
- Create: `client/public/projects/design-lab.svg`
- Create: `client/public/memories/build.svg`
- Create: `client/public/memories/learn.svg`
- Create: `client/public/memories/ship.svg`
- Create: `client/public/memories/lead.svg`
- Create: `client/public/memories/explore.svg`
- Modify: feature CSS files from Tasks 2–6

**Interfaces:**
- Consumes: all semantic class names and data attributes from the prior tasks.
- Produces: complete light/dark material system, responsive layouts, reduced-motion behavior, and original project imagery.

- [ ] **Step 1: Generate an original aviation/project visual sheet**

Use the available image-generation capability to create a cool editorial aviation contact sheet with six distinct software-project panels and no third-party branding. Use it as art direction; export or recreate production-safe project-specific assets in `public/projects/`.

- [ ] **Step 2: Implement tokens and global reset**

Use the exact light/dark token values from the design brief, one electric-blue accent, local/system font fallbacks, selection/focus colors, and view-transition-safe theme changes.

- [ ] **Step 3: Style every feature at desktop and mobile sizes**

Match 560px home rhythm, 512px case copy, 200×300 window, 80px top space, 48px major gaps, 168px bottom clearance, tactile paper/plastic surfaces, compact mono labels, and restrained hover/active states. Explicitly define `<760px`, `<860px`, and `<1220px` layouts.

- [ ] **Step 4: Add one-time reveals and reduced-motion override**

Use one IntersectionObserver hook to reveal elements once with 400ms opacity/blur/translate transitions and 60ms sequence offsets. Under reduced motion, remove transforms, springs, hover lifts, pulses, and smooth scrolling.

- [ ] **Step 5: Run visual static checks and commit**

Run: `npm run lint && npm run typecheck && npm run test:run && npm run build`  
Expected: all commands exit 0.

Commit: `style: finish aviation cabin visual system`

### Task 8: Browser flows, README, and live server

**Files:**
- Create: `client/playwright.config.ts`
- Create: `client/e2e/portfolio.spec.ts`
- Replace: `client/README.md`

**Interfaces:**
- Consumes: the completed application.
- Produces: critical browser coverage, operating documentation, and a verified running server.

- [ ] **Step 1: Write Playwright flows**

Cover gate skip, home reveal, window close/reload/open, timeline progress, project/lightbox/navigation, and a 390×844 no-horizontal-overflow check. Capture desktop and mobile screenshots to `/tmp/aviation-portfolio-*` for visual inspection.

- [ ] **Step 2: Run the browser suite and inspect console/network**

Run the webapp-testing helper after its `--help` command, or use Playwright's configured `webServer`. Fail on page errors, console errors, broken local asset responses, hidden fixed-footer content, or horizontal overflow.

- [ ] **Step 3: Refine from screenshots**

Inspect the full-page desktop and mobile images. Correct window alignment, shade travel, route geometry, project fan legibility, footer clearance, and case capsule positioning; rerun affected checks.

- [ ] **Step 4: Write operating documentation**

Document Node requirements, install/dev/build/test/e2e commands, exact data and asset replacement files, localStorage keys, WebGL fallback behavior, deployment, and real-device limitations.

- [ ] **Step 5: Run the final verification matrix**

Run:

```bash
npm run lint
npm run typecheck
npm run test:run
npm run build
npm run test:e2e
```

Expected: every command exits 0 with no test failures.

- [ ] **Step 6: Start and verify the requested server**

Run `npm run dev -- --host 0.0.0.0` in a persistent PTY, capture its session ID, and verify the reported localhost URL returns HTTP 200.

- [ ] **Step 7: Commit**

Commit: `test: verify aviation portfolio browser flows`
