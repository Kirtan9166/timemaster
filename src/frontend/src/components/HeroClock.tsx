import { Float } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type * as THREE from "three";

// Stars particle system
function Stars() {
  const count = 600;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    return pos;
  }, []);

  const meshRef = useRef<THREE.Points>(null);
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.02;
      meshRef.current.rotation.x += delta * 0.005;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#22d3ee"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

interface MarkItem {
  x: number;
  y: number;
  angle: number;
  len: number;
  key: number;
}
interface MinuteMarkItem {
  x: number;
  y: number;
  key: number;
}

// Clock tick marks
function ClockMarks() {
  const marks = useMemo<MarkItem[]>(() => {
    const items: MarkItem[] = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
      const radius = 1.55;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const len = 0.12;
      items.push({ x, y, angle, len, key: i });
    }
    return items;
  }, []);

  const minuteMarks = useMemo<MinuteMarkItem[]>(() => {
    const items: MinuteMarkItem[] = [];
    for (let i = 0; i < 60; i++) {
      if (i % 5 === 0) continue;
      const angle = (i / 60) * Math.PI * 2 - Math.PI / 2;
      const radius = 1.57;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      items.push({ x, y, key: i });
    }
    return items;
  }, []);

  return (
    <group>
      {marks.map((m) => (
        <mesh key={m.key} position={[m.x, m.y, 0.06]}>
          <boxGeometry args={[0.04, m.len, 0.02]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#22d3ee"
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
      {minuteMarks.map((m) => (
        <mesh key={`min-${m.key}`} position={[m.x, m.y, 0.06]}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshStandardMaterial
            color="#7c3aed"
            emissive="#7c3aed"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

// The analog clock mesh
function AnalogClock() {
  const hourHandRef = useRef<THREE.Mesh>(null);
  const minuteHandRef = useRef<THREE.Mesh>(null);
  const secondHandRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ms = now.getMilliseconds();

    const secondAngle = -((seconds + ms / 1000) / 60) * Math.PI * 2;
    const minuteAngle = -((minutes + seconds / 60) / 60) * Math.PI * 2;
    const hourAngle = -((hours + minutes / 60) / 12) * Math.PI * 2;

    if (secondHandRef.current) {
      secondHandRef.current.rotation.z = secondAngle;
    }
    if (minuteHandRef.current) {
      minuteHandRef.current.rotation.z = minuteAngle;
    }
    if (hourHandRef.current) {
      hourHandRef.current.rotation.z = hourAngle;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += 0.003;
    }
    if (glowRef.current) {
      const t = Date.now() * 0.001;
      (
        glowRef.current.material as THREE.MeshStandardMaterial
      ).emissiveIntensity = 0.3 + Math.sin(t * 1.5) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group>
        {/* Clock body - main disc */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[1.7, 1.7, 0.08, 64]} />
          <meshStandardMaterial
            color="#050a14"
            metalness={0.3}
            roughness={0.6}
          />
        </mesh>

        {/* Clock face glow */}
        <mesh ref={glowRef} position={[0, 0, 0.041]}>
          <circleGeometry args={[1.65, 64]} />
          <meshStandardMaterial
            color="#0a1628"
            emissive="#22d3ee"
            emissiveIntensity={0.3}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Outer bezel ring */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[1.7, 0.07, 16, 80]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#22d3ee"
            emissiveIntensity={0.6}
            metalness={0.5}
            roughness={0.2}
          />
        </mesh>

        {/* Spinning outer decorative ring */}
        <mesh ref={outerRingRef} position={[0, 0, 0.05]}>
          <torusGeometry args={[1.85, 0.018, 8, 120]} />
          <meshStandardMaterial
            color="#7c3aed"
            emissive="#7c3aed"
            emissiveIntensity={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>

        {/* Inner ring */}
        <mesh position={[0, 0, 0.05]}>
          <torusGeometry args={[1.52, 0.015, 8, 80]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#22d3ee"
            emissiveIntensity={0.3}
            transparent
            opacity={0.4}
          />
        </mesh>

        {/* Clock marks */}
        <ClockMarks />

        {/* Hour hand */}
        <mesh ref={hourHandRef} position={[0, 0, 0.08]}>
          <group position={[0, 0.45, 0]}>
            <mesh>
              <boxGeometry args={[0.07, 0.9, 0.04]} />
              <meshStandardMaterial
                color="#22d3ee"
                emissive="#22d3ee"
                emissiveIntensity={0.8}
                metalness={0.5}
                roughness={0.1}
              />
            </mesh>
          </group>
        </mesh>

        {/* Minute hand */}
        <mesh ref={minuteHandRef} position={[0, 0, 0.1]}>
          <group position={[0, 0.65, 0]}>
            <mesh>
              <boxGeometry args={[0.045, 1.3, 0.03]} />
              <meshStandardMaterial
                color="#a78bfa"
                emissive="#a78bfa"
                emissiveIntensity={0.8}
                metalness={0.5}
                roughness={0.1}
              />
            </mesh>
          </group>
        </mesh>

        {/* Second hand */}
        <mesh ref={secondHandRef} position={[0, 0, 0.12]}>
          <group position={[0, 0.72, 0]}>
            <mesh>
              <boxGeometry args={[0.02, 1.44, 0.02]} />
              <meshStandardMaterial
                color="#f43f5e"
                emissive="#f43f5e"
                emissiveIntensity={1.2}
              />
            </mesh>
          </group>
        </mesh>

        {/* Center hub */}
        <mesh position={[0, 0, 0.14]}>
          <cylinderGeometry args={[0.1, 0.1, 0.06, 16]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#22d3ee"
            emissiveIntensity={1}
            metalness={0.8}
            roughness={0.1}
          />
        </mesh>

        {/* Center cap */}
        <mesh position={[0, 0, 0.16]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial
            color="#f43f5e"
            emissive="#f43f5e"
            emissiveIntensity={1}
          />
        </mesh>
      </group>
    </Float>
  );
}

export default function HeroClock() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.3} color="#0a1628" />
      <pointLight position={[5, 5, 5]} intensity={1} color="#22d3ee" />
      <pointLight position={[-5, -5, 3]} intensity={0.6} color="#7c3aed" />
      <pointLight position={[0, 0, 6]} intensity={0.4} color="#ffffff" />
      <Stars />
      <AnalogClock />
    </Canvas>
  );
}
