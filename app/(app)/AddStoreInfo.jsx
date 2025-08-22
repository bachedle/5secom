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
  SafeAreaView,
  TouchableWithoutFeedback,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

import { useOrder } from '../../utils/orderContext';

const API_URL = "https://5secom.dientoan.vn/api";


const AddStoreInfo = () => {

  const { draftOrder, updateDraftPath } = useOrder();  

  const router = useRouter();

  const [storeType, setStoreType] = useState([]);
  const [country, setCountry] = useState([]);
  const [store, setStore] = useState([]);

  const selectedStoreType = draftOrder.storeType || "";
  const selectedCountry = draftOrder.country || "";
  const selectedStore = draftOrder.store || "";

  const sku = draftOrder.sku || "";
  const orderId = draftOrder.orderId || "";
  const isPriority = draftOrder.isPriority || false;



  const handleBack = () => router.back();
  const handleNext = () => router.push('/AddGuestInfo');


  //option picker (co the mang qua context)
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const storeTypeRes = await axios.get(`${API_URL}/org-unit/search?lvl=1`);
        setStoreType(storeTypeRes.data.content);

        const countryRes = await axios.get(`${API_URL}/org-unit/search?lvl=2`)
        setCountry(countryRes.data.content);

        const storeRes = await axios.get(`${API_URL}/org-unit/search?lvl=3`)
        setStore(storeRes.data.content);

      } catch (error) {
        console.error("Error fetching options:", error);
      }
    }

    fetchOptions();
  }, []);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Tạo Đơn</Text>
      </View>

      {/* FORM AREA */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={
            Platform.OS === 'ios' ? HEADER_HEIGHT + FOOTER_HEIGHT : 0
          }
        >
          <ScrollView
            contentContainerStyle={styles.contentWrapper}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Cửa Hàng</Text>

            <Text style={styles.subText}>Loại cửa hàng</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedStoreType}
                onValueChange={(value) => updateDraftPath("storeType", value)}
              >
                <Picker.Item label="Chọn loại cửa hàng" value="" />
                {storeType.map((type) => (
                  <Picker.Item key={type.id} label={type.name} value={type.id} />
                ))}
              </Picker>
            </View>

            <Text style={styles.subText}>Quốc gia</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedCountry}
                onValueChange={(value) => updateDraftPath("country",value)}
              >
                <Picker.Item label="Chọn quốc gia" value="" />
                {country.map((c) => (
                  <Picker.Item key={c.id} label={c.name} value={c.id} />
                ))}
              </Picker>
            </View>


            <Text style={styles.subText}>Cửa hàng</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedStore}
                onValueChange={(value) => updateDraftPath("store",value)}
              >
                <Picker.Item label="Chọn cửa hàng" value="" />
                {store.map((s) => (
                  <Picker.Item key={s.id} label={s.name} value={s.id} />
                ))}
              </Picker>
            </View>

            <Text style={styles.subText}>SKU fulfill (code)</Text>
            <TextInput
              placeholder=""
              style={styles.input}
              value={sku}
              onChangeText={(text) => updateDraftPath("sku", text)}
            />

            <Text style={styles.subText}>Order ID (id_number)</Text>
            <TextInput
              placeholder=""
              style={styles.input}
              value={orderId}
              onChangeText={(text) => updateDraftPath("orderId", text)}
            />

            {/* Switch */}
            <View style={styles.switchRow}>
              <Text style={styles.subText}>Ưu tiên</Text>
              <Switch
                value={isPriority}
                onValueChange={(value) => updateDraftPath("isPriority", value)}
                trackColor={{ false: '#ccc', true: '#dd6b4d' }}
                thumbColor={'#fff'}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      {/* FIXED FOOTER */}
      <View style={[styles.footer]}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleBack}>
          <Text style={styles.cancelText}>Quay Lại</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmButton} onPress={handleNext}>
          <Text style={styles.confirmText}>Tiếp Theo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddStoreInfo;

const styles = StyleSheet.create({
header: {
    backgroundColor: '#fff',
    height: 100,
    paddingTop: 50,
    paddingHorizontal: 20,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    bottom: 50,
    width:'100%'
  },
  confirmButton: {
    backgroundColor: '#dd6b4d',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderColor: '#dd6b4d',
    borderWidth: 2,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  cancelText: {
    color: '#dd6b4d',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

    pickerWrapper: {
    borderWidth: 1,
    borderColor: '#dd6b4d',
    borderRadius: 8,
    marginVertical: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
});
