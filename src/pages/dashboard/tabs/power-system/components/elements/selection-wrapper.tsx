interface PropsSelectionWrapper {
  x: number;
  y: number;
  width: number;
  height: number;
  isVisible: boolean;
}

/**
 * SelectionWrapper - Componente simplificado
 * Os elementos visuais agora estão no DraggableElementWrapper para melhor alinhamento
 * Este componente agora é apenas um container vazio mantido para compatibilidade
 */
export function SelectionWrapper({
  x,
  y,
  width,
  height,
  isVisible,
}: PropsSelectionWrapper) {
  // Não renderiza nada - os visuais estão no DraggableElementWrapper
  return null;
}
