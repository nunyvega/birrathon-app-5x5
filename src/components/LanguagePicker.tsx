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

	const selectedLabel =
		LANGUAGES.find((l) => l.code === selectedLanguage)?.label || "Select";
	return (
		<>
			<TouchableOpacity
				style={styles.trigger}
				onPress={() => setModalVisible(true)}
				activeOpacity={0.7}
			>
				<Text style={styles.triggerText}>{selectedLabel}</Text>
			</TouchableOpacity>
			<Modal
				visible={modalVisible}
				animationType="slide"
				transparent
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Choose Language</Text>
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
							<Text style={styles.cancelText}>Cancel</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</>
	);
};

const styles = StyleSheet.create({
	trigger: {
		paddingHorizontal: Spacing.lg,
		paddingVertical: Spacing.sm,
		backgroundColor: Colors.systemGray6,
		borderRadius: BorderRadius.large,
		alignItems: "center",
		justifyContent: "center",
		minWidth: 80,
		marginHorizontal: Spacing.md,
	},
	triggerText: {
		...Typography.body,
		color: Colors.systemGray,
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
