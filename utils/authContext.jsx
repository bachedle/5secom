import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const API = 'https://5secom.dientoan.vn/api';
const CLIENT_ID = 'dichtetayninh';
const CLIENT_SECRET = 'AVTaQ7vJes38oseonKqt';

export const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  token: null,
  loading: true,
  error: null,
  logIn: async () => {},
  logOut: () => {},
});

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('authToken');
        const storedUser = await SecureStore.getItemAsync('user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Error loading stored auth:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const logIn = async (username, password) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
          grant_type: 'password',
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          username,
          password,
      });

      const response = await axios.post(`${API}/oauth2/token`, params, { headers: { "Content-Type": "application/x-www-form-urlencoded" }});
      const data = response.data;
      
      const authToken = data.access_token;
      const userData = data.user || { username };
      
      await SecureStore.setItemAsync('authToken', authToken);
      await SecureStore.setItemAsync('user', JSON.stringify(userData));
      
      setToken(authToken);
      setUser(userData);
      setIsLoggedIn(true);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error_description || 
                          err.response?.data?.message || 
                          err.message || 
                          'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    try {
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('user');
      
      setToken(null);
      setUser(null);
      setIsLoggedIn(false);
      setError(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const value = {
    isLoggedIn,
    user,
    token,
    loading,
    error,
    logIn,
    logOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};