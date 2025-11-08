import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Package } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getItemById, type IItem } from '@/lib/db/items.service';
import { Skeleton } from '@/components/ui/skeleton';

interface ItemHoverCardProps {
  itemId: string;
  children: React.ReactNode;
}

export function ItemHoverCard({
  itemId,
  children,
}: ItemHoverCardProps) {
  const { t } = useTranslation(['power-system', 'create-item']);
  const [item, setItem] = useState<IItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadItem() {
      try {
        setIsLoading(true);
        setError(false);
        const data = await getItemById(itemId);
        if (mounted) {
          setItem(data);
          if (!data) {
            setError(true);
          }
        }
      } catch (err) {
        console.error('Error loading item:', err);
        if (mounted) {
          setError(true);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadItem();

    return () => {
      mounted = false;
    };
  }, [itemId]);

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-[400px]" align="start">
        {isLoading ? (
          <div className="p-1 space-y-4">
            <div className="flex gap-4">
              <Skeleton className="h-20 w-20 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
            <Skeleton className="h-12 w-full" />
          </div>
        ) : error || !item ? (
          <div className="text-sm text-muted-foreground">
            {t('power-system:hover_card.item_not_found')}
          </div>
        ) : (
          <div className="p-1 space-y-4">
            {/* Top Section: Image + Name/Category/Status */}
            <div className="flex gap-4">
              {/* Item Image - Circular */}
              <Avatar className="w-20 h-20 flex-shrink-0">
                <AvatarImage
                  src={item.image}
                  className="object-cover"
                />
                <AvatarFallback className="text-xl bg-gradient-to-br from-primary/20 to-primary/10">
                  {item.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              {/* Name, Category, and Status */}
              <div className="flex-1 min-w-0 space-y-2">
                <h4 className="text-base font-bold line-clamp-2">
                  {item.name}
                </h4>

                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {item.category && (
                    <div className="flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-primary" />
                      <span className="text-sm font-medium text-muted-foreground capitalize">
                        {item.customCategory || t(`create-item:category.${item.category}`)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Status Badge */}
                {item.status && (
                  <div className="flex">
                    <Badge
                      variant="secondary"
                      className="px-3 py-1"
                    >
                      <span className="text-xs font-medium capitalize">
                        {t(`create-item:status.${item.status}`)}
                      </span>
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {item.basicDescription && (
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {item.basicDescription}
              </p>
            )}
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
