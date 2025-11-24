/**
 * Utilitário para detectar automaticamente a URL da API
 * ✅ Funciona em qualquer máquina sem precisar configurar IP manualmente!
 * 
 * Estratégias (em ordem de prioridade):
 * 1. Variável de ambiente EXPO_PUBLIC_API_URL (se definida)
 * 2. Web: sempre usa localhost
 * 3. Mobile: tenta detectar IP do Expo ou usa duckdns.org
 * 4. Fallback para duckdns.org (funciona em qualquer rede se configurado)
 */

import { Platform } from 'react-native';

/**
 * Obtém o IP local do Expo quando disponível
 */
const getExpoIP = (): string | null => {
  try {
    // Tenta usar expo-constants se disponível
    // @ts-ignore - expo-constants pode não estar tipado
    const Constants = require('expo-constants').default;
    if (Constants) {
      // Expo fornece o IP na constante debuggerHost
      // Formato: "192.168.1.7:8081" -> extrair apenas o IP
      const debuggerHost = Constants.expoConfig?.hostUri || Constants.debuggerHost;
      if (debuggerHost) {
        const ip = debuggerHost.split(':')[0];
        if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
          return ip;
        }
      }
    }
  } catch (error) {
    // Ignorar erros - expo-constants pode não estar disponível
  }
  return null;
};

/**
 * Detecta automaticamente a melhor URL da API baseado na plataforma
 */
export const getApiBaseUrl = (): string => {
  // 1. Verificar variável de ambiente (prioridade máxima)
  // Permite override manual se necessário
  if (process.env.EXPO_PUBLIC_API_URL) {
    console.log('[API] Usando URL da variável de ambiente:', process.env.EXPO_PUBLIC_API_URL);
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // 2. Para web, sempre usar localhost
  if (Platform.OS === 'web') {
    const url = 'http://localhost:3000';
    console.log('[API] Web detectado, usando:', url);
    return url;
  }

  // 3. Para mobile: tentar detectar IP do Expo automaticamente
  if (__DEV__) {
    const expoIP = getExpoIP();
    if (expoIP) {
      const url = `http://${expoIP}:3000`;
      console.log('[API] IP do Expo detectado automaticamente:', url);
      return url;
    }
  }

  // 4. Fallback: usar duckdns.org (funciona em qualquer rede se configurado)
  // Se o backend estiver acessível via internet, isso funciona automaticamente
  const url = 'http://adacompany.duckdns.org:3000';
  console.log('[API] Usando URL padrão (duckdns):', url);
  console.log('[API] 💡 Dica: Configure EXPO_PUBLIC_API_URL para usar IP específico');
  return url;
};

/**
 * Configuração inteligente que detecta automaticamente o ambiente
 */
export const API_BASE_URL = getApiBaseUrl();
