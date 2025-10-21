import React from 'react';
import { Users, MessageCircle, Settings, Plus } from 'lucide-react';
import DashboardHeader from '@/components/metrics/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const WhatsAppClientGroupsDashboard = () => {
  // Mock data for client groups
  const clientGroups = [
    { id: 1, name: 'Clientes VIP', members: 45, active: 38, lastActivity: '2 min atrás' },
    { id: 2, name: 'Interessados Honda', members: 87, active: 12, lastActivity: '15 min atrás' },
    { id: 3, name: 'Pós-Venda', members: 156, active: 23, lastActivity: '1h atrás' },
    { id: 4, name: 'Promoções Especiais', members: 234, active: 67, lastActivity: '30 min atrás' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
            <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            Grupos WhatsApp - Clientes
          </h2>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Novo Grupo
          </Button>
        </div>

        {/* Coming Soon Notice */}
        <Card className="glass-card mb-8 border-2 border-dashed border-emerald-300 dark:border-emerald-700">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Funcionalidade em Desenvolvimento</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Esta seção está sendo preparada para gerenciar grupos de clientes no WhatsApp.
              </p>
              <Badge variant="outline" className="bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                Em breve disponível
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        {/* Preview of Future Functionality */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="glass-card opacity-60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-emerald-600" />
                Grupos Ativos
              </CardTitle>
              <CardDescription>Visualização prévia dos grupos de clientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clientGroups.map((group) => (
                  <div key={group.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <h4 className="font-medium">{group.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {group.members} membros • {group.active} ativos
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        {group.lastActivity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card opacity-60">
            <CardHeader>
              <CardTitle>Funcionalidades Planejadas</CardTitle>
              <CardDescription>O que estará disponível em breve</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm">Criação e gerenciamento de grupos</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm">Segmentação de clientes por interesse</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm">Mensagens automatizadas</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm">Relatórios de engajamento</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm">Integração com CRM</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm">Broadcasts personalizados</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Preview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 opacity-60">
          <Card className="glass-card text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">4</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Grupos Ativos</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">522</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Clientes</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">140</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ativos Agora</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">89%</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Taxa Resposta</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default WhatsAppClientGroupsDashboard;