import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

useFocusEffect(
  useCallback(() => {
    // Clear all input when navigating back to login
    setEmail('');
    setPassword('');
    setRememberMe(false);
  }, [])
);

  const handleLogin = () => {

    // const isValid = validateLogin();
    // if (!isValid)
    //   return;
    // Handle login logic
    router.replace('(tabs)');
  };

  //validate login credentials
const validateLogin = () => {
  if (!email || !password) {
    alert('Hãy nhập email và mật khẩu');
    return false;
  }

  if (!email.includes('@')) {
    alert('Email không hợp lệ');
    return false;
  }

  // Sample password validation
  if (!email.includes('5secom') || password !== '123456') {
    alert('Email hoặc mật khẩu không đúng');
    return false;
  }

  return true;
};




  return (
    <View style={styles.container}>
      {/* <Image
        source={require('../assets/logo.png')} // Replace with your logo path
        style={styles.logo}
      /> */}
      <Text style={styles.brand}>5SEcom</Text>
      <Text style={styles.welcome}>Welcome Back!</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <MaterialCommunityIcons
            name={rememberMe ? 'checkbox-marked' : 'checkbox-blank-outline'}
            size={22}
            color="#dd6b4d"
          />
          <Text style={styles.rememberText}>Remember me</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
        <Text style={styles.signInText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 8,
  },
  brand: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  welcome: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dd6b4d',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginVertical: 8,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    marginLeft: 8,
    fontSize: 14,
  },
  forgotText: {
    fontSize: 13,
    color: 'gray',
  },
  signInButton: {
    backgroundColor: '#dd6b4d',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  signInText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
