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
import React, { useState } from 'react';

const AddStoreInfo = () => {
  const router = useRouter();

  const [storeType, setStoreType] = useState('');
  const [country, setCountry] = useState('');
  const [store, setStore] = useState('');
  const [sku, setSku] = useState('');
  const [orderId, setOrderId] = useState('');
  const [isPriority, setIsPriority] = useState(false);

  const handleBack = () => router.back();
  const handleNext = () => router.push('/AddGuestInfo');


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
            <TextInput
              placeholder="trạng thái"
              style={styles.input}
              value={storeType}
              onChangeText={setStoreType}
            />

            <Text style={styles.subText}>Quốc gia</Text>
            <TextInput
              placeholder="quốc gia"
              style={styles.input}
              value={country}
              onChangeText={setCountry}
            />

            <Text style={styles.subText}>Cửa hàng</Text>
            <TextInput
              placeholder="cửa hàng"
              style={styles.input}
              value={store}
              onChangeText={setStore}
            />

            <Text style={styles.subText}>SKU fulfill (code)</Text>
            <TextInput
              placeholder=""
              style={styles.input}
              value={sku}
              onChangeText={setSku}
            />

            <Text style={styles.subText}>Order ID (id_number)</Text>
            <TextInput
              placeholder=""
              style={styles.input}
              value={orderId}
              onChangeText={setOrderId}
            />

            {/* Switch */}
            <View style={styles.switchRow}>
              <Text style={styles.subText}>Ưu tiên</Text>
              <Switch
                value={isPriority}
                onValueChange={setIsPriority}
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
});
