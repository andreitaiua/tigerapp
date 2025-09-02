import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CreateWorkOrderModal = ({ 
  isOpen = false,
  onClose = () => {},
  onSubmit = () => {}
}) => {
  const [formData, setFormData] = useState({
    customerId: '',
    vehicleId: '',
    mechanic: '',
    services: [],
    problemDescription: '',
    estimatedCompletion: '',
    priority: 'normal'
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const customerOptions = [
    { value: '1', label: 'Maria Silva - (11) 99999-1111' },
    { value: '2', label: 'João Santos - (11) 99999-2222' },
    { value: '3', label: 'Ana Costa - (11) 99999-3333' },
    { value: '4', label: 'Pedro Oliveira - (11) 99999-4444' },
    { value: '5', label: 'Carlos Lima - (11) 99999-5555' }
  ];

  const vehicleOptions = [
    { value: '1', label: 'Honda Civic 2020 - ABC-1234' },
    { value: '2', label: 'Toyota Corolla 2019 - DEF-5678' },
    { value: '3', label: 'Volkswagen Gol 2018 - GHI-9012' },
    { value: '4', label: 'Ford Ka 2021 - JKL-3456' },
    { value: '5', label: 'Chevrolet Onix 2022 - MNO-7890' }
  ];

  const mechanicOptions = [
    { value: 'Carlos Silva', label: 'Carlos Silva' },
    { value: 'João Santos', label: 'João Santos' },
    { value: 'Pedro Oliveira', label: 'Pedro Oliveira' },
    { value: 'Ana Costa', label: 'Ana Costa' },
    { value: 'Roberto Lima', label: 'Roberto Lima' }
  ];

  const serviceOptions = [
    { value: 'revisao', label: 'Revisão Geral', price: 150.00 },
    { value: 'oleo', label: 'Troca de Óleo', price: 80.00 },
    { value: 'freios', label: 'Manutenção de Freios', price: 200.00 },
    { value: 'suspensao', label: 'Suspensão', price: 300.00 },
    { value: 'motor', label: 'Reparo do Motor', price: 500.00 },
    { value: 'eletrica', label: 'Sistema Elétrico', price: 180.00 },
    { value: 'ar', label: 'Ar Condicionado', price: 120.00 },
    { value: 'pneus', label: 'Troca de Pneus', price: 250.00 }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Baixa' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'Alta' },
    { value: 'urgent', label: 'Urgente' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceToggle = (serviceValue) => {
    setFormData(prev => ({
      ...prev,
      services: prev?.services?.includes(serviceValue)
        ? prev?.services?.filter(s => s !== serviceValue)
        : [...prev?.services, serviceValue]
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(formData);
      onClose();
      setFormData({
        customerId: '',
        vehicleId: '',
        mechanic: '',
        services: [],
        problemDescription: '',
        estimatedCompletion: '',
        priority: 'normal'
      });
      setCurrentStep(1);
    } catch (error) {
      console.error('Error creating work order:', error);
    } finally {
      setLoading(false);
    }
  };

  const canProceedToStep2 = formData?.customerId && formData?.vehicleId && formData?.mechanic;
  const canSubmit = canProceedToStep2 && formData?.services?.length > 0 && formData?.problemDescription && formData?.estimatedCompletion;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1050 p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Nova Ordem de Serviço</h2>
            <p className="text-sm text-muted-foreground">Etapa {currentStep} de 2</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Progress */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                1
              </div>
              <span className="text-sm font-medium">Informações Básicas</span>
            </div>
            <div className="flex-1 h-px bg-border"></div>
            <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                2
              </div>
              <span className="text-sm font-medium">Serviços e Detalhes</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                <Select
                  label="Cliente"
                  placeholder="Selecione o cliente"
                  options={customerOptions}
                  value={formData?.customerId}
                  onChange={(value) => handleInputChange('customerId', value)}
                  searchable
                  required
                />

                <Select
                  label="Veículo"
                  placeholder="Selecione o veículo"
                  options={vehicleOptions}
                  value={formData?.vehicleId}
                  onChange={(value) => handleInputChange('vehicleId', value)}
                  searchable
                  required
                />

                <Select
                  label="Mecânico Responsável"
                  placeholder="Selecione o mecânico"
                  options={mechanicOptions}
                  value={formData?.mechanic}
                  onChange={(value) => handleInputChange('mechanic', value)}
                  required
                />

                <Select
                  label="Prioridade"
                  placeholder="Selecione a prioridade"
                  options={priorityOptions}
                  value={formData?.priority}
                  onChange={(value) => handleInputChange('priority', value)}
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Serviços Solicitados *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {serviceOptions?.map((service) => (
                      <div
                        key={service?.value}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          formData?.services?.includes(service?.value)
                            ? 'border-primary bg-primary/5' :'border-border hover:bg-muted/30'
                        }`}
                        onClick={() => handleServiceToggle(service?.value)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">{service?.label}</span>
                          <span className="text-sm text-muted-foreground">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            })?.format(service?.price)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Input
                  label="Descrição do Problema"
                  type="text"
                  placeholder="Descreva o problema relatado pelo cliente..."
                  value={formData?.problemDescription}
                  onChange={(e) => handleInputChange('problemDescription', e?.target?.value)}
                  required
                />

                <Input
                  label="Previsão de Conclusão"
                  type="date"
                  value={formData?.estimatedCompletion}
                  onChange={(e) => handleInputChange('estimatedCompletion', e?.target?.value)}
                  required
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-border">
            <div className="flex items-center space-x-2">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                >
                  Voltar
                </Button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
              >
                Cancelar
              </Button>
              {currentStep === 1 ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  disabled={!canProceedToStep2}
                >
                  Próximo
                </Button>
              ) : (
                <Button
                  type="submit"
                  loading={loading}
                  disabled={!canSubmit}
                >
                  Criar OS
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkOrderModal;