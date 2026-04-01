# Dino Game Plus

A React + Vite browser game where you run, collect fossils, unlock upgrades, and survive a changing day/night world.

## Project overview

This project is a single-page React game built with Vite.
The player controls a pixel-style dinosaur, collects fossil pickups, grabs powerups, and upgrades movement and income systems between runs.

## Features

- Playable run mode with jump, dash, double jump, and duck slide controls
- Buy upgrades to increase fossil income, combo rewards, shield chance, idle fossil production, and more
- Pick up in-run powerups: shield, speed, giant, ghost, magnet, slow motion, and fossil boost
- Giant mode can crush obstacles and convert them into fossil rewards
- Smooth day/night transitions with bonus rewards on every cycle change
- Buy new dinosaur skins and visual variants
- Automatic passive fossil generation between runs

## Controls

- `Space`, `ArrowUp`, or `W` = Jump
- `D` = Dash forward (if unlocked)
- `A` = Dash backward (if unlocked)
- `S` or `ArrowDown` = Fast drop / duck slide (if unlocked)
- Click the canvas to jump as well

## Local setup

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Build for production

```bash
npm run build
```

## Project structure

- `src/DinoGamePlus.jsx` — main game logic and rendering
- `src/App.jsx` — application entry for the game component
- `src/index.css` — global layout and page styling
- `package.json` — npm scripts and dependencies

## Notes

This game is built with React 19 and Vite.
Feel free to add more skins, upgrades, and powerups as new features.
