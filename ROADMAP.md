# Vera Trust Spec roadmap

This roadmap tracks standardization and adoption. The [canonical reading guide](./README.md#canonical-reading-guide) leads to the frozen draft and its errata. The [standardization status](./spec/LTP-STANDARDIZATION-STATUS.md) and [authorization register](./spec/LTP-GATES-AND-AUTHORIZATIONS.md) govern milestone and gate status; this roadmap grants no authorization.

| Milestone | Evidence needed |
|---|---|
| S4 — Independent verification | Record a separate implementation and verifier, identifying the implementer, language, backend, corpus revision, and observed results. Passing the reference stack's tests does not satisfy this milestone. |
| Second operator — Operational interoperability | Record interoperation with a second independently operated deployment. Treat this evidence separately from S4's independent verification results. |
| S6 — Normative publication | Close the publication prerequisites in the standardization status before declaring a final normative release. Preserve the frozen draft and record any new commitments separately. |
| G5 — Advanced offline DNSSEC | Record the agreed scope, reviewed verifier evidence, and explicit authorization before claiming conformance or enabling this path. |
| R-05 — Activation evidence | Record evidence and acceptance criteria before activation. A draft profile or passing fixture alone does not authorize activation; see the [reputation review](./spec/LTP-G4-REPUTATION-PREAUTHORIZATION-REVIEW.md). |

Runtime support, package tooling, and adapters belong in the [Vera Trust Stack roadmap](https://github.com/verared/vera-trust-stack/blob/main/ROADMAP.md).
