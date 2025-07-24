import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	SafeAreaView,
	StatusBar,
	Dimensions,
	Animated,
} from "react-native";

import { useWorkout } from "../context/WorkoutContext";
import { ProgressLineChart } from "../components/ProgressLineChart";
import {
	Colors,
	Typography,
	Spacing,
	Shadows,
	CardStyles,
	ButtonStyles,
	BorderRadius,
} from "../styles/AppleDesignSystem";
import { Exercise } from "../types/types";
import { useTranslation } from "react-i18next";

const { width: screenWidth } = Dimensions.get("window");

const EXERCISES: Exercise[] = [
	"Squat",
	"Bench Press",
	"Barbell Row",
	"Overhead Press",
	"Deadlift",
];

export const HistoryScreen: React.FC = () => {
	const {
		sessions,
		getExerciseStats,
		getEstimatedOneRepMax,
		workingWeights,
		isLoading,
	} = useWorkout();

	const [selectedExercise, setSelectedExercise] = useState<Exercise>("Squat");
	const [showStats, setShowStats] = useState(false);
	const [fadeAnim] = useState(new Animated.Value(0));
	const { t } = useTranslation();

	// Animate content on load
	useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 300,
			useNativeDriver: true,
		}).start();
	}, [fadeAnim]);

	// Get exercise data
	const exerciseHistory = sessions.filter(
		(session) =>
			session.exercises.some((ex) => ex.name === selectedExercise) &&
			session.completed
	);

	const exerciseStats = getExerciseStats(selectedExercise);
	const estimatedOneRM = getEstimatedOneRepMax(selectedExercise);
	const currentWeight = workingWeights[selectedExercise] || 0;

	// Handle exercise selection
	const handleExerciseSelect = (exercise: Exercise) => {
		setSelectedExercise(exercise);
		setShowStats(false);
	};

	// Toggle stats view
	const toggleStats = () => {
		setShowStats(!showStats);
	};

	// Get exercise button style
	const getExerciseButtonStyle = (exercise: Exercise) => {
		const isSelected = exercise === selectedExercise;
		return {
			...styles.exerciseButton,
			backgroundColor: isSelected
				? Colors.systemBlue
				: Colors.systemGray6,
		};
	};

	// Get exercise button text style
	const getExerciseButtonTextStyle = (exercise: Exercise) => {
		const isSelected = exercise === selectedExercise;
		return {
			...styles.exerciseButtonText,
			color: isSelected ? Colors.systemBackground : Colors.label,
		};
	};

	// Format date for display
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	// Get progress summary
	const getProgressSummary = () => {
		if (exerciseHistory.length === 0) {
			return t("noDataYet");
		}

		const firstSession = exerciseHistory[0];
		const lastSession = exerciseHistory[exerciseHistory.length - 1];

		const firstWeight =
			firstSession.exercises.find((ex) => ex.name === selectedExercise)
				?.weight || 0;
		const lastWeight =
			lastSession.exercises.find((ex) => ex.name === selectedExercise)
				?.weight || 0;

		const weightIncrease = lastWeight - firstWeight;
		const timeSpan = Math.ceil(
			(new Date(lastSession.date).getTime() -
				new Date(firstSession.date).getTime()) /
				(1000 * 60 * 60 * 24)
		);

		return weightIncrease > 0
			? t("progressOverDays", { weight: weightIncrease, days: timeSpan })
			: t("changeOverDays", { weight: weightIncrease, days: timeSpan });
	};

	// Get success rate color
	const getSuccessRateColor = (rate: number) => {
		if (rate >= 80) return Colors.systemGreen;
		if (rate >= 60) return Colors.systemOrange;
		return Colors.systemRed;
	};

	if (isLoading) {
		return (
			<SafeAreaView style={styles.container}>
				<StatusBar
					barStyle="dark-content"
					backgroundColor={Colors.systemBackground}
				/>
				<View style={styles.loadingContainer}>
					<Text style={styles.loadingText}>
						{t("loadingProgress")}
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
				{/* Header */}
				<View style={styles.header}>
					<Text style={styles.headerTitle}>
						{t("progressHistory")}
					</Text>
					<TouchableOpacity
						onPress={toggleStats}
						style={styles.statsToggleButton}
						activeOpacity={0.8}
					>
						<Text style={styles.statsToggleText}>
							{showStats ? t("hideDetails") : t("showDetails")}
						</Text>
					</TouchableOpacity>
				</View>

				{/* Exercise Selection */}
				<View style={styles.exerciseSelectionSection}>
					<Text style={styles.sectionTitle}>
						{t("selectExercise")}
					</Text>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						style={styles.exerciseScrollView}
						contentContainerStyle={styles.exerciseScrollContainer}
					>
						{EXERCISES.map((exercise) => (
							<TouchableOpacity
								key={exercise}
								style={getExerciseButtonStyle(exercise)}
								onPress={() => handleExerciseSelect(exercise)}
								activeOpacity={0.8}
							>
								<Text
									style={getExerciseButtonTextStyle(exercise)}
								>
									{t(exercise)}
								</Text>
							</TouchableOpacity>
						))}
					</ScrollView>
				</View>

				<ScrollView
					style={styles.scrollView}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.scrollContainer}
				>
					{/* Current Stats Card */}
					<View style={styles.statsCard}>
						<View style={styles.statsCardHeader}>
							<Text style={styles.statsCardTitle}>
								{t(selectedExercise)}
							</Text>
							<Text style={styles.progressSummary}>
								{getProgressSummary()}
							</Text>
						</View>

						<View style={styles.statsGrid}>
							<View style={styles.statItem}>
								<Text style={styles.statValue}>
									{currentWeight}kg
								</Text>
								<Text style={styles.statLabel}>
									{t("currentWeight")}
								</Text>
							</View>
							<View style={styles.statItem}>
								<Text style={styles.statValue}>
									{Math.round(estimatedOneRM)}kg
								</Text>
								<Text style={styles.statLabel}>
									{t("estimated1RM")}
								</Text>
							</View>
							<View style={styles.statItem}>
								<Text style={styles.statValue}>
									{exerciseHistory.length}
								</Text>
								<Text style={styles.statLabel}>
									{t("totalSessions")}
								</Text>
							</View>
						</View>
					</View>

					{/* Detailed Stats (if enabled) */}
					{showStats && (
						<View style={styles.detailedStatsCard}>
							<Text style={styles.cardTitle}>
								{t("detailedStatistics")}
							</Text>
							<View style={styles.detailedStatsGrid}>
								<View style={styles.detailedStatRow}>
									<Text style={styles.detailedStatLabel}>
										{t("successRate")}
									</Text>
									<Text
										style={[
											styles.detailedStatValue,
											{
												color: getSuccessRateColor(
													exerciseStats.successRate
												),
											},
										]}
									>
										{Math.round(exerciseStats.successRate)}%
									</Text>
								</View>
								<View style={styles.detailedStatRow}>
									<Text style={styles.detailedStatLabel}>
										{t("successfulSessions")}
									</Text>
									<Text style={styles.detailedStatValue}>
										{exerciseStats.successfulSessions}
									</Text>
								</View>
								<View style={styles.detailedStatRow}>
									<Text style={styles.detailedStatLabel}>
										{t("currentStreak")}
									</Text>
									<Text style={styles.detailedStatValue}>
										{exerciseStats.currentStreak}
									</Text>
								</View>
								<View style={styles.detailedStatRow}>
									<Text style={styles.detailedStatLabel}>
										{t("bestStreak")}
									</Text>
									<Text style={styles.detailedStatValue}>
										{exerciseStats.bestStreak}
									</Text>
								</View>
								<View style={styles.detailedStatRow}>
									<Text style={styles.detailedStatLabel}>
										{t("totalWeightLifted")}
									</Text>
									<Text style={styles.detailedStatValue}>
										{Math.round(
											exerciseStats.totalWeightLifted
										)}
										kg
									</Text>
								</View>
							</View>
						</View>
					)}

					{/* Progress Chart */}
					<ProgressLineChart
						exercise={selectedExercise}
						sessions={sessions}
						height={300}
					/>

					{/* Recent Sessions */}
					{exerciseHistory.length > 0 && (
						<View style={styles.recentSessionsCard}>
							<Text style={styles.cardTitle}>
								{t("recentSessions")}
							</Text>
							<View>
								<View style={styles.legend}>
									<View style={styles.legendItem}>
										<View
											style={[
												styles.legendDot,
												{
													backgroundColor:
														Colors.systemGreen,
												},
											]}
										/>
										<Text style={styles.legendText}>
											{t("successfulSession")}
										</Text>
									</View>
									<View style={styles.legendItem}>
										<View
											style={[
												styles.legendDot,
												{
													backgroundColor:
														Colors.systemRed,
												},
											]}
										/>
										<Text style={styles.legendText}>
											{t("incompleteSession")}
										</Text>
									</View>
								</View>
							</View>
							<View style={styles.sessionsList}>
								{exerciseHistory
									.slice(-8)
									.reverse()
									.map((session, index) => {
										const exerciseSession =
											session.exercises.find(
												(ex) =>
													ex.name === selectedExercise
											);
										const completedSets =
											exerciseSession?.sets.filter(
												(set) => set.completed
											).length || 0;
										const totalSets =
											exerciseSession?.sets.length || 0;
										const isSuccessful =
											completedSets === totalSets;

										return (
											<View
												key={session.id}
												style={[
													styles.sessionItem,
													index ===
														exerciseHistory
															.slice(-8)
															.reverse().length -
															1 &&
														styles.lastSessionItem,
												]}
											>
												<View
													style={styles.sessionInfo}
												>
													<Text
														style={
															styles.sessionDate
														}
													>
														{formatDate(
															session.date
														)}
													</Text>
													<Text
														style={
															styles.sessionWeight
														}
													>
														{
															exerciseSession?.weight
														}
														kg
													</Text>
												</View>
												<View
													style={styles.sessionStatus}
												>
													<Text
														style={
															styles.sessionSets
														}
													>
														{completedSets}/
														{totalSets}
													</Text>
													<View
														style={[
															styles.sessionStatusDot,
															{
																backgroundColor:
																	isSuccessful
																		? Colors.systemGreen
																		: Colors.systemRed,
															},
														]}
													/>
												</View>
											</View>
										);
									})}
							</View>
						</View>
					)}

					{/* Empty State */}
					{exerciseHistory.length === 0 && (
						<View style={styles.emptyStateCard}>
							<Text style={styles.emptyStateTitle}>
								{t("noDataYet")}
							</Text>
							<Text style={styles.emptyStateText}>
								{t("completeSomeWorkouts", {
									exercise: t(selectedExercise),
								})}
							</Text>
						</View>
					)}
				</ScrollView>
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
	header: {
		backgroundColor: Colors.systemBackground,
		paddingHorizontal: Spacing.screenPadding,
		paddingVertical: Spacing.xl,
		borderBottomWidth: 0.5,
		borderBottomColor: Colors.separator,
		flexDirection: "row" as const,
		justifyContent: "space-between" as const,
		alignItems: "center" as const,
		...Shadows.level1,
	},
	headerTitle: {
		...Typography.headline,
		color: Colors.label,
	},
	statsToggleButton: {
		...ButtonStyles.compact,
		paddingHorizontal: Spacing.lg,
		paddingVertical: Spacing.sm,
	},
	statsToggleText: {
		...Typography.footnote,
		color: Colors.systemBackground,
		fontWeight: "600" as const,
	},
	exerciseSelectionSection: {
		backgroundColor: Colors.systemBackground,
		paddingVertical: Spacing.xl,
		borderBottomWidth: 0.5,
		borderBottomColor: Colors.separator,
	},
	sectionTitle: {
		...Typography.headline,
		color: Colors.label,
		marginBottom: Spacing.lg,
		marginHorizontal: Spacing.screenPadding,
	},
	exerciseScrollView: {
		paddingHorizontal: Spacing.screenPadding,
	},
	exerciseScrollContainer: {
		paddingRight: Spacing.screenPadding,
	},
	exerciseButton: {
		paddingHorizontal: Spacing.xl,
		paddingVertical: Spacing.lg,
		borderRadius: BorderRadius.large,
		marginRight: Spacing.md,
		minWidth: 100,
		alignItems: "center" as const,
		justifyContent: "center" as const,
		...Shadows.level1,
	},
	exerciseButtonText: {
		...Typography.callout,
		fontWeight: "600" as const,
		textAlign: "center" as const,
	},
	scrollView: {
		flex: 1,
	},
	scrollContainer: {
		paddingVertical: Spacing.xl,
	},
	statsCard: {
		...CardStyles.default,
		marginHorizontal: Spacing.screenPadding,
		marginBottom: Spacing.xl,
	},
	statsCardHeader: {
		alignItems: "center" as const,
		marginBottom: Spacing.xl,
	},
	statsCardTitle: {
		...Typography.title2,
		color: Colors.label,
		marginBottom: Spacing.sm,
	},
	progressSummary: {
		...Typography.callout,
		color: Colors.systemGreen,
		textAlign: "center" as const,
		fontWeight: "600" as const,
	},
	statsGrid: {
		flexDirection: "row" as const,
		justifyContent: "space-around" as const,
	},
	statItem: {
		alignItems: "center" as const,
		flex: 1,
	},
	statValue: {
		...Typography.title1,
		color: Colors.systemBlue,
		fontWeight: "700" as const,
		marginBottom: Spacing.sm,
	},
	statLabel: {
		...Typography.footnote,
		color: Colors.secondaryLabel,
		textAlign: "center" as const,
	},
	detailedStatsCard: {
		...CardStyles.default,
		marginHorizontal: Spacing.screenPadding,
		marginBottom: Spacing.xl,
	},
	cardTitle: {
		...Typography.headline,
		color: Colors.label,
		marginBottom: Spacing.xl,
		textAlign: "center" as const,
	},
	detailedStatsGrid: {
		gap: Spacing.lg,
	},
	detailedStatRow: {
		flexDirection: "row" as const,
		justifyContent: "space-between" as const,
		alignItems: "center" as const,
		paddingVertical: Spacing.sm,
	},
	detailedStatLabel: {
		...Typography.body,
		color: Colors.label,
	},
	detailedStatValue: {
		...Typography.body,
		color: Colors.systemBlue,
		fontWeight: "600" as const,
	},
	chartContainer: {
		marginHorizontal: Spacing.screenPadding,
		marginBottom: Spacing.xl,
	},
	recentSessionsCard: {
		...CardStyles.default,
		marginHorizontal: Spacing.screenPadding,
		marginBottom: Spacing.xl,
	},
	sessionsList: {
		gap: 0,
	},
	sessionItem: {
		flexDirection: "row" as const,
		justifyContent: "space-between" as const,
		alignItems: "center" as const,
		paddingVertical: Spacing.lg,
		borderBottomWidth: 0.5,
		borderBottomColor: Colors.systemGray5,
	},
	lastSessionItem: {
		borderBottomWidth: 0,
	},
	sessionInfo: {
		flex: 1,
	},
	sessionDate: {
		...Typography.body,
		color: Colors.label,
		fontWeight: "600" as const,
		marginBottom: Spacing.xs,
	},
	sessionWeight: {
		...Typography.callout,
		color: Colors.secondaryLabel,
	},
	sessionStatus: {
		flexDirection: "row" as const,
		alignItems: "center" as const,
		gap: Spacing.md,
	},
	sessionSets: {
		...Typography.callout,
		color: Colors.secondaryLabel,
		fontWeight: "600" as const,
	},
	sessionStatusDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
	},
	emptyStateCard: {
		...CardStyles.inset,
		marginHorizontal: Spacing.screenPadding,
		marginBottom: Spacing.xl,
		alignItems: "center" as const,
		paddingVertical: Spacing.xxxxl,
	},
	emptyStateTitle: {
		...Typography.headline,
		color: Colors.label,
		marginBottom: Spacing.lg,
	},
	emptyStateText: {
		...Typography.body,
		color: Colors.secondaryLabel,
		textAlign: "center" as const,
		lineHeight: 22,
	},
	legend: {
		flexDirection: "row" as const,
		justifyContent: "center" as const,
		gap: Spacing.xl,
		paddingTop: Spacing.lg,
		borderTopWidth: 0.5,
		borderTopColor: Colors.systemGray5,
	},
	legendItem: {
		flexDirection: "row" as const,
		alignItems: "center" as const,
		gap: Spacing.md,
	},
	legendDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
	},
	legendText: {
		...Typography.footnote,
		color: Colors.secondaryLabel,
	},
};

export default HistoryScreen;
