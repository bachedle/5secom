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
import { useOrder } from '../../utils/orderContext';

const API_URL = "https://5secom.dientoan.vn/api";


const AddGuestInfo = () => {
  const router = useRouter();

  const { draftOrder, updateDraftPath } = useOrder();  


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
              value={draftOrder.name|| ""}
              onChangeText={(text) => updateDraftPath("name", text)}
            />

            <Text style={styles.subText}>Số Điện Thoại</Text>
            <TextInput
              style={styles.input}
              value={draftOrder.phone || ""}
              onChangeText={(text) => updateDraftPath("phone", text)}
            />

            <Text style={styles.subText}>Địa Chỉ</Text>
            <TextInput
              style={styles.input}
              value={draftOrder.address || ""}
              onChangeText={(text) => updateDraftPath("address", text)}
              multiline
            />

            <Text style={styles.subText}>Địa chỉ 2</Text>
            <TextInput
              style={styles.input}
              value={draftOrder.attr1 || ""}
              onChangeText={(text) => updateDraftPath("attr1", text)}
              multiline
            />

            <Text style={styles.subText}>Thành phố</Text>
            <TextInput
              style={styles.input}
              value={draftOrder.attr2 || ""}
              onChangeText={(text) => updateDraftPath("attr2", text)}
            />

            <Text style={styles.subText}>Tiểu bang</Text>
            <TextInput
              style={styles.input}
              value={draftOrder.attr3 || ""}
              onChangeText={(text) => updateDraftPath("attr3", text)}
            />

            <Text style={styles.subText}>Quốc gia</Text>
            <TextInput
              style={styles.input}
              value={draftOrder.attr4 || ""}
              onChangeText={(text) => updateDraftPath("attr4", text)}
            />

            <Text style={styles.subText}>Mã bưu chính</Text>
            <TextInput
              style={styles.input}
              value={draftOrder.attr5 || ""}
              onChangeText={(text) => updateDraftPath("attr5", text)}
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
footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    bottom: 50, // ✅ stick to bottom instead of 50px up
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
