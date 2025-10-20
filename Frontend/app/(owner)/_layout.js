import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";

export default function Tablayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#6200ea", // Active icon/text color
        tabBarInactiveTintColor: "#888", // Inactive color
        tabBarStyle: {
          backgroundColor: "#fff", // White background
          borderTopWidth: 0,
          elevation: 5, // Shadow for Android
          shadowColor: "#000", // Shadow for iOS
          shadowOpacity: 0.1,
          shadowRadius: 5,
          height: Platform.OS === "ios" ? 90 : 70,
          paddingBottom: Platform.OS === "ios" ? 25 : 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="list-alt" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="addShop"
        options={{
          title: "Create Shop",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="shopping-bag" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="manageItems"
        options={{
          title: "Manage Items",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="edit" color={color} size={size} />
          ),
          // Hide this tab from the bar. We'll navigate to it programmatically.
        }}
      />
    </Tabs>
  );
}
