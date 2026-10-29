import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

test('Story portraits match the 29 October replacement crops, including transparent cutouts', () => {
  for (const [name, digest] of [
    ['care-person', '0d7df9d41034abb7fa3d8ad8fc46ef107d4bc9db814ab0dab94a7650388ca0c4'],
    ['mind-person', '2db632dd6a75199a45d623dc85fd800a41553c6f4445c8998d448a3524178be6'],
  ]) {
    const asset = readFileSync(new URL(`../public/assets/stories/${name}.webp`, import.meta.url));
    assert.equal(createHash('sha256').update(asset).digest('hex'), digest);
  }
});

test('Decorative portraits do not replace article names or add card navigation', () => {
  const source = readFileSync(new URL('../src/Prototype.jsx', import.meta.url), 'utf8');
  const cards = source.slice(source.indexOf('function TechnologyStories()'), source.indexOf('function People()'));
  assert.equal((cards.match(/alt="" width="768" height="740" loading="lazy"/g) || []).length, 2);
  assert.doesNotMatch(cards, /onClick|tabIndex|role="button"/);
  assert.equal((cards.match(/aria-labelledby="people-/g) || []).length, 2);
});

test('Portrait motion cannot activate when reduced motion is requested', () => {
  const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
  assert.match(css, /@media \(hover: hover\) and \(pointer: fine\) and \(prefers-reduced-motion: no-preference\) \{\s*\.people-story:hover/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{\s*\.people-story \.people-story-portrait img \{ transition: none; transform: none;/);
});

test('Portraits sit on the card edge and the scroll reveal hands transforms back to CSS hover', () => {
  const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
  const source = readFileSync(new URL('../src/Prototype.jsx', import.meta.url), 'utf8');
  assert.match(css, /\.people-story-portrait \{[^}]*margin-block-end: calc\(-1 \* var\(--story-pad\)\)/);
  assert.match(css, /\.people-story \{[^}]*overflow: hidden/);
  assert.match(css, /\.people-story \{[^}]*grid-template-areas: "title title" "copy portrait"/);
  assert.match(css, /@container stories \(max-width: 1080px\) \{[\s\S]*?grid-template-areas: "title" "copy" "portrait"/);
  assert.doesNotMatch(css, /\.people-story-portrait \{[^}]*order:/);
  const cards = source.slice(source.indexOf('function TechnologyStories()'), source.indexOf('function People()'));
  assert.ok(cards.indexOf('people-story-copy') < cards.indexOf('people-story-portrait'));
  assert.ok(source.includes('className="people-story is-care"'));
  const reveal = source.slice(source.indexOf('gsap.utils.toArray(".people-story")'), source.indexOf('gsap.utils.toArray("[data-parallax]")'));
  assert.equal((reveal.match(/clearProps: "opacity,transform/g) || []).length, 3);
  assert.match(reveal, /once: true/);
});
