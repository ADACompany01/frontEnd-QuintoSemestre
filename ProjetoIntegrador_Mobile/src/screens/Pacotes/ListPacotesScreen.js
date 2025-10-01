import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import { api } from '../../services/api';
import { theme } from '../../theme';

export default function ListPacotesScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/pacotes');
        const list = res.data?.data || res.data || [];
        setData(list);
      } catch (e) {
        Alert.alert('Erro', 'Falha ao carregar pacotes');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 24 }} />;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Text style={{
        fontSize: 22,
        color: theme.colors.primary,
        fontFamily: theme.fonts.main,
        margin: theme.spacing.lg
      }}>
        Lista de Pacotes
      </Text>
      <FlatList
        data={data}
        keyExtractor={(item, idx) => String(item?.id_pacote || idx)}
        renderItem={({ item }) => (
          <View style={{
            padding: theme.spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.secondary,
            backgroundColor: theme.colors.background,
          }}>
            <Text style={{
              fontWeight: 'bold',
              color: theme.colors.primary,
              fontSize: 16,
              fontFamily: theme.fonts.main
            }}>
              {item?.tipo_pacote}
            </Text>
            <Text style={{ color: theme.colors.dark }}>Valor base: {item?.valor_base}</Text>
          </View>
        )}
      />
    </View>
  );
}

