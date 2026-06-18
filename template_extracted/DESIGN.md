# Design System Strategy: The Digital Atelier

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Atelier."** 

This system rejects the utilitarian "web-template" aesthetic in favor of a high-end editorial experience. It is designed to feel like a bespoke physical magazine—tactile, spacious, and unapologetically premium. By utilizing sharp 0px radii and a high-contrast typographic scale, we create an atmosphere of architectural precision. 

The design moves beyond the grid, employing intentional asymmetry and overlapping elements to guide the eye through a curated narrative rather than a standard product list. We treat the screen as a canvas where "white space" is not merely empty, but an active design element that signifies luxury and breathing room.

---

## 2. Colors & Tonal Depth

### The Palette
The color strategy utilizes a sophisticated "Light Noir" approach. We use a base of pure whites and off-whites, punctuated by deep charcoal and shimmering gold accents.

*   **Primary (`#735c00`) & Primary Container (`#d4af37`):** Our signature gold. Use the Primary value for high-contrast interactive elements and the Container value for decorative accents and backgrounds that require a "glow."
*   **Surface Hierarchy:** We utilize the `surface-container` tiers to create depth without lines.
    *   `surface-container-lowest (#ffffff)`: Used for floating cards or primary content areas to make them "pop" against the background.
    *   `surface (#f9f9f9)`: The standard canvas.
    *   `surface-container-high (#e8e8e8)`: Used for subtle recession, such as utility bars or secondary footers.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections. Layout boundaries must be defined solely through:
1.  **Background Color Shifts:** Placing a `surface-container-low` section immediately following a `surface` section.
2.  **Negative Space:** Using the Spacing Scale to create "voids" that act as invisible barriers.

### Signature Textures & Glass
To elevate the UI from flat to "Luxe," apply a subtle linear gradient to main CTAs (transitioning from `primary` to `primary_container`). For floating navigation or over-image menus, utilize **Glassmorphism**: apply `surface` colors at 80% opacity with a `20px` backdrop-blur to mimic frosted architectural glass.

---

## 3. Typography
The typography is the voice of the brand. It balances the heritage feel of a serif with the modern efficiency of a sans-serif.

*   **Display & Headline (Newsreader):** These are our "Editorial" levels. Use `display-lg` for hero moments with tight letter-spacing (-2%) to mimic high-fashion mastheads. Headlines should feel authoritative and are always set in Charcoal (`on_surface`).
*   **Body & UI (Manrope):** All functional text, labels, and long-form descriptions use Manrope. This ensures readability and a contemporary edge. 
*   **Hierarchy Tip:** Use `label-sm` in all-caps with increased letter-spacing (+10%) for category tags to create a "curated" look.

---

## 4. Elevation & Depth

### The Layering Principle
Depth is achieved through **Tonal Layering** rather than structural shadows. By stacking surface tiers (e.g., a `surface-container-lowest` card sitting on a `surface-container-low` section), we create a soft, natural lift that feels organic to the page.

### Ambient Shadows
When a component must "float" (e.g., a luxury product modal), shadows must be:
*   **Extra-Diffused:** Blur values of `40px` or higher.
*   **Low-Opacity:** Never exceeding 6%.
*   **Tinted:** Use a 4% opacity version of `on_surface` (Charcoal) to mimic natural ambient light rather than a synthetic grey.

### The "Ghost Border" Fallback
If a border is strictly required for accessibility (e.g., in complex input fields), use a **Ghost Border**: the `outline-variant` token at 15% opacity. High-contrast, 100% opaque borders are strictly forbidden as they clutter the editorial aesthetic.

---

## 5. Components

### Buttons
*   **Primary:** `primary` background, `on_primary` text. Sharp 0px corners. High-glance value.
*   **Secondary:** `outline` Ghost Border (15% opacity) with `on_surface` text.
*   **Tertiary:** Text-only, `label-md` style, with a `2px` underline in `primary_container` that expands on hover.

### Input Fields
*   **Style:** Minimalist. Only a bottom-border using `outline_variant`.
*   **Active State:** The bottom border transitions to `primary` (Gold) with a `2px` thickness.
*   **Labels:** Use `label-md` floating above the input, never inside.

### Cards & Lists
*   **Rule:** No dividers. Separate items using `24px` or `32px` of vertical white space.
*   **Imagery:** Images within cards should use a `surface-variant` placeholder while loading. Product imagery should ideally be cut-outs (PNG) to allow the surface layering to feel integrated.

### Tooltips & Overlays
*   **Visuals:** Use `inverse_surface` (Deep Charcoal) with `inverse_on_surface` text. This provides a "Noir" punch against the otherwise light system. Sharp edges only.

### Signature Component: The Editorial Carousel
A bespoke component where the image is offset (asymmetric) and the typography (`display-sm`) overlaps the edge of the photo, utilizing the Gold `primary` color for the text that sits over the image.

---

## 6. Do's and Don'ts

### Do:
*   **Embrace Asymmetry:** Offset images and text blocks to create a rhythmic, magazine-like flow.
*   **Use Generous Margins:** Luxury is defined by the space you *don't* use. Increase standard margins by 1.5x.
*   **Tonal Transitions:** Use background color shifts to guide the user from "Discovery" (light) to "Action" (slightly darker/tinted).

### Don't:
*   **Don't use Rounded Corners:** Every element—from buttons to images—must have a `0px` radius to maintain architectural rigor.
*   **Don't use Standard Dividers:** 1px horizontal lines are the enemy of this system. Use space or tonal shifts instead.
*   **Don't Overuse Gold:** Gold is an accent, not a primary fill. If everything is gold, nothing is luxury. Use it sparingly for intent and "sparkle."
*   **Don't use Center-Alignment for everything:** While elegant, over-reliance on center-alignment feels like a wedding invitation. Use left-aligned "staggered" layouts for a more modern, editorial feel.