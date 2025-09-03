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
import React, { useState, useEffect} from 'react';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

import { useOrder } from '../../utils/orderContext';
import { id } from 'date-fns/locale';

const API_URL = "https://5secom.dientoan.vn/api";


const AddOrderInfo = () => {

  const { draftOrder, updateDraftPath, submitDraft } = useOrder();


  const router = useRouter();

  const [skuOptions, setSkuOptions] = useState([]);
  const [size, setSize] = useState([]);
  const [orderType, setOrderType] = useState([]);

  const [productType, setProductType] = useState('');
  const [image, setImage] = useState('');
  const [imgRatio, setImgRatio] = useState(1);  



  const handleBack = () => router.back();

  //save and exit
const handleSave = async () => {
  try {
    await submitDraft();
    Alert.alert('Thành công', 'Đơn hàng đã được tạo!');
    router.replace('/OrderList'); // or wherever your list is
  } catch (e) {
    console.error(e);
    Alert.alert('Lỗi', 'Không thể tạo đơn hàng');
  }
};
  //save and can still add more order
const handleSaveAndContinue = async () => {
  // keep some selections for next entry (example)
  const keep = {
    facilityType: draftOrder.facilityType,
    stateOpt: draftOrder.stateOpt,
    orgUnit: draftOrder.orgUnit,
  };
  try {
    await submitDraft();
    updateDraft(keep); // re-apply a few fields after reset
    Alert.alert('Thành công', 'Đã lưu và tiếp tục tạo đơn mới');
  } catch (e) {
    console.error(e);
    Alert.alert('Lỗi', 'Không thể tạo đơn hàng');
  }
};
  useEffect(() => {
    const fetchSizeOptions = async () => {
      try {
        const sizeRes = await axios.get(`${API_URL}/option-group/find?code=state-test`)
        setSize(sizeRes.data.content);

        const orderTypeRes = await axios.get(`${API_URL}/option-group/find?code=facility-type`)
        setOrderType(orderTypeRes.data.content);

        const skuRes = await axios.get(`${API_URL}/option-group/find?code=skudesigns`);
        setSkuOptions(skuRes.data.content);

        
      } catch (error) {
        console.error("Error fetching size options:", error);
    }
  }
  fetchSizeOptions();
}, []);

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
                selectedValue={draftOrder.skuOpt?.id || ""}
                onValueChange={(val) => updateDraftPath("skuOpt", { id: val })}
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
                selectedValue={draftOrder.stateOpt?id : ""} 
                onValueChange={(value) => updateDraftPath("stateOpt", { id: value })}
              >
                <Picker.Item label="Chọn kích thước" value="" />
                {
                  size.map((s) => (
                    <Picker.Item key={s.id} label={s.name} value={s.id} />
                  ))
                }
              </Picker>
            </View>

            {/* Số lượng */}
            <Text style={styles.subText}>Số lượng</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={draftOrder.area ? String(draftOrder.area) : ''}
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
              selectedValue={draftOrder.facilityType?.id || ""}
              onValueChange={(value) => updateDraftPath("facilityType", { id: value })}
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
    margin: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingBottom: 100
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