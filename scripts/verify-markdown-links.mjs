// CC BY 4.0. Local Markdown navigation checks for the specification tree.
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve } from 'node:path';

// Entries correspond to the editorial table in spec/ERRATA.md. No blanket skip
// for links outside spec/, archived files, or new links in pinned documents.
const frozenExceptions = new Map([
  ['spec/APW-SPEC-v1.3.md', ['../../LICENSE', '../architecture/licensing-boundaries.md']],
  ['spec/LTP-CI-REVIEW.md', ['../../.github/workflows/unit-tests.yml', '../../.github/workflows/full-tests.yml', '../../.github/workflows/ci.yml']],
  ['spec/README.md', ['../api/', '../../ROADMAP.md']],
]);

function proseLines(text) {
  let fence;
  return text.split(/\r?\n/).map((line) => {
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (fence) {
      if (marker && marker[1][0] === fence[0] && marker[1].length >= fence.length && !marker[2].trim()) fence = undefined;
      return '';
    }
    if (marker) {
      fence = marker[1];
      return '';
    }
    return line;
  });
}

function markdownAnchors(lines) {
  const anchors = new Set();
  const headings = new Set();
  for (const [i, line] of lines.entries()) {
    for (const attr of line.matchAll(/<(?:a|[a-z][\w-]*)\b[^>]*?\s(?:id|name)=["']([^"']+)["']/gi)) anchors.add(attr[1]);
    const heading = line.match(/^ {0,3}#{1,6}\s+(.+?)(?:\s+#+)?\s*$/)?.[1]
      ?? (line.trim() && /^ {0,3}(?:=+|-+)\s*$/.test(lines[i + 1] ?? '') ? line : '');
    if (!heading) continue;
    const slug = heading.trim().toLowerCase().replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, '').replaceAll(' ', '-');
    let id = slug;
    for (let n = 1; headings.has(id); n++) id = `${slug}-${n}`;
    headings.add(id);
    anchors.add(id);
  }
  return anchors;
}

export function checkMarkdownLinks(root, files, frozenProse, fail) {
  root = realpathSync(root);
  const docs = new Map(files.map((file) => {
    const lines = proseLines(readFileSync(file, 'utf8'));
    return [realpathSync(file), { lines, anchors: markdownAnchors(lines) }];
  }));
  const inside = (path) => {
    const rel = relative(root, path);
    return !isAbsolute(rel) && rel !== '..' && !rel.startsWith('../');
  };
  const counts = { checked: 0, historical: 0, broken: 0 };
  for (const [file, { lines }] of docs) {
    const source = relative(root, file).replaceAll('\\', '/');
    let appendix = false;
    for (const [i, line] of lines.entries()) {
      if (/^#{1,2} /.test(line)) appendix = /^## (?:Apéndice|Appendix).*implementación de referencia/i.test(line);
      // Mask code spans, except inside link labels (where the destination follows them).
      const prose = line.replace(/(`+)(.*?)\1/g, (span) => ' '.repeat(span.length));
      const links = [
        ...prose.matchAll(/\]\(\s*(?:<([^>]+)>|([^\s)]+))/g),
        ...prose.matchAll(/^\s*\[[^\]]+\]:\s*(?:<([^>]+)>|([^\s]+))/g),
        ...prose.matchAll(/<[^>]+?\s(?:href|src)=["']([^"']+)["']/gi),
      ];
      for (const [, a, b] of links) {
        const raw = a ?? b;
        if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(raw)) continue;
        let problem;
        try {
          const [location, fragment] = raw.split(/#(.*)/s);
          const path = decodeURIComponent(location.split('?')[0]);
          const target = path ? resolve(dirname(file), path) : file;
          if (!appendix && /(?:^|\/)(?:functions|packages|src|server)\//i.test(path.replaceAll('\\', '/'))) {
            problem = 'Runtime code link outside reference-implementation appendix';
          } else if (!inside(target) || !existsSync(target) || !inside(realpathSync(target))) {
            if (frozenProse.has(source) && frozenExceptions.get(source)?.includes(raw)) {
              counts.historical++;
              continue;
            }
            problem = 'Missing or out-of-repository destination';
          } else if (fragment && docs.has(realpathSync(target)) && !docs.get(realpathSync(target)).anchors.has(decodeURIComponent(fragment))) {
            problem = 'Missing Markdown anchor';
          }
        } catch {
          problem = 'Malformed or unreadable destination';
        }
        if (problem) {
          counts.broken++;
          fail(`${problem} in ${source}:${i + 1}: ${raw}`);
        } else {
          counts.checked++;
        }
      }
    }
  }
  return counts;
}
