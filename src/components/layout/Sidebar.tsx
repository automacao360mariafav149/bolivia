import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MessageSquare, 
  Users, 
  Calendar, 
  BarChart3,
  Car,
  Camera,
  Brain
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const location = useLocation();

  const navigationItems = [
    {
      title: "PRINCIPAL",
      items: [
        { name: "Métricas", href: "/metrics", icon: BarChart3 },
        { name: "Chats", href: "/chats", icon: MessageSquare },
        { name: "Conhecimento", href: "/knowledge", icon: Brain },
        { name: "Clientes", href: "/clients", icon: Users },
        { name: "Estoque de Veículos", href: "/vehicle-stock", icon: Car },
        { name: "Agenda", href: "/schedule", icon: Calendar },
        { name: "Novos Carros", href: "/new-cars", icon: Car },
        { name: "Post de Carro", href: "/car-post", icon: Camera },
      ]
    }
  ];

  const isActive = (href: string) => {
    return location.pathname === href || (href === '/metrics' && location.pathname === '/');
  };

  return (
    <div className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Car className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            Alvorada Veículos
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6">
        {navigationItems.map((section) => (
          <div key={section.title}>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive(item.href)
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              A
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              Admin
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              admin@alvorada.com
            </p>
          </div>
        </div>
        <button className="w-full mt-3 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          Administrador
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
