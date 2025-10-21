
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Car, Search, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useVehicleStock } from '@/hooks/useVehicleStock';
import AddVehicleDialog from '@/components/vehicle/AddVehicleDialog';

const VehicleStockDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { vehicles, loading, totalVehicles, refetchVehicles } = useVehicleStock();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.ano.includes(searchTerm) ||
    vehicle.cor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vehicle.status && vehicle.status.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatPrice = (price: string) => {
    if (!price) return 'N/A';
    const numericPrice = parseFloat(price.replace(/[^\d,]/g, '').replace(',', '.'));
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numericPrice);
  };

  const formatKm = (km: string) => {
    if (!km) return 'N/A';
    const numericKm = parseInt(km.replace(/\D/g, ''));
    return new Intl.NumberFormat('pt-BR').format(numericKm) + ' km';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return 'N/A';
    }
  };

  const getStatusBadge = (status: string) => {
    if (!status) return <Badge variant="outline">N/A</Badge>;
    
    const statusLower = status.toLowerCase();
    if (statusLower === 'disponível' || statusLower === 'disponivel') {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Disponível</Badge>;
    } else if (statusLower === 'vendido') {
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Vendido</Badge>;
    } else if (statusLower === 'reservado') {
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Reservado</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  const openPhotos = (driveId: string) => {
    if (driveId) {
      // Usar URL que abre as fotos em modo de galeria
      window.open(`https://drive.google.com/drive/folders/${driveId}?usp=drive_link`, '_blank');
    }
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
            <Car className="h-8 w-8 text-petshop-gold" />
            <h1 className="text-2xl font-bold">Alvorada Veículos</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-white/10 text-white border-0 px-3 py-1">
              {user?.user_metadata?.name || user?.email}
            </Badge>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Estoque de Veículos
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Gerencie o estoque de veículos disponíveis
            </p>
          </div>
          <div className="flex items-center gap-4">
            <AddVehicleDialog onVehicleAdded={refetchVehicles} />
            <Badge variant="secondary" className="px-4 py-2 text-lg">
              {totalVehicles} veículos
            </Badge>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="mb-6 dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por marca, modelo, ano, cor ou status..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>
          </CardContent>
        </Card>

        {/* Vehicles Table */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <Car className="h-5 w-5" />
              Veículos em Estoque
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              Lista completa dos veículos disponíveis
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="h-8 w-8 border-4 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="dark:text-gray-300">Marca</TableHead>
                        <TableHead className="dark:text-gray-300">Modelo</TableHead>
                        <TableHead className="dark:text-gray-300">Ano</TableHead>
                        <TableHead className="dark:text-gray-300">Cor</TableHead>
                        <TableHead className="dark:text-gray-300">Quilometragem</TableHead>
                        <TableHead className="dark:text-gray-300">Preço</TableHead>
                        <TableHead className="dark:text-gray-300">Status</TableHead>
                        <TableHead className="dark:text-gray-300">Data Cadastro</TableHead>
                        <TableHead className="dark:text-gray-300">Data Venda</TableHead>
                        <TableHead className="dark:text-gray-300">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                  <TableBody>
                    {filteredVehicles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8 text-gray-500 dark:text-gray-400">
                          {searchTerm ? 'Nenhum veículo encontrado com os critérios de busca.' : 'Nenhum veículo cadastrado.'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredVehicles.map((vehicle) => (
                        <TableRow key={vehicle.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <TableCell className="font-medium dark:text-white">
                            {vehicle.marca || 'N/A'}
                          </TableCell>
                          <TableCell className="dark:text-gray-300">
                            {vehicle.modelo || 'N/A'}
                          </TableCell>
                          <TableCell className="dark:text-gray-300">
                            {vehicle.ano || 'N/A'}
                          </TableCell>
                          <TableCell className="dark:text-gray-300">
                            {vehicle.cor || 'N/A'}
                          </TableCell>
                          <TableCell className="dark:text-gray-300">
                            {formatKm(vehicle.Km)}
                          </TableCell>
                          <TableCell className="dark:text-gray-300 font-semibold">
                            {formatPrice(vehicle.preco)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(vehicle.status)}
                          </TableCell>
                          <TableCell className="dark:text-gray-300">
                            {formatDate(vehicle.data_cadastro)}
                          </TableCell>
                          <TableCell className="dark:text-gray-300">
                            {formatDate(vehicle.data_venda)}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openPhotos(vehicle.drive_id)}
                              disabled={!vehicle.drive_id}
                              className="flex items-center gap-2"
                            >
                              <Camera className="h-4 w-4" />
                              Fotos
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default VehicleStockDashboard;
