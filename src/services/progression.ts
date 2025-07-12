import {
  Exercise,
  Session,
  ExerciseSession,
  WorkingWeights,
  FailureTracker,
  DEFAULT_PROGRESSION,
  UPPER_BODY_EXERCISES,
  LOWER_BODY_EXERCISES,
} from '../types';

/**
 * Progression service for handling weight progression logic
 * Implements the Strong 5x5 progression rules
 */
export class ProgressionService {
  /**
   * Calculate next weight for an exercise based on performance
   * @param exercise - The exercise to calculate progression for
   * @param currentWeight - Current working weight
   * @param lastSession - The last session data
   * @param failureCount - Number of consecutive failures
   * @returns New weight to use
   */
  static calculateNextWeight(
    exercise: Exercise,
    currentWeight: number,
    lastSession: Session | null,
    failureCount: number = 0
  ): number {
    // If no previous session, keep current weight
    if (!lastSession) {
      return currentWeight;
    }

    // Find the exercise in the last session
    const exerciseSession = lastSession.exercises.find(ex => ex.name === exercise);
    if (!exerciseSession) {
      return currentWeight;
    }

    // Check if all sets were completed successfully
    const allSetsCompleted = exerciseSession.sets.every(set => set.completed);

    // If all sets were completed, progress weight
    if (allSetsCompleted) {
      return this.progressWeight(exercise, currentWeight);
    }

    // If failed and this is the second consecutive failure, deload
    if (failureCount >= DEFAULT_PROGRESSION.failureThreshold) {
      return this.deloadWeight(currentWeight);
    }

    // Otherwise, repeat the same weight
    return currentWeight;
  }

  /**
   * Progress weight based on exercise type
   * Upper body: +2.5 kg, Lower body: +5 kg
   */
  static progressWeight(exercise: Exercise, currentWeight: number): number {
    const isUpperBody = UPPER_BODY_EXERCISES.includes(exercise);
    const increment = isUpperBody 
      ? DEFAULT_PROGRESSION.upperBodyIncrease 
      : DEFAULT_PROGRESSION.lowerBodyIncrease;
    
    return currentWeight + increment;
  }

  /**
   * Deload weight by 10% and round to nearest 2.5kg
   */
  static deloadWeight(currentWeight: number): number {
    const deloadedWeight = currentWeight * (1 - DEFAULT_PROGRESSION.deloadPercentage);
    return this.roundToNearestIncrement(deloadedWeight, 2.5);
  }

  /**
   * Round weight to nearest increment (usually 2.5kg)
   */
  static roundToNearestIncrement(weight: number, increment: number = 2.5): number {
    return Math.round(weight / increment) * increment;
  }

  /**
   * Check if an exercise session was successful (all sets completed)
   */
  static isSessionSuccessful(exerciseSession: ExerciseSession): boolean {
    return exerciseSession.sets.every(set => set.completed);
  }

  /**
   * Calculate total reps completed in a session
   */
  static getTotalRepsCompleted(exerciseSession: ExerciseSession): number {
    return exerciseSession.sets.reduce((total, set) => {
      return total + (set.completed ? set.reps : 0);
    }, 0);
  }

  /**
   * Calculate success rate for an exercise session (percentage of reps completed)
   */
  static getSuccessRate(exerciseSession: ExerciseSession): number {
    const totalReps = exerciseSession.sets.length * exerciseSession.targetReps;
    const completedReps = this.getTotalRepsCompleted(exerciseSession);
    return totalReps > 0 ? (completedReps / totalReps) * 100 : 0;
  }

  /**
   * Update working weights based on session results
   */
  static updateWeightsFromSession(
    session: Session,
    currentWeights: WorkingWeights,
    failureTracker: FailureTracker
  ): {
    newWeights: WorkingWeights;
    updatedFailureTracker: FailureTracker;
  } {
    const newWeights = { ...currentWeights };
    const updatedFailureTracker = { ...failureTracker };

    session.exercises.forEach(exerciseSession => {
      const exercise = exerciseSession.name;
      const currentWeight = currentWeights[exercise] || 0;
      const isSuccessful = this.isSessionSuccessful(exerciseSession);
      const currentFailures = failureTracker[exercise] || 0;

      if (isSuccessful) {
        // Reset failure count and progress weight
        delete updatedFailureTracker[exercise];
        newWeights[exercise] = this.progressWeight(exercise, currentWeight);
      } else {
        // Increment failure count
        const newFailureCount = currentFailures + 1;
        updatedFailureTracker[exercise] = newFailureCount;

        // If reached failure threshold, deload
        if (newFailureCount >= DEFAULT_PROGRESSION.failureThreshold) {
          newWeights[exercise] = this.deloadWeight(currentWeight);
          delete updatedFailureTracker[exercise]; // Reset after deload
        } else {
          // Keep the same weight
          newWeights[exercise] = currentWeight;
        }
      }
    });

    return {
      newWeights,
      updatedFailureTracker,
    };
  }

  /**
   * Get recommended starting weight for an exercise
   */
  static getRecommendedStartingWeight(exercise: Exercise): number {
    const recommendations = {
      'Squat': 40,
      'Bench Press': 30,
      'Barbell Row': 30,
      'Overhead Press': 25,
      'Deadlift': 60,
    };

    return recommendations[exercise] || 20;
  }

  /**
   * Validate weight (must be positive and reasonable)
   */
  static validateWeight(weight: number): boolean {
    return weight > 0 && weight <= 500; // Reasonable upper limit
  }

  /**
   * Get progression stats for an exercise
   */
  static getProgressionStats(
    exercise: Exercise,
    sessions: Session[]
  ): {
    totalSessions: number;
    successfulSessions: number;
    successRate: number;
    weightProgression: Array<{ date: string; weight: number }>;
    currentStreak: number;
    bestStreak: number;
    totalWeightLifted: number;
  } {
    const exerciseSessions = sessions
      .filter(session => session.exercises.some(ex => ex.name === exercise))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const totalSessions = exerciseSessions.length;
    const successfulSessions = exerciseSessions.filter(session => {
      const exerciseSession = session.exercises.find(ex => ex.name === exercise);
      return exerciseSession && this.isSessionSuccessful(exerciseSession);
    }).length;

    const successRate = totalSessions > 0 ? (successfulSessions / totalSessions) * 100 : 0;

    // Weight progression data
    const weightProgression = exerciseSessions.map(session => {
      const exerciseSession = session.exercises.find(ex => ex.name === exercise);
      return {
        date: session.date,
        weight: exerciseSession?.weight || 0,
      };
    });

    // Calculate streaks
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    for (let i = exerciseSessions.length - 1; i >= 0; i--) {
      const session = exerciseSessions[i];
      const exerciseSession = session.exercises.find(ex => ex.name === exercise);
      const isSuccessful = exerciseSession && this.isSessionSuccessful(exerciseSession);

      if (isSuccessful) {
        tempStreak++;
        if (i === exerciseSessions.length - 1) {
          currentStreak = tempStreak;
        }
      } else {
        bestStreak = Math.max(bestStreak, tempStreak);
        tempStreak = 0;
      }
    }
    bestStreak = Math.max(bestStreak, tempStreak);

    // Calculate total weight lifted
    const totalWeightLifted = exerciseSessions.reduce((total, session) => {
      const exerciseSession = session.exercises.find(ex => ex.name === exercise);
      if (exerciseSession) {
        const completedSets = exerciseSession.sets.filter(set => set.completed).length;
        return total + (exerciseSession.weight * completedSets * exerciseSession.targetReps);
      }
      return total;
    }, 0);

    return {
      totalSessions,
      successfulSessions,
      successRate,
      weightProgression,
      currentStreak,
      bestStreak,
      totalWeightLifted,
    };
  }

  /**
   * Get next workout recommendations
   */
  static getWorkoutRecommendations(
    currentWeights: WorkingWeights,
    failureTracker: FailureTracker,
    lastSession: Session | null
  ): {
    [key: string]: {
      recommendedWeight: number;
      status: 'progress' | 'repeat' | 'deload';
      message: string;
    };
  } {
    const recommendations: any = {};

    Object.entries(currentWeights).forEach(([exercise, weight]) => {
      const typedExercise = exercise as Exercise;
      const failures = failureTracker[exercise] || 0;
      let status: 'progress' | 'repeat' | 'deload' = 'progress';
      let message = `Progress to ${weight + (UPPER_BODY_EXERCISES.includes(typedExercise) ? 2.5 : 5)} kg`;

      if (lastSession) {
        const exerciseSession = lastSession.exercises.find(ex => ex.name === exercise);
        if (exerciseSession) {
          const wasSuccessful = this.isSessionSuccessful(exerciseSession);
          
          if (!wasSuccessful) {
            if (failures >= DEFAULT_PROGRESSION.failureThreshold - 1) {
              status = 'deload';
              const deloadWeight = this.deloadWeight(weight);
              message = `Deload to ${deloadWeight} kg after ${failures + 1} failures`;
            } else {
              status = 'repeat';
              message = `Repeat ${weight} kg (${failures + 1} failure${failures > 0 ? 's' : ''})`;
            }
          }
        }
      }

      recommendations[exercise] = {
        recommendedWeight: weight,
        status,
        message,
      };
    });

    return recommendations;
  }

  /**
   * Calculate theoretical 1RM based on working weight
   * Uses the Brzycki formula: 1RM = weight × (36 / (37 - reps))
   */
  static calculateOneRepMax(weight: number, reps: number = 5): number {
    if (reps === 1) return weight;
    const oneRM = weight * (36 / (37 - reps));
    return Math.round(oneRM * 10) / 10; // Round to 1 decimal place
  }

  /**
   * Get estimated 1RM for all exercises
   */
  static getEstimatedOneRepMaxes(weights: WorkingWeights): WorkingWeights {
    const oneRepMaxes: WorkingWeights = {};
    
    Object.entries(weights).forEach(([exercise, weight]) => {
      oneRepMaxes[exercise] = this.calculateOneRepMax(weight);
    });

    return oneRepMaxes;
  }
} 