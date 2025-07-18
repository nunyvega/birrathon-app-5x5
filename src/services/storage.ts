import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Session,
  WorkingWeights,
  FailureTracker,
  STORAGE_KEYS,
  DEFAULT_WEIGHTS,
  Exercise,
} from  "../types/types"

/**
 * Storage service for managing app data persistence
 * Provides type-safe operations for AsyncStorage
 */
export class StorageService {
  /**
   * Get working weights from storage
   * Returns default weights if none exist
   */
  static async getWorkingWeights(): Promise<WorkingWeights> {
    try {
      const weights = await AsyncStorage.getItem(STORAGE_KEYS.WEIGHTS);
      if (weights) {
        return JSON.parse(weights);
      }
      // Return default weights if none exist
      return DEFAULT_WEIGHTS;
    } catch (error) {
      console.error('Error getting working weights:', error);
      return DEFAULT_WEIGHTS;
    }
  }

  /**
   * Save working weights to storage
   */
  static async setWorkingWeights(weights: WorkingWeights): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WEIGHTS, JSON.stringify(weights));
    } catch (error) {
      console.error('Error saving working weights:', error);
      throw new Error('Failed to save weights');
    }
  }

  /**
   * Update a single exercise weight
   */
  static async updateExerciseWeight(exercise: Exercise, weight: number): Promise<void> {
    try {
      const currentWeights = await this.getWorkingWeights();
      const updatedWeights = {
        ...currentWeights,
        [exercise]: weight,
      };
      await this.setWorkingWeights(updatedWeights);
    } catch (error) {
      console.error('Error updating exercise weight:', error);
      throw new Error('Failed to update exercise weight');
    }
  }

  /**
   * Get all workout sessions from storage
   */
  static async getSessions(): Promise<Session[]> {
    try {
      const sessions = await AsyncStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (sessions) {
        return JSON.parse(sessions);
      }
      return [];
    } catch (error) {
      console.error('Error getting sessions:', error);
      return [];
    }
  }

  /**
   * Save sessions to storage
   */
  static async setSessions(sessions: Session[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving sessions:', error);
      throw new Error('Failed to save sessions');
    }
  }

  /**
   * Add a new session
   */
  static async addSession(session: Session): Promise<void> {
    try {
      const currentSessions = await this.getSessions();
      const updatedSessions = [...currentSessions, session];
      await this.setSessions(updatedSessions);
    } catch (error) {
      console.error('Error adding session:', error);
      throw new Error('Failed to add session');
    }
  }

  /**
   * Update an existing session
   */
  static async updateSession(updatedSession: Session): Promise<void> {
    try {
      const currentSessions = await this.getSessions();
      const sessionIndex = currentSessions.findIndex(s => s.id === updatedSession.id);
      
      if (sessionIndex === -1) {
        throw new Error('Session not found');
      }

      const updatedSessions = [...currentSessions];
      updatedSessions[sessionIndex] = updatedSession;
      await this.setSessions(updatedSessions);
    } catch (error) {
      console.error('Error updating session:', error);
      throw new Error('Failed to update session');
    }
  }

  /**
   * Get sessions for a specific exercise
   */
  static async getExerciseSessions(exercise: Exercise): Promise<Session[]> {
    try {
      const allSessions = await this.getSessions();
      return allSessions.filter(session => 
        session.exercises.some(ex => ex.name === exercise)
      );
    } catch (error) {
      console.error('Error getting exercise sessions:', error);
      return [];
    }
  }

  /**
   * Get current workout type (A or B)
   */
  static async getCurrentWorkoutType(): Promise<'A' | 'B'> {
    try {
      const workoutType = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUT_TYPE);
      return workoutType === 'B' ? 'B' : 'A'; // Default to A
    } catch (error) {
      console.error('Error getting workout type:', error);
      return 'A';
    }
  }

  /**
   * Set current workout type
   */
  static async setCurrentWorkoutType(workoutType: 'A' | 'B'): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WORKOUT_TYPE, workoutType);
    } catch (error) {
      console.error('Error setting workout type:', error);
      throw new Error('Failed to set workout type');
    }
  }

  /**
   * Toggle workout type (A <-> B)
   */
  static async toggleWorkoutType(): Promise<'A' | 'B'> {
    try {
      const currentType = await this.getCurrentWorkoutType();
      const newType = currentType === 'A' ? 'B' : 'A';
      await this.setCurrentWorkoutType(newType);
      return newType;
    } catch (error) {
      console.error('Error toggling workout type:', error);
      throw new Error('Failed to toggle workout type');
    }
  }

  /**
   * Get failure tracker for deload logic
   */
  static async getFailureTracker(): Promise<FailureTracker> {
    try {
      const tracker = await AsyncStorage.getItem(STORAGE_KEYS.FAILURE_TRACKER);
      if (tracker) {
        return JSON.parse(tracker);
      }
      return {};
    } catch (error) {
      console.error('Error getting failure tracker:', error);
      return {};
    }
  }

  /**
   * Set failure tracker
   */
  static async setFailureTracker(tracker: FailureTracker): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FAILURE_TRACKER, JSON.stringify(tracker));
    } catch (error) {
      console.error('Error setting failure tracker:', error);
      throw new Error('Failed to set failure tracker');
    }
  }

  /**
   * Increment failure count for an exercise
   */
  static async incrementFailureCount(exercise: Exercise): Promise<number> {
    try {
      const tracker = await this.getFailureTracker();
      const currentCount = tracker[exercise] || 0;
      const newCount = currentCount + 1;
      
      await this.setFailureTracker({
        ...tracker,
        [exercise]: newCount,
      });
      
      return newCount;
    } catch (error) {
      console.error('Error incrementing failure count:', error);
      throw new Error('Failed to increment failure count');
    }
  }

  /**
   * Reset failure count for an exercise
   */
  static async resetFailureCount(exercise: Exercise): Promise<void> {
    try {
      const tracker = await this.getFailureTracker();
      const updatedTracker = { ...tracker };
      delete updatedTracker[exercise];
      await this.setFailureTracker(updatedTracker);
    } catch (error) {
      console.error('Error resetting failure count:', error);
      throw new Error('Failed to reset failure count');
    }
  }

  /**
   * Check if this is the first app launch
   */
  static async isFirstLaunch(): Promise<boolean> {
    try {
      const firstLaunch = await AsyncStorage.getItem(STORAGE_KEYS.FIRST_LAUNCH);
      return firstLaunch === null;
    } catch (error) {
      console.error('Error checking first launch:', error);
      return true;
    }
  }

  /**
   * Mark that the app has been launched
   */
  static async markFirstLaunchComplete(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FIRST_LAUNCH, 'false');
    } catch (error) {
      console.error('Error marking first launch complete:', error);
    }
  }

  /**
   * Get the last workout session
   */
  static async getLastSession(): Promise<Session | null> {
    try {
      const sessions = await this.getSessions();
      if (sessions.length === 0) {
        return null;
      }
      
      // Sort by date descending and return the most recent
      const sortedSessions = sessions.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      return sortedSessions[0];
    } catch (error) {
      console.error('Error getting last session:', error);
      return null;
    }
  }

  /**
   * Clear all data (useful for testing or reset)
   */
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.WEIGHTS,
        STORAGE_KEYS.SESSIONS,
        STORAGE_KEYS.WORKOUT_TYPE,
        STORAGE_KEYS.FAILURE_TRACKER,
        STORAGE_KEYS.FIRST_LAUNCH,
      ]);
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw new Error('Failed to clear data');
    }
  }

  /**
   * Initialize app data on first launch
   */
  static async initializeApp(): Promise<void> {
    try {
      const isFirst = await this.isFirstLaunch();
      
      if (isFirst) {
        // Set default weights
        await this.setWorkingWeights(DEFAULT_WEIGHTS);
        
        // Set initial workout type
        await this.setCurrentWorkoutType('A');
        
        // Initialize empty failure tracker
        await this.setFailureTracker({});
        
        // Mark first launch as complete
        await this.markFirstLaunchComplete();
      }
    } catch (error) {
      console.error('Error initializing app:', error);
      throw new Error('Failed to initialize app');
    }
  }

  /**
   * Get app statistics
   */
  static async getAppStats(): Promise<{
    totalSessions: number;
    totalWorkouts: number;
    averageSessionsPerWeek: number;
    lastWorkoutDate: string | null;
  }> {
    try {
      const sessions = await this.getSessions();
      const completedSessions = sessions.filter(s => s.completed);
      
      let lastWorkoutDate: string | null = null;
      if (completedSessions.length > 0) {
        const sortedSessions = completedSessions.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        lastWorkoutDate = sortedSessions[0].date;
      }

      // Calculate average sessions per week
      let averageSessionsPerWeek = 0;
      if (completedSessions.length > 0) {
        const firstSession = completedSessions[completedSessions.length - 1];
        const lastSession = completedSessions[0];
        const daysDiff = Math.max(1, Math.ceil(
          (new Date(lastSession.date).getTime() - new Date(firstSession.date).getTime()) / (1000 * 60 * 60 * 24)
        ));
        averageSessionsPerWeek = (completedSessions.length / daysDiff) * 7;
      }

      return {
        totalSessions: sessions.length,
        totalWorkouts: completedSessions.length,
        averageSessionsPerWeek: Math.round(averageSessionsPerWeek * 10) / 10,
        lastWorkoutDate,
      };
    } catch (error) {
      console.error('Error getting app stats:', error);
      return {
        totalSessions: 0,
        totalWorkouts: 0,
        averageSessionsPerWeek: 0,
        lastWorkoutDate: null,
      };
    }
  }
} 