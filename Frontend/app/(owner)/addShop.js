import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import { addOrUpdateShop as addShop } from "../../api";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS, SHADOWS } from "../../constants/theme";

const AddShop = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setMessage("");
    setError("");
    if (!name.trim()) {
      setError("Shop name is required.");
      return;
    }
    try {
      const data = { name, description };
      const response = await addShop(data);
      const { message, shopId } = response.data;
      setMessage(message || "Shop added successfully!");
      setName("");
      setDescription("");
      router.push({ pathname: "/(owner)/manageItems", params: { shopId } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add shop.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Green Header */}
        <View style={styles.headerSection}>
          <View style={styles.iconCircle}>
            <FontAwesome name="shopping-bag" size={28} color={COLORS.primary} />
          </View>
          <Text style={styles.headerTitle}>Create Your Shop</Text>
          <Text style={styles.headerSubtitle}>
            Set up your agrovet store to start selling
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Shop Name</Text>
            <View style={styles.inputWrapper}>
              <FontAwesome name="tag" size={16} color={COLORS.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter shop name"
                placeholderTextColor={COLORS.textMuted}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.textarea}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your shop and products..."
              placeholderTextColor={COLORS.textMuted}
              multiline
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.85}
          >
            <Text style={styles.submitButtonText}>Create Shop</Text>
          </TouchableOpacity>

          {message ? (
            <View style={styles.messageBox}>
              <FontAwesome name="check-circle" size={16} color={COLORS.success} style={{ marginRight: 8 }} />
              <Text style={styles.successText}>{message}</Text>
            </View>
          ) : null}
          {error ? (
            <View style={[styles.messageBox, styles.errorBox]}>
              <FontAwesome name="exclamation-circle" size={16} color={COLORS.danger} style={{ marginRight: 8 }} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddShop;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { flexGrow: 1 },
  headerSection: {
    backgroundColor: COLORS.primaryDark,
    paddingTop: 70,
    paddingBottom: 50,
    alignItems: "center",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: "#FFF",
    justifyContent: "center", alignItems: "center",
    marginBottom: 16, ...SHADOWS.medium,
  },
  headerTitle: { fontSize: 28, fontWeight: "800", color: "#FFF", marginBottom: 6 },
  headerSubtitle: { fontSize: 15, color: "rgba(255,255,255,0.75)", fontWeight: "500" },
  formCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: 20, marginTop: -25,
    borderRadius: 20, padding: 24, marginBottom: 30,
    ...SHADOWS.large,
  },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 14, fontWeight: "600", color: COLORS.primary, marginBottom: 8, marginLeft: 4 },
  inputWrapper: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: 12, backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 50, fontSize: 16, color: COLORS.text },
  textarea: {
    borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: 12, backgroundColor: COLORS.surface,
    padding: 14, fontSize: 16, color: COLORS.text, height: 100,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16, borderRadius: 16,
    alignItems: "center", marginTop: 8,
    ...SHADOWS.medium,
  },
  submitButtonText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  messageBox: {
    flexDirection: "row", alignItems: "center",
    marginTop: 16, paddingVertical: 12, paddingHorizontal: 14,
    backgroundColor: COLORS.successLight, borderRadius: 12,
  },
  errorBox: { backgroundColor: COLORS.dangerLight },
  successText: { color: COLORS.success, fontSize: 14, fontWeight: "500", flex: 1 },
  errorText: { color: COLORS.danger, fontSize: 14, fontWeight: "500", flex: 1 },
});
