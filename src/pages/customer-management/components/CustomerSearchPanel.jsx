import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const CustomerSearchPanel = ({ 
  customers = [], 
  onCustomerSelect = () => {},
  selectedCustomerId = null,
  searchTerm = '',
  onSearchChange = () => {}
}) => {
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  useEffect(() => {
    if (!searchTerm?.trim()) {
      setFilteredCustomers(customers);
      return;
    }

    const filtered = customers?.filter(customer => {
      const searchLower = searchTerm?.toLowerCase();
      return (customer?.name?.toLowerCase()?.includes(searchLower) ||
      customer?.phone?.includes(searchTerm) ||
      customer?.cpf?.includes(searchTerm) || customer?.vehicles?.some(vehicle => 
        vehicle?.model?.toLowerCase()?.includes(searchLower) ||
        vehicle?.plate?.toLowerCase()?.includes(searchLower)
      ));
    });

    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  const formatPhone = (phone) => {
    const cleaned = phone?.replace(/\D/g, '');
    if (cleaned?.length === 11) {
      return `(${cleaned?.slice(0, 2)}) ${cleaned?.slice(2, 7)}-${cleaned?.slice(7)}`;
    }
    return phone;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('pt-BR');
  };

  const highlightMatch = (text, searchTerm) => {
    if (!searchTerm?.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text?.split(regex);
    
    return parts?.map((part, index) => 
      regex?.test(part) ? (
        <span key={index} className="bg-accent/30 font-medium">{part}</span>
      ) : part
    );
  };

  return (
    <div className="bg-card rounded-lg border border-border h-full flex flex-col">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Buscar Clientes</h2>
        <Input
          type="search"
          placeholder="Buscar por nome, telefone, CPF ou veículo..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e?.target?.value)}
          className="w-full"
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredCustomers?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-6">
            <Icon name="Search" size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm 
                ? 'Tente ajustar os termos de busca' :'Cadastre o primeiro cliente para começar'
              }
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredCustomers?.map((customer) => (
              <div
                key={customer?.id}
                onClick={() => onCustomerSelect(customer)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedCustomerId === customer?.id
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-foreground">
                    {highlightMatch(customer?.name, searchTerm)}
                  </h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    customer?.status === 'active' ?'bg-success/10 text-success' :'bg-muted text-muted-foreground'
                  }`}>
                    {customer?.status === 'active' ? 'Ativo' : 'Inativo'}
                  </div>
                </div>

                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Icon name="Phone" size={14} />
                    <span>{highlightMatch(formatPhone(customer?.phone), searchTerm)}</span>
                  </div>
                  
                  {customer?.vehicles?.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Icon name="Car" size={14} />
                      <span>
                        {highlightMatch(`${customer?.vehicles?.[0]?.model} - ${customer?.vehicles?.[0]?.plate}`, searchTerm)}
                      </span>
                    </div>
                  )}

                  {customer?.lastService && (
                    <div className="flex items-center space-x-2">
                      <Icon name="Calendar" size={14} />
                      <span>Último serviço: {formatDate(customer?.lastService)}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    {customer?.totalServices} serviços realizados
                  </span>
                  <span className="text-xs font-medium text-success">
                    R$ {customer?.totalSpent?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerSearchPanel;