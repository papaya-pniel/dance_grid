// src/splashPage.jsx
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { WebGPURenderer } from 'three/webgpu';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function SplashPage() {
  const mountRef = useRef(null);
  const [displayedText, setDisplayedText] = useState('');

  // Terminal‐style typewriter effect
  useEffect(() => {
    const fullText = 'hello dancers!\nWe are excited to have you on this journey with us.\nWe are crowd funding to help build an online dance app for dancers, and fitness enthusiasts to connect from all around the world.\nWe are asking for a small donation, and in exchange, you will have a Boogie Square video.\nYour feedback is much appreciated.\nWe hope you enjoy the journey <3 ';
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, ++index));
      if (index === fullText.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const container = mountRef.current;

    // WebGPU renderer with transparency
    const renderer = new WebGPURenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(3, 2, 3);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1, 0);
    controls.update();

    // Ambient Light
    scene.add(new THREE.AmbientLight(0xffffff, 2.0));

    // Load and animate GLTF model
    let mixer;
    const loader = new GLTFLoader();
    loader.load(
      '/models/gltf/Michelle.glb',
      (gltf) => {
        const obj = gltf.scene;
        obj.traverse((o) => {
          if (o.isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
          }
        });
        scene.add(obj);
        mixer = new THREE.AnimationMixer(obj);
        if (gltf.animations.length) mixer.clipAction(gltf.animations[0]).play();
      },
      undefined,
      (err) => console.error('Error loading GLTF:', err)
    );

    // Animation loop
    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);
      renderer.render(scene, camera);
    }
    animate();

    // Resize handling
    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', onResize);
      controls.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      try {
        renderer.dispose();
      } catch {}
    };
  }, []);

  // Render
  return (
    <div
      ref={mountRef}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(to top, #4466ff, #66bbff)'
      }}
    >
      {/* Terminal overlay without background box */}
      <pre
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          margin: 0,
          padding: 0,
          background: 'none',
          color: '#0f0',
          fontFamily: 'monospace',
          fontSize: '16px',
          lineHeight: '1.2',
          whiteSpace: 'pre-wrap',
          userSelect: 'none'
        }}
      >
        {displayedText}
      </pre>
    </div>
  );
}