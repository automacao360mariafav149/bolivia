
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Link, Save, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from '@/hooks/use-toast';

const Evolution = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [evolutionUrl, setEvolutionUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [instanceName, setInstanceName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    if (!evolutionUrl || !apiKey || !instanceName) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para conectar.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simular conexão (aqui você implementaria a lógica real de conexão)
    setTimeout(() => {
      setIsConnected(true);
      setIsLoading(false);
      toast({
        title: "Conexão estabelecida",
        description: "Evolution conectado com sucesso!",
      });
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setEvolutionUrl('');
    setApiKey('');
    setInstanceName('');
    toast({
      title: "Desconectado",
      description: "Evolution desconectado com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-petshop-blue dark:bg-gray-800 text-white shadow-md transition-colors duration-300">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/dashboard')}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Link className="h-8 w-8 text-petshop-gold" />
            <h1 className="text-2xl font-bold">Alvorada Veículos</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-white/10 text-white border-0 px-3 py-1">
              Alvorada Veículos
            </Badge>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Evolution API
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Configure a conexão com a plataforma Evolution
              </p>
            </div>
            <Badge 
              variant={isConnected ? "default" : "secondary"} 
              className={`px-4 py-2 text-lg ${isConnected ? 'bg-green-500' : ''}`}
            >
              {isConnected ? 'Conectado' : 'Desconectado'}
            </Badge>
          </div>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <Link className="h-5 w-5" />
                Configurações de Conexão
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Insira as credenciais para conectar com o Evolution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isConnected && (
                <Alert className="dark:bg-gray-700 dark:border-gray-600">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="dark:text-gray-300">
                    Certifique-se de ter as credenciais corretas do Evolution API antes de continuar.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="evolutionUrl" className="dark:text-gray-300">URL do Evolution</Label>
                  <Input
                    id="evolutionUrl"
                    type="url"
                    placeholder="https://evolution.exemplo.com"
                    value={evolutionUrl}
                    onChange={(e) => setEvolutionUrl(e.target.value)}
                    disabled={isConnected}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKey" className="dark:text-gray-300">Chave da API</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Sua chave da API"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    disabled={isConnected}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instanceName" className="dark:text-gray-300">Nome da Instância</Label>
                  <Input
                    id="instanceName"
                    type="text"
                    placeholder="Nome da sua instância"
                    value={instanceName}
                    onChange={(e) => setInstanceName(e.target.value)}
                    disabled={isConnected}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                {!isConnected ? (
                  <Button 
                    onClick={handleConnect} 
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    {isLoading ? (
                      <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {isLoading ? 'Conectando...' : 'Conectar'}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleDisconnect} 
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    <AlertCircle className="h-4 w-4" />
                    Desconectar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Evolution;
