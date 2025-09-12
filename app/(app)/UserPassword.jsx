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
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../utils/authContext';

const FOOTER_HEIGHT = 80;
const HEADER_HEIGHT = 100;


const UserPassword = () => {
  const router = useRouter();
  const { updatePassword } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleSave = async () => {
    // Validation
    if (!currentPassword.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu hiện tại');
      return;
    }

    if (!newPassword.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu mới');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới phải khác mật khẩu hiện tại');
      return;
    }

    try {
      setIsLoading(true);
      
      const result = await updatePassword(currentPassword.trim(), newPassword.trim());
      
      if (result.success) {
        Alert.alert(
          'Thành công', 
          'Mật khẩu đã được cập nhật!',
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
        Alert.alert('Lỗi', result.error || 'Không thể cập nhật mật khẩu');
      }

    } catch (error) {
      console.error('Password change error:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi đổi mật khẩu.');
    } finally {
      setIsLoading(false);
    }
  };

  // Validation function
  const isFormValid = () => {
    return (
      currentPassword.trim().length > 0 &&
      newPassword.trim().length >= 6 &&
      confirmPassword.trim().length > 0 &&
      newPassword === confirmPassword &&
      currentPassword !== newPassword
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {/* FORM AREA */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={

            Platform.OS === 'ios' ? HEADER_HEIGHT + FOOTER_HEIGHT : 0}
        >
          <ScrollView
            contentContainerStyle={styles.contentWrapper}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Đổi mật khẩu</Text>

            <View style={styles.iconWrapper}>
              <MaterialCommunityIcons 
                name="lock-outline" 
                size={80} 
                color="#dd6b4d" 
              />
            </View>

            <Text style={styles.description}>
              Để bảo mật tài khoản, vui lòng nhập mật khẩu hiện tại và mật khẩu mới.
            </Text>

            {/* Current Password */}
            <Text style={styles.subText}>Mật khẩu hiện tại</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Nhập mật khẩu hiện tại"
                secureTextEntry={!showCurrentPassword}
                style={styles.passwordInput}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                editable={!isLoading}
                returnKeyType="next"
                blurOnSubmit={false}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                <MaterialCommunityIcons
                  name={showCurrentPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            {/* New Password */}
            <Text style={styles.subText}>Mật khẩu mới</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                secureTextEntry={!showNewPassword}
                style={styles.passwordInput}
                value={newPassword}
                onChangeText={setNewPassword}
                editable={!isLoading}
                returnKeyType="next"
                blurOnSubmit={false}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                <MaterialCommunityIcons
                  name={showNewPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            <Text style={styles.subText}>Xác nhận mật khẩu mới</Text>
            <View style={[
              styles.passwordContainer,
              confirmPassword && newPassword !== confirmPassword && styles.inputError
            ]}>
              <TextInput
                placeholder="Nhập lại mật khẩu mới"
                secureTextEntry={!showConfirmPassword}
                style={styles.passwordInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!isLoading}
                returnKeyType="done"
                blurOnSubmit={true}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <MaterialCommunityIcons
                  name={showConfirmPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            {confirmPassword && newPassword !== confirmPassword && (
              <Text style={styles.errorText}>
                Mật khẩu xác nhận không khớp
              </Text>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

       <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsTitle}>Yêu cầu mật khẩu:</Text>
              <Text style={[
                styles.requirement,
                newPassword.length >= 6 && styles.requirementMet
              ]}>
                • Ít nhất 6 ký tự
              </Text>
              <Text style={[
                styles.requirement,
                currentPassword && newPassword && currentPassword !== newPassword && styles.requirementMet
              ]}>
                • Khác mật khẩu hiện tại
              </Text>
            </View>

      {/* FIXED FOOTER */}
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
            {isLoading ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default UserPassword;

const styles = StyleSheet.create({
  contentWrapper: {
    paddingBottom: 120,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  iconWrapper: {
    alignItems: 'center',
    marginVertical: 20,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  subText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dd6b4d',
    borderRadius: 8,
    marginVertical: 4,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 14,
  },
  eyeIcon: {
    padding: 12,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  requirementsContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  requirement: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  requirementMet: {
    color: '#28a745',
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
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    bottom: 50, // ✅ stick to bottom instead of 50px up
  },
});