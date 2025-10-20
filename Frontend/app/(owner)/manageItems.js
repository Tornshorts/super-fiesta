import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { addItem, editItem, getMyShop } from "../../api"; // import getMyShop

// Component now accepts itemToEdit and shopId
export default function ManageItems() {
  const params = useLocalSearchParams();
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
        setImage({ uri: `http://192.168.100.5:5000${itemToEdit.image}` });
      }
    }
  }, [itemToEdit, isEditMode]);

  useEffect(() => {
    const fetchShopId = async () => {
      // If shopId is not passed via params (e.g., from 'Add Shop' screen),
      // fetch it using the dedicated endpoint.
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
    if (isEditMode) {
      handleUpdate();
    } else {
      handleAdd();
    }
  };

  const handleAdd = async () => {
    try {
      if (!currentShopId) {
        setError("Shop ID is missing. Cannot add item.");
        return;
      }

      const formData = {
        name,
        price,
        description,
        stock,
      };
      if (image && image.uri) {
        formData.image = {
          uri: image.uri,
          type: "image/jpeg", // or other appropriate mime type
          name: image.uri.split("/").pop(),
        };
      }

      const res = await addItem(currentShopId, formData);
      setMessage(res.message);
      setError("");
      // Reset form
      setName("");
      setPrice("");
      setDescription("");
      setStock("");
      setImage(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add item.");
    }
  };

  const handleUpdate = async () => {
    try {
      const itemData = {
        name,
        price,
        description,
        stock,
      };

      if (image && image.uri && image.uri !== itemToEdit.image) {
        itemData.image = {
          uri: image.uri,
          type: "image/jpeg",
          name: image.uri.split("/").pop(),
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
      <Text style={styles.title}>{isEditMode ? "Edit Item" : "Add Item"}</Text>
      <TextInput
        style={styles.input}
        placeholder="Item name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Stock Quantity"
        value={stock}
        onChangeText={setStock}
        keyboardType="numeric"
      />
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity onPress={pickImage} style={styles.button}>
        <Text style={styles.buttonText}>Select Image</Text>
      </TouchableOpacity>
      {image && (
        <Image
          source={{ uri: image.uri }}
          style={{ width: 100, height: 100, marginVertical: 10 }}
        />
      )}

      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>
          {isEditMode ? "Update Item" : "Add Item"}
        </Text>
      </TouchableOpacity>

      {message ? <Text style={styles.success}>{message}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  textarea: { height: 80 },
  button: {
    backgroundColor: "#6200ea",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  success: { color: "green", marginTop: 15 },
  error: { color: "red", marginTop: 15 },
});
