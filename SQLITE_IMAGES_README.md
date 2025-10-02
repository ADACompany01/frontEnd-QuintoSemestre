# Sistema SQLite para Imagens - ADA Company App

Este documento descreve a implementação do sistema SQLite para gerenciamento de imagens no aplicativo ADA Company.

## 📋 Visão Geral

O sistema implementado permite:
- Armazenamento local de imagens usando SQLite
- Gerenciamento de fotos de usuários e logos da empresa
- Operações CRUD completas para imagens
- Validação e conversão de formatos de imagem
- Interface de usuário para upload e gerenciamento

## 🏗️ Arquitetura

### Estrutura de Arquivos

```
├── services/
│   └── DatabaseService.ts          # Serviço principal do SQLite
├── models/
│   ├── image/
│   │   └── ImageModel.ts           # Modelo de dados para imagens
│   └── user/
│       └── UserModel.ts             # Modelo atualizado para SQLite
├── controllers/
│   └── image/
│       └── ImageController.ts      # Controller para operações de imagem
├── utils/
│   └── ImageUtils.ts               # Utilitários para manipulação de imagens
└── views/
    └── components/
        └── ImageUploadComponent.native.tsx  # Componente de upload
```

## 🗄️ Banco de Dados

### Tabelas Criadas

#### 1. `users`
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL CHECK (type IN ('client', 'employee')),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  photo_path TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. `images`
```sql
CREATE TABLE images (
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
```

#### 3. `company_settings`
```sql
CREATE TABLE company_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Como Usar

### 1. Inicialização

O sistema é inicializado automaticamente no `App.tsx`:

```typescript
const imageController = ImageController.getInstance();
await imageController.initialize();
```

### 2. Upload de Imagens

```typescript
import { ImageController } from './controllers';

const imageController = ImageController.getInstance();

// Upload de uma imagem
const result = await imageController.uploadImage(
  fileUri,           // URI do arquivo
  'user_photo',      // Categoria
  userId,            // ID do usuário (opcional)
  originalFilename   // Nome original (opcional)
);

if (result.success) {
  console.log('Imagem salva:', result.data);
} else {
  console.error('Erro:', result.error);
}
```

### 3. Buscar Imagens

```typescript
// Buscar imagens por categoria
const images = await imageController.getImagesByCategory('user_photo');

// Buscar imagens por usuário
const userImages = await imageController.getImagesByUser(userId);

// Buscar todas as imagens
const allImages = await imageController.getAllImages();
```

### 4. Usar o Sistema de Upload de Foto

```typescript
// No ClientDashboard - aba Perfil
const handlePhotoUpload = async () => {
  // Mostra opções: Galeria ou Câmera
  Alert.alert(
    'Selecionar Foto',
    'Escolha como deseja adicionar sua foto de perfil',
    [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Galeria', onPress: () => selectImageFromGallery() },
      { text: 'Câmera', onPress: () => selectImageFromCamera() },
    ]
  );
};

// Selecionar da galeria
const selectImageFromGallery = async () => {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (permissionResult.granted) {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    // Processar imagem selecionada...
  }
};

// Tirar foto com a câmera
const selectImageFromCamera = async () => {
  const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
  if (permissionResult.granted) {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    // Processar foto tirada...
  }
};
```

## 📱 Categorias de Imagem

- `user_photo`: Fotos de perfil dos usuários
- `company_logo`: Logos da empresa ADA
- `request_document`: Documentos relacionados a solicitações
- `other`: Outras imagens

## 🔧 Utilitários Disponíveis

### ImageUtils

```typescript
import { ImageUtils } from './utils/ImageUtils';

// Validar tipo de imagem
const isValid = ImageUtils.isValidImageType('image/jpeg');

// Gerar nome único
const filename = ImageUtils.generateUniqueFilename('photo.jpg', 'user_photo');

// Converter para base64
const base64 = await ImageUtils.convertToBase64(fileUri);

// Obter informações do arquivo
const info = await ImageUtils.getImageInfo(fileUri);

// Formatar tamanho do arquivo
const size = ImageUtils.formatFileSize(1024000); // "1.0 MB"
```

## 🎯 Exemplo Completo

### Dashboard do Cliente

O `ClientDashboard` agora inclui uma aba "Imagens" que permite:

1. **Upload de fotos de perfil**
2. **Visualização de imagens existentes**
3. **Gerenciamento de arquivos**

```typescript
// No ClientDashboard
case 'imagens':
  return (
    <ScrollView style={styles.content}>
      <ImageUploadComponent
        category="user_photo"
        userId={user.id}
        onImageUploaded={handleImageUploaded}
        onError={handleError}
      />
      
      {/* Lista de imagens existentes */}
      {userImages.map(image => (
        <ImageItem key={image.id} image={image} />
      ))}
    </ScrollView>
  );
```

## 🔒 Segurança e Validação

### Validações Implementadas

- **Tipo de arquivo**: Apenas imagens válidas (JPEG, PNG, GIF, WebP, etc.)
- **Tamanho máximo**: 10MB por arquivo
- **Categorias**: Validação de categorias permitidas
- **Dados de usuário**: Validação de email e senha

### Limpeza Automática

```typescript
// Limpar arquivos temporários antigos
await ImageUtils.cleanupTempFiles(24); // Remove arquivos com mais de 24h
```

## 📊 Estatísticas

```typescript
// Obter estatísticas de imagens
const stats = await imageController.getImageStats();
console.log(stats.data);
// Output: [{ category: 'user_photo', count: 5, total_size: 2048000, avg_size: 409600 }]
```

## 🚧 Expansões Futuras

### Funcionalidades Planejadas

- [ ] **Compressão automática** de imagens
- [ ] **Geração de thumbnails**
- [ ] **Cache de imagens** para performance
- [ ] **Sincronização com servidor** remoto
- [ ] **Backup automático** de imagens
- [ ] **Análise de conteúdo** usando IA
- [ ] **Watermark automático**
- [ ] **Rotação de imagens**

### Melhorias Técnicas

- [ ] **Migrations automáticas** do banco
- [ ] **Índices para performance**
- [ ] **Logging de operações**
- [ ] **Validação de schema**
- [ ] **Transações otimizadas**

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de inicialização do banco**
   - Verificar se o `expo-sqlite` está instalado
   - Verificar permissões de arquivo

2. **Falha no upload**
   - Verificar se o arquivo existe
   - Verificar tamanho e tipo do arquivo
   - Verificar espaço em disco

3. **Imagens não aparecem**
   - Verificar se o caminho do arquivo está correto
   - Verificar se o arquivo não foi deletado

4. **Erro de API depreciada do expo-file-system**
   - Usar `expo-file-system/legacy` para compatibilidade
   - Usar `FileSystem.EncodingType.Base64` ao invés de strings

### Correções Aplicadas

- ✅ **API Legacy**: Migrado para `expo-file-system/legacy`
- ✅ **Encoding**: Corrigido para usar `FileSystem.EncodingType.Base64`
- ✅ **Diretórios**: Usando `FileSystem.documentDirectory` e `FileSystem.cacheDirectory`
- ✅ **Cache**: Limpeza do cache do Metro com `--clear`

### Logs Úteis

```typescript
// Habilitar logs detalhados
console.log('Database state:', imageController.getState());
console.log('Image stats:', await imageController.getImageStats());
```

## 📝 Notas Importantes

- O sistema usa **SQLite local** - dados ficam no dispositivo
- Imagens são armazenadas no **diretório de documentos** do app
- **Metadados** são salvos no banco SQLite
- Sistema é **compatível** com React Native e Expo
- **Thread-safe** para operações concorrentes

## 🔐 Permissões Necessárias

Para funcionar corretamente, o app precisa das seguintes permissões:

### Android (app.json)
```json
{
  "expo": {
    "android": {
      "permissions": [
        "android.permission.CAMERA",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE"
      ]
    }
  }
}
```

### iOS (app.json)
```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSCameraUsageDescription": "Este app precisa acessar a câmera para tirar fotos de perfil",
        "NSPhotoLibraryUsageDescription": "Este app precisa acessar a galeria para selecionar fotos de perfil"
      }
    }
  }
}
```

---

**Desenvolvido para ADA Company** 🚀
