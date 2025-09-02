import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import CustomerPersonalInfo from './CustomerPersonalInfo';
import CustomerVehicleHistory from './CustomerVehicleHistory';
import CustomerServiceHistory from './CustomerServiceHistory';
import CustomerFinancialSummary from './CustomerFinancialSummary';

const CustomerProfilePanel = ({ 
  customer = null,
  onEdit = () => {},
  onCreateWorkOrder = () => {}
}) => {
  const [activeTab, setActiveTab] = useState('personal');

  const tabs = [
    { id: 'personal', label: 'Informações Pessoais', icon: 'User' },
    { id: 'vehicles', label: 'Veículos', icon: 'Car' },
    { id: 'services', label: 'Histórico de Serviços', icon: 'Wrench' },
    { id: 'financial', label: 'Resumo Financeiro', icon: 'DollarSign' }
  ];

  if (!customer) {
    return (
      <div className="bg-card rounded-lg border border-border h-full flex items-center justify-center">
        <div className="text-center p-8">
          <Icon name="Users" size={64} className="text-muted-foreground mb-4 mx-auto" />
          <h3 className="text-xl font-medium text-foreground mb-2">
            Selecione um Cliente
          </h3>
          <p className="text-muted-foreground">
            Escolha um cliente na lista ao lado para visualizar suas informações detalhadas
          </p>
        </div>
      </div>
    );
  }

  const formatCPF = (cpf) => {
    const cleaned = cpf?.replace(/\D/g, '');
    return cleaned?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (phone) => {
    const cleaned = phone?.replace(/\D/g, '');
    if (cleaned?.length === 11) {
      return `(${cleaned?.slice(0, 2)}) ${cleaned?.slice(2, 7)}-${cleaned?.slice(7)}`;
    }
    return phone;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return <CustomerPersonalInfo customer={customer} />;
      case 'vehicles':
        return <CustomerVehicleHistory customer={customer} />;
      case 'services':
        return <CustomerServiceHistory customer={customer} />;
      case 'financial':
        return <CustomerFinancialSummary customer={customer} />;
      default:
        return <CustomerPersonalInfo customer={customer} />;
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Icon name="User" size={24} color="white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{customer?.name}</h2>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                <span>{formatPhone(customer?.phone)}</span>
                <span>•</span>
                <span>CPF: {formatCPF(customer?.cpf)}</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  customer?.status === 'active' ?'bg-success/10 text-success' :'bg-muted text-muted-foreground'
                }`}>
                  {customer?.status === 'active' ? 'Cliente Ativo' : 'Cliente Inativo'}
                </div>
                <span className="text-xs text-muted-foreground">
                  Cliente desde {new Date(customer.createdAt)?.toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              iconName="Edit"
              iconPosition="left"
              onClick={() => onEdit(customer)}
            >
              Editar
            </Button>
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              onClick={() => onCreateWorkOrder(customer)}
            >
              Nova OS
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === tab?.id
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span className="hidden sm:inline">{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default CustomerProfilePanel;