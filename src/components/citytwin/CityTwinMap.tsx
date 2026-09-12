import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {
  Plus, Minus, RotateCcw, CloudRain, Sun,
  KeyRound, Map as MapIcon, Globe, X,
  ChevronRight, Sparkles, Navigation, Zap
} from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';
import { InfrastructureAsset } from '../../types/solterra';
import { MAPBOX_PUBLIC_TOKEN } from '../../constants/mapbox';

// ─── Real-world target sizes (meters) per asset type (Realistic scale on Mapbox) ──
const ASSET_REAL_SIZE: Record<string, number> = {
  bio_junction:  26,   // 26 meters across - fits realistically inside Kurnool traffic circles
  solar_flower:  8.5,  // 8.5 meters across
  solar_canopy:  20,   // 20 meters across
  rooftop_solar: 42,   // 42 meters for commercial rooftop / solar array
  smart_pole:    7,
  ev_station:    7,
  battery_system:12,
  wind_turbine:  36,
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

        const box = new THREE.Box3().setFromObject(root);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);
        const maxDim = Math.max(size.x, size.y, size.z);

        root.position.sub(center);
        root.position.y += size.y / 2;

        if (maxDim > 0) {
          const s = 1.0 / maxDim;
          root.scale.setScalar(s);
          root.position.multiplyScalar(s);
          root.position.y = 0;
        }

        const box2 = new THREE.Box3().setFromObject(root);
        root.position.y -= box2.min.y;

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

const LANDMARK_PRESETS = [
  { id: 'BJ-07', label: 'Basaveswara Circle', coords: [78.04509, 15.83183] as [number, number], zoom: 17.5, pitch: 60, bearing: -15 },
  { id: 'BJ-10', label: 'Raj Vihar Circle',   coords: [78.03836, 15.82874] as [number, number], zoom: 17.8, pitch: 62, bearing: -25 },
  { id: 'BJ-09', label: 'Sri Ram Circle',     coords: [78.03457, 15.82681] as [number, number], zoom: 17.5, pitch: 60, bearing: 10 },
  { id: 'BJ-08', label: 'Bellary Chowrasta',  coords: [78.02157, 15.82464] as [number, number], zoom: 17.2, pitch: 58, bearing: 45 },
  { id: 'BJ-11', label: 'Chennamma Circle',   coords: [78.02591, 15.81489] as [number, number], zoom: 17.2, pitch: 58, bearing: 0 },
  { id: 'BJ-12', label: 'CCamp Circle',       coords: [78.04152, 15.80846] as [number, number], zoom: 17.2, pitch: 58, bearing: -30 },
  { id: 'UMSP-01', label: '⚡ Ultra Mega Solar', coords: [78.2573, 15.6634] as [number, number], zoom: 14.2, pitch: 48, bearing: 15 },
];

interface ModelInstance {
  asset:      InfrastructureAsset;
  scene:      THREE.Scene;
  mc:         mapboxgl.MercatorCoordinate;
  meterScale: number;
  realSize:   number;
  rotationY:  number;
  isReady:    boolean;
}

interface CityTwinMapProps {
  isRainingProp?: boolean;
  onBearingChange?: (bearing: number) => void;
}

export const CityTwinMap: React.FC<CityTwinMapProps> = ({
  isRainingProp = false,
  onBearingChange
}) => {
  const {
    mapboxToken, theme, assets, scenario, selectedAsset,
    setSelectedAsset, cameraFocus, setCameraFocus,
    setIsSettingsOpen
  } = useSolTerraStore();

  const mapRef          = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef      = useRef<mapboxgl.Marker[]>([]);
  const modelInstancesRef = useRef<ModelInstance[]>([]);
  const lastClickRef    = useRef<number>(0);

  const [mapLoaded, setMapLoaded]     = useState(false);
  const [isRaining, setIsRaining]     = useState(isRainingProp);
  const [viewMode, setViewMode]       = useState<'city' | 'solar' | 'both'>('city');
  const [hudPos, setHudPos]           = useState<{ x: number; y: number } | null>(null);
  const [hoveredLandmark, setHoveredLandmark] = useState<string | null>(null);

  useEffect(() => {
    setIsRaining(isRainingProp);
  }, [isRainingProp]);

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

  // Rain Simulation Helper
  const applyRain = useCallback((map: mapboxgl.Map, active: boolean) => {
    try {
      if (active) {
        const zoomBasedReveal = (value: number) => {
          return ['interpolate', ['linear'], ['zoom'], 11, 0.0, 13, value];
        };

        (map as any).setRain?.({
          density: zoomBasedReveal(0.5),
          intensity: 1.0,
          color: '#a8adbc',
          opacity: 0.7,
          vignette: zoomBasedReveal(1.0),
          'vignette-color': '#464646',
          direction: [0, 80],
          'droplet-size': [2.6, 18.2],
          'distortion-strength': 0.7,
          'center-thinning': 0
        });
      } else {
        (map as any).setRain?.({ density: 0, intensity: 0, opacity: 0 });
      }
    } catch (_) { /* ignored if style doesn't support setRain */ }
  }, []);

  // Update rain when isRaining changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;
    applyRain(map, isRaining);
  }, [isRaining, mapLoaded, applyRain]);

  // Setup all layers (idempotent, called on initial load and every style.load / theme switch)
  const setupLayers = useCallback((map: mapboxgl.Map) => {
    if (!map.isStyleLoaded()) return;

    // 1. 3D Buildings Layer
    if (!map.getLayer('3d-buildings')) {
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
          'fill-extrusion-color': theme === 'light' 
            ? '#cbd5e1' 
            : ['interpolate', ['linear'], ['get', 'height'], 0, '#060c1a', 40, '#0d1b33', 100, '#142f55'],
          'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 13, 0, 14.05, ['get', 'height']],
          'fill-extrusion-base':   ['interpolate', ['linear'], ['zoom'], 13, 0, 14.05, ['get', 'min_height']],
          'fill-extrusion-opacity': theme === 'light' ? 0.65 : 0.85,
        },
      }, labelLayerId);
    }

    // 2. Three.js Custom Layer
    if (!map.getLayer('solterra-3d-models-layer')) {
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

          const projMatrix = (args as any).defaultProjectionData?.mainMatrix
            ?? (args as any).projMatrix
            ?? args;

          const m = new THREE.Matrix4().fromArray(
            Array.isArray(projMatrix) ? projMatrix : Object.values(projMatrix)
          );

          self.renderer.resetState();

          for (const inst of modelInstancesRef.current) {
            if (!inst.isReady) continue;

            const modelScale = inst.meterScale * inst.realSize;

            const rX = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
            const rY = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), inst.rotationY);
            const rZ = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 0, 1), 0);

            const l = new THREE.Matrix4()
              .makeTranslation(inst.mc.x, inst.mc.y, inst.mc.z)
              .scale(new THREE.Vector3(modelScale, -modelScale, modelScale))
              .multiply(rX)
              .multiply(rY)
              .multiply(rZ);

            self.camera.projectionMatrix.copy(m).multiply(l);
            self.renderer.render(inst.scene, self.camera);
          }

          map.triggerRepaint();
        },
      };

      map.addLayer(customLayer);
    }

    // 3. GeoJSON Sources & Layers
    const roundabouts = allAssets.filter(a => a.type === 'bio_junction');
    const solarParks  = allAssets.filter(a => a.id.startsWith('UMSP'));

    if (roundabouts.length && !map.getSource('roundabouts-src')) {
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

      map.addLayer({
        id: 'roundabouts-glow',
        type: 'circle',
        source: 'roundabouts-src',
        paint: {
          'circle-radius':         ['interpolate', ['linear'], ['zoom'], 12, 12, 18, 48],
          'circle-color':          '#00f59b',
          'circle-opacity':        0.15,
          'circle-stroke-width':   2,
          'circle-stroke-color':   '#00f59b',
          'circle-stroke-opacity': 0.8,
        },
      });

      map.addLayer({
        id: 'roundabouts-core',
        type: 'circle',
        source: 'roundabouts-src',
        paint: {
          'circle-radius': 5,
          'circle-color':  '#00f59b',
          'circle-opacity':0.95,
        },
      });
    }

    if (solarParks.length && !map.getSource('solar-parks-src')) {
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
          'circle-radius':         ['interpolate', ['linear'], ['zoom'], 10, 16, 16, 80],
          'circle-color':          '#f59e0b',
          'circle-opacity':        0.18,
          'circle-stroke-width':   2,
          'circle-stroke-color':   '#f59e0b',
          'circle-stroke-opacity': 0.8,
        },
      });
    }

    // 4. Hit Area for all assets
    if (!map.getSource('all-assets-hit-src')) {
      map.addSource('all-assets-hit-src', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: allAssets.map(a => ({
            type: 'Feature' as const,
            properties: { id: a.id, name: a.name, type: a.type },
            geometry: { type: 'Point' as const, coordinates: a.coordinates },
          })),
        },
      });

      map.addLayer({
        id: 'all-assets-hit-area',
        type: 'circle',
        source: 'all-assets-hit-src',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 12, 15, 28, 18, 50],
          'circle-color': '#00f59b',
          'circle-opacity': 0.12,
          'circle-stroke-width': 1.8,
          'circle-stroke-color': '#00f59b',
          'circle-stroke-opacity': 0.7,
        },
      });
    }

    if (isRaining) {
      applyRain(map, true);
    }
  }, [allAssets, theme, isRaining, applyRain]);

  // Dynamic Mapbox Style Switching based on Site Theme (Dark / White)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;
    const targetStyle = theme === 'light' ? 'mapbox://styles/mapbox/light-v11' : 'mapbox://styles/mapbox/dark-v11';
    map.setStyle(targetStyle);
  }, [theme, mapLoaded]);

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

  // Build / Update HTML Markers on the Map
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Create a marker for each asset
    allAssets.forEach(asset => {
      const isSelected = selectedAsset?.id === asset.id;
      const isSolar = asset.id.startsWith('UMSP');
      const isBio = asset.type === 'bio_junction';
      const markerColor = isSelected ? '#00f59b' : (isSolar ? '#f59e0b' : (isBio ? '#38bdf8' : '#00f59b'));

      const el = document.createElement('div');
      el.className = `solterra-asset-marker ${isSelected ? 'is-selected' : ''}`;
      el.title = `${asset.name} (${asset.id})`;

      el.innerHTML = `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        ">
          <!-- Hover Tooltip -->
          <div style="
            position: absolute;
            bottom: calc(100% + 6px);
            background: rgba(9, 12, 22, 0.92);
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(8px);
            padding: 3px 8px;
            border-radius: 9999px;
            white-space: nowrap;
            font-family: monospace;
            font-size: 10px;
            font-weight: 700;
            color: #ffffff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            pointer-events: none;
            opacity: ${isSelected ? '1' : '0.85'};
            transform: scale(${isSelected ? '1.05' : '0.95'});
          ">
            <span style="color: ${markerColor}">●</span> ${asset.id} · ${asset.currentPowerKw ? asset.currentPowerKw + ' kW' : 'Active'}
          </div>

          <!-- Pin Beacon -->
          <div style="
            width: ${isSelected ? '32px' : '26px'};
            height: ${isSelected ? '32px' : '26px'};
            border-radius: 9999px;
            background: ${isSelected ? 'rgba(0, 245, 155, 0.25)' : 'rgba(9, 12, 22, 0.8)'};
            border: 2px solid ${markerColor};
            box-shadow: 0 0 ${isSelected ? '18px' : '8px'} ${markerColor};
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${markerColor};
            transition: all 0.2s ease;
          ">
            <div style="
              width: 8px;
              height: 8px;
              border-radius: 9999px;
              background: ${markerColor};
            "></div>
          </div>
          
          <!-- Base Pin stem -->
          <div style="
            width: 2px;
            height: 6px;
            background: ${markerColor};
            opacity: 0.8;
          "></div>
        </div>
      `;

      el.onclick = (e) => {
        e.stopPropagation();
        lastClickRef.current = Date.now();
        setSelectedAsset(asset);
        setCameraFocus(asset.coordinates);
      };

      const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat(asset.coordinates)
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [allAssets, selectedAsset, mapLoaded, setCameraFocus, setSelectedAsset]);

  // Initialise Mapbox Map instance
  useEffect(() => {
    const activeToken = mapboxToken || MAPBOX_PUBLIC_TOKEN;
    if (!activeToken || !mapContainerRef.current) return;

    mapboxgl.accessToken = activeToken;

    // Pre-populate 3D model instances once
    const initialInstances: ModelInstance[] = [];

    allAssets.forEach(asset => {
      const mc = mapboxgl.MercatorCoordinate.fromLngLat(
        { lng: asset.coordinates[0], lat: asset.coordinates[1] },
        0
      );
      const meterScale = mc.meterInMercatorCoordinateUnits();
      const baseSize   = ASSET_REAL_SIZE[asset.type] ?? 12;
      const isSolar    = asset.id.startsWith('UMSP');
      const realSize   = isSolar ? 70 : (asset.type === 'bio_junction' ? 28 : baseSize);

      const scene = new THREE.Scene();
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

      initialInstances.push(instance);

      const glbPath = ASSET_GLB[asset.type];
      const loadMesh = glbPath ? loadGLB(glbPath) : Promise.resolve(buildProceduralMesh(asset.type));

      loadMesh.then((mesh) => {
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
        mapRef.current?.triggerRepaint();
      }).catch(() => {
        const fallback = buildProceduralMesh(asset.type);
        scene.add(fallback);
        instance.isReady = true;
        mapRef.current?.triggerRepaint();
      });
    });

    modelInstancesRef.current = initialInstances;

    const map = new mapboxgl.Map({
      container:  mapContainerRef.current,
      style:      theme === 'light' ? 'mapbox://styles/mapbox/light-v11' : 'mapbox://styles/mapbox/dark-v11',
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

    // style.load fires BOTH on first map creation and EVERY TIME map.setStyle() is called!
    map.on('style.load', () => {
      setMapLoaded(true);
      setupLayers(map);
    });

    map.on('load', () => {
      setMapLoaded(true);
      setupLayers(map);
    });

    // ── FOOLPROOF ASSET CLICKING & PROXIMITY HIT CHECK ──────────────────────
    map.on('click', (e) => {
      // If an HTML marker was just clicked, ignore this event
      if (Date.now() - lastClickRef.current < 350) {
        return;
      }

      // Check distance from click point to every asset's screen coordinates
      let nearestAsset: InfrastructureAsset | null = null;
      let minDistance = 45; // 45 pixels tolerance on screen

      for (const asset of allAssets) {
        const screenPos = map.project(asset.coordinates);
        const dx = screenPos.x - e.point.x;
        const dy = screenPos.y - e.point.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < minDistance) {
          minDistance = dist;
          nearestAsset = asset;
        }
      }

      if (nearestAsset) {
        lastClickRef.current = Date.now();
        setSelectedAsset(nearestAsset);
        setCameraFocus(nearestAsset.coordinates);
      } else {
        // Deselect only when clicking far away in blank space
        setSelectedAsset(null);
      }
    });

    map.on('move', () => {
      updateHudPosition();
      onBearingChange?.(map.getBearing());
    });
    map.on('rotate', () => {
      onBearingChange?.(map.getBearing());
    });

    map.on('error', e => console.warn('Mapbox notice:', e));
    mapRef.current = map;

    return () => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
      setMapLoaded(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapboxToken]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#060c18]">
      {/* Mapbox container */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

      {/* ── Top Bar: View Switcher ───────────────────────────────────────────── */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 shadow-2xl">
        {([
          ['city',  'Kurnool City',  <MapIcon size={13} key="map" />],
          ['solar', 'Solar Park',    <Sun size={13} key="sun" />],
          ['both',  'Overview',      <Globe size={13} key="globe" />],
        ] as const).map(([mode, label, icon]) => (
          <button
            key={mode}
            onClick={() => flyToMode(mode as any)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === mode
                ? 'bg-emerald-500 text-black shadow-lg font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            {icon}{label}
          </button>
        ))}
      </div>

      {/* ── Top-Right Map Controls ─────────────────────────────────────────── */}
      <div className="absolute right-4 top-4 flex flex-col gap-2 z-20">
        {[
          {
            icon: isRaining ? <CloudRain size={16}/> : <Sun size={16}/>,
            title: 'Toggle Rain Simulation',
            active: isRaining,
            onClick: () => setIsRaining(r => !r),
            activeClass: 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300',
          },
          {
            icon: <RotateCcw size={16}/>,
            title: 'Reset City Aerial View',
            active: false,
            onClick: () => flyToMode('city'),
          },
          {
            icon: <Plus size={16}/>,
            title: 'Zoom In',
            active: false,
            onClick: () => mapRef.current?.easeTo({ zoom: (mapRef.current?.getZoom() ?? 15) + 1 }),
          },
          {
            icon: <Minus size={16}/>,
            title: 'Zoom Out',
            active: false,
            onClick: () => mapRef.current?.easeTo({ zoom: (mapRef.current?.getZoom() ?? 15) - 1 }),
          },
        ].map(({ icon, title, active, onClick, activeClass }) => (
          <button
            key={title}
            onClick={onClick}
            title={title}
            className={`w-9 h-9 rounded-2xl backdrop-blur-xl border flex items-center justify-center transition-all shadow-lg cursor-pointer ${
              active
                ? (activeClass ?? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300')
                : 'bg-black/60 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {icon}
          </button>
        ))}
      </div>

      {/* ── Bottom Strip: Landmark Circles Quick Jump ────────────────────── */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/10 shadow-2xl max-w-[94vw] overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider pr-1 hidden sm:block whitespace-nowrap">
          Quick Landmark:
        </span>
        {LANDMARK_PRESETS.map((preset) => {
          const isSelected = selectedAsset?.id === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => navigateToLandmark(preset)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-emerald-500 text-black font-bold shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5'
              }`}
            >
              <span>{preset.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CityTwinMap;
