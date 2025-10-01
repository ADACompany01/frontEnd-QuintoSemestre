import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { z } from 'zod';
import { api } from '../../services/api';
import { theme } from '../../theme';

const schema = z.object({
  nome_completo: z.string().min(3),
  email: z.string().email(),
  telefone: z.string().min(8),
  senha: z.string().min(6)
});

export default function SignUpFuncionarioScreen({ navigation }) {
  const [form, setForm] = useState({ nome_completo: '', email: '', telefone: '', senha: '' });
  const [loading, setLoading] = useState(false);

  const onChange = (key, value) => setForm((p) => ({ ...p, [key]: value }));
  const onSubmit = async () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      return Alert.alert('Validação', parsed.error.errors.map(e => e.message).join('\n'));
    }
    try {
      setLoading(true);
      // endpoint público para criar funcionário
      await api.post('/funcionarios', form);
      Alert.alert('Sucesso', 'Funcionário cadastrado! Faça login.');
      navigation.navigate('Login');
    } catch (e) {
      const msg = e?.response?.data?.message || 'Falha no cadastro';
      Alert.alert('Erro', String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Cadastro de Funcionário</Text>
          <Text style={styles.subtitle}>Preencha os dados abaixo para criar sua conta</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nome Completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome completo"
              placeholderTextColor={theme.colors.text.muted}
              value={form.nome_completo}
              onChangeText={(t) => onChange('nome_completo', t)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu email"
              placeholderTextColor={theme.colors.text.muted}
              value={form.email}
              onChangeText={(t) => onChange('email', t)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Telefone</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu telefone"
              placeholderTextColor={theme.colors.text.muted}
              value={form.telefone}
              onChangeText={(t) => onChange('telefone', t)}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor={theme.colors.text.muted}
              value={form.senha}
              onChangeText={(t) => onChange('senha', t)}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={[styles.primaryButton, loading && styles.buttonDisabled]} 
            onPress={onSubmit}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.secondaryButtonText}>Já tem uma conta? Faça login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing['2xl'],
  },
  title: {
    fontSize: theme.fonts.sizes['3xl'],
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fonts.sizes.md,
    color: theme.colors.text.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    fontSize: theme.fonts.sizes.sm,
    fontWeight: theme.fonts.weights.medium,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.fonts.sizes.md,
    backgroundColor: theme.colors.surface.primary,
    color: theme.colors.text.primary,
    ...theme.shadows.sm,
  },
  primaryButton: {
    height: 56,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  primaryButtonText: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.text.white,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  secondaryButton: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: theme.fonts.sizes.md,
    color: theme.colors.text.light,
    textDecorationLine: 'underline',
  },
});

