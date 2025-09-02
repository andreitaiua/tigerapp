import React, { useState, useEffect } from 'react';
import MainNavigation from '../../components/ui/MainNavigation';
import UserProfileDropdown from '../../components/ui/UserProfileDropdown';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import FloatingActionButton from '../../components/ui/FloatingActionButton';
import Button from '../../components/ui/Button';
import CustomerSearchPanel from './components/CustomerSearchPanel';
import CustomerProfilePanel from './components/CustomerProfilePanel';
import NewCustomerModal from './components/NewCustomerModal';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [userRole] = useState('manager');

  // Mock customer data
  const mockCustomers = [
    {
      id: 1,
      name: "João Silva Santos",
      email: "joao.silva@email.com",
      phone: "11987654321",
      alternativePhone: "1133334444",
      cpf: "12345678901",
      rg: "123456789",
      cnh: "12345678901",
      birthDate: "1985-03-15",
      status: "active",
      createdAt: "2023-01-15T10:00:00Z",
      lastService: "2024-08-15T14:30:00Z",
      totalServices: 12,
      totalSpent: 4850.75,
      address: {
        street: "Rua das Flores",
        number: "123",
        complement: "Apto 45",
        neighborhood: "Centro",
        city: "São Paulo",
        state: "SP",
        cep: "01234567"
      },
      vehicles: [
        {
          brand: "Honda",
          model: "Civic",
          year: 2020,
          plate: "ABC1234",
          color: "Prata",
          fuelType: "Flex",
          chassis: "9BWZZZ377VT004251",
          mileage: 45000,
          lastService: "2024-08-15T14:30:00Z",
          totalServices: 8,
          status: "active",
          notes: "Veículo em excelente estado de conservação"
        },
        {
          brand: "Toyota",
          model: "Corolla",
          year: 2018,
          plate: "XYZ5678",
          color: "Branco",
          fuelType: "Flex",
          chassis: "9BWZZZ377VT004252",
          mileage: 78000,
          lastService: "2024-07-10T09:15:00Z",
          totalServices: 4,
          status: "inactive",
          notes: "Vendido em julho de 2024"
        }
      ],
      serviceHistory: [
        {
          osNumber: "OS-2024-001",
          date: "2024-08-15T14:30:00Z",
          vehicle: "Honda Civic - ABC1234",
          services: ["Troca de óleo", "Filtro de ar", "Revisão geral"],
          parts: [
            { name: "Óleo 5W30", quantity: 4, unitPrice: 25.50 },
            { name: "Filtro de ar", quantity: 1, unitPrice: 45.00 }
          ],
          totalAmount: 350.00,
          status: "completed",
          mechanic: "Carlos Oliveira",
          paymentMethod: "Cartão",
          warranty: 90
        },
        {
          osNumber: "OS-2024-002",
          date: "2024-07-10T09:15:00Z",
          vehicle: "Toyota Corolla - XYZ5678",
          services: ["Alinhamento", "Balanceamento"],
          parts: [],
          totalAmount: 120.00,
          status: "completed",
          mechanic: "Roberto Silva",
          paymentMethod: "Dinheiro",
          warranty: 30
        }
      ],
      notes: "Cliente fiel, sempre pontual nos pagamentos. Prefere agendar serviços pela manhã."
    },
    {
      id: 2,
      name: "Maria Fernanda Costa",
      email: "maria.costa@email.com",
      phone: "11976543210",
      alternativePhone: "",
      cpf: "98765432109",
      rg: "987654321",
      cnh: "98765432109",
      birthDate: "1990-07-22",
      status: "active",
      createdAt: "2023-05-20T08:30:00Z",
      lastService: "2024-08-10T16:45:00Z",
      totalServices: 8,
      totalSpent: 2340.50,
      address: {
        street: "Avenida Paulista",
        number: "1000",
        complement: "Sala 501",
        neighborhood: "Bela Vista",
        city: "São Paulo",
        state: "SP",
        cep: "01310100"
      },
      vehicles: [
        {
          brand: "Volkswagen",
          model: "Gol",
          year: 2019,
          plate: "DEF9876",
          color: "Azul",
          fuelType: "Flex",
          chassis: "9BWZZZ377VT004253",
          mileage: 32000,
          lastService: "2024-08-10T16:45:00Z",
          totalServices: 8,
          status: "active",
          notes: "Primeiro carro da cliente"
        }
      ],
      serviceHistory: [
        {
          osNumber: "OS-2024-003",
          date: "2024-08-10T16:45:00Z",
          vehicle: "Volkswagen Gol - DEF9876",
          services: ["Troca de pastilhas de freio", "Fluido de freio"],
          parts: [
            { name: "Pastilhas de freio dianteiras", quantity: 1, unitPrice: 85.00 },
            { name: "Fluido de freio DOT4", quantity: 1, unitPrice: 18.50 }
          ],
          totalAmount: 280.00,
          status: "completed",
          mechanic: "André Santos",
          paymentMethod: "PIX",
          warranty: 60
        }
      ],
      notes: "Cliente nova, muito cuidadosa com o veículo."
    },
    {
      id: 3,
      name: "Pedro Henrique Almeida",
      email: "pedro.almeida@email.com",
      phone: "11965432109",
      alternativePhone: "1122223333",
      cpf: "45678912345",
      rg: "456789123",
      cnh: "45678912345",
      birthDate: "1978-12-03",
      status: "active",
      createdAt: "2022-08-10T14:20:00Z",
      lastService: "2024-08-05T11:00:00Z",
      totalServices: 25,
      totalSpent: 8750.25,
      address: {
        street: "Rua Augusta",
        number: "456",
        complement: "",
        neighborhood: "Consolação",
        city: "São Paulo",
        state: "SP",
        cep: "01305000"
      },
      vehicles: [
        {
          brand: "Ford",
          model: "Focus",
          year: 2017,
          plate: "GHI5432",
          color: "Preto",
          fuelType: "Flex",
          chassis: "9BWZZZ377VT004254",
          mileage: 95000,
          lastService: "2024-08-05T11:00:00Z",
          totalServices: 15,
          status: "maintenance",
          notes: "Necessita revisão completa do motor"
        },
        {
          brand: "Chevrolet",
          model: "Onix",
          year: 2021,
          plate: "JKL8765",
          color: "Vermelho",
          fuelType: "Flex",
          chassis: "9BWZZZ377VT004255",
          mileage: 18000,
          lastService: "2024-07-20T15:30:00Z",
          totalServices: 10,
          status: "active",
          notes: "Veículo novo, apenas manutenções preventivas"
        }
      ],
      serviceHistory: [
        {
          osNumber: "OS-2024-004",
          date: "2024-08-05T11:00:00Z",
          vehicle: "Ford Focus - GHI5432",
          services: ["Revisão completa", "Troca de correia dentada", "Velas de ignição"],
          parts: [
            { name: "Correia dentada", quantity: 1, unitPrice: 120.00 },
            { name: "Velas de ignição", quantity: 4, unitPrice: 35.00 },
            { name: "Filtro de combustível", quantity: 1, unitPrice: 28.00 }
          ],
          totalAmount: 650.00,
          status: "in_progress",
          mechanic: "Fernando Lima",
          paymentMethod: "Cartão",
          warranty: 120
        }
      ],
      notes: "Cliente antigo e confiável. Possui dois veículos e sempre agenda com antecedência."
    }
  ];

  useEffect(() => {
    // Simulate loading customers
    setCustomers(mockCustomers);
  }, []);

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handleNewCustomer = () => {
    setIsNewCustomerModalOpen(true);
  };

  const handleEditCustomer = (customer) => {
    console.log('Edit customer:', customer);
    // TODO: Implement edit customer functionality
  };

  const handleCreateWorkOrder = (customer) => {
    console.log('Create work order for customer:', customer);
    // TODO: Navigate to work order creation with customer pre-selected
  };

  const handleSaveNewCustomer = (newCustomer) => {
    setCustomers(prev => [...prev, newCustomer]);
    setSelectedCustomer(newCustomer);
  };

  const handleFloatingAction = (pathname) => {
    if (pathname === '/customer-management') {
      handleNewCustomer();
    }
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Clientes' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation userRole={userRole} />
      
      <div className="pt-16">
        <div className="flex items-center justify-between p-6 border-b border-border bg-card">
          <div className="flex-1">
            <BreadcrumbNavigation items={breadcrumbItems} className="mb-2" />
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Gerenciamento de Clientes</h1>
                <p className="text-muted-foreground">
                  Gerencie informações de clientes, histórico de serviços e dados de contato
                </p>
              </div>
              
              <div className="hidden lg:flex items-center space-x-3">
                <Button
                  variant="default"
                  iconName="UserPlus"
                  iconPosition="left"
                  onClick={handleNewCustomer}
                >
                  Novo Cliente
                </Button>
                <UserProfileDropdown />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
            {/* Search Panel */}
            <div className="lg:col-span-4">
              <CustomerSearchPanel
                customers={customers}
                onCustomerSelect={handleCustomerSelect}
                selectedCustomerId={selectedCustomer?.id}
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
              />
            </div>

            {/* Profile Panel */}
            <div className="lg:col-span-8">
              <CustomerProfilePanel
                customer={selectedCustomer}
                onEdit={handleEditCustomer}
                onCreateWorkOrder={handleCreateWorkOrder}
              />
            </div>
          </div>
        </div>
      </div>

      <FloatingActionButton onClick={handleFloatingAction} />

      <NewCustomerModal
        isOpen={isNewCustomerModalOpen}
        onClose={() => setIsNewCustomerModalOpen(false)}
        onSave={handleSaveNewCustomer}
      />
    </div>
  );
};

export default CustomerManagement;