# Claude Code Prompt — Aprender Jugando Platform

## Project Context

I am building a web-based educational games platform for children aged 5-6 years
called "Aprender Jugando" (Spanish for "Learning by Playing"). The repository
already exists and has Vite + React + Tailwind CSS + React Router installed
and configured.

The goal is a scalable platform where new games can be added in the future
without modifying existing ones.

---

## Tech Stack

- React with Vite
- Tailwind CSS (using `@tailwindcss/vite` plugin, already configured in `vite.config.js`)
- React Router DOM
- All code in English (variables, functions, components, comments)
- All user-facing text in Spanish

---

## Existing Folder Structure

```
src/
├── App.jsx
├── main.jsx
├── index.css
├── components/
│   └── GameCard.jsx
├── data/
│   └── games.js
├── pages/
│   └── Home.jsx
└── games/
    └── word-factory/
        ├── index.jsx
        ├── components/
        │   ├── Board.jsx
        │   ├── SyllableCard.jsx
        │   ├── ImageCard.jsx
        │   └── ResultScreen.jsx
        └── data/
            └── words.js

public/
└── games/
    └── word-factory/
        └── images/      ← empty folder, real images will be added later
```

---

## First Game Data

The words for the "Word Factory" game are listed below.
Each word has two correct syllables and two distractor syllables:

| Word | Syllable 1 | Syllable 2 | Distractor 1 | Distractor 2 |
| ---- | ---------- | ---------- | ------------ | ------------ |
| GATO | GA         | TO         | PE           | SA           |
| PERA | PE         | RA         | LU           | TO           |
| LUNA | LU         | NA         | BO           | RE           |
| ROSA | RO         | SA         | GA           | PI           |
| PATO | PA         | TO         | LI           | NU           |
| LIMA | LI         | MA         | CA           | BE           |
| BOCA | BO         | CA         | MU           | RA           |
| CASA | CA         | SA         | DE           | PI           |
| DEDO | DE         | DO         | GA           | NA           |
| MULA | MU         | LA         | RO           | BE           |
| REMO | RE         | MO         | PA           | LI           |
| PIPA | PI         | PA         | NU           | TO           |
| NUBE | NU         | BE         | CA           | MU           |

> Images are not yet available. Use a visual placeholder for now (a large emoji
> or a labeled box with the word name) that will be replaced with the real image later.

---

## What I Need You to Build

### 1. `main.jsx`

Set up `BrowserRouter` wrapping the entire app.

### 2. `App.jsx`

Set up `Routes` for the home screen (`/`) and the game (`/word-factory`).

### 3. `src/data/games.js`

Central game registry with the following structure:

```js
{
  (id, title, description, icon, color, path, available);
}
```

Only "Word Factory" exists for now.

### 4. `src/pages/Home.jsx`

Platform home screen featuring:

- Header with the platform name "Aprender Jugando" and a subtitle
- Grid of available game cards
- Responsive design, child-friendly, vibrant colors

### 5. `src/components/GameCard.jsx`

Individual game card displaying:

- Icon, name and description
- Clicking/tapping navigates to the corresponding game

### 6. `src/games/word-factory/data/words.js`

Data file for all 13 words with their syllables and distractors.

### 7. `src/games/word-factory/index.jsx`

Main game component managing:

- Game state (current word, progress, score)
- Randomized word order
- Answer verification logic
- Navigation between words
- Button to return to home

### 8. `src/games/word-factory/components/ImageCard.jsx`

Displays the placeholder (emoji or labeled box) for the current word.
Must be structured so the real image can be swapped in easily later.

### 9. `src/games/word-factory/components/SyllableCard.jsx`

Individual syllable card with the following requirements:

- Yellow background, referencing the original physical game
- Large and touch-friendly (minimum 60x60px)
- Must support both tap/click and drag & drop

### 10. `src/games/word-factory/components/Board.jsx`

Game board featuring:

- Two slots where syllables are placed
- Four syllable options (2 correct + 2 distractors) in randomized order
- Support for receiving syllables via both drag & drop and tap/click
- Visual feedback: green if correct, red with shake animation if incorrect

### 11. `src/games/word-factory/components/ResultScreen.jsx`

End screen showing:

- Congratulations message
- How many words were answered correctly on the first attempt
- Play again button
- Return to home button

---

## Design Guidelines

- Designed for children aged 5-6 years
- Large touch targets for all interactive elements (minimum 60x60px)
- Large, rounded typography — use Google Font **"Nunito"**
- Vibrant but not aggressive colors: light background, accents in blue, yellow and green
- Syllable cards must be **yellow**, referencing the original physical game
- Fully responsive: works well on both mobile and desktop
- No audio for now

---

## Important Notes

- Use **Tailwind CSS** for all styling — do not create additional CSS files
- All code must be in **English**, all user-facing text in **Spanish**
- The architecture must be scalable: adding a new game in the future should
  only require creating its folder under `src/games/` and adding one entry in `games.js`
- Images are placeholders for now, but the structure must be ready to swap
  them in easily once they are available
