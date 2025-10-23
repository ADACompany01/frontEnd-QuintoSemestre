/**
 * Configuração da API
 * 
 * Centraliza as configurações de conexão com o backend
 */

// URL base da API
// IMPORTANTE: Para Android, use o IP da sua máquina na rede local
// Para encontrar o IP: ipconfig (Windows) ou ifconfig (Mac/Linux)
// O Expo mostra o IP quando inicia: exp://SEU_IP:8081

// Configure o IP da sua máquina aqui:
const LOCAL_IP = '192.168.50.58'; // IP da máquina na rede local (visto no Expo)

// Em desenvolvimento local:
// - Web: http://localhost:3000
// - Android/iOS: http://SEU_IP:3000
// Em produção (Render): https://backend-adacompany.onrender.com

export const API_BASE_URL = __DEV__ 
  ? `http://${LOCAL_IP}:3000`  // Desenvolvimento (funciona em web, Android e iOS)
  : 'https://backend-adacompany.onrender.com'; // Produção

// Timeout para requisições (em milissegundos)
export const API_TIMEOUT = 30000; // 30 segundos

// Headers padrão
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Configurações específicas por ambiente
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: DEFAULT_HEADERS,
};

// Endpoints da API
export const API_ENDPOINTS = {
  // Autenticação
  AUTH: {
    LOGIN: '/auth/login',
    TOKEN: '/auth/token',
  },
  
  // Clientes
  CLIENTS: {
    BASE: '/clientes',
    BY_ID: (id: string | number) => `/clientes/${id}`,
    CADASTRO: '/clientes/cadastro',
  },
  
  // Funcionários
  EMPLOYEES: {
    BASE: '/funcionarios',
    BY_ID: (id: string | number) => `/funcionarios/${id}`,
  },
  
  // Pacotes
  PACKAGES: {
    BASE: '/pacotes',
    BY_ID: (id: string | number) => `/pacotes/${id}`,
  },
  
  // Orçamentos
  BUDGETS: {
    BASE: '/orcamentos',
    BY_ID: (id: string | number) => `/orcamentos/${id}`,
  },
  
  // Contratos
  CONTRACTS: {
    BASE: '/contratos',
    BY_ID: (id: string | number) => `/contratos/${id}`,
  },
  
  // Lighthouse (avaliação de acessibilidade)
  LIGHTHOUSE: {
    ANALYZE: '/lighthouse/analyze',
  },
  
  // Logs
  LOGS: {
    BASE: '/logs',
    STATS: '/logs/stats',
    OLD: '/logs/old',
  },
};

// Status HTTP
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

