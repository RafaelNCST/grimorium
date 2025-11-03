import {
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_TEXT_COLOR,
} from "../constants/default-colors-constant";
import {
  IPowerElement,
  IParagraphBlock,
  ISectionBlock,
  IImageBlock,
  IAdvancedBlock,
  IInformativeBlock,
  IVisualSection,
  ITextElement,
  ElementType,
  ShapeType,
} from "../types/power-system-types";

// DEFAULT_ELEMENT_DIMENSIONS is not used for paragraph/section blocks

export function createParagraphBlock(x: number, y: number): IParagraphBlock {
  const now = Date.now();

  return {
    id: `paragraph-${now}`,
    type: "paragraph-block",
    x,
    y,
    width: 800, // Default width (800px)
    height: 200, // Default height (200px)
    content: "",
    backgroundColor: "#F5F5F5", // Light grayish white
    textColor: "#000000", // Black
    borderColor: "#4A5568", // Gray-600 (dark gray)
    fontSize: 16, // Default font size (16px)
    textAlign: "left",
    showContentBorder: true, // Mostrar borda por padrão
    canNavigate: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function createSectionBlock(x: number, y: number): ISectionBlock {
  const now = Date.now();

  return {
    id: `section-${now}`,
    type: "section-block",
    x,
    y,
    width: 800, // Default width (800px)
    height: 200, // Default height (200px)
    title: "",
    content: "",
    backgroundColor: "#F5F5F5", // Light grayish white
    textColor: "#000000", // Black
    borderColor: "#4A5568", // Gray-600 (dark gray)
    titleFontSize: 24, // Default title font size (24px)
    contentFontSize: 16, // Default content font size (16px)
    titleAlign: "left",
    contentAlign: "left",
    showTitleBorder: true, // Mostrar borda do título por padrão
    showContentBorder: true, // Mostrar borda do conteúdo por padrão
    canNavigate: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function createImageBlock(x: number, y: number): IImageBlock {
  const now = Date.now();

  return {
    id: `image-${now}`,
    type: "image-block",
    x,
    y,
    width: 800, // Default width (800px)
    height: 400, // Default height (400px)
    caption: "",
    imageOffsetX: 0, // Offset horizontal inicial
    imageOffsetY: 0, // Offset vertical inicial
    backgroundColor: "#F5F5F5", // Light grayish white
    textColor: "#000000", // Black
    borderColor: "#4A5568", // Gray-600 (dark gray)
    captionAlign: "left",
    captionFontSize: 16, // Default caption font size (16px)
    showImageBorder: true, // Mostrar borda da imagem por padrão
    canNavigate: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function createAdvancedBlock(x: number, y: number): IAdvancedBlock {
  const now = Date.now();

  return {
    id: `advanced-${now}`,
    type: "advanced-block",
    x,
    y,
    width: 400, // Default width (400px)
    height: 350, // Default height (350px)
    imagePosition: "center", // Default image position
    imageShape: "circle", // Default image shape
    title: "",
    paragraph: "",
    backgroundColor: "#F5F5F5", // Light grayish white
    textColor: "#000000", // Black
    borderColor: "#4A5568", // Gray-600 (dark gray)
    titleAlign: "left", // Default title alignment
    paragraphAlign: "left", // Default paragraph alignment
    titleFontSize: 16, // Default title font size (16px)
    paragraphFontSize: 12, // Default paragraph font size (12px)
    showImageBorder: true, // Mostrar borda da imagem por padrão
    canNavigate: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function createInformativeBlock(
  x: number,
  y: number
): IInformativeBlock {
  const now = Date.now();

  return {
    id: `informative-${now}`,
    type: "informative-block",
    x,
    y,
    width: 800, // Fixed width (800px)
    height: 50, // Minimum height (grows dynamically)
    content: "",
    icon: "info", // Default icon
    backgroundColor: "#FFFFFF", // White background
    textColor: "#000000", // Black text
    iconColor: "#000000", // Black icon
    canNavigate: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function createVisualSection(
  x: number,
  y: number,
  shape: ShapeType = "circle"
): IVisualSection {
  const now = Date.now();

  // Tamanho padrão único para todas as 3 formas (circle, square, diamond)
  const DEFAULT_SHAPE_SIZE = 150;

  return {
    id: `visual-${now}`,
    type: "visual-section",
    x,
    y,
    width: DEFAULT_SHAPE_SIZE,
    height: DEFAULT_SHAPE_SIZE,
    shape,
    backgroundColor: "#FFFFFF", // Cor branca padrão
    showHoverCard: true,
    hoverTitle: "",
    hoverSubtitle: "",
    hoverDescription: "",
    canNavigate: true,
    createdAt: now,
    updatedAt: now,
  };
}

export function createTextElement(x: number, y: number): ITextElement {
  const now = Date.now();

  return {
    id: `text-${now}`,
    type: "text",
    x,
    y,
    width: 50,
    height: 24,
    content: "",
    textColor: "#ffffff", // Cor branca para contraste com fundo escuro
    fontSize: 16, // Base font size 16px
    fontWeight: "normal",
    textAlign: "left",
    wasManuallyResized: false, // Elemento virgem
    canNavigate: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function createElement(
  type: ElementType,
  x: number,
  y: number
): IPowerElement {
  switch (type) {
    case "paragraph-block":
      return createParagraphBlock(x, y);
    case "section-block":
      return createSectionBlock(x, y);
    case "image-block":
      return createImageBlock(x, y);
    case "advanced-block":
      return createAdvancedBlock(x, y);
    case "informative-block":
      return createInformativeBlock(x, y);
    case "visual-section":
      return createVisualSection(x, y);
    case "text":
      return createTextElement(x, y);
    default:
      return createParagraphBlock(x, y);
  }
}
