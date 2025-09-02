import React, { useState } from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';


const WorkOrderFilters = ({ 
  onFilterChange = () => {},
  onClearFilters = () => {},
  filters = {}
}) => {
  const [localFilters, setLocalFilters] = useState({
    status: '',
    mechanic: '',
    dateFrom: '',
    dateTo: '',
    serviceType: '',
    search: '',
    ...filters
  });

  const statusOptions = [
    { value: '', label: 'Todos os Status' },
    { value: 'Aguardando', label: 'Aguardando' },
    { value: 'Em Andamento', label: 'Em Andamento' },
    { value: 'Concluído', label: 'Concluído' },
    { value: 'Cancelado', label: 'Cancelado' }
  ];

  const mechanicOptions = [
    { value: '', label: 'Todos os Mecânicos' },
    { value: 'Carlos Silva', label: 'Carlos Silva' },
    { value: 'João Santos', label: 'João Santos' },
    { value: 'Pedro Oliveira', label: 'Pedro Oliveira' },
    { value: 'Ana Costa', label: 'Ana Costa' },
    { value: 'Roberto Lima', label: 'Roberto Lima' }
  ];

  const serviceTypeOptions = [
    { value: '', label: 'Todos os Serviços' },
    { value: 'Revisão', label: 'Revisão' },
    { value: 'Troca de Óleo', label: 'Troca de Óleo' },
    { value: 'Freios', label: 'Freios' },
    { value: 'Suspensão', label: 'Suspensão' },
    { value: 'Motor', label: 'Motor' },
    { value: 'Elétrica', label: 'Elétrica' },
    { value: 'Ar Condicionado', label: 'Ar Condicionado' },
    { value: 'Pneus', label: 'Pneus' }
  ];

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      status: '',
      mechanic: '',
      dateFrom: '',
      dateTo: '',
      serviceType: '',
      search: ''
    };
    setLocalFilters(clearedFilters);
    onClearFilters();
  };

  const hasActiveFilters = Object.values(localFilters)?.some(value => value !== '');

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Filtros</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            iconName="X"
            iconPosition="left"
          >
            Limpar Filtros
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Search */}
        <div className="xl:col-span-2">
          <Input
            type="search"
            placeholder="Buscar por cliente, OS ou placa..."
            value={localFilters?.search}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Status Filter */}
        <Select
          placeholder="Status"
          options={statusOptions}
          value={localFilters?.status}
          onChange={(value) => handleFilterChange('status', value)}
        />

        {/* Mechanic Filter */}
        <Select
          placeholder="Mecânico"
          options={mechanicOptions}
          value={localFilters?.mechanic}
          onChange={(value) => handleFilterChange('mechanic', value)}
          searchable
        />

        {/* Service Type Filter */}
        <Select
          placeholder="Tipo de Serviço"
          options={serviceTypeOptions}
          value={localFilters?.serviceType}
          onChange={(value) => handleFilterChange('serviceType', value)}
          searchable
        />

        {/* Date Range */}
        <div className="flex items-center space-x-2">
          <Input
            type="date"
            placeholder="Data inicial"
            value={localFilters?.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
          />
          <span className="text-muted-foreground">até</span>
          <Input
            type="date"
            placeholder="Data final"
            value={localFilters?.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
          />
        </div>
      </div>
      {/* Quick Filters */}
      <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-border">
        <span className="text-sm text-muted-foreground">Filtros rápidos:</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFilterChange('status', 'Aguardando')}
          className={localFilters?.status === 'Aguardando' ? 'bg-warning/10 border-warning text-warning' : ''}
        >
          Aguardando
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFilterChange('status', 'Em Andamento')}
          className={localFilters?.status === 'Em Andamento' ? 'bg-primary/10 border-primary text-primary' : ''}
        >
          Em Andamento
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFilterChange('status', 'Concluído')}
          className={localFilters?.status === 'Concluído' ? 'bg-success/10 border-success text-success' : ''}
        >
          Concluído
        </Button>
      </div>
    </div>
  );
};

export default WorkOrderFilters;