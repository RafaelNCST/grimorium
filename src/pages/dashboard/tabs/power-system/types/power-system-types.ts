// Element Types
export type ElementType =
  | "paragraph-block" // Bloco de Parágrafo: Retangular, área de parágrafo editável
  | "section-block" // Bloco de Sessão: Retangular, título + área de parágrafo editável
  | "image-block" // Bloco de Imagem: Retangular, imagem + legenda editável
  | "visual-section" // Seção Visual: Formas variadas, imagem ou cor, hover card
  | "text"; // Texto: Caixa de texto livre sem fundo

// Shape Types (para visual-section)
export type ShapeType =
  | "circle" // Circular (padrão)
  | "square" // Quadrado
  | "rounded-square" // Quadrado arredondado
  | "triangle" // Triângulo
  | "diamond"; // Losango

// Connection Types
export type ConnectionType =
  | "arrow" // Seta: Sai de um elemento, aponta para qualquer lugar
  | "line"; // Ligação: Conecta dois elementos específicos

// Tool Types for Toolbar
export type ToolType =
  | "select" // Ferramenta de seleção (padrão)
  | "hand" // Ferramenta mão - Apenas navegar/arrastar canvas
  | "paragraph-block" // Criar bloco de parágrafo
  | "section-block" // Criar bloco de sessão
  | "image-block" // Criar bloco de imagem
  | "circle" // Criar forma circular
  | "square" // Criar forma quadrada
  | "diamond" // Criar forma losango
  | "text" // Criar texto
  | "arrow" // Criar seta
  | "line"; // Criar linha

// Base Element Interface
interface IBaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;

  // Navegação
  canNavigate: boolean; // Se clicável para abrir submapa
  submapId?: string; // ID do submapa associado

  // Metadata
  createdAt: number;
  updatedAt: number;
}

// Bloco de Parágrafo: Área de parágrafo editável
export interface IParagraphBlock extends IBaseElement {
  type: "paragraph-block";
  content: string;
  backgroundColor: string;
  textColor: string;
  borderColor?: string; // Cor da borda interna
  fontSize: number; // Tamanho da fonte (padrão: 16px)
  textAlign: "left" | "center" | "right" | "justify";
  showContentBorder?: boolean; // Se true, mostra borda do conteúdo (padrão: true)
}

// Bloco de Sessão: Título + Área de parágrafo editável
export interface ISectionBlock extends IBaseElement {
  type: "section-block";
  title: string;
  content: string;
  backgroundColor: string;
  textColor: string;
  borderColor?: string; // Cor da borda interna
  titleFontSize: number; // Tamanho da fonte do título (padrão: 24px)
  contentFontSize: number; // Tamanho da fonte do conteúdo (padrão: 16px)
  titleAlign: "left" | "center" | "right" | "justify";
  contentAlign: "left" | "center" | "right" | "justify";
  showTitleBorder?: boolean; // Se true, mostra borda do título (padrão: true)
  showContentBorder?: boolean; // Se true, mostra borda do conteúdo (padrão: true)
}

// Bloco de Imagem: Imagem + Legenda editável
export interface IImageBlock extends IBaseElement {
  type: "image-block";
  imageUrl?: string; // URL da imagem
  imageMode?: "fill" | "fit" | "tile" | "crop"; // Modo de exibição da imagem (padrão: fill)
  imageOffsetX?: number; // Deslocamento horizontal da imagem para enquadramento (usado em modo crop)
  imageOffsetY?: number; // Deslocamento vertical da imagem para enquadramento (usado em modo crop)
  imageAreaHeight?: number; // Altura customizada da área da imagem em pixels (padrão: 300px, range: 200-1200px)
  caption: string; // Legenda da imagem
  backgroundColor: string;
  textColor: string;
  borderColor?: string; // Cor da borda interna
  captionAlign: "left" | "center" | "right" | "justify";
  captionFontSize: number; // Tamanho da fonte da legenda (padrão: 16px)
  showCaptionBorder?: boolean; // Se true, mostra borda da legenda (padrão: true)
}

// Seção Visual: Formas variadas com imagem ou cor
export interface IVisualSection extends IBaseElement {
  type: "visual-section";
  shape: ShapeType;
  imageUrl?: string; // Se tiver imagem, usa a imagem
  backgroundColor?: string; // Se não tiver imagem, usa cor sólida

  // Hover card (opcional)
  showHoverCard: boolean;
  hoverTitle?: string;
  hoverSubtitle?: string;
  hoverDescription?: string;
}

// Texto: Caixa de texto livre
export interface ITextElement extends IBaseElement {
  type: "text";
  content: string;
  textColor: string;
  fontSize: number; // Tamanho da fonte (8-64)
  fontWeight: "normal" | "bold" | "underline";
  textAlign: "left" | "center" | "right" | "justify";
  wasManuallyResized?: boolean; // Flag para saber se foi redimensionado manualmente
}

// Union type para todos os elementos
export type IPowerElement =
  | IParagraphBlock
  | ISectionBlock
  | IImageBlock
  | IVisualSection
  | ITextElement;

// Connection Interface
export interface IConnection {
  id: string;
  type: ConnectionType;

  // Arrow: sai de um elemento, aponta para coordenadas
  // Line: conecta dois elementos
  fromElementId: string;
  toElementId?: string; // Opcional: se undefined, é uma seta livre
  toX?: number; // Opcional: coordenadas de destino para setas livres
  toY?: number;

  // Aparência
  color: string;
  strokeWidth: number;
  label?: string; // Texto opcional na conexão

  // Metadata
  createdAt: number;
}

// Canvas/Map Interface
export interface IPowerMap {
  id: string;
  bookId: string; // Referência ao livro
  name: string;

  // Configurações
  gridEnabled: boolean;
  gridSize: number; // Tamanho do grid para snap (padrão: 20px)

  // Elementos
  elements: IPowerElement[];
  connections: IConnection[];

  // Navegação em profundidade
  parentMapId?: string;

  // Metadata
  createdAt: number;
  updatedAt: number;
}

// Template Interface
export interface ITemplate {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  elements: IPowerElement[];
  connections: IConnection[];
  createdAt: number;
}

// UI State Types
export interface IViewportState {
  x: number;
  y: number;
  zoom: number;
}

export interface IToolbarState {
  activeTool: ToolType;
  gridEnabled: boolean;
}

export interface ISelectionState {
  selectedElementIds: string[];
  selectedConnectionIds: string[];
}

// Selection Box Interface (for drag selection)
export interface ISelectionBox {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

// Type Guards
export function isParagraphBlock(
  element: IPowerElement
): element is IParagraphBlock {
  return element.type === "paragraph-block";
}

export function isSectionBlock(
  element: IPowerElement
): element is ISectionBlock {
  return element.type === "section-block";
}

export function isImageBlock(
  element: IPowerElement
): element is IImageBlock {
  return element.type === "image-block";
}

export function isVisualSection(
  element: IPowerElement
): element is IVisualSection {
  return element.type === "visual-section";
}

export function isTextElement(element: IPowerElement): element is ITextElement {
  return element.type === "text";
}

export function isArrowConnection(connection: IConnection): boolean {
  return connection.type === "arrow";
}

export function isLineConnection(connection: IConnection): boolean {
  return connection.type === "line";
}

// Helper Types
export interface ICreateElementOptions {
  type: ElementType;
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export interface IUpdateElementOptions {
  id: string;
  updates: Partial<IPowerElement>;
}

export interface ICreateConnectionOptions {
  type: ConnectionType;
  fromElementId: string;
  toElementId?: string;
  toX?: number;
  toY?: number;
  color?: string;
}
