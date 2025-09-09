import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, Alert, FlatList, ScrollView } from 'react-native';
import { z } from 'zod';
import { api } from '../../services/api';
import { theme } from '../../theme';

const schema = z.object({
  url: z.string().url('URL inválida. Ex.: https://exemplo.com')
});

export default function AccessibilityScreen() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const onRun = async () => {
    const parsed = schema.safeParse({ url });
    if (!parsed.success) {
      const msg = parsed.error.errors.map(e => e.message).join('\n');
      return Alert.alert('Validação', msg);
    }
    try {
      setLoading(true);
      setResult(null);
      const { data } = await api.post('/lighthouse/accessibility', { url });
      setResult(data);
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || 'Erro ao rodar teste';
      Alert.alert('Erro', String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, backgroundColor: theme.colors.background }}>
      <Text style={{ fontSize: 20, color: theme.colors.primary, fontFamily: theme.fonts.main, marginBottom: theme.spacing.lg }}>
        Teste de Acessibilidade
      </Text>
      <TextInput
        placeholder="https://seusite.com"
        autoCapitalize="none"
        keyboardType="url"
        value={url}
        onChangeText={setUrl}
        style={{
          borderWidth: 1,
          borderColor: theme.colors.secondary,
          borderRadius: theme.borderRadius,
          padding: theme.spacing.md,
          marginBottom: theme.spacing.lg,
          fontFamily: theme.fonts.main,
        }}
      />
      <Button title={loading ? 'Testando...' : 'Testar'} onPress={onRun} color={theme.colors.primary} disabled={loading} />

      {loading && <ActivityIndicator style={{ marginTop: 16 }} />}

      {result && (
        <View style={{ marginTop: theme.spacing.lg }}>
          <Text style={{ fontSize: 16, color: theme.colors.secondary, fontFamily: theme.fonts.main, marginBottom: theme.spacing.md }}>
            Resultado:
          </Text>

          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Nota: {result.notaAcessibilidade}</Text>

          <Text style={{ marginTop: 12, fontWeight: 'bold' }}>Reprovadas ({result.reprovadas?.length || 0}):</Text>
          <FlatList
            data={result.reprovadas || []}
            keyExtractor={(item, idx) => String(item?.id || idx)}
            renderItem={({ item }) => (
              <View style={{ paddingVertical: 6 }}>
                <Text style={{ fontWeight: '600' }}>{item?.id}</Text>
                <Text>{item?.title}</Text>
              </View>
            )}
          />

          <Text style={{ marginTop: 12, fontWeight: 'bold' }}>Aprovadas ({result.aprovadas?.length || 0}):</Text>
          <FlatList
            data={result.aprovadas || []}
            keyExtractor={(item, idx) => String(item?.id || idx)}
            renderItem={({ item }) => (
              <View style={{ paddingVertical: 6 }}>
                <Text style={{ fontWeight: '600' }}>{item?.id}</Text>
                <Text>{item?.title}</Text>
              </View>
            )}
          />

          <Text style={{ marginTop: 12, fontWeight: 'bold' }}>Manuais ({result.manuais?.length || 0}):</Text>
          <FlatList
            data={result.manuais || []}
            keyExtractor={(item, idx) => String(item?.id || idx)}
            renderItem={({ item }) => (
              <View style={{ paddingVertical: 6 }}>
                <Text style={{ fontWeight: '600' }}>{item?.id}</Text>
                <Text>{item?.title}</Text>
              </View>
            )}
          />

          <Text style={{ marginTop: 12, fontWeight: 'bold' }}>Não Aplicáveis ({result.naoAplicaveis?.length || 0}):</Text>
          <FlatList
            data={result.naoAplicaveis || []}
            keyExtractor={(item, idx) => String(item?.id || idx)}
            renderItem={({ item }) => (
              <View style={{ paddingVertical: 6 }}>
                <Text style={{ fontWeight: '600' }}>{item?.id}</Text>
                <Text>{item?.title}</Text>
              </View>
            )}
          />
        </View>
      )}
    </ScrollView>
  );
}

