import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

function deformStrawberryPoint(point) {
  const originalY = point.y;
  const heightProgress = (originalY + 1) / 2;
  const angle = Math.atan2(point.z, point.x);
  const shoulderStrength = THREE.MathUtils.smoothstep(originalY, 0.2, 0.95);
  const shoulderLobes = 1 + Math.cos(angle * 2) * 0.045 * shoulderStrength;
  const taper = 0.7 + heightProgress * 0.34;

  point.x *= taper * shoulderLobes;
  point.z *= taper * 0.92 * shoulderLobes;
  point.y = originalY * 1.14;

  if (originalY < -0.15) point.y += originalY * 0.12;
  if (originalY > 0.5) {
    point.y -= Math.pow((originalY - 0.5) / 0.5, 1.45) * 0.58;
  }

  return point;
}

function createStrawberryGeometry(widthSegments = 56, heightSegments = 44) {
  const geometry = new THREE.SphereGeometry(1, widthSegments, heightSegments);
  const positions = geometry.attributes.position;
  const point = new THREE.Vector3();

  for (let index = 0; index < positions.count; index += 1) {
    point.fromBufferAttribute(positions, index);
    deformStrawberryPoint(point);
    positions.setXYZ(index, point.x, point.y, point.z);
  }

  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function createLemonGeometry(widthSegments = 56, heightSegments = 44) {
  const geometry = new THREE.SphereGeometry(1, widthSegments, heightSegments);
  const positions = geometry.attributes.position;
  const point = new THREE.Vector3();

  for (let index = 0; index < positions.count; index += 1) {
    point.fromBufferAttribute(positions, index);
    const originalY = point.y;
    const belly = 0.86 + (1 - Math.abs(originalY)) * 0.12;
    const tip = Math.pow(Math.abs(originalY), 4) * 0.22;
    point.x *= belly * 0.9;
    point.z *= belly * 0.9;
    point.y = originalY * 1.14 + Math.sign(originalY || 1) * tip;
    positions.setXYZ(index, point.x, point.y, point.z);
  }

  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function createBlueberryGeometry(widthSegments = 56, heightSegments = 44) {
  const geometry = new THREE.SphereGeometry(1, widthSegments, heightSegments);
  const positions = geometry.attributes.position;
  const point = new THREE.Vector3();

  for (let index = 0; index < positions.count; index += 1) {
    point.fromBufferAttribute(positions, index);
    const originalY = point.y;
    point.x *= 0.96;
    point.z *= 0.96;
    point.y = originalY * 0.84;
    if (originalY > 0.52) point.y -= Math.pow((originalY - 0.52) / 0.48, 1.6) * 0.28;
    positions.setXYZ(index, point.x, point.y, point.z);
  }

  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function createCalyxLeafGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.08, 0.05, 0.17, 0.16, 0.18, 0.34);
  shape.bezierCurveTo(0.17, 0.58, 0.08, 0.82, 0, 0.98);
  shape.bezierCurveTo(-0.08, 0.82, -0.17, 0.58, -0.18, 0.34);
  shape.bezierCurveTo(-0.17, 0.16, -0.08, 0.05, 0, 0);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.035,
    bevelEnabled: false,
    curveSegments: 8,
  });
  // A shallow tilt makes the leaves sit on the berry shoulder instead of
  // standing up like a loose crown.
  geometry.rotateX(1.16);
  geometry.computeVertexNormals();
  return geometry;
}

function DataTrail({ reducedMotion }) {
  const trail = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-3.8, -2.4, 0),
      new THREE.Vector3(-1.8, -0.8, 0.25),
      new THREE.Vector3(0.8, 0.4, -0.1),
      new THREE.Vector3(3.6, 2.2, 0.2),
    ]);
    return new THREE.TubeGeometry(curve, 96, 0.026, 12, false);
  }, []);

  return (
    <mesh geometry={trail}>
      <meshBasicMaterial color="#7a25ff" transparent opacity={0.48} />
    </mesh>
  );
}

function useFruitGeometry(createGeometry, wireSegments = [18, 14]) {
  const geometry = useMemo(() => createGeometry(), [createGeometry]);
  const wireGeometry = useMemo(() => createGeometry(...wireSegments), [createGeometry, wireSegments]);

  useEffect(() => () => {
    geometry.dispose();
    wireGeometry.dispose();
  }, [geometry, wireGeometry]);

  return [geometry, wireGeometry];
}

function Calyx({ y = 0.58, scale = 1 }) {
  const leafGeometry = useMemo(() => createCalyxLeafGeometry(), []);
  const leafAngles = useMemo(() => Array.from({ length: 5 }, (_, index) => (index / 5) * Math.PI * 2 + 0.22), []);
  const leafScales = useMemo(() => [1, 0.94, 1.04, 0.92, 0.98], []);

  useEffect(() => () => leafGeometry.dispose(), [leafGeometry]);

  return (
    <group position={[0, y, 0]} scale={scale}>
      {leafAngles.map((angle, index) => (
        <group key={`calyx-leaf-${index}`} rotation={[0, angle, 0]} scale={leafScales[index]}>
          <mesh geometry={leafGeometry} rotation={[-0.035, 0, 0]}>
            <meshStandardMaterial color={index % 2 ? "#9fd339" : "#b4ee4b"} roughness={0.58} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.045, 0]}>
        <sphereGeometry args={[0.1, 12, 10]} />
        <meshStandardMaterial color="#8abf2d" roughness={0.62} />
      </mesh>
      <mesh position={[0.01, 0.115, 0]} rotation={[0.1, 0, -0.16]}>
        <cylinderGeometry args={[0.04, 0.068, 0.2, 8]} />
        <meshStandardMaterial color="#7fb62c" roughness={0.6} />
      </mesh>
    </group>
  );
}

export function StrawberryFruit({ fruitRef }) {
  const [geometry, wireGeometry] = useFruitGeometry(createStrawberryGeometry);
  const seedPositions = useMemo(() => {
    const rows = [
      { y: 0.36, count: 6, offset: 0.1 },
      { y: 0.08, count: 7, offset: 0.52 },
      { y: -0.22, count: 6, offset: 0.14 },
      { y: -0.5, count: 5, offset: 0.62 },
      { y: -0.72, count: 3, offset: 0.2 },
    ];

    return rows.flatMap(({ y, count, offset }) => {
      const radius = Math.sqrt(1 - y * y);
      return Array.from({ length: count }, (_, index) => {
        const angle = (index / count) * Math.PI * 2 + offset;
        const point = new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
        deformStrawberryPoint(point);
        return point.multiplyScalar(1.018).toArray();
      });
    });
  }, []);

  return (
    <group ref={fruitRef} rotation={[0, 0, -0.04]}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial color="#f1536a" roughness={0.28} metalness={0.04} clearcoat={0.72} clearcoatRoughness={0.32} transparent opacity={0.86} />
      </mesh>
      <mesh geometry={wireGeometry} scale={1.035}>
        <meshBasicMaterial color="#7a25ff" wireframe transparent opacity={0.42} />
      </mesh>
      {seedPositions.map((position, index) => (
        <mesh key={`seed-${index}`} position={position} scale={[1, 1.35, 0.72]}>
          <sphereGeometry args={[0.036, 7, 6]} />
          <meshStandardMaterial color="#d9ff6d" roughness={0.45} />
        </mesh>
      ))}
      <Calyx y={0.56} />
    </group>
  );
}

export function LemonFruit({ fruitRef }) {
  const [geometry, wireGeometry] = useFruitGeometry(createLemonGeometry);
  const leafGeometry = useMemo(() => createCalyxLeafGeometry(), []);

  useEffect(() => () => leafGeometry.dispose(), [leafGeometry]);

  return (
    <group ref={fruitRef} rotation={[0.08, 0, 0.12]}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial color="#f2df3b" roughness={0.33} metalness={0.03} clearcoat={0.65} clearcoatRoughness={0.34} transparent opacity={0.87} />
      </mesh>
      <mesh geometry={wireGeometry} scale={1.035}>
        <meshBasicMaterial color="#7a25ff" wireframe transparent opacity={0.42} />
      </mesh>
      <mesh position={[0.03, 1.23, 0]} rotation={[0.1, 0, -0.14]}>
        <cylinderGeometry args={[0.055, 0.08, 0.28, 8]} />
        <meshStandardMaterial color="#7fb62c" roughness={0.6} />
      </mesh>
      <mesh geometry={leafGeometry} position={[0.05, 1.12, 0]} rotation={[0.12, 0.42, 0]} scale={0.62}>
        <meshStandardMaterial color="#a8eb36" roughness={0.58} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function BlueberryFruit({ fruitRef }) {
  const [geometry, wireGeometry] = useFruitGeometry(createBlueberryGeometry);

  return (
    <group ref={fruitRef} rotation={[0, 0.08, -0.05]}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial color="#5764e8" roughness={0.3} metalness={0.04} clearcoat={0.7} clearcoatRoughness={0.34} transparent opacity={0.86} />
      </mesh>
      <mesh geometry={wireGeometry} scale={1.04}>
        <meshBasicMaterial color="#7a25ff" wireframe transparent opacity={0.44} />
      </mesh>
      <Calyx y={0.53} scale={0.56} />
    </group>
  );
}

function placeFruit(group, config, progress, delta, reducedMotion, index) {
  if (!group) return;
  const enter = THREE.MathUtils.smoothstep(progress, config.enter[0], config.enter[1]);
  const exit = THREE.MathUtils.smoothstep(progress, config.exit[0], config.exit[1]);
  const presence = Math.max(0, Math.min(enter, 1 - exit));
  const incomingX = THREE.MathUtils.lerp(config.entryX, 0, enter);
  const outgoingX = THREE.MathUtils.lerp(0, config.exitX, exit);
  const incomingY = THREE.MathUtils.lerp(config.entryY, 0, enter);
  const outgoingY = THREE.MathUtils.lerp(0, config.exitY, exit);
  const arrivalPulse = Math.sin(enter * Math.PI) * (1 - exit) * 0.11;

  group.visible = presence > 0.025;
  group.position.set(exit > 0 ? outgoingX : incomingX, exit > 0 ? outgoingY : incomingY, 0);
  group.scale.setScalar((0.15 + presence * 0.85) * (1 + arrivalPulse));

  if (!reducedMotion) {
    group.rotation.x = Math.sin(progress * Math.PI * (2.2 + index * 0.3)) * 0.08;
    group.rotation.y += delta * (0.3 + index * 0.06);
    group.rotation.z = Math.sin(progress * Math.PI * (5 + index)) * 0.12;
  }
}

function SignalObject({ reducedMotion }) {
  const group = useRef();
  const pointer = useRef({ x: 0, y: 0 });
  const strawberryRef = useRef();
  const lemonRef = useRef();
  const blueberryRef = useRef();

  useEffect(() => {
    if (reducedMotion) return undefined;
    const onMove = (event) => {
      pointer.current.x = event.clientX / window.innerWidth - 0.5;
      pointer.current.y = event.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reducedMotion]);

  useFrame((state, delta) => {
    if (!group.current) return;
    const scrollMax = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = reducedMotion ? 0 : window.scrollY / scrollMax;
    group.current.rotation.y += reducedMotion ? 0 : delta * 0.18;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, reducedMotion ? 0 : pointer.current.y * 0.07, 0.04);
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      reducedMotion ? 0 : pointer.current.x * 0.09,
      0.04,
    );
    group.current.position.x = THREE.MathUtils.lerp(2.45, 1.7, Math.min(progress * 1.1, 1));
    group.current.position.y = -0.03 + Math.sin(progress * Math.PI * 2) * 0.42;
    group.current.scale.setScalar(THREE.MathUtils.lerp(0.94, 0.7, progress));

    placeFruit(strawberryRef.current, {
      enter: [-0.1, 0],
      exit: [0.26, 0.38],
      entryX: 0,
      entryY: 0,
      exitX: -2.7,
      exitY: 0.72,
    }, progress, delta, reducedMotion, 0);
    // The hero now owns the foreground strawberry; avoid a duplicate behind Rut.
    if (strawberryRef.current) strawberryRef.current.visible = window.scrollY > window.innerHeight && strawberryRef.current.visible;
    placeFruit(lemonRef.current, {
      enter: [0.25, 0.4],
      exit: [0.56, 0.68],
      entryX: 3.1,
      entryY: -1.28,
      exitX: -2.85,
      exitY: -0.68,
    }, progress, delta, reducedMotion, 1);
    placeFruit(blueberryRef.current, {
      enter: [0.55, 0.7],
      exit: [1.1, 1.2],
      entryX: 3.05,
      entryY: 1.2,
      exitX: -2.6,
      exitY: 0.72,
    }, progress, delta, reducedMotion, 2);
  });

  return (
    <group ref={group} position={[2.7, -0.15, 0]}>
      <Float speed={reducedMotion ? 0 : 1.25} rotationIntensity={0.07} floatIntensity={0.4}>
        <StrawberryFruit fruitRef={strawberryRef} />
        <LemonFruit fruitRef={lemonRef} />
        <BlueberryFruit fruitRef={blueberryRef} />
      </Float>
      <Sparkles
        count={reducedMotion ? 12 : 34}
        scale={[4.2, 4.2, 2]}
        size={2.3}
        speed={reducedMotion ? 0 : 0.2}
        color="#7a25ff"
        opacity={0.48}
      />
    </group>
  );
}

function Scene({ reducedMotion }) {
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 7, 8]} intensity={2.4} color="#ffffff" />
      <pointLight position={[-4, -3, 5]} intensity={20} color="#8a2cff" />
      <DataTrail reducedMotion={reducedMotion} />
      <SignalObject reducedMotion={reducedMotion} />
    </>
  );
}

export function ExperienceCanvas({ reducedMotion }) {
  return (
    <div className="experience-layer" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 7.4], fov: 46 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={reducedMotion ? "demand" : "always"}
      >
        <Scene reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
