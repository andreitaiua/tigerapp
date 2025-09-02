import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '../../components/ui/MainNavigation';
import UserProfileDropdown from '../../components/ui/UserProfileDropdown';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import FloatingActionButton from '../../components/ui/FloatingActionButton';
import WorkOrderTable from './components/WorkOrderTable';
import WorkOrderFilters from './components/WorkOrderFilters';
import WorkOrderDetailsPanel from './components/WorkOrderDetailsPanel';
import WorkOrderMobileCard from './components/WorkOrderMobileCard';
import CreateWorkOrderModal from './components/CreateWorkOrderModal';
import StatusUpdateModal from './components/StatusUpdateModal';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { workOrderService } from '../../services/workOrderService';
import { useAuth } from '../../contexts/AuthContext';

const WorkOrderManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [filters, setFilters] = useState({});
  const [workOrders, setWorkOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Ordens de Serviço' }
  ];

  const currentUser = {
    name: user?.user_metadata?.full_name || 'Usuário',
    role: 'manager',
    email: user?.email || 'user@tigerapp.com'
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    loadWorkOrders();
  }, []);

  const loadWorkOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await workOrderService?.getWorkOrders();
      
      // Transform data to match existing UI structure
      const transformedData = data?.map(wo => ({
        id: wo?.id,
        osNumber: wo?.order_number,
        customerName: wo?.customer?.name,
        customerPhone: wo?.customer?.phone,
        customerEmail: wo?.customer?.email,
        vehicle: {
          brand: wo?.vehicle?.brand,
          model: wo?.vehicle?.model,
          year: wo?.vehicle?.year,
          plate: wo?.vehicle?.plate,
          mileage: wo?.vehicle?.mileage
        },
        mechanic: wo?.assigned_mechanic?.full_name || 'Não atribuído',
        status: getStatusLabel(wo?.status),
        estimatedCompletion: wo?.estimated_completion,
        totalValue: wo?.total_amount,
        problemDescription: wo?.problem_description,
        services: wo?.work_order_services?.map(wos => ({
          name: wos?.service?.name,
          description: wos?.service?.description,
          price: wos?.total_price,
          estimatedHours: wos?.service?.estimated_hours,
          laborCost: wos?.total_price
        })) || [],
        parts: wo?.work_order_parts?.map(wop => ({
          code: wop?.inventory_item?.code,
          name: wop?.inventory_item?.name,
          quantity: wop?.quantity,
          unitPrice: wop?.unit_price,
          totalPrice: wop?.total_price,
          inStock: wop?.inventory_item?.quantity_in_stock > 0
        })) || [],
        history: wo?.work_order_history?.map(woh => ({
          action: woh?.action,
          description: woh?.description,
          user: woh?.performed_by_user?.full_name || 'Sistema',
          timestamp: woh?.created_at,
          icon: getHistoryIcon(woh?.action)
        })) || []
      })) || [];

      setWorkOrders(transformedData);
      setFilteredOrders(transformedData);
    } catch (err) {
      console.log('Error loading work orders:', err);
      setError('Erro ao carregar ordens de serviço');
      // Fallback to empty array
      setWorkOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'pending': 'Aguardando',
      'in_progress': 'Em Andamento',
      'completed': 'Concluído',
      'cancelled': 'Cancelado'
    };
    return statusMap?.[status] || status;
  };

  const getHistoryIcon = (action) => {
    const iconMap = {
      'OS Criada': 'FileText',
      'Mecânico Atribuído': 'User',
      'Iniciado': 'Play',
      'Concluído': 'CheckCircle',
      'Status Atualizado': 'Edit'
    };
    return iconMap?.[action] || 'Info';
  };

  useEffect(() => {
    // Apply filters
    let filtered = workOrders;

    if (filters?.search) {
      const searchTerm = filters?.search?.toLowerCase();
      filtered = filtered?.filter(order => 
        order?.customerName?.toLowerCase()?.includes(searchTerm) ||
        order?.osNumber?.includes(searchTerm) ||
        order?.vehicle?.plate?.toLowerCase()?.includes(searchTerm)
      );
    }

    if (filters?.status) {
      filtered = filtered?.filter(order => order?.status === filters?.status);
    }

    if (filters?.mechanic) {
      filtered = filtered?.filter(order => order?.mechanic === filters?.mechanic);
    }

    if (filters?.serviceType) {
      filtered = filtered?.filter(order => 
        order?.services?.some(service => 
          service?.name?.toLowerCase()?.includes(filters?.serviceType?.toLowerCase())
        )
      );
    }

    if (filters?.dateFrom) {
      filtered = filtered?.filter(order => 
        new Date(order.estimatedCompletion) >= new Date(filters.dateFrom)
      );
    }

    if (filters?.dateTo) {
      filtered = filtered?.filter(order => 
        new Date(order.estimatedCompletion) <= new Date(filters.dateTo)
      );
    }

    setFilteredOrders(filtered);
  }, [filters, workOrders]);

  const handleSelectWorkOrder = (workOrder) => {
    setSelectedWorkOrder(workOrder);
    if (isMobile) {
      setShowDetailsPanel(true);
    }
  };

  const handleCreateWorkOrder = async (formData) => {
    try {
      await workOrderService?.createWorkOrder(formData);
      await loadWorkOrders(); // Reload the list
    } catch (error) {
      console.log('Error creating work order:', error);
    }
  };

  const handleStatusUpdate = async (updateData) => {
    try {
      await workOrderService?.updateWorkOrder(updateData?.workOrderId, {
        status: updateData?.status,
        estimated_completion: updateData?.estimatedCompletion
      });
      await loadWorkOrders(); // Reload the list
    } catch (error) {
      console.log('Error updating work order:', error);
    }
  };

  const handlePrint = (workOrder) => {
    // Simulate print functionality
    console.log('Printing work order:', workOrder?.osNumber);
    // In a real app, this would generate a PDF or open a print dialog
  };

  const handleBulkAction = (action, selectedIds) => {
    console.log('Bulk action:', action, selectedIds);
    // Handle bulk actions like status updates or printing multiple orders
  };

  const handleFloatingAction = (currentPath) => {
    if (currentPath === '/work-order-management') {
      setShowCreateModal(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <MainNavigation userRole={currentUser?.role} />
        <div className="pt-16 lg:pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Icon name="Loader2" size={48} className="text-primary animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Carregando ordens de serviço...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <MainNavigation userRole={currentUser?.role} />
        <div className="pt-16 lg:pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Icon name="AlertCircle" size={48} className="text-destructive mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={loadWorkOrders} iconName="RefreshCw">
                Tentar Novamente
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation userRole={currentUser?.role} />
      <div className="pt-16 lg:pt-16">
        <div className="px-4 lg:px-6 py-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="mb-4 lg:mb-0">
              <BreadcrumbNavigation items={breadcrumbItems} className="mb-2" />
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Ordens de Serviço</h1>
              <p className="text-muted-foreground">
                Gerencie e acompanhe todas as ordens de serviço da oficina
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden lg:block">
                <Button
                  onClick={() => setShowCreateModal(true)}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Nova OS
                </Button>
              </div>
              <UserProfileDropdown
                user={currentUser}
                onLogout={() => navigate('/login')}
                onProfileClick={() => console.log('Profile clicked')}
                onSettingsClick={() => console.log('Settings clicked')}
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-2">
                <Icon name="FileText" size={20} className="text-primary" />
                <div>
                  <div className="text-2xl font-bold text-foreground">{workOrders?.length}</div>
                  <div className="text-sm text-muted-foreground">Total de OS</div>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={20} className="text-warning" />
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {workOrders?.filter(o => o?.status === 'Aguardando')?.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Aguardando</div>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-2">
                <Icon name="Wrench" size={20} className="text-primary" />
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {workOrders?.filter(o => o?.status === 'Em Andamento')?.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Em Andamento</div>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={20} className="text-success" />
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {workOrders?.filter(o => o?.status === 'Concluído')?.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Concluídas</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <WorkOrderFilters
            onFilterChange={setFilters}
            onClearFilters={() => setFilters({})}
            filters={filters}
          />

          {/* Content */}
          {isMobile ? (
            <div className="space-y-4 pb-20">
              {filteredOrders?.map((workOrder) => (
                <WorkOrderMobileCard
                  key={workOrder?.id}
                  workOrder={workOrder}
                  onSelect={handleSelectWorkOrder}
                  onStatusUpdate={(order) => {
                    setSelectedWorkOrder(order);
                    setShowStatusModal(true);
                  }}
                  onPrint={handlePrint}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              <div className="xl:col-span-3">
                <WorkOrderTable
                  workOrders={filteredOrders}
                  onSelectWorkOrder={handleSelectWorkOrder}
                  selectedWorkOrder={selectedWorkOrder}
                  onStatusUpdate={(order) => {
                    setSelectedWorkOrder(order);
                    setShowStatusModal(true);
                  }}
                  onPrint={handlePrint}
                  onBulkAction={handleBulkAction}
                />
              </div>
              <div className="xl:col-span-1">
                <WorkOrderDetailsPanel
                  workOrder={selectedWorkOrder}
                  onClose={() => setSelectedWorkOrder(null)}
                  onStatusUpdate={(order) => {
                    setSelectedWorkOrder(order);
                    setShowStatusModal(true);
                  }}
                  onPrint={handlePrint}
                  onEdit={(order) => console.log('Edit order:', order)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Mobile Details Panel */}
      {isMobile && showDetailsPanel && (
        <div className="fixed inset-0 bg-background z-1040 pt-16">
          <WorkOrderDetailsPanel
            workOrder={selectedWorkOrder}
            onClose={() => {
              setShowDetailsPanel(false);
              setSelectedWorkOrder(null);
            }}
            onStatusUpdate={(order) => {
              setSelectedWorkOrder(order);
              setShowStatusModal(true);
            }}
            onPrint={handlePrint}
            onEdit={(order) => console.log('Edit order:', order)}
          />
        </div>
      )}
      {/* Floating Action Button */}
      <FloatingActionButton onClick={handleFloatingAction} />
      {/* Modals */}
      <CreateWorkOrderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateWorkOrder}
      />
      <StatusUpdateModal
        isOpen={showStatusModal}
        workOrder={selectedWorkOrder}
        onClose={() => setShowStatusModal(false)}
        onSubmit={handleStatusUpdate}
      />
    </div>
  );
};

export default WorkOrderManagement;