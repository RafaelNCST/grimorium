// Element Types
export type ElementType =
  | 'basic-section'      // Seção Básica: Retangular, título + descrição
  | 'detailed-section'   // Seção Detalhada: Retangular, título + subtítulo + imagem circular + descrição
  | 'visual-section'     // Seção Visual: Formas variadas, imagem ou cor, hover card
  | 'text';              // Texto: Caixa de texto livre sem fundo

// Shape Types (para visual-section)
export type ShapeType =
  | 'circle'           // Circular (padrão)
  | 'square'           // Quadrado
  | 'rounded-square'   // Quadrado arredondado
  | 'triangle'         // Triângulo
  | 'diamond';         // Losango

// Connection Types
export type ConnectionType =
  | 'arrow'  // Seta: Sai de um elemento, aponta para qualquer lugar
  | 'line';  // Ligação: Conecta dois elementos específicos

// Tool Types for Toolbar
export type ToolType =
  | 'select'           // Ferramenta de seleção (padrão)
  | 'hand'             // Ferramenta mão - Apenas navegar/arrastar canvas
  | 'basic-section'    // Criar seção básica
  | 'detailed-section' // Criar seção detalhada
  | 'circle'           // Criar forma circular
  | 'square'           // Criar forma quadrada
  | 'diamond'          // Criar forma losango
  | 'text'             // Criar texto
  | 'arrow'            // Criar seta
  | 'line';            // Criar linha

// Base Element Interface
interface IBaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;

  // Navegação
  canNavigate: boolean;  // Se clicável para abrir submapa
  submapId?: string;     // ID do submapa associado

  // Metadata
  createdAt: number;
  updatedAt: number;
}

// Seção Básica: Título + Descrição
export interface IBasicSection extends IBaseElement {
  type: 'basic-section';
  title: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  wasManuallyResized?: boolean;  // Se foi redimensionado manualmente
  fontScale?: number;             // Escala de fonte (1.0 = padrão, limites: 8-64px)
}

// Seção Detalhada: Título + Subtítulo + Imagem Circular + Descrição
export interface IDetailedSection extends IBaseElement {
  type: 'detailed-section';
  title: string;
  subtitle: string;
  description: string;
  imageUrl?: string;        // Imagem circular (opcional)
  backgroundColor: string;
  textColor: string;
  wasManuallyResized?: boolean;  // Se foi redimensionado manualmente
  fontScale?: number;             // Escala de fonte (1.0 = padrão, limites: 8-64px)
}

// Seção Visual: Formas variadas com imagem ou cor
export interface IVisualSection extends IBaseElement {
  type: 'visual-section';
  shape: ShapeType;
  imageUrl?: string;        // Se tiver imagem, usa a imagem
  backgroundColor?: string;  // Se não tiver imagem, usa cor sólida

  // Hover card (opcional)
  showHoverCard: boolean;
  hoverTitle?: string;
  hoverSubtitle?: string;
  hoverDescription?: string;
}

// Texto: Caixa de texto livre
export interface ITextElement extends IBaseElement {
  type: 'text';
  content: string;
  textColor: string;
  fontSize: number;        // Tamanho da fonte (8-64)
  fontWeight: 'normal' | 'bold' | 'underline';
  textAlign: 'left' | 'center' | 'right' | 'justify';
  wasManuallyResized?: boolean; // Flag para saber se foi redimensionado manualmente
}

// Union type para todos os elementos
export type IPowerElement =
  | IBasicSection
  | IDetailedSection
  | IVisualSection
  | ITextElement;

// Connection Interface
export interface IConnection {
  id: string;
  type: ConnectionType;

  // Arrow: sai de um elemento, aponta para coordenadas
  // Line: conecta dois elementos
  fromElementId: string;
  toElementId?: string;  // Opcional: se undefined, é uma seta livre
  toX?: number;          // Opcional: coordenadas de destino para setas livres
  toY?: number;

  // Aparência
  color: string;
  strokeWidth: number;
  label?: string;        // Texto opcional na conexão

  // Metadata
  createdAt: number;
}

// Canvas/Map Interface
export interface IPowerMap {
  id: string;
  bookId: string;        // Referência ao livro
  name: string;

  // Configurações
  gridEnabled: boolean;
  gridSize: number;      // Tamanho do grid para snap (padrão: 20px)

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
export function isBasicSection(element: IPowerElement): element is IBasicSection {
  return element.type === 'basic-section';
}

export function isDetailedSection(element: IPowerElement): element is IDetailedSection {
  return element.type === 'detailed-section';
}

export function isVisualSection(element: IPowerElement): element is IVisualSection {
  return element.type === 'visual-section';
}

export function isTextElement(element: IPowerElement): element is ITextElement {
  return element.type === 'text';
}

export function isArrowConnection(connection: IConnection): boolean {
  return connection.type === 'arrow';
}

export function isLineConnection(connection: IConnection): boolean {
  return connection.type === 'line';
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
