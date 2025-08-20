// Development-only debug utilities
import apiClient from './apiClient';
import { CLIENT_ID, CLIENT_SECRET, API_BASE_URL } from '@env';

const api_base = API_BASE_URL || 'https://5secom.dientoan.vn';
const client_id = CLIENT_ID || 'dichtetayninh';
const client_secret = CLIENT_SECRET || 'AVTaQ7vJes38oseonKqt';

export const testServerConnection = async () => {
  const health = await fetch(`${api_base}/api/health`).catch(() => null);
  console.log('Health:', health?.status);

  const oauthTest = await fetch(`${api_base}/api/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=test',
  });
  console.log('OAuth2 status:', oauthTest.status);
};

export const testOAuthVariations = async (email, password) => {
  const variations = [
    {
      name: 'Standard OAuth2',
      data: {
        grant_type: 'password',
        username: email,
        password,
        client_id,
        client_secret,
      }
    },
    {
      name: 'Basic Auth',
      data: {
        grant_type: 'password',
        username: email,
        password,
        client_id,
      },
      headers: {
        'Authorization': `Basic ${btoa(`${client_id}:${client_secret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  ];

  for (const variation of variations) {
    try {
      const body = new URLSearchParams(variation.data);
      const res = await apiClient.post('/api/oauth2/token', body.toString(), {
        headers: variation.headers || { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      return { success: true, variation: variation.name, data: res.data };
    } catch {}
  }
  return { success: false, message: 'All formats failed' };
};
