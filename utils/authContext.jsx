import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from './api'; 

export const AuthContext = createContext({
  isLoggedIn: false,
  logIn: () => {},
  logOut: () => {},
  token: null,
  loading: true,
  refreshToken: () => {},
  getRefreshToken: () => {},
});

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        console.log('🔍 Loading stored token...');
        
        // Load access token from secure storage
        const accessToken = await SecureStore.getItemAsync('access_token');
        
        if (accessToken) {
          console.log('✅ Token found in storage');
          
          // TODO: Optionally verify token is still valid by calling an API endpoint
          // You can uncomment this when you have a profile endpoint working
          /*
          try {
            await api.getProfile();
            console.log('✅ Token is valid');
          } catch (error) {
            console.log('❌ Token is invalid, trying to refresh...');
            const refreshed = await refreshToken();
            if (!refreshed) {
              throw new Error('Token refresh failed');
            }
          }
          */
          
          setToken(accessToken);
          setIsLoggedIn(true);
        } else {
          console.log('ℹ️ No token found in storage');
        }
      } catch (error) {
        console.error('❌ Error loading token from secure storage:', error);
        // If there's an error loading, clear any invalid state
        await logOut();
      } finally {
        setLoading(false);
      }
    };

    loadToken();
  }, []);

  const logIn = async (newToken) => {
    try {
      console.log('📝 Storing new token...');
      
      // Store token securely
      await SecureStore.setItemAsync('access_token', newToken);
      
      setToken(newToken);
      setIsLoggedIn(true);
      
      console.log('✅ User logged in successfully');
    } catch (error) {
      console.error('❌ Error storing token:', error);
      throw error; // Re-throw so login component can handle it
    }
  };

  const logOut = async () => {
    try {
      console.log('🚪 Logging out user...');
      
      // Use the api helper to clear tokens
      await api.logout();
      
      setToken(null);
      setIsLoggedIn(false);
      
      console.log('✅ User logged out successfully');
    } catch (error) {
      console.error('❌ Error during logout:', error);
      // Even if secure storage fails, clear the app state
      setToken(null);
      setIsLoggedIn(false);
    }
  };

  // Helper function to get refresh token
  const getRefreshToken = async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync('refresh_token');
      return refreshToken;
    } catch (error) {
      console.error('❌ Error getting refresh token:', error);
      return null;
    }
  };

  // Function to refresh access token using our axios helper
  const refreshToken = async () => {
    try {
      console.log('🔄 Attempting to refresh token...');
      
      const refreshed = await api.refreshToken();
      
      if (refreshed) {
        // Get the new token from storage
        const newToken = await SecureStore.getItemAsync('access_token');
        setToken(newToken);
        setIsLoggedIn(true);
        
        console.log('✅ Token refreshed successfully');
        return true;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      
      // Force logout if refresh fails
      await logOut();
      throw error;
    }
  };

  // Helper to check if user is authenticated and token is valid
  const checkAuthStatus = async () => {
    if (!token) return false;
    
    try {
      // Try to make an authenticated request
      await api.getProfile();
      return true;
    } catch (error) {
      console.log('🔄 Token invalid, trying to refresh...');
      try {
        return await refreshToken();
      } catch (refreshError) {
        console.log('❌ Refresh failed, user needs to login');
        return false;
      }
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn, 
        logIn, 
        logOut, 
        token, 
        loading, 
        refreshToken,
        getRefreshToken,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}