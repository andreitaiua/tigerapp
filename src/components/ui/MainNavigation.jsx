import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const MainNavigation = ({ isCollapsed = false, userRole = 'manager' }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      roles: ['mechanic', 'manager', 'cashier'],
      badgeCount: 0
    },
    {
      id: 'customers',
      label: 'Clientes',
      path: '/customer-management',
      icon: 'Users',
      roles: ['manager', 'cashier'],
      badgeCount: 0
    },
    {
      id: 'work-orders',
      label: 'Ordens de Serviço',
      path: '/work-order-management',
      icon: 'Wrench',
      roles: ['mechanic', 'manager', 'cashier'],
      badgeCount: 3
    },
    {
      id: 'inventory',
      label: 'Estoque',
      path: '/inventory-management',
      icon: 'Package',
      roles: ['manager', 'cashier'],
      badgeCount: 2
    },
    {
      id: 'financial',
      label: 'Financeiro',
      path: '/financial-dashboard',
      icon: 'DollarSign',
      roles: ['manager'],
      badgeCount: 0
    }
  ];

  const filteredItems = navigationItems?.filter(item => 
    item?.roles?.includes(userRole)
  );

  useEffect(() => {
    const currentPath = location?.pathname;
    const currentItem = navigationItems?.find(item => item?.path === currentPath);
    if (currentItem) {
      setActiveTab(currentItem?.id);
    }
  }, [location?.pathname]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleTabClick = (itemId) => {
    setActiveTab(itemId);
  };

  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-1000 nav-shadow">
        <div className="flex justify-around items-center h-16 px-2 safe-area-inset-bottom">
          {filteredItems?.slice(0, 5)?.map((item) => (
            <Link
              key={item?.id}
              to={item?.path}
              onClick={() => handleTabClick(item?.id)}
              className={`flex flex-col items-center justify-center min-w-0 flex-1 py-1 px-1 rounded-md transition-colors duration-200 ${
                activeTab === item?.id
                  ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <div className="relative">
                <Icon 
                  name={item?.icon} 
                  size={20} 
                  className="mb-1"
                />
                {item?.badgeCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                    {item?.badgeCount > 9 ? '9+' : item?.badgeCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium truncate max-w-full">
                {item?.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-card border-b border-border z-1000 nav-shadow">
      <div className="flex items-center h-16 px-6">
        {/* Logo */}
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Icon name="Wrench" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-foreground">TigerApp</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center ml-12 space-x-1">
          {filteredItems?.map((item) => (
            <Link
              key={item?.id}
              to={item?.path}
              onClick={() => handleTabClick(item?.id)}
              className={`relative flex items-center space-x-2 px-6 py-4 rounded-md font-medium transition-colors duration-200 ${
                activeTab === item?.id
                  ? 'text-primary bg-primary/10 border-b-2 border-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={item?.icon} size={18} />
              <span>{item?.label}</span>
              {item?.badgeCount > 0 && (
                <span className="bg-accent text-accent-foreground text-xs rounded-full px-2 py-0.5 font-medium ml-1">
                  {item?.badgeCount > 99 ? '99+' : item?.badgeCount}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default MainNavigation;