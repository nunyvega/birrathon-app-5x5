import { StorageService } from '../services/storage';
import { Session, WorkingWeights, DEFAULT_WEIGHTS } from '../types';

// Mock AsyncStorage
const mockAsyncStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  multiRemove: jest.fn(),
};

// Mock AsyncStorage module
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

describe('StorageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getWorkingWeights', () => {
    it('should return stored weights when available', async () => {
      const mockWeights = { 'Squat': 50, 'Bench Press': 40 };
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockWeights));

      const result = await StorageService.getWorkingWeights();
      
      expect(result).toEqual(mockWeights);
      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('weights');
    });

    it('should return default weights when no stored weights', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await StorageService.getWorkingWeights();
      
      expect(result).toEqual(DEFAULT_WEIGHTS);
    });

    it('should return default weights on error', async () => {
      mockAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

      const result = await StorageService.getWorkingWeights();
      
      expect(result).toEqual(DEFAULT_WEIGHTS);
    });
  });

  describe('setWorkingWeights', () => {
    it('should save weights to storage', async () => {
      const weights: WorkingWeights = { 'Squat': 60, 'Bench Press': 50 };
      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      await StorageService.setWorkingWeights(weights);
      
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('weights', JSON.stringify(weights));
    });

    it('should throw error when storage fails', async () => {
      const weights: WorkingWeights = { 'Squat': 60 };
      mockAsyncStorage.setItem.mockRejectedValue(new Error('Storage error'));

      await expect(StorageService.setWorkingWeights(weights)).rejects.toThrow('Failed to save weights');
    });
  });

  describe('updateExerciseWeight', () => {
    it('should update specific exercise weight', async () => {
      const currentWeights = { 'Squat': 50, 'Bench Press': 40 };
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(currentWeights));
      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      await StorageService.updateExerciseWeight('Squat', 55);
      
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'weights',
        JSON.stringify({ 'Squat': 55, 'Bench Press': 40 })
      );
    });
  });

  describe('getSessions', () => {
    it('should return stored sessions', async () => {
      const mockSessions: Session[] = [
        {
          id: '1',
          date: '2023-01-01',
          workoutType: 'A',
          exercises: [],
          completed: true,
        },
      ];
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockSessions));

      const result = await StorageService.getSessions();
      
      expect(result).toEqual(mockSessions);
    });

    it('should return empty array when no sessions', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await StorageService.getSessions();
      
      expect(result).toEqual([]);
    });
  });

  describe('getCurrentWorkoutType', () => {
    it('should return stored workout type', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('B');

      const result = await StorageService.getCurrentWorkoutType();
      
      expect(result).toBe('B');
    });

    it('should return A as default', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await StorageService.getCurrentWorkoutType();
      
      expect(result).toBe('A');
    });
  });

  describe('toggleWorkoutType', () => {
    it('should toggle from A to B', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('A');
      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      const result = await StorageService.toggleWorkoutType();
      
      expect(result).toBe('B');
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('workoutType', 'B');
    });

    it('should toggle from B to A', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('B');
      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      const result = await StorageService.toggleWorkoutType();
      
      expect(result).toBe('A');
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('workoutType', 'A');
    });
  });

  describe('isFirstLaunch', () => {
    it('should return true when no first launch flag', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await StorageService.isFirstLaunch();
      
      expect(result).toBe(true);
    });

    it('should return false when first launch flag exists', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('false');

      const result = await StorageService.isFirstLaunch();
      
      expect(result).toBe(false);
    });
  });

  describe('clearAllData', () => {
    it('should remove all storage keys', async () => {
      mockAsyncStorage.multiRemove.mockResolvedValue(undefined);

      await StorageService.clearAllData();
      
      expect(mockAsyncStorage.multiRemove).toHaveBeenCalledWith([
        'weights',
        'sessions',
        'workoutType',
        'failureTracker',
        'firstLaunch',
      ]);
    });
  });
}); 