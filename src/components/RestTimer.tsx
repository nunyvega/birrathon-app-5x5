import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	Vibration,
	Platform,
	Animated,
} from "react-native";
import {
	Colors,
	Typography,
	Spacing,
	Shadows,
	ButtonStyles,
	BorderRadius,
} from "../styles/AppleDesignSystem";
import { RestTimerProps } from "../types/types";

export const RestTimer: React.FC<RestTimerProps> = ({
	isRunning,
	onReset,
	onToggle,
	restTarget = 90,
}) => {
	const [elapsedSeconds, setElapsedSeconds] = useState(0);
	const [hasVibrated, setHasVibrated] = useState(false);
	const [pulseAnim] = useState(new Animated.Value(1));
	const [progressAnim] = useState(new Animated.Value(0));

	// Timer effect
	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		if (isRunning) {
			interval = setInterval(() => {
				setElapsedSeconds((prev) => prev + 1);
			}, 1000);
		}

		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [isRunning]);

	// Progress animation
	useEffect(() => {
		if (isRunning) {
			const progress = Math.min(elapsedSeconds / restTarget, 1);
			Animated.timing(progressAnim, {
				toValue: progress,
				duration: 300,
				useNativeDriver: false,
			}).start();
		}
	}, [elapsedSeconds, restTarget, isRunning, progressAnim]);

	// Vibration and pulse effect when target time is reached
	useEffect(() => {
		if (isRunning && elapsedSeconds >= restTarget && !hasVibrated) {
			// Vibration
			if (Platform.OS === "ios") {
				Vibration.vibrate([0, 200, 100, 200, 100, 200]);
			} else {
				Vibration.vibrate([0, 200, 100, 200, 100, 200]);
			}
			setHasVibrated(true);

			// Pulse animation
			const pulse = () => {
				Animated.sequence([
					Animated.timing(pulseAnim, {
						toValue: 1.1,
						duration: 500,
						useNativeDriver: true,
					}),
					Animated.timing(pulseAnim, {
						toValue: 1,
						duration: 500,
						useNativeDriver: true,
					}),
				]).start(() => {
					if (elapsedSeconds >= restTarget) {
						pulse();
					}
				});
			};
			pulse();
		}
	}, [elapsedSeconds, restTarget, hasVibrated, isRunning, pulseAnim]);

	// Reset state when timer is reset
	useEffect(() => {
		if (!isRunning) {
			setElapsedSeconds(0);
			setHasVibrated(false);
			progressAnim.setValue(0);
			pulseAnim.setValue(1);
		}
	}, [isRunning, progressAnim, pulseAnim]);

	// Format time display
	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	// Get timer display color
	const getTimerColor = () => {
		if (elapsedSeconds >= restTarget) {
			return Colors.systemGreen;
		}
		if (elapsedSeconds >= restTarget * 0.8) {
			return Colors.systemOrange;
		}
		return Colors.systemBlue;
	};

	// Get status text
	const getStatusText = (): string => {
		if (!isRunning && elapsedSeconds === 0) return "Ready to start";
		if (!isRunning && elapsedSeconds > 0) return "Paused";
		if (elapsedSeconds >= restTarget) return "Ready for next set! 💪";

		const remaining = restTarget - elapsedSeconds;
		if (remaining <= 10) return `${remaining} seconds left`;
		return `${Math.floor(remaining / 60)}:${(remaining % 60)
			.toString()
			.padStart(2, "0")} remaining`;
	};

	// Get progress percentage
	const getProgressPercentage = () => {
		return Math.min((elapsedSeconds / restTarget) * 100, 100);
	};

	return (
		<View style={styles.container}>
			{/* Timer Display */}
			<View style={styles.timerContainer}>
				{/* Simple Timer Display */}
				<View style={styles.timerWithProgress}>
					<Animated.View
						style={[
							styles.timerDisplay,
							{ transform: [{ scale: pulseAnim }] },
						]}
					>
						<Text
							style={[
								styles.timerText,
								{ color: getTimerColor() },
							]}
						>
							{formatTime(elapsedSeconds)}
						</Text>
					</Animated.View>
				</View>

				<Text style={styles.statusText}>{getStatusText()}</Text>
			</View>

			{/* Control Buttons */}
			<View style={styles.controlsContainer}>
				<TouchableOpacity
					style={[
						styles.controlButton,
						styles.toggleButton,
						{
							backgroundColor: isRunning
								? Colors.systemOrange
								: Colors.systemGreen,
						},
					]}
					onPress={onToggle}
					activeOpacity={0.8}
				>
					<Text style={styles.controlButtonText}>
						{isRunning ? "Pause" : "Start"}
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.controlButton, styles.resetButton]}
					onPress={onReset}
					activeOpacity={0.8}
				>
					<Text style={styles.controlButtonText}>Reset</Text>
				</TouchableOpacity>
			</View>

			{/* Target Info */}
			<View style={styles.targetInfo}>
				<Text style={styles.targetText}>
					Target: {Math.floor(restTarget / 60)}:
					{(restTarget % 60).toString().padStart(2, "0")}
				</Text>
			</View>
		</View>
	);
};

const styles = {
	container: {
		backgroundColor: Colors.systemGray6,
		borderRadius: BorderRadius.large,
		padding: Spacing.xl,
		marginVertical: Spacing.md,
		alignItems: "center" as const,
		...Shadows.level1,
	},
	timerContainer: {
		alignItems: "center" as const,
		marginBottom: Spacing.xl,
	},
	timerWithProgress: {
		alignItems: "center" as const,
		justifyContent: "center" as const,
		marginBottom: Spacing.lg,
	},
	timerDisplay: {
		alignItems: "center" as const,
		justifyContent: "center" as const,
	},
	timerText: {
		...Typography.largeTitle,
		fontFamily: Platform.OS === "ios" ? "SF Mono" : "monospace",
		fontSize: 36,
		fontWeight: "700" as const,
		letterSpacing: 1,
		textAlign: "center" as const,
	},
	statusText: {
		...Typography.headline,
		color: Colors.label,
		textAlign: "center" as const,
		marginBottom: Spacing.lg,
		fontWeight: "600" as const,
	},
	controlsContainer: {
		flexDirection: "row" as const,
		gap: Spacing.xl,
		marginBottom: Spacing.lg,
	},
	controlButton: {
		...ButtonStyles.primary,
		paddingHorizontal: Spacing.xxxl,
		paddingVertical: Spacing.lg,
		minWidth: 100,
		borderRadius: BorderRadius.large,
	},
	toggleButton: {
		// backgroundColor will be set dynamically
	},
	resetButton: {
		backgroundColor: Colors.systemRed,
	},
	controlButtonText: {
		...Typography.headline,
		color: Colors.systemBackground,
		fontWeight: "600" as const,
		textAlign: "center" as const,
	},
	targetInfo: {
		paddingTop: Spacing.md,
		borderTopWidth: 0.5,
		borderTopColor: Colors.systemGray4,
		alignSelf: "stretch" as const,
	},
	targetText: {
		...Typography.caption1,
		color: Colors.secondaryLabel,
		textAlign: "center" as const,
	},
};

export default RestTimer;
