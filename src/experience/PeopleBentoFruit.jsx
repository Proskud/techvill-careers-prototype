import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Fruit } from "./PeopleFruitCanvas.jsx";

function Composition({ kind, pointer, turn, reducedMotion, visible, onReady }) {
  const group = useRef(null);
  const invalidate = useThree(state => state.invalidate);
  const { gl, scene, camera } = useThree();
  const compiled = useRef(false);
  const firstFrame = useRef(false);
  useEffect(() => { invalidate(); }, [turn, reducedMotion, invalidate]);
  useEffect(() => {
    let cancelled = false;
    compiled.current = false;
    // Compile while approaching the section, before the first visible render.
    const finish = () => {
      if (cancelled) return;
      compiled.current = true;
      invalidate();
    };
    gl.compileAsync(scene, camera).then(finish, finish);
    return () => { cancelled = true; };
  }, [gl, scene, camera, invalidate]);
  useEffect(() => {
    invalidate();
    if (!visible || reducedMotion) return;
    // These small decorative scenes need 30 fps, not four full-rate loops.
    const timer = window.setInterval(invalidate, 1000 / 30);
    return () => window.clearInterval(timer);
  }, [visible, reducedMotion, invalidate]);
  useFrame((state, delta) => {
    if (!compiled.current || !group.current) return;
    const dt = Math.min(delta, .05);
    const target = turn * Math.PI / 2 + (reducedMotion ? 0 : pointer.current.x * .35);
    group.current.rotation.y = reducedMotion ? target : THREE.MathUtils.damp(group.current.rotation.y, target, 5, dt);
    group.current.rotation.x = reducedMotion ? 0 : THREE.MathUtils.damp(group.current.rotation.x, -pointer.current.y * .16, 5, dt);
    group.current.position.y = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * .8) * .025;
    state.gl.render(state.scene, state.camera);
    // Ready means an actual rendered frame, not merely a useFrame callback.
    if (!firstFrame.current) { firstFrame.current = true; onReady(); }
  }, 1);
  return <group ref={group}>
    {kind === "mix" ? <>
      <group position={[-.62, .2, 0]} scale={.65}><Fruit kind="apple" lightweight /></group>
      <group position={[.65, -.1, .15]} scale={.65}><Fruit kind="mango" lightweight /></group>
    </> : <group rotation={kind === "coconut" ? [.65, -.35, -.3] : [0, -.25, kind === "mango" ? -.16 : .03]}><Fruit kind={kind} cut={kind === "coconut"} lightweight /></group>}
  </group>;
}

export function PeopleBentoFruit({ kind, label, reducedMotion }) {
  const slot = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [prepared, setPrepared] = useState(false);
  const [ready, setReady] = useState(false);
  const [turn, setTurn] = useState(0);
  const markReady = useCallback(() => setReady(true), []);
  useEffect(() => {
    // Prepare once well before the slot arrives. Keep WebGL/materials on return.
    const prepare = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setPrepared(true); prepare.disconnect(); }
    }, { rootMargin: "1200px" });
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    prepare.observe(slot.current);
    observer.observe(slot.current);
    return () => { prepare.disconnect(); observer.disconnect(); };
  }, []);
  return <button ref={slot} type="button" data-scene-ready={ready} data-scene-active={visible && !reducedMotion} className={`people-bento-fruit people-bento-fruit-${kind}`} aria-label={`Повернуть декоративную 3D-композицию: ${label}`} onClick={() => setTurn(value => value + 1)} onPointerMove={event => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointer.current = { x: 2 * (event.clientX - rect.left) / rect.width - 1, y: 2 * (event.clientY - rect.top) / rect.height - 1 };
  }} onPointerLeave={() => { pointer.current = { x: 0, y: 0 }; }} onKeyDown={event => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    setTurn(value => value + (event.key === "ArrowLeft" ? -1 : 1));
  }}>
    {prepared && <Canvas aria-hidden="true" dpr={1} resize={{ scroll: false, debounce: { resize: 50 } }} camera={{ position: [0, 0, 4], fov: 40 }} gl={{ alpha: true, antialias: true }} frameloop="demand">
      <ambientLight intensity={1.6} /><directionalLight position={[4, 6, 8]} intensity={2.3} /><pointLight position={[-3, -2, 4]} intensity={13} color="#8a2cff" />
      <Composition kind={kind} pointer={pointer} turn={turn} reducedMotion={reducedMotion} visible={visible} onReady={markReady} />
    </Canvas>}
  </button>;
}
