import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

// Create a circular gradient texture for soft glowing particles
function createParticleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.3)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function Particles() {
  const count = 200;
  const meshRef = useRef<THREE.Points>(null);
  
  const particleTexture = useMemo(() => createParticleTexture(), []);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Position — spread across the scene
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
      
      // Bioluminescent colors
      const colorType = Math.random();
      if (colorType > 0.9) {
        // Coral accent
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.42;
        colors[i * 3 + 2] = 0.29;
        sizes[i] = Math.random() * 0.3 + 0.1;
      } else if (colorType > 0.5) {
        // Cyan/teal
        colors[i * 3] = 0;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 0.94;
        sizes[i] = Math.random() * 0.2 + 0.05;
      } else {
        // Deep blue
        colors[i * 3] = 0.2;
        colors[i * 3 + 1] = 0.5;
        colors[i * 3 + 2] = 1;
        sizes[i] = Math.random() * 0.15 + 0.05;
      }
    }
    
    return { positions, colors, sizes };
  }, []);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const speed = 0.15 + (i % 10) * 0.02;
      
      // Gentle floating motion
      positions[i3 + 1] += Math.sin(time * speed + i * 0.5) * 0.002;
      positions[i3] += Math.cos(time * speed * 0.7 + i * 0.3) * 0.001;
      positions[i3 + 2] += Math.sin(time * speed * 0.3 + i * 0.7) * 0.0005;
      
      // Wrap around
      if (positions[i3 + 1] > 12.5) positions[i3 + 1] = -12.5;
      if (positions[i3 + 1] < -12.5) positions[i3 + 1] = 12.5;
      if (positions[i3] > 12.5) positions[i3] = -12.5;
      if (positions[i3] < -12.5) positions[i3] = 12.5;
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.rotation.y = time * 0.02;
  });
  
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        map={particleTexture}
        size={0.25}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function UnderwaterScene() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <color attach="background" args={['#050a15']} />
        <Particles />
      </Canvas>
    </div>
  );
}
