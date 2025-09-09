import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import { Text, View, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext, AuthProvider } from './src/context/AuthContext';
import { theme } from './src/theme';
import LoginScreen from './src/screens/LoginScreen';
import ListClientesScreen from './src/screens/Clientes/ListClientesScreen';
import ListFuncionariosScreen from './src/screens/Funcionarios/ListFuncionariosScreen';
import ListPacotesScreen from './src/screens/Pacotes/ListPacotesScreen';
import ListOrcamentosScreen from './src/screens/Orcamentos/ListOrcamentosScreen';
import ListContratosScreen from './src/screens/Contratos/ListContratosScreen';
import SignUpClienteScreen from './src/screens/SignUp/SignUpClienteScreen';
import SignUpFuncionarioScreen from './src/screens/SignUp/SignUpFuncionarioScreen';
import ProfileScreen from './src/screens/Profile/ProfileScreen';
import AccessibilityScreen from './src/screens/Accessibility/AccessibilityScreen';
import AdicionarContratoScreen from './src/screens/Funcionarios/AdicionarContratoScreen';
import AdicionarOrcamentoScreen from './src/screens/Funcionarios/AdicionarOrcamentoScreen';
import AdicionarPedidoScreen from './src/screens/Funcionarios/AdicionarPedidoScreen';

function Placeholder({ title }) {
  return (
    <View style={styles.placeholderContainer}>
      <Text style={styles.placeholderText}>{title}</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();
function MainTabs({ navigation }) {
  const { user, signOut } = useContext(AuthContext);
  
  const LogoutButton = () => (
    <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
      <Text style={styles.logoutButtonText}>Sair</Text>
    </TouchableOpacity>
  );

  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerRight: LogoutButton,
        headerStyle: {
          backgroundColor: theme.colors.surface.primary,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border.light,
        },
        headerTitleStyle: {
          fontSize: theme.fonts.sizes.lg,
          fontWeight: theme.fonts.weights.semibold,
          color: theme.colors.text.primary,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface.primary,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border.light,
          height: 56, // valor padrão do Material Design
          paddingBottom: 0,
          paddingTop: 0,
        },
        tabBarLabelStyle: {
          fontSize: theme.fonts.sizes.xs,
          fontWeight: theme.fonts.weights.medium,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.muted,
      }}
    >
      {user?.tipo === 'funcionario' ? (
        <>
          <Tab.Screen name="Clientes" component={ListClientesScreen} />
          <Tab.Screen name="Funcionarios" component={ListFuncionariosScreen} />
          <Tab.Screen name="Pacotes" component={ListPacotesScreen} />
          <Tab.Screen name="Orcamentos" component={ListOrcamentosScreen} />
          <Tab.Screen name="Contratos" component={ListContratosScreen} />
          <Tab.Screen name="Acessibilidade" component={AccessibilityScreen} />
          <Tab.Screen name="Perfil" component={ProfileScreen} />
        </>
      ) : (
        <>
          <Tab.Screen name="Bem-vindo" children={() => (
            <View style={styles.welcomeContainer}>
              <View style={styles.welcomeCard}>
                <Text style={styles.welcomeTitle}>Olá, {user?.nome || 'Cliente'}!</Text>
                <Text style={styles.welcomeMessage}>
                  Seu acesso é de cliente. Fale com um funcionário para atualizações de pacote, orçamento e contrato.
                </Text>
              </View>
            </View>
          )} />
          <Tab.Screen name="Acessibilidade" component={AccessibilityScreen} />
          <Tab.Screen name="Perfil" component={ProfileScreen} />
        </>
      )}
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();
function RootNavigator() {
  const { loading } = useContext(AuthContext);
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }
  
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.colors.surface.secondary,
        },
      }}
    >
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen 
        name="AdicionarContrato" 
        component={AdicionarContratoScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.surface.primary,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border.light,
          },
          headerTitleStyle: {
            fontSize: theme.fonts.sizes.lg,
            fontWeight: theme.fonts.weights.semibold,
            color: theme.colors.text.primary,
          },
        }}
      />
      <Stack.Screen 
        name="AdicionarOrcamento" 
        component={AdicionarOrcamentoScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.surface.primary,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border.light,
          },
          headerTitleStyle: {
            fontSize: theme.fonts.sizes.lg,
            fontWeight: theme.fonts.weights.semibold,
            color: theme.colors.text.primary,
          },
        }}
      />
      <Stack.Screen 
        name="AdicionarPedido" 
        component={AdicionarPedidoScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.surface.primary,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border.light,
          },
          headerTitleStyle: {
            fontSize: theme.fonts.sizes.lg,
            fontWeight: theme.fonts.weights.semibold,
            color: theme.colors.text.primary,
          },
        }}
      />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen 
        name="SignUpCliente" 
        component={SignUpClienteScreen}
        options={{
          headerShown: true,
          title: 'Cadastro de Cliente',
          headerStyle: {
            backgroundColor: theme.colors.surface.primary,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border.light,
          },
          headerTitleStyle: {
            fontSize: theme.fonts.sizes.lg,
            fontWeight: theme.fonts.weights.semibold,
            color: theme.colors.text.primary,
          },
        }}
      />
      <Stack.Screen 
        name="SignUpFuncionario" 
        component={SignUpFuncionarioScreen}
        options={{
          headerShown: true,
          title: 'Cadastro de Funcionário',
          headerStyle: {
            backgroundColor: theme.colors.surface.primary,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border.light,
          },
          headerTitleStyle: {
            fontSize: theme.fonts.sizes.lg,
            fontWeight: theme.fonts.weights.semibold,
            color: theme.colors.text.primary,
          },
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
        <StatusBar style="auto" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
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
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface.secondary,
  },
  placeholderText: {
    fontSize: theme.fonts.sizes.lg,
    color: theme.colors.text.muted,
  },
  logoutButton: {
    backgroundColor: theme.colors.error,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.sm,
  },
  logoutButtonText: {
    color: theme.colors.text.white,
    fontSize: theme.fonts.sizes.sm,
    fontWeight: theme.fonts.weights.medium,
  },
  welcomeContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface.secondary,
    padding: theme.spacing.lg,
  },
  welcomeCard: {
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  welcomeTitle: {
    fontSize: theme.fonts.sizes['2xl'],
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  welcomeMessage: {
    fontSize: theme.fonts.sizes.md,
    color: theme.colors.text.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
});
