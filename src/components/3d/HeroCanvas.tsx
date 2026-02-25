import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import { useMemo, useRef, Suspense } from "react";
import * as THREE from "three";

function Particle({ position, scale, color, speed }: any) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        const { x, y } = state.pointer;

        meshRef.current.rotation.x += 0.005 * speed;
        meshRef.current.rotation.y += 0.008 * speed;

        const targetX = (x * 3) + position[0];
        const targetY = (y * 3) + position[1];

        meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.02;
        meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.02;
    });

    return (
        <Float speed={speed} rotationIntensity={2} floatIntensity={3}>
            <mesh ref={meshRef} position={position} scale={scale}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshPhysicalMaterial
                    color={color}
                    transparent={true}
                    opacity={0.4}
                    metalness={0.1}
                    roughness={0.1}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                    envMapIntensity={2}
                />
            </mesh>
        </Float>
    );
}

function Scene() {
    const particles = useMemo(() => {
        const temp = [];
        const colors = ["#ffffff", "#f97316", "#60a5fa", "#e2e8f0"];
        for (let i = 0; i < 10; i++) {
            const x = (Math.random() - 0.5) * 20;
            const y = (Math.random() - 0.5) * 20;
            const z = (Math.random() - 0.5) * 10 - 5;
            const scale = Math.random() * 0.6 + 0.2;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const speed = Math.random() * 2 + 1;
            temp.push({ position: [x, y, z], scale, color, speed, id: i });
        }
        return temp;
    }, []);

    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} />
            <Environment preset="city" />

            {particles.map((props) => (
                <Particle key={props.id} {...props} />
            ))}
        </>
    );
}

export default function HeroCanvas() {
    return (
        <div className="absolute inset-0 -z-10 h-full w-full pointer-events-none overflow-hidden">
            <Canvas
                camera={{ position: [0, 0, 10], fov: 50 }}
                dpr={1}
                eventSource={document.getElementById('root') as HTMLElement}
                eventPrefix="client"
            >
                <Suspense fallback={null}>
                    <Scene />
                </Suspense>
            </Canvas>
        </div>
    );
}
