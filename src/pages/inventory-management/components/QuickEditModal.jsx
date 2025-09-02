import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const QuickEditModal = ({ 
  item,
  isOpen = false,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: '',
    currentStock: 0,
    minimumStock: 0,
    unitPrice: 0,
    supplier: '',
    location: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const categoryOptions = [
    { value: 'motor', label: 'Motor' },
    { value: 'freios', label: 'Sistema de Freios' },
    { value: 'suspensao', label: 'Suspensão' },
    { value: 'eletrica', label: 'Sistema Elétrico' },
    { value: 'pneus', label: 'Pneus e Rodas' },
    { value: 'carroceria', label: 'Carroceria' },
    { value: 'ferramentas', label: 'Ferramentas' }
  ];

  const supplierOptions = [
    { value: 'AutoPeças Brasil', label: 'AutoPeças Brasil' },
    { value: 'Distribuidora Central', label: 'Distribuidora Central' },
    { value: 'MegaParts', label: 'MegaParts' },
    { value: 'Fornecedor ABC', label: 'Fornecedor ABC' },
    { value: 'Parts Express', label: 'Parts Express' }
  ];

  useEffect(() => {
    if (item && isOpen) {
      setFormData({
        name: item?.name || '',
        code: item?.code || '',
        category: item?.category || '',
        currentStock: item?.currentStock || 0,
        minimumStock: item?.minimumStock || 0,
        unitPrice: item?.unitPrice || 0,
        supplier: item?.supplier || '',
        location: item?.location || ''
      });
      setErrors({});
    }
  }, [item, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
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

    if (!formData?.code?.trim()) {
      newErrors.code = 'Código é obrigatório';
    }

    if (!formData?.category) {
      newErrors.category = 'Categoria é obrigatória';
    }

    if (formData?.currentStock < 0) {
      newErrors.currentStock = 'Estoque atual não pode ser negativo';
    }

    if (formData?.minimumStock < 0) {
      newErrors.minimumStock = 'Estoque mínimo não pode ser negativo';
    }

    if (formData?.unitPrice <= 0) {
      newErrors.unitPrice = 'Preço deve ser maior que zero';
    }

    if (!formData?.supplier) {
      newErrors.supplier = 'Fornecedor é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedItem = {
        ...item,
        ...formData,
        lastUpdated: new Date()?.toISOString()
      };
      
      onSave(updatedItem);
      onClose();
    } catch (error) {
      console.error('Error saving item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      code: '',
      category: '',
      currentStock: 0,
      minimumStock: 0,
      unitPrice: 0,
      supplier: '',
      location: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-1040 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon name="Edit" size={20} className="text-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              {item ? 'Editar Item' : 'Novo Item'}
            </h2>
          </div>
          <Button
            variant="ghost"
            iconName="X"
            onClick={handleClose}
          />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Informações Básicas</h3>
              
              <Input
                label="Nome do Produto"
                type="text"
                placeholder="Digite o nome do produto"
                value={formData?.name}
                onChange={(e) => handleInputChange('name', e?.target?.value)}
                error={errors?.name}
                required
              />

              <Input
                label="Código do Produto"
                type="text"
                placeholder="Digite o código"
                value={formData?.code}
                onChange={(e) => handleInputChange('code', e?.target?.value)}
                error={errors?.code}
                required
              />

              <Select
                label="Categoria"
                options={categoryOptions}
                value={formData?.category}
                onChange={(value) => handleInputChange('category', value)}
                error={errors?.category}
                placeholder="Selecione uma categoria"
                required
              />

              <Input
                label="Localização no Estoque"
                type="text"
                placeholder="Ex: A1-B2-C3"
                value={formData?.location}
                onChange={(e) => handleInputChange('location', e?.target?.value)}
                description="Localização física no estoque"
              />
            </div>

            {/* Stock and Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Estoque e Preços</h3>
              
              <Input
                label="Estoque Atual"
                type="number"
                placeholder="0"
                value={formData?.currentStock}
                onChange={(e) => handleInputChange('currentStock', parseInt(e?.target?.value) || 0)}
                error={errors?.currentStock}
                min="0"
                required
              />

              <Input
                label="Estoque Mínimo"
                type="number"
                placeholder="0"
                value={formData?.minimumStock}
                onChange={(e) => handleInputChange('minimumStock', parseInt(e?.target?.value) || 0)}
                error={errors?.minimumStock}
                min="0"
                description="Quantidade mínima para alerta de reposição"
                required
              />

              <Input
                label="Preço Unitário (R$)"
                type="number"
                placeholder="0,00"
                value={formData?.unitPrice}
                onChange={(e) => handleInputChange('unitPrice', parseFloat(e?.target?.value) || 0)}
                error={errors?.unitPrice}
                min="0"
                step="0.01"
                required
              />

              <Select
                label="Fornecedor"
                options={supplierOptions}
                value={formData?.supplier}
                onChange={(value) => handleInputChange('supplier', value)}
                error={errors?.supplier}
                placeholder="Selecione um fornecedor"
                searchable
                required
              />
            </div>
          </div>

          {/* Stock Level Warning */}
          {formData?.currentStock > 0 && formData?.minimumStock > 0 && formData?.currentStock <= formData?.minimumStock && (
            <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-md">
              <div className="flex items-center space-x-2">
                <Icon name="AlertTriangle" size={16} className="text-warning" />
                <span className="text-sm font-medium text-warning">
                  Atenção: O estoque atual está igual ou abaixo do estoque mínimo
                </span>
              </div>
            </div>
          )}

          {/* Value Calculation */}
          {formData?.currentStock > 0 && formData?.unitPrice > 0 && (
            <div className="mt-6 p-4 bg-muted/30 rounded-md">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Valor Total em Estoque:</span>
                <span className="text-lg font-semibold text-foreground">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })?.format(formData?.currentStock * formData?.unitPrice)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            loading={isLoading}
            iconName="Save"
            iconPosition="left"
          >
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickEditModal;