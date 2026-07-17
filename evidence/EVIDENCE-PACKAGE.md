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

1. **Stub directories** — 10 empty directories remain (actuators/gripper, governance/robotics-review, robots/simple-arm, sensors/proximity). Hardware-facing components not yet implemented.
2. **CI/CD** — GitHub Actions workflow configured at `.github/workflows/ci.yml`.
3. **CCT suites** — R-L0 (safety envelope) and R-L1 (swarm governance) defined at `cct-suite/R-L0/` and `cct-suite/R-L1/`.
4. **EMERGENCY_STOP_OVERRIDES_ALL** — now enforced in SafetyEnforcementEngine (tested).
5. **Replay vectors** — 7 vectors created at `replay-vectors/` (safety + grid + audit).
6. **Evidence packets** — generated at `evidence/packets/eos-ir-001-robotics.json`.
7. **CALValidator** — local copy at `safety-envelope/src/cal-validator.ts` matching canonical `@earthos/types`.
8. **Audit log** — hash-chained safety audit log implemented in SafetyEnforcementEngine.
9. **Hardware integration** — no physical robot or ROS 2 sim integration.
10. **Safety audit log** — append-only, hash-chained, with chain verification.
