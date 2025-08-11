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
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';


const UserEdit = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [username, setUsername] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [image, setImage] = useState(null);
  const [credname, setCredname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (params.username) setUsername(params.username);
    if (params.image) setImage(params.image);
    if (params.credname) setCredname(params.credname);
    if (params.phone) setPhone(params.phone);
    if (params.email) setEmail(params.email);
    if (params.password) setPassword(params.password);
    if (params.birthdate) setBirthdate(params.birthdate);

  }, [params]);

  const handleBack = () => {
    router.back();
  };

  const handleSave = () => {
    router.replace({
    pathname: '/UserPage',
    params: {
      username,
      image,
      credname,
      phone,
      email,
      password,
      birthdate, 
  },
});

  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission denied!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

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

            {/* Avatar */}
            <View>
              <Text style={styles.subText}>Ảnh đại diện</Text>
              <View style={styles.avatarWrapper}>
                <TouchableOpacity style={styles.avatar} onPress={pickImage}>
                  {image && (
                    <Image source={{ uri: image }} style={styles.avatarImage} />
                  )}
                  <MaterialCommunityIcons
                    name="camera"
                    size={32}
                    color="#fff"
                    style={styles.cameraIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Form Inputs */}
            <View>
              <Text style={styles.subText}>Username</Text>
              <TextInput
                placeholder="Username"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
              />

              <Text style={styles.subText}>Password</Text>
              <TextInput
                placeholder="Password"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />

              <Text style={styles.subText}>Họ và tên</Text>
              <TextInput
                placeholder="Họ và Tên"
                style={styles.input}
                value={credname}
                onChangeText={setCredname}
              />

              <Text style={styles.subText}>Ngày sinh</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.input}
              >
                <Text>{birthdate || 'Chọn ngày sinh'}</Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={birthdate ? new Date(birthdate) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      const formattedDate = selectedDate.toLocaleDateString('vi-VN');
                      setBirthdate(formattedDate);
                    }
                  }}
                />
              )}
                  

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

            {/* Buttons */}
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleBack}>
                <Text style={styles.cancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleSave}>
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
    backgroundColor: '#fff',
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
    borderRadius: 75,
    backgroundColor: '#ccc',
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  cameraIcon: {
    zIndex: 2,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8,
    borderRadius: 50,
  },
});
