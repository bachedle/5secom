import React, { useState, useCallback, useContext, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { AuthContext } from '../utils/authContext';
import { api } from '../utils/api';

const LoginPage = () => {
  const router = useRouter();
  const { logIn } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // Test server connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        await api.testConnection();
        setDebugInfo('✅ Server connection test passed');
      } catch (error) {
        setDebugInfo(`❌ Server connection failed: ${error.message}`);
      }
    };
    
    if (__DEV__) {
      testConnection();
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setEmail('');
      setPassword('');
      setRememberMe(false);
    }, [])
  );

  const handleLogin = async () => {
    if (!validateLogin()) return;

    setLoading(true);
    setDebugInfo('Starting login process...');
    
    try {
      console.log(' Starting login process...');
      
      // Use the axios-based login function
      const data = await api.login(email, password);
      
      console.log('✅ Login successful, received tokens');
      setDebugInfo('✅ Login successful, processing tokens...');

      // Check if we received the required tokens
      if (data.access_token) {
        // Store tokens securely
        await SecureStore.setItemAsync('access_token', data.access_token);

        // Store refresh token if available and remember me is checked
        if (data.refresh_token && rememberMe) {
          await SecureStore.setItemAsync('refresh_token', data.refresh_token);
          console.log('Refresh token stored');
          setDebugInfo('Refresh token stored');
        }

        // Update auth context
        await logIn(data.access_token);
        
        setDebugInfo('✅ Login completed successfully!');
        
        Alert.alert('Success', 'Login successful!', [
          { text: 'OK', onPress: () => router.replace('(tabs)') }
        ]);
      } else {
        setDebugInfo('❌ No access token in server response');
        Alert.alert('Error', 'No access token received from server');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setDebugInfo(`❌ Login failed: ${error.message}`);
      
      // Show detailed error information
      let errorTitle = 'Login Error';
      let errorMessage = error.message;
      
      // Provide helpful suggestions based on error type
      if (error.message.includes('Invalid client credentials')) {
        errorMessage += '\n\nCheck your CLIENT_ID and CLIENT_SECRET in the .env file';
      } else if (error.message.includes('Invalid email or password')) {
        errorMessage += '\n\nPlease check your login credentials';
      } else if (error.message.includes('Network error')) {
        errorMessage += '\n\nCheck your internet connection and server status';
      }
      
      Alert.alert(errorTitle, errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const validateLogin = () => {
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

  // Test server connectivity
  const testServerConnection = async () => {
    setLoading(true);
    setDebugInfo('🔍 Testing server connection...');
    
    try {
      await api.testConnection();
      setDebugInfo('✅ Server connection test passed');
      Alert.alert('Success', 'Server is reachable!');
    } catch (error) {
      setDebugInfo(`❌ Server test failed: ${error.message}`);
      Alert.alert('Connection Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Test different OAuth2 formats
  const testOAuthVariations = async () => {
    if (!email || !password) {
      Alert.alert('Missing Credentials', 'Please enter email and password first');
      return;
    }
    
    setLoading(true);
    setDebugInfo('🧪 Testing different OAuth2 formats...');
    
    try {
      const result = await api.testOAuthVariations(email, password);
      
      if (result.success) {
        setDebugInfo(`✅ Found working format: ${result.variation}`);
        Alert.alert('Success!', `Working OAuth2 format found: ${result.variation}`, [
          { 
            text: 'Use This Format', 
            onPress: async () => {
              // Store the successful tokens if available
              if (result.data.access_token) {
                await SecureStore.setItemAsync('access_token', result.data.access_token);
                if (result.data.refresh_token && rememberMe) {
                  await SecureStore.setItemAsync('refresh_token', result.data.refresh_token);
                }
                await logIn(result.data.access_token);
                router.replace('(tabs)');
              }
            }
          },
          { text: 'OK', style: 'cancel' }
        ]);
      } else {
        setDebugInfo(`❌ All OAuth2 formats failed: ${result.message}`);
        Alert.alert('All Formats Failed', result.message);
      }
    } catch (error) {
      setDebugInfo(`❌ OAuth2 testing failed: ${error.message}`);
      Alert.alert('Test Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.brand}>5SEcom</Text>
      <Text style={styles.welcome}>Welcome Back!</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text.trim())}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        editable={!loading}
      />
      
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        autoComplete="current-password"
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
            color={loading ? '#ccc' : '#dd6b4d'}
          />
          <Text style={[styles.rememberText, loading && styles.disabledText]}>
            Remember me
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => router.push('/forgot-password')}
          disabled={loading}
        >
          <Text style={[styles.forgotText, loading && styles.disabledText]}>
            Forgot password?
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.signInButton, loading && styles.disabledButton]} 
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.signInText}>
          {loading ? 'Signing In...' : 'Sign In'}
        </Text>
      </TouchableOpacity>

      {/* Debug section - only show in development */}

      {/* {__DEV__ && (
        <View style={styles.debugSection}>
          <Text style={styles.debugTitle}>Debug Information</Text>
          
          {debugInfo ? (
            <Text style={styles.debugInfo}>{debugInfo}</Text>
          ) : null}
          
          <TouchableOpacity 
            style={styles.debugButton}
            onPress={testServerConnection}
            disabled={loading}
          >
            <Text style={styles.debugButtonText}>Test Server Connection</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.debugButton}
            onPress={testOAuthVariations}
            disabled={loading}
          >
            <Text style={styles.debugButtonText}>Test OAuth2 Variations</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.debugButton}
            onPress={() => {
              // Clear all stored tokens for testing
              SecureStore.deleteItemAsync('access_token');
              SecureStore.deleteItemAsync('refresh_token');
              setDebugInfo('🗑️ Cleared all stored tokens');
            }}
            disabled={loading}
          >
            <Text style={styles.debugButtonText}>Clear Stored Tokens</Text>
          </TouchableOpacity>
        </View>
      )} */}
    </ScrollView>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 24,
    justifyContent: 'center',
    minHeight: '100%',
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
  disabledText: {
    color: '#ccc',
  },
  signInButton: {
    backgroundColor: '#dd6b4d',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  signInText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Debug styles
  debugSection: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  debugInfo: {
    fontSize: 12,
    fontFamily: 'monospace',
    backgroundColor: '#fff',
    padding: 8,
    marginBottom: 12,
    borderRadius: 4,
    color: '#666',
  },
  debugButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  debugButtonText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
  },
});