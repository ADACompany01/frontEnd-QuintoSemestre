/**
 * UserModel - Modelo de dados para usuários
 * 
 * Responsabilidades:
 * - Gerenciar dados de usuários (clientes e funcionários)
 * - Validar tipos de usuário
 * - Fornecer dados mock para desenvolvimento
 * - Regras de negócio relacionadas a usuários
 */

export interface User {
  type: 'client' | 'employee';
  name: string;
  email: string;
  photo: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export class UserModel {
  // Dados mock para desenvolvimento
  // Em produção, isso seria substituído por chamadas à API
  private static mockUsers: Record<string, User> = {
    'client@example.com': { 
      type: 'client', 
      name: 'Alex Doe', 
      email: 'client@example.com',
      photo: 'https://picsum.photos/id/237/200' 
    },
    'employee@example.com': { 
      type: 'employee', 
      name: 'Jane Smith', 
      email: 'employee@example.com',
      photo: 'https://picsum.photos/id/1/200' 
    },
  };

  /**
   * Valida credenciais de login
   * @param credentials - Email e senha do usuário
   * @returns Usuário se válido, null se inválido
   */
  static validateLogin(credentials: LoginCredentials): User | null {
    const { email, password } = credentials;
    
    // Validação básica (em produção, senha seria verificada com hash)
    if (!email || !password) {
      return null;
    }

    const user = this.mockUsers[email];
    if (user) {
      return user;
    }

    return null;
  }

  /**
   * Busca usuário por email
   * @param email - Email do usuário
   * @returns Usuário se encontrado, null se não encontrado
   */
  static getUserByEmail(email: string): User | null {
    return this.mockUsers[email] || null;
  }

  /**
   * Verifica se usuário é cliente
   * @param user - Objeto usuário
   * @returns true se for cliente, false caso contrário
   */
  static isClient(user: User): boolean {
    return user.type === 'client';
  }

  /**
   * Verifica se usuário é funcionário
   * @param user - Objeto usuário
   * @returns true se for funcionário, false caso contrário
   */
  static isEmployee(user: User): boolean {
    return user.type === 'employee';
  }

  /**
   * Obtém dados mock para desenvolvimento
   * @returns Objeto com usuários mock
   */
  static getMockUsers(): Record<string, User> {
    return { ...this.mockUsers };
  }

  /**
   * Valida dados de usuário
   * @param user - Objeto usuário
   * @returns true se válido, false se inválido
   */
  static validateUser(user: User): boolean {
    return !!(
      user &&
      user.name &&
      user.email &&
      user.photo &&
      (user.type === 'client' || user.type === 'employee')
    );
  }
}

// EXPANSÃO FUTURA:
// - Integração com API real de autenticação
// - Sistema de permissões e roles
// - Gestão de sessões
// - Recuperação de senha
// - Validação de email
// - Upload de fotos de perfil


