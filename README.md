# Primary School Educational Games

A collection of interactive educational games built with React + Vite for primary school students. The project provides an engaging platform for learning through gameplay.

## Getting Started

### Prerequisites
- Node.js 16+
- npm

### Installation & Development

```bash
npm install          # Install dependencies
npm run dev          # Start dev server with HMR on localhost:5173
npm run build        # Build production bundle to dist/
npm run preview      # Preview the production build locally
npm run lint         # Run ESLint on all .js/.jsx files
```

## Project Structure

Each game is self-contained in its own directory following a consistent pattern:

```
src/
├── games/
│   ├── word-factory/        # Example game
│   │   ├── index.jsx         # Main game component
│   │   ├── components/       # Game-specific components
│   │   └── data/            # Game data & word lists
│   └── {game-slug}/         # Future games follow same pattern
├── components/              # Shared components across all games
├── data/
│   └── games.js            # Game registry & metadata
├── App.jsx                  # Main app entry point
├── main.jsx                 # Application bootstrap
└── index.css               # Global styles
```

## Architecture

- **Game Structure**: Each game is modular and self-contained with its own components, data, and logic
- **Shared Components**: Reusable UI elements (GameCard, etc.) live in `src/components/`
- **Game Registry**: `src/data/games.js` maintains metadata and routing for all games
- **Navigation**: React Router DOM handles routing between games

## Tech Stack

- **React 19** - Latest version with modern JSX
- **Vite 8** - Fast development server with HMR (Hot Module Replacement)
- **Tailwind CSS 4** - Utility-first CSS via @tailwindcss/vite plugin
- **React Router DOM 7** - Client-side routing between games
- **ESLint** - Code quality and consistency checking

## Development Guidelines

- Use **Tailwind utility classes** for all styling (no custom CSS needed in most cases)
- Follow the game structure pattern when adding new games
- Run `npm run lint` to check code quality before committing
- HMR is enabled in development—changes reload instantly without page refresh

## Current Status

Project scaffolding complete. Game implementations are in progress with Word Factory as the first game being developed.
