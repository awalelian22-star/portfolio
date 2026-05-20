import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stage } from '@react-three/drei';
import * as THREE from 'three';

function NeonBike() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Front Wheel */}
      <group position={[1.2, -0.6, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.6, 0.04, 16, 100]} />
          <meshStandardMaterial color="#000" metalness={1} roughness={0.1} />
        </mesh>
        {/* Neon Rim */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.55, 0.01, 16, 100]} />
          <meshStandardMaterial
            color="#fff"
            emissive="#fff"
            emissiveIntensity={2}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 1.2, 8]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>

      {/* Rear Wheel */}
      <group position={[-1.2, -0.6, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.6, 0.04, 16, 100]} />
          <meshStandardMaterial color="#000" metalness={1} roughness={0.1} />
        </mesh>
        {/* Neon Rim */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.55, 0.01, 16, 100]} />
          <meshStandardMaterial
            color="#fff"
            emissive="#fff"
            emissiveIntensity={2}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 1.2, 8]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>

      {/* Frame - Down Tube */}
      <mesh position={[0.1, -0.2, 0]} rotation={[0, 0, -0.8]}>
        <cylinderGeometry args={[0.06, 0.06, 1.8]} />
        <meshStandardMaterial color="#111" metalness={1} roughness={0.1} />
      </mesh>

      {/* Frame - Top Tube */}
      <mesh position={[0, 0.2, 0]} rotation={[0, 0, -0.1]}>
        <cylinderGeometry args={[0.05, 0.05, 2]} />
        <meshStandardMaterial color="#111" metalness={1} roughness={0.1} />
      </mesh>

      {/* Frame - Seat Tube */}
      <mesh position={[-0.6, -0.2, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.06, 0.06, 1]} />
        <meshStandardMaterial color="#111" metalness={1} roughness={0.1} />
      </mesh>

      {/* Frame Neon Accents */}
      <mesh position={[0, 0.25, 0.06]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[1.8, 0.01, 0.01]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={5} />
      </mesh>

      {/* Seat */}
      <mesh position={[-0.8, 0.35, 0]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.45, 0.06, 0.3]} />
        <meshStandardMaterial color="#050505" roughness={1} />
      </mesh>

      {/* Fork */}
      <mesh position={[1, -0.1, 0]} rotation={[0, 0, 0.4]}>
        <cylinderGeometry args={[0.04, 0.04, 1.4]} />
        <meshStandardMaterial color="#111" metalness={1} roughness={0.1} />
      </mesh>

      {/* Handlebars */}
      <group position={[0.8, 0.45, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1]} />
          <meshStandardMaterial color="#111" metalness={1} roughness={0.1} />
        </mesh>
        {/* Neon Grips */}
        <mesh position={[0, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.2]} />
          <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={2} />
        </mesh>
        <mesh position={[0, 0, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.2]} />
          <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={2} />
        </mesh>
      </group>

      <pointLight position={[0, 0.5, 0]} intensity={2} color="#fff" />
    </group>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
        <PerspectiveCamera makeDefault position={[0, 0.5, 6]} />
        <ambientLight intensity={0.2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
        <pointLight position={[-10, 8, -5]} intensity={1} color="#444" />
        
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.5} shadows="contact">
            <NeonBike />
          </Stage>
        </Suspense>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 2.5}
        />
      </Canvas>
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#050505] via-transparent to-transparent" />
    </div>
  );
}
