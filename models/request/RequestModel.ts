/**
 * RequestModel - Modelo de dados para solicitações de acessibilidade
 * 
 * Responsabilidades:
 * - Gerenciar dados de solicitações
 * - Controlar fluxo de status das solicitações
 * - Validar transições de status
 * - Regras de negócio para solicitações
 */

export interface ChecklistItem {
  text: string;
  priority: number;
}

export interface FileData {
  name: string;
  url: string;
}

export interface AccessibilityRequest {
  id: number;
  clientName: string;
  site: string;
  plan: 'A' | 'AA' | 'AAA';
  status: RequestStatus;
  developmentStatus?: DevelopmentStatus;
  quoteFile?: FileData;
  contractFile?: FileData;
  contractSignedUrl?: string;
  selectedIssues: ChecklistItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type RequestStatus = 
  | 'Awaiting Quote' 
  | 'Quote Sent'
  | 'Quote Approved'
  | 'Contract Sent' 
  | 'Contract Signed'
  | 'In Development' 
  | 'Completed';

export type DevelopmentStatus = 
  | 'Analysis'
  | 'Development'
  | 'Testing'
  | 'Done';

export interface StatusConfig {
  steps: string[];
  map: Record<RequestStatus, string>;
  nextStatus: Record<RequestStatus, RequestStatus | null>;
  developmentSteps: string[];
}

export class RequestModel {
  // Configuração de status das solicitações
  private static readonly STATUS_CONFIG: StatusConfig = {
    steps: ["Solicitação enviada", "Orçamento", "Contrato", "Desenvolvimento", "Finalizado"],
    map: {
      'Awaiting Quote': "Solicitação enviada",
      'Quote Sent': "Orçamento",
      'Quote Approved': "Orçamento",
      'Contract Sent': "Contrato",
      'Contract Signed': "Contrato",
      'In Development': "Desenvolvimento",
      'Completed': "Finalizado",
    },
    nextStatus: {
      'Awaiting Quote': 'Quote Sent',
      'Quote Sent': 'Quote Approved',
      'Quote Approved': 'Contract Sent',
      'Contract Sent': 'Contract Signed',
      'Contract Signed': 'In Development',
      'In Development': 'Completed',
      'Completed': null, // Status final
    },
    developmentSteps: ["Em Análise", "Em Desenvolvimento", "Em Teste", "Concluído"]
  };

  // Dados mock para desenvolvimento
  private static initialRequests: AccessibilityRequest[] = [
    { 
      id: 1, 
      clientName: 'Tech Solutions Inc.', 
      site: 'techsolutions.com', 
      plan: 'AA', 
      status: 'Contract Sent', 
      quoteFile: { name: 'orcamento_tech.pdf', url: '#' }, 
      contractFile: { name: 'contrato_tech.pdf', url: '#' }, 
      selectedIssues: [
        { text: 'Contraste de texto baixo', priority: 5 }, 
        { text: 'Imagens sem texto alternativo', priority: 4 }
      ],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20')
    },
    { 
      id: 2, 
      clientName: 'Global Mart', 
      site: 'globalmart.com', 
      plan: 'AAA', 
      status: 'Quote Sent', 
      quoteFile: { name: 'orcamento_global.pdf', url: '#' }, 
      selectedIssues: [
        { text: 'Links sem descrição clara', priority: 3 }
      ],
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-19')
    },
    { 
      id: 3, 
      clientName: 'Creative Minds', 
      site: 'creativeminds.io', 
      plan: 'A', 
      status: 'In Development', 
      quoteFile: { name: 'orcamento_creative.pdf', url: '#' }, 
      contractFile: { name: 'contrato_creative.pdf', url: '#' }, 
      selectedIssues: [
        { text: 'Campos de formulário sem rótulo', priority: 5 }
      ],
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-22')
    },
    { 
      id: 4, 
      clientName: 'Alex Doe', 
      site: 'portfolio.com', 
      plan: 'A', 
      status: 'Completed', 
      quoteFile: { name: 'orcamento_alex.pdf', url: '#' }, 
      contractFile: { name: 'contrato_alex.pdf', url: '#' }, 
      selectedIssues: [
        { text: 'Contraste de texto baixo', priority: 4 }
      ],
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-25')
    },
    { 
      id: 5, 
      clientName: 'New Ventures', 
      site: 'newventures.co', 
      plan: 'AA', 
      status: 'Awaiting Quote', 
      selectedIssues: [],
      createdAt: new Date('2024-01-28'),
      updatedAt: new Date('2024-01-28')
    },
  ];

  /**
   * Obtém configuração de status
   */
  static getStatusConfig(): StatusConfig {
    return { ...this.STATUS_CONFIG };
  }

  /**
   * Obtém dados mock iniciais
   */
  static getInitialRequests(): AccessibilityRequest[] {
    return [...this.initialRequests];
  }

  /**
   * Cria nova solicitação
   * @param requestData - Dados da solicitação
   * @returns Nova solicitação com ID único
   */
  static createRequest(requestData: Omit<AccessibilityRequest, 'id' | 'createdAt' | 'updatedAt'>): AccessibilityRequest {
    const now = new Date();
    return {
      ...requestData,
      id: Date.now(),
      createdAt: now,
      updatedAt: now
    };
  }

  /**
   * Atualiza status de uma solicitação
   * @param request - Solicitação a ser atualizada
   * @param newStatus - Novo status
   * @returns Solicitação atualizada ou null se transição inválida
   */
  static updateStatus(request: AccessibilityRequest, newStatus: RequestStatus): AccessibilityRequest | null {
    if (!this.isValidStatusTransition(request.status, newStatus)) {
      return null;
    }

    return {
      ...request,
      status: newStatus,
      updatedAt: new Date()
    };
  }

  /**
   * Anexa arquivo a uma solicitação
   * @param request - Solicitação
   * @param fileType - Tipo do arquivo ('quote' | 'contract')
   * @param fileData - Dados do arquivo
   * @returns Solicitação atualizada
   */
  static attachFile(
    request: AccessibilityRequest, 
    fileType: 'quote' | 'contract', 
    fileData: FileData
  ): AccessibilityRequest {
    const updatedRequest = {
      ...request,
      updatedAt: new Date()
    };

    if (fileType === 'quote') {
      updatedRequest.quoteFile = fileData;
    } else if (fileType === 'contract') {
      updatedRequest.contractFile = fileData;
    }

    return updatedRequest;
  }

  /**
   * Valida transição de status
   * @param currentStatus - Status atual
   * @param newStatus - Novo status
   * @returns true se transição é válida
   */
  static isValidStatusTransition(currentStatus: RequestStatus, newStatus: RequestStatus): boolean {
    const nextStatus = this.STATUS_CONFIG.nextStatus[currentStatus];
    return nextStatus === newStatus;
  }

  /**
   * Obtém próximo status válido
   * @param currentStatus - Status atual
   * @returns Próximo status ou null se for status final
   */
  static getNextStatus(currentStatus: RequestStatus): RequestStatus | null {
    return this.STATUS_CONFIG.nextStatus[currentStatus];
  }

  /**
   * Filtra solicitações por cliente
   * @param requests - Lista de solicitações
   * @param clientName - Nome do cliente
   * @returns Solicitações do cliente
   */
  static filterByClient(requests: AccessibilityRequest[], clientName: string): AccessibilityRequest[] {
    return requests.filter(request => request.clientName === clientName);
  }

  /**
   * Filtra solicitações ativas (não finalizadas)
   * @param requests - Lista de solicitações
   * @returns Solicitações ativas
   */
  static filterActiveRequests(requests: AccessibilityRequest[]): AccessibilityRequest[] {
    return requests.filter(request => request.status !== 'Completed');
  }

  /**
   * Valida dados de solicitação
   * @param request - Objeto solicitação
   * @returns true se válido, false se inválido
   */
  static validateRequest(request: AccessibilityRequest): boolean {
    return !!(
      request &&
      request.id &&
      request.clientName &&
      request.site &&
      ['A', 'AA', 'AAA'].includes(request.plan) &&
      Object.keys(this.STATUS_CONFIG.map).includes(request.status) &&
      Array.isArray(request.selectedIssues)
    );
  }

  /**
   * Calcula progresso da solicitação (0-100)
   * @param request - Solicitação
   * @returns Percentual de progresso
   */
  static calculateProgress(request: AccessibilityRequest): number {
    const currentStep = this.STATUS_CONFIG.steps.indexOf(this.STATUS_CONFIG.map[request.status]);
    const totalSteps = this.STATUS_CONFIG.steps.length;
    return Math.round((currentStep / (totalSteps - 1)) * 100);
  }

  /**
   * Atualiza status de desenvolvimento
   * @param request - Solicitação
   * @param developmentStatus - Novo status de desenvolvimento
   * @returns Solicitação atualizada ou null se inválido
   */
  static updateDevelopmentStatus(
    request: AccessibilityRequest,
    developmentStatus: DevelopmentStatus
  ): AccessibilityRequest | null {
    if (request.status !== 'In Development') {
      return null;
    }

    const updated = {
      ...request,
      developmentStatus,
      updatedAt: new Date()
    };

    // Se marcar como Done, muda status geral para Completed
    if (developmentStatus === 'Done') {
      updated.status = 'Completed';
    }

    return updated;
  }

  /**
   * Obtém descrição do status de desenvolvimento
   * @param status - Status de desenvolvimento
   * @returns Descrição em português
   */
  static getDevelopmentStatusLabel(status: DevelopmentStatus): string {
    const labels: Record<DevelopmentStatus, string> = {
      'Analysis': 'Em Análise',
      'Development': 'Em Desenvolvimento',
      'Testing': 'Em Teste',
      'Done': 'Concluído'
    };
    return labels[status];
  }
}

// EXPANSÃO FUTURA:
// - Integração com API real
// - Sistema de notificações
// - Histórico de mudanças de status
// - Upload de arquivos reais
// - Sistema de comentários
// - Integração com calendário
// - Relatórios e analytics
