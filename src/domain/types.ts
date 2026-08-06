export type Side = 'left' | 'right' | 'not-applicable';
export type Location = 'home' | 'outdoor-small' | 'club';
export type SessionObjective = 'learn' | 'autonomy' | 'precision' | 'review' | 'side';
export type PracticeResult = 'incorrect' | 'assisted' | 'autonomous';
export type SessionStatus = 'active' | 'paused' | 'completed' | 'discarded';
export type TrainingMode = 'repetition' | 'circuit';

export type MaterialRequirement = {
  id: string;
  requiredForFinalExecution: boolean;
  usefulForLearning: boolean;
};

export type SignalAssignment = {
  regulationId: string;
  regulatorySideMode: 'left-only' | 'right-only' | 'both' | 'not-applicable';
};

export type SignalContent = {
  id: string;
  revisionId: string;
  officialNumber: string;
  name: string;
  exerciseGroup: number;
  exerciseArea: string;
  regulatoryDescription: string;
  plainExplanation: string;
  trainingAdvice: string;
  criteria: string[];
  trainingSideMode: 'both' | 'left-only' | 'right-only' | 'not-applicable';
  materials: MaterialRequirement[];
  locations: Location[];
  space: 'static' | 'short' | 'medium' | 'course';
  skillIds: string[];
  prerequisiteSignalIds: string[];
  assignments: SignalAssignment[];
  progressCompatibilityKey: string;
  editorialStatus: 'reviewed' | 'published';
};

export type Dog = {
  id: string;
  name: string;
  nameNormalized: string;
  breed: string;
  createdAt: number;
  updatedAt: number;
  archivedAt: number | null;
};

export type AppSettings = {
  id: 'settings';
  activeDogId: string | null;
  theme: 'system' | 'light' | 'dark';
  preferredLocation: Location;
  availableMaterialIds: string[];
  lastBackupAt: number | null;
  updatedAt: number;
};

export type TrainingSession = {
  id: string;
  dogId: string;
  status: SessionStatus;
  objective: SessionObjective;
  location: Location;
  startedAt: number;
  startedLocalDate: string;
  endedAt: number | null;
  endReason: string | null;
  rating: 'difficult' | 'appropriate' | 'easy' | null;
  note: string;
  plannerRulesVersion: '1';
  trainingMode: TrainingMode;
  targetAttempts: 10;
  breakCount: number;
  quickImpressions: string[];
  activeSince: number | null;
  effectiveTrainingMs: number;
  restCycleStartedAt: number | null;
  pausedAt: number | null;
  pauseKind: 'manual' | 'break' | null;
};

export type PracticeBlock = {
  id: string;
  sessionId: string;
  sequence: number;
  signalId: string;
  signalRevisionId: string;
  progressCompatibilityKey: string;
  side: Side;
  practiceContext: 'individual' | 'course';
  inputMode: 'attempt';
  dominantHelp: string | null;
  note: string;
};

export type PracticeRecord = {
  id: string;
  blockId: string;
  sessionId: string;
  sequence: number;
  result: PracticeResult;
  recordedAt: number;
  localDate: string;
  sessionSequence?: number;
  repetitionNumber?: number;
  circuitRound?: number;
};

export type Evidence = {
  signalId: string;
  compatibilityKey: string;
  side: Side;
  practiceContext: 'individual' | 'course';
  result: PracticeResult;
  recordedAt: number;
  localDate: string;
};

export type Course = {
  id: string;
  name: string;
  rulesetId: 'rsce:debutante' | 'rsce:grade-1' | 'rsce:grade-2' | 'rsce:grade-3' | 'fci:international';
  createdAt: number;
  updatedAt: number;
};

export type CourseItem = {
  id: string;
  courseId: string;
  sequence: number;
  signalId: string;
  side: Side;
};

export type ProgressState = 'not-started' | 'in-progress' | 'learned' | 'consolidated' | 'needs-review';

export type ProgressResult = {
  state: ProgressState;
  side: Side;
  totalEvidence: number;
  window: { incorrect: number; assisted: number; autonomous: number; days: number };
  lastPracticedAt: number | null;
  learnedAt: number | null;
  consolidatedAt: number | null;
  nextReviewAt: number | null;
  reviewReasons: string[];
};
