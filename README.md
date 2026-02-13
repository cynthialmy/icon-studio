# Icon Studio

**Icon Studio** — A web app for generating unique iOS and Android app icons. Create original, deterministic designs from app names with algorithmic generation, preview variants, and export production-ready PNG assets.

## Features

### 🎨 Algorithmic Design Generation
- **Unique designs from app names** — Each app name generates a deterministic, original design using hash-based algorithms
- **6 design styles** — Geometric, Modular, Organic, Gradient Waves, Typographic, and Abstract styles
- **Color palette generation** — Automatic color schemes derived from app name hash
- **Reproducible** — Same app name always produces the same design

### 🎯 Icon Variants & Modes
- **Logo variant** — Abstract geometric designs with algorithmic composition
- **Name variant** — Stylized text/initials with gradient effects
- **Light & Dark modes** — Automatic adaptation for both color schemes
- **Platform support** — iOS (squircle mask) and Android (circular mask)

### 📱 Preview & Export
- **Live preview** — Real-time preview of icons at various sizes
- **Device mockup** — See how your icon looks on a phone home screen
- **Size grid** — Preview all export sizes for iOS and Android
- **Export assets** — Download production-ready PNG files in all required sizes

### 📦 Export Capabilities
- **iOS sizes** — 1024px (App Store), 180px, 120px, 87px, 60px, 40px, 29px
- **Android sizes** — 512px (Play Store), 432px (Adaptive FG/BG), 48dp, 36dp, 24dp
- **ZIP download** — All variants (logo/name × light/dark) bundled in organized folders
- **Ready to use** — PNG files optimized for direct use in app stores

### ✨ Additional Features
- **Specs panel** — Platform-specific guidelines and requirements
- **Accessibility checks** — Design validation notes
- **Mode comparison** — Side-by-side light/dark preview
- **All variants grid** — Quick overview of all combinations

## Tech Stack

- **Vite** — Fast dev server with HMR
- **React 18** — Modern UI framework
- **TypeScript** — Type-safe development
- **Tailwind CSS** — Utility-first styling
- **shadcn/ui** — High-quality Radix UI components
- **JSZip** — ZIP file generation for asset exports
- **React Router** — Client-side routing
- **Vitest** — Testing framework

## Getting Started

**Requirements:** Node.js 18+ and npm

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd icon-studio

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

### Creating Icons

1. **Enter app name** — Type your app name (up to 12 characters)
2. **Choose variant** — Select "Logo" for abstract designs or "Name" for text-based icons
3. **Select mode** — Toggle between Light and Dark modes
4. **Pick platform** — Choose iOS or Android to see platform-specific masks
5. **Preview** — See your icon in various sizes and contexts

### Exporting Assets

1. **Configure your icon** — Set app name, variant, mode, and platform
2. **Click "Export Assets"** — Button in the control bar
3. **Wait for generation** — The app generates PNG files for all sizes
4. **Download ZIP** — A ZIP file downloads with organized folders:
   ```
   ios/
     ├── app-name-logo-light-1024px.png
     ├── app-name-logo-light-180px.png
     ├── app-name-logo-dark-1024px.png
     └── ...
   android/
     ├── app-name-logo-light-512px.png
     ├── app-name-logo-light-432px.png
     └── ...
   ```

### Design System

The app uses a deterministic hash-based algorithm to generate designs:

- **Input**: App name (e.g., "Aura", "Hello")
- **Process**:
  - Hash the name to generate a seed
  - Derive color palette (hue, saturation, lightness)
  - Select design style (1 of 6 styles)
  - Generate composition parameters
- **Output**: Unique, reproducible design

Each app name produces a consistent design, making it perfect for:
- Brand consistency
- Version control
- Reproducible builds

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
│   ├── ControlBar.tsx   # App name, variant, mode, platform controls + export button
│   ├── DevicePreview.tsx # Phone mockup with home screen
│   ├── IconCanvas.tsx   # Renders the icon (logo or name variant)
│   ├── SizeGrid.tsx     # Export size previews
│   ├── SpecsPanel.tsx   # Platform specs
│   └── ui/              # shadcn/ui primitives
├── lib/
│   ├── designGenerator.ts    # Hash function, DesignSpec generation
│   ├── designStyles.ts      # 6 design style implementations
│   └── exportUtils.ts        # SVG→PNG conversion, ZIP generation
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
   - Under **Source**, select **GitHub Actions** (not "Deploy from a branch")

2. **Push your code:**
   - The workflow will automatically deploy when you push to the `main` branch
   - Or manually trigger it from **Actions** → **Deploy to GitHub Pages** → **Run workflow**

3. **Access your deployed app:**
   - After deployment completes, your app will be available at:
   - `https://YOUR_USERNAME.github.io/icon-studio/`
   - The workflow automatically configures the correct base path based on your repository name

### How It Works:

- **GitHub Actions workflow** (`.github/workflows/deploy.yml`) handles:
  - Building the production bundle
  - Deploying to GitHub Pages
  - Automatic re-deployment on every push to `main`

- **Vite configuration** automatically detects GitHub Pages environment and sets the correct base path

### Manual Deployment (Alternative):

If you prefer manual deployment:

```sh
# Build the project
npm run build

# The dist folder contains the built files
# You can deploy the contents of dist/ to GitHub Pages manually
```

## Design Styles

The app includes 6 algorithmic design styles:

1. **Geometric** — Symmetric shapes (circles, squares, triangles) with gradient fills
2. **Modular** — Grid-based patterns with dots and shapes
3. **Organic** — Rounded blob shapes with soft gradients
4. **Gradient Waves** — Flowing bands and radial gradients
5. **Typographic** — Stylized letterforms with gradient effects
6. **Abstract** — Layered arcs and overlapping shapes

Each style is selected deterministically based on the app name hash, ensuring consistency while providing visual variety.

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Private project.
