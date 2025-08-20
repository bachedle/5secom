import { Alert } from 'react-native';

export const validateLoginInputs = (email, password) => {
  if (!email?.trim() || !password?.trim()) {
    Alert.alert('Validation Error', 'Please enter both email and password');
    return false;
  }
  if (password.length < 6) {
    Alert.alert('Validation Error', 'Password must be at least 6 characters');
    return false;
  }
  return true;
};
