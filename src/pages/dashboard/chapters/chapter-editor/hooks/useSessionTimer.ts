/**
 * Hook para rastrear tempo da sessão de escrita
 * Timer é GLOBAL para toda a sessão no editor (não reseta ao trocar de capítulo)
 */

import { useState, useEffect, useRef } from "react";

// Contador global para garantir IDs únicos mesmo com reutilização de componentes
let sessionCounter = 0;

/**
 * Rastreia o tempo de sessão em minutos
 * @returns tempo em minutos desde que o editor foi aberto e ID único da sessão
 */
export function useSessionTimer() {
  const [sessionMinutes, setSessionMinutes] = useState(0);
  const startTimeRef = useRef<Date>(new Date());
  const intervalRef = useRef<NodeJS.Timeout>();

  // ID único da sessão gerado a cada montagem do componente
  // Usado para armazenar avisos de tempo globalmente (não por capítulo)
  // IMPORTANTE: Incrementa contador global para garantir unicidade
  const [sessionId] = useState(() => {
    sessionCounter++;
    return `session-${Date.now()}-${sessionCounter}`;
  });

  useEffect(() => {
    // Reseta o tempo de início quando o componente monta
    startTimeRef.current = new Date();
    setSessionMinutes(0);

    // Atualiza a cada 30 segundos (para não sobrecarregar)
    intervalRef.current = setInterval(() => {
      const now = new Date();
      const diffMs = now.getTime() - startTimeRef.current.getTime();
      const diffMinutes = Math.floor(diffMs / 1000 / 60);
      setSessionMinutes(diffMinutes);
    }, 30000); // 30 segundos

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  /**
   * Reseta o timer da sessão
   */
  const resetSession = () => {
    startTimeRef.current = new Date();
    setSessionMinutes(0);
  };

  return {
    sessionMinutes,
    sessionId,
    resetSession,
  };
}
