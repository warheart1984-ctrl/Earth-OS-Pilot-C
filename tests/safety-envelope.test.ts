import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SafetyEnforcementEngine } from '../safety-envelope/src/enforcer.js';

describe('SafetyEnforcementEngine', () => {
  it('registers and retrieves envelope', () => {
    const engine = new SafetyEnforcementEngine();
    engine.registerEnvelope({
      envelope_id: 'env-001',
      robot_id: 'robot-1',
      contracts: [],
      valid_from: 0,
      valid_until: 1000,
      signature: 'sha3-256:0000000000000000000000000000000000000000000000000000000000000000',
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
      signature: 'sha3-256:1111111111111111111111111111111111111111111111111111111111111111',
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
      signature: 'sha3-256:2222222222222222222222222222222222222222222222222222222222222222',
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
      signature: 'sha3-256:3333333333333333333333333333333333333333333333333333333333333333',
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
      signature: 'sha3-256:4444444444444444444444444444444444444444444444444444444444444444',
    });
    const result = engine.checkAction('robot-1', 'move', false, false);
    assert.equal(result.allowed, true);
    assert.equal(result.violations.length, 0);
  });
});
