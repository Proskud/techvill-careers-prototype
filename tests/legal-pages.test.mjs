import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { consents, privacyPolicy } from '../src/data/legal.js';

const source = readFileSync(new URL('../src/Prototype.jsx', import.meta.url), 'utf8');
const forms = readFileSync(new URL('../src/ContactForms.jsx', import.meta.url), 'utf8');

test('legal texts live on our site, not the old one', () => {
  assert.doesNotMatch(source + forms, /techvill\.ru\/(privacy-policy|personal-data)/);
  assert.match(source, /<a href="\/privacy-policy">/);
  assert.match(source, /<a href="\/personal-data">/);
  assert.match(forms, /talent \? "\/personal-data#resume" : "\/personal-data#application"/);
});

test('policy and all three consents are transferred in full', () => {
  assert.match(privacyPolicy.title, /^Политика конфиденциальности/);
  assert.ok(privacyPolicy.blocks.length > 90);
  assert.equal(privacyPolicy.blocks.filter(([tag]) => tag === 'h2').length, 12);
  assert.deepEqual(consents.map(({ id }) => id), ['application', 'resume', 'marketing']);
  for (const consent of consents) assert.ok(consent.blocks.length >= 8);
  assert.ok(!JSON.stringify(privacyPolicy).includes(' – '));
});
