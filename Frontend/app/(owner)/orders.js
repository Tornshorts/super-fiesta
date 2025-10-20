import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useFocusEffect } from "expo-router";
import { getMyShop, getShopOrders, updateOrderStatus } from "../../api";

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
      fetchShopAndOrders(); // Refresh the list
    } catch (err) {
      Alert.alert("Error", "Failed to update status.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  if (error) {
    return <Text style={[styles.centered, styles.error]}>{error}</Text>;
  }

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderContainer}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item._id.substring(0, 8)}</Text>
        <Text style={styles.orderDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.customerInfo}>
        Customer: {item.customer?.email || "N/A"}
      </Text>

      {item.items.map((product) => (
        <View key={product._id} style={styles.productItem}>
          <Text>
            {product.name} (x{product.quantity})
          </Text>
          <Text>Ksh {product.price * product.quantity}</Text>
        </View>
      ))}

      <View style={styles.orderFooter}>
        <Text style={styles.totalAmount}>Total: Ksh {item.totalAmount}</Text>
        <Text style={[styles.status, styles[`status_${item.status}`]]}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>

      <View style={styles.actionsContainer}>
        {item.status === "pending" && (
          <TouchableOpacity
            style={[styles.actionButton, styles.confirmButton]}
            onPress={() => handleStatusUpdate(item._id, "confirmed")}
          >
            <Text style={styles.actionButtonText}>Confirm</Text>
          </TouchableOpacity>
        )}
        {item.status === "confirmed" && (
          <TouchableOpacity
            style={[styles.actionButton, styles.shipButton]}
            onPress={() => handleStatusUpdate(item._id, "shipped")}
          >
            <Text style={styles.actionButtonText}>Ship Order</Text>
          </TouchableOpacity>
        )}
        {item.status === "shipped" && (
          <TouchableOpacity
            style={[styles.actionButton, styles.deliverButton]}
            onPress={() => handleStatusUpdate(item._id, "delivered")}
          >
            <Text style={styles.actionButtonText}>Mark as Delivered</Text>
          </TouchableOpacity>
        )}
        {/* No action shown for delivered or cancelled orders */}
        {(item.status === "delivered" || item.status === "cancelled") && (
          <Text style={styles.noActionText}>No further actions</Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Incoming Orders</Text>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <Text style={styles.centered}>You have no incoming orders.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  centered: { flex: 1, textAlign: "center", marginTop: 50 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  error: { color: "red" },
  orderContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  orderHeader: { flexDirection: "row", justifyContent: "space-between" },
  orderId: { fontWeight: "bold", fontSize: 16 },
  orderDate: { color: "#6c757d" },
  customerInfo: { fontStyle: "italic", color: "#333", marginVertical: 8 },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  totalAmount: { fontWeight: "bold", fontSize: 16 },
  status: {
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    color: "#fff",
    overflow: "hidden",
  },
  status_pending: { backgroundColor: "#ffc107" },
  status_confirmed: { backgroundColor: "#17a2b8" },
  status_shipped: { backgroundColor: "#007bff" },
  status_delivered: { backgroundColor: "#28a745" },
  status_cancelled: { backgroundColor: "#dc3545" },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  actionButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  actionButtonText: { color: "#fff", fontWeight: "bold" },
  confirmButton: { backgroundColor: "#28a745" },
  shipButton: { backgroundColor: "#007bff" },
  deliverButton: { backgroundColor: "#17a2b8" },
  noActionText: { color: "#6c757d", fontStyle: "italic" },
});

export default OwnerOrders;
