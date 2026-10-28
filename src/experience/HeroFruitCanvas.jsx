import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useMemo } from "react";
import { Fruit } from "./PeopleFruitCanvas.jsx";
import { bananaCurve, createBananaGeometry } from "./banana-geometry.mjs";
import { heroFruitKinds, createFlight, flightPoint, cursorPush, fruitRadius, separateBodies, advanceBodies } from "./hero-flight.mjs";

const teamFruits = heroFruitKinds;

function Pineapple({ fruitRef }) {
  const crown = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(.22, .55, 0, 1.3);
    shape.quadraticCurveTo(-.22, .55, 0, 0);
    return new THREE.ShapeGeometry(shape, 12);
  }, []);
  useEffect(() => () => crown.dispose(), [crown]);
  return <group ref={fruitRef} position={[0, -.24, 0]} scale={.86}>
    <mesh scale={[.73, 1, .73]}><sphereGeometry args={[1, 32, 24]} /><meshPhysicalMaterial color="#eab541" roughness={.34} clearcoat={.7} /></mesh>
    <mesh scale={[.75, 1.02, .75]}><sphereGeometry args={[1, 16, 12]} /><meshBasicMaterial wireframe color="#8d641d" transparent opacity={.65} /></mesh>
    {Array.from({ length: 9 }, (_, index) => <group key={index} position={[0, .8, 0]} rotation={[0, index * Math.PI * 2 / 9, 0]}>
      <mesh geometry={crown} rotation={[0, 0, -.4 - index % 3 * .2]} scale={index % 2 ? .9 : 1.1}><meshStandardMaterial color={index % 2 ? "#73a82c" : "#b1e447"} roughness={.5} side={THREE.DoubleSide} /></mesh>
    </group>)}
    <mesh geometry={crown} position={[0, .9, 0]}><meshStandardMaterial color="#95cd35" side={THREE.DoubleSide} /></mesh>
  </group>;
}

function Banana() {
  const geometry = useMemo(() => createBananaGeometry(), []);
  const wire = useMemo(() => createBananaGeometry(20, 10), []);
  const stem = useMemo(() => {
    const direction = bananaCurve.getTangentAt(0).negate();
    return { position: bananaCurve.getPointAt(0).addScaledVector(direction, .075), rotation: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction) };
  }, []);
  useEffect(() => () => { geometry.dispose(); wire.dispose(); }, [geometry, wire]);
  return <group rotation={[0, 0, -.3]}>
    <mesh geometry={geometry}><meshPhysicalMaterial color="#ecc54c" roughness={.34} clearcoat={.62} /></mesh>
    <mesh geometry={wire} scale={1.035}><meshBasicMaterial wireframe color="#7a25ff" transparent opacity={.46} /></mesh>
    <mesh position={stem.position} quaternion={stem.rotation}><cylinderGeometry args={[.035, .055, .18, 8]} /><meshStandardMaterial color="#78883c" roughness={.7} /></mesh>
    <mesh position={[.9, .35, 0]}><sphereGeometry args={[.042, 10, 8]} /><meshStandardMaterial color="#766442" roughness={.7} /></mesh>
  </group>;
}

function BotanicalFruit({ kind }) {
  const geometries = useMemo(() => [ [32, 24], [18, 14] ].map(([width, height]) => {
    const shape = new THREE.SphereGeometry(1, width, height);
    const positions = shape.attributes.position;
    for (let index = 0; index < positions.count; index++) {
      const x = positions.getX(index), y = positions.getY(index), z = positions.getZ(index);
      const taper = kind === "avocado" ? 1 - .32 * (y + 1) / 2 : 1;
      const texture = kind === "lychee" ? 1 + .035 * Math.sin(x * 45) * Math.cos(y * 38) * Math.sin(z * 41) : 1;
      positions.setXYZ(index, x * taper * texture, y * (kind === "avocado" ? 1.28 : .95) * texture, z * taper * texture);
    }
    shape.computeVertexNormals();
    return shape;
  }), [kind]);
  useEffect(() => () => geometries.forEach(geometry => geometry.dispose()), [geometries]);
  const color = kind === "avocado" ? "#71933c" : kind === "lychee" ? "#e193a1" : "#b42b51";
  return <group>
    <mesh geometry={geometries[0]}><meshPhysicalMaterial color={color} roughness={kind === "lychee" ? .75 : .38} clearcoat={.5} /></mesh>
    <mesh geometry={geometries[1]} scale={1.035}><meshBasicMaterial wireframe color="#7a25ff" transparent opacity={.46} /></mesh>
    {kind === "pomegranate" ? Array.from({length: 6}, (_, i) => <mesh key={i} position={[Math.cos(i * Math.PI / 3) * .12, 1.05, Math.sin(i * Math.PI / 3) * .12]} rotation={[0, i * Math.PI / 3, .3]}><coneGeometry args={[.075, .3, 5]} /><meshStandardMaterial color="#92374b" /></mesh>) : <mesh position={[0, kind === "avocado" ? 1.25 : .98, 0]}><cylinderGeometry args={[.04, .065, .18, 8]} /><meshStandardMaterial color="#68773e" /></mesh>}
  </group>;
}

function TeamFruit({ kind }) {
  if (kind === "pineapple") return <Pineapple />;
  if (kind === "banana") return <Banana />;
  if (["apple", "mango", "coconut"].includes(kind)) return <Fruit kind={kind} />;
  return <BotanicalFruit kind={kind} />;
}

function FlyingTeam({ pointer, turn, reducedMotion }) {
  const fruits = useRef([]);
  const elapsed = useRef(0);
  const configs = useMemo(() => teamFruits.map((_, index) => createFlight(index)), []);
  const pushes = useRef(teamFruits.map(() => ({ x: 0, y: 0 })));
  const bodies = useRef([]);
  const dimensions = useRef("");
  const manualTurn = useRef(0);
  const viewport = useThree((state) => state.viewport);
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => { invalidate(); }, [turn, reducedMotion, viewport, invalidate]);
  useFrame((_, delta) => {
    const dt = Math.min(delta, .05);
    if (!reducedMotion) elapsed.current += dt;
    manualTurn.current = reducedMotion ? turn * Math.PI / 2 : THREE.MathUtils.damp(manualTurn.current, turn * Math.PI / 2, 6, dt);
    const sizes = teamFruits.map(kind => Math.min(viewport.width, viewport.height) * (kind === "pineapple" ? .09 : .065));
    const targets = teamFruits.map((kind, index) => {
      const config = configs[index];
      const point = flightPoint(config, reducedMotion ? 0 : elapsed.current);
      const push = reducedMotion ? { x: 0, y: 0 } : cursorPush(point, pointer.current, viewport.width, viewport.height);
      const offset = pushes.current[index];
      offset.x = reducedMotion ? 0 : THREE.MathUtils.damp(offset.x, push.x, 3, dt);
      offset.y = reducedMotion ? 0 : THREE.MathUtils.damp(offset.y, push.y, 3, dt);
      return { x: (point.x - .5) * viewport.width + offset.x, y: (.5 - point.y) * viewport.height + offset.y, radius: fruitRadius(kind, sizes[index] * (1 + index % 3 * .1)) };
    });
    const sizeKey = `${viewport.width}:${viewport.height}`;
    if (dimensions.current !== sizeKey || reducedMotion) {
      dimensions.current = sizeKey;
      bodies.current = targets.map(target => ({ ...target, vx: 0, vy: 0 }));
      separateBodies(bodies.current, viewport.width, viewport.height);
    } else advanceBodies(bodies.current, targets, dt, viewport.width, viewport.height);
    fruits.current.forEach((fruit, index) => {
      if (!fruit) return;
      const config = configs[index], body = bodies.current[index];
      fruit.position.set(body.x, body.y, 0);
      // Independent signed velocities: complete revolutions on X, Y and Z.
      fruit.rotation.set(config.phase + elapsed.current * config.spin[0], manualTurn.current + elapsed.current * config.spin[1], config.drift + elapsed.current * config.spin[2]);
      fruit.scale.setScalar(sizes[index] * (1 + index % 3 * .1));
    });
  });
  return <group>{teamFruits.map((kind, index) => <group key={kind} ref={(group) => { fruits.current[index] = group; }}><TeamFruit kind={kind} /></group>)}</group>;
}
export function HeroFruitCanvas({ pointer, turn, reducedMotion, visible }) {
  return <Canvas orthographic frameloop={reducedMotion || !visible ? "demand" : "always"} dpr={[1, 1.25]} camera={{ position: [0, 0, 10], zoom: 100 }} gl={{ alpha: true, antialias: true }}>
    <ambientLight intensity={1.6} /><directionalLight position={[3, 5, 7]} intensity={2.8} /><pointLight position={[-3, -2, 4]} intensity={10} color="#8a2cff" />
    <FlyingTeam pointer={pointer} turn={turn} reducedMotion={reducedMotion} />
  </Canvas>;
}
