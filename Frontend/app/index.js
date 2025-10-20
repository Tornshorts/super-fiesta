import React from "react";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={["#8BC34A", "#4CAF50"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Header logo and title */}
      <View style={styles.header}>
        <Image
          source={require("../assets/images/icon.png")} // <-- replace with your logo
          style={styles.logo}
        />
        <Text style={styles.title}>Mkulima</Text>
        <Text style={styles.subtitle}>
          Buy and sell agrovet products from the comfort of your home
        </Text>
      </View>

      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/7675/7675375.png",
          }}
          style={styles.illustration}
        />
      </View>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>
          Welcome to Agrovet Marketplace — a digital platform that connects
          farmers, livestock owners, and agrovet shops. Customers can order
          products anytime, and store owners can showcase and sell their
          products effortlessly.
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push({ pathname: "login", params: { role: "owner" } })
          }
        >
          <Text style={styles.buttonText}>I’m a Store Owner</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() =>
            router.push({ pathname: "login", params: { role: "customer" } })
          }
        >
          <Text style={styles.secondaryButtonText}>I’m a Customer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F5E9",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 30,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: "#f1f1f1",
    fontSize: 16,
    textAlign: "center",
    marginTop: 6,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
  },
  illustration: {
    width: 100,
    height: 90,
    resizeMode: "contain",
  },
  descriptionContainer: {
    paddingHorizontal: 30,
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    lineHeight: 22,
  },
  buttons: {
    flexDirection: "column",
    width: "85%",
    alignItems: "center",
    marginBottom: 0,
  },
  button: {
    backgroundColor: "#2E7D32",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#2E7D32",
  },
  secondaryButtonText: {
    color: "#2E7D32",
    fontSize: 18,
    fontWeight: "bold",
  },
});
