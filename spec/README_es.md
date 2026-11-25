## Protocolo APW y Veranet

> **ARCHIVO HISTÓRICO (español).** El [índice canónico](../README.md#canonical-reading-guide) ofrece navegación y estado vigentes. Este archivo conserva el contexto histórico.

Portaless es la implementación de referencia de **Protocol APW (Air Portal Website)**: un protocolo abierto de identidad criptográfica y confianza verificable para sitios web independientes, publicado formalmente en septiembre de 2026.

**Documentación del protocolo**

| Documento | Estado |
|---|---|
| [`APW-SPEC-v1.3.md`](./APW-SPEC-v1.3.md) | **Vigente — especificación normativa consolidada** (v1.0 + v1.1 + v1.2 + erratas E-1..E-10 integradas; testigos en 5.7) |
| [`APW-VECTORS-v1.3.md`](./APW-VECTORS-v1.3.md) | **Vigente — vectores de prueba**, en un archivo independiente del código |
| [`ERRATA.md`](./ERRATA.md) | E-1 a E-11 integradas en v1.3; E-12 (informativa) y E-13 (normativa) publicadas y vigentes, sin consolidar |
| [`APW-SPEC-v1.2.md`](./APW-SPEC-v1.2.md) | Reemplazada por v1.3 |
| [`APW-SPEC-v1.0.md`](./APW-SPEC-v1.0.md) | Anterioridad citable del diseño |
| [`apw-spec.md`](./apw-spec.md) | Resumen conceptual reemplazado |

**Licencia y gobernanza**: la especificación, su errata y sus vectores se publican bajo **CC BY 4.0** — reimplementar, traducir y usar comercialmente está permitido con atribución al autor (Gerardo Loyola), sin registro ni certificación de Portaless; ver la sección [Licencia y gobernanza](./APW-SPEC-v1.3.md#license-and-governance) de la spec. El código de implementación de referencia es AGPL-3.0 (`LICENSE`). La sección 6 se llama **Loyal Trust Protocol (LTP)**; en versiones anteriores del documento apareció como "Loyola Trust Protocol" (mismo acrónimo, misma especificación).

**El problema que resuelve**: hoy no existe ningún mecanismo técnico completo, descentralizado y gratuito que permita a un agente de IA (o a un humano) verificar si un sitio es confiable sin depender de un dominio de alta reputación, sin una autoridad central certificadora, y sin señales proxy circunvenibles.

**Cómo lo resuelve**: cada sitio publica su identidad criptográfica (Ed25519, RFC 9421) y un `SiteTrustScore` público calculado de 4 fuentes independientes y auditables — autodeclaración, verificación de agentes de IA, voto comunitario, y reportes de custodia externos. Todo el diseño está preparado para crypto-agilidad post-cuántica desde el esquema de base de datos (columna `key_algorithm`, migración futura a ML-DSA / FIPS 204 sin perder la cadena de custodia).

**Veranet**: es el nombre del resultado final hacia el que converge Protocol APW — una red de sitios verificablemente confiables, con identidad criptográfica inmutable y post-cuántica, donde ningún humano, máquina, agente o IA puede falsificar la procedencia de un sitio o de su contenido sin que quede una señal auditable públicamente. Veranet no es una plataforma centralizada: es el estado de la red cuando suficientes sitios independientes adoptan Protocol APW y se descubren entre sí a través del **Portaless Index** — una capa de descubrimiento federado, con identidad verificable, score de confianza previo a la agregación, y capacidad de cobro por acceso incorporados desde el diseño.

**Estado de adopción:** consulta la [guía canónica](../README.md#canonical-reading-guide) para localizar la implementación separada, la arquitectura y el estado del borrador.

Fecha de publicación de esta especificación: **septiembre de 2026**.
