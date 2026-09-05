import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { AssetType } from '../types/solterra';
import { createProceduralModel, ASSET_MODEL_PATHS } from './modelRegistry';

const thumbnailCache: Partial<Record<AssetType, string>> = {};
const pendingPromises: Partial<Record<AssetType, Promise<string>>> = {};

const gltfLoader = new GLTFLoader();

/**
 * Renders a high-res 3D snapshot of a model into a base64 Data URL.
 */
export async function getAssetThumbnail(type: AssetType): Promise<string> {
  if (thumbnailCache[type]) {
    return thumbnailCache[type]!;
  }

  if (pendingPromises[type]) {
    return pendingPromises[type]!;
  }

  const promise = (async () => {
    try {
      const width = 360;
      const height = 240;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(1.5);
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
      camera.position.set(3.6, 2.8, 4.2);
      camera.lookAt(0, 0.6, 0);

      // Lighting
      const ambLight = new THREE.AmbientLight(0xffffff, 2.2);
      const sunLight = new THREE.DirectionalLight(0xfffaed, 3.2);
      sunLight.position.set(5, 10, 7);
      const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
      fillLight.position.set(-5, 4, -4);
      const rimLight = new THREE.DirectionalLight(0x00f59b, 1.2);
      rimLight.position.set(0, -3, 3);
      scene.add(ambLight, sunLight, fillLight, rimLight);

      // Glowing circular pedestal
      const ringGeo = new THREE.RingGeometry(1.6, 1.68, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00f59b,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);

      const discGeo = new THREE.CircleGeometry(1.6, 32);
      const discMat = new THREE.MeshBasicMaterial({
        color: 0x00f59b,
        transparent: true,
        opacity: 0.06,
        side: THREE.DoubleSide,
      });
      const disc = new THREE.Mesh(discGeo, discMat);
      disc.rotation.x = Math.PI / 2;
      scene.add(disc);

      // Load mesh
      const glbUrl = ASSET_MODEL_PATHS[type];
      let modelGroup: THREE.Group;

      if (glbUrl) {
        try {
          const gltf = await new Promise<any>((res, rej) => gltfLoader.load(glbUrl, res, undefined, rej));
          modelGroup = gltf.scene;

          // Normalize bounding box
          const box = new THREE.Box3().setFromObject(modelGroup);
          const size = new THREE.Vector3();
          box.getSize(size);
          const center = new THREE.Vector3();
          box.getCenter(center);
          const maxDim = Math.max(size.x, size.y, size.z);

          modelGroup.position.sub(center);
          modelGroup.position.y += size.y / 2;

          if (maxDim > 0) {
            const s = 1.8 / maxDim;
            modelGroup.scale.setScalar(s);
            modelGroup.position.multiplyScalar(s);
          }

          const box2 = new THREE.Box3().setFromObject(modelGroup);
          modelGroup.position.y -= box2.min.y;

          // Preserve materials and make double sided
          modelGroup.traverse((c) => {
            if ((c as THREE.Mesh).isMesh) {
              const m = c as THREE.Mesh;
              const mats = Array.isArray(m.material) ? m.material : [m.material];
              mats.forEach((mat: any) => {
                mat.side = THREE.DoubleSide;
                if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace;
                mat.needsUpdate = true;
              });
            }
          });
        } catch {
          modelGroup = createProceduralModel(type);
        }
      } else {
        modelGroup = createProceduralModel(type);
      }

      modelGroup.rotation.y = 0.5; // nice 3/4 angle
      scene.add(modelGroup);

      renderer.render(scene, camera);
      const dataUrl = canvas.toDataURL('image/webp', 0.92);

      renderer.dispose();
      thumbnailCache[type] = dataUrl;
      return dataUrl;
    } catch (err) {
      console.warn(`Failed to generate 3D thumbnail for ${type}:`, err);
      return '';
    }
  })();

  pendingPromises[type] = promise;
  return promise;
}
