import React from 'react';
import { Car, CheckCircle, Key, Shield } from 'lucide-react';

const StatsCards = () => {
  const stats = [
    {
      title: "Total",
      value: "122",
      icon: Car,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      title: "Disponíveis",
      value: "121",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      title: "Para Aluguel",
      value: "5",
      icon: Key,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600"
    },
    {
      title: "Para Venda",
      value: "117",
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
