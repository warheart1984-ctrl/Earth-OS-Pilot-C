import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { GridWorldSimulator } from '../swarm/grid-world/src/simulator.js';

describe('GridWorldSimulator', () => {
  it('initializes empty grid', () => {
    const sim = new GridWorldSimulator(10, 10);
    const state = sim.getState();
    assert.equal(state.width, 10);
    assert.equal(state.height, 10);
    assert.equal(state.agents.length, 0);
    assert.equal(state.resources.length, 0);
  });

  it('adds and retrieves agents', () => {
    const sim = new GridWorldSimulator(10, 10);
    sim.addAgent({
      agent_id: 'agent-1',
      role: 'miner',
      capabilities: ['dig'],
      position: { x: 0, y: 0 },
      token_id: 'tok-001',
    });
    const state = sim.getState();
    assert.equal(state.agents.length, 1);
    assert.equal(state.agents[0].agent_id, 'agent-1');
  });

  it('moves agent within bounds', () => {
    const sim = new GridWorldSimulator(10, 10);
    sim.addAgent({
      agent_id: 'agent-1',
      role: 'miner',
      capabilities: ['dig'],
      position: { x: 1, y: 1 },
      token_id: 'tok-001',
    });
    const moved = sim.moveAgent('agent-1', 2, 3);
    assert.equal(moved, true);
    const state = sim.getState();
    assert.equal(state.agents[0].position.x, 3);
    assert.equal(state.agents[0].position.y, 4);
  });

  it('rejects out-of-bounds movement', () => {
    const sim = new GridWorldSimulator(5, 5);
    sim.addAgent({
      agent_id: 'agent-1',
      role: 'miner',
      capabilities: ['dig'],
      position: { x: 0, y: 0 },
      token_id: 'tok-001',
    });
    const moved = sim.moveAgent('agent-1', -1, 0);
    assert.equal(moved, false);
  });

  it('collects resource when miner is on same tile', () => {
    const sim = new GridWorldSimulator(10, 10);
    sim.addAgent({
      agent_id: 'agent-1',
      role: 'miner',
      capabilities: ['dig'],
      position: { x: 3, y: 3 },
      token_id: 'tok-001',
    });
    sim.addResource(3, 3, 'gold');
    const collected = sim.collectResource('agent-1');
    assert.equal(collected, true);
    const state = sim.getState();
    assert.equal(state.resources.length, 0);
  });

  it('prevents non-miner from collecting', () => {
    const sim = new GridWorldSimulator(10, 10);
    sim.addAgent({
      agent_id: 'agent-1',
      role: 'transporter',
      capabilities: ['carry'],
      position: { x: 3, y: 3 },
      token_id: 'tok-001',
    });
    sim.addResource(3, 3, 'gold');
    const collected = sim.collectResource('agent-1');
    assert.equal(collected, false);
  });

  it('returns immutable state snapshot', () => {
    const sim = new GridWorldSimulator(10, 10);
    const state = sim.getState();
    state.width = 999;
    const state2 = sim.getState();
    assert.equal(state2.width, 10);
  });
});
