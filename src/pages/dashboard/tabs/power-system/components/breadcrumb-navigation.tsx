import { ChevronRight, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';

interface BreadcrumbItem {
  id: string;
  name: string;
}

interface PropsBreadcrumbNavigation {
  items: BreadcrumbItem[];
  onNavigate: (mapId: string) => void;
}

export function BreadcrumbNavigation({ items, onNavigate }: PropsBreadcrumbNavigation) {
  const { t } = useTranslation('power-system');

  if (items.length === 0) return null;

  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        className="flex items-center gap-1 text-foreground hover:text-yellow-500 transition-colors cursor-pointer"
        onClick={() => onNavigate(items[0].id)}
      >
        <Home className="w-4 h-4" />
        <span className="font-medium">{t('breadcrumb.root')}</span>
      </button>

      {items.slice(1).map((item, index) => {
        // Truncate long names to prevent layout issues
        const displayName = item.name.length > 25 ? `${item.name.substring(0, 25)}...` : item.name;

        return (
          <div key={item.id} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <button
              className="flex items-center gap-1 text-foreground hover:text-yellow-500 transition-colors cursor-pointer font-medium max-w-[200px] truncate"
              onClick={() => onNavigate(item.id)}
              title={item.name}
            >
              {displayName}
            </button>
          </div>
        );
      })}
    </div>
  );
}
