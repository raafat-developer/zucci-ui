// src/stores/tickets.js — Tickets store.
import { createResourceStore } from './createResourceStore';

export const useTicketsStore = createResourceStore('tickets', 'tickets', {
  getters: {
    open: (s) => s.items.filter((t) => t.status === 'open'),
    breached: (s) => s.items.filter((t) => t.sla_remaining < 0 && t.status !== 'resolved' && t.status !== 'closed'),
  },
  actions: {
    async resolve(id) { return this.update(id, { status: 'resolved' }); },
    async escalate(id) { return this.update(id, { status: 'in_progress' }); },
    async close(id) { return this.update(id, { status: 'closed' }); },
    async assign(id, assignee) { return this.update(id, { assignee }); },
    async setTeam(id, team) { return this.update(id, { team }); },
    async setCsat(id, csat) { return this.update(id, { csat }); },
  },
});
