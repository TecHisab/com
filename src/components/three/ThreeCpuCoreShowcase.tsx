import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Layers, RotateCcw, ChevronDown, ChevronUp, Cpu } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { CpuCircuitAnimation } from '../common/CpuCircuitAnimation';
import {
  createAfterDrawScheduler,
  detectSoftwareWebGL,
  isWebGLAvailable,
} from './threeUtils';

interface ThreeCpuCoreShowcaseProps {
  activeChannel?: number | null;
  onSelectChannel?: (index: number) => void;
  className?: string;
}

type CameraPreset = 'iso' | 'top' | 'hero';

interface NodeSpec {
  id: number;
  labelEn: string;
  labelBn: string;
  pos: [number, number];
  waypoints: [number, number][];
}

const MODULE_NODES: NodeSpec[] = [
  {
    id: 0,
    labelEn: 'Accounting',
    labelBn: 'অ্যাকাউন্টিং',
    pos: [-2.85, -1.35],
    waypoints: [
      [-1.05, -0.36],
      [-1.75, -0.36],
      [-2.15, -0.95],
      [-2.85, -1.35],
    ],
  },
  {
    id: 1,
    labelEn: 'Tax & VAT',
    labelBn: 'ট্যাক্স ও ভ্যাট',
    pos: [-3.1, 0.0],
    waypoints: [
      [-1.05, 0.0],
      [-2.1, 0.0],
      [-2.45, 0.0],
      [-3.1, 0.0],
    ],
  },
  {
    id: 2,
    labelEn: 'Payroll',
    labelBn: 'পেরোল',
    pos: [-2.85, 1.35],
    waypoints: [
      [-1.05, 0.36],
      [-1.75, 0.36],
      [-2.15, 0.95],
      [-2.85, 1.35],
    ],
  },
  {
    id: 3,
    labelEn: 'MIS Reports',
    labelBn: 'এমআইএস',
    pos: [2.85, -1.35],
    waypoints: [
      [1.05, -0.36],
      [1.75, -0.36],
      [2.15, -0.95],
      [2.85, -1.35],
    ],
  },
  {
    id: 4,
    labelEn: 'BPO Ops',
    labelBn: 'বিপিও',
    pos: [3.1, 0.0],
    waypoints: [
      [1.05, 0.0],
      [2.1, 0.0],
      [2.45, 0.0],
      [3.1, 0.0],
    ],
  },
  {
    id: 5,
    labelEn: 'Software',
    labelBn: 'সফটওয়্যার',
    pos: [2.85, 1.35],
    waypoints: [
      [1.05, 0.36],
      [1.75, 0.36],
      [2.15, 1.05],
      [2.85, 1.35],
    ],
  },
];

// Pre-allocated scratch helpers (zero GC inside animation loop)
const _pulsePos = new THREE.Vector3();
const _pulseScale = new THREE.Vector3(1, 1, 1);
const _pulseQuat = new THREE.Quaternion();
const _pulseMat = new THREE.Matrix4();
const _targetCamPos = new THREE.Vector3();
const _targetLook = new THREE.Vector3(0, 0.2, 0);

function createPcbTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#031d47';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle etched PCB grid
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.09)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Fine copper/cobalt micro-traces
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.24)';
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 16; i++) {
      const y = 70 + i * 32;
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(220, y);
      ctx.lineTo(260, y + (i % 2 === 0 ? 18 : -18));
      ctx.lineTo(390, y + (i % 2 === 0 ? 18 : -18));
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(canvas.width - 40, y);
      ctx.lineTo(canvas.width - 220, y);
      ctx.lineTo(canvas.width - 260, y + (i % 2 === 0 ? -18 : 18));
      ctx.lineTo(canvas.width - 390, y + (i % 2 === 0 ? -18 : 18));
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

function createCpuLabelTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#0f274d';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle metallic brushed lines
    for (let y = 0; y < 512; y += 3) {
      ctx.fillStyle = y % 6 === 0 ? 'rgba(255,255,255,0.035)' : 'rgba(0,0,0,0.06)';
      ctx.fillRect(0, y, 512, 1.5);
    }

    ctx.strokeStyle = 'rgba(125, 211, 252, 0.55)';
    ctx.lineWidth = 5;
    ctx.strokeRect(28, 28, 456, 456);

    // Pin-1 corner indicator
    ctx.fillStyle = '#7dd3fc';
    ctx.beginPath();
    ctx.arc(64, 64, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = '800 54px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText('TECHISAB', 256, 245);

    ctx.fillStyle = '#7dd3fc';
    ctx.font = '700 28px "JetBrains Mono", monospace';
    ctx.fillText('FINTEC CORE 3D', 256, 298);

    ctx.strokeStyle = 'rgba(186, 230, 253, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(120, 326);
    ctx.lineTo(392, 326);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 18, 128, 128, 126);
    grad.addColorStop(0, 'rgba(2, 12, 32, 0.72)');
    grad.addColorStop(0.55, 'rgba(2, 16, 42, 0.32)');
    grad.addColorStop(1, 'rgba(2, 16, 42, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export const ThreeCpuCoreShowcase: React.FC<ThreeCpuCoreShowcaseProps> = ({
  activeChannel = null,
  onSelectChannel,
  className = '',
}) => {
  const { pick } = useLanguage();
  const mountRef = useRef<HTMLDivElement>(null);

  const [webglSupported, setWebglSupported] = useState(true);
  const [exploded, setExploded] = useState(false);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('iso');
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [dockCollapsed, setDockCollapsed] = useState(false);

  const activeChannelRef = useRef<number | null>(activeChannel);
  const explodedRef = useRef<boolean>(exploded);
  const onSelectRef = useRef(onSelectChannel);
  const presetTriggerRef = useRef<((p: CameraPreset) => void) | null>(null);
  const staticRenderRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    activeChannelRef.current = activeChannel;
    staticRenderRef.current?.();
  }, [activeChannel]);

  useEffect(() => {
    explodedRef.current = exploded;
    staticRenderRef.current?.();
  }, [exploded]);

  useEffect(() => {
    onSelectRef.current = onSelectChannel;
  }, [onSelectChannel]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || !isWebGLAvailable()) {
      setWebglSupported(false);
      return;
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSoftwareGl = detectSoftwareWebGL();

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x022150);
    scene.fog = new THREE.FogExp2(0x022150, 0.045);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 60);
    camera.position.set(0.2, 4.9, 6.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2)
    );
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.2, 0);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 4.6;
    controls.maxDistance = 11.2;
    controls.minPolarAngle = 0.18;
    controls.maxPolarAngle = Math.PI * 0.44;
    controls.update();

    // Studio IBL Environment Map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    // 3-Point Warm / Cool Lighting Rig (<= 1 shadow caster)
    const hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x020b1f, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.8);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -5;
    keyLight.shadow.camera.right = 5;
    keyLight.shadow.camera.top = 4;
    keyLight.shadow.camera.bottom = -4;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.3);
    rimLight.position.set(-5, 4, -5);
    scene.add(rimLight);

    // Track Disposables
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const pcbTex = createPcbTexture(maxAniso);
    const cpuLabelTex = createCpuLabelTexture(maxAniso);
    const shadowTex = createContactShadowTexture();
    textures.push(pcbTex, cpuLabelTex, shadowTex);

    // Contact Shadow Ground Plane
    const shadowGeo = new THREE.PlaneGeometry(8.6, 5.4);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.28;
    scene.add(shadowPlane);
    geometries.push(shadowGeo);
    materials.push(shadowMat);

    // =========================================================================
    // Composite Multi-Part 3D CPU & PCB Assembly
    // =========================================================================
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Beveled PCB Motherboard Slab
    const pcbShape = new THREE.Shape();
    const bw = 7.2;
    const bd = 4.1;
    const br = 0.28;
    pcbShape.moveTo(-bw / 2 + br, -bd / 2);
    pcbShape.lineTo(bw / 2 - br, -bd / 2);
    pcbShape.quadraticCurveTo(bw / 2, -bd / 2, bw / 2, -bd / 2 + br);
    pcbShape.lineTo(bw / 2, bd / 2 - br);
    pcbShape.quadraticCurveTo(bw / 2, bd / 2, bw / 2 - br, bd / 2);
    pcbShape.lineTo(-bw / 2 + br, bd / 2);
    pcbShape.quadraticCurveTo(-bw / 2, bd / 2, -bw / 2, bd / 2 - br);
    pcbShape.lineTo(-bw / 2, -bd / 2 + br);
    pcbShape.quadraticCurveTo(-bw / 2, -bd / 2, -bw / 2 + br, -bd / 2);

    const pcbGeo = new THREE.ExtrudeGeometry(pcbShape, {
      depth: 0.16,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 2,
    });
    pcbGeo.rotateX(Math.PI / 2);
    pcbGeo.center();
    geometries.push(pcbGeo);

    const pcbMat = new THREE.MeshStandardMaterial({
      map: pcbTex,
      roughness: 0.42,
      metalness: 0.35,
    });
    materials.push(pcbMat);

    const pcbMesh = new THREE.Mesh(pcbGeo, pcbMat);
    pcbMesh.position.y = 0;
    pcbMesh.receiveShadow = true;
    pcbMesh.castShadow = true;
    rootGroup.add(pcbMesh);

    // 4 Corner Metallic Standoffs grounding the PCB
    const standoffGeo = new THREE.CylinderGeometry(0.11, 0.13, 0.24, 16);
    const standoffMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.9,
      roughness: 0.2,
    });
    geometries.push(standoffGeo);
    materials.push(standoffMat);

    const corners: [number, number][] = [
      [-3.32, -1.78],
      [3.32, -1.78],
      [-3.32, 1.78],
      [3.32, 1.78],
    ];
    corners.forEach(([cx, cz]) => {
      const leg = new THREE.Mesh(standoffGeo, standoffMat);
      leg.position.set(cx, -0.16, cz);
      rootGroup.add(leg);
    });

    // 2. Ceramic IC Package Substrate (Layer 1 for Exploded View)
    const substrateGroup = new THREE.Group();
    const substrateGeo = new THREE.BoxGeometry(2.05, 0.14, 2.05);
    const substrateMat = new THREE.MeshStandardMaterial({
      color: 0x062f6e,
      roughness: 0.48,
      metalness: 0.22,
    });
    const substrateMesh = new THREE.Mesh(substrateGeo, substrateMat);
    substrateMesh.castShadow = true;
    substrateMesh.receiveShadow = true;
    substrateGroup.add(substrateMesh);
    geometries.push(substrateGeo);
    materials.push(substrateMat);

    // Gold/Brass IC Socket Pins (InstancedMesh - 40 pins around chip perimeter)
    const pinGeo = new THREE.BoxGeometry(0.18, 0.06, 0.07);
    const pinMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      metalness: 0.92,
      roughness: 0.18,
    });
    const pinsInstanced = new THREE.InstancedMesh(pinGeo, pinMat, 40);
    const pinDummy = new THREE.Object3D();
    let pinIdx = 0;
    for (let i = -4; i <= 5; i++) {
      const offset = (i - 0.5) * 0.18;
      // Left
      pinDummy.position.set(-1.1, -0.02, offset);
      pinDummy.rotation.set(0, 0, 0);
      pinDummy.updateMatrix();
      pinsInstanced.setMatrixAt(pinIdx++, pinDummy.matrix);
      // Right
      pinDummy.position.set(1.1, -0.02, offset);
      pinDummy.updateMatrix();
      pinsInstanced.setMatrixAt(pinIdx++, pinDummy.matrix);
      // Top
      pinDummy.position.set(offset, -0.02, -1.1);
      pinDummy.rotation.set(0, Math.PI / 2, 0);
      pinDummy.updateMatrix();
      pinsInstanced.setMatrixAt(pinIdx++, pinDummy.matrix);
      // Bottom
      pinDummy.position.set(offset, -0.02, 1.1);
      pinDummy.updateMatrix();
      pinsInstanced.setMatrixAt(pinIdx++, pinDummy.matrix);
    }
    pinsInstanced.instanceMatrix.needsUpdate = true;
    pinsInstanced.computeBoundingSphere();
    substrateGroup.add(pinsInstanced);
    geometries.push(pinGeo);
    materials.push(pinMat);

    substrateGroup.position.y = 0.18;
    rootGroup.add(substrateGroup);

    // 3. Anisotropic Brushed Metallic Heat Spreader IHS (Layer 2)
    const ihsGroup = new THREE.Group();
    const ihsGeo = new THREE.BoxGeometry(1.66, 0.14, 1.66);
    const ihsMat = new THREE.MeshPhysicalMaterial({
      map: cpuLabelTex,
      metalness: 0.88,
      roughness: 0.18,
      anisotropy: 0.8,
      clearcoat: 0.45,
      clearcoatRoughness: 0.15,
    });
    const ihsMesh = new THREE.Mesh(ihsGeo, ihsMat);
    ihsMesh.castShadow = true;
    ihsMesh.receiveShadow = true;
    ihsGroup.add(ihsMesh);
    geometries.push(ihsGeo);
    materials.push(ihsMat);

    // Subtle Emissive Die Ring underneath IHS
    const dieRingGeo = new THREE.TorusGeometry(0.95, 0.025, 12, 48);
    const dieRingMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0ea5e9,
      emissiveIntensity: 1.3,
      roughness: 0.25,
    });
    const dieRing = new THREE.Mesh(dieRingGeo, dieRingMat);
    dieRing.rotation.x = Math.PI / 2;
    dieRing.position.y = -0.04;
    ihsGroup.add(dieRing);
    geometries.push(dieRingGeo);
    materials.push(dieRingMat);

    ihsGroup.position.y = 0.32;
    rootGroup.add(ihsGroup);

    // 4. Translucent Optical Sapphire Shield Cover (Layer 3)
    const shieldGroup = new THREE.Group();
    const shieldGeo = new THREE.BoxGeometry(1.9, 0.06, 1.9);
    const shieldMat = new THREE.MeshPhysicalMaterial({
      color: 0xbae6fd,
      metalness: 0.05,
      roughness: 0.08,
      clearcoat: 1.0,
      transmission: isSoftwareGl ? 0 : 0.68,
      transparent: true,
      opacity: isSoftwareGl ? 0.34 : 1,
      ior: 1.55,
      thickness: 0.4,
      depthWrite: false,
    });
    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    shieldMesh.renderOrder = 4;
    shieldGroup.add(shieldMesh);
    geometries.push(shieldGeo);
    materials.push(shieldMat);

    shieldGroup.position.y = 0.48;
    rootGroup.add(shieldGroup);

    // =========================================================================
    // 5. Six 3D Module Terminal Towers + Curved 3D Circuit Traces
    // =========================================================================
    const traceCurves: THREE.CatmullRomCurve3[] = [];
    const traceMeshes: THREE.Mesh[] = [];
    const terminalCaps: THREE.Mesh[] = [];
    const terminalCapMats: THREE.MeshStandardMaterial[] = [];
    const raycastTargets: THREE.Mesh[] = [];

    const towerBaseGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.16, 24);
    const towerCapGeo = new THREE.CylinderGeometry(0.14, 0.18, 0.14, 24);
    const towerBaseMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.88,
      roughness: 0.22,
    });
    const hitGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.55, 12);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    geometries.push(towerBaseGeo, towerCapGeo, hitGeo);
    materials.push(towerBaseMat, hitMat);

    MODULE_NODES.forEach((node) => {
      const pts = node.waypoints.map(
        ([x, z]) => new THREE.Vector3(x, 0.115, z)
      );
      const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.12);
      traceCurves.push(curve);

      const tubeGeo = new THREE.TubeGeometry(curve, 36, 0.026, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.4,
        metalness: 0.65,
        roughness: 0.28,
      });
      const traceMesh = new THREE.Mesh(tubeGeo, tubeMat);
      rootGroup.add(traceMesh);
      traceMeshes.push(traceMesh);
      geometries.push(tubeGeo);
      materials.push(tubeMat);

      // Terminal Tower
      const base = new THREE.Mesh(towerBaseGeo, towerBaseMat);
      base.position.set(node.pos[0], 0.18, node.pos[1]);
      base.castShadow = true;
      rootGroup.add(base);

      const capMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0ea5e9,
        emissiveIntensity: 0.75,
        metalness: 0.35,
        roughness: 0.2,
      });
      const cap = new THREE.Mesh(towerCapGeo, capMat);
      cap.position.set(node.pos[0], 0.32, node.pos[1]);
      rootGroup.add(cap);
      terminalCaps.push(cap);
      terminalCapMats.push(capMat);
      materials.push(capMat);

      // Invisible proxy hit cylinder on layer 1 for fast raycasting
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.set(node.pos[0], 0.25, node.pos[1]);
      hitMesh.layers.set(1);
      hitMesh.userData.nodeId = node.id;
      rootGroup.add(hitMesh);
      raycastTargets.push(hitMesh);
    });

    // 6. Animated Signal Pulse Spheres traveling along the 6 3D PCB traces (3 per trace = 18)
    const PULSES_PER_TRACE = 3;
    const TOTAL_PULSES = MODULE_NODES.length * PULSES_PER_TRACE;
    const pulseGeo = new THREE.SphereGeometry(0.055, 12, 12);
    const pulseMat = new THREE.MeshStandardMaterial({
      color: 0xe0f2fe,
      emissive: 0x38bdf8,
      emissiveIntensity: 2.0,
      roughness: 0.1,
    });
    const pulsesInstanced = new THREE.InstancedMesh(
      pulseGeo,
      pulseMat,
      TOTAL_PULSES
    );
    pulsesInstanced.frustumCulled = false;
    rootGroup.add(pulsesInstanced);
    geometries.push(pulseGeo);
    materials.push(pulseMat);

    // =========================================================================
    // Camera Preset Transitions & Raycasting Interaction
    // =========================================================================
    let camTransitionActive = false;
    const presetTargetPos = new THREE.Vector3(0.2, 4.9, 6.2);

    const applyPreset = (preset: CameraPreset) => {
      if (preset === 'iso') presetTargetPos.set(0.2, 4.9, 6.2);
      else if (preset === 'top') presetTargetPos.set(0, 7.6, 1.3);
      else presetTargetPos.set(-3.8, 3.2, 5.4);
      if (prefersReducedMotion) {
        camera.position.copy(presetTargetPos);
        controls.target.copy(_targetLook);
        controls.update();
        staticRenderRef.current?.();
      } else {
        camTransitionActive = true;
      }
    };
    presetTriggerRef.current = applyPreset;

    const onControlStart = () => {
      camTransitionActive = false;
    };
    controls.addEventListener('start', onControlStart);

    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);
    const pointerNdc = new THREE.Vector2();
    let localHovered: number | null = null;
    let lastHoverCheck = 0;
    let pointerDownX = 0;
    let pointerDownY = 0;

    const updatePointerNdc = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownX = e.clientX;
      pointerDownY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastHoverCheck < 50) return;
      lastHoverCheck = now;

      updatePointerNdc(e.clientX, e.clientY);
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(raycastTargets, false);
      const nextId = hits.length > 0 ? (hits[0].object.userData.nodeId as number) : null;
      if (nextId !== localHovered) {
        localHovered = nextId;
        setHoveredNode(nextId);
        renderer.domElement.style.cursor = nextId !== null ? 'pointer' : 'grab';
        staticRenderRef.current?.();
      }
    };

    const onPointerLeave = () => {
      if (localHovered !== null) {
        localHovered = null;
        setHoveredNode(null);
        renderer.domElement.style.cursor = 'grab';
        staticRenderRef.current?.();
      }
    };

    const onClick = (e: MouseEvent) => {
      // Ignore orbit drag releases (> 6px travel from pointerdown)
      if (Math.hypot(e.clientX - pointerDownX, e.clientY - pointerDownY) > 6) {
        return;
      }
      updatePointerNdc(e.clientX, e.clientY);
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(raycastTargets, false);
      if (hits.length > 0) {
        const nodeId = hits[0].object.userData.nodeId as number;
        onSelectRef.current?.(nodeId);
      }
    };

    renderer.domElement.style.cursor = 'grab';
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerleave', onPointerLeave);
    renderer.domElement.addEventListener('click', onClick);

    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w <= 0 || h <= 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(
        isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2)
      );
      renderer.setSize(w, h);
      staticRenderRef.current?.();
    });
    resizeObserver.observe(container);

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
    let smoothExplode = 0;

    const renderFrame = (elapsed: number, delta: number) => {
      if (contextLost || unmounted) return;

      if (camTransitionActive) {
        camera.position.x = THREE.MathUtils.damp(
          camera.position.x,
          presetTargetPos.x,
          5.5,
          delta
        );
        camera.position.y = THREE.MathUtils.damp(
          camera.position.y,
          presetTargetPos.y,
          5.5,
          delta
        );
        camera.position.z = THREE.MathUtils.damp(
          camera.position.z,
          presetTargetPos.z,
          5.5,
          delta
        );
        controls.target.lerp(_targetLook, Math.min(1, delta * 6));
        if (camera.position.distanceTo(_targetCamPos.copy(presetTargetPos)) < 0.04) {
          camTransitionActive = false;
        }
      }

      controls.update();

      // Damped Exploded View Layer Separation
      const explodeTarget = explodedRef.current ? 1 : 0;
      smoothExplode = THREE.MathUtils.damp(smoothExplode, explodeTarget, 6.0, delta);
      substrateGroup.position.y = 0.18 + smoothExplode * 0.42;
      ihsGroup.position.y = 0.32 + smoothExplode * 0.95;
      shieldGroup.position.y = 0.48 + smoothExplode * 1.48;

      // Subtle breathing rotation on PCB root when idle
      if (!prefersReducedMotion) {
        rootGroup.rotation.y = Math.sin(elapsed * 0.35) * 0.08;
      }

      // Highlight focused terminal (either hovered card in EcosystemDiagram or hovered 3D mesh)
      const focusedId = localHovered ?? activeChannelRef.current;
      MODULE_NODES.forEach((_, idx) => {
        const isHot = focusedId === idx;
        const cap = terminalCaps[idx];
        const capMat = terminalCapMats[idx];
        const traceMat = traceMeshes[idx].material as THREE.MeshStandardMaterial;

        const targetY = isHot ? 0.42 : 0.32;
        cap.position.y = THREE.MathUtils.damp(cap.position.y, targetY, 8, delta);
        capMat.emissiveIntensity = THREE.MathUtils.damp(
          capMat.emissiveIntensity,
          isHot ? 2.2 : 0.75,
          8,
          delta
        );
        traceMat.emissiveIntensity = THREE.MathUtils.damp(
          traceMat.emissiveIntensity,
          isHot ? 1.8 : 0.35,
          8,
          delta
        );
      });

      // Animate traveling 3D signal packets along circuit curves (zero GC)
      let pIndex = 0;
      for (let t = 0; t < traceCurves.length; t++) {
        const curve = traceCurves[t];
        const isHot = focusedId === t;
        for (let k = 0; k < PULSES_PER_TRACE; k++) {
          const u = ((elapsed * (isHot ? 0.52 : 0.32) + k / PULSES_PER_TRACE + t * 0.13) % 1);
          curve.getPointAt(u, _pulsePos);
          _pulseScale.setScalar(isHot ? 1.35 : 1.0);
          _pulseMat.compose(_pulsePos, _pulseQuat, _pulseScale);
          pulsesInstanced.setMatrixAt(pIndex++, _pulseMat);
        }
      }
      pulsesInstanced.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);
    };

    const onControlChange = () => {
      staticRenderRef.current?.();
    };

    if (prefersReducedMotion) {
      const renderStatic = () => {
        smoothExplode = explodedRef.current ? 1 : 0;
        renderFrame(0.4, 1);
      };
      renderStatic();
      staticRenderRef.current = renderStatic;
      controls.addEventListener('change', onControlChange);
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
      resizeObserver.disconnect();
      controls.removeEventListener('start', onControlStart);
      controls.removeEventListener('change', onControlChange);
      controls.dispose();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
      renderer.domElement.removeEventListener('click', onClick);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener(
        'webglcontextrestored',
        onContextRestored
      );

      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      envTarget.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (!webglSupported) {
    return (
      <CpuCircuitAnimation
        activeChannel={activeChannel}
        onSelectChannel={onSelectChannel}
        className={className}
      />
    );
  }

  const displayedNodeIndex = hoveredNode ?? activeChannel;
  const displayedNode =
    displayedNodeIndex !== null && displayedNodeIndex !== undefined
      ? MODULE_NODES[displayedNodeIndex]
      : null;

  return (
    <div
      className={`relative w-full h-[300px] sm:h-[340px] rounded-xl overflow-hidden border border-[#0A63D8]/35 bg-[#022150] select-none ${className}`}
    >
      {/* Isolated WebGL Mount Container */}
      <div
        ref={mountRef}
        className="w-full h-full"
        aria-label={pick(
          'Interactive 3D TecHisab CPU and Circuit Architecture — drag to orbit',
          'ইন্টারঅ্যাক্টিভ থ্রিডি টেকহিসাব সিপিইউ ও সার্কিট আর্কিটেকচার — ঘোরাতে ড্র্যাগ করুন'
        )}
      />

      {/* Minimal Top-Left Semantic Spec Badge (No backdrop-filter over WebGL) */}
      <div className="pointer-events-none absolute top-3 left-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#021C44]/90 border border-sky-400/25 text-white text-[11px] font-semibold">
        <Cpu className="w-3.5 h-3.5 text-sky-300 shrink-0" />
        <span>
          {displayedNode
            ? `${pick('Module:', 'মডিউল:')} ${pick(
                displayedNode.labelEn,
                displayedNode.labelBn
              )}`
            : pick('3D FinTech Core · Drag to Orbit', 'থ্রিডি ফিনটেক কোর · ড্র্যাগ করে ঘোরান')}
        </span>
      </div>

      {/* Collapsible Unified Bottom Control Dock (No backdrop-filter over WebGL) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 max-w-[94%]">
        <button
          type="button"
          onClick={() => setDockCollapsed((prev) => !prev)}
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#021C44]/90 hover:bg-[#033273] border border-sky-400/25 text-[10px] font-semibold text-sky-200 cursor-pointer whitespace-nowrap"
        >
          {dockCollapsed ? (
            <>
              <ChevronUp className="w-3 h-3" />
              <span>{pick('Show 3D Controls', 'থ্রিডি কন্ট্রোল দেখান')}</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" />
              <span>{pick('Hide Controls', 'কন্ট্রোল লুকান')}</span>
            </>
          )}
        </button>

        {!dockCollapsed && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-xl bg-[#021C44]/92 border border-sky-400/30 shadow-lg">
            <button
              type="button"
              onClick={() => setExploded((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                exploded
                  ? 'bg-[#0A63D8] text-white'
                  : 'bg-white/10 text-sky-100 hover:bg-white/15'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>
                {exploded
                  ? pick('Assemble Core', 'একত্রিত করুন')
                  : pick('Explode Layers', 'লেয়ার খুলুন')}
              </span>
            </button>

            <div className="h-4 w-px bg-white/15 hidden sm:block" aria-hidden="true" />

            {(
              [
                { id: 'iso', en: 'Isometric', bn: 'আইসোমেট্রিক' },
                { id: 'top', en: 'Top PCB', bn: 'টপ পিসিবি' },
                { id: 'hero', en: 'Angle', bn: 'অ্যাঙ্গেল' },
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setCameraPreset(p.id);
                  presetTriggerRef.current?.(p.id);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  cameraPreset === p.id
                    ? 'bg-white text-[#022150]'
                    : 'text-sky-100 hover:bg-white/10'
                }`}
              >
                {pick(p.en, p.bn)}
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                setExploded(false);
                setCameraPreset('iso');
                presetTriggerRef.current?.('iso');
              }}
              aria-label={pick('Reset 3D camera', 'থ্রিডি ক্যামেরা রিসেট')}
              className="p-1.5 rounded-lg text-sky-200 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
