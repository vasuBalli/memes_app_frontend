<!--
Guidance for AI coding agents working on this repo.
Keep concise, concrete, and tied to files in the repository.
-->

# Copilot / AI Agent Instructions — Memeverse Frontend

- **Project type:** Vite + React (TSX) single-page app. Entry: `src/main.tsx` -> `src/App.tsx`.
- **Build/dev:** `npm i` then `npm run dev` (Vite). Built output: `build/` (see `vite.config.ts`).

- **Key files to inspect when changing behavior:**
  - `src/App.tsx` — orchestrates data loading, infinite scroll, view modes, and defines the `Meme` interface used across components.
  - `src/main.tsx` — app bootstrapping.
  - `vite.config.ts` — important Vite aliases and dev server config (port `5500`, `outDir: 'build'`, proxy `/api` → `https://getdownload.site`).
  - `package.json` — scripts: `dev` (vite) and `build` (vite build).
  - `src/components/` — all UI components. `components/ui/` contains design primitives and exported UI helpers used across the app.

- **Data flow & API conventions:**
  - The app fetches data from a proxied backend at the `/api` path during development. Example: `fetch('/api/memes/')` in `src/App.tsx`.
  - The code expects the remote response shape to include a `data` array: `const data: Meme[] = result.data` (see `loadMoreMemes`). When adding features, follow that shape or adapt both client and backend accordingly.
  - The authoritative client-side type for memes is the `Meme` interface in `src/App.tsx`. Prefer updating that interface there if you change fields used across components.

- **Behavioral patterns to preserve:**
  - Infinite scroll: implemented with a window `scroll` listener and a 400px threshold before bottom (see `App.tsx`). If switching to intersection observers, ensure the same rate-limiting/hasMore semantics remain.
  - Click flow: clicking a card with `type === 'video'` opens `ReelsView` with initial index computed from visible videos — keep that logic when refactoring card navigation.
  - ID assignment: the client maps incoming items into unique `id` strings using current length + index; be careful when deduplicating/merging server-provided IDs.

- **Import / path conventions:**
  - `vite.config.ts` defines alias `'@'` → `./src`. Prefer `import X from '@/components/...'` where convenient.
  - Many UI primitives are centralized under `src/components/ui/` — use these to maintain consistent styling.

- **Styling & UI:**
  - Tailwind-style utility classes are used throughout JSX (see `App.tsx` and component files). Keep classes consistent with the existing patterns (no global CSS overrides without checking `src/styles/globals.css` and `src/index.css`).
  - Icons: `lucide-react` is used (e.g., `Loader2` in `App.tsx`). Avatars use DiceBear seeds via external URLs.

- **Dev server quirks & environment:**
  - Dev server proxies `/api` to `https://getdownload.site` (defined in `vite.config.ts`), so local API calls hit that domain by default. For isolated test work, mock `/api/memes/` responses or run a local proxy.
  - The project uses the SWC React plugin: `@vitejs/plugin-react-swc` (fast builds). Expect modern JSX/TSX transforms.

- **Patterns to follow when changing code:**
  - Keep components as small function components; prefer prop drilling for simple flows (existing code does this) rather than introducing heavy global state.
  - Update the `Meme` interface in `src/App.tsx` when adding/removing fields used across components.
  - When modifying network requests, update both the fetch usage and any code that maps `result.data` into components (see `loadMoreMemes`).

- **Where to look for additional conventions and examples:**
  - `src/components/MemeCard.tsx`, `MasonryCard.tsx`, `ReelsView.tsx` — examples of card rendering patterns and prop usage.
  - `src/components/ui/` — primitives and shared UI hooks (look at `button.tsx`, `avatar.tsx`, etc.).

- **DO NOT assume:**
  - There is no existing `.github/copilot-instructions.md`; this file is the canonical agent guidance. Do not alter backend assumptions without checking `vite.config.ts` proxy and `src/App.tsx` fetch usage.

If anything in this guidance is unclear or you want me to add more examples (e.g., typical refactor checklists, tests or exact component prop shapes), tell me which area to expand and I will iterate.
