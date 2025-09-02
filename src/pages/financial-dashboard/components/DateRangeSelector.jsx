import React, { useState } from 'react';

import Button from '../../../components/ui/Button';

const DateRangeSelector = ({ onDateRangeChange, className = '' }) => {
  const [selectedRange, setSelectedRange] = useState('thisMonth');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const predefinedRanges = [
    { id: 'today', label: 'Hoje', days: 0 },
    { id: 'thisWeek', label: 'Esta Semana', days: 7 },
    { id: 'thisMonth', label: 'Este Mês', days: 30 },
    { id: 'lastMonth', label: 'Mês Passado', days: 30 },
    { id: 'thisQuarter', label: 'Este Trimestre', days: 90 },
    { id: 'thisYear', label: 'Este Ano', days: 365 }
  ];

  const formatDateForInput = (date) => {
    return date?.toISOString()?.split('T')?.[0];
  };

  const formatDateBR = (date) => {
    return new Intl.DateTimeFormat('pt-BR')?.format(date);
  };

  const handleRangeSelect = (rangeId) => {
    setSelectedRange(rangeId);
    setShowCustom(rangeId === 'custom');
    
    if (rangeId !== 'custom') {
      const endDate = new Date();
      let startDate = new Date();
      
      switch (rangeId) {
        case 'today':
          startDate = new Date();
          break;
        case 'thisWeek':
          startDate?.setDate(endDate?.getDate() - 7);
          break;
        case 'thisMonth':
          startDate?.setMonth(endDate?.getMonth() - 1);
          break;
        case 'lastMonth':
          startDate?.setMonth(endDate?.getMonth() - 2);
          endDate?.setMonth(endDate?.getMonth() - 1);
          break;
        case 'thisQuarter':
          startDate?.setMonth(endDate?.getMonth() - 3);
          break;
        case 'thisYear':
          startDate?.setFullYear(endDate?.getFullYear() - 1);
          break;
        default:
          break;
      }
      
      onDateRangeChange({ startDate, endDate, rangeId });
    }
  };

  const handleCustomDateChange = () => {
    if (customStartDate && customEndDate) {
      let startDate = new Date(customStartDate);
      const endDate = new Date(customEndDate);
      onDateRangeChange({ startDate, endDate, rangeId: 'custom' });
    }
  };

  const getCurrentRangeLabel = () => {
    const range = predefinedRanges?.find(r => r?.id === selectedRange);
    if (range) return range?.label;
    if (selectedRange === 'custom' && customStartDate && customEndDate) {
      return `${formatDateBR(new Date(customStartDate))} - ${formatDateBR(new Date(customEndDate))}`;
    }
    return 'Selecionar Período';
  };

  return (
    <div className={`bg-card rounded-lg p-4 border border-border card-shadow ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium text-foreground mb-1">
            Período de Análise
          </h3>
          <p className="text-xs text-muted-foreground">
            {getCurrentRangeLabel()}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {predefinedRanges?.map((range) => (
            <Button
              key={range?.id}
              variant={selectedRange === range?.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleRangeSelect(range?.id)}
            >
              {range?.label}
            </Button>
          ))}
          <Button
            variant={selectedRange === 'custom' ? 'default' : 'outline'}
            size="sm"
            iconName="Calendar"
            onClick={() => handleRangeSelect('custom')}
          >
            Personalizado
          </Button>
        </div>
      </div>
      {showCustom && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Data Inicial
              </label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e?.target?.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Data Final
              </label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e?.target?.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <Button
                variant="default"
                size="default"
                iconName="Search"
                onClick={handleCustomDateChange}
                disabled={!customStartDate || !customEndDate}
                className="w-full"
              >
                Aplicar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;