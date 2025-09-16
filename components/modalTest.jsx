import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  View,
  Text,
  Pressable,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Image,
  Platform,
  TouchableOpacity,
} from "react-native";

import { useOrder } from "../utils/orderContext";
import { useAuth } from "../utils/authContext";

const ModalTest = ({ visible, onClose, orderItem }) => {
  const [showFullImage, setShowFullImage] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const { editOrder } = useOrder();
  const { user } = useAuth();

  const handleAcceptOrder = async () => {
    if (!orderItem || !user) return;

    const isAlreadyAssigned =
      orderItem.issuePlace && orderItem.issuePlace !== "unassigned";
    if (isAlreadyAssigned) {
      Alert.alert("Đơn hàng đã được nhận");
      return;
    }

    setIsAccepting(true);
    try {
      const updates = {
        id: orderItem.id,
        version: orderItem.version,
        issuePlace: user.name,
      };

      await editOrder(orderItem.id, updates);
      Alert.alert("Nhận đơn thành công!");

      // Close modal after successful update
      onClose();
    } catch (error) {
      console.log("ASSIGNMENT FAILED:");
      console.log("Error:", error);
      Alert.alert("Lỗi", "Không thể nhận đơn");
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <>
      {/* Main Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* Outer touchable to close on outside press */}
          <TouchableOpacity
            style={{ flex: 1, width: "100%", justifyContent: "center", alignItems: "center" }}
            activeOpacity={1}
            onPress={onClose}
          >
            {/* Inner modal box - stop propagation so inside taps don't close */}
            <TouchableOpacity
              activeOpacity={1}
              style={styles.modalBox}
              onPress={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Nhận đơn</Text>
                <Pressable onPress={onClose} hitSlop={8}>
                  <Text style={styles.closeText}>✕</Text>
                </Pressable>
              </View>

              {/* Product Name */}
              <Text style={styles.label}>
                Sản Phẩm:{" "}
                <Text style={styles.bold}>
                  {orderItem?.labelingStandard || "--"}
                </Text>
              </Text>

              {/* Thumbnail */}
              <Text style={styles.label}>Hình Ảnh:</Text>
              <View style={styles.imagePlaceholder}>
                {orderItem?.sampleSource ? (
                  <TouchableOpacity onPress={() => setShowFullImage(true)}>
                    <Image
                      source={{ uri: orderItem.sampleSource }}
                      style={{ width: "100%", height: "100%", borderRadius: 6 }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ) : (
                  <Text
                    style={{ color: "#666", textAlign: "center", marginTop: 40 }}
                  >
                    Chưa có hình
                  </Text>
                )}
              </View>

              {/* Text Input */}
              <Text style={styles.label}>Thông Tin Yêu Cầu:</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="Nhập yêu cầu..."
                multiline
                textAlignVertical="top"
                returnKeyType="done"
              />

              {/* Action Buttons */}
              <View style={styles.buttonRow}>
                <Pressable
                  style={[styles.outlinedButton, styles.buttonSpacing]}
                  onPress={onClose}
                >
                  <Text style={styles.outlinedText}>Quay Lại</Text>
                </Pressable>
                <Pressable
                  style={styles.filledButton}
                  onPress={handleAcceptOrder}
                  disabled={isAccepting}
                >
                  <Text style={styles.filledText}>
                    {isAccepting ? "Đang xử lý..." : "Nhận Đơn"}
                  </Text>
                </Pressable>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>

      {/* Full Image Modal */}
      <Modal visible={showFullImage} transparent animationType="fade">
        <TouchableOpacity
          style={styles.fullImageOverlay}
          onPress={() => setShowFullImage(false)}
        >
          <Image
            source={{ uri: orderItem?.sampleSource }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default ModalTest;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalBox: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
  },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  title: { fontSize: 18, fontWeight: "bold" },
  closeText: { fontSize: 18, fontWeight: "bold" },
  label: { fontSize: 14, marginTop: 10, marginBottom: 4 },
  bold: { fontWeight: "bold" },
  imagePlaceholder: {
    width: "100%",
    height: 120,
    backgroundColor: "#ccc",
    borderRadius: 6,
    marginBottom: 10,
    overflow: "hidden",
  },
  inputBox: {
    borderWidth: 1.5,
    borderColor: "#f18060",
    borderRadius: 8,
    minHeight: 80,
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  buttonRow: { flexDirection: "row", justifyContent: "space-between" },
  buttonSpacing: { marginRight: 12 },
  outlinedButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#f18060",
    paddingVertical: 10,
    borderRadius: 8,
  },
  outlinedText: { textAlign: "center", color: "#f18060", fontWeight: "600" },
  filledButton: { flex: 1, backgroundColor: "#f18060", paddingVertical: 10, borderRadius: 8 },
  filledText: { textAlign: "center", color: "white", fontWeight: "600" },

  // Full image
  fullImageOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "100%",
    height: "100%",
  },
});
