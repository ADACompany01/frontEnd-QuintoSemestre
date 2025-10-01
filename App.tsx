/**
 * App - Componente principal da aplicação para React Native/Expo
 * 
 * Responsabilidades:
 * - Coordenação entre controllers e views
 * - Gerenciamento de estado global
 * - Roteamento principal
 * - Integração MVC para React Native
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthController } from './controllers';
import { LoginScreen, ClientDashboard, EmployeeDashboard } from './views';
import { type User } from './models';

const App: React.FC = () => {
  const [authController] = useState(() => AuthController.getInstance());
  const [authState, setAuthState] = useState(authController.getAuthState());

  useEffect(() => {
    const unsubscribe = authController.subscribe(setAuthState);
    return unsubscribe;
  }, [authController]);

  const handleLoginSuccess = (user: User) => {
    console.log('User logged in successfully:', user.name);
  };

  const handleLogout = () => {
    authController.logout();
  };

  const renderContent = () => {
    try {
      if (authState.isLoading) {
        return (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingContent}>
              <ActivityIndicator size="large" color="#6366f1" />
              <Text style={styles.loadingText}>Carregando...</Text>
            </View>
          </View>
        );
      }

      if (!authState.isAuthenticated || !authState.currentUser) {
        return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
      }

      const user = authState.currentUser;
      
      console.log('User type:', user.type);
      console.log('Is client:', authController.isClient());
      console.log('Is employee:', authController.isEmployee());
      
      if (authController.isClient()) {
        return <ClientDashboard user={user} onLogout={handleLogout} />;
      }
      
      if (authController.isEmployee()) {
        return <EmployeeDashboard user={user} onLogout={handleLogout} />;
      }

      return (
        <View style={styles.errorContainer}>
          <View style={styles.errorContent}>
            <Text style={styles.errorText}>Tipo de usuário não reconhecido: {user.type}</Text>
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <Text style={styles.buttonText}>Fazer Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } catch (error) {
      console.error('Error in renderContent:', error);
      return (
        <View style={styles.errorContainer}>
          <View style={styles.errorContent}>
            <Text style={styles.errorText}>Erro ao carregar: {String(error)}</Text>
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <Text style={styles.buttonText}>Fazer Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    maxWidth: 448,
    alignSelf: 'center',
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#667eea',
  },
  loadingContent: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 15,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorContent: {
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    marginBottom: 16,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default App;

// EXPANSÃO FUTURA:
// - Sistema de roteamento com React Navigation
// - Lazy loading de componentes
// - Context providers para estado global
// - Error boundaries
// - Integração com analytics
// - Push notifications
