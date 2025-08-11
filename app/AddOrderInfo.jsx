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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

const AddOrderInfo = () => {
  const router = useRouter();

  const [skuDesign, setSkuDesign] = useState('');
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [productType, setProductType] = useState('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState('');
  const [imgRatio, setImgRatio] = useState(1);  

  const handleBack = () => router.back();
  const handleSave = () => {};
  const handleSaveAndContinue = () => {};

  const pickImage = async () => {
    // Ask for permission
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Bạn cần cấp quyền truy cập ảnh để tiếp tục.');
      return;
    }

    // Open image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
    //   aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
        const { uri, width, height } = result.assets[0];
        setImage(uri);
        setImgRatio(width / height);

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
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
                selectedValue={skuDesign}
                onValueChange={(val) => setSkuDesign(val)}
              >
                <Picker.Item label="Chọn SKU Design" value="" />
                <Picker.Item label="SKU001" value="sku001" />
                <Picker.Item label="SKU002" value="sku002" />
              </Picker>
            </View>

            {/* Kích thước */}
            <Text style={styles.subText}>Kích thước</Text>
            <View style={styles.pickerWrapper}>
              <Picker selectedValue={size} onValueChange={setSize}>
                <Picker.Item label="Chọn kích thước" value="" />
                <Picker.Item label="S" value="S" />
                <Picker.Item label="M" value="M" />
                <Picker.Item label="L" value="L" />
              </Picker>
            </View>

            {/* Số lượng */}
            <Text style={styles.subText}>Số lượng</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
            />

            {/* Note */}
            <Text style={styles.subText}>Thông tin đơn hàng (note)</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              value={note}
              onChangeText={setNote}
              multiline
            />

            {/* Loại hàng */}
            <Text style={styles.subText}>Loại hàng</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={productType}
                onValueChange={(val) => setProductType(val)}
              >
                <Picker.Item label="Chọn loại hàng" value="" />
                <Picker.Item label="Quần áo" value="clothing" />
                <Picker.Item label="Phụ kiện" value="accessory" />
              </Picker>
            </View>

            {/* Hình ảnh */}
            <Text style={styles.subText}>Hình ảnh</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={pickImage}            // ← Add onPress here
            >
              <Text style={{ color: '#555' }}>
                {image ? 'Ảnh đã chọn' : 'Chọn hoặc tải ảnh lên'}
              </Text>
            </TouchableOpacity>

            {/* Conditionally render the picked image */}
            {image && (
              <View style={{ marginVertical: 8, width:'100%', aspectRatio: imgRatio }}>
                <Image
                  source={{ uri: image }}
                  style={{ flex:1, borderRadius: 8 }}
                  resizeMode="cover"
                />
              </View>
            )}

            {/* Trạng thái */}
            <Text style={styles.subText}>Trạng thái</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={status}
                onValueChange={(val) => setStatus(val)}
              >
                <Picker.Item label="Chọn trạng thái" value="" />
                <Picker.Item label="Đang xử lý" value="processing" />
                <Picker.Item label="Hoàn thành" value="completed" />
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

// ... your existing styles unchanged ...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  contentWrapper: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingBottom: 60,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subText: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dd6b4d',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 8,
    fontSize: 13,
    backgroundColor: '#fff',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#dd6b4d',
    borderRadius: 8,
    marginVertical: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: '#dd6b4d',
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 16,
    bottom: 50,
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderColor: '#dd6b4d',
    borderWidth: 2,
    paddingVertical: 12,
    width: '48%',
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#dd6b4d',
    paddingVertical: 12,
    width: '48%',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    color: '#dd6b4d',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveContinueButton: {
    backgroundColor: '#dd6b4d',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveContinueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});