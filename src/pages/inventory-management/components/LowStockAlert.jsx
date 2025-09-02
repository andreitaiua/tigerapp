import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LowStockAlert = ({ 
  lowStockItems = [],
  onReorderItem,
  onDismissAlert,
  isVisible = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dismissedItems, setDismissedItems] = useState([]);

  if (!isVisible || lowStockItems?.length === 0) return null;

  const visibleItems = lowStockItems?.filter(item => !dismissedItems?.includes(item?.id));
  
  if (visibleItems?.length === 0) return null;

  const criticalItems = visibleItems?.filter(item => item?.currentStock === 0);
  const lowItems = visibleItems?.filter(item => item?.currentStock > 0 && item?.currentStock <= item?.minimumStock);

  const handleDismissItem = (itemId) => {
    setDismissedItems(prev => [...prev, itemId]);
    onDismissAlert(itemId);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(price);
  };

  return (
    <div className="mb-6">
      {/* Alert Header */}
      <div className="bg-warning/10 border border-warning/20 rounded-t-md p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="AlertTriangle" size={20} className="text-warning" />
            <div>
              <h3 className="font-semibold text-warning">
                Alertas de Estoque
              </h3>
              <p className="text-sm text-warning/80">
                {criticalItems?.length > 0 && (
                  <span>{criticalItems?.length} sem estoque</span>
                )}
                {criticalItems?.length > 0 && lowItems?.length > 0 && <span> • </span>}
                {lowItems?.length > 0 && (
                  <span>{lowItems?.length} com estoque baixo</span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Recolher' : 'Ver Detalhes'}
            </Button>
          </div>
        </div>
      </div>
      {/* Alert Content */}
      {isExpanded && (
        <div className="bg-card border-x border-b border-border rounded-b-md">
          {/* Critical Items (Out of Stock) */}
          {criticalItems?.length > 0 && (
            <div className="p-4 border-b border-border">
              <h4 className="font-medium text-destructive mb-3 flex items-center space-x-2">
                <Icon name="XCircle" size={16} />
                <span>Sem Estoque ({criticalItems?.length})</span>
              </h4>
              <div className="space-y-2">
                {criticalItems?.map((item) => (
                  <div key={item?.id} className="flex items-center justify-between p-3 bg-destructive/5 border border-destructive/20 rounded-md">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-destructive rounded-full"></div>
                      <div>
                        <div className="font-medium text-foreground">{item?.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item?.code} • {item?.category}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="text-sm font-medium text-destructive">0 unidades</div>
                        <div className="text-xs text-muted-foreground">
                          Mín: {item?.minimumStock} un
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="ShoppingCart"
                        onClick={() => onReorderItem(item)}
                      >
                        Repor
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="X"
                        onClick={() => handleDismissItem(item?.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Low Stock Items */}
          {lowItems?.length > 0 && (
            <div className="p-4">
              <h4 className="font-medium text-warning mb-3 flex items-center space-x-2">
                <Icon name="AlertTriangle" size={16} />
                <span>Estoque Baixo ({lowItems?.length})</span>
              </h4>
              <div className="space-y-2">
                {lowItems?.map((item) => (
                  <div key={item?.id} className="flex items-center justify-between p-3 bg-warning/5 border border-warning/20 rounded-md">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      <div>
                        <div className="font-medium text-foreground">{item?.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item?.code} • {item?.category}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="text-sm font-medium text-warning">
                          {item?.currentStock} unidades
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Mín: {item?.minimumStock} un
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="ShoppingCart"
                        onClick={() => onReorderItem(item)}
                      >
                        Repor
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="X"
                        onClick={() => handleDismissItem(item?.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="p-4 border-t border-border bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Valor total para reposição: {formatPrice(
                  visibleItems?.reduce((total, item) => {
                    const neededQuantity = Math.max(0, (item?.minimumStock * 2) - item?.currentStock);
                    return total + (neededQuantity * item?.unitPrice);
                  }, 0)
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Download"
                >
                  Exportar Lista
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  iconName="ShoppingCart"
                  onClick={() => {
                    visibleItems?.forEach(item => onReorderItem(item));
                  }}
                >
                  Repor Todos
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LowStockAlert;