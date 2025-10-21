import React from 'react';
import { Camera, Heart, MessageCircle, Share, Eye, Users, TrendingUp, BarChart3 } from 'lucide-react';
import DashboardHeader from '@/components/metrics/DashboardHeader';
import StatCard from '@/components/metrics/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const InstagramMetricsDashboard = () => {
  // Mock data for Instagram metrics
  const engagementData = [
    { name: 'Jan', engagement: 4.2 },
    { name: 'Fev', engagement: 4.8 },
    { name: 'Mar', engagement: 5.1 },
    { name: 'Abr', engagement: 4.9 },
    { name: 'Mai', engagement: 5.3 },
    { name: 'Jun', engagement: 5.7 },
  ];

  const topPosts = [
    { id: 1, content: 'Novo Civic 2024 chegou!', likes: 245, comments: 18, shares: 12 },
    { id: 2, content: 'Promoção especial HRV...', likes: 189, comments: 24, shares: 8 },
    { id: 3, content: 'Dicas de manutenção...', likes: 156, comments: 31, shares: 15 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
            <Camera className="h-6 w-6 text-pink-600 dark:text-pink-400" />
            Métricas Instagram - Alvorada Veículos
          </h2>
          <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
            @alvoradaveiculos
          </Badge>
        </div>
        
        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Seguidores"
            value={2547}
            icon={<Users />}
            trend="+12% este mês"
            loading={false}
            iconBgClass="bg-pink-100 dark:bg-pink-900/30"
            iconTextClass="text-pink-600 dark:text-pink-400"
          />
          
          <StatCard 
            title="Taxa de Engajamento"
            value="5.3%"
            icon={<Heart />}
            trend="+0.8% vs mês anterior"
            loading={false}
            iconBgClass="bg-purple-100 dark:bg-purple-900/30"
            iconTextClass="text-purple-600 dark:text-purple-400"
          />
          
          <StatCard 
            title="Alcance"
            value={18750}
            icon={<Eye />}
            trend="+25% esta semana"
            loading={false}
            iconBgClass="bg-blue-100 dark:bg-blue-900/30"
            iconTextClass="text-blue-600 dark:text-blue-400"
          />
          
          <StatCard 
            title="Impressões"
            value={45200}
            icon={<BarChart3 />}
            trend="+18% este mês"
            loading={false}
            iconBgClass="bg-indigo-100 dark:bg-indigo-900/30"
            iconTextClass="text-indigo-600 dark:text-indigo-400"
          />
        </div>

        {/* Engagement and Posts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Stories Metrics */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-pink-600" />
                Stories
              </CardTitle>
              <CardDescription>Métricas dos últimos 7 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Visualizações</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Taxa de conclusão</span>
                  <span className="font-semibold">78%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Interações</span>
                  <span className="font-semibold">156</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Novos seguidores</span>
                  <span className="font-semibold text-green-600">+23</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Posts */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Posts Mais Populares
              </CardTitle>
              <CardDescription>Últimos 30 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPosts.map((post) => (
                  <div key={post.id} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0">
                    <p className="text-sm font-medium mb-2">{post.content}</p>
                    <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {post.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share className="h-3 w-3" />
                        {post.shares}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Melhor Horário</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">18:00 - 20:00</div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Maior engajamento</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Hashtags Top</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">#carros</Badge>
                <Badge variant="outline">#honda</Badge>
                <Badge variant="outline">#alvorada</Badge>
                <Badge variant="outline">#seminovos</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Crescimento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">+15.2%</div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Últimos 30 dias</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default InstagramMetricsDashboard;