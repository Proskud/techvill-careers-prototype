import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as THREE from "three";
import { createFruitGeometry, createAppleStemGeometry, createAppleLeafGeometry, createCoconutFleshGeometry, createCoconutRimGeometry, coconutCutHeight } from "../src/experience/fruit-geometry.mjs";

test("fruit meshes and details have finite vertices/normals within existing collision bounds", () => {
  const leafTransform = new THREE.Matrix4().compose(new THREE.Vector3(.045, 1.015, .025),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(-.25, -.1, .15)), new THREE.Vector3(.75, .75, .75));
  const leaf = createAppleLeafGeometry().applyMatrix4(leafTransform);
  const geometries = [createAppleStemGeometry(), leaf, createCoconutFleshGeometry(), createCoconutRimGeometry()];
  for (const kind of ["apple", "coconut"]) {
    for (const [w, h] of [[18, 14], [32, 24], [48, 40]]) {
      for (const cut of kind === "coconut" ? [false, true] : [false]) geometries.push(createFruitGeometry(kind, w, h, cut));
    }
  }
  for (const geometry of geometries) {
    const p = geometry.attributes.position, n = geometry.attributes.normal;
    for (let i = 0; i < p.count; i++) {
      assert.ok(Number.isFinite(n.getX(i) + n.getY(i) + n.getZ(i)));
      assert.ok(Math.hypot(p.getX(i), p.getY(i), p.getZ(i)) * 1.035 < 1.3);
    }
    geometry.dispose();
  }
});

test("apple has a recessed stem basin, broader shoulders and a narrower heel", () => {
  const geometry = createFruitGeometry("apple", 48, 40);
  const p = geometry.attributes.position;
  let topCenter = 0, shoulder = 0, upperWidth = 0, lowerWidth = 0;
  for (let i = 0; i < p.count; i++) {
    const r = Math.hypot(p.getX(i), p.getZ(i)), y = p.getY(i);
    if (r < .01 && y > 0) topCenter = y;
    shoulder = Math.max(shoulder, y);
    if (y > .35 && y < .65) upperWidth = Math.max(upperWidth, r);
    if (y < -.35 && y > -.65) lowerWidth = Math.max(lowerWidth, r);
  }
  assert.ok(shoulder - topCenter > .14);
  assert.ok(upperWidth > lowerWidth + .03);
  geometry.computeBoundingBox();
  assert.ok(geometry.boundingBox.max.y - geometry.boundingBox.min.y > 1.75);
  geometry.dispose();
});

test("coconut cut has an open annulus, a deep concave lining and mottled shell", () => {
  const rim = createCoconutRimGeometry(), flesh = createCoconutFleshGeometry();
  const shell = createFruitGeometry("coconut", 32, 24, true);
  for (let i = 0; i < rim.attributes.position.count; i++) {
    const p = rim.attributes.position;
    assert.ok(Math.hypot(p.getX(i), p.getZ(i)) > .70, "Rim must not fill the cavity");
    assert.ok(Math.abs(p.getY(i) - coconutCutHeight) < 1e-6);
  }
  flesh.computeBoundingBox();
  assert.ok(flesh.boundingBox.max.y - flesh.boundingBox.min.y > .9);
  assert.equal(shell.attributes.color.count, shell.attributes.position.count);
  const shades = new Set(Array.from(shell.attributes.color.array).map(v => v.toFixed(2)));
  assert.ok(shades.size > 15);
  [rim, flesh, shell].forEach(g => g.dispose());
});

test("all apple instances share the revised model; coconut has no apple-like foliage", () => {
  const fruit = readFileSync(new URL("../src/experience/PeopleFruitCanvas.jsx", import.meta.url), "utf8");
  const bento = readFileSync(new URL("../src/experience/PeopleBentoFruit.jsx", import.meta.url), "utf8");
  const hero = readFileSync(new URL("../src/experience/HeroFruitCanvas.jsx", import.meta.url), "utf8");
  assert.match(fruit, /from "\.\/fruit-geometry\.mjs"/);
  assert.match(bento, /<Fruit kind="apple" lightweight/);
  assert.match(hero, /\["apple", "mango", "coconut"\]\.includes\(kind\)/);
  assert.doesNotMatch(fruit, /!cut && <mesh/);
});
