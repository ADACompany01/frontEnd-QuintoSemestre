/**
 * EvaluationModel - Modelo de dados para avaliações de acessibilidade
 * 
 * Responsabilidades:
 * - Gerenciar dados de avaliações de sites
 * - Definir critérios WCAG
 * - Calcular pontuações e sugestões de planos
 * - Regras de negócio para avaliações
 */

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
   * Simula avaliação de um site (mock para desenvolvimento)
   * @param siteUrl - URL do site a ser avaliado
   * @returns Promise com resultado da avaliação
   */
  static async evaluateSite(siteUrl: string): Promise<EvaluationResult> {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Gera score aleatório entre 30-95
    const score = Math.floor(Math.random() * (95 - 30 + 1)) + 30;
    
    // Seleciona problemas aleatórios
    const numIssues = Math.floor(Math.random() * 4) + 1; // 1-4 problemas
    const shuffledIssues = [...this.COMMON_ISSUES].sort(() => 0.5 - Math.random());
    const selectedIssues = shuffledIssues.slice(0, numIssues);

    return {
      score,
      issues: selectedIssues,
      siteUrl,
      evaluatedAt: new Date()
    };
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
}

// EXPANSÃO FUTURA:
// - Integração com ferramentas reais de avaliação (axe-core, WAVE, etc.)
// - Análise de contraste de cores
// - Detecção automática de problemas
// - Relatórios detalhados em PDF
// - Comparação com benchmarks
// - Histórico de avaliações
// - Integração com APIs de acessibilidade


