import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginBackground from './components/LoginBackground';
import LoginForm from './components/LoginForm';
import WelcomeMessage from './components/WelcomeMessage';
import TrustSignals from './components/TrustSignals';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('tigerapp_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (credentials) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create user session
      const userSession = {
        id: Date.now(),
        email: credentials?.email,
        role: credentials?.role,
        name: getUserName(credentials?.email),
        loginTime: new Date()?.toISOString(),
        permissions: getRolePermissions(credentials?.role)
      };

      // Save to localStorage
      localStorage.setItem('tigerapp_user', JSON.stringify(userSession));
      localStorage.setItem('tigerapp_language', 'pt-BR');
      
      // Navigate to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserName = (email) => {
    const nameMap = {
      'admin@tigerapp.com': 'João Silva',
      'mecanico@tigerapp.com': 'Carlos Santos',
      'caixa@tigerapp.com': 'Maria Oliveira',
      'gerente@tigerapp.com': 'Pedro Costa'
    };
    return nameMap?.[email] || 'Usuário';
  };

  const getRolePermissions = (role) => {
    const permissions = {
      manager: ['dashboard', 'customers', 'work-orders', 'inventory', 'financial', 'reports', 'settings'],
      mechanic: ['dashboard', 'work-orders', 'customers'],
      cashier: ['dashboard', 'customers', 'work-orders', 'inventory', 'financial']
    };
    return permissions?.[role] || [];
  };

  return (
    <LoginBackground>
      <div className="flex flex-1">
        <WelcomeMessage />
        
        <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <LoginForm 
              onLogin={handleLogin}
              isLoading={isLoading}
            />
          </div>
          
          <div className="mt-12 w-full">
            <TrustSignals />
          </div>
        </div>
      </div>
    </LoginBackground>
  );
};

export default LoginPage;