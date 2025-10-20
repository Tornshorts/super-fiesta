import { Formik } from "formik";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";
import { useRouter, useLocalSearchParams } from "expo-router";
import { registerUser } from "../../api";

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
  const router = useRouter(); // <-- Add this line

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Register as {role === "owner" ? "store owner" : "Customer"}
      </Text>

      {/*Formik Integration */}
      <Formik
        initialValues={{
          email: "",
          password: "",
          confirmPassword: "", // <-- Add confirmPassword
        }}
        onSubmit={async (values) => {
          try {
            const response = await registerUser({
              email: values.email,
              password: values.password,
            });
            console.log("✅ Registered:", response);
            alert("Registration successful!");
            router.push("/(auth)/login");
          } catch (err) {
            console.error(
              "❌ Registration failed:",
              err.response?.data || err.message
            );
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

            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              onChangeText={handleChange("confirmPassword")} // <-- Fix name
              onBlur={handleBlur("confirmPassword")} // <-- Fix name
              value={values.confirmPassword} // <-- Fix value
              secureTextEntry
            />
            {/*Errors */}
            {errors.confirmPassword && touched.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
            {/* Register */}
            <TouchableOpacity onPress={handleSubmit}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Register</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </Formik>

      <TouchableOpacity
        style={styles.switchButton}
        onPress={() =>
          router.push({ pathname: "/(auth)/login", params: { role } })
        }
      >
        <Text style={styles.switchButtonText}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Register;

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
