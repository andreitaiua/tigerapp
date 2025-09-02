import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentWorkOrdersTable = ({ workOrders = [], loading = false }) => {
  const statusConfig = {
    'aguardando': { label: 'Aguardando', color: 'bg-warning/10 text-warning', icon: 'Clock' },
    'em_andamento': { label: 'Em Andamento', color: 'bg-primary/10 text-primary', icon: 'Wrench' },
    'concluido': { label: 'Concluído', color: 'bg-success/10 text-success', icon: 'CheckCircle' },
    'cancelado': { label: 'Cancelado', color: 'bg-error/10 text-error', icon: 'XCircle' }
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(value);
  };

  if (loading) {
    return (
      <div className="bg-card rounded-lg p-6 card-shadow">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-muted rounded w-48 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(5)]?.map((_, i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="h-4 bg-muted rounded w-16"></div>
              <div className="h-4 bg-muted rounded w-32"></div>
              <div className="h-4 bg-muted rounded w-24"></div>
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="h-4 bg-muted rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-6 card-shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Ordens de Serviço Recentes</h3>
        <button className="text-sm text-primary hover:text-primary/80 font-medium">
          Ver todas
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">OS</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Cliente</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Veículo</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Valor</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Previsão</th>
            </tr>
          </thead>
          <tbody>
            {workOrders?.map((order) => {
              const status = statusConfig?.[order?.status] || statusConfig?.aguardando;
              return (
                <tr key={order?.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-2">
                    <span className="font-medium text-foreground">#{order?.id}</span>
                  </td>
                  <td className="py-3 px-2">
                    <div>
                      <p className="font-medium text-foreground">{order?.customerName}</p>
                      <p className="text-sm text-muted-foreground">{order?.customerPhone}</p>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <div>
                      <p className="font-medium text-foreground">{order?.vehicle?.brand} {order?.vehicle?.model}</p>
                      <p className="text-sm text-muted-foreground">{order?.vehicle?.year} • {order?.vehicle?.plate}</p>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${status?.color}`}>
                      <Icon name={status?.icon} size={12} />
                      <span>{status?.label}</span>
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="font-medium text-foreground">{formatCurrency(order?.totalValue)}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm text-muted-foreground">{formatDate(order?.estimatedCompletion)}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {workOrders?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhuma ordem de serviço encontrada</p>
        </div>
      )}
    </div>
  );
};

export default RecentWorkOrdersTable;