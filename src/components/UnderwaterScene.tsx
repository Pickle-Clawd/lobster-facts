import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';

// Circular gradient texture for soft glowing particles
function createParticleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  
  return new THREE.CanvasTexture(canvas);
}

// Background particles — small, dim, slow (far away)
function BackgroundParticles() {
  const count = 120;
  const meshRef = useRef<THREE.Points>(null);
  const particleTexture = useMemo(() => createParticleTexture(), []);
  
  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = -5 - Math.random() * 15; // Behind camera focus
      
      const hue = Math.random();
      if (hue > 0.7) {
        colors[i * 3] = 0.1; colors[i * 3 + 1] = 0.3; colors[i * 3 + 2] = 0.6;
      } else {
        colors[i * 3] = 0; colors[i * 3 + 1] = 0.4; colors[i * 3 + 2] = 0.5;
      }
    }
    return { positions, colors };
  }, []);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const pos = meshRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3 + 1] += Math.sin(time * 0.05 + i) * 0.001;
      pos[i3] += Math.cos(time * 0.03 + i * 0.5) * 0.0005;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });
  
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={data.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={data.colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial map={particleTexture} size={0.12} vertexColors transparent opacity={0.3} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

// Mid-layer particles — the main bioluminescent plankton
function MidParticles() {
  const count = 150;
  const meshRef = useRef<THREE.Points>(null);
  const particleTexture = useMemo(() => createParticleTexture(), []);
  const mouseRef = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);
  
  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const basePositions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 30;
      const y = (Math.random() - 0.5) * 30;
      const z = (Math.random() - 0.5) * 10;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      basePositions[i * 3] = x;
      basePositions[i * 3 + 1] = y;
      basePositions[i * 3 + 2] = z;
      
      const colorType = Math.random();
      if (colorType > 0.85) {
        colors[i * 3] = 1; colors[i * 3 + 1] = 0.42; colors[i * 3 + 2] = 0.29;
      } else if (colorType > 0.4) {
        colors[i * 3] = 0; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 0.94;
      } else {
        colors[i * 3] = 0.2; colors[i * 3 + 1] = 0.6; colors[i * 3 + 2] = 1;
      }
    }
    return { positions, colors, basePositions };
  }, []);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const pos = meshRef.current.geometry.attributes.position.array as Float32Array;
    const col = meshRef.current.geometry.attributes.color.array as Float32Array;
    const mx = mouseRef.current.x * 8;
    const my = mouseRef.current.y * 8;
    
    // Slow color hue shift over time
    const hueShift = Math.sin(time * 0.1) * 0.15;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const speed = 0.15 + (i % 10) * 0.02;
      
      // Floating motion
      pos[i3] = data.basePositions[i3] + Math.sin(time * speed * 0.4 + i * 0.3) * 0.8;
      pos[i3 + 1] = data.basePositions[i3 + 1] + Math.cos(time * speed * 0.3 + i * 0.5) * 0.6;
      pos[i3 + 2] = data.basePositions[i3 + 2] + Math.sin(time * speed * 0.2 + i * 0.7) * 0.3;
      
      // Mouse repulsion
      const dx = pos[i3] - mx;
      const dy = pos[i3 + 1] - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 4) {
        const force = (4 - dist) / 4 * 0.8;
        pos[i3] += (dx / dist) * force;
        pos[i3 + 1] += (dy / dist) * force;
      }
      
      // Subtle color shift
      col[i3] = Math.max(0, col[i3] + hueShift * 0.02);
      col[i3 + 1] = Math.max(0, col[i3 + 1] + Math.sin(hueShift) * 0.01);
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.geometry.attributes.color.needsUpdate = true;
  });
  
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={data.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={data.colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial map={particleTexture} size={0.25} vertexColors transparent opacity={0.85} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

// Foreground particles — large, blurred, close to camera
function ForegroundParticles() {
  const count = 15;
  const meshRef = useRef<THREE.Points>(null);
  const particleTexture = useMemo(() => createParticleTexture(), []);
  
  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = 3 + Math.random() * 5;
      
      colors[i * 3] = 0; colors[i * 3 + 1] = 0.8; colors[i * 3 + 2] = 0.8;
    }
    return { positions, colors };
  }, []);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const pos = meshRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3 + 1] += Math.sin(time * 0.08 + i * 2) * 0.003;
      pos[i3] += Math.cos(time * 0.06 + i * 1.5) * 0.002;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });
  
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={data.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={data.colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial map={particleTexture} size={1.5} vertexColors transparent opacity={0.08} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

// Caustic light rays
function CausticRays() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        
        void main() {
          // Create diagonal light rays
          float ray1 = smoothstep(0.0, 0.03, abs(sin((vUv.x + vUv.y * 0.5) * 8.0 + uTime * 0.3)));
          float ray2 = smoothstep(0.0, 0.05, abs(sin((vUv.x * 0.7 + vUv.y * 0.3) * 6.0 + uTime * 0.2 + 1.5)));
          float ray3 = smoothstep(0.0, 0.04, abs(sin((vUv.x * 0.4 + vUv.y * 0.8) * 10.0 + uTime * 0.15 + 3.0)));
          
          float rays = (1.0 - ray1) * 0.3 + (1.0 - ray2) * 0.2 + (1.0 - ray3) * 0.15;
          
          // Fade from top
          float topFade = smoothstep(1.0, 0.3, vUv.y);
          
          // Fade edges
          float edgeFade = smoothstep(0.0, 0.3, vUv.x) * smoothstep(1.0, 0.7, vUv.x);
          
          float alpha = rays * topFade * edgeFade * 0.06;
          
          gl_FragColor = vec4(0.3, 0.8, 1.0, alpha);
        }
      `,
    });
  }, []);
  
  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.getElapsedTime();
  });
  
  return (
    <mesh ref={meshRef} position={[0, 0, -2]} material={material}>
      <planeGeometry args={[30, 20]} />
    </mesh>
  );
}

export default function UnderwaterScene() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <color attach="background" args={['#030810']} />
        <BackgroundParticles />
        <CausticRays />
        <MidParticles />
        <ForegroundParticles />
      </Canvas>
    </div>
  );
}
