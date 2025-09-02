import React, { useState, useEffect } from 'react';
import MainNavigation from '../../components/ui/MainNavigation';
import UserProfileDropdown from '../../components/ui/UserProfileDropdown';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import FloatingActionButton from '../../components/ui/FloatingActionButton';
import MetricCard from './components/MetricCard';
import RecentWorkOrdersTable from './components/RecentWorkOrdersTable';
import QuickActionsPanel from './components/QuickActionsPanel';
import RevenueChart from './components/RevenueChart';
import AlertsPanel from './components/AlertsPanel';

const Dashboard = () => {
  const [userRole, setUserRole] = useState('manager');
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock data
  const mockMetrics = [
    {
      title: 'Receita Hoje',
      value: 'R$ 3.450,00',
      icon: 'DollarSign',
      color: 'success',
      trend: 'up',
      trendValue: '+12%'
    },
    {
      title: 'OS Ativas',
      value: '23',
      icon: 'Wrench',
      color: 'primary',
      trend: 'up',
      trendValue: '+3'
    },
    {
      title: 'Estoque Baixo',
      value: '8',
      icon: 'AlertTriangle',
      color: 'warning',
      trend: 'down',
      trendValue: '-2'
    },
    {
      title: 'Pagamentos Pendentes',
      value: 'R$ 1.250,00',
      icon: 'CreditCard',
      color: 'error',
      trend: 'neutral',
      trendValue: '0%'
    }
  ];

  const mockWorkOrders = [
    {
      id: '2024001',
      customerName: 'João Silva',
      customerPhone: '(11) 99999-1234',
      vehicle: {
        brand: 'Toyota',
        model: 'Corolla',
        year: '2020',
        plate: 'ABC-1234'
      },
      status: 'em_andamento',
      totalValue: 850.00,
      estimatedCompletion: new Date('2024-08-25')
    },
    {
      id: '2024002',
      customerName: 'Maria Santos',
      customerPhone: '(11) 88888-5678',
      vehicle: {
        brand: 'Honda',
        model: 'Civic',
        year: '2019',
        plate: 'DEF-5678'
      },
      status: 'aguardando',
      totalValue: 1200.00,
      estimatedCompletion: new Date('2024-08-26')
    },
    {
      id: '2024003',
      customerName: 'Carlos Oliveira',
      customerPhone: '(11) 77777-9012',
      vehicle: {
        brand: 'Volkswagen',
        model: 'Golf',
        year: '2021',
        plate: 'GHI-9012'
      },
      status: 'concluido',
      totalValue: 650.00,
      estimatedCompletion: new Date('2024-08-22')
    },
    {
      id: '2024004',
      customerName: 'Ana Costa',
      customerPhone: '(11) 66666-3456',
      vehicle: {
        brand: 'Ford',
        model: 'Focus',
        year: '2018',
        plate: 'JKL-3456'
      },
      status: 'em_andamento',
      totalValue: 950.00,
      estimatedCompletion: new Date('2024-08-27')
    },
    {
      id: '2024005',
      customerName: 'Pedro Lima',
      customerPhone: '(11) 55555-7890',
      vehicle: {
        brand: 'Chevrolet',
        model: 'Onix',
        year: '2022',
        plate: 'MNO-7890'
      },
      status: 'aguardando',
      totalValue: 450.00,
      estimatedCompletion: new Date('2024-08-28')
    }
  ];

  const mockRevenueData = [
    { month: 'Jan', services: 15000, parts: 8000 },
    { month: 'Fev', services: 18000, parts: 9500 },
    { month: 'Mar', services: 22000, parts: 11000 },
    { month: 'Abr', services: 19000, parts: 10200 },
    { month: 'Mai', services: 25000, parts: 12500 },
    { month: 'Jun', services: 28000, parts: 14000 },
    { month: 'Jul', services: 32000, parts: 15800 },
    { month: 'Ago', services: 29000, parts: 14500 }
  ];

  const mockAlerts = [
    {
      id: 1,
      type: 'low_stock',
      message: 'Filtro de óleo Honda está com apenas 3 unidades em estoque',
      date: new Date('2024-08-22'),
      action: 'Reabastecer'
    },
    {
      id: 2,
      type: 'overdue_payment',
      message: 'Cliente João Silva possui pagamento em atraso de R$ 850,00',
      date: new Date('2024-08-21'),
      action: 'Entrar em contato'
    },
    {
      id: 3,
      type: 'maintenance_due',
      message: 'Equipamento de alinhamento precisa de calibração',
      date: new Date('2024-08-20'),
      action: 'Agendar manutenção'
    }
  ];

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  const handleProfileClick = () => {
    console.log('Profile clicked');
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
  };

  const handleFloatingAction = (path) => {
    console.log('Floating action clicked for:', path);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <MainNavigation userRole={userRole} />
      {/* Main Content */}
      <div className="pt-16 pb-20 lg:pb-8">
        {/* Header */}
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <BreadcrumbNavigation items={breadcrumbItems} />
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden md:block text-sm text-muted-foreground">
                  {currentTime?.toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <UserProfileDropdown
                  onLogout={handleLogout}
                  onProfileClick={handleProfileClick}
                  onSettingsClick={handleSettingsClick}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">
              Bem-vindo ao TigerApp
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie sua oficina de forma eficiente e organizada
            </p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {mockMetrics?.map((metric, index) => (
              <MetricCard
                key={index}
                title={metric?.title}
                value={metric?.value}
                icon={metric?.icon}
                color={metric?.color}
                trend={metric?.trend}
                trendValue={metric?.trendValue}
                loading={loading}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Recent Work Orders */}
            <div className="lg:col-span-8">
              <RecentWorkOrdersTable 
                workOrders={mockWorkOrders} 
                loading={loading}
              />
            </div>

            {/* Quick Actions & Alerts */}
            <div className="lg:col-span-4 space-y-6">
              <QuickActionsPanel userRole={userRole} />
              <AlertsPanel alerts={mockAlerts} loading={loading} />
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="mb-8">
            <RevenueChart data={mockRevenueData} loading={loading} />
          </div>
        </div>
      </div>
      {/* Floating Action Button */}
      <FloatingActionButton onClick={handleFloatingAction} />
    </div>
  );
};

export default Dashboard;