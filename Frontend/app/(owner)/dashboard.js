import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { getItemsByShop, getMyShop, deleteItem } from "../../api";
import { useFocusEffect, useRouter } from "expo-router";

const Dashboard = () => {
  const [shop, setShop] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchShopAndItems = async () => {
    try {
      setLoading(true);
      // 1. Fetch the user's shop to get the shopId
      const fetchedShop = await getMyShop();
      setShop(fetchedShop);

      // 2. Use the fetched shopId to get the items
      const fetchedItems = await getItemsByShop(fetchedShop._id);
      setItems(fetchedItems);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    router.push({
      pathname: "/(owner)/manageItems",
      params: { itemToEdit: JSON.stringify(item) },
    });
  };

  const handleDelete = (itemId) => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteItem(itemId);
          fetchShopAndItems(); // Refresh the list
        },
      },
    ]);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchShopAndItems();
    }, [])
  );

  if (loading) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  if (error) {
    return <Text style={[styles.centered, styles.error]}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{shop?.name || "Your Shop"}'s Items</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image
              source={{
                uri: `http://192.168.100.5:5000${item.image}`,
              }}
              style={styles.itemImage}
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text>ksh{item.price}</Text>
              <Text>{item.description}</Text>
            </View>
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit(item)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item._id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>You haven't added any items yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
  },
  itemInfo: { flex: 1, gap: 4 },
  itemName: { fontSize: 16, fontWeight: "bold" },
  error: { color: "red" },
  actionsContainer: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 10,
  },
  editButton: {
    backgroundColor: "#ffc107", // A yellow/amber color for edit
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: "#dc3545", // A red color for delete
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Dashboard;
