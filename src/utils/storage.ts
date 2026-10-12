import { EvaluationResult, StoredEvaluation } from '../types/wellness';

const STORAGE_KEY_HISTORY = 'equilibria_health_evaluations';
const STORAGE_KEY_IN_PROGRESS = 'equilibria_in_progress_state';

export interface InProgressState {
  userName: string;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  updatedAt: string;
}

export function getStoredEvaluations(): StoredEvaluation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading evaluations from localStorage:', err);
    return [];
  }
}

export function saveEvaluationToHistory(result: EvaluationResult): StoredEvaluation[] {
  try {
    const history = getStoredEvaluations();
    const storedItem: StoredEvaluation = {
      id: result.id,
      date: result.date,
      userName: result.userName,
      totalScore: result.totalScore,
      pillarScores: result.pillarScores,
      answers: result.answers,
      archetypeTitle: result.archetype.title,
    };

    // Prepend new evaluation and keep last 20
    const updated = [storedItem, ...history.filter((h) => h.id !== storedItem.id)].slice(0, 20);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error saving evaluation to localStorage:', err);
    return getStoredEvaluations();
  }
}

export function deleteStoredEvaluation(id: string): StoredEvaluation[] {
  try {
    const history = getStoredEvaluations();
    const updated = history.filter((h) => h.id !== id);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error deleting evaluation:', err);
    return getStoredEvaluations();
  }
}

export function clearAllEvaluations(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_HISTORY);
  } catch (err) {
    console.error('Error clearing evaluations:', err);
  }
}

export function saveInProgressState(state: InProgressState): void {
  try {
    localStorage.setItem(STORAGE_KEY_IN_PROGRESS, JSON.stringify(state));
  } catch (err) {
    console.error('Error saving in-progress state:', err);
  }
}

export function getInProgressState(): InProgressState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_IN_PROGRESS);
    if (!raw) return null;
    return JSON.parse(raw) as InProgressState;
  } catch (err) {
    return null;
  }
}

export function clearInProgressState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_IN_PROGRESS);
  } catch (err) {
    // Ignore error
  }
}
