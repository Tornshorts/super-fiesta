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
              fetchOrders();
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
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1B5E20" />
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

  const getStatusColor = (status) => {
    const colors = {
      pending: "#FF9800",
      confirmed: "#2196F3",
      shipped: "#3F51B5",
      delivered: "#4CAF50",
      cancelled: "#F44336",
    };
    return colors[status] || "#888";
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>#{item._id.substring(0, 8)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.shopRow}>
        <Text style={styles.shopLabel}>From</Text>
        <Text style={styles.shopName}>{item.shop.name}</Text>
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

      {item.status === "pending" && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => handleCancelOrder(item._id)}
        >
          <Text style={styles.cancelButtonText}>Cancel Order</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>My Orders</Text>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders yet</Text>
            <Text style={styles.emptySubText}>Your order history will appear here</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F0",
    paddingTop: 50,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F0",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1A1A1A",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  orderId: {
    fontWeight: "700",
    fontSize: 16,
    color: "#1A1A1A",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },
  shopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  shopLabel: {
    fontSize: 13,
    color: "#999",
    marginRight: 6,
  },
  shopName: {
    fontSize: 14,
    color: "#444",
    fontWeight: "600",
  },
  dateText: {
    fontSize: 12,
    color: "#BDBDBD",
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 10,
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  productName: {
    fontSize: 14,
    color: "#333",
  },
  productQty: {
    color: "#999",
  },
  productPrice: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 14,
    color: "#888",
  },
  totalAmount: {
    fontWeight: "800",
    fontSize: 18,
    color: "#1A1A1A",
  },
  cancelButton: {
    marginTop: 12,
    backgroundColor: "#FFEBEE",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#C62828",
    fontWeight: "600",
    fontSize: 14,
  },
  errorText: {
    color: "#C62828",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#888",
  },
});

export default CustomerProfile;
