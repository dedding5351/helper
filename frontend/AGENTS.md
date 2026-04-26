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

## 4. Styling & UI Aesthetics

- **Hybrid Approach:** Use **Tailwind CSS** for shadcn/ui components and rapid layout prototyping, and **CSS Modules** for complex, custom component logic or highly specific animations.
- **Tailwind for Composition:** Leverage Tailwind utility classes for spacing, colors, and responsive design to maintain consistency with the component library.
- **Minimize Class Bloat:** Avoid deeply nested or overly complex utility chains. If a component requires extensive styling, encapsulate it within a dedicated CSS Module or a custom shadcn-based component.
- **Modern CSS Features:** Embrace CSS Variables (integrated with Tailwind's theme), Grid, Flexbox, and Container Queries.

## 5. Component Library: shadcn/ui

We use **shadcn/ui** as our foundational component library. It provides accessible, unstyled primitives (Radix UI) that we own and customize.

- **Component Installation:** Use the shadcn CLI (`npx shadcn@latest add <component>`) to bring components into the project.
- **Location:** All shadcn components must reside in `components/ui/`.
- **Customization:** Do not treat shadcn components as immutable library code. Update, restyle, and extend them directly in `components/ui/` to meet specific project needs.
- **Documentation:** Refer to `shadcn-docs.txt` for a complete list of available components, installation guides, and advanced usage patterns.
- **Consistency:** Before building a custom UI element, check if a shadcn primitive exists. If it does, use it as the base.

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
