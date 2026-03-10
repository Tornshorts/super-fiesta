import { Formik } from "formik";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import * as Yup from "yup";
import { useRouter, useLocalSearchParams } from "expo-router";
import { registerUser } from "../../api";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS, SHADOWS } from "../../constants/theme";

const validationSchema = Yup.object().shape({
  email: Yup.string().required("Email is required").email().label("Email"),
  password: Yup.string()
    .required("Password is required")
    .min(4)
    .label("Password"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

const Register = () => {
  const { role } = useLocalSearchParams();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <FontAwesome name="chevron-left" size={18} color="#FFF" />
          </TouchableOpacity>

          <View>
            <View style={styles.titleRow}>
              <Text style={styles.brandName}>Mkulima</Text>
              <View style={styles.roleBadge}>
                <Text style={{ fontSize: 12 }}>{role === "owner" ? "🏪" : "🛒"}</Text>
                <Text style={styles.roleBadgeText}>
                  {role === "owner" ? "Store Owner" : "Customer"}
                </Text>
              </View>
            </View>
            <Text style={styles.welcomeTitle}>Create Account</Text>
            <Text style={styles.welcomeSubtitle}>Join the Mkulima marketplace</Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.formSection}>
          <Formik
            initialValues={{ email: "", password: "", confirmPassword: "" }}
            onSubmit={async (values) => {
              try {
                await registerUser({
                  email: values.email,
                  password: values.password,
                });
                alert("Registration successful!");
                router.push({ pathname: "/(auth)/login", params: { role } });
              } catch (err) {
                alert(err.response?.data?.message || "Registration failed");
              }
            }}
            validationSchema={validationSchema}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email Address</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="you@example.com"
                      placeholderTextColor={COLORS.textMuted}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      value={values.email}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  {errors.email && touched.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Min. 6 characters"
                      placeholderTextColor={COLORS.textMuted}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <FontAwesome
                        name={showPassword ? "eye-slash" : "eye"}
                        size={18}
                        color={COLORS.textMuted}
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.password && touched.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Re-enter password"
                      placeholderTextColor={COLORS.textMuted}
                      onChangeText={handleChange("confirmPassword")}
                      onBlur={handleBlur("confirmPassword")}
                      value={values.confirmPassword}
                      secureTextEntry={!showPassword}
                    />
                  </View>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                  activeOpacity={0.85}
                >
                  <Text style={styles.submitButtonText}>Create Account</Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() =>
              router.push({ pathname: "/(auth)/login", params: { role } })
            }
          >
            <Text style={styles.switchText}>
              Already have an account?{" "}
              <Text style={styles.switchLink}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { flexGrow: 1 },
  headerSection: {
    backgroundColor: COLORS.primaryDark,
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  backButton: {
    width: 36, height: 36,
    justifyContent: "center", alignItems: "center",
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8,
  },
  brandName: { fontSize: 28, fontWeight: "900", color: "#FFF" },
  roleBadge: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 12, gap: 4,
  },
  roleBadgeText: { fontSize: 11, fontWeight: "700", color: "#FFF" },
  welcomeTitle: { fontSize: 26, fontWeight: "800", color: COLORS.accent, marginBottom: 4 },
  welcomeSubtitle: { fontSize: 14, color: "rgba(255,255,255,0.7)", fontWeight: "500" },
  formSection: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 40 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: COLORS.primary, marginBottom: 8, marginLeft: 2 },
  inputWrapper: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: 14, backgroundColor: COLORS.card,
    paddingHorizontal: 16,
  },
  input: { flex: 1, height: 52, fontSize: 16, color: COLORS.text },
  errorText: { color: COLORS.danger, fontSize: 12, marginTop: 6, marginLeft: 4 },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16, borderRadius: 16,
    alignItems: "center", marginTop: 8,
    ...SHADOWS.medium,
  },
  submitButtonText: { color: "#FFF", fontSize: 17, fontWeight: "700" },
  switchButton: { marginTop: 20, alignItems: "center" },
  switchText: { fontSize: 14, color: COLORS.textSecondary },
  switchLink: { color: COLORS.primary, fontWeight: "700" },
});
