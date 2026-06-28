---
name: Obsidian Flux
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1b1b'
  surface-container: '#1f1f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#cfc2d6'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#303030'
  outline: '#988d9f'
  outline-variant: '#4d4354'
  surface-tint: '#ddb7ff'
  primary: '#ddb7ff'
  on-primary: '#490080'
  primary-container: '#b76dff'
  on-primary-container: '#400071'
  inverse-primary: '#842bd2'
  secondary: '#c8c6c5'
  on-secondary: '#303030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#c7c5ce'
  on-tertiary: '#303037'
  tertiary-container: '#919098'
  on-tertiary-container: '#292930'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#f0dbff'
  primary-fixed-dim: '#ddb7ff'
  on-primary-fixed: '#2c0051'
  on-primary-fixed-variant: '#6900b3'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1b1b1c'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e3e1ea'
  tertiary-fixed-dim: '#c7c5ce'
  on-tertiary-fixed: '#1b1b21'
  on-tertiary-fixed-variant: '#46464d'
  background: '#131313'
  on-background: '#e2e2e2'
  surface-variant: '#353535'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  max-width: 1440px
---

## Brand & Style

This design system is engineered for technical environments where clarity, precision, and focus are paramount. The brand personality is hyper-modern, sophisticated, and developer-centric, evoking the feeling of a high-end terminal or an advanced IDE.

The design style leans heavily into **Modern Minimalism** with a **Tech-Focused** edge. It utilizes a "Dark Mode First" philosophy, prioritizing deep blacks and high-contrast accents to reduce eye strain during long technical sessions. Surfaces are defined through subtle tonal shifts rather than heavy shadows, creating a streamlined, structural aesthetic that emphasizes information density and functional hierarchy.

## Colors

The palette is built on a foundation of absolute black (`#000000`) to maximize OLED efficiency and visual depth. 

- **Primary Accent:** A vibrant, high-energy purple (`#A855F7`) used sparingly for interactive elements, focus states, and critical paths.
- **Surfaces:** Containers are layered using a scale of grays. Secondary surfaces use `#1E1E1E` for main UI blocks, while tertiary surfaces use `#3F3F46` for borders, dividers, and inactive states.
- **Contrast:** Text maintains high legibility with pure white for primary content and a muted zinc-gray for metadata and secondary descriptions.
- **Functional Colors:** Error, success, and warning states should maintain high saturation to stand out against the monochromatic base.

## Typography

This design system utilizes a dual-font strategy to distinguish between UI orchestration and data content.

- **Inter:** The primary workhorse for all interface elements, navigation, and body copy. It is chosen for its exceptional legibility and neutral, systematic feel.
- **JetBrains Mono:** Reserved for code snippets, data values, system logs, and technical labels. Its monospaced nature provides the necessary alignment for technical readability.

Headlines should use tighter letter spacing and heavier weights to anchor the page. Code-based labels use uppercase styling to differentiate system-generated metadata from user-generated content.

## Layout & Spacing

The layout follows a **Fluid Grid** model based on a 4px baseline shift. This ensures all components scale mathematically.

- **Desktop:** A 12-column grid with 16px gutters. Content is centered with a max-width of 1440px.
- **Tablet:** An 8-column grid with 16px gutters and 24px side margins.
- **Mobile:** A 4-column grid with 12px gutters and 16px side margins.

Information density is high. Padding within containers should be functional—use 16px (4 units) for standard padding and 8px (2 units) for compact data views.

## Elevation & Depth

Depth is conveyed through **Tonal Layers** and **Low-Contrast Outlines**. Because the background is pure black, traditional shadows are replaced by subtle border treatments.

- **Level 0 (Base):** Pure black (`#000000`).
- **Level 1 (Cards/Sections):** Dark Gray (`#1E1E1E`) with a 1px solid border of `#3F3F46`.
- **Level 2 (Popovers/Modals):** Dark Gray (`#27272A`) with a subtle 1px border of `#52525B`.

Interactive elements like buttons should not use shadows; instead, use color fills or high-contrast strokes to indicate state changes.

## Shapes

The shape language is **Soft** but disciplined. 

The design system uses a 0.25rem (4px) base radius for standard components like input fields and small buttons. This slight rounding takes the "sting" off the high-contrast edges while maintaining a professional, geometric rigor. Large containers and cards may use `rounded-lg` (8px) to provide clearer visual nesting.

## Components

- **Buttons:** Primary buttons use a solid Purple (`#A855F7`) fill with white text. Secondary buttons use a transparent background with a 1px gray border.
- **Inputs:** Fields are pure black with a 1px border (`#3F3F46`). On focus, the border transitions to Purple with no outer glow.
- **Code Blocks:** Use a slightly darker background than standard cards to create a "well" effect. Always use JetBrains Mono for the content.
- **Chips/Tags:** Small, rectangular with a 4px radius. Use `#27272A` background with `#A1A1AA` text for neutral tags, and purple tints for active filters.
- **Lists:** Separated by 1px dividers (`#1E1E1E`). Hover states should trigger a subtle background shift to `#18181B`.
- **Status Indicators:** Use small, high-saturation dots (Green, Red, Amber) to provide "at-a-glance" system health status.