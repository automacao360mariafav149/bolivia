
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, FileText, Folder } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';

const KnowledgeCard = () => {
  const navigate = useNavigate();
  const { stats, loading } = useDashboardData();
  
  const handleClick = () => {
    navigate('/knowledge');
  };
  
  return (
    <Card className="h-[400px] cursor-pointer group glass-card border-0 bg-gradient-to-br from-white/80 via-amber-50/80 to-orange-50/80 dark:from-gray-800/80 dark:via-gray-700/80 dark:to-gray-600/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 transform-gpu rounded-3xl" onClick={handleClick}>
      <CardHeader className="pb-3 relative overflow-hidden rounded-t-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-amber-500/25 transition-all duration-300 group-hover:-rotate-3">
              <Database className="h-5 w-5 text-white" />
            </div>
            <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700 text-xs">
              <div className="w-2 h-2 bg-amber-500 rounded-full mr-1 animate-pulse"></div>
              Sync
            </Badge>
          </div>
          <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Conhecimento
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
            Base de documentos
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2 pb-4 flex-1 flex flex-col justify-center">
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 p-4 rounded-full group-hover:scale-110 transition-transform duration-300">
                <Database className="h-8 w-8 text-amber-600 dark:text-amber-400 group-hover:animate-bounce" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <FileText className="h-2 w-2 text-white" />
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
              {loading ? (
                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto"></div>
              ) : (
                stats.totalDocuments.toLocaleString()
              )}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Documentos</div>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <Folder className="h-3 w-3 text-amber-600 dark:text-amber-400" />
              <span className="text-gray-600 dark:text-gray-400">
                {loading ? (
                  <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  `${Math.ceil(stats.totalDocuments / 10)} categorias`
                )}
              </span>
            </div>
            <div className="text-amber-600 dark:text-amber-400 font-medium">
              {loading ? (
                <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ) : (
                `${(stats.totalDocuments * 0.5).toFixed(1)} MB`
              )}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <div className="w-full text-center">
          <Badge variant="outline" className="bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-800/50 transition-colors duration-300">
            Gerenciar arquivos
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
};

export default KnowledgeCard;
