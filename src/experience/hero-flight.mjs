// The approved hero models are independent from newly added static team avatars.
export const heroFruitKinds = ["apple", "mango", "lychee", "pineapple", "avocado", "coconut", "banana", "pomegranate"];

export function createFlight(index, random = Math.random) {
  const signed = () => (random() < .5 ? -1 : 1) * (.14 + random() * .22);
  return {
    phase: index / 8 * Math.PI * 2 + random() * .4,
    period: 32 + random() * 24,
    xWaves: 1 + index % 3,
    yWaves: 1 + (index + 1) % 3,
    drift: random() * Math.PI * 2,
    spin: [signed(), signed(), signed()],
  };
}

// Whole-number harmonics close each orbit seamlessly, without jump/reset frames.
export function flightPoint(config, seconds) {
  const angle = seconds / config.period * Math.PI * 2;
  return {
    x: .5 + .31 * Math.sin(angle * config.xWaves + config.phase) + .07 * Math.sin(angle * 2 + config.drift),
    y: .5 + .27 * Math.cos(angle * config.yWaves + config.phase) + .06 * Math.sin(angle * 3 + config.drift),
  };
}

export function cursorPush(point, cursor, width, height) {
  if (!cursor.active) return { x: 0, y: 0 };
  const x = (point.x - cursor.x) * width;
  const y = (cursor.y - point.y) * height;
  const distance = Math.hypot(x, y);
  const radius = Math.min(width, height) * .24;
  if (distance >= radius) return { x: 0, y: 0 };
  const strength = (1 - distance / radius) ** 2 * radius * .2;
  // At exact overlap use a stable direction instead of division by zero.
  return distance < .001 ? { x: strength, y: 0 } : { x: x / distance * strength, y: y / distance * strength };
}

// Conservative projected bounds cover every orientation, including crowns/leaves.
export function fruitRadius(kind, scale) {
  const bounds = { pineapple: 2.1, mango: 1.45, avocado: 1.45, banana: 1.15, apple: 1.3, coconut: 1.3, lychee: 1.2, pomegranate: 1.25 };
  return scale * (bounds[kind] || 1.45);
}

export function separateBodies(bodies, width, height) {
  for (let pass = 0; pass < 96; pass++) {
    let overlap = 0;
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const a = bodies[i], b = bodies[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const distance = Math.hypot(dx, dy);
        const gap = a.radius + b.radius + .03;
        if (distance >= gap) continue;
        // Deterministic pair direction also resolves exact coincident centers.
        const angle = (i * 7 + j * 3) * 2.399963;
        const nx = distance > 1e-8 ? dx / distance : Math.cos(angle);
        const ny = distance > 1e-8 ? dy / distance : Math.sin(angle);
        const correction = (gap - distance) / 2;
        overlap = Math.max(overlap, correction);
        a.x -= nx * correction; a.y -= ny * correction;
        b.x += nx * correction; b.y += ny * correction;
        const closing = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        if (closing < 0) {
          a.vx += nx * closing / 2; a.vy += ny * closing / 2;
          b.vx -= nx * closing / 2; b.vy -= ny * closing / 2;
        }
      }
    }
    for (const body of bodies) {
      const maxX = Math.max(0, width / 2 - body.radius), maxY = Math.max(0, height / 2 - body.radius);
      const x = Math.max(-maxX, Math.min(maxX, body.x));
      const y = Math.max(-maxY, Math.min(maxY, body.y));
      // Edge correction can create a new overlap: solve another pass afterward.
      overlap = Math.max(overlap, Math.abs(x - body.x), Math.abs(y - body.y));
      body.x = x; body.y = y;
    }
    if (overlap < 1e-5) break;
  }
}

export function advanceBodies(bodies, targets, delta, width, height) {
  const dt = Math.min(delta, .05) / 2;
  for (let step = 0; step < 2; step++) {
    bodies.forEach((body, index) => {
      body.vx += ((targets[index].x - body.x) * 16 - body.vx * 8) * dt;
      body.vy += ((targets[index].y - body.y) * 16 - body.vy * 8) * dt;
    });
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const a = bodies[i], b = bodies[j];
        const dx = b.x - a.x, dy = b.y - a.y, distance = Math.hypot(dx, dy);
        const near = (a.radius + b.radius + .03) * 1.25;
        if (distance < 1e-8 || distance >= near) continue;
        const force = (1 - distance / near) ** 2 * 32 * dt;
        a.vx -= dx / distance * force; a.vy -= dy / distance * force;
        b.vx += dx / distance * force; b.vy += dy / distance * force;
      }
    }
    for (const body of bodies) { body.x += body.vx * dt; body.y += body.vy * dt; }
    separateBodies(bodies, width, height);
  }
}
