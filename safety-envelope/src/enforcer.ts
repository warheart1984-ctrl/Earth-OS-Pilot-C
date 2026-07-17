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

export class SafetyEnforcementEngine {
  private envelopes: Map<string, SafetyEnvelope> = new Map();

  registerEnvelope(envelope: SafetyEnvelope): void {
    this.envelopes.set(envelope.envelope_id, envelope);
  }

  checkAction(robot_id: string, action_type: string, hasEvidence: boolean, hasGovernanceClearance: boolean): {
    allowed: boolean;
    violations: string[];
  } {
    const violations: string[] = [];
    for (const [, env] of this.envelopes) {
      if (env.robot_id !== robot_id) continue;
      for (const c of env.contracts) {
        if (c.type === 'NO_ACTUATION_WITHOUT_EVIDENCE' && !hasEvidence) {
          violations.push(c.contract_id);
        }
        if (c.type === 'NO_ACTUATION_WITHOUT_GOVERNANCE' && !hasGovernanceClearance) {
          violations.push(c.contract_id);
        }
      }
    }
    return { allowed: violations.length === 0, violations };
  }
}
