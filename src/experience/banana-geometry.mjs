import * as THREE from "three";

export const bananaCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-.87, .48, 0),
  new THREE.Vector3(-.62, -.18, .035),
  new THREE.Vector3(0, -.43, .06),
  new THREE.Vector3(.63, -.15, .025),
  new THREE.Vector3(.9, .35, 0),
]);

// A closed, tapered peel rather than an open constant-width hose.
export function createBananaGeometry(segments = 40, radialSegments = 10) {
  const geometry = new THREE.TubeGeometry(bananaCurve, segments, 1, radialSegments, false);
  const positions = geometry.attributes.position;
  for (let ring = 0; ring <= segments; ring++) {
    const t = ring / segments;
    const center = bananaCurve.getPointAt(t);
    const thickness = .27 * Math.pow(Math.sin(Math.PI * t), .65);
    for (let side = 0; side <= radialSegments; side++) {
      const index = ring * (radialSegments + 1) + side;
      const radius = thickness * (1 + .045 * Math.cos(side / radialSegments * Math.PI * 10));
      positions.setXYZ(index,
        center.x + (positions.getX(index) - center.x) * radius,
        center.y + (positions.getY(index) - center.y) * radius,
        center.z + (positions.getZ(index) - center.z) * radius);
    }
  }
  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}
