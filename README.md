# Brand Icon System

**Icon Studio** — A desktop web app for designing iOS and Android app icons. Preview variants, light/dark modes, platform-specific masks, and export sizes in one place.

## Features

- **App name** — Customize the label (up to 12 characters). Long names show initials in the name variant.
- **Variants** — **Logo** (abstract geometric mark) or **Name** (initials/text).
- **Modes** — Light and dark icon variants.
- **Platform** — iOS (squircle mask, 22.37% radius) or Android (circular mask).
- **Main preview** — Large icon with platform mask and mode comparison.
- **Device preview** — Phone mockup showing the icon on a home screen.
- **Export sizes** — iOS (1024px App Store, 180px, 120px, 87px, 60px, 40px, 29px) and Android (512px Play Store, 432px adaptive, 48dp, 36dp, 24dp).
- **Specs panel** — Platform-specific guidelines (format, color profile, dimensions).
- **Accessibility** — Notes on contrast, legibility, and silhouette.

## Tech Stack

- **Vite** — Fast dev server, HMR
- **React 18** — UI
- **TypeScript** — Type safety
- **Tailwind CSS** — Styling
- **shadcn/ui** — Radix-based components
- **React Router** — Routing
- **Vitest** — Testing

## Getting Started

**Requirements:** Node.js 18+ and npm (or bun)

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd brand-icon-system

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command         | Description                    |
|----------------|--------------------------------|
| `npm run dev`  | Start dev server (Vite)        |
| `npm run build`| Production build               |
| `npm run build:dev` | Development build       |
| `npm run preview`   | Preview production build |
| `npm run lint` | Run ESLint                     |
| `npm run test` | Run Vitest tests               |
| `npm run test:watch` | Run tests in watch mode  |

## Project Structure

```
src/
├── components/       # UI components
│   ├── ControlBar.tsx   # App name, variant, mode, platform controls
│   ├── DevicePreview.tsx # Phone mockup with home screen
│   ├── IconCanvas.tsx   # Renders the icon (logo or name variant)
│   ├── SizeGrid.tsx     # Export size previews
│   ├── SpecsPanel.tsx   # Platform specs
│   └── ui/              # shadcn/ui primitives
├── hooks/
├── lib/
├── pages/
│   ├── Index.tsx        # Main app page
│   └── NotFound.tsx
└── test/
```

## Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages.

### Setup Steps:

1. **Enable GitHub Pages in your repository:**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**

2. **Push your code:**
   - The workflow will automatically deploy when you push to the `main` branch
   - Or manually trigger it from **Actions** → **Deploy to GitHub Pages** → **Run workflow**

3. **Access your deployed app:**
   - After deployment completes, your app will be available at:
   - `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

### Manual Deployment (Alternative):

If you prefer manual deployment:

```sh
# Build the project
npm run build

# The dist folder contains the built files
# You can deploy the contents of dist/ to GitHub Pages manually
```

## License

Private project.
