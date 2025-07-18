import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	Alert,
	Animated,
	Platform,
} from "react-native";
import { ExerciseSetCardProps } from "../types/types";
import { RestTimer } from "./RestTimer";
import {
	Colors,
	Typography,
	Spacing,
	Shadows,
	CardStyles,
	BorderRadius,
} from "../styles/AppleDesignSystem";

export const ExerciseSetCard: React.FC<ExerciseSetCardProps> = ({
	exercise,
	onSetComplete,
	onWeightChange,
	isEditable = false,
}) => {
	const [isTimerRunning, setIsTimerRunning] = useState(false);
	const [lastCompletedSet, setLastCompletedSet] = useState<number | null>(
		null
	);
	const [scaleAnim] = useState(new Animated.Value(1));

	// Auto-start timer when a set is completed
	useEffect(() => {
		const completedSets = exercise.sets.filter((set) => set.completed);
		const lastCompleted =
			completedSets.length > 0 ? completedSets.length - 1 : null;

		if (lastCompleted !== null && lastCompleted !== lastCompletedSet) {
			setLastCompletedSet(lastCompleted);
			setIsTimerRunning(true);
		}
	}, [exercise.sets, lastCompletedSet]);

	// Handle set completion with animation
	const handleSetToggle = (setIndex: number) => {
		// Animate button press
		Animated.sequence([
			Animated.timing(scaleAnim, {
				toValue: 0.95,
				duration: 100,
				useNativeDriver: true,
			}),
			Animated.timing(scaleAnim, {
				toValue: 1,
				duration: 100,
				useNativeDriver: true,
			}),
		]).start();

		onSetComplete(setIndex);
		// In a real app, you'd add haptic feedback here
		// Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	};

	// Handle weight change
	const handleWeightChange = () => {
		if (!onWeightChange) return;

		// Web-compatible prompt solution
		if (Platform.OS === "web") {
			const newWeightStr = window.prompt(
				`Update Weight\n\nCurrent weight: ${exercise.weight} kg\nEnter new weight:`,
				exercise.weight.toString()
			);

			if (newWeightStr !== null) {
				const newWeight = parseFloat(newWeightStr);
				if (!isNaN(newWeight) && newWeight > 0 && newWeight <= 500) {
					onWeightChange(newWeight);
				} else {
					Alert.alert(
						"Invalid Weight",
						"Please enter a valid weight between 1-500 kg.",
						[{ text: "OK", style: "default" }],
						{ cancelable: true }
					);
				}
			}
		} else {
			// Mobile platforms with Alert.prompt
			Alert.prompt(
				"Update Weight",
				`Current weight: ${exercise.weight} kg\nEnter new weight:`,
				[
					{ text: "Cancel", style: "cancel" },
					{
						text: "Update",
						style: "default",
						onPress: (value) => {
							if (value) {
								const newWeight = parseFloat(value);
								if (
									!isNaN(newWeight) &&
									newWeight > 0 &&
									newWeight <= 500
								) {
									onWeightChange(newWeight);
								} else {
									Alert.alert(
										"Invalid Weight",
										"Please enter a valid weight between 1-500 kg.",
										[{ text: "OK", style: "default" }],
										{ cancelable: true }
									);
								}
							}
						},
					},
				],
				"plain-text",
				exercise.weight.toString()
			);
		}
	};

	// Timer handlers
	const handleTimerToggle = () => {
		setIsTimerRunning(!isTimerRunning);
	};

	const handleTimerReset = () => {
		setIsTimerRunning(false);
	};

	// Get completion status
	const getCompletionStatus = () => {
		const completedSets = exercise.sets.filter(
			(set) => set.completed
		).length;
		const totalSets = exercise.sets.length;
		return { completed: completedSets, total: totalSets };
	};

	// Check if exercise is completed
	const isExerciseCompleted = () => {
		return exercise.sets.every((set) => set.completed);
	};

	// Get set button style
	const getSetButtonStyle = (setIndex: number) => {
		const set = exercise.sets[setIndex];
		const isCompleted = set.completed;

		return {
			...styles.setButton,
			backgroundColor: isCompleted
				? Colors.systemGreen
				: Colors.systemBackground,
			borderColor: isCompleted ? Colors.systemGreen : Colors.systemGray4,
			borderWidth: isCompleted ? 0 : 2,
			...Shadows.level1,
		};
	};

	// Get set button text style
	const getSetButtonTextStyle = (setIndex: number) => {
		const set = exercise.sets[setIndex];
		return {
			...styles.setButtonText,
			color: set.completed ? Colors.systemBackground : Colors.label,
		};
	};

	// Get completion percentage
	const getCompletionPercentage = () => {
		const { completed, total } = getCompletionStatus();
		return total > 0 ? (completed / total) * 100 : 0;
	};

	const { completed, total } = getCompletionStatus();

	return (
		<Animated.View
			style={[styles.container, { transform: [{ scale: scaleAnim }] }]}
		>
			{/* Exercise Header */}
			<View style={styles.header}>
				<View style={styles.exerciseInfo}>
					<Text style={styles.exerciseName}>{exercise.name}</Text>
					<View style={styles.weightSection}>
						<TouchableOpacity
							style={styles.weightButton}
							onPress={
								isEditable ? handleWeightChange : undefined
							}
							disabled={!isEditable}
							activeOpacity={0.7}
						>
							<Text style={styles.weightText}>
								{exercise.weight} kg
							</Text>
							{isEditable && (
								<View style={styles.editIndicator}>
									<Text style={styles.editText}>
										tap to edit
									</Text>
								</View>
							)}
						</TouchableOpacity>
					</View>
				</View>

				<View style={styles.statusSection}>
					<View style={styles.completionBadge}>
						<Text style={styles.completionText}>
							{completed}/{total}
						</Text>
					</View>
					{isExerciseCompleted() && (
						<View style={styles.completedBadge}>
							<Text style={styles.completedText}>✓ Complete</Text>
						</View>
					)}
				</View>
			</View>

			{/* Progress Bar */}
			<View style={styles.progressSection}>
				<View style={styles.progressBar}>
					<Animated.View
						style={[
							styles.progressFill,
							{ width: `${getCompletionPercentage()}%` },
						]}
					/>
				</View>
				<Text style={styles.progressText}>
					{Math.round(getCompletionPercentage())}% Complete
				</Text>
			</View>

			{/* Set Buttons */}
			<View style={styles.setsSection}>
				<Text style={styles.setsTitle}>
					Sets ({exercise.targetReps} reps each)
				</Text>
				<View style={styles.setsGrid}>
					{exercise.sets.map((set, index) => (
						<TouchableOpacity
							key={index}
							style={getSetButtonStyle(index)}
							onPress={() => handleSetToggle(index)}
							activeOpacity={0.8}
						>
							<Text style={getSetButtonTextStyle(index)}>
								{index + 1}
							</Text>
						</TouchableOpacity>
					))}
				</View>
			</View>

			{/* Rest Timer */}
			<View style={styles.timerSection}>
				<RestTimer
					isRunning={isTimerRunning}
					onToggle={handleTimerToggle}
					onReset={handleTimerReset}
					restTarget={90}
				/>
			</View>

			{/* Exercise Notes */}
			<View style={styles.notesSection}>
				<Text style={styles.notesText}>
					{exercise.name === "Deadlift"
						? "💪 Complete 1 set of 5 reps with perfect form"
						: "🏋️‍♂️ Complete 5 sets of 5 reps • Focus on form over speed"}
				</Text>
			</View>
		</Animated.View>
	);
};

const styles = {
	container: {
		...CardStyles.default,
		marginHorizontal: Spacing.screenPadding,
		marginVertical: Spacing.md,
	},
	header: {
		flexDirection: "row" as const,
		justifyContent: "space-between" as const,
		alignItems: "flex-start" as const,
		marginBottom: Spacing.xl,
	},
	exerciseInfo: {
		flex: 1,
	},
	exerciseName: {
		...Typography.title3,
		color: Colors.label,
		marginBottom: Spacing.md,
	},
	weightSection: {
		flexDirection: "row" as const,
		alignItems: "center" as const,
	},
	weightButton: {
		flexDirection: "row" as const,
		alignItems: "center" as const,
		backgroundColor: Colors.systemGray6,
		paddingHorizontal: Spacing.lg,
		paddingVertical: Spacing.md,
		borderRadius: BorderRadius.medium,
		...Shadows.level1,
	},
	weightText: {
		...Typography.headline,
		color: Colors.systemBlue,
		fontWeight: "600" as const,
	},
	editIndicator: {
		marginLeft: Spacing.md,
	},
	editText: {
		...Typography.caption2,
		color: Colors.secondaryLabel,
		fontStyle: "italic" as const,
	},
	statusSection: {
		alignItems: "flex-end" as const,
		gap: Spacing.md,
	},
	completionBadge: {
		backgroundColor: Colors.systemGray6,
		paddingHorizontal: Spacing.lg,
		paddingVertical: Spacing.sm,
		borderRadius: BorderRadius.medium,
	},
	completionText: {
		...Typography.callout,
		color: Colors.label,
		fontWeight: "600" as const,
	},
	completedBadge: {
		backgroundColor: Colors.systemGreen,
		paddingHorizontal: Spacing.lg,
		paddingVertical: Spacing.sm,
		borderRadius: BorderRadius.medium,
	},
	completedText: {
		...Typography.footnote,
		color: Colors.systemBackground,
		fontWeight: "600" as const,
	},
	progressSection: {
		marginBottom: Spacing.xl,
	},
	progressBar: {
		height: 6,
		backgroundColor: Colors.systemGray5,
		borderRadius: 3,
		overflow: "hidden" as const,
		marginBottom: Spacing.md,
	},
	progressFill: {
		height: 6,
		backgroundColor: Colors.systemGreen,
		borderRadius: 3,
	},
	progressText: {
		...Typography.caption1,
		color: Colors.secondaryLabel,
		textAlign: "center" as const,
	},
	setsSection: {
		marginBottom: Spacing.xl,
	},
	setsTitle: {
		...Typography.headline,
		color: Colors.label,
		marginBottom: Spacing.lg,
		textAlign: "center" as const,
	},
	setsGrid: {
		flexDirection: "row" as const,
		justifyContent: "space-between" as const,
		alignItems: "center" as const,
		paddingHorizontal: Spacing.md,
	},
	setButton: {
		width: 50,
		height: 50,
		borderRadius: 25,
		justifyContent: "center" as const,
		alignItems: "center" as const,
	},
	setButtonText: {
		...Typography.title3,
		fontWeight: "700" as const,
	},
	timerSection: {
		marginBottom: Spacing.xl,
	},
	notesSection: {
		backgroundColor: Colors.systemGray6,
		padding: Spacing.lg,
		borderRadius: BorderRadius.medium,
		alignItems: "center" as const,
	},
	notesText: {
		...Typography.callout,
		color: Colors.secondaryLabel,
		textAlign: "center" as const,
		lineHeight: 20,
	},
};

export default ExerciseSetCard;
