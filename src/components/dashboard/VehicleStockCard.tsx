
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, TrendingDown, AlertTriangle } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';

const VehicleStockCard = () => {
  const navigate = useNavigate();
  const { stats, loading } = useDashboardData();
  
  const handleClick = () => {
    navigate('/vehicle-stock');
  };
  
  return (
    <Card className="h-[400px] cursor-pointer group glass-card border-0 bg-gradient-to-br from-white/80 via-orange-50/80 to-red-50/80 dark:from-gray-800/80 dark:via-gray-700/80 dark:to-gray-600/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 transform-gpu rounded-3xl" onClick={handleClick}>
      <CardHeader className="pb-3 relative overflow-hidden rounded-t-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300 group-hover:-rotate-3">
              <Car className="h-5 w-5 text-white" />
            </div>
            <Badge variant="outline" className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700 text-xs">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-1 animate-pulse"></div>
              Disponível
            </Badge>
          </div>
          <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Estoque de Veículos
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
            Gerenciamento do estoque
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2 pb-4 flex-1 flex flex-col justify-center">
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 p-4 rounded-full group-hover:scale-110 transition-transform duration-300">
                <Car className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-2 w-2 text-white" />
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
              {loading ? (
                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto"></div>
              ) : (
                stats.totalVehicles.toLocaleString()
              )}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Veículos em estoque</div>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <TrendingDown className="h-3 w-3 text-orange-600 dark:text-orange-400" />
              <span className="text-gray-600 dark:text-gray-400">
                {loading ? (
                  <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  `${stats.totalVehicles} disponíveis`
                )}
              </span>
            </div>
            <div className="text-orange-600 dark:text-orange-400 font-medium">
              {loading ? (
                <div className="h-3 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ) : (
                stats.totalVehicles > 0 ? '100%' : '0%'
              )}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <div className="w-full text-center">
          <Badge variant="outline" className="bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-800/50 transition-colors duration-300">
            Ver estoque
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VehicleStockCard;
