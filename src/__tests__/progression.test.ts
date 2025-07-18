import { ProgressionService } from '../services/progression';
import { Exercise, Session, ExerciseSession } from  "../types/types"

describe('ProgressionService', () => {
  describe('progressWeight', () => {
    it('should add 2.5kg for upper body exercises', () => {
      const result = ProgressionService.progressWeight('Bench Press', 50);
      expect(result).toBe(52.5);
    });

    it('should add 5kg for lower body exercises', () => {
      const result = ProgressionService.progressWeight('Squat', 50);
      expect(result).toBe(55);
    });

    it('should add 2.5kg for overhead press', () => {
      const result = ProgressionService.progressWeight('Overhead Press', 40);
      expect(result).toBe(42.5);
    });

    it('should add 5kg for deadlift', () => {
      const result = ProgressionService.progressWeight('Deadlift', 60);
      expect(result).toBe(65);
    });
  });

  describe('deloadWeight', () => {
    it('should reduce weight by 10% and round to nearest 2.5kg', () => {
      const result = ProgressionService.deloadWeight(50);
      expect(result).toBe(45); // 50 * 0.9 = 45
    });

    it('should round correctly for non-divisible weights', () => {
      const result = ProgressionService.deloadWeight(47);
      expect(result).toBe(42.5); // 47 * 0.9 = 42.3, rounds to 42.5
    });
  });

  describe('roundToNearestIncrement', () => {
    it('should round to nearest 2.5kg by default', () => {
      expect(ProgressionService.roundToNearestIncrement(51.2)).toBe(50);
      expect(ProgressionService.roundToNearestIncrement(51.8)).toBe(52.5);
      expect(ProgressionService.roundToNearestIncrement(48.7)).toBe(50);
    });

    it('should round to custom increment', () => {
      expect(ProgressionService.roundToNearestIncrement(51.2, 5)).toBe(50);
      expect(ProgressionService.roundToNearestIncrement(53.8, 5)).toBe(55);
    });
  });

  describe('isSessionSuccessful', () => {
    it('should return true when all sets are completed', () => {
      const exerciseSession: ExerciseSession = {
        name: 'Squat',
        weight: 50,
        sets: [
          { reps: 5, completed: true },
          { reps: 5, completed: true },
          { reps: 5, completed: true },
        ],
        targetSets: 3,
        targetReps: 5,
      };

      const result = ProgressionService.isSessionSuccessful(exerciseSession);
      expect(result).toBe(true);
    });

    it('should return false when not all sets are completed', () => {
      const exerciseSession: ExerciseSession = {
        name: 'Squat',
        weight: 50,
        sets: [
          { reps: 5, completed: true },
          { reps: 5, completed: false },
          { reps: 5, completed: true },
        ],
        targetSets: 3,
        targetReps: 5,
      };

      const result = ProgressionService.isSessionSuccessful(exerciseSession);
      expect(result).toBe(false);
    });
  });

  describe('calculateNextWeight', () => {
    const createMockSession = (exerciseName: Exercise, weight: number, allCompleted: boolean): Session => ({
      id: '1',
      date: '2023-01-01',
      workoutType: 'A',
      exercises: [{
        name: exerciseName,
        weight,
        sets: [
          { reps: 5, completed: allCompleted },
          { reps: 5, completed: allCompleted },
          { reps: 5, completed: allCompleted },
        ],
        targetSets: 3,
        targetReps: 5,
      }],
      completed: true,
    });

    it('should progress weight when all sets completed', () => {
      const lastSession = createMockSession('Squat', 50, true);
      const result = ProgressionService.calculateNextWeight('Squat', 50, lastSession, 0);
      expect(result).toBe(55); // 50 + 5 for lower body
    });

    it('should keep same weight when session failed but not at threshold', () => {
      const lastSession = createMockSession('Squat', 50, false);
      const result = ProgressionService.calculateNextWeight('Squat', 50, lastSession, 1);
      expect(result).toBe(50);
    });

    it('should deload when failure threshold reached', () => {
      const lastSession = createMockSession('Squat', 50, false);
      const result = ProgressionService.calculateNextWeight('Squat', 50, lastSession, 2);
      expect(result).toBe(45); // 50 * 0.9 = 45
    });

    it('should keep current weight when no previous session', () => {
      const result = ProgressionService.calculateNextWeight('Squat', 50, null, 0);
      expect(result).toBe(50);
    });
  });

  describe('validateWeight', () => {
    it('should return true for valid weights', () => {
      expect(ProgressionService.validateWeight(20)).toBe(true);
      expect(ProgressionService.validateWeight(100)).toBe(true);
      expect(ProgressionService.validateWeight(250)).toBe(true);
    });

    it('should return false for invalid weights', () => {
      expect(ProgressionService.validateWeight(0)).toBe(false);
      expect(ProgressionService.validateWeight(-10)).toBe(false);
      expect(ProgressionService.validateWeight(600)).toBe(false);
    });
  });

  describe('calculateOneRepMax', () => {
    it('should calculate 1RM using Brzycki formula', () => {
      const result = ProgressionService.calculateOneRepMax(100, 5);
      // 100 * (36 / (37 - 5)) = 100 * (36 / 32) = 112.5
      expect(result).toBe(112.5);
    });

    it('should return the same weight for 1 rep', () => {
      const result = ProgressionService.calculateOneRepMax(100, 1);
      expect(result).toBe(100);
    });

    it('should round to 1 decimal place', () => {
      const result = ProgressionService.calculateOneRepMax(100, 3);
      expect(result).toBeCloseTo(105.9, 1);
    });
  });

  describe('getTotalRepsCompleted', () => {
    it('should count completed reps correctly', () => {
      const exerciseSession: ExerciseSession = {
        name: 'Squat',
        weight: 50,
        sets: [
          { reps: 5, completed: true },
          { reps: 5, completed: false },
          { reps: 5, completed: true },
        ],
        targetSets: 3,
        targetReps: 5,
      };

      const result = ProgressionService.getTotalRepsCompleted(exerciseSession);
      expect(result).toBe(10); // 5 + 0 + 5
    });
  });

  describe('getSuccessRate', () => {
    it('should calculate success rate correctly', () => {
      const exerciseSession: ExerciseSession = {
        name: 'Squat',
        weight: 50,
        sets: [
          { reps: 5, completed: true },
          { reps: 5, completed: false },
          { reps: 5, completed: true },
        ],
        targetSets: 3,
        targetReps: 5,
      };

      const result = ProgressionService.getSuccessRate(exerciseSession);
      expect(result).toBe(66.67); // (10 / 15) * 100 ≈ 66.67
    });
  });
}); 