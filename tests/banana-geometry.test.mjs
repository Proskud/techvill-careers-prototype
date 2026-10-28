import test from "node:test";
import assert from "node:assert/strict";
import { bananaCurve, createBananaGeometry } from "../src/experience/banana-geometry.mjs";

test("banana has closed tapered tips and stays within its collision radius", () => {
  for (const segments of [20, 40]) {
    const geometry = createBananaGeometry(segments, 10);
    const positions = geometry.attributes.position;
    const normals = geometry.attributes.normal;
    for (let i = 0; i < positions.count; i++) {
      const radius = Math.hypot(positions.getX(i), positions.getY(i), positions.getZ(i));
      assert.ok(Number.isFinite(radius) && radius * 1.035 < 1.15);
      assert.ok(Number.isFinite(normals.getX(i) + normals.getY(i) + normals.getZ(i)));
    }
    for (const ring of [0, segments]) {
      const tip = bananaCurve.getPointAt(ring / segments);
      for (let side = 0; side <= 10; side++) {
        const i = ring * 11 + side;
        assert.ok(Math.hypot(positions.getX(i) - tip.x, positions.getY(i) - tip.y, positions.getZ(i) - tip.z) < 1e-6);
      }
    }
    geometry.dispose();
  }
});
