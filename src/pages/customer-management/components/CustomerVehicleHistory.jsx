import React from 'react';
import Icon from '../../../components/AppIcon';

const CustomerVehicleHistory = ({ customer }) => {
  const getVehicleStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success';
      case 'inactive':
        return 'bg-muted text-muted-foreground';
      case 'maintenance':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getVehicleStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      case 'maintenance':
        return 'Em Manutenção';
      default:
        return 'Desconhecido';
    }
  };

  if (!customer?.vehicles || customer?.vehicles?.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-64">
        <Icon name="Car" size={48} className="text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          Nenhum Veículo Cadastrado
        </h3>
        <p className="text-muted-foreground text-center">
          Este cliente ainda não possui veículos cadastrados no sistema
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {customer?.vehicles?.map((vehicle, index) => (
        <div key={index} className="bg-muted/30 rounded-lg p-4 border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Car" size={20} color="white" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  {vehicle?.brand} {vehicle?.model}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {vehicle?.year} • Placa: {vehicle?.plate}
                </p>
              </div>
            </div>

            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getVehicleStatusColor(vehicle?.status)}`}>
              {getVehicleStatusLabel(vehicle?.status)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Icon name="Palette" size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Cor</p>
                <p className="text-sm font-medium text-foreground">{vehicle?.color}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Icon name="Fuel" size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Combustível</p>
                <p className="text-sm font-medium text-foreground">{vehicle?.fuelType}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Icon name="Hash" size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Chassi</p>
                <p className="text-sm font-medium text-foreground font-mono">
                  {vehicle?.chassis || 'Não informado'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Icon name="Gauge" size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Quilometragem</p>
                <p className="text-sm font-medium text-foreground">
                  {vehicle?.mileage ? `${vehicle?.mileage?.toLocaleString('pt-BR')} km` : 'Não informado'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Icon name="Calendar" size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Último Serviço</p>
                <p className="text-sm font-medium text-foreground">
                  {vehicle?.lastService 
                    ? new Date(vehicle.lastService)?.toLocaleDateString('pt-BR')
                    : 'Nenhum serviço'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Icon name="Wrench" size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Total de Serviços</p>
                <p className="text-sm font-medium text-foreground">
                  {vehicle?.totalServices || 0} serviços
                </p>
              </div>
            </div>
          </div>

          {vehicle?.notes && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-start space-x-2">
                <Icon name="MessageSquare" size={16} className="text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Observações</p>
                  <p className="text-sm text-foreground">{vehicle?.notes}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CustomerVehicleHistory;