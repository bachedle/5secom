// Authentication-related API calls
import * as SecureStore from 'expo-secure-store';
import { CLIENT_ID, CLIENT_SECRET } from '@env';
import apiClient from './apiClient';

const OAUTH_TOKEN_URL = '/api/oauth2/token';
const client_id = CLIENT_ID || 'dichtetayninh';
const client_secret = CLIENT_SECRET || 'AVTaQ7vJes38oseonKqt';

export const loginUser = async (email, password) => {
  const body = new URLSearchParams({
    grant_type: 'password',
    username: email,
    password,
    client_id,
    client_secret,
  });
  const res = await apiClient.post(OAUTH_TOKEN_URL, body.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return res.data;
};

export const refreshAuthToken = async () => {
  const refreshToken = await SecureStore.getItemAsync('refresh_token');
  if (!refreshToken) return false;

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id,
    client_secret,
  });

  try {
    const res = await apiClient.post(OAUTH_TOKEN_URL, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    await SecureStore.setItemAsync('access_token', res.data.access_token);
    if (res.data.refresh_token) {
      await SecureStore.setItemAsync('refresh_token', res.data.refresh_token);
    }
    return true;
  } catch {
    await logOutUser();
    return false;
  }
};

export const logOutUser = async () => {
  await SecureStore.deleteItemAsync('access_token');
  await SecureStore.deleteItemAsync('refresh_token');
};
