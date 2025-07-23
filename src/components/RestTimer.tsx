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
import { useTranslation } from "react-i18next";

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
	const [isPulseRunning, setIsPulseRunning] = useState(false);
	const pulseAnimRef = React.useRef<Animated.CompositeAnimation | null>(null);
	const { t } = useTranslation();

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
		const progress = Math.min(elapsedSeconds / restTarget, 1);
		Animated.timing(progressAnim, {
			toValue: progress,
			duration: 300,
			useNativeDriver: false,
		}).start();
	}, [elapsedSeconds, restTarget, progressAnim]);

	// Vibration when target time is reached
	useEffect(() => {
		if (isRunning && elapsedSeconds >= restTarget && !hasVibrated) {
			// Vibration
			if (Platform.OS === "ios") {
				Vibration.vibrate([0, 200, 100, 200, 100, 200]);
			} else {
				Vibration.vibrate([0, 200, 100, 200, 100, 200]);
			}
			setHasVibrated(true);
		}
	}, [elapsedSeconds, restTarget, hasVibrated, isRunning]);

	// Pulse animation: start when elapsedSeconds >= restTarget, stop on reset
	useEffect(() => {
		if (elapsedSeconds >= restTarget && !isPulseRunning) {
			setIsPulseRunning(true);
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
					if (isPulseRunning && elapsedSeconds >= restTarget) {
						pulse();
					}
				});
			};
			pulse();
		}
		if (elapsedSeconds < restTarget && isPulseRunning) {
			setIsPulseRunning(false);
			pulseAnim.stopAnimation();
			pulseAnim.setValue(1);
		}
		// Stop pulse on reset (elapsedSeconds === 0)
		if (elapsedSeconds === 0 && isPulseRunning) {
			setIsPulseRunning(false);
			pulseAnim.stopAnimation();
			pulseAnim.setValue(1);
		}
	}, [elapsedSeconds, restTarget, isPulseRunning, pulseAnim]);

	// Reset state when reset button is pressed
	const handleReset = () => {
		setElapsedSeconds(0);
		setHasVibrated(false);
		progressAnim.setValue(0);
		pulseAnim.stopAnimation();
		pulseAnim.setValue(1);
		setIsPulseRunning(false);
		if (onReset) onReset();
	};

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
		if (!isRunning && elapsedSeconds === 0) return t("readyToStart");
		if (!isRunning && elapsedSeconds > 0) return t("paused");
		if (elapsedSeconds >= restTarget) return t("readyForNextSet");

		const remaining = restTarget - elapsedSeconds;
		if (remaining <= 10) return t("secondsLeft", { seconds: remaining });
		return t("remainingTime", {
			minutes: Math.floor(remaining / 60),
			seconds: (remaining % 60).toString().padStart(2, "0"),
		});
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
						{isRunning ? t("pause") : t("start")}
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.controlButton, styles.resetButton]}
					onPress={handleReset}
					activeOpacity={0.8}
				>
					<Text style={styles.controlButtonText}>{t("reset")}</Text>
				</TouchableOpacity>
			</View>

			{/* Target Info */}
			<View style={styles.targetInfo}>
				<Text style={styles.targetText}>
					{t("target", {
						minutes: Math.floor(restTarget / 60),
						seconds: (restTarget % 60).toString().padStart(2, "0"),
					})}
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
