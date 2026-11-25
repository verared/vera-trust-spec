# Vera Trust Spec — Vision

This document sets direction. The [roadmap](./ROADMAP.md) records evidence and open work; the [foundational architecture](./spec/LTP-STACK-ARCHITECTURE.md) describes the protocol boundaries. Changes of direction should be recorded openly, with the previous decision left in history.

## The problem: presence without control

An account on a publishing platform is not an identity you control. A platform can remove a publication, change its ranking or stop delivering it. When it also holds the only record, the publisher cannot independently establish what was published, by whom, or when. Automated readers make this gap harder to ignore: a site can publish preferences, but a preference alone does not identify a reader, prove its conduct or record what terms actually applied.

Verared's goal is a web where a person or organization can keep the authoritative state it is entitled to control and publish enough evidence for other parties to verify it. Platforms are replaceable distribution channels. A feed, manifest, index result or reputation view is a projection of state, with its own freshness and scope. Removing a copy from a channel is a different event from withdrawing it at the source.

## Identity, witnesses and local decisions

- **APW makes identity and history verifiable.** A domain-controlled identity binds keys to a subject. Signed artifacts and chained history let a verifier check the signer, the applicable key window, and continuity without asking the publisher to attest to each check in real time.
- **The Witness Index makes observations discoverable.** Witnesses commit observations to their own verifiable histories. An index can distribute and aggregate those observations, expose disagreements or help detect missing history, but cannot create evidence by listing it. Each operator retains its own witness selection and verification policy. The historical witness directory and the proposed proof-distribution service have distinct roles; see the foundational architecture.
- **Local Trust Protocol keeps the decision with the reader or operator.** Check the proof and provenance, then apply local policy. A proof does not itself grant access. Public and governed resources are distinct: requiring identity for particular access is an explicit operator decision. The proof required should be proportionate to the operation.
- **SVRI and HSVR retain the limits of the evidence.** SVRI projects reputation together with source tiers, counts, weight and inference. HSVR tracks the history of such assessments with their evidence and gaps; it is distinct from the APW log. A `community attester` signs an attributable statement under the applicable rules. Neither the statement's signature nor its presence in an index proves its truth.

| What a verifier can report | What that does and does not establish |
|---|---|
| Integrity | The bytes match the signature. |
| Identity | The key is bound to the claimed subject and valid in the relevant window. |
| Witness observation | A distinct source recorded an observation; its provenance and coverage still matter. |
| Declaration | An issuer made a claim; the claim may be incorrect. |
| Derived reputation | The result is reproducible under the stated inputs and rules; a prior is not a measurement. |
| Unknown | Evidence is absent or insufficient. Publish the gap or a pending result rather than an invented measurement. |

Where a required proof cannot be verified, fail closed and say why. Distinguish an invalid signature from an unavailable service or an incomplete log. Scores should never conceal contradictory observations or imply that an infrastructure failure is misconduct.

## Independence is a failure test

Ask what happens if the first implementation disappears, an index omits a subject, a witness goes offline or a distribution provider changes its rules. Acceptable outcomes are continued verification, an explicit degradation, or portable evidence that can be checked with a replacement. A design that silently trusts one provider, one index, or the original author fails this test.

Build the smallest interoperable capability that lets the next independent operator participate. Correctness defects belong in current work; reusable capabilities should serve a concrete adopter. Broader federation, shared rankings or a new trust service require independent evidence before Verared claims they work. General-purpose consensus, universal state schemas and commercial services are outside the protocol core.

## Three horizons

1. **One operator can publish and verify.** Another party can resolve the identity, review its signed history and understand the site's published policy and the limits of its evidence.
2. **A second implementation can agree.** An implementer can reproduce results from the specification and vectors, without relying on the TypeScript implementation. Independent verification is distinct from running the same code on two hosts.
3. **Independent nodes can discover and verify each other.** Two operators who share neither a platform nor a prior relationship can exchange evidence and reach informed decisions with less blind trust. Reproducible ordering and interoperable discovery must be observed before they are treated as network capabilities.

### Extension horizon: v0.2+

Keep v0.1 on its defined standard primitives, wire identifiers and signed bytes. Future opt-in versions may specify a pluggable interface for external anchoring or post-quantum timestamping providers, with explicit trust roots, proof formats, failure handling and independent vectors. Such a provider is neither a dependency of v0.1 nor a new authority for existing evidence.

_Editorial provenance: adapted from the [source vision](https://github.com/geroiloyola/portaless/blob/main/docs/VISION.md), focusing on portable identity, independently verifiable evidence and adoption._
