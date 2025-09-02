import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = 'primary',
  loading = false 
}) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error'
  };

  const trendColors = {
    up: 'text-success',
    down: 'text-error',
    neutral: 'text-muted-foreground'
  };

  if (loading) {
    return (
      <div className="bg-card rounded-lg p-6 card-shadow animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-24"></div>
            <div className="h-8 bg-muted rounded w-32"></div>
          </div>
          <div className="w-12 h-12 bg-muted rounded-lg"></div>
        </div>
        <div className="mt-4 h-4 bg-muted rounded w-20"></div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-6 card-shadow hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses?.[color]}`}>
          <Icon name={icon} size={24} />
        </div>
      </div>
      {trend && trendValue && (
        <div className="flex items-center mt-4 space-x-1">
          <Icon 
            name={trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'} 
            size={16} 
            className={trendColors?.[trend]}
          />
          <span className={`text-sm font-medium ${trendColors?.[trend]}`}>
            {trendValue}
          </span>
          <span className="text-sm text-muted-foreground">vs mês anterior</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;