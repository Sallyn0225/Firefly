# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Firefly is an Astro-based blog theme template forked from [Fuwari](https://github.com/saicaca/fuwari). It's a modern, highly customizable static site generator for personal blogs with extensive features including dual sidebars, grid layouts, interactive widgets, and multi-language support.

**Tech Stack:**
- **Framework:** Astro 5.16.6 with Svelte components
- **Styling:** Tailwind CSS with PostCSS (nesting support)
- **Languages:** TypeScript 5.9.2
- **Package Manager:** pnpm ≥9 (enforced via preinstall hook)
- **Node Version:** ≤22

## Development Commands

```bash
# Install dependencies
pnpm install

# Development server (http://localhost:4321)
pnpm dev

# Build for production
pnpm build

# Preview production build locally
pnpm preview

# Type checking
pnpm check
pnpm type-check

# Code quality
pnpm format    # Format code with Biome
pnpm lint      # Lint and auto-fix with Biome

# Content management
pnpm new-post <filename>           # Create new blog post
pnpm index:meili                   # Index content to MeiliSearch
```

## Architecture Overview

### Content Layer (Astro Collections)

Content is managed through Astro's content collections defined in `src/content.config.ts`:

- **Posts Collection** (`src/content/posts/`): Blog posts with rich frontmatter schema
- **Spec Collection** (`src/content/spec/`): Specification documents

Post frontmatter supports:
- Basic metadata: `title`, `published`, `updated`, `description`, `draft`
- Organization: `tags[]`, `category`, `pinned`
- Visual: `image` (can be path or `"api"` for random cover)
- I18n: `lang` (overrides site language)
- Licensing: `author`, `sourceLink`, `licenseName`, `licenseUrl`
- Internal navigation: `prevTitle`, `prevSlug`, `nextTitle`, `nextSlug` (auto-generated)

### Configuration System

All configuration lives in `src/config/`:

```
src/config/
├── index.ts              # Main config aggregator
├── siteConfig.ts         # Site metadata, theme, favicon, pages toggles
├── profileConfig.ts      # User profile and social links
├── navBarConfig.ts       # Navigation menu structure (supports nested menus)
├── sidebarConfig.ts      # Sidebar layout (single/dual sidebar modes)
├── commentConfig.ts      # Comment systems (Twikoo/Waline/Giscus/Disqus/Artalk)
├── musicConfig.ts        # APlayer music player settings
├── pioConfig.ts          # Live2D/Spine mascot configuration
├── sakuraConfig.ts       # Cherry blossom effects
├── fontConfig.ts         # Custom font declarations
├── coverImageConfig.ts   # Random cover image API
├── adConfig.ts           # Advertisement widgets
├── friendsConfig.ts      # Friend links
├── sponsorConfig.ts      # Sponsorship page
├── licenseConfig.ts      # Content licensing
├── announcementConfig.ts # Site announcements
├── footerConfig.ts       # Footer settings
├── FooterConfig.html     # Footer HTML content
└── expressiveCodeConfig.ts # Code highlighting themes
```

**Key Configuration Pattern:**
- Configurations export typed objects
- Import from `@/config` barrel export
- Many features can be toggled via `siteConfig.pages.*`

### Layout System

Two main layouts in `src/layouts/`:

1. **Layout.astro**: Base layout with:
   - Dynamic sidebar configuration (none/left/right/both)
   - Wallpaper modes (banner/full-screen/solid)
   - Swup page transitions
   - Global widgets and effects

2. **MainGridLayout.astro**: Grid/masonry layout variant for post listings

Layouts use composition with components from `src/components/layout/`.

### Component Organization

```
src/components/
├── comment/         # Comment system integrations
├── common/          # Reusable UI primitives (dropdowns, buttons, pagination)
├── content/         # Content display (PostCard, PostMeta, Profile)
├── effects/         # Visual effects (Fancybox, KaTeX, Sakura)
├── interactive/     # User interaction (TOC, theme switcher, settings)
├── layout/          # Layout building blocks (header, footer, sidebars)
├── misc/            # Utility components
├── pages/           # Page-specific components
└── widget/          # Sidebar widgets (calendar, stats, ads)
```

**Component Technology Mix:**
- `.astro` files for static/SSR components
- `.svelte` files for interactive client-side components
- Heavy use of Svelte stores for client state management

### Routing Structure

```
src/pages/
├── [...page].astro       # Blog post listing with pagination
├── posts/
│   └── [slug]/
│       └── index.astro   # Individual post page
├── archive.astro         # Archive page
├── friends.astro         # Friend links
├── about.astro           # About page
├── bangumi.astro         # Bangumi tracking (anime/games)
├── sponsor.astro         # Sponsorship page
├── guestbook.astro       # Guestbook with comments
├── search.astro          # Search interface (Pagefind)
├── rss.xml.ts            # RSS feed generation
├── robots.txt.ts         # Robots.txt
├── api/                  # API endpoints
└── og/                   # Open Graph image generation (Satori)
```

### Plugin System

Custom Astro/Remark/Rehype plugins in `src/plugins/`:

**Remark Plugins (Markdown AST):**
- `remark-reading-time.mjs`: Calculate reading time
- `remark-excerpt.js`: Extract post excerpts
- `remark-directive-rehype.js`: Custom directive handling
- `remark-mermaid.js`: Mermaid diagram support

**Rehype Plugins (HTML AST):**
- `rehype-email-protection.mjs`: Obfuscate email addresses (base64/rot13)
- `rehype-figure.mjs`: Wrap images in figure tags with titles
- `rehype-component-admonition.mjs`: GitHub-style admonitions
- `rehype-component-github-card.mjs`: GitHub repository cards
- `rehype-mermaid.mjs`: Mermaid rendering

**Expressive Code Plugins:**
- `custom-copy-button.js`: Custom code copy button
- `language-badge.ts`: Language indicators on code blocks

### Utilities Layer

`src/utils/` contains shared utilities:

- `content-utils.ts`: Post filtering, sorting, category/tag extraction
- `date-utils.ts`: Date formatting
- `image-utils.ts`: Image processing, OG image generation
- `url-utils.ts`: URL manipulation
- `setting-utils.ts`: User preference persistence (localStorage)
- `layout-utils.ts`: Layout mode management
- `responsive-utils.ts`: Responsive behavior utilities
- `widget-manager.ts`: Widget state management
- `sakura-manager.ts`: Cherry blossom effect manager
- `tocUtils.ts`: Table of contents generation
- `icon-loader.ts`: Dynamic icon loading from Iconify

### Integration Points

**Astro Integrations** (configured in `astro.config.mjs`):
- `@astrojs/tailwind`: Tailwind CSS with nesting
- `@swup/astro`: Page transitions
- `astro-expressive-code`: Enhanced code blocks
- `@astrojs/svelte`: Svelte component support
- `@astrojs/sitemap`: XML sitemap generation
- `astro-icon`: Icon management
- `searchIndexer` (custom): Search index generation

**External Services:**
- **Search**: Pagefind (client-side) or MeiliSearch (server-side)
- **Comments**: Twikoo, Waline, Giscus, Disqus, or Artalk
- **Music**: MetingJS + APlayer
- **Analytics**: Waline/Twikoo page view tracking

## Code Style and Quality

**Formatter/Linter:** Biome (configured in `biome.json`)
- Tab indentation
- Double quotes for JavaScript
- Enforced rules for style consistency
- Special overrides for `.svelte`, `.astro`, `.vue` files

**TypeScript:**
- Strict mode enabled (`tsconfig.json`)
- Path aliases: `@/*` maps to `src/*`

**Commit Convention:**
Use [Conventional Commits](https://www.conventionalcommits.org/) format:
```
feat: add new feature
fix: resolve bug
docs: update documentation
style: formatting changes
refactor: code restructuring
test: add tests
chore: maintenance tasks
```

## Important Development Notes

### Working with Content

1. **Creating Posts:**
   - Use `pnpm new-post <filename>` to scaffold
   - Posts must be in `src/content/posts/`
   - Supports both `.md` and `.mdx` formats

2. **Images:**
   - Post images can be relative (`./cover.jpg`) or use API (`image: "api"`)
   - Random cover API configured in `coverImageConfig.ts`
   - Images in markdown get auto-wrapped in figure tags with title attributes

3. **Markdown Extensions:**
   - GitHub-style admonitions (Note, Tip, Important, Caution, Warning)
   - Math formulas via KaTeX (inline `$...$`, block `$$...$$`)
   - Mermaid diagrams
   - Custom directives for GitHub cards

### Modifying Configuration

- **Never hardcode site-specific values** - use config files
- Most visual features can be toggled without code changes
- Check `siteConfig.pages.*` before adding conditional logic
- Font changes: Update `fontConfig.ts` and ensure fonts are imported

### Working with Layouts

- Sidebar composition is controlled by `sidebarConfig.ts`
- Layout modes (single/dual sidebar) can be switched at runtime
- Wallpaper modes support: banner, full-screen, solid color
- Use layout utilities from `layout-utils.ts` for responsive breakpoints

### Internationalization

- Default language set in `siteConfig.ts` (`SITE_LANG`)
- Supported: `zh_CN`, `zh_TW`, `en`, `ja`, `ru`
- Translation files in `src/i18n/languages/`
- Per-post language override via frontmatter `lang` field

### Performance Considerations

- Astro generates static HTML by default
- Client-side JS is opt-in via `client:*` directives
- Swup handles page transitions without full reloads
- Images are optimized through `sharp`
- Code blocks are pre-rendered on build

## Common Tasks

### Adding a New Page

1. Create `.astro` file in `src/pages/`
2. Add route to `navBarConfig.ts` if needed
3. Update sitemap filter in `astro.config.mjs` if page is toggleable
4. Add page toggle to `siteConfig.pages.*` if appropriate

### Adding a Widget

1. Create component in `src/components/widget/`
2. Add to appropriate sidebar in `sidebarConfig.ts`
3. Export configuration if needed from `src/config/`

### Modifying Markdown Processing

- Remark plugins: Modify markdown AST before HTML conversion
- Rehype plugins: Modify HTML AST after conversion
- Register new plugins in `astro.config.mjs` markdown config

### Debugging

- Check browser console for client-side errors
- Use Astro dev server logs for SSR issues
- Run `pnpm check` for type errors
- Use `pnpm type-check` for declaration file validation

## Deployment

Framework preset: **Astro**
Build command: `pnpm run build`
Output directory: `dist`
Install command: `pnpm install`

Compatible platforms: Vercel, Netlify, GitHub Pages, Cloudflare Pages, EdgeOne Pages (see [Astro deployment guide](https://docs.astro.build/zh-cn/guides/deploy/))
