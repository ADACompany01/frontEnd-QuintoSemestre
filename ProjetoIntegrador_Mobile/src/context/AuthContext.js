import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { api, setAuthToken } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getToken, removeToken } from '../services/tokenStorage';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  // Simula usuário funcionário para testes
  const [user, setUser] = useState({ tipo: 'funcionario', nome: 'Funcionário Teste' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const storedUser = await AsyncStorage.getItem('auth_user');
        if (token && storedUser) {
          await setAuthToken(token);
          setUser(JSON.parse(storedUser));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = useCallback(async (email, senha) => {
    // Saneamento simples
    const clean = (s) => String(s || '').replace(/[<>\"'`;]/g, '');
    const payload = { email: clean(email), senha: String(senha || '') };
    const { data } = await api.post('/auth/login', payload);
    const { token, user: u } = data;
    await setAuthToken(token);
    await AsyncStorage.setItem('auth_user', JSON.stringify(u));
    setUser(u);
    return u;
  }, []);

  const signOut = useCallback(async () => {
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, signIn, signOut }), [user, loading, signIn, signOut]);
  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

