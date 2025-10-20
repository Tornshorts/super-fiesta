import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { getAllItems, placeOrder } from "../../api";
import { useCart } from "../../CartContext";

const CustomerHome = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const fetchItems = async () => {
    try {
      setLoading(true);
      const fetchedItems = await getAllItems();
      setItems(fetchedItems);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch items.");
    } finally {
      setLoading(false);
    }
  };

  const openOrderModal = (item) => {
    setSelectedItem(item);
    setQuantity(1); // Reset to 1 every time modal opens
    setModalVisible(true);
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;
    addToCart(selectedItem, quantity);
    setModalVisible(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchItems();
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
      {selectedItem && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>{selectedItem.name}</Text>
              <Text style={styles.modalStock}>
                Available Stock: {selectedItem.stock}
              </Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() =>
                    setQuantity(Math.min(selectedItem.stock, quantity + 1))
                  }
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={handleAddToCart}
              >
                <Text style={styles.buyButtonText}>Add to Cart</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      <Text style={styles.title}>Marketplace</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image
              source={{ uri: `http://Your_url_here:5000${item.image}` }}
              style={styles.itemImage}
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>Ksh {item.price}</Text>
              <Text style={styles.itemShop}>
                Sold by: {item.shop?.name || "Unknown Shop"}
              </Text>
              <Text style={item.stock > 0 ? styles.inStock : styles.outOfStock}>
                Stock: {item.stock}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.buyButton,
                item.stock === 0 && styles.disabledButton,
              ]}
              onPress={() => openOrderModal(item)}
              disabled={item.stock === 0}
            >
              <Text style={styles.buyButtonText}>Buy</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text>No items available right now.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#333" },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  itemImage: { width: 80, height: 80, borderRadius: 10, marginRight: 15 },
  itemInfo: { flex: 1, justifyContent: "center", gap: 2 },
  itemName: { fontSize: 18, fontWeight: "bold" },
  itemPrice: { fontSize: 16, color: "#6200ea", fontWeight: "600" },
  itemShop: { fontSize: 14, color: "#6c757d" },
  error: { color: "red" },
  inStock: { fontSize: 12, color: "green" },
  outOfStock: { fontSize: 12, color: "red" },
  buyButton: {
    backgroundColor: "#6200ea",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: "center",
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buyButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  modalStock: { fontSize: 14, color: "#6c757d", marginBottom: 20 },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  quantityButton: {
    backgroundColor: "#ddd",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  quantityButtonText: { fontSize: 20, fontWeight: "bold" },
  quantityText: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 20,
    minWidth: 40,
    textAlign: "center",
  },
  addToCartButton: {
    backgroundColor: "#6200ea",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: "100%",
    alignItems: "center",
  },
  cancelButton: {
    marginTop: 15,
  },
  cancelButtonText: {
    color: "#dc3545",
  },
});

export default CustomerHome;
