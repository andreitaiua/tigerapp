import React, { useState, useEffect, useMemo } from 'react';
import MainNavigation from '../../components/ui/MainNavigation';
import UserProfileDropdown from '../../components/ui/UserProfileDropdown';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import FloatingActionButton from '../../components/ui/FloatingActionButton';
import CategorySidebar from './components/CategorySidebar';
import InventoryToolbar from './components/InventoryToolbar';
import InventoryGrid from './components/InventoryGrid';
import ItemDetailsPanel from './components/ItemDetailsPanel';
import QuickEditModal from './components/QuickEditModal';
import LowStockAlert from './components/LowStockAlert';

const InventoryManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [showQuickEdit, setShowQuickEdit] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showLowStockAlert, setShowLowStockAlert] = useState(true);

  // Mock inventory data
  const mockInventoryItems = [
    {
      id: 1,
      name: 'Óleo Motor 5W30 Sintético',
      code: 'OL-5W30-001',
      description: 'Óleo lubrificante sintético para motores, viscosidade 5W30, ideal para carros modernos',
      category: 'Óleos e Lubrificantes',
      brand: 'Castrol',
      model: 'GTX',
      currentStock: 45,
      minimumStock: 20,
      unitPrice: 89.90,
      supplier: 'AutoPeças Brasil',
      location: 'A1-B2-C1',
      image: 'https://images.pexels.com/photos/13065690/pexels-photo-13065690.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastUpdated: '2025-01-22T10:30:00Z'
    },
    {
      id: 2,
      name: 'Pastilha de Freio Dianteira',
      code: 'PF-DIANT-002',
      description: 'Pastilha de freio dianteira para veículos de passeio, material cerâmico de alta performance',
      category: 'Pastilhas de Freio',
      brand: 'Bosch',
      model: 'BB1234',
      currentStock: 8,
      minimumStock: 15,
      unitPrice: 156.50,
      supplier: 'Distribuidora Central',
      location: 'B2-C3-D1',
      image: 'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastUpdated: '2025-01-21T14:15:00Z'
    },
    {
      id: 3,
      name: 'Filtro de Ar Esportivo',
      code: 'FA-ESP-003',
      description: 'Filtro de ar esportivo de alto fluxo, melhora a performance do motor',
      category: 'Filtros',
      brand: 'K&N',
      model: '33-2304',
      currentStock: 0,
      minimumStock: 10,
      unitPrice: 245.00,
      supplier: 'MegaParts',
      location: 'A3-B1-C2',
      image: 'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastUpdated: '2025-01-20T09:45:00Z'
    },
    {
      id: 4,
      name: 'Amortecedor Traseiro',
      code: 'AM-TRAS-004',
      description: 'Amortecedor traseiro para suspensão, tecnologia monotubo com válvula de baixa velocidade',
      category: 'Amortecedores',
      brand: 'Monroe',
      model: 'G8125',
      currentStock: 12,
      minimumStock: 8,
      unitPrice: 189.90,
      supplier: 'Fornecedor ABC',
      location: 'C1-D2-E1',
      image: 'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastUpdated: '2025-01-22T16:20:00Z'
    },
    {
      id: 5,
      name: 'Bateria 60Ah',
      code: 'BAT-60AH-005',
      description: 'Bateria automotiva 60Ah, livre de manutenção, 12V com alta durabilidade',
      category: 'Baterias',
      brand: 'Moura',
      model: 'M60GD',
      currentStock: 25,
      minimumStock: 12,
      unitPrice: 389.90,
      supplier: 'Parts Express',
      location: 'D1-E2-F1',
      image: 'https://images.pexels.com/photos/13065690/pexels-photo-13065690.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastUpdated: '2025-01-21T11:30:00Z'
    },
    {
      id: 6,
      name: 'Pneu 185/65R15',
      code: 'PN-185-006',
      description: 'Pneu radial 185/65R15 para veículos de passeio, composto de borracha de alta aderência',
      category: 'Pneus Passeio',
      brand: 'Michelin',
      model: 'Energy XM2',
      currentStock: 32,
      minimumStock: 20,
      unitPrice: 298.50,
      supplier: 'AutoPeças Brasil',
      location: 'E1-F2-G1',
      image: 'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastUpdated: '2025-01-22T08:15:00Z'
    },
    {
      id: 7,
      name: 'Vela de Ignição Iridium',
      code: 'VI-IRID-007',
      description: 'Vela de ignição com eletrodo de irídio, maior durabilidade e melhor combustão',
      category: 'Velas de Ignição',
      brand: 'NGK',
      model: 'ILFR6A11',
      currentStock: 3,
      minimumStock: 24,
      unitPrice: 45.90,
      supplier: 'Distribuidora Central',
      location: 'A2-B3-C2',
      image: 'https://images.pexels.com/photos/13065690/pexels-photo-13065690.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastUpdated: '2025-01-20T13:45:00Z'
    },
    {
      id: 8,
      name: 'Disco de Freio Ventilado',
      code: 'DF-VENT-008',
      description: 'Disco de freio ventilado dianteiro, ferro fundido com tratamento anticorrosivo',
      category: 'Discos de Freio',
      brand: 'TRW',
      model: 'DF4567',
      currentStock: 18,
      minimumStock: 10,
      unitPrice: 234.90,
      supplier: 'MegaParts',
      location: 'B3-C4-D2',
      image: 'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastUpdated: '2025-01-21T15:30:00Z'
    }
  ];

  // Get low stock items
  const lowStockItems = useMemo(() => {
    return mockInventoryItems?.filter(item => 
      item?.currentStock <= item?.minimumStock
    );
  }, []);

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let filtered = mockInventoryItems;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered?.filter(item => 
        item?.category?.toLowerCase()?.includes(selectedCategory?.toLowerCase()) ||
        selectedCategory === item?.category
      );
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm?.toLowerCase();
      filtered = filtered?.filter(item =>
        item?.name?.toLowerCase()?.includes(searchLower) ||
        item?.code?.toLowerCase()?.includes(searchLower) ||
        item?.description?.toLowerCase()?.includes(searchLower) ||
        item?.category?.toLowerCase()?.includes(searchLower) ||
        item?.supplier?.toLowerCase()?.includes(searchLower)
      );
    }

    // Sort items
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a?.name?.localeCompare(b?.name);
        case 'name-desc':
          return b?.name?.localeCompare(a?.name);
        case 'stock-low':
          return a?.currentStock - b?.currentStock;
        case 'stock-high':
          return b?.currentStock - a?.currentStock;
        case 'price-low':
          return a?.unitPrice - b?.unitPrice;
        case 'price-high':
          return b?.unitPrice - a?.unitPrice;
        case 'updated':
          return new Date(b.lastUpdated) - new Date(a.lastUpdated);
        default:
          return 0;
      }
    });

    return filtered;
  }, [selectedCategory, searchTerm, sortBy]);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Gestão de Estoque' }
  ];

  const handleItemSelect = (itemId, checked) => {
    setSelectedItems(prev => 
      checked 
        ? [...prev, itemId]
        : prev?.filter(id => id !== itemId)
    );
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowItemDetails(true);
  };

  const handleQuickEdit = (item) => {
    setEditingItem(item);
    setShowQuickEdit(true);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setShowQuickEdit(true);
  };

  const handleSaveItem = (updatedItem) => {
    // In a real app, this would make an API call
    console.log('Saving item:', updatedItem);
    // Update local state or refetch data
  };

  const handleBulkActions = (action, items) => {
    console.log('Bulk action:', action, 'for items:', items);
    // Handle bulk actions like price updates, stock adjustments, etc.
  };

  const handleReorderItem = (item) => {
    console.log('Reordering item:', item);
    // Handle reorder logic
  };

  const handleDismissAlert = (itemId) => {
    console.log('Dismissing alert for item:', itemId);
    // Handle alert dismissal
  };

  const handleFloatingAction = (path) => {
    if (path === '/inventory-management') {
      handleAddItem();
    }
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const handleProfileClick = () => {
    console.log('Opening profile...');
  };

  const handleSettingsClick = () => {
    console.log('Opening settings...');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <MainNavigation userRole="manager" />
      {/* Main Content */}
      <div className="pt-16">
        {/* Header */}
        <div className="bg-card border-b border-border">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <BreadcrumbNavigation items={breadcrumbItems} />
                <h1 className="text-2xl font-semibold text-foreground mt-2">
                  Gestão de Estoque
                </h1>
                <p className="text-muted-foreground">
                  Controle completo do inventário de peças e produtos
                </p>
              </div>
              <UserProfileDropdown
                onLogout={handleLogout}
                onProfileClick={handleProfileClick}
                onSettingsClick={handleSettingsClick}
              />
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Sidebar */}
          <CategorySidebar
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Toolbar */}
            <InventoryToolbar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onAddItem={handleAddItem}
              onBulkActions={handleBulkActions}
              selectedItems={selectedItems}
            />

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Low Stock Alert */}
              <LowStockAlert
                lowStockItems={lowStockItems}
                onReorderItem={handleReorderItem}
                onDismissAlert={handleDismissAlert}
                isVisible={showLowStockAlert && lowStockItems?.length > 0}
              />

              {/* Inventory Grid */}
              <InventoryGrid
                items={filteredAndSortedItems}
                viewMode={viewMode}
                selectedItems={selectedItems}
                onItemSelect={handleItemSelect}
                onItemClick={handleItemClick}
                onQuickEdit={handleQuickEdit}
              />

              {/* Empty State */}
              {filteredAndSortedItems?.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-muted-foreground mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Nenhum item encontrado
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm 
                      ? `Não encontramos itens que correspondam a "${searchTerm}"`
                      : 'Não há itens nesta categoria'
                    }
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      Limpar busca
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Modals */}
      <ItemDetailsPanel
        item={selectedItem}
        isOpen={showItemDetails}
        onClose={() => setShowItemDetails(false)}
        onEdit={handleQuickEdit}
        onReorder={handleReorderItem}
      />
      <QuickEditModal
        item={editingItem}
        isOpen={showQuickEdit}
        onClose={() => setShowQuickEdit(false)}
        onSave={handleSaveItem}
      />
      {/* Floating Action Button */}
      <FloatingActionButton onClick={handleFloatingAction} />
    </div>
  );
};

export default InventoryManagement;