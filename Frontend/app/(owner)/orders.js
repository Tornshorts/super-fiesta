import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import { useFocusEffect } from "expo-router";
import { getMyShop, getShopOrders, updateOrderStatus } from "../../api";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS, SHADOWS } from "../../constants/theme";

const OwnerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchShopAndOrders = async () => {
    try {
      setLoading(true);
      const shop = await getMyShop();
      if (shop && shop._id) {
        const fetchedOrders = await getShopOrders(shop._id);
        setOrders(fetchedOrders);
      } else {
        setError("You must create a shop first.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchShopAndOrders();
    }, [])
  );

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      Alert.alert("Success", "Order status updated!");
      fetchShopAndOrders();
    } catch (err) {
      Alert.alert("Error", "Failed to update status.");
    }
  };

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

  const renderOrderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>#{item._id.substring(0, 8)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + "22" }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.customerRow}>
        <FontAwesome name="user-o" size={13} color={COLORS.textMuted} style={{ marginRight: 6 }} />
        <Text style={styles.customerEmail}>{item.customer?.email || "N/A"}</Text>
      </View>

      <Text style={styles.dateText}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>

      <View style={styles.divider} />

      {item.items.map((product) => (
        <View key={product._id} style={styles.productRow}>
          <Text style={styles.productName}>
            {product.name} <Text style={styles.productQty}>×{product.quantity}</Text>
          </Text>
          <Text style={styles.productPrice}>Ksh {product.price * product.quantity}</Text>
        </View>
      ))}

      <View style={styles.divider} />

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalAmount}>Ksh {item.totalAmount}</Text>
      </View>

      <View style={styles.actionsRow}>
        {item.status === "pending" && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: COLORS.successLight }]}
            onPress={() => handleStatusUpdate(item._id, "confirmed")}
          >
            <FontAwesome name="check" size={14} color={COLORS.success} style={{ marginRight: 6 }} />
            <Text style={[styles.actionText, { color: COLORS.success }]}>Confirm</Text>
          </TouchableOpacity>
        )}
        {item.status === "confirmed" && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: COLORS.infoLight }]}
            onPress={() => handleStatusUpdate(item._id, "shipped")}
          >
            <FontAwesome name="truck" size={14} color={COLORS.info} style={{ marginRight: 6 }} />
            <Text style={[styles.actionText, { color: COLORS.info }]}>Ship</Text>
          </TouchableOpacity>
        )}
        {item.status === "shipped" && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: COLORS.primaryLight }]}
            onPress={() => handleStatusUpdate(item._id, "delivered")}
          >
            <FontAwesome name="flag-checkered" size={14} color={COLORS.primary} style={{ marginRight: 6 }} />
            <Text style={[styles.actionText, { color: COLORS.primary }]}>Delivered</Text>
          </TouchableOpacity>
        )}
        {(item.status === "delivered" || item.status === "cancelled") && (
          <Text style={styles.noActionText}>No further actions</Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Incoming Orders</Text>
      </View>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome name="inbox" size={40} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No orders yet</Text>
            <Text style={styles.emptySubText}>Orders from customers will appear here</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primaryDark,
    paddingTop: 50, paddingBottom: 18, paddingHorizontal: 20,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#FFF" },
  listContent: { padding: 20, paddingBottom: 100 },
  card: {
    backgroundColor: COLORS.card, borderRadius: 16, padding: 16,
    marginBottom: 14, ...SHADOWS.small,
  },
  cardHeader: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 8,
  },
  orderId: { fontWeight: "700", fontSize: 16, color: COLORS.text },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: "700" },
  customerRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  customerEmail: { fontSize: 13, color: COLORS.textSecondary },
  dateText: { fontSize: 12, color: COLORS.textMuted, marginBottom: 10 },
  divider: { height: 1, backgroundColor: COLORS.divider, marginVertical: 10 },
  productRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  productName: { fontSize: 14, color: COLORS.text },
  productQty: { color: COLORS.textMuted },
  productPrice: { fontSize: 14, color: COLORS.text, fontWeight: "500" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  totalLabel: { fontSize: 14, color: COLORS.textMuted },
  totalAmount: { fontWeight: "800", fontSize: 18, color: COLORS.text },
  actionsRow: {
    flexDirection: "row", justifyContent: "flex-end",
    marginTop: 12, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: COLORS.divider,
  },
  actionButton: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12,
  },
  actionText: { fontWeight: "600", fontSize: 14 },
  noActionText: { color: COLORS.textMuted, fontStyle: "italic", fontSize: 13 },
  errorText: { color: COLORS.danger, fontSize: 16, fontWeight: "600" },
  emptyContainer: { alignItems: "center", marginTop: 60 },
  emptyText: { fontSize: 20, fontWeight: "700", color: COLORS.text, marginTop: 16, marginBottom: 6 },
  emptySubText: { fontSize: 14, color: COLORS.textMuted },
});

export default OwnerOrders;
