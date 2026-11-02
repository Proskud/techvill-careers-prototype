import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/AiPage.jsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../src/ai.css', import.meta.url), 'utf8');

test('AI page has no «Как мы создаём AI-решения» blog block', () => {
  assert.doesNotMatch(source, /ai-blog|aiArticles|Материал готовится|Как мы создаём AI-решения/);
  assert.doesNotMatch(styles, /\.ai-blog/);
});

test('AI directions stack the heading and description', () => {
  assert.match(styles, /\.ai-directions > \.ai-section-heading \{[^}]*flex-direction: column;[^}]*align-items: flex-start;[^}]*gap: 16px;/);
  assert.match(styles, /\.ai-directions > \.ai-section-heading > p \{[^}]*max-inline-size: min\(100%, 680px\);/);
  assert.match(source, /<Accordion value=\{expanded\} onValueChange=\{onValueChange\} className=\{`ai-directions-grid disclosure-grid/);
  // Escape, outside press and hover/focus opening live in the shared disclosure hook.
  assert.match(source, /useHoverDisclosure\(\)/);
});
