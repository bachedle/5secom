import {
  Modal,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Picker } from "@react-native-picker/picker";
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { useOrder } from "../utils/orderContext";
import { useAuth } from "../utils/authContext";
import { useEffect, useState } from 'react';

const API_URL = "https://5secom.dientoan.vn/api";

const ModalAccepted = ({ visible, onClose, orderItem }) => {
  const { draftOrder, updateDraftPath, clearDraft, editOrder } = useOrder();
  const [orderType, setOrderType] = useState([]);
  const [showFullImage, setShowFullImage] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const { user } = useAuth();

  const handleReturnOrder = async () => {
    if (!orderItem || !user) return;

    if (!draftOrder.facilityType?.id) {
      Alert.alert("Lỗi", "Vui lòng chọn trạng thái trước khi trả đơn");
      return;
    }

    if (orderItem.issuePlace !== user.name && orderItem.issuePlace !== user.username) {
      Alert.alert("Lỗi", "Bạn không có quyền trả đơn này");
      return;
    }

    setIsReturning(true);
    try {
      const updates = {
        id: orderItem.id,
        version: orderItem.version,
        issuePlace: "unassigned",
        facilityType: { id: draftOrder.facilityType.id }
      };

      await editOrder(orderItem.id, updates);

      if (clearDraft) clearDraft();
      
      Alert.alert("Thành công!", "Trả đơn thành công!");
      
      onClose();
    } catch (error) {
      console.log("ORDER RETURN FAILED:", error);
      Alert.alert("Lỗi", "Không thể trả đơn. Vui lòng thử lại.");
    } finally {
      setIsReturning(false);
    }
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        };

        const orderTypeRes = await axios.get(
          `${API_URL}/option/find?optionGroupCode=facility-type`,
          { headers }
        );
        setOrderType(orderTypeRes.data.content);
      } catch (error) {
        console.error("Error fetching order types:", error);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    if (!visible && clearDraft) {
      clearDraft();
    }
  }, [visible]);

  const isReturnButtonEnabled = draftOrder.facilityType?.id && !isReturning;

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Tap outside to close */}
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

          {/* Modal content (tap inside won't close) */}
          <Pressable style={styles.modalBox} onPress={(e) => e.stopPropagation()}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Trả đơn</Text>
              <Pressable onPress={onClose} hitSlop={8}>
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>

            {/* Product Name */}
            <Text style={styles.label}>
              Sản Phẩm: <Text style={styles.bold}>{orderItem?.labelingStandard || "--"}</Text>
            </Text>

            {/* Current Facility Info */}
            <Text style={styles.label}>
              Hiện tại: <Text style={styles.bold}>{orderItem?.facilityType?.name || "---"}</Text>
            </Text>

            {/* Image Placeholder */}
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
                <Text style={{ color: "#666", textAlign: "center", marginTop: 40 }}>
                  Chưa có hình
                </Text>
              )}
            </View>

            {/* File Link with Icon */}
            <View style={styles.linkRow}>
              <Text style={styles.linkText}>
                https://sdfdsf.fsfsd..ffs/sfsdfds
              </Text>
              <Feather name="download" size={16} color="black" />
            </View>

            {/* Facility Type Picker */}
            <Text style={styles.subText}>Trạng thái tiếp theo <Text style={styles.required}>*</Text></Text>
            <View style={[
              styles.pickerWrapper,
              !draftOrder.facilityType?.id && styles.pickerWrapperError
            ]}>
              <Picker
                selectedValue={draftOrder.facilityType?.id || ""}
                onValueChange={(value) =>
                  updateDraftPath("facilityType", { id: value })
                }
              >
                <Picker.Item label="Chọn trạng thái" value="" />
                {orderType.map((ot) => (
                  <Picker.Item key={ot.id} label={ot.name} value={ot.id} />
                ))}
              </Picker>
            </View>
            {!draftOrder.facilityType?.id && (
              <Text style={styles.errorText}>Vui lòng chọn trạng thái tiếp theo</Text>
            )}

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
                style={[
                  styles.filledButton,
                  !isReturnButtonEnabled && styles.disabledButton
                ]}
                onPress={handleReturnOrder}
                disabled={!isReturnButtonEnabled}
              >
                <Text style={[
                  styles.filledText,
                  !isReturnButtonEnabled && styles.disabledText
                ]}>
                  {isReturning ? "Đang trả đơn..." : "Trả Đơn"}
                </Text>
              </Pressable>
            </View>
          </Pressable>
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

export default ModalAccepted;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalBox: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
  imagePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: '#ccc',
    borderRadius: 6,
    marginBottom: 10,
    overflow: 'hidden',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  linkText: {
    fontSize: 13,
    color: '#333',
    flexShrink: 1,
    flexWrap: 'wrap',
    marginRight: 8,
  },
  subText: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 4,
    fontWeight: '600',
  },
  required: {
    color: '#f44336',
  },
  inputBox: {
    borderWidth: 1.5,
    borderColor: '#f18060',
    borderRadius: 8,
    minHeight: 80,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonSpacing: {
    marginRight: 12,
  },
  outlinedButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#f18060',
    paddingVertical: 10,
    borderRadius: 8,
  },
  outlinedText: {
    textAlign: 'center',
    color: '#f18060',
    fontWeight: '600',
  },
  filledButton: {
    flex: 1,
    backgroundColor: '#f18060',
    paddingVertical: 10,
    borderRadius: 8,
  },
  filledText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  disabledText: {
    color: '#666',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#dd6b4d",
    borderRadius: 8,
    marginVertical: 8,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  pickerWrapperError: {
    borderColor: '#f44336',
  },
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginTop: -4,
    marginBottom: 8,
  },
  fullImageOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
});
