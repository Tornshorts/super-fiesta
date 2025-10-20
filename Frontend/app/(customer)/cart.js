import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useCart } from "../../CartContext";
import { placeOrder } from "../../api";

const CartScreen = () => {
  const { cartItems, updateQuantity, cartTotal, clearCart } = useCart();

  const handleCheckout = async () => {
    // Group items by shop
    const ordersByShop = cartItems.reduce((acc, cartItem) => {
      const shopId = cartItem.item.shop._id;
      if (!acc[shopId]) {
        acc[shopId] = [];
      }
      acc[shopId].push({
        itemId: cartItem.item._id,
        quantity: cartItem.quantity,
      });
      return acc;
    }, {});

    try {
      // Create an order for each shop
      for (const shopId in ordersByShop) {
        const orderData = {
          shopId: shopId,
          items: ordersByShop[shopId],
        };
        await placeOrder(orderData);
      }

      Alert.alert("Success", "Your orders have been placed successfully!");
      clearCart();
    } catch (err) {
      Alert.alert(
        "Checkout Failed",
        err.response?.data?.message || "Could not place orders."
      );
    }
  };

  const renderItem = ({ item: cartItem }) => (
    <View style={styles.itemContainer}>
      <Image
        source={{ uri: `http://192.168.100.5:5000${cartItem.item.image}` }}
        style={styles.itemImage}
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{cartItem.item.name}</Text>
        <Text style={styles.itemPrice}>Ksh {cartItem.item.price}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          onPress={() =>
            updateQuantity(cartItem.item._id, cartItem.quantity - 1)
          }
        >
          <Text style={styles.quantityButton}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{cartItem.quantity}</Text>
        <TouchableOpacity
          onPress={() =>
            updateQuantity(cartItem.item._id, cartItem.quantity + 1)
          }
        >
          <Text style={styles.quantityButton}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Cart</Text>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.item._id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Your cart is empty.</Text>
        }
      />
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: Ksh {cartTotal.toFixed(2)}</Text>
        <TouchableOpacity
          style={[
            styles.checkoutButton,
            cartItems.length === 0 && styles.disabledButton,
          ]}
          onPress={handleCheckout}
          disabled={cartItems.length === 0}
        >
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  emptyText: { textAlign: "center", marginTop: 50, fontSize: 16 },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  itemImage: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: "bold" },
  itemPrice: { fontSize: 14, color: "#6200ea" },
  quantityContainer: { flexDirection: "row", alignItems: "center" },
  quantityButton: {
    fontSize: 20,
    paddingHorizontal: 10,
    color: "#6200ea",
  },
  quantityText: { fontSize: 16, fontWeight: "bold", marginHorizontal: 5 },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 20,
    marginTop: 10,
  },
  totalText: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  checkoutButton: {
    backgroundColor: "#6200ea",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  checkoutButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  disabledButton: { backgroundColor: "#ccc" },
});

export default CartScreen;
