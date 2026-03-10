import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

import { API_BASE_URL } from "./constants/Config";
// Create axios instance
const API = axios.create({ baseURL: API_BASE_URL });

// Attach token automatically for all requests
API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Helper: append an image to FormData (works on both web and mobile)
async function appendImageToFormData(formData, fieldName, imageValue) {
  if (!imageValue || !imageValue.uri) return;

  if (Platform.OS === "web") {
    // Web: fetch the URI (blob: or data: URL) and convert to a real Blob
    const response = await fetch(imageValue.uri);
    const blob = await response.blob();
    formData.append(fieldName, blob, imageValue.name || "photo.jpg");
  } else {
    // React Native mobile: the runtime handles { uri, name, type }
    formData.append(fieldName, {
      uri: imageValue.uri,
      name: imageValue.name || "photo.jpg",
      type: imageValue.type || "image/jpeg",
    });
  }
}

// ---------------- AUTH ---------------- //
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);

// ---------------- SHOPS ---------------- //
export const getMyShop = async () => {
  const res = await API.get("/shops/my-shop");
  return res.data;
};

export const addOrUpdateShop = (data) => API.post("/shops/create", data);

// ---------------- ITEMS / PRODUCTS ---------------- //
export const addItem = async (shopId, itemData) => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(itemData)) {
    if (key === "image" && value) {
      await appendImageToFormData(formData, "image", value);
    } else {
      formData.append(key, value);
    }
  }

  const res = await API.post(`/items/${shopId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const editItem = async (id, itemData) => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(itemData)) {
    if (key === "image" && value) {
      await appendImageToFormData(formData, "image", value);
    } else {
      formData.append(key, value);
    }
  }

  const res = await API.put(`/items/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteItem = async (id) => {
  const res = await API.delete(`/items/${id}`);
  return res.data;
};

export const getItemsByShop = async (shopId) => {
  const res = await API.get(`/items/shop/${shopId}`);
  return res.data;
};

export const getAllItems = async () => {
  const res = await API.get("/items");
  return res.data;
};

// ---------------- ORDERS ---------------- //
export const placeOrder = async (orderData) => {
  const res = await API.post("/orders", orderData);
  return res.data;
};

export const getMyOrders = async () => {
  const res = await API.get("/orders/my-orders");
  return res.data;
};

export const getShopOrders = async (shopId) => {
  const res = await API.get(`/orders/shop/${shopId}`);
  return res.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const res = await API.put(`/orders/${orderId}/status`, { status });
  return res.data;
};

export const cancelOrder = async (orderId) => {
  const res = await API.put(`/orders/${orderId}/cancel`);
  return res.data;
};

// ---------------- NOTIFICATIONS ---------------- //
export const getMyNotifications = async () => {
  const res = await API.get("/notifications");
  return res.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const res = await API.put(`/notifications/${notificationId}/read`);
  return res.data;
};
