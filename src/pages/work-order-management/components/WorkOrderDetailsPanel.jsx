import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import InvoiceGeneratorModal from './InvoiceGeneratorModal';
import InvoiceViewModal from './InvoiceViewModal';
import { invoiceService } from '../../../services/invoiceService';

const WorkOrderDetailsPanel = ({ 
  workOrder = null,
  onClose = () => {},
  onStatusUpdate = () => {},
  onPrint = () => {},
  onEdit = () => {}
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showInvoiceView, setShowInvoiceView] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);

  React.useEffect(() => {
    if (workOrder?.id && activeTab === 'invoices') {
      loadInvoices();
    }
  }, [workOrder?.id, activeTab]);

  const loadInvoices = async () => {
    try {
      setLoadingInvoices(true);
      const invoiceData = await invoiceService?.getInvoicesByWorkOrder(workOrder?.id);
      setInvoices(invoiceData);
    } catch (error) {
      console.log('Error loading invoices:', error);
    } finally {
      setLoadingInvoices(false);
    }
  };

  if (!workOrder) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Selecione uma OS</h3>
          <p className="text-muted-foreground">Clique em uma ordem de serviço para ver os detalhes</p>
        </div>
      </div>
    );
  }

  const statusColors = {
    'pending': 'bg-warning/10 text-warning border-warning/20',
    'in_progress': 'bg-primary/10 text-primary border-primary/20',
    'completed': 'bg-success/10 text-success border-success/20',
    'cancelled': 'bg-destructive/10 text-destructive border-destructive/20'
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(value);
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('pt-BR');
  };

  const formatDateTime = (date) => {
    return new Date(date)?.toLocaleString('pt-BR');
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'Aguardando',
      'in_progress': 'Em Andamento',
      'completed': 'Concluído',
      'cancelled': 'Cancelado'
    };
    return labels?.[status] || status;
  };

  const handleInvoiceCreated = (newInvoice) => {
    setInvoices(prev => [newInvoice, ...prev]);
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceView(true);
  };

  const tabs = [
    { id: 'details', label: 'Detalhes', icon: 'FileText' },
    { id: 'services', label: 'Serviços', icon: 'Wrench' },
    { id: 'parts', label: 'Peças', icon: 'Package' },
    { id: 'invoices', label: 'Documentos', icon: 'Receipt' },
    { id: 'history', label: 'Histórico', icon: 'Clock' }
  ];

  return (
    <>
      <div className="bg-card rounded-lg border border-border h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-foreground">OS #{workOrder?.order_number}</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors?.[workOrder?.status]}`}>
              {getStatusLabel(workOrder?.status)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {workOrder?.status === 'completed' && (
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowInvoiceModal(true)}
                iconName="FileText"
              >
                Gerar NF/Recibo
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPrint(workOrder)}
              iconName="Printer"
            >
              Imprimir
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(workOrder)}
              iconName="Edit"
            >
              Editar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              iconName="X"
            />
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-border">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab?.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
              {tab?.id === 'invoices' && invoices?.length > 0 && (
                <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                  {invoices?.length}
                </span>
              )}
            </button>
          ))}
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Informações do Cliente</h4>
                <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Icon name="User" size={16} className="text-muted-foreground" />
                    <span className="font-medium text-foreground">{workOrder?.customerName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Phone" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{workOrder?.customerPhone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Mail" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{workOrder?.customerEmail}</span>
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Informações do Veículo</h4>
                <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Icon name="Car" size={16} className="text-muted-foreground" />
                    <span className="font-medium text-foreground">
                      {workOrder?.vehicle?.brand} {workOrder?.vehicle?.model} {workOrder?.vehicle?.year}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Hash" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Placa: {workOrder?.vehicle?.plate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Gauge" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">KM: {workOrder?.vehicle?.mileage?.toLocaleString('pt-BR')}</span>
                  </div>
                </div>
              </div>

              {/* Assignment Information */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Atribuição</h4>
                <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Icon name="User" size={16} className="text-muted-foreground" />
                    <span className="font-medium text-foreground">{workOrder?.mechanic}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Calendar" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Previsão: {formatDate(workOrder?.estimatedCompletion)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Problem Description */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Descrição do Problema</h4>
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">{workOrder?.problemDescription}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">Serviços Solicitados</h4>
                <Button variant="outline" size="sm" iconName="Plus">
                  Adicionar Serviço
                </Button>
              </div>
              <div className="space-y-3">
                {workOrder?.services?.map((service, index) => (
                  <div key={index} className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{service?.name}</span>
                      <span className="font-medium text-foreground">{formatCurrency(service?.price)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{service?.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Tempo estimado: {service?.estimatedHours}h</span>
                      <span>Mão de obra: {formatCurrency(service?.laborCost)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'parts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">Peças Utilizadas</h4>
                <Button variant="outline" size="sm" iconName="Plus">
                  Adicionar Peça
                </Button>
              </div>
              <div className="space-y-3">
                {workOrder?.parts?.map((part, index) => (
                  <div key={index} className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{part?.name}</span>
                      <span className="font-medium text-foreground">{formatCurrency(part?.totalPrice)}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Código: {part?.code}</span>
                      <span>Qtd: {part?.quantity}</span>
                      <span>Unitário: {formatCurrency(part?.unitPrice)}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className={`w-2 h-2 rounded-full ${
                        part?.inStock ? 'bg-success' : 'bg-warning'
                      }`}></div>
                      <span className="text-xs text-muted-foreground">
                        {part?.inStock ? 'Em estoque' : 'Fora de estoque'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">Documentos Gerados</h4>
                {workOrder?.status === 'completed' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    iconName="Plus"
                    onClick={() => setShowInvoiceModal(true)}
                  >
                    Gerar Documento
                  </Button>
                )}
              </div>
              
              {loadingInvoices ? (
                <div className="flex items-center justify-center py-8">
                  <Icon name="Loader2" size={24} className="text-muted-foreground animate-spin" />
                </div>
              ) : invoices?.length > 0 ? (
                <div className="space-y-3">
                  {invoices?.map((invoice, index) => (
                    <div key={index} className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <Icon 
                            name={invoice?.invoice_type === 'invoice' ? 'FileText' : 'Receipt'} 
                            size={16} 
                            className="text-primary" 
                          />
                          <div>
                            <span className="font-medium text-foreground">
                              {invoice?.invoice_type === 'invoice' ? 'Nota Fiscal' : 'Recibo'} #{invoice?.invoice_number}
                            </span>
                            <div className="text-sm text-muted-foreground">
                              Emitido em {formatDate(invoice?.issue_date)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-foreground">{formatCurrency(invoice?.total_amount)}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewInvoice(invoice)}
                            iconName="Eye"
                          >
                            Ver
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invoice?.status === 'paid' ? 'bg-success/10 text-success' :
                          invoice?.status === 'sent' ? 'bg-primary/10 text-primary' :
                          invoice?.status === 'cancelled'? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'
                        }`}>
                          {invoice?.status === 'paid' ? 'Pago' :
                           invoice?.status === 'sent' ? 'Enviado' :
                           invoice?.status === 'cancelled' ? 'Cancelado' : 'Rascunho'}
                        </span>
                        {invoice?.payment_method && (
                          <span>Pagamento: {
                            invoice?.payment_method === 'cash' ? 'Dinheiro' :
                            invoice?.payment_method === 'card' ? 'Cartão' :
                            invoice?.payment_method === 'bank_transfer' ? 'Transferência' :
                            invoice?.payment_method === 'pix' ? 'PIX' : invoice?.payment_method
                          }</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Icon name="Receipt" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {workOrder?.status === 'completed' 
                      ? 'Nenhum documento gerado. Clique em "Gerar Documento" para criar uma nota fiscal ou recibo.' :'Documentos serão disponibilizados após a conclusão da ordem de serviço.'
                    }
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Histórico de Atividades</h4>
              <div className="space-y-3">
                {workOrder?.history?.map((entry, index) => (
                  <div key={index} className="flex items-start space-x-3 pb-3 border-b border-border last:border-b-0">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name={entry?.icon} size={14} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">{entry?.action}</span>
                        <span className="text-xs text-muted-foreground">{formatDateTime(entry?.timestamp)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{entry?.description}</p>
                      <span className="text-xs text-muted-foreground">por {entry?.user}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer Actions */}
        <div className="border-t border-border p-6">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Valor Total</div>
              <div className="text-2xl font-bold text-foreground">{formatCurrency(workOrder?.totalValue)}</div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => onStatusUpdate(workOrder)}
              >
                Atualizar Status
              </Button>
              {workOrder?.status === 'completed' && (
                <Button
                  variant="default"
                  onClick={() => setShowInvoiceModal(true)}
                  iconName="FileText"
                >
                  Gerar NF/Recibo
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Generator Modal */}
      <InvoiceGeneratorModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        workOrder={workOrder}
        onInvoiceCreated={handleInvoiceCreated}
      />

      {/* Invoice View Modal */}
      <InvoiceViewModal
        isOpen={showInvoiceView}
        onClose={() => setShowInvoiceView(false)}
        invoice={selectedInvoice}
      />
    </>
  );
};

export default WorkOrderDetailsPanel;