import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { invoiceService } from '../../../services/invoiceService';

const InvoiceGeneratorModal = ({ 
  isOpen, 
  onClose, 
  workOrder,
  onInvoiceCreated = () => {}
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    invoice_type: 'invoice',
    due_date: '',
    tax_amount: 0,
    discount_amount: 0,
    payment_method: '',
    notes: ''
  });
  const [error, setError] = useState('');

  if (!isOpen || !workOrder) return null;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(value);
  };

  const calculateTotals = () => {
    const subtotal = workOrder?.total_amount || 0;
    const taxAmount = parseFloat(formData?.tax_amount || 0);
    const discountAmount = parseFloat(formData?.discount_amount || 0);
    const totalAmount = subtotal + taxAmount - discountAmount;

    return {
      subtotal,
      taxAmount,
      discountAmount,
      totalAmount
    };
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');

    try {
      const totals = calculateTotals();

      const invoiceData = {
        work_order_id: workOrder?.id,
        customer_id: workOrder?.customer_id,
        invoice_type: formData?.invoice_type,
        due_date: formData?.due_date || null,
        subtotal: totals?.subtotal,
        tax_amount: totals?.taxAmount,
        discount_amount: totals?.discountAmount,
        total_amount: totals?.totalAmount,
        payment_method: formData?.payment_method || null,
        notes: formData?.notes || null,
        status: formData?.invoice_type === 'receipt' ? 'paid' : 'draft',
        paid_at: formData?.invoice_type === 'receipt' ? new Date()?.toISOString() : null
      };

      const newInvoice = await invoiceService?.createInvoice(invoiceData);
      
      onInvoiceCreated(newInvoice);
      onClose();
      
      // Reset form
      setFormData({
        invoice_type: 'invoice',
        due_date: '',
        tax_amount: 0,
        discount_amount: 0,
        payment_method: '',
        notes: ''
      });
    } catch (err) {
      setError(err?.message || 'Erro ao criar documento');
    } finally {
      setLoading(false);
    }
  };

  const totals = calculateTotals();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1050 p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            Gerar Documento - OS #{workOrder?.order_number}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
          />
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={16} className="text-destructive" />
                <span className="text-sm text-destructive">{error}</span>
              </div>
            </div>
          )}

          {/* Work Order Info */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">Cliente:</span>
              <span className="text-muted-foreground">{workOrder?.customer?.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">Veículo:</span>
              <span className="text-muted-foreground">
                {workOrder?.vehicle?.brand} {workOrder?.vehicle?.model} - {workOrder?.vehicle?.plate}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">Valor dos Serviços:</span>
              <span className="text-muted-foreground">{formatCurrency(workOrder?.total_amount || 0)}</span>
            </div>
          </div>

          {/* Document Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Tipo de Documento *
            </label>
            <Select
              value={formData?.invoice_type}
              onChange={(value) => handleInputChange('invoice_type', value)}
              required
            >
              <option value="invoice">Nota Fiscal</option>
              <option value="receipt">Recibo</option>
            </Select>
            <p className="text-xs text-muted-foreground">
              {formData?.invoice_type === 'invoice' ?'Nota Fiscal: Documento oficial para cobrança' :'Recibo: Comprovante de pagamento já realizado'
              }
            </p>
          </div>

          {/* Due Date (only for invoices) */}
          {formData?.invoice_type === 'invoice' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Data de Vencimento
              </label>
              <Input
                type="date"
                value={formData?.due_date}
                onChange={(e) => handleInputChange('due_date', e?.target?.value)}
                min={new Date()?.toISOString()?.split('T')?.[0]}
              />
            </div>
          )}

          {/* Payment Method (for receipts) */}
          {formData?.invoice_type === 'receipt' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Forma de Pagamento *
              </label>
              <Select
                value={formData?.payment_method}
                onChange={(value) => handleInputChange('payment_method', value)}
                required
              >
                <option value="">Selecione...</option>
                <option value="cash">Dinheiro</option>
                <option value="card">Cartão</option>
                <option value="bank_transfer">Transferência Bancária</option>
                <option value="pix">PIX</option>
              </Select>
            </div>
          )}

          {/* Tax Amount */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Impostos (R$)
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData?.tax_amount}
              onChange={(e) => handleInputChange('tax_amount', e?.target?.value)}
              placeholder="0,00"
            />
          </div>

          {/* Discount Amount */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Desconto (R$)
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData?.discount_amount}
              onChange={(e) => handleInputChange('discount_amount', e?.target?.value)}
              placeholder="0,00"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Observações
            </label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground resize-none"
              rows="3"
              value={formData?.notes}
              onChange={(e) => handleInputChange('notes', e?.target?.value)}
              placeholder="Observações adicionais..."
            />
          </div>

          {/* Totals Summary */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="text-foreground">{formatCurrency(totals?.subtotal)}</span>
            </div>
            {totals?.taxAmount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Impostos:</span>
                <span className="text-foreground">+{formatCurrency(totals?.taxAmount)}</span>
              </div>
            )}
            {totals?.discountAmount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Desconto:</span>
                <span className="text-destructive">-{formatCurrency(totals?.discountAmount)}</span>
              </div>
            )}
            <div className="border-t border-primary/20 pt-2">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-foreground">Total:</span>
                <span className="text-lg text-primary">{formatCurrency(totals?.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              iconName={loading ? "Loader2" : "FileText"}
              iconPosition="left"
              className={loading ? "animate-spin" : ""}
            >
              {loading 
                ? 'Gerando...' 
                : `Gerar ${formData?.invoice_type === 'invoice' ? 'Nota Fiscal' : 'Recibo'}`
              }
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceGeneratorModal;