import {
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_TEXT_COLOR,
} from "../constants/default-colors-constant";
import {
  IPowerElement,
  IParagraphBlock,
  ISectionBlock,
  IImageBlock,
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
    showCaptionBorder: true, // Mostrar borda da legenda por padrão
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

  return {
    id: `visual-${now}`,
    type: "visual-section",
    x,
    y,
    width: 120,
    height: 120,
    shape,
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
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
    case "visual-section":
      return createVisualSection(x, y);
    case "text":
      return createTextElement(x, y);
    default:
      return createParagraphBlock(x, y);
  }
}
