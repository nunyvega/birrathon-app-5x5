// Exercise types
export type Exercise = 'Squat' | 'Bench Press' | 'Barbell Row' | 'Overhead Press' | 'Deadlift';

// Set result for each individual set
export interface SetResult {
  reps: number;          // Target reps (5 for all exercises)
  completed: boolean;    // Whether the set was completed successfully
}

// Individual exercise in a workout session
export interface ExerciseSession {
  name: Exercise;
  weight: number;        // Weight in kg
  sets: SetResult[];     // Array of sets (5 sets for most exercises, 1 set for Deadlift)
  targetSets: number;    // Number of sets to perform (5 for most, 1 for Deadlift)
  targetReps: number;    // Target reps per set (always 5)
}

// Complete workout session
export interface Session {
  id: string;            // Unique identifier (UUID)
  date: string;          // ISO date string
  workoutType: 'A' | 'B'; // Workout A or B
  exercises: ExerciseSession[];
  completed: boolean;    // Whether the workout was completed
  startTime?: string;    // ISO timestamp when workout started
  endTime?: string;      // ISO timestamp when workout ended
}

// Working weights for each exercise
export interface WorkingWeights {
  [key: string]: number; // Exercise name -> current working weight
}

// Workout configuration
export interface WorkoutConfig {
  A: Exercise[];         // Exercises for Workout A
  B: Exercise[];         // Exercises for Workout B
}

// Progression settings
export interface ProgressionSettings {
  upperBodyIncrease: number;    // kg to add for upper body exercises (2.5)
  lowerBodyIncrease: number;    // kg to add for lower body exercises (5.0)
  deloadPercentage: number;     // Percentage to deload (0.1 for 10%)
  failureThreshold: number;     // Number of failures before deload (2)
}

// Failure tracking for deload logic
export interface FailureTracker {
  [key: string]: number;        // Exercise name -> consecutive failures
}

// App state context
export interface WorkoutContextType {
  // Current state
  currentWorkoutType: 'A' | 'B';
  workingWeights: WorkingWeights;
  sessions: Session[];
  failureTracker: FailureTracker;
  isLoading: boolean;
  currentSession: Session | null;
  
  // Actions
  startWorkout: () => Session;
  completeSet: (exerciseName: Exercise, setIndex: number) => void;
  finishWorkout: (session: Session) => Promise<void>;
  loadData: () => Promise<void>;
  updateWeight: (exercise: Exercise, weight: number) => Promise<void>;
  resetFailureCount: (exercise: Exercise) => Promise<void>;
  clearAllData: () => Promise<void>;
  
  // Getters
  getCurrentWorkout: () => Exercise[];
  getExerciseHistory: (exercise: Exercise) => Session[];
  canProgress: (exercise: Exercise) => boolean;
  getLastSession: () => Session | null;
  getExerciseStats: (exercise: Exercise) => {
    totalSessions: number;
    successfulSessions: number;
    successRate: number;
    weightProgression: Array<{ date: string; weight: number }>;
    currentStreak: number;
    bestStreak: number;
    totalWeightLifted: number;
  };
  getWorkoutRecommendations: () => {
    [key: string]: {
      recommendedWeight: number;
      status: 'progress' | 'repeat' | 'deload';
      message: string;
    };
  };
  getEstimatedOneRepMax: (exercise: Exercise) => number;
  getAppStats: () => Promise<{
    totalSessions: number;
    totalWorkouts: number;
    averageSessionsPerWeek: number;
    lastWorkoutDate: string | null;
  }>;
}

// Default starting weights (kg)
export const DEFAULT_WEIGHTS: WorkingWeights = {
  'Squat': 20,
  'Bench Press': 20,
  'Barbell Row': 20,
  'Overhead Press': 20,
  'Deadlift': 40,
};

// Workout definitions
export const WORKOUT_CONFIG: WorkoutConfig = {
  A: ['Squat', 'Bench Press', 'Barbell Row'],
  B: ['Squat', 'Overhead Press', 'Deadlift'],
};

// Exercise categories for progression
export const UPPER_BODY_EXERCISES: Exercise[] = ['Bench Press', 'Overhead Press', 'Barbell Row'];
export const LOWER_BODY_EXERCISES: Exercise[] = ['Squat', 'Deadlift'];

// Default progression settings
export const DEFAULT_PROGRESSION: ProgressionSettings = {
  upperBodyIncrease: 2.5,
  lowerBodyIncrease: 5.0,
  deloadPercentage: 0.1,
  failureThreshold: 2,
};

// Exercise configurations
export const EXERCISE_CONFIG = {
  'Squat': { sets: 5, reps: 5 },
  'Bench Press': { sets: 5, reps: 5 },
  'Barbell Row': { sets: 5, reps: 5 },
  'Overhead Press': { sets: 5, reps: 5 },
  'Deadlift': { sets: 1, reps: 5 },
};

// Storage keys
export const STORAGE_KEYS = {
  WEIGHTS: 'weights',
  SESSIONS: 'sessions',
  WORKOUT_TYPE: 'workoutType',
  FAILURE_TRACKER: 'failureTracker',
  FIRST_LAUNCH: 'firstLaunch',
} as const;

// Chart data types
export interface ChartDataPoint {
  value: number;
  date: string;
  label?: string;
}

export interface ChartData {
  data: ChartDataPoint[];
  exercise: Exercise;
}

// Rest timer types
export interface RestTimerState {
  isRunning: boolean;
  startTime: number;
  elapsedSeconds: number;
}

// UI state types
export interface UIState {
  isLoading: boolean;
  error: string | null;
  currentRestTimer: RestTimerState | null;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type ExerciseKey = keyof typeof EXERCISE_CONFIG;

// Helper type for strict string literals
export type Exact<T, U extends T> = U; 