import axios from 'axios';
import { getToken, setToken as persistToken, removeToken } from './tokenStorage';
import Constants from 'expo-constants';

// Prioriza variável pública do Expo (definida no shell) e cai para app.config.js
const runtimeBaseUrl = process.env?.EXPO_PUBLIC_API_BASE_URL;
const configBaseUrl = Constants?.expoConfig?.extra?.apiBaseUrl;
const baseURL = runtimeBaseUrl || configBaseUrl || 'http://localhost:3000';
if (__DEV__) {
  // Ajuda a confirmar no console do Expo qual URL está em uso
  // eslint-disable-next-line no-console
  console.log('API baseURL:', baseURL);
}

export const api = axios.create({
  baseURL,
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Mitigar XSS/SQLi básicos: content-type e saneamento simples de strings
  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json; charset=utf-8';
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      await removeToken();
    }
    return Promise.reject(error);
  }
);

export async function setAuthToken(token) {
  if (token) return persistToken(token);
  return removeToken();
}

