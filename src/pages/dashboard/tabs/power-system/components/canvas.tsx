import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface PropsCanvas {
  gridEnabled: boolean;
  gridSize?: number;
  viewOffset: { x: number; y: number };
  zoom: number;
  children: React.ReactNode;
  onMouseDown?: (e: React.MouseEvent) => void;
  onMouseMove?: (e: React.MouseEvent) => void;
  onMouseUp?: () => void;
  onMouseLeave?: () => void;
  className?: string;
}

export const Canvas = forwardRef<HTMLDivElement, PropsCanvas>(
  (
    {
      gridEnabled,
      gridSize = 20,
      viewOffset,
      zoom,
      children,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseLeave,
      className,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative w-full h-full overflow-hidden bg-muted/20',
          className
        )}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        style={{
          touchAction: 'none',
          // Force GPU acceleration
          transform: 'translateZ(0)',
          willChange: 'contents',
        }}
      >
        {/* Infinite Grid Background */}
        {gridEnabled && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: 0.2,
              backgroundImage: `
                linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px),
                linear-gradient(180deg, hsl(var(--border)) 1px, transparent 1px)
              `,
              backgroundSize: `${gridSize * zoom}px ${gridSize * zoom}px`,
              backgroundPosition: `${viewOffset.x}px ${viewOffset.y}px`,
              // Performance optimization
              willChange: 'background-position',
              transform: 'translateZ(0)',
            }}
          />
        )}

        {/* Infinite Canvas Content Container */}
        <div
          data-canvas-content="true"
          className="absolute"
          style={{
            left: 0,
            top: 0,
            // Make canvas infinitely large to allow elements anywhere
            width: '100000px',
            height: '100000px',
            transform: `translate(${viewOffset.x}px, ${viewOffset.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            // GPU acceleration and performance optimizations
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            perspective: 1000,
          }}
        >
          {children}
        </div>
      </div>
    );
  }
);

Canvas.displayName = 'Canvas';
