import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import { getItemsByShop, getMyShop, deleteItem, getShopOrders } from "../../api";
import { useFocusEffect, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, SHADOWS } from "../../constants/theme";

const Dashboard = () => {
  const [shop, setShop] = useState(null);
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchData = async () => {
    try {
      setLoading(true);
      const fetchedShop = await getMyShop();
      setShop(fetchedShop);

      const fetchedItems = await getItemsByShop(fetchedShop._id);
      setItems(fetchedItems);

      try {
        const fetchedOrders = await getShopOrders(fetchedShop._id);
        setOrders(fetchedOrders);
      } catch {
        setOrders([]);
      }

      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    router.replace("/");
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Stats
  const totalProducts = items.length;
  const lowStockItems = items.filter((i) => i.stock < 10).length;
  const todayOrders = orders.filter((o) => {
    const d = new Date(o.createdAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const getStatusColor = (status) => {
    const colors = {
      pending: COLORS.warning,
      confirmed: COLORS.info,
      shipped: "#3F51B5",
      delivered: COLORS.success,
      cancelled: COLORS.danger,
    };
    return colors[status] || COLORS.textMuted;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Green header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>Welcome back 👋</Text>
          <Text style={styles.headerShopName}>
            {shop?.name || "Your Shop"}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.push("/(owner)/orders")}>
            <FontAwesome name="bell-o" size={20} color="#FFF" />
            {orders.filter(o => o.status === "pending").length > 0 && (
              <View style={styles.notifDot}>
                <Text style={styles.notifDotText}>
                  {orders.filter(o => o.status === "pending").length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn} onPress={handleLogout}>
            <FontAwesome name="sign-out" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stat Cards Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={{ fontSize: 24 }}>📦</Text>
            <Text style={[styles.statNumber, { color: COLORS.primary }]}>
              {todayOrders}
            </Text>
            <Text style={styles.statLabel}>Orders Today</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={{ fontSize: 24 }}>💰</Text>
            <Text style={[styles.statNumber, { color: COLORS.primary }]}>
              {totalRevenue >= 1000 ? `${(totalRevenue / 1000).toFixed(1)}K` : totalRevenue}
            </Text>
            <Text style={styles.statLabel}>Revenue (Ksh)</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={{ fontSize: 24 }}>⚠️</Text>
            <Text style={[styles.statNumber, { color: COLORS.warning }]}>
              {lowStockItems}
            </Text>
            <Text style={styles.statLabel}>Low Stock Items</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={{ fontSize: 24 }}>🏷️</Text>
            <Text style={[styles.statNumber, { color: COLORS.primary }]}>
              {totalProducts}
            </Text>
            <Text style={styles.statLabel}>Total Products</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsRow}>
          <TouchableOpacity
            style={styles.quickActionPrimary}
            onPress={() => router.push("/(owner)/manageItems")}
          >
            <FontAwesome name="plus" size={22} color="#FFF" />
            <Text style={styles.quickActionPrimaryText}>Add Product</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionSecondary}
            onPress={() => router.push("/(owner)/orders")}
          >
            <FontAwesome name="list-alt" size={22} color={COLORS.primary} />
            <Text style={styles.quickActionSecondaryText}>Orders</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Orders */}
        <Text style={styles.sectionTitle}>Recent Orders</Text>
        {orders.length === 0 ? (
          <View style={styles.emptyCard}>
            <FontAwesome name="inbox" size={30} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No orders yet</Text>
          </View>
        ) : (
          orders.slice(0, 5).map((order) => (
            <View key={order._id} style={styles.orderCard}>
              <View style={styles.orderCardHeader}>
                <Text style={styles.orderIdText}>
                  #MK-{order._id.substring(0, 4).toUpperCase()}
                </Text>
                <View
                  style={[
                    styles.orderStatusBadge,
                    { backgroundColor: getStatusColor(order.status) + "22" },
                  ]}
                >
                  <Text
                    style={[
                      styles.orderStatusText,
                      { color: getStatusColor(order.status) },
                    ]}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Text>
                </View>
              </View>
              <Text style={styles.orderItemName} numberOfLines={1}>
                {order.items?.map((i) => i.name).join(", ") || "Order"}
              </Text>
              <View style={styles.orderCardFooter}>
                <Text style={styles.orderCustomer}>
                  {order.customer?.email || "Customer"}
                </Text>
                <Text style={styles.orderAmount}>
                  Ksh {order.totalAmount?.toLocaleString() || 0}
                </Text>
              </View>
            </View>
          ))
        )}

        {/* Product list */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Your Products</Text>
        {items.length === 0 ? (
          <View style={styles.emptyCard}>
            <FontAwesome name="shopping-bag" size={30} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No products yet. Add your first!</Text>
          </View>
        ) : (
          items.map((item) => (
            <View key={item._id} style={styles.productCard}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.productPrice}>Ksh {item.price}</Text>
                <Text style={styles.productStock}>Stock: {item.stock}</Text>
              </View>
              <View style={styles.productActions}>
                <TouchableOpacity
                  style={styles.editBtnSmall}
                  onPress={() =>
                    router.push({
                      pathname: "/(owner)/manageItems",
                      params: { itemToEdit: JSON.stringify(item) },
                    })
                  }
                >
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteBtnSmall}
                  onPress={() =>
                    Alert.alert("Delete", "Delete this item?", [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        style: "destructive",
                        onPress: async () => {
                          await deleteItem(item._id);
                          fetchData();
                        },
                      },
                    ])
                  }
                >
                  <FontAwesome name="trash-o" size={14} color={COLORS.danger} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centered: {
    flex: 1, justifyContent: "center", alignItems: "center",
    backgroundColor: COLORS.background,
  },
  // ---- Header ----
  header: {
    backgroundColor: COLORS.primaryDark,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerGreeting: { fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: "500" },
  headerShopName: { fontSize: 22, fontWeight: "800", color: "#FFF", marginTop: 2 },
  headerActions: { flexDirection: "row", gap: 12 },
  headerIconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.15)", justifyContent: "center", alignItems: "center" },
  notifDot: {
    position: "absolute", top: -4, right: -4,
    backgroundColor: COLORS.accent, borderRadius: 10,
    minWidth: 18, height: 18, justifyContent: "center", alignItems: "center",
    borderWidth: 2, borderColor: COLORS.primaryDark,
  },
  notifDotText: { color: "#FFF", fontSize: 10, fontWeight: "700" },
  // ---- Scroll ----
  scrollArea: { flex: 1 },
  scrollContent: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: COLORS.text, marginBottom: 12 },
  // ---- Stats ----
  statsGrid: {
    flexDirection: "row", flexWrap: "wrap",
    justifyContent: "space-between", marginBottom: 24,
  },
  statCard: {
    width: "48%", backgroundColor: COLORS.card,
    borderRadius: 16, padding: 16, marginBottom: 12,
    ...SHADOWS.small,
  },
  statNumber: { fontSize: 28, fontWeight: "800", marginTop: 8 },
  statLabel: { fontSize: 12, color: COLORS.textMuted, fontWeight: "600", marginTop: 4 },
  // ---- Quick Actions ----
  quickActionsRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  quickActionPrimary: {
    flex: 1, backgroundColor: COLORS.primary, borderRadius: 16,
    paddingVertical: 20, alignItems: "center", gap: 8,
    ...SHADOWS.medium,
  },
  quickActionPrimaryText: { color: "#FFF", fontWeight: "700", fontSize: 14 },
  quickActionSecondary: {
    flex: 1, backgroundColor: COLORS.card, borderRadius: 16,
    paddingVertical: 20, alignItems: "center", gap: 8,
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  quickActionSecondaryText: { color: COLORS.primary, fontWeight: "700", fontSize: 14 },
  // ---- Orders ----
  orderCard: {
    backgroundColor: COLORS.card, borderRadius: 14,
    padding: 14, marginBottom: 10, ...SHADOWS.small,
  },
  orderCardHeader: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 6,
  },
  orderIdText: { fontSize: 13, fontWeight: "700", color: COLORS.primary },
  orderStatusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  orderStatusText: { fontSize: 12, fontWeight: "700" },
  orderItemName: { fontSize: 16, fontWeight: "600", color: COLORS.text, marginBottom: 6 },
  orderCardFooter: { flexDirection: "row", justifyContent: "space-between" },
  orderCustomer: { fontSize: 13, color: COLORS.textMuted },
  orderAmount: { fontSize: 15, fontWeight: "800", color: COLORS.text },
  // ---- Products ----
  productCard: {
    backgroundColor: COLORS.card, borderRadius: 14,
    padding: 12, marginBottom: 10, flexDirection: "row",
    alignItems: "center", ...SHADOWS.small,
  },
  productImage: {
    width: 56, height: 56, borderRadius: 12,
    backgroundColor: COLORS.background, marginRight: 12,
  },
  productInfo: { flex: 1 },
  productName: { fontSize: 15, fontWeight: "700", color: COLORS.text },
  productPrice: { fontSize: 14, fontWeight: "700", color: COLORS.primary, marginTop: 2 },
  productStock: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  productActions: { flexDirection: "row", gap: 8 },
  editBtnSmall: {
    backgroundColor: COLORS.primaryLight, paddingHorizontal: 12,
    paddingVertical: 6, borderRadius: 8,
  },
  editBtnText: { color: COLORS.primary, fontSize: 12, fontWeight: "700" },
  deleteBtnSmall: {
    backgroundColor: COLORS.dangerLight, width: 32, height: 32,
    borderRadius: 8, justifyContent: "center", alignItems: "center",
  },
  // ---- Empty + Error ----
  emptyCard: {
    backgroundColor: COLORS.card, borderRadius: 14,
    padding: 30, alignItems: "center", marginBottom: 20,
    ...SHADOWS.small,
  },
  emptyText: { fontSize: 14, color: COLORS.textMuted, marginTop: 10 },
  errorText: { color: COLORS.danger, fontSize: 16, fontWeight: "600" },
});

export default Dashboard;
