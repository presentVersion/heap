# SOLTERRA — Renewable City Twin & Renewable Intelligence Platform

> **AI-powered renewable digital twin of Kurnool, India**, featuring real-time telemetry simulation, 3D geographic infrastructure modeling, Mapbox GL JS standard custom layers, and photorealistic GLB asset inspection.

![SOLTERRA Platform](https://img.shields.io/badge/Platform-SolTerra%20Digital%20Twin-00f59b?style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-r174-black?style=for-the-badge&logo=three.js&logoColor=white)
![Mapbox](https://img.shields.io/badge/Mapbox%20GL-v3.9-000000?style=for-the-badge&logo=mapbox&logoColor=white)

---

## 🌟 Key Capabilities

1. **High-Precision 3D City Twin (Kurnool, AP)**:
   - Full 3D Mapbox GL JS dark map of Kurnool with 3D extruded buildings and terrain.
   - **Official Mapbox Matrix Pipeline**: Employs double-precision CPU matrix projection (`camera.projectionMatrix = m * l`) to eliminate 32-bit floating point vertex jitter and surface crumpling.
   - Double-sided sRGB PBR material support preserving original artist textures.

2. **Real-World 3D GLB Asset Integration**:
   - **Meshy Roundabout Model (`meshy-model.glb`)**: Sized at 28 meters and placed at real OpenStreetMap-verified traffic circles in Kurnool replacing statues:
     - *Basaveswara Circle* (`[78.04509, 15.83183]`)
     - *Raj Vihar Circle* (`[78.03836, 15.82874]`)
     - *Sri Ram Circle* (`[78.03457, 15.82681]`)
     - *Bellary Chowrasta* (`[78.02157, 15.82464]`)
     - *Chennamma Circle* (`[78.02591, 15.81489]`)
     - *CCamp Circle* (`[78.04152, 15.80846]`)
   - **Kurnool Ultra Mega Solar Park (900 MW, Gani/Sakunala)**: High-efficiency solar arrays using `solar_panel_1x1.glb` & `soler_panel_setup.glb` (`[78.2573, 15.6634]`).
   - **Smart Flower Dual-Axis Tracker**: Autonomous tracking solar flowers using `smartflower_fbx.glb`.

3. **Interactive 3D Asset Studio**:
   - High-resolution 3D rendered snapshot previews for every asset card on the Assets page.
   - Interactive 3D Model Studio modal with 360° mouse orbit rotation, mousewheel zoom, wireframe toggle, and technical file telemetry.

4. **Dynamic Uncluttered HUD**:
   - Single dynamic holographic HUD card pinned directly to the selected monument via `map.project()`.
   - Bottom Quick-Landmark Selector bar with instant cinematic camera glide to any circle monument.
   - Live weather simulation (rain particle layer toggle).

5. **Spacious Minimalist Design System**:
   - Glassmorphism design tokens (`--bg`, `--text-1`, `--accent`, etc.).
   - Multi-theme support (Obsidian, Midnight Blue, Emerald Matrix, Slate Cyber).
   - Collapsible navigation and fully responsive layouts across all device aspect ratios.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file in the root directory (or use `.env.example`):
```env
VITE_MAPBOX_TOKEN=your_mapbox_public_token_here
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` (or `http://localhost:3001`).

### 4. Production Build
```bash
npm run build
npm run preview
```

---

## 📁 3D Models in Repository
All 3D assets are located in `public/models/`:
- `meshy-model.glb` (94.4 MB) — Kurnool traffic circle monument structure
- `smartflower_fbx.glb` (13.8 MB) — Smartflower dual-axis tracking solar flower
- `solar_panel_1x1.glb` (868 KB) — Ultra Mega Solar Park field array module
- `soler_panel_setup.glb` (383 KB) — Industrial solar canopy structure

---

## 🛠️ Tech Stack
- **Framework**: React 19, TypeScript
- **Bundler**: Vite 6, Tailwind CSS v4
- **3D & GIS**: Mapbox GL JS v3, Three.js r174, Three GLTFLoader
- **Icons**: Lucide React
- **State Management**: Zustand
