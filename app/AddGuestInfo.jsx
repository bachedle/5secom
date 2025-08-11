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
} from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

const AddGuestInfo = () => {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [zip, setZip] = useState('');

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    router.push('/AddOrderInfo');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f9' }}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Tạo Đơn</Text>
      </View>

      {/* CONTENT */}
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
            <Text style={styles.title}>Thông tin Khách Hàng</Text>

            <Text style={styles.subText}>Họ Tên</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
            />

            <Text style={styles.subText}>Số Điện Thoại</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
            />

            <Text style={styles.subText}>Địa Chỉ</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              multiline
            />

            <Text style={styles.subText}>Địa chỉ 2</Text>
            <TextInput
              style={styles.input}
              value={address2}
              onChangeText={setAddress2}
            />

            <Text style={styles.subText}>Thành phố</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
            />

            <Text style={styles.subText}>Tiểu bang</Text>
            <TextInput
              style={styles.input}
              value={state}
              onChangeText={setState}
            />

            <Text style={styles.subText}>Quốc gia</Text>
            <TextInput
              style={styles.input}
              value={country}
              onChangeText={setCountry}
            />

            <Text style={styles.subText}>Mã bưu chính</Text>
            <TextInput
              style={styles.input}
              value={zip}
              onChangeText={setZip}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      {/* FOOTER BUTTONS */}
          <View style={styles.footer}>
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

export default AddGuestInfo;

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
    paddingBottom: 80, // so scroll content won't hide behind footer
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
