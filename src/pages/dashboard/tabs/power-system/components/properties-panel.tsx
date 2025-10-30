import { useState, useEffect } from 'react';

import { X, Trash2, ImageIcon, Copy, Plus, Minus, Bold, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { IPowerElement } from '../types/power-system-types';
import { DEFAULT_COLORS_CONSTANT } from '../constants/default-colors-constant';
import { SHAPES_CONSTANT } from '../constants/shapes-constant';

interface PropsPropertiesPanel {
  element: IPowerElement;
  selectedCount?: number;
  onUpdate: (updates: Partial<IPowerElement>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onClose: () => void;
}

export function PropertiesPanel({
  element,
  selectedCount = 1,
  onUpdate,
  onDelete,
  onDuplicate,
  onClose,
}: PropsPropertiesPanel) {
  const { t } = useTranslation('power-system');
  const isMultiSelection = selectedCount > 1;
  const [fontSizeInput, setFontSizeInput] = useState(element.type === 'text' ? String(element.fontSize) : '');

  // Sync local state when fontSize changes externally (e.g., from buttons)
  useEffect(() => {
    if (element.type === 'text') {
      setFontSizeInput(String(element.fontSize));
    }
  }, [element.fontSize, element.type]);

  const renderColorPicker = (
    label: string,
    value: string | undefined,
    onChange: (color: string) => void
  ) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="grid grid-cols-6 gap-2">
        {DEFAULT_COLORS_CONSTANT.map((color) => (
          <button
            key={color}
            className={`w-8 h-8 rounded-md border-2 transition-transform hover:scale-110 ${
              value === color ? 'border-primary ring-2 ring-primary' : 'border-transparent'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
          />
        ))}
      </div>
    </div>
  );

  const renderBasicSectionProperties = () => {
    if (element.type !== 'basic-section') return null;

    return (
      <>
        {/* Configurações da Card */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Configurações da Card</Label>

          {/* Navigation Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t('properties_panel.navigation_hint')}
            </span>
            <Switch
              checked={element.canNavigate}
              onCheckedChange={(checked) => onUpdate({ canNavigate: checked })}
            />
          </div>
        </div>

        <Separator />

        {renderColorPicker(
          t('properties_panel.background_color'),
          element.backgroundColor,
          (color) => onUpdate({ backgroundColor: color })
        )}
        <Separator />
        {renderColorPicker(
          t('properties_panel.text_color'),
          element.textColor,
          (color) => onUpdate({ textColor: color })
        )}
      </>
    );
  };

  const renderDetailedSectionProperties = () => {
    if (element.type !== 'detailed-section') return null;

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          onUpdate({ imageUrl: event.target?.result as string });
        };
        reader.readAsDataURL(file);
      }
    };

    return (
      <>
        {/* Configurações da Card */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Configurações da Card</Label>

          {/* Navigation Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t('properties_panel.navigation_hint')}
            </span>
            <Switch
              checked={element.canNavigate}
              onCheckedChange={(checked) => onUpdate({ canNavigate: checked })}
            />
          </div>
        </div>

        {/* Image section - hidden in multi-selection */}
        {!isMultiSelection && (
          <>
            <Separator />
            <div className="space-y-3">
            <Label>{t('properties_panel.image_profile')}</Label>

            {element.imageUrl ? (
              <div className="flex flex-col items-center gap-3">
                {/* Image Preview */}
                <div className="w-24 h-24 rounded-full overflow-hidden border-2">
                  <img src={element.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>

                {/* Image Name */}
                <p className="text-xs text-center text-muted-foreground">
                  {element.imageUrl.substring(0, 30)}...
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2 w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => document.getElementById('detailed-image-input')?.click()}
                  >
                    <ImageIcon className="w-3 h-3 mr-2" />
                    Nova Imagem
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onUpdate({ imageUrl: undefined })}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>

                <input
                  id="detailed-image-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                onChange={handleImageSelect}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 p-6 border-2 border-dashed rounded-lg">
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('detailed-image-input-empty')?.click()}
              >
                <ImageIcon className="w-3 h-3 mr-2" />
                Escolher Arquivo
              </Button>
              <input
                id="detailed-image-input-empty"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />
            </div>
          )}
          </div>
          </>
        )}

        <Separator />
        {renderColorPicker(
          t('properties_panel.background_color'),
          element.backgroundColor,
          (color) => onUpdate({ backgroundColor: color })
        )}
        <Separator />
        {renderColorPicker(
          t('properties_panel.text_color'),
          element.textColor,
          (color) => onUpdate({ textColor: color })
        )}
      </>
    );
  };

  const renderVisualSectionProperties = () => {
    if (element.type !== 'visual-section') return null;

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          onUpdate({ imageUrl: event.target?.result as string });
        };
        reader.readAsDataURL(file);
      }
    };

    return (
      <>
        {/* Configurações da Form */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Configurações da Form</Label>

          {/* Navigation Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t('properties_panel.navigation_hint')}
            </span>
            <Switch
              checked={element.canNavigate}
              onCheckedChange={(checked) => onUpdate({ canNavigate: checked })}
            />
          </div>

          {/* Hover Card Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Mostrar card ao passar o mouse
            </span>
            <Switch
              checked={element.showHoverCard}
              onCheckedChange={(checked) => onUpdate({ showHoverCard: checked })}
            />
          </div>
        </div>

        {/* Hover Card Fields - Hidden in multi-selection */}
        {element.showHoverCard && !isMultiSelection && (
          <>
            <Separator />
            <div className="space-y-3">
              <Label className="text-sm font-medium">Conteúdo do Card</Label>

              <div className="space-y-2">
                <Label className="text-xs">{t('properties_panel.hover_title')}</Label>
                <Input
                  value={element.hoverTitle || ''}
                  onChange={(e) => onUpdate({ hoverTitle: e.target.value })}
                  placeholder={t('elements.visual_section.default_hover_title')}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">{t('properties_panel.hover_subtitle')}</Label>
                <Input
                  value={element.hoverSubtitle || ''}
                  onChange={(e) => onUpdate({ hoverSubtitle: e.target.value })}
                  placeholder={t('elements.visual_section.default_hover_subtitle')}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">{t('properties_panel.hover_description')}</Label>
                <Textarea
                  value={element.hoverDescription || ''}
                  onChange={(e) => onUpdate({ hoverDescription: e.target.value })}
                  placeholder={t('elements.visual_section.default_hover_description')}
                  className="min-h-[120px] max-h-[120px] text-sm resize-none"
                  maxLength={500}
                />
              </div>
            </div>

            <Separator />
          </>
        )}

        {/* Appearance Section - Hidden in multi-selection */}
        {!isMultiSelection && (
          <>
            <Separator />
            <div className="space-y-3">
              <Label>{t('properties_panel.image_background')}</Label>

              {element.imageUrl ? (
                <div className="flex flex-col items-center gap-3">
                  {/* Image Preview */}
                  <div className="w-full h-32 rounded overflow-hidden border-2">
                    <img src={element.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>

                  {/* Image Name */}
                  <p className="text-xs text-center text-muted-foreground">
                    {element.imageUrl.substring(0, 30)}...
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => document.getElementById('visual-image-input')?.click()}
                    >
                      <ImageIcon className="w-3 h-3 mr-2" />
                      Nova Imagem
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onUpdate({ imageUrl: undefined })}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>

                  <input
                    id="visual-image-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 p-6 border-2 border-dashed rounded-lg">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('visual-image-input-empty')?.click()}
                  >
                    <ImageIcon className="w-3 h-3 mr-2" />
                    Escolher Arquivo
                  </Button>
                  <input
                    id="visual-image-input-empty"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </div>
              )}
            </div>

            <Separator />
          </>
        )}

        {!element.imageUrl && renderColorPicker(
          t('properties_panel.background_color'),
          element.backgroundColor,
          (color) => onUpdate({ backgroundColor: color })
        )}
      </>
    );
  };

  const renderTextElementProperties = () => {
    if (element.type !== 'text') return null;

    return (
      <>
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t('properties_panel.font_size')}</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                const newSize = Math.max(8, element.fontSize - 1);
                onUpdate({ fontSize: newSize });
                setFontSizeInput(String(newSize));
              }}
              disabled={element.fontSize <= 8}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Input
              type="text"
              value={fontSizeInput}
              onChange={(e) => {
                const input = e.target.value;
                // Allow only numbers, comma, and dot
                if (/^[0-9,\.]*$/.test(input)) {
                  setFontSizeInput(input);
                }
              }}
              onBlur={() => {
                // Validate and update on blur
                const sanitized = fontSizeInput.replace(',', '.');
                const value = parseFloat(sanitized);
                if (!isNaN(value) && value >= 8 && value <= 64) {
                  onUpdate({ fontSize: value });
                  setFontSizeInput(String(value));
                } else {
                  // Reset to current valid value
                  setFontSizeInput(String(element.fontSize));
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur();
                }
              }}
              className="h-8 text-center"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                const newSize = Math.min(64, element.fontSize + 1);
                onUpdate({ fontSize: newSize });
                setFontSizeInput(String(newSize));
              }}
              disabled={element.fontSize >= 64}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label className="text-sm font-medium">{t('properties_panel.font_weight')}</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={element.fontWeight === 'normal' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onUpdate({ fontWeight: 'normal' })}
              className={element.fontWeight === 'normal' ? 'hover:bg-primary hover:shadow-glow hover:!translate-y-0 hover:!transform-none' : ''}
            >
              <span className="text-sm font-normal">A</span>
            </Button>
            <Button
              variant={element.fontWeight === 'bold' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onUpdate({ fontWeight: 'bold' })}
              className={element.fontWeight === 'bold' ? 'hover:bg-primary hover:shadow-glow hover:!translate-y-0 hover:!transform-none' : ''}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant={element.fontWeight === 'underline' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onUpdate({ fontWeight: 'underline' })}
              className={element.fontWeight === 'underline' ? 'hover:bg-primary hover:shadow-glow hover:!translate-y-0 hover:!transform-none' : ''}
            >
              <Underline className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label className="text-sm font-medium">{t('properties_panel.text_align')}</Label>
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant={element.textAlign === 'left' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onUpdate({ textAlign: 'left' })}
              className={element.textAlign === 'left' ? 'hover:bg-primary hover:shadow-glow hover:!translate-y-0 hover:!transform-none' : ''}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant={element.textAlign === 'center' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onUpdate({ textAlign: 'center' })}
              className={element.textAlign === 'center' ? 'hover:bg-primary hover:shadow-glow hover:!translate-y-0 hover:!transform-none' : ''}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant={element.textAlign === 'right' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onUpdate({ textAlign: 'right' })}
              className={element.textAlign === 'right' ? 'hover:bg-primary hover:shadow-glow hover:!translate-y-0 hover:!transform-none' : ''}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button
              variant={element.textAlign === 'justify' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onUpdate({ textAlign: 'justify' })}
              className={element.textAlign === 'justify' ? 'hover:bg-primary hover:shadow-glow hover:!translate-y-0 hover:!transform-none' : ''}
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {renderColorPicker(
          t('properties_panel.text_color'),
          element.textColor,
          (color) => onUpdate({ textColor: color })
        )}
      </>
    );
  };

  return (
    <div className="absolute top-0 right-0 bottom-0 w-80 bg-background border-l flex flex-col shadow-2xl z-50">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">{t('properties_panel.title')}</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Multi-selection indicator */}
      {isMultiSelection && (
        <div className="px-4 pt-4">
          <div className="bg-primary/10 border border-primary/20 rounded-md p-3">
            <p className="text-sm font-medium text-primary">
              {selectedCount} elementos selecionados
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              As alterações serão aplicadas a todos
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Type-specific properties */}
          <div className="space-y-4">
            {renderBasicSectionProperties()}
            {renderDetailedSectionProperties()}
            {renderVisualSectionProperties()}
            {renderTextElementProperties()}
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t space-y-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={onDuplicate}
        >
          <Copy className="w-4 h-4 mr-2" />
          Duplicar
        </Button>
        <Button
          variant="destructive"
          className="w-full"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {t('properties_panel.delete')}
        </Button>
      </div>
    </div>
  );
}
