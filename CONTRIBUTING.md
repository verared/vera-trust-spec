# Contributing to `verared/vera-trust-spec`

Thank you for contributing to the **Vera Trust Stack** specifications.

## License and Developer Certificate of Origin (DCO)

- All specification documents, errata, schemas, and test vectors in this repository are published under **Creative Commons Attribution 4.0 International (`CC-BY-4.0`)** — see [`LICENSE`](./LICENSE).
- Every commit must include a Developer Certificate of Origin (`Signed-off-by`) trailer confirming you have the right to submit the contribution under the repository license (`https://developercertificate.org/`):

```bash
git commit -s -m "docs(spec): describe your change"
```

## Immutability Guardrails

Before editing any file under [`spec/`](./spec/):

1. **Level A identifiers and wire formats are frozen.** Do not rename `did:apw`, `_apw.`, `pAPW`, `apw-*+jws`, `ltp-*-v1`, `urn:ltp:schemas:0.1:*`, `W-01..W-09`, `R-01..R-05`, `T1..T5`, `E-10..E-16`, or historical anchors.
2. **G1-pinned files and digests are immutable without a new recorded owner decision.** The 18 files listed in [`spec/LTP-APPROVAL-RECORD.md`](./spec/LTP-APPROVAL-RECORD.md), the `spec/schemas/v0.1/` bundle, and the `spec/vectors/` corpora are verified byte-for-byte and by RFC 8785 (JCS) SHA-256 digests in CI.
3. **Zero runtime code dependencies.** Specification assets must never import or depend on runtime code from Portaless or any other implementation. References to implementations belong only in clearly marked reference-implementation appendices.
4. **Preserve attribution and review records.** Author attribution (`Gerardo Loyola`), Annex A, and external review records (`linstarkcorp`) must remain intact.

## Local Verification

Run the zero-dependency cryptographic verifier before opening a pull request:

```bash
node scripts/verify-spec.mjs
```

To also run the standalone schema/vector cross-check suite under `spec/`:

```bash
npm ci --prefix spec --ignore-scripts
npm --prefix spec test
npm --prefix spec run audit
npm --prefix spec run audit:core
npm --prefix spec run audit:ab
```
