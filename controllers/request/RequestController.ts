/**
 * RequestController - Controlador de solicitações
 * 
 * Responsabilidades:
 * - Gerenciar CRUD de solicitações
 * - Controlar fluxo de status
 * - Integrar com RequestModel
 * - Validações de negócio
 */

import { RequestModel, type AccessibilityRequest, type RequestStatus, type FileData, type ChecklistItem } from '../../models';

export interface RequestState {
  requests: AccessibilityRequest[];
  selectedRequest: AccessibilityRequest | null;
  isLoading: boolean;
  error: string | null;
}

export type RequestAction = 
  | { type: 'SET_REQUESTS'; requests: AccessibilityRequest[] }
  | { type: 'ADD_REQUEST'; request: AccessibilityRequest }
  | { type: 'UPDATE_REQUEST'; request: AccessibilityRequest }
  | { type: 'DELETE_REQUEST'; requestId: number }
  | { type: 'SELECT_REQUEST'; request: AccessibilityRequest | null }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'CLEAR_ERROR' };

export class RequestController {
  private static instance: RequestController;
  private requestState: RequestState = {
    requests: [],
    selectedRequest: null,
    isLoading: false,
    error: null
  };
  private listeners: Array<(state: RequestState) => void> = [];

  /**
   * Singleton pattern para garantir uma única instância
   */
  static getInstance(): RequestController {
    if (!RequestController.instance) {
      RequestController.instance = new RequestController();
      // Inicializa com dados mock
      RequestController.instance.initializeWithMockData();
    }
    return RequestController.instance;
  }

  /**
   * Inicializa com dados mock para desenvolvimento
   */
  private initializeWithMockData(): void {
    const mockRequests = RequestModel.getInitialRequests();
    this.dispatch({ type: 'SET_REQUESTS', requests: mockRequests });
  }

  /**
   * Subscriber pattern para notificar mudanças de estado
   */
  subscribe(listener: (state: RequestState) => void): () => void {
    this.listeners.push(listener);
    
    // Retorna função de unsubscribe
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notifica todos os listeners sobre mudanças de estado
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.requestState));
  }

  /**
   * Reducer para gerenciar mudanças de estado
   */
  private dispatch(action: RequestAction): void {
    switch (action.type) {
      case 'SET_REQUESTS':
        this.requestState = {
          ...this.requestState,
          requests: action.requests
        };
        break;
      
      case 'ADD_REQUEST':
        this.requestState = {
          ...this.requestState,
          requests: [action.request, ...this.requestState.requests]
        };
        break;
      
      case 'UPDATE_REQUEST':
        this.requestState = {
          ...this.requestState,
          requests: this.requestState.requests.map(req => 
            req.id === action.request.id ? action.request : req
          ),
          selectedRequest: this.requestState.selectedRequest?.id === action.request.id 
            ? action.request 
            : this.requestState.selectedRequest
        };
        break;
      
      case 'DELETE_REQUEST':
        this.requestState = {
          ...this.requestState,
          requests: this.requestState.requests.filter(req => req.id !== action.requestId),
          selectedRequest: this.requestState.selectedRequest?.id === action.requestId 
            ? null 
            : this.requestState.selectedRequest
        };
        break;
      
      case 'SELECT_REQUEST':
        this.requestState = {
          ...this.requestState,
          selectedRequest: action.request
        };
        break;
      
      case 'SET_LOADING':
        this.requestState = {
          ...this.requestState,
          isLoading: action.isLoading
        };
        break;
      
      case 'SET_ERROR':
        this.requestState = {
          ...this.requestState,
          error: action.error
        };
        break;
      
      case 'CLEAR_ERROR':
        this.requestState = {
          ...this.requestState,
          error: null
        };
        break;
    }
    
    this.notifyListeners();
  }

  /**
   * Cria nova solicitação
   * @param requestData - Dados da solicitação
   * @returns Promise com a solicitação criada
   */
  async createRequest(requestData: Omit<AccessibilityRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<AccessibilityRequest> {
    this.dispatch({ type: 'SET_LOADING', isLoading: true });
    this.dispatch({ type: 'CLEAR_ERROR' });

    try {
      // Valida dados usando o modelo
      const tempRequest = RequestModel.createRequest(requestData);
      
      if (!RequestModel.validateRequest(tempRequest)) {
        throw new Error('Dados da solicitação inválidos');
      }

      // Adiciona à lista
      this.dispatch({ type: 'ADD_REQUEST', request: tempRequest });
      
      return tempRequest;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar solicitação';
      this.dispatch({ type: 'SET_ERROR', error: errorMessage });
      throw error;
    } finally {
      this.dispatch({ type: 'SET_LOADING', isLoading: false });
    }
  }

  /**
   * Atualiza status de uma solicitação
   * @param requestId - ID da solicitação
   * @param newStatus - Novo status
   * @returns Promise com a solicitação atualizada
   */
  async updateRequestStatus(requestId: number, newStatus: RequestStatus): Promise<AccessibilityRequest> {
    this.dispatch({ type: 'SET_LOADING', isLoading: true });
    this.dispatch({ type: 'CLEAR_ERROR' });

    try {
      const existingRequest = this.requestState.requests.find(req => req.id === requestId);
      
      if (!existingRequest) {
        throw new Error('Solicitação não encontrada');
      }

      // Atualiza status usando o modelo
      const updatedRequest = RequestModel.updateStatus(existingRequest, newStatus);
      
      if (!updatedRequest) {
        throw new Error('Transição de status inválida');
      }

      // Atualiza na lista
      this.dispatch({ type: 'UPDATE_REQUEST', request: updatedRequest });
      
      return updatedRequest;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar solicitação';
      this.dispatch({ type: 'SET_ERROR', error: errorMessage });
      throw error;
    } finally {
      this.dispatch({ type: 'SET_LOADING', isLoading: false });
    }
  }

  /**
   * Anexa arquivo a uma solicitação
   * @param requestId - ID da solicitação
   * @param fileType - Tipo do arquivo
   * @param fileData - Dados do arquivo
   * @returns Promise com a solicitação atualizada
   */
  async attachFileToRequest(
    requestId: number, 
    fileType: 'quote' | 'contract', 
    fileData: FileData
  ): Promise<AccessibilityRequest> {
    this.dispatch({ type: 'SET_LOADING', isLoading: true });
    this.dispatch({ type: 'CLEAR_ERROR' });

    try {
      const existingRequest = this.requestState.requests.find(req => req.id === requestId);
      
      if (!existingRequest) {
        throw new Error('Solicitação não encontrada');
      }

      // Anexa arquivo usando o modelo
      const updatedRequest = RequestModel.attachFile(existingRequest, fileType, fileData);
      
      // Atualiza status se necessário
      const nextStatus = RequestModel.getNextStatus(updatedRequest.status);
      if (nextStatus) {
        const finalRequest = RequestModel.updateStatus(updatedRequest, nextStatus);
        this.dispatch({ type: 'UPDATE_REQUEST', request: finalRequest });
        return finalRequest;
      } else {
        this.dispatch({ type: 'UPDATE_REQUEST', request: updatedRequest });
        return updatedRequest;
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao anexar arquivo';
      this.dispatch({ type: 'SET_ERROR', error: errorMessage });
      throw error;
    } finally {
      this.dispatch({ type: 'SET_LOADING', isLoading: false });
    }
  }

  /**
   * Atualiza status de desenvolvimento
   * @param requestId - ID da solicitação
   * @param developmentStatus - Novo status de desenvolvimento
   * @returns Promise com a solicitação atualizada
   */
  async updateDevelopmentStatus(
    requestId: number,
    developmentStatus: any
  ): Promise<AccessibilityRequest> {
    this.dispatch({ type: 'SET_LOADING', isLoading: true });
    this.dispatch({ type: 'CLEAR_ERROR' });

    try {
      const existingRequest = this.requestState.requests.find(req => req.id === requestId);
      
      if (!existingRequest) {
        throw new Error('Solicitação não encontrada');
      }

      const updatedRequest = RequestModel.updateDevelopmentStatus(existingRequest, developmentStatus);
      
      if (!updatedRequest) {
        throw new Error('Não é possível atualizar status de desenvolvimento nesta etapa');
      }

      this.dispatch({ type: 'UPDATE_REQUEST', request: updatedRequest });
      
      return updatedRequest;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar status de desenvolvimento';
      this.dispatch({ type: 'SET_ERROR', error: errorMessage });
      throw error;
    } finally {
      this.dispatch({ type: 'SET_LOADING', isLoading: false });
    }
  }

  /**
   * Seleciona uma solicitação
   * @param request - Solicitação a ser selecionada (ou null para deselecionar)
   */
  selectRequest(request: AccessibilityRequest | null): void {
    this.dispatch({ type: 'SELECT_REQUEST', request });
  }

  /**
   * Obtém todas as solicitações
   */
  getAllRequests(): AccessibilityRequest[] {
    return [...this.requestState.requests];
  }

  /**
   * Obtém solicitações por cliente
   * @param clientName - Nome do cliente
   */
  getRequestsByClient(clientName: string): AccessibilityRequest[] {
    return RequestModel.filterByClient(this.requestState.requests, clientName);
  }

  /**
   * Obtém solicitações ativas
   */
  getActiveRequests(): AccessibilityRequest[] {
    return RequestModel.filterActiveRequests(this.requestState.requests);
  }

  /**
   * Obtém solicitação por ID
   * @param requestId - ID da solicitação
   */
  getRequestById(requestId: number): AccessibilityRequest | null {
    return this.requestState.requests.find(req => req.id === requestId) || null;
  }

  /**
   * Obtém solicitação selecionada
   */
  getSelectedRequest(): AccessibilityRequest | null {
    return this.requestState.selectedRequest;
  }

  /**
   * Obtém estado atual
   */
  getState(): RequestState {
    return { ...this.requestState };
  }

  /**
   * Limpa mensagens de erro
   */
  clearError(): void {
    this.dispatch({ type: 'CLEAR_ERROR' });
  }

  /**
   * Obtém configuração de status
   */
  getStatusConfig() {
    return RequestModel.getStatusConfig();
  }

  /**
   * Calcula progresso de uma solicitação
   * @param requestId - ID da solicitação
   */
  calculateProgress(requestId: number): number {
    const request = this.getRequestById(requestId);
    return request ? RequestModel.calculateProgress(request) : 0;
  }

  /**
   * Valida se uma ação pode ser executada em uma solicitação
   * @param request - Solicitação
   * @param action - Ação a ser validada
   */
  canExecuteAction(request: AccessibilityRequest, action: string): boolean {
    switch (action) {
      case 'sendQuote':
        return request.status === 'Awaiting Quote';
      case 'attachContract':
        return request.status === 'Quote Sent';
      case 'startDevelopment':
        return request.status === 'Contract Sent';
      case 'complete':
        return request.status === 'In Development';
      default:
        return false;
    }
  }
}

// EXPANSÃO FUTURA:
// - Integração com API real
// - Upload de arquivos reais
// - Sistema de notificações
// - Histórico de mudanças
// - Filtros e busca avançada
// - Paginação
// - Exportação de relatórios
// - Integração com calendário
// - Sistema de comentários
