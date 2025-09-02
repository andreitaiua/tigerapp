import React from 'react';
import Icon from '../../../components/AppIcon';

const AlertsPanel = ({ alerts = [], loading = false }) => {
  const alertConfig = {
    'low_stock': {
      icon: 'AlertTriangle',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      title: 'Estoque Baixo'
    },
    'overdue_payment': {
      icon: 'CreditCard',
      color: 'text-error',
      bgColor: 'bg-error/10',
      title: 'Pagamento Atrasado'
    },
    'maintenance_due': {
      icon: 'Wrench',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      title: 'Manutenção Preventiva'
    },
    'system_update': {
      icon: 'Download',
      color: 'text-success',
      bgColor: 'bg-success/10',
      title: 'Atualização Disponível'
    }
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="bg-card rounded-lg p-6 card-shadow">
        <div className="h-6 bg-muted rounded w-32 animate-pulse mb-4"></div>
        <div className="space-y-3">
          {[...Array(3)]?.map((_, i) => (
            <div key={i} className="flex items-start space-x-3 animate-pulse">
              <div className="w-8 h-8 bg-muted rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-6 card-shadow">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Bell" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Alertas</h3>
        {alerts?.length > 0 && (
          <span className="bg-error text-error-foreground text-xs px-2 py-1 rounded-full font-medium">
            {alerts?.length}
          </span>
        )}
      </div>
      <div className="space-y-3">
        {alerts?.map((alert) => {
          const config = alertConfig?.[alert?.type] || alertConfig?.system_update;
          return (
            <div
              key={alert?.id}
              className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config?.bgColor}`}>
                <Icon name={config?.icon} size={16} className={config?.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground text-sm">{config?.title}</h4>
                  <span className="text-xs text-muted-foreground">{formatDate(alert?.date)}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {alert?.message}
                </p>
                {alert?.action && (
                  <button className="text-xs text-primary hover:text-primary/80 font-medium mt-2">
                    {alert?.action}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {alerts?.length === 0 && (
        <div className="text-center py-6">
          <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Nenhum alerta no momento</p>
          <p className="text-muted-foreground text-xs mt-1">Tudo funcionando perfeitamente!</p>
        </div>
      )}
    </div>
  );
};

export default AlertsPanel;