import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExpenseTracker = ({ expenses, className = '' }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(amount);
  };

  const categories = [
    { id: 'all', label: 'Todas', icon: 'List' },
    { id: 'pecas', label: 'Peças', icon: 'Settings' },
    { id: 'mao_obra', label: 'Mão de Obra', icon: 'Users' },
    { id: 'operacional', label: 'Operacional', icon: 'Building' },
    { id: 'fornecedores', label: 'Fornecedores', icon: 'Truck' }
  ];

  const getCategoryColor = (category) => {
    switch (category) {
      case 'pecas': return 'text-primary bg-primary/10';
      case 'mao_obra': return 'text-success bg-success/10';
      case 'operacional': return 'text-warning bg-warning/10';
      case 'fornecedores': return 'text-accent bg-accent/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const filteredExpenses = selectedCategory === 'all' 
    ? expenses 
    : expenses?.filter(expense => expense?.category === selectedCategory);

  const totalExpenses = filteredExpenses?.reduce((sum, expense) => sum + expense?.amount, 0);

  const categoryTotals = categories?.slice(1)?.map(category => {
    const categoryExpenses = expenses?.filter(expense => expense?.category === category?.id);
    const total = categoryExpenses?.reduce((sum, expense) => sum + expense?.amount, 0);
    const percentage = expenses?.length > 0 ? ((total / expenses?.reduce((sum, expense) => sum + expense?.amount, 0)) * 100)?.toFixed(1) : 0;
    
    return {
      ...category,
      total,
      percentage,
      count: categoryExpenses?.length
    };
  });

  return (
    <div className={`bg-card rounded-lg border border-border card-shadow ${className}`}>
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Controle de Despesas
            </h3>
            <p className="text-sm text-muted-foreground">
              Total: {formatCurrency(totalExpenses)} em {filteredExpenses?.length} despesas
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories?.map((category) => (
              <Button
                key={category?.id}
                variant={selectedCategory === category?.id ? 'default' : 'outline'}
                size="sm"
                iconName={category?.icon}
                onClick={() => setSelectedCategory(category?.id)}
              >
                {category?.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="p-6">
        {/* Category Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {categoryTotals?.map((category) => (
            <div key={category?.id} className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${getCategoryColor(category?.id)}`}>
                  <Icon name={category?.icon} size={20} />
                </div>
                <span className="text-xs text-muted-foreground">
                  {category?.percentage}%
                </span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">
                  {category?.label}
                </h4>
                <p className="text-lg font-bold text-foreground">
                  {formatCurrency(category?.total)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {category?.count} despesas
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Expense List */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground mb-4">
            Despesas Recentes
            {selectedCategory !== 'all' && (
              <span className="ml-2 text-muted-foreground">
                - {categories?.find(c => c?.id === selectedCategory)?.label}
              </span>
            )}
          </h4>

          {filteredExpenses?.slice(0, 10)?.map((expense) => (
            <div key={expense?.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${getCategoryColor(expense?.category)}`}>
                  <Icon 
                    name={categories?.find(c => c?.id === expense?.category)?.icon || 'DollarSign'} 
                    size={16} 
                  />
                </div>
                <div>
                  <h5 className="text-sm font-medium text-foreground">
                    {expense?.description}
                  </h5>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {new Intl.DateTimeFormat('pt-BR')?.format(new Date(expense.date))}
                    </span>
                    {expense?.supplier && (
                      <span className="text-xs text-muted-foreground">
                        {expense?.supplier}
                      </span>
                    )}
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(expense?.category)}`}>
                      {categories?.find(c => c?.id === expense?.category)?.label}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-error">
                  -{formatCurrency(expense?.amount)}
                </p>
                {expense?.paymentMethod && (
                  <p className="text-xs text-muted-foreground capitalize">
                    {expense?.paymentMethod}
                  </p>
                )}
              </div>
            </div>
          ))}

          {filteredExpenses?.length === 0 && (
            <div className="text-center py-8">
              <Icon name="Receipt" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nenhuma despesa encontrada para esta categoria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;