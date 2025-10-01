/**
 * ClientDashboard - Dashboard do cliente para React Native
 */

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AuthController, RequestController, EvaluationController } from '../../controllers';
import { EvaluationScreen } from './EvaluationScreen.native';
import { PlanSelectionScreen } from './PlanSelectionScreen.native';
import { Timeline } from '../components/Timeline.native';
import { type User } from '../../models';

interface ClientDashboardProps {
  user: User;
  onLogout: () => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  user,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState('avaliar');
  const [evaluationState, setEvaluationState] = useState({ plan: null, issues: [] });

  // Controllers
  const [requestController] = useState(() => RequestController.getInstance());
  const [evaluationController] = useState(() => EvaluationController.getInstance());

  // States
  const [requestState, setRequestState] = useState(requestController.getState());

  useEffect(() => {
    const unsubscribeRequest = requestController.subscribe(setRequestState);
    return () => {
      unsubscribeRequest();
    };
  }, [requestController]);

  // Filter requests for current client
  const clientRequests = useMemo(
    () => RequestController.prototype.getRequestsByClient.call(requestController, user.name),
    [requestController, user.name]
  );

  const activeRequest = useMemo(
    () => {
      // Pega a solicitação mais recente que não está completa
      const active = clientRequests
        .filter((r) => r.status !== 'Completed')
        .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))[0];
      return active || null;
    },
    [clientRequests]
  );

  const handleSelectPlan = (plan: 'A' | 'AA' | 'AAA', issues: any[]) => {
    setEvaluationState({ plan, issues });
  };

  const handleConfirmPlan = async (plan: 'A' | 'AA' | 'AAA', selectedIssues: any[]) => {
    try {
      const requestData = {
        clientName: user.name,
        site: `site-${Date.now()}.com`,
        plan,
        status: 'Awaiting Quote' as const,
        selectedIssues,
      };

      await requestController.createRequest(requestData);

      setEvaluationState({ plan: null, issues: [] });
      setActiveTab('acompanhar');
    } catch (error) {
      console.error('Error creating request:', error);
    }
  };

  const handleBackToEvaluation = () => {
    setEvaluationState({ plan: null, issues: [] });
    evaluationController.clearCurrentEvaluation();
  };

  const handleApproveQuote = async (requestId: string) => {
    try {
      const nextStatus = requestController.getStatusConfig().nextStatus['Quote Sent'];
      if (nextStatus) {
        await requestController.updateRequestStatus(Number(requestId), nextStatus);
      }
    } catch (error) {
      console.error('Error approving quote:', error);
      throw error;
    }
  };

  const handleSignContract = async (requestId: string) => {
    try {
      // Cliente assina contrato, muda de 'Contract Sent' para 'Contract Signed'
      const nextStatus = requestController.getStatusConfig().nextStatus['Contract Sent'];
      if (nextStatus) {
        await requestController.updateRequestStatus(Number(requestId), nextStatus);
      }
    } catch (error) {
      console.error('Error signing contract:', error);
      throw error;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'avaliar':
        return evaluationState.plan ? (
          <PlanSelectionScreen
            plan={evaluationState.plan}
            issues={evaluationState.issues}
            onConfirm={handleConfirmPlan}
            onBack={handleBackToEvaluation}
          />
        ) : (
          <EvaluationScreen onSelectPlan={handleSelectPlan} />
        );

      case 'acompanhar':
        return activeRequest ? (
          <ScrollView style={styles.timelineContainer}>
            <Timeline
              request={activeRequest}
              statusConfig={requestController.getStatusConfig()}
              onApprove={handleApproveQuote}
              onSignContract={handleSignContract}
            />
          </ScrollView>
        ) : (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>Nenhum projeto ativo</Text>
              <Text style={styles.emptyText}>Você ainda não tem projetos em andamento.</Text>
            </View>
          </View>
        );

      case 'perfil':
        return (
          <ScrollView style={styles.content}>
            <View style={styles.profileCard}>
              <View style={styles.profileAvatar}>
                <Text style={styles.profileAvatarText}>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </Text>
              </View>
              <Text style={styles.profileName}>{user?.name || 'N/A'}</Text>
              <Text style={styles.profileEmail}>{user?.email || 'N/A'}</Text>
              <View style={styles.profileBadge}>
                <Text style={styles.profileBadgeText}>Cliente</Text>
              </View>
            </View>

            <Text style={styles.historyTitle}>📋 Histórico de Planos</Text>
            {clientRequests.length > 0 ? (
              clientRequests.map((req) => (
                <View key={req.id} style={styles.historyCard}>
                  <Text style={styles.historyProject}>{req.site} - Plano {req.plan}</Text>
                  <Text style={styles.historyStatus}>
                    Status: {requestController.getStatusConfig().map[req.status]}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.historyEmpty}>Nenhum plano contratado ainda.</Text>
            )}
          </ScrollView>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.greeting}>Olá, {user?.name?.split(' ')[0] || 'Usuário'}! 👋</Text>
            <Text style={styles.email}>{user?.email || 'email@example.com'}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {renderContent()}

      {/* Navigation footer */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'avaliar' && styles.tabActive]}
          onPress={() => setActiveTab('avaliar')}
        >
          <Text style={[styles.tabIcon, activeTab === 'avaliar' && styles.tabIconActive]}>
            🔍
          </Text>
          <Text style={[styles.tabLabel, activeTab === 'avaliar' && styles.tabLabelActive]}>
            Avaliar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'acompanhar' && styles.tabActive]}
          onPress={() => setActiveTab('acompanhar')}
        >
          <Text style={[styles.tabIcon, activeTab === 'acompanhar' && styles.tabIconActive]}>
            📋
          </Text>
          <Text style={[styles.tabLabel, activeTab === 'acompanhar' && styles.tabLabelActive]}>
            Acompanhar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'perfil' && styles.tabActive]}
          onPress={() => setActiveTab('perfil')}
        >
          <Text style={[styles.tabIcon, activeTab === 'perfil' && styles.tabIconActive]}>
            👤
          </Text>
          <Text style={[styles.tabLabel, activeTab === 'perfil' && styles.tabLabelActive]}>
            Perfil
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#6366f1',
    padding: 20,
    paddingTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  email: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  timelineContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileAvatarText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  profileBadge: {
    backgroundColor: '#f0f4ff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  profileBadgeText: {
    color: '#6366f1',
    fontSize: 12,
    fontWeight: '600',
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  historyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  historyProject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  historyStatus: {
    fontSize: 14,
    color: '#6b7280',
  },
  historyEmpty: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    paddingVertical: 20,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  tabActive: {
    borderTopWidth: 3,
    borderTopColor: '#6366f1',
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.6,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#6366f1',
    fontWeight: '700',
  },
});
