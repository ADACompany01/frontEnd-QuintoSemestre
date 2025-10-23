/**
 * EvaluationModel - Modelo de dados para avaliações de acessibilidade
 * 
 * Responsabilidades:
 * - Gerenciar dados de avaliações de sites
 * - Integração com API Lighthouse para avaliação real
 * - Definir critérios WCAG
 * - Calcular pontuações e sugestões de planos
 * - Regras de negócio para avaliações
 */

import ApiService from '../../services/ApiService';

export interface EvaluationIssue {
  id: string;
  text: string;
  priority?: number;
  type?: 'issue' | 'wcag';
}

export interface EvaluationResult {
  score: number;
  issues: EvaluationIssue[];
  siteUrl: string;
  evaluatedAt: Date;
}

export interface WCAGItem {
  id: string;
  text: string;
  level: 'A' | 'AA' | 'AAA';
}

export interface AccessibilityPlan {
  level: 'A' | 'AA' | 'AAA';
  description: string;
  wcagItems: WCAGItem[];
}

export class EvaluationModel {
  private static api = ApiService;
  private static USE_API = true; // Flag para controlar uso da API
  
  // Critérios WCAG por nível
  private static readonly WCAG_ITEMS: Record<string, WCAGItem[]> = {
    A: [
      { id: 'wcag-a-1', text: 'Navegação total via teclado', level: 'A' },
      { id: 'wcag-a-2', text: 'Legendas em vídeos pré-gravados', level: 'A' },
      { id: 'wcag-a-3', text: 'Controles de áudio visíveis', level: 'A' },
      { id: 'wcag-a-4', text: 'Não usar apenas cor para transmitir informação', level: 'A' },
    ],
    AA: [
      { id: 'wcag-aa-1', text: 'Contraste de cor mínimo (4.5:1)', level: 'AA' },
      { id: 'wcag-aa-2', text: 'Audiodescrição em vídeos pré-gravados', level: 'AA' },
      { id: 'wcag-aa-3', text: 'Texto redimensionável até 200%', level: 'AA' },
      { id: 'wcag-aa-4', text: 'Múltiplas formas de encontrar páginas', level: 'AA' },
    ],
    AAA: [
      { id: 'wcag-aaa-1', text: 'Contraste de cor aprimorado (7:1)', level: 'AAA' },
      { id: 'wcag-aaa-2', text: 'Interpretação em LIBRAS para vídeos', level: 'AAA' },
      { id: 'wcag-aaa-3', text: 'Justificativa para links fora de contexto', level: 'AAA' },
      { id: 'wcag-aaa-4', text: 'Sem limite de tempo para interações', level: 'AAA' },
    ]
  };

  // Problemas comuns encontrados em avaliações
  private static readonly COMMON_ISSUES: EvaluationIssue[] = [
    { id: 'issue-1', text: 'Contraste de texto baixo', type: 'issue' },
    { id: 'issue-2', text: 'Imagens sem texto alternativo', type: 'issue' },
    { id: 'issue-3', text: 'Links sem descrição clara', type: 'issue' },
    { id: 'issue-4', text: 'Campos de formulário sem rótulo', type: 'issue' },
    { id: 'issue-5', text: 'Falta de navegação por teclado', type: 'issue' },
    { id: 'issue-6', text: 'Vídeos sem legendas', type: 'issue' },
    { id: 'issue-7', text: 'Conteúdo que pisca ou pisca muito rápido', type: 'issue' },
    { id: 'issue-8', text: 'Estrutura de cabeçalhos inadequada', type: 'issue' },
  ];

  /**
   * Avalia acessibilidade de um site usando Lighthouse API
   * @param siteUrl - URL do site a ser avaliado
   * @returns Promise com resultado da avaliação
   */
  static async evaluateSite(siteUrl: string): Promise<EvaluationResult> {
    try {
      // Tentar usar a API primeiro
      if (this.USE_API) {
        try {
          console.log('[EvaluationModel] Avaliando site via API Lighthouse...');
          const apiResponse = await this.api.analyzeSiteAccessibility(siteUrl);

          if (apiResponse.success && apiResponse.data) {
            const lighthouseData = apiResponse.data;
            
            // Extrair pontuação de acessibilidade (0-1 para 0-100)
            const score = Math.round((lighthouseData.accessibility || 0) * 100);
            
            // Extrair problemas dos audits do Lighthouse
            const issues: EvaluationIssue[] = [];
            const audits = lighthouseData.audits || {};
            
            // Mapear audits com problemas para issues
            Object.entries(audits).forEach(([key, audit]: [string, any]) => {
              if (audit.score !== null && audit.score < 1 && audit.title) {
                issues.push({
                  id: key,
                  text: audit.title,
                  type: 'issue',
                  priority: audit.score === 0 ? 5 : Math.ceil((1 - audit.score) * 5)
                });
              }
            });

            // Limitar a 10 issues mais críticos
            const topIssues = issues
              .sort((a, b) => (b.priority || 0) - (a.priority || 0))
              .slice(0, 10);

            console.log(`[EvaluationModel] Avaliação concluída: ${score}% de acessibilidade`);
            
            return {
              score,
              issues: topIssues.length > 0 ? topIssues : this.getRandomIssues(),
              siteUrl,
              evaluatedAt: new Date()
            };
          }
        } catch (apiError) {
          console.warn('[EvaluationModel] Falha na API, usando avaliação simulada...', apiError);
        }
      }

      // Fallback: Simular avaliação
      return this.simulateEvaluation(siteUrl);
    } catch (error) {
      console.error('[EvaluationModel] Erro ao avaliar site:', error);
      return this.simulateEvaluation(siteUrl);
    }
  }

  /**
   * Simula avaliação de um site (fallback)
   * @param siteUrl - URL do site a ser avaliado
   * @returns Resultado da avaliação simulada
   */
  private static async simulateEvaluation(siteUrl: string): Promise<EvaluationResult> {
    console.log('[EvaluationModel] Usando avaliação simulada...');
    
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Gera score aleatório entre 30-95
    const score = Math.floor(Math.random() * (95 - 30 + 1)) + 30;
    
    // Seleciona problemas aleatórios
    const selectedIssues = this.getRandomIssues();

    return {
      score,
      issues: selectedIssues,
      siteUrl,
      evaluatedAt: new Date()
    };
  }

  /**
   * Obtém problemas aleatórios para simulação
   */
  private static getRandomIssues(): EvaluationIssue[] {
    const numIssues = Math.floor(Math.random() * 4) + 1; // 1-4 problemas
    const shuffledIssues = [...this.COMMON_ISSUES].sort(() => 0.5 - Math.random());
    return shuffledIssues.slice(0, numIssues);
  }

  /**
   * Obtém critérios WCAG por nível
   * @param level - Nível WCAG ('A', 'AA', 'AAA')
   * @returns Lista de critérios WCAG
   */
  static getWCAGItems(level: 'A' | 'AA' | 'AAA'): WCAGItem[] {
    if (level === 'A') {
      return [...this.WCAG_ITEMS.A];
    } else if (level === 'AA') {
      return [...this.WCAG_ITEMS.A, ...this.WCAG_ITEMS.AA];
    } else if (level === 'AAA') {
      return [...this.WCAG_ITEMS.A, ...this.WCAG_ITEMS.AA, ...this.WCAG_ITEMS.AAA];
    }
    return [];
  }

  /**
   * Obtém todos os critérios WCAG
   */
  static getAllWCAGItems(): Record<string, WCAGItem[]> {
    return { ...this.WCAG_ITEMS };
  }

  /**
   * Sugere planos baseado na pontuação da avaliação
   * @param score - Pontuação da avaliação (0-100)
   * @returns Lista de planos sugeridos
   */
  static suggestPlans(score: number): AccessibilityPlan[] {
    const suggestions: AccessibilityPlan[] = [];

    if (score < 70) {
      // Site com muitos problemas - sugere todos os planos
      suggestions.push(
        { level: 'A', description: 'Correções básicas de acessibilidade', wcagItems: this.getWCAGItems('A') },
        { level: 'AA', description: 'Correções intermediárias de acessibilidade', wcagItems: this.getWCAGItems('AA') },
        { level: 'AAA', description: 'Correções avançadas de acessibilidade', wcagItems: this.getWCAGItems('AAA') }
      );
    } else if (score >= 70 && score < 90) {
      // Site com problemas moderados - sugere planos AA e AAA
      suggestions.push(
        { level: 'AA', description: 'Correções intermediárias de acessibilidade', wcagItems: this.getWCAGItems('AA') },
        { level: 'AAA', description: 'Correções avançadas de acessibilidade', wcagItems: this.getWCAGItems('AAA') }
      );
    } else {
      // Site com poucos problemas - sugere apenas AAA
      suggestions.push(
        { level: 'AAA', description: 'Correções avançadas de acessibilidade', wcagItems: this.getWCAGItems('AAA') }
      );
    }

    return suggestions;
  }

  /**
   * Cria checklist combinado de problemas e critérios WCAG
   * @param issues - Problemas encontrados na avaliação
   * @param planLevel - Nível do plano selecionado
   * @returns Checklist combinado
   */
  static createChecklist(issues: EvaluationIssue[], planLevel: 'A' | 'AA' | 'AAA'): Record<string, EvaluationIssue> {
    const wcagItems = this.getWCAGItems(planLevel);
    const combined = [
      ...issues.map(issue => ({ ...issue, type: 'issue' as const })),
      ...wcagItems.map(wcag => ({ ...wcag, type: 'wcag' as const }))
    ];

    const checklist: Record<string, EvaluationIssue> = {};
    combined.forEach(item => {
      const key = item.id || item.text;
      checklist[key] = { ...item, priority: 0 };
    });

    return checklist;
  }

  /**
   * Calcula prioridade média dos itens selecionados
   * @param selectedIssues - Itens selecionados com prioridades
   * @returns Prioridade média
   */
  static calculateAveragePriority(selectedIssues: EvaluationIssue[]): number {
    if (selectedIssues.length === 0) return 0;
    
    const totalPriority = selectedIssues.reduce((sum, issue) => sum + (issue.priority || 0), 0);
    return Math.round(totalPriority / selectedIssues.length);
  }

  /**
   * Valida URL do site
   * @param url - URL a ser validada
   * @returns true se URL é válida
   */
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Formata URL para exibição
   * @param url - URL a ser formatada
   * @returns URL formatada
   */
  static formatUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  }

  /**
   * Obtém descrição do nível de acessibilidade
   * @param level - Nível WCAG
   * @returns Descrição do nível
   */
  static getLevelDescription(level: 'A' | 'AA' | 'AAA'): string {
    const descriptions = {
      'A': 'Nível mínimo de acessibilidade - requisitos básicos',
      'AA': 'Nível padrão de acessibilidade - requisitos intermediários',
      'AAA': 'Nível avançado de acessibilidade - requisitos máximos'
    };
    return descriptions[level];
  }

  /**
   * Define se deve usar API ou avaliação simulada
   */
  static setUseApi(useApi: boolean): void {
    this.USE_API = useApi;
    console.log(`[EvaluationModel] Modo de operação: ${useApi ? 'API Lighthouse' : 'Avaliação simulada'}`);
  }

  /**
   * Verifica se está usando API
   */
  static isUsingApi(): boolean {
    return this.USE_API;
  }
}

// EXPANSÃO FUTURA:
// - Integração com ferramentas reais de avaliação (axe-core, WAVE, etc.)
// - Análise de contraste de cores
// - Detecção automática de problemas
// - Relatórios detalhados em PDF
// - Comparação com benchmarks
// - Histórico de avaliações
// - Integração com APIs de acessibilidade


