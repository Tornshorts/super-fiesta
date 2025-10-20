import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { addOrUpdateShop as addShop } from "../../api";

const AddShop = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Shop name is required.");
      return;
    }

    try {
      const data = { name, description };
      // The actual data from the server is in `response.data`
      const response = await addShop(data);
      const { message, shopId } = response.data;
      setMessage(message || "Shop added successfully!");
      console.log("Newly created/updated Shop ID:", shopId); // You can access shopId here!
      setName("");
      setDescription("");

      // Navigate to the item management screen with the new shopId
      router.push({ pathname: "/(owner)/manageItems", params: { shopId } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add shop.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Your Shop</Text>

      <Text style={styles.label}>Shop Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter shop name"
      />

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter shop description"
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Add Shop</Text>
      </TouchableOpacity>

      {message ? <Text style={styles.success}>{message}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

export default AddShop;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  textarea: {
    height: 80,
  },
  button: {
    backgroundColor: "#6200ea",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  success: {
    color: "green",
    marginTop: 15,
  },
  error: {
    color: "red",
    marginTop: 15,
  },
});
