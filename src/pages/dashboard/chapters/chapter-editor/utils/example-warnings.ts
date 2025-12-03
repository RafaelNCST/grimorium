/**
 * Utilitário para criar avisos de exemplo
 *
 * Este arquivo contém funções helper para adicionar avisos de exemplo
 * ao sistema de avisos do editor. Útil para demonstração e testes.
 */

import { WarningType, WarningSeverity } from "../types/warnings";

export interface AddWarningFunction {
  (
    type: WarningType,
    severity: WarningSeverity,
    title: string,
    message: string,
    action?: any
  ): string;
}

/**
 * Adiciona avisos de exemplo ao sistema
 */
export function addExampleWarnings(addWarning: AddWarningFunction) {
  // Avisos de Tipografia
  addWarning(
    "typography",
    "warning",
    "Espaçamento irregular detectado",
    "Foram encontrados múltiplos espaços consecutivos no parágrafo 3. Isso pode afetar a formatação.",
    { type: "highlight", data: { paragraph: 3 } }
  );

  addWarning(
    "typography",
    "info",
    "Fonte inconsistente",
    "A fonte utilizada difere do padrão do capítulo anterior. Considere manter consistência.",
    { type: "fix", data: { suggestedFont: "Inter" } }
  );

  // Avisos de Gramática
  addWarning(
    "grammar",
    "error",
    "Possível erro de concordância",
    'O verbo "foram" não concorda com o sujeito "o grupo". Sugestão: "foi".',
    { type: "fix", data: { original: "foram", suggestion: "foi" } }
  );

  addWarning(
    "grammar",
    "warning",
    "Repetição de palavras",
    'A palavra "realmente" aparece 3 vezes no mesmo parágrafo. Considere sinônimos.',
    { type: "highlight", data: { word: "realmente" } }
  );

  addWarning(
    "grammar",
    "info",
    "Pontuação sugerida",
    "Pode ser interessante adicionar uma vírgula após 'No entanto' para melhor clareza.",
    { type: "navigate", data: { position: 450 } }
  );

  // Avisos de Metas
  addWarning(
    "goals",
    "info",
    "Meta de palavras atingida",
    "Parabéns! Você atingiu sua meta de 2.000 palavras para este capítulo.",
    { type: "custom", data: { celebration: true } }
  );

  addWarning(
    "goals",
    "warning",
    "Prazo se aproximando",
    "Faltam 3 dias para o prazo definido para este capítulo. Considere revisar seu progresso.",
    { type: "navigate", data: { section: "deadline" } }
  );

  // Avisos de Limites
  addWarning(
    "limits",
    "error",
    "Limite de caracteres excedido",
    "Este capítulo excede o limite de 5.000 caracteres em 234 caracteres. Considere reduzir o conteúdo.",
    { type: "navigate", data: { section: "stats" } }
  );

  addWarning(
    "limits",
    "warning",
    "Parágrafo muito longo",
    "O 5º parágrafo tem mais de 500 palavras. Considere dividi-lo para melhor legibilidade.",
    { type: "highlight", data: { paragraph: 5 } }
  );

  addWarning(
    "limits",
    "info",
    "Diálogos excessivos",
    "Este capítulo tem 70% de diálogos. Considere adicionar mais descrições para equilíbrio.",
    { type: "custom", data: { metric: "dialogue-ratio" } }
  );
}

/**
 * Adiciona um aviso de exemplo específico por tipo
 */
export function addWarningByType(
  addWarning: AddWarningFunction,
  type: WarningType
) {
  switch (type) {
    case "typography":
      addWarning(
        "typography",
        "warning",
        "Formatação inconsistente",
        "Foram detectadas inconsistências na formatação do texto.",
        { type: "highlight", data: {} }
      );
      break;

    case "grammar":
      addWarning(
        "grammar",
        "error",
        "Erro gramatical detectado",
        "Um possível erro gramatical foi encontrado no texto.",
        { type: "fix", data: {} }
      );
      break;

    case "goals":
      addWarning(
        "goals",
        "info",
        "Atualização de meta",
        "Uma meta do seu capítulo foi atualizada ou atingida.",
        { type: "navigate", data: {} }
      );
      break;

    case "limits":
      addWarning(
        "limits",
        "warning",
        "Limite atingido",
        "Um dos limites definidos para o capítulo foi atingido.",
        { type: "custom", data: {} }
      );
      break;
  }
}
