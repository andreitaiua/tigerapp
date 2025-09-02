import React, { useState, useEffect } from 'react';
import MainNavigation from '../../components/ui/MainNavigation';
import UserProfileDropdown from '../../components/ui/UserProfileDropdown';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import FloatingActionButton from '../../components/ui/FloatingActionButton';
import KPICard from './components/KPICard';
import RevenueChart from './components/RevenueChart';
import ServiceBreakdown from './components/ServiceBreakdown';
import DateRangeSelector from './components/DateRangeSelector';
import TransactionTable from './components/TransactionTable';
import ExpenseTracker from './components/ExpenseTracker';
import ExportReports from './components/ExportReports';

const FinancialDashboard = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date(),
    rangeId: 'thisMonth'
  });

  const [user] = useState({
    name: 'Carlos Silva',
    role: 'manager',
    email: 'carlos@tigerapp.com'
  });

  // Mock KPI data
  const kpiData = [
    {
      title: 'Receita Diária',
      value: 2850.00,
      change: '+12.5%',
      changeType: 'positive',
      icon: 'TrendingUp',
      iconColor: 'text-success'
    },
    {
      title: 'Meta Mensal',
      value: 45000.00,
      change: '78% atingido',
      changeType: 'positive',
      icon: 'Target',
      iconColor: 'text-primary'
    },
    {
      title: 'Contas a Receber',
      value: 8750.00,
      change: '-5.2%',
      changeType: 'negative',
      icon: 'Clock',
      iconColor: 'text-warning'
    },
    {
      title: 'Margem de Lucro',
      value: '32.8%',
      change: '+2.1%',
      changeType: 'positive',
      icon: 'Percent',
      iconColor: 'text-accent'
    }
  ];

  // Mock revenue chart data
  const revenueChartData = [
    { month: 'Jan', receita: 35000, despesas: 22000 },
    { month: 'Fev', receita: 42000, despesas: 25000 },
    { month: 'Mar', receita: 38000, despesas: 23000 },
    { month: 'Abr', receita: 45000, despesas: 28000 },
    { month: 'Mai', receita: 52000, despesas: 31000 },
    { month: 'Jun', receita: 48000, despesas: 29000 },
    { month: 'Jul', receita: 55000, despesas: 33000 },
    { month: 'Ago', receita: 51000, despesas: 32000 }
  ];

  // Mock service breakdown data
  const serviceBreakdownData = [
    { name: 'Manutenção Preventiva', value: 18500, percentage: 35.2 },
    { name: 'Reparos Gerais', value: 15200, percentage: 28.9 },
    { name: 'Troca de Peças', value: 9800, percentage: 18.6 },
    { name: 'Diagnóstico', value: 5200, percentage: 9.9 },
    { name: 'Outros Serviços', value: 3800, percentage: 7.4 }
  ];

  // Mock transactions data
  const transactionsData = [
    {
      id: 1,
      date: '2024-08-22',
      description: 'Troca de óleo e filtros',
      type: 'receita',
      amount: 280.00,
      paymentMethod: 'cartao',
      customer: 'João Santos',
      workOrderId: 'OS-2024-0156'
    },
    {
      id: 2,
      date: '2024-08-22',
      description: 'Compra de peças - Fornecedor ABC',
      type: 'despesa',
      amount: 450.00,
      paymentMethod: 'transferencia',
      customer: null,
      workOrderId: null
    },
    {
      id: 3,
      date: '2024-08-21',
      description: 'Reparo do sistema de freios',
      type: 'receita',
      amount: 680.00,
      paymentMethod: 'pix',
      customer: 'Maria Silva',
      workOrderId: 'OS-2024-0155'
    },
    {
      id: 4,
      date: '2024-08-21',
      description: 'Pagamento de energia elétrica',
      type: 'despesa',
      amount: 320.00,
      paymentMethod: 'dinheiro',
      customer: null,
      workOrderId: null
    },
    {
      id: 5,
      date: '2024-08-20',
      description: 'Alinhamento e balanceamento',
      type: 'receita',
      amount: 150.00,
      paymentMethod: 'cartao',
      customer: 'Pedro Costa',
      workOrderId: 'OS-2024-0154'
    },
    {
      id: 6,
      date: '2024-08-20',
      description: 'Compra de ferramentas',
      type: 'despesa',
      amount: 890.00,
      paymentMethod: 'cartao',
      customer: null,
      workOrderId: null
    },
    {
      id: 7,
      date: '2024-08-19',
      description: 'Revisão completa do motor',
      type: 'receita',
      amount: 1250.00,
      paymentMethod: 'transferencia',
      customer: 'Ana Oliveira',
      workOrderId: 'OS-2024-0153'
    },
    {
      id: 8,
      date: '2024-08-19',
      description: 'Salário dos mecânicos',
      type: 'despesa',
      amount: 3200.00,
      paymentMethod: 'transferencia',
      customer: null,
      workOrderId: null
    }
  ];

  // Mock expenses data
  const expensesData = [
    {
      id: 1,
      date: '2024-08-22',
      description: 'Pastilhas de freio - Kit completo',
      category: 'pecas',
      amount: 280.00,
      supplier: 'AutoPeças Brasil',
      paymentMethod: 'cartao'
    },
    {
      id: 2,
      date: '2024-08-22',
      description: 'Hora extra - Mecânico João',
      category: 'mao_obra',
      amount: 120.00,
      supplier: null,
      paymentMethod: 'dinheiro'
    },
    {
      id: 3,
      date: '2024-08-21',
      description: 'Conta de energia elétrica',
      category: 'operacional',
      amount: 450.00,
      supplier: 'Companhia Elétrica',
      paymentMethod: 'transferencia'
    },
    {
      id: 4,
      date: '2024-08-21',
      description: 'Filtros de óleo - Lote 50 unidades',
      category: 'fornecedores',
      amount: 680.00,
      supplier: 'Distribuidora XYZ',
      paymentMethod: 'pix'
    },
    {
      id: 5,
      date: '2024-08-20',
      description: 'Internet e telefone',
      category: 'operacional',
      amount: 180.00,
      supplier: 'Telecom Plus',
      paymentMethod: 'cartao'
    }
  ];

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Financeiro' }
  ];

  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
    // In a real application, this would trigger data refetch
    console.log('Date range changed:', newRange);
  };

  const handleLogout = () => {
    // Handle logout logic
    console.log('Logout clicked');
  };

  const handleProfileClick = () => {
    // Handle profile click
    console.log('Profile clicked');
  };

  const handleSettingsClick = () => {
    // Handle settings click
    console.log('Settings clicked');
  };

  const handleFloatingAction = (path) => {
    // Handle floating action button click
    console.log('Floating action clicked for path:', path);
  };

  useEffect(() => {
    document.title = 'Dashboard Financeiro - TigerApp';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation userRole={user?.role} />
      <div className="pt-16 pb-20 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <BreadcrumbNavigation items={breadcrumbItems} className="mb-2" />
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                Dashboard Financeiro
              </h1>
              <p className="text-muted-foreground mt-1">
                Acompanhe receitas, despesas e performance do negócio
              </p>
            </div>
            
            <UserProfileDropdown
              user={user}
              onLogout={handleLogout}
              onProfileClick={handleProfileClick}
              onSettingsClick={handleSettingsClick}
            />
          </div>

          {/* Date Range Selector */}
          <DateRangeSelector 
            onDateRangeChange={handleDateRangeChange}
            className="mb-8"
          />

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiData?.map((kpi, index) => (
              <KPICard
                key={index}
                title={kpi?.title}
                value={kpi?.value}
                change={kpi?.change}
                changeType={kpi?.changeType}
                icon={kpi?.icon}
                iconColor={kpi?.iconColor}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            {/* Revenue Chart */}
            <div className="lg:col-span-8">
              <RevenueChart data={revenueChartData} />
            </div>

            {/* Service Breakdown */}
            <div className="lg:col-span-4">
              <ServiceBreakdown data={serviceBreakdownData} />
            </div>
          </div>

          {/* Transactions and Expenses */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            <TransactionTable transactions={transactionsData} />
            <ExpenseTracker expenses={expensesData} />
          </div>

          {/* Export Reports */}
          <ExportReports />
        </div>
      </div>
      <FloatingActionButton onClick={handleFloatingAction} />
    </div>
  );
};

export default FinancialDashboard;