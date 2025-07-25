import React, { useState } from "react";
import {
	Modal,
	View,
	Text,
	TouchableOpacity,
	FlatList,
	StyleSheet,
	Platform,
} from "react-native";
import {
	Colors,
	Spacing,
	Typography,
	BorderRadius,
} from "../styles/AppleDesignSystem";
import { t } from "i18next";

const LANGUAGES = [
	{ code: "en", label: "English" },
	{ code: "es", label: "Español" },
	{ code: "fr", label: "Français" },
];

export const LanguagePicker = ({
	selectedLanguage = "en",
	onSelect,
}: {
	selectedLanguage?: string;
	onSelect: (code: string) => void;
}) => {
	const [modalVisible, setModalVisible] = useState(false);

	const handleSelect = (code: string) => {
		setModalVisible(false);
		onSelect(code);
	};

	return (
		<>
			<TouchableOpacity
				style={styles.trigger}
				onPress={() => setModalVisible(true)}
				activeOpacity={0.7}
			>
				<Text style={styles.triggerText}>{t("Language")}</Text>
			</TouchableOpacity>
			<Modal
				visible={modalVisible}
				animationType="slide"
				transparent
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>
							{t("ChooseLanguage")}
						</Text>
						<FlatList
							data={LANGUAGES}
							keyExtractor={(item) => item.code}
							renderItem={({ item }) => (
								<TouchableOpacity
									style={[
										styles.languageOption,
										item.code === selectedLanguage &&
											styles.selectedOption,
									]}
									onPress={() => handleSelect(item.code)}
								>
									<Text
										style={[
											styles.languageLabel,
											item.code === selectedLanguage &&
												styles.selectedLabel,
										]}
									>
										{item.label}
									</Text>
								</TouchableOpacity>
							)}
						/>
						<TouchableOpacity
							style={styles.cancelButton}
							onPress={() => setModalVisible(false)}
						>
							<Text style={styles.cancelText}>{t("cancel")}</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</>
	);
};

const styles = StyleSheet.create({
	trigger: {
		width: "100%",
		height: 50,
		marginBottom: Spacing.md,
		paddingHorizontal: Spacing.lg,
		paddingVertical: Spacing.sm,
		backgroundColor: Colors.systemGray2,
		borderRadius: BorderRadius.small,
		alignItems: "center",
		justifyContent: "center",
	},
	triggerText: {
		...Typography.title3,
		color: Colors.systemBackground,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.3)",
		justifyContent: "flex-end",
	},
	modalContent: {
		backgroundColor: Colors.systemBackground,
		borderTopLeftRadius: BorderRadius.xl,
		borderTopRightRadius: BorderRadius.xl,
		padding: Spacing.xl,
		paddingBottom: Platform.OS === "ios" ? 40 : 20,
		minHeight: 200,
	},
	modalTitle: {
		...Typography.headline,
		color: Colors.label,
		textAlign: "center",
		marginBottom: Spacing.xl,
	},
	languageOption: {
		paddingVertical: Spacing.lg,
		paddingHorizontal: Spacing.md,
		borderRadius: BorderRadius.medium,
		marginBottom: 4,
	},
	selectedOption: {
		backgroundColor: Colors.systemGray5,
	},
	languageLabel: {
		...Typography.body,
		color: Colors.label,
		textAlign: "center",
	},
	selectedLabel: {
		color: Colors.systemBlue,
		fontWeight: "700",
	},
	cancelButton: {
		marginTop: Spacing.xl,
		paddingVertical: Spacing.lg,
		borderRadius: BorderRadius.large,
		backgroundColor: Colors.systemGray4,
		alignItems: "center",
	},
	cancelText: {
		...Typography.body,
		color: Colors.label,
		fontWeight: "600",
	},
});

export default LanguagePicker;
