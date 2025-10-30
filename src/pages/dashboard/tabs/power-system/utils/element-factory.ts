import {
  IPowerElement,
  IBasicSection,
  IDetailedSection,
  IVisualSection,
  ITextElement,
  ElementType,
  ShapeType,
} from '../types/power-system-types';
import { DEFAULT_BACKGROUND_COLOR, DEFAULT_TEXT_COLOR } from '../constants/default-colors-constant';
import { DEFAULT_ELEMENT_DIMENSIONS } from '../constants/default-dimensions-constant';

// Tamanhos de fonte base (mesmos do componente)
const BASE_TITLE_FONT_SIZE = 18;
const BASE_DESCRIPTION_FONT_SIZE = 14;

// Função para calcular dimensões iniciais do card básico
function calculateBasicSectionDimensions(): { width: number; height: number } {
  // WIDTH PADRÃO: fixo em 180px
  const DEFAULT_WIDTH = 180;

  // Espaçamentos do card
  const CARD_PADDING = 16; // p-4 = 16px de cada lado (total vertical = 32px)
  const GAP = 8; // gap-2 = 8px entre título e descrição

  // Heights dos inputs (uma linha cada)
  const titleHeight = Math.ceil(BASE_TITLE_FONT_SIZE * 1.5); // 18px * 1.5 = 27px
  const descriptionHeight = Math.ceil(BASE_DESCRIPTION_FONT_SIZE * 1.625); // 14px * 1.625 = 23px

  // Paddings internos dos inputs
  const DESC_PADDING_VERTICAL = 8; // py-1 da descrição (aproximadamente)

  // HEIGHT DO CARD = padding top + título + gap + descrição + padding bottom
  const cardHeight = CARD_PADDING + titleHeight + GAP + descriptionHeight + DESC_PADDING_VERTICAL + CARD_PADDING;

  return {
    width: DEFAULT_WIDTH,
    height: Math.ceil(cardHeight)
  };
}

export function createBasicSection(x: number, y: number): IBasicSection {
  const now = Date.now();

  // Calcula dimensões baseadas nos placeholders
  const dimensions = calculateBasicSectionDimensions();

  return {
    id: `basic-${now}`,
    type: 'basic-section',
    x,
    y,
    width: dimensions.width,
    height: dimensions.height,
    title: '',
    description: '',
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
    textColor: DEFAULT_TEXT_COLOR,
    canNavigate: true,
    wasManuallyResized: false, // Inicia como não alterado
    fontScale: 1.0, // Escala padrão
    createdAt: now,
    updatedAt: now,
  };
}

export function createDetailedSection(x: number, y: number): IDetailedSection {
  const dimensions = DEFAULT_ELEMENT_DIMENSIONS['detailed-section'];
  const now = Date.now();

  return {
    id: `detailed-${now}`,
    type: 'detailed-section',
    x,
    y,
    width: dimensions.width,
    height: dimensions.height,
    title: '',
    subtitle: '',
    description: '',
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
    textColor: DEFAULT_TEXT_COLOR,
    canNavigate: true,
    wasManuallyResized: false, // Inicia como não alterado
    fontScale: 1.0, // Escala padrão
    createdAt: now,
    updatedAt: now,
  };
}

export function createVisualSection(x: number, y: number, shape: ShapeType = 'circle'): IVisualSection {
  const dimensions = DEFAULT_ELEMENT_DIMENSIONS['visual-section'];
  const now = Date.now();

  return {
    id: `visual-${now}`,
    type: 'visual-section',
    x,
    y,
    width: dimensions.width,
    height: dimensions.height,
    shape,
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
    showHoverCard: true,
    hoverTitle: '',
    hoverSubtitle: '',
    hoverDescription: '',
    canNavigate: true,
    createdAt: now,
    updatedAt: now,
  };
}

export function createTextElement(x: number, y: number): ITextElement {
  const dimensions = DEFAULT_ELEMENT_DIMENSIONS['text'];
  const now = Date.now();

  return {
    id: `text-${now}`,
    type: 'text',
    x,
    y,
    width: dimensions.width,
    height: dimensions.height,
    content: '',
    textColor: '#ffffff', // Cor branca para contraste com fundo escuro
    fontSize: 16, // Base font size 16px
    fontWeight: 'normal',
    textAlign: 'left',
    wasManuallyResized: false, // Elemento virgem
    canNavigate: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function createElement(type: ElementType, x: number, y: number): IPowerElement {
  switch (type) {
    case 'basic-section':
      return createBasicSection(x, y);
    case 'detailed-section':
      return createDetailedSection(x, y);
    case 'visual-section':
      return createVisualSection(x, y);
    case 'text':
      return createTextElement(x, y);
    default:
      return createBasicSection(x, y);
  }
}
