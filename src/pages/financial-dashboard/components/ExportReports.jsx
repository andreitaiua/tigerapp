import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExportReports = ({ className = '' }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');

  const reportTypes = [
    {
      id: 'financial_summary',
      name: 'Resumo Financeiro',
      description: 'Relatório completo de receitas, despesas e lucro',
      icon: 'FileText'
    },
    {
      id: 'revenue_analysis',
      name: 'Análise de Receitas',
      description: 'Detalhamento de receitas por categoria e período',
      icon: 'TrendingUp'
    },
    {
      id: 'expense_breakdown',
      name: 'Breakdown de Despesas',
      description: 'Análise detalhada de todas as despesas',
      icon: 'Receipt'
    },
    {
      id: 'tax_report',
      name: 'Relatório Fiscal',
      description: 'Relatório formatado para declaração de impostos',
      icon: 'Calculator'
    }
  ];

  const formats = [
    { id: 'pdf', name: 'PDF', icon: 'FileText' },
    { id: 'excel', name: 'Excel', icon: 'Sheet' },
    { id: 'csv', name: 'CSV', icon: 'Database' }
  ];

  const periods = [
    { id: 'thisMonth', name: 'Este Mês' },
    { id: 'lastMonth', name: 'Mês Passado' },
    { id: 'thisQuarter', name: 'Este Trimestre' },
    { id: 'thisYear', name: 'Este Ano' }
  ];

  const handleExport = async (reportType) => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real application, this would trigger the actual export
    console.log(`Exporting ${reportType} as ${selectedFormat} for ${selectedPeriod}`);
    
    setIsExporting(false);
    
    // Show success message (in real app, this would be a toast notification)
    alert(`Relatório ${reportTypes?.find(r => r?.id === reportType)?.name} exportado com sucesso!`);
  };

  return (
    <div className={`bg-card rounded-lg border border-border card-shadow ${className}`}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-lg bg-accent/10 text-accent">
            <Icon name="Download" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Exportar Relatórios
            </h3>
            <p className="text-sm text-muted-foreground">
              Gere relatórios financeiros para análise e contabilidade
            </p>
          </div>
        </div>

        {/* Export Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Formato
            </label>
            <div className="flex gap-2">
              {formats?.map((format) => (
                <Button
                  key={format?.id}
                  variant={selectedFormat === format?.id ? 'default' : 'outline'}
                  size="sm"
                  iconName={format?.icon}
                  onClick={() => setSelectedFormat(format?.id)}
                >
                  {format?.name}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Período
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {periods?.map((period) => (
                <option key={period?.id} value={period?.id}>
                  {period?.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* Report Types */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {reportTypes?.map((report) => (
            <div key={report?.id} className="bg-muted/20 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Icon name={report?.icon} size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground">
                      {report?.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {report?.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  Formato: {formats?.find(f => f?.id === selectedFormat)?.name} • 
                  Período: {periods?.find(p => p?.id === selectedPeriod)?.name}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Download"
                  loading={isExporting}
                  onClick={() => handleExport(report?.id)}
                  disabled={isExporting}
                >
                  Exportar
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Export Actions */}
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-4">
            Exportação Rápida
          </h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="FileText"
              onClick={() => handleExport('financial_summary')}
              disabled={isExporting}
            >
              Resumo PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Sheet"
              onClick={() => handleExport('revenue_analysis')}
              disabled={isExporting}
            >
              Receitas Excel
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Calculator"
              onClick={() => handleExport('tax_report')}
              disabled={isExporting}
            >
              Relatório Fiscal
            </Button>
          </div>
        </div>

        {/* Compliance Notice */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Shield" size={16} className="text-success mt-0.5" />
            <div>
              <p className="text-xs font-medium text-foreground">
                Conformidade LGPD
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Todos os relatórios são gerados em conformidade com a Lei Geral de Proteção de Dados (LGPD) 
                e formatados para atender às exigências fiscais brasileiras.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportReports;