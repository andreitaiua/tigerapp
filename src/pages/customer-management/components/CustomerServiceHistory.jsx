import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const CustomerServiceHistory = ({ customer }) => {
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success/10 text-success';
      case 'in_progress':
        return 'bg-warning/10 text-warning';
      case 'pending':
        return 'bg-muted text-muted-foreground';
      case 'cancelled':
        return 'bg-error/10 text-error';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'in_progress':
        return 'Em Andamento';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };

  const sortedServices = [...(customer?.serviceHistory || [])]?.sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'date':
        aValue = new Date(a.date);
        bValue = new Date(b.date);
        break;
      case 'amount':
        aValue = a?.totalAmount;
        bValue = b?.totalAmount;
        break;
      case 'os':
        aValue = a?.osNumber;
        bValue = b?.osNumber;
        break;
      default:
        aValue = new Date(a.date);
        bValue = new Date(b.date);
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  if (!customer?.serviceHistory || customer?.serviceHistory?.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-64">
        <Icon name="Wrench" size={48} className="text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          Nenhum Serviço Realizado
        </h3>
        <p className="text-muted-foreground text-center">
          Este cliente ainda não possui histórico de serviços
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Sort Controls */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-medium text-foreground">
          Histórico de Serviços ({customer?.serviceHistory?.length})
        </h3>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Ordenar por:</span>
          <div className="flex space-x-1">
            {[
              { key: 'date', label: 'Data' },
              { key: 'os', label: 'OS' },
              { key: 'amount', label: 'Valor' }
            ]?.map((option) => (
              <button
                key={option?.key}
                onClick={() => handleSort(option?.key)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 ${
                  sortBy === option?.key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {option?.label}
                {sortBy === option?.key && (
                  <Icon 
                    name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                    size={12} 
                    className="ml-1 inline"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Services List */}
      <div className="space-y-4">
        {sortedServices?.map((service, index) => (
          <div key={index} className="bg-muted/30 rounded-lg p-4 border border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="FileText" size={16} color="white" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">OS #{service?.osNumber}</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(service.date)?.toLocaleDateString('pt-BR')} • {service?.vehicle}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className={`px-2 py-1 rounded-full text-xs font-medium mb-1 ${getStatusColor(service?.status)}`}>
                  {getStatusLabel(service?.status)}
                </div>
                <p className="text-lg font-semibold text-foreground">
                  R$ {service?.totalAmount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Services Performed */}
            <div className="mb-3">
              <p className="text-sm font-medium text-foreground mb-2">Serviços Realizados:</p>
              <div className="flex flex-wrap gap-2">
                {service?.services?.map((serviceItem, serviceIndex) => (
                  <span
                    key={serviceIndex}
                    className="px-2 py-1 bg-card rounded-md text-xs text-foreground border border-border"
                  >
                    {serviceItem}
                  </span>
                ))}
              </div>
            </div>

            {/* Parts Used */}
            {service?.parts && service?.parts?.length > 0 && (
              <div className="mb-3">
                <p className="text-sm font-medium text-foreground mb-2">Peças Utilizadas:</p>
                <div className="space-y-1">
                  {service?.parts?.map((part, partIndex) => (
                    <div key={partIndex} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {part?.quantity}x {part?.name}
                      </span>
                      <span className="font-medium text-foreground">
                        R$ {part?.unitPrice?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
              <span>Mecânico: {service?.mechanic}</span>
              {service?.warranty && (
                <span className="flex items-center space-x-1">
                  <Icon name="Shield" size={12} />
                  <span>Garantia: {service?.warranty} dias</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerServiceHistory;