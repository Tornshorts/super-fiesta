import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { getMyNotifications, markNotificationAsRead } from "../../api";
import { FontAwesome } from "@expo/vector-icons";

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getMyNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const handlePressNotification = async (item) => {
    if (!item.read) {
      await markNotificationAsRead(item._id);
      fetchNotifications(); // Refresh to show the "read" state
    }
    // Optional: Navigate to the order details screen
    // router.push(`/orders/${item.orderId}`);
  };

  if (loading) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.notificationItem, !item.read && styles.unread]}
            onPress={() => handlePressNotification(item)}
          >
            <FontAwesome
              name={item.read ? "check-circle-o" : "bell"}
              size={24}
              color={item.read ? "#aaa" : "#6200ea"}
            />
            <View style={styles.notificationTextContainer}>
              <Text style={styles.notificationMessage}>{item.message}</Text>
              <Text style={styles.notificationDate}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.centered}>You have no notifications.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  centered: { flex: 1, textAlign: "center", marginTop: 50 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  unread: { backgroundColor: "#e8dfff" },
  notificationTextContainer: { flex: 1, marginLeft: 15 },
  notificationMessage: { fontSize: 16 },
  notificationDate: { fontSize: 12, color: "#6c757d", marginTop: 4 },
});

export default NotificationsScreen;
