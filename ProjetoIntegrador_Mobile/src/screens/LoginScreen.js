import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { z } from 'zod';
import { AuthContext } from '../context/AuthContext';
import { theme } from '../theme';

const schema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export default function LoginScreen({ navigation }) {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    console.log('[Login] Submit clicked', { email });
    const parsed = schema.safeParse({ email, senha });
    if (!parsed.success) {
      const msg = parsed.error.errors.map((e) => e.message).join('\n');
      Alert.alert('Validação', msg);
      console.warn('[Login] Validação falhou:', msg);
      return;
    }
    try {
      setLoading(true);
      console.log('[Login] Chamando signIn...');
      const u = await signIn(email, senha);
      console.log('[Login] Sucesso', u);
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Falha no login';
      console.error('[Login] Erro', err);
      Alert.alert('Erro', String(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Header com logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/AdaHome.png')} 
              style={styles.logo} 
              resizeMode="contain" 
            />
          </View>
          <Text style={styles.title}>Bem-vindo de volta!</Text>
          <Text style={styles.subtitle}>Faça login para continuar</Text>
        </View>

        {/* Formulário */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu email"
              placeholderTextColor={theme.colors.text.muted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor={theme.colors.text.muted}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={[styles.primaryButton, loading && styles.buttonDisabled]} 
            onPress={onSubmit}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Botões de cadastro */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem uma conta?</Text>
          
          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={() => navigation.navigate('SignUpCliente')}
          >
            <Text style={styles.secondaryButtonText}>Cadastrar Cliente</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={() => navigation.navigate('SignUpFuncionario')}
          >
            <Text style={styles.secondaryButtonText}>Cadastrar Funcionário</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing['3xl'],
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.surface.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  logo: {
    width: 80,
    height: 80,
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
  },
  form: {
    marginBottom: theme.spacing['2xl'],
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
    marginTop: theme.spacing.md,
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
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: theme.fonts.sizes.md,
    color: theme.colors.text.muted,
    marginBottom: theme.spacing.lg,
  },
  secondaryButton: {
    width: '100%',
    height: 48,
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  secondaryButtonText: {
    fontSize: theme.fonts.sizes.md,
    fontWeight: theme.fonts.weights.medium,
    color: theme.colors.text.secondary,
  },
});

