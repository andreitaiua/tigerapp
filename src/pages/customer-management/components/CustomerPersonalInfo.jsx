import React from 'react';
import Icon from '../../../components/AppIcon';

const CustomerPersonalInfo = ({ customer }) => {
  const formatCPF = (cpf) => {
    const cleaned = cpf?.replace(/\D/g, '');
    return cleaned?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatCEP = (cep) => {
    const cleaned = cep?.replace(/\D/g, '');
    return cleaned?.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const formatPhone = (phone) => {
    const cleaned = phone?.replace(/\D/g, '');
    if (cleaned?.length === 11) {
      return `(${cleaned?.slice(0, 2)}) ${cleaned?.slice(2, 7)}-${cleaned?.slice(7)}`;
    }
    return phone;
  };

  const infoSections = [
    {
      title: 'Informações de Contato',
      icon: 'Phone',
      items: [
        { label: 'Telefone Principal', value: formatPhone(customer?.phone), icon: 'Phone' },
        { label: 'Email', value: customer?.email, icon: 'Mail' },
        { label: 'Telefone Alternativo', value: customer?.alternativePhone ? formatPhone(customer?.alternativePhone) : 'Não informado', icon: 'Phone' }
      ]
    },
    {
      title: 'Documentos',
      icon: 'FileText',
      items: [
        { label: 'CPF', value: formatCPF(customer?.cpf), icon: 'CreditCard' },
        { label: 'RG', value: customer?.rg || 'Não informado', icon: 'CreditCard' },
        { label: 'CNH', value: customer?.cnh || 'Não informado', icon: 'CreditCard' }
      ]
    },
    {
      title: 'Endereço',
      icon: 'MapPin',
      items: [
        { label: 'Logradouro', value: `${customer?.address?.street}, ${customer?.address?.number}`, icon: 'Home' },
        { label: 'Complemento', value: customer?.address?.complement || 'Não informado', icon: 'Home' },
        { label: 'Bairro', value: customer?.address?.neighborhood, icon: 'MapPin' },
        { label: 'Cidade/Estado', value: `${customer?.address?.city} - ${customer?.address?.state}`, icon: 'MapPin' },
        { label: 'CEP', value: formatCEP(customer?.address?.cep), icon: 'MapPin' }
      ]
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {infoSections?.map((section, sectionIndex) => (
        <div key={sectionIndex} className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name={section?.icon} size={18} className="text-primary" />
            <h3 className="font-medium text-foreground">{section?.title}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section?.items?.map((item, itemIndex) => (
              <div key={itemIndex} className="flex items-start space-x-3">
                <Icon name={item?.icon} size={16} className="text-muted-foreground mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item?.label}</p>
                  <p className="text-sm text-muted-foreground break-words">{item?.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {/* Additional Information */}
      <div className="bg-muted/30 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Info" size={18} className="text-primary" />
          <h3 className="font-medium text-foreground">Informações Adicionais</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <Icon name="Calendar" size={16} className="text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Data de Nascimento</p>
              <p className="text-sm text-muted-foreground">
                {customer?.birthDate ? new Date(customer.birthDate)?.toLocaleDateString('pt-BR') : 'Não informado'}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Icon name="UserCheck" size={16} className="text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Cliente desde</p>
              <p className="text-sm text-muted-foreground">
                {new Date(customer.createdAt)?.toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          {customer?.notes && (
            <div className="md:col-span-2 flex items-start space-x-3">
              <Icon name="MessageSquare" size={16} className="text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Observações</p>
                <p className="text-sm text-muted-foreground">{customer?.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerPersonalInfo;