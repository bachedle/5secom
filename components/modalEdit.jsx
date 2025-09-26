import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from 'expo-router';
import { useOrder } from "../utils/orderContext";

const ModalEditAction = ({ visible, onClose, orderItem }) => {
  const router = useRouter();
  const { editOrder } = useOrder();
  const [showFullImage, setShowFullImage] = useState(false);
  const [loading, setLoading] = useState(false);
  

  const handleEdit = async () => {
    if (!orderItem?.id) {
      Alert.alert("Lỗi", "Không tìm thấy ID đơn hàng");
      return;
    }

    try {
      setLoading(true);
      onClose(); // Close modal first
      
      // Load order data into edit mode
      await editOrder(orderItem.id);
      
      // Navigate to edit flow
      router.push('/EditStoreInfo');
    } catch (error) {
      console.error("Error starting edit:", error);
      Alert.alert("Lỗi", "Không thể tải thông tin đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  return (
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
              <Text style={styles.title}>Chọn hành động</Text>
              <Pressable onPress={onClose} hitSlop={8}>
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>

            {/* Order Info - Full Details (Standardized) */}
            <View style={styles.orderInfo}>
              <Text style={styles.orderCode}>
                Đơn hàng: {orderItem?.idNumber || '---'}
              </Text>
              <Text style={styles.orderDetail}>
                Sản phẩm: {orderItem?.labelingStandard || '---'}
              </Text>
              <Text style={styles.orderDetail}>
                SKU: {orderItem?.skuOpt?.code || orderItem?.code || 'N/A'}
              </Text>
              <Text style={styles.orderDetail}>
                Kích thước: {orderItem?.stateOpt?.name || '---'}
              </Text>
              <Text style={styles.orderDetail}>
                Số lượng: {orderItem?.area || '---'}
              </Text>
              <Text style={styles.orderDetail}>
                Khách hàng: {orderItem?.name || '---'}
              </Text>
              <Text style={styles.orderDetail}>
                SĐT: {orderItem?.phone || '---'}
              </Text>
              <Text style={styles.orderDetail}>
                Địa chỉ: {orderItem?.address || '---'}
              </Text>
              <Text style={styles.orderDetail}>
                Loại cửa hàng: {orderItem?.facilityType?.name || '---'}
              </Text>
              <Text style={styles.orderDetail}>
                Cửa hàng: {orderItem?.orgUnit?.name || '---'}
              </Text>
              {orderItem?.note && (
                <Text style={styles.orderDetail}>
                  Ghi chú: {orderItem.note}
                </Text>
              )}
              <Text style={styles.orderDetail}>
                Ngày tạo: {orderItem?.createdDate ? new Date(orderItem.createdDate).toLocaleDateString("vi-VN") : '---'}
              </Text>
            </View>

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
            
            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              <Pressable
                style={[styles.outlinedButton, styles.buttonSpacing]}
                onPress={onClose}
              >
                <Text style={styles.outlinedText}>Quay lại</Text>
              </Pressable>
              
              <Pressable
                style={[styles.filledButton, loading && styles.disabledButton]}
                onPress={handleEdit}
                disabled={loading}
              >
                <Text style={[styles.filledText, loading && styles.disabledText]}>
                  {loading ? "Đang tải..." : "Chỉnh sửa đơn"}
                </Text>
              </Pressable>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      
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
    </Modal>
    
  );
};

export default ModalEditAction;

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
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    marginBottom: 16 
  },
  title: { 
    fontSize: 18, 
    fontWeight: "bold"
  },
  closeText: { 
    fontSize: 18, 
    fontWeight: "bold"
  },
  orderInfo: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  orderCode: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  orderDetail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  buttonSpacing: {
    marginRight: 12,
  },
  filledButton: {
    flex: 1,
    backgroundColor: "#1F509A",
    paddingVertical: 10,
    borderRadius: 8,
  },
  filledText: {
    textAlign: "center",
    color: "white",
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  disabledText: {
    color: "#666",
  },
  outlinedButton: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#1F509A",
    paddingVertical: 10,
    borderRadius: 8,
  },
  outlinedText: {
    textAlign: "center",
    color: "#1F509A",
    fontWeight: "600",
  },
  imagePlaceholder: {
    width: "100%",
    height: 120,
    backgroundColor: "#ccc",
    borderRadius: 6,
    marginBottom: 10,
    overflow: "hidden",
  },
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