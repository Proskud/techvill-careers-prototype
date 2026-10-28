import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createServiceValueBehavior, serviceValueHoverQuery } from '../src/data/service-value-behavior.mjs';

function fixture() {
  let enabled = true;
  let keyboard = false;
  let focused = null;
  let prevented = false;
  const item = { open: false, contains: node => node === summary, querySelector: () => summary };
  const summary = { closest: () => item, matches: () => keyboard, focus: () => { focused = summary; behavior.focus({ currentTarget: item, target: summary }); } };
  const behavior = createServiceValueBehavior({ isHoverMode: () => enabled, activeElement: () => focused });
  const event = { currentTarget: item, pointerType: 'mouse', preventDefault: () => { prevented = true; } };
  return { item, summary, behavior, event, enable: value => { enabled = value; }, keyboard: value => { keyboard = value; }, focus: value => { focused = value; }, prevented: () => prevented };
}

test('Fine-pointer entry opens and leaving closes; moving inside the card needs no re-entry', () => {
  const f = fixture();
  f.behavior.pointerEnter(f.event);
  assert.equal(f.item.open, true);
  f.behavior.pointerLeave(f.event);
  assert.equal(f.item.open, false);
  f.behavior.pointerEnter({ ...f.event, pointerType: 'touch' });
  assert.equal(f.item.open, false);
  f.enable(false);
  f.behavior.pointerEnter(f.event);
  assert.equal(f.item.open, false);
});

test('Keyboard focus keeps details available; Escape dismisses without focus-triggered reopening', () => {
  const f = fixture();
  f.keyboard(true);
  f.summary.focus();
  assert.equal(f.item.open, true);
  f.behavior.pointerLeave(f.event);
  assert.equal(f.item.open, true);
  f.focus(null);
  f.behavior.keyDown({ ...f.event, key: 'Escape' });
  assert.equal(f.item.open, false);
  assert.equal(f.prevented(), true);
  f.behavior.pointerEnter(f.event);
  assert.equal(f.item.open, true);
  f.behavior.blur({ ...f.event, relatedTarget: null });
  assert.equal(f.item.open, false);
});

test('Desktop mouse click does not collapse a hovered card; touch and keyboard retain native toggle', () => {
  const f = fixture();
  f.behavior.summaryClick({ ...f.event, currentTarget: f.summary, detail: 1 });
  assert.equal(f.item.open, true);
  assert.equal(f.prevented(), true);
  const t = fixture();
  t.behavior.pointerDown({ pointerType: 'touch' });
  t.behavior.summaryClick({ ...t.event, currentTarget: t.summary, detail: 1 });
  assert.equal(t.prevented(), false);
  const k = fixture();
  k.behavior.summaryClick({ ...k.event, currentTarget: k.summary, detail: 0 });
  assert.equal(k.prevented(), false);
});

test('CSS and behavior agree on hover mode; only that mode hides the More row', () => {
  const css = readFileSync(new URL('../src/services.css', import.meta.url), 'utf8');
  assert.ok(css.includes(`@media ${serviceValueHoverQuery}`));
  assert.ok(css.includes('.services-values .ai-direction-toggle, .services-values .ai-direction-dismiss { display: none; }'));
  assert.ok(css.includes('.service-value-hover-cue { display: none; }'));
});
