import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const InventoryToolbar = ({ 
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onAddItem,
  onBulkActions,
  selectedItems = []
}) => {
  const [showBulkActions, setShowBulkActions] = useState(false);

  const sortOptions = [
    { value: 'name', label: 'Nome A-Z' },
    { value: 'name-desc', label: 'Nome Z-A' },
    { value: 'stock-low', label: 'Menor Estoque' },
    { value: 'stock-high', label: 'Maior Estoque' },
    { value: 'price-low', label: 'Menor Preço' },
    { value: 'price-high', label: 'Maior Preço' },
    { value: 'updated', label: 'Recém Atualizados' }
  ];

  const stockLevelOptions = [
    { value: 'all', label: 'Todos os Níveis' },
    { value: 'normal', label: 'Estoque Normal' },
    { value: 'low', label: 'Estoque Baixo' },
    { value: 'critical', label: 'Estoque Crítico' },
    { value: 'out', label: 'Sem Estoque' }
  ];

  const handleBulkAction = (action) => {
    onBulkActions(action, selectedItems);
    setShowBulkActions(false);
  };

  return (
    <div className="bg-card border-b border-border">
      <div className="p-4">
        {/* Main Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Left Section - Search and Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-1">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Icon 
                  name="Search" 
                  size={18} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  type="search"
                  placeholder="Buscar por código, nome ou descrição..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e?.target?.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="w-full sm:w-48">
              <Select
                options={sortOptions}
                value={sortBy}
                onChange={onSortChange}
                placeholder="Ordenar por"
              />
            </div>

            {/* Stock Level Filter */}
            <div className="w-full sm:w-48">
              <Select
                options={stockLevelOptions}
                value="all"
                onChange={() => {}}
                placeholder="Nível de estoque"
              />
            </div>
          </div>

          {/* Right Section - Actions and View Mode */}
          <div className="flex items-center space-x-3">
            {/* View Mode Toggle */}
            <div className="hidden md:flex bg-muted rounded-md p-1">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded transition-colors duration-200 ${
                  viewMode === 'grid' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name="Grid3X3" size={18} />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded transition-colors duration-200 ${
                  viewMode === 'list' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name="List" size={18} />
              </button>
            </div>

            {/* Add Item Button */}
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              onClick={onAddItem}
              className="hidden sm:flex"
            >
              Novo Item
            </Button>

            {/* Mobile Add Button */}
            <Button
              variant="default"
              iconName="Plus"
              onClick={onAddItem}
              className="sm:hidden"
            />
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedItems?.length > 0 && (
          <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <Icon name="CheckSquare" size={18} className="text-primary" />
                <span className="text-sm font-medium text-primary">
                  {selectedItems?.length} {selectedItems?.length === 1 ? 'item selecionado' : 'itens selecionados'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Edit"
                  onClick={() => handleBulkAction('edit')}
                >
                  Editar Preços
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Package"
                  onClick={() => handleBulkAction('stock')}
                >
                  Ajustar Estoque
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Tag"
                  onClick={() => handleBulkAction('category')}
                >
                  Alterar Categoria
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  iconName="Trash2"
                  onClick={() => handleBulkAction('delete')}
                >
                  Excluir
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-muted/50 rounded-md p-3">
            <div className="flex items-center space-x-2">
              <Icon name="Package" size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total de Itens</span>
            </div>
            <div className="mt-1 text-lg font-semibold text-foreground">1.247</div>
          </div>
          
          <div className="bg-warning/10 rounded-md p-3">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-warning" />
              <span className="text-sm text-warning">Estoque Baixo</span>
            </div>
            <div className="mt-1 text-lg font-semibold text-warning">23</div>
          </div>
          
          <div className="bg-destructive/10 rounded-md p-3">
            <div className="flex items-center space-x-2">
              <Icon name="XCircle" size={16} className="text-destructive" />
              <span className="text-sm text-destructive">Sem Estoque</span>
            </div>
            <div className="mt-1 text-lg font-semibold text-destructive">7</div>
          </div>
          
          <div className="bg-success/10 rounded-md p-3">
            <div className="flex items-center space-x-2">
              <Icon name="TrendingUp" size={16} className="text-success" />
              <span className="text-sm text-success">Valor Total</span>
            </div>
            <div className="mt-1 text-lg font-semibold text-success">R$ 89.450</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryToolbar;