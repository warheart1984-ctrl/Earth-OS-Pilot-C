export class CALValidator {
  static validate(token: unknown): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const t = token as Record<string, unknown>;
    if (!t || typeof t !== 'object') {
      errors.push('token must be an object');
      return { valid: false, errors };
    }
    const required = ['token_id', 'issued_by', 'issued_to', 'capabilities', 'scope', 'delegation_chain', 'signature', 'revoked'];
    for (const field of required) {
      if (!(field in t)) errors.push(`missing required field: ${field}`);
    }
    if (t.capabilities && !Array.isArray(t.capabilities)) {
      errors.push('capabilities must be an array');
    } else if (Array.isArray(t.capabilities) && t.capabilities.length === 0) {
      errors.push('capabilities must have at least 1 item');
    }
    if (t.token_id && typeof t.token_id === 'string') {
      if (!/^[a-f0-9-]{36}$/.test(t.token_id)) errors.push('token_id must match UUID pattern');
    }
    if (t.signature && typeof t.signature === 'string') {
      if (!/^sha3-256:[a-f0-9]{64}$/.test(t.signature)) errors.push('signature must match sha3-256:hex pattern');
    }
    return { valid: errors.length === 0, errors };
  }
}
