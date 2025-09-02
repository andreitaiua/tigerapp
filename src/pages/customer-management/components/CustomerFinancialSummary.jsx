import React from 'react';
import Icon from '../../../components/AppIcon';

const CustomerFinancialSummary = ({ customer }) => {
  const currentYear = new Date()?.getFullYear();
  const currentMonth = new Date()?.getMonth();

  // Calculate financial metrics
  const totalSpent = customer?.totalSpent || 0;
  const averageTicket = customer?.totalServices > 0 ? totalSpent / customer?.totalServices : 0;
  
  // Calculate this year's spending
  const thisYearSpending = customer?.serviceHistory?.filter(service => 
    new Date(service.date)?.getFullYear() === currentYear
  )?.reduce((sum, service) => sum + service?.totalAmount, 0) || 0;

  // Calculate this month's spending
  const thisMonthSpending = customer?.serviceHistory?.filter(service => {
    const serviceDate = new Date(service.date);
    return serviceDate?.getFullYear() === currentYear && serviceDate?.getMonth() === currentMonth;
  })?.reduce((sum, service) => sum + service?.totalAmount, 0) || 0;

  // Get payment methods distribution
  const paymentMethods = customer?.serviceHistory?.reduce((acc, service) => {
    const method = service?.paymentMethod || 'Não informado';
    acc[method] = (acc?.[method] || 0) + service?.totalAmount;
    return acc;
  }, {}) || {};

  // Get monthly spending for the last 6 months
  const monthlySpending = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date?.setMonth(date?.getMonth() - i);
    const year = date?.getFullYear();
    const month = date?.getMonth();
    
    const spending = customer?.serviceHistory?.filter(service => {
      const serviceDate = new Date(service.date);
      return serviceDate?.getFullYear() === year && serviceDate?.getMonth() === month;
    })?.reduce((sum, service) => sum + service?.totalAmount, 0) || 0;

    monthlySpending?.push({
      month: date?.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
      amount: spending
    });
  }

  const financialCards = [
    {
      title: 'Total Gasto',
      value: `R$ ${totalSpent?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: 'DollarSign',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Ticket Médio',
      value: `R$ ${averageTicket?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: 'TrendingUp',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Gasto Este Ano',
      value: `R$ ${thisYearSpending?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: 'Calendar',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      title: 'Gasto Este Mês',
      value: `R$ ${thisMonthSpending?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: 'CalendarDays',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {financialCards?.map((card, index) => (
          <div key={index} className="bg-muted/30 rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card?.bgColor}`}>
                <Icon name={card?.icon} size={20} className={card?.color} />
              </div>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">{card?.title}</h3>
            <p className="text-xl font-semibold text-foreground">{card?.value}</p>
          </div>
        ))}
      </div>
      {/* Monthly Spending Chart */}
      <div className="bg-muted/30 rounded-lg p-4 border border-border">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="BarChart3" size={18} className="text-primary" />
          <h3 className="font-medium text-foreground">Gastos dos Últimos 6 Meses</h3>
        </div>

        <div className="space-y-3">
          {monthlySpending?.map((month, index) => {
            const maxAmount = Math.max(...monthlySpending?.map(m => m?.amount));
            const percentage = maxAmount > 0 ? (month?.amount / maxAmount) * 100 : 0;
            
            return (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-12 text-xs text-muted-foreground font-medium">
                  {month?.month}
                </div>
                <div className="flex-1 bg-muted rounded-full h-2 relative">
                  <div
                    className="bg-primary rounded-full h-2 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="w-20 text-right text-sm font-medium text-foreground">
                  R$ {month?.amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Payment Methods */}
      <div className="bg-muted/30 rounded-lg p-4 border border-border">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="CreditCard" size={18} className="text-primary" />
          <h3 className="font-medium text-foreground">Formas de Pagamento</h3>
        </div>

        {Object.keys(paymentMethods)?.length > 0 ? (
          <div className="space-y-3">
            {Object.entries(paymentMethods)?.map(([method, amount], index) => {
              const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon 
                      name={method === 'Dinheiro' ? 'Banknote' : method === 'Cartão' ? 'CreditCard' : 'DollarSign'} 
                      size={16} 
                      className="text-muted-foreground" 
                    />
                    <span className="text-sm font-medium text-foreground">{method}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      R$ {amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {percentage?.toFixed(1)}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Icon name="CreditCard" size={32} className="text-muted-foreground mb-2 mx-auto" />
            <p className="text-sm text-muted-foreground">Nenhuma informação de pagamento disponível</p>
          </div>
        )}
      </div>
      {/* Customer Loyalty */}
      <div className="bg-muted/30 rounded-lg p-4 border border-border">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Award" size={18} className="text-primary" />
          <h3 className="font-medium text-foreground">Fidelidade do Cliente</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{customer?.totalServices || 0}</p>
            <p className="text-sm text-muted-foreground">Serviços Realizados</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-success">
              {customer?.serviceHistory?.length > 0 
                ? Math.round((Date.now() - new Date(customer.createdAt)) / (1000 * 60 * 60 * 24 * 30))
                : 0
              }
            </p>
            <p className="text-sm text-muted-foreground">Meses como Cliente</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">
              {customer?.serviceHistory?.length > 0 
                ? new Date(Math.max(...customer.serviceHistory.map(s => new Date(s.date))))?.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
                : 'N/A'
              }
            </p>
            <p className="text-sm text-muted-foreground">Último Serviço</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerFinancialSummary;