# Governed Optimus Swarm — Constitutional Integration

## Purpose

Wrap the Optimus Swarm under CAS Ω∞ governance: every swarm role and behavior is gated by CAL tokens, tracked in a CRC registry, evaluated through CPBA/CPRM, and fully replay-auditable.

## Swarm Roles → CAS Tokens

| Swarm Role | CAS Token Capabilities |
|------------|----------------------|
| Miner | `swarm:mine:extract`, `swarm:mine:transport` |
| Transporter | `swarm:transport:move`, `swarm:transport:deliver` |
| Supervisor | `swarm:supervise:assign`, `swarm:supervise:revoke`, `swarm:supervise:audit` |

## CPBA Gates for New Swarm Behaviors

No new swarm capability may be deployed without clearing:

1. **B1 — Correctness**: Behavior specification verified
2. **B2 — Conformance**: CCT swarm suite passes
3. **B3 — Replay**: Swarm decisions reproducible
4. **B4 — External**: Independent swarm reproduces
5. **B5 — Governance**: Swarm steward approves

## Registry + Replay

Every swarm decision (move, collect, assign, revoke) is:

1. Recorded in a CRC-conforming registry entry
2. Deterministically replayable from any snapshot
3. Auditable via the registry hash chain

## Alignment with CESF v1.2

Swarm federation maps to CESF v1.2 Sections 2-6 (federated governance through swarm-level treaties). Swarm robotics governance maps to CESF v1.2 Section 7 (actuator contracts, sensor evidence, safety envelope).
