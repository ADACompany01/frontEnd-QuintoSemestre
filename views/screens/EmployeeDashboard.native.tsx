/**
 * EmployeeDashboard - Dashboard do funcionário para React Native
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { RequestController } from '../../controllers';
import { StarRating } from '../components/StarRating.native';
import { type User, type AccessibilityRequest } from '../../models';

interface EmployeeDashboardProps {
  user: User;
  onLogout: () => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  user,
  onLogout,
}) => {
  const [selectedRequest, setSelectedRequest] = useState<AccessibilityRequest | null>(null);
  const [requestController] = useState(() => RequestController.getInstance());
  const [requestState, setRequestState] = useState(requestController.getState());
  const [uploadingFileFor, setUploadingFileFor] = useState<{ type: 'quote' | 'contract'; request: AccessibilityRequest } | null>(null);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    const unsubscribeRequest = requestController.subscribe(setRequestState);
    return () => {
      unsubscribeRequest();
    };
  }, [requestController]);

  const statusConfig = requestController.getStatusConfig();

  const handleAction = async (request: AccessibilityRequest, actionType: string) => {
    if (actionType === 'sendQuote') {
      setUploadingFileFor({ type: 'quote', request });
    } else if (actionType === 'attachContract') {
      setUploadingFileFor({ type: 'contract', request });
    } else if (actionType === 'startDev') {
      // Iniciar desenvolvimento
      try {
        const nextStatus = statusConfig.nextStatus[request.status];
        if (nextStatus) {
          await requestController.updateRequestStatus(request.id, nextStatus);
          // Inicializa com status "Analysis"
          await requestController.updateDevelopmentStatus(request.id, 'Analysis');
          Alert.alert('Sucesso', 'Desenvolvimento iniciado!');
        }
      } catch (error) {
        console.error('Error starting development:', error);
        Alert.alert('Erro', 'Erro ao iniciar desenvolvimento');
      }
    } else {
      try {
        const nextStatus = statusConfig.nextStatus[request.status];
        if (nextStatus) {
          await requestController.updateRequestStatus(request.id, nextStatus);
          Alert.alert('Sucesso', 'Status atualizado com sucesso!');
        }
      } catch (error) {
        console.error('Error updating request status:', error);
        Alert.alert('Erro', 'Erro ao atualizar status');
      }
    }
  };

  const handleFileSelect = () => {
    // Simular seleção de arquivo
    const mockFileName = `documento_${Date.now()}.pdf`;
    setFileName(mockFileName);
    Alert.alert('Arquivo Selecionado', mockFileName);
  };

  const handleFileUpload = async () => {
    if (!fileName) {
      Alert.alert('Erro', 'Por favor, selecione um arquivo primeiro.');
      return;
    }

    if (!uploadingFileFor) return;

    try {
      const { type, request } = uploadingFileFor;
      const fileData = { name: fileName, url: '#' }; // Mock URL

      await requestController.attachFileToRequest(request.id, type, fileData);

      setUploadingFileFor(null);
      setFileName('');
      Alert.alert('Sucesso', `${type === 'quote' ? 'Orçamento' : 'Contrato'} enviado com sucesso!`);
    } catch (error) {
      console.error('Error uploading file:', error);
      Alert.alert('Erro', 'Erro ao enviar arquivo. Tente novamente.');
    }
  };

  const handleUpdateDevelopmentStatus = async (devStatus: any) => {
    if (!selectedRequest) return;
    
    try {
      await requestController.updateDevelopmentStatus(selectedRequest.id, devStatus);
      Alert.alert('Sucesso', 'Status de desenvolvimento atualizado!');
    } catch (error) {
      console.error('Error updating development status:', error);
      Alert.alert('Erro', 'Erro ao atualizar status');
    }
  };

  const getActionButton = (request: AccessibilityRequest) => {
    const { status } = request;

    if (status === 'Awaiting Quote') {
      return (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleAction(request, 'sendQuote')}
        >
          <Text style={styles.actionButtonText}>📄 Enviar Orçamento</Text>
        </TouchableOpacity>
      );
    }

    if (status === 'Quote Sent') {
      return (
        <View style={styles.infoBadge}>
          <Text style={styles.infoBadgeText}>⏳ Aguardando aprovação do cliente...</Text>
        </View>
      );
    }

    if (status === 'Quote Approved') {
      return (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleAction(request, 'attachContract')}
        >
          <Text style={styles.actionButtonText}>📎 Anexar Contrato</Text>
        </TouchableOpacity>
      );
    }

    if (status === 'Contract Sent') {
      return (
        <View style={styles.infoBadge}>
          <Text style={styles.infoBadgeText}>⏳ Aguardando assinatura do cliente...</Text>
        </View>
      );
    }

    if (status === 'Contract Signed') {
      return (
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonSuccess]}
          onPress={() => handleAction(request, 'startDev')}
        >
          <Text style={styles.actionButtonText}>🚀 Iniciar Desenvolvimento</Text>
        </TouchableOpacity>
      );
    }

    if (status === 'In Development') {
      return null; // Será renderizado separadamente abaixo
    }

    return (
      <View style={styles.completedBadge}>
        <Text style={styles.completedText}>✓ Concluído</Text>
      </View>
    );
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
      {selectedRequest ? (
        // Detail view
        <ScrollView style={styles.detailContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedRequest(null)}
          >
            <Text style={styles.backButtonText}>← Voltar para a lista</Text>
          </TouchableOpacity>

          <View style={styles.detailCard}>
            <Text style={styles.detailClient}>{selectedRequest.clientName}</Text>
            <Text style={styles.detailSite}>{selectedRequest.site}</Text>
            <View style={styles.planBadge}>
              <Text style={styles.planBadgeText}>Plano {selectedRequest.plan}</Text>
            </View>

            {uploadingFileFor?.request.id === selectedRequest.id ? (
              <View style={styles.uploadCard}>
                <Text style={styles.uploadTitle}>
                  📎 Anexar {uploadingFileFor.type === 'quote' ? 'Orçamento' : 'Contrato'}
                </Text>

                <TouchableOpacity style={styles.selectFileButton} onPress={handleFileSelect}>
                  <Text style={styles.selectFileButtonText}>
                    {fileName || '📁 Selecionar Arquivo'}
                  </Text>
                </TouchableOpacity>

                <View style={styles.uploadActions}>
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={handleFileUpload}
                    disabled={!fileName}
                  >
                    <Text style={styles.uploadButtonText}>✅ Confirmar Upload</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setUploadingFileFor(null);
                      setFileName('');
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                {getActionButton(selectedRequest)}

                {/* Development Status Update */}
                {selectedRequest.status === 'In Development' && (
                  <View style={styles.developmentSection}>
                    <Text style={styles.developmentSectionTitle}>📊 Atualizar Progresso do Desenvolvimento</Text>
                    
                    <TouchableOpacity
                      style={styles.devStatusButton}
                      onPress={() => handleUpdateDevelopmentStatus('Analysis')}
                    >
                      <Text style={styles.devStatusText}>🔍 Em Análise</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.devStatusButton}
                      onPress={() => handleUpdateDevelopmentStatus('Development')}
                    >
                      <Text style={styles.devStatusText}>💻 Em Desenvolvimento</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.devStatusButton}
                      onPress={() => handleUpdateDevelopmentStatus('Testing')}
                    >
                      <Text style={styles.devStatusText}>🧪 Em Teste</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.devStatusButton, styles.devStatusButtonDone]}
                      onPress={() => handleUpdateDevelopmentStatus('Done')}
                    >
                      <Text style={styles.devStatusText}>✅ Concluído</Text>
                    </TouchableOpacity>

                    {selectedRequest.developmentStatus && (
                      <View style={styles.currentDevStatus}>
                        <Text style={styles.currentDevStatusText}>
                          Status atual: {statusConfig.developmentSteps[['Analysis', 'Development', 'Testing', 'Done'].indexOf(selectedRequest.developmentStatus)]}
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                <Text style={styles.itemsTitle}>📝 Itens Solicitados pelo Cliente</Text>
                {selectedRequest.selectedIssues.length > 0 ? (
                  selectedRequest.selectedIssues.map((issue, index) => (
                    <View key={index} style={styles.issueCard}>
                      <Text style={styles.issueText}>{issue.text}</Text>
                      <StarRating rating={issue.priority} readOnly={true} />
                    </View>
                  ))
                ) : (
                  <Text style={styles.emptyText}>Nenhum item específico selecionado.</Text>
                )}
              </>
            )}
          </View>
        </ScrollView>
      ) : (
        // List view
        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>📋 Solicitações</Text>

          {requestState.requests.length > 0 ? (
            requestState.requests.map((req) => (
              <TouchableOpacity
                key={req.id}
                style={styles.requestCard}
                onPress={() => setSelectedRequest(req)}
              >
                <View style={styles.requestInfo}>
                  <Text style={styles.requestClient}>{req.clientName}</Text>
                  <Text style={styles.requestSite}>{req.site} - Plano {req.plan}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>
                      {statusConfig.map[req.status]}
                    </Text>
                  </View>
                </View>
                <Text style={styles.arrow}>→</Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>Nenhuma solicitação</Text>
              <Text style={styles.emptyDesc}>Não há solicitações no momento.</Text>
            </View>
          )}
        </ScrollView>
      )}
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  requestCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  requestInfo: {
    flex: 1,
  },
  requestClient: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  requestSite: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: '#f0f4ff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#6366f1',
    fontSize: 12,
    fontWeight: '600',
  },
  arrow: {
    fontSize: 20,
    color: '#9ca3af',
    marginLeft: 12,
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
  emptyDesc: {
    fontSize: 14,
    color: '#6b7280',
  },
  detailContainer: {
    flex: 1,
    padding: 16,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: '600',
  },
  detailCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  detailClient: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  detailSite: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 12,
  },
  planBadge: {
    backgroundColor: '#f0f4ff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  planBadgeText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  actionButtonSuccess: {
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completedBadge: {
    backgroundColor: '#d1fae5',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  completedText: {
    color: '#059669',
    fontSize: 16,
    fontWeight: '600',
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  issueCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  issueText: {
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    paddingVertical: 20,
  },
  infoBadge: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  infoBadgeText: {
    color: '#92400e',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  developmentSection: {
    backgroundColor: '#f0f9ff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  developmentSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  devStatusButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  devStatusButtonDone: {
    borderColor: '#10b981',
    backgroundColor: '#d1fae5',
  },
  devStatusText: {
    color: '#1f2937',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  currentDevStatus: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  currentDevStatusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  uploadCard: {
    backgroundColor: '#f0f4ff',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#6366f1',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  selectFileButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  selectFileButtonText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  uploadActions: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadButton: {
    flex: 1,
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '600',
  },
});