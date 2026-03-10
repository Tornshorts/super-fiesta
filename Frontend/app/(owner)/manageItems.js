import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { addItem, editItem, getMyShop } from "../../api";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS, SHADOWS } from "../../constants/theme";

export default function ManageItems() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const itemToEdit = params.itemToEdit ? JSON.parse(params.itemToEdit) : null;

  const [currentShopId, setCurrentShopId] = useState(params.shopId);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isEditMode = !!itemToEdit;

  useEffect(() => {
    if (isEditMode) {
      setName(itemToEdit.name);
      setPrice(itemToEdit.price.toString());
      setDescription(itemToEdit.description);
      setStock(itemToEdit.stock.toString());
      if (itemToEdit.image) {
        setImage({ uri: itemToEdit.image });
      }
    }
  }, [itemToEdit, isEditMode]);

  useEffect(() => {
    const fetchShopId = async () => {
      if (!params.shopId) {
        try {
          const shop = await getMyShop();
          setCurrentShopId(shop._id);
        } catch (err) {
          setError("Could not find your shop. Please create one first.");
        }
      }
    };
    fetchShopId();
  }, [params.shopId]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0]);
  };

  const handleSubmit = async () => {
    if (isEditMode) handleUpdate();
    else handleAdd();
  };

  const handleAdd = async () => {
    try {
      if (!currentShopId) {
        setError("Shop ID is missing. Cannot add item.");
        return;
      }
      const formData = { name, price, description, stock };
      if (image && image.uri) {
        const uriParts = image.uri.split(".");
        const fileExtension = uriParts[uriParts.length - 1];
        const fileName = `photo.${fileExtension || "jpg"}`;
        formData.image = {
          uri: image.uri,
          type: `image/${fileExtension || "jpeg"}`,
          name: fileName,
        };
      }
      const res = await addItem(currentShopId, formData);
      setMessage(res.message);
      setError("");
      setName(""); setPrice(""); setDescription(""); setStock(""); setImage(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add item.");
    }
  };

  const handleUpdate = async () => {
    try {
      const itemData = { name, price, description, stock };
      if (image && image.uri && image.uri !== itemToEdit.image) {
        const uriParts = image.uri.split(".");
        const fileExtension = uriParts[uriParts.length - 1];
        const fileName = `photo.${fileExtension || "jpg"}`;
        itemData.image = {
          uri: image.uri,
          type: `image/${fileExtension || "jpeg"}`,
          name: fileName,
        };
      }
      const res = await editItem(itemToEdit._id, itemData);
      setMessage(res.message);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update item.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Green Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <FontAwesome name="chevron-left" size={18} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditMode ? "Edit Item" : "Add New Item"}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Item Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. DK8031 Maize Seeds"
              placeholderTextColor={COLORS.textMuted}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Price (Ksh)</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor={COLORS.textMuted}
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
              <Text style={styles.label}>Stock</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor={COLORS.textMuted}
                value={stock}
                onChangeText={setStock}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Describe your item..."
              placeholderTextColor={COLORS.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.imageSection}>
            <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
              <FontAwesome name="camera" size={16} color={COLORS.primary} style={{ marginRight: 8 }} />
              <Text style={styles.imageButtonText}>
                {image ? "Change Image" : "Select Image"}
              </Text>
            </TouchableOpacity>
            {image && (
              <Image source={{ uri: image.uri }} style={styles.previewImage} />
            )}
          </View>

          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>
              {isEditMode ? "Update Item" : "Create Item"}
            </Text>
          </TouchableOpacity>

          {message ? (
            <View style={styles.messageBox}>
              <FontAwesome name="check-circle" size={16} color={COLORS.success} style={{ marginRight: 8 }} />
              <Text style={styles.successText}>{message}</Text>
            </View>
          ) : null}

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  // ---- Header ----
  header: {
    backgroundColor: COLORS.primaryDark,
    paddingTop: 50, paddingBottom: 18, paddingHorizontal: 20,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  backBtn: { width: 36, height: 36, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#FFF" },
  // ---- Form ----
  scrollContent: { padding: 20, paddingBottom: 100 },
  formCard: {
    backgroundColor: COLORS.card, borderRadius: 20,
    padding: 20, ...SHADOWS.medium,
  },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", color: COLORS.primary, marginBottom: 8, marginLeft: 4 },
  input: {
    borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: 12, padding: 14, fontSize: 16,
    backgroundColor: COLORS.surface, color: COLORS.text,
  },
  row: { flexDirection: "row" },
  textarea: { height: 100, paddingTop: 14 },
  imageSection: { alignItems: "center", marginVertical: 10 },
  imageButton: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 12, paddingHorizontal: 20,
    borderRadius: 12, marginBottom: 10,
  },
  imageButtonText: { color: COLORS.primary, fontWeight: "600" },
  previewImage: {
    width: "100%", height: 200, borderRadius: 12,
    backgroundColor: COLORS.background, resizeMode: "cover",
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16, borderRadius: 16,
    alignItems: "center", marginTop: 20,
    ...SHADOWS.medium,
  },
  submitButtonText: { color: "#FFF", fontWeight: "700", fontSize: 16 },
  messageBox: {
    marginTop: 16, padding: 12, flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.successLight, borderRadius: 10,
  },
  successText: { color: COLORS.success, fontWeight: "500" },
  errorBox: {
    marginTop: 16, padding: 12,
    backgroundColor: COLORS.dangerLight, borderRadius: 10,
  },
  errorText: { color: COLORS.danger, fontWeight: "500", textAlign: "center" },
});
