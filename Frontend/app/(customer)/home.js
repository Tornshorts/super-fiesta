import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  StatusBar,
  Dimensions,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { getAllItems } from "../../api";
import { useCart } from "../../CartContext";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS, SHADOWS } from "../../constants/theme";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 52) / 2; // 20 padding each side + 12 gap

const CustomerHome = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart } = useCart();

  const fetchItems = async () => {
    try {
      setLoading(true);
      const fetchedItems = await getAllItems();
      setItems(fetchedItems);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch items.");
    } finally {
      setLoading(false);
    }
  };

  const openOrderModal = (item) => {
    setSelectedItem(item);
    setQuantity(1);
    setModalVisible(true);
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;
    addToCart(selectedItem, quantity);
    setModalVisible(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchItems();
    }, [])
  );

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const renderProductCard = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => openOrderModal(item)}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        {item.stock > 0 && (
          <View style={styles.stockBadge}>
            <Text style={styles.stockBadgeText}>In Stock</Text>
          </View>
        )}
        {item.stock === 0 && (
          <View style={[styles.stockBadge, { backgroundColor: COLORS.danger }]}>
            <Text style={styles.stockBadgeText}>Sold Out</Text>
          </View>
        )}
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.shopName} numberOfLines={1}>
          {item.shop?.name || "Shop"}
        </Text>

        <View style={styles.cardFooter}>
          <Text style={styles.productPrice}>Ksh {item.price}</Text>
          <TouchableOpacity
            style={[styles.addBtn, item.stock === 0 && styles.addBtnDisabled]}
            onPress={() => openOrderModal(item)}
            disabled={item.stock === 0}
          >
            <FontAwesome name="plus" size={14} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Green Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={styles.userName}>Marketplace</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <FontAwesome name="search" size={16} color={COLORS.textMuted} style={{ marginRight: 10 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search seeds, feeds, fertilizer..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Products Count */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>All Products</Text>
        <Text style={styles.sectionCount}>({filteredItems.length})</Text>
      </View>

      {/* Product Grid */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item._id}
        renderItem={renderProductCard}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome name="leaf" size={40} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No items available right now.</Text>
          </View>
        }
      />

      {/* Order Modal */}
      {selectedItem && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <Image source={{ uri: selectedItem.image }} style={styles.modalImage} />
              <Text style={styles.modalTitle}>{selectedItem.name}</Text>
              <Text style={styles.modalPrice}>Ksh {selectedItem.price}</Text>
              <Text style={styles.modalStock}>Available: {selectedItem.stock}</Text>

              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setQuantity(Math.min(selectedItem.stock, quantity + 1))}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.addToCartButton}
                  onPress={handleAddToCart}
                >
                  <Text style={styles.addToCartButtonText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background },
  // ---- Header ----
  header: {
    backgroundColor: COLORS.primaryDark,
    paddingTop: 50, paddingBottom: 16, paddingHorizontal: 20,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 16,
  },
  greeting: { fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: "500" },
  userName: { fontSize: 22, fontWeight: "800", color: "#FFF", marginTop: 2 },
  searchBar: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.card, borderRadius: 14,
    paddingHorizontal: 16, height: 48,
  },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.text },
  // ---- Section ----
  sectionHeader: {
    flexDirection: "row", alignItems: "baseline",
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10,
  },
  sectionTitle: { fontSize: 19, fontWeight: "800", color: COLORS.text },
  sectionCount: { fontSize: 15, color: COLORS.textMuted, fontWeight: "600", marginLeft: 6 },
  // ---- Grid ----
  gridContent: { paddingHorizontal: 20, paddingBottom: 100 },
  gridRow: { justifyContent: "space-between", marginBottom: 12 },
  productCard: {
    width: CARD_WIDTH, backgroundColor: COLORS.card,
    borderRadius: 16, overflow: "hidden", ...SHADOWS.small,
  },
  imageContainer: { position: "relative" },
  productImage: {
    width: "100%", height: CARD_WIDTH * 0.85,
    backgroundColor: COLORS.background,
  },
  stockBadge: {
    position: "absolute", top: 8, right: 8,
    backgroundColor: COLORS.primary, paddingHorizontal: 8,
    paddingVertical: 3, borderRadius: 6,
  },
  stockBadgeText: { color: "#FFF", fontSize: 10, fontWeight: "700" },
  cardBody: { padding: 12 },
  productName: { fontSize: 14, fontWeight: "700", color: COLORS.text, marginBottom: 4, lineHeight: 18 },
  shopName: { fontSize: 12, color: COLORS.textMuted, marginBottom: 8 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  productPrice: { fontSize: 15, fontWeight: "800", color: COLORS.primary },
  addBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: "center", alignItems: "center",
  },
  addBtnDisabled: { backgroundColor: COLORS.textMuted },
  // ---- Empty ----
  emptyContainer: { alignItems: "center", marginTop: 60 },
  emptyText: { marginTop: 12, fontSize: 16, color: COLORS.textMuted },
  errorText: { color: COLORS.danger, fontSize: 16, fontWeight: "600" },
  // ---- Modal ----
  modalOverlay: {
    flex: 1, justifyContent: "center", alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalView: {
    width: "85%", backgroundColor: COLORS.card,
    borderRadius: 24, padding: 24, alignItems: "center",
    ...SHADOWS.large,
  },
  modalImage: {
    width: 120, height: 120, borderRadius: 16,
    marginBottom: 16, backgroundColor: COLORS.background,
  },
  modalTitle: { fontSize: 22, fontWeight: "800", color: COLORS.text, marginBottom: 8, textAlign: "center" },
  modalPrice: { fontSize: 20, color: COLORS.primary, fontWeight: "700", marginBottom: 8 },
  modalStock: { fontSize: 14, color: COLORS.textMuted, marginBottom: 24, fontWeight: "500" },
  quantityContainer: {
    flexDirection: "row", alignItems: "center",
    marginBottom: 32, backgroundColor: COLORS.background,
    borderRadius: 30, padding: 4,
  },
  quantityButton: {
    backgroundColor: COLORS.card, width: 40, height: 40,
    justifyContent: "center", alignItems: "center", borderRadius: 20,
    ...SHADOWS.small,
  },
  quantityButtonText: { fontSize: 20, fontWeight: "600", color: COLORS.text },
  quantityText: {
    fontSize: 18, fontWeight: "700", marginHorizontal: 20,
    color: COLORS.text, minWidth: 20, textAlign: "center",
  },
  modalActions: { flexDirection: "row", width: "100%", justifyContent: "space-between", gap: 12 },
  cancelButton: {
    flex: 1, paddingVertical: 14, borderRadius: 16,
    borderWidth: 1.5, borderColor: COLORS.border, alignItems: "center",
  },
  cancelButtonText: { color: COLORS.textSecondary, fontSize: 16, fontWeight: "600" },
  addToCartButton: {
    flex: 2, backgroundColor: COLORS.primary,
    borderRadius: 16, paddingVertical: 14, alignItems: "center",
    ...SHADOWS.medium,
  },
  addToCartButtonText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});

export default CustomerHome;
