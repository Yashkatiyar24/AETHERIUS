# Design System Specification: Physicality in Digital Space

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Celestial Vault."** 

We are moving away from the "flatness" of modern SaaS and toward a hyper-premium, tactile digital environment. This system is designed to feel like a high-end physical object—think precision-milled obsidian, heavy frosted glass, and light refracted through a vacuum. 

By utilizing **intentional asymmetry** and **tonal layering**, we break the predictable "box-on-box" template. Elements do not simply sit on the screen; they float in a pressurized dark space, governed by physics, mass, and light-leaks.

---

## 2. Colors: The Void and The Light-Leak
The palette is rooted in the `surface_container_lowest` (#000000), acting as a deep "void." Light is used sparingly to define importance, mimicking long-exposure photography or "light-leaks" in a darkroom.

*   **Primary (Electric Indigo):** `primary` (#b89fff). Used for high-action states and core focus areas.
*   **Secondary (Phantom Cyan):** `secondary` (#00e3fd). Used for secondary interactions and data visualization.
*   **Tertiary (Celestial Gold):** `tertiary` (#ffe792). Reserved for "Member-Only" or ultra-premium status indicators.

### The "No-Line" Rule
Traditional 1px borders are strictly prohibited for sectioning. Structural definition must be achieved through **Background Color Shifts** or **Tonal Transitions**. A section should be distinguished from the background by moving from `surface` (#0e0e0e) to `surface_container_low` (#131313).

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. To create depth, follow this nesting logic:
1.  **Base Layer:** `surface_container_lowest` (#000000)
2.  **Section Layer:** `surface_container_low` (#131313)
3.  **Floating Elements:** `surface_container_high` (#1f1f1f) with backdrop blur.

### Signature Textures: Glassmorphism 2.0
Main CTAs and high-profile containers must utilize a **Glassmorphism 2.0** effect. This involves:
*   Semi-transparent `surface_variant` colors.
*   A `backdrop-filter: blur(20px) saturate(180%)`.
*   A subtle `grain` or `noise` overlay at 3% opacity to simulate physical texture and break digital banding.

---

## 3. Typography: Editorial Authority
We use **Manrope** for the core experience and **Space Grotesk** for technical data. The hierarchy is driven by extreme weight variance and aggressive tracking.

*   **Display Scale:** Use `display-lg` (3.5rem) with `-0.04em` tracking for a "crushed," high-fashion editorial look.
*   **Data Labels:** Use `label-md` (Space Grotesk) with `+0.15em` tracking and All-Caps to denote technical precision.
*   **Hierarchy:** Pair a `headline-lg` (Bold) with a `body-md` (Regular) at 60% opacity (`on_surface_variant`) to create an immediate focal point.

---

## 4. Elevation & Depth
In this system, depth is a function of light refraction, not just shadows.

### The Layering Principle
Achieve "lift" by stacking tiers. Place a `surface_container_highest` card on a `surface_container_low` background. The contrast in luminescence creates a natural, soft separation.

### Ambient Shadows
Shadows are never gray. They must be extra-diffused (Blur: 40px-80px) and tinted. Use a low-opacity version of `primary` or `surface_tint` at 6% opacity to create a "glow" that feels like light bleeding from beneath a physical plate.

### The "Micro-Border" Fallback
Where a border is required for accessibility, use a **0.5px Ghost Border**. 
*   **Stroke:** `outline_variant` at 20% opacity.
*   **Effect:** Apply a `drop-shadow(0 0 2px color)` to the border itself to simulate a fiber-optic edge.

---

## 5. Components: The Physical Primitives

### Buttons: Kinetic Triggers
*   **Primary:** High-refraction gradient (`primary` to `primary_dim`) with a `xl` (3rem) corner radius. On hover, the "glow offset" should expand.
*   **Secondary:** `surface_container_high` with a 0.5px `outline_variant` border.
*   **Tertiary:** Ghost style. Text only, using `primary_fixed` with `label-md` uppercase tracking.

### Cards: Holographic Vessels
*   **Style:** No dividers. Use `xl` (3rem) rounding.
*   **Interaction:** On hover, apply a subtle mesh gradient move in the background (Electric Indigo to Phantom Cyan) to simulate light hitting a holographic surface.
*   **Separation:** Vertical white space from the Spacing Scale (32px, 48px, 64px) replaces lines.

### Input Fields: Recessed Wells
*   **Visual:** Fields should look "etched" into the UI. Use `surface_container_lowest` for the field background with an inner shadow to create a recessed effect.
*   **State:** On focus, the 0.5px micro-border transitions to `secondary` (Phantom Cyan).

### Navigation: The Hidden Flux
*   Standard top-bars are discouraged. Use a floating "Island" at the bottom of the screen using `surface_bright` with 40px blur. The navigation should reveal labels only through motion (hover/interaction) to keep the UI clean and "futuristic."

---

## 6. Do's and Don'ts

### Do
*   **Do** use extreme roundedness (`xl` = 3rem) for all primary containers to mimic molded hardware.
*   **Do** apply a 3% noise texture to all glass surfaces.
*   **Do** use asymmetry. Place a large `display-lg` heading off-center to create a bespoke, high-end feel.
*   **Do** use `primary_fixed_dim` for text on dark backgrounds to ensure legibility without "blooming."

### Don't
*   **Don't** use 1px solid borders at 100% opacity. It destroys the "physical light" illusion.
*   **Don't** use pure white (#ffffff) for body text. Use `on_surface_variant` (#ababab) for long-form reading to reduce eye strain in "The Void."
*   **Don't** use standard easing. Use "Heavy" cubic-beziers (e.g., `0.3, 0, 0.1, 1`) to give elements a sense of physical weight and momentum.
*   **Don't** use dividers. If two elements need separation, increase the padding or shift the `surface_container` tier.