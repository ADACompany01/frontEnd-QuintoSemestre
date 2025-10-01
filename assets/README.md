# Assets - ADA Company

Esta pasta contém os recursos visuais do projeto ADA Company.

## Logo da ADA Company

Para adicionar a logo oficial da ADA Company:

1. **Coloque o arquivo da logo** nesta pasta (`assets/`)
2. **Nome sugerido**: `ada-logo.png` ou `ada-logo.jpg`
3. **Dimensões recomendadas**: 512x512 pixels (para alta qualidade)
4. **Formato**: PNG (com transparência) ou JPG

## Como atualizar no código

Após adicionar a imagem, atualize o arquivo `views/screens/LoginScreen.native.tsx`:

```typescript
// Substitua esta linha (linha 86):
source={{ uri: 'https://via.placeholder.com/120x120/6366f1/ffffff?text=ADA' }}

// Por esta:
source={require('../../assets/ada-logo.png')}
```

**⚠️ IMPORTANTE**: Certifique-se de que o arquivo `ada-logo.png` existe na pasta `assets/` antes de fazer essa alteração, senão o app dará erro!

## Estrutura recomendada

```
assets/
├── ada-logo.png          # Logo principal da ADA Company
├── ada-logo-small.png    # Versão pequena (se necessário)
└── README.md            # Este arquivo
```

## Notas

- A imagem será automaticamente redonda devido ao estilo `borderRadius: 60`
- O tamanho é 120x120 pixels com borda branca de 4px
- Inclui sombra para destaque visual
