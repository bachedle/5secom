import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Image,
  SafeAreaView,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";

import { useOrder } from "../../utils/orderContext";
import { uploadFile, localUriToBase64 } from "../../api/file";

const API_URL = "https://5secom.dientoan.vn/api";

const AddOrderInfo = () => {
  const { draftOrder, updateDraftPath, submitDraft } = useOrder();
  const router = useRouter();

  const [skuOptions, setSkuOptions] = useState([]);
  const [allSizes, setAllSizes] = useState([]);
  const [filteredSizes, setFilteredSizes] = useState([]);
  const [orderType, setOrderType] = useState([]);
  const [labeling, setLabeling] = useState([]);
  const [image, setImage] = useState("");
  const [imgRatio, setImgRatio] = useState(1);

  const handleBack = () => router.back();

  // Save and exit
  const handleSave = async () => {
    try {
      await submitDraft();
      Alert.alert("Thành công", "Đơn hàng đã được tạo!");
      router.replace("/ProductList");
    } catch (e) {
      console.error(e);
      Alert.alert("Lỗi", "Không thể tạo đơn hàng");
    }
  };

  // Save and continue
  const handleSaveAndContinue = async () => {
    const keep = {
      facilityType: draftOrder.facilityType,
      stateOpt: draftOrder.stateOpt,
      orgUnit: draftOrder.orgUnit,
    };
    try {
      await submitDraft();
      for (const key in keep) {
        updateDraftPath(key, keep[key]);
      }
      Alert.alert("Thành công", "Đã lưu và tiếp tục tạo đơn mới");
    } catch (e) {
      console.error(e);
      Alert.alert("Lỗi", "Không thể tạo đơn hàng");
    }
  };

  // Fetch dropdown options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        };

        const sizeRes = await axios.get(
          `${API_URL}/option/find?optionGroupCode=state-test`,
          { headers }
        );
        setAllSizes(sizeRes.data.content);
        setFilteredSizes(sizeRes.data.content);

        const orderTypeRes = await axios.get(
          `${API_URL}/option/find?optionGroupCode=facility-type`,
          { headers }
        );
        setOrderType(orderTypeRes.data.content);

        const skuRes = await axios.get(
          `${API_URL}/option/find?optionGroupCode=skudesigns`,
          { headers }
        );
        setSkuOptions(skuRes.data.content);

        const labelingStandardRes = await axios.get(
          `${API_URL}/option/find?optionGroupCode=type-of-goods`,
          { headers }
        );
        setLabeling(labelingStandardRes.data.content);
      } catch (error) {
        console.error(
          "Error fetching options:",
          error.response?.data || error.message
        );
      }
    };
    fetchOptions();
  }, []);

  const handleSkuChange = (val) => {
    updateDraftPath("skuOpt", { id: val });
    const relevantSizes = allSizes.filter((s) => s.skuOpt?.id === val);
    setFilteredSizes(relevantSizes);
    updateDraftPath("stateOpt", { id: "" }); // reset size if sku changed
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Quyền bị từ chối", "Bạn cần cấp quyền để chọn ảnh.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled) return;
    const asset = result.assets[0];

    try {
      console.log("Image selected:", asset.uri);
      console.log("File size:", asset.fileSize);
      console.log("MIME type:", asset.mimeType);

      const file = {
        uri: asset.uri,
        name: asset.fileName || "upload.jpg",
        type: asset.mimeType || "image/jpeg",
      };

      console.log("Starting upload...");
      const data = await uploadFile(file);
      console.log("Upload completed:", data);

      const fileId = data?.id || data?.fileId || data?.uuid;
      const fileUrl = data?.url || data?.fileUrl || data;
      const serverBase64 = data?.base64;

      if (!fileId && !fileUrl) {
        Alert.alert("Lỗi", "Tải ảnh thất bại. Vui lòng thử lại.");
        return;
      }

      updateDraftPath("sampleSource", fileId || fileUrl);

      // Priority: server base64 > convert URL to base64 > local URI
      if (serverBase64) {
        setImage(serverBase64);
        console.log("Using server base64");
      } else if (fileUrl && typeof fileUrl === "string") {
        console.log("Converting uploaded image URL to base64...");
        try {
          const imageBase64 = await localUriToBase64(fileUrl, file.type);
          setImage(imageBase64);
          console.log("Successfully converted URL to base64");
        } catch (base64Error) {
          console.error("Failed to convert URL to base64:", base64Error);
          setImage(asset.uri); // Fallback to local URI
        }
      } else {
        setImage(asset.uri);
        console.log("Using local URI");
      }
    } catch (err) {
      console.error("Upload error:", err?.response?.data || err.message);
      Alert.alert("Lỗi", "Không thể tải ảnh.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Tạo Đơn</Text>
      </View>

      {/* CONTENT */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.contentWrapper}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Thông tin Đơn Hàng</Text>

            {/* SKU Design */}
            <Text style={styles.subText}>SKU Design</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={draftOrder.skuOpt?.id || ""}
                onValueChange={handleSkuChange}
              >
                <Picker.Item label="Chọn SKU Design" value="" />
                {skuOptions.map((opt) => (
                  <Picker.Item key={opt.id} label={opt.name} value={opt.id} />
                ))}
              </Picker>
            </View>

            {/* Kích thước */}
            <Text style={styles.subText}>Kích thước</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={draftOrder.stateOpt?.id || ""}
                onValueChange={(value) =>
                  updateDraftPath("stateOpt", { id: value })
                }
              >
                <Picker.Item label="Chọn kích thước" value="" />
                {filteredSizes.map((s) => (
                  <Picker.Item key={s.id} label={s.name} value={s.id} />
                ))}
              </Picker>
            </View>

            {/* Số lượng */}
            <Text style={styles.subText}>Số lượng</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={draftOrder.area ? String(draftOrder.area) : ""}
              onChangeText={(text) => updateDraftPath("area", text)}
            />

            {/* Note */}
            <Text style={styles.subText}>Thông tin đơn hàng (note)</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              value={draftOrder.note || ""}
              onChangeText={(text) => updateDraftPath("note", text)}
              multiline
            />

            {/* Loại hàng */}
            <Text style={styles.subText}>Loại hàng</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={draftOrder.labelingStandard || ""}
                onValueChange={(value) =>
                  updateDraftPath("labelingStandard", value)
                }
              >
                <Picker.Item label="Chọn loại hàng" value="" />
                {labeling.map((l) => (
                  <Picker.Item key={l.id} label={l.name} value={l.name} />
                ))}
              </Picker>
            </View>

            {/* Hình ảnh */}
            <Text style={styles.subText}>Hình ảnh</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={pickImage}
            >
              <Text style={{ color: "#555" }}>
                {image ? "Ảnh đã chọn" : "Chọn hoặc tải ảnh lên"}
              </Text>
            </TouchableOpacity>

            {image && (
              <View
                style={{ marginVertical: 8, width: "100%", aspectRatio: imgRatio }}
              >
                <Image
                  source={{ uri: image }}
                  style={{ flex: 1, borderRadius: 8 }}
                  resizeMode="cover"
                />
              </View>
            )}

            {/* Trạng thái */}
            <Text style={styles.subText}>Trạng thái</Text>
            <View style={styles.pickerWrapper}>
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
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      {/* FOOTER */}
      <View style={styles.footer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleBack}>
            <Text style={styles.cancelText}>Quay Lại</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>Lưu</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.saveContinueButton}
          onPress={handleSaveAndContinue}
        >
          <Text style={styles.saveContinueText}>Lưu và Tiếp Tục</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddOrderInfo;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  header: {
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerText: { fontSize: 22, fontWeight: "bold" },
  contentWrapper: {
    backgroundColor: "white",
    borderRadius: 8,
    margin: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  subText: { fontSize: 13, fontWeight: "bold", marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#dd6b4d",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 8,
    fontSize: 13,
    backgroundColor: "#fff",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#dd6b4d",
    borderRadius: 8,
    marginVertical: 8,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: "#dd6b4d",
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    padding: 16,
    bottom: 50,
    backgroundColor: "#fff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderColor: "#dd6b4d",
    borderWidth: 2,
    paddingVertical: 12,
    width: "48%",
    borderRadius: 8,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#dd6b4d",
    paddingVertical: 12,
    width: "48%",
    borderRadius: 8,
    alignItems: "center",
  },
  cancelText: { color: "#dd6b4d", fontSize: 16, fontWeight: "bold" },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  saveContinueButton: {
    backgroundColor: "#dd6b4d",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveContinueText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
