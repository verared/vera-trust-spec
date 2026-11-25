# Vera Trust Spec roadmap

> **STATE lives here; DIRECTION lives in [VISION.md](./VISION.md).** This roadmap records what is demonstrably available, what is still missing, and who must supply the evidence. The vision defines `NOW`, `ENABLE`, `GATED` and `OUT OF CORE`; every gated entry names the evidence that would move it. The [standardization record](./spec/LTP-STANDARDIZATION-STATUS.md) and [authorization register](./spec/LTP-GATES-AND-AUTHORIZATIONS.md) govern scope and approval. This roadmap does not supersede either.

**Legend:** `[x]` shipped and verifiable by commit or tag · `[~]` implemented, awaiting an external real-world step · `[ ]` pending.

| Owner | Tracks |
|---|---|
| `verared/vera-trust-spec` | Protocol, errata, schema and vector commitments, independent conformance, governance and adoption evidence. |
| [`verared/vera-trust-stack`](https://github.com/verared/vera-trust-stack/blob/main/ROADMAP.md) | Reference packages, runtime and security, Gatekeeper wiring, release and registry evidence. |
| Consumer hosts | Their own product, operations, access decisions and field trials outside Verared. |

## Where the project stands, in one screen

| Area | State | Evidence or open condition |
|---|---|---|
| Frozen APW/SVRI baseline | `[x]` | [Draft `7787966`](#shipped--frozen-normative-baseline): 18 hashes, 96 JSON files, five JCS digests. |
| Witnesses, governed reads and attributable evidence | `[x]` | [APW v1.3 and E-1…E-16](#phase-1--identity-witnesses-and-governed-evidence), including the signed artifact boundaries. |
| Executable conformance | `[~]` | [110/110 across 11 vectors](#phase-2--executable-conformance-and-the-starter-kit); V-06 is still missing from the executable minimum. |
| Composed proofs and static reputation | `[x]` | [285 core and 369 composed targets; 117 reputation cases](#phase-3--core-composition-and-static-reputation). |
| Independent verifier and stable publication | `[ ]` | [S4/S6](#phase-4--independent-implementation-and-stable-publication) need independent verification evidence and a reviewed normative release. |
| Reader calibration and additional conduct signals | `[ ]` | [R-05 and §6.4](#phase-5--reader-conduct-and-portable-reputation) need independent emitters and observable signal inputs. |
| Independent discovery and ranking | `[~]` | [Witness Index and V-16](#phase-6--witness-index-adoption-and-federated-ranking) have fixtures; the operator exit is open. |
| Offline DNSSEC and unsigned reads | `[ ]` | [G5 and B3](#phase-7--offline-dnssec-and-the-public-read-boundary) require separate explicit decisions. |

## Shipped / frozen normative baseline

[`v0.1.0-draft.1`](https://github.com/verared/vera-trust-spec/releases/tag/v0.1.0-draft.1) points to `7787966`. The [approval record](./spec/LTP-APPROVAL-RECORD.md) binds 18 file-byte SHA-256 hashes; [`verify-spec.mjs`](./scripts/verify-spec.mjs) parses 96 JSON files and checks five RFC 8785 JCS digests: schemas, original/previous/current corpora, and numeric extension. The accepted G1 digest is `wNQ9gG2BPs8JO1wPsiPgoz265juDT-TCjuGMbTzSYXA`. A digest identifies an artifact; five matching digests do not mean that five gates were approved.

The [canonical reading guide](./README.md#canonical-reading-guide) leads to the [foundational architecture](./spec/LTP-STACK-ARCHITECTURE.md), frozen contracts, [Starter Kit](./spec/STARTER-KIT.md) and [errata](./spec/ERRATA.md). Historical link exceptions are explicit so navigation fixes do not rewrite the frozen prose, vectors or schemas.

### Phase 1 — Identity, witnesses and governed evidence

**Goal:** make identity and claims verifiable while keeping provenance, disclosure and authorization separate.

**Status:** `[x]` [APW v1.3](./spec/APW-SPEC-v1.3.md) consolidates E-1…E-11; E-12 is informative and E-13…E-16 are normative supplements. The material outcomes are:

- **Identity and signed bytes (E-1…E-5):** the DNS TXT root binds the domain to a key fingerprint and observed history head. Canonical JWS payloads, stable key identifiers and ordered history let verifiers check issuer, subject, key window and continuity without treating a signature as proof of a claim's truth.
- **Scoring and reader evidence (E-6…E-9):** worked calibration examples and dimension rules keep observations separate from the prior. §6.3 permits a non-active reader key only in history verified against `k` and `h`, with at least one anchored entry signed by that key, and within `[validFrom, validTo + 10 min]`; the grace period is a verifier bound, not renewed validity. §6.5's `trust:read-governance-bypass` skips dimension thresholds only: it never bypasses verified reader identity or rescues invalid policy.
- **External witnesses (E-10, §5.7):** an `apw-witness+jws` at `/.well-known/apw-witnesses.json` carries a deterministic `jti` and must be anchored in the witness's own verified chain. Compare `seq` and `head` with the subject's chain: mismatch/truncation yields `head_mismatch`, competing observations at one sequence yield `equivocation`, and a later entry predating the anchored observation beyond the 300-second allowance yields `backdated_entry`. Initial omission is not detectable from a missing observation alone.
- **Public dimensions and governed text (E-11, §6.6 and A.6):** denial retains public W-01, W-04, W-06, W-07 and W-09 and the score/count/weight aggregates for all site dimensions; governed detail stays withheld. An explicit per-dimension `public_overrides` entry can publish a known governed dimension without granting access or changing the policy. Unknown dimensions or attempts to add an already public dimension are invalid; an invalid persisted override does not broaden disclosure.
- **Witness Index (E-12):** calibration uses a Laplace-smoothed agreement rate, effective weight = operator base weight × calibration factor. Observation and effective weight are reproducible; witnesses without an observation at the consensus sequence do not get counted there. Peer synchronization is discovery: the consumer verifies the candidate evidence again. This erratum documents a reference mechanism, not a normative requirement for an index or a network membership claim.
- **Signed community evidence (E-13, V-14/V-15):** an attributable `community attester` signs an integer `val` 1…5; unique emissions are keyed by `(iss, jti)`, and the latest eligible statement per issuer/subject/category counts. A distinct emitter is a distinct verified `did:apw`; its first verified history entry must be at least seven days old relative to the attestation. Unresolvable or younger history contributes no eligible weight. `min_weight: 2.0` is per subject/category, not a filter on all other sources in a dimension. At cold-start `J=4`, `w=((J−1)/6)^2=0.25`, so eight cold-start domains are needed; two fully calibrated emitters at `J=7` can reach 2.0. Agreement and domain age are costs and signals, not proof against collusion. Aggregates remain public; comment text stays governed by A.6. Unsigned legacy opinions never score.
- **Federated pages and ranking (E-14, §7.1/V-16):** `apw-pages+jws` describes signed public pages; the consumer validates each hop and bounds bytes, keeps a cache and sanitizes rendered data. Ordering has explicit windows and a total tie-break; `Top` uses admitted weighted scores, `Confidence` uses consensus at the declared `seq`, and `Recents`, `Old`, `New` and `History` are separately defined. An empty subject is not ranked using a neutral prior.
- **Signed plugin manifests (E-15):** `apw-plugin-manifest+jws` binds the publisher, version, code hash and `requestedCapabilities`. Installation grants nothing by itself. Removed capabilities are pruned; newly requested ones require review, and a published version cannot silently change its bytes or manifest. Host execution and packaging remain outside the protocol.
- **SVRI v1.0 and HSVR (E-16):** `ltp-svri-site-v1` distinguishes T1 transaction/escrow, T2 signed self, T3 community, T4 reader-conduct activity and T5 signed automation. T4 does not add to site W scores. These tiers describe provenance, not weight multipliers; counts deduplicate `(iss, jti)`. Include only measured dimensions in the normalized mean, expose the share of mathematical inference, and mark data incomplete without T1/T2. The public qualitative SVRI level is distinct from restricted numerical SVRI diagnostics and HSVR reconstruction; previously public APW aggregates stay public. HSVR reports incomplete history when the signed evidence cannot be reconstructed.

**Honest limits:** neither a signed declaration nor an inferred score fills missing evidence. A dimension with zero count or effective weight is not observed; use `no_data` for missing reader evidence and the appropriate pending SVRI projection for an incomplete site. The internal mathematical prior may still exist. The Witness Index cannot prevent initial omission, and authorized readers may redistribute content without the origin observing it.

**Exit criterion:** the tagged text, errata and versioned fixtures remain navigable and byte-identical where pinned; independent consumers can identify the applicable key window, evidence and disclosure rule for the recorded cases. This is a draft-snapshot exit, not S4 or S6.

### Phase 2 — Executable conformance and the Starter Kit

**Goal:** give an implementer a language-independent sequence and executable evidence instead of relying on the reference source.

**Status:** `[x]` The Starter Kit explains fingerprints, TXT, DID, chained history, JWS/JCS and scoring. [Human-readable vectors](./spec/APW-VECTORS-v1.3.md) and the [machine-readable manifest](./spec/vectors/v1.3/manifest.json) are independent of code. The recorded reference run grew from 78 cases over eight vectors to 97 across ten after V-14/V-15 and then **110/110 across 11** with V-16. The 110 executable cases break down as follows; prose and other fixture groups are not silently counted as executed:

| Vector | Cases | Subject |
|---|---:|---|
| V-01 | 3 | RFC 7638 fingerprints |
| V-02 | 11 | Key identifier build, parse and rejection |
| V-03 | 13 | APW TXT construction and parsing |
| V-04 | 4 | JCS serialization |
| V-05 | 3 | History hashes |
| V-08 | 31 | Weights, value mappings and scoring primitives |
| V-09 | 6 | Bayesian examples |
| V-12 | 7 | Reader-conduct period keys |
| V-14 | 10 | Emitter history age |
| V-15 | 9 | Distinct emitters and minimum weight |
| V-16 | 13 | Ranking order and input hash |

V-08 records a precision correction: the mathematical decimal `w(6.7)=0.9025` appears as `0.9025000000000001` for the binary64 evaluation of `((6.7−1)/6)^2`, one ULP above the represented `0.9025`. Use the documented tolerance; don't alter committed data to make strict decimal equality pass.

Use [specification issues](https://github.com/verared/vera-trust-spec/issues) as the current `spec_ambiguity` channel: cite the section and revision, identify the ambiguity and your interpretation, name affected vectors, and propose an erratum or version change. This is the workflow, not a claim that a dedicated issue-template file is present in this repository.

**Honest limits:** the minimal set is V-01, V-03, V-05, V-06, V-08, V-09. The reference test explicitly expects **V-06** to be the missing executable minimum: foreign-issuer attestation verification needs the full 12-step issuer/claim validation sequence, separate from the standalone APW vector runner. The extracted stack has an attestation verifier; that does not supply a portable V-06 fixture. V-07 has byte mutation matrices not represented by the fixture format; V-10 needs per-subject attestation inputs for the eight-round leave-one-out calibration; V-11 needs a harness for stored policy, permissions and disclosure rather than just a scalar case; V-13 has a vectorizable `jti` preimage but needs witness/subject histories for the evaluation matrix. E-13 claim validation is separate from V-14/V-15's pure predicate. The historical CLI packaging is not part of the current Verared tarballs.

**Exit criterion:** an outside implementer can run the portable fixture set, including an explicit V-06 case, against their own verifier, and identify which remaining prose matrices still need a harness. Any new normative vectors are versioned without modifying the frozen corpus.

### Phase 3 — Core composition and static reputation

**Goal:** specify reproducible acquisition and offline verification of bounded inputs, then establish what the reputation engine can prove from admitted evidence.

**Status:** `[x]` The [v0.2 core corpus](./spec/vectors/ltp/v0.2/README.md) contains 285 targets across CORE-01…06. The [v0.3 composed corpus](./spec/vectors/ltp/v0.3/README.md) preserves it and adds AB-STATIC-01…07 (369 total targets); the approval record binds the reviewed revision and the G1 digest. These are corpus versions inside the draft, not new protocol releases. G1 closes S1/S3-core in this bounded scope; G2 accepts configured Node acquisition and resource accounting, and G3 accepts deterministic identity-only full-history verification. G4 authorizes the separately audited REP-01…REP-11 engine (117 decision cases), including rejection of duplicate dimensions and differential comparison within documented rounding normalization.

**Honest limits:** reviewed static composition is not an operational verdict, proof of S4 independence, or authorization for deployment. An offline verifier requires an independently authenticated root; forwarded AD is not such a root. G4 does not authorize signed reputation profiles, real-emitter claims or R-05 activation. G5 remains separate.

**Exit criterion:** reproduce the pinned checksums and literal core/reputation cases from the reviewed corpus and record typed outcomes and accounting separately for acquisition and verification. Changes to scope or verified bytes require new evidence and a recorded decision.

## From a draft to a standard and a network

```text
installable package + executable conformance
  → second implementer working from the specification
  → independently emitted reader_conduct and comparable signed evidence
  → computable R-05 with nonzero effective evidence
  → evaluate the §6.7 Sybil defenses against real emitters
  → portable, independently verifiable reputation
```

Each arrow is an evidence requirement. Multiple fixtures, keys, or instances under one operator do not replace an independent implementation or operator.

### Phase 4 — Independent implementation and stable publication

**Goal:** reach S4 and S6 with reproducible evidence, without requiring access to the reference source.

**Status:** `[~]` Starter Kit, schemas and package baselines exist. S4 remains open. Seek an implementer in another language using a different primitive backend. Optional `did:web` Path A stays behind an erratum: keep `_apw.<domain>` as the root and describe how a `did:web` document can point to the already DNS-anchored log. Define when its subject is equivalent to `did:apw:<domain>`, including the key binding and service reference. Until then, shared keys alone do not imply subject equivalence.

**Honest limits:** Node/JOSE, OpenSSL CLI and Python cryptography/dnspython cross-check encoding and structure but share the OpenSSL family. Maintainer-assisted field trials are not independent evidence. A v0.1.0 artifact is not normative merely because its checksum or reference tests pass.

**Exit criterion:** another person publishes verifier identity, revision, language, backend and full results, including negative cases; an independently implemented client verifies a valid `_apw.` identity published on a domain outside the author's control. Close the remaining S2 accounting and S5 security/resource/privacy criteria, then publish a reviewed S6 version with date, stable identifiers, errata, vectors and verification reports. Keep the frozen draft unchanged.

### Phase 5 — Reader conduct and portable reputation

**Goal:** make reader reputation observable without manufacturing positive or negative behavior from incomplete telemetry.

**Status:** `[ ]` R-05 calibrates attestations the reader **emits** (A.4.4); `loadReaderConduct` loads what it **receives**. The neutral prior (4.0 at zero weight) does not meet an evidence threshold. Comparable signed claims from other emitters over the same subject and dimension are required for leave-one-out consensus; the reader's own attestations cannot validate its own calibration. E-9's emission/completeness mechanism and accepted static cases do not create that corpus. §6.4's remaining signals need different inputs:

| Signal | Missing evidence |
|---|---|
| `rate_respected` | A declared per-reader rate in policy, enforced limits and a ledger counter that separates rate rejections from general violations. A request count alone says nothing about the rate agreed. |
| `paid_as_agreed` | A verified settlement outcome correlated to the request/terms. A price quote and out-of-band billing without a receipt visible to the origin are not proof of payment. |
| `redistribution` | Attributable third-party observations or reports with verifiable evidence. The origin cannot infer downstream copying or its absence from its access ledger. |

**Honest limits:** requiring R-05 with a positive minimum before evidence exists denies legitimate readers without establishing misconduct. The history floor and weight threshold make shortcuts costlier; colluding emitters can still agree. E-13's local view describes accepted statements for a site, not the emitter's portable global history.

**Exit criterion:** record at least two independent emitters, verify their signed history and replay/dedup behavior, show both agreeing and disagreeing comparison cases with nonzero eligible weight, and publish reproducible leave-one-out results before activating R-05. Each new signal needs provenance, a corroborated positive case and missing/unverifiable-input tests that preserve `no_data`.

### Phase 6 — Witness Index adoption and federated ranking

**Goal:** make verifiable observations discoverable without elevating the relay into an identity or ranking authority.

**Status:** `[~]` E-12 calibration/sync and E-14 signed-page fixtures exist, and V-16 defines ordering. **E-01 (structural review):** the existing index is a witness-observation cache, not a verified global directory, a ranking authority or the proposed proof-distribution service. Admission policy and discovery remain separate work. **E-02 (structural review):** manual DNS `h` anchoring and automatic `reader_conduct` appends can leave the latest log head ahead of the published anchor. Define anchoring or freeze semantics before relying on that head for broader federation.

**Honest limits:** replaying one operator's observations does not establish a network. Sync is limited to configured peers; cached discovery cannot make an unanchored prefix newly trusted. No public discovery fan-out is claimed by fixture success.

**Exit criterion:** record a site published by an outside operator discoverable in another independent Witness Index, and two independently operated nodes reproducing the same V-16 ordering from identical signed evidence with the same cutoffs. Demonstrate stale, missing and conflicting witnesses, and publish a testable rule for head/anchor transition before expansion.

### Phase 7 — Offline DNSSEC and the public-read boundary

**Goal:** resolve the two open trust-boundary decisions explicitly, without silently upgrading evidence or weakening access policy.

**Status:** `[ ]` G5 needs separate owner authorization for offline DNSSEC; its evidence must cover DS/trust-anchor policy, NSEC/NSEC3, wildcard behavior and algorithm rollover. B3 / ADR 0003 remains a separate decision: the [historical proposal](./architecture/ltp-runtime-integration-proposal.md#6-b3-behavior-and-migration) records rejection of unsigned bot-like traffic before policy even for `ai_input=allow`. A possible exception is an anonymous read on explicitly public routes, never fallback for an invalid signature and never a grant or evidence of identity, reputation or payment.

**Honest limits:** HTTPS DoH with authenticated AD and synthetic RRSIG checks are not offline chain validation; offline proof is not a current online observation. A User-Agent declaration is not verified identity. An unavailable validator or rate-limited request is not evidence of misconduct.

**Exit criterion:** record G5's permitted scope, reviewed backend and independently verified positive/negative chain cases before claiming conformance. For B3, record the owner decision and test `allow/block/charge × absent/invalid signature × public/governed route`, including honest operational failures and no unsigned attribution or billing.

## Classified backlog

Deferral is reversible when its condition is met. These rows are evidence requirements, not promises to ship a capability.

| Direction | Class | Condition to move |
|---|---|---|
| Portable community reputation | `GATED` | Read and verify the emitter's own APW chain beyond E-13's evaluated-site view, and demonstrate more than one real independent emitter. |
| Cross-node reconciliation | `GATED` | Reproduce an observed divergence between independent nodes, such as stale state or conflicting ownership; show the existing evidence cannot resolve it. |
| Dispute or arbitration layer | `GATED` | Document a real dispute between independent operators that published evidence could not settle and the limited resolution it needs. |
| Zero-knowledge verification | `GATED` | Show a specific verification case where disclosing the input is harmful and signatures plus limited public projections are insufficient. |
| Global ranking | `GATED` | Two independent nodes reproduce V-16 ordering using the same signed inputs, windows, and tie-breaks. |
| Automated media-origin detection | `GATED` | Validate a reproducible detection method beyond `declaredOrigin` and characterize false positives and unknowns. |
| Public discovery fan-out | `GATED` | Independent peers publish real `apw-pages.jws` documents; prove bounded re-verification and degraded behavior before opening a public endpoint. |
| External/post-quantum anchoring and timestamping v0.2+ | `GATED` | Define a concrete independent use case and reviewed provider trust, proof format, failure modes, and interoperability vectors for an opt-in versioned extension (e.g. Gerarion Time). Use separate schemas/vectors; preserve Level A and the v0.1 wire bytes, identifiers and primitives. |
| Missing or ambiguous portable cases | `NOW` | Reproduce the ambiguity; resolve it through the appropriate reviewed erratum or version and executable cases. |
| Verifier-to-operator onboarding | `ENABLE` | A specific outside implementer identifies a protocol or evidence-publishing barrier; extend the Starter Kit where that barrier is reproducible. |
| Universal canonical-state schema or general consensus | `OUT OF CORE` | Keep independent of the protocol; a future proposal must identify resources, stable identifiers and real divergence before defining a scoped extension. |

_Editorial provenance: [source roadmap](https://github.com/geroiloyola/portaless/blob/main/ROADMAP.md), especially phases 4–5, 7–9, the signed-manifest part of phase 11, adoption, and the field-trial decisions. Release and approval status comes from Verared's tagged evidence and records._
