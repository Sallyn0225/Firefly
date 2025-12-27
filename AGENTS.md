# Repository Guidelines

## Project Structure & Module Organization

- `src/`: Astro site source.
  - `src/pages/`: routes (e.g. `posts/[slug]/index.astro`, `search.astro`).
  - `src/layouts/` + `src/components/`: UI and layout building blocks (`.astro` + `.svelte`).
  - `src/config/`: site/theme feature toggles and integrations.
  - `src/content/`: content collections (`posts/`, `spec/`) and `content.config.ts` schema.
  - `src/plugins/` and `src/integrations/`: custom remark/rehype/astro integrations.
- `public/`: static assets served as-is.
- `docs/`: documentation and images.
- `scripts/`: repo utilities (e.g. `scripts/new-post.js`).

## Build, Test, and Development Commands

Requirements: Node.js >= 20 (CI runs 22/23) and `pnpm` (enforced via `npx only-allow pnpm`).

- `pnpm install` (or CI-style `pnpm install --frozen-lockfile`): install deps.
- `pnpm dev`: start dev server (Astro).
- `pnpm build`: production build to `dist/`.
- `pnpm preview`: serve the production build locally.
- `pnpm check`: run `astro check`.
- `pnpm type-check`: TypeScript `tsc --noEmit`.
- `pnpm new-post my-title` (or `pnpm new-post weekly/2025-01-01-my-title`): create a new post stub in `src/content/posts/`.

## Coding Style & Naming Conventions

- Formatting/linting: Biome (`biome.json`). Use tabs for indentation and double quotes.
- Run before PR: `pnpm format` and `pnpm lint` (both write fixes under `src/`).
- Naming: Components use `PascalCase` filenames (e.g. `src/components/content/PostCard.astro`); directories are lowercase.

## Testing Guidelines

This repo doesn’t use a dedicated unit test runner. Treat these as the quality gate:
- `pnpm check` + `pnpm type-check` for correctness.
- `pnpm build` to catch build-time regressions.
- For UI/UX changes, verify in both `pnpm dev` and `pnpm preview`.

## Commit & Pull Request Guidelines

- Prefer Conventional Commits (seen in history): `feat: ...`, `fix: ...`, `build(deps): ...`, `chore: ...`.
- Keep PRs focused and follow `.github/pull_request_template.md` (describe changes, how to test, link issues, add screenshots for UI changes).
- Don’t commit generated output (`dist/`) or dependencies (`node_modules/`).

## Configuration & Secrets

- Search indexing supports MeiliSearch; `pnpm index:meili` requires `MEILI_MASTER_KEY` in your environment.

## Agent Notes

- Read `CLAUDE.md` for architecture and content/config conventions before large refactors.
