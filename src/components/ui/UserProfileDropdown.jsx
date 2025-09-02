import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';

const UserProfileDropdown = ({ 
  user = { name: 'João Silva', role: 'Manager', email: 'joao@tigerapp.com' },
  onLogout = () => {},
  onProfileClick = () => {},
  onSettingsClick = () => {}
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const roleLabels = {
    mechanic: 'Mecânico',
    manager: 'Gerente',
    cashier: 'Caixa'
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuClick = (action) => {
    setIsOpen(false);
    action();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-muted transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <Icon name="User" size={16} color="white" />
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-foreground">{user?.name}</div>
          <div className="text-xs text-muted-foreground">
            {roleLabels?.[user?.role] || user?.role}
          </div>
        </div>
        <Icon 
          name="ChevronDown" 
          size={16} 
          className={`text-muted-foreground transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-md shadow-lg z-1010">
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={20} color="white" />
              </div>
              <div>
                <div className="font-medium text-popover-foreground">{user?.name}</div>
                <div className="text-sm text-muted-foreground">{user?.email}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {roleLabels?.[user?.role] || user?.role}
                </div>
              </div>
            </div>
          </div>

          <div className="py-2">
            <button
              onClick={() => handleMenuClick(onProfileClick)}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-200"
            >
              <Icon name="User" size={16} />
              <span>Meu Perfil</span>
            </button>
            
            <button
              onClick={() => handleMenuClick(onSettingsClick)}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-200"
            >
              <Icon name="Settings" size={16} />
              <span>Configurações</span>
            </button>

            <div className="border-t border-border my-2"></div>

            <button
              onClick={() => handleMenuClick(onLogout)}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors duration-200"
            >
              <Icon name="LogOut" size={16} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;