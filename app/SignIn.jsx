import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../utils/authContext';

const LoginPage = () => {
  const router = useRouter();
  const { logIn, loading, error } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setUsername('');
      setPassword('');
      setRememberMe(false);
    }, [])
  );

  const handleLogin = async () => {
    if (!validateLogin()) return;

    const result = await logIn(username, password);

    if (result.success) {
      router.replace('(tabs)'); // move to main app
    } else {
      Alert.alert('Login Failed', result.error || 'Something went wrong');
    }
  };

  const validateLogin = () => {
    if (!username || !password) {
      Alert.alert('Validation Error', 'Hãy nhập username và mật khẩu');
      return false;
    }
    return true;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>5SEcom</Text>
      <Text style={styles.welcome}>Welcome Back!</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        editable={!loading}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setRememberMe(!rememberMe)}
          disabled={loading}
        >
          <MaterialCommunityIcons
            name={rememberMe ? 'checkbox-marked' : 'checkbox-blank-outline'}
            size={22}
            color="#dd6b4d"
          />
          <Text style={styles.rememberText}>Remember me</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled={loading}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.signInButton, loading && styles.signInButtonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.signInText}>Sign In</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default LoginPage;

// AUTH CONTEXT with console logs
const logIn = async (username, password) => {
  console.log('🔐 AuthContext: logIn called');
  console.log('📝 AuthContext: Username:', username);
  console.log('📝 AuthContext: Password:', password ? '***HIDDEN***' : 'EMPTY');
  
  try {
    console.log('⏳ AuthContext: Setting loading to true');
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
        grant_type: 'password',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        username,
        password,
    });

    console.log('📡 AuthContext: Making API request to:', `${API}/oauth2/token`);
    console.log('📡 AuthContext: Request params:', {
      grant_type: 'password',
      client_id: CLIENT_ID,
      client_secret: '***HIDDEN***',
      username,
      password: '***HIDDEN***'
    });

    const response = await axios.post(`${API}/oauth2/token`, params);
    
    console.log('✅ AuthContext: API request successful');
    console.log('📦 AuthContext: Response status:', response.status);
    console.log('📦 AuthContext: Response data:', response.data);
    
    const data = response.data;
    
    // Store token and user data securely
    const authToken = data.access_token;
    const userData = data.user || { username };
    
    console.log('💾 AuthContext: Storing token in SecureStore');
    await SecureStore.setItemAsync('authToken', authToken);
    await SecureStore.setItemAsync('user', JSON.stringify(userData));
    
    console.log('✅ AuthContext: Setting auth state');
    setToken(authToken);
    setUser(userData);
    setIsLoggedIn(true);
    
    console.log('✅ AuthContext: Login completed successfully');
    return { success: true };
  } catch (err) {
    console.log('❌ AuthContext: Login error occurred');
    console.log('❌ AuthContext: Error details:', err);
    console.log('❌ AuthContext: Error response:', err.response?.data);
    console.log('❌ AuthContext: Error status:', err.response?.status);
    
    const errorMessage = err.response?.data?.error_description || 
                        err.response?.data?.message || 
                        err.message || 
                        'Login failed';
    
    console.log('❌ AuthContext: Final error message:', errorMessage);
    setError(errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    console.log('🔄 AuthContext: Setting loading to false');
    setLoading(false);
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
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
  errorContainer: {
    backgroundColor: '#fee',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#c53030',
    textAlign: 'center',
    fontSize: 14,
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
  signInButtonDisabled: {
    backgroundColor: '#ccc',
  },
  signInText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
