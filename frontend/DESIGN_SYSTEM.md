# Design System Strategy: Luminous Minimalism

## 1. Overview & Creative North Star
This design system is built upon the North Star of **"The Radiant Archive."** In a high-end enterprise support environment, the objective is to transform complex, data-heavy interactions into a weightless, ethereal experience. We are moving away from the "boxy" enterprise standard toward an editorial layout that breathes.

The aesthetic is defined by "Luminous Minimalism"—where light is the primary architect. We achieve this through intentional asymmetry, massive white space, and a rejection of traditional structural lines. By treating the UI as a series of floating, translucent layers, we create a sense of infinite depth and premium clarity.

---

## 2. Colors & Tonal Architecture
The core palette is defined by a distinct set of foundational colors:
- **Primary:** `#5D5CDE`
- **Secondary:** `#94A3B8`
- **Tertiary:** `#8C6C94`
- **Neutral:** `#F8FAFC`

These base colors form the foundation of our aesthetic, using color not merely to decorate, but to signal hierarchy and state through intentional tonal shifts.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or containment. Boundaries must be defined solely through background color shifts or tonal transitions. 
- Use `surface` (#f7f9fb) as your canvas.
- Use `surface-container-low` (#f0f4f7) to define large regions.
- Use `surface-container-lowest` (#ffffff) for elevated content cards.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of frosted glass.
- **Layer 0 (Base):** `background` (#f7f9fb).
- **Layer 1 (Navigation/Sidebar):** `surface-container` (#eaeff2).
- **Layer 2 (Content Cards):** `surface-container-lowest` (#ffffff).
- **Layer 3 (Floating Modals):** `surface-bright` (#f7f9fb) with 80% opacity and a 20px backdrop-blur.

### The "Glass & Gradient" Rule
To evoke a premium, "Framer-esque" soul, use subtle gradients for primary actions. Instead of a flat `primary` fill, use a linear gradient from `primary` (#4f4dcf) to `primary-container` (#7777fa) at a 135-degree angle. This provides a tactile "glow" that feels modern and expensive.

---

## 3. Typography: The Editorial Voice
We utilize **Inter** with a specific focus on tracking and vertical rhythm to convey authority.

- **Display Scale (`display-lg` to `display-sm`):** Reserved for hero moments and empty states. These should have a slight negative letter-spacing (-0.02em) to feel "tight" and impactful.
- **Headline:** The primary anchor for page content. Use a clean, balanced weight.
- **Body:** Standard text for readability and secondary descriptions.
- **Label:** Used for metadata and UI elements, conveying a structured and precise feel.

---

## 4. Elevation & Depth
Depth in this system is achieved through **Tonal Layering** rather than structural geometry.

### The Layering Principle
Stack your surfaces to create natural lift. A `surface-container-lowest` (#ffffff) card placed on a `surface-container-low` (#f0f4f7) background creates a "soft lift" that is felt rather than seen.

### Ambient Shadows
When an element must float (e.g., a dropdown or modal), use an "Ambient Shadow":
- **Color:** Use a tinted version of `on-surface` (#2c3437) at 5% opacity.
- **Blur:** Large values only (e.g., `box-shadow: 0 20px 40px rgba(44, 52, 55, 0.05)`). 
- **Instruction:** Avoid harsh, dark shadows. The shadow should look like the object is blocking soft, multidirectional studio light.

### The "Ghost Border" Fallback
If a container requires a boundary for accessibility (e.g., an input field), use the **Ghost Border**:
- Use `outline-variant` (#acb3b7) at **15% opacity**.
- This creates a "suggestion" of a container without breaking the luminous flow of the page.

---

## 5. Components

### Buttons
- **Primary:** Solid fill using the Primary color (`#5D5CDE`). White text.
- **Secondary:** Light gray/neutral background fill. Subtle contrast.
- **Inverted:** Solid black/dark fill. White text.
- **Outlined:** Transparent background with a solid outline/border. Text matches the border color.

### Input Fields
- **Search & Standard Inputs:** Use a light neutral background (e.g., `#F8FAFC`) with a subtle border. Left-aligned icons (e.g., a search magnifying glass) are standard.

### Progress Indicators
- **Linear Bars:** Simple, horizontal progress bars utilizing the Primary (`#5D5CDE`), Secondary (`#94A3B8`), or Tertiary (`#8C6C94`) colors against a muted track background.

### Icon & Tool Buttons
- **Action Icons:** Small, square buttons used for tools (e.g., edit, magic wand, shapes, tag, trash). These can utilize solid background colors (Primary, Secondary, Tertiary, or Danger/Red) with white icons, or subtle tinted backgrounds (e.g., a light pink edit button).
- **Navigational Icons:** Light grey background pill containers housing standard icons (Home, Search, User).
- **Labeled Action Buttons:** Solid background (e.g., Primary) with an icon alongside a text label (e.g., pencil icon + "Label").

### Cards & Lists
- **Rule:** Absolute prohibition of divider lines (`<hr>` or `border-bottom`). 
- **Separation:** Use vertical white space (32px or 48px) to separate list items, or alternating tonal shifts between `surface-container-lowest` and `surface-container-low`.

### Chips
- **Action Chips:** `surface-container-high` background with `secondary` text.
- **Selection Chips:** `tertiary-container` (#f6d0fd) background with `on-tertiary-container` (#614469) text to provide that "soft lavender" accent requested.

### Glass Modals
Utilize `surface-container-lowest` with 70% opacity and a `backdrop-filter: blur(12px)`. This allows the enterprise data underneath to "bleed" through softly, maintaining context while focusing the user.

---

## 6. Do's and Don'ts

### Do
- **Do** use asymmetrical layouts. Push a headline to the far left and the body text to a constrained column on the right.
- **Do** use `primary-fixed-dim` (#6a69ec) for subtle hover states on interactive text.
- **Do** embrace "Empty Space." If a section feels crowded, increase the padding-global to at least 64px.

### Don't
- **Don't** use pure black (#000000) for text. Use `on-surface` (#2c3437) to keep the contrast premium and soft.
- **Don't** use `xl` (0.75rem) or `full` roundedness for primary containers. Keep the enterprise feel "sharp but sophisticated" using `md` (0.375rem) or `lg` (0.5rem).
- **Don't** use heavy icons. Use ultra-thin (2px or 1.5px) stroke weights to match the Geist/Inter aesthetic.

---

## Director's Closing Note
This design system is about **restraint**. The "Luminous Minimalist" approach succeeds when the designer trusts the white space. Every element should feel like it was placed with a pair of tweezers. If an element doesn't serve a functional purpose or contribute to the "glow" of the archive, remove it.