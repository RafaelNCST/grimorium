import { useState } from 'react';
import { Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

interface CreateBookModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (bookData: BookFormData) => void;
}

export interface BookFormData {
  title: string;
  genre: string;
  visualStyle: string;
  cover?: string;
  synopsis?: string;
}

const genres = [
  'Alta Fantasia / High Fantasy',
  'Fantasia Urbana / Urban Fantasy',
  'Épico / Epic',
  'Fantasia Sombria / Dark Fantasy',
  'Steampunk',
  'Ficção Científica Fantástica / Science Fantasy',
];

const visualStyles = [
  'Realista / Realistic',
  'Anime',
  'Cartoon',
  'Semirealista / Semi-realistic',
  'Artístico / Artistic',
];

export function CreateBookModal({ open, onClose, onConfirm }: CreateBookModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    genre: '',
    visualStyle: '',
    cover: '',
    synopsis: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = t('modal.title_required');
    }
    
    if (!formData.genre) {
      newErrors.genre = t('modal.genre_required');
    }
    
    if (!formData.visualStyle) {
      newErrors.visualStyle = t('modal.style_required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onConfirm(formData);
      // Reset form
      setFormData({
        title: '',
        genre: '',
        visualStyle: '',
        cover: '',
        synopsis: '',
      });
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      genre: '',
      visualStyle: '',
      cover: '',
      synopsis: '',
    });
    setErrors({});
    onClose();
  };

  const isValid = formData.title.trim() && formData.genre && formData.visualStyle;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] card-magical">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <span className="text-primary">✨</span>
            {t('modal.create_book')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              {t('modal.book_title')} *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: As Crônicas do Reino Perdido"
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Genre */}
          <div className="space-y-2">
            <Label htmlFor="genre" className="text-sm font-medium">
              {t('modal.book_genre')} *
            </Label>
            <Select
              value={formData.genre}
              onValueChange={(value) => setFormData({ ...formData, genre: value })}
            >
              <SelectTrigger className={errors.genre ? 'border-destructive' : ''}>
                <SelectValue placeholder="Selecione o gênero" />
              </SelectTrigger>
              <SelectContent>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.genre && (
              <p className="text-sm text-destructive">{errors.genre}</p>
            )}
          </div>

          {/* Visual Style */}
          <div className="space-y-2">
            <Label htmlFor="style" className="text-sm font-medium">
              {t('modal.book_style')} *
            </Label>
            <Select
              value={formData.visualStyle}
              onValueChange={(value) => setFormData({ ...formData, visualStyle: value })}
            >
              <SelectTrigger className={errors.visualStyle ? 'border-destructive' : ''}>
                <SelectValue placeholder="Selecione o estilo visual" />
              </SelectTrigger>
              <SelectContent>
                {visualStyles.map((style) => (
                  <SelectItem key={style} value={style}>
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.visualStyle && (
              <p className="text-sm text-destructive">{errors.visualStyle}</p>
            )}
          </div>

          {/* Cover Upload */}
          <div className="space-y-2">
            <Label htmlFor="cover" className="text-sm font-medium">
              {t('modal.book_cover')}
            </Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Clique para fazer upload ou arraste uma imagem
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG até 5MB
              </p>
            </div>
          </div>

          {/* Synopsis */}
          <div className="space-y-2">
            <Label htmlFor="synopsis" className="text-sm font-medium">
              {t('modal.book_synopsis')}
            </Label>
            <Textarea
              id="synopsis"
              value={formData.synopsis}
              onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
              placeholder="Uma breve descrição da sua história..."
              rows={3}
              maxLength={500}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Opcional</span>
              <span>{formData.synopsis?.length || 0}/500</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              {t('button.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={!isValid}
              className="flex-1 btn-magical"
            >
              {t('button.create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}