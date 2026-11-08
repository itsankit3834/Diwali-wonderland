# A Diwali Wonderland ❤️

A romantic, interactive Diwali microsite built with React, TypeScript, Vite, Framer Motion and custom CSS.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

## Personalise it

Open `src/config.ts` and edit:
- `herName`
- `yourName`
- `greeting`
- `letter`
- `finalMessage`
- `wishes`
- `memories`
- `musicSrc`

### Add photos
1. Create `public/memories/`.
2. Copy your photos into that folder.
3. Update `memories` in `src/config.ts`, for example:

```ts
memories: [
  { src: '/memories/first-date.jpg', caption: 'Our first little adventure' },
  { src: '/memories/festival.jpg', caption: 'A favourite evening' },
  { src: '/memories/silly-selfie.jpg', caption: 'My favourite smile' }
]
```

### Add background music
Place an MP3 file at `public/music.mp3`. The site attempts playback after the visitor taps the opening button. Browsers may still restrict autoplay; the on-screen sound control remains available.

## Build for production

```bash
npm run build
npm run preview
```

The production site is generated in `dist/`.

## Deploy on Vercel
1. Push this folder to a GitHub repository.
2. Import the repository in Vercel.
3. Framework preset: Vite.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Deploy and share the generated URL.

## Deploy on Netlify
1. Push this folder to GitHub and import it in Netlify.
2. Build command: `npm run build`.
3. Publish directory: `dist`.
4. Deploy.

## Notes
- All interactive content works without a backend.
- Photos and music are optional.
- The fireworks effect is lightweight CSS/DOM animation and responds to clicks/taps.
- Replace the default letter and placeholder memories before sharing for the most personal result.
