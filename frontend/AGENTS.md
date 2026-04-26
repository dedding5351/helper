# Next.js Best Practices & Standards

This document outlines the architectural patterns and development standards for building fluent, modern, and high-performance Next.js applications within this project.

## 1. Core Architecture: App Router & React Server Components (RSC)

The App Router is the foundation of our application. We prioritize Server Components to minimize client-side JavaScript and improve performance.

- **Server-First Approach:** Always start with a Server Component. Only use 'use client' when necessary for interactivity (state, effects, browser APIs).
- **Component Colocation:** Keep components, styles, and types close to the routes that use them. Use a `components/` directory within the app folder for route-specific shared components.
- **Loading UI:** Utilize `loading.tsx` for instant loading states and `Suspense` for granular data fetching boundaries.
- **Error Handling:** Use `error.tsx` for graceful error recovery and `not-found.tsx` for 404 handling.

## 2. Data Fetching & Mutations

- **Server-Side Fetching:** Fetch data directly in Server Components using `fetch` with appropriate caching and revalidation strategies (`next: { revalidate: ... }`).
- **Server Actions:** Use Server Actions for data mutations (POST, PUT, DELETE). Consolidate actions into `actions.ts` files within relevant route segments.
- **Optimistic Updates:** Implement `useOptimistic` for a snappy user experience during mutations.
- **Streaming:** Leverage UI streaming to show parts of the page as they become ready.

## 3. State Management

- **URL as State:** Favor the URL (search params, path params) for shareable state like filters, pagination, and tabs.
- **Server State:** Use the server-side cache and revalidation for data-driven state.
- **Client State:** Use `useState` or `useReducer` for localized UI state. For complex global UI state, use lightweight libraries like Zustand or React Context (sparingly).

## 4. Styling & UI Aesthetics: Luminous Minimalism

We adhere to the **Luminous Minimalism** design system. Our goal is to transform complex interactions into a weightless, "editorial" experience using light as the primary architect.

- **The "No-Line" Rule:** Absolute prohibition of 1px solid borders for sectioning or containment. Define boundaries solely through background color shifts (`surface` to `surface-container`) or tonal transitions.
- **Tonal Architecture:**
    - **Layer 0 (Base):** `#f7f9fb`
    - **Layer 1 (Nav/Sidebar):** `#eaeff2`
    - **Layer 2 (Cards/Content):** `#ffffff` (Surface-container-lowest)
- **The Glass & Gradient Rule:** Use linear gradients (135deg) from `primary` (#4f4dcf) to `primary-container` (#7777fa) for primary actions. Use `backdrop-filter: blur()` for floating elements and modals.
- **Ambient Shadows:** Only use large, soft, low-opacity shadows (e.g., `0 20px 40px rgba(44, 52, 55, 0.05)`). Avoid harsh, dark shadows.
- **Typography:** Use **Inter**. Tighten tracking for displays (`-0.02em`) and increase it for labels (`0.05em` uppercase). Never use pure black for text; use `on-surface` (#2c3437).

## 5. Component Library: shadcn/ui

We use **shadcn/ui** as our foundational component library, customized to fit the **Luminous Minimalism** design system.

- **Customization Mandate:** Do not use default shadcn styles. Immediately modify `components/ui/` files to match the design system:
    - **Remove Borders:** Strip `border` classes from Cards, Accordions, and Separators. Use tonal shifts instead.
    - **Roundedness:** Stick to `md` (0.375rem) or `lg` (0.5rem). Avoid `xl` or `full` for main containers.
    - **Inputs:** Use the "Ghost Border" (outline-variant at 10% opacity) and white background.
    - **Buttons:** Apply the brand gradient to Primary buttons and `surface-container-high` to Secondary buttons.
- **Documentation:** Refer to `shadcn-docs.txt` for components and `DESIGN_SYSTEM.md` for specific tonal values and layout rules.
- **Consistency:** If a shadcn primitive exists, use it as the base and apply the Luminous Minimalism overrides.

## 6. Component Design & Code Organization

- **Atomic Modularity:** Build components as small, single-responsibility units.
- **Reusability First:** Design UI elements to be generic. Store shared UI in `components/ui/` (if shadcn-based) or `components/` (if custom).
- **Composition over Props-Drilling:** Use the `children` prop and specialized "slots" (following the Radix/shadcn pattern).
- **Strict Separation of Concerns:** Keep presentation separate from logic. Move complex logic into custom hooks.
- **Explicit Interfaces:** Define strict TypeScript interfaces for all props.

## 7. Performance Optimization

- **Image Optimization:** Always use `next/image` for automatic resizing, lazy loading, and WebP support.
- **Font Optimization:** Use `next/font` to host fonts locally and prevent layout shifts.
- **Code Splitting:** Rely on Next.js's automatic code splitting. Use `dynamic()` imports for large client-side components that aren't immediately visible.
- **Prewarming & Prefetching:** Take advantage of `next/link`'s automatic prefetching for background page loading.

## 6. Project Structure

```text
app/
├── (routes)/          # Grouped routes
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── components/ # Route-specific components
├── components/        # Shared UI components (Button, Input, etc.)
├── lib/               # Utility functions and shared logic
├── types/             # Shared TypeScript interfaces
└── actions/           # Global or shared Server Actions
```

## 7. Development Standards

- **TypeScript:** Use strict TypeScript. Avoid `any`. Define interfaces for all component props and API responses.
- **Clean Code:** Follow DRY (Don't Repeat Yourself) but prioritize readability over premature abstraction.
- **Accessibility (a11y):** Use semantic HTML (e.g., `<main>`, `<nav>`, `<article>`) and ensure proper ARIA labels where necessary.
