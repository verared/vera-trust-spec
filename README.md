# Vera Trust Spec (`@verared/spec`)

Normative specifications, versioned JSON schemas, and cryptographic test vectors for the **Vera Trust Stack** — published under **Creative Commons Attribution 4.0 International (`CC-BY-4.0`)**.

- **Author:** Gerardo Loyola
- **License:** [CC BY 4.0](./LICENSE) (reimplementation, translation, and commercial use are permitted with attribution; no registration or certification is required)
- **Package:** `@verared/spec` (`0.1.0-draft.1`, draft snapshot — not yet an S4/S6 final normative release)
- **Roadmap:** [Standardization and adoption milestones](./ROADMAP.md)
- **Vision:** [Portable identity, evidence and independent verification](./VISION.md)

## What this repo is / What this repo is not

- **Is:** The specification, versioned schemas, test vectors, and conformance evidence for the Vera Trust Stack.
- **Is not:** A runtime, a hosted trust authority, or a requirement to use any particular implementation.

### Ecosystem and licenses

The three `geroiloyola/portaless*` repositories are listed only as a non-normative reference ecosystem. Portaless is the first consumer; neither Verared repository depends on or is coupled to these three repositories.

| Repository | License | Responsibility |
|---|---|---|
| [`verared/vera-trust-spec`](https://github.com/verared/vera-trust-spec) | CC BY 4.0 | Specification, schemas, and test vectors |
| [`verared/vera-trust-stack`](https://github.com/verared/vera-trust-stack) | Apache-2.0 | TypeScript reference implementation |
| [`geroiloyola/portaless-plugin-sdk`](https://github.com/geroiloyola/portaless-plugin-sdk) | MIT | Public contract for plugin authors |
| [`geroiloyola/portaless-templates`](https://github.com/geroiloyola/portaless-templates) | CC0-1.0 | Reusable templates |
| [`geroiloyola/portaless`](https://github.com/geroiloyola/portaless) | AGPL-3.0-or-later | Host application and its integrations |

---

## Pillars of the Vera Trust Stack

The **Vera Trust Stack** separates identity, evidence, local policy evaluation, and verifiable history into four distinct protocol layers:

1. **APW (Authenticated Portable Web)** — Cryptographic site/entity identity (`did:apw`), DNS-anchored key history, signed state artifacts, and witness statements.
2. **Local Trust Protocol** — Decentralized evidence acquisition, proof packaging, and local policy evaluation: **each node applies its own policy to verified evidence** (no global authority, no centralized trust oracle).
3. **SVRI (Site Verifiable Reputation Index)** — Consumable output vector derived from verified evidence tiers and inference flags, with qualitative public projections.
4. **HSVR (Historical Site Verifiable Record)** — Verifiable historical record of trust/reputation state transitions.

> **Naming continuity:** This specification repository is the canonical continuation of `ltp-specification-assets` previously maintained under `docs/protocol-apw/` in [`geroiloyola/portaless`](https://github.com/geroiloyola/portaless). All wire identifiers, URN namespaces (`urn:ltp:schemas:0.1:*`), signed byte formats, G1 corpus digests, and author/reviewer records are preserved byte-for-byte without modification.

---

## What an implementer can verify

Start from a domain's APW TXT record, resolve its identity document and key history, and verify a signed artifact against the applicable key window. External witnesses can let an independent verifier compare observations and detect disagreement. A Witness Index helps discover those observations; inclusion does not prove an identity or attest to the truth of a claim.

Local Trust Protocol defines how evidence is used under local policy. SVRI describes the derived projection, including the role of evidence tiers and the share due to inference; HSVR describes verifiable reconstruction of that projection over time. A `community attester` contributes signed, attributable evidence, subject to the applicable eligibility and deduplication rules. A signature establishes provenance, and an aggregate is not a resource grant.

Use the [Starter Kit](./spec/STARTER-KIT.md) and vectors for independent verification, the [architecture](./spec/LTP-STACK-ARCHITECTURE.md) to understand the layers, and the [errata](./spec/ERRATA.md) when following the frozen text. The [Vera Trust Stack implementation](https://github.com/verared/vera-trust-stack) provides a reference for comparison. Passing its fixtures is not independent conformance or evidence of a live network; the [roadmap](./ROADMAP.md) distinguishes those milestones.

## Canonical reading guide

1. **Foundational architecture:** Start with [Vera Trust Stack architecture](./spec/LTP-STACK-ARCHITECTURE.md), the original architecture document in this snapshot. The [resolution chain proposal](./architecture/resolution-chain-proposal.md) and [runtime integration proposal](./architecture/ltp-runtime-integration-proposal.md) are historical design context.
2. **Frozen specification (`v0.1.0-draft.1`):** See the [approval record and its 18 pinned files](./spec/LTP-APPROVAL-RECORD.md#candidate-tuple), [v0.1 schemas](./spec/schemas/v0.1/) and [test vectors](./spec/vectors/). G1 approval does not constitute a final normative release or deployment authorization.
3. **Implementation and adoption:** Follow the [APW Starter Kit](./spec/STARTER-KIT.md). [Vera Trust Stack](https://github.com/verared/vera-trust-stack) is the separate TypeScript reference implementation; the specification and vectors do not depend on it.
4. **Errata and provenance:** Read the [errata and historical link notes](./spec/ERRATA.md#editorial-notes-for-the-frozen-snapshot). Frozen files retain their original text and paths to preserve byte-level commitments. Earlier APW editions, the extraction plan and the architecture proposals retain source-repository references as historical context.

## Specification map

The verbatim, byte-identical normative snapshot lives under [`spec/`](./spec/) so that all 18 SHA-256 commitments in [`spec/LTP-APPROVAL-RECORD.md`](./spec/LTP-APPROVAL-RECORD.md) — including the original [`spec/README.md`](./spec/README.md) — verify unchanged:

| Path | Contents |
|---|---|
| [`spec/APW-SPEC-v1.3.md`](./spec/APW-SPEC-v1.3.md) | Consolidated normative APW v1.3 specification (English canonical) |
| [`spec/ERRATA.md`](./spec/ERRATA.md) | Errata record (`E-11..E-16` normative supplements in effect) |
| [`spec/SVRI-v1.0.md`](./spec/SVRI-v1.0.md) | Normative SVRI v1.0 / HSVR supplement (`E-16`) |
| [`spec/APW-IDENTITY-BOOTSTRAP-DRAFT-v0.1.md`](./spec/APW-IDENTITY-BOOTSTRAP-DRAFT-v0.1.md) | APW Identity Bootstrap Draft 0.1 |
| [`spec/LTP-SERIALIZATION-DRAFT-v0.1.md`](./spec/LTP-SERIALIZATION-DRAFT-v0.1.md) | S1 canonical serialization, JCS rules, and schema contracts |
| [`spec/LTP-INDEX-DRAFT-v0.1.md`](./spec/LTP-INDEX-DRAFT-v0.1.md) | Witness Index Draft 0.1 |
| [`spec/LTP-PROOF-PACKAGE-DRAFT-v0.1.md`](./spec/LTP-PROOF-PACKAGE-DRAFT-v0.1.md) | Proof Package Draft 0.1 |
| [`spec/LTP-GATES-AND-AUTHORIZATIONS.md`](./spec/LTP-GATES-AND-AUTHORIZATIONS.md) | Canonical G1–G5 authorization register |
| [`spec/LTP-APPROVAL-RECORD.md`](./spec/LTP-APPROVAL-RECORD.md) | Accepted G1 static corpus & 18-file SHA-256 approval record (`wNQ9gG2BPs8JO1wPsiPgoz265juDT-TCjuGMbTzSYXA`) |
| [`spec/STARTER-KIT.md`](./spec/STARTER-KIT.md) | Language-agnostic implementer starter kit |
| [`spec/schemas/v0.1/`](./spec/schemas/v0.1/) | Versioned JSON Schemas and JCS manifest (`2-OWDPkYHe3A_DYyUbSsE5t1jFRyNxNM6DnVml-Tp7w`) |
| [`spec/vectors/`](./spec/vectors/) | Immutable APW v1.3, SVRI v1.0, and Local Trust (`v0.1`, `v0.2`, `v0.3`, `reputation/v0.1`) test corpora |
| [`spec/tools/`](./spec/tools/) | Standalone authoring and cross-check tools (isolated lockfile in `spec/package-lock.json`) |
| [`scripts/verify-spec.mjs`](./scripts/verify-spec.mjs) | Zero-dependency Node 24 cryptographic integrity verifier run in CI |

---

## Verification

Run the zero-dependency integrity verifier (checks all 18/18 SHA-256 file hashes, all JSON schemas/vectors, RFC 8785 JCS bundle/corpus digests, Markdown links, runtime-code boundary, and CC BY 4.0 license metadata):

```bash
node scripts/verify-spec.mjs
```

Run the standalone cross-check test suite under `spec/`:

```bash
npm ci --prefix spec --ignore-scripts
npm --prefix spec test
```

---

## Reference Implementation Notice

Any mention of **Portaless** (`geroiloyola/portaless`) or historical repository paths inside the frozen G1 documents under `spec/` refers **solely to the reference implementation** and historical provenance. This specification repository has zero runtime code dependencies on Portaless or any other implementation.

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for DCO (`Signed-off-by`) and immutability rules.
