import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const CategorySidebar = ({ 
  selectedCategory, 
  onCategorySelect,
  isCollapsed = false,
  onToggleCollapse 
}) => {
  const [expandedCategories, setExpandedCategories] = useState(['motor', 'freios']);

  const categories = [
    {
      id: 'all',
      name: 'Todos os Itens',
      icon: 'Package',
      count: 1247,
      subcategories: []
    },
    {
      id: 'motor',
      name: 'Motor',
      icon: 'Cog',
      count: 324,
      subcategories: [
        { id: 'oleo', name: 'Óleos e Lubrificantes', count: 45 },
        { id: 'filtros', name: 'Filtros', count: 78 },
        { id: 'velas', name: 'Velas de Ignição', count: 32 },
        { id: 'correias', name: 'Correias', count: 28 },
        { id: 'radiador', name: 'Sistema de Arrefecimento', count: 41 }
      ]
    },
    {
      id: 'freios',
      name: 'Sistema de Freios',
      icon: 'Disc',
      count: 186,
      subcategories: [
        { id: 'pastilhas', name: 'Pastilhas de Freio', count: 67 },
        { id: 'discos', name: 'Discos de Freio', count: 43 },
        { id: 'fluido', name: 'Fluido de Freio', count: 18 },
        { id: 'cilindros', name: 'Cilindros', count: 24 },
        { id: 'mangueiras', name: 'Mangueiras', count: 34 }
      ]
    },
    {
      id: 'suspensao',
      name: 'Suspensão',
      icon: 'Zap',
      count: 142,
      subcategories: [
        { id: 'amortecedores', name: 'Amortecedores', count: 56 },
        { id: 'molas', name: 'Molas', count: 34 },
        { id: 'buchas', name: 'Buchas', count: 52 }
      ]
    },
    {
      id: 'eletrica',
      name: 'Sistema Elétrico',
      icon: 'Zap',
      count: 203,
      subcategories: [
        { id: 'baterias', name: 'Baterias', count: 23 },
        { id: 'alternadores', name: 'Alternadores', count: 18 },
        { id: 'lampadas', name: 'Lâmpadas', count: 89 },
        { id: 'fusíveis', name: 'Fusíveis', count: 73 }
      ]
    },
    {
      id: 'pneus',
      name: 'Pneus e Rodas',
      icon: 'Circle',
      count: 89,
      subcategories: [
        { id: 'pneus-passeio', name: 'Pneus Passeio', count: 45 },
        { id: 'pneus-caminhao', name: 'Pneus Caminhão', count: 23 },
        { id: 'rodas', name: 'Rodas', count: 21 }
      ]
    },
    {
      id: 'carroceria',
      name: 'Carroceria',
      icon: 'Car',
      count: 156,
      subcategories: [
        { id: 'parachoques', name: 'Para-choques', count: 34 },
        { id: 'farois', name: 'Faróis', count: 67 },
        { id: 'retrovisores', name: 'Retrovisores', count: 28 },
        { id: 'vidros', name: 'Vidros', count: 27 }
      ]
    },
    {
      id: 'ferramentas',
      name: 'Ferramentas',
      icon: 'Wrench',
      count: 147,
      subcategories: [
        { id: 'chaves', name: 'Chaves', count: 45 },
        { id: 'equipamentos', name: 'Equipamentos', count: 32 },
        { id: 'consumiveis', name: 'Consumíveis', count: 70 }
      ]
    }
  ];

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => 
      prev?.includes(categoryId) 
        ? prev?.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCategoryClick = (categoryId) => {
    onCategorySelect(categoryId);
  };

  if (isCollapsed) {
    return (
      <div className="w-16 bg-card border-r border-border h-full">
        <div className="p-2">
          <button
            onClick={onToggleCollapse}
            className="w-full p-2 rounded-md hover:bg-muted transition-colors duration-200"
          >
            <Icon name="ChevronRight" size={20} />
          </button>
        </div>
        <div className="space-y-1 px-2">
          {categories?.slice(0, 6)?.map((category) => (
            <button
              key={category?.id}
              onClick={() => handleCategoryClick(category?.id)}
              className={`w-full p-2 rounded-md transition-colors duration-200 ${
                selectedCategory === category?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
              title={category?.name}
            >
              <Icon name={category?.icon} size={18} />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-card border-r border-border h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Categorias</h3>
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-md hover:bg-muted transition-colors duration-200"
          >
            <Icon name="ChevronLeft" size={18} />
          </button>
        </div>
      </div>
      <div className="p-2 overflow-y-auto h-full">
        <div className="space-y-1">
          {categories?.map((category) => (
            <div key={category?.id}>
              <button
                onClick={() => {
                  handleCategoryClick(category?.id);
                  if (category?.subcategories?.length > 0) {
                    toggleCategory(category?.id);
                  }
                }}
                className={`w-full flex items-center justify-between p-3 rounded-md transition-colors duration-200 ${
                  selectedCategory === category?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon name={category?.icon} size={18} />
                  <span className="font-medium">{category?.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">
                    {category?.count}
                  </span>
                  {category?.subcategories?.length > 0 && (
                    <Icon 
                      name="ChevronDown" 
                      size={16} 
                      className={`transition-transform duration-200 ${
                        expandedCategories?.includes(category?.id) ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </div>
              </button>

              {category?.subcategories?.length > 0 && expandedCategories?.includes(category?.id) && (
                <div className="ml-6 mt-1 space-y-1">
                  {category?.subcategories?.map((subcategory) => (
                    <button
                      key={subcategory?.id}
                      onClick={() => handleCategoryClick(subcategory?.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-md text-sm transition-colors duration-200 ${
                        selectedCategory === subcategory?.id
                          ? 'bg-primary/10 text-primary' :'hover:bg-muted text-muted-foreground'
                      }`}
                    >
                      <span>{subcategory?.name}</span>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                        {subcategory?.count}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;