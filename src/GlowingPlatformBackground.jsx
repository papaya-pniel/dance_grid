// src/components/GlowingPlatformBackground.jsx
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { WebGPURenderer } from 'three/webgpu';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function GlowingPlatformBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;

    const renderer = new WebGPURenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(3, 2, 3);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1, 0);
    controls.update();

    scene.add(new THREE.AmbientLight(0xffffff, 2.0));

    const size = 2;
    const canvasTex = document.createElement('canvas');
    canvasTex.width = 256;
    canvasTex.height = 256;
    const ctx = canvasTex.getContext('2d');
    ctx.fillStyle = '#00aaff';
    ctx.shadowColor = '#00aaff';
    ctx.shadowBlur = 50;
    const pad = 50;
    const side = canvasTex.width - pad * 2;
    ctx.fillRect(pad, pad, side, side);
    const glowTexture = new THREE.CanvasTexture(canvasTex);
    glowTexture.needsUpdate = true;

    const platformGeo = new THREE.PlaneGeometry(size, size);
    const platformMat = new THREE.MeshBasicMaterial({
      map: glowTexture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.rotation.x = -Math.PI / 2;
    platform.position.y = 0;
    scene.add(platform);

    const animate = () => {
      const time = performance.now() * 0.001;
      const intensity = (Math.sin(time * 2) + 1) / 2;
      platform.material.opacity = 0.3 + intensity * 0.7;
      const scale = 1 + intensity * 0.5;
      platform.scale.set(scale, scale, scale);

      const hue = (performance.now() / 100) % 360;
      const color = new THREE.Color();
      color.setHSL(hue / 360, 1, 0.5);
      platform.material.color = color;

      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      controls.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      try {
        renderer.dispose();
      } catch {}
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    />
  );
}
