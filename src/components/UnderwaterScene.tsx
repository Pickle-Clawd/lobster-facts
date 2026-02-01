import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function Particles() {
  const count = 200;
  const meshRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      // Bioluminescent colors (blues, teals, occasional coral)
      const colorType = Math.random();
      if (colorType > 0.9) {
        // Coral accent
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.42;
        colors[i * 3 + 2] = 0.29;
      } else if (colorType > 0.5) {
        // Cyan/teal
        colors[i * 3] = 0;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 0.94;
      } else {
        // Deep blue
        colors[i * 3] = 0;
        colors[i * 3 + 1] = 0.4;
        colors[i * 3 + 2] = 1;
      }
      
      // Scale
      scales[i] = Math.random() * 0.5 + 0.1;
    }
    
    return { positions, colors, scales };
  }, []);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Float up and down
      positions[i3 + 1] += Math.sin(time + i) * 0.001;
      
      // Drift left/right
      positions[i3] += Math.cos(time * 0.5 + i) * 0.0005;
      
      // Wrap around
      if (positions[i3 + 1] > 10) positions[i3 + 1] = -10;
      if (positions[i3 + 1] < -10) positions[i3 + 1] = 10;
      if (positions[i3] > 10) positions[i3] = -10;
      if (positions[i3] < -10) positions[i3] = 10;
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Gentle rotation
    meshRef.current.rotation.y = time * 0.05;
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
        <bufferAttribute
          attach="attributes-scale"
          count={particles.scales.length}
          array={particles.scales}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function UnderwaterScene() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <color attach="background" args={['#050a15']} />
        <ambientLight intensity={0.3} />
        <Particles />
      </Canvas>
    </div>
  );
}
