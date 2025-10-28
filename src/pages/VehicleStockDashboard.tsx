
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Search, Camera, Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useVehicleStock } from '@/hooks/useVehicleStock';
import AddVehicleDialog from '@/components/vehicle/AddVehicleDialog';
import Header from '@/components/layout/Header';
import ImageCarousel from '@/components/vehicle/ImageCarousel';
import DriveGallery from '@/components/vehicle/DriveGallery';

const VehicleStockDashboard = () => {
  const navigate = useNavigate();
  const { vehicles, loading, totalVehicles, refetchVehicles } = useVehicleStock();
  const [searchTerm, setSearchTerm] = useState('');
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<{driveId: string, info: string} | null>(null);

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

  const openPhotos = (driveId: string, marca: string, modelo: string, ano: string) => {
    if (driveId) {
      setSelectedVehicle({
        driveId: driveId,
        info: `${marca} ${modelo} ${ano}`
      });
      setCarouselOpen(true);
    }
  };

  const actionButtons = (
    <>
      <AddVehicleDialog onVehicleAdded={refetchVehicles} />
      <Button variant="outline">
        <Upload className="w-4 h-4 mr-2" />
        Importar Veículos
      </Button>
    </>
  );

  return (
    <div className="flex-1 overflow-auto">
      <Header 
        title="Estoque de Veículos" 
        subtitle="Gerencie todos os seus veículos em um só lugar"
        showSearch={true}
        showActions={true}
        searchPlaceholder="Buscar por marca, modelo, ano, cor ou status..."
        actionButtons={actionButtons}
      />
      
      <main className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold text-blue-600">{totalVehicles}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <Car className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Disponíveis</p>
                <p className="text-2xl font-bold text-green-600">{vehicles.filter(v => v.status?.toLowerCase() === 'disponível' || v.status?.toLowerCase() === 'disponivel').length}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <Car className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Vendidos</p>
                <p className="text-2xl font-bold text-red-600">{vehicles.filter(v => v.status?.toLowerCase() === 'vendido').length}</p>
              </div>
              <div className="p-3 rounded-lg bg-red-50">
                <Car className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Reservados</p>
                <p className="text-2xl font-bold text-yellow-600">{vehicles.filter(v => v.status?.toLowerCase() === 'reservado').length}</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-50">
                <Car className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Page Info */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {filteredVehicles.length} de {totalVehicles} veículos
          </p>
        </div>

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
                              onClick={() => openPhotos(vehicle.drive_id, vehicle.marca, vehicle.modelo, vehicle.ano)}
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

      {/* Galeria de Imagens */}
      {selectedVehicle && (
        <>
          {/* Se o driveId contém vírgula, usa ImageCarousel (IDs individuais) */}
          {/* Se não contém vírgula, usa DriveGallery (ID de pasta) */}
          {selectedVehicle.driveId.includes(',') ? (
            <ImageCarousel
              isOpen={carouselOpen}
              onClose={() => {
                setCarouselOpen(false);
                setSelectedVehicle(null);
              }}
              driveId={selectedVehicle.driveId}
              vehicleInfo={selectedVehicle.info}
            />
          ) : (
            <DriveGallery
              isOpen={carouselOpen}
              onClose={() => {
                setCarouselOpen(false);
                setSelectedVehicle(null);
              }}
              driveId={selectedVehicle.driveId}
              vehicleInfo={selectedVehicle.info}
            />
          )}
        </>
      )}
    </div>
  );
};

export default VehicleStockDashboard;
