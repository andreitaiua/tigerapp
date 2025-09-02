import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const NewCustomerModal = ({ 
  isOpen = false, 
  onClose = () => {}, 
  onSave = () => {} 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    alternativePhone: '',
    cpf: '',
    rg: '',
    cnh: '',
    birthDate: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      cep: ''
    },
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const brazilianStates = [
    { value: 'AC', label: 'Acre' },
    { value: 'AL', label: 'Alagoas' },
    { value: 'AP', label: 'Amapá' },
    { value: 'AM', label: 'Amazonas' },
    { value: 'BA', label: 'Bahia' },
    { value: 'CE', label: 'Ceará' },
    { value: 'DF', label: 'Distrito Federal' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' },
    { value: 'MA', label: 'Maranhão' },
    { value: 'MT', label: 'Mato Grosso' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'PA', label: 'Pará' },
    { value: 'PB', label: 'Paraíba' },
    { value: 'PR', label: 'Paraná' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'PI', label: 'Piauí' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'RN', label: 'Rio Grande do Norte' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'RO', label: 'Rondônia' },
    { value: 'RR', label: 'Roraima' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'SE', label: 'Sergipe' },
    { value: 'TO', label: 'Tocantins' }
  ];

  const handleInputChange = (field, value) => {
    if (field?.includes('.')) {
      const [parent, child] = field?.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev?.[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData?.phone?.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }

    if (!formData?.cpf?.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCustomer = {
        id: Date.now(),
        ...formData,
        status: 'active',
        createdAt: new Date()?.toISOString(),
        totalServices: 0,
        totalSpent: 0,
        vehicles: [],
        serviceHistory: []
      };

      onSave(newCustomer);
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        alternativePhone: '',
        cpf: '',
        rg: '',
        cnh: '',
        birthDate: '',
        address: {
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
          cep: ''
        },
        notes: ''
      });
    } catch (error) {
      console.error('Error saving customer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1050 p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="UserPlus" size={20} color="white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Novo Cliente</h2>
              <p className="text-sm text-muted-foreground">Cadastre um novo cliente no sistema</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isLoading}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Informações Pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nome Completo"
                  type="text"
                  placeholder="Digite o nome completo"
                  value={formData?.name}
                  onChange={(e) => handleInputChange('name', e?.target?.value)}
                  error={errors?.name}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  placeholder="Digite o email"
                  value={formData?.email}
                  onChange={(e) => handleInputChange('email', e?.target?.value)}
                  error={errors?.email}
                  required
                />

                <Input
                  label="Telefone Principal"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={formData?.phone}
                  onChange={(e) => handleInputChange('phone', e?.target?.value)}
                  error={errors?.phone}
                  required
                />

                <Input
                  label="Telefone Alternativo"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={formData?.alternativePhone}
                  onChange={(e) => handleInputChange('alternativePhone', e?.target?.value)}
                />

                <Input
                  label="CPF"
                  type="text"
                  placeholder="000.000.000-00"
                  value={formData?.cpf}
                  onChange={(e) => handleInputChange('cpf', e?.target?.value)}
                  error={errors?.cpf}
                  required
                />

                <Input
                  label="RG"
                  type="text"
                  placeholder="00.000.000-0"
                  value={formData?.rg}
                  onChange={(e) => handleInputChange('rg', e?.target?.value)}
                />

                <Input
                  label="CNH"
                  type="text"
                  placeholder="00000000000"
                  value={formData?.cnh}
                  onChange={(e) => handleInputChange('cnh', e?.target?.value)}
                />

                <Input
                  label="Data de Nascimento"
                  type="date"
                  value={formData?.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e?.target?.value)}
                />
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Endereço</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Logradouro"
                    type="text"
                    placeholder="Rua, Avenida, etc."
                    value={formData?.address?.street}
                    onChange={(e) => handleInputChange('address.street', e?.target?.value)}
                  />
                </div>

                <Input
                  label="Número"
                  type="text"
                  placeholder="123"
                  value={formData?.address?.number}
                  onChange={(e) => handleInputChange('address.number', e?.target?.value)}
                />

                <Input
                  label="Complemento"
                  type="text"
                  placeholder="Apto, Bloco, etc."
                  value={formData?.address?.complement}
                  onChange={(e) => handleInputChange('address.complement', e?.target?.value)}
                />

                <Input
                  label="Bairro"
                  type="text"
                  placeholder="Nome do bairro"
                  value={formData?.address?.neighborhood}
                  onChange={(e) => handleInputChange('address.neighborhood', e?.target?.value)}
                />

                <Input
                  label="Cidade"
                  type="text"
                  placeholder="Nome da cidade"
                  value={formData?.address?.city}
                  onChange={(e) => handleInputChange('address.city', e?.target?.value)}
                />

                <Select
                  label="Estado"
                  placeholder="Selecione o estado"
                  options={brazilianStates}
                  value={formData?.address?.state}
                  onChange={(value) => handleInputChange('address.state', value)}
                />

                <Input
                  label="CEP"
                  type="text"
                  placeholder="00000-000"
                  value={formData?.address?.cep}
                  onChange={(e) => handleInputChange('address.cep', e?.target?.value)}
                />
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Observações</h3>
              <textarea
                className="w-full p-3 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
                rows={4}
                placeholder="Observações adicionais sobre o cliente..."
                value={formData?.notes}
                onChange={(e) => handleInputChange('notes', e?.target?.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-muted/30">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              iconName="Save"
              iconPosition="left"
            >
              Salvar Cliente
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCustomerModal;