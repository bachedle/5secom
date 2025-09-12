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
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../utils/authContext';


const HEADER_HEIGHT = 100;
const FOOTER_HEIGHT = 80;

const UserEdit = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user, updateUser, updateImage } = useAuth();

  const [username, setUsername] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [image, setImage] = useState(null);
  const [credname, setCredname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [address, setAddress] = useState('');
  const [idCardNumber, setIdCardNumber] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize form with user data
    if (!isInitialized && (user || Object.keys(params).length > 0)) {
      setUsername(params.username || user?.username || '');
      setImage(params.image || user?.image || null);
      setCredname(params.credname || user?.name || user?.credname || '');
      setPhone(params.phone || user?.phone || '');
      setEmail(params.email || user?.email || '');
      setBirthdate(params.birthdate || user?.dob || user?.birthdate || '');
      setAddress(params.address || user?.address || '');
      setIdCardNumber(params.idCardNumber || user?.idCardNumber || '');
      setCode(params.code || user?.code || '');
      setIsInitialized(true);
    }
  }, [params, user, isInitialized]);

  const handleBack = () => {
    router.back();
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      // Prepare updates object with only changed fields
      const updates = {};
      
      if (username !== user?.username && username.trim()) {
        updates.username = username.trim();
      }
      if (credname !== user?.name && credname.trim()) {
        updates.name = credname.trim();
        updates.credname = credname.trim(); // Support both field names
      }
      if (phone !== user?.phone && phone.trim()) {
        updates.phone = phone.trim();
      }
      if (email !== user?.email && email.trim()) {
        updates.email = email.trim();
      }
      if (birthdate !== user?.dob && birthdate) {
        updates.dob = birthdate;
        updates.birthdate = birthdate; // Support both field names
      }
      if (address !== user?.address && address.trim()) {
        updates.address = address.trim();
      }
      if (idCardNumber !== user?.idCardNumber && idCardNumber.trim()) {
        updates.idCardNumber = idCardNumber.trim();
      }
      if (code !== user?.code && code.trim()) {
        updates.code = code.trim();
      }

      // Handle image update separately if changed
      let imageUpdated = false;
      if (imageChanged && image) {
        const imageResult = await updateImage(image);
        if (!imageResult.success) {
          Alert.alert('Lỗi', `Không thể cập nhật ảnh: ${imageResult.error}`);
          return;
        }
        imageUpdated = true;
      }

      // Update other user data if there are changes
      if (Object.keys(updates).length > 0) {
        const result = await updateUser(updates);
        
        if (result.success) {
          Alert.alert(
            'Thành công', 
            'Thông tin đã được cập nhật!',
            [
              {
                text: 'OK',
                onPress: () => {
                  router.replace('/UserPage');
                }
              }
            ]
          );
        } else {
          Alert.alert('Lỗi', `Không thể cập nhật: ${result.error}`);
        }
      } else if (!imageUpdated) {
        // No changes made
        Alert.alert('Thông báo', 'Không có thay đổi nào để lưu.');
      } else {
        // Only image was updated
        Alert.alert(
          'Thành công', 
          'Ảnh đã được cập nhật!',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/UserPage')
            }
          ]
        );
      }

    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi lưu thông tin.');
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission denied!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageChanged(true);
    }
  };

  // Validation function
  const isFormValid = () => {
    // Basic validation
    if (email && !email.includes('@')) return false;
    if (phone && phone.length < 10) return false;
    return true;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={

            Platform.OS === 'ios' ? HEADER_HEIGHT + FOOTER_HEIGHT : 0}
        >
          <ScrollView
            contentContainerStyle={styles.contentWrapper}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>Chỉnh sửa thông tin</Text>

            {/* Avatar */}
            <Text style={styles.subText}>Ảnh đại diện</Text>
            <View style={styles.avatarWrapper}>
              <TouchableOpacity style={styles.avatar} onPress={pickImage}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.avatarImage} />
                ) : (
                  <MaterialCommunityIcons
                    name="account"
                    size={72}
                    color="#fff"
                  />
                )}
                <MaterialCommunityIcons
                  name="camera"
                  size={28}
                  color="#fff"
                  style={styles.cameraIcon}
                />
              </TouchableOpacity>
            </View>

            {/* Form Inputs */}
            <Text style={styles.subText}>Username</Text>
            <TextInput
              placeholder="Username"
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              editable={!isLoading}
            />

            <Text style={styles.subText}>Mã nhân viên</Text>
            <TextInput
              placeholder="Mã nhân viên"
              style={styles.input}
              value={code}
              onChangeText={setCode}
              editable={!isLoading}
            />

            <Text style={styles.subText}>Họ và tên</Text>
            <TextInput
              placeholder="Họ và Tên"
              style={styles.input}
              value={credname}
              onChangeText={setCredname}
              editable={!isLoading}
            />

            <Text style={styles.subText}>Ngày sinh</Text>
            <TouchableOpacity
              onPress={() => !isLoading && setShowDatePicker(true)}
              style={[styles.input, { justifyContent: 'center' }]}
            >
              <Text style={{ color: birthdate ? 'black' : '#999' }}>
                {birthdate || 'Chọn ngày sinh'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={birthdate ? new Date(birthdate) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  if (Platform.OS !== 'ios') setShowDatePicker(false);
                  if (selectedDate) {
                    const formattedDate = selectedDate.toLocaleDateString(
                      'vi-VN'
                    );
                    setBirthdate(formattedDate);
                  }
                }}
              />
            )}

            <Text style={styles.subText}>Email</Text>
            <TextInput
              placeholder="Email"
              style={[styles.input, !isFormValid() && email && styles.inputError]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!isLoading}
            />

            <Text style={styles.subText}>Số điện thoại</Text>
            <TextInput
              placeholder="Số điện thoại"
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              editable={!isLoading}
            />

            <Text style={styles.subText}>Địa chỉ</Text>
            <TextInput
              placeholder="Địa chỉ"
              style={[styles.input, styles.textArea]}
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
              editable={!isLoading}
            />

            <Text style={styles.subText}>CMND/CCCD</Text>
            <TextInput
              placeholder="Số CMND/CCCD"
              style={styles.input}
              value={idCardNumber}
              onChangeText={setIdCardNumber}
              keyboardType="numeric"
              editable={!isLoading}
            />
          </ScrollView>

          {/* Footer buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.cancelButton, isLoading && styles.disabledButton]}
              onPress={handleBack}
              disabled={isLoading}
            >
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.confirmButton, 
                (isLoading || !isFormValid()) && styles.disabledButton
              ]}
              onPress={handleSave}
              disabled={isLoading || !isFormValid()}
            >
              <Text style={styles.confirmText}>
                {isLoading ? 'Đang lưu...' : 'Lưu'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default UserEdit;

const styles = StyleSheet.create({
  contentWrapper: {
    backgroundColor: 'white',
    margin:10,
    borderRadius: 8,
    paddingTop: 20,
    paddingBottom: 120,
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 8,
    fontSize: 13,
  },
  textArea: {
    paddingVertical: 15,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: 'red',
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
  disabledButton: {
    opacity: 0.5,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    bottom: 50, // ✅ stick to bottom instead of 50px up
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
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 6,
    borderRadius: 50,
  },
});