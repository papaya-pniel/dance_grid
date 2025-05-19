// src/SplashPage.jsx
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { WebGPURenderer } from 'three/webgpu';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function SplashPage() {
  const navigate = useNavigate();
  const mountRef = useRef(null);
  const platformRef = useRef(null);

  const [displayedText, setDisplayedText] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  // Audio Refs
  const backgroundAudioRef = useRef(null);
  const doorSoundRef = useRef(null);
  const audioContextRef = useRef(null);

  // Typewriter Effect
  useEffect(() => {
    const fullText = 'Hello, welcome to Boogie Square! \nAre you ready to go on a dance advernture?';
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, ++index));
      if (index === fullText.length) {
        clearInterval(interval);
        setTypingComplete(true);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Load door sound
  useEffect(() => {
    doorSoundRef.current = new Audio('/public/music/door.mp3');
    doorSoundRef.current.volume = 1.0;
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    const renderer = new WebGPURenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(3, 2, 3);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1, 0);
    controls.update();

    scene.add(new THREE.AmbientLight(0xffffff, 2.0));

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
    const platformMat = new THREE.MeshBasicMaterial({
      map: glowTexture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const platform = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), platformMat);
    platform.rotation.x = -Math.PI / 2;
    platform.position.y = 0;
    platformRef.current = platform;
    scene.add(platform);

    const audio = new Audio('/music/Hooker_Club_Mix.mp3');
    backgroundAudioRef.current = audio;
    audio.loop = true;
    audio.volume = 0.5;
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    audioContextRef.current = audioCtx;
    const source = audioCtx.createMediaElementSource(audio);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    platform.userData.analyser = analyser;
    platform.userData.dataArray = dataArray;
    audio.play().catch(err => console.warn('Audio playback failed:', err));

    let mixer;
    const loader = new GLTFLoader();
    loader.load('/models/gltf/Michelle.glb',
      (gltf) => {
        const obj = gltf.scene;
        obj.traverse((o) => {
          if (o.isMesh) o.castShadow = o.receiveShadow = true;
        });
        scene.add(obj);
        mixer = new THREE.AnimationMixer(obj);
        if (gltf.animations.length) {
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
        }
      },
      undefined,
      (err) => console.error('Error loading GLTF:', err)
    );

    const clock = new THREE.Clock();
    function animate() {
      const analyser = platform.userData.analyser;
      const dataArray = platform.userData.dataArray;
      if (analyser && dataArray) {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        const avg = sum / dataArray.length / 255;
        const intensity = Math.min(1, avg * 2);
        platform.material.opacity = 0.3 + intensity * 0.7;
        const scale = 1 + intensity * 0.5;
        platform.scale.set(scale, scale, scale);
        const hue = (performance.now() / 100) % 360;
        const color = new THREE.Color();
        color.setHSL(hue / 360, 1, 0.5);
        platform.material.color = color;
      }
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      mixer && mixer.update(delta);
      renderer.render(scene, camera);
    }
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
      try { renderer.dispose(); } catch {}
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(to top, #4466ff, #66bbff)',
      }}
    >
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
          userSelect: 'none',
        }}
      >
        {displayedText}
      </pre>

      {typingComplete && (
        <button
          onClick={() => {
            const music = backgroundAudioRef.current;
            const door = doorSoundRef.current;
            const ctx = audioContextRef.current;

            setFadeOut(true);

            if (music) {
              music.pause();
              music.currentTime = 0;
            }
            if (ctx?.state === 'running') {
              ctx.suspend();
            }

            if (door) {
              door.play().catch(err => {
                console.warn('Door sound failed to play:', err);
                navigate('/grid');
              });
              door.onended = () => {
                navigate('/grid');
              };
            } else {
              navigate('/grid');
            }
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1)'}
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #ff6ec4, #7873f5)',
            color: '#fff',
            border: '2px solid #fff',
            borderRadius: '8px',
            boxShadow: '0 0 20px rgba(255,110,196,0.6), 0 0 30px rgba(120,115,245,0.6)',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          Click to Boogie
        </button>
      )}

      {fadeOut && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            opacity: 1,
            animation: 'fadeOutAnim 1s forwards',
          }}
        ></div>
      )}
    </div>
  );
}

// Inject fade animation
const styleTag = document.createElement('style');
styleTag.innerHTML = `
  @keyframes fadeOutAnim {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
`;
document.head.appendChild(styleTag);