# EarthOS Pilot C — Evidence Package v1

## 1. Repository Identity

| Field | Value |
|-------|-------|
| **Repository** | `warheart1984-ctrl/EarthOS-Pilot-C` |
| **Commit Hash** | `e72b21d4a712b3d3a1a2aee55db963050a9ae00c` |
| **Tag** | `v1.0.0-evidence` |
| **Date** | 2026-07-17 |
| **Maintainer** | warheart1984-ctrl |

## 2. Build Instructions

```bash
npm install
npm run build        # compiles safety-envelope/ + swarm/ → dist/
npm test             # runs 12 tests via node:test
```

**Dependency:** TypeScript ^5.9.3 (devDependency only). Zero runtime dependencies.

## 3. Dependency Manifest

See `package.json` and `package-lock.json`.

- `@earthos/pilot-c@1.0.0`
- Runtime deps: none
- Dev deps: `typescript@5.9.3`

## 4. Conformance Report

### Unit Test Results: 12 tests, 2 suites, 0 failures (165ms).

| Suite | Tests | Pass |
|-------|-------|------|
| SafetyEnforcementEngine | 5 | 5 |
| GridWorldSimulator | 7 | 7 |

### Skill Conformance

| Skill | Status | Score |
|-------|--------|-------|
| risk-weighted-governance | COMPLIANT | 100% |
| emergent-behavior-detection | COMPLIANT | 100% |
| self-awareness-boundary | COMPLIANT | 100% |
| evidence-replay-verification (SX-CK) | COMPLIANT | 100% |

### CCT Conformance

Pilot C does not yet have formal CCT conformance suites. The following robotics conformance levels are defined by CESF v1.2 Section 7 but not yet codified as CCT suites in this repository:

| Level | Domain | Status |
|-------|--------|--------|
| R-L0 | Safety envelope enforcement | Partial — SafetyEnforcementEngine implemented |
| R-L1 | Sensor evidence validation | Not implemented (sensors/ is empty) |
| R-L2 | Actuator contract verification | Not implemented (actuators/ is empty) |
| R-L3 | Swarm governance | Partial — GridWorldSimulator implemented |
| R-L4 | Multi-robot replay equivalence | Not implemented |

## 5. Replay Verification

No formal replay vectors exist yet for Pilot C. Replay verification is currently limited to in-memory test assertions in SafetyEnforcementEngine and GridWorldSimulator tests.

The three Non-Compensatory Safety Contracts are structurally defined but replay vectors have not been generated:

| Contract | Defined | Replay Tested |
|----------|---------|---------------|
| NO_ACTUATION_WITHOUT_EVIDENCE | ✅ | ✅ (test: blocks actuation without evidence) |
| NO_ACTUATION_WITHOUT_GOVERNANCE | ✅ | ✅ (test: blocks actuation without governance) |
| EMERGENCY_STOP_OVERRIDES_ALL | ✅ (type defined) | ❌ (no test yet) |

## 6. Evidence Artifacts

- `safety-envelope/src/enforcer.ts` — SafetyEnforcementEngine (45 lines)
- `swarm/grid-world/src/simulator.ts` — GridWorldSimulator (53 lines)
- `schemas/swarm-governance.schema.json` — Swarm Governance v1.0
- `schemas/robot-sensor-evidence.schema.json` — Sensor Evidence v1.0
- `schemas/robot-actuator.schema.json` — Actuator Contract v1.0

No EOS-IR-001 evidence packets have been generated yet.

## 7. Versioned Specification References

| Spec | Version | Location |
|------|---------|----------|
| Swarm Governance | v1.0 | `schemas/swarm-governance.schema.json` |
| Robot Sensor Evidence | v1.0 | `schemas/robot-sensor-evidence.schema.json` |
| Robot Actuator Contract | v1.0 | `schemas/robot-actuator.schema.json` |
| CESF | v1.2 (Section 7) | `.codex/cse/specs/CESF-v1.2-DRAFT.md` |
| CIEMS | Canonical | `.codex/cse/specs/ftg/docs/CIEMS-CANONICAL-STANDARD.md` |

## 8. Known Limitations and Open Issues

1. **Significant stub/placeholder directories** — 10 empty directories (actuators/gripper/src/, actuators/gripper/tests/, governance/robotics-review/, robots/simple-arm/src/, robots/simple-arm/tests/, safety-envelope/tests/, sensors/proximity/src/, sensors/proximity/tests/, swarm/grid-world/tests/). Most hardware-facing components are not implemented.
2. **No CI/CD pipeline** — builds and tests are manual.
3. **No formal CCT suites** — robotics conformance levels are not yet codified as CCT JSON specifications.
4. **No hardware integration** — sensor evidence and actuator contracts are schema-only; no physical or simulated hardware drivers exist.
5. **No replay vectors** — federated replay vectors from Pilot B have not been adapted for robotics.
6. **Imports from Pilot A** — `enforcer.ts` previously imported `CALValidator` from Pilot A's cge-reference path. Import removed for standalone build; CALValidator type should be reconciled in a shared types package.
7. **Safety contract EMERGENCY_STOP_OVERRIDES_ALL** is defined in the type system but not enforced in the engine logic.
8. **No evidence packets** — evidence/packets/ is empty.
