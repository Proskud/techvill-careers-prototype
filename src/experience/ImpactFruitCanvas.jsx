import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { StrawberryFruit } from "./ExperienceCanvas.jsx";

function ActivatedStrawberry({ active, reducedMotion }) {
  const groupRef = useRef(null);
  const fruitRef = useRef(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const targetScale = active ? 1 : 0.42;
    const scale = reducedMotion
      ? 1
      : THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 5.4, delta);

    groupRef.current.scale.setScalar(scale);
    groupRef.current.rotation.y = reducedMotion ? -0.25 : state.clock.elapsedTime * 0.22;
    groupRef.current.position.y = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 1.1) * 0.08;
  });

  return (
    <group ref={groupRef} scale={reducedMotion ? 1 : 0.42} rotation={[0.08, -0.25, -0.08]}>
      <StrawberryFruit fruitRef={fruitRef} />
      <Sparkles
        count={reducedMotion ? 12 : 34}
        scale={[3.2, 3.2, 2.2]}
        size={2.5}
        speed={reducedMotion ? 0 : 0.22}
        color="#b9f51f"
        opacity={active ? 0.75 : 0}
      />
    </group>
  );
}

export function ImpactFruitCanvas({ reducedMotion }) {
  const rootRef = useRef(null);
  const [active, setActive] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion || !rootRef.current) return undefined;

    let activationTimer;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      activationTimer = window.setTimeout(() => setActive(true), 420);
      observer.disconnect();
    }, { threshold: 0.45 });

    observer.observe(rootRef.current);
    return () => {
      observer.disconnect();
      window.clearTimeout(activationTimer);
    };
  }, [reducedMotion]);

  return (
    <div className="impact-fruit-canvas" ref={rootRef} aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4.8], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={reducedMotion ? "demand" : "always"}
      >
        <ambientLight intensity={1.7} />
        <directionalLight position={[4, 6, 7]} intensity={2.5} color="#ffffff" />
        <pointLight position={[-3, -2, 4]} intensity={15} color="#7024ff" />
        <ActivatedStrawberry active={active} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
