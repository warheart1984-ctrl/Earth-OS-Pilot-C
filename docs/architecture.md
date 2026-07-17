# EarthOS Pilot C — Constitutional Robotics

## Purpose

EarthOS Pilot C proves constitutional governance over physical or simulated robots using CAS tokens, CPBA/CPRM gates, and replay-auditable registries.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Constitutional Safety Envelope                      │
│  ┌─────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │ Sensors  │  │ Actuators│  │ Swarm Governance │   │
│  │ Evidence │  │ Contracts│  │ Multi-Agent Auth │   │
│  └─────────┘  └──────────┘  └──────────────────┘   │
├─────────────────────────────────────────────────────┤
│  CGE Core (CAS Ω∞ + CPBA Ω∞ + CPRM Ω∞)              │
│  Registry │ Replay │ Token Lifecycle                 │
└─────────────────────────────────────────────────────┘
```

## Non-Compensatory Safety Contracts

| Contract | Rule |
|----------|------|
| NO_ACTUATION_WITHOUT_EVIDENCE | Sensor evidence must exist before actuation |
| NO_ACTUATION_WITHOUT_GOVERNANCE | Governance clearance required for actuation |
| EMERGENCY_STOP_OVERRIDES_ALL | E-stop terminates all authorization |
