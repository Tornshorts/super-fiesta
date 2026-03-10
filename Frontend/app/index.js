import React from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS, SHADOWS } from "../constants/theme";

const { width } = Dimensions.get("window");

// ────────────────────────────────────────────────
// BACKGROUND IMAGE: Once you place your sunflower image at
// ../assets/images/backgrounds/landing-bg.jpg
// 1. Uncomment the import: import { ImageBackground } from "react-native";
// 2. Replace <View style={styles.heroSection}> with:
//    <ImageBackground source={require("../assets/images/backgrounds/landing-bg.jpg")}
//      style={styles.heroSection} resizeMode="cover">
// 3. Close with </ImageBackground> instead of </View>
// ────────────────────────────────────────────────

const Home = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Hero section — gradient (swap to ImageBackground when bg image is added) */}
      <View style={styles.heroSection}>
        <LinearGradient
          colors={[COLORS.primaryDark, COLORS.primary, "#2E7D32"]}
          style={StyleSheet.absoluteFill}
        />

        <SafeAreaView style={styles.heroContent}>
          <View style={styles.logoRow}>
            <Image
              source={require("../assets/images/icon.png")}
              style={styles.logo}
            />
            <View>
              <Text style={styles.brandName}>Mkulima</Text>
              <Text style={styles.brandTagline}>Digital Agrovet Marketplace</Text>
            </View>
          </View>

          <Text style={styles.heroTagline}>
            Your digital agrovet marketplace — connecting{"\n"}Kenyan farmers with quality agri-inputs.
          </Text>
        </SafeAreaView>
      </View>

      {/* Bottom section */}
      <View style={styles.bottomSection}>
        <Text style={styles.sectionTitle}>How are you using Mkulima?</Text>
        <Text style={styles.sectionSubtitle}>Choose your role to get started</Text>

        {/* Customer Role Card */}
        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => router.push({ pathname: "login", params: { role: "customer" } })}
          activeOpacity={0.85}
        >
          <View style={[styles.roleIconCircle, { backgroundColor: COLORS.primaryLight }]}>
            <Text style={{ fontSize: 28 }}>🛒</Text>
          </View>
          <View style={styles.roleTextContainer}>
            <Text style={styles.roleTitle}>I'm a Customer</Text>
            <Text style={styles.roleDescription}>
              Buy seeds, feeds, fertilizers & more
            </Text>
          </View>
          <FontAwesome name="chevron-right" size={16} color={COLORS.textMuted} />
        </TouchableOpacity>

        {/* Store Owner Role Card */}
        <TouchableOpacity
          style={[styles.roleCard, styles.ownerCard]}
          onPress={() => router.push({ pathname: "login", params: { role: "owner" } })}
          activeOpacity={0.85}
        >
          <View style={[styles.roleIconCircle, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Text style={{ fontSize: 28 }}>🏪</Text>
          </View>
          <View style={styles.roleTextContainer}>
            <Text style={[styles.roleTitle, { color: "#FFF" }]}>I'm a Store Owner</Text>
            <Text style={[styles.roleDescription, { color: "rgba(255,255,255,0.8)" }]}>
              Manage your agrovet & reach more farmers
            </Text>
          </View>
          <FontAwesome name="chevron-right" size={16} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>

        {/* Trust Badges */}
        <View style={styles.trustRow}>
          <View style={styles.trustBadge}>
            <FontAwesome name="check-circle" size={18} color={COLORS.primary} />
            <Text style={styles.trustText}>Verified Stores</Text>
          </View>
          <View style={styles.trustBadge}>
            <FontAwesome name="truck" size={16} color={COLORS.primary} />
            <Text style={styles.trustText}>Fast Delivery</Text>
          </View>
          <View style={styles.trustBadge}>
            <FontAwesome name="mobile-phone" size={20} color={COLORS.primary} />
            <Text style={styles.trustText}>M-PESA Ready</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // ---- Hero ----
  heroSection: {
    height: "45%",
    justifyContent: "flex-end",
  },
  heroContent: {
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 16,
    marginRight: 12,
  },
  brandName: {
    fontSize: 34,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: 0.5,
  },
  brandTagline: {
    fontSize: 13,
    color: COLORS.accent,
    fontWeight: "600",
    marginTop: 2,
  },
  heroTagline: {
    fontSize: 15,
    color: "rgba(255,255,255,0.85)",
    lineHeight: 22,
    fontWeight: "500",
  },
  // ---- Bottom Section ----
  bottomSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: "center",
    marginBottom: 24,
  },
  // ---- Role Cards ----
  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.medium,
  },
  ownerCard: {
    backgroundColor: COLORS.primary,
  },
  roleIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  roleTextContainer: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 3,
  },
  roleDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  // ---- Trust Badges ----
  trustRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  trustBadge: {
    alignItems: "center",
    gap: 6,
  },
  trustText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
});
