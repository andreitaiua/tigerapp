import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ItemDetailsPanel = ({ 
  item,
  isOpen = false,
  onClose,
  onEdit,
  onReorder
}) => {
  const [activeTab, setActiveTab] = useState('details');

  if (!isOpen || !item) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(price);
  };

  const getStockLevelColor = (current, minimum) => {
    const ratio = current / minimum;
    if (current === 0) return 'text-destructive';
    if (ratio <= 1) return 'text-destructive';
    if (ratio <= 2) return 'text-warning';
    return 'text-success';
  };

  const getStockLevelText = (current, minimum) => {
    if (current === 0) return 'Sem Estoque';
    if (current <= minimum) return 'Crítico';
    if (current <= minimum * 2) return 'Baixo';
    return 'Normal';
  };

  const mockUsageHistory = [
    {
      id: 1,
      date: '2025-01-20',
      workOrder: 'OS-2025-001',
      customer: 'João Silva',
      quantity: 2,
      mechanic: 'Carlos Santos'
    },
    {
      id: 2,
      date: '2025-01-18',
      workOrder: 'OS-2025-002',
      customer: 'Maria Oliveira',
      quantity: 1,
      mechanic: 'Pedro Lima'
    },
    {
      id: 3,
      date: '2025-01-15',
      workOrder: 'OS-2025-003',
      customer: 'Roberto Costa',
      quantity: 3,
      mechanic: 'Ana Ferreira'
    }
  ];

  const mockStockMovements = [
    {
      id: 1,
      date: '2025-01-22',
      type: 'entrada',
      quantity: 50,
      reason: 'Compra - Fornecedor ABC',
      user: 'Admin'
    },
    {
      id: 2,
      date: '2025-01-20',
      type: 'saida',
      quantity: -2,
      reason: 'OS-2025-001 - João Silva',
      user: 'Carlos Santos'
    },
    {
      id: 3,
      date: '2025-01-18',
      type: 'saida',
      quantity: -1,
      reason: 'OS-2025-002 - Maria Oliveira',
      user: 'Pedro Lima'
    }
  ];

  const tabs = [
    { id: 'details', label: 'Detalhes', icon: 'Info' },
    { id: 'usage', label: 'Histórico de Uso', icon: 'History' },
    { id: 'movements', label: 'Movimentações', icon: 'TrendingUp' },
    { id: 'supplier', label: 'Fornecedor', icon: 'Truck' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-1030 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-muted rounded-md overflow-hidden">
              <Image
                src={item?.image}
                alt={item?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{item?.name}</h2>
              <p className="text-muted-foreground">{item?.code}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              iconName="Edit"
              onClick={() => onEdit(item)}
            >
              Editar
            </Button>
            <Button
              variant="ghost"
              iconName="X"
              onClick={onClose}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex space-x-1 p-1">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Informações Básicas</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nome:</span>
                    <span className="font-medium">{item?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Código:</span>
                    <span className="font-mono">{item?.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Categoria:</span>
                    <span>{item?.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Descrição:</span>
                    <span className="text-right max-w-xs">{item?.description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Marca:</span>
                    <span>{item?.brand || 'Não informado'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Modelo:</span>
                    <span>{item?.model || 'Não informado'}</span>
                  </div>
                </div>
              </div>

              {/* Stock and Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Estoque e Preços</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Estoque Atual:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{item?.currentStock} un</span>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          getStockLevelColor(item?.currentStock, item?.minimumStock) === 'text-destructive' ?'bg-destructive/10 text-destructive'
                            : getStockLevelColor(item?.currentStock, item?.minimumStock) === 'text-warning' ?'bg-warning/10 text-warning' :'bg-success/10 text-success'
                        }`}
                      >
                        {getStockLevelText(item?.currentStock, item?.minimumStock)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estoque Mínimo:</span>
                    <span className="font-medium">{item?.minimumStock} un</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Preço Unitário:</span>
                    <span className="font-medium text-lg">{formatPrice(item?.unitPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor Total:</span>
                    <span className="font-medium">{formatPrice(item?.unitPrice * item?.currentStock)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Localização:</span>
                    <span>{item?.location || 'A1-B2-C3'}</span>
                  </div>
                </div>

                {/* Reorder Alert */}
                {item?.currentStock <= item?.minimumStock && (
                  <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-md">
                    <div className="flex items-center space-x-2">
                      <Icon name="AlertTriangle" size={16} className="text-warning" />
                      <span className="text-sm font-medium text-warning">
                        Estoque baixo - Recomenda-se reposição
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="ShoppingCart"
                      onClick={() => onReorder(item)}
                      className="mt-2"
                    >
                      Solicitar Reposição
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'usage' && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Histórico de Uso</h3>
              <div className="space-y-3">
                {mockUsageHistory?.map((usage) => (
                  <div key={usage?.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <div>
                      <div className="font-medium">{usage?.workOrder}</div>
                      <div className="text-sm text-muted-foreground">
                        {usage?.customer} • {usage?.mechanic}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{usage?.quantity} un</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(usage.date)?.toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'movements' && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Movimentações de Estoque</h3>
              <div className="space-y-3">
                {mockStockMovements?.map((movement) => (
                  <div key={movement?.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        movement?.type === 'entrada' ? 'bg-success' : 'bg-destructive'
                      }`}></div>
                      <div>
                        <div className="font-medium">{movement?.reason}</div>
                        <div className="text-sm text-muted-foreground">
                          {movement?.user} • {new Date(movement.date)?.toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                    <div className={`font-medium ${
                      movement?.type === 'entrada' ? 'text-success' : 'text-destructive'
                    }`}>
                      {movement?.type === 'entrada' ? '+' : ''}{movement?.quantity} un
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'supplier' && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Informações do Fornecedor</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fornecedor:</span>
                    <span className="font-medium">{item?.supplier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contato:</span>
                    <span>(11) 9999-8888</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>contato@{item?.supplier?.toLowerCase()?.replace(' ', '')}.com.br</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Prazo de Entrega:</span>
                    <span>5-7 dias úteis</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Última Compra:</span>
                    <span>22/01/2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantidade:</span>
                    <span>50 un</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Preço Unitário:</span>
                    <span>{formatPrice(item?.unitPrice * 0.8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Desconto:</span>
                    <span className="text-success">15% (pedidos &gt; 30 un)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsPanel;