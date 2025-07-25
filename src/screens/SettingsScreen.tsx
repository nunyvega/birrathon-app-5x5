import React, { useState, useEffect } from "react";
import {
	SafeAreaView,
	View,
	Text,
	TouchableOpacity,
	Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useWorkout } from "../context/WorkoutContext";
import {
	Colors,
	Typography,
	Spacing,
	ButtonStyles,
	Shadows,
} from "../styles/AppleDesignSystem";
import LanguagePicker from "../components/LanguagePicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

type TabParamList = {
	Workout: undefined;
	History: undefined;
	Settings: undefined;
};

const SettingsScreen: React.FC = () => {
	const { t, i18n } = useTranslation();
	const { clearAllData } = useWorkout();
	const [selectedLanguage, setSelectedLanguage] = useState("en");
	const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();

	// Load language from AsyncStorage on mount
	useEffect(() => {
		const loadLanguage = async () => {
			const savedLang = await AsyncStorage.getItem("appLanguage");
			if (savedLang) {
				setSelectedLanguage(savedLang);
				i18n.changeLanguage(savedLang);
			}
		};
		loadLanguage();
	}, [i18n]);

	// Save language to AsyncStorage and update state
	const handleLanguageChange = async (lang: string) => {
		await AsyncStorage.setItem("appLanguage", lang);
		setSelectedLanguage(lang);
		i18n.changeLanguage(lang);
	};

	const handleClearData = () => {
		Alert.alert(
			t("clearData"),
			t("clearDataConfirm"),
			[
				{ text: t("cancel"), style: "cancel" },
				{
					text: t("ok"),
					style: "destructive",
					onPress: async () => {
						try {
							await clearAllData();
							navigation.navigate("Workout");
							Alert.alert(t("clearData"), t("clearDataSuccess"));
						} catch (e) {
							Alert.alert(t("error"), t("clearDataError"));
						}
					},
				},
			],
			{ cancelable: true }
		);
	};

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: Colors.systemGroupedBackground }}
		>
			<View style={{ flex: 1, padding: Spacing.screenPadding }}>
				<Text
					style={{
						...Typography.largeTitle,
						color: Colors.label,
						marginBottom: Spacing.xxxl,
					}}
				>
					{t("Settings")}
				</Text>
				<LanguagePicker
					selectedLanguage={selectedLanguage}
					onSelect={handleLanguageChange}
				/>
				<TouchableOpacity
					style={{
						...ButtonStyles.destructive,
						flexDirection: "row",
						alignItems: "center",
						marginBottom: Spacing.xxl,
						...Shadows.level1,
					}}
					onPress={handleClearData}
					activeOpacity={0.8}
				>
					<Text style={{ fontSize: 22, marginRight: Spacing.md }}>
						🗑️
					</Text>
					<Text
						style={{
							...Typography.headline,
							color: Colors.systemBackground,
						}}
					>
						{t("clearData")}
					</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

export default SettingsScreen;
