import React from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { ProgressLineChartProps } from "../types/types";
import {
	Colors,
	Typography,
	Spacing,
	CardStyles,
	BorderRadius,
} from "../styles/AppleDesignSystem";

const screenWidth = Dimensions.get("window").width;

export const ProgressLineChart: React.FC<ProgressLineChartProps> = ({
	exercise,
	sessions,
	height = 280,
}) => {
	// Process sessions to get chart data
	const getChartData = () => {
		const exerciseSessions = sessions
			.filter((session) =>
				session.exercises.some((ex) => ex.name === exercise)
			)
			.sort(
				(a, b) =>
					new Date(a.date).getTime() - new Date(b.date).getTime()
			);

		if (exerciseSessions.length === 0) {
			return [];
		}

		const chartData = exerciseSessions.map((session, index) => {
			const exerciseSession = session.exercises.find(
				(ex) => ex.name === exercise
			);
			const weight = exerciseSession?.weight || 0;
			const date = new Date(session.date);
			const isSuccessful =
				exerciseSession && isSessionSuccessful(exerciseSession);

			return {
				value: weight,
				label: `${date.getMonth() + 1}/${date.getDate()}`,
				labelTextStyle: {
					...Typography.caption2,
					color: Colors.secondaryLabel,
				},
				dataPointText: `${weight}kg`,
				dataPointTextStyle: {
					...Typography.caption1,
					color: Colors.label,
					fontWeight: "600" as const,
				},
				dataPointColor: isSuccessful
					? Colors.systemGreen
					: Colors.systemRed,
				dataPointRadius: 6,
				dataPointLabelWidth: 50,
				dataPointLabelShiftY: -8,
				dataPointLabelShiftX: 0,
				showDataPointLabelOnFocus: true,
			};
		});

		return chartData;
	};

	// Check if session was successful
	const isSessionSuccessful = (exerciseSession: any) => {
		return exerciseSession.sets.every((set: any) => set.completed);
	};

	// Get statistics
	const getStats = () => {
		const data = getChartData();
		if (data.length === 0) {
			return {
				currentWeight: 0,
				startWeight: 0,
				totalIncrease: 0,
				sessions: 0,
				trend: "No data available",
				averageIncrease: 0,
			};
		}

		const currentWeight = data[data.length - 1].value;
		const startWeight = data[0].value;
		const totalIncrease = currentWeight - startWeight;
		const sessions = data.length;
		const averageIncrease =
			sessions > 1 ? totalIncrease / (sessions - 1) : 0;

		// Calculate trend
		let trend = "Stable";
		if (totalIncrease > 0) {
			trend = "Increasing";
		} else if (totalIncrease < 0) {
			trend = "Decreasing";
		}

		return {
			currentWeight,
			startWeight,
			totalIncrease,
			sessions,
			trend,
			averageIncrease,
		};
	};

	// Get trend color
	const getTrendColor = (trend: string) => {
		switch (trend) {
			case "Increasing":
				return Colors.systemGreen;
			case "Decreasing":
				return Colors.systemRed;
			default:
				return Colors.systemGray;
		}
	};

	const chartData = getChartData();
	const stats = getStats();

	if (chartData.length === 0) {
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.title}>{exercise} Progress</Text>
					<Text style={styles.subtitle}>
						Track your strength gains
					</Text>
				</View>
				<View style={styles.emptyState}>
					<Text style={styles.emptyStateTitle}>
						No Data Available
					</Text>
					<Text style={styles.emptyStateText}>
						Complete some {exercise} workouts to see your progress
						chart here.
					</Text>
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<Text style={styles.title}>{exercise} Progress</Text>
				<Text style={styles.subtitle}>Track your strength gains</Text>
			</View>

			{/* Quick Stats */}
			<View style={styles.quickStats}>
				<View style={styles.statItem}>
					<Text style={styles.statValue}>
						{stats.currentWeight}kg
					</Text>
					<Text style={styles.statLabel}>Current</Text>
				</View>
				<View style={styles.statItem}>
					<Text
						style={[
							styles.statValue,
							{ color: getTrendColor(stats.trend) },
						]}
					>
						{stats.totalIncrease > 0 ? "+" : ""}
						{stats.totalIncrease}kg
					</Text>
					<Text style={styles.statLabel}>Total Gain</Text>
				</View>
				<View style={styles.statItem}>
					<Text style={styles.statValue}>{stats.sessions}</Text>
					<Text style={styles.statLabel}>Sessions</Text>
				</View>
			</View>

			{/* Chart */}
			<View style={styles.chartContainer}>
				<LineChart
					data={chartData}
					width={screenWidth - 80}
					height={height}
					color={Colors.systemBlue}
					thickness={3}
					dataPointsColor={Colors.systemBlue}
					dataPointsRadius={5}
					showDataPointOnFocus
					showStripOnFocus
					showTextOnFocus
					focusEnabled
					delayBeforeUnFocus={2000}
					curved
					curvature={0.3}
					areaChart
					startFillColor={Colors.systemBlue}
					endFillColor={Colors.systemBlue}
					startOpacity={0.2}
					endOpacity={0.05}
					spacing={chartData.length > 8 ? 30 : 45}
					initialSpacing={25}
					endSpacing={25}
					yAxisColor={Colors.systemGray4}
					xAxisColor={Colors.systemGray4}
					yAxisTextStyle={{
						...Typography.caption2,
						color: Colors.secondaryLabel,
					}}
					xAxisLabelTextStyle={{
						...Typography.caption2,
						color: Colors.secondaryLabel,
					}}
					rulesType="solid"
					rulesColor={Colors.systemGray5}
					showVerticalLines
					verticalLinesColor={Colors.systemGray5}
					yAxisSide={0}
					yAxisOffset={10}
					hideYAxisText={false}
					hideOrigin={false}
					yAxisLabelSuffix="kg"
					showXAxisIndices={false}
					showYAxisIndices={false}
					noOfSections={4}
					maxValue={Math.max(...chartData.map((d) => d.value)) + 10}
					stepValue={5}
					yAxisThickness={1}
					xAxisThickness={1}
					// animateOnDataChange
					// onDataChangeAnimationDuration={300}
					// animationEasing="ease-out"
				/>
			</View>

			{/* Detailed Stats */}
			<View style={styles.detailedStats}>
				<View style={styles.detailedStatRow}>
					<View style={styles.detailedStatItem}>
						<Text style={styles.detailedStatLabel}>
							Starting Weight
						</Text>
						<Text style={styles.detailedStatValue}>
							{stats.startWeight}kg
						</Text>
					</View>
					<View style={styles.detailedStatItem}>
						<Text style={styles.detailedStatLabel}>
							Avg. Increase
						</Text>
						<Text style={styles.detailedStatValue}>
							{stats.averageIncrease > 0 ? "+" : ""}
							{stats.averageIncrease.toFixed(1)}kg
						</Text>
					</View>
				</View>
				<View style={styles.trendIndicator}>
					<Text style={styles.trendLabel}>Trend: </Text>
					<Text
						style={[
							styles.trendValue,
							{ color: getTrendColor(stats.trend) },
						]}
					>
						{stats.trend}
					</Text>
				</View>
			</View>

			{/* Legend */}
			<View style={styles.legend}>
				<View style={styles.legendItem}>
					<View
						style={[
							styles.legendDot,
							{ backgroundColor: Colors.systemGreen },
						]}
					/>
					<Text style={styles.legendText}>Successful Session</Text>
				</View>
				<View style={styles.legendItem}>
					<View
						style={[
							styles.legendDot,
							{ backgroundColor: Colors.systemRed },
						]}
					/>
					<Text style={styles.legendText}>Incomplete Session</Text>
				</View>
			</View>
		</View>
	);
};

const styles = {
	container: {
		...CardStyles.default,
		marginHorizontal: Spacing.screenPadding,
		marginVertical: Spacing.md,
	},
	header: {
		alignItems: "center" as const,
		marginBottom: Spacing.xl,
	},
	title: {
		...Typography.title3,
		color: Colors.label,
		marginBottom: Spacing.sm,
	},
	subtitle: {
		...Typography.callout,
		color: Colors.secondaryLabel,
	},
	quickStats: {
		flexDirection: "row" as const,
		justifyContent: "space-around" as const,
		marginBottom: Spacing.xl,
		paddingVertical: Spacing.lg,
		backgroundColor: Colors.systemGray6,
		borderRadius: BorderRadius.medium,
	},
	statItem: {
		alignItems: "center" as const,
		flex: 1,
	},
	statValue: {
		...Typography.title2,
		color: Colors.systemBlue,
		fontWeight: "700" as const,
		marginBottom: Spacing.xs,
	},
	statLabel: {
		...Typography.caption1,
		color: Colors.secondaryLabel,
		textAlign: "center" as const,
	},
	chartContainer: {
		alignItems: "center" as const,
		marginBottom: Spacing.xl,
		paddingHorizontal: Spacing.sm,
	},
	detailedStats: {
		marginBottom: Spacing.xl,
	},
	detailedStatRow: {
		flexDirection: "row" as const,
		justifyContent: "space-between" as const,
		marginBottom: Spacing.lg,
	},
	detailedStatItem: {
		flex: 1,
		alignItems: "center" as const,
	},
	detailedStatLabel: {
		...Typography.footnote,
		color: Colors.secondaryLabel,
		marginBottom: Spacing.xs,
	},
	detailedStatValue: {
		...Typography.headline,
		color: Colors.label,
		fontWeight: "600" as const,
	},
	trendIndicator: {
		flexDirection: "row" as const,
		justifyContent: "center" as const,
		alignItems: "center" as const,
	},
	trendLabel: {
		...Typography.callout,
		color: Colors.secondaryLabel,
	},
	trendValue: {
		...Typography.callout,
		fontWeight: "600" as const,
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
	emptyState: {
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
		paddingHorizontal: Spacing.xl,
	},
};

export default ProgressLineChart;
