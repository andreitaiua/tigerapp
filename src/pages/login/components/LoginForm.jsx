import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const LoginForm = ({ onLogin, isLoading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  const roleOptions = [
    { value: 'mechanic', label: 'Mecânico' },
    { value: 'manager', label: 'Gerente' },
    { value: 'cashier', label: 'Caixa' }
  ];

  const mockCredentials = {
    'admin@tigerapp.com': { password: 'admin123', roles: ['manager'] },
    'mecanico@tigerapp.com': { password: 'mec123', roles: ['mechanic'] },
    'caixa@tigerapp.com': { password: 'caixa123', roles: ['cashier'] },
    'gerente@tigerapp.com': { password: 'ger123', roles: ['manager'] }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateCredentials = () => {
    const newErrors = {};
    
    if (!formData?.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!formData?.email?.includes('@')) {
      newErrors.email = 'Email deve ter formato válido';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Senha é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleCredentialSubmit = (e) => {
    e?.preventDefault();
    
    if (!validateCredentials()) return;

    const user = mockCredentials?.[formData?.email];
    if (!user || user?.password !== formData?.password) {
      setErrors({ 
        email: 'Email ou senha incorretos. Use: admin@tigerapp.com / admin123',
        password: 'Email ou senha incorretos. Use: admin@tigerapp.com / admin123'
      });
      return;
    }

    if (user?.roles?.length === 1) {
      setFormData(prev => ({ ...prev, role: user?.roles?.[0] }));
      onLogin({ ...formData, role: user?.roles?.[0] });
    } else {
      setShowRoleSelection(true);
    }
  };

  const handleRoleSubmit = (e) => {
    e?.preventDefault();
    
    if (!formData?.role) {
      setErrors({ role: 'Selecione um perfil de acesso' });
      return;
    }

    onLogin(formData);
  };

  const handleForgotPassword = () => {
    alert('Funcionalidade de recuperação de senha será implementada em breve.');
  };

  if (showRoleSelection) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-card rounded-lg shadow-lg card-shadow p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Wrench" size={32} color="white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Selecionar Perfil</h2>
            <p className="text-muted-foreground">
              Escolha seu perfil de acesso ao sistema
            </p>
          </div>

          <form onSubmit={handleRoleSubmit} className="space-y-6">
            <Select
              label="Perfil de Acesso"
              placeholder="Selecione seu perfil"
              options={roleOptions}
              value={formData?.role}
              onChange={(value) => handleInputChange('role', value)}
              error={errors?.role}
              required
            />

            <div className="space-y-4">
              <Button
                type="submit"
                variant="default"
                size="lg"
                fullWidth
                loading={isLoading}
                iconName="LogIn"
                iconPosition="right"
              >
                Acessar Sistema
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="lg"
                fullWidth
                onClick={() => setShowRoleSelection(false)}
                iconName="ArrowLeft"
                iconPosition="left"
              >
                Voltar
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-lg shadow-lg card-shadow p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Wrench" size={32} color="white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">TigerApp</h1>
          <p className="text-muted-foreground">
            Sistema de Gestão Automotiva
          </p>
        </div>

        <form onSubmit={handleCredentialSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            value={formData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            error={errors?.email}
            required
            iconName="Mail"
          />

          <Input
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            value={formData?.password}
            onChange={(e) => handleInputChange('password', e?.target?.value)}
            error={errors?.password}
            required
            iconName="Lock"
          />

          <div className="space-y-4">
            <Button
              type="submit"
              variant="default"
              size="lg"
              fullWidth
              loading={isLoading}
              iconName="LogIn"
              iconPosition="right"
            >
              Entrar
            </Button>

            <button
              type="button"
              onClick={handleForgotPassword}
              className="w-full text-sm text-primary hover:text-primary/80 transition-colors duration-200"
            >
              Esqueci minha senha
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;