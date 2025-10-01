import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, StyleSheet, RefreshControl } from 'react-native';
import { api } from '../../services/api';
import { theme } from '../../theme';

export default function ListClientesScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const res = await api.get('/clientes');
      const list = res.data?.data || res.data || [];
      setData(list);
    } catch (e) {
      Alert.alert('Erro', 'Falha ao carregar clientes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Carregando clientes...</Text>
      </View>
    );
  }

  const renderClientItem = ({ item }) => (
    <View style={styles.clientCard}>
      <View style={styles.clientHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {item?.nome_completo?.charAt(0)?.toUpperCase() || 'C'}
          </Text>
        </View>
        <View style={styles.clientInfo}>
          <Text style={styles.clientName}>{item?.nome_completo}</Text>
          <Text style={styles.clientEmail}>{item?.email}</Text>
        </View>
      </View>
      <View style={styles.clientDetails}>
        <Text style={styles.clientPhone}>{item?.telefone}</Text>
        <Text style={styles.clientCnpj}>CNPJ: {item?.cnpj}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Clientes</Text>
        <Text style={styles.subtitle}>{data.length} cliente{data.length !== 1 ? 's' : ''} cadastrado{data.length !== 1 ? 's' : ''}</Text>
      </View>
      
      <FlatList
        data={data}
        keyExtractor={(item, idx) => String(item?.id_cliente || idx)}
        renderItem={renderClientItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum cliente encontrado</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface.secondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.secondary,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fonts.sizes.md,
    color: theme.colors.text.muted,
  },
  header: {
    backgroundColor: theme.colors.surface.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    ...theme.shadows.sm,
  },
  title: {
    fontSize: theme.fonts.sizes['2xl'],
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.text.muted,
  },
  listContainer: {
    padding: theme.spacing.md,
  },
  clientCard: {
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  clientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  avatarText: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text.white,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  clientEmail: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.text.muted,
  },
  clientDetails: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    paddingTop: theme.spacing.md,
  },
  clientPhone: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  clientCnpj: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.text.muted,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing['3xl'],
  },
  emptyText: {
    fontSize: theme.fonts.sizes.lg,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
});

