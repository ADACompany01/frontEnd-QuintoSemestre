import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView } from 'react-native';
import { theme } from '../../theme';
import { api } from '../../services/api';

export default function AdicionarContratoScreen({ navigation }) {
  const [form, setForm] = useState({ valor_contrato: '', status_contrato: '' });
  const [loading, setLoading] = useState(false);

  const onChange = (key, value) => setForm((p) => ({ ...p, [key]: value }));
  const onSubmit = async () => {
    try {
      setLoading(true);
      await api.post('/contratos', form);
      Alert.alert('Sucesso', 'Contrato criado!');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro', 'Falha ao criar contrato');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, backgroundColor: theme.colors.background }}>
      <Text style={{ fontSize: 22, color: theme.colors.primary, fontFamily: theme.fonts.main, marginBottom: theme.spacing.lg }}>
        Adicionar Contrato
      </Text>
      <TextInput
        placeholder="Valor do contrato"
        value={form.valor_contrato}
        onChangeText={(t) => onChange('valor_contrato', t)}
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
        placeholder="Status do contrato"
        value={form.status_contrato}
        onChangeText={(t) => onChange('status_contrato', t)}
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
