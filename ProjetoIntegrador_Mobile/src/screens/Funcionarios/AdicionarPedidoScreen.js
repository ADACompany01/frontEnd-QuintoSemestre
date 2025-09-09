import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView } from 'react-native';
import { theme } from '../../theme';
import { api } from '../../services/api';

export default function AdicionarPedidoScreen({ navigation }) {
  const [form, setForm] = useState({ descricao: '', valor: '' });
  const [loading, setLoading] = useState(false);

  const onChange = (key, value) => setForm((p) => ({ ...p, [key]: value }));
  const onSubmit = async () => {
    try {
      setLoading(true);
      await api.post('/pedidos', form);
      Alert.alert('Sucesso', 'Pedido criado!');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro', 'Falha ao criar pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, backgroundColor: theme.colors.background }}>
      <Text style={{ fontSize: 22, color: theme.colors.primary, fontFamily: theme.fonts.main, marginBottom: theme.spacing.lg }}>
        Adicionar Pedido
      </Text>
      <TextInput
        placeholder="Descrição do pedido"
        value={form.descricao}
        onChangeText={(t) => onChange('descricao', t)}
        style={{
          borderWidth: 1,
          borderColor: theme.colors.secondary,
          borderRadius: theme.borderRadius,
          padding: theme.spacing.md,
          marginBottom: theme.spacing.md,
          fontFamily: theme.fonts.main,
        }}
      />
      <TextInput
        placeholder="Valor"
        value={form.valor}
        onChangeText={(t) => onChange('valor', t)}
        style={{
          borderWidth: 1,
          borderColor: theme.colors.secondary,
          borderRadius: theme.borderRadius,
          padding: theme.spacing.md,
          marginBottom: theme.spacing.lg,
          fontFamily: theme.fonts.main,
        }}
        keyboardType="numeric"
      />
      <Button title={loading ? 'Salvando...' : 'Salvar'} onPress={onSubmit} color={theme.colors.primary} disabled={loading} />
    </ScrollView>
  );
}
