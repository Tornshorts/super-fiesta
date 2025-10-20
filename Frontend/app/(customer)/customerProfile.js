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
import { getMyOrders, cancelOrder } from "../../api";

const CustomerProfile = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const fetchedOrders = await getMyOrders();
      setOrders(fetchedOrders);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = (orderId) => {
    Alert.alert(
      "Cancel Order",
      "Are you sure you want to cancel this order?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              await cancelOrder(orderId);
              fetchOrders(); // Refresh the list
            } catch (err) {
              Alert.alert("Error", err.response?.data?.message || "Failed to cancel order.");
            }
          },
        },
      ]
    );
  };
  useFocusEffect(
    React.useCallback(() => {
      fetchOrders();
    }, [])
  );

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
      <Text style={styles.shopName}>From: {item.shop.name}</Text>

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

      {item.status === "pending" && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleCancelOrder(item._id)}
          >
            <Text style={styles.cancelButtonText}>Cancel Order</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Orders</Text>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <Text style={styles.centered}>You have no orders yet.</Text>
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
  shopName: { fontStyle: "italic", color: "#333", marginVertical: 8 },
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
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    alignItems: "flex-end",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default CustomerProfile;
