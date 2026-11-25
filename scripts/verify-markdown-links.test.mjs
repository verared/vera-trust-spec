// CC BY 4.0.
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { checkMarkdownLinks } from './verify-markdown-links.mjs';

test('only the specified missing link from pinned prose is exempt', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'verify-spec-links-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, 'spec'));
  const frozen = join(root, 'spec', 'README.md');
  const editable = join(root, 'spec', 'guide.md');
  const index = join(root, 'README.md');
  writeFileSync(frozen, '[original](../api/)\n[new missing source](../not-listed/)');
  writeFileSync(editable, '[same missing link](../api/)\n[valid](../README.md#second)\n[invalid](../README.md#third)\n ~~~md\n[code](never-checked.md)\n ~~~');
  writeFileSync(index, '# First\n<a id="second"></a>');
  const failures = [];
  assert.deepEqual(checkMarkdownLinks(root, [frozen, editable, index], new Set(['spec/README.md']), (error) => failures.push(error)), {
    checked: 1, historical: 1, broken: 3,
  });
  assert.match(failures[0], /spec\/README\.md:2: \.\.\/not-listed\//);
  assert.match(failures[1], /spec\/guide\.md:1: \.\.\/api\//);
  assert.match(failures[2], /Missing Markdown anchor.*#third/);
});
