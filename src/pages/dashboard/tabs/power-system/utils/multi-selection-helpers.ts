import { IPowerElement } from "../types/power-system-types";

// Tipos de categoria
export type ElementCategory = "block" | "shape" | "text" | "connection";

// Tipos de blocos
export type BlockType =
  | "paragraph-block"
  | "section-block"
  | "image-block"
  | "advanced-block"
  | "informative-block";

/**
 * Detecta a categoria de um elemento
 */
export function getElementCategory(element: IPowerElement): ElementCategory {
  const blockTypes = [
    "paragraph-block",
    "section-block",
    "image-block",
    "advanced-block",
    "informative-block",
  ];
  const shapeTypes = ["visual-section"];

  if (blockTypes.includes(element.type)) return "block";
  if (shapeTypes.includes(element.type)) return "shape";
  if (element.type === "text") return "text";

  // Fallback (não deve acontecer normalmente)
  return "block";
}

/**
 * Análise de multi-seleção
 */
export interface MultiSelectionAnalysis {
  count: number;
  categories: Set<ElementCategory>;
  types: Set<string>;
  isMixed: boolean; // Categorias diferentes (blocos + formas + textos)
  isSameType: boolean; // Mesmo tipo exato (ex: todos paragraph-block)
  isAllBlocks: boolean; // Todos são blocos (mas podem ser de tipos diferentes)
  isAllShapes: boolean; // Todos são formas (visual-section)
  isAllTexts: boolean; // Todos são textos
  blockType?: BlockType; // Se todos são o mesmo tipo de bloco
}

/**
 * Analisa uma seleção de elementos e retorna informações sobre a composição
 */
export function analyzeSelection(
  elements: IPowerElement[]
): MultiSelectionAnalysis {
  const categories = new Set<ElementCategory>();
  const types = new Set<string>();

  elements.forEach((el) => {
    categories.add(getElementCategory(el));
    types.add(el.type);
  });

  const isAllBlocks = categories.size === 1 && categories.has("block");
  const isAllShapes = categories.size === 1 && categories.has("shape");
  const isAllTexts = categories.size === 1 && categories.has("text");
  const isSameType = types.size === 1;
  const isMixed = categories.size > 1;

  return {
    count: elements.length,
    categories,
    types,
    isMixed,
    isSameType,
    isAllBlocks,
    isAllShapes,
    isAllTexts,
    blockType: isSameType && isAllBlocks ? (elements[0].type as BlockType) : undefined,
  };
}

/**
 * Verifica se deve mostrar uma propriedade específica baseado na análise
 */
export function shouldShowProperty(
  propertyName: string,
  analysis: MultiSelectionAnalysis
): boolean {
  // Regra 1: Tipos Misturados - Apenas mover, duplicar, excluir
  if (analysis.isMixed) {
    return false; // Não mostrar nenhuma propriedade além das básicas
  }

  // Propriedades sempre disponíveis para blocos (qualquer combinação)
  const blockCommonProperties = [
    "backgroundColor",
    "textColor",
    "borderColor",
    "textAlign",
    "contentAlign",
    "titleAlign",
    "paragraphAlign",
    "captionAlign",
    "canNavigate",
    "showTitleBorder",
    "showContentBorder",
    "showImageBorder",
  ];

  // Regra 2: Blocos (qualquer combinação de blocos diferentes)
  if (analysis.isAllBlocks && !analysis.isSameType) {
    return blockCommonProperties.includes(propertyName);
  }

  // Regra 3: Mesmo Tipo de Bloco
  if (analysis.isAllBlocks && analysis.isSameType) {
    // Propriedades específicas por tipo
    if (analysis.blockType === "informative-block" && propertyName === "icon") {
      return true;
    }
    if (
      analysis.blockType === "advanced-block" &&
      (propertyName === "imagePosition" || propertyName === "imageShape")
    ) {
      return true;
    }
    if (
      analysis.blockType === "section-block" &&
      (propertyName === "showTitleBorder" || propertyName === "showContentBorder")
    ) {
      return true;
    }
    if (
      analysis.blockType === "paragraph-block" &&
      propertyName === "showContentBorder"
    ) {
      return true;
    }
    if (
      analysis.blockType === "image-block" &&
      (propertyName === "captionAlign" || propertyName === "showImageBorder")
    ) {
      return true;
    }

    // Também mostrar propriedades comuns
    return blockCommonProperties.includes(propertyName);
  }

  // Regra 4: Formas (qualquer combinação)
  if (analysis.isAllShapes) {
    const shapeProperties = ["backgroundColor", "imageUrl", "canNavigate"];
    return shapeProperties.includes(propertyName);
  }

  // Regra 5: Textos Múltiplos
  if (analysis.isAllTexts) {
    const textProperties = [
      "fontSize",
      "fontWeight",
      "textColor",
      "textAlign",
      "canNavigate",
    ];
    return textProperties.includes(propertyName);
  }

  return false;
}

/**
 * Verifica se deve esconder a seção de imagem
 */
export function shouldHideImageSection(
  analysis: MultiSelectionAnalysis,
  isMultiSelection: boolean
): boolean {
  // NUNCA esconder imagens em formas (mesmo em multi-seleção)
  if (analysis.isAllShapes) {
    return false;
  }

  // Esconder imagens em blocos se houver multi-seleção
  if (analysis.isAllBlocks && isMultiSelection) {
    return true;
  }

  return false;
}

/**
 * Verifica se deve esconder resize handles
 */
export function shouldHideResizeHandles(isMultiSelection: boolean): boolean {
  // Esconder SEMPRE que houver multi-seleção
  return isMultiSelection;
}

/**
 * Obtém um valor comum de uma propriedade entre múltiplos elementos
 * Retorna undefined se os valores forem diferentes
 */
export function getCommonValue<T>(
  elements: IPowerElement[],
  propertyKey: keyof IPowerElement
): T | undefined {
  if (elements.length === 0) return undefined;

  const firstValue = elements[0][propertyKey] as T;

  // Verifica se todos os elementos têm o mesmo valor
  const allSame = elements.every((el) => el[propertyKey] === firstValue);

  return allSame ? firstValue : undefined;
}

/**
 * Obtém um placeholder apropriado quando há valores mistos
 */
export function getMixedValuePlaceholder(
  elements: IPowerElement[],
  propertyKey: keyof IPowerElement
): string {
  const commonValue = getCommonValue(elements, propertyKey);
  return commonValue !== undefined ? String(commonValue) : "Misto";
}
