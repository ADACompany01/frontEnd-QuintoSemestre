# ADA Company - React Native App

Uma aplicação React Native desenvolvida com Expo para avaliação e gestão de acessibilidade web, seguindo o padrão arquitetural **MVC (Model-View-Controller)**.

## 🏗️ Arquitetura MVC

O projeto foi refatorado para seguir o padrão MVC, organizando o código em camadas bem definidas:

### 📁 Estrutura do Projeto

```
├── models/                    # Camada de Dados e Regras de Negócio
│   ├── user/
│   │   └── UserModel.ts      # Modelo de usuários e autenticação
│   ├── request/
│   │   └── RequestModel.ts   # Modelo de solicitações de acessibilidade
│   ├── evaluation/
│   │   └── EvaluationModel.ts # Modelo de avaliações de sites
│   └── index.ts              # Exportações centralizadas dos models
│
├── controllers/               # Camada de Controle e Lógica de Negócio
│   ├── auth/
│   │   └── AuthController.ts # Controlador de autenticação
│   ├── request/
│   │   └── RequestController.ts # Controlador de solicitações
│   ├── evaluation/
│   │   └── EvaluationController.ts # Controlador de avaliações
│   └── index.ts              # Exportações centralizadas dos controllers
│
├── views/                     # Camada de Apresentação (UI)
│   ├── components/            # Componentes reutilizáveis
│   │   ├── Icons.native.tsx  # Ícones SVG
│   │   ├── StarRating.native.tsx # Componente de avaliação por estrelas
│   │   ├── CircularProgress.native.tsx # Componente de progresso circular
│   │   └── Timeline.native.tsx # Componente de timeline
│   ├── screens/               # Telas da aplicação
│   │   ├── LoginScreen.native.tsx # Tela de login
│   │   ├── ClientDashboard.native.tsx # Dashboard do cliente
│   │   ├── EmployeeDashboard.native.tsx # Dashboard do funcionário
│   │   ├── EvaluationScreen.native.tsx # Tela de avaliação
│   │   └── PlanSelectionScreen.native.tsx # Tela de seleção de plano
│   └── index.ts              # Exportações centralizadas das views
│
├── App.tsx                    # Componente principal da aplicação
├── index.js                   # Ponto de entrada para React Native
├── app.json                   # Configuração do Expo
└── package.json               # Dependências e scripts
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app (para testar no celular)

### Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd ada-company-app

# Instale as dependências
npm install

# Execute o projeto
npx expo start
```

### Comandos Disponíveis

```bash
# Iniciar o servidor de desenvolvimento
npx expo start

# Executar no Android
npx expo start --android

# Executar no iOS
npx expo start --ios

# Executar na web
npx expo start --web

# Build para produção
npx expo build
```

## 📱 Plataformas Suportadas

- ✅ **Android** - App nativo Android
- ✅ **iOS** - App nativo iOS
- ✅ **Web** - Funciona no navegador
- ✅ **Expo Go** - App Expo Go para desenvolvimento

## 🔑 Credenciais de Teste

- **Cliente**: `client@example.com`
- **Funcionário**: `employee@example.com`
- **Senha**: Qualquer senha

## 🎯 Funcionalidades

### ✅ **Autenticação**
- Login com validação
- Diferentes tipos de usuário (cliente/funcionário)
- Gerenciamento de sessão

### ✅ **Avaliação de Sites**
- Simulação de avaliação de acessibilidade
- Sugestão de planos baseada na pontuação
- Checklist WCAG por nível (A, AA, AAA)

### ✅ **Gestão de Solicitações**
- Criação de solicitações por clientes
- Workflow de status (Solicitação → Orçamento → Contrato → Desenvolvimento → Finalizado)
- Upload de arquivos (orçamento e contrato)
- Timeline de acompanhamento

### ✅ **Dashboards Diferenciados**
- **Cliente**: Avaliar sites, acompanhar solicitações, ver perfil
- **Funcionário**: Gerenciar solicitações, enviar arquivos, atualizar status

## 🎨 Design e UX

- **Design responsivo** para diferentes tamanhos de tela
- **Cores modernas** com gradientes e sombras
- **Animações suaves** para melhor experiência
- **Interface intuitiva** com feedback visual
- **Acessibilidade** seguindo padrões WCAG

## 🔧 Tecnologias Utilizadas

- **React Native** - Framework principal
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Tipagem estática
- **React Native SVG** - Ícones vetoriais
- **React Native Safe Area Context** - Área segura
- **Padrão MVC** - Arquitetura organizacional

## 📋 Scripts do Package.json

```json
{
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web"
}
```

## 🔮 Próximas Implementações

### **Models**
- Integração com APIs reais
- Sistema de cache
- Validação avançada

### **Controllers**
- Middleware de autenticação
- Interceptadores de requisições
- Sistema de eventos globais

### **Views**
- Sistema de roteamento com React Navigation
- Lazy loading de componentes
- Error boundaries
- PWA (Progressive Web App)

### **Funcionalidades**
- Integração com ferramentas reais de avaliação
- Sistema de notificações push
- Relatórios em PDF
- Integração com calendário
- Sistema de comentários

## 📝 Padrões de Commit

Este projeto segue o padrão de commits convencionais:

```
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
style: ajusta formatação
refactor: refatora código
test: adiciona testes
chore: tarefas de manutenção
```

### Exemplos:

```bash
git commit -m "feat: implementa sistema de avaliação de sites"
git commit -m "fix: corrige bug no login de funcionários"
git commit -m "docs: atualiza README com instruções de instalação"
git commit -m "refactor: reorganiza estrutura MVC"
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Equipe

- **Empresa**: ADA Company
- **Arquitetura**: Padrão MVC
- **Framework**: React Native + Expo

---

**Desenvolvido com ❤️ pela ADA Company usando React Native e Expo**