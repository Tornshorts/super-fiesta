import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { CartProvider, useCart } from "../../CartContext";
import { View, Text } from "react-native";

function CartIconWithBadge({ color, size }) {
  const { cartItems } = useCart();
  const itemCount = cartItems.length;

  return (
    <View>
      <FontAwesome name="shopping-cart" color={color} size={size} />
      {itemCount > 0 && (
        <View
          style={{
            position: "absolute",
            right: -6,
            top: -3,
            backgroundColor: "red",
            borderRadius: 8,
            width: 16,
            height: 16,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>
            {itemCount}
          </Text>
        </View>
      )}
    </View>
  );
}

function CustomerTabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="customerProfile"
        options={{
          headerShown: false,
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          headerShown: false,
          title: "Cart",
          tabBarIcon: ({ color, size }) => (
            <CartIconWithBadge color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          headerShown: false,
          title: "Notifications",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="bell" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

export default function Tablayout() {
  return (
    <CartProvider>
      <CustomerTabsLayout />
    </CartProvider>
  );
}
