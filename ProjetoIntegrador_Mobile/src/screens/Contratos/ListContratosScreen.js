import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import { api } from '../../services/api';
import { theme } from '../../theme';

export default function ListContratosScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/contratos');
        const list = res.data?.data || res.data || [];
        setData(list);
      } catch (e) {
        Alert.alert('Erro', 'Falha ao carregar contratos');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 24 }} />;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Text style={{ fontSize: 22, color: theme.colors.primary, fontFamily: theme.fonts.main, margin: theme.spacing.lg }}>
        Lista de Contratos
      </Text>
      <FlatList
        data={data}
        keyExtractor={(item, idx) => String(item?.id_contrato || idx)}
        renderItem={({ item }) => (
          <View style={{
            padding: theme.spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.secondary,
            backgroundColor: theme.colors.background,
          }}>
            <Text style={{ fontWeight: 'bold', color: theme.colors.primary, fontSize: 16, fontFamily: theme.fonts.main }}>
              Status: {item?.status_contrato}
            </Text>
            <Text style={{ color: theme.colors.dark }}>Valor: {item?.valor_contrato}</Text>
          </View>
        )}
      />
    </View>
  );
}

