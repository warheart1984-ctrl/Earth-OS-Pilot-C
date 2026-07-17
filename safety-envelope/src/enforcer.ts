import { CALValidator } from './cal-validator.js';
import { createHash } from 'node:crypto';

export interface SafetyContract {
  contract_id: string;
  type: 'NO_ACTUATION_WITHOUT_EVIDENCE' | 'NO_ACTUATION_WITHOUT_GOVERNANCE' | 'EMERGENCY_STOP_OVERRIDES_ALL';
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
  condition: string;
  consequence: string;
}

export interface SafetyEnvelope {
  envelope_id: string;
  robot_id: string;
  contracts: SafetyContract[];
  valid_from: number;
  valid_until: number;
  signature: string;
}

export interface AuditEntry {
  sequence: number;
  timestamp: number;
  robot_id: string;
  action_type: string;
  decision: 'allowed' | 'blocked';
  violations: string[];
  previous_hash: string | null;
  entry_hash: string;
}

function auditHash(entry: Omit<AuditEntry, 'entry_hash'>): string {
  const canonical = JSON.stringify(entry, Object.keys(entry).sort());
  return `sha3-256:${createHash('sha3-256').update(canonical, 'utf8').digest('hex')}`;
}

export class SafetyEnforcementEngine {
  private envelopes: Map<string, SafetyEnvelope> = new Map();
  private auditLog: AuditEntry[] = [];
  private sequenceCounter = 0;

  registerEnvelope(envelope: SafetyEnvelope): void {
    this.envelopes.set(envelope.envelope_id, envelope);
  }

  checkAction(robot_id: string, action_type: string, hasEvidence: boolean, hasGovernanceClearance: boolean): {
    allowed: boolean;
    violations: string[];
  } {
    const violations: string[] = [];
    let emergencyStopEngaged = false;

    for (const [, env] of this.envelopes) {
      if (env.robot_id !== robot_id) continue;
      for (const c of env.contracts) {
        if (c.type === 'EMERGENCY_STOP_OVERRIDES_ALL') {
          emergencyStopEngaged = true;
          violations.push(c.contract_id);
        }
        if (c.type === 'NO_ACTUATION_WITHOUT_EVIDENCE' && !hasEvidence) {
          violations.push(c.contract_id);
        }
        if (c.type === 'NO_ACTUATION_WITHOUT_GOVERNANCE' && !hasGovernanceClearance) {
          violations.push(c.contract_id);
        }
      }
    }

    if (emergencyStopEngaged) {
      return { allowed: false, violations };
    }

    this.sequenceCounter++;
    const decision: 'allowed' | 'blocked' = violations.length === 0 ? 'allowed' : 'blocked';
    const prevHash = this.auditLog.length > 0 ? this.auditLog[this.auditLog.length - 1].entry_hash : null;
    const entryBase = {
      sequence: this.sequenceCounter,
      timestamp: Date.now(),
      robot_id,
      action_type,
      decision,
      violations,
      previous_hash: prevHash,
    };
    this.auditLog.push({ ...entryBase, entry_hash: auditHash(entryBase) });

    return { allowed: decision === 'allowed', violations };
  }

  getAuditLog(): AuditEntry[] {
    return this.auditLog.map(e => ({ ...e }));
  }

  verifyAuditChain(): boolean {
    for (let i = 1; i < this.auditLog.length; i++) {
      const expectedPrev = this.auditLog[i - 1].entry_hash;
      if (this.auditLog[i].previous_hash !== expectedPrev) return false;
    }
    return true;
  }
}
