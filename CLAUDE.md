# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server on port 8080
npm run build    # Production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Architecture

This is a React 18 + TypeScript portfolio site using Vite, Tailwind CSS, and shadcn/ui. Deployed on Vercel with Supabase Edge Functions for backend.

### Key Structure

- **`src/pages/`** - Route components (Index.tsx is the main page with all sections)
- **`src/components/`** - Feature components (Hero, Projects, Skills, GitHubStats, etc.)
- **`src/components/ui/`** - shadcn/ui primitives
- **`src/hooks/`** - Custom React hooks (keyboard navigation, Easter egg detection, animations)
- **`src/integrations/supabase/`** - Supabase client and types (auto-generated)
- **`supabase/functions/`** - Edge Functions (github-activity, turing-chat)

### Path Alias

Use `@/` to import from `src/` (configured in vite.config.ts and tsconfig.json).

### Performance Patterns

- Below-fold sections are lazy loaded via `React.lazy()` and `LazySection` (intersection observer)
- Manual chunk splitting in vite.config.ts separates vendor, UI, and feature bundles
- `TerminalBoot` animation plays on initial load (skipped if user prefers reduced motion)

### Environment Variables

Required in `.env`:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## Commit Guidelines

Do NOT include "Co-Authored-By: Claude" or any AI attribution in commit messages.
