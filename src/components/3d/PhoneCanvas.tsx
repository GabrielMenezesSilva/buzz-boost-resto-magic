import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, RoundedBox, ContactShadows } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

function PhoneModel() {
    const groupRef = useRef<THREE.Group>(null);

    useGSAP(() => {
        if (!groupRef.current) return;

        // Voa de baixo e gira sincronizado com o scroll da seção
        gsap.fromTo(groupRef.current.position,
            { y: -5 },
            {
                y: 0,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: "#phone-trigger-section",
                    start: "top 80%",
                    end: "center center",
                    scrub: 1,
                }
            }
        );

        gsap.fromTo(groupRef.current.rotation,
            { y: Math.PI },
            {
                y: -Math.PI / 12, // Levemente inclinado pra esquerda
                ease: "power2.out",
                scrollTrigger: {
                    trigger: "#phone-trigger-section",
                    start: "top 80%",
                    end: "center center",
                    scrub: 1,
                }
            }
        );
    }, { dependencies: [], revertOnUpdate: true });

    return (
        <group ref={groupRef} rotation={[0, -Math.PI / 6, 0]}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                {/* Phone Case */}
                <RoundedBox args={[2.8, 5.8, 0.4]} radius={0.3} smoothness={4} castShadow>
                    <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
                </RoundedBox>

                {/* Phone Screen bg */}
                <RoundedBox args={[2.6, 5.5, 0.41]} radius={0.2} smoothness={4} position={[0, 0, 0.01]}>
                    <meshStandardMaterial color="#000000" metalness={0.5} roughness={0.5} />
                </RoundedBox>

                {/* Brand/QR Placeholder Screen */}
                <mesh position={[0, 0, 0.22]}>
                    <planeGeometry args={[2.4, 4.8]} />
                    {/* Mockup tela laranja vibrante pra contraste */}
                    <meshBasicMaterial color="#f97316" />
                </mesh>

                {/* Fake UI Elements on Screen */}
                <mesh position={[0, 1.8, 0.23]}>
                    <planeGeometry args={[1.5, 0.3]} />
                    <meshBasicMaterial color="#ffffff" opacity={0.8} transparent />
                </mesh>
                <mesh position={[0, 0, 0.23]}>
                    <planeGeometry args={[1.6, 1.6]} />
                    <meshBasicMaterial color="#ffffff" opacity={0.9} transparent />
                </mesh>
                <mesh position={[0, -1.8, 0.23]}>
                    <planeGeometry args={[1.8, 0.3]} />
                    <meshBasicMaterial color="#ffffff" opacity={0.5} transparent />
                </mesh>

                {/* Phone Camera Notch */}
                <RoundedBox args={[0.8, 0.15, 0.42]} radius={0.05} position={[0, 2.6, 0.01]}>
                    <meshStandardMaterial color="#0a0a0a" />
                </RoundedBox>
            </Float>
        </group>
    );
}

export default function PhoneCanvas() {
    return (
        <div className="w-full h-[600px] relative pointer-events-none">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1.5} />
                    <directionalLight position={[-10, 10, -5]} intensity={0.5} color="#60a5fa" />
                    <Environment preset="city" />

                    <PhoneModel />

                    <ContactShadows position={[0, -3.5, 0]} opacity={0.8} scale={15} blur={2.5} far={4} color="#000000" />
                </Suspense>
            </Canvas>
        </div>
    );
}
