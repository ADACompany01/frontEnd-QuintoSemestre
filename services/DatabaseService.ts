/**
 * DatabaseService - Serviço de banco de dados SQLite
 * 
 * Responsabilidades:
 * - Configuração e inicialização do banco SQLite
 * - Criação de tabelas necessárias
 * - Operações básicas de banco de dados
 * - Gerenciamento de conexões
 */

import * as SQLite from 'expo-sqlite';

export interface DatabaseResult {
  success: boolean;
  data?: any;
  error?: string;
}

export class DatabaseService {
  private static instance: DatabaseService;
  private db: SQLite.SQLiteDatabase | null = null;
  private isInitialized = false;

  private constructor() {}

  /**
   * Singleton pattern para garantir uma única instância
   */
  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * Inicializa o banco de dados e cria as tabelas necessárias
   */
  async initialize(): Promise<DatabaseResult> {
    try {
      if (this.isInitialized && this.db) {
        return { success: true, data: 'Database already initialized' };
      }

      this.db = await SQLite.openDatabaseAsync('ada_company.db');
      
      if (!this.db) {
        throw new Error('Failed to open database');
      }

      await this.createTables();
      this.isInitialized = true;

      console.log('Database initialized successfully');
      return { success: true, data: 'Database initialized' };
    } catch (error) {
      console.error('Database initialization error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Cria todas as tabelas necessárias
   */
  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Tabela de usuários
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL CHECK (type IN ('client', 'employee')),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        photo_path TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabela de imagens
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        mime_type TEXT NOT NULL,
        category TEXT NOT NULL CHECK (category IN ('user_photo', 'company_logo', 'request_document', 'other')),
        user_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );
    `);

    // Tabela de configurações da empresa
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS company_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        setting_key TEXT UNIQUE NOT NULL,
        setting_value TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Inserir dados iniciais
    await this.insertInitialData();
  }

  /**
   * Insere dados iniciais no banco
   */
  private async insertInitialData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Inserir usuários mock
    await this.db.runAsync(`
      INSERT OR IGNORE INTO users (type, name, email, password, photo_path) VALUES
      ('client', 'Alex Doe', 'client@example.com', 'password123', NULL),
      ('employee', 'Jane Smith', 'employee@example.com', 'password123', NULL);
    `);

    // Inserir configurações da empresa
    await this.db.runAsync(`
      INSERT OR IGNORE INTO company_settings (setting_key, setting_value) VALUES
      ('company_name', 'ADA Company'),
      ('company_logo_path', NULL),
      ('app_version', '1.0.0');
    `);
  }

  /**
   * Executa uma query SQL
   */
  async query(sql: string, params: any[] = []): Promise<DatabaseResult> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const result = await this.db.getAllAsync(sql, params);
      return { success: true, data: result };
    } catch (error) {
      console.error('Query error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Executa uma operação de inserção/atualização/exclusão
   */
  async execute(sql: string, params: any[] = []): Promise<DatabaseResult> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const result = await this.db.runAsync(sql, params);
      return { success: true, data: result };
    } catch (error) {
      console.error('Execute error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Obtém uma única linha de resultado
   */
  async getFirst(sql: string, params: any[] = []): Promise<DatabaseResult> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const result = await this.db.getFirstAsync(sql, params);
      return { success: true, data: result };
    } catch (error) {
      console.error('GetFirst error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Inicia uma transação
   */
  async transaction(callback: () => Promise<void>): Promise<DatabaseResult> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      await this.db.withTransactionAsync(callback);
      return { success: true };
    } catch (error) {
      console.error('Transaction error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Fecha a conexão com o banco
   */
  async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
      this.isInitialized = false;
    }
  }

  /**
   * Verifica se o banco está inicializado
   */
  isReady(): boolean {
    return this.isInitialized && this.db !== null;
  }
}

// EXPANSÃO FUTURA:
// - Migrations automáticas
// - Backup e restore
// - Índices para performance
// - Cache de queries
// - Logging de operações
// - Validação de schema

