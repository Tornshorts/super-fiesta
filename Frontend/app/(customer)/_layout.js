import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { CartProvider, useCart } from "../../CartContext";
import { View, Text, Platform } from "react-native";

function CartIconWithBadge({ color, size }) {
  const { cartItems } = useCart();
  const itemCount = cartItems.length;

  return (
    <View style={{ width: 28, height: 28, margin: 5 }}>
      <FontAwesome name="shopping-cart" color={color} size={size} />
      {itemCount > 0 && (
        <View
          style={{
            position: "absolute",
            right: -6,
            top: -6,
            backgroundColor: "#FF3B30",
            borderRadius: 10,
            minWidth: 18,
            height: 18,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1.5,
            borderColor: "#FFF",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 10,
              fontWeight: "bold",
              paddingHorizontal: 2,
            }}
          >
            {itemCount > 99 ? "99+" : itemCount}
          </Text>
        </View>
      )}
    </View>
  );
}

function CustomerTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1B5E20",
        tabBarInactiveTintColor: "#BDBDBD", // Muted gray for inactive
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          elevation: 10, // Shadow for Android
          shadowColor: "#000", // Shadow for iOS
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          height: Platform.OS === "ios" ? 85 : 65,
          paddingBottom: Platform.OS === "ios" ? 25 : 10,
          paddingTop: 10,
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
          borderRadius: 25,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: -2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size }) => (
            <CartIconWithBadge color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="customerProfile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Alerts",
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
