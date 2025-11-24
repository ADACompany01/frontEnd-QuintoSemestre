# 🔧 Configuração Automática da API

## ✅ Solução Implementada

O app agora **detecta automaticamente** a URL da API, funcionando em **qualquer máquina** sem precisar configurar IP manualmente!

## 🎯 Como Funciona

### Detecção Automática (Ordem de Prioridade)

1. **Variável de Ambiente** (se definida)
   - `EXPO_PUBLIC_API_URL` - permite override manual se necessário

2. **Web** (navegador)
   - Sempre usa: `http://localhost:3000`

3. **Mobile - Desenvolvimento**
   - Detecta automaticamente o IP do Expo
   - Usa o mesmo IP que o Expo usa para conectar

4. **Fallback**
   - Usa: `http://adacompany.duckdns.org:3000`
   - Funciona se o backend estiver acessível via internet

## 📝 Configuração Opcional

### Usando Variável de Ambiente (Opcional)

Se quiser forçar uma URL específica, crie um arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.7:3000
```

Ou exporte antes de rodar:

```bash
# Windows PowerShell
$env:EXPO_PUBLIC_API_URL="http://192.168.1.7:3000"
npx expo start

# Linux/Mac
export EXPO_PUBLIC_API_URL="http://192.168.1.7:3000"
npx expo start
```

## 🚀 Vantagens

✅ **Funciona em qualquer máquina** - não precisa configurar IP  
✅ **Detecção automática** - usa o IP do Expo quando disponível  
✅ **Web sempre funciona** - usa localhost automaticamente  
✅ **Flexível** - permite override via variável de ambiente  
✅ **Fallback inteligente** - usa duckdns.org se disponível  

## 🔍 Verificar URL Usada

O app mostra no console qual URL está sendo usada:

```
[API] IP do Expo detectado automaticamente: http://192.168.1.7:3000
```

ou

```
[API] Usando URL padrão (duckdns): http://adacompany.duckdns.org:3000
```

## ⚠️ Troubleshooting

### Backend não acessível via duckdns.org?

1. Configure o duckdns.org para apontar para seu IP público
2. Ou use variável de ambiente com IP local:
   ```env
   EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:3000
   ```

### IP do Expo não detectado?

O app automaticamente usa o fallback (duckdns.org). Se isso não funcionar, use a variável de ambiente.

## 📚 Arquivos Relacionados

- `utils/getApiUrl.ts` - Lógica de detecção automática
- `config/api.config.ts` - Configuração da API

