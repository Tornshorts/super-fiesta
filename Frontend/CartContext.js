import React, { createContext, useState, useContext } from "react";
import { Alert } from "react-native";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item, quantity) => {
    // Check if the item is already in the cart
    const existingItem = cartItems.find(
      (cartItem) => cartItem.item._id === item._id
    );

    if (existingItem) {
      // If it exists, update the quantity
      updateQuantity(item._id, existingItem.quantity + quantity);
    } else {
      // If it's a new item, add it to the cart
      setCartItems([...cartItems, { item, quantity }]);
    }
    Alert.alert("Success", `${item.name} added to cart!`);
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      // If quantity is 0 or less, remove the item
      removeFromCart(itemId);
    } else {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.item._id === itemId
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        )
      );
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter((cartItem) => cartItem.item._id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce(
    (total, cartItem) => total + cartItem.item.price * cartItem.quantity,
    0
  );

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
