import React, { useState } from 'react';

import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const InventoryGrid = ({ 
  items = [],
  viewMode = 'grid',
  selectedItems = [],
  onItemSelect,
  onItemClick,
  onQuickEdit
}) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const getStockLevelColor = (current, minimum) => {
    const ratio = current / minimum;
    if (current === 0) return 'text-destructive bg-destructive/10';
    if (ratio <= 1) return 'text-destructive bg-destructive/10';
    if (ratio <= 2) return 'text-warning bg-warning/10';
    return 'text-success bg-success/10';
  };

  const getStockLevelText = (current, minimum) => {
    if (current === 0) return 'Sem Estoque';
    if (current <= minimum) return 'Crítico';
    if (current <= minimum * 2) return 'Baixo';
    return 'Normal';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(price);
  };

  const handleItemSelect = (itemId, checked) => {
    onItemSelect(itemId, checked);
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-card rounded-md border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="w-12 p-3 text-left">
                  <Checkbox />
                </th>
                <th className="p-3 text-left text-sm font-medium text-muted-foreground">Produto</th>
                <th className="p-3 text-left text-sm font-medium text-muted-foreground">Código</th>
                <th className="p-3 text-left text-sm font-medium text-muted-foreground">Categoria</th>
                <th className="p-3 text-left text-sm font-medium text-muted-foreground">Estoque</th>
                <th className="p-3 text-left text-sm font-medium text-muted-foreground">Preço</th>
                <th className="p-3 text-left text-sm font-medium text-muted-foreground">Fornecedor</th>
                <th className="w-24 p-3 text-center text-sm font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items?.map((item) => (
                <tr 
                  key={item?.id}
                  className="border-b border-border hover:bg-muted/30 transition-colors duration-200"
                >
                  <td className="p-3">
                    <Checkbox
                      checked={selectedItems?.includes(item?.id)}
                      onChange={(e) => handleItemSelect(item?.id, e?.target?.checked)}
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-muted rounded-md overflow-hidden">
                        <Image
                          src={item?.image}
                          alt={item?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{item?.name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {item?.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="font-mono text-sm">{item?.code}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-muted-foreground">{item?.category}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{item?.currentStock}</span>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          getStockLevelColor(item?.currentStock, item?.minimumStock)
                        }`}
                      >
                        {getStockLevelText(item?.currentStock, item?.minimumStock)}
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="font-medium">{formatPrice(item?.unitPrice)}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-muted-foreground">{item?.supplier}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Edit"
                        onClick={() => onQuickEdit(item)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Eye"
                        onClick={() => onItemClick(item)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items?.map((item) => (
        <div
          key={item?.id}
          className="bg-card border border-border rounded-md overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer"
          onMouseEnter={() => setHoveredItem(item?.id)}
          onMouseLeave={() => setHoveredItem(null)}
          onClick={() => onItemClick(item)}
        >
          {/* Image and Selection */}
          <div className="relative">
            <div className="aspect-square bg-muted overflow-hidden">
              <Image
                src={item?.image}
                alt={item?.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Selection Checkbox */}
            <div className="absolute top-2 left-2">
              <Checkbox
                checked={selectedItems?.includes(item?.id)}
                onChange={(e) => {
                  e?.stopPropagation();
                  handleItemSelect(item?.id, e?.target?.checked);
                }}
                className="bg-background/80 backdrop-blur-sm"
              />
            </div>

            {/* Stock Level Badge */}
            <div className="absolute top-2 right-2">
              <span 
                className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                  getStockLevelColor(item?.currentStock, item?.minimumStock)
                }`}
              >
                {getStockLevelText(item?.currentStock, item?.minimumStock)}
              </span>
            </div>

            {/* Quick Actions Overlay */}
            {hoveredItem === item?.id && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  iconName="Edit"
                  onClick={(e) => {
                    e?.stopPropagation();
                    onQuickEdit(item);
                  }}
                >
                  Editar
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  iconName="Eye"
                  onClick={(e) => {
                    e?.stopPropagation();
                    onItemClick(item);
                  }}
                >
                  Ver
                </Button>
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="p-4">
            <div className="mb-2">
              <h3 className="font-medium text-foreground truncate" title={item?.name}>
                {item?.name}
              </h3>
              <p className="text-sm text-muted-foreground truncate" title={item?.description}>
                {item?.description}
              </p>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Código:</span>
                <span className="font-mono">{item?.code}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Categoria:</span>
                <span>{item?.category}</span>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Estoque Atual:</span>
                <span className="font-medium">{item?.currentStock} un</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Estoque Mínimo:</span>
                <span>{item?.minimumStock} un</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-foreground">
                {formatPrice(item?.unitPrice)}
              </div>
              <div className="text-sm text-muted-foreground">
                {item?.supplier}
              </div>
            </div>

            {/* Last Updated */}
            <div className="mt-2 pt-2 border-t border-border">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Atualizado em:</span>
                <span>{new Date(item.lastUpdated)?.toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InventoryGrid;