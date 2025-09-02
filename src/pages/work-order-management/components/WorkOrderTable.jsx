import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WorkOrderTable = ({ 
  workOrders = [], 
  onSelectWorkOrder = () => {},
  selectedWorkOrder = null,
  onStatusUpdate = () => {},
  onPrint = () => {},
  onBulkAction = () => {}
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedOrders, setSelectedOrders] = useState([]);

  const statusColors = {
    'Aguardando': 'bg-warning/10 text-warning border-warning/20',
    'Em Andamento': 'bg-primary/10 text-primary border-primary/20',
    'Concluído': 'bg-success/10 text-success border-success/20',
    'Cancelado': 'bg-destructive/10 text-destructive border-destructive/20'
  };

  const sortedOrders = useMemo(() => {
    if (!sortConfig?.key) return workOrders;

    return [...workOrders]?.sort((a, b) => {
      const aValue = a?.[sortConfig?.key];
      const bValue = b?.[sortConfig?.key];

      if (aValue < bValue) return sortConfig?.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig?.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [workOrders, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedOrders(workOrders?.map(order => order?.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId, checked) => {
    if (checked) {
      setSelectedOrders(prev => [...prev, orderId]);
    } else {
      setSelectedOrders(prev => prev?.filter(id => id !== orderId));
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(value);
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('pt-BR');
  };

  const getSortIcon = (key) => {
    if (sortConfig?.key !== key) return 'ArrowUpDown';
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Bulk Actions */}
      {selectedOrders?.length > 0 && (
        <div className="bg-muted/50 px-6 py-3 border-b border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {selectedOrders?.length} ordem(ns) selecionada(s)
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('status-update', selectedOrders)}
              >
                Atualizar Status
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('print', selectedOrders)}
              >
                Imprimir Selecionadas
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="w-12 px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedOrders?.length === workOrders?.length && workOrders?.length > 0}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                  className="rounded border-border"
                />
              </th>
              <th className="text-left px-6 py-4">
                <button
                  onClick={() => handleSort('osNumber')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>OS Nº</span>
                  <Icon name={getSortIcon('osNumber')} size={14} />
                </button>
              </th>
              <th className="text-left px-6 py-4">
                <button
                  onClick={() => handleSort('customerName')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Cliente</span>
                  <Icon name={getSortIcon('customerName')} size={14} />
                </button>
              </th>
              <th className="text-left px-6 py-4">
                <span className="text-sm font-medium text-foreground">Veículo</span>
              </th>
              <th className="text-left px-6 py-4">
                <button
                  onClick={() => handleSort('mechanic')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Mecânico</span>
                  <Icon name={getSortIcon('mechanic')} size={14} />
                </button>
              </th>
              <th className="text-left px-6 py-4">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Status</span>
                  <Icon name={getSortIcon('status')} size={14} />
                </button>
              </th>
              <th className="text-left px-6 py-4">
                <button
                  onClick={() => handleSort('estimatedCompletion')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Previsão</span>
                  <Icon name={getSortIcon('estimatedCompletion')} size={14} />
                </button>
              </th>
              <th className="text-left px-6 py-4">
                <button
                  onClick={() => handleSort('totalValue')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Valor Total</span>
                  <Icon name={getSortIcon('totalValue')} size={14} />
                </button>
              </th>
              <th className="text-center px-6 py-4">
                <span className="text-sm font-medium text-foreground">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders?.map((order) => (
              <tr
                key={order?.id}
                className={`border-t border-border hover:bg-muted/30 cursor-pointer ${
                  selectedWorkOrder?.id === order?.id ? 'bg-primary/5' : ''
                }`}
                onClick={() => onSelectWorkOrder(order)}
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders?.includes(order?.id)}
                    onChange={(e) => {
                      e?.stopPropagation();
                      handleSelectOrder(order?.id, e?.target?.checked);
                    }}
                    className="rounded border-border"
                  />
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-foreground">#{order?.osNumber}</span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-foreground">{order?.customerName}</div>
                    <div className="text-sm text-muted-foreground">{order?.customerPhone}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-foreground">{order?.vehicle?.brand} {order?.vehicle?.model}</div>
                    <div className="text-sm text-muted-foreground">{order?.vehicle?.year} • {order?.vehicle?.plate}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="User" size={14} className="text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{order?.mechanic}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors?.[order?.status]}`}>
                    {order?.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-foreground">{formatDate(order?.estimatedCompletion)}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-foreground">{formatCurrency(order?.totalValue)}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onPrint(order);
                      }}
                    >
                      <Icon name="Printer" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onStatusUpdate(order);
                      }}
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {workOrders?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma ordem de serviço encontrada</h3>
          <p className="text-muted-foreground">Crie uma nova OS para começar</p>
        </div>
      )}
    </div>
  );
};

export default WorkOrderTable;