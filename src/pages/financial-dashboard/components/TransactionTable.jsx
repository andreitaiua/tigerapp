import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TransactionTable = ({ transactions, className = '' }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterType, setFilterType] = useState('all');
  const itemsPerPage = 10;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(amount);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('pt-BR')?.format(new Date(date));
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'receita': return 'text-success bg-success/10';
      case 'despesa': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'dinheiro': return 'Banknote';
      case 'cartao': return 'CreditCard';
      case 'pix': return 'Smartphone';
      case 'transferencia': return 'ArrowRightLeft';
      default: return 'DollarSign';
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredTransactions = transactions?.filter(transaction => {
    if (filterType === 'all') return true;
    return transaction?.type === filterType;
  });

  const sortedTransactions = [...filteredTransactions]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];
    
    if (sortField === 'date') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const totalPages = Math.ceil(sortedTransactions?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = sortedTransactions?.slice(startIndex, startIndex + itemsPerPage);

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <Icon name="ArrowUpDown" size={14} className="text-muted-foreground" />;
    return (
      <Icon 
        name={sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown'} 
        size={14} 
        className="text-primary" 
      />
    );
  };

  return (
    <div className={`bg-card rounded-lg border border-border card-shadow ${className}`}>
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Histórico de Transações
            </h3>
            <p className="text-sm text-muted-foreground">
              {sortedTransactions?.length} transações encontradas
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('all')}
            >
              Todas
            </Button>
            <Button
              variant={filterType === 'receita' ? 'success' : 'outline'}
              size="sm"
              onClick={() => setFilterType('receita')}
            >
              Receitas
            </Button>
            <Button
              variant={filterType === 'despesa' ? 'destructive' : 'outline'}
              size="sm"
              onClick={() => setFilterType('despesa')}
            >
              Despesas
            </Button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium text-foreground">
                <button 
                  onClick={() => handleSort('date')}
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <span>Data</span>
                  <SortIcon field="date" />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button 
                  onClick={() => handleSort('description')}
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <span>Descrição</span>
                  <SortIcon field="description" />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">Tipo</th>
              <th className="text-left p-4 font-medium text-foreground">Pagamento</th>
              <th className="text-left p-4 font-medium text-foreground">Cliente</th>
              <th className="text-right p-4 font-medium text-foreground">
                <button 
                  onClick={() => handleSort('amount')}
                  className="flex items-center space-x-2 hover:text-primary transition-colors ml-auto"
                >
                  <span>Valor</span>
                  <SortIcon field="amount" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions?.map((transaction) => (
              <tr key={transaction?.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <span className="text-sm text-foreground">
                    {formatDate(transaction?.date)}
                  </span>
                </td>
                <td className="p-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {transaction?.description}
                    </p>
                    {transaction?.workOrderId && (
                      <p className="text-xs text-muted-foreground">
                        OS #{transaction?.workOrderId}
                      </p>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(transaction?.type)}`}>
                    {transaction?.type === 'receita' ? 'Receita' : 'Despesa'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name={getPaymentMethodIcon(transaction?.paymentMethod)} size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground capitalize">
                      {transaction?.paymentMethod}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-foreground">
                    {transaction?.customer || '-'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <span className={`text-sm font-medium ${
                    transaction?.type === 'receita' ? 'text-success' : 'text-error'
                  }`}>
                    {transaction?.type === 'receita' ? '+' : '-'}{formatCurrency(Math.abs(transaction?.amount))}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, sortedTransactions?.length)} de {sortedTransactions?.length} transações
            </p>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="ChevronLeft"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                iconName="ChevronRight"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Próxima
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;