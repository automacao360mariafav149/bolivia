
import React from 'react';
import { User, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Employee {
  id: number;
  nome: string;
  telefone: string;
}

interface EmployeesPanelProps {
  employees: Employee[];
  loading: boolean;
}

const EmployeesPanel = ({ employees, loading }: EmployeesPanelProps) => {
  return (
    <Card className="h-full dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 dark:text-white">
          <User className="h-5 w-5" />
          Funcionários
        </CardTitle>
        <CardDescription className="dark:text-gray-400">
          Lista de funcionários cadastrados
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="p-4">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="h-6 w-6 border-4 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
              </div>
            ) : employees.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Nenhum funcionário cadastrado.
              </div>
            ) : (
              <div className="space-y-3">
                {employees.map((employee) => (
                  <div key={employee.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {employee.nome}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="h-3 w-3" />
                      <span>{employee.telefone}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default EmployeesPanel;
