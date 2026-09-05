import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {
  Plus, Minus, RotateCcw, CloudRain, Sun,
  KeyRound, Map as MapIcon, Globe, X,
  ChevronRight, Sparkles, Navigation
} from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';
import { InfrastructureAsset } from '../../types/solterra';

// ─── Real-world target sizes (meters) per asset type ─────────────────────────
const ASSET_REAL_SIZE: Record<string, number> = {
  bio_junction:  28,   // 28 meters across - fits nicely inside Kurnool traffic circles
  solar_flower:  10,   // 10 meters
  solar_canopy:  22,   // 22 meters
  rooftop_solar: 50,   // 50 meters for UMSP solar farm field arrays
  smart_pole:    8,
  ev_station:    8,
  battery_system:14,
  wind_turbine:  38,
};

// ─── Asset GLB paths ──────────────────────────────────────────────────────────
const ASSET_GLB: Record<string, string | null> = {
  solar_flower:  '/models/smartflower_fbx.glb',
  solar_canopy:  '/models/soler_panel_setup.glb',
  rooftop_solar: '/models/solar_panel_1x1.glb',
  bio_junction:  '/models/meshy-model.glb',
  smart_pole:    null,
  ev_station:    null,
  battery_system:null,
  wind_turbine:  null,
};

// ─── Procedural fallback meshes ───────────────────────────────────────────────
function buildProceduralMesh(type: string): THREE.Group {
  const g = new THREE.Group();
  const cyan  = 0x06b6d4;
  const amber = 0xf59e0b;

  switch (type) {
    case 'smart_pole': {
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.2, 8, 12),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2, side: THREE.DoubleSide })
      );
      pole.position.y = 4;
      g.add(pole);
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.4, 0.08, 8, 24),
        new THREE.MeshBasicMaterial({ color: cyan, side: THREE.DoubleSide })
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 5.5;
      g.add(ring);
      break;
    }
    case 'ev_station': {
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 0.4, 2),
        new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.5, side: THREE.DoubleSide })
      );
      base.position.y = 0.2;
      g.add(base);
      const pillar = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 3.2, 0.6),
        new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.7, roughness: 0.3, side: THREE.DoubleSide })
      );
      pillar.position.y = 1.8;
      g.add(pillar);
      break;
    }
    case 'battery_system': {
      const b1 = new THREE.Mesh(
        new THREE.BoxGeometry(3.5, 2.6, 2),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6, roughness: 0.4, side: THREE.DoubleSide })
      );
      b1.position.y = 1.3;
      g.add(b1);
      break;
    }
    case 'wind_turbine': {
      const tower = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.7, 24, 16),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.3, side: THREE.DoubleSide })
      );
      tower.position.y = 12;
      g.add(tower);
      const hub = new THREE.Mesh(
        new THREE.SphereGeometry(0.7, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide })
      );
      hub.position.y = 24;
      g.add(hub);
      break;
    }
    default: {
      const fallback = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.MeshStandardMaterial({ color: amber, metalness: 0.4, side: THREE.DoubleSide })
      );
      fallback.position.y = 1;
      g.add(fallback);
    }
  }
  return g;
}

// ─── GLB Loader with caching & PBR texture preservation ───────────────────────
const gltfLoader = new GLTFLoader();
const glbCache = new Map<string, THREE.Group>();
const glbLoading = new Map<string, Promise<THREE.Group>>();

async function loadGLB(url: string): Promise<THREE.Group> {
  if (glbCache.has(url)) return glbCache.get(url)!.clone(true);
  if (glbLoading.has(url)) return (await glbLoading.get(url)!).clone(true);

  const promise = new Promise<THREE.Group>((resolve, reject) => {
    gltfLoader.load(
      url,
      (gltf) => {
        const root = gltf.scene;

        // Normalize bounding box so model is centered at (0, 0, 0) and rests on y = 0
        const box = new THREE.Box3().setFromObject(root);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);
        const maxDim = Math.max(size.x, size.y, size.z);

        root.position.sub(center);
        root.position.y += size.y / 2; // lift so base sits at ground

        if (maxDim > 0) {
          const s = 1.0 / maxDim;
          root.scale.setScalar(s);
          root.position.multiplyScalar(s);
          root.position.y = 0;
        }

        // Re-align so lowest vertex sits exactly at y = 0
        const box2 = new THREE.Box3().setFromObject(root);
        root.position.y -= box2.min.y;

        // CRITICAL FOR MAPBOX MATRIX:
        // Set material.side = DoubleSide on all meshes!
        // Because the Mapbox scale matrix inverts the Y-axis (-scale),
        // triangle face winding gets reversed. Without DoubleSide, OpenGL culls front faces,
        // making models look crumpled, inverted, or missing textures!
        root.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mats.forEach((mat: any) => {
              mat.side = THREE.DoubleSide;
              mat.shadowSide = THREE.DoubleSide;
              if (mat.map) {
                mat.map.colorSpace = THREE.SRGBColorSpace;
                mat.map.needsUpdate = true;
              }
              mat.needsUpdate = true;
            });
          }
        });

        const wrapper = new THREE.Group();
        wrapper.add(root);
        glbCache.set(url, wrapper);
        resolve(wrapper);
      },
      undefined,
      reject
    );
  });

  glbLoading.set(url, promise);
  return (await promise).clone(true);
}

// ─── Key Coordinates in Kurnool ───────────────────────────────────────────────
const KURNOOL_CENTER: [number, number] = [78.0383, 15.8287];
const UMSP_CENTER:    [number, number] = [78.2700, 15.6680];

// Quick landmark navigation presets
const LANDMARK_PRESETS = [
  { id: 'BJ-07', label: 'Basaveswara Circle', coords: [78.04509, 15.83183] as [number, number], zoom: 17.5, pitch: 60, bearing: -15 },
  { id: 'BJ-10', label: 'Raj Vihar Circle',   coords: [78.03836, 15.82874] as [number, number], zoom: 17.8, pitch: 62, bearing: -25 },
  { id: 'BJ-09', label: 'Sri Ram Circle',     coords: [78.03457, 15.82681] as [number, number], zoom: 17.5, pitch: 60, bearing: 10 },
  { id: 'BJ-08', label: 'Bellary Chowrasta',  coords: [78.02157, 15.82464] as [number, number], zoom: 17.2, pitch: 58, bearing: 45 },
  { id: 'BJ-11', label: 'Chennamma Circle',   coords: [78.02591, 15.81489] as [number, number], zoom: 17.2, pitch: 58, bearing: 0 },
  { id: 'BJ-12', label: 'CCamp Circle',       coords: [78.04152, 15.80846] as [number, number], zoom: 17.2, pitch: 58, bearing: -30 },
  { id: 'UMSP-01', label: '⚡ Ultra Mega Solar', coords: [78.2573, 15.6634] as [number, number], zoom: 14.2, pitch: 48, bearing: 15 },
];

export const CityTwinMap: React.FC = () => {
  const {
    mapboxToken, assets, scenario, selectedAsset,
    setSelectedAsset, cameraFocus, setCameraFocus,
    setIsSettingsOpen
  } = useSolTerraStore();

  const mapRef          = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded]     = useState(false);
  const [isRaining, setIsRaining]     = useState(false);
  const [viewMode, setViewMode]       = useState<'city' | 'solar' | 'both'>('city');
  const [hudPos, setHudPos]           = useState<{ x: number; y: number } | null>(null);
  const [hoveredLandmark, setHoveredLandmark] = useState<string | null>(null);

  const allAssets = scenario.isActive
    ? [...assets, ...scenario.proposedAssets]
    : assets;

  // Sync HUD pin position with map movement
  const updateHudPosition = useCallback(() => {
    if (!mapRef.current || !selectedAsset) {
      setHudPos(null);
      return;
    }
    const p = mapRef.current.project(selectedAsset.coordinates);
    setHudPos({ x: Math.round(p.x), y: Math.round(p.y) });
  }, [selectedAsset]);

  // Update HUD pin whenever selectedAsset changes or map moves
  useEffect(() => {
    updateHudPosition();
  }, [selectedAsset, updateHudPosition]);

  // Smooth camera fly-to when cameraFocus changes
  useEffect(() => {
    if (!cameraFocus || !mapRef.current) return;
    const isSolar = cameraFocus[0] > 78.2;
    mapRef.current.flyTo({
      center:   cameraFocus,
      zoom:     isSolar ? 14.5 : 17.5,
      pitch:    isSolar ? 45   : 62,
      bearing:  isSolar ? 15   : -20,
      duration: 1800,
      essential: true,
    });
  }, [cameraFocus]);

  // Rain effect toggle
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;
    try {
      if (isRaining) {
        (map as any).setRain?.({
          density: 0.75, intensity: 0.9,
          color: '#a8d4f5',
          opacity: [0.5, 0.9],
          'center-thinning': 0.5,
          'droplet-size': [3, 7],
          'distortion-strength': 0.5,
          'vignette': true,
          'vignette-color': '#061527',
          'vignette-opacity': 0.7,
        });
      } else {
        (map as any).setRain?.({ density: 0, intensity: 0, opacity: [0, 0] });
      }
    } catch (_) { /* fallback if style doesn't support setRain */ }
  }, [isRaining, mapLoaded]);

  // View mode switcher
  const flyToMode = useCallback((mode: 'city' | 'solar' | 'both') => {
    setViewMode(mode);
    if (!mapRef.current) return;
    if (mode === 'city') {
      mapRef.current.flyTo({ center: KURNOOL_CENTER, zoom: 14.5, pitch: 58, bearing: -20, duration: 1600 });
    } else if (mode === 'solar') {
      mapRef.current.flyTo({ center: UMSP_CENTER,    zoom: 13.5, pitch: 45, bearing: 10,  duration: 1800 });
    } else {
      mapRef.current.flyTo({ center: [78.16, 15.74], zoom: 10.8, pitch: 25, bearing: 0,   duration: 2000 });
    }
  }, []);

  // Quick landmark navigation
  const navigateToLandmark = (preset: typeof LANDMARK_PRESETS[0]) => {
    const asset = allAssets.find(a => a.id === preset.id);
    if (asset) {
      setSelectedAsset(asset);
    }
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: preset.coords,
        zoom: preset.zoom,
        pitch: preset.pitch,
        bearing: preset.bearing,
        duration: 1600,
        essential: true,
      });
    }
  };

  // ── Initialise Mapbox + Three.js Custom 3D Layer ────────────────────────────
  useEffect(() => {
    if (!mapboxToken || !mapContainerRef.current) return;

    mapboxgl.accessToken = mapboxToken;

    const map = new mapboxgl.Map({
      container:  mapContainerRef.current,
      style:      'mapbox://styles/mapbox/dark-v11',
      center:     KURNOOL_CENTER,
      zoom:       15.2,
      pitch:      60,
      bearing:    -20,
      antialias:  true,
      maxZoom:    21,
      minZoom:    8,
    });

    map.on('move', updateHudPosition);
    map.on('zoom', updateHudPosition);
    map.on('pitch', updateHudPosition);

    map.on('load', () => {
      setMapLoaded(true);

      // ── 3D Buildings Layer ──────────────────────────────────────────────────
      const labelLayerId = map.getStyle().layers?.find(
        l => l.type === 'symbol' && (l as any).layout?.['text-field']
      )?.id;

      map.addLayer({
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 13,
        paint: {
          'fill-extrusion-color': ['interpolate', ['linear'], ['get', 'height'],
            0, '#060c1a', 40, '#0d1b33', 100, '#142f55'],
          'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 13, 0, 14.05, ['get', 'height']],
          'fill-extrusion-base':   ['interpolate', ['linear'], ['zoom'], 13, 0, 14.05, ['get', 'min_height']],
          'fill-extrusion-opacity': 0.85,
        },
      }, labelLayerId);

      // ── Three.js Custom Layer (Official Mapbox Pattern) ─────────────────────
      // Official reference: https://docs.mapbox.com/mapbox-gl-js/example/add-3d-model/
      // Each 3D model has its own Three.js Scene and local lights at origin (0,0,0).
      // In render(), camera.projectionMatrix = m * l (computed with double precision in JS).
      // This guarantees zero 32-bit floating point precision loss and pristine geometry!

      interface ModelInstance {
        asset:      InfrastructureAsset;
        scene:      THREE.Scene;
        mc:         mapboxgl.MercatorCoordinate;
        meterScale: number;
        realSize:   number;
        rotationY:  number;
        isReady:    boolean;
      }

      const modelInstances: ModelInstance[] = [];

      allAssets.forEach(asset => {
        const mc = mapboxgl.MercatorCoordinate.fromLngLat(
          { lng: asset.coordinates[0], lat: asset.coordinates[1] },
          0
        );
        const meterScale = mc.meterInMercatorCoordinateUnits();
        const baseSize   = ASSET_REAL_SIZE[asset.type] ?? 12;
        const isSolar    = asset.id.startsWith('UMSP');
        const realSize   = isSolar ? 70 : (asset.type === 'bio_junction' ? 28 : baseSize);

        // Dedicated Three.js Scene for this asset
        const scene = new THREE.Scene();

        // Local illumination tailored for this asset at (0, 0, 0)
        const ambient = new THREE.AmbientLight(0xffffff, 2.4);
        const sun = new THREE.DirectionalLight(0xfff8ee, 3.2);
        sun.position.set(0, -60, 90).normalize();
        const fill = new THREE.DirectionalLight(0xa5d8ff, 1.8);
        fill.position.set(0, 60, 50).normalize();
        const bounce = new THREE.DirectionalLight(0x00f59b, 0.6);
        bounce.position.set(0, 0, -40).normalize();

        scene.add(ambient, sun, fill, bounce);

        const instance: ModelInstance = {
          asset,
          scene,
          mc,
          meterScale,
          realSize,
          rotationY: -(asset.rotation ?? 0) * Math.PI / 180,
          isReady: false,
        };

        modelInstances.push(instance);

        // Load 3D model asynchronously
        const glbPath = ASSET_GLB[asset.type];
        const loadMesh = glbPath ? loadGLB(glbPath) : Promise.resolve(buildProceduralMesh(asset.type));

        loadMesh.then((mesh) => {
          // Tint proposed assets with neon cyan
          if (asset.isProposed) {
            mesh.traverse(c => {
              if ((c as THREE.Mesh).isMesh) {
                const m = c as THREE.Mesh;
                const mats = Array.isArray(m.material) ? m.material : [m.material];
                mats.forEach((mat: any) => {
                  if (mat.color) mat.color.setHex(0x00e5ff);
                  mat.emissive?.setHex(0x004466);
                  mat.side = THREE.DoubleSide;
                  mat.needsUpdate = true;
                });
              }
            });
          }

          scene.add(mesh);
          instance.isReady = true;
          map.triggerRepaint();
        }).catch(() => {
          const fallback = buildProceduralMesh(asset.type);
          scene.add(fallback);
          instance.isReady = true;
          map.triggerRepaint();
        });
      });

      const customLayer: mapboxgl.CustomLayerInterface = {
        id:            'solterra-3d-models-layer',
        type:          'custom',
        renderingMode: '3d',

        onAdd(mapInstance, gl) {
          const camera   = new THREE.Camera();
          const renderer = new THREE.WebGLRenderer({
            canvas:    mapInstance.getCanvas(),
            context:   gl,
            antialias: true,
          });
          renderer.autoClear        = false;
          renderer.outputColorSpace  = THREE.SRGBColorSpace;
          renderer.shadowMap.enabled = true;

          (this as any).camera   = camera;
          (this as any).renderer = renderer;
        },

        render(_gl, args) {
          const self = this as any;
          if (!self.camera || !self.renderer) return;

          // Projection matrix from Mapbox
          const projMatrix = (args as any).defaultProjectionData?.mainMatrix
            ?? (args as any).projMatrix
            ?? args;

          const m = new THREE.Matrix4().fromArray(
            Array.isArray(projMatrix) ? projMatrix : Object.values(projMatrix)
          );

          self.renderer.resetState();

          // Render each ready model instance using the official Mapbox matrix multiplication
          for (const inst of modelInstances) {
            if (!inst.isReady) continue;

            const modelScale = inst.meterScale * inst.realSize;

            // GLB +Y up maps to Mapbox +Z up via rotateX(PI/2)
            const rX = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
            const rY = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), inst.rotationY);
            const rZ = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 0, 1), 0);

            // Official Mapbox l transform matrix
            const l = new THREE.Matrix4()
              .makeTranslation(inst.mc.x, inst.mc.y, inst.mc.z)
              .scale(new THREE.Vector3(modelScale, -modelScale, modelScale))
              .multiply(rX)
              .multiply(rY)
              .multiply(rZ);

            // Combine camera projection and model transform with double-precision CPU math
            self.camera.projectionMatrix.copy(m).multiply(l);

            // Draw this model at local origin with full 24-bit vertex precision
            self.renderer.render(inst.scene, self.camera);
          }

          map.triggerRepaint();
        },
      };

      map.addLayer(customLayer);

      // ── Interactive Mapbox GeoJSON Layers for Roundabouts & Solar Park ──────
      const roundabouts = allAssets.filter(a => a.type === 'bio_junction');
      const solarParks  = allAssets.filter(a => a.id.startsWith('UMSP'));

      if (roundabouts.length) {
        map.addSource('roundabouts-src', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: roundabouts.map(a => ({
              type: 'Feature' as const,
              properties: { id: a.id, name: a.name, power: a.currentPowerKw ?? 15 },
              geometry: { type: 'Point' as const, coordinates: a.coordinates },
            })),
          },
        });

        // Pulsing emerald outer glow
        map.addLayer({
          id: 'roundabouts-glow',
          type: 'circle',
          source: 'roundabouts-src',
          paint: {
            'circle-radius':         ['interpolate', ['linear'], ['zoom'], 12, 10, 18, 42],
            'circle-color':          '#00f59b',
            'circle-opacity':        0.12,
            'circle-stroke-width':   1.8,
            'circle-stroke-color':   '#00f59b',
            'circle-stroke-opacity': 0.75,
          },
        });

        // Inner glowing core
        map.addLayer({
          id: 'roundabouts-core',
          type: 'circle',
          source: 'roundabouts-src',
          paint: {
            'circle-radius': 4,
            'circle-color':  '#00f59b',
            'circle-opacity':0.9,
          },
        });

        map.on('click', 'roundabouts-glow', e => {
          const id = e.features?.[0]?.properties?.id;
          const a  = allAssets.find(x => x.id === id);
          if (a) {
            setSelectedAsset(a);
            setCameraFocus(a.coordinates);
          }
        });

        map.on('mouseenter', 'roundabouts-glow', e => {
          map.getCanvas().style.cursor = 'pointer';
          const name = e.features?.[0]?.properties?.name;
          if (name) setHoveredLandmark(name);
        });

        map.on('mouseleave', 'roundabouts-glow', () => {
          map.getCanvas().style.cursor = '';
          setHoveredLandmark(null);
        });
      }

      if (solarParks.length) {
        map.addSource('solar-parks-src', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: solarParks.map(a => ({
              type: 'Feature' as const,
              properties: { id: a.id, name: a.name, power: a.currentPowerKw ?? 900 },
              geometry: { type: 'Point' as const, coordinates: a.coordinates },
            })),
          },
        });

        map.addLayer({
          id: 'solar-parks-glow',
          type: 'circle',
          source: 'solar-parks-src',
          paint: {
            'circle-radius':         ['interpolate', ['linear'], ['zoom'], 10, 14, 16, 75],
            'circle-color':          '#f59e0b',
            'circle-opacity':        0.14,
            'circle-stroke-width':   1.8,
            'circle-stroke-color':   '#f59e0b',
            'circle-stroke-opacity': 0.70,
          },
        });

        map.on('click', 'solar-parks-glow', e => {
          const id = e.features?.[0]?.properties?.id;
          const a  = allAssets.find(x => x.id === id);
          if (a) {
            setSelectedAsset(a);
            setCameraFocus(a.coordinates);
          }
        });
      }
    });

    map.on('error', e => console.warn('Mapbox error:', e));
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      setMapLoaded(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapboxToken]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#060c18] rounded-2xl">
      {/* Mapbox container */}
      {mapboxToken ? (
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#060c18]">
          <div
            onClick={() => setIsSettingsOpen(true)}
            className="cursor-pointer text-center space-y-3 p-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-all"
          >
            <KeyRound size={32} className="text-amber-400 mx-auto animate-pulse" />
            <p className="text-sm font-semibold text-amber-300">Mapbox token required</p>
            <p className="text-xs text-slate-400">Click to open Settings and paste your token</p>
          </div>
        </div>
      )}

      {/* ── Top Bar: View Switcher ───────────────────────────────────────────── */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-1 shadow-2xl">
        {([
          ['city',  'Kurnool City',  <MapIcon size={12} key="map" />],
          ['solar', 'Solar Park',    <Sun size={12} key="sun" />],
          ['both',  'Overview',      <Globe size={12} key="globe" />],
        ] as const).map(([mode, label, icon]) => (
          <button
            key={mode}
            onClick={() => flyToMode(mode as any)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
              viewMode === mode
                ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(0,245,155,0.4)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            {icon}{label}
          </button>
        ))}
      </div>

      {/* ── Top-Right Map Controls ─────────────────────────────────────────── */}
      <div className="absolute right-3 top-3 flex flex-col gap-1.5 z-20">
        {[
          {
            icon: isRaining ? <CloudRain size={15}/> : <Sun size={15}/>,
            title: 'Toggle Rain Simulation',
            active: isRaining,
            onClick: () => setIsRaining(r => !r),
            activeClass: 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300',
          },
          {
            icon: <RotateCcw size={15}/>,
            title: 'Reset City Aerial View',
            active: false,
            onClick: () => flyToMode('city'),
          },
          {
            icon: <Plus size={15}/>,
            title: 'Zoom In',
            active: false,
            onClick: () => mapRef.current?.easeTo({ zoom: (mapRef.current?.getZoom() ?? 15) + 1 }),
          },
          {
            icon: <Minus size={15}/>,
            title: 'Zoom Out',
            active: false,
            onClick: () => mapRef.current?.easeTo({ zoom: (mapRef.current?.getZoom() ?? 15) - 1 }),
          },
        ].map(({ icon, title, active, onClick, activeClass }) => (
          <button
            key={title}
            onClick={onClick}
            title={title}
            className={`w-8 h-8 rounded-xl backdrop-blur-xl border flex items-center justify-center transition-all shadow-lg ${
              active
                ? activeClass ?? 'bg-emerald-500/20 border-emerald-400/60 text-emerald-300'
                : 'bg-black/60 border-white/10 text-slate-300 hover:border-white/25 hover:text-white'
            }`}
          >
            {icon}
          </button>
        ))}
      </div>

      {/* ── Hover Landmark Tooltip ─────────────────────────────────────────── */}
      {hoveredLandmark && !selectedAsset && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-xl flex items-center gap-1.5 animate-fadeIn">
          <Sparkles size={12} className="text-emerald-400 animate-spin" style={{ animationDuration: '4s' }} />
          <span>{hoveredLandmark}</span>
        </div>
      )}

      {/* ── Dynamic Single Pinned Holographic HUD Card (Pinned to Selected Asset) ── */}
      {selectedAsset && hudPos && (
        <div
          style={{
            left: `${hudPos.x}px`,
            top:  `${hudPos.y}px`,
            transform: 'translate(-50%, -100%) translateY(-24px)',
          }}
          className="absolute z-30 pointer-events-auto transition-transform duration-75 ease-out animate-fadeIn"
        >
          <div className="relative flex flex-col items-center">
            {/* Holographic Card */}
            <div className="w-64 p-3.5 rounded-2xl bg-[#080f1e]/90 backdrop-blur-2xl border border-emerald-400/40 shadow-[0_0_30px_rgba(0,245,155,0.25)] text-left">
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                      {selectedAsset.id}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white leading-tight mt-0.5">
                    {selectedAsset.name}
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={13} />
                </button>
              </div>

              {/* Real-time stats */}
              <div className="grid grid-cols-2 gap-2 text-[10px] mb-3">
                <div className="p-2 rounded-xl bg-white/[0.04] border border-white/5">
                  <div className="text-slate-400 uppercase font-semibold text-[8px]">Current Power</div>
                  <div className="text-emerald-300 font-mono font-bold text-xs mt-0.5">
                    {selectedAsset.currentPowerKw ? `${selectedAsset.currentPowerKw} kW` : 'Active'}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.04] border border-white/5">
                  <div className="text-slate-400 uppercase font-semibold text-[8px]">System Health</div>
                  <div className="text-cyan-300 font-mono font-bold text-xs mt-0.5">
                    {selectedAsset.health}%
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[9px] text-slate-400 truncate max-w-[130px]">
                  {selectedAsset.zoneName ?? 'Kurnool City'}
                </span>
                <button
                  onClick={() => setCameraFocus(selectedAsset.coordinates)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1 transition-all"
                >
                  <span>Focus 3D</span>
                  <Navigation size={10} />
                </button>
              </div>
            </div>

            {/* Glowing vertical connector stem down to the 3D monument */}
            <div className="w-0.5 h-6 bg-gradient-to-b from-emerald-400 to-transparent" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-black shadow-[0_0_8px_#00f59b]" />
          </div>
        </div>
      )}

      {/* ── Bottom Bar: Clean Quick-Landmark Selector ────────────────────────── */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-2 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl pointer-events-auto max-w-full scrollbar-none">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2 flex items-center gap-1">
            <Navigation size={11} className="text-emerald-400" />
            Circles:
          </span>
          {LANDMARK_PRESETS.map((preset) => {
            const isSelected = selectedAsset?.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => navigateToLandmark(preset)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-500 text-black font-bold shadow-[0_0_12px_rgba(0,245,155,0.4)]'
                    : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                <span>{preset.label}</span>
                {isSelected && <ChevronRight size={11} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
