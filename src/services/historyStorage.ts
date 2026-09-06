import type { MultilingualTurn, SemanticState } from '../types';

export interface ConversationSession {
  sessionId: string;
  speakerId: string;
  speakerName: string;
  startedAt: string;
  endedAt?: string;
  turns: MultilingualTurn[];
  semanticState?: SemanticState;
  intent?: string;
  tags?: string[];
}

const STORAGE_KEY = 'bhashaflow_conversation_history_v1';
const CURRENT_SPEAKER_KEY = 'bhashaflow_current_speaker_v1';

export const DEFAULT_SPEAKERS = [
  { id: 'speaker_user_01', name: 'Akhilesh (User 1)' },
  { id: 'speaker_user_02', name: 'Teammate / Guest' },
  { id: 'speaker_eval_01', name: 'Evaluator (Judge)' },
];

/**
 * Get current active speaker profile
 */
export function getCurrentSpeaker(): { id: string; name: string } {
  try {
    const saved = localStorage.getItem(CURRENT_SPEAKER_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error reading current speaker:', e);
  }
  return DEFAULT_SPEAKERS[0];
}

/**
 * Set current active speaker profile
 */
export function setCurrentSpeaker(speaker: { id: string; name: string }): void {
  try {
    localStorage.setItem(CURRENT_SPEAKER_KEY, JSON.stringify(speaker));
  } catch (e) {
    console.error('Error saving current speaker:', e);
  }
}

/**
 * Load all recorded sessions from localStorage
 */
export function getAllSessions(): ConversationSession[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as ConversationSession[];
  } catch (e) {
    console.error('Error reading sessions from localStorage:', e);
    return [];
  }
}

/**
 * Save or update a session
 */
export function saveSession(session: ConversationSession): void {
  try {
    const sessions = getAllSessions();
    const existingIndex = sessions.findIndex((s) => s.sessionId === session.sessionId);
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.unshift(session); // Add newest at top
    }
    // Limit to 50 most recent sessions to avoid localStorage overflow
    const capped = sessions.slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(capped));
  } catch (e) {
    console.error('Error saving session to localStorage:', e);
  }
}

/**
 * Append turns to current or specific session
 */
export function appendTurnsToSession(
  sessionId: string,
  speakerId: string,
  speakerName: string,
  turns: MultilingualTurn[],
  semanticState?: SemanticState
): ConversationSession {
  const sessions = getAllSessions();
  let session = sessions.find((s) => s.sessionId === sessionId);

  if (!session) {
    session = {
      sessionId,
      speakerId,
      speakerName,
      startedAt: new Date().toISOString(),
      turns: [],
      semanticState,
      intent: semanticState?.intent,
    };
    sessions.unshift(session);
  }

  session.turns = turns;
  session.endedAt = new Date().toISOString();
  if (semanticState) {
    session.semanticState = semanticState;
    session.intent = semanticState.intent;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(0, 50)));
  } catch (e) {
    console.error('Error saving updated session:', e);
  }

  return session;
}

/**
 * Delete a session by ID
 */
export function deleteSession(sessionId: string): void {
  try {
    const sessions = getAllSessions().filter((s) => s.sessionId !== sessionId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.error('Error deleting session:', e);
  }
}

/**
 * Clear all conversation history
 */
export function clearAllHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing history:', e);
  }
}

/**
 * Export all sessions as formatted JSON file download
 */
export function exportHistoryJSON(): void {
  const sessions = getAllSessions();
  const blob = new Blob([JSON.stringify(sessions, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `bhashaflow-history-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
