# Design System

## Character

Premium editorial developer product. Not a SaaS dashboard, not a toy, not roadmap.sh.

Metaphor: a **path through a constellation**. Teal is the path. Amber is progress. Charcoal is the night sky. Light mode is paper and ink.

## Typography

| Role | Family | Notes |
|---|---|---|
| Display | Instrument Serif | Hero, roadmap titles |
| UI / body | Geist Sans | High readability |
| Code / labels | Geist Mono | Caps labels, code, meta |

Scale: 12 / 14 / 16 / 18 / 24 / 32 / 48 / 72. Display line-height 1.1, body 1.6.

## Color tokens

Defined in `src/app/globals.css` as CSS variables, mapped into Tailwind `@theme`.

### Dark (default)

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#090A0C` | Page |
| `--bg-sunken` | `#050506` | Wells, editor |
| `--surface` | `#12151C` | Cards |
| `--surface-2` | `#191D27` | Elevated |
| `--fg` | `#F4F1EA` | Text |
| `--muted` | `#9AA3B2` | Secondary |
| `--border` | `#FFFFFF14` | Hairline |
| `--primary` | `#2DD4BF` | Path, links, CTA |
| `--primary-fg` | `#042F2E` | Text on primary |
| `--accent` | `#F5B942` | Progress, highlights |
| `--danger` | `#F07167` | Errors |
| `--warning` | `#E3B341` | Warnings |
| `--success` | `#3DDC97` | Pass |
| `--info` | `#7AA2FF` | Info |

### Light

Warm paper `#F6F3EC`, ink `#16161D`, teal `#0F766E`, amber `#B45309`.

Do not hardcode hex in components.

## Spacing

4px base: 1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24.

## Radius

`sm` 6px · `md` 10px · `lg` 16px · `pill` 999px.

## Shadows

Subtle only: `0 1px 0 rgba(255,255,255,0.04)` inset hairlines on dark; `0 8px 30px rgba(0,0,0,0.08)` on light cards. No neon glow except the path nodes.

## Motion

| Name | Duration |
|---|---|
| instant | 0ms |
| fast | 150ms |
| normal | 250ms |
| slow | 400ms |

Easing: `cubic-bezier(0.22, 1, 0.36, 1)`. Graphs may draw paths; honor `prefers-reduced-motion` (opacity only).

## Components

Buttons (primary, ghost, danger), cards, badges, tabs, dialogs, tooltips, progress, roadmap nodes, resource cards, empty/loading/error states, editor chrome. Implementation lives in `src/components/ui`.

## Accessibility

Contrast ≥ 4.5:1 for body. Focus ring: 2px primary offset. Reduced motion. Skip to content.

## 3D

SVG nodes with a light CSS perspective (`perspective: 1200px`) on the homepage canvas. No WebGL in V1.
