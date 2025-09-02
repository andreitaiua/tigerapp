import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const certifications = [
    {
      id: 1,
      name: 'LGPD Compliance',
      icon: 'Shield',
      description: 'Dados protegidos conforme LGPD'
    },
    {
      id: 2,
      name: 'SSL Seguro',
      icon: 'Lock',
      description: 'Conexão criptografada'
    },
    {
      id: 3,
      name: 'Certificado Digital',
      icon: 'Award',
      description: 'Empresa certificada'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {certifications?.map((cert) => (
          <div
            key={cert?.id}
            className="flex items-center justify-center space-x-2 p-3 bg-card/50 rounded-md border border-border/50"
          >
            <Icon 
              name={cert?.icon} 
              size={16} 
              className="text-success flex-shrink-0" 
            />
            <div className="text-center">
              <div className="text-xs font-medium text-foreground">
                {cert?.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {cert?.description}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-6 text-xs text-muted-foreground">
        <p>© {new Date()?.getFullYear()} TigerApp. Todos os direitos reservados.</p>
        <p className="mt-1">
          Sistema desenvolvido para oficinas automotivas brasileiras
        </p>
      </div>
    </div>
  );
};

export default TrustSignals;