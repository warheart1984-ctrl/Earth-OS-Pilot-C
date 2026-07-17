export interface SwarmAgent {
  agent_id: string;
  role: 'miner' | 'transporter' | 'supervisor';
  capabilities: string[];
  position: { x: number; y: number };
  token_id: string;
}

export interface GridWorldState {
  width: number;
  height: number;
  resources: { x: number; y: number; type: string }[];
  agents: SwarmAgent[];
}

export class GridWorldSimulator {
  private state: GridWorldState;

  constructor(width: number, height: number) {
    this.state = { width, height, resources: [], agents: [] };
  }

  addAgent(agent: SwarmAgent): void {
    this.state.agents.push(agent);
  }

  addResource(x: number, y: number, type: string): void {
    this.state.resources.push({ x, y, type });
  }

  moveAgent(agent_id: string, dx: number, dy: number): boolean {
    const agent = this.state.agents.find((a) => a.agent_id === agent_id);
    if (!agent) return false;
    const nx = agent.position.x + dx;
    const ny = agent.position.y + dy;
    if (nx < 0 || nx >= this.state.width || ny < 0 || ny >= this.state.height) return false;
    agent.position = { x: nx, y: ny };
    return true;
  }

  collectResource(agent_id: string): boolean {
    const agent = this.state.agents.find((a) => a.agent_id === agent_id);
    if (!agent || agent.role !== 'miner') return false;
    const idx = this.state.resources.findIndex((r) => r.x === agent.position.x && r.y === agent.position.y);
    if (idx === -1) return false;
    this.state.resources.splice(idx, 1);
    return true;
  }

  getState(): GridWorldState {
    return JSON.parse(JSON.stringify(this.state));
  }
}
