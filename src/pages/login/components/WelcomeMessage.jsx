import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeMessage = () => {
  const features = [
    {
      id: 1,
      icon: 'Users',
      title: 'Gestão de Clientes',
      description: 'Cadastro completo e histórico de serviços'
    },
    {
      id: 2,
      icon: 'Wrench',
      title: 'Ordens de Serviço',
      description: 'Controle total dos trabalhos realizados'
    },
    {
      id: 3,
      icon: 'Package',
      title: 'Controle de Estoque',
      description: 'Gestão inteligente de peças e produtos'
    },
    {
      id: 4,
      icon: 'DollarSign',
      title: 'Financeiro',
      description: 'Relatórios e análises financeiras'
    }
  ];

  return (
    <div className="hidden lg:flex lg:w-1/2 bg-primary text-primary-foreground p-12 flex-col justify-center">
      <div className="max-w-md">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
            <Icon name="Wrench" size={24} color="white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">TigerApp</h2>
            <p className="text-primary-foreground/80 text-sm">
              Sistema de Gestão Automotiva
            </p>
          </div>
        </div>

        <h3 className="text-3xl font-bold mb-4">
          Bem-vindo ao futuro da gestão automotiva
        </h3>
        
        <p className="text-primary-foreground/90 mb-8 text-lg leading-relaxed">
          Gerencie sua oficina com eficiência total. Controle clientes, estoque, ordens de serviço e financeiro em uma única plataforma.
        </p>

        <div className="space-y-4">
          {features?.map((feature) => (
            <div key={feature?.id} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary-foreground/20 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon 
                  name={feature?.icon} 
                  size={16} 
                  color="white" 
                />
              </div>
              <div>
                <h4 className="font-semibold text-primary-foreground">
                  {feature?.title}
                </h4>
                <p className="text-primary-foreground/80 text-sm">
                  {feature?.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-primary-foreground/10 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Info" size={16} color="white" />
            <span className="font-medium text-sm">Credenciais de Teste</span>
          </div>
          <div className="text-xs text-primary-foreground/80 space-y-1">
            <p>• Gerente: admin@tigerapp.com / admin123</p>
            <p>• Mecânico: mecanico@tigerapp.com / mec123</p>
            <p>• Caixa: caixa@tigerapp.com / caixa123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;