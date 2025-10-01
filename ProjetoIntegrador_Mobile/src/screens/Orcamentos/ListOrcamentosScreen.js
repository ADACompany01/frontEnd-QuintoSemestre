import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import { api } from '../../services/api';
import { theme } from '../../theme';

export default function ListOrcamentosScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/orcamentos');
        const list = res.data?.data || res.data || [];
        setData(list);
      } catch (e) {
        Alert.alert('Erro', 'Falha ao carregar orçamentos');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 24 }} />;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Text style={{ fontSize: 22, color: theme.colors.primary, fontFamily: theme.fonts.main, margin: theme.spacing.lg }}>
        Lista de Orçamentos
      </Text>
      <FlatList
        data={data}
        keyExtractor={(item, idx) => String(item?.cod_orcamento || idx)}
        renderItem={({ item }) => (
          <View style={{
            padding: theme.spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.secondary,
            backgroundColor: theme.colors.background,
          }}>
            <Text style={{ fontWeight: 'bold', color: theme.colors.primary, fontSize: 16, fontFamily: theme.fonts.main }}>
              Valor: {item?.valor_orcamento}
            </Text>
            <Text style={{ color: theme.colors.dark }}>Validade: {String(item?.data_validade)}</Text>
          </View>
        )}
      />
    </View>
  );
}

