/**
 * ApiService - Serviço centralizado para comunicação com o backend
 * 
 * Responsabilidades:
 * - Gerenciar todas as requisições HTTP para o backend
 * - Configurar headers, autenticação e interceptadores
 * - Tratar erros de forma centralizada
 * - Gerenciar tokens JWT
 */

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG, API_ENDPOINTS, HTTP_STATUS } from '../config/api.config';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

export class ApiService {
  private static instance: ApiService;
  private axiosInstance: AxiosInstance;
  private authToken: string | null = null;

  /**
   * Singleton pattern
   */
  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private constructor() {
    // Criar instância do axios com configurações base
    this.axiosInstance = axios.create(API_CONFIG);

    // Configurar interceptadores
    this.setupInterceptors();
  }

  /**
   * Configura interceptadores de requisição e resposta
   */
  private setupInterceptors(): void {
    // Interceptador de requisição - adiciona token JWT se disponível
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[API] Erro na requisição:', error);
        return Promise.reject(error);
      }
    );

    // Interceptador de resposta - trata erros globalmente
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`[API] Resposta recebida: ${response.status}`);
        return response;
      },
      (error: AxiosError) => {
        return this.handleResponseError(error);
      }
    );
  }

  /**
   * Trata erros de resposta da API
   */
  private handleResponseError(error: AxiosError): Promise<never> {
    if (error.response) {
      // Servidor respondeu com status de erro
      const status = error.response.status;
      const data: any = error.response.data;
      
      console.error(`[API] Erro ${status}:`, data);

      switch (status) {
        case HTTP_STATUS.UNAUTHORIZED:
          // Token expirado ou inválido - limpar autenticação
          this.clearAuth();
          break;
        
        case HTTP_STATUS.FORBIDDEN:
          console.error('[API] Acesso negado');
          break;
        
        case HTTP_STATUS.NOT_FOUND:
          console.error('[API] Recurso não encontrado');
          break;
        
        case HTTP_STATUS.TOO_MANY_REQUESTS:
          console.error('[API] Muitas requisições - aguarde um momento');
          break;
        
        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
          console.error('[API] Erro interno do servidor');
          break;
      }
    } else if (error.request) {
      // Requisição foi feita mas não houve resposta
      console.error('[API] Sem resposta do servidor:', error.message);
    } else {
      // Erro ao configurar a requisição
      console.error('[API] Erro ao configurar requisição:', error.message);
    }

    return Promise.reject(error);
  }

  /**
   * Define o token de autenticação
   */
  setAuthToken(token: string): void {
    this.authToken = token;
    console.log('[API] Token de autenticação definido');
  }

  /**
   * Limpa o token de autenticação
   */
  clearAuth(): void {
    this.authToken = null;
    console.log('[API] Token de autenticação removido');
  }

  /**
   * Obtém o token atual
   */
  getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Verifica se está autenticado
   */
  isAuthenticated(): boolean {
    return this.authToken !== null;
  }

  /**
   * Método GET genérico
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.get(url, config);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Método POST genérico
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.post(url, data, config);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Método PUT genérico
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.put(url, data, config);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Método PATCH genérico
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.patch(url, data, config);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Método DELETE genérico
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.delete(url, config);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Trata erros e retorna ApiResponse padronizada
   */
  private handleError(error: any): ApiResponse {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response) {
        // Erro com resposta do servidor
        const data: any = axiosError.response.data;
        
        // NestJS retorna erro no formato: { statusCode, message, error }
        // Extrair a mensagem do backend
        let errorMessage = 'Erro na requisição';
        
        if (typeof data === 'string') {
          errorMessage = data;
        } else if (data?.message) {
          // NestJS geralmente coloca a mensagem em 'message'
          errorMessage = Array.isArray(data.message) ? data.message[0] : data.message;
        } else if (data?.error) {
          errorMessage = data.error;
        }
        
        return {
          success: false,
          error: errorMessage,
          statusCode: axiosError.response.status,
        };
      } else if (axiosError.request) {
        // Sem resposta do servidor
        return {
          success: false,
          error: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
        };
      }
    }

    // Erro genérico
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }

  /**
   * Testa a conexão com a API
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.get('/health');
      return response.success;
    } catch (error) {
      console.error('[API] Falha no teste de conexão:', error);
      return false;
    }
  }

  // ===========================
  // Métodos específicos da API
  // ===========================

  /**
   * Login de usuário
   */
  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: any }>> {
    // Backend espera "senha" não "password"
    const response = await this.post(API_ENDPOINTS.AUTH.LOGIN, { email, senha: password });
    
    if (response.success && response.data?.token) {
      this.setAuthToken(response.data.token);
    }
    
    return response;
  }

  /**
   * Registrar novo usuário
   */
  async register(userData: {
    name: string;
    email: string;
    password: string;
    type?: 'client' | 'employee';
    phone?: string;
  }): Promise<ApiResponse<{ token: string; user: any }>> {
    // Backend espera campos em inglês no endpoint /auth/register
    const response = await this.post('/auth/register', userData);
    
    if (response.success && response.data?.token) {
      this.setAuthToken(response.data.token);
    }
    
    return response;
  }

  /**
   * Obtém token de teste (para desenvolvimento)
   */
  async getTestToken(): Promise<ApiResponse<{ token: string }>> {
    return this.get(API_ENDPOINTS.AUTH.TOKEN);
  }

  /**
   * Busca todos os clientes (apenas funcionários)
   */
  async getClients(): Promise<ApiResponse<any[]>> {
    return this.get(API_ENDPOINTS.CLIENTS.BASE);
  }

  /**
   * Busca cliente por ID
   */
  async getClientById(id: string | number): Promise<ApiResponse<any>> {
    return this.get(API_ENDPOINTS.CLIENTS.BY_ID(id));
  }

  /**
   * Cadastra novo cliente
   */
  async createClient(clientData: any): Promise<ApiResponse<any>> {
    return this.post(API_ENDPOINTS.CLIENTS.CADASTRO, clientData);
  }

  /**
   * Atualiza cliente
   */
  async updateClient(id: string | number, clientData: any): Promise<ApiResponse<any>> {
    return this.put(API_ENDPOINTS.CLIENTS.BY_ID(id), clientData);
  }

  /**
   * Remove cliente
   */
  async deleteClient(id: string | number): Promise<ApiResponse<any>> {
    return this.delete(API_ENDPOINTS.CLIENTS.BY_ID(id));
  }

  /**
   * Busca todos os funcionários
   */
  async getEmployees(): Promise<ApiResponse<any[]>> {
    return this.get(API_ENDPOINTS.EMPLOYEES.BASE);
  }

  /**
   * Busca funcionário por ID
   */
  async getEmployeeById(id: string | number): Promise<ApiResponse<any>> {
    return this.get(API_ENDPOINTS.EMPLOYEES.BY_ID(id));
  }

  /**
   * Cadastra novo funcionário
   */
  async createEmployee(employeeData: any): Promise<ApiResponse<any>> {
    return this.post(API_ENDPOINTS.EMPLOYEES.BASE, employeeData);
  }

  /**
   * Busca todos os pacotes
   */
  async getPackages(): Promise<ApiResponse<any[]>> {
    return this.get(API_ENDPOINTS.PACKAGES.BASE);
  }

  /**
   * Busca pacote por ID
   */
  async getPackageById(id: string | number): Promise<ApiResponse<any>> {
    return this.get(API_ENDPOINTS.PACKAGES.BY_ID(id));
  }

  /**
   * Analisa acessibilidade de um site
   */
  async analyzeSiteAccessibility(url: string): Promise<ApiResponse<any>> {
    return this.post(API_ENDPOINTS.LIGHTHOUSE.ANALYZE, { url });
  }

  /**
   * Busca todos os orçamentos
   */
  async getBudgets(): Promise<ApiResponse<any[]>> {
    return this.get(API_ENDPOINTS.BUDGETS.BASE);
  }

  /**
   * Cria novo orçamento
   */
  async createBudget(budgetData: any): Promise<ApiResponse<any>> {
    return this.post(API_ENDPOINTS.BUDGETS.BASE, budgetData);
  }

  /**
   * Busca todos os contratos
   */
  async getContracts(): Promise<ApiResponse<any[]>> {
    return this.get(API_ENDPOINTS.CONTRACTS.BASE);
  }

  /**
   * Cria novo contrato
   */
  async createContract(contractData: any): Promise<ApiResponse<any>> {
    return this.post(API_ENDPOINTS.CONTRACTS.BASE, contractData);
  }
}

// Exportar instância singleton
export default ApiService.getInstance();

