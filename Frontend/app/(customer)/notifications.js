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
      fetchNotifications();
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1B5E20" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, !item.read && styles.unreadCard]}
            onPress={() => handlePressNotification(item)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, !item.read && styles.unreadIcon]}>
              <FontAwesome
                name={item.read ? "check-circle" : "bell"}
                size={20}
                color={item.read ? "#BDBDBD" : "#1B5E20"}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.message, !item.read && styles.unreadMessage]}>
                {item.message}
              </Text>
              <Text style={styles.date}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome name="bell-slash-o" size={40} color="#BDBDBD" />
            <Text style={styles.emptyText}>No notifications</Text>
            <Text style={styles.emptySubText}>You're all caught up!</Text>
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  unreadCard: {
    borderLeftWidth: 3,
    borderLeftColor: "#1B5E20",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F4F6F8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  unreadIcon: {
    backgroundColor: "#E8F5E9",
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  unreadMessage: {
    color: "#1A1A1A",
    fontWeight: "600",
  },
  date: {
    fontSize: 12,
    color: "#BDBDBD",
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 16,
    marginBottom: 6,
  },
  emptySubText: {
    fontSize: 14,
    color: "#888",
  },
});

export default NotificationsScreen;
