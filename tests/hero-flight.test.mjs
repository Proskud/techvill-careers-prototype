import test from "node:test";
import assert from "node:assert/strict";
import { createFlight, flightPoint, cursorPush, separateBodies, advanceBodies, fruitRadius } from "../src/experience/hero-flight.mjs";

test("all eight flight paths close without jumps and remain within hero", () => {
  for (let i = 0; i < 8; i++) {
    const config = createFlight(i, () => .4);
    const start = flightPoint(config, 0), end = flightPoint(config, config.period);
    assert.ok(Math.abs(start.x - end.x) < 1e-10);
    assert.ok(Math.abs(start.y - end.y) < 1e-10);
    for (let time = 0; time < config.period; time += .1) {
      const point = flightPoint(config, time);
      assert.ok(point.x >= .12 && point.x <= .88);
      assert.ok(point.y >= .17 && point.y <= .83);
    }
    assert.ok(config.spin.every(value => Math.abs(value) >= .14));
  }
});

function assertSeparated(bodies) {
  for (let i = 0; i < bodies.length; i++) for (let j = i + 1; j < bodies.length; j++) {
    assert.ok(Math.hypot(bodies[i].x - bodies[j].x, bodies[i].y - bodies[j].y) >= bodies[i].radius + bodies[j].radius - 1e-3, `Fruit ${i} intersects ${j}`);
  }
}

test("coincident fruit centers resolve without NaN or mesh overlap", () => {
  const bodies = Array.from({ length: 8 }, () => ({ x: 0, y: 0, vx: 0, vy: 0, radius: .5 }));
  separateBodies(bodies, 12, 8);
  assertSeparated(bodies);
  assert.ok(bodies.every(body => Number.isFinite(body.x) && Number.isFinite(body.y)));
});

test("viewport edge correction does not push one fruit through another", () => {
  const bodies = [-3, -1.1].map(x => ({ x, y: 0, vx: 0, vy: 0, radius: .5 }));
  separateBodies(bodies, 4, 4);
  assertSeparated(bodies);
  assert.ok(bodies.every(body => Math.abs(body.x) + body.radius <= 2));
});

test("eight crossing flight paths remain separated for desktop and mobile", () => {
  const kinds = ["apple", "mango", "lychee", "pineapple", "avocado", "coconut", "banana", "pomegranate"];
  const configs = kinds.map((_, i) => createFlight(i, () => .4));
  for (const [width, height] of [[11.35, 7.99], [3.2, 10], [19.2, 10.8]]) {
    const targetsAt = seconds => configs.map((config, i) => {
      const point = flightPoint(config, seconds);
      const scale = Math.min(width, height) * (kinds[i] === "pineapple" ? .09 : .065) * (1 + i % 3 * .1);
      return { x: (point.x - .5) * width, y: (.5 - point.y) * height, radius: fruitRadius(kinds[i], scale) };
    });
    const bodies = targetsAt(0).map(target => ({ ...target, vx: 0, vy: 0 }));
    separateBodies(bodies, width, height);
    for (let frame = 0; frame < 7200; frame++) {
      advanceBodies(bodies, targetsAt(frame / 60), 1 / 60, width, height);
      assertSeparated(bodies);
      assert.ok(bodies.every(body => Math.abs(body.x) + body.radius <= width / 2 + 1e-6 && Math.abs(body.y) + body.radius <= height / 2 + 1e-6));
    }
  }
});
test("cursor repulsion points away, stays bounded and disappears outside radius", () => {
  assert.deepEqual(cursorPush({x:.5,y:.5}, {x:.5,y:.5,active:false}, 12, 8), {x:0,y:0});
  assert.deepEqual(cursorPush({x:.9,y:.9}, {x:.1,y:.1,active:true}, 12, 8), {x:0,y:0});
  const push = cursorPush({x:.5,y:.5}, {x:.49,y:.49,active:true}, 12, 8);
  assert.ok(push.x > 0 && push.y < 0);
  assert.ok(Math.hypot(push.x, push.y) <= 8 * .24 * .2);
  const overlap = cursorPush({x:.5,y:.5}, {x:.5,y:.5,active:true}, 12, 8);
  assert.ok(Number.isFinite(overlap.x) && Number.isFinite(overlap.y));
});
