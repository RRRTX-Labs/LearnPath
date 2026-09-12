# Design System

**v2 — 2026-09-13.** Tokens live in `src/app/globals.css`; this document is the contract components
must honour. If a component hardcodes a hex, radius, shadow or duration, it is a bug.

## Character

Premium editorial developer product. A **path through a constellation**: teal is the path, amber is
progress and destinations, charcoal is the night sky. Light mode is warm paper and ink.

Not a SaaS dashboard, not a toy, not a roadmap.sh clone, not a gaming site, not a crypto terminal.

## Typography

| Role | Family | Use |
|---|---|---|
| Display | Instrument Serif (`--font-instrument`, `.font-display`) | Hero, page and section titles |
| UI / body | Geist Sans (`--font-sans`) | Everything readable |
| Meta / code | Geist Mono (`--font-mono`, `.eyebrow`, `.meta`) | Caps labels, code, facts, counts |

Scale: 12 / 14 / 16 / 18 / 24 / 32 / 48 / 72. Display line-height 1.02–1.1, body 1.6–1.65.
`.meta` (11px mono caps) is for metadata only — never body copy, never the only carrier of meaning.

## Colour tokens

Defined as CSS variables per theme, mapped through Tailwind v4 `@theme inline`.

| Token | Dark | Light | Use |
|---|---|---|---|
| `--bg` | `#090A0C` | `#F6F3EC` | Page |
| `--bg-sunken` | `#050506` | `#EBE6DA` | Wells, editors, inputs |
| `--surface` | `#12151C` | `#FFFCF6` | Cards |
| `--surface-2` | `#191D27` | `#FFFFFF` | Elevated, hovers |
| `--fg` | `#F4F1EA` | `#16161D` | Text |
| `--muted` | `#9AA3B2` | `#556070` | Secondary (≥4.5:1 on surface) |
| `--line` / `--line-strong` | white 9% / 18% | ink 12% / 20% | Hairlines, hover borders |
| `--primary` | `#2DD4BF` | `#0F766E` | Path, links, CTA |
| `--accent` | `#F5B942` | `#B45309` | Progress, destinations |
| `--danger / --warning / --success / --info` | see file | see file | Semantic states |

Utility classes: `.surface`, `.sunken`, `.glass`, `.edge-accent`, `.card-hover`, `.spotlight`.

## Elevation & borders

Three shadows only: `--shadow-1` (rest), `--shadow-2` (hover/float), `--shadow-3` (overlays),
plus `--shadow-glow` reserved for the active roadmap node and hero accents. Hairline borders
(`--line`); hover promotes to `--line-strong`. Radii: `sm 6 · md 10 · lg 16 · xl 22 · pill 999`.
One radius per component family; cards are `lg`, controls `md`, badges/pills `pill`.

## Glass — restrained

`.glass` = semi-transparent surface + 14px blur + saturate + hairline + shadow-2.
Allowed on: sticky navigation, hero overlays/canvas, floating controls, "continue learning" strip.
Forbidden on: body content, lists, forms, editor chrome. Text on glass must keep ≥4.5:1.

## Motion

| Name | ms | Use |
|---|---|---|
| instant | 0 | none |
| fast | 150 | colour, border, transform on hover |
| normal | 250 | shadows, spotlight fade |
| slow | 400 | entrances (`animate-fade-up`) |

Easing: `cubic-bezier(0.22, 1, 0.36, 1)`. Path drawing (`animate-draw`) 1.6s once.
Node pulse 3.2s infinite (decorative stars only). Float 7s (hero nodes only).

**Reduced-motion contract:** under `prefers-reduced-motion: reduce` every animation is disabled,
`.card-hover` never translates, `.spotlight` never shows, parallax handlers early-return.
State must always be legible with motion off.

## Interaction contract (cards)

- Lift `translateY(-2px)` max; never more.
- One border promotion + one shadow step per hover.
- Media inside may scale to 1.03 max.
- `.spotlight` cursor glow only on large interactive cards (roadmap cards, resource cards).
- Focus: 2px `--ring` outline, 3px offset, on every interactive element (`:focus-visible` global).
- Touch targets ≥40px height (header icons 40–44px, tabs 36–40px, buttons 36–48px).

## 3D & depth

SVG + CSS perspective (`perspective: 1200px`) on the hero canvas and roadmap bands. Parallax tilt
±4° pointer-driven. **No WebGL, no Three.js, no particle systems.** Depth elsewhere comes from
shadows and band layering, not transforms.

## Brand

- Mark: ascending two-segment path with origin dot and amber destination ring — `branding/mark.svg`
  (dark tile) and `branding/mark-light.svg` (teal tile). Reads at 16px: no hairlines, no diamonds.
- Rasters are generated from the same geometry by `scripts/render-brand-assets.py`:
  `favicon.ico` (16/32/48), `apple-touch-icon.png` (180), `icon-512.png`, `og.png` (1200×630, ~90KB).
- Wordmark: Instrument Serif "LearnPath", set in HTML (never baked into images except OG).
- Committed brand assets total well under 200KB; the previous 4.5MB of duplicate rasters is gone.

## Components

Primitives live in `src/components/ui.tsx` (client-safe, cva-based): Button, ButtonLink, Badge,
Card, Input, Textarea, Select, ProgressBar, EmptyState, Skeleton (shimmer), Tabs/TabPanel (WAI-ARIA
tab semantics with arrow-key roving), SectionHeader, Container, ShowMore. URL-state filter bars live
in `src/components/ui-client.tsx`. Icons: `lucide-react` (no brand icons exist there — the GitHub
mark is an inline SVG in `github-icon.tsx`).

Specialised components: `resource-card` (thumbnail, badges, score, CTA), `roadmap-graph`
(stage bands + dependency curves + done/active/locked/open states), `path-canvas` (hero),
`youtube-embed` (facade → official IFrame Player API), `practice/*` (Monaco chunk + sandboxes).

## Accessibility baseline

- Semantic landmarks and one `h1` per page; headings never skip levels.
- Contrast ≥4.5:1 body, ≥3:1 large display; verified for `--muted` on both themes.
- State is never colour-only: locks, checks and dashes carry icons or text.
- All interactive SVG nodes are real links; graphs expose `role="group"` + labels.
- `aria-live="polite"` on result counts and search pending states.
- Skip link, visible focus, reduced motion, 375px→1440px verification per release.
