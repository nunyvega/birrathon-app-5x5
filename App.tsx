import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { Platform, Text, View } from "react-native";

// Import screens
import WorkoutScreen from "./src/screens/WorkoutScreen";
import HistoryScreen from "./src/screens/HistoryScreen";

// Import context
import WorkoutProvider from "./src/context/WorkoutContext";

// Import Apple Design System
import {
	Colors,
	Typography,
	Spacing,
	BorderRadius,
	Shadows,
} from "./src/styles/AppleDesignSystem";

// Create bottom tab navigator
const Tab = createBottomTabNavigator();

// Navigation Theme following Apple's design
const navigationTheme = {
	dark: false,
	colors: {
		primary: Colors.systemBlue,
		background: Colors.systemGroupedBackground,
		card: Colors.systemBackground,
		text: Colors.label,
		border: Colors.separator,
		notification: Colors.systemRed,
	},
	fonts: {
		regular: {
			fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "System",
			fontWeight: "400" as const,
		},
		medium: {
			fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "System",
			fontWeight: "500" as const,
		},
		bold: {
			fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "System",
			fontWeight: "600" as const,
		},
		heavy: {
			fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "System",
			fontWeight: "700" as const,
		},
	},
};

// Tab bar icons using iOS-style SF Symbols approach
const TabBarIcon = ({
	name,
	focused,
	color,
	size,
}: {
	name: string;
	focused: boolean;
	color: string;
	size: number;
}) => {
	const icons = {
		Workout: {
			focused: "🏋️‍♂️",
			unfocused: "🏋️‍♀️",
		},
		History: {
			focused: "📊",
			unfocused: "📈",
		},
	};

	const iconSet = icons[name as keyof typeof icons];
	const iconToShow = focused ? iconSet.focused : iconSet.unfocused;

	return (
		<View
			style={{
				alignItems: "center",
				justifyContent: "center",
				transform: [{ scale: focused ? 1.1 : 1 }],
			}}
		>
			<Text
				style={{
					fontSize: size,
					color: color,
				}}
			>
				{iconToShow}
			</Text>
		</View>
	);
};

// Main App component
export default function App() {
	return (
		<WorkoutProvider>
			<NavigationContainer theme={navigationTheme}>
				<StatusBar
					style="dark"
					backgroundColor={Colors.systemBackground}
				/>
				<Tab.Navigator
					screenOptions={({ route }) => ({
						// Tab Bar Icon
						tabBarIcon: ({ focused, color, size }) => (
							<TabBarIcon
								name={route.name}
								focused={focused}
								color={color}
								size={size}
							/>
						),

						// Tab Bar Styling (iOS-style)
						tabBarActiveTintColor: Colors.systemBlue,
						tabBarInactiveTintColor: Colors.systemGray,

						tabBarStyle: {
							backgroundColor: Colors.systemBackground,
							borderTopWidth: 0.5,
							borderTopColor: Colors.separator,
							paddingTop: Spacing.sm,
							paddingBottom:
								Platform.OS === "ios"
									? Spacing.xxxl
									: Spacing.xl,
							height:
								Platform.OS === "ios"
									? Spacing.tabBarHeight
									: 60,
							// iOS-style blur effect simulation
							...Shadows.level1,
						},

						tabBarLabelStyle: {
							...Typography.caption1,
							marginTop: Spacing.xs,
							marginBottom:
								Platform.OS === "ios" ? 0 : Spacing.sm,
						},

						// Tab Bar Item Styling
						tabBarItemStyle: {
							paddingTop: Spacing.sm,
						},

						// Header Styling (iOS-style)
						headerStyle: {
							backgroundColor: Colors.systemBackground,
							borderBottomWidth: 0.5,
							borderBottomColor: Colors.separator,
							height: Platform.OS === "ios" ? 96 : 56,
							...Shadows.level1,
						},

						headerTitleStyle: {
							...Typography.headline,
							color: Colors.label,
						},

						headerTitleAlign: "center",

						// Remove header shadow on Android
						headerShadowVisible: false,
					})}
				>
					<Tab.Screen
						name="Workout"
						component={WorkoutScreen}
						options={{
							tabBarLabel: "Workout",
							headerTitle: "Workout",
						}}
					/>
					<Tab.Screen
						name="History"
						component={HistoryScreen}
						options={{
							tabBarLabel: "History",
							headerTitle: "Progress",
						}}
					/>
				</Tab.Navigator>
			</NavigationContainer>
		</WorkoutProvider>
	);
}
