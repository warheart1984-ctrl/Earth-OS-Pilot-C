import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SafetyEnforcementEngine } from '../safety-envelope/src/enforcer.js';

const SIG = (s: string) => `sha3-256:${s.padStart(64, '0')}`;

describe('SafetyEnforcementEngine', () => {
  it('registers and retrieves envelope', () => {
    const engine = new SafetyEnforcementEngine();
    engine.registerEnvelope({
      envelope_id: 'env-001',
      robot_id: 'robot-1',
      contracts: [],
      valid_from: 0,
      valid_until: 1000,
      signature: SIG('a'),
    });
    const result = engine.checkAction('robot-1', 'move', true, true);
    assert.equal(result.allowed, true);
    assert.equal(result.violations.length, 0);
  });

  it('blocks actuation without evidence', () => {
    const engine = new SafetyEnforcementEngine();
    engine.registerEnvelope({
      envelope_id: 'env-002',
      robot_id: 'robot-1',
      contracts: [{
        contract_id: 'C-EVIDENCE-001',
        type: 'NO_ACTUATION_WITHOUT_EVIDENCE',
        severity: 'CRITICAL',
        condition: 'evidence must exist before actuation',
        consequence: 'block actuation',
      }],
      valid_from: 0,
      valid_until: 1000,
      signature: SIG('b'),
    });
    const result = engine.checkAction('robot-1', 'move', false, true);
    assert.equal(result.allowed, false);
    assert.deepEqual(result.violations, ['C-EVIDENCE-001']);
  });

  it('blocks actuation without governance clearance', () => {
    const engine = new SafetyEnforcementEngine();
    engine.registerEnvelope({
      envelope_id: 'env-003',
      robot_id: 'robot-1',
      contracts: [{
        contract_id: 'C-GOV-001',
        type: 'NO_ACTUATION_WITHOUT_GOVERNANCE',
        severity: 'CRITICAL',
        condition: 'governance clearance required',
        consequence: 'block actuation',
      }],
      valid_from: 0,
      valid_until: 1000,
      signature: SIG('c'),
    });
    const result = engine.checkAction('robot-1', 'move', true, false);
    assert.equal(result.allowed, false);
    assert.deepEqual(result.violations, ['C-GOV-001']);
  });

  it('allows actuation when all contracts satisfied', () => {
    const engine = new SafetyEnforcementEngine();
    engine.registerEnvelope({
      envelope_id: 'env-004',
      robot_id: 'robot-1',
      contracts: [
        {
          contract_id: 'C-EVIDENCE-002',
          type: 'NO_ACTUATION_WITHOUT_EVIDENCE',
          severity: 'CRITICAL',
          condition: 'evidence must exist',
          consequence: 'block',
        },
        {
          contract_id: 'C-GOV-002',
          type: 'NO_ACTUATION_WITHOUT_GOVERNANCE',
          severity: 'CRITICAL',
          condition: 'governance clearance',
          consequence: 'block',
        },
      ],
      valid_from: 0,
      valid_until: 1000,
      signature: SIG('d'),
    });
    const result = engine.checkAction('robot-1', 'move', true, true);
    assert.equal(result.allowed, true);
    assert.equal(result.violations.length, 0);
  });

  it('ignores envelopes for other robots', () => {
    const engine = new SafetyEnforcementEngine();
    engine.registerEnvelope({
      envelope_id: 'env-005',
      robot_id: 'robot-2',
      contracts: [{
        contract_id: 'C-EVIDENCE-003',
        type: 'NO_ACTUATION_WITHOUT_EVIDENCE',
        severity: 'CRITICAL',
        condition: 'evidence',
        consequence: 'block',
      }],
      valid_from: 0,
      valid_until: 1000,
      signature: SIG('e'),
    });
    const result = engine.checkAction('robot-1', 'move', false, false);
    assert.equal(result.allowed, true);
    assert.equal(result.violations.length, 0);
  });

  it('emergency stop blocks even when evidence and governance satisfied', () => {
    const engine = new SafetyEnforcementEngine();
    engine.registerEnvelope({
      envelope_id: 'env-006',
      robot_id: 'robot-1',
      contracts: [{
        contract_id: 'C-ESTOP-001',
        type: 'EMERGENCY_STOP_OVERRIDES_ALL',
        severity: 'CRITICAL',
        condition: 'emergency stop engaged',
        consequence: 'stop all actuation',
      }],
      valid_from: 0,
      valid_until: 1000,
      signature: SIG('f'),
    });
    const result = engine.checkAction('robot-1', 'move', true, true);
    assert.equal(result.allowed, false);
    assert.deepEqual(result.violations, ['C-ESTOP-001']);
  });

  it('emergency stop blocks regardless of other contracts passing', () => {
    const engine = new SafetyEnforcementEngine();
    engine.registerEnvelope({
      envelope_id: 'env-007',
      robot_id: 'robot-1',
      contracts: [
        {
          contract_id: 'C-EVIDENCE-004',
          type: 'NO_ACTUATION_WITHOUT_EVIDENCE',
          severity: 'CRITICAL',
          condition: 'evidence',
          consequence: 'block',
        },
        {
          contract_id: 'C-ESTOP-002',
          type: 'EMERGENCY_STOP_OVERRIDES_ALL',
          severity: 'CRITICAL',
          condition: 'emergency stop',
          consequence: 'stop',
        },
      ],
      valid_from: 0,
      valid_until: 1000,
      signature: SIG('g'),
    });
    const result = engine.checkAction('robot-1', 'move', true, true);
    assert.equal(result.allowed, false);
    assert.ok(result.violations.includes('C-ESTOP-002'));
  });

  it('records audit entries with hash chain', () => {
    const engine = new SafetyEnforcementEngine();
    engine.checkAction('robot-1', 'move', true, true);
    engine.checkAction('robot-2', 'rotate', false, true);
    const log = engine.getAuditLog();
    assert.equal(log.length, 2);
    assert.equal(log[1].previous_hash, log[0].entry_hash);
  });

  it('verifies audit chain integrity', () => {
    const engine = new SafetyEnforcementEngine();
    engine.checkAction('robot-1', 'move', true, true);
    engine.checkAction('robot-1', 'rotate', false, false);
    assert.equal(engine.verifyAuditChain(), true);
    const log = engine.getAuditLog();
    log[1].violations = [];
    assert.equal(engine.verifyAuditChain(), true);
  });

  it('audit log returns immutable copy', () => {
    const engine = new SafetyEnforcementEngine();
    engine.checkAction('robot-1', 'move', true, true);
    const log = engine.getAuditLog();
    log[0].action_type = 'hacked';
    const log2 = engine.getAuditLog();
    assert.equal(log2[0].action_type, 'move');
  });
});
