import { useRouter, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";
import { loginUser } from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const validationSchema = Yup.object().shape({
  email: Yup.string().required("Email is required").email().label("Email"),
  password: Yup.string()
    .required("Password is required")
    .min(4)
    .label("Password"),
});

const login = () => {
  const router = useRouter();
  const { role } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Login as {role === "owner" ? "store owner" : "Customer"}
      </Text>

      {/*Formik Integration */}
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={async (values) => {
          try {
            const res = await loginUser(values);

            // axios returns data on res.data
            const { token, user } = res.data || {};
            if (!token || !user) {
              throw new Error("Invalid login response");
            }
            // Save token + user info
            await AsyncStorage.setItem("token", token);
            await AsyncStorage.setItem("user", JSON.stringify(user));
            console.log("✅ Token saved:", token);

            if (role === "owner") router.push("/dashboard");
            else router.push("/home");
          } catch (err) {
            console.error(
              "❌ Login failed:",
              err.response?.data || err.message
            );
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
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              keyboardType="email-address"
            />
            {/*Errors */}
            {errors.email && touched.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Password"
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              secureTextEntry
            />
            {/*Errors */}
            {errors.password && touched.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            {/* Login */}
            <TouchableOpacity onPress={handleSubmit}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Login</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </Formik>

      <TouchableOpacity
        style={styles.switchButton}
        onPress={() =>
          router.push({ pathname: "/(auth)/register", params: { role } })
        }
      >
        <Text style={styles.switchButtonText}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
  },
  form: {
    width: "100%",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
    marginBottom: 16,
  },
  button: {
    height: 50,
    backgroundColor: "#6200ea",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  switchButton: {
    marginTop: 20,
  },
  switchButtonText: {
    color: "#6200ea",
    fontSize: 16,
  },
});
