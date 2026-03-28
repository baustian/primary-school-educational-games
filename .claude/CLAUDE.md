# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**primary-school-educational-games** is a collection of educational games built with React + Vite for primary school students. The project is in early development (feature/project-initialization stage) with infrastructure in place but game implementations pending.

## Development Commands

```bash
npm run dev       # Start Vite dev server with HMR (Hot Module Replacement) on localhost:5173
npm run build     # Build production bundle to dist/
npm run lint      # Run ESLint on all .js/.jsx files
npm run preview   # Preview the production build locally
```

## Architecture & Code Organization

### High-Level Structure

The application follows a modular game structure:

- **Entry Point**: `src/main.jsx` → `src/App.jsx` (currently placeholder, needs Router setup)
- **Games Directory**: `src/games/{game-name}/` - Each game is self-contained
  - `index.jsx` - Game component/entry point
  - `components/` - Game-specific React components
  - `data/` - Game data, word lists, configuration
- **Shared Components**: `src/components/` - Reusable across all games (e.g., GameCard)
- **Shared Data**: `src/data/games.js` - Game registry/metadata
- **Styling**: `src/index.css` - Global styles; Tailwind CSS via Vite plugin

### Game Structure Pattern

Each game should follow this structure:
```
src/games/{game-slug}/
├── index.jsx              # Main game component
├── components/            # Game-specific UI components
│   ├── Board.jsx
│   ├── ResultScreen.jsx
│   └── ...
└── data/
    └── gameData.js        # Words, levels, configuration
```

### Tech Stack Notes

- **React 19** - Latest version with no-JSX compiler
- **Vite 8** - Modern build tool with instant HMR
- **Tailwind CSS 4** - Via @tailwindcss/vite plugin (integrated into Vite build)
- **React Router DOM 7** - Installed but not yet configured in App.jsx
- **ESLint** - Configured with React hooks rules and React Refresh support

## ESLint Configuration

ESLint rules in `eslint.config.js`:

- **Base**: JavaScript recommended rules + React Hooks recommended
- **React Refresh**: Vite-specific rules for fast refresh
- **Custom**: Unused variables pattern ignores uppercase names (`^[A-Z_]`) - allows unused Components and CONSTANTS

Run linting with `npm run lint` before committing.

## Key Implementation Notes

1. **React Router Setup**: The project imports React Router but App.jsx doesn't use it yet. When implementing game navigation, set up the routing structure in App.jsx to load games dynamically from `src/data/games.js`.

2. **Tailwind CSS**: All styling should use Tailwind utility classes. The @tailwindcss/vite plugin handles CSS compilation.

3. **HMR in Development**: Vite provides instant refresh. Modify components and see changes without page reload.

4. **No TypeScript Currently**: While @types packages are installed, the codebase uses plain JavaScript/JSX. Add TypeScript when needed (requires updating eslint config and file extensions).

5. **Empty Game Files**: The word-factory game structure exists but implementations are empty. These are placeholders ready for development.

## Current Branch Context

Working on `feature/project-initialization` - project scaffolding and infrastructure setup. The game implementation files are structured but empty, ready for game logic development.
