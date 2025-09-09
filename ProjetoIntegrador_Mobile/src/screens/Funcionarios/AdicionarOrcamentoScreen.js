import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView } from 'react-native';
import { theme } from '../../theme';
import { api } from '../../services/api';

export default function AdicionarOrcamentoScreen({ navigation }) {
  const [form, setForm] = useState({ valor_orcamento: '', data_validade: '' });
  const [loading, setLoading] = useState(false);

  const onChange = (key, value) => setForm((p) => ({ ...p, [key]: value }));
  const onSubmit = async () => {
    try {
      setLoading(true);
      await api.post('/orcamentos', form);
      Alert.alert('Sucesso', 'Orçamento criado!');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro', 'Falha ao criar orçamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, backgroundColor: theme.colors.background }}>
      <Text style={{ fontSize: 22, color: theme.colors.primary, fontFamily: theme.fonts.main, marginBottom: theme.spacing.lg }}>
        Adicionar Orçamento
      </Text>
      <TextInput
        placeholder="Valor do orçamento"
        value={form.valor_orcamento}
        onChangeText={(t) => onChange('valor_orcamento', t)}
        style={{
          borderWidth: 1,
          borderColor: theme.colors.secondary,
          borderRadius: theme.borderRadius,
          padding: theme.spacing.md,
          marginBottom: theme.spacing.md,
          fontFamily: theme.fonts.main,
        }}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Data de validade (YYYY-MM-DD)"
        value={form.data_validade}
        onChangeText={(t) => onChange('data_validade', t)}
        style={{
          borderWidth: 1,
          borderColor: theme.colors.secondary,
          borderRadius: theme.borderRadius,
          padding: theme.spacing.md,
          marginBottom: theme.spacing.lg,
          fontFamily: theme.fonts.main,
        }}
      />
      <Button title={loading ? 'Salvando...' : 'Salvar'} onPress={onSubmit} color={theme.colors.primary} disabled={loading} />
    </ScrollView>
  );
}
