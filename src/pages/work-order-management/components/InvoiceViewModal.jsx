import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InvoiceViewModal = ({ 
  isOpen, 
  onClose, 
  invoice
}) => {
  const [printing, setPrinting] = useState(false);

  if (!isOpen || !invoice) return null;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(value);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date)?.toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status) => {
    const colors = {
      'draft': 'bg-warning/10 text-warning border-warning/20',
      'sent': 'bg-primary/10 text-primary border-primary/20',
      'paid': 'bg-success/10 text-success border-success/20',
      'cancelled': 'bg-destructive/10 text-destructive border-destructive/20'
    };
    return colors?.[status] || 'bg-muted/10 text-muted-foreground border-muted/20';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'draft': 'Rascunho',
      'sent': 'Enviado',
      'paid': 'Pago',
      'cancelled': 'Cancelado'
    };
    return labels?.[status] || status;
  };

  const getTypeLabel = (type) => {
    return type === 'invoice' ? 'Nota Fiscal' : 'Recibo';
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      'cash': 'Dinheiro',
      'card': 'Cartão',
      'bank_transfer': 'Transferência Bancária',
      'pix': 'PIX'
    };
    return labels?.[method] || method;
  };

  const handlePrint = () => {
    setPrinting(true);
    // Simulate print functionality
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1050 p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-foreground">
              {getTypeLabel(invoice?.invoice_type)} #{invoice?.invoice_number}
            </h2>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(invoice?.status)}`}>
              {getStatusLabel(invoice?.status)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              disabled={printing}
              iconName={printing ? "Loader2" : "Printer"}
            >
              {printing ? 'Imprimindo...' : 'Imprimir'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              iconName="X"
            />
          </div>
        </div>

        {/* Invoice Content */}
        <div className="p-6 space-y-8">
          {/* Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Info */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Oficina TigerApp</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Rua da Oficina, 123</p>
                <p>São Paulo, SP - CEP 01234-567</p>
                <p>Tel: (11) 3456-7890</p>
                <p>CNPJ: 12.345.678/0001-90</p>
              </div>
            </div>

            {/* Invoice Info */}
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-foreground">Número:</span>
                  <span className="text-sm text-muted-foreground">{invoice?.invoice_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-foreground">Data de Emissão:</span>
                  <span className="text-sm text-muted-foreground">{formatDate(invoice?.issue_date)}</span>
                </div>
                {invoice?.due_date && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-foreground">Data de Vencimento:</span>
                    <span className="text-sm text-muted-foreground">{formatDate(invoice?.due_date)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-foreground">OS Referência:</span>
                  <span className="text-sm text-muted-foreground">#{invoice?.work_order?.order_number}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="border border-border rounded-lg p-4">
            <h4 className="text-lg font-semibold text-foreground mb-3">Cliente</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Icon name="User" size={16} className="text-muted-foreground" />
                <span className="font-medium text-foreground">{invoice?.customer?.name}</span>
              </div>
              {invoice?.customer?.email && (
                <div className="flex items-center space-x-2">
                  <Icon name="Mail" size={16} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{invoice?.customer?.email}</span>
                </div>
              )}
              {invoice?.customer?.phone && (
                <div className="flex items-center space-x-2">
                  <Icon name="Phone" size={16} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{invoice?.customer?.phone}</span>
                </div>
              )}
              {invoice?.customer?.document_number && (
                <div className="flex items-center space-x-2">
                  <Icon name="FileText" size={16} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">CPF/CNPJ: {invoice?.customer?.document_number}</span>
                </div>
              )}
            </div>
          </div>

          {/* Vehicle Info */}
          {invoice?.work_order?.vehicle && (
            <div className="border border-border rounded-lg p-4">
              <h4 className="text-lg font-semibold text-foreground mb-3">Veículo</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Icon name="Car" size={16} className="text-muted-foreground" />
                  <span className="font-medium text-foreground">
                    {invoice?.work_order?.vehicle?.brand} {invoice?.work_order?.vehicle?.model} {invoice?.work_order?.vehicle?.year}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Hash" size={16} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Placa: {invoice?.work_order?.vehicle?.plate}</span>
                </div>
              </div>
            </div>
          )}

          {/* Services */}
          {invoice?.work_order?.work_order_services?.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground">Serviços Realizados</h4>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium text-foreground">Serviço</th>
                      <th className="text-center p-3 text-sm font-medium text-foreground">Qtd</th>
                      <th className="text-right p-3 text-sm font-medium text-foreground">Valor Unit.</th>
                      <th className="text-right p-3 text-sm font-medium text-foreground">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice?.work_order?.work_order_services?.map((item, index) => (
                      <tr key={index} className="border-t border-border">
                        <td className="p-3">
                          <div>
                            <div className="font-medium text-foreground">{item?.service?.name}</div>
                            {item?.service?.description && (
                              <div className="text-sm text-muted-foreground">{item?.service?.description}</div>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-center text-muted-foreground">{item?.quantity}</td>
                        <td className="p-3 text-right text-muted-foreground">{formatCurrency(item?.unit_price)}</td>
                        <td className="p-3 text-right font-medium text-foreground">{formatCurrency(item?.total_price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Parts */}
          {invoice?.work_order?.work_order_parts?.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground">Peças Utilizadas</h4>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium text-foreground">Peça</th>
                      <th className="text-center p-3 text-sm font-medium text-foreground">Qtd</th>
                      <th className="text-right p-3 text-sm font-medium text-foreground">Valor Unit.</th>
                      <th className="text-right p-3 text-sm font-medium text-foreground">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice?.work_order?.work_order_parts?.map((item, index) => (
                      <tr key={index} className="border-t border-border">
                        <td className="p-3">
                          <div>
                            <div className="font-medium text-foreground">{item?.inventory_item?.name}</div>
                            <div className="text-sm text-muted-foreground">Código: {item?.inventory_item?.code}</div>
                          </div>
                        </td>
                        <td className="p-3 text-center text-muted-foreground">{item?.quantity}</td>
                        <td className="p-3 text-right text-muted-foreground">{formatCurrency(item?.unit_price)}</td>
                        <td className="p-3 text-right font-medium text-foreground">{formatCurrency(item?.total_price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Totals */}
          <div className="border border-border rounded-lg p-4 bg-muted/30">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">Subtotal:</span>
                <span className="text-muted-foreground">{formatCurrency(invoice?.subtotal)}</span>
              </div>
              
              {invoice?.tax_amount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">Impostos:</span>
                  <span className="text-muted-foreground">+{formatCurrency(invoice?.tax_amount)}</span>
                </div>
              )}
              
              {invoice?.discount_amount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">Desconto:</span>
                  <span className="text-destructive">-{formatCurrency(invoice?.discount_amount)}</span>
                </div>
              )}
              
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-semibold text-foreground">Total:</span>
                  <span className="text-2xl font-bold text-primary">{formatCurrency(invoice?.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          {invoice?.payment_method && (
            <div className="border border-border rounded-lg p-4">
              <h4 className="text-lg font-semibold text-foreground mb-3">Pagamento</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">Forma de Pagamento:</span>
                  <span className="text-muted-foreground">{getPaymentMethodLabel(invoice?.payment_method)}</span>
                </div>
                {invoice?.paid_at && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">Data do Pagamento:</span>
                    <span className="text-muted-foreground">{formatDate(invoice?.paid_at)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {invoice?.notes && (
            <div className="border border-border rounded-lg p-4">
              <h4 className="text-lg font-semibold text-foreground mb-3">Observações</h4>
              <p className="text-sm text-muted-foreground">{invoice?.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-6">
          <div className="flex items-center justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Fechar
            </Button>
            <Button
              onClick={handlePrint}
              disabled={printing}
              iconName={printing ? "Loader2" : "Printer"}
            >
              {printing ? 'Imprimindo...' : 'Imprimir'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceViewModal;