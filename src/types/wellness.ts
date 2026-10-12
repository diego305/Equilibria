export type PillarId = 'sleep' | 'nutrition' | 'mind' | 'exercise';

export interface Option {
  id: string;
  label: string;
  subtext?: string;
  score: number; // 1 to 4
}

export interface Question {
  id: string;
  pillar: PillarId;
  question: string;
  context: string;
  options: Option[];
}

export interface PillarInfo {
  id: PillarId;
  name: string;
  subtitle: string;
  iconName: string;
  color: {
    text: string;
    bg: string;
    border: string;
    fill: string;
    ring: string;
    badge: string;
    chartFill: string;
    chartStroke: string;
  };
  idealDescription: string;
  presentationTakeaway: string;
}

export interface EvaluationResult {
  id: string;
  date: string; // ISO string
  userName: string;
  answers: Record<string, string>; // questionId -> optionId
  pillarScores: Record<PillarId, number>; // 0 to 100
  totalScore: number; // 0 to 100
  archetype: {
    title: string;
    tagline: string;
    description: string;
    color: string;
  };
  recommendations: Record<PillarId, string[]>;
  actionPlan: string[];
}

export interface StoredEvaluation {
  id: string;
  date: string;
  userName: string;
  totalScore: number;
  pillarScores: Record<PillarId, number>;
  answers: Record<string, string>;
  archetypeTitle: string;
}
