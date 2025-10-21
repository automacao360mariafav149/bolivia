import React from 'react';
import { 
  FileText, 
  Settings, 
  Bell,
  Search,
  Plus,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
  showActions?: boolean;
  searchPlaceholder?: string;
  actionButtons?: React.ReactNode;
}

const Header = ({ 
  title, 
  subtitle, 
  showSearch = false, 
  showActions = false,
  searchPlaceholder = "Pesquisar...",
  actionButtons 
}: HeaderProps) => {
  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      {/* Top Header with Icons */}
      <div className="px-6 py-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </div>
          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </div>
          <div className="relative">
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <Bell className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Main Header Content */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          
          {showActions && (
            <div className="flex items-center gap-3">
              {actionButtons || (
                <>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Importar
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {showSearch && (
          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={searchPlaceholder}
                className="pl-10"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
