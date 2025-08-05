import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

const UserEdit = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [credname, setCredname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.contentWrapper}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Thông tin cá nhân</Text>

            <View>
              <Text style={styles.subText}>Ảnh đại diện</Text>
              <View style={styles.avatarWrapper}>
                <View style={styles.avatar}></View>
              </View>
            </View>

            <View>
              <Text style={styles.subText}>Username</Text>
              <TextInput
                placeholder="Username"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                keyboardType="default"
              />
              <Text style={styles.subText}>Password</Text>
              <TextInput
                placeholder="Password"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                keyboardType="default"
              />
              <Text style={styles.subText}>Họ và tên</Text>
              <TextInput
                placeholder="Họ và Tên"
                style={styles.input}
                value={credname}
                onChangeText={setCredname}
              />
              <Text style={styles.subText}>Ngày sinh</Text>
              <TextInput
                placeholder="Ngày sinh"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
              />
              <Text style={styles.subText}>Email</Text>
              <TextInput
                placeholder="Email"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              <Text style={styles.subText}>Số điện thoại</Text>
              <TextInput
                placeholder="Số điện thoại"
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.cancelButton}>
                <Text style={styles.cancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton}>
                <Text style={styles.confirmText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default UserEdit;

const styles = StyleSheet.create({
  contentWrapper: {
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    margin: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 8,
    fontSize: 13,
  },
  confirmButton: {
    backgroundColor: '#dd6b4d',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: '#ffffffff',
    borderColor: '#dd6b4d',
    borderWidth: 3,
    paddingVertical: 12,
    width: '48%',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
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
  buttonGroup: {
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginVertical: 10,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 180,
    backgroundColor: '#ccc',
    borderWidth: 4,
    borderColor: '#fff',
  },
});
