import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

export const API = 'https://5secom.dientoan.vn/api'; // Export API for other components
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
  fetchUser: async () => {},
  updateUser: async () => {},
  updateImage: async () => {},
  updatePassword: async () => {},
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
        const storedUsername = await SecureStore.getItemAsync('username');
        
        if (storedToken && storedUsername) {
          setToken(storedToken);
          setIsLoggedIn(true);
          
          try {
            await fetchUserData(storedToken, storedUsername);
          } catch (error) {
            console.error('Error fetching user on startup:', error);
            await logOut();
          }
        }
      } catch (error) {
        console.error('Error loading stored auth:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  // Decode JWT token to get user info
  const decodeJWTToken = (token) => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = JSON.parse(atob(parts[1]));
      return payload;
    } catch (error) {
      console.log('Could not decode JWT token');
      return null;
    }
  };

  // Smart filter to find current user from /user/find response
  const findCurrentUser = (allUsers, authToken, loginUsername) => {
    console.log(`🔍 Looking for current user among ${allUsers.length} users`);
    
    // Method 1: Match by login username (most reliable)
    if (loginUsername) {
      const userByUsername = allUsers.find(user => 
        user.username === loginUsername
      );
      if (userByUsername) {
        console.log('✅ Found user by login username:', userByUsername.username);
        return userByUsername;
      }
    }
    
    // Method 2: Match using JWT token data
    const jwtPayload = decodeJWTToken(authToken);
    if (jwtPayload) {
      console.log('🔍 JWT payload:', jwtPayload);
      
      const userByJWT = allUsers.find(user => {
        // Try different possible matches
        return (
          (jwtPayload.user_id && user.id === jwtPayload.user_id) ||
          (jwtPayload.id && user.id === jwtPayload.id) ||
          (jwtPayload.sub && user.id === jwtPayload.sub) ||
          (jwtPayload.username && user.username === jwtPayload.username) ||
          (jwtPayload.email && user.email === jwtPayload.email)
        );
      });
      
      if (userByJWT) {
        console.log('✅ Found user by JWT matching:', userByJWT.username);
        return userByJWT;
      }
    }
    
    // Method 3: If API returns users in order of relevance, current user might be first
    if (allUsers.length > 0) {
      console.log('⚠️ Using first user as fallback - this might not be correct!');
      console.log('First user:', allUsers[0]);
      return allUsers[0];
    }
    
    return null;
  };

  const fetchUserData = async (authToken, loginUsername = null) => {
    try {
      const currentToken = authToken || token;
      if (!currentToken) throw new Error('No auth token');
      
      console.log('📋 Fetching all users from /user/find...');
      
      const response = await axios.get(`${API}/user/find`, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      
      const allUsers = response.data.content || [];
      console.log(`📊 Retrieved ${allUsers.length} users`);
      
      // Find current user from the list
      const currentUser = findCurrentUser(allUsers, currentToken, loginUsername);
      
      if (!currentUser) {
        throw new Error('Could not identify current user from the list');
      }

      const userID = currentUser.id;

      const detailResponse = await axios.get(`${API}/user/${userID}`, {
        headers: { Authorization: `Bearer ${currentToken}` }
      })

      const fullUserData = detailResponse.data;

      setUser(fullUserData);
      console.log('✅ Current user data:', fullUserData);
      return fullUserData;
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  const fetchUser = async () => {
    const storedUsername = await SecureStore.getItemAsync('username');
    return await fetchUserData(token, storedUsername);
  };

  const logIn = async (username, password) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('client_secret', CLIENT_SECRET);
      formData.append('client_id', CLIENT_ID);
      formData.append('grant_type', 'password');
      formData.append('username', username);
      formData.append('password', password);
      formData.append('scope', 'read write');

      const response = await axios.post(`${API}/oauth2/token`, formData, { 
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      const data = response.data;
      const authToken = data.access_token;
      
      // Store both token and username for filtering
      await SecureStore.setItemAsync('authToken', authToken);
      await SecureStore.setItemAsync('username', username);
      
      setToken(authToken);
      setIsLoggedIn(true);

      try {
        // Get current user data using username filter
        await fetchUserData(authToken, username);
      } catch (fetchError) {
        console.log('Could not fetch complete user profile');
        setUser({ username });
      }
      
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

   const updateUser = async (updates) => {
    try {
      if (!token || !user) 
        throw new Error("Chưa xác thực");

      // Prepare the body according to the API schema
      const body = {
        version: user.version || 0,
        id: user.id,
      };
      
      // Only include fields that are being updated
      if (updates.username) body.username = updates.username;
      if (updates.name || updates.credname) body.name = updates.name || updates.credname;
      if (updates.phone) body.phone = updates.phone;
      if (updates.email) body.email = updates.email;
      if (updates.dob || updates.birthdate) body.dob = updates.dob || updates.birthdate;
      if (updates.address) body.address = updates.address;
      if (updates.idCardNumber) body.idCardNumber = updates.idCardNumber;
      if (updates.idCardDate) body.idCardDate = updates.idCardDate;
      if (updates.code) body.code = updates.code;
      
      // Include role and orgUnit if they exist
      if (user.role) body.role = { id: user.role.id };
      if (user.orgUnit) body.orgUnit = { id: user.orgUnit.id };

      console.log('Updating user with:', body);

      const response = await axios.patch(`${API}/user`, body, { 
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Update successful:', response.data);
      
      // Update user state with new data
      setUser(response.data);
      
      // Also refresh from server to get complete data
      try {
        await fetchUser();
      } catch (refreshError) {
        console.log('Could not refresh user data, but update was successful');
      }
      
      return { success: true, data: response.data };

    } catch (error) {
      console.error("Update user failed:", error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.message || error.response?.data || error.message 
      };
    }
  };
  const updatePassword = async (currentPassword, newPassword) => {
    try {
      if (!token || !user) 
        throw new Error("Chưa xác thực");
      if (!currentPassword || !newPassword)
        throw new Error("Cần cung cấp mật khẩu hiện tại và mật khẩu mới");
      const body = {
        oldPassword: currentPassword,
        newPassword
      };
      console.log('🔄 Updating password');
      const response = await axios.put(`${API}/user/change-password`, body, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Password update response:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ Update password failed:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data || error.message
      };
    } 
  };


  const updateImage = async (imageUri) => {
    try {
      if (!token || !user) 
        throw new Error("Chưa xác thực");

      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile_image.jpg',
      });

      const response = await axios.patch(`${API}/user`, formData, { 
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setUser(response.data);
      return { success: true, data: response.data };

    } catch (error) {
      console.error("Update image failed:", error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.message || error.response?.data || error.message 
      };
    }
  };

  const logOut = async () => {
    try {
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('username');
      
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
    fetchUser,
    updateUser,
    updatePassword,
    updateImage,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};