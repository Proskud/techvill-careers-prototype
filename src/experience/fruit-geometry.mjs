import * as THREE from "three";

export const coconutCutHeight = .245;

export function createFruitGeometry(kind, widthSegments = 48, heightSegments = 40, cut = false) {
  const cutAngle = Math.acos(.25);
  const geometry = new THREE.SphereGeometry(1, widthSegments, heightSegments, 0, Math.PI * 2,
    cut ? cutAngle : 0, cut ? Math.PI - cutAngle : Math.PI);
  const positions = geometry.attributes.position;
  const colors = [];
  const darkShell = new THREE.Color("#493023");
  const lightShell = new THREE.Color("#946745");

  for (let i = 0; i < positions.count; i++) {
    let x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i);
    const radius = Math.hypot(x, z);
    const azimuth = Math.atan2(z, x);
    if (kind === "apple") {
      // Broad shoulders, narrower heel, and a real stem basin rather than a
      // uniformly flattened sphere. Five subtle lobes stay soft, not scalloped.
      const shoulders = .90 + .14 * (y + 1) / 2 + .10 * Math.exp(-(((y - .40) / .45) ** 2));
      const lobes = 1 + .035 * Math.cos(5 * azimuth) * y * y;
      x *= shoulders * lobes;
      z *= shoulders * lobes;
      y = y * 1.04
        - (y > 0 ? .38 * Math.exp(-((radius / .38) ** 2)) : 0)
        + (y < 0 ? .12 * Math.exp(-((radius / .28) ** 2)) : 0);
    } else if (kind === "mango") {
      const taper = 1 - .18 * (y + 1) / 2;
      x = x * .88 * taper + .12 * y;
      z *= .73 * taper;
      y *= 1.24;
    } else {
      // Deterministic longitudinal grain, shared by body and wireframe.
      const grain = Math.sin(azimuth * 23 + y * 5);
      const ridges = 1 + radius * (.018 * grain + .009 * Math.sin(azimuth * 41 - y * 9));
      x *= 1.02 * ridges;
      z *= .95 * ridges;
      y *= .98;
      const shade = THREE.MathUtils.clamp(.44 + .25 * grain + .16 * Math.sin(azimuth * 37 + y * 13), 0, 1);
      const color = darkShell.clone().lerp(lightShell, shade);
      colors.push(color.r, color.g, color.b);
    }
    positions.setXYZ(i, x, y, z);
  }
  if (kind === "coconut") geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

export function createAppleStemGeometry() {
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, .70, 0), new THREE.Vector3(.015, .86, .01),
    new THREE.Vector3(.07, 1.03, .015), new THREE.Vector3(.14, 1.13, .02),
  ]), 10, .037, 6, false);
}

export function createAppleLeafGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(.16, .20, .39, .21, .60, .07);
  shape.bezierCurveTo(.37, -.08, .14, -.13, 0, 0);
  const geometry = new THREE.ShapeGeometry(shape, 10);
  const positions = geometry.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    positions.setZ(i, .06 * Math.sin(positions.getX(i) / .60 * Math.PI));
  }
  geometry.computeVertexNormals();
  return geometry;
}

export function createCoconutFleshGeometry(segments = 40) {
  // A concave lining with a visible floor: never a solid white lid.
  const geometry = new THREE.LatheGeometry([
    new THREE.Vector2(0, -.72), new THREE.Vector2(.20, -.70),
    new THREE.Vector2(.42, -.61), new THREE.Vector2(.60, -.42),
    new THREE.Vector2(.71, -.16), new THREE.Vector2(.76, coconutCutHeight),
  ], segments);
  const positions = geometry.attributes.position;
  const colors = [];
  const floor = new THREE.Color("#b9aa91"), rim = new THREE.Color("#fff8e9");
  for (let i = 0; i < positions.count; i++) {
    const color = floor.clone().lerp(rim, (positions.getY(i) + .72) / (coconutCutHeight + .72));
    colors.push(color.r, color.g, color.b);
  }
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.scale(1, 1, .95 / 1.02);
  geometry.computeBoundingSphere();
  return geometry;
}

export function createCoconutRimGeometry() {
  const geometry = new THREE.RingGeometry(.76, .985, 48, 2);
  geometry.rotateX(-Math.PI / 2);
  geometry.scale(1, 1, .95 / 1.02);
  geometry.translate(0, coconutCutHeight, 0);
  return geometry;
}
