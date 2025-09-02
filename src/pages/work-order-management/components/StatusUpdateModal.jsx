import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const StatusUpdateModal = ({ 
  isOpen = false,
  workOrder = null,
  onClose = () => {},
  onSubmit = () => {}
}) => {
  const [formData, setFormData] = useState({
    status: workOrder?.status || '',
    notes: '',
    estimatedCompletion: workOrder?.estimatedCompletion || '',
    notifyCustomer: true
  });
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { value: 'Aguardando', label: 'Aguardando', description: 'OS criada, aguardando início dos trabalhos' },
    { value: 'Em Andamento', label: 'Em Andamento', description: 'Serviços sendo executados' },
    { value: 'Aguardando Peças', label: 'Aguardando Peças', description: 'Aguardando chegada de peças' },
    { value: 'Aguardando Cliente', label: 'Aguardando Cliente', description: 'Aguardando aprovação ou decisão do cliente' },
    { value: 'Concluído', label: 'Concluído', description: 'Todos os serviços foram finalizados' },
    { value: 'Cancelado', label: 'Cancelado', description: 'OS cancelada pelo cliente ou oficina' }
  ];

  const statusColors = {
    'Aguardando': 'bg-warning/10 text-warning border-warning/20',
    'Em Andamento': 'bg-primary/10 text-primary border-primary/20',
    'Aguardando Peças': 'bg-accent/10 text-accent border-accent/20',
    'Aguardando Cliente': 'bg-secondary/10 text-secondary border-secondary/20',
    'Concluído': 'bg-success/10 text-success border-success/20',
    'Cancelado': 'bg-destructive/10 text-destructive border-destructive/20'
  };

  React.useEffect(() => {
    if (workOrder) {
      setFormData({
        status: workOrder?.status,
        notes: '',
        estimatedCompletion: workOrder?.estimatedCompletion,
        notifyCustomer: true
      });
    }
  }, [workOrder]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit({
        workOrderId: workOrder?.id,
        ...formData
      });
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('pt-BR');
  };

  if (!isOpen || !workOrder) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1050 p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Atualizar Status</h2>
            <p className="text-sm text-muted-foreground">OS #{workOrder?.osNumber} - {workOrder?.customerName}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Current Status */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <span className="text-sm text-muted-foreground">Status atual:</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors?.[workOrder?.status]}`}>
              {workOrder?.status}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <Select
              label="Novo Status"
              placeholder="Selecione o novo status"
              options={statusOptions}
              value={formData?.status}
              onChange={(value) => handleInputChange('status', value)}
              required
            />

            <Input
              label="Observações"
              type="text"
              placeholder="Adicione observações sobre a mudança de status..."
              value={formData?.notes}
              onChange={(e) => handleInputChange('notes', e?.target?.value)}
              description="Estas observações serão adicionadas ao histórico da OS"
            />

            {(formData?.status === 'Em Andamento' || formData?.status === 'Aguardando Peças') && (
              <Input
                label="Nova Previsão de Conclusão"
                type="date"
                value={formData?.estimatedCompletion}
                onChange={(e) => handleInputChange('estimatedCompletion', e?.target?.value)}
                description="Atualize a previsão se necessário"
              />
            )}

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="notifyCustomer"
                checked={formData?.notifyCustomer}
                onChange={(e) => handleInputChange('notifyCustomer', e?.target?.checked)}
                className="rounded border-border"
              />
              <label htmlFor="notifyCustomer" className="text-sm text-foreground">
                Notificar cliente sobre a mudança de status
              </label>
            </div>

            {formData?.status === 'Concluído' && (
              <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span className="text-sm font-medium text-success">Finalizando OS</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ao marcar como concluído, a OS será finalizada e o cliente será notificado para retirada do veículo.
                </p>
              </div>
            )}

            {formData?.status === 'Cancelado' && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="XCircle" size={16} className="text-destructive" />
                  <span className="text-sm font-medium text-destructive">Cancelando OS</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Esta ação cancelará a ordem de serviço. Certifique-se de que é isso que deseja fazer.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-2 p-6 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={loading}
              variant={formData?.status === 'Cancelado' ? 'destructive' : 'default'}
            >
              {formData?.status === 'Cancelado' ? 'Cancelar OS' : 'Atualizar Status'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StatusUpdateModal;