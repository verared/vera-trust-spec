#!/usr/bin/env node
// CC BY 4.0. Zero-dependency cryptographic & boundary verifier for verared/vera-trust-spec.
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkMarkdownLinks } from './verify-markdown-links.mjs';

const repoRoot = fileURLToPath(new URL('../', import.meta.url));
const specRoot = resolve(repoRoot, 'spec');
const EXPECTED_G1_DIGEST = 'wNQ9gG2BPs8JO1wPsiPgoz265juDT-TCjuGMbTzSYXA';
const EXPECTED_HISTORICAL_ANCHOR = '#6-reputation-based-read-governance--loyal-trust-protocol-v12--e-8-e-9';

const failures = [];
const frozenProse = new Set();
function fail(msg) {
  failures.push(msg);
}

/**
 * Pure-Node RFC 8785 (JCS) serializer for JSON values.
 * ECMAScript JSON.stringify already implements ES2015 Number.prototype.toString
 * (RFC 8785 §3.2.2.3) and UTF-16 code-unit sorting matches JS default sort().
 */
function jcsCanonicalize(value) {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return '[' + value.map((item) => (item === undefined ? 'null' : jcsCanonicalize(item))).join(',') + ']';
  }
  const keys = Object.keys(value).sort();
  const entries = [];
  for (const key of keys) {
    if (value[key] === undefined) continue;
    entries.push(`${JSON.stringify(key)}:${jcsCanonicalize(value[key])}`);
  }
  return '{' + entries.join(',') + '}';
}

function sha256Hex(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

function sha256JcsBase64Url(filePath) {
  const parsed = JSON.parse(readFileSync(filePath, 'utf8'));
  const canonical = jcsCanonicalize(parsed);
  return createHash('sha256').update(Buffer.from(canonical, 'utf8')).digest('base64url');
}

function walkFiles(dir, predicate, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', '.venv', '__pycache__'].includes(entry.name)) continue;
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(full, predicate, out);
    } else if (predicate(full, entry.name)) {
      out.push(full);
    }
  }
  return out;
}

// 1. Verify 18/18 SHA-256 hashes in spec/LTP-APPROVAL-RECORD.md
const approvalRecordPath = resolve(specRoot, 'LTP-APPROVAL-RECORD.md');
if (!existsSync(approvalRecordPath)) {
  fail('Missing spec/LTP-APPROVAL-RECORD.md');
} else {
  const approvalMd = readFileSync(approvalRecordPath, 'utf8');
  const match = approvalMd.match(/```json\n([\s\S]*?)\n```/);
  if (!match) {
    fail('spec/LTP-APPROVAL-RECORD.md missing JSON candidate tuple');
  } else {
    const record = JSON.parse(match[1]);
    const entries = Object.entries(record.normativeFiles || {});
    for (const [path] of entries) frozenProse.add(`spec/${path}`);
    if (entries.length !== 18) {
      fail(`Expected 18 normativeFiles in LTP-APPROVAL-RECORD.md, found ${entries.length}`);
    }
    let shaOk = 0;
    for (const [relPath, expectedHash] of entries) {
      const target = resolve(specRoot, relPath);
      if (!existsSync(target)) {
        fail(`Missing pinned normative file: spec/${relPath}`);
        continue;
      }
      const actualHash = sha256Hex(readFileSync(target));
      if (actualHash !== expectedHash) {
        fail(`SHA-256 mismatch for spec/${relPath}: expected ${expectedHash}, got ${actualHash}`);
      } else {
        shaOk++;
      }
    }
    console.log(`[verify-spec] SHA-256 pinned files: ${shaOk}/${entries.length} OK`);

    // 2. Verify all JSON files in spec/schemas/ and spec/vectors/ + JCS digests
    const jsonFiles = [
      ...walkFiles(resolve(specRoot, 'schemas'), (_, name) => name.endsWith('.json')),
      ...walkFiles(resolve(specRoot, 'vectors'), (_, name) => name.endsWith('.json')),
    ];
    let jsonOk = 0;
    for (const jf of jsonFiles) {
      try {
        JSON.parse(readFileSync(jf, 'utf8'));
        jsonOk++;
      } catch (err) {
        fail(`Invalid JSON in ${relative(repoRoot, jf)}: ${err.message}`);
      }
    }
    console.log(`[verify-spec] JSON files parsed: ${jsonOk}/${jsonFiles.length} OK`);

    const jcsChecks = [
      ['schemaBundleDigest', 'schemas/v0.1/manifest.json', record.schemaBundleDigest],
      ['originalCorpusDigest', 'vectors/ltp/v0.1/manifest.json', record.originalCorpusDigest],
      ['previousCorpusDigest', 'vectors/ltp/v0.2/manifest.json', record.previousCorpusDigest],
      ['corpusDigest (G1)', 'vectors/ltp/v0.3/manifest.json', record.corpusDigest],
      ['numericExtensionDigest', 'vectors/ltp/v0.1/numeric-serialization.json', record.numericExtensionDigest],
    ];
    let matched = 0;
    for (const [label, relPath, expected] of jcsChecks) {
      const actual = sha256JcsBase64Url(resolve(specRoot, relPath));
      if (actual !== expected) {
        fail(`JCS digest mismatch for ${label} (spec/${relPath}): expected ${expected}, got ${actual}`);
      } else matched++;
    }
    if (record.corpusDigest !== EXPECTED_G1_DIGEST || record.ownerDecision?.corpusDigest !== EXPECTED_G1_DIGEST) {
      fail(`G1 corpusDigest mismatch: expected ${EXPECTED_G1_DIGEST}`);
    }
    if (record.ownerDecision?.reviewer !== 'linstarkcorp') {
      fail('Reviewer record (linstarkcorp) missing or modified in LTP-APPROVAL-RECORD.md');
    }
    console.log(`[verify-spec] JCS digests: ${matched}/${jcsChecks.length}; expected G1: ${EXPECTED_G1_DIGEST}`);
  }
}

// Verify preserved Level A anchor and author attribution in APW-SPEC-v1.3.md
const apwSpecPath = resolve(specRoot, 'APW-SPEC-v1.3.md');
if (existsSync(apwSpecPath)) {
  const apwSpec = readFileSync(apwSpecPath, 'utf8');
  if (!apwSpec.includes('Gerardo Loyola')) {
    fail('Author attribution (Gerardo Loyola) missing in spec/APW-SPEC-v1.3.md');
  }
  if (!apwSpec.includes(`id="${EXPECTED_HISTORICAL_ANCHOR.slice(1)}"`)) {
    fail(`Historical anchor ${EXPECTED_HISTORICAL_ANCHOR} missing in spec/APW-SPEC-v1.3.md`);
  }
} else {
  fail('Missing spec/APW-SPEC-v1.3.md');
}

// 3. Verify local Markdown links and zero imports to Portaless code
const links = checkMarkdownLinks(repoRoot, walkFiles(repoRoot, (_, name) => name.endsWith('.md')), frozenProse, fail);
console.log(`[verify-spec] Markdown local links: ${links.checked} valid, ${links.historical} explicit frozen exceptions, ${links.broken} broken.`);

// Check code/tool files for zero imports to Portaless runtime code
const codeFiles = walkFiles(repoRoot, (_, name) => /\.(?:mjs|js|cjs|ts|py)$/.test(name));
const importRe = /(?:from\s+['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)|require\s*\(\s*['"]([^'"]+)['"]\s*\))/g;
for (const cf of codeFiles) {
  const rel = relative(repoRoot, cf).replaceAll('\\', '/');
  if (rel === 'scripts/verify-spec.mjs' || rel === 'spec/tools/assets.test.mjs') continue;
  const content = readFileSync(cf, 'utf8');
  for (const m of content.matchAll(importRe)) {
    const spec = m[1] || m[2] || m[3] || '';
    if (spec.startsWith('@portaless/') || /(?:^|\/)(?:packages|functions|src|server)\//.test(spec)) {
      fail(`Forbidden Portaless code import in ${rel}: ${spec}`);
    }
  }
}
console.log(`[verify-spec] Code files scanned for Portaless imports: ${codeFiles.length} OK`);

// 4. Verify CC-BY-4.0 license metadata and LICENSE file
const rootPkg = JSON.parse(readFileSync(resolve(repoRoot, 'package.json'), 'utf8'));
if (rootPkg.name !== '@verared/spec') {
  fail(`Expected root package.json name "@verared/spec", got "${rootPkg.name}"`);
}
if (rootPkg.license !== 'CC-BY-4.0') {
  fail(`Expected root package.json license "CC-BY-4.0", got "${rootPkg.license}"`);
}
const specPkg = JSON.parse(readFileSync(resolve(specRoot, 'package.json'), 'utf8'));
if (specPkg.license !== 'CC-BY-4.0') {
  fail(`Expected spec/package.json license "CC-BY-4.0", got "${specPkg.license}"`);
}
const licensePath = resolve(repoRoot, 'LICENSE');
if (!existsSync(licensePath)) {
  fail('Missing root LICENSE file');
} else {
  const licenseText = readFileSync(licensePath, 'utf8');
  if (!licenseText.includes('Attribution 4.0 International')) {
    fail('Root LICENSE does not contain Creative Commons Attribution 4.0 International text');
  }
}
console.log('[verify-spec] License CC-BY-4.0 & LICENSE file: OK');

if (failures.length > 0) {
  console.error(`\n[verify-spec] FAILED (${failures.length} issue(s)):`);
  for (const f of failures) {
    console.error(`  - ${f}`);
  }
  process.exit(1);
}

console.log('\n[verify-spec] ALL CHECKS PASSED.');
