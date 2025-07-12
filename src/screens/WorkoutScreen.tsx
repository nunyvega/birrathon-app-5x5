import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Alert,
	SafeAreaView,
	StatusBar,
	Animated,
	Dimensions,
} from "react-native";
import { Exercise } from "../types";
import { useWorkout } from "../context/WorkoutContext";
import { ExerciseSetCard } from "../components/ExerciseSetCard";
import {
	Colors,
	Typography,
	Spacing,
	Shadows,
	CardStyles,
	ButtonStyles,
	BorderRadius,
} from "../styles/AppleDesignSystem";

const { width: screenWidth } = Dimensions.get("window");

export const WorkoutScreen: React.FC = () => {
	const {
		currentWorkoutType,
		getCurrentWorkout,
		startWorkout,
		completeSet,
		finishWorkout,
		currentSession,
		isLoading,
		updateWeight,
	} = useWorkout();

	const [workoutInProgress, setWorkoutInProgress] = useState(false);
	const [fadeAnim] = useState(new Animated.Value(0));

	// Check if there's a current session on mount
	useEffect(() => {
		if (currentSession && !currentSession.completed) {
			setWorkoutInProgress(true);
		}
	}, [currentSession]);

	// Animate content on load
	useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 300,
			useNativeDriver: true,
		}).start();
	}, [fadeAnim]);

	// Handle starting a new workout
	const handleStartWorkout = () => {
		const session = startWorkout();
		setWorkoutInProgress(true);

		// Add haptic feedback simulation
		// In a real app, you'd use Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
	};

	// Handle set completion
	const handleSetComplete = (exerciseName: Exercise, setIndex: number) => {
		completeSet(exerciseName, setIndex);
		// Add haptic feedback simulation
		// In a real app, you'd use Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
	};

	// Handle weight change
	const handleWeightChange = async (
		exercise: Exercise,
		newWeight: number
	) => {
		try {
			await updateWeight(exercise, newWeight);
			Alert.alert(
				"Weight Updated",
				`${exercise} weight updated to ${newWeight} kg`,
				[{ text: "OK", style: "default" }],
				{ cancelable: true }
			);
		} catch (error) {
			Alert.alert(
				"Error",
				"Failed to update weight. Please try again.",
				[{ text: "OK", style: "default" }],
				{ cancelable: true }
			);
		}
	};

	// Handle finishing workout
	const handleFinishWorkout = () => {
		if (!currentSession) return;

		// Check if all exercises are completed
		const allExercisesCompleted = currentSession.exercises.every(
			(exercise) => exercise.sets.every((set) => set.completed)
		);

		if (!allExercisesCompleted) {
			Alert.alert(
				"Incomplete Workout",
				"Some exercises are not completed. Are you sure you want to finish?",
				[
					{ text: "Cancel", style: "cancel" },
					{
						text: "Finish Anyway",
						onPress: confirmFinishWorkout,
						style: "destructive",
					},
				]
			);
		} else {
			confirmFinishWorkout();
		}
	};

	// Confirm and finish workout
	const confirmFinishWorkout = async () => {
		if (!currentSession) return;

		try {
			await finishWorkout(currentSession);
			setWorkoutInProgress(false);
			Alert.alert(
				"Workout Complete! 🎉",
				`Excellent work! Your ${currentWorkoutType} workout is complete. Weights have been updated for your next session.`,
				[{ text: "Awesome!", style: "default" }],
				{ cancelable: true }
			);
		} catch (error) {
			Alert.alert(
				"Error",
				"Failed to complete workout. Please try again.",
				[{ text: "OK", style: "default" }],
				{ cancelable: true }
			);
		}
	};

	// Get workout completion percentage
	const getWorkoutProgress = () => {
		if (!currentSession) return 0;

		const totalSets = currentSession.exercises.reduce((total, exercise) => {
			return total + exercise.sets.length;
		}, 0);

		const completedSets = currentSession.exercises.reduce(
			(total, exercise) => {
				return (
					total + exercise.sets.filter((set) => set.completed).length
				);
			},
			0
		);

		return totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
	};

	// Get current workout exercises
	const workoutExercises = getCurrentWorkout();

	if (isLoading) {
		return (
			<SafeAreaView style={styles.container}>
				<StatusBar
					barStyle="dark-content"
					backgroundColor={Colors.systemBackground}
				/>
				<View style={styles.loadingContainer}>
					<Text style={styles.loadingText}>
						Loading your workout...
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar
				barStyle="dark-content"
				backgroundColor={Colors.systemBackground}
			/>

			<Animated.View style={[styles.content, { opacity: fadeAnim }]}>
				{!workoutInProgress ? (
					// Pre-workout screen
					<ScrollView
						style={styles.scrollContainer}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.preWorkoutContainer}
					>
						{/* Header Section */}
						<View style={styles.headerSection}>
							<Text style={styles.workoutTitle}>
								Ready for Workout {currentWorkoutType}?
							</Text>
							<Text style={styles.workoutSubtitle}>
								Let's build some strength today
							</Text>
						</View>

						{/* Exercises Preview Card */}
						<View style={styles.exercisePreviewCard}>
							<Text style={styles.exercisePreviewTitle}>
								Today's Exercises
							</Text>
							<View style={styles.exerciseList}>
								{workoutExercises.map((exercise, index) => (
									<View
										key={index}
										style={styles.exercisePreviewItem}
									>
										<View style={styles.exerciseIcon}>
											<Text
												style={styles.exerciseIconText}
											>
												{index + 1}
											</Text>
										</View>
										<Text
											style={styles.exercisePreviewText}
										>
											{exercise}
										</Text>
									</View>
								))}
							</View>
						</View>

						{/* Start Button */}
						<TouchableOpacity
							style={styles.startButton}
							onPress={handleStartWorkout}
							activeOpacity={0.8}
						>
							<Text style={styles.startButtonText}>
								Start Workout
							</Text>
						</TouchableOpacity>

						{/* Tips Card */}
						<View style={styles.tipsCard}>
							<Text style={styles.tipsTitle}>💡 Quick Tips</Text>
							<Text style={styles.tipsText}>
								• Rest 90 seconds between sets{"\n"}• Focus on
								proper form{"\n"}• Stay hydrated throughout
							</Text>
						</View>
					</ScrollView>
				) : (
					// Workout in progress screen
					<View style={styles.workoutInProgressContainer}>
						{/* Progress Header */}
						<View style={styles.progressHeader}>
							<Text style={styles.progressTitle}>
								Workout {currentWorkoutType} in Progress
							</Text>
							<View style={styles.progressContainer}>
								<View style={styles.progressBar}>
									<Animated.View
										style={[
											styles.progressFill,
											{
												width: `${getWorkoutProgress()}%`,
											},
										]}
									/>
								</View>
								<Text style={styles.progressText}>
									{Math.round(getWorkoutProgress())}% Complete
								</Text>
							</View>
						</View>

						{/* Exercises ScrollView */}
						<ScrollView
							style={styles.exercisesScrollView}
							showsVerticalScrollIndicator={false}
							contentContainerStyle={styles.exercisesContainer}
						>
							{currentSession?.exercises.map(
								(exercise, index) => (
									<ExerciseSetCard
										key={index}
										exercise={exercise}
										onSetComplete={(setIndex) =>
											handleSetComplete(
												exercise.name,
												setIndex
											)
										}
										onWeightChange={(newWeight) =>
											handleWeightChange(
												exercise.name,
												newWeight
											)
										}
										isEditable={true}
									/>
								)
							)}

							{/* Finish Workout Button */}
							<View style={styles.finishButtonContainer}>
								<TouchableOpacity
									style={styles.finishButton}
									onPress={handleFinishWorkout}
									activeOpacity={0.8}
								>
									<Text style={styles.finishButtonText}>
										Complete Workout
									</Text>
								</TouchableOpacity>
							</View>
						</ScrollView>
					</View>
				)}
			</Animated.View>
		</SafeAreaView>
	);
};

const styles = {
	container: {
		flex: 1,
		backgroundColor: Colors.systemGroupedBackground,
	},
	content: {
		flex: 1,
	},
	scrollContainer: {
		flex: 1,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center" as const,
		alignItems: "center" as const,
		padding: Spacing.screenPadding,
	},
	loadingText: {
		...Typography.body,
		color: Colors.secondaryLabel,
		textAlign: "center" as const,
	},
	preWorkoutContainer: {
		paddingHorizontal: Spacing.screenPadding,
		paddingVertical: Spacing.xxxl,
		alignItems: "center" as const,
	},
	headerSection: {
		alignItems: "center" as const,
		marginBottom: Spacing.xxxxl,
	},
	workoutTitle: {
		...Typography.largeTitle,
		color: Colors.label,
		textAlign: "center" as const,
		marginBottom: Spacing.md,
	},
	workoutSubtitle: {
		...Typography.body,
		color: Colors.secondaryLabel,
		textAlign: "center" as const,
	},
	exercisePreviewCard: {
		...CardStyles.default,
		width: screenWidth - Spacing.screenPadding * 2,
		marginBottom: Spacing.xxxxl,
	},
	exercisePreviewTitle: {
		...Typography.headline,
		color: Colors.label,
		marginBottom: Spacing.lg,
		textAlign: "center" as const,
	},
	exerciseList: {
		gap: Spacing.lg,
	},
	exercisePreviewItem: {
		flexDirection: "row" as const,
		alignItems: "center" as const,
		paddingVertical: Spacing.md,
	},
	exerciseIcon: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: Colors.systemBlue,
		justifyContent: "center" as const,
		alignItems: "center" as const,
		marginRight: Spacing.xl,
	},
	exerciseIconText: {
		...Typography.footnote,
		color: Colors.systemBackground,
		fontWeight: "600" as const,
	},
	exercisePreviewText: {
		...Typography.body,
		color: Colors.label,
		flex: 1,
	},
	startButton: {
		...ButtonStyles.primary,
		width: screenWidth - Spacing.screenPadding * 2,
		marginBottom: Spacing.xxxxl,
	},
	startButtonText: {
		...Typography.headline,
		color: Colors.systemBackground,
		textAlign: "center" as const,
	},
	tipsCard: {
		...CardStyles.inset,
		width: screenWidth - Spacing.screenPadding * 2,
	},
	tipsTitle: {
		...Typography.headline,
		color: Colors.label,
		marginBottom: Spacing.lg,
	},
	tipsText: {
		...Typography.callout,
		color: Colors.secondaryLabel,
		lineHeight: 22,
	},
	workoutInProgressContainer: {
		flex: 1,
	},
	progressHeader: {
		backgroundColor: Colors.systemBackground,
		paddingHorizontal: Spacing.screenPadding,
		paddingVertical: Spacing.xl,
		borderBottomWidth: 0.5,
		borderBottomColor: Colors.separator,
		...Shadows.level1,
	},
	progressTitle: {
		...Typography.headline,
		color: Colors.label,
		textAlign: "center" as const,
		marginBottom: Spacing.lg,
	},
	progressContainer: {
		alignItems: "center" as const,
	},
	progressBar: {
		width: screenWidth - Spacing.screenPadding * 2,
		height: 6,
		backgroundColor: Colors.systemGray5,
		borderRadius: 3,
		overflow: "hidden" as const,
		marginBottom: Spacing.md,
	},
	progressFill: {
		height: 6,
		backgroundColor: Colors.systemBlue,
		borderRadius: 3,
	},
	progressText: {
		...Typography.footnote,
		color: Colors.secondaryLabel,
		textAlign: "center" as const,
	},
	exercisesScrollView: {
		flex: 1,
	},
	exercisesContainer: {
		paddingVertical: Spacing.lg,
	},
	finishButtonContainer: {
		paddingHorizontal: Spacing.screenPadding,
		paddingVertical: Spacing.xxxxl,
	},
	finishButton: {
		...ButtonStyles.primary,
		backgroundColor: Colors.systemGreen,
	},
	finishButtonText: {
		...Typography.headline,
		color: Colors.systemBackground,
		textAlign: "center" as const,
	},
};

export default WorkoutScreen;
