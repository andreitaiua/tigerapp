import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const FloatingActionButton = ({ 
  onClick = () => {},
  className = ""
}) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [actionConfig, setActionConfig] = useState(null);

  const actionConfigs = {
    '/work-order-management': {
      icon: 'Plus',
      label: 'Nova OS',
      bgColor: 'bg-primary',
      hoverColor: 'hover:bg-primary/90',
      textColor: 'text-primary-foreground'
    },
    '/customer-management': {
      icon: 'UserPlus',
      label: 'Novo Cliente',
      bgColor: 'bg-success',
      hoverColor: 'hover:bg-success/90',
      textColor: 'text-success-foreground'
    },
    '/inventory-management': {
      icon: 'Package',
      label: 'Novo Item',
      bgColor: 'bg-accent',
      hoverColor: 'hover:bg-accent/90',
      textColor: 'text-accent-foreground'
    }
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
    const config = actionConfigs?.[location?.pathname];
    setActionConfig(config);
  }, [location?.pathname]);

  if (!isMobile || !actionConfig) {
    return null;
  }

  const handleClick = () => {
    onClick(location?.pathname);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        fixed bottom-20 right-4 z-1020
        ${actionConfig?.bgColor} ${actionConfig?.hoverColor} ${actionConfig?.textColor}
        rounded-full shadow-lg floating-shadow
        flex items-center justify-center
        h-14 w-14 md:h-16 md:w-auto md:px-6
        transition-all duration-300 ease-out
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
        active:scale-95
        ${className}
      `}
      aria-label={actionConfig?.label}
    >
      <Icon name={actionConfig?.icon} size={24} />
      <span className="hidden md:block ml-2 font-medium">
        {actionConfig?.label}
      </span>
    </button>
  );
};

export default FloatingActionButton;