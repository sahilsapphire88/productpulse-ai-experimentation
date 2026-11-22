import type { DecisionRecord } from '../types';

const LOG_KEY = 'experimentlab_decision_log';

export interface DecisionLogEntry {
  id: string;
  date: string;
  experimentId: string;
  experimentName: string;
  hypothesis: string;
  result: string;
  decision: DecisionRecord['decision'];
  evidence: string;
  followUp: string;
}

export function loadDecisionLog(): DecisionLogEntry[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOG_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveDecisionLog(entries: DecisionLogEntry[]): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(LOG_KEY, JSON.stringify(entries));
  } catch {
    // ignore quota errors
  }
}

export function addDecisionLogEntry(entry: Omit<DecisionLogEntry, 'id'>): DecisionLogEntry {
  const entries = loadDecisionLog();
  const newEntry: DecisionLogEntry = {
    ...entry,
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  };
  saveDecisionLog([newEntry, ...entries]);
  return newEntry;
}
