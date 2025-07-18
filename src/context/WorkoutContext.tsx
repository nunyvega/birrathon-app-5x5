import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import {
	Exercise,
	Session,
	ExerciseSession,
	WorkingWeights,
	FailureTracker,
	WorkoutContextType,
	WORKOUT_CONFIG,
	EXERCISE_CONFIG,
	DEFAULT_WEIGHTS,
} from "../types/types";
import { StorageService } from "../services/storage";
import { ProgressionService } from "../services/progression";

// Create context
const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

// Helper function to generate UUID
const generateUUID = (): string => {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
		/[xy]/g,
		function (c) {
			const r = (Math.random() * 16) | 0;
			const v = c === "x" ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		}
	);
};

interface WorkoutProviderProps {
	children: ReactNode;
}

export const WorkoutProvider: React.FC<WorkoutProviderProps> = ({
	children,
}) => {
	// State
	const [currentWorkoutType, setCurrentWorkoutType] = useState<"A" | "B">(
		"A"
	);
	const [workingWeights, setWorkingWeights] =
		useState<WorkingWeights>(DEFAULT_WEIGHTS);
	const [sessions, setSessions] = useState<Session[]>([]);
	const [failureTracker, setFailureTracker] = useState<FailureTracker>({});
	const [isLoading, setIsLoading] = useState(true);
	const [currentSession, setCurrentSession] = useState<Session | null>(null);

	// Load data on mount
	useEffect(() => {
		loadData();
	}, []);

	// Load all data from storage
	const loadData = async (): Promise<void> => {
		try {
			setIsLoading(true);

			// Initialize app on first launch
			await StorageService.initializeApp();

			// Load data
			const [weights, sessionData, workoutType, tracker] =
				await Promise.all([
					StorageService.getWorkingWeights(),
					StorageService.getSessions(),
					StorageService.getCurrentWorkoutType(),
					StorageService.getFailureTracker(),
				]);

			setWorkingWeights(weights);
			setSessions(sessionData);
			setCurrentWorkoutType(workoutType);
			setFailureTracker(tracker);
		} catch (error) {
			console.error("Error loading data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	// Start a new workout
	const startWorkout = (): Session => {
		const workoutExercises = getCurrentWorkout();

		const exercises: ExerciseSession[] = workoutExercises.map(
			(exercise) => ({
				name: exercise,
				weight: workingWeights[exercise] || 0,
				sets: Array.from(
					{ length: EXERCISE_CONFIG[exercise].sets },
					() => ({
						reps: EXERCISE_CONFIG[exercise].reps,
						completed: false,
					})
				),
				targetSets: EXERCISE_CONFIG[exercise].sets,
				targetReps: EXERCISE_CONFIG[exercise].reps,
			})
		);

		const newSession: Session = {
			id: generateUUID(),
			date: new Date().toISOString(),
			workoutType: currentWorkoutType,
			exercises,
			completed: false,
			startTime: new Date().toISOString(),
		};

		setCurrentSession(newSession);
		return newSession;
	};

	// Complete a set
	const completeSet = (exerciseName: Exercise, setIndex: number): void => {
		if (!currentSession) return;

		const updatedSession = { ...currentSession };
		const exerciseIndex = updatedSession.exercises.findIndex(
			(ex) => ex.name === exerciseName
		);

		if (exerciseIndex === -1) return;

		const exercise = updatedSession.exercises[exerciseIndex];
		if (setIndex >= 0 && setIndex < exercise.sets.length) {
			exercise.sets[setIndex].completed =
				!exercise.sets[setIndex].completed;
			setCurrentSession(updatedSession);
		}
	};

	// Finish workout
	const finishWorkout = async (session: Session): Promise<void> => {
		try {
			setIsLoading(true);

			// Mark session as completed
			const completedSession: Session = {
				...session,
				completed: true,
				endTime: new Date().toISOString(),
			};

			// Save session
			await StorageService.addSession(completedSession);

			// Update working weights and failure tracker based on session results
			const { newWeights, updatedFailureTracker } =
				ProgressionService.updateWeightsFromSession(
					completedSession,
					workingWeights,
					failureTracker
				);

			// Save updated weights and failure tracker
			await Promise.all([
				StorageService.setWorkingWeights(newWeights),
				StorageService.setFailureTracker(updatedFailureTracker),
			]);

			// Toggle workout type for next session
			const nextWorkoutType = await StorageService.toggleWorkoutType();

			// Update local state
			setWorkingWeights(newWeights);
			setFailureTracker(updatedFailureTracker);
			setCurrentWorkoutType(nextWorkoutType);
			setSessions((prev) => [...prev, completedSession]);
			setCurrentSession(null);
		} catch (error) {
			console.error("Error finishing workout:", error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	// Update weight for a specific exercise
	const updateWeight = async (
		exercise: Exercise,
		weight: number
	): Promise<void> => {
		try {
			if (!ProgressionService.validateWeight(weight)) {
				throw new Error("Invalid weight");
			}

			const updatedWeights = { ...workingWeights, [exercise]: weight };
			await StorageService.setWorkingWeights(updatedWeights);
			setWorkingWeights(updatedWeights);

			// Also update current session if it exists and contains this exercise
			if (currentSession) {
				const updatedSession = { ...currentSession };
				const exerciseIndex = updatedSession.exercises.findIndex(
					(ex) => ex.name === exercise
				);

				if (exerciseIndex !== -1) {
					updatedSession.exercises[exerciseIndex].weight = weight;
					setCurrentSession(updatedSession);
				}
			}
		} catch (error) {
			console.error("Error updating weight:", error);
			throw error;
		}
	};

	// Get current workout exercises
	const getCurrentWorkout = (): Exercise[] => {
		return WORKOUT_CONFIG[currentWorkoutType];
	};

	// Get exercise history
	const getExerciseHistory = (exercise: Exercise): Session[] => {
		return sessions.filter(
			(session) =>
				session.exercises.some((ex) => ex.name === exercise) &&
				session.completed
		);
	};

	// Check if exercise can progress
	const canProgress = (exercise: Exercise): boolean => {
		const lastSession = sessions
			.filter(
				(s) =>
					s.completed &&
					s.exercises.some((ex) => ex.name === exercise)
			)
			.sort(
				(a, b) =>
					new Date(b.date).getTime() - new Date(a.date).getTime()
			)[0];

		if (!lastSession) return false;

		const exerciseSession = lastSession.exercises.find(
			(ex) => ex.name === exercise
		);
		return exerciseSession
			? ProgressionService.isSessionSuccessful(exerciseSession)
			: false;
	};

	// Get last session
	const getLastSession = (): Session | null => {
		if (sessions.length === 0) return null;
		return sessions.sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
		)[0];
	};

	// Get exercise stats
	const getExerciseStats = (exercise: Exercise) => {
		return ProgressionService.getProgressionStats(exercise, sessions);
	};

	// Get workout recommendations
	const getWorkoutRecommendations = () => {
		const lastSession = getLastSession();
		return ProgressionService.getWorkoutRecommendations(
			workingWeights,
			failureTracker,
			lastSession
		);
	};

	// Get estimated 1RM
	const getEstimatedOneRepMax = (exercise: Exercise): number => {
		return ProgressionService.calculateOneRepMax(
			workingWeights[exercise] || 0
		);
	};

	// Reset failure count for an exercise
	const resetFailureCount = async (exercise: Exercise): Promise<void> => {
		try {
			await StorageService.resetFailureCount(exercise);
			const updatedTracker = { ...failureTracker };
			delete updatedTracker[exercise];
			setFailureTracker(updatedTracker);
		} catch (error) {
			console.error("Error resetting failure count:", error);
			throw error;
		}
	};

	// Clear all data (for testing/reset)
	const clearAllData = async (): Promise<void> => {
		try {
			await StorageService.clearAllData();
			setWorkingWeights(DEFAULT_WEIGHTS);
			setSessions([]);
			setFailureTracker({});
			setCurrentWorkoutType("A");
			setCurrentSession(null);
		} catch (error) {
			console.error("Error clearing data:", error);
			throw error;
		}
	};

	// Get app statistics
	const getAppStats = async () => {
		return await StorageService.getAppStats();
	};

	// Context value
	const value: WorkoutContextType = {
		// State
		currentWorkoutType,
		workingWeights,
		sessions,
		failureTracker,
		isLoading,
		currentSession,

		// Actions
		startWorkout,
		completeSet,
		finishWorkout,
		loadData,
		updateWeight,
		resetFailureCount,
		clearAllData,

		// Getters
		getCurrentWorkout,
		getExerciseHistory,
		canProgress,
		getLastSession,
		getExerciseStats,
		getWorkoutRecommendations,
		getEstimatedOneRepMax,
		getAppStats,
	};

	return (
		<WorkoutContext.Provider value={value}>
			{children}
		</WorkoutContext.Provider>
	);
};

// Custom hook to use the workout context
export const useWorkout = (): WorkoutContextType => {
	const context = useContext(WorkoutContext);
	if (context === undefined) {
		throw new Error("useWorkout must be used within a WorkoutProvider");
	}
	return context;
};

export default WorkoutProvider;
