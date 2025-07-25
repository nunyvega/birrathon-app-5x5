import React, { useState, useEffect } from "react";
import {
	SafeAreaView,
	View,
	Text,
	TouchableOpacity,
	Alert,
	Modal,
	Linking,
	Pressable,
	StyleSheet,
	Platform,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useWorkout } from "../context/WorkoutContext";
import {
	Colors,
	Typography,
	Spacing,
	ButtonStyles,
	Shadows,
	BorderRadius,
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
	const [contactModalVisible, setContactModalVisible] = useState(false);
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
				{/* Contact Button */}
				<TouchableOpacity
					style={styles.trigger}
					onPress={() => setContactModalVisible(true)}
					activeOpacity={0.7}
				>
					<Text style={styles.icon}>📬</Text>
					<Text style={styles.triggerText}>{t("contact")}</Text>
				</TouchableOpacity>
				{/* Existing Clear Data Button */}
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
				{/* Contact Modal */}
				<Modal
					visible={contactModalVisible}
					animationType="slide"
					transparent={true}
					onRequestClose={() => setContactModalVisible(false)}
				>
					<View style={styles.modalOverlay}>
						<View style={styles.modalContent}>
							<Text style={styles.modalTitle}>
								{t("contactText")}
							</Text>
							<Pressable
								onPress={() =>
									Linking.openURL(
										"https://www.linkedin.com/in/max-robles-dev/"
									)
								}
								style={styles.contactLink}
							>
								<Text style={styles.contactLinkText}>
									Maximiliano Robles
								</Text>
							</Pressable>
							<Pressable
								onPress={() =>
									Linking.openURL(
										"https://www.linkedin.com/in/alvaro-vega/"
									)
								}
								style={styles.contactLink}
							>
								<Text style={styles.contactLinkText}>
									Alvaro Vega
								</Text>
							</Pressable>
							<TouchableOpacity
								style={styles.cancelButton}
								onPress={() => setContactModalVisible(false)}
							>
								<Text style={styles.cancelText}>
									{t("cancel")}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	trigger: {
		width: "100%",
		height: 50,
		marginBottom: Spacing.md,
		paddingHorizontal: Spacing.lg,
		paddingVertical: Spacing.sm,
		backgroundColor: Colors.systemBlue,
		borderRadius: BorderRadius.small,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
	},
	triggerText: {
		...Typography.title3,
		color: Colors.systemBackground,
	},
	icon: {
		fontSize: 22,
		marginRight: Spacing.md,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.3)",
		justifyContent: "flex-end",
		alignItems: "center",
	},
	modalContent: {
		backgroundColor: Colors.systemBackground,
		padding: Spacing.xl,
		paddingBottom: Platform.OS === "ios" ? 40 : 20,
		minHeight: 200,
		width: "100%",
		alignItems: "center",
	},
	modalTitle: {
		...Typography.headline,
		color: Colors.label,
		textAlign: "center",
		marginBottom: Spacing.xl,
	},
	contactLink: {
		marginBottom: 12,
		paddingVertical: 10,
		paddingHorizontal: 24,
		borderRadius: 8,
	},
	contactLinkText: {
		color: Colors.link,
		textDecorationLine: "underline",
	},
	cancelButton: {
		marginTop: Spacing.xl,
		paddingVertical: Spacing.lg,
		borderRadius: BorderRadius.large,
		backgroundColor: Colors.systemGray4,
		alignItems: "center",
		alignSelf: "stretch",
	},
	cancelText: {
		...Typography.body,
		color: Colors.label,
		fontWeight: "600",
		textAlign: "center",
	},
});

export default SettingsScreen;
