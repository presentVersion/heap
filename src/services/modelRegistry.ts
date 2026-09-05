import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { AssetType } from '../types/solterra';

// Model loading cache
const loadedGltfCache = new Map<string, THREE.Group>();
const loadingPromises = new Map<string, Promise<THREE.Group>>();

const gltfLoader = new GLTFLoader();

/**
 * Model URL mappings discovered in public/models/
 */
export const ASSET_MODEL_PATHS: Record<AssetType, string | null> = {
  solar_flower: '/models/smartflower_fbx.glb',
  solar_canopy: '/models/soler_panel_setup.glb',
  rooftop_solar: '/models/solar_panel_1x1.glb',
  bio_junction: '/models/meshy-model.glb', // large model with fallback
  smart_pole: null, // use procedural high-fidelity model
  ev_station: null,
  battery_system: null,
  wind_turbine: null
};

/**
 * Load and normalize a GLTF/GLB model from URL
 */
export async function loadGltfModel(url: string, targetScale = 1.0): Promise<THREE.Group> {
  if (loadedGltfCache.has(url)) {
    return loadedGltfCache.get(url)!.clone();
  }

  if (loadingPromises.has(url)) {
    const model = await loadingPromises.get(url)!;
    return model.clone();
  }

  const promise = new Promise<THREE.Group>((resolve, reject) => {
    gltfLoader.load(
      url,
      (gltf) => {
        const root = gltf.scene;
        // Compute bounding box to normalize scale and center pivot
        const bbox = new THREE.Box3().setFromObject(root);
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const center = new THREE.Vector3();
        bbox.getCenter(center);

        // Center on X and Z, place bottom at Y=0
        root.position.x -= center.x;
        root.position.z -= center.z;
        root.position.y -= bbox.min.y;

        // Normalize max dimension to around targetScale meters
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) {
          const normFactor = (targetScale * 5.0) / maxDim;
          root.scale.set(normFactor, normFactor, normFactor);
        }

        // Enable shadows and enhance materials
        root.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = Math.min(0.6, mat.roughness ?? 0.5);
              mat.metalness = Math.max(0.2, mat.metalness ?? 0.3);
            }
          }
        });

        const group = new THREE.Group();
        group.add(root);
        loadedGltfCache.set(url, group);
        resolve(group);
      },
      undefined,
      (error) => {
        console.warn(`Failed to load external GLB from ${url}, using procedural fallback`, error);
        reject(error);
      }
    );
  });

  loadingPromises.set(url, promise);
  const result = await promise;
  return result.clone();
}

/**
 * Procedural Model Generators matching the SolTerra Reference Visuals
 */

export function createProceduralModel(type: AssetType, isProposed = false): THREE.Group {
  const group = new THREE.Group();
  const accentColor = isProposed ? 0x00ffff : 0x00f59b;

  switch (type) {
    case 'solar_flower': {
      // Base pedestal with glowing circle
      const baseGeo = new THREE.CylinderGeometry(1.8, 2.2, 0.4, 32);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = 0.2;
      group.add(base);

      // Glowing pedestal ring
      const ringGeo = new THREE.TorusGeometry(1.9, 0.08, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: accentColor });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.42;
      group.add(ring);

      // Stem/Mast
      const stemGeo = new THREE.CylinderGeometry(0.2, 0.35, 3.8, 16);
      const stemMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9, roughness: 0.3 });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.y = 2.1;
      group.add(stem);

      // Solar Petals
      const petalGroup = new THREE.Group();
      petalGroup.position.y = 4.0;
      petalGroup.rotation.x = 0.4; // Tilted towards the sun

      const petalCount = 12;
      for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * Math.PI * 2;
        const petalGeo = new THREE.BoxGeometry(0.7, 0.05, 2.2);
        const petalMat = new THREE.MeshStandardMaterial({ 
          color: isProposed ? 0x0ea5e9 : 0x1e3a8a, 
          roughness: 0.1, 
          metalness: 0.6 
        });
        const petal = new THREE.Mesh(petalGeo, petalMat);
        petal.position.set(Math.cos(angle) * 1.3, 0, Math.sin(angle) * 1.3);
        petal.rotation.y = -angle;
        petalGroup.add(petal);
      }

      // Center tracking hub
      const hubGeo = new THREE.SphereGeometry(0.5, 16, 16);
      const hubMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.9 });
      const hub = new THREE.Mesh(hubGeo, hubMat);
      petalGroup.add(hub);

      group.add(petalGroup);
      break;
    }

    case 'smart_pole': {
      // Base
      const baseGeo = new THREE.CylinderGeometry(0.4, 0.6, 0.3, 16);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = 0.15;
      group.add(base);

      // Slender IoT Column
      const poleGeo = new THREE.CylinderGeometry(0.12, 0.22, 7.5, 16);
      const poleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 });
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.y = 3.9;
      group.add(pole);

      // Glowing sensor ring
      const sensorRingGeo = new THREE.TorusGeometry(0.28, 0.06, 16, 32);
      const sensorRingMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
      const sensorRing = new THREE.Mesh(sensorRingGeo, sensorRingMat);
      sensorRing.rotation.x = Math.PI / 2;
      sensorRing.position.y = 5.2;
      group.add(sensorRing);

      // Top mini solar wing
      const solarWingGeo = new THREE.BoxGeometry(1.6, 0.04, 0.8);
      const solarWingMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.2 });
      const solarWing = new THREE.Mesh(solarWingGeo, solarWingMat);
      solarWing.position.y = 7.7;
      solarWing.rotation.z = 0.25;
      group.add(solarWing);

      // LED luminaire arms
      const luminaireGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.2, 8);
      const luminaireMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
      const luminaire = new THREE.Mesh(luminaireGeo, luminaireMat);
      luminaire.rotation.z = Math.PI / 2;
      luminaire.position.set(0.6, 6.8, 0);
      group.add(luminaire);
      break;
    }

    case 'solar_canopy': {
      // Concrete foundation pads
      const padGeo = new THREE.BoxGeometry(0.8, 0.3, 0.8);
      const padMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
      
      const postMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
      const postGeo = new THREE.CylinderGeometry(0.18, 0.22, 3.6, 16);

      [-2.2, 2.2].forEach(x => {
        const pad = new THREE.Mesh(padGeo, padMat);
        pad.position.set(x, 0.15, 0);
        group.add(pad);

        const post = new THREE.Mesh(postGeo, postMat);
        post.position.set(x, 1.95, 0);
        post.rotation.z = x > 0 ? -0.08 : 0.08;
        group.add(post);
      });

      // Canopy frame and dual-tilt solar arrays
      const canopyGroup = new THREE.Group();
      canopyGroup.position.y = 3.7;
      canopyGroup.rotation.x = 0.18; // Angled solar pitch

      const frameGeo = new THREE.BoxGeometry(6.4, 0.12, 4.2);
      const frameMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 });
      const frame = new THREE.Mesh(frameGeo, frameMat);
      canopyGroup.add(frame);

      // High-efficiency PV modules on canopy
      const pvGeo = new THREE.BoxGeometry(6.1, 0.08, 3.9);
      const pvMat = new THREE.MeshStandardMaterial({ 
        color: isProposed ? 0x0284c7 : 0x172554, 
        metalness: 0.6, 
        roughness: 0.15 
      });
      const pv = new THREE.Mesh(pvGeo, pvMat);
      pv.position.y = 0.08;
      canopyGroup.add(pv);

      // Under-canopy LED illumination strip
      const ledGeo = new THREE.BoxGeometry(5.8, 0.04, 0.1);
      const ledMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(0, -0.1, 0);
      canopyGroup.add(led);

      group.add(canopyGroup);
      break;
    }

    case 'ev_station': {
      // Charging bay ground plate
      const bayGeo = new THREE.BoxGeometry(3.6, 0.1, 2.4);
      const bayMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
      const bay = new THREE.Mesh(bayGeo, bayMat);
      bay.position.y = 0.05;
      group.add(bay);

      // Dual DC Fast Chargers
      [-0.9, 0.9].forEach(x => {
        const chargerGeo = new THREE.BoxGeometry(0.7, 2.2, 0.6);
        const chargerMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.5, roughness: 0.3 });
        const charger = new THREE.Mesh(chargerGeo, chargerMat);
        charger.position.set(x, 1.15, -0.6);
        group.add(charger);

        // Display screen
        const screenGeo = new THREE.PlaneGeometry(0.45, 0.35);
        const screenMat = new THREE.MeshBasicMaterial({ color: 0x00f59b });
        const screen = new THREE.Mesh(screenGeo, screenMat);
        screen.position.set(x, 1.5, -0.29);
        group.add(screen);

        // Status LED bar
        const statusBarGeo = new THREE.BoxGeometry(0.5, 0.05, 0.05);
        const statusBarMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
        const statusBar = new THREE.Mesh(statusBarGeo, statusBarMat);
        statusBar.position.set(x, 2.1, -0.28);
        group.add(statusBar);
      });
      break;
    }

    case 'bio_junction': {
      // Central biological circular base
      const baseGeo = new THREE.CylinderGeometry(3.2, 3.6, 0.6, 32);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = 0.3;
      group.add(base);

      // Cylindrical glass bioreactor
      const glassGeo = new THREE.CylinderGeometry(2.4, 2.4, 4.2, 32);
      const glassMat = new THREE.MeshPhysicalMaterial({ 
        color: 0x10b981, 
        transparent: true, 
        opacity: 0.45, 
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.7
      });
      const glassTower = new THREE.Mesh(glassGeo, glassMat);
      glassTower.position.y = 2.6;
      group.add(glassTower);

      // Inner glowing biological helix / core
      const coreGeo = new THREE.CylinderGeometry(0.8, 0.8, 4.0, 16);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0x00f59b });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.y = 2.6;
      group.add(core);

      // Bioluminescent external rings
      [1.5, 2.8, 4.0].forEach(y => {
        const ringGeo = new THREE.TorusGeometry(2.55, 0.08, 16, 48);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = y;
        group.add(ring);
      });
      break;
    }

    case 'battery_system': {
      // Modular BESS Container (Tesla Megapack style)
      const containerGeo = new THREE.BoxGeometry(4.8, 2.6, 2.2);
      const containerMat = new THREE.MeshStandardMaterial({ 
        color: 0xf1f5f9, 
        metalness: 0.3, 
        roughness: 0.4 
      });
      const container = new THREE.Mesh(containerGeo, containerMat);
      container.position.y = 1.3;
      group.add(container);

      // Ventilation and cooling louvers
      const louverGeo = new THREE.BoxGeometry(1.2, 1.8, 0.1);
      const louverMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
      [-1.4, 1.4].forEach(x => {
        const louver = new THREE.Mesh(louverGeo, louverMat);
        louver.position.set(x, 1.3, 1.12);
        group.add(louver);
      });

      // High voltage indicator bar
      const indGeo = new THREE.BoxGeometry(4.0, 0.06, 0.04);
      const indMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
      const ind = new THREE.Mesh(indGeo, indMat);
      ind.position.set(0, 2.4, 1.12);
      group.add(ind);
      break;
    }

    case 'rooftop_solar': {
      // Concrete roof base
      const roofGeo = new THREE.BoxGeometry(5.2, 0.4, 4.2);
      const roofMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 });
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.y = 0.2;
      group.add(roof);

      // Array of angled solar panels
      const pvGroup = new THREE.Group();
      pvGroup.position.y = 0.5;
      pvGroup.rotation.x = 0.26; // 15 degree angle
      const panelGeo = new THREE.BoxGeometry(4.8, 0.08, 3.6);
      const panelMat = new THREE.MeshStandardMaterial({ 
        color: isProposed ? 0x0284c7 : 0x172554, 
        metalness: 0.7, 
        roughness: 0.2 
      });
      const panel = new THREE.Mesh(panelGeo, panelMat);
      pvGroup.add(panel);
      group.add(pvGroup);
      break;
    }

    case 'wind_turbine': {
      // Foundation
      const baseGeo = new THREE.CylinderGeometry(0.8, 1.2, 0.4, 16);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = 0.2;
      group.add(base);

      // High tubular tower
      const towerGeo = new THREE.CylinderGeometry(0.2, 0.45, 10.5, 16);
      const towerMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
      const tower = new THREE.Mesh(towerGeo, towerMat);
      tower.position.y = 5.4;
      group.add(tower);

      // Nacelle
      const nacelleGeo = new THREE.BoxGeometry(0.7, 0.6, 1.8);
      const nacelleMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0 });
      const nacelle = new THREE.Mesh(nacelleGeo, nacelleMat);
      nacelle.position.set(0, 10.7, 0.3);
      group.add(nacelle);

      // 3-blade rotor hub
      const rotorGroup = new THREE.Group();
      rotorGroup.position.set(0, 10.7, 1.3);

      const hubGeo = new THREE.SphereGeometry(0.35, 16, 16);
      const hub = new THREE.Mesh(hubGeo, towerMat);
      rotorGroup.add(hub);

      for (let i = 0; i < 3; i++) {
        const bladeAngle = (i / 3) * Math.PI * 2;
        const bladeGeo = new THREE.BoxGeometry(0.16, 4.2, 0.04);
        const bladeMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.position.set(Math.sin(bladeAngle) * 2.1, Math.cos(bladeAngle) * 2.1, 0);
        blade.rotation.z = -bladeAngle;
        rotorGroup.add(blade);
      }
      group.add(rotorGroup);
      break;
    }
  }

  // If proposed, apply subtle neon holographic aura
  if (isProposed) {
    const haloGeo = new THREE.RingGeometry(2.4, 2.7, 32);
    const haloMat = new THREE.MeshBasicMaterial({ 
      color: 0x00f59b, 
      side: THREE.DoubleSide, 
      transparent: true, 
      opacity: 0.6 
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = Math.PI / 2;
    halo.position.y = 0.02;
    group.add(halo);
  }

  return group;
}

/**
 * Get Model Instance: Tries to load discovered GLB file first, falls back to procedural geometry
 */
export async function getModelInstance(type: AssetType, isProposed = false): Promise<THREE.Group> {
  const customPath = ASSET_MODEL_PATHS[type];
  
  if (customPath) {
    try {
      const gltf = await loadGltfModel(customPath, 1.0);
      if (isProposed) {
        // Apply glowing aura
        const haloGeo = new THREE.RingGeometry(2.5, 2.9, 32);
        const haloMat = new THREE.MeshBasicMaterial({ color: 0x00f59b, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.rotation.x = Math.PI / 2;
        halo.position.y = 0.05;
        gltf.add(halo);
      }
      return gltf;
    } catch (e) {
      console.warn(`Fallback to procedural model for ${type}`);
    }
  }

  return createProceduralModel(type, isProposed);
}
