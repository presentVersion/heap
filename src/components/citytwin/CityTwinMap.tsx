import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {
  Plus, Minus, RotateCcw, CloudRain, Sun,
  KeyRound, Map as MapIcon, Globe, X,
  ChevronRight, Sparkles, Navigation, Zap, Wind, Activity
} from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';
import { InfrastructureAsset } from '../../types/solterra';
import { MAPBOX_PUBLIC_TOKEN } from '../../constants/mapbox';
import {
  RENEWABLE_PLANTS,
  DEMAND_CENTERS,
  TRANSMISSION_CORRIDORS,
  CITY_MICROGRID_FEEDERS,
  EV_CHARGING_STATIONS,
  generateFarmBunchOffsets,
  RenewablePlantData,
  DemandCenter,
  EVChargingStationItem
} from '../../services/renewableEnergyGridData';

// ─── Real-world target sizes (meters) per asset type (Realistic scale on Mapbox) ──
const ASSET_REAL_SIZE: Record<string, number> = {
  bio_junction:  26,
  solar_flower:  8.5,
  solar_canopy:  22,
  rooftop_solar: 42,
  smart_pole:    7,
  ev_station:    16, // Realistic 16m EV charging hub footprint
  battery_system:12,
  wind_turbine:  55, // 55-65m realistic utility-scale turbine height
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
  wind_turbine:  '/models/windTurbine01.glb',
};

// ─── High-Fidelity Procedural fallback meshes ─────────────────────────────────
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
      // 1. Concrete parking pad (for 2 EV charging bays) - 4.8m wide, 0.12m high, 3.2m deep
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(4.8, 0.12, 3.2),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.2, roughness: 0.8, side: THREE.DoubleSide })
      );
      base.position.y = 0.06;
      g.add(base);

      // Green painted EV parking bay lines
      const bayStripe1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.02, 3.0),
        new THREE.MeshBasicMaterial({ color: 0x00f59b })
      );
      bayStripe1.position.set(-2.3, 0.13, 0);
      const bayStripe2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.02, 3.0),
        new THREE.MeshBasicMaterial({ color: 0x00f59b })
      );
      bayStripe2.position.set(0, 0.13, 0);
      const bayStripe3 = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.02, 3.0),
        new THREE.MeshBasicMaterial({ color: 0x00f59b })
      );
      bayStripe3.position.set(2.3, 0.13, 0);
      g.add(bayStripe1, bayStripe2, bayStripe3);

      // 2. Solar Canopy Roof - 5.2m wide, 0.08m thick, 3.6m deep at height 2.8m
      const roof = new THREE.Mesh(
        new THREE.BoxGeometry(5.2, 0.08, 3.6),
        new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.85, roughness: 0.2, side: THREE.DoubleSide })
      );
      roof.position.set(0, 2.8, 0);
      roof.rotation.x = -0.06;
      g.add(roof);

      // Illuminated Emerald Green Edge Fascia
      const fascia = new THREE.Mesh(
        new THREE.BoxGeometry(5.25, 0.05, 0.04),
        new THREE.MeshBasicMaterial({ color: 0x00f59b })
      );
      fascia.position.set(0, 2.82, 1.8);
      g.add(fascia);

      // 3. Two slender steel canopy support pillars
      const p1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.07, 2.8, 12),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.6, roughness: 0.3 })
      );
      p1.position.set(-2.1, 1.4, -0.8);
      const p2 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.07, 2.8, 12),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.6, roughness: 0.3 })
      );
      p2.position.set(2.1, 1.4, -0.8);
      g.add(p1, p2);

      // 4. Dual DC Fast Charging Pedestals (0.38m x 1.35m x 0.28m)
      for (const offset of [-1.1, 1.1]) {
        const ped = new THREE.Mesh(
          new THREE.BoxGeometry(0.38, 1.35, 0.28),
          new THREE.MeshStandardMaterial({ color: 0x090d16, metalness: 0.5, roughness: 0.2, side: THREE.DoubleSide })
        );
        ped.position.set(offset, 0.67, -0.9);
        g.add(ped);

        // Glowing LED Status Screen
        const screen = new THREE.Mesh(
          new THREE.BoxGeometry(0.26, 0.45, 0.02),
          new THREE.MeshBasicMaterial({ color: 0x00f59b })
        );
        screen.position.set(offset, 0.92, -0.75);
        g.add(screen);
      }

      // 5. Petrol Bunk Brand Totem Pylon Sign (with fuel + EV symbol)
      const totem = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 3.2, 0.16),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.7, roughness: 0.2 })
      );
      totem.position.set(2.6, 1.6, 1.4);
      g.add(totem);

      const totemSign = new THREE.Mesh(
        new THREE.BoxGeometry(0.36, 0.7, 0.2),
        new THREE.MeshBasicMaterial({ color: 0x00f59b })
      );
      totemSign.position.set(2.6, 2.85, 1.4);
      g.add(totemSign);

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
      // Realistic tall tower
      const tower = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 1.2, 35, 16),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.4, roughness: 0.3, side: THREE.DoubleSide })
      );
      tower.position.y = 17.5;
      g.add(tower);

      // Nacelle
      const nacelle = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 1.5, 4.5),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.3, side: THREE.DoubleSide })
      );
      nacelle.position.set(0, 35, 0.5);
      g.add(nacelle);

      // Hub & 3 Aerodynamic Rotor Blades
      const rotorGroup = new THREE.Group();
      rotorGroup.position.set(0, 35, 2.8);
      rotorGroup.name = 'rotorGroup';

      const hub = new THREE.Mesh(
        new THREE.SphereGeometry(1.0, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide })
      );
      rotorGroup.add(hub);

      for (let i = 0; i < 3; i++) {
        const bladeArm = new THREE.Group();
        bladeArm.rotation.z = (i * Math.PI * 2) / 3;

        const blade = new THREE.Mesh(
          new THREE.BoxGeometry(0.5, 18, 0.15),
          new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.2, roughness: 0.2, side: THREE.DoubleSide })
        );
        blade.position.y = 9;
        bladeArm.add(blade);
        rotorGroup.add(bladeArm);
      }
      g.add(rotorGroup);
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

// ─── Key Coordinates in Kurnool & All-India Landmarks ─────────────────────────
const KURNOOL_CENTER: [number, number] = [78.0383, 15.8287];
const UMSP_CENTER:    [number, number] = [78.2700, 15.6680];
const NATIONAL_CENTER: [number, number] = [78.9629, 21.5937];

const LANDMARK_PRESETS = [
  { id: 'bhadla-solar', label: '☀️ Bhadla Solar 2.2GW', coords: [71.9167, 27.5333] as [number, number], zoom: 14.5, pitch: 58, bearing: -10 },
  { id: 'khavda-solar', label: '⚡ Khavda Hybrid 2.6GW', coords: [69.7500, 23.8300] as [number, number], zoom: 14.2, pitch: 52, bearing: 15 },
  { id: 'muppandal-wind', label: '💨 Muppandal Wind 1.5GW', coords: [77.5500, 8.2500] as [number, number], zoom: 14.0, pitch: 56, bearing: 20 },
  { id: 'kutch-wind', label: '💨 Kutch Wind Hub 1.7GW', coords: [69.6600, 23.2400] as [number, number], zoom: 14.2, pitch: 55, bearing: -15 },
  { id: 'pavagada-solar', label: '☀️ Pavagada Solar 2.0GW', coords: [77.2700, 14.1000] as [number, number], zoom: 14.4, pitch: 50, bearing: 10 },
  { id: 'UMSP-01', label: '⚡ Kurnool UMSP 1.0GW', coords: [78.2573, 15.6634] as [number, number], zoom: 14.2, pitch: 48, bearing: 15 },
  { id: 'ev-bellary-chowrasta', label: '⛽ IOCL Bellary EV Plaza', coords: [78.0245, 15.8235] as [number, number], zoom: 17.5, pitch: 62, bearing: -20 },
  { id: 'ev-raj-vihar', label: '⛽ HPCL Raj Vihar EV Hub', coords: [78.0372, 15.8276] as [number, number], zoom: 17.5, pitch: 62, bearing: -20 },
  { id: 'ev-nh44-expressway', label: '⛽ BPCL Highway Oasis EV', coords: [78.0515, 15.8020] as [number, number], zoom: 17.2, pitch: 60, bearing: 25 },
  { id: 'delhi-ncr', label: '🏙️ Delhi NCR (7.4GW Load)', coords: [77.2090, 28.6139] as [number, number], zoom: 12.8, pitch: 50, bearing: 0 },
  { id: 'mumbai-mmr', label: '🏙️ Mumbai MMR (5.2GW Load)', coords: [72.8777, 19.0760] as [number, number], zoom: 12.5, pitch: 52, bearing: -20 },
  { id: 'BJ-07', label: 'Basaveswara Circle', coords: [78.0465, 15.8305] as [number, number], zoom: 17.5, pitch: 60, bearing: -15 },
  { id: 'BJ-10', label: 'Raj Vihar Circle',   coords: [78.0372, 15.8276] as [number, number], zoom: 17.8, pitch: 62, bearing: -25 },
];

interface ModelInstance {
  id:         string;
  name:       string;
  type:       'solar' | 'wind' | string;
  scene:      THREE.Scene;
  mc:         mapboxgl.MercatorCoordinate;
  meterScale: number;
  realSize:   number;
  rotationY:  number;
  isReady:    boolean;
  isTurbine?: boolean;
  rotorMesh?: THREE.Object3D | null;
}

interface CityTwinMapProps {
  isRainingProp?: boolean;
  onBearingChange?: (bearing: number) => void;
  selectedPlantId?: string | null;
  onSelectPlant?: (plant: RenewablePlantData | null) => void;
  focusedCoordinates?: [number, number] | null;
  selectedEvStationId?: string | null;
  onSelectEvStation?: (station: EVChargingStationItem | null) => void;
}

export const CityTwinMap: React.FC<CityTwinMapProps> = ({
  isRainingProp = false,
  onBearingChange,
  selectedPlantId,
  onSelectPlant,
  focusedCoordinates,
  selectedEvStationId,
  onSelectEvStation
}) => {
  const {
    mapboxToken, theme, assets, scenario, selectedAsset,
    setSelectedAsset, cameraFocus, setCameraFocus
  } = useSolTerraStore();

  const mapRef            = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef   = useRef<HTMLDivElement>(null);
  const markersRef        = useRef<mapboxgl.Marker[]>([]);
  const modelInstancesRef = useRef<ModelInstance[]>([]);
  const lastClickRef      = useRef<number>(0);
  const animFrameRef      = useRef<number | null>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [isRaining, setIsRaining] = useState(isRainingProp);
  const [viewMode, setViewMode]   = useState<'city' | 'solar' | 'national' | 'both'>('city');
  const [hudPos, setHudPos]       = useState<{ x: number; y: number } | null>(null);

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

  // Smooth camera fly-to when cameraFocus or external focusedCoordinates changes
  useEffect(() => {
    const target = focusedCoordinates || cameraFocus;
    if (!target || !mapRef.current) return;
    const isNational = target[1] > 20 || target[0] < 74;
    const isSolar = target[0] > 78.2 && target[1] < 16;
    mapRef.current.flyTo({
      center:   target,
      zoom:     isNational ? 13.8 : (isSolar ? 14.5 : 17.5),
      pitch:    isNational ? 55 : (isSolar ? 45 : 62),
      bearing:  isNational ? -10 : (isSolar ? 15 : -20),
      duration: 1800,
      essential: true,
    });
  }, [cameraFocus, focusedCoordinates]);

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

    // 2. High-Voltage Green Energy Transmission Corridors (HVDC / 765kV)
    if (!map.getSource('transmission-corridors-src')) {
      map.addSource('transmission-corridors-src', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: TRANSMISSION_CORRIDORS.map(line => ({
            type: 'Feature' as const,
            properties: {
              id: line.id,
              name: line.name,
              voltage: line.voltage,
              flowMw: line.flowMw,
              capacityMw: line.capacityMw,
              fromName: line.fromName,
              toName: line.toName,
              corridor: line.corridor
            },
            geometry: {
              type: 'LineString' as const,
              coordinates: [line.fromCoords, line.toCoords]
            }
          }))
        }
      });

      // Outer Neon Flow Glow
      map.addLayer({
        id: 'transmission-lines-glow',
        type: 'line',
        source: 'transmission-corridors-src',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#f59e0b',
          'line-width': ['interpolate', ['linear'], ['zoom'], 4, 3.5, 8, 7, 14, 12],
          'line-opacity': 0.45,
          'line-blur': 2.5
        }
      });

      // Bright Core Power Line
      map.addLayer({
        id: 'transmission-lines-core',
        type: 'line',
        source: 'transmission-corridors-src',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#ffffff',
          'line-width': ['interpolate', ['linear'], ['zoom'], 4, 1.2, 8, 2.5, 14, 4],
          'line-opacity': 0.95
        }
      });

      // Pulsing Transmission Line Flow
      map.addLayer({
        id: 'transmission-lines-flow-dash',
        type: 'line',
        source: 'transmission-corridors-src',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#00f59b',
          'line-width': ['interpolate', ['linear'], ['zoom'], 4, 2, 8, 3.5, 14, 6],
          'line-dasharray': [0.5, 2.5],
          'line-opacity': 0.85
        }
      });
    }

    // 3. Demand & Load Centers (Major Consumption Hubs from CEA EV Report)
    if (!map.getSource('demand-centers-src')) {
      map.addSource('demand-centers-src', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: DEMAND_CENTERS.map(dc => ({
            type: 'Feature' as const,
            properties: {
              id: dc.id,
              name: dc.name,
              state: dc.state,
              demand: dc.peakDemandMw,
              evMonthly: dc.evChargingMuMonth,
              discom: dc.primaryDiscom
            },
            geometry: {
              type: 'Point' as const,
              coordinates: dc.coordinates
            }
          }))
        }
      });

      // Demand Pulse Glow
      map.addLayer({
        id: 'demand-centers-glow',
        type: 'circle',
        source: 'demand-centers-src',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 4, 12, 10, 28, 16, 60],
          'circle-color': '#38bdf8',
          'circle-opacity': 0.22,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#38bdf8',
          'circle-stroke-opacity': 0.8
        }
      });

      // Demand Center Core
      map.addLayer({
        id: 'demand-centers-core',
        type: 'circle',
        source: 'demand-centers-src',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 4, 4, 8, 7, 14, 11],
          'circle-color': '#ffffff',
          'circle-opacity': 0.95
        }
      });
    }

    // 4. Renewable Farm Ground Footprint Rings
    if (!map.getSource('renewable-farms-src')) {
      map.addSource('renewable-farms-src', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: RENEWABLE_PLANTS.map(p => ({
            type: 'Feature' as const,
            properties: {
              id: p.id,
              name: p.name,
              type: p.type,
              capacity: p.capacityMw,
              generation: p.augustGenMu,
              color: p.type === 'solar' ? '#f59e0b' : '#06b6d4'
            },
            geometry: {
              type: 'Point' as const,
              coordinates: p.coordinates
            }
          }))
        }
      });

      map.addLayer({
        id: 'renewable-farms-footprint',
        type: 'circle',
        source: 'renewable-farms-src',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 4, 8, 10, 35, 14, 90],
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.15,
          'circle-stroke-width': 1.8,
          'circle-stroke-color': ['get', 'color'],
          'circle-stroke-opacity': 0.7
        }
      });
    }

    // 5. City Microgrid Distribution Feeders (Local Clean Power Flow in Kurnool)
    if (!map.getSource('city-feeders-src')) {
      map.addSource('city-feeders-src', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: CITY_MICROGRID_FEEDERS.map(f => ({
            type: 'Feature' as const,
            properties: { ...f },
            geometry: {
              type: 'LineString' as const,
              coordinates: [f.fromCoords, f.toCoords]
            }
          }))
        }
      });

      // City Feeder Glow
      map.addLayer({
        id: 'city-feeders-glow',
        type: 'line',
        source: 'city-feeders-src',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#00f59b',
          'line-width': ['interpolate', ['linear'], ['zoom'], 11, 2.5, 15, 6, 18, 10],
          'line-opacity': 0.4,
          'line-blur': 2
        }
      });

      // City Feeder Core
      map.addLayer({
        id: 'city-feeders-core',
        type: 'line',
        source: 'city-feeders-src',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#ffffff',
          'line-width': ['interpolate', ['linear'], ['zoom'], 11, 1, 15, 2.5, 18, 4],
          'line-opacity': 0.95
        }
      });

      // City Feeder Pulse Dash
      map.addLayer({
        id: 'city-feeders-pulse-dash',
        type: 'line',
        source: 'city-feeders-src',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#38bdf8',
          'line-width': ['interpolate', ['linear'], ['zoom'], 11, 1.5, 15, 3.5, 18, 6],
          'line-dasharray': [0.6, 2.2],
          'line-opacity': 0.9
        }
      });
    }

    // 6. 3D EV Charging Stations Ground Footprints
    if (!map.getSource('ev-stations-footprint-src')) {
      map.addSource('ev-stations-footprint-src', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: EV_CHARGING_STATIONS.map(ev => ({
            type: 'Feature' as const,
            properties: { ...ev },
            geometry: {
              type: 'Point' as const,
              coordinates: ev.coordinates
            }
          }))
        }
      });

      map.addLayer({
        id: 'ev-stations-glow',
        type: 'circle',
        source: 'ev-stations-footprint-src',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 11, 6, 16, 26, 18, 50],
          'circle-color': '#00f59b',
          'circle-opacity': 0.25,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#00f59b',
          'circle-stroke-opacity': 0.9
        }
      });
    }

    // 7. Three.js Custom 3D Layer (Renders Real 3D Bunches of Solar Panels & Wind Turbines)
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

            // Rotate wind turbine blades dynamically in real-time
            if (inst.isTurbine) {
              if (inst.rotorMesh) {
                inst.rotorMesh.rotation.z += 0.045; // Smooth spinning rotor
              } else {
                inst.rotationY += 0.015;
              }
            }

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

    if (isRaining) {
      applyRain(map, true);
    }
  }, [theme, isRaining, applyRain]);

  // View mode switcher
  const flyToMode = useCallback((mode: 'city' | 'solar' | 'national' | 'both') => {
    setViewMode(mode);
    if (!mapRef.current) return;
    if (mode === 'city') {
      mapRef.current.flyTo({ center: KURNOOL_CENTER, zoom: 14.5, pitch: 58, bearing: -20, duration: 1600 });
    } else if (mode === 'solar') {
      mapRef.current.flyTo({ center: UMSP_CENTER,    zoom: 13.8, pitch: 48, bearing: 10,  duration: 1800 });
    } else if (mode === 'national') {
      mapRef.current.flyTo({ center: NATIONAL_CENTER, zoom: 5.2, pitch: 45, bearing: -5, duration: 2200 });
    } else {
      mapRef.current.flyTo({ center: [78.16, 15.74], zoom: 10.8, pitch: 30, bearing: 0,   duration: 2000 });
    }
  }, []);

  const navigateToLandmark = (preset: typeof LANDMARK_PRESETS[0]) => {
    const asset = allAssets.find(a => a.id === preset.id);
    if (asset) {
      setSelectedAsset(asset);
    }
    const plant = RENEWABLE_PLANTS.find(p => p.id === preset.id);
    if (plant) {
      onSelectPlant?.(plant);
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

    // 1. Markers for Kurnool Local Assets
    allAssets.forEach(asset => {
      const isSelected = selectedAsset?.id === asset.id;
      const isSolar = asset.id.startsWith('UMSP');
      const isBio = asset.type === 'bio_junction';
      const markerColor = isSelected ? '#00f59b' : (isSolar ? '#f59e0b' : (isBio ? '#38bdf8' : '#00f59b'));

      const el = document.createElement('div');
      el.className = `solterra-asset-marker ${isSelected ? 'is-selected' : ''}`;
      el.title = `${asset.name} (${asset.id})`;

      el.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; position: relative;">
          <div style="
            position: absolute; bottom: calc(100% + 6px);
            background: rgba(9, 12, 22, 0.92); border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(8px); padding: 3px 8px; border-radius: 9999px;
            white-space: nowrap; font-family: monospace; font-size: 10px; font-weight: 700;
            color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.5); pointer-events: none;
            opacity: ${isSelected ? '1' : '0.85'}; transform: scale(${isSelected ? '1.05' : '0.95'});
          ">
            <span style="color: ${markerColor}">●</span> ${asset.id} · ${asset.currentPowerKw ? asset.currentPowerKw + ' kW' : 'Active'}
          </div>
          <div style="
            width: ${isSelected ? '30px' : '24px'}; height: ${isSelected ? '30px' : '24px'};
            border-radius: 9999px; background: ${isSelected ? 'rgba(0, 245, 155, 0.3)' : 'rgba(9, 12, 22, 0.85)'};
            border: 2px solid ${markerColor}; box-shadow: 0 0 ${isSelected ? '18px' : '8px'} ${markerColor};
            display: flex; align-items: center; justify-content: center;
          ">
            <div style="width: 6px; height: 6px; border-radius: 9999px; background: ${markerColor};"></div>
          </div>
          <div style="width: 2px; height: 5px; background: ${markerColor}; opacity: 0.8;"></div>
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

    // 2. Markers for National Renewable Farms (Solar & Wind)
    RENEWABLE_PLANTS.forEach(plant => {
      const isSelected = selectedPlantId === plant.id;
      const markerColor = plant.type === 'solar' ? '#f59e0b' : '#06b6d4';
      const icon = plant.type === 'solar' ? '☀️' : '💨';

      const el = document.createElement('div');
      el.className = `solterra-re-plant-marker cursor-pointer ${isSelected ? 'is-selected' : ''}`;
      el.title = `${plant.name} - ${plant.capacityMw} MW`;

      el.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; position: relative;">
          <!-- Badge -->
          <div style="
            position: absolute; bottom: calc(100% + 8px);
            background: rgba(5, 18, 12, 0.95); border: 1.5px solid ${markerColor};
            backdrop-filter: blur(10px); padding: 4px 10px; border-radius: 8px;
            white-space: nowrap; font-family: monospace; font-size: 11px; font-weight: 700;
            color: #ffffff; box-shadow: 0 4px 16px rgba(0,0,0,0.6); pointer-events: none;
            display: flex; align-items: center; gap: 6px;
            transform: scale(${isSelected ? '1.1' : '0.95'}); transition: transform 0.2s;
          ">
            <span>${icon}</span>
            <span>${plant.name}</span>
            <span style="color: ${markerColor}; background: rgba(0,0,0,0.4); padding: 1px 5px; border-radius: 4px;">${plant.capacityMw} MW</span>
          </div>

          <!-- Pulsing Beacon Pin -->
          <div style="
            width: ${isSelected ? '36px' : '28px'}; height: ${isSelected ? '36px' : '28px'};
            border-radius: 9999px; background: rgba(5, 18, 12, 0.85);
            border: 2px solid ${markerColor}; box-shadow: 0 0 ${isSelected ? '24px' : '12px'} ${markerColor};
            display: flex; align-items: center; justify-content: center; font-size: 13px;
          ">
            <span>${icon}</span>
          </div>
          <div style="width: 2px; height: 8px; background: ${markerColor};"></div>
        </div>
      `;

      el.onclick = (e) => {
        e.stopPropagation();
        lastClickRef.current = Date.now();
        onSelectPlant?.(plant);
        map.flyTo({
          center: plant.coordinates,
          zoom: 14.2,
          pitch: plant.type === 'wind' ? 58 : 50,
          bearing: 15,
          duration: 1800,
          essential: true
        });
      };

      const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat(plant.coordinates)
        .addTo(map);

      markersRef.current.push(marker);
    });

    // 3. Markers for Major Energy Demand Centers
    DEMAND_CENTERS.forEach(dc => {
      const el = document.createElement('div');
      el.className = 'solterra-demand-center-marker cursor-pointer';
      el.title = `${dc.name} - ${dc.peakDemandMw} MW Demand`;

      el.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; position: relative;">
          <div style="
            position: absolute; bottom: calc(100% + 6px);
            background: rgba(14, 26, 48, 0.95); border: 1px solid #38bdf8;
            backdrop-filter: blur(8px); padding: 3px 8px; border-radius: 6px;
            white-space: nowrap; font-family: monospace; font-size: 10px; font-weight: 700;
            color: #ffffff; box-shadow: 0 4px 14px rgba(0,0,0,0.6); pointer-events: none;
          ">
            <span style="color: #38bdf8">🏙️</span> ${dc.name} · <span style="color: #f59e0b">${dc.peakDemandMw} MW Demand</span>
          </div>
          <div style="
            width: 22px; height: 22px; border-radius: 9999px; background: rgba(14, 26, 48, 0.85);
            border: 2px solid #38bdf8; box-shadow: 0 0 12px #38bdf8;
            display: flex; align-items: center; justify-content: center;
          ">
            <div style="width: 6px; height: 6px; border-radius: 9999px; background: #38bdf8;"></div>
          </div>
        </div>
      `;

      el.onclick = (e) => {
        e.stopPropagation();
        map.flyTo({
          center: dc.coordinates,
          zoom: 12.5,
          pitch: 52,
          bearing: -15,
          duration: 1800,
          essential: true
        });
      };

      const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat(dc.coordinates)
        .addTo(map);

      markersRef.current.push(marker);
    });

    // 4. Interactive 3D EV Charging Stations Network Markers (Live Free Plugs Badge)
    EV_CHARGING_STATIONS.forEach(station => {
      const isSelected = selectedEvStationId === station.id;
      const el = document.createElement('div');
      el.className = `solterra-ev-marker cursor-pointer ${isSelected ? 'is-selected' : ''}`;
      el.title = `${station.name} (${station.plugsAvailable}/${station.plugsTotal} Plugs Free)`;

      const isFast = station.fastDcKw >= 150;
      const badgeColor = station.status === 'full' ? '#ef4444' : (station.status === 'busy' ? '#f59e0b' : '#00f59b');

      el.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; position: relative;">
          <!-- Live Status Pill -->
          <div style="
            position: absolute; bottom: calc(100% + 7px);
            background: rgba(3, 18, 12, 0.94); border: 1.5px solid ${badgeColor};
            backdrop-filter: blur(8px); padding: 3px 8px; border-radius: 9999px;
            white-space: nowrap; font-family: monospace; font-size: 10px; font-weight: 700;
            color: #ffffff; box-shadow: 0 4px 14px rgba(0,245,155,0.3); pointer-events: none;
            display: flex; align-items: center; gap: 4px;
            transform: scale(${isSelected ? '1.08' : '0.92'}); transition: transform 0.2s;
          ">
            <span style="font-size: 10px;">⛽</span>
            <span style="color: #ffffff; font-weight: 700;">${station.petrolBunkBrand ? station.petrolBunkBrand.split(' ')[0] : 'Bunk'}</span>
            <span style="background: rgba(0,245,155,0.18); color: ${badgeColor}; padding: 1px 5px; border-radius: 9999px; font-weight: 700;">
              ${station.plugsAvailable}/${station.plugsTotal} Free
            </span>
            ${isFast ? '<span style="background: #0284c7; color: white; padding: 1px 4px; border-radius: 4px; font-size: 8px;">DC FAST</span>' : ''}
          </div>

          <!-- Compact Petrol Bunk EV Pin -->
          <div style="
            width: ${isSelected ? '28px' : '22px'}; height: ${isSelected ? '28px' : '22px'};
            border-radius: 9999px; background: rgba(3, 18, 12, 0.92);
            border: 2px solid ${badgeColor}; box-shadow: 0 0 ${isSelected ? '18px' : '8px'} ${badgeColor};
            display: flex; align-items: center; justify-content: center; font-size: 10px;
            color: ${badgeColor};
          ">
            <span>⚡</span>
          </div>
          <div style="width: 2px; height: 5px; background: ${badgeColor};"></div>
        </div>
      `;

      el.onclick = (e) => {
        e.stopPropagation();
        lastClickRef.current = Date.now();
        onSelectEvStation?.(station);
        map.flyTo({
          center: station.coordinates,
          zoom: 17.5,
          pitch: 62,
          bearing: -15,
          duration: 1600,
          essential: true
        });
      };

      const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat(station.coordinates)
        .addTo(map);

      markersRef.current.push(marker);
    });

  }, [allAssets, selectedAsset, selectedPlantId, selectedEvStationId, mapLoaded, setCameraFocus, setSelectedAsset, onSelectPlant, onSelectEvStation]);

  // Initialise Mapbox Map instance
  useEffect(() => {
    const activeToken = mapboxToken || MAPBOX_PUBLIC_TOKEN;
    if (!activeToken || !mapContainerRef.current) return;

    mapboxgl.accessToken = activeToken;

    // Pre-populate 3D model instances: Kurnool local assets + National Renewable Farm Bunches
    const initialInstances: ModelInstance[] = [];

    // 1. Kurnool local baseline assets
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
      scene.add(ambient, sun, fill);

      const instance: ModelInstance = {
        id: asset.id,
        name: asset.name,
        type: asset.type,
        scene,
        mc,
        meterScale,
        realSize,
        rotationY: -(asset.rotation ?? 0) * Math.PI / 180,
        isReady: false,
        isTurbine: asset.type === 'wind_turbine',
      };

      initialInstances.push(instance);

      const glbPath = ASSET_GLB[asset.type];
      const loadMesh = glbPath ? loadGLB(glbPath) : Promise.resolve(buildProceduralMesh(asset.type));

      loadMesh.then((mesh) => {
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

    // 2. National Renewable Energy Farms: "Bunches" of 3D Models per farm
    RENEWABLE_PLANTS.forEach(plant => {
      const offsets = generateFarmBunchOffsets(plant.coordinates, plant.farmClusterSize, plant.type);

      offsets.forEach((off, idx) => {
        const mc = mapboxgl.MercatorCoordinate.fromLngLat(
          { lng: off.lng, lat: off.lat },
          0
        );
        const meterScale = mc.meterInMercatorCoordinateUnits();
        const realSize = plant.type === 'wind' 
          ? (ASSET_REAL_SIZE.wind_turbine * plant.modelScale * off.scaleMod)
          : (ASSET_REAL_SIZE.solar_canopy * plant.modelScale * off.scaleMod);

        const scene = new THREE.Scene();
        const ambient = new THREE.AmbientLight(0xffffff, 2.8);
        const sun = new THREE.DirectionalLight(0xfff8ee, 3.4);
        sun.position.set(0, -60, 90).normalize();
        scene.add(ambient, sun);

        const instance: ModelInstance = {
          id: `${plant.id}-unit-${idx}`,
          name: `${plant.name} #${idx + 1}`,
          type: plant.type,
          scene,
          mc,
          meterScale,
          realSize,
          rotationY: off.rotationY * Math.PI / 180,
          isReady: false,
          isTurbine: plant.type === 'wind',
        };

        initialInstances.push(instance);

        const glbPath = plant.type === 'wind'
          ? ASSET_GLB.wind_turbine
          : ASSET_GLB.solar_canopy;

        const loadMesh = glbPath ? loadGLB(glbPath) : Promise.resolve(buildProceduralMesh(plant.type === 'wind' ? 'wind_turbine' : 'solar_canopy'));

        loadMesh.then((mesh) => {
          // If wind turbine, look for rotor / blades group to spin
          if (plant.type === 'wind') {
            const rotor = mesh.getObjectByName('rotorGroup') || mesh.children[0]?.children?.find(c => c.name.toLowerCase().includes('blade') || c.name.toLowerCase().includes('rotor'));
            if (rotor) instance.rotorMesh = rotor;
          }
          scene.add(mesh);
          instance.isReady = true;
          mapRef.current?.triggerRepaint();
        }).catch(() => {
          const fallback = buildProceduralMesh(plant.type === 'wind' ? 'wind_turbine' : 'solar_canopy');
          scene.add(fallback);
          instance.isReady = true;
          mapRef.current?.triggerRepaint();
        });
      });
    });

    // 3. 3D EV Charging Station Hubs (Kurnool & Regional Transit Nodes)
    EV_CHARGING_STATIONS.forEach(evStation => {
      const mc = mapboxgl.MercatorCoordinate.fromLngLat(
        { lng: evStation.coordinates[0], lat: evStation.coordinates[1] },
        0
      );
      const meterScale = mc.meterInMercatorCoordinateUnits();
      const realSize = 1.0; // Realistic 1:1 meter scale for petrol bunk EV charging bay

      const scene = new THREE.Scene();
      const ambient = new THREE.AmbientLight(0xffffff, 2.6);
      const sun = new THREE.DirectionalLight(0x00f59b, 2.8);
      sun.position.set(0, 40, 20).normalize();
      scene.add(ambient, sun);

      const instance: ModelInstance = {
        id: evStation.id,
        name: evStation.name,
        type: 'ev_station',
        scene,
        mc,
        meterScale,
        realSize,
        rotationY: 0,
        isReady: false,
      };

      initialInstances.push(instance);

      const mesh = buildProceduralMesh('ev_station');
      scene.add(mesh);
      instance.isReady = true;
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
      minZoom:    4,
    });

    map.on('move', updateHudPosition);
    map.on('zoom', updateHudPosition);
    map.on('pitch', updateHudPosition);

    map.on('style.load', () => {
      setMapLoaded(true);
      setupLayers(map);
    });

    map.on('load', () => {
      setMapLoaded(true);
      setupLayers(map);

      // Dash animation for transmission lines & city microgrid feeders
      let dashOffset = 0;
      const animateDash = () => {
        dashOffset = (dashOffset + 0.08) % 12;
        if (map.getLayer('transmission-lines-flow-dash')) {
          map.setPaintProperty('transmission-lines-flow-dash', 'line-dasharray', [0.8, 2.5]);
        }
        if (map.getLayer('city-feeders-pulse-dash')) {
          map.setPaintProperty('city-feeders-pulse-dash', 'line-dasharray', [0.8, 2.2]);
        }
        animFrameRef.current = requestAnimationFrame(animateDash);
      };
      animFrameRef.current = requestAnimationFrame(animateDash);
    });

    // FOOLPROOF ASSET CLICKING & PROXIMITY HIT CHECK
    map.on('click', (e) => {
      if (Date.now() - lastClickRef.current < 350) return;

      // 1. Check proximity to 3D EV Charging Stations
      let nearestEV: EVChargingStationItem | null = null;
      let minEvDist = 45;
      for (const ev of EV_CHARGING_STATIONS) {
        const screenPos = map.project(ev.coordinates);
        const dist = Math.hypot(screenPos.x - e.point.x, screenPos.y - e.point.y);
        if (dist < minEvDist) {
          minEvDist = dist;
          nearestEV = ev;
        }
      }
      if (nearestEV) {
        lastClickRef.current = Date.now();
        onSelectEvStation?.(nearestEV);
        map.flyTo({ center: nearestEV.coordinates, zoom: 17.5, pitch: 62, duration: 1600 });
        return;
      }

      // 2. Check proximity to Renewable Plants
      let nearestPlant: RenewablePlantData | null = null;
      let minPlantDist = 45;
      for (const plant of RENEWABLE_PLANTS) {
        const screenPos = map.project(plant.coordinates);
        const dist = Math.hypot(screenPos.x - e.point.x, screenPos.y - e.point.y);
        if (dist < minPlantDist) {
          minPlantDist = dist;
          nearestPlant = plant;
        }
      }
      if (nearestPlant) {
        lastClickRef.current = Date.now();
        onSelectPlant?.(nearestPlant);
        map.flyTo({ center: nearestPlant.coordinates, zoom: 14.2, pitch: 55, duration: 1600 });
        return;
      }

      // 3. Check proximity to Local Assets
      let nearestAsset: InfrastructureAsset | null = null;
      let minDistance = 45;
      for (const asset of allAssets) {
        const screenPos = map.project(asset.coordinates);
        const dist = Math.hypot(screenPos.x - e.point.x, screenPos.y - e.point.y);
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
        setSelectedAsset(null);
        onSelectPlant?.(null);
        onSelectEvStation?.(null);
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
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
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

      {/* ── Top Bar: View Switcher (Kurnool City, Solar Park, National RE Grid, Overview) ── */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 bg-black/70 backdrop-blur-2xl border border-emerald-500/20 rounded-2xl p-1.5 shadow-2xl">
        {([
          ['city',     'Kurnool City',           <MapIcon size={13} key="map" />],
          ['solar',    'Kurnool Solar Park',     <Sun size={13} key="sun" />],
          ['national', '🇮🇳 National RE Grid',   <Zap size={13} key="zap" />],
          ['both',     'Regional Overview',      <Globe size={13} key="globe" />],
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
            title: 'Reset National Grid View',
            active: false,
            onClick: () => flyToMode('national'),
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

      {/* ── Bottom Strip: Quick Jump Landmark & Mega-Farm Presets ──────────── */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-black/75 backdrop-blur-2xl border border-emerald-500/20 shadow-2xl max-w-[94vw] overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider pr-1 hidden sm:block whitespace-nowrap">
          Quick 3D Farm Jump:
        </span>
        {LANDMARK_PRESETS.map((preset) => {
          const isSelected = selectedAsset?.id === preset.id || selectedPlantId === preset.id;
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
