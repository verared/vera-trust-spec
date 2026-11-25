# Vera Trust Spec roadmap

The [vision](./VISION.md) sets direction. This roadmap records what has shipped and what evidence is still needed. Start with the [canonical reading guide](./README.md#canonical-reading-guide). The [standardization status](./spec/LTP-STANDARDIZATION-STATUS.md) and [authorization register](./spec/LTP-GATES-AND-AUTHORIZATIONS.md) govern the work; this roadmap grants no authorization.

## Delivered and preserved

| Milestone | Evidence and limits |
|---|---|
| APW identity and history | The [canonical APW v1.3 text](./spec/APW-SPEC-v1.3.md) consolidates the original design, DNS-anchored `did:apw`, key history, signed artifacts, and Local Trust Protocol read governance. Witness statements carry a deterministic `jti` and can be checked against the witness's own history. The [errata](./spec/ERRATA.md) preserve the distinction between normative changes and implementation notes. |
| Witness Index and federated query | E-12 records calibration and peer synchronization in the reference implementation: peer data proposes candidates, and each node re-verifies the evidence. Section 7.1 and V-16 define reproducible ranking with explicit windows and tie-breaks; E-14 defines signed page discovery. These fixtures and mechanisms do not establish independent peers or a public federation. |
| Attributable community evidence | E-13 and V-14/V-15 describe the signed `community attester`, distinct issuers, minimum evidence weight, history age and deduplication. Public aggregates and governed text remain separate. Unsigned opinions are not scoring evidence; static keys in fixtures are not independent emitters. |
| Extensions and projections | E-15 defines the publisher-signed manifest and capability contract, without granting capabilities by installation. E-16 defines SVRI evidence tiers, effective weight and inference, and HSVR reconstruction with explicit gaps. Reader conduct is separate from site scores. |
| Implementer entry point and executable vectors | The [Starter Kit](./spec/STARTER-KIT.md) gives a language-independent path from fingerprint and DNS TXT to history, signatures and scoring. Human-readable vectors and [machine-readable fixtures](./spec/vectors/v1.3/) remain independent of code. V-06 is still missing from the executable minimal set; the manifest also records the remaining non-machine-readable cases. Numeric comparisons follow the documented tolerances rather than treating a printed decimal as exact binary64. |
| Local Trust Protocol draft contracts | The frozen serialization draft, Witness Index and proof-package documents define data and role boundaries. The [v0.2 core corpus](./spec/vectors/ltp/v0.2/README.md) covers 285 targets across CORE-01…06; the [v0.3 composed corpus](./spec/vectors/ltp/v0.3/README.md) preserves it and adds AB-STATIC-01…07 for 369 total targets. These are corpus versions inside the frozen draft. The separately reviewed reputation corpus contains 117 audited cases. |
| Standalone draft and navigation | [v0.1.0-draft.1](https://github.com/verared/vera-trust-spec/releases/tag/v0.1.0-draft.1) is `7787966`. The [approval record](./spec/LTP-APPROVAL-RECORD.md) binds 18 file-byte SHA-256 hashes and the static G1 scope. [`verify-spec.mjs`](./scripts/verify-spec.mjs) parses 96 JSON files and checks five JCS digests (schema, original/previous/current corpora and numeric extension), including G1 `wNQ9gG2BPs8JO1wPsiPgoz265juDT-TCjuGMbTzSYXA`. The canonical guide and explicit historical link exceptions keep the frozen tree navigable without changing it. |

**Gate history:** G1 accepted the named static corpus and closes S1/S3-core for that scope. G2 accepted bounded Node acquisition with configured transport and shared limits; G3 accepted the deterministic identity-only verifier. G4 authorized the engine against reviewed reputation cases, with real emitters, signed profiles, activation and S4 outside that authorization. G5 is pending an explicit decision. The five digests are artifact checks, not approval of five gates.

## Toward v0.1.0

| Milestone | Evidence needed |
|---|---|
| S4 — Independent verification | Record a separate implementation and verifier, identifying the implementer, language, backend, corpus revision, and observed results. Passing the reference stack's tests does not satisfy this milestone. |
| Second operator — Operational interoperability | Record interoperation with a second independently operated deployment. Treat this evidence separately from S4's independent verification results. |
| S6 — Normative publication | Close the publication prerequisites in the standardization status before declaring a final normative release. Preserve the frozen draft and record any new commitments separately. |
| S2 and S5 — Accounting and acceptance evidence | Close remaining budget-accounting and security/resource/privacy evidence at the approved scope. Record acquisition separately from deterministic verification; separate fixture results from real adapter or deployment acceptance. |
| G5 — Advanced offline DNSSEC | Record the agreed scope, reviewed verifier evidence, and explicit authorization before claiming conformance or enabling this path. |
| R-05 — Activation evidence | Reader calibration requires attributable statements the reader **emits**, not just `reader_conduct` statements it receives, and comparable evidence from independent emitters. A prior with zero effective weight is not observed reputation. Record the evidence and acceptance criteria before activation; see the [reputation review](./spec/LTP-G4-REPUTATION-PREAUTHORIZATION-REVIEW.md). |
| B3 / ADR 0003 — Unsigned automated readers | Record the policy decision and cases for public and governed resources, including absent versus invalid signatures and `allow`/`block`/`charge`. The [historical integration proposal](./architecture/ltp-runtime-integration-proposal.md#6-b3-behavior-and-migration) records the existing rejection and possible public-route exception. No identity, reputation, or billing can be inferred for an unsigned read. |
| Adoption and federation | Seek an outside implementation publishing a valid DNS TXT identity, record it in an independently operated Witness Index, and demonstrate that independent operators reproduce ordering from the same signed evidence. Record unclear requirements with spec section, revision and vector ID through [spec issues](https://github.com/verared/vera-trust-spec/issues). A maintainer-assisted trial is not this exit criterion. |

## v0.2+ candidates

- Consider optional `did:web` publication only after specifying subject binding to the DNS-anchored `did:apw` log. Sharing a key is insufficient to assume equivalence.
- Specify opt-in provider interfaces for external anchors or timestamp proofs only after defining trust, verification, failure and revision semantics. Include independent positive and negative vectors; preserve the v0.1 profile unchanged.

Runtime support, package tooling, and adapters belong in the [Vera Trust Stack roadmap](https://github.com/verared/vera-trust-stack/blob/main/ROADMAP.md).

_Editorial provenance: the [source roadmap](https://github.com/geroiloyola/portaless/blob/main/ROADMAP.md), especially phases 4–5, 7–9, the signed-manifest portion of phase 11, and adoption and B3 decisions._
