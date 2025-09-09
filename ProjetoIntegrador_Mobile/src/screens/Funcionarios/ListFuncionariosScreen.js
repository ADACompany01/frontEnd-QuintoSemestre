import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, Button } from 'react-native';
import { api } from '../../services/api';
import { theme } from '../../theme';
import { useNavigation } from '@react-navigation/native';

export default function ListFuncionariosScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/funcionarios');
        const list = res.data?.data || res.data || [];
        setData(list);
      } catch (e) {
        Alert.alert('Erro', 'Falha ao carregar funcionários');
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
        Lista de Funcionários
      </Text>
      <Button
        title="Adicionar Contrato"
        color={theme.colors.primary}
        onPress={() => navigation.navigate('AdicionarContrato')}
      />
      <View style={{ height: theme.spacing.md }} />
      <Button
        title="Adicionar Orçamento"
        color={theme.colors.secondary}
        onPress={() => navigation.navigate('AdicionarOrcamento')}
      />
      <View style={{ height: theme.spacing.md }} />
      <Button
        title="Adicionar Pedido"
        color={theme.colors.dark}
        onPress={() => navigation.navigate('AdicionarPedido')}
      />
      <FlatList
        data={data}
        keyExtractor={(item, idx) => String(item?.id_funcionario || idx)}
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
              {item?.nome_completo}
            </Text>
            <Text style={{ color: theme.colors.dark }}>{item?.email}</Text>
            <Text style={{ color: theme.colors.secondary }}>{item?.telefone}</Text>
          </View>
        )}
      />
    </View>
  );
}

