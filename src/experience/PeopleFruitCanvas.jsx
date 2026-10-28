import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { createFruitGeometry, createAppleStemGeometry, createAppleLeafGeometry, createCoconutFleshGeometry, createCoconutRimGeometry } from "./fruit-geometry.mjs";

const arrangements = [
  [
    { position: [0, 0.05, 0], scale: 1.5 },
    { position: [2.55, -1.45, -1.1], scale: 0.48 },
    { position: [-2.5, 1.55, -1.2], scale: 0.42 },
  ],
  [
    { position: [-2.65, 1.45, -1.2], scale: 0.42 },
    { position: [0, -0.02, 0], scale: 1.38 },
    { position: [2.55, -1.5, -1.1], scale: 0.44 },
  ],
  [
    { position: [2.6, 1.45, -1.2], scale: 0.42 },
    { position: [-2.55, -1.4, -1.2], scale: 0.44 },
    { position: [0, 0.05, 0], scale: 1.62 },
  ],
  [
    { position: [-1.45, 0.25, 0], scale: 0.92 },
    { position: [0.25, 0.55, -0.25], scale: 0.86 },
    { position: [1.42, -0.35, 0.1], scale: 0.92 },
  ],
  [
    { position: [-1.6, -0.35, 0], scale: 0.96 },
    { position: [0, 0.7, -0.3], scale: 0.96 },
    { position: [1.6, -0.35, 0], scale: 0.96 },
  ],
];

export function Fruit({ kind, fruitRef, cut = false, lightweight = false }) {
  const geometry = useMemo(() => createFruitGeometry(kind, lightweight ? 32 : 48, lightweight ? 24 : 40, cut), [kind, cut, lightweight]);
  const wireGeometry = useMemo(() => createFruitGeometry(kind, 18, 14, cut), [kind, cut]);
  const details = useMemo(() => kind === "apple"
    ? [createAppleStemGeometry(), createAppleLeafGeometry()]
    : kind === "coconut" && cut ? [createCoconutFleshGeometry(lightweight ? 32 : 48), createCoconutRimGeometry()] : [], [kind, cut, lightweight]);

  useEffect(() => () => {
    geometry.dispose();
    wireGeometry.dispose();
    details.forEach(detail => detail.dispose());
  }, [geometry, wireGeometry, details]);

  const colors = {
    apple: "#dc3e55",
    mango: "#eaa02e",
    coconut: "#ffffff",
  };
  const top = 1.2; // Mango foliage only; apple and coconut have their own details.

  return (
    <group ref={fruitRef} rotation={[kind === "apple" ? .18 : 0, 0, kind === "mango" ? -0.16 : 0.03]}>
      <mesh geometry={geometry}>
        {lightweight
          ? <meshStandardMaterial color={colors[kind]} vertexColors={kind === "coconut"} roughness={kind === "coconut" ? .95 : kind === "apple" ? .3 : .24} metalness={0.04} />
          : <meshPhysicalMaterial color={colors[kind]} vertexColors={kind === "coconut"} roughness={kind === "coconut" ? .95 : .28} metalness={0.04} clearcoat={kind === "coconut" ? .05 : .62} clearcoatRoughness={.34} transparent={kind !== "coconut"} opacity={kind === "coconut" ? 1 : .9} />}
      </mesh>
      <mesh geometry={wireGeometry} scale={1.035}>
        <meshBasicMaterial color="#7a25ff" wireframe transparent opacity={0.46} />
      </mesh>
      {kind === "apple" && <>
        <mesh geometry={details[0]}><meshStandardMaterial color="#68412c" roughness={.9} /></mesh>
        <mesh geometry={details[1]} position={[.045, 1.015, .025]} rotation={[-.25, -.1, .15]} scale={.75}>
          <meshStandardMaterial color="#83b938" roughness={.65} side={THREE.DoubleSide} />
        </mesh>
      </>}
      {kind === "mango" && <mesh position={[0.02, top + 0.07, 0]} rotation={[0.1, 0, -0.2]}>
        <cylinderGeometry args={[0.035, 0.055, 0.23, 8]} />
        <meshStandardMaterial color="#64893b" roughness={0.7} />
      </mesh>}
      {kind === "mango" && <mesh position={[0.21, top + 0.16, 0]} rotation={[0, 0, -0.4]} scale={[0.27, 0.045, 0.12]}>
        <sphereGeometry args={[1, 18, 10]} />
        <meshStandardMaterial color="#a6de4d" roughness={0.55} />
      </mesh>}
      {kind === "coconut" && cut && <>
        <mesh geometry={details[0]}><meshStandardMaterial vertexColors roughness={.85} side={THREE.DoubleSide} /></mesh>
        <mesh geometry={details[1]}><meshStandardMaterial color="#fff8e9" roughness={.85} side={THREE.DoubleSide} /></mesh>
      </>}
      {kind === "coconut" && !cut && [[-.16, .42, .84], [.13, .43, .85], [-.01, .19, .94]].map((position, index) => <mesh key={index} position={position} rotation={[-.3, 0, index * .3]} scale={[.065, .09, .025]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#302016" roughness={1} />
      </mesh>)}
    </group>
  );
}

function FruitCharacter({ active, reducedMotion }) {
  const groupRef = useRef(null);
  const appleRef = useRef(null);
  const mangoRef = useRef(null);
  const coconutRef = useRef(null);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (reducedMotion) invalidate();
  }, [active, reducedMotion, invalidate]);

  useFrame((state, delta) => {
    const refs = [appleRef, mangoRef, coconutRef];
    const target = arrangements[active] ?? arrangements[0];

    refs.forEach((ref, index) => {
      const fruit = ref.current;
      if (!fruit) return;
      const config = target[index];
      if (reducedMotion) {
        fruit.position.set(...config.position);
        fruit.scale.setScalar(config.scale);
        return;
      }
      fruit.position.x = THREE.MathUtils.damp(fruit.position.x, config.position[0], 4.8, delta);
      fruit.position.y = THREE.MathUtils.damp(fruit.position.y, config.position[1], 4.8, delta);
      fruit.position.z = THREE.MathUtils.damp(fruit.position.z, config.position[2], 4.8, delta);
      const scale = THREE.MathUtils.damp(fruit.scale.x, config.scale, 5.4, delta);
      fruit.scale.setScalar(scale);
      fruit.rotation.y += delta * (0.22 + index * 0.06);
    });

    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, state.pointer.y * 0.08, 3.8, delta);
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, state.pointer.x * 0.12, 3.8, delta);
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.055;
    }
  });

  return (
    <group ref={groupRef}>
      <Fruit kind="apple" fruitRef={appleRef} />
      <Fruit kind="mango" fruitRef={mangoRef} />
      <Fruit kind="coconut" fruitRef={coconutRef} />
      <Sparkles
        count={reducedMotion ? 14 : 42}
        scale={[7, 5, 3]}
        size={2.2}
        speed={reducedMotion ? 0 : 0.18}
        color="#7a25ff"
        opacity={0.5}
      />
    </group>
  );
}

export function PeopleFruitCanvas({ active, reducedMotion }) {
  return (
    <div className="people-fruit-canvas">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 7.2], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={reducedMotion ? "demand" : "always"}
      >
        <ambientLight intensity={1.65} />
        <directionalLight position={[4, 6, 8]} intensity={2.3} color="#ffffff" />
        <pointLight position={[-3, -2, 4]} intensity={13} color="#8a2cff" />
        <FruitCharacter active={active} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
