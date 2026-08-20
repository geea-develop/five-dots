# 5 Dots 🎯

A simple mobile-friendly game — click 5 dots from left to right, then back again. Disco party when you finish! 🪩

## Play

👉 https://geea-develop.github.io/five-dots/

## Features

- 🔵 Click dots 1→5, then 5→1
- 🪩 Disco celebration with spinning ball, light beams & floor tiles
- 💬 Random inspirational quote on each win
- 🔊 Sound effects (click tones + disco beat)
- 📳 Haptic feedback on mobile
- 📱 PWA — installable on home screen
- 🔄 Auto-resets after 6 seconds

## Tech Stack

- Next.js 15.1 (static export)
- React 19
- Tailwind CSS 3.4
- TypeScript
- GitHub Pages + GitHub Actions CI/CD

## Development

```bash
npm install
npm run dev
```

Dev server runs on http://localhost:3000

## Deployment

Pushes to `main` auto-deploy to GitHub Pages via the workflow in `.github/workflows/deploy.yml`.

## License

[MIT](LICENSE)
