import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTranslation } from 'react-i18next';

interface DataSourceSelectorProps {
  value: 'manual' | 'characters';
  onChange: (value: 'manual' | 'characters') => void;
}

export function DataSourceSelector({ value, onChange }: DataSourceSelectorProps) {
  const { t } = useTranslation('power-system');

  return (
    <div className="space-y-2">
      <Label>{t('blocks.dropdown.data_source_label')}</Label>
      <RadioGroup value={value} onValueChange={onChange} className="flex gap-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="manual" id="manual" />
          <Label htmlFor="manual" className="font-normal cursor-pointer">
            {t('blocks.dropdown.data_source_manual')}
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="characters" id="characters" />
          <Label htmlFor="characters" className="font-normal cursor-pointer">
            {t('blocks.dropdown.data_source_characters')}
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
