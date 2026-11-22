import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { useTheme } from '../../context/ThemeContext';
import {
  createAfterDrawScheduler,
  detectSoftwareWebGL,
  isWebGLAvailable,
} from './threeUtils';

interface GlobalThreeBackdropProps {
  className?: string;
}

// Pre-allocated scratch helpers (zero GC inside animation loop)
const _dummyMatrix = new THREE.Matrix4();
const _dummyPos = new THREE.Vector3();
const _dummyQuat = new THREE.Quaternion();
const _dummyEuler = new THREE.Euler();
const _dummyScale = new THREE.Vector3();
const _colorTmp = new THREE.Color();

export const GlobalThreeBackdrop: React.FC<GlobalThreeBackdropProps> = ({
  className = '',
}) => {
  const { theme } = useTheme();
  const mountRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<'light' | 'dark'>(theme);
  const staticRenderRef = useRef<(() => void) | null>(null);
  const [webglReady, setWebglReady] = useState(true);

  useEffect(() => {
    themeRef.current = theme;
    staticRenderRef.current?.();
  }, [theme]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || !isWebGLAvailable()) {
      setWebglReady(false);
      return;
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isSoftwareGl = detectSoftwareWebGL();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const lightBg = new THREE.Color(0xf4f8ff);
    const darkBg = new THREE.Color(0x071124);
    const currentBg = themeRef.current === 'dark' ? darkBg.clone() : lightBg.clone();

    scene.background = currentBg;
    const fog = new THREE.FogExp2(currentBg.getHex(), 0.022);
    scene.fog = fog;

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 140);
    camera.position.set(0, 1.4, 16);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2)
    );
    renderer.setSize(width, height);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    // Procedural Studio Reflection Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    // Balanced 3-Point Warm/Cool Studio Lighting
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x0f172a, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.45);
    keyLight.position.set(10, 14, 12);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.1);
    rimLight.position.set(-12, 6, -10);
    scene.add(rimLight);

    // Track disposables cleanly
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];

    // Shared PBR Materials
    const brushedMetalMat = new THREE.MeshPhysicalMaterial({
      color: 0x1d4ed8,
      metalness: 0.88,
      roughness: 0.22,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2,
    });
    const titaniumMat = new THREE.MeshPhysicalMaterial({
      color: 0xcbd5e1,
      metalness: 0.9,
      roughness: 0.18,
    });
    const deepCobaltMat = new THREE.MeshStandardMaterial({
      color: 0x0345a4,
      metalness: 0.65,
      roughness: 0.28,
    });
    const glassAccentMat = new THREE.MeshPhysicalMaterial({
      color: 0x7dd3fc,
      metalness: 0.1,
      roughness: 0.12,
      transparent: true,
      opacity: 0.42,
      clearcoat: 1.0,
      depthWrite: false,
    });
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0x0a63d8,
      metalness: 0.72,
      roughness: 0.26,
      transparent: true,
      opacity: 0.55,
    });
    materials.push(brushedMetalMat, titaniumMat, deepCobaltMat, glassAccentMat, tubeMat);

    // =========================================================================
    // 1. Composite Multi-Part Hero Spatial Gyroscope (Upper-Right Depth Zone)
    // =========================================================================
    const gyroGroup = new THREE.Group();
    gyroGroup.position.set(6.2, 2.2, -5.5);

    const outerTorusGeo = new THREE.TorusGeometry(3.1, 0.09, 20, 90);
    const outerRing = new THREE.Mesh(outerTorusGeo, titaniumMat);
    outerRing.rotation.x = Math.PI * 0.28;
    gyroGroup.add(outerRing);

    const midTorusGeo = new THREE.TorusGeometry(2.35, 0.08, 18, 80);
    const midRing = new THREE.Mesh(midTorusGeo, brushedMetalMat);
    midRing.rotation.y = Math.PI * 0.35;
    gyroGroup.add(midRing);

    const innerTorusGeo = new THREE.TorusGeometry(1.55, 0.055, 16, 64);
    const innerRing = new THREE.Mesh(innerTorusGeo, deepCobaltMat);
    innerRing.rotation.z = Math.PI * 0.22;
    gyroGroup.add(innerRing);

    const crystalGeo = new THREE.OctahedronGeometry(0.85, 0);
    const crystalCore = new THREE.Mesh(crystalGeo, glassAccentMat);
    gyroGroup.add(crystalCore);

    const innerSparkGeo = new THREE.OctahedronGeometry(0.42, 0);
    const innerSpark = new THREE.Mesh(innerSparkGeo, brushedMetalMat);
    gyroGroup.add(innerSpark);

    const orbitBeadGeo = new THREE.SphereGeometry(0.14, 16, 16);
    for (let i = 0; i < 4; i++) {
      const bead = new THREE.Mesh(orbitBeadGeo, titaniumMat);
      const angle = (i * Math.PI) / 2;
      bead.position.set(Math.cos(angle) * 3.1, Math.sin(angle) * 3.1, 0);
      outerRing.add(bead);
    }

    geometries.push(
      outerTorusGeo,
      midTorusGeo,
      innerTorusGeo,
      crystalGeo,
      innerSparkGeo,
      orbitBeadGeo
    );
    scene.add(gyroGroup);

    // =========================================================================
    // 2. Composite Multi-Part Stacked Data Ledger Slabs (Lower-Left Depth Zone)
    // =========================================================================
    const ledgerGroup = new THREE.Group();
    ledgerGroup.position.set(-6.4, -2.5, -4.5);

    const slabShape = new THREE.Shape();
    const sw = 2.6;
    const sh = 1.65;
    const sr = 0.22;
    slabShape.moveTo(-sw / 2 + sr, -sh / 2);
    slabShape.lineTo(sw / 2 - sr, -sh / 2);
    slabShape.quadraticCurveTo(sw / 2, -sh / 2, sw / 2, -sh / 2 + sr);
    slabShape.lineTo(sw / 2, sh / 2 - sr);
    slabShape.quadraticCurveTo(sw / 2, sh / 2, sw / 2 - sr, sh / 2);
    slabShape.lineTo(-sw / 2 + sr, sh / 2);
    slabShape.quadraticCurveTo(-sw / 2, sh / 2, -sw / 2, sh / 2 - sr);
    slabShape.lineTo(-sw / 2, -sh / 2 + sr);
    slabShape.quadraticCurveTo(-sw / 2, -sh / 2, -sw / 2 + sr, -sh / 2);

    const slabGeo = new THREE.ExtrudeGeometry(slabShape, {
      depth: 0.14,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 2,
    });
    slabGeo.center();
    geometries.push(slabGeo);

    const slabOffsets = [-0.65, 0, 0.65];
    const slabMeshes: THREE.Mesh[] = [];
    slabOffsets.forEach((yOff, idx) => {
      const mat =
        idx === 1 ? glassAccentMat : idx === 2 ? brushedMetalMat : deepCobaltMat;
      const slab = new THREE.Mesh(slabGeo, mat);
      slab.position.set(idx * 0.12, yOff, idx * 0.18);
      slab.rotation.set(-0.55, 0.35, -0.15);
      ledgerGroup.add(slab);
      slabMeshes.push(slab);
    });
    scene.add(ledgerGroup);

    // =========================================================================
    // 3. Sweeping 3D Circuit Trajectory Ribbons
    // =========================================================================
    const curveA = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-14, 5.5, -12),
      new THREE.Vector3(-5, 2.5, -8),
      new THREE.Vector3(2, -1.0, -7),
      new THREE.Vector3(12, 3.2, -11),
    ]);
    const curveB = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-12, -5.2, -10),
      new THREE.Vector3(-3, -2.2, -6),
      new THREE.Vector3(5, 0.8, -8),
      new THREE.Vector3(15, -3.5, -12),
    ]);
    const tubeGeoA = new THREE.TubeGeometry(curveA, 48, 0.035, 8, false);
    const tubeGeoB = new THREE.TubeGeometry(curveB, 48, 0.03, 8, false);
    geometries.push(tubeGeoA, tubeGeoB);
    scene.add(new THREE.Mesh(tubeGeoA, tubeMat));
    scene.add(new THREE.Mesh(tubeGeoB, tubeMat));

    // =========================================================================
    // 4. InstancedMesh 3D Spatial Nodes Field (42 geometric prisms)
    // =========================================================================
    const NODE_COUNT = 42;
    const nodeGeo = new THREE.OctahedronGeometry(0.18, 0);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.78,
      roughness: 0.24,
    });
    geometries.push(nodeGeo);
    materials.push(nodeMat);

    const nodesInstanced = new THREE.InstancedMesh(nodeGeo, nodeMat, NODE_COUNT);
    nodesInstanced.frustumCulled = false;

    const nodeSeeds = Array.from({ length: NODE_COUNT }, (_, i) => {
      const golden = i * 2.39996;
      const radius = 5.5 + (i % 7) * 1.9;
      return {
        x: Math.cos(golden) * radius * 1.45,
        y: ((i % 9) - 4) * 2.2,
        z: -4 - (i % 6) * 3.2,
        scale: 0.65 + (i % 5) * 0.16,
        phase: i * 0.43,
        speed: 0.35 + (i % 4) * 0.12,
      };
    });

    const paletteHex = [0x0345a4, 0x0a63d8, 0x38bdf8, 0x94a3b8];
    nodeSeeds.forEach((seed, i) => {
      _dummyPos.set(seed.x, seed.y, seed.z);
      _dummyEuler.set(seed.phase, seed.phase * 0.7, 0);
      _dummyQuat.setFromEuler(_dummyEuler);
      _dummyScale.setScalar(seed.scale);
      _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
      nodesInstanced.setMatrixAt(i, _dummyMatrix);
      _colorTmp.setHex(paletteHex[i % paletteHex.length]);
      nodesInstanced.setColorAt(i, _colorTmp);
    });
    nodesInstanced.instanceMatrix.needsUpdate = true;
    if (nodesInstanced.instanceColor) {
      nodesInstanced.instanceColor.needsUpdate = true;
    }
    nodesInstanced.computeBoundingSphere();
    scene.add(nodesInstanced);

    // =========================================================================
    // Input & Scroll State (Zero React re-renders)
    // =========================================================================
    let targetPointerX = 0;
    let targetPointerY = 0;
    let smoothPointerX = 0;
    let smoothPointerY = 0;
    let targetScrollRatio = 0;
    let smoothScrollRatio = 0;

    const onPointerMove = (e: PointerEvent) => {
      targetPointerX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetPointerY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onScroll = () => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      targetScrollRatio = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    };

    const onResize = () => {
      if (!container) return;
      const w = Math.max(1, container.clientWidth || window.innerWidth);
      const h = Math.max(1, container.clientHeight || window.innerHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(
        isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2)
      );
      renderer.setSize(w, h);
      staticRenderRef.current?.();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    onScroll();

    let contextLost = false;
    const onContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
    };
    const onContextRestored = () => {
      contextLost = false;
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener(
      'webglcontextrestored',
      onContextRestored
    );

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const timer = new THREE.Timer();
    timer.connect(document);
    const afterDraw = createAfterDrawScheduler(renderer);
    let rafId = 0;
    let unmounted = false;

    const renderFrame = (elapsed: number, delta: number) => {
      if (contextLost || unmounted) return;

      // Sync light / dark atmosphere cleanly without tearing down WebGL
      const targetBg = themeRef.current === 'dark' ? darkBg : lightBg;
      currentBg.lerp(targetBg, Math.min(1, delta * 8));
      scene.background = currentBg;
      fog.color.copy(currentBg);
      fog.density = themeRef.current === 'dark' ? 0.025 : 0.018;
      hemiLight.intensity = themeRef.current === 'dark' ? 0.65 : 0.95;

      // Smooth pointer + scroll damping
      smoothPointerX = THREE.MathUtils.damp(
        smoothPointerX,
        targetPointerX,
        4.5,
        delta
      );
      smoothPointerY = THREE.MathUtils.damp(
        smoothPointerY,
        targetPointerY,
        4.5,
        delta
      );
      smoothScrollRatio = THREE.MathUtils.damp(
        smoothScrollRatio,
        targetScrollRatio,
        4.0,
        delta
      );

      // Camera Spatial Travel across Page Scroll + Pointer Parallax
      camera.position.x = smoothPointerX * 1.1 + Math.sin(smoothScrollRatio * Math.PI) * 1.4;
      camera.position.y = 1.4 - smoothScrollRatio * 3.8 - smoothPointerY * 0.7;
      camera.position.z = 16 - smoothScrollRatio * 2.4;
      camera.lookAt(
        smoothPointerX * 0.35,
        -smoothScrollRatio * 2.2 - smoothPointerY * 0.25,
        -5
      );

      // Rotate Hero Gyroscope Rings
      outerRing.rotation.z = elapsed * 0.16;
      outerRing.rotation.x = Math.PI * 0.28 + Math.sin(elapsed * 0.25) * 0.15;
      midRing.rotation.y = elapsed * 0.24;
      midRing.rotation.x = elapsed * 0.11;
      innerRing.rotation.z = -elapsed * 0.3;
      crystalCore.rotation.y = elapsed * 0.45;
      crystalCore.rotation.x = elapsed * 0.22;
      innerSpark.rotation.y = -elapsed * 0.65;
      gyroGroup.position.y = 2.2 + Math.sin(elapsed * 0.5) * 0.35 - smoothScrollRatio * 1.2;

      // Subtle Floating Ledger Slabs
      slabMeshes.forEach((slab, idx) => {
        slab.position.y =
          slabOffsets[idx] + Math.sin(elapsed * 0.7 + idx * 1.1) * 0.14;
        slab.rotation.z = -0.15 + Math.sin(elapsed * 0.4 + idx) * 0.04;
      });
      ledgerGroup.position.y = -2.5 + smoothScrollRatio * 2.6;

      // Update Instanced Spatial Nodes (zero GC)
      for (let i = 0; i < NODE_COUNT; i++) {
        const seed = nodeSeeds[i];
        _dummyPos.set(
          seed.x + Math.sin(elapsed * seed.speed + seed.phase) * 0.22,
          seed.y + Math.cos(elapsed * seed.speed * 0.8 + seed.phase) * 0.32,
          seed.z
        );
        _dummyEuler.set(
          elapsed * seed.speed * 0.6 + seed.phase,
          elapsed * seed.speed * 0.8,
          0
        );
        _dummyQuat.setFromEuler(_dummyEuler);
        _dummyScale.setScalar(seed.scale);
        _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
        nodesInstanced.setMatrixAt(i, _dummyMatrix);
      }
      nodesInstanced.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);
    };

    if (prefersReducedMotion) {
      const renderStatic = () => renderFrame(0.6, 0.016);
      renderStatic();
      staticRenderRef.current = renderStatic;
    } else {
      const tick = () => {
        if (unmounted) return;
        timer.update();
        const delta = Math.min(timer.getDelta(), 0.05);
        const elapsed = timer.getElapsed();
        renderFrame(elapsed, delta);

        if (isSoftwareGl) {
          afterDraw.schedule(tick);
        } else {
          rafId = window.requestAnimationFrame(tick);
        }
      };
      tick();
    }

    return () => {
      unmounted = true;
      staticRenderRef.current = null;
      window.cancelAnimationFrame(rafId);
      afterDraw.cancel();
      timer.dispose();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener(
        'webglcontextrestored',
        onContextRestored
      );

      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      envTarget.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 pointer-events-none -z-40 overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {webglReady ? (
        <div ref={mountRef} className="w-full h-full" />
      ) : (
        <div className="w-full h-full bg-[#F4F8FF] dark:bg-slate-950 bg-corporate-grid" />
      )}
    </div>
  );
};
