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
    <View style={styles.card}>
      <Image
        source={{ uri: cartItem.item.image }}
        style={styles.cardImage}
      />
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.cardTitle} numberOfLines={1}>{cartItem.item.name}</Text>
          <Text style={styles.cardPrice}>Ksh {cartItem.item.price}</Text>
        </View>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() =>
              updateQuantity(cartItem.item._id, cartItem.quantity - 1)
            }
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{cartItem.quantity}</Text>
          <TouchableOpacity
             style={styles.quantityButton}
            onPress={() =>
              updateQuantity(cartItem.item._id, cartItem.quantity + 1)
            }
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>My Cart</Text>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.item._id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Your cart is empty.</Text>
            <Text style={styles.emptySubText}>Add items to start shopping</Text>
          </View>
        }
      />
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>Ksh {cartTotal.toFixed(2)}</Text>
        </View>
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
  container: { 
    flex: 1, 
    backgroundColor: "#F5F5F0",
    paddingTop: 50,
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
    paddingBottom: 100, // Space for footer
  },
  emptyContainer: {
    alignItems: 'center',
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardImage: { 
    width: 60, 
    height: 60, 
    borderRadius: 12, 
    marginRight: 16,
    backgroundColor: "#F0F0F0",
  },
  cardContent: { 
    flex: 1, 
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: { 
    fontSize: 16, 
    fontWeight: "700", 
    color: "#1A1A1A",
    marginBottom: 4,
  },
  cardPrice: { 
    fontSize: 14, 
    color: "#1B5E20", 
    fontWeight: "600",
  },
  quantityContainer: { 
    flexDirection: "row", 
    alignItems: "center",
    backgroundColor: "#F4F6F8",
    borderRadius: 20,
    padding: 2,
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  quantityButtonText: { 
    fontSize: 16, 
    color: "#1A1A1A",
    fontWeight: "600",
  },
  quantityText: { 
    fontSize: 14, 
    fontWeight: "700", 
    marginHorizontal: 12,
    minWidth: 16,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    color: "#888",
    fontWeight: "500",
  },
  totalPrice: { 
    fontSize: 24, 
    fontWeight: "800", 
    color: "#1A1A1A",
  },
  checkoutButton: {
    backgroundColor: "#1B5E20",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#1B5E20",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  checkoutButtonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "700", 
  },
  disabledButton: { 
    backgroundColor: "#E0E0E0",
    shadowOpacity: 0,
    elevation: 0,
  },
});

export default CartScreen;
