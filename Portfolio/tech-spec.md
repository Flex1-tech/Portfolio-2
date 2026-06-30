# Technical Specification — Seth N. AKPLOGAN Portfolio

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.0.0 | UI framework |
| react-dom | ^19.0.0 | DOM rendering |
| vite | ^6.0.0 | Build tool |
| @vitejs/plugin-react | ^4.4.0 | React Vite plugin |
| tailwindcss | ^4.0.0 | Styling |
| @tailwindcss/vite | ^4.0.0 | Tailwind Vite integration |
| gsap | ^3.12.0 | Core animation engine, timelines, ScrollTrigger, Flip |
| lenis | ^1.2.0 | Smooth scroll with inertia |
| typescript | ^5.7.0 | Type safety |
| @types/react | ^19.0.0 | React type definitions |
| @types/react-dom | ^19.0.0 | ReactDOM type definitions |

**Fonts**: Loaded via Google Fonts CDN in index.html — Cormorant Garamond (300), Inter (400, 500), JetBrains Mono (400).

**No shadcn/ui components**: This is a fully bespoke portfolio with unique visual design. No standard UI primitives (dialogs, forms, dropdowns) are needed.

---

## Component Inventory

### Layout Components

| Component | Source | Notes |
|-----------|--------|-------|
| Navigation | Custom | Fixed top bar with blur backdrop. Wordmark left, nav links right. Mobile hamburger → fullscreen overlay. Active section detection via ScrollTrigger. |
| CustomCursor | Custom | Desktop only. Fixed-position div, rAF lerp follow. Scale/transform on link hover. Hidden on touch devices. |
| SmoothScrollProvider | Custom | Lenis initialization + GSAP ScrollTrigger bridge. Wraps entire app. |

### Section Components

| Component | Source | Notes |
|-----------|--------|-------|
| HeroSection | Custom | Full viewport. ASCII canvas background layer + foreground content (headline, subheadline, CTA, scroll indicator). |
| AboutSection | Custom | Two-column (55/45). Left: bio paragraphs + quote. Right: profile image with grayscale hover + education info. |
| SkillsSection | Custom | Dark band (Obsidian). 3-column grid of skill categories. Each category has title + flex-wrap skill tags. |
| ProjectsSection | Custom | Intro text with 3D perspective scroll effect. Vertical stack of ProjectCards with alternating layout. |
| CertificationsSection | Custom | Dark band. Vertical list of CertificationRows separated by borders. |
| CommunitySection | Custom | 2-column grid of EventCards. |
| ContactSection | Custom | Contact links + social icons + footer bar. |

### Reusable Components

| Component | Source | Used By |
|-----------|--------|---------|
| SectionLabel | Custom | All sections — "01 — ABOUT" pattern (JetBrains Mono, uppercase, muted) |
| SectionHeading | Custom | All sections — Cormorant Garamond heading with character-by-character GSAP reveal |
| AsciiCanvas | Custom | HeroSection — Canvas 2D background effect, self-contained |
| SkillTag | Custom | SkillsSection — bordered pill with hover fill transition |
| ProjectCard | Custom | ProjectsSection — two-column case study (number, title, problem/solution, tech tags, image) |
| EventCard | Custom | CommunitySection — bordered card with role badge |
| CertificationRow | Custom | CertificationsSection — horizontal row with status dot + verify link |
| ScrollIndicator | Custom | HeroSection — animated line + dot + "SCROLL" label, fades on scroll |

### Hooks

| Hook | Purpose |
|------|---------|
| useScrollReveal | Generic scroll-triggered entrance (fade + translateY). Wraps GSAP ScrollTrigger creation. |
| useCharacterReveal | Character-by-character text animation for SectionHeading. Returns ref to attach to element. |
| useLenis | Access Lenis instance from context for scroll-to operations. |

---

## Animation Implementation

| Animation | Library | Approach | Complexity |
|-----------|---------|----------|------------|
| ASCII audio-visualizer canvas | Canvas 2D API | Custom rAF loop. Grid of characters displaced by sine wave + noise. Continuous scroll + flicker. IntersectionObserver to pause when off-screen. | **High** |
| Character-by-character heading reveal | GSAP + ScrollTrigger | Split text to char spans. Each char: opacity 0→1, translateY 40%→0. Stagger 0.015s. ScrollTrigger start "top 80%". | **High** |
| 3D text perspective scroll | CSS @keyframes + GSAP ScrollTrigger | CSS animation paused, animationDelay driven by scroll progress. rotateY(30deg) translateZ(100px) → flat. Per-word scrub. | **High** |
| Hero word stagger entrance | GSAP timeline | Words split to spans. translateY 120%→0, opacity 0→1. Stagger 0.06s. Delay 0.4s. cubic-bezier easing. | Medium |
| Hero element sequence | GSAP timeline | Label → headline → subheadline → punchline → CTAs. Chained with incremental delays. Single timeline on mount. | Medium |
| Profile image clip-path reveal | GSAP + ScrollTrigger | clip-path: inset(100% 0 0 0) → inset(0). Duration 1.2s. cubic-bezier easing. | Medium |
| Project card image reveal (alternating) | GSAP + ScrollTrigger | Odd: clip-path from right. Even: clip-path from left. Duration 1s. Per card ScrollTrigger. | Medium |
| Project card content stagger | GSAP + ScrollTrigger | Number/title → problem/solution → tech tags → links. Staggered fade + translateY. | Medium |
| Skill tags stagger | GSAP + ScrollTrigger | Fade in 0→1. Stagger 0.03s within category, 0.15s between categories. | Medium |
| Certification rows slide-in | GSAP + ScrollTrigger | Fade + translateX -30px→0. Stagger 0.1s per row. | Low |
| Event cards entrance | GSAP + ScrollTrigger | Fade + translateY 40px→0. Stagger 0.15s. | Low |
| About content stagger | GSAP + ScrollTrigger | Paragraphs fade + translateY. Stagger 0.15s. Quote fade + translateX. | Low |
| Smooth scrolling | Lenis | Lerp 0.1, smoothWheel. Bridge to GSAP ticker + ScrollTrigger.update. | Low |
| Custom cursor | rAF + lerp | Fixed div, position interpolated with lerp 0.15. Scale on hover targets. | Medium |
| Nav entrance fade | GSAP | Opacity 0→1, duration 0.6s, delay 0.2s. | Low |
| Scroll indicator loop | GSAP | Dot translateY 0→36px, 2s, ease-in-out, infinite. Fade out after 100px scroll. | Low |
| Mobile menu overlay | GSAP | Full-screen fade in, links staggered fade-in 0.08s apart. | Low |
| Section nav active state | GSAP ScrollTrigger | One ScrollTrigger per section. onEnter/onLeaveBack to update active nav link. | Low |
| Button/link hover transitions | CSS transitions | Color, background, border-color, transform transitions. 0.2s. Pure CSS. | Low |
| Event card hover lift | CSS transition | Border-color → Muted, translateY -4px. 0.3s. Pure CSS. | Low |
| Profile grayscale hover | CSS transition | filter grayscale 0.3→0, scale 1→1.02. 0.4s/0.6s. Pure CSS. | Low |

---

## State & Logic Plan

### Lenis ↔ GSAP Integration

Lenis must be the single scroll source. Architecture:

1. **SmoothScrollProvider** creates Lenis instance on mount.
2. Subscribe Lenis to GSAP: `lenis.on('scroll', ScrollTrigger.update)`.
3. Wire Lenis into GSAP ticker: `gsap.ticker.add((time) => lenis.raf(time * 1000))`.
4. Disable GSAP lag smoothing: `gsap.ticker.lagSmoothing(0)`.
5. Expose Lenis instance via React context for `scrollTo()` calls from Navigation.

### Navigation Active Section Tracking

Each section registers a ScrollTrigger with:
- `start: "top center"`
- `end: "bottom center"`
- `onEnter` / `onEnterBack`: update active section state

Navigation reads this state to highlight the corresponding link. Implemented as a shared store (React context) that Section components write to and Navigation reads from.

### Custom Cursor — Hover Detection

The cursor component needs to know when the mouse is over interactive elements (links, buttons). Two approaches:

1. **CSS-driven**: Interactive elements get a data attribute (`data-cursor="hover"`). The cursor component queries these and checks `mouseenter`/`mouseleave` events.
2. **Result**: Cursor scales from 8px dot to 40px outline ring. Transition via CSS on the cursor div.

Implementation: Add global event listeners in the cursor component for `mouseover`/`mouseout`, check `e.target.closest('a, button, [data-cursor-hover]')`.

### ASCII Canvas Lifecycle

The canvas effect has specific lifecycle requirements:

1. **Mount**: Create canvas context, call `resize()`, start `draw()` loop.
2. **Resize**: Window resize → call `resize()` to rebuild grid.
3. **Visibility**: IntersectionObserver on the hero section. When not intersecting, stop the rAF loop. When intersecting again, resume.
4. **Unmount**: Cancel rAF, remove resize listener, disconnect IntersectionObserver.

This prevents wasted CPU cycles when the user has scrolled past the hero.

### Text Splitting for Character Animations

Section headings need to be split into individual `<span>` elements per character. This must happen:
1. After fonts are loaded (use `document.fonts.ready`)
2. Before GSAP animations are set up

Pattern: A `useTextSplit(ref)` hook that:
1. Reads text content from the ref element
2. Clears the element
3. Creates a `<span>` per character, preserving spaces as `&nbsp;`
4. Returns the split spans for GSAP targeting

This hook runs once on mount after fonts are ready.

### Mobile Menu State

Simple React state `isMenuOpen` in Navigation. When open:
- Body scroll locked (`overflow: hidden` on body)
- Overlay visible with GSAP entrance animation
- Link clicks close menu + scroll to section

---

## Other Key Decisions

### No React.StrictMode in Production

GSAP creates animations that can behave unexpectedly with StrictMode's double-mount. Disable StrictMode in the Vite entry point to ensure animations run once.

### Font Loading Strategy

Google Fonts loaded via `<link>` in `index.html` with `&display=swap`. All text-splitting and animation setup deferred until `document.fonts.ready` resolves. Show a brief dark screen (Void color) until fonts load to prevent FOUT during hero entrance.

### Image Strategy

- Profile image: Copied from user upload to `public/images/` at build time.
- Project images: Generated via AI image generation tool, saved to `public/images/projects/`.
- All images use standard `<img>` tags with `loading="lazy"` except the hero profile image.
- Alt text provided for all images for accessibility.

### Reduced Motion Support

A single `prefers-reduced-motion` check at app level:
- If enabled: skip all GSAP animations (show content immediately), replace ASCII canvas with static dark gradient, disable custom cursor, disable smooth scroll.
- Implemented as a context provider so any component can read the preference.

### Folder Structure

```
src/
 main.tsx # Entry point — no StrictMode
 App.tsx # Root — providers + all sections
 index.css # Tailwind + global styles + CSS keyframes
 components/
 Navigation.tsx
 CustomCursor.tsx
 SmoothScrollProvider.tsx
 SectionLabel.tsx
 SectionHeading.tsx
 AsciiCanvas.tsx
 SkillTag.tsx
 ProjectCard.tsx
 EventCard.tsx 
 CertificationRow.tsx
 ScrollIndicator.tsx
 sections/
 HeroSection.tsx
 AboutSection.tsx
 SkillsSection.tsx
 ProjectsSection.tsx
 CertificationsSection.tsx
 CommunitySection.tsx
 ContactSection.tsx
 hooks/
 useScrollReveal.ts
 useCharacterReveal.ts
 useLenis.ts
 useReducedMotion.ts
 context/
 ActiveSectionContext.tsx
 types/
 index.ts
public/
 images/
 profile.jpg
 projects/
 music.jpg
 2fa.jpg
 carpool.jpg
 mllib.jpg
```
