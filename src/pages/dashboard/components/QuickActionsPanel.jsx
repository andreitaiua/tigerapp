import React from 'react';
import { useNavigate } from 'react-router-dom';

import Icon from '../../../components/AppIcon';

const QuickActionsPanel = ({ userRole = 'manager' }) => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'new-work-order',
      title: 'Nova OS',
      description: 'Criar nova ordem de serviço',
      icon: 'Plus',
      color: 'primary',
      path: '/work-order-management',
      roles: ['mechanic', 'manager', 'cashier']
    },
    {
      id: 'new-customer',
      title: 'Cadastrar Cliente',
      description: 'Adicionar novo cliente',
      icon: 'UserPlus',
      color: 'success',
      path: '/customer-management',
      roles: ['manager', 'cashier']
    },
    {
      id: 'inventory-entry',
      title: 'Entrada de Estoque',
      description: 'Registrar entrada de peças',
      icon: 'Package',
      color: 'warning',
      path: '/inventory-management',
      roles: ['manager', 'cashier']
    },
    {
      id: 'financial-report',
      title: 'Relatório Financeiro',
      description: 'Visualizar relatórios',
      icon: 'BarChart3',
      color: 'secondary',
      path: '/financial-dashboard',
      roles: ['manager']
    }
  ];

  const filteredActions = actions?.filter(action => 
    action?.roles?.includes(userRole)
  );

  const handleActionClick = (path) => {
    navigate(path);
  };

  return (
    <div className="bg-card rounded-lg p-6 card-shadow">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Zap" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Ações Rápidas</h3>
      </div>
      <div className="space-y-4">
        {filteredActions?.map((action) => (
          <div
            key={action?.id}
            className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
            onClick={() => handleActionClick(action?.path)}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                action?.color === 'primary' ? 'bg-primary/10 text-primary' :
                action?.color === 'success' ? 'bg-success/10 text-success' :
                action?.color === 'warning'? 'bg-warning/10 text-warning' : 'bg-secondary/10 text-secondary'
              }`}>
                <Icon name={action?.icon} size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {action?.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {action?.description}
                </p>
              </div>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-border">
        <h4 className="font-medium text-foreground mb-3">Atalhos do Teclado</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Nova OS</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + N</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Buscar Cliente</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + F</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Estoque</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + I</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsPanel;