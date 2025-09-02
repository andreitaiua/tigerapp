import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WorkOrderMobileCard = ({ 
  workOrder,
  onSelect = () => {},
  onStatusUpdate = () => {},
  onPrint = () => {}
}) => {
  const statusColors = {
    'Aguardando': 'bg-warning/10 text-warning border-warning/20',
    'Em Andamento': 'bg-primary/10 text-primary border-primary/20',
    'Concluído': 'bg-success/10 text-success border-success/20',
    'Cancelado': 'bg-destructive/10 text-destructive border-destructive/20'
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

  return (
    <div 
      className="bg-card rounded-lg border border-border p-4 mb-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onSelect(workOrder)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-foreground">OS #{workOrder?.osNumber}</span>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusColors?.[workOrder?.status]}`}>
            {workOrder?.status}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e?.stopPropagation();
              onPrint(workOrder);
            }}
          >
            <Icon name="Printer" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e?.stopPropagation();
              onStatusUpdate(workOrder);
            }}
          >
            <Icon name="Edit" size={16} />
          </Button>
        </div>
      </div>
      {/* Customer Info */}
      <div className="mb-3">
        <div className="flex items-center space-x-2 mb-1">
          <Icon name="User" size={14} className="text-muted-foreground" />
          <span className="font-medium text-foreground">{workOrder?.customerName}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Phone" size={14} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{workOrder?.customerPhone}</span>
        </div>
      </div>
      {/* Vehicle Info */}
      <div className="mb-3">
        <div className="flex items-center space-x-2 mb-1">
          <Icon name="Car" size={14} className="text-muted-foreground" />
          <span className="text-sm text-foreground">
            {workOrder?.vehicle?.brand} {workOrder?.vehicle?.model} {workOrder?.vehicle?.year}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Hash" size={14} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{workOrder?.vehicle?.plate}</span>
        </div>
      </div>
      {/* Mechanic and Date */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon name="User" size={14} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{workOrder?.mechanic}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={14} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{formatDate(workOrder?.estimatedCompletion)}</span>
        </div>
      </div>
      {/* Services Summary */}
      <div className="mb-3">
        <div className="text-xs text-muted-foreground mb-1">Serviços:</div>
        <div className="flex flex-wrap gap-1">
          {workOrder?.services?.slice(0, 3)?.map((service, index) => (
            <span key={index} className="inline-flex items-center px-2 py-1 rounded bg-muted text-xs text-muted-foreground">
              {service?.name}
            </span>
          ))}
          {workOrder?.services?.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded bg-muted text-xs text-muted-foreground">
              +{workOrder?.services?.length - 3} mais
            </span>
          )}
        </div>
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Total</div>
          <div className="font-semibold text-foreground">{formatCurrency(workOrder?.totalValue)}</div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e?.stopPropagation();
            onSelect(workOrder);
          }}
        >
          Ver Detalhes
        </Button>
      </div>
    </div>
  );
};

export default WorkOrderMobileCard;